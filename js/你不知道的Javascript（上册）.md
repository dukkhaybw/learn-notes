# 你不知道的Javascript（上册）

## 第一章 作用域

编程语言最基本的功能之一：将值储存到变量当中，并且能在之后通过变量对这个值进行访问或修改。

引入变量后需要思考的关于变量的问题：

- 程序中的变量存放在哪里的？
- 程序需要该变量存放的那个值时，如何找到该变量？

为了解决上面的疑问，就需要设计一套规则来解决解决上面的问题。

在对存放在变量中的值进行操作（访问、修改或删除）时，就需要知道存放该值的变量存放在了哪里并且该如何找到代表该值的变量。为此编程语言设计了一套良好的规则，这套规则就叫**作用域**。

### 作用域定义：

- 狭义上说作用域就是一个对象（更确切的来说应该是集合）；
- 广义上来说作用域是一套用来存储变量，并且之后可以方便的找到这些变量的规则；

### 作用域的作用：

- 作用域负责收集并维护由所有声明的**标识符**组成的一系列集合，并实施一套的规则，确定当前执行的代码对这些标识符的访问权限。（这套规则用来管理引擎如何在当前作用域以及嵌套的上层作用域中根据标识符名称进行变量查找。）



### 编译语言的原理：

传统认知：js是动态类型和解释型语言。

作者认识：它是一门编译型语言，但与传统的编译语言不同，它不是提前编译的，编译结果也不能在分布式系 统中进行移植。

**一段代码在编译型语言中执行前的三个步骤：**

1. 分词|词法分析（Tokenizing/Lexing）
   将代码字符串分解成有意义的代码块，称为词法单元（token），例如程序 var a = 2;。这段程序通常会被分解成 为下面这些词法单元：var、a、=、2 、;。

2. 解析|语法分析

   将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。称为“抽象语法树”（Abstract Syntax Tree，AST）。

   例如：var a = 2; 的抽象语法树中可能会有一个叫作 VariableDeclaration 的顶级节点，接下 来是一个叫作 Identifier（它的值是 a）的子节点，以及一个叫作 AssignmentExpression 的子节点。AssignmentExpression 节点有一个叫作 NumericLiteral（它的值是 2）的子 节点。

   

3. 代码生成（代码转为机器语言）

   将 AST 转换为可执行代码的过程。用某种方法将js代码的AST传为机器指令进行执行

   

JavaScript的编译发生在代码执行前的瞬间,**在语法分析和代码生成阶段有特定的步骤来对运行性能进行优化，包括对冗余元素进行优化等。**比如 JIT，可以延 迟编译甚至实施重编译。

在JavaScript处理一段代码时，会有以下基本部分（不仅仅只有它们）：

1. js引擎：负责整个js程序的编译及执行
2. 编译器（解释器）：在代码被js引擎执行前，负责语法解析和编译为可执行代码
3. 作用域：负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

对于一段代码，会先后经过编译器进行**编译处理**和js**引擎进行运行**处理，期间都有作用域参与。

其中编译器做的事：1. 把代码分解为词法单元；2.将词法单元分解为语法单元结构树；3.遇到变量或函数声明，先去查询同一个作用域中是否已经存在同名标识符，有则继续编译而忽略该声明，没有则创建在作用域的集合中声明一个；4.生成引擎运行时所需代码。        

 js有引擎在其中做的事：1.遇到变量就在作用域（及上层作用域）中进行左查询或右查询，找到便继续执行；没有，则根据是左查询或右查询给出不同反馈（自动创建或报错）。





例子

编译器对var a = 2;的解析过程：

- 将该语句分解成词法单元
- 将词法单元解析成一个树结构
- 编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作 用域的集合中声明一个新的变量，并命名为 a。
- 编译器会为引擎生成运行时所需的代码，这些代码被用来处理 a = 2 这个赋值操作。

js引擎对var a = 2;的执行过程：

- 引擎运行时会首先询问作用域，在当前的作用域集合中是否存在一个叫作 a 的 变量。如果是，引擎就会使用这个变量；如果否，引擎会继续沿着作用域链向上查找该变量。
- 如果引擎最终找到了 a 变量，就会将 2 赋值给它。否则引擎就会举手示意并抛出一个异常
- js引擎在作用域的协助下进行变量的查找，js引擎查找变量有两种方式 ，找到与否的给出的反馈是不同的。
  - 左查询
  - 右查询



总结：**变量的赋值操作会执行两个动作，首先编译器会在当前作用域中声明一个变量（如 果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值。**



### 左查询与右查询（都由js引擎去查询）：

​		左右的区分一般是一个赋值操作的左侧和右侧。当变量出现在赋值操作的左侧时进行 LHS 查询，出现在右侧时进行 RHS 查询。RHS 并不是真正意义上的“赋值操作的右侧”，更准确地说是“非左侧”。对于右查询，本质是希望找到变量中对应的值；对于左查询，本质是希望找到变量这个容器，至于它内部是否有值并不重要。



​		在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行 为是不一样的。



​		如果 RHS 查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出 ReferenceError 异常。如果 RHS 查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作， 比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的 属性，那么引擎会抛出另外一种类型的异常，叫作 TypeError。

​		当引擎执行 LHS 查询时，如果在顶层（全局作用域）中也无法找到目标变量， 全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是程序运行在非 “严格模式”下。在 严格模式中 LHS 查询失败时，并不会创建并返回一个全局变量，引擎会抛出同 RHS 查询失败时类似的 ReferenceError 异常。



注意：

其实function foo(a) {...}形式   和 var foo ＝ function(a) {...} 是不同的，后者能被js引擎执行一次左查询，而前者不会。编译器可以在代码生成的同时处理声明和值 的定义，比如在引擎执行代码时，并不会有线程专门用来将一个函数值“分 配给”foo。因此，将函数声明理解成前面讨论的 LHS 查询和赋值的形式并 不合适。



### 作用域嵌套

当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量， 或抵达最外层的作用域（也就是全局作用域）为止。







## 第二章 词法作用域



作用域工作模型：

- 词法作用域（主要采用）
- 动态作用域

词法作用域就是在词法阶段定义的作用域。在开发者写代码时，书写变量或者函数的位置所决定的。

#### 标识符的查找机制：

​		作用域查找会在找到第一个匹配的标识符时停止。在多层的嵌套作用域中可以定义同名的 标识符，这叫作“遮蔽效应”（内部的标识符“遮蔽”了外部的标识符）。抛开遮蔽效应， 作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见 第一个匹配的标识符为止。

#### 上下文

代码（全局代码，函数体，eval代码）执行前的准备工作：

- 对于函数，参数赋值,arguments 赋值；
- 提升（变量 函数 函数表达式）；
- 确定this指向；
- 与对应作用域关联；

一个作用域下可能包含若干个上下文环境。有可能从来没有过上下文环境（函数从来就没有被调用过）； 有可能有过，现在函数被调用完毕后，上下文环境被销毁了；



​		**无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处 的位置决定。**



```javascript
var a = 'asd'
function bar() {
    console.log(a);
}
function foo() {
    var a = 2;
    bar()
}
foo()
```

​		词法作用域查找只会查找**一级标识符**，比如 a、b 和 c。如果代码中引用了 foo.bar.baz， 词法作用域查找只会试图查找 foo 标识符，找到这个变量后，**对象属性访问规则**会分别接 管对 bar 和 baz 属性的访问（原型链）。

#### 扩展作用的情况：（扩展词法作用域会导致性能下降）

1. eval (“可执行的js代码字符串”) ，写在eval（）内的字符串代码就等价与写源码时直接在eval的位置加上和字符串一样的js代码（非严格模式下）；**在严格模式下**，eval（）有自己作用域，它内部可以访问外部的标识符，而外部不能访问它内部的，同时，它内部的标识符也不能作用到外部。

   ```js
   function foo(str, a) {
       eval( str ); // 欺骗！
       console.log( a, b );
   }
   var b = 2;
   foo( "var b = 3;", 1 ); // 1, 3
   
   
   
   function foo(str) {
       "use strict";
       eval( str );
       console.log( a ); // ReferenceError: a is not defined
   }
   foo( "var a = 2" );
   ```

   

   

2. with通常被当作重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身。

   ```js
   var obj = {
       a: 1,
       b: 2,
       c: 3
   };
   // 单调乏味的重复 "obj"
   obj.a = 2;
   obj.b = 3;
   obj.c = 4;
   // 简单的快捷方式
   with (obj) {
       a = 3;
       b = 4;
       c = 5;
   }
   
   
   function foo(obj) {
       with (obj) {
           a = 2;
       }
   }
   var o1 = {
       a: 3
   };
   var o2 = {
       b: 3
   };
   foo( o1 );
   console.log( o1.a ); // 2
   foo( o2 );
   console.log( o2.a ); // undefined
   console.log( a ); // 2——不好，a 被泄漏到全局作用域上了！
   ```

   with 块可以将一个对象处理为词法作用域。但是这个块内部正常的 var 声明并不会被限制在这个块的作用域中，而是被添加到 with 所处的函数作用域中。

JavaScript 引擎会在编译阶段进行数项的性能优化。其中有些优化依赖于能够根据代码的 词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到 标识符。但如果引擎在代码中发现了 eval(..) 或 with，它只能简单地假设关于标识符位置的判断 都是无效的，因为无法在词法分析阶段明确知道 eval(..) 会接收到什么代码，这些代码会 如何对作用域进行修改，也无法知道传递给 with 用来创建新词法作用域的对象的内容到底 是什么。







## 第三章 函数与块作用域

作用域中包含了标识符（变量、函数）的定义。作用域排列的结构是在写代码时就定义下来的。

新的作用域是如何产生的？

能产生新作用域的情况有哪些？



产生新作用域的情况：

1. 每声明 一个函数都会为其自身创建一个作用域

```javascript
 function foo() {
      var a = 2
      var b = 8
      function bar() {
        console.log(c, b);   
      }
      bar()
      var c = 9
    } 
    foo()     //输出 undefined   8
```

函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）。



​	在编写代码时，可以将所有代码（如变量声明赋值、函数定义、对象的定义）都写在一个作用域（往往是全局作用域）下。但是更好的做法是，将一些声明与定义放在某些函数内部，让其只在函数作用域内有效，以实现对代码的内部隐藏，同时也有效的避免了命名冲突（最小暴露原则）。因为同一作用域下，如果两个标识符可能具有相同的名字但用途却不一样，无意间可能造成命名冲突。冲突会导致 变量的值被意外覆盖。

​	第三方库为了避免命名冲突，通常会在全局作用域中声明一个名字足够独特的变量，通常是一个对象。这个对象 被用作库的命名空间，所有需要暴露给外界的功能都会成为这个对象（命名空间）的属 性，而不是将自己的标识符暴漏在顶级的词法作用域中。



​	用函数声明式的方式去封装一组代码存在的不足：

1. 函数名本身就污染了全局作用域；

2. 必须主动调用，该函数才能运行其中的代码

   为此，可以使用函数自调用的函数去弥补。

自调用函数（IIFE）可以匿名也可以具名：

```javascript
匿名：
(function() {
console.log("I waited 1 second!");
})()
匿名的不足：
1. 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
2. 如果没有函数名，当函数需要引用自身时只能使用已经过期的 arguments.callee 引用，
比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑
自身。
3. 匿名函数省略了对于代码可读性 / 可理解性很重要的函数名。一个描述性的名称可以让
代码不言自明。


具名（建议使用）：
(function timeoutHandler() { 
console.log( "I waited 1 second!" );
})()
```

IIFE 的另一个非常普遍的用法是把它们当作函数调用并传递参数进去。

```javascript
var a = 2;
(function IIFE( global ) {
var a = 3;
console.log( a ); // 3
console.log( global.a ); // 2
})( window );
console.log( a ); // 2
```

另外一个应用场景是解决 undefined 标识符的默认值被错误覆盖导致的异常（虽 然不常见）。将一个参数命名为 undefined，但是在对应的位置不传入任何值，这样就可以 保证在代码块中 undefined 标识符的值真的是 undefined：(jQuery中就做了这种处理)

```javascript
undefined = true; // 给其他代码挖了一个大坑！绝对不要这样做！  
(function IIFE( undefined ) {
var a;
if (a === undefined) {
console.log( "Undefined is safe here!" );
}
})();
```



2. 块级作用域

   出现块级作用的地方：

   1. with语句
   
   2. try/catch的catch 分句会创建一个块作 用域，其中声明的变量仅在 catch 内部有效

      ```js
      try {
          undefined(); // 执行一个非法操作来强制制造一个异常
      }
      catch (err) {
          console.log( err ); // 能够正常执行！
      }
      console.log( err ); // ReferenceError: err not found
      ```
   
   3. let、const 关键字可以将变量绑定到所在的任意作用域中（通常是 { .. } 内部）
   
   块级作用的优势：
   
   1. 防止变量泄露污染全局
   2. 有利于垃圾回收

## 第四章 提升

​	js引擎会在运行 JavaScript 代码之前，首先通过编译器对其进行编译。编译阶段中的一部分工作就是找到所有的 声明，并用合适的作用域将它们关联起来。所以，**包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理**。

​	当看到 var a = 2; 时，可能会认为这是一个声明。但 JavaScript 实际上会将其看成两个 声明：var a; 和 a = 2;。**第一个定义声明是在编译阶段进行的**。**第二个赋值声明会被留在原地等待执行阶段**。这个过程就好像变量和函数声明从它们在代码中出现的位置被“移动” 到了最上面。这个过程就叫作提升。**只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。**

​	每个作用域都会进行提升操作。**函数声明会被提升，但是函数表达式却不会被提升。**



```js
foo(); // TypeError
bar(); // ReferenceError
var foo = function bar() {
    // ...
};

等价于：
var foo;
foo(); // TypeError
bar(); // ReferenceError
foo = function() {
    var bar = ...self...
    // ...
}
```



### 函数优先

同一个作用域下面，函数会首先被提升，然后才是变量。

```javascript
foo(); // 1
var foo;
function foo() {
    console.log( 1 );
}
foo = function() {
    console.log( 2 );
};

等价于：
function foo() {
    console.log( 1 );
}
foo(); // 1
foo = function() {
    console.log( 2 );
};

注意，var foo 尽管出现在 function foo()... 的声明之前，但它是重复的声明（因此被忽
略了），因为函数声明会被提升到普通变量之前。


尽管重复的 var 声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的。
foo(); // 3
function foo() {
    console.log( 1 );
}
var foo = function() {
    console.log( 2 );
};
function foo() {
    console.log( 3 );
}



一个普通块内部的函数声明通常会被提升到所在作用域的顶部，这个过程不会像下面的代
码暗示的那样可以被条件判断所控制：
foo(); // "b"
var a = true;
if (a) {
    function foo() { console.log("a"); }
}
else {
    function foo() { console.log("b"); }
}
```





## 第五章 闭包

闭包是**基于词法作用域**书写代码时所产生的自然结果。当**一个函数可以记住并访问该函数自己所在的词法作用域**时，就产生了闭包，而且不必在意该函数的执行位置。

```js
function foo() {
    var a = 2;
    function bar() {
        console.log( a );
    }
    return bar;
}
var baz = foo();
baz(); // 2 

函数 bar() 的词法作用域能够访问 foo() 的内部作用域。 foo() 执行后，通常会期待 foo() 的整个内部作用域都被销毁，闭包则是可以阻止这件事情的发生。事实上内部作用域依然存在，因此没有被回收。因为bar() 本身在使用。

这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域。


function wait(message) {
    setTimeout( function timer() {
        console.log( message );
    }, 1000 );
}
wait( "Hello, closure!" );
```







# 第二部分

## this

this被自动定义在所有函数的作用域中。

- 每个函数作用域内都会自动定义一个 this 以指向某个对象引用

- this 不指向函数自身

  ```js
  function foo(num) {
      console.log( "foo: " + num );
      // 记录 foo 被调用的次数
      this.count++;
  }
  foo.count = 0;
  var i;
  for (i=0; i<10; i++) {
      if (i > 5) {
          foo( i );
      }
  }
  console.log( foo.count ); // 0
  ```

  

  函数在自身内部调用自己，可能的目的是----递归或者事件处理函数自解绑

  函数（具名或匿名）内，argument.callee属性指向函数自身

- **this 不一定是指向函数的作用域**

- this只用在函数被调用时才能确定指向的对象引用，与函数声明的位置没有任何关系

- 确定 this 指向的关键在于确定函数调用的方式



```js
function foo() {
    var a = 2;
    this.bar();   //undefined
}
function bar() {
    console.log( this.a );   //undefined
}
foo();
```

当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包 含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this 就是记录的 其中一个属性，会在函数执行的过程中用到。





调用栈:为了到达当前执行位置所调用的所有函数。

调用位置：就在当前正在执行的函数的前一个调用中。



this的几种绑定方式：

- 默认绑定，独立函数被调用时绑定方式，函数内部没开启严格模式时，this 指向全局对象，如果开启严格模式则this指的是undefined

  注意：对于默认绑定来说，决定 this 绑定对象的并不是调用位置是否处于严格模式，而是 函数体是否处于严格模式。如果函数体处于严格模式，this 会被绑定到 undefined，否则 this 会被绑定到全局对象。

  

- 隐式绑定，函数作为某个对象的属性被调用时绑定方式，this指向该对象实例。隐式绑定常常出现的情况：被隐式绑定的函数会丢失绑定对象，而采用默认绑定

- 显示绑定，使用函数的call，apply，方法改变this指向

- 硬绑定，bing ( )

  ```js
  function foo() {
      console.log( this.a );
  }
  var obj = {
      a:2
  };
  var bar = function() {  //包裹函数
      foo.call( obj );
  };
  bar(); // 2
  setTimeout( bar, 100 ); // 2
  // 硬绑定的 bar 不可能再修改它的 this
  bar.call( window ); // 2
  
  
  
  function bind(fn, obj) {
      return function() {
          return fn.apply( obj, arguments );
      };
  }
  ```

- new绑定

  

new 构造函数( ) 时发生的操作：

1. 创建（或者说构造）一个全新的对象
2. 这个新对象会被执行 [[ 原型 ]] 连接
3. 这个新对象会绑定到函数调用的 this
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象



### 确定this指向的四种情况（从上到下优先级递减）：

- 函数是否在 new 中调用（new 绑定）？如果是的话 this 绑定的是新创建的对象。

- 函数是否通过 call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。

- 函数是否在某个上下文对象中调用（隐式绑定），即函数是否是以某个对象的方法名进行调用？如果是的话，this 绑定的是那个上 下文对象。

- 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。

  

- 如果把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值 在调用时会被忽略，实际应用的是默认绑定规则。

- 传入 null 常见的做法是使用 apply(..) 来“展开”一个数组，并当作参数传入一个函数。

- bind(..) 的功能之一就是可以把除了第一个 参数（第一个参数用于绑定 this）之外的其他参数都传给下层的函数（这种技术称为“部 分应用”，是“柯里化”的一种）。

  > 在 JavaScript 中创建一个空对象最简单的方法都是 Object.create(null) 。Object.create(null) 和 {} 很 像， 但 是 并 不 会 创 建 Object. prototype 这个委托，所以它比 {}更空. 



MDN上提供的模拟bind方法的代码：

```js
if (!Function.prototype.bind) {  //判断环境是否支持bind，不支持才继续往里走
    Function.prototype.bind = function(oThis) {  
        if (typeof this !== "function") {   //判断是否是通过函数.bind的方式调用的，不是则报错
            // 与 ECMAScript 5 最接近的
            // 内部 IsCallable 函数
            throw new TypeError(
                "Function.prototype.bind - what is trying " +
                "to be bound is not callable"
            );
        }
        //截取出在调用bind方法时，第二个实参及其后面的内容
        var aArgs = Array.prototype.slice.call( arguments, 1 ), 
            fToBind = this,  //函数本身
            fNOP = function(){},   //一个函数
            fBound = function(){  //定义一个函数
                return fToBind.apply(
                    (
                        this instanceof fNOP &&
                        oThis ? this : oThis   //这段代码会判断硬绑定函数是否是被 new 调用，如果是的话就会使用新创建的 this 替换硬绑定的 this
                    ),
                    aArgs.concat(
                        Array.prototype.slice.call( arguments ) 
                    );  //拼接bind时传入的实参和调用fBound时传入的实参
            }
        fNOP.prototype = this.prototype;   
        fBound.prototype = new fNOP();
        return fBound;
    };
}
```



注意：

如果把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值 在调用时会被忽略，实际应用的是默认绑定规则，this指向window。

建议使用：`xxx.apply(Object.create(null),[xxx,x,xxx,xxx])`

显示绑定传入null等的可能目的：

- 使用 apply(..) 来“展开”一个数组

- 函数柯里化

  ```js
  function foo(a,b) {
      console.log( "a:" + a + ", b:" + b );
  }
  // 使用 bind(..) 进行柯里化
  var bar = foo.bind( null, 2 );
  bar( 3 ); // a:2, b:3
  ```



软绑定：

```js
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = [].slice.call( arguments, 1 );
        var bound = function() {
            return fn.apply(
                (!this || this === (window || global)) ?
                obj : this
                curried.concat.apply( curried, arguments )
            );
        };
        bound.prototype = Object.create( fn.prototype );
        return bound;
    };
}

它会对指定的函数进行封装，首先检查调用时的 this，如果 this 绑定到全局对象或者 undefined，那就把
指定的默认对象 obj 绑定到 this，否则不会修改 this。此外，这段代码还支持可选的柯里化
```

箭头函数的this：

箭头函数不使用 this 的四种标准规则，而是根据外层（函数或者全局）作用域来决 定 this。

```js
模拟箭头函数的代码：
function foo() {
    var self = this; // lexical capture of this
    setTimeout( function(){
        console.log( self.a );
    }, 100 );
}
var obj = {
    a: 2
};
foo.call( obj ); // 2
```



## 对象

定义方式：

- 声明式

  ```
  var obj ={
  	key:value,
  	...
  }
  ```

- 构造式

  ```
  var obj = new Object()
  obj.key = value
  ```

函数是可调用的对象。

可计算属性名：

```js
var prefix = "foo";
var myObject = {
[prefix + "bar"]:"hello",
[prefix + "baz"]: "world"
};
myObject["foobar"]; // hello
myObject["foobaz"]; // world
```















