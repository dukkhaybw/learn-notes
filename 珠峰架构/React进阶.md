# React 进阶

对 React 源码、底层原理及周边生态深入的探究，将源码和底层原理分开，说明两者的区别。 Vue、React 乃至 Angular 在代码编写层面越发相似，且在设计层面都在朝着 WebComponents 标准靠近。

在环境无法提供优质的成长环境时，谨记自己创造途径：深挖一个优质的前端框架吃透它的原理，跟开发团队学习框架的思想，编码规范和学习设计模式。

学习 React 的必要性：

- 大厂

- 面试时 React 相关问题的区分度高，提高工作解决问题的能力

- 用框架锻炼个人思维和代码思想



React架构设计哲学上：

- 数据驱动视图
- 组件化
- 函数式编程
- 面向对象
- fiber



底层技术选型上：

- jsx
- 虚拟 DOM



周边生态上：

- 状态管理
- 前端路由



其他方面：

- 状态管理机制
- 事件系统
- 在前端引入 hooks 思想



React 知识体系庞大，有精密复杂的底层原理与长的知识链路。

大厂的 React 面试是最有效用导向的一个学习依据，将大厂面试的逻辑利用充分，将提升实现面试和应用。

**贴着源码讲原理并不是死磕源码，源码不等于原理。源码是代码，而原理是逻辑，代码繁杂冗长，而原理可以简洁清晰。**在一些场景下，源码可以是教具， 但是阅读源码不是抵达原理的唯一途径。

**对于体系性较强的知识，创建足够充分的上下文。**一些知识难学不是因为它有多么复杂，而是因为理解它需要上下文，如果在正确的上下文中，理解它就是很轻松的事。如果学习上下文是断裂的，那知识点就难以理解。

对于复杂度较高的知识，用现象和问题向原理提问，注意先导知识的学习（先提现象/问题，再挖原理）。

结构：

- 基础夯实

  涉及 React 的基本原理和源码，基础知识

- 核心原理

  面向日常开发中的难点，大厂面试压轴难题，框架底层的逻辑和源码设计

- 周边生态

  redux，react-router 的工作原理和设计思想

- 生产实践

  性能和设计模式，性能决定用户体验，设计模式决定研发效率。实践经验，行业里推崇的最佳实践

<img src="https://s0.lgstatic.com/i/image/M00/7E/2E/CgqCHl_O8AiAMsLrAAOzA7Lqfa0393.png" alt="Lark20201208-111532.png" data-nodeid="1041">

**学习的本质是重复，重复的结果是记住。**



## jsx 代码映射为 DOM

本节的重点是 jsx 如何转为 DOM。

jsx 中的三个重点问题（面试）：

- **jsx 的本质是什么，它和 js 之间到底是什么关系？**
- **为什么要用 jsx，不用的后果是什么？**
- **jsx 背后的功能模块是什么，这个功能模块都做了哪些事情？**

大多数开发者认为它是模版语法中的一种。目标是：通过本课时的学习目标是能用自己的话回答上面的三个问题。

```jsx
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>hello world</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```



#### jsx 的本质

**jsx 的本质是 JavaScript 的一种语法扩展，它和模版语法很接近，但是它充分具备 JavaScript 的能力。**

Facebook 公司给 jsx 的定位是：jsx 是 JavaScript 的“扩展”，而非 JavaScript 的某个版本，这就直接决定了浏览器并不会像天然支持 JavaScript 一样地支持 JSX。

**jsx 语法如何在 JavaScript 中生效？**

**JSX 会被编译为 React.createElement( )(该函数的调用), React.createElement( ) 执行后将会返回一个叫做 React Element 的 JS 对象。**

> React.createElement 是 React17 以前 babel 转化 jsx 后生成的方法调用。

JSX 在被编译后， 会被变为一个针对 React.createElement( ) 的调用。先说 JSX 是如何被编译为 React.createElement( ) 形式的调用的。

编译这个过程是由 Babel 完成。

**Babel 将 JSX 语法转换为 JavaScript 代码。**

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/5C/73/CgqCHl-BegWAbxNEAAH9HxafvWE988.png)



**JSX 其实是 React.createElement( ) 这个方法调用的语法糖形式。所以才说 JSX 充分具备 JavaScript 的能力**



**React 为什么选用 JSX？**既然 JSX 等价于 React.createElement( )调用，那 React 官方为什么不直接引导开发者使用 React.createElement( ) 来创建元素？

原因是 JSX 的书写和阅读大大优于 React.createElement( ) ，JSX 使用 HTML 标签来创建虚拟 DOM，降低学习成本同时提高研发效率和体验。

![Drawing 1.png](https://s0.lgstatic.com/i/image/M00/5C/73/CgqCHl-Beg-AXBihAA4t3S7nxKc532.png)

在实际功能效果一致的前提下，JSX 代码层次分明、嵌套关系清晰；而 React.createElement 代码则给人一种非常混乱的“杂糅感”，这样的代码不仅读起来不友好，写起来也费劲。



**JSX 映射为虚拟 DOM ：createElement 源码：**

React.createElement( ) 源码：

```js
/**
* React创建元素的方法
*/

export function createElement(type, config, children){
  // propName 变量用于存储后面需要用到的元素属性
  let propName;
  // props 变量用于存储元素属性的键值对集合
  const props = {};
  // key,ref,self,source均为React元素的属性
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // config对象中存储的是元素的属性
  if(config != null){
    // 进来后的第一件事就是依次对ref，key，self和source属性赋值
    if(hasValidRef(config)){
      ref = config.ref;
    }
    // 此处将key值字符串化
    if(hasValidKey(config)){
      key = ''+config.key;
    }
    self = config.__self === undefined ? null:config.__self;
    source = config.__source === undefined ? null:config.__source;
    
    // 接着就是要把config里面的属性都一个一个挪到props这个之前声明好的对象中
    for(propName in config){
      // 筛选出可以提进props对象中的属性
      if(hashOwnProperty.call(config,propName)) && !RESERVED_PROPS.hasOwnProperty(propsName){
        props[propName] = config[propName]
      }
    }
  }
  
  // childrenLength指的是当前元素的子元素的个数，减去的2是type和config两个参数占用的长度
  const  childrenLength = arguments.length - 2;
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点或者一个子节点
  if(childrenLength ===1){
    // 直接将这个参数的值复制给props.children
    props.children = children
  }else if(childrenLength>1){  // 处理嵌套多个子元素的情况
    // 声明一个子元素数组
    const childArray = Array(childrenLength);
    // 把子元素推进数组中
    for(let i=0;i<childrenLength;i++){
      childArray[i] = arguments[i+2];
    }
    // 最后将这个数组赋值给props.children
    props.children = childArray
  }
  // 处理defaultProps
  if(type&&type.defaultProps){
    const defaultProps = type.defaultProps;
    for(propName in defaultProps){
      if(props[propName] === undefined){
        props[propName] = defaultProps[propName]
      }
    }
  }

  // 最后返回一个调用ReactElement，执行该方法并传入刚才处理过的参数
  return ReactElement(
  	type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}
```

创建一个 React 元素需要知道的数据信息（3 个参数）：

function createElement(type, config, children)

- type:表示节点类型，html 标签，React 组件类型（类或者函数）或者 ReactFragment 类型
- config：以对象形式传入，组件标签上的所有的属性都会以键值对的形式存储在 config 对象中
- children 以对象形式传入（**因为它在被调用后也是一个虚拟 DOM 节点对象**），在这里是传参的第三项，可以是另一个 React.createElement 的调用或者字符串，它记录的是组件标签之间嵌套的内容，也就是所谓的“子节点”，“子元素”

```jsx
React.createElement(
  "ul",
  {
    // 传入属性键值对
    className: "list",
    // 从第三个入参开始往后，传入的参数都是 children
  },
  React.createElement(
    "li",
    {
      key: "1",
    },
    "1"
  ),
  React.createElement(
    "li",
    {
      key: "2",
    },
    "2"
  )
);

<ul className="list">
  <li key="1">1</li>
  <li key="2">2</li>
</ul>;
```

React.createElement（格式化数据）的函数体拆解(在逻辑层面的任务流转)：

![image-20211129192448727.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45fb1cb6f7d84fe7a6c3179266037227~tplv-k3u1fbpfcp-watermark.awebp?)

React.createElement 的处理逻辑并不复杂，基本就是**格式化数据**。

![image-20211129192712764.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ac45eecdb194bbc974e4a910be753dd~tplv-k3u1fbpfcp-watermark.awebp?)

**React.createElement 就像是开发者和 ReactElement 调用之间的一个转换器，数据格式化层。**从开发者处接受相对简单的参数，然后将这些参数按照 ReactElement 的预期做一层格式化，最终通过调用 ReactElement 来实现虚拟 DOM 的创建。

React.createElement 函数执行后会返回一个 ReactElement 函数的调用，所以重点在 ReactElement 上。

**ReactElement 源码：**

```js
const ReactElement =  function(type,key,ref,self,source,owner,props){
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,

    // 内置属性赋值
    type:type,
    key:key,
    ref:ref,
    props:props,

    //记录创造该元素的组件
    _owner:owner,
  };
  if(__DEV__){
    //这里是一些针对__DEV__环境下的处理，对于理解主要逻辑意义不大，省略
  }
  return element；
}
```

ReactElement 的代码很短，作用是组装。ReactElement 将传入的参数按照一定的规范组装进**elemnt 对象**中，并将它返回给 React.createElement，最后 React.createElement 又将该 element 对象返回，开发者可以直接获取该 JS 对象。

![image-20211129194921900.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ef569d5216e464086a0d589a1c4b757~tplv-k3u1fbpfcp-watermark.awebp?)

```jsx
const AppJSX = (
  <div className="App">
    <h1 className="title">I am the title</h1>
    <p className="content">I am the content</p>
  </div>
);

console.log(AppJSX);
```

下图就是上面的 JSX 转为的 ReactElement 实例对象：

![image-20211129195016842.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a034ebf2f99141218e01eec936cae873~tplv-k3u1fbpfcp-watermark.awebp?)



**这个 React Element 实例对象本质就是一个 Javascript 实例对象。**该 JavaScript 对象就是对 DOM 的描述，其实就是虚拟 DOM（准确地说，是虚拟 DOM 中的一个节点），它还不是真实的 DOM。将虚拟 DOM 转为真实 DOM 则是用过 ReactDOM.render( )方法来实现。

ReactDOM.render:

```js
ReactDOM.render(
  // 需要渲染的元素（ReactElement）
  element,
  // 元素挂载的目标容器（一个真实DOM）
  container,
  // 回调函数，可选参数，可以用来处理渲染结束后的逻辑
  [callback]
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

![image-20211129195738172.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ed669c7bafa450eb8929875ee358501~tplv-k3u1fbpfcp-watermark.awebp?)

jsx 语法本质；React 创建一个真实 DOM 的流程；虚拟 DOM 的初步认知。



## 生命周期函数变更及逻辑

React 入门教材对 React 生命周期的讲解过于简单粗暴，并不是背下这些生命周期函数就可以。同时也缺少对新旧 React 库中生命周期函数的变化比较和原因分析。

React16 为什么要修改生命周期函数？

从 React 的基本原理出发，对 React15，16 两版的生命周期函数进行探讨，比对和总结。建立系统而完善的生命周期知识体系。



生命周期背后的设计思想：“组件”和“虚拟 DOM”

- 虚拟 DOM 是核心算法的基石

  虚拟 DOM 在整个 React 工作流中的作用

  组件在初始化时，会通过调用生命周期中的 render 方法，生成虚拟 DOM，然后再通过调用 ReactDOM.render 方法，实现虚拟 DOM 到真实 DOM 的转换。当组件更新时，会再次调用 render 方法生成新的虚拟 DOM，然后借助 diff，定位出两次虚拟 DOM 的差异，从而针对发生变化的真实 DOM 作定向更新。 react 框架核心diff算法中虚拟 DOM 是基石。

  ![image-20211129204243978.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e29b4c76554decac9e2bc97adb05bb~tplv-k3u1fbpfcp-watermark.awebp?)

- 组件化和工程化

  每个组件都既是“封闭”的，也是“开放”的。

  “封闭”，主要是针对“渲染工作流”（指从组件数据改变到组件实际更新发生的过程）来说的。在组件自身的渲染工作流中，每个组件都只处理它内部的渲染逻辑。在没有数据流交互的情况下，组件与组件之间可以做到各自独立。

  “开放”，则是针对组件间通信来说的。React 允许开发者基于“单向数据流”的原则完成组件间的通信。而组件之间的通信又将改变通信双方/某一方内部的数据，进而对渲染结果构成影响。

render 函数算是生命周期函数中的核心，其中虚拟 DOM 的生成和组件的渲染工作流（指从组件数据改变到组件实际更新发生的过程）都离不开 render 函数，其他生命周期函数算得上组件的躯干。

可以选择性地省略对 render 之外的任何生命周期方法内容的编写，而 render 函数却坚决不能省略；倘若其他生命周期函数做了点什么，往往都会直接或间接地影响到 render 执行（因为即便是 render 之外的生命周期逻辑，也大部分是在为 render 层面的效果服务）。



### React15 中的生命周期函数

```js
constructor();
componentWillReceiveProps();
shouldComponentUpdate();
componentWillMount();
componentDidMount();
componentWillUpdate();
componentDidUpdate();
render();
componentWillUnmount();
```

` getDefaultProps 和 getInitState 这两个方法，它们都是 React.createClass() 模式下初始化数据的方法。由于这种写法在 ES6 普及后已经不常见，不再详细展开。`

<img src="https://s0.lgstatic.com/i/image/M00/5E/31/Ciqc1F-GZbGAGNcBAAE775qohj8453.png" alt="1.png" style="zoom:50%;" />



Demo 实例：

```JSX
import React from "react";
import ReactDOM from "react-dom";

// 定义子组件
class LifeCycle extends React.Component {
  constructor(props) {
    console.log("进入constructor");
    super(props);
    // state 可以在 constructor 里初始化
    this.state = { text: "子组件的文本" };
  }
  
  // 初始化渲染时调用
  componentWillMount() {
    console.log("componentWillMount方法执行");
  }
  
  // 初始化渲染时调用
  componentDidMount() {
    console.log("componentDidMount方法执行");
  }
  
  // 父组件修改组件的props时会调用
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps方法执行");
  }
  
  // 组件更新时调用
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate方法执行");
    return true;
  }

  // 组件更新时调用
  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate方法执行");
  }
  
  // 组件更新后调用
  componentDidUpdate(preProps, preState) {
    console.log("componentDidUpdate方法执行");
  }
  
  // 组件卸载时调用
  componentWillUnmount() {
    console.log("子组件的componentWillUnmount方法执行");
  }
  
  // 点击按钮，修改子组件文本内容的方法
  changeText = () => {
    this.setState({
      text: "修改后的子组件文本"
    });
  };
  
  render() {
    console.log("render方法执行");
    return (
      <div className="container">
        <button onClick={this.changeText} className="changeText">
          修改子组件文本内容
        </button>
        <p className="textContent">{this.state.text}</p>
        <p className="fatherContent">{this.props.text}</p>
      </div>
    );
  }
}

// 定义 LifeCycle 组件的父组件
class LifeCycleContainer extends React.Component {
  // state 也可以像这样用属性声明的形式初始化
  state = {
    text: "父组件的文本",
    hideChild: false
  };
  
  // 点击按钮，修改父组件文本的方法
  changeText = () => {
    this.setState({
      text: "修改后的父组件文本"
    });
  };
  
  // 点击按钮，隐藏（卸载）LifeCycle 组件的方法
  hideChild = () => {
    this.setState({
      hideChild: true
    });
  };
  
  render() {
    return (
      <div className="fatherContainer">
        <button onClick={this.changeText} className="changeText">
          修改父组件文本内容
        </button>
        <button onClick={this.hideChild} className="hideChild">
          隐藏子组件
        </button>
        {this.state.hideChild ? null : <LifeCycle text={this.state.text} />}
      </div>
    );
  }
}

ReactDOM.render(<LifeCycleContainer />, document.getElementById("root"));
```

<img src="https://s0.lgstatic.com/i/image/M00/5D/CC/Ciqc1F-FU-yAMLh0AABeqOeqLek815.png" alt="Drawing 1.png" style="zoom:50%;" />

<img src="https://s0.lgstatic.com/i/image/M00/5E/32/Ciqc1F-GZ1OAWETTAAA3Am2CwU0383.png" alt="3.png" style="zoom:50%;" />

### 挂载阶段

挂载过程中，在组件的一生中仅会发生一次，在这个过程中，组件被初始化，然后会被渲染到真实 DOM 里，完成“首次渲染”。

**constructor 方法**

仅在挂载的时候被调用一次，可以在该方法中对 this.state 进行初始化。

**componentWillMount**

在挂载阶段被调用一次，该方法会在执行 render 方法前被触发。一些开发者习惯在这个方法里做一些初始化的操作，但这些操作往往会伴随一些风险或者说不必要性。

**render 方法**

**render 函数在执行的过程中并不会去操作真实的 DOM，它的职能是把需要渲染的内容（虚拟 DOM）返回出来。**真实 DOM 的渲染工作在挂载阶段由 ReactDOM.render 完成。

**componentDidMount 方法**

在挂载阶段被调用一次，componentDidMount 方法在渲染结束后被触发，真实的 DOM 已经挂在到页面上，可以在这个生命周期里执行真实 DOM 相关的操作，异步请求，数据初始化等操作。

<img src="https://s0.lgstatic.com/i/image/M00/5D/D8/CgqCHl-FU_6AeWUcAAB8X4bjwqE102.png" alt="Drawing 3.png" style="zoom:50%;" />

### 更新阶段

**componentWillReceiveProps**

组件的更新分为两种：**一种是由父组件更新触发的更新；另一种是组件自身调用自己的 setState 触发的更新。**父组件触发的更新和组件自身的更新相比，多出了 componentWillReceiveProps(nextProps)。

<img src="https://s0.lgstatic.com/i/image/M00/5E/3C/CgqCHl-GZf-AUjsLAACmOsiQl3M485.png" alt="2.png" style="zoom:50%;" />

**componentWillReceiveProps 并不是由传给改组件的 props 的变化才触发，而是由父组件的更新触发。**

对于子组件的 componentWillReceiveProps 生命周期函数，如果父组件导致自身重新渲染，即使传给子组件的 props 没有改变，也会触发子组件的 componentWillReceiveProps 函数执行，如果只想对对应的 props 处理更改，请确保进行当前值与变更值的比较。

在这个生命周期方法里，nextProps 表示的是接收到新 props 内容，而现有的 props （相对于 nextProps 的“旧 props”）可以通过 this.props 拿到，由此便能够感知到 props 的变化。

```js
// 父组件更新的时候会触发子组件的这个生命周期函数
componentWillReceiveProps(nextProps){}
```

不准确的认知：**componentWillReceiveProps 是在父组件传递给子组件的 props 内容发生了变化时被触发的。**

正确的认知：**componentReceiveProps 并不是由 props 的变化触发的，而是由父组件的更新触发的。**

<img src="https://s0.lgstatic.com/i/image/M00/5D/E1/Ciqc1F-FaGuADV5vAACZ2YRV6qQ941.png" alt="图片7.png" style="zoom:50%;" />

**shouldComponentUpdate**

```js
shouldComponentUpdata(nextProps, nextState){};
```

render 方法伴随着**对虚拟 DOM 的构建和对比**，过程耗时长，而在 React 中很多时候不经意间就平频繁的调用了 render 函数，为了避免不必要的调用 Render，可以使用 shouldComponentUpdata 生命周期函数。React 组件会根据 shouldComponentUpdata 的返回值来决定是否执行该生命周期函数之后的生命周期函数，进而决定是否对组件进行 re-render（重渲染），shouldComponentUpdata 默认返回的值是 true。

手动在 shouldComponentUpdata 中添加判断逻辑或者直接在项目中引入 PureComponent 的最佳实践来实现有条件的 re-render。

![image-20211129224141939.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c38eeda53c64a7babfd1e40b787f634~tplv-k3u1fbpfcp-watermark.awebp?)

**componentWillUpdate**

在里面做一些不涉及真实 DOM 操作的准备工作。

![image-20211129224206273.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28f79d3b3a5e41549c62416ec4cecc1b~tplv-k3u1fbpfcp-watermark.awebp?)

**componentDidUpdate**

经常被用来处理 DOM 操作，常将 componentDidUpdate 的执行作为子组件更新完毕的标志通知到父组件。

![image-20211129224217585.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50250581a0dc4604ae50a8ef86dfad35~tplv-k3u1fbpfcp-watermark.awebp?)



### 卸载阶段

![图片6.png](https://s0.lgstatic.com/i/image/M00/5D/EC/CgqCHl-FaHuAVGc_AABE6JqN9E0073.png)

组件销毁的常见操作：

- **组件在父组件中被移除**
- **组件中设置了 key 属性，父组件在 render 的过程中，发现 key 值和上次不一致时也会销毁组件**



### React16 的生命周期函数

理解 React16.3 中的生命周期函数是什么，同时对比新旧两个版本中生命周期函数的差异以及为什么改变生命周期函数和 Fiber 架构。

React16.3 中的生命周期函数图：

![image-20211129224720004.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a7bb0edffc34552b981e4150deda7e2~tplv-k3u1fbpfcp-watermark.awebp?)

在 React16.4 之后相比于 React16.3 在生命周期函数方面做了微调。主要就是微调在更新过程中的 getDerivedStateFromProps 生命周期函数，在 React16.4 中任何因素触发的组件更新流程（包括由 this.setState 和 forceUpdate 触发的更新流程）都会触发 getDerivedStateFromProps，而在 16.3 中只有父组件的更新会触发该生命周期。

React16.4 以后的生命周期函数：

![Drawing 8.png](https://s0.lgstatic.com/i/image/M00/5D/CF/Ciqc1F-FVcSALRwNAAIomWwVcQU231.png)

**Demo：**

```js
import React from "react";
import ReactDOM from "react-dom";

// 定义子组件
class LifeCycle extends React.Component {
  constructor(props) {
    console.log("进入constructor");
    super(props);
    // state 可以在 constructor 里初始化
    this.state = { text: "子组件的文本" };
  }
  
  // 初始化/更新时调用
  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps方法执行");
    return {
      fatherText: props.text,
    };
  }
  
  // 初始化渲染时调用
  componentDidMount() {
    console.log("componentDidMount方法执行");
  }
  
  // 组件更新时调用
  shouldComponentUpdate(prevProps, nextState) {
    console.log("shouldComponentUpdate方法执行");
    return true;
  }

  // 组件更新时调用
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate方法执行");
    return "haha";
  }
  
  // 组件更新后调用
  componentDidUpdate(preProps, preState, valueFromSnapshot) {
    console.log("componentDidUpdate方法执行");
    console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
  }
  
  // 组件卸载时调用
  componentWillUnmount() {
    console.log("子组件的componentWillUnmount方法执行");
  }
  
  // 点击按钮，修改子组件文本内容的方法
  changeText = () => {
    this.setState({
      text: "修改后的子组件文本",
    });
  };
  
  render() {
    console.log("render方法执行");
    return (
      <div className="container">
        <button onClick={this.changeText} className="changeText">
          修改子组件文本内容
        </button>
        <p className="textContent">{this.state.text}</p>
        <p className="fatherContent">{this.props.text}</p>
      </div>
    );
  }
}

// 定义 LifeCycle 组件的父组件
class LifeCycleContainer extends React.Component {
  // state 也可以像这样用属性声明的形式初始化
  state = {
    text: "父组件的文本",
    hideChild: false,
  };
  
  // 点击按钮，修改父组件文本的方法
  changeText = () => {
    this.setState({
      text: "修改后的父组件文本",
    });
  };
  
  // 点击按钮，隐藏（卸载）LifeCycle 组件的方法
  hideChild = () => {
    this.setState({
      hideChild: true,
    });
  };
  
  render() {
    return (
      <div className="fatherContainer">
        <button onClick={this.changeText} className="changeText">
          修改父组件文本内容
        </button>
        <button onClick={this.hideChild} className="hideChild">
          隐藏子组件
        </button>
        {this.state.hideChild ? null : <LifeCycle text={this.state.text} />}
      </div>
    );
  }
}
 
ReactDOM.render(<LifeCycleContainer />, document.getElementById("root"));
```

Mounting 阶段：

<img src="https://s0.lgstatic.com/i/image/M00/5D/CE/Ciqc1F-FVW6AAX_PAADMEGvjdFI487.png" alt="Drawing 2.png" style="zoom:50%;" />

<img src="https://s0.lgstatic.com/i/image/M00/5F/B0/Ciqc1F-Klv6AIeOPAADAZZgLu7U105.png" alt="图片1.png" style="zoom:50%;" />

扩展：

React 16 对 render 方法也进行了一些改进。React 16 之前，render 方法必须返回单个元素，而 React 16 允许我们返回元素数组和字符串。

React 15 生命周期和 React 16.3 生命周期在挂载阶段的主要差异在于，废弃了 componentWillMount，新增了 getDerivedStateFromProps。

生命周期函数升级过程中的主要矛盾，工作流层面的改变。对现有方法的迭代细节和不在主要工作流中的[componentDidCatch](https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch) 生命周期不再进行说明。

```js
componentDidCatch(error, info);
```

此生命周期在后代组件抛出错误后被调用。 它接收两个参数：

1. `error` —— 抛出的错误。
2. `info` —— 带有 `componentStack` key 的对象，其中包含有关组件引发错误的栈信息。

`componentDidCatch()` 会在“提交”阶段被调用，因此允许执行副作用。 它应该用于记录错误之类的情况：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // "组件堆栈" 例子:
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级 UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

getDerivedStateFromProps 生命周期函数并不是代替之前的 componentWillMount 生命周期函数，componentWillMount 函数的存在本身就很鸡肋，同时危险，因此它不值得被代替而是直接被废弃了。

getDerivedStateFromProps 生命周期函数设计的目的就一个，**使用来自父组件的 props 来派生/更新自己组件的 state**。getDerivedStateFromProps 它试图替代掉 React15 中的 componentWillReceiveProps 生命周期函数。

React 团队为了明确该 getDerivedStateFromProps 生命周期函数的用途，直接从命名层面就约束了该生命周期函数的用途。 所以开发者如果不是出于该生命周期的目的来使用它的话，严格上来说都是不符合规范的。该生命周期函数会在初始化/更新时调用，因为派生组件自己的 state 在组件初始化阶段和组件更新阶段都有可能需要。

React16 以提供特定生命周期函数的形式对这类特定的诉求提供更直接的支持。



#### getDerivedStateFromProps 函数

调用该方法的注意点：

- 该方法是类的静态方法，不依赖组件实例而存在，静态方法中的 this 并不指向组件实例，因此在该方法内部访问组件实例 this 是不行的

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/5D/DA/CgqCHl-FVZSAX16PAAK3atPnbSg411.png)

- 该函数接受两个参数 props 和 state

  props：当前组件接受到的来自父组件的 props

  state：当前组件自身的 state

![image-20211130111513490.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/614066b3b4c64152874fa09373a8ec99~tplv-k3u1fbpfcp-watermark.awebp?)

- 该函数需要返回一个对象或者 null，React 库需要用该返回值来更新（派生）组件的 state，在确实没有需要使用父组件的 props 派生组件自己的 state 的时候，不用使用该生命周期函数 ，同时该返回对象对组件已有的 state 的更新动作并不是覆盖式的更新，而是针对某个属性的定向更新

![image-20211130111612016.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9f52d80d1514aa286e0e6a1354ba3cd~tplv-k3u1fbpfcp-watermark.awebp?)



Updating 阶段：

![image-20211129225830182.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd73ca49291b49e4a3920941adb017e9~tplv-k3u1fbpfcp-watermark.awebp?)

**为什么要用 getDerivedStateFromProps 代替 componentWilllReceiveProps？**

getDerivedStateFromProps 与 componentDidUpdate 一起，这个 getDerivedStateFromProps 函数涵盖过时的 componentWilllReceiveProps 的所有用例。**getDerivedStateFromProps 只专注一件事：props 到 state 的映射**。

- getDerivedStateFromProps 是试图代替 componentWilllReceiveProps 出现的
- getDerivedStateFromProps 不完全等于 componentWilllReceiveProps,其特性决定了我们曾经在 componentWillReceiveProps 里面做的事情，不能够百分百迁移到 getDerivedStateFromProps 里

getDerivedStateFromProps 作为静态方法，内部拿不到组件实例 this，这就导致开发者无法在该函数中做任何 this.setStae(),this.fetch()等可能产生副作用的操作。**React16 在强制推行只用 getDerivedStateFromProps 来完成 props 到 state 的映射，意在确保生命周期函数的行为更加能预测可控，从根源上帮助开发者避免不合理的开发方式，避免生命周期函数的滥用，也是在为 Fiber 架构铺路。**



**认识 getSnapshotBeforUpdate 函数：**

getSnapshotBeforUpdate 函数的返回值会作为 componentDidUpdate 函数的第三个参数，**该生命周期函数是在 render 函数执行之后，真实 DOM 更新之前。在该函数中可以获取到更新前的真实 DOM 和更新前后的 state 和 props 信息。**

尽管在实际工作中，需要用到这么多信息的场景并不多，但在对于实现一些特殊的需求来说，没它还真的挺难办。这里举一个非常有代表性的例子：实现一个内容会发生变化的滚动列表，要求根据滚动列表的内容是否发生变化，来决定是否要记录滚动条的当前位置。

这个需求的前半截要求我们对比更新前后的数据（感知变化），后半截则需要获取真实的 DOM 信息（获取位置），这时用 getSnapshotBeforeUpdate 来解决就再合适不过。

getSnapshotBeforUpdate 常常与 componentDidUpdate 配合使用。这个生命周期的设计初衷，是为了“与 componentDidUpdate 一起，涵盖过时的 componentWillUpdate 的所有用例”

```js
// 组件更新时调用
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log("getSnapshotBeforeUpdate方法执行");
  return "haha";
}

// 组件更新后调用
componentDidUpdate(prevProps, prevState, valueFromSnapshot) {
  console.log("componentDidUpdate方法执行");
  console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
}
```

<img src="./React进阶.assets/image-20221212232753573.png" alt="image-20221212232753573" style="zoom:50%;" />

那为什么 componentWillUpdata 要被废弃？ 因为 Fiber 架构。



### Fiber 架构

**Fiber 会使原本同步的渲染过程变成异步的**

Fiber 是 React16 对 React 核心算法的一次重写。 **该架构可以使得原本同步的渲染过程变为异步的**。在 React16 之前，每触发一次组件的更新，React 都会构建一个新的虚拟 DOM 树，通过与上一次的虚拟 DOM 树进行 diff，实现对 DOM 的定向更新，这个过程是深度优先的过程，同步渲染的递归调用栈是非常深的，只有最底层的调用返回了，整个渲染过程才会开始逐层返回。 这个漫长且不可打断的更新过程将可能对用户体验造成极大影响。同步渲染开始便会一直占用主线程，直到递归彻底完成，在这个过程当中，浏览器没有办法处理任何渲染之外的任务，会进入一种无法处理用户交互的状态，因此如果渲染时间稍微长一些，页面就可能卡顿或卡死。

而 React16 中引入的 Fiber 架构可以解决该问题，Fiber 会将一个大的更新任务拆解为许多小任务，每当执行完一个小任务后，渲染线程都会释放主线程，看看是否有优先级更高的工作要处理，确保不阻塞的情况，进而避免同步渲染带来的卡顿。在这个过程当中，渲染线程可以被打断，实现异步渲染。

- 同步渲染和异步渲染
- 任务拆解和可打断特性

<img src="https://s0.lgstatic.com/i/image/M00/5F/B0/Ciqc1F-Kl0WAO2mzAABxddWHnXI121.png" alt="图片4.png" style="zoom:50%;" />

<img src="https://s0.lgstatic.com/i/image/M00/5F/B0/Ciqc1F-Kl1CAA6pwAADpyi-xSnM494.png" alt="图片5.png" style="zoom:50%;" />



“同步”变“异步”这个过程，是如何对生命周期构成影响的?

**Fiber 架构的重要特征就是可以被打断的异步渲染模式。**但这个“打断”是有原则的，根据“能否被打断”这一标准，React 16 的生命周期被划分为了 render 和 commit 两个阶段，而 commit 阶段又被细分为了 pre-commit 和 commit。

![Drawing 13.png](https://s0.lgstatic.com/i/image/M00/5D/CF/Ciqc1F-FVn6AEtlxAAIomWwVcQU485.png)

三个阶段各自特征。

- render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动。

- pre-commit 阶段：可以读取 DOM。

- commit 阶段：可以使用 DOM，运行副作用，安排更新。

render 阶段在执行过程中允许被打断，而 commit 阶段则总是同步执行的。

为什么 render 阶段可以被打断而 commit 阶段总是同步执行？

render 阶段的操作对用户来说其实是不可见的，所以打断再重启也是零感知的。而 commit 阶段的操作设计真实 DOM 的渲染，用户可见，所以必须以同步的方式求稳。



### 同步渲染变为异步渲染对生命周期函数的影响

生命周期函数变更后面的原因：

在 Fiber 机制下，render 阶段是允许暂停、终止和重启的。当一个任务执行到一半被打断后，下一次渲染线程抢回主动权时，这个任务被重启的形式是“重复执行一遍整个任务”而非“接着上次执行到的那行代码往下走”。这就导致 render 阶段的生命周期都是有可能被重复执行的。

而 React16 中废除的 componentWillMount，componentWillUpdate，componentWillReciveProps 它们都处于 render 阶段，都可能重复被执行，而且这些 API 有被滥用时，在重复执行时可能有风险。

在这些已废除的生命周期函数中不合理的操作：

- setState
- fetch 异步请求
- 操作真实 DOM

最佳实践：

- 将上述的操作转到 componentDidxxx 中完成。 **比如在 componentWillMount 中发出异步请求，以为这样可以让网络请求回来得早一些，从而避免首次渲染白屏的情况，异步请求再怎么快也快不过（React 15 下）同步的生命周期，componentWillMount 结束后，render 马上被触发，所以首次渲染依然会在数据返回之前执行，这样做不仅不能达到目的，还会导致服务端渲染场景下的冗余请求等问题。**

- 在 Fiber 的异步渲染机制下，使用这些已废弃的函数可能导致非常严重的 bug，假设开发者在 componentWillxxx 函数中发起付款请求，由于 render 阶段的生命周期都可能重复执行，在 componentWillxxx 被打断加上重启多次后，就会发出多个付款请求。 如果开发者在 componentWillxxx 中操作真实的 DOM，那就有可能重复操作真实 DOM。

  结合上面的分析，再去思考 getDerivedStateFromProps 为何会在设计层面直接被约束为一个触碰不到 this 的静态方法，其背后的原因也就更加充分了——避免开发者触碰 this，就是在避免各种危险的操作。

- 避免在 componentWillReceiveProps 或者 componentWillUpdate 中调用 setState，从而避免重复渲染死循环。

**总的来说，React 16 改造生命周期的主要动机是为了配合 Fiber 架构带来的异步渲染机制。在这个改造的过程中，React 团队针对生命周期中长期被滥用的部分推行了具有强制性的最佳实践。这一系列的工作做下来，首先是确保了 Fiber 机制下数据和视图的安全性，同时也确保了生命周期方法的行为更加纯粹、可控、可预测。**

现有的生命周期，虽然已经对方法的最佳实践做了强约束，但是仍然无法覆盖所有的“误操作”，其中最为典型的，就是对 getDerivedStateFromProps 的滥用。关于这点，社区的讨论不是很多，但是 [React 团队给出的这篇文章](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)帮助大家规避“误操作”。



## 数据在组件间的传递

数据驱动视图。

![Drawing 1.png](https://s0.lgstatic.com/i/image/M00/60/F7/Ciqc1F-OmrSAZkEwAAA2ThydXNs410.png)

在 React 中， A 组件希望能够通过某种方式影响到 B 组件，这两个组件必须先建立数据上的连接，以实现所谓的“组件间通信”。



### 基于 props 的单项数据流

组件从概念上类似于 JavaScript 中的函数，他接受任意的传参（即 props），并返回用于描述页面展示内容的 React 元素。

组件通过修改对方的入参来完成数据通信就是可以实现的，但必须基于**单向数据流**的前提。

单项数据流：当前组件的 state 以 props 的形式传递时，只能传递到组件树中比自己层级更低的组件。

通过 props 实现：父子通信，子父通信和有共同父组件的兄弟组件之间的通信。

在使用 props 实现多层组件的数据通信时，中间层组件的属性结构和项目代码都会受到污染。

props 是单向的。子组件并不能直接将自己的数据传给父组件，但是 props 的形式可以是多样的，如果父组件传递给子组件的是一个绑定了自身上下文的函数，那么子组件在调用该函数时就可以传参给父组件中的函数。



### 发布订阅模式通信

<img src="..\typora-user-images\image-20211130202013494.png" alt="image-20211130202013494" style="zoom:50%;" />

使用发布-订阅模式的优点在于，监听事件的位置和触发事件的位置是不受限的，只要它们在同一个上下文里，就能够彼此感知。

事件的监听（订阅）和事件的触发（发布），这两个动作自然而然地对应着两个基本的 API 方法

- on()：负责注册事件的监听器，指定事件触发时的回调函数。

- emit()：负责触发事件，可以通过传参使其在触发的时候携带数据 。

- off()：负责监听器的删除。

```js
class EventEmitter {
  constructor() {
    // eventMap 用来存储事件和监听函数之间的关系
    this.eventMap = {};
  }
  // type 这里就代表事件的名称
  on(type, handler) {
    // hanlder 必须是一个函数，如果不是直接报错
    if (!(handler instanceof Function)) {
      throw new Error("请传一个函数");
    }
    // 判断 type 事件对应的队列是否存在
    if (!this.eventMap[type]) {
      // 若不存在，新建该队列
      this.eventMap[type] = [];
    }
    // 若存在，直接往队列里推入 handler
    this.eventMap[type].push(handler);
  }

  emit(type, params) {
    // 假设该事件是有订阅的（对应的事件队列存在）
    if (this.eventMap[type]) {
      // 将事件队列里的 handler 依次执行出队
      this.eventMap[type].forEach((handler, index) => {
        // 注意别忘了读取 params
        handler(params);
      });
    }
  }
  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
    }
  }
}

//为了处理传入一个事件队列中不存在的函数时，不会意外的移除掉，我们知道 splice 的第一个参数是负数时，会从数组的最后往前找。试想一下，如果传入一个不存在的函数给 off 方法，indexOf 找不到会返回 -1 ，再调用 splice 就会将队列中最后一个函数删除掉了。而使用无符号右移，-1 无符号右移的结果为 4294967295，这个数足够大，不会对原队列造成影响
```



### Context API

一种组件树全局通信的方式

- React.createContent( )

- Provider

- Consumer

```jsx
// 在创建的过程中，可以选择性地传入一个 defaultValue
const myContent = React.createContext(defaultValue)

// 从创建出的 context 对象中，可以读取到 Provider 和 Consumer
const {Provider,Consumer} = myContent

// 可以理解为“数据的 Provider（提供者）”
<Provider value={title: this.state.title, content: this.state.content}>
  <Title />
  <Content />
</Provider>

// “数据的消费者”，它可以读取 Provider 下发下来的数据
<Consumer>
  {value => <div>{value.title}</div>}
</Consumer>
```

Cosumer 不仅能够读取到 Provider 下发的数据，还能读取到这些数据后续的更新。这意味着数据在生产者和消费者之间能够及时同步。

当 Consumer 没有对应的 Provider 时，value 参数会直接取创建 context 时传递给 createContext 的 defaultValue。



老版 Context 的问题：

```jsx
// 老版Context的使用
import PropTypes from 'prop-types';

// 第二步，使用
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}
============
Button.contextTypes = {
  color: PropTypes.string
};
============


class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

// 第一步：
class MessageList extends React.Component {
  ================
  getChildContext() {
    return {color: "purple"};
  }
  ================
  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}
========================
MessageList.childContextTypes = {
  color: PropTypes.string
};
========================
```

<img src="https://s0.lgstatic.com/i/image/M00/62/8C/Ciqc1F-Sm8qAMOB0AAEcBeEv_vs533.png" alt="图片4.png" style="zoom:50%;" />

过程：

- 首先，通过给 MessageList 设置 childContextTypes 和 getChildContext，可以使其承担起 context 的生产者的角色；
- 然后，MessageList 的组件树内部所有层级的组件都可以通过定义 contextTypes 来成为数据的消费者，进而通过 this.context 访问到 MessageList 提供的数据。

旧版 context 问题：

- 代码逻辑混乱
- 不能够保证读取到祖先状态数据后续的更新

如果组件提供的一个 Context 发生了变化，而中间父组件的 shouldComponentUpdate 返回 false，那么使用到该值的后代组件不会进行更新。使用了 Context 的组件则完全失控，所以基本上没有办法能够可靠的更新 Context。[这篇博客文章](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)很好地解释了为何会出现此类问题，以及你该如何规避它。

新版 Context 改进了该问题：

新的 Context API 改进了这一点：即便组件的 shouldComponentUpdate 返回 false，它仍然可以“穿透”组件继续向后代组件进行传播，进而确保了数据生产者和数据消费者之间数据的一致性。更好的语义化的声明式写法。



### Redux

**Redux 是 JavaScript 状态容器，它提供可预测的状态管理。**

Redux 主要由三部分组成：store、reducer 和 action:

- store 是一个单一的数据源，而且是只读的
- action 是对变化的描述
- reducer 是一个函数，它负责对变化进行分发和处理， 最终将新的数据返回给 store

<img src="..\typora-user-images\image-20211130213010337.png" alt="image-20211130213010337" style="zoom:50%;" />

在 Redux 的整个工作过程中，数据流是严格单向的。

```js
// 引入 redux
import { createStore } from 'redux'
// 创建 store
const store = createStore(
    reducer,
    initial_state,  // 初始状态内容
    applyMiddleware(middleware1, middleware2, ...) // 指定中间件
);


const reducer = (state, action) => {  // 纯函数，基于某个 reducer 去创建 store 的时候，其实就是给这个 store 指定了一套更新规则

    // 此处是各种样的 state处理逻辑
    return new_state
}

// 更新规则全都写在 reducer 里
const store = createStore(reducer)


const action = {
  type: "ADD_ITEM",
  payload: '<li>text</li>'
}


import { createStore } from 'redux'
// 创建 reducer
const reducer = (state, action) => {
    // 此处是各种样的 state处理逻辑
    return new_state
}
// 基于 reducer 创建 state
const store = createStore(reducer)
// 创建一个 action，这个 action 用 “ADD_ITEM” 来标识
const action = {
  type: "ADD_ITEM",
  payload: '<li>text</li>'
}

// 使用 dispatch 派发 action，action 会进入到 reducer 里触发对应的更新
store.dispatch(action)
```

<img src="https://s0.lgstatic.com/i/image/M00/81/9F/CgqCHl_Rii2AVvUbAADn4s_6rB8369.png" alt="图片7.png" style="zoom:50%;" />



## React Hooks

面试官问 React Hooks 真正想听的是什么？

理解了 what 和 how 后，能更具象的理解理论层面的 why，对 why 的深入必然会反助到对 what 的理解和 how 的实践。

React Hooks 自从 16.8 版本以来才被更好的推广。

#### 类组件和函数组件

类组件，就是基于 ES6 Class 这种写法，通过继承 React.Component 得来的 React 组件

```jsx
class DemoClass extends React.Component {
  // 初始化类组件的 state
  state = {
    text: "",
  };
  // 编写生命周期方法 didMount
  componentDidMount() {
    // 省略业务逻辑
  }
  // 编写自定义的实例方法
  changeText = (newText) => {
    // 更新 state
    this.setState({
      text: newText,
    });
  };
  // 编写生命周期方法 render
  render() {
    return (
      <div className="demoClass">
        <p>{this.state.text}</p>
        <button onClick={this.changeText}>点我修改</button>
      </div>
    );
  }
}
```

函数组件，是以函数的形态存在的 React 组件,早期并没有 React-Hooks ，函数组件内部无法定义和维护 state，因此它还有一个别名叫“无状态组件”。

```jsx
function DemoFunction(props) {
  const { text } = props;
  return (
    <div className="demoFunction">
      <p>{`function 组件所接收到的来自外界的文本内容是：[${text}]`}</p>
    </div>
  );
}
```

#### 类组件和函数组件的对比

类组件和函数组件的对比：

- 类组件需要继承 class，函数组件不需要；
- 类组件可以访问生命周期方法，函数组件不能；
- 类组件中可以获取到实例化后的 this，并基于这个 this 做各种各样的事情，而函数组件不可以；
- 类组件中可以定义并维护 state（状态），而函数组件不可以；

类组件（面向对象编程的表征）：

- 封装和继承
- 类组件中内部预置了很多属性和方法
- 类组件的提供的 api 很多，学习成本较高
- 对于许多业务可以不适用类组件，类组件太重，同时不利于代码理解
- 代码逻辑和封装后的组件耦合使得类组件内部难以实现拆分和复用

函数组件：

- 也能处理相对复杂的交互逻辑
- 轻量，灵活，利于组织与维护，较低的学习成本
- **函数组件会捕获 render 内部的状态，这是函数组件和类组件的最大不同**（js 闭包实现）
- 有利于逻辑拆分和复用
- React 作者 Dan 早期特意为类组件和函数组件写过的[一篇非常棒的对比文章](https://overreacted.io/how-are-function-components-different-from-classes/)
- 函数组件更加契合 React 框架的设计理念



#### 为什么采用函数式组件

开发者编写声明式的代码，React 库的主要工作是及时的把声明式的代码转为命令式的 DOM 操作，把数据层的描述映射到用户可见的 UI 变化中去，这就意味着从原则上讲，React 中的数据应该总是紧紧的和渲染绑定到一起，而类组件无法做到。

**函数组件会捕获 render 内部的状态，这是函数组件和类组件的最大不同**（js 闭包实现）

代码说明：

```jsx
import React from "react";
import ReactDOM from "react-dom";

import ProfilePageFunction from "./ProfilePageFunction";
import ProfilePageClass from "./ProfilePageClass";

class App extends React.Component {
  state = {
    user: "Dan",
  };

  render() {
    return (
      <>
        <label>
          <b>Choose profile to view: </b>
          <select
            value={this.state.user}
            onChange={(e) => this.setState({ user: e.target.value })}
          >
            <option value="Dan">Dan</option>
            <option value="Sophie">Sophie</option>
            <option value="Sunil">Sunil</option>
          </select>
        </label>
        <h1>Welcome to {this.state.user}’s profile!</h1>
        <p>
          <ProfilePageFunction user={this.state.user} />
          <b> (function)</b>
        </p>
        <p>
          <ProfilePageClass user={this.state.user} />
          <b> (class)</b>
        </p>
        <p>Can you spot the difference in the behavior?</p>
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

```jsx
import React from "react";

class ProfilePage extends React.Component {
  showMessage = () => {
    alert("Followed " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}

export default ProfilePage;
```

```jsx
import React from "react";

function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}

export default ProfilePage;
```

![image-20211206185341621](..\typora-user-images\image-20211206185341621.png)

这个组件返回的是一个按钮，交互内容也很简单：点击按钮后，过 3s，界面上会弹出“Followed xxx”的文案。类似于我们在微博上点击“关注某人”之后弹出的“已关注”这样的提醒。

尝试点击基于类组件形式编写的 ProfilePage 按钮后 3s 内把用户切换为 Sophie，你就会看到如下图所示的效果：是在 Dan 的主页点击的关注，结果却提示了“Followed Sophie”！

困惑：user 的内容是通过 props 下发的，props 作为不可变值，为什么会从 Dan 变成 Sophie 呢？

因为虽然 props 本身是不可变的，但 this 却是可变的，this 上的数据是可以被修改的，this.props 的调用每次都会获取最新的 props，而这正是 React 确保数据实时性的一个重要手段。

多数情况下，在 React 生命周期对执行顺序的调控下，this.props 和 this.state 的变化都能够和预期中的渲染动作保持一致。但在这个案例中，我们通过 setTimeout 将预期中的渲染推迟了 3s，打破了 this.props 和渲染动作之间的这种时机上的关联，进而导致渲染时捕获到的是一个错误的、修改后的 this.props。

但如果我们把 ProfilePage 改造为一个像这样的函数组件：

```JS
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  };
  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };
  return (
    <button onClick={handleClick}>Follow</button>
  );
}
```

props 会在 ProfilePage 函数执行的一瞬间就被捕获，而 props 本身又是一个不可变值，因此我们可以充分确保从现在开始，在任何时机下读取到的 props，都是最初捕获到的那个 props。当父组件传入新的 props 来尝试重新渲染 ProfilePage 时，本质上是基于新的 props 入参发起了一次全新的函数调用，并不会影响上一次调用对上一个 props 的捕获。这样一来，我们便确保了渲染结果确实能够符合预期。

props 会在 ProfilePage 函数执行的瞬间就被捕获，而 props 本身有时不可变的局部变量，因此某次 ProfilePage 执行的都有自己对应的 props。——闭包。函数组件真正的将数据和渲染绑定到了一起。

函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式。



**React Hooks 是一套能够使函数组件更强大灵活的钩子函数。**

**React Hooks 产生的原因和设计动机是什么？**

函数组件比起类组件“少”了很多东西，比如生命周期、对 state 的管理等。这就给函数组件的使用带来了非常多的局限性，导致不能使用函数这种形式，写出一个真正的全功能的组件。

#### useState

useState 是一个能够为函数组件引入状态的 API。

它就像类组件中 state 对象的**某一个属性**一样，对应着一个单独的状态，允许你存储任意类型的值。

当我们在函数组件中调用 React.useState 的时候，实际上是给这个组件关联了一个状态——注意，是“一个状态”而不是“一批状态”。这一点是相对于类组件中的 state 来说的。

```js
const [state, setState] = useState(initialState);
```



#### useEffect

允许函数组件执行副作用操作。

useEffect 在一定程度上弥补了生命周期。useEffect 能够为函数组件引入副作用。过去放在 componentDidMount、componentDidUpdate 和 componentWillUnmount 三个生命周期里来做的事，现在可以放在 useEffect 里来做，比如操作 DOM、订阅事件、调用外部 API 获取数据等。

组件有副作用 → 引入 useEffect

useEffect 的触发规则：

useEffect 可以接收两个参数，分别是回调函数与依赖数组。

```js
useEffect(callBack, []);
```



- 每一次渲染后都执行的副作用：传入回调函数，不传依赖数组:

  ```jsx
  useEffect(callBack);
  ```

- 仅在挂载阶段执行一次的副作用：传入回调函数，且这个函数的返回值不是一个函数，同时传入一个空数组:

  ```js
  useEffect(() => {
    // 这里是业务逻辑
  }, []);
  ```

- 仅在挂载阶段和卸载阶段执行的副作用：传入回调函数，且这个函数的返回值是一个函数，同时传入一个空数组。假如回调函数本身记为 A， 返回的函数记为 B，那么将在挂载阶段执行 A，卸载阶段执行 B:

  ```js
  useEffect(() => {
    // 这里是 A 的业务逻辑

    // 返回一个函数记为 B
    return () => {};
  }, []);
  // 这种调用方式之所以会在卸载阶段去触发 B 函数的逻辑，是由 useEffect 的执行规则决定的：useEffect 回调中返回的函数被称为“清除函数”，当 React 识别到清除函数时，会在调用新的 effect 逻辑之前执行清除函数内部的逻辑。这个规律不会受第二个参数或者其他因素的影响，只要你在 useEffect 回调中返回了一个函数，它就会被作为清除函数来处理。
  ```

- 每一次渲染都触发，且卸载阶段也会被触发的副作用：传入回调函数，且这个函数的返回值是一个函数，同时不传第二个参数

  ```js
  useEffect(() => {
    // 这里是 A 的业务逻辑

    // 返回一个函数记为 B
    return () => {};
  });
  // 上面这段代码就会使得 React 在每一次渲染都去触发 A 逻辑，并且在下一次 A 逻辑被触发之前去触发 B 逻辑。
  // 记住，如果有一段 effect 逻辑，需要在每次调用它之前对上一次的 effect 进行清理，那么把对应的清理逻辑写进 useEffect 回调的返回函数（上面示例中的 B 函数）里
  ```

- 根据一定的依赖条件来触发的副作用：传入回调函数，同时传入一个非空的数组:

  ```js
  useEffect(() => {
    // 这是回调函数的业务逻辑
  
    // 若 xxx 是一个函数，则 xxx 会在组件每次因 num1、num2、num3 的改变而重新渲染时被触发
    return xxx;
  }, [num1, num2, num3]);
  // 示意数组是 [num1, num2, num3]。首先需要说明，数组中的变量一般都是来源于组件本身的数据（props 或者 state）。若数组不为空，那么 React 就会在新的一次渲染后去对比前后两次的渲染，查看数组内是否有变量发生了更新（只要有一个数组元素变了，就会被认为更新发生了），并在有更新的前提下去触发 useEffect 中定义的副作用逻辑。
  ```

#### 为什么需要 React Hooks？

函数组件相比于类组件来说，有着不少利好 React 组件化开发的特性，而 React-Hooks 的出现正是为了强化函数组件的能力。

**以“Why xxx”开头的这种面试题，往往都没有标准答案，但会有一些关键的“点”，只要能答出关键的点，就足以证明你思考的方向是正确的。**

函数组件相比类组件来说，有着不少能够利好 React 组件开发的特性，而 React-Hooks 的出现正是为了强化函数组件的能力。

关键点：

- 告别难以理解的 class

  - this 的执行不明，**解决方法(用 bind、现在推崇箭头函数)都是本质上用实践层面的约束来解决设计层面的问题**

  - 生命周期的学习成本高，且有**不合理的逻辑规划方式**

- 解决业务逻辑难以拆分的问题

- 逻辑常与生命周期函数耦合在一起,在这样的前提下，生命周期函数常常做一些奇奇怪怪的事情：比如在 componentDidMount 里获取数据，在 componentDidUpdate 里根据数据的变化去更新 DOM 等。如果说你只用一个生命周期做一件事，那好像也还可以接受，但是往往在一个稍微成规模的 React 项目中，一个生命周期不止做一件事情

```js
componentDidMount() {
  // 1. 这里发起异步调用
  // 2. 这里从 props 里获取某个数据，根据这个数据更新 DOM

  // 3. 这里设置一个订阅

  // 4. 这里随便干点别的什么

  // ...
}
componentWillUnMount() {
  // 在这里卸载订阅
}
componentDidUpdate() {
  // 1. 在这里根据 DidMount 获取到的异步数据更新 DOM

  // 2. 这里从 props 里获取某个数据，根据这个数据更新 DOM（和 DidMount 的第2步一样）
}
```

像这样的生命周期函数，它的体积过于庞大，做的事情过于复杂，会给阅读和维护者带来很多麻烦。最重要的是，这些事情之间看上去毫无关联，逻辑就像是被“打散”进生命周期里了一样。比如，设置订阅和卸载订阅的逻辑，虽然它们在逻辑上是有强关联的，但是却只能被分散到不同的生命周期函数里去处理，这无论如何也不能算作是一个非常合理的设计。

而在 Hooks 的帮助下，我们完全可以把这些繁杂的操作按照逻辑上的关联拆分进不同的函数组件里：我们可以有专门管理订阅的函数组件、专门处理 DOM 的函数组件、专门获取数据的函数组件等。Hooks 能够帮助我们实现业务逻辑的聚合，避免复杂的组件和冗余的代码。

hooks 能多次书写，所以能实现更好的逻辑拆分。

- 使状态逻辑复用变得简单可行

  过去复用状态逻辑，靠的是 HOC（高阶组件）和 Render Props 这些组件设计模式，这是因为 React 在原生层面并没有为我们提供相关的途径。但这些设计模式并非万能，它们在实现逻辑复用的同时，也破坏着组件的结构，其中一个最常见的问题就是“嵌套地狱”现象。Hooks 可以视作是 React 为解决状态逻辑复用这个问题所提供的一个原生途径。现在可以通过自定义 Hook，达到既不破坏组件结构、又能够实现逻辑复用的效果。

- 函数组件从设计思想上更加契合 React 的理念(具体内容看上一讲)



#### hooks 的不足

- Hooks 暂时还不能完全地为函数组件补齐类组件的能力：比如 getSnapshotBeforeUpdate、componentDidCatch 这些生命周期，目前都还是强依赖类组件的。
- “轻量”几乎是函数组件的基因，这可能会使它不能够很好地消化“复杂”：我们有时会在类组件中见到一些方法非常繁多的实例，如果用函数组件来解决相同的问题，业务逻辑的拆分和组织会是一个很大的挑战。
- Hooks 在使用层面有着严格的规则约束,牢记并践行 Hooks 的使用原则。

问题：

React 官方不建议在 useEffect 中执行 DOM 操作，因为 useEffect 的执行时机是在浏览器完成整个布局和绘制之后执行的，此时执行 DOM 操作会引发浏览器的重渲染，会产生性能损耗对用户造成视觉阻塞的问题。对 DOM 操作建议使用 useLayoutEffect 中执行，这个 Hooks 会在 DOM 挂载后就执行。

解答：

这个理解一半对一半不对。两个钩子的区别在于，useEffect 是异步的，要等到浏览器将所有变化渲染到屏幕后才会被执行；而 useLayoutEffect 是同步的——这是执行时机上的区别，这块你应该是理解的。问题在于：1.React 官方真的不建议使用 useEffect 操作 DOM 吗？我在官方网站上找到了相反的描述：“尽可能使用标准的 useEffect 以避免阻塞视觉更新（出自 https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect）”。 2. useEffect 会造成视觉阻塞吗？恰恰相反，因为 useLayoutEffect 是同步渲染的机制，而 useEffect 是异步非阻塞的渲染，所以说阻塞渲染的恰恰是 useLayoutEffect 而不是 useEffect。如果你有一段逻辑确实存在“阻塞渲染”这个同步的需求，那么可以使用 useLayoutEffect。否则就应该像 React 官网原文所说的那样，“尽可能使用标准的 useEffect 以避免阻塞视觉更新”



### React-Hooks 工作机制

**React 团队面向开发者给出了两条 React-Hooks 的使用原则：**

- **只在函数组件中使用 hooks，在普通函数中引入意义不大**

- **不要在循环语句，条件语句和嵌套函数中调用 Hook（目的：确保 Hooks 在每次函数组件被重新执行时都和第一次挂载时保持同样的执行顺序）**

#### 为什么顺序如此重要？

hooks 的实现机制导致顺序非常重要。

问题：如果不保证 Hooks 执行顺序，会带来什么麻烦？

合理的代码：

```jsx
import React, { useState } from "react";

function PersonalInfoComponent() {
  // 集中定义变量
  let name, age, career, setName, setCareer;

  // 获取姓名状态
  [name, setName] = useState("修言");

  // 获取年龄状态
  [age] = useState("99");

  // 获取职业状态
  [career, setCareer] = useState("我是一个前端，爱吃小熊饼干");

  // 输出职业信息
  console.log("career", career);

  // 编写 UI 逻辑
  return (
    <div className="personalInfo">
      <p>姓名：{name}</p>
      <p>年龄：{age}</p>
      <p>职业：{career}</p>
      <button
        onClick={() => {
          setName("秀妍");
        }}
      >
        修改姓名
      </button>
    </div>
  );
}

export default PersonalInfoComponent;
```

不合理的代码：

```jsx
import React, { useState } from "react";
// isMounted 用于记录是否已挂载（是否是首次渲染）
let isMounted = false;
function PersonalInfoComponent() {
  let name, age, career, setName, setCareer;

  // 这里追加对 isMounted 的输出，这是一个 debug 性质的操作
  console.log("isMounted is", isMounted);
  // 这里追加 if 逻辑：只有在首次渲染（组件还未挂载）时，才获取 name、age 两个状态
  if (!isMounted) {
    // eslint-disable-next-line
    [name, setName] = useState("修言");
    // eslint-disable-next-line
    [age] = useState("99");

    // if 内部的逻辑执行一次后，就将 isMounted 置为 true（说明已挂载，后续都不再是首次渲染了）
    isMounted = true;
  }

  // 对职业信息的获取逻辑不变
  [career, setCareer] = useState("我是一个前端，爱吃小熊饼干");
  // 这里追加对 career 的输出，这也是一个 debug 性质的操作
  console.log("career", career);
  // UI 逻辑的改动在于，name和age成了可选的展示项，若值为空，则不展示
  return (
    <div className="personalInfo">
      {name ? <p>姓名：{name}</p> : null}
      {age ? <p>年龄：{age}</p> : null}
      <p>职业：{career}</p>
      <button
        onClick={() => {
          setName("秀妍");
        }}
      >
        修改姓名
      </button>
    </div>
  );
}
export default PersonalInfoComponent;
```

不合理的代码在初次挂载该组件时是正常的，和上面的合理的代码展示的效果一样。都涉及对 name，age 和 career 三个状态的获取和渲染。但是不合理的代码中变化发生在单击修改姓名按钮后触发的二次渲染里，

二次渲染时 isMounted 为 true，导致 if 语句直接跳过，按照代码中的设计意图，希望在二次渲染时只获取并展示 career。实际效果直接报错。 因为组件渲染的 Hooks 比期望的要少。 **按照不合理代码的逻辑，初次挂载时调用了三次 useState 函数，而二次渲染时只调用了一次 useState。**

![image-20211201111307509](..\typora-user-images\image-20211201111307509.png)

初次挂载时，不合理代码的控制台输出：

![image-20211201111542420](..\typora-user-images\image-20211201111542420.png)

单击修改姓名按钮，二次渲染时：

![image-20211201111629417](..\typora-user-images\image-20211201111629417.png)

可以从输出结果看出一下情况：

在点击按钮修改姓名时，调用的是 setName 方法，所以修改的应该是 name 数据对应的值（事实上修改也确实是 name 的值），但是在二次渲染时，在打印 career 数据时，打印的却是 name 对应的值，也就是说这个 useState 返回的是 name 对应的数据。

#### Hooks 的正常运行在底层依赖的是顺序链表

React Hooks 在源码层面和 Fiber 关系密切。所以针对关键方法做重点分析，重点不是源码中的每行和 hooks 相关的代码都做了什么，而是搞清楚整个调用链路是什么样的，理解 hooks 在每个关键环节做的事情，同时理解这些关键环节是如何对最终结果产生影响，最后理解 hooks 的工作机制。

以 useState 为例子分析 react-hooks 的调用链路：

**react-hooks 的调用链路在首次渲染和更新阶段是不同的。**

首次渲染：

在这个流程中 useState 触发的一系列操作，最后会落到 mountState 函数中，重点就是 mountState。

![image-20211201112742487](..\typora-user-images\image-20211201112742487.png)

在这个流程中，useState 触发的一系列操作最后会落到 mountState 里面去，所以重点需要关注的就是 mountState 做了什么事情，**mountState 的源码**：

```js
function mountState(initialState) {
  // 将新的hook对象追加进链表尾部
  var hooks = mountWorkInProgressHook();

  // initialState可以是一个回调函数，若是回调函数，则取回调执行后的结果作为initialState
  if (typeof initialState === "function") {
    initialState = initialState();
  }

  // 创建当前hook对象的更新队列，这一步主要是为了能依照顺序保留dispatch
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // 将initialState作为一个‘记忆值’存下来
  hook.memoizedState = hook.baseState = initialState;

  // dispatch是由上下文中一个叫dispatchAction的方法创建的
  var dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    currentlyRenderingFiber$1,
    queue
  ));

  // 返回目标数组，dispatch其实就是setXxx函数
  returne[(hook.memoizedState, dispatch)];
}
```

从这段源码中可以看出，mounState 的zz主要工作是初始化 Hooks。在整段源码中，最需要关注的是 mountWorkInProgressHook 方法，它道出了 Hooks 背后的数据结构组织形式。

**mountWorkInProgressHook 源码：**

```js
function mountWorkInProgressHook(){
    // 单个的hook是以对象形式存在
    var hook = {
        memoizedState:null,
        baseState:null,
        baseQueue:null,
        queue:null,
        next:null
    };

    if(workInProgressHook ===null){
        // 将hook作为链表的头节点处理
        firstWorkInProgressHook = workInProgressHook = hook;
    }esle{
        // 若链表不为空，则将hook追加到链表的尾部
        workInProgressHook = workInProgressHook.next = hook
    }

    // 返回当前的hook
    return workInProgressHook
}
```

**hook 相关的所有信息收敛在一个 hook 对象里，而 hook 对象之间以单向链表的形式相互串联。**

更新渲染：

首次挂载和更新渲染的区别在于调用的是 mountState 还是 updateState。

![image-20211201115451558](..\typora-user-images\image-20211201115451558.png)

updateState 之后的操作链路，虽然涉及的代码有很多，但其实做的事情很容易理解：**按顺序去遍历之前构建好的链表，取出对应的数据信息进行渲染。**

**mountState（首次渲染）构建链表并渲染；updateState 依次遍历链表并渲染。hooks 的渲染是通过“依次遍历”来定位每个 hooks 内容的。如果前后两次读到的链表在顺序上出现差异，那么渲染的结果自然是不可控的。**

这个现象有点像我们构建了一个长度确定的数组，数组中的每个坑位都对应着一块确切的信息，后续每次从数组里取值的时候，只能够通过索引（也就是位置）来定位数据。也正因为如此，在许多文章里，都会直截了当地下这样的定义：Hooks 的本质就是数组。**但读完这一课时的内容你就会知道，Hooks 的本质其实是链表。**

回看前面不合理的代码：

三个 hooks 首次渲染时都会执行

```js
[name, setName] = useState("修言");
[age] = useState("99");
[career, setCareer] = useState("我是一个前端，爱吃小熊饼干");
```

由首次渲染生成的链表结构：

![image-20211201120036568](..\typora-user-images\image-20211201120036568.png)

当首次渲染结束，进行二次渲染的时候，实际发生的 useState 调用只有一个：

```js
useState("我是一个前端，爱吃小熊饼干");
```

![image-20211201120127111](..\typora-user-images\image-20211201120127111.png)

但是链表的结构是由首次渲染就确定了的，如下图：

<img src="..\typora-user-images\image-20211201120159572.png" alt="image-20211201120159572" style="zoom:50%;" />

再复习一遍更新（二次渲染）的时候会发生什么事情：updateState 会依次遍历链表、读取数据并渲染。注意这个过程就像从数组中依次取值一样，是完全按照顺序（或者说索引）来的。因此 React 不会看你命名的变量名是 career 还是别的什么，它只认你这一次 useState 调用，于是它难免会认为：原来你想要的是第一个位置的 hook 啊。

![图片16.png](https://s0.lgstatic.com/i/image/M00/67/65/CgqCHl-hJe2ATIhGAAHpze3gFHg893.png)

如此一来，career 就自然而然地取到了链表头节点 hook 对象中的“秀妍”这个值。



## 虚拟 DOM

react 选择虚拟 DOM 真的是为了性能考虑吗？

纯静态页面=>jQuery=>MVVM

#### **为什么需要虚拟 DOM？**（面试）

比较常见的回答思路是： DOM 操作是很慢的，而 JS 却可以很快，直接操作 DOM 可能会导致频繁的回流与重绘，JS 不存在这些问题。因此虚拟 DOM 比原生 DOM 更快。 其实并不一定是如此。

#### 虚拟 DOM 是什么？

- 虚拟 DOM 是 JS 对象
- 虚拟 DOM 是对真实 DOM 的描述

**虚拟 DOM（Virtual DOM）本质上是 JS 和 DOM 之间的一个映射缓存，它在表现形态上是 js 中的对象类型，一个能够描述 DOM 结构（树结构）及其属性信息。**

虚拟 DOM 在 React 中的结构：

<img src="..\typora-user-images\image-20211201121815904.png" alt="image-20211201121815904" style="zoom:50%;" />

#### 虚拟 DOM 参与的工作流

React 中的虚拟 DOM 是如何工作的？

虚拟 DOM 在组件的挂载和更新阶段都会产生。

- 挂载阶段，React 将结合 JSX 的描述，构建出虚拟 DOM 树，然后通过 ReactDOM.render 实现虚拟 DOM 到真实 DOM 的映射（触发渲染流水线）

- 更新阶段，页面的变化在作用于真实 DOM 之前，会先作用于虚拟 DOM，虚拟 DOM 将在 JS 层借助算法先对比出具体有哪些真实 DOM 需要被改变，然后再将这些改变作用于真实 DOM

#### 为什么需要虚拟 DOM？ 虚拟 DOM 是否伴随着更好的性能？ 虚拟 DOM 的优势是什么？

虚拟 DOM 相对于过往的 DOM 操作解决方案来说，是一个新生事物。要想理解一个新生事物存在、发展的合理性，必须将其放在一个足够长的、合理的上下文中去讨论。

下面就是历史上下文：

#### DOM 操作方案的发展

原生 js 操作 DOM：

- 原生 JS 提供的 DOM API，实在是太难用

jQuery:

- 为了能够实现高效的开发，jQuery 首先解决的就是“API 过长”——它将 DOM API 封装为了相对简单和优雅的形式，同时一口气做掉了跨浏览器的兼容工作，并且提供了链式 API 调用、插件扩展等一系列能力

- jQuery 使操作 DOM 变得简单，但它并不能从根本上解决 DOM 操作量过大情况下前端侧的压力

模板引擎：

由于模板引擎更倾向于点对点解决烦琐 DOM 操作的问题，它在能力和定位上既不能够、也不打算替换掉 jQuery，两者是和谐共存的。

模板引擎一般需要做下面几件事情：

1. 读取 HTML 模板并解析它，分离出其中的 JS 信息；
2. 将解析出的内容拼接成字符串，动态生成 JS 代码；
3. 运行动态生成的 JS 代码，吐出“目标 HTML”；
4. 将“目标 HTML”赋值给 innerHTML，触发渲染流水线，完成真实 DOM 的渲染。

with 加上 new Function。

每次数据发生变化，不需要关心具体是那个 DOM 的数据发生变化，也不用手动点对点完成 DOM 的修改，只需要关注数据和数据变化本身，DOM 层的改变，模板引擎会处理。

模板引擎出现的契机虽然是为了使用户界面与业务数据相分离，但实际的应用场景基本局限在“实现高效的字符串拼接”这一个点上，因此不能指望它去做太复杂的事情。尤其令人无法接受的是，它在性能上的表现并不尽如人意：由于不够“智能”，它更新 DOM 的方式是将已经渲染出 DOM 整体注销后再整体重渲染，并且不存在更新缓冲这一说。在 DOM 操作频繁的场景下，模板引擎可能会直接导致页面卡死。

数据驱动视图

模板引擎的数据驱动视图方案，核心问题在于对真实 DOM 的修改过于“大刀阔斧”，导致了 DOM 操作的范围过大、频率过高，进而可能会导致糟糕的性能。既然操作真实 DOM 对性能损耗这么大，那操作假的 DOM 不就行了？由此逐渐衍生出虚拟 DOM。

**虚拟 DOM 如何解决问题？**

早期模板引擎：

<img src="..\typora-user-images\image-20211201134124667.png" alt="image-20211201134124667" style="zoom:50%;" />

虚拟 DOM：

<img src="..\typora-user-images\image-20211201134145629.png" alt="image-20211201134145629" style="zoom:50%;" />

模板：虚拟 DOM 在实现上并不总是借助模板，比如 React 就是使用 JSX 这种使用体验看上去像模板，但本质是 JS 语法糖。

多出的一层虚拟 DOM 层作为缓冲层，当 DOM 操作频繁时先将前后两次的虚拟 DOM 树进行 diff 比较，定位出具体需要更新的部分，生成一个补丁集，最后只把补丁打在需要更新的那部分真实 DOM 上，实现精确的差量更新。（兼顾了开发体验和相对不错的性能）。

**差量更新可以确保虚拟 DOM 既能够提供高效的开发体验（开发者只需要关心数据），又能够保持过得去的性能（只更新发生了变化的那部分 DOM）。**

<img src="..\typora-user-images\image-20211201134705489.png" alt="image-20211201134705489" style="zoom:50%;" />

> 图中的 diff 和 patch 其实都是函数名，这些函数取材于一个独立的[虚拟 DOM 库](https://github.com/Matt-Esch/virtual-dom)。之所以写明了具体流程对应的函数名,很多面试官习惯于用函数名指代过程，但不少人不清楚这个对应关系（尤其是 patch），会非常影响作答。

#### React 选用虚拟 DOM，真的是为了更好的性能吗？

在整个 DOM 操作的演化过程中，主要矛盾并不在于性能，在于研发体验/研发效率。虚拟 DOM 正是前端开发们为了追求更好的研发体验和研发效率而创造出来的高阶产物。

**虚拟 DOM 并不一定会带来更好的性能，React 官方也从来没有把虚拟 DOM 作为性能层面的卖点对外输出过。**虚拟 DOM 的优越之处在于，它能够在提供更高效的研发模式（也就是函数式的 UI 编程方式）的同时，仍然保持一个还不错的性能。

性能问题属于前端领域复杂度比较高的问题。当我们量化性能的时候，往往并不能只追求一个单一的数据，而是需要结合**具体的参照物、渲染的阶段、数据的吞吐量等**各种要素来作**分情况**的讨论。

早期模板渲染和虚拟 DOM 渲染性能比较：

<img src="..\typora-user-images\image-20211201140623341.png" alt="image-20211201140623341" style="zoom:50%;" />

从图中可以看出，模板渲染的步骤 1 和虚拟 DOM 渲染的步骤 1、2 都属于 JS 范畴的行为，这两者是具备可比性的，放在一起来看：动态生成 HTML 字符串的过程本质是对字符串的拼接，对性能的消耗是有限的；而虚拟 DOM 的构建和 diff 过程逻辑则相对复杂，它不可避免地涉及递归、遍历等耗时操作。因此在 JS 行为这个层面，模板渲染胜出。

模板渲染的步骤二 和虚拟 DOM 渲染的步骤三都是 DOM 范畴的行为，两者具备可比性，因此我们仍然可以进行性能对比。模板渲染的步骤二是全量更新，虚拟 DOM 渲染的步骤三是差量更新。 初始一看一定觉得差量更新优于全量更新。但特殊的情况是：

数据内容变化非常大（或者说整个发生了改变），促使差量更新计算出来的结果和全量更新极为接近（或者说完全一样）。

在这种情况下，DOM 更新的工作量基本一致，而虚拟 DOM 却伴随着开销更大的 JS 计算，此时会出现的一种现象就是模板渲染和虚拟 DOM 在整体性能上难分伯仲：若两者最终计算出的 DOM 更新内容完全一致，那么虚拟 DOM 大概率不敌模板渲染；但只要两者在最终 DOM 操作量上拉开那么一点点的差距，虚拟 DOM 就将具备战胜模板渲染的底气。**因为虚拟 DOM 的劣势主要在于 JS 计算的耗时，而 DOM 操作的能耗和 JS 计算的能耗根本不在一个量级，极少量的 DOM 操作耗费的性能足以支撑大量的 JS 计算（极少量的 DOM 操作耗费的性能远远大于 JS 计算）。**

当然，上面讨论的这种情况相对来说比较极端。在实际的开发中，更加高频的场景是这样的：每次 setState 的时候只修改少量的数据，比如一个对象中的某几个属性，再比如一个数组中的某几个元素。在这样的场景下，模板渲染和虚拟 DOM 之间 DOM 操作量级的差距就完全拉开了，虚拟 DOM 将在性能上具备绝对的优势。

**重点明白：虚拟 DOM 的价值不在性能提升，因此想要从性能角度来把握虚拟 DOM 的优势有点缘木求鱼。**

站在“虚拟 DOM 解决了哪些关键问题”这个视角，一些业内关于虚拟 DOM 的共识：

虚拟 DOM 解决的关键问题：

- 研发体验/研发效率的问题：DOM 操作模式的每一次革新，背后都是前端对效率和体验的进一步追求。虚拟 DOM 的出现，为数据驱动视图这一思想提供了高度可用的载体，使得前端开发能够基于函数式 UI 的编程方式实现高效的声明式编程。
- 跨平台的问题：虚拟 DOM 是对真实渲染内容的一层抽象。若没有这一层抽象，那么视图层将和渲染平台紧密耦合在一起，为了描述同样的视图内容，你可能要分别在 Web 端和 Native 端写完全不同的两套甚至多套代码。但现在中间多了一层描述性的虚拟 DOM，它描述的东西可以是真实 DOM，也可以是 iOS 界面、安卓界面、小程序......同一套虚拟 DOM，可以对接不同平台的渲染逻辑，从而实现“一次编码，多端运行”，如下图所示。其实说到底，跨平台也是研发提效的一种手段，它在思想上和 1 是高度呼应的。

<img src="..\typora-user-images\image-20211201143134344.png" alt="image-20211201143134344" style="zoom:50%;" />

虚拟 DOM 的其他亮点：

- 差量更新

- 批量更新，它在通用[虚拟 DOM 库](https://github.com/Matt-Esch/virtual-dom)中由 batch 函数来处理，但差量更新速度非常快的情况下，用户实际只能看到的最后一次差量更新的效果，这种场景下，前面的多次更新动作意义不大但是都触发重新渲染流程，带来大量不必要的高耗能操作，这时 batch 就能缓冲每次生成的补丁集，把收集到的多个补丁集暂存到队列中，再将最终的结果交给渲染函数，最终实现集中化的 DOM 批量更新



## React 中的"栈调和"（Stack Reconciler）

如果不清楚 React 15 的运作机制，就无从把握它的局限性；如果不能确切地把握 React 15 的局限性，就无法从根本上理解 React 16 大改版背后的设计动机。

理解 React15 中的栈调和算法。

> 概念辨析：调和与 Diff 的确切定义
>
> Virtual DOM 是一种编程概念。在这个概念里，UI 以一种理想化的，或者说“虚拟的”表现形式被保存于内存中，并通过如 ReactDOM 等类库使之与“真实的” DOM 同步。 这一过程叫作协调（调和）。
>
> **将虚拟 DOM 与“真实的” DOM 映射的过程**叫作协调（调和）。

**因此严格来说，调和过程并不能和 Diff 画等号。调和是“使一致”的过程，而 Diff 是“找不同”的过程，它只是“使一致”过程中的一个环节。**

React 的源码从大板块来划分的话，划分为：Core，Render 和 Reconciler 三部分。

调和器所做的工作是一系列的，包括组件的挂载、卸载、更新等过程，其中更新过程涉及对 Diff 算法的调用。在如今大众的认知里，当我们讨论调和的时候，其实就是在讨论 Diff。这样的认知也有其合理性，因为**Diff 确实是调和过程中最具代表性的一环**。

**根据 Diff 实现形式的不同，调和过程被划分为以 React15 为代表的栈调和以及 React16 中的 Fiber 调和。在实际的面试过程中当面试官抛出 Reconciliation 相关问题时，多半也是在考察候选人对 Diff 的了解程度。**

React15 中的 Diff 算法（栈调和）：

Diff 的设计思想：在计算机科学中，要想找出两个树结构之间的不同，传统的计算方法通过循环递归进行树节点的一一对比。这个过程的算法复杂度是 O(n^3)，性能非常差。React 团队结合设计和实践层面给的思考，为了将复杂度降低到 O(n)，确定两个大原则：

- **如果两个组件属于同一个类型，那么他们将拥有相同的 DOM 树形结构**

- **处于同一层级的一组子节点，可用通过设置 key 作为唯一标识从而维持各个节点在不同渲染过程中的稳定性**

- **DOM 节点之间的跨层级操作并不多，同层级操作是主流（实践规律）**

Diff 算法基于上面的三点书写的算法中的要点：

1. DOM 节点之间的跨层级操作并不多，同层级操作是主流（实践规律）

- **Diff 算法性能突破的关键点在于“分层对比”，改变算法的时间复杂度量级，只针对同层级的节点进行对比**

  ![image-20211201160413600](..\typora-user-images\image-20211201160413600.png)

  只需要从上到下的一次遍历，就可以完成对整棵树的对比，这是降低复杂度量级的最重要的设计，虽然栈调和将传统的树对比算法优化为分层对比，但整个算法仍然是以递归的形式运行的，分层递归也是递归。

  如果发生跨层级的节点操作，这种情况就是次要矛盾，在这种情况下，react 并不能判断下图移动的这个行为，他只能机械的认为移除子树那层的组件消失了，对应子树需要被销毁，而移入子树的那层则新建一个组件（设计组件的销毁和重建，性能不高），所以不建议做跨层级操作，保持 DOM 结构的稳定性。

  ![image-20211201160947912](..\typora-user-images\image-20211201160947912.png)

2. **如果两个组件属于同一个类型，那么他们将拥有相同的 DOM 树形结构**

- **类型一致的节点才有继续 Diff 的必要性**

  ![image-20211201162709719](..\typora-user-images\image-20211201162709719.png)

如果参与 Diff 的两个节点类型不同，那直接放弃对他们及其子节点的比较 ，直接整体替换节点，只有确认节点类型相同后，react 才会在保留组件对应 DOM 树的基础上尝试深入遍历和递归。

3.  **处于同一层级的一组子节点，可用通过设置 key 作为唯一标识从而维持各个节点在不同渲染过程中的稳定性**

- **key 属性的设置，可以帮助我们尽可能重用同一层级内的节点，维持节点的稳定性，重用节点**

  > key 是用来帮助 React 识别哪些内容被更改、添加或者删除。key 需要写在用数组渲染出来的元素内部，并且需要赋予其一个稳定的值。**稳定在这里很重要**，因为如果 key 值发生了变更，React 则会触发 UI 的重渲染。

  试图解决同一层级下节点的重用问题。

  没有 key 的情况：

  ![image-20211201163627853](..\typora-user-images\image-20211201163627853.png)

图中 A 组件在保持类型和其他属性均不变的情况下，在两个子节点（B 和 D）之间插入了一个新的节点（C）。按照已知的 Diff 原则，两棵树之间的 Diff 过程应该是这样的：

- 首先对比位于第 1 层的节点，发现两棵树的节点类型是一致的（都是 A），于是进一步 Diff；

- 开始对比位于第 2 层的节点，第 1 个接受比较的是 B 这个位置，对比下来发现两棵树这个位置上的节点都是 B，过；

- 第 2 个接受比较的是 D 这个位置，对比 D 和 C，发现前后的类型不一致，直接删掉 D 重建 C；

- 第 3 个接受比较的是 E 这个位置，对比 E 和 D，发现前后的类型不一致，直接删掉 E 重建 D；

- 最后接受“比较”的是树 2 的 E 节点这个位置，这个位置在树 1 里是空的，也就是说树 2 的 E 是一个新增节点，所以新增一个 E。

C、D、E 三个节点，其实都是可以直接拿来用的。原本新增 1 个节点就能搞定的事情，现在却又是删除又是重建。而且这个操作不像跨层级移动节点，后者本来就是低频操作，后者加以合理的最佳实践进行约束就能很好的避免后者情况的出现，但是对于同层级的节点插入，删除的操作是很常见的，没法避免，所以就需要针对性的进行优化。 没有设定 key 值的时候，Diff 的过程就正如上文所描述的一样。

按照规范加装一个合适的 key，这个 key 就会像一个记号一样，帮助 React “记住”某一个节点，从而在后续的更新中实现对这个节点的追踪。比如说刚刚那棵虚拟 DOM 树，若我们给位于第 2 层的每一个子节点一个 key 值，如下图所示：

![Drawing 9.png](https://s0.lgstatic.com/i/image/M00/6C/15/Ciqc1F-qYkOANYXaAAC2tCBcU4k280.png)

这个 key 就充当了每个节点的 ID（唯一标识），有了这个标识之后，当 C 被插入到 B 和 D 之间时，React 并不会再认为 C、D、E 这三个坑位都需要被重建——它会通过识别 ID，意识到 D 和 E 并没有发生变化（D 的 ID 仍然是 1，E 的 ID 仍然是 2），而只是被调整了顺序而已。接着，React 便能够轻松地重用它“追踪”到旧的节点，将 D 和 E 转移到新的位置，并完成对 C 的插入。这样一来，同层级下元素的操作成本便大大降低。

作为一个节点的唯一标识，在使用 key 之前请务必确认 key 值的唯一和稳定。

以上就是 React15 中栈调和diff算法的核心逻辑。

虚拟 DOM 中还有 batch，描述的是批处理机制。这个机制和 diff 一样，在 react 中都可以由 setState 来触发。



## setState 详解

面试题：

```jsx
import React from "react";

export default class App extends React.Component {
  state = {
    count: 0,
  };

  increment = () => {
    console.log("increment setState前的count", this.state.count);
    this.setState({
      count: this.state.count + 1,
    });
    console.log("increment setState后的count", this.state.count);
  };

  triple = () => {
    console.log("triple setState前的count", this.state.count);
    this.setState({
      count: this.state.count + 1,
    });
    this.setState({
      count: this.state.count + 1,
    });
    this.setState({
      count: this.state.count + 1,
    });
    console.log("triple setState后的count", this.state.count);
  };

  reduce = () => {
    setTime(() => {
      console.log("reduce setState前的count", this.state.count);
      this.setState({
        count: this.state.count - 1,
      });
      console.log("reduce setState后的count", this.state.count);
    }, 0);
  };

  render() {
    return (
      <div>
        <button onClick={this.increment}>点击increment</button>
        <button onClick={this.triple}>点击triple</button>
        <button onClick={this.reduce}>点击reduce</button>
      </div>
    );
  }
}
```

<img src="..\typora-user-images\image-20220424225732454.png" alt="image-20220424225732454" style="zoom:50%;" />

问题：从左向右依次点击每个按钮，控制台输出？

<img src="..\typora-user-images\image-20211201164908886.png" alt="image-20211201164908886" style="zoom:50%;" />



**注意，在React18以后打印的结果是：00 11 22**

问题 setState 调用后 state 到底在那个环节或者什么时候发生变化？

在 setState 中的回调是异步执行的时候，当执行完 setState 函数调用后，state 本身并不会立刻发生改变。在同步代码执行完的某个时刻 state 中的值才会改变。

### setState

**setState 在大部分情况下采用异步方式的动机和原理是因为可以进行批量的更新。** “setState 是一个异步的方法”，这意味着当执行完 setState 后，state 本身并不会立刻发生改变。 因此紧跟在 setState 后面输出的 state 值，仍然会维持在它的初始状态。

在 setState 调用之后的情况：

![image-20211201165905986](..\typora-user-images\image-20211201165905986.png)

从上图可以看出，一个完整的更新流程包括 re-render 在内的多个生命周期函数，re-render 本身涉及对 DOM 的操作，它会带来较大的性能开销，假如一次 setState 就触发一次一个完成的上图更新流程，那么每一次 setState 的调用都会触发一次 re-render，会有极大的性能负担。 **所以 setState 的一个异步的重要理由就是避免频繁的 re-render。**

在实际的 React 运行时中，setState 异步的实现方式有点类似于 Vue 的 $nextTick，每来一个 setState，就把它塞进一个队列里。等时机成熟，再把队列中的 state 结果做合并，最后只针对最新的 state 值走一次更新流程。这个过程，叫作“批量更新”。

上面的过程叫做批量更新。

```js
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务，count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队, [count+1的任务，count+1的任务, count+1的任务]
});
                                          ↓
                                         合并 state，[count+1的任务]
                                          ↓
                                         执行 count+1的任务
```

只要本轮同步代码还在执行，那新的 setState 调用都只是单纯的入队操作。

```js
test = () => {
  console.log("循环100次 setState前的count", this.state.count);
  for (let i = 0; i < 100; i++) {
    // 只是增加state任务入队的次数，并不会导致频繁的re-render，当100次调用结束后，仅仅是state的任务队列内容发生变化，state本身并不会立刻改变。
    this.setState({
      count: this.state.count + 1,
    });
  }
  console.log("循环100次 setState后的count", this.state.count);
};
```

<img src="..\typora-user-images\image-20211201170729755.png" alt="image-20211201170729755" style="zoom:50%;" />

### setState 的工作流

同步现象：为什么 setTimeout 能将 setState 的执行顺序从异步变为同步？

**不是 setTimeout 改变了 setState，而是 setTimeout 帮助 setState “逃脱”了 React 对它的管控。只要是在 React 管控下的 setState，一定是异步的。**

React15 中 setState 的源码：

主流程图 

<img src="..\typora-user-images\image-20211201171540153.png" alt="image-20211201171540153" style="zoom:50%;" />

setState 入口函数：

入口函数在这里充当分发器的角色，根据入参（对象或者函数）不同分发  到不同的功能函数中去，下图是对象传参的分发情况：

setState 函数接受两种类型的参数，一种是函数，另一种是对象。下面的代码给出的是对象类型的参数的源码流程。

```js
ReactComponent.prototype.setState = function (partialState, callback) {
  // this表示的是React组件实例
  // 将组件和组件自身对应的setState需要修改的状态数据一并入队
  this.updater.enqueueSetState(this, partialState);

  //如果第二参数是函数，则将该回调函数加入到回调的队列中去，并传入对应的组件
  if (callback) {
    this.updater.enqueueCallback(this, callback, "setState");
  }
};
```

enqueueSetState:

- 将新的 state 放进**组件**的状态队列（数组）中
- 用 enqueueUpdate 来处理将要更新的实例对象

```js
enqueueSetState: function (publicInstance, partialState) {
    // 根据 this 拿到对应的组件实例
    // publicInstance组件实例
    // partialState是setState接受的传参
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state 数组， 组件实例上有一个state数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    // 将组件对应的setState传参推入queue队列中存起来，queue是一个数组
    // 将新的 state 放进组件的状态队列里
  queue.push(partialState);

  // 用 enqueueUpdate 来处理将要更新的实例对象
  enqueueUpdate(internalInstance);
}
```

enqueueUpdate：

- 引出一个关键对象 batchingStrategy 对象，该对象的 isBatchingUpdates 属性直接决定了当下是要走更新流程还是应该排队等待
- batchingStrategy 对象上的 batchedUpdates 方法可以直接发起组件更新流程

**batchingStrategy 则是 React 内部专门用于管控批量更新的对象。**

```js
function enqueueUpdate(component) {
  // component指代组件实例

  ensureInjected();

  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

batchingStrategy 对象的源码：

理解为锁管理器，这里的锁指的是 React 全局唯一的 isBatchingUpdates 变量。

```js
/**
 * batchingStrategy源码
 **/

var ReactDefaultBatchingStrategy = {
  // 全局唯一的锁标识
  isBatchingUpdates: false, // false表示当前并未进行任何批量更新操作

  // 发起更新动作的方法
  batchedUpdates: function (callback, a, b, c, d, e) {
    // 缓存锁变量
    var alreadyBatchingStrategy =
      ReactDefaultBatchingStrategy.isBatchingUpdates;
    // 把锁“锁上”
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    if (alreadyBatchingStrategy) {
      callback(a, b, c, d, e);
    } else {
      // 启动事务，将 callback 放进事务里执行
      transaction.perform(callback, null, a, b, c, d, e);
    }
  },
};
```

这里的“锁”，是指 React 全局唯一的 isBatchingUpdates 变量，isBatchingUpdates 的初始值是 false，意味着“当前并未进行任何批量更新操作”。每当 React 调用 batchedUpdate 去执行更新动作时，会先把这个锁给“锁上”（置为 true），表明“现在正处于批量更新过程中”。当锁被“锁上”的时候，任何需要更新的组件都只能暂时进入 dirtyComponents 里排队等候下一次的批量更新，而不能随意“插队”。此处体现的“任务锁”的思想，是 React 面对大量状态仍然能够实现有序分批处理的基石。

批量更新整体管理的机制，还需要注意 batchedUpdates 中有一个引人注目的调用：transaction.perform(callback, null, a, b, c, d, e)，它是 react 中的 transaction 机制。



### React 中的 transaction(事务)机制

transaction 在 react 源码中的分布非常广泛。如果你在 Debug React 项目的过程中，发现函数调用栈中出现了 initialize、perform、close、closeAll 或者 notifyAll 这样的方法名，那么很可能 当前就处于一个 Trasaction 中。

Transaction 在 react 源码中表现为一个核心类，它能封装任何方法。

```
* <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
```

Transaction 在源码中就是一个核心类。 就像是一个“盒子”，它能封装任何方法。那些需要在函数运行前或者后运行的方法可以通过这个类封装。实例化 transaction 时只需要提供相关的方法就可以。

它首先会将目标函数用 wrapper（一组 initialize 及 close 方法称为一个 wrapper） 封装起来，同时需要使用 Transaction 类暴露的 perform 方法去执行它。如上面的注释所示，在 anyMethod 执行之前，perform 会先执行所有 wrapper 的 initialize 方法，执行完后，再执行所有 wrapper 的 close 方法。这就是 React 中的事务机制。

同步现象的本质：

结合对事务机制的理解看 ReactDefaultBatchingStrategy 对象。ReactDefaultBatchingStrategy 其实就是一个批量更新策略事务。 它的 wrapper 有两个，见下图：

```JS
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

把这两个 wrapper 套进 transaction 的执行机制中，在 callback 执行完后，RESET_BATCHED_UPDATES 将 batchingStrategy 对象的 isBatchingUpdates 属性设为 false。FLUSH_BATCHED_UPDATES 执行 flushBatchedUpdates，该 flushBatchedUpdates 函数内部会循环所有的 dirtyComponent，调用 updateComponent 来执行所有的生命周期方法，最后实现组件的更新。

到这里，对 isBatchingUpdates 管控下的批量更新机制已经结束。但是 setState 为何会表现同步这个问题，似乎还是没有从当前展示出来的源码里得到根本上的回答。这是因为 batchedUpdates 这个方法，不仅仅会在 setState 之后才被调用。若在 React 源码中全局搜索 batchedUpdates，会发现调用它的地方很多，但与更新流有关的只有这两个地方

```JS
// ReactMount.js
_renderNewRootComponent: function( nextElement, container, shouldReuseMarkup, context ) {
  // 实例化组件
  var componentInstance = instantiateReactComponent(nextElement);
  // 初始渲染直接调用 batchedUpdates 进行同步渲染
  ReactUpdates.batchedUpdates(
    batchedMountComponentIntoNode,
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  );
  ...
}
```

这段代码是在首次渲染组件时会执行的一个方法，我们看到它内部调用了一次 batchedUpdates，这是因为在组件的渲染过程中，会按照顺序调用各个生命周期函数。开发者很有可能在声明周期函数中调用 setState。因此，我们需要通过开启 batch 来确保所有的更新都能够进入 dirtyComponents 里去，进而确保初始渲染流程中所有的 setState 都是生效的。

下面代码是 React 事件系统的一部分。当在组件上绑定了事件之后，事件中也有可能会触发 setState。为了确保每一次 setState 都有效，React 同样会在此处手动开启批量更新。

```js
// ReactEventListener.js
dispatchEvent: function (topLevelType, nativeEvent) {
  ...
  try {
    // 处理事件
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}
```

### 为什么 setState 是异步的原因

isBatchingUpdates 这个变量，在 React 的生命周期函数以及合成事件执行前，已经被 React 修改为了 true，这时所做的 setState 操作自然不会立即生效。当函数执行完毕后，事务的 close 方法会再把 isBatchingUpdates 改为 false。

以开头示例中的 increment 方法为例，整个过程像是这样：

```js
increment = () => {
  // 进来先锁上
  isBatchingUpdates = true;
  console.log("increment setState前的count", this.state.count);
  this.setState({
    count: this.state.count + 1,
  });
  console.log("increment setState后的count", this.state.count);
  // 执行完函数再放开
  isBatchingUpdates = false;
};
```

很明显，在 isBatchingUpdates 的约束下，setState 只能是异步的。而当 setTimeout 从中作祟时，事情就会发生一点变化：

```js
reduce = () => {
  // 进来先锁上
  isBatchingUpdates = true;
  setTimeout(() => {
    console.log("reduce setState前的count", this.state.count);
    this.setState({
      count: this.state.count - 1,
    });
    console.log("reduce setState后的count", this.state.count);
  }, 0);
  // 执行完函数再放开
  isBatchingUpdates = false;
};
```

前面开头锁上的那个 isBatchingUpdates，对 setTimeout 内部的执行逻辑完全没有约束力。因为 isBatchingUpdates 是在同步代码中变化的，而 setTimeout 的逻辑是异步执行的。当 this.setState 调用真正发生的时候，isBatchingUpdates 早已经被重置为了 false，这就使得当前场景下的 setState 具备了立刻发起同步更新的能力。所以etState 并不是具备同步这种特性，只是在特定的情境下，它会从 React 的异步管控中“逃脱”掉。这就使得当前场景下的 setState 具备了立刻发起同步更新的能力。

```js
reduce = () => {
  // 进来先锁上
  isBatchingUpdates = true;
  setTimeout(() => {
    console.log("reduce setState前的count", this.state.count);
    this.setState({
      count: this.state.count - 1,
    });
    console.log("reduce setState后的count", this.state.count);
  }, 0);
  // 执行完函数再放开
  isBatchingUpdates = false;
};
```

setState 并不是具备同步的特性，只是在特定的情境下，它会从 React 的异步管控中摆脱。

setState 并不是单纯同步/异步的，它的表现会因调用场景的不同而不同：在 React 钩子函数及合成事件中，它表现为异步；而在 setTimeout、setInterval 等函数中，包括在 DOM 原生事件中，它都表现为同步。这种差异，本质上是由 React 事务机制和批量更新机制的工作方式来决定的。

以上是 React15 中的 setState。

React 16 以来，整个 React 核心算法被重写，setState 也不可避免地被“Fiber 化”。



## Fiber 架构的迭代动机和设计思想

随着时间的推移和业务复杂度的提升，React 曾经的 Stack Reconciler（栈调和架构） 在用户体验方面显出疲态。为了更进一步贯彻“快速响应”的原则，React 团队在 16.x 版本中将其最为核心的 Diff 算法整个重写，使用“Fiber Reconciler（Fiber 架构）”。

**Stack Reconciler 有着怎样的局限性，使得 React 从架构层面做出改变？**

**Fiber 架构又是什么，基于它来实现的调和过程又有什么不同呢？**

对于多进程多线程的浏览器来说，它除了要处理 JavaScript 线程以外，还需要处理包括事件系统、定时器/延时器、网络请求等各种各样的任务线程，这其中，自然也包括负责处理 DOM 的 UI 渲染线程。而 JavaScript 线程是可以操作 DOM 的，JavaScript 线程和渲染线程必须是互斥的，这两个线程不能够穿插执行，必须串行。当其中一个线程执行时，另一个线程只能挂起等待。

浏览器的 Event Loop 机制决定了事件任务是由一个异步队列来维持的，当事件被触发时，对应的任务并不会立即被执行，而是由 I/O 线程将任务进行入队，在上一轮 js 同步代码执行完毕后，在空闲的时间里由事件循环机制将任务队列中的任务出队到主线程中进行执行。如果 js 线程长时间占用主线程，那么渲染线程将长时间等待，UI 界面将长时间不能更新，造成卡顿现象。

#### Stack Reconciler 的局限性：

Stack Reconciler 下 javascript 代码可能超时占用主线程，因为 Stack Reconciler 是一个同步的递归过程，无法中断。

栈调和机制下的 Diff 算法，其实是树的深度优先遍历的过程。而树的深度优先遍历，总是和递归脱不了关系。

<img src="https://s0.lgstatic.com/i/image/M00/6E/D8/CgqCHl-zlcmATw-hAAD1942js64663.png" alt="Drawing 1.png" style="zoom:50%;" />

在 React 15 及之前的版本中，虚拟 DOM 树的数据结构是“树”，其 Diff 算法的遍历思路，也是沿 袭了传统计算机科学中“对比两棵树”的算法，在此基础上优化得来。因此从本质上来说，**栈调和机制下的 Diff 算法，其实是树的深度优先遍历的过程。**而树的深度优先遍历，总是递归。

拿这棵树来举例，若 A 组件发生了更新，那么栈调和的工作过程是这样的：对比第 1 层的两个 A，确认节点可复用，继续 Diff 其子组件。当 Diff 到 B 的时候，对比前后的两个 B 节点，发现可复用，于是继续 Diff 其子节点 D、E。待 B 树最深层的 Diff 完成、逐层回溯后，再进入 C 节点的 Diff 逻辑......调和器会重复“父组件调用子组件”的过程，直到最深的一层节点更新完毕，才慢慢向上返回。

这个过程的致命性在于它是同步的，不可以被打断。当处理结构相对复杂、体量相对庞大的虚拟 DOM 树时，Stack Reconciler 需要的调和时间会很长，这就意味着 JavaScript 线程将长时间地霸占主线程，进而导致渲染卡顿/卡死、交互长时间无响应等问题。

#### Fiber 解决问题

在计算机科学里，有进程、线程之分，而 Fiber 就是比线程还要纤细的一个过程，也就是所谓的“纤程”。纤程的出现，意在对渲染过程实现更加精细的控制。

**从架构角度来看，**Fiber 是对 React 核心算法（即调和过程）的重写。

**从编码角度来看**，Fiber 是 React 内部定义的**一种数据结构**，它是 **Fiber 树结构的节点单位**，也就是 React16 新架构下的虚拟 DOM； 

**从工作流的角度来看，**Fiber 节点保存了组件需要更新的状态和副作用，一个 Fiber 同时对应着一个工作单元。

站在架构角度理解 Fiber：

Fiber 架构的应用目的是实现“**增量渲染**”，所谓的“增量渲染”就是把一个渲染任务分解为多个渲染任务，而后将这些任务分散到多个帧中。增量渲染只是一种手段，实现增量渲染的目的是为了**实现任务的可中断和可恢复**，并**给不同的任务赋予不同的优先级**，最终达成更加顺滑的用户体验。

Fiber架构的核心：

- 可中断
- 可恢复
- 优先级

React16 以前的下图，React 的渲染和更新阶段依赖于下图中的两层架构，Reconciler 层负责对比出新旧虚拟 DOM 的不同，Renderer 层负责将变化的部分应用到视图上，从 Reconciler 层到 Renderer 层这个过程是严格同步的。

<img src="https://s0.lgstatic.com/i/image/M00/6E/D8/CgqCHl-zleqAJoRjAAA9BnH9jdQ473.png" alt="Drawing 2.png" style="zoom:50%;" />

在 React16 中为了实现可中断和优先级，采用了下图的三层架构，Scheduler 层负责调度更新的优先级。

在这套架构模式下，更新的处理工作流变成了这样：首先，每个更新任务都会被赋予一个优先级。当更新任务抵达调度器时，高优先级的更新任务（记为 A）会更快地被调度进 Reconciler 层；此时若有新的更新任务（记为 B）抵达调度器，调度器会检查它的优先级，若发现 B 的优先级高于当前任务 A，那么当前处于 Reconciler 层的 A 任务就会被中断，调度器会将 B 任务推入 Reconciler 层。当 B 任务完成渲染后，新一轮的调度开始，之前被中断的 A 任务将会被重新推入 Reconciler 层，继续重头它的渲染，这便是“可恢复”。

<img src="..\typora-user-images\image-20211201205219857.png" alt="image-20211201205219857" style="zoom:50%;" />

render 阶段主要是在内存中计算，明确 DOM 树的更新点，而 commit 阶段则负责把 render 阶段生成的更新真正的执行。

<img src="..\typora-user-images\image-20211201210023652.png" alt="image-20211201210023652" style="zoom:50%;" />

新旧两种架构对生命周期函数的影响主要在 render 阶段，是通过增加 scheduler 层和改写 Reconciler 层来实现的。在 Fiber 架构中的 render 阶段，一个庞大的任务被分解为一个个的工作单元，他们有着不同的优先级，React 可以根据优先级的高低去实现工作单元的打断和回复。由于 render 阶段的操作对用户来说其实是“不可见”的，所以就算打断再重启，对用户来说也是 0 感知。但是，工作单元（也就是任务）的重启将会伴随着对部分生命周期的重复执行，这些生命周期是：

- componentWillMount
- componentWillUpdate
- componentWillReceiveProps
- shouldComponentUpdate

**把 React 架构分层的变化与生命周期的变化建立联系，从而对两者的设计动机都形成更加深刻的理解。**

问题：

- React16 在所有情况下都是异步渲染的吗？
- Fiber 架构中的可中断，可恢复到底如何实现？
- Fiber 树和传统虚拟 DOM 树有什么不同？
- 优先级调度如何实现的？

 

## ReactDOM.render 渲染链路

以**首次渲染**为切入点，拆解 Fiber 架构下 ReactDOM.render 所触发的渲染链路，结合源码理解整个链路中所涉及的**初始化、render 和 commit** 等过程。

#### ReactDOM.render 调用栈的逻辑：

调用栈大图：

```jsx
import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>我是标题</h1>
        <p>我是第一段话</p>
        <p>我是第二段话</p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Demo 启动后，渲染出的界面如下图所示：

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmEOAGbJ5AAAxGM0SPWA261.png)

现在打开 Chrome 的 Performance 面板，点击下图红色圈圈所圈住的这个“记录”按钮：

![Drawing 1.png](https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmEuALVycAAEENjoXJ6E407.png)

然后重新访问 Demo 页面对应的本地服务地址，待页面刷新后，终止记录，便能够得到如下图所示的这样一个调用栈大图：

<img src="https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmFKAFeHBAAQn6ZuFPrI619.png" alt="Drawing 2.png" style="zoom:200%;" />

ReactDOM.render 方法对应的调用栈，如下图所示：

![Drawing 3.png](https://s0.lgstatic.com/i/image/M00/6E/CE/Ciqc1F-zmFmAXkYlAAI2ONTKc9s081.png)

ReactDOM.render 方法对应的调用栈非常深，中间涉及的函数量也比较大。分析调用栈是理解渲染链路的一个手段，目的是借此提取关键逻辑，而非理解调用栈中的每一个方法。

![image-20220425125307885](..\typora-user-images\image-20220425125307885.png)

图中 scheduleUpdateOnFiber 方法的作用是调度任务，在由 ReactDOM.render 发起的首屏渲  ，它触发的就是 performSyncWorkOnRoot。**performSyncWorkOnRoot 同步开启的正是 render 阶段；而 commitRoot 方法开启的则是真实 DOM 的渲染过程（commit 阶段）**。因此以 scheduleUpdateOnFiber 和 commitRoot 两个方法为界，大致把 ReactDOM.render 的调用栈划分为三个阶段：

- 初始化阶段
- render 阶段
- commit 阶段



**ReactDOM.render 调用栈——初始化阶段**

初始化过程中涉及的调用栈大图：

<img src="https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmGqAU-42AABcbqaOzFc800.png" alt="Drawing 5.png" style="zoom:200%;" />

初始化阶段目的：**完成 Fiber 树中基本实体的创建。**

什么是基本实体？基本实体有哪些？

源码中的关键逻辑，首先是 legacyRenderSubtreeIntoContainer 方法。在 ReactDOM.render 函数体中，以下面代码的形式调用 legacyRenderSubtreeIntoContainer ：

```js
return legacyRenderSubtreeIntoContainer(
  null,
  element,
  container,
  false,
  callback
);
```

legacyRenderSubtreeIntoContainer 的关键逻辑如下：

```jsx
function legacyRenderSubtreeIntoContainer(
  parentComponent = null,
  children,
  container,
  forceHydrate,
  callback
) {
  // parentComponent = null ,children = element, container = container,
  // forceHydrate=false, callback = callback
  // container 对应的是传入的真实 DOM 对象
  var root = container._reactRootContainer;

  // 初始化 fiberRoot 对象
  var fiberRoot;

  // DOM 对象本身不存在 _reactRootContainer 属性，因此 root 为空
  if (!root) {
    // 若 root 为空，则初始化 _reactRootContainer，并将其值赋值给 root
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate
    );
    // legacyCreateRootFromDOMContainer 创建出的对象会有一个 _internalRoot 属性，将其赋值给 fiberRoot
    fiberRoot = root._internalRoot;

    // 这里处理的是 ReactDOM.render 入参中的回调函数，了解即可
    if (typeof callback === "function") {
      var originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.

    // 进入 unbatchedUpdates 方法
    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // else 逻辑处理的是非首次渲染的情况（即更新），其逻辑除了跳过了初始化工作，与上面基本一致
    fiberRoot = root._internalRoot;
    if (typeof callback === "function") {
      var _originalCallback = callback;
      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        _originalCallback.call(instance);
      };
    } // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}
```

总结一下首次渲染过程中 legacyRenderSubtreeIntoContainer 方法的主要逻辑：

<img src="..\typora-user-images\image-20211202133135821.png" alt="image-20211202133135821" style="zoom:50%;" />

其中的 fiberRoot 到底是什么呢？运行时的 root 和 fiberRoot ，其中 root 对象的结构如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmH6AKzPPAADcEbfK6K4199.png" alt="Drawing 6.png" style="zoom:200%;" />

root 对象（container.\_reactRootContainer）上有一个 \_internalRoot 属性，这个 \_internalRoot 也就是 fiberRoot。**fiberRoot 的本质是一个 FiberRootNode 对象**，其中包含一个 current 属性。

<img src="https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmISANlmfAADLqX8jue0154.png" alt="Drawing 7.png" style="zoom:200%;" />

current 对象是一个 FiberNode 实例，**而 FiberNode，正是 Fiber 节点对应的对象类型**。current 对象是一个 Fiber 节点，不仅如此，它还是**当前 Fiber 树的根节点**。

current 属性对应的 FiberNode 节点，在调用栈中实际是由 createHostRootFiber 方法创建的，React 源码中也有多处以 rootFiber 代指 current 对象，因此下文中将以 rootFiber 指代 current 对象。

<img src="https://s0.lgstatic.com/i/image/M00/6F/F8/Ciqc1F-3mh-AZrlvAABgy8S1u44402.png" alt="Lark20201120-182610.png" style="zoom:50%;" />

fiberRoot 的关联对象是真实 DOM 的容器节点；而 rootFiber 则作为虚拟 DOM 的根节点存在。**这两个节点，将是后续整棵 Fiber 树构建的起点**。 

fiberRoot 将和 ReactDOM.render 方法的其他入参一起，被传入 updateContainer 方法，从而形成一个回调。这个回调，正是接下来要调用的 unbatchedUpdates 方法的入参。 unbatchedUpdates 做了什么，下面代码是对 unbatchedUpdates 主体逻辑的提取：

```js
function unbatchedUpdates(fn, a) {
  // 这里是对上下文的处理，不必纠结
  var prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    // 重点在这里，直接调用了传入的回调函数 fn，对应当前链路中的 updateContainer 方法
    return fn(a);
  } finally {
    // finally 逻辑里是对回调队列的处理，此处不用太关注
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      resetRenderTimer();
      flushSyncCallbackQueue();
    }
  }
}
```

在 unbatchedUpdates 函数体里，它直接调用了传入的回调 fn。而在当前链路中，fn 是一个针对 updateContainer 的调用：

```js
unbatchedUpdates(function () {
  updateContainer(children, fiberRoot, parentComponent, callback);
});
```

updateContainer 做的最关键的事情可以总结为三件：

- 请求当前 Fiber 节点的 lane（优先级）
- 结合 lane 创建当前 Fiber 节点的 update 对象，并将其入队
- 调度当前节点（rootFiber）

```js
function updateContainer(element, container, parentComponent, callback) {
  ......

  // 这是一个 event 相关的入参，此处不必关注
  var eventTime = requestEventTime();
  ......
  // 这是一个比较关键的入参，lane 表示优先级
  var lane = requestUpdateLane(current$1);
  // 结合 lane（优先级）信息，创建 update 对象，一个 update 对象意味着一个更新
  var update = createUpdate(eventTime, lane);
  // update 的 payload 对应的是一个 React 元素
  update.payload = {
    element: element
  };

  // 处理 callback，这个 callback 其实就是我们调用 ReactDOM.render 时传入的 callback
  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    {
      if (typeof callback !== 'function') {
        error('render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
      }
    }
    update.callback = callback;
  }

  // 将 update 入队
  enqueueUpdate(current$1, update);
  // 调度 fiberRoot
  scheduleUpdateOnFiber(current$1, lane, eventTime);
  // 返回当前节点（fiberRoot）的优先级
  return lane;
}
```

函数体中的 scheduleWork 其实就是 scheduleUpdateOnFiber，scheduleUpdateOnFiber 函数的任务是调度当前节点的更新。在这个函数中，会处理一系列与优先级、打断操作相关的逻辑。但是**在 ReactDOM.render 发起的首次渲染链路中，这些意义都不大，因为这个渲染过程其实是同步的**。可以尝试在 Source 面板中为该函数打上断点，逐行执行代码，会发现逻辑最终会走到下图的高亮处：

<img src="https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmJGATpFIAAPP-sFYf70749.png" alt="Drawing 8.png" style="zoom:200%;" />

performSyncWorkOnRoot 直译过来就是“执行根节点的同步任务”，**这里的“同步”二字需要注意，它明示了接下来即将开启的是一个同步的过程**。这也正是为什么在整个渲染链路中，调度（Schedule）动作没有存在感的原因。

前面曾经提到过，performSyncWorkOnRoot 是 render 阶段的起点，render 阶段的任务就是完成 Fiber 树的构建，它是整个渲染链路中最核心的一环。在异步渲染的模式下，render 阶段应该是一个可打断的异步过程。

而现在，疑惑在于：**都说 Fiber 架构带来的异步渲染是 React 16 的亮点，为什么分析到现在，竟然发现 ReactDOM.render 触发的首次渲染是个同步过程呢**？

### 同步的 ReactDOM.render，异步的 ReactDOM.createRoot

其实在 React 16，包括近期发布的 React 17 小版本中，React 都有以下 3 种启动方式：

**legacy 模式**： `ReactDOM.render(<App />, rootNode)`。这是当前 React App 使用的方式，当前没有计划删除本模式，但是这个模式可能不支持这些新功能。

 **blocking 模式**： `ReactDOM.createBlockingRoot(rootNode).render(<App />)`。目前正在实验中，作为迁移到 concurrent 模式的第一个步骤。

**concurrent 模式**： `ReactDOM.createRoot(rootNode).render(<App />)`。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式，这个模式开启了所有的新功能。

在这 3 种模式中，**常用的 ReactDOM.render 对应的是 legacy 模式，它实际触发的仍然是同步的渲染链路**。blocking 模式可以理解为 legacy 和 concurrent 之间的一个过渡形态，之所以会有这个模式，是因为 React 官方希望能够提供[渐进的迁移策略](https://zh-hans.reactjs.org/docs/faq-versioning.html#commitment-to-stability)，帮助更加顺滑地过渡到 Concurrent 模式。

按照官方的说法，“**长远来看，模式的数量会收敛，不用考虑不同的模式**，但就目前而言，模式是一项重要的迁移策略，让每个人都能决定自己什么时候迁移，并按照自己的速度进行迁移”。由此可以看出，Concurrent 模式确实是 React 的终极目标，也是其创作团队使用 Fiber 架构重写核心算法的动机所在。

### 拓展：关于异步模式下的首次渲染链路

当下，如果想要开启异步渲染，需要调用 `ReactDOM.createRoot`方法来启动应用，那`ReactDOM.createRoot`开启的渲染链路与 ReactDOM.render 有何不同呢？

这里修改一下调用方式，给你展示一下调用栈。由于本讲的源码取材于 React 17.0.0 版本，在这个版本中，createRoot 仍然是一个 unstable 的方法。因此实际调用的 API 应该是“unstable_createRoot”：

```
ReactDOM.unstable_createRoot(rootElement).render(<App />);
```

Concurrent 模式开启后，首次渲染的调用栈变成了如下图所示的样子：

<img src="https://s0.lgstatic.com/i/image/M00/6E/D9/CgqCHl-zmJyAbYZNAAFI67qKm98019.png" alt="Drawing 9.png" style="zoom: 200%;" />

乍一看，好像和 ReactDOM.render 差别很大，其实不然。图中 createRoot 所触发的逻辑仍然是一些准备性质的初始化工作。关键在于下面框出来的这部分，如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/6E/CE/Ciqc1F-zmKKAF0ODAADhhdYWzo0441.png" alt="Drawing 10.png" style="zoom:200%;" />

拉近一点来看，如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/70/75/CgqCHl-7GiaAUY_zAAxz8mfEvT0309.png" alt="图片1.png" style="zoom:200%;" /> 这地方也调用了一个 render。再顺着这个调用往下看，发现有大量的熟悉面孔：updateContainer、requestUpdateLane、createUpdate、scheduleUpdateOnFiber......这些函数在 ReactDOM.render 的调用栈中也出现过。

其实，当前你看到的这个 render 调用链路，和 ReactDOM.render 的调用链路是非常相似的，主要的区别在 scheduleUpdateOnFiber 的这个判断里：

<img src="https://s0.lgstatic.com/i/image/M00/6E/CE/Ciqc1F-zmMKAJFKYAAMfoIVWxeM650.png" alt="image.png" style="zoom:200%;" />

在异步渲染模式下，由于请求到的 lane 不再是 SyncLane（同步优先级），故不会再走到 performSyncWorkOnRoot 这个调用，而是会转而执行 else 中调度相关的逻辑。

这里有个点要给你点出来——React 是如何知道当前处于哪个模式的呢？可以以 requestUpdateLane 函数为例，下面是它局部的代码：

```js
function requestUpdateLane(fiber) {
  // 获取 mode 属性
  var mode = fiber.mode;
  // 结合 mode 属性判断当前的
  if ((mode & BlockingMode) === NoMode) {
    return SyncLane;
  } else if ((mode & ConcurrentMode) === NoMode) {
    return getCurrentPriorityLevel() === ImmediatePriority$1 ? SyncLane : SyncBatchedLane;
  }
  ......
  return lane;
}
```

上面代码中需要注意 fiber 节点上的 mode 属性：**React 将会通过修改 mode 属性为不同的值，来标识当前处于哪个渲染模式；在执行过程中，也是通过判断这个属性，来区分不同的渲染模式**。

因此不同的渲染模式在挂载阶段的差异，本质上来说并不是工作流的差异（其工作流涉及初始化 → render → commit 这 3 个步骤），而是 mode 属性的差异。mode 属性决定着这个工作流是一气呵成（同步）的，还是分片执行（异步）的。

### Fiber 架构一定是异步渲染吗？

**React 16 如果没有开启 Concurrent 模式，那它还能叫 Fiber 架构吗**？

从动机上来看，Fiber 架构的设计确实主要是为了 Concurrent 而存在。但经过了本讲紧贴源码的讲解，相信你也能够看出，在 React 16，包括已发布的 React 17 版本中，不管是否是 Concurrent，整个数据结构层面的设计、包括贯穿整个渲染链路的处理逻辑，已经完全用 Fiber 重构了一遍。站在这个角度来看，Fiber 架构在 React 中并不能够和异步渲染画严格的等号，它是一种**同时兼容了同步渲染与异步渲染的设计**。

总结：

以 ReactDOM.render 所触发的首次渲染为切入点，串联 React Fiber 架构下完整的工作链路。 对 Fiber 树的初始形态，Fiber 根节点的创作过程由一定认知，同时讲解了 ReactDOM.render 同步渲染的过程和特征，理解 React16 和 17 中共存的 3 中渲染方式。

 

## ReactDOM.render 调用栈：render 阶段

render 阶段在整个渲染链路中的定位，如下图所示：（diff 算法发生的过程）

<img src="https://s0.lgstatic.com/i/image/M00/71/0B/CgqCHl-8xCmAcvVyAADtTCzN0RM929.png" alt="Drawing 0.png" style="zoom:200%;" />

图中，performSyncWorkOnRoot 标志着 render 阶段的开始，finishSyncRender 标志着 render 阶段的结束。这中间包含了大量的 beginWork、completeWork 调用栈，正是 render 的工作内容。

**beginWork 方法开始调用的过程就是 Fiber 树的构建过程。**

> beginWork、completeWork 这两个方法需要注意，它们串联起的是一个“模拟递归”的过程。

React 15 下的调和过程是一个递归的过程。 Fiber 架构下的调和过程，虽然并不是依赖递归来实现的，但在 ReactDOM.render 触发的同步模式下，它仍然是一个深度优先搜索的过程。这个过程中，**beginWork 将创建新的 Fiber 节点**，而 **completeWork 则负责将 Fiber 节点映射为 DOM 节点**。上一讲中 Fiber 树只有根节点。

<img src="..\typora-user-images\image-20220425200420687.png" alt="image-20220425200420687" style="zoom:50%;" />

workInProgress 节点的创建：

performSyncWorkOnRoot (render 阶段的起点) 调用了 renderRootSync，renderRootSync 被调用后的情况：

<img src="https://s0.lgstatic.com/i/image/M00/70/FF/Ciqc1F-8xByAOzCeAAAoruuugdE734.png" alt="Drawing 2.png" style="zoom:200%;" />

prepareFreshStack 的作用是重置一个新的堆栈环境，对 createWorkInProgress 的调用。createWorkInProgress 的主要逻辑：

```js
// 这里入参中的 current 传入的是现有树结构中的 rootFiber 对象
function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate; // 原来根Fiber对应的双缓存中的另一个Fiber节点，初始化渲染的时候这个值为null
  // ReactDOM.render 触发的首屏渲染将进入这个逻辑
  if (workInProgress === null) {
    // 这是需要你关注的第一个点，workInProgress 是 createFiber 方法的返回值
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // 这是需要你关注的第二个点，workInProgress 的 alternate 将指向 current
    workInProgress.alternate = current;
    // 这是需要你关注的第三个点，current 的 alternate 将反过来指向 workInProgress
    current.alternate = workInProgress;
  } else {
    // else 的逻辑此处先不用关注
  }

  // 以下省略大量 workInProgress 对象的属性处理逻辑
  // 返回 workInProgress 节点
  return workInProgress;
}
```

该函数 createWorkInProgress 中的 current 入参指的是现有树结构中的 rootFiber 对象，如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/70/FF/Ciqc1F-8xDeAR3RMAAClHPw_BEk265.png" alt="Drawing 3.png" style="zoom:200%;" />

重点如下： 

- createWorkInProgress 将**调用 createFiber**，workInProgress**是 createFiber 方法的返回值**
- workInProgress 的 **alternate 将指向 current**
- **current 的 alternate 将反过来指向 workInProgress**

**createFiber 到底会返回什么**。下面是 createFiber 的逻辑：**createFiber 将创建一个 FiberNode 实例**

```js
var createFiber = function (tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
};
```

而 FiberNode 正是 Fiber 节点的类型。**因此 workInProgress 就是一个 Fiber 节点**。workInProgress 的创建入参其实来源于 current，如下面代码所示：

```js
workInProgress = createFiber(
  current.tag,
  pendingProps,
  current.key,
  current.mode
);
```

**workInProgress 节点其实就是 current 节点（即 rootFiber）的副本**。

再结合 current 指向 rootFiber 对象（同样是 FiberNode 实例），以及 current 和 workInProgress 通过 alternate 互相连接这些信息，可以分析出这波操作执行完之后，整棵树的结构应该如下图所示：

![1.png](https://s0.lgstatic.com/i/image/M00/71/49/CgqCHl-91EqAJlftAAB6KmeoTMw529.png)

完成了这个任务之后，就会进入 workLoopSync 的逻辑。如下所示（解析在注释里）：

```js
function workLoopSync() {
  // 若 workInProgress 不为空
  while (workInProgress !== null) {
    // 针对它执行 performUnitOfWork 方法
    performUnitOfWork(workInProgress);
  }
}
```

workLoopSync 做的事情就是**通过 while 循环反复判断 workInProgress 是否为空，并在不为空的情况下针对它执行 performUnitOfWork 函数**。

而 performUnitOfWork 函数将**触发对 beginWork 的调用，进而实现对新 Fiber 节点的创建**。若 beginWork 所创建的 Fiber 节点不为空，则 performUniOfWork 会用这个新的 Fiber 节点来更新 workInProgress 的值，**为下一次循环做准备**。

**通过循环调用 performUnitOfWork 来触发 beginWork，新的 Fiber 节点就会被不断地创建**。当 workInProgress 终于为空时，说明没有新的节点可以创建了，也就意味着已经完成对整棵 Fiber 树的构建。

在这个过程中，**每一个被创建出来的新 Fiber 节点，都会一个一个挂载为最初那个 workInProgress 节点（如下图高亮处）的后代节点**。而上述过程中构建出的这棵 Fiber 树，也正是 **workInProgress 树**。

![2.png](https://s0.lgstatic.com/i/image/M00/71/49/CgqCHl-91HeADxF2AACYnkvx4lM165.png)

相应地，图中 current 指针所指向的根节点所在的那棵树，叫它“**current 树**”。

一棵 current 树，一棵 workInProgress 树，这两棵 Fiber 树至少在现在看来，是完全没区别的（毕竟都还只有一个根节点）。React 这样设计的目的何在？或者换个问法——到底是什么样的事情一棵树做不到，非得搞两棵“一样”的树出来？在一步一步理解 Fiber 树的构建和更新过程之后，认识“两棵 Fiber 树”的动机。

### beginWork 开启 Fiber 节点创建过程

与树构建过程强相关的动作进行逻辑提取,代码如下（解析在注释里）：

```js
function beginWork(current, workInProgress, renderLanes) {
  ......
  //  current 节点不为空的情况下，会加一道辨识，看看是否有更新逻辑要处理
  if (current !== null) {
    // 获取新旧 props
    var oldProps = current.memoizedProps;
    var newProps = workInProgress.pendingProps;
    // 若 props 更新或者上下文改变，则认为需要"接受更新"
    if (oldProps !== newProps || hasContextChanged() || (
     workInProgress.type !== current.type )) {
      // 打个更新标
      didReceiveUpdate = true;
    } else if (xxx) {
      // 不需要更新的情况 A
      return A
    } else {
      if (需要更新的情况 B) {
        didReceiveUpdate = true;
      } else {
        // 不需要更新的其他情况，这里我们的首次渲染就将执行到这一行的逻辑
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  }
  ......
  // 这坨 switch 是 beginWork 中的核心逻辑，原有的代码量相当大
  switch (workInProgress.tag) {
    ......
    // 这里省略掉大量形如"case: xxx"的逻辑
    // 根节点将进入这个逻辑
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes)
    // dom 标签对应的节点将进入这个逻辑
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes)
    // 文本节点将进入这个逻辑
    case HostText:
      return updateHostText(current, workInProgress)
    ......
    // 这里省略掉大量形如"case: xxx"的逻辑
  }
  // 这里是错误兜底，处理 switch 匹配不上的情况
  {
    {
      throw Error(
        "Unknown unit of work tag (" +
          workInProgress.tag +
          "). This error is likely caused by a bug in React. Please file an issue."
      )
    }
  }
}
```

作用：

1. beginWork 的入参是**一对用 alternate 连接起来的 workInProgress 和 current 节点**；
2. **beginWork 的核心逻辑是根据 fiber 节点（workInProgress**）**的 tag 属性的不同，调用不同的节点创建函数**。

当前的 current 节点是 rootFiber，而 workInProgress 则是 current 的副本，它们的 tag 都是 3，如下图所示：

![Drawing 6.png](https://s0.lgstatic.com/i/image/M00/71/0B/CgqCHl-8xHmAV2FMAABmLqBlHD0379.png)

而 3 正是 HostRoot 所对应的值，因此第一个 beginWork 将进入 updateHostRoot 的逻辑。

这里你先不必急于关注 updateHostRoot 的逻辑细节。事实上，在整段 switch 逻辑里，包含的形如“update+类型名”这样的函数是非常多的。在专栏示例的 Demo 中，就涉及了对 updateHostRoot、updateHostComponent 等的调用，十来种 updateXXX。这些函数之间不仅命名形式一致，工作内容也相似。就 render 链路来说，它们共同的特性，就是都会**通过调用 reconcileChildren 方法，生成当前节点的子节点**。

reconcileChildren 的源码如下：

```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  // 判断 current 是否为 null
  if (current === null) {
    // 若 current 为 null，则进入 mountChildFibers 的逻辑
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // 若 current 不为 null，则进入 reconcileChildFibers 的逻辑
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
```

从源码来看，reconcileChildren 也只是做逻辑的分发，具体的工作还要到 **mountChildFibers** 和 **reconcileChildFibers** 里去看。

### ChildReconciler，处理 Fiber 节点

```js
var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
```

reconcileChildFibers 和 mountChildFibers 不仅名字相似，出处也一致。**它们都是 ChildReconciler 这个函数的返回值，仅仅存在入参上的区别**。而 ChildReconciler内部的逻辑量堪比 N 个 beginWork。关键要素提取如下（解析在注释里）：

```js
function ChildReconciler(shouldTrackSideEffects) {
  // 删除节点的逻辑
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }
    // 以下执行删除逻辑
  }
  ......
  // 单个节点的插入逻辑
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags = Placement;
    }
    return newFiber;
  }
  // 插入节点的逻辑
  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }
    // 以下执行插入逻辑
  }
  ......
  // 此处省略一系列 updateXXX 的函数，它们用于处理 Fiber 节点的更新
  // 处理不止一个子节点的情况
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
    ......
  }
  // 此处省略一堆 reconcileXXXXX 形式的函数，它们负责处理具体的 reconcile 逻辑
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    // 这是一个逻辑分发器，它读取入参后，会经过一系列的条件判断，调用上方所定义的负责具体节点操作的函数
  }
  // 将总的 reconcileChildFibers 函数返回
  return reconcileChildFibers;
}
```

由于原本的代码量着实巨大，可以点开[这个文件](https://github.com/facebook/react/blob/56e9feead0f91075ba0a4f725c9e4e343bca1c67/packages/react-reconciler/src/ReactChildFiber.old.js#L253)查看细节，此处仅针对与主流程强相关的逻辑为你总结以下要点：

1. 关键的入参 shouldTrackSideEffects，意为“是否需要追踪副作用”，**因此 reconcileChildFibers 和 mountChildFibers 的不同，在于对副作用的处理不同**；
2. ChildReconciler 中定义了大量如 placeXXX、deleteXXX、updateXXX、reconcileXXX 等这样的函数，这些函数覆盖了对 Fiber 节点的创建、增加、删除、修改等动作，将直接或间接地被 reconcileChildFibers 所调用；
3. ChildReconciler 的返回值是一个名为 reconcileChildFibers 的函数，这个函数是一个逻辑分发器，**它将根据入参的不同，执行不同的 Fiber 节点操作，最终返回不同的目标 Fiber 节点**。

对于第 1 点，这里展开说说。对副作用的处理不同，到底是哪里不同？以 placeSingleChild 为例，以下是 placeSingleChild 的源码：

```js
function placeSingleChild(newFiber) {
  if (shouldTrackSideEffects && newFiber.alternate === null) {
    newFiber.flags = Placement;
  }
  return newFiber;
}
```

可以看出，一旦判断 shouldTrackSideEffects 为 false，那么下面所有的逻辑都不执行了，直接返回。那如果执行下去会发生什么呢？简而言之就是给 Fiber 节点打上一个叫“flags”的标记，像这样：

```js
newFiber.flags = Placement;
```

这个名为 flags 的标记有何作用呢？

由于这里我引用的是 [v17.0.0 版本的源码](https://github.com/facebook/react/blob/56e9feead0f91075ba0a4f725c9e4e343bca1c67/packages/react-reconciler/src/ReactChildFiber.old.js#L253)，属性名已经变更为 flags，但在更早一些的版本中，这个属性名叫“effectTag”。在时下的社区讨论中，effectTag 这个命名更常见，也更语义化，因此下文我将以 “effectTag”代指“flags”。

Placement 这个 effectTag 的意义，是在渲染器执行时，也就是真实 DOM 渲染时，告诉渲染器：**我这里需要新增 DOM 节点**。 effectTag 记录的是**副作用的类型**，而**所谓“副作用”**，React 给出的定义是“**数据获取、订阅或者修改 DOM**”等动作。在这里，Placement 对应的显然是 DOM 相关的副作用操作。

像 Placement 这样的副作用标识，还有很多，它们均以二进制常量的形式存在，下图我为你截取了局部（你可以在[这个文件](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)里查看 effectTag 的类型）：

![Drawing 7.png](https://s0.lgstatic.com/i/image/M00/71/0B/CgqCHl-8xIyAZ3VoAADupBJcrgo966.png)

回到我们的调用链路里来，由于 current 是 rootFiber，它不为 null，因此它将走入的是下图所高亮的这行逻辑。也就是说在 mountChildFibers 和 reconcileChildFibers 之间，它选择的是 **reconcileChildFibers**：

![Drawing 8.png](https://s0.lgstatic.com/i/image/M00/71/07/Ciqc1F-80U-AfncYAAEt69YE2-g951.png)

结合前面的分析可知，reconcileChildFibers 是`ChildReconciler(true)`的返回值。入参为 true，意味着其内部逻辑是允许追踪副作用的，因此“打 effectTag”这个动作将会生效。

接下来进入 reconcileChildFibers 的逻辑，在 reconcileChildFibers 这个逻辑分发器中，会把 rootFiber 子节点的创建工作分发给 reconcileXXX 函数家族的一员——reconcileSingleElement 来处理，具体的调用形式如下图高亮处所示：

![Drawing 9.png](https://s0.lgstatic.com/i/image/M00/71/07/Ciqc1F-80VaABnJCAACe4hcSiBM598.png)

reconcileSingleElement 将基于 rootFiber 子节点的 ReactElement 对象信息，创建其对应的 FiberNode。这个过程中涉及的函数调用如下图高亮处所示：

![Drawing 10.png](https://s0.lgstatic.com/i/image/M00/71/12/CgqCHl-80VyAC2P6AAJfHF2gzfs579.png)

这里需要说明的一点是：**rootFiber 作为 Fiber 树的根节点**，它并没有一个确切的 ReactElement 与之映射。结合 JSX 结构来看，**我们可以将其理解为是 JSX 中根组件的父节点**。课时所给出的 Demo 中，组件编码如下：

```jsx
import React from "react";
import ReactDOM from "react-dom";
function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>我是标题</h1>
        <p>我是第一段话</p>
        <p>我是第二段话</p>
      </div>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

可以看出，根组件是一个类型为 App 的函数组件，因此 **rootFiber 就是 App 的父节点**。

结合这个分析来看，图中的 \_created4 是根据 rootFiber 的第一个子节点对应的 ReactElement 来创建的 Fiber 节点，那么它就是 **App 所对应的 Fiber 节点**。现在我为你打印出运行时的 \_created4 值，会发现确实如此：

![Drawing 11.png](https://s0.lgstatic.com/i/image/M00/71/12/CgqCHl-80WaAXLPeAAD-OcP7y4o323.png)

App 所对应的 Fiber 节点，将被 placeSingleChild 打上“Placement”（新增）的副作用标记，而后作为 reconcileChildFibers 函数的返回值，返回给下图中的 workInProgress.child：

![Drawing 12.png](https://s0.lgstatic.com/i/image/M00/71/12/CgqCHl-80WyARnfDAAGNRsiaht8973.png)

reconcileChildren 函数上下文里的 workInProgress 就是 rootFiber 节点。那么此时，就将新创建的 App Fiber 节点和 rootFiber 关联了起来，整个 Fiber 树如下图所示：

![3.png](https://s0.lgstatic.com/i/image/M00/71/3E/Ciqc1F-91MmARvQRAADFJC1K20o629.png)

### Fiber 节点的创建过程梳理

分析完 App FiberNode 的创建过程。最关键的东西已经讲完了，剩余节点的创建只不过是对 performUnitOfWork、 beginWork 和 ChildReconciler 等相关逻辑的重复。

刚刚这一通分析所涉及的调用栈很长，相信不少人如果是初读的话，过程中肯定不可避免地要反复回看，确认自己现在到底在调用栈的哪一环。将本讲讲解的 beginWork 所触发的调用流程总结进一张大图：

<img src="https://s0.lgstatic.com/i/image/M00/71/47/Ciqc1F-97fSAYLUIAAGBjhvNylg581.png" alt="7.png" style="zoom:50%;" />

### Fiber 树的构建过程

理解了 Fiber 节点的创建过程，就不难理解 Fiber 树的构建过程。

前面我们已经锲而不舍地研究了各路关键函数的源码逻辑，此时相信你已经能够将函数名与函数的工作内容做到对号入座。这里不必再纠结与源码的实现细节，可以直接从工作流程的角度来看后续节点的创建。

#### 循环创建新的 Fiber 节点

研究节点创建的工作流，切入点是`workLoopSync`这个函数。

为什么选它？这里来复习一遍`workLoopSync`会做什么：

```js
function workLoopSync() {
  // 若 workInProgress 不为空
  while (workInProgress !== null) {
    // 针对它执行 performUnitOfWork 方法
    performUnitOfWork(workInProgress);
  }
}
```

**它会循环地调用 performUnitOfWork**，而 performUnitOfWork，开篇我们已经点到过它，其主要工作是“通过调用 beginWork，来实现新 Fiber 节点的创建”；它还有一个次要工作，**就是把新创建的这个 Fiber 节点的值更新到 workInProgress 变量里去**。源码中的相关逻辑提取如下：

```js
// 新建 Fiber 节点
next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
// 将新的 Fiber 节点赋值给 workInProgress
if (next === null) {
  // If this doesn't spawn new work, complete the current work.
  completeUnitOfWork(unitOfWork);
} else {
  workInProgress = next;
}
```

如此便能够确保每次 performUnitOfWork 执行完毕后，当前的 **workInProgress 都存储着下一个需要被处理的节点，从而为下一次的 workLoopSync 循环做好准备**。

现在在 workLoopSync 内部打个断点，尝试输出每一次获取到的 workInProgress 的值，workInProgress 值的变化过程如下图所示：

![Drawing 15.png](https://s0.lgstatic.com/i/image/M00/71/12/CgqCHl-80ZuAA1HAAAEBle-yZFM332.png)

共有 7 个节点，若你点击展开查看每个节点的内容，就会发现这 7 个节点其实分别是：

- rootFiber（当前 Fiber 树的根节点）
- App FiberNode（App 函数组件对应的节点）
- class 为 App 的 DOM 元素对应的节点，其内容如下图所示

![Drawing 16.png](https://s0.lgstatic.com/i/image/M00/71/12/CgqCHl-80aSAF7MKAAEHjyZ0Xwk039.png)

- class 为 container 的 DOM 元素对应的节点，其内容如下图所示

![Drawing 17.png](https://s0.lgstatic.com/i/image/M00/71/07/Ciqc1F-80aqAJId4AACkvKHjlTM377.png)

- h1 标签对应的节点
- 第 1 个 p 标签对应的 FiberNode，内容为“我是第一段话”，如下图所示

![Drawing 18.png](https://s0.lgstatic.com/i/image/M00/71/07/Ciqc1F-80bGAGFKTAADArDpX9j4096.png)

- 第 2 个 p 标签对应的 FiberNode，内容为“我是第二段话”，如下图所示

![Drawing 19.png](https://s0.lgstatic.com/i/image/M00/71/12/CgqCHl-80biASe4KAAEZMaZTIY8632.png)

结合这 7 个 FiberNode，再对照对照我们的 Demo：

```jsx
function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>我是标题</h1>
        <p>我是第一段话</p>
        <p>我是第二段话</p>
      </div>
    </div>
  );
}
```

**你会发现组件自上而下，每一个非文本类型的 ReactElement 都有了它对应的 Fiber 节点**。

> 注：React 并不会为所有的文本类型 ReactElement 创建对应的 FiberNode，这是一种优化策略。是否需要创建 FiberNode，在源码中是通过[isDirectTextChild](https://github.com/facebook/react/blob/765e89b908206fe62feb10240604db224f38de7d/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1068)这个变量来区分的。

这样一来，构建的这棵树里，就多出了不少 FiberNode，如下图所示：

![4.png](https://s0.lgstatic.com/i/image/M00/71/49/CgqCHl-91PKANLSRAACt8c-uYAk378.png)

Fiber 节点有了，但这些 Fiber 节点之间又是如何相互连接的呢？

#### Fiber 节点间是如何连接的呢

**不同的 Fiber 节点之间，将通过 child、return、sibling 这 3 个属性建立关系**，**其中 child、return 记录的是父子节点关系，而 sibling 记录的则是兄弟节点关系**。

这里以 h1 这个元素对应的 Fiber 节点为例，给你展示下它是如何与其他节点相连接的。展开这个 Fiber 节点，对它的 child、 return、sibling 3 个属性作截取，如下图所示：

child 属性为 null，说明 h1 节点没有子 Fiber 节点：

![Drawing 21.png](https://s0.lgstatic.com/i/image/M00/71/13/CgqCHl-80d2AV6r7AABCQ4zzis4597.png)

return 属性局部截图：

![Drawing 22.png](https://s0.lgstatic.com/i/image/M00/71/07/Ciqc1F-80eOAMhlKAACxayioeh4810.png)

sibling 属性局部截图：

![Drawing 23.png](https://s0.lgstatic.com/i/image/M00/71/13/CgqCHl-80eiAJ6doAAClFZDD7jE642.png)

可以看到，return 属性指向的是 class 为 container 的 div 节点，而 sibling 属性指向的是第 1 个 p 节点。结合 JSX 中的嵌套关系不难得知 ——**FiberNode 实例中，return 指向的是当前 Fiber 节点的父节点，而 sibling 指向的是当前节点的第 1 个兄弟节点**。

结合这 3 个属性所记录的节点间关系信息，可以将上面梳理出来的新 FiberNode 连接起来：

![5.png](https://s0.lgstatic.com/i/image/M00/71/3E/Ciqc1F-91RGAAygAAAEYVWI-PXg439.png)

以上便是 workInProgress Fiber 树的最终形态了。从图中可以看出，虽然人们习惯上仍然将眼前的这个产物称为“Fiber 树”，但**它的数据结构本质其实已经从树变成了链表**。

注意，在分析 Fiber 树的构建过程时，选取了 **beginWork** 作为切入点，但整个 Fiber 树的构建过程中，并不是只有 beginWork 在工作。这其中，还穿插着 **completeWork** 的工作。只有将 completeWork 和 beginWork 放在一起来看，才能够真正理解，Fiber 架构下的“深度优先遍历”到底是怎么一回事。

### 总结

通过本讲的学习，掌握 beginWork 的实现原理、理清 Fiber 节点的创建链路，最终串联起了 Fiber 树的宏观构建过程。

下一讲，继续 completeWork 的工作内容，将整个 render 阶段讲透；另一方面，过一遍 commit 阶段的工作流，并基于此去串联由初始化、render、commit 所组成的完整渲染工作流，力求对整个 ReactDOM.render 所触发的渲染链路形成一个系统、通透的理解。

### completeWork



## 从零实现 Fiber 与 Hooks（珠峰）

#### 前置知识

**屏幕刷新率**

大多数屏幕的刷新率是 60 次/秒。浏览器渲染动画或者页面的每一帧的速度也需要和设备的屏幕的刷新率保持一致。页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面就是流畅的，小于这个值时，页面就是卡顿的。平均每帧须在 16.6 毫秒绘制完成，所以在书写代码时力求不让一帧的工作量超过 16.6ms。

**帧**

每一帧中能进行的任务有：样式计算，布局和绘制。

JavaScript 引擎和渲染引擎在同一个主线程内运行，且它们是互斥的。如果某个 js 任务执行的时间过长，渲染线程则之能推至渲染，导致卡顿。

![image-20211207173907384](..\typora-user-images\image-20211207173907384.png)

![image-20211207183053092](..\typora-user-images\image-20211207183053092.png)

**RAF**

requestAnimationFrame 该函数会在绘制前执行。

```html
<body>
  <div
    id="progress"
    style="background-color: aqua; width: 0; height: 20px"
  ></div>
  <button id="btn" onclick="begin">开始</button>
  <script>
    let bar = document.getElementById("progress");
    let btn = document.getElementById("btn");
    let start;
    function progress() {
      bar.style.width = bar.offsetWidth + 1 + "px";
      let current = Date.now();
      if (bar.offsetWidth < 100) {
        console.log(current - start);
        start = current;
        requestAnimationFrame(progress);
      }
    }
    btn.addEventListener("click", function () {
      bar.style.width = 0 + "px";
      start = Date.now();
      requestAnimationFrame(progress);
    });
  </script>
</body>
```

**requestIdleCallback**

永远不要在该 API 的回调函数中操作 dom，因为它会导致页面的重绘或者重排。

![image-20211207183221586](..\typora-user-images\image-20211207183221586.png)

申请时间片执行。`requestIdleCallback` 在浏览器一帧内的位置示意。从上图也可看出，和 `requestAnimationFrame` 每一帧必定会执行不同，`requestIdleCallback` 是捡浏览器空闲来执行任务。

如此一来，假如浏览器一直处于非常忙碌的状态，`requestIdleCallback` 注册的任务有可能永远不会执行。此时可通过设置 `timeout` （见下面 API 介绍）来保证执行。

```js
var handle = window.requestIdleCallback(callback[, options])
```

- callback: ()：回调即空闲时需要执行的任务，接收一个`IdleDeadline`对象作为入参。其中 IdleDeadline 对象包含：
  - `didTimeout`，布尔值，表示任务是否超时，结合 `timeRemaining` 使用。
  - `timeRemaining()`，表示当前帧剩余的时间，也可理解为留给任务的时间还有多少。
- options：目前 options 只有一个参数
  - `timeout `。表示超过这个时间后，如果任务还没执行，则强制执行，不必等待空闲。

```html
<body>
  <script>
    function sleep(delay) {
      for (let start = Date.now(); Date.now() - start < delay; ) {}
    }
    const works = [
      () => {
        console.log("task 1 begin");
        sleep(10);
        console.log("task 1 end");
      },
      () => {
        console.log("task 2 begin");
        sleep(10);
        console.log("task 2 end");
      },
      () => {
        console.log("task 3 begin");
        // sleep(20);
        console.log("task 3 end");
      },
    ];

    requestIdleCallback(workLoop, { timeout: 1000 });
    // deadline是浏览器在执行workLoop函数时传入的参数，该参数是一个对象类型，上面有一个方法和一个属性：
    // timeRemaining() 方法返回此帧还剩余多少时间可用
    // didTimeout 表示该callback回调是否超时
    function workLoop(deadline) {
      // 如果此帧有剩余时间或者此任务已经超时且队列中还有剩余任务
      console.log(`本帧剩余时间${parseInt(deadline.timeRemaining())}`);
      while (
        (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
        works.length > 0
      ) {
        works.shift()();
        console.log(
          `执行完一次任务后还剩余时间${parseInt(deadline.timeRemaining())}`
        );
      }
      // 如果没有剩余时间了，就需要放弃执行之后的任务，并将控制权交还给浏览器

      if (works.length > 0) {
        window.requestIdleCallback(workLoop, { timeout: 1000 });
      }
    }
  </script>
</body>
```

**单链表**

一种链式存取的数据结构。链表中的数据是以节点来表示的，每个节点的构成：元素 + 指针（指向后继元素的存储位置），元素就是存储数据的存储单元，指针是链接每个节点的地址。

JavaScript 模拟链表结构：

```js
class Update {
  //每一个update实例就是一个链表中的节点
  constructor(payload, nextUpdate) {
    // payload 则是节点中的元素
    this.payload = payload;
    // nextUpdate 是指向下一个节点的指针
    this.nextUpdate = nextUpdate;
  }
}

class UpdateQueue {
  constructor() {
    this.baseState = null; //原状态数据
    this.fisrtUpdate = null; //指向第一个节点
    this.lastUpdate = null; //指向最后一个节点
  }
  enqueueUpdate(update) {
    if (this.fisrtUpdate === null) {
      //空链表
      this.fisrtUpdate = this.lastUpdate = update;
    } else {
      this.lastUpdate.nextUpdate = update; // 上一个节点的nextUpdate指向当前节点
      this.lastUpdate = update; // 让最后一个节点指针指向当前节点
    }
  }
  forceUpdate() {
    let currentState = this.baseState || {};
    let currentUpdate = this.fisrtUpdate;
    while (currentUpdate) {
      let nextState =
        typeof currentUpdate.payload === "function"
          ? currentUpdate.payload(currentState)
          : currentUpdate.payload;
      currentState = { ...currentState, ...nextState };
      currentUpdate = currentUpdate.nextUpdate;
    }
    this.fisrtUpdate = this.lastUpdate = null;
    this.baseState = currentState;
    return currentState;
  }
}

// 每个setState会成为一个Update实例节点，多个setState会形成一个链表，最后再某个时间点进行合并
let queue = new UpdateQueue();
queue.enqueueUpdate(new Update({ name: "jack" }));
queue.enqueueUpdate(new Update({ number: 0 }));
queue.enqueueUpdate(new Update((state) => ({ number: state.number + 1 })));
queue.enqueueUpdate(new Update((state) => ({ number: state.number + 1 })));
queue.enqueueUpdate(new Update({ number: 0 }));
queue.forceUpdate();
console.log(queue.baseState);
```

一个虚拟 DOM 就是一个链表的节点，也是一个工作单元。如果一个虚拟 DOM 的更新时间超过一帧的时间，则无法避免，因为一个虚拟 DOM 就是一个最小单元。这样组件更新即使卡顿 React 也没有办法解决了。

这种调度方式是合作式的调度，浏览器预设开发者写的代码的执行时间不会超过给的剩余时间。开发者相信浏览器会在空闲时将时间片给到开发者，而浏览器预设开发者不会过度使用它提供的时间片。如果开发者中的代码有死循环或者执行时间过长，仍就会导致页面卡顿。



#### Fiber 之前的架构

fiber 之前的调和，React 会递归的比较虚拟 DOM 树，找出需要变动的节点，然后同步更新节点。在调和期间 React 会一直占用浏览器的资源，会无法响应用户交互，掉帧等。

为什么以前的 React 调和过程会卡顿和不能中断？

- 递归遍历且深度优先
- 不能中断，执行栈太深

```js
let root = {
  key: "A1",
  children: [
    {
      key: "B1",
      children: [
        { key: "C1", children: [] },
        { key: "C2", children: [] },
      ],
    },
    {
      key: "B2",
      children: [],
    },
  ],
};

function walk(vdom) {
  doWork(vodm);
  vdom.children.forEach((child) => {
    walk(childe0);
  });
}

function doWork(vdom) {
  console.log(vdom.key);
}

walk(root);
```

#### Fiber

通过某些调度策略合理分配 CPU 资源，提高对用户的响应。Fiber 架构让调和过程可中断。一个虚拟 DOM 就是一个链表的节点，也是一个工作单元。

**Fiber 是一个执行单元**

Fiber 是一个执行单元，每次执行完一个执行单元，React 就会检测还剩余多少时间，如果没有时间就交出控制权。

![image-20211207221055304](..\typora-user-images\image-20211207221055304.png)

**Fiber 是一种数据结构**

React 目前的做法是使用链表，每个虚拟 DOM 节点内部表示为一个 Fiber。

```js
type Fiber = {
  type: any, // 类型
  return: Fiber, //父节点
  child: Fiber, //第一个子节点
  sibling: Fiber, //下一个兄弟节点
};
```

![image-20211207224515886](..\typora-user-images\image-20211207224515886.png)

React 如何定义一个执行单元？一个 Fiber 节点（虚拟 DOM）就是一个执行单元。在 React15 中 jsx 被转化为虚拟 DOM，在 React16 以后 JSX 转为虚拟 DOM，虚拟 DOM 会转为 Fiber 结构。

#### Fiber 的渲染阶段

每次渲染分为两个阶段：Reconciliation（协调 | render）和 Commit（提交）

协调阶段中最重要的是 DIff 阶段，这个阶段可以被中断，这个阶段执行时会找出所有的变更，比如节点的增删改查，属性变更（这些变更被称为副作用——effect）

提交阶段将协调阶段计算出的需要处理的副作用一次性的执行，这个阶段时同步执行的，不能被打断。

**Render 阶段**

Render 阶段的结果是 Effect list（副作用链表）

构建 fiber 树。

```js
let A1 = { type: "div", key: "A1" };
let B1 = { type: "div", key: "B1", return: A1 };
let B2 = { type: "div", key: "B2", return: A1 };
let C1 = { type: "div", key: "C1", return: B1 };
let C2 = { type: "div", key: "C2", return: B1 };

A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;
module.export = A1;
```

遍历 Fiber 树的规则：

- 从顶点开始遍历
- 如果有 firstChild，先遍历 firstChild
- 如果没有 firstChild，表示该节点遍历结束
- 如果 firstChild 有 sibling 节点，则遍历 sibling 节点
- 如果没有下一个 sibling 节点，返回父节点标识完成父节点的遍历，如果有父节点的 sibling 节点则遍历它
- 没有则父节点遍历结束开始向上返回

```js
const rootFiber = require("./element.js");
let nextUnitOfWork = null;
function workLoop() {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    console.log("render阶段结束");
  }
}

function performUnitOfWork(fiber) {
  beginWork(fiber);
  if (fiber.child) {
    return fiber.child;
  }
  // 节点没有child，说明此节点已经完成
  while (fiber) {
    completeUnitOfWork(fiber);
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}

function beginWork(fiber) {
  console.log("开始" + fiber.key);
}

function completeUnitOfWork(fiber) {
  console.log("结束" + fiber.key);
}

nextUnitOfWork = rootFiber;
workLoop();
```

requestIdleCallback 和 Fiber 实现可中断任务：

```js
const rootFiber = require("./element.js");
let nextUnitOfWork = null;
function workLoop(deadline) {
  // while (nextUnitOfWork) {
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    nextUnitOfWork
  ) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    console.log("render阶段结束");
  } else {
    window.requestIdleCallback(workLoop, { timeout: 1000 });
  }
}

function performUnitOfWork(fiber) {
  beginWork(fiber);
  if (fiber.child) {
    return fiber.child;
  }
  // 节点没有child，说明此节点已经完成
  while (fiber) {
    completeUnitOfWork(fiber);
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}

function beginWork(fiber) {
  console.log("开始" + fiber.key);
}

function completeUnitOfWork(fiber) {
  console.log("结束" + fiber.key);
}

nextUnitOfWork = rootFiber;
// workLoop();
requestIdleCallback(workLoop, { timeout: 1000 });
```

根 Fiber 是 react 脚手架项目中的 index.html 文件中的 id="app"的 div 节点。

render 阶段的两个主要任务：

- 根据虚拟 DOM 生成 Fiber 树
- 收集 effect list,节点的增删改情况

## Fiber2 版本的 React 编写

### 实现虚拟 DOM

constants.js:

```js
// 文本元素
export const ELEMENT_TEXT = Symbol.for("ELEMENT_TEXT");
// 根Fiber
export const TAG_ROOT = Symbol.for("TAG_ROOT");
// 元素标签节点
export const TAG_HOST = Symbol.for("TAG_HOST");
// 文本节点
export const TAG_TEXT = Symbol.for("TAG_TEXT");
```

index.js:

```js

```

react.js:

```js
import { ELEMENT_TEXT } from "./constants";
/**
 * 创建元素（虚拟DOM）的方法
 * @param {*} type
 * @param {*} config
 * @param  {...any} children
 */
function createElement(type, config, ...children) {
  delete config.__self;
  delete config.__source;
  console.log(123);
  return {
    type: type,
    props: {
      ...config,
      children: children.forEach((child) => {
        // 子节点分为reactElement对象或者文本字符串
        return typeof child === "object"
          ? child
          : {
              type: ELEMENT_TEXT,
              props: {
                text: child,
                children: [],
              },
            };
      }),
    },
  };
}

const React = {
  createElement,
};

export default React;
```

react-dom.js:

```js

```

![image-20211208180802476](..\typora-user-images\image-20211208180802476.png)

深度优先变为线性更新



## 卡颂 React

“学习源码”划分为 5 个层次，阐述了：

- 达到每个层次需要掌握哪些知识
- 怎样最快的掌握这些知识
- 达到这一层次后会收获什么

从理念到架构，从架构到实现，从实现到具体代码。从原理到源码得一个过程。

React 框架为了实现一个什么目的而产生？（理念）

为了实现这个目的（理念），React 又做了哪些处理和如何架构？

目的：React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式。

制约`快速响应`的因素是什么？

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

- CPU 的瓶颈
- IO 的瓶颈

`React`是如何解决这两个瓶颈的呢？

针对 CPU 瓶颈：在浏览器每一帧的时间中，预留一些时间给 JS 线程，`React`利用这部分时间更新组件（可以看到，在[源码 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)中，预留的初始时间是 5ms）。当预留的时间不够用时，`React`将线程控制权交还给浏览器使其有时间渲染 UI，`React`则等待下一帧时间到来继续被中断的工作。——时间切片

此时我们的长任务被拆分到每一帧不同的`task`中，`JS脚本`执行时间大体在`5ms`左右，这样浏览器就有剩余时间执行**样式布局**和**样式绘制**，减少掉帧的可能性。

不是不可能掉帧，是尽可能的减少了掉帧的情况出现。所以，解决`CPU瓶颈`的关键是实现`时间切片`，而`时间切片`的关键是：将**同步的更新**变为**可中断的异步更新**。

React15 架构

React15 为什么不能满足**快速响应**的理念？

React15 架构可以分为两层：

- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

Reconciler（协调器）

在 React 中，通过`this.setState`、`this.forceUpdate`、`ReactDOM.render`等 API 触发更新。

每当有更新发生时，**Reconciler**会做如下工作：

- 调用函数组件、或 class 组件的`render`方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知**Renderer**将变化的虚拟 DOM 渲染到页面上

Renderer（渲染器）

不同平台有不同的**Renderer**。前端是负责在浏览器环境渲染的**Renderer** —— ReactDOM。

除此之外，还有：

- [ReactNative](https://www.npmjs.com/package/react-native)渲染器，渲染 App 原生组件
- [ReactTest ](https://www.npmjs.com/package/react-test-renderer)渲染器，渲染出纯 Js 对象用于测试
- [ReactArt](https://www.npmjs.com/package/react-art)渲染器，渲染到 Canvas, SVG 或 VML (IE8)

在每次更新发生时，**Renderer**接到**Reconciler**通知，将变化的组件渲染在当前宿主环境。

React15 的缺点

在**Reconciler**中，`mount`的组件会调用[mountComponent ](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498)，`update`的组件会调用[updateComponent ](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877)。这两个方法都会递归更新子组件。

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。

案例：

```jsx
import React from "react";

export default class App extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      count: 1,
    };
  }
  onClick() {
    this.setState({
      count: this.state.count + 1,
    });
  }
  render() {
    return (
      <ul>
        <button onClick={() => this.onClick()}>乘以{this.state.count}</button>
        <li>{1 * this.state.count}</li>
        <li>{2 * this.state.count}</li>
        <li>{3 * this.state.count}</li>
      </ul>
    );
  }
}
```

**Reconciler**和**Renderer**是交替工作的，当第一个`li`在页面上已经变化后，第二个`li`再进入**Reconciler**。

由于整个过程都是同步的，所以在用户看来所有 DOM 是同时更新的。

React16 架构

React16 架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

Scheduler（调度器）

既然以浏览器是否有剩余时间作为任务中断的标准，那么需要一种机制，当浏览器有剩余时间时通知我们。

部分浏览器已经实现了这个 API，这就是[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)，但是有以下问题：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 tab 注册的`requestIdleCallback`触发的频率会变得很低

为此，`React`实现了功能更完备的`requestIdleCallback`polyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，还提供了多种调度优先级供任务设置。

> [Scheduler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md)是独立于`React`的库

Reconciler（协调器）

在 React15 中**Reconciler**是递归处理虚拟 DOM 的。在 React16 中，更新工作从递归变成了可以中断的循环过程。每次循环都会调用`shouldYield`判断当前是否有剩余时间。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么当整个应用并没有全部更新为最新状态时，DOM 渲染会不会不完全？

在 React16 中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

**整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。**

Renderer（渲染器）

**Renderer**根据**Reconciler**为虚拟 DOM 打的标记，**同步执行**对应的 DOM 操作。这步就无法中断了。

```jsx
import React from "react";

export default class App extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      count: 1,
    };
  }
  onClick() {
    this.setState({
      count: this.state.count + 1,
    });
  }
  render() {
    return (
      <ul>
        <button onClick={() => this.onClick()}>乘以{this.state.count}</button>
        <li>{1 * this.state.count}</li>
        <li>{2 * this.state.count}</li>
        <li>{3 * this.state.count}</li>
      </ul>
    );
  }
}
```

![image-20221213145302021](../%E7%8F%A0%E5%B3%B0%E6%9E%B6%E6%9E%84/React%E8%BF%9B%E9%98%B6.assets/image-20221213145302021.png)

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，用户也不会看见更新不完全的 DOM。

之所以任务可中断，因为`React16`采用新的 Reconciler,内部采用了 Fiber 的架构。
