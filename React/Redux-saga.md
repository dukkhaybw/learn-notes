## Redux-saga

## 基础

Generator 生成器函数，如果一个函数 加上一个 \* ，它就成为了生成器函数。该生成器函数的运行结果是一个迭代器对象。而迭代器中必须有一个 next 方法，这个 next 方法执行后返回一个对象，这个对象有 value 和 done 两个属性。

- done 表示当前迭代器是否已经执行完成，执行完值为 true，否则为 false
- value 代表当前步骤返回的值
- 当调用 next 方法时会继续往下执行，也到 yield 关键字会暂停执行，并且将 yield 后面表达式的值作为返回对象的 value 值

![image-20210819201147968](.\typora-user-images\image-20210819201147968.png)

saga 的核心就是生成器函数， saga 任务取消式用到 return 方法。

注意：

- 迭代器对象上还有一个方法 throw 用于抛出错误并跳过后面的 yield 语句的执行。
- 迭代器对象上还有一个方法 return 用于跳过后面的 yield 语句的执行。

## co 原理

```
function * generator(){
	let a = yield 1
	console.log(a)
	let b = yield 2
	console.log(b)
	let c = yield 3
	console.log(c)
}

function co(generator){
	let it = generator()
	let reasult
	function next(arg){
		result = it.next()
		if(!result.done){
			next(result.value)
		}
	}
	next()
}
co(generator)
```

![image-20210819204352557](.\typora-user-images\image-20210819204352557.png)

概念

中间件：一种独立运行在各个框架之间的代码，其本质是函数。它可以访问请求对象和响应对象，可以对请求进行拦截处理，处理后再将控制权向下传递，也可以终止请求，向客户端做出响应。

中间件增强了 dispatch 方法，在 dispatch 之间加一些额外的逻辑（异步，调取接口，promise 等）。

在 redux 中中间件是运行在 action 发送出去，到达 reducer 之间的一段代码，它的代码调用流程是：action=>Middlewares=>reducer。通过这种机制可以改变数据流，实现例如异步 action，action 过滤，日志输入，异常报告等能力。

在 Redux 中有一个方法——applyMiddleware，可以应用多个中间件。

Redux-saga 是一个用于管理应用程序的异步操作的库（redux 的一个中间件），它的目的是简化异步操作。它可以通过 redux 的 action 方法触发 redux-saga 的启动，暂停和取消。redux-saga 可以访问完成的 redux 中的 state，也能在 saga 中重新 dispatch 一个 action。

redux 中间件和 redux 异步

ES6--Generator

为什么使用 Redux-saga 和认识

使用 API

- createSagaMiddleware(options)创建一个 Redux middleware，并将 Saga 连接到 Redux Store

在 saga 中有三种 generator = saga

1. 根 saga，它是入口
2. watcher saga 监听者
3. worker saga 工作者

```
export function * rootSaga(){
	for(let i=0 ; )
}
```
