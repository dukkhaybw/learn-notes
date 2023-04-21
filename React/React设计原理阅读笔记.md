# React设计原理阅读笔记

- 设计理念

- 实现原理
- 架构设计
- 代码实现
- 基于React18源码
- 主流前端框架的实现原理理解



初始化应用的API（ReactDOM.createRoot）涉及完整的**React首屏渲染流程**。



理念部分：讲解React在主流前端框架中的定位和设计理念

架构部分，讲解React架构中的3个阶段（render，coomit，schedule），架构中理念的实践

实现部分，根据3个阶段，讲解具体的API实现细节

React的仓库源码是采用monorepo方式管理，项目中的不同模块与其他项目中的模块合作共同实现React，且每个模块分工明确。



## 第一章

前端主流框架的原理

问题：

1. React是库（library）还是框架（framework）？

   > 不管是React还是Vue，它们的核心都是 “**库**”，用于构建UI的库，核心是基于状态的声明式渲染和组件化的层次架构。
   >
   > 但是随着前端应用的复杂度提升，状态管理的难度也提升了，为此需要引入额外的**状态管理**方案，Redux，Pinia和Vuex等。
   >
   > 当采用SPA构建应用时，又需要增加**客户端路由**方案，React-Router，Vue-Router等。
   >
   > 为了提高客户端首屏页面渲染速度，优化SEO，需要使用SSR。
   >
   > 还有一些其他功能，比如构建支持，数据流方案，文档工具等，这个功能在React和Vue的核心库中都没有。
   >
   > 所以React和Vue本身仅仅时库，而不是框架。
   >
   > 框架——**包含库本身以及附加功能**的一套解决方案。典型的框架代表有：
   >
   > 1. UmiJS：基于React，内置路由，构建和部署等功能的**前端框架**
   > 2. Next.js：基于React，支持SSR，SSG的**服务端框架**
   > 3. AngularJS：内置多种功能的**前端框架**

   

2. Vue称自己是“构建用户界面的渐进式框架”，其中的“渐进式”怎么理解？

   > 渐进式是指：“可以根据需求选择性的引入所需要的附加功能”。



现代前端框架的实现原理：UI=f (state).

- state：当前视图状态
- f：框架内部运行机制
- UI：宿主环境的视图

框架内部运行机制根据当前视图状态渲染视图。根据这个公式，分析现代主流前端框架的技术特点和实现原理，然后定义一个前端框架分类标准。



### 描述UI

当前主流描述UI的方案：

1. JSX
2. 模板语言



**JSX**

jsx时一种“类XML语法”的ES语法糖，可以看作是JS的一个扩展，所以它充分具备JS的能力。

```jsx
const element = <h1>Hello World!</h1> 
```

上面这段JSX经过babel编译工具编译后的结果：

```js
// React 17以前
var element = React.createElement('h1',null,'Hello World!')

// React 17以后
var _jsxRuntime = require("react/jsx-runtime")
var = element = _jsxRuntime.jsx('h1',{children:'Hello World!'})
```

在React.createElement或者_jsxRuntime.jsx函数执行后，得到如下结构的虚拟DOM。

```js
{
  type:'h1',
  key:null,
  ref:null,
  props:{
    chidlren:'Hello World!'
  },
  __owner:null,
  __store:{}
}
```

对于React，公式UI=f (state)，中的f就会以上面这种数据结构的虚拟DOM作为UI的渲染依据。

React认为：“UI本质上是和逻辑存在耦合的”。例如：

1. 在UI上绑定事件
2. 状态变化后需要改变UI的样式或者结构

对于前端开发者来说，逻辑部分使用JS编写的，如果UI也能用JS来描述的话，那就能达到UI和逻辑耦合的目的。基于此，React团队最后选择JSX这种“类XML语法”作为JS的一种扩展，是因为前端工程师更熟悉HTML。

因为JSX是JS的语法糖（扩展），所以可以在编译器工具的支持下，在JS语法中灵活使用JSX，但是在JSX中使用JS则不及前者灵活。

- 可以在if语句，循环语句中使用jsx
- 可以将jsx作为值赋值给变量
- 可以把JSX当作参数传递和函数结果返回

```jsx
function App({isLoading}){
  if(isLoading){
    return <h1>loding</h1>
  }
  return <h3>welcome</h3>
}
```

所以JSX可以灵活的描述UI，同时在UI中灵活的编写逻辑。但是高度灵活也意味着JSX需要牺牲潜在的编译时优化空间。





**模板语法**

模板语法做开始起源于后端和前后端未分离的时代。例如PHP代码中可以嵌套HTML，当客户端请求该页面时，服务器执行PHP代码，填充数据后将HTML返回给客户端。

```php
<h1>
  <?php echo "My name is {$name}"; ?>
</h1>
```

类似的模板语法还有：

1. 基于Java的JSP
2. 基于PHP二次封装的smarty
3. 基于ES的EJS

模板语法在页面结构复杂时，逻辑代码（PHP代码等）会和HTML糅合在一起，不利于开发和维护。这些模板语法本质上都是在原有的HTML语法的基础上，添加了自定义的语法或者扩展HTML（比如Java中的Thymeleaf）元素属性实现各种逻辑。



JSX和模板语法都能描述UI和逻辑，但是从上面就能看出，他们的出发点是不同的。模板语法是扩展HTML，以实现对逻辑部分的补充。而React则是扩展JS，让JS能够描述逻辑的同时也能描述UI。



### 组织UI和逻辑

为了尽量降低UI和逻辑的耦合程度，同时让他们尽可能靠在一起，就涉及了组件。

问题：

1. 组件如何组织逻辑和UI

   1. 逻辑中的自变量变化，导致UI变化
   2. 逻辑中的自变量变化，导致”无副作用因变量“变化，导致UI变化
   3. 逻辑中的自变量变化，导致”有副作用因变量“变化，导致副作用

2. 如何在组件之间实现通信

   组件的自变量或者因变量通过UI传递给另一个组件，作为另一个组件的自变量。为了区分不同方式产生的自变量，在前端框架中，将组件内部定义的自变量称为state（状态），而来自其他组件的自变量称为props（属性）asd

   啊啊是





### 前端主流框架分类

前端框架中“因为自变量变化而建立的，与自变量的相对应关系的抽象层级（范围）”不同：

1. React属于**应用级框架**
2. Vue属于**组件级框架**
3. Svelte与Solid.js属于**元素级框架**

对于公式：UI=f(state),state的本质是自变，自变量通过直接或者间接（因变量）的方式改变UI。”被改变的UI”仅仅是对实际宿主环境真实UI的一种描述。 只有经过不同宿主环境中库的处理，才会生成对应宿主环境中真实的UI。

所以，UI=f(state)中f的工作原理可再分为两步：

1. 根据自变量（state）变化计算出UI的变化；
2. 根据UI的变化执行具体宿主环境的API，产出真正的UI

比如浏览器环境中，UI的改变就是通过DOM API实现，比如，element。appendChild，insertBefor，removeChild等，不同的前端框架这一步都基本一致。

**各种前端框架的不同在于如何根据自变量（state）变化计算出UI的变化**这一步上。



从state变化到具体元素层面的对应关系看，找到UI变化的路径最多。

从state变化到具体组件层面的对应关系看，找到UI变化的路径较少，但是确定了某个state会影响那些组件后，还需要进一步确定是这些组件中的哪些部分的UI发生了变化，所以UI中发生变化的具体内容则还需要进一步对比。

从state变化到具体应用层面的对应关系看，找到UI变化的路径最少，但是再运行时需要进行更多的额外的工作来确定具体是那部分UI发生变化。先去顶发生UI变化的组件，再确定组件中具体的UI变化的部分。

总结：前端框架需要关注“自变量与X（X可能是应用，组件，具体DOM元素）的对应关系”，随着X的抽象层级不断下降 ，“自变量到UI的变化”的路径不断增多。路径越多，意味着，前端框架再运行时消耗在寻找“自变量与UI的对应关系”上的时间就越少。



react每次更新的流程都是从应用的根节点开始，遍历整个应用，而对比其他框架，Vue3的更新流程开始于组建。Svelte的更新流程开始于元素。因为React不需要确定哪个变量发生了变化，任何变量的变化都会开启一次遍历应用的更新流程，因此 React 不需要 "细粒度更新"。



### 前端框架使用技术



1. **细粒度更新**

例子：

```js
const y = useMemo(()=>x * 2 + 1, [x])  // React

const y = computed(()=>x.value * 2 + 1)  // Vue

const y = computed(()=>x.data * 2 + 1)  // Mobx
```

在React中定义一个因变量需要显示的指明“因变量依赖的自变量”。而Vue和Mobx中不需要显式指明。

在Vue和Mobx中这种“自动追踪依赖的技术”就是**细粒度更新**。许多自动依赖收集的库的底层原理都是细粒度更新。

代码的逐层实现：

useState

```js
function useState(value){
  const getter = ()=>value;
  const setter = (newVale)=> value = newValue;
  return [getter, setter];
}


// 使用方式
const [count,setCount] = useState(1)

console.log(count())  // 1
setCount(2)
console.log(count())  // 2
```



useEffect

实现的效果：

1. useEffect执行后，回调函数立即执行
2. 以来的自变量变化后，回调函数立即执行
3. 不需要显式的指明依赖



使用案例：

```js
const [count,setCount] = useState(0)

useEffect(()=>{
  console.log('count is:',count())
})

useEffect(()=>{
  console.log('test show')
})

setCount(2 )
```

































































