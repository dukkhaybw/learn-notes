

#  Vue.js

学习Vue要达到的程度：

- 能使用
- 原理
  - MVVM原理 
  - vuex原理
  - vue-router原理
  - nextTick原理
  - keep-alive原理
  - 组件插件的二次封装



vue.js的核心：声明式地将数据渲染进模板语法。跟渲染一个字符串模板非常类似。

## 认识

vue是**一套**渐进式框架(mvvm)，用于写前端的用户界面。

### 框架与库(一般都是面向对象思想开发的)

库：它不实现具体的某个功能，但是它提供了许多项目中常用得方法。它内部得方法需要开发者自己去根据需求自行调用。

框架：框架内部也有大量的方法，开发者使用框架的话，必须按照框架规定的写法，标准和规则。 同时它内部也有许多方法并不是由开发者自己去调用的，开发者只需要在规定的地方准备特定的业务处理程序，之后由框架自行去调用了。

### 渐进式

一般框架或者库的开发者会对每个功能板块要实现的东西都单独封装为一个个的js文件模块，使用时，按照功能模块按需引入自己的项目中使用。 对于不同开发者在使用框架的时候，能用到的功能模块不同，所以框架作者将这个大框架分为几个不同功能模块的小模块，开发者可以选择多个模块的多种组合去进行开发。

### vue的渐进式体现

vue.js (基础核心模块)：内部有基础语法、核心实现、组件开发、指令等（核心库只关注视图层）

vue-router (路由模块)：构建SPA应用使用的前端路由模块

vuex (公共状态管理模块)：组件间数据共享管理的模块

vue-cli（脚手架）：快速搭建vue项目的工具模块

components（组件）：第三方UI库，如：element-ui、iview、vux等

使用vue就是创建一个vue实例，由实例（vm监听器）去管理html部分和data数据部分。底层就是一个类,使用类构造实例，new Vue(options)

### MVVM

开发思想：

- 传统操作DOM模式，常常引发回流，重绘

- MVC:model view controller

  MVC是从后端发展到前端的一种开发思想，其中前端V层还可以继续被分为MVC或者MVVM模式。 

- MVVM:model view  viewModel

![image-20210513082239192](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210513082239192.png)



### 模拟双向数据绑定

```javascript
1.0版本：
function oberver(obj){
    if( typeof obj !== 'object' || obj ===null) return   //对于不是对象的数据类型直接返回
    
    for(let key in obj){   //循环对象
        defineReactive(obj,key,obj[key])
    }
}

function defineReactive(obj,key,value) {  //将已经存在在对象上的key属性重新定义
    Object.defineProperty(obj,key,{
        get(){
            return value  //这里形成了闭包，get函数引用了外层函数defineReactive的value值。
        },
        set(newValue){
            if(value !== newValue){
            	value = newValue  //这里set函数引用了外层函数defineReactive的value值，并修改了该value值    
                console.log('视图更新')
            }      
            
        }
    })
}
let data1 = { name:'小白' }
let data2 = { name:{age:17} }
oberver(data1)
data.name='abc'
data.age=17  //这里是后续添加的属性，可以看出它没有set与get，所以没有响应式能力
let data2 = { name:{age:17} }
observe(data2)
data2.name.age=18  
不足：
没有初始化的对象属性不具备响应式的能力
对于多层的数据结构无法实现内层数据的响应式能力
如果设置 data.name={gender:'male'}，那新增加的  {gender:'male'} 将没有响应式的能力
```



```JavaScript
2.0版本：
function oberver(obj){
    if( typeof obj !== 'object' || obj ===null) return
        
    for(let key in obj){
        defineReactive(obj,key,obj[key])
    }
}
function defineReactive(obj,key,value) {
	oberver(value)    // +++++++++++++++++++++  递归实现内层响应式数据，比较耗性能
    Object.defineProperty(obj,key,{
        get(){
            return value  //这里形成了闭包，get函数引用了外层函数defineReactive的value值。
        },
        set(newValue){
           if(value !== newValue){
            observe(newValue)  //++++++++++++++++++++++    newvalue可能是一个对象类型的数据
            value = newValue  
            console.log('视图更新')
          }
        }
    })
}
let data1 = { name:'小白' }
let data2 = { name:{age:17} }
oberver(data2)
data2.name.age=17  
不足：
没有考虑data1是数组的情况，同时也没有考虑data对象的某个属性的属性值是数组的情况，同时该数组的某个元素项是一个对象的情况也没有考虑。
```



```javascript
3.0版本：
function oberver(obj){
    if( typeof obj !== 'object' || obj ===null) return
    
    if(Array.isArray(obj)){//这里处理的是数组类型
        for(let i=0;i<obj.length;i++){
            let item = obj[i]
            observer(item)   //如果数组中的某项是对象，那也将该对象的属性设为响应式的数据，数组中的为引用类型的数据是没有响应式能力的
        }
    }else{//这步else处理的是对象类型
        for(let key in obj){
        defineReactive(obj,key,obj[key])
    	}
    }
}

function defineReactive(obj,key,value) {
	oberver(value)   
    Object.defineProperty(obj,key,{
        get(){
            return value 
        },
        set(newValue){
           if(value !== newValue){
            observe(newValue) 
            value = newValue  
            console.log('视图更新')
          }
        }
    })
}
let data1 = { name:'小白' }
let data2 = { name:{age:17} }
oberver(data)
data.name.age=17  
不足：
缺少常见数组方法操作数据后仍然具有响应式的能力，如数组的push，splice，unshift
```



```javascript
4.0版本：
let arrayProto = Array.prototype   //原生数组的对象原型
let proto = Object.create(arrayProto);   //创建一个新对象，并且以第一个参数对象作为该新对象的原型
['push','unshift','splice'].forEach(method=>{
    proto[method] = function(...args){  //这里的args数据可能也是一个对象类型的数据，也要考虑监视一下
        let inserted
        switch(method){
                case:'push':
                case:'unshift':
                	inserted = args
                	break;
            	case 'splice': //只有传递三个参数才表示追加效果
                	inserted = args.splice(2)
                	break;
            	default:
                	break;
        }
       console.log('试图更新')
       arrayObserve(inserted)
       arrayProto[method].call(this,...args)
    }
})

function arrayObserve(obj){
    for(let i=0;i<obj.length;i++){
            let item = obj[i]
            observer(item)   //如果数组中的某项是对象，那也将该对象的属性设为响应式的数据
    }
}


function oberver(obj){
    if( typeof obj !== 'object' || obj ===null){
        return
    }
    
    if(Array.isArray(obj)){//这里处理的是数组类型
        Object.setPrototypeOf(obj.proto)  //+++++++++++++++++  通过设置原型，对数组方法进行重写
        arrayObserve(obj)
    }else{//这步else处理的是对象类型
        for(let key in obj){
        defineReactive(obj,key,obj[key])  
    	}
    }
}

function defineReactive(obj,key,value) {   
	oberver(value)  
    Object.defineProperty(obj,key,{  
        get(){
            return value 
        },
        set(newValue){
           if(value !== newValue){
            observe(newValue) 
            value = newValue  
            console.log('视图更新')
          }
        }
    })
}
let data1 = { name:'小白' }
let data2 = { name:{age:17} }
let data3 = { d:[1,2,3] }
oberver(data1)
data1.name.age=17  
oberver(data3)
data3.d.push={ name:'jack'}

```



总结，从上面的各个版本来看，可以得出：

- data对应的数据类型必须是对象，或者函数返回对象

- vue框架中，如果需要data中的数据实现响应式的能力，那必须考虑初始化数据

- 对于data中的属性值是数组时，那数组中的基本数据类型没有响应式能力，但是数组中的对象类型元素可以有响应式能力

- vue的底层中重新写了一些数组的方法

- 实现响应式数据的关键方法：  Object.defineProperty    Object.setPrototypeOf(obj.proto)    let proto = Object.create(arrayProto)

- 对于数组的响应式，vue是通过重写数组的方法实现的

- 通过数组的索引去修改元素项，是无法实现响应式的

- 要理解什么样的数据操作不会引发视图更新



补充知识点：

Object.create(proto, [propertiesObject])：返回一个新对象，该新对象的原型对象是proto，当proto为null表示创建一个没有原型的对象。     propertiesObject  是添加到新创建对象的可枚举属性（即其自身的属性，而不是原型链上的枚举属性）或者对象的属性描述符以及相应的属性名称。



propertiesObject  是一个对象，它的结构是：

```
{
	key:{
		value: xxx
		
	}
}

其中key对应的值是该属性的属性描述符字段，该对象的中可选的属性描述字段有：configurable，enumerable，value，writable，get，set
```

具体内容参考[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)



![img](https://upload-images.jianshu.io/upload_images/7513201-b5321f078c877567.png?imageMogr2/auto-orient/strip|imageView2/2/w/1046/format/webp)

注意点：

```js
var a = {  rep : 'apple' }
var b = new Object(a)
console.log(a==b)   //true


var a = { rep: 'apple' }
var b = Object.create(a)   //有点继承的意思
console.log(a==b)   //false

```

![image-20210804101259081](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210804101259081.png)





直接和对象的原型对象操作有关的其他API

- Object.setPrototypeOf(object, prototype)
- Object.getPrototypeOf(obj)








通过查看上面的源码实现，想到的一个关于编程技巧：

对数组的方法进行重写，并能在重写的过程中进行逻辑判断。

```
let arrayProto = Array.prototype
let newarrayProto = Object.create(arrayProto)
['push','pop', 'unshift', 'splice'].forEach(item =>{
	newarrayProto[item] = function(...args){
		代码的其他逻辑判断
		arrayProto[item].call(this,...args)
	}
})
```







## vue实例的属性与方法

工具方法和属性

- vm.$el  :获取的是真实的dom元素
- vm.$watch( )
- vm.$nextTick( )  ：数据更新后会有一个回调队列，其中$watch和$nextTick等的回调函数都会放在其中，依次在下一个事件循环中执行。
- vm.$data
- vm.$options
- vm.$set
- vm.$delete



内置指令

- v-once

- v-html

- v-bind

- v-for

  在循环生成dom元素时，还需要绑定key属性，用来区分元素。例子：如果已经通过V-FOR循环渲染出了一组列表项，当我们对原数据继续sort（）重排后，外层的元素可以被复用，但是元素内部渲染的内容不再相同了。会重新创建新的内容元素，不利于性能优化。如果给key设置了唯一标识，那么则会对外层元素直接进行移动，不会创建新的dom元素。

  单次循环生成一组dom元素的话，可以将这组dom元素包裹在template标签中，循环template。

- v-if

  v-if 和 v-for不建议在同一个标签上使用

- v-show

  template标签不能和v-show

- v-model

  ```
  <input type='text' :value='value' @input='fn'>
  
  上面写法的语法糖：
  <input type='text' v-model='value'>
  ```

- $event



ps：将方法放在data中时，方法中的this指向的是window而不是vue实例。 所以常将方法写在methods中。注意在methods中定义的方法，方法内部的this指向是绑定死的，用bind绑定的，是无法修改的。



```javascript
<body>
  <div id="app">{{ name }}</div>
  <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.4/vue.js"></script>
  <script>
    let vm = new Vue({
      el:'#app',
      data() {
        return {
          name:'jack'
        }
      }
    })
    vm.name = 'tom'
    vm.name = 'rose'
    console.log(vm.$el);  //<div id="app">jack</div>，输出的文本内容并不是rose。
    debugger
  </script>
</body>

//在上面的代码中，对data上的name属性执行的两次修改，每次修改后，vue并不会立即重新渲染更改后的数据到视图上，vue不会在本轮同步代码执行时，当执行到对data中数据更改的代码执行后，立即去渲染dom。而是会在下一次事件循环时，更新上一轮数据操作导致的dom渲染。
```



```javascript
<body>
  <div id="app">{{ name }}</div>
  <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.4/vue.js"></script>
  <script>
    let vm = new Vue({
      el:'#app',
      data() {
        return {
          name:'jack'
        }
      }
    })
    vm.$watch('name',function(newvalue,oldvalue){
        console.log(newvalue)
    })
    vm.name = 'tom'
    vm.name = 'rose'
  </script>
</body>
//上面的代码数据name虽然被修改了两次，但是watch函数只执行了一次，watch执行的条件是，当监视的数据改变并在下一个事件循环中渲染到页面后才触发。
```



## vue模板语法

vue的模板的编写方式：

1. 直接使用html标签编写后转为模板
2. 使用配置对象的template属性的字符串作为模板
3. 使用vue文件
4. 在熟悉虚拟dom和js情况下，可以用jsx语法直接写出render函数

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

模拟vue解析{{ key }} 模板：

```javascript
<div id="app">
    <p>{{name}}</p>
	<p>{{msg}}</p>
</div>
<script>
	let app = document.getElementById('app')
	let data={
    	name:'abc',
    	msg:'hello vue'
	}
	let reg = /\{\{(.+?)\}\}/g
	function renderModel (node,data){
   		let childNodes = node.childNodes
    	for(let i = 0;i<childNodes.length;i++){
        	let nodeType = childNodes[i].nodeType
        	if(nodeType == 3 ){
            	let str = childNodes[i].nodeValue
            	str= str.replace(reg,function(_,g1){
                	return data[g1]
            	})
            	childNodes[i].nodeValue=str
        	}else if (nodeType == 1){
            	renderModel(childNodes[i],data)
        	}
    	}
	}
    let cloneModel = app.cloneNode(true)
    renderModel(cloneModel,data)
    app.parentNode.replaceChild(cloneModel,app)
</script>
```

文本节点的nodeValue的值是文本节点的文本内容，而元素节点的nodeValue没有任何意义。文本节点没有innerText属性和innerHTML属性。



### vue中的数据

data：声明组件自己的简单的响应式数据

computed：声明组件自己的**复杂的**响应式数据（复杂的：一个依赖于另一个数据的数据）

props：声明组件中来自于外部的响应式数据

watch： 侦听响应时执行异步任务或者开销较大的操作的数据

- 在数据变化时，想发送请求，异步或者执行开销大的操作（递归，循环）时，该属性用侦听器监听。

  ```
  watch:{
  	//data中的数据
  	//props中的数据
  	//$route路由数据
  	//$store状态数据
  }
  //可以在vue实例上直接访问的数据都可以用watch侦听。
  ```




## 安装

vue不支持ie8及其以下版本，因为vue源码中使用了ie8及其以下版本不能识别的ES语法。

### 安装方式

1. 下载vue.js文件，再通过<script>标签引入，引入后，全局会有一个Vue全局变量，Vue全局变量对应的值是一个构造函数，用于创建vue实例。

   + 开发版包含完整的警告和调试模式
   + 生产版删除了警告

2. 使用CDN引入

3. ES6模块化引入

   > <script type="module">   import Vue from 'vue.js文件URL' </script>

4. NPM安装

   > npm install vue
   >
   > 在相应模块用模块化语法引入
   >
   > 在NPM安装的vue包中的dist/目录下，有多个vue构建版本：
   >
   > |                               | UMD                | CommonJS              | ES Module (直接用于浏览器) | ES Module (基于构建工具使用) |
   > | :---------------------------- | :----------------- | :-------------------- | :------------------------- | ---------------------------- |
   > | **完整版**                    | vue.js             | vue.common.js         | vue.esm.js                 | vue.esm.browser.js           |
   > | **只包含运行时版**            | vue.runtime.js     | vue.runtime.common.js | vue.runtime.esm.js         | -                            |
   > | **完整版 (生产环境)**         | vue.min.js         | -                     | -                          | vue.esm.browser.min.js       |
   > | **只包含运行时版 (生产环境)** | vue.runtime.min.js | -                     | -                          | -                            |
   >
   > **完整版**：包含编译器和运行时的版本。
   >
   > **编译器**：用来将模板字符串编译成为 JavaScript 渲染函数的代码。
   >
   > **运行时**：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。
   >
   > **[UMD]**：UMD 版本可以通过 `<script>` 标签直接用在浏览器中。
   >
   > **[CommonJS]**：CommonJS 版本用来配合老的打包工具比如 [Browserify] 或 [webpack 1]。**这些打包工具的默认文件是只包含运行时的 CommonJS 版本 (`vue.runtime.common.js`)**。在npm下载的vue包中的package.json文件中的main属性对应的值是："main": "dist/vue.runtime.common.js",所以在引入包的时候，默认使用的是：`vue.runtime.common.js`。这导致vue不能识别以下的模板字符串的定义：
   >
   > 
   >
   > > cosnt com={  template: '<div>hi</div>' }
   >
   > 
   >
   > ​    如果需要在客户端编译模板 (比如传入一个字符串给 `template` 选项，或挂载到一个元素上并以其 DOM 内部的 HTML 作为模板)，就将需要加上编译器。**当使用 `vue-loader`(webpack中使用的加载器) 或 `vueify` 的时候，`*.vue` 文件内部的模板会在构建时预编译成 JavaScript。在最终打好的包里实际上是不需要编译器的，所以只用运行时版本即可。**
   >
   >  
   >
   > 如果还是要在项目工程中使用vue.js完整版，则可以通过webpack的webpack.config.js文件中添加以下配置一个别名：
   >
   > > module.exports = { 
   > >
   > >  // ...
   > >
   > >   resolve: {
   > >
   > > ​    alias: {
   > >
   > > ​      'vue$': 'vue/dist/vue.esm.js' 
   > >
   > > ​		// 在引入的模块中有以vue结尾的模块名时，用 webpack 时需用 'vue/dist/vue.common.js'
   > >
   > > ​    }
   > >
   > >   }
   > >
   > >  }
   
   







## 声明式渲染

声明式：开发者只需要按照规则，提供响应的数据和代码结构就可以了，底层会按照它事先规定的流程对数据和代码进行指定流程的操作，并返回结果。

Vue.js 核心是一个类实例，它用**模板语法**来**声明式**地将数据渲染进 DOM 。能把数据绑定到 DOM 文本中或 给标签的attribute属性的属性值进行动态绑定（值来自vue实例的data中），还可以绑定给 DOM 标签元素自身，以控制该标签元素的是否存在（v-if）或者存在几个（v-for）。

在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例。







#### 	el：

+ 类型：string | Element（ CSS 选择器，也可以是一个 HTMLElement 实例）
+ 作用：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。
+ 注意点：
  + 实例挂载到dom元素上后，如果要获取该dom元素，可以用   vue实例名.$el  获取（vm.$el）
  + el选项不是必有的，如果在实例化时存在这个选项，实例将立即进入编译过程，否则，需要显式调用 `vm.$mount()` 手动开启编译。
  + 不能直接挂载到<html>或者<body>标签上
  + 如果 `render` 函数和 `template` property 都不存在，挂载 DOM 元素的 HTML 会被提取出来用作模板，此时，必须使用 Runtime + Compiler 构建的 Vue 库。

#### data：（实例的数据对象）

+ **类型**：`Object | Function`（组件的定义只接受 `function`）
+ 注意点：
  + Vue源码会递归data上的属性，设置getter函数与setter函数，从而让数据具有响应式（声明组件自己的简单的响应式数据）,同时也会将data中的属性代理到vue实例上，vue实例上除了代理data上的数据之外，也还有一些框架初始化给vue实例的属性与方法，这些属性或方法常以$作为前缀（如：vm.$data,vm.$options,vm.$watch）
  + **并不是所有的数据更改都会响应式的更新视图**
  + **只有当实例被创建时就已经存在于 `data` 中的 property 才是响应式的。**
  + **data中的某个属性是一个对象类型的数据，但是对象中没有某个key属性，创建完实例后再通过vm.obj.key的方式添加新的属性时，该属性不具有响应式能力**让数据具有响应式的方法：
    - 一开始就初始化数据，即使数据为空，也可以用空字符串，undefined，null等赋初始值
    - 直接整体替换某个数据，如vm.obj ={...obj,key =value}
    - 使用vm.$set(vm.obj,key , value)
  + 对于data中的属性的属性值对应的是数组时，通过vm.arr[n] =value,修改也是不会触发响应，但是基于数组的push、pop、shift、unshift、reverse、sort、splice的方法操作数组是可以实现响应式的。其他两种方法与对象的一样。vm.$set(vm.arr,index, value)
  + 实例创建之后，可以通过 `vm.$data` 访问原始数据对象。Vue 实例也代理了 data 对象上所有的 property，因此访问 `vm.a` 等价于访问 `vm.$data.a`。
  + 以 `_` 或 `$` 开头的 property **不会**被 Vue 实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突。你可以使用例如 `vm.$data._property` 的方式访问这些 property。
  + **当一个组件被定义，`data` 必须声明为返回一个初始数据对象的函数**，因为组件可能被用来创建多个实例。如果 `data` 仍然是一个纯粹的对象，则所有的实例将**共享引用**同一个数据对象！通过提供 `data` 函数，每次创建一个新实例后，我们能够调用 `data` 函数，从而返回初始数据的一个全新副本数据对象。(面试)
  + 为 `data` property 使用了箭头函数，则 `this` 不会指向这个组件的实例，不过你仍然可以将其实例作为函数的第一个参数来访问。

#### methods：

+ **类型**：`{ [key: string]: Function }`
+ 注意点：
  + 可以直接通过 VM 实例访问这些方法（所以不能和data中的数据重名，因为都会绑定到vm实例上），或者在指令表达式中使用。方法中的 `this` 在框架内部通过绑定为 Vue 实例。
  + **不应该使用箭头函数来定义 method 函数** (例如 `plus: () => this.a++`)。理由是箭头函数绑定了父级作用域的上下文，所以 `this` 将不会按照期望指向 Vue 实例，`this.a` 将是 undefined。
  + 在视图中使用了某个方法时，只要视图一更新，该方法就会重新执行一次

一个 Vue 应用由一个通过 `new Vue` 创建的**根 Vue 实例**，以及可选的嵌套的、可复用的组件树组成。所有的 Vue 组件都是 Vue 实例，并且接受相同的选项对象 (一些根实例特有的选项除外)。

#### vm.$forceUpdate()

- 强制更新视图重新渲染，正常来说，渲染到页面上的数据改变之后，视图才会重新渲染。

#### computed：

- computed:{  key:{ set(newValue) {....} , get( ) {.....} } }

- 当一个数据基于某个或者某些响应式数据而得到自身的结果时，该数据可以考虑用计算属性。

### Vue实例的生命周期初始化过程：

1. 设置数据监听
2. 编译模板
3. 将实例挂载到 DOM 
4. 数据变化时更新 DOM 

#### 生命周期钩子函数（P5）

这些生命周期函数都是同步执行的，函数内部有异步函数时也不会等待异步执行完。

- beforeCreate(){} 

  初始化Vue实例的父级实例和子级实例有哪些，初始化实例自己的发布订阅模式($on, $emit, $off)。在这个生命周期函数中，常常用于在所有的vue实例或者组件实例中做混合，添加一些共有属性或者方法，因为这里面可以获取实例的父级或者子级实例。vuex和vue-router中就使用到了。

  该生命周期函数中无法获得data中初始化的数据和methods中初始化的方法，watch和computed。

  常在写组件库时用。

  ![image-20210513223952821](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210513223952821.png)

  ![image-20210513224026409](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210513224026409.png)

- created(){}

  在执行完beforeCreate之后，created之前，Vue进行了初始化注入（inject和校验）。在created中，当前组件实例已经实现了数据劫持（完成了数据的Object.defineProperty），data中的数据、methods中的方法、watch和computed都能被获取到。可以在这里发送ajax请求。

  不能获取到真实的dom元素，也不能操作真实dom元素

![image-20210513225537003](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210513225537003.png)

![image-20210513225545826](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210513225545826.png)

- beforeMount(){}:

  在执行完created之后，beforeMount之前.如果没有指定el或者没有使用vm.$mount('xxx')进行挂载，则不会继续执行beforeMount及其之后的生命周期函数。如果没有写el，但是写了render（优先级更高）或者template属性和vm.$mount( )，则会根据模板在内存中渲染出一个虚拟dom。

  这个生命周期函数基本不怎么使用。

  ```
  let vm =new Vue({
  	data:{
  		n:1
  	},
  	methods:{
  		fun(){}
  	},
  	beforeCreate(){
  	
  	},
  	created(){
  	
  	},
  	//render:(h)=>h(xxx)  //render和template同时出现时，render优先级更高，tempalte直接被忽略。因为Vue内部在有tempalte的情况下会先将tempalte对应的模板渲染为render函数，在beforeMount之后和在挂载之前会调用render函数
  	tempalte:'<div>hello vue</div>',
  	
  	beforeMount(){
  	
  	}
  })
  vm.$mount()
  那么如何获取在内存的那个dom元素了？  用vm.$el获取。还可以直接手动将vm.$el作为某个真实的dom元素的子元素加入到该真实的dom元素中。如：document.body.appendChild(vm.$el)。
  ```

  beforeMount和mounted 之间，如果组件有子组件的化，那么这里会触发子组件的创建阶段的生命周期函数。

- mounted(){}

  在执行完beforeMount之后，mounted之前,已经将渲染好的虚拟dom挂载到对应的真实节点上了。能获取到真实dom元素。可以进行dom操作。

  

- beforeUpdate(){}

  可以在这个函数中再增加一些数据更新，而不导致视图多次重新渲染。

- Updated(){}

  这里不要再次更改已经被渲染到页面上的数据。



组件并不会自动销毁，需要手动移除组件或者路由切换时触发。vm.$destory( )会移除所有的观察者，移除监听事件。

- beforeDestroy(){}

  可以在这里移除事件，清空定时器。

- destroy(){}



Vue内部怎么执行生命周期函数：

````
if(created){
	created()
}
````



ps：vue的视图渲染是组件级的并且是异步渲染的，马上更新数据后立马获取dom是拿不到最新的渲染结果的，需要在下一个事件环中获取。 组件视图更新必须要求实例上的属性在视图中有被使用。





## 组件

组件的使用流程：

1. 定义组件
2. 引入组件
3. 注册组件
4. 使用组件

全局组件:

```
Vue.component('mycom',{ 
	template:'<div>hello vue</div>'
})
```

组件的使用注意：

如果是在el指定的外部html模板中使用组件的话，     标签不能自闭和，写自闭合标签的话，只能写一个；   标签名不能和原生的一样；    在定义组件名时有大写字母时，在el指定的外部html模板中使用组件的话，将全部转为小写或者加上短横线的形式。html标签是不存在大写字母的。   组件的data必须是一个函数返回一个对象。

私有组件:

```
new Vue({
	el:"#app",
	data:{
		message:'hello world'
	}
	components:{
	mycon:{
		template:'<div>hello vue</div>',
		data(){
			return { xxx }
		}
		//props:[]
		props:{
			key:{
				type:Number,
				required:true,
				default:'xxx'
			},
			key:{
				type:Array,
				default:()=>[xxx,xxx,xxx]
			},
			key:{
				type:Object,
				default:()=>( {key:value} )
			}
		}
	}	 
}
})
```



#### 普通组件（.vue文件组件）

1. 定义组件

2. 在其他组件中引用组件

3. 在其他组件的components中注册引入的组件

4. 在页面上使用

   ![image-20210525111221156](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525111221156.png)

```vue
//按钮组件
<template>
  <button class="btn" :style="{ color: color }"><slot></slot></button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'pink',
    },
  },
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  background-color: #ccc;
  border: 1px solid deeppink;
}
</style>
```

```vue
//父组件
<template>
  <div id="app">
    <Button color="blue">hello world</Button>
  </div>
</template>

<script>
import Button from './components/Button'
export default {
  components: {
    Button,
  },
}
</script>

<style>
</style>
```

![img](https://user-gold-cdn.xitu.io/2019/3/20/1699a0c8e1ac545c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 全局组件（Button.js且带有install方法）

1. 定义组件
2. 子组件添加install方法
3. 在 `main.js` 中引用
4. 使用 `Vue.use` 方法进行全局注册
5. 在页面上使用

```vue
<template>
  <button class="btn" :style="{ color: color }"><slot></slot></button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'pink',
    },
  },
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  background-color: #ccc;
  border: 1px solid deeppink;
}
</style>
```

```js
//button.js文件
import Vue from 'vue'  //这步有些多余，因为vue框架在调用组件中的install方法时，会向该方法内传入Vue构造函数，内部就可以直接使用了
import myButton from './button.vue'

const install = function(Vue){
    Vue.component('myButton', myButton)
}
export default install
```


```js
//项目入口文件main.js中
import Vue from "vue";
import App from "./App";
import myButton from "./components/button/button";

Vue.use(myButton);

new Vue({
    render: (h) => h(App),
}).$mount("#app");
```

```vue
//根组件实例 App.vue 中
<template>
  <div>
    <myButton color="blue">你好吗？</myButton>
  </div>
</template>
  
<script>
export default {}
</script>

<style scoped>
</style>
```



```js
//一次性注册多个组件
import ButtonComponent1 from './Button1.vue'
import ButtonComponent2 from './Button2.vue'
import ButtonComponent3 from './Button3.vue'

const buttonList = [
    ButtonComponent1,
    ButtonComponent2,
    ButtonComponent3
];
// 添加install方法 （插件方法）
const Button = {
  install: function (Vue) {
    buttonList.forEach(button=>{
        // 这里 使用每个组件的 name 属性作为组件名
        Vue.component(button.name, button);
    })
  }
}

// 导出Button
export default Button
```

![img](https://user-gold-cdn.xitu.io/2019/3/20/1699a16bd08312b7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 构造组件

1. 创建组件（.vue文件）
2. `vue.extend`构建组件
3. 挂载 `Vue.prototype`
4. 在js中使用

```vue

<template>
  <p class="Message">{{value}}</p>
</template>

<script>
export default {
  data() {
    return {
      value: "我是一个弹框"
    };
  }
};
</script>

<style>
.Message {
  position: fixed;
  bottom: 30px;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%);
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  animation: messageFade 3s 1;
}
/* 加个简单动画 */
@keyframes messageFade {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-50%, 80%, 0);
    transform: translate3d(-50%, 80%, 0);
  }
  16% {
    opacity: 1;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  84% {
    opacity: 1;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate3d(-50%, 80%, 0);
    transform: translate3d(-50%, 80%, 0);
  }
}
</style>
```

```js
import Vue from 'vue';
import Message from  './Message.vue';
//使用vue的extend，以vue文件为基础组件，返回一个可以创建vue组件的特殊构造函数
const MessageConstructor = Vue.extend(Message);
// 设置删除组件
const removeDom = (target) => {
    target.parentNode.removeChild(target);
};
// 构造组件添加关闭方法
MessageConstructor.prototype.close = function() {
    this.visible = false;
    removeDom(this.$el);
};

const MessageDiv = (options) => {
    // 实例化组件
    const instance = new MessageConstructor({
        el: document.createElement('div'),
        // 组件参数，运用到组件内的data
        data: options,
    });
    // //在body中动态创建一个div元素，后面自动会把它替换成整个vue文件内的内容
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
        instance.timer = setTimeout(() => {
            // 定时关闭组件
            instance.close();
        }, 3000);
    });
    return instance;
};

export default MessageDiv;
```

```js
import Message from '@/components/Message.js'
Vue.prototype.$message = Message;
```

```vue
<template>
  <div id="app">
    <Button color="blue" @click.native="msg">我是全局按钮</Button>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
export default {
  name: "app",
  components: {
    Button
  },
  methods: {
    msg() {
      // 4. 使用构造组件
      this.$message({value:'我是构造组件'});
    }
  }
};
</script>
```

![img](https://user-gold-cdn.xitu.io/2019/3/20/1699a2f3a345e729?imageslim)





#### 创建组件之vue.extend和vue.component

extend组件构建器 和 component 组件注册器。

同种效果的两种实现：

```
extend 写法：

<div id="mount-point"></div>

// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
    }
  }
})

// 创建 Profile 实例，并挂载到一个元素上
new Profile().$mount('#mount-point')

```

```js
component写法：
<hello></hello>

Vue.component('hello',{
    template: '<p>{{firstName}}</p>',
    data: function () {
        return {
            firstName: 'Walter',
        }
    }
})
```

结果都是一样的：

```
<p>Walter</p>
```

extend写法还更恶心一点,经历了以下几步：

- 创建构造器
- new一个实例
- 挂载到特定的元素上
- 特定元素最终被完全替换

#### 问题：既然使用extend的写法更加复杂，那么为什么要使用它？它的优势在哪里？

重点：生成的实例并不一定要"挂载到一个元素上"。 new  组件构造器 ( ).$mount() 的$mount( ) 的参数可以为空，但它依旧能生成一个实例。生成的实例不挂载到dom文档流里面，生成的实例里面有$el这个参数，存放生成的dom，这个dom你想插哪里插哪里。（document.body.appendChild( 实例.$el）)



```
//创建一个“子类”,参数是一个对象，内部可以是组件中用到的选项
Vue.extend({ })
```





### 组件间通信

- props实现父传子
- $emit( )实现子传父

- Vue.prototype.$dispatch():实现自动向上触发所有祖先组件$emit( )事件，在vue1.0中使用，2.0中除去了。

  ```js
  在入口文件中写：
  Vue.prototype.$dispatch = function(eventName, ...args){
  	let parent = this.$parent
  	while(parent){  
  		parent.$emit(eventName,...args)
  		parent = parent.$parent      //这种情况下，如果父级和祖先组件中都有某个订阅事件名的话，那么会依次都触发
  	}
  }
  ```

- Vue.prototype.$broadcast():实现自动向下触发所有后代组件$emit( )事件

  ```js
  在入口文件中写：
  Vue.prototype.$broadcast = function(eventName, ...args){
  	let children = this.$children
  	function broad (children){
  		for(let index=0;index<children.length;index++){
  		children[index].$emit(eventName,...args)
              if(children[index].$children.length>0){
  				broad(children[index].$children)
              }
  		}
  	}
  	broad(children)
  }
  ```

- 快速同步数据：

  `<组件名 :attr='key' @updata:attr='newval => key = newval'></组件名>`  简写：

  `<组件名 :attr.sync='key'></组件名>`

  组件内部：

  ```
  props：{
  	attr:{ }	
  }
  methods:{
  	fun(neaval){
  		this.$emit(updata:attr, neaval)
  	}
  }
  ```

  <组件名 :value='key'  @input='newval => key = newval'></组件名>

  <组件名  v-model='key'></组件名>

  v-model 和.async的区别是 v-model的默认绑定的响应式数据就只能叫value，而.async则可以自定义。

  

- $attrs

- $listeners

给子组件标签绑定的一些标签属性如果没有在子组件内部没有使用props来注册，那么这些标签属性都（class和style属性除外）默认会添加到组件最外层的标签上，并且在$attrs中也能获取到。如果不想让组件的最外层标签上出现这些组件标签上的属性，那么可以在组件内部配置：inheritAttrs：false 或者 在子组件内部用props注册获取。

如果子组件希望将父组件以标签属性方式传递的数据全部完整的传递给自己的子代组件（孙组件），那么可以在子组件内部通过在自己子组件标签上直接使用 v-bind = "$attrs"  或者 v-on="$listeners" 直接进行展开传递给自己的子组件。



当开发者给组件标签上通过v-on绑定一些事件，当这些事件的事件名和js中原生事件名一样时，并不代表就是在组件上绑定了一个原生事件，还是相当于给组件的发布订阅事件池中添加了一个方法。如果想给组件绑定的就是原生事件，那么可以加上.native 以代表原生事件，那么该原生事件将被绑定到组件的最外层元素上。



- provide/inject

  在父组件中声明公共数据，在后代组件中注入。原理：在祖先组件上配置一个provide项，当后代组件注入时，可以沿着组件层级一层层往上查找，上层有提供provide的话就注册到后代组件自己的身上。

  不足：比较容易混乱，后代组件不停向上查找，不确定具体数据来自那个祖先组件。主要用于高阶插件或者组件库中。如果上层组件和上上层组件都提供了同名的属性，那么只取最近一层的那个组件的。

  **后代通过inject注入的数据不是响应式的**。

  ```
  祖先组件中：
  
  provide(){
  	return {
  		vm:this
  	}
  }
  
  后代组件中：
  方式一：
  inject:['vm']
  
  方式二：
  inject:{
  	vm1:'vm'  //起别名
  }
  
  方式三：
  inject：{
  	vm1:{
  		from: 'vm'
  		default:'null'
  	}
  }
  ```

- ref 

  作用是获取真实的dom元素，当ref被用在v-for生成的dom元素时，$refs才可能是一个数组，其他时候都是一个元素。如果用在组件标签上时，代表的就是当前组件的实例。（ref 不仅可以用在元素dom元素上，还可以用在组件上，而$children中存放的之后组件实例）



- eventBus（事件总集）：常常在main.js中向Vue的原型对象中添加一个属性$bus, ` Vue.prototype.$bus = new Vue() ` 。事件的发布和订阅者往往都是同一个实例对象。

  

- vuex



- $parent、$children、$root  (不建议在项目中使用，使用的话，这样提高了组件之间的耦合性。)

  $children中的注意情况，在父组件中使用到的子组件**如果没有异步组件的话**，则$children中组件的索引就代表着子组件在父组件中使用的顺序。 所以children的顺序不一定代表子组件出现的顺序。比如动态组件或v-if控制的组件。



### 插槽

有一部分内容需要在子组件中展示，但是要展示的内容刚开始并不知道，需要在父组件调用子组件时传入。在父组件使用子组件组件名标签的中间传递。

插槽分类：

- 匿名插槽

  ```
  com1中
  <div>
  	<h2>hello vue</h2>
  	<slot><slot>
  </div>
  
  
  父组件中
  <div>
  	<com1> learning vue </com1>
  </div
  ```

- 具名插槽

  ```
  com1中
  <div>
  	<h2>hello vue</h2>
  	<slot><slot>
  	<slot name='content'><slot>
  </div>
  
  
  父组件中
  <div>
  	<com1>
      <template v-slot:default>learning vue </template>
      <template v-slot:content>learning vue </template>
      </com1>
  </div>
  ```

- 作用域插槽

  在父组件中需要显示的数据或者内容来自的是子组件内部

  ```
  com1中
  <div>
  	<h2>hello vue</h2>
  	<slot :foo="foo"><slot>
  </div>
  
  
  父组件中
  <div>
  	<com1>
      <template v-slot:default="slotProps">{{ slotProps.foo }}</template>
      </com1>
  </div>
  ```

  

### 菜单组件

核心知识点：如何使用vue中的递归组件。





基于vue的快速开发工具：

npm install @vue/cli -g

npm install @vue/cli-service-global -g

### 基础语法

vue中的指令，表现形式是在html标签上的**自定义标签属性**（attribute），以 ‘v- ’ 开头。到vue框架解析完指定的模板html后，会移除这些自定义属性。



1. 插值表达式（“Mustache”语法 ）

   作用：在标签的**文本区域**插入内容，**表达式**可以是来自实例 data 上的属性，也可以是JavaScript表达式，表达式的返回结果会被转义为字符串（**基于json.stringify转为字符串**）后进行输出。Mustache 语法不能作用在标签的属性上，应该使用 v-bind 指令。插值表达式可能存在原始文本内容 "闪现"的问题。可以使用v-cloak指令加上css去解决。

   js表达式：执行某段代码且带有返回值的代码段

   

2. v-once

   参数：不接受参数

   作用：只渲染元素和组件**一次**。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

   

3. v-html=”表达式“ | v-text=”表达式“

   作用：可以对html代码进行渲染后输出。，表达式可以是来自实例 data 上的属性，也可以是JavaScript表达式。与v-text一样，会覆盖原本存在于标签文本区域的内容。

   

4. v-bind:参数=“表达式”

   给元素的属性动态的绑定某个数据，如img的src属性，简写是“:“

   标签的布尔属性：只要存在就意味着值为 `true`

   

5. v-if="表达式"

   作用：根据表达式的值的 truthiness 来有条件地渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 <template>，将提出它的内容作为条件块。当条件变化时该指令触发过渡效果。当和 `v-if` 一起使用时，`v-for` 的优先级比 `v-if` 更高。v-else-if/v-else，`v-else` 元素必须紧跟在带 `v-if` 或者 `v-else-if` 的元素的后面，否则它将不会被识别。

   ````javascript
   <h1 v-if="flag">控制标题是否显示与隐藏</h1>
   <h1 v-else = "flag">这是flag控制的else</h1>
   
   //等价于：（if和else必须是相邻的兄弟元素）
   <h1 v-if="flag">控制标题是否显示与隐藏</h1>
   <h1 v-else>这是flag控制的else</h1>
   ````

   `v-if` 是一个指令，所以必须将它添加到一个元素上。想通过 v-if 控制一组元素标签的显示于隐藏，可以把一个`< template >`元素当做不可见的包裹元素，并在上面使用 v-if。最终的渲染结果将不包含`< template >`元素。

   ```
   <template v-if="ok">
     <h1>Title</h1>
     <p>Paragraph 1</p>
     <p>Paragraph 2</p>
   </template>
   ```

   

6. v-show="表达式"

   通过控制元素的display操作来实现元素的显示与隐藏。带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display`。`v-show` 不支持 `<template>` 元素，也不支持 `v-else`。

   

   `v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。

   

7. v-on:事件名.事件修饰符=”表达式“  （#事件名=”表达式“ ）

   对于同一个事件，只能绑定一个事件处理函数。

   ```
   <button v-on:click="fun1($event,value1,value2)" v-on:click="fun2">点击</button>//点击时只执行fun1函数
   <button v-on:click="fun1 fun2">点击</button>  //报错
   <button v-on:click="fun1;fun2">点击</button>  //报错
   <button v-on:click="fun1,fun2">点击</button>  //报错
   ```

   对于给元素绑定事件，如果是html原生的标签元素，则可以用v-on成功绑定一些列的原生事件名。如果是给组件标签绑定事件的化，看似是给组件绑定的原生事件，其实给在给组件实例的事件发布订阅模型上绑定和JavaScript原生事件同名的自定义事件，如果想给组件标签绑定原生的标签事件，可以在事件名后面加上native修饰符。

   

   对于 v-on:click = "fun",这样不加括号时，处理函数中可以默认接受一个事件对象参数（event）

   对于 v-on:click = "fun（）",这样加括号时，处理函数中不会默认被传入一个事件对象参数（event）

   对于 v-on:click = "fun(data,$event)",这样加括号并传如其他参数时，再手动传入了事件对象，处理函数中会被传入一个其他参数加上事件对象参数（event）

   

8. v-pre：一个html元素上使用了该指令，表示让vue框架在解析到该元素时，跳过该元素及其内部所有后代元素的模板解析，即使内部使用了符合vue框架的指令或语法，也不进行解析。

   

9. v-model=“varity”

   `v-model` 本质上不过是语法糖，监听用户的输入事件以更新数据。     `v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue 实例的数据作为数据来源。

   给表单元素设置，实现试图和数据之间的双向数据绑定，先把数据绑定给表单元素，一般是赋值给表单元素的value；表单内容变=>对应的data数据变=>对应的用到该数据的视图重新渲染；在vue框架中给表单元素设置value等属性是没有意义的。

   

   `v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

   - **text 和 textarea 元素使用 `value` property 和 `input` 事件；**
   - **checkbox 和 radio 使用 `checked` property 和 `change` 事件；**
   - **select 字段将 `value` 作为 prop 并将 `change` 作为事件。**

   

   

   

10. v-for="(item,index) in arr | obj | number"

    可将数组或者对象渲染到一组元素中。在 `v-for` 块中，我们可以访问所有父作用域的 property。也可以用 `of` 替代 `in` 作为分隔符。在遍历对象时，会按 `Object.keys()` 的结果遍历，但是**不能**保证它的结果在不同的 JavaScript 引擎下都一致。

​	**指令参数：**

​	一些指令能够接收一个“参数”，在指令名称之后以冒号表示，一般是html标签的 attribute  属性或者js事件名。

​	从 2.6.0 开始，可以用**方括号**括起来的 JavaScript 表达式作为一个指令的参数，这种参数称为动态参数。动态参数预期会求出一个**字符串**，异常情况下值为 `null`。这个特殊的 `null` 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

​	在 DOM 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写。

```javascript
//循环数组：
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>


var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})

//循环对象：
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>

new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
```



Vue 更新使用 `v-for` 渲染的元素列表时，它默认使用“就地更新”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。这个默认的模式是高效的，但是**只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出**。v-for和key建议搭配使用，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 `key` attribute：不要使用对象或数组之类的非基本类型值作为 `v-for` 的 `key`。key的值用字符串或数值类型的值。

v-for也可以和`<template>`结合使用，以达到一次性渲染一组元素的目的。

扩展：

js中的几种循环：for循环 | while循环 | do while循环 | for in  |for of

```javascript
let arr = [10,20,30,40],
    obj = {
        name:'jack',
        age:19,
        gender:'男',
        13:'abc'
    }
for(let key in obj){
    //obj是对象时，key为属性名，obj[key]才为属性值，优先遍历属性名为数字的，会遍历到自定义在对象的构造函数原型的方法或属性，所以常在内部再次判断obj.hasOwnProperty(key)
    //obj是数组时，key对数组元素的索引值
}

for(let value of arr){
    //arr是数组时，value为每项元素值，不会遍历到原型上的方法和属性（自定义的也无法被遍历到）
    //无法直接遍历对象类型的值，只能遍历可被迭代的数据类型值
}

```



面试点：

v-for和v-if的联合使用情况。不推荐在同一元素上使用 `v-if` 和 `v-for`。当它们在同一个元素上时，v-for的优先级比 `v-if` 更高。这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。如果你的目的是有条件地跳过循环的执行，那么可以将 `v-if` 置于外层元素 (或`<template>`) 上。



v-for也可以正常使用与组件标签上。同时，当在组件上使用 `v-for` 时，`key` 现在是必须的。任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。为了把迭代数据传递到组件里，我们要使用 prop。



#### 自定义指令

指令本质都是对dom元素值的操作。

全局指令：

Vue.directive('指令名'，配置对象|函数)

私有指令：

与data，methods平级的一个配置选项directives中

```
directives: {
  指令名: 配置对象|函数
}
```

配置对象内部可以定义一下几种函数：

- bind( ){ }：只调用一次，指令第一次绑定到元素时,该指令被vue框架给解析到时调用。
- inserted( ){ }:被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update(){}:所在组件的 VNode 更新时调用
- componentUpdated(){}:指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
- unbind(){}: 只调用一次，指令与元素解绑时调用。

以上的这些回调函数在被触发时都会传入一些参数：

- `el`：指令所绑定的元素，可以用来直接操作 DOM。
- `binding`：一个对象，包含以下 property：
  - `name`：指令名，不包括 `v-` 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
- `vnode`：Vue 编译生成的虚拟节点。
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

#### 计算属性（computed）

当一个数据的结果依赖于多个其他数据的值时或者这个数据的值需要较为复杂的逻辑处理时，这个数据就可以考虑使用计算属性来进行定义。

```
方式一：
computed:{
	属性名：{
		get(){
		
		},
		set(newComputedPropertyValue){
		
		}
	}
}

方式二：
computed:{
	属性名：{
		get:function(){
			...
			return value
		},
		set:function(newComputedPropertyValue){
			...
		}
	}
}

方式三：
computed:{  //这种写法默认只设置了计算属性的getter方法
	属性名(){
	
	}
}

方式四：
computed:{  //这种写法默认只设置了计算属性的getter方法
	属性名：function(){
	
	}
}
```

​	

```
let dirty = true
function initComputed(key,handler){
	let value
	Object.defineProperty(vm,key,{
		get(){
			if(dirty){
				value = handler()
				dirty = false
			}
			return value
		}
	})
}

initComputed('属性名', ()=>{
	return data中数据修饰后的结果
})
```

计算属性的处理函数中是无法进行异步操作的，因为计算属性的处理函数是通过defineProperty内的get或者set函数调用的，所以无法获得异步操作的结果。

许多应用场景中，用计算属性和侦听属性和方法都可以实现，但是要理解他们之间的区别。**计算属性是基于它们的响应式依赖进行缓存的。**相比之下，每当触发重新渲染时，调用方法将**总会**再次执行函数。



#### 侦听属性（watch）

侦听属性监听的是已经在data中初始化好的数据。当需要在数据变化时执行异步或开销较大的操作时，可以设置属性的侦听属性。

```
watch:{
	property1:function(newProperty1Val，oldProperty1Val){
		
	},
	property2:function(newProperty2Val){
		
	}，
	 property3:{
         handler(newValue){

        },
        immediate:true，		//立即执行handler函数
        deep:true，       //深度监控，如果监视的属性的值一个对象，那对象内部的属性也会被监控
        lazy:true        //加上lazy:true 就是computed的实现
     }
}


function initWatch(watch){
	for(let key in watch){
		vm.$watch(key,watch[key])
	}
}

initWatch(
    {
        property1:function(newProperty1Val，oldProperty1Val){
	
        },
        property2:function(newProperty2Val){

        },
        property3:{
        	handler(newValue){
        		
        	},
        	immediate:true，		//立即执行handler函数
        	deep:true，       //深度监控，如果监视的属性的值一个对象，那对象内部的属性也会被监控
        	lazy:true        //加上lazy:true 就是computed的实现
        }
    }
)
```

computed与watch有时能实现相同的功能。这两个方法底层都是借助new Watcher实现。

computed内部会有缓存，如果依赖的属性没有变化，则不会重新执行对应函数。computed内部使用的是Object.defineProperty

watch监听的值在每次变化后都能监听到并执行对应回调。



**动态绑定Class **

用v-bind动态绑定class和style，而他们的值则取决于表达式的返回结果。表达式结果的类型除了字符串之外，还可以是对象或数组。

```
对象：

<div id='#app'>
	<p v-bind:style="{类名1:property1,类名2：property2}"></p>
</div>
类名1与类名2存在与否将取决于数据 property1与property2的真假。v-bind:class 指令也可以与普通的 class attribute 共存。

<div class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>

绑定的数据对象不必内联定义在模板里：
<div v-bind:class="classObject"></div>
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}

绑定一个返回对象的计算属性：
<div v-bind:class="classObject"></div>
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```



```javascript
数组:
<div v-bind:class="[activeClass, errorClass]"></div>
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}

在数组中使用三元表达式：
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>

数组和对象混用：
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```





#### 在组件中使用class类

当在一个自定义组件上使用 `class` property 时，这些 class 将被添加到该组件的根元素上面。这个元素上已经存在的 class 不会被覆盖。

```
Vue.component('my-com',{
	template:"<p class="foo bar">这是一段文字</p>"
})

<my-com class="boo baz"></my-com>

渲染结果：
<p class="foo bar baz boo">Hi</p>

<my-component v-bind:class="{ active: isActive }"></my-component>
当 isActive 为 truthy时，HTML 将被渲染成为：
<p class="foo bar active">Hi</p>
```



#### 绑定内联样式

v-bind:style写法和css很像，但本身是一个 JavaScript 对象。其中的cssproperty 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名。

```
方式一：
<p v-bind:style={ fontSize:fontSize + 'px',color: activeColor,'bacground-color:'blue'  }></p>

data: {
  activeColor: 'red',
  fontSize: 30
}

方式二：
直接绑定到一个样式对象
<div v-bind:style="styleObject"></div>
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}

方式三：对象语法也可以结合返回对象的计算属性使用。

方式四：v-bind:style 的数组语法可以将多个样式对象应用到同一个元素上：
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

#### 自动添加前缀

当 `v-bind:style` 使用需要添加浏览器引擎前缀的 CSS property 时，如 `transform`，Vue.js 会自动侦测并添加相应的前缀。

`<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>` 

#### 多重值

```
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的 flexbox，那么就只会渲染 display: flex。
```



#### 用 `key` 管理可复用的元素

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。如果你允许用户在不同的登录方式之间切换：

```javascript
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，`<input>` 不会被替换掉——仅仅是替换了它的 `placeholder`。这样就出现了bug。

只要通过key作为标签属性就好，表达“这两个元素是完全独立的，不要复用它们”。添加一个具有唯一值的 `key` attribute 即可。每次切换时，输入框都将被重新渲染。

```javascript
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```



### vue动画

vue中的动画只有在有 v-if 、v-for、v-show、路由切换情况下才有效。









### jsx语法和render函数



### message组件

在element-ui中的消息弹框组件是加在body标签的最后作为body的子元素的，而并不是加在vue实例所挂载的入口节点内的。

重点：

- 函数式组件的使用
- 点击按钮创建一个组件，并将组件手动渲染到body上，vm.$mount()   +  document.body.appendChild ( vm.$el )



```
//入口js文件
import Vue from 'vue'
import App from './App.vue'

let vm = new Vue({
	el:"#app",
	render:h=>h(App)
})
```

```vue
//跟组件实例
<tempate>
    <div>
        <button @click="show">点击弹出弹框</button>
    </div>
</tempate>

<script>
import message from './message.js'
export defualt {
    methods:{
        show(){
            message.success(options)
        }
    }
}
</script>
```



````js
//message.js文件
import Message from './component/message.vue'
import Vue from 'vue'

const message={
	success(options){
		let vm = new Vue({
			render: h=>h(Message)
		}).$mount()
		document.body.appendChild ( vm.$el )
	}
}

export {
	message
}
````

```vue
//message.vue
<tempate>
    <div>
        弹出框内容
    </div>
</tempate>

<script>
import message from './message.js'
export defualt {
    methods:{
        show(){
            message.success(options)
        }
    }
}
</script>
```







Vue框架中的use方法在使用的时候默认会调用传参内部的install方法

### 事件与数据更新的先后顺序

对于click事件，事件处理函数要先于data中数据的修改，如果事件被触发，同时函数内部用到了某个data中的数据的值做判断，那么，在函数中取该data中数据时，取得是数据更新之前的旧数据。

如全选与全不选

```javascript
html部分
<div id="app">
    <input type="checkbox" v-model = 'isAll' @click='checkAll'>
    <br/>
    <input type="checkbox" v-model='hobbies' value="js">编程
    <input type="checkbox" v-model='hobbies' value="read">阅读
    <input type="checkbox" v-model='hobbies' value="run">跑步
    <input type="checkbox" v-model='hobbies' value="eat">吃饭
</div>

js部分
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.4/vue.js"></script>
  <script>
    const vm = new Vue({
    el:'#app',
    data:{
      hobbies:[],
      isAll:false
    },
    methods: {
      checkAll(){
        if(this.isAll){
          this.hobbies=['js','read','eat','run']
        }else{
          this.hobbies=[]
        }
      }
    }
  })
</script>
```

对于change事件，事件处理函数要晚于data中的数据更新,在事件处理函数中获取相应的数据时，数据是已经更新之后的内容。



过滤器方法名可以的data中或者methods中的方法名相同，因为过滤器名并不会挂在到vue实例上，所以不会冲突。过滤器可以用在插值表达式和v-bind中，而不能放在其他指令上。



template，模板字符串会在vue框架中被编译到render函数中，在定义了render函数时，优先取用render函数，其次是template ，最后才是el指定的模板内容。render 或者  template=>render  或者  el=>template=>render。 在有template选项和el选项同时存在时，vue是将template选项对应的模板进行解析渲染后替换el指定的入口元素。

### 组件化

在vue中，一个组件就是一个vue实例，它有自己的模板**template**、data（函数返回对象）、methods等其他配置对象中的配置选项和生命周期函数。在以组件标签使用组件时，就是在创建一个组件实例。

组件的话，可以分为全局组件和私有组件。

全局组件：

```
Vue.component('组件名',{
	template： 'html代码',
	......
})
在vue实例所管理的html模板中实例化使用组件：
<组件名></组件名>
```



vue组件，定义的组件在el绑定的外部模板字符串中使用时，最好使用双标签和 短横线分割多个单词的形式使用。在template绑定的模板字符串中使用时，可以使用单标签和大写字母的形式。组件的template或者render相当于组件的渲染模板，只能有一个根节点。

slot插槽渲染过程：

在解析父组件模板时，发现子组件的标签名，然后去解析子组件及其模板，当解析子组件模板时，发现模板中使用了slot标签，那就去父组件中使用到子组件标签名的地方，找到写在标签名中间的内容，并替换掉对应slot。

在子组件的标签中间写多个标签时，默认它们会渲染到所有slot默认名为 defulte中。如果要实现不同部分分开填充到不同slot中 ，可以在组件标签中，使用 v-slot =‘插槽名字’，结合一个组件模板中可以放置多个对应剧名的插槽达到目的。v-slot可以放在 template标签上，也可以放在html标签上。

#### 响应式数组数据

vue底层重写了数组的一些方法，从而达到在调用数组的这些方法时，可以触发视图的更新。

vue中重写的数组方法有：

- push
- pop
- shift
- unshift
- reverse
- sort
- splice

只重写了这些方法的原因是，他们会对原数组造成影响。对于不会变更原始数组，而**总是返回一个新数组的**数组方法。当使用非变更方法时，可以用新数组替换旧数组。这样做并不会让原本渲染的列表元素销毁，而是尽可能的重用已有元素。

```javascript
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```







## MVVM源码解析

### 铺垫

vue源码分析——MVVM原理

- 数据代理
- 模板解析
- 数据绑定



基础知识点：

**Array.prototype.slice.call ( obj )** :将伪数组转为真数组。

伪数组：

- 属性名是连续的数字
- 有length属性
- 本质是对象

Array.prototype.slice（）: 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**（包括 `begin`，不包括`end`）。原始数组不会被改变。 



**node.nodeType:**返回节点类型

元素节点的nodeType值为1

属性节点的nodeType值为2

文本节点的nodeType值为3



**Object.defineProperty(obj ,key ,属性描述符（数据/访问描述符）)**：给对象添加或者修改属性

属性描述符配置对象中的可选值：

configurable：该属性是否可以重新以defineProperty方法进行定义或者是否能删除

enumerable：该属性是否可以被for in枚举

value：该属性对应的属性值

writable：该属性的值是否可以修改

get：回调函数，当属性被访问时，根据其他相关属性动态返回对应值

set：回调函数,监听当前属性值改变并调用该回调函数



**Object.keys( obj )**：返回对象**自身可枚举的**属性组成的数组



**obj.hasOwnProperty( prop )**:判断prop是否是对象自身上的属性



**DocumentFragment**：文档碎片（高效批量处理多个节点）创建一个只存在于内存当中的节点对象，相当于一个轻量的document节点，内部存储由节点（nodes）组成的文档结构。与document相比，最大的区别是DocumentFragment 不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，不导致性能问题。

创建：可以使用`document.createDocumentFragment方法或者构造函数来创建一个空的 `DocumentFragment。

常用用法：

使用文档片段作为参数（例如，任何 `Node`接口类似 `Node.appendChild`和 `Node.insertBefore` 的方法），这种情况下被添加（append）或被插入（inserted）的是**片段的所有子节点, 而非片段本身**。因为所有的节点会被一次插入到文档中，而这个操作仅发生一个重渲染的操作，而不是每个节点分别被插入到文档中，因为后者会发生多次重渲染的操作。









### **数据代理**

一个对象代理另一个对象中属性的操作

vue中的数据代理是vue实例对象代理了配置对象中data上的属性，让vm._data.key的取值方式可以直接写为vm.key的方式。

```JavaScript
let vm = new MVVM({
    el:'#app',
    data:{
        name:'jack'
    }
})


//下面这部分式mvvm.js中的代码：
function MVVM(options){
    this.$options = options  //将配置对象存在vm实例上
    var data = this._data = this.$options.data  //将配置对象的data属性存在vm实例上
    var me = this  //用简单的me单词指代this
    
    //实现数据代理
    Object.keys(data).forEach(function (key){  //遍历配置对象中data上自有属性
        me._proxy(key)   //对data上的自有属性代理到vm实例上，该方法在vm的原型上
    })
}

MVVM.prototype = {
    //实现数据代理
    _proxy:function(key){
        var me = this  //vm实例
        Object.defineProperty(me,key,{  //给vm上添加data中的属性 
            configurable:false,  
            enumerable:true,
            get:function proxyGetter(){
                return me._data[key]
            },
            set:function proxySetter(newVal){
                me._data[key] = newVal
            }
        })
    }
}
```





### **模板解析**

模板：html嵌套js代码，其中js代码以指令属性或者表达式{{ xxx }}的方式存在于html模板中。解析模板就是在解析字符串的过程中，让指令属性或者表达式生效。

#### 对大括号表达式的解析：

```javascript
<div id ='app'>
    <p>{{ name }}</p>
</div>

new MVVM({
    el:'#app',
    data:{
        name:'jack'
    }
})

//下面这部分式mvvm.js中的代码：
function MVVM(options){
    this.$options = options  //将配置对象存在vm实例上
    var data = this._data = this.$options.data  //将配置对象的data属性存在vm实例上
    var me = this  //用简单的me单词指代this
    
    //省略了数据代理步骤
    
    //实现模板解析
    this.$compile = new Compile(options.el||document.body,this)  //创建了一个compile实例对象，并将根节点el和vm实例传入
    
}




//下面这部分是compile.js中的代码：
Compile构造函数部分
function Compile( el, vm ){
    this.$vm = vm  //vm实例保存到compile实例对象上
    //先判断el是不是一个元素节点或者是个css选择器字符串
    this.$el =this.isElementNode(el) ? el:document.querySelector(el)
    
    if(this.$el){ //如果el对应的节点存在，则开始进行模板解析步骤
        
        this.$fragment = this.node2Fragment(this.$el)  //获取内存中存放的文档片段，执行到这一步时，页面为空，因为页面的节点都转移到$fragment（在内存中）上去了
        
        this.init()   //最重要的一步，用来解析模板，实现初始化显示
        
        this.$el.appendChild(this.$fragment)  //将编译好的$fragment添加回页面中去，页面显示解析后的结果
    }
}


Compile的原型部分
Compile.prototype ={
    isElementNode：function(node){
        return node.nodeType == 1
    }，
    
    node2Fragment：function(el){  
        var fragment = document.createDocumentFragment(), //创建一个文档片段
            child
        while(child == el.firstChild){  //不断循环取出根节点的子元素并移动到内存中的fragment内部去,包括文本节点和元素节点
            fragment.appendChild(child)
        }
        return fragment
    }，
    
    init:function(){
        this.compileElement(this.$fragment)  //this.$fragment是内存中的文档片段
    },
        
    compileElement:function(el){
        var childNodes = el.childNodes,  //取出文档片段最外层所有子节点
            me = this  //compile实例
        [].slice.call(childNodes).forEach(function(node){ //遍历每个子节点
            var text = node.textContent
            var reg = /\{\{(.*)\}\}/    //用来匹配 {{}} 表达式，并分组
            if(me.isElementNode(node)){  //判断是否为元素节点
                
                me.compile(node)  //这条语句是用来遍历节点上的指令属性的 ，不是表达式解析步骤
                
            } else if ( me.isTextNode(node)&&reg.test(text)){  //判断是否为文本节点且符合正则
                
                me.compileText(node,RegExp.$1)  //RegExp.$1是正则的分组
                
            }
            if(node.childNodes && node.childNodes.length){  //p判断子节点是否还有子节点
                me.compileElement(node)  //递归遍历子节点
            }
        })
    }，
    
    compileText：function(node, exp){
        compileUtil.text(node,this.$vm,exp) //工具函数
    }
    
    
}

Compile中的工具函数部分，独立于Compile实例和Compile原型,存放的都是编译指令相关的方法
从这里可以看出 v-text 与 {{}}在vue源码中用的是同一个方法。 

var compileUtil = {
    text:function(node, vm, exp){  //注意text函数内部的this指向的是compileUtil对象
        this.bind( node,vm,exp,'text') //node：文档片段中的某个节点，vm是vm实例，exp是正则匹配到的分组数据，本质是配置对象data上对应的属性名
    },
    
    html:function(node, vm, exp){
        this.bind( node,vm,exp,'html')
    },
    
    model:function(node, vm, exp){
        this.bind( node,vm,exp,'model')
    },
    
    bind:function (node,vm,exp, dir){
        var updateFn = updater[dir+'Updater']
        updateFn && updateFn(node,this._getVMval(vm,exp))
    }，
    
    _getVMval：function(vm ,exp){   
        var val = vm.data
        exp = exp.split('.')  
        exp.forEach(function(k){  
            val = val[k]  //实现对key.key2.key3这种嵌套对象的数据的提取
        })
        return val 
    }
}



//另一个工具函数对象，从个工具函数对象中可以看出，vue的指令底层都是在进行一些列的dom操作
var updater = {
    //跟新节点的textContent属性值
    textUpdater:function(node,value){
        node.textContent = typeof value == 'undefined' ? '': value
    }
}

```



#### 对指令的解析

##### 事件指令解析

```javascript
<div id="app">
    <p>{{ name }}</p>
	<button v-on:click='show'>提示</button>
</div>

<script>
  new MVVM({
  	el:'#app',
    data:{
      name:'jack'
    },
    methods:{
        show(){
            alert(this.name)
        }
    }
  })
</script>



//指令的解析属于模板解析的一部分，所以前面的代码逻辑都相同，在这里只写不同的代码部分，下面这部分是compile.js中的代码：


if(this.$el){ 

    this.$fragment = this.node2Fragment(this.$el) 

    this.init()   //最重要的一步，用来解析模板，实现初始化显示，内部

    this.$el.appendChild(this.$fragment)  
}



Compile的原型部分
Compile.prototype ={
    init:function(){
        this.compileElement(this.$fragment)  //this.$fragment是内存中的文档片段
    },
        
    compileElement:function(el){
        var childNodes = el.childNodes,  //取出文档片段最外层所有子节点
            me = this  //compile实例
        [].slice.call(childNodes).forEach(function(node){ //遍历每个子节点
            var text node.textContent
            var reg = /\{\{(.*)\}\}/    //用来匹配 {{}} 表达式，并分组
            if(me.isElementNode(node)){  //判断是否为元素节点
                
                //该方法定义在compile实例对象的原型上
                me.compile(node)  //++++++++++++++++++++++++++,先进入p标签，再进入button标签
                
            } else if ( me.isTextNode(node)&&reg.test(text)){  //判断是否为文本节点且符合正则
                
                me.compileText(node,RegExp.$1)  //RegExp.$1是正则的分组
                
            }
            if(node.childNodes && node.childNodes.length){  //p判断子节点是否还有子节点
                me.compileElement(node)  //递归遍历子节点
            }
        })
    }，
    
    compile:function(node){
        var nodeAttrs = node.attributes,  //得到元素节点上所有的属性节点组成的伪数组
            me = this //compile实例
        
        [].slice.call(nodeAttrs).forEach(function (attr){ //遍历所有属性节点 
            
            var attrName=attr.name   //attrName='v-on：click'
            if(me.isDirective(attrName)){  //判断当前的属性是否为指令属性
                var exp = attr.value  //得到属性节点的属性值 ，exp = ‘show’
                var dir = attrName.substring(2)  //截取指令 dir = 'on:click' 
                
                if(me.isEventDirective(dir)){ //判断指令是否为事件指令
                    compileUtil.eventHandler(node,me,$vm,exp,dir)  //处理事件指令的关键函数
                }else{
                    compileUtil[dir] && compileUtil[dir](node,me.$vm,exp) //处理一般指令
                }
                node.removeAttribute(attrName)  //移除指令属性
            }
        })
    }，
    
    isDirective:function(attr){   //vue框架的指令都是以v-开头，不以v-开头就不是指令
        return attr.indexOf('on') === 0 
    }，
    
    isEventDirective:function(dir){  //事件指令以on开头
        return dir.indexOf('on')  === 0
    }
    
    
}

Compile中的工具函数部分，独立于Compile实例和Compile原型,存放的都是编译指令相关的方法
从这里可以看出 v-text 与 {{}}在vue源码中用的是同一个方法。 

var compileUtil = {
    
    eventHandler:function(node,vm,exp,dir){  //node：button元素，vm是mvvm实例，exp为show，dir为”on:click“
        var eventType = dir.split(':')[1],  //得到事件类型click
            fn = vm.$options.methods &&  vm.$options.methods[exp]
        if(eventType && fn){  //完成绑定事件监听
            node.addEventListener(eventType,fn.bind(vm),false)
           //注意这里：fn.bind(vm)  ，这并不是直接绑定methods中的函数给元素节点，而是用bind方法绑定了this的函数，所以在vue的methods函数内部，可以通过this.key取data中的数据使用。
            
        }
    }

}

```



##### 一般指令解析

```javascript
<style>
  .active{
      font-size:20px;
  }
  .default{
      color:pink;
  }
</style>

<div id="app">
    <p v-text='msg'></p>
    <p v-html='msg'></p>
    <p class='default' v-class='myClass'>123</p>
</div>

<script>
  new MVVM({
  	el:'#app',
    data:{
      msg:'<a href="http://www.baidu.com">百度</a>',
      myClass:'active'
    }
  })
</script>

//指令的解析属于模板解析的一部分，所以前面的代码逻辑都相同，在这里只写不同的代码部分，下面这部分是compile.js中的代码：
Compile.prototype ={
    init:function(){
        this.compileElement(this.$fragment)  //this.$fragment是内存中的文档片段
    },
        
    compileElement:function(el){
        var childNodes = el.childNodes,  //取出文档片段最外层所有子节点
            me = this  //compile实例
        [].slice.call(childNodes).forEach(function(node){ //遍历每个子节点
            var text node.textContent
            var reg = /\{\{(.*)\}\}/    //用来匹配 {{}} 表达式，并分组
            if(me.isElementNode(node)){  //判断是否为元素节点
                
                //该方法定义在compile实例对象的原型上
                me.compile(node)  //++++++++++++++++++++++++++
                
            } else if ( me.isTextNode(node)&&reg.test(text)){  //判断是否为文本节点且符合正则
                
                me.compileText(node,RegExp.$1)  //RegExp.$1是正则的分组
                
            }
            if(node.childNodes && node.childNodes.length){  //p判断子节点是否还有子节点
                me.compileElement(node)  //递归遍历子节点
            }
        })
    }，
    
    compile:function(node){
        var nodeAttrs = node.attributes,  //得到元素节点上所有的属性节点组成的伪数组
            me = this //compile实例
        
        [].slice.call(nodeAttrs).forEach(function (attr){ //遍历所有属性节点 
            
            var attrName=attr.name   //attrName='v-on：click'
            if(me.isDirective(attrName)){  //判断当前的属性是否为指令属性
                var exp = attr.value  //得到属性节点的属性值 ，exp = ‘show’
                var dir = attrName.substring(2)  //截取指令 dir = 'on:click' 
                
                if(me.isEventDirective(dir)){ //判断指令是否为事件指令
                    compileUtil.eventHandler(node,me,$vm,exp,dir)  //处理事件指令的关键函数
                }else{
++++++++++++++++    compileUtil[dir] && compileUtil[dir](node,me.$vm,exp) //处理一般指令
                }
                node.removeAttribute(attrName)  //移除指令属性
            }
        })
    }，
    
    isDirective:function(attr){   //vue框架的指令都是以v-开头，不以v-开头就不是指令
        return attr.indexOf('on') === 0 
    }，
    
    isEventDirective:function(dir){  //事件指令以on开头
        return dir.indexOf('on')  === 0
    }
    
    
}

var compileUtil = {
    text:function(node, vm, exp){  //注意text函数内部的this指向的是compileUtil对象
        this.bind( node,vm,exp,'text') //node：文档片段中的某个节点，vm是vm实例，exp是正则匹配到的分组数据，本质是配置对象data上对应的属性名
    },
    
    html:function(node, vm, exp){
        this.bind( node,vm,exp,'html')
    },
    
    model:function(node, vm, exp){
        this.bind( node,vm,exp,'model')
    },
    
    class:function(node,vm,exp){
        this.bind(node,vm,exp,'class')
    }
    
    bind:function (node,vm,exp, dir){
        //这两步实现的是对指令或者大括号表达式的初始化显示
        var updateFn = updater[dir+'Updater']
        updateFn && updateFn(node,this._getVMval(vm,exp))
        
        
        //这一步对应的是数据对应的更新显示（视图跟新）在模板中使用到的每一个表达式，也就是使用到的指令对应的值 （v-text=”msg“中的msg 或者{{ msg}} 中msg），都有一个对应的监视器
        new Watcher(vm,exp,function(value,oldValue){  //这个回调是在调用updater工具函数中的函数进行节点的更新
            updateFn() && updateFn(node,value,oldValue)
        })
        
    }，
    
    _getVMval：function(vm ,exp){   
        var val = vm.data
        exp = exp.split('.')  
        exp.forEach(function(k){  
            val = val[k]  //实现对key.key2.key3这种嵌套对象的数据的提取
        })
        return val 
    }
}


//另一个工具函数对象，从个工具函数对象中可以看出，vue的指令底层都是在进行一些列的dom操作
var updater = {
    //跟新节点的textContent属性值
    textUpdater:function(node,value){
        node.textContent = typeof value == 'undefined' ? '': value
    },
    
    htmlUpdater:function(node,value){
        node.innerHTML = typeof value == 'undefined' ? '': value
    },
    
    classUpdater:function(node,value,oldValue){
        var className = node.className //取出原有的class，因为v-class可以和 class混用
        className = className.replace(oldValue,'').replace(/\s$/,'')
        var space = className && String(value) ? ' ':''
        node.className = className +space +value
    }
}
```



### 数据绑定

​	在分析源码之前，先对它的概念和用法表现有一个基本的了解。

​	什么是数据绑定：

​	数据绑定：先是页面显示，再是 一旦更新了data中的某个属性数据，所有界面上直接使用或者间接使用（计算属性）了该属性的节点都会自动更新。重点在更新界面的实现。



​	数据劫持：**数据劫持是vue中用来实现数据绑定的一种技术**。基本思想是用defineProperty（）来监视data中所有属性（任意层级）的数据的变化，一旦变化就去更新界面。



​	在前面的数据代理中，它并不是数据绑定，它不是给data中的属性添加get或者set方法，而是将data中的数据通过defineProperty（）代理到了vm实例上。 而数据绑定是给data上的属性添加get与set方法。

​	当数据改变时，先触发vue实例上的属性的set方法，然后又通过set方法改变了data上的对应数据，并触发data上数据的set方法，触发视图更新操作。





```javascript
<div id="app">
    <p>{{ name }}</p>
	<button v-on:click="change">更改name</button>
</div>

<script>
  new MVVM({
  	el:'#app',
    data:{
      name:'jack'
    },
    methods:{
        change(){
            this.name = 'tom'
        }
    }
  })
</script>


mvvm.js文件中
function MVVM(options){
    this.$options = options
    var data = this._data = this.$options.data
    var me = this
    
    Object.keys(data).forEach(function(key){
    	me._proxy(key)
    })  //实现数据代理
    
    observe(data,this) //更新数据绑定的起点，在模板编译之前就实现了对数据的观测
    
    this.$compile = new Compile(options.el||document.body,this) //实现数据与指令的初始化渲染 模板渲染
        
}



observer.js文件中：
function observe(value,vm){  //value是配置对象中的data对象 
    if(!value || typeof value !=='object') {  //也作为递归结束的条件
        return
    }
    return new Observer(value) //创建了一个观察者实例对象，观察data中所有的属性
}

function Observer(data){ 
    this.data = data  //将data保存在observer实例上
    this.walk(data)  //开始对data属性的劫持
}

Observer.prototype ={
    walk:function(data){ 
        var me = this   //this是observer实例
        Object.keys(data).forEach(function(){  //配置对象的data
           me.defineReactive(me.data,key,data[key])  //实现数据绑定的函数
        })
    },
    
    defineReactive：function( data,key,val ){
        var dep = new Dep()   //为每个data中的属性添加劫持的同时，创建对应该属性的dependence
        
        var childObj = observe(val)  //递归data中的属性值，以实现层级数据的响应
        
        Object.defineProperty(data,key,{   //将原来data上存在的数据重新定义
            enumerable:true,
            configurable:false,
            get：function(){
                if(Dep.target){  //建立dep与watcher之间的联系
                    dep.depend()
                }
                return val
            }，
            
            set：function(newVal){  //监视key属性的变化，变化后可也触发dep调用watcher更新视图
                if(newVal ===val){
                    return
                }
            	val = newVal
            	childObj = observe(newVal)  //对新设置的对象类型的属性值进行侦听
            	dep.notify()  //通知dep实例上的subs属性中存放的watcher ，每个dep都对应着一个data中的属性
            }
            
        })
    }
	
    
}

var uid= 0
function Dep(){  //Dep实例是在初始化时给data的属性进行数据劫持的时候创建的，创建的dep实例个数取决于data上的数据（包括有层级关系的内层数据）
    this.id =uid++  //id是Dep实例的标识属性
    this.subs=[]  //内部放的都是一个个的watcher实例
}

Dep.prototype ={
    notify(){
        this.subs.forEach(function(sub){  //sub是某个对应的watcher
            sub.update()
        })
    }，
    addSub(sub){  //添加watcher到dep中
        this.subs.push(sub)
    },
        
    removeSub(sub){
        var index = this.subs.indexOf(sub)
        if(index != -1){
            this.subs.splice(index,1 )
        }
    },
        
    depend(){  //建立dep与watcher之间的关系
        Dep.target.addDep(this)
    }
    
}
Dep.target = null




watch.js文件中
function Watcher(vm,exp,cb){
    this.cb = cb   //更新界面的回调，对应compiler.js文件中的updater工具函数对象，new Watcher是在compiler.js中渲染指令的时候执行的
    this.vm= vm
    this.exp = exp  // 指令表达式
    this.depIds = {}  //包含所有相关的dep容器对象
    this.value = this.get()  //得到当前表达式对应的value（旧值）
}

Watcher.prototype={
   
    update(){
        this.run()
    },
    
    run(){
        var value = this.get()
        var oldVal = this.value
        if(value !==oldVal){
            this.value = value
            this.cb.call(this.vm,value,oldVal)  
        }
    }，
    
    addDep(dep){  //判断dep与watcher关系是否建立
        if(!this.depIds.hasOwnProperty(dep.id)){
            dep.addSup(this)   //将watcher添加到dep中
            this.depIds[dep.id] = dep  //将dep添加到watcher中
        }
    }，
    
     get(){
        Dep.target = this
        var value = this.getVMVal()
        Dep.target = null
        return value
    }，
    
    getVMVal(){
        var exp = this.exp.split('.')
        var val = this.vm._data
        exp.forEach(function(k){
            val= val[k]
        })
        return val
    }
}
```







## vuex

公共状态管理插件，只能实现同一个根实例下的所有组件之间的通信。vuex对于数据状态的管理可以看作一种模式。在它身上可以看到一些的设计模式思想。它集中存储并管理所有组件实例都会用到的状态。

一个大型的项目由一些列的组件组成，如果组件之间的通信借助props时，对于多层组件的嵌套之间通信会非常繁琐，同时也无法解决兄弟组件之间的通信。

vuex把组件的共享状态抽取出来，以一个**全局单例模式**管理。它将状态的定义和状态的管理彼此分开，达到解耦效果。

可以自定义一些vue的插件，vue的插件利用Vue.use引入。想要写vue的插件，则该插件模块应该暴露一个install方法。Vue构造函数通过use方法（Vue.use(插件)），向插件内部暴露的install（）这个方法传入的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象。

开发者在使用vue官方提供的插件（如：vue-rooter与vuex）时，在通过Vue.use(插件)该步骤后，**为什么我们在项目中可以直接使用`$router $store`来获取其中的值以及一些方法； ** **为什么使用这俩插件都是先用Vue.use引入。然后才创建实例，在Vue实例中传入；**

插件模块内部的基本骨架：

```javascript
class Router {  //c插件构造函数
    constructor(options) {
        ...
    }
}

Router.install = function(_Vue) { //插件模块提供的install方法 ，_Vue为Vue构造函数
    _Vue.mixin({  //_Vue.mixin全局混入是什么呢？相当于在所有的实例与组件中混入这个方法；
        beforeCreate() {  //beforeCreate在这里的作用是什么？；
            if (this.$options.router) {
                _Vue.prototype.$router = this.$options.router
            }
        }
    })
}

export default Router; //向外暴露该插件
```



vuex是vue的一个插件，vuex本身是一个js模块，内部有向外暴露属性与操作这些属性的方法。作用：能让一个应用中同一个根实例中的所有组件或者vue实例共享一个第三方对象内的属性或方法（数据）。 

vuex之前的通信：

- 多个组件实例之间都要用到同一个数据，同时各个组件中的某些行为或者事件都会修改同一个数据
- 之前需要通过繁琐的方式在组件之间传递数据与方法

![image-20210317212617539](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210317212617539.png)



vuex仿写：

```javascript
//vuex.js
//因为Vue.use()方法会首先调用vue插件暴露的install方法并传入vue构造函数，所以插件内有install方法
let Vue 
const install = function(_Vue){
    Vue = _Vue  //_Vue是vue构造函数
 	Vue.mixin({ 
        beforeCreate(){
            //为什么不将$store放在原型上？
            // Vue.prototype.$store  如果采用这种方式的话，全局的Vue构造函数的原型上就有了$store，那么在同一个项目中创建多个根实例后，它们都能访问到$store了。
            
            //在每个实例被创建之前执行（这个函数内部的this就是每个对应的vue实例对象）：先拿到根实例配置对象options上配置store实例，然后给每个vue实例添加$store属性。
            //如何拿到option中的store实例了？
            if(this.$options && this.$options.store){//如果this.$options存在，说明这是的this是根实例
                this.$store = this.$options.store   //this.$options.store   就是new Vuex.Store()生成的实例对象
            } else{
                //进入这一步的说明都是某个跟实例的后代组件实例
                this.$store =this.$patent && this.$patent.$store
            }
            
        }
    })  //可以在所有的组件中混合一些方法或者属性   
}
//install方法执行完成后，项目中所有的实例（组件实例）都添加了一个共同的$store属性对象



//工具函数
const forEach = (obj,cb)=>{ //用于迭代配置对象中mutations，getters等
     Object.keys(obj).forEach((key)=>{
         cb(key,obj[key])
     }
}



//new Vuex.Store({state:{}, mutations:{},actions:{}，getters:{}})
class Store{
    constructor(options = {}){
         
         
        //将共享状态放在了store中
        //this.state = options.state   //这样写state中的数据是非响应式的，数据改变无法驱动试图改变
        this.state =new Vue({
            data(){
                return {state:options.state} //state中的数据被Vue劫持过了
            }
        })   //vuex中最核心的部分：实现state中数据的响应式，如果这些这步的话，在组件实例中取用时要写成$store.state.state.key ,多了一层，为此要用到类的访问器
        
         
         
        
        let getters =options.getters
        this.getters = { }
         
        forEach(getters,(getterName,fn)=>{
            Object.defineProperty(this.getters,getterName,{
                get:function(){
                    return fn(this.state) 
                }
            })
        })
        
         
         
        //options.mutations的格式：
        //mutations：{
        //    functionName:function(state,payload){},
        //    ....
        //}
        let mutations = options.mutations   //获取再new Vuex.Store时传入的配置对象中的mutations(同步更新方法)
        this.mutations = { }
        forEach(mutations,(mutationName,fn)=>{
            this.mutations[mutationName] =(payload)=>{
                 fn(this.state,payload)
             }
        })
         
        //Object.keys(mutations).forEach((mutationName)=>{
        //     this.mutations[mutationName] =function(payload){
        //         mutations[mutationName](this.state,payload)
        //     }
        //}改良为了forEach的写法
        
        
         
        //options.actions的格式：
        //actions：{
        //    functionName:function(store或可用store的结构赋值形{commit}         
        //式,payload){
        //     setTimeout(()=>{
        //       commit('mutationsFuncionName',payload)  
        //      },1000)
     	//},
        //    ....
        //}
         let actions = options.actions   //获取再new Vuex.Store时传入的配置对象中的mutations(同步更新方法)
        this.actions = {}
         forEach(actions,(actionName,cb)=>{
             this.actions[actionName] = (payload) =>{
                 fn(this,payload)   //这里this是指的new Vuex.Store实例
             }
         })
         
         
    }
    
    get state(){  //类的属性访问器
        return this.state.state
    }
        
    commit = {  
        (mutationName,payload)=>{ //用箭头函数保证内部this指向store实例
            this.mutations[mutationName](payload)
        }
    }
    
    
    dispatch = {  
        (actionName,payload)=>{  //用箭头函数保证内部this指向store实例
            this.actions[actionName](payload)   //源码中有一个变量来控制是否通过mutation来更新状态
        }
    }
    
}

export default {
    install 
}
```





**Vuex中的模块化开发**

```JavaScript
//原生vuex有一个非常强大的功能：页面数据很多时，可以分模块。
//写法：
new Vuex.Store({
    
    //用法：在组件中通过 $store.state.a.a 去取a模块中的a状态数据
    modules:{
      a:{  //a模块
          state:{
              a:2
          }
      },
      b:{  //b模块
          state:{
              b:3
          }
      }
    }
})
```



```javascript
//vuex内部将传给new Vuex.Store({})的配置对象的内容进行格式化

//格式化的结构如下：
let root = {
    _raw:options,
    _children:{
        a:{
             _raw:{},
             _children:{}
            state:{a:1}
        },
    	b{}
    },
    state:optopns.state
}

```

![image-20210318104857255](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210318104857255.png)



```javascript
class ModuleCollection(){
    constructor(options){
        
    }
}


class Store{
    this._modules = new ModuleCollection(options)  //收集依赖，把数据格式化为一个想要的数据结构
}
```



#### vuex实例中数据与方法的使用

**取：**state（放状态）

this.$store.state.key



**改：**mutation（放同步修改state中状态的方法）

function(state, payload...){.....}

this.$store.commit('function' , payload, ... )



**异步改：**action（放异步修改state中状态的方法，触发commit再修改state）

asyncfunction(store, payload...){  store.commit( 'function' )  }

this.$store.dispatch( 'asyncfunction', payload... )



学习时vuex的用法，用vue脚手架生成一个vue项目，创建一个store文件夹，里面存放vuex。在该文件夹的index.js中：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import logger from 'vuex/dist/logger'  //记录每次操作store中状态数据时的日志（前中后三部分）

Vue.ues(Vuex)

export default new Vuex.store({  //创建store实例
    state:{
        
    },
    getters:{
        
    },
    mutaitions:{
        
    },
    actions:{
        
    }
    plugins: [logger()]
})
```



在项目的入口文件夹中：

```javascript
import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

Vue.config.productionTip = false

new Vue({
    store,
    render:h=>h(App)
}).$mount('#app')
```



**真实项目中vuex的使用**

一个完整项目中包含许多模块（用户模块，商品模块等等），每个模块下面又有自己的组件，而需要将某个模块下的这些组件之间共享的状态数据单独存放在store对象中，通过特定的方式获取，以免和其他模块的状态数据冲突。项目中的store实例管理的状态也需要分模块。每个模块都有自己的state，getter,mutations,actions。最后将所有模块的的这些配置项在index.js中合并到一起，并以命名空间进行区分。

写特定模块：

在不给模块加上namespaced：true时，当各个模块在index.js中合并时，某些模块配置项中的出现同名的属性时，会出现覆盖的情况,如下面的A与B的getters中的queryBase属性。但是A与B模块的state中的同名name不会覆盖，而是彼此独立在自己的模块下。

```javascript
//A板块的公共状态管理
export default {
	namespaced:true,
    state:{
        name:'jack'
    },
    getters:{
        queryBase(state,rootState){   //这里的state是上面A模块自己的state，不是某个公共的state。rootState为该queryBase的返回值，即：jack---------。
            return state.name+'---------'
        }
    },
    mutaitions:{
        changName(state,payload){  //这里的state是上面A模块自己的state，不是某个公共的state
            state.name = 'tom'
        }
    },
    actions:{
        actionChangeLogin(context,payload){  //context是本模块状态管理对象store，context.state表示当前模块私有的状态，context.rootState代表整个store中的全部状态
    }
}
```

```javascript
//B板块的公共状态管理
export default {
	namespaced:true,
    state:{
        name:'entry'
    },
    getters:{
         queryBase(state){
            return state.name+'+++++++++'
        }
    },
    mutaitions:{
        
    },
    actions:{
        actionChangeLogin(context,payload){  //context是该状态管理对象，context.state待变当前模块私有的状态，context.rootState代表整个store中的全部状态
    }
}
```



```javascript
//index.js中
import Vue from 'vue'
import Vuex from 'vuex'
import logger from 'vuex/dist/logger'  //记录每次操作store中状态数据时的日志（前中后三部分）
import A from './A'
import B from './B'

Vue.ues(Vuex)

export default new Vuex.store({  //创建store实例
    modules:{  
        A,
        'B'：B
    }
    
   	//以下属于每个板块共有的的状态管理
    state:{
        isLogin: true
    },
    getters:{
        queryLogin(){
    		return state.isLogin+'+++++++++'
		}
    },
    mutaitions:{
        changeLogin(state,payload){  //这里的state是上面公共的state，不是某个具体模块的state
            state.isLogin = payload
        }
    },
    actions:{  
        
        }
    }
    plugins: [logger()]
})

```

​		modules中存放要合并的项目的各个模块的state，getter,mutations,actions，其中state会自动按照模块进行划分，state:{A:{name:'jack'},B:{name:'entry'},isLogin: true}  ,但是getter,mutations,actions默认不会以模块进行划分，全部合并到一个getter,mutations,actions中，如果各个模块中有同名的属性名，则可能冲突覆盖某些模块的某个getter,mutations,actions中的属性。，解决办法：给各个模块添加 namespaced:true。这样要做之后，store中的getter,mutations,actions的来自各个模块的属性的属性名前面会加上模块的名字，如：getters：{‘A/queryBase’：function（）{ ... }，‘B/queryBase’：function(){ ... } , 'queryLogin': function(){...}}。

以后在组件模块中使用的方式是：$store.getters['A/queryBase']

![image-20210411152131813](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210411152131813.png)



![image-20210411152154061](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210411152154061.png)

**给各个模块添加 namespaced:true后**

![image-20210411152746567](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210411152746567.png)

![image-20210411152927595](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210411152927595.png)



在组件中调用mutations中的方法时this.$store.commit('mutations中的方法名'，payload)，第二个参数是payload，传第三个参数是不会再传给mutations中的方法。所以要传多个参数，则需要将第二个参数以对象的类型传过去，对象中存放参数。



getters的方法可以接受第二个参数，rootState参数，代表getter函数的返回值。	在模块中getters和mutations内部的方法都没办法访问到公共模块的state。但是在模块的actions内部的方法都可以通过rootState访问到公共模块的state。



在组件中想使用某个模块的状态数据：$store.state.A.name 获取。$store.commit("A/functionName",payload) 

为了简化对store中数据或者方法的读取，可以借助mapState等方法辅助。

```
import { mapState } from 'vuex'

//方式一：
computed:{...mapState(["模块名"])}

//方式二：
computed:{...mapState({
	key：state=> return state.模块名.state名  //这里的state是全局state
})}

//方式三：
computed:{...mapState("模块名",{
	key：state=> state.state名  //这里的state是对应模块名的state
})}

方式四：
import { createNamespaceHelpers } from 'vuex'
let { mapState，mapMutations }  = createNamespaceHelpers("模块名")
```

![image-20210606204223144](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210606204223144.png)





最后，在项目中常常还会由于actions，mutations，getters中的方法名在使用时需要一一对应，如果不对应就很容易出错。对此，在大型项目中还会引入名字的宏观统一管控。











在使用store对象上的数据或者方法时，不做处理时，往往要写较多内容才能锁定需要的数据，比如在组件中写：`this.$store.state.xxx.xxx`。   面对这个问题，vuex中提供了优化方案，使用一些列的map函数。

在需要简写的单个vue文件模块中引入以下中的一个或者几个函数：

```
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
```

mapState辅助函数生成的是计算属性。

使用方式：

1. mapState( [ "statekey1", "statekey2"..] )
   说明：直接取出state中存放的statekey1 ，statekey2 等，并组成一个新对象返回，获取的只是state中最外层对应的属性名及其值

```
function mapState(arr=[]){
	let returnObj={}
	arr.forEach((item=>{
		returnObj[item] = this.$store.state[item]
	})
	return returnObj
}

function mapMutations(arr=[]){
	let returnObj={}
	arr.forEach((item=>{
		returnObj[item] = function(...arg){
			this.$state.commit(item,arg)
		}
	})
	return returnObj
}
```

2. mapState( {  selfName: state=> state.xxx.xx } )
3. mapState( {  selfName: "xxx" } )



````
computed:{
	...mapState( [ "statekey1", "statekey2"..] )
	
	...mapState( {  selfName: state=> state.xxx.xx } )
	
	...mapState( {  selfName: "xxx" } )
	
	...mapGetters(["xxx"])
}


methods:{
	...mapMutations(["xxxx"])
	
	...mapMutations({
		selfName:"xxxx"
	})
}
````

注意：在创建store实例的时候，还有一个配置选项——plugins，在给配置函数中可以做vuex数据的持久化。（面试点）









### vue组件

特点：

- 每个组件就是一个自定义标签
- 可复用
- 方便维护
- 每个组件之间作用域相互隔离，有自己完整的生命周期函数，数据与方法

创建组件：

1. 全局组件：类似于在全局作用域中定义的变量，可以在其他组件中被访问并使用。无需单独引入

   - Vue. conponent('组件名'，options)，返回值是一个函数。

     - 组件名
       - word-word  =>`<word-word></word-word>`
       - wordWord =>在DOM模板中：`<word-word></word-word>` ，在vue文件的templat中：`<wordWord></wordWord>`,`<word-word></word-word>`
       - `<wordWord></wordWord>` =>wordword

     - options：
       - template
         - 只能有一个根组件
         - 模板字符串方式写
         - template标记方式写
         - slot
       - render
       - data（）{ return {} }
       - ...

2. 局部组件

   - options中的components属性，components:{  ‘组件名’：{ data(){return {} }	,template: ' ',...}}



组件通信

- 父传子 `<组件名  :key='data'  key2='value'></组件名> ` ,子组件：`props:['key','key2']   |  props:{  key:{type:String}, key2:Number }`

- 子传父：this.$emit( ‘事件名’，args )   发布订阅

- const eventBus = new Vue()  + props |   window.eventBus = new Vue()  发布订阅

- provide/inject:隔代传递，实现祖先与后代之间的通信，在祖先组件的选项对象中有一个属性——provide ，它在vue实例上对应的是 _provided。provide对应的值可以是一个对象也可以是一个函数（函数返回一个对象），函数的好处是：函数返回的对象上的值会在组件实例都初始化好这些属性与方法后，再提供给provide。

- $listeners/$attrs

  $attrs:是组件实例的一个对象，内部存放的是父组件以标签属性 v-bind或者直接自定义属性方式传递给子组件的属性，除去子组件自己用props接受过的那部分标签属性和class，style，也可以将父组件的方法以属性的方式传给子组件，在子组件中通过this.$attrs.方法名调用父组件上的方法。 可以通过v-bind="$attrs"传入内部组件。

  $listeners：获取父组件作用域中以@（v-on）传递过来的事件监听器,但是不包含.native修饰的v-on事件监听函数。可以通过v-on="$listeners"传入内部组件。

- $parent / $children[n] / $refs

- vuex

  

父组件在使用子组件的标签名中 以自定义标签属性的方式将数据传给子组件，数据可以直接是一个基本数据类型值（不需要用v-bind绑定），也可以是来自父组件data中的数据（用v-bind绑定自定义属性，表示属性值取父组件data上的数据）。   在父组件向子组件传递值后，在子组件的配置对象中添加一个属性props，props对应的值可以是数组也可以是对象。props中的成员则是来自定义好了的标签自定义属性。

在props中接收的属性数据和子组件的data中的数据一样，都会挂载到子组件实例身上。通过this.props中自定义属性名获取或者在子组件模板中直接使用。

父组件传递的属性名采用xxx-xxx的格式，子组件在props中注册时要以 xxxXxx的格式来接收和使用。如果属性名采用XXX的方式传递，则props中任然用xxx的方式接收与使用。

默认在没有用v-bind绑定自定义属性时，父组件传递给子组件的数据的数据类型都是字符串格式的，如果需要传递数据原本的类型，要使用v-bind，即使v-bind属性后面的属性值不是父组件中data的变量也可以。

props用数组时，是直接接收数据。props用对象时，是在接收数据时再进行校验。

如果在子组件的标签名中传的是一些html标签上原生的属性，如：class id  style等，则默认直接将这些在子组件标签上的属性添加给子组件模板的根标签上或者覆盖，也可以再在props中接收。





#### vue的单向数据流

所有的props都是在父子组件之间形成一个单向向下的绑定：父级props的更新会向下传递给子组件，但是不建议在子组件中修改父组件通过标签属性传递下来的数据。



#### 父子组件生命周期函数执行顺序

- 加载渲染过程

  父beforeCreate->父created->父beforeMount（父组件render函数）->子beforeCreate->子created->子beforeMount->子mounted->父mounted

- 子组件更新过程（当父组件传递给子组件的数据发生改变时）
  父beforeUpdate->子beforeUpdate->子updated->父updated

- 父组件更新过程
  父beforeUpdate->父updated

- 销毁过程
  父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

![image-20210226100812509](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210226100812509.png)

每次父级组件通过标签属性传给子组件的数据发生更新时，子组件中所有的props都会尝试刷新为最新的值。不要在子组件内修改父组件通过标签属性传递过来的数据，如果要想达到修改父组件数据的目的，可以子组件通过this.$emit( '自定义事件' ，value)的方式触发父组件上methods中的方法，由methods中的方法去修改父级组件自己的data中的数据。

如果子组件只是想获取父组件传过来的值，之后不想再与父组件中的对应数据产出联系，可以将props中的数据备份一个到子组件自己的data中。





## vue-cli 脚手架

其他开发者封装好的一套初始化项目代码，项目中有构建工程化项目、自动打包压缩合并所需要的webpack配置文件，开发者只需要基于脚手架快速生成一套项目基本配置。

工程化项目：能自动合并压缩打包的项目。实现自动合并压缩打包则要用webpack，而webpack自动化则必须要进行一系列的配置。

vue中的脚手架vue-cli。



vue-cli 的几种使用方式：

- 方式一：直接使用@vue/cli 创建一个初始化项目（vue create projectName，数字或者小写字母）
- 方式二：使用@vue/cli` + `@vue/cli-service-global在零配置的情况下实现vue的组件化开发(vue serve)
- 方式三：通过@vue/cli的命令行（vue ui）启动一个可视化的界面，在可视化界面中创建一个初始化项目



架构师精通webpack，能自己写出一套webpack。



### 快速原型开发

可以在零配置的情况下使用vue的模块化开发，可以直接写.vue类型的文件。使用 `vue serve` 和 `vue build` 命令对单个 `*.vue` 文件进行快速原型开发。不过这需要先额外安装一个全局的扩展：

```
npm install -g @vue/cli-service-global

Usage: serve [options] [entry]

在开发环境模式下零配置为 .js 或 .vue 文件启动一个服务器


Options:

  -o, --open  打开浏览器
  -c, --copy  将本地 URL 复制到剪切板
  -h, --help  输出用法信息
```

`vue serve` 使用了和 `vue create` 创建的项目相同的默认设置 (webpack、Babel、PostCSS 和 ESLint)。它会在当前目录自动推导入口文件——入口可以是 `main.js`、`index.js`、`App.vue` 或 `app.vue` 中的一个。你也可以显式地指定入口文件：

```
vue serve MyComponent.vue
```

`vue build`:将目标文件构建成一个生产环境的包并用来部署

```
Usage: build [options] [entry]

在生产环境模式下零配置构建一个 .js 或 .vue 文件


Options:

  -t, --target <target>  构建目标 (app | lib | wc | wc-async, 默认值：app)
  -n, --name <name>      库的名字或 Web Components 组件的名字 (默认值：入口文件名)
  -d, --dest <dir>       输出目录 (默认值：dist)
  -h, --help             输出用法信息
```

在快速原型开发中，根实例和其他实例上是无法使用tempalte配置属性去指定渲染模板的。报错原因如下：

```
You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
```



安装脚手架，一般安装在全局。

npm insatll  @vue/cli -g

yarn global add @vue/cli

全局安装后，全局可执行vue命令

vue --version:查看@vue/cli版本 

vue --help:查看帮助  

vue  inspaect :在项目路径下运行，查看该项目中vue脚手架配置的webpack.config.js文件   。vue inspect > config.js

**vue create 项目名称  ：名称为数字或者小写字母**

```
vue create --help
用法：create [options] <app-name>

创建一个由 `vue-cli-service` 提供支持的新项目


选项：

  -p, --preset <presetName>       忽略提示符并使用已保存的或远程的预设选项
  -d, --default                   忽略提示符并使用默认预设选项
  -i, --inlinePreset <json>       忽略提示符并使用内联的 JSON 字符串预设选项
  -m, --packageManager <command>  在安装依赖时使用指定的 npm 客户端
  -r, --registry <url>            在安装依赖时使用指定的 npm registry
  -g, --git [message]             强制 / 跳过 git 初始化，并可选的指定初始化提交信息
  -n, --no-git                    跳过 git 初始化
  -f, --force                     覆写目标目录可能存在的配置
  -c, --clone                     使用 git clone 获取远程预设选项
  -x, --proxy                     使用指定的代理创建项目
  -b, --bare                      创建项目时省略默认组件中的新手指导信息
  -h, --help                      输出使用帮助信息
```



vue serve：零配置启动服务运行一个.js或者.vue文件

vue build ：零配置打包一个.js或者.vue文件

vue ui：用可视化界面的方式创建项目 

vue add pluginName： 在现有的项目中安装插件，插件可以修改 webpack 的内部配置，也可以向 `vue-cli-service` 注入命令。



脚手架生成的项目目录

vue-cli生成的项目的package.json的script字段中的几个命令行语句：

```
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
}
```

```
用法：vue-cli-service serve [options] [entry]

选项：

  --open    在服务器启动时打开浏览器
  --copy    在服务器启动时将 URL 复制到剪切版
  --mode    指定环境模式 (默认值：development)
  --host    指定 host (默认值：0.0.0.0)
  --port    指定 port (默认值：8080)
  --https   使用 https (默认值：false)
```

```
用法：vue-cli-service build [options] [entry|pattern]

选项：

  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录
  --report      生成 report.html 以帮助分析包内容
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
```





**修改vue脚手架默认生成的webpack.config.js配置文件**

vue.config.js(和package.json同级)在项目的根目录下。在该文件中，可以配置别名@符号等所代表的具体路径或者意思。也可以在webpack.config.js中完成一些列的配置。具体字段是：

```javascript
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
} 
```

vue.config.js配置文件的配置项：[官网地址](https://cli.vuejs.org/zh/config/#pages)

在vue.config.js中：

```
module.exports = {
	 configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@crud': resolve('src/components/Crud')
      }
    }
  }
}
```



vue-cli3.0移除了配置文件目录： config和build文件夹。移除了配置文件目录后如何自定义配置环境变量和模式呢?

​		在一个产品的前端开发过程中，一般来说会经历本地开发、测试脚本、开发自测、测试环境、预上线环境，然后才能正式的发布。对应每一个环境可能都会有所差异，比如说服务器地址、接口地址、websorket地址…… 等等。在各个环境切换的时候，就需要不同的配置参数，所以就可以用环境变量和模式，来方便我们管理。

**在基于vue脚手架的项目中，cli-3.0总共提供了四种方式来制定环境变量：**

- 在根目录添加`.env`文件，配置所有情况下都会用到的配置
- 在根目录添加`.env.local `文件，配置所有情况下都会用到的配置，与`.env`的区别是只会在本地，该文件不会被git跟踪。
- 在根目录添加`.env.[mode] `文件，配置对应某个模式下的配置,比如：.env.development来配置开发环境的配置。
- 在根目录添加`.env.[mode].local`文件，配置对应某个模式下的配置,与`.env.[mode]`的区别也只是会在本地生效，该文件不会被git跟踪。

在.env的配置文件中，只需要以key=value的方式就可以设置变量,例如人才库的环境变量：

```JavaScript
ENV = 'production'

// 接口地址，注意协议，如果你没有配置 ssl，需要将 https 改为 http
VUE_APP_BASE_API  = '/api'
// 如果接口是 http 形式， wss 需要改为 ws
VUE_APP_WS_API = 'wss://47.100.33.168'

//下面两个是自己添加的
FOO=bar
VUE_APP_SECRET=secret
```

**使用.env文件中的环境变量（需要注意的是在项目的不同地方使用，限制也不一样）：**

1. 在项目中，也就是src中使用环境变量的话，必须以`VUE_APP_`开头。例如我们可以在main.js中直接输出：`console.log(process.env.VUE_APP_SECRET)`

2. 在webpack配置中使用，没什么限制，可以直接通过`process.env.XXX`来使用

3. 在public/index.html中使用的：分三类

   ```
   <%= VAR %> 用于非转换插值  例如：`<link rel="shortcut icon" href="<%= BASE_URL %>favicon.ico">`
   <%- VAR %> 用于HTML转义插值
   <% expression %> 用于JavaScript控制流    
   ```

vue-cli项目中的三种运行模式，对应于package.json文件中的script脚本字段：

1. development：在`vue-cli-service serve`下，即开发环境使用
2. production：在`vue-cli-service build` 和`vue-cli-service test:e2e`下，即正式环境使用
3. test： 在`vue-cli-service test:unit`下使用

想要修改模式下默认的环境变量的话可以通过--mode来实现，例如：

```
 "dev-build": "vue-cli-service build --mode development"
```





注意点：对于有些没有实现模块化的能力的包，需要将包文件放置在public目录下，然后在index.html文件中引入。但是引入时需要注意在项目打包时，是否也将这些包文件打包到dist文件目录下。同时建议在引入那些包或者资源时，都设置路径以<%= BASE_URL %>开头。因为这样webpack能识别能进行编译处理。直接写的则不被webpack编译





注意点：在.vue文件中写style的地方有几种情况， 

1. 在文件的style部分写属于该模块的样式（可以加上scoped，lang="scss"等）。  
2. 在.vue文件之外写一个样式文件，在vue文件的style部分通过 @import 'url'   方式引入 。 
3. 在.vue文件外写样式文件，然后在vue文件的script脚本部分通过ES6的语法引入并作用于该vue 文件。





## vue-router(路由管理)

SPA(单页面应用):用到路由管理插件。

MPA(多页面应用)

使用vue-router，可以实现路由规则的嵌套，在路由规则嵌套的基础上实现展示的组件的嵌套。vue-router是依赖于vue核心库的。

用js代码生成的前端html标签元素在html文档结构中不可见，不利已SEO优化。即采用多页面应用的开发方式，又保证seo优化和客户端渲染并实现也页面中公共组件的复用，这是一件很难实现的技术。

oa和erp后台管理系统，移动端APP，webApp常常用的都是spa技术开发。传统的电商网站都以多页面应用为主。

|                    | MAP                           | SPA                                  |
| ------------------ | ----------------------------- | ------------------------------------ |
| 构成               | 由多个完整的页面构成          | 一个主页面和多个页面片段构成         |
| 跳转方式           | 从一个页面跳转到另一个新页面  | 一个片段隐藏或删除，另一个片段显示   |
| 公共资源的可利用性 | 不可利用                      | 可利用                               |
| URL                | 一个URL对应一个文件资源       | 只有一个URL，只是hash部分不同        |
| 用户体验           | 页面加载慢，不利于用户体验    | 页面相对快速的切换，用户体验好       |
| 转场动画           | 不能实现                      | 能实现                               |
| 页面间数据传递     | 依赖url，cookie与localstorage | 页面传递数据容易，vuex，组件通信方式 |
| 搜索引擎优化       | 有利于，可以直接做            | 不利于（需要用SSR方案）              |
| 适合项目           | 对seo有要求的网站             | 重体验的网站                         |
| 开发门槛           | 较低                          | 较高，需要专门框架                   |



SPA的开发历史：

- iframe
- AMD/CMD+打包工具
- 专业路由管理框架



AMD:按需引入的模块化思想

- AMD代表：require.js
  - AMD需要在模块最开始就把当前模块依赖的内容导入，然后再开发，ES6模块化规范也是一样。所有的模块导入都要放在本模块的开始位置。
- CMD代表：sea.js
  - CMD比较灵活，在开发过程中需要用到哪些模块，在单独导入即可，common.js规范也是一样的，可以需要时require。



![image-20210416000940293](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210416000940293.png)

### 使用vue-router

- vue-router可以设置多层路由嵌套

- 可以根据路由显示对应组件模块

- 支持HTML5 历史模式或 hash 模式

- 可以通过多种方式进行数据传参

- 对于激活的路由链接会自带一个默认的class类名

  

安装：

npm intall vue-router



在已有的项目中引入vue-router：

vue add router



实现方式两种：

- hash路由

- history API（H5），该对象能与浏览器的历史记录进行交互。

  - history.forward()

  - history.go()

  - history.back()

  - history.pushState()

    向浏览器历史记录中新增一条数据（地址栏中的地址会改变），但是页面不会刷新，但是如果新增的地址不存在，并且url地址信息还是刚新增的一条数据对应的url，那么这是手动刷新页面的话，会报404错误，所以history路由还需要服务端做技术支持（请求不存在的页面时，直接返回网站首页）。



在vue/vue-router中，它会监听hash值的变化情况，根据hash值去路由表中匹配对应规则，然后交给vue渲染对应的组件。vue-router中还做了一件事，构建一个历史记录的容器，每一次切换完都把当前最新的地址存储到容器中，为了方便实现后退和前进。



```javascript
HTML
<div id="app">
    <h1>路由组件的使用</h1>
    <router-link to="/com1">com1组件</router-link>
    <router-link to="/com2">com2组件</router-link>
    <router-view></router-view>  //路由组件的出口
</div>

<script src="./node_modules/vue/dist/vue.js"></script>
<script src="./node_modules/vue-router/dist/vue-router.js"></script>
<script>
    // 定义组件配置对象,将组件 (components) 映射到路由 (routes)
    const com1 = {template:"<h2>com1组件页面</h2>"}   
    const com2 = {template:"<h2>com2组件页面</h2>"}
    // 定义路由和组件的对应关系
    const routes = [
      {path:'/com1',component:com1},
      {path:'/com2',component:com2}
    ]
    //注册为路由规则表
    const router = new VueRouter({
      routes
    })


    const vm = new Vue({
      el:"#app",
      router    //注入路由器后，可以在任何组件内通过 this.$router 访问路由器，this.$route 访问当前路由
    })
</script>
```





```javascript
//模块化开发  
//在路由组件模块中（router/index.js）
import Vue from 'vue'
import VueRouter from 'vue-router'
import com1 from "./components/com1.vue"
import com2 from "./components/com2.vue"

Vue.use(VueRouter)               //会在每个组件中注入$router属性（路由器）和$route属性（当前路由）

export default new VueRouter({
    mode:"hash", //hash或者history，使用几乎一样，之后项目要切换模式可以直接就在这里切换就可以了
    routes:[
        {
            path:"pathname",
        	component: com1
        },
        {
            path:"pathname",
        	component: com2
        }
    ]   //可以配置多级路由
})

//在入口模块中（main.js）
import Vue from 'vue'
import App from 'app.vue'
import router from './router/index.js'

const app = new Vue({
    render:h=>h(App),
    router               //会在每个组件中注入$router属性（路由器）和$route属性（当前路由）
}).$mount('#app')
```









面试题：**BrowserRouter和HashRouter的区别**

HashRouter是通过判断url的hash部分的值，来实现页面UI和url的同步。

BrowseRouter是使用HTML5的history API（pushState, replaceState和popState），让页面的UI与URL同步。



#### 动态的路由的匹配

在一段url中，hash值部分只有一小部分存在差异，比如用户个人页面，用户在登录后跳转到个人页面时，只有用户的ID部分不同，其他部分是相同的。那么不会给每个id定一个路由规则。可以在 `vue-router` 的路由路径中使用“**动态路径参数**”(dynamic segment) 来达到这个效果。

```javascript
//user组件的配置对象
const user = {
    template:'<div>User</div>'
}
const router = new VueRouter({
    routes:[
        { path:'/user/:id',component: user }        // 动态路径参数 以冒号开头
    ]
})
//  user/foo 和 /user/bar都将映射到相同的路由。
```

在动态路由匹配到路由规则后，在渲染的对应路由的组件实例的$route.params属性（值是一个对象）中存放的是路径参数匹配到的数值，同时url路径中也会体现动态匹配到的路由部分（所以页面刷新时也不会丢失）。可以在一个路由中设置多段“路径参数”，对应的值都会设置到 `$route.params` 中。例如：

| 模式                          | 匹配路径            | $route.params                        |
| ----------------------------- | ------------------- | ------------------------------------ |
| /user/:username               | /user/evan          | `{ username: 'evan' }`               |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123'` |

$route对象上面还有query，hash等常用属性。



通过路由传参的方式：

**基于地址path跳转，传递参数则基于问号(?)传参**

- 在router-link 中:`<router-view to="/str1/str2?key=value">跳转</router-view>`  

- `<router-view :to="{path:'/home', query:{key:value}}">跳转</router-view>`  


  通过上面这两种方式跳转路由并实现问号(?)传参的。在跳转到的路由组件的实例上有一个属性可以以对象的形式获取到这些传参。   具体属性是 this.$router.currentRoute.query

  ![image-20210608225127663](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608225127663.png)

![image-20210608225115034](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608225115034.png)



同时，路由实例上还有一个比较常用的属性matched，存放的是所有匹配的路有规则组成的数组，所有可以通过在设置路由规则的时候设定一些有用的参数，然后在组件实例中取出来并渲染。

![image-20210608225319636](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608225319636.png)





**基于命名路由实现跳转：**

通过路由配置表中给每个路由规则添加一个name属性进行路由跳转。

```js
new VueRouter({
  mode:"hash",
  routes:[
  	{
        path:'/',
        redirect:'/home'
    },
    {
        path:'/home',
        name:'home',   //这就是给路由命名
        component:Home
    },
    {
     	path:'/custom',
        name:'custom',
        component:Custom,
        children:[
            {
                path:'/custom/list',   //或者 path:'list'
                name:'custom-list',
                component:customelist
            }
        ]
    }
  ]
})
```

路由加载是有顺序的，从路由规则中从上到下，能匹配成功就停止往后匹配，但不妨碍继续匹配子路由。



使用命名路由实现跳转：

- `<router-view :to="{name:'xxx'}">跳转</router-view>`  

- `<router-view :to="{name:'xxx',query:{lx:'all'} }">跳转</router-view>`  这种方式传参也是可行的，参数存放在query中，并且不显示在地址栏中

  ![image-20210608231116255](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608231116255.png)

  ![image-20210608231104856](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608231104856.png)

- `<router-view :to="{name:'xxx',params:{lx:'all'} }">跳转</router-view>`   可以实现路由传参，参数存放在了params中 ，并且不显示在地址栏中。

  ![image-20210608231252150](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608231252150.png)

  ![image-20210608231308279](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608231308279.png)



**用path方式实现跳转不能使用params传参，只能基于query 或者手动拼接的方式传参。 用命名路由跳转则既可以使用query或者params。**



**注意点：**

***在使用命名路由去跳转时，通过query  和 params 进行传参 在页面刷新的情况下，结果是完全不同的。***

例子：

```
<router-view :to="{name:'/home',query:{lx:'all'} }">跳转</router-view> 
//地址栏出现问号部分的参数，且路由实例的currentRoute属性中query中存放了参数，页面刷新后query中传参任然存在。



<router-view :to="{name:'/home',params:{lx:'all'} }">跳转</router-view>

```

刷新后query中的内容： 

![image-20210608232409497](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608232409497.png)



刷新后params中的内容：

![image-20210608232539277](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210608232539277.png)




#### 路由组件的复用

动态路由匹配到的同一个组件，当动态路由发生改变时，**原本已经渲染好的组件实例会被复用**，以提高效率。**这也意味着组件的生命周期钩子不会再被调用**。

复用组件时，想对路由参数的变化作出响应的话，可以watch (监测变化)组件的 `$route` 对象：

```
const user = {
	template: "<div>.....</div,
	watch:{
		$route:function(to, from){
		
		}
	}
}
```

也可以使用路由组件实例的 beforeRouteUpdate（导航守卫）：

```
const User = {
	templat:"....",
	beforeRouteUpdate(to, from, next){
	//内部必须要调用next()以释放通行
	}
}
```



针对所有路由的捕获或者只针对404页面的捕获路由

在项目中，一般功能组件模块都可以被以 ' / ' 开始的路由给匹配到并渲染展示，如果某个组件希望被所有的的路由规则都匹配到并渲染，那么可以使用通配符 (`*`)

```
{ path: '*',component: component1 }   // 会匹配所有路径
{ path: '/user-*',,component: component2 }   // 会匹配以 `/user-` 开头的任意路径
```

通配符路由应该放在路由规则routes数组的最后一项，通配符对应的组件往往要渲染的是客户端404页面内容，或者可以将通配符路由对应的component写为一个函数，函数中自动进行跳转。如果使用了*History 模式*，要正确配置服务器。

在使用通配符匹配到某个组件实例后，该组件实例上的`$route.params` 属性内会自动添加一个名为 `pathMatch` 参数。它包含了 URL 通过*通配符*被匹配的部分：

```javascript
// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

有时一个路径会匹配到多个路由规则，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。

#### 嵌套路由

路由规则嵌套后可以实现路由组件之间的嵌套。 

在上层路由组件中有自己的子路由的路由出口（<router-view></router-view>）

```javascript
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

路由规则中配置children配置选项：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',   //注意不能以“/”开头，如果要写为以“/”开头那必须从根路径开始写
          component: UserPosts
        }，
        { path: '', component: UserHome }
      ]
    }
  ]
})
```

#### 编程式导航

路由导航有两种方式：

- 导航链接   `<router-link to="...">` ，点击 `<router-link>` 时，$router.push这个方法会在内部调用
- $router实例对象的API来实现，这种方式是以代码的方式实现路由的切换

在路由**组件实例**中，可以访问**路由实例对象**$router,该对象上有一系列关于路由跳转的方法：这些方法其实都是VueRouter构造函数的实例对象的原型上提供的方法，而在注册vue-router插件的时候，已经将一个VueRouter的实例对象绑定到了每个组件的$router属性上。

- $router.push   ：会产生历史记录

  | 声明式                    | 编程式                                     |
  | ------------------------- | ------------------------------------------ |
  | `<router-link :to="...">` | `router.push(location,onComplete,onAbort)` |
  
  ```javascript
  //接受参数的形式
  $router.push('home'[,onComplete , onAbort])  
  
  $router.push( { path: 'home' } )  //这是跳到home路径对应的路由
  
  $router.push( { name: 'user', params: { userId: '123' } )  //跳到以名字命名的指定的路由
                 
  $router.push( { { path: 'register', query: { plan: 'private' }} )  //带url传参的路径路由
  ```
  
  如果在跳转路由时，采用的是路由的名字进行跳转，那么通过params进行路由传参的话是可行的。但是如果跳转路由是通过 路由对应的路径实现跳转的话，那么params就无法生效,而应该使用 query  或者手动拼接的方式实现。
  
  ```js
  const userId = '123'
  router.push({ name: 'user', params: { userId }}) // -> /user/123
  router.push({ path: `/user/${userId}` }) // -> /user/123
  
  
  // 这里的 params 不生效
  router.push({ path: '/user', params: { userId }}) // -> /user
  ```
  
  

- $router.replace

  | 声明式                            | 编程式                |
  | --------------------------------- | --------------------- |
  | `<router-link :to="..." replace>` | `router.replace(...)` |

- $router.go

#### 路由命名

写法：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

用法：

```
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

$router.push({ name: 'user', params: { userId: 123 } })
```

#### 路由出口命名

有时，想在同一个路由路径下面渲染多个路由组件，而不是路由组件进行嵌套。



#### 导航守卫——和路由有关的声明周期函数

导航首位几乎只做一件事——路由权限校验，能取代路由匹配规则中，组件component写为函数去完成权限校验的能力。

所谓的导航守卫，就是提供一系列的回调函数，能让开发者在这个回调函数中做任务逻辑。



#### 企业级实战

CRM管理系统

整个项目有两个大的页面，登录页面和管理系统页面，登录成功后，以页面跳转的方式跳转到管理系统页面，只有在管理系统页面才实现了SPA，所以并不是纯粹的SPA单页面应用。 要spa和mpa混合在一起开发，那么就需要修改一下webpack.congif.js的配置内容了。

整个项目在public文件目录下有两个html文件，index.html和login.html。src下有两个项目入口文件，main.js和login.js。因为只在管理系统页面应用了spa，所以只在main.js中引入了自己的router.js文件。

![image-20210418213355608](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210418213355608.png)

纯粹的多多页面应用，用不上vue-router.js。如果是多页面而且每个单页面下有自己的单页面应用，那就每一个都有自己的router.js。相当于做了多个项目。

最后项目完成后，在用webpack打包上线时，如何打包成多页面，这就需要在webpack配置文件中配置多入口和多出口。 之前的webpack都是单入口文件。

在vue-cli生成的项目中想覆盖webpack.config.js文件的默认配置时，用自己新建的vue.config.js。

```
module.exports = {
	pages:{
		login: {
			entry: 'src/login.js',
			template: 'public/login.html'
		},
		index: {
			entry: 'src/main.js',
			template: 'public/index.html'
		}
	}
}
```



 

多页面应用项目文件安排：

![image-20210418224532963](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210418224532963.png)







p1:渐进式解释

p2:MVC和MVVM

p3:data中数据什么时候能响应

P4:内置指令

p5:循环指令和key，js中循环的几种方式

p6:v-on事件绑定指令

p7: 表单输入绑定

p8:过滤器

p9:计算属性和监听器

p10：全选和非全选案例

p11：watch监听器

p12：动态绑定style和class

p13:选项卡案例

p14:计算器案例

p15:生命周期函数

p16:$refs属性

p17：分类案例

p18：组件

p19:组件和组件插槽和具名插槽（v-slot:插槽名   或者 #插槽名）

p20：局部组件

p21：组件通信

p22:组件生命周期函数的执行顺序

p23：组件通信子传父







#### 组件化实战开发



































































