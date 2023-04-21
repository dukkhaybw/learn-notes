# JavaScript设计模式

前端方面底层很少变化的知识点：

- 前端性能优化核心思路
- 设计模式

定义：在软件工程中，设计模式（Design Pattern）是对软件设计中普遍、反复出现的各种问题与需求，所提出的解决方案。 ——维基百科

类似于菜谱、攻略，设计模式就是针对特定或者类似场景下的代码编写和结构安排的优秀套路。



**在学习任何一个知识点前，一直带着这几个问题去学习：**

1. **为什么要学习这个知识点？**
2. **这个知识点是怎么使用的？**
3. **是否有面试题考察的思想用到了这个知识点？**
4. **在后续要学习的其他知识点时是如何基于现在这个知识点来完成一些功能的？**
5. **阅读的过程中始终带着这些问题去边读边思考**。



面试者的编码能力，设计思维和计算机基础不行。

> **基础理论知识是一个人的基线，理论越强基线越高。再为自己定一个目标和向上攀附的阶梯，那么达到目标就是时间问题，而很多野路子工程师搞了半辈子也未达到优秀工程师的基线，很多他们绞尽脑汁得出的高深学问，不过是正规工程师看起来很自然的东西。**—— 吴军



设计模式的特点：

1. 抽象性，所有理论性知识点的共性。应对办法是：找到一个合适的应用场景，去体会对应的设计模式的优势，然后还原到实战中去。
2. 知识点分散，因为不同的设计模式就是解决不同问题的方案。所以不同方案看上去联系不大，但是设计模式之间，其实也是存在一些共性和基础原则（设计原则和设计思想）

解决知识抽象性带来的理解障碍，重要的不是反复的陈述、解释，而是**把自己放到一个正确的场景里，去体会这个模式的好**。



## 设计模式原则

每一个模式描述了一个在工作中不断重复发生的问题，以及该问题的解决方案的核心。这样，就能一次又一次地使用该方案而不必做重复劳动。 

设计原则是设计模式的指导理论，它可以帮助规避不良的软件设计。

SOLID 指代面向对象编程和面向对象设计的五个基本原则分别是：

- 单一功能（Single Responsibility Principle）
- 开放封闭（Opened Closed Principle）
- 里式替换（Liskov Substitution Principle）
- 接口隔离（Interface Segregation Principle）
- 依赖反转（Dependency Inversion Principle）

在 JavaScript 设计模式中，主要用到的设计模式基本都围绕“单一功能”和“开放封闭”这两个原则来展开。

设计模式的核心思想——**封装变化**。**将变与不变分离，确保变化的部分灵活、不变的部分稳定**。

《设计模式：可复用面向对象软件的基础》中将23种设计模式按照“创建型”、“行为型”和“结构型”进行划分：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/6/169f16406d230ffe~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

无论是创建型、结构型还是行为型，这些具体的设计模式都是在用自己的方式去封装**不同类型的变化** —— 创建型模式**封装了创建对象过程中的变化**，比如工厂模式，它做的事情就是将创建对象的过程抽离；结构型模式**封装的是对象之间组合方式的变化**，目的在于灵活地表达对象间的配合与依赖关系；而行为型模式则是**对象千变万化的行为进行抽离**，确保我们能够更安全、更方便地对行为进行更改。



设计模式的核心操作是去观察你整个逻辑里面的**变与不变**，然后将变与不变分离，达到使变化的部分灵活、不变的地方稳定的目的。



## 第一章

### 案例

JavaScript允许开发者使用各种方式实现同样的任务。采用一定的设计模式能让代码更加高效且易于维护，有助于降低模块之间的耦合程度。某些设计模式是可以优化性能的(享元模式，代理模式)。JavaScript非常灵活，开发者既可以采用函数式编程也可以采用面向对象编程。

学习设计模式的目的之一就是：懂得在什么时候采用哪种何时的设计模式。

案例：启动动画和停止动画的编程

```javascript
//方式一：面向过程编程
function startAnimation(){
    .....
}

function stopAnimation(){
    .....
}
//无法创建可以保存状态的动画对象 和 无法创建具有一些仅对其内部状态进行操作的方法的动画对象



//为此可以采用类,方式二：
var Anim = function(){
    ...实例状态与属性
} 
Anim.prototype.start = function (){
    .....
}
Anim.prototype.stop = function (){
    .....
}

//Anim.prototype ={
//    start：function (){
//    .....
//	  }，
//    stop：function (){
//    .....
// 	  }
//}


let myAnim = new Anim()
myAnim.start()
myAnim.stop()
//这样就有了可以存放状态的对象 和 只针对该对象的方法。




//传统的面向对象的开发者习惯的写法是：类的方法声明内嵌到类的声明中去（ES6中的class实现了）
//方式三：

Function.prototype.method = function(name,fn){  // 在所有的函数对象的隐式原型上增加了method方法
    this.prototype[name] = fn  
}

var Anim = function(){
    ...实例状态与属性
} 
Anim.method('start',function(){  //调用隐式原型上的method方法以在函数自己的显示原型上增加start方法
    ..
})
Anim.method('stop',function(){  //调用隐式原型上的method方法以在函数自己的显示原型上增加start方法
    ..
})




//方式四：在方式三的基础上增加了链式调用
Function.prototype.method = function(name,fn){  // 在所有的函数对象的隐式原型上增加了method方法
    this.prototype[name] = fn  
    return this
}

var Anim = function(){
    ...实例状态与属性
} 
Anim.method('start',function(){  //调用隐式原型上的method方法以在函数自己的显示原型上增加start方法
    ..
}).method('stop',function(){  //调用隐式原型上的method方法以在函数自己的显示原型上增加start方法
    ..
})
```

### JavaScript语言特点

**弱类型的语言**，在js中定义变量时，不需要声明变量应该存放什么类型的数据。基本数据类型的数据（boolean，string，number，null，undefined，symbol）存放在变量中的是数据值本身，而引用数据类型存放在变量中的值是一个堆内存地址的引用。

**函数是一等公民**，函数可以存放在变量中，可以作为实参传给其他函数，可以作为返回值从其他函数中传出，还可以在运行时进行构造。这些特点是传统的面向对象编程的基础。

**JavaScript的作用域是从属于词法作用域的，这样函数运行在定义它的作用域中，而不是在调用它的作用域中。**

**对象的易变性**，开发者可以先定义类和实例对象，之后再进行修改。

**继承**，JavaScript中的继承是基于对象的原型式继承。



## 第二章

在用JavaScript进行面向对象编程时，接口是必须设计和使用的。



## 第三章封装与隐藏

对对象的属性或者方法进行封装能降低对象之间的耦合程度。在JavaScript中使用闭包来实现封装。



设计模式的核心是观察到代码逻辑中的变与不变的部分，然后将变与不变分离，变化部分灵活，不变部分稳定。

### 构造器模式

当只需要创建一个对象时，一般的代码：

```js
const liLei = {
    name: '李雷',
    age: 25,
    career: 'coder',
}
```

当再增加一个具有相同属性的对象是：

```js
const hanMeiMei = {
    name: '韩梅梅',
    age: 24,
    career: 'product manager'
}
```

但当再次增加多个具有相同属性的对象时，就会类似写出大量重复的代码。所以可以使用构造器来批量生成一些具有相同属性但属性值不同的对象。

```js
function User(name , age, career) {
    this.name = name
    this.age = age
    this.career = career 
}
```

能创建一系列对象并为对象进行初始化赋值的函数，就叫做构造器。在 JavaScript 中，使用的构造函数就应用了**构造器模式**。

使用构造器模式的时候，本质上是去抽象了每个对象实例的变与不变。



### 工厂模式

#### 简单工厂模式

使用工厂模式时，就是去抽象不同构造函数（类）之间的变与不变。**将创建对象的过程单独封装。**

当有多种类，且不同的对象中既有共性又有特性的情况下时：

```js
function Coder(name , age) {
    this.name = name
    this.age = age
    this.career = 'coder' 
    this.work = ['写代码','写系分', '修Bug']
}

function ProductManager(name, age) {
    this.name = name 
    this.age = age
    this.career = 'product manager'
    this.work = ['订会议室', '写PRD', '催更']
}
```

上面编写了两个构造器。

每从数据库拿到一条数据，都要人工判断一下这个员工的工种，然后手动给它分配构造器吗？不行，这也是一个“变”，**把这个“变”交给一个函数去处理**：

```js
function Factory(name, age, career) {
  switch(career) {
    case 'coder':
      return new Coder(name, age) 
      break
    case 'product manager':
      return new ProductManager(name, age)
      break
      ...   // 当有很多情况时，就需要创建很多的构造器。
}
```

Coder 和 ProductManager 两个工种的员工，仍然存在都拥有 name、age、career、work 这四个属性这样的共性，它们之间的区别，在于每个字段取值的不同，以及 work 字段需要随 career 字段取值的不同而改变。这样一来，是不是对共性封装得不够彻底？那么相应地，共性与个性分离得也不够彻底。

现在把相同的逻辑封装回User类里，然后把这个承载了共性的 User 类和个性化的逻辑判断写入同一个函数：

```js
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career 
    this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug'] 
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...
            
    return new User(name, age, career, work)
}
```

**构造器解决的是多个对象实例的问题，简单工厂解决的是多个类的问题。**

那么当复杂度从多个类共存上升到多个工厂共存时又该怎么处理呢？



#### 抽象工厂模式

对于**强类型的静态语言**。用这些语言创建对象时，需要时刻关注类型之间的**解耦**，以便该对象日后可以表现出**多态性**。但 JavaScript作为一种弱类型的语言，它具有天然的多态性，压根不需要考虑类型耦合问题。目前的 JavaScript 语法里，不支持抽象类的直接实现，只能模拟还原抽象类。

在实际的业务中，往往面对的复杂度并非数一个类、一个工厂可以解决，而是需要动用多个工厂（构造函数）。

上节的示例代码：

```js
function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug'] 
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...
            
    return new User(name, age, career, work)
}
```

面对的实际情况，一个系统中存在多种不同的对象，这些对象种都有一些相同的属性，但是具体到不同的一类对象中，又有一些特定的属性或者方法。但是他们这些对象都属于同一个系统中，彼此之间是存在联系的。

每考虑到一个新的员工群体，就回去修改一次 Factory 的函数体，这种做法危险。

1. Factory会变得异常庞大
2. Factory 的逻辑过于繁杂和混乱难以维护
3. 不利于测试



案例：假设有一个生产手机的构造函数（工厂），其中手机具有两部分组成：操作系统和硬件。操作系统和硬件都有具体不同的类别可以选择，但是一定需要有，不管生产什么手机。

```js
class MobilePhoneFactory {
    // 提供操作系统的接口
    createOS(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
    // 提供硬件的接口
    createHardWare(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
}
```

这个类，除了约定手机流水线的通用能力之外，啥也不干。如果尝试让它干点啥，比如 new 一个 `MobilePhoneFactory` 实例，并尝试调用它的实例方法。它还会报错。在抽象工厂模式里，这个类就是顶端最大的 `抽象类——AbstractFactory`（抽象工厂）。

抽象类无法用于实例化对象。化抽象为具体：

```js
// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
    createOS() {
        // 提供安卓系统实例
        return new AndroidOS()
    }
    createHardWare() {
        // 提供高通硬件实例
        return new QualcommHardWare()
    }
}
```

当基于上面这个构造函数去实例化一部手机后，在执行某个功能时，会调用了两个构造函数：AndroidOS 和 QualcommHardWare，它们分别用于生成具体的操作系统和硬件实例。这种用于 new 出具体对象的类，叫做具体产品类（ConcreteProduct）。

其实不同的具体的产品类之间也是存在共性的，比如安卓系统类和苹果系统类，它们都是操作系统，都有着可以**操控手机硬件系统**这样一个最基本的功能。

因此可以用一个**抽象产品（AbstractProduct）类**来声明这一类产品应该具有的基本功能。



```js
// 定义操作系统这类产品的抽象产品类
class OS {
    controlHardWare() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
    controlHardWare() {
        console.log('我会用安卓的方式去操作硬件')
    }
}

class AppleOS extends OS {
    controlHardWare() {
        console.log('我会用苹果的方式去操作硬件')
    }
}
...
```

硬件类产品同理：

```js
// 定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}

class MiWare extends HardWare {
    operateByOrder() {
        console.log('我会用小米的方式去运转')
    }
}
...
```

实例化一部手机后的具体使用方式：

```js
// 这是一部手机
const myPhone = new FakeStarFactory()
// 让它拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()
```



当后面需要创建一个新的手机构造函数时，**不需要对抽象工厂MobilePhoneFactory做任何修改**，只需要基于它去拓展就行：

```js
class newStarFactory extends MobilePhoneFactory {
    createOS() {
        // 操作系统实现代码
    }
    createHardWare() {
        // 硬件实现代码
    }
}
```

这么个操作，**对原有的系统不会造成任何潜在影响** 所谓的“对拓展开放，对修改封闭”就实现了。前面要实现**抽象产品类**，也是同样的道理。



#### 总结

抽象工厂和简单工厂的异同：

**相同点**

**都尝试去分离一个系统中变与不变的部分**。



**不同点**

**场景的复杂度不同**。

在简单工厂里，处理的对象是类，它们的共性容易抽离，同时因为逻辑本身比较简单，故而不苛求代码可扩展性。抽象工厂本质上处理的其实也是类，但是是一帮繁杂的类，这些类中不仅能划分出类别，还有等级划分，同时存在着扩展的可能性——这使得必须对**共性**作更特别的处理、使用抽象类去降低扩展的成本，同时需要对类的性质作划分，于是有了这样的四个关键角色：

- **抽象工厂（抽象类，它不能被用于生成具体实例）：** 用于声明最终目标产品的共性。在一个系统里，抽象工厂可以有多个（大家可以想象手机厂后来被一个更大的厂收购了，这个厂里除了手机抽象类，还有平板、游戏机抽象类等等），每一个抽象工厂对应的这一类的产品，被称为“产品族”。
- **具体工厂（用于生成产品族里的一个具体的产品）：** 继承自抽象工厂、实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。
- **抽象产品（抽象类，它不能被用于生成具体实例）：**具体工厂里实现的接口，会依赖一些类，这些类对应到各种各样的具体的细粒度产品（比如操作系统、硬件等），这些具体产品类的共性各自抽离，便对应到了各自的抽象产品类。
- **具体产品（用于生成产品族里的一个具体的产品所依赖的更细粒度的产品）**



1. 学会用 ES6 模拟 JAVA 中的抽象类；
2. 了解抽象工厂模式中四个角色的定位与作用；
3. 对“开放封闭原则”形成自己的理解，知道它好在哪，知道执行它的必要性。



### 单例模式

**一个类（构造函数）仅有一个实例，并有一个访问它的全局变量。**单例模式应用广泛，面试常考。

**不管尝试去创建实例多少次，它都只返回第一次所创建的那唯一的一个实例**。



**代码实现：**

```js
let SinglePatternClass = (function(){
  let instance = null;
  return class SinglePattern{
    constructor(){
			if(instance){
        return instance
      }
      
      instance = this
    }
  }
})()

const inst1 = new SinglePatternClass()
const inst2 = new SinglePatternClass()
console.log(inst1===inst2)


// 其他写法参考
class SingleDog {
    show() {
        console.log('我是一个单例对象')
    }
    static getInstance() {
        // 判断是否已经new过1个实例
        if (!SingleDog.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            SingleDog.instance = new SingleDog()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return SingleDog.instance
    }
}

const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()

// true
s1 === s2


// 或者下面这种闭包写法
SingleDog.getInstance = (function() {
    // 定义自由变量instance，模拟私有变量
    let instance = null
    return function() {
        // 判断自由变量是否为null
        if(!instance) {
            // 如果为null则new出唯一实例
            instance = new SingleDog()
        }
        return instance
    }
})()
```

要求构造函数**具备判断自己是否已经创建过一个实例**的能力。



**应用**

基于 Flux 架构的状态管理工具典型代表：Redux 和 Vuex，它们都实现了一个全局的 Store 用于存储应用的所有状态，这个 Store 的实现就是单例模式的应用。

**Vuex**

> Vuex可以是一个对象表示的树结构，用一个对象就可以包含了整个应用各个层级的状态。同时它是一个“唯一数据源 (SSOT)”。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。 ——Vuex官方文档



**Store 是一个“假单例”**

假单例：虽然**没有严格遵循单例模式的设计原则，但在实际应用中仍然能够保证实例的唯一性。**

**Vuex 中的 Store 就是这样一个”假单例“——** 尽管在实际应用中通常 `Store` 只有一个全局实例，但从实现上来看，它并不是一个严格意义上的单例模式。

Vuex Store 的部分源码：

```js
class Store {
  constructor (options = {}) {
    // ...
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // 将 this 赋值给 store，这是为了在后续的函数中使用 Store 实例的上下文
    const store = this
    // 将 this 中的 dispatch 和 commit 方法解构出来，以便在后续的函数中使用
    const { dispatch, commit } = this
    // 分别为 dispatch 和 commit 方法绑定上下文
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }
    // ...
  }
}
```



> const obj = **`Object.create(proto[, propertiesObject])`** 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型（prototype）。
>
> proto: 新创建对象的原型对象。
>
> propertiesObject: 如果该参数被指定且不为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，则该传入对象的自有可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）将为新创建的对象添加指定的属性值和对应的属性描述符。这些属性对应于 [`Object.defineProperties()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) 的第二个参数。



在 Vuex 中，可以通过 `new Vuex.Store(options)` 调用构造函数来创建一个新的 `Store` 实例。而在上面的 `Store` 的 `constructor` 关键源码中，并**不存在任何和单例有关的识别/拦截逻辑**。

**这意味着开发者可以通过** `new` **关键字创建多个** `Store` **实例，这显然不符合对单例模式的预期。**

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个 store 对象 1 号
const store1 = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// 创建一个 store 对象 2 号
const store2 = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// false，说明 store1 和 store2 是完全不同的两个 store
console.log(store1 === store2)
```

由此可以看出，虽然 `Store` 在实践中总是表现得像个单例一样，但它本身却并没有真地去实现单例相关的逻辑。

**没有实现单例的** `Store` **，究竟是如何表现出单例般的行为的呢？**

从 `Vuex` 的整体设计上来分析：

**Vuex 如何确保 `Store` 的单例特征**

**Vuex 从整体设计的层面来保证了** `Store` **在同一个** `Vue` **应用中的唯一性。**

首先需要关注的是 `Vue.use()` 方法，这个方法允许我们给 `Vue` 应用安装像 `Vuex` 这样的插件。Vuex 插件是一个对象，它在内部实现了一个 `install` 方法，这个方法会在插件安装时被调用，从而把 `Store` 注入到 `Vue` 应用里去。也就是说每 `install` 一次，`Vuex` 都会尝试给 `Vue` 应用注入一个 `Store`。

在 `install` 函数源码中，有一段和我们楼上的 `getInstance()` 非常相似的逻辑：

```js
let Vue // 这个Vue的作用和楼上的instance作用一样, 能起到判断Vuex是否已经被注册过了。
...

export function install (_Vue) {
  // 判断传入的Vue实例对象是否已经被install过Vuex插件（是否有了唯一的 store）
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  // 若没有，则为这个Vue实例对象install一个唯一的Vuex
  Vue = _Vue
  // 将Vuex的初始化逻辑写进Vue的钩子函数里
  applyMixin(Vue)
}
```

**这段和** `getInstance() `**非常相似的逻辑，通过判断当前 Vue 应用是否已经安装过 Vuex 插件，保证了在同一个** `Vue` **应用中只存在一个** `Vuex` **实例。**

在 `install` 函数中， `Vue` 实例被赋值为 `_Vue`，接着作为 `applyMixin(Vue)` 函数的参数，触发一次 `applyMixin()` 的调用。`applyMixin()` 函数会在 Vue 实例的 `beforeCreate` 生命周期钩子中，将 `Store` 实例挂载到 `Vue` 实例上。这个“挂载”动作对应的是如下所示的 `vuexInit()` 函数：

```js
function vuexInit () {
  const options = this.$options
  // 将 store 实例挂载到 Vue 实例上
  if (options.store) {
    this.$store = typeof options.store === 'function'
      ? options.store()
      : options.store
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store
  }
}
```

这段代码中最值得注意的是 `else if` 这一行的判断：如果当前组件实例的配置对象中不存在 `store`，但存在父组件实例（`options.parent`）且父组件实例具有 `$store` 属性，那么将父组件实例的 `$store` 赋值给当前组件实例的 `$store`。

这段逻辑意味着，`$store`实例在 Vue 组件树中是被**层层继承**下来的——当子组件自身不具备 `$store` 时，会查找父组件的 `$store` 并继承。这样，整个 Vue 组件树中的所有组件都会访问到同一个 `Store` 实例——那就是根组件的`Store`实例。

也就是说，`vuexInit()`的主要作用是将根组件的`Store`实例注入到子组件中，这样所有子组件都可以通过`this.$store`访问到同一个 Store 实例。**这就确保了 Vuex `Store` 在整个 Vue 应用中的唯一性。**



**总结**

`install()`函数通过拦截 `Vue.use(Vuex)` 的多次调用，**保证了在同一个`Vue`应用只会安装唯一的一个`Vuex`实例**；而 `vuexInit()` 函数则**保证了同一个`Vue`应用只会被挂载唯一一个`Store`**。这样一来，从效果上来看，Vuex 确实是创造了两个”单例“出来。



注意，上面的“`Store` **的唯一性**“是有前提的——这种唯一性是针对同一个 Vue 应用来说的，而不是针对全局来说的。

在全局范围内，Vuex 中的 `Store` 并不一定是唯一的。**因为在同一个页面中，可以使用多个 Vue 应用，每个 Vue 应用都可以拥有自己的 Store 实例**。这也解释了为什么`Vuex`没有将单例逻辑放在`Store` 类中去实现，而是将其解构到了 `install` 函数里。

在同一个 Vue 应用中，只会存在一个 Store 实例，但在多个 Vue 应用中，可以存在多个 Store 实例。**在不同的 Vue 应用中，当我们想共享唯一的一个 Store 时，仍然需要通过在全局范围内使用单例模式来确保 Store 的唯一性。**



vuex单例的例子并非是单例模式吧！单例模式的定义应该是一个构造器返回有且只有同一个实例的模式！但是Vuex本身是一个对象，不是构造器，所以不存在单例一说，其次，install方法是Vuex对象身上的一个属性，Vue的确会在每次use的时候调用这个方法，但**调用这个方法的本质是希望往Vue的生命周期钩子中注入一些函数的调用，或者往Vue实例的配置项当中注入一些属性。这个install的判断只是避免重复的注入而已，只要Vuex的Store实例中状态不变，全局的状态就是不会变的。**



#### 单例面题

> 题目一：实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。

```js
// 实现一：
// 定义Storage
class Storage {
    static getInstance() {
        // 判断是否已经new过1个实例
        if (!Storage.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            Storage.instance = new Storage()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return Storage.instance
    }
    getItem (key) {
        return localStorage.getItem(key)
    }
    setItem (key, value) {
        return localStorage.setItem(key, value)
    }
}

const storage1 = Storage.getInstance()
const storage2 = Storage.getInstance()

storage1.setItem('name', '李雷')
// 李雷
storage1.getItem('name')
// 也是李雷
storage2.getItem('name')

// 返回true
storage1 === storage2


// 实现二：
const StorageClass = (function () {
  let instance = null;
  return class Storage {
    constructor() {
      if (instance) {
        return instance;
      }
      instance = this;
    }

    setItem(key, value) {
      return localStorage.setItem(key, value);
    }

    getItem(key) {
      return localStorage.getItem(key);
    }
  };
})();
```



> 题目二：实现一个全局唯一的Modal弹框（经典题目）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>单例模式弹框</title>
  </head>
  <style>
    #modal {
      height: 200px;
      width: 200px;
      line-height: 200px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid black;
      text-align: center;
    }
  </style>
  <body>
    <button id='open'>打开弹框</button>
    <button id='close'>关闭弹框</button>
  </body>
  <script>
    // 核心逻辑，这里采用了闭包思路来实现单例模式
    const Modal = (function() {
      let modal = null
      return function() {
        if(!modal) {
          modal = document.createElement('div')
          modal.innerHTML = '我是一个全局唯一的Modal'
          modal.id = 'modal'
          modal.style.display = 'none'
          document.body.appendChild(modal)
        }
        return modal
      }
    })()

    // 点击打开按钮展示模态框
    document.getElementById('open').addEventListener('click', function() {
      // 未点击则不创建modal实例，避免不必要的内存占用;此处不用 new Modal 的形式调用也可以，和 Storage 同理
      const modal = new Modal()
      modal.style.display = 'block'
    })

    // 点击关闭按钮隐藏模态框
    document.getElementById('close').addEventListener('click', function() {
      const modal = new Modal()
      if(modal) {
        modal.style.display = 'none'
      }
    })
  </script>
</html>
```





### 原型模式

原型模式既是一种设计模式，也是一种编程范式。JS的面向对象系统就是基于原型来实现的。

在原型模式下，当创建一个对象的时候，先找到一个对象作为**原型对象**，然后通过**克隆原型**的方式创建出一个原型一样的另一个对象。在 JS里，`Object.create`方法就是原型模式的原生实现。

在传统的面向对象编程的语言中，原型模式就是拷贝出一个新对象，原型链上的对象也一起拷贝，而JS中不是。

JAVA中存在原型模式相关的克隆接口规范。

在 JS中使用原型模式，并不是为了得到一个全新的副本，而是为了得到与构造函数（类）相对应的类型的实例、所有实例可以实现数据/方法的共享。



**Java 中的类**

 JAVA 中，类才是它面向对象系统的基础。在 JAVA 中，可以选择不使用原型模式 —— 这样一来，所有的实例都必须要从类中来，当希望创建两个一模一样的实例时，就只能这样做：

```java
Dog dog = new Dog('旺财', 'male', 3, '柴犬')
Dog dog_copy = new Dog('旺财', 'male', 3, '柴犬')
```

不得不把一模一样的参数传两遍，繁琐。而原型模式允许通过调用克隆方法达到同样的目的，比较方便，所以 Java 专门针对原型模式设计了一套接口和方法，在必要的场景下会通过原型方法来应用原型模式。但在更多的情况下，Java 仍以“实例化类”这种方式来创建对象。

所以说在以类为中心的语言中，原型模式确实不是一个必选项，它只有在特定的场景下才会用。在 Java 等强类型语言中，原型模式的出现是为了实现类型之间的解耦。



**JavaScript 中的类**

ES6 的类是原型继承的语法糖。

```js
class Dog {
  constructor(name ,age) {
   this.name = name
   this.age = age
  }
  
  eat() {
    console.log('肉骨头真好吃')
  }
}

// 完全等价于:
function Dog(name, age) {
  this.name = name
  this.age = age
}
Dog.prototype.eat = function() {
  console.log('肉骨头真好吃')
}
```



**对象的深拷贝**

在面试中，一些面试官可能会刻意混淆 JavaScript 中原型范式和强类型语言中原型模式的区别，当他们这么做的时候不一定是因为对语言、对设计模式的理解有问题，而很有可能是为了考察你**对象的深拷贝**。

这类题目的发问方式很多，除了“模拟 JAVA 中的克隆接口”、“JavaScript 实现原型模式”以外，它更常见的发问形式是“请实现JS中的深拷贝”。

1. JSON.stringify

   问题：无法处理 function、无法处理正则等等——只有当你的对象是一个严格的 JSON 对象时，可以顺利使用这个方法。

2. 递归拷贝

   

深拷贝在命题时，可发挥的空间主要在于针对不同数据结构的处理，比如除了考虑 Array、Object，还需要考虑一些其它的数据结构（Map、Set 等）；此外还有一些极端 case（循环引用等）的处理等。

参考资料：

- [jQuery中的extend方法源码](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjquery%2Fjquery%2Fblob%2F1472290917f17af05e98007136096784f9051fab%2Fsrc%2Fcore.js%23L121)
- [深拷贝的终极探索](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000016672263)



### 装饰器模式

定义：在不改变原对象的基础上，通过对其进行包装拓展，使原有对象可以满足用户的更复杂或者新需求。

**实际场景**

初始需求是：每个业务中的按钮在点击后都弹出「您还未登录」的弹窗。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>按钮点击需求1.0</title>
  </head>
  <style>
    #modal {
      height: 200px;
      width: 200px;
      line-height: 200px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid black;
      text-align: center;
    }
  </style>
  <body>
    <button id='open'>点击打开</button>
    <button id='close'>关闭弹窗</button>
  </body>
  <script>
    // 弹窗创建逻辑，这里我们复用了单例模式面试题的例子
    const Modal = (function() {
      let modal = null
      return function() {
        if(!modal) {
          modal = document.createElement('div')
          modal.innerHTML = '您还未登录哦~'
          modal.id = 'modal'
          modal.style.display = 'none'
          document.body.appendChild(modal)
        }
        return modal
      }
    })()

    // 点击打开按钮展示模态框
    document.getElementById('open').addEventListener('click', function() {
      // 未点击则不创建modal实例，避免不必要的内存占用
      const modal = new Modal()
      modal.style.display = 'block'
    })

    // 点击关闭按钮隐藏模态框
    document.getElementById('close').addEventListener('click', function() {
      const modal = document.getElementById('modal')
      if(modal) {
        modal.style.display = 'none'
      }
    })
  </script>
</html>
```

后续提出新需求，在弹窗弹出后把按钮的文案改为“快去登录”，同时把按钮置灰。

可能解决方式：翻出之前的代码，找到了按钮的 click 监听函数，手动往里面添加了文案修改&按钮置灰逻辑。但因为几乎每个业务里都用到了这类按钮：除了“点击打开”按钮，还有“点我开始”、“点击购买”按钮等各种五花八门的按钮，这意味着不得不深入到每一个业务的深处去给不同的按钮添加这部分逻辑。

直接去修改已有的函数体，这种做法违背了“开放封闭原则”；往一个函数体里塞这么多逻辑，违背了“单一职责原则”。

其实都压根**不想去关心它现有的业务逻辑是啥样的**，只是想**对它已有的功能做个拓展，只关心拓展出来的那部分新功能如何实现**。

为了不被已有的业务逻辑干扰，可以将旧逻辑与新逻辑分离，**把旧逻辑先抽出去**：

```js
// 将展示Modal的逻辑单独封装
function openModal() {
    const modal = new Modal()
    modal.style.display = 'block'
}
```

编写新逻辑：

```js
// 按钮文案修改逻辑
function changeButtonText() {
  const btn = document.getElementById('open')
  btn.innerText = '快去登录'
}

// 按钮置灰逻辑
function disableButton() {
  const btn =  document.getElementById('open')
  btn.setAttribute("disabled", true)
}

// 新版本功能逻辑整合
function changeButtonStatus() {
  changeButtonText()
  disableButton()
}
```

然后把三个操作逐个添加open按钮的监听函数里：

```js
document.getElementById('open').addEventListener('click', function() {
  openModal()
  changeButtonStatus()
})
```





ES6的实现方式：

```js
// 定义打开按钮
class OpenButton {
  // 点击后展示弹窗（旧逻辑）
  onClick() {
    const modal = new Modal()
    modal.style.display = 'block'
  }
}

// 定义按钮对应的装饰器
class Decorator {
  // 将按钮实例传入
  constructor(open_button) {
    this.open_button = open_button
  }

  onClick() {
    this.open_button.onClick()
    // “包装”了一层新逻辑
    this.changeButtonStatus()
  }

  changeButtonStatus() {
    this.changeButtonText()
    this.disableButton()
  }

  disableButton() {
    const btn =  document.getElementById('open')
    btn.setAttribute("disabled", true)
  }

  changeButtonText() {
    const btn = document.getElementById('open')
    btn.innerText = '快去登录'
  }
}

const openButton = new OpenButton()
const decorator = new Decorator(openButton)

document.getElementById('open').addEventListener('click', function() {
  // openButton.onClick()
  // 此处可以分别尝试两个实例的onClick方法，验证装饰器是否生效
  decorator.onClick()
})
```

把按钮实例传给了 Decorator，以便于后续 Decorator 可以对它进行逻辑的拓展。



### ES7装饰器

ES7装饰器基本使用实例：

```js
// 装饰器函数，它的第一个参数是目标类
function classDecorator(target) {
  target.hasDecorator = true
  return target
}

// 将装饰器“安装”到Button类上
@classDecorator
class Button {
  // Button类的相关逻辑
}

// 验证装饰器是否生效
console.log('Button 是否被装饰了：', Button.hasDecorator)



//  装饰类里面的方法
function funcDecorator(target, name, descriptor) {
  let originalMethod = descriptor.value
  descriptor.value = function() {
    console.log('我是Func的装饰器逻辑')
    return originalMethod.apply(this, arguments)
  }
  return descriptor
}

class Button {
  @funcDecorator
  onClick() { 
    console.log('我是Func的原有逻辑')
  }
}

// 验证装饰器是否生效
const button = new Button()
button.onClick()
```

注：以上代码直接放进浏览器/Node 中运行会报错，因为浏览器和 Node 目前都不支持装饰器语法，需要大家安装 [Babel](https://link.juejin.cn/?target=https%3A%2F%2Fbabeljs.io%2F) 进行转码。

```shell
npm install babel-preset-env babel-plugin-transform-decorators-legacy --save-dev
```

配置文件.babelrc：

```json
{
  "presets": ["env"],
  "plugins": ["transform-decorators-legacy"]
}
```

```shell
npm install babel-cli -g
```

首先是对目标文件进行转码，比如目标文件叫做 `test.js`，想要把它转码后的结果输出到 `babel_test.js`，就可以这么写:

```shell
babel test.js --out-file babel_test.js
```

运行babel_test.js查看结果。



**装饰器语法糖解释**

前面使用 ES6 实现装饰器模式时将按钮实例传给了 Decorator，以便于后续 Decorator 可以对它进行逻辑的拓展。这也正是装饰器的最最基本操作——定义装饰器函数，将被装饰者“交给”装饰器。这也正是装饰器语法糖首先的工作 —— 函数传参&调用。



当给一个类添加装饰器时：

```js
function classDecorator(target) {  // target 就是被装饰的类本身
  target.hasDecorator = true
  return target
}

// 将装饰器“安装”到Button类上
@classDecorator
class Button {
  // Button类的相关逻辑
}
```



当给一个方法添加装饰器时：

```js
function funcDecorator(target, name, descriptor) {
    let originalMethod = descriptor.value
    descriptor.value = function() {
    console.log('我是Func的装饰器逻辑')
    return originalMethod.apply(this, arguments)
  }
  return descriptor
}

class Button {
    @funcDecorator
    onClick() { 
        console.log('我是Func的原有逻辑')
    }
}   
```

此处的 target 变成了`Button.prototype`，即类的原型对象。这是因为 onClick 方法总是要依附实例存在的，修饰 onClick 其实是在修饰它的实例。但装饰器函数执行的时候，Button 实例还**并不存在**。为了确保实例生成后可以顺利调用被装饰好的方法，装饰器只能去修饰 Button 类的原型对象。

第二个参数name是修饰的目标属性属性名。

第三个参数descriptor是属性描述对象。它是 JavaScript 提供的一个内部数据结构、一个对象，专门用来描述对象的属性。它由各种各样的属性描述符组成，这些描述符又分为数据描述符和存取描述符：

- 数据描述符：包括 value（存放属性值，默认为默认为 undefined）、writable（表示属性值是否可改变，默认为true）、enumerable（表示属性是否可枚举，默认为 true）、configurable（属性是否可配置，默认为true）。
- 存取描述符：包括 `get` 方法（访问属性时调用的方法，默认为 undefined），`set`（设置属性时调用的方法，默认为 undefined ）

装饰器函数执行的时候，Button 实例还并不存在。这是因为实例是在代码**运行时**动态生成的，而装饰器函数则是在**编译阶段**执行。所以说装饰器函数真正能触及到的，就只有类这个层面上的对象。



**生产实践**

1. **React中的装饰器：HOC**

高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。

HOC (Higher Order Component) 即高阶组件。它是装饰器模式在 React 中的实践，同时也是 React 应用中非常重要的一部分。通过编写高阶组件，可以充分复用现有逻辑，提高编码效率和代码的健壮性。

例子：把传入的组件**丢进一个有红色边框的容器里**(样式扩展)。

```jsx
import React, { Component } from 'react'

const BorderHoc = WrappedComponent => class extends Component {
  render() {
    return <div style={{ border: '1px solid red' }}>
      <WrappedComponent />
    </div>
  }
}
export default borderHoc


// 使用
import React, { Component } from 'react'
import BorderHoc from './BorderHoc'

// 用BorderHoc装饰目标组件
@BorderHoc 
class TargetComponent extends React.Component {
  render() {
    // 目标组件具体的业务逻辑
  }
}

// export出去的其实是一个被包裹后的组件
export default TargetComponent
```

不必因为一个小小的拓展而大费周折地编写新组件或者把一个新逻辑重写 N 多次。



2. **使用装饰器改写 Redux connect**

   ```jsx
   import React, { Component } from 'react'
   import { connect } from 'react-redux'
   import { bindActionCreators } from 'redux'
   import action from './action.js'
   
   class App extends Component {
     render() {
       // App的业务逻辑
     }
   }
   
   function mapStateToProps(state) {
     // 假设App的状态对应状态树上的app节点
     return state.app
   }
   
   function mapDispatchToProps(dispatch) {
     // 这段看不懂也没关系，下面会有解释。重点理解connect的调用即可
     return bindActionCreators(action, dispatch)
   }
   
   // 把App组件与Redux绑在一起
   export default connect(mapStateToProps, mapDispatchToProps)(App)
   ```

   调用 connect 可以返回一个**具有装饰作用的函数**，这个函数可以接收一 个React 组件作为参数，使这个目标组件和 Redux 结合、具备 Redux 提供的数据和能力。既然有装饰作用，既然是**能力的拓展**，那么就一定能用装饰器来改写：

   ```js
   import { connect } from 'react-redux'
   import { bindActionCreators } from 'redux'
   import action from './action.js'
   
   function mapStateToProps(state) {
     return state.app
   }
   
   function mapDispatchToProps(dispatch) {
     return bindActionCreators(action, dispatch)
   }
   
   // 将connect调用后的结果作为一个装饰器导出
   export default connect(mapStateToProps, mapDispatchToProps)
   
   // 使用，在组件文件里引入connect：
   import React, { Component } from 'react'
   import connect from './connect.js'   
   
   @connect
   export default class App extends Component {
     render() {
       // App的业务逻辑
     }
   }
   ```

   

推荐阅读：装饰模式库 —— [core-decorators](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjayphelps%2Fcore-decorators)。core-decorators 帮我们实现好了一些使用频率较高的装饰器，比如`@readonly`(使目标属性只读)、`@deprecate`(在控制台输出警告，提示用户某个指定的方法已被废除)等。



### 适配器模式

把一个类的接口变换成客户端所期待的另一种接口，处理不兼容的情况。













### 策略模式

改善编码习惯和重构意识。

#### 实列代码

针对不同条件，使用if进行不同逻辑判断。

针对同一个产品，不同状态下需要展示不同的价格，比如：

- 当价格类型为“预售价”时，满 100 - 20，不满 100 打 9 折   pre
- 当价格类型为“大促价”时，满 100 - 30，不满 100 打 8 折   onSale
- 当价格类型为“返场价”时，满 200 - 50，不叠加    back
- 当价格类型为“尝鲜价”时，直接打 5 折   fresh

```js
// 询价方法，接受价格标签和原价为入参
function askPrice(tag, originPrice) {
  // 处理预热价
  if(tag === 'pre') {
    if(originPrice >= 100) {
      return originPrice - 20
    } 
    return originPrice * 0.9
  }
  
  // 处理大促价
  if(tag === 'onSale') {
    if(originPrice >= 100) {
      return originPrice - 30
    } 
    return originPrice * 0.8
  }
  
  // 处理返场价
  if(tag === 'back') {
    if(originPrice >= 200) {
      return originPrice - 50
    }
    return originPrice
  }
  
  // 处理尝鲜价
  if(tag === 'fresh') {
     return originPrice * 0.5
  }
  
  // 处理新人价，后来新加的逻辑
  if(tag === 'newUser') {
    if(originPrice >= 100) {
      return originPrice - 50
    }
    return originPrice
  }
}
```

代码逻辑没有问题，但这种代码的不足：

1. 违背了“**单一功能**”原则，一个 function 里面，处理了四部分逻辑，导致这个函数过重。
2. 难排查问题，万一其中一行代码出了 Bug，那么整个询价逻辑都会崩坏；与此同时出了 Bug 很难定位到底是哪个代码块。
3. 单个代码逻辑很难被抽离复用。
4. 违背“**开放封闭**”原则，当有一个新的条件出现时，又必须再加if-else语句。



上面的代码整体上来看只有两个关键动作：

```
逻辑的分发 ——> 业务逻辑的执行
```



#### 代码重构

**单一功能改造**——抽离业务逻辑的执行部分

```js
// 处理预热价
function prePrice(originPrice) {
  if(originPrice >= 100) {
    return originPrice - 20
  } 
  return originPrice * 0.9
}

// 处理大促价
function onSalePrice(originPrice) {
  if(originPrice >= 100) {
    return originPrice - 30
  } 
  return originPrice * 0.8
}

// 处理返场价
function backPrice(originPrice) {
  if(originPrice >= 200) {
    return originPrice - 50
  }
  return originPrice
}

// 处理尝鲜价
function freshPrice(originPrice) {
  return originPrice * 0.5
}

// askPrice - 分发询价逻辑
function askPrice(tag, originPrice) {
  // 处理预热价
  if(tag === 'pre') {
    return prePrice(originPrice)
  }
  // 处理大促价
  if(tag === 'onSale') {
    return onSalePrice(originPrice)
  }

  // 处理返场价
  if(tag === 'back') {
    return backPrice(originPrice)
  }

  // 处理尝鲜价
  if(tag === 'fresh') {
     return freshPrice(originPrice)
  }
}
```

优化了以下内容：

1. 一个函数只做一件事。现在每个函数都有了自己明确的、单一的分工。 
2. 方便快速定位bug
3. 方便导出逻辑以进行代码复用
4. 一旦条件内部的具体内容有变，只需要修改一个地方即可



**开放封闭改造**——逻辑的分发（扩展性）

针对需要新增的条件的情况，根据上面拆分单一功能原则的写法如下。

```diff
// 处理预热价
function prePrice(originPrice) {
  if(originPrice >= 100) {
    return originPrice - 20
  } 
  return originPrice * 0.9
}

// 处理大促价
function onSalePrice(originPrice) {
  if(originPrice >= 100) {
    return originPrice - 30
  } 
  return originPrice * 0.8
}

// 处理返场价
function backPrice(originPrice) {
  if(originPrice >= 200) {
    return originPrice - 50
  }
  return originPrice
}

// 处理尝鲜价
function freshPrice(originPrice) {
  return originPrice * 0.5
}

+ // 处理新人价
+ function newUserPrice(originPrice) {
+   if(originPrice >= 100) {
+     return originPrice - 50
+   }
+   return originPrice
+ }

function askPrice(tag, originPrice) {
  // 处理预热价
  if(tag === 'pre') {
    return prePrice(originPrice)
  }
  // 处理大促价
  if(tag === 'onSale') {
    return onSalePrice(originPrice)
  }

  // 处理返场价
  if(tag === 'back') {
    return backPrice(originPrice)
  }

  // 处理尝鲜价
  if(tag === 'fresh') {
     return freshPrice(originPrice)
  }
  
+  // 处理新人价
+  if(tag === 'newUser') {
+     return newUserPrice(originPrice)
+  }

}
```

在外层，编写一个 newUser 函数用于处理新人价逻辑；在 askPrice 里面，新增了一个 if-else 判断。可以看出，这样其实还是在修改 askPrice 的函数体，没有实现**“对扩展开放，对修改封闭”**的效果。

这么多 if-else，就是为了把 **询价标签-询价函数** 这个映射关系给明确下来。那么在 JS 中，**对象映射**既能够既帮明确映射关系，同时不破坏代码的灵活性的方法。

所以可以把询价算法全都收敛到一个对象里去：

```js
// 定义一个询价处理器对象
const priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  },
  fresh(originPrice) {
    return originPrice * 0.5;
  },
};
```

当想使用其中某个询价算法的时候，通过标签名去定位就好了：

```js
// 询价函数
function askPrice(tag, originPrice) {
  return priceProcessor[tag](originPrice)
}
```

这样，askPrice 函数里的 if-else 彻底没有了。这时候如果需要一个新人价，只需要给 priceProcessor 新增一个映射关系：

```js
priceProcessor.newUser = function (originPrice) {
  if (originPrice >= 100) {
    return originPrice - 50;
  }
  return originPrice;
}
```



#### 定义

策略模式：定义一系列的算法,把它们一个个封装起来, 并且使它们可相互替换。

涉及算法提取、算法封装、分发优化的整个操作流。