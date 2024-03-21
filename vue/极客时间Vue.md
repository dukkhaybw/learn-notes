## 前文

体系和系统化学习。

写页面，工程化，监控，跨段，计算机专业知识（算法，编译原理，设计模式等）。

框架的目的都是帮助开发者快速高效的开发web应用，只是侧重点不同：

- React 注重数据不可变、虚拟 DOM 和运行时
- Svelte 运行时都非常轻量，侧重在于编译时的优化
- Angular 抽象且为了复杂项目
- Vue 权衡兼顾响应式、虚拟 DOM、运行时和编译优化



留心框架内部源码中的最佳实践，前端框架的设计原理、内部算法和设计模式，以及编译原理。

Vue3中的优秀设计：Composition 组合 API、基于 Proxy 的响应式系统、自定义渲染器等。



第一部分：

- 前端发展史和学习Vue3的原因

- 上手Vue3小应用

- 初步了解Vue3新特性

- 如何升级到Vue3



第二部分：

- Vue3核心内容和API实现



第三部分：

- Vue3的具体生态
- 实际开发中用到的库
- Vue 3 中集成 JSX、单元测试、服务端渲染 SSR



第四部分：

- 讲解实际开发中遇到的各种问题（如何设计⼀个通用组件库、如何动态控制页面路由、如何做性能优化、如何发布和打包）



第五部分：

- 源码，了解设计思想和思路





## 前端发展史

目的：

- 把握到 Vue 在前端框架中的地位和定位
- 为什么选择学习Vue框架，优势和它的价值



发展：

1. 整个 90 年代，受限于网速，网页都是静态页，显示单一，前端的工作大部分都只是让美工来切图和写 HTML+CSS，代码都是所有内容写在一起，还没有明确的前端工程师的工种。

2. 后来，后端越来越复杂，开始分层，代码也从揉在一起发展到 Model，View 和 Controller，分别负责不同的功能（后端 MVC 模式），JSP 和 Smarty技术实现页面和数据的动态渲染，这种模式下的任何数据更新，都需要刷新整个页面，并且在带宽不足的年代，这样做会耗费加载网页的时间。
3. 04年，Google在Gmail中引入Ajax技术，用户可以在不刷新页面的情况下进行复杂的交互，开启Web2.0，前端工程师开始出现。
4. Ajax诞生后，依然有浏览器的混战和兼容性问题（比如绑定事件不同的浏览器就要写不同的代码），随后到了jQuery时代，不再过多担心兼容性问题。
5. 09 年 AngularJS 和 Node.js开启前端MVVM 模式 和 前端工程化  ，前端框架的开始



前端三大框架：

（把 Controller 变成了 View-Model 层，作为 Model 和 View 的桥梁，Model 数据层和 View 视图层交给 View-Model 来同步）在前端 MVVM 模式下，利用数据驱动页面，数据发生变化后，怎么去通知页面更新，各个框架走出了不同的路线。

Angular 1：

- 脏检查，每次用户交互时都检查一次数据是否变化，有变化就去更新 DOM。

Vue 1：

- 响应式，初始化时，Watcher 监听数据的每个属性，数据发生变化时，就能精确地知道数据的哪个属性key变了，去针对性修改对应的 DOM 。

![image-20221002172819795](D:\学习笔记\vue\images\image-20221002172819795.png)

React：

- 在页面初始化的时候，在浏览器 DOM 之上，生成一个虚拟 DOM，即用一个 JavaScript 对象来描述整个 DOM 树，通过虚拟 DOM 计算出变化的数据，去进行精确的修改，提高了性能，同时还借助一个用js对象（JSON）来描述网页的工具，让虚拟 DOM 这个技术脱离了 Web 的限制。因为积累了这么多优势，虚拟 DOM 在小程序，客户端等跨端领域得到应用。



> 浏览器操作 DOM一直都很耗性能，而虚拟 DOM 的 Diff 的逻辑，又能够确保尽可能少的操作 DOM，这也是虚拟 DOM 驱动的框架性能一直比较优秀的原因之一。

![image-20221002173634149](D:\学习笔记\vue\images\image-20221002173634149.png)



Vue 与 React 框架的对比：

Vue 和 React 在数据发生变化后，在通知页面更新的方式上有明显的不同，在 Vue 框架下，如果数据变了，那框架会主动告知修改了哪些数据；而 React 的数据变化后，只能通过新老数据的计算 Diff 来得知数据的变化。

两种方式各自的性能瓶颈：

- 对于 Vue 来说，它的一个核心就是“响应式”，也就是数据变化后，会主动通知，响应式数据新建 Watcher 监听，本身就比较损耗性能，项目大了之后每个数据都有一个 watcher 会影响性能。
- 对于 React 的虚拟 DOM 的 Diff 计算逻辑来说，如果虚拟 DOM 树过于庞大，使得计算时间大于 16.6ms，那么就可能会造成性能的卡顿。



两个框架解决性能瓶颈的方法：

- React 为了突破性能瓶颈，借鉴了操作系统**时间分片**的概念，引入了 Fiber 架构。通俗来说，就是把整个虚拟 DOM 树微观化，变成链表，然后利用浏览器的空闲时间计算 Diff。一旦浏览器有需求，可以把没计算完的任务放在一旁，把主进程控制权还给浏览器，等待浏览器下次空闲。（这种架构虽然没有减少运算量，但是巧妙地利用空闲实现计算，解决了卡顿的问题。）

  ![image-20221002174101286](D:\学习笔记\vue\images\image-20221002174101286.png)

  > 在上图中，左侧是一个树形结构，树形结构的 Diff 很难中断；
  >
  > 右侧是把树形结构改造成了链表，遍历严格地按照子元素 -> 兄弟元素 -> 父元素的逻辑，随时可以中断和恢复 Diff 的计算过程。



![image-20221002174229436](D:\学习笔记\vue\images\image-20221002174229436.png)



- Vue在Vue 2中解决了性能问题，Vue 1 的问题在于响应式数据过多，这样会带来内存占用过多的问题。Vue 2 引入虚拟 DOM 来解决响应式数据过多的问题。**这个解决方案使用虚拟 DOM 解决了响应式数据过多的内存占用问题，又良好地规避了 React 中虚拟 DOM 的问题， 还通过虚拟 DOM 给 Vue 带来了跨端的能力。**



**响应式数据是主动推送变化，虚拟 DOM 是被动计算数据的 Diff，被 Vue 2 很好地融合在一起，采用的方式就是组件级别的划分。**

**对于 Vue 2 来说，组件之间的变化，可以通过响应式来通知更新。组件内部的数据变化，则通过虚拟 DOM 去更新页面。这样就把响应式的监听器，控制在了组件级别，而虚拟 DOM 的量级，也控制在了组件的大小。**——这就体现了Vue的中庸之道。

> 1. 引入虚拟dom的核心并不是为了通过diff得出需要更新的节点从而加快速度(有时候甚至会变慢)。而是给各种类型节点提供了一层向上的抽象， 这种抽象扩展了框架能够完成的功能，和简化了一些操作。在大多数情况下，操作最快的永远是直接操作Dom，这个svelte 好像就是这么做的。 
> 2. Vue2.x 中并不是仅仅只有组件级别的watcher ， 每个组件中的响应式数据也有watcher，在对应的deps上。只不过组件内部数据的watcher一般只会通知到组件级别的watcher, 然后由组件级别的watcher通知外部做对应的操作。



下图左边就是一个个的组件，组件内部是没有 Watcher 监听器的，而是通过虚拟 DOM 来更新，每个组件对应一个监听器，大大减小了监听器的数量。

![image-20221002175631289](D:\学习笔记\vue\images\image-20221002175631289.png)



除了响应式和虚拟 DOM ，Vue 和 React 还有一些理念和路线的不同，在模板的书写上，也走出了 template 和 JSX 两个路线。

![image-20221002175802184](D:\学习笔记\vue\images\image-20221002175802184.png)

React 的世界里只有 JSX，最终 JSX 都会在 Compiler 那一层，也就是工程化那里编译成 JS 来执行，所以 React 最终拥有了全部 JS 的动态性，这也导致了 React 的 API 一直很少，只有 state、hooks、Component 几个概念，主要都是 JavaScript 本身的语法和特性。



而 Vue 的世界默认是 template，也就是语法是限定死的，比如 v-if 和 v-for 等语法。有了这些写法的规矩后，我们可以在上线前做很多优化。**Vue 3 很优秀的一个点，就是在虚拟 DOM 的静态标记上做到了极致，让静态的部分越过虚拟 DOM 的计算，真正做到了按需更新，很好的提高了性能。**



在模板的书写上，除了 Vue 和 React 走出的 template 和 JSX 两个路线，还出现了 Svelte 这种框架，没有虚拟 DOM 的库，直接把模板编译成原生 DOM，几乎没有 Runtime，所有的逻辑都在 Compiler 层优化，算是另外一个极致。

![image-20221002180156602](D:\学习笔记\vue\images\image-20221002180156602.png)



问题：Vue 需不需要 React 的 Fiber ？

> Vue 不需要 React 的 Fiber，原因并不是Watcher的级别，而是虚拟DOM控制在组件级，最早Vue3的提案其实是包含时间切片方案的，最后废弃的主要原因，**是时间切片解决的的问题，Vue3基本碰不到** 
>
> 1. Vue3把虚拟DOM控制在组件级别，组件之间使用响应式，这就让Vue3的虚拟DOM不会过于庞大 
> 2. Vue3虚拟DOM的静态标记和自动缓存功能，让静态的节点和属性可以直接绕过Diff逻辑，也大大减少了虚拟DOM的Diff事件 
> 3. 时间切片也会带来额外的系统复杂性 所以引入时间切片对于Vue3来说投入产出比不太理想，在后来的讨论中，Vue3的时间切片方案就被废弃了



## 上手Vue

jQuery 的开发思路和 Vue.js 的开发思路的不同：

jQuery 的开发逻辑，就是先要找到目标元素，然后再进行对应的修改。

Vue则不要再思考页面的元素怎么操作，而是要思考数据是怎么变化的，只需要操作数据，至于数据和页面的同步问题，Vue 会帮我们处理。

任务清单应用：

```html

<div id="app">  
    <input type="text" v-model="title" @keydown.enter="addTodo">
    <button v-if="active<all" @click="clear">清理</button>
    <ul v-if="todos.length">
        <li v-for="todo in todos">
            <input type="checkbox" v-model="todo.done">
            <span :class="{done:todo.done}"> {{todo.title}}</span>
        </li>
    </ul>
    <div v-else>暂无数据</div>
    全选<input type="checkbox" v-model="allDone">
     <div>    
         {{todos.filter(v=>!v.done).length}}     
         /    
         {{todos.length}}  
    </div>
    <div>{{active}}/{{all}}</div>
</div>

<script>
const App = {
  data() {
    return {
      title: "", // 定义一个数据
      todos:[
        {title:'吃饭',done:false},
        {title:'睡觉',done:true}
      ]
    }
  },
  methods:{
    addTodo(){
      this.todos.push({
        title:this.title,
        done:false
      })
      this.title = ""
    },
    clear(){      
        this.todos = this.todos.filter(v=>!v.done)
    }
  },
   computed:{ 
       active(){ 
           return this.todos.filter(v=>!v.done).length 
       }, 
       all(){ 
           return this.todos.length
       },
       allDone: {      
           get: function () {        
               return this.active === 0
           },      
           set: function (val) {
               this.todos.forEach(todo=>{
                   todo.done = val
               });
           }
       }
   }
}
</script>



<style>
  .done{
    color:gray;
    text-decoration: line-through;
  }
</style>
```



1. 先在代码的 data 里声明数据；
2. 用v-model 和 {{}}显示数据；
3. v-for循环渲染列表数据；
4. 使用@符号给DOM绑定
5. 计算属性（computed）
6. methods配置项
7. 条件渲染

![img](https://static001.geekbang.org/resource/image/3c/72/3c8ddf81d6b478069d6b1dec7b605572.gif?wh=542x325)

## 新特性

Vue 2 是一个响应式驱动的、内置虚拟 DOM、组件化、用在浏览器开发，并且有一个运行时把这些模块管理起来的框架。

Vue2的不足：

- 从开发维护的角度看，Vue 2 是使用 Flow.js 来做类型校验。但现在 Flow.js 已经停止维护了，整个社区都在全面使用 TypeScript 来构建基础库。
- 从社区的二次开发难度来看，Vue 2 内部运行时，是直接调用浏览器 API ，这样就会在 Vue 2 的跨端方案中带来问题，要么直接进入 Vue 源码中，和 Vue 一起维护；要么是直接改为复制一份全部 Vue 的代码，把浏览器 API 换成客户端或者小程序的。比如 mpvue 就是这么做的，但是 Vue 后续的更新就很难享受到。
- **Vue 2 响应式并不是真正意义上的代理，而是基于 Object.defineProperty() 实现的（defineProperty 对不存在的属性无法拦截，对数组的操作一般不会改变数组的指向，只能对数组原型方法进行拦截来实现部分功能，对数组长度的修改等操作无法实现拦截，所以Vue2提供了额外的 $set 等 API）。**对某个属性进行拦截，所以有很多缺陷，比如：删除数据就无法监听，需要 $delete 等 API 辅助才能监听到。
- **Option API 在组织代码较多组件的时候不易维护。**



### Vue3新特性

Vue 3 继承了 Vue 2 具有的响应式、虚拟 DOM，组件化等所有优秀的特点，并且全部重新设计，解决了Vue2的不足。

1. RFC 机制

   该新特性和代码无关，而是 Vue 团队开发的工作方式。关于 Vue 的新语法或者新功能的讨论，都会先在 GitHub 上公开征求意见，邀请社区所有的人一起讨论。

2. 响应式系统

   defineProperty 是拦截具体某个属性，Proxy才是真正的代理，它不关心被代理对象具体的属性或方法，一有操作都统一拦截，而且 Proxy 还可以监听更多的数据格式，比如 Set、Map。Proxy 不兼容 IE11。

   > 在Proxy之前，是没有办法完整的监听一个 JavaScript 对象的变化，只能使用 Object.defineProperty() 去实现一部分功能。
   >
   > defineProperty 对不存在的属性无法拦截，所以 Vue 2 中所有数据必须要在 data 里声明。对于数组，处于性能考虑，是连接部分原型方法实现响应式的，但是对数组的长度的修改等操作还是无法实现拦截，所以还需要额外的 $set 等 API。

3. 自定义渲染器

   Vue 2 内部所有的模块都是揉在一起，不易扩展。Vue3使用monorepo管理方式，将响应式模块、编译模块和运行时模块全部独立（拆包）。

   ![image-20221003090801972](D:\学习笔记\vue\images\image-20221003090801972.png)

4. 全部模块使用 TypeScript 重构

   方便提示，并且让代码能够更健壮。

5. Composition API 组合语法

   Vue2中代码写法：

   ```html
   <div id="app">
     <h1 @click="add">{{count}} * 2 = {{double}}</h1>
   </div>
   <script src="https://unpkg.com/vue@next"></script>
   <script>
   let App = {
     data(){
       return {
         count:1
       }
     },
     methods:{
       add(){
         this.count++
       }
     },
     computed:{
       double(){
         return this.count*2
       }
     }
   }
   Vue.createApp(App).mount('#app')
   </script>
   ```

   

   Vue3中代码写法：

   ```html
   
   <div id="app">
     <h1 @click="add">{{state.count}} * 2 = {{double}}</h1>
   </div>
   <script src="https://unpkg.com/vue@next"></script>
   <script>
   const {reactive,computed} = Vue
   let App = {
     setup(){
       const state = reactive({
         count:1
       })
       
       function add(){
         state.count++
       }
         
       const double = computed(()=>state.count*2)
       return {state,add,double}
     }
   }
   Vue.createApp(App).mount('#app')
   </script>
   ```

   

   Options API存在的问题：

   1. 由于所有数据都挂载在 this 之上，因而 Options API 的写法对 TypeScript 的类型推导很不友好，并且这样也不好做 Tree-shaking 清理代码。
   2. 新增功能基本都得修改 data、method 等配置，会经常上下反复横跳，开发很痛苦。
   3. 代码不好复用，Vue 2 的组件很难抽离通用逻辑，只能使用 mixin，还会带来命名冲突的问题。

   Composition API的优点：

   1. 所有 API 都是 import 引入的，对 Tree-shaking 很友好。
   2. 不再上下反复横跳，可以把一个功能模块的 methods、data 都放在一起书写，维护更轻松。
   3. 代码方便复用，可以把一个功能所有的 methods、data 封装在一个独立的函数里，复用代码非常容易。
   4. Composotion API 新增的 return 等语句，在实际项目中使用\<script setup> 特性可以清除。

   

   Composition API对代码组织的表现：每一个功能模块的代码颜色一样，左边是 Options API，一个功能的代码零散的分布在 data，methods 等配置内，维护起来很麻烦，而右边的 Compositon API 就不一样了，每个功能模块都在一起维护。

   ![image-20221003092000895](D:\学习笔记\vue\images\image-20221003092000895.png)

   还可以将Composition API中相同颜色块的代码单独抽离为一个函数然后在其他地方复用。

6. 新的组件
   Vue 3 内置了 Fragment、Teleport 和 Suspense 三个新组件。

   - Fragment: Vue 3 组件不再要求有一个唯一的根节点，清除了很多无用的占位 div。
   - Teleport: 允许组件渲染在别的元素内，主要开发弹窗组件的时候特别有用。
   - Suspense: 异步组件，更方便开发有异步请求的组件。

7. 工程化工具 Vite
   按照现在的趋势看，使用率超过 Webpack 也是早晚的事。Vite 主要提升的是开发的体验，Webpack 等工程化工具的原理，就是根据你的 import 依赖逻辑，形成一个依赖图，然后调用对应的处理工具，把整个项目打包后，放在内存里再启动调试。

   由于要预打包，所以复杂项目的开发，启动调试环境需要的时间很长。Vite在调试环境下，不需要全部预打包，只是把你首页依赖的文件，依次通过网络请求去获取，整个开发体验得到巨大提升，做到了复杂项目的秒级调试和热更新。

   Webpack 的工作原理，Webpack 要把所有路由的依赖打包后，才能开始调试：

   ![image-20221003092615743](D:\学习笔记\vue\images\image-20221003092615743.png)

   

   Vite 的工作原理，一开始就可以准备联调，然后根据首页的依赖模块，再去按需加载，这样启动调试所需要的资源会大大减少。
   ![image-20221003092701618](D:\学习笔记\vue\images\image-20221003092701618.png)



> 使用 VS Code 开发的时候可以用 Todo Tree 插件在 data 返回的对象末尾和 methods 对象的末尾添加一个 TODO ，这样就可以迅速定位到 data 或者 methods 的末尾来添加变量 / 方法，解决了上下反复横跳的痛苦。 
>
> 另：也可以使用 Bookmarks 插件在相应的位置添加书签，之后使用快捷键来实现迅速定位到 data / methods 的最下方。
>
> Vue 2 的核心模块和历史遗留问题，我能想到还有一个：根据 [Vue2 的生命周期图示](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA) 当 `new Vue` 的时候，同时不给 el 或 $mount 让组件挂载，这时，beforeCreate 和 Create 依然会被执行，不合理。
>
> 但在 Vue3 中，只有 CreateApp 然后立刻调用 mount API，才会进入生命周期执行流程，更加合理。





## 升级

是否升级为Vue：

1. 新项目直接使用Vue3 + Vite
2. 老项目项想要体验Vue3的特性，可以使用Vue2.7的版本，Vue 2.7 会移植 Vue 3 的一些新特性，让你在 Vue 2 的生态中，也能享受 Vue 3 的部分新特性。Vue 2 项目中就可以基于 @vue/composition-api 插件，使用 Composition API 语法，Vue 2 会直接内置这个插件，在 Vue 2 中默认也可以用 Compositon 来组合代码。

![image-20221003164942922](D:\学习笔记\vue\images\image-20221003164942922.png)



**Vue3不兼容的语法**

项目启动中的不同写法：

Vue2使用new Vue(options)的方式新建应用。有一些全局的配置我们会直接挂在 Vue 上，比如通过 Vue.use 来使用插件，通过 Vue.component 来注册全局组件。

```js
Vue.component('el-counter', {
  data(){
    return {count: 1}
  },
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

let VueRouter = require('vue-router')
Vue.use(VueRouter)
```

**这种形式虽然很直接，但是由于全局的 Vue 只有一个，所以当我们在一个页面的多个应用中独立使用 Vue 就会非常困难。**

在 Vue 上先注册了一个组件 el-counter，然后创建了两个 Vue 的实例。这两个实例都自动都拥有了 el-couter 这个组件，但这样做很容易造成混淆。

```js
Vue.component('el-counter',...)

new Vue({el:'#app1'})
new Vue({el:'#app2'})
```

为了解决这个问题，Vue 3 引入一个新的 API ，createApp，来解决这个问题，也就是新增了 App 的概念。全局的组件、插件都独立地注册在这个 App 内部，很好的解决了上面提到的两个实例容易造成混淆的问题。示例：

```js
const { createApp } = Vue
const app = createApp({})
app.component(...)
app.use(...)
app.mount('#app1')

const app2 = createApp({})
app2.mount('#app2')
```

createApp 还移除了很多常见的写法，比如在 createApp 中，就不再支持 filter、$on、$off、$set、$delete 等 API。

Vue3中v-model的用法也有变化；slot 和 slot-scope 两者实现了合并；directive 注册指令的 API 有变化；



### Vue3生态

现在所有官方库的工具都全面支持 Vue 3，vue-router 也包含一些写法上的变化，比如从 new Router 变成 createRouter；使用方式上，也全面拥抱 Composition API 风格，提供了 useRouter 和 useRoute 等方法。

Vuex 4.0 也支持 Vue 3，不过变化不大。Vue 官方成员还发布了一个 Pinia，Pinia 的 API 非常接近 Vuex5 的设计，并且对 Composition API 特别友好。





### 项目升级

小项目：从 Vue 2 升级到 Vue 3，对于语法的改变之处挨个替换写法就可以。

复杂项目：借助几个自动化工具来帮过渡，在 Vue 3 的项目里，有一个 @vue/compat 的库，这是一个 Vue 3 的构建版本，提供了兼容 Vue 2 的行为。这个版本默认运行在 Vue 2 下，它的大部分 API 和 Vue 2 保持了一致。当使用那些在 Vue 3 中发生变化或者废弃的特性时，这个版本会提出警告，从而避免兼容性问题的发生，帮助很好地迁移项目。

在下面的代码中，首先我们把项目依赖的 Vue 版本换成 Vue 3，并且引入了 @vue/compat 。

```diff
"dependencies": {
-  "vue": "^2.6.12",
+  "vue": "^3.2.19",
+  "@vue/compat": "^3.2.19"
   ...
},
"devDependencies": {
-  "vue-template-compiler": "^2.6.12"
+  "@vue/compiler-sfc": "^3.2.19"
}
```

然后给 vue 设置别名 @vue/compat，也就是以 compat 作为入口，代码如下：

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('vue', '@vue/compat')
    ......
  }
}
```

这时就会在控制台看到很多警告，以及很多优化的建议。参照建议，挨个去做优化就可以了。



自动化替换的工具，自动化替换工具的原理很简单，和 Vue 的 Compiler 优化的原理是一样的，也就是利用编译原理做代码替换。如下图所示，我们利用 babel 分析左边 Vue 2 的源码，解析成 AST，然后根据 Vue 3 的写法对 AST 进行转换，最后生成新的 Vue 3 代码。

总结：在升级 Vue 的过程中，我们可以利用官方和社区的工具，帮助我们高效地升级。我们可以使用 compat 来给出提醒，项目中设置 @vue/compat 作为 vue 的别名，这样内部就会把所有和 Vue 2 的语法相关的升级信息提示出来，逐个替换即可，或者直接使用 gogocode 进行自动化批量替换。





## 搭建Vue3项目

- 项目搭建
- Composition API
- 响应式
- 组件化
- 动画

### 安装和构建开发环境


