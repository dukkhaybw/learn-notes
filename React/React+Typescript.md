# TS开发React项目

从零搭建开发环境

继承eslint，单元测试，React，React-Router，Redux，中间件，dva



npm init -y

npm install typescript webpack webpack-cli webpack-dev-server ts-loader cross-env webpack-merge clean-webpack-plugin html-webpack-plugin  -D

tsc --init



类型声明

React中的类型如何定义。



## config目录

webpack.base.js:

```js
const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:'./src.index.tsx',
    output:{
        filename:'main.js',
        path:path.resolve(__dirname,'../dist')
    },
    resolve:{
        extensions:['.ts','.tsx','.js']
    },
    devServer:{
        contentBase:'../dist'
    },
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:[
                    {
                        loader:'ts-loader'
                    }
                ],
                exclude:/node_modules/
            }
        ]
    }
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['./dist']
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        })
    ]
}
```

webpack.dev.js:

```js
const {smart}  = require('webpack-merge')
const base = require('./webpack.base')

module.exports = smart(base,{
    mode:'development',
    devtool:'inline-source-map'
})
```

webpack.prod.js:

```js
const {smart}  = require('webpack-merge')
const base = require('./webpack.base')

module.exports = smart(base,{
    mode:'production',
    devtool:'false'
})
```



## package.json

```ssjson
"script":{
    "dev":"cross-env NODE_ENV=development webpack --config ./config/webpack.dev.js",
    "build":"cross-env NODE_ENV=production webpack --config ./config/webpack.prod.js",
    "eslint":"eslint src --ext .js,.ts,.tsx,.jsx --fix"，
    "test":"jest"
}
```





## Eslint

 代码检查工具要先将代码转为抽象语法树，然后转义再进行检查， 而parser就是将语法转为抽象语法树。

.eslintrc.json:

````json
{
    "parser":"@typescript-eslint/parser",
    "plugins":[
        "@typescript-eslint/eslint-plugin"
    ],
    "extends":[   //继承其他的配置文件
         "plugin:@typescript-eslint/recommoended"
    ]，
    "rules":{}
}
````





## JEST

单元测试

npm install  jest @type/jest  ts-jest -D 

npx ts-jest config:init







## React

React中的类型如何定义。

npm install react  react-dom   @types/react  @types/react-dom



src/index.tsx:

```tsx
import React from 'react';
import type { ReactElement, DOMElement, DetailedReactHTMLElement }  from 'react'
import ReactDOM from 'react-dom';

let root: HTMLElement | null = document.getElementById('root');

interface Props {
    className: string
}

let props: Props = { className: 'title' };

let element: DetailedReactHTMLElement<Props, HTMLHeadingElement> = React.createElement<Props, HTMLHeadingElement>('h1', props, 'hello');
ReactDOM.render(element, root);
```



![elements](http://img.zhufengpeixun.cn/elementss.png)





## TypeScript与React的类型定义

组件声明时TS类型的定义。

例子：

```tsx
interface IProps {  // 接口
  name: string;
}

interface IState {  // 接口
  count: number;
}

class App extends React.Component<IProps, IState> {
  state = {
    count: 0
  };

  render() {
    return (
      <div>
        {this.state.count}
        {this.props.name}
      </div>
    );
  }
}

export default App;
```



```tsx
React.PureComponent<P, S={} SS={}> 
// React.PureComponent是有第三个参数的，它表示getSnapshotBeforeUpdate的返回值。
```





定义时组件接受的props的类型，只有在调用时才知道组件类型，借助泛型

```tsx
// 定义组件
// 这种情况下由于不知道泛型P数据格式，所以在组件中是没有代码提示的。
class MyComponent<P> extends React.Component<P> {
  internalProp: P;
  constructor(props: P) {
    super(props);
    this.internalProp = props;
  }
  render() {
    return (
    	 <span>hello world</span>
    );
  }
}

// 使用组件
type IProps = { name: string; age: number; };

<MyComponent<IProps> name="React" age={18} />;          // Success
<MyComponent<IProps> name="TypeScript" age="hello" />;  // Error
```



函数组件：

```tsx
interface IProps {
  name: string
}

// 这种方式是隐式推到的
const App = (props: IProps) => {
  const {name} = props;

  return (
    <div className="App">
      <h1>hello world</h1>
      <h2>{name}</h2>
    </div>
  );
}

export default App;
```

函数类型还可以使用`React.FunctionComponent<P={}>`来定义，也可以使用其简写`React.FC<P={}>`。它提供一个泛型，接收一个参数，参数表示props的类型，这个参数不是必须的。

```tsx
type React.FC<P = {}> = React.FunctionComponent<P>


    
    
    
// 当使用这种形式来定义函数组件时，props中默认会带有children属性，它表示该组件在调用时，其内部的元素    
interface IProps {
  name: string
}

// 这是显示定义函数组件的类型
const App: React.FC<IProps> = (props) => {
  const {name} = props;
  return (
    <div className="App">
      <h1>hello world</h1>
      <h2>{name}</h2>
    </div>
  );
}

export default App;
```



```tsx
import Child1 from "./child1";
import Child2 from "./child2";

interface IProps {
  name: string;
}
const App: React.FC<IProps> = (props) => {
  const { name } = props;
  return (
    <Child1 name={name}>
      <Child2 name={name} />
      TypeScript
    </Child1>
  );
};

export default App;



//Child1：
interface IProps {
  name: string;
}
const Child1: React.FC<IProps> = (props) => {
  const { name, children } = props;
  console.log(children);
  return (
    <div className="App">
      <h1>hello child1</h1>
      <h2>{name}</h2>
    </div>
  );
};

export default Child1;

```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e833cb140aa41c7a0c38f4216ff5902~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)





使用 React.FC 声明函数组件和普通声明的区别如下：

- React.FC 显式地定义了返回类型，其他方式是隐式推导的；
- React.FC 对静态属性：displayName、propTypes、defaultProps 提供了类型检查和自动补全；
- React.FC 为 children 提供了隐式的类型（ReactElement | null）



在定义组件时不知道props的类型，只有调用时才知道，那就还是用泛型来定义props的类型。

```tsx
// 定义组件
function MyComponent<P>(props: P) {
  return (
  	<span>
    	{props}
    </span>
  );
}

// 使用组件
type IProps = { name: string; age: number; };

<MyComponent<IProps> name="React" age={18} />;          // Success
<MyComponent<IProps> name="TypeScript" age="hello" />;  // Error
```



```tsx
const MyComponent = <P extends any>(props: P) =>{
  return (
  	<span>
    	{props}
    </span>
  );
}
          
export default MyComponent
```



### React内置类型



#### 1. JSX.Element

JSX.Element类型的声明：

```ts
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}
```

JSX.Element是ReactElement的子类型，它没有增加属性，两者是等价的。也就是说两种类型的变量可以相互赋值。

JSX.Element 可以通过执行 React.createElement 或是转译 JSX 获得：

```tsx
const jsx = <div>hello</div>
const ele = React.createElement("div", null, "hello");
```



#### 2. React.ReactElement

React 的类型声明文件中提供了 React.ReactElement＜T＞，它可以让我们通过传入＜T/＞来注解类组件的实例化，它在声明文件中的定义如下：

```ts
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
   type: T;
   props: P;
   key: Key | null;
}
```

ReactElement是一个接口，包含type,props,key三个属性值。该类型的变量值只能是两种： null 和 ReactElement实例。

通常情况下，函数组件返回ReactElement（JXS.Element）的值。



#### 3. React.ReactNode

ReactNode类型的声明如下：

```ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

可以看到，ReactNode是一个联合类型，它可以是string、number、ReactElement、null、boolean、ReactNodeArray。由此可知。ReactElement类型的变量可以直接赋值给ReactNode类型的变量，但反过来是不行的。



类组件的 render 成员函数会返回 ReactNode 类型的值：

```ts
class MyComponent extends React.Component {
	render() {
    	return <div>hello world</div>
    }
}
// 正确
const component: React.ReactNode<MyComponent> = <MyComponent />;
// 错误
const component: React.ReactNode<MyComponent> = <OtherComponent />;
```

上面的代码中，给component变量设置了类型是Mycomponent类型的react实例，这时只能给其赋值其为MyComponent的实例组件。

通常情况下，类组件通过 render() 返回 ReactNode的值。



#### 4. CSSProperties

React的声明文件中对CSSProperties 的定义：

```ts
export interface CSSProperties extends CSS.Properties<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
}
```

React.CSSProperties是React基于TypeScript定义的CSS属性类型，可以将一个方法的返回值设置为该类型：

```ts
import * as React from "react";

const classNames = require("./sidebar.css");

interface Props {
  isVisible: boolean;
}

const divStyle = (props: Props): React.CSSProperties => ({
  width: props.isVisible ? "23rem" : "0rem"
});

export const SidebarComponent: React.StatelessComponent<Props> = props => (
  <div id="mySidenav" className={classNames.sidenav} style={divStyle(props)}>
    {props.children} 
  </div>
);


const divStyle: React.CSSProperties = {
    width: "11rem",
    height: "7rem",
    backgroundColor: `rgb(${props.color.red},${props.color.green}, ${props.color.blue})`
};

<div style={divStyle} />
```

### React Hooks

#### useState

默认情况下，React会为根据设置的state的初始值来自动推导state以及更新函数的类型：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aec80bdbd1a64ad3b2da185657869bdf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

如果已知state 的类型，可以通过以下形式来自定义state的类型：

```ts
const [count, setCount] = useState<number>(1)
```

如果初始值为null，需要显式地声明 state 的类型：

```ts
const [count, setCount] = useState<number | null>(null); 
```

如果state是一个对象，想要初始化一个空对象，可以使用断言来处理：

```ts
const [user, setUser] = React.useState<IUser>({} as IUser);
```

实际上，这里将空对象{}断言为IUser接口就是欺骗了TypeScript的编译器，由于后面的代码可能会依赖这个对象，所以应该在使用前及时初始化 user 的值，否则就会报错。

```ts
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
// convenience overload when first argument is omitted
	/**
	 * Returns a stateful value, and a function to update it.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usestate
   */
    
function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  /**
   * An alternative to `useState`.
   *
   * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
   * multiple sub-values. It also lets you optimize performance for components that trigger deep
   * updates because you can pass `dispatch` down instead of callbacks.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usereducer
   */

```



#### useEffect

```jsx
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source]
);

```

当函数的返回值不是函数或者effect函数中未定义的内容时，如下：

```ts
useEffect(
    () => {
      subscribe();
      return null; 
    }
);
```

TypeScript就会报错：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/439c3eeb15a54a47aea7ccaa6d687e21~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



```ts
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

// NOTE: callbacks are _only_ allowed to return either void, or a destructor.
type EffectCallback = () => (void | Destructor);

// TODO (TypeScript 3.0): ReadonlyArray<unknown>
type DependencyList = ReadonlyArray<any>;

function useEffect(effect: EffectCallback, deps?: DependencyList): void;
// NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
  /**
   * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
   * `ref`. As always, imperative code using refs should be avoided in most cases.
   *
   * `useImperativeHandle` should be used with `React.forwardRef`.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
   */

```



#### useRef

当我们使用useRef时，需要给其指定类型：

```ts
const nameInput = React.useRef<HTMLInputElement>(null)
```

这里给实例的类型指定为了input输入框类型。

当useRef的初始值为null时，有两种创建的形式，第一种：

````ts
const nameInput = React.useRef<HTMLInputElement>(null)
nameInput.current.innerText = "hello world";
````

这种形式下，ref1.current是只读的（read-only），所以当我们将它的innerText属性重新赋值时会报以下错误：

```ts
Cannot assign to 'current' because it is a read-only property.
```

那该怎么将current属性变为动态可变得的，先来看看类型声明文件中 useRef 是如何定义的：

```ts
 function useRef<T>(initialValue: T): MutableRefObject<T>;
 // convenience overload for refs given as a ref prop as they typically start with a null value
 /**
   * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
   * (`initialValue`). The returned object will persist for the full lifetime of the component.
   *
   * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
   * value around similar to how you’d use instance fields in classes.
   *
   * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
   * of the generic argument.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#useref
   */
```

这段代码的第十行的告诉我们，如果需要useRef的直接可变，就需要在泛型参数中包含'| null'，所以这就是当初始值为null的第二种定义形式：

```ts
const nameInput = React.useRef<HTMLInputElement | null>(null);
```

这种形式下，nameInput.current就是可写的。不过两种类型在使用时都需要做类型检查：

```ts
nameInput.current?.innerText = "hello world";
```

那么问题来了，为什么第一种写法在没有操作current时没有报错呢？因为useRef在类型定义式具有多个重载声明，第一种方式就是执行的以下函数重载：

```ts
function useRef<T>(initialValue: T|null): RefObject<T>;
// convenience overload for potentially undefined initialValue / call with 0 arguments
// has a default to stop it from defaulting to {} instead
/**
  * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
  * (`initialValue`). The returned object will persist for the full lifetime of the component.
  *
  * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
  * value around similar to how you’d use instance fields in classes.
  *
  * @version 16.8.0
  * @see https://reactjs.org/docs/hooks-reference.html#useref
  */

```

从上useRef的声明中可以看到，function useRef的返回值类型化是MutableRefObject，这里面的T就是参数的类型T，所以最终nameInput 的类型就是React.MutableRefObject。 

注意，上面用到了HTMLInputElement类型，这是一个标签类型，这个操作就是用来访问DOM元素的。

### 事件处理

#### Event 事件类型

Event是一个对象，并且有很多属性，这时很多人就会把 event 类型定义为any，这样的话TypeScript就失去了它的意义，并不会对event事件进行静态检查，如果一个键盘事件触发了下面的方法，也不会报错：

```ts
const handleEvent = (e: any) => {
    console.log(e.clientX, e.clientY)
}
```

由于Event事件对象中有很多的属性，所以我们也不方便把所有属性及其类型定义在一个interface中，所以React在声明文件中给我们提供了Event事件对象的类型声明。

常见的Event 事件对象如下：

- **剪切板事件对象**：ClipboardEvent<T = Element>
- **拖拽事件对象**：DragEvent<T = Element>
- **焦点事件对象**：FocusEvent<T = Element>
- **表单事件对象**：FormEvent<T = Element>
- **Change事件对象**：ChangeEvent<T = Element>
- **键盘事件对象**：KeyboardEvent<T = Element>
- **鼠标事件对象**：MouseEvent<T = Element, E = NativeMouseEvent>
- **触摸事件对象**：TouchEvent<T = Element>
- **滚轮事件对象**：WheelEvent<T = Element>
- **动画事件对象**：AnimationEvent<T = Element>
- **过渡事件对象**：TransitionEvent<T = Element>

这些Event事件对象的泛型中都会接收一个Element元素的类型，这个类型就是我们绑定这个事件的标签元素的类型



```ts
type State = {
  text: string;
};

const App: React.FC = () => {  
  const [text, setText] = useState<string>("")

  const onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setText(e.currentTarget.value);
  };
  
  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
    </div>
  );
}

```

这里就给onChange方法的事件对象定义为了FormEvent类型，并且作用的对象时一个HTMLInputElement类型的标签（input标签）

可以来看下MouseEvent事件对象和ChangeEvent事件对象的类型声明，其他事件对象的声明形似也类似：

````ts
interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
  altKey: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  /**
    * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
    */
  getModifierState(key: string): boolean;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  pageX: number;
  pageY: number;
  relatedTarget: EventTarget | null;
  screenX: number;
  screenY: number;
  shiftKey: boolean;
}

interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}
````

在很多事件对象的声明文件中都可以看到 EventTarget 的身影。这是因为，DOM的事件操作（监听和触发），都定义在EventTarget接口上。EventTarget 的类型声明如下：

```ts

interface EventTarget {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    dispatchEvent(evt: Event): boolean;
    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}
```

比如在change事件中，会使用的e.target来获取当前的值，它的的类型就是EventTarget。来看下面的例子：

```ts
<input
	onChange={e => onSourceChange(e)}
	placeholder="最多30个字"
/>

const onSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 30) {
      message.error('请长度不能超过30个字，请重新输入');
      return;
    }
    setSourceInput(e.target.value);
};
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be7d97e6011a4e61bc1d18c141a4c4bd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)







## 项目从零搭建



Facebook 官方开源的脚手架 [create-react-app](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fcreate-react-app) 。

- webpack 构建 react + typescript 项目开发与生产环境及优化
- 配合使用 rollup 打包组件并发布至 npm 全流程
- 项目中常用配置文件的作用及配置方式
- eslint、stylelint 及 prettier 的配置
- 代码提交规范的第三方工具强制约束方式实现
- 利用 react-testing-library 对 react 组件进行测试
- 持续集成（CI）、Github Actions



vscode 自带的终端，打开默认的终端快捷键为 `ctrl + 反引号` ，当前目录默认就为项目目录。



```shell  
yarn create react-app wehealth --template=typescript


npx create-react-app wehealth --template=typescript


npm install react-router-dom @types/reat-router-dom  -S
```



#### 1. package.json

- 记录项目的配置信息，项目名称、包的入口文件、项目版本等
- 记录所需的各种依赖
- `script` 字段，指定运行脚本命令的 `npm` 命令行缩写

npm init -y

参考：

```
{
  "name": "react-ts-quick-starter",
  "version": "1.0.0",
  "description": "Quickly create react + typescript project development environment and scaffold for developing npm package components",
  "main": "index.js",
  "scripts": {},
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vortesnail/react-ts-quick-starter.git"
  },
  "keywords": ["react-project", "typescript-project", "react-typescript", "react-ts-quick-starter"],
  "author": {
    "name": "vortesnail",
    "url": "https://github.com/vortesnail",
    "email": "1091331061@qq.com"
  },
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/vortesnail/react-ts-quick-starter/issues"
  },
  "homepage": "https://github.com/vortesnail/react-ts-quick-starter#readme"
}
```

`description` ：增加了对该项目的描述，github 进行 repo 搜索时，关键字匹配会使你的项目更容易被搜索到。

`keywords` ：增加了项目关键字，其他开发者在 npm 上搜索的时候，适合的关键字能你的包更容易被搜索到。

`author` ：添加了更具体的作者信息。

`license` ：修改为[MIT](https://link.juejin.cn?target=https%3A%2F%2Fopensource.org%2Flicenses%2FMIT)协议。






#### .gitignore

该文件决定了项目进行 git 提交时所需要忽略掉的文件或文件夹，编辑器如 vscode 也会监听 `.gitignore` 之外的所有文件，如果没有进行忽略的文件有所变动时，在进行 git 提交时就会被识别为需要提交的文件。

不需要上传至 git 仓库的都要添加进来，比如我们常见的 `build` 、 `dist` 等，还有操作系统默认生成的，比如 MacOs 会生成存储项目文件夹显示属性的 `DS_Store` 文件。

这些系统或编辑器自动生成的文件，但是又不被我们很容易查知的该怎么办呢？使用 vscode 的 [gitignore](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dcodezombiech.gitignore) 插件，下载安装该插件之后， `ctrl+shift+p` 召唤命令面板，输入 `Add gitignore` 命令，即可在输入框输入系统或编辑器名字，来自动添加需要忽略的文件或文件夹至 `.gitignore` 中。

添加了以下：  `Node` 、 `Windows` 、 `MacOS` 、 `SublimeText` 、 `Vim` 、 `Vscode` ，酌情添加吧。如果默认中没有的，可自行手动输入至 `.gitignore` 中，比如我自己加了 `dist/` 和 `build/` ，用于忽略之后webpack 打包生成的文件。



#### .npmrc

```shell
npm config set registry https://registry.npm.taobao.org
```

其他开发者克隆了项目之后，准备在本地开发的时候，并没有设置淘宝镜像源，又要去手动设置一遍，作为项目的发起者，就先给别人省下这份时间吧，只需要在根目录添加一个 `.npmrc` 并做简单的配置即可：

```
# 创建 .npmrc 文件
touch .npmrc  // mac下命令
# 在该文件内输入配置
registry=https://registry.npm.taobao.org/
```



#### README.md



#### 规范代码与提交

通过第三方工具来强制约束。

##### 1. EditorConfig

`.editorconfig` 是**跨编辑器**维护一致编码风格的配置文件，有的编辑器会默认集成读取该配置文件的功能，但是 vscode 需要安装相应的扩展 [EditorConfig For vs Code](https://link.juejin.cn/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3DEditorConfig.EditorConfig) 。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/864a2298b334401da91ba7e901a9e283~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

安装完此扩展后，在 vscode 中使用快捷键 `ctrl+shift+p` 打开命令台，输入 `Generate .editorcofig` 即可快速生成 `.editorconfig` 文件，当然，有时候 vscode 抽风找不到命令也是可能的，比如我就经常遇到输入该命令没用，需要重启才会重新出现，那么就手动创建该文件也是没问题的。

参考配置：

```
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf

[*.md]
trim_trailing_whitespace = false
```

扩展装完，配置配完，编辑器就会去首先读取这个配置文件，对缩进风格、缩进大小在换行时直接按照配置的来，在你 `ctrl+s` 保存时（默认没有使用其他格式化插件的条件下），就会按照里面的规则进行代码格式化。以下是上述配置的简单介绍：

- `indent_style` ：缩进风格，可选配置有 `tab` 和 `space` 。
- `indent_size` ：缩进大小，可设定为 `1-8` 的数字，比如设定为 `2` ，那就是缩进 `2` 个空格。
- `charset` ：编码格式，通常都是选 `utf-8` 。
- `trim_trailing_whitespace` ：去除多余的空格，比如你不小心在尾巴多打了个空格，它会给你自动去掉。
- `insert_final_newline` ：在尾部插入一行，个人很喜欢这个风格，当最后一行代码很长的时候，你又想对该行代码比较靠后的位置编辑时，不要太好用哦，建议大家也开上。
- `end_of_line` ：换行符，可选配置有  `lf` ，`cr` ，`crlf` ，会有三种的原因是因为各个操作系统之间的换行符不一致，这里有历史原因，有兴趣的同学自行了解吧，许多有名的开源库都是使用 `lf` ，我们姑且也跟跟风吧。



##### 2. Prettier

`EditorConfig` 统一编辑器风格， `Prettier` 统一项目风格的。 `Prettier` 拥有更多配置项（实际上也不多，数了下二十个），且能在发布流程中执行命令自动格式化，能够有效的使项目代码风格趋于统一。

npm install prettier -D

安装成功之后在根目录新建文件 `.prettierrc` ，输入以下配置：

````
{
  "trailingComma": "false",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "endOfLine": "lf",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
````

`Prettier` 的配置项可以去 [Prettier Playground](https://link.juejin.cn/?target=https%3A%2F%2Fprettier.io%2Fplayground%2F) 。



- `trailingComma` ：对象的最后一个属性末尾也会添加 `,` ，比如 `{ a: 1, b: 2 }` 会格式为 `{ a: 1, b: 2, }` 。
- `tabWidth` ：缩进大小。
- `semi` ：分号是否添加。
- `singleQuote` ：是否单引号。
- `jsxSingleQuote` ：jsx 语法下是否单引号。
- `endOfLine` ：与 `.editorconfig` 保持一致设置。
- `printWidth` ：单行代码最长字符长度，超过之后会自动格式化换行。
- `bracketSpacing` ：在对象中的括号之间打印空格， `{a: 5}` 格式化为 `{ a: 5 }` 。
- `arrowParens` ：箭头函数的参数无论有几个，都要括号包裹。比如 `(a) => {}` ，如果设为 `avoid` ，会自动格式化为 `a=>{}`。

**使用**

先安装扩展 [Prettier - Code formatter](https://link.juejin.cn/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Desbenp.prettier-vscode) ：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6410957ae01f44daa37bc9b3024932dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



- 一个是我们可以通过命令的形式去格式化某个文件下的代码，但是我们基本不会去使用，最终都是通过 `ESlint` 去检测代码是否符合规范。

- 二是当我们编辑完代码之后，按下 `ctrl+s` 保存就给我们自动把当前文件代码格式化了，既能实时查看格式化后的代码风格，又省去了命令执行代码格式化的多余工作。

  

当安装结束后， 在项目根目录新建一个文件夹 `.vscode` ，在此文件下再建一个 `settings.json` 文件：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f35d7fef8e3c41d1b784597dc34dcbcc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

该文件的配置优先于 vscode 全局的 `settings.json` ，这样别人下载了你的项目进行开发，也不会因为全局 `setting.json` 的配置不同而导致 `Prettier` 或之后会说到的 `ESLint` 、 `StyleLint` 失效，接下来在该文件内输入以下代码：

```json
{ 
  // 指定哪些文件不参与搜索
  "search.exclude": {
    "**/node_modules": true,
    "dist": true,
    "yarn.lock": true
  },
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

`"editor.formatOnSave"` 的作用是在我们保存时，会自动执行一次代码格式化，而我们该使用什么格式化器？接下来的代码便是设置默认的格式化器。

在遇到 `.js` 、 `.jsx` 、`.ts` 、`.tsx` 、`.json` 、`.html` 、`.md` 、 `.css` 、 `.less` 、 `.scss` 为后缀的文件时，都会去使用 `Prettier` 去格式化代码，而格式化的规则就是我们配置的 `.prettierrc` 决定。



`.editorconfig` 配置文件中某些配置项是会和 `Prettier` 重合的，例如 指定缩进大小 两者都可以配置。

那么两者有什么区别呢？

我们可以看到 `EditorConfig` 的配置项都是一些不涉及具体语法的，比如 缩进大小、文移除多余空格等。

而 `Prettier` 是一个格式化工具，要根据具体语法格式化，对于不同的语法用单引号还是双引号，加不加分号，哪里换行等，当然，肯定也有缩进大小。

即使缩进大小这些共同都有的设置，两者也是不冲突的，设置 `EditorConfig` 的 `indent_size` 为 `4` ， `Prettier` 的 `tabWidth` 为 `2` 。

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/708e0d5d4fcb43479c283836e458931c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可以看到，在我们新起一行时，根据 `.editorconfig` 中的配置，缩进大小为 `4` ，所以光标直接跳到了此处，但是保存时，因为我们默认的格式化工具已经在 `.vscode/settings.json` 中设置为了 `Prettier` ，所以这时候读取缩进大小为 `2` 的配置，并正确格式化了代码。

建议两个都配置文件重合的地方都保持一致。



##### 3. ESLint

在上面我们配置了 `EditorConfig` 和 `Prettier` 都是为了解决**代码风格问题**，而 `ESLint` 是主要为了解决**代码质量问题**，它能在我们编写代码时就检测出程序可能出现的隐性BUG，通过 `eslint --fix` 还能自动修复一些代码写法问题，比如你定义了 `var a = 3` ，自动修复后为 `const a = 3` 。还有许多类似的强制扭转代码最佳写法的规则，在无法自动修复时，会给出红线提示，强迫开发人员为其寻求更好的解决方案。



 npm install eslint -D

npx eslint --init

上述命令的功能为初始化 `ESLint` 的配置文件，采取的是问答的形式。

- How would you like to use ESLint?

  果断选择第三条 `To check syntax, find problems, and enforce code style` ，检查语法、检测问题并强制代码风格。

- What type of modules does your project use?

  项目非配置代码都是采用的 ES6 模块系统导入导出，选择 `JavaScript modules (import/export)` 。

- Which framework does your project use?`React` 。

- Does your project use TypeScript?

  选择 `Yes` 后生成的 `eslint` 配置文件会给我们默认配上支持 `Typescript` 的 `parse` 以及插件 `plugins` 等。

- Where does your code run?

`Browser` 和 `Node` 环境都选上，之后可能会编写一些 `node` 代码。

- How would you like to define a style for your project?

  选择 `Use a popular style guide` ，即使用社区已经制定好的代码风格，我们去遵守就行。

- Which style guide do you want to follow?

  选择 `Airbnb` 风格，都是社区总结出来的最佳实践。

- What format do you want your config file to be in?

  选择 `JavaScript` ，即生成的配置文件是 js 文件，配置更加灵活。

- Would you like to install them now with npm? Yes

安装结束后，项目根目录下多出了新的文件 `.eslintrc.js` ，这便是我们的 `eslint` 配置文件了。其默认内容如下：

```js
module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
}
```

各个属性字段的作用可在 [Configuring ESLint](https://link.juejin.cn/?target=https%3A%2F%2Feslint.bootcss.com%2Fdocs%2Fuser-guide%2Fconfiguring) 仔细了解。

`plugins` 就是**插件**的意思，都是需要 npm 包的安装才可以使用，只不过默认支持简写，官网都有说；至于 `extneds` 其实就是使用我们已经下载的插件的某些预设规则。

对该配置文件作以下修改：

根据 [eslint-config-airbnb](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Feslint-config-airbnb) 官方说明，如果要开启 React Hooks 的检查，需要在 extends 中添加一项 `'airbnb/hooks'` 。

根据 [@typescript-eslint/eslint-plugin](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40typescript-eslint%2Feslint-plugin) 官方说明，在 extends 中添加 `'plugin:@typescript-eslint/recommended'` 可开启针对 ts 语法推荐的规则定义。

- 需要添加一条很重要的 `rule` ，不然在 `.ts` 和 `.tsx` 文件中引入另一个文件模块会报错，比如：

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5eb20dd9985746d1a914ee152d626cf8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

添加以下规则到 `rules` 即可：

```javascript
rules: {
  'import/extensions': [
    ERROR,
    'ignorePackages',
    {
      ts: 'never',
      tsx: 'never',
      json: 'never',
      js: 'never',
    },
  ],
}
```

在后面我们安装 `typescript` 之后，会出现以下的怪异错误：

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d89fd182f34a48c798ac9b1c7366baee~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

设置eslint寻找文件的扩展名规则（在.eslintrc.js文件中）

```
 settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
      typescript: {},
    },
  },
```

接下来安装 2 个社区中比较火的 `eslint` 插件：

- `eslint-plugin-promise` ：让你把 Promise 语法写成最佳实践。
- `eslint-plugin-unicorn` ：提供了更多有用的配置项，比如我会用来规范关于文件命名的方式。

npm install eslint-plugin-promise eslint-plugin-unicorn -D

在添加了部分规则 `rules` 后，我的配置文件修改之后如下：

```javascript
const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
    },
  },
  plugins: ['react', 'unicorn', 'promise', '@typescript-eslint'],
  rules: {
    // 具体添加的其他规则大家可查看我的 github 查看
    // https://github.com/vortesnail/react-ts-quick-starter/blob/master/.eslintrc.js
  },
}
```

在之后的配置过程中，我们可能还会需要对该文件进行更改，比如添加解决 eslint 和 prettier 的规则冲突处理插件。

大家新建一个 `hello.ts` 文件，在里面打上以下代码：

```typescript
var add = (a, b) => {
  console.log(a + b)
  return a + b
}

export default add
复制代码
```

你会发现没有任何的错误提示，很明显上面的代码违反了不能使用 `var` 定义变量的规则，理论上来说一定会报一堆红线的

这时候按下图看我们的 `ESLint` 输出：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b76234f94cd4a7ea4316d0ffa4d165b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)









