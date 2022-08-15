## Redux-saga

## 基础

Generator生成器函数，如果一个函数 加上一个 * ，它就成为了生成器函数。该生成器函数的运行结果是一个迭代器对象。而迭代器中必须有一个next方法，这个next方法执行后返回一个对象，这个对象有value和done两个属性。

- done表示当前迭代器是否已经执行完成，执行完值为true，否则为false
- value代表当前步骤返回的值
- 当调用next方法时会继续往下执行，也到yield关键字会暂停执行，并且将yield后面表达式的值作为返回对象的value值

![image-20210819201147968](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210819201147968.png)

saga 的核心就是生成器函数， saga任务取消式用到return方法。

注意：

- 迭代器对象上还有一个方法throw用于抛出错误并跳过后面的yield语句的执行。
- 迭代器对象上还有一个方法return用于跳过后面的yield语句的执行。



## co原理

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







![image-20210819204352557](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210819204352557.png)

概念

中间件：一种独立运行在各个框架之间的代码，其本质是函数。它可以访问请求对象和响应对象，可以对请求进行拦截处理，处理后再将控制权向下传递，也可以终止请求，向客户端做出响应。 

中间件增强了dispatch方法，在dispatch之间加一些额外的逻辑（异步，调取接口，promise等）。

在redux中中间件是运行在action发送出去，到达reducer之间的一段代码，它的代码调用流程是：action=>Middlewares=>reducer。通过这种机制可以改变数据流，实现例如异步action，action过滤，日志输入，异常报告等能力。

在Redux中有一个方法——applyMiddleware，可以应用多个中间件。



Redux-saga是一个用于管理应用程序的异步操作的库（redux的一个中间件），它的目的是简化异步操作。它可以通过redux的action方法触发redux-saga的启动，暂停和取消。redux-saga可以访问完成的redux中的state，也能在saga中重新dispatch一个action。



redux中间件和redux异步

ES6--Generator

为什么使用Redux-saga和认识





使用API

- createSagaMiddleware(options)创建一个Redux middleware，并将Saga连接到Redux Store



在saga中有三种generator = saga

1. 根saga，它是入口
2. watcher saga 监听者
3. worker saga 工作者

```
export function * rootSaga(){
	for(let i=0 ; )
}
```







