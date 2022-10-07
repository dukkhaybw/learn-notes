# Vue3.0

## Vue3.0 的构建流程

### Vue2.0 和 Vue3.0 的区别

#### 宏观区别：

- vue3.0 的源码采用 monorepo 方式进行管理（将多个项目的代码存储到同一个仓库中），但将模块拆到不同的 package 目录中，多个包本身相互独立，有自己的功能逻辑，单元测试又方便管理等。vue2.0 整个项目的框架包含了许多包，这些包都在一个仓库下进行管理（一个项目就一个仓库），但项目复杂时或追求扩展的时候，很难进行。
- vue3.0 采用 ts 开发增强了类型检测，vue2.0 采用的时 flow 进行类型检测
- vue3.0 的性能优化大幅提高，支持 tree-shaking，不使用就不会被打包（依靠函数式的 api 实现）， vue3.0 中主要就是在写函数；在 vue2.0 中写的代码都是写在一个配置对象中的，这个对象中哪些属性需要，哪些代码需要都是无法被 vue2.0 判断的，自然没有 tree-shaking 一说。
- vue2.0 后期引入 RFC，使得每个版本的改动可控 rfcs
- vue3.0 的源码体积优化，移除了部分 api，比如 filter 过滤器，实例的$on,$off,$onec 和内联模块
- vu2.0 写起来有时很被动，必须按照框架的规则在特定部分写特定代码，写代码不够灵活

#### 代码区别：

- Vue3.0 数据劫持采用 proxy（proxy 不会改变原对象，而是增加代理，使用方便，性能高，不会一上来就递归对象），而 Vue2.0 数据劫持采用的是 Object.defineProperty。Object.defineProperty 有性能缺陷和问题，该方法在 vue2.0 中会一上来就将对象进行完整的递归并给每个属性增加 get 和 set 方法（所以在 Vue2.0 中写代码时尽量将对象扁平化）；一、上来就完整递归的性能差；二、给每个属性增加 get，set 的性能也不高（算是重写对象属性了）；三、当给对象添加或者删除属性时，没法劫持和监听，导致 vue 中提供了$set、$delete API

  proxy 专门用于对象拦截代理的，它性能本来就更高，它也不需要给属性设置 get 或者 set 方法（即不用重新定义原有属性），也不用一开始就对 data 对象进行完整的递归，只有开发者在具体取到某一层时，才会再使用 proxy 进行代理。

- Vue3.0 中对模板编译进行了优化，编译时生成了 Block tree，哪些数据不需要更新就进行标记， 可以对子节点的动态节点进行收集，可以减少比较并且采用了 patchFlag 标记动态节点

  在 vue2.0 中的模板优化，比如判断父节点是否为一个静态节点，如果是的话就不做对比，但期间仍然会编译整个 DOM tree 结构，没法避免对 DOM tree 的遍历。但是在 vue3.0 中对模板编译中，会生成 Block tree，Block tree 会描述一个标签一个标签中的动态属性（比如标签中的文本数据是动态插入的），vue3.0 会单独把这些动态的部分提取到一个数组中，数组中放着当前标签下所有动态的内容，这样在下次数据更新时只需要比较这些动态的部分是否变化即可，而且 vue3.0 中对动态的部分也进行了标记（类的动态，样式动态或文本动态等等）。

- Vue3.0 采用 compositionApi 进行组织功能整合业务代码逻辑，提取公共逻辑，解决反复横跳，优化复用逻辑（vue2.0 中的 mixin 带来的数据来源不清晰，命名冲突问题），相比 optionsApi 类型（vue2.0）推断更加方便

  optionsApi 类型（vue2.0）就是在写 vue 项目时总是提供一个配置对象（options），对象中放一些相对固定的属性与值，写一个功能需要将需要在不同部分进行联动，如 data 中放数据，methods 中放方法，在 mounted 中使用某个 methods 中的方法来修改 data 中的数据，代码内聚性很差。

  compositionApi 类型组织代码，可以将复用的代码抽为一个个的函数，之后在不同的地方进行引用，方便代码组合，而且可以将某一个功能需要的方法，数据等放在一个函数中集中管理。

- 自定义渲染器，可以用来创建自定义的渲染器，改写 Vue 底层渲染逻辑

- 增加了 Fragment，Teleport，Suspense 组件

  Fragment：虚拟节点 Teleport：组件传送 Suspense：异步组件

- Hooks 函数增加代码的复用性，编写自己的 Hook 函数，将一部分独立的逻辑提取并且还可以做到响应式能力

#### ref 和 reactive 的区别：

ref 是让一个普通数据类型变为响应式，用 Object.defineProperty；也可以获取节点。

reactive 是让一个复杂对象用 proxy 方式进行拦截。

vue3 和 react 看上去好像有点相同，但是 compositionApi 是靠响应式的原理，而 react 是靠每次的 render。

## Vue3.0 架构分析

vue3.0 的源码采用 monorepo 方式进行管理，monorepo 是管理项目代码的一种方式，指在一个项目仓库（repo）中管理多个模块或者包（package）。

- 一个仓库可以维护多个模块，不用到处跳转找仓库
- 方便版本管理和依赖管理，模块之间的引用非常方便
- 仓库体积会变大（不足）

### vue3.0 的项目结构

- reactivity:响应式系统
- runtime-core:与平台无关的运行时核心（可以创建争对特定平台的运行时——自定义渲染器）
- runtime-dom：针对浏览器的运行时，包括 DOM API，属性和事件处理等
- runtime-test：用于测试
- server-renderer：用于服务端渲染
- compiler-core：与平台无关的编译器核心
- compiler-dom：针对浏览器的编译模块
- compiler-ssr：针对服务端渲染的编译模块
- compiler-sfc：针对单文件解析
- size-check：用于测试代码体积
- template-explorer：用于调试编译器输出的开发工具
- shared：多包共享内容
- vue：完整版本，包含运行时和编译器

vue2.0 中的数据响应式是无感的，开发者只需要将数据放在 data 中就能是实现响应式能力，但 vue3.0 中就不一样了，我要把哪个数据变为响应式的，有开发者自行决定，用特定的 API 封装。

运行时（运行环境），比如针对浏览器，weeks，ssr 的等

![image-20211121152327938](.\typora-user-images\image-20211121152327938.png)

### 安装依赖

monorepo 依赖

![image-20211121152639646](.\typora-user-images\image-20211121152639646.png)

## reactiveApi 实现

vue3.0 中核心的 4 个 api：

- reactive：使得不管多少层的对象都有响应式能力
- shallowReactive：对于多层对象，只对第一层实现响应式能力
- readonly：对象的任何属性都只能读不能改
- shallowReadonly：对象的第一层属性都只能读不能改，第二层以及内部层的可以修改

![image-20211122204315506](.\typora-user-images\image-20211122204315506.png)

![image-20211121211012157](.\typora-user-images\image-20211121211012157.png)

![image-20211121211040817](.\typora-user-images\image-20211121211040817.png)

![image-20211121211055108](.\typora-user-images\image-20211121211055108.png)

![image-20211121211112387](.\typora-user-images\image-20211121211112387.png)

![image-20211121211137797](.\typora-user-images\image-20211121211137797.png)

![image-20211121211128746](.\typora-user-images\image-20211121211128746.png)

![image-20211121211149770](.\typora-user-images\image-20211121211149770.png)

![image-20211121211157544](.\typora-user-images\image-20211121211157544.png)

![image-20211121211207301](.\typora-user-images\image-20211121211207301.png)

![image-20211121211219400](.\typora-user-images\image-20211121211219400.png)

只读属性的话只能读不能改，则 Vue 源码中就不用收集依赖的变化。

![image-20211121211252997](.\typora-user-images\image-20211121211252997.png)

![image-20211121211301079](.\typora-user-images\image-20211121211301079.png)

![image-20211121211316932](.\typora-user-images\image-20211121211316932.png)

![image-20211121211341597](.\typora-user-images\image-20211121211341597.png)

可以修改非第一层的属性。

## 项目实战

### 功能点

- 筛选功能
- 下拉刷新
- 下拉底部加载
- 登录注册
- 切换导航

### 技术点

CompositionAPI+TS+Vue3.0 全家桶

### 前置知识

#### TS
