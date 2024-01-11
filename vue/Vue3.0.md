# Vue3.0

- Vue3开发环境搭建，设计理念（和Vue2一样）和整体框架
- 响应式原理，reactive，effect，watch，computed，ref原理
-  Vue3源码调试技巧，响应式数组，map和set处理
- 自定义渲染器原理及RuntimeDOM中的属性、事件处理
- 虚拟DOM原理、手写Vue3中diff算法及最长递增子序列实现原理
- 组件渲染原理、组件挂载流程、及异步渲染原理
- Vue3中生命周期原理，props、emit、slot、provide、inject实现原理
- Vue3中编译优化、patchFlags、blockTree，实现靶向更新（面试常考）
- 模板转化ast语法树，语法树的转化逻辑、优化、代码生成原理
- Vue中异步组件原理、函数式组件、Teleport、keep-alive，transition组件实现原理
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

2. 虚拟DOM。传统更新页面，每次数据更新都拼接一个完整的字符串innerHTML全部重新渲染；添加虚拟DOM后，操作真实DOM之前，可以比较新旧虚拟节点（DOM DIFF算法），找到变化再进行更新。小程序，单元测试并没有真实DOM概念，可以借助虚拟DOM模拟真实DOM，借助虚拟DOM可以跨平台，**虚拟DOM就是一个对象，用来描述真实DOM的**，下面是一个虚拟DOM的属性情况：

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

   在编写代码时，直接手写虚拟DOM树对象来描述页面UI是很繁琐的。都是通过编写.vue文件模板来开发项目，在打包编译时，将模板直接编译为js函数调用，函数执行后返回虚拟DOM。

   专门写个编译时可以将模板编译成函数，函数执行后返回虚拟DOM （在构建的时候进行编译性能更高，不需要在运行的时候进行编译，而且vue3在编译中做了很多优化）





## Vue3.0 的构建流程

### Vue2.0 和 Vue3.0 的区别

#### 宏观区别：

- vue3.0 的源码采用 monorepo 方式进行管理（将多个项目的代码存储到同一个仓库中），将包拆到不同的 package 目录中，多个包本身相互独立，有自己的功能逻辑，单元测试又方便管理，可以独立打包发布等。vue2.0 整个项目的框架包含了许多包，这些包都在一个仓库下进行管理（一个项目就一个仓库），但项目复杂时或追求扩展的时候，很难进行。（**模块拆分**）
- vue3.0 的性能优化大幅提高，支持 tree-shaking，不使用就不会被打包（依靠函数式的 api 实现）， vue3.0 中主要就是在写函数；在 vue2.0 中写的代码都是写在一个配置对象（options API）中的，这个对象中哪些属性需要，哪些代码需要都是无法被 vue2.0 判断的，自然没有 tree-shaking 一说，并且Vue2中很多方法（$nextTick）挂载到了实例中导致没有使用也会被打包（一些组件(transition组件，)也一样）
- Vue3允许自定义渲染器，扩展能力强。不会发生以前的事情，改写Vue源码改造渲染方式。 **扩展更方便**
- vue3.0 采用 ts 开发增强了类型检测，vue2.0 采用的时 flow 进行类型检测
- vu2.0 写起来有时很被动，必须按照框架的规则在特定部分写特定代码，写代码不够灵活
- vue3.0 的源码体积优化，移除了部分 api，比如 filter 过滤器，实例的\$on,\$off,\$onec 和内联模块



#### 代码区别：

- Vue3.0 数据劫持采用 proxy（proxy 不会改变原对象，而是增加代理，使用方便，性能高，不会一上来就递归对象），而 Vue2.0 数据劫持采用的是 Object.defineProperty。Object.defineProperty 有性能缺陷，该方法在 vue2.0 中会一上来就将对象进行完整的递归并给每个属性（**必须是一开始就存在的属性 **）改写为  get 和 set 方法（所以在 Vue2.0 中写代码时尽量将对象扁平化）,Vue2中**数组**不采用defineProperty来进行劫持 （浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理

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

  Fragment：虚拟节点  Teleport：组件传送   Suspense：异步组件

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



**vue2.0 中的数据响应式是无感的，开发者只需要将数据放在 data 中就能是实现响应式能力，但 vue3.0 中就不一样了，要把哪个数据变为响应式的，有开发者自行决定，用特定的 API 封装。**



编译时：

在Vue 3中，模板编译是将Vue模板转换为渲染函数的过程。它将模板的声明性结构转化为可执行的JavaScript代码，以便Vue可以根据模板生成对应的虚拟DOM并进行渲染。

模板编译的输入是Vue的模板，通常使用类似HTML的语法编写，包含了组件的结构、数据绑定、指令、事件处理等。模板中可以包含Vue的特殊语法，例如插值表达式`{{}}`、指令`v-if`、`v-for`等。

模板编译的结果是一个渲染函数，它是一个JavaScript函数，接收数据作为参数，并返回虚拟DOM。渲染函数可以被Vue的渲染器调用，用于生成实际的DOM并进行更新。

模板编译的过程包括以下步骤：

1. 解析：将模板解析为抽象语法树（AST）表示。
2. 优化：对AST进行优化，例如静态节点提升、静态属性提升、事件处理程序的缓存等。
3. 代码生成：根据优化后的AST生成可执行的JavaScript代码，其中包括创建虚拟DOM节点的代码、数据绑定的代码、事件处理的代码等。

在构建过程中，模板编译会将该模板转换为渲染函数的代码。转换后的代码将包含对应的虚拟DOM节点的创建、数据绑定的代码以及事件处理的代码，以后每次组件更新时都可以直接调用渲染函数进行快速的渲染和更新操作，提高了Vue应用的性能和效率。

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





## 开发环境搭建

Vue3使用pnpm的workspace来实现monorepo。

```shell
npm install pnpm -g

pnpm init 

mkdir packages
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

`pnpm install xxx -w` 在一个使用 pnpm 管理的 monorepo 仓库中表示：`-w` 相当于设置了一个工作目录过滤器，使依赖的安装仅安装在monorep项目的根目录中，实现了 monorepo 中不同包或项目的依赖隔离。所以 `-w` 是 pnpm 在 monorepo 中实现依赖隔离的一个重要机制。

pnpm 作为一个 monorepo 的包管理工具,可以对一个仓库的不同包或项目进行独立的依赖管理。`-w` 或 `--filter` 选项可以指定只在当前工作目录下安装依赖，而不影响仓库中的其他包。

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

这将**只在 `foo` 目录下**的 `node_modules` 里安装 `lodash`,不会影响到 `bar` 目录。这个安装是从互联网中进行安装。

**如果在monorepo仓库中，本地的foo仓库需要依赖本地bar仓库，那么需要指定被安装的包在本地monorepo仓库中查找，则使用命令：pnpm install bar@workspace --filter foo**。这样就可以在foo子项目中引入bar提供的方法了。

注意：bar必须是bar包下package.json中name的名字才行。



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



vue3源码打包后的生成的文件的格式说明：

1. esm-bundler：开发项目时一般使用这个包，它不会将依赖的其他模块的打包到一起，内部用过import语句去引入其他依赖的模块中的方法或者函数

   ![image-20231224192454865](images\image-20231224192454865.png)

   

2. esm-browser：一般用于在浏览器中使用，它是将它依赖的其他模块的代码一并打包生成一个大的文件，可以直接使用这个文件

   ![image-20231224192557427](images\image-20231224192557427.png)

3. global（IIFE）

4. commonjs

![image-20231224192255802](images\image-20231224192255802.png)

## 基本使用

```html
<div id="app"></div>
<script src="./reactivity.global.js"></script>
<script>
    const { reactive, effect, } = VueReactivity;
    const state = reactive({ name: 'jw', age: 30})
    effect(() => { // 副作用函数 (effect执行渲染了页面)
        app.innerHTML = state.name + '今年' + state.age + '岁了'
    });
    setTimeout(() => {
        state.age++;
    }, 1000)
</script>
```

- 传为reactive的对象会被代理，代理对象能拦截属性的取值，设置，删除和访问等操作
- 传给effect函数的回调函数默认会一开始就先执行一次
- 一旦传给effect函数的回调函数中依赖过的响应式数据发生改变，该回调函数会再次执行
- 如果一个响应式对象不再effect中使用，则该属性就不会收集effect

effect函数是库内部的底层函数，库中的其他常用的方法很多都基于它来实现的。



为什么使用反射Reflect：

```js
const person = {
    name: 'tom',
    
     // 属性访问器
    get aliasName() {
        return 'handsome' + this.name
    }
}

const proxy = new Proxy(person, {
    get(target, key, recevier) {
        console.log(key)
        // target[key]  -> this = person
        // Reflect.get(target, key, recevier); -> this = receiver
        return Reflect.get(target, key, recevier);
    },
    set(target, key, value, recevier) {
        target[key] = value;
        return Reflect.set(target, key, value,recevier);;
    },
});
console.log(proxy.aliasName)

effect(() => {
    console.log(proxy.aliasName)
})
proxy.name = 'jack'  // 如果用户修改了name属性 ，是无法监控到的
```

在vue3源码中，依赖的收集逻辑是在getter访问器中实现的，如果一个属性被访问了，但是没有走依赖访问器，那么该属性就不会收集到该effect。如果不用Reflect，那么在访问aliasName的时候，会触发aliasName收集effect，但是aliasName属性访问器内部有访问了原对象的name属性，原对象并不具备getter拦截，所以name就没办法收集effect，这样当通过代理对象徐修改name（proxy.name=‘xxx’）则有可能不触发effect的重新执行。  所以就需要使用Reflect来取值，这样aliasName中的this就指向的是代理对象了。



- 同一个对象不能被进行多次代理，多次代理返回同一个值（源码中使用原对象和代理对象的映射WeakMap来处理的）

```js
import { reactive, effect } from './reactivity.js'
const data = { name: 'jw', age: 30, flag: true }
const state1 = reactive(data);
const state2 = reactive(data);
state1 === state2  // true
```

- 一个已经代理过的对象将不再被代理（源码中是为代理对象增加一个唯一标识来识别对象是否被代理过）

  ```js
  import { reactive, effect } from './reactivity.js'
  const data = { name: 'jw', age: 30, flag: true }
  const state1 = reactive(data);
  const state2 = reactive(state1);
  state1 === state2  // true
  ```





### effect

effect接收一个可能需要被反复执行的函数，所以这个函数是需要被存放下来的。在源码中，是创建了一个ReactiveEffect实例对象来存放该函数，同时该实例对象原型上都是实现了run方法，在run方法中调用传递给effect的那个函数，实现对该函数的执行。只是执行之前，需要进行自己的一些业务逻辑，比如将该ReactiveEffect实例对象挂载到全局，这样在回调函数中访问了响应式对象的属性时，就能对该ReactiveEffect实例对象进行收集，后面该响应式对象的属性有变，则可以直接调用该ReactiveEffect实例对象上的run方法，实现对传给effect函数的再次执行。



```js
effect(() => {
    state.name 
    effect(() => {
        state.age
    })
    state.address  // 为了保证address属性也能收集到effect，则需要维护一个effect链  （vue2是用的栈结构）
})
```



如果一个响应式数据在effct中多次使用，该属性只需要收集一次该effect就可以

```js
effect(()=>{
    state.name; 
    state.name;
    state.name;
})
```



同一个effect不停的在执行，则会屏蔽

```js
effect(()=>{
    state.age = Math.random()
    console.log(stat.age)
})

state.age = 100
```



```js
effect(()=>{

    console.log(stat.age)
    effect(()=>{
        state.age = Math.random()
        console.log(stat.age)
    })
})

state.age = 100
```



```js
effect(() => {
    app1.innerHTML = state.flag ? state.name : state.age
    console.log('run')
})

setTimeout(() => {
    state.flag = false; // 会显示age
    setTimeout(() => {
        console.log('改了name，原则不应该触发effect')
        state.name = 'abc'; // 需要更新吗？   
    }, 1000)
}, 1000)
```

为了解决上面这种未使用的响应式属性也能触发更新的情况，需要在每次effect执行run时，先清空该所有响应式数据收集过的该effect自身。





```js
class ReactiveEffect {
    parent = undefined;  // 用于组成effect链
    deps = []; // effect中要记录那些属性的set中有该effect
    constructor(public fn) {}
    run() {
        // 当运行的时候 需要将属性和对应的effect关联起来
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
```



```js
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
    track(target, key);  // 依赖收集
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
    effects = [...effects]; 
    effects.forEach((effect) => {
      // 当前正在执行的和现在要执行的是同一个就屏蔽掉
      if (activeEffect !== effect) {
        effect.run(); // 里面有删除+添加的逻辑
      }
    });
  }
}
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

- 每个组件其实都是一个effect
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

effect(()=>{
    console.log('effect')  // 这个会打印1次
    app.innerHTML = state.name
}, {
    scheduler(){
        console.log('scheduler')   // 这个会打印3次
    }
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
    // 可以去调用响应式数据更新后的任务逻辑
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





effect函数可以接收第二个参数。这第二个参数中的scheduler函数默认不会一开始就执行，而是在响应式数据发生改变的情况下才会执行，不然就是执行原来的run方法。

```js
export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // 默认让用户的函数执行一次
    _effect.run();

    const runner = _effect.run.bind(_effect);
    return runner;
}
```



```js
function trigger(target, key, value, oldValue) {
    // 找到effect执行即可
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    let effects = depsMap.get(key);
    triggerEffects(effects);
}

export function triggerEffects(effects) {
    if (effects) {
        effects = [...effects]; // vue2中的是数组，先拷贝在魂环
        effects.forEach((effect) => {
            // 当前正在执行的和现在要执行的是同一个我就屏蔽掉
            if (activeEffect !== effect) {
                if (effect.scheduler) {
                    // 应该执行的是scheduler
                    effect.scheduler();
                } else {
                    effect.run(); // 里面有删除+添加的逻辑
                }
            }
        });
    }
}
```

vue中多次修改数据，页面只渲染一次也是因为内部自己实现了scheduler方法。



深度懒代理：

````js
reactive({name:'abc',age:18,msg:{address:'asd'}})
````



```js
export const mutableHandlers = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, key);
    let result = Reflect.get(target, key, recevier);
    if (isObject(result)) {
      // 如果取到的是一个对象 则需要继续将这个对象作为代理对象
      return reactive(result);
    }
    return result;
  }
}
```





### computed

computed是基于源码中的effect方法的，本质是一个ComputedRefImpl实例对象，该对象实例上挂载了一个effect，并且他有一个dep属性会收集他依赖的effect。 

计算属性是可以在effect中使用的，挡在effect的回调函数中访问了计算属性的值（xxx.value）后，当计算属性依赖的其他响应式数据发生变化时，会触发计算属性收集的effect的run方法。

计算属性的特点：

- 不使用计算属性，传给computed的回调函数不执行
- 计算属性必须同步返回一个值，而无法使用异步回调中的返回值
- 有缓存能力，依赖的值不变就不重新计算
- 计算属性可以设置get和set，但是set并不是修改计算属性自身的值，而是在设置值时，处理其他逻辑
- 可以在模板中当作数据使用，watchapi则不行
- 依赖于其他响应式数据

```js
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

```

取计算属性的值的时候，使用的computedPro.value，必须使用.value才可以，因为计算属性是可以在effect中使用的，且具备响应式特点，所以不访问属性就无法触发getter进行依赖收集。

```js
import { computed, reactive, effect } from './reactivity.js'

const state = reactive({ firstname: 'j', lastname: 'w', age: 30 });
const fullname = computed({
    get: () => { // get
        console.log('computed~~~')
        return state.firstname + state.lastname
    },
    set: (val) => {
        console.log(val); // vuex
    }
})

// 计算属性也是一个effect， 依赖的状态会收集计算属性的effect
// 计算属性会触发他收集的effect
effect(() => { // 计算属性也可以收集effect
    console.log(fullname.value, 'effect')
})

setTimeout(() => {
    state.firstname = 'x'
}, 1000)
```

为什么修改了传给计算属性的ge方法中使用到的响应式依赖发生改变，会触发计算属性的更新？

原因是计算属性也是一个effect，计算属性使用到的响应式状态也会收集该计算属性对应的effect实例，每当响应式状态发生改变，会触发响应式状态的setter，依次触发该状态收集的effect的**run方法或者scheduler方法**，其中计算属性的effect在源码内部自行实现了一个scheduler方法，该方法会去调用该计算属性收集的其他effect，并触发他们的更新（整个机制类似一个不断向上传递的过程）。



```js
import { isFunction } from "@vue/shared";
import { ReactiveEffect, activeEffect } from "./effect";
import { trackEffects, triggerEffects } from "./baseHandler";

class ComputedRefImpl {
    effect;
    _value;
    dep = new Set();
    _dirty = true;
    constructor(public getter, public setter) {
        // 计算属性就是一个effect 会让getter中的属性收集这个effect
        this.effect = new ReactiveEffect(getter, () => {
            // 重点看这段，可以看出计算属性中自己实现了一个scheduler，它会在响应式对象发生改变的情况下被执行
            if (!this._dirty) {
                this._dirty = true; // 让计算属性标记为脏值
                triggerEffects(this.dep);
            }
        });
    }
    get value() {
        if (activeEffect) {
            // value => [effect]
            trackEffects(this.dep);
        }
        if (this._dirty) {
            this._dirty = false;
            // 取值让getter执行拿到返回值，作为计算属性的值
            this._value = this.effect.run();
        }
        return this._value;
    }
    set value(val) {
        // 修改时触发setter即可
        this.setter(val);
    }
}

export function computed(getterOrOptions) {
    const isGetter = isFunction(getterOrOptions);
    let getter;
    let setter;
    if (isGetter) {
        getter = getterOrOptions;
        setter = () => {
            console.warn("computed is readoly");
        };
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }

    return new ComputedRefImpl(getter, setter);
}
```







### watch

watch也是基于effect方法的。

computed重在基于已有的数据产生一个新的值且有缓存；watch更倾向于监控某个属数据的变化，数据变化后执行一些任务，没有缓存。

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



watchApi会将传递给它的第一个参数作为ReactiveEffect构造函数的第一个参数。当响应式数据改变后直接走回调。

```js
import { isReactive } from './reactive';
import { ReactiveEffect } from './effect';
import { isFunction, isObject } from '@vue/shared';
// 对象的深拷贝  {...source}浅拷贝
function traverse(source, seen = new Set()) {
    if (!isObject(source)) {
        return source;
    }
    if (seen.has(source)) {
        return source;
    }
    seen.add(source);
    for (let k in source) {
        // 这里访问了对象中的所有属性
        traverse(source[k], seen);
    }
    return source;
}

/**
 *
 * @param source 可能是一个响应式对象或者一个包含响应式数据的函数
 * @param cb // 响应式数据发生变化后需要执行的回调函数，该回调就收新旧值且接收第三个参数
 * @param options
 */
function doWatch(source, cb, options) {
    let getter;
    //必须式响应式对象或者含有响应式数据的函数
    if (isReactive(source)) {
        getter = () => traverse(source);
    } else if (isFunction(source)) {
        getter = source;
    }

    let oldValue;
    let clean;
    const onCleanup = (fn) => {
        clean = fn;
    };

    const job = () => {
        if (cb) {
            if (clean) clean();
            const newValue = effect.run();
            cb(newValue, oldValue, onCleanup);
            oldValue = newValue;
        } else {
            effect.run();
        }
    };
    
    //  本质也是一个内部实现了一个scheduler函数的effect
    const effect = new ReactiveEffect(getter, job);

    if (options.immediate) {
        job();
    }else{
        oldValue = effect.run();
    }
}
export function watchEffect(effect, options: any = {}) {
    doWatch(effect, null, options); // === effect
}
export function watch(source, cb, options: any = {}) {
    doWatch(source, cb, options);
}
```



竞态问题：

```js
const map = {
    1: { timer: 3000, returnVal: 'abc' },
    2: { timer: 2000, returnVal: 'bcd' }
}
function getData(newVal) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(map[newVal].returnVal)
        }, map[newVal].timer)
    })
}

// 默认watchApi 内部自己实现了scheduler. 我们把他改成了同步了
let arr = []
// 闭包：声明函数的作用域和执行的上下文不是同一个
watch(() => state.n, async (newVal, oldVal, onCleanup) => {
    let flag = true
    onCleanup(function () {
        flag = false
    })
    let r = await getData(newVal)
    flag && (app.innerHTML = r)
}, { 'flush': 'sync' })
state.n++;
state.n++
// 结果bcd
```





### watchEffect

watchEffect内部就是effect。

```js
import { reactive, watch, watchEffect } from './reactivity.js'
const state = reactive({ firstname: 'j', lastname: 'w', age: 30, n: 0 });

watchEffect(() => {
    app.innerHTML = state.firstname + state.lastname
});

setTimeout(() => {
    state.firstname = 'X'
}, 1000);
```



源码中effect逻辑：

```js
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
    
  const runner = _effect.run.bind(_effect);
  return runner;
}

```

源码中watchEffect的逻辑：

```js
export function watchEffect(effect, options: any = {}) {
  doWatch(effect, null, options); // === effect
}

// 针对watchEffect传参简化后的doWatch逻辑
function doWatch(source, cb, options) {
  let getter = source;
  const job = () =>effect.run()
  const effect = new ReactiveEffect(getter, job);
  oldValue = effect.run();
}
```

可以看出doWatch本质就是effect。



### ref

希望对基本数据类型的值提供响应式能力。它和计算属性有些相似。

```js
const flag = ref(true)

effect(() => {
    app.innerHTML = flag.value?1:2;
})
setTimeout(() => {
    flag.value = false
}, 1000)
```

ref函数可以接受一个基本数据类型的值，也可以接受对象，如果传递的是对象，则直接将对象变为一个响应式对象，然后挂载到value上。

ref不会创建一个effect，但是在获取它的value时，它会收集它依赖的effect，当给value设置值的时候会触发effect重新执行。

```js
import { trackEffects, triggerEffects } from "./baseHandler";
import { activeEffect } from "./effect";
import { toReactive } from "./reactive";

export function ref(value) {
  return new RefImpl(value);
}

// computed + watch
class RefImpl {
  _value;
  dep = new Set();
  // 内部采用类的属性访问器 -》 Object.defineProperty
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this.rawValue) {
      this.rawValue = newVal;
      this._value = toReactive(newVal);
      triggerEffects(this.dep);
    }
  }
}

// 本质是对reactive数据进行代理
class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key];
  }
  set value(val) {
    this.object[this.key] = val;
  }
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(object) {
  let res = {};
  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}

```



将多个响应式对象变为一个响应式对象：

方式一：

```js
const state1 = reactive({ name: 'jw' })
const state2 = reactive({ age: 30 });

const r = { name: ref(state1.name), age: ref(state2.age) }
watchEffect(() => {
    app.innerHTML = r.name.value + r.age.value
})
setTimeout(() => {
    r.name.value = 'xxx'
}, 1000)
```



方式二：使用vue3提供的方法 toRef

```js
const state1 = reactive({ name: 'jw' })
const state2 = reactive({ age: 30 });

const r = { name: toRef(state1, 'name'), age: toRef(state2, 'age') }
watchEffect(() => {
    app.innerHTML = r.name.value + r.age.value
})
setTimeout(() => {
    r.name.value = 'xxx'
}, 1000)
```



方式三：

```js
const state1 = reactive({ name: 'jw' })
const state2 = reactive({ age: 30 });

const r = { ...toRefs(state1), ...toRefs(state2) }
watchEffect(() => {
    app.innerHTML = r.name.value + r.age.value
})
setTimeout(() => {
    r.name.value = 'xxx'
}, 1000)
```





## runtime-core / runtime-dom

vue3区分编译时和运行时。

编译时：包含模板编译逻辑，将类html模板编译为js函数调用

- compiler-dom (针对dom的编译)/ compiler-core（进行非平台相关的编译）



运行时：不包含模板编译，直接基于虚拟DOM实现后续逻辑

- runtime-dom（浏览器操作的一些api,dom的增删改查） / runtime-core(并不关新调用了哪些api)

在runtime-dom编写了一些列的关于浏览器DOM的增删改查原生方法，传递给runtime-core中的方法，runtime-core内部调用这些方法实现针对浏览器平台的一些DOM操作。



之所以又要区分core和dom，是为了方便跨平台，不同环境核心一样，但逻辑不同。 runtime-dom写好一些关于特定平台的类似DOM的操作方法，传递给core，core内部调用这些方法实现渲染。



vue在runtime-dom提供的一个方法——createRenderer，这个方法接受用户自定义的渲染方式。runtime-dom基于runtime-core

mpvue就是基于vue改造的一个小程序版本，将vue源码中设计dom操作的方法改为小程序的。

基本使用：

```js
import { createRenderer, h, render } from '/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-browser.js'

// 核心就是利用渲染器来渲染虚拟dom
const VDom = h('div', {style:{color:'red'}}, 'hello jw')

const renderer = createRenderer({
    insert(element, container) {
        container.appendChild(element)
    },
    createElement(element) {
        return document.createElement(element)
    },
    setElementText(element, text) {
        element.innerHTML = text
    }
});

renderer.render(VDom, body); 
```

h方法在vue中就是创建一个虚拟DOM节点的方法，类似于react中createElement方法。



```ts
function createRenderer<HostNode, HostElement>(
options: RendererOptions<HostNode, HostElement>
): Renderer<HostElement>{

}

interface Renderer<HostElement> {
    render: RootRenderFunction<HostElement>
    createApp: CreateAppFunction<HostElement>
}

interface RendererOptions<HostNode, HostElement> {
    patchProp(
    el: HostElement,
     key: string,
     prevValue: any,
     nextValue: any,
     // 其余部分在大多数自定义渲染器中是不会使用的
     isSVG?: boolean,
     prevChildren?: VNode<HostNode, HostElement>[],
     parentComponent?: ComponentInternalInstance | null,
     parentSuspense?: SuspenseBoundary | null,
     unmountChildren?: UnmountChildrenFn
    ): void
    insert(
    el: HostNode,
     parent: HostElement,
     anchor?: HostNode | null
    ): void
    remove(el: HostNode): void
    createElement(
    type: string,
     isSVG?: boolean,
     isCustomizedBuiltIn?: string,
     vnodeProps?: (VNodeProps & { [key: string]: any }) | null
    ): HostElement
    createText(text: string): HostNode
    createComment(text: string): HostNode
    setText(node: HostNode, text: string): void
    setElementText(node: HostElement, text: string): void
    parentNode(node: HostNode): HostElement | null
    nextSibling(node: HostNode): HostNode | null

    // 可选的, DOM 特有的
    querySelector?(selector: string): HostElement | null
    setScopeId?(el: HostElement, id: string): void
    cloneNode?(node: HostNode): HostNode
    insertStaticContent?(
    content: string,
     parent: HostElement,
     anchor: HostNode | null,
     isSVG: boolean
    ): [HostNode, HostNode]
}
```



runtime-dom模块中提供的createRenderer方法是允许用户自己将节点操作逻辑自行实现后传递给他，于此同时runtime-dom模块中内自己内置实现了一些列关于浏览器dom操作的原生方法，并传递给了createRenderer，然后返回一个render方法，这样用户就可以直接将虚拟DOM传递给render方法，就可以实现针对浏览器的DOM操作了。

render方法可以让用户将自己的指定的虚拟DOM渲染到指定的DOM容器中，而不一定是渲染到div#app中。



在runtime-dom中对于事件的绑定的思路：

事件可能之前绑定的是一个事件，现在绑定的是另一个事件，不能简单考虑使用addEventlistener，因为不断绑定事件，是能绑定多个事件而不覆盖的。



```js
function createInvoler(val) {
    const invoker = (e) => invoker.val(e);
    invoker.val = val;
    return invoker;
}


function patchEvent(el, eventName, nextValue) {
    // 对于事件而言，我们并不关心之前是什么，而是用最新的结果
    const invokers = el._vei || (el._vei = {});
    const exists = invokers[eventName];
    // click：custormEvent -> e
    // 通过一个自定义的变量 ， 绑定这个变量，后续更改变量对应的值
    if (exists && nextValue) {
        exists.val = nextValue; // 换绑事件
    } else {
        const name = eventName.slice(2).toLowerCase();
        if (nextValue) {
            const invoker = (invokers[eventName] = createInvoler(nextValue));
            el.addEventListener(name, invoker);
        } else if (exists) {
            el.removeEventListener(name, exists);
            invokers[eventName] = null;
        }
    }
}
```



在模板中事件是使用的@click来绑定的，比如：

```vue
<div @click='add'>Hello World</div>
```

经过模板编译后，得到如下结果：

```js
import { openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", { onClick: _ctx.add }, "Hello World", 8 /* PROPS */, ["onClick"]))
}

// Check the console for the AST
```

其中@click被转为了onClick。



vue3内部封装了一个内置了DOM操作的方法——render。render 方法是非常常用，在vue中想渲染一个弹框组件，需要渲染到body。

前端 UI 库将 Modal（模态框）组件渲染到 `<body>` 元素中的主要原因是为了解决一些常见的问题和提供更好的用户体验。

1. 层级管理：将 Modal 组件直接渲染到 `<body>` 中，可以确保它在 DOM 层级上位于其他元素之上。这样做可以避免 Modal 受到其他元素的 z-index 影响，确保它能够在视觉上覆盖其他内容。
2. 遮罩效果：Modal 通常需要在打开时覆盖整个页面，并在背后创建一个遮罩层，以防止用户与背景交互。将 Modal 渲染到 `<body>` 中，可以更方便地创建一个与页面同级的遮罩层，并确保遮罩层覆盖整个页面。
3. 响应性：将 Modal 渲染到 `<body>` 中，可以确保它在不同的布局和视口尺寸下都能够正确地定位和显示。相对于将 Modal 渲染到父级组件中的某个容器中，直接渲染到 `<body>` 可以更灵活地应对不同的页面结构和布局需求。
4. 全局访问：将 Modal 组件渲染到 `<body>` 中，可以使其成为全局可访问的组件。这意味着无论在应用程序的哪个组件中需要打开 Modal，都可以通过调用相应的方法来触发，而不需要在组件层级中传递 Props 或事件。

需要注意的是，将 Modal 渲染到 `<body>` 中也可能带来一些潜在的问题，例如样式隔离和组件通信。为了解决这些问题，开发者通常会在 Modal 组件内部实现相应的隔离和通信机制，以确保其功能和样式不会对其他组件产生意外的影响。

综上所述，将 Modal 组件渲染到 `<body>` 中是为了解决层级管理、遮罩效果、响应性和全局访问等问题，提供更好的用户体验和开发便利性。





Vue源码中为什么提供一个h方法了，首先h方法的作用是根据传参生成一个虚拟DOM。如果让用户手动去编写虚拟DOM是非常繁琐的，所以才提供了一个h方法来简化虚拟DOM的创建操作。

### h

h方法接受的参数是多种多样的。h方法中调用createVNode方法创建虚拟DOM节点。

```js
const VDom = h('div')
const VDom = h('div', 'hello')
const VDom = h('div', h('span'))
const VDom = h('div', { style: { color: 'red' } })
const VDom = h('div', [ h('span'), h('span') ])
const VDom = h('div', h('span'), h('span')) // 错误写法会被认为第二个参数是属性
const VDom = h('div', {}, [h('span'), h('span')])
const VDom = h('div', {}, h('span'), h('span'))

const VDom = h('div',{} ,'hello')
const VDom = h('div', {},['hello', 'hello', 'hello'])
const VDom = h('div', {}, 'hello', 'hello', 'hello')
```



一个虚拟DOM节点除了标识自己是什么节点以外，还需要连带标识其子节点是什么。为此，vue源码中引入了基于二进制ide形状标识枚举类型。

vue中的形状标识：

```ts
export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 状态组件
  TEXT_CHILDREN = 1 << 3, // 文本孩子
  ARRAY_CHILDREN = 1 << 4, // 数组孩子
  SLOTS_CHILDREN = 1 << 5, // 组件的插槽
  TELEPORT = 1 << 6, // 传送门组件
  SUSPENSE = 1 << 7, // 懒加载组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // keep-alive
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
```



```js
export function createVNode(type, props, children = null) {
    // React.createElement
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
    const vnode = {
        shapeFlag,
        __v_isVNode: true,
        type,
        props,
        key: props && props.key,
        el: null, // 每个虚拟节点都对应一个真实节点，用来存放真实节点的后续更新的时候会产生新的虚拟节点，比较差异更新真实DOM
        children,
    };
    if (children) {
        let type = 0;
        if (Array.isArray(children)) {
            type = ShapeFlags.ARRAY_CHILDREN;
        } else {
            type = ShapeFlags.TEXT_CHILDREN;
        }
        vnode.shapeFlag |= type;
    }
    return vnode;
}
```







## DIFF

1. 新增节点是直接依次深度递归遍布虚拟DOM，依次创建真实DOM并插入到容器节点中

2. 如果新的虚拟DOM不存在，则直接移除老的DOM节点即可

3. 如果父级元素不是同一个节点（类型相同，key也相同），即使后代节点完全一样，也会删除之前得DOM节点重新基于新得虚拟DOM树进行创建

   ```js
   export function isSameVnode(n1, n2) {
     return n1.type === n2.type && n1.key === n2.key;
   }
   ```

   





### 最长递增子序列

子序列：在一个序列中，一个子序列是指从原序列中选择出来的元素的集合，并且这些元素在原序列中的相对顺序保持不变。换句话说，可以通过在原序列中删除一些元素（可以为空）来获得一个子序列。

例如，对于序列 [1, 3, 5, 2, 4, 6]，它的一些子序列可以是：[1, 3, 5]、[1, 2, 4, 6]、[3, 5, 6] 等。在子序列中，元素之间的相对顺序保持不变，但不一定要求是连续的。

在最长递增子序列问题中，需要找到给定序列中的一个最长的递增子序列，其中递增子序列是指子序列中的元素按照严格递增的顺序排列。





## 组件

组件的特点、渲染、特性、插槽、事件、props、更新等。

组件能复用，方便维护同时能**局部更新**。Vue3中每个组件都对应一个自己effect。对于响应式的数据被在一个组件中使用，那么这个响应式数据就会收集该组件的effect。响应式数据变化就能精确的定位到该组件进行更新，提高性能。也可以异步加载组件。

this指代不明确，ts无法对this进行推断，同时this不支持tree-shaking。

在vue2中组件同时存在template字段和render字段时，render的优先级更高，只写template本质也是被转为render函数（前提是有模板编译部分的程序）。

模板编译最终是把模板 -> render返回的结果 -> 虚拟dom(h方法返回的是虚拟dom)  -> 渲染成真实的dom



基本使用：

```js
// 创建组件
const MyComponent = {
    props: {
        a: Number,
        b: Number,
    },
    data() {
        return { name: 'tom', age: 30 }
    },
    // 模板编译 最终是把模板 -> render返回的结果 -> 虚拟dom(h方法返回的是虚拟dom)  -> 渲染成真实的dom
    render(proxy) {
        console.log(this)  // this就是组件实例的代理对象
        return h('div', {}, [h('span', proxy.a), h('span', proxy.b), h('span', proxy.$attrs.c)])
    }
}

// vue2中  attrs(组件标签上的属性) , props(我给你传递的自定义属性不在attrs中的)
render(h(MyComponent, { a: 1, b: 2, c: 1 }), app);
```

组件对象调用h方法生成它对应的虚拟DOM。针对组件，它的shapeFlag的值是标识的组件的值，组件它对应虚拟DOM节点的children属性的值是插槽。

每个组件都对应一个effect实例，组件的render函数执行后返回的虚拟DOM在源码内部被称作subTree。 

组件除了组件对应的虚拟DOM对象以外，在源码的内部，还为每个组件创建了一个一一对应的组件实例，并增加了一些标识和记录属性。

```js
export function createInstance(n2) {
  const instance = {
    // 组件的实例，用它来记录组件中的属性
    setupState: {},
    state: {},
    isMounted: false, // 是否挂栽成功
    vnode: n2, // 组件的虚拟节点
    subTree: null, // 组件渲染的虚拟节点
    update: null, // 用于组件更新的方法
    propsOptions: n2.type.props, // 用户传递的props
    props: {},
    attrs: {},
    slots: {},
    render: null,
    proxy: null, // 帮我们做代理 -> proxyRefs
  };
  return instance;
}
```

组件的更新分为两种：

1. 组件的父级传给自己的props或者插槽改变触发的更新
2. 组件自己的state（组件自己的响应式数据）改变导致重新执行自己的render函数的更新

组件对应的effect实现了自己的调度函数，用于在本轮事件循环中，异步渲染更新的结果。即本轮事件循环中，同步多次更改组件的响应式数据，只会触发组件的render函数执行一次。

htnl标签元素的更新如果能复用，复用的是挂载到元素对应的虚拟DOM上的el属性，这个属性的值是在第一次创建虚拟DOM对应的真实DOM节点时绑定的。

组件的更新，如果能复用，复用的是组件对应的instance实例，在组件第一次挂载时，组件实例被绑定到组件对应的虚拟DOM对应的component属性上了。

```js
let el = n2.el = n1.el

let instance = n2.component = n1.component  // 组件没有真实DOM，只有组件实例，组件的子节点在组件实例的subTree属性上
instance.subTree.el  (keep-alive也会用到)
```



对于父组件传递给子组件的props，在子组件中直接修改这些props的值是不符合规范的，同时在源码中，传递给子组件的props是使用shalloReactive实现响应式的。







## setUp

setup函数中返回的对象，如果时ref，在源码的内部会使用proxyRefs方法做代理，代理访问ref数据上的value属性。



## 面试

### 对Vue的理解

一个数据驱动的用于构建用户见面的渐进式框架，vue的核心是只关注视图层。

1.  声明式渲染
2. 组件化开发
3. 客户端路由
4. 状态管理
5. 构建工具





MVVM模式与MVC模式

目的：职责划分，分层管理。







## 扩展

node中默认支持的是commonjs规范。如果在项目的package.json目录下设置type:'module'，将开启项目的esmodule规范而只能使用import和export了。但是在前面这种情况下，如果还是想使用commonjs中的require操作，则就需要借助node:module库的createRequire方法来创建一个模拟的require方法。

node中默认是不持支通过import  ‘xxx/xxx/xx.json’这种方式导入json文件的。

```js
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)  //以当前文件所在目录为基准创建一个require方法

const pkg = require(`../packages/${target}/package.json`)

```







