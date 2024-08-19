# jQuery 源码

prototype.js 库

- 浏览器兼容
- 各种属性的获取
- 逻辑流程的控制
- 性能优化
- 设计思路和技巧

## 学前基础

- jQuery 的基础运用
- API 的熟悉
- js，css，js
- 常见设计模式
- 数据结构

## jquery 特点

- API 简洁、
- 链式调用
- 选择器强大
- 操作简单

jQuery 中，整个 jQuery 源码包裹在一个闭包中，外部调用时向内部传入一个变量对象，内部将一个对象或函数作为外部传入的变量对象的一个属性保存，这样外部就能通过该对象或者函数调取闭包内部定义的属性或者方法了，同时避免环境变量的污染。

使用时调用 jQuery( ) 或者$( ) 时，返回的是 jQuery 实例对象，该实例对象是一个类数组对象。对于 jQuery 构造函数原型上的或者函数对象的静态方法，在没有返回值时，返回的都是 this（jQuery 实例对象），所以可以进行链式调用。

调用 jQuery 函数时返回的是 jQuery 构造函数的实例对象，但是不同的是没有使用 new jQuery 的方式调用。由此延伸出的面试题：不用 new 调用函数而创建函数的实例对象。

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
var jQuery = function () {
  return new jQuery.prototype.init();
};
jQuery.prototype = {
  init() {}
};

jQuery.prototype.init.prototype = jQuery.prototype;
```

但是通过分析 new 构造函数所做的事情可以得知虽然 jQuery 函数不用使用 new 来调用，但是使用 new jQuery( ) 的方式也是同样可以得到 jQuery 实例对象的。

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
(function (window) {
  // jQuery 变量，用闭包避免环境污染
  var jQuery = (function () {
    var jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context, rootjQuery);
    };

    // 一些变量声明

    jQuery.fn = jQuery.prototype = {
      constructor: jQuery,
      init: function (selector, context, rootjQuery) {
        // 下章会重点讨论
      }

      // 原型方法
    };

    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function () {}; //已介绍

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

判断是 commonJs 环境还是浏览器环境：

```js
if (typeof module === 'object' && typeof module.exports === 'object') {
  //正对commonJs的环境判断语句和浏览器环境的判断语句，浏览器环境中有window属性
  // 会执行工厂函数并返回jQuery函数对象
  // 对于commonJs环境没有window和document对象，但是有module和module.exports对象
  // 在commonjs换进下暴露一个函数作为module.exports对象
  // 浏览器换进下没有global对象  global.document ==window.document  报错 ：global is not defined
  module.exports = global.document
    ? factory(global, true)
    : function (w) {
        if (!w.document) {
          throw new Error('jQuery requires a window with a document');
        }
        return factory(w);
      };
} else {
  factory(global);
}
```

浏览器环境下的 jQuery 逻辑：

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
const myjQuery = function (window = window, noGlobal) {
  // noGlobal的值是 undefined
  // window的值就是window对象
  //注释说明：不能使用严格模式，Can't be in strict mode，因为有些api在严格模式下不支持，但是在jquery中使用了，如：arguments.caller.callee
  //真正的jquery源码部分
};
```

对象关系图：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/2/23/b1c453d8d3b5bddb21cddc15bc1f8af2~tplv-t2oaga2asx-watermark.awebp)

核心代码：

```js
//定义jQuery对象,所以在调用jQuery时，比如 jQuery()或者$() 时得到的返回值是一个对象，这个对象
// 实际是init函数的实例对象而非jQuery函数的实例对象
var jQuery = function (selector, context) {
  return new jQuery.fn.init(selector, context);
};

// jQuery.fn表示的就是jQuery函数的圆形对象
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  selector: '',

  // The default length of a jQuery object is 0
  length: 0,

  toArray: function () {
    return slice.call(this); //slice开始时全局设置好的变量，等于Array.slice()
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function (num) {
    return num != null
      ? // Return just the one element from the set
        num < 0
        ? this[num + this.length]
        : this[num]
      : // Return all the elements in a clean array
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
    return this.pushStack(
      jQuery.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      })
    );
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

var init = (jQuery.fn.init = function (selector, context, root) {
  var match, elem;

  // HANDLE: $(""), $(null), $(undefined), $(false)
  if (!selector) {
    return this;
  }

  // init accepts an alternate rootjQuery
  // so migrate can support jQuery.sub (gh-2101)
  root = root || rootjQuery;

  // Handle HTML strings
  if (typeof selector === 'string') {
    if (
      selector.charAt(0) === '<' &&
      selector.charAt(selector.length - 1) === '>' &&
      selector.length >= 3
    ) {
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
        jQuery.merge(
          this,
          jQuery.parseHTML(
            match[1],
            context && context.nodeType ? context.ownerDocument || context : document,
            true
          )
        );

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
    return typeof root.ready !== 'undefined'
      ? root.ready(selector)
      : // Execute immediately if ready is not present
        selector(jQuery);
  }

  if (selector.selector !== undefined) {
    this.selector = selector.selector;
    this.context = selector.context;
  }

  return jQuery.makeArray(selector, this);
});
```

## extend 方法

该方法即是 jQuery 函数对象的静态方法，也是 jQuery 实例化后的对象的原型方法。这个方法更具传入的参数不同而执行不同的业务逻辑，实现不同功能。具体能力有一下几种：

- 对 jQuery 函数对象扩展静态的属性或方法

  ```javascript
  jQuery.extend(target); // jQuery函数对象的扩展
  ```

- jQuery 实例化后的对象的原型扩展属性或者方法

- ```javascript
  jQuery().extend(target); // jQuery 的扩展
  ```

- 对目标对象和其他对象之间进行**浅拷贝**，将其他对象上的属性或方法拷贝到目标对象上

  ```javascript
  jQuery.extend(target, obj1, obj2,..);//浅拷贝 后面对象的同名属性或方法会覆盖前面的对象的属性或方法
  ```

- 对目标对象和其他对象之间进行**深拷贝**，将其他对象上的属性或方法拷贝到目标对象上

- ```javascript
  jQuery.extend(true, target, obj1, obj2,..);//深拷贝 后面对象的同名属性或方法会覆盖前面的对象的属性或方法
  ```

extend 源码：

```js
jQuery.extend = jQuery.fn.extend = function () {
  var options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // 判断是否为深拷贝
  if (typeof target === 'boolean') {
    deep = target;

    // 参数后移
    target = arguments[i] || {};
    i++;
  }

  // 处理 target 是字符串或奇怪的情况，isFunction(target) 可以判断 target 是否为函数
  if (typeof target !== 'object' && !jQuery.isFunction(target)) {
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
};
```

## jQuery.type( )

JQuery 中的变量的具体引用类型判断方法。

```js
// 这个对象是用来将 toString 函数返回的字符串转成
var class2type = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Object]': 'object',
  '[object Error]': 'error',
  '[object Symbol]': 'symbol'
};
var toString = Object.prototype.toString;

jQuery.type = function (obj) {
  if (obj === null) {
    return obj + '';
  }
  return;
  typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj;
};
```

## jQuery.isPlainObject

这个函数用来判断对象是否是一个纯粹的对象。

```js
var getProto = Object.getPrototypeOf; //获取对象的原型方法
var hasOwn = class2type.hasOwnProperty; //判断是否是私有属性的方法
var fnToString = hasOwn.toString; //转为字符串方法
var ObjectFunctionString = fnToString.call(Object);

jQuery.isPlainObject = function (obj) {
  var proto, Ctor;

  // 排除 underfined、null 和非 object 情况
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  proto = getProto(obj);

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true;
  }

  // Objects with prototype are plain if they were constructed by a global Object function
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
};

jQuery.isPlainObject({}); // true
jQuery.isPlainObject({ a: 1 }); // true
jQuery.isPlainObject(new Object()); // true

jQuery.isPlainObject([]); // false
jQuery.isPlainObject(new String('a')); // false
jQuery.isPlainObject(function () {}); // false
```

Object.getPrototypeOf(object)：Object.getPrototypeOf() 方法返回指定对象的原型（内部`[[Prototype]]`属性的值）。

```js
const prototype1 = {};
const object1 = Object.create(prototype1);

console.log(Object.getPrototypeOf(object1) === prototype1); //true
// expected output: true
```

jQuery 项目结构和模块功能：

```js
(function (window) {
  // jQuery 变量，用闭包避免环境污染
  var jQuery = (function () {
    var jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context, rootjQuery);
    };

    // 一些变量声明

    jQuery.fn = jQuery.prototype = {
      constructor: jQuery,
      init: function (selector, context, rootjQuery) {
        // 下章会重点讨论
      }

      // 原型方法
    };

    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function () {}; //已介绍

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

## init 方法

在调用 jQuery()函数后，传入 jQuery 函数的参数会直接传给 init 函数。

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
  </body>
  ```

- `jQuery( element|elements )`：用于将一个 DOM 对象或 DOM 数组封装成 jQuery 对象。

- `jQuery( jQuery object|object )`，会把普通的对象或 jQuery 对象包装在 jQuery 对象中。

- `jQuery( html [, ownerDocument ] )`，这个方法用于将 html 字符串先转成 DOM 对象后在生成 jQuery 对象。

- `jQuery( html, attributes )`，和上一个方法一样，不过会将 attributes 中的方法和属性绑定到生成的 html DOM 中，比如 class 等。

- `jQuery( callback )`，此方法接受一个回掉函数，相当于 window.onload 方法。同时回调函数中的第一参数位置会被传入 jQuery 构造函数对象。

  ```js
  $(function(jQuery){
    .....
  })
  
  1.$(document)
  2.$('<div>')
  3.$('div')
  4.$('#test')
  5.$(function(){})
  6.$("input:radio", document.forms[0]);
  7.$('input', $('div'))
  8.$()
  9.$("<div>", {
           "class": "test",
           text: "Click me!",
           click: function(){ $(this).toggleClass("test"); }
        }).appendTo("body");
  10.$($(‘.test’))
  ```

  ![image-20211104084435299](.\typora-user-images\image-20211104084435299.png)

init 源码：

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
  init: function (selector) {
    var ele = document.querySelectorAll(selector);
    // 把 this 当作数组，每一项都是 DOM 对象
    for (var i = 0; i < ele.length; i++) {
      this[i] = ele[i];
    }
    this.length = ele.length;
    return this;
  },
  //css 若只有一个对象，则取其第一个 DOM 对象
  //若 css 有两个参数，则对每一个 DOM 对象都设置 css
  css: function (attr, val) {
    for (var i = 0; i < this.length; i++) {
      if (val == undefined) {
        if (typeof attr === 'object') {
          for (var key in attr) {
            this.css(key, attr[key]);
          }
        } else if (typeof attr === 'string') {
          return getComputedStyle(this[i])[attr];
        }
      } else {
        this[i].style[attr] = val;
      }
    }
  }
};
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
};
```















jQuery 与 $( )  的区别

extend原理

插件扩展原理

$.fn.abc = function () { }



2.0.3版本源码

​		IIFE内部：

- 21-94：定义一些变量和函数

- 96-283：给jQuery函数对象和jQuery构造函数的原型上添加一些列的方法

  ```js
  jQuery.fn = jQuery.prototype = {
  	jQuery:版本
  	constructor:修正constructor指向
  	init(){...}:初始化和参数管理
  	init(selector, context, ){
  		var match,elem
  		if(!selector){
  			return this
  		}
  		if(typeof selector === 'string'){
  			if(selector.charAt(0) === '<' && selector.charAt(selector.length-1) ==='>' && selector.length>=3){
  				match = [null, selector, null]
  			}else{
  				match = rquickExpr.exec(selector)  //匹配$('<li>')，$('#box')这种情况
  			}
  		}
  	}
  }
  
  
  在jQuery中jQuery()或者$()可以接受的参数类型：
  $('')、$(null)、$(undefined)、$(false)
  
  $('#box')、$('div')、$('.container')、$('#box ul li.active')
  $('<li>asd</li><li>asd</li>')
  $('<li>')
  
  $(document.getElemtById('#box'))
  
  $(function($){ .... })
  
  
  $('<li>',{title:'world',html:'abcd'}).appendTo(document.body)//只针对单标签
  ```

  

- 285-347：定义了jQuery中的extend函数（继承方法），处于对整个库的可扩展性考虑

- 349-817：向jQuery构造函数上扩展一些工具方法，这些方法既可以给原生js对象使用，也可以给jQuery实例对象使用，而原型上的方法只能给jQuery实例对象使用。在jQuery中往往原型上的方法调取的就是构造函数上的静态方法。

- 877-2856：核心简单和复杂选择器的工具库（sizzle.js，可以单独使用）

- 2880-3042：jQuery中的回调对象（Callbacks），用于统一管理函数

  ```
  function fun1 (){
  	....
  }
  function fun2 (){
  	....
  }
  let $cb = $.Callbacks()
  $cb.add(fun1)
  $cb.add(fun2)
  $cb.fire()
  
  $cd.remove(hun2)
  $cb.fire()
  ```

- 3043-3183：实现延迟对象（Deferred），用于对异步函数进行统一管理

  ```
  setTimeout(function(){
  	alert(1)
  },1000)
  alert(2)
  
  改写为：内部实现是事件发布订阅模式
  
  let $dfd = $.Deferred()
  setTimeout(function(){
  	alert(1)
  	$dfd.resolve()
  },1000)
  $dfd.done(function(){
  	alert(2)
  })
  ```

- 3184-3295：功能检测不同的浏览器能否使用某个功能（support）

- 3308-3652：数据缓存（data）

  ```
  $('#div1').data('name','jack')
  $('#div1').data('name')
  ```

- 3653-3797：实现队列管理（queue），在动画中常用

- 3803-4299：对元素对象的标签属性的操作方法的定义，arre( ), prop( ), val( ), addClass( )等

- 4300-5128：事件操作的相关方法

- 5140-6057：DOM元素的增删改查，包装和筛选

- 6058-6620：元素样式的操作方法的定义，如css( )

- 6621-7854：Ajax封装，ajax( ), load( ) ,  getJson( )

- 7855-8584：动画（animate( ) ）

- 8585-8792：定义元素的位置和尺寸的一系列方法

- 8804-8821：jQuery中支持模块化的模式

- 8826：对外暴露jQuery对象





```
(function(window,undefined){
	
	jQuery是以面向对象的思想进行编写的
	
	sizzle.js是jQuery中关于选择器的核心模块
	
	jQuery = function ( selector, context ) {
		return new jQuery.fn.init( selector, context, rootjQuery )
	}
	
	window.jQuery = window.$ = jQuery
})(window)
//IIFE，私有化内部变量和方法，避免命名冲突。
传入window可以提升变量的查找速度（不用沿着作用域链找到最顶层）和有利于后期代码压缩；
undefined属于window对象的一个属性，它不是关键字或者保留字，所以undefined可以某些浏览器下（ie7，8等）在外部被修改， 而jQuery则是为了避免这种被修改的情况的带来的影响。
```

```
变量：
var rootjQuery    //rootjQuery就是全局的document，这样做后，代码能压缩，并且利于后期识别该变量代表什么
...

rootjQuery = jQuery(document)
```

扩展：xss攻击可以通过hash值的形式进行

### jQuery源码骨架

````javascript
(function (window, noGlobal){
    var version = "1.11.3",
        // Define a local copy of jQuery
        jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            // Need init if jQuery is called (just allow error to be thrown if not included)
            return new jQuery.fn.init( selector, context );   
            //在库的外部调用jQuery()或者$(),其实得到的是init构造函数的实例，也相当于创建了jQuery的实例，可以调用jQuery原型上的方法
            //注意这里，它并没有通过 new 的方式来调用jQuery。
        },

        //jQuery.fn就是jQuery.prototype，这些jQuery原型上的属性或方法都是提供给jQuery的实例使用的。
        jQuery.fn = jQuery.prototype = {
            // The current version of jQuery being used
            jquery: version,

            constructor: jQuery,   //将jQuery构造函数的原型完全重写了，导致新的原型对象上没有constructor，但是Object.prototype上有且指向Object，所以这步骤是对原型中constructor的修复。

            // Start with an empty selector
            selector: "",

            // The default length of a jQuery object is 0
            length: 0,

            toArray: function() {
                return slice.call( this );
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function( num ) {
                return num != null ?

                    // Return just the one element from the set
                    ( num < 0 ? this[ num + this.length ] : this[ num ] ) :

                // Return all the elements in a clean array
                slice.call( this );
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function( elems ) {

                // Build a new jQuery matched element set
                var ret = jQuery.merge( this.constructor(), elems );

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;
                ret.context = this.context;

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function( callback, args ) {
                return jQuery.each( this, callback, args );
            },

            map: function( callback ) {
                return this.pushStack( jQuery.map(this, function( elem, i ) {
                    return callback.call( elem, i, elem );
                }));
            },

            slice: function() {
                return this.pushStack( slice.apply( this, arguments ) );
            },

            first: function() {
                return this.eq( 0 );
            },

            last: function() {
                return this.eq( -1 );
            },

            eq: function( i ) {
                var len = this.length,
                    j = +i + ( i < 0 ? len : 0 );
                return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
            },

            end: function() {
                return this.prevObject || this.constructor(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: deletedIds.sort,
            splice: deletedIds.splice
        };
    
    	//给jQuery的原型上增加了extend方法，同时给jQuery函数对象上增加了extend方法。jQuery有两种角色，构造函数和函数对象。所以对应的使用方法有两种L:
    	/*
    	1.$().xxxx()
    	2$.xxx()
    	*/
   		//jQuery.extend()方法的作用是， 将传参对象上的每一项全部扩展到对应的对象（jQuery原型或者jQuery函数对象）上。 
		jQuery.extend = jQuery.fn.extend = function() {  ......  }  
        
        jQuery.extend({
            // See test/unit/core.js for details concerning isFunction.
			// Since version 1.3, DOM methods and functions like alert
			// aren't supported. They return false on IE (#2968).
			isFunction: function( obj ) {
				return jQuery.type(obj) === "function";
			},

			isArray: Array.isArray || function( obj ) {
				return jQuery.type(obj) === "array";
			},

            isWindow: function( obj ) {
                /* jshint eqeqeq: false */
                return obj != null && obj == obj.window;
            }
            //......上面的操作导致jQuery函数对象上有在extend的基础上新增了isFunction，isArray，isWindow等一系列的方法。
        })
		jQuery.fn.extend({ 
        	find( selector ){ .... }
            //.....
        })
                                                       
        var rootjQuery,

        // Use the correct document accordingly with window argument (sandbox)
        document = window.document,

        //********
        //init是一个构造函数，它被放在了jQuery的原型上，同时init的原型上指向的是jQuery的原型，所以相当于init构造函数的实例对象就能调用jQuery函数的原型上的方法了，可以理解为init函数的实例对象就相当于jQuery函数的实例对象了。
        //为什么这么做？
        //如果外部调用jQuery(),执行后面这段代码jQuery = function( selector, context ) {return new jQuery( selector, context );}，那么就是一个死循环。
        init = jQuery.fn.init = function( selector, context ) {
            .....
            return jQuery.makeArray( selector, this );
        }
        init.prototype = jQuery.fn;
                                      
                                                       
        if ( typeof noGlobal === strundefined ) {
            window.jQuery = window.$ = jQuery;
        }                                               
        return jQuery;                                               
})()
````

在jQuery中使用$()或者jQuery()执行（该方法可以接受两个参数），返回值是jQuery的实例对象，它能调用jQuery原型上的属性或方法。

社区中习惯将 $() 称为jQuery选择器，基于各种选择器创建一个jQuery实例对象。

```
$(selector,context)
其中selector支持css原则器字符串，函数或者dom元素对象。 如果传递的是一个函数，则jQuery内部会执行该函数，并且将jQuery构造函数传入。该传参函数会在页面的HTML结构都加载完成后再执行

selector(jQuery)

$( function($){
	$:jquery构造函数
	....
} )

jQuery( function($){
	这样执行，函数内部的this指向的是window
	$:jquery构造函数
	这样就能变相的实现$的私有化
	....
} )


context用选择器获取元素时指定的上下文，默认是document
```

jQuery对象本质是一个类数组结构，内部元素是获取到的真实dom元素。

![image-20210521205926360](D:\learn-notes\images\image-20210521205926360.png)

![image-20210521210208563](D:\learn-notes\images\image-20210521210208563.png)



在学习过jQuery之后，开发者有两种方式获取dom元素对象：

1. 基于原生js方法获取的dom元素，这些js对象上有一些原生默认的属性和方法可以使用，但是无法使用jQuery原型上的属性和方法
2. 基于jQuery方法获取的对象（是对原生js dom对象进行的包装），这个jQuery对象实例可以调用jQuery原型上的属性或者方法，它不能使用原生js dom对象上的方法和属性

### 原生js dom对象和jQuery对象之间的彼此转换

- jQuery对象转为原生js dom对象

  1. jQuery对象[ idnex ]

  2. jQuery对象.get( index ) :返回的结果是一个js dom对象

  3. jQuery对象.eq( index )：返回的结果是一个新的jQuery实例对象，同时没有了selector属性

     面试点：问get和eq方法的区别

     ![image-20210521212428828](D:\learn-notes\images\image-20210521212428828.png)

- 原生js dom对象转为jQuery对象

  1. $( js dom对象)

     





$(), $(null), $(undefined), $(false)返回的都是空的jQuery实例对象。

![image-20210521215123531](D:\learn-notes\images\image-20210521215123531.png)

![image-20210521214947838](D:\learn-notes\images\image-20210521214947838.png)



面试问：

开发者如何判断一个js对象的js dom对象。

解答：原生的js dom对象上一个独有的属性：nodeType，只要该对象有nodeType属性，并且有值，那就说明该对象的一个dom元素对象。



面试点

```javascript
//之前有一个构造函数，我们要创建它的实例对象必须通过new的方式去调用它。
let Fn = funtion(){

}
let fn = new Fn()
//问题：如何不用new调用去创建一个构造函数的实例？
//也许自己首先会想到：
let Fn = funtion(){
	return new Fn()
}
let fn = Fn()
//这样是错误的，这回造成死循环

//正确的做法：
let Fn = funtion(){
	return new init()
}
let init = function(){
    
} 
init.prototype = Fn.prototype
let fn = Fn()
```

```javascript
//面试题
let Fn = function(){
    //.....
}
Fn.prototype = {
    a：function(){
        ....
    }
}
// Fn().a()  能不能执行？如果不能，你要怎么做让他能？
//解答：
let Fn = function(){
    return new init()
}

Fn.prototype = {
    a：function(){
        ....
    }
}

let init = function(){
    ....
}
init.prototype =  Fn.prototype
```



### jQuery中常用的方法

#### 获取dom元素的方法

$( selector [ ,context ] )

```
let box = document.getElementById('box')
$('#box')

let boxs = document.getElementsByClassName('box')
$('.box')

let box = document.getElementsByClassName('box')[0]
let lis = box.getElementByTagName('li')
$('.box li')   |   $('li',box)

n指的是jQuery实例对象的每一项的索引，从零开始
$('a:eq(n)')
$('a:gt(n)')
$('a:lt(n)')
```

根据节点之间的关系来获取dom元素

```
let $box = $('.box')
$box.children('a')：获取子代
$box.find('a')：获取后代
$box.filter('.active'):筛选出同级中还带有'active'类名的元素
$box.prev()
$box.prev('p')
$box.prevAll()
$box.next()
$box.nexyAll('.active')
$box.siblings()
$box.index():获取对应元素的索引
$box.parent()
$box.parents()
```

#### dom元素的增删改查

```
let divbox = document.createElement('div')
divbox.id = 'box'
divbox.className = 'box'
document.body.appendChild(divbox)  追加

let str = `<div id="box" class="box">hello jquery</div>`
document.body.innerHTML = str   替换

$('body').append()  后面追加
$(`<div id="box" class="box">hello jquery</div>`).appendTo($('body')) 后面追加
$(`<div id="box" class="box">hello jquery</div>`).perpendTo($('body'))  前面追加

$('body').html(`<div id="box" class="box">hello jquery</div>`)   替换
$('body').html()   获取body内的html内容
类似的有text()


$('#li').insertBefore($('#box'))  //将已经存在在页面上的dom元素 li 插入到 $('#box')元素之前
$('#li').insertAfter($('#box')) //将已经存在在页面上的dom元素 li 插入到 $('#box')元素之后


$box.clone()
$box.remove()

```

#### 表单元素值操作

```
$('input').val()
$('input').val('newvalue')
```

#### 标签属性操作

```
$box.attr('data-key')  //这个系列的方法主要是用于操作非表单元素的自定义属性
$box.attr('data-key','newvalue')
$box.attr({
	'key1':value1,
	'key2':value2
})
$box.removeAttr('data-key') 


$input.prop('checked')//这个系列的方法主要是用于操作表单元素的自定义属性
$input.prop('checked',true)
...

```

#### 操作css样式

```
$box.css(attr)  //这是获取行类样式  ，内部用的是getComputedStyle()
$box.css(attr:value)   //这是设置行类样式
$box.css({
	attr1:value1,
	attr2:value2
})



$box.addClass('className')  //这是操作css类名样式
$box.removeClass('className')
$box.hasClass('className')
$box.toggleClass('className')



```

#### $(html)

```
$('<div id="app"></div>')

$('<div id="app"></div>').appendTo(document.body)
```

![image-20210521224857375](D:\learn-notes\images\image-20210521224857375.png)

#### each()

$.each()或者$(selector).each():作用类似于forEach()，可以遍历数组，对象和类数组。数组和类数组内部用的是普通for循环，而对象内部走的是for in 循环。同时for in循环时，内部在遍历没有使用hasOwnproperty方法，所以可以遍历到原型中添加的属性或者方法。

```
$.each( [1,2,3,4,5,6] ,function(index,item){
	....
})

$.each( {name:'jack',age:10,1:'box'},function(index,item){
	循环的顺序和for in 的一样，数字属性名先循环到。
	....
})

$('li').each(function(index,item){
	//在不适用箭头函数的情况下，函数内部的this就是当次循环到的dom元素，和item一样，也是元素js dom对象
	$(this).on('click',function(){ .... })
})
```

jQuery内部内置了each方法

```
$('li').click(function(){

})
jquery内部在调取click时，内部会默认把jQuery实例对象进行遍历，然后给每一项都绑定click事件

$('li').css({
	color:'pink'
}) 
//同理
```

jQuery函数对象上的each方法：

![image-20210521231840161](D:\learn-notes\images\image-20210521231840161.png)

jQuery实例对象上的each方法：

![image-20210521232050664](D:\learn-notes\images\image-20210521232050664.png)

真正的each方法：

![image-20210521232200897](D:\learn-notes\images\image-20210521232200897.png)

![image-20210521232457719](D:\learn-notes\images\image-20210521232457719.png)

#### extend()

$.extend()或者$prototype.extend() ：常用于插件开发，就是往jQuery函数对象或者jQuery构造函数的原型增加方法。

jQuery.noConflict (  ):多库共存，转让出$。这时window.$的值为undefined。

#### noConflict ( true )

jQuery.noConflict ( true ):多库共存，深度转让jQuery和$。这时window.$和window.jQuery的值都为undefined。

let myjqueryName = jQuery.noConflict ( true )  ,返回值就是新的jQuery的代言变量

![image-20210521234613803](D:\learn-notes\images\image-20210521234613803.png)



#### 事件处理方法

```
//原生事件
$box.on(eventName, function(){ .... })
$box.off(eventName, function(){ .... })
$box.bind(eventName, function(){ .... })
$box.unbind(eventName, function(){ .... })
$box.delegate(eventName, function(){ .... })
$box.eventName(function(){})

//动画
$box.animate(目标样式，时间，运动方式，动画结束后的回调函数)
$box.stop()
$box.finish()


//Ajax
$.ajax ( {
	url:'...',
	method:'GET',
	async:false,
	dataType:'json', //默认值
	success:function(result){
		....
	}
} )
```

 

```JS
window.onload = function(){......}
window.addEventListener('load',function(){......})

$(window).load(function(){
    .....
})
                                          
                                          
$(documnent).ready(function(){.....})
document.addEventListener('DOMContentLoad',function(){.....})
$(function(jQuery){
    ......
})


var _$ = jQuery.noConflict()
```

