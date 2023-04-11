# JavaScript设计模式

在软件工程中，设计模式（Design Pattern）是对软件设计中普遍存在（反复出现）的各种问题，所提出的解决方案。 ——维基百科

针对特定或者类似场景下的写代码的优秀套路。

> **基础理论知识是一个人的基线，理论越强基线越高。再为自己定一个目标和向上攀附的阶梯，那么达到目标就是时间问题，而很多野路子工程师搞了半辈子也未达到优秀工程师的基线，很多他们绞尽脑汁得出的高深学问，不过是正规工程师看起来很自然的东西。**—— 吴军



解决知识抽象性带来的理解障碍，重要的不是反复的陈述、解释，而是**把自己放到一个正确的场景里，去体会这个模式的好**。



## 设计模式原则

设计原则是设计模式的指导理论，它可以帮助规避不良的软件设计。

SOLID 指代的五个基本原则分别是：

- 单一功能原则（Single Responsibility Principle）
- 开放封闭原则（Opened Closed Principle）
- 里式替换原则（Liskov Substitution Principle）
- 接口隔离原则（Interface Segregation Principle）
- 依赖反转原则（Dependency Inversion Principle）

在 JavaScript 设计模式中，主要用到的设计模式基本都围绕“单一功能”和“开放封闭”这两个原则来展开。

设计模式的核心思想——**封装变化**。**将变与不变分离，确保变化的部分灵活、不变的部分稳定**。

《设计模式：可复用面向对象软件的基础》中将23种设计模式按照“创建型”、“行为型”和“结构型”进行划分：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/6/169f16406d230ffe~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

无论是创建型、结构型还是行为型，这些具体的设计模式都是在用自己的方式去封装不同类型的变化 —— 创建型模式封装了创建对象过程中的变化，比如下节的工厂模式，它做的事情就是将创建对象的过程抽离；结构型模式封装的是对象之间组合方式的变化，目的在于灵活地表达对象间的配合与依赖关系；而行为型模式则将是对象千变万化的行为进行抽离，确保我们能够更安全、更方便地对行为进行更改。



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





### 构造器模式

当创建一个对象时，一般的代码：

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

当再次增加多个具有相同属性的对象时，就会类似写出大量重复的代码。所以可以使用构造器来批量生成一些具有相同属性但属性值不同的对象。

```js
function User(name , age, career) {
    this.name = name
    this.age = age
    this.career = career 
}
```

能创建一系列对象并为对象进行初始化赋值的函数，就叫做构造器。

在 JavaScript 中，使用的构造函数就应用了**构造器模式**。

使用构造器模式的时候，本质上是去抽象了每个对象实例的变与不变。



### 工厂模式

#### 简单工厂模式

使用工厂模式时，要做的就是去抽象不同构造函数（类）之间的变与不变。**将创建对象的过程单独封装。**

当有多种类，且每个类中既有共性又有特性的情况下时：

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

对于**强类型的静态语言**。用这些语言创建对象时，需要时刻关注类型之间的解耦，以便该对象日后可以表现出多态性。但 JavaScript，作为一种弱类型的语言，它具有天然的多态性，好像压根不需要考虑类型耦合问题。目前的 JavaScript 语法里，也确实不支持抽象类的直接实现，只能凭借模拟去还原抽象类。

在实际的业务中，往往面对的复杂度并非数个类、一个工厂可以解决，而是需要动用多个工厂。

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

每考虑到一个新的员工群体，就回去修改一次 Factory 的函数体，这种做法危险。

1. Factory会变得异常庞大
2. Factory 的逻辑过于繁杂和混乱难以维护
3. 不利于测试







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