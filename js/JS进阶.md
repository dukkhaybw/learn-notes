

# JS进阶

## 前置知识

函数式编程中的基本概念。

- 函数式编程（Functional programming）与面向对象编程（Object-oriented programming）和过程式编程（Procedural programming）并列的**编程范式**。
- 最主要的特征是，函数是[第一等公民](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch2.html)。
- 强调将计算过程分解成可复用的函数，典型例子就是`map`方法和`reduce`方法组合而成 [MapReduce 算法](https://zh.wikipedia.org/wiki/MapReduce)。
- 只有[纯的](https://zh.wikipedia.org/wiki/纯函数)、没有[副作用](https://zh.wikipedia.org/wiki/函数副作用)的函数，才是合格的函数。

理解函数式编程，并学习其中一些基本的写法。



### 范畴论

**概念**

函数式编程起源于范畴论这一数学分支。理解函数式编程的重点就在于理解范畴论，范畴论认为世界上的所有的**概念体系**都可以抽象归属成一个个的"范畴"（category）。

范畴：范畴就是使用箭头连接的物体。（In mathematics, a category is an algebraic structure that comprises "objects" that are linked by "arrows". ）。

范畴是指把事物作归类整理所依据的共同性质，就是说：范畴是事物种类的本质。因为一个种类的本质往往由多个性质所构成，而本质与构成它的各个性质之间又总是以一定的结构方式互相联系着的

也就是说，彼此之间存在某种关系的概念、事物、对象等等，都构成"范畴"。随便什么东西，只要能找出它们之间的关系，就能定义一个"范畴"。

![img](https://www.ruanyifeng.com/blogimg/asset/2017/bg2017022210.jpg)

上图中，各个点与它们之间的箭头，就构成一个范畴。

**箭头**表示**范畴成员**之间的关系，正式的名称叫做"态射"（morphism）。**范畴论认为，同一个范畴的所有成员，就是不同状态的"变形"（transformation）。通过"态射"，一个成员可以变形成另一个成员。**



**数学模型**

既然"范畴"是满足某种变形关系的所有对象，就可以总结出它的数学模型。

- 所有成员是一个集合
- 变形关系是函数

也就是说，范畴论是集合论更上层的抽象，简单的理解就是"集合 + 函数"。

理论上通过函数，就可以从范畴的一个成员，算出其他所有成员。



**范畴与容器**

可以把"范畴"想象成是一个容器，里面包含两样东西。

- 值（value）
- 值的变形关系，也就是函数。

下面使用代码，定义一个简单的范畴。

```JS
class Category {
  constructor(val) { 
    this.val = val; 
  }

  addOne(x) {
    return x + 1;
  }
}
```

上面代码中，`Category`是一个类，也是一个容器，里面包含一个值（`this.val`）和一种变形关系（`addOne`）。你可能已经看出来了，这里的范畴，就是所有彼此之间相差`1`的数字。

注意，本文后面的部分，凡是提到"容器"的地方，全部都是指"范畴"。



**范畴论与函数式编程的关系**

范畴论使用函数，表达范畴成员之间的关系。

伴随着范畴论的发展，就发展出一整套函数的运算方法。这套方法起初只用于数学运算，后来有人将它在计算机上实现了，就变成了今天的"函数式编程"。

**本质上，函数式编程只是范畴论的运算方法，跟数理逻辑、微积分、行列式是同一类东西，都是数学方法，只是碰巧它能用来写程序。**

所以，为什么函数式编程要求函数必须是纯的，不能有副作用？因为它是一种数学运算，原始目的就是求值，不做其他事情，否则就无法满足函数运算法则了。

总之，在函数式编程中，函数就是一个管道（pipe）。这头进去一个值，那头就会出来一个新的值，没有其他作用。



### 函数的合成和柯里化

函数式编程有两个最基本的运算：合成和柯里化。

**合成**

如果一个值要经过多个函数，才能变成另外一个值，就可以把所有中间步骤合并成一个函数，这叫做"函数的合成"（compose）。

![img](https://www.ruanyifeng.com/blogimg/asset/2017/bg2017022204.png)

上图的代码实现

```js
const compose = function (f, g) {
  return function (x) {
    return f(g(x));
  };
}
```

函数的合成还必须满足结合律。

![img](https://www.ruanyifeng.com/blogimg/asset/2017/bg2017022209.png)



```js
compose(f, compose(g, h))
// 等同于
compose(compose(f, g), h)
// 等同于
compose(f, g, h)
```

合成也是函数必须是纯的一个原因。因为一个不纯的函数，怎么跟其他函数合成？怎么保证各种合成以后，它会达到预期的行为？

前面说过，函数就像数据的管道（pipe）。那么，函数合成就是将这些管道连了起来，让数据一口气从多个管道中穿过。



**柯里化**

`f(x)`和`g(x)`合成为`f(g(x))`，有一个隐藏的前提，就是`f`和`g`都只能接受一个参数。如果可以接受多个参数，比如`f(x, y)`和`g(a, b, c)`，函数合成就非常麻烦。

这时就需要函数柯里化了。所谓"柯里化"，就是把一个多参数的函数，转化为单参数函数。

```js
// 柯里化之前
function add(x, y) {
  return x + y;
}

add(1, 2) // 3

// 柯里化之后
function addX(y) {
  return function (x) {
    return x + y;
  };
}

addX(2)(1) // 3
```



### 函子

函数不仅可以用于同一个范畴之中值（成员）的转换，还可以用于将一个范畴转成另一个范畴。这就涉及到了函子（Functor）。



**概念**

函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。

它首先是一种范畴，也就是说，是一个容器，包含了值和变形关系。**比较特殊的是，它的变形关系可以依次作用于每一个值，将当前容器变形成另一个容器。**

![img](https://www.ruanyifeng.com/blogimg/asset/2017/bg2017022203.png)

上图中，左侧的圆圈就是一个函子，表示人名的范畴。外部传入函数`f`，会转成右边表示早餐的范畴。

下面是一张更一般的图。

![img](https://www.ruanyifeng.com/blogimg/asset/2017/bg2017022211.jpg)

上图中，函数`f`完成值的转换（`a`到`b`），将它传入函子，就可以实现范畴的转换（`Fa`到`Fb`）。



**代码实现**

任何具有`map`方法的数据结构，都可以当作函子的实现。

```js
class Functor {
  constructor(val) { 
    this.val = val; 
  }

  map(f) {
    return new Functor(f(this.val));
  }
}
```

上面代码中，`Functor`是一个函子，它的`map`方法接受函数`f`作为参数，然后返回一个新的函子，里面包含的值是被`f`处理过的（`f(this.val)`）。

**一般约定，函子的标志就是容器具有`map`方法。该方法将容器里面的每一个值，映射到另一个容器。**

用法示例：

```js
(new Functor(2)).map(function (two) {
  return two + 2;
});
// Functor(4)

(new Functor('flamethrowers')).map(function(s) {
  return s.toUpperCase();
});
// Functor('FLAMETHROWERS')

(new Functor('bombs')).map(_.concat(' away')).map(_.prop('length'));
// Functor(10)
```

上面的例子说明，函数式编程里面的运算，都是通过函子完成，即运算不直接针对值，而是针对这个值的容器----函子。函子本身具有对外接口（`map`方法），各种函数就是运算符，通过接口接入容器，引发容器里面的值的变形。

因此，**学习函数式编程，实际上就是学习函子的各种运算。**由于可以把运算方法封装在函子里面，所以又衍生出各种不同类型的函子，有多少种运算，就有多少种函子。函数式编程就变成了运用不同的函子，解决实际问题。















JS是布兰登·艾克（Brendan Eich）在 95 年用 10 天时间设计出来的。早期JS功能很简单，那时的网站更多是静态的信息展示类网页，那时没有前端这一工种。05年AJAX发布，基于 AJAX，不仅可以开发静态展示的页面，也可以开发动态交互的应用。这时。前端工种开始出现，但那时的JS生态缺少强大的标准库，许多问题需要开发者从0开始自己解决，如兼容性问题，所以后来社区涌现的许多库，以jQuery为代表。JS现在可以用来开发复杂应用的语言。

虽然和十几年前相比较，JavaScript 也加入了很多功能和语法糖，但是它的核心原理并没有太大变化。可即使没有太多本质上的变化，JavaScript 也仍然具有容易入门但难以进阶的问题。



问题：

1. 随着应用使用者的大规模增加，很多问题产生的**副作用**也会呈现指数级上升，性能、安全等非功能性的问题显露。

   例如：应用中一个小的副作用就会造成大量重复订单问题，这时就要用到纯函数思想中的幂等，来保证任意多次执行结果与一次执行结果相同，避免订单的重复提交。

2. 在大量访问的情况下，一个很小的资源加载对资源的消耗就是指数级的，能够实现对资源的有效控制，对做业务来说是十分关键的一点。
   通过函数式 + 响应式编程，就可以通过用户的实时需求动态加载资源，从而能够节省不必要的资源预加载成本。



![img](https://static001.geekbang.org/resource/image/11/4d/1178f724ae7909fdb7fbb8170856e44d.jpg?wh=2500x1680)

学习建议：

1. **基于语言的特点来学习**编程模式、数据结构和算法，能更好地理解这些知识的应用。例如：脱离了实际的语言和它解决的问题来解释编程模式，就会高度抽象，显得比较形而上。

   在前端基本都是根据用户的行为来进行响应，响应具体做些什么工作，要通过工具来处理，比如事件处理、状态管理。函数就是这个工具，它的核心就是 IO 输入输出。我们给函数一个输入值（数据结构），它进行处理（算法），然后给我们一个输出值（返回值）。

2. 在学习 JavaScript 的引擎、浏览器和编译原理的过程中，来理解这些数据结构和算法，这样更能理解这门语言的运行机制和原理，起到和专门讲算法的课程相辅相成的作用。
3. 学习每一节课尽量一鼓作气，有些概念即使模糊，硬着头皮看下去也比停顿去深入了解某个点强。



注意点：

![img](https://static001.geekbang.org/resource/image/94/a1/94yy2a2e9f67c8a6d299fd18ab6088a1.jpg?wh=2000x1006)



课程模块：

1. 学习函数式和面向对象编程（编程范式）及其中的核心概念，结合JS特性，在合适的时候选择合适的编程范式解决实际问题
2. 学习JavaScript 的底层逻辑和底层所用到的数据结构与算法，JS 引擎及浏览器在编译和运行时的一些特点
3. JS的设计模式
4. 学习 JavaScript 中的常用工具及其背后的使用原理、使用场景
5. 前端的趋势

![img](https://static001.geekbang.org/resource/image/90/yy/90599866142b3b78015dab88cae949yy.jpg?wh=2000x1125)



推荐阅读：

1. JavaScript: The Good Parts
2. JavaScript: The Definitive Guide



**如果说在使用函数式编程的时候，考虑的是“生产力”，那在使用面向对象的时候，考虑的更多是“生产关系”。**

JavaScript 中的继承，是基于原型链的继承，更偏向 delegation（委托） 而不是 inheritance（继承）。即使在面向对象设计本身，也是追求多用组合少用继承。所以用JS面向对象编程时，有自己的一些特点来组织生产关系。



编程语言有两大编程范式（模式）：

1. 面向函数编程
2. 面向对象编程



学习JS的模式的痛点：

1. 如果已经学过传统的面向对象语言，那么在学 JavaScript 的时候，很可能**对函数式的理解和运用不够深入**；
2. 如果一开始就学习 JavaScript，只停留在开发一些简单应用上，可以说**对它的面向对象的理解和运用不会很深入**。





## 函数式编程

从编程范式的角度看 JavaScript，它是**结构化的、事件驱动的动态语言，且支持声明式和指令式两种模式**。JS是一种可以采用不同模式开发应用的语言，而一些语言可能有它的侧模式，比如侧重于使用面向的模式编程等。

![img](https://static001.geekbang.org/resource/image/8b/6d/8b03bea0b1578372311923c81053e26d.jpg?wh=1920x595)



前端开发中的应用面对的是 UI 客户端，所以应用背后的程序，就需要处理大量的用户和网络触发的事件，并根据事件的状态来做出响应。而函数式和响应式编程的很多思想，正好可以帮助这一目的的实现。

函数的核心就是I/O，给函数一个输入值（数据结构），它进行处理（算法），然后给一个输出值（返回值）。

函数式编程中很重要的概念 Monad的核心，就是**围绕一个“值”来组织各种方法**。

**在函数式编程中，通常会把各种干扰叫做副作用（Side effect）。**



![img](https://static001.geekbang.org/resource/image/88/32/88b6eb343cfa28c2499f6395c6c3a032.jpg?wh=1920x815)



### 函数是什么

一个函数由输入、函数和输出组成，函数是数据集到目标的一种关系，它所做的就是把行为封装起来，从而达到目标。

![img](https://static001.geekbang.org/resource/image/81/fd/8164fe53b89fc1c1406d3101149b1dfd.jpg?wh=1920x1008)

### 函数中的副作用

函数已经把算法封装了，函数里相对就是可控的，而比较不可控的是**外部环境**。把不可控的外部环境分为三大类：

1. 函数中最常见的副作用，就是全局变量（global variable）。下面例子中，没法保证这些函数没有改变这个变量的值，也没法保证每次输出的结果是 1。所以从输入开始，这种不确定性就存在了。

   ```js
   var x = 1;
   foo();
   console.log( x );
   bar();
   console.log( x );
   baz();
   console.log( x );
   ```

2. IO 影响（IO effects），这里的 IO 说的不是前面函数里的参数和返回值，而是类似前端浏览器中的用户行为，比如鼠标和键盘的输入，或者如果是服务器端的 Node 的话，就是文件系统、网络连接以及 stream 的 stdin（标准输入）和 stdout（标准输出）。

3. 第三种比较常见的副作用是与网络请求（HTTP request）相关，比如要针对一个用户下单的动作发起一个网络请求，需要先获得用户 ID，再连着用户的 ID 一起发送。如果我们还没获取到用户 ID，就发起下单请求，可能就会收到报错。



**下面是减少副作用的方法**

### 纯函数

在函数式编程中，有两个核心概念：纯函数（pure function）和不可变（immutability）。

纯函数：**一个函数的返回结果的变化只依赖其参数，并且执行过程中没有副作用，只要传入的参数一样，那每次执行的结果一定都一样。**纯函数就可以通过减少对外界不确定因素的依赖，来减少副作用。（对内）

```js
var rate = 0.05;   // 放在函数外作为变量时，函数就不是一个纯函数了，因为随着这个变量的变化，计算结果会有所不同。
function calculateGST( productPrice ) {
  return productPrice * rate;
}
calculateGST(100); // return 5



function calculateGST( productPrice ) {  // 纯函数
    return productPrice * 0.05;
}
calculateGST(100); // return 5
```

非纯函数：指函数体中的代码依赖了函数体外的变量或者值，或者函数体内部采用了可变的量，比如采用一个随机数。



### 不可变

不可变：在减少程序被外界影响的同时，也减少对外界的影响。如果把一个外部变量作为参数作为输入，在函数里做了改变，作为输出返回。那么这个过程中，可能不知道这种变化会对整个系统造成什么样的结果。 **也就是函数不对外界传入的参数产生影响。**（对外）

```js
const beforeList = [1,2,3,4]
console.log(beforeList.splice(0,2))
console.log(beforeList.splice(0,2))
//[ 1, 2 ]
//[ 3, 4 ]

const beforeList = [1,2,3,4]
console.log(beforeList.slice(0,2))
console.log(beforeList.slice(0,2))
//[ 1, 2 ]
//[ 1, 2 ]
```

数组中的 splice 方法，在对数据进行了处理后，改变了全局中的 beforeList 的值，所以是可变的。而 slice 在执行之后的结果，没有影响全局中的 beforeList 的值，所以它是不可变的。在开发中，如果要保证不可变，就不能用 splice，而用 slice。其他数组方法例子：

![img](https://static001.geekbang.org/resource/image/66/ed/668060b8cfdf2dd6569975d96e9ef2ed.jpg?wh=1920x1167)



可变：就是指对于外部传入的实参，直接进行修改，这样是存在隐患的，因为不确定外部是否会基于原来的那个变量的值进行其他后续操作。



如何利用 JavaScript 的核心设计思想和工具解决这些副作用？

函数式编程最核心的地方，就是输入输出和中间的算法，要解决的核心问题就是副作用。而为了解决副作用，需要掌握两个重要的概念，一个是纯函数，一个是不可变。纯函数强调的是自身的稳定性，对结果只影响一次；而不可变强调的是和外界的交互中，尽量减少相互间负面的影响。

![img](https://static001.geekbang.org/resource/image/10/cb/10da7a3de6f518c1b3f4c68748e26fcb.jpg?wh=1920x918)



**纯函数就是在减少程序被外界影响的同时，不可变就是减少对外界的影响。**



## 面向对象编程

在做业务系统开发的时候，会面对各种各样的业务对象，比如“表单”“购物车”“订单”，这些都可以看做是对象。而工具和方法通常是服务于对象的。

**如果说在使用函数式编程的时候，考虑的是“生产力”，那在使用面向对象的时候，考虑的更多是“生产关系”。**如果说函数加对象组成了生产力，那么封装、重用和继承则可以用来组成生产关系。

<img src="https://static001.geekbang.org/resource/image/d2/0f/d243d2785c92e59e77c6dbae579b4a0f.jpg?wh=1920x679" alt="img" style="zoom:33%;" />

**重用**就是把可以重复使用的功能抽象到一个类里，每次只是创建一个它的实例对象来使用。

可以把通用功能放到抽象类；而一些特定的行为或属性，可以通过继承放到实现类中，这样在继承了基础的父类（parent class）功能的基础上（extend），能够在子类（child class）中作一些改动。但是如果一个程序中，父子的层级过于复杂，如果父类有了问题，就会牵一发动全身，而且抽象的层级过多，也会让代码难以理解。

实际上，在面向对象中，也有组合的概念，就是一个子类不是继承的某个父类，而是通过组合多个类，来形成一个类，而不是强调依靠某种从属关系。所以，在面向对象的编程中，也有“组合”优于“继承”的概念。不过在实际情况下，继承也不是完全不可取的，在开发中，使用哪种思想还是要根据情况具体分析。



### 基于原型的继承

JavaScript 中的类和其它面向对象的语言，究竟有什么不同？

对于传统的面向对象的编程语言来说，比如 Java，一个对象是基于一个类的蓝图来创建的。但是在 JavaScript 中，就没有这种类和对象的拷贝从属关系。实际上，JS 里的对象和类，是构建函数之间原型链接链接的关系。

在下图左边基于类的例子中，以一个类作为蓝图，可以创建两个实例。而右边基于原型的例子里，可以看到通过一个构建函数构建出的两个对象，是通过原型链和构建函数的原型相连接的，它们并不是基于一个蓝图的复制拷贝和从属关系。

![img](https://static001.geekbang.org/resource/image/31/99/315b5ce3ecfbd349b7f1c0fc311dd199.jpg?wh=1920x861)



```js

function Widget(widgetName) {
    this.widgetName= widgetName;
}
 
Widget.prototype.identify = function() {
    return "这是" + this.widgetName;
};
 
function Notice(widgetName) {
    Widget.call(this, widgetName);
}
 
Notice.prototype = Object.create(Widget.prototype);
 
Notice.prototype.display= function() {
    console.log("你好， " + this.identify() + ".");
};
 
var notice1 = new Notice("应用A");
var notice2 = new Notice("应用B");

Object.getPrototypeOf(notice1) === Notice.prototype //true
Object.getPrototypeOf(notice2) === Notice.prototype //true

notice1.display(); // "你好，这是应用A"
notice2.display(); // "你好，这是应用B"
```

在传统的面向对象语言，比如 Java 里，当用到继承时，一个类的属性和功能是可以被基于这个类创建的对象“拷贝”过去的。但是在 JavaScript 里，虽然用 Notice 创建了 notice1 和 notice2，但是它俩并没有将其属性和功能拷贝过来，而是默认通过原型链来寻找原型中的功能，然后利用“链接”而不是“拷贝”来。

![img](https://static001.geekbang.org/resource/image/a3/5d/a3f82ea686a9022fa2a5c4d22f22c45d.jpg?wh=1920x954)





![img](https://static001.geekbang.org/resource/image/f9/c0/f9173ef0176ecyy13f2d744bf978e8c0.jpg?wh=2000x1125)



JavaScript 中的常量（const，constant）算不算不可变呢？

> 分清楚是值不可变，还是变量的不可变。比如我们给num赋值数组，值还是可变。  
>
> const num = [3];  
>
> num[0] = 5; // 返回：5 
>
> 反之，没法拷贝原数组，slice后再赋值给原来的变量 
>
> const sliceNums = [1,2,3,4,5]; 
>
> sliceNums = sliceNums.slice(0,2); // 返回错误 
>
> 所以const还是蛮多坑的，在Java中用的就是final，而不是const。 
>
> 也是因为这些坑，在JS中，通常const更多用于原始类型的值，比如数理常量、字节顺序或版本号： 
>
> const H0 = 74;               // 哈勃常数 (km/s/Mpc) 
>
> const PI = 3.141592;       // 圆周率 
>
> const C = 299792.458;   // 光速 (km/s)



## 闭包、对象管理数据

在 JavaScript 中，值一般被分为两种：**原始类型和对象类型**。

原始数据类型本身是不可变的。例如 2 = 2.5 得到的结果会是 invalid，这就证明了不可能改变一个原始类型的值。



对象数据类型，这类数据像是一种数据结构或容器。那这样的值是可变的。

目的：**在使用对象类型的值来存储数据的时候，要如何在更新数据的同时做到不可变。**

当应用有状态数据时，就需要围绕这个状态数据编写一系列函数或者方法。在这个过程中，需要考虑的就是一个值的结构性不可变的问题。



围绕值的结构性操作，都有哪些数据类型可以选择。——闭包和对象

### 围绕值的不同组织结构

**围绕值的结构性操作的数据类型**

闭包（closure）和对象（object），这二者都可以对一个状态值进行封装（创建）和编写行为（组织操作状态值的方法或者函数）。

**有一个说法是：闭包是带数据的行为，对象是带行为的数据。**

#### 闭包

```js
function counter() {
    let name = "计数";
    let curVal = 0;
    function counting() {
        curVal++;
    }
    function getCount() {
        console.log(
            `${name}是${curVal}`
        );
    }
    return {counting,getCount}
}

var counter1 = counter();

counter1.counting();  
counter1.counting();  
counter1.counting();  
counter1.getCount();  // 计数是3
```



#### 对象

```js
var counter = {
    name: "计数",
    curVal: 0,
    counting() {
        this.curVal++;
        console.log(
            `${this.name}是${this.curVal}`
        );
    }
};

counter.counting(); // 计数是1
counter.counting(); // 计数是2
counter.counting(); // 计数是3
```



单纯从值的管理和围绕值的一系列行为的角度来看，可以说闭包和对象能达到类似的效果。上面**闭包中的状态数据**对应**对象中的属性**，在**闭包中创建的针对值的行为**对应**在对象中的方法**。

![img](https://static001.geekbang.org/resource/image/aa/bc/aab05b1538730f5d2d2594f1ed678bbc.jpg?wh=1920x686)



### 闭包和对象的不同

它们在隐私（privacy）、状态拷贝（state cloning）和性能（performance）上有差别，而这些差别在结构性地处理值的问题上，具有不同的优劣势。

![img](https://static001.geekbang.org/resource/image/d4/d3/d4b33bdaebd78854338a331c407fc2d3.jpg?wh=1920x733)



#### 隐私

在闭包中，除非是通过接口，也就是在外部函数中返回内部函数的方法，不然内部的值是对外不可见的。所以它可以更准确的地控制我们想要暴露或隐藏的属性，以及相关的操作。



在对象中，不需要特殊的方式，就可以获取对象中的属性和重新赋值。如果想要遵循不可变的原则，有一个 Object.freeze() 的方法，可以把所有的对象设置成只读 writable: false。通过 freeze 会让对象所有的属性变得只读，而且不可逆。



#### 拷贝

当拿到的数据是对象类型的数据时，如何遵循不可变原则？

不对原始的对象和数组值做改变，而是拷贝之后，在拷贝的版本上做变更。

```js
// 数组浅拷贝
var a = [ 1, 2 ];
var b = [ ...a ];
b.push( 3 );
a;  // [1,2]
b;  // [1,2,3]

// 对象浅拷贝
var o = {
    x: 1,
    y: 2
};
var p = { ...o };
p.y = 3; 
o.y;  // 2
p.y;  // 3
```

数组和对象都是很容易拷贝的，而闭包则相对更难拷贝。



#### 拷贝性能

如果这个值只改变一两次，那就没问题。但假设系统中有值不停在改变，如果每次都拷贝的话，就会占据大量内存。这样一来，应该如何处理呢？

**实际上，在这种情况下，有一个解决方案就是用到一个类似链表的结构，当中有一组对象记录改变的指数和相关的值。**

比如下面的 [3, 1, 0, 7] 这组数组中，我们把第 0 个值变成 2，第 3 个值变成 6，第 4 个值添加 1，形成了 [2, 1, 0, 6, 1]。那么如果我们只记录变化的话，就是 0:2、3:6 和 4:1 这三组对象，减少了很多内存占用。

![img](https://static001.geekbang.org/resource/image/b4/9b/b4a1b444fe30607bc3d8051ea3410b9b.jpg?wh=1920x572)

在社区已经有很多成熟的三方库比如 immutable.js，它们会有自己的数据结构，比如 array list 和 object map，以及相关算法来解决类似的问题。



#### 性能

从性能的角度来讲，对象的内存和运算通常要优于闭包。比如，在下面第一个闭包的例子中，每次使用都会创建一个新的函数表达。

```js
// 闭包
function PrintMessageA(name) {
    return function printName(){
        return `${name}, 你好！`;
    };
}

var greetings1 = PrintMessageA( "先生" );
greetings1();  // 先生，你好！
```



第二个对象的例子中，通过 bind 将 this 绑定到 greetings2 上，这样一来，PrintMessageB 就会引用 greetings2.name 来作为 this.name，从而达到和闭包一样的效果。但不需要创建一个闭包，只需要将 this 指向引用的对象即可。

```js
// 对象
function PrintMessageB(){
   return `${this.name}, 你好！`;
}
var greetings2 = PrintMessageB.bind( {
    name: "先生"
} );
greetings2();  // 先生，你好！
```



**重点关注的是对象和闭包在处理不可变问题上的不同优势。**

- 在属性和方法的隐私方面，闭包天然对属性有保护作用，同时它也可以按需暴露接口，来更精确地获取或重新给状态赋值。但是它和要解决的问题，似乎关系不大。
- 对象不仅可以轻松做到 props 整体不可变，而且在需要 state 变化时，在拷贝上也更有优势。不过从性能的角度来看，如果拷贝的量不大，也许它们的性能差不多，但如果是一个高频交互的界面，微小的差别可能就会被放大。



## 函数具象化

在输入、计算和输出这个过程中，最难控制的是输入。因为它来自外界，而计算是在相对封闭的环境中，至于输出只是一个结果。

**现在则要对输入进行控制。**

在编写一个函数时，需要传入多个实参，其中一部分实参是先明确的，另一部分是后明确的，该如何处理呢？即通过**部分应用（partial application）和柯里化（currying）这类工具函数实现**。函数式编程中，如何突破在调用点（call-site）传参的限制，做到部分传参和后续执行。

**函数式编程重在声明式和可读性，而且强调每个函数尽量解决一个单一问题。**



### 部分应用

例子：假设orderEventHandler函数需要3个参数才能正常执行，现在已经知道一个参数值，另两个未知。现在希望orderEventHandler函数能被正常执行。

```js
function orderEventHandler(url,data,callback) {
    // ..
}
```

可以基于orderEventHandler函数衍生出另一个函数fetchOrder，提前预置了已知参数 url，减少了后面需要传入的参数数量，同时也增加了代码的可读性。 

```js
function fetchOrder(data,cb) {
    orderEventHandler( "http://some.api/order", data, cb );
}
```

但是，这种方式并不灵活，如果还有一个函数，该函数接受两个参数，现在知道了其中一个参数值，为此不得不再编写一个类似fetchOrder函数的另一个函数，且这个函数值接受一个参数，且内部调用那个接受两参数的函数，例如：

```js
function getCurrentOrder(cb) {
    getCurrentOrder( { order: 12343504 }, cb );
}
```

为了提高灵活性，在函数时编程中通常会使用**部分应用**。提供一个抽象的 partial 工具函数，**在先预制部分参数的情况下，后续再传入剩余的参数值。**如以下代码所示：

```js
var fetchOrder = partial( orderEventHandler, "http://some.api/order" );
var getCurrentOrder = partial( fetchOrder, { order: 12343504 } );
```



 **partial 工具函数的实现**

借助闭包和展开运算符（...）

- 闭包：保存参数功能
- 展开运算符：处理预置的和后置的实参

```js
function partial(fn,...args1){
  return function (...args2){
    return fn(...args1,...args2)
  }
}
```



也可以借助bind函数来实现类似于partial函数的作用：

bind 通常是在面向对象中用来绑定 this 的，用作模拟partial函数时，不绑定 this，所以第一个参数会设置为 null。

```js
var fetchOrder = httpEvntHandler.bind( null, "http://some.api/order" );
```



### 柯里化

柯里化的结果就是每次只传一个参数。

把之前的 httpEventHandler 做了柯里化处理之后，就不需要一次输入 3 个参数了，而是每次只传入一个参数。第一次，传入了 url 来获取订单；之后，传入了当前订单的 id；最后，获得了当前订单后，传入一个订单修改的参数来做相关修改。

```js
var curriedOrderEvntHandler = curry( orderEventHandler );

var fetchOrder = curriedHttpEvntHandler( "http://some.api/order" );

var getCurrentOrder = fetchOrder( { order: CURRENT_ORDER_ID } );

getCurrentOrder( function editOrder(order){ /* .. */ } );
```



**实现一个curry工具函数**

```js
function curry(fn,arity = fn.length){
  let argsArrs = []
  return function curried(...args){
    argsArrs.push(args)
    if(argsArrs.length>=arity){
      return fn(argsArrs)
    }else{
      return curried
    }
  }
}
```



扩展知识：

> **Function.length**
>
> **`length`** 属性指明函数的形参个数。
>
> `length` 是函数对象的一个属性值，指该函数期望传入的参数数量，即形参的个数。
>
> **形参的数量不包括剩余参数个数，仅包括第一个具有默认值之前的参数个数。**
>
> 与之对比的是，[`arguments.length`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/length) 是函数被调用时实际传参的个数。
>
> ```js
> function func1(a,...args) {}
> 
> function func2(a, b) {}
> 
> function func1(a,b=2) {}
> 
> console.log(func1.length);
> // Expected output: 1
> 
> console.log(func2.length);
> // Expected output: 2
> 
> console.log(func3.length);
> // Expected output: 1
> ```



函数式编程处理未知的能力，这里的未知指的是编程时的未知，比如有些参数是提前知道的，而有一些是后面加入的。

一个普通的函数通常是在调用点执行时传入参数的，而通过部分应用和柯里化，做到了可以先传入部分已知参数，再在之后的某个时间传入部分参数，这样从时间和空间上，就将一个函数分开了。

这样的好处：比如处理未知，让函数从抽象变具体、让具体的函数每次只专心做好一件事、减少参数数量，还有一个更抽象的好处，就是体现了函数式底层的声明式思想。



在函数式编程中，把参数的数量叫做 arity（元数）。

部分应用可以减少每次函数调用时需要传入的参数，而柯里化更是把函数调用时需要传入的参数数量，降到了 1。它们实际上都起到了**控制参数数量**的作用。

而在函数式编程中，其实还有很多可以帮助我们处理参数输入的工具。

### 其他参数处理工具函数

**unary、constant 和 identity**

![img](https://static001.geekbang.org/resource/image/e7/5c/e70e2bbb764b2934d6b4ea379fc8465c.jpg?wh=1920x596)



#### unary

改造函数的工具函数，一元参数（unary）

作用：作用是把一个能接收多个参数的函数，变成一个只接收一个参数的函数。

实现：

```js
function unary(fn) {
    return function oneArg(arg){
        return fn( arg );
    };
}
```

使用案例：

当想通过 parseInt，把一组数字字符串通过 map 来映射成整数数组，但是 parseInt 会接收两个参数，而如果直接输入 parseInt 的话，它的第二个参数会是索引，这肯定不是期待的结果。所以这时候，unary 可以让 parseInt 只接收一个参数，从而就可以正确地打出想要的结果。

```js
["1","2","3","4","5"].map( unary( parseInt ) ); // [1,2,3,4,5]
```

除了一元，还有二元、三元，二元就是 binary，三元就是 tenary。顾名思义，它们分别代表的就是把一个函数的参数数量控制在 2 个和 3 个。



#### constant

改造参数

对于 JavaScript promise 中的 then， **从函数签名的角度来看**，它只接收函数，而不接收其他值类型作为参数。比如下面例子中，34 这个值就是不能被接收的。

```js
promise1.then( action1 ).then( 34 ).then( action3 );
```



函数签名：一般包含了参数及其类型返回值，还有类型可能引发或传回的异常，以及相关的方法在面向对象中的可用性信息（如关键字 public、static 或 prototype）。

在 C 或 C++ 中，会有类似这样的签名，如下所示：

```c++
// C
int main (int arga, char *argb[]) {}

// C++
int main (int argc, char **argv) {/** ... **/ }
```

在JS中没有这些静态规则，甚至连命名函数本身都不是必须的，就更不用说签名了。那么遇到 then 这种情况怎么办呢？

在这种情况下，我们其实可以编写一个只返回值的 constant 函数，这样就解决了接收的问题。

```js
function constant(v) {
    return function value(){
        return v;
    };
}
```

然后，就可以把值包装在 constant 函数里，通过这样的方式，就可以把值作为函数参数传入了。

```js
promise1.then( action1 ).then( constant( 34 ) ).then( action3 );
```





#### identity

不做改造。

它既不改变函数，也不改变参数。它的功能就是输入一个值，返回一个同样的值。

```js
function identity(v) {
    return v;
}
```

作用：

- 作为断言（predicate）, 来过滤掉空值

比如在下面的例子中，它可以作为断言（predicate）， 来过滤掉空值。在函数式编程中，断言是一个可以用来做判断条件的函数，在这个例子里，identity 就作为判断一个值是否为空的断言。

```js
var words = "   hello world  ".split( /\s|\b/ );
words; // ['', '', '', 'hello', 'world', '', '']

words.filter( identity ); // ['hello', 'world']
```

- 做默认的转化工具

比如以下例子中，创建了一个 transLogger 函数，可以传入一个数据和相关的 lower 功能函数，来将文字转化成小写。

```js
function transLogger (msg,formatFn = identity) {
    msg = formatFn( msg );
    console.log( msg );
}

function lower(txt) {
    return txt.toLowerCase();
}

transLogger( "Hello World" );            // Hello World
transLogger( "Hello World", lower );     // hello world
```



在讲部分应用和柯里化的时候，提到它在带来一些灵活性的同时，也仍然会有一些限制，即参数的顺序问题，必须按照一个顺序来执行。而有些三方库提供的一些工具，就可以将参数倒排或重新排序。

重新排序的方式有很多，可以通过解构（destructure），从数组和对象参数中提取值，对变量进行赋值时重新排序；或通过延展操作符把一个对象中的一组值，“延展”成单独的参数来处理；又或者通过 .toString() 和正则表达式解析函数中的参数做处理。



## 函数抽象化

组合、管道和reducer把函数从具象化变到抽象化。

**函数从具体到抽象，本质是把不同的函数封装在只有一个入口和出口的函数当中。**在函数式编程里，组合（Composition）的概念就是把函数组合起来，形成一个新的函数。

组合函数的简单案例：创建一个“判断一个数是否为奇数”的 isOdd 函数，可以先写一个“计算目标数值除以 2 的余数”的函数，然后再写一个“看结果是不是等于 1”的函数。这样，isOdd 函数就是建立在两个组件函数的基础上。

```js
var isOdd = compose(equalsToOne, remainderOfTwo);
```

但是，上面这个函数的传参顺序是反直觉的，因为如果按照正常的顺序，应该是先把 remainderByTwo 放在前面来计算余数，然后再执行后面的 equalsToOne。

为什么以这样反直觉的方式传参？因为它是按照传参顺序来排列的。

### 组合Compose

**Point-Pree**：是函数式编程中的一种编程风格，其中的 Point 是指参数，free 是指没有。Point-Free 的意思就是没有参数的函数。看上去没有直接写明需要在函数调用时的传参，但是实际上只是隐藏掉了，并不代表不用传参。

为什么要有没有参数的函数？作用是：可以将一个函数和另外一个函数结合起来，形成一个新函数。比如，为了要创建 isOdd 函数，通过这种方式，我们就可以把这两个函数“组合”在一起，得到 isOdd。

```js
var isOdd = (x) => equalsToOne(remainderOfTwo(x));
```

point free的理解：把参数去掉，是指参数的含义已经体现在函数声明（名字）里面了，比如equalsToOne，那就是说传入的值是否等于1，如果是equalsToA，那么这个A就得传为参数，加上要比较的x就是两个参数了。这就是所谓“**暴露给使用者的就是功能本身**”。



**函数组件**

例子：先定义两个基础函数，dividedBy，它的作用是计算 x 除以 y 的余数；equalsTo，它是用来看余数是否等于 1。这两个最基础的函数，就像React中最基础的组件一样，所以可以称为组件函数，它们的目的就是衍生出其他高级一些的函数。

这两个函数的特点：都只专注于处理一个小任务。

```js
var dividedBy = (y) => {
    return function forX(x) {
        return x % y;
    }
}
var equalsTo = (y) => {
    return function forX(x) {
        return x === y;
    }
}
```



在 dividedBy 和 equalsToOne 的基础上，就可以创建两个 Point-Free 的函数，remainderOfTwo 和 equalsToOne。

```js
var remainderOfTwo = dividedBy(2);
var equalsToOne = equalsTo(1);
```

最后，使用时只需要传入参数 x，就可以计算相应的 isOdd 的结果。

```js
var isOdd = (x) => equalsToOne(remainderOfTwo(x));
```

组件函数其实就是用到了函数式编程声明式的思想，equalsToOne 和 remainderByTwo，不仅把过程进行了封装，而且把参数也去掉了，暴露给使用者的就是功能本身。所以，只需要把这两个函数组件的功能结合起来，就可以实现 isOdd 函数了。



**组合函数**

```js
function compose(...fns) {
    return fns.reverse().reduce( function reducer(fn1,fn2){
        return function composed(...args){
            return fn2( fn1( ...args ) );
        };
    } );
}
```



使用compose工具函数生成isOdd函数

```js
var isOdd = compose(equalsToOne, remainderOfTwo);
```



进过componse包装后的函数，在传参时，是后传的实参函数放在外层后被调用。这还是有些反直觉的，因此想要一种更直观的顺序来完成一系列操作。解决方案就是用函数式编程中的**管道**。



**管道 Pipeline**

函数式编程中的管道，是另外一种函数的创建方式。这样创建出来的函数的特点是：**一个函数的输出会作为下一个函数的输入，然后按顺序执行。**所以，管道就是以组合反过来的方式来处理的。

例子：找到当前目录下面所有的 JavaScript 文件。

```shell
$ ls -1 | grep "js$" | wc -l
```

这个管道有竖线“ | ”隔开的三个部分。第一个部分 ls -1，列出并返回了当前目录下所有的文件，这个结果作为了第二步 grep "js$" 的输入；第二个部分会过滤出所有的以 js 结尾的文件；然后第二步的结果会作为第三部分的输入，在第三步，我们会看到最后计算的结果。



**JS中的管道**

IsOdd函数如何通过管道实现。只需要通过一个 reverseArgs 函数，将 compose 中接收参数的顺序反过来即可。

把参数做倒序处理，生成一个新的函数。在函数式编程中高阶函数的例子。

```js
function reverseArgs(fn) {
    return function argsReversed(...args){
        return fn( ...args.reverse() );
    };
}

var pipe = reverseArgs( compose );

// 或者
function pipe(...fns) {
    return fns.reduce( function reducer(fn1,fn2){
        return function piped(...args){
            return fn2( fn1( ...args ) );
        };
    } );
}


const isOdd = pipe(remainderOfTwo, equalsToOne);  // 这次，把 remainderOfTwo 和 equalsToOne 按照比较直观的方式进行排序。在前面的函数现执行

isOdd(1); // 返回 true
isOdd(2); // 返回 false
```



### 转导 Transduction

转导主要为了更好的，更系统的控制数据。React中的reducer就使用到了transducing

transduce 和 reducer 的作用以及原理。reducer 最主要的作用其实是解决在使用多个 map、filter、reduce 操作大型数组时，可能会发生的性能问题。

通过使用 transducer 和 reducer，就可以优化一系列 map、filter、reduce 操作，使得输入数组只被处理一次并直接产生输出结果，而不需要创建任何中间数组。不用tansducer 或 reducer的例子：

```js
var oldArray = [36, 29, 18, 7, 46, 53];
var newArray = oldArray
  .filter(isEven)
  .map(double)
  .filter(passSixty)
  .map(addFive);
  
console.log (newArray); // 返回：[77,97]
```

在这个例子里，对一组数组进行了一系列的操作，先是筛选出奇数，再乘以二，之后筛出大于六十的值，最后加上五。在这个过程中，会不断生成中间数组。这个实际发生的过程如下图左半部分所示。

![img](https://static001.geekbang.org/resource/image/aa/45/aa5dbd1ff55485d4c596e77801759545.jpg?wh=1920x1080)

如果使用 reducer 的话，我们对每个值只需要操作一次，就可产出最终的结果。如上图的右半部分所示。



```js
const { filterTR, mapTR, composeReducer } = (() => {
	function applyTypeForFunction(fn, type) {
		fn.type = type;
		return fn;
	}

	function filterTR(fn) {
		return applyTypeForFunction(fn, "filter");
	}

	function mapTR(fn) {
		return applyTypeForFunction(fn, "map");
	}

	function composeReducer(inputArray, fnArray) {
		return inputArray.reduce((sum, element) => {
			let tmpVal = element;
			let tmpFn;

			for (let i = 0; i < fnArray.length; i++) {
				tmpFn = fnArray[i];
				if (tmpFn.type === "filter" && tmpFn(tmpVal) === false) {
					console.log(`failed to pass filter: ${element} `);
					return sum;
				}
				if (tmpFn.type === "map") {
					tmpVal = tmpFn(tmpVal);
				}
			}

			console.log(`${element} pass, result = ${tmpVal}`);
			sum.push(tmpVal);

			return sum;
		}, []);
	}

	return {
		filterTR,
		mapTR,
		composeReducer
	};
})();

const isEven = (v) => v % 2 === 0;
const passSixty = (v) => v > 60;
const double = (v) => 2 * v;
const addFive = (v) => v + 5;

var oldArray = [36, 29, 18, 7, 46, 53];
var newArray = composeReducer(oldArray, [
	filterTR(isEven),
	mapTR(double),
	filterTR(passSixty),
	mapTR(addFive)
]);

console.log(newArray);  // 返回：[77,97]

// sum []  temVal = 36  temFn
```



如何实现？

先将一个函数，比如 isEven 作为输入，放到了一个 transducer （一个经典的高阶函数）里，然后作为输出，我们得到的是一个 isEvenR 的 reducer 函数（即输入一个函数，得到一个新的函数）。

像 double 和 addFive 都具有映射类的功能，所以我们可以通过一个类似 mapReducer 这样的一个 transducer，来把它们转换成 reducer。而像 isEven 和 passSixty 都是筛选类的功能，所以我们可以通过一个类似 filterReducer 这样的一个 transducer，来把它们转换成 reducer。

composeReducer 用的就是一个类似组合的功能。



扩展：

> Array.prototype.reduce()
>
> **`reduce()`** 方法对数组中的每个元素按顺序执行一个由开发者提供的 **reducer** 函数，每一次运行 **reducer** 会将先前元素的计算结果作为reducer的第一个参数传入，最后将其结果汇总为单个返回值。
>
> 第一次执行回调函数时，不存在“上一次的计算结果”。如果需要回调函数从数组索引为 0 的元素开始执行，则需要传递初始值。否则，数组索引为 0 的元素将被作为初始值 *initialValue*，迭代器将从第二个元素开始执行（索引为 1 而不是 0）。
>
> ```js
> Array.prototype.reduce(function(previousValue, currentValue, currentIndex, array) { /* … */ } [, initialValue])
> ```
>
> 开发者传入的reducer（callbackFn）函数会接收到四个参数：
>
> - `previousValue`：上一次调用 `callbackFn` 时的返回值。在第一次调用时，若指定了初始值 `initialValue`，其值则为 `initialValue`，否则为数组索引为 0 的元素 `array[0]`。
>
> - `currentValue`：数组中正在处理的元素。在第一次调用时，若指定了初始值 `initialValue`，其值则为数组索引为 0 的元素 `array[0]`，否则为 `array[1]`。
>
> - `currentIndex`：数组中正在处理的元素的索引。若指定了初始值 `initialValue`，则起始索引号为 0，否则从索引 1 起始。
>
> - `array`：用于遍历的数组。
>
>   
>
> `initialValue` 可选
>
> 作为第一次调用 `callback` 函数时参数 *previousValue* 的值。若指定了初始值 `initialValue`，则 `currentValue` 则将使用数组第一个元素；否则 `previousValue` 将使用数组第一个元素，而 `currentValue` 将使用数组第二个元素。



**使用reduce实现 map 和 filter** 

```js
Array.prototype.mapReduce = function (cb, initValue) {
  return this.reduce(function (mappedArray, curValue, curIndex, array) {
    mappedArray[curIndex] = cb.call(initValue, curValue, curIndex, array);
    return mappedArray;
  }, []);
};

Array.prototype.filterReduce = function (cb, initValue) {
  return this.reduce(function (mappedArray, curValue, curIndex, array) {
    if (cb.call(initValue, curValue, curIndex, array)) {
      mappedArray.push(curValue);
    }
    return mappedArray;
  }, []);
};

// 这里利用了reduce的第二个参数的初始值可以是一个“空数组”，映射或过滤后，放入“新数组”。
```





## transduce 的原理

通过 JS 中数组自带的功能方法，进一步了解 transduce 的原理。以及由 map 作为 functor 可以引申出的 monad 的概念，如何让函数间更好地进行交互。	



### map 映射和函子

函子：是一个带运算工具的**数据类型**或**数据结构值**。例如：在 JavaScript 中，字符串（string）就是一个数据类型，而数组（array）既是一个数据类型也是一个数据结构。



这是一段抽象的代码来表示一个字符串的映射函子 stringMap。

```js
stringMap( uppercaseLetter, "Hello World!" ); // HELLO WORLD!
```



这是一段抽象的代码一个数组的映射函子 arrayMap。

```js
["1","2","3","4","5"].map( unary( parseInt ) ); // [1,2,3,4,5]
```



### filter

过滤器（filter）和断言（predicate）

filter 可以是双向的，可以过滤掉（filter out）不想要的，也可以筛选出（filter in）出不想要的。在函数式编程中，断言就是一个个的筛选条件，所以在过滤器中，经常会使用断言函数。

![img](https://static001.geekbang.org/resource/image/92/8e/92dcf58f0fc6c36869183f54d3ae478e.jpeg?wh=1920x1080)



isOdd是一个用于判断是否时奇数的函数。

````js
[1,2,3,4,5].filter( isOdd ); // [1,3,5]
````



### reduce 和缩减器

缩减（reduce）主要的作用就是把列表中的值合成一个值。

![img](https://static001.geekbang.org/resource/image/87/21/8741b90f842643350d34077b9c40f721.jpeg?wh=1920x1080)



函数reduce的功能也可以用映射 map 和过滤 filter 的方法来实现。这是因为 reduce 的初始值可以是一个空数组[]，这样就可以把迭代的结果当成另一个数组了。

```js
var half = v => v / 2;
[2,4,6,8,10].map( half ); // [1,2,3,4,5]

[2,4,6,8,10].reduce(
    (list,v) => (
        list.push( half( v ) ),
        list
    ), []
); // [1,2,3,4,5]



var isEven = v => v % 2 == 0;
[1,2,3,4,5].filter( isEven ); // [2,4]

[1,2,3,4,5].reduce(
    (list,v) => (
        isEven( v ) ? list.push( v ) : undefined,
        list
    ), []
); // [2,4]
```

可以发现，这里故意利用了一个副作用。 array.push 是一个非纯函数的方法，它会改变原数组，而不是复制后修改。而如果想完全避免副作用，可以用 concat。但是， concat 虽然遵循的是纯函数、不可变的原则，但是有一点是需要注意的，就是它在面对大量的复制和修改时会产生性能上的问题。所以估计到这里，你也猜到了在上节课中提到的 transducer 的原理了。这里就是故意利用了副作用来提高性能！

这里严格来将其实并没有副作用，因为在原则上，**做的这些变化都是在函数内部的**，而前面说过，副作用一般多是来自外部。所以在这个例子中，没有必要为了几乎没有负面影响的副作用而牺牲性能。而 transducer 正是利用了副作用，才做到的性能提升。



## monad 单子

由 map 作为 functor 引申出的 monad 概念，让函数间更好地进行交互。

monad 和 functor 有什么区别呢？函子（functor）其实就是一个值和围绕值的一些功能。array.map 可以被看做是一个 functor，它有一组值，而如 map 这样的方法可以作用于数组里面的每一个值，提供了一个映射的功能。	

**monad 就是在 functor 的基础上，又增加了一些特殊功能，其中最常见的就是 chain 和应用函子（applicative)。**



### array 作为 functor

数组就是一种函子，它自带一些功能函数（原型上）。那开发者自己也可以写一个有一些自己定义的方法的函子。

可以自己写一个带有映射方法的 Just Monad，用它来包装一个值（val）。这个时候，monad 相当于是一个基于值形成的新的数据结构，这个数据结构里有 map 的方法函数。

```js
function Just(val) {
  return { map, log };

  function map(fn) {
    return Just(fn(val));
  }

  function log() {
    return `Just(${val})`;
  }
}

var A = Just(10);

var B = A.map((v) => v * 2); // 20
console.log(B.log());   // Just(20)
console.log(A.log());   // Just(10)

```

它的使用方式就类似于我们之前看到的 array.map 映射。比如在下面的例子里，我们用 map 将一个函数 v => v * 2 运用到了 Just monad 封装的值 10 上，它返回的就是 20。



### chain 作为 bind、flatMap

chain 通常又叫做 flatMap 或 bind，它的作用是 flatten 或 unwrap，也就是说它可以展开被 Just 封装的值 val。你可以使用 chain 将一个函数作用到一个包装的值上，返回一个结果值。如下代码所示：

```js
function Just(val) {
  return { map, chain };

  function map(fn) {
    return Just(fn(val));
  }

  // aka: bind, flatMap
  function chain(fn) {
    return fn(val);
  }
}
```



例子：

用 chain 方法函数把一个加一的函数作为参数运用到 monad A 上，得到了一个 15+1=16 的结果，那么之后返回的就是一个 flatten 或 unwrap 展开的 16 了。

```js
var A = Just( 15 );
var B = A.chain( v => v + 1 );

B;          // 16
typeof B;   // "number"
```





### monoid











































