## 开发环境搭建

使用Rollup进行打包。

```bash
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D
```

rollup.config.js:

```js
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js',
    output: {
        format: 'umd', // 模块化类型
        file: 'dist/umd/vue.js', 
        name: 'Vue', // 打包后的全局变量的名字
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        process.env.ENV === 'development'?serve({
            open: true,
            openPage: '/public/index.html',
            port: 3000,
            contentBase: ''
        }):null
    ]
}
```



.babelrc

```
{
    "presets": [
        "@babel/preset-env"
    ]
}
```





package.json:

```json
"scripts": {
    "build:dev": "rollup -c",
    "serve": "cross-env ENV=development rollup -c -w"
}
```





## 数据劫持

src/index.js：

```js
import { initMixin } from './init';

function Vue(options) {
  this._init(options);
}
initMixin(Vue); // 给原型上新增_init方法
export default Vue;
```



init.js:

```js
import {initState} from './state';

export function initMixin(Vue){
  Vue.prototype._init = function (options) {
    const vm  = this;
    vm.$options = options  // 将用户编写的options挂载到Vue实例对象上
    
    // 初始化状态
    initState(vm)
  }
}
```



state.js:·

```js
export function initState(vm){
  const opts = vm.$options;
  if(opts.props){
    initProps(vm);
  }
  
  if(opts.methods){
    initMethod(vm);
  }
  
  if(opts.data){
    // 初始化data
    initData(vm);
  }
  
  if(opts.computed){
    initComputed(vm);
  }
  
  if(opts.watch){
    initWatch(vm);
  }
  
}
function initProps(){}
function initMethod(){}
function initData(){}
function initComputed(){}
function initWatch(){}
```



初始化data：

```js
import {observe} from './observer/index.js'

function initData(vm){
  let data = vm.$options.data;
	// data可以是一个函数或者对象
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  
  observe(data);
}
```



对对象类型进行数据劫持

observer/index.js：

```js
class Observer { 
  
  constructor(value){
    this.walk(value);
  }
  
  walk(data){ // 让对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for(let i = 0; i < keys.length; i++){
      let key = keys[i];
      let value = data[key];
      defineReactive(data,key,value);
    }
  }
}

function defineReactive(data,key,value){
  // 如果data中的某个属性是引用类型的数据，则添加劫持能力
  observe(value);
  Object.defineProperty(data,key,{
    get(){
      return value
    },
    set(newValue){
      if(newValue == value) return;
      // 如果新设置的value是引用类型的数据，则添加劫持能力
      observe(newValue);
      value = newValue
    }
  })
}

export function observe(data) {
  if(typeof data !== 'object' || data == null){
    return;
  }

  return new Observer(data);
}
```



对数组的方法进行数据劫持：

observer/index.js：

```js
import {arrayMethods} from './array';

class Observer { // 观测值
  constructor(value){
    // 给每一个被添加数据劫持能力的数据增加一个额外的自定义属性
    Object.defineProperty(value,'__ob__',{
      enumerable:false,
      configurable:false,
      value:this
    });

    if(Array.isArray(value)){
      value.__proto__ = arrayMethods; // 重写数组原型方法
      // 同对于对象中的每一个元素项是引用类型的数据是，继续添加元素项的数据劫持能力
      this.observeArray(value);
    }else{
      this.walk(value);
    }
  }
  
  observeArray(value){
    for(let i = 0 ; i < value.length ;i ++){
      observe(value[i]);
    }
  }
}
```



array.js:

```js
let oldArrayProtoMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
];
methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayProtoMethods[method].apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break;
    }
    // 对新增的每一项尝试增加数据劫持的能力
    if (inserted) ob.observeArray(inserted); 
    
    return result
  }
})
```





数据代码：

```js
function proxy(vm,source,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key];
    },
    set(newValue){
      vm[source][key] = newValue;
    }
  });
}

function initData(vm){
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  for(let key in data){ // 将_data上的属性全部代理给vm实例
    proxy(vm,'_data',key)
  }
  observe(data);
}
```





## 模板编译

```js
Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = options;
  // 初始化状态,为数据添加数据劫持的能力
  initState(vm);

  // 页面挂载
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

Vue.prototype.$mount = function (el) {
  const vm = this;
  const options = vm.$options;
  el = document.querySelector(el);

  // 如果没有render方法
  if (!options.render) {
    let template = options.template;
    // 如果没有模板但是有el
    if (!template && el) {
      template = el.outerHTML;
    }
    const render= compileToFunctions(template);
    options.render = render;
  }
}
```



vue模板解析：

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


let root;
let currentParent;
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function start(tagName,attrs){
  console.log(tagName,attrs)
}

function end(tagName){
  console.log(tagName)
}

function chars(text){
  console.log(text);
}
function parseHTML(html){
  while(html){
    // 寻找字符串中下一个 < 的位置，以确定下一个标签的开始或文本内容的结束。
    let textEnd = html.indexOf('<');
    if(textEnd == 0){
      // 以<符号开头表示可能是一个标签的开始
      const startTagMatch = parseStartTag();

      // 如果成功解析到开始标签对应的token，则将他传为start
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs);
        continue;
      }

      // 虽然以<开头，但是实际是结束标签时
      const endTagMatch = html.match(endTag);
      if(endTagMatch){
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }

    // 如果不是<符号开头,则开始尝试解析文本
    let text;
    if(textEnd >= 0){
      text = html.substring(0,textEnd);
    }
    if(text){
      advance(text.length);
      chars(text);
    }
  }

  function advance(n){
    html = html.substring(n);
  }

  function parseStartTag(){
    // 匹配开始标签
    const start = html.match(startTagOpen);

    if(start){
      // 创建一个开始标签对应token
      const match = {
        tagName:start[1],
        attrs:[]
      }
      // 截取掉开始标签
      advance(start[0].length);

      // 解析开始标签可能对应的标签属性 ，并将他们收集到标签token的attrs属性中
      let attr,end;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
        advance(attr[0].length);
        match.attrs.push({name:attr[1],value:attr[3]});
      }

      // 匹配到结束标签后，截取掉结束标签并返回该标签对应的token
      if(end){
        advance(end[0].length);
        return match
      }
    }
  }
}

export function compileToFunctions(template){
  parseHTML(template); // 解析器函数处理后，将处理结果存放在了root这个ast树中了
  
  let code = generate(root);
  let render = `with(this){return ${code}}`;
  let renderFn = new Function(render);
  return renderFn
}
```

上面是一个简单的 HTML 解析器，用于解析 HTML 字符串，并对其中的标签、属性和文本内容进行操作。模仿一些虚拟 DOM 库中的 HTML 解析过程，比如 Vue.js 的模板编译过程。具体来说，代码的功能如下：

1. **正则表达式定义：** 定义了几个正则表达式来匹配 HTML 中的不同部分，如标签名、属性和结束标签等。
2. **解析函数：** `parseHTML` 函数是主要的解析函数，它逐字符分析 HTML 字符串，根据不同的条件执行不同的逻辑，如识别开始标签、结束标签、属性和文本内容。
3. **处理标签和文本：** 当解析到开始标签时，`parseStartTag` 函数会被调用，解析标签名和属性，并将这些信息传递给 `start` 函数。类似地，当遇到结束标签和文本内容时，会调用 `end` 和 `chars` 函数。
4. **状态推进：** `advance` 函数用于推进 HTML 字符串的解析位置，帮助逐步减少字符串长度，逐个分析标签和文本。
5. **模板到函数的编译：** `compileToFunctions` 函数提供了一个接口，它接收一个 HTML 模板字符串，调用 `parseHTML` 进行解析，最终返回一个函数。虽然返回的函数在这个示例中不执行任何操作，但在实际应用中，这个函数可能会被设计为根据解析出的标签和属性创建虚拟 DOM 或执行其他操作。

总之，这段代码的核心功能是将 HTML 字符串解析成标签、属性和文本，并通过特定的函数对这些元素进行进一步的处理，这是许多前端框架在处理模板时的基本步骤之一。



生成抽象语法树节点：

```js
let root;
let currentParent;
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement(tagName,attrs){
  return {
    tag:tagName,
    type:ELEMENT_TYPE,
    children:[],
    attrs,
    parent:null
  }
}
function start(tagName, attrs) {
  let element = createASTElement(tagName,attrs);
  if(!root){
    root = element;
  }
  currentParent = element;
  stack.push(element);
}
function end(tagName) {
  let element = stack.pop();
  currentParent = stack[stack.length-1];
  if(currentParent){
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}
function chars(text) {
  text = text.replace(/\s/g,'');
  if(text){
    currentParent.children.push({
      type:TEXT_TYPE,
      text
    })
  }
}
```



generate.js：

```js
function gen(node) {
    if (node.type == 1) {
        return generate(node);
    } else {
        let text = node.text
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`
        }
        let lastIndex = defaultTagRE.lastIndex = 0
        let tokens = [];
        let match,index;
        
        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)));
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length;
        }
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`;
    }
}
function getChildren(el) { // 生成儿子节点
    const children = el.children;
    if (children) {
        return `${children.map(c=>gen(c)).join(',')}`
    } else {
        return false;
    }
}
function genProps(attrs){ // 生成属性
    let str = '';
    for(let i = 0; i<attrs.length; i++){
        let attr = attrs[i];
        if(attr.name === 'style'){
            let obj = {}
            attr.value.split(';').forEach(item=>{
                let [key,value] = item.split(':');
                obj[key] = value;
            })
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0,-1)}}`;
}

// el就是html解析器生成的vue模板对象ast对象
export function generate(el) {
    let children = getChildren(el);
    let code = `_c('${el.tag}',${
        el.attrs.length?`${genProps(el.attrs)}`:'undefined'
    }${
        children? `,${children}`:''
    })`;
    return code;
}
```

generate函数的产出结果如下：

```js
输入：
  <div style="color:red">hello {{name}} <span></span></div>
  
  
输出：
render(){
   return _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
}
```





## 创建渲染watcher

开始于：

```diff
Vue.prototype.$mount = function (el) {
  const vm = this;
  const options = vm.$options;
  el = document.querySelector(el);

  // 如果没有render方法
  if (!options.render) {
    let template = options.template;
    // 如果没有模板但是有el
    if (!template && el) {
      template = el.outerHTML;
    }

    const render= compileToFunctions(template);
    options.render = render;
  }
+   mountComponent(vm,el);
}
```



lifecycle.js：

```js


export function mountComponent(vm, el) {
  vm.$el = el;
  let updateComponent = () => {
    // 将虚拟节点 渲染到页面上
    vm._update(vm._render());
  }
  new Watcher(vm, updateComponent, () => {}, true);
}
```



render.js：

```js
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {}
}

export function renderMixin(Vue){
  Vue.prototype._render = function () {}
}
```

\_render`方法生成虚拟`dom`,通过`\_update`方法将虚拟`dom`创建成真实的`dom。



watcher.js：

```js
let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn; // 内部是对Vue实例对象_update和_render的调用
    if (typeof exprOrFn == 'function') {
      this.getter = exprOrFn;
    }
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.get();
  }
  get() {
    this.getter();
  }
}

export default Watcher;
```





```js
let uid = 0;

class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    // vm._watchers 存储这个组件的所有 watcher
    vm._watchers.push(this);

    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid; // 唯一标识
    this.active = true;
    this.dirty = this.lazy; // 对于计算属性来说，表示“脏”，需要被重新计算
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression = expOrFn.toString();
    // ...

    // 如果不是 lazy watcher，立即求值
    if (!this.lazy) {
      this.value = this.get();
    }
  }

  // ... 其他方法
}
```



- `vm`: 当前 Vue 实例，`Watcher` 被绑定在此实例上。
- `expOrFn`: 被观察的表达式或函数。
- `cb`: 数据变化时的回调函数。
- `options`: 创建 `Watcher` 时传递的选项。
- `isRenderWatcher`: 标记是否是渲染函数的 `Watcher`。
- `id`: `Watcher` 的唯一标识符。
- `active`: 表示这个 `Watcher` 是否是激活状态。
- `dirty`: 对于计算属性来说，标记其是否需要重新求值。
- `deps` 和 `newDeps`: 存储当前和新的依赖项（依赖的数据源）。
- `depIds` 和 `newDepIds`: 存储 `deps` 和 `newDeps` 的 ID，以避免重复收集依赖。



生成虚拟DOM

```js
import {createTextNode,createElement} from './vdom/create-element'

export function renderMixin(Vue){
  Vue.prototype._v = function (text) { // 创建文本
    return createTextNode(text);
  }
  Vue.prototype._c = function () { // 创建元素
    return createElement(...arguments);
  }
  Vue.prototype._s = function (val) {
    return val == null? '' : (typeof val === 'object'?JSON.stringify(val):val);
  }
  
  Vue.prototype._render = function () {
    const vm = this;
    const {render} = vm.$options;
    let vnode = render.call(vm);  // 执行options中的render函数得到VNode
    return vnode;
  }
}
```



创建虚拟DOM节点：

```js
export function createTextNode(text) {
  return vnode(undefined,undefined,undefined,undefined,text)
}
export function createElement(tag,data={},...children){
  let key = data.key;
  if(key){
    delete data.key;
  }
  return vnode(tag,data,key,children);
}
function vnode(tag,data,key,children,text){
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
```





一个 `VNode` 实例通常包含以下属性：

```js
class VNode {
  constructor(
  tag,        // 标签名
   data,       // 与当前节点相关的数据对象，包括属性、指令等
   children,   // 当前节点的子节点
   text,       // 文本内容
   elm,        // 对应的真实 DOM 元素
   context,    // 指向创建这个 vnode 的 Vue 组件实例
   componentOptions, // 组件 vnode 特有的选项参数
   key         // 节点的唯一键，用于优化
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined; // 命名空间
    this.context = context;
    this.functionalContext = undefined;
    this.functionalOptions = undefined;
    this.functionalScopeId = undefined;
    this.key = key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined; // 组件实例
    this.parent = undefined; // 父 vnode
    this.raw = false; // 是否为原生HTML或只是普通文本
    this.isStatic = false; // 静态节点标志
    this.isRootInsert = true; // 是否作为根节点插入
    this.isComment = false; // 是否是注释节点
    this.isCloned = false; // 是否是克隆节点
    this.isOnce = false; // 是否有 v-once 指令
    this.asyncFactory = undefined; // 异步组件工厂函数
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  }

  // 静态方法或实例方法...
}
```



\_update方法：将虚拟DOM生成真是DOM

```js
import {patch} './observer/patch'

export function lifecycleMixin(Vue){
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el,vnode);
  }
}


export function patch(oldVnode,vnode){
  const isRealElement = oldVnode.nodeType;
  if(isRealElement){
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;

    let el = createElm(vnode); // 基于虚拟DOM生成真实DOM
    parentElm.insertBefore(el,oldElm.nextSibling);
    parentElm.removeChild(oldVnode)
    return el;
  } 
}
function createElm(vnode){
  let {tag,children,key,data,text} = vnode;
  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach(child => { 
      return vnode.el.appendChild(createElm(child));
    });
  }else{
    vnode.el = document.createTextNode(text);
  }
  return vnode.el
}
function updateProperties(vnode){
  let newProps = vnode.data || {}; // 获取当前老节点中的属性 
  let el = vnode.el; // 当前的真实节点
  for(let key in newProps){
    if(key === 'style'){ 
      for(let styleName in newProps.style){
        el.style[styleName] = newProps.style[styleName]
      }
    }else if(key === 'class'){
      el.className= newProps.class
    }else{ // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key,newProps[key]);
    }
  }
}
```





## Mixni原理

Mixni方法本质是Vue构造函数上的一个静态方法。

Vue 中的 Mixin 机制允许开发者定义被多个组件共享的方法、计算属性、生命周期钩子等选项。当一个 mixin 被使用时，它的选项将被“混入”到组件的选项中。这种机制有助于代码的复用，尤其是在处理多个组件需要共享相同功能时。

Mixin 的原理主要基于 JavaScript 的对象合并策略。当组件和 mixin 包含相同选项时，这些选项将以特定的方式合并到组件中。Vue 内部使用的合并策略如下：

1. **数据对象** (`data`): 组件和 mixin 中的 `data` 对象会被合并。如果有冲突，组件中的数据优先级更高。
2. **生命周期钩子**：组件和 mixin 中的生命周期钩子函数会被合并到一个数组中，且 mixin 中的钩子函数会**先于**组件中的钩子函数被调用。
3. **方法** (`methods`), **计算属性** (`computed`), 和 **侦听器** (`watch`): 如果组件和 mixin 包含相同名称的方法、计算属性或侦听器，组件中的选项将优先。
4. **组件选项**：如 `components`, `directives` 和 `filters` 等选项会被合并。如果有冲突，组件中的选项优先。
5. **自定义选项**: 对于自定义选项，Vue 允许通过全局 `Vue.config.optionMergeStrategies` 来定义自定义合并策略。



```js
import {mergeOptions} from '../util/index.js'

export function initGlobalAPI(Vue){
  Vue.options = {};

  Vue.mixin = function (mixin) {
    // 将属性合并到Vue.options上
    this.options = mergeOptions(this.options,mixin);
    return this;
  }
}
```



**合并生命周期**:

```js
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

const strats = {};
function mergeHook(parentVal, childValue) {
  if (childValue) {
    if (parentVal) {
      return parentVal.concat(childValue);
    } else {
      return [childValue]
    }
  } else {
    return parentVal;
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      if (typeof parent[key] == 'object' && typeof child[key] == 'object') {
        options[key] = {
          ...parent[key],
          ...child[key]
        }
      }else{
        options[key] = child[key];
      }
    }
  }
  return options
}
```





生命周期调用：

```js
Vue.prototype._init = function (options) {
  const vm = this;
  // 将来自Vue构造函数事先混入的option中的属性和vue实例对象上的options进行混合
  vm.$options = mergeOptions(vm.constructor.options,options);

  // 调用生命周期函数
  callHook(vm,'beforeCreate');
  initState(vm);
  callHook(vm,'created');
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}


export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}
```



## 依赖收集

每个属性都要有一个`dep`,每个`dep`中存放着`watcher`,同一个`watcher`会被多个`dep`所记录。

```js
class Watcher{
  constructor(){
    // ...
    this.deps = [];
    this.depsId = new Set();
  }
  get(){
    pushTarget(this);
    this.getter(); // 这个函数一执行就会触发响应式数据的拦截方法
    popTarget();
  }

  addDep(dep){
    let id = dep.id;
    if(!this.depsId.has(id)){
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  update(){
    this.get();
  }
}
```





Dep：

```js
let id = 0;
class Dep{
  constructor(){
    this.id = id++;
    this.subs = [];
  }
  depend(){
    if(Dep.target){
      Dep.target.addDep(this);// 让watcher,去存放dep
    }
  }
  notify(){
    this.subs.forEach(watcher=>watcher.update());
  }
  addSub(watcher){
    this.subs.push(watcher);
  }
}
let stack = [];
export function pushTarget(watcher){
  Dep.target = watcher;
  stack.push(watcher);
}
export function popTarget(){
  stack.pop();
  Dep.target = stack[stack.length-1];
}
export default Dep;
```



响应式数据中拦截函数的逻辑增加：

```js
let dep = new Dep();
Object.defineProperty(data, key, {
  get() {
    if(Dep.target){ // 如果取值时有watcher
      dep.depend(); // 让watcher保存dep，并且让dep 保存watcher
    }
    return value
  },
  set(newValue) {
    if (newValue == value) return;
    observe(newValue);
    value = newValue;
    dep.notify(); // 通知渲染watcher去更新
  }
});
```



数组依赖收集

```js
this.dep = new Dep(); // 专门为数组设计的
if (Array.isArray(value)) {
  value.__proto__ = arrayMethods;
  this.observeArray(value);
} else {
  this.walk(value);
}	

function defineReactive(data, key, value) {
  let childOb = observe(value);
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target){
        dep.depend();
        if(childOb){ 
          childOb.dep.depend(); // 收集数组依赖
        }
      }
      return value
    },
    set(newValue) {
      if (newValue == value) return;
      observe(newValue);
      value = newValue;
      dep.notify();
    }
  })
}


arrayMethods[method] = function (...args) {
  // ...
  ob.dep.notify()
  return result;
}
```





## nextTick原理

```js
update(){
  queueWatcher(this);
}
```



```js
import {
  nextTick
} from '../util/next-tick'
let has = {};
let queue = [];

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i];
    watcher.run()
  }
  queue = [];
  has = {}
}
let pending = false
export function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);
    if(!pending){
      nextTick(flushSchedulerQueue)
      pending = true;
    }
  }
}
```







```js
let callbacks = [];
function flushCallbacks() {
  callbacks.forEach(cb => cb());
}

let timerFunc;
if (Promise) { // then方法是异步的
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
}else if (MutationObserver) { // MutationObserver 也是一个异步方法
  let observe = new MutationObserver(flushCallbacks); // H5的api
  let textNode = document.createTextNode(1);
  observe.observe(textNode, {
    characterData: true
  });
  timerFunc = () => {
    textNode.textContent = 2;
  }
}else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}else{
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}

export function nextTick(cb) {
  // 将传给nextTick的函数同步的追加到队列中
  callbacks.push(cb);
  
  // 采用优雅降级的方式实现异步执行
  timerFunc();
}
```





![image-20240318150917070](D:\learn-notes\vue\images\image-20240318150917070.png)



















