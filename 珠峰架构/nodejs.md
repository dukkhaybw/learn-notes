## promise 和异步编程

### 高阶函数

什么样的函数是高阶函数？满足下一面的条件之一就是

- **一个函数返回另一个函数**
- **参数是函数的函数**

1. 如果一个函数的参数是一个函数

   ```js
   function fun(callback) {
     //....
     callback();
   }
   ```

2. 如果一个函数的返回结果是另一个函数

   ```js
   function (){
       return function fun (){
           // ....
       }
   }
   ```

#### 高阶函数的应用

例如，现在项目中有一个核心方法。它的业务逻辑已经非常完善了。但是某个开发者想自己在执行这个核心代码逻辑之前做点自己的逻辑，核心代码执行之后再做自己的逻辑（比如计算核心代码逻辑执行的耗时）。原有的方式是：

**作用一：可以在原来核心代码逻辑的前面和后面分别增加自己的代码。但是这样做的不足就是别人在调取这段核心代码时也会执行到自己添加的代码（破坏了原有函数）。——面向切片编程（AOP）**

在 Vue 中就用了 AOP 思想对数组原型上的方法进行额外逻辑捕获。

1. 扩展方法，基于原来的代码进行一系列扩展而不破坏原函数

```js
function say() {
  // todo...
  console.log('say');
}

let newFn = say.before(function () {
  console.log('say before');
});

newFn(); // 它会将befor函数传入的函数先执行，然后再执行say方法

// 箭头函数没有this,arguments,没有原型
Function.prototype.before = function (callback) {
  let self = this;
  return function (...args) {
    callback();
    self(...args); //也可以用箭头函数
  };
};

Function.prototype.after = function (callback) {
  let self = this;
  return function (...args) {
    self(...args);
    callback(); //也可以用箭头函数
  };
};
```

react 中的 setState 中就用到了事务，也就是在 setState 函数执行前做一些事，执行后再做一些事。等同于 before 和 after。

 react 事务：

```js
function perform(fn, wrappers) {
  wrappers.forEach((wrapper) => {
    wrapper.initialize();
  });
  fn();
  wrappers.forEach((wrapper) => {
    wrapper.close();
  });
}
```

<img src="..\typora-user-images\image-20211113222412658.png" alt="image-20211113222412658" style="zoom: 67%;" />

<img src="..\typora-user-images\image-20211113222902802.png" alt="image-20211113222902802" style="zoom:67%;" />

<img src="..\typora-user-images\image-20211113222830481.png" alt="image-20211113222830481" style="zoom:67%;" />

**AOP:主要作用就是将一些跟核心业务逻辑模块无关的功能抽离，其实就是给原函数增加一层，不影响原函数内部的逻辑。**



**作用二：形成闭包保存变量**

1. 特别的 after 函数

```js
function after(times, callback) {
  return function () {
    if (time-- === 0) {
      callback();
    }
  };
}

let fn = after(3, function () {
  //fn执行3次后，第二个参数函数才会执行,并发问题
  console.log('after');
});
```

2. 利用高阶函数的闭包机制，实现参数的保存（函数柯里化，偏函数）

```js
// 通过高阶函数来实现参数的保留
function isType(typing, val) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`;
}
// 每次执行都需要传入字符串, 可以利用高阶函数来实现参数的保留。 闭包的机制（执行上下文不会被销毁）

function isType(typing) {
  // typing
  return function (val) {
    // isString/ isNumber
    return Object.prototype.toString.call(val) === `[object ${typing}]`;
  };
}

let util = {};
['String', 'Number', 'Boolean'].forEach((typing) => {
  util['is' + typing] = isType(typing);
});

let isString = isType('String'); // 缩小了函数的范围
let isNumber = isType('Number');

console.log(util.isString('abc'));
console.log(util.isNumber(123));

// 函数柯理化、偏函数(有的人统称偏函数也叫柯里化函数) 将多个参数传入的形式转化成n个函数，并且每次传递的参数"是一个"
// 柯里化函数要求参数的个数是确定的。
let r = sum(1, 2, 3, 4, 5, 6, 7);

// 偏函数 ，下面的参数一下传递了一个以上
let r1 = sum(1, 2)(3)(4, 5, 6)(7); // 缩小了函数的范围
//  作业：是自己实现一个通用的函数柯里化
// let newType = currying(isType)
// let isString = newType('String')

// let newSum = currying(sum);
// sum(1,2,3)(4,5)(6,7)

// 反柯里化 放大函数的范围
// Object.prototype.toString.call(val) -> toString()
// 高阶函数的两种功能，1) 可以扩展功能, 2) 预制参数

```





扩展：判断数据类型

1. typeof 可以判断基础类型 typeof null == ’object‘ （缺陷就是只能判断基础类型），不能判断 null

   > 面试题：为什么typeof null 返回 ‘object’ ？
   >
   > 因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑，在判断数据类型时，使用**低位存储的二进制数据进行变量类型信息的判断**，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。
   >
   > | 数据类型     | 机器码标识     |
   > | ------------ | -------------- |
   > | 对象(Object) | 000            |
   > | 整数         | 1              |
   > | 浮点数       | 010            |
   > | 字符串       | 100            |
   > | 布尔         | 110            |
   > | `undefined`  | -2^31(即全为1) |
   > | `null`       | 全为0          |

2. Object.prototype.toString.call 比较严格（知道数据的类型，但无法细分谁是谁的实例）

   > ```js
   > Object.prototype.toString.call(undefined)       //  '[object Undefined]'
   > 
   > Object.prototype.toString.call(new Date)        // '[object Date]'
   > 
   > Object.prototype.toString.call(1)      // '[object Number]'
   > 
   > Object.prototype.toString.call('as')      // '[object String]'
   > 
   > Object.prototype.toString.call(/123/)      // '[object RegExp]'
   > 
   > Object.prototype.toString.call(function fn(){})       // '[object Function]'
   > 
   > Object.prototype.toString.call(Symbol())     //  '[object Symbol]'
   > 
   > Object.prototype.toString.call(true)        // '[object Boolean]'
   > 
   > Object.prototype.toString.call(null)        // '[object Null]'
   > 
   > Object.prototype.toString.call({})          //  '[object Object]'
   > 
   > Object.prototype.toString.call(new Set())       //  '[object Set]'
   > 
   > Object.prototype.toString.call(new WeakMap())      // '[object WeakMap]'
   > ```

3. instanceof xxx 是 Xxx 的实例

   > ({})instanceof Object       // true

4. constructor 找到对应实例的构造函数



**柯里化**（JavaScript 设计模式一书中有实现）

缩小函数的调用范围，柯里化函数要求参数是固定。

```js
Function.prototype.fun = function (n) {
  let len = 0;
  let arr = [];
  let remFun = (value) => {
    len++;
    arr.push(value);
    if (len === n) {
      return this(...arr);
    } else {
      return remFun;
    }
  };
  return remFun;
};

function sum(...args) {
  return args.reduce((current, next) => {
    return current + next;
  });
}

let test = sum.fun(6);

console.log(test(1)(2)(3)(4)(5)(6));
```

反柯里化使用 call 在增大函数的调用范围。



### 异步串行

```js
const fs = require('fs');

let school = {};

fs.readFile('./name.txt', 'utf8', function (err, data) {
  school.name = data;
  fs.readFile('./age.txt', 'utf8', function (err, data) {
    school.age = data;
  });
});
```



### 异步并发

**异步代码是无法通过 try catch 捕获异步任务中的错误**，所以在 node 中的异步回调函数内部处理错误并作为回调函数的第一个参数返回。

```js
function after(times, callback) {
  // 高阶函数来解决异步并发问题
  let data = {};
  return function (key, value) {
    // out
    data[key] = value;
    if (--times === 0) {
      callback(data);
    }
  };
}
let out = after(2, (data) => {
  console.log(data);
});
fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
  out('age', data);
});
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
  out('name', data);
});
```



### 发布订阅模式

```js
const fs = require('fs');
const path = require('path');

// 函数是为了组合的时候方法
// 类用来封装逻辑的 高内聚
const events = {
  _arr: [], // 用来存放订阅的事
  on(callback) {
    this._arr.push(callback);
  },
  emit(key, value) {
    this._arr.forEach((fn) => fn(key, value));
  }
};

events.on((key, value) => {
  console.log('属性' + key + '读取完毕');
});

const school = {};
events.on((key, value) => {
  school[key] = value;
  if (Object.keys(school).length === 2) {
    console.log(school);
  }
});

fs.readFile(path.resolve(__dirname, './name.txt'), 'utf-8', function (err, data) {
  events.emit('name', data);
});
fs.readFile(path.resolve(__dirname, './age.txt'), 'utf-8', function (err, data) {
  events.emit('age', data);
});

// > 可以利用发布订阅实现解耦合 vue.eventsBus

// 观察者模式  vue2中有一套观察者模式， 每次数据变化了要通知视图更新  （观察者模式也是基于发布订阅的）

// vue2 中属性@xxx="fn" 都是发布订阅  this.emit()
// 视图更新就是观察者模式
```



### 观察者模式

```js
// 观察者模式基于发布订阅模式
// 被观察者、观察者 （设计模式都是基于类的）

class Subject {
  // 被观察者
  constructor(name) {
    this.name = name;
    this.observers = [];
    this.state = '开心';
  }
  attach(observer) {
    this.observers.push(observer);
  }
  setState(newState) {
    if (newState !== this.state) {
      this.state = newState;
      this.observers.forEach((o) => o.update(this));
    }
  }
}

class Observer {
  // 观察者
  constructor(name) {
    this.name = name;
  }
  update(subject) {
    console.log(subject.name + ':' + subject.state, this.name);
  }
}

let s = new Subject('小宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');

s.attach(o1);
s.attach(o2);

s.setState('不开心了');
s.setState('开心了');

// 将观察者存到被观察中。

// vue2中用到的是观察者模式 watcher
```

**发布订阅和观察者模式的区别:**

区别在于发布和订阅是否存在关系。发布订阅中两者没有直接关系，没订阅也可以发布，没发布也可以订阅。

观察者模式是基于发布订阅的，同时观察者和被观察者之间是有关系的。

在 vue 中就是数据变化更新视图，监控数据的变化，数据变化后需要更新视图。



## Promise

Promise 本身还是基于回调函数实现异步的。

重点思路：

- 创建 promise 实例时传入的回调函数是同步回调(executor)，且该回调函数接受两个函数：resolve 和 reject 作为参数
- 每个 promise 实例有可能是三种状态中的一种：pending, fulfilled 或 rejected
- resolve 和 reject 可以改变 promise 实例对象的状态 pending=> fulfilled 或者 pending => rejected
- executor 函数执行报错时，调用 reject 函数
- 同一个 promise 实例可以调用多次 then 函数
- promise 可以链式调用
- then 方法调用时是同步执行的，传给 then 方法的 onFulfilled 函数和 onRejected 函数是可选的
- then 方法同步执行的时候，会首先判断 onFulfilled 函数和 onRejected 函数是否传值，没传则用默认值
- then 方法执行时会先判断给方法的 peomise 实例对象的 state 是否不为 pending，如果不是，则根据 state 的状态立即执行 onFulfilled 函数或者 onRejected 函数，并将实例上的 this.value 或者 this.reason 传给对应的回调函数并且该回调函数会立即执行
- 如果 then 方法执行时，对应的 promises 实例的状态仍就时 pending，则将对应的 onFulfilled 函数和 onRejected 函数订阅到 promise 实例的对应属性上存放起来
- onFulfilled 函数和 onRejected 函数是有返回值的，返回值的不同情况： 非 promise 实例数据，抛出错误，promise 实例
- onFulfilled 函数和 onRejected 函数是两个异步执行的任务，原生中是微任务

```js
// 最基本版本的promise，没有实现链式调用

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;

    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.state === REJECTED) {
      onRejected(this.reason);
    }

    if (this.state === PENDING) {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}
```

```js
// 1.默认三个状态
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
  }
  // 如何判断一个值是不是promise?  有没有then方法，有then方法的前提得是 x是一个对象或者函数
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false;
    try {
      let then = x.then; // 有then就是promise吗？ {then:123}
      if (typeof then === 'function') {
        // {then:function(){}}
        //  如果有一个then方法那么就说他是promise
        // 这里就是promise 要判断是成功的promise还是失败的promise
        // 这里直接用上次取出的then来继续使用，防止再次取then发生异常
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        ); // x.then(成功的回调，失败的回调)
      } else {
        // {}  {then:'123'}
        resolve(x); // 这里直接成功即可 普通值的情况
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e); // 直接失败即可
    }
  } else {
    resolve(x); // 这里直接成功即可 普通值的情况
  }
}
class Promise {
  constructor(executor) {
    this.status = PENDING;
    // 这里可以用一个变量，为了看的清除 用2来表示
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = []; // 存放成功的回调的
    this.onRejectedCallbacks = []; // 存放失败的回调的
    const resolve = (value) => {
      // 这里我们添加一个规范外的逻辑 让value值是promise的话可以进行一个解析
      if (value instanceof Promise) {
        // 递归解析值
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject); // 3.这个代码执行的时候可能会发生异常
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 4.调用then的时候来判断成功还是失败
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            // 执行对应的回调时发生异常就执行promise2的失败
            reject(e);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            // 执行对应的回调时发生异常就执行promise2的失败
            reject(e);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          // 放自己的逻辑....
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              // 执行对应的回调时发生异常就执行promise2的失败
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              // 执行对应的回调时发生异常就执行promise2的失败
              reject(e);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  catch(errorCallback) {
    return this.then(null, errorCallback);
  }
}
// 原生不支持此方法
Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
// npm install promises-aplus-tests -g 全局安装只能在命令行中使用
// promises-aplus-tests promise-3.js

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};
module.exports = Promise;
```

### promise 的其他方法

#### 延迟对象

```js
Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

// 使用：
function readFile(...args) {
  let dfd = Promise1.deferred(); // 创造一个延迟对象， 可以获取到promise和resolve及reject属性
  fs.readFile(...args, function (err, data) {
    if (err) return dfd.reject(err);
    dfd.resolve(data);
  });
  return dfd.promise; // 返回promise实例

  // return new Promise((resolve,reject)=>{
  //     fs.readFile(...args,function(err,data){
  //         if(err) return reject(err);
  //         resolve(data);
  //     })
  // })
}
```

#### resolve 和 reject

注意点：

Promise.resolve 在传参为另一个 promise 的时候，则会有等待的效果，取用解析后的结果继续向下执行。

Promise.reject 则在传参为另一个 promise 的时候，则不会有等待的效果。

针对注意点的使用案例：

```js
let p = new Promise1((resolve, reject) => {
  setTimeout(() => {
    resolve('xxxxx');
  }, 3000);
});
Promise.resolve(p).then(
  (data) => {
    console.log(data); // 3秒后打印xxxx
  },
  (reason) => {
    console.log(reason);
  }
);

Promise.reject(p).then(
  (data) => {
    console.log(data);
  },
  (reason) => {
    console.log(reason); // 打印状态为pending的promise对象
  }
);
```

```js
class Promise{
    constructor(executor){
        this.state = PENDING
        this.value = undefined
        this.reason = undefined

        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value)=>{
            // value可能是promise
            if(value instanceof Promise){   ++++++++++++++++++++++++
                return value.then(resolve,reject)  ++++++++++++++++++++++++
            }  ++++++++++++++++++++++++

            if(this.state===PENDING){
                this.state = FULFILLED
                this.value = value
                this.onResolvedCallbacks.forEach(fn=>fn())
            }
        }

        const reject = (reason)=>{
            if(this.state===PENDING){
                this.state = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn=>fn())
            }
        }

        try{
            executor(resolve,reject)
        }catch(error){
            reject(error)
        }

    }
}



Promise.resolve = function (value){
    return new Promise((resolve,reject)=>{
        resolve(value)
    })
}


Promise.reject = function (reason){
    return new Promise((resolve,reject)=>{
        reject(reason)
    })
}
```

#### catch

注意点：

catch 本质就是 then 函数，同时 catch 后面可以继续 then

```js
class Promise {
  catch(callback) {
    return this.then(null, callback);
  }
}
```

#### finally

注意点：

- 无论 promise 成功还是失败都会走到 finally
- 前面成功或者失败的数据都不会作为参数传给 finally 中
- finally 中的回调中可能有异步任务

```js
// 使用
new Promise((resolve, reject) => {
  //resolve('成功');
  reject('失败'); // 有个逻辑 无论成功和失败都要执行
})
  .finally(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // clearTimeout
        resolve();
        console.log('finally');
      }, 1000);
    });
  })
  .then((v) => {
    console.log('成功', v);
  })
  .catch((r) => {
    console.log('catch', r);
  });
```

实现：

```js
Promise.prototype.finally = function (finalCallback) {
  return this.then(
    (value) => Promise.resolve(finalCallback()).then(() => value),
    (reason) =>
      Promise.resolve(finalCallback()).then(() => {
        throw reason;
      })
  );
};
```

#### all（异步并发）

注意点：

- 都成功才算成功，有一个失败就失败,且该单个 promise 的失败原因就是 all 的失败原因

- 成功的数组中的数据是按照顺序排放的

使用：

```js
Promise.all([
  readFile(path.resolve(__dirname, 'name.txt'), 'utf8'),
  readFile(path.resolve(__dirname, 'age.txt'), 'utf8'),
  13
])
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
```

实现：

```js
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let times = 0;
    function processData(key, value) {
      arr[key] = value;
      if (promises.length === ++times) {
        resolve(arr);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then((value) => {
        processData(i, value);
      }, reject);
    }
  });
};
```

#### race

**`Promise.race(iterable)`** 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

```js
Promise.race = function (iterable) {
  return new Promise((resolve, reject) => {
    for (let i = o; i < iterable.length; i++) {
      Promise.resolve(iterable[i]).then(resolve, reject);
    }
  });
};
```

#### allSettled

`Promise.allSettled()`方法返回一个在**所有**给定的 promise 都已经`fulfilled`或`rejected`后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

当有多个彼此不依赖的异步任务成功完成时，或者总是想知道每个`promise`的结果时，通常使用它。

相比之下，**`Promise.all()` 更适合彼此相互依赖或者在其中任何一个`reject`时立即结束。**

```js
Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let time = 0;
    function processData(index, value) {
      arr[index] = value;
      if (promises.length === ++time) {
        resolve(arr);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(
        (value) => {
          processData(i, value);
        },
        (reason) => {
          processData(i, reason);
        }
      );
    }
  });
};
```

```js
if (!Promise.allSettled) {
  Promise.allSettled = function (promises) {
    return new Promise((resolve) => {
      const data = [],
        len = promises.length;
      let count = len;
      for (let i = 0; i < len; i += 1) {
        const promise = promises[i];
        promise
          .then(
            (res) => {
              data[i] = { status: 'fulfilled', value: res };
            },
            (error) => {
              data[i] = { status: 'rejected', reason: error };
            }
          )
          .finally(() => {
            if (!--count) {
              resolve(data);
            }
          });
      }
    });
  };
}
```

Promise 可以使用链式调用解决回调地狱的问题，但是本身还是有依赖回调函数的，有代码嵌套问题。

```js
Promise.resolve().then(() => {
    console.log(0);
    return new Promise((resolve)=>{ // queueMircroTask(()=>x.then((y)=>resolve(y))
        resolve('a');
    })
}).then(res => {
    console.log(res)
})
Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(4);
}).then(() => {
    console.log(5);
})


答案：
// 0 1 2 3  'a' 4 5 这个结果是符合我们promiseA+规范
// 在ecmascript规范中，如果返回了一个promise， 会将这个promise再次包装一个微任务  0 1 2 'a' 3 4 5
```

扩展：

window.setTimeout，**`setTimeout()`**方法设置一个定时器，该定时器在定时器到期后执行一个函数或指定的一段代码。

```
var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);  // 附加参数，一旦定时器到期，它们会作为参数传递给function
```

返回值`timeoutID`是一个正整数，表示定时器的编号。这个值可以传递给[`clearTimeout()`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearTimeout)来取消该定时器。

需要注意的是 `setTimeout()` 和 [`setInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval) 共用一个编号池，技术上，`clearTimeout()` 和 [`clearInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 可以互换。但是，为了避免混淆，不要混用取消定时函数。

在同一个对象上（一个 window 或者 worker），`setTimeout()`或者`setInterval()`在后续的调用不会重用同一个定时器编号。但是不同的对象使用独立的编号池。



## 生成器函数

基于 Promise 的异步处理，其实 Promise 本身还是有一些问题，所以又衍生出了其他基于 Promise 的新语法特性对 Promise 的缺点进行规避。

Promise 串行通过 then 链解决，并行通过 Promise.all 来解决。如果功能更复杂，难免还是会有回调函数的嵌套，因为 promise 本身还是基于回调函数的。传给 then 方法 onfulfilled 和 onrejected 都是回调函数。所以 Promise 并没有完全解决嵌套问题，写异步时不够优雅。

为了让异步编程用同步代码风格来实现，解决方式有：

1. generator

   generator 生成器，用于生成迭代器。Generator + Promise。可迭代的数据类型的值都有内置的迭代器。不能被迭代就说明代类型的值内部没有迭代器。

   基本用法：

   ```js
   function* read(){  // 让函数体代码可以分段执行
       yiled 'vue'
       yiled 'vite'
       yiled 'node'
       return 123
   }
   let it = read()   // it,throw()   it.next()
   it.next()
   it.next()
   it.next()
   it.next()
   ```

   严格意义上的类数组：1. 有索引；2. 有长度；3. 能遍历

   ```js
   let likeArray = {0:1,1:2,2:3,length:3}   // 这个对象默认并不是严格意义上的类数组
   
   [...likeArray] // 报错  likeArray is not iterable   但是可以通过元编程来修改属性本身的逻辑，本身不能迭代，但可以添加迭代方法。
   
   Array.from(likeArray)  // [1,2,3]
   ```

   自己实现迭代方法：

   ```js
   let likeArray = {
       0:1,
       1:2,
       2:3,
       length:3,
       [Symbol.interayor](){
       	let index= 0  // 闭包
           return {
               next:()=>{
                   return {value:this[index],done:index===this.length}
               }
           }
   	}
   }
   
   let arr = [...likeArray]  // 会自动调用该对象中的迭代器方法




   let likeArray = {
       0:1,
       1:2,
       2:3,
       length:3,
       [Symbol.interayor]:function* (){
           let index = 0;
           let len = this.length;
           while(len!===index){
               yield this[index++]
           }
       }
   }

   let arr = [...likeArray]
   ```

```jsx
// 类数组转化成数组： length，索引，迭代方法

let likeArray = {
  // 内部迭代的时候会根据done的返回结果来继续调用next
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  get [Symbol.toStringTag]() {
    return 'likeArray';
  }
};
// Symbol 可以创建一个独一无二的值， 而且这个Symbol还可以实现“元编程” 可以改变js的原有的实现、底层机制
console.log(likeArray.toString()); // [object likeArray]

let likeArray = {
  // 内部迭代的时候会根据done的返回结果来继续调用next
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]() {
    // 要求返回值 而且标识是否迭代完成 {done:false/true,value:结果}
    let that = this; // 当前的类数组
    let index = 0;
    return {
      // 自己模拟了一个迭代器
      next() {
        return {
          value: that[index],
          done: index++ === that.length
        };
      }
    };
  }
};

let likeArray = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]: function* () {
    let index = 0;
    let len = this.length;
    while (index !== len) {
      yield this[index++];
    }
  }
};
   ```

```js
function* read() {
  try {
    let a = yield 'vue';
    consloe.log(a);
    let b = yield 'vite';
    consloe.log(b);
    let c = yield 'node';
    consloe.log(c);
  } catch (error) {
    console.log(error);
  }
}

let it = read(); // 生成一个迭代器  （协程）
it.next(); // 遇到yield 语句就暂停协程的执行，而执行父协程
it.next('a'); // 父协程启动read子协程的执行，并将参数作为yield语句的返回值传入子协程
it.throw('b'); // 父协程将错误抛给子协程去捕获
it.next('c');
```

yield 产出的结果可以等结果产出后再调用 next 开启子协程的继续执行。

```js
const fs = require('fs').promise;
const path = require('path');

function* read() {
  let name = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
  let age = yield fs.readFile(path.resolve(__dirname, name), 'utf8');
  return age;
}

let it = read();
let { value, done } = it.next();
if (!done) {
  value
    .then((data) => {
      let { value, done } = it.next(data);
      if (!done) {
        value
          .then((data) => {
            let { value, done } = it.next(data);
            if (done) {
              console.log(value);
            }
          })
          .catch((error) => {
            it.throw(error);
          });
      }
    })
    .catch((error) => {
      it.throw(error);
    });
}
```

### CO 库

异步串行写为同步方式需要通过函数递归来调用。

自己实现一个迭代器，用来迭代生成器函数。

```js
const fs = require('fs').promises; // 这里拿到的所有fs都是promise方法fs.readFile
const path = require('path');
function* read() {
  // 预期这样实现
  let fileName = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
  let content = yield fs.readFile(path.resolve(__dirname, fileName), 'utf8');
  return content;
}
// const co = require('co'); // 这是一个第三方模块 用之前要安装

function co(it) {
  return new Promise((resolve, reject) => {
    function next(v) {
      // 异步迭代写一个迭代函数递归调用
      let { value, done } = it.next(v);
      if (!done) {
        Promise.resolve(value).then((data) => {
          next(data);
        }, reject); // (error)=>{it.throw(error)}
      } else {
        resolve(value); // 迭代完毕
      }
    }
    next();
  });
}
co(read())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
```

### 实现 generator 函数(状态机)

```js
function* read(){
    let a = yield 'vue'
    consloe.log(a)
    let b = yield 'vite'
    consloe.log(b)
    let c = yield 'node'
    consloe.log(c)
}


const regeneratorRuntime = {
    mark(gen){
        // 标记作用
        return gen
    }
    wrap(iteratorFn){
       const _context = {
           next:0,
           sent:null,
           done:false，
           stop(){
               _context.done = true
           }
       }
       return {
           next(v){
           		_context.sent = v
               let value = iteratorFn(_context)
               return {value,done:_context.done}
           }
       }
    }
}


// babel转
"use strict";

var _marked = /*#__PURE__*/regeneratorRuntime.mark(read);

function read() {
  var a, b, c;
  return regeneratorRuntime.wrap(function read$(_context) {
    while (1) {    // 一般while(true)  表示该函数是一个   状态机   ，根据状态的变化实现对应的逻辑
        // 下面的0，2，6，10，12都是babel自己设置的，只起标识作用
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;   // _context.next：指针
          return 'vue';

        case 2:
          a = _context.sent;
          consloe.log(a);
          _context.next = 6;
          return 'vite';

        case 6:
          b = _context.sent;
          consloe.log(b);
          _context.next = 10;
          return 'node';

        case 10:
          c = _context.sent;
          consloe.log(c);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}


let it = read()
console.log(it.next());
console.log(it.next('aaa'));
console.log(it.next('bbb'));
console.log(it.next('ccc'));


// wrap 的使用会传入编译后的函数（变成了switch case的模式将一个函数进行了拆分，根据_context.next 来决定执行对应的逻辑）
//  wrap函数的返回结果是迭代器迭代器要有next方法 （next函数）
// 每次用户会调用next方法，传入对应的值， 这个值会被保留在_context.sent上， 走下一次调用函数的时候将其取出赋值给变量
```

整个 genertator 构造器函数的实现就是依靠的状态机，给函数提供闭包中的一个上下文，上下文中有一些列的标识或方法去修改该上下文中的标识，根据标识不同走不同逻辑。

### async + await

- async 函数默认执行后就会返回一个 promise，
- 内部是支持 tryCatch,当内部有 tryCatch 时，内部抛错会别捕获，外出的 promise 则不会再触发 onRejected

```js
const fs = require('fs').promises; // 这里拿到的所有fs都是promise方法fs.readFile
const path = require('path');

// async + await = generator + co 来实现的
async function read() {
  // 预期这样实现
  let fileName = await fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
  let content = await fs.readFile(path.resolve(__dirname, fileName), 'utf8');
  return content;
}

async function read() {
  // 预期这样实现
  try {
    let fileName = await fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
    let content = await fs.readFile(path.resolve(__dirname, fileName), 'utf8');
    return content;
  } catch (error) {
    console.log(error);
  }
}

read()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log('c', err);
  });
```

```js
'use strict';
// co
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  // key -》 next /throw
  try {
    var info = gen[key](arg); // it.next(arg)
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  // fn 就是一个generator
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args); // 获取到iterator， 因为生成器执行完毕后返回的是迭代器
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function read() {
  return _read.apply(this, arguments);
}

function _read() {
  _read = _asyncToGenerator(
    regeneratorRuntime.mark(function _callee() {
      var name, age;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');

            case 2:
              name = _context.sent;
              _context.next = 5;
              return fs.readFile(path.resolve(__dirname, name), 'utf8');

            case 5:
              age = _context.sent;
              return _context.abrupt('return', age);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _read.apply(this, arguments);
}

//1) async 方法会变成一个promise
```

## 浏览器中的事件环

![image-20220714211548498](..\typora-user-images\image-20220714211548498.png)

下面几段代码在浏览器中的表现：

```html
<script>
  document.body.style.background = 'red';
  console.log(1);
  Promise.resolve().then(() => {
    console.log(2);
    // 如果使用getComputedStyle能强制同步渲染
    document.body.style.background = 'yellow';
  });
  console.log(3);
</script>
```

本轮同步代码执行，先将 body 的背景颜色设为 red，然后打印 1，将 Promise 的 then 中的回调函数加入到本轮执行栈中微任务队列中等待执行，再打印 3，本轮同步代码执行完毕，现在开始清空微任务队列，打印 2，然后将 body 的背景颜色设置为 yellow，本轮事件循环任务结束，js 引擎线程将主线程释放给渲染线程执行渲染，最后一直都是 yellow 的背景颜色。

```js
<script>
        document.body.style.background = 'red';
        console.log(1)
        setTimeout(()=>{
            console.log(2)
            document.body.style.background = 'yellow';
        })
        console.log(3);
</script>
```

本轮同步代码执行，先将 body 的背景颜色设为 red，然后打印 1，将 setTimeout 中的回调函数加入到宏任务队列中等待执行，再打印 3，本轮同步代码执行完毕，现在开始清空微任务队列，微任务为空。接下来就有两种情况：

1. js 引擎在该帧内还有时间执行代码，本轮事件循环任务结束，js 引擎线程继续开启下一轮事件循环，取出前面宏任务队列中的代码，进行新一轮事件循环，打印 2 并将 body 的颜色设为 yellow，往后再没有可执行的代码，然后等待渲染线程显然页面，表现为一直都是 yellow 的背景颜色。（yellow 不闪烁）
2. js 引擎在该帧内没有时间执行代码，本轮事件循环任务结束，js 引擎线程将主线程释放给渲染线程执行渲染，渲染线程将页面渲染为 red，然后开启下一轮事件环任务，打印 2 并将 body 的颜色设为 yellow，往后再没有可执行的代码，然后等待渲染线程显然页面，表现为 yellow 的背景颜色。（red 到 yellow 闪烁）

```html
<button id="button">按钮</button>
<script>
  button.addEventListener('click', () => {
    console.log('listener1');
    Promise.resolve().then(() => console.log('micro task1'));
  });
  button.addEventListener('click', () => {
    console.log('listener2');
    Promise.resolve().then(() => console.log('micro task2'));
  });
  button.click(); // click1() click2()
</script>
```

代码模拟点击的情况，绑定的事件处理函数是同步执行的。

而用户点击的情况，事件处理函数会被追加到宏任务队列中进行执行。

```html
<script>
  Promise.resolve().then(() => {
    console.log('Promise1');
    setTimeout(() => {
      console.log('setTimeout2');
    }, 0);
  });
  setTimeout(() => {
    console.log('setTimeout1');
    Promise.resolve().then(() => {
      console.log('Promise2');
    });
  }, 0);
</script>
```

```js
console.log(1);
async function async() {
  console.log(2);
  await console.log(3);
  console.log(4);
}
setTimeout(() => {
  console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
  console.log(6);
  resolve(7);
});
promise.then((res) => {
  console.log(res);
});
async();
console.log(8);
```

## node 代码调试

### 方式一

Node 内置命令行调试器，通过 `node inspect` 命令执行，通过输入命令来描述行为不如可视化操作高效。

### 方式二

在运行 Node.js 程序时开启一个进程来监听调试请求，默认的监听端口是 9229。每个监听进程都被分配了唯一的 UUID，调试客户端通过 `ws://{host}:{port}/{UUID}` 和监听进程建立 websocket 通信。

Node.js 开启调试服务被动等待，调试客户端主动发起对接。

1. 开启调试服务 (跟随程序启动)

   node --inspect name.js: 启动调试服务，跑完程序就退出。除非是有异步任务在，不然完全不给调试器对接的机会。

   node --inspect-brk name.js: 启动完调试服务就停在开头，等着调试器接入，接入后断在第一行代码等待下一步操作。

   node--inspect-bar=8080 name.js

   ![image-20220428203239608](.\typora-user-images\image-20220428203239608.png)

   注意点：

   > 对于 `node` 命令之外的启动脚本，例如 `npm/yarn/vercel/next`。`--inspect` 是 Node.js 的标识符，其他脚本无法识别，这种情况可以设置变量 `NODE_OPTIONS` 来解决。
   >
   > ```shell
   > NODE_OPTIONS='--inspect' vercel dev
   > ```

 在已运行的程序上开启调试服务，`kill -s SIGUSR1 49026` 作用是给进程 id 是 49026 的进程发送 `SIGUSR1` 信号，当 Node.js 进程收到 `SIGUSR1` 时，将启动调试服务。

2. 客户端调试 Chrome DevTools 会根据地址列表自动检查调试服务启动情况，默认地址有本地的 9229 和 9222 端口。`chrome://inspect` 面板负责调试管理。 ![image-20220428204207581](.\typora-user-images\image-20220428204207581.png)

### VSCode

配置 launch.json 文件，手动配置来启动调试。

VSCode 提供了两种启动模式：

- `launch` 启动程序并接上调试器
- `attach` 调试器接入正在运行的程序

基于这两种模式以及其他配置字段，VSCode 能支持多种调试场景。在需要调试的目录下创建或者 vscode 自动创建.vscode 文件夹，该文件夹中创建 launch.json 文件。

文件参考内容：

```json
{
  "name": "Attach",
  "port": 9229,
  "request": "attach",
  "skipFiles": [ // 单步调试不会进入，抛出未捕获异常不会断住，手动设置断点仍会起作用
    "<node_internals>/**"   // 表示跳过node源代码的调制
  ],
  "type": "pwa-node",
  "file": "${workspaceFolder}/index.html"
}




{
  "name": "Launch Program",
  "program": "${workspaceFolder}/app.js", // 指定程序入口文件
  // "args": ["--listen", "8080"]，// 传入参数 node app.js --listen=8080
  "request": "launch",
  "skipFiles": [
    "<node_internals>/**"
  ],
  "type": "pwa-node"
}


```

```js
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"   // 表示不调试node中的源码部分，如果需要调试node源码则将这项删掉
      ],
      "program": "${workspaceFolder}\\types\\my.d.ts",   // 要调试的文件
      "outFiles": [
        "${workspaceFolder}/**/*.js"
      ]
    }
  ]
}
```

## 介绍

Node 能干什么？特点？node 中模块的实现原理？require 引用一个文件的原理？被引入文件导出原理？

### 是什么

nodejs：是 js 运行时，让 js 能跑在服务器上。

在浏览器端 JavaScript 由：ECMAScript + BOM + DOM 组成

在 nodejs 中 JavaScript 由：ECMAScript + 内置模块 + 第三方模块 组成(没有 window，document 等对象)

### 特点

node 中实现了一些**新的有别于浏览器的异步 API**，而且它没有完全使用浏览器中的**事件触发线程**（事件环）来管理异步任务。 异步 api：（i/o，定时器等），node 中对这些异步任务的管理也有自己的一套事件环机制。

在 node 中主线程也是单线程的。java 类后台是多线程同步的，node 后台是单线程异步的。

多线程语言，客户端每来一个请求，服务端就会创建一个单独的线程来处理该请求。请求多就会开多个线程。多线程语言内部都有一个线程池的概念，多个请求到来时，会在线程池中拿到对应的线程去处理，超过线程池中线程数量的请求就需要排队处理。多线程语言比较适合处理 cpu 密集型操作（压缩，合并，加密等计算）； 线程多会占用一定的内存空间，锁问题（多个操作操作同一个资源就会上锁）。 感觉多线程是并发操作，其实是依赖时间片扭转实现并发。

单线程语言，不必开启多个线程，节约内存，单线程语言处理 CPU 密集型可能会发生阻塞。适合 i/o 密集型（文件读写），web 场景基本都是文件读写，（nginx 也是单线程的，适合处理高并发），node 底层的系统操作依然是多线程的（比如多个请求都是读取文件内容，nodejs 中的主线程只是依次将读取任务派发给底层的其他多线程模块去处理的，并不会阻塞）。异步和文件读写，靠底层的多线程去执行这些异步任务，任务完成后，通过事件环将结果返回，node 中的专门触发线程读取回调并执行。node 不适合 cpu 密集型的，适合 i/o 密集型的。

### 应用场景

- 为客户端服务的中间层（bff，代理），解决跨域，处理数据的结构

- ssr，在服务端解析 js 语法，可以解析 vue 和 react 中的语法实现服务端渲染，将框架代码在服务器端运行，运行完成后生成一个 html 返给前端完整渲染后的结果
- 做工具（打包工具，构建工具）， 但是现在逐渐转向 Esbuild
- 日志收集系统
- 提供接口，做服务端（egg.js,nest.js）

### 异步同步阻塞非阻塞

异步同步和阻塞非阻塞

是否异步指代的是被调用方（小姑娘）来决定 调用方（我）是同步还是异步

阻塞和非阻塞指代的是调用方（我）的状态

同步不一定阻塞，也可能是非阻塞的，但非阻塞的情况很少。不存在异步阻塞的情况。

一般是异步非阻塞，同步阻塞

## 全局对象

浏览器中全局对象是 window，在 node 中全局对象是 global。全局对象中的属性可以直接访问，js 内置的方法仍旧可以使用。

```js
console.dir(global, { showHidden: true }); // 更加详细的打印对象属性
```

在 node 中一个 js 文件下直接访问 this，this 指向的是一个空对象，这是模块化的结果，模块化机制实现不同文件之间的引用。

node 环境下：

```js
console.log(this)(
  // {}  空对象，指代的是module.exports

  function () {
    console.log(this); // global对象
  }
)();
```

- 传统使用单例模式实现模块化的封装，会有调用过长的问题

- IIFE，立即执行函数，导出 IIFE 中的内容，利用闭包需要再拆分文件

- seajs，requirejs 类似于 jsonp 方式，动态请求一个文件并在拿到文件后再做一些事

- import / export default ，前端模块化是基于 http 请求的。在 webpack 打包项目中没有看到发请求，使用为 webpack 将引用的代码打包到统一的文件而不发请求了（除非拆包）。 import 一个文件，浏览器会自动的去发起一个请求，返回执行结果后使用。

- 服务端实现模块化就不需要发请求，因为服务端可以用文件读写的能力更简单的实现模块化。

**模块化的概念就是规定如何使用别人的内容，如何将内容导出给别人使用。**

面试题：浏览器中的事件环和 node 中的事件环的区别。

## commonjs

commonjs 规范：

- 每个文件都是一个模块
- 引用用 require
- 导出用 module.exports

使用 commonjs 规范引入一个文件，通过 node 内置的功能去先找到并读取文件，将读取的文件内容包在一个立即执行的函数中，该立即执行函数中返回 module.exports。

node 原生不支持 ES6 的模块化语法，即直接在 js 文件中书写 import 'xxxxx.js'，是没法识别的，如果想要 node 支持 import 语法，则需要先将 js 后缀改为 mjs，同时在 package.json 中添加"type":"module"。

package.json:

```json
{
    "type":"module"   // 结合.mjs
}

{
    "type":"commonjs"
}
```

node 中的模块有三种：

- 内置模块
- 第三方模块，先安装在引用
- 自定义模块，以相对路径或者绝对路径进行使用

### 全局对象

node 中的全局对象是 global 对象，该对象上的属性或者方法都可以直接访问，同时在模块化开发中，如果在 global 对象上挂载了变量，则可以在不同模块文件中访问到（污染全局变量）。

有五个属性，它们不是 global 的属性或者方法，但是在每个模块中都可以直接访问：

- require：引用其他模块的方法
- module：当前模块
- exports：一个对象
- \_\_dirname：当前文件所在的绝对路径
- \_\_filename：当前文件的绝对路径

上面这几个属性是在模块包裹的函数传入的，也是 argument 上对应的。

在 commonjs 模块化规范中 require 方法底层就是依赖的 fs.readFileSync( )同步读取模块文件内容的，会有阻塞。

## 模块化原理前置支持

### fs

内置模块：

fs 模块中有两种 api，同步和异步。同步的性能好，因为不用开启其他线程。

什么时候用同步什么时候用异步？如果用户请求，如果采用同步则会发生阻塞问题，如果代码刚启动时用同步则没有负面影响。

fs.readFileSync(url[,'utf8'])

fs.existsSync(url)，该方法的异步方法被废弃。

操作文件夹，文件夹就是一个树结构。

目录删除和创建。

```js
fs.mkdir(path.resolve(__dirname.'a'),function(err){
    //....
})

fs.mkdir(path.resolve(__dirname.'a/b/c/d'),function(err){   // 报错，该api要求在创建文件时需要先有上级目录
    //....
})

fs.mkdir(path.resolve(__dirname.'a/b/c/d'),{recursive:true},function(err){
    //....
})


fs.rmdir(path.resolve(__dirname,'a'),cb)   // 如果a目录下不为空，则不能删除，也支持{recursive:true}递归删除


fs.readdir(path.resolve(__dirname,'a'),function(error,dirs){  // 只读子文件夹和子文件

})

fs.stat(path.resolve(__dirname,'a'),function(error,statObj){   // 如果该路径不存在文件或者文件夹，则报错
    statObj.isFile(path.resolve(__dirname,'a'))   // 是否是文件
    statObj.isDirectory(path.resolve(__dirname,'a'))  // 是否是文件夹
})

fs.unlink(path,cb)  // 删除文件




fs.readdir(path.resolve(__dirname,'a'),function(error,dirs){
    dirs.forEach(dir=>{
        fs.stat(path.resolve(__dirname,'a',dir),function(error,state){
            if(state.isFile()){
                fs.unlink(path.resolve(__dirname,'a',dir),function(){})
            }else{
                fs.rmdir(path.resolve(__dirname,'a',dir),function(){})
            }
        })
    })
})



// 异步串行删除   通过递归调用
function rmdir(filePath,cb){
    fs.stat(filePath),function(err,statObj){
        if(err) return cb(err)
        if(statObj.isFile()){   // 如果是文件
            fs.unlink(filePath,cb)
        }else{  // 如果是目录
            fs.readdir(filePath,function(err,dirs){
                if(err) return cb(err)
                dirs = dirs.map(dir=>path.resolve(filename,dir))
                let index = 0
                // 异步串行删除
                function next(){
                    if(dirs.length===index){   // 空目录直接删除
                        return fs.rmdir(filename,cb)
                    }
                    let dir = dirs[index++]
                    rmdir(dir,next)
                }
                next()
            })
        }
    }
}


// 异步并发删除  for循环
function rmdir(filePath,cb){
    fs.stat(filePath),function(err,statObj){
        if(err) return cb(err)
        if(statObj.isFile()){   // 如果是文件
            fs.unlink(filePath,cb)
        }else{  // 如果是目录
            fs.readdir(filePath,function(err,dirs){
                if(err) return cb(err)
                dirs = dirs.map(dir=>path.resolve(filename,dir))
                if(dirs.length === 0) fs.rmdir(filePath,cb)
                let times = 0
                function done(){
                    if(++times===dirs.length){
                        fs.rmdir(filePath,cb)
                    }
                }
                dirs.map(dir=>rmdir(dir,done))
            })
        }
    }
}


// 异步并发删除  promise
function rmdir(filePath){
    return new Promise((resolve,reject)=>{
        fs.stat(filePath),function(err,statObj){
            if(err) return cb(err)
            if(statObj.isFile()){   // 如果是文件
                fs.unlink(filePath,resolve)
            }else{  // 如果是目录
                fs.readdir(filePath,function(err,dirs){
                    if(err) return cb(err)
                    dirs = dirs.map(dir=>rmdir(path.resolve(filename,dir)))
                    Promise.all(dirs).then(()=>{
                        fs.rmdir(filePath,resolve)
                    })
                })
            }
        }
    })
}



// async await 方案删除
const fs = require('fs').promises
async function rmdir(filePath){
    let statObj = await fs.stat(filePath)
    if(statObj.isFile()){   // 如果是文件
        return fs.unlink(filePath)
    }else{
        let dirs = await fs.readdir(filePath)
        dirs = dirs.map(dir=>rmdir(path.resolve(filename,dir)))
        await Promise.all(dirs)
        return fs.rmdir(filePath)
    }
}
```

### path

path.resolve()这个方法根据路径解析出一个绝对路径而且**解析的路径是`以运行为基准`**，当拼接 ' / '时则直接回到磁盘根路径下。

C:\users\test\Desktop\node\one\1.js:

```js
const path = require('path');

console.log(path.resolve('note.md'));
```

在 C:\users\test\Desktop\node\one 目录下执行 node 1.js

打印：C:\users\test\Desktop\node\one\note.md

在 C:\users\test\Desktop\node 目录下执行 node one\1.js

打印：C:\users\test\Desktop\node\note.md

path.join()这个方法只是负责路径拼接，没有其他任何功能

如果有'/'路径的情况下不要使用 resolve，resolve 会将'/'视为绝对路径。

```js
console.log(path.resolve('note.md')); //js文件内部内容

// 在该js文件所在目录下执行 node xxx.js   则打印该文件所在的路径拼接上note.md
// 在该js文件所在的上一级目录下执行 node yyy/xxx.js   则打印该文件上一级的路径拼接上note.md
// 所以一般和__dirname进行拼接使用

path.extname(a.min.js); // .js

path.basename('a.js', '.js'); // a

path.dirname(); // 取处路径中的路径部分
```

### vm 模块

node 中的虚拟机模块，可以创建代码的执行环境。

将字符串当作代码来执行，eval()或者 new Function()。但是在 node 中还提供了第三个方法，借助内置模块 vm。

vm.runInContext()：指定一个上下文来运行字符串代码

vm.runInNewContext()：创建一个新的上下文来运行字符串代码

vm.runInThisContext()：指定在某个具体的上下文中来运行字符串代码

```js
const vm = require('vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Contextify the object.

const code = 'x += 40; var y = 17;';
// `x` and `y` are global variables in the context.
// Initially, x has the value 2 because that is the value of context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y is not defined.
```

eval()的不足是，它括号内的字符串代码可以访问外部环境中的变量。

eval 执行时能访问当前作用域下的变量。

new Function() 在 node 中可以产生一个全新的执行上下文，仅仅位于全局环境下。

```js
let a = 100;

let fn = new Function('console.log(a)');
fn(); // 报错，a is not defined

// 由 Function 构造函数创建的函数不会创建当前环境的闭包，它们总是被创建于全局环境，因此在运行时它们只能访问全局变量和自己的局部变量，不能访问它们被 Function 构造函数创建时所在的作用域的变量。这一点与使用 eval() 执行创建函数的代码不同。

var x = 10;

function createFunction1() {
  var x = 20;
  return new Function('return x;'); // 这里的 x 指向最上面全局作用域内的 x
}

function createFunction2() {
  var x = 20;
  function f() {
    return x; // 这里的 x 指向上方本地作用域内的 x
  }
  return f;
}

var f1 = createFunction1();
console.log(f1()); // 10   浏览器中运行的结果，不同于node中运行的结果
var f2 = createFunction2();
console.log(f2()); // 20

// 虽然这段代码可以在浏览器中正常运行，但在 Node.js 中 f1() 会产生一个“找不到变量 x”的 ReferenceError。这是因为在 Node 中顶级作用域不是全局作用域，而 x 其实是在当前模块的作用域之中。
```

## 模拟实现 require

### require 执行流程

在 node 的源码中执行 Module.prototype.require(path)； 然后调用 Module.\_load 加载某个模块文件，返回该方法执行结果：module.exports；

Module.\_resolveFilename 方法获取文件的绝对路径，因为之后要读取该文件，尝试添加后缀.js 或者.json，.node 等。

判断文件是否在缓存中

判断模块是否是原生的，如果不是原生模块，则直接创造模块 new Module，每个模块有一个 id，id 对应的值就是模块的绝对路径，还有一个属性叫 exports 代表文件的导出结果，默认是空对象。 new Module 创建完模块后，进行模块缓存。

缓存该模块，第一次加载时将文件所在路径作为 key，模块对象作为值缓存在一个对象中。

module.load(path):加载文件

findLongestRegisteredExtension(filename): 找对应的文件的后缀名注册过的对应的加载逻辑，js 文件有 js 的加载逻辑，json 有 json 的加载逻辑。加载采用了策略模式（Module.extensions(文件后缀)）。在 vite 中就是扩展了该策略模式，实现了对.vue 文件的加载。 可以根据该方法实现加载文件类型的扩展。

在 js 文件的策略模式源码中，采用 fs 模块的读取文件对应的内容，将内容传给 Module.\_compile,进行模块编译。

```js
fs.readFileSync(filename, 'utf8');
```

旧版使用调用 Module.wrap 方法对文件内容进行包裹一个函数，用 vm.runInThisContext 去包裹该函数， 然后创建一系列的变量`'exports','reqiure','module'，'__filename','__dirname'`,赋值：\_\_dirname,require,exports,module 等；执行包裹后的函数并传入前面创建的几个参数。

新版使用`vm.compileFunction(content,['exports','reqiure','module','__filename','__dirname']){....}`

读取文件内容，包裹自执行函数，返回 module.exports

### 模块实现

模块实现原理，在 commonjs 中加载一个模块就是去读取对应的文件内容，并且给这个文件内容包裹一个函数，并且执行该函数将函数的执行结果返回。

```js
const fs = require('fs');
const path = reqiure('path');
const vm = require('vm');

function Module(id) {
  this.id = id;
  this.exports = {};
}

Module._extensions = {
  // 策略模式加载不同策略
  '.js'(module) {
    // 读取js文件内容，并包裹一个函数
    let script = fs.readFileSync(module.id, 'utf-8');
    let fn = vm.compileFunction(
      script,
      ['exports', 'require', 'module', '__filename', '__dirname'],
      {
        filename: module.id
      }
    ); // 将字符串代码转为函数

    let exports = module.exports;
    let require = require;
    let filename = module.id;
    let dirname = path.dirname(filename);

    Reflect.apply(fn, exports, [exports, require, module, filename, dirname]);
  },
  '.json'(module) {
    let jsonStr = fs.readFileSync(module.id, 'utf-8');
    module.exports = JSON.parse(jsonStr);
  },
  '.node'() {}
};

Module._resolveFilename = function (id) {
  // 第二步
  const filename = path.resolve(__dirname, id);
  if (fs.existsSync(filename)) return filename; // 存在该文件就直接返回
  const exts = Object.keys(Module._extenstions); // 不存在则尝试添加后缀名后判断是否存在，都不存在则报错，存在则返回
  for (let i = 0; i < exts.length; i++) {
    // 加载顺序是根据策略模式中的书写顺序进行检测的
    let newPath = filename + exts[i];
    if (fs.existsSync(newPath)) return newPath;
  }
  throw new Error('Can not find modle' + id);
};

Module._cache = Object.create(null);

Module.prototype.load = function (filename) {
  let ext = path.extname(filename);
  Module._extensions[ext](this); // 根据扩展名采用对应的策略模式
};

function require(id) {
  // id为传入的文件路径          第一步
  // 将id转为绝对路径，没有后缀则尝试添加后缀，用路径找到对应文件
  let absPath = Module._resolveFilename(id);

  // 检查缓存模块是否存在
  let existsModule = Module._cache[absPath];
  if (existsModule) return existsModule.exports;

  const module = new Module(absPath);

  // 模块缓存
  Module._cache[absPath] = module;

  // 对模块进行加载
  module.load(absPath);

  return module.exports;
}
```

模块中的 exports，module.exports 和 this 的区别：

模块中最终返回的是 module.exports，但是在模块语法中执行了 exports=module.exports，同时将 exports 作为模块的 this 指向。

所以在模块中 this.xxx = xxx 等价于 exports.xxx = xxx。 （未修改 export 的指向以前，模块中的 this = exports）

在 commonjs 模块语法中，一个模块 moduel.exports = value，其中 value 变量的值如果是基本数据类型，那么这个变量的值在模块中发生改变后，在引入该模块的其他模块的值并不会改变，取的任就是模块第一次加载缓存下来的值。

```js
// a.js
let a = 1
setInterval(()=>{
    a++
},3000)

module.exports = a

// index.js
setInterval((0=>{
    let a = require('./a')
    console.log(a)   // 一直都是1
}))
```

```js
// a.js
let obj = {
    a:1
}
setInterval(()=>{
    obj.a++
},3000)

module.exports = obj

// index.js
setInterval((0=>{
    let obj = require('./a')
    console.log(obj.a)   // 会一直变
}))
```

而 ES 中的导出导出的是接口，这点和 commonjs 存在差异。

## process

process 进程对象中的重要属性：

每次 node 执行都会开一个进程，进程中有一些需要掌握的属性，使用场景和几率很高。global.process。

- platform：代码执行平台，写脚手架需要系统级别的配置文件，系统配置文件都是放在本机的用户下的。windows，mac 和 Linux 的系统配置文件所存放的路径都是不同的，可以根据 platform 区分平台，将对应的配置文件放在对应的平台目录下。

  process.platform

- nextTick(cb)：

  浏览器的事件环是每执行一个宏任务就会清空微任务。

- cwd：current working directory 当前的执行工作目录，运行打包时，找对应的配置文件，在当前目录下寻找执行路径。 process.cwd()

- argv：参数列表，用户命令行交互获取用户输入的参数，前两个参数是默认的（可执行文件 node 的路径， 被执行文件路径），后面是用户的参数。关于参数的解析有一些常用的第三方库：commonder yargs

  ```js
  let args = process.argv.slice(2).reduce((memo, current, index, array) => {
    if (current.startWith('--')) {
      if (!this[index + 1].startWith('--')) {
        memo[current.split(2)] = this[index + 1];
      } else {
        memo[current.split(2)] = true;
      }
    } else {
      memo[current] = true;
    }
    return memo;
  }, {});
  ```

- env：环境变量列表，实现一些工具时，需要区分环境变量，全局环境变量（**操作系统中的那些环境变量**），局部环境变量（临时设置环境变量）。

  在代码执行之前，设置一些临时的环境变量,进程一结束就被销毁（set , export），不同系统设置环境变量的语法不同，借助 cross-env 实现跨平台设置环境变量。

  ```shell
  set key=value node index.js   // windows

  export key=value node index.js  // mac
  ```

  process.env 中包含全局环境变量（操作系统中的那些环境变量）和 局部环境变量

  系统环境变量中被配置到 path 中的可执行文件的路径，可以在命令行中直接执行。

- chdir :修改代码执行的路径，cwd 方法可能受 chdir 的影响

  ```js
  process.chdir('../../../');
  ```

index.js

```js
// node index.js --port 3000

console.log(process.argv);
```

写工具无非就是创建一些配置文件，解析用户的执行操作等。

## node 中的事件环

同步代码先执行，执行过程中可能产生许多的异步逻辑。

```js
Promise.resolve().then(() => {
  console.log('promise');
});

setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setTimeout');
});

console.log(123);

process.nextTick(() => {
  console.log('nextTick');
});

// 控制台打印输出：
/*
123
nextTick
promise
setTimeout
setImmediate
*/
```

setImmediate 是 node 中新增的宏任务

nextTick 是 node 中新增的微任务（node 官方不这么叫），优先级最高的微任务。本轮主执行栈中的任务执行完后立即执行 nextTick ，然后再进入事件环中。

`process.nextTick()` 从技术上讲不是事件循环的一部分。相反，它都将在当前操作完成后处理 `nextTickQueue`， 而不管事件循环的当前阶段如何。这里的一个*操作*被视作为一个从底层 C/C++ 处理器开始过渡，并且处理需要执行的 JavaScript 代码。

任何时候在给定的阶段中调用 `process.nextTick()`，所有传递到 `process.nextTick()` 的回调将在事件循环继续之前解析。

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

**在 node 中宏任务队列不只一个，将宏任务队列进行了细分。node 中是自己实现的事件环——libuv。**

上图左侧的每一个都是一个队列。

**timers：存放所有定时器任务**

pending callbacks：上次循环没有执行完毕的

idle,prepare：node 内部使用的队列，开发者没法控制

**poll(轮询阶段)：处理 i/o 回调，在循环的过程中在此阶段阻塞，没有宏任务后在这个阶段休眠**

**check：setImmediate**

close callbacks：一些关闭的回调函数，如：`socket.on('close', ...)`

浏览器中的事件环在没有宏任务的时候会休眠。

开发者主要关心的队列情况有，先只考虑宏任务，下图

![image-20220222080449935](.\typora-user-images\image-20220222080449935.png)

先在主执行栈中执行本轮同步代码，执行完后再执行 nextTick 相关任务，执行完 nextTick 相关任务后，开始进入事件环。在事件环中，先依次清空各个队列（从上往下）。如果走到 poll 阶段后，会检测 check 队列中是否有任务，有，则清空 poll 队列后向下继续执行 check 队列，然后循环回到 timers，然后再到 poll 中；如果没有，事件环运行则停在 poll 阶段等着，等自身任务队列中是否有新 i/o 任务入队，等 check 或者 timers 中有任务产生，如果是 check 中先有任务产生则向下执行，如果是 timers 中先有任务，则回到 timers 中开始向下执行。

node 中 v8 引擎负责解析 js 语法，而且可以直接调用 node 中的 api。

libuv 是负责执行 node 提供中的 api，执行过程会开启多个线程，执行完毕后放到队列中，会开启一个单独的事件线程来处理任务。 libuv 决定调用的任务是同步还是异步，如果是异步的话，执行后推入对应的任务队列依次执行。

微任务：微任务队列在每次宏任务执行完毕一个后就会被清空（这点和浏览器一样）。

注意在 node10 以前的版本中，是一个宏任务队列中的所有任务清空完后，再去清空微任务。

```js
setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setTimeout');
});

// 执行上述代码时，不一定谁先谁后打印，如果主执行栈中任务，nextTick执行完后进入事件环中，这时setTimeout已经执行入队后，则setTimeout先打印输出，反之，则setImmediate先打印输出。
// 如果在主执行栈中调用timer和setImmediate，则执行顺序会受性能影响，有可能进入到事件循环的时候定时器还没有到时间，则直接进入到check阶段
```

```js
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});


// 把这两个函数放入一个 I/O 循环内调用，setImmediate 总是被优先调用：使用 setImmediate() 相对于setTimeout() 的主要优势是，如果setImmediate()是在 I/O 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关

$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

## 模块查找流程

![image-20210418105915555](.\typora-user-images\image-20210418105915555.png)

## event 模块

发布订阅模式。 非常有利于代码的解耦合，比如有两个类，原本这了类是彼此独立不相干的，但是两个类的实例之间可以相互通信，一般使用类的继承或者继承原型链。，但是另一种方式就是使用发布订阅模式。

```js
const EventEmitter = require('events'); // 内置模块检测时候 会进行检测
// 发布订阅： 能解决什么问题？  异步， 解决代码耦合的问题 （组件通信）
const util = require('util');

function Girl() {}
util.inherits(Girl, EventEmitter);

let girl = new Girl(); // once

// 批处理 例如多次修改数据只更新一次页面

let flag = false;
girl.on('newListener', (type) => {
  // 此方法可以监控到用户绑定了哪些事件
  if (!flag) {
    process.nextTick(() => {
      girl.emit(type); // ?
    });
    flag = true;
  }
});
// 1.绑定事件触发newListener 但是立刻 emit了 ， 喝酒这件事还没放到队列中
girl.on('女生失恋了', () => {
  // {女生失恋了:[fn,fn,fn]}
  console.log('喝酒');
});
// 2.绑定事件触发newListener, 触发emit, 只有喝酒这在队列中
girl.on('女生失恋了', () => {
  console.log('逛街');
});
// 2.绑定事件触发newListener, 触发emit, 只有喝酒、逛街这在队列中
girl.on('女生失恋了', () => {
  console.log('哭');
});
// const shopping = ()=>{
//     console.log('逛街')
// }

// girl.once('女生失恋了',()=>{
//     console.log('哭')
// })
// girl.off('女生失恋了',shopping); // 取消绑定的事件
// girl.emit('女生失恋了') // 第一次执行完毕后在列表中移除了哭的这件事
// girl.emit('女生失恋了')
```

让构造函数继承另一个构造函数的原型方法：

- Fun.prototype = new Fnn()
- Object.create()
- Object.setPrototypeof()
- `Fun.prototype.__proto__` = Fnn.prototype

node 中的 util 模块提供一些原生 API

手写 event：

```js
function EventEmitter(){

}
EventEmitter.prototype.on = function (eventName,fn){
    if(!this._events) this._events = {};

    if(eventName !== 'newListener'){
       this.emit('newListener',eventName)
    }

    (this._events[evenName]||(this._events[eventName]=[])).push(fn)
}

EventEmitter.prototype.once = function (eventName,fn){  // 第一次执行后，将该回调移除
    if(!this._events) this._events = {};
    const once = ()=>{
        fn()
        this.off(eventName,once)
    }
    once.flag = fn
    this.on(eventName,once)
}

EventEmitter.prototype.off = function (eventName,fn){
    if(!this._events) this._events = {};
    let eventLists = this._events[eventName]
    if(eventLists){
         this._events[eventName] = eventLists.filter(item=>((item!=fn)&&(item.flag!=fn))
    }
}

EventEmitter.prototype.emit = function (eventName,...args){
    if(!this._events) this._events = {};
    let eventLists = this._events[eventName]
    if(eventLists){(
        eventLists.forEach(fn=>fn(...args))
    }
}

module.exports = EventEmitter
```

在 node 中有一个核心模块 util，该方法中有一个 inherits 方法实现两个构造函数的继承。util.inherits(ctor,superCtor)

## NPM

- 全局模块，在命令行中使用，常用的全局模块,npm,nrm,nvm

  nrm ls

  nrm use xxx

  npm copnfig list

  npm root -g：输出全局的软件包位置

  npm config ls :查看全局包安装地址（prefix）

全局安装的工具包虽然可以在任意路径命令行中执行，但是并不是通过配置系统的环境变量 path 下实现的而是将这个模块放到了 npm 目录下，而 npm 在系统变量 path 中，所以所有全局的工具模块都可以执行。

编写一个可以发布的第三方全局模块包：

写法一：一般可执行文件都在 bin 目录下的 www 文件中书写

- npm init -y

- package.json 文件中配置 bin 属性作为入口

```json
"bin": {
    'key': 'bin/www',    // 表示执行key命令对应的执行文件是bin目录下的www文件
	'xxx':'bin/yyy'
}

"bin": 'bin/www'  // 这样写的话，执行的命令就默认使用package.json中的name字段执行命令
```

- bin/www (bin 目录下的 www 文件，该文件没有后缀)

作为入口执行，之后发布到 npm 上后，别人全局安装后就会生成到对应包到的全局 npm 中。

**测试全局模块**

如果是测试全局模块，可以在当前的包下执行 npm link (--force)，该命令可以将包临时的放在全局的 npm 下。

npm unlink modulename（package.json 中的 name 字段）

可执行文件需要增加执行头 —— #! /usr/bin/env node

www 文件内容：

```
#! /usr/bin/env node
console.log('asd')
```

写法二：

1. npm init -y

2. 创建 node.js 文件（如果 package.json 中没有配置 main, 默认会将 index.js 作为入口，如果包中没有 index.js, 那么就必须配置 main）

3. 在全局包的 package.json 文件中添加 bin 这个 key，在其中指定自定义指令。告诉系统执行全局命令时需要执行哪一个 JS 文件。

   ```json
   "bin":{
       "wuyibo":"index.js"
   }
   ```

4. 说明被执行文件的环境：在全局命令执行的 JS 文件中添加 #! /usr/bin/env [node](https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020) （在环境变量下查找 node，用 node 执行当前的 js 文件）

5. 将全局包安装（实际就是拷贝）到全局中：npm link （只要修改代码，就要重新拷贝一次，将本地包放到全局可以方便调试）

6. 命令行中测试 输入 wuyibo ，就会执行 index.js 文件

- 项目依赖模块

  - 项目依赖
  - 开发依赖
  - 同等依赖
  - 打包依赖
  - 可选依赖

npm pack

执行代码的方式：

可以在代码中配置可执行脚本，package.json 中的 script 字段。

将一些全局模块安装在项目中，一般情况下开发工具就安装在项目中。全局模块安装在项目中，项目的 node_modules 目录下会有.bin 目录下创建可执行文件。

如果通过 npm run xxx 执行命令，会将当前项目下的 node_modules/.bin 目录临时放在系统环境变量 path 中后，再执行对应的命令。

npm run env 查看环境变量 path，在控制台打印系统环境变量，其中会有该项目的中的 node_modules/.bin。

npx 也可以执行命令，但是项目中不存在该命令行工具时，会先下载再执行，然后再删除，原理大致和 npm run xxx 一样。

mime 第三方包可以用于传入一个文件名，返回文件的类型。

## Buffer

Buffer 是 global 的属性，属性的值是一个构造函数。服务器端需要大量操作文件，所以 node 就自定义了一个类型 buffer，代表的是内存。操作文件就是 i/o 操作，针对内存做输入输出，描述内存情况，多大的文件，文件的内容。

Buffer 的结构和数组很相似，操作 Buffer 的方法拼写也和数组的方法一样。数组中没法存放二进制格式的文件（图片，音视频），而 buffer 则可以。

早期浏览器不支持文件读取，node 中操作文件需要 Buffer 类，**优点是可以和字符串相互转换。**

内存用二进制表示数据。

0.1 + 0.2 !=0.3，这是为什么？

0.1 无法用有限的内存表示，所以就会出现省略问题，小数运算都是一些近似值的运算。

0.2 也是无法准确表示出来的，都会比之前的数大一些。

进制转化：

小数转二进制可以采用乘 2 法。

node 中 buffer 的展示采用的是 16 进制，存储的是二进制。

0.2+0.2 == 0.4 ，为什么？因为这种计算是一种近似值得计算

整数的进制转化：

8 比特位 = 1 字节

一个字母占一个字节，八个比特位。

一个汉字占 3 个字节（utf-8），也就是 24 个比特位。

一个字节最大能表示的数字是 255，ascii 码中一个字符就是一个字节，因为 8 个位能表示所有的美国当时使用的字母，数字和符号。

parseInt('10111001',2) // 二进制的数转为 10 进制

(0x16).toString('2') // 16 进制转为 2 进制

### base64 的转化

base64 是什么？用来干什么？怎么转为 base64？

是什么？是一种编码方式，请求一个图片，一般需要发请求，发请求就多一次文件请求，所有可以将图片资源转为 base64 格式，base64 是一段纯文本，可以替换连接，减少请求。

汉字在传输过程中可能会有乱码问题，一般在请求头中加上内容一般不使用中文，因为中文有时不识别，这时也会将文字转为 base64 格式。

缺点：转为 base64 的结果会比原文件体积更大（大约 1/3），所以大文件不适合转为 base64.

- 文件转为 base64

- 读文件读为 base64

### 汉字转为 base64

Buffer.from('人') ，buffer 可以和字符串相互转化，给 Buffer.from 函数传递一个字符串，就可以返回字符串对应的 buffer。

```js
let buffer = Buffer.from('珠');

let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
code = code + code.toLowerCase() + '0123456789+/'; //base64编码对照表
```

base64 表示文件转化后每一个字节不大于等于 64。而 8 个比特位能表示的最大数值是 255，将 255 转为每一位都不超过 64。思路：拆分，拆得更小一些。

先将汉字对应的 Buffer 转为 2 进制表示，然后拼接所有汉字的二进制数字，然后以拆分为每 6 位一组，再在每组的前面添置两个 0，然后 再将每组的二进制转为对应的 10 进制，再用十进制数字取对照字符集（字符集一共有 64 位）生产对应的字符串就是 base64 格式了。

```js
// 汉字转化成base64  无论是二进制还是16进制 还是 8进制展现的结果不同但是表现值都是相同的
// 为什么不用2进制 而用16进制展现呢?  111111111111111111111111
//   255 ->                         ff ff
let buffer = Buffer.from('珠');
console.log(buffer); // e7 8f a0  因为一个字节最大8个位-》 8个位最大的值就是255 -》 ff

// e7 8f a0 -> 24位， 转化后每一位不大于等于64

console.log((0xe7).toString('2'));
console.log((0x8f).toString('2'));
console.log((0xa0).toString('2'));

// 00111001   00111000   00111110     00100000

console.log(parseInt('00111001', 2));
console.log(parseInt('00111000', 2));
console.log(parseInt('00111110', 2));
console.log(parseInt('00100000', 2));
// 57 56 62 32

let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
code += code.toLowerCase();
code += '0123456789+/';
console.log(code[57] + code[56] + code[62] + code[32]); // 54+g  base32 将值限制到32位以下这样就可以实现32位编码了
```

Buffer 就是内存，Buffer 一旦声明就不能改变大小。声明 buffer 时需要一个固定的长度作为声明的依据。Buffer 的长度是以字节为单位。

```js
let buffer1 = Buffer.from('jack'); // 4个字节
let buffer2 = Buffer.from('一一'); // 6个字节
let buffer3 = Buffer.alloc(100); // 申请一个长度为100个字节的buffer
let buffer4 = Buffer.from([100, 0x75, 0xf2]); // 使用场景：比如前端传给后端的是ArrayBuffer，到后端接收到的就是一个Buffer数组格式，可以使用form方法将它转为buffer来使用。
```

**Buffer 实例属性**

- length：表示该 buffer 实例有几个字节的长度

- toString()：将 buffer 转为字符串

- copy()：拷贝 buffer, copy 方法主要的作用就是为了拼接，但是用起来麻烦

```js
let buf4 = Buffer.from('架构');
let buf5 = Buffer.from('珠峰');
let buf6 = Buffer.alloc(12);

buf4.copy(buf6, 6); // 拷贝到大buffer上从第6个字节拷贝到末尾
buf5.copy(buf6, 0, 0, 6);
```

```js
Buffer.prototype.copy = function (target, targetStart, sourceStart = 0, sourceEnd = this.length) {
  for (let i = 0; i < sourceEnd - sourceStart; i++) {
    target[targetStart + i] = this[sourceStart + i];
  }
};
```

- slice：buffer 截取，buffer 有 slice 方法可以截取 buffer，截取的是内存 类似于二维数组，内部的每个元素都是对内存地址的

```js
let arr = [1, 2, 3, 4, 5];
slice浅拷贝;
let arr2 = arr.slice(0, 1); // [1]
arr2[0] = 100;
console.log(arr);

let arr = [[1], 2, 3, 4, 5];
slice浅拷贝;
let arr2 = arr.slice(0, 1); // [1]
arr2[0][0] = 100;
console.log(arr); // buffer和二维数组是一样的

let buf9 = Buffer.from([1, 2, 3, 4]);
let buf10 = buf9.slice(0, 1);
buf10[0] = 100;
console.log(buf9);
```

- indexOf ( value[,offset] ) ,常用来对传递过来的数据来进行拆分， 比如来处理 formdata 格式

  ![image-20220610223813511](.\typora-user-images\image-20220610223813511.png)

```js
let b1 = Buffer.from('123ab123ab123');
Buffer.prototype.split = function (sep) {
  sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep); // 将分隔符转化成buffer，让计算的时候全部按照buffer来算

  let len = sep.length; // buffer字节长度
  let arr = [];
  let findIndex = 0;
  let offset = 0;
  while (-1 != (findIndex = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, findIndex));
    offset = findIndex + len;
  }
  arr.push(this.slice(offset));
  return arr;
};
console.log(b1.split('ab'));
```

Buffer 拼接的其他方法：

- `Buffer.concat ( [buf1,buf2,...][,length])`

  ```js
  Buffer.concat = function (list, len = list.reduce((a, b) => a + b.length, 0)) {
    let buf = Buffer.alloc(len);
    let offset = 0;
    list.forEach((b) => {
      b.copy(buf, offset);
      offset += b.length;
    });
    return buf.slice(0, offset);
  };
  ```

- Buffer.isBuffer(value)

对 buffer 的操作，比如读取几个文件，将几个文件内容合并。读出文件，将文件内容进行裁剪等。

buufer 合并操作，前端上传图片，，每次传递图片都是一点点传，后端收到再一个个拼接起来。读取大文件到内存中。

```js
let buf1 = Buffer.from('架构');
let buf2 = Buffer.from('珠峰');
let str = buf1 + buf2; //这并不是buffer的拼接而是字符串的拼接   str为珠峰架构

let buf3 = buffer.alloc(12);
buf1.copy(buf3, 6, 0, 6); // 将buf1拷贝到buf3中,后面的参数依次是：从buf3的哪个字节位置开始拷贝，从buf1的第几个字节开始拷贝，拷贝多长（一个汉字3个字节）
buf2.copy(buf3, 0, 0, 6);
// copy方法主要的作用是实现字符串拼接

Buffer.prototype.copy = function (target, targetStart, sourceStart = 0, sourceEnd = this.length) {
  for (let i = 0; i < sourceEnd - sourceStart; i++) {
    target[targetStart + i] = this[sourceStart + i];
  }
};

Buffer.concat([buf2, buf1]); // buffer拼接

Buffer.concat = function (list, len = list.reduce((a, b) => a + b.length, 0)) {
  let buf = Buffer.alloc(len);
  let offset = 0;
  list.forEach((b) => {
    b.copy(buf, offset);
    offset += b.length;
  });
  return buf.slice(0, offset); // 截取掉多余的内存部分   当len大于list中buffer总长度时起作用
};

Buffer.prototype.slice(start, end); // buffer和二维数组一样

let buf = Buffer.form([1, 2, 3, 4, 5]);
let buf2 = buf.slice(0, 1); // 截取出来的是内存引用地址
buf2[0] = 100;
console.log(buf); //  buf的第一个字节处变为100

Buffer.isBuffer(varibale); // 判断一个变量是否是buffer

buf.indexOf('value', start);

Buffer.prototype.split = function (sep) {
  // Buffer中没有该方法
  sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep);
  let len = sep.length;
  let arr = [];
  let fondIndex = 0;
  let offset = 0;
  while (-1 != (findIndex = this.indexOf(sep, offset))) {
    arr.push(this / slice(offset, findIndex));
    offset = findIndex + len;
  }
  arr.push(this.slice(offset));
  return arr;
};
```

## 文件操作 fs

buffer 的应用主要就是文件读取，node 中对文件进行读取后重写，读取后进行渲染等都需要对文件进行读取。

- fs 操作和作用
- 流读取数据，操作文件大部分时候还是使用流方式读取

node 中的文件模块一般提供两种方式的方法：同步（性能高，阻塞）和异步（非阻塞）

文件操作主要就是 i/o 操作，读取到内存中进行操作，内存用 buffer 表示。

```js
const fs = require('fs')
const path = require('path')

fs.readfile(path.resolve(__dirname),name.txt,['utf8',]function(err,data){   // 将一个文件的内容都读到内存中，不指定编码时，data为buffer格式
	fs.writeFile(path.resolve(__dirname,'copt.txt'),data,function(error,data){
        // 清空后写入或者创建后写入
    })
})
// 对于这个api，对于大文件的操作是全部读到内存中，大文件是不会采用这种方法读取的。



// 目的：读取一部分处理一部分，处理完后释放那部分（流）
// r:读取  w:写入  a:追加  r+可读可写，文件不存在则报错   w+:可读可写，文件不存在则创建
const buf = Buffer.alloc(3)   // 固定大小的容器

// 打开文件，读取内容，进行操作，关闭文件
fs.open(path.resolve(__dirname,'name.txt'),'r',function(err,fd){
    // fd 数字  文件描述符号
    // 将文件读取到buf中,0为buf的第几个字节开始写，3表示写入3个字节,0表示从文件的第几个字节开始读取内容
    fs.read(fd,buf,0,3,0,function(error,bytesRead){
        // bytesRead 真实读取到的个数
        fs.open(path.resolve(__dirname,'copy.txt','w',function(error,wfd){
            // 向wfd文件写入buf，从buf的第0个字节开始取出，取出bytesRead个字节，从wfd的第0个字节位置开始写入
            fs.write(wfd,buf,0,bytesRead,0,function(err，written){
                // written 真正写入的个数
                fs.close(fd,function(){})
                fs.close(wfd,function(){})
            })
        }))
    })
})



const buf = Buffer.alloc(3)
function copy(source,target,cb){
    // 读取的长度写死了，为3
    let readPosition = 0
    let writePosition = 0
    function destory(fd,wfd){
        let time = 0
        function done(){
            if(++time ==2){
                cb()
            }
        }
        fs.close(fd,done)
        fs.close(wfd,done)
    }
    fs.open(source,'r',function(err,fd){
        if(err) return cb(err)
        fs.open(target,'w',function(err,wfd){
            if(err) return cb(err)
            function next(){
                fs.read(fd,buf,0,3,readPosition,function(err,bytesRead){
                    if(err) return cb(err)
                    readPosition += bytesRead
                    fs.write(wfd,buf,0,3,writePosition,function(err,written){
                        if(err) return cb(err)
                        writePosition+= written
                        if(bytesRead == 3) return destory(fd,wfd)
                        next()
                    })
                })
            }
            next()
        })
    })
}
// 读写不分离，代码耦合度高

//解决办法：发布订阅，node原生就基于发布订阅来写了可读流和可写流

```

## 可读流

```js
const fs = rquire('fs');
const path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname, 'note.md'), {
  flags: 'r',
  highWaterMark: 3, //  每次读取的字节长度，不写默认64*1024Byte
  start: 0, // 从文件的第几个字节开始读取
  end: 5, // 读几个字节   （5-0）+1  即包前也包后
  autoClose: true, // 开启读取完毕后关闭
  emitClose: true, // 底层触发一个close事件
  mode: 0o666 // 操作权限，  666 表示任何人都可读可写
});

// 读4 写2 执行1  和为7   777表示：自己可读可写可执行， 所在组的可读可写可执行， 其他人可读可写可执行

// 可读流底层是基于event模块实现的
res.on('data', function (chunk) {
  // 内部每次的可读流都会触发该方法
  rs.pause(); // 本次读取流触发后，执行该行则暂停直流对指定文件的读取

  // rs.resume()  // 回复读取流
});

res.on('end', function () {
  // 可读流读取文件内容完毕后会触发该end事件
});

res.on('close', function () {});

res.on('open', function (fd) {
  // 只有文件才有open和close
});

res.on('error', function (error) {});
// 可读流可以控制速率和暂停读取
```

提示：当在 node 项目中看到 xxx.on('data',function(){ ... }) , xxx.on('end',function(){....})的代码的话，说明一定是一个可读流。

**模拟实现可读流**

```js
const EventEmitter = require('events');
const fs = require('fs');
class ReadStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.start = options.start || 0;
    this.end = options.end || undefined;
    this.autoClose = !!options.autoClose;
    this.emitClose = !!options.emitClose;
    this.flowing = false; // 默认叫非流动模式
    this.open(); // 默认打开文件 //1s
    this.on('newListener', (type) => {
      if (type === 'data') {
        this.flowing = true;
        this.read();
      }
    });
    this.offset = 0;
  }
  destroy(err) {
    if (this.fd) {
      fs.close(this.fd, () => {
        if (this.emitClose) {
          this.emit('close');
        }
      });
    }
    if (err) {
      this.emit('error', err);
    }
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    // 这里可以恢复读取
    if (!this.flowing) {
      this.flowing = true;
      this.read();
    }
  }
  read() {
    // 调用read的时候如果fd不存在，我就监听什么时候fd有了在读取
    if (typeof this.fd !== 'number') {
      return this.once('open', this.read);
    }
    // 如果声明的buffer放到了this上，那么每次写入buffer操作的都是
    // 同一个buffer, 并且给用户传递过去
    // 0 - 4 5个字节   3个 2个
    const howMutchToRead = this.end
      ? Math.min(this.end - this.offset + 1, this.highWaterMark)
      : this.highWaterMark;
    let buffer = Buffer.alloc(howMutchToRead);
    fs.read(this.fd, buffer, 0, howMutchToRead, this.offset, (err, bytesRead) => {
      if (bytesRead) {
        this.offset += bytesRead;
        this.emit('data', buffer.slice(0, bytesRead));
        if (this.flowing) {
          this.read();
        }
      } else {
        this.emit('end');
        this.destroy();
      }
    });
  }
  open() {
    // 异步操作
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.destroy(err);
      }
      this.fd = fd;
      this.emit('open', fd);
    });
  }
}
function createReadStream(path, options) {
  return new ReadStream(path, options);
}

module.exports = createReadStream;
```

代码的逻辑的启发：如果代码逻辑是异步嵌套的话，完全可以用发布订阅将代码进行解耦合。

## 可写流

## 链表

```js
// js中没有链表， 所以我们需要自己来实现个链表来解决头尾消耗的问题

// 数据结构中 线性结构  队列、栈、链表 查询数据需要遍历 （存储数据）
// 有一组数据 用队列存 还是用链表存 查询的快？ 是一样的
// 链表操作头尾 比较方便
class Node {
  constructor(element, next) {
    this.element = element; // 当前节点中存放的内容
    this.next = next; // 当前节点的下一个元素是谁
  }
}
class LinkedList {
  constructor() {
    this.head = null; // 链表的头指针
    this.size = 0; // 链表的长度
  }
  getNode(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  add(index, element) {
    if (arguments.length == 1) {
      element = index;
      index = this.size;
    }
    if (this.head == null) {
      this.head = new Node(element);
    } else {
      let prevNode = this.getNode(index - 1);
      prevNode.next = new Node(element, prevNode.next);
    }
    this.size++;
  }
  remove(index) {
    // 删除某一个要返回删除的那一项
    let removeNode;
    if (index === 0) {
      removeNode = this.head;
      if (removeNode) {
        this.head = this.head.next;
        this.size--;
      }
    } else {
      let prevNode = this.getNode(index - 1);
      removeNode = prevNode.next; // 删除的节点
      prevNode.next = prevNode.next.next;
      this.size--;
    }
    return removeNode;
  }
  update(index, element) {
    let currentNode = this.getNode(index);
    currentNode.element = element;
    return currentNode;
  }
}
// 如何反转一个链表
// 如何判断一个链表有没有环
class Queue {
  constructor() {
    this.ll = new LinkedList();
  }
  offer(element) {
    this.ll.add(element);
  }
  poll() {
    // 删除头部  削掉
    return this.ll.remove(0);
  }
}
module.exports = Queue;
// ll.add(1);
// ll.add(2);
// ll.add(1,3); // 1 3 2
// ll.remove(1)
// ll.update(0,100)
// console.log(ll.head);
```

## 树结构

二叉搜索树，**树的遍历**。

任何的数据结构都是用于存储数据使用。

二叉搜索树：树有两个分叉，能被搜索查询，树的组成，左边的节点要比右边的小（也可以反过来），一样大可以自行决定。

二叉树主要是优化了数据的查找，删除和修改的效率。

最坏复杂度，最好复杂度和平均复杂度。

数组的平均复杂度是 O(n)

树的平均复杂度是 O(logn)

在前端中，很多情况下都是后端给一个数据，要格式化成树结构。

```js
// 递归构建二叉树, 性能很差
class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null; // 左侧分叉
    this.right = null; // 右侧分叉
  }
}

class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  add(element) {
    if (this.root === null) {
      this.root = new Node(element, null);
    } else {
      this.compare(this.root, element);
    }

    this.size++;
  }

  compare(root, element) {
    if (root.element > element) {
      if (!root.left) {
        root.left = new Node(element, root);
      } else {
        this.compare(root.left, element);
      }
    } else {
      if (!root.right) {
        root.left = new Node(element, root);
      } else {
        this.compare(root.right, element);
      }
    }
  }
}

let bst = new BST();
bst.add(10);
bst.add(5);
bst.add(100);
console.log(bst);
```

```js
// 优化二叉树的构建
class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.left = null // 左侧分叉
    this.right = null // 右侧分叉
  }
}

class BST {
  constructor() {
    this.root = null // 这就是二叉树
    this.size = 0
  }
  add(element) {
    if (this.root === null) {
      this.root = new Node(element, null)
    } else {
      let parent = this.root
      let currentParent
      while (parent) {
        if (element < parent.element) {
          if (!parent.left) {
            currentParent = parent
            break
          } else {
            parent = parent.left
          }
        } else {
          if (!parent.right) {
            currentParent = parent
            break
          } else {
            parent = parent.right
          }
        }
      }
      if (element < currentParent.element) {
        currentParent.left = new Node(element)
      } else {
        currentParent.right = new Node(element)
      }



    }

    this.size++
  }
}

let bst = new BST()
bst.add(10)
bst.add(5)
bst.add(100)
bst.add(3)
bst.add(72)
console.dir(bst.root)



add(element){
    if (this.root === null) {
        this.root = new Node(element, null)
    } else {
        add(element) {
            if (this.root == null) {
                this.root = new Node(element, null);
            } else {
                let current = this.root; // 此根节点是有变化的
                let parent;
                while (current) {
                    parent = current;
                    if (current.element < element) { // 当前节点和插入节点比较
                        current = current.right
                    } else {
                        current = current.left
                    }
                }
                if (parent.element < element) {
                    parent.right = new Node(element, parent)
                } else {
                    parent.left = new Node(element, parent)
                }
                // this.compare(root,element)
            }
            this.size++;
        }
    }
```

树的遍历方式

- 前序遍历
- 中序遍历
- 后续遍历
- 层序遍历

<img src=".\typora-user-images\image-20220305205147995.png" alt="image-20220305205147995" style="zoom: 150%;" />

面试：二叉树的反转。

## fs

文件夹就是一个树结构，我们就需要操作树的一系列方法。

## http

http-server：该包可以启动一个本地服务，预览文件夹，启动文件。

HTTP：超文本传输协议，只能传输文本，文本指的是 http 的的表现形式是以文本传输的，内容可以是二进制，并不是指传输的内容仅限文本不能传图片等。

传输协议， 协议怎么理解呢？ 规范规则 （有一套对应的体系） 表现形式是文本有什么问题么？ 文本是有歧义的 (后面出现的 http2 都采用二进制的类型， 二进制明确 0 1)

HTTP 在应用层。ISO 七层参考模型：物数网传会表应。

使用 http：

- 用户输入一个网站需要将网址转化成 ip 地址 ip(192.168.1.1) DNS 域名解析服务 （应用层）
- 需要准备传输的数据 http 协议要求数据传输由三部分组成（请求行，请求头，请求体） http 报文 (如果数据大，是没法一起传过去的）
- 将数据进行拆分来传输 传输层 ， 需要将内容编上序号 （为了能组装，可以标识发送了多少） 中间丢了 我需要重新补发
- 网络层通过 ip 进行寻址，有多条路 找出最近的路线，陆续的将内容传递给
- 服务端接受后，需要将数据粘起来，拿到对用的报文 （服务器核心就是要解析浏览器传递过来的三个部分 request）
- 服务器需要返回对应的内容 （响应行，响应头，响应体）

学习 http 就是学习传输过程中 header 的应用，重点是请求头和响应头中的字段，客户端给服务器传递是什么格式，服务器可以怎么解析，反之也是。给对方的数据压缩没压缩。

HTTP 特点：无状态（每次请求之间是互不干扰的 可以通过 cookie 来解决） http 都是请求+响应组成一个完整的事务 明文传输因为在传输过程中，可能请求被拦截了。导致不安全，中间也有可能篡改发送的数据 （缺少完整性保护 + https）

http 的请求方法

- get post put delete options (如果没有跨域的情况是不会发送 options 请求，也不是跨域了就一定会发 options 请求)

- 如果是复杂请求 (复杂请求：除了 get 和 post 之外的，但如果 get 和 post 如果有了自定义 header 则也算复杂请求)并且跨域了 才会发送 options 请求 （简单请求就是仅仅是发了 get 和 post 没有自定义的 header） 所谓的跨域是浏览器的问题。 同源策略是在浏览器上的，服务器和服务器之间不存在跨域

  现在项目中很多请求都会带上 token 或者 cookies，所以基本都会发 options 请求。

- 增加 authorization 这个字段也是复杂请求 （options 试探请求是有自己的时间的，可以设置在某段时间内访问服务器不需要发送 options 请求）

- option 请求成功后才会发复杂请请求

- 这四个请求分别代表了 增删改查 /finduser /adduser /updateUser /deleteUser 可以用不同的请求方法来区分对资源的操作（Restful 风格）

http 状态码

- 1xx 101 websocket 切换协议

- 2xx 200ok 204 表示响应了但是没有响应体 206 范围请求，相求服务器获取部分内容 `curl --header "Range:bytes=0-5" http://www.baidu.com`

  `curl --header "Range:bytes=0-5" -v http://www.baidu.com`

- 3xx 304 缓存,是服务端控制的 301(永久重定向) 302（临时重定向） 重定向

- 4xx 400 参数传递的有问题 404 找不到 401（没有登录，权限认证） 403（你登录了依旧没权限） 405 请求的方法不支持 Not allowd method

- 5xx 服务端挂了，内部错误和客户端没关系 502 网关 503 接受不了了（负载挂了 处理不了请求了）

采用 nodemon 工具监听文件变化，文件变化后自动重启服务端代码（开发环境用 nodemon，生产环境用 pm2）

```js
const http = require('http'); // 底层基于tcp的

// node是单线程的 如果上一个任务阻塞了代码执行，那后面就不会触发
const server = http.createServer((request, response) => {
  // request 客户端的请求   response服务端响应
  // request是一个可读流，有on('data'),on('end')等
  // response是一个可写流，有write(), end()等
  let total = 0;
  if (request.url === '/sum') {
    for (let i = 0; i < 100000000000; i++) {
      total += i;
    }
    response.end(total);
  } else {
    response.end('ok');
  }
});

server.listen(3000, function () {
  console.log(`server start 3000`); // 监听成功就会触发此函数
});

// 上面这套代码能很好的体现node单线程的特点
```

![image-20220306133537938](.\typora-user-images\image-20220306133537938.png)

```js
const http = require('http');

let port = 3000;

// server继承了发布订阅模式类
const server = http.createServer((request, response) => {});

server.listen(3000, function () {
  console.log(`server start 3000`);
});

server.listen(port, function () {
  console.log(`server start ${port}`); // 监听成功就会触发此函数
});

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    server.listen(++port); // 这里没有再写回调的原因是，listen也是一个发布订阅，但监听成功后就会发出事件，前面注册的回调也会被触发
  }
});
```

```js
const http = require('http');
const url = require('url');

const server = http.createServer();

let port = 3000;

server.on('request', (request, response) => {
  // (请求行，请求头，请求体） （响应行，响应头，响应体)

  // 行
  console.log(request.method); // 请求方法在node中都是大写的
  // 协议://用户名：密码@域名：端口号 资源路径 查询参数 锚点
  let { pathname, query } = url.parse(request.url, true);
  console.log(pathname, query); // hash值是无法获取的 （如果是hash路径是不能做seo优化）

  // 头
  console.log(request.headers); // 将所有的header全部解析成小写的

  // 请求体
  let array = [];
  request.on('data', function (chunk) {
    // 流的内部会调用push方法
    array.push(chunk);
  });
  request.on('end', function () {
    // push(null)
    // 可能请求体是一个二进制， 根据对应的格式来做转化
    console.log(Buffer.concat(array).toString());
  });

  response.statusCode = '200';
  response.statusMessage = 'front bug';
  response.setHeader('token', '123');

  // mime
  response.setHeader('Content-Type', 'text/plain;charset=utf-8');
  response.end('你好'); // 响应结束
});
server.listen(port, function () {
  console.log(`server start ${port}`); // 监听成功就会触发此函数
});
server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    server.listen(++port);
  }
});
// 可以采用nodemon 工具来监控文件的变化，文件变化后可以自动重启  （开发的时候用nodemon  生产环境pm2）
// npm install nodemon -g
```

## 网络

面试和底层。

- 当浏览器地址栏输入 URL 到页面显示的全过程
- https
- http0.9,http1.0,http1.1,http2.0,http3.0 特点和不足

## Express

为什么有 express 框架？

静态服务器，表示可以访问服务器上的静态资源。根据用户的 url 找到并返回具体的静态资源。

动态服务器，需要根据用户访问的路径和请求方法和参数，针对数据库中的数据进行筛查。

```js
const http = require('http');
let server = http.createServer((req, res) => {
  if (req.url === '/user' && req.method === 'GET') {
    //...    如果项目的逻辑非常多，都写在这里代码会很臃肿， 很难维护
  }
});

server.listen(3000, () => {
  console.log('server start at 3000 port');
});
```

Express：web 开发框架。

原生 http 模块的缺陷：

- 服务端代码冗杂，耦合
- 不利于代码逻辑拆分

Express 的特点：

- 封装原生的 http 模块
- 能扩展中间件
- 扩展了 req 和 res

```js
const express = require('express');

const app = express();

app.get('/', function (req, res) {
  // ....
});

app.get('/user', function (req, res) {
  // ....
});

app.post('/user', function (req, res) {
  // ....
});

app.all('*', function (req, res) {
  // ....
});

app.listen(3000, (error) => {
  console.log('server start at 3000 port');
});
```

express 中的路由系统，根据请求的路径和方法返回对应的资源。

### 模拟 Express 源码

#### 第一版

```js
const http = require('http')
const url = require('url')

let routes = []

function createApplication(){
    return {
        get(path,handler){  // 订阅
            routes.push({
                path,
                handler,
                method:'get'
            })
        },
        listen(){
            function done(req,res){
                res.end(`Cannot ${req.method} ${req.url}`)
            }
            const server = http.createServer((req,res)=>{
                let requestMethod = req.method.toLowerC ase()
                let {pathname:requestUrl} = url.parse(req.url)
                for(let i= 0;i<routes.length;i++){
                    let route = routes[i]
                    if(route.paht===requestUrl&&route.method === requestMethod){
                        return route.handler(req.res)  // return 语句说明只要匹配到一项后，后买你即使再有相同的api也不会被触发
                    }
                }
                done(req,res)
            })
            server.listen(...arguments)
        }
    }
}

module.exports = createApplication
```

#### 第二版

从设计模式上看，如果我的功能越扩展越多，那在 createApplication 方法返回的对象中直接进行扩展是很不方便的，所有的方法都放在那一个对象上。

现在想每次调用 createApplication 方法就返回一个新的实例（工厂模式），将一系列的方法放在类上进行扩展。

```js
import Application from './application.js';

function createApplication() {
  return new Application();
}

module.exports = createApplication;
```

application.js

```js
const http = require('http');
const url = require('url');

function Application() {
  this.routes = [];
}

Application.prototype.get = function (path, handler) {
  // 订阅
  this.routes.push({
    path,
    handler,
    method: 'get'
  });
};

Application.prototype.listen = function () {
  function done(req, res) {
    res.end(`Cannot ${req.method} ${req.url}`);
  }
  const server = http.createServer((req, res) => {
    let requestMethod = req.method.toLowerCase();
    let { pathname: requestUrl } = url.parse(req.url);
    for (let i = 0; i < this.routes.length; i++) {
      let route = this.routes[i];
      if (route.paht === requestUrl && route.method === requestMethod) {
        return route.handler(req.res); // return 语句说明只要匹配到一项后，后买你即使再有相同的api也不会被触发
      }
    }
    done(req, res);
  });
  server.listen(...arguments);
};

module.exports = Application;
```

上面的代码，路由和应用耦合。

```diff
const http = require('http')

const Router = require('./router')


function Application(){
    this.router = new Router()
}

Application.prototype.get =function(path,handler){  // 订阅
-    this.routes.push({
-        path,
-        handler,
-        method:'get'
-    })
+    this.router.get(path,handler)
}

Application.prototype.listen = function(){
    function done(req,res){
        res.end(`Cannot ${req.method} ${req.url}`)
    }
    const server = http.createServer((req,res)=>{
-        let requestMethod = req.method.toLowerCase()
-        let {pathname:requestUrl} = url.parse(req.url)
-        for(let i= 0;i<this.routes.length;i++){
-            let route = this.routes[i]
-            if(route.paht===requestUrl&&route.method === requestMethod){
-                return route.handler(req.res)  // return 语句说明只要匹配到一项后，后买你即使再有相同的api也不会被触发
-            }
-         }
-        done(req,res)
+		this.router.handle(req,res,done)
    })
    server.listen(...arguments)
}

module.exports = Application
```

router.js

```js
const url = require('url');
function Router() {
  this.stack = [];
}

Router.prototype.get = function (path, handler) {
  this.stack.push({
    paht,
    handler,
    method: 'get'
  });
};

Router.prototype.handle = function (req, res, out) {
  let requestMethod = req.method.toLowerCase();
  let { pathname: requestUrl } = url.parse(req.url);
  for (let i = 0; i < this.stack.length; i++) {
    let route = this.stack[i];
    if (route.paht === requestUrl && route.method === requestMethod) {
      return route.handler(req.res); // return 语句说明只要匹配到一项后，后买你即使再有相同的api也不会被触发
    }
  }
  out(req, res);
};

module.exports = Router;
```

#### 中间件

路由中间件：

使用

```js
const express = require('express');

const app = express();

app.get(
  '/',
  function (req, res, next) {
    // 类似于axios中拦截器
    //.....
    next();
  },
  function (req, res, next) {
    //.....
    next();
  },
  function (req, res, next) {
    //.....
    next();
  }
);

app.get('/', function (req, res, next) {
  //.....   会走到这里
});

app.listen(3000, function (req, res) {
  console.log('server start at 3000 port');
});
```

实现原理

注册一个函数和注册一组函数的区别。

![image-20220619101024524](.\typora-user-images\image-20220619101024524.png)

![image-20220619101348551](.\typora-user-images\image-20220619101348551.png)

## 缓存

对于一系列的请求而言，首次的请求是一定不会走缓存的，即使请求的是静态资源。只有一个资源引用了另外的一些资源，这些另外的资源才有可能被缓存。

当首次去请求一个资源文件 (比如直接通过 url 访问获取一个 html 文件或者直接通过 url 获取某个 css 文件) 时，浏览器默认会在请求头中加上一个请求头信息：

```http
Cache-Control:max-age=0;
```

服务器设置缓存：

```js
res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
```

老的写法用：Expires，缺陷是这个时间以服务端的时间为准，当客户端和服务端时间不一致时，则出现问题。

新的写法：

```js
res.setHeader('Cache-Control', 'max-age:30');
```

当 Expires 和 Cache-Control 同时设置时，以 Cache-Control 为准。

上面的问题，如果日期过了，还是会再次发出请求，后端会在接收到请求后再读取一次文件（浪费性能）。

为此引入文件比对机制。

旧的方式

```js
res.setHeader('Last-Modified', staObj.ctime.toGMTString()); // 返回文件的最新修改时间
```

当浏览器访问了服务器后，服务器会设置这个响应头信息返回给服务器。

当浏览器下次再访问服务器中，浏览器的请求头中会自动携带一个请求头：

```http
If-Modified-Since:Web,09 Mar 2022 13:41:26 GMT
```

下次服务器可以根据这个请求头信息来判断是否走缓存：

```js
res.setHeader('Last-Modified', staObj.ctime.toGMTString());
let IfModifiedSince = req.headers['if-modified-since'];
if (IfModifiedSince === staObj.ctime.toGMTString()) {
  res.statusCode = 304;
  return res.end();
}
```

下次请求，没超过强制缓存时间，直接走缓存，超过强制缓存时间后，访问服务器并带上最新修改时间。服务器获取到客户端携带的最新修改时间，进行对比，对比结果可能是返回 304 走协商缓存，也可能是重新返回新的文件。

问题：万一只是资源文件修改后又撤销修改后保存，这时文件内容没有变，但是文件修改时间变化了，则没法走缓存了。如果一秒内修改了多次，那人就时监控不到文件变化的，因为最新修改时间只精确到秒。

但是当请求来到服务器时，直接读取并对比文件内容，非常消耗性能。

为此的解决办法是比较文件长度 加上 最新修改时间作为一个指纹来处理。

new Date(staObj.ctime.toGMTString()).getTime().toString(16 )：获取文件最新修改时间，转为 Date 对象，然后过去 Date 对象对应的时间戳，再转为 16 进制。

staObj.size.toString(16)：文件长度对应的 16 进制数字

```js
let etag =
  new Date(staObj.ctime.toGMTString()).getTime().toString(16) + '-' + staObj.size.toString(16);
res.setHeader('Etag', etag);

let ifNoneMatch = req.headers['if-none-match'];
if (ifNoneMatch === etag) {
  res.statusCode = 304;
  return res.end();
}
```

下次浏览器再请求服务器时,客户端会将上次响应的 etag 值 作为 if-None-Match 请求字段对应的值发送给服务器，服务器根据这个请求头字段的值进行比较后判断。

按照规范来说，有 Etag 时就不采用 last-modified，但是有的网站两种方式都会采用。

## cookie 和 session

cookie，session，sessionStoreage 和 localStorage 的区别？

- sessionStoreage 会话关闭，数据就丢失（浏览器端存储）。应用：比如存放页面滚动位置。

- localStorage 存在本地，浏览器关闭也不丢失，需要手动删除（浏览器端存储），存储容量有限。应用：前端性能优化时，将 js,css 等静态资源存到 localStorage 中

  比如百度移动端：

  ![image-20220620224202143](.\typora-user-images\image-20220620224202143.png)

sessionStoreage ，localStorage 都不能跨域。

cookie，session

http 的特点是无状态的，每次 http 之间没有关联。 通过增加请求头字段来标识 http 请求之间存在关联，一般使用 cookie 来存储。

每次请求都会自动携带 cookie，cookie 内容过多，过多可能导致页面白屏，会浪费流量。尽量 cookie 合理化，如通过过期时间，通过域名分割 cookie。可以浏览器存储，也可以服务端通过响应头设置。默认可以限制二级域名共享 cookie。cookie 会走网络，所以有安全问题。

和 cookie 相比，session 更安全一些。

cookie 是存放在客户端的，在客户端或者网络中有可能被拦截篡改，这样服务端就不一定能发现。

现在对于 session，客户端请求的时候，服务端给客户端一个标识，真正的信息存放在服务器中。中间的这个标识也是存放在 cookie 中进行通行的。 session 基于 cookie。

目前的项目大都是前后端分离的，这就涉及跨域，cookie 默认不支持跨域。

前后端同构项目，前端写的代码都是嵌入到服务端的或者服务端渲染都常用的是 cookie。

现在主流的模式基于 jwt 和 token 的模式。

### cookie 的使用和安全

浏览器端可以通过 document.cookie 获取。cookie 的格式一般是 key=value；key=value；key=value ，

**服务端操作 cookie(使用)**

```js
req.headers.cookie; // 取

res.setHeader('Set-Cookie', 'name=zf'); // 设置一个

res.setHeader('Set-Cookie', ['name=zf', 'b=1']); // 设置多个

// 其他字段
// domain  有效域名，如果不设置则就是当前域名
// path  有效路径, 只有路径是以指定的路径开头时，才能访问，一般用不到
// expires  过期时间, 以秒为单位，下面的10表示10秒钟
// httpOnly  只读，方式客户端篡改cookie ，表示浏览器不能通过document.cookie来获取cookies

res.setHeader('Set-Cookie', ['name=zf; domain=域名; path=/xxxx; max-age=10; httpOnly=true', 'b=1']); //域名不带协议类型
```

cookie 可以在一级域名中设置后，可以在所有的二级域名下进行访问。在二级域名下设置的 cookie 并不能在一级域名中访问。可以通过域名进行 cookie 划分。

如果一级域名和二级域名下都有同名的 cookie，当客户端在二级域名下读取的时候，会都读取到。

![image-20220621195945058](.\typora-user-images\image-20220621195945058.png)

![image-20220621200005187](.\typora-user-images\image-20220621200005187.png)

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/read') {
    res.end(req.headers.cookie); // 返回给客户端cookie
  } else if (req.url === '/write') {
    res.setHeader('Set-Cookie', ['name=zf; domain=a.zf.cn', 'age=11']); // 原生
    res.end('write ok');
  } else {
    res.end();
  }
});

server.listen(3000, () => {});
```

```js
const http = require('http');

const server = http.createServer((req, res) => {
  // 自定义扩展方法
  res.setCookie = function (key, value, options = {}) {
    let args = [];
    if (options.domain) {
      args.push(`domain=${options.domain}`);
    }
    res.setHeader('Set-Cookie', `${key}=${value}; ${args.join(';')}`);
  };

  if (req.url === '/read') {
    res.end(req.headers.cookie); // 返回给客户端cookie
  } else if (req.url === '/write') {
    res.setCookie('name', 'zf', { domain: 'a.zf.cn' }); // 标识用户访问的如果是a.zf.cn这个二级域名时才能将这条cookie写给客户端 ， 二级域名设置

    // res.setCookie('name','zf',{domain:'zf.cn'})  // 一级域名设置
    res.end('write ok');
  } else {
    res.end();
  }
});
```

domain,path, maxAge,httpOnlydddd

```js
const server = http.createServer((req, res) => {
  // 自定义扩展方法
  res.setCookie = function (key, value, options = {}) {
    let args = [];
    if (options.domain) {
      args.push(`domain=${options.domain}`);
    }
    if (options.path) {
      args.push(`path=${options.path}`);
    }
    if (options.maxAge) {
      args.push(`max-age=${options.maxAge}`);
    }
    if (options.httpOnly) {
      args.push(`httpOnly=${options.httpOnly}`);
    }
    res.setHeader('Set-Cookie', `${key}=${value}; ${args.join(';')}`);
  };

  if (req.url === '/read') {
    res.end(req.headers.cookie); // 返回给客户端cookie
  } else if (req.url === '/write') {
    res.setCookie('name', 'zf', {
      domain: 'a.zf.cn',
      path: '/write',
      maxAge: 10, // 10秒钟
      httpOnly: true
    }); // 标识用户访问的如果是a.zf.cn这个二级域名时才能将这条cookie写给客户端 ， 二级域名设置
    res.end('write ok');
  } else {
    res.end();
  }
});
```

**cookie 安全**

对 cookie 进行防止篡改，对 cookie 进行签名，使用 md5 算法。

cookie 加密一般不采用，约定 cookie 不要存放敏感信息，因为这些数据会在客户端存放。

node 中给许多算法统筹了一个包——crypto

```js
const crypto = require('crypto');

//crypto对象上有许多的算法方法
crypto.createHash('md5').update(value).digest('base64'); // createHash:摘要算法  将value对对应的值做一个摘要，以base64的格式展示    只要value对应的值不变每次生成的内容都是一样的。

// 加密算法
```

摘要算法：摘要没有解密过程，就是一个内容的标识 ，无法通过摘要反推内容，相同的内容，生成的摘要相同。 不同的内容生成的摘要内容的长度都是一样的；可以通过映射表反推（撞库）。

1.md5 是不可逆的 不能通过输出反推输入

2.md5 摘要的长度最终的结果都是一样的

3.只要内容不同 出来的结果就不相同 雪崩效应

4.内容一样摘要的结果是一一致的

加密算法：有加密和解密过程

加盐算法：做完整性校验，密码一般可以用这个

sha1 和 sha256

```js
let result = crypto.createHmac('sha256','zf').update(value).digest('base64')  // 这里的zf是密钥，密钥只要不泄漏，就无法得到正确的值。   value 是需要编码的内容， result是编码后的结果

const sign = (value)=>{
    // 默认base64 传递的值 会有+ = / 的问题 我们需要转化成对应的base64url
    let result = crypto.createHmac('sha256','zf').update(value).digest('base64')
    return result

    return crypto.createHmac('sha256', 'zf').update(value).digest('base64url');
}

const server = http.createServer((req,res)=>{
    // 自己封装的获取客户端cookie的方法
    req.getCookie = function(key,options){
        let cookies = req.headers.cookie
        let cookieObj = require('queryString').parse(cookies,'; ') ||{}

        if(options.signed){   // 标识需要验证浏览器带过来的cookie的签名
            if(cookieObj[key+'.sign'] === sign(cookieObj[key])){
                return cookieObj[key]
            }else {
                return ''
            }

        }

        return cookieObj[key]
    }


    // 自定义扩展方法
    let cookieValueArrs = []
    res.setCookie = function(key, value, options={}){
        let args = []
        if(options.domain){
            args.push(`domain=${options.domain}`)
        }
        if(options.path){
            args.push(`path=${options.path }`)
        }
        if(options.maxAge){
            args.push(`max-age=${options.maxAge }`)
        }
        if(options.httpOnly){
            args.push(`httpOnly=${options.httpOnly }`)
        }
        if(options.signed){
            // 这时除了给原来的cookie字段以外，可以在针对该cookie值设置一个标识字段
            cookieValueArrs.push(`${key}.sign=${sign(value)}; `)
        }
        cookieValueArrs.push(`${key}=${value}; ${args.join(';')}; `)
        res.setHeader('Set-Cookie',cookieValueArrs)
    }

    if(req.url === '/read'){
        res.end(req.getCookie('name',{signed:true}))   // 返回给客户端cookie
    }else if(req.url==='/write'){
        res.setCookie('name','zf',{domain:'a.zf.cn',
                                   path:'/write',
                                   maxAge:10,  // 10秒钟
                                   httpOnly:true，
                                   signed:true  // 表示添加添加签名
                                  })   // 标识用户访问的如果是a.zf.cn这个二级域名时才能将这条cookie写给客户端 ， 二级域名设置
        res.end('write ok')
    }else {
        res.end()
    }
})
```

使用第三方包实现

- cookie-parser

```js
const express = require('express');
const cookieParser = require('cookie-parser');
let app = express();

app.use(cookieParser('zf')); // secret 秘钥

app.get('/read', function (req, res) {
  res.send(req.signedCookies.name);
});

app.get('/write', function (req, res) {
  res.cookie('name', 'zf', { maxAge: 20 * 1000, signed: true }); // 这里的时间时默认时毫秒
  res.send('写入成功');
});

app.listen(3000, () => {
  console.log(`server start 3000`);
});
```

- uuid：生成唯一标识的一个库

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
let app = express();

const session = {}; // session就是内存中的一个对象，session 如果服务器关掉了就丢失了。 我们一般会把session存储到数据库中
app.use(cookieParser('zf')); // secret 秘钥

let cardName = 'connect.sid'; // 标识是哪个服务器的值

// 类似于cookie签名的方式

// 服务器得存储一下信息，重启还丢 （存数据库还会发生宕机）
app.get('/wash', function (req, res) {
  let cardNum = req.signedCookies[cardName]; // 验证后的cookie
  if (cardNum && session[cardNum]) {
    // 表示第二次来了
    session[cardNum].mny -= 10;
    res.send('你现在的余额是：' + session[cardNum].mny);
  } else {
    // -----------------
    const cardId = uuid.v4(); //  该库根据客户端的主机信息加上一个随机值加上当前时间生成一个唯一的数值
    session[cardId] = { mny: 100 }; // 将重要信息存储到服务器中
    res.cookie(cardName, cardId, { signed: true }); // 给客户端

    res.send('你是第一次来办张卡');
  }
});

app.get('/read', function (req, res) {
  res.send(req.signedCookies.name);
});

app.get('/write', function (req, res) {
  res.cookie('name', 'zf', { maxAge: 20 * 1000, signed: true }); // 这里的时间时默认时毫秒
  res.send('写入成功');
});

app.listen(3000, () => {
  console.log(`server start 3000`);
});
```

## JWT

session 的问题：

- 占服务器内存
- 服务器重启可能丢，即使存在数据库中也有可能数据库宕机
- 不利于不利于分布式部署（比如同一个公司有多个项目，多个项目想共用一个登录状态，如果是 session 的话就需要将存放 session 的数据库进行共享）

JSON WEB TOKEN

用户第一次访问时进行登录，根据用户的标识产生一个签名，这个签名是服务端存放的密钥，是唯一的。服务端生成唯一的密钥（令牌）后返客户端，下次客户端访问时，带上令牌和标识，服务端收到后，根据客户端带的标识生成令牌，比较两个令牌是否相同，以达到状态保持的需要。

jwt：服务端不记录用户的状态，只需要存储密钥和 cookie 签名的原理一样。

jwt 从客户端传递给服务器的方式：

1. 通过 url 的 query 部分传输，这种情况当 url 被分享出去时就存在风险
2. 通过 header 请求头进行携带（单独的请求头或者 cookie 中）
3. 在请求体中进行传输

jwt 不涉及跨域问题。

jwt 因为服务端不存放用户信息，带修改密码之前就在另一个浏览器中登录了，那这样是没法同步退出的。所以为了防止有效期过长，可以刷新 token，控制有效期。也可以在 token 中放置辅助字段来判断密码是否更新，更新后之前就失效了。

一般在正式项目中使用 jsonwebtoken 这个第三方包实现

另一个包 jwt-simple：

```js
const express = require('express');
cosnt jwt = require('jwt-simple')

let app = express()

app.psot('/login',function(req,res){
     // jwt.encode(value,secret)
    let token = jwt.encode({name:'zf'},'secret')   // 编码
    res.send({
        err:0,
        data:{
            token
        }
    })
})

app.get('/validate',function(req.res){
    let token = req.query.token

    try{
        jwt.decode(token,'secret')   // 解码
        res.send({
            err:0,
            data
        })
    }catch(e){
        res.send({
            err:1,
            data:'令牌出错'
        })
    }


})

app.listen(3000, () => {
    console.log(`server start 3000`);
})
```

jwt-simple 原理：

```js
// jwt 这种方式 服务端不记录用户的登录状态， 只需要存储秘钥    和 刚才讲的cookie签名一样的原理

const express = require('express');
const jwt1 = require('jwt-simple');

// 一般在正式项目中 jsonwebtoken 来实现， jwt-simple

const app = express();

const jwt = {
  sign(value, secret) {
    return this.toBase64URL(
      require('crypto').createHmac('sha256', secret).update(value).digest('base64')
    );
  },
  toBase64URL(str) {
    return str.replace(/\=/g, '').replace(/\+/, '-').replace(/\//, '_');
  },
  toBase64(content) {
    return this.toBase64URL(Buffer.from(JSON.stringify(content)).toString('base64'));
  },
  encode(payload, secret) {
    let v1 = this.toBase64({ typ: 'JWT', alg: 'HS256' });
    let v2 = this.toBase64(payload); // payload 一般就放一个有效期和我们的唯一标识
    let v3 = this.sign(v1 + '.' + v2, secret);
    return [v1, v2, v3].join('.');
  },
  // base64urlUnescape(str) {
  //     str += new Array(5 - str.length % 4).join('=');
  //     return str.replace(/\-/g, '+').replace(/_/g, '/');
  // },
  decode(token, secret) {
    let [v1, payload, sign] = token.split('.');
    let newSign = this.sign(v1 + '.' + payload, secret);
    if (newSign === sign) {
      let data = JSON.parse(Buffer.from(payload, 'base64url').toString());

      if (new Date(data.expr).getTime() < Date.now()) {
        throw new Error('token 过期');
      }
      // payload 转会正常的base64
      return data;
    } else {
      throw new Error('token error');
    }
  }
};

app.get('/login', function (req, res) {
  let token = jwt.encode(
    { name: 'jw', expr: new Date(Date.now() + 10 * 1000).toGMTString() },
    'secret'
  );
  // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiancifQ.fk5plqJg6UQKUEoLQzvRjJ1VCWuswei44Kmwlou6WPQ
  res.send({
    err: 0,
    data: {
      token
    }
  });
});
app.get('/validate', function (req, res) {
  let token = req.query.token;
  try {
    let data = jwt.decode(token, 'secret');
    res.send({
      err: 0,
      data
    });
  } catch (e) {
    console.log(e);
    res.send({
      err: 1,
      data: '令牌出错'
    });
  }
});

app.listen(3000, () => {
  console.log(`server start 3000`);
});

let token = jwt.encode({ name: 'zf' }, 'secret'); // 编码
```
