合成事件和原生事件

合成事件的工作机制

React中阻止默认行为和事件冒泡

React中如何处理异常

在 React 中处理异常有几种常见的方法：

1. 使用 try-catch 块：你可以在组件生命周期方法或事件处理函数中使用 try-catch 块来捕获和处理异常。例如：

```
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

```
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

```
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

```
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





## React中事件代理的原理





高阶组件，props和hooks的是什么，分别解决什么问题，有什么区别



React解决代码复用都做过什么努力，怎么发展的



React为什么推出Fiber架构



Fiber中的动态优先级



如何实现的渲染过程可中断



fiber分批执行任务时，会时不时让出浏览器的控制权，让浏览器去执行其他操作，react是如何让出这个控制权的



React内部自己实现了一个requestIdelCallback方面，为什么不用settimeout实现



messageChannel是什么



fiber是什么样的数据结构，为什么不用数组



fiber中如何支持动画的



哪些方法会造成React的重新渲染



React中如何避免重复渲染



useMemo，useCallback



Fragment空组件



React中如何获取组件的实例或者DOM元素



context是什么



this.setState的原理



useState的原理，为什么返回值是数组而非对象



react中组件传递的props数据类型的校验



React-router的实现原理



redux的原理和工作流程



redux中如何处理异步请求



redux和vuex之间的区别



React和vue 的diff算法区别



mobx



redux，mobx之类的区别



hooks到底解决了什么问题，使用限制，为什么有这些限制



useEffect原理



React懒加载实现原理



domiff中的key的作用，为什么不建议用index作为key



虚拟DOM到底是什么，为什么有它



React.createElement



react中是否必须使用jsx





react高阶组件使用的是什么设计模式思想

React 高阶组件（Higher-Order Components，HOC）使用了装饰器模式的设计思想。

装饰器模式是一种结构型设计模式，它允许你通过将对象包装在具有相同接口的包装器对象中来动态地添加功能。这样可以在不修改原始对象的情况下，通过在包装器中添加额外的行为来扩展对象的功能。

在 React 中，高阶组件是一种接受一个组件作为参数，并返回一个新组件的函数。它接受一个或多个组件作为输入，并返回一个具有新功能的组件作为输出。高阶组件通过将被包装的组件包裹在容器组件中来提供额外的功能和行为。

高阶组件可以用于实现一些常见的横切关注点，如状态管理、鉴权、日志记录等。通过将这些横切关注点从组件中抽离出来，高阶组件提供了一种可重用的方式来添加功能，同时保持了组件的简洁和聚焦性。

使用高阶组件的过程中，原始组件被视为被装饰的对象，而高阶组件则充当装饰器，将新的功能添加到原始组件中。这种思想与装饰器模式的核心思想是一致的。

需要注意的是，随着 React Hooks 的引入，使用函数式组件和自定义钩子也成为了实现类似功能的替代方案，但高阶组件仍然是一种常见且有用的设计模式，尤其在早期版本的 React 中被广泛使用。