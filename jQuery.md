



# jQuery

### 前言

用原生js封装的类库，用于操作DOM的。

- 看官方文档
- 阅读书籍
- 做大量案例
- 学习JQ源码



jQuery的版本一是最常用的,1.11.3版

jQuery的版本二去掉了很多pc端兼容代码，主要面对移动端，现在移动端用zpeto库代替了jquery。

jQuery的版本三只是在版本一基础上进行的改善。



jQuery这个类库到底是什么？库中封装的是许多方法，通过调取方法开发项目。

它一个能批量操作DOM的函数库，通过$('css选择器')能获取一组dom元素，如果直接对返回结果执行某个方法，则能对返回对象中的每个具体的dom元素都进行操作。它的链式操作非常简洁容易维护，解决了跨浏览器的兼容问题，并对Ajax进行了封装。

jQuery 与 $( )  的区别

extend原理

插件扩展原理

$.fn.abc = function () { }



2.0.3版本源码

​		IIFE内部：

- 21-94：定义一些变量和函数

- 96-283：给jQuery函数对象和jQuery构造函数的原型上添加一些列的方法

  ```
  jQuery.fn = jQuery.prototype ={
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
  				match = rquickExpr.exec(selector)  //匹配$('<li>asd')，$('#box')这种情况
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

![image-20210521205926360](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521205926360.png)

![image-20210521210208563](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521210208563.png)



在学习过jQuery之后，开发者有两种方式获取dom元素对象：

1. 基于原生js方法获取的dom元素，这些js对象上有一些原生默认的属性和方法可以使用，但是无法使用jQuery原型上的属性和方法
2. 基于jQuery方法获取的对象（是对原生js dom对象进行的包装），这个jQuery对象实例可以调用jQuery原型上的属性或者方法，它不能使用原生js dom对象上的方法和属性

### 原生js dom对象和jQuery对象之间的彼此转换

- jQuery对象转为原生js dom对象

  1. jQuery对象[ idnex ]

  2. jQuery对象.get( index ) :返回的结果是一个js dom对象

  3. jQuery对象.eq( index )：返回的结果是一个新的jQuery实例对象，同时没有了selector属性

     面试点：问get和eq方法的区别

     ![image-20210521212428828](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521212428828.png)

- 原生js dom对象转为jQuery对象

  1. $( js dom对象)

     





$(), $(null), $(undefined), $(false)返回的都是空的jQuery实例对象。

![image-20210521215123531](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521215123531.png)

![image-20210521214947838](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521214947838.png)



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

![image-20210521224857375](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521224857375.png)

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

![image-20210521231840161](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521231840161.png)

jQuery实例对象上的each方法：

![image-20210521232050664](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521232050664.png)

真正的each方法：

![image-20210521232200897](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521232200897.png)

![image-20210521232457719](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521232457719.png)

#### extend()

$.extend()或者$prototype.extend() ：常用于插件开发，就是往jQuery函数对象或者jQuery构造函数的原型增加方法。

jQuery.noConflict (  ):多库共存，转让出$。这时window.$的值为undefined。

#### noConflict ( true )

jQuery.noConflict ( true ):多库共存，深度转让jQuery和$。这时window.$和window.jQuery的值都为undefined。

let myjqueryName = jQuery.noConflict ( true )  ,返回值就是新的jQuery的代言变量

![image-20210521234613803](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210521234613803.png)



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

