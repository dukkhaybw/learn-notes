# Vue3.0

- Vue3开发环境搭建，设计理念（和Vue2一样）和整体框架
- 响应式原理，reactive，effect，watch，computed，ref原理
-  Vue3源码调试技巧，响应式数组，map和set处理
- 自定义渲染器原理及RuntimeDOM中的属性、事件处理
- 虚拟DOM原理、手写Vue3中diff算法及最长递增子序列实现原理
- 组件渲染原理、组件挂载流程、及异步渲染原理
- Vue3中生命周期原理，props、emit、slot、provide、inject实现原理
- Vue3中编译优化、patchFlags、blockTree，实现靶向更新（面试常考）
- 模板转化ast语法树，编译原理的转化逻辑、及代码生成原理
- Vue中异步组件原理、Teleport、keep-alive，transition组件实现原理
- Pinia和VurRouter源码原理
- Vue3中单元测试和服务端渲染



## Vue设计思想

- Vue3.0更注重模块上的拆分，在2.0中无法单独使用部分模块。需要引入完整的Vuejs(例如只想使用使用响应式部分，但是需要引入完整的Vuejs)， Vue3中的模块之间耦合度低，模块可以独立使用。 **拆分模块**
- Vue2中很多方法挂载到了实例中导致没有使用也会被打包（还有很多组件也是一样）。Vue3重写方法后， 通过构建工具Tree-shaking机制实现按需引入，减少用户打包后体积。vue2中的optionsAPI中没有用到的属性与方法都会一并被打包。Vue3中的组合式api能解决这个问题。 **重写API**
- Vue3的核心部分根据虚拟DOM和开发者提供的一些列渲染方法执行渲染工作，其中Vue3又将和具体环境相关的渲染方法单独抽离，允许自定义渲染器，扩展能力强。以前需要改写Vue源码改造渲染方式。 **扩展更方便**



## 设计理念(基于vue2)

1. 声明式框架，命令式代码被封装到Vuejs内部，不再需要开发者直接关注

   - JQ的时代编写的代码都是命令式的，命令式框架重要特点就是关注过程
   - 声明式框架更加关注结果。命令式的代码封装到了Vuejs中，过程靠vuejs来实现

   > 声明式代码更加简单，不需要关注实现，按照要求填代码就可以 
   >
   > ```js
   > - 命令式编程：
   > let numbers = [1,2,3,4,5]
   > let total = 0
   > for(let i = 0; i < numbers.length; i++) {
   >   total += numbers[i] - 关注了过程
   > }
   > console.log(total)
   > 
   > - 声明式编程：
   > let total2 = numbers.reduce(function (memo,current) {
   >   return memo + current
   > },0)
   > console.log(total2)
   > ```

2. 虚拟DOM。传统更新页面，每次数据更新都拼接一个完整的字符串innerHTML全部重新渲染，添加虚拟DOM后，操作真实DOM之前，可以比较新旧虚拟节点（DOM DIFF算法），找到变化再进行更新。小程序，单元测试并没有真实DOM概念，可以借助虚拟DOM模拟真实DOM，借助虚拟DOM可以跨平台，虚拟DOM就是一个对象，用来描述真实DOM的，下面是一个虚拟DOM的属性情况：

   ```js
   const vnode = {
       __v_isVNode: true,
       __v_skip: true,
       type,
       props,
       key: props && normalizeKey(props),
       ref: props && normalizeRef(props),
       children,
       component: null,
       el: null,
       patchFlag,
       dynamicProps,
       dynamicChildren: null,
       appContext: null
   } 
   ```

   

3. 区分编译时和运行时

   在编写代码时，直接手写虚拟DOM树来描述页面UI是很繁琐的。都是通过编写.vue文件模板来开发项目，在打包编译时，将模板直接编译为js函数调用，函数执行后返回虚拟DOM。

   专门写个编译时可以将模板编译成函数，函数执行后返回虚拟DOM （在构建的时候进行编译性能更高，不需要在运行的时候进行编译，而且vue3在编译中做了很多优化）





## Vue3.0 的构建流程

### Vue2.0 和 Vue3.0 的区别

#### 宏观区别：

- vue3.0 的源码采用 monorepo 方式进行管理（将多个项目的代码存储到同一个仓库中），将包拆到不同的 package 目录中，多个包本身相互独立，有自己的功能逻辑，单元测试又方便管理，可以独立打包发布等。vue2.0 整个项目的框架包含了许多包，这些包都在一个仓库下进行管理（一个项目就一个仓库），但项目复杂时或追求扩展的时候，很难进行。（**模块拆分**）
- vue3.0 的性能优化大幅提高，支持 tree-shaking，不使用就不会被打包（依靠函数式的 api 实现）， vue3.0 中主要就是在写函数；在 vue2.0 中写的代码都是写在一个配置对象（options API）中的，这个对象中哪些属性需要，哪些代码需要都是无法被 vue2.0 判断的，自然没有 tree-shaking 一说，并且Vue2中很多方法（$nextTick）挂载到了实例中导致没有使用也会被打包（一些组件(transition组件，)也一样）
- Vue3允许自定义渲染器，扩展能力强。不会发生以前的事情，改写Vue源码改造渲染方式。 **扩展更方便**
- vue3.0 采用 ts 开发增强了类型检测，vue2.0 采用的时 flow 进行类型检测
- vu2.0 写起来有时很被动，必须按照框架的规则在特定部分写特定代码，写代码不够灵活
- vue2.0 后期引入 RFC，使得每个版本的改动可控 rfcs
- vue3.0 的源码体积优化，移除了部分 api，比如 filter 过滤器，实例的\$on,\$off,\$onec 和内联模块



#### 代码区别：

- Vue3.0 数据劫持采用 proxy（proxy 不会改变原对象，而是增加代理，使用方便，性能高，不会一上来就递归对象），而 Vue2.0 数据劫持采用的是 Object.defineProperty。Object.defineProperty 有性能缺陷和问题，该方法在 vue2.0 中会一上来就将对象进行完整的递归并给每个属性（**必须是一开始就存在的属性 **）改写为  get 和 set 方法（所以在 Vue2.0 中写代码时尽量将对象扁平化）,Vue2中**数组**不采用defineProperty来进行劫持 （浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理

  一、上来就完整递归的性能差；

  二、给每个属性改写 get，set 的性能也不高（算是重写对象属性了）；

  三、当给对象添加或者删除属性时，没法劫持和监听，导致 vue 中提供了\$set、\$delete API

  proxy 专门用于对象，数组拦截代理的，它性能本来就更高，它也不需要给属性设置 get 或者 set 方法（即不用重新定义原有属性），**也不用一开始就对 data 对象进行完整的递归，只有开发者在具体取到某一层时，才会再使用 proxy 进行代理。**

- Vue3.0 中对模板编译进行了优化，编译时生成了 Block tree，哪些数据不需要更新就进行标记， 可以对子节点的动态节点进行收集，可以减少比较并且采用了 patchFlag 标记动态节点

  在 vue2.0 中的模板优化，比如判断父节点是否为一个静态节点，如果是的话就不做对比，但期间仍然会编译整个 DOM tree 结构，没法避免对 DOM tree 的遍历。但是在 vue3.0 中对模板编译中，会生成 Block tree，Block tree 会描述一个标签一个标签中的动态属性（比如标签中的文本数据是动态插入的），vue3.0 会单独把这些动态的部分提取到一个数组中，数组中放着当前标签下所有动态的内容，这样在下次数据更新时只需要比较这些动态的部分是否变化即可，而且 vue3.0 中对动态的部分也进行了标记（类的动态，样式动态或文本动态等等）。

- Vue3.0 采用 compositionApi 进行组织功能整合业务代码逻辑，提取公共逻辑，解决反复横跳，优化复用逻辑（vue2.0 中的 mixin 带来的数据来源不清晰，命名冲突问题），相比 optionsApi 类型（vue2.0）推断更加方便

  optionsApi 类型（vue2.0）就是在写 vue 项目时总是提供一个配置对象（options），对象中放一些相对固定的属性与值，写一个功能需要将需要在不同部分进行联动，如 data 中放数据，methods 中放方法，在 mounted 中使用某个 methods 中的方法来修改 data 中的数据，代码内聚性很差。

  compositionApi 类型组织代码，可以将复用的代码抽为一个个的函数，之后在不同的地方进行引用，方便代码组合，而且可以将某一个功能需要的方法，数据等放在一个函数中集中管理。

  - Vue2中所有的属性都是通过`this`访问，`this`存在指向明确问题
  - Vue2中很多未使用方法或属性依旧会被打包，并且所有全局API都在Vue对象上公开。Composition API对 tree-shaking 更加友好，代码也更容易压缩。
  - 组件逻辑共享问题， Vue2 采用mixins 实现组件之间的逻辑共享； 但是会有数据来源不明确，命名冲突等问题。 Vue3采用CompositionAPI 提取公共逻辑非常方便

- 自定义渲染器，可以用来创建自定义的渲染器，改写 Vue 底层渲染逻辑

- 增加了 Fragment，Teleport，Suspense 组件

  Fragment：虚拟节点 Teleport：组件传送 Suspense：异步组件

- Hooks 函数增加代码的复用性，编写自己的 Hook 函数，将一部分独立的逻辑提取并且还可以做到响应式能力





## Vue3.0 架构分析

vue3.0 的源码采用 monorepo 方式进行管理，monorepo 是管理项目代码的一种方式，指在一个项目仓库（repo）中管理多个模块或者包（package）。一个个独立的包有自己的功能，最后组合他们实现一个完整的功能。

- 一个仓库可以维护多个模块（包），他们各自可以独立的发布，不用到处跳转找仓库

- 方便版本管理和依赖管理，模块之间的引用非常方便

- 仓库体积会变大（不足）

  

### vue3.0 的项目结构

左边是vue2的源码结构，右边是vue3的源码结构

![image-20231222175825575](images\image-20231222175825575.png)



- reactivity：响应式系统
- server-renderer：用于服务端渲染

运行时：

- runtime-core：与平台无关的运行时核心（可以创建争对特定平台的运行时——自定义渲染器）
- runtime-dom：针对浏览器的运行时，包括 DOM API，属性和事件处理等
- runtime-test：用于测试

编译时：

- compiler-core：与平台无关的编译器核心
- compiler-dom：针对浏览器的编译模块
- compiler-ssr：针对服务端渲染的编译模块
- compiler-sfc：针对单文件解析



- size-check：用于测试代码体积
- template-explorer：用于调试编译器输出的开发工具
- shared：多包共享内容
- vue：完整版本，包含运行时和编译器



**vue2.0 中的数据响应式是无感的，开发者只需要将数据放在 data 中就能是实现响应式能力，但 vue3.0 中就不一样了，我要把哪个数据变为响应式的，有开发者自行决定，用特定的 API 封装。**



编译时：

在Vue 3中，模板编译是将Vue模板转换为渲染函数的过程。它将模板的声明性结构转化为可执行的JavaScript代码，以便Vue可以根据模板生成对应的虚拟DOM并进行渲染。

模板编译的输入是Vue的模板，通常使用类似HTML的语法编写，包含了组件的结构、数据绑定、指令、事件处理等。模板中可以包含Vue的特殊语法，例如插值表达式`{{}}`、指令`v-if`、`v-for`等。

模板编译的结果是一个渲染函数，它是一个JavaScript函数，接收数据作为参数，并返回虚拟DOM。渲染函数可以被Vue的渲染器调用，用于生成实际的DOM并进行更新。

模板编译的过程包括以下步骤：

1. 解析：将模板解析为抽象语法树（AST）表示。
2. 优化：对AST进行优化，例如静态节点提升、静态属性提升、事件处理程序的缓存等。
3. 代码生成：根据优化后的AST生成可执行的JavaScript代码，其中包括创建虚拟DOM节点的代码、数据绑定的代码、事件处理的代码等。

在构建过程中，模板编译将会将该模板转换为渲染函数的代码。转换后的代码将包含对应的虚拟DOM节点的创建、数据绑定的代码以及事件处理的代码，以后每次组件更新时都可以直接调用渲染函数进行快速的渲染和更新操作，提高了Vue应用的性能和效率。

最终在运行时，Vue 将使用这个渲染函数来生成实际的DOM，并在数据变化时进行更新。



```jsx
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>
```

编译后的结果：

```js
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createElementBlock("template", null, [
        _createElementVNode("div", null, [
            _createElementVNode("h1", null, _toDisplayString(_ctx.message), 1 /* TEXT */),
            _createElementVNode("button", { onClick: _ctx.increment }, "Increment", 8 /* PROPS */, ["onClick"])
        ])
    ]))
}
```



运行时：运行时只是将虚拟DOM变为真实DOM，用于实际的应用程序运行和渲染，它不关心也不包含模板编译。

Vue 3的运行时包含了以下关键功能：

1. 虚拟DOM（Virtual DOM）：Vue使用虚拟DOM来表示应用程序的UI状态，并在数据变化时进行高效的DOM更新。虚拟DOM是一个轻量级的JavaScript对象树，与实际的DOM结构相对应。
2. 响应式系统：Vue 3的运行时包含了强大的响应式系统，它能够追踪数据的变化并自动更新相关的视图。当响应式数据发生变化时，运行时会触发重新渲染，以保持视图与数据的同步。
3. 组件系统：Vue 3的运行时支持组件的定义、注册和实例化。组件是Vue应用程序的基本构建块，它允许将UI分解为可复用的模块，并提供了组件间通信、生命周期钩子等功能。
4. 指令系统：Vue 3的运行时支持指令，指令是一种特殊的属性，用于在DOM上应用特定的行为或操作。指令可以修改DOM、添加事件监听器、进行数据绑定等。
5. 渲染函数：在运行时中，Vue使用渲染函数将组件的虚拟DOM转换为实际的DOM，并进行渲染和更新。渲染函数是由模板编译生成的可执行JavaScript代码。



![image-20231222181009824](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231222181009824.png)



在 Vue 3 中，"runtime-dom" 和 "runtime-core" 是两个独立的包，它们分别承担了不同的角色和功能。

1. runtime-dom（运行时 DOM）：runtime-dom 是 Vue 3 的运行时包之一，它专门用于**在浏览器环境**下进行应用程序的运行和渲染。它提供了与浏览器 DOM 直接交互的能力，例如创建、更新和删除 DOM 节点，处理事件等。runtime-dom 包含了与平台相关的逻辑，使 Vue 3 可以在浏览器环境中工作。
2. runtime-core（运行时核心）：runtime-core 是 Vue 3 的运行时核心包，它是运行时的通用部分，不依赖于具体的平台。它包含了 Vue 3 的核心功能，例如响应式系统、虚拟 DOM 的创建和更新算法、组件实例的生命周期管理等。runtime-core 是平台无关的，可以在不同的平台上使用，例如在浏览器、服务器端、桌面应用等。

runtime-dom 和 runtime-core 之间的关系是：runtime-dom 构建在 runtime-core 之上，它使用 runtime-core 提供的通用功能，并针对浏览器环境提供特定的实现。这种分离的设计使得 Vue 3 可以更好地适应不同的平台和环境，并实现更高的可扩展性和通用性。



在 Vue 3 中，"compiler-dom" 和 "compiler-core" 是两个独立的包，用于模板的编译和转换过程。

1. compiler-dom（编译器 DOM）：compiler-dom 是 Vue 3 的编译器包之一，它专门用于在浏览器环境下将模板编译为渲染函数。它提供了将模板解析为抽象语法树（AST）的功能，然后根据 AST 进行静态优化和代码生成，生成用于在浏览器环境中渲染的渲染函数。compiler-dom 依赖于浏览器 DOM API，因此它针对浏览器环境进行了特定的优化和转换。
2. compiler-core（编译器核心）：compiler-core 是 Vue 3 的通用编译器核心包，独立于具体的平台。它包含了模板编译的核心逻辑和算法，例如模板解析、AST 转换、静态优化、代码生成等。compiler-core 是平台无关的，可以在不同的平台上使用，例如在浏览器、服务器端、桌面应用等。

compiler-dom 和 compiler-core 之间的关系是：compiler-dom 构建在 compiler-core 之上，它使用 compiler-core 提供的通用编译器核心功能，并根据浏览器环境的特点进行特定的优化和转换。这种分离的设计使得 Vue 3 可以根据不同的平台和环境，使用统一的编译器核心，同时针对特定平台进行优化，实现更高效和更适应的模板编译。



#### ref 和 reactive 的区别：

ref 是让一个普通数据类型变为响应式，也可以获取节点。

reactive 是让一个复杂对象用 proxy 方式进行拦截。

vue3 和 react 看上去好像有点相同，但是 compositionApi 是靠响应式的原理，而 react 是靠每次的 render。





## 开发环境搭建

Vue3使用pnpm的workspace来实现monorepo。

```shell
npm install pnpm -g

pnpm init 

mkdir packages

pnpm install typescript -w  // 用于在指定的项目根目录（workspace）中安装依赖项。

```

创建多包管理配置文件pnpm-workspace.yaml

```yaml
packages:
 - 'packages/*'   - 表示该根目录下的packages目录中存放各个独立的模块
```

> 对于monorepo项目，当安装一个第三方包时，有可能该包是packages目录下某个项目私有的（私有的被安装在packages下该独立项目子项目的目录的node_modules中），也有可能是packages目录下的多个项目公共的（公共的包被安装在根目录下的node_modules目录中）。
>
> pnpm install qs -w （安装到当前工作目录的根模块，被公用）

![image-20230830183643229](.\images\image-20230830183643229.png)



`pnpm install xxx -w` 在一个使用 pnpm 管理的 monorepo 仓库中表示:

`-w` 相当于设置了一个工作目录过滤器，使依赖的安装仅安装在monorep项目的根目录中，实现了 monorepo 中不同包或项目的依赖隔离。所以 `-w` 是 pnpm 在 monorepo 中实现依赖隔离的一个重要机制。



pnpm 作为一个 monorepo 的包管理工具,可以对一个仓库的不同包或项目进行独立的依赖管理。`-w` 或 `--filter` 选项可以指定只在当前工作目录下安装依赖,而不影响仓库中的其他包。

例如:

```
my-monorepo/
  package.json
  packages/
    foo/
      package.json
    bar/
      package.json
```

在 `foo` 目录下执行:`pnpm install lodash`

这将**只在 `foo` 目录下**的 `node_modules` 里安装 `lodash`,不会影响到 `bar` 目录。这个安装时从互联网中进行安装。

**如果在monorepo仓库中，本地的foo仓库需要依赖本地bar仓库，那么需要指定被安装的包在本地monorepo仓库中查找，则使用命令：pnpm install bar@workspace --filter foo**。这样就可以在foo子项目中引入bar提供的方法了。



扩展：

> // .npmrc
>
> shamefully-hosit = true   将第三方模块的依赖进行打平到node_modules目录下（这是为pnpm设置的，因为pnpm安装时默认采用符号连接，将第三方的依赖放在node_modules/.pnpm目录下的，这样就能避免幽灵依赖的情况），但是npm本身就是使用打平安装的方式，所以使用npm安装时不需要设置该配置选项。
>
> npm不支持monorepo方式，yarn可以，但是配置麻烦。learna也可以。

![image-20230830183817517](.\images\image-20230830183817517.png)



### 安装依赖

```shell
pnpm install typescript esbuild minimist -w
```

编写使用esbuild进行打包的脚本文件：

scirpts/dev.js

```js
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';
import esbuild from 'esbuild';

const argv = minimist(process.argv.slice(2));
const format = argv.f || 'iife';
const target = argv._[0] || 'reactivity';

const __dirname = dirname(fileURLToPath(import.meta.url));

const namesMap = {
  reactivity: 'VueReactivity'
};

esbuild
  .context({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    sourcemap: true,
    format,
    globalName: namesMap[target],
    platform: 'browser'
  })
  .then((ctx) => ctx.watch());
```



## 源码文件

### packages/reactivity

packages/reactivity/src/index.ts

```ts
export * from "./effect";
export * from "./reactive";
```

packages/reactivity/src/effect.ts

```js
export let activeEffect = undefined;

function cleanupEffect(effect) {
  // {name:set(effect)} 属性对应的effect

  // 找到 deps中的set 清理掉effect才可以
  let deps = effect.deps;
  for (let i = 0; i < deps.length; i++) {
    // effect.deps = [newSet(),newSet(),newSet()]
    deps[i].delete(effect); // 删除掉 set中的effect
  }
  effect.deps.length = 0; // 让effect中的deps直接清空
}
class ReactiveEffect {
  parent = undefined;
  constructor(public fn) {}
  deps = []; // effect中要记录哪些属性是在effect中调用的
  run() {
    // 当运行的时候 我们需要将属性和对应的effect关联起来
    // 利用js是单线程的特性，先放在全局，在取值
    try {
      this.parent = activeEffect;
      activeEffect = this;

      cleanupEffect(this);
      return this.fn(); // 触发属性的get
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
}
// 属性和effect之间是什么样的关系 依赖收集
// 1:1
// 1:n
// n:n ✅

export function effect(fn) {
  // 将用户的函数，拿到变成一个响应式的函数
  const _effect = new ReactiveEffect(fn);
  // 默认让用户的函数执行一次
  _effect.run();
}

/*
// activeEffect = null
// effect(() => { //effect1.parent = activeEffect ;activeEffect = effect1
//     state.name;
//     effect(() => { //  effect2.parent = activeEffect
//         // activeEffect = effect2
//         state.age
//     })  // activeEffect = effect2.parent
//     state.address;
// })

// activeEffect = null
effect(() => {
  // effect1
  // activeEffect = effect1
  // effect1.parent = null
  // a
  effect(() => {
    // effect2
    // activeEffect = effect2
    // effect2.parent = effect1
    // b
    effect(() => {
      // effect3
      // activeEffect = effect3
      // effect3.parent = effect2
      // c
    });
    // activeEffect = effect2
    // activeEffecteffect1
  });
  // d -> effect1
});
*/

```





packages/reactivity/src/reactive.ts

```ts
import { isObject } from "@vue/shared";
import { ReactiveFlags, mutableHandlers } from "./baseHandler";

export function reactive(target) {
  return createReactiveObject(target);
}
const reactiveMap = new WeakMap(); // 防止内存泄露的
// 响应式对象的核心逻辑

function createReactiveObject(target) {
  if (!isObject(target)) {
    return;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  // 防止同一个对象被代理两次，返回的永远是同一个代理对象
  let exitstingProxy = reactiveMap.get(target);
  if (exitstingProxy) {
    return exitstingProxy;
  }
  // 返回的是代理对象
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  // 代理前 代理后做一个映射表
  // 如果用同一个代理对象像做代理，直接返回上一次的代理结果

  // 代理前 -> 代理后
  // 代理后 -> 代理前
  return proxy;
}

// 1.缓存结果
// 2.增添自定义属性

```





packages/reactivity/src/baseHandler.ts

```ts
import { activeEffect } from "./effect";

export enum ReactiveFlags {
  "IS_REACTIVE" = "__v_isReactive",
}

export const mutableHandlers = {
  // 原始对象 属性  代理对象
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, key);
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    let oldValue = target[key];
    let flag = Reflect.set(target, key, value, recevier);
    if (value !== oldValue) {
      trigger(target, key, value, oldValue);
    }
    return flag;
  },
};
// Map1 = {({ name: 'jw', age: 30 }):Map2}
// Map2 = {name: set()}
//  { name: 'jw', age: 30 } -> {name => [effect,effect]}

const targetMap = new WeakMap();
function track(target, key) {
  if (activeEffect) {
    // 当前这个属性实在effect中使用的我才收集，否则不收集
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      // 这里让effect也记录一下有哪些属性
    }
  }
}
//  { name: 'jw', age: 30 } -> {name => [effect,effect]}
function trigger(target, key, value, oldValue) {
  // 找到effect执行即可
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  if (effects) {
    effects = [...effects]; // vue2中的是数组，先拷贝在魂环
    effects.forEach((effect) => {
      // 当前正在执行的和现在要执行的是同一个我就屏蔽掉
      if (activeEffect !== effect) {
        effect.run(); // 里面有删除+添加的逻辑
      }
    });
  }
}

```





## 基本使用

```html
<div id="app"></div>
<script src="./reactivity.global.js"></script>
<script>
    const { reactive, effect, shallowReactive, shallowReadonly, readonly } = VueReactivity;
    // let state = reactive({ name: 'jw', age: 30 });
    // const state = shallowReactive({ name: 'jw', age: 30 })
    // const state = readonly({ name: 'jw', age: 30 })
    const state = reactive({ name: 'jw', age: 30})
    effect(() => { // 副作用函数 (effect执行渲染了页面)
        app.innerHTML = state.name + '今年' + state.age + '岁了'
    });
    setTimeout(() => {
        state.age++;
    }, 1000)
</script>
```



## 重点实现

1. `reactive`方法会将对象变成proxy对象， `effect`中使用`reactive`对象时会进行依赖收集，稍后属性变化时会重新执行`effect`函数。

2. reactive,, shallowReactive, shallowReadonly, readonly，这些方法接受的参数必须是一个对象类型。否则没有任何效果

3. getter和setter中必须要使用Reflect进行操作，保证this指向永远指向代理对象

   ```js
   // 返回的是代理对象
   const person = {
       name: 'jw',
       get aliasName() { // 属性访问器
           return 'handsome' + this.name
       }
   }
   
   const proxy = new Proxy(person, {
       get(target, key, recevier) {
           console.log(key)
           // target[key]  - this = person
           // Reflect.get(target, key, recevier); - this = receiver
           return Reflect.get(target, key, recevier);
       },
       set(target, key, value, recevier) {
           target[key] = value;
           return Reflect.set(target, key, value,recevier);;
       },
   });
   console.log(proxy.aliasName)
   
   // 如果用户修改了name属性 ，不用Reflect，我们是无法监控到的
   
   
   // effect(() => {
   //     console.log(proxy.aliasName)
   // })
   // proxy.name = 'wx'
   ```

   

4. 将对象使用proxy进行代理，如果对象已经被代理过，再次重复代理则返回上次代理结果。

5. 如果将一个代理对象传入，则直接返回

6. 默认执行`effect`时会对属性，进行依赖收集

7. 将属性和对应的effect维护成映射关系，后续属性变化可以触发对应的effect函数重新`run`

8. 触发时会进行清理操作（清理effect），在重新进行收集（收集effect）。在循环过程中会导致死循环





## reactiveApi 实现

vue3.0 中核心的 4 个 api：

- reactive：使得不管多少层的对象都有响应式能力，也就是能实现多层代理
- shallowReactive：对于多层对象，只对第一层实现响应式能力
- readonly：对象的任何属性都只能读不能改
- shallowReadonly：对象的第一层属性都只能读不能改，第二层以及内部层的可以修改
- 在effect的回调函数中使用的响应式数据会自动收集该effect

```js
let { reactive, shallowReactive, readonly, shallowReadonly } = vue

let state = reactive({name:'tom', age:{n:11}})  // state.age仍旧是一个代理对象proxy实例


let state = shallowReactive({name:'tom', age:{n:11}})  // state.age只是一个普通对象


let state = readonly({name:'tom', age:{n:11}})  // state是一个代理对象
state.name = 'jack'  // 提示警告信息说name是仅读属性，且修改不成功


let state = shallowReadonly({name:'tom', age:{n:11}})  // state是一个代理对象
state.age.n = 100  // 可以修改非第一层的属性
```

只读属性的话只能读不能改，则 Vue 源码中就不用收集依赖的变化。





### effect

- effect的回调函数默认会执行一次，如果内部依赖的响应式数据，响应式数据变化，该回调会再次执行
- effect的回调函数中还可以继续嵌套effect函数的调用
- effect的回调函数会在依赖的响应式数据发生改变时就立即执行，不表现出异步批量更新的机制
- effect函数执行后会有一个返回值，值的本质是该effect实例的run方法

```js
effect(()=>{
    console.log('123')
})

effect(()=>{
    console.log('123')
    effect(()=>{
        console.log('123')
        effect(()=>{
            console.log('123')
        })
    })
})

// ---------------------------------

effect(()=>{
    console.log('effect')  // 这个会打印3次，Vue源码也是打印3次
    app.innerHTML = state.name
})

state.name = 1
state.name = 2
state.name = 3
```



如果想实现异步更新的情况，需要自己编写代码逻辑：

```js
let isFlushing = false
const runner = effect(()=>{
    console.log('effect')  // 这个会打印1次
    app.innerHTML = state.name
},{
    scheduler(){
        if(!isFlushing){
            Promise.resolve().then(()=>{
                runner()
                isFlushing = false
            })
            isFlushing = true
        }
    }
})

state.name = 1
state.name = 2
state.name = 3
```





### computed

computed是基于源码的effect方法的，本质也是一个ComputedRefImpl实例对象，该对象实例上挂载了一个effect，并且他有一个dep属性会收集他依赖的effect。 

计算属性是可以在effect中使用的，挡在effect的回调函数中访问了计算属性的值（xxx.value）后，当计算属性依赖的其他响应式数据发生变化时，会触发计算属性收集的effect的run方法。

计算属性的特点：

- 不使用计算属性，传给computed的回调函数不执行
- 计算属性必须同步返回一个值，而无法使用异步回调中的返回值
- 有缓存能力，依赖的值不变就不重新计算
- 计算属性可以设置get和set，但是set并不是修改计算属性自身的值，而是在设置值时，处理其他逻辑
- 可以在模板中当作数据使用
- 依赖于其他响应式数据



```js
const state = reactive({firstName:'tom',lastName:'king'})

// 只提供了get的写法
const fullName = computed(()=>{
    return state.firstName + state.lastName
})

// 提供了get,set的写法
const fullName = computed({
    get(){
        return state.firstName + state.lastName
    },
    set(val){
		// todo others
    }
})

// 取计算属性的值的方式：
console.log(fullName.value)

effect(()=>{
    console.log(fullName.value)  // 触发执行
})

state.firstName = 'jack'
```





### watch

watch也是基于effect方法的。

computed重在基于已有的数据产生一个新的值且有缓存；watch更倾向于监控某个属数据的变化，数据变化后执行一些任务，没有缓存，每次页面渲染都重新执行。

在Vue3源码中watch API不再放在响应式模块（reactivity）中，而是在runtime-core模块中。

watch的使用：

```js
const state = reactive({firstName:'tom',lastName:'king'})


watch(state,(newVal,oldVal)=>{
    console.log(newVal,oldVal,'newVal,oldVal')
}, [
    {
        immediate:true
    }
])
state.firstName = 'abc'  // 这时打印的newVal和oldVal他们因为指向同一个引用，所以完全一样
```

- 对于监控的是对象类型的响应式数据时，是无法区分新值和老值的



```js
const state = reactive({firstName:'tom',lastName:'king'})


watch(()=>state.firstName,(newVal,oldVal)=>{
    console.log(newVal,oldVal,'newVal,oldVal')
}, [
    {
        immediate:true
    }
])
state.firstName = 'abc' 


// watch([()=>state.firstName,()=>state.lastName],()=>{

})
```

- 要监控响应式对象的某个属性，则必须写为函数，内部将函数包装到effect中并收集依赖



### watchEffect







前端 UI 库将 Modal（模态框）组件渲染到 `<body>` 元素中的主要原因是为了解决一些常见的问题和提供更好的用户体验。

1. 层级管理：将 Modal 组件直接渲染到 `<body>` 中，可以确保它在 DOM 层级上位于其他元素之上。这样做可以避免 Modal 受到其他元素的 z-index 影响，确保它能够在视觉上覆盖其他内容。
2. 遮罩效果：Modal 通常需要在打开时覆盖整个页面，并在背后创建一个遮罩层，以防止用户与背景交互。将 Modal 渲染到 `<body>` 中，可以更方便地创建一个与页面同级的遮罩层，并确保遮罩层覆盖整个页面。
3. 响应性：将 Modal 渲染到 `<body>` 中，可以确保它在不同的布局和视口尺寸下都能够正确地定位和显示。相对于将 Modal 渲染到父级组件中的某个容器中，直接渲染到 `<body>` 可以更灵活地应对不同的页面结构和布局需求。
4. 全局访问：将 Modal 组件渲染到 `<body>` 中，可以使其成为全局可访问的组件。这意味着无论在应用程序的哪个组件中需要打开 Modal，都可以通过调用相应的方法来触发，而不需要在组件层级中传递 Props 或事件。

需要注意的是，将 Modal 渲染到 `<body>` 中也可能带来一些潜在的问题，例如样式隔离和组件通信。为了解决这些问题，开发者通常会在 Modal 组件内部实现相应的隔离和通信机制，以确保其功能和样式不会对其他组件产生意外的影响。

综上所述，将 Modal 组件渲染到 `<body>` 中是为了解决层级管理、遮罩效果、响应性和全局访问等问题，提供更好的用户体验和开发便利性。





## DIFF

### 最长递增子序列

子序列：在一个序列中，一个子序列是指从原序列中选择出来的元素的集合，并且这些元素在原序列中的相对顺序保持不变。换句话说，可以通过在原序列中删除一些元素（可以为空）来获得一个子序列。

例如，对于序列 [1, 3, 5, 2, 4, 6]，它的一些子序列可以是：[1, 3, 5]、[1, 2, 4, 6]、[3, 5, 6] 等。在子序列中，元素之间的相对顺序保持不变，但不一定要求是连续的。

在最长递增子序列问题中，需要找到给定序列中的一个最长的递增子序列，其中递增子序列是指子序列中的元素按照严格递增的顺序排列。
