# React设计原理阅读笔记

- 设计理念

- 实现原理
- 架构设计
- 代码实现
- 基于React18源码
- 理解现在不同主流前端框架的实现原理理解



初始化应用的API（ReactDOM.createRoot）涉及完整的**React首屏渲染流程**。



理念部分：讲解React在主流前端框架中的定位和设计理念

架构部分，讲解React架构中的3个阶段（render，coomit，schedule），架构中理念的实践

实现部分，根据3个阶段，讲解具体的API实现细节

React的仓库源码是采用monorepo方式管理，项目中的不同模块与其他项目中的模块合作共同实现React，且每个模块分工明确。



## 第一章

前端主流框架的原理

问题：

1. React是库（library）还是框架（framework）？

   > 不管是React还是Vue，它们的核心部分都只是 “**库**”，用于构建UI的库，核心是：
   >
   > 1. 基于状态的声明式渲染
   > 2. 组件化的层次架构
   >
   >    
   >
   > - 但随着前端应用的复杂度提升，状态管理的难度也提升了，为此需要引入额外的**状态管理**方案，Redux，Pinia和Vuex等。
   >
   > - 当采用SPA构建应用时，又需要增加**客户端路由**方案，React-Router，Vue-Router等。
   >
   > - 为了提高客户端首屏页面渲染速度，优化SEO，需要使用SSR。
   >
   > - 还有一些其他功能，比如构建支持，数据流方案，文档工具等，这些功能在React和Vue的核心库中都没有。
   >
   > 所以React和Vue本身仅仅是库，而不是框架。
   >
   > 框架——**包含库本身以及附加功能**的一套解决方案。典型的框架代表有：
   >
   > 1. UmiJS：基于React，内置路由，构建和部署等功能的**前端框架**
   > 2. Next.js：基于React，支持SSR，SSG的**服务端框架**
   > 3. AngularJS：内置多种功能的**前端框架**

   

2. Vue称自己是“构建用户界面的渐进式框架”，其中的“渐进式”怎么理解？

   > 渐进式是指：“可以根据需求选择性的引入所需要的附加功能”。而不是像angularJS一样开箱即用。



现代前端框架的实现原理：UI=f (state).

- state：当前视图状态
- f：框架内部运行机制
- UI：宿主环境的视图

框架内部运行机制根据当前视图状态渲染视图。根据这个公式，分析现代主流前端框架的技术特点和实现原理，然后定义一个**前端框架分类标准**。



### 描述UI的方案

当前主流描述UI的方案：

1. JSX：基于js逻辑，扩展js，使得js能够描述UI（html，css）
2. 模板语言：基于UI（html），扩展UI使其能够增加对JS逻辑的描述



**JSX**

jsx是一种“类XML语法”的ES语法糖（本质就是JS），可以看作是JS的一个扩展，所以它充分具备JS的能力，同时增加了可读性。

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

在react的运行时包中，React.createElement或者_jsxRuntime.jsx函数执行后，得到如下结构的虚拟DOM。

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

**为什么React团队采用了扩展JS来描述UI，并设计了JSX？**

React团队认为：“UI本质上是和逻辑存在耦合的”。例如：

1. 在UI上绑定事件
2. 状态变化后需要改变UI的样式或者结构

对于前端开发者来说，逻辑部分使用JS编写的，如果UI也能用JS来描述的话，那就能达到UI和逻辑配合紧密的目的。基于此，React团队最后选择JSX这种“类XML语法”作为JS的一种扩展，因为前端工程师更熟悉HTML。

**因为JSX是JS的语法糖（扩展），所以可以在编译器工具的支持下，在JS语法中灵活使用JSX，但是在JSX中使用JS则不及前者灵活。**

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

模板语法最开始起源于后端和前后端未分离的时代。例如PHP代码中可以嵌套HTML，当客户端请求该页面时，服务器执行PHP代码，填充数据后将HTML返回给客户端。

```php
<h1>
  <?php echo "My name is {$name}"; ?>
</h1>
```

类似的模板语言还有：

1. 基于Java的JSP
2. 基于PHP二次封装的smarty
3. 基于ES的EJS

模板语法在页面结构复杂时，逻辑代码（PHP代码等）会和HTML糅合在一起，不利于开发和维护。这些模板语法本质上都是在原有的HTML语法的基础上，添加了自定义的语法或者扩展HTML（比如Java中的Thymeleaf）元素属性实现各种逻辑。

```jsp
<h1 th:text="'my name is' + ${name}">name</h1>
```

模板语法的好处是：UI和逻辑都是合法的HTML语法，可以直接在浏览器中正常显示，即使没有成功替换为正确的数据。



JSX和模板语法都能描述UI和逻辑，但是从上面就能看出，他们的出发点是不同的。模板语法是扩展HTML，以实现对逻辑部分的补充。而React则是扩展JS，让JS能够描述逻辑的同时也能描述UI。



### 组织UI和逻辑

为了UI和逻辑的关注点分离，同时让他们尽可能靠在一起，就涉及了组件。

问题：

1. 组件如何组织逻辑和UI

   1. 逻辑中的自变量变化，导致UI变化
   2. 逻辑中的自变量变化，导致”无副作用因变量“变化，导致UI变化
   3. 逻辑中的自变量变化，导致”有副作用因变量“变化，导致副作用

2. 如何在组件之间实现通信

   组件的自变量或者因变量通过UI传递给另一个组件，作为另一个组件的自变量。为了区分不同方式产生的自变量，在前端框架中，将组件内部定义的自变量称为state（状态），而来自其他组件的自变量称为props（属性）。






这个问题可以回答面试中的关于React和Vue的差异的面试题。

### 前端主流框架分类

对于公式：UI=f(state),state的本质是自变，自变量通过直接或者间接（因变量）的方式改变UI。**"被改变的UI”仅仅是对实际宿主环境真实UI的一种描述。 只有经过不同宿主环境中(渲染库)库的处理，才会生成对应宿主环境中真实的UI。**

所以，UI=f(state)中f的工作原理可再分为两步：

1. 根据自变量（state）变化计算出UI的变化；     react
2. 根据UI的变化执行具体宿主环境的API，产出真正的UI；      react-dom/client

比如浏览器环境中，UI的改变就是通过DOM API实现，比如，element。appendChild，insertBefor，removeChild等，不同的前端框架这一步都基本一致。所以这步不能作为区分前端框架的依据。



**各种前端框架的不同在于如何根据自变量（state）变化计算出UI的变化**这一步上。

有如下的组件：

```jsx
function A(props){
    const [a, setA] = useState(1)
    const b =useMemo(()=>a*2,[a])
    
    return <h1>
        {a}
        <B b={b}/>
    </h1>
}



function B({b}){
    const [c, setC] = useState(3)
    
    return <h2>
        <C/>
        <span>{ c + b }</span>
    </h2>
}

// 这里假设a是由A组件传递下来的，传递代码省略
function C({a}){
    return <h3>
        {a}
        <p>{a.toFixed(2)}</p>
    </h3>
}
```

在A组件中的a加一后。有三种不同的角度去观察数据和界面的对应关系。

1. 从数据和单个真实DOM的角度去看，能找出一下对应关系：

   - a变化导致A组件的h1元素中的文本DOM变化
   - a变化导致b变化，进而导致B组件的span元素中的文本DOM变化
   - a变化导致C组件的h3元素的文本DOM变化
   - a变化导致C组件的p元素的文本DOM变化
   - c变化导致B组件的span元素的文本DOM变化

   如果某个框架在数据发生变化之间，就知道各个数据对应的具体DOM元素变化部分有哪些的化，那么数据一旦改变就可以根据对应的关系直接执行相应的DOM更新操作方法更新UI即可，高效且快速。

   

2. 从数据和组件的角度去看，能找出一下对应关系：

   - a变化导致A组件的UI变化
   - a变化导致b变化，进而导致B组件的UI变化
   - a变化导致C组件的UI变化
   - c变化导致B组件的UI变化

   这时，数据变化后，只能确定是哪些组件的UI发什么了变化，但是具体会影响到的是UI的哪部分DOM，则还需要进行额外的比对工作。

   

3. 从数据和应用的角度去看，能找出一下对应关系：

   - a变化导致应用中的UI发生变化
   - c变化导致应用中的UI发生变化

   这时，数据发什么变化后，就还需要做额外的工作来确定哪些组件发生了变化，同时还要确定具体会影响到的是UI的哪部分DOM，则还需要进行额外的比对工作。（运行时的代码任务最重）



从state变化到**具体DOM元素层面**的对应关系看，找到UI变化的路径最多。



从state变化到**具体组件层面**的对应关系看，找到UI变化的路径较少，但是确定了某个state会影响那些组件后，还需要进一步确定是这些组件中的哪些部分的UI发生了变化，所以UI中发生变化的具体内容则还需要进一步对比。



从state变化到**具体应用层面**的对应关系看，找到UI变化的路径最少，但是在运行时需要进行更多的额外的工作来确定具体是那部分UI发生变化。**先确定发生UI变化的组件，再确定组件中具体的真实DOM变化的部分**。



总结：前端框架需要关注“自变量与X（X可能是应用，组件，具体DOM元素）的对应关系”，随着X的抽象层级不断下降 ，“自变量到UI的变化”的路径不断增多。路径越多，意味着，前端框架再运行时消耗在寻找“自变量与UI的对应关系”上的时间就越少。



react每次更新的流程都是从应用的根节点开始，遍历整个应用，而对比其他框架，Vue3的更新流程开始于组件。Svelte的更新流程开始于元素。因为React不需要确定哪个变量发生了变化，任何变量的变化都会开启一次遍历应用的更新流程，因此 React 不需要 "细粒度更新"。

前端框架中以“因为自变量变化而建立的，与自变量的相对应关系的抽象层级（范围）”不同进行分类：

1. React属于**应用级框架**
2. Vue属于**组件级框架**
3. Svelte与Solid.js属于**元素级框架**



### 前端框架使用技术

1. **细粒度更新，自动依赖收集**

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
  const getter = () => value;
  const setter = (newVale) => value = newValue;
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

1. useEffect函数调用时，传给它的回调函数立即执行一次
2. 传给useEffect的回调函数中使用到的自变量变化后，再次执行该回调函数
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

setCount(2)
```



模拟实现依赖收集的源码：

```js
const effectStack = []

function subscribe(effect,subs){
  subs.add(effect)

  effect.deps.add(subs)
}

function cleanup(effect){
  let subs = effect.deps
  for ( const sub of subs ){
    sub.delete(effect)
  }
  effect.deps.clear()
}

function useState(value){
  const subs = new Set()

  const getter = ()=>{
    const effect = effectStack[effectStack.length-1]
    if(effect){
      subscribe(effect,subs)
    }
    return value
  }

  const setter = (nextValue)=>{
    value = nextValue
    for(const effect of [...subs]){
      effect.execute()
    }
  }
  return [getter,setter]
}


function useEffect(callback){
  const execute = ()=>{
    cleanup(effect)  // 先清除所有的与本effect有关的订阅发布关系
    effectStack.push(effect)
    try{
      callback()
    }finally{
      effectStack.pop()
    }
  }
  effect = {
    execute,
    deps:new Set()
  }

  execute()
}

function useMemo(callback){
  const [s,set] = useState()
  useEffect(()=>set(callback))
  return s
}
```



上面的自动依赖收集相较于react提供的useState等hooks的优点：

1. 不需要显式的指明依赖数据
2. 由于可以自动的进行依赖追踪，所以不用像React Hooks一样使用受限，React Hooks不能在条件语句中声明hooks

为什么React Hooks没有使用自动依赖收集和响应的方式实现了？因为React的更新是应用级别的更新，从“自变量与应用的对应关系”角度看，其更新粒度不需要这么细。所以React Hooks的具体实现是使用的链表，同时也就有了上面的那两条限制。



### 预编译

前端编译的目的：

1. 将框架中的UI描述转为宿主环境可以识别的代码
2. 将TS转为JS，实现polyfill等
3. 执行编译优化
4. 代码压缩，混淆



其中根据编译的时机的不同，又分为一下两种：

1. 打包构建时编译——预编译（AOT），宿主环境直接获取可以编译后可执行的代码
2. 执行时编译——即时编译（JIT），源码中含有框架描述UI的模板无法直接被宿主环境识别，但是打包文件中有识别这些UI模板的方法函数，这些方法函数执行将模板转为宿主环境可以识别的代码（编译），然后再执行

JIT和AOT的区别有：

1. 一些AOT阶段能发现的错误，如果在JIT模式下就不会报错，要等到在宿主环境中执行时才会报错。
2. 使用JIT的应用在首次加载时速度慢于AOT的应用，因为其需要先编译再执行代码，而使用AOT的项目在构建阶段就已经编译好，到宿主环境中直接执行即可
3. 使用JIT的应用的代码体积一般大于AOT的应用，因为JIT模式下打包的项目中包含编译模板要使用的代码



AOT可以对模板进行编译时优化，可以减少框架在执行：根据自变量变化计算出UI变化，这一步所需要花费的时间。

大部分采用AOT的前端框架都会在编译节点进行一定的优化，比如Vue3，angular，svelte。之所以能进行编译优化，是因为模板语法相对固定，方便进行分析，在编译阶段就能标记模板语法中可变的部分和动态的部分，并在运行时代码找不同的时候能帮助跳过静态节点的比对。

Svelte和Solidjs甚至利用AOT在编译时直接建立 **自变量与UI中动态部分的关系** ，在运行时，自变量发生变化后，可以直接执行根据UI变化执行具体的宿主环境API。

React是采用jsx描述UI的，因为JSX的本质是JS，非常灵活，使得JSX难以进行AOT。如果要为JSX引入AOT，那么一般可以考虑两方面：

1. 使用新的AOT实现，代表方案：prepack
2. 约束JSX的灵活性，代表方案：solidjs内置逻辑组件





### 虚拟DOM

前端库的运行时是如何解决“根据自变量变化计算出UI变化”这一步的？

找不同的这一步基于的就是虚拟DOM，找不同的工作原理步骤为：

1. 将模板描述的UI转为用虚拟DOM来描述
2. 使用两颗虚拟DOM，对比计算出变化前后虚拟DOM的变化部分

Vue使用模板语法描述UI，模板语法编译为render函数，其对应的两个步骤是：

1. render函数执行后返回VDOM（render）
2. 将变化前后的两个VDOM进行DIFF算法比较，计算出变化的部分（patch）

React使用JSX描述UI，JSX编译为React.createElement方法调用，其对应的两个步骤是：

1. createElement方法执行后返回虚拟DOM
2. **将虚拟DOM描述的UI与之前构建好的FIber链中的节点进行DIFF算法，找出变化的部分，然后再次生成最新的用于描述本次更新的FIber链表**



为什么使用虚拟DOM？

1. 虚拟DOM描述的UI占用内存空间更小，一个真实DOM节点上就有数百个属性或者方法，除了比较UI变化的属性外，还有大量冗余的属性与方法
2. 代码编写起来更灵活
3. 可以基于虚拟DOM开发多平台渲染方案
4. 相对还不错的性能开销





### 各前端框架的实现原理

- 元素级框架——Svelte
- 组件级框架——Vue
- 应用级框架——React







## 第二章

react是一个重运行时的框架。所以react官方的迭代重点是对运行时的代码进行优化。

- React15以及之前的版本面对的问题？
- React官方是如何在react16以后的版本中逐渐解决这些问题的？
- React15到React16底层架构有什么改变



React是基于js创建快速响应的web应用的框架。为了快速响应，需要解决的问题有两个：

1. 执行大计算量的任务是或者设备性能不足时导致页面卡顿（CPU瓶颈）
2. 进行网络数据访问时，等待数据返回后的继续操作（I/O瓶颈）



在react中最有可能造成CPU瓶颈的是虚拟DOM相关的任务。

不同框架在解决“减少运行时代码执行流程”的问题上努力的方向不同。Vue3是能在预编译时期，通过标记静态节点减少不必要的运行时代码的执行。

react作为重运行时的框架，选择的时优化运行时代码来优化这个问题，具体做法是将虚拟DOM的执行过程拆分为一个个可以打断的独立执行的宏任务，尽可能在一个执行时间限制内执行完。让一个耗时的宏任务拆为多个不会造成掉帧的小宏任务。减少掉帧的可能性而不是不掉帧（时间切片）。



对于前端开发，典型的I/O瓶颈就是网络延迟。需要在网络延迟客观存在的情况下，减少网络延迟对用户影响。为此，react将导致的数据变化，再导致的UI变化的不同用户操作做了优先级的区分。因为用户对不同操作的卡顿的感知程度是不一样的。而UI要更新，都是因为数据驱动的，而数据的改变都是因为用户的某种操作导致的。那么只要给不同的操作赋予不同的优先级，尽量的去减少用户感知到卡顿的情况发生。

为了处理I/O方面的瓶颈，react需要做三件事：

1. 为不同操作出发的数据更新赋予不同的优先级
2. 所有优先级统一调度，优先处理高优先级的更新
3. 低优先级的更新任务能被更高优先级的更新任务给打断

为此，react的底层实现了以下三部分来完成上面的事情：

1. 实现用于调度优先级的调度器
2. 调度器所使用的调度算法
3. 支持可中断的虚拟DOM（Fiber链表）





React16重构的底层代码。因为React15的重VDOM的diff计算是一个没办法中断的过程，无法实现时间切片。

React15的架构：

1. reconciler（协调器）—— 基于虚拟DOM进行diff算法，计算并标记出UI的变化内容
2. renderer（渲染器）——将UI的变化渲染到宿主环境中

在reconciler模块中，挂在组件回调用mountComponent，更新组件回调用updateComponent，这两个方法都是递归更新子组件，且这个这个过程无法中断。



React16的架构：

1. scheduler（调度器）——负责根据调度算法调度任务的优先级，高优先级的任务优先进入reconciler
2. reconciler（协调器）——基于虚拟DOM和Fiber链表进行diff算法，计算并标记出UI的变化内容
3. renderer（渲染器）——将UI的变化渲染到宿主环境中

在新架构中将原来的递归且不可中断的流程变为了可中断的循环的过程。每次循环开始前都会判断是否有任务同时当前时间切片是否有空余时间（shouldYield），没有的情况下，暂停本帧中js的执行，并注册一个下一帧继续执行的回调函数。然后将主线程的占用释放去执行渲染线程的任务。



scheduler将调度后的任务交给reconciler后，reconciler阶段进行diff算法比较，给虚拟DOM对应的fiber节点的不同属性上标注各种副作用的flag，标识是更新，删除还是修改。

scheduler模块和reconciler模块的工作都是在内存中进行的，当reconciler模块工作结束后，将处理的结果交给renderer模块，renderer模块根据fiber链表上各个节点上的标识，进行宿主环境中对应的更新UI的操作。





### Fiber架构

React15中的协调采用的是递归的方式，被称为Stack Reconciler，React16以后的Reconciler是基于Fiber链表的，所以又被称为Fiber Reconciler。

Fiber本质是一种类似链表的数据结构，所以链表中都存在节点，叫FiberNode节点。

FiberNode节点使用一个Fiber工厂函数创建的实例对象，它的上面有一系列可以分为不同组的属性：

1. 作为与虚拟DOM一一对应的链表中的节点所含有的属性

   - 保存元素的类型

   - 对应的DOM元素

     ```js
     function FiberNode(tag,pendingProps,key,mode){
       this.tag = tag
       this.key = key
       this.elementType = null
       this.type = null
       this.stateNode = null
     }
     ```

2. 作为工作单元所含有的属性

   - 记录元素变化的数据

   - 保存本次更新中该React元素变化的数据、要执行的工作（增，删，改，更新ref，副作用等）

     ```js
     this.flag = NoFlages
     this.substreeFlags = NoFlags
     this.deleteions = null
     ```

     

3. 作为数据结构的链表相关属性

   ```js
   this.return = null 
   this.child = null
   this.sibling = null
   ```

4. 和调度优先级相关的属性

   ```js
   this.lanes = NoLanes
   this.childLanes = NoLanes
   ```

5. 双缓存属性

   ```js
   this.alternate = null
   ```

   

React内部对于只有唯一一个文本节点的FiberNode，不会生产独立的FiberNode了。



### 双缓存机制

Fiber架构中，同时存在两颗Fiber Tree，一颗对应当前真实UI的Fiber tree，另一颗是内存中正在构建的Fiber tree。源码中current一般就是指当前页面UI对应的FiberNode，workInProgress就是指代内存中对应FiberNode。这两个fiber NOde的alternate相互指向对方。





### 挂载阶段Fiber树的构建









## 第三章

render阶段

Reconciler工作阶段在React中称为render阶段。new一个类组件实例并调用该实例的render方法和 调用函数组件本身都在这个阶段执行。











## 第5章

schedule阶段

React 18 引入了**并发更新（Concurrent Rendering）**，一种新的更新机制，允许 React 在后台并发处理多个更新任务，同时保持页面交互的流畅和响应性。与传统的同步渲染模式不同，并发更新模式可以调度和优先处理更新任务。













为什么学这门课？

每天都在用react，那对react真正了解有多少？比如说面试问的react相关的原理，解决一些react项目问题，一些bug，优化问题。掌握react的底层设计原理就能回答这些问题。

手写实现一个mini reactor，验证所学是不是真的会了？怎么验证？

那写一下代码，比如说去手写实现一个mini react，这是最好的一个来验证对react底层设计原理的掌握程度方式。

react源码的源码量这个是非常大的，有很多包，有很多的文件

那该从哪里开始进行下手

真实的这个react，它是到底执行的哪个条件，比如说有if else，是执行的if，还是else

也许可以分析出来他执行的是if，但可以通过调试react源码的方式，来进行一下验证。

结合这个实际的代码场景，梳理一下react的核心概念

比如说react核心概念：state，property，Effect，context，合成事件。

掌握这些核心概念的时候，一边去学习源码，一边自己来进行手写。

react当中源码太多了，看的时候不知道从哪里下手，然后看到很多源码文件也不知道他是干嘛的。所以在这里，列举一些重要的源码文件，然后去描述了一下这些文件到底是做什么的



比如说react的页面初次渲染，更新，到底走了哪些代码流程。还有react当中的diff，context。













