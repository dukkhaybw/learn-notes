# Vue.js 面试

## 谈谈对Vue的理解

官方对vue的定义：Vue是一套用于构建用户界面的 **渐进式框架**，vue的核心库部分只关注视图层。响应式的框架，由数据驱动视图。

vue及其生态组成：

- 响应式系统
- 组件系统
- 客户端路由
- 大规模状态管理
- 工程化项目构建工具

特点：

- 声明式编写

- 借鉴了MVVM模式，发源于后端的MVC模式，目的都是进行项目代码的职责划分和分层管理

  mvc的结构图：egg.js和next.js都是mcv模式

  ![image-20241210180345029](D:\learn-notes\vue\images\image-20241210180345029.png)

  早期前端的mvc开发模式使用的开源库：backbone+ underscore模板引擎+ jquery

  前端使用MVC模式的不足，每个前端用户逻辑都需要编写一个controller来处理，大量的控制器中和其中的大量的DOMapi方法的使用，使得控制层变得异常复杂，不利于管理和维护。

  

  mvvm模式：对mvc模式在前端的应用过程简化了映射关系，隐藏了控制层。数据变化自动触发页面更新。

  ![image-20241210181959649](D:\learn-notes\vue\images\image-20241210181959649.png)

  将数据交给VM上去代为管理，交由vm去根据view去渲染，同时vm也代为管理页面上的一些用户操作，去操作数据。

  完全的MVVM模式中不能跳过VM去让V和M直接打交道的，但是vue中可以通过ref等方式直接操作V或者M层，所以vue并不是严格的MVVM模式。

- 采用虚拟DOM

  - 虚拟DOM节点远没有真实DOM节点复杂
  - 虚拟DOM可以方便的引入Diff算法，减少更新
  - 虚拟DOM可以很好的实现跨平台方面的应用

- 区分编译时和运行时两部分代码

- 组件化

  - **组件级更新**是指 Vue 在响应式数据变化时，根据组件的依赖关系，仅更新受影响的组件，而不是重新渲染整个页面。这种机制使得 Vue 可以高效地更新视图，避免不必要的 DOM 操作，从而提升性能。

  - **响应式系统：**

    - Vue 通过其响应式数据系统跟踪数据的依赖关系。每个组件会依赖某些响应式数据。
    - 当响应式数据发生变化时，Vue 会通知依赖该数据的组件重新渲染。

    **组件的独立性：**

    - 每个组件都有自己独立的渲染逻辑和虚拟 DOM。
    - 当组件的依赖数据更新时，仅触发该组件的更新，而不是其兄弟组件或整个父组件树。

    **虚拟 DOM 的局部更新：**

    - Vue 使用虚拟 DOM 进行高效的 DOM 操作。在组件更新时，Vue 会比较更新前后的虚拟 DOM，只更新发生变化的部分，进一步提升性能。

  - 当一个组件的响应式数据发生变化时，Vue 只会触发与该组件相关的虚拟 DOM 树进行更新和比较。

    **虚拟 DOM 的局部比较：**

    - 组件会维护自己的一棵虚拟 DOM 子树。
    - 当组件重新渲染时，Vue 会生成新的虚拟 DOM 子树，并与旧的虚拟 DOM 子树进行 **diff** 比较。
    - 只比较这个组件相关的虚拟 DOM 子树，而不会影响其他组件的虚拟 DOM。
    - Vue 避免了全局范围内的 diff 比较。





## 对SPA的理解

**SPA**（Single Page Application，单页应用）是一种**单页面应用程序架构**，指的是一个 Web 应用程序只有一个 HTML 页面，所有的内容和功能通过动态加载的方式在这一页中完成，而不是像传统网站那样切换多个页面。  客户端渲染（CSR）

**SPA核心特点**

1. **单一 HTML 页面：**
   - 整个应用程序只有一个入口页面（通常是 `index.html`）。
   - 用户与页面交互时，页面不会刷新或重新加载。
2. **动态内容加载：**
   - 应用的内容和功能通过 JavaScript 动态加载。
   - 基于路由的切换和数据的更新通过 API 请求完成，而不是重新加载页面。
3. **前后端分离：**
   - 前端负责界面的渲染和逻辑处理，后端主要提供数据接口（通常是 RESTful API 或 GraphQL）。
4. **路由管理：**
   - 虽然页面不刷新，但 URL 会动态变化，通常使用 JavaScript 路由库（如 Vue Router、React Router 等）管理页面路径。



**MPA**（Multi-Page Application，多页面应用）是一种传统的 Web 应用架构，每个功能页面对应一个独立的 HTML 页面，页面之间通过浏览器的跳转进行导航。每次跳转时，浏览器会重新向服务器请求 HTML 页面和相关资源（CSS、JS 等）。服务端渲染（SSR）

**MPA 的核心特点**

1. **多页面结构：**
   - 应用由多个独立的 HTML 页面组成。
   - 每个页面都有自己的 URL 和资源文件。
   - 一些公共的css，js可能需要重复加载。
2. **页面跳转：**
   - 页面之间的导航通常通过超链接或表单提交完成。
   - 每次跳转时，浏览器会重新加载页面的 HTML 和相关资源。
3. **后端渲染（SSR）：**
   - 页面内容通常由服务器端生成（即 SSR：Server-Side Rendering）。
   - 后端负责根据请求渲染页面并将完整的 HTML 返回给浏览器。
4. **无状态请求：**
   - 每次请求都是独立的，与其他页面无直接关联。



**SPA 与 MPA 的对比**

| 特性            | SPA                                                          | MPA                                                       |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| **页面跳转**    | 单页面，动态加载                                             | 多页面，每次跳转重新加载                                  |
| **首屏白屏**    | 首次加载需要下载大量的js、CSS 和其他资源，可能会导致页面加载时间较长 | HTML 是服务器直接生成的，页面不需要等待js完全加载后再渲染 |
| **用户体验 **   | 流畅，无页面刷新                                             | 页面刷新可能造成延迟                                      |
| **SEO**         | 传统 SPA 因为内容是通过js动态加载的，对搜索引擎不友好。不过可以通过 SSR（服务端渲染）或预渲染技术解决 | 原生支持良好                                              |
| **开发复杂度 ** | 高，需前端框架和工具                                         | 低，适合小型项目                                          |
| **性能优化**    | 适合需要大量前端交互的场景                                   | 适合以内容展示为主的场景                                  |
| **可维护性**    | 相对容易                                                     | 相对复杂                                                  |

**适用场景**

**SPA** 适用于用户交互较多、需要频繁操作页面或数据的场景，例如：

- 电商网站
- 单页管理后台（Admin Dashboard）
- 在线聊天工具
- 数据分析平台

如果网站主要是内容展示型（如博客、新闻站点），传统的多页面应用（MPA）可能更合适。



**MPA 适合：**

- 以内容展示为主的网站，如博客、新闻门户、企业官网。
- 不需要复杂前端交互的项目。
- 需要良好 SEO 的项目。

对于需要大量用户交互的应用（如后台管理系统、社交平台），则更适合使用 SPA 架构。





SPA的缺点的解决方案：

1. 静态页面预渲染(Static site Generation)SSG，在构建时生成完整的 html 页面。(就是在打包的时候先将页面放到浏览器中运行一下，将HTML保存起来，放入上线的项目中，用户访问时，先给他提案保存好的html文件，然后再请求js去真实的渲染)，仅适合静态页面网站。变化率不高的网站。
2. SSR+CSR 的方式，首屏采用服务端染的方式，后续交互采用客户端染方式。Nuxtjs





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



## vue为什么使用虚拟DOM

**虚拟DOM的本质：**

**以 JavaScript 对象的形式对真实 DOM 进行抽象表示**。它并不是浏览器中的 DOM 节点，而是描述 DOM 结构的轻量级数据结构。

在数据结构方面：虚拟 DOM 是一棵树状结构，其每个节点是一个 JavaScript 对象，用于描述真实 DOM 中的节点属性、子节点等信息。典型的虚拟 DOM 节点结构如下：

```javascript
const vnode = {
    tag: 'div',               // 节点标签，例如 'div'
    props: { id: 'app' },     // 属性，例如 id="app"
    children: [               // 子节点（可以是文本或其他虚拟节点）
        { tag: 'span', props: {}, children: ['Hello'] },
        { tag: 'button', props: { onClick: handleClick }, children: ['Click Me'] }
    ]
};
```



**vue中为什么引入虚拟DOM树：**

主要是为了解决性能优化和开发体验的问题。引入虚拟 DOM 的主要原因和好处：

**性能优化：最小化 DOM 操作的开销**

真实 DOM 操作耗费性能，因为浏览器需要进行重排、重绘等操作。基于虚拟 DOM 来对 DOM 进行更新：

- **比较差异（Diff 算法）**：虚拟 DOM 是一个轻量级的 JavaScript 对象树，Vue 可以通过对新旧虚拟 DOM 树进行比较（diff），确定需要更新的最小部分。
- **批量更新**：Vue 会将多次对虚拟 DOM 的修改合并成一次对真实 DOM 的批量操作，避免频繁操作真实 DOM。



**跨平台支持**

虚拟 DOM 不仅适用于浏览器 DOM，还可以扩展到其他平台（如服务器端渲染和移动端开发）。通过抽象的虚拟 DOM 层，Vue 可以支持：

- **SSR（服务端渲染）**：虚拟 DOM 使得 Vue 能够在服务端生成 HTML 并发送到客户端。
- **自定义渲染器**：虚拟 DOM 可以渲染到其他平台（如微信小程序、Canvas 等）。







**vue中虚拟DOM是如何得到的：**

在开发阶段，开发者写的是一个个的.vue类型的文件，这个文件会被会被编译成渲染函数（`render`），该函数在浏览器中执行后会返回一个虚拟 DOM 树对象。

```js
const render = () => ({
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'span', children: ['Hello World'] }
  ]
});
```

每次组件状态变化时，`render` 函数都会生成新的虚拟 DOM。

最后在后续的patch过程中将得到的虚拟DOM变为真实DOM并挂在到页面上，同时真实dom节点也会缓存到虚拟DOM的相应属性上，以方便后续更新时能最大化的复用。





## 对Vue组件化的理解

与组件化相对应的就是模块化。

组件化是针对UI的一个封装，模块化是对业务逻辑的封装。无论组件化和模块化，重点就是为了能复用代码和组合。

webcomponent是浏览器原生就支持的一种组件化方案，但是兼容性差。

webcomponent中定义了一个组件化的核心组成：模板、属性、事件、插槽、生命周期。

这些组成都被vue所借鉴了。



在 Vue 中，**组件化**是将用户界面（UI）和相关逻辑划分为可重用的、自包含的单元。这些单元称为“组件”，它们可以独立开发、维护、组合，从而构建复杂的应用。

一个 Vue 组件是一个独立的视图模块，通常包括以下内容：

- **模板（Template）**：定义组件的结构和布局。
- **逻辑（Script）**：定义组件的行为和数据（通常使用 JavaScript）。
- **样式（Style）**：定义组件的样式。

组件本质上是**可重用的 Vue 实例**，可以嵌套和组合其他组件。



在vue中，每个组件都对应一个渲染函数，当它依赖的响应式数据变化时，会重新执行这个函数（在vue2中渲染函数被称为watcher，vue3中是effect）。

过度拆分组件的影响：

**开发复杂性增加**

- 过度拆分组件可能导致组件嵌套层级过深，增加代码的复杂度和阅读难度。开发者需要频繁跳转多个文件，理解某一功能涉及的组件关系，耗时费力。

- 如果组件拆分过细，每次修改一个小功能可能需要改动多个文件。例如，一个简单的需求可能涉及多个子组件的调整，修改时容易遗漏某些部分。

**性能开销**

- 每个组件实例都有自己的生命周期和响应式系统。当组件过多时，会增加 Vue 的管理开销，特别是在频繁更新或复杂视图的情况下，可能对性能产生影响。

  



## 既然vue通过数据劫持能够精准的探测数据变化，为什么还需要虚拟DOM和进行diff检查差异？

1. **数据劫持是感知变化的工具，不负责 DOM 更新**

   - **数据劫持**：Vue 的响应式系统可以感知数据的变化（例如某个属性被修改了），但它不会直接操作 DOM。
   - **虚拟 DOM**：负责根据数据变化，计算出需要更新的 DOM 节点，从而以最小的代价更新视图。

2. **复杂模板场景需要全局视图计算**（灵活性远远不够）

   在实际项目中，模板可能非常复杂，存在多种嵌套、条件渲染和动态内容。如果直接通过数据劫持操作 DOM，可能会遇到以下问题：

   - **无法精确定位动态内容**：动态生成的列表或条件渲染的内容依赖于模板结构，单纯依赖数据劫持难以直接高效更新。
   - **依赖关系复杂**：一个数据变化可能影响多个视图，Vue 需要确定哪些部分需要更新，而不是盲目操作所有相关 DOM。

   虚拟 DOM 的 diff 算法通过对比新旧虚拟 DOM 树，精准定位需要更新的节点，确保更新过程高效且准确。

3. **提高性能**

   虚拟 DOM 的 diff 算法可以将多次变化合并，批量更新真实 DOM。直接使用数据劫持会导致每次变化都立即触发 DOM 更新，而频繁操作 DOM 是性能瓶颈。

   假设有一个包含 100 个列表项的 `v-for`，你连续对数据进行了多次操作：

   ```js
   this.list.push(newItem);
   this.list[0] = anotherItem;
   this.list.pop();
   ```

   - **仅用数据劫持**：每次操作都会导致 DOM 重新计算和更新。
   - **虚拟 DOM**：将所有变化记录到虚拟 DOM 树中，最后一次性更新。

   这种“合并更新”的机制显著提高了性能。

4. **跨平台能力**

   虚拟 DOM 不仅可以操作浏览器 DOM，还可以适配其他平台（如移动端的原生视图）。Vue 通过虚拟 DOM 抽象了对底层渲染环境的依赖，使其具备更强的跨平台能力（如 `Vue.js` 的跨平台框架 **Weex** 和 **Nuxt.js**）。

   单纯依赖数据劫持则与底层的真实 DOM 强绑定，不利于跨平台实现。

5. **支持复杂的功能特性**

   - **插槽（slot）**、**指令（v-if/v-for）** 等功能需要模板的整体解析和管理，而不仅仅是单个数据的监听。
   - **动态绑定和事件管理**：虚拟 DOM 可以更好地处理动态绑定的内容和事件，而数据劫持仅能感知数据变化。

6. **更好的开发体验**

   虚拟 DOM 提供了声明式编程方式，开发者只需关心模板与数据的绑定，Vue 会通过虚拟 DOM diff 自动处理高效更新。如果只依赖数据劫持，开发者可能需要手动处理 DOM 更新逻辑，增加了复杂性和易错性。

   

Vue 结合了 **数据劫持** 和 **虚拟 DOM** 的优点：

1. 数据劫持：高效追踪数据变化。
2. 虚拟 DOM：对视图进行精确的差异计算和最小化 DOM 操作。

两者相辅相成，共同实现了 Vue 的高性能和良好的开发体验。**数据劫持感知“变了什么”，虚拟 DOM负责“怎么改”**，这也是 Vue 高效、灵活的根本原因。



如果给每个属性都去增加 watcher，页面中常常有大量的数据，所以也必然会便随着大量的 watcher 产生，这样就就比较浪费内存。而且粒度太小不好管控，在组件层次设置 watcher 可以有效的减少 watcher 的数量，某个属性变化后，会将整个组件都更新，但是完全这样做每个属性都要进行比较也比较耗费性能，所以使用 diff 算法和响应式原理折中优化渲染该过程。



## 对响应式数据的理解

vue2中的Object.definedProperty

vue3中的proxy

为什么vue3中不再采用definedProperty来实现响应式数据了？definedProperty有什么不足吗？

**响应式数据**指的是那些由 Vue 的响应式系统管理的、可以自动追踪变化并触发视图更新的数据。当响应式数据发生变化时，与之绑定的视图会自动重新渲染，而开发者无需手动操作 DOM。

Vue 使用以下两种方式实现响应式数据：

- Vue 2.x：通过 `Object.defineProperty` 劫持对象属性的 `getter` 和 `setter`，实现对数据的追踪，因为重写了对象的属性，所以性能低，值保存在形成的闭包中。
- Vue 3.x：通过 `Proxy` 替代 `defineProperty`，实现对对象和数组的深层次响应式劫持。



数组和对象类型当值变化时如何劫持到？

对象内部通过defineReactve方法，使用object.defineProperty将属性进行劫持(**只会劫持已经存在的属性**)，对象新增的属性无法劫持到，vue提供了特定的api来实现对象数组新增和删除属性实现响应式。多层对象是通过递归来实现劫持。

数组则是通过重写数组方法来实现。



vue2的响应式数据实现的不足：

- 在 vue2 的时候使用 defineProperty 来进行数据的劫持,需要对属性进行重写添加getter及setter 性能差。

- 当新增属性和删除属性时无法监控变化。需要通过`$set、$delete`实现

- 数组不采用 defineProperty 来进行劫持(浪费性能，对所有索引进行劫持会造成性能浪费)需要对数组单独进行处理。

- 对于 ES6 中新产生的 Map、Set 这些数据结构不支持。

  ```js
  function defineReact(target,key,value){
      observer(value)  //一上来就递归重写
      Object.defineProperty(target,key,{
          get(){
              // 处理依赖收集
              return value
          },
          set(newValue){
              if(newValue !==value){
                  value = newValue
                  // 处理触发更新
                  observer(newValue)  // 赋值对象则继续劫持
              }
          }
      })
  }
  
  function observer(data){
      if(typeof data !=='object' || data === null){
          return data
      }
      for(let key in data){
          defineReact(data,key,data[key])
      }
  }
  ```

- defineProperty 针对数组中的每一项也能增加get和set函数的，但是在实际开发中，很少有直接通过数组索引去操作数组的元素的情况，同时当数组元素很多时，大量的get和set函数也耗费性能，所以vue并没有对数组采用defineProperty 来进行劫持



vue3中数组和对象则都采用 proxy。

proxy的本质是对对象进行代理，而不是重写属性，所以不存在对新增属性或者删除属性的无法拦截到的情况，同时也能对数组进行很好的劫持。

proxy对深层的数据是懒代理的。

```js
function reactive(data){
    return new Proxy(data,{
        get(target,key,receiver){
            // 收集effect
            let res = Reflect.get(target,key,receiver)
            if(typeof res === 'object'){
                return reactive(res)
            }
            return res
        },
        set(target,key,value,receiver){
            // 触发effect
            return Reflect.set(target,key,value,receiver)
        },
        has(){

        },
        // ...
    })
}
```

在vue3的proxy中是支持对set和map数据结构进行代理的，只是传给proxy的第二个拦截器对象的实现不同。一个是handler一个是collectionHandler。



下面有待优化的代码：

```js
for(let i = 0;i<10000;i++){
    this.count+=i
}

// 存在的问题：为此累加都先取值再设置值，这样会重复触发get和set，消耗性能

let sum = this.count
for(let i = 0;i<10000;i++){
    sum+=i
}
this.count = sum
```





## vue2中如何检测数组变化

在 **Vue 2** 中，数组的响应式处理是通过**重写数组方法**实现的。Vue 2 无法直接拦截数组的索引变化，但通过重写了数组的一些变更方法（如 `push`、`pop` 等），可以检测到数组的变化并触发视图更新。

Vue 2 通过重写数组原型方法（`Array.prototype`）中的部分方法来检测数组的变化，包括：

- 能够触发响应的数组方法

  ：

  - 增加：`push`、`unshift`、`splice`
  - 删除：`pop`、`shift`、`splice`
  - 替换：`splice`
  - 排序：`sort`、`reverse`

当调用这些方法时，Vue 会拦截并触发依赖更新。

**注意深层嵌套的数组**

如果数组的元素是对象或数组，则它们本身也是响应式的。例如：

```js
vm.items = [{ name: 'Alice' }];
vm.items[0].name = 'Bob'; // Vue 会检测到并更新视图
```



本质原理：

```js
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = arrayProto[method];
  arrayMethods[method] = function (...args) {
    const result = original.apply(this, args); // 执行原始操作
    console.log('Array changed:', method, args); // 通知更新
    return result;
  };
});

// 使用改写后的数组方法
const arr = [];
Object.setPrototypeOf(arr, arrayMethods);

arr.push(1); // 控制台打印: Array changed: push [1]
```





**为什么vue2中不采用defineProperty的方式来拦截数组？**

`Object.defineProperty` 存在以下局限性，使得它无法直接拦截数组的操作，从而需要采取其他方式（如重写数组方法）来处理数组的响应式。

（1）无法监听数组的索引变化

`Object.defineProperty` 只能拦截已定义的属性，无法监测数组的新增索引操作。例如：

```js
const arr = [1, 2, 3];
Object.defineProperty(arr, '0', {
  get() { console.log('get'); },
  set(value) { console.log('set', value); }
});
arr[0] = 10; // 可以拦截
arr[3] = 20; // 无法拦截，因为索引 3 未被定义
```



（2）无法直接监听数组长度的变化

`Object.defineProperty` 无法拦截对数组 `length` 属性的修改：

```js
arr.length = 1; // 无法被拦截
```



（3）性能问题

- 对于数组来说，使用 `Object.defineProperty` 拦截每个索引的读写操作，性能代价非常高，尤其是当数组非常大时。



（4）复杂性问题

- 数组的操作非常多样化，涉及新增索引、删除元素、修改 `length`、排序等。
- 即使通过 `Object.defineProperty` 劫持所有可能的索引，也难以全面覆盖所有数组操作。



**无法自动检测的场景**

**（1）直接修改数组的某个索引**

如果通过直接设置数组的某个索引来修改数组内容，Vue 无法检测到这类变化：

```js
const vm = new Vue({
  data: {
    items: [1, 2, 3]
  }
});

vm.items[0] = 100; // 无法触发视图更新
```

**解决方法**： 可以使用 `Vue.set` 或 `this.$set` 方法手动触发响应式：

```js
Vue.set(vm.items, 0, 100); // 触发响应式更新
```

**（2）修改数组的长度**

直接修改数组的长度（如 `items.length = 2`），Vue 也无法检测到：

```js
vm.items.length = 2; // 无法触发视图更新
```



**Vue 2 无法检测的变更的应对策略**

**直接赋值索引或修改数组长度**

使用 `Vue.set` 或替代方式（如 `splice`）：

```js
// Vue.set 替代索引赋值
Vue.set(vm.items, 2, 'newValue');

// splice 替代直接赋值
vm.items.splice(2, 1, 'newValue');
```

**重设整个数组**

由于数组是引用类型，直接替换数组也能触发响应式更新：

```js
vm.items = [...vm.items, 'newItem']; // 替换为新数组
```





## vue中如何进行依赖收集

可以说响应式系统就是为了依赖收集而设计的。

**vue2中进行依赖收集**

依赖收集的目的是追踪哪些“视图”或“计算属性”等功能依赖于某个响应式数据。当该数据发生变化时，能通知所有依赖它的地方更新。

2. **核心概念**

（1）`Dep`（依赖管理器）

- 每个响应式数据都关联一个 `Dep` 实例（这个实例一般存放在闭包中），用于管理依赖于该数据的“订阅者”（`Watcher`）。
- 它的作用：
  - 收集依赖。
  - 在数据变化时，通知所有依赖重新计算或更新视图。

（2）`Watcher`（观察者）

- `Watcher` 是依赖的具体实现，代表具体的更新逻辑。
- Vue 中有不同类型的 Watcher：
  - **渲染 `Watcher`**：用于触发视图更新。
  - **计算属性 `Watcher`**：用于缓存和更新计算属性。
  - **侦听器 `Watcher`**：用于 `watch` 选项的回调。

（3）依赖收集的关系

每个响应式数据通过 `Dep` 收集依赖它的 `Watcher`，而每个 `Watcher` 会订阅相关的 `Dep`。



3. **依赖收集的具体过程**

依赖收集发生在数据的 **getter** 阶段。

（1）初始化阶段

- Vue 使用 `Object.defineProperty` 劫持数据的 `getter` 和 `setter`。
- 在 `getter` 中，进行依赖收集；在 `setter` 中，触发依赖更新。

（2）`getter` 中的依赖收集

当某个响应式数据被访问时：

1. Vue 会判断当前是否有活跃的 `Watcher`（即响应式的数据是否正在某个组件模板中使用等）。
2. 如果有活跃的 `Watcher`，将其记录到该数据的 `Dep` 中。
3. 同时，`Watcher` 也会订阅这个 `Dep`。

代码示例：

```js
// 响应式数据的 getter 劫持
Object.defineProperty(data, 'key', {
  get() {
    if (Dep.target) {
      dep.depend(); // 收集依赖
    }
    return value;
  },
  set(newValue) {
    value = newValue;
    dep.notify(); // 通知依赖更新
  }
});
```

（3）`Dep` 和 `Watcher` 的交互

- `Dep` 的方法：
  - `depend()`：将当前活跃的 `Watcher` 添加到自身的订阅列表。
  - `notify()`：通知所有订阅的 `Watcher`，执行更新逻辑。
- `Watcher` 的方法：
  - `addDep(dep)`：将当前 `Dep` 添加到自身的依赖列表。
  - `update()`：触发更新逻辑（例如重新渲染视图）。

依赖收集的代码流程：

```js
class Dep {
  constructor() {
    this.subs = []; // 订阅者列表
  }

  depend() {
    if (Dep.target) {
      this.addSub(Dep.target);
    }
  }

  addSub(sub) {
    this.subs.push(sub); // 添加订阅者
  }

  notify() {
    this.subs.forEach(sub => sub.update()); // 通知订阅者更新
  }
}

class Watcher {
  constructor(updateFn) {
    this.updateFn = updateFn;
    Dep.target = this; // 当前活跃的 Watcher
  }

  update() {
    this.updateFn(); // 执行更新逻辑
  }
}

// 示例：创建响应式数据和依赖
const dep = new Dep();
const watcher = new Watcher(() => console.log('视图更新'));

dep.depend(); // 手动依赖收集
dep.notify(); // 通知更新
```

------

4. **依赖收集的实际执行**

依赖收集在 Vue 组件的渲染过程中被自动触发。

当组件渲染时：

1. 创建组件对应的渲染 `Watcher`，并将其设置为当前活跃的 `Watcher`（`Dep.target = Watcher`）。

2. 在模板中访问响应式数据时，触发其 `getter`，完成依赖收集。

3. 渲染结束后，清除活跃的 `Watcher`。

   

------

5. **依赖收集的特点和注意点**

（1）与嵌套依赖结合

响应式数据可能互相依赖。例如，计算属性依赖于其他数据，会建立多层依赖链。

（2）依赖收集的优化

Vue 通过 `Watcher` 的队列和去重机制，避免同一依赖被重复更新。

（3）清除多余依赖

在组件更新过程中，Vue 会重新收集依赖，移除不再需要的依赖，保证依赖的准确性。

![image-20241211193047071](D:\learn-notes\vue\images\image-20241211193047071.png)





**每个响应式数据都关联一个 `Dep` 实例，那这个响应式数据是在哪里存放的dep实例吗？**

在 Vue 2 中，每个响应式数据都关联一个 `Dep` 实例。这个 `Dep` 实例并不是直接存放在数据对象本身，而是通过 **`Object.defineProperty`** 劫持数据的 getter/setter 方法，间接地管理数据的依赖关系。

1. **`Dep` 是如何关联到响应式数据的？**

Vue 2 通过 `Object.defineProperty` 将数据对象的每个属性变成 getter 和 setter，这些 getter/setter 会触发对 `Dep` 的操作。具体而言，`Dep` 作为每个响应式数据的 **依赖管理器**，它用于收集和通知与该数据相关的依赖（即 `Watcher`）。

`Dep` 实例通常是通过**闭包**的方式与数据项进行绑定的，而不是直接存放在数据对象本身。

2. **`Dep` 存放位置**

（1）`Dep` 存放在一个单独的地方，而不是数据对象上

`Dep` 不是直接存放在数据对象上，而是**通过闭包关联到每个响应式数据的 getter 中**。每当访问数据属性时，`getter` 会触发依赖收集，将当前的 `Watcher` 订阅到 `Dep` 中。

（2）`Dep` 和数据对象的关系

- Vue 会为每个响应式属性（即 `data` 对象的每个属性）创建一个 `Dep` 实例。这个 `Dep` 实例并不是直接存储在数据对象中，而是通过 `Object.defineProperty` 劫持的 getter/setter 方法中的闭包机制与属性相关联。

（3）`Dep` 是在每个响应式数据的 `getter` 中创建和关联的

在访问响应式数据的过程中，`getter` 会触发依赖收集，`Dep.target` 会指向当前活跃的 `Watcher`（如组件的渲染函数、计算属性等），并将其添加到 `Dep` 中。这里的 `Dep` 管理了与当前数据属性相关的所有依赖。



如何存储 `Dep` 实例

```js
// 创建 Dep 实例
class Dep {
  constructor() {
    this.subs = []; // 存放订阅该数据的 Watcher
  }

  depend() {
    if (Dep.target) {
      this.addSub(Dep.target);
    }
  }

  addSub(sub) {
    this.subs.push(sub); // 将 Watcher 添加到订阅列表
  }

  notify() {
    this.subs.forEach(sub => sub.update()); // 通知所有订阅者更新
  }
}

// 劫持数据的 getter 和 setter
class Observer {
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false
    });

    if (Array.isArray(value)) {
      // 处理数组的方法，略
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
  }
}

function defineReactive(obj, key, val) {
  const dep = new Dep(); // 每个属性对应一个 Dep 实例
  let childOb = observe(val); // 嵌套对象也变成响应式

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend(); // 收集依赖
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      childOb = observe(newVal); // 重新观察新的值（如果是对象）
      dep.notify(); // 通知所有 Watcher 更新
    }
  });
}

// 观察数据
function observe(value) {
  if (!value || typeof value !== 'object') return;
  return new Observer(value);
}
```

3. **关键点总结**

- **`Dep` 存放在 `getter` 中**，它通过 `defineProperty` 劫持的数据属性的 getter 进行关联。
- 每个响应式数据的属性都会有一个独立的 `Dep` 实例，而 `Dep.target` 代表当前活跃的 `Watcher`，当数据变化时会通知所有的 `Watcher` 更新。
- `Dep` 本身并不存储在数据对象的可枚举属性上，而是通过内部机制（例如 `Object.defineProperty` 劫持的 getter）来和数据的变化关联。





**Vue3中进行依赖收集**

在 Vue 3 中，依赖收集的方式相比 Vue 2 做了重要的改进，采用了 `Proxy` 来取代 `Object.defineProperty`，从而简化了依赖收集的机制，并且解决了 Vue 2 中的一些性能问题和局限性。Vue 3 中的响应式系统通过 `Proxy` 进行数据劫持，依赖收集的过程也得到了优化。

Vue 3 使用 `Proxy` 不仅能够劫持对象的属性，还能监听整个对象的访问（包括属性的新增、删除和数组的操作），同时提供更高效的性能。



**Vue 3 中依赖收集的核心概念**



（1）`reactive` 和 `ref`

- `reactive` 用于创建对象类型的响应式数据，`ref` 用于创建基本数据类型（如字符串、数字等）的响应式数据。
- `reactive` 和 `ref` 都是依赖收集的入口。

（2）`effect`（类似于 Vue 2 的 `Watcher`）

- `effect` 是 Vue 3 响应式系统中的**副作用**函数，它会被依赖收集并在数据变化时触发更新。`effect` 代表了对响应式数据的依赖，比如组件的渲染函数或计算属性。
- 在 Vue 3 中，`effect` 会自动追踪它所使用的数据，并在数据变化时重新执行。

（3）`Tracker` 和 `Dep`

- 在 Vue 3 中，依赖收集是通过 `Proxy` 的 `getter` 和 `setter` 完成的，依赖项存储在一个类似 `Dep` 的容器中，称为 `Tracker`。
- 这些 `Tracker` 对象会管理数据项与依赖它们的 `effect`。



 **Vue 3 中依赖收集的流程**

（1）`Proxy` 拦截器的使用

Vue 3 中，`Proxy` 用来劫持整个对象的访问。当你访问对象的属性时，`Proxy` 会触发 `get` 函数，这时会触发依赖收集，将当前的 `effect` 订阅到该数据属性。

（2）`effect` 的依赖收集

`effect` 函数是通过 `Proxy` 对响应式数据进行依赖收集的核心。每当你访问一个响应式对象的属性时，Vue 会在 `get` 方法中收集当前执行的 `effect`（也就是当前正在访问数据的副作用函数），并将其保存为该数据的依赖。

（3）依赖的触发

当数据发生变化时，`set` 方法会被触发，`Proxy` 会在 `set` 方法中通知所有依赖该数据的 `effect` 更新。这样，`effect` 就会重新执行，更新视图或计算属性。

下面是一个简单的 Vue 3 响应式依赖收集的实现示例：

```js
// Vue 3 响应式系统的实现

// 用来存储所有的副作用函数（effect）
let activeEffect = null;
const effectStack = [];

// 创建一个副作用函数 (类似 Vue 2 中的 Watcher)
function effect(fn) {
  const effectFn = () => {
    try {
      activeEffect = effectFn;
      fn(); // 执行副作用函数
    } finally {
      activeEffect = null;
    }
  }
  effectFn();
}

// 创建响应式对象（通过 Proxy）
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      // 在访问属性时触发依赖收集
      if (activeEffect) {
        track(target, key); // 收集依赖
      }
      return target[key]; // 返回属性值
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value);
      trigger(target, key); // 触发依赖更新
      return result;
    }
  });
}

// 收集依赖
function track(target, key) {
  if (!target.__dep__) {
    target.__dep__ = {}; // 初始化 Dep 容器
  }
  if (!target.__dep__[key]) {
    target.__dep__[key] = new Set(); // 为每个属性创建一个 Set 来存储依赖
  }
  target.__dep__[key].add(activeEffect); // 添加当前的 effect
}

// 触发依赖更新
function trigger(target, key) {
  const deps = target.__dep__ && target.__dep__[key];
  if (deps) {
    deps.forEach(effectFn => effectFn()); // 执行所有相关的 effect 函数
  }
}

// 示例
const state = reactive({
  count: 0
});

effect(() => {
  console.log(`Count: ${state.count}`);
});

state.count++; // 修改 count，会触发依赖更新

```





## Vue.set方法的实现

`Vue.set` 和vm.$set是同一个方法，在 Vue.js 中用于向响应式对象添加**新属性或更新现有属性**的方法。它确保新添加的属性是响应式的，并且能够触发视图的更新。

如果你直接给一个对象添加新属性，Vue 无法监听到这个新增属性的变化，因此视图不会自动更新。而 `Vue.set` 方法通过以下两种方式解决了这个问题：

1. **确保属性是响应式的**：`Vue.set` 会将新添加的属性转换为响应式，使得 Vue 可以追踪它的变化。
2. **触发视图更新**：如果在对象中新增了属性，`Vue.set` 会确保视图根据新数据进行更新。

```js
Vue.set(obj, key, value)


let vm = new Vue({
  data: {
    user: {
      name: 'John'
    }
  }
});

// 正常的添加属性（不推荐）
vm.user.age = 30; // 这样添加的属性不会触发视图更新

// 使用 Vue.set 添加属性（推荐）
Vue.set(vm.user, 'age', 30); // 这样添加的属性会变成响应式并触发视图更新
```



**动态添加属性**：当你需要向一个已经存在的对象中动态添加新属性时，使用 `Vue.set` 可以确保该属性是响应式的。

**数组的修改**：对于数组中的元素修改，也可以使用 `Vue.set` 来确保对数组元素的修改能够触发视图更新。

在 Vue.js 中修改数组时，直接修改数组的某个元素不会触发视图更新，但使用 `Vue.set` 可以确保修改的响应式更新：

```javascript
let vm = new Vue({
  data: {
    numbers: [1, 2, 3]
  }
});

Vue.set(vm.numbers, 1, 20);  // 修改索引为 1 的元素，视图会更新

```



vue2中set的源码：

```ts
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set<T>(array: T[], key: number, value: T): T
export function set<T>(object: object, key: string | number, value: T): T
export function set(
  target: any[] | Record<string, any>,
  key: any,
  val: any
): any {
    //基本数据类型报错
  if (__DEV__ && (isUndef(target) || isPrimitive(target))) {
    warn(
      `Cannot set reactive property on undefined, null, or primitive value: ${target}`
    )
  }
    
  if (isReadonly(target)) {
    __DEV__ && warn(`Set operation on key "${key}" failed: target is readonly.`)
    return
  }
    
  const ob = (target as any).__ob__  // 有__ob__属性表示是一个响应式对象
  
  // 针对数组，本质就是调用数组的splice方法
  if (isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    // when mocking for SSR, array methods are not hijacked
    if (ob && !ob.shallow && ob.mock) {
      observe(val, false, true)
    }
    return val
  }
    // 已有的属性直接改
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
    
  if ((target as any)._isVue || (ob && ob.vmCount)) {
    __DEV__ &&
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
      )
    return val
  }
   // 不是响应式的对象直接给他设置值就行
  if (!ob) {
    target[key] = val
    return val
  }
    
  // 对于响应式对象增加响应式的核心代码  
  defineReactive(ob.value, key, val, undefined, ob.shallow, ob.mock)
  if (__DEV__) {
    ob.dep.notify({
      type: TriggerOpTypes.ADD,
      target: target,
      key,
      newValue: val,
      oldValue: undefined
    })
  } else {
    ob.dep.notify()
  }
  return val
}
```



也可以通过对象合并的方式来触发新增属性的更新  或者 $forceUpdate。

```js
this.info = {...this.info,{key:vlue}}
```



vue3中不再需要set方法。





## v-show 与 v-if 的理解和区别

 v-if：创建与删除元素（如用于购物车）

`v-if` 控制元素的 **条件渲染**，在条件为 `true` 时，Vue 会在 DOM 中 **创建** 元素；当条件为 `false` 时，Vue 会 **销毁** 该元素。换句话说，`v-if` 会根据条件决定是否在 DOM 中渲染该元素，只有条件满足时，元素才会存在。

 v-if 会让定义有该自定义属性的 dom 元素在切换的过程中 dom 元素及内部的事件监听器和子组件被销毁和重建。对于初次渲染时 v-if 的条件为假，则什么都不做一直到条件第一次为真的时候，才开始渲染条件块。

**实现原理**：当条件为 `true` 时，Vue 会创建该元素及其子元素并插入 DOM；当条件为 `false` 时，Vue 会销毁该元素及其子元素。

**渲染方式**：`v-if` 会根据条件动态地添加或移除元素，涉及 DOM 的创建与销毁。

**性能**：适用于条件较少变化的场景，因为每次条件变化时，都会进行 DOM 元素的重新渲染和销毁，性能开销较大。

**特点**：

- **优点**：不会占用任何空间，元素仅在需要时才会存在。
- **缺点**：每次条件变化时都要重新渲染和销毁元素，性能开销较大，尤其是当涉及复杂元素或组件时。

**适用场景**：条件变化不频繁，或需要彻底从 DOM 中移除元素时使用。



```vue
<div v-if="flag">{{ msg }}</div>
```

vue2模板编译后v-if的结果：

```js
function render() {
  with(this) {
    return (flag) ? _c('div', [_v(_s(msg))]) : _e()
  }
} 	
```



vue3模板编译后v-if的结果：

```js
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.flag)
    ? (_openBlock(), _createElementBlock("div", { key: 0 }, _toDisplayString(_ctx.msg), 1 /* TEXT */))
    : _createCommentVNode("v-if", true)
}

// Check the console for the AST
```

模板编译为render函数，v-if编译后是一个三元表达式。





`v-show`

`v-show` 控制元素的 **CSS 显示**，通过改变元素的 `display` 样式来控制其是否可见。`v-show` 只会在元素渲染时被添加到 DOM 中，而不会完全移除。即使元素不可见，它依然占据DOM树中的位置。

- **实现原理**：当条件为 `true` 时，元素的 `display` 样式被设置为**原来的样式**（通常是 `block` 或 `inline`）；当条件为 `false` 时，元素的 `display` 样式被设置为 `none`，从而使其隐藏。
- **性能**：适用于频繁切换显示与隐藏的场景，因为它不会重新渲染 DOM 元素，只是简单地切换样式。

切换频繁时性能较好，因为不涉及 DOM 元素的销毁与重建。

**适用场景**：需要频繁切换显示与隐藏时，或隐藏元素时仍然希望它占据空间的场景。



如果给一个原本已经隐藏（即 `display: none`）的元素设置了 `v-show`，那么 **Vue 会接管该元素的显示与隐藏逻辑**，并根据 `v-show` 的绑定条件动态地控制元素的显示与隐藏。

**初始化时 `display: none` 的影响**：

- 如果一个元素已经通过 `style="display: none"` 隐藏，这并不会影响 `v-show` 的行为。`v-show` 会根据条件控制元素的显示与隐藏，它会先让元素渲染出来，然后通过改变其 `display` 样式来控制显示与隐藏。

**`v-show` 和 `display` 样式的关系**：

- `v-show` 在初始化时会将元素的 `display` 样式设置为 `block` 或其它合适的值（根据元素的类型）。如果你在元素上手动设置了 `display: none`，Vue 依然会通过 `v-show` 来控制该元素的显示（`display: block` 或者其他），并根据绑定的条件更新 `display` 样式。

元素初始状态为 `display: none`

```html
<div id="app">
  <div v-show="isVisible" style="display: none;">Hello, World!</div>
  <button @click="toggleVisibility">Toggle Visibility</button>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      isVisible: false
    },
    methods: {
      toggleVisibility() {
        this.isVisible = !this.isVisible;
      }
    }
  });
</script>
```

在这个例子中，`v-show` 控制的是元素的显示与隐藏，而 `style="display: none"` 只是元素的初始状态。

当 `isVisible` 为 `false` 时，元素会被隐藏，`display: none` 会起作用；当 `isVisible` 为 `true` 时，Vue 会将 `display` 样式设置为 `block` 或其他合适的值，从而显示该元素。

元素已被 `display: none` 隐藏，`v-show` 仍能控制显示/隐藏。





**选择何时使用 `v-show` 或 `v-if`**

- **`v-show`**：
  - 适用于需要频繁切换元素显示/隐藏的场景。
  - 比如在用户界面上切换不同的面板、标签页，或动画效果中，元素的显隐变化频繁，使用 `v-show` 会更高效。
- **`v-if`**：
  - 适用于元素不需要频繁显示和隐藏，或者仅在某些特定条件下才需要渲染的情况。
  - 比如一些特定功能的按钮、条件展示的表单等，只有在条件满足时才需要渲染该元素。

- v-if 可以阻断内部代码是否执行，如果条件不成立不会执行内部逻辑
- 如果页面逻辑在第一次加载的时候已经被确认后续不会频繁更改则采用 v-if



```vue
<div v-show="flag">{{ msg }}</div>
```

vue2模板编译后v-show的结果：

```js
function render() {
  with(this) {
    return _c('div', {
      // 将v-show变为了一个指令
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (flag),
        expression: "flag"
      }]
    }, [_v(_s(msg))])
  }
}
```



vue3模板编译后v-show的结果：

```js
import { vShow as _vShow, withDirectives as _withDirectives, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _withDirectives((_openBlock(), _createElementBlock("div", null, "Hello World", 512 /* NEED_PATCH */)), [
    [_vShow, _ctx.flag]
  ])
}

// Check the console for the AST
```



源码中的v-show指令：

```ts
import VNode from 'core/vdom/vnode'
import type { VNodeDirective, VNodeWithData } from 'types/vnode'
import { enter, leave } from 'web/runtime/modules/transition'

// recursively search for possible transition defined inside the component root
function locateNode(vnode: VNode | VNodeWithData): VNodeWithData {
  // @ts-expect-error
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode!)
    : vnode
}

export default {
  bind(el: any, { value }: VNodeDirective, vnode: VNodeWithData) {
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    // 保存元素初始的display的值，为none的话就是空字符串，也就会默认使用浏览器默认的值
    const originalDisplay = (el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display)  // 说明如果一个元素的display初始值为none的话，vue会将该元素的display初始设置为空字符，这样，浏览器会采用该元素默认的display想过，而并不是隐藏该元素。
    if (value && transition) {
      vnode.data.show = true
      enter(vnode, () => {
        el.style.display = originalDisplay
      })
    } else {
      el.style.display = value ? originalDisplay : 'none'
    }
  },

  update(el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    /* istanbul ignore if */
    if (!value === !oldValue) return
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    if (transition) {
      vnode.data.show = true
      if (value) {
        enter(vnode, () => {
          el.style.display = el.__vOriginalDisplay
        })
      } else {
        leave(vnode, () => {
          el.style.display = 'none'
        })
      }
    } else {
        //  更新数据后display的切换
      el.style.display = value ? el.__vOriginalDisplay : 'none'
    }
  },

  unbind(
    el: any,
    binding: VNodeDirective,
    vnode: VNodeWithData,
    oldVnode: VNodeWithData,
    isDestroy: boolean
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay
    }
  }
}
```



如果一个元素上即有v-if又有v-show：

```vue
<div v-show="flag" v-if='exit'>{{ msg }}</div>
```

编译结果：

```js
function render() {
  with(this) {
    return (exit) ? _c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (flag),
        expression: "flag"
      }]
    }, [_v(_s(msg))]) : _e()
  }
}
```

可以看出优先级差异。





扩展：

> 前端实现一个元素的显示或者隐藏有几种方案？  每种方案有什么特点？
>
> 1. 使用 CSS `display` 属性
>
>    **优点**：简单，直接控制元素的显示与隐藏。
>
>    **缺点**：会导致元素完全从页面中移除（隐藏时没有占用空间）。如果使用 `display: none` 隐藏元素，浏览器会停止渲染该元素（包括其子元素）。因此，切换频繁时可能会有性能开销。
>
>    **适用场景**：简单的显隐控制，特别是在不需要占位的场景中使用。
>
> 2. 使用 CSS `visibility` 属性
>
>    通过改变元素的 `visibility` 属性来控制元素的显示与隐藏。`visibility: hidden` 隐藏元素，但元素依然占用页面空间；`visibility: visible` 显示元素。
>
>    **特点**：
>
>    - **优点**：元素仍然占据空间，适用于需要保留布局的场景。
>    - **缺点**：虽然元素被隐藏，但它仍占用页面的空间，不会从页面布局中消失。
>    - **适用场景**：需要保留空间但不显示元素（例如弹出框背景或占位符）。
>
> 3. 使用 `opacity` 属性
>
>    通过改变元素的 `opacity` 属性（透明度）来控制元素的可见性。`opacity: 0` 完全透明，`opacity: 1` 完全不透明。
>
>    **特点**：
>
>    - **优点**：可以通过渐变动画平滑过渡，使元素从完全透明到可见。
>    - **缺点**：元素仍然占用空间，并且在透明时仍会响应用户的交互（例如点击事件）。
>    - **适用场景**：需要平滑过渡效果或动态变化的场景（例如动画效果）。
>
> 4. **使用 `position` 和 `z-index` 组合**
>
>    - 可以通过 `position` 属性将元素从页面上移除到视野之外（例如 `position: absolute; left: -9999px;` 或使用 `z-index` 将元素置于底层），从而实现显示与隐藏。
>
>    **特点**：
>
>    - **优点**：元素在布局中不占用空间，但仍在 DOM 中。
>    - **缺点**：相比 `display: none` 隐藏元素，这种方法可能会导致元素仍然占用其他非可视区域，并且会影响其他布局和用户体验。
>    - **适用场景**：需要将元素移出视野或页面之外，且不完全从 DOM 中移除的情况。
>
> 5. 使用 JavaScript 动态修改 DOM（如 `innerHTML` 或 `removeChild`）
>
>    使用 JavaScript 操作 DOM，通过 `innerHTML` 或 `removeChild` 删除或添加元素到 DOM 中，从而实现显示或隐藏效果。
>
>    **特点**：
>
>    - **优点**：彻底从 DOM 中移除元素，确保不会占用空间。
>    - **缺点**：需要重新添加 DOM 元素时，可能会导致性能问题，特别是元素的复杂性较高时。
>    - **适用场景**：动态添加和删除元素，适用于需要完全移除元素的场景。





## computed和watch的区别

computed和watch在底层都是基于同一个方法实现的，vue2中的watcher和vue3中的effect。

Vue 2 中主要有以下几种类型的 `watcher`：

1. **渲染 Watcher (Render Watcher)**

- **作用**：负责组件的渲染。每个组件在实例化时，都会创建一个与之关联的渲染 `watcher`。当依赖的数据变化时，渲染 `watcher` 会触发组件重新渲染。
- 特点：
  - 这是 Vue 内部的核心 `watcher`，由框架自动创建。
  - 主要用于跟踪模板或 `render` 函数中所依赖的数据。

------

2. **计算属性 Watcher (Computed Watcher)**

- **作用**：与计算属性相关联，用于实现缓存的计算属性。
- 特点：
  - 计算属性本质上是一个 `watcher`。
  - 只有当依赖的数据发生变化时，计算属性的值才会重新计算。
  - 自动收集依赖并更新，只在必要时重新计算。

------

3. **侦听属性 Watcher (User Watcher)**

- **作用**：通过显式地使用 `watch` 选项或 `$watch` 方法创建的 `watcher`，用于监听某些数据的变化并执行自定义的回调。

- 特点：

  - 适合处理一些异步任务或复杂的逻辑（例如监听深层次的数据变化）。
  - 提供 `deep` 和 `immediate` 配置。

  ```json
  {
      watch: {
          someData(newVal, oldVal) {
              console.log('数据变化:', newVal, oldVal);
          },
          someObject: {
              handler(newVal) {
                  console.log('对象变化:', newVal);
              },
              deep: true,
              immediate: true
          }
      }
  }
  ```





`effect` 机制类似于 Vue 2 中的 `watcher`，但更灵活且更细粒度。Vue 3 中主要有以下几种 `effect`：

1. **副作用 (Reactive Effect)**

- **作用**：这是 Vue 3 响应式系统的基础。`effect` 是对响应式数据的依赖追踪，并在依赖发生变化时重新执行关联的回调。

- **实现**：

  - 通过 `effect` 函数显式创建。
  - 用于内部组件更新和用户自定义逻辑。

  **示例：**

  ```js
  import { reactive, effect } from 'vue';
  
  const state = reactive({ count: 0 });
  
  effect(() => {
    console.log(`Count is: ${state.count}`);
  });
  
  state.count++; // 会触发 effect 回调，输出 "Count is: 1"
  ```

------

2. **计算属性 Effect (Computed Effect)**

- **作用**：与 `computed` 相关联，用于实现基于依赖的数据派生。

- **特点**：

  - 计算属性的 `effect` 是只读的，只有依赖发生变化时才会重新计算。
  - 有内置缓存机制，当依赖未变时，访问计算属性不会触发回调。

  **示例：**

  ```js
  import { reactive, computed } from 'vue';
  
  const state = reactive({ count: 0 });
  const double = computed(() => state.count * 2);
  
  console.log(double.value); // 0
  state.count++;
  console.log(double.value); // 2
  ```

------

3. **监听器 Effect (Watcher Effect)**

- **作用**：通过 `watch` 或 `watchEffect` 创建，监听数据变化并执行指定逻辑。

- **分类**：

  - **`watchEffect`**：立即运行副作用并自动收集依赖。
  - **`watch`**：用于精确地监听特定数据，并提供更多配置选项（如深度监听、初始化触发等）。

  **示例：`watchEffect`**

  ```js
  import { reactive, watchEffect } from 'vue';
  
  const state = reactive({ count: 0 });
  
  watchEffect(() => {
    console.log(`Count changed: ${state.count}`);
  });
  
  state.count++; // 输出 "Count changed: 1"
  ```

  **示例：`watch`**

  ```js
  import { reactive, watch } from 'vue';
  
  const state = reactive({ count: 0 });
  
  watch(
    () => state.count,
    (newVal, oldVal) => {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
    }
  );
  
  state.count++; // 输出 "Count changed from 0 to 1"
  ```

------

4. **渲染 Effect (Render Effect)**

- **作用**：这是 Vue 内部用于组件渲染的 `effect`，由框架自动创建。
- 特点：
  - 当模板或 `render` 函数中依赖的响应式数据发生变化时，触发渲染更新。
  - 开发者通常不直接使用。



**区别**

| **特性**     | **计算属性 (computed)**                              | **侦听器 (watch)**                                   |
| ------------ | ---------------------------------------------------- | ---------------------------------------------------- |
| **核心用途** | 用于派生数据，基于依赖自动计算并缓存结果。           | 用于执行副作用或监控数据变化，处理异步或复杂逻辑。   |
| **是否缓存** | 是：当依赖未变时，多次访问不会重新计算。             | 否：每次数据变化时都会触发回调。                     |
| **默认行为** | 只读，适用于纯粹的计算逻辑。                         | 需要显式提供回调，用于监听特定数据变化。             |
| **依赖收集** | 自动依赖收集，仅跟踪计算逻辑中用到的响应式数据。     | 手动指定监听的目标数据，精确控制监视范围。           |
| **异步处理** | **不支持异步逻辑。**                                 | **支持异步逻辑，如 API 调用或延时处理。**            |
| **使用场景** | 用于模板或逻辑中需要基于现有数据派生出新数据的场景。 | 用于处理异步任务、深度监听复杂数据结构或执行副作用。 |



如何理解计算属性不支持异步逻辑？

计算属性 (`computed`) 的设计初衷是用于同步计算基于其他响应式数据派生的数据，并且具有**缓存**的特点。其值在依赖未变化时不会重新计算，这种行为与异步逻辑的非确定性不兼容。异步逻辑的结果通常需要等待，而计算属性期望立即返回一个值，因此它无法很好地支持异步任务。

错误使用计算属性进行异步操作：

```js
import { reactive, computed } from 'vue';

const state = reactive({ userId: 1 });

const userName = computed(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${state.userId}`);
  const data = await response.json();
  return data.name;
});

// 错误：访问 userName 时，得到的是一个 Promise，而不是异步结果
console.log(userName.value); // 输出：Promise { <pending> }

```

**原因**：

- 计算属性无法等待 `async` 函数的执行完成。
- `computed` 会直接返回 `Promise`，而不是异步操作完成后的结果。
- 这不符合计算属性的语义：即一个同步、缓存的派生数据。





**正确处理异步逻辑**

如果需要处理异步逻辑，可以通过以下两种方式：

方法 1：使用 `watch`

```js
import { reactive, watch } from 'vue';

const state = reactive({ userId: 1, userName: '' });

watch(
  () => state.userId,
  async (newId) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${newId}`);
    const data = await response.json();
    state.userName = data.name;
  },
  { immediate: true } // 初始化时立即执行
);

console.log(state.userName); // 用户名将在异步任务完成后更新
```

方法 2：使用普通方法与 `async`

```js
import { reactive } from 'vue';

const state = reactive({ userId: 1, userName: '' });

async function fetchUserName() {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${state.userId}`);
  const data = await response.json();
  state.userName = data.name;
}

// 初次加载时调用
fetchUserName();

// 手动改变 userId 后调用
state.userId = 2;
fetchUserName();
```

**特点**：

- 使用普通方法 `fetchUserName` 执行异步逻辑，确保流程可控。
- 手动调用时可以精确控制异步任务的触发时机。







计算属性在vue2和vue3中的实现区别：

vue2中，每一个计算属性也有一个对应的watcher，这个watcher有一个特有的属性lazy：true，它标识这个watcher是否立即执行一次，普通watcher是会立即执行一次的。

内部会将一个个的计算属性通过defineProperty方法定义为实例上的属性。

当用户取值的时候，会触发计算属性的watcher对应的getter方法，拿到计算属性对应的watcher，看dirty是否为true，如果为true则执行计算属性的对应的watcher的求职运算。

计算属性对应的watcher中依赖的其他响应式属性会收集最外层的渲染watcher，和计算属性的watcher，当响应式数据改变时，会触发计算属性的watcher执行，也会触发渲染watcher执行。





vue3中响应式数据收集计算属性的effect，而计算属性会收集外层的渲染effect，当响应式数据改变时，会触发计算属性中effect的scheduler执行，它会修改计算属性的dirty属性为true，然后触发渲染effect的去执行。

```js
this.effect = new ReactiveEffect(getter,()=>{
    if(!this._dirty){
        this.dirty = true
        triggerRefvalue(this)
    }
})
```







## ref和reactive的区别

对基本数据类型进行响应式的拦截。本质是创建并返回一个函数value属性访问器的对象，通过属性访问器去感知对基本数据类型值的获取和设置操作，从而实现依赖的收集和触发工作。

任意类型的值都可以传给ref，包括已经被reactive代理过的对象。 如果传的是一个普通对象，底层会对对象调用reactive来代理，并将代理对象保存到ref实例的_value属性上，ref.value的时候就去拿去这个\_value上的值。

```js
const state = {name:'abc'}
let stateRef = ref(state)
console.log(stateRef.value)
```



```js
const state = reactive({{name:'abc',age:ref(10)}})  
console.log(state.age) //  10  不用再写age.value   reactive内部检测到取值是ref，则会帮你.value
```



ref源码：

```ts
// ref   shallowRef
export function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
class RefImpl {
  public __v_isRef = true; // 增加ref标识
  public _value; // 用来保存ref的值的
  public dep; // 用于收集对应的effect
    
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
    
  get value() {
    trackRefValue(this);
    return this._value;
  }
    
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue; // 更新值
      this._value = newValue;
      triggerRefValue(this);
    }
  }
    
}

export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      (ref.dep = ref.dep || createDep(() => (ref.dep = undefined), "undefined"))
    );
  }
}

export function triggerRefValue(ref) {
  let dep = ref.dep;
  if (dep) {
    triggerEffects(dep); // 触发依赖更新
  }
}
```



reactive源码：

本质是对对象的代理模式的使用，创建代理对象，实现响应式拦截。

```js
function createReactiveObject(target) {
  // 统一做判断，响应式对象必须是对象才可以
  if (!isObject(target)) {
    return target;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  // 取缓存，如果有直接返回
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  // 根据对象缓存 代理后的结果
  reactiveMap.set(target, proxy);
  return proxy;
}

export function reactive(target) {
  return createReactiveObject(target);
}
```

reactive后的对象结构了会丧失响应式。





## watch和watchEffect

watchEffect其实就是一个ReactiveEffect的翻版实现。

在 Vue 3 中，`watch` 和 `watchEffect` 工具函数用于响应式系统中的副作用处理。

**1. watch**

`watch` 是一个精确监听特定数据变化的工具，类似于 Vue 2 中的 `watch`。它需要显式指定要监听的目标，并在目标变化时触发回调。

**特点**

- 需要手动指定监听的目标，可以是：
  - 一个响应式数据（`ref` 或 `reactive` 对象的属性）。
  - 一个 getter 函数，用于返回一个响应式值。
- 回调函数接收新值和旧值。
- 可选支持深度监听和立即执行。
- 适合处理异步逻辑或复杂操作。

```js
watch(source, callback, options?)
```

`source`: 要监听的目标，可以是响应式数据或 getter 函数。

`callback`: 数据变化时的回调函数，参数是 `(newVal, oldVal)`。

`options`: 可选配置，支持：

- `deep: true` - 深度监听。
- `immediate: true` - 立即触发回调。

```js
import { ref, watch } from 'vue';

const count = ref(0);

watch(
  count,
  (newVal, oldVal) => {
    console.log(`Count changed from ${oldVal} to ${newVal}`);
  }
);
```



```js
import { ref, watch } from 'vue';

const count = ref(0);
const name = ref('Alice');

watch(
  [count, name],
  ([newCount, newName], [oldCount, oldName]) => {
    console.log(`Count: ${oldCount} -> ${newCount}, Name: ${oldName} -> ${newName}`);
  }
);

count.value++;
name.value = 'Bob';

```



`watchEffect`

`watchEffect` 是一个更加简单和自动化的工具，用于自动收集依赖并执行副作用。它类似于 Vue 2 中的计算属性，**但适合副作用场景**。

**特点**

- 自动追踪响应式数据的依赖，无需显式指定。
- 当依赖的数据变化时，会重新执行回调函数。
- 更加灵活，适合简单的响应式副作用。
- 不提供新值和旧值的参数。

```js
watchEffect(effect, options?)
```

`effect`: 依赖变化时执行的函数。

`options`: 可选配置，支持：

- `onTrack` - 调试依赖追踪。
- `onTrigger` - 调试依赖触发。



**比较**

| **特性**     | **watch**                                   | **watchEffect**                          |
| ------------ | ------------------------------------------- | ---------------------------------------- |
| **依赖指定** | 手动指定（明确指定监听目标）。              | 自动追踪依赖（任何被访问的响应式数据）。 |
| **回调参数** | 提供新值和旧值。                            | 不提供参数，专注于副作用逻辑。           |
| **立即执行** | 默认不立即执行（可通过 `immediate` 开启）。 | 默认立即执行一次。                       |
| **使用场景** | 精确监听特定数据变化，处理复杂或异步任务。  | 简单的副作用或需要自动收集依赖的场景。   |
| **性能开销** | 精确控制监听范围，性能更优。                | 自动收集依赖，可能引入不必要的依赖。     |



## Vue中如何将template转为render函数

在 Vue 中，将 `template` 转为 `render` 函数称为**模板编译**，主要发生在构建时或运行时。

为什么需要将template转为render函数?

- 开发者直接编写虚拟DOM是很繁琐且不利于维护的，而类html的模板写法则极大提高了开发体验和项目的可维护性。
- 在底层，Vue 需要将模板转换为可执行的 JavaScript 函数（即 `render` 函数），使其能够快速生成虚拟 DOM (VNode)，进而更新真实 DOM。



**如何将 template 转为 render 函数**

Vue 使用一个模板编译器将 `template` 转换为 `render` 函数。这一过程通常发生在编译阶段或运行时。

**编译过程**

1. **解析阶段（Parsing）**

   - 将模板字符串解析为一个抽象语法树（AST，Abstract Syntax Tree）。

   - 这个阶段的目标是将模板结构化为树状结构，便于后续处理。

   - 示例：

     ```html
     <div id="app">
       <p>{{ message }}</p>
     </div>
     ```

     解析为：

     ```json
     {
       "type": "Element",
       "tag": "div",
       "attributes": { "id": "app" },
       "children": [
         {
           "type": "Element",
           "tag": "p",
           "children": [
             { "type": "Interpolation", "content": "message" }
           ]
         }
       ]
     }
     ```

2. **优化阶段（Optimization）**

   - 对 AST 进行静态分析，标记静态节点（即不需要重新渲染的节点）。
   - 这一阶段的优化为后续的渲染提升性能（如静态节点缓存）。

3. **代码生成阶段（Code Generation）**

   - 将优化后的 AST 转换为可执行的 JavaScript 渲染函数。

   - 示例：

     ```js
     function render() {
       return h('div', { id: 'app' }, [
         h('p', null, [ctx.message])
       ]);
     }
     ```

------



**运行时 vs 构建时编译**

1. **运行时编译**
   - 如果直接在浏览器中使用 Vue.js（无构建工具），模板会在运行时通过编译器解析为 `render` 函数。
   - 缺点是增加了运行时开销，且应用体积更大。
2. **构建时编译**
   - 如果使用构建工具（如 Vue CLI 或 Vite），模板在构建时就会被编译成 `render` 函数。
   - 构建时编译的优势：
     - 无需在运行时引入模板编译器，减小打包体积。
     - 渲染性能更高，因为跳过了运行时编译的步骤。





## new Vue的过程中做了什么工作

针对vue2的问题。

1. 先进行初始化操作

   src/core/instance/index.ts

   ```js
   import { initMixin } from './init'
   import { stateMixin } from './state'
   
   function Vue(options) {
     this._init(options)
   }
   
   // 多个混入方法， 就是在给构造函数Vue的原型上增加一些方法或者属性
   //@ts-expect-error Vue has function type
   initMixin(Vue)
   //@ts-expect-error Vue has function type
   stateMixin(Vue)
   // ...
   
   export default Vue as unknown as GlobalAPI
   ```

   

   ```js
   export function initMixin(Vue: typeof Component) {
     Vue.prototype._init = function (options?: Record<string, any>) {
       const vm: Component = this
       // a uid
       vm._uid = uid++
         
         // ...
         
       initLifecycle(vm)
       initEvents(vm)
         
       initRender(vm)
       callHook(vm, 'beforeCreate', undefined, false /* setContext */)
       initInjections(vm) // resolve injections before data/props
       initState(vm)
       initProvide(vm) // resolve provide after data/props
       callHook(vm, 'created')
   	
         //  ...
     }
   }
   ```

   

   `initLifecycle` 方法的作用是：

   1. 建立父子组件关系链。
   2. 初始化生命周期相关的属性和状态，并不是调用声明周期函数。
   3. 为后续生命周期钩子和组件通信提供基础支持。

   **核心作用**

   1. **设置父组件引用**：

      - 如果当前实例有父组件（通过 `parent` 选项传递），将父组件引用保存到 `vm.$parent` 属性中。
      - 如果没有父组件，`vm.$parent` 为 `null`。

      ```js
      const parent = options.parent;
      if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
          parent = parent.$parent;
        }
        parent.$children.push(vm);
      }
      vm.$parent = parent;
      ```

   2. **建立子组件链**：

      - 当前实例会被添加到父组件的 `$children` 数组中，建立父子组件的引用关系。

   3. **初始化实例自身的属性**：

      - 初始化一些生命周期相关的属性：
        - `vm.$root`：指向根 Vue 实例。如果当前实例是根实例，则 `vm.$root === vm`。
        - `vm.$children`：存储当前实例的子组件列表，初始为空数组。
        - `vm.$refs`：存储模板中使用 `ref` 属性定义的引用对象。

   4. **设置内部生命周期状态**：

      - 初始化组件内部的生命周期状态标志：

        ```js
        vm._isMounted = false;  // 是否挂载完成
        vm._isDestroyed = false; // 是否已经被销毁
        vm._isBeingDestroyed = false; // 是否正在销毁过程中
        ```

   ------

   **关键逻辑解析**

   **处理父子关系**

   - 当实例被创建时，如果父组件存在且不是抽象组件（如 `keep-alive`），它会被添加到父组件的 `$children` 中。
   - 抽象组件会跳过自己，直接将实例附加到它的非抽象祖先组件中。

   **生命周期状态初始化**

   - 初始化状态标志 `_isMounted`、`_isDestroyed` 和 `_isBeingDestroyed`，用于后续生命周期管理和渲染更新。

     

   ```js
   export function initLifecycle(vm: Component) {
     const options = vm.$options
   
     // locate first non-abstract parent
     let parent = options.parent
     if (parent && !options.abstract) {
       while (parent.$options.abstract && parent.$parent) {
         parent = parent.$parent
       }
       parent.$children.push(vm)
     }
   
     vm.$parent = parent
     // vm.$root 指向最顶层的祖先组件实例
     vm.$root = parent ? parent.$root : vm;
   
     // vm.$children 是一个数组，包含所有子组件实例
     vm.$children = [];
     vm.$refs = {};
   
     vm._provided = parent ? parent._provided : Object.create(null)
     
     // vm._watcher 会在后续渲染过程中用作组件的 watcher
     vm._watcher = null;
     // vm._inactive 标识组件是否处于非活动状态
     vm._inactive = null;
     // vm._directInactive 直接被标记为非活动
     vm._directInactive = false;
     // vm._isMounted 标识组件是否已经挂载
     vm._isMounted = false;
     // vm._isDestroyed 标识组件是否已经被销毁
     vm._isDestroyed = false;
     // vm._isBeingDestroyed 标识组件是否正在被销毁
     vm._isBeingDestroyed = false;
   }
   ```

   

   

   initEvents：初始化事件系统，负责设置组件实例上的事件监听机制。并在组件实例化的过程中被调用。

   ```js
   
   export function initEvents(vm: Component) {
     vm._events = Object.create(null)
     vm._hasHookEvent = false
     // init parent attached events
     const listeners = vm.$options._parentListeners
     vm.$options._parentListeners 用于存储父组件通过 v-on 绑定在子组件上的事件监听器
     if (listeners) {
       updateComponentListeners(vm, listeners)
     }
   }
   ```

   例如，父组件这样使用子组件：

   ```vue
   <ChildComponent @custom-event="handleCustomEvent" />
   ```

   此时，`custom-event` 及其对应的回调函数 `handleCustomEvent` 会存储在子组件的 `vm.$options._parentListeners` 中。

   

2. lifecycle和events

3.  callHook(vm, 'beforeCreate', undefined, false /* setContext */)，调用第一个生命周期函数

4. 初始化initInjections、initState和initProvide

5. initState 初始化 Vue 实例的状态，具体来说就是初始化与数据相关的选项，包括 `props`、`data`、`methods`、`computed` 和 `watch`，为 Vue 的响应式系统和实例的状态管理提供支持。

   核心作用

   1. **初始化状态**：
      - `initState` 方法通过逐步初始化不同的选项（如 `props`、`data`、`methods` 等），为实例配置响应式数据和相关逻辑。
   2. **与响应式系统对接**：
      - 通过调用 `observe` 方法将 `data` 转换为响应式数据。
      - 为 `props` 和 `data` 中的属性定义代理访问，确保可以通过 `this.propName` 或 `this.dataName` 直接访问这些属性。

6. callHook(vm, 'created')，调用第二个生命周期函数

7. 接下来调用vm.$mount方法，如果不调用\$mount方法，代码执行会暂停在这里

8. 再看一下用户是否传入了el属性和 template 或者render。render 的优先级更高，如果用户写的是template，会做模板编译。最终就拿到了render 函数（这是包含编译时的vue源码所作的事情，运行时一般不做）

   ```ts
   Vue.prototype.$mount = function (
     el?: string | Element,
     hydrating?: boolean
   ): Component {
     el = el && query(el)
   
     const options = this.$options
     // resolve template/el and convert to render function
     if (!options.render) {
       let template = options.template
       if (template) {
         if (typeof template === 'string') {
           if (template.charAt(0) === '#') {
             template = idToTemplate(template)
             /* istanbul ignore if */
           }
         } else if (template.nodeType) {
           template = template.innerHTML
         } else {
           if (__DEV__) {
             warn('invalid template option:' + template, this)
           }
           return this
         }
       } else if (el) {
         // @ts-expect-error
         template = getOuterHTML(el)
       }
       if (template) {
         const { render, staticRenderFns } = compileToFunctions(
           template,
           {
             outputSourceRange: __DEV__,
             shouldDecodeNewlines,
             shouldDecodeNewlinesForHref,
             delimiters: options.delimiters,
             comments: options.comments
           },
           this
         )
         options.render = render
         options.staticRenderFns = staticRenderFns
       }
     }
     return mount.call(this, el, hydrating) // mount是运行时包中的$mount
   }
   ```

9. 内部挂载的时候会产生一个 watcher，会调用 render 函数会触发依赖收集。内部还会给所有的响应式数据增加 dep 属性，让属性记录当前的 watcher (用户后续修改的时候可以触发 watcher 重新渲染)

10. vue 更新的时候采用虚拟 DOM 的方式进行 diff 算法更新。



![Vue 实例生命周期](https://v2.cn.vuejs.org/images/lifecycle.png)





## Vue.observable

`Vue.observable` 是 Vue 2.6.0 引入的一个全局 API，用于创建一个响应式的对象。通过这个方法生成的对象，能够被 Vue 的响应式系统追踪，当对象的属性发生变化时，依赖该对象的组件会自动更新。

```ts
  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
```

Vue3废弃了这个方法，直接使用reactive就行。

**主要用途**

`Vue.observable` 的主要用途是为组件之间的共享状态提供一种轻量级的实现方式，特别适用于简单的状态管理需求。

`Vue.observable` 常用于替代复杂的状态管理工具（如 Vuex），实现组件间共享状态。例如：

```vue
// state.js
import Vue from 'vue';

export const state = Vue.observable({
  count: 0,
});

// mutations.js
export const mutations = {
  increment() {
    state.count++;
  },
  decrement() {
    state.count--;
  },
};

// 组件A
<template>
  <div>
    <p>Count: {{ state.count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { state, mutations } from './state';

export default {
  computed: {
    state() {
      return state;
    },
  },
  methods: {
    increment: mutations.increment,
  },
};
</script>

// 组件B
<template>
  <div>
    <p>Count: {{ state.count }}</p>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script>
import { state, mutations } from './state';

export default {
  computed: {
    state() {
      return state;
    },
  },
  methods: {
    decrement: mutations.decrement,
  },
};
</script>
```



## v-if和v-for的优先级

实践：避免在同一个标签上同时使用v-if和v-for。

他们的优先级在vue2和vue3中是不一样的。

```vue
<div>
	<div v-for="item in items" v-if="flag" :key='item'> </div>
</div>
```

vue2编译的结果：

```js
function render() {
  with(this) {
    return _c('div', _l((items), function (item) {
      return (flag) ? _c('div') : _e()  // 每次条件不满足都返回一个空注释节点
    }), 0)
  }
}
```

vue2中v-for的优先级高于v-if。





vue3编译结果：

```js
import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    (_ctx.flag)
      ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(_ctx.items, (item) => {
          return (_openBlock(), _createElementBlock("div"))
        }), 256 /* UNKEYED_FRAGMENT */))
      : _createCommentVNode("v-if", true)
  ]))
}

// Check the console for the AST
```

从编译的结果看，v-if被提取到外面去了。所以vue3中v-if的优先级更高。



建议的写法：

```vue
<div v-if="flag">
	<div v-for="item in items" > </div>
</div>
```



如果就是需要在同一个标签中使用，则可以考虑循环计算属性。

```vue
<div v-for="(item, index) in items" v-if="index%2"> </div>  
// 这在vue3中是无效的写法，会报错，因为v-if表达式会提取到外层，也就没有看index可以访问了。
```

改为：使用对计算属性的循环。



## vue3比vue2有什么优势？

Vue 3 相比于 Vue 2 带来了许多改进和新特性，这些变化旨在**提升性能、增强可维护性、以及扩展功能**。下面是 Vue 3 相比于 Vue 2 的一些主要优势：

1. **性能提升**：Vue 3 引入了许多性能优化措施，包括更小的打包体积、更快的虚拟 DOM 重写和更新、以及更高效的组件初始化。这些优化使得 Vue 3 在运行速度和启动时间上比 Vue 2 更快。
2. **Composition API**：Vue 3 引入了 Composition API，允许用户更灵活地组织代码，特别是在处理复杂组件时。这使得代码更**容易理解和维护**，同时也更容易**重用逻辑**。
3. **更好的 TypeScript 支持**：提供了更好的类型推导和类型检查。这使得开发大型项目时，代码的可靠性和维护性得到提升。
4. **新的响应式系统**：Vue 3 使用了基于 Proxy 的响应式系统，替换了 Vue 2 中基于 Object.defineProperty 的实现。这个新系统提高了性能，同时也使 Vue 能够更好地处理嵌套属性和集合类型，如 Map 和 Set。
5. **更好的组件化和模块化**：Vue 3 提高了组件和模块的灵活性和复用性，使得开发大型应用时，代码更加模块化和组件化。
6. **Fragment、Teleport 和 Suspense 新特性**：
   - **Fragment** 允许组件返回多个根节点，这在 Vue 2 中是不可能的。
   - **Teleport** 是一个新的内置组件，允许将子节点传送到 DOM 的其他部分。
   - **Suspense** 提供了一种新的方式来处理异步组件和它们的加载状态，使得创建平滑的用户体验变得更加容易。
7. **更易于测试**：Vue 3 带来了改进的测试功能和支持，使得单元测试和端到端测试更加容易实施。
8. **自定义渲染器 API**：Vue 3 提供了一个自定义渲染器 API，允许开发者创建自定义的渲染器，这为在不同平台上使用 Vue 打开了大门，包括原生移动应用开发。
9. **更好的 SSR 支持**：Vue 3 提供了改进的服务器端渲染（SSR）支持和文档，使得开发高性能、SEO 友好的应用变得更加容易。





## Vue的生命周期函数

请求一般在哪个声明周期函数中发送。每个生命周期中一般做什么操作。

Vue 3 保留了 Vue 2 中的大多数生命周期钩子，同时也引入了一些变化，尤其是为了与 Composition API 的引入相兼容。以下是 Vue 3 中的生命周期函数及其一般使用场景：

1. **`beforeCreate`** 和 **`created`**：
   
   - 这两个生命周期函数在 Vue 3 中并未发生太大变化，但在使用 Composition API 时，它们的用途被 `setup()` 函数所取代。
   
   - `beforeCreate` 在实例初始化之后、数据观察和事件/侦听器的设置之前被调用。
   
   - `created` 在实例创建完成后被调用，此时已完成数据观察、属性和方法的运算、侦听器的设置等，但尚未开始 DOM 渲染，因此不能访问到 `$el` 属性。
   
   - beforeCreate一般用在第三方插件开发中，vuex和vue-router，通过mixin混入这个生命周期函数，在这个声明周期函数中去在原型或者实例上共享一些属性或者方法。
   
   - created函数一般在服务端使用，具体在后端一般有以下使用方式：
   
     **预取数据（Data Fetching）**
     在服务端渲染中，`created` 常用于获取数据并填充到组件的 `data` 中。这是因为服务端需要在渲染 HTML 前准备好完整的页面数据，以便返回给浏览器。例如：
   
     ```js
     created() {
       this.fetchData();
     },
     methods: {
       async fetchData() {
         const response = await fetch('https://api.example.com/data');
         this.data = await response.json();
       }
     }
     ```
   
     这样客户端接收到的 HTML 就包含完整的数据，而不需要等待后续的 AJAX 请求。
   
     
   
     **执行服务端逻辑**
     一些逻辑需要在服务端执行而不是在客户端上，比如处理权限检查、认证验证、或动态生成内容。这些逻辑可以在 `created` 中运行，确保在服务端直接完成处理。
   
     
   
     **初始化组件状态**
     在服务端渲染时，可以通过 `created` 方法对组件的初始状态进行调整。这些调整会在渲染 HTML 时生效，确保客户端接收到的状态是一致的。
   
   
     请求后端接口在created还是mounted中去调用几乎没有什么区别。前端组件渲染的代码时同步的，请求是异步的，所以即使请求先回来，同时组件渲染还没有结束，也是需要等到同步的组件渲染结束后才能继续后续请求回来的异步任务。
   
2. **`beforeMount`**：
   
   - 在挂载开始之前被调用，相关的 `render` 函数首次被调用之前调用。
   - 这个阶段可以用于在服务器端渲染期间执行代码，或者在客户端渲染之前进行最后的配置。
   
3. **`mounted`**：
   - 在实例被挂载后调用，此时可以访问到 DOM 元素 (`this.$el`)。
   - 通常用于执行依赖于 DOM 的操作，例如使用第三方库初始化组件，或者执行需要在模板渲染成真实 DOM 之后进行的操作。
   
4. **`beforeUpdate`**：
   - 在数据更新之前调用，但 DOM 还未被更新。
   - 可用于在当前的状态下执行操作，或者在视图更新之前获取更新前的 DOM 状态。
   
5. **`updated`**：
   - 在数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。
   - 用于执行依赖于 DOM 的操作，确保元素已经更新。
   - 常常使用这个函数做一些缓存操作。
   
6. **`beforeUnmount`**：
   
   - 在卸载组件实例之前调用。
   - 用于执行清理操作，如事件解绑或清除定时器。
   
7. **`unmounted`**：
   - 在组件实例被卸载之后调用。
   - 此时组件的所有指令已经解绑，事件监听器被移除，子组件也都被卸载。
   
8. **`activated`** 和 **`deactivated`**（仅在 `<keep-alive>` 组件中有效）：
   - `activated` 用于处理组件被激活时的逻辑。
   - `deactivated` 用于处理组件被停用时的逻辑。
   
9. **`errorCaptured`**：
   - 当捕获一个来自子孙组件的错误时被调用。
   - 用于错误处理和记录。

在 Composition API 中，相应的生命周期钩子有所调整，主要通过 `onBeforeMount`、`onMounted`、`onBeforeUpdate`、`onUpdated`、`onBeforeUnmount`、`onUnmounted` 等函数来使用，它们在 `setup()` 函数中被调用，提供了与选项 API 相同的生命周期钩子功能，但以更加灵活的方式使用。



vue3中增加了一个setup生命周期函数（compositionAPI的入口），最先执行。





## 单页面路由的实现方式

前端路由：

改变 url 实现页面内容部分切换。

方式一：hash

```js
关键API：
window.location.hash = path
window.addEventListener('hashchange',function(){})
```

方式二：history

```js
关键API：
history.pushState(state,title,hashurl(#/...))  //state会在页面的popstate事件触发时，将state作为一个属性值传给popstate事件处理函数的event对象中。hashurl则是用于改变urlahsh部分是hash值。
window.addEventListener('popstate',function(event){})
```



## 项目开发流程

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



## 样式穿透

在 Vue 中，当组件的样式使用 `scoped` 属性时，默认情况下这些样式会被限制在当前组件的范围内，无法直接影响子组件或外部元素的样式。

进行样式穿透的方法：

1. 使用深度选择器（Deep Selector）

   Vue 提供了一种特殊的方式来穿透 `scoped` 限制，通过 `::v-deep` 伪选择器。

   ```vue
   <template>
     <div class="parent">
       <child-component />
     </div>
   </template>
   
   <style scoped>
   /* 通过 ::v-deep 对子组件样式进行穿透 */
   ::v-deep(.child-class) {
     color: red;
   }
   </style>
   ```

   **解释：**

   - `::v-deep(.child-class)` 会在编译时被转换为适当的 CSS 规则，确保样式可以应用到子组件的元素上。

   - `::v-deep` 是 **Vue 提供的** 特殊伪选择器，它并不是 CSS 的原生功能，而是由 Vue 的编译器在处理 `scoped` 样式时转换的一个语法。

     

   2. **组合 `scoped` 和全局样式**

   如果 `::v-deep` 不能满足需求，或者需要作用于全局样式，可以通过 `:global` 来声明一部分样式为全局。

   ```vue
   <template>
     <div class="parent">
       <child-component />
     </div>
   </template>
   
   <style scoped>
   /* 使用 :global 作用于全局样式 */
   :global(.child-class) {
     color: blue;
   }
   </style>
   ```

   **解释：**

   - `:global` 指定的样式不会受到 `scoped` 的限制，可以直接作用于子组件或页面上的全局元素。

   

   3. **直接操作子组件的 DOM**

      如果需要动态更改样式，可以通过 `ref` 获取子组件的 DOM 元素，并使用 JavaScript 修改其样式。

      ```vue
      <template>
        <div>
          <child-component ref="child" />
        </div>
      </template>
      
      <script>
      export default {
        mounted() {
          this.$refs.child.$el.querySelector('.child-class').style.color = 'green';
        },
      };
      </script>
      ```

      **注意：**

      - 这种方法不推荐在复杂场景中使用，因为它直接操作 DOM，可能破坏 Vue 的响应式机制。

   4. **避免使用 Scoped**

      如果特定样式需要完全不受 `scoped` 限制，可以直接移除 `scoped` 或者将样式写入全局样式文件中。

   5. ### **使用动态类名**

      如果穿透样式需要动态应用，可以通过 Vue 的动态类名来实现。

      ```vue
      <template>
        <div :class="{ 'custom-class': isActive }">
          <child-component />
        </div>
      </template>
      
      <style scoped>
      /* 针对子组件中的类 */
      ::v-deep(.child-class.custom-class) {
        color: orange;
      }
      </style>
      ```

      

## Vue 中的 diff 算法

**目标**：比较两棵虚拟 DOM 树（`oldVNode` 和 `newVNode`），找出需要更新的部分，并对真实 DOM 进行最小量的修改。

`patch(oldVNode, newVNode)` 是更新的入口，整个算法遵循深度优先遍历。

**核心原则**：

1. **同层比较**：为了降低比较的时间复杂度，采用的 **平级比较**。同一层级的节点之间进行比较，不考虑跨级的情况。因为常规的DOM操作中很少有原来的父级DOM变为之后的后代DOM的情况，反之亦然。
2. **Key 的使用**：通过 `key` 快速定位子节点。
3. **最小更新**：只修改必要的节点，尽量复用旧节点。

比较的过程是深度递归优先的方式。

**具体流程：**

1. #### **比较祖先节点**

   1. `oldVNode` 和 `newVNode` 不同类型：
      - 如果 `oldVNode` 和 `newVNode` 的标签类型不同或者key不同（如 `div` -> `span`），直接移除旧节点并替换为新节点。
   2. `oldVNode` 和 `newVNode` 是相同类型（key 和 tag都相同）：
      - 如果两者的标签类型相同，则进行详细的属性和递归子节点比较。
        - 调用 `updateProps` 函数：
          - 遍历 `newVNode`的属性，与 `oldVNode`对比：
            1. 如果属性值不同，更新该属性。
            2. 如果新节点中没有某个旧属性，移除该属性。
      - 复用老的虚拟DOM对应的真实DOM节点（如果节点是组件的化，会复用组件对应的实例对象）

1. 有子节点则继续递归比较子节点，调用 `updateChildren` 函数，比较两组子节点。

   **新旧节点都没有子节点**：

   - 无需操作。

   **旧节点有子节点，新节点没有子节点**：

   - 清空旧节点的子节点。

   **旧节点没有子节点，新节点有子节点**：

   - 将新节点的子节点逐个挂载到 DOM 中。

   **新旧节点都有子节点**（最复杂的情况）：

   - 老虚拟DOM节点和新的虚拟DOM节点都是文本节点，则直接更新文本节点内容
   - 老虚拟DOM节点的子节点是数组，新的也是数组，则开启真正的diff比较

2. 针对两个数组子节点的diff比较细节（updateChildren）
   - 采用了双指针方式对和数组相关的常见操作（头部追加，尾部追加，中间插入，倒序和反转等）进行优化
   - 头和头比，尾和尾比，头尾交叉比对，还不满足就做一个映射表，用新的 VDOM 中的节点去依次比较映射表中的节点，存在相同的节点则移动老的节点即可，不存在则插入，多余的则删除。
   - `updateChildren(oldChildren, newChildren)` 接收两组子节点数组，使用双指针算法进行高效对比。

     #### **双端比较的逻辑**：

     1. **初始化**：
        - 设置 4 个指针：
          - `oldStartIdx` 和 `oldEndIdx`：指向旧子节点的起始和结束位置。
          - `newStartIdx` 和 `newEndIdx`：指向新子节点的起始和结束位置。
     2. **逐步比较**：
        - 比较 oldChildren[oldStartIdx] 和 newChildren[newStartIdx]：
          1. 如果两者相同，更新节点，指针前移。
          2. 如果不同，再比较 `oldChildren[oldEndIdx]` 和 `newChildren[newEndIdx]`。
          3. 如果都不匹配，尝试从 `key` 查找是否存在复用节点。
          4. 如果找不到可复用节点，则插入新节点或移除旧节点。
     3. **双端指针的优势**：
        - 通过从两端同时比较，可以快速找到不匹配的部分并处理。
     4. **结束条件**：
        - 当某一组子节点遍历完成，另一个数组剩余的节点会被直接插入或移除。

**核心优化：Key 的作用**

1. 如果子节点数组中包含 key 属性：
   - Vue 会构建一个 `key -> index` 的映射表，快速定位复用的节点。
   - 提高了对节点移动和复用的效率。
2. 如果子节点数组没有 key 属性：
   - Vue 会采用简单的顺序比较，性能较低。

递归比较节点内的后代节点，一方有后代节点，一方没有，则删除或者添加。

Diff 算法代码结构简要伪代码

```js
function patch(oldVNode, newVNode) {
  if (!oldVNode) {
    // 挂载新节点
    createElm(newVNode);
  } else if (oldVNode.tag !== newVNode.tag) {
    // 替换整个节点
    replaceNode(oldVNode, newVNode);
  } else {
    // 更新节点
    updateProps(oldVNode, newVNode);
    updateChildren(oldVNode.children, newVNode.children);
  }
}

function updateChildren(oldChildren, newChildren) {
  let oldStartIdx = 0, oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0, newEndIdx = newChildren.length - 1;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVNode(oldChildren[oldStartIdx], newChildren[newStartIdx])) {
      patch(oldChildren[oldStartIdx], newChildren[newStartIdx]);
      oldStartIdx++;
      newStartIdx++;
    } else if (sameVNode(oldChildren[oldEndIdx], newChildren[newEndIdx])) {
      patch(oldChildren[oldEndIdx], newChildren[newEndIdx]);
      oldEndIdx--;
      newEndIdx--;
    } else {
      // 复杂情况，尝试通过 key 查找节点
      const idxInOld = findIdxInOld(newChildren[newStartIdx].key, oldChildren);
      if (idxInOld != null) {
        // 移动节点
        moveNode(oldChildren[idxInOld], newStartIdx);
        patch(oldChildren[idxInOld], newChildren[newStartIdx]);
      } else {
        // 插入新节点
        createElm(newChildren[newStartIdx]);
      }
      newStartIdx++;
    }
  }

  // 添加剩余新节点
  if (newStartIdx <= newEndIdx) {
    addRemainingNodes(newChildren, newStartIdx, newEndIdx);
  }
  
  // 移除多余旧节点
  if (oldStartIdx <= oldEndIdx) {
    removeRemainingNodes(oldChildren, oldStartIdx, oldEndIdx);
  }
}

```

Vue 2 的 diff 算法基于 **同层比较、双端指针、Key 的复用**，主要目的是高效比较虚拟 DOM 并最小化真实 DOM 的更新：

- **核心优化**：通过 Key 和双端指针，避免了不必要的深度遍历。
- **时间复杂度**：理想情况下为 O(n)（当 Key 有效时）；最坏情况下为 O(n^2)（当没有 Key 且需要逐个比较时）。





### **Vue 2 的 Diff 算法不足之处**

**1. 静态节点重复比较**

- **问题**：Vue 2 的 Diff 算法会对watcher对应的那个整颗虚拟 DOM 树进行逐层比较，即使是静态节点（不会发生变化的 DOM），也会被多次比较。
- **影响**：如果组件的模板中包含大量静态内容，这些节点在每次更新时都会参与 Diff 运算，浪费了计算资源。

**2. `key` 使用优化不足**

- 问题：虽然 Vue 2 提供了 key 来优化子节点的对比，但未在算法上最大化利用 key的潜力：
  - 未使用专门的机制来快速定位节点，仍然需要对数组进行顺序遍历或逐个对比。
- **影响**：在存在复杂列表操作（如节点频繁插入、删除、移动）时，性能下降明显。

3. **Diff 算法较难扩展**

- **问题**：Vue 2 的 Diff 实现与其内部逻辑耦合较深，不易对算法进行扩展或自定义，限制了其在某些场景下的灵活性。



### **Vue 3 的优化策略**

Vue 3 针对上述问题，通过一系列设计上的优化，显著提升了性能和灵活性。

**1. 静态提升（Static Hoisting）**

- **改进**：Vue 3 在**编译阶段**会将静态节点提升到渲染函数之外，只生成一次静态节点的虚拟 DOM。
- 原理：
  - 编译时识别哪些节点是静态的（不会变化）。
  - 静态节点在渲染时只会创建一次，后续更新中直接复用，无需再次比较。
- 效果：
  - 减少了虚拟 DOM 树的大小。
  - 避免了静态节点的重复 Diff。

**2. Block 和 Patch Flag**

- **改进**：Vue 3 引入了 Block 和 Patch Flag 概念，用于标记动态内容，优化 Diff 过程。
- 原理：
  1. 在编译阶段，将动态节点分组为 **Block**。
  2. 动态节点用 **Patch Flag** 标记更新类型（如文本变化、属性变化、子节点变化等）。
  3. 更新时，仅处理动态节点及其变化内容。
- 效果：
  - 显著减少了需要比较的节点范围。
  - 提高了更新的精确度，避免全量遍历。



**3. 高效的子节点 Diff**

- **改进**：Vue 3 的子节点 Diff 算法采用了**双端比较**和**最长递增子序列（LIS）算法**。
- 原理：
  - 在 Diff 子节点时，先通过双端指针快速比较头尾，处理可以直接复用的节点。
  - 对剩余的无序部分使用 LIS 算法，减少节点移动次数。
- 效果：
  - 对于复杂的列表操作，如插入、删除和移动，Diff 的效率显著提升。





## Vue中key的作用原理

key作为特殊的属性，主要用在diff算法中，用于新旧节点的比对辨识，如果不使用key，Vue 会使用一种**最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素**的算法,

当 Vue 正在更新使用 v-for 渲染的元素列表时，它默认使用“就地更新”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。

```vue
<div>
    <input type='text' v-if='!flag'>
    <input type='password' v-else/>
</div>
```

点击切换前有输入内容：

![image-20241213162700133](D:\learn-notes\vue\images\image-20241213162700133.png)

点击切换后的效果：

![image-20241213162735475](D:\learn-notes\vue\images\image-20241213162735475.png)

在上述页面中，先flag是false，展示text输入框，当输入内容后，改变flag的值为true，则展示为密码框，但是之前在text输入框中的内容并没有消失而是直接被重用了。实际不想要这个想过，因为在状态切换前后，都是输入框，只是type不同，vue就只会更改type属性并尽量的重用dom元素。  可以借助key来完善。



```vue
<p v-for='(fruit,index) in fruits'>
    <input type='checkbox'/>
    {{fruit}}
</p>
<button @click='fruits.unshift('芒果')'>
    增加一项
</button>
```

初始渲染的时候，一切正常，没有对水果项进行任何操作时，向前追加也正常。

当我们在选中某一项的checkbox后，再次追加的话，会发现选中的checkbox项发生了偏移。

追加之前选中：

![image-20241213162513916](D:\learn-notes\vue\images\image-20241213162513916.png)

追加之后：

![image-20241213162545914](D:\learn-notes\vue\images\image-20241213162545914.png)

针对上述这种情况，采用index索引作为key也是同样的原理，无法解决问题。

出现这种情况的原因分析：

当没有key（key默认为undefined）或者key为索引的情况下，新旧节点比对时，发现新老节点的第一个元素的key都相同，tag也相同，所以直接复用原来是香蕉的那个节点，只是将文本香蕉改为芒果，checkbox还是复用的，所以checkbox仍旧选中的想过。新旧的第二个节点比较，key和tag也都一样所以继续复用，只是将苹果文本改为了香蕉文本，以此类推，最后发现新增了一个节点橘子，则创建该节点并插入其中。  整个过程没有移动节点的操作。





## Vue.use的作用

`Vue.use` 是 Vue 提供的一个全局 API，通常用于**注册插件**。它为 Vue 应用程序引入插件提供了一个统一的机制。通过调用 `Vue.use` 方法，可以将插件的功能全局地添加到 Vue 应用中。

如果插件是一个对象，必须提供 instal 方法。如果插件是一个函数，它会被作为 install方法。instal方法调用时，会将 Vue 作为参数传入，这样插件中就不在需要依赖 Vue 了。



**`Vue.use` 的作用**

**1. 注册插件**

`Vue.use` 的主要作用是注册一个插件。插件通常用于向 Vue 提供全局功能，例如：

- 全局组件
- 全局指令
- 实例方法或属性
- 混入功能
- 自定义逻辑扩展



**2. 调用插件的 `install` 方法**

- 当你调用 `Vue.use(plugin)` 时，Vue 会自动调用插件对象的 `install` 方法，并将 `Vue` 作为参数传入。
- 通过 `install` 方法，插件可以访问 Vue 的构造函数，从而扩展 Vue 的功能。



插件的编写：

```js
// 定义插件
const MyPlugin = {
  install(Vue, options) {
    // 添加全局方法
    Vue.prototype.$myMethod = function () {
      console.log('This is a custom method');
    };

    // 添加全局指令
    Vue.directive('focus', {
      inserted(el) {
        el.focus();
      }
    });

    // 添加全局混入
    Vue.mixin({
      created() {
        console.log('Global mixin - created hook');
      }
    });
  }
};

// 注册插件
Vue.use(MyPlugin, { someOption: true });

// 使用插件功能
new Vue({
  created() {
    this.$myMethod(); // 调用全局方法
  }
});
```





use源码：

```js
Vue.use = function (plugin: Function | any) {
    // 插件的缓存，防止同一个插件反复安装
    const installedPlugins =
          this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }

    // additional parameters
    const args = toArray(arguments, 1)  // 截取到后用使用use时传递的其他参数
    args.unshift(this)
    if (isFunction(plugin.install)) {
        plugin.install.apply(plugin, args)
    } else if (isFunction(plugin)) {
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin)  // 缓存插件
    return this
}
```



## Vue.extend方法

`Vue.extend` 是 Vue 提供的一个全局 API，用于**创建一个 Vue 构造器的子类**。通过调用 `Vue.extend`，可以基于现有的 Vue 构造器，扩展出一个带有特定配置（如模板、数据、方法等）的自定义组件构造器。



**`Vue.extend` 的功能**

**1. 创建组件构造器**

- `Vue.extend` 返回一个新的组件构造器，你可以通过它创建该组件的实例。
- 这是 Vue 内部实现组件的基础机制。

**2. 复用基础 Vue 配置**

- 通过继承 `Vue` 的基础功能（如响应式、生命周期等），让你快速定义新组件的逻辑。

**3. 灵活动态创建组件**

- **使用 `Vue.extend` 创建的组件可以动态地挂载到页面上，而无需在模板中事先声明。**



**语法**

```js
const SubVue = Vue.extend(options);
```

- **参数：`options`**
  - 传入的选项对象，与 `new Vue` 的选项一致，例如 `data`、`methods`、`template` 等。
- **返回值**
  - 返回一个新的 Vue 子类构造器。



**使用场景**

**1. 定义子类组件**

使用 `Vue.extend` 定义一个新的 Vue 子类，然后通过 `new` 创建实例。

```js
// 创建一个子类
const MyComponent = Vue.extend({
  template: '<div>Hello, {{ message }}</div>',
  data() {
    return {
      message: 'Vue.extend'
    };
  }
});

// 使用子类创建实例
const instance = new MyComponent().$mount('#app');
```

**2. 动态创建组件实例**

在需要动态加载和渲染组件的场景下，可以使用 `Vue.extend` 创建组件构造器，并手动挂载。

```js
const Notification = Vue.extend({
  template: '<div class="notification">{{ message }}</div>',
  data() {
    return {
      message: 'This is a notification'
    };
  }
});

// 动态创建组件实例
const notificationInstance = new Notification();
notificationInstance.$mount(); // 手动挂载
document.body.appendChild(notificationInstance.$el); // 添加到 DOM 中
```

**3. 结合插件或全局功能**

- 在插件中，可以使用 `Vue.extend` 创建全局组件，如动态对话框、通知栏等。



**`Vue.extend` 的注意事项**

1. **不建议在 Vue 3 中使用**

   - Vue 3 提供了基于函数式 API 的组件创建方式（`defineComponent` 和 `setup`），更现代化和简洁。
   - `Vue.extend` 主要是 Vue 2 的写法，不推荐在 Vue 3 中继续使用。

2. **与全局注册的组件不同**

   - `Vue.extend` 是用来生成组件构造器的，而全局注册（`Vue.component`）是直接向 Vue 注册组件。

3. **动态挂载的清理**

   - 使用 Vue.extend 创建的实例需要手动挂载到 DOM，但也需要手动销毁，避免内存泄漏：

     ```
     notificationInstance.$destroy();
     ```



extend源码：

```js
  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name =
      getComponentName(extendOptions) || getComponentName(Super.options)
    if (__DEV__ && name) {
      validateComponentName(name)
    }
	// 子类
    const Sub = function VueComponent(this: any, options: any) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
```



## Vue组件的data属性为什么必须是函数

- 根实例对象 data可以是对象也可以是函数“单例”，不会产生数据污染情况
- 组件实例对象data必须为函数，目的是为了防止多个组件实例对象之间共用一个data，产生数据污染。所以需要通过工厂函数返回全新的 data 作为组件的数据源

![image-20241213172918605](D:\learn-notes\vue\images\image-20241213172918605.png)

改为工厂函数：

![image-20241213173018872](D:\learn-notes\vue\images\image-20241213173018872.png)

## Vue中的过滤器

过滤器（Filters）是 Vue 中提供的一种用于**格式化数据展示**的功能，它们主要用在模板表达式中，对数据进行特定的格式化后再输出到视图中。

**作用**：在不改变原始数据的情况下，对其进行处理，例如格式化时间、转换大小写、数值格式化等。

**使用场景**：过滤器通常用于简单的文本转换，而不是复杂的逻辑。



过滤器可以在以下两个地方使用：

1. 模板表达式：

   ```vue
   <div>{{ message | filterName(arg1,arg2) | filter2 }}</div>
   ```

   编译结果：

   ```js
   function render() {
     with(this) {
       return _c('div', [_v(_s(_f("filter2")(_f("filterName")(message, arg1, arg2) )))])
     }
   }
   ```

   

2. v-bind 指令：

   ```vue
   <div v-bind:id="id | filterName"></div>
   ```

过滤器会自动接收到第一个参数作为数据值（即 `value`），后续的参数为传入的参数。



**Vue 中定义过滤器**

**1. 全局过滤器**

通过 `Vue.filter` 方法定义全局过滤器：

```js
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

使用：

```vue
<div>{{ 'hello' | capitalize }}</div>
<!-- 输出：Hello -->
```

**2. 局部过滤器**

在组件中通过 `filters` 选项定义：

```js
new Vue({
  el: '#app',
  data: {
    message: 'hello world'
  },
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
});
```



一旦使用了过滤器后，就需要对模板进行编译，需要编译出过滤器对应的代码（增加编译后代码），但是过滤器的功能很简单，完全可以自己实现，而不需要过滤器。vue3就将这个特性移除了。在 Vue 3 中，过滤器被移除。推荐使用**计算属性**或**方法**来代替过滤器的功能。



**常见过滤器**：

**大小写转换**

- 将字符串转换为大写或小写。

```js
Vue.filter('uppercase', function(value) {
  return value ? value.toUpperCase() : '';
});
Vue.filter('lowercase', function(value) {
  return value ? value.toLowerCase() : '';
});
```



**文本截取**

- 截取字符串，限制字符长度。

```js
Vue.filter('truncate', function(value, length) {
  if (!value) return '';
  return value.length > length ? value.substring(0, length) + '...' : value;
});
```



**格式化日期**

- 格式化时间为人类可读的日期。

```js
Vue.filter('formatDate', function(value) {
  const date = new Date(value);
  return date.toLocaleDateString();
});
```





## v-once

- **作用**：`v-once` 指令会让绑定的 DOM 节点和组件在初次渲染后成为静态内容，该元素或组件在数据发生变化时不再重新渲染。
- **性能优化**：在某些情况下，使用 `v-once` 可以显著提高性能，因为 Vue 不需要跟踪或更新这些节点的变化。
- **本质**：对标记的节点或组件进行缓存虚拟DOM节点

```vue
<div v-once>{{ message }}</div>
```

在初次渲染时会记录 `{{ message }}` 的值，之后无论 `message` 如何变化，页面都不会更新。

```js
import { setBlockTracking as _setBlockTracking, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, createElementVNode as _createElementVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
    // _cache[0] 就是v-once缓存的虚拟DOM节点
  return _cache[0] || (
    _setBlockTracking(-1, true),
    (_cache[0] = _createElementVNode("div", null, [
      _createTextVNode(_toDisplayString(_ctx.message), 1 /* TEXT */)
    ])).cacheIndex = 0,
    _setBlockTracking(1),
    _cache[0]
  )
}

// Check the console for the AST
```





**使用场景**

**1. 静态内容**

对于那些渲染后永远不会改变的内容，可以使用 `v-once` 来避免无意义的重新渲染，提升性能。

```vue
<div v-once>
  {{ '这是静态内容，数据变化时不会重新渲染' }}
</div>
```



**2. 初次加载的数据**

如果某些数据只需要在页面加载时渲染一次，而后续的变化不需要更新到视图中，可以使用 `v-once`。

```vue
<div v-once>
  {{ initialMessage }}
</div>
```

即使 `initialMessage` 的值之后发生了变化，DOM 中的内容也不会更新。



**3. 复杂组件的静态部分**

如果组件中有一部分是静态的，可以单独为该部分加上 `v-once`，避免不必要的重新渲染。

```vue
<div>
  <!-- 静态部分 -->
  <header v-once>
    <h1>网站标题</h1>
    <p>这是一个描述性的静态文本。</p>
  </header>

  <!-- 动态部分 -->
  <main>
    <p>动态内容：{{ dynamicMessage }}</p>
  </main>
</div>
```

在这个例子中，`header` 部分不会因 `dynamicMessage` 的变化而重新渲染。

```vue
<ul>
  <li v-for="item in staticList" v-once>{{ item }}</li>
</ul>
```



编译结果：

```js
import { setBlockTracking as _setBlockTracking, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("ul", null, [
    _cache[0] || (
      _setBlockTracking(-1, true),
      (_cache[0] = (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.staticList, (item) => {
        return (_openBlock(), _createElementBlock("li", null, [
          _createTextVNode(_toDisplayString(item), 1 /* TEXT */)
        ]))
      }), 256 /* UNKEYED_FRAGMENT */))).cacheIndex = 0,
      _setBlockTracking(1),
      _cache[0]
    )
  ]))
}

// Check the console for the AST
```



v-once的不足：一旦标记将无法因为任何数据的改变而更新渲染，如果希望针对某些响应式数据变化后，能重新执行，需要借助vue3.2以后的v-memo指令实现。



`v-memo` 是 **Vue 3.2+** 引入的一个指令，主要用于**缓存动态绑定的模板部分**，类似于 React 中的 `memo` 功能。它可以通过条件性依赖优化模板的重新渲染，避免某些部分的重复更新，进而提升性能。

```vue
<div v-memo="[条件依赖表达式]">
  <!-- 模板内容 -->
</div>

<ul>
  <li v-for="item in items" :key="item.id" v-memo="[item.status]">
    {{ item.name }} - {{ item.status }}
  </li>
</ul>
```

参数说明：

- 条件依赖表达式

  ：一个数组，数组中的值用于决定模板是否重新渲染。

  - 如果数组中的所有依赖值都没有变化，`v-memo` 所绑定的模板内容不会重新渲染。
  - 如果依赖值发生变化，模板会重新渲染。

不要滥用 `v-memo`，仅在性能瓶颈场景下使用，因为它会增加一些判断逻辑，可能带来额外开销。

它适用于复杂模板部分、长列表以及动态**但**不频繁变化的数据场景。

与 `v-once` 的区别在于：`v-once` 完全静态化，而 `v-memo` 是动态依赖的缓存优化工具。





## Vue.mixin

mixin 可以用来扩展组件，将公共逻辑进行抽离。在需要该逻辑时进行“混入”，底层采用策略模式针对不同的属性（data,props,component,filter,生命周期函数）进行合并。如果混入的数据和本身组件中的数据冲突，会采用“就近原则“以组件的数据为准。



mixin的混入方式：

- 全局混入，一般用于插件编写
- 局部混入，一般用于多个组件之间，复用公共的逻辑

mixin 的缺陷："命名冲突问题"、"数据来源问题不明确"，Vue3 采用 CompositionAPI 提取公共逻辑非常方便。





**具体的合并策略**：

- 针对data的合并是，合并的结果是一个函数，函数被调用时，内部调用组件自己的data函数和混入的data函数，将两个返回的data进行合并，组件自己data的优先级更高

  ```js
  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    return mergeDataOrFn(parentVal, childVal)
  }
  
  export function mergeDataOrFn(
    parentVal: any,
    childVal: any,
    vm?: Component
  ): Function | null {
    if (!vm) {
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
  
      return function mergedDataFn() {
        return mergeData(
          isFunction(childVal) ? childVal.call(this, this) : childVal,
          isFunction(parentVal) ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn() {
        // instance merge
        const instanceData = isFunction(childVal)
          ? childVal.call(vm, vm)
          : childVal
        const defaultData = isFunction(parentVal)
          ? parentVal.call(vm, vm)
          : parentVal
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }
  ```

- 对生命周期的合并，将同名的生命周期函数放在一个数组中

  ```js
  / hook: "beforeCreate" | "created" | "beforeMount" | "mounted" | "beforeUpdate" | "updated" | "beforeDestroy" | "destroyed" | "activated" | "deactivated" | "errorCaptured" | "serverPrefetch" | "renderTracked" | "renderTriggered"
  LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeLifecycleHook
  })
  
  export function mergeLifecycleHook(
    parentVal: Array<Function> | null,
    childVal: Function | Array<Function> | null
  ): Array<Function> | null {
    const res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : isArray(childVal)
        ? childVal
        : [childVal]
      : parentVal
    return res ? dedupeHooks(res) : res
  }
  
  function dedupeHooks(hooks: any) {
    const res: Array<any> = []
    for (let i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i])
      }
    }
    return res
  }
  ```

- watch也是合并为一个数组

- 针对props，computed，methods，inject的合并

  ```js
  strats.props =
    strats.methods =
    strats.inject =
    strats.computed =
      function (
        parentVal: Object | null,
        childVal: Object | null,
        vm: Component | null,
        key: string
      ): Object | null {
        if (childVal && __DEV__) {
          assertObjectType(key, childVal, vm)
        }
        if (!parentVal) return childVal
        const ret = Object.create(null)
        extend(ret, parentVal)
        if (childVal) extend(ret, childVal)   // 组件自己的覆盖混入的
        return ret
      }
  ```

- 对于指令，组件和过滤器的合并，合并时根据父级创建一个对象作为原型对象`const res = Object.create(parentVal || null)`，然后再将组件自己的赋值到res上

  ```js
  function mergeAssets(
    parentVal: Object | null,
    childVal: Object | null,
    vm: Component | null,
    key: string
  ): Object {
    const res = Object.create(parentVal || null)  
    if (childVal) {
        // 原型链的关系
      __DEV__ && assertObjectType(key, childVal, vm)
      return extend(res, childVal)
    } else {
      return res
    }
  }
  
  const ASSET_TYPES: readonly ["component", "directive", "filter"]
  
  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets
  })
  ```
  
  



源码：

```js
export function initMixin(Vue: GlobalAPI) {
   / 当调用全局的mixin进行合并时，会先将开发者传入的mixin对象和构造函数Vue的options进行合并，等后面创建的时候，又会将组件的option，和组件的mixin和构造函数上的合并过的options进行合并。
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```



```js
export function mergeOptions(
  parent,
  child,
  vm
) {
  if (__DEV__) {
    checkComponents(child)
  }

  if (isFunction(child)) {
    // @ts-expect-error
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
      / 特殊的混入选项extends
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
      / 支持子组件的局部混入
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options: ComponentOptions = {} as any
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  / 这里就是策略模式的体现
  function mergeField(key: any) 
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```





扩展：组件实例上的 mixin和extends

> `mixin` 和 `extends` 都是用于代码复用的机制
>
> **1. 定义与功能**
>
> **Mixin（混入）**
>
> - **作用**：将一组通用的功能提取出来，注入到多个组件中。
>
> - **用法**：通过 `Vue.mixin` 全局混入，或者在组件中通过 `mixins` 局部混入。
>
> - **灵活性**：一个组件可以包含多个 `mixin`。
>
>   ```js
>   const myMixin = {
>     data() {
>       return {
>         message: '来自 mixin 的消息'
>       };
>     },
>     methods: {
>       greet() {
>         console.log('Hello from mixin!');
>       }
>     }
>   };
>                     
>   export default {
>     mixins: [myMixin],  / 局部混入
>     created() {
>       this.greet();
>     }
>   };
>   ```
>
>   
>
>   **Extends（继承）**
>
>   - **作用**：一个组件可以继承另一个组件的选项。
>   - **用法**：通过 `extends` 选项继承单个组件的配置。
>   - **局限性**：一个组件只能 `extends` 一个基类组件。
>
>   ```js
>   const BaseComponent = {
>     data() {
>       return {
>         baseMessage: '来自 BaseComponent 的消息'
>       };
>     },
>     methods: {
>       baseGreet() {
>         console.log('Hello from BaseComponent!');
>       }
>     }
>   };
>   
>   export default {
>     extends: BaseComponent,
>     created() {
>       this.baseGreet();
>     }
>   };
>   ```
>
>   **2. 合并规则**
>
>   **生命周期钩子**
>
>   - **Mixin**：所有混入的生命周期钩子会与组件自身的钩子合并为数组，依次执行（先执行 mixin 中的钩子，后执行组件自己的钩子）。
>   - **Extends**：类似于 mixin，生命周期钩子也会合并为数组，执行顺序是基类的钩子先执行，子类的钩子后执行。
>
>   ```js
>   const myMixin = {
>     created() {
>       console.log('Mixin created');
>     }
>   };
>   
>   const BaseComponent = {
>     created() {
>       console.log('BaseComponent created');
>     }
>   };
>   
>   export default {
>     mixins: [myMixin],
>     extends: BaseComponent,
>     created() {
>       console.log('ChildComponent created');
>     }
>   };
>   
>   // 输出顺序
>   // Mixin created
>   // BaseComponent created
>   // ChildComponent created
>   ```
>
>   **数据（data）**
>
>   - **Mixin**：如果 `data` 中的属性冲突，组件的 `data` 优先级更高，覆盖 mixin 的数据。
>   - **Extends**：同样遵循“子组件优先”的原则，组件自身的 `data` 会覆盖基类的 `data`。
>
>   **方法、计算属性**
>
>   - Mixin 和 Extends 都遵循同样的规则：
>
>     - 如果方法或计算属性名称冲突，组件自身的定义优先级更高，覆盖混入或继承的内容。
>
>       
>
>   **3. 使用场景**
>
>   | **特性**         | **Mixin**                                | **Extends**                     |
>   | ---------------- | ---------------------------------------- | ------------------------------- |
>   | **代码复用粒度** | 粒度更小，可复用具体的功能模块           | 更适合继承整个组件的基础功能    |
>   | **复用数量**     | 一个组件可以包含多个 `mixin`             | 一个组件只能 `extends` 一个基类 |
>   | **灵活性**       | 更灵活，可组合多个 mixin                 | 继承单一父类，结构上更清晰      |
>   | **适用场景**     | 通用功能的共享（如日志、验证、工具方法） | 继承大型组件的基础功能          |
>   | **组合逻辑能力** | 可以混入多个 mixin，适合组合式逻辑       | 不适合复杂组合逻辑              |
>
>   
>
>   组件只能继承一个基类，复用逻辑的能力不如 mixin 灵活。
>
>   父类的变更可能会影响所有继承的子类，需谨慎设计基类组件。



## Vue中slot的实现

vue中插槽的设计借鉴自web components。 在编写组件模板中，使用slot标签来进行占位，同时也可以对slot标签进行命名。在组件使用的时候，组件的标签中间可以写一个内容。在执行的时候，组件内部会根据slot的名字将对应内容分发到对应的slot位置。

`slot` 是 Vue 中的一个功能，用于实现**组件内容分发**，允许在使用组件时向组件插入自定义内容。它提供了一个机制，可以让组件使用者决定部分内容的渲染方式，而不需要修改组件本身的结构。



**定义 slot**

在组件模板中使用 `<slot>` 标签来定义插槽的位置：

```vue
<template>
  <div>
    <slot name='title'></slot> <!-- 插槽位置 -->
    <slot name='footer'>组件底部</slot>
  </div>
</template>
```

编译结果：

```js
function render() {
  with(this) {
    return _c('div', [_t("title"), _t("footer", function () {
      return [_v("组件底部")]
    })], 2)
  }
}
```



**插入内容**

在父组件中使用子组件时，通过在组件标签中插入 HTML 内容：

```vue
<template>
  <MyComponent>
    <p slot='title'>这是插入到 slot 的内容</p>
  </MyComponent>
</template>
```

编译结果：

```js
function render() {
  with(this) {
    return _c('MyComponent', [_c('p', {
      attrs: {
        "slot": "title"
      },
      slot: "title"
    }, [_v("这是插入到 slot 的内容")])])
  }
}
```



Vue 会在渲染组件时，将父组件传递的内容插入到 `<slot>` 定义的位置。



**slot 的分类**

1. 默认插槽（Default Slot）

2. 具名插槽（Named Slot）

   ```vue
   <template>
     <div>
       <slot name="header">默认头部</slot>
       <slot>默认内容  默认插槽</slot>   
       <slot name="footer">默认底部</slot>
     </div>
   </template>
   ```

   使用：

   ```vue
   <MyComponent>
     <template v-slot:header>
       <h1>自定义头部内容</h1>
     </template>
       
     <p>插入到默认插槽的内容</p>
       
     <template v-slot:footer>
       <p>自定义底部内容</p>
     </template>
   </MyComponent>
   ```

3. 作用域插槽（Scoped Slot）

   用于向插槽传递数据，使父组件能够根据子组件提供的数据来渲染内容。

   ```vue
   <template>
     <div>
       <slot :data="info">默认内容</slot>
     </div>
   </template>
   
   <script>
   export default {
     data() {
       return {
         info: { message: "来自子组件的数据" },
       };
     },
   };
   </script>
   ```

   使用：

   ```vue
   <MyComponent v-slot:default="{ data }">
     <p>{{ data.message }}</p> <!-- 显示 "来自子组件的数据" -->
   </MyComponent>
   ```

4. **动态插槽名**

   Vue 2.6+ 提供了动态插槽名功能。

   ```vue
   <MyComponent>
     <template v-slot:[dynamicSlotName]>
       <p>动态插槽内容</p>
     </template>
   </MyComponent>
   
   ```





## 双向数据绑定

双向数据绑定使得**数据模型（Model）**和**视图（View）**之间保持同步。简单来说，当数据发生变化时，视图会自动更新；而当用户操作视图改变输入值时，数据模型也会自动更新。

在 Vue 中，双向数据绑定的典型实现是通过指令 `v-model` 来完成的。（一般用于表单元素）

对v-model并不完全是value + input的语法糖写法，表单控件还有checkbox，它是checked+ change。 

同时事件中还有一些额外的操作，比如中文输入情况下的特殊处理。



**2. 双向数据绑定的工作原理**

**2.1 双向绑定涉及的两个方向**

1. **Model → View（数据驱动视图）** 数据模型更新后，视图会立即反映出变化。这是通过 Vue 的**响应式系统**实现的。
2. **View → Model（视图驱动数据）** 当用户在视图中操作（如输入框输入内容）时，数据模型会立即更新。



**2.2 Vue 中双向绑定的实现机制**

双向绑定的核心是：

- **数据监听（响应式）：** Vue 通过 `Object.defineProperty`（Vue 2）或 `Proxy`（Vue 3）对数据进行劫持，监听数据变化，从而通知视图更新。
- **事件监听：** Vue 会监听 DOM 的事件（如 `input`、`change`），当事件触发时更新绑定的数据。





```vue
<input v-model='name'/>
```

编译结果：

```js
function render() {
  with(this) {
    return _c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (name),
        expression: "name"
      }],
      domProps: {
        "value": (name)
      },
      on: {
        "input": function ($event) {
          if ($event.target.composing) return;  // 针对中文输入的特殊处理
          name = $event.target.value
        }
      }
    })
  }
}
```



v-model指令对应的源码：

```js
const directive = {
  inserted(el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', () => {
          directive.componentUpdated(el, binding, vnode)
        })
      } else {
        setSelected(el, binding, vnode.context)
      }
      el._vOptions = [].map.call(el.options, getValue)
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart)
        el.addEventListener('compositionend', onCompositionEnd)
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd)
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true
        }
      }
    }
  },

  componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context)
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      const prevOptions = el._vOptions
      const curOptions = (el._vOptions = [].map.call(el.options, getValue))
      if (curOptions.some((o, i) => !looseEqual(o, prevOptions[i]))) {
        // trigger change event if
        // no matching option found for at least one value
        const needReset = el.multiple
          ? binding.value.some(v => hasNoMatchingOption(v, curOptions))
          : binding.value !== binding.oldValue &&
            hasNoMatchingOption(binding.value, curOptions)
        if (needReset) {
          trigger(el, 'change')
        }
      }
    }
  }
}
```



对组件使用v-model，vue2和vue3的编译和绑定结果有所不同：

vue2中：

```vue
<my v-model='name'/>
```

编译结果：

```js
function render() {
  with(this) {
    return _c('my', {
      model: {
        value: (name),  
        callback: function ($$v) {  // 源码中会将callback改为input事件名
          name = $$v
        },
        expression: "name"
      }
    })
  }
}
```



vue3的编译结果：

```js
import { resolveComponent as _resolveComponent, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_my = _resolveComponent("my")

  return (_openBlock(), _createBlock(_component_my, {
    modelValue: _ctx.name,
    "onUpdate:modelValue": $event => ((_ctx.name) = $event)
  }, null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"]))
}

// Check the console for the AST
```



vue3中在组件中使用v-model：

```vue
<template>
  <CustomInput v-model="value" />
</template>


<script>
import CustomInput from './CustomInput.vue';

export default {
  components: { CustomInput },
  data() {
    return {
      value: '',
    };
  },
};
</script>
```

**子组件实现**

子组件需要：

1. 定义 `model` 或通过 `props` 接收数据。

2. 触发 `update:modelValue` 事件来通知父组件更新值。

   ```vue
   <template>
     <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
   </template>
   
   <script>
   export default {
     props: ['modelValue'], // Vue 3 使用 modelValue，Vue 2 使用 value
   };
   </script>
   ```

   

![image-20241213235527557](D:\learn-notes\vue\images\image-20241213235527557.png)





## Vue函数组件

函数组件是 Vue 中的一种特殊组件，它通过函数的形式定义，而不是使用传统的对象选项（如 `data`、`methods`、`template` 等）。这种组件通常用于无需维护自身状态或生命周期的场景，能够简化组件的定义，提升渲染性能。



**函数组件的定义方式**

**1. 定义函数组件（使用 Vue 3）**

**方式一：使用 JavaScript 函数**

一个函数组件是一个返回虚拟 DOM（VNode）的函数，函数接收 `props` 参数，并返回 VNode。

```js
// 定义函数组件
const MyFunctionComponent = (props) => {
  return h('div', {}, `Hello, ${props.name}`);
};

// 使用函数组件
const app = Vue.createApp({
  render() {
    return h(MyFunctionComponent, { name: 'Vue' });
  }
});

app.mount('#app');
```

- 解释：
  - 这里，`MyFunctionComponent` 是一个函数，它接受 `props` 参数并返回一个 VNode（使用 Vue 3 的 `h` 函数生成虚拟 DOM）。
  - 在父组件的 `render` 函数中，通过 `h` 函数渲染 `MyFunctionComponent` 并传递 `props`。

**方式二：使用 `defineComponent`**

```js
// 使用 Vue 3 的 `defineComponent` 来定义函数组件
const MyFunctionComponent = Vue.defineComponent({
  props: {
    name: String
  },
  setup(props) {
    return () => h('div', {}, `Hello, ${props.name}`);
  }
});

// 使用组件
const app = Vue.createApp({
  render() {
    return h(MyFunctionComponent, { name: 'Vue' });
  }
});

app.mount('#app');
```

- 解释：
  - `defineComponent` 用于定义一个 Vue 组件，即使它只是一个函数，也能够提供类型推导、自动属性检查等功能。
  - `setup` 函数返回一个渲染函数，返回一个 VNode。



**方式三：在vue2中定义函数式组件**

**1. 使用 `functional: true` 选项**

在 Vue 2 中，定义函数式组件的方式是通过给组件配置对象加上 `functional: true` 选项。这个选项指示 Vue 这是一个函数式组件，并且不会为它创建实例。

```js
// 定义一个函数式组件
Vue.component('MyFunctionalComponent', {
  functional: true,  // 标记为函数式组件
  props: {
    message: String
  },
  render(createElement, context) {
    // `createElement` 用于生成虚拟节点，`context` 包含了 `props` 和 `slots`
    return createElement('div', context.props.message);
  }
});

// 使用函数式组件
new Vue({
  el: '#app',
  template: '<MyFunctionalComponent message="Hello, Vue 2!" />'
});
```

- **`functional: true`**：该选项告诉 Vue 这个组件是函数式的。Vue 会跳过实例的创建，直接调用组件的 `render` 函数来渲染内容。
- **`createElement`**：这个参数是 Vue 的一个内部方法，用于创建虚拟 DOM 节点。你可以使用它生成组件的模板。
- **`context`**：`context` 参数包含了 `props` 和 `slots` 等信息，可以通过它访问传递给组件的数据和插槽内容。

2.5.0以后可以在单文件组件中这样写：

```vue
<template functional>
</template>
```







**. 函数组件的特性**

- **无状态**：函数组件通常没有本地状态。它们只接收 `props`，并通过这些 `props` 来渲染内容。
- **无生命周期钩子**：函数组件没有生命周期钩子，如 `created`、`mounted` 等。它们只是用于展示数据，且通常不具有复杂的逻辑。
- **返回虚拟 DOM**：函数组件通常返回一个 VNode，而不是模板。Vue 3 中使用 `h` 函数来手动生成 VNode。
- **没有this**
- 函数组件不会记录在组件的父子关系中



## Vue中.sync修饰符

`.sync` 修饰符用于简化父子组件之间的双向数据绑定。它本质上是对父组件通过 `props` 传递数据以及子组件通过事件通知数据更新的一种语法糖。

**基本用法**

通常情况下，父组件向子组件传递数据是通过 `props`，而子组件要改变父组件中的数据，通常需要通过 `$emit` 事件通知父组件。

```vue
<!-- 父组件 -->
<template>
  <child-component :value="parentValue" @update:value="parentValue = $event"></child-component>
</template>

<script>
export default {
  data() {
    return {
      parentValue: 'Hello'
    };
  }
};
</script>
```

父组件将 `parentValue` 作为 `value` 传递给子组件，子组件通过 `this.$emit('update:value', newValue)` 通知父组件更新 `parentValue`。

`.sync` 修饰符可以简化这种模式：

```vue
<!-- 父组件 -->
<template>
  <child-component :value.sync="parentValue"></child-component>
</template>

<script>
export default {
  data() {
    return {
      parentValue: 'Hello'
    };
  }
};
</script>

```

在子组件中，需要触发 `update:propName` 事件来通知父组件更新数据。

```vue
<!-- 子组件 -->
<template>
  <input :value="value" @input="updateValue">
</template>

<script>
export default {
  props: ['value'],
  methods: {
    updateValue(event) {
      this.$emit('update:value', event.target.value); // 通知父组件更新
    }
  }
};
</script>
```



`.sync` 的作用可以拆解为以下两部分：

1. **父组件传值**：父组件通过 `props` 将数据传递给子组件。
2. **子组件更新值**：子组件通过 `$emit('update:propName', value)` 通知父组件更新对应的值。
3. 

**注意事项**

1. **单向数据流**：`.sync` 并未打破 Vue 的单向数据流，只是为父子组件之间的交互提供了便捷写法。

2. 替代双向绑定：

   - .sync可以被看作是 Vue 2.x 中 v-model的扩展。

   - 在 Vue 3 中，`v-model` 本身就支持多个绑定。

3. **语法糖限制**：`.sync` 本质上还是依赖 `props` 和 `$emit` 的机制，它并不适用于其他类型的属性。





模板：

```vue
<my :text.sync="app">{{ msg }}</my>
```

编译后的结果：

```js
function render() {
  with(this) {
    return _c('my', {
      attrs: {
        "text": app
      },
      on: {
        "update:text": function ($event) {
          app = $event
        }
      }
    }, [_v(_s(msg))])
  }
}
```

vue3中已经移除了该sync修饰符。





## 组件递归

**Vue 中的组件递归**

组件递归是指一个组件在其模板中引用自身，从而形成一个递归调用的行为。通常用于处理一些层级结构的数据，比如树形结构、嵌套菜单、评论嵌套等场景。



**组件递归的基本原理**

在 Vue 中，一个组件可以在其模板中通过自身的名字调用自身，但需要确保递归调用中有明确的终止条件，否则会导致无限递归，最终报错或造成浏览器卡死。



**递归组件的实现步骤**

1. **注册组件**
   确保组件可以通过名字引用自身。
2. **设计终止条件**
   使用 `props` 或条件语句（如 `v-if`）来判断是否需要递归调用，避免无限递归。
3. **在模板中递归调用自身**
   在模板中，通过组件的名字直接引用组件自身。
4. 

**示例：递归实现一个简单的树形组件**

假设需要渲染一个树形结构的数据：

**树形组件代码**

**TreeNode.vue**

```vue
<template>
  <ul>
    <li>
      {{ node.name }}
      <!-- 如果有子节点，直接递归渲染 -->
      <ul v-if="node.children">
        <tree-node 
          v-for="(child, index) in node.children" 
          :key="index" 
          :node="child" 
        />
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TreeNode', // 必须为组件命名，以便递归调用
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
};
</script>
```

**App.vue**

```vue
<template>
  <div>
    <h1>Tree Structure</h1>
      <template v-for="(node, index) in treeData">
          <tree-node :key="index" :node="node"></tree-node>
		</template>
  </div>
</template>

<script>
import TreeNode from './TreeNode.vue';

export default {
  components: {
    TreeNode,
  },
  data() {
    return {
      treeData: [
        {
          name: 'Node 1',
          children: [
            { name: 'Node 1.1' },
            { 
              name: 'Node 1.2',
              children: [
                { name: 'Node 1.2.1' },
                { name: 'Node 1.2.2' }
              ]
            }
          ]
        },
        {
          name: 'Node 2',
          children: [
            { name: 'Node 2.1' },
            { name: 'Node 2.2' }
          ]
        }
      ]
    };
  }
};
</script>
```

------

**递归的注意事项**

1. **组件名称必须存在**
   如果是局部注册的组件，`name` 属性必须和局部注册的名称一致，以便递归时正确调用自身。
2. **终止条件很重要**
   确保有合适的终止条件（如 `v-if` 或空数据判断），否则会进入无限递归，导致性能问题或应用崩溃。
3. **避免复杂的递归逻辑**
   递归的组件代码应尽可能简单明了，过于复杂的逻辑可能难以维护。

------

**使用场景**

- **树形结构**：如文件目录、组织架构图。
- **嵌套评论**：评论下回复的递归显示。
- **嵌套菜单**：多层级的菜单结构。

递归组件是 Vue 的一个灵活功能，用于简化处理层级数据的复杂逻辑。如果合理使用，能让代码更简洁易读。



### 使用jsx来渲染递归模板

在 Vue 中可以使用 JSX 来实现递归组件。Vue 支持 JSX（需要安装相关的 Babel 插件），它可以让组件的渲染逻辑更加清晰和灵活。

下面是如何用 JSX 来实现递归组件的写法。

### 配置 JSX 支持

如果你使用的是 Vue CLI 项目，可以安装 `@vue/babel-plugin-jsx`：

```bash
npm install @vue/babel-plugin-jsx --save-dev
```

在 `babel.config.js` 中添加插件：

```js
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: ['@vue/babel-plugin-jsx']
};
```

用 JSX 来实现树形结构递归组件的完整示例：

TreeNode.jsx

```jsx
export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  render() {
    const { node } = this;

    return (
      <ul>
        <li>
          {node.name}
          {/* 如果有子节点，递归调用自身 */}
          {node.children && node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </li>
      </ul>
    );
  },
};

```

使用：

```vue
<template>
  <div id="app">
    <h1>Tree Structure with JSX</h1>
    <TreeNode v-for="(node, index) in treeData" :key="index" :node="node" />
  </div>
</template>

<script>
import TreeNode from './TreeNode.jsx';

export default {
  name: 'App',
  components: {
    TreeNode,
  },
  data() {
    return {
      treeData: [
        {
          name: 'Node 1',
          children: [
            { name: 'Node 1.1' },
            {
              name: 'Node 1.2',
              children: [
                { name: 'Node 1.2.1' },
                { name: 'Node 1.2.2' },
              ],
            },
          ],
        },
        {
          name: 'Node 2',
          children: [
            { name: 'Node 2.1' },
            { name: 'Node 2.2' },
          ],
        },
      ],
    };
  },
};
</script>
```



递归菜单编写：

```jsx
export default {
    props:{
        data:{
            type:Array,
            default:()=>{}
        }
    },
    render(){
        let renderChildren = (data)=>{
            return data.map((child)=>{
                return child.children?(
                    <elSubmenu>
                        <div slot='title'>{child.title}</div>
                        {renderChildren(child.children)}
                    </elSubmenu>
                ):(
                	<elMenuItem>
                        {child.title}
                    </elMenuItem>
                )
            })
        }
        return <elMenu>{renderChildren(data)}</elMenu>
    }
}
```



## Vue组件中的name选项的作用

`name` 选项用于给组件指定一个名称，它不是必需的，以下是 `name` 选项的主要作用和使用场景：

1. 递归组件中使用，在递归组件中，组件需要引用自身。如果没有 `name`，组件无法在模板中调用自身。

2. 调试时组件名称显示，当开发者在 Vue DevTools 中查看组件树时，`name` 会用作组件的标识名称。

3. 异步组件加载，当以异步方式定义组件时，可以使用 `name` 来给组件设置标识，便于调试和错误处理。

   ```js
   const AsyncComponent = () =>
     import(/* webpackChunkName: "my-component" */ './MyComponent.vue').then(module => {
       module.default.name = 'MyComponent';
       return module;
     });
   
   ```

4. 路由组件的 `keep-alive` 配合，当使用 `keep-alive` 包裹组件时，可以通过 `name` 指定哪些组件需要缓存。

   `keep-alive` 的 `include` 或 `exclude` 选项会匹配组件的 `name` 属性：

   ```vue
   <keep-alive include="MyViewComponent">
     <router-view></router-view>
   </keep-alive>
   ```

5.  动态组件渲染

   `<component :is="name" />` 动态加载组件时，`name` 也是一个关键属性。

   ```vue
   <template>
     <component :is="currentComponent"></component>
   </template>
   
   <script>
   export default {
     name: 'MyDynamicComponent',
     data() {
       return {
         currentComponent: 'MyOtherComponent',
       };
     },
   };
   </script>
   
   ```

6. 方便父组件通过$children中子组件的名字查找到对应的组件





## Vue中常见的修饰符

在 Vue 中，修饰符（modifiers）是以点 (`.`) 开头的特殊标记，用于为指令 (`v-on`, `v-bind` 等) 添加特定的行为。简化代码逻辑，提高代码的可读性和灵活性。

**事件修饰符**

- `.stop` 阻止事件冒泡

- `.prevent` 阻止默认事件

- `.capture` 使用捕获模式

- `.self` 限制事件仅在自身触发

- `.once` 事件只触发一次

- `.passive` 提高滚动性能

- `.native` 在 Vue 2 中，`.native` 修饰符用于在 **子组件的根元素** 上监听原生 DOM 事件。通常情况下，事件监听是通过子组件的 `$emit` 方法触发的，但是有时候需要直接监听子组件根元素的原生事件，这时可以使用 `.native` 修饰符。

  `.native` 修饰符主要用于以下场景：

  1. 需要监听子组件根元素的原生事件，例如 `click`, `focus`, `blur` 等，而不是通过 `$emit` 触发的自定义事件。
  2. 无法直接修改子组件代码，但需要在父组件中监听其根元素的事件。

  使用注意

  1. .native 只作用于子组件的 根元素。
     - 如果子组件的模板中没有根元素或根元素包含多个节点（如 Vue 3 的多个根元素支持），`.native` 将失效。
  2. Vue 3 中不再推荐使用 `.native`：
     - Vue 3 支持在父组件中直接监听子组件的原生 DOM 事件，无需 `.native`。
     - 替代方法：可以通过 `v-on` 的 `modifiers` 和 `emits` 自定义实现事件监听。



**表单修饰符**

- `.lazy` 延迟更新，输入框数据仅在 `change` 事件后更新，而不是 `input` 事件。
- `.number` 自动转换为数字
- `.trim` 自动去除空格



**键修饰符**

- `.enter` 按下回车键
- `.esc` 按下 Esc 键
- `.space` 按下空格键
- `.ctrl` / `.shift` / `.alt` / `.meta` 修饰符



**鼠标修饰符**

- `.left` 左键点击
- `.right` 右键点击
- `.middle` 中键点击





## Vue中自定义指令

Vue 提供了自定义指令的功能，允许开发者扩展 HTML 元素的功能，以实现**复杂的逻辑或特殊的 DOM 操作**。

在 Vue 中，自定义指令通过 `Vue.directive` 全局注册，或通过组件的 `directives` 选项局部注册。



**全局指令**

```js
// 注册一个全局的自定义指令
Vue.directive('focus', {
  // 当绑定的元素插入到 DOM 中时触发
  inserted(el) {
    el.focus(); // 元素自动获取焦点
  },
});
```



**局部指令**

```js
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus(); // 元素自动获取焦点
      },
    },
  },
};
```



自定义指令有一组生命周期钩子函数，可以分别在不同阶段触发。

| 钩子函数           | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `bind`             | 指令第一次绑定到元素时调用，仅执行一次。                     |
| `inserted`         | 指令绑定的元素插入到父节点时调用（确保元素已插入父结点中，不能保证节点已经在页面中）。 |
| `update`           | 元素所在的模板更新时调用（可能会多次触发，不包括子组件更新）。 |
| `componentUpdated` | 元素及其子组件全部更新完成后调用。                           |
| `unbind`           | 指令与元素解绑时调用，仅执行一次。                           |



**指令传参**

可以通过 `binding` 对象获取指令的值、参数或修饰符。

如果指令需要接收动态参数，可以使用 `binding.arg`。

修饰符会以对象形式存在于 `binding.modifiers` 中。

```js
Vue.directive('color', {
  bind(el, binding) {
    el.style.color = binding.value; // 使用指令传递的值
  },
});

/ 如果指令需要接收动态参数，可以使用 binding.arg。
Vue.directive('style', {
  bind(el, binding) {
    el.style[binding.arg] = binding.value; // 动态设置样式属性
  },
});


```

```vue
<template>
  <p v-style:color="'blue'">蓝色文字</p>
</template>
```





```js
Vue.directive('resize', {
  bind(el, binding) {
    if (binding.modifiers.debounce) {
      console.log('启用防抖功能');
    }
  },
});
```



```vue
<template>
  <div v-resize.debounce>调整大小</div>
</template>
```



**Vue 3 的指令生命周期变化**

| Vue 2 钩子         | Vue 3 对应钩子  |
| ------------------ | --------------- |
| `bind`             | `created`       |
| `inserted`         | `mounted`       |
| `update`           | `updated`       |
| `componentUpdated` | `beforeUpdate`  |
| `unbind`           | `beforeUnmount` |



### **常见指令**

####  **实现拖拽指令**

```js
Vue.directive('draggable', {
  bind(el) {
    el.style.position = 'absolute';
    el.onmousedown = function (e) {
      const offsetX = e.clientX - el.offsetLeft;
      const offsetY = e.clientY - el.offsetTop;

      document.onmousemove = function (e) {
        el.style.left = e.clientX - offsetX + 'px';
        el.style.top = e.clientY - offsetY + 'px';
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
});


// vue3版本
const lazyLoadDirective = {
  mounted(el, binding) {
    const loadImage = () => {
      el.src = binding.value;
      observer.unobserve(el);
    };

    const handleError = () => {
      el.src = 'https://via.placeholder.com/150';
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadImage();
      }
    });

    el.src = 'https://via.placeholder.com/10';
    el.addEventListener('error', handleError);
    observer.observe(el);
  },

  unmounted(el) {
    el.removeEventListener('error');
  },
};

export default lazyLoadDirective;
```





#### **防抖指令**

```js
Vue.directive('debounce', {
  bind(el, binding) {
    let timer;
    el.addEventListener('click', () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        binding.value();
      }, 500);
    });
  },
});
```



#### **图片懒加载指令**

原理

1. 使用原生的 `IntersectionObserver` API 检测图片是否进入可视区域。
2. 当图片进入可视区域时，将真实图片地址设置到 `img` 的 `src` 属性，从而触发加载。
3. 当图片未进入可视区域时，不加载图片，优化页面性能。

```js
Vue.directive('lazyload', {
  mounted(el, binding) {
    const loadImage = () => {
      el.src = binding.value; // 设置图片真实地址
      observer.unobserve(el); // 加载完成后取消监听
    };

    const handleError = () => {
      el.src = 'https://via.placeholder.com/150'; // 提供一个默认占位图
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadImage();
      }
    });

    el.src = 'https://via.placeholder.com/10'; // 设置默认占位图
    el.addEventListener('error', handleError); // 图片加载错误时的回调
    observer.observe(el); // 开始监听
  },

  unmounted(el) {
    el.removeEventListener('error'); // 清理事件监听
  },
});

```



```vue
<img v-lazyload="'https://example.com/image1.jpg'" alt="Lazy Image 1" />
```



#### **按钮权限指令**

可以利用 Vue 的自定义指令来实现按钮权限的动态控制，根据用户权限移除或禁用某些操作按钮。

权限控制的实现思路

1. **用户权限**：通常由后端返回，存储在 Vuex、Pinia、LocalStorage 或其他状态管理工具中。
2. 指令逻辑：判断用户是否有对应权限：
   - 如果没有权限，则移除按钮元素。
   - 或者直接禁用按钮，显示提示。
3. **动态更新**：权限可能会动态变化，需要在权限更新时重新判断。



```js
Vue.directive('permission', {
  mounted(el, binding) {
    // 用户的权限列表
    const userPermissions = ['view', 'edit']; // 这个数据应该来自 Vuex 或后端接口

    // 检查权限
    const hasPermission = userPermissions.includes(binding.value);

    if (!hasPermission) {
      // 没有权限时移除按钮
      el.parentNode && el.parentNode.removeChild(el);
    }
  },
});
```



```vue
<!-- 用户需要 "edit" 权限才能看到按钮 -->
<button v-permission="'edit'">编辑</button>
```



如果需要更多的灵活性，比如禁用按钮而不是移除，或者动态判断权限，可以增强指令的功能。

```js
Vue.directive('permission', {
  mounted(el, binding) {
    const userPermissions = ['view', 'edit']; // 示例用户权限
    const hasPermission = userPermissions.includes(binding.value);

    if (!hasPermission) {
      // 如果需要禁用按钮而不是移除
      if (binding.modifiers.disabled) {
        el.disabled = true; // 禁用按钮
        el.style.cursor = 'not-allowed'; // 改变鼠标样式
        el.title = '您没有此操作的权限'; // 提示信息
      } else {
        // 默认移除按钮
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  },
});
```



```vue
  <!-- 需要 "edit" 权限，否则移除 -->
    <button v-permission="'edit'">编辑</button>

    <!-- 需要 "delete" 权限，否则禁用 -->
    <button v-permission.disabled="'delete'">删除</button>
```





```js
import store from '@/store'; // 假设权限存储在 Vuex 中

const permissionDirective = {
  mounted(el, binding) {
    const checkPermission = () => {
      const userPermissions = store.state.user.permissions;
      const hasPermission = userPermissions.includes(binding.value);

      if (!hasPermission) {
        if (binding.modifiers.disabled) {
          el.disabled = true;
          el.style.cursor = 'not-allowed';
          el.title = '您没有此操作的权限';
        } else {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    };

    // 初次检查权限
    checkPermission();

    // 监听权限变化
    store.subscribe(() => {
      checkPermission();
    });
  },
};

export default permissionDirective;

```

第三方库：vue-directive-permission



#### **v-click-outside指令**

用于监听点击事件并判断点击是否发生在某个元素外部。通常用于实现关闭弹窗、下拉菜单等功能，当用户点击外部区域时触发相关操作。

实现思路

1. **点击外部检测**：通过监听 `mousedown` 或 `click` 事件，判断点击目标是否为当前元素的子元素或当前元素本身。

2. **事件处理**：如果点击发生在元素外部，则触发指定的回调函数。

   

```js
Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    // 事件处理函数
    const handler = (event) => {
      // 判断点击是否发生在元素外部
      if (!el.contains(event.target)) {
        // 如果存在绑定的回调函数，执行它
        binding.value(event);
          
        // let methodName = binding.expression 
        // vnode.context[methodName]()
      }
    };

    // 将事件处理函数绑定到文档上
    el._clickOutsideHandler = handler;
    document.addEventListener('click', handler);
  },

  unbind(el) {
    // 解绑事件
    document.removeEventListener('click', el._clickOutsideHandler);
    delete el._clickOutsideHandler;
  },
});

```



使用：

```vue
<template>
  <div>
    <div v-click-outside="handleClickOutside">
      <button>点击我</button>
    </div>
    <div v-if="isVisible">
      <p>这是一个弹窗，点击外部将关闭它。</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    handleClickOutside() {
      this.isVisible = false; // 点击外部时，关闭弹窗
    },
  },
};
</script>
```



![image-20241214162504071](D:\learn-notes\vue\images\image-20241214162504071.png)



## vue中nextTick的理解

`nextTick` 是一个常用的方法，用于在 DOM 更新之后执行某些操作。因为 Vue 的响应式系统是异步的，当你更新数据时，DOM 不会立即更新（会生成一个任务放到一个队列中），而是会在下一个事件循环中取出更新任务执行。这时候，如果你需要在 DOM 更新完成后执行某些操作（如操作 DOM 元素），就可以使用 `nextTick`。

vue中视图更新是一个异步的任务，因为如果在某个函数执行栈中，多次对响应式数据进行修改，如果每一次修改都触发一次页面的更新，那么这样会造成性能损耗。  如果用户多次修改数据，先开启一个渲染更新任务入队，等到本轮事件循环结束后，在微任务队列或者下一个事件循环中去除渲染更新任务执行。

vue中渲染更新任务也是依赖于底层的nextTick工具方法的。如果要在DOM元素更新后在做一些有关dom的操作就可以将自己的任务在同一个执行上下文中，通过nextTick方法来向队列尾部追加自己的任务即可。

多次调用nextTick注册的任务并不会针对每一个任务创建一个异步任务，而是会合并这些任务函数。

**使用场景**

1. **获取更新后的 DOM**：当修改数据后，想立即操作 DOM，使用 `nextTick` 确保 DOM 已经完成更新。
2. **保证任务顺序**：在 Vue 异步更新 DOM 时确保任务按顺序执行。
3. **插件或复杂逻辑中需要 DOM 状态完成**的场景。





当组件的响应式数据发什么变化，会触发底层包装一个渲染更新的函数，然后将这个函数交给nextTick进行注册。nextTick会将这个渲染函数入队到一个自己准备的队列中，然后通过优雅降级的方式，触发一个异步回调，首先是promise或者MutationObserver，如果再不支持就是setImmediate，最后再不支持就是setTimeout。



源码：

```ts
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

/ 从这里就可以看出nextTick并不是为每个任务都注册一个异步回调，而是在一个异步任务中，一次去除所有之前注册的任务，依次进行执行。
function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc
// 采用优雅剪辑的方式注册异步回调
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)  // 尝试通过promise注册一个异步微任务
  }
  isUsingMicroTask = true
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {

  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
    // 尝试通过MutationObserver注册一个异步微任务
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
 // 尝试通过setImmediate注册一个异步宏任务
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // 尝试通过setTimeout注册一个异步宏任务
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(): Promise<void>
export function nextTick<T>(this: T, cb: (this: T, ...args: any[]) => any): void
export function nextTick<T>(cb: (this: T, ...args: any[]) => any, ctx: T): void
export function nextTick(cb?: (...args: any[]) => any, ctx?: object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e: any) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()  // 这里就会尝试开启一个异步任务
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```



nextTick测试代码：

```vue
<template>
	<div id='counter'>
        {{count}}
    </div>
</template>
<script>
	export default {
        name:'App',
        data(){
            return {count:0}
        },
        mounted(){
             this.$nextTick(()=>{
                console.log(counter.innerHTML)  / 打印 0
            })
            this.count =100
            this.$nextTick(()=>{
                console.log(counter.innerHTML)  / 打印100
            })
        }
    }
</script>
```

前后打印不同的原因：前面调用nextTick会将那个函数入队，并开启一个异步回调任务。响应式数据修改后，底层会包装一个组件的watcher渲染任务，然后使用nextTick将这个任务函数追加到队列的后面，第二个nextTick调用的使用，会将该注册的回调函数继续入队。

主执行栈的任务执行完毕，开始执行nextTick注册的微任务，微任务就是将上面准备的队列中的一项项的任务按照先后顺序取出执行。所以第一个任务打印时，innerHTML还没有更新，第二个渲染任务是同步阻塞的，执行完后innerHTML就已经更新为100了，所以第三个任务再去访问innerHTML就拿到更新后的100。





### Vue3中的nextTick

vue3中的nextTick就很简单了。就是注册一个异步的微任务，没有什么批处理逻辑了。以下是源码：

```js
const resolvedPromise = Promsie.resolve()

export function nextTick(fn){
    const p = currentFlushPromise || resolvedPromise
    return fn ? p.then(fn):p
}
```





## keep-alive

`keep-alive` 是一个内置组件，用于缓存动态组件(缓存的是组件对应的实例，而实例上有一个属性存放着组件对应的真实DOM树，以便下次组件切换激活时，复用这个实例以及上面的真实DOM树)，以优化性能和提升用户体验。通过使用 `keep-alive`，可以在组件切换时保存组件的状态，避免重复渲染和销毁。



**使用场景**

1. **路由页面**：在多页面表单中切换页面时（router-view），保留每个页面的输入数据。
2. **动态组件切换**：在多个选项卡间切换时，保留每个选项卡的状态（比如滚动位置、数据等）。
3. **性能优化**：避免频繁地创建和销毁组件，特别是在组件渲染开销较大的情况下。



**使用**

```vue
<template>
  <keep-alive>
    <component :is="currentView"></component>
  </keep-alive>
</template>

<script>
export default {
  data() {
    return {
      currentView: 'ViewA', // 当前显示的组件
    };
  },
  components: {
    ViewA: {
      template: '<div>View A</div>',
    },
    ViewB: {
      template: '<div>View B</div>',
    },
  },
};
</script>
```

通过动态组件 `<component :is="currentView">` 实现组件切换，配合 `keep-alive` 可以缓存组件状态。





```vue
<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>
```

也可以通过meta属性来指定哪些页面需要缓存，哪些页面不需要缓存。

```vue
<template>
	<div id='app'>
    <keep-alive>
        <router-view v-if='$route.meta.keepAlive'></router-view>
    </keep-alive>
    <router-view v-if='$route.meta.keepAlive'></router-view>
   </div>
</template>
```



**配置属性**

`keep-alive` 还提供了以下几个配置属性，用于控制缓存行为：

1. `include` 和 `exclude`

- **作用**：指定哪些组件需要被缓存或不需要被缓存，值是组件的名字组成的数组。
- 用法：
  - `include`：缓存的组件名（可以是字符串、正则表达式或数组）。
  - `exclude`：不缓存的组件名（可以是字符串、正则表达式或数组）。

```vue
<keep-alive include="ViewA">
  <component :is="currentView"></component>
</keep-alive>
```



```vue
<keep-alive :exclude="['ViewB']">
  <component :is="currentView"></component>
</keep-alive>
```



2. `max`

- **作用**：指定最多可以缓存的组件实例数量。超出数量时，旧的实例会被销毁。

```vue
<keep-alive :max="2">
  <component :is="currentView"></component>
</keep-alive>
```



**生命周期钩子**

当组件被 `keep-alive` 缓存时，它会新增两个特殊的生命周期钩子：

- **`activated`**：当组件被激活（从缓存中恢复）时触发。
- **`deactivated`**：当组件被缓存（进入缓存状态）时触发。



```vue
<template>
  <div>组件内容</div>
</template>

<script>
export default {
  activated() {
    console.log('组件被激活');
  },
  deactivated() {
    console.log('组件被缓存');
  },
};
</script>
```



**注意事项**

1. `keep-alive` 只对**动态组件**有效，例如通过 `<component>` 或路由切换加载的组件。
2. 需要注意内存泄漏风险，尤其是长时间运行的应用中，应合理设置缓存的数量或条件。
3. 如果组件缓存后有依赖外部更新数据的需求，可以配合 `activated` 钩子处理。





**vue2中keep-alive的原理**

源码：

```ts
export default {
  name: 'keep-alive',
  abstract: true,   // 本组件不会记录到父子关系中

  // 组件接受的属性
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  methods: {
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache
        // 这里可以看出缓存的具体结构
        cache[keyToCache] = {
          name: _getComponentName(componentOptions),
          tag,
          componentInstance  // 组件对应的实例
        }
        keys.push(keyToCache)
        // prune oldest entry
          // 校验是否达到最大缓存数量
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        this.vnodeToCache = null
      }
    }
  },
  // 第一步
  created() {
    this.cache = Object.create(null)  // 创建一个缓存列表，存放组件的名字喝对应的实例
    this.keys = []  // 用于记录缓存过哪些组件
  },
    
    // 第二步 ，keep-alive和组件重新渲染时
      render() {
    const slot = this.$slots.default // 拿到默认插槽组件
    const vnode = getFirstComponentChild(slot)  // 默认读取插槽中的第一个组件，如果第一个子节点不是组件而是普通的dom标签
    const componentOptions = vnode && vnode.componentOptions  // 如果第一个子节点不是组件标签，因为组件才有componentOptions选项
    
     // 如果插槽中的第一个子节点不是组件，会直接返回，没有任何缓存效果
    if (componentOptions) {
      // check pattern
        // 拿到组件名字
      const name = _getComponentName(componentOptions)
      
      / 根据组件名字判断是否在白名单或者黑名单中，不满足就直接返回，也没有任何缓存效果
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

        // 拿到created生命周期函数中创建的属性
      const { cache, keys } = this
      const key =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key  // 被缓存组件的名字，默认自己生成或者用key指代
      
      // 映射表中是否缓存过该组件
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // delay setting the cache until update
        this.vnodeToCache = vnode
        this.keyToCache = key
      }

      // @ts-expect-error can vnode.data can be undefined
      vnode.data.keepAlive = true  // 标记该组件是被缓存的组件，组件在被重新激活时的初始化中要用到这个属性去判断，避免重新初始化组件
    }
          
    // 如果插槽中的第一个子节点不是组件，会直接返回
    return vnode || (slot && slot[0])
  },
    
  updated() {
    this.cacheVNode()
  },

  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted() {
    this.cacheVNode()  // 缓存虚拟节点
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
}

```

当一个组件从失活状态被激活的时候会重新走keep-alive组件的render方法，走到其中的以下分支：

```js
if (cache[key]) {
    vnode.componentInstance = cache[key].componentInstance  // 重用组件实例达到缓存效果， 在组件的init阶段会直接复用组件实例上对应的组件真实DOM树
    // make current key freshest
    remove(keys, key)  // 使用最近最久未使用算法更新缓存列表
    keys.push(key)
}
```





```ts
const componentVNodeHooks = {
  init(vnode: VNodeWithData, hydrating: boolean): boolean | void {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive   // 上面已经标识好的keep-alive组件后就不走else分支组件的挂载逻辑了，也就没有组件的后续一些列的生命周期函数的执行了
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ))
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
}
```

也意味着激活组件后，如果组件中的数据有变，但是因为是复用的之前的组件对应的真实DOM树，所以页面也并不会体现出最新的数据变化结果。



问题：keep-alive缓存的组件中有数据更新了，组件激活后是无法体现的。

当 `keep-alive` 缓存的组件中数据更新时，组件的状态是保持在缓存中的。**如果缓存的组件在未激活状态下外部数据发生了变化，激活后可能不会自动更新。**这是因为组件被缓存后不会重新渲染，只会恢复缓存时的状态。

以下是几种解决方法，帮助确保缓存组件能够反映外部数据的更新：

1. **使用 `activated` 钩子**

   在组件激活时（`activated` 生命周期钩子），手动触发数据更新逻辑。例如，重新获取外部数据或更新内部状态。

   ```vue
   <template>
     <div>
       <p>数据：{{ data }}</p>
     </div>
   </template>
   
   <script>
   export default {
     data() {
       return {
         data: null,
       };
     },
     activated() {
       this.fetchData(); // 在组件激活时获取最新数据
     },
     methods: {
       fetchData() {
         // 模拟数据更新
         this.data = '最新数据 ' + new Date().toLocaleTimeString();
       },
     },
   };
   </script>
   ```

   > **适用场景**：需要动态更新数据，例如从 API 获取最新数据。

2. **通过 Vue 的响应式系统监听外部数据**

   如果组件依赖的外部数据是响应式的，当外部数据变化时自动更新。例如，通过 `props` 传递数据或使用全局状态管理工具（如 Vuex、Pinia）。

   ```vue
   <template>
     <div>
       <p>父组件数据：{{ parentData }}</p>
     </div>
   </template>
   
   <script>
   export default {
     props: ['parentData'], // 外部数据通过 props 传递
     watch: {
       parentData(newVal) {
         console.log('父组件数据更新:', newVal);
       },
     },
   };
   </script>
   
   ```

   在父组件中传递数据：

   ```vue
   <template>
     <keep-alive>
       <ChildComponent :parentData="sharedData" />
     </keep-alive>
   </template>
   
   <script>
   import ChildComponent from './ChildComponent.vue';
   
   export default {
     components: { ChildComponent },
     data() {
       return {
         sharedData: '初始数据',
       };
     },
     mounted() {
       setTimeout(() => {
         this.sharedData = '更新后的数据'; // 模拟外部数据变化
       }, 2000);
     },
   };
   </script>
   ```

3. **使用全局事件总线或订阅发布模式**

   在外部数据变化时，通过事件总线通知缓存的组件更新数据。

   ```js
   // 事件总线（eventBus.js）
   import Vue from 'vue';
   export const EventBus = new Vue();
   ```

   在父组件中触发事件：

   ```js
   import { EventBus } from './eventBus';
   
   EventBus.$emit('update-data', '新的数据');
   ```

   在子组件中监听事件：

   ```vue
   <script>
   import { EventBus } from './eventBus';
   
   export default {
     data() {
       return {
         data: '',
       };
     },
     activated() {
       EventBus.$on('update-data', (newData) => {
         this.data = newData; // 接收外部更新的数据
       });
     },
     deactivated() {
       EventBus.$off('update-data'); // 避免重复注册监听器
     },
   };
   </script>
   ```

4. **强制重新渲染组件**

   通过为动态组件添加唯一的 `key` 属性，确保组件在激活时重新渲染。

   ```vue
   <template>
     <keep-alive>
       <component :is="currentView" :key="currentViewKey"></component>
     </keep-alive>
   </template>
   
   <script>
   export default {
     data() {
       return {
         currentView: 'MyComponent',
         currentViewKey: 0, // 通过 key 强制刷新
       };
     },
     methods: {
       refreshComponent() {
         this.currentViewKey++; // 改变 key 值
       },
     },
   };
   </script>
   ```

5. 通过路由守卫函数解决

   通过路由守卫的生命周期函数，可以有效解决 `keep-alive` 缓存组件无法自动反映外部数据变化的问题。具体方案是利用路由守卫在路由切换时触发的钩子，配合 `keep-alive` 的 `activated` 钩子，主动更新或刷新组件中的数据。

   **核心思路**

   1. **在路由守卫中监听路由的进入和离开**：例如使用 `beforeRouteEnter` 或全局路由守卫。

      #### 1. 使用 `beforeRouteEnter` 钩子加载数据

      在组件的 `beforeRouteEnter` 钩子中，加载最新的数据。当路由进入后，通过 `next` 回调访问组件实例，调用组件的更新方法。

      ```vue
      <template>
        <div>
          <p>当前数据：{{ data }}</p>
          <button @click="refreshData">手动刷新数据</button>
        </div>
      </template>
      
      <script>
      export default {
        data() {
          return {
            data: null,
          };
        },
        methods: {
          async refreshData() {
            // 模拟异步获取最新数据
            this.data = '更新后的数据：' + new Date().toLocaleTimeString();
          },
        },
        beforeRouteEnter(to, from, next) {
          // 在路由进入前加载数据
          next((vm) => {
            vm.refreshData(); // 进入路由后调用组件的更新方法
          });
        },
      };
      </script>
      ```

      全局路由守卫适用于需要对多个路由的组件进行统一数据更新的场景。

      ```js
      import Vue from 'vue';
      import Router from 'vue-router';
      
      Vue.use(Router);
      
      const router = new Router({
        routes: [
          {
            path: '/example',
            component: () => import('./ExampleComponent.vue'),
          },
        ],
      });
      
      router.beforeEach((to, from, next) => {
        if (to.path === '/example') {
          console.log('进入路由 /example，准备更新数据');
          // 你可以在这里触发全局的状态管理更新，例如 Vuex。
        }
        next();
      });
      
      export default router;
      ```

      





## Vue源码中使用到的设计模式

有哪些模式，每个模式的作用。

- 单例模式，代表就是vuex中的store
- 工厂模式，典型的createElement方法创建虚拟DOM节点
- 发布订阅模式，vue的事件绑定和触发，eventbus（发布和订阅都是手动的）
- 观察者模式，wathcer和dep之间的关系
- 代理模式
- 装饰器模式
- 中介者模式，vuex
- 策略模式，mixin中就使用到，替换ifelse
- 外观模式





## 在vue中做性能优化

- 数据层架不宜过深，因为vue2中的defineProperty需要递归属性，增加getter和setter
- 合理设置响应式数据，如果还需要放在data中但是不需要响应式的能力，可以通过object.freeze方法进行冻结
- 不要直接频繁操作data中的数据，而是先取出来拷贝值再操作，然后再回写操作后的数据
- 合理的设置key属性
- v-show和v-if合理选择
- 控制好组件的颗粒度，因为vue是组件级更新
- 为了减少主包体积，可以多写异步组件
- 使用keep-alive缓存组件
- 合理使用v-once，v-memo
- 虚拟滚动列表，事件分片等



## 单页应用首屏加载优化

- 使用路由懒加载、异步组件，实现组件拆分，减少入口文件体积大小(优化体验骨架屏
- 抽离公共代码，采用 splitChunks 进行代码分割。
- 组件加载采用按需加载的方式。
- 静态资源缓存，采用 HTTP 缓存(强制缓存、对比缓存)、使用localStorage 实现缓存资源。
- 图片资源的压缩，雪碧图、对小图片进行 base64 减少 http 请求。
- 打包时开启 gzip 压缩处理 compression-webpack-plugin 插件
- 静态资源采用 CDN 提速。
- 使用 SSR 对首屏做服务端渲染。





## Vue项目中的跨域

跨域是浏览器同源策略导致的，这个是浏览器的行为(协议、主机名、端口的不同都会导致跨域问题)。服务端和服务端之间进行通信是没有跨域问题的。跨域的实现方案常用的几种：

- CORS(Cross-Origin Resource Sharing，跨域资源共享) 由服务端设置，允许指定的客户端访问服务器。
- 构建工具中设置反向代理、使用 Nginx 做反向代理.
- 使用 Websocket 进行通信。
- 搭建 BFF(Backend For Frontend)层解决跨域问题。



## 项目中封装axios

具体封装axios的哪些方面的功能。

- 设置请求超时时间
- 根据项目环境动态的设置请求后端的路径
- 设置统一的请求拦截，自动添加token请求头等
- 设置统一的相应拦截，对响应的状态码和数据进行格式化
- 增加请求队列，实现配置化的loading
- 维护取消请求的token列表，切换页面时，通过导航守卫取消上一个页面正在发送的请求，使用vuex配合axios实现。



src/utils/http.js

```js
import axios from 'axios'
import stroe from '@/stroe'
import * as Types from '@/store/action-types.js'

class Http {
    constructor() {
        // 根据环境变量设置请求的路径
        this.baseURL = process.env.DEV !=='production' ? 'http://backend-api-01.newbee.ltd/api/v1' : '/'
        this.timeout = 5000
        this.queue = {}  // 维护请求队列的映射表
    }

    setInterceptor(instance，url) {
        instance.interceptors.request.use(
            (config) => {
                if(Object.key(this.queue).length === 0){
                    // 开启loading
                }
                // 携带token来做处理
                let token = localStorage.getItem('token')
                if (token) {
                    config.headers['token'] = token // 每次携带token
                }
                let CancelToken = axois.CancelToken
                config.cancelToken = new CancelToken((c)=>{
                    store.commit(Types.SET_TOKEN,c)
                })
                this.queue[url] = true
                return config
            },
            (err) => {
                return Promise.reject(err)
            }
        )
        instance.interceptors.response.use(
            (res) => {
                delete this.queue[url]
                if(Object.key(this.queue).length === 0){
                    // 关闭loading
                }
                if (res.data.resultCode == 200) {
                    // 对返回值的状态码是200的情况统一处理
                    return res.data.data
                }
                if (res.data.resultCode === 500) {
                    return Promise.reject(res.data)
                }
                if (res.data.resultCode === 416) {
                    localStorage.removeItem('token') // 416 可能是token错误，这个时候清除token，重新刷新
                    // 刷新后就在此路由的全局钩子，就会走没有token的逻辑
                    return window.location.reload()
                    // return Promise.reject(res.data)
                }
                return Promise.reject(res.data)


            },
            (err) => {
                delete this.queue[url]
                if(Object.key(this.queue).length === 0){
                    // 关闭loading
                }
                return Promise.reject(err)
            }
        )
    }
    request(options) {
        // 请求会实现拦截器
        const instance = axios.create() // 1.每次请求要创建一个新的实例
        let config = {
            ...options,
            baseURL: this.baseURL,
            timeout: this.timeout
        }
        this.setInterceptor(instance,config.url) // 2.设置拦截器
        // 发送请求参数
        return instance(config)
    }
    get(url, data={}) {
        return this.request({
            method: 'get',
            url,
            params: data
        })
    }
    post(url, data={}) {
        return this.request({
            method: 'post',
            url,
            data
        })
    }
}
export default new Http()
```



路由导航中路由守卫进行请求的清理操作：

```js
import { createRouter, createWebHistory } from 'vue-router'
import * as Types from '@/store/action-types.js'
import stroe from '@/stroe'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { title: '首页' }
    },
    {
      path: '/category',
      meta: { title: '分类' },
      name: 'category',
      component: () => import('../views/Category.vue')
    },
      //...
  ]
})

// 鉴权看是否登录过
router.beforeEach(async (to,from,next) => {
  let token = localStorage.getItem('token')
  if (token) {
    // 如果有token 说明登录成功，但是如果你访问的还是登录
    if (to.name === 'login') {
      return { path: '/' }
    }
  } else {
    // 没有登录，跳转到登录页面
    if (to.matched.some((item) => item.meta.needLogin)) {
      // 此路由需要登录但是没有登录， 应该跳转到登录页面
      return {
        path: '/login',
        query: {
          redirect: to.path, // 跳转到登录页面，并且告诉登录页面稍后回调回来
          ...to.query // 当前页面的其他参数也添加进去
        }
      }
    }
  }
})

router.beforeEach((to,from,next) => {
	store.commit(Types.CLEAR_TOKEN)  // 这个动作里会调用各个axios的abort方法，取消请求
    next()  
})
export default router

```



## vue中如何做权限管理，按钮级权限

- 登录鉴权：用户登录后返回 Token，前端将Token 保存到本地，作为用户登录的凭证，每次发送请求时会携带 Token，后端会对 Token 进行验证。当页面刷新时可以使用 Token 来获得用户权限。
- 访问权限：根据用户是否登录判断能否访问某个页面，通过路由守卫实现判断用户是否有此权限。一般会首先在路由配置列表中，标记哪些页面是需要登录后才能访问的，可以自定义一个布尔值字段，比如needLogin，在meta信息中，然后在路由跳转时，在路由守卫中根据用户是否登录和页面是否需要登录才能访问进行判断
- 页面权限：前端配置的路由分为两部分“**通用路由配置**”和“**需要权限的路由配置**”。在权限路由中增加访问权限 meta(备注，角色，不同角色对应可以访问不同的页面)。用户登录后可得到对应的权限列表，通过权限列表筛查出对应符合的路由信息，最后通过 addRoutes 方法，动态添加路由。
- 按钮权限：按钮权限一般采用自定义指令实现，当用户登录时后端会返回对应的按钮权限，在按钮上使用此指令，指令内部会判断用户是否有此按钮权限，如果没有则会移除按钮。







## Vue异步组件的作用及原理

在 Vue.js 中，**异步组件**是指那些在需要时动态加载的组件，而不是在应用程序启动时立即加载。这样可以优化性能，尤其是当应用程序有许多组件但某些组件并不经常使用时。

**异步组件的特点**

- **延迟加载**：异步组件只有在需要时才会加载，而不是在初始渲染时加载。
- **适合大型应用**：通过按需加载组件，可以减少初始加载时间。
- **灵活性**：支持多种加载方式，方便适应不同需求（如网络慢速、错误处理等）。





**如何编写异步组件**

在 Vue 中，可以通过以下几种方式定义异步组件：

1. **简单工厂函数**

异步组件可以通过一个工厂函数返回一个 `Promise`，当 Promise 解析时，加载完成。

```js
const AsyncComponent = () => import('./MyComponent.vue');
```

2. **高级写法（`defineAsyncComponent`）**

Vue 3 提供了一个工具函数 `defineAsyncComponent`，可以更灵活地控制加载行为，例如添加加载状态、错误处理和超时配置。

```js
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent({
  // 工厂函数
  loader: () => import('./MyComponent.vue'),
  
  // 可选：加载中的组件
  loadingComponent: LoadingComponent,

  // 可选：加载失败时显示的组件
  errorComponent: ErrorComponent,

  // 可选：延迟显示加载组件的时间，单位为毫秒
  delay: 200,

  // 可选：加载超时时间，单位为毫秒，默认为 Infinity
  timeout: 3000,
});

```



3. **结合 Vue Router 的路由懒加载**

异步组件常用于 Vue Router 的路由懒加载中。

```js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/example',
    name: 'Example',
    component: () => import('./MyComponent.vue'), // 动态加载
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
```



**异步组件的几种写法对比**

| 写法类型               | 优点                                   | 缺点                           |
| ---------------------- | -------------------------------------- | ------------------------------ |
| 简单工厂函数           | 简洁直观，代码量少                     | 无法处理加载过程、错误或超时   |
| `defineAsyncComponent` | 提供更多配置项，适合复杂场景           | 代码稍多，需要额外引入工具函数 |
| 路由懒加载             | 自动与路由懒加载结合，按需加载页面组件 | 仅适用于路由组件               |



**异步组件底层的实现原理vue2**

- 默认渲染异步占位符节点
- 组件加载完毕后调用 $forceUpdate 强制更新，渲染加载完毕后的组件





## vue-router中几种模式的区别

Vue Router 中提供了几种路由模式，用于决定 URL 的呈现方式以及与后端服务器的交互方式。主要有以下几种模式：



**1. `hash` 模式**

- **工作原理**： 使用浏览器的 `URL hash`（即 `#` 后面的部分）来模拟路径。因为 `hash` 不会被包含在 HTTP 请求中，所以前端可以完全控制。

- **URL 示例**：

  ```
  http://example.com/#/home
  ```

- **特点**：

  1. **兼容性好**：支持 IE9 及以上版本。
  2. **不需要服务器支持**：hash 部分不会被发送到服务器，因此可以直接在本地或静态服务器运行。
  3. **URL 带有 `#`**：看起来不够美观，不利于 SEO。

- **适用场景**：

  - 前端完全静态项目。
  - 不需要与后端服务深度结合。

- **设置方法**： 在路由实例化时指定 `mode: 'hash'`（默认模式）。

  hash + hashChange 或者 popState

  ```js
  const router = new VueRouter({
    mode: 'hash',
    routes: [
      { path: '/home', component: Home },
    ],
  });
  ```

------

**2. `history` 模式**

- **工作原理**： 使用 HTML5 的 `History API`，如 `pushState` 和 `replaceState`，实现无 `#` 的 URL。

- **URL 示例**：

  ```
  http://example.com/home
  ```

- **特点**：

  1. **美观**：URL 没有 `#`，与传统网站 URL 更加接近。
  2. **SEO 友好**：搜索引擎可以正常抓取路径。
  3. **需要服务器支持**：因为去掉了 `#`，**刷新页面时，浏览器会向服务器发送请求。如果服务器没有正确处理这些请求，会导致 404 错误。**

- **适用场景**：

  - 需要更好的 URL 美观性和 SEO 支持。
  - 后端支持配置，例如将所有非静态资源请求都重定向到 `index.html`。

- **设置方法**： 在路由实例化时指定 `mode: 'history'`。

  ```js
  const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/home', component: Home },
    ],
  });
  ```

- **服务器配置**：
  需要将所有路由请求重定向到 `index.html`，以下是一些常见服务器的配置示例：

  **Apache**：

  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

  **Nginx**：

  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

------

**3. `abstract` 模式**

- **工作原理**： 使用内存中的地址模拟路由，没有实际的浏览器地址栏变化。

- **特点**：

  1. 适用于非浏览器环境（如服务端渲染，SSR）。
  2. 不依赖浏览器的 `hash` 或 `history` 功能。

- **适用场景**：

  - 测试环境。
  - 服务端渲染（SSR）。

- **设置方法**： 在路由实例化时指定 `mode: 'abstract'`。

  ```js
  const router = new VueRouter({
    mode: 'abstract',
    routes: [
      { path: '/home', component: Home },
    ],
  });
  ```

  注意：使用 `abstract` 模式时，需要手动管理导航，通常在非浏览器环境中才使用。

------



**模式对比**

| 模式       | URL 示例                    | 是否需要服务器支持 | SEO 支持 | 浏览器兼容性 | 适用场景                     |
| ---------- | --------------------------- | ------------------ | -------- | ------------ | ---------------------------- |
| `hash`     | `http://example.com/#/home` | 否                 | 否       | IE9+         | 简单项目，无需服务器配置     |
| `history`  | `http://example.com/home`   | 是                 | 是       | IE10+        | SEO 优化，美观性要求高的项目 |
| `abstract` | 不涉及 URL                  | 否                 | 否       | 与浏览器无关 | 服务端渲染（SSR），测试环境  |

------



**选择建议**

1. **`hash` 模式**：
   - 快速开发，适合部署到静态服务器（如 GitHub Pages）。
   - 不需要后端参与的前端项目。
2. **`history` 模式**：
   - 美观、适合生产环境。
   - 需要后端服务器配合重定向设置。
   - 更适合需要 SEO 的项目。
3. **`abstract` 模式**：
   - 适用于 Node.js 环境下的服务端渲染（SSR）。
   - 非浏览器环境或测试场景。



在开发阶段的webpack中，可以使用webpack-history-fallback来处理404问题。 但是发布到生产后，这个404的问题需要另外解决，一般是返回首页。







## vue-router 有几种钩子函数，执行时机

- 导航被触发，触发时机：页面切换， 当前页面的更新。
- 在即将失活的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用（比如页面导航部分的参数变化导致的）的组件里调用 beforeRouteUpdate 守卫(2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫(2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子,
- 触发 DOM 更新。
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。



在 **Vue Router 3** 中，路由导航的生命周期函数主要分为以下几个阶段。这些函数允许开发者在路由导航的不同阶段插入逻辑，例如鉴权、数据预加载等。

**路由导航的生命周期函数**

1. **全局导航守卫**

   是指路由实例上直接操作的钩子函数，特点是所有路由配置的组件都会触发，直白点就是触发路由就会触发这些钩子函数

   - `beforeEach（to，from， next）`：全局前置守卫。
   - `beforeResolve（to，from， next）`：全局解析守卫。
   - `afterEach（to，from）`：全局后置钩子。

   ```js
   router.beforeEach((to, from, next) => {
     // 全局前置守卫
     // if(to.fullPath === '/shoppingCart'){
     //   //如果没有登录?对不起先去登录一下
     //   next('/login')
     // }
     console.log('1 beforeEach', to, from)
     next()
   })
   // 时间触发比 全局前置守卫慢些
   router.beforeResolve((to, from, next) => {
     // 全局解析守卫
     console.log('3 beforeResolve', to, from)
     next()
   })
   
   router.afterEach((to, from) => {
     // 全局后置守卫、钩子
     console.log('4 afterEach', to, from)
   
   })
   ```

   

2. **路由独享守卫**
   是指在单个路由配置的时候也可以设置的钩子函数。

   路由独享守卫（`beforeEnter`）: 和`beforeEach`完全相同，如果两个都设置了，`beforeEnter`则在`beforeEach`之后紧随执行。在路由配置上直接定义`beforeEnter`守卫

   - `beforeEnter（to，from， next）`

   ```js
     {
       path: '/a',
       name: 'pageA',
       components:{
         default:pageA,
         ppp:Test
       },
       beforeEnter:(to,from,next)=>{
         console.log('2 beforeEnter',to,from)
         next()
       },
     },
   ```

   

3. **组件内守卫**
   是指在组件内执行的钩子函数，类似于组件内的生命周期，相当于为配置路由的组件添加的生命周期钩子函数。

   - `beforeRouteEnter` 该钩子在全局守卫`beforeEach`和独享守卫`beforeEnter`之后，全局`beforeResolve`和全局`afterEach`之前调用，要注意的是该守卫内访问不到组件的实例，也就是`this`为`undefined`。因为它在组件生命周期`beforeCreate`阶段触发，此时的新组件还没有被创建。在这个钩子函数中，可以通过传一个回调给 `next`来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。

   - `beforeRouteUpdate` 在当前路由改变时，并且该组件被复用时调用，可以通过this访问实例。

   - `beforeRouteLeave` 导航离开该组件的对应路由时调用，可以访问组件实例this。这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过next( false )来取消。

     ```js
     beforeRouteLeave (to, from , next) {
       const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
       if (answer) {
         next()
       } else {
         next(false)
       }
     }
     ```

     

     

     ```vue
     <template>
       ...
     </template>
     <script>
     export default{
       data(){
         //...
       },
       beforeRouteEnter (to, from, next) {
         // 在渲染该组件的对应路由被 confirm 前调用
         // 不！能！获取组件实例 `this`
         // 因为当守卫执行前，组件实例还没被创建
       },
       beforeRouteUpdate (to, from, next) {
         // 在当前路由改变，但是该组件被复用时调用
         // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
         // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
         // 可以访问组件实例 `this`
       },
       beforeRouteLeave (to, from, next) {
         // 导航离开该组件的对应路由时调用
         // 可以访问组件实例 `this`
       }
     }
     </script>
     <style>
       ...
     </style>
     ```

     

   - `to`：即将要进入的目标路由对象；
   - `from`：即将要离开的路由对象；
   - `next`：涉及到`next`参数的钩子函数，必须调用`next()`方法来`resolve`这个钩子，否则路由会中断在这，不会继续往下执行

   `next()`：进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是`confirmed`(确认的)。

   `next( false )`中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到from路由对应的地址。

   `next( ' / ')`或者`next({ paht：' / ' })`：跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。可传递的参数可以是`router-link`标签中的`to`属性参数或`router.push`中的选项

   `next(error)`：如果传入`next`的参数是一个`Error`实例，则导航会被终止且该错误会被传递给`router.onError()`注册过的回调。

------



**导航守卫的执行顺序**

1. **全局前置守卫 (`router.beforeEach`)**
   - 在导航触发后，最先被调用。
   - 用于权限验证、登录状态检查等全局逻辑。
2. **路由独享守卫 (`beforeEnter`)**
   - 在目标路由的配置中定义的守卫。
   - 仅对特定路由生效。
   - 执行在全局前置守卫之后，组件内守卫之前。
3. **组件内守卫**
   - **`beforeRouteEnter`**：在路由进入前调用，不能直接访问组件实例（因为此时组件尚未被创建）。可以通过回调方式访问实例。
   - **`beforeRouteUpdate`**：在路由参数或查询发生变化时调用（适用于复用组件的情况）。
   - **`beforeRouteLeave`**：在离开组件所在路由时调用，常用于确认或清理逻辑。
4. **全局解析守卫 (`router.beforeResolve`)**
   - 在所有组件内守卫和异步路由组件被解析之后调用。
   - 适合执行需要等待异步组件加载完成的逻辑。
5. **全局后置钩子 (`router.afterEach`)**
   - 导航完成后调用，不接收 `next` 参数，不能中断导航。
   - 常用于埋点、页面统计等逻辑。

------

**完整的执行顺序**

假设从路由 A 导航到路由 B，生命周期函数的执行顺序如下：

1. **全局前置守卫**：`router.beforeEach`
2. **路由独享守卫**：目标路由的 `beforeEnter`
3. 组件内守卫：
   - 离开组件的 `beforeRouteLeave`
   - 进入组件的 `beforeRouteEnter`
   - 更新组件的 `beforeRouteUpdate`（如果复用组件）
4. **全局解析守卫**：`router.beforeResolve`
5. 导航完成后：
   - 路由切换完成，激活组件实例。
   - 调用 `beforeRouteEnter` 回调函数，访问组件实例。
6. **全局后置钩子**：`router.afterEach`





## Vuex的理解

Vuex 是 Vue.js 官方提供的一个 **状态管理模式（state management pattern）** 和 **库**，专门用于管理 Vue 应用中的状态（数据）。它通过集中式存储和统一的状态变更机制，使得在中大型应用中共享数据和状态变得更加简单和高效。

Vuex 的核心思想是将所有的组件的共享状态抽取出来，存放在一个全局的 **store**（仓库）中，组件可以通过 **特定的规则**来访问和修改这些状态。



![image-20241216182046478](D:\learn-notes\vue\images\image-20241216182046478.png)





修改状态的两种途径：

1. 组件中直接commit一个mutation
2. 组件dispatch一个动作，然后再commit数据给mutation中修改状态



**Vuex 的核心概念**

Vuex 包含以下几个核心部分：

1. **State（状态）**

   - 用于存储全局共享的数据。
   - 在 Vuex 中，`state` 是唯一的数据源（单一状态树），所有组件都可以访问。

   **示例**：

   ```js
   const store = new Vuex.Store({
     state: {
       count: 0,
     },
   });
   ```

   在组件中访问：

   ```js
   computed: {
     count() {
       return this.$store.state.count;
     },
   },
   ```

------

1. **Getters（计算属性）**

   - 类似于组件中的计算属性，用于从 `state` 中派生出一些状态。
   - 避免重复逻辑和提高复用性。

   **示例**：

   ```js
   const store = new Vuex.Store({
     state: {
       count: 10,
     },
     getters: {
       doubleCount: state => state.count * 2,
     },
   });
   ```

   在组件中访问：

   ```js
   computed: {
     doubleCount() {
       return this.$store.getters.doubleCount;
     },
   },
   ```

------

1. **Mutations（同步修改状态）**

   - 用于更改 `state` 的唯一途径。
   - 必须是同步函数，每个 mutation 有一个 **字符串类型的事件类型（type）** 和一个 **回调函数**。

   **示例**：

   ```js
   const store = new Vuex.Store({
     state: {
       count: 0,
     },
     mutations: {
       increment(state) {
         state.count++;
       },
     },
   });
   ```

   在组件中触发：

   ```js
   methods: {
     increment() {
       this.$store.commit('increment');
     },
   },
   ```

------

1. **Actions（异步操作）**

   - 用于处理异步逻辑，然后通过 `commit` 调用 `mutations` 修改 `state`。
   - 可以包含任意的异步操作，例如 API 调用。

   **示例**：

   ```js
   const store = new Vuex.Store({
     state: {
       count: 0,
     },
     mutations: {
       increment(state) {
         state.count++;
       },
     },
     actions: {
       incrementAsync({ commit }) {
         setTimeout(() => {
           commit('increment');
         }, 1000);
       },
     },
   });
   ```

   在组件中触发：

   ```js
   methods: {
     incrementAsync() {
       this.$store.dispatch('incrementAsync');
     },
   },
   ```

------

1. **Modules（模块化）**

   - 当应用变得非常庞大时，可以将 `store` 拆分成多个模块（module），每个模块拥有自己的 `state`、`mutations`、`actions` 和 `getters`。

   **示例**：

   ```js
   const moduleA = {
     state: () => ({ count: 0 }),
     mutations: {
       increment(state) {
         state.count++;
       },
     },
     actions: {
       incrementAsync({ commit }) {
         setTimeout(() => {
           commit('increment');
         }, 1000);
       },
     },
     getters: {
       doubleCount: state => state.count * 2,
     },
   };
   
   const store = new Vuex.Store({
     modules: {
       a: moduleA,
     },
   });
   ```

   在组件中访问：

   ```js
   computed: {
     count() {
       return this.$store.state.a.count;
     },
     doubleCount() {
       return this.$store.getters['a/doubleCount'];
     },
   },
   ```





**Vuex 的优缺点**

#### 优点

1. **集中式管理**：所有状态集中管理，数据流清晰。
2. **方便调试**：通过 Vue DevTools，可以方便地查看状态变化。
3. **模块化**：支持模块化管理，适合大型项目。
4. **统一约束**：通过 `mutations` 和 `actions` 修改状态，避免了随意修改状态的混乱。

#### 缺点

1. **学习成本**：对小型项目来说，使用 Vuex 会增加复杂性和开发成本。
2. **代码冗长**：需要写很多额外的代码（如 `state`、`mutations`、`actions` 等）。
3. **绑定 Vue**：Vuex 主要为 Vue 应用设计，跨框架支持性较弱。
4. 模板名和状态名冲突可能
5. 分模块后的数据不够扁平，书写起来冗长
6. 对ts支持不友好



vuex3中主要是new Vue 得到一个实例，因为这样数据就是响应式的了。底层共享这个实例上的数据。



## 如何监听vuex中数据的变化

在 Vue 中监听 Vuex 中数据的变化有多种方式，具体取决于使用场景。以下是几种常见的方法：

**1. 使用组件的 `computed` 计算属性**

Vuex 中的数据通常是通过 `state` 和 `getters` 显示在组件中的，直接在组件的 `computed` 计算属性中监听它们。当 Vuex 中的状态变化时，Vue 的响应式机制会自动更新相关视图。

```js
// Vuex Store
const store = new Vuex.Store({
  state: {
    count: 0,
  },
});

// 组件中
export default {
  computed: {
    // 直接监听 Vuex 的 state
    count() {
      return this.$store.state.count;
    },
  },
};
```



**2. 使用 `watch` 监听 Vuex 的状态**

在某些场景下，需要对 Vuex 的状态变化执行额外的副作用逻辑，可以使用 Vue 的 `watch` 选项。

```js
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
  watch: {
    count(newVal, oldVal) {
      console.log(`count changed from ${oldVal} to ${newVal}`);
    },
  },
};
```



**3. 使用 `store.subscribe`**

Vuex 提供了一个订阅方法 `store.subscribe`，可以监听所有通过 **mutation** 修改的状态变化。

```js
// 在主文件中订阅 Vuex 的状态变化
store.subscribe((mutation, state) => {
  console.log('Mutation triggered:', mutation);
  console.log('Current state:', state);
});
```

- 参数说明：
  - `mutation`：包含 mutation 的类型和传入的 payload 数据。
  - `state`：触发 mutation 后的最新状态。

**优点**：

- 可以全局监听 Vuex 中所有状态的变化。
- 特别适用于调试、日志记录或实现插件功能。



**4. 使用 `store.watch`**

Vuex 的 `store.watch` 方法允许监听特定的状态或 `getter` 的变化，类似于 Vue 的 `watch`。

```js
// 在 Vue 组件或其他地方监听特定状态
store.watch(
  // 监听的属性
  (state) => state.count,
  // 回调函数
  (newValue, oldValue) => {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  }
);
```

- 参数说明：
  - 第一个参数是监听的状态或 getter。
  - 第二个参数是回调函数，会在监听的值发生变化时触发。

**适用场景**：

- 需要在某个状态变化时触发特定的逻辑，但不依赖组件。



**5. 使用 Vuex 插件**

如果需要监听 Vuex 状态变化并执行全局的逻辑，可以通过 Vuex 插件实现。插件是一个函数，会在 Store 实例化时调用，提供了 `store.subscribe` 的功能。

```js
const myPlugin = (store) => {
  store.subscribe((mutation, state) => {
    console.log('Global Mutation:', mutation.type);
    console.log('Payload:', mutation.payload);
  });
};

const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  plugins: [myPlugin], // 注册插件
});
```





## Vuex中数据持久化

页面刷新时，Vuex 中的数据会丢失，因为 Vuex 的状态是存储在内存中的，而刷新页面会重新加载整个应用，导致内存被清空。要解决这个问题，可以将 Vuex 的数据持久化到本地存储（如 `localStorage` 或 `sessionStorage`）或后端服务器。以下是几种常见的解决方案：



方案 1：使用 `localStorage` 或 `sessionStorage`

在页面刷新时，将 Vuex 的数据保存到浏览器的 `localStorage` 或 `sessionStorage` 中，并在应用加载时从存储中恢复数据。

**实现步骤**

1. **保存 Vuex 状态到 `localStorage`** 可以使用 `store.subscribe` 方法监听每次 `mutation` 的变化，将状态数据同步到 `localStorage`。
2. **恢复数据** 在 Vuex 实例化时，从 `localStorage` 中读取数据并初始化 `state`。

```js
// store/index.js
const store = new Vuex.Store({
  state: {
    user: null, // 示例状态
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
});

// 保存 Vuex 数据到 localStorage
store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});

// 恢复 Vuex 数据
const savedState = localStorage.getItem('store');
if (savedState) {
  store.replaceState(Object.assign(store.state, JSON.parse(savedState)));
}

export default store;
```

- 只能存储简单的 JSON 数据；需要手动处理安全性和数据过期问题。



方案 2：使用插件（如 `vuex-persistedstate` 或 `vuex-persist`）

使用现成的插件，将 Vuex 状态持久化到浏览器存储中，减少手动编码。 

npm install vuex-persistedstate

```js
// store/index.js
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage, // 使用 localStorage 进行存储
      paths:[] 
    }),
  ],
});

export default store;

```



方案 3：通过 Vuex 的 `actions` 和后端接口实现持久化

在某些关键操作（如用户登录或表单提交）时，将 Vuex 的数据同步到后端数据库，并在页面加载时从后端恢复数据。

**示例代码**

```js
// store/index.js
const store = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      const response = await fetch('/api/get-user');
      const user = await response.json();
      commit('setUser', user);
    },
    async saveUser({ state }) {
      await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.user),
      });
    },
  },
});

export default store;
```

在页面加载时，调用 `fetchUser` 动作从后端获取用户数据并初始化 `state`。

用户操作完成后，通过 `saveUser` 动作将数据同步到后端。

需要后端支持；可能增加接口调用次数，影响性能。





将 Vuex 的关键数据存储在 `cookies` 中，适用于需要跨域或持久化的重要数据。

**优点**：适合需要存储敏感数据（如认证令牌）或跨域请求的场景。

**缺点**：存储空间有限（每个 cookie 最大 4KB），不能用于大规模数据存储。





## mutation和action的区别

`mutation` 和 `action` 是修改和操作状态的两种核心方式，但它们有本质的区别，主要体现在功能、作用和使用场景上。



**区别**

| 特性         | **Mutation**               | **Action**                                             |
| ------------ | -------------------------- | ------------------------------------------------------ |
| **目的**     | 用于 **同步修改** `state`  | 用于 **处理异步操作**，并通过 `commit` 调用 `mutation` |
| **是否同步** | 必须是 **同步操作**        | 支持 **异步操作**                                      |
| **修改方式** | 直接操作 `state`           | 间接操作 `state`（通过调用 `mutation`）                |
| **调用方式** | 使用 `commit` 调用         | 使用 `dispatch` 调用                                   |
| **回调支持** | 不支持回调（因为是同步的） | 支持异步回调                                           |

------

### 

**Mutation 的特点**

1. **作用**：
   - 是 Vuex 中 **唯一合法修改 `state` 的途径**。
   - 只能进行同步操作。
2. **定义和使用**：
   - 定义在 `mutations` 中，用来更改 `state` 的数据。





**Action 的特点**

1. **作用**：
   - 用于处理 **异步操作**（如网络请求、定时器等）。
   - Action 不能直接修改 `state`，需要通过调用 `mutation` 来完成状态的更改。
2. **定义和使用**：
   - 定义在 `actions` 中，支持异步逻辑。
   - Action 的方法接收一个上下文对象 `context`，其中包含 `commit`、`dispatch`、`state`、`getters` 等属性。



```js
const store = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    fetchUser({ commit }) {
      // 模拟异步请求
      setTimeout(() => {
        const user = { name: 'John Doe', age: 25 };
        commit('setUser', user); // 调用 mutation
      }, 1000);
    },
  },
});

// 在组件中调用
methods: {
  fetchUser() {
    this.$store.dispatch('fetchUser'); // 调用 action
  },
},
```





| 功能场景             | 适合使用 **Mutation**              | 适合使用 **Action**                                   |
| -------------------- | ---------------------------------- | ----------------------------------------------------- |
| **同步修改 `state`** | 修改计数器、切换状态等简单同步操作 | 不需要                                                |
| **异步操作**         | 不适合                             | 调用 API、延时操作、复杂逻辑等需要异步处理的操作      |
| **统一逻辑管理**     | 简单逻辑可以直接使用 `mutation`    | 复杂逻辑（如多次调用 mutation）适合封装到 `action` 中 |
| **数据流的复杂度**   | 数据流简单、直接修改 `state`       | 数据流复杂，需要异步和逻辑分层                        |



## Vuex中的module

使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

Vuex 允许将 store 分割成模块(modue)。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

![image-20241216204609178](D:\learn-notes\vue\images\image-20241216204609178.png)

需要开启模块的namespace:true



## Vue3中compositionAPI的优势

- 在 Vue2 中采用的是 OptionsAPl,用户提供的 dpta,props,methods,computed,watch 等属性(用户编写复杂业务逻辑会出现反复横跳问题)
- Vue2 中所有的属性都是通过 this 访问，this 存在指向明确问题.
- Vue2 中很多未使用方法或属性依旧会被打包，并且所有全局API都在Vue 对象上公开。CompositionAPI对 tree-shaking 更加友好，代码也更容易压缩。
- 组件逻辑共享问题，Vue2 采用 mixins 实现组件之间的逻辑共享;但是会有数据来源不明确，命名冲突等问题。Vue3 采用CompositionAPl提取公共逻辑非常方便
- 简单的组件仍然可以采用 OptionsAPI进行编写，compositionAP! 在复杂的逻辑中有着明显的优势~。



## Vue项目中如何做错误处理

**1. 全局错误捕获**

Vue 提供了一个全局错误处理钩子 `errorHandler`，用于捕获组件渲染时的错误。

**实现步骤**

在 Vue 应用中注册全局错误处理器：

#### Vue 2

```js
Vue.config.errorHandler = function (err, vm, info) {
  // 打印错误信息
  console.error('Error:', err);
  console.error('Component:', vm);
  console.error('Info:', info);

  // 例如：将错误信息上报到日志服务器
  // sendErrorLog(err, info);
};

```

Vue 3

```js
const app = Vue.createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error('Error:', err);
  console.error('Component:', instance);
  console.error('Info:', info);

  // 可以在此处进行错误上报
  // sendErrorLog(err, info);
};

app.mount('#app');
```

**适用场景**

- 捕获同步代码中的错误。
- 捕获渲染过程中、生命周期钩子中的错误。
- 适用于处理无法在单个组件中解决的全局错误。





## **组件级错误边界**

在 Vue 3 中，可以通过 `errorCaptured` 钩子捕获后代组件中的错误。

可以捕获来自后代组件的错误，如果全局的 config.errorHandler 被定义，所有的错误仍会发送给它（组件的errorCaptured返回false后，全局的errorHandler就拿不到了），因此这些错误仍然会向单一的分析服务的地方进行汇报。



错误处理的流程：

> 父组件(errorCaptured)-》子组件(errorCaptured)-》孙子组件出错时，错误会一直向上抛。如果errorCaptured 中返回 false 则会阻断传播。



**示例**

```js
export default {
  errorCaptured(err, instance, info) {
    console.error('Error in child component:', err);
    console.error('Component instance:', instance);
    console.error('Info:', info);

    // 阻止错误冒泡
    return false;

    // 或者显示错误提示
    // this.$notify({ type: 'error', message: '组件加载失败' });
  },
};
```

**适用场景**

- 捕获特定子组件的错误。
- 防止错误影响整个应用。



错误处理源码：

```js
export function handleError(err: Error, vm: any, info: string) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget()
  try {
    if (vm) {
      let cur = vm
      while ((cur = cur.$parent)) {
        const hooks = cur.$options.errorCaptured
        if (hooks) {
          for (let i = 0; i < hooks.length; i++) {
            try {
              const capture = hooks[i].call(cur, err, vm, info) === false
              if (capture) return
            } catch (e: any) {
              globalHandleError(e, cur, 'errorCaptured hook')
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info)
  } finally {
    popTarget()
  }
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e: any) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler')
      }
    }
  }
  logError(err, vm, info)
}
```





异步操作（如 API 请求）中的错误不会被 Vue 的全局错误处理器捕获，需要手动使用 `try-catch` 处理。

```js
methods: {
  async fetchData() {
    try {
      const response = await axios.get('/api/data');
      this.data = response.data;
    } catch (error) {
      console.error('API Error:', error);

      // 显示错误提示
      this.$notify({
        type: 'error',
        message: '获取数据失败，请稍后再试',
      });

      // 或者上报错误
      // sendErrorLog(error);
    }
  },
},
```







对于未被 `catch` 捕获的 Promise 错误，可以通过 `window.onunhandledrejection` 捕获。

```js
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);

  // 例如：将错误信息上报
  // sendErrorLog(event.reason);
});
```

捕获所有未处理的 Promise 错误。

处理全局异步异常。







在 Vue Router 中，可以通过全局导航守卫捕获路由相关的错误，例如：路由权限校验失败或动态路由加载失败。

```js
router.onError((error) => {
  console.error('Routing Error:', error);

  // 显示错误页面
  router.push('/error');

  // 或者上报错误
  // sendErrorLog(error);
});
```

- 动态路由加载失败。
- 路由跳转中出现错误。





在开发环境和生产环境中，错误处理的方式可能不同：

- **开发环境**：打印详细错误日志，方便调试。
- **生产环境**：屏蔽详细错误信息，避免泄露敏感数据，仅提供友好提示，同时上报错误。

```js
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function (err, vm, info) {
    console.error('Production Error:', info);
    // 上报错误
    sendErrorLog(err, info);
  };
} else {
  Vue.config.errorHandler = function (err, vm, info) {
    console.error('Development Error:', err, info);
  };
}
```



**常见错误类型及对应处理**

| 错误类型             | 处理方式                                           |
| -------------------- | -------------------------------------------------- |
| **API 请求失败**     | 捕获错误并显示用户友好提示，重试或降级处理         |
| **权限不足**         | 跳转到权限提示页面或登录页面                       |
| **动态路由加载失败** | 显示错误页面或重新加载路由                         |
| **组件加载失败**     | 使用错误边界捕获错误并显示备用组件                 |
| **全局未捕获异常**   | 使用 `errorHandler` 或 `window.onerror` 捕获并上报 |



## Vue3模板编译优化

### patchFlags优化

全量的diff算法是组件更新时，默认从当前组件的根节点开始递归的去比较每一个节点的差异。但是其中会有很多节点可能是静态的，全量diff时无法绕过对这些节点的比对的。那编译时就想提取标记组件中的动态节点，更新时只比较更新这些动态节点即可。就采用patchFlag进行标记，这样就能提高diff的性能。

`patchFlag` 是一种编译优化机制，用于帮助框架在虚拟 DOM 的 **diff** 过程中快速确定需要更新的部分。它是一种标记（flag）机制，通过为节点打上特定的标志，明确指出哪些部分是动态变化的，从而避免对静态部分进行不必要的对比和更新。

在编译模板时，Vue 3 的模板编译器会分析哪些节点或属性是动态的，并为这些动态部分生成对应的 `patchFlag`。

在运行时，当数据变化时，`patchFlag` 指导 Vue 只对标记为动态的部分进行更新，而忽略静态部分。

`patchFlag` 是一个二进制位的标志，每种类型的变化都对应一个值。这些值可以组合在一起，通过位运算快速判断需要更新的内容。

```vue
<div>
    <h1>
        hello
    </h1>
    <p>
        {{name}}  
    </p> 
</div>
```

上面的p标签就是动态的节点。模板编译后的结果：

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("h1", null, " hello "),
    _createElementVNode("p", null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
/  _openBlock()：创建一个新的 Block。
/ _createElementBlock()：为根节点创建 Block，标记动态节点信息。
/ TEXT：动态节点的 patchFlag，指示此节点的文本是动态的。
// Check the console for the AST
```

通过编译优化后生成的虚拟DOM的特点：

- 虚拟DOM节点上有children和dynamicChildren，前者收集所有的子节点虚拟DOM，后者收集动态的子节点虚拟DOM或者其他block
- 同时对于动态节点，还会打一些标记，标识具体的动态的内容是什么，比如上面的动态内容就是TEXT，还有其他的比如STYLE，CLASS等，进一步实现靶向更新
- block可以收集所有后代动态节点

以下是 `patchFlag` 的一些主要类别及其含义：

以下是 Vue 3 中的一些常见 `patchFlag` 类型及其含义（使用二进制表示）：

| **标记值** | **名称**             | **描述**                                                     | **示例**                                   |
| ---------- | -------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `1`        | **TEXT**             | 节点的文本内容发生变化                                       | `<div>{{ dynamicText }}</div>`             |
| `2`        | **CLASS**            | 节点的 `class` 属性是动态的                                  | `<div :class="dynamicClass"></div>`        |
| `4`        | **STYLE**            | 节点的 `style` 属性是动态的                                  | `<div :style="dynamicStyle"></div>`        |
| `8`        | **PROPS**            | 动态绑定的普通属性（非 class 和 style），会附加一个 `dynamicProps` 数组，列出具体哪些属性发生了变化。 | `<div :id="dynamicId"></div>`              |
| `16`       | **FULL_PROPS**       | 表示该 VNode 的所有属性都可能发生变化，需要完全重新设置属性。 | `<div v-bind="dynamicProps"></div>`        |
| `32`       | **HYDRATE_EVENTS**   | 节点上绑定了事件                                             | `<button @click="handleClick"></button>`   |
| `64`       | **STABLE_FRAGMENT**  | 子节点顺序稳定，不会变化                                     | 静态子节点                                 |
| `128`      | **KEYED_FRAGMENT**   | 带有 `key` 的动态列表                                        | `<li v-for="item in list" :key="item.id">` |
| `256`      | **UNKEYED_FRAGMENT** | 未带 `key` 的动态列表                                        | `<li v-for="item in list">`                |
| `512`      | **NEED_PATCH**       | 强制完全对比更新                                             | 特殊情况                                   |
| `1024`     | **DYNAMIC_SLOTS**    | 动态插槽内容                                                 | 动态插槽                                   |

1. **DEV_ROOT_FRAGMENT (2048)**：
   - 主要用于开发环境，表示根片段。
2. **HOISTED (–1)**：
   - 表示该 VNode 是静态提升的，不需要更新。
3. **BAIL (–2)**：
   - 表示放弃优化，进行完整的 diff 比较。



**组合使用**

`patchFlag` 可以组合使用，例如：

- **`1 | 2 | 4`**：表示文本、类名和样式的更新。

- **`8 | 16`**：表示属性和所有属性的更新。



```js
const vnode = {
  type: 'div',
  props: {
    id: 'my-div',
    class: 'container',
    style: { color: 'red' }
  },
  children: 'Hello, world!',
  patchFlag: 8, // 表示属性发生变化
  dynamicProps: ['id', 'class', 'style'] // 具体变化的属性
};
```



```js
// 定义 patchFlags 常量
const PatchFlags = {
  TEXT: 1, // 文本内容发生变化
  CLASS: 2, // 类名发生变化
  STYLE: 4, // 内联样式发生变化
  PROPS: 8, // 属性发生变化（如 id, class, style 等）
  FULL_PROPS: 16, // 所有属性都可能发生变化，需要完全重新设置属性
  HYDRATE_EVENTS: 32, // 在服务端渲染（SSR）后需要添加事件监听器
  STABLE_FRAGMENT: 64, // 片段子节点是稳定的，顺序不会改变
  KEYED_FRAGMENT: 128, // 带键的片段，子节点可能会重新排序
  UNKEYED_FRAGMENT: 256, // 不带键的片段，子节点顺序固定
  NEED_PATCH: 512, // 需要进行补丁操作，通常用于动态组件或其他复杂情况
  DYNAMIC_SLOTS: 1024, // 插槽内容是动态的
  HOISTED: -1, // 静态提升的 VNode，不需要更新
  BAIL: -2, // 放弃优化，进行完整的 diff 比较
  DEV_ROOT_FRAGMENT: 2048 // 开发环境中的根片段
};

// 示例：创建一个带有多个 patchFlags 的 VNode
const vnode = {
  type: 'div',
  props: {
    id: 'my-div',
    class: 'container',
    style: { color: 'red' }
  },
  children: 'Hello, world!',
  patchFlag: PatchFlags.PROPS | PatchFlags.CLASS | PatchFlags.STYLE, // 表示属性、类名和样式的更新
  dynamicProps: ['id', 'class', 'style'] // 具体变化的属性
};

console.log(vnode);
```

通过这些标识，diff算法的时候就可以根据标识靶向更新对应的内容即可。





### **Block**

block的主要目的就是收集当前带有patchFlag的元素节点。单有block还远不够，又引入了blocktree。

在 Vue 3 中，**Block** 是模板编译器的一种优化机制，用于更高效地**组织和管理**虚拟 DOM 的更新过程。

**Block** 是一个独立的更新单元，包含了动态节点的信息，例如它的 `patchFlag`、动态属性、事件等。Vue 通过 Block 的**结构化**优化，可以在运行时更高效地定位需要更新的动态内容，而无需逐层对比整个虚拟 DOM 树。

**Block 的作用**

1. **分层优化， 减少对静态内容的处理**：
   - Vue 3 将模板划分为多个独立的 Block，每个 Block 只关心其中的动态内容。
   - 这种分块机制使得 Vue 能跳过静态内容，只对动态内容执行更新操作。
2. **提升运行时性能**：
   - 在 Vue 2 中，模板中的所有节点都会在每次更新时递归进行 diff，即使它们是静态内容。Vue 3 借助 Block 直接定位动态部分，大幅减少了不必要的 DOM diff。
   - Vue 3 使用 Block 将模板拆分为静态部分和动态部分，静态部分可以**一次性**静态提升到渲染函数外，只需初始化一次，无需每次重新渲染
3.  高效处理动态列表
   - 动态列表中的每个节点都需要比较，可能带来性能瓶颈。
   - 通过 Block，Vue 可以直接针对 `keyed` 或 `unkeyed` 的列表进行高效更新。



**Block 的运行机制**

**编译阶段**：

- Vue 编译模板时，将动态内容划分为多个 Block。
- 每个 Block 包含动态节点及其相关的 `patchFlag` 信息。

**渲染阶段**：

- Vue 运行时会根据 Block 的标记，直接定位并更新动态内容，而不会处理与 Block 无关的部分。



### **Block 与静态提升**

Block 与静态提升（Hoisting）协同工作：

1. **静态提升**：Vue 3 会将模板中不变的静态内容提升到渲染函数外部，只生成一次，而不是每次渲染都重新生成。

   优化点：

   - **静态节点**：完全静态的 DOM 元素或文本节点直接提升为常量，减少每次渲染时重复创建的开销。
   - **静态属性**：对于静态的属性值，会提前计算并缓存。

2. **Block**：动态部分被划分为独立的 Block，只在数据变化时更新相关部分。





### Block Tree

为什么还要提出block的概念了？只有block不就可以了吗？block不就能收集动态节点了。

问题在于block在收集动态节点的时候是忽略虚拟DOM树的层级关系的。

对于下面的模板来说，如果只有根节点对应一个block，只会收集span的文本是动态节点，但是真的在切换flag的时候p是需要变为div的，但是block中只收集了span，更新的是就只能更新span而无法将p变为div了。 所以p和div也需要收集，解决办法就是将不稳定的结构也作为block来进行处理。也就是p和div分别对应自己的block，同时根节点的block会收集p和div的block，p和div的block再收集自己后代中的动态节点。

```vue
<div>
    <p v-if='flag'>
        <span>{{name}</span>
    </p>
    <div v-else>
        <span>{{name}</span>
    </div>
</div>
```

编译后的结果：

```js
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    (_ctx.flag)
      ? (_openBlock(), _createElementBlock("p", { key: 0 }, [
          _createElementVNode("span", null, "{{name}</span> </p> <div v-else> <span>{{name}</span> </div> </div>")
        ]))
      : _createCommentVNode("v-if", true)
  ]))
}

_createElementBlock 最外层div对应的根block

```



父级节点对应的block除了会收集动态以外，也会收集子block，如果子bolck的key不一样，会删除子block重新创建。



**Block Tree** 是 Vue 3 中的一种数据结构，用于描述模板中动态节点的层级关系。它本质上是一棵树，根节点是整个模板，子节点是各个动态节点的 Block 或嵌套的 Block。通过这棵树，Vue 可以高效地组织和管理动态内容的更新。

Block Tree 把动态节点和嵌套 Block 组织成一个有层次的结构，Vue 在更新时可以快速定位需要处理的动态节点，而不需要从根节点开始递归遍历。

当模板中包含复杂的嵌套结构（如 `v-for`、动态插槽等）时，Block Tree 能清晰地描述各个 Block 的关系，便于 Vue 处理更新。

Block Tree 清晰地描述了动态内容的嵌套关系，Vue 可以通过这棵树直接找到需要更新的内容。



Block Tree 是一棵树，以下是其典型的结构：

- **根节点**：表示整个模板。
- **子节点**：表示动态节点或嵌套的 Block。
- **叶子节点**：最终的动态节点（如文本、属性、事件等）。



```vue
<template>
  <div>
    <span>Static content</span>
    <span>{{ dynamicText }}</span>
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>
```

**Block Tree 的结构**：

```mathematica
Root Block (div)
├── Static Node (span: "Static content")
├── Dynamic Node (span: "{{ dynamicText }}")
└── Nested Block (ul)
    ├── Keyed Dynamic List (li v-for)
```





### 动态节点的 Block

在 Vue 3 中，**动态节点的 Block** 是模板编译器用来优化动态内容的一种**结构化单位**。一个 **Block** 表示模板中由一个或多个动态节点组成的更新单元，包含了动态节点的属性、内容、事件等相关信息，以及它们的依赖关系。

**动态节点的 Block** 是 Vue 在编译阶段生成的，用于在运行时快速处理动态内容的更新，跳过不需要重新渲染的静态部分。



### 事件监听器缓存

对于不变的事件监听器函数，Vue 3 会缓存这些函数，避免每次渲染时创建新的函数实例。

优化点：

- 如果绑定的事件监听器是纯静态的，它会被标记为缓存并在渲染函数外创建。

好处：

- 减少重复创建函数导致的性能开销。
- 降低虚拟 DOM 比对的复杂度。





## vue3新特性

https://v3-migration.vuejs.org/

- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)*

- [SFC Composition API Syntax Sugar (`<script setup>`)](https://vuejs.org/api/sfc-script-setup.html)*

- [Teleport](https://vuejs.org/guide/built-ins/teleport.html)

- [Fragments](https://v3-migration.vuejs.org/new/fragments)

- [Emits Component Option](https://vuejs.org/api/options-state.html#emits)**

- [`createRenderer` API from `@vue/runtime-core`](https://vuejs.org/api/custom-renderer.html) to create custom renderers

- [SFC State-driven CSS Variables (`v-bind` in `<style>`)](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)*

  ```vue
  <script setup>
  import { ref } from 'vue'
  const theme = ref({
      color: 'red',
  })
  </script>
  
  <template>
    <p>hello</p>
  </template>
  
  <style scoped>
  p {
    color: v-bind('theme.color');
  }
  </style>
  ```

- [SFC `<style scoped>` can now include global rules or rules that target only slotted content](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)

  ```vue
  <style scoped>
  /* deep selectors */
  ::v-deep(.foo) {}
  /* shorthand */
  :deep(.foo) {}
  
  /* targeting slot content */
  ::v-slotted(.foo) {}
  /* shorthand */
  :slotted(.foo) {}
  
  /* one-off global rule */
  ::v-global(.foo) {}
  /* shorthand */
  :global(.foo) {}
  </style>
  ```

- [Suspense](https://vuejs.org/guide/built-ins/suspense.html) experimental



### 如何避免 Vuex 中的函数造成全局污染





### Vue 动画的生命周期



### Vue 中使用插件的步骤



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







### 什么是作用域插槽

作用域插槽 与插槽的区别：作用域不同。

插槽（插槽的作用域为父组件）：

- 创建组件虚拟节点的时候，会将组件的儿子的虚拟DOM保存起来。当初始化组件时，通过插槽属性将儿子进行分类。
- 渲染组件时，会拿对应的 slot 属性的节点进行替换操作
- 渲染父组件时，会将组件标签中间的内容渲染为虚拟节点存起来，这个渲染过程在执行父组件（即下面的 app 组件的父组件）渲染时，就已经渲染好了。并不是在 app 组件内部渲染的。渲染完成父组件即插槽内容后，对插槽就插槽名进行分类。{a:[vnode],b:[vnode]}

```vue
<app>
  <div slot='a'>xxxx</div>
  <div slot='b'>xxxxxxxx</div>
</app>
```

作用域插槽：

它的渲染流程是在 app 组件内部

```vue
<app>
  <div slot-scopr='可以时app组件中的数据'  slot='footer'>{{使用app组件中的数据}}</div>
  <div v-slot='可以时app组件中的数据'  slot='footer'>{{使用app组件中的数据}}</div>
</app>
```



### Vue 中 v-for 中为什么要使用 key

key 主要是用来为 DOM diff 的使用的。vue 中的 diff 算法主要是做同级比较，它会比较当前标签上的 key 和当前的标签名，如果 key 和标签名都一样，该算法就会更加高效的区分元素，提高复用已经渲染好的元素。在使用 v-for 的时候，尽量也不要使用索引作为 key 的值。

![image-20210318171438902](..\typora-user-images\image-20210318171438902.png)

有 key 的情况下，提高了 dom 元素的复用效率，避免了操作删除与新建 dom 元素。







### vue 组件之间的通信规则（单项数据流）

![image-20210318195124518](D:\learn-notes\vue\images\image-20210318195124518.png)



### 对比 jQuery，Vue 有什么不同



### 使用 vuex 只需要执行 Vue.use（Vuex），并在 Vue 的配置中传入一个 store 对象的示例，store 是如何实现注入的





### 父子组件生命周期函数执行顺序

- 加载渲染过程

  父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted

- 子组件更新过程　　父 beforeUpdate->子 beforeUpdate->子 updated->父 updated

- 父组件更新过程　　父 beforeUpdate->父 updated

- 销毁过程　　父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed





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

 两个树的完全的 diff 算法是一个时间复杂度为 O(n3) , Vue 进行了优化·O(n3) 复杂度的问题转换成 O(n) 复杂度的问题(只比较同级不考虑跨级问题) 在前端当中， 你很少会跨越层级地移动 Dom 元素。 所 以 Virtual Dom 只会对同一个层级的元素进行对比。

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

![image-20210318181959430](..\typora-user-images\image-20210318181959430.png)

![image-20210318182139726](..\typora-user-images\image-20210318182139726.png)

vue-loader 中使用的编译模板的包——vue-template-compiler





### vue3 解决什么问题



### v-model 实现原理以及如何自定义 v-model（面试必问）

v-model 可以看作 value+input 方法的语法糖。组件的 v-model 就是 value+input 方法的语法糖，而 checkout 或者 select 的 v-model 则不一定是 value+input 方法的语法糖。checkout 的 v-model 还可以看作是 checked+change 的语法糖。

```
<input type='text' v-model='msg'/>

<mycom :value="" @input=""></mycom>
<mycom v-model=check></mycom>
```

![image-20210318190335076](..\typora-user-images\image-20210318190335076.png)

#### 组件自定义 v-model 事件

![image-20210318190624685](..\typora-user-images\image-20210318190624685.png)

源码：

![image-20210318190753384](..\typora-user-images\image-20210318190753384.png)



### vue 中 v-html 会导致什么问题

- 可能导致 xss 攻击
- v-html 会替换标签内部的子元素





### 对 MVVM 的理解

![image-20210318113733467](..\typora-user-images\image-20210318113733467.png)

- 传统架构模型 MVC（从前端到后台统一称为 MVC）,前端叫视图层，后端数据库 M 层。 MVC 指的是用户操作界面获取数据时，会请求服务端路由，路由会调用对应的控制器来处理，控制器会过去数据，将结果返回给前端，页面重新渲染。 这种方向是单项的，而且是针对整个应用架构。
- 以前都是手动操作后台获取到的数据，将数据渲染到页面上，这就要开发者手动的操作 DOM，非常麻烦而且性能低下。随着前端的页面越来越复杂，不再是以前的只通过后端来渲染页面。对于前端的单页应用，我们又把 MVC 中的 V 层，也就是前端视图层又进行了抽离，抽离出了一个 MVVM。在 MVVM 中，V 指的是 DOM 元素，M 数据就是前端的静态数据或从后台获取的数据。VM 就是中间的调度层。Vue 框架就是一个典型的 MVVM 框架，我们将数据挂载到 Vue 实例上， 通过 vue 渲染视图，避免的调用 API 操作 DOM。同样，视图更改了，vue 实例也会更改 m 数据。

### Vue 的双向数据绑定的原理（vue 响应式原理）

核心点：Object.defineProperty（内部对应一个方法：defineReactive(obj,keys[i])），给数据的获取和设置都增加拦截功能，增加自己的业务逻辑（依赖收集）。

默认 Vue 在初始化数据时，会给 data 中的属性通过遍历方式使用 Object.defineProperty 重新定义所有属性，当页面读取到对应的属性时，会进行依赖收集（收集当前组件的 watcher），如果数据发生变化会通知相关依赖进行更新操作。

![image-20210318121345123](..\typora-user-images\image-20210318121345123.png)

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

![image-20210318122319512](..\typora-user-images\image-20210318122319512.png)

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

 因为如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染.所以为了性能考虑。 Vue 会在本轮数据更新后，再去异步更新视图。

 核心方法：nextTick( )

![image-20210318125342748](..\typora-user-images\image-20210318125342748.png)

 当数据变化之后，调用 notify 方法，通知 watcher 进行更新，watcher 调用自己的 update 方法进行更新，更新的时候并不是立即让 watcher 去执行，而是把 watcher 放在了一个队列中（queueWatcher），在队列中对 Watcher 进行过滤，相同的 Watcher 只留下一个，最后再异步的刷新 queueWatcher。

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

![image-20210318133746187](..\typora-user-images\image-20210318133746187.png)

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





![image-20210318211345868](..\typora-user-images\image-20210318211345868.png)



### Vue2.0 中响应式数据的理解

首先明确什么是响应式数据，它的作用。 知道基本的问题， 基本源码逻辑，用时的问题。

它可以监控一个数据的获取或操作。针对对象类型的数据使用 Object.defineProperty 方法然后内部递归来实现的。

源码大致流程:this.\_init(options) => initState(vm),初始化状态，包括对 props，methods, data, computed 和 watch 的初始化 => initData(vm) => observe(value) => new Observe(value) => 针对对象和数组进行分流（this.walk(value)和 this.observeArray(value)） => defineReactive(obj,key) ，可以递归。

```js
var obj = Object.freeze({});
Object.isExtensible(obj); // false
```



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

![image-20220115142254796](..\typora-user-images\image-20220115142254796.png)



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



### computed 与 watch 的区别

它们源码中都对应自身的 watcher 实例，不同的是 computed 具备缓存功能，computed 只要当依赖的属性发生变化时才会更新视图。computed 默认不会先执行，只有取值时才会执行，内部会维护一个 dirty 属性来控制依赖的值是否发生过变化，默认计算属性的值是通过执行 getter 函数后返回的，所以只能同步返回结果，异步任务的结果无法返回（有个第三方的包可以让 computed 属性变为异步的）；watch 中默认用户会提供至少一个回调函数，监视的数据变化就会执行该回调函数。

watch 可以监听计算属性

![image-20210318134741962](D:\learn-notes\vue\images\image-20210318134741962.png)





### Vue 组件的渲染流程

注册组件（全局或者局部）；内部调用断 Vue.extend 以注册组件时传入的组件的配置对象生成继承了 Vue 构造函数的子类构造函数；调用组件构造函数后进行挂载，产生虚拟节点；做组件初始化，将虚拟节点转化为真实节点。



