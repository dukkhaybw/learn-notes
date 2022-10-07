# Vue.js 面试

### 什么是 SPA 应用，SPA 页面和传统的页面的区别。

网站交互方式：

- 传统的多页面（以后端为主前端为辅，前后端混合）
  1. 项目代码前后端糅合在一起，开发效率低并且维护成本高
  2. 页面之间的跳转需要重新加载，速度慢
  3. 有利于 SEO 优化和爬虫
  4. 视图、数据的处理都在服务端完成，前后端难协作
- 现代式的单页面（ajax 的极致应用）
  1. 页面像原生软件一样使用
  2. 不用完全刷新整个页面，而是局部的更新加载和渲染
  3. 无法兼容低版本的浏览器
  4. 首屏加载慢
  5. 数据来自异步，不利于 SEO 优化
  6. 前后端项目分离，开发效率高，可维护性好

前后端分离后，前端只处理页面，后端只处理数据提供接口，前后端通过接口实现交互。选择单页面应用的开发最主要的目的是为了让前后端分离，用户体验反而是其次的。

### 单页面路由的实现方式：

前端路由：

改变 url 实现页面内容部分切换。

方式一：hash

```
关键API：
window.location.hash = path
window.addEventListener('hashchange',function(){})
```

方式二：history

```
关键API：
history.pushState(state,title,hashurl(#/...)),state会在页面的popstate事件触发时，将state作为一个属性值传给popstate事件处理函数的event对象中。hashurl则是用于改变urlahsh部分是hash值。
window.addEventListener('popstate',function(event){})
```

### 项目开发流程

1. 项目立项
2. 需求分析
3. 服务端
   - 需求分析
   - 设计数据库
   - 接口设计（前端参与）
   - 接口开发（用于数据处理）
4. 前端
   - 需求分析
   - UI
   - 写页面和功能
   - 调取接口与服务端交互

### v-show 与 v-if 的作用，两者的区别。（基础题）

​ v-if：创建与删除元素（如用于购物车）

​ v-if 是“真正的”条件渲染，它会让定义有该自定义属性的 dom 元素在切换的过程中 dom 元素及内部的事件监听器和子组件被销毁和重建。对于初次渲染时 v-if 的条件为假，则什么都不做一直到条件第一次为真的时候，才开始渲染条件块。

​ v-show 是不管初始条件是什么，元素总是会被渲染，只是简单的基于 CSS 的 display 为 none 还是 block。

​ v-if 有更高的切换开销，v-show 有更高的初始渲染开销。对于要频繁切换显示与隐藏的地方，使用 v-show。对于运行时条件不太容易改变的地方，使用 v-if

### 如何让 CSS 只在当前组件中起作用。（基础题）

使用`<style scoped>`

扩展题：sass 与 stylus 的样式穿透

### 首屏优化

### SEO 优化了解多少

### vue-loader 是什么，使用它有什么用途。（基础）

### vue 组件中的 data 为什么必须是函数。

为了防止 data 被组件的多个实例共享，那为什么会被共享？为什会有组件作用域？为什么防止数据被篡改？

​ 同一个组件被复用多次，会创建多个实例，这些实例用的是同一个构造函数，如果 data 是一个对象的话，那么所有组件都共享了同一个对象，为了保证组件的数据独立性要求每个组件必须通过 data 函数返回一个对象作为组件的状态。

​ vue 每次会通过一个组件，创建出一个构造函数，那每个实例都是通过这个构造函数 new 出来的

### 对 keep-alive 的了解

​ 默认的 http 连接通常会在每次请求完成后就关闭掉，这意味着服务器端会在发送了一个 respones 后就把 tcp 连接关掉。为了能够让连接在多次请求中保持开启，就引入了 keep alive 连接（长连接|持续连接），只要服务器端愿意配合，所有现代浏览器都可以使用长连接。也可以直接使用 http1.1，http1.1 的 keep-alive 有些不同，就是连接默认是一种保持开启的状态，除非 response 中包含 connection：close 的头部信息。

​ 没有 keep-alive 的情况下，http 的工作情况客户端去创建一个新的连接来交互，并且接收到来自服务器端的一个文件；客户端使用一个新的链接来发起一次请求，在接收到文件后就会终止。浏览器解析 response 然后检查是否还有其他必须的文件来辅助显示整个页面，经过分析后它会对每个文件分别创建新的链接，去发起请求来获取，这种机制很低效，尤其对于那种有大量元素的页面。

​ 使用 keep-alive 之后，客户端会重用现存的连接，而不用每次都去创建一个新的连接。

​ 使用 keep-alive 可以更低的占用 cpu 和内存，可以让 http 对请求和响应实现传递。减少了网络堵塞，请求带来的延迟也会降低，在不需要关闭 tcp 连接的情况下就可以告知错误信息。 这些优势对于安全的 https 连接更为重要，因为建立安全的 https 连接需要更多的 cpu 和 网络往返。

​ 影响 keep-alive 功能的属性：

- 使用 keep-alive on 来开启 keep alive
- 使用 keep-alive off 来关闭 keep alive
- max keep alive request 这个属性负责设置每个 keep-alive 连接允许的最大请求，一般设置为 100 就可以应对大多数场景，但是具体还是要取决于一个页面所依赖的文件有多少，随着文件增加来调整该属性值
- keep alivetimeout 用于为了避免一个闲置的连接空闲过长时间，具体就是服务器需要等待下一个新的客户端请求多长时间，如果等了指定的时长还是没有新的请求，那就关闭该连接；一旦在规定时间内客户端发来新的请求，那这个 timeout 又开始重新计时。

keep-alive 在对于性能的提升有着重要作用，要主动考虑利用起来，而不是采用默认设置，并尝试根据自己的网页的请求数量来调整。

keep-alive 可以实现组件的缓存，当组件切换时，不会对当前组件进行卸载，常用的 2 个属性是 include/exclude,常用的两个生命周期 activated，deactivated。

### 对 vue 了解多少，什么是 vuex，vue-router。

### vue-router 有哪几种导航钩子

### 如何避免 Vuex 中的函数造成全局污染。

### 为什么通过 Vuex 的 motution 修改 state 中的参数就不会报错，而直接更改 state 中的参数就会报错。

### Vue 中父组件如何触发子组件的函数，子组件如何触发父组件的函数，兄弟组件之间的函数如何触发

### 项目开发时对整个项目的框架设计的主要思想是什么。

### Vue 动画的生命周期

### Vue 中使用插件的步骤。

### Vue 中常见的性能优化

1. 编码优化
   - 不要将所有的数据都放在 data 中，data 中的数据会增加 getter 和 setter，会收集对应的 watcher
   - vue 在 v-for 时给每项元素绑定事件需要用事件代理
   - SPA 页面采用 keep-alive 缓存组件
   - 拆分组件，提高复用性，增加代码的可维护性，减少不必要的渲染
   - v-if 当值为 false 时，内部指令不会执行，且有阻断功能，很多情况下使用 v-if 代替 v-show
   - key 保证唯一性（vue 默认采用就地复用策略）
   - Object.freeze 冻结数据
   - 合理使用路由懒加载，异步组件
   - 尽量采用 runtime 运行时版本
   - 数据持久化（防抖和节流）
2. vue 加载性能优化
   - 第三方模块按需导入（babel-plugin-component ）
   - 滚动到可视区动态加载（vue-virtual-scroll-list）
   - 图片懒加载(vue-lazyload)
3. 用户体验
   - app-skeleton 骨架屏
   - app-shell app 壳
   - pwa
4. SEO 优化
   - 预渲染插件
   - 服务端渲染 ssr
5. 打包优化
   - 使用 cdn

![image-20210318210921864](.\typora-user-images\image-20210318210921864.png)

![image-20210318211057485](.\typora-user-images\image-20210318211057485.png)

### 什么是作用域插槽

作用域插槽 与插槽的区别：作用域不同。

插槽（插槽的作用域为父组件）：

- 创建组件虚拟节点的时候，会将组件的儿子的虚拟 jie'dian 保存起来。当初始化组件时，通过插槽属性将儿子进行分类。
- 渲染组件时，会拿对应的 slot 属性的节点进行替换操作
- 渲染父组件时，会将组件标签中间的内容渲染为虚拟节点存起来，这个渲染过程在执行父组件（即下面的 app 组件的父组件）渲染时，就已经渲染好了。并不是在 app 组件内部渲染的。渲染完成父组件即插槽内容后，对插槽就插槽名进行分类。{a:[vnode],b:[vnode]}

```
<app>
  <div slot='a'>xxxx</div>
  <div slot='b'>xxxxxxxx</div>
</app>
```

作用域插槽：

它的渲染流程是在 app 组件内部

```
<app>
  <div slot-scopr='可以时app组件中的数据'  slot='footer'>{{使用app组件中的数据}}</div>
  <div v-slot='可以时app组件中的数据'  slot='footer'>{{使用app组件中的数据}}</div>
</app>
```

### Vue 中 v-for 中为什么要使用 key

key 主要是用来为 DOM diff 的使用的。vue 中的 diff 算法主要是做同级比较，它会比较当前标签上的 key 和当前的标签名，如果 key 和标签名都一样，该算法就会更加高效的区分元素，提高复用已经渲染好的元素。在使用 v-for 的时候，尽量也不要使用索引作为 key 的值。

![image-20210318171438902](.\typora-user-images\image-20210318171438902.png)

有 key 的情况下，提高了 dom 元素的复用效率，避免了操作删除与新建 dom 元素。

### 描述组件渲染和更新过程

### vue 项目是打包了一个 js 文件，一个 css 文件还是多个文件。

### vue 组件之间的通信规则（单项数据流）

![image-20210318195124518](.\typora-user-images\image-20210318195124518.png)

### Vue 中相同的逻辑如何抽离

核心：Vue.mixin( )用法

Vue.mixin( )给组件每个生命周期，函数等都混入一些公共逻辑。

### 为什么要使用异步组件

异步组件是一个函数或返回对象

![image-20210318200510149](.\typora-user-images\image-20210318200510149.png)

### axios 是什么，如何使用，描述使用它实现登录功能的流程。

### vue.cli 项目中目录中 src 目录每个文件夹和文件的用法。

### 函数式组件产生的背景和优势

### 对比 jQuery，Vue 有什么不同。

### 使用 vuex 只需要执行 Vue.use（Vuex），并在 Vue 的配置中传入一个 store 对象的示例，store 是如何实现注入的。

### 请详细描述对 vue 生命周期的理解（面试必问）

![img](https://img-blog.csdnimg.cn/20200303230959190.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjQ2MjQ5,size_16,color_FFFFFF,t_70)

![img](https://img-blog.csdnimg.cn/20200303231331142.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjQ2MjQ5,size_16,color_FFFFFF,t_70)

![img](https://img-blog.csdnimg.cn/20200303231357633.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjQ2MjQ5,size_16,color_FFFFFF,t_70)

![img](https://img-blog.csdnimg.cn/20200303231435876.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjQ2MjQ5,size_16,color_FFFFFF,t_70)

#### 请求后端数据一般在哪个生命周期函数中进行，为什么？ajax 请求放在哪个生命周期中

​ 理论上只要在 created 之后都可以放 Ajax 请求，但一般都在 created 或者 mounted 中发 Ajax。生命周期函数调用的顺序都是同步调用的，不会有阻塞过程，在这些生命周期中写的回调函数并不会阻塞代码执行。

理解:

​ Ajax 请求放在 created 的不足：在 created 的时候，视图中的 dom 并没有渲染出来，所以此时如果请求回来的内容要直接去操 dom 节点，无法找到相 关的元素。

​ 在 mounted 中，由于此时 dom 已经渲染出来了，所以可以直接操作 dom 节点 。但是不足是，服务端渲染（SSR）是没有 DOM 的，服务端渲染是把 View 页面渲染为字符串返回。服务端渲染不支持 mounted 方法，所以在服务端渲染的情况下统一放到 created 中。

#### 何时需要使用 beforeDestroy

**理解:**

1.可能在当前页面中使用了 $on 方法，那需要在组件销毁前解绑。

2.清除自己定义的定时器

3.解除事件的绑定 scroll mousemove ....

### Vue 中模板编译原理

本质问题：如何将 template 转化成 render 函数

1. 将模板转化为 AST 树（虚拟 DOM 节点：用对象及其嵌套完成对模板的描述）
2. 优化树
3. 将 AST 再生成会 js 代码

### 父子组件生命周期函数执行顺序

- 加载渲染过程

  父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted

- 子组件更新过程　　父 beforeUpdate->子 beforeUpdate->子 updated->父 updated

- 父组件更新过程　　父 beforeUpdate->父 updated

- 销毁过程　　父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

### 自定义组件的 v-model

#### 为什么 V-for 和 v-if 不能连用

v-for 会比 v-if 的优先级高一些,如果连用的话会把 v-if 给每个元素都添加一下,会造成性能问题。

![image-20210318162446710](.\typora-user-images\image-20210318162446710.png)

上图中，会先循环 div 三次，，然后再给每个 div 加上一个条件判断。

### **用 vnode 来描述一个 DOM 结构**

虚拟节点就是用一个对象来描述真实的 dom 元素

```javascript
<div id="container"><p>hello Vue</p></div>

//描述为对象的话是：
let obj = {
    tag:'div',
    attr:{
        id:'container'
    }
    childeren:[{
    	tag:'p',
    	attr:{},
    	children:[{
            text:'hello Vue'
        }]
	}]
}

//另一种描述方式
render(){
    return _c('div',{id:'container'},_c('p',{}))
}
```

![img](https://img-blog.csdnimg.cn/20200303232552476.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxNjQ2MjQ5,size_16,color_FFFFFF,t_70)

template 转为 ast 树，ast 树又通过 codegen 转成 render 函数，render 函数内部调用的就是\_c（$createElement）方法后转为虚拟 DOM。

### diff 算法的时间复杂度

#### vue 中的 diff 做了哪些优化

​ 两个树的完全的 diff 算法是一个时间复杂度为 O(n3) , Vue 进行了优化·O(n3) 复杂度的问题转换成 O(n) 复杂度的问题(只比较同级不考虑跨级问题) 在前端当中， 你很少会跨越层级地移动 Dom 元素。 所 以 Virtual Dom 只会对同一个层级的元素进行对比。

#### 简述 Vue 中 diff 算法原理

理解： 1.先同级比较，在比较子节点 2.先判断一方有儿子一方没儿子的情况

3.比较都有儿子的情况

4.递归比较子节点

### Vue 中事件绑定原理

事件绑定：

- 原生 DOM 的事件绑定

  ```
  <button @click="fn">点击</button>
  ```

  原生 DOM 事件的绑定采用的是 addEventListener 实现

- 组件事件绑定(原生事件和组件自定义事件)

  ```
  <myCom @click.native="fn"  @click='fn1'></myCom>
  ```

  组件绑定事件采用的是$on()方法实现,也就是给组件自己发布订阅事件。通过组件自己的$on()方法订阅一个事件，在通过组件自己$emit()方法发布事件。

  如果在开发中，要循环生成大量的元素并为每个元素都绑定原生事件，那么可以不将事件都注册到每个循环生成的元素生成，而是在循环的外层采用事件代理的方式提高性能。

![image-20210318181959430](.\typora-user-images\image-20210318181959430.png)

![image-20210318182139726](.\typora-user-images\image-20210318182139726.png)

vue-loader 中使用的编译模板的包——vue-template-compiler

### 用 jQuery 与 Vue 开发项目的区别是什么？

### 为什么 Vue 中每个组件都有一个 data，它为什么又要是函数而不直接写为对象？

### 数据变化后驱动视图进行更新

### vue 虚拟 dom & diff 算法

### vue3 解决什么问题

### Vue 为什么不能检测数组和对象的变化,怎么处理(为什么通过索引操作数组不能触发响应式)

### vue router 原理

### v-model 实现原理以及如何自定义 v-model（面试必问）

v-model 可以看作 value+input 方法的语法糖。组件的 v-model 就是 value+input 方法的语法糖，而 checkout 或者 select 的 v-model 则不一定是 value+input 方法的语法糖。checkout 的 v-model 还可以看作是 checked+change 的语法糖。

```
<input type='text' v-model='msg'/>

<mycom :value="" @input=""></mycom>
<mycom v-model=check></mycom>
```

![image-20210318190335076](.\typora-user-images\image-20210318190335076.png)

#### 组件自定义 v-model 事件

![image-20210318190624685](.\typora-user-images\image-20210318190624685.png)

源码：

![image-20210318190753384](.\typora-user-images\image-20210318190753384.png)

### vue.nexttick

### vue 中 v-html 会导致什么问题

- 可能导致 xss 攻击
- v-html 会替换标签内部的子元素

### 父子组件生命周期函数调用的顺序

### 对 MVVM 的理解

![image-20210318113733467](.\typora-user-images\image-20210318113733467.png)

- 传统架构模型 MVC（从前端到后台统一称为 MVC）,前端叫视图层，后端数据库 M 层。 MVC 指的是用户操作界面获取数据时，会请求服务端路由，路由会调用对应的控制器来处理，控制器会过去数据，将结果返回给前端，页面重新渲染。 这种方向是单项的，而且是针对整个应用架构。
- 以前都是手动操作后台获取到的数据，将数据渲染到页面上，这就要开发者手动的操作 DOM，非常麻烦而且性能低下。随着前端的页面越来越复杂，不再是以前的只通过后端来渲染页面。对于前端的单页应用，我们又把 MVC 中的 V 层，也就是前端视图层又进行了抽离，抽离出了一个 MVVM。在 MVVM 中，V 指的是 DOM 元素，M 数据就是前端的静态数据或从后台获取的数据。VM 就是中间的调度层。Vue 框架就是一个典型的 MVVM 框架，我们将数据挂载到 Vue 实例上， 通过 vue 渲染视图，避免的调用 API 操作 DOM。同样，视图更改了，vue 实例也会更改 m 数据。

### Vue 的双向数据绑定的原理（vue 响应式原理）

核心点：Object.defineProperty（内部对应一个方法：defineReactive(obj,keys[i])），给数据的获取和设置都增加拦截功能，增加自己的业务逻辑（依赖收集）。

默认 Vue 在初始化数据时，会给 data 中的属性通过遍历方式使用 Object.defineProperty 重新定义所有属性，当页面读取到对应的属性时，会进行依赖收集（收集当前组件的 watcher），如果数据发生变化会通知相关依赖进行更新操作。

![image-20210318121345123](.\typora-user-images\image-20210318121345123.png)

```javascript
Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get: function reactiveGetter() {
    const value = getter ? getter.call(obj) : val;
    if (Dep.target) {
      dep.depend(); // ** 收集依赖 ** /
      if (childOb) {
        childOb.dep.depend();
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
    }
    return value;
  },
  set: function reactiveSetter(newVal) {
    const value = getter ? getter.call(obj) : val;
    if (newVal === value || (newVal !== newVal && value !== value)) {
      return;
    }
    if (process.env.NODE_ENV !== 'production' && customSetter) {
      customSetter();
    }
    val = newVal;
    childOb = !shallow && observe(newVal);
    dep.notify(); /**通知相关依赖进行更新**/
  }
});
```

#### Vue 的双向数据绑定针对数组是怎么处理的（Vue 中是如何检测数组变化? ）

- 数组并没有使用 Object.defineProperty 去重新定义数组的每一项
- 使用函数劫持的方式，重写了数组的方法
- Vue 将 data 中的数组，进行了原型链重写。指向了自己定义的数组原型方法，这样当调用数组 api 时，可以通知依赖更新.如果数组中包含着引用类型。会对数组中的引用类型再次进行监控。
- 对于数组可能存在的对象元素，会遍历数组或深度遍历数组对象，对对象类型数据进行观测

重写的数组方法都是那些能修改原数组的数组方法：push,shift,unshift,pop,splice ,reverse ,sort 。

改写的方法：

```javascript
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
methodsToPatch.forEach(function (method) {
  // 重写原型方法  const original = arrayProto[method]
  // 调用原数组的方法
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted); // 对新增的数据进行观测，因为它可能是对象类型
    ob.dep.notify(); // 当调用数组方法后，手动通知视图更新
    return result;
  });
});
this.observeArray(value); // 进行深度监控
```

![image-20210318122319512](.\typora-user-images\image-20210318122319512.png)

### Vue 异步渲染

#### 什么是 vue 的异步渲染

触发页面的响应动作数据同步变化的时候，页面订阅的响应操作不会与数据变化完全对应，而是在所有的数据变化操作做完之后，页面才会得到响应，完成页面渲染。（多个数据在一次同步逻辑中被修改了，它们对应的是同一个 watcher，过滤同一个只留下一个 watcher，等数据都改完之后再去更新视图。避免一改数据就更新视图而做的异步更新。）

```javascript
import Vue from 'Vue';
new Vue({
  el: '#app',
  template: '<div>{{val}}</div>',
  data() {
    return {
      val: 'init'
    };
  },
  mounted() {
    this.val = '我是第一次页面渲染'; // debugger
    this.val = '我是第二次页面渲染';
    const st = Date.now();
    while (Date.now() - st < 3000) {}
  }
});
//在mounted里给val属性进行了两次赋值，如果页面渲染与数据的变化完全同步的话，页面应该是在mounted里有两次渲染。而由于Vue内部的渲染机制，实际上页面只会渲染一次，把第一次的赋值所带来的的响应与第二次的赋值所带来的的响应进行一次合并，将最终的val只做一次页面渲染。而且页面是在执行所有的同步代码执行完后才能得到渲染，在上述例子里的while阻塞代码之后，页面才会得到渲染，就像在熟悉的setTimeout里的回调函数的执行一样，这就是的异步渲染。
```

vue 是组件级别的更新，当前组件的数据变了，他就会去单独跟新该组件。一个组件的数据可能非常多，一次业务逻辑处理可能会更新多个组件数据，，如果一更改某个数据就重新渲染组件，那会使得组件多次渲染，性能不高。

#### 为什么 Vue 采用异步渲染

​ 因为如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染.所以为了性能考虑。 Vue 会在本轮数据更新后，再去异步更新视图。

​ 核心方法：nextTick( )

![image-20210318125342748](.\typora-user-images\image-20210318125342748.png)

​ 当数据变化之后，调用 notify 方法，通知 watcher 进行更新，watcher 调用自己的 update 方法进行更新，更新的时候并不是立即让 watcher 去执行，而是把 watcher 放在了一个队列中（queueWatcher），在队列中对 Watcher 进行过滤，相同的 Watcher 只留下一个，最后再异步的刷新 queueWatcher。

```javascript
update () {    /* istanbul ignore else */    
    if (this.lazy) {      
        this.dirty = true  
    } else if (this.sync) {      
        this.run()  
    } else {    
        queueWatcher(this); // 当数据发生变化时会将watcher放到一个队列中批量更新  
    }
}
export function queueWatcher (watcher: Watcher) {  
    const id = watcher.id // 会对相同的watcher进行过滤  
    if (has[id] == null) {    
        has[id] = true    
        if (!flushing) {      
            queue.push(watcher)  
        } else {      
            let i = queue.length - 1      
            while (i > index && queue[i].id > watcher.id) {        
                i--   
            }      
            queue.splice(i + 1, 0, watcher)  
        }    
        // queue the flush    
        if (!waiting) {    
            waiting = true
            if (process.env.NODE_ENV !== 'production' && !config.async) {        
                flushSchedulerQueue()        
                return    
            }      
            nextTick(flushSchedulerQueue) // 调用nextTick方法 批量的进行更新  
        }
    }
}
```

#### nextTick 原理

**理解:(宏任务和微任务) 异步方法** nextTick 方法主要是使用了宏任务和微任务(时间循环机制),定义了一个异步方法.多次调用 nextTick 会将方法存入 队列中，通过这个异步方法清空当前队列。 所以这个 nextTick 方法就是异步方法

多次调用 nextTick 方法并传入回调函数，nextTick 内部会维护一个数组，，将这些回调放入，之后再异步的回调数组中的这些回调函数。这样用户就可以在视图更新之后在获取到真实的 DOM 元素。

![image-20210318133746187](.\typora-user-images\image-20210318133746187.png)

```javascript
let timerFunc; // 会定义一个异步方法
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  // promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' && // MutationObserver
  (isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, { characterData: true });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined') {
  // setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    // setTimeout
    setTimeout(flushCallbacks, 0);
  };
} // nextTick实现
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
}
```

### Vue 中 Computed 的特点

#### computed，watch，method 的区别

方法只要一用到模板上了，那么每次重新渲染视图，重新调用 methods 方法，性能开销比较大。Computed 则是具有缓存机制的，减少方法重新执行的概率。

#### watch 中的 deep：true 是如何实现的

### 自定义指令（v-click-outside）

当鼠标点击了指令所绑定元素的外部时，就会触发绑定方法。用途如：当选择器的下拉框展示时，监听鼠标点击事件，如果鼠标位置在整个选择器外部时，进行隐藏下拉框。

```javascript
<div id="app">
    <!-- <input type="text" @focus='show' @blur='hide'> -->
    <div v-click-outside>
      	<input type="text">
    	<div class="container" v-if="isshow">
      	<button>点击</button>
    	</div>
  	</div>
</div>

directives:{
  'click-outside':{
     bind(el,bindings,vnode){
       el.hander=function (ele) {
         if(el.contains(ele.target)){
           vnode.context['show']()
         }else{
           vnode.context['hide']()
         }
       }
       document.addEventListener('click',el.hander)
  },
 	 unbind(el){
   	   document.removeEventListener('click',el.hander)
     }
  }
},
methods: {
 show(){
    this.isshow=true
},
 hide(){
    this.isshow=false
 }
}
```

### vuex 的理解，使用，原理与使用场景

### vuex 有哪几种属性

### Vuex 中的 action 和 mutation 的区别

### 如何解决 vuex 持久化问题

vuex 实例中的数据时存在内存中的，如果代码一刷新会丢失，解决丢失问题就是再处理持久化问题。

![image-20210318211345868](.\typora-user-images\image-20210318211345868.png)

## 珠峰架构 Vue 面试题

### Vue2.0 中响应式数据的理解

首先明确什么是响应式数据，它的作用。 知道基本的问题， 基本源码逻辑，用时的问题。

它可以监控一个数据的获取或操作。针对对象类型的数据使用 Object.defineProperty 方法然后内部递归来实现的。

源码大致流程:this.\_init(options) => initState(vm),初始化状态，包括对 props，methods, data, computed 和 watch 的初始化 => initData(vm) => observe(value) => new Observe(value) => 针对对象和数组进行分流（this.walk(value)和 this.observeArray(value)） => defineReactive(obj,key) ，可以递归。

```js
var obj = Object.freeze({});
Object.isExtensible(obj); // false
```

内部使用 Object.defineProperty 对对象的属性进行重写，有比较大的性能消耗。同时会递归增加对象中的对象属性的 getter 和 setter,也比较消耗性能。

由此引出的思考：

1. 在 data 中的数据应该避免对象中数据的嵌套层级过深；
2. 如果数据不需要响应式的能力，则不用要数据放在 data 中；
3. 属性取值时，尽量避免多次取值，比如避免在循环语句中取用 data 中的数据；
4. 如果有些对象属性需要放在 data 中，但是不需要响应式的能力，可以考虑采用 Object.freeze( ) 冻结对象

### Vue 中如何检测数组的变化

vue2 中检测数组的变化并没有采用 Object.defineProperty,与因为在实际开发中很少直接通过数组的索引去操作数组。如果直接使用 Object.defineProperty 去给数组的每一项添加 getter 和 setter（数组的 length 属性无法通过 Object.defineProperty 设置 getter 和 setter），会浪费大量性能。为了实现数组的响应式，是通过对 data 中的数组类型的数据依次重写它们的原型来实现响应式的。 同时会循环数组中的每一项，然后尝试对每一项进行进行观测。

所以通过数组的索引或者修改数组长度是无法进行监控的。

### Vue 中如何进行依赖收集

所谓的依赖收集就是一种模式——观察者模式，其中被观察者指的就是 Vue 中的数据主要是指代 data 中的数据，观察者就是 watcher（渲染 watcher，计算属性 watcher 和用户 watcher（监视属性））。被观察者收集自己对应的观察者，每个观察者同时也会收集自己的被观察者（Dep）。Watcher 和 Dep 之间是多对多的关系。Watcher 收集自己的 Dep 只要是为了之后在组件卸载或者组件条件性渲染某些不同数据时，可以在被观察者中清除 watcher 本身或者组件重新渲染的时候重新记录 watcher。

组件或者 Vue 实例在渲染的时候，会调取首先将组件或者实例自己对应的 watcher 赋值给 Dep.target 上，然后调用组件自身的 render 方法，render 方法中的\_c( ), \_v( ), \_s( )等函数的调用会去组件实例上去对应的属性，从而触发响应式数据的 getter 函数将 Dep.target 中的绑定的 watcher 收集起来。数据更新后就找到数据对应 Dep 对应的 watcher 进行更新。

![image-20220115142254796](.\typora-user-images\image-20220115142254796.png)

### 模板编译

模板编译是指将用户编写的 template 属性或者 el 指代的标签部分的模板编译为 render 函数。

主要的步骤：

1. 将 template 编译为 ast 语法树
2. 对语法树进行标记（标记静态节点）进行标记的原因：节点中的某些部分的数据内容是写死的，之后的 diff 算法完全不需要再对该部分进行比较，标记为静态节点的标签及其内部 html 部分都会在 diff 算法时直接跳过，而只需要比较可变得部分。（递归标记且深度优先，先子后父，子节点一旦不为非静态节点，则父节点就不会为静态节点。）
3. 将 ast 语法树（树结构的对象）生产 render 函数

在模板之后的每次渲染时，可以调用 render 函数返回虚拟节点。

在 Vue 的源码中编译处理交给 compiler 模块。

### 生命周期函数的实现

生命周期函数的实现就是内部使用了发布订阅模式来实现的，将用户写的生命周期函数维护成一个数组，后续依次调用。主要的调用方法是 callHook。

### Vue2 中的生命周期方法

- beforeCreate:该函数执行时，没有实现响应式数据，同时也没有将数据代理到 vue 实例上。在 beforeCeate 执行前处理的任务有：合并构造函数的静态属性 options 和自己的 options，initLifecycle(vm)，initEvents(vm)，initRender(vm)。 initLifecycle（vm）: 初始化生命周期中组件的父子关系 initEvent(vm)：初始化组件的发布订阅事件系统，如$on,$emit,$once,$off 等 initRender(vm)：声明一些变量方法，比如$createElement，$slots，$scopedSlots 等

  该生命周期函数在 Vue3.0 中被取消。

- created：在该函数执行前执行了 initInjection(vm)，initState(vm)，initProvied(vm)。 initInjection(vm)：初始化 inject 方法 initProvied(vm)：初始化 provied 方法 initState(vm)：响应式数据处理在该生命周期函数执行时，可以通过 vue 实例获取数据，且数据都条件性的实现了响应式的能力，但是这里不涉及 DOM 渲染，这个 api 可以在服务端渲染中使用。

  在 Vue3 中有 setup 取代该函数。

- beforMount：执行该函数时，已经开启过渲染流程了（模板编译为了 render 函数），没有什么实际价值。

- mounted：该函数执行会在实例执行完\_updated 函数之后（new Watcher 完成后）被调用，这时数据已经挂载到真实的页面上，可以进行一系列的 DOM 操作，网络请求去和获取$el 等。

- beforeUpdate 和 updated：几乎不会使用

- activated 和 deactivated：keep-alive 中的函数

- beforeDestory 和 destoryed:手动调用移除方法（$destroy），组件条件渲染，路由切换或者 :is 动态组件 会依次触发。beforeDestory 执行时 watcher 实例还在，数据都还是响应式的。destoryed 组件实例及其方法等都被移除。 清理定时器的逻辑可以在两者中的任何一个中完成，因为不涉及 watcher 和组件操作。

  让相关的依赖数据的 Dep 的订阅数组中移除该 watcher 自己。

  ```js
  teardown(){
      if(this.active){
          if(!this.vm._isBeingDestoryed){
              remove(this.vm._watchers,this)
          }
          let i = this.deps.length
          while(i--){
              this.deps[i].removeSub(this)
          }
          this.active = false
      }
  }
  ```

  调用组件的$off 方法，移除所有的事件。

- errorCaptured

**一般发送网络请求在哪个生命周期函数中**

一般选择在 mounted 函数中发送网络请求。，当然 created 中也是可行的，一般认为 created 中发出网络请求更早数据就能更早回来，但这是个错误的认知。Vue 源码是同步执行的，而网络请求是异步执行的，所以再快也得在下一个事件环中重新渲染组件实例。 但也可以就具体请求具体考虑，在 created，beforeMount，mounted，beforeUpdate 等中都可以视情况选择。

### Vue.mixin 的使用场景和原理

该 API 可以用于将公共的逻辑（主要用它混入生命周期函数）或者数据混入每个组件中。在 vue router 和 vuex 中都使用了该 API。该方法虽然实现了逻辑或者数据的复用，但是也存在有问题，问题在于数据来源不明确，同时对于数据，可能存在命名相同的情况导致优先取用组件自身 options 配置对象中的数据（源码中的 mergeOptions 优先采用组件自身的数据）。

```js
Vue.mixin({
  data() {
    return { xxx: 11 };
  },
  beforeCreate() {
    this.$store = new Store();
  },
  beforDestroy() {
    //...
  }
});

Vue.component('my', {
  data() {
    return {
      xxx: 123
    };
  },
  template: '<div>{{xxx}}</div>'
});
```

```js
const request = ()=>{}
Vue.mixin({
    beforeCreate(){
        this.$request = request
    }
})


Vue.mixin({
    beforeCreate(){
        const request = ()=>{}
        this.$request = request
    }
})

//而不用使用Vue.prototype.$request = request这种写法

new Vue({
    el:'#app',
    components:{
        my:{
            template:"<div @click="handle">请求</div>",
            methods:{
            	handle(){
        			console.log(this.$request)
    			}
        	}
        }
    }
})




const  mixin = {
    created:function(){
        //先执行....
    }
}

let vm = new Vue({
    created(){
        //后执行....
    },
    mixins:[mixin]
})
```

```js
import { mergeOptions } from '../util/index';

export function initMixin(vue) {
  Vue.mixin = function (mixin) {
    // 该函数内部this指的就是Vue构造函数本身，所以mixin方法是在Vue构造函数的静态属性options上添加了属性或者方法
    this.options = mergeOptions(this.options, mixin);
    return this; // 还可以链式调用
  };
}
```

mixin 的核心就是合并属性（内部采用策略模式进行合并），分全局 mixin 和局部 mixin，同时针对不同属性有不同的合并策略。

在 React 中可以采用高阶组件实现对逻辑或者数据的复用，在 Vue3 中采用 compositionAPI 解决逻辑或者数据复用问题。

### Vue 组件 data 为什么必须是一个函数

在 Vue.mixin( ) 方法中，要混入 data 时，data 也是一个函数返回一个对象的形式。在定义组件时，Vue.component('comName',{ data(){},.....} 中 data 也是函数返回对象。其实这两个 API 中 data 都采用函数的形式，因为他们的底层源码的逻辑都是一样的，都是用各自的构造函数上的静态属性——options 进行合并。

每次声明一个组件，源码内部都是调用的 Vue.extend 方法，它会将组件的配置对象方法组件构造函数的静态属性 options 上，之后每次创建同一个组件的不同实例时都是使用同一个静态属性中的 options，如果 options 中的 data 是对象类型，那么每个实例对象都通过同一个引用执行同一个堆内存中的空间，导致各个同一个构造函数的不同组件实例之间都共享同一个引用类型的数据，从而导致彼此相互影响。

如果 data 是函数形式，在源码内部会先执行该函数，然后将函数的返回对象作为 data。这样就能避免引用同一个内存地址。

### nextTick

nextTick 内部采用了异步任务进行包装。具体是采用宏任务还是微任务 API，内部是通过一系列的条件判断，以优雅降级的方式进行确定的，首先是检测 Promise，然后 mutationObserver，然后 setImmediate，最后是 setTimeout。 在项目中一旦有响应式数据的变更，都会触发组件的 watcher 的重新渲染。但是组件的渲染是异步执行的，其内部也是通过 nextTick 来实现异步更新视图的。

在调用 nextTick(cb)函数时，传入的回调函数首先会被维护在一个队列中，同时在开启一个异步异步任务，该异步任务在主线程中的代码执行完毕后再去依次取出队列中的回调进行执行。

主要应用场景是异步更新，默认调度的时候将会添加一个 nextTick 任务。用户为了获取最新的渲染结果，需要在内部任务执行之后再执行自己的代码逻辑，这时就需要 nextTick 方法来实现。

nextTick(cb)中的回调函数在该方法执行时就放入队列当中了，且是按照执行 nextTick 的顺序依次入队的。在下一个事件环中，异步任务只是按照顺序依次取出队列中的回调进行执行。**入队是同步的，执行是异步顺序执行**

对于组件而言，在每次视图中的多个数据都发生改变时，不是当一个数据一变就立马开始遍历该数据对应的 watcher 去更新视图，而是先将数据收集的 watcher 去重后入队。

```html
//面试题
<div id="app">{{num}}</div>

<script>
  const vm = new Vue({
    el: '#app',
    data: {
      num2: 10
    }
  });

  console.log(vm.$el.innerHTML);

  vm.$nextTick(() => {
    console.log(vm.$el.innerHTML);
  });

  vm.root = 100;
</script>
```

### computed 与 watch 的区别与相同

它们源码中都对应自身的 watcher 实例，不同的是 computed 具备缓存功能，computed 只要当依赖的属性发生变化时才会更新视图。computed 默认不会先执行，只有取值时才会执行，内部会维护一个 dirty 属性来控制依赖的值是否发生过变化，默认计算属性的值是通过执行 getter 函数后返回的，所以只能同步返回结果，异步任务的结果无法返回（有个第三方的包可以让 computed 属性变为异步的）；watch 中默认用户会提供至少一个回调函数，监视的数据变化就会执行该回调函数。

watch 可以监听计算属性

![image-20210318134741962](.\typora-user-images\image-20210318134741962.png)

#### computed 与 watch 的区别

它们两个内部都使用了 new Watcher 来实现，唯一不同的是 computed 具备缓存功能，computed 只要当依赖的属性发生变化时才会更新视图。computed 默认不会先执行，watch 会先执行。

![image-20210318134741962](.\typora-user-images\image-20210318134741962.png)

### Vue.set 方法的实现

该 Api 算是 vue 中的一个补丁方法，因为在正常情况下添加属性是不会触发视图更新，因为初始渲染时，vue 框架只对已有属性进行劫持，之后新增的属性没有添加 getter 和 setter；数组也无法监控索引和长度。

在对数据进行响应式设置时，为每一个引用类型的数据（observe）都添加了一个 Dep 属性，所以对象和数组本身就是一个被观察者，可以收集自己的观察者。

当设置新属性或操作数组具体的某索引项时，会触发该对象或者数组对应的 Dep 进行视图的重新渲染。

### Vue 中为什么引入虚拟 DOM

一套代码可能针对不同的平台来使用，以实现跨平台问题，不用关系兼容性问题，可以在上层将对应的渲染方法传递给不同的渲染层逻辑，渲染层通过虚拟 DOM 渲染即可。

用于 Diff 算法，用虚拟 DOM 通过 Diff 算法来找到最后的差异进行修改，实现差量更新 DOM。为真实 DOM 做了一个缓存。

### Vue 中的 diff 算法

算法的特点是同级比较，内部采用了双指针方式对和数组相关的常见操作（头部追加，尾部追加，中间插入，倒序和反转等）进行优化。

采用递归比较的方式，先拿出根节点进行比较 ，如果是同类型节点则比较属性，如果不是相同节点则直接换成最新的；

相同类型节点比较属性后，复用老节点；

递归比较节点内的后代节点，一方有后代节点，一方没有，则删除或者添加；

两个 VDOM 都有后代节点，则优化比较，头和头比，尾和尾比，头尾交叉比对，还不满足就做一个映射表，用新的 VDOM 中的节点去依次比较映射表中的节点，存在相同的节点则移动老的节点即可，不存在则插入，多余的则删除。

### 既然 Vue 通过数据劫持可以准确的探测数据的变化，为什么还需要虚拟 DOM 进行 diff 检测差异

如果给每个属性都去增加 watcher，页面中常常有大量的数据，所以也必然会便随着大量的 watcher 产生，这样就就比较浪费内存。而且粒度太小不好管控，在组件层次设置 watcher 可以有效的减少 watcher 的数量，某个属性变化后，会将整个组件都更新，但是完全这样做每个属性都要进行比较也比较耗费性能，所以使用 diff 算法和响应式原理折中优化渲染该过程。

### key 的原理和作用

在 diff 算法过程中的一个方法——isSameVnode 中会根据 key 值来判断两个元素是否是同一个元素，如果 key 不相同说明不是同一个元素（其中 key 值在动态列表中不建议使用索引，会有 bug）。

### Vue 组件化的理解

组件的有点：方便复用，更新可以是组件级别的更新。组件的三个重要特性：属性，事件和插槽。

### Vue 组件的渲染流程

注册组件（全局或者局部）；内部调用断 Vue.extend 以注册组件时传入的组件的配置对象生成继承了 Vue 构造函数的子类构造函数；调用组件构造函数后进行挂载，产生虚拟节点；做组件初始化，将虚拟节点转化为真实节点。
