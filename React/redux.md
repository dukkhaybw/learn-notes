# Redux

## 纯原生基本使用

redux源码的本质是发布订阅模式。subscribe方法接受函数（订阅函数），当dispatch(action)的时，内部会将上一次的state和本次的action传给reducer函数进行执行，将reducer返回的函数更新为新的state，然后再取出之前subscribe方法订阅好的函数进行执行。

仓库对象提供的核心方法：

- getState
- subscribe
- dispatch



html

```html
<div>
    <p id="counter">0</p>
    <button id="add-button">+</button>
    <button id="minus-button">-</button>
</div>
```



js

```js
import { createStore } from 'redux';

const counter = document.getElementById('counter');
const addButton = document.getElementById('add-button');
const minusButton = document.getElementById('minus-button');

// 动作类型
const ADD = 'ADD';
const MINUS = 'MINUS';

//初始状态数据
const initState = { number: 0 };

function reducer(state = initState, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 };
    case MINUS:
      return { number: state.number - 1 };
    default:
      return state;
  }
}

// 创建仓库
const store = createStore(reducer);

function render() {
  counter.innerText = store.getState().number;
} 

render();
store.subscribe(()=>{
  render()
});
addButton.addEventListener('click', function () {
  store.dispatch({ type: ADD });
});
minusButton.addEventListener('click', function () {
  store.dispatch({ type: MINUS });
});
```





## 核心实现

```js
function createStore(reducer){
    let state;
    const listeners = [];

    function getState(){
        return state;
    }

    function subscribe(listener){
        listeners.push(listener)
        // 返回卸载监听函数
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



## 结合react使用

```jsx
// 动作类型
const ADD = 'ADD';
const MINUS = 'MINUS';

//初始状态数据
const initState = { number: 0 };

function reducer(state = initState, action) {
    switch (action.type) {
        case ADD:
            return { number: state.number + 1 };
        case MINUS:
            return { number: state.number - 1 };
        default:
            return state;
    }
}

const store = createStore(reducer);

class Counter extends React.Component{
    constructor(props){
        super(props)
        // 将store中的数据映射为组件的state
        this.state = {number:store.getState().number}
    }

    componentDidMount(){
        // 注册一旦store数据更新就会执行的触发组件重新渲染的回调函数
        this.unsubscribe = store.subscribe(()=>{
            this.setState({number:store.getState().number})
        })
    }

    componentWillUnmount(){
        // 组件销毁时卸载之前注册的触发组件重新渲染的方法
        this.unsubscribe()
    }

    render(){
        <div>
            <p>{this.state.number}</p>
            <button onClick={()=>store.dispatch({type:ADD})}>+</button>
            <button onClick={()=>store.dispatch({type:MINUS})}>-</button>
        </div>
    }
}
```



## 优化

- 将action的创建交给函数调用返回
- 将action生成函数传递一个函数bindActionCreators，该函数中将action生成器函数包装为store.dispatch(actionCreater)}

```jsx
 function add (){
     return {type:ADD}
 }

 function minus (){
     return {type:MINUS}
 }

const actionCreators = {add,minus}
const boundActionCreators = bindActionCreators(actionCreators, store.dispatch)

<button onClick={boundActionCreators.add}>+</button>
```



## redux工具方法实现

```js
function bindActionCreators(actionCreators,dispatch){
    const boundActionCreators ={}
   	
    for(const key in actionCreators){
        boundActionCreators[key] = function(...args){
            dispatch(actionCreators[key](...args))
        }
    }
    
    return boundActionCreators
}

export default bindActionCreators
```



- 合并多个reducer

  当UI派发一个动作action之后，redux源码中不知道这个动作具体会命中哪个reducer中的type，所以会全部循环一边所有的reducer并将state和action传递过去，所以如果多个reducer中都有同一个type类型，都会被触发修改（这是redux库这么设计的）。

  ```js
  function combineReducers(reducers){
      // 这个combination函数就会被传递给下面的createStore
      return function combination(state={},action){
          let nextState ={}
          for(let key in reducers){
              nextState[key]  = reducers[key](state[key],action)
              // 看似没有state[key] = nextState[key]这行代码，但是实际更新后的state被存放在了外层函数中了
          }
          return nextState
      }
  }
  
  export default combineReducers
  
  
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




```js
import React from 'react';
import { bindActionCreators } from 'redux';
import store from '@/store';
import actionCreators from '@/store/actionCreators/counter1';
const boundActionCreators = bindActionCreators(actionCreators, store.dispatch);
//boundActionCreators={add:()=>dispatch({ type: ADD }),minus}
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: store.getState().counter1.number };
  }
    
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.setState({
      number: store.getState().counter1.number
    }));
  }
    
  componentWillUnmount() {
    this.unsubscribe();
  }
    
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={boundActionCreators.add1}>+</button>
        <button onClick={boundActionCreators.minus1}>-</button>
        <button onClick={() => store.dispatch({ type: 'DOUBLE' })}>DOUBLE</button>
      </div >
    )
  }
}
export default Counter;
```

上面的只使用redux 的代码还是存在冗余：

1. 每个组件都需自己去订阅触发组件重新渲染的方法和当组件卸载时注销组件重新渲染的方法
2. 组件需要引入仓库并将仓库中的状态数据映射为组件的state中



真实项目中redux仓库的目录结构的一种安排方式：

- src
  - store
    - reducers
      1. index.jsx
      2. reducerName1.jsx
      3. reducerName2.jsx
      4. ...
    - index.jsx
    - actionTypes.jsx
    - actionCreators
      - actionCreaters1.jsx
      - actionCreaters2.jsx



从Redux Toolkit（RTK）推出以来，Redux团队推荐使用Redux Toolkit来创建store，而不是直接使用`createStore`方法。Redux Toolkit提供了一个简化的API来配置store，它包括了一系列实用的工具来减少样板代码，并自动实现了一些最佳实践，比如使用`configureStore`代替`createStore`。

Redux Toolkit的`configureStore`方法**自动集成了thunk中间件以支持异步逻辑**，并且可以很容易地配置其他的中间件。它还集成了Redux DevTools扩展，使得开发调试更为方便。

**使用Redux Toolkit创建store**

以下是使用Redux Toolkit创建Redux store的示例：

步骤1: 安装Redux Toolkit和React Redux

通过以下命令安装Redux Toolkit和React Redux：

```bash
npm install @reduxjs/toolkit react-redux
```

步骤2: 创建Slice

Redux Toolkit使用“slices”概念来组织代码。一个slice包含了相关的reducer逻辑和actions。这是一个用`createSlice`方法创建slice的示例：

```js
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

// 导出每个reducer函数作为actions
export const { increment, decrement } = counterSlice.actions;

// 默认导出reducer
export default counterSlice.reducer;
```

步骤3: 配置Store

使用`configureStore`方法来创建Redux store，并将slices的reducer作为参数传递给它。

```js
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // 可以添加更多的slices作为reducer
  },
});
```

步骤4: 在React应用中提供Redux store

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

步骤5: 在React组件中使用Redux

```jsx
// App.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './features/counter/counterSlice';

function App() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default App;
```



# React-Redux

react-redux提供的核心方法：

- Provider组件
- connect
- useSelector
- useDispatch

## 基本使用

### 创建仓库

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import store from './store'
import Counter from './components/client'

const root  = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<Provider store={store}>
    	<Counter>
    </Provider>
)
```



### 类组件中使用

```jsx
import React from 'react';
import actionCreators from '../store/actionCreators/counter1';
import { connect } from 'react-redux';
class Counter1 extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.number}</p>
        <button onClick={this.props.add1}>+</button>
        <button onClick={this.props.minus1}>-</button>
      </div >
    )
  }
}
//把仓库中的状态映射为组件的属性props对象 仓库到组件的输出
const mapStateToProps = state => state.counter1;
//const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)
export default connect(
  mapStateToProps,
  actionCreators //组件的输出，在组件里派发动作，修改仓库  ,这个参数可以是对象也可以是函数，函数则会接受store.dispatch作为参数
)(Counter1);
```



### 函数组件中使用

```jsx
import React from 'react';
import actionCreators from '../store/actionCreators/counter2';
import { useSelector, useDispatch, useBoundDispatch } from 'react-redux';
function Counter2() {
  //1.从状态树中获取某一部分状态，进行渲染 2.当仓库中的状态发生改变后会重新渲染组件
  const counter2 = useSelector(state => state.counter2);
  const dispatch = useDispatch();//store.dispatch
  const { add2, minus2 } = useBoundDispatch(actionCreators);  // useBoundDispatch原生库中并没有实现，自己实现的
  return (
    <div>
      <p>{counter2.number}</p>
      <button onClick={()=>dispatch(actionCreators.add2())}>+</button>
      <button onClick={add2}>+</button>
      <button onClick={minus2}>-</button>
    </div >
  )
}
export default Counter2;
```



## 基本实现

react-redux内部是借助了react原生提供的createContext API实现的，所以需要先了解createContext 的基本使用才行。

### Provider组件实现

```jsx
import React from 'react'
import ReactReduxContext from './ReactReduxContext'  // 创建的一个在redux源码中共享的上下文

export default function Provider(props){
    return (
        <ReactReduxContext.Provider value={{store:props.store}}>
        	{props.children}
        </ReactReduxContext.Provider>
    )
}
```



### ReactReduxContext

```jsx
import React from 'react'
const ReactReduxContext = React.createContext(null)
export default ReactReduxContext
```



### connect

connect方法本质是一个高阶组件：

```jsx
import React from 'react'
import ReactReduxContext from './ReactReduxContext'
import {bindActionCreators} from 'redux'

function connect(mapStateToProps,mapDispatchToProps){
    return function(Component){
        return class extends React.Component{
            static contextType = ReactReduxContext
            constructor(props,context){
                super(props)
                const {store} = context 
                const {getState, dispatch, subscribe} = store
                
                this.state = mapStateToProps(getState())
                
                this.unsubscribe = subscribe(()=>{
                    this.setState(mapStateToProps(getState()))
                })
                
                let dispatchProps
                if(typeof mapDispatchToProps === 'function'){
                    dispatchProps = mapDispatchToProps(dispatch)
                }else{
                    dispatchProps = bindActionCreators(mapDispatchToProps,dispatch)
                }
                this.dispatchProps = dispatchProps
            }
            
            componentWillUnmount(){
                this.unsubscribe()
            }
            
            render(){
                return (
                    <Component {...this.props} {...this.state} {...this.dispatchProps}></Component>
                )
            }
        }
    }
}
```



### useSelector

```jsx
import  { useContext, useState, useLayoutEffect, useReducer, useRef } from 'react';
import ReactReduxContext from '../ReactReduxContext'
function useSelector(selector){
    const { store } = useContext(ReactReduxContext);

    const lastSelectedState = useRef(null)

    // const [state,setState] = useState(0)
    const [,forceUpdate] = useReducer(x=>x+1,0)

    useLayoutEffect(()=>{
        store.subscribe(()=>{
            // 优化，避免不必要的更新
            let slectedState = selector(store.getState())
            if(shallowEqual(lastSelectedState.current,slectedState)){
                return 
            }
            lastSelectedState.current = slectedState
            // setState(state+1)
            
            forceUpdate()
        })
    },[])

    return selector(store.getState())
}

function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 != "object" || obj1 === null || typeof obj2 != "object" || obj2 === null) {
        return false;
    }
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}
export default useSelector
```

优化useSelector

`useSyncExternalStore` 是 React 18 新增的一个 Hook，它提供了一种更加规范和优化的方式来同步外部数据源的状态，以及在 React 组件中使用这些状态。这个 Hook 旨在替代过去的一些不太规范的模式，如使用 `useEffect` 或 `useLayoutEffect` 加 `useState`/`useReducer` 来订阅外部数据源，并在数据源更新时强制组件重新渲染。

### useSyncExternalStore

`useSyncExternalStore` 允许订阅外部数据源，并在该数据源更新时确保组件能够同步更新。它接收三个参数：

1. **subscribe**：一个函数，用于订阅外部数据源的更新。当外部数据源更新时，这个函数应该触发提供的监听器（listener）。
2. **getSnapshot**：一个函数，返回外部数据源的最新状态。
3. **getServerSnapshot**（可选）：在服务端渲染（SSR）中使用，返回外部数据源的最新状态。

**应用场景**

`useSyncExternalStore` 主要用于下列场景：

1. **集成非 React 状态管理库**：当使用 Redux、MobX 或其他非 React 状态管理库时，`useSyncExternalStore` 提供了一种标准化的方式来确保 React 组件能够及时响应状态库中状态的更新。
2. **订阅外部数据源**：对于任何外部数据源，如 WebSocket 数据流、浏览器 API（例如 `localStorage`）的变化，或者是自定义的外部事件系统，`useSyncExternalStore` 都提供了一种有效的方式来同步这些数据的变化到 React 组件。
3. **性能优化**：相比于 `useState` 或 `useReducer` 配合 `useEffect`/`useLayoutEffect` 的方式，`useSyncExternalStore` 通过减少不必要的组件重渲染和提供更精准的订阅控制，可以帮助提升应用性能。

**示例代码**

假设有一个外部的数据源 `externalStore`，想在 React 组件中使用它的数据，并在数据更新时同步更新组件：

```jsx
import { useSyncExternalStore } from 'react';

// 假设的外部数据源
const externalStore = {
  subscribe(callback) {
    // 订阅逻辑
  },
  unsubscribe(callback) {
    // 取消订阅逻辑
  },
  getState() {
    // 获取当前状态
    return {/* 状态数据 */};
  }
};

function MyComponent() {
  const state = useSyncExternalStore(
    // 订阅和取消订阅
    (callback) => {
      externalStore.subscribe(callback);
      return () => externalStore.unsubscribe(callback);
    },
    // 获取最新状态
    () => externalStore.getState()
  );

  // 使用 state 渲染组件
  return <div>{/* 渲染逻辑 */}</div>;
}
```

`useSyncExternalStore` 提供了一种更安全和高效的方式来处理 React 组件与外部数据源之间的交互，使得状态同步更加简洁和可靠。



```js
import React, { useReducer, useLayoutEffect, useState, useRef } from 'react';
import ReactReduxContext from '../ReactReduxContext';
function useSelector(selector) {
    const { store } = React.useContext(ReactReduxContext);
    //React18新添加的自定义Hooks   二个参数 1 外部仓库订阅的方法 2 获取快照的方法 获取最新的状态
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState())
    );
}

function useSyncExternalStore(subscribe, getSnapShot) {
    let [state, setState] = useState(getSnapShot());
    //因为订阅只要一次就可以了，写在外面每次重新组件都要订阅
    useLayoutEffect(() => {
        subscribe(() => {
            setState(getSnapShot())
        });
    }, []);
    return state;
}

```



### useDispatch

```jsx
import ReactReduxContext from '../ReactReduxContext'
function useDispatch(){
    const { store } = useContext(ReactReduxContext);
    return store.dispatch
}

export default useDispatch
```



### useBoundDispatch

工具方法，react-redux中并没有，自己实现的。

```js
import  { useContext } from 'react';
import {bindActionCreators} from 'redux'

function useBoundDispatch(actionCreators){
    const { store } = useContext(ReactReduxContext);
    return bindActionCreators(actionCreators, store.dispatch)
}

export default useBoundDispatch
```



# Redux中间件

- 没有中间件，redux 的工作流程是 `action -> reducer`，这个过程是同步的，由dispatch 触发action后，直接去reducer执行相应的动作
- 但是在某些情况下，这种同步的实现方式并不能很好的解决问题。比如有一个这样的需求，点击按钮 -> 获取服务器数据 -> 渲染视图，因为获取服务器数据是需要异步实现，所以这时候就需要引入中间件改变redux同步执行的流程，形成异步流程来实现所要的逻辑，有了中间件，redux 的工作流程就变成这样 action -> middlewares -> reducer，点击按钮就相当于dispatch 触发action，接下去获取服务器数据 middlewares 的执行，当 middlewares 成功获取到服务器就去触发reducer对应的动作，更新需要渲染视图的数据
- **redux中间件的实现本质就是面向切片编程。将store自带的dispatch方法先保存下来。然后自己重新写一个方法赋值给store.dispatch，然后在自己实现的方法中再去调用原来的那个dispatch方法。只是redux 的中间件机制设计为了考虑扩展性和可维护性，对如何注册中间件进行设计。**
- 中间件的机制可以改变数据流，实现如异步 action ，action 过滤，日志输出，异常报告等功能

![image-20240220162332937](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20240220162332937.png)



```js
import { createStore } from 'redux';
import combinedReducer from './reducers';

const oldDispatch = store.dispatch;
let store = createStore(combinedReducer);
//实现异步操作
/*
 // 重写原来仓库store的dispatch方法
 store.dispatch = function (action) {
    setTimeout(() => {
        oldDispatch(action);
    }, 1000);
    return action;
} */

//实现打印日志
/* store.dispatch = function (action) {
    console.log('prev stat', store.getState());
    oldDispatch(action);
    console.log('next state', store.getState());
} */
export default store;
```

上面这种中间件实现的侵入性很强，且无法支持多个中间件。



为什么 Redux 源码中使用了一个中间件 API (`middlewareAPI`)，而不是直接传递整个 `store` 对象给每个中间件？这样做主要有两个原因：

1. **封装性（Encapsulation）**：通过提供一个 `middlewareAPI` 对象，Redux 可以限制中间件能够访问和使用的 store 方法。这种方式可以防止中间件直接修改 store 的状态或调用某些可能不应由中间件直接使用的方法。它允许中间件访问到 `getState` 和一个包装过的 `dispatch` 函数，但不允许访问到其他如 `subscribe` 或直接修改状态的能力。
2. **自定义的 `dispatch` 实现**：在中间件链中，每个中间件都有机会包装 `dispatch` 方法。这意味着当你调用 `dispatch` 时，你的 action 可以经过一系列的中间件，每个中间件都可以对 action 进行操作或者完全拦截它。如果直接传递原始的 `store` 对象，那么中间件之间就无法很好地链接起来。通过使用中间件 API，Redux 能够确保当中间件调用 `dispatch` 时，它实际上是调用经过所有中间件增强后的 `dispatch` 版本。

如果直接传递 `store` 而不是自定义的 `middlewareAPI`，会有以下后果：

- **失去控制**：中间件能够访问并调用 `store` 的任何方法，可能会导致 store 状态的不当修改。
- **中间件链的断裂**：中间件之间的链式调用会被破坏，因为它们无法正确地传递增强后的 `dispatch` 函数。

为了更好地说明中间件链的断裂和失去控制的概念，可以通过一些代码示例来展现如果不正确地实现中间件API，这些问题是如何发生的。

### 中间件链的断裂

中间件链的断裂指的是当中间件没有正确传递 `dispatch` 调用到链中的下一个中间件，导致中间件链中断，后续的中间件无法接收到 action 的问题。

```js
// 假设的不正确中间件实现
const brokenMiddleware = store => next => action => {
    console.log('Middleware before breaking the chain');
    // 故意不调用 next(action)，导致中间件链断裂
};

const loggerMiddleware = store => next => action => {
    console.log('Dispatching action:', action);
    let result = next(action); // 这里本应接收到 action，但由于链断裂，这行代码不会执行
    console.log('Next state:', store.getState());
    return result;
};

// 使用 applyMiddleware 应用中间件时，如果 brokenMiddleware 先于 loggerMiddleware 应用，
// 则 loggerMiddleware 将不会接收到任何 actions，因为链在 brokenMiddleware 中断了。
```

在这个例子中，`brokenMiddleware` 未调用 `next(action)`，导致 `action` 不会被传递给链中的下一个中间件（在这个例子中是 `loggerMiddleware`）。这就是中间件链断裂的情况，导致 `loggerMiddleware` 无法接收到 `action`，从而无法执行其逻辑。

### 失去控制

失去控制指的是中间件直接修改状态或执行了不应由其执行的 store 方法，破坏了 Redux 架构的原则和 store 的封装性。

```js
// 假设的失去控制中间件
const outOfControlMiddleware = store => next => action => {
    console.log('Dispatching action:', action);
    
    // 直接访问和修改 state，这是一种非常不推荐的做法，因为它违背了 Redux 的原则
    // 假设我们这样做
    // store.state.counter = 999; // 直接修改状态，这是错误的

    let result = next(action);
    console.log('Next state:', store.getState());
    return result;
};

// 如果中间件能够直接修改 state，那么 Redux 的状态管理就失去了控制和可预测性。
// 正确的做法是通过派发 action 来间接修改状态。
```

在这个示例中，如果中间件尝试直接修改 `store` 的状态（虽然这里的代码注释掉了，因为它在真实的 Redux 实现中是不可能的），它将会导致应用状态的不可预测性和维护性问题，因为这违背了 Redux 设计中状态不可直接修改，只能通过派发 action 进行修改的原则。

通过这两个示例，我们可以看到如果不遵循 Redux 的中间件设计原则，就可能会导致中间件链的断裂和失去对状态的控制，这两种情况都会对应用造成严重的问题。正确的做法是遵循 Redux 的设计，使用中间件 API 传递增强后的 `dispatch` 函数，以及通过 action 来间接修改状态，保证应用的可维护性和可预测性。

## 基本使用

下面的中间的 next变量，在项目中如果只引入一个中间键的情况下，这个next就代表的是redux仓库实例的dispatch方法，如果这个插件前面还有其他插件的话，则这个next指的就是前一个中间件返回的函数。

中间函数接受的store并不是真正的仓库对象实例，它只是一个对象，该对象中有getState方法和dispatch方法，其中这个dispatch并不是redux仓库实例对象store上面的dispatch方法，也不是上面的next方法，而至包装过所有redux中间件的方法。之所以这样设计，可以看下面这个案例，比如这个项目中redux中已经注册了一个logger、thunk中间件。

如果我编写了一个actionCreater如下：

```js
function thunkAdd() {
  return function (getState, dispatch) {
    setTimeout(() => {
      dispatch({ type: ADD1 });
    }, 1000);
  }
}
```

```js
function logger({ getState, dispatch }) {
    return function (next) {
        return function (action) {//此方法就是我们改造后的dispatch方法
            console.log('老状态', getState());
            next(action);
            console.log('新状态', getState());
            return action;
        }
    }
}
export default logger;


function thunk({ getState, dispatch }) {
    return function (next) {
        return function (action) {//此方法就是改造后的dispatch方法
            if (typeof action === 'function') {
                return action(getState, dispatch);
            }
            return next(action);
        }
    }
}
export default thunk;
```



```js
import { createStore } from 'redux';
import combinedReducer from './reducers';
import thunk from './redux-thunk';
import logger from './redux-logger';
function applyMiddleware(middleware) {
    return function (createStore) {
        return function (reducer, preloadedState) {
            const store = createStore(reducer);
            // let dispatch;
            // let middlewareAPI = {
            //     getState: store.getState,
            //     dispatch: (action) => dispatch(action)
            // };
            let dispatch = middleware(store)(store.dispatch)
            return {
                ...store,
                dispatch
            }
        }
    }
}
const store = applyMiddleware(logger,thunk)(createStore)(combinedReducer);
```



如果不在插件机制内部实现下面的代码：

```js
let dispatch;
let middlewareAPI = {
    getState: store.getState,
    dispatch: (action) => dispatch(action)
};
dispatch = middleware(middlewareAPI)(store.dispatch)
 

```

而是直接`let dispatch = middleware(store)(store.dispatch)`，那么在下面的代码中，在内存函数中调用`dispatch({ type: ADD1 });`则直接调用的就是真正的store上的dispatch方法了，这将导致logger中间并不会执行了。

```js
function thunkAdd() {
  return function (getState, dispatch) {
    setTimeout(() => {
      dispatch({ type: ADD1 });
    }, 1000);
  }
}
```





中间件案例：

1. 日志中间件（Logger Middleware）

```js
function loggerMiddleware(store) {
  return function(next) {
    return function(action) {
      console.log('当前状态', store.getState());
      console.log('派发动作', action);
      next(action);
      console.log('更新后状态', store.getState());
    };
  };
}
```

2. 异步操作中间件（Thunk Middleware）

```js
function thunkMiddleware(store) {
  return function(next) {
    return function(action) {
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      return next(action);
    };
  };
}
```

3. 异常报告中间件（Crash Reporter Middleware）

```js
function crashReporterMiddleware(store) {
  return function(next) {
    return function(action) {
      try {
        next(action);
      } catch (err) {
        console.error('捕获到异常!', err);
        // 可以在这里发送错误报告给服务器
      }
    };
  };
}
```

4. 性能监控中间件（Performance Middleware）

```js
function performanceMiddleware(store) {
  return function(next) {
    return function(action) {
      const start = performance.now();
      next(action);
      const end = performance.now();
      console.log(`${action.type} 执行时间: ${end - start} 毫秒`);
    };
  };
}
```

5. 支持promise中间件

   ```js
   function promiseMiddleware(stroe){
       return function (next){
           return function(action){
               if(action.then && typeof action.then ==='function'){
                   action.then(stroe.dispatch)
               }else{
                   next()
               }
           }
       }
   }
   ```

   

**使用中间件(旧版本)**

在 Redux 应用中使用这些中间件的方式与之前一样，通过 `applyMiddleware` 函数应用到 store 创建过程中：

```js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(
    loggerMiddleware,
    thunkMiddleware,
    crashReporterMiddleware,
    performanceMiddleware
  )
);
```



**新版本**

```js
import { createStore } from '../redux';
import combinedReducer from './reducers';
import promise from './redux-promise';
import thunk from './redux-thunk';
import logger from './redux-logger';

// 第一层函数用于确定中间件
function applyMiddleware(middleware) {
    // 第二层函数用于确定createStore
    return function (createStore) {
        // 第三层函数用于确定reducer
        return function (reducer, preloadedState) {
            const store = createStore(reducer);
            let dispatch = store.dispatch;
            let middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => dispatch(action)
            };
            dispatch = middleware(middlewareAPI)(store.dispatch)
            return {
                ...store,
                dispatch
            }
        }
    }
}
const store = applyMiddleware(promise, thunk, logger)(createStore)(combinedReducer);

export default store;
```



## 核心实现

中间的级联使用了函数组合（反柯里化）和洋葱模型思想。

```js
function applyMiddleware() {
  var middlewares = Array.prototype.slice.call(arguments);
  return function(createStore) {
    return function(reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function(action) {
          return dispatch(action);
        }
      };
      
      chain = middlewares.map(function(middleware) {
        return middleware(middlewareAPI);
      });
      dispatch = compose.apply(undefined, chain)(store.dispatch);

      return {
        ...store,
        dispatch: dispatch
      };
    };
  };
}

function compose() {
  var funcs = Array.prototype.slice.call(arguments);
  
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function(a, b) {
    return function() {
      return a(b.apply(undefined, arguments));
    };
  });
}
```





# redux-first-history

`history`库是一个JavaScript库，用于在Web应用中管理会话历史（session history）。它是React Router依赖的底层库，但也可以独立于React使用。`history`库提供了一个抽象，允许以一致的方式操作历史堆栈、导航、和会话管理，不论是在浏览器环境、Node.js还是React Native中。

### 具体作用

`history`库的主要作用包括：

1. **管理历史堆栈**：可以通过`push`、`replace`、`go`、`goBack`、`goForward`等方法来编程式地控制浏览器历史堆栈的导航。
2. **会话管理**：支持会话级别的状态管理，允许在导航时向历史条目附加状态（state）。
3. **抽象化路由**：提供了一种方式来抽象化不同环境下的路由实现，比如浏览器的`window.history`或内存中的历史（对于测试或非浏览器环境）。

### 常见的应用场景

1. **单页应用（SPA）路由管理**：在React、Vue、Angular等单页应用中，`history`库可以用来管理路由跳转和浏览器历史记录，与现代前端框架紧密集成。
2. **历史导航控制**：允许开发者编程式地控制用户的导航，例如实现前进、后退按钮的功能。
3. **会话状态恢复**：通过在历史条目中附加状态，可以在用户导航时保存和恢复会话状态，例如表单输入的恢复。
4. **非浏览器环境的路由**：例如在Node.js服务器端渲染（SSR）或React Native应用中，可以使用`history`库来模拟浏览器环境下的路由行为。

### 应用方式

使用`history`库通常涉及以下几个步骤：

1. **创建历史对象**：根据运行环境选择合适的历史创建函数，如`createBrowserHistory`、`createMemoryHistory`。

   ```js
   import { createBrowserHistory } from 'history';
   const history = createBrowserHistory();
   ```

2. **导航和监听**：使用`history`对象的方法来进行导航或监听历史变化。

   ```js
   // 导航到一个新地址
   history.push('/home');
   
   // 监听历史变化
   history.listen((location, action) => {
     console.log(location, action);
   });
   ```

3. **会话状态管理**：在进行导航操作时，可以向历史条目附加状态，以便后续恢复。

   ```js
   // 在导航时附加状态
   history.push('/location', { some: 'state' });
   ```



`redux-first-history`是一个用于Redux的中间件和增强器，它的目的是将React Router与Redux的状态管理结合起来。这样做可以让路由状态成为应用程序状态的一部分，允许开发者通过Redux动作来控制路由跳转，并且可以让路由变化作为应用状态的变更被记录和回放，这对于调试和实现具有复杂路由需求的应用非常有帮助。

**具体作用**

`redux-first-history`的主要作用包括：

1. **同步路由状态到Redux**：这意味着路由变化会更新Redux的状态树，反之亦然，从而使路由状态可以通过Redux状态进行查询和操作。
2. **通过Redux动作进行导航**：允许使用Redux动作来触发路由变化，这样可以在Redux逻辑中集成路由逻辑，简化组件和路由之间的交互。
3. **时间旅行调试**：由于路由状态被纳入到Redux的状态管理中，所以可以利用Redux DevTools进行时间旅行调试，包括路由变化。
4. **简化配置**：提供了一种简化的方式来配置和使用React Router和Redux，使得在应用程序中集成路由变得更加直接和无缝。

**配置使用最新版本**

配置`redux-first-history`需要几个步骤，包括安装依赖、配置中间件、增强器以及React Router。以下是基于最新版本的大致步骤：

1. **安装依赖**：需要安装`redux-first-history`以及它的依赖项，如`react-router-dom`和`redux`。

   ```bash
   npm install redux-first-history react-router-dom redux redux-thunk
   ```

2. **配置Store**：在Redux的store配置中，使用`redux-first-history`的createBrowserHistory和routerMiddleware。

   ```js
   import { applyMiddleware, createStore } from 'redux';
   import { createReduxHistoryContext } from 'redux-first-history';
   import { composeWithDevTools } from 'redux-devtools-extension';
   
   // 创建history和middleware
   const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
     history: typeof document !== 'undefined' ? require('history').createBrowserHistory() : require('history').createMemoryHistory(),
   });
   
   // 添加routerReducer到你的root reducer
   const rootReducer = combineReducers({
     ...yourOtherReducers,
     router: routerReducer,
   });
   
   // 配置store
   const store = createStore(
     rootReducer,
     composeWithDevTools(
       applyMiddleware(
         routerMiddleware,
         // ...其他中间件
       ),
     ),
   );
   
   const history = createReduxHistory(store);
   ```

3. **集成React Router**：在React组件中使用`Router`组件来使用创建的`history`对象。

   ```jsx
   import { Router } from 'react-router-dom';
   
   function App() {
     return (
       <Router history={history}>
         {/* 路由配置 */}
       </Router>
     );
   }
   ```



## 基本使用

```bash
npm install redux react react-dom react-redux react-router-dom redux-first-history react-router --save
```

src/main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, Link } from "react-router-dom";
 // 以前是import { BrowserRouter } from 'react-router-dom';
import { HistoryRouter } from "./redux-first-history/rr6"; 
import { Provider } from 'react-redux';
import { store, history } from "./store";
import Home from './components/Home';
import Counter from './components/Counter';
ReactDOM.render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/counter">Counter</Link></li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </HistoryRouter>
  </Provider >,
  document.getElementById('root')
);
```

# redux-saga

## 前置知识

在JavaScript中，当一个生成器（generator）函数中的`yield`关键字后面跟随的是另一个生成器函数的调用，这个调用本身并不会自动执行那个生成器函数。相反，它会返回一个迭代器（iterator），这个迭代器需要被迭代（通常使用`yield*`语法）才能执行那个生成器函数中的代码。

为了让嵌套的生成器函数执行，需要使用`yield*`表达式而不是单纯的`yield`。`yield*`表达式用于委托给另一个生成器或可迭代对象，这意味着外层生成器暂停执行，控制权被转移给被委托的生成器，直到被委托的生成器执行完毕。

**示例说明**

假设有两个生成器函数`generatorA`和`generatorB`，如下所示：

```js
function* generatorB() {
  yield 'B start';
  yield 'B end';
}

function* generatorA() {
  yield 'A start';
  yield* generatorB(); // 使用 yield* 来委托给 generatorB
  yield 'A end';
}
```

**执行流程**

在上面的示例中，当`generatorA`中的`yield* generatorB()`执行时，控制权转移到`generatorB`。此时，`generatorB`的执行依赖于外部对`generatorA`返回的迭代器继续调用`next()`方法。每次调用`next()`都会使`generatorB`继续执行到下一个`yield`，或者执行完成并将控制权返回给`generatorA`。

1. **首次迭代**：调用`iterator.next()`首次时，`generatorA`开始执行并返回`{ value: 'A start', done: false }`，此时执行停在第一个`yield`处。
2. **第二次迭代**：再次调用`iterator.next()`时，`generatorA`继续执行遇到`yield* generatorB()`，此时控制权转移到`generatorB`。`generatorB`开始执行并遇到它的第一个`yield`，返回`{ value: 'B start', done: false }`。
3. **第三次迭代**：再次调用`iterator.next()`，`generatorB`从上次停止的地方继续执行，遇到下一个`yield`并返回`{ value: 'B end', done: false }`。`generatorB`执行完毕后，控制权返回给`generatorA`。
4. **第四次迭代**：再次调用`iterator.next()`，`generatorA`继续执行遇到最后一个`yield`，返回`{ value: 'A end', done: false }`。
5. **结束迭代**：再次调用`iterator.next()`，由于`generatorA`已经执行完毕，返回`{ value: undefined, done: true }`，表示迭代完成。

**代码示例**

以下是如何使用这两个生成器函数的示例：

```js
const iterator = generatorA();

console.log(iterator.next().value); // 输出: A start
console.log(iterator.next().value); // 输出: B start
console.log(iterator.next().value); // 输出: B end
console.log(iterator.next().value); // 输出: A end
```

**总结**

使用`yield*`表达式可以实现生成器函数的委托，这是处理嵌套生成器函数的一种有效方式。它不仅可以用于委托给其他生成器函数，还可以用于任何可迭代对象，如数组等。这种方式使得生成器函数之间的协作变得更加灵活和强大。



**CO库**

```js
function co(gen){
    const it = gen()
    function next(value){
        const {done,value} = it.next(value)
        if(!done){
            next(value)
        }
    }
    next()
}


function co(generatorFunc) {
  // 返回一个Promise，co的调用者可以通过.then访问异步操作的结果
  return new Promise((resolve, reject) => {
    // 初始化生成器函数
    const gen = generatorFunc();

    // 用于递归执行生成器的下一步
    function step(nextFunc) {
      let next;
      try {
        // 执行生成器的下一步
        next = nextFunc();
      } catch (error) {
        // 如果执行过程中出现错误，拒绝Promise
        return reject(error);
      }
      
      // 如果生成器执行完毕，解析Promise
      if (next.done) {
        return resolve(next.value);
      }

      // 确保返回值是Promise，以便可以调用.then和.catch
      // 使用Promise.resolve包装可能不是Promise的值
      Promise.resolve(next.value).then(
        (value) => {
          // 成功时递归调用step，传入gen.next
          step(() => gen.next(value));
        },
        (error) => {
          // 错误时递归调用step，传入gen.throw
          step(() => gen.throw(error));
        }
      );
    }

    // 开始执行生成器的第一步
    step(() => gen.next(undefined));
  });
}


// 模拟一个异步操作，例如从服务器获取数据
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("some data"), 1000);
  });
}

// 使用生成器函数处理异步流程
function* genFunction() {
  try {
    const data = yield fetchData();
    console.log(data); // 输出获取到的数据
    // 可以继续执行其他异步操作
    const moreData = yield fetchData();
    console.log(moreData);
  } catch (error) {
    console.error("Caught an error: ", error);
  }
}

// 使用co运行生成器函数
co(genFunction).then(() => {
  console.log("All done");
});
```





## redux-saga介绍

`redux-saga`是一个用于管理Redux应用中副作用（例如异步获取数据、访问浏览器缓存等）的库。它使用ES6的`Generator`函数来让异步流程更易于读写和测试。通过使用`redux-saga`，可以将异步操作和业务逻辑从组件中分离出来，使得组件只负责显示UI，从而使得代码更加清晰和易于维护。

**应用场景**

`redux-saga`主要用于处理复杂的异步操作和副作用管理。一些常见的应用场景包括：

- **数据获取**：在应用启动或用户操作时异步获取数据。
- **异步流程控制**：例如，用户按顺序执行一系列操作，每步都依赖上一步的结果。
- **防抖动**：限制用户操作的频率，例如在用户完成输入一段时间后自动触发搜索。
- **与WebSocket通信**：管理WebSocket连接生命周期，发送和接收消息。
- **监听Redux状态变化**：执行副作用响应Redux状态的变化。
- **复杂的条件逻辑**：在执行异步操作前后进行复杂的条件判断。

**如何使用Redux-Saga**

使用`redux-saga`涉及以下几个步骤：

1. **安装redux-saga**

   ```bash
   npm install redux-saga
   ```

2. **创建Sagas**

   Saga是一个生成器函数，使用`yield`表达式来调用异步操作。

   ```js
   import { call, put, takeEvery } from 'redux-saga/effects';
   
   // 模拟异步获取数据的函数
   function fetchUserData() {
     return fetch('https://api.example.com/user').then(response => response.json());
   }
   
   // Worker saga：当触发FETCH_USER_ACTION时执行的操作
   function* fetchUser() {
     try {
       const user = yield call(fetchUserData);
       yield put({type: 'FETCH_USER_SUCCESS', user}); // 触发一个action来更新状态
     } catch (e) {
       yield put({type: 'FETCH_USER_FAILED', message: e.message});
     }
   }
   
   // Watcher saga：监听触发的action
   function* mySaga() {
     yield takeEvery('FETCH_USER_ACTION', fetchUser);
   }
   ```

3. **在Store中引入Saga Middleware**

   ```js
   import { createStore, applyMiddleware } from 'redux';
   import createSagaMiddleware from 'redux-saga';
   import reducer from './reducers';
   import mySaga from './sagas';
   
   // 创建Saga middleware
   const sagaMiddleware = createSagaMiddleware();
   
   // 使用applyMiddleware将middleware挂载到Store上
   const store = createStore(
     reducer,
     applyMiddleware(sagaMiddleware)
   );
   
   // 运行Saga
   sagaMiddleware.run(mySaga);
   ```

4. **触发Saga**

   在组件中通过`dispatch`一个action来触发Saga。

   ```js
   store.dispatch({type: 'FETCH_USER_ACTION'});
   ```



`redux-saga`提供了一种强大且灵活的方式来处理Redux应用中的副作用。通过将异步逻辑从组件中分离出来，它不仅可以使应用的业务逻辑更加清晰，还可以提高代码的可测试性。使用`redux-saga`，可以更容易地实现复杂的异步流程控制，使得开发大型和复杂的应用变得更加简单。



- saga使用生成器函数来产出effect（一个js对象）
- 需要借助一些saga库中提供的api，比如：fork，take，call，put，cancel等方法来创建effect





saga执行器(runSaga)的基本原理简单模拟：

runSaga会不断的递归调用迭代器，直到done为true的情况。

```js

function* rootSaga() {
  console.log('start');
  yield { type: 'PUT', action: { type: 'ADD' } }
  yield new Promise(resolve => setTimeout(resolve, 1000));
  yield readFile;
  yield 'delay1000'
  yield { type: "PUT", action: { type: "MINUS" } }
}
function readFile(callback) {
  setTimeout(callback, 1000);
}

function runSaga(saga) {
  //执行生成器，返回一个迭代器
  const it = saga();
  function next() {
    const { done, value: effect } = it.next();
    debugger
    if (!done) {//如果done=false
      if (effect === 'delay1000') {
        setTimeout(next, 1000);
      } else if (typeof effect === 'function') {
        effect(next);
      } else if (effect.type === 'PUT') {
        console.log(`向仓库派发一个动作 ${JSON.stringify(effect.action)}`);
        next();
      } else if (effect instanceof Promise) {
        effect.then(next);
      } else {
        next();
      }
    }
  }
  next();
}
runSaga(rootSaga);
```

runSaga的next中预设了固定的一些effect的类型，根据这些类型执行不同的逻辑，然后再继续调用next方法。

而这些类型的格式都是预先设定好的。

提前终止迭代器的执行：it.return()；迭代器抛出异常it.throw()。



## saga分类

在`redux-saga`中，saga可以根据其用途大致分为两类：`Watcher Sagas`和`Worker Sagas`。这种分类有助于组织和管理复杂的异步操作和副作用。`Watcher Sagas`监听发起的action，然后触发一个或多个`Worker Sagas`执行实际的异步任务。

**Watcher Sagas**

`Watcher Sagas`负责监听Redux store中的action。当它捕捉到某个特定的action时，它会调用对应的`Worker Saga`来处理副作用（如数据获取、文件读写等）。通常使用`takeEvery`、`takeLatest`、`takeLeading`或`take`等效果操作符来监听action。

**Worker Sagas**

`Worker Sagas`负责执行具体的异步操作。当`Watcher Saga`捕捉到一个action并调用`Worker Saga`时，`Worker Saga`会执行实际的异步任务，如API调用。完成后，它可能会发起一个新的action来更新应用的状态。

**多个Watcher和Worker Sagas**

在复杂的应用中，可能会有多个`Watcher Sagas`和`Worker Sagas`来处理不同的异步流程。以下是如何组织和编写这些sagas的示例：

**Worker Sagas**

```js
import { call, put } from 'redux-saga/effects';

function* fetchUserData() {
  try {
    const data = yield call(Api.fetchUser); // 假设Api.fetchUser是一个返回Promise的函数
    yield put({type: "FETCH_USER_SUCCESS", data});
  } catch (error) {
    yield put({type: "FETCH_USER_FAILED", error});
  }
}

function* updateUserProfile(action) {
  try {
    const data = yield call(Api.updateProfile, action.payload); // 传递参数到API调用
    yield put({type: "UPDATE_PROFILE_SUCCESS", data});
  } catch (error) {
    yield put({type: "UPDATE_PROFILE_FAILED", error});
  }
}
```

**Watcher Sagas**

```js
import { takeEvery } from 'redux-saga/effects';

function* watchFetchUserData() {
  yield takeEvery("FETCH_USER_REQUEST", fetchUserData);
}

function* watchUpdateUserProfile() {
  yield takeEvery("UPDATE_PROFILE_REQUEST", updateUserProfile);
}
```

**组合所有Sagas**

使用`all`效果操作符来同时启动所有的Watcher Sagas。

```js
import { all } from 'redux-saga/effects';

function* rootSaga() {
  yield all([
    watchFetchUserData(),
    watchUpdateUserProfile(),
    // 可以在这里添加更多的Watcher Sagas
  ]);
}
```

`all`是`redux-saga`的一个操作符（Effect），来源于`redux-saga/effects`模块。它用于并行地启动多个saga任务。使用`all`可以同时启动多个`Watcher Sagas`，让它们并发运行，而不是按顺序一个接一个地运行。这意味着所有被`all`包裹的sagas都将被立即并行启动，它们之间不会相互等待。

当在组件中派发一个`UPDATE_PROFILE_REQUEST` action时，`redux-saga`中的`watchUpdateUserProfile` watcher saga会监听到这个action，因为它已经在`rootSaga`通过`all`并行启动了。这个过程是独立的，不需要先执行`watchFetchUserData`或任何其他saga。每个watcher saga独立监听各自关心的action类型，当相应的action被派发时，对应的worker saga会被触发执行。

**如何在组件中使用**

假设已经设置好了上述的sagas和Redux store，下面是如何在React组件中使用这些sagas的示例：

**派发Action**

在组件中，可以使用`useDispatch`钩子从`react-redux`库来派发action，这将触发对应的saga执行异步操作。

```jsx
import React from 'react';
import { useDispatch } from 'react-redux';

function UserProfile() {
  const dispatch = useDispatch();

  const handleUpdateProfile = (profileData) => {
    // 派发UPDATE_PROFILE_REQUEST action，这将触发watchUpdateUserProfile saga
    dispatch({ type: 'UPDATE_PROFILE_REQUEST', payload: profileData });
  };

  return (
    <div>
      <button onClick={() => handleUpdateProfile({ name: 'John Doe' })}>
        Update Profile
      </button>
    </div>
  );
}
```

在这个示例中，当用户点击按钮时，`handleUpdateProfile`函数会被调用，并派发一个`UPDATE_PROFILE_REQUEST` action。这个action会被`watchUpdateUserProfile` saga监听到，然后执行`updateUserProfile` worker saga来处理实际的异步更新操作。

**`all`的作用和意义**

- **并行执行**：`all`允许多个sagas同时启动，它们可以独立监听和响应action，无需等待其他sagas完成。
- **组织结构**：使用`all`可以在一个地方集中管理和启动你的sagas，使得`rootSaga`的结构清晰和简洁。

总结，使用`all`来启动sagas并不会影响到sagas监听action的能力，无论是`watchFetchUserData`还是`watchUpdateUserProfile`，它们都能独立地并行监听和处理对应的actions，不会相互干扰。



**启动Root Saga**

在应用中，需要将`rootSaga`启动，以便所有的`Watcher Sagas`开始监听action。

```js
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store
```

通过这种方式，可以有效地组织和管理复杂的异步流程，使得代码易于理解和维护。每个`Watcher Saga`关注特定的action类型，而`Worker Sagas`执行实际的异步任务，这样的分工使得异步逻辑更加清晰。




在组件中使用`redux-saga`涉及到触发action，这些action由Watcher Sagas监听，进而调用Worker Sagas执行异步操作。以下是如何在React组件中结合使用`redux`和`redux-saga`的示例。

1. **定义Action Creators**

首先，定义一些action creators，它们简化了dispatch action的过程。这些action与我们之前定义的sagas中监听的action类型相匹配。

```js
// actions.js
export const fetchUserRequest = () => ({
  type: 'FETCH_USER_REQUEST',
});

export const updateUserProfileRequest = (profileData) => ({
  type: 'UPDATE_PROFILE_REQUEST',
  payload: profileData,
});
```

2. **创建React组件**

在React组件中，你可以使用`useDispatch`来获取dispatch函数，然后使用这个函数来dispatch actions。同时，使用`useSelector`来访问Redux store的状态。

**UserProfileComponent.js**

```jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRequest, updateUserProfileRequest } from './actions';

function UserProfileComponent() {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const user = useSelector(state => state.user);
  const loading = useSelector(state => state.loading);

  const fetchUser = () => {
    dispatch(fetchUserRequest());
  };

  const updateUserProfile = () => {
    dispatch(updateUserProfileRequest(profileData));
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>User Profile</h1>
          <p>{user.name}</p>
          {/* Assume there's a form here to update profile data */}
          <button onClick={updateUserProfile}>Update Profile</button>
          <button onClick={fetchUser}>Refresh Profile</button>
        </div>
      )}
    </div>
  );
}

export default UserProfileComponent;
```

这个组件有两个按钮，分别用于触发获取用户数据和更新用户资料的操作。点击按钮时，会dispatch相应的action，这些action被Watcher Sagas捕获，进而调用对应的Worker Sagas来执行异步操作。







