### 合成事件和原生事件

### 合成事件的工作机制

### React中阻止默认行为和事件冒泡

### React中如何处理异常

### 在 React 中处理异常有几种常见的方法：

1. 使用 try-catch 块：你可以在组件生命周期方法或事件处理函数中使用 try-catch 块来捕获和处理异常。例如：

```jsx
class MyComponent extends React.Component {
  handleClick() {
    try {
      // 可能会抛出异常的代码
    } catch (error) {
      // 处理异常
    }
  }

  render() {
    return <button onClick={this.handleClick}>点击按钮</button>;
  }
}
```

2. 使用错误边界（Error Boundaries）：错误边界是一种 React 组件，它可以捕获并处理其子组件中抛出的异常，从而防止整个应用崩溃。你可以创建一个错误边界组件并将其包装在可能引发异常的组件周围。例如：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 处理异常，例如记录错误日志
  }

  render() {
    if (this.state.hasError) {
      // 渲染错误处理 UI
      return <div>发生了错误！</div>;
    }

    return this.props.children;
  }
}

// 使用错误边界包装组件
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

3. 使用 componentDidCatch 生命周期方法：在类组件中，你可以使用 `componentDidCatch` 生命周期方法来捕获和处理组件中的异常。例如：

```jsx
class MyComponent extends React.Component {
  componentDidCatch(error, errorInfo) {
    // 处理异常，例如记录错误日志
  }

  render() {
    // ...
  }
}
```

4. 使用错误边界钩子（Error Boundary Hook）：React 16.9 版本引入了 `useErrorBoundary` 钩子，可以在函数组件中处理异常。你可以使用它来包装可能引发异常的代码块。例如：

```jsx
import { useErrorBoundary } from 'react-error-boundary';

function MyComponent() {
  const [ErrorBoundary, resetErrorBoundary] = useErrorBoundary();

  const handleClick = () => {
    try {
      // 可能会抛出异常的代码
    } catch (error) {
      // 处理异常
      resetErrorBoundary();
    }
  };

  return (
    <ErrorBoundary>
      <button onClick={handleClick}>点击按钮</button>
    </ErrorBoundary>
  );
}
```

这些方法可以根据你的需求和使用场景选择适合的方式来处理异常。无论你选择哪种方法，处理异常是一项重要的开发实践，它可以帮助你的应用更好地处理错误情况，提高应用的稳定性和用户体验。





尽管错误边界（Error Boundaries）是一种在 React 中处理异常的有用工具，但它们也有一些限制和问题需要注意：

1. 仅捕获子组件的异常：错误边界只能捕获其子组件中抛出的异常，无法捕获自身组件内部的异常或其父组件中的异常。因此，如果错误边界本身出现问题，或者异常来自于错误边界之上的组件，错误边界将无法捕获和处理这些异常。
2. 无法在事件处理函数中捕获：错误边界无法捕获在事件处理函数中抛出的异常。这是因为事件处理函数是在异步调用中执行的，超出了错误边界的范围。在事件处理函数中使用 try-catch 块可以解决这个问题。
3. 对异步代码的限制：错误边界无法捕获异步操作中的异常，例如 Promise 或 setTimeout 中的异常。在这种情况下，你需要在异步操作中自行处理异常。
4. 仅在生产环境中生效：错误边界的捕获行为仅在生产环境中生效，而在开发环境中，异常仍然会被传播到控制台，以便进行调试和错误追踪。这意味着在开发期间，错误边界可能无法捕获和处理异常。
5. 不是通用解决方案：错误边界并不是解决所有异常处理问题的通用解决方案。它们主要用于处理在组件树中特定位置的异常，以防止整个应用程序崩溃。对于全局错误处理或更复杂的错误处理需求，可能需要其他手段和工具。

总之，错误边界是一种有用的工具，可以处理组件树中特定位置的异常。然而，你需要了解其限制和使用场景，并在需要时采取其他适当的异常处理措施。





### React中事件代理的原理





### 高阶组件，props和hooks的是什么，分别解决什么问题，有什么区别



### React解决代码复用都做过什么努力，怎么发展的



### React为什么推出Fiber架构



### Fiber中的动态优先级



### 如何实现的渲染过程可中断



### fiber分批执行任务时，会时不时让出浏览器的控制权，让浏览器去执行其他操作，react是如何让出这个控制权的



### React内部自己实现了一个requestIdelCallback方面，为什么不用settimeout实现



### messageChannel是什么



### fiber是什么样的数据结构，为什么不用数组



### fiber中如何支持动画的



### 哪些方法会造成React的重新渲染



### React中如何避免重复渲染



### useMemo，useCallback



### Fragment空组件



### React中如何获取组件的实例或者DOM元素



### context是什么



### this.setState的原理



### useState的原理，为什么返回值是数组而非对象



### react中组件传递的props数据类型的校验



### React-router的实现原理



### redux的原理和工作流程



### redux中如何处理异步请求



### redux和vuex之间的区别



### React和vue 的diff算法区别



### mobx



### redux，mobx之类的区别



### hooks到底解决了什么问题，使用限制，为什么有这些限制



### useEffect原理



### React懒加载实现原理



### domiff中的key的作用，为什么不建议用index作为key



### 虚拟DOM到底是什么，为什么有它



### React.createElement



### react中是否必须使用jsx





### react高阶组件使用的是什么设计模式思想

React 高阶组件（Higher-Order Components，HOC）使用了装饰器模式的设计思想。

装饰器模式是一种结构型设计模式，它允许你通过将对象包装在具有相同接口的包装器对象中来动态地添加功能。这样可以在不修改原始对象的情况下，通过在包装器中添加额外的行为来扩展对象的功能。

在 React 中，高阶组件是一种接受一个组件作为参数，并返回一个新组件的函数。它接受一个或多个组件作为输入，并返回一个具有新功能的组件作为输出。高阶组件通过将被包装的组件包裹在容器组件中来提供额外的功能和行为。

高阶组件可以用于实现一些常见的横切关注点，如状态管理、鉴权、日志记录等。通过将这些横切关注点从组件中抽离出来，高阶组件提供了一种可重用的方式来添加功能，同时保持了组件的简洁和聚焦性。

使用高阶组件的过程中，原始组件被视为被装饰的对象，而高阶组件则充当装饰器，将新的功能添加到原始组件中。这种思想与装饰器模式的核心思想是一致的。

需要注意的是，随着 React Hooks 的引入，使用函数式组件和自定义钩子也成为了实现类似功能的替代方案，但高阶组件仍然是一种常见且有用的设计模式，尤其在早期版本的 React 中被广泛使用。





----

React16与React17的面试题

React16.8的版本是一个分水岭，之前的版本中代码重点都在核心功能的实现，之后的版本则重点在性能优化。

```shell
npm install create-a-react-app -g

cra projectName
```



### 什么是React

react是一个由facebook开发维护的JavaScript库，用于构建前端用户界面，特别是单页面应用。

特点：

1. 引入虚拟DOM（一个内存中的树数据结构，本质是分层级的js对象实例），跟踪页面实际DOM的变化，每当数据变化就构建一个新的虚拟DOM，并和老的虚拟DOM进行对比，基于diff算法进行最小化，最高效的更新
2. 声明式编程
3. 引入JSX
4. 组件化
5. 单向数据流
6. 生态丰富



### 什么是虚拟DOM

虚拟DOM本质就是一个带有层级结构的js对象，它是真实DOM在内存中的映射，比起真实的DOM树，它更加轻量。

在react中使用React.createEelement方法（老方法）或者jsx方法（新方法）传参生成对应的虚拟DOM对象。

React.createEelement(type,props,children)



react中基于虚拟DOM的工作机制：

1. 初次渲染页面时，先创建一个描述真实页面UI的虚拟DOM，然后React渲染器负责将这个虚拟DOM渲染为真实DOM并插入页面容器中
2. 当后面某个页面使用到的数据发生变化时，React会创建一个新的虚拟DOM，并与老虚拟DOM进行对比，找出两者的差异，确定最小化修改的内容
3. 最后react渲染器会重新将这些变化更新到页面中



优势：

1. 提升性能
2. 提高开发效率
3. 跨平台



**为什么需要虚拟DOM**

声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗，因此，如果能够**最小化找出差异的性能消耗**，就可以让声明式代码的性能无限接近命令式代码的性能。**虚拟 DOM，就是为了最小化找出差异这一步的性能消耗而出现的。**

**理论上**基于虚拟DOM的更新不可能比原生JavaScript操作DOM更高效。之所以说理论上，因为在大部分情况 下，很难写出绝对优化的命令式代码，尤其是当应用程序的规模很大的时候，即使写出了极致优化的代码，也一定耗费了巨大的精力，这时的投入产出比其实并不高。

**虚拟DOM的引入，能在开发体验（效率）和应用性能上取得一个不错的平衡效果。**



**innerHTML和虚拟DOM的性能对比：**

**创建页面时的性能对比：**

innerHTML创建、更新页面的过程，对于 innerHTML 来说， 为了创建页面，需要构造一段 HTML 字符串，接着将该字符串赋值给 DOM 元素的 innerHTML 属性：

```js
const html = `
<div><span>...</span></div>
`

div.innerHTML = html
```

为了渲染出页面，首先要把字符串解析成 DOM 树，这是一个 DOM 层面的计算。涉及 DOM 的运算要远比 JavaScript 层面的计算性能差，这有一个跑分结果可供参考，如图。

![image-20231228103230870](C:\Users\dukkha\Desktop\learn-notes\面试题\images\image-20231228103230870.png)

上边是纯 JavaScript 层面的计算，循环 10000 次，每次创建一个 JavaScript 对象（虚拟DOM对象）并将其添加到数组中；下边是 DOM 操作， 每次创建一个 DOM 元素并将其添加到页面中。跑分结果显示，纯 JavaScript 层面的操作要比 DOM 操作快得多，它们不在一个数量级上。

可以用一个公式来表达通过 **innerHTML 创建页面的性能：HTML 字符串拼接的计算量 + innerHTML 的 DOM 计算量。**





虚拟 DOM 创建页面的过程，虚拟 DOM 创建页面的过程分为两步：

- 第一步是创建 JavaScript 对象，这个对象可以理解为真实 DOM 的描述；
- 第二步是递归地遍历虚拟 DOM 树并创建真实 DOM。

同样可以用一个公式来表达 **虚拟DOM创建页面的性能：创建 JavaScript 对象的计算量 + 创建真实 DOM 的计算量。**



innerHTML 和虚拟 DOM 在**创建页面时**的性能：

![image-20231228103717384](C:\Users\dukkha\Desktop\learn-notes\面试题\images\image-20231228103717384.png)

可以看到，无论是纯 JavaScript 层面的计算，还是 DOM 层面的计 算，其实两者差距不大。这里从宏观的角度只看数量级上的差 异。如果在同一个数量级，则认为没有差异。在创建页面的时候，都需要新建所有 DOM 元素。



**更新页面时的性能对比：**

使用 innerHTML 更新页面的过程是重新构建 HTML 字符串， 再重新设置 DOM 元素的 innerHTML 属性，哪怕只更改了一个文字，也要重新设置 innerHTML 属性。而重新设置 innerHTML 属性就等价于销毁所有旧的 DOM 元素，再全量创建新 的 DOM 元素。

使用虚拟 DOM 更新页面，它需要重新创建 JavaScript 对象（虚拟 DOM 树），然后比较新旧虚拟 DOM，找到变化的元素并更新它。

![image-20231228104101281](C:\Users\dukkha\Desktop\learn-notes\面试题\images\image-20231228104101281.png)

在更新页面时，虚拟 DOM 在 JavaScript 层面的运算要**比创建页面时**多出一个 Diff 的性能消耗，然而它毕竟也是 JavaScript 层面的运算，所以不会产生数量级的差异。

再观察 DOM 层面的运算，可以发现虚拟 DOM 在更新页面时只会更新必要的元素，但 innerHTML 需要全量更新。**这时虚拟 DOM 的优势就体现出来了**。

另外，当更新页面时，影响虚拟 DOM 的性能因素与影响 innerHTML 的性能因素不同。对于虚拟 DOM 来说，无论页面多大，都只会更新变化的内容，而对于 innerHTML 来说，页面越大， 就意味着更新时的性能消耗越大。如果加上性能因素，那么最终它们 在更新页面时的性能如图所示。

![image-20231228104341810](C:\Users\dukkha\Desktop\learn-notes\面试题\images\image-20231228104341810.png)



**对比结论：**

粗略地总结一下 innerHTML、虚拟 DOM 以及原生 JavaScript（指 createElement 等方法）在**更新页面时**的性能

![image-20231228104435412](C:\Users\dukkha\Desktop\learn-notes\面试题\images\image-20231228104435412.png)

原生 DOM 操作方法的心智负担最大，因为要手动创建、删除、修改大量的 DOM 元素。但它的性能是最高的，不过为了使其性能最佳，要承受巨大的心智负担。另外，以这种方式编写的代码，可维护性也极差。

对于 innerHTML 来说，由于编写页面的过程有一部分是通过拼接 HTML 字符串来实现的，但是拼接字符串总归也是有一定心智负担的，而且对于事件绑定之类的事情，还是要使用原生 JavaScript 来处理。如果 innerHTML 模板很大，则其更新页面的性能最差，尤其是在只有少量更新时。

最后，虚拟 DOM，它是声明式的，因此心智负担小，可维护性强，性能虽然比不上极致优化的原生 JavaScript，但是在保证心智负担 和可维护性的前提下相当不错。





### React为什么引入JSX



React18面试题