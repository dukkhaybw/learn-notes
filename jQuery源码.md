# jQuery源码

prototype.js库

- 浏览器兼容
- 各种属性的获取
- 逻辑流程的控制
- 性能优化
- 设计思路和技巧

## 学前基础

- jQuery的基础运用
- API的熟悉
- js，css，js
- 常见设计模式
- 数据结构



## jquery特点

- API简洁、
- 链式调用
- 选择器强大
- 操作简单



jQuery中，整个jQuery源码包裹在一个闭包中，外部调用时向内部传入一个变量对象，内部将一个对象或函数作为外部传入的变量对象的一个属性保存，这样外部就能通过该对象或者函数调取闭包内部定义的属性或者方法了，同时避免环境变量的污染。

使用时调用jQuery( ) 或者$( ) 时，返回的是jQuery实例对象，该实例对象是一个类数组对象。对于jQuery构造函数原型上的或者函数对象的静态方法，在没有返回值时，返回的都是this（jQuery实例对象），所以可以进行链式调用。



调用jQuery函数时返回的是jQuery构造函数的实例对象，但是不同的是没有使用 new jQuery 的方式调用。由此延伸出的面试题：不用new 调用函数而创建函数的实例对象。

```js
function jQuery (name,age){
  this.name =name ;
  this.age =age;
}



解决：
function Init (name,age){
  this.name =name ;
  this.age =age;
}

Init.prototype = jQuery.prototype

function jQuery (name,age){
  return new Init(name,age)
}
```



```js
var jQuery = function (){
  return new jQuery.prototype.init()
}
jQuery.prototype  = {
  init(){
    
  }
}

jQuery.prototype.init.prototype = jQuery.prototype
```

但是通过分析new 构造函数所做的事情可以得知虽然jQuery函数不用使用new来调用，但是使用new jQuery( ) 的方式也是同样可以得到jQuery实例对象的。



## 最外层骨架

```js
(function (global, factory) { .... }(
  typeof window !== "undefined" ? window : this, 
  fucntion(window, noGlobal){
  	...
  }
)
```

```js
(function(window) {
  // jQuery 变量，用闭包避免环境污染
  var jQuery = (function() {
    var jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context, rootjQuery);
    };

    // 一些变量声明

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function(selector, context, rootjQuery) {
          // 下章会重点讨论
        }

        // 原型方法
    };

    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function() {};//已介绍

    jQuery.extend({
        // 一堆静态属性和方法
        // 用 extend 绑定，而不是直接在 jQuery 上写
    });

    return jQuery;
  })();

  // 工具方法 Utilities
  // 回调函数列表 Callbacks Object
  // 异步队列 Defferred Object
  // 浏览器功能测试 Support
  // 数据缓存 Data
  // 队列 Queue
  // 属性操作 Attributes
  // 事件系统 Events
  // 选择器 Sizzle
  // DOM遍历 Traversing
  // 样式操作 CSS（计算样式、内联样式）
  // 异步请求 Ajax
  // 动画 Effects
  // 坐标 Offset、尺寸 Dimensions

  window.jQuery = window.$ = jQuery;
})(window);
```







判断是commonJs环境还是浏览器环境：

```js
if (typeof module === "object" && typeof module.exports === "object") {
  //正对commonJs的环境判断语句和浏览器环境的判断语句，浏览器环境中有window属性
  // 会执行工厂函数并返回jQuery函数对象
  // 对于commonJs环境没有window和document对象，但是有module和module.exports对象
  // 在commonjs换进下暴露一个函数作为module.exports对象
  // 浏览器换进下没有global对象  global.document ==window.document  报错 ：global is not defined
  module.exports = global.document ?
    factory(global, true) :
  function (w) {
    if (!w.document) {
      throw new Error("jQuery requires a window with a document");
    }
    return factory(w);
  };
} else {
  factory(global);
}
```

浏览器环境下的jQuery逻辑：

```js
//global 在浏览器环境下是window对象
(function (global, factory) { 
  factory(global)
}(window , function (window, noGlobal = undefined) {  
  //真正的jquery源码部分 
}
```

再次简化：

```js
const myjQuery = function (window=window, noGlobal) {
  // noGlobal的值是 undefined
  // window的值就是window对象
  //注释说明：不能使用严格模式，Can't be in strict mode，因为有些api在严格模式下不支持，但是在jquery中使用了，如：arguments.caller.callee
	//真正的jquery源码部分
}
```



对象关系图：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/2/23/b1c453d8d3b5bddb21cddc15bc1f8af2~tplv-t2oaga2asx-watermark.awebp)



核心代码：

```js
//定义jQuery对象,所以在调用jQuery时，比如 jQuery()或者$() 时得到的返回值是一个对象，这个对象
// 实际是init函数的实例对象而非jQuery函数的实例对象
var jQuery = function (selector, context){
  return new jQuery.fn.init(selector, context);
}

// jQuery.fn表示的就是jQuery函数的圆形对象
jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    selector: "",

    // The default length of a jQuery object is 0
    length: 0,

    toArray: function () {
      return slice.call(this);  //slice开始时全局设置好的变量，等于Array.slice()
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {
      return num != null ?

        // Return just the one element from the set
        (num < 0 ? this[num + this.length] : this[num]) :

        // Return all the elements in a clean array
        slice.call(this);
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function (elems) {

      // Build a new jQuery matched element set
      var ret = jQuery.merge(this.constructor(), elems);

      // Add the old object onto the stack (as a reference)
      ret.prevObject = this;
      ret.context = this.context;

      // Return the newly-formed element set
      return ret;
    },

    // Execute a callback for every element in the matched set.
    each: function (callback) {
      return jQuery.each(this, callback);
    },

    map: function (callback) {
      return this.pushStack(jQuery.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      }));
    },

    slice: function () {
      return this.pushStack(slice.apply(this, arguments));
    },

    first: function () {
      return this.eq(0);
    },

    last: function () {
      return this.eq(-1);
    },

    eq: function (i) {
      var len = this.length,
        j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },

    end: function () {
      return this.prevObject || this.constructor();
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: deletedIds.sort,
    splice: deletedIds.splice
  };

var init = jQuery.fn.init = function (selector, context, root) {
  var match, elem;

  // HANDLE: $(""), $(null), $(undefined), $(false)
  if (!selector) {
    return this;
  }

  // init accepts an alternate rootjQuery
  // so migrate can support jQuery.sub (gh-2101)
  root = root || rootjQuery;

  // Handle HTML strings
  if (typeof selector === "string") {
    if (selector.charAt(0) === "<" &&
        selector.charAt(selector.length - 1) === ">" &&
        selector.length >= 3) {

      // Assume that strings that start and end with <> are HTML and skip the regex check
      match = [null, selector, null];

    } else {
      match = rquickExpr.exec(selector);
    }

    // Match html or make sure no context is specified for #id
    if (match && (match[1] || !context)) {

      // HANDLE: $(html) -> $(array)
      if (match[1]) {
        context = context instanceof jQuery ? context[0] : context;

        // scripts is true for back-compat
        // Intentionally let the error be thrown if parseHTML is not present
        jQuery.merge(this, jQuery.parseHTML(
          match[1],
          context && context.nodeType ? context.ownerDocument || context : document,
          true
        ));

        // HANDLE: $(html, props)
        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
          for (match in context) {

            // Properties of context are called as methods if possible
            if (jQuery.isFunction(this[match])) {
              this[match](context[match]);

              // ...and otherwise set as attributes
            } else {
              this.attr(match, context[match]);
            }
          }
        }

        return this;

        // HANDLE: $(#id)
      } else {
        elem = document.getElementById(match[2]);

        // Check parentNode to catch when Blackberry 4.6 returns
        // nodes that are no longer in the document #6963
        if (elem && elem.parentNode) {

          // Handle the case where IE and Opera return items
          // by name instead of ID
          if (elem.id !== match[2]) {
            return rootjQuery.find(selector);
          }

          // Otherwise, we inject the element directly into the jQuery object
          this.length = 1;
          this[0] = elem;
        }

        this.context = document;
        this.selector = selector;
        return this;
      }

      // HANDLE: $(expr, $(...))
    } else if (!context || context.jquery) {
      return (context || root).find(selector);

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
    } else {
      return this.constructor(context).find(selector);
    }

    // HANDLE: $(DOMElement)
  } else if (selector.nodeType) {
    this.context = this[0] = selector;
    this.length = 1;
    return this;

    // HANDLE: $(function)
    // Shortcut for document ready
  } else if (jQuery.isFunction(selector)) {
    return typeof root.ready !== "undefined" ?
      root.ready(selector) :

    // Execute immediately if ready is not present
    selector(jQuery);
  }

  if (selector.selector !== undefined) {
    this.selector = selector.selector;
    this.context = selector.context;
  }

  return jQuery.makeArray(selector, this);
};
```



## extend方法

该方法即是jQuery函数对象的静态方法，也是jQuery实例化后的对象的原型方法。这个方法更具传入的参数不同而执行不同的业务逻辑，实现不同功能。具体能力有一下几种：

- 对jQuery函数对象扩展静态的属性或方法

  ```javascript
  jQuery.extend(target);// jQuery函数对象的扩展
  ```

- jQuery实例化后的对象的原型扩展属性或者方法

- ```javascript
  jQuery().extend(target);// jQuery 的扩展
  ```

- 对目标对象和其他对象之间进行**浅拷贝**，将其他对象上的属性或方法拷贝到目标对象上

  ```javascript
  jQuery.extend(target, obj1, obj2,..);//浅拷贝 后面对象的同名属性或方法会覆盖前面的对象的属性或方法
  ```

- 对目标对象和其他对象之间进行**深拷贝**，将其他对象上的属性或方法拷贝到目标对象上

- ```javascript
  jQuery.extend(true, target, obj1, obj2,..);//深拷贝 后面对象的同名属性或方法会覆盖前面的对象的属性或方法
  ```

extend源码：

```js
jQuery.extend = jQuery.fn.extend = function () {
  var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // 判断是否为深拷贝
  if (typeof target === "boolean") {
    deep = target;

    // 参数后移
    target = arguments[i] || {};
    i++;
  }

  // 处理 target 是字符串或奇怪的情况，isFunction(target) 可以判断 target 是否为函数
  if (typeof target !== "object" && !jQuery.isFunction(target)) {
    target = {};
  }

  // 判断是否 jQuery 的扩展
  if (i === length) {
    target = this; // this 做一个标记，可以指向 jQuery，也可以指向 jQuery.fn
    i--;
  }

  for (; i < length; i++) {

    // null/undefined 判断
    if ((options = arguments[i]) != null) {

      // 这里已经统一了，无论前面函数的参数怎样，现在的任务就是 target 是目标对象，options 是被拷贝对象
      for (name in options) {
        src = target[name];
        copy = options[name];

        // 防止死循环，跳过自身情况
        if (target === copy) {
          continue;
        }

        // 深拷贝，且被拷贝对象是 object 或 array
        // 这是深拷贝的重点
        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          // 说明被拷贝对象是数组
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          // 被拷贝对象是 object
          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // 递归拷贝子属性
          target[name] = jQuery.extend(deep, clone, copy);

          // 常规变量，直接 =
        } else if (copy !== undefined) {
            target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
}
```



## jQuery.type( )

JQuery中的变量的具体引用类型判断方法。

```js
// 这个对象是用来将 toString 函数返回的字符串转成
var class2type = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regexp",
    "[object Object]": "object",
    "[object Error]": "error",
    "[object Symbol]": "symbol"
}
var toString = Object.prototype.toString;

jQuery.type = function (obj) {
    if (obj === null) {
        return obj + "";
    }
    return 
      typeof obj === "object" || typeof obj === "function" ? 
        class2type[toString.call(obj)] || "object" : 
        typeof obj;
}
```



## jQuery.isPlainObject

这个函数用来判断对象是否是一个纯粹的对象。

```js
var getProto = Object.getPrototypeOf;//获取对象的原型方法
var hasOwn = class2type.hasOwnProperty;  //判断是否是私有属性的方法
var fnToString = hasOwn.toString;   //转为字符串方法
var ObjectFunctionString = fnToString.call( Object );

jQuery.isPlainObject = function (obj) {
    var proto, Ctor;

    // 排除 underfined、null 和非 object 情况
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    proto = getProto(obj);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain if they were constructed by a global Object function
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}



jQuery.isPlainObject({});// true
jQuery.isPlainObject({ a: 1 });// true
jQuery.isPlainObject(new Object());// true

jQuery.isPlainObject([]);// false
jQuery.isPlainObject(new String('a'));// false
jQuery.isPlainObject(function(){});// false
```

Object.getPrototypeOf(object)：Object.getPrototypeOf() 方法返回指定对象的原型（内部`[[Prototype]]`属性的值）。

```js
const prototype1 = {};
const object1 = Object.create(prototype1);

console.log(Object.getPrototypeOf(object1) === prototype1);  //true
// expected output: true
```



jQuery 项目结构和模块功能：

```js
(function(window) {
  // jQuery 变量，用闭包避免环境污染
  var jQuery = (function() {
    var jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context, rootjQuery);
    };

    // 一些变量声明

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function(selector, context, rootjQuery) {
          // 下章会重点讨论
        }

        // 原型方法
    };

    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function() {};//已介绍

    jQuery.extend({
        // 一堆静态属性和方法
        // 用 extend 绑定，而不是直接在 jQuery 上写
    });

    return jQuery;
  })();

  // 工具方法 Utilities
  // 回调函数列表 Callbacks Object
  // 异步队列 Defferred Object
  // 浏览器功能测试 Support
  // 数据缓存 Data
  // 队列 Queue
  // 属性操作 Attributes
  // 事件系统 Events
  // 选择器 Sizzle
  // DOM遍历 Traversing
  // 样式操作 CSS（计算样式、内联样式）
  // 异步请求 Ajax
  // 动画 Effects
  // 坐标 Offset、尺寸 Dimensions

  window.jQuery = window.$ = jQuery;
})(window);
```









## init方法

在调用jQuery()函数后，传入jQuery函数的参数会直接传给init函数。

执行情况：

- jQuery( ) :直接返回一个空的 jQuery 对象。

- jQuery( selector [, context ] )：selector 表示一个 css 选择器，这个选择器通常是一个字符串，#id 或者 .class 等，context 表示选择范围，即限定作用，可为 DOM，jQuery 对象。

  ```html
  <body>
    <div id="app1">
      <ul>
        <li>1</li>
        <li>2</li>
        <li class="three">3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </div>
    <div id="app2">
      <ul>
        <li>1</li>
        <li>2</li>
        <li class="three">3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </div>
    <script>
      //这种情况下获取的是整个页面下的tree代表的li，一共有两个
      console.log(jQuery('.three'));
      //这种情况下获取的是app2下面的tree代表的li，就一个
      console.log(jQuery('.three', document.getElementById('app2')));
    </script>
      
  ```
  
- `jQuery( element|elements )`：用于将一个 DOM 对象或 DOM 数组封装成 jQuery 对象。

- `jQuery( jQuery object|object )`，会把普通的对象或 jQuery 对象包装在 jQuery 对象中。

- `jQuery( html [, ownerDocument ] )`，这个方法用于将 html 字符串先转成 DOM 对象后在生成 jQuery 对象。

- `jQuery( html, attributes )`，和上一个方法一样，不过会将 attributes 中的方法和属性绑定到生成的 html DOM 中，比如 class 等。

- `jQuery( callback )`，此方法接受一个回掉函数，相当于 window.onload 方法。同时回调函数中的第一参数位置会被传入jQuery构造函数对象。

  ```js
  $(function(jQuery){
    .....
  })
  
  1.$(document)   
  2.$(‘<div>’) 
  3.$(‘div’) 
  4.$(‘#test’) 
  5.$(function(){}) 
  6.$("input:radio", document.forms[0]); 
  7.$(‘input’, $(‘div’)) 
  8.$() 
  9.$("<div>", { 
           "class": "test", 
           text: "Click me!", 
           click: function(){ $(this).toggleClass("test"); } 
        }).appendTo("body"); 
  10.$($(‘.test’))
  ```

  ![image-20211104084435299](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211104084435299.png)

init源码：

```js
init: function (selector, context, root) {
  var match, elem;

  // 处理: $(""), $(null), $(undefined), $(false)
  if (!selector) {
    return this;
  }
  // rootjQuery = jQuery( document );
  root = root || rootjQuery;

  // 处理 HTML 字符串情况，包括 $("<div>")、$("#id")、$(".class")
  if (typeof selector === "string") {
    if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
      // 这个其实是强行构造了匹配 html 的情况的数组
      match = [null, selector, null];
    } else {
      match = rquickExpr.exec(selector);
    }
    // macth[1] 限定了 html，!context 对 #id 处理
    if (match && (match[1] || !context)) {

      // HANDLE: $(html) -> $(array)
      if (match[1]) {
        //排除 context 是 jQuery 对象情况
        context = context instanceof jQuery ? context[0] : context;

        // jQuery.merge 是专门针对 jQuery 合并数组的方法
        // jQuery.parseHTML 是针对 html 字符串转换成 DOM 对象
        jQuery.merge(this, jQuery.parseHTML(
          match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

        // HANDLE: $(html, props)
        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
          for (match in context) {

            // 此时的 match 非彼时的 match
            if (jQuery.isFunction(this[match])) {
              this[match](context[match]);

              // ...and otherwise set as attributes
            } else {
              this.attr(match, context[match]);
            }
          }
        }

        return this;

        // 处理 match(1) 为 underfined 但 !context 的情况
      } else {
        //传入的是id选择器时的逻辑
        elem = document.getElementById(match[2]);

        if (elem) {

          // this[0] 返回一个标准的 jQuery 对象
          this[0] = elem;
          this.length = 1;
        }
        return this;
      }
      // 处理一般的情况，find 实际上上 Sizzle，jQuery 已经将其包括进来，下章详细介绍
      // jQuery.find() 为 jQuery 的选择器，性能良好
    } else if (!context || context.jquery) {
      return (context || root).find(selector);
      // 处理 !context 情况
    } else {
      // 这里 constructor 其实是 指向 jQuery 的
      return this.constructor(context).find(selector);
    }

    // HANDLE: $(DOMElement)，处理只传入一个的原生DOM对象，直接将它专为jQuery伪数组对象后返回。
  } else if (selector.nodeType) {
    this[0] = selector;
    this.length = 1;
    return this;

    // HANDLE: $(function)
  } else if (jQuery.isFunction(selector)) {
    return root.ready !== undefined ? root.ready(selector) :

    // Execute immediately if ready is not present
    selector(jQuery);
  }

  return jQuery.makeArray(selector, this);
}
```



```js
jQuery.prototype = {
  // 简单点，假设此时 selector 用 querySelectorAll
  init: function(selector){
    var ele = document.querySelectorAll(selector);
    // 把 this 当作数组，每一项都是 DOM 对象
    for(var i = 0; i < ele.length; i++){
      this[i] = ele[i];
    }
    this.length = ele.length;
    return this;
  },
  //css 若只有一个对象，则取其第一个 DOM 对象
  //若 css 有两个参数，则对每一个 DOM 对象都设置 css
  css : function(attr,val){
    for(var i = 0; i < this.length; i++){
      if(val == undefined){
        if(typeof attr === 'object'){
          for(var key in attr){
            this.css(key, attr[key]);
          }
        }else if(typeof attr === 'string'){
          return getComputedStyle(this[i])[attr];
        }
      }else{
        this[i].style[attr] = val;
      }
    }
  },
}
```

## jQuery.find( )方法



```js
jQuery.find = function Sizzle(){...}
jQuery.fn.find = function(selector){
  ...
  //引用 jQuery.find
  jQuery.find()
  ...
}
```



## Jquery.merge( ) 方法

```js
jQuery.merge = function (first, second) {
  var len = +second.length,
    j = 0,
    i = first.length;

  for (; j < len; j++) {
    first[i++] = second[j];
  }

  first.length = i;

  return first;
}
```

 



