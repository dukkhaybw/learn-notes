## Redux面试题

### MVC框架的主要问题是什么？

前端的MVC（Model-View-Controller）框架设计模式在很多项目中被采用，尤其是在早期的Web应用开发中。尽管MVC模式为开发者提供了一种结构化的开发方法，以分离关注点和提高代码的可维护性，但在前端项目中使用时，也可能遇到一些问题：

1. 复杂性管理

- **状态同步问题**：在复杂的前端应用中，维持模型（Model）和视图（View）之间的同步可能变得非常困难。应用状态可能散布在多个模型和视图中，导致更新状态时出现不一致性。
- **事件绑定复杂性**：随着应用的增长，视图和模型之间的事件监听和绑定可能变得复杂，使得代码难以追踪和维护。

2. 性能问题

- **DOM操作效率**：MVC模式可能导致大量的DOM操作，因为视图更新通常需要手动操作DOM。这在大型应用中可能会成为性能瓶颈。
- **数据绑定开销**：双向数据绑定（如果被实现）可能会导致性能问题，因为每个数据变更都需要检查模型和视图之间的同步，这在复杂应用中可能非常耗时。

3. 可扩展性问题

- **难以适应大型应用**：随着应用规模的扩大，MVC模式的应用可能难以管理和扩展。特别是在需要大量交互和复杂数据流的单页应用（SPA）中，MVC可能不是最佳选择。
- **代码组织**：在MVC框架中，随着应用的增长，找到合适的地方放置业务逻辑可能变得挑战，尤其是当逻辑不完全符合标准的MVC分类时。

4. 维护性

- **代码耦合**：虽然MVC旨在分离关注点，但在实践中，模型、视图和控制器之间可能仍然存在较高的耦合度，这会影响到代码的可维护性和可测试性。
- **重构困难**：应用结构一旦建立，对MVC架构进行重构可能会非常困难，特别是在没有足够测试支持的情况下。

尽管存在上述问题，MVC模式仍然是一个有力的工具，特别是对于某些类型的应用和项目。重要的是要了解MVC模式的局限性，并根据项目的具体需求选择最合适的架构和技术栈。在一些情况下，采用MVVM（Model-View-ViewModel）、Flux或Redux等架构模式可能更适合复杂的前端应用开发。



### 解释一下 Flux

Flux是由Facebook提出的一种用于构建**客户端Web应用程序**的应用**架构**。它是一个**用于处理数据流**的模式，特别适用于React组件库。Flux的核心目标是促进单向数据流，这与传统的MVC模式形成对比。在MVC模式中，数据可以在模型（Model）、视图（View）和控制器（Controller）之间双向流动，这可能会导致数据流难以追踪，从而增加了应用程序的复杂性。Flux通过其独特的组件和单向数据流的概念来解决这一问题。

**Flux的主要组成部分包括：**

- **Actions**：Actions是发送数据到Dispatcher的有效载荷。它们是触发状态改变的唯一来源，并通过调用Dispatcher的方法来分发。
- **Dispatcher**：Dispatcher是Flux应用的中心枢纽。它接收来自Actions的动作，并且负责将这些动作转发给所有的Stores。在Flux中，有一个单一的Dispatcher实例负责管理所有的动作分发。
- **Stores**：Stores包含应用的状态和逻辑。它们监听来自Dispatcher的动作，根据这些动作来更新状态，然后通知视图组件状态已经改变。在Flux架构中，数据的逻辑处理和业务逻辑主要在Stores中进行。
- **Views**：视图是React组件，它们从Stores中读取状态，并且在状态变化时重新渲染。视图可以是React组件树中的顶层容器组件，也可以是嵌套的更深层的组件。当Store中的数据发生变化时，视图会响应这些变化并相应地更新UI。

**Flux的工作流程如下：**

1. 用户在视图层（View）发起操作（如点击按钮）。
2. 视图层触发Action（通常是一个函数调用），Action随后会被发送到Dispatcher。
3. Dispatcher接收到Action后，将其转发给注册了相应处理器的Store。
4. Store根据Action来更新其内部状态，然后发出一个"change"事件。
5. 视图监听到Store的变化，根据新的状态进行更新。

**Flux的优势：**

- **清晰的数据流向**：通过促进单向数据流，Flux使得应用的数据流动变得更加清晰和可预测。
- **解耦**：组件之间的通信更加解耦，因为状态变更都是通过中央Dispatcher进行协调的。
- **易于调试**：由于数据流是单向的，因此跟踪应用中的数据变化和调试变得更加容易。

Flux的概念和架构为React应用及其他单页面应用（SPA）提供了一种清晰的状态管理方案，特别是在处理复杂的数据流和多个组件间状态共享时。尽管Flux是一个架构模式而非具体的实现，但它已经激发了许多类似的实现和变种，例如Redux，它是基于Flux概念但提供了更严格的约束和更简洁的API。



### 什么是Redux？

Redux是一个用于JavaScript应用的可预测状态容器，尤其是在与React一起使用。它基于Flux架构的概念，但引入了一些关键的不同之处。通过提供单一的全局状态树（称为store），Redux让应用的状态变得可预测且易于管理。其设计哲学和核心原则包括**单一真实数据源、状态是只读的、以及通过纯函数来执行状态修改**，提高应用的可维护性和开发效率。

Redux的核心概念包括：

- **Store**：Store是保存整个应用状态的对象。在Redux中，整个应用只有一个store，它将应用的状态保存在一个对象树中。
- **Action**：Action是一个普通的JavaScript对象，用于描述发生了什么。每个action都有一个`type`属性，用于表示执行的操作类型。Action可以携带数据从应用传到store。
- **Reducer**：Reducer是一种特殊的函数，负责接收应用的当前状态和一个action，然后返回新的状态。它们是纯函数，不修改接收到的参数，也不执行有副作用的操作，如API调用和路由跳转。

Redux的工作流程：

1. **调用Action**：应用中的某个事件（如用户交互）触发了一个action的调用。
2. **分发Action**：使用Redux提供的`dispatch`函数将action发送到store。
3. **Reducer处理**：Store有一个或多个reducer函数，负责根据接收到的action类型来更新状态。
4. **更新Store**：Reducer计算出新的状态后，store会被更新。
5. **反映UI变化**：应用中订阅了store的组件会根据新的状态来更新自身的UI。

为什么使用Redux：

- **可预测性**：由于Redux使用纯函数（reducer）来执行所有状态更新，因此应用的状态变化变得可预测和透明。
- **维护性**：通过集中管理应用的状态，Redux使状态的变化和相关逻辑更加一致，易于理解和维护。
- **调试友好**：Redux支持时间旅行式的调试，可以让开发者通过撤销和重做的方式来检查应用的状态变化。
- **生态系统**：Redux拥有庞大的生态系统，提供了大量的中间件来支持日志记录、异步操作、持久化等功能。

尽管Redux在管理大型、复杂应用的状态方面非常有用，但它也引入了一定的复杂性和样板代码。因此，对于简单的应用，使用Redux之前应该权衡其带来的好处是否超过了额外的复杂性。



### Redux遵循的三个原则

1. 单一真实数据源（Single Source of Truth）

整个应用的状态存储在一个对象树中，并且这个对象树只存在于唯一一个store中。这意味着应用状态是集中在一个地方管理和存储的，从而使其成为应用中的单一“真实”来源。这样做的好处包括便于调试、状态持久化以及服务器端渲染。

2. 状态是只读的（State is Read-Only）

唯一改变状态的方法是触发action。Action是一个描述“发生了什么”的普通对象。这样做确保了视图或网络回调等不会直接修改状态，而是通过分发一个action来请求数据变化，保持了状态的一致性和可预测性。

3. 使用纯函数来执行修改（Changes are Made with Pure Functions）

为了指定状态树如何响应actions并发送到store，需要编写reducers。Reducers是纯函数，接收先前的状态和一个action作为参数，并返回一个新的状态。它们不直接修改状态，而是返回一个全新的状态对象。这保证了所有状态的更新都是可预测的和可追踪的。



### 单一事实来源的理解

单一真实数据源是指在整个应用中，状态（数据）被存储在一个单一的对象树内，并且这个状态树被放置在唯一的store中。这是Redux架构设计的核心原则之一，也是许多现代前端框架和状态管理库推崇的理念。

### 好处

- **可预测性**：由于所有的状态都保存在一个地方，状态的变化和流动变得更加可追踪和可预测。开发者可以轻松查看、修改和调试应用的状态，这对于维护大型应用尤其重要。
- **易于调试**：借助如Redux DevTools这样的工具，开发者可以观察到每一个状态的变化，甚至可以实现时间旅行调试，即回溯和重放用户的行为来查找和修复bug。
- **维护简单**：当应用的状态逻辑集中管理时，对状态的读写和监听变得统一和规范，减少了数据同步和传递的复杂性，使得代码更加清晰易懂。
- **便于持久化和服务器端渲染**：单一的状态树可以被序列化和反序列化，从而轻松地在客户端和服务器端之间同步状态，支持持久化存储和服务器端渲染（SSR）。

### 实践

在Redux中，单一真实数据源的实现是通过创建一个store来完成的。这个store负责维护整个应用的状态树。所有的状态更新都是通过派发（dispatching）action来触发的，然后通过reducer函数来根据旧的状态和action来生成新的状态。

例如，在一个Todo应用中，应用的整个状态，包括所有todo项、过滤条件和用户界面的状态，都保存在一个单一的JavaScript对象中。这意味着不管应用有多复杂，其状态都是集中在一处管理的。

```js
{
  todos: [{ id: 1, text: 'Learn Redux', completed: false }],
  visibilityFilter: 'SHOW_ALL'
}
```

这个状态对象就是单一真实数据源的体现。它是应用中所有状态的唯一来源，任何时候应用的UI都是这个状态树的直接反映。

理解和实践单一真实数据源原则，有助于开发出高效、可维护、可扩展的前端应用。

### react-redux 的组件

Redux本身是一个独立于UI框架的状态管理库，它提供了一套机制来帮助管理JavaScript应用的状态。在与React一起使用时，`react-redux`库提供了几个关键的组件和hooks来连接React组件和Redux store，使得状态管理更加便捷和高效。以下是`react-redux`提供的主要组件和hooks：

组件

- **`<Provider>`**: 这个组件使得Redux store能够被应用中的组件树中的连接（connect）组件访问。通常，你会在应用的最顶层使用`<Provider>`包裹整个应用，将store作为prop传递给`<Provider>`，这样应用中的任何组件都可以访问到Redux store。

Hooks

- **`useSelector`**: 这个hook允许你从Redux store中提取数据。可以使用任何选择器函数来选择想要的store中的部分数据。`useSelector`会订阅store，一旦选择的数据部分发生变化，组件就会重新渲染。
- **`useDispatch`**: 这个hook提供了dispatch函数，允许在组件中分发action。通过`useDispatch`，可以触发状态更新和逻辑处理。

高阶组件（Higher Order Component, HOC）

- **`connect()`**: 这是一个高阶组件（HOC），用于将React组件连接到Redux store。通过`connect`，可以指定哪些状态和动作应该映射到组件的props上。`connect`接收两个主要参数：`mapStateToProps`和`mapDispatchToProps`。`mapStateToProps`是一个函数，用于指定如何将store中的状态映射到组件的props上；`mapDispatchToProps`是一个函数或对象，用于将分发action的函数映射到组件的props上。

示例代码

下面是一个简单的示例，展示了如何在React组件中使用`<Provider>`, `useSelector`, 和`useDispatch`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

const CounterComponent = () => {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <CounterComponent />
  </Provider>,
  document.getElementById('root')
);
```

在这个示例中，`<Provider>`使得Redux store在应用中的所有组件都可用，`CounterComponent`通过`useSelector`和`useDispatch`与store进行交互。

`react-redux`通过这些组件和hooks简化了React组件与Redux store的连接过程，使得开发者可以更加专注于业务逻辑的实现。

### 数据如何通过 Redux 流动

在Redux中，数据流遵循一个明确的单向流动模式，这个模式使得状态管理变得可预测和容易理解。数据流的单向循环流程包括以下几个步骤：

1. 触发Action

数据流的起点是视图层（通常是用户界面）。当用户与界面交互（例如点击按钮、提交表单等）时，这些交互会触发一个action。Action是一个简单的JavaScript对象，描述了发生了什么事情（例如用户的点击事件），并且可以携带一些数据（称为payload）。

```
// Action示例
{ type: 'ADD_TODO', payload: { text: 'Learn Redux' } }
```

2. 分发Action

通过store提供的`dispatch`方法，应用会将action发送到Redux store。`dispatch`函数负责将action传递给store。

```
store.dispatch({ type: 'ADD_TODO', payload: { text: 'Learn Redux' } });
```

3. Reducer处理Action

Store收到action后，会将当前的state和该action一同发送给reducer。Reducer是一个纯函数，它根据action的类型来更新状态，返回一个新的state。重要的是，reducer不会修改原始状态；它会根据原始状态和action计算出新状态，并返回这个新状态。

```
function todoReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    default:
      return state;
  }
}
```

4. 更新Store

Reducer返回新的状态后，Redux store会用这个新状态替换旧的状态。这个过程是同步的，一旦reducer返回新状态，store的更新就会立即发生。

5. 视图响应状态变化

当store的状态更新后，与Redux store连接的React组件（通过`react-redux`的`connect`函数或`useSelector` hook）会自动获取新的状态数据。这些组件会根据新的状态重新渲染，反映出最新的数据。

```
const todoItems = useSelector(state => state.todos);
```



### 如何在 Redux 中定义 Action

正确地定义和使用Action是实现有效状态管理的关键。以下是在Redux中定义Action的基本步骤和最佳实践：

1. 定义Action类型

首先，定义一些字符串常量来表示Action的类型。这些常量帮助避免在编写reducer和分发Action时出现拼写错误。通常，这些常量会被定义在一个单独的文件中，例如`actionTypes.js`。

```js
// actionTypes.js
export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
```

2. 创建Action构造函数（Action Creators）

Action构造函数，通常称为Action creators，是返回Action对象的函数。使用Action构造函数而不是直接在代码中编写Action对象有几个好处，包括更好的可读性、易于测试和重用。

```js
// actions.js
import { ADD_TODO, REMOVE_TODO } from './actionTypes';

// Action creator for adding a todo
export function addTodo(text) {
  return { type: ADD_TODO, payload: { text } };
}

// Action creator for removing a todo
export function removeTodo(id) {
  return { type: REMOVE_TODO, payload: { id } };
}
```

3. 分发Action

在应用的某个地方（如React组件中），可以通过Redux的`dispatch`函数使用这些Action构造函数来分发Action。如果使用的是React-Redux，可以通过`useDispatch` hook或`connect`高阶组件来获取`dispatch`函数。

```jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from './actions';

function TodoAddButton({ todoText }) {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(addTodo(todoText))}>
      Add Todo
    </button>
  );
}
```

最佳实践

- **使用常量代替字符串字面量**：这有助于避免因为拼写错误导致的bug，并且使得重构更加容易。
- **使用Action构造函数**：这使得创建Action更加一致，并且易于测试。
- **避免在Action中传递过多的数据**：只包含执行更新所需的最少量的信息。
- **遵循Flux Standard Action (FSA)约定（可选）**：这是一个建议的Action对象结构，包括一个`type`属性，一个可选的`error`属性，以及一个可选的`payload`属性。遵循FSA可以使得Action更加规范化和易于使用。





### Reducer 的作用

作用是指定应用状态的变化如何响应actions并发送到store的过程。Reducer是纯函数，它接收当前状态和一个action作为参数，然后返回新的状态。在Redux中，所有的状态更新逻辑都在Reducer中完成。

Reducer的主要特点和作用包括：

- **指定状态变化**：Reducer根据接收到的action的类型（通常是action中的`type`字段）来决定如何更新状态。不同类型的action会引起状态的不同变化。
- **是纯函数**：Reducer函数必须是纯函数，这意味着给定相同的输入（当前状态和action），它必须返回相同的输出（新状态），并且不产生任何副作用。Reducer不会修改传入的状态参数，而是返回一个全新的状态对象。
- **管理应用的部分状态**：虽然整个应用只有一个store，但是可以有多个Reducer，每个Reducer通常只负责管理应用状态树的一部分。通过使用Redux提供的`combineReducers`函数，可以将多个Reducer合并成一个根Reducer，这个根Reducer将负责更新整个应用的状态树。
- **初始化状态**：在应用启动时，Redux会分发一个初始化的action（如`{ type: '@@redux/INIT'}`），Reducer可以通过处理这个action来设置应用的初始状态。
- **处理不相关的action**：如果Reducer接收到一个它不关心的action（即，Reducer不需要根据该action来更新状态），它应该返回当前的状态，而不是一个新的状态对象。

### 示例

下面是一个简单的Reducer示例，它管理着一个计数器的状态：

```js
const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      // 如果当前Reducer不关心这个action，返回原来的状态
      return state;
  }
}
```

在这个示例中，`counterReducer`根据接收到的action类型来决定如何更新`count`状态。如果action类型是`INCREMENT`，则将`count`加1；如果是`DECREMENT`，则将`count`减1；如果action类型不是Reducer关心的，它将返回当前状态，表示状态没有变化。





### Redux与Flux有何不同

Redux和Flux都是JavaScript应用的状态管理方案，尽管它们在设计理念上有共同之处（如单向数据流），但在实现细节和架构上存在一些关键的不同。

**Flux**

Flux是由Facebook提出的一个应用**架构**，用于构建客户端Web应用。**它更多的是一种模式而非具体的库实现。**Flux应用的核心特点包括：

- **Dispatcher**：应用中有一个单一的dispatcher，所有的Actions都会经过这个Dispatcher。
- **Stores**：负责存储状态和逻辑的容器。在Flux架构中，可以有多个Store，每个Store负责管理应用状态的一个特定部分。
- **Views**：通常是React组件，从Stores中读取状态，并随状态更新而重新渲染。
- **Actions**：是触发状态变化的信息载体。在Flux中，视图（View）不直接与Store交互，而是通过分发（dispatching）Action来请求数据变化。

Flux的特点是强调了一个单向的数据流，使得应用架构变得清晰和可预测。然而，Flux本身并没有严格的规范，不同的实现之间可能会有所不同。

**Redux**

Redux是由Dan Abramov和Andrew Clark创建的，受Flux架构的启发但简化了很多概念，并增加了一些自己的特色：

- **单一真实数据源**：Redux使用单一的store来存储整个应用的状态。这使得状态的管理变得更加一致和易于调试，特别是配合时间旅行等调试工具时。
- **状态是只读的**：唯一改变状态的方式是触发action。
- **使用纯函数执行修改**：为了指定状态树是如何由actions转换的，需要编写reducers。Reducers是纯函数，它们接收先前的状态和一个action，并返回新的状态。

**主要差异**

- **Store的数量**：Flux允许有多个Store；Redux建议有一个单一的Store。
- **Reducer和Dispatcher**：Flux有一个Dispatcher来控制action的分发，每个Store根据需要自己处理action。Redux没有Dispatcher的概念，而是通过Reducer函数来处理所有action，Reducer负责根据action更新状态。

**选择依据**

- 如果你的应用状态管理非常复杂，需要更多的灵活性和分散的状态管理，Flux可能是一个好选择。
- 如果你倾向于有一个集中的状态管理，以及更简单的数据流和更强大的调试能力，Redux可能更适合你。



### Redux 优点与缺点

**Redux的优点**

1. **可预测性**：Redux通过使用单一状态树（store）和纯函数（reducers）来管理状态，使得状态的变化变得可预测和一致。
2. **维护性**：通过集中管理状态，Redux使得状态更易于调试和追踪。特别是配合Redux DevTools，开发者可以轻松跟踪每一个状态的变化、进行时间旅行调试等。
3. **灵活性**：Redux本身非常灵活，可以与任何UI层库或框架一起使用（尽管它最常与React一起使用）。
4. **生态系统和中间件**：Redux有一个庞大的生态系统，提供了大量的中间件来支持各种需求，比如处理异步操作、日志记录等。
5. **社区支持**：Redux享有强大的社区支持，有大量的教程、工具和中间件可供选择，这使得解决问题和学习变得容易。
6. **服务器端渲染**：Redux支持服务器端渲染，可以很容易地同步服务器端和客户端之间的状态。

**Redux的缺点**

1. **复杂性**：对于小型项目或简单应用来说，Redux可能会增加不必要的复杂性和样板代码。
2. **学习曲线**：Redux的概念和架构（如actions、reducers、middlewares）需要一定时间来学习和理解，对于新手来说可能会有一定的挑战。
3. **冗余代码**：使用Redux可能会导致编写大量的冗余代码，比如action类型、action创建函数、reducers等。
4. **性能考虑**：虽然通常不是问题，但在处理大量数据或高频更新时，Redux可能需要优化来避免性能瓶颈。
5. **过度集中化**：Redux采用单一状态树，对于一些需要将状态更分散管理的应用来说，这可能不是最佳选择。

总的来说，Redux在管理大型、复杂应用的状态时表现出色，提供了高度的可预测性和灵活性。然而，它也可能为小型或简单应用引入不必要的复杂性。选择使用Redux应基于项目的具体需求、团队的经验以及对复杂性的可接受程度进行综合考虑。



### 手写极简版Redux

```js
function createStore(reducer){
	let state;
    const listeners = [];
    
    function getState(){
        return state;
    }
    
    function subscribe(listener){
        listeners.push(listener)
        return ()=>{
            const listenerIndex = listeners.indexOf(listener)
            listeners.splice(listenerIndex,1)
        }
    }
    
    function dispatch(action){
        state = reducer(state,action)
        listeners.forEach((l)=>{ l() })
    }
    
    dispatch({type:"@@redux/init"})
    
    return {
        getState,
        subscribe,
        dispatch
    }
}

export default createStore
```



### redux中间件的理解，以及用过哪些中间件

Redux中间件是一种强大的功能，允许开发者在action被发送到store之前拦截它们。中间件提供了一个第三方扩展点，用于增强Redux的功能，比如处理异步操作、日志记录、错误报告等。中间件可以对进入的actions进行修改、延迟、替换或者在它们到达reducer之前完全忽略它们。

**理解Redux中间件**

中间件的工作原理是在action和reducer之间提供一个中间层，这个中间层可以访问到action和当前的store状态，以及dispatch函数本身，因此它可以根据需要修改action或者根据action的内容来触发更多的action。中间件的基本结构如下：

```js
const middleware = store => next => action => {
  // 你的中间件逻辑
  return next(action);
};
```

这里的`store`提供了`dispatch`和`getState`方法，`next`是调用链中的下一个中间件的dispatch函数，`action`是当前处理的action对象。

**常用的Redux中间件**

- **redux-thunk**: 允许编写返回函数而非action对象的action创建者。这个函数可以被延迟执行，并且可以包含有副作用的逻辑（如异步请求）。`redux-thunk`是处理异步逻辑的简单方式。
- **redux-saga**: 是一个更为强大的中间件，用于处理应用的副作用（如异步数据获取、浏览器缓存等）。它使用了ES6的Generators来让异步流程更易于读取、写入和测试。
- **redux-logger**: 提供日志记录功能，能够在控制台打印出每个action以及对应的前后状态，非常有助于开发调试。
- **redux-promise**: 允许dispatch一个Promise为payload的action。如果这个Promise被resolve，它会重新dispatch一个action来将Promise的结果作为payload，这简化了异步流程的处理。
- **redux-observable**: 使用RxJS Observables来处理和组合异步行为和更多复杂的异步流程。它允许开发者以声明式的方式组合和取消异步操作。

**使用中间件的好处**

使用中间件的主要好处是增强Redux的功能和灵活性，特别是在处理异步操作、日志记录、异常报告等方面。它们使得这些任务的实现变得既简单又统一，而且不会让这些副作用逻辑侵入到业务逻辑或UI组件中，有助于保持应用的清晰和可维护性。

选择哪个中间件取决于具体的项目需求和开发团队的偏好。例如，对于简单的异步数据请求，`redux-thunk`可能就足够了；而对于需要管理复杂异步流程的大型项目，`redux-saga`或`redux-observable`可能更合适



### redux和vuex的区别

Redux和Vuex都是状态管理库，分别用于React和Vue.js框架。虽然它们在设计哲学和功能上有许多相似之处，但也存在一些关键的区别，主要由于它们服务于不同的框架生态系统。以下是Redux和Vuex之间的一些主要区别：

**设计哲学和模式**

- **Redux** 倾向于采用函数式编程范式。它使用纯函数（reducers）来处理状态变化，强调不可变性和单向数据流。
- **Vuex** 与Vue.js的响应式系统集成。它利用了Vue.js的响应式机制来更新UI，通过mutations来同步修改状态，而actions处理异步操作。

**状态管理**

- **Redux** 使用单一的store来管理状态，并通过reducers来更新状态，所有的状态变化都是可预测的和可追踪的。
- **Vuex** 也使用单一状态树，但它提供了更多内置的概念和工具，如mutations、actions和getters，这些都是特定于Vuex的状态更新方式。

**异步操作**

- **Redux** 需要使用中间件（如redux-thunk、redux-saga）来处理异步操作和副作用。
- **Vuex** 内置了对异步操作的支持，通过actions来处理异步任务，而mutations总是同步变更状态。

**使用场景**

- **Redux** 可以独立于React之外使用，虽然它最常与React一起使用。它的设计和实现更加通用，可以应用于任何遵循单向数据流的JavaScript应用。
- **Vuex** 是专门为Vue.js设计的，深度集成了Vue.js的响应式系统。它的使用和概念是为了更好地配合Vue.js的工作方式。

**学习曲线**

- **Redux** 的概念相对抽象，如纯函数、不可变性、中间件等，这可能会使得初学者面对较高的学习曲线。
- **Vuex** 的学习曲线通常被认为比Redux更平缓，特别是对于已经熟悉Vue.js的开发者来说，因为它更紧密地与Vue.js的设计和模式相结合。







### 为什么不能在循环，条件判断或者嵌套函数中使用hook？

在 React 中，Hook 的调用顺序必须**在每次组件渲染时保持完全一致**，这是 React 内部通过链表结构管理 Hook 状态的核心机制。如果 Hook 出现在循环、条件或嵌套函数中，可能会导致调用顺序变化，从而引发状态错乱。

例如：

- 第一次渲染调用 `useState(1)` → `useEffect(...)` → `useState('a')`
- 第二次渲染调用 `useEffect(...)` → `useState(1)`（顺序变化）
  此时 React 会认为第二个 Hook 应该是 `useState(1)`，但实际是 `useEffect`，导致状态错乱。



#### **场景 1：条件判断中使用 Hook**

```jsx
function BadComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null); // ❌ 条件内调用 Hook
  }
  const [theme, setTheme] = useState('light'); 
  // 当 isLoggedIn 变化时，Hook 顺序会变化！
}
```

**错误原因**：当 `isLoggedIn` 从 `true` 变为 `false` 时，第一个 `useState` 被跳过，导致 `theme` 对应的 Hook 错位到第一个位置，与 React 预期不符。

#### **场景 2：循环中使用 Hook**

```jsx
function BadListComponent({ items }) {
  for (let i = 0; i < items.length; i++) {
    const [itemState, setItemState] = useState(null); // ❌ 循环内调用 Hook
  }
  // 循环次数变化时，Hook 数量变化，顺序必然错乱
}
```

**错误原因**：循环次数动态变化时，Hook 数量会改变。例如，第一次渲染循环 3 次（3 个 `useState`），第二次循环 2 次，此时 React 期望第三个 Hook 存在，但实际已被移除。

#### **场景 3：嵌套函数中使用 Hook**

```jsx
function BadNestedComponent() {
  const handleClick = () => {
    const [count, setCount] = useState(0); // ❌ 嵌套函数内调用 Hook
  };
  // ...
}
```

**错误原因**：嵌套函数可能不会在每次渲染时被调用（如事件处理函数），导致 Hook 的调用顺序不稳定。



#### **正确的做法**

所有 Hook 必须直接声明在**函数组件的顶层作用域**，且无条件、循环、嵌套的干扰：

**正确代码示例**

```jsx
function GoodComponent({ isLoggedIn }) {
  // ✅ 所有 Hook 在顶层调用
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); 

  if (isLoggedIn) {
    // 可以在条件中使用 Hook 返回的值，但不能声明 Hook
    return <div>Welcome, {user.name}</div>;
  }
}
```

------

#### **4. 如何绕过限制？**

若需要在条件或循环中使用状态，可以通过以下方式：

**方案 1：拆分组件**

```jsx
function Item({ item }) {
  const [itemState, setItemState] = useState(null); // ✅ 在子组件中安全使用
  return <div>{itemState}</div>;
}

function GoodListComponent({ items }) {
  return items.map((item) => <Item key={item.id} item={item} />);
}
```

**方案 2：使用 Hook 的返回值控制逻辑**

```jsx
function GoodConditionalComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // 通过变量或 useEffect 控制逻辑，而不是条件中声明 Hook
  useEffect(() => {
    if (isLoggedIn) fetchUser().then(setUser);
  }, [isLoggedIn]);
}
```

------

#### **5. 底层原理**

React 通过链表结构按顺序记录 Hook 的状态：

```jsx
// 伪代码：React 内部记录 Hook 的顺序
let hooks = [];
let currentHook = 0;

function useState(initialValue) {
  hooks[currentHook] = hooks[currentHook] || initialValue;
  const setState = (newValue) => { /* 更新逻辑 */ };
  return [hooks[currentHook++], setState];
}

// 组件渲染时，currentHook 会被重置为 0
```

如果 Hook 的调用顺序变化（如条件跳过某个 Hook），`currentHook` 的递增顺序会被打乱，导致状态错位。



因为hook底层是一个单链表，那单链表到底长什么样子？它是如何存储？存储在哪里的？

根据React的实现方式，Hook链表是单链表，每个Hook节点有一个指向下一个Hook的指针，这样在组件渲染时按顺序遍历。且每个函数组件的 Hook 链表与其对应的 Fiber 节点（React 内部用于描述组件树的数据结构）关联。



### **Hook 链表的具体结构**

#### **链表类型：单链表**

React 使用**单向链表**（单链表）来按顺序存储组件中的所有 Hook。每个 Hook 节点包含以下关键属性：

- **`memoizedState`**：保存该 Hook 的当前状态（如 `useState` 的值、`useEffect` 的依赖等）。
- **`next`**：指向下一个 Hook 节点的指针。
- **`queue`**（仅状态类 Hook）：保存更新队列（如 `useState` 的 `setState` 触发的更新）。

```ts
// 伪代码：Hook 节点的简化结构
interface Hook {
  memoizedState: any;      // 当前状态值
  baseState: any;          // 基础状态（用于计算更新）
  queue: UpdateQueue<any>; // 更新队列（如 setState 的更新）
  next: Hook | null;       // 指向下一个 Hook
}
```

#### **链表工作原理**

- **首次渲染**：组件第一次调用 Hook 时，React 按调用顺序创建 Hook 节点，并链接成单链表。
- **后续渲染**：组件再次渲染时，React 按相同顺序遍历链表，复用或更新每个 Hook 节点的状态。



#### **Hook 链表如何与组件关联？**

React 通过 **Fiber 架构** 管理组件树，每个函数组件对应一个 Fiber 节点。Fiber 节点中有一个 `memoizedState` 字段，专门指向该组件的 Hook 链表。

**关联过程**

1. **组件首次渲染**：
   - 调用函数组件，执行其中的 Hook（如 `useState`, `useEffect`）。
   - React 按调用顺序创建 Hook 节点，形成单链表，并将链表头存入 `Fiber.memoizedState`。

```ts
// 伪代码：首次渲染时构建 Hook 链表
function renderComponent(Component) {
  const fiber = createFiber();
  let hook1 = createHook(initialState1); // 第一个 Hook（如 useState）
  let hook2 = createHook(initialState2); // 第二个 Hook（如 useEffect）
  hook1.next = hook2;
  fiber.memoizedState = hook1; // 链表头
  return fiber;
}
```

2. **组件后续渲染**：

- 重新执行函数组件，按相同顺序调用 Hook。
- React 从 `Fiber.memoizedState` 取出链表，逐个比对 Hook 节点，更新状态。

```js
// 伪代码：后续渲染时复用 Hook 链表
function updateComponent(fiber) {
  let currentHook = fiber.memoizedState; // 从链表头开始
  const hook1 = currentHook;
  updateHookState(hook1); // 处理第一个 Hook
  currentHook = hook1.next;
  const hook2 = currentHook;
  updateHookState(hook2); // 处理第二个 Hook
  // ...
}
```

------

**3. 关键问题：为什么顺序必须一致？**

- **单链表的顺序依赖性**：由于 Hook 链表是单链表，React 只能通过 `next` 指针按顺序访问节点。
- **状态匹配机制**：若两次渲染的 Hook 调用顺序不同，React 会错误地将第二个 Hook 的状态赋值给第一个 Hook，导致数据错乱。

**错误示例**

```jsx
function BuggyComponent({ cond }) {
  if (cond) {
    const [a, setA] = useState(1); // Hook1
  }
  const [b, setB] = useState(2);   // Hook2
}
```

- **首次渲染（`cond=true`）**：链表为 `Hook1 → Hook2`。
- **第二次渲染（`cond=false`）**：Hook1 被跳过，链表应为 `Hook2`，但 React 仍期望链表顺序为 `Hook1 → Hook2`，导致 `Hook2` 错误地复用 `Hook1` 的状态。



2. 为什么hook出现后，函数组件就可以定义自己的state了，

在hook（在react16.8这个版本）出现之前的react当中

如果说想定义组件状态值，只能用这个类组件，没法用函数组件

但是hook出现之后就可以了，那为什么

useState，useReduce这种API







### React和Vue的diff算法的不同与相同

React 和 Vue 的 Diff 算法在核心目标上一致（高效更新 DOM），但实现策略和优化手段有所不同。

------

#### **相同点**

1. **同层比较（层级差异最小化）**
   两者都采用分层比较策略，只对比同一层级的节点，避免跨层级遍历，减少复杂度。若节点跨层移动，直接销毁重建，而非复用。
2. **依赖 `key` 优化列表渲染**
   使用 `key` 标识节点身份，在列表更新时尽可能复用节点，减少不必要的 DOM 操作。若未提供 `key`，默认按顺序对比，可能导致性能问题。
3. **基于虚拟 DOM**
   均通过虚拟 DOM 的差异计算（Diff）生成最小化的 DOM 更新操作，提升渲染效率。

------

#### **不同点**

1. **对比策略**

   - **React（单向双指针）**
     采用**递归双指针对比**，逐个比较新旧子节点。若节点类型不同（如 `<div>` 变为 `<span>`），直接销毁子树并重建。对于列表，若未用 `key`，顺序变化可能导致大量节点重新创建（如头部插入时性能差）。

   - **Vue（双端四指针）**
     使用**双端对比算法**，同时从新旧子节点的头部和尾部向中间移动，优先处理相同节点（如首尾相同则直接复用），减少节点移动次数。对列表中间插入或删除的场景更高效。

     React 和 Vue 的 Diff 算法在对比策略上的核心差异源于其设计目标和优化方向的不同。以下是两者对比策略的详细分析，涵盖具体步骤、优化逻辑及场景示例：

     **React 的对比策略（单向递归双指针）**

     **核心机制**

     - **递归逐层对比**：从根节点开始，递归遍历新旧虚拟 DOM 树的每一层。
     - **双指针顺序比对**：在同一层级内，按顺序逐个比较新旧子节点（旧子节点集合和新子节点集合各有一个指针，从左到右移动）。

     **具体步骤**

     1. **类型不同则销毁重建**：

        - 若新旧节点类型不同（如 `<div>` → `<span>`），直接销毁旧节点及其子树，创建新节点。

     2. **类型相同则更新属性**：

        - 若节点类型相同（如 `<div>` → `<div>`），更新其属性和子节点，递归对比子树。

     3. **列表对比（无 `key`）**：

        - 未使用 `key` 时，默认按索引顺序对比新旧子节点。若顺序变化（如头部插入），会导致后续所有节点被视为不同，触发重建。

        - **示例**：

          ```jsx
          // 旧列表
          [<div>A</div>, <div>B</div>, <div>C</div>]  
          // 新列表（头部插入）
          [<div>D</div>, <div>A</div>, <div>B</div>, <div>C</div>]  
          ```

          React 会认为索引 0 的节点从 `A` 变为 `D`，索引 1 的 `B` 变为 `A`，依此类推，导致所有节点被重新创建。

     4. **列表对比（有 `key`）**：

        - 通过 `key` 匹配新旧节点，复用可复用的节点，减少 DOM 操作。

        - **示例**：

          ```jsx
          // 旧列表（key 为 id）
          [<div key="1">A</div>, <div key="2">B</div>]  
          // 新列表（key 为 id，逆序）
          [<div key="2">B</div>, <div key="1">A</div>]  
          ```

          React 通过 `key` 识别节点身份，仅移动 DOM 元素位置，无需重新创建。

        #### **性能瓶颈**

        - **头部插入列表**：无 `key` 时性能极差，时间复杂度接近 O(n)。
        - **跨层级移动节点**：直接销毁重建，无法复用。

   **Vue 的对比策略（双端四指针）**

   **核心机制**

   - **双端对比**：同时从新旧子节点列表的头部和尾部向中间移动，共使用四个指针：
     - 旧头指针（`oldStartIdx`）和旧尾指针（`oldEndIdx`）。
     - 新头指针（`newStartIdx`）和新尾指针（`newEndIdx`）。
   - **优先处理稳定节点**：优先对比头尾相同节点，减少中间节点的移动次数。

   **具体步骤**

   1. **头头对比**：
      比较新旧头指针指向的节点，若相同则复用，头指针右移。
   2. **尾尾对比**：
      比较新旧尾指针指向的节点，若相同则复用，尾指针左移。
   3. **旧头与新尾对比**：
      若旧头节点与新尾节点相同，复用节点并移动到旧尾之后，旧头指针右移，新尾指针左移。
   4. **旧尾与新头对比**：
      若旧尾节点与新头节点相同，复用节点并插入到旧头之前，旧尾指针左移，新头指针右移。
   5. **剩余节点处理**：
      若以上均不匹配，尝试通过 `key` 查找可复用的节点：
      - 建立新节点 `key` 到索引的映射表。
      - 查找旧节点中是否存在相同 `key` 的节点，若存在则复用并移动位置。
      - 若无匹配，创建新节点。

   - **减少 DOM 移动次数**：优先处理头尾稳定节点，避免中间节点频繁移动。
   - **高效处理列表中间操作**：
     **示例**：在列表中间插入新元素时，双端对比能快速定位可复用节点，仅插入新增节点。

   

   **关键设计思想差异**

   - **React**：追求算法通用性，通过递归实现简单可靠的对比逻辑，依赖 `key` 和开发者优化提升性能。
   - **Vue**：针对常见 DOM 操作场景（如列表头尾增删）优化，通过双端对比和编译时标记减少运行时计算量。

   #### **列表反转**

   ```
   // 旧列表：[A, B, C, D]
   // 新列表：[D, C, B, A]
   ```

   - **React（无 key）**：按索引对比，认为 A→D、B→C 不同，全部重新创建。
   - **React（有 key）**：通过 `key` 匹配，仅移动 DOM 节点位置。
   - **Vue**：通过头尾对比，快速发现头尾节点相同，仅移动中间节点，性能更优。

2. **编译优化**

   - **Vue**
     在编译阶段对模板进行静态分析，标记静态节点和动态绑定。Diff 时跳过静态子树对比，直接复用，显著减少计算量。
     *示例：模板中的静态 `<div>Hello</div>` 会被缓存，避免重复 Diff。*
   - **React（JSX 动态生成）**
     无编译时优化，依赖运行时优化（如 `React.memo`、`shouldComponentUpdate`）。灵活性更高，但需开发者手动控制更新。

3. **更新粒度与响应式机制**

   - **Vue**
     基于响应式系统，数据变化时精准定位依赖组件，触发组件级更新。结合 `key` 和双端对比，减少不必要的子树 Diff。
   - **React**
     状态变化默认触发组件及其子树的重新渲染（除非手动优化）。通过 Fiber 架构实现可中断的异步渲染，但 Diff 过程仍可能遍历较大范围。

4. **处理动态内容的策略**

   - **Vue**
     对动态绑定（如 `v-if`、`v-for`）有更细粒度的编译优化。例如，`v-for` 生成的列表会优先复用相同 `key` 的节点，并高效移动位置。
   - **React**
     依赖开发者合理使用 `key` 和状态管理（如 `useMemo`）优化性能。在复杂列表场景中，手动优化成本较高。

------

#### **回答示例**

“React 和 Vue 的 Diff 算法都基于虚拟 DOM 和同层比较，通过 `key` 优化列表渲染。不同点在于：

1. **对比策略**：React 使用单向递归对比，而 Vue 采用双端对比，后者对列表中间操作更高效。
2. **编译优化**：Vue 在编译阶段标记静态节点，Diff 时跳过它们；React 依赖运行时优化。
3. **更新粒度**：Vue 的响应式系统精准定位变化，React 默认重新渲染子树，需手动控制。
4. **列表处理**：Vue 的双端对比减少节点移动次数，React 的顺序对比在无 `key` 时性能较差。”

------

#### **补充：场景举例**

- **列表头部插入**
  Vue 通过双端对比复用尾部节点，React 若未用 `key` 会重建所有节点。
- **组件树更新**
  Vue 跳过静态子树，React 需通过 `React.memo` 避免子组件重复渲染。

通过理解这些差异，开发者能更好地利用框架特性进行性能优化。



不同的地方在于react它是单向查找

而Vue它是双向查找

听起来双向查找好像更快一些

react为什么不用双向查找

而他选择了单向查找

你说就要实现双向查找行不行

也不是不行

但是这个后面的原因



在这里先大概解释一下

因为react当中它的VDOM存储

或者就直接叫fiber

它的是一个单列表的结构

带链表的结构

想进行双向查找

这个就很难实现



但你说那我就要双向

那我存成这个双向链表不可以吗

也行

但是这个成本上又提高

就是在目前的这个测试下

react的这个单向查找

性能也是不错的

所以目前react就没有去实现这个双向查找



但是Vue的话相对来说它不是链表存储

它是数组

它的子节点就是数组

数组的话

想双向查找很简单





第三点优化一些项目



举一些常见的能够解决快这些事情的例子

比如说合理的去使用一些缓存

然后尽量的去避免一些无效的渲染



去提升一些这个项目性能

再比如说加上一些这个懒加载



那具体到背后的API

你比如说我们要保证这个取值的稳定性

就是key的取值的稳定性

review当中我们都有这个key的取值

我们要尽量就是要保证它的这个稳定性

还要适时的去使用一些缓存相关的API

还有这个状态管理该怎么去选择

还有effect我们这个怎么去使用



这都是react背后的一些问题和

那如果说你对他不了解

可能导致了一些问题

可能自己也不知道

因为有些问题它并不会直接出现bug

就像你的说我这个key值对吧

我直接用一个index行不行

有些情况下是可以的

有些情况下

你比如说呃涉及到这个动态值的改变

那诶那它就好像也没出现bug对吧

但是其实背后这很多的组件

它有没有达到一个复用

就是你的页面看起来就只是慢

但是他又不出错

所以这个时候如果说你不知道背后的原因的话

那就真的是页面慢

但是又不知道为什么
