###  合成事件和原生事件

### 合成事件的工作机制

### React中阻止默认行为和事件冒泡

### React中如何处理异常



### 在 React 中处理异常有几种常见的方法：

1. 使用 try-catch 块：可以在组件生命周期方法或事件处理函数中使用 try-catch 块来捕获和处理异常。例如：

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

2. 使用错误边界（Error Boundaries）：错误边界是一种 React 组件，它可以捕获并处理其子组件中抛出的异常，从而防止整个应用崩溃。可以创建一个错误边界组件并将其包装在可能引发异常的组件周围。例如：

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

![image-20231228103230870](.\images\image-20231228103230870.png)

上边是纯 JavaScript 层面的计算，循环 10000 次，每次创建一个 JavaScript 对象（虚拟DOM对象）并将其添加到数组中；下边是 DOM 操作， 每次创建一个 DOM 元素并将其添加到页面中。跑分结果显示，纯 JavaScript 层面的操作要比 DOM 操作快得多，它们不在一个数量级上。

可以用一个公式来表达通过 **innerHTML 创建页面的性能：HTML 字符串拼接的计算量 + innerHTML 的 DOM 计算量。**





虚拟 DOM 创建页面的过程，虚拟 DOM 创建页面的过程分为两步：

- 第一步是创建 JavaScript 对象，这个对象可以理解为真实 DOM 的描述；
- 第二步是递归地遍历虚拟 DOM 树并创建真实 DOM。

同样可以用一个公式来表达 **虚拟DOM创建页面的性能：创建 JavaScript 对象的计算量 + 创建真实 DOM 的计算量。**



innerHTML 和虚拟 DOM 在**创建页面时**的性能：

![image-20231228103717384](.\images\image-20231228103717384.png)

可以看到，无论是纯 JavaScript 层面的计算，还是 DOM 层面的计 算，其实两者差距不大。这里从宏观的角度只看数量级上的差 异。如果在同一个数量级，则认为没有差异。在创建页面的时候，都需要新建所有 DOM 元素。



**更新页面时的性能对比：**

使用 innerHTML 更新页面的过程是重新构建 HTML 字符串， 再重新设置 DOM 元素的 innerHTML 属性，哪怕只更改了一个文字，也要重新设置 innerHTML 属性。而重新设置 innerHTML 属性就等价于销毁所有旧的 DOM 元素，再全量创建新 的 DOM 元素。

使用虚拟 DOM 更新页面，它需要重新创建 JavaScript 对象（虚拟 DOM 树），然后比较新旧虚拟 DOM，找到变化的元素并更新它。

![image-20231228104101281](.\images\image-20231228104101281.png)

在更新页面时，虚拟 DOM 在 JavaScript 层面的运算要**比创建页面时**多出一个 Diff 的性能消耗，然而它毕竟也是 JavaScript 层面的运算，所以不会产生数量级的差异。

再观察 DOM 层面的运算，可以发现虚拟 DOM 在更新页面时只会更新必要的元素，但 innerHTML 需要全量更新。**这时虚拟 DOM 的优势就体现出来了**。

另外，当更新页面时，影响虚拟 DOM 的性能因素与影响 innerHTML 的性能因素不同。对于虚拟 DOM 来说，无论页面多大，都只会更新变化的内容，而对于 innerHTML 来说，页面越大， 就意味着更新时的性能消耗越大。如果加上性能因素，那么最终它们 在更新页面时的性能如图所示。

![image-20231228104341810](.\images\image-20231228104341810.png)



**对比结论：**

粗略地总结一下 innerHTML、虚拟 DOM 以及原生 JavaScript（指 createElement 等方法）在**更新页面时**的性能

![image-20231228104435412](.\images\image-20231228104435412.png)

原生 DOM 操作方法的心智负担最大，因为要手动创建、删除、修改大量的 DOM 元素。但它的性能是最高的，不过为了使其性能最佳，要承受巨大的心智负担。另外，以这种方式编写的代码，可维护性也极差。

对于 innerHTML 来说，由于编写页面的过程有一部分是通过拼接 HTML 字符串来实现的，但是拼接字符串总归也是有一定心智负担的，而且对于事件绑定之类的事情，还是要使用原生 JavaScript 来处理。如果 innerHTML 模板很大，则其更新页面的性能最差，尤其是在只有少量更新时。

最后，虚拟 DOM，它是声明式的，因此心智负担小，可维护性强，性能虽然比不上极致优化的原生 JavaScript，但是在保证心智负担 和可维护性的前提下相当不错。





### React为什么引入JSX





### HOC

#### **是什么**

在React中，**HOC**（**Higher-Order Component**，高阶组件）是一个函数，它接受一个组件并返回一个新的组件。这个新组件通常会在原始组件的基础上增加额外的功能或行为，常用于代码复用和逻辑封装。

**HOC的基本定义：**

HOC是一个函数，签名通常是：

```jsx
const MyHOC = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      // 在这里可以增强功能
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

#### **HOC的特点：**

- **不改变原组件**：HOC并不直接修改原始组件，而是返回一个新的组件，原组件仍然保持不变。
- **增强功能**：HOC常用于添加跨组件的功能，比如权限控制、日志记录、数据获取等。
- **复用逻辑**：通过高阶组件，多个组件可以共享某些逻辑，而不需要复制粘贴代码。





#### **应用场景**

**权限控制**： HOC可以用来封装权限控制逻辑，判断用户是否有权限访问某个组件。

```jsx
const withAuth = (WrappedComponent) => {
  return (props) => {
    if (!props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return <WrappedComponent {...props} />;
  };
};
```



**代码复用**： 如果多个组件需要共享相似的功能或行为，可以使用HOC来封装这些逻辑，从而避免代码重复。

```jsx
const withLoading = (WrappedComponent) => {
  return (props) => {
    if (props.isLoading) {
      return <LoadingSpinner />;
    }
    return <WrappedComponent {...props} />;
  };
};
```



**日志记录**： 可以使用HOC来自动记录组件的渲染过程，进行日志或性能分析。

```jsx
const withLogging = (WrappedComponent) => {
  return (props) => {
    console.log(`Rendering ${WrappedComponent.name}`);
    return <WrappedComponent {...props} />;
  };
};
```



**生命周期方法增强**： HOC可以在生命周期方法中插入逻辑，或增强组件的生命周期行为。

```jsx
const withTimer = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      console.log('Timer started');
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
```



**功能增强**： 可以在HOC中增强组件的行为，比如自动处理错误、增加性能优化等。

```jsx
const withExtraProps = (WrappedComponent) => {
  return (props) => {
    // 增加额外的 props
    const extraProps = { extraProp: 'I am an extra prop!' };

    // 将新的props合并后传递给 WrappedComponent
    return <WrappedComponent {...props} {...extraProps} />;
  };
};
```





#### 需要注意的事项

- **Props冲突**：如果HOC传递了额外的props，可能会和原组件的props发生冲突，导致错误或意外行为。为了避免这种情况，常常会使用`displayName`来调试和区分不同的组件。
- **不可变性**：HOC应该是纯函数，不应直接修改原组件的状态或属性，而是返回一个新的组件。





### 反向继承

**反向继承**（Reverse Inheritance）是指一个组件通过 **高阶组件（HOC）** 的方式继承并增强另一个组件的行为，而不是像常规继承那样直接通过React提供的组件类的扩展来获取功能。反向继承的目的是为了将逻辑或功能添加到组件中，而不直接修改原组件的实现。

在反向继承中，HOC接管了原组件的渲染行为，通常会将额外的功能或逻辑注入到原组件中。

**反向继承的核心概念**：

反向继承通常是通过 HOC 来实现的。HOC 继承了原组件的行为，但通过自己的生命周期方法或渲染逻辑来增强或覆盖原组件的行为。这种模式有时也被称为 "混入"（Mixin）或 "委托"（Delegation）。



#### 实现反向继承的步骤

1. **定义一个 HOC**：这个 HOC 包装原始组件，增强它的行为，或者修改其生命周期方法。

2. **通过 HOC 反向继承原组件的行为**：HOC 可以通过`render`方法、生命周期方法（如`componentDidMount`）等去增强或替换原组件的功能。

   

#### 使用 HOC 实现反向继承

假设有一个简单的组件，希望通过反向继承的方式增强它的功能，增加一个日志记录功能。

步骤1：定义原始组件

```jsx
const MyComponent = () => {
  return <div>Original Component</div>;
};
```

步骤2：实现反向继承的 HOC

定义一个 HOC，它增强了组件的行为，主要通过修改`render`方法来“反向继承”原组件的内容，并加入额外的逻辑。

```jsx
const withLogging = (WrappedComponent) => {
  return class extends WrappedComponent {
    // 在组件渲染前执行某些逻辑
    componentDidMount() {
      super.componentDidMount()
      console.log(`${WrappedComponent.name} mounted`);
    }

    render() {
      // 在渲染之前或者之后可以做额外的事情
      return super.render();
    }
  };
};
```

在这个例子中，`withLogging` 是一个 HOC，它增强了原组件 `MyComponent`，在组件挂载时打印日志。

步骤3：使用反向继承的 HOC

```jsx
const EnhancedComponent = withLogging(MyComponent);

function App() {
  return <EnhancedComponent />;
}

export default App;
```

在这个例子中，`EnhancedComponent` 通过 `withLogging` HOC 包装了 `MyComponent`，实现了反向继承。此时，可以看到 `EnhancedComponent` 的行为被增强了：它在控制台中输出日志。





修改react树：

```jsx
const HOC = (WrappedComponent) => {
  return class extends WrappedComponent {

    render() {
     	const tree = super.render();
      const newProps = {};
      if(tree && tree.type === 'input'){
        newProps.value = 'test'
      }
      return React.cloneElement(tree,{...this.props,...newProps},this.props.children)
    }
  };
};
```



#### 反向继承的目的一般有哪些？

1. **代码复用**： 反向继承通过 HOC 可以将多个组件共享的逻辑提取出来并复用。这种方式比直接在每个组件中重复相同的代码更加高效和清晰。

   例如，多个组件可能都需要访问某些状态（如用户认证状态），反向继承的 HOC 可以将这些逻辑提取出来，减少冗余代码。

2. **增强组件的功能**： 通过反向继承，HOC 可以在不改变原组件的情况下，为其添加额外的功能或行为。例如，可以在组件渲染前后添加日志、性能跟踪、错误边界等功能。

3. **组件逻辑解耦**： 反向继承有助于将组件的**显示逻辑**和**业务逻辑**解耦。通过将一些行为（如数据获取、权限检查、加载状态等）移入 HOC，原组件仅专注于UI显示和渲染，增强了组件的关注点分离。

4. **生命周期方法的增强**： 通过反向继承，可以在不修改原组件的情况下，增强其生命周期方法。比如在组件挂载、更新或卸载时执行一些自定义的逻辑。

   例如，HOC 可以通过在`componentDidMount`中加入额外的功能，如数据请求、日志记录等，而不需要直接修改组件。

5. **跨多个组件的功能共享**： 当多个组件需要共享相同的功能时，可以使用反向继承来将这些功能提取为 HOC，避免将相同的代码复制到每个组件中。

6. **实现“装饰模式”**： 反向继承有时也被用作一种“装饰模式”，即为组件添加额外的视觉或功能装饰。例如，你可以通过 HOC 给组件加上背景色、边框，或者在原组件基础上增强一些交互行为。



#### 错误边界应用

错误边界是 React 中常见的一种用法，通过反向继承的 HOC 方式，可以在不直接修改组件的情况下为其添加错误处理逻辑。

```jsx
const withErrorBoundary = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      console.log('Error caught by ErrorBoundary:', error, info);
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

在这个例子中，`withErrorBoundary` HOC 通过反向继承的方式，为任何组件提供了错误捕获的能力。

**使用**

```
javascript复制代码const SomeComponent = () => {
  // 这里模拟一个错误
  throw new Error('Test error');
};

const SomeComponentWithErrorBoundary = withErrorBoundary(SomeComponent);

function App() {
  return <SomeComponentWithErrorBoundary />;
}

export default App;
```





拦截组件内部的内容。所有反向继承的方式都是通过类组件来实现的。

```jsx
function HOC(WrappedComponent){
  return classextends WrappedComponent {
    render(){
      return super.render()
    }
  }
}
```



### 受控组件和非受控组件

**受控组件**（Controlled Components）和**非受控组件**（Uncontrolled Components）是两种不同的处理表单元素的方式。它们的主要区别在于**状态管理**和**表单数据的控制方式**。

#### 受控组件（Controlled Components）

**受控组件**是指在 React 中，表单元素（如 `<input>`、`<textarea>`、`<select>` 等）的值由 **React 组件的 state** 来控制。这意味着表单元素的值完全由组件的状态来决定，用户输入的值会通过 `onChange` 事件处理程序更新组件的 state，从而实现对表单元素值的控制。

**受控组件的特征**

1. **React 管理表单数据**：表单元素的值由 React 组件的 state 控制。
2. **双向绑定**：通过 React 组件的 state 和表单元素的值保持同步，用户输入时，`onChange` 事件会更新 state，组件的渲染会根据新的 state 更新 DOM。
3. **表单数据始终存储在组件的 state 中**。

#### 示例：

```jsx
import React, { useState } from 'react';

const ControlledForm = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);  // 更新 state
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('A name was submitted: ' + value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} onChange={handleChange} />  {/* 受控组件 */}
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ControlledForm;
```

受控组件的优点：

1. **数据一致性**：所有的表单数据都存储在 React 的 state 中，确保表单状态和 UI 是同步的。
2. **易于验证和操作**：可以轻松地对表单数据进行验证、修改或处理，因为数据在 React 的 state 中。
3. **可控性**：开发者可以随时根据需要更新表单的值或验证表单内容。

应用场景：

- **复杂表单**：需要对表单进行动态验证、修改、处理的场景。
- **表单提交前的校验**：需要根据用户输入的值进行即时校验（如实时检查邮箱格式是否正确等）。
- **多个组件共享表单数据**：当多个组件需要访问或修改同一表单数据时，受控组件非常有用，因为所有数据都集中在组件的 state 中。



#### 非受控组件（Uncontrolled Components）

**非受控组件**是指表单元素的值不由 React 控制，而是由 DOM 本身来管理。这些组件依赖于 `ref` 来获取表单元素的当前值，而不是通过 React 的 state 来控制它们。

非受控组件的特征

1. **表单数据由 DOM 管理**：表单元素的值不存储在组件的 state 中，React 只通过 `ref` 获取当前值。
2. **不需要 `onChange` 事件处理**：由于表单数据不是由 React 管理的，因此不需要 `onChange` 来同步数据。
3. **通过 `ref` 获取值**：你可以通过 `React.createRef()` 或 `useRef()` 来获取表单元素的当前值。

示例：

```jsx
import React, { useRef } from 'react';

const UncontrolledForm = () => {
  const inputRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('A name was submitted: ' + inputRef.current.value);  // 通过 ref 获取当前值
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" ref={inputRef} />  {/* 非受控组件 */}
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledForm;
```

非受控组件的优点：

1. **代码简洁**：不需要将表单数据与 state 绑定，对于一些简单的表单，使用非受控组件可以减少代码量。
2. **直接与 DOM 交互**：如果你不需要实时地追踪表单数据或进行验证，非受控组件可以让你直接与 DOM 进行交互，简单直接。
3. **性能**：在某些情况下，非受控组件可能会比受控组件更高效，因为没有 React 的 state 更新和重新渲染。

应用场景：

- **简单表单**：表单数据不需要动态验证或处理的情况，尤其是当表单非常简单时，非受控组件可能更加适合。
- **集成第三方库**：当需要与一些非 React 库交互，或者直接操作 DOM 时，非受控组件可能会更加方便。
- **性能优化**：对于极简的表单，避免过多的状态更新可能带来性能上的好处。



### 受控组件 vs 非受控组件

| 特性               | 受控组件                             | 非受控组件                       |
| ------------------ | ------------------------------------ | -------------------------------- |
| **数据来源**       | React state 控制表单的值             | DOM 自己控制表单的值             |
| **表单数据**       | 数据存储在组件的 state 中            | 数据直接存储在 DOM 中            |
| **更新方式**       | 通过 `onChange` 事件更新 state       | 通过 `ref` 获取 DOM 元素的值     |
| **应用场景**       | 复杂表单、验证、动态控制表单数据     | 简单表单、第三方库集成、性能优化 |
| **表单验证与处理** | 便于实现复杂的验证与动态处理         | 不适合做复杂的表单验证和处理     |
| **代码复杂度**     | 需要更多的代码（`state` 和事件处理） | 代码简洁，使用 `ref` 获取值      |

总结：

- **受控组件**：React 控制表单元素的值，适用于需要实时更新、验证或与状态绑定的场景。
- **非受控组件**：表单元素的值由 DOM 控制，适用于简单的表单或者不需要过多操作的场景。

通常情况下，React 推荐使用受控组件，因为它们能提供更好的可控性和灵活性，但在处理简单表单或特定场景时，非受控组件也是一种可行的选择。



### super() 和 super(props)

在React的类组件中，`super()` 和 `super(props)` 的区别主要在于它们如何处理和传递参数给父类（即React.Component）。

1. `super()`: 当你调用不带参数的 `super()` 时，你实际上是在调用父类的构造函数但没有传递任何参数。在这种情况下，你在构造函数中不能使用 `this` 关键字来访问props，因为此时 `this` 还没有被正确初始化。如果你尝试这样做，可能会遇到错误或未定义的行为。
2. `super(props)`: 调用带有 `props` 参数的 `super(props)` 会将 `props` 传递给父类的构造函数。这允许你可以在构造函数内通过 `this.props` 来访问这些属性。这是React官方推荐的做法，尤其是在你想在构造函数中使用 `this.props` 初始化状态（state）的时候。

简而言之：

- 如果你需要在构造函数中使用 `this.props`，你应该总是调用 `super(props)`。
- 如果你不打算在构造函数中使用 `this.props`，你可以只调用 `super()`，但这不是常见的做法。



### React.createClass

`React.createClass` 是 React 早期版本中用于定义组件的一种方式。它允许开发者通过一个方法创建新的 React 组件类，这个方法接收一个对象作为参数，该对象包含了组件的生命周期方法、默认属性（getDefaultProps）、渲染逻辑（render）等。

使用 `React.createClass` 创建的组件会自动绑定所有在组件中定义的方法到当前实例，这意味着你可以在不显式绑定的情况下，在事件处理器或其他回调函数中使用 `this` 访问组件实例。

以下是一个使用 `React.createClass` 创建组件的例子：

```jsx
var MyComponent = React.createClass({
  getDefaultProps: function() {
    return {
      name: 'defaultName'
    };
  },
  getInitialState: function() {
    return { count: 0 };
  },
  handleClick: function() {
    this.setState({ count: this.state.count + 1 });
  },
  render: function() {
    return (
      <div>
        Hello, {this.props.name}! You clicked {this.state.count} times.
        <button onClick={this.handleClick}>Click me</button>
      </div>
    );
  }
});
```

然而，`React.createClass` 已经被弃用，并且从 React v16.0 开始不再推荐使用。官方建议使用 ES6 类或函数组件来定义 React 组件。ES6 类提供了更现代的 JavaScript 特性，并且需要显式地绑定方法中的 `this` 或者使用箭头函数。而函数组件结合 Hooks 提供了一种更简洁的方式来处理状态和副作用，使得代码更加直观和易于理解。





`React.createClass` 的作用是提供了一种在早期版本的 React 中定义组件的方式。它为开发者创建 React 组件提供了便利，特别是因为它会自动绑定所有在组件中定义的方法到组件实例，从而简化了事件处理和其他需要使用 `this` 的场景。

具体来说，`React.createClass` 有以下几个主要作用：

1. **定义组件**：通过传递一个包含组件行为的对象给 `React.createClass`，可以创建一个新的 React 组件类。这个对象可以包含生命周期方法、默认属性（`getDefaultProps`）、初始状态（`getInitialState`）和渲染逻辑（`render` 方法）等。
2. **自动绑定 `this`**：在使用 `React.createClass` 创建的组件中，所有定义的方法都会自动绑定到当前组件实例。这意味着你可以在不显式绑定的情况下，在事件处理器或其他回调函数中使用 `this` 访问组件实例。这减少了手动绑定 `this` 或者使用箭头函数的需求。
3. **混入（Mixins）支持**：虽然现在已经不再推荐使用，但在过去，`React.createClass` 支持混入，允许共享多个组件之间的行为。
4. **简化状态管理**：`getInitialState` 方法使得初始化组件的状态变得简单明了。
5. **默认属性设置**：`getDefaultProps` 方法允许你为组件定义默认的 prop 值，如果这些 props 没有从父组件传递下来，则会使用默认值。

然而，随着 React 生态系统的演变，`React.createClass` 已经被弃用，并且官方现在建议使用 ES6 类或者函数组件来定义组件。ES6 类和函数组件结合 Hooks 提供了更强大的功能，如更好的代码组织、性能优化以及更简洁的语法。对于新的项目或代码库，应该避免使用 `React.createClass`，并转向更现代的组件定义方式。
