## 函数式编程

目前自己在日常开发中写的一些业务处理函数并没有使用函数式编程的思想，本质还是面向过程编程。函数式编程中一定涉及函数，同时函数式编程是一种编程范式，强调使用**函数之间的组合**，目的是**处理数据**。将运算过程抽象成函数，可以实现复用。

常见的编程范式有:

- 面向过程编程 (Procedural Programming) PP: 按照步骤来实现，将程序分解为**过程和函数**。这些过程和函数按顺序执行来完成任务，几乎不涉及函数式编程思想。**开发者能详细的控制每一行代码的逻辑**，是一种流水账式的编写代码。

- 面向对象编程(Object-Oriented Programming) 0OP:将程序分解为对象，每个对象都有自己的状态（属性）和行为（方法）。而方法是对属性进行的修改，更复杂的功能则通过创建多种对象，然后对象之间配合实现业务。面向对象的核心是 (类，实例，继承，封装，多态)，JS 是单继承的，如果继承层级关系多了容易混乱。

- 函数式编程(Functional Programming) FP:使用函数组合来处理数据，描述数据之间的映射。函数指的并不是编程语言中的函数，指的是数学意义上的函数 y=f(x)输入映射输出，一个函数 f 接收一个参数 x，并根据 x 计算返回一个结果 y。


面向过程编程：

```js
const arr = [1, 2, 3, 4, 5];

let sum = 0;
for (let index = 0; index < arr.length; index++) {
  sum += arr[index];
}

// 并不是说将上面的代码封装到一个函数中就是在进行函数式编程了
function sum(arr) {
  let sum = 0;
  for (let index = 0; index < arr.length; index++) {
    sum += arr[index];
  }
  return sum;
}
```



面向对象编程：

```js
const arr = [1, 2, 3, 4, 5];

class Sum {
  constructor() {
    this.sum = 0; // 维护的状态
  }
  add(arr) {
    // 维护的方法
    for (let index = 0; index < arr.length; index++) {
      this.sum += arr[index];
    }
  }
}

const sum = new Sum();
sum.add(arr);
console.log(sum.sum);
```



函数式编程：

```js
// 使用函数与函数的组合
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((prev, current) => prev + current, 0);
```

根据函数式编程的思想，在编写一个函数时，往往要接收另一个或者一些函数作为参数，然后内部会调用那些函数执行逻辑。Vue3 中的所有响应式 API 都是函数式编程思想的体现。



**函数式编程的优势**

- 可维护性:函数式编程的程序通常更加简洁，因为它们避免了状态变化和副作用。
- 可测试性:由于函数式编程程序通常是**无副作用（输入相同输出就一定相同，不会改变函数外的任何变量，不调用输出语句之类的函数等）**的，所以可以很容易地对其进行单元测试。
- 并发性:函数式编程程序通常是无副作用的，所用函数之间彼此独立，可以同时执行而不彼此影响
- 扩展性:函数式编程程序通常是纯函数，可以很容易地**组合和重用**。
- 可靠性:函数式编程程序通常是无副作用的，所以可以很容易地预测其行为。

Vue3 拥抱函数式编程，函数式编程可以抛弃 this，打包过程中更好的利用 tree-shaking 过滤无用的代码



**函数是一等公民**

> First-class Function (头等函数) ，当一门编程语言的函数可以被当作变量值一样用时，则称这门语言拥有头等函数

- 函数可以存储在变量中
- 函数可以作为参数
- 函数可以作为返回值



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
   
   

```js
Array.prototype.reduce = function(callback,initalValue){
    let array = this
    let acc = typeof initalValue === 'undefined' ? array[0]:initalValue;
    let startIndex =  typeof initalValue === 'undefined' ? 1 : 0;
    for(let index = startIndex;index<arr.length;index++){
        acc = callback(acc, arr[index],index,arr)
    }
    return acc
}
```



#### 高阶函数的应用

例如，现在项目中有一个核心方法。它的业务逻辑已经非常完善了。但是某个开发者想自己在执行这个核心代码逻辑之前做点自己的逻辑，核心代码执行之后再做自己的逻辑。

**作用一：可以在原来核心代码逻辑的前面和后面分别增加自己的代码。但是这样做的不足：别人在调取这段核心代码时也会执行到自己添加的代码（破坏了原有函数）。——面向切片编程（AOP）**

在 Vue2 中就用了 AOP 思想对数组原型上的方法进行额外逻辑捕获。

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
    callback(...args);
    self(...args); //也可以用箭头函数
  };
};

Function.prototype.after = function (callback) {
  let self = this;
  return function (...args) {
    self(...args);
    callback(...args); //也可以用箭头函数
  };
};
```

react的 setState 中就用到了事务，也就是在 setState 函数执行前做一些事，执行后再做一些事。等同于 before 和 after。

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

<img src="..\typora-user-images\image-20211113222412658.png" alt="image-20211113222412658" style="zoom: 200%;" />

<img src="..\typora-user-images\image-20211113222830481.png" alt="image-20211113222830481" style="zoom:67%;" />

**AOP:主要作用就是将一些跟核心业务逻辑模块无关的功能抽离，其实就是给原函数增加一层，不影响原函数内部的逻辑。**



函数自身不再定义函数时所在的词法作用域中执行就能形成闭包。



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

   currying(函数柯里化)，一个柯里化后的函数会先接受一些参数，接受这些参数后，函数并不会立即被调用求值，而是继续返回另一个函数，之前传递的参数都被保存在闭包中。等到函数需要被真正执行的时候，之前传入的所有参数都会被一次性用于求值。
   
   ```js
   // 通过高阶函数来实现参数的保留
   function isType(typing, val) {
     return Object.prototype.toString.call(val) === `[object ${typing}]`;
   }
   // 每次执行都需要传入字符串, 可以利用高阶函数来实现参数的保留。 闭包的机制
   
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
   
   // 函数柯理化、偏函数将多个参数传入的形式转化成n个函数，并且每次传递的参数"是一个或多个"
   // 柯里化函数要求参数的个数是确定的一个。
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

3. 缓存

   ```js
   const _ = require('lodash');
   function exec(a, b) {
     console.log('打印语句'); // 该代码只执行了一次
     return a + b;
   }
   
   const resolver = (...args) => {
     // 返回一个给memoize使用的缓存key ，每次执行memoizedExec时都会调用这个函数
     console.log('resolver');
     return JSON.stringify(args);
   };
   
   let memoizedExec = _.memoize(exec, resolver);
   memoizedExec(1, 2); // 3
   memoizedExec(1, 2); // 3
   memoizedExec(1, 3); // 4
   
   /**
   resolver
   打印语句
   3
   
   resolver
   3
   
   resolver
   4
   */
   ```
   
   **memoize 实现：**
   
   ```js
   function memoize(callback, resolver = (...args) => args[0]) {
     const cache = new Map();
     return function memoizedCallback(...args) {
       const cacheKey = resolver(...args);
       if (cache.has(cacheKey)) {
         return cache.get(cacheKey);
       }
       const result = callback();
       cache.set(cacheKey, result);
       return result;
     };
   }
   ```



扩展：判断数据类型

1. typeof 可以判断基础类型 typeof null == ’object‘ （缺陷就是只能判断基本类型），且不能判断 null

   > 面试题：为什么 typeof null 返回 ‘object’ ？
   >
   > 在 JS 的最初版本中，为了性能考虑，在判断数据类型时，使用**低位存储的二进制数据进行变量类型信息的判断**，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。
   >
   > | 数据类型     | 机器码标识      |
   > | ------------ | --------------- |
   > | 对象(Object) | 000             |
   > | 整数         | 1               |
   > | 浮点数       | 010             |
   > | 字符串       | 100             |
   > | 布尔         | 110             |
   > | `undefined`  | -2^31(即全为 1) |
   > | `null`       | 全为 0          |

2. Object.prototype.toString.call 比较严格（知道数据的类型，但无法细分谁是谁的实例）

   > ```js
   > Object.prototype.toString.call(undefined); //  '[object Undefined]'
   >
   > Object.prototype.toString.call(new Date()); // '[object Date]'
   >
   > Object.prototype.toString.call(1); // '[object Number]'
   >
   > Object.prototype.toString.call('as'); // '[object String]'
   >
   > Object.prototype.toString.call(/123/); // '[object RegExp]'
   >
   > Object.prototype.toString.call(function fn() {}); // '[object Function]'
   >
   > Object.prototype.toString.call(Symbol()); //  '[object Symbol]'
   >
   > Object.prototype.toString.call(true); // '[object Boolean]'
   >
   > Object.prototype.toString.call(null); // '[object Null]'
   >
   > Object.prototype.toString.call({}); //  '[object Object]'
   >
   > Object.prototype.toString.call(new Set()); //  '[object Set]'
   >
   > Object.prototype.toString.call(new WeakMap()); // '[object WeakMap]'
   > ```

3. instanceof xxx 是 Xxx 的实例

   > ({})instanceof Object // true

4. constructor 找到对应实例的构造函数



**柯里化**

缩小函数的调用范围，柯里化函数要求参数是固定。

```js
function curry(func) {
  let curried = (...args) => {
    if (args.length < func.length) {
      return (...rest) => curried(...args, ...rest);
    }
    return func(...args);
  };
  return curried;
}
```



**反柯里化**

```javascript
function uncurry(fn) {
  return function (...args) {
    let current = fn;
    for (let arg of args) {
      current = current(arg);
    }
    return current;
  };
}


function add(x) {
  return function (y) {
    return x + y;
  };
}

const uncurriedAdd = uncurry(add);
console.log(uncurriedAdd(3, 4)); // 输出: 7
```

上述`uncurry`函数接受一个柯里化函数`fn`作为参数，并返回一个新的函数。这个新函数可以接受多个参数，并将这些参数依次应用于原始柯里化函数，直到最后一个参数被调用为止。



### 纯函数

相同的输入永远会得到相同的输出，而且没有任何的**副作用**。(不会对外部环境产生影响并且不依赖于外部状态)。

```js
// 纯函数
function sum(a, b) {
  return a + b; // 相同的输入得到相同的输出
}

// 非纯函数
let count = 0;
function counter() {
  count++; // 依赖外部状态，多次调用返回结果不同
  return count;
}

let date = new Date();
function getTime() {
  // 不同时间调用，返回值不同
  return date.toLocaleTimeString();
}
```

常见副作用:

- 对全局变量或静态变量的修改
- 对外部资源的访问(如文件、数据库、网络 http 请求)
- 对系统状态的修改(环境变量)
- 对共享内存的修改
- DOM 访问，打印/log 等

副作用使得方法通用性降低，让代码难以理解和预测，测试困难，导致静态问题（并发操作）等



### 函数组合

函数的组合可以将**高细粒度的函数**重新组合成一个新的函数。最终将数据传入组合后的新函数，得到最终的结果。针对同一批参数，需要依次进行一些列的处理，最后生成所需的数据。

> 早期常⻅的函数组合写法：洋葱模型`c(b(a()))`、过滤器 `a() | b() | c()`

```js
// compose 组合函数 （redux compose， koa express 中间件实现原理）  1） 处理请求参数 2） 看用户是否权限  3） 响应内容

function double(n) {
  // 纯函数
  return n * 2;
}
function toFixed(n) {
  return n.toFixed(2);
}
function addPrefix(n) {
  return '£' + n;
}
// addPrefix(toFiexd(double(10000))) // 洋葱模型
// double(10000) | toFiexd | addPrefix  过滤器的用法 管道 （滤网）  vue2 filter

// 组合
function flowRight(...fns) {
  if (fns.length == 1) {
    // 只有一个函数就不组合了
    return fns[0];
  }
  // 最终reduce返回的是一个函数
  return fns.reduceRight(
    (a, b) =>{
      return (...args) => b(a(...args))
    }
  );
}
// double -> a 从right开始
// toFiexd -> b

// a -> (...args)=> toFiexd(double(...args))
// b -> addPrefix

// addPrefix( toFiexd(double(1000)))
const composed = flowRight(addPrefix, toFixed, double); // Pointed Free
const r = composed(10000);
console.log(r);
```



函数柯里化和组合应用：

```js
const _ = require('lodash'); // 工具库

// 'click button' -> 'CLICK_BUTTON'  目的

const str = 'click button';
let pp1 = _.split(str, ' ');
let pp2 = _.join(pp1, '_');
let pp3 = _.toUpper(pp2);

// 组合的要求必须是一个参数的入参， 柯里化

// 函数式编程是组合后传递数据拿到结果
const splitByType = _.curry((sep, str) => _.split(str, sep));
const joinByType = _.curry((sep, str) => _.join(str, sep));

const composed = _.flowRight(_.toUpper, joinByType('_'), splitByType(' '));
console.log(composed(str), 'curry + compose');

const lodash = require('lodash/fp'); // 会自动将内部的方法柯里化， 都给你处理成参数先行的特点

const composedFn1 = _.flowRight(lodash.toUpper, lodash.join('_'), lodash.split(' '));
console.log(composedFn1(str));

// 这种模式也称之为PointFree，把数据处理的过程先定义成一种与参数无关的合成运算就叫 Pointfree

// 小结：函数式编程的基础：纯函数、柯里化、组合来进行数据的处理。 可以将一些复杂的运算逻辑抽象成函数。 可以复用
```



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

```js
const fs = require('fs');
const path = require('path');

// 通过哨兵变量 来解决这类问题。
let times = 0;
function print(key, value) {
  person[key] = value;
  if (++times === 2) {
    console.log(person);
  }
}

// node中的回调第一个参数永远是error。 error-first
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, name) {
  print('name', name);
});
fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, age) {
  print('age', age);
});

// 异步并发，最终需要一起获得到结果
```



**异步代码是无法通过 try catch 捕获异步任务中的错误**（除了async + await），所以在 node 中的异步回调函数内部处理错误并作为回调函数的第一个参数返回。

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

> 异步导致的问题：回调地狱（让代码难以阅读）、错误处理 （⽆法统⼀处理错误）、多个并发异步操作（“同步结果”困难）

重点思路：

- 创建 promise 实例时传入的回调函数是**同步回调(executor)**，且该回调函数接受两个函数：resolve 和 reject 作为参数

  ```js
  const pro1 = new Promise((resolve, reject) => {
    console.log('executor');
  });

  console.log('123');
  // 先打印executor，再打印123
  ```

- 每个 promise 实例有可能是三种状态中的一种：pending（默认状态）, fulfilled 或 rejected

- resolve 和 reject 可以改变 promise 实例对象的状态 pending=> fulfilled 或者 pending => rejected

- resolve 和 reject 函数可以接受一个 javascript 中的数据，**也可以是一个新的 Promise**

  - 如果resolve接受的是一个promise实例，则会使用该promise实例的成功或者失败的原因作为下一个promise的成功或者失败的原因

    ```js
    Promise.resolve(new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('ok')
        },1000)
    })).then((data)=>{
        console.log(data)
    })
    ```
    
    
    
  - 如果reject接受的是一个promise实例，则直接将该promise实例作为下一个promise的reason
  
    ```js
    Promise.reject(new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('no ok')
        },1000)
    })).catch((err)=>{ // catch的本质就是then
        console.log(err)
    }).then(data=>{
        console.log(data)
    })
    
    // Promise.reject 不会等待内部代码执行完毕
    ```
  
    
  
- executor 函数执行报错时，调用 reject 函数

- 同一个 promise 实例可以调用多次 then 函数

- then方法可以链式调用

- **then 方法调用时是同步执行的，传给 then 方法的 onFulfilled 函数和 onRejected 函数是可选的**

- then 方法同步执行的时候，会首先判断 onFulfilled 函数和 onRejected 函数是否传值，没传则用默认值

- then 方法执行时会先判断该方法的 promise 实例对象的 state 是否不为 pending，如果不是，则根据 state 的状态立即开启一个**微任务**执行 onFulfilled 函数或者 onRejected 函数，并将实例上的 this.value 或者 this.reason 传给对应的回调函数并且该回调函数会作为微任务加入微任务队列

- 如果 then 方法执行时，对应的 promises 实例的状态仍是 pending，则将对应的 onFulfilled 函数和 onRejected 函数订阅到 promise 实例的对应属性上存放起来

- then 方法执行后，返回一个新的 promise 

- onFulfilled 函数和 onRejected 函数是两个异步执行的任务，原生中是微任务

- 如果 onFulfilled 函数和 onRejected 函数运行时报错，则使用错误结果作为 promise2 失败的原因

- onFulfilled 函数和 onRejected 函数是有返回值的，返回值的不同情况： 非 promise 实例数据，抛出错误，promise 实例

  **分析 onFulfilled 函数和 onRejected 函数返回值——x 与 promise2 的成功态和失败态的关系**：

  - 其中需要考虑 x 可能是其他库实现的 promise 实例

  - 如果 x 和 promise2 是同一个 promise2 对象，则调用 promise2 的 reject 并报错

    ```js
    const promise2 = new Promise(() => {
      resolve();
    }).then((data) => {
      return promise2; // 这个返回值就是x
    });

    promise2.then(
      () => {},
      (err) => {
        console.log(err);
      }
    );
    ```

  - 如果 x 是 promise 实例，这步都需要考虑其他库实现的 promise

    - 判断 x 是否为 promise 的条件，x 是一个对象或者函数，而且还需要有 then 方法

    - 如果 x 是一个 promise 实例，则取出它的 then 方法存入一个变量中

    - 如果取 then 方法时报错，则需要捕获错误并执行 reject(err)

      ```js
      // 其他库如果这么写，取then的时候就会报错
      let promise = {};
      Object.defineProperty(promise, 'then', {
        get() {
          return throw new Error('错误');
        }
      });
      ```

    - then 还必须是一个函数

      ```js
      new Promise((resolve) => {
        resolve(123);
      }).then((data) => {
        return {
          then: 'abc' //这个return返回值符合promisea+规范，但是它的then不是一个方法，所以不能看作一个promise实例
        };
      });
      ```

    - 当 x 是一个 promise 实例的时候，会调用它的 then 方法，该方法绑定 x 为 this，且接受 resolvePromise 和 rejectPromise 两个回调函数，但是这两个回调函数只能被调用一次

      ```js
      let otherPromise = {
        // 假设这是别人的promise库生成的实例对象
        then(resolvePromise, rejectPromise) {
          resolvePromise(); // 当我自己实现的promise中将resolvePromise传给这个otherPromise实例的then方法后，这里多次调用的它，但我的实现中必须避免这种多次调用的情况
          resolvePromise();
          resolvePromise();
        }
      };

      let p = new Promise((resolve, reject) => {
        resolve();
      });

      let p2 = p.then(() => {
        return otherPromise;
      });
      ```

    - 如果 x 是一个函数或者对象，但是没有 then 方法，则也证明 x 不是 promise，这是直接调用 promise2 的 resolve(x)

  - 如果 x 不是 promise 实例，则直接调用 promise2 的 resolve(x)

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
    this.onResolvedCallbacks = []; 
    this.onRejectedCallbacks = []; 
    // resolve和reject必须使用箭头函数，不然this只想会存在错误
    const resolve = (value) => {  
      // 这里添加一个规范外的逻辑 让value值是promise的话可以进行一个解析
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
- finally接受的回调函数有可能返回promise，这是需要等待该promise成功或者失败，但是不取用该romise 的成功或者失败

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
        resolve('abc');
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

```js
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let resultArr = [];
    let len = promises.length;

    promises.forEach((promiseItem, index) => {
      Promise.resolve(promiseItem).then((data) => {
        resultArr[index] = data;
        if (index + 1 === len) {
          resolve(resultArr);
        }
      }, reject);
    });
  });
};

// 这种写法上的缺陷，针对后面这个数组 [promise1,promise2,2,3,4]  因为后面几项不是promise实例，当forEach循环到后面几项时，具体是最后一项时，会直接触发Promise.resolve()的then方法，这是index+1 直接就等于len，直接触发外出promise实例的resolve，而这时resultArr中的每一项并不一定都有对应的值。
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

race 的应用：处理超时请求。

```js
// 不使用promise.race的方法

let abort;
new Promise((resolve, reject) => {
  abort = reject;
  setTimeout(() => {
    resolve('data'); // 这个请求要1秒才能回来
  }, 1000);
}).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

setTimeout(() => {
  abort('超时'); // 但是设置的最大请求时长的500ms
}, 500);
```

```js
// 使用race处理超时情况
function withAbort(userPromise) {
  // 包装后返回的是一个promise，而且可以决定不采用用户的promise的结果
  // Promise.race([我内置的promise比用户的快，userPromise])
  let abort;
  const internalPromise = new Promise((resolve, reject) => {
    abort = reject; // 将内容的reject方法作为终止方法
  });
  let p = Promise.race([internalPromise, userPromise]);
  p.abort = abort;
  return p;
}
let p = new Promise((resolve, reject) => {
  // abort= reject
  setTimeout(() => {
    // 模拟的请求
    resolve('ok');
  }, 3000);
});
p = withAbort(p); // 没有终止promise执行，只是不采用他的结果了
setTimeout(() => {
  p.abort('超时');
}, 500);
// 如果这个请求超过500ms了 结果就不要了
p.then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err, '失败');
});
```



#### allSettled

`Promise.allSettled()`方法返回 在**所有**给定的 promise 都已经`fulfilled`或`rejected`后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

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



扩展：

window.setTimeout，**`setTimeout()`**方法设置一个定时器，该定时器在定时器到期后执行一个函数或指定的一段代码。

```
var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);  // 附加参数，一旦定时器到期，它们会作为参数传递给function
```

返回值`timeoutID`是一个正整数，表示定时器的编号。这个值可以传递给[`clearTimeout()`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearTimeout)来取消该定时器。

需要注意的是 `setTimeout()` 和 [`setInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval) 共用一个编号池，技术上，`clearTimeout()` 和 [`clearInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/clearInterval) 可以互换。但是，为了避免混淆，不要混用取消定时函数。

在同一个对象上（一个 window 或者 worker），`setTimeout()`或者`setInterval()`在后续的调用不会重用同一个定时器编号。但是不同的对象使用独立的编号池。



## 生成器函数

Promise 本身还是有一些问题，所以又衍生出了其他**基于** Promise 的新语法特性对 Promise 的缺点进行规避。

Promise 串行通过 then 链解决；并行通过 Promise.all 来解决。如果功能更复杂，难免还是会有回调函数的嵌套，因为 promise 本身还是基于回调函数的。传给 then 方法 onfulfilled 和 onrejected 都是回调函数。所以 Promise 并没有完全解决嵌套问题，写异步时不够优雅。

为了**让异步编程用同步代码风格来实现**，解决方式有：

1. generator+promise

   generator 生成器，用于生成迭代器。可迭代的数据类型的值都有内置的迭代器。不能被迭代就说明代类型的值内部没有迭代器。

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

   **严格意义上的类数组：1. 有索引；2. 有长度；3. 能遍历**

   ```js
   let likeArray = {0:1,1:2,2:3,length:3}   // 这个对象默认并不是严格意义上的类数组
   
   [...likeArray] // 报错  likeArray is not iterable   但是可以通过元编程来修改属性本身的逻辑，本身不能迭代，但可以添加迭代方法。
   
   Array.from(likeArray)  // [1,2,3]
   ```

   自己实现迭代方法：

   ````js
   let likeArray = {
     0:1,
     1:2,
     2:3,
     length:3,
     [Symbol.interayor](){
       let index= 0  // 闭包
       return {
         next:()=>{
           return {value:this[index],done:index++>=this.length}
         }
       }
     }
   }
   
   let arr = [...likeArray]  // 会自动调用该对象中的迭代器方法
   ````
   
   
   ```js
   let likeArray = {
       0:1,
       1:2,
       2:3,
       length:3,
       [Symbol.interayor]:function* (){
           let index = 0
           while(index !== this.length){
               yield this[index++]
           }
       }
   }
   
   let likeArray = { // 内部迭代的时候会根据 done 的返回结果来继续调用 next 
       0: 1, 
       1: 2, 
       2: 3, 
       length: 3, 
       [Symbol.toStringTag]() { return 'likeArray'  },
       // Symbol 可以创建一个独一无二的值， 而且这个 Symbol 还可以实现“元编程” 可以改变 js 的原有的实现、底层机制 console.log(likeArray.toString());       [object likeArray]
   
       [Symbol.iterator]() { // 要求返回值 而且标识是否迭代完成 {done:false/true,value:结果}
           let that = this; // 当前的类数组 
           let index = 0; 
           return { // 自己模拟了一个迭代器 
               next() { 
                   return ({ value: that[index],done: index++ === that.length })
               }
           }
       }
   };
   ```
   
   

````js
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
it.next(); // 遇到yield 语句就暂停协程的执行，而执行父协程，并将协程中的数据返给父协程
it.next('a'); // 父协程启动read子协程的执行，并将参数作为yield语句的返回值传入子协程
it.throw('b'); // 父协程将错误抛给子协程去捕获，由子协程内部去捕获
it.next('c');
````

yield 产出的结果可以等结果产出后再调用 next 开启子协程的继续执行。

```js
const fs = require('fs/promise');
const path = require('path');

function* read() {
    try{
        let name = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
        let age = yield fs.readFile(path.resolve(__dirname, name), 'utf8');
        return age;
    }catch(error){
        console.log(error)
    }
}

let it = read();
let { value, done } = it.next();
if (!done) {
    value.then((data) => {
        let { value, done } = it.next(data);
        if (!done) {
            value.then((data) => {
                let { value, done } = it.next(data);
                if (done) {
                    console.log(value);
                }
            }).catch((error) => {
                it.throw(error);
            });
        }
    }).catch((error) => {
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

- async + await = generator + co
- async 函数默认执行后就会返回一个 promise
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

- 宏任务： 脚本的执⾏、ui渲染、定时器、http请求、事件处 理（⽤户操作）、MessageChannel、setImmediate 

- 微任务： 原⽣的promise.then、mutationObserver、 node中的（process.nextTick）、queueMicrotask
- requestFrameAnimation 、requestIDleCallback 

![image-20220714211548498](..\typora-user-images\image-20220714211548498.png)



- 主线程代码执⾏完毕后，会查找微任务队列中的任务将其取出到执行栈中执⾏，循环该过程直到清空为任务队列， 如果微任务被取出到执行执行的过程中⽣成了新的微任务放到本次微任务队列的后⾯，如果是宏任务则交给对应的线程去处理
- 微任务队列全部清空后，要检测"是否到达刷新渲染的时机"，如果到达，则由渲染线程占据主线程，进行页面渲染工作，此时js引擎暂停工作，渲染结束后，js引擎恢复工作，在宏任务队列中取出一个宏任务到执行栈中执行，期间循环前一步的工作流程；如果没有到达渲染时机，则直接去取宏任务队列中的一个任务进行执行。浏览器有⾃⼰的刷新频率



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
document.body.style.background = 'red';
console.log(1)
setTimeout(()=>{
    console.log(2)
    document.body.style.background = 'yellow';
})
console.log(3);
```

本轮同步代码执行，先将 body 的背景颜色设为 red，然后打印 1，将 setTimeout 中的回调函数加入到宏任务队列中等待执行，再打印 3，本轮同步代码执行完毕，现在开始清空微任务队列，微任务为空。接下来就有两种情况：

1. js 引擎在该帧内还有时间执行代码，本轮事件循环任务结束，js 引擎线程继续开启下一轮事件循环，取出前面宏任务队列中的代码，进行新一轮事件循环，打印 2 并将 body 的颜色设为 yellow，往后再没有可执行的代码，然后等待渲染线程渲染页面，表现为一直都是 yellow 的背景颜色。（yellow 不闪烁）
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

**代码模拟点击的情况，绑定的事件处理函数是同步执行的。而用户点击的情况，事件处理函数会被追加到宏任务队列中进行执行。**

```js
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
```





```js
console.log(1);
async function asy() {
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
asy();
console.log(8);



async function asy() {
  console.log(2);
  await console.log(3);  // yeild Promise.resolve(console.log(3)).then(console.log(4))
  console.log(4);
}
```





```js
Promise.resolve().then(() => {
    console.log(0);
    return new Promise((resolve)=>{    // queueMircroTask(()=>x.then((y)=>resolve(y))
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
// 0 1 2 'a' 3  4 5 这个结果是符合我们promiseA+规范
// 在ecmascript规范中，如果返回了一个promise， 会将这个promise再次包装一个微任务  0 1 2 3 'a' 4 5
```



## node 代码调试

### 方式一

Node 内置命令行调试器，通过 `node inspect` 命令执行，通过输入命令来描述行为，不如可视化操作高效。

### 方式二

在运行 Node.js 程序时开启一个进程来监听调试请求，默认的监听端口是 9229。每个监听进程都被分配了唯一的 UUID，调试客户端通过 `ws://{host}:{port}/{UUID}` 和监听进程建立 websocket 通信。

Node.js 开启调试服务被动等待，调试客户端主动发起对接。

1. 开启调试服务 (跟随程序启动)

   node --inspect name.js: 启动调试服务，跑完程序就退出。除非是有异步任务在，不然完全不给调试器对接的机会。

   node --inspect-brk name.js: 启动完调试服务就停在开头，等着调试器接入，接入后断在第一行代码等待下一步操作。

   node--inspect-bar=8080 name.js

   ![image-20220428203239608](..\typora-user-images\image-20220428203239608.png)

   注意点：

   > 对于 `node` 命令之外的启动脚本，例如 `npm/yarn/vercel/next`。`--inspect` 是 Node.js 的标识符，其他脚本无法识别，这种情况可以设置变量 `NODE_OPTIONS` 来解决。
   >
   > ```shell
   > NODE_OPTIONS='--inspect' vercel dev
   > ```

在已运行的程序上开启调试服务，`kill -s SIGUSR1 49026` 作用是给进程 id 是 49026 的进程发送 `SIGUSR1` 信号，当 Node.js 进程收到 `SIGUSR1` 时，将启动调试服务。

2. 客户端调试 Chrome DevTools 会根据地址列表自动检查调试服务启动情况，默认地址有本地的 9229 和 9222 端口。`chrome://inspect` 面板负责调试管理。 ![image-20220428204207581](..\typora-user-images\image-20220428204207581.png)

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

Node 能干什么？特点(事件驱动，非阻塞I/O)？node 中模块的实现原理？require 引用一个文件的原理？被引入文件导出原理？



### 是什么

nodejs：是一个 js 运行环境，让 js 能跑在服务器上。

在浏览器端 JavaScript 由：ECMAScript + BOM + DOM 组成

在 nodejs 中 JavaScript 由：ECMAScript + 内置模块 + 第三方模块 组成(没有 window，document 等对象)



### 特点

node 中实现了一些**新的有别于浏览器的异步 API**，而且它没有完全使用浏览器中的**事件触发线程**（事件环）来管理异步任务。 异步 api：（i/o，定时器等），node 中对这些异步任务的管理也有自己的一套事件环机制。

在 node 中主线程也是单线程的。java 类后台是多线程同步的，node 后台是单线程异步的。

多线程语言，客户端每来一个请求，服务端就会创建一个单独的线程来处理该请求。请求多就会开多个线程。多线程语言内部都有一个线程池的概念，多个请求到来时，会在线程池中拿到对应的线程去处理，超过线程池中线程数量的请求就需要排队处理。多线程语言比较适合处理 cpu 密集型操作（压缩，合并，加密等计算）； 线程多会占用一定的内存空间，锁问题（多个操作操作同一个资源就会上锁）。 感觉多线程是并发操作，其实是依赖时间片扭转实现并发。

单线程语言，不必开启多个线程，节约内存，单线程语言处理 CPU 密集型可能会发生阻塞。适合 i/o 密集型（文件读写），web 场景基本都是文件读写，（nginx 也是单线程的，适合处理高并发），node 底层的系统操作依然是多线程的（比如多个请求都是读取文件内容，nodejs 中的主线程只是依次将读取任务派发给底层的其他多线程模块去处理的，并不会阻塞）。异步和文件读写，靠底层的多线程去执行这些异步任务，任务完成后，通过事件环将结果返回，node 中的专门触发线程读取回调并执行。node 不适合 cpu 密集型的，适合 i/o 密集型的。



### 应用场景

- 作为客户端服务的中间层（bff（Back-end For Front-end），代理），解决跨域，处理数据的结构

- ssr，在服务端解析 js 语法，可以解析 vue 和 react 中的语法实现服务端渲染，将框架代码在服务器端运行，运行完成后生成一个 html 返给前端完整渲染后的结果
- 做工具（打包工具，构建工具）， 但是现在逐渐转向 Esbuild
- 日志收集系统
- 提供接口，做服务端（egg.js，nest.js，koa，express）



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

node 环境下：

```js
console.log(this)(
  // {}  空对象，指代的是module.exports

  function () {
    console.log(this); // global对象
  }
)();
```

- 传统使用**单例模式**实现模块化的封装，会有调用过长的问题

- IIFE，**立即执行函数**，导出 IIFE 中的内容，利用闭包需要再拆分文件

- seajs，requirejs 类似于 jsonp 方式，动态请求一个文件并在拿到文件后再做一些事

- import / export default ，前端模块化是基于 http 请求的。在 webpack 打包项目中没有看到发请求，是因为webpack 将引用的代码打包到统一的文件而不发请求了（除非拆包）。动态 import 一个文件，浏览器会自动的去发起一个请求，返回执行结果后使用。

- 服务端实现模块化就不需要发请求，因为服务端可以用文件读写的能力更简单的实现模块化。

**模块化的概念就是规定如何使用别人的内容，如何将内容导出给别人使用。**

面试题：浏览器中的事件环和 node 中的事件环的区别。



## commonjs

commonjs 规范：

- 每个文件就是一个模块
- 引用用 require
- 导出用 module.exports

使用 commonjs 规范引入一个文件，通过 node 内置的功能去先找到并读取文件，将读取的文件内容包在一个立即执行的函数中，该立即执行函数中返回 module.exports。

node 原生不支持 ES6 的模块化语法，即直接在 js 文件中书写 import 'xxxxx.js'，是没法识别的，如果想要 node 支持 import 语法，则需要先将 js 后缀改为 mjs，或者在 package.json 中添加"type":"module"。

package.json:

```json
{
    "type":"module" // "commonjs"
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



## 模块化原理前置知识

### fs

fs 模块中有两种 api，同步和异步。同步的性能好，因为不用开启其他线程。

什么时候用同步什么时候用异步？如果用户请求，如果采用同步则会发生阻塞问题，如果代码刚启动时用同步则没有负面影响。fs.readFileSync(url[,'utf8'])；fs.existsSync(url)，该方法的异步方法被废弃。

```js
// 自动递归创建
fs.mkdir(path.resolve(__dirname,'a/b/c/d')[,{recursive:true}],function(err){
    // 报错，该api要求在创建文件时需要先有上级目录
    //....
})

// 如果a目录下不为空，则不能删除，也支持{recursive:true}递归删除
fs.rmdir(path.resolve(__dirname,'a'),cb) {}
// fs.rm(path[,options],callback)

 // 只读子文件夹和子文件
fs.readdir(path.resolve(__dirname,'a'),function(error,dirs){ })

// 如果该路径不存在文件或者文件夹，则报错
fs.stat(path.resolve(__dirname,'a'),function(error,statObj){  
    statObj.isFile()   // 是否是文件
    statObj.isDirectory()  // 是否是文件夹
})

fs.unlink(path,cb)  // 删除文件



// 异步串行删除   通过递归调用
function rmdir(filePath, cb = () => {}) {
  fs.stat(filePath, function (err, statObj) {
    if (err) return cb(err);
    if (statObj.isFile()) {
      // 如果是文件
      fs.unlink(filePath, cb);
    } else {
      // 如果是目录
      fs.readdir(filePath, (err, dirs) => {
        if (err) return cb(err);
        dirs = dirs.map((dir) => path.resolve(filePath, dir));
        let index = 0;
        // 异步串行删除
        function next() {
          if (dirs.length === index) {
            // 空目录直接删除,或者目录下文件都删除完了
            return fs.rmdir(filePath, cb);
          }
          let dir = dirs[index++];
          rmdir(dir, cb);
        }
        next();
      });
    }
  });
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



###  path

**path.resolve()** 这个方法根据路径解析出一个绝对路径而且**解析的路径是`以运行位置为基准`**，当拼接 ' / '时则直接回到磁盘根路径下。

C:\users\test\Desktop\node\one\1.js:

```js
const path = require('path');

console.log(path.resolve('note.md'));
```

在 C:\users\test\Desktop\node\one 目录下执行 node 1.js

打印：C:\users\test\Desktop\node\one\note.md

在 C:\users\test\Desktop\node 目录下执行 node one\1.js

打印：C:\users\test\Desktop\node\note.md

所以一般要结合__dirname来使用：

```js
const path = require('path');

console.log(path.resolve(__dirname,'note.md'));
console.log(path.resolve(process.cwd(),'note.md'));  // 默认
```

注意：

> __dirname是node在commonjs模块化规范中提供的，如果文件使用的是esmodule模块化规范 xxx.mjs
>
> ```js
> import path from 'path'
> console.log(path.resolve(__dirname,'note.md'));
> console.log(arugments) // arguments也是没有的
> ```
>
> 这是会报错：__dirname未定义。
>
> 
>
> 解决办法： 在esmodule模块化文件中获取文件的绝对路径
> ```js
> import path from 'path'
> import url from 'url'
> const obj = url.parse(import.meta.url)  // const obj = new URL(import.meta.url)
> 
> let dirname = path.dirname(obj,pathname) // 这个就是文件的绝对路径
> 
> ```



**path.join()**这个方法只是负责路径拼接，没有其他任何功能

如果有'/'路径的情况下不要使用 resolve，resolve 会将'/'视为绝对路径。

```js
console.log(path.resolve('note.md')); //js文件内部内容

// 在该js文件所在目录下执行 node xxx.js   则打印该文件所在的路径拼接上note.md
// 在该js文件所在的上一级目录下执行 node yyy/xxx.js   则打印该文件上一级的路径拼接上note.md
// 所以一般和__dirname进行拼接使用

path.extname(a.min.js); // .js

path.basename('a.js', '.js'); // a   path.basename(path,base)

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

1. 在 node 的源码中执行 Module.prototype.require(path)； 然后调用 Module.\_load 加载某个模块文件，返回该方法执行结果：module.exports；
2. Module.\_resolveFilename 方法获取文件的绝对路径，因为之后要读取该文件，尝试添加后缀.js 或者.json，.node 等。
3. 判断文件是否在缓存中
4. 判断模块是否是原生的，如果不是原生模块，则直接创造模块 new Module，每个模块有一个 id，id 对应的值就是模块的绝对路径，还有一个属性叫 exports 代表文件的导出结果，默认是空对象。 new Module 创建完模块后，进行模块缓存。
5. 缓存该模块，第一次加载时将文件所在路径作为 key，模块对象作为值缓存在一个对象中。
6. module.load(path):加载文件
7. findLongestRegisteredExtension(filename): 找对应的文件的后缀名注册过的对应的加载逻辑，js 文件有 js 的加载逻辑，json 有 json 的加载逻辑。加载采用了策略模式（Module.extensions(文件后缀)）。在 vite 中就是扩展了该策略模式，实现了对.vue 文件的加载。 可以根据该方法实现加载文件类型的扩展。

在 js 文件的策略模式源码中，采用 fs 模块的读取文件对应的内容，将内容传给 Module.\_compile,进行模块编译。

```js
fs.readFileSync(filename, 'utf8');
```

8. 旧版使用调用 Module.wrap 方法对文件内容进行包裹一个函数，用 vm.runInThisContext 去包裹该函数， 然后创建一系列的变量`'exports','reqiure','module'，'__filename','__dirname'`,赋值：\_\_dirname,require,exports,module 等；执行包裹后的函数并传入前面创建的几个参数。
   新版使用`vm.compileFunction(content,['exports','reqiure','module','__filename','__dirname']){....}`

9. 读取文件内容，包裹自执行函数，返回 module.exports



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

在 commonjs 模块语法中，一个模块 moduel.exports = value，其中 value 变量的值如果是基本数据类型，那么这个变量的值在模块中发生改变后，在引入该模块的其他模块的值并不会改变，取的仍就是模块第一次加载缓存下来的值。

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



### 循环引用

module-a.js

```js
let b = require('./module-b.js');
console.log('a中打印的b', b);
module.exports = 'a';
```



module-b.js：

```js
let a = require('./module-a.js');
console.log('b中打印的a', a);
module.exports = 'b';
```



node module-a.js：

```js
b中打印的a {}
a中打印的b b
```



在上面的commonjs模块化模拟实现的代码中，如果module-a.js作为模块执行的入口，一上来就创建好的a模块的module.exports为一个空对象并且同时加入到缓存中，该空对象只有a模块彻底执行完后才会被赋值。a中引入b模块会先创建b模块并加入缓存，然后执行b模块中的代码，然后在b模块中引入a模块时，之前的a模块已经被放入到了缓存中，只是值为一个空对象而已。

在node源码中，会一上来就先创建**入口模块**对应的Module实例对象，并缓存到Module._cache中，然后a中执行过程中引入了b模块，则又创建了b模块并缓存，然后继续执行完b模块的代码，但由于b模块代码中引入了a，则会去加载a模块，但是a模块已经被缓存了，只是因为a模块没有执行到a模块自己的module.exports = 'a'，所以a模块是一个空对象，所以打印了：“b中打印的a {}”，当b模块执行完后，b模块对应的module.exports = 'b'，然后执行上下文回到a模块代码中继续执行，这时a模块中打印b模块时，就有值存在了：“a中打印的b b”，最后才是给module-a的module.export 赋值为‘a'。

**对于commonjs规范来说，可以实现部分加载。**



如果非要两个模块之间相互调用，则使用下面的方法：

```js
function say(){
    console.log('a中的say方法,希望在b模块中使用')
}

let moduleB; // 你告诉我，我依赖的是谁
module.exports = {
    say,  // 闭包防止销毁say
    save(mod){
        moduleB = mod
    },
    init(){
        moduleB.say()
    }
}
```



```js
function say(){
    console.log('b中的say方法,希望在a模块中使用')
}

let moduleA; // 你告诉我，我依赖的是谁
module.exports = {
    say,  // 闭包防止销毁say
    save(mod){
        moduleA = mod
    },
    init(){
        moduleA.say()
    }
}
```



```js
const a1 = require('./a1');
const b1 = require('./b1')

a1.save(b1);
b1.save(a1);

// 模块一定已经加载完毕了

a1.init();
b1.init(); // 通过延后处理的方式来实 解决循环引用的问题
```



## process

process 进程对象中的重要属性：

每次 node 执行都会开一个进程，进程中有一些需要掌握的属性，使用场景和几率很高。global.process。

- platform：代码执行平台，写脚手架需要系统级别的配置文件，系统配置文件都是放在本机的用户下的。windows，mac 和 Linux 的系统配置文件所存放的路径都是不同的，可以根据 platform 区分平台，将对应的配置文件放在对应的平台目录下。

  process.platform平台标识win32和darwin

- nextTick(cb)：浏览器的事件环是每执行一个宏任务就会清空微任务。

- cwd：current working directory 当前的执行工作目录，运行打包时，找对应的配置文件，在当前目录下寻找执行路径。 process.cwd() ，可以通过执行process.chdir(path)，来修改process.cwd() 的路径。

- argv：参数列表，用户命令行交互获取用户输入的参数，前两个参数是默认的（可执行文件 node 的路径， 被执行文件路径），后面是用户的参数。关于参数的解析有一些常用的第三方库：commander、yargs、minimist

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
  set key=value && node index.js   // windows

  export key=value && node index.js  // mac
  ```

  process.env 中包含全局环境变量（操作系统中的那些环境变量）和 局部环境变量

  系统环境变量中被配置到 path 中的可执行文件的路径，可以在命令行中直接执行。

- chdir :修改代码执行的路径，cwd 方法可能受 chdir 的影响

  ```js
  process.chdir('../../../');
  ```



```js
// node index.js --port 3000

console.log(process.argv);
```

写工具无非就是创建一些配置文件，解析用户的执行操作等。



commander使用演示：

```shell
npm install commander -D
```



```js
const {program} = require('commander')
const chalk = require('chalk') 
const pkg = require('./package.json')
program.version(pkg.version)
    .name('my-cli')   // 发布的命令名字
    .usage('<command> [options]')   // 使⽤⽅式

program.option('--type [type]', 'Choose a project type', {
    default: 'node',
    })
program.command('create') // 执行的命令
    // 选项 短写、长写   描述信息    默认值
    .option('-d, --directory [dir]','set directory',process.cwd())
    .description('create project dir')
    .action((args)=>{ // 命令对应的行为
        console.log('create project',args)
    }
)
program.command('serve')
    .option('-p, --port <v>','set port')
    .description('start serve')
    .action((args)=>{
        console.log('serve',args,program.opts())
    }
)
// 固定的写
program.on('--help',function(){
    console.log(`\r\nRun ${chalk.blueBright('my-cli <command>')} --help for detailed usage of given command.`)
})

program.parse(process.argv)
```





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

- js代码交给V8解析执行
- 其中涉及node异步API的代码，会通过libuv来处理
- libuv会为不同的异步API开启多个不同线程进行异步处理
- 线程处理成功后，将回调函数推入对应的队列中，然后事件循环线程依次循环不同的队列，取出其中的任务并执行



每⼀个阶段都对应⼀个事件队列(专门用于IO的队列，专门放定时器任务的队列等)，当event loop执⾏到某个阶段时会将当前阶段对应的队列依次执⾏。当该队列已⽤尽或达到回调限制，事件循环将移动到下⼀阶段。



setImmediate 是 node 中新增的宏任务

nextTick 是 node 中新增的微任务（node 官方不这么叫），优先级最高的微任务。本轮主执行栈中的任务执行完后立即执行 nextTick ，然后再进入事件环中。

`process.nextTick()` 从技术上讲不是事件循环的一部分。相反，它都将在当前操作完成后处理 `nextTickQueue`， 而不管事件循环的当前阶段如何。这里的一个*操作*被视作为一个从底层 C/C++ 处理器开始过渡，并且处理需要执行的 JavaScript 代码。

**任何时候在给定的阶段中调用 `process.nextTick()`，所有传递到 `process.nextTick()` 的回调将在事件循环继续之前解析。**

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

**timers：存放所有定时器任务**，本阶段执⾏已经达到定时任务的 setTimeout() 和 setInterval() 的调度回调函数。

pending callbacks：执⾏延迟到下⼀个循环迭代的 I/O 回调

idle,prepare：node 内部使用的队列，开发者没法控制

**poll(轮询阶段)：处理 i/o 回调，在循环的过程中在此阶段阻塞，没有宏任务后在这个阶段休眠**

**check：setImmediate() 回调函数在这⾥执⾏。 **

close callbacks：一些关闭的回调函数，如：`socket.on('close', ...)`

浏览器中的事件环在没有宏任务的时候会休眠。

开发者主要关心的队列情况有，先只考虑宏任务，下图

![image-20220222080449935](..\typora-user-images\image-20220222080449935.png)

先在主执行栈中执行本轮同步代码，执行完后再执行 nextTick 相关任务，执行完 nextTick 相关任务后，开始进入事件环。在事件环中，先依次清空各个队列（从上往下）。如果走到 poll 阶段后，会检测 check 队列中是否有任务，有，则清空 poll 队列后向下继续执行 check 队列，然后循环回到 timers，然后再到 poll 中；如果没有，事件环运行则停在 poll 阶段等着，等自身任务队列中是否有新 i/o 任务入队，等 check 或者 timers 中有任务产生，如果是 check 中先有任务产生则向下执行，如果是 timers 中先有任务，则回到 timers 中开始向下执行。

node 中 v8 引擎负责解析 js 语法，而且可以直接调用 node 中的 api。

libuv 是负责执行 node 提供中的 api，执行过程会开启多个线程，执行完毕后放到队列中，会开启一个单独的事件线程来处理任务。 libuv 决定调用的任务是同步还是异步，如果是异步的话，执行后推入对应的任务队列依次执行。

**微任务：微任务队列在每次宏任务执行完毕一个后就会被清空（这点和浏览器一样）。**

**注意在 node10 以前的版本中，是一个宏任务队列中的所有任务清空完后，再去清空微任务。**

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
```



## 模块查找流程

![image-20210418105915555](..\typora-user-images\image-20210418105915555.png)

内置模块的在源码中最先尝试被加载。然后会去加尝试判断是否是相对路径的模块，再后才判断是否是第三方模块，如果是第三方模块，内部会去依次列出从当前目录一直到磁盘根目录的node_modules路径，同时附加在当前主机用户磁盘下的node_modules

![image-20231219104824066](images\image-20231219104824066.png)

一个模块会不会被打包取决于我们在项目中是否引入了该模块，跟该模块放在`dependencies`中还是`devDependencies`并没有关系。



`package.json`中的`dependencies`和`devDependencies`的区别，`peerDependencies`、`bundledDependencies`、`optionalDependencies`

`peerDependencies`

它用来表明如果你想要使用此插件，此插件要求宿主环境所安装的包。比如项目中用到的`veui1.0.0-alpha.24`版本中：

```
"peerDependencies": {
    "vue": "^2.5.16"
 }
```

这表明如果你想要使用`veui`的`1.0.0-alpha.24`版本，所要求的`vue`版本需要满足`>=2.5.16`且`<3.0.0`。如果安装结束后宿主环境没有满足`peerDependencies`中的要求，会在控制台打印出警告信息。



bundledDependencies

当想在本地保留一个`npm`完整的包或者想生成一个压缩文件来获取`npm`包的时候，会用到`bundledDependencies`。本地使用`npm pack`打包时会将`bundledDependencies`中依赖的包一同打包，当`npm install`时相应的包会同时被安装。需要注意的是，`bundledDependencies`中的包不应该包含具体的版本信息，具体的版本信息需要在`dependencies`中指定。

例如一个`package.json`文件如下：

```json
{
  "name": "awesome-web-framework",
  "version": "1.0.0",
  "bundledDependencies": [
    "renderized", 
    "super-streams"
  ]
}
```

当执行`npm pack`后会生成`awesome-web-framework-1.0.0.tgz`文件。该文件中包含`renderized`和`super-streams`这两个依赖，当执行`npm install awesome-web-framework-1.0.0.tgz`下载包时，这两个依赖会被安装。

当使用`npm publish`来发布包的话，这个属性不会起作用。



optionalDependencies

这是可选依赖。如果有包写在`optionalDependencies`中，即使`npm`找不到或者安装失败了也不会影响安装过程。需要注意的是，`optionalDependencies`中的配置会覆盖`dependencies`中的配置，所以不要将同一个包同时放在这两个里面。

如果使用了`optionalDependencies`，一定记得要在项目中做好异常处理，获取不到的情况下应该怎么办。





为什么有的命令写在`package.json`中的`script`中就可以执行，但是通过命令行直接执行就不行？

npm run  `<command>`：如果不加`command`，则会列出当前目录下可执行的所有脚本。test`、`start`、`restart`、`stop`这几个命令执行时可以不加`run。

通过`http-server`启动一个服务器，如果事先没有全局安装过`http-server`包，只是安装在对应项目的`node_modules`中。在命令行中输入`http-server`会报`command not found`，但是如果在`scripts`中增加如下一条命令就可以执行成功。

```json
scripts: {
    "server": "http-server"
}
```

**`npm run`命令会将`node_modules/.bin/`加入到`shell`的环境变量`PATH`中，这样即使局部安装的包也可以直接执行而不用加`node_modules/.bin/`前缀。当执行结束后，再将其删除。**



为什么需要`package-lock.json`文件？

在理想情况下，`npm`应该是一个纯函数，无论何时执行相同的`package.json`文件都应该产生完全相同的`node_modules`树。在一些情况下，这确实可以做到。但是在大多情况下，都实现不了。主要有以下几个原因：

- 不同的`npm`版本有着不同的安装算法
- 自上次安装之后，有些符合`semver-range`的包已经有新的版本发布。这样再有别人安装的时候，会安装符合要求的最新版本。比如引入`vue`包：`vue:^2.6.1`。A小伙伴下载的时候是`2.6.1`，过一阵有另一个小伙伴B入职在安装包的时候，`vue`已经升级到`2.6.2`，这样`npm`就会下载`2.6.2`的包安装在他的本地
- 针对第二点，一个解决办法是固定自己引入的包的版本，但是通常我们不会这么做。即使这样做了，也只能保证自己引入的包版本固定，也无法保证包的依赖的升级。比如`vue`其中的一个依赖`lodash`，`lodash：^4.17.4`，A下载的是`4.17.4`, B下载的时候有可能已经升级到了`4.17.21`

为了解决上述问题，`npm5.x`开始增加了`package-lock.json`文件。每当`npm install`执行的时候，`npm`都会产生或者更新`package-lock.json`文件。`package-lock.json`文件的作用就是锁定当前的依赖安装结构，与`node_modules`中下所有包的树状结构一一对应。

下面是`less`的`package-lock.json`文件结构：

```json
"less": {
    "version": "3.13.1",
    "resolved": "https://registry.npmjs.org/less/-/less-3.13.1.tgz",  // 包的安装源
    "integrity": "sha512-SwA1aQXGUvp+P5XdZslUOhhLnClSLIjWvJhmd+Vgib5BFIr9lMNlQwmwUNOjXThF/A0x+MCYYPeWEfeWiLRnTw==",
    "dev": true,
    "requires": {
      "copy-anything": "^2.0.1",
      "errno": "^0.1.1",
      "graceful-fs": "^4.1.2",
      "image-size": "~0.5.0",
      "make-dir": "^2.1.0",
      "mime": "^1.4.1",
      "native-request": "^1.0.5",
      "source-map": "~0.6.0",
      "tslib": "^1.10.0"
    }，
    dependencies: {  // 结构与外层结构相同，存在于包自己的node_modules中的依赖（不是所有的包都有，当子依赖的依赖版本与根目录的node_modules中的依赖冲突时，才会有）
     "copy-anything": {
          "version": "2.0.3",
          "resolved": "https://registry.npmjs.org/copy-anything/-/copy-anything-2.0.3.tgz",
          "integrity": "sha512-GK6QUtisv4fNS+XcI7shX0Gx9ORg7QqIznyfho79JTnX1XhLiyZHfftvGiziqzRiEi/Bjhgpi+D2o7HxJFPnDQ==",
          "dev": true,
          "requires": {
            "is-what": "^3.12.0"
          }
       }
    }
 }
```

有的包可以被安装在根目录的`node_modules`中，有的包却只能安装在自己包下面的`node_modules`中，这涉及到`npm`的安装机制。



一个包在项目中有可能需要不同的版本，最后安装到根目录`node_modules`中的具体是哪个版本？

npm从`3.x`开始，采用了扁平化的方式来安装`node_modules`。在安装时，npm会遍历整个依赖树，不管是项目的直接依赖还是子依赖的依赖，都会优先安装在根目录的`node_modules`中。遇到相同名称的包，如果发现根目录的`node_modules`中存在但是不符合`semver-range`，会在子依赖的`node_modules`中安装符合条件的包。

以`npm`官网的例子举例，假设`package{dep}`结构代表包和包的依赖，现有如下结构：`A{B,C}`, `B{C}`, `C{D}`，按照上述算法执行完毕后，生成的`node_modules`结构如下：

```
A
+-- B
+-- C
+-- D
```

对于`B`,`C`被安装在顶层很好理解，因为是`A`的直接依赖。但是`B`又依赖`C`，安装`C`的时候发现顶层已经有`C`了，所以不会在`B`自己的`node_modules`中再次安装。`C`又依赖`D`，安装`D`的时候发现根目录并没有`D`，所以会把`D`提升到顶层。

换成`A{B,C}`, `B{C,D@1}`, `C{D@2}`这样的依赖关系后，产生的结构如下：

```go
A
+-- B
+-- C
   +-- D@2
+-- D@1
```

`B`又依赖了`D@1`，安装时发现根目录的`node_modules`没有，所以会把`D@1`安装在顶层。`C`依赖了`D@2`，安装`D@2`时，因为`npm`不允许同层存在两个名字相同的包，这样就与跟目录`node_modules`的`D@1`冲突，所以会把`D@2`安装在`C`自己的`node_modules`中。

模块的安装顺序决定了当有相同的依赖时，哪个版本的包会被安装在顶层。首先项目中主动引入的包肯定会被安装在顶层，然后会按照包名称排序(a-z)进行依次安装，跟包在`package.json`中写入的顺序无关。因此，如果上述将`B{C,D@1}`换成`E{C,D@1}`，那么`D@2`将会被安装在顶层。

有一种情况，当我们项目中所引用的包版本较低，比如`A{B@1，C}`，而`C`所需要的是`C{B@2}`版本，现在的结构应该如下：

```
A
+-- B@1
+-- C
   +-- B@2
```

有一天我们将项目中的`B`升级到`B@2`，理想情况下的结构应该如下：

```
A
+-- B@2
+-- C
 
```

但是现在`package-lock.json`文件的结构却是这样的：

```go
A
+-- B@2
+-- C
   +-- B@2
```

`B@2`不仅存在于根目录的`node_modules`下，`C`下也同样存在。这时需要我们手动执行`npm dedupe`进行去重操作，执行完成后会发现`C`下面的`B@2`会消失。优化一下`package-lock.json`文件的结构。





## event 模块

node中提供的发布订阅模式模块。 利于代码的解耦合，比如有两个类，原本这了类是彼此独立不相干的，但是两个类的实例之间可以相互通信，一般使用类的继承或者继承原型链，但是另一种方式就是使用发布订阅模式。

```js
const EventEmitter = require('events'); 
const util = require('util');

function Girl() {}
util.inherits(Girl, EventEmitter); // 现在可以不强求使用这个方法，可以使用class+extends 

let girl = new Girl(); // once

// 批处理 例如多次修改数据只更新一次页面
// 内部的提供的newListener，会在每次绑定一个事件的时候出触发，但是本次绑定的事件的回调函数还没有被添加的待触发的数组中。
let flag = false;
girl.on('newListener', (type) => { 
  // 此方法可以监控到用户绑定了哪些事件
  if (!flag) {
    process.nextTick(() => {
      girl.emit(type); 
      flag = false
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

node 中的 util 模块提供一些原生 API。



手写 event：

```js
function EventEmitter(){}

EventEmitter.prototype.on = function (eventName,fn){
    if(!this._events) this._events = {}; // 这种写法可以处理那些继承了EventEmitter的类的实例上没有this._event属性的情况

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

- 全局模块，在命令行(命令行工具)中使用，常用的全局模块：npm,nrm,nvm

  > nrm ls
  >
  > nrm use xxx
  >
  > npm copnfig list
  >
  > npm root -g：输出全局的软件包位置

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

npm uninstall --global  modulename（package.json 中的 name 字段）

可执行文件需要增加执行头 —— #! /usr/bin/env node

www 文件内容：

```
#! /usr/bin/env node
console.log('asd')
```



写法二：

1. npm init -y

2. 创建 index.js 文件（如果 package.json 中没有配置 main, 默认会将 index.js 作为入口，如果包中没有 index.js, 那么就必须配置 main）

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



可以在代码中配置可执行脚本，package.json 中的 script 字段。

将一些全局模块安装在项目中，一般情况下开发工具就安装在项目中。全局模块安装在项目中，项目的 node_modules 目录下会有.bin 目录下创建可执行文件。

npm run 命令执⾏时，会把 ./node_modules/.bin/ ⽬录 添加到执⾏环境的 PATH 变量中，因此如果某个命令⾏包未 全局安装，⽽只安装在了当前项⽬的 node_modules 中， 通过 npm run ⼀样可以调⽤该命令。

npm run env 查看环境变量 path，在控制台打印系统环境变量，其中会有该项目的中的 node_modules/.bin。

npx 也可以执行命令，但是项目中不存在该命令行工具时，会先下载再执行，然后再删除，原理大致和 npm run xxx 一样。

执⾏ npm 脚本时要传⼊参数，需要在命令后加 -- 标明, 如 npm run hello -- --port 3000 可以将 --port 参数传 给hello 命令 

npm 提供了 pre 和 post 两种钩⼦机制，可以定义某个脚本 前后的执⾏脚本,没有定义默认会忽略

```json
"scripts": {
    "prehello":"echo prehello",
    "hello": "echo hello",
    "posthello":"echo posthello"
}
```

![image-20230608172236300](.\images\image-20230608172236300.png)



**mime 第三方包可以用于传入一个文件名，返回文件的类型。**



### npm版本管理 

npm采⽤了semver规范作为依赖版本管理⽅案。semver 约定 ⼀个包的版本号必须包含3个数字 

主版本号.次版本号.修订号

- MAJOR，主版本号
- MINOR，⼩版本号
- PATCH，修订版本号

MAJOR 对应⼤的版本号迭代，做了不兼容旧版的修改时要更新 

MAJOR 版本号 MINOR 对应⼩版本迭代，发⽣兼容旧版API的修改或功能更新时，更新MINOR版本号 

PATCH 对应修订版本号，⼀般针对修复 BUG 的版本号 

当每次发布包的时候都需要升级版本号:

```
npm version major # ⼤版本号加 1，其余版本号归 0
npm version minor # ⼩版本号加 1，修订号归 0
npm version patch # 修订号加 1
```

预发版：

- alpha(α)：预览版，或者叫内部测试版；⼀般不向外部发布，会有很多bug；⼀般只有测试⼈员使⽤。 "1.0.0- alpha.1" 
- beta(β)：测试版，或者叫公开测试版；这个阶段的版本会 ⼀直加⼊新的功能；在alpha版之后推出。 "1.0.0- beta.1" 
- rc(release candidate)：最终测试版本；可能成为最终产品 的候选版本，如果未出现问题则可发布成为正式版 本。"1.0.0-rc.1"

![image-20230608171801990](.\images\image-20230608171801990.png)



## Buffer

前端的blob类型的数据也是二进制，但是不允许操作它。arrayBuffer是前端用于存放二进制数据的类型，但是也是不能直接操作它，必须转为例如DateView

> **`ArrayBuffer`** 对象用来表示通用的、固定长度的原始二进制数据缓冲区。
>
> 它是一个字节数组，通常在其他语言中称为“byte array”。你不能直接操作 `ArrayBuffer` 中的内容；而是要通过[类型化数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)或 [`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。
>
> [`ArrayBuffer()` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/ArrayBuffer) 构造函数创建一个以字节为单位的给定长度的新 `ArrayBuffer`。你也可以从现有的数据（例如，从 [Base64](https://developer.mozilla.org/zh-CN/docs/Glossary/Base64) 字符串或者[从本地文件](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsArrayBuffer)）获取数组缓冲区。

Buffer 是 global 的属性，属性的值是一个构造函数。服务器端需要大量操作文件，所以 node 就自定义了一个类型 buffer，代表的是内存中存放的二进制数据，可以直接访问和操作这些二进制数据。操作文件就是 i/o 操作，针对内存做输入输出，描述内存情况，多大的文件，文件的内容。buffer在打印使用表现的是内存地址上存放的数据，但是实际存放的是该内存的地址。

Buffer 的结构和数组很相似，操作 Buffer 的方法拼写也和数组的方法一样。数组中没法存放二进制格式的文件（图片，音视频），而 buffer 则可以。一旦声明了buffer的大小后就不能再改变。

早期浏览器不支持文件读取，node 中操作文件需要 Buffer 类，**优点是可以和字符串相互转换。**



```shell
npm install @types/node   // 这个包用于提示node中api的类型
```

  

```js
// 声明方式（三种）
const buf1 = Buffer.allocated(size[, value])  // size是字节数  每个字节上都存放value的值
// 打印buffer中的数据时，使用的是16进制来显示

const buf2 = Buffer.from(arrayBuffer)  // 根据arrayBuffer自行指定buffer中每一项的存储内容

const buf3 = Buffer.from(string)  // 将字符串转为二进制存储到buffer中

```

uft-8编码是一个长度可变的编码规则，其中英文字母占一个字节，汉字占三个字节。



buffer合并：

```js
// buffer类似数组，可以通过索引和长度来访问每个字节
const buf1 = Buffer.from('hello')
const buf2 = Buffer.from('world')

const buf3 = Buffer.alloc(buf1.length+buf2.length)
// buf1.copy(target,targetStart,sourceStart,sourceEnd)
buf1.copy(buf3,0,0,5)
buf2.copy(buf3,5,0,5)


parseInt('10111001',2) // 二进制的数转为 10 进制

(0x16).toString('2') // 16 进制转为 2 进制数对应的字符串
```



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
// 为什么不用2进制 而用16进制展现呢? 
//   255 ->  ff ff
let buffer = Buffer.from('珠');
console.log(buffer); // e7 8f a0  因为一个字节最大8个位-> 8个位最大的值就是255 -> ff

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

Buffer.from('珠').toString('base64')  // 直接转为base64的图片的语法糖
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

- slice：buffer 截取，buffer 有 slice 方法可以截取 buffer，截取的是内存 **类似于二维数组**，内部的每个元素都是内存地址的

```js
let arr = [1, 2, 3, 4, 5];
// slice浅拷贝;
let arr2 = arr.slice(0, 1); // [1]
arr2[0] = 100;
console.log(arr);

let arr = [[1], 2, 3, 4, 5];
// slice浅拷贝;
let arr2 = arr.slice(0, 1); // [1]
arr2[0][0] = 100;
console.log(arr); // buffer和二维数组是一样的

let buf9 = Buffer.from([1, 2, 3, 4]);
let buf10 = buf9.slice(0, 1);
buf10[0] = 100;
console.log(buf9);
```

- indexOf ( value[,offset] ) ,常用来对传递过来的数据来进行拆分， 比如来处理 formdata 格式

  ![image-20220610223813511](..\typora-user-images\image-20220610223813511.png)

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

- **`Buffer.concat ( [buf1,buf2,...][,length])`**

- concat是创建一个新的buffer，然后将其他buffer中的每一个内存地址上的值复制到该新buffer上。

  ```js
  Buffer.concat = function (list, len = list.reduce((a, b) => a + b.length, 0)) {
    let buf = Buffer.alloc(len);
    let offset = 0;
    list.forEach((b) => {
      b.copy(buf, offset);
      offset += b.length;
    });
    return buf.slice(0, offset);   // 截取掉多余的内存部分   当len大于list中buffer总长度时起作用
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

Buffer.concat([buf2, buf1]); // buffer拼接

Buffer.prototype.slice(start, end); // buffer和二维数组一样

let buf = Buffer.form([1, 2, 3, 4, 5]);
let buf2 = buf.slice(0, 1); // 截取出来的是内存引用地址
buf2[0] = 100;
console.log(buf); //  buf的第一个字节处变为100

Buffer.isBuffer(varibale); // 判断一个变量是否是buffer

buf.indexOf('value', start);
```



**根据用户传递的具有一定规律（特殊符号）的内容进行分割**

例如：

- 行读取器
- 数据传输中formdata

对于是中文的情况，在utf-8编码规则下，一个中文字占3个字节，如果某次收到的是4个字节的数据，那么如果直接将这个4个字节先转为字符串，则存在乱码的情况。所以在处理二进制数据的时候，一般会将二进制数据拼接在一起为完整的数据后，在处理并得到自己想要的结果。

```js
Buffer.prototype.split = function (sep) {
  // Buffer中没有该方法
  sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep);
  let len = sep.length;
  let arr = [];
  let fondIndex = 0;
  let offset = 0;
  while (-1 != (findIndex = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, findIndex));
    offset = findIndex + len;
  }
  arr.push(this.slice(offset));
  return arr;
};
```





## 文件操作 fs

buffer 的应用主要就是文件读取，node 中对文件进行读取后重写，读取后进行渲染等都需要对文件进行读取。

- 流读取数据，操作文件大部分时候还是使用流方式读取

node 中的文件模块一般提供两种方式的方法：同步（性能高，阻塞）和异步（非阻塞）

文件操作主要就是 i/o 操作，读取到内存中进行操作，内存用 buffer 表示。

```js
const fs = require('fs')
const path = require('path')

fs.readfile(path.resolve(__dirname,'name.txt'),['utf8',]function(err,data){   // 将一个文件的内容都读到内存中，不指定编码时，data为buffer格式
    fs.writeFile(path.resolve(__dirname,'copt.txt'),data,function(error,data){
        // 清空后写入或者创建后写入
    })
})
// 对于这个api，对于大文件的操作是全部读到内存中，大文件是不会采用这种方法读取的。



// 目的：读取一部分处理一部分，处理完后释放那部分（流）
// w:write 如果写入的文件不存在，就创建；存在就清空写入
// r:read 文件不存在会报错  fs.readFile
// a:append 在原有基础上增加
// w+ 如果读取的文件不存在不会报错
// r+ 如果读取的文件存在会报错,而且可以写入
const buf = Buffer.alloc(3)   // 固定大小的容器
// 打开文件，读取内容，进行操作，关闭文件
fs.open(path.resolve(__dirname,'name.txt'),'r',function(err,fd){  // 打开文件并不是将内容读到内存中
    // fd 数字  文件描述符号
    // 将文件读取到buf中,0为buf的第几个字节开始写，3表示写入3个字节,0表示从文件的第几个字节开始读取内容
    // 读写操作再代码中正好是相反的（参照物不同导致的相反）
    // 将读取到的数据写入到buffer中
    // 从buffer第0个位置开始写入
    // 写入3个字符
    // 读取文件的位置 ReadPosition
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



function copy(source,target,cb){
    const BUFFER_SIZE = 5
    let readPosition = 0;
    let writePosition = 0;
    const buffer = Buffer.alloc(BUFFER_SIZE); // 这个是内存中的内容
    // 读和写没有分离，强依赖
    fs.open(path.resolve(__dirname, source), 'r', function (err, rfd) {
        if(err) return cb(err)
        fs.open(path.resolve(__dirname, target), 'w', 0o666, function (err, wfd) {
            if(err) return cb(err)
            function next(){
                fs.read(rfd, buffer, 0, BUFFER_SIZE, readPosition, function (err, bytesRead) {
                    if(err) return cb(err)
                    if(bytesRead == 0){
                        function destroy(err){
                            let times = 0;
                            function done(){
                                if(++times == 2) cb(err)
                            }   
                            fs.close(rfd,done)
                            fs.close(wfd,done)
                        }
                        return destroy();
                    }
                    fs.write(wfd, buffer, 0, bytesRead, writePosition, function (err, written) {
                        readPosition += written; // 维护读取的长度
                        writePosition = readPosition
                        next()
                    });
                })
            }
            next()
        })
    })
}
// 读写不分离，代码耦合度高

//解决办法：发布订阅，node原生就基于发布订阅来写了可读流和可写流
```



## 文件可读流

还有其他的可读流，比如http的可读流。

```js
const fs = rquire('fs');
const path = require('path');

let res = fs.createReadStream(path.resolve(__dirname, 'note.md'), {
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
// 底层一旦监听到绑定了data事件，内部会在newListener事件中触发emit事件
res.on('data', function (chunk) {
  // 内部每次的可读流都会触发该方法
  res.pause(); // 本次读取流触发后，执行该行则暂停直流对指定文件的读取
  // rs.resume()  // 恢复读取流
});

res.on('end', function () {
  // 可读流读取文件内容完毕后会触发该end事件
});

res.on('error', function (error) {});
// 可读流可以控制速率和暂停读取

res.on('close', function () {});

res.on('open', function (fd) {
  // 只有文件才有open和close
});

```

提示：当在 node 项目中看到 xxx.on('data',function(){ ... }) , xxx.on('end',function(){....})的代码的话，说明一定是一个基于发布定于event模块的代码。

```js

let rs = fs.createReadStream(path.resolve(__dirname,'test.txt'),{
    highWaterMark:3 , // 意味着每次读取3个, 如果不给highWaterMark默认就是64k
})
let ws = fs.createWriteStream(path.resolve(__dirname,'copy.txt'),{
    highWaterMark:1 , // 我希望我能写入时浪费的内存是多少 ，期望值
})

rs.on('data',function(chunk){ 
    let flag =  ws.write(chunk); // flag 要不要读取了
    if(!flag){
        rs.pause(); // 暂停读取操作
    }
    // fs.write
})
ws.on('drain',function(){
    console.log('写完了')
    rs.resume(); // 恢复data事件的触发
})

// ---------------------------------
rs.pipe(ws); // 管道就是将文件读取出来传递到其它地方
```





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
    this.open(); // 默认打开文件 
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



### 管道流

```js
const fs = require('fs');
const path = require('path');
let rs = fs.createReadStream(path.resolve(__dirname, 'test'), {
    highWaterMark: 4 // 每次读取4个
});
let ws = fs.createWriteStream(path.resolve(__dirname, 'test1'), { //  createWriteStream 有缓存的概念
    highWaterMark: 1 // 期望使用一个字节的内存大小来控制
});

// pipe
rs.pipe(ws); // 看不到写入的过程， 此方法是异步的方法

```



可读流（Reable Streams）

可写流（Writable Streams）

Duplex流：即双工流，既能读也能写。

转化流：Transform

```js
// a  -> 转化过程（转化流）  -> b
const { Transform } = require('stream')
class MyTransform extends Transform {
    _transform(chunk, encoding, clearBuffer) {// 具备_write的参数 也具备可读流的push方法
        this.push(chunk.toString().toUpperCase())
        clearBuffer();
    }
}
const transform = new MyTransform()

process.stdin.pipe(transform).pipe(process.stdout)

```





## 其他流

流的核⼼就是可以对数据进⾏分块处理。读取一部分，操作一部分。

可读流有两个典型的事件：

- on('data',()=>{})
- on('end',()=>{})



可写流有两个典型的事件：

- write(()=>{})
- end(()=>{})

**典型的可读和可写流**

- http中的request和response
- fs中的文件可读写流
- zlib中的压缩可读写流
- crypto中的数据加密解密流
- TCP套接字
- process中的stdout和stderr的标准输入输出流
- process.stdin进程监听输入



**典型典型双工流**

既可以写也可以读的流，且读和写的过程可以彼此独立无关。

- TCP sockets 
- zlib streams 
- crypto streams



**典型的转化流**

转化流 （Transform stream 将读取到的数据进⾏转换后写 ⼊可写流的流）

- zlib streams 
- crypto str



```js
process.stdin.on('data',function(chunk){
    // console.log(chunk.toString())  console.err

    process.stderr.write(chunk)
    process.stderr.end(chunk) // write + close
})
```



node中原生提供的各种流，都是继承自内部的strem库来实现的。 文件流本质都是对fs.open fs.read fs.close这些方法基于发布订阅模式的封装。

如果要实现自己的流，也可以直接继承strem库中提供的不同的流（可读流，可写流，双⼯流和转化流）



可读流：

```js
const fs = require('fs')
const {Readable} =  require('stream')

// 父类Readable提供了一个方法 read 方法当 on('data')的时候 会触发父类的Readable.read()
// Readable.read()自动调用子类MyReadStream的_read方法 我们自己实现的逻辑可以放到_read方法中
class MyReadStream extends Readable{
    constructor(){
        super();
        this.idx = 0
    }
    // fs.createReadStream()  extends Readable 并且实现了自己的_read方法 
    _read(){ 
        // 自己决定什么样的数据传递给 on('data')的回调 
        if(this.idx < 10){
            this.push(this.idx++ + '')  // 通过这个push方法将数据传给on('data')的回调，直到push的方法的值为null时，就不再触发on('data')的回调，同时触发on('end')的回调 
        }else{
            this.push(null); // 触发end方法
        }
    }
}
const mrs = new MyReadStream();
// 当用户监听了data事件后，会触发原型上的_read方法,如果_read有被实现的话
mrs.on('data',function(chunk){
    console.log(chunk)
})
mrs.on('end',function(){
    console.log('end')
})
```





可写流：

```js
const {Writable} =  require('stream')

class MWriteStream extends Writable{
    _write(chunk,encoding,clearBuffer){ // 自己实现的_write 
        console.log(chunk)
        clearBuffer();
    }
}
const ws = new MWriteStream
ws.write('ok'); // 调用的是父类的write -> 父类在调用子类的write
ws.write('ok'); 
ws.write('ok'); 
ws.write('ok'); 
ws.end('ok')
```



```js
class Parent {
    write(){
        this._write()
    }
}
class Child extends Parent{
    _write(){
        console.log('子的write')
    }
}
new Child().write()
```





双工流：

```js
const {Duplex} =  require('stream')

class MyDuplex extends Duplex {
    constructor(){
        super();
        this.idx = 0
    }
    _read(){ 
        if(this.idx < 10){
            this.push(this.idx++ + '')
        }else{
            this.push(null); // 触发end方法
        }
    }
    _write(chunk,encoding,clearBuffer){
        console.log(chunk)
        clearBuffer();
    } // read 和 write没关系 
}
let myDuplex  = new MyDuplex();

myDuplex.on('data',function(chunk){
    console.log(chunk)
})
myDuplex.write('ok')
```





转化流：

```js
const {Transform}  =require('stream')
class MyTransform extends Transform{
    _transform(chunk,encoding,clearBuffer){ // 参数和可写流一样
        if(chunk){
            const data = chunk.toString().toUpperCase()
            this.push(data); // 放入到可独流中
        }
        clearBuffer()
    }
}
process.stdin.pipe(new MyTransform).pipe(process.stdout)
```



```js
const zlib = require('zlib'); // 内置的模块， 都有流的写法；也有非流的用法

// 压缩:先读取内容 -> 压缩 -> 写入新的文件
// 先读取内容.pipe(压缩).pipe(写入新的文件)

const fs = require('fs');

const rs = fs.createReadStream('./test.txt')
const ws = fs.createWriteStream('./test.txt.gz')

// 压缩、解压
const gzip = zlib.createGzip()

// 非流的用法，需要将要压缩的内容一次性读取出来进行压缩
zlib.gzip('string',function(err,data){
    console.log(data)
})

// 流的用法  
rs.pipe(gzip).pipe(ws)
```



```js
const fs = require('fs');
const rs = fs.createReadStream('./test.txt')
const ws = fs.createWriteStream('./copy.txt')
const crypto = require('crypto');
// 加密算法 和 摘要算法的区别？ 是否可逆

// 1) md5 不可逆  2） 输入相同输出相同  3) 输入的内容不同输出长度永远相同
// 非流的用法
const r = crypto.createHash('md5').update('1234567890').digest('base64')
console.log(r) //  就是crypto的api


// 流的用法
const md5Stream = crypto.createHash('md5')
md5Stream.setEncoding('base64')
rs.pipe(md5Stream).pipe(ws)
```





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

数组查询的平均复杂度是 O(n)

树插入和查询的平均复杂度是 O(logn)

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

<img src="..\typora-user-images\image-20220305205147995.png" alt="image-20220305205147995" style="zoom: 150%;" />

面试：二叉树的反转。



## fs

文件夹就是一个树结构，就需要操作树的一系列方法。

```js
const fs = require('fs')
const path = require('path')

function copy(source,target,callback){
	fs.readFile(path.resolve(__dirname,source),function(error,data){
        if(error){
            return callback(error)
        }
        fs.writeFile(path.resolve(__dirname,target),data,callback)
    })    
}

// 这种拷贝文件的方式适合小文件的拷贝，建议64k以下，因为是一次性将文件内容读取到内存中，然后再写入target中，所以如果文件体积过大，会占用大量内存空间 （node中的文件流每次默认读取64kb）

fs.exits(path,(boolean)=>{})

fs.stat(path,(err,state)=>{
    state.isFile()
    state.isDirectory()
})  //判断文件夹|文件存不存在   得到文件（夹）信息
fs.access(path,(err,obj)=>{})  //判断文件夹|文件存不存在   重点在看能不能访问到
```



## http

http模块的基本用法，如何解析客户端传递的报文，如何向客户端响应报文。

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

// 底层是基于事件发布订阅模式的
server.on('request',()=>{
    
})

server.listen(3000, function () {
  console.log(`server start 3000`); // 监听成功就会触发此函数
});

// 上面这套代码能很好的体现node单线程的特点
```

![image-20220306133537938](..\typora-user-images\image-20220306133537938.png)

```js
const http = require('http');

let port = 3000;

// server继承了发布订阅模式类
const server = http.createServer((request, response) => {});

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



## koa

node中的一个框架，使用简单，核心代码少，底层基于node封装了一些api。自己从零开始写的话需要处理很多逻辑，比如路由处理，请求参数的解析，缓存，跨域等，其中很多功能是通过插件引入的。



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

![image-20220619101024524](..\typora-user-images\image-20220619101024524.png)

![image-20220619101348551](..\typora-user-images\image-20220619101348551.png)



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

- sessionStoreage 会话（单个tab页面）关闭，数据就丢失（浏览器端存储）。应用：比如存放页面滚动位置。

- localStorage 存在本地，浏览器关闭也不丢失，需要手动删除（浏览器端存储），存储容量有限。应用：前端性能优化时，将 js,css 等静态资源存到 localStorage 中

  比如百度移动端：

  ![image-20220620224202143](..\typora-user-images\image-20220620224202143.png)

- sessionStoreage ，localStorage 都不能跨域。



**cookie，session**

http 的特点是无状态的，每次 http 之间没有关联。 通过增加请求头字段来标识 http 请求之间存在关联，一般使用 cookie 来存储，前后端都可以设置cookie。

每次请求浏览器都会自动携带 cookie，cookie 内容过多，过多可能导致页面白屏，会浪费流量。尽量 cookie 合理化，如通过过期时间，通过域名分割 cookie。默认可以限制二级域名共享 cookie。cookie 会走网络，所以有安全问题。

cookie有路径限制。每个cookie都可以设置一个路径属性，指定cookie适用于哪个URL路径。如果未设置路径属性，则默认为当前页面所在的路径。当浏览器发送请求时，它只会带上与请求路径匹配的cookie。例如，如果cookie的路径设置为"/foo"，那么它只会被发送到以"/foo"开头的URL路径。

和 cookie 相比，session 更安全一些。

cookie 是存放在客户端的，在客户端或者网络中有可能被拦截篡改，这样服务端就不一定能发现。

现在对于 session，客户端请求的时候，服务端给客户端一个标识，真正的信息存放在服务器中。中间的这个标识也是存放在 cookie 中进行通行的。 session 基于 cookie，session中的信息是存储在服务器的内存中的，所以服务端一宕机就会丢失，共享也比较麻烦，存数据库中也是有丢失风险的。

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
// max-age  过期时间, 以秒为单位，下面的10表示10秒钟
// httpOnly  只读，方式客户端篡改cookie ，表示浏览器不能通过document.cookie来获取cookies

res.setHeader('Set-Cookie', ['name=zf; domain=域名; path=/xxxx; max-age=10; httpOnly=true', 'b=1']); //域名不带协议类型
```

cookie 可以在一级域名中设置后，可以在所有的二级域名下进行访问。在二级域名下设置的 cookie 并不能在一级域名中访问。可以通过域名进行 cookie 划分。

如果一级域名和二级域名下都有同名的 cookie，当客户端在二级域名下读取的时候，会都读取到。

![image-20220621195945058](..\typora-user-images\image-20220621195945058.png)

![image-20220621200005187](..\typora-user-images\image-20220621200005187.png)

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
- 不利于分布式部署（比如同一个公司有多个项目，多个项目想共用一个登录状态，如果是 session 的话就需要将存放 session 的数据库进行共享）

**JSON WEB TOKEN**

- 服务端无需存储，类似cookie签名
- 可以跨域

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
    let token = jwt.encode({name:'zf'},'secret')   // 编码  secret：密钥
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

