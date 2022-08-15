#  React

index.js

```jsx
// React18
import React form 'react'
import ReactDOM from 'react-dom/client'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App></App>)
```



## React项目源码的情况

- 项目源码目录多
- 每个源码目录下又是大量的文件
- 源码的更新迭代速度很快，重构四轮（从13年至今）
- 通过`ReactDOM.render` debug，流程里有很多**异步调用**，难以保证逻辑链路不中断
- 只想关注某个功能点（比如`ReactDOM.render`如何渲染页面），但大量功能实现的代码也是耦合在这个流程中的，难以理解



学习建议：

- 思考某一段代码背后的实现意义和作用
- 站在**框架开发者**角度看看`React`的设计理念
- 一次只关注一个功能点逻辑代码





yrm 对标的是 nrm，用于切换yarn的下载源。

通过React官方的脚手架默认创建的项目中使用的就是React18版本，用法和之前的React17没什么区别。

最新版本的create-react-app脚手架创建的项目中可以**不用再主动引入React而直接而使用在文件中jsx语法**。因为新版项目中将jsx不再转为React.createElement，但是转换的结果是一样的。

```jsx
import React from 'react'
let element = <h1>hello</h1>
    
 //旧版的bable编译结果
 React.createElement('h1',null,'hello')


let element = <h1>hello</h1>
// React17中加入的特性  
// 新版的bable编译结果
import jsx from 'jsx'
jsx('h1',null,'hello')
```





之前项目的情况：

```jsx
import React from 'react'

const App = (props)=>{
    return ( <div>hello world!</div>  )
}

export default App 

// 上面的代码不引入React的话，在之前的项目中无法编译。因为jsx最后被转为React.createElement形式，所以看似没有依赖React，实则是有依赖的。  eslint中提示React引入而未使用的尴尬。
```

新版的情况：

```jsx
const App = (props)=>{
    return ( <div>hello world!</div>  )
}

export default App 

// 可以直接这么写，编译时会自动引入一个包   import jsx from 'jsx'  最后将jsx转为 jsx()函数调用的方式。
```

使用旧版的jsx转React.createElement逻辑的设置。

```diff
{
  "name": "zhufengreact",
  "version": "0.1.0",
  "scripts": {
+   "start": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts start",
+   "build": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts build",
+   "test": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts test",
+   "eject": "cross-env DISABLE_NEW_JSX_TRANSFORM=true react-scripts eject"
  },
}
```

 

  

## JSX

jsx是一种JavaScript的语法扩展，**它充分具备JavaScript的能力**。将组件的**数据，结构和样式**写在一起。  



- JSX是一种语法糖,最终会通过[babeljs](https://www.babeljs.cn/repl) 中的plugin-transform-react-jsx这个插件在webpack编译转译成`React.createElement`的调用语法（原生js语法）
- `React.createElement`函数执行后会返回一个React元素（虚拟DOM），即一个普通的js对象
- **React元素**事实上是普通的JS对象，用来描述在屏幕上看到的内容
- `ReactDOM`中的render方法用于将React.createElement()方法创建的虚拟DOM（JS对象）转化为真实的DOM并渲染到页面指定的DOM中



j  sx代码：

````jsx
<h1 className="title" style={{color:'red'}}>hello react</h1>
````

babel编译后的JS代码：

```js
React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello");
```

React.createElement执行后的结果：称为**虚拟DOM或React元素**

```js
{
    "type": "h1",
    "key": null,
    "ref": null,
    "props": {
        "className": "title",
        "style": {
            "color": "red"
        },
        "children": "hello react"
    },
    "_owner": null,
    "_store": {}
    "__proto__":{}
}
```



React.createElement() 函数接受三个参数

- type：可以是函数（函数组件），类（类组件），html标签对应的字符串
- config：一个对象（代表将要绑定给真实DOM或者传递给函数的数据）
- children：只有一个子元素时可能是一个对象或者一个字符串，有多个子元素是则是数组 





关于虚拟DOM：

​     1.本质是Object类型的对象（普通对象）

​     2.虚拟DOM比较“轻”，真实DOM比较“重”，因为虚拟DOM是React内部在用，无需真实DOM上那么多的属性。

​     3.虚拟DOM最终会被React转化为真实DOM，呈现在页面上。

![image-20210505125501427](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210505125501427.png)

虚拟DOM，又被称为React元素。



![image-20210614141924075](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210614141924075.png)

真实DOM

![image-20210614141827504](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210614141827504.png)





![image-20220425230654081](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220425230654081.png)



React.createElement函数是一个工厂方法，用来创建React元素（虚拟DOM  ）



## React.createElement实现原理

constanst.js:

```js
export const REACT_ELEMENT = Symbol('react-element')
```



utils.js:

```js
// <h1 className='title'>hello</h1>

export const REAVT_TEXT = Symbol('react-text')
export function warpToVdom(element){
    if(typeof element === 'string' || typeof element === 'number'){
       return { type:REAVT_TEXT, props:element }
    }else{
       return element
    }
}
```





react.js:

```js
import {REACT_ELEMENT} from './constanst.js'
import {warpToVdom} from './utils.js'
function createElement(type,config,children){
    // type可能是一个html标签字符串，或者类组件对应的构造函数或者函数组件对应的函数
    // config可能为null，children也可能没，存放标签属性
    // 当children是一个文本字符串时，并不会将它转为React元素，就是文本本身，只是在自己实现的React中将文本转为React元素  
    let ref  //获取真实DOM元素
    let key // dom-diff比较
    if(config){
        delete config.__source
        delete confis.__selfxxx
        ref = config.ref
        delete config.ref
        key = config.key
        delete config.key
    }
    let props = {...config}
    if(arguments.length>3){
        // 有多个子元素children对应的就是数组,数组中的每一项可能是字符串或者React对象
        props.children =Arrary.prototype.slice.call(arugments,2).map(warpToVdom)
    }eles if(arguments.length===3){
        // 一个子元素则就是子元素自身，字符串或者React对象
        props.children = warpToVdom(children) // 这个children是一个字符串或和React元素对象，
    }
    // 其他情况，则props上没有children属性
    return {
        $$typeof:Symbol('react.element')  
        type,
        key,   // 用于Dom-Diff
        ref,   // 用于获取真实的DOM元素
        props  // 一个对象，对象的key是标签属性或者children
    }
}

const React = {
    createElement
}

export defautl = React
```



**普通文本对应的React对象结构(自己实现的代码中这么做的，React的源码中并没有这么做)：**

```js
{ $$typeof: REACT_ELEMENT, type: REACT_TEXT, props: element }
```

其中element就是文本。

![image-20220727192927468](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220727192927468.png)





**html标签对应的React对象结构**

```js
({
    $$typeof: REACT_ELEMENT,
    type,   // type就是html标签字符串
    ref,
    key,
    props,
})
```



开发者书写的jsx看上去没有递归，但是经过Babel转为React.createElement后，会有该方法的嵌套以实现递归效果。





## ReactDOM.render方法实现原理

将虚拟DOM变为真实DOM并插入到指定的真实DOM元素中。

最能体现React核心思想的是Reac的16版本，React17中引入的fiber和React18加入的调度优先级和并发执行都是优化方案。本质的功能逻辑没有引入。

所以对于初学者，首先学习React的核心思想，然后再发现它的提问，然后看后来版本的优化策略。

react-dom.js:

```js
import {REAVT_TEXT} from '.utils.js'

function render(vdom, contanier){
    mount(vdom, contanier)
}

function mount(vdom, contanier){
    let newDom = createDOM(vdom)
    container.appendChild(newDom)
}

function createDOM(vdom){
    let {type,props} = vdom 
    let dom 
    if(type === REACT_TEXT){
        // 文本元素
        dom = document.createTextNode(props)
    }else{
        // 对应元素节点,元素节点可能有对应的元素属性
        dom = document.createElement(type)
        if(props){
            updateProps(dom,{},props)
            if(typeof props.children ==='object' && props.children.type){
                // 一个元素子节点 ,递归创建
                mount(props.children,dom)
            }else if(Array.isArray(props.children)){
                // 子元素是多个元素组成的数组
                reconcileChildren(props.children,dom)
            }
        }
    }
    return dom
}

// 专门处理元素属性的方法
function updateProps(dom,oldProps={},newProps={}){
    // 先处理新的属性
    for(let key in newProps){
        if(key==='children'){
            continue // 对于元素的后代元素不在这里处理
        }else if(key=='style'){
            let styleObj = newProps[key]
            for(let attr in styleObj){
                dom.style[attr] = styleObj[attr]
            }
        }else {
            // 虚拟DOM的属性一般来说刚好和DOM的属性相同，都是驼峰命名className
            dom[key] = newProps[key]
        }
    }

    // 处理老版本的属性
    for(let key in oldProps){
        if(!newProps.hasOwnProperty(key)){
            // 新属性中没有老属性中对应的字段，则删除
            dom[key] = null
        }
    }
}

function reconcileChildren(children,parentDOM){
    props.children.forEach(item=>{
		 mount(item,parentDOM)
    })
}

const ReactDOM = {
    render
}
export default ReactDOM
```





## 组件 

组件从概念上类似于 `JavaScript` 函数。它接受任意的入参(props属性)，并返回用于描述页面展示内容的 React 元素

组件的本质都是函数，类组件在ES5中也是会被转为函数的。

函数组件其实就是一个函数，该函数被执行后会返回一个新的ReactElemnt对象（虚拟DOM），源码内部再对这个虚拟DOM对象进行渲染生成真实的DOM并插入页面。

**函数组件对应的React对象结构：**

```jsx
function FunctionComponent(props){
  return <div className="title" style={{ color: 'red' }}><span>{props.name}</span>{props.children}</div>;
}
let element = <FunctionComponent name="hello">world</FunctionComponent>;
```



```js
({
    $$typeof: REACT_ELEMENT,
    type：f FunctionComponent(props),   // type 则不同于html标签，type的值是该函数  FunctionComponent 
    ref,
    key,
    props,  // babel会将组件标签上的标签属性编译到props中
})
```

![image-20220428232337371](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220428232337371.png)



![xuan_ran_han_shu_zu_jian_1626351799850](https://upload-markdown-images.oss-cn-beijing.aliyuncs.com/xuan_ran_han_shu_zu_jian_1626351799850.jpg)

```js
function mountFunctionComponent(vdom){
    let {type,props} = vdom   // 函数组件对应的type时函数
    let returnedJSXVdom = type(props)
    return createDOM(returnedJSXVdom)
}
```



对于函数组件中的子元素，默认是不渲染出来的，如果需要使用可以通过props.chidlren来获取。



```diff
import {REAVT_TEXT} from '.utils.js'

function render(vdom, contanier){
    mount(vdom, contanier)
}

function mount(vdom, contanier){
    let newDom = createDOM(vdom)
    container.appendChild(newDom)
}

function createDOM(vdom){
    let {type,props} = vdom 
    let dom 
    if(type === REACT_TEXT){
        // 文本元素
        dom = document.createTextNode(props)
+    }else if(typeof type==='function'){
+    	return mountFunctionComponent(vdom)
+    } else {
        // 对应元素节点,元素节点可能有对应的元素属性
        dom = document.createElement(type)
        if(props){
            updateProps(dom,{},props)
            if(typeof props.children ==='object' && props.children.type){
                // 一个元素子节点 ,递归创建
                mount(props.children,dom)
            }else if(Array.isArray(props.children)){
                // 子元素是多个元素组成的数组
                reconcileChildren(props.children,dom)
            }
        }
    }
    return dom
}

+ function mountFunctionComponent(vdom){
+	let {type,props} = vdom 
+	let renderVdom = type(props)
+	return creatDOM(renderVdom)
+ }

// 专门处理元素属性的方法
function updateProps(dom,oldProps={},newProps={}){
    // 先处理新的属性
    for(let key in newProps){
        if(key==='children'){
            continue // 对于元素的后代元素不在这里处理
        }else if(key=='style'){
            let styleObj = newProps[key]
            for(let attr in styleObj){
                dom.style[attr] = styleObj[attr]
            }
        }else {
            // 虚拟DOM的属性一般来说刚好和DOM的属性相同，都是驼峰命名className
            dom[key] = newProps[key]
        }
    }

    // 处理老版本的属性
    for(let key in oldProps){
        if(!newProps.hasOwnProperty(key)){
            // 新属性中没有老属性中对应的字段，则删除
            dom[key] = null
        }
    }
}

function reconcileChildren(children,parentDOM){
    props.children.forEach(item=>{
		 mount(item,parentDOM)
    })
}

const ReactDOM = {
    render
}
export default ReactDOM
```









**类组件对应的React元素：**

类组件的渲染是根据属性创建类的实例，并调用实例的render方法返回一个React元素。

类组件虽然在ES6写法是以类关键字定义的，但是经过babel转义后，也是函数。那React源码中是如何区分一个组件是函数组件还是类组件的了？方法就是，在编写类组件时会继承React.Component类，该类上有一个静态属性isReactComponent = new Symbol('React-ClassComponent')



```jsx
class ClassComponent extends React.Component{
    render(){
        return <div className="title" style={{ color: 'red' }}><span>{this.props.name}</span>{this.props.children}</div>;
    }
}
let element = <ClassComponent name="hello">world</ClassComponent>;
```



![lei_zu_jian_xuan_ran_1626352042061](https://upload-markdown-images.oss-cn-beijing.aliyuncs.com/lei_zu_jian_xuan_ran_1626352042061.jpg)



```js
import REACT_COMPONENT  form './constants'
export class Component{
    static isReactComponent =  REACT_COMPONENT 
    constructor(props){
        this.props = props
    }
}
```



```js
function mountClassComponent(vdom){
    let {type,props} = vdom   // 类组件经过babel转义后变为函数
    let classInstance = new type(props)
    let returnedJSXVdom = classInstance.render()
    return createDOM(returnedJSXVdom)
}
```



类组件的构造函数中是唯一一个可以直接赋值state的位置。



```diff
import {REACT_ELEMENT} from './constanst.js'
import {warpToVdom} from './utils.js'
+ import { Component } from './component.js'
function createElement(type,config,children){
    // type可能是一个html标签字符串，或者类组件对应的构造函数或者函数组件对应的函数
    // config可能为null，children也可能没，存放标签属性
    // 当children是一个文本字符串时，并不会将它转为React元素，就是文本本身，只是在自己实现的React中将文本转为React元素  
    let ref  //获取真实DOM元素
    let key // dom-diff比较
    if(config){
        delete config.__source
        delete confis.__self
        ref = config.ref
        delete config.ref
        key = config.key
        delete config.key
    }
    let props = {...config}
    if(arguments.length>3){
        // 有多个子元素children对应的就是数组,数组中的每一项可能是字符串或者React对象
        props.children =Arrary.prototype.slice.call(arugments,2).map(warpToVdom)
    }eles if(arguments.length===3){
        // 一个子元素则就是子元素自身，字符串或者React对象
        props.children = warpToVdom(children) // 这个children是一个字符串或和React元素对象，
    }
    // 其他情况，则props上没有children属性
    return {
        $$typeof:Symbol('react.element')  
        type,
        key,   // 用于Dom-Diff
        ref,   // 用于获取真实的DOM元素
        props  // 一个对象，对象的key是标签属性或者children
    }
}

const React = {
    createElement
}

export defautl = React
```



component.js:

```js
export class Component{
    static isReactComponent = true
    constructor(props){
        this.props= props
    }
}
```







```diff
import {REAVT_TEXT} from '.utils.js'

function render(vdom, contanier){
    mount(vdom, contanier)
}

function mount(vdom, contanier){
    let newDom = createDOM(vdom)
    container.appendChild(newDom)
}

function createDOM(vdom){
    let {type,props} = vdom 
    let dom 
    if(type === REACT_TEXT){
        // 文本元素
        dom = document.createTextNode(props)
+    }else if(typeof type==='function'){
+		if(type.isReactComponent){
+			return mountClassComponent(vdom)
+		}else{
+			return mountFunctionComponent(vdom)
+		}
+    } else {
        // 对应元素节点,元素节点可能有对应的元素属性
        dom = document.createElement(type)
        if(props){
            updateProps(dom,{},props)
            if(typeof props.children ==='object' && props.children.type){
                // 一个元素子节点 ,递归创建
                mount(props.children,dom)
            }else if(Array.isArray(props.children)){
                // 子元素是多个元素组成的数组
                reconcileChildren(props.children,dom)
            }
        }
    }
    return dom
}

function mountFunctionComponent(vdom){
	let {type,props} = vdom 
	let renderVdom = type(props)
	return creatDOM(renderVdom)
}

+ function mountClassComponent(){
+ 	let {type,props} = vdom 
+	let classInstance = new type(props)
+	let renderVdom = classInstance.render()
+   let dom = createDOM(renderVdom)	
+	return domx
+ }

// 专门处理元素属性的方法
function updateProps(dom,oldProps={},newProps={}){
    // 先处理新的属性
    for(let key in newProps){
        if(key==='children'){
            continue // 对于元素的后代元素不在这里处理
        }else if(key=='style'){
            let styleObj = newProps[key]
            for(let attr in styleObj){
                dom.style[attr] = styleObj[attr]
            }
        }else if(/^on[A-Z].*/.test(key)){  // 事件
        	dom[key.toLowerCase()] = newProps[key]
        }else {
            // 虚拟DOM的属性一般来说刚好和DOM的属性相同，都是驼峰命名className
            dom[key] = newProps[key]
        }
    }

    // 处理老版本的属性
    for(let key in oldProps){
        if(!newProps.hasOwnProperty(key)){
            // 新属性中没有老属性中对应的字段，则删除
            dom[key] = null
        }
    }
}

function reconcileChildren(children,parentDOM){
    props.children.forEach(item=>{
		 mount(item,parentDOM)
    })
}

const ReactDOM = {
    render
}
export default ReactDOM
```





## 组件的更新

```js
export class Component{
    static isReactComponent =  REACT_COMPONENT 
    constructor(props){
        this.props = props
        this.state= {}
        this.updater = new Updater(this)  // 每个类组件都自己的Updater更新器
    }
    
    // 现在是同步更新，没有做setState的批处理
     setState( ){ 
         // 当用户调用setState后，React源码中会委托给Updater实例来实现更新
         this.updater.addState(partialState)
     }
    
    forceUpdate(){
        // 获取旧的虚拟DOM
        // 获取旧的虚拟对应的真实DOM
    }
}

class Updater{
    constructor(classInstance){
        this.classInstance = classInstance
        this.paddingState = []   //缓存批量更新
    }
    
    addState(partialState){
        this.paddingState.push(partialState)
        this.emitUpdate()  //这里为什么不直接写updateComponent调用了？原因是后续需要扩展，多部流程都会走emitUpdate
    }
    
    emitUpdate(){
        this.updateComponent()
    }
    
    updateComponent(){
        // 组件的更新思想是：当用户调用setState并传入对象参数（新状态）后，需要将类组件实例上的state变为最新的情况， 然后重新执行render方法，在render方法返回的时会重新读取state中的状态，然后返回最新渲染的结果，在重新渲染到页面。
		const { classInstance, paddingState} = this
         if(paddingState.length>0){
             let newState = this.getState()
             shouldUzpdate(classInstance,newState)
         }
        
    }
    
    getState(){
        const { classInstance, paddingState} = this
        let {state} = classInstance  // 老状态
        paddingState.forEach(nextState=>{
            state = {...state,...nextState}
        })
        paddingState.length = 0
        return state
    }
}

function shouldUpdate(classInstance,newState){
    classInstance.state = newState
    classInstance.forceUpdate() 
}
```

在React的类组件中是无法删除某个属性？ 是无法正真删除的。只能置为null。如果使用delete this.state.xxx删除，则代码在执行时则可能 因为没法访问到变量而报错。



```js
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;//真实DOM元素
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props);//props是个字符串，不是一个DOM节点
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {//如果type是一个普通字符串的话，说明它是是一个原生组件div span p
    dom = document.createElement(type);
  }
  if (props) {
    //更新属性 DOM 老属性对象 新属性对象
    updateProps(dom, {}, props);
    //这是指的只有一个儿子的情况
    if (typeof props.children === 'object' && props.children.type) {
      props.children.mountIndex = 0;
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  //在创建真实DOM的，把虚拟DOM和真实DOM进行关联
  vdom.dom = dom;
  if (ref) ref.current = dom;
  return dom;
}

forceUpdate(){
    // 获取旧的虚拟DOM
    let oldRenderVdom = this.renderVdom
    // 获取旧的虚拟对应的真实DOM
    let oldDOM = findDOM(oldRenderVdom)  // 从虚拟DOM上获取真实DOM
    let newRenderVdom = this.render()
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props } = vdom;
  let classInstance = new ClassComponent(props);
  vdom.classInstance = classInstance;
  let renderVdom = classInstance.render();
  //先缓存一次渲染出来的虚拟DOM，放置在组件实例上
  classInstance.oldRenderVdom = renderVdom;  // 将虚拟VDOM挂载到类的实例上
  let dom = createDOM(renderVdom);
  return dom;
}

function mountFunctionComponent(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props);
  if (!renderVdom) return null;
  //先缓存一次渲染出来的虚拟DOM，放置在虚拟DOM上
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

/**
 * 从虚拟DOM获取真实DOM
 * @param {*} vdom 原生的div=>真实DIV节点,函数组件 oldRenderVdom才可能有真实DOM
 */
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {//当vdom对应原生组件的时候，可以返回真实DOM
    return vdom.dom;
  } else {//如果是类组件或者说函数组件的话
    //vdom.type.isReactComponent
    // function Count(){ return <Count1 /> } 
    let renderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom;
    return findDOM(renderVdom);
  }
}

// 暂时没有DOM-DIFFz'z
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
    let oldDOM = findDOM(oldVdom)
    let newDOM = createDOM(newVdom);//此处会有一个问题我们后面解决
    parentDOM.replaceChild(newDOM,oldDOM)
}
```







## 批量更新

- State 的更新会被合并，当开发者调用 setState() 的时候，React 会把开发者提供的对象以当前的state为基础合并为一个对象然后进行更新 
- State 的更新可能是异步的（事件处理函数中，生命周期函数中）
  - 出于**减少更新次数，提高性能**，React 可能会把多个 setState() 调用合并成一个调用
  - 因为 this.props 和 this.state 可能会异步更新，所以不要依赖他们的值来更新下一个状态
  - 可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数



```jsx
import React from "./react";
import ReactDOM from "./react-dom";
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { number: 0 };
    }
    handleClick = () => {
+       this.setState({ number: this.state.number + 1 });
+       console.log(this.state); 
+       this.setState({ number: this.state.number + 1 });
+       console.log(this.state); 
+       setTimeout(()=>{
+           this.setState({ number: this.state.number + 1 });
+           console.log(this.state);
+           this.setState({ number: this.state.number + 1 });
+           console.log(this.state);
+       });
    }
    render() {
        return (
            <div>
                <p>{this.props.title}</p>
                <p>number:{this.state.number}</p>
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
}
ReactDOM.render(<Counter title="计数器" />, document.getElementById("root"));

// 0 0 2 3
```





只要是React能够管理的方法，setState都是批量的。

**状态更新和视图更新都是批量的**。开启批量更新，执行事件函数，关闭批量更新，当在setTimeout执行时，已经是下一个事件环，并且脱离了之前的执行上下文，所以表现为同步。

React17及以前设计如此。因为在React中控制批量更新是使用一个标记变量——isBatchingUpdate，它为true就是批量更新，为false就是非批量更新。在上面个的代码中，在事件函数执行前，将isBatchingUpdate改为true，当该函数执行结束后，isBatchingUpdate变为false。在setTimeout中是在新的事件环中执行的宏任务，该宏任务脱离之前的上下文环境，执行定时器中的回调函数时isBatchingUpdate变量已经变为false了，所以就是非批量的了。

**在React18以后，在定时器中也是批量更新的了，因为实现原理不同了，之前靠标记变量，React18靠更新优先级来合并。**

在定时器中调用this.setState函数时，状态更新和视图跟新都的次数一一对应。 

```js
export let updateQueue = {
  isBathingUpdate: false,//是否是批量更新,如果为true就批量的异步的，如果是false非批量的，同步的
  updaters: new Set(),
  batchUpdate() {
    updateQueue.isBathingUpdate = false;
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.updaters.clear();
  }
}


setState(partialState) {
    this.updater.addState(partialState);
}

// Updater:
addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
}

emitUpdate() {
    if (updateQueue.isBathingUpdate) {//如果是批量
        updateQueue.updaters.add(this); //就把当前的updater添加到set里保存
    } else {
        this.updateComponent(); //直接更新
    }
}


updateComponent() {
    const { nextProps, classInstance, pendingStates } = this;
    if (nextProps || pendingStates.length > 0) {
        //表示有将要进行的更新
        shouldUpdate(classInstance, nextProps, this.getState());
    }
}
getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance; //获取 类的实例的老状态
    pendingStates.forEach((nextState) => {
        state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
}


// ----------- 事件代理和劫持（在执行之前将isBathingUpdate置为true）   合成事件（合成多个代理）
function updateProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    if (key === 'children') {
      continue;
    } else if (key === 'style') {
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      //dom[key.toLowerCase()] = newProps[key];
      addEvent(dom, key.toLowerCase(), newProps[key]);
    } else {
      //虚拟DOM属性一般来刚好和dom的属性相同的，都是驼峰命名 className 
      //dom.className = 'title' setAttribute();
      dom[key] = newProps[key];
    }
  }
}

/**
 * 给DOM节点绑定事件，
 * @param {*} dom 真实的DOM节点 button
 * @param {*} eventType 事件类型 onclick
 * @param {*} handler 原始的事件处理函数 handleClick
 */
export function addEvent(dom, eventType, handler) {
  let store = dom.store || (dom.store = {});//保证DOM节点有一个自定义的属性对象
  store[eventType] = handler;//store.onclick=handler 把处理函数保存到真实DOM节点上 
  if (!document[eventType])
    document[eventType] = dispatchEvent;//document.onclick  = dispatchEvent
}


/**
 * 合成事件
 * 1.屏蔽浏览器的差异 类似于jquery的功能
 * @param {*} event 真实的事件对象
 */
function dispatchEvent(event) {
  updateQueue.isBathingUpdate = true;//在事件函数执行前，让批量更新标志设置为true
  let { target, type } = event;//target=button真实DOM,type事件类型click
  let syntheticEvent = createSyntheticEvent(event);
  //target指的是事件源，点谁就是谁.它在冒泡的过程是不是变的
  //currentTarget代表当前的DOM元素
    
    // 模拟事件冒泡机制
  let currentTarget = target;
  while (currentTarget) {
    syntheticEvent.currentTarget = currentTarget;
    let eventType = `on${type}`;//onclick
    const { store } = currentTarget;
    let handler = store && store[eventType];
    handler && handler(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    currentTarget = currentTarget.parentNode;
  }
  updateQueue.batchUpdate();
}


function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === 'function') value = value.bind(nativeEvent);
    syntheticEvent[key] = value;
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;//是否已经阻止了默认事件
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.isPropagationStopped = false;//是否已经阻止了默认事件
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.isDefaultPrevented = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

function stopPropagation() {
  this.isPropagationStopped = true;
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}
```

 



## 合成事件

批量更新是需要合成事件配合的。  合成事件就是在绑定的原有事件的基础上扩展一些自己的逻辑，为了能扩展就需要对事件进行代理，合成多个代理。

 

```js
import { updateQueue } from "./Component";
/**
 * 给DOM节点绑定事件，
 * @param {*} dom 真实的DOM节点 button
 * @param {*} eventType 事件类型 onclick
 * @param {*} handler 原始的事件处理函数 handleClick
 */
export function addEvent(dom, eventType, handler) {
  let store = dom.store || (dom.store = {});//保证DOM节点有一个自定义的属性对象
  store[eventType] = handler;//store.onclick=handler 把处理函数保存到真实DOM节点上 
  if (!document[eventType]) 
    document[eventType] = dispatchEvent;//document.onclick  = dispatchEvent
    
    //  上面的代码可以看出，事件对应的代码都代理绑定到了document文档对象中了
}
/**
 * 合成事件
 * 1.屏蔽浏览器的差异 类似于jquery的功能
 * @param {*} event 真实的事件对象
 */
function dispatchEvent(event) {
  updateQueue.isBathingUpdate = true;//在事件函数执行前，让批量更新标志设置为true
  let { target, type } = event;//target=button真实DOM,type事件类型click
  let syntheticEvent = createSyntheticEvent(event);
  //target指的是事件源，点谁就是谁.它在冒泡的过程是不是变的
  //currentTarget代表当前的DOM元素
  let currentTarget = target;
     
  // 模拟事件冒泡
  while (currentTarget) {
    syntheticEvent.currentTarget = currentTarget;
    let eventType = `on${type}`;//onclick
    const { store } = currentTarget;
    let handler = store && store[eventType];
    handler && handler(syntheticEvent);  // syntheticEvent合成事件对象
      // 阻止事件冒泡
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    currentTarget = currentTarget.parentNode;
  }
  updateQueue.batchUpdate();
}


function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === 'function') value = value.bind(nativeEvent);
    syntheticEvent[key] = value;
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;//是否已经阻止了默认事件
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.isPropagationStopped = false;//是否已经阻止了默认事件
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.isDefaultPrevented = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

function stopPropagation() {
  this.isPropagationStopped = true;
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}
```



在同一个函数中调用的this.setState方法，在异步的情况下都会往一个数组中去追加，之后统一在一个方法中进行合并。

```js
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }
  // 
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBathingUpdate) {//如果是批量
      updateQueue.updaters.add(this);//就把当前的updater添加到set里保存
    } else {
      this.updateComponent();//直接更新
    }
  }
  updateComponent() {
    const { nextProps, classInstance, pendingStates } = this;
    if (nextProps || pendingStates.length > 0) {//表示有将要进行的更新
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }
    
  // 这里对this.setState中的数组中的每一项进行合并
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;//获取 类的实例的老状态 
    pendingStates.forEach((nextState) => {
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
  }
}
```

 

React中onClick中的事件是发生在事件冒泡阶段的，如果要注册事件捕获阶段的事件则需要使用onClickCapture事件。

在React的jsx语法中，看似是给对应的dom元素绑定的事件，实际上全部都是代理到了document文档对象中了。

在React17以前是绑定在codument对象上的，在React17及以后是绑定在了root根节点上了。 



合成事件的目的：

1. 实现批量更新
2. 抹平浏览器之间的差异   





## Ref

通过ref，开发者可以访问真实的DOM或者React元素对象。

```js
// 源码
function createRef() {
  return { current: null };  // 之所以返回的是一个对象就是为了重复调用的生成的对象都是项目独立而不互相影响的。
}
```



### 类组件的Ref

```js
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;//真实DOM元素
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom);
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
  } else if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);//props是个字符串，不是一个DOM节点
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {//如果type是一个普通字符串的话，说明它是是一个原生组件div span p
    dom = document.createElement(type);
  }
  if (props) {
    //更新属性 DOM 老属性对象 新属性对象
    updateProps(dom, {}, props);
    //这是指的只有一个儿子的情况
    if (typeof props.children === 'object' && props.children.type) {
      props.children.mountIndex = 0;
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  //在创建真实DOM的，把虚拟DOM和真实DOM进行关联
  vdom.dom = dom;
  if (ref) ref.current = dom;  // -------------------------------ref
  return dom;
}


function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  let classInstance = new ClassComponent(props);
  if (ClassComponent.contextType) {
    classInstance.context = ClassComponent.contextType._currentValue;
  }
  vdom.classInstance = classInstance;
  if (ref) ref.current = classInstance;  // -------------------------------ref
  if (classInstance.componentWillMount) classInstance.componentWillMount();
  let renderVdom = classInstance.render();
  if (!renderVdom) return null;
  //先缓存一次渲染出来的虚拟DOM，放置在组件实例上
  classInstance.oldRenderVdom = renderVdom;
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) classInstance.componentDidMount();
  return dom;
}
```



### ref的高级用法

如果直接将ref绑定到函数组件内部的真实dom元素上时，用户获取到该真实元素后可以进行许多意想不到的操作，如果开发者想限制用户只能进行指定的操作，则可以将穿透的ref的current属性指向一个对象，对象中提供开发者想要暴露出去的指定操作。

```js
import React from './react';
import ReactDOM from './react-dom';

// ------------------------高级用法f
function Username(props, ref) {
  let usernameRef = React.createRef();
  ref.current = {
    focus: () => {
      usernameRef.current.focus();
    }
  }
  return <input ref={usernameRef} />;
}


const ForwardUsername = React.forwardRef(Username);
console.log(ForwardUsername);
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
  }
  getFocus = () => {
    this.usernameRef.current.focus();
    //this.usernameRef.current.remove();
  }
  render() {
    return (
      <div>
        <ForwardUsername ref={this.usernameRef} />
        <button onClick={this.getFocus}>获得焦点</button>
      </div>
    )
  }
}
ReactDOM.render(<Form />, document.getElementById('root'));
```





### 函数组件的Ref

函数组件使用Ref，需要使用React.forwardRef( )对ref进行穿透。

React.forwardRef( )转为虚拟DOM后的结构：

```jsx
function MyInput(props,ref){
    return <input ref={ref}></input>
}

let ForEardRefMyInput = React.forwardRef(MyInput)
```



```
<ForEardRefMyInput ref={this.inputRef}>
babel编译后：
React.createElement(ForEardRefMyInput,{ref:this.inputRef})
在浏览器执行代码后：
{
	$$typeof:Symbol('react-element')
	type:{
        $$typeof: Symbol(react.forward_ref)
        render
    },
    props:{},
    ref:this.inputRef
}
```



![image-20220731130846135](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220731130846135.png)

 ```js
 function forwardRef(render){
     return {
         $$typeof: Symbol(react.forward_ref)
         render
     }
 }
 ```

React.forwardRef( )方法返回一个对象，其中的render就是一个函数组件



```js
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;//真实DOM元素
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);  // 挂载转发ref组件
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);//props是个字符串，不是一个DOM节点
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {//如果type是一个普通字符串的话，说明它是是一个原生组件div span p
    dom = document.createElement(type);
  }
  if (props) {
    //更新属性 DOM 老属性对象 新属性对象
    updateProps(dom, {}, props);
    //这是指的只有一个儿子的情况
    if (typeof props.children === 'object' && props.children.type) {
      props.children.mountIndex = 0;
      mount(props.children, dom)
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  //在创建真实DOM的，把虚拟DOM和真实DOM进行关联
  vdom.dom = dom;
  if (ref) ref.current = dom;  // -------------------------------ref
  return dom;
}


/**
 * 
 * @param {*} vdom 
 */
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  if (!renderVdom) return null;
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}
```



## 生命周期函数

初始化阶段 ：设置组件的属性和状态（constructor）



挂载阶段：componentWillMount=>render=>componentDidMount



更新阶段：

- prop改变：componentWillReceiveProps=>shouldComponentUpdate=>ComponentWillUpdate=>render=>componentDidUpdate
- state改变：shouldComponentUpdate=>ComponentWillUpdate=>render=>componentDidUpdate



卸载阶段：componentWillUnmount



```jsx
import React from './react';
import ReactDOM from './react-dom';  
class Counter extends React.Component {
  static defaultProps = {   // defaultProps是规定死的
    name: 'zhufeng'//定义默认属性
  }
    
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log('Counter 1.constructor');
  }
    
  componentWillMount() {
    console.log('Counter 2.componentWillMount');
  }
    
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate');
    return nextState.number % 2 === 0;//偶数才更新
  }
    
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate');
  }
    
  handleClick = () => {
    debugger
    this.setState({ number: this.state.number + 1 });
  }

  render() {
    console.log('Counter 3.render');
    return (
      <div>
        <p>{this.state.number}</p>
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handleClick}>+</button>
        {null}
      </div>
    )
  }
    
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate');
  }
    
  componentDidMount() {
    console.log('Counter 4.componentDidMount');
  }
}

class ChildCounter extends React.Component {
  componentWillUnmount() {
    console.log('ChildCounter 8.componentWillUnmount');
  }
  componentWillReceiveProps(newProps) {
    console.log('ChildCounter 4.componentWillReceiveProps');
  }
  componentWillMount() {
    console.log('ChildCounter 1.componentWillMount');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter 5.shouldComponentUpdate');

    return nextProps.count % 3 === 0;
  }
  componentWillUpdate() {
    console.log('ChildCounter 6.componentWillUpdate');
  }
  render() {
    console.log('ChildCounter 2.render');
    return <div>{this.props.count}</div>
  }
  componentDidUpdate() {
    console.log('ChildCounter 7.componentDidUpdate');
  }
  componentDidMount() {
    console.log('ChildCounter 3.componentDidMount');
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```





```js
function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  let classInstance = new ClassComponent(props);

  vdom.classInstance = classInstance;
  if (ref) ref.current = classInstance;
  if (classInstance.componentWillMount) classInstance.componentWillMount();
  let renderVdom = classInstance.render();
  if (!renderVdom) return null;
  //先缓存一次渲染出来的虚拟DOM，放置在组件实例上
  classInstance.oldRenderVdom = renderVdom;
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) classInstance.componentDidMount();
  return dom;
}
```



```js
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true;
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  //不管shouldComponentUpdate返回true还是false,当前组件的state都会更新
  classInstance.state = nextState;
  //只不过当willUpdate为true的时候，才会真正去更新界面
  if (willUpdate) classInstance.forceUpdate();
}
```



```js
export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    //每个类组件的实例都配有一个自己的Updater更新器
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  forceUpdate() {
    //类组件更新的时候，也是从根节点开始dom-diff的
    let oldRenderVdom = this.oldRenderVdom;
    //获取老的虚拟DOM获取老的真实DOM
    let oldDOM = findDOM(oldRenderVdom); //div#counter
    let newRenderVdom = this.render(); //渲染出新的虚拟DOM
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
  }
}
```



含有子组件的生命周期函数的调用顺序：

初次挂载：父组件的constructor=>父组件的componentWillMount=>父组件的render => 子组件的constructor=>子组件的componentWillMount=>子组件的render =>子组件的componentDidMount=>父组件的componentDidMount



父组件的状态更新：父组件的shouldComponentUpdate=>父组件的componentWillUpdate=>父组件的render =>子组件的componentWillReceiveProps=>子组件的shouldComponentUpdate=>子组件的componentWillUpdate=>子组件的render =>子组件的componentDidUpdate=>父组件的componentDidUpdate



 

## DOM-DIFF

### 第一版

```js
/**
 * 比较 虚拟DOM，更新真实DOM
 * @param {*} parentDOM 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  if (!oldVdom && !newVdom) {  // 新旧节点都没有
    return null;
  } else if (oldVdom && !newVdom) {//老的有，新的没有，那就是删除
    unmountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    let newDOM = createDOM(newVdom);//此处会有一个问题我们后面解决，不能写死appendChild，因为插入节点的位置不确定
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
    //老的虚拟DOM存在，并且新的虚拟DOM也存在，并且不相同
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    unmountVdom(oldVdom);
    let newDOM = createDOM(newVdom);//此处会有一个问题我们后面解决，不能写死appendChild，因为插入节点的位置不确定
    if (nextDOM) {
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM);
    }
  } else {//老节点存在，新节点也存在，类似也一样，我们进行深度的DOM-DIFF过程
    updateElement(oldVdom, newVdom);
  }
}

function updateElement(oldVdom, newVdom) {
  if (oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_FRAGMENT) {
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (oldVdom.type === REACT_TEXT) {//如果新老节点都是文本节点的话
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    if (oldVdom.props !== newVdom.props) {
      currentDOM.textContent = newVdom.props;
    }
  } else if (typeof oldVdom.type === 'string') {//就是原生节点
    let currentDOM = newVdom.dom = findDOM(oldVdom);
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === 'function') {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}


function unmountVdom(vdom) {
  const { type, props, ref } = vdom;
  const currentDOM = findDOM(vdom);  //找到虚拟DOM对应的真实DOM
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    vdom.classInstance.componentWillUnmount();  // 触发componentWillUnmount生命周期函数
  }
  if (ref) { ref.current = null }
  if (props.children) {
    let children = Array.isArray(props.children) ? props.children : [props.children];
    children.forEach(unmountVdom);
  }
  if (currentDOM) currentDOM.remove();  // 移除真实DOM自身
}
```









































