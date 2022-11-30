# JavaScript设计模式

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





### 策略模式

提升良好的编码习惯和重构意识。

#### 实列代码

针对不同条件，使用if进行不同逻辑判断。

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
}
```

这种代码的不足：

1. 违背了“单一功能”原则，一个 function 里面，处理了四部分逻辑，导致这个函数过重。
2. 难排查问题，万一其中一行代码出了 Bug，那么整个询价逻辑都会崩坏；与此同时出了 Bug 你很难定位到底是哪个代码块坏了事。
3. 单个能力很难被抽离复用。
4. 违背“开放封闭”原则，当有一个新的条件出现时



上面的代码整体上来看只有两个关键动作：

```
逻辑的分发 ——> 逻辑的执行
```



#### 代码重构

**单一功能改造**——抽离逻辑的执行部分

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



**开放封闭改造**——逻辑的分发

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

在外层，我们编写一个 newUser 函数用于处理新人价逻辑；在 askPrice 里面，我们新增了一个 if-else 判断。可以看出，这样其实还是在修改 askPrice 的函数体，没有实现**“对扩展开放，对修改封闭”**的效果。

这么多 if-else，就是为了把 询价标签-询价函数 这个映射关系给明确下来。那么在 JS 中，**对象映射**既能够既帮明确映射关系，同时不破坏代码的灵活性的方法。

可以把询价算法全都收敛到一个对象里去：

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