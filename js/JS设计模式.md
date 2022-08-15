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