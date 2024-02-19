## 纯原生基本使用

redux源码的本质是发布订阅模式。subscribe方法接受的函数（订阅函数），当dispatch(action)的时，内部会将上一次的state和本次的action传给reducer函数进行执行，将reducer返回的函数更新为新的state，然后再取出之前subscribe方法订阅好的函数进行执行。

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





核心实现：

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
        this.state = {number:store.getState().number}
    }

    componentDidMount(){
        this.unsubscribe = store.subscribe(()=>{
            this.setState({number:store.getState().number})
        })
    }

    componentWillUnmount(){
        this.unscbscribe()
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

  当UI派发一个动作action之后，redux源码中不知道这个动作具体会命中那个reducer中的type，所以会全部循环一边所有的reducer并将state和action传递过去，所以如果多个reducer中都有同一个type类型，都会被触发修改（这是redux库这么设计的）。

  ```js
  function combineReducers(reducers){
      // 这个combination函数就会被传递给下面的createStore
      return function combination(state={},action){
          let nextState ={}
          for(let key in reducers){
              let prevStateForKey = state[key]
              let reducerForKey = reducers[key]
              prevStateForKey = reducerForKey(nextStateForKey,action)
              nextState[key] = prevStateForKey
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

  