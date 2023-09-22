# React15

学完React15再学习React18这样学习的坡度会下降不少，因为React和核心逻辑变化不大，但React15以后因为性能考虑引入许多数据结构与算法，解决性能问题，上手难度较大。



```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// element就是一个React元素，本质是一个带有层级结构的js对象，作用是描述真实dom的信息
let element = (
    <div className ='title' style={{color:'red'}}>
        <span>hello</span>
    </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(element)  // 将虚拟dom变为真实dom并渲染到页面
```



react：react核心包，里面使用了许多数据结构。

react-dom/client：提供dom渲染相关逻辑，将虚拟DOM渲染到页面上。



React元素的真实结构：

![image-20230619180427358](C:\Users\dukkha\Desktop\study-notes\珠峰架构\images\image-20230619180427358.png)



- $$typeof:可能是一般的html标签，也可以是文本
- type:表示元素的类型，如果是元素html标签，则值为对应的标签名；如果是函数组件，则对应的值是函数；如果是类组件，则对应的值是类。
- props:存放jsx中元素自定义或者原生的各种属性（class,style,id等）；另外还可能有一个children属性和，children属性如果存在，值可能是一个对象（另一个React元素），字符串，数组。
- key
- ref
- ...



```jsx
<h1 className='title' style={{color:'red'}}>hello
	<span>world</span>
</h1>
```

jsx在React17以前通过bable编译后生成的是React.createElement(type,props,child )的函数调用，该函数在浏览器中执行后返回的就是一个React元素，也就是前面截图中的格式。

老版本的编译在编译阶段没有将children作为props中的一个属性，而是在React.createElement函数体中解析了children后再挂载到props上的。

```js
/*#__PURE__*/React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello", /*#__PURE__*/React.createElement("span", null, "world"));
```





jsx在React17及以后通过babel编译后生成的是jsx(type,props)函数的掉用，该函数在浏览器中执行后返回的也是一个React元素，也就是前面截图中的格式。（结果和React.createElement(type,props,child )的是一样的）

新版本的编译将children在编译阶段就作为props中的一个属性了。

```js
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
/*#__PURE__*/_jsxs("h1", {
  className: "title",
  style: {
    color: 'red'
  },
  children: ["hello", /*#__PURE__*/_jsx("span", {
    children: "world"
  })]
});
```



新旧变更背后的考虑：

1. 使得开发者不必再手动引入react
2. 避免一些代码校验工具的不规范提示
3. 提前到编译阶段处理好children







----

**函数组件**

````js
function FunctionComponent(props){
	return <h1 className='title' style={{color:'red'}}>hello
      <p>{props.title}</p>
      <span>world</span>
</h1>
}

const Com = <FunctionComponent title='function-component'/>
````

babel解析结果：

```js
function FunctionComponent(props) {
  return React.createElement("h1", {
    className: "title",
    style: {
      color: 'red'
    }
  }, "hello", React.createElement("p", null, props.title), React.createElement("span", null, "world"));
}

var Com = React.createElement(FunctionComponent, {
  title: "function-component"
});
```

函数组件对应的React元素的type属性的属性值就是函数本身。React内部会执行该函数并传入babel解析得到的props，然后函数返回一个虚拟DOM，用于渲染。`type(props)`





---

**类组件**

```jsx
class ClassComponent extends React.Component{
  
  constructor(props){
   super(props)
  	this.state= {number:1}
  }
  
  render(){
  	return <h1 className='title' style={{color:'red'}}>
      <p>{this.props.title}</p>
      <span>{this.state.number}</span>
    </h1>
  }
	
}

const Com = <ClassComponent title='class-component'/>
```

babel解析结果：

```js
var ClassComponent = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ClassComponent, _React$Component);
  function ClassComponent(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    _this.state = {
      number: 1
    };
    return _this;
  }
  var _proto = ClassComponent.prototype;
  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("h1", {
      className: "title",
      style: {
        color: 'red'
      }
    }, /*#__PURE__*/React.createElement("p", null, this.props.title), /*#__PURE__*/React.createElement("span", null, this.state.number));
  };
  return ClassComponent;
}(React.Component);
var Com = /*#__PURE__*/React.createElement(ClassComponent, {
  title: "class-component"
});
```

类组件对应的虚拟DOM：

![image-20230619191626425](C:\Users\dukkha\Desktop\study-notes\珠峰架构\images\image-20230619191626425.png)



因为ES6中的类组件本质也是函数组件，所以为了区别一个组件是函数组件还是类组件，React的源码中为类组件添加了一个静态属性：`static isReactComponent = true`

针对类组件，是先通过new 虚拟DOM的type并传入props，生成对应类组件的实例，然后调用实例的render方法，获取类组件返回的虚拟DOM，然后生成虚拟DOM对应的真实DOM，并用于渲染。



---

**类组件状态更新**

在类组件中调用this.setState方法可以部分更新组件自身的state，并且默认是异步更新state的，同时可以在用一个函数中多次调用this.setState方法，这些方法都会被添加到类组件实例对象的更新器的pendingState数组中，最后统一更新。（每个类组件中实例对象上都有一个更新器对象）



---

**批量更新**

在React18以前， 在事件回调函数中调用的this.setState都是异步且批量的，同时，在setTimeout中的调用的this。setState都是同步更新且不是批量的。

```js
handleClick = ()=>{
    this.setState({number:this.state.number+1})
    consoloe.log(this.state.number)
    this.setState({number:this.state.number+1})
    consoloe.log(this.state.number)
    setTimeout(()=>{
        this.setState({number:this.state.number+1})
    	consoloe.log(this.state.number)
        this.setState({number:this.state.number+1})
    	consoloe.log(this.state.number)
    })
}

// 在React18以前，打印的是0 0 2 3
```





在React18及以后，在同一个事件处理函数或者setTimeout中的this.setState都是异步的且批量的。

```js
handleClick = ()=>{
    this.setState({number:this.state.number+1})
    consoloe.log(this.state.number)
    this.setState({number:this.state.number+1})
    consoloe.log(this.state.number)
    setTimeout(()=>{
        this.setState({number:this.state.number+1})
    	consoloe.log(this.state.number)
        this.setState({number:this.state.number+1})
    	consoloe.log(this.state.number)
    })
}

// 在React18以前，打印的是0 0 1 1
```



实现批量更新的关键是React定义了一个全局变量updateQueue，其中右isBatchingUpdate属性表示是否开启批量更新，默认是false，非批量同步更新。

```js
export const updateQueue = {
    isBatchingUpdate:false,  // 是否批量异步更新，默认不批量且同步
    updaters:new Set(), // 存放每个类组件实例对象上的updater实例对象
    batchUpdate(){
        updateQueue.isBatchingUpdate = false
        for(const updater of updateQueue.updaters){
            updater.updateComponent()
        }
        updateQueue.updaters.clear()
    }
}
```



在触发某个元素的事件处理函数时，会先将updateQueue的isBatchingUpdate设置为true，然后调用this.setState后，将被加入队列数组中，同时将updater添加到updateQueue的batchUpdate中。事件处理函数中的代码执行完后，再将batchUpdate的isBatchingUpdate置为false，然后执行updateQueue的batchUpdate，进行组件更新。这都是在本轮宏任务队列中完成的，一旦本轮代码中开启了异步的this.setState，则会在下一轮isBatchingUpdate为false的情况下执行，所以就会是同步的。

至于修改updateQueue的isBatchingUpdate的值的代码和调用updateQueue的batchUpdate都是在React源码中通过合成事件来统一处理的。



---

**批量更新**

在React15中，是将事件统一绑定到document上的，在React16及以后是统一绑定到容器上（也就是div#root上）。

每个真实dom上都会对应一个store属性，该属性上存放的就是所有该DOM元素要绑定的事件，并不是给该DOM绑定了对应的事件。

为什么将所有子节点的事件都委托给document或者div#root？

- 减少绑定，不用给每个DOM元素绑定事件，每个DOM元素只是存放该事件处理函数，提高性能
- 可以让动态生成的元素也具有相应的事件
- 统一进行事件处理，实现合成事件、批处理



```js
document[eventType] = dispatchEvent

function dispatchEvent(event){
    const {target,type} = event;
    let eventType = `on${type}`
    let {store} = target
    let handler = store&&store[eventType]
    // 批量更新
    updateQueue.isBatchingUpdate = true 
    handler&&handler()
    updateQueue.batchUpdate() 
}
```



----



**合成事件**

根据原生的事件对象（event）创建合成事件对象。

- 实现兼容性处理（阻止默认行为，阻止冒泡等）

```js
function dispatchEvent(event){
    const {target,type} = event;
    let eventType = `on${type}`
    let {store} = target
    let handler = store&&store[eventType]
    // 批量更新
    updateQueue.isBatchingUpdate = true 
    let syntheticEvent = createSynctheticEvent(event)  // 创建合成事件对象
    handler&&handler(syntheticEvent)
    updateQueue.batchUpdate() 
}

function createSynctheticEvent(nativeEvent){
    let syntheticEvent = {}
    for(let key in nativeEvent){
        let value = nativeEvent[key]
        if(typeof value ==='function') value = value.bind(nativeEvent)
        syntheticEvent[key] = value
    }
    syntheticEvent.nativeEvent = nativeEvent
    // 兼容性处理
    syntheticEvent.isDefaultPrevented = false
    syntheticEvent.preventDefault = preventDefault
    
    syntheticEvent.isPropagationStopped = false
    syntheticEvent.stopPropagation = stopPropagation
}

function preventDefault(){
    this.isDefaultPrevented = true
    const nativeEvent = this.nativeEvent
    if(nativeEvent.preventDefault){
        nativeEvent.preventDefault()
    }else{
        nativeEvent.returnValue = false
    }
}

function stopPropagation(){
    this.isPropagationStopped = true
    const nativeEvent = this.nativeEvent
    if(nativeEvent.stopPropagation){
        nativeEvent.stopPropagation()
    }else{
        nativeEvent.cancelBubble = false
    }
}
```



**冒泡阶段的点击事件——onClick；捕获阶段的点击事件——onClickCapture**



---

**模拟捕获和冒泡**

模拟捕获阶段，需要实现通过数组来确定好捕获的路径。

````js

export function addEvent(dom,eventType,handler){
    //判断dom元素上有没有store属性，如果有直接返回，如果没能则赋值为空对象然后返回
    let store = dom.store ||(dom.store = {});
    //向store中存放属性和值，属性是事件类型onclick 值是一个事件函数函数
    //onClick  onClickCapture
    store[eventType.toLowerCase()]= handler;
    const eventName = eventType.toLowerCase();
  /*   if(!document[eventName]){
        document[eventName] =dispatchEvent;
    } */
    const name = eventName.replace(/Capture$/,'').slice(2);
    if(!document[name]){
        //其实在React17 前后此逻辑是有改变的
        //在React17以前是不合理的，此方法只在冒泡阶段执行，并且直接模拟捕获和冒泡二个流程
        //此event是浏览器传进来的
        document.addEventListener(eventName.slice(2).toLowerCase(),(event)=>{
            dispatchEvent(event,true);
        },true);
        document.addEventListener(eventName.slice(2).toLowerCase(),(event)=>{
            dispatchEvent(event,false);
        },false);
        document[name]=true;
    } 
}

function dispatchEvent(event,isCapture){ 
    //target事件源  type是件名称 
    const {target,type} = event;
    let eventType = `on${type}`;//onclick
    let eventTypeCapture = `on${type}capture`;//onclick
    let syntheticEvent= createSyntheticEvent(event);
    updateQueue.isBatchingUpdate=true;
    //为了跟源码一样，我们需要自己手工再次模拟捕获和冒泡的全过程
    let targetStack = [];
    let currentTarget=target;//button
    while(currentTarget){
        targetStack.push(currentTarget);//button div#counter div#root document
        currentTarget=currentTarget.parentNode;
    }
    //处理捕获阶段
    if(isCapture){
        for(let i=targetStack.length-1;i>=0;i--){
            const currentTarget = targetStack[i];
            let {store} = currentTarget;
            let handler = store&&store[eventTypeCapture];
            handler&&handler(syntheticEvent);
        }
    }else{
        //处理冒泡阶段
        for(let i=0;i<targetStack.length;i++){
            const currentTarget = targetStack[i];
            let {store} = currentTarget;
            let handler = store&&store[eventType];
            handler&&handler(syntheticEvent);
            // 调用阻止冒泡后将停止循环
            if(syntheticEvent.isPropagationStopped){
                break;
            }
        }
    }
    updateQueue.batchUpdate();
}
````



因为是React自身模拟的事件捕获和冒泡，所以走的并不是原生的捕获和冒泡。导致系统中会有两套捕获和冒泡。如果一个元素即通过React绑定了事件，也通过原生的document.getElementById获得元素后添加元素事件，这时就会存在触发时机上的不同，会先走原生的捕获和冒泡。



----

**ref**

通过ref可以获取到根据虚拟DOM生成的真实DOM，或者获取类组件对应的组件实例对象；不能直接为函数组件绑定ref，因为函数组件没有实例，给函数组件配置ref需要使用高阶组件React.forwardRef将函数组件包裹，然后使用该包裹后的组件。一般为函数组件绑定ref是为了获取函数组件中jsx部分的某个原生元素。

为普通的html元素配置ref：

```js
function createRef(){
    return {
        current:null
    }
}


function createDOM(vdom) {
    const { type, props, ref } = vdom;
    let dom;
    if (type && type.$$typeof === REACT_MEMO) {
        return mountMemoComponent(vdom);
    }else if (type && type.$$typeof === REACT_CONTEXT) {
        return mountConsumerComponent(vdom);
    }else if (type && type.$$typeof === REACT_PROVIDER) {
        return mountProviderComponent(vdom);
    }
    else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
        return mountForwardComponent(vdom);
    } else if (type === REACT_TEXT) {
        dom = document.createTextNode(props);
    } else if (typeof type == 'function') {
        if (type.isReactComponent) {
            return mountClassComponent(vdom);
        } else {
            return mountFunctionComponent(vdom);
        }
    } else {
        dom = document.createElement(type);
    }
    if (typeof props === 'object') {
        updateProps(dom, {}, props);
        if (props.children) {
            if (typeof props.children === 'object' && props.children.type) {
                props.children.mountIndex = 0;
                mount(props.children, dom);
            } else if (Array.isArray(props.children)) {
                reconcileChildren(props.children, dom);
            }
        }
    }
    vdom.dom = dom;
    //如果此虚拟DOM上有ref属性，则把ref.current的值赋成真实DOM
    if (ref) ref.current = dom; 
    return dom;
}

```



为类组件配置ref

```js
function mountClassComponent(vdom) {
    const { type: ClassComponent, props, ref } = vdom;

    const classInstance = new ClassComponent(props);//class ClassComponent
    if (ref) ref.current = classInstance;
    const renderVdom = classInstance.render();
    if(!renderVdom) return null;
    //在获取render的渲染结果后把此结果放到classInstance.oldRenderVdom进行暂存
    classInstance.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}
```





为函数组件配置ref

```js
function TextInput(props,forwardRef){
return <input ref={forwardRef}/>
}

const ForwardTextInput = React.forwardRef(TextInput);

class Form extends React.Component{
  constructor(props){
  	super(props);
	this.ref = React.createRef();
  }
  render(){
  	return ( 
      <div>
        <ForwardTextInput ref={this.ref}/>
      	<button>获得焦点</button>
      </div>
      )
  }
}
```

babel转换后的结果：

```js
function TextInput(props, forwardRef) {
  return React.createElement("input", {
    ref: forwardRef
  });
}
const ForwardTextInput = React.forwardRef(TextInput);
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  render() {
    return React.createElement("div", null, React.createElement(ForwardTextInput, {
      ref: this.ref
    }),React.createElement("button", null, "\u83B7\u5F97\u7126\u70B9"));
  }
}
```



ForwardInputText组件对应的虚拟DOM格式：

```json
{
    $$typeof:React_ELEMENT,
    type:{
        $$typeof:Symbol(react.forward.ref),
        render:f TextInput(props,forwardRef),
        //...
    },
	props:{},
	ref:this.ref
	key:null
}
```



<img src="C:\Users\dukkha\Desktop\study-notes\珠峰架构\images\image-20230620173821964.png" alt="image-20230620173821964" style="zoom:200%;" />



```js
//其实函数组件本质上就是render方法，就是接收属性，返回react元素
function forwardRef(render){
   return {
     $$typeof:REACT_FORWARD_REF_TYPE,
     render// 其实就是原来的函数组件那个函数
   }
}
```





```js
function createDOM(vdom) {
    const { type, props, ref } = vdom;
    let dom;
    if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
        return mountForwardComponent(vdom);
    }
    //在根据虚拟DOM创建真实DOM成功后，就可以建立关系
    vdom.dom = dom;
    //如果此虚拟DOM上有ref属性，则把ref.current的值赋成真实DOM
    if (ref) ref.current = dom;
    return dom;
}


function mountForwardComponent(vdom) {
    const { type, props, ref } = vdom;
    //type.render=就是TextInput
    const renderVdom = type.render(props, ref);
    if(!renderVdom) return null;
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}
```



---

生命周期函数

React15的生命周期函数。

**挂载阶段：**

- constructor
- UNSAFE_componentWillMount
- render
- componentDidMount

```js
function mountClassComponent(vdom) {
    const { type: ClassComponent, props, ref } = vdom;
    
    var defaultProps = ClassComponent.defaultProps;
    var resolvedProps = { ...defaultProps, ...props }
    
    const classInstance = new ClassComponent(resolvedProps);//class ClassComponent
    if(ClassComponent.contextType){
        classInstance.context = ClassComponent.contextType._currentValue;
    }
    //让虚拟DOM的classInstance属性指向此类的实例
    vdom.classInstance = classInstance;
    if (ref) ref.current = classInstance;
    
    // 生命周期函数UNSAFE_componentWillMount
    if (classInstance.UNSAFE_componentWillMount) {
        classInstance.UNSAFE_componentWillMount();
    }
    
    // 然后是render这个生命周期函数执行
    const renderVdom = classInstance.render();
    
    if(!renderVdom) return null;
    //在获取render的渲染结果后把此结果放到classInstance.oldRenderVdom进行暂存
    classInstance.oldRenderVdom = renderVdom;
    const dom = createDOM(renderVdom);
    
    // componentDidMount生命周期函数是在虚拟DOM生成的真实DOM插入页面后才触发
    if (classInstance.componentDidMount) {
        //把componentDidMount方法暂存到真实dom对象上
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
    }
    
    
    return dom;
}
```



componentDidMount生命周期函数的真正触发地：

````js
function mount(vdom, container) {
    //传进去虚拟DOM，返回真实DOM
    const newDOM = createDOM(vdom);
    if(newDOM){
        container.appendChild(newDOM);
        if (newDOM.componentDidMount) {
            newDOM.componentDidMount()
        }
    }
}
````



更新阶段

组件自身状态变化时触发的更新：

- shouldComponentUpdate
- UNSAFE_componentWillUpdate
- render
- componentDidUpdate



```js
function shouldUpdate(classInstance,nextProps,nextState){
    //是否要更新
    let willUpdate = true;
    //如果有shouldComponentUpdate方法，并且返回值为false的话
    if(classInstance.shouldComponentUpdate && (!classInstance.shouldComponentUpdate(
      nextProps,
      nextState
    ))){
      willUpdate=false
    }
    //如果要更新，并且存在组件将要更新的方法
    if(willUpdate && classInstance.UNSAFE_componentWillUpdate){
      classInstance.UNSAFE_componentWillUpdate();
    }
    //不管最终要不要更新页面上的组件，都会把新的状态传送给classInstance.state  *****
    classInstance.state = nextState;
    if(nextProps){
      classInstance.props = nextProps;
    }
    //让组件强制更新
    if(willUpdate)
      classInstance.forceUpdate();
}
```



```js
export class Component{
    //给类Component添加了一个静态属性 isReactComponent=true
    static isReactComponent = true
    constructor(props){
        this.props = props;
        this.state = {};
        //每个类会有一个更新器的实例
        this.updater = new Updater(this);
    }
    setState(partialState,callback){
        this.updater.addState(partialState,callback);
    }
    forceUpdate(){
       let oldRenderVdom = this.oldRenderVdom;
       const oldDOM = findDOM(oldRenderVdom);
       //根据新的状态计算新的虚拟DOM
       let newRenderVdom = this.render();
       compareTwoVdom(oldDOM.parentNode,oldRenderVdom,newRenderVdom);
       this.oldRenderVdom=newRenderVdom;
       this.updater.flushCallbacks();
        
        // 触发componentDidUpdate
       if(this.componentDidUpdate){
        this.componentDidUpdate(this.props,this.state);
       }
    }
}
```





父组件传递的属性变化时组件自身触发的更新：

- componentWillReceiveProps
- shouldComponentUpdate
- UNSAFE_componentWillUpdate
- render
- componentDidUpdate





---

涉及父子组件的完整的生命周期函数.

永远是先走父组件的render函数，然后才执行子组件中的生命周期函数。

```jsx
import React from './react';
import ReactDOM from './react-dom/client';
class Counter extends React.Component{
  //定义的默认属性
  static defaultProps = {
    name:'zhufeng'
  }
  constructor(props){
    super(props);//setup props 设置属性
    this.state = {number:0};//设置状态
    console.log('Counter 1.constructor');
  }
  UNSAFE_componentWillMount(){
    console.log('Counter 2.componentWillMount');
  }
  handleClick = ()=>{
    this.setState({number:this.state.number+1});
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log(`Counter 5.shouldComponentUpdate`);
    return nextState.number%2===0;//如果是偶数就为true,就更新，如果为奇数就不更新
  }
  UNSAFE_componentWillUpdate(){
    //组件将要更新
    console.log(`Counter 6.componentWillUpdate`);
  }
  componentDidUpdate(){
    console.log(`Counter 7.componentDidUpdate`);
  }
  render(){
    console.log('Counter 3.render');
    return (
     <div id={`counter${this.state.number}`}>
        <p>{this.state.number}</p>
        {
          this.state.number === 4?null:<FunctionCounter count={this.state.number}/>
        }
        <button onClick={this.handleClick}>+</button>
     </div>
    )
  }
  componentDidMount(){
    console.log('Counter 4.componentDidMount');
  }
}
function FunctionCounter(props){
  return (
    <div>{props.count}</div>
  )
}
class ChildCounter extends React.Component{
  UNSAFE_componentWillReceiveProps(newProps){
    console.log('ChildCounter 4.componentWillReceiveProps');
  }
  UNSAFE_componentWillMount(){
    console.log('ChildCounter 1.componentWillMount');
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log(`ChildCounter 5.shouldComponentUpdate`);
    return nextProps.count%3===0;//如果父组件传过来的count值是3的倍数就更新，否则不更新
  }
  render(){
    console.log('ChildCounter 2.render');
    return (
      <div>{this.props.count}</div>
    )
  }
  componentDidMount(){
    console.log('ChildCounter 3.componentDidMount');
  }
  componentWillUnmount(){
    console.log('ChildCounter 6.componentWillUnmount');
  }
}

const DOMRoot = ReactDOM.createRoot(
  document.getElementById('root')
);
let element = <Counter age={16}/>
DOMRoot.render(element);

/**
Counter 1.constructor
Counter 2.componentWillMount
Counter 3.render
ChildCounter 1.UNSAFE_componentWillMount
ChildCounter 2.render
ChildCounter 3.componentDidMount
Counter 4.componentDidMount

number=1
Counter 5.shouldComponentUpdate

number=2
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 4.componentWillReceiveProps
ChildCounter 5.shouldComponentUpdate
Counter 7.componentDidUpdate

number=3
Counter 5.shouldComponentUpdate

number=4
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 6.componentWillUnmount
Counter 7.componentDidUpdate

number=5
Counter 5.shouldComponentUpdate

number=6
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 1.UNSAFE_componentWillMount
ChildCounter 2.render
ChildCounter 3.componentDidMount
Counter 7.componentDidUpdate
 */
```





## React Hooks

为函数组件引入组件状态或其他副作用能力。 

### useState

为函数组件引入状态。React16.8以前函数组件是没有状态的，在函数组件中定义的变量会在每次函数组件被重新调用时，重新创建，并不会记录上一次的值。





**那hooks是如何为函数组件引入状态之类的，这些状态又是如何被记录的了？**

源码中是针对每个函数组件都有一套记录自己内部hooks调用情况的链表。

类似：

```js
const hookState = []
let hookIndex = 0

export function useState(initialState){
   	const oldState= hookState[hookIndex] = hookState[hookIndex] || typeof initialState ==='function'?initialState():initialState
    const currentIndex = hookIndex  // 每次调用hooks,他们都会记录自己是第几个被调用的
    function setState(action){
        let newState = typeof action === 'function'?action(oldState):action;
        hookState[currentIndex] = newState
        scheduleUpdate()
    }
    return [hookState[hookIndex++],setState]
}


function scheduleUpdate(){
    hookIndex = 0 
    compareTwoVdom(this.container,vodm,vdom)
}
```

