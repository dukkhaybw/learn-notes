# Vue2.0 源码

## Day01

Vue2 响应式原理，模板编译，虚拟 DOM 原理，Vue 初渲染流程。

- 使用 Rollup 搭建开发环境
- Vue 响应式原理实现，对象的属性劫持（面试）
- 实现对数组方法的劫持（面试）
- 模板编译原理（类似于 html 的模板），将模板转为 AST 语法树
- AST 语法树生产 render 方法，render 方法执行 生成虚拟 DOM
- 虚拟 DOM 生成真实 DOM

### Rollup 打包环境搭建

rollup：打包工具专门用于 JavaScript 类库的打包，因为打包体积远小于 webpack5 和专注。

rollup-plugin-babel：在编写 JavaScript 库时会用到 ES6 以后的高级语法，所以需要借助 babel 转化语法。

@babel/core：Babel 的使用依赖于 Babel 的核心模块。

@babel/preset-env：Babel/core 需要将高级语法转为 es5 语法需要用到不同的插件,该包是各种 babel 插件的集合体

```shell
npm init -y

npm install rollup rollup-plugin-babel @babel/core @babel/preset-env -D
```

### rollup 打包项目的配置文件

rollup.config.js:

```js
import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  output: {
    file: './dist/vue.js',
    name: 'Vue', // 在浏览器环境下全局添加一个变量叫Vue
    format: 'umd', // 打包格式，一般有：es6,commonjs，iife，umnd（commonjs,amd）
    sourcemap: true //开启源码调试
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
```

package.json:

```json
"script":{
    "dev":"rollup -cw"     // c 表示使用配置文件， w表示监听项目的文件变化自动打包
}
```

.babelrc:

```
{
	"presets":["@babel/preset-env"]   //  插件集合体
}
```

Vue2.0 的版本不支持 ie9 以下的浏览器，是因为 Object.defineProperty 不支持低版本。Vue3.0 版本不支持 ie11 以下是因为 proxy 也没被支持。

响应式数据的本质就是在对数据进行增删改查的操作时，可以知道这些操作的发生，并且可以在操作发生的前或者后做一系列的任务。在 Vue2.0 版本中采用 Object.defineProperty 重新定义响应式数据，但是只支持对查和改数据的响应式能力，对于增和删没有支持，为此 Vue2.0 增加了$set和$delete 来弥补。

Vue2.0 的源码中，Vue 构造函数没有使用 ES6 中的类方式来写。而是使用构造函数的方式，通过构造函数扩展的方法，而这些扩展的方法都放到了各个文件中，方便管理。

```js
// 关于类的方法就会大量的耦合在一起
class Vue {
  // .....
}

function Vue(options) {
  // ......
}
```

### index.js

```js
import { initMixin } from './init.js';

function Vue(options) {
  // options就是配置对象
  this._init(options); // 初始化方法
}

initMixin(Vue);

export default Vue;
```

### init.js

```js
import { initState } from './state.js';
export function InitMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 在当前实例中扩展一些属性，如：$options,$nextTick,$attr,$data...
    const vm = this;
    vm.$options = options;
    // 初始化状态，props，computed，watch，data，methods等
    initState(vm);
  };
}
```

### state.js

```js
import {observe} from './observe/index.js'

export function initState(vm){
    const ops = vm.$options

    if(ops.props){
        initProps()
    }

    if(ops.data){
         initData(vm)
    }
}

function initData(vm){
    let data = vm.$options.data // data可能是对象或者函数
    data = typeof data === 'function'? data.call(vm):data

    vm._data = data
    observe(data)

    for(let key in data){
       proxy(vm,'_data',key)
    }

}

function proxy(vm,target,key){
    Object.definePropety(vm,key,{
        get(){
            return vm[target][key]
        }
        set(value){
        	vm[target][key] = value
    	}
    })
}
```

### observe/index.js

```js
import {newArrayProto} from './array.js'

export function observe(data){
    if(typeof data !===object ||data ==null){
        return
    }
	id(data.__obj__ instanceof Observer){
        return data.__obj__
    }
    new Observer(data)
}

class Observer{
    constructor(data){
        Object.defineProperty(data,'__obj__',{
            value:this,
            enumerable:false
        }
        if(Array.isArray(data)){
            data.__proto__ = newArrayProto
            this.observeArray(data)
        }else{
            this.walk(data)
        }
    }

    walk(data){
        Object.key(data).forEach(key=>defineReactive(data,key,data[key]))
    }

    observeArray(data){
        data.forEach(item=>observe(item))
    }

}

function defineReactive(data,key,value){
    observe(value)
    Object.defineProperty(target,key,{
        get(){
            return value
        },
        set(newValue){
            if(newValue === value) return
            observe(newValue)
            value = newValue
        }
    })
}
```

### array.js

```js
let oldArrayProto = Array.prototype

export let newArrayProto = Object.create(oldArrayProto)

let methods = ['push','pop','shift','unshift','reverse','sort','splice']

methods.forEach(method=>{
    newArrayProto[method] = function(..args){
        const result = oldArrayProto.call(this,...args)
        let inserted
        switch(method){
                case:'push':
                case:'unshift':
                inserted = args
                break
                case:'splice':
                inserted = args.slice(2)
            default:
                break;
        }
        if(inserted){
            this.__obj__.observeArray(inserted)
        }


        return result
    }
})
```

## Day02

依赖收集 Watcher 和 Dep 原理，异步更新原理，mixin 原理

## Day03

手写 computed 以及 watch 原理，生命周期原理

## Day04

手写组件渲染原理，Vue.extend( )，Diff 算法

Object.defineProperty 只能劫持已经初始化存在的对象上的属性。对于后来新增的属性或者之后删除原有属性都是无法拦截到的。Vue2.0 的处理方法是$set和$delete。

Object.defineProperty 是对原有对象的属性进行重新定义，所以性能不高。 关键方法是：defineReactive( )。

Object.defineProperty 也可以对数组的每一项进行数据劫持。如下图：

![image-20211227104628915](..\typora-user-images\image-20211227104628915.png)

但是 Vue2.0 中并没有对数组采用 Object.defineProperty 去进行数据拦截。因为一般属性元素很多，每一项都重新定义 getter 和 setter 会浪费性能。

对于 data 中的数组数据，是通过重写数组原型方法实现数据劫持的。

数据劫持基本完成后，就开始对模板进行编译了，编译后的最终结果生成 render 函数。

1. 将 template 转为 AST 抽象语法树
2. 生成 render 方法
3. render 方法执行的结果就是虚拟 DOM

模板的依赖收集（观察者模式）：

- 对于模板中的来自 data 的每一个属性配置一个收集器 dep（dependence）（存放在闭包中）
- 将页面的渲染逻辑分装到 watcher 中
- 让每个数据的收集器记住 watcher，收集器对应的属性变化后，找出 watcher 中的渲染逻辑重新执行

每个组件都是会有自己的 watcher。

对于组将中模板中没有使用到的 data 中的数据是不会收集依赖的，所以修改这些没有渲染到模板中的数据时

是不会触发组件重新渲染的。

### 异步更新

更新方法的调用进行延迟----`vm._update(vm._render())`

将不同 watcher 的更新方法放在一个队列中，在下一个事件环中循环取出后依次执行。

#### $nextTick 的原理

nextTick 并中及涉及同步又涉及异步代码，对于 nextTick 函数接受的回调函数，在 nextTick 函数内部会先将该回调函数放到一个数组队列中（同步），并不是针对每一次的 nextTick 函数的每一个回调函数都开启一个异步任务去执行它。

但是在本轮主执行栈中第一次执行 nextTick 时，会在内部开启一个任务任务，该异步任务会在 promise，mutationobserver，setImmediate，setTimeout 中做优雅降级的选择一个方式开启一个异步任务（异步）。在该异步任务中会依次循环之前推入到数组队列中的回调函数。

## Vue-Router

项目入口引入 vue-router 模块暴默认导出的 VueRouter 实例

```
import router from './router'
```

在 vue-router 模块中引入 Vue 构造函数和 vue-router 插件，并引入其他路由组件

调用 Vue 构造函数的静态方法——use 方法并传入插件, Vue 的 use 方法默认调用入参对象上的 install 方法，或者入参函数本身，同时传入 Vue 构造函数

new VueRouter 构造函数传入配置对象，以创建 vue-router 实例并默认导出

改默认导出实例在项目的入口文件中被作为根实例的配置对象属性传入

### 第一步：

准备工作。

首先是执行 Vue.use(VueRouter)

使用 Vue.mixin 在 Vue 构造函数的 options 上混入生命周期函数 beforeCreate( ){ }，之后在创建 Vue 实例或者 Vue 的组件实例的时候，让该根实例及其内部的所有后代组件都能访问放 VueRouter 实例。 （注意这里混入的方法暂未被执行，而是在组件创建的过程中执行）

同时在 install 方法中还注册了两个全局的组件 router-link 和 router-view

### 第二 步：

**将用户写的树结构的路由规则转换为路由映射表的形式（数据扁平化），目的是方便之后的增加或查询。**

执行完 Vue.use 方法后，开始调用 VueRouter 构造函数并传入配置对象了路由规则数组

VueRouter 构造函数的构造器方法开始执行，根据传入的路由规则表，为路由表创建了三个方法（match，addRoute，addRoutes），封装在一个匹配器对象中（matcher）并且该 matcher 对象是 VurRouter 构造函数的实例的属性。

**根据用户配置对象的中 mode 属性的值，选择创建不同的路由系统**

对于 hash 模式来说，如果刚开始访问的是/，这时应该默认跳转到/#/；如果刚开始就有 hash 值则不做操作。这步操作在创建路由模式实例对象的时候就执行了（早于给也页面设置 hashchange 事件之前）。

导出 VueRouter 构造函数的实例后，在项目的入口文件中引入该实例，并作为根实例的配置对象的属性
