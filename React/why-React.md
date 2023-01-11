## 认识 React

React 是一个用于构建用户界面的 JavaScript 库。

原生的 js 构建用户界面的问题：

- 操作 DOM 存在兼容性问题
- api 代码过长的问题
- 代码组织不够规范问题
- 频繁的操作 DOM 导致性能低
- 数据分散在各个代码中，不方便管理和维护

特点：

- 声明式开发
- 组件化开发
- 多平台适配（web 和原生）

ES6 中，类的原型方法中的 this 在该原型方法被当作变量赋值给其他变量后，再通过该被赋值的变量在全局作用域下进行调用的话，默认 this 是 undefined。

## 使用 React 的方式

方式一：在现有 html 代码中引入 React 相关的依赖

引入 React 依赖，注意对于 Vue 而言，引入 html 中只需要引入一个文件，即 Vue 的核心库就可以直接使用。但是 React 在 html 中引入则依赖三个库：

- react.js：React 所必须的核心代码
- react-dom.js：web 端平台渲染需要的核心代码
- babel.js：将 jsx 语法转为 js 语法的工具库，如果不借助该工具库的话，需要使用 React.createElement 的方式进行开发，但这种书写方式太过繁琐，所以使用了语法糖的写法，即：jsx 语法写法。

```html
<--react依赖的三个包引入... CDN-->

<div id="app"></div>

<script type="text/babel">
  let message = 'hello world';

  function btnClick() {
    message = 'hello React';
    render();
  }

  function render() {
    ReactDOM.render(
      <>
        <h2>{message}</h2>
        <button onClick={btnClick}>点击</button>
      </>,
      document.getElementById('app')
    );
  }
  render();
</script>
```

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'hello world'
    };
  }

  btnClick() {
    this.setState({
      message: 'hello react'
    });
  }

  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
        <button onClick={this.btnClick.bind(this)}>点击</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

---

## 列表渲染（map）

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: ['a', 'b', 'c', 'd', 'e']
    };
  }

  render() {
    return;
    <ul>
      {this.state.lists.map((item, index) => {
        return <li key={index}>{item}</li>;
      })}
    </ul>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## 计数器

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  render() {
    return;
    <div>
      <h2>counter:{this.state.counter}</h2>
      <button onClick={this.add.bind(this)}>+1</button>
      <button onClick={this.sub.bind(this)}>-1</button>
    </div>;
  }

  add() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  sub() {
    this.setState({
      counter: this.state.counter - 1
    });
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## JSX

```jsx
<div className ={'box head '+ (flag?'active':'')}></div>

<label htmlFor='idName'></label>

<div style={{color:'red',fontSize:'50px'}}></div>
```

## 事件绑定

```jsx
//原生事件绑定
let btn = document.getElementById('mybtn')
btn.addEventListener('click',function(){
    ......
})
btn.onclick = function (){
    ......
}
```

```jsx
<div onClick={this.handleClick}></div>
```

```js
class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            counter:0
        }
        this.sub = this.sub.bind(this)  //方式二
    }

    render(){
        return
        	<div>
        		<h2>counter:{this.state.counter}</h2>
        		<button onClick={this.add.bind(this)}>+1</button>   //方式一
        		<button onClick={this.sub}>-1</button>
        		<button onClick={this.btnClick}>-1</button>
        		<button onClick={(e)=>{
                    this.btnClick2(e, 'info')     //方式四，推荐 这样可以方便传参且性能好
                }}>-1</button>
        	</div>
    }

    add(event){
        //event 是react框架在jsx中该函数没有手动传递参数的情况下默认传递的
        this.setState({
            counter:this.state.counter + 1
        })
    }

	sub(){
        this.setState({
            counter:this.state.counter - 1
        })
    }

	btnClick = ()=>{    //方式三，等价于给实例对象绑定属性
        .....
    }

    btnClick2(event,value){
        ....
    }
}

ReactDOM.render(<App/>, document.getElementById('app'))
```

![image-20211123184940628](..\typora-user-images\image-20211123184940628.png)

jsx=>createElement 函数=>reactElement 对象（原生 js 对象,树结构，虚拟 DOM）=>ReactDom.render =>真实 DOM

jsx=>createElement 函数=>reactElement 对象（原生 js 对象,树结构，虚拟 DOM）=>ReactDom.render =>原生 App 控件

## React 脚手架

![image-20211123185844535](..\typora-user-images\image-20211123185844535.png)

![image-20211123190120185](..\typora-user-images\image-20211123190120185.png)

![image-20211123190629704](..\typora-user-images\image-20211123190629704.png)

## PWA

Progressive Web App:渐进式 web 应用（Web App）。一个 PWA 应用首先是一个 web 应用程序，，通过 App Manifest 和 Service Worker 能实现 PWA 的安装和部分离线功能。

传统的网页应用是无法安装到手机上的，且不提供离线功能。为了达到这两个功能就需要下面的两个文件：

mainfest.json: 对添加到主屏幕的应用做配置。

serviceWorker.js:实现应用的离线能力。

## 组件化

类组件：

- 组件名字必须是大写字母开头
- 类组件需要继承 React.Component 类
- 类组件必须实现 render 函数（也是一个生命周期函数）

render 函数的返回值：

- JSX 语法
- 数组
- Fragment 组件
- Portals：内容被渲染到指定的元素
- 字符串或者数字：渲染为文本
- null 或者布尔值：不渲染任何内容

函数组件：

- 使用函数来定义的的组件，函数的返回值被用于渲染，一般返回 JSX

- 没有生命周期函数

- 没有 this 指代组件实例

- 没有自己的状态 state

- 接受 props

React16 以后的生命周期函数：

![image-20211008123109507](..\typora-user-images\image-20211008123109507.png)

## 组件通信

- props(父传子，子传父)
- context ![image-20211008213053789](..\typora-user-images\image-20211008213053789.png)

  ![image-20211008220112838](..\typora-user-images\image-20211008220112838.png)

  ![image-20211008215540079](..\typora-user-images\image-20211008215540079.png)

  ![image-20211008215557378](..\typora-user-images\image-20211008215557378.png)

类组件中使用 context：

![image-20211008215649033](..\typora-user-images\image-20211008215649033.png)

![image-20211008215640502](..\typora-user-images\image-20211008215640502.png)

函数组件中使用 context：

- 方式一：consumer 组件

![3432132](..\typora-user-images\image-20211008220154117.png)

多个 context 的使用：

![image-20211008220429645](..\typora-user-images\image-20211008220429645.png)

![image-20211008220403013](..\typora-user-images\image-20211008220403013.png)

- 方式二：useContext ( ) 这是在函数组件中获取上下文对象的一个 hook

  ![image-20211115222121232](..\typora-user-images\image-20211115222121232.png)

 ![image-20211115222147907](..\typora-user-images\image-20211115222147907.png)

![image-20211115222434740](..\typora-user-images\image-20211115222434740.png)

- 事件总线

  ![image-20211009121314654](..\typora-user-images\image-20211009121314654.png)

yarn add events

```jsx
import { EventEmitter } from 'events'

const eventBus = new EventEmitter()


eventBus.emit(eventName,xxx,yyy,zzz,...)


eventBus.addListener(eventName,func)

eventBus.removeListener(eventName,func)


function func(...args){
    .....
}
```

**其他通信方式：**

- ref
- redux/react-redux/dva/redux-saga/mobx....
- 本地存储

## 使用 PropTypes 进行类型检查

使用案例：

```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  // 说白了就是类组件的静态属性
  name: PropTypes.string
};
```

```jsx
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // 你可以将属性声明为 JS 原生类型，默认情况下
  // 这些属性都是可选的。
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,

  // 一个 React 元素。
  optionalElement: PropTypes.element,

  // 一个 React 元素类型（即，MyComponent）。
  optionalElementType: PropTypes.elementType,

  // 你也可以声明 prop 为类的实例，这里使用
  // JS 的 instanceof 操作符。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你可以让你的 prop 只能是特定的值，指定它为
  // 枚举类型。
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 一个对象可以是几种类型中的任意一个类型
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 可以指定一个数组由某一类型的元素组成
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 可以指定一个对象由特定的类型值组成
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),

  // 你可以在任何 PropTypes 属性后面加上 `isRequired` ，确保
  // 这个 prop 没有被提供时，会打印警告信息。
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,

  // 你可以指定一个自定义验证器。它在验证失败时应返回一个 Error 对象。
  // 请不要使用 `console.warn` 或抛出异常，因为这在 `onOfType` 中不会起作用。
  customProp: function (props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' +
          propName +
          '` supplied to' +
          ' `' +
          componentName +
          '`. Validation failed.'
      );
    }
  },

  // 你也可以提供一个自定义的 `arrayOf` 或 `objectOf` 验证器。
  // 它应该在验证失败时返回一个 Error 对象。
  // 验证器将验证数组或对象中的每个值。验证器的前两个参数
  // 第一个是数组或对象本身
  // 第二个是他们当前的键。
  customArrayProp: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    location,
    propFullName
  ) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' +
          propFullName +
          '` supplied to' +
          ' `' +
          componentName +
          '`. Validation failed.'
      );
    }
  })
};
```

必传：

```jsx
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // 这必须只有一个元素，否则控制台会打印警告。
    const children = this.props.children;
    return <div>{children}</div>;
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

默认值：

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 指定 props 的默认值：
Greeting.defaultProps = {
  name: 'Stranger'
};

// 渲染出 "Hello, Stranger"：
ReactDOM.render(<Greeting />, document.getElementById('example'));

class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  };

  static propTypes = {};

  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}
```

## React 中模拟插槽

![image-20211008212125543](..\typora-user-images\image-20211008212125543.png)

![image-20211123233016309](..\typora-user-images\image-20211123233016309.png)

![image-20211018192350128](..\typora-user-images\image-20211018192350128.png)

## 属性展开 props

有一个 props 对象，可以使用展开运算符 `...` 来在 JSX 中传递整个 props 对象。

```jsx
function App1() {
  return <Greeting firstName='Ben' lastName='Hector' />;
}

function App2() {
  const props = { firstName: 'Ben', lastName: 'Hector' };
  return <Greeting {...props} />;
}
```

还可以选择只保留当前组件需要接收的 props，并使用展开运算符将其他 props 传递下去。

```jsx
const Button = (props) => {
  const { kind, ...other } = props;
  const className = kind === 'primary' ? 'PrimaryButton' : 'SecondaryButton';
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind='primary' onClick={() => console.log('clicked!')}>
        Hello World!
      </Button>
    </div>
  );
};
```

## setState 详解

源码

![image-20220227114842861](..\typora-user-images\image-20220227114842861.png)

**setState 异步的情况：**

![image-20211008221729233](..\typora-user-images\image-20211008221729233.png)

方式一：调用 setState 后如何获取更新后的数据

![image-20211008222546915](..\typora-user-images\image-20211008222546915.png)

方式二：在 componentDidUpdate 中获取，并且执行顺序先于方式一

![image-20211008222736572](..\typora-user-images\image-20211008222736572.png)

**setState 同步的情况：**

![image-20211008223213631](..\typora-user-images\image-20211008223213631.png)

![image-20211008223225213](..\typora-user-images\image-20211008223225213.png)

setState 传入对象时是原对象和新对象进行合并而非替换。

![image-20211008224451235](..\typora-user-images\image-20211008224451235.png)

## 多个 setState 函数的合并与不合并

![image-20211008225012001](..\typora-user-images\image-20211008225012001.png)

![image-20211008225157866](..\typora-user-images\image-20211008225157866.png)

## React 渲染流程

![image-20211008230820130](..\typora-user-images\image-20211008230820130.png)

![image-20211008231016099](..\typora-user-images\image-20211008231016099.png)

![image-20211008231417658](..\typora-user-images\image-20211008231417658.png)

![image-20211008231458042](..\typora-user-images\image-20211008231458042.png)

![image-20211008231657540](..\typora-user-images\image-20211008231657540.png)

![image-20211008231947820](..\typora-user-images\image-20211008231947820.png)

## render 函数的调用

在祖先组件中调用祖先组件自己的 setState 方法变更祖先组件的 state 时，会导致组件组件重新渲染。而祖先组件重新渲染会导致它的 jsx 语法中使用到的其他后代组件都全部重新渲染（注意不是创建），即使被改变的祖先组件的 state 没有在任何一个后代组件中用于渲染。这样就造成了不必要的性能损耗。 为了避免这种情况的解决方案：

方案一：使用后代组件的 shopuldComponentUpdate( ) 生命周期函数

```
shopuldComponentUpdate(nextProps, nextState, nextContext){
	....
	return false | true
}
```

![image-20211009091135649](..\typora-user-images\image-20211009091135649.png)

![image-20211018210642784](..\typora-user-images\image-20211018210642784.png)

使用 shopuldComponentUpdate 来判断是否组件重新渲染的不足：

- 函数组件没有 shopuldComponentUpdate 及其他生命周期函数
- shopuldComponentUpdate 必须针对不同的 state 做判断以决定是否重新渲染组件，当 state 很多时显然不适用
- 一个祖先组件有许多的后代组件，每个组件都需要使用 shopuldComponentUpdate 判断，显然不实际

方案二：类组件继承自 PureComponent 而不是 Component

![image-20211009092536213](..\typora-user-images\image-20211009092536213.png)

不足：

- 只有类组件才有 PureComponent

方案三：memo 解决函数组件更新问题

```jsx
import React, { memo } from 'react'

const HomeHeader = fucntion (props){
    return (
    	<div>
        	<h2>home-header</h2>
        </div>
    )
}

const MemoHomeHeader =  memo(HomeHeader)
```

![image-20211009093429788](..\typora-user-images\image-20211009093429788.png)

注意：通过 setState 修改 state 时，即使该 state 并没有被任何组件渲染到页面中，同样会导致组件重新渲染。

## 性能优化

- key 值设置
- 继承 Purecomponent 组件
- memo 解决函数组件更新问题
- shouldComponentUpdate 生命周期的使用 ,该声明周期函数接受两个参数（最新的 props 和 最新的 state）

## setState 传递的数据应该是不可变的数据

在 setState 中传入新的值时，要保证要修改的 state 的值对应的应该是一个新的值，而不要直接修改原来的 state 对象中的值后再传给特定的 state。

案例：

![image-20211009094427218](..\typora-user-images\image-20211009094427218.png)

![image-20211009094450738](..\typora-user-images\image-20211009094450738.png)

下图中做法并不建议：

![image-20211009094646773](..\typora-user-images\image-20211009094646773.png)

因为如果组件有 shouldComponentUpdate 生命周期函数时，可能因为判断引用类型是否相等导致走错误的判断逻辑而使得组件不再因为数据的更新而重新调用 render 函数进行渲染。

![image-20211009095147468](..\typora-user-images\image-20211009095147468.png)

推荐做法：

![image-20211009095353546](..\typora-user-images\image-20211009095353546.png)

## ref

![image-20211009121518981](..\typora-user-images\image-20211009121518981.png)

![image-20211009122134383](..\typora-user-images\image-20211009122134383.png)

![image-20211009122143453](..\typora-user-images\image-20211009122143453.png)

## 受控组件和非受控组件

和表单元素有关。

![image-20211009122311242](..\typora-user-images\image-20211009122311242.png)

![image-20211009122919976](..\typora-user-images\image-20211009122919976.png)

![image-20211009123327410](..\typora-user-images\image-20211009123327410.png)

![image-20211009123505212](..\typora-user-images\image-20211009123505212.png)

![image-20211009123815826](..\typora-user-images\image-20211009123815826.png)

![image-20211009124327789](..\typora-user-images\image-20211009124327789.png)

## 高阶组件（函数）

高阶函数（满足下面条件之一就是）：

- 接受一个或者多个函数作为输入
- 返回一个函数

高阶组件：

- Higher-Order-Components（HOC）
- 高阶组件本身不是一个组件而是一个函数
- 该函数的参数是一个组件，且返回一个组件

![image-20211009133655372](..\typora-user-images\image-20211009133655372.png)

高阶组件的应用场景：

- 对组件进行劫持

- 增强 props ![image-20211009135122073](..\typora-user-images\image-20211009135122073.png)

- 渲染判断鉴权吧 ![image-20211009143044300](..\typora-user-images\image-20211009143044300.png)

  ```jsx
  function enhanceAuth(component) {
    return (props) => {
      let { isLogin } = props;
      if (isLogin) {
        return <FunComponent {...props}>//应用组件</FunComponent>;
      } else {
        return <Login>//登录组件</Login>;
      }
    };
  }
  ```

- 组件生命周期劫持

  ```jsx
  function withRenderTime(WrappedComponent) {
    const enhance = class extends PureComponent {
      componentWillMount() {
        this.beginTime = Date.now();
      }
      componentDidMount() {
        this.endTime = Date.now();
        const cost = this.endTime - this.beginTime;
        console.log(`${WrappedComponent.name}的渲染时间是：${cost}`);
      }
  
      render() {
        return <WrappedComponent {...this.props}></WrappedComponent>;
      }
    };
    enhance.displayname = 'selfDefineName';
    return enhance;
  }
  ```

  ![image-20211009143102534](..\typora-user-images\image-20211009143102534.png)

类表达式：

```
const App = class {
	.....
}
```

![image-20220227140100422](..\typora-user-images\image-20220227140100422.png)

## ref 转发

![image-20211009144123620](..\typora-user-images\image-20211009144123620.png)

## Portals

![image-20211126212159297](..\typora-user-images\image-20211126212159297.png)

![image-20211126212230398](..\typora-user-images\image-20211126212230398.png)

![image-20211126212237506](..\typora-user-images\image-20211126212237506.png)

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.PureComponent {
  render() {
    return ReactDOM.createPortal(this.prosp.children, document.getElementById('modal'));
  }
}
```

Antdesign 中的弹框就是借助类似的思想开发的，它内部先用原生 js 创建一个 div 并追加到 body 后面 。然后内部使用 ReactDOM.render( 要渲染的组件 , div)。因为 Antdesign，它作为第三方库是自己创建的 div，它无法要求用户在模板 html 中预先设置到对应的 div。

## fragment

![image-20211009145321116](..\typora-user-images\image-20211009145321116.png)

![image-20211011224342656](..\typora-user-images\image-20211011224342656.png)

![image-20211011224437640](..\typora-user-images\image-20211011224437640.png)

## StrictMode

只是在开发阶段会有效，在生产环境下不会生效。

![image-20211009145503619](..\typora-user-images\image-20211009145503619.png)

![image-20211009145910655](..\typora-user-images\image-20211009145910655.png)

## React 中的 CSS

- CSS 需要具备局部作用的能力，不污染其他组件内的样式
- 可以编写动态的 CSS
- 支持所有的 CSS 新旧特性（伪类，动画，媒体查询等）
- 书写简洁方便

内联样式：

![image-20211009151817113](..\typora-user-images\image-20211009151817113.png)

```jsx
const box = {
    color:this.state.color,
    textDecoration:'underline'
}

<div style={{fontSize:'50px',color:'red'}}></div>
<div style={ box }></div>
```

普通 CSS：

![image-20211009153124044](..\typora-user-images\image-20211009153124044.png)

css 单独以文件的形式进行书写，在对应的模块引入 css 文件即可。这种方式的不足是很容易引起样式的冲突，因为样式是全局生效的。

CSS modules

![image-20211009153353198](..\typora-user-images\image-20211009153353198.png)

在组件文件中引入 css 文件并赋值给一个变量。之后通过变量名.类名或者变量名[类名]的方式使用。

CSS in JS：

```shell
yarn add styled-components
```

![image-20211012002846827](..\typora-user-images\image-20211012002846827.png)

![image-20211012002948324](..\typora-user-images\image-20211012002948324.png)

**使用 styled-components**

```jsx
import React, { PureComponent } from 'react';
import styled from 'styled-components';

//styled.div是一个函数，它执行完后返回一个div组件
//styled.span是一个函数，它执行完后返回一个span组件
const StyleBox = styled.div`
	font-size:50px;
	color:red
	.banner{
		background-color:#afc
		&.active{
			....
		}
		&:hover{
			....
		}
		&::after{
			....
		}
	}
`;
const TitleH2 = styled.h2`
  font-size: 20px;
  color: green;
`;

export default class Home extends PureComponent {
  render() {
    return (
      <StyleBox>
        //该div自带了上面设置好的样式
        <h2>我是home的标题</h2>
        <TitleH2>哈哈哈哈</TitleH2>
        <div className='banner'>酷酷酷酷酷</div>
      </StyleBox>
    );
  }
}
```

![image-20211012004249601](..\typora-user-images\image-20211012004249601.png)

![image-20211012004300008](..\typora-user-images\image-20211012004300008.png)

项目中使用 styled-components:

![image-20211012005002884](..\typora-user-images\image-20211012005002884.png)

![image-20211012005031890](..\typora-user-images\image-20211012005031890.png)

![image-20211012005043256](..\typora-user-images\image-20211012005043256.png)

特点：

- props 穿透
- attrs 的使用
- 传入 state 作为 props 属性

```jsx
import styled from 'styled-components'

const LoginInput = styled.input`
	border:0px;
	font-size:${props=>props.font}
`

export default Login extends Component{
    state={
        font:'30px'
    }
    render(){
        return {
            <div>
                //font，type都传到组件的props属性中
            	<LoginInput type='password' font={this.state.font}></LoginInput>
            </div>
        }
    }
}
```

```jsx
const LoginInput = styled.input.attrs({
  placeholder: '请输入密码', //该input的placeholder属性就会被设置标签的placeholder原生属性
  bColor: '#afc' //传到组件的props属性中
})`
  border: 5px;
  border-color: ${(props) => props.bColor};
`;
```

- 继承

  ![image-20211012093339574](..\typora-user-images\image-20211012093339574.png)

   ![image-20211012093359776](..\typora-user-images\image-20211012093359776.png)

- 设置全局共享的 css 属性

  ![image-20211012093525337](..\typora-user-images\image-20211012093525337.png)

  ![image-20211012093548118](..\typora-user-images\image-20211012093548118.png)

  ![image-20211012093615002](..\typora-user-images\image-20211012093615002.png)

## ant design

classnames 库的使用

![image-20211009160051151](..\typora-user-images\image-20211009160051151.png)

![image-20211009160424667](..\typora-user-images\image-20211009160424667.png)

```
npm install antd --save
npm install @ant-design/icons --save  //字体图标库

yarn add antd
```

按需引入使用：

```jsx
index.js 项目入口文件：

import 'antd/dist/antd.css'

```

其他组件中使用：

```
import { Button } from 'antd'
import { 字体图标组件名 } from '@ant-design/icons'


直接使用组件
```

![image-20211012201101176](..\typora-user-images\image-20211012201101176.png)

## 编辑 create-react-app 脚手架中 webpack 的默认配置

方式一：使用 npm run eject 将脚手架的 webpack 配置信息完全暴露后修改原 webpack 配置文件

![image-20211012201519816](..\typora-user-images\image-20211012201519816.png)

方式二：craco 库进行修改

npm install @craco/craco

项目根目录下创建文件：craco.config.js

![image-20211012201907911](..\typora-user-images\image-20211012201907911.png)

![image-20211012201925605](..\typora-user-images\image-20211012201925605.png)

### 配置路径别名

![image-20211012202649841](..\typora-user-images\image-20211012202649841.png)

## 前端网络请求

![image-20211012205650834](..\typora-user-images\image-20211012205650834.png)

![image-20211012205843525](..\typora-user-images\image-20211012205843525.png)

### axios

npm install axios

```js
async componentDidMount(){
    const result = await axios.get(url,{
        params:{
            key1:value1,
            key2:value2
        }
    })
    console.log(result)  //上面的情况中这样写是只能获取请求成功的信息的，而无法获取请求失败的信息，如果要处理请求失败或者错误的信息，需要捕获错误。

    try {
        const result = await axios.get(url,{
            params:{
                key1:value1,
                key2:value2
            }
        })
        console.log(result)
    }catch(error){
        console.log(error)
    }

}
```

axios 的配置信息

![image-20211012220244073](..\typora-user-images\image-20211012220244073.png)

service/config.js

```js
if(process.env.NODE_ENV === 'development'){
    const BASE_URL = 'http://xxxxxdev.com'
}else{
    const BASE_URL = 'http://xxxxxpro.com'
}

export BASE_URL

export const TIMEOUT = 5000
```

service/request.js:

```js
import axios from 'axios'
import { BASE_URL, TIMEOUT } from './config.js'

const instance = axios.create({
    baseURL:BASE_URL,
    timeout:TIMEOUT
})

instance.interceptors.request.use(config=>{
    ....
    return config
},error=>{
    .....
})

instance.interceptors.response.use(result=>{
    ....
    return result.data
},error=>{
    .....
})

export default instance
```

## React 动画

![image-20211012222116002](..\typora-user-images\image-20211012222116002.png)

![image-20211013192215445](..\typora-user-images\image-20211013192215445.png)

![image-20211013202153882](..\typora-user-images\image-20211013202153882.png)

![image-20211013202205028](..\typora-user-images\image-20211013202205028.png)

CSSTransition 组件在实现 CSS 动画时，会给最外层的元素添加入场类名，过渡过程中的类名和离场类名，而开发者通过编写这些类名对应的 css 代码实现动画效果。

![image-20211020221215630](..\typora-user-images\image-20211020221215630.png)

![image-20211020215835997](..\typora-user-images\image-20211020215835997.png)

入场类名：

- xxx-enter
- xxx-enter-active
- xxx-enter-done

离场类名：

- xxx-exit
- xxx-exit-active
- xxx-exit-done

首次加载页面时的动画类名(往往与入场类名的 css 属性一样)：

- xxx-appear
- xxx-appear-active
- xxx-appear-done

动画生命周期函数：

- onEnter = { el=>{ .... } }
- onEntering = { el=>{ .... } }
- onEntered = { el=>{ .... } }
- onExit = { el=>{ .... } }
- onExiting = { el=>{ .... } }
- onExited = { el=>{ .... } }

SwitchTransition 动画组件：

![image-20211020221748055](..\typora-user-images\image-20211020221748055.png)

![image-20211020222431883](..\typora-user-images\image-20211020222431883.png)

![image-20211020222311162](..\typora-user-images\image-20211020222311162.png)

![image-20211020222337592](..\typora-user-images\image-20211020222337592.png)

动画组件的中的 timeout 标签属性设置的时间是用来确定类名添加和移除的时间周期的，而 css 中 transition 属性设置的时间则是用于设置该动画耗时多少时间的。但是两者的时间最后一致。

TransitionGroup 动画组件：

![image-20211020223404722](..\typora-user-images\image-20211020223404722.png)

## Redux

纯函数：

- 相同输入必然的得到相同的输出
- 函数执行过程中不影响外界的任何数据

状态：服务器返回数据，缓存数据，用户操作产生数据，UI 状态等。

Redux 核心：

- store
- action
- reducer
- subscribe
- getState
- dispatch

真实应用中，我们会通过函数来定义，返回一个 action 对象。

### 独立使用 redux

```js
const redux = require('redux');

const initState = {
  counter: 0
};

function reducer(state = initState, action) {
  let newState = JSON.stringify(state);
  switch (action.type) {
    case 'ADD':
      newState.counter++;
      return newState;
    case 'SUB':
      newState.counter--;
      return newState;
    case 'ADD5':
      newState.counter += action.num;
      return newState;
    case 'SUB4':
      newState.counter -= action.num;
      return newState;
    default:
      return newState;
  }
}

const store = redux.createStore(reducer);

store.subscribe(() => {
  console.log(store.getState().counter);
});

const action1 = { type: 'ADD' };
const action2 = { type: 'SUB' };
const action3 = { type: 'ADD5' };
const action4 = { type: 'SUB4' };

store.dispatch(action1);
store.dispatch(action2);
store.dispatch(action3);
store.dispatch(action4);
```

### 项目中的 redux 使用

- store
  - index.js
  - reducer
    - index.js
    - ...
  - actions
    - index.js
    - ....
  - actions-type.js

![image-20211020230234805](..\typora-user-images\image-20211020230234805.png)

index.js:

```js
const redux from 'redux'

const reducer from './reducer/index.js'

const store = redux.createStore(reducer)

export default store
```

reducer/index.js:

```js
import actionType from '../action-type.js'

const initState ={
    counter:0
}
function reducer (state=initState,action){\
    let newState = JSON.stringify(state)
    switch (action.type){
        case actionType.ADD:
        	newState.counter+=action.num
        	return newState;
        case actionType.SUB:
        	newState.counter-=action.num
        	return newState
        default:
        	return newState
    }
}

export default reducer
```

actions/index.js:

```js
import actionType from '../action-type.js';

export const Add = (num) => ({
  type: actionType.ADD,
  num
});
export const Sub = (num) => ({
  type: actionType.SUB,
  num
});

//对应另一种方式导入
import { ADD, SUB } from '../action-type.js';

export const Add = (num) => ({
  type: ADD,
  num
});
export const Sub = (num) => ({
  type: SUB,
  num
});
```

actions-type.js:

```js
const ADD = 'ADD';
const SUB = 'SUB';
export default {
  ADD,
  SUB
};

//另一种方式导出
export const ADD = 'ADD';
export const SUB = 'SUB';
```

入口使用 redux 的 index.js 文件：

```js
import stroe = from './store/index.js'
import {
    Add,
    Sub
} from './stre/actions/index.js'

stroe.subscribe(()=>{
    console.log(store.getState().counter)
})

stroe.dispatch(Add)
stroe.dispatch(Sub)
stroe.dispatch(Add(10))
stroe.dispatch(Sub(6))
```

### Redux 结合 React

![image-20211016115602055](..\typora-user-images\image-20211016115602055.png)

actions-type.js:

```js
export const ADD = 'ADD';
export const SUB = 'SUB';
export const ADDNUM = 'ADDNUM';
export const SUBNUM = 'SUBNUM';
```

actionsCreators.js:

```js
import { ADD, SUB, ADDNUM, SUBNUM } from './actions-types';

export const add = function () {
  return {
    type: ADD
  };
};

export const sub = function () {
  return {
    type: SUB
  };
};

export const addnum = function (num) {
  return {
    type: ADDNUM,
    num
  };
};

export const subnum = function (num) {
  return {
    type: SUBNUM,
    num
  };
};
```

index.js:

```js
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

export default store;
```

reducer.js:

```js
/* eslint-disable no-unreachable */
import { ADD, SUB, ADDNUM, SUBNUM } from './actions-types';

const initalState = {
  counter: 0
};

const reducer = function reducer(state = initalState, action) {
  const newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case ADD:
      newState.counter = ++newState.counter;
      return newState;
    case SUB:
      newState.counter = --newState.counter;
      return newState;
    case ADDNUM:
      newState.counter = newState.counter + action.num;
      return newState;
    case SUBNUM:
      newState.counter = newState.counter - action.num;
      return newState;
    default:
      return newState;
  }
};

export default reducer;
```

Home.js:

```jsx
import React, { PureComponent } from 'react';
import store from '../store';
import { add, addnum } from '../store/actionsCreators';

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      counter: store.getState().counter
    };
  }

  componentDidMount() {
    this.unsubcribe = store.subscribe(() => {
      this.setState({
        counter: store.getState().counter
      });
    });
  }

  componentWillUnmount() {
    this.unsubcribe();
  }

  render() {
    return (
      <div>
        <h3>{this.state.counter}</h3>
        <button onClick={(e) => this.handleAdd()}>+1</button>
        <button onClick={(e) => this.handleAddNum()}>+n</button>
      </div>
    );
  }

  handleAdd() {
    store.dispatch(add());
  }

  handleAddNum() {
    store.dispatch(addnum(4));
  }
}
```

组件中使用 redux 中数据整体的流程还是比较繁琐的。同时在不同的组件中要使用 redux 中的状态数据时，都有一些列相似的步骤需要做，就造成了代码的冗余。如下图中的代码分别在两个不同的组件中都书写了：

![image-20211016123050237](..\typora-user-images\image-20211016123050237.png)

为了解决这个问题就需要对相同的逻辑进行抽离。而 react-redux 就是实现了公共逻辑的抽离。

## 仿写一个 react-redux

```jsx
import React, { PureComponent } from 'react';

import store from '../store/index.js'; //这里对项目进项了强依赖
//connect 将组件和redux连接，并提取公共代码段。但是每个组件需要使用的redux中的state是不同的，需要派发的时间也是不同。这时就需要从外界传入一些参数。
export function connect(mapStateToprops, mapDispatchProps) {
  return function enhanceHOC(WrappedComponent) {
    return class extends PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          storeState: mapStateToProps(store.getState())
        };
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          rhis.setState({
            storeState: mapDispatchProps(store.getState())
          });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToprops(store.getState())}
            {...mapDispatchProps(store.dispatch)}
          ></WrappedComponent>
        );
      }
    };
  };
}
```

调用：

```jsx
import connect from '../utils/connect.js';

function Com(props) {
  return <>......</>;
}

const mapStateToprops = (state) => {
  return {
    counter: state.counter
  };
};
const mapDispatchProps = (dispatch) => {
  return {
    fun1: function () {
      dispatch(actinFun1());
    },
    fun2: function (num) {
      dispatch(actinFun2(num));
    }
  };
};
//这里可以说是非常精妙的编程技巧。该组件内定义两个函数，传给connect，然后在connect函数内部又穿这两个函数另一个参数。

export default connect(mapStateToprops, mapDispatchProps)(Com);
```

context.js

```jsx
import React from 'react';

const StoreContext = React.createContext();

export { StoreContext };
```

```jsx
import React, { PureComponent } from 'react';

//通过context上下文的方式获取其他项目中的store，从而样该库能独立于任何具体的项目而被使用
import { StoreContext } from './context.js';

//connect 将组件和redux连接，并提取公共代码段。但是每个组件需要使用的redux中的state是不同的，需要派发的时间也是不同。这时就需要从外界传入一些参数。

export function connect(mapStateToprops, mapDispatchProps) {
  return function enhanceHOC(WrappedComponent) {
    class EnhanceComponent extends PureComponent {
      constructor(props, context) {
        super(props, context);
        this.state = {
          storeState: mapStateToProps(context.getState())
        };
      }

      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() => {
          rhis.setState({
            storeState: mapDispatchProps(store.getState())
          });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToprops(this.context.getState())}
            {...mapDispatchProps(this.context.dispatch)}
          ></WrappedComponent>
        );
      }
    }
    EnhanceComponent.contextType = StoreContext;
    return EnhanceComponent;
  };
}
```

使用 context 在项目的根组件上注册上下文对象

![image-20211016141646332](..\typora-user-images\image-20211016141646332.png)

## react-redux

npm intall react-redux -s

index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';

import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('root')
);
```

组件中使用：

```js
import connect from '../utils/connect.js';
import { connect } from 'react-redux';

function Com(props) {
  return <>......</>;
}

const mapStateToprops = (state) => {
  return {
    counter: state.counter
  };
};
const mapDispatchProps = (dispatch) => {
  return {
    fun1: function () {
      dispatch(actinFun1());
    },
    fun2: function (num) {
      dispatch(actinFun2(num));
    }
  };
};

export default connect(mapStateToprops, mapDispatchProps)(Com);
```

## 组件中的异步操作

方式一：

在 redux 中准备一切即将用于存储网络请求数据的 state，action，reducer。然后在某个组件的生命周期中使用 axios 发送网络请求，将请求回来的数据通过 dispatch 的方式发送给 reducer，再由 reducer 对 state 进行更新，从而实现异步数据存放入 redux 中。

缺陷：必须将网络请求放在组将的生命周期中并等待网络请求响应数据后再将数据通过 dispatch 派发给 redux 才行，如果在 redux 的 dispatch 中进行网络请求，则是取不到网络请求响应的数据后再进行 action 的派发的。

方式二：

![image-20211016151239337](..\typora-user-images\image-20211016151239337.png)

![image-20211016151504495](..\typora-user-images\image-20211016151504495.png)

![image-20211016151640163](..\typora-user-images\image-20211016151640163.png)

store/index.js:

```jsx
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';

const storeEnhancer = applyMiddleware(thunkMiddleware);

const store = createStore(reducer, storeEnhancer);

export default store;
```

redux 中间件 dispatch 一个 action 函数，该函数体中做一些业务逻辑或者异步处理，在这些任务完成后再拿着完成后的数据 dispatch 一个 action 对象给 reducer 进行之后任务的处理。

![image-20211021204222977](..\typora-user-images\image-20211021204222977.png)

![image-20211021204342466](..\typora-user-images\image-20211021204342466.png)

![image-20211021203905691](..\typora-user-images\image-20211021203905691.png)

![image-20211021204029168](..\typora-user-images\image-20211021204029168.png)

## Redux-Devtools

![image-20211021205105549](..\typora-user-images\image-20211021205105549.png)

## React-saga

预备知识——generator

generator 和 promise 配合使用：

```js
function* fun() {
  const result = yield new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });
  console.log(result);
}
let it = fun();
it.next().value.then((res) => {
  it.next(res);
});
```

redux-sage 可以对项目代码进行分离，在不同地方书写不同的代码。让项目的代码结构更加清晰。

yarn add saga

```js
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'; // createSagaMiddleware是一个函数
import thunkMiddleware from 'redux-thunk'; // thunkMiddleware直接就是一个中间件对象

import reducer from './reducer.js';
import saga from './saga.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true }) || compose;

const sagaMiddleware = createSagaMiddleware();

const storeEnhancer = applyMiddleware(thunkMiddleware, sagaMiddleware);

sagaMiddleware.run(saga); //传入生成器函数，内部调用该函数后获得迭代器对象后调用next进入生成器函数内部

const store = createStore(reducer, composeEnhancers(storeEnhancer));

export default store;
```

配置对那些 action 进行拦截

saga.js:

```js
//export defalut 生成器函数

import { takeEvery, put ,takeLatest,all } from 'redux-saga/effects'
//takeEvery 表示可以监听每一个action中的type值,它接受一个参数，这些参数表示就是需要被监听的action中type值
//takeLatest 表示对于多次dispatch同一个action中相同的type，只监听到最后一次
import {
    FETCH_HOME_MULTIDATA
} from './constants.js'

import {
    changeBannersAction
} from './actionCreators.js'

//function* mySaga(){
//    yield takeEvery(FETCH_HOME_MULTIDATA, 生成器函数)
//}

function* fetchHomeMultidata (action){
    const res = yield axios.get('xxxxxxxxx');    //内部判断yield语句后面的值是否是Promise实例对象，如果是的话，则调用该生成器执行的后返回的迭代器对象的next方法，并取出value值，因为value值是promise实例对象，则会调用该对象的then方法并获取promise执行的结果后传给下一次调用的next方法作为参数。
    const data = res.data.data
    yield put(changeBannersAction(data))
    yield put(changeRecommandAction(data))

    //yield all([
    //  yield put(changeBannersAction(data)),yield put(changeRecommandAction(data))
	//])
}


function* mySaga(){
    yield takeEvery(FETCH_HOME_MULTIDATA, fetchHomeMultidata)  //这里只监听了一个action中的type

    yield all([
        takeEvery(FETCH_HOME_MULTIDATA, fetchHomeMultidata)
        takeEvery(FETCH_HOME_PROFILE, fetchHomeMultidata)
    ])  //监听多个action中的type
}

export defalut mySaga
```

actionCreator.js:

```js
// redux-saga 拦截的action  对象类型
import { FETCH_HOME_MULTIDATA } from './constants.js';

export const fetchHomeMultidataAction = {
  type: FETCH_HOME_MULTIDATA
};
```

constants.js:

```js
export const FETCH_HOME_MULTIDATA = 'FETCH_HOME_MULTIDATA';
```

![image-20211023133501228](..\typora-user-images\image-20211023133501228.png)

## 理解中间件

![image-20211023133624540](..\typora-user-images\image-20211023133624540.png)

![image-20211023133639166](..\typora-user-images\image-20211023133639166.png)

![image-20211023141916360](..\typora-user-images\image-20211023141916360.png)

![image-20211023141928884](..\typora-user-images\image-20211023141928884.png)

## reducer 的拆分

```js
function reducer(state = {},actions){
    return {
        loginData:loginReducer(state.loginData,action),
        homeData:homeReducer(state.homeData,action)
    }
}


const loginInitData ={
    key1:value1,
    key2:value2
}

function loginReducer(state=loginInitData,action){
    switch(action.type){
        case xxx:
            return {...state,key1:action.value1}
            break;
        case yyy:
            return {...state,key2:action.value2}
            break;
        default:
            return state
    }
}


const homeInitData = {
    xxx:xxx,
    xxx:xxx
}

function homeReducer(state=homeInitData,action){
    switch(aciont.type){
            case xxxx:
            	return {...state,xxx:action.value}
            ...
    }
}

export default reducer
```

store/reducer.js

```js
import { combineReducers } from 'redux';

const reducer = combineReducers({
  loginData: loginReducer,
  homeData: homeReducer
});

export default reducer;
```

状态管理建议：

- UI 相关的状态可以在组件内部进行管理和维护
- 需要共享的状态则都交给 reduxw 维护管理
- 服务器请求数据也交给 redux 维护管理

## react-router

React Router 提供了多种不同环境下的路由库

- web

- native

hashURL：

![image-20211023193913831](..\typora-user-images\image-20211023193913831.png)

historyURL：

![image-20211023195940224](..\typora-user-images\image-20211023195940224.png)

```shell
npm i -S react-router-dom

yarn add react-router-dom
```

不需要再安装 react-router 了，因为 react-router-dom 内部依赖了 react-router。

react-router-dom 包中提供的组件：

- BrowserRouter （history API）
- HashRouter （Hash API）
- Route 设置路由地址和组件的对应关系，同时所位于的位置将作为匹配后组件的渲染位置，重点属性：
  - path
  - component
  - render
  - exact
- Link 声明式导航组件，默认渲染为 a 标签，重点属性：
  - to
- NavLink 类似于 Link 组件，只是补充了激活类名，重点属性：

  - activeClassName
  - activeStyle
  - to
  - exact

- withRouter 高阶组件,当一个组件不是由 Route 组件映射后渲染的组件，那该组件上的 props 对象中是没有和路由相关的属性（history，location，match）的，为了让那些是 BrowserRouter 或者 HashRouter 组件后代组件的非路由映射组件中能获取路由相关的对象属性，则可以使用该高阶组件进行包装，包装后的返回组件就有所需路由相关属性

- Switch 让路由匹配只匹配一个同级组件，主要是包裹 Route 组件集，在最新版本的 react-router-dom 中改为 Routes 组件

- Redirect 重定向组件，重要属性：

  - to

    ```jsx
    <Route
      path='/list/:hanbb'
      exact
      render={(props) => {
        return <Redirect to='/list/1'></Redirect>;
      }}
    />
    ```

```jsx
<BrowserRouter></BrowserRouter>
<HashRouter></HashRouter>


<Link to='xxxxx'>xxxx</Link>

<NavLink exact to='xxxxx' activeStyle={{color:'red'}}>xxxx</NavLink>
<NavLink to='xxxxx'>xxxx</NavLink>
<NavLink to='xxxxx' activeClassName='link-active'>xxxx</NavLink>


<Switch>
	<Route exact path='/xx' component={componentName}></Route>
    <Route  path='/xxxx/xx' component={componentName}></Route>
    <Route  path='/xxxx/yy' component={componentName}></Route>
    <Route  path='/:id' component={componentName}></Route>
</Switch>


<Redirect to='/login'></Redirect>   //  可以在函数或者类组件中使用


<Route exact path='xxxx' component={componentName}></Route>
```

NavLink：

![image-20211023213805052](..\typora-user-images\image-20211023213805052.png)

Switch:

![image-20211023213838717](..\typora-user-images\image-20211023213838717.png)

Redirect

路由重定向有多种方式

方式一：

```jsx
<Switch>
  <Route path='/' exact component={Home}></Route>
  <Route path='/find' component={Find}></Route>
  <Route path='/profile' component={isLogin ? Profile : Login}></Route>
</Switch>
```

方式二：

在组件内部的 render 函数的 return 语句中使用 Redirect 组件

```jsx
<Switch>
  <Route path='/' exact component={Home}></Route>
  <Route path='/find' component={Find}></Route>
  <Route path='/profile' component={Profile}></Route>
  <Route path='/login' component={Login}></Route>
</Switch>
```

在 Profile 组件内部：

```jsx
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }
  render() {
    return this.state.isLogin ? <div> Profile </div> : <Redirect to='/login'></Redirect>;
  }
}
```

## 路由嵌套

## 编程式导航

![image-20211024144421166](..\typora-user-images\image-20211024144421166.png)

## 路由传

路由传参的方式：

- 动态路由传参，简单数据传参

  ```jsx
  <NavLink to='/details/123456'></NavLink>
  
  <Route path='/details/:id'></Route>


  // 类组件中通过this.props.match.params.id 获取
  ```

- url 中的 query（?key=value&key=value）

  ```jsx
  <NavLink to='/details?key1=value1&key2=value2'></NavLink>

  <Route path='/details'></Route>

  // 在类组件的this.props.location.search获取query字符串传参
  ```

- to 属性为对象格式

  ```jsx
  <NavLink to={{
          pathname:'/details',
          search:'?key1=value1',
          state:{key:value,....}
      }}></NavLink>
  
  // 在类组件的this.props.location.state获取state对象传参
  ```

## 路由的集中管理

npm install -S react-router-config

router/index.js

```js
import Home from '@/pages/home'
import Login from '@/pages/login'
import Mime from '@/pages/mime'

const routes = [
    {
        path:'/',
        exact:true,
        component:Home   // 在该组件中使用react-router-config的renderRoutes(this.props.route.routes)
        routes:[
        	{
        		path:'/home',
        		exact:true,
        		component:HomeXxxx   // 这些组件也需要先引入
    		},
    		{
        		path:'/home/abc',
        		component:HomeYyyy
    		},
    		{
        		path:'/home/cba',
        		component:HomeZzzz
    		},
        ]
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/mime',
        component:Mime
    }
]

export default routes

```

```jsx
import { renderRoutes } from 'react-router-config';
import routes from '@/router';

renderRoutes(routes); //在组件的jsx部分使用该行命令
```

![image-20220301211551907](..\typora-user-images\image-20220301211551907.png)

通过该第三方包选择子代路由是，可以通过 renderRoutes(this.props.route.routes)

## Router Hooks

useHistory 获取 history 对象

useLocation 获取 locations 对象

useParams 获取 params 对象

useRouteMatch 获取 Match 对象

```
import {withRouter,useHistory,useLocation,useParams} from 'react-router-dom';
```

## react hooks

Hook 是 react16.8 以后的版本新增的内容。开发者在不编写 class 组件的情况下使用 state 以及其他类似于 class 组件中的生命周期函数等。

class 组件的优势：

![image-20211016192429981](..\typora-user-images\image-20211016192429981.png)

class 组件的不足：

- 组件可能随着业务量的增加而使得组件变得复杂
- 类组件中 this 指向可能多样
- 组件的状态难以复用，以前为了状态的复用往往是借助高阶组件

hooks 只能在函数组件中使用，不能在非函数组件中使用。

使用 hooks 的原则：

- **不能在函数组件中的循环，条件判断或者子函数中使用 hooks**
- **不能在函数组件中定义的其他函数中使用 hooks，即只在函数组件对应的作用域中使用 hooks**

### useState

useState 返回的修改 state 的方法是替换操作。 对于函数组件中的 useState 定义的 state，当直接通过 state 去修改状态时，并不会触发函数组件自身的重新渲染，但是该 state 已经变化了。

useState 接受一个值或者一个函数作为参数。

useState 返回的数组的第二个参数是一个函数，该函数可以接受一个值或者一个函数（该函数默认接受一个前一次的 state 作为参数）。

useState 返回的数组的第二个参数是一个函数，在同一个事件循环中多次调用时，也是存在合并为一个的情况，如果要避免这种情况，也就可以传入函数作为参数。

![image-20220413213818065](..\typora-user-images\image-20220413213818065.png)

![image-20220413212829090](..\typora-user-images\image-20220413212829090.png)

![image-20220413213207542](..\typora-user-images\image-20220413213207542.png)

![image-20220413213245715](..\typora-user-images\image-20220413213245715.png)

一个函数组件中可以使用多个 useState

### useEffect

该函数接受两个参数，第二个参数是可选的，第一个参数是回调函数。

![image-20220413221954501](..\typora-user-images\image-20220413221954501.png)

![image-20220413222013013](..\typora-user-images\image-20220413222013013.png)

一个函数组件中可以使用多个 useEffect

```jsx
 useEffect(()=>{
     // 组件挂载和重新渲染时都会执行该回调函数
 })


 useEffect(()=>{
     // 组件挂载和重新渲染时都会执行该回调函数
     return ()=>{
         //  组件挂载时不会执行 当组件卸载时会执行该返回值函数，当组件重新渲染时会执行该返回值函数
     }
 })



 useEffect(()=>{
     // 组件挂载会执行该回调函数  ，组件重新渲染时不会执行
     return ()=>{
         // 组件挂载时不会执行,同时组件重新渲染时也不会执行，只会在组件卸载阶段才会执行
     }
 },[])




 useEffect(()=>{
     // 组件挂载后 不会 执行该回调函数  ，组件重新渲染时 不会 执行，
     // 只有对应的第二个参数中的依赖项改变时才会触发给回调函数
 },[key1,....])
```

一个函数组件中可以使用多个 useEffect。可以每个 useEffect 中独立处理响应的逻辑。一般执行的顺序时按代码书写的顺序执行。

### useContext

![image-20220413231648085](..\typora-user-images\image-20220413231648085.png)

useContext()接受一个 Context 对象作为参数，返回的值就是对应的 context 对象提供的数据。

1. 创建 context 对象

![image-20220413224741463](..\typora-user-images\image-20220413224741463.png)

2. 定义共享数据

   ![image-20220413224917928](..\typora-user-images\image-20220413224917928.png)

3. 使用

   ![image-20220413224818346](..\typora-user-images\image-20220413224818346.png)

![image-20220413225010332](..\typora-user-images\image-20220413225010332.png)

### useReducer

![image-20220413224547624](..\typora-user-images\image-20220413224547624.png)

![image-20220413233345207](..\typora-user-images\image-20220413233345207.png)

![image-20220413232101149](..\typora-user-images\image-20220413232101149.png)

### useCallback

进行性能优化。

- useCallback 返回一个函数的 memorized 记忆值
- 在依赖不变的情况下，多次定义的时候，返回的值是相同的

在函数组件中定义的函数在组件重新渲染时，该函数组件的函数体都会重新执行依次，对于函数组件中定义的其他函数，则会在重新渲染的时候重新定义。

![image-20220413234432537](..\typora-user-images\image-20220413234432537.png)

![image-20220413235032134](..\typora-user-images\image-20220413235032134.png)

![image-20220413235227462](..\typora-user-images\image-20220413235227462.png)

上图的代码实际上没有达到性能优化的目的，因为 useCallback 函数传参部分的函数也会每次重新渲染组件时进行重新定义。

useCallback 进行性能优化的例子：

```jsx
import React, { useState, useCallback, memo } from 'react';

/**
 * useCallback在什么时候使用?
 * 场景: 在将一个组件中的函数, 传递给子元素进行回调使用时, 使用useCallback对函数进行处理.
 */

const HYButton = memo((props) => {
  console.log('HYButton重新渲染: ' + props.title);
  return <button onClick={props.increment}>HYButton +1</button>;
});

export default function CallbackHookDemo02() {
  console.log('CallbackHookDemo02重新渲染');

  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  const increment1 = () => {
    console.log('执行increment1函数');
    setCount(count + 1);
  };

  const increment2 = useCallback(() => {
    console.log('执行increment2函数');
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <h2>CallbackHookDemo01: {count}</h2>
      {/* <button onClick={increment1}>+1</button>
      <button onClick={increment2}>+1</button> */}
      <HYButton title='btn1' increment={increment1} />
      <HYButton title='btn2' increment={increment2} />

      <button onClick={(e) => setShow(!show)}>show切换</button>
    </div>
  );
}
```

### useMemo

![image-20220414000830179](..\typora-user-images\image-20220414000830179.png)

对上面代码的优化：

```jsx
import React, { useState, useMemo } from 'react';

function calcNumber(count) {
  console.log('calcNumber重新计算');
  let total = 0;
  for (let i = 1; i <= count; i++) {
    total += i;
  }
  return total;
}

export default function MemoHookDemo01() {
  const [count, setCount] = useState(10);
  const [show, setShow] = useState(true);

  // const total = calcNumber(count);
  const total = useMemo(() => {
    return calcNumber(count);
  }, [count]);

  return (
    <div>
      <h2>计算数字的和: {total}</h2>
      <button onClick={(e) => setCount(count + 1)}>+1</button>
      <button onClick={(e) => setShow(!show)}>show切换</button>
    </div>
  );
}
```

### useRef

该 hook 返回一个 ref 对象，该对象在组件的整个生命周期中保持不变。

最常用法：

- 引用 DOM 元素或者类组件，因为函数组件没有实例，函数组件则是进行 ref 穿透

  ```jsx
  import React, { useEffect, useRef } from 'react';

  class TestCpn extends React.Component {
    render() {
      return <h2>TestCpn</h2>;
    }
  }

  function TestCpn2(props) {
    return <h2>TestCpn2</h2>;
  }

  export default function RefHookDemo01() {
    const titleRef = useRef();
    const inputRef = useRef();
    const testRef = useRef();
    const testRef2 = useRef();

    function changeDOM() {
      titleRef.current.innerHTML = 'Hello World';
      inputRef.current.focus();
      console.log(testRef.current);
      console.log(testRef2.current);
    }

    return (
      <div>
        <h2 ref={titleRef}>RefHookDemo01</h2>
        <input ref={inputRef} type='text' />
        <TestCpn ref={testRef} />
        <TestCpn2 ref={testRef2} />

        <button onClick={(e) => changeDOM()}>修改DOM</button>
      </div>
    );
  }
  ```

- 保存一个数据， 这个数据在组件的整个生命周期中都保存不变，包括组件重新渲染时，访问该数据，该数据也不变，除非手动改变该 ref 内部存放的值

  ```JSX
  import React, { useRef, useState, useEffect } from 'react'
  
  export default function RefHookDemo02() {
    const [count, setCount] = useState(0);
  
    const numRef = useRef(count);
  
    useEffect(() => {
      numRef.current = count;
    }, [count])
  
    return (
      <div>
        {/* <h2>numRef中的值: {numRef.current}</h2>
        <h2>count中的值: {count}</h2> */}
        <h2>count上一次的值: {numRef.current}</h2>
        <h2>count这一次的值: {count}</h2>
        <button onClick={e => setCount(count + 10)}>+10</button>
      </div>
    )
  }
  ```

### useImperativeHandle

该 hook 接受三个参数，主要传入两个。第一个参数传一个 ref，第二个参数是回调函数，函数返回一个对象。

```jsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

const HYInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current.focus();
      }
    }),
    [inputRef]
  );

  return <input ref={inputRef} type='text' />;
});

export default function UseImperativeHandleHookDemo() {
  const inputRef = useRef();

  return (
    <div>
      <HYInput ref={inputRef} />
      <button onClick={(e) => inputRef.current.focus()}>聚焦</button>
    </div>
  );
}
```

### useLayoutEffect

![image-20220414210209997](..\typora-user-images\image-20220414210209997.png)

```jsx
import React, { useState, useEffect } from 'react';

export default function EffectCounterDemo() {
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (count === 0) {
      setCount(Math.random() + 200);
    }
  }, [count]);

  return (
    <div>
      <h2>数字: {count}</h2>
      <button onClick={(e) => setCount(0)}>修改数字</button>
    </div>
  );
}
```

```jsx
import React, { useState, useEffect, useLayoutEffect } from 'react';

export default function LayoutEffectCounterDemo() {
  const [count, setCount] = useState(10);

  useLayoutEffect(() => {
    if (count === 0) {
      setCount(Math.random() + 200);
    }
  }, [count]);

  return (
    <div>
      <h2>数字: {count}</h2>
      <button onClick={(e) => setCount(0)}>修改数字</button>
    </div>
  );
}
```

### 自定义 hook

本质是一种代码逻辑的抽取，并不是 React 本身的特性。

自定义 hook 就是一个函数，但是该函数的名字必须是 use 开头才可行。

```jsx
import React, { useEffect } from 'react';

const Home = (props) => {
  useLoggingLife('Home'); // 使用
  return <h2>Home</h2>;
};

const Profile = (props) => {
  useLoggingLife('Profile'); //使用
  return <h2>Profile</h2>;
};

export default function CustomLifeHookDemo01() {
  useLoggingLife('CustomLifeHookDemo01'); // 使用
  return (
    <div>
      <h2>CustomLifeHookDemo01</h2>
      <Home />
      <Profile />
    </div>
  );
}

// 自定义的hook
function useLoggingLife(name) {
  useEffect(() => {
    console.log(`${name}组件被创建出来了`);

    return () => {
      console.log(`${name}组件被销毁掉了`);
    };
  }, []);
}
```

自定义 hook 与 context 共享

user-hook.jsx:

```jsx
import { useContext } from 'react';
import { UserContext, TokenContext } from '../App';

function useUserContext() {
  const user = useContext(UserContext);
  const token = useContext(TokenContext);

  return [user, token];
}

export default useUserContext;
```

```jsx
import React, { useContext } from 'react';
import useUserContext from '../hooks/user-hook';

export default function CustomContextShareHook() {
  const [user, token] = useUserContext();
  console.log(user, token);

  return (
    <div>
      <h2>CustomContextShareHook</h2>
    </div>
  );
}
```

## forwardRef

```jsx
import React, { useRef, forwardRef } from 'react';

const HYInput = forwardRef((props, ref) => {
  return <input ref={ref} type='text' />;
});

export default function ForwardRefDemo() {
  const inputRef = useRef();

  return (
    <div>
      <HYInput ref={inputRef} />
      <button onClick={(e) => inputRef.current.focus()}>聚焦</button>
    </div>
  );
}
```

## 项目

### 项目规范

- **文件夹**和**文件名**统一使用小写，单词之间以连接符（-）连接
- js 变量名采用小驼峰标识，常量全部使用大写字母，组件名采用大驼峰标识
- css 采用**普通的 css（全局）和 styled-component（局部）**结合编写
- 整个项目不再采用类组件，统一使用函数组件和 hooks
- 所有函数组件为了避免不必要的渲染，全部使用高阶组件 memo 包裹
- **组件内部状态**采用 useState,useReducer,**业务数据**全部放在 redux 中管理
- 函数式组件内部代码安排顺序：
  - state 部分
  - redux 中的 hooks 部分
  - 其他组件的 hooks 部分
  - 其他代码逻辑
  - render 部分
- redux 模块
  - 每个模块都有自己的独立的 reducer，并通过 combineReducer 进行合并
  - 异步请求代码使用 redux-thunk 并写在 actionCreators 中
  - redux 直接采用 redux hooks 编写，不使用 connect
- 网络请求 axios
  - 对 axios 进行二次封装
  - 所有模块请求会放在一个请求文件中单独管理
- 使用 ant design

扩展：

对于使用 react 技术栈开发的产品，一般安装了 react 官方的 chrome 插件的浏览器在访问该产品时，往往该插件会高亮显示。为了避免暴露过多的网站技术栈情况，可用通过项目的代码判断在生产环境下让插件的图标不高亮显示。

![image-20211024192938752](..\typora-user-images\image-20211024192938752.png)

### 项目结构

![image-20211025191706284](..\typora-user-images\image-20211025191706284.png)

### css 样式重置

normalize.css 或者 reset.css

方式一：找到对应文件下载后引入到项目即可

方式二：npm install normalize.css

![image-20211025192013862](..\typora-user-images\image-20211025192013862.png)

![image-20211025192037068](..\typora-user-images\image-20211025192037068.png)

同时定义了一些自己的全局样式，之后在需要使用的元素上直接使用即可。

App.js

```js
// 第三方导入
import React, { memo } from 'react';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';
// 工具类包导入，actionCreators，utils，网络请求
import routes from './router';

// 组件导入
import WAppHeader from 'components/app-header';
import WAppFooter from 'components/app-footer';

export default memo(function App() {
  return (
    <HashRouter>
      <WAppHeader></WAppHeader>
      {renderRoutes(routes)}
      <WAppFooter></WAppFooter>
    </HashRouter>
  );
});
```

### 配置项目的路径别名

yarn add @craco/craco

package.json 文件中的 script 字段中：

```json
{
    "scripts":{
        "start":"craco start",
        "build":"craco build",
        "test":'craco test'
        .....
    }
}
```

craco.config.js:

```js
const path = require('path');

const resolve = (dir) => {
  return path.resolve(__dirname, dir);
};

module.exports = {
  webpack: {
    alias: {
      '@': resolve('src'),
      components: resolve('src/components')
    }
  }
};
```

### 自行考虑环境划分

### 路由系统搭建

yarn add react-router-dom

yarn add react-router-config

router/index.js:

```js
import React from 'react'; // 第三方包

// ... 这里导入工具类包，网络请求，actionCreators

import WMine from '@/pages/mine'; // 导入第三方组件
import WFriends from '@/pages/friends';
import WDiscover from '@/pages/discover';
import { Redirect } from 'react-router-dom';

const routes = [
  {
    path: '/',
    exact: true,
    render: () => {
      return <Redirect to='/discover' />;
    }
  },
  {
    path: '/discover',
    component: WDiscover
  },
  {
    path: '/mine',
    component: WMine
  },
  {
    path: '/friends',
    component: WFriends
  }
];

export default routes;
```

src/App.js:

```js
// 第三方导入
import React, { memo } from 'react';
+ import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';
// 工具类包导入，actionCreators，utils，网络请求
import routes from './router';

// 组件导入
import WAppHeader from 'components/app-header';
import WAppFooter from 'components/app-footer';

export default memo(function App() {
  return (
    <HashRouter>
      <WAppHeader></WAppHeader>
+     {renderRoutes(routes)}
      <WAppFooter></WAppFooter>
    </HashRouter>
  );
});
```

**组件页面的 css**

app-header/index.js

```jsx
import React, { memo } from 'react';

import { NavLink } from 'react-router-dom';
import { HeaderWrapper } from './style';

export default memo(function AppHeader(props) {
  return (
    <HeaderWrapper>
      <div className='content'></div>
      <div className='divider'></div>
    </HeaderWrapper>
  );
});
```

app-header/style.js (使用 styled-components)

```js
import styled from 'styled-components';

export const HeaderWarpper = styled.div`
  height: 75px;
  background-color: #242424;
  .content {
    height: 70px;
  }
  .divider {
    height: 5px;
    background-color: #c20c0c;
  }
`;
```

编写一个组件，如果单独给该组件写 styledComponent 样式时，会先给该组件最外层写一个 styled-component 组件进行包裹。

## Mobx

**是什么**

使用 mobx 管理应用程序中的数据状态。一个简单的，可扩展的 js 状态管理库。

一般会和 React 结合使用，但也可以和其他框架进行结合使用。

**mobx 不同版本对浏览器的支持情况**

![image-20220417174820185](..\typora-user-images\image-20220417174820185.png)

**核心思想**

任何源于应用的状态的东西都应该自动地获得。

数据修改流程：

![image-20220417175011934](..\typora-user-images\image-20220417175011934.png)
