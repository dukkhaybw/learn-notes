# 尚硅谷——node.js

## 回顾模块化：

- CommonJS：双端模块化规范，在浏览器（借助Browserify）和服务器端都可以使用

  module.exports={xxx:xxxx}与exports.xxx=xxxx

  let { xxx, xxx } = require('xxx'):这是在结构赋值

- AMD：只在浏览器端使用（借助RequireJS）

  define(['xxx','xxx'],function(){return xxx} )

- CMD：sea.js

  define(function(require,module,exports){})

- ES6module：借助bable和Browserify

  bable可以将基本的语法转换完成，但是不能将es6的模块化语法直接转换为浏览器认识的，只能将es6的模块化语法转为commonjs的模块化语法。在使用bable进行语法转换的时候，自己必须还要安装bable-cli并在根目录下配置.bablerc文件（任务清单）

  Browserify将commonjs的模块化语法转为浏览器能识别的模块化语法

  import { xxx, xxx}  from 'xxxx':这不是结构赋值，而是语法要求这么写

bable转换语法的命令：

- bable 文件目录 -d  文件输出目录      //将文件目录下的所有js文件进行bable语法转换并输出到指定文件夹
- browserify 文件输出目录下的入口js文件  -o  输出文件的文件目录及文件名



## Node.js是一个基于Chrome V8引擎的JavaScript运行环境。

![image-20210510103539986](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210510103539986.png)

特点：

- 异步非阻塞I/O（I/O线程池），特别适用于I/O密集型应用

  i:input

  - 文件写入操作
  - 数据库的写

  o:output

  - 文件读操作
  - 数据库的读

- 有一套自己的事件循环机制

- 单线程（处理不好CPU密集型任务），跨平台

- 回调函数容易嵌套

  

![image-20210510103824747](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210510103824747.png)



## 对比node与java服务器（p5）



## node中的函数特点（p6）

node中任何一个模块（一个js文件就是一个模块）都被一个外层函数所包裹。一个js文件中的所有代码都作为该函数的函数体。如果代码想运行，那必须调用外层包裹的那个函数。

```
function (exports, require, module,__filename, __dirname){
	....
}
exports:用于支持commonjs的模块化规范的暴露语法
require:用于支持commonjs的模块化规范的引入语法
module:用于支持commonjs的模块化规范的暴露语法
__filename:指代当前运行的js文件所在磁盘的绝对路径且包含文件名
__dirname:指代当前运行的js文件所在磁盘的绝对路径，但不包含文件名
```

查看该外层函数的方式（如何在一个函数体内部输出函数本身）：

- arguments.callee.toString()

 外层函数的作用：

- 用于支持模块化语法
- 隐藏服务器内部实现，从作用域角度去看



## node中的global（p7）

浏览器端js组成：

- BOM
- DOM
- ECMAScript

node.js中的js组成：

- 没有BOM
- 没有DOM
- ECMAScript
- 没有window而用global代替



在node中禁止函数的this指向global，而是指向了一个空对象。



## node中事件循环模型（p8）

nodejs和浏览器的事件循环机制不一样，浏览器中是各个异步模块去管理异步任务，而nodejs中是借助了libuv中的事件循环机制去管理异步任务，nodejs中是分阶段去考虑异步任务。

相关api：

- clearImmediate:清空异步回调的立即执行函数
- clearInterval
- clearTimeout



- setImmediate：设置异步回调的立即执行函数
- setInterval
- setTimeout



- process.nextTick():设置异步回调的立即执行函数，但在所有的异步回调函数中优先级最高



事件循环经历阶段：

1. 第一个阶段：timers（定时器阶段——setTimeout，setInterval）

   - 对于定时器api启动定时
   - 执行定时器的回调函数
   - 可能存在定时器时间立刻完成时，本阶段还未结束的情况，所以会立即执行定时器回调函数

   

2. 第二个阶段：pending callbacks（系统阶段）

   

3. 第三阶段：idle，prepare（准备阶段）

   

4. 第四阶段：poll（轮询阶段）

   - 如果回调队列中有待执行的回调函数（除了定时器的异步回调函数的其他异步回调函数，如ajax，dom事件）
     - 从回调队列中取出函数并依次执行，直到回调队列为空
   - 如果回调队列为空
     - 如果代码中有调用过 setImmediate，则进入第五个阶段执行setImmediate设定的回调
     - 如果代码中没有调用过 setImmediate，则等待回调函数插入回调队列，同时等待期间如果第一个阶段设置的定时器到达时间，并不能这个阶段执行定时器回调函数，也是进入第五个阶段，目走完之后的阶段后回到第一阶段去执行定时器回调函数

   

5. 第五阶段：check（专门用于执行setImmediate所设置的回调）

   

6. 第六阶段：close callbacks（ 结束本轮循环阶段，开启下一轮）



## 包与包管理工具（p9）

包：包中的语法遵循CommonJS模块化规范，包将一组相关的模块组合在一起，形成一组完整的工具。包实际上就是一个压缩文件，解压后有它相对固定的目录结构。

包的组成：

- 包结构
  - bin：可执行二进制文件（可选）
  - lib：js代码（可选）
  - doc：文档（可选）
  - test：测试单元（可选）
- 包描述文件
  - package.json(必要的)







