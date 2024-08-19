- 关注技术细节
- 设计思想
- 框架的设计权衡
- 从设计角度出发，理解一些具体实现为什么选择这种方案



- vue3继承了vue2的易用性，同时使用了更少的代码实现了更多的功能
- vue3在模块拆分和设计上非常合理，模块之间的耦合程度非常低，大多数模块可以独立安装使用，而不需要借助完整的vuejs运行时
- vue3中的内建组件和模块能很好的配合tree-shaking机制实现按需引入和打包体积的最小化
- vue3的可扩展性非常强，开发者可以编写自己的渲染器，甚至是自己的编译器插件来实现自定义模板语法
- vue3中的很多功能设计谨遵规范，如Proxy依据ESMAScript规范，模板解析器遵从WHATWG规范



内容：

- 基于对框架的设计理解，逐渐实现vue3中的各个功能模块
- 类HTML语法的模板解析器和实现一个支持插件架构的模板编译器
- 框架设计的核心要素和设计时的权衡
- 三种基于虚拟DOM的DIff算法
- vue中组件化的实现原理
- 服务端，客户端渲染，同构渲染之间的差异与原理



## 第一章

以全局视角，审视**视图层框架**的设计问题，不然容易困在细节中而看不清全貌和整体的方向。



### 声明式和命令式

声明式和命令式是视图层框架常采用的两种编程范式。

**命令式框架**

jQuery就是典型的命令式框架，命令式框架的一大特点就是——**关注过程**。代码本身描述的就是做事的过程，符合一般人的行为逻辑。

**声明式框架**

声明式框架的一大特点就是——**关注结果**。框架帮助开发者封装了过程，框架的内部实现还是依赖的命令式代码，只是将声明式的写法暴露给开发者。



**vue是基于什么目的选择了声明式**

**在框架层面，主要是出于对性能与可维护性之间的权衡。**



**声明式代码的性能不一定优于命令式代码。**

例子：将 div 标签的文本内容由hello world 修改为 hello vue3。

命令式代码明确知道要修改的是什么，所以直接调用相关命令操作即可： div.textContent = 'hello vue3' // 直接修改。理论上命令式代码可以做到极致的性能优化，因为明确知道哪些发生了变更，只做必要的修改就行了。

声明式代码不一定能做到这一点，因为它描述的是结果：

```vue
<!-- 之前： -->
<div @click="() => alert('ok')">hello world</div>
<!-- 之后： -->
<div @click="() => alert('ok')">hello vue3</div>
```

对于框架来说，为了实现最优的更新性能，它需要找到前后的差异并只更新变化的地方，但是最终完成这次更新的代码仍然是：div.textContent = 'hello vue3'

如果把直接修改的性能消耗定义为 A，把找出差异的性能消耗定义为 B，那么有： 

- 命令式代码的更新性能消耗 = A 
- 声明式代码的更新性能消耗 = B + A

框架本身就是封装了命令式代码才实现了面向用户的声明式。



从性能角度，声明式性能不及命令式。但是vue选择了声明式方案，**原因就在于声明式代码的可维护性更强。**

在采用命令式代码开发的时候，需要维护实现目标的整个过程，包括要手动完成 DOM 元素的创建、更新、删除等工作。而声明式代码展示的就是要的结果，看上去更加直观，至于做事的过程，并不需要关心，Vue.js 封装好了。



在保持可维护性的同时尽量让找出差异的那部分的性能消耗最小。

### 虚拟DOM

为什么需要虚拟DOM？

前面说过，声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗，因此，如果能够**最小化找出差异的性能消耗**，就可以让声明式代码的性能无限接近命令式代码的性能。**虚拟 DOM，就是为了最小化找出差异这一步的性能消耗而出现的。**

**理论上**基于虚拟DOM的更新不可能比直接地原生JavaScript操作DOM更高效。之所以说理论上，因为在大部分情况 下，很难写出绝对优化的命令式代码，尤其是当应用程序的规模很大的时候，即使写出了极致优化的代码，也一定耗费了巨大的精 力，这时的投入产出比其实并不高。

虚拟DOM的引入，能在开发体验（效率）和应用性能上取得一个不错的平衡效果。



**innerHTML和虚拟DOM的性能对比：**

**创建页面时的性能对比：**

innerHTML创建、更新页面的过程，对于 innerHTML 来说， 为了创建页面，需要构造一段 HTML 字符串，接着将该字符串赋值给 DOM 元素的 innerHTML 属性：

```js
const html = `
<div><span>...</span></div>
`

div.innerHTML = html
```

为了渲染出页面，首先要把字符串解析成 DOM 树，这是一个 DOM 层面的计算。涉及 DOM 的运算要远比 JavaScript 层面的计算性能差，这有一个跑分结果可供参考，如图。

![image-20231228103230870](images\image-20231228103230870.png)

上边是纯 JavaScript 层面的计算，循环 10000 次，每次创建一个 JavaScript 对象（虚拟DOM对象）并将其添加到数组中；下边是 DOM 操作， 每次创建一个 DOM 元素并将其添加到页面中。跑分结果显示，纯 JavaScript 层面的操作要比 DOM 操作快得多，它们不在一个数量级上。

可以用一个公式来表达通过 **innerHTML 创建页面的性能：HTML 字符串拼接的计算量 + innerHTML 的 DOM 计算量。**





虚拟 DOM **创建页面**的过程，虚拟 DOM 创建页面的过程分为两步：

- 第一步是创建 JavaScript 对象，这个对象可以理解为真实 DOM 的描述；
- 第二步是递归地遍历虚拟 DOM 树并创建真实 DOM。

同样可以用一个公式来表达 **虚拟DOM创建页面的性能：创建 JavaScript 对象的计算量 + 创建真实 DOM 的计算量。**



innerHTML 和虚拟 DOM 在**创建页面时**的性能：

![image-20231228103717384](images\image-20231228103717384.png)

可以看到，无论是纯 JavaScript 层面的计算，还是 DOM 层面的计 算，其实两者差距不大。这里从宏观的角度只看数量级上的差 异。如果在同一个数量级，则认为没有差异。在创建页面的时候，都需要新建所有 DOM 元素。



**更新页面时的性能对比：**

使用 innerHTML 更新页面的过程是重新构建 HTML 字符串， 再重新设置 DOM 元素的 innerHTML 属性，哪怕只更改了一个文字，也要重新设置 innerHTML 属性。而重新设置 innerHTML 属性就等价于销毁所有旧的 DOM 元素，再全量创建新 的 DOM 元素。

使用虚拟 DOM 更新页面，它需要重新创建 JavaScript 对象（虚拟 DOM 树），然后比较新旧虚拟 DOM，找到变化的元素并更新它。

![image-20231228104101281](images\image-20231228104101281.png)

在更新页面时，虚拟 DOM 在 JavaScript 层面的运算要**比创建页面时**多出一个 Diff 的性能消耗，然而它毕竟也是 JavaScript 层面的运算，所以不会产生数量级的差异。

再观察 DOM 层面的运算，可以发现虚拟 DOM 在更新页面时只会更新必要的元素，但 innerHTML 需要全量更新。**这时虚拟 DOM 的优势就体现出来了**。

另外，当更新页面时，影响虚拟 DOM 的性能因素与影响 innerHTML 的性能因素不同。对于虚拟 DOM 来说，无论页面多大，都只会更新变化的内容，而对于 innerHTML 来说，页面越大， 就意味着更新时的性能消耗越大。如果加上性能因素，那么最终它们 在更新页面时的性能如图所示。

![image-20231228104341810](images\image-20231228104341810.png)



**对比结论：**

粗略地总结一下 innerHTML、虚拟 DOM 以及原生 JavaScript（指 createElement 等方法）在**更新页面时**的性能

![image-20231228104435412](images\image-20231228104435412.png)

原生 DOM 操作方法的心智负担最大，因为要手动创建、删除、修改大量的 DOM 元素。但它的性能是最高的，不过为了使其性能最佳，要承受巨大的心智负担。另外，以这种方式编写的代码，可维护性也极差。

对于 innerHTML 来说，由于编写页面的过程有一部分是通过拼接 HTML 字符串来实现的，但是拼接字符串总归也是有一定心智负担的，而且对于事件绑定之类的事情，还是要使用原生 JavaScript 来处理。如果 innerHTML 模板很大，则其更新页面的性能最差，尤其是在只有少量更新时。

最后，虚拟 DOM，它是声明式的，因此心智负担小，可维护性强，性能虽然比不上极致优化的原生 JavaScript，但是在保证心智负担 和可维护性的前提下相当不错。



### 运行时和编译时

设计框架的三种选择：

1. 纯运行时
2. 运行时+编译时
3. 纯编译时

什么是运行时，什么是编译时，它们各自有什么特征，它们对框架有哪些影响。

**纯运行时**

假设设计了一个框架，它提供 一个 Render 函数，用户可以为该函数提供一个树型结构的数据对象，然后 Render 函数会根据该对象递归地将数据渲染成 DOM 元素。规定树型结构的数据对象如下：

```js
const obj = {
    tag: 'div',  // 标签名
    children: [  // 子节点
        { tag: 'span', children: 'hello world' }
    ]
}


function Render(obj, root) {
    const el = document.createElement(obj.tag)
    if (typeof obj.children === 'string') {
        const text = document.createTextNode(obj.children)
        el.appendChild(text)
    } else if (obj.children) {
        // 数组，递归调用 Render，使用 el 作为 root 参数
        obj.children.forEach((child) => Render(child, el))
    }

    // 将元素添加到 root
    root.appendChild(el)
}


// 渲染到 body 下
Render(obj, document.body)
```

用户是如何使用 Render 函数的。用户在使用它渲染内容时，直接为 Render 函数提供了一个树型结构的数据对象。这里面不涉及任何额外的步骤，用户也不需要学习额外的知识。但是手写树型结构的数据对象太麻烦了，而且不直观，能不能支持用类似于 HTML 标签的方式描述树型结构的数据对象。实际上，刚刚编写的框架就是一个纯运行时的框架。



**运行时+编译时**

为了满足用户的需求，能不能引入编译的手段，把 HTML 标签编译成树型结构的数据对象，这样不就可以继续使用 Render 函数了。

![image-20231228125036439](images\image-20231228125036439.png)

为此，编写了一个叫作 Compiler 的程序，它的作用就是把 HTML 字符串编译成树型结构的数据对象，于是交付给用户去用了。 那么用户该怎么用？最简单的方式就是让用户分别调用 Compiler 函数和 Render 函数：

```js
const html = `
 <div>
 	<span>hello world</span>
 </div>
 `
// 调用 Compiler 编译得到树型结构的数据对象
const obj = Compiler(html)
// 再调用 Render 进行渲染
Render(obj, document.body)
```

这时框架就变成了一个运行时 + 编译时的框架。它既支持运行时，用户可以直接提供数据对象从而无须编译；又支持编译时，用户可以提供 HTML 字符串，将其编译为数据对象后再交给运行时处理。准确地说，上面的代码其实是**运行时编译**，意思是代码运行的时候才开始编译，而这会产生一定的性能开销，因此也可以在**构建的时候**就执行 Compiler 程序将用户提供的内容编译好，等到运行时就无须编译了，这对性能友好。



**纯编译时**

既然编译器可以把 HTML 字符串编译成数据对象，那么能不能直接编译成命令式代码。

![image-20231228125841104](images\image-20231228125841104.png)



这样只需要一个 Compiler 函数就可以了，连 Render 都不需要了。其实这就变成了一个纯编译时的框架，因为不支持任何运行时内容，用户的代码通过编译器编译后才能直接运行。 

一个框架既可以是纯运行时的，也可以是纯编译时的，还可以是既支持运行时又支持编译时的。那么，它们都有哪些优缺点呢？是不是既支持运行时又支持编译时的框架最好呢？ 



**三者的对比**

纯运行时的框架由于没有编译的过程，因此没办法分析用户提供的内容，但是如果加入编译步骤，就可以分析用户提供的内容，看看哪些内容未来可能会改变， 哪些内容永远不会改变，这样就可以在编译的时候提取这些信息，然后将其传递给 Render 函数，Render 函数得到这些信息之 后，就可以做进一步的优化了。

假如设计的框架是纯编译时的，那么它也可以分析用户提供的内容。由于不需要任何运行时， 而是直接编译成可执行的 JavaScript 代码，因此性能可能会更好，但是这种做法有损灵活性，即用户提供的内容必须编译后才能用。

在这三个方向上业内都有探索，其中 Svelte 就是纯编译时的框架，但是它的真实性能可能达不到理论高度。Vue.js 3 仍然保持了运行时 + 编译时的架构，在保持灵活性的基础上能够尽可能地去优化。





## 第二章

框架设计的关注点：

1. 框架的核心功能代码实现
2. 框架能提供的构建产物的类型
3. 构建产物的模块化方案选择
4. 错误或者不规范使用框架的时的报错提示与警告提示
5. 生产构建和开发构建的区别
6. 是否支持热更新等
7. 是否能实现按需加载和打包



### 开发体验

1. 友好的警告信息
2. 自定义控制台输出格式



### 框架库体积

提供尽量多的警告信息和缩小代码库的体积是存在一定冲突的。为此，vue3中引入了`__DEV__`

如果去看 Vue.js 3 的源码，就会发现每一个 warn 函数的调用都会配合 `__DEV__ `常量的检查，例如：

```js
if (__DEV__ && !res) {
    warn(
        `Failed to mount app: mount target selector "${container}"
returned null.`
    )
}
```

Vue.js 使用 rollup.js 对项目进行构建，这里的` __DEV__ `常量实际上是通过 rollup.js 的插件配置来预定义的，其功能类似于 webpack 中的 DefinePlugin 插件。

Vue.js 在输出资源的时候，会输出两个版本，其中一个用于开发环 境，另一个用于生产环境，当 Vue.js 构建用于开发环境的资源时，会把` __DEV__ `常量设置为 true，所以这段代码在开发环境中是肯定存在的。

当 Vue.js 用于构建生产环境的资源时，会把` __DEV__ `常量设置为 false，这时这段分支代码永远都不会执行，因为判断条件始终为假，这段永远不会 执行的代码称为 dead code，它不会出现在最终产物中，在构建资源的时候就会被移除。

这样就做到了在开发环境中为用户提供友好的警告信息的同时，不会增加生产环境代码的体积。





### Tree-Shaking

Vue.js 内建了很多组件，例如Transition组件，如果项目中根本就没有用到该组件，那么它的代码不需要包含在项目最终的构建资源中。

Tree-Shaking 指的就是消除那些永远不会被执行的代码，也就是排除 dead code，现在无论是 rollup.js 还是 webpack，都支持 Tree-Shaking。想要实现 Tree-Shaking，必须满足一个条件，即模块必须是 ESM（ES Module），因为 Tree-Shaking 依赖 ESM 的静态结构。

如果一个函数调用会产生副作用，那么就不能将其移除。

因为静态地分析 JavaScript 代码很困难，所以像 rollup.js 这类工具都会提供一个机制，明确地告诉 rollup.js 一段代码不会产生副作用，可以移除它。

```js
import {foo} from './utils'
/*#__PURE__*/ foo()
```

注意注释代码 `/*#__PURE__*/`，其作用就是告诉 rollup.js，对于 foo 函数的调用不会产生副作用，可以放心地对其进行 TreeShaking。

webpack 以及压缩工具（如 terser）都能识别它。



### 构建产物

Vue.js 的构建产物除了有环境上的区分之外，还会根据使用场景的不同而输出其他形式的产物。

希望用户可以直接在 HTML 页面中使用 script标签引入框架并使用，需要输出一种叫作 IIFE 格式的资源。 IIFE 的全称是 Immediately Invoked Function Expression，即“立即调用的 函数表达式”。vue.global.js 文件就是 IIFE 形式的资源，它的代码结构如下所示：

```js
var Vue = (function(exports){
    // ...
    exports.createApp = createApp;
    // ...
    return exports
}({}))
```

这样当我们使用 script 标签直接引入 vue.global.js 文件后， 全局变量 Vue 就是可用的了。

在 rollup.js 中，我们可以通过配置 format: 'iife' 来输出这种形式的资源：

```js
// rollup.config.js
const config = {
    input: 'input.js',
    output: {
        file: 'output.js',
        format: 'iife' // 指定模块形式
    }
}

export default config
```





使用script标签直接引入 ESM 格式的资源。例如 Vue.js 3 还会输出 vue.esm-browser.js 文件，用户可以直接用 `<script type='module'>` 标签引入。

```html
<script type="module" src="/path/to/vue.esm-browser.js"> </script>
```

为了输出 ESM 格式的资源，rollup.js 的输出格式需要配置为： format: 'esm'。



在 Node.js 中通过 require 语句引用资源。当进行服务端渲染时，Vue.js 的代码是在 Node.js 环境中运行的，而非浏览器环境。在 Node.js 环境中，资源的模块格式应该是 CommonJS，简称 cjs。为了能 够输出 cjs 模块的资源，可以通过修改 rollup.config.js 的配置 format: 'cjs' 来实现。



### 特性开关

在设计框架时，框架会给用户提供诸多特性（或功能），例如提供 A、B、C 三个特性给用户，同时还提供了 a、b、c 三个对应的 特性开关，用户可以通过设置 a、b、c 为 true 或 false 来代表开启或关闭对应的特性。优势：

- 对于用户关闭的特性，可以利用 Tree-Shaking 机制让其不包含在最终的资源中。
- 该机制为框架设计带来了灵活性，可以通过特性开关任意为框架添加新的特性，而不用担心资源体积变大。同时，当框架升级 时，也可以通过特性开关来支持遗留 API，这样新用户可以选择不使用遗留 API，从而使最终打包的资源体积最小化。

vue3中实现特性开关：

- 本质是使用rollup.js的预定义常量插件 + tree-shaking机制来实现

  

  

### 错误处理

案例：

```js
// utils.js
export default {
    foo(fn) {
        fn && fn()
    }
}

// 该模块导出一个对象，其中 foo 属性是一个函数，接收一个回调函数作为参数，调用 foo 函数时会执行该回调函数，在用户侧使用时：

import utils from 'utils.js'
utils.foo(() => {
    // ...
})

```

如果用户提供的回调函数在执行的时候出错了。此时有两个办法，第一个办法是让用户自行处理，这需要用户自己执行 try...catch：

```js
import utils from 'utils.js'
utils.foo(() => {
    try {
        // ...
    } catch (e) {
        // ...
    }
})
```

但是这会增加用户的负担。如果 utils.js 不是仅仅提供 了一个 foo 函数，而是提供了几十上百个类似的函数，那么用户在使用的时候就需要逐一添加错误处理程序。



第二个办法是代替用户统一处理错误，如以下代码所示：

```JS
// utils.js
export default {
    foo(fn) {
        try {
            fn && fn()
        } catch(e) {/* ... */}
    },
    bar(fn) {
        try {
            fn && fn()
        } catch(e) {/* ... */}
    },
}

```

在每个函数内都增加 try...catch 代码块，实际上，可以进一步将错误处理程序封装为一个函数，假设叫它 callWithErrorHandling：

```JS
// utils.js
export default {
    foo(fn) {
        callWithErrorHandling(fn)
    },
    bar(fn) {
        callWithErrorHandling(fn)
    },
}
function callWithErrorHandling(fn) {
    try {
        fn && fn()
    } catch (e) {
        console.log(e)
    }
}
```

可以看到，代码变得简洁多了。但简洁不是目的，这么做真正的好处是，能为用户提供统一的错误处理接口，如以下代码所示：

```JS
// utils.js
let handleError = null
export default {
    foo(fn) {
        callWithErrorHandling(fn)
    },
    // 用户可以调用该函数注册统一的错误处理函数
    registerErrorHandler(fn) {
        handleError = fn
    }
}

function callWithErrorHandling(fn) {
    try {
        fn && fn()
    } catch (e) {
        // 将捕获到的错误传递给用户的错误处理程序
        handleError(e)
    }
}

```

提供了 registerErrorHandler 函数，用户可以使用它注册错误处理程序，然后在 callWithErrorHandling 函数内部捕获错误后，把错误传递给用户注册的错误处理程序。

使用：

```js
import utils from 'utils.js'
// 注册错误处理程序
utils.registerErrorHandler((e) => {
    console.log(e)
})

utils.foo(() => {/*...*/})
utils.bar(() => {/*...*/})
```

这时错误处理的能力完全由用户控制，用户既可以选择忽略错 误，也可以调用上报程序将错误上报给监控系统。

实际上，这就是 Vue.js 错误处理的原理，可以在源码中搜索到 callWithErrorHandling 函数。另外，在 Vue.js 中，也可以注册统一的错误处理函数：

```js
import App from 'App.vue'
const app = createApp(App)
app.config.errorHandler = () => {
    // 错误处理程序
}
```





## 第三章

- vue3设计思路
- 工作机制
- 重要的的组成部分
- 各个组成部分之间如何配合



### 声明式描述UI

vue3是一个声明式的UI框架。

编写前端页面所需要涉及的内容：

1. DOM元素
2. 属性
3. 事件
4. 元素之间的层级关系

如何声明式的描述上面的内容？vue3的方案是：

1. `使用与 HTML 标签一致的方式来描述 DOM 元素，例如描述一个 div 标签时可以使用 <div></div>`
2. `使用与 HTML 标签一致的方式来描述属性，例如 <div id="app"></div>`
3. `使用 : 或 v-bind 来描述动态绑定的属性，例如< div :id="dynamicId"></div>`
4. `使用 @ 或 v-on 来描述事件`
5. `使用与 HTML 标签一致的方式来描述层级结构`



除了上面这种使用模板来声明式地描述 UI 之外，还可以用 JavaScript 对象来描述，代码如下所示：

```js
const title = {
    // 标签名称
    tag: 'h1',
    // 标签属性
    props: {
        onClick: handler
    },
    // 子节点
    children: [
        { tag: 'span' }
    ]
}

// 对应到 Vue.js 模板，就是：
<h1 @click="handler"><span></span></h1>
```

使用 JavaScript 对象描述 UI 更加灵活。举个例子，假如要表示一 个标题，根据标题级别的不同，会分别采用 h1~h6 这几个标签，如果用 JavaScript 对象来描述，只需要使用一个变量来代表 h 标签即可：

```js
// h 标签的级别
let level = 3
const title = {
    tag: `h${level}`, // h3 标签
}
```

但是如果使用模板来描述，就不得不穷举：

```vue
 <h1 v-if="level === 1"></h1>
 <h2 v-else-if="level === 2"></h2>
 <h3 v-else-if="level === 3"></h3>
 <h4 v-else-if="level === 4"></h4>
 <h5 v-else-if="level === 5"></h5>
 <h6 v-else-if="level === 6"></h6>
```



使用 JavaScript 对象来描述 UI 的方式，其实就是所谓的虚拟 DOM。

Vue.js 3 除了支持使用模板描述 UI 外，还支持使用虚拟 DOM 描述 UI。其实在 Vue.js 组件中手写的渲染函数就是使用虚拟 DOM 来描述 UI 的， 如以下代码所示：

```js
import { h } from 'vue'

export default {
    render() {
        return h('h1', { onClick: handler }) // 虚拟 DOM
    }
}

```

h 函数的返回值就是一个对象，其作用是让编写虚拟 DOM 变得更加轻松。如果把上面 h 函数调用的代码改成 JavaScript 对 象，就需要写更多内容：

```js
export default {
    render() {
        return {
            tag: 'h1',
            props: { onClick: handler }
        }
    }
}
```

所以 h 函数就是一个辅助创建虚拟 DOM 的工具函数。 一个组件要渲染的内容是通过渲染函数来描述的，也就是上面代码中的 render 函数，Vue.js 会根据组件的 render 函数的返回值拿到虚拟 DOM，然后就可以把组件的内容渲染出来了。



### 渲染器

虚拟 DOM其实就是用 JavaScript 对象来描述真实的 DOM 结构。

虚拟 DOM 是如何变成真实 DOM 并渲染到浏览器页面中的——渲染器。

渲染器的作用就是把虚拟 DOM 渲染为真实 DOM。



基于虚拟DOM实现一个渲染器：

虚拟DOM

```js
const vnode = {
    tag: 'div',
    props: {
        onClick: () => alert('hello')
    },
    children: 'click me'
}
```



渲染器

```js
function renderer(vnode, container) {
    // 使用 vnode.tag 作为标签名称创建 DOM 元素
    const el = document.createElement(vnode.tag)
    // 遍历 vnode.props，将属性、事件添加到 DOM 元素
    for (const key in vnode.props) {
        if (/^on/.test(key)) {
            // 如果 key 以 on 开头，说明它是事件
            el.addEventListener(
                key.substr(2).toLowerCase(), // 事件名称 onClick --->click
                vnode.props[key] // 事件处理函数
            )
        }
    }

    // 处理 children
    if (typeof vnode.children === 'string') {
        // 如果 children 是字符串，说明它是元素的文本子节点
        el.appendChild(document.createTextNode(vnode.children))
    } else if (Array.isArray(vnode.children)) {
        // 递归地调用 renderer 函数渲染子节点，使用当前元素 el 作为挂载点
        vnode.children.forEach(child => renderer(child, el))
    }

    // 将元素添加到挂载点下
    container.appendChild(el)
}
```



渲染器 renderer 的实现思路

1. 创建元素：把 vnode.tag 作为标签名称来创建 DOM 元素。
2. 为元素添加属性和事件：遍历 vnode.props 对象，如果 key 以 on 字符开头，说明它是一个事件，把字符 on 截取掉后再调用 toLowerCase 函数将事件名称小写化，最终得到合法的事件名 称，例如 onClick 会变成 click，最后调用 addEventListener 绑定事件处理函数。
3. 处理 children：如果 children 是一个数组，就递归地调用 renderer 继续渲染，注意，此时要把刚刚创建的元素作为挂载点（父节点）；如果 children 是字符串，则使用 createTextNode 函数创建一个文本节点，并将其添加到新创建的元素内。

上面的渲染器实现只是**创建节点**，渲染器的精髓都在**更新节点**的阶段。对于渲染器来说，它需要精确地找到 vnode 对象的变更点并且只更新变更的内容。渲染器应该只更新需要更新的元素， 而不需要再走一遍完整的创建元素的流程。



### 组件

组件的本质是什么？组件和虚拟 DOM 有什么关系？渲染器如何渲染组件？

其实虚拟 DOM 除了能够描述真实 DOM 之外，还能够描述组件。组件并不是真实的 DOM 元素，那么如何使用虚拟 DOM 来描述呢？



#### 函数表示组件

组件就是一组 DOM 元素的封装，这组 DOM 元素就是组件要渲染的内容，因此可以定义一个函数来代表组件，而函数的返回值就代表组件要渲染的内容：

```js
const MyComponent = function () {
    return {
        tag: 'div',
        props: {
            onClick: () => alert('hello')
        },
        children: 'click me'
    }
}

```

可以定义用虚拟 DOM 来描述组件。可以让虚拟 DOM 对象中的 tag 属性来存储组件函数：

```js
const vnode = {
    tag: MyComponent
}
```

就像 tag: 'div' 用来描述标签一样，tag: MyComponent 用来描述组件，只不过此时的 tag 属性不是标签名称，而是组件**函数**。为了能够渲染组件，需要渲染器的支持。修改前面提到的 renderer 函数，如下所示：

```js
function renderer(vnode, container) {
    if (typeof vnode.tag === 'string') {
        // 说明 vnode 描述的是标签元素
        mountElement(vnode, container)
    } else if (typeof vnode.tag === 'function') {
        // 说明 vnode 描述的是组件
        mountComponent(vnode, container)
    }
}

```

mountComponent 函数实现：

```js
function mountComponent(vnode, container) {
    // 调用组件函数，获取组件要渲染的内容（虚拟 DOM）
    const subtree = vnode.tag()
    // 递归地调用 renderer 渲染 subtree
    renderer(subtree, container)
}
```





#### 对象表示组件

组件不一定非得是函数。完全可以使用一个 JavaScript 对象来表达组件，例如：

```js
// MyComponent 是一个对象
const MyComponent = {
    render() {
        return {
            tag: 'div',
            props: {
                onClick: () => alert('hello')
            },
            children: 'click me'
        }
    }
}

```

为了完成组件的渲染，需要修改 renderer 渲染器以及 mountComponent 函数。

修改渲染器的判断条件：

```js
function renderer(vnode, container) {
    if (typeof vnode.tag === 'string') {
        mountElement(vnode, container)
    } else if (typeof vnode.tag === 'object') { // 如果是对象，说明vnode 描述的是组件
        mountComponent(vnode, container)
    }
}
```

使用对象而不是函数来表达组件，因此要将 typeof vnode.tag \=== 'function' 修改为 typeof vnode.tag \=== 'object'。

修改 mountComponent 函数：

```js
function mountComponent(vnode, container) {
    // vnode.tag 是组件对象，调用它的 render 函数得到组件要渲染的内容（虚拟 DOM）
    const subtree = vnode.tag.render()
    // 递归地调用 renderer 渲染 subtree
    renderer(subtree, container)
}
```

vnode.tag 是表达组件的对象，调用该对象的 render 函数得到组件要渲染的内容，也就是虚拟 DOM。

**其实 Vue.js 中的有状态组件就是使用对象结构来表达的。**



### 模板的工作原理

上文讲解了虚拟 DOM 是如何渲染成真实 DOM 的。

那模板是如何工作的呢？这就要提到 Vue.js 框架中的另外一个重要组成部分：编译器。

编译器和渲染器一样，只是一段程序而已，不过它们的工作内容不同。编译器的作用其实就是将模板编译为渲染函数，例如给出如下模板：

```vue
<div @click="handler">
    click me
</div>
```

对于编译器来说，模板就是一个普通的字符串，它会分析该字符串并生成一个功能与之相同的渲染函数：

```js
render() {
    return h('div', { onClick: handler }, 'click me')
}
```

以 .vue 文件为例，一个 .vue 文件就是一个组件，如下所示：

```vue
<template>
	<div @click="handler">
    	click me
    </div>
</template>

<script>
    export default {
        data() {/* ... */},
        methods: {
            handler: () => {/* ... */}
        }
    }
</script>
```

其中template标签里的内容就是模板内容，编译器会把模板内容编译成渲染函数并添加到script标签块的组件对象上，所以最终在浏览器里运行的代码就是：

```js
export default {
    data() {/* ... */},
    methods: {
        handler: () => {/* ... */}
    },
    render() {
        return h('div', { onClick: handler }, 'click me')
    }
}
```

所以，无论是使用模板还是直接手写渲染函数，对于一个组件来说，它要渲染的内容最终都是通过渲染函数产生的，然后渲染器再把渲染函数返回的虚拟 DOM 渲染为真实 DOM，这就是模板的工作原 理，也是 Vue.js 渲染页面的流程。



组件的实现依赖于**渲染器**，模板的编译依赖于**编译器**，并且编译后生成的代码是根据渲染器和虚拟 DOM 的设计决定的。



### 模块关联

以编译器和渲染器这两个非常关键的模块为例，看看它们是如何配合工作，并实现性能提升的。

有如下模板：

```vue
<div id="foo" :class="cls"></div>
```

编译器会把这段代码编译成渲染函数：

```js
render() {
    // 为了效果更加直观，这里没有使用 h 函数，而是直接采用了虚拟 DOM 对象
    // 下面的代码等价于：
    // return h('div', { id: 'foo', class: cls })
    return {
        tag: 'div',
        props: {
            id: 'foo',
            class: cls
        }
    }
}
```

在这段代码中，cls 是一个变量，它可能会发生变化。**渲染器的作用之一就是寻找并且只更新变化的内容**，所以当变量 cls 的值发生变化时，渲染器会自行寻找变更点。对于渲染器来说，这个“寻找”的过程需要花费一些力气。

从编译器的视角来看，它能否知道哪些内容会发生变化呢？如果编译器有能力分析动态内容，并在编译阶段把这些信息提取出来，然后直接交给渲染器， 这样渲染器不就不需要花费大力气去寻找变更点了吗？这是个好想法并且能够实现。

Vue.js 的模板是有特点的，拿上面的模板来说，我们一眼就能看出其中 id="foo" 是永远不会变化的，而 :class="cls" 是一个 v-bind 绑定，它是可能发生变化的。所以编译器能识别出哪些是静态属性，哪些是动态属性，在生成代码的时候完全可以附带这些信息：

```js
render() {
    return {
        tag: 'div',
        props: {
            id: 'foo',
            class: cls
        },
        patchFlags: 1 // 假设数字 1 代表 class 是动态的
    }
}
```

如上面的代码所示，在生成的虚拟 DOM 对象中多出了一个 patchFlags 属性，假设数字 1 代表“ class 是动态的”，这样渲染器看到这个标志时就知道：“只有 class 属性会发生改 变。”对于渲染器来说，就相当于省去了寻找变更点的工作量，性能自然就提升了。

**通过这个例子，了解到编译器和渲染器之间是存在信息交流的，它们互相配合使得性能进一步提升，而它们之间交流的媒介就是 虚拟 DOM 对象。后面，会看到一个虚拟 DOM 对象中会包含多种数据字段，每个字段都代表一定的含义。**

**虚拟 DOM 要比模板更加灵活，但模板要比虚拟 DOM 更加直观。**

渲染器的作用是，把虚拟 DOM 对象渲染为真实 DOM 元素。它的工作原理是，递归地遍历虚拟 DOM 对象，并调用原生 DOM API 来完成真实 DOM 的创建。渲染器的精髓在于后续的更新，它会通过 Diff 算法找出变更点，并且只会更新需要更新的内容。

组件其实就是一组虚拟 DOM 元素的封装，它可以是一个返回虚拟 DOM 的函数，也可以是一个对象，但这个对象下必须要有一个函数用来产出组件要渲染的虚拟 DOM。

渲染器在渲染组件时，会先获取组件要渲染的内容，即执行组件的渲染函 数并得到其返回值，我们称之为 subtree，最后再递归地调用渲染器 将 subtree 渲染出来即可。



## 第四章

- 响应式数据和副作用函数
- 避免无限递归
- 嵌套的副作用函数
- 副作用函数之间的影响
- 基于语言规范，Proxy实现完善一些的响应式数据
- 响应式系统的设计与实现



### 响应式数据

假设在一个副作用函数中读取了某个对象的属性：

```js
const obj = { text: 'hello world' }
function effect() {
    // effect 函数的执行会读取 obj.text
    document.body.innerText = obj.text
}
```

如上面的代码所示，副作用函数 effect 会设置 body 元素的 innerText 属性，其值为 obj.text，**当 obj.text 的值发生变化时，希望副作用函数 effect 会重新执行**：

```js
obj.text = 'hello vue3' // 修改 obj.text 的值，同时希望副作用函数会重新执行
```

如果能实现这个目标，那么对象 obj 就是响应式数据。以上面的代码来看，还做不到这一点，因为 obj 是一个普通对象，当修改它的值时，除了值本身发生变化之外，不会有任何其他反应。



**响应式数据的基本实现**

通过观察能发现两点线索： 

- 当副作用函数 effect 执行时，会触发字段 obj.text 的读取操作； 
- 当修改 obj.text 的值时，会触发字段 obj.text 的设置操作。

如果能拦截一个对象的读取和设置操作，当读取字段 obj.text 时，可以把副作用函数 effect 存储起来。当设置 obj.text 时，再把副作用函数 effect 取出并执行即可，

现在问题的关键变成了如何才能拦截一个对象属性的读取和设置操作。在 ES2015 之前，只能通过 Object.defineProperty 函数实现，这是 Vue.js 2 所采用的方式。在 ES2015+ 中，可以使用代理对象 Proxy 来实现，这是 Vue.js 3 所采用的方式。

采用 Proxy 来实现：

```js
// 存储副作用函数的桶
const bucket = new Set()

// 原始数据
const data = { text: 'hello world' }
// 对原始数据的代理
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 将副作用函数 effect 添加到存储副作用函数的桶中
        bucket.add(effect)
        // 返回属性值
        return target[key]
    },
    
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶里取出并执行
        bucket.forEach(fn => fn())
        // 返回 true 代表设置操作成功
        return true
    }
})
```

使用：

```js
// 副作用函数
function effect() {
    document.body.innerText = obj.text
}
// 执行副作用函数，触发读取
effect()
// 1 秒后修改响应式数据
setTimeout(() => {
    obj.text = 'hello vue3'
}, 1000)
```





**改进：直接通过名字 （effect）来获取副作用函数，这种硬编码的方式很不灵活。一旦副作用函数的名字不叫 effect，那么这段代码就不能正确地工作。**

提供一个用来注册副作用函数的机制：

```js
// 用一个全局变量存储被注册的副作用函数
let activeEffect
// effect 函数用于注册副作用函数
function effect(fn) {
    // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}


effect(
    // 一个匿名的副作用函数
    () => {
        document.body.innerText = obj.text
    }
)
```



```js
const obj = new Proxy(data, {
    get(target, key) {
        // 将 activeEffect 中存储的副作用函数收集到“桶”中
        if (activeEffect) { // 新增
            bucket.add(activeEffect) // 新增
        } // 新增
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        bucket.forEach(fn => fn())
        return true
    }
})
```



如上面的代码所示，由于副作用函数执行前已经存储到了 activeEffect 中，接着执行被注册的副作用函数，副作用函数中取了响应式数据的属性，触发 get 拦截函数内把 activeEffect 收集，这样响应系统就不依赖副作用函数的名字了。



如果再对这个系统稍加测试，例如在响应式数据 obj 上设置一个不存在的属性时：

```js
effect(
    // 匿名副作用函数
    () => {
        console.log('effect run') // 会打印 2 次
        document.body.innerText = obj.text
    }
)

setTimeout(() => {
    // 副作用函数中并没有读取 notExist 属性的值
    obj.notExist = 'hello vue3'
}, 1000)
```

在匿名副作用函数内并没有读取 obj.notExist 属性的值，所以理论上，字段 obj.notExist 并没有与副作用建立响应联系，因此，定时器内语句的执行不应该触发匿名副作用函数重新执行。但如果执行上述这段代码就会发现，定时器到时后，匿名副作用函数却重新执行了，这是不正确的。



**再次改进**

导致该问题的根本原因是，**没有在副作用函数与被操作的目标属性之间建立明确的联系**。

例如当读取属性时，无论读取的是哪一个属性，其实都一样，都会把副作用函数收集到“桶”里；当设置属性时，无论设置的是哪一个属性，也都会把“桶”里的副作用函 数取出并执行。副作用函数与被操作的字段之间没有明确的联系。解决方法很简单，只需要在副作用函数与被操作的字段之间建立联系即可，这就需要重新设计“桶”的数据结构，而不能简单地使用一个 Set 类型的数据作为“桶”了。



如何设置响应式数据和副作用函数之间的对应关系？

先看下面的例子：

```js
effect(function effectFn() {
    document.body.innerText = obj.text
})
```

在这段代码中存在三个角色： 

- 被操作（读取）的代理对象 obj； 
- 被操作（读取）的字段名 text； 
- 使用 effect 函数注册的副作用函数 effectFn。

如果用 target 来表示一个代理对象所代理的原始对象，用 key 来表示被操作的字段名，用 effectFn 来表示被注册的副作用函数， 那么可以为这三个角色建立如下关系：

```js
target
  └── text
 	   └── effectFn
```



如果有两个副作用函数同时读取同一个对象的属性值：

```js
effect(function effectFn1() {
    obj.text
})
effect(function effectFn2() {
    obj.text
})
```

```
target
  └── text
 	   └── effectFn1
 	   └── effectFn2
```



如果一个副作用函数中读取了同一个对象的两个不同属性：

```js
effect(function effectFn2() {
    obj.text1
    obj.text2
})
```

```js
target
  └── text1
 	   └── effectFn2
  └── text2
 	   └── effectFn2
```



如果在不同的副作用函数中读取了两个不同对象的不同属性：

```js
effect(function effectFn1() {
    obj1.text1
})
effect(function effectFn2() {
    obj2.text2
})
```

```js
target1
  └── text1
 	   └── effectFn1

target2
  └── text2
 	   └── effectFn2
```



这个联系建立起来之后， 就可以解决前文提到的问题了。拿上面的例子来说，如果设置了 obj2.text2 的值，就只会导致 effectFn2 函数重新执行，并不会 导致 effectFn1 函数重新执行。



**改进**

需要使用 WeakMap 代替 Set 作为桶的数据结构：

```js
// 存储副作用函数的桶
const bucket = new WeakMap()
```

然后修改 get/set 拦截器代码：

```js
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 没有 activeEffect，直接 return
        if (!activeEffect) return target[key]
        // 根据 target 从“桶”中取得 depsMap，它也是一个 Map 类型：key --> effects
        let depsMap = bucket.get(target)
        // 如果不存在 depsMap，那么新建一个 Map 并与 target 关联
        if (!depsMap) {
            bucket.set(target, (depsMap = new Map()))
        }
        // 再根据 key 从 depsMap 中取得 deps，它是一个 Set 类型，
        // 里面存储着所有与当前 key 相关联的副作用函数：effects
        let deps = depsMap.get(key)
        // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
        if (!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        // 最后将当前激活的副作用函数添加到“桶”里
        deps.add(activeEffect)

        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 根据 target 从桶中取得 depsMap，它是 key --> effects
        const depsMap = bucket.get(target)
        if (!depsMap) return
        // 根据 key 取得所有副作用函数 effects
        const effects = depsMap.get(key)
        // 执行副作用函数
        effects && effects.forEach(fn => fn())
    }
})
```



从这段代码可以看出构建数据结构的方式，分别使用了 WeakMap、Map 和 Set： 

- WeakMap 由 target --> Map 构成； 
- Map 由 key --> Set 构成。

其中 WeakMap 的键是原始对象 target，WeakMap 的值是一个 Map 实例，而 Map 的键是原始对象 target 的 key，Map 的值是一个由副作用函数组成的 Set。它们的关系如图：

![image-20231229203805607](images\image-20231229203805607.png)



对上文中的代码做一些封装处理。

```js
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
        track(target, key)
        // 返回属性值
        return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal
        // 把副作用函数从桶里取出并执行
        trigger(target, key)
    }
})

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
}
```



### 分支切换与 cleanup

分支切换的定义，如下面的代码所示：

```js
const data = { ok: true, text: 'hello world' }
const obj = new Proxy(data, { /* ... */ })

effect(function effectFn() {
    document.body.innerText = obj.ok ? obj.text : 'not'
})

```

当字段 obj.ok 的值发生变化时， 代码执行的分支会跟着变化，这就是所谓的分支切换。

分支切换可能会产生遗留的副作用函数。拿上面这段代码来说， 字段 obj.ok 的初始值为 true，这时会读取字段 obj.text 的值， 所以当 effectFn 函数执行时会触发字段 obj.ok 和字段 obj.text 这两个属性的读取操作，此时副作用函数 effectFn 与响应式数据ok和ytest之间建立的联系如下：

```js
data
  └── ok
      └── effectFn
  └── text
       └── effectFn
```

![image-20231229212010582](images\image-20231229212010582.png)

副作用函数 effectFn 分别被字段 data.ok 和字段 data.text 所对应的依赖集合收集。当字段 obj.ok 的值修改为 false，并触发副作用函数重新执行后，由于此时字段 obj.text 不会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集。如下图：

![image-20231229212131253](images\image-20231229212131253.png)

但按照前文的实现，还做不到这一点。当把字段 obj.ok 的值修改为 false，并触发副作用函数重新执行之后， 整个依赖关系仍然保持原样，因为源码的text属性已经收集好了副作用函数而没有被删除过，这时就产生了遗留的副作用函数。

遗留的副作用函数会导致不必要的更新，拿下面这段代码来说：

```js
const data = { ok: true, text: 'hello world' }
const obj = new Proxy(data, { /* ... */ })
effect(function effectFn() {
    document.body.innerText = obj.ok ? obj.text : 'not'
})

```

obj.ok 的初始值为 true，当将其修改为 false 后：

```js
 obj.ok = false 
```

这会触发更新，即副作用函数会重新执行。但由于此时 obj.ok 的值为 false，所以不再会读取字段 obj.text 的值。换句话说，无论字段 obj.text 的值如何改变，document.body.innerText 的值始终都是字符串 'not'。所以最好的结果是，无论 obj.text 的值怎么变，都不需要重新执行副作用函数。但事实并非如此，如果再尝试修改 obj.text 的值： 

```js
obj.text = 'hello vue3' 
```

这仍然会导致副作用函数重新执行，即使 document.body.innerText 的值不需要变化。

**解决办法：每次副作用函数执行之前，可以先把它从所有包含该副作用函数的关联的依赖集合中删除。**

先清空所有包含这个副作用函数的不同响应式属性对应的set中的该副作用函数自身，然后再重新执行该副作用函数，重新建立联系。  

要将一个副作用函数从收集过该副作用函数的依赖集合中移除，就需要明确知道哪些依赖集合中包含它，因此需要重新设计副作用函数，如下面的代码所示。在 effect 内部定义了新的 effectFn 函数，并为其添加了 effectFn.deps 属性，该属性是一个数组，用来存储所有包含当前副作用函数的依赖集合：

```js
// 用一个全局变量存储被注册的副作用函数
let activeEffect

function effect(fn) {
    // aop思想
    const effectFn = () => {
        // 当 effectFn 执行时，将其设置为当前激活的副作用函数
        activeEffect = effectFn
        fn()
    }
    
    // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
    effectFn.deps = []
    
    // 执行副作用函数
    effectFn()
}
```

那什么时候给effectFn.deps赋值了？在 track 函数中：

track函数就是在触发响应式数据的getter时执行。

```js
function track(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect) return
    
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    // 把当前激活的副作用函数添加到依赖集合 deps 中
    deps.add(activeEffect)
    
    // deps 就是一个与当前副作用函数存在联系的依赖集合
    // 将其添加到 activeEffect.deps 数组中
    activeEffect.deps.push(deps) // 新增
}
```

当副作用函数收集到包含自己的所有依赖集合后，就可以在每次副作用函数执行时，根据 effectFn.deps 获取所有相关联的依赖集合，进而将副作用函数从依赖集合中移除：

```js
// 用一个全局变量存储被注册的副作用函数
let activeEffect

function effect(fn) {
    const effectFn = () => {
        // 调用 cleanup 函数完成清除工作
        cleanup(effectFn) // 新增
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = []
    effectFn()
}
```

cleanup 函数的实现：

```js
function cleanup(effectFn) {
    // 遍历 effectFn.deps 数组
    for (let i = 0; i < effectFn.deps.length; i++) {
        // deps 是依赖集合
        const deps = effectFn.deps[i]
        // 将 effectFn 从依赖集合中移除
        deps.delete(effectFn)
    }
    // 最后需要重置 effectFn.deps 数组
    effectFn.deps.length = 0
}

```

至此，响应式数据在分支切换情况下的副作用函数遗留问题就解决了。

但如果尝试运行代码，会发现目前的实现会导致**无限循环执行**，问题出在响应式数据修改时的trigger 函数中：

```js
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn()) // 问题出在这句代码
}
```

在 trigger 函数内部，遍历 effects 集合，它是一个 Set 集合，里面存储着副作用函数。当副作用函数执行时，会先调用 cleanup 进行清除，实际上就是从 effects 集合中将当前执行的副作用函数剔除，但是接下来继续副作用函数的执行会导致其重新被收集到集合中，而此时对于 effects 集合的遍历仍在进行。  无线循环的原因是：前脚刚删除，在开启下一轮循环前，又往集合中添加了新数据，所以一直无法完全循环完集合。

**在调用 forEach 遍历 Set 集合时，如果一个值已经被访问过了，但该值被删除并重新添加到集合， 如果此时 forEach 遍历没有结束，那么该值会重新被访问。**

解决办法：构造另外一个 Set 集合并遍历它。

```js
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set(effects) // 新增
    effectsToRun.forEach(effectFn => effectFn()) // 新增
    // effects && effects.forEach(effectFn => effectFn()) // 删除
}
```



### 嵌套的 effect 与 effect 栈

effect可以嵌套。

```js
effect(function effectFn1() {
    effect(function effectFn2() { /* ... */ })
    /* ... */
})
```

什么场景下会出现嵌套的 effect ? Vue.js 的渲染函数就是在一个 effect 中执行的：

```js
// Foo 组件
const Foo = {
    render() {
        return /* ... */
    }
}

effect(() => {
    Foo.render()
})
```

当组件发生嵌套时，例如 Foo 组件渲染了 Bar 组件：

```js
// Bar 组件
const Bar = {
    render() { /* ... */ },
}
// Foo 组件渲染了 Bar 组件
const Foo = {
    render() {
        return <Bar /> // jsx 语法
    },
}


effect(() => {
    Foo.render()
    // 嵌套
    effect(() => {
        Bar.render()
    })
})
```



如果 effect 不支持嵌套会发生什么？

前面的代码实现就是不支持effect嵌套的。

```js
// 原始数据
const data = { foo: true, bar: true }
// 代理对象
const obj = new Proxy(data, { /* ... */ })

// 全局变量
let temp1, temp2

// effectFn1 嵌套了 effectFn2
effect(function effectFn1() {
    console.log('effectFn1 执行')

    effect(function effectFn2() {
        console.log('effectFn2 执行')
        // 在 effectFn2 中读取 obj.bar 属性
        temp2 = obj.bar
    })
    // 在 effectFn1 中读取 obj.foo 属性
    temp1 = obj.foo
})
```

在理想情况下，希望副作用函数与对象属性之间的联系如下：

```js
data
 └── foo
      └── effectFn1
 └── bar
      └── effectFn2
```

希望当修改 obj.foo 时会触发 effectFn1 执行。由于 effectFn2 嵌套在 effectFn1 里，所以会间接触发 effectFn2 执行，而当修改 obj.bar 时，**只**会触发 effectFn2 执行。

当尝试修改 obj.foo 的值，会发现输出为：

```js
初始执行:
'effectFn1 执行'
'effectFn2 执行'

修改 obj.foo 的值:
'effectFn2 执行'
```

修改了字段 obj.foo 的值，发现 effectFn1 并没有重新执行，反而使得 effectFn2 重新执行了，这不符合预期。

出现上述问题的原因：全局变量 activeEffect 来存储通过 effect 函数注册的副作用函数，这意味着同一时刻 activeEffect 所存储的副作用函数只能有一个。当副作用函数发生嵌套时，内层副作用函数的执行会覆盖 activeEffect 的值，并且永远不会恢复到原来的值。这时如果再有响应式数据进行依赖收集，即使这个响应式数据是在外层副作用函 数中读取的，它们收集到的副作用函数也都会是内层副作用函数。

解决办法：维护一个副作用函数栈 effectStack， 在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执行完毕后将其从栈中弹出，并始终让 activeEffect 指向栈顶的副作用函数。

```js
// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
// effect 栈
const effectStack = [] // 新增
function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
        activeEffect = effectFn
        // 在调用副作用函数之前将当前副作用函数压入栈中
        effectStack.push(effectFn) // 新增
        fn()
        // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把activeEffect 还原为之前的值
        effectStack.pop() // 新增
        activeEffect = effectStack[effectStack.length - 1] // 新增
    }
    // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
    effectFn.deps = []
    // 执行副作用函数
    effectFn()
}
```



### 无限递归循环

代码案例：

```js
const data = { foo: 1 }
const obj = new Proxy(data, { /*...*/ })
effect(() => obj.foo++)
```

在这个语句中，既会读取 obj.foo 的值，又会设置 obj.foo 的值，而这就是导致问题的根本原因。可以尝试推理一下代码的执行流程：首先读取 obj.foo 的值，这会触发 track 操作，将当前副作用函数收集到“桶”中，接着将其加 1 后再赋值给 obj.foo，此时会触发 trigger 操作，即把“桶”中的副作用函数取出并执行。但问题是该副作用函数正在执行中，还没有执行完毕，就要开始下一次的执行。这样会导致无限递归地调用自己，于是就产生了栈溢出。

解决办法：通过分析这个问题能够发现，读取和设置操作是在同一个副作用函数内进行的。此时无论是 track 时收集的副作用函数，还是 trigger 时要触发执行的副作用函数，都是 activeEffect。基于此，可以在 trigger 动作发生时增加守卫条件：如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行，如以下代码所示：

```js
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
        if (effectFn !== activeEffect) { // 新增
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => effectFn())
}
```



### 调度执行

可调度指的是当 trigger 动作触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数以及方式。

例子：如何决定副作用函数的执行方式

```js
const data = { foo: 1 }
const obj = new Proxy(data, { /* ... */ })

effect(() => {
    console.log(obj.foo)
})

obj.foo++

console.log('结束了')

// 输出结果： 1 2 结束了
```

现在假设需求有变，输出顺序需要调整为： 1 结束了 2。这时就需要响应系统支持调度。

可以为 effect 函数设计一个选项参数 options，允许用户指定调度器：

```js
effect(
    () => {
        console.log(obj.foo)
    },
    // options
    {
        // 调度器 scheduler 是一个函数
        scheduler(fn) {
            // ...
        }
    }
)
```

在 effect 函数内部需要把 options 选项挂载到对应的副作用函数上：

```js
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    // 将 options 挂载到 effectFn 上
    effectFn.options = options // 新增
   
    effectFn.deps = []
    effectFn()
}
```

有了调度函数，在 trigger 函数中触发副作用函数重新执行时，就可以直接调用用户传递的调度器函数，从而**把控制权交给用户**：

```js
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
        if (effectFn.options.scheduler) { // 新增
            effectFn.options.scheduler(effectFn) // 新增
        } else {
            // 否则直接执行副作用函数（之前的默认行为）
            effectFn() // 新增
        }
    })
}
```

这时就能实现前面的打印需求了，如下：

```js
const data = { foo: 1 }
const obj = new Proxy(data, { /* ... */ })

effect(
    () => {
        console.log(obj.foo)
    },
    // options
    {
        // 调度器 scheduler 是一个函数
        scheduler(fn) {
            // 将副作用函数放到宏任务队列中执行
            setTimeout(fn)
        }
    }
)


obj.foo++

console.log('结束了')

// 打印结果：  1  '结束了'   2
```



除了控制副作用函数的执行顺序，通过调度器还可以做到控制它的执行次数。如下例子：

```js
const data = { foo: 1 }
const obj = new Proxy(data, { /* ... */ })
effect(() => {
    console.log(obj.foo)
})
obj.foo++
obj.foo++
```

在副作用函数中打印 obj.foo 的值，接着连续对其执行两次自增操作，在没有指定调度器的情况下，它的输出：1  2  3。

由输出可知，字段 obj.foo 的值一定会从 1 自增到 3，2 只是它 的过渡状态。如果只关心最终结果而不关心过程，那么执行三次 打印操作是多余的，期望的打印结果是： 1  3

基于调度器可以很容易地实现此功能：

```js
// 定义一个任务队列
const jobQueue = new Set()
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve()

// 一个标志代表是否正在刷新队列
let isFlushing = false
function flushJob() {
    // 如果队列正在刷新，则什么都不做
    if (isFlushing) return
    // 设置为 true，代表正在刷新
    isFlushing = true
    // 在微任务队列中刷新 jobQueue 队列
    p.then(() => {
        jobQueue.forEach(job => job())
    }).finally(() => {
        // 结束后重置 isFlushing
        isFlushing = false
    })
}


effect(() => {
    console.log(obj.foo)
}, {
    scheduler(fn) {
        // 每次调度时，将副作用函数添加到 jobQueue 队列中
        jobQueue.add(fn)
        // 调用 flushJob 刷新队列
        flushJob()
    }
})

obj.foo++
obj.foo++
```





### 计算属性与lazy

懒执行的effect。

前面实现的 effect 函数会立即执行传递给它的副作用函数一次，但在有些场景下，并不希望它立即执行，而是希望它在需要的时候才执行，例如计算属性。这时可以通过在 options 中添加 lazy 属性来达到目的。

```js
effect(
    // 指定了 lazy 选项，这个函数不会立即执行
    () => {
        console.log(obj.foo)
    },
    // options
    {
        lazy: true
    }
)
```

实现逻辑：

```js
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.options = options
    effectFn.deps = []
    // 只有非 lazy 的时候，才执行
    if (!options.lazy) { // 新增
        // 执行副作用函数
        effectFn()
    }
    // 将副作用函数作为返回值返回
    return effectFn // 新增
}
```

通过上面的代码可以看到，将副作用函数 effectFn 作为 effect 函数的返回值，这就意味着当调用 effect 函数时，通过其返回值能够拿到对应的副作用函数，这样就能手动执行该副作用函数了：

```js
const effectFn = effect(() => {
    console.log(obj.foo)
}, { lazy: true })

// 手动执行副作用函数
effectFn()
```

如果仅仅能够手动执行副作用函数，其意义并不大。**但如果把传递给 effect 的函数看作一个 getter，那么这个 getter 函数可以返回任何值**，例如：

```js
const effectFn = effect(
    // getter 返回 obj.foo 与 obj.bar 的和
    () => obj.foo + obj.bar,
    { lazy: true }
)
```

这样在手动执行副作用函数时，就能够拿到其返回值：

```js
const effectFn = effect(
    // getter 返回 obj.foo 与 obj.bar 的和
    () => obj.foo + obj.bar,
    { lazy: true }
)
// value 是 getter 的返回值
const value = effectFn()
```

为了实现这个目标，需要再对 effect 函数做一些修改，如以下代码所示：

```js
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        // 将 fn 的执行结果存储到 res 中
        const res = fn() // 新增
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        // 将 res 作为 effectFn 的返回值
        return res // 新增
    }
    effectFn.options = options
    effectFn.deps = []
    if (!options.lazy) {
        effectFn()
    }

    return effectFn
}
```

传递给 effect 函数的参数 fn 才是真正的副作用函数，而 effectFn 是包装后的副作用函数。

实现计算属性：

```js
function computed(getter) {
    // 把 getter 作为副作用函数，创建一个 lazy 的 effect
    const effectFn = effect(getter, {
        lazy: true
    })

    const obj = {
        // 当读取 value 时才执行 effectFn
        get value() {
            return effectFn()
        }
    }

    return obj
}
```

上面实现的计算属性代码能做到懒计算，但是做不到对值进行缓存。

添加缓存实现：

```js
function computed(getter) {
    // value 用来缓存上一次计算的值
    let value
    // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true
    })

    const obj = {
        get value() {
            // 只有“脏”时才计算值，并将得到的值缓存到 value 中
            if (dirty) {
                value = effectFn()
                // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
                dirty = false
            }
            return value
        }
    }

    return obj
}
```

上面代码存在的问题：修改 obj.foo 或 obj.bar 的值，再访问 sumRes.value 会发现访问到的值没有发 生变化：

```js
const data = { foo: 1, bar: 2 }
const obj = new Proxy(data, { /* ... */ })

const sumRes = computed(() => obj.foo + obj.bar)

console.log(sumRes.value) // 3
console.log(sumRes.value) // 3

// 修改 obj.foo
obj.foo++

// 再次访问，得到的仍然是 3，但预期结果应该是 4
console.log(sumRes.value) // 3
```

这是因为，当第一次访问 sumRes.value 的值后，变量 dirty 会设置为 false，代表不需要计算。即使后面修改了 obj.foo 的 值，但只要 dirty 的值为 false，就不会重新计算，所以导致我们得到了错误的值。

解决办法很简单，当 obj.foo 或 obj.bar 的值发生变化时，只 要 dirty 的值重置为 true 就可以了。这时就用到了 scheduler 选项，如以下代码所示：

```js
function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        // 添加调度器，在调度器中将 dirty 重置为 true
        scheduler() {
            dirty = true
        }
    })

    const obj = {
        get value() {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            return value
        }
    }

    return obj
}
```

为 effect 添加了 scheduler 调度器函数，它会在 getter 函数中所依赖的响应式数据变化时执行，这样我们在 scheduler 函 数内将 dirty 重置为 true，当下一次访问 sumRes.value 时，就会重新调用 effectFn 计算值，这样就能够得到预期的结果了。

上面代码存在的问题：当在另外一个 effect 中读取计算属性的值时：

```js
const sumRes = computed(() => obj.foo + obj.bar)

effect(() => {
    // 在该副作用函数中读取 sumRes.value
    console.log(sumRes.value)
})

// 修改 obj.foo 的值
obj.foo++

```

sumRes 是一个计算属性，并且在另一个 effect 的副作用函数中读取了 sumRes.value 的值。如果此时修改 obj.foo 的值，期望副作用函数重新执行，就像在 Vue.js 的模板中读取计算属性值的时候，一旦计算属性发生变化就会触发重新渲染一样。但是如果尝试运行上面这段代码，会发现修改 obj.foo 的 值并不会触发副作用函数的渲染。

从本质上看这就是一个典型的 effect 嵌套。一个计算属性内部拥有自己的 effect，并且它是懒执行的，只有当真正读取计算属性的值时才会执行。对于计算属性的 getter 函数来说，它里面访问的响应式数据只会把 computed 内部的 effect 收集为依赖。而当把计算属性用于另外一个 effect 时， 就会发生 effect 嵌套，外层的 effect 不会被内层 effect 中的响 应式数据收集。

解决办法：当读取计算属性的值时，可以手动调用 track 函数进行追踪；当计算属性依赖的响应式数据发生变化时，可以手动调用 trigger 函数触发响应：

```js
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        // 将 fn 的执行结果存储到 res 中
        const res = fn() // 新增
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        // 将 res 作为 effectFn 的返回值
        return res // 新增
    }
    effectFn.options = options
    effectFn.deps = []
    if (!options.lazy) {
        effectFn()
    }

    return effectFn
}


function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effectFn => {
        // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
        if (effectFn.options.scheduler) { // 新增
            effectFn.options.scheduler(effectFn) // 新增
        } else {
            // 否则直接执行副作用函数（之前的默认行为）
            effectFn() // 新增
        }
    })
}

function track(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect) return
    
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    // 把当前激活的副作用函数添加到依赖集合 deps 中
    deps.add(activeEffect)
    
    // deps 就是一个与当前副作用函数存在联系的依赖集合
    // 将其添加到 activeEffect.deps 数组中
    activeEffect.deps.push(deps) // 新增
}

function computed(getter) {
    let value
    let dirty = true

    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            if (!dirty) {
                dirty = true
                // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
                trigger(obj, 'value')
            }
        }
    })

    const obj = {
        get value() {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            // 当读取 value 时，手动调用 track 函数进行追踪
            track(obj, 'value')
            return value
        }
    }

    return obj
}
```



### watch

watch本质就是观测一个响应式数据，当数据发生变化时通知并执行相应的回调函数。

watch 的实现本质上就是利用了 effect 以及 options.scheduler 选项。如以下代码所示：

```js
effect(() => {
    console.log(obj.foo)
}, {
    scheduler() {
        // 当 obj.foo 的值变化时，会执行 scheduler 调度函数
    }
})
```

**当响应式数据变化时，会触发副作用函数重新执行。但如果副作用函数存在 scheduler 选项，当响应式数据发生变化时，会触发 scheduler 调度函数执行，而非直接触发副作用函数执行。**

watch基本实现：

```js
// watch 函数接收两个参数，source 是响应式数据，cb 是回调函数
function watch(source, cb) {
    effect(
        // 触发读取操作，从而建立联系
        () => source.foo,
        {
            scheduler() {
                // 当数据变化时，调用回调函数 cb
                cb()
            }
        }
    )
}

// 使用
const data = { foo: 1 }
const obj = new Proxy(data, { /* ... */ })
watch(obj, () => {
console.log('数据变化了')
})
obj.foo++
```

上面这段代码能正常工作，但是在 watch 函数的实现中，硬编码了对 source.foo 的读取操作。换句话说，现在只能观测 obj.foo 的改变。为了让 watch 函数具有通用性，需要一个封装一个通用的读取操作：

```js
function watch(source, cb) {
    effect(
        // 调用 traverse 递归地读取
        () => traverse(source),
        {
            scheduler() {
                // 当数据变化时，调用回调函数 cb
                cb()
            }
        }
    )
}

function traverse(value, seen = new Set()) {
    // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
    if (typeof value !== 'object' || value === null || seen.has(value)) return
    // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
    seen.add(value)
    // 暂时不考虑数组等其他结构
    // 假设 value 就是一个对象，使用 for...in 读取对象的每一个值，并递归地调用 traverse 进行处理
    for (const k in value) {
        traverse(value[k], seen)
    }

    return value
}
```

在 watch 内部的 effect 中调用 traverse 函数进行递归的读取操作，触发响应式数据中各个属性的getter函数，代替硬编码的方式，这样就能读取一个对象上的任意属性，从而当任意属性发生变化时都能够触发回调函数执行。



watch函数还可以接收一个getter函数：

```js
watch(
    // getter 函数
    () => obj.foo,
    // 回调函数
    () => {
        console.log('obj.foo 的值变了')
    }
)
```

对getter函数的支持：

```js
function watch(source, cb) {
    // 定义 getter
    let getter
    // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
    if (typeof source === 'function') {
        getter = source
    } else {
        // 否则按照原来的实现调用 traverse 递归地读取
        getter = () => traverse(source)
    }

    effect(
        // 执行 getter
        () => getter(),
        {
            scheduler() {
                cb()
            }
        }
    )
}
```

上面代码中传给watch函数的第二个参数回调函数并没有接收任何的新值或者旧值。

新值和旧值的实现：

```js
function watch(source, cb) {
    let getter
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }
    
    // 定义旧值与新值
    let oldValue, newValue
    // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到fectFn 中以便后续手动调用
    const effectFn = effect(
        () => getter(),
        {
            lazy: true,
            scheduler() {
                // 在 scheduler 中重新执行副作用函数，得到的是新值
                newValue = effectFn()
                // 将旧值和新值作为回调函数的参数
                cb(newValue, oldValue)
                // 更新旧值，不然下一次会得到错误的旧值
                oldValue = newValue
            }
        }
    )
    // 手动调用副作用函数，拿到的值就是旧值
    oldValue = effectFn()
}
```



#### watch函数的立即执行和回调执行

默认情况下，一个 watch 的第二参数（回调函数）只会在响应式数据发生变化时才执行。在 Vue.js 中可以通过选项参数 immediate 来指定回调是否需要立即执行。

回调函数的立即执 行与后续执行本质上没有任何差别，所以我们可以把 scheduler 调 度函数封装为一个通用函数，分别在初始化和变更时执行它，代码实现如下：

```js
function watch(source, cb, options = {}) {
    let getter
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }

    let oldValue, newValue

    // 提取 scheduler 调度函数为一个独立的 job 函数
    const job = () => {
        newValue = effectFn()
        cb(newValue, oldValue)
        oldValue = newValue
    }

    const effectFn = effect(
        // 执行 getter
        () => getter(),
        {
            lazy: true,
            // 使用 job 函数作为调度器函数
            scheduler: job
        }
    )

    if (options.immediate) {
        // 当 immediate 为 true 时立即执行 job，从而触发回调执行
        job()
    } else {
        oldValue = effectFn()
    }
}
```

由于回调函数是立即执 行的，所以第一次回调执行时没有所谓的旧值，因此此时回调函数的 oldValue 值为 undefined，这也是符合预期的。

除了指定回调函数为立即执行之外，还可以通过其他选项参数来指定回调函数的执行时机，例如在 Vue.js 3 中使用 flush 选项来指 定：

```js
watch(obj, () => {
    console.log('变化了')
}, {
    // 回调函数会在 watch 创建时立即执行一次
    flush: 'pre' // 还可以指定为 'post' | 'sync'
})
```

flush 本质上是在指定调度函数的执行时机。前文讲解过如何在微任务队列中执行调度函数 scheduler，这与 flush 的功能相同。 当 flush 的值为 'post' 时，代表调度函数需要将副作用函数放到一 个微任务队列中，并等待 DOM 更新结束后再执行，可以用如下代 码进行模拟：

```js
function watch(source, cb, options = {}) {
    let getter
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }

    let oldValue, newValue

    const job = () => {
        newValue = effectFn()
        cb(newValue, oldValue)
        oldValue = newValue
    }

    const effectFn = effect(
        // 执行 getter
        () => getter(),
        {
            lazy: true,
            scheduler: () => {
                // 在调度函数中判断 flush 是否为 'post'，如果是，将其放到微任务队列中执行
                if (options.flush === 'post') {
                    const p = Promise.resolve()
                    p.then(job)
                } else {
                    job()
                }
            }
        }
    )

    if (options.immediate) {
        job()
    } else {
        oldValue = effectFn()
    }
}

```

对于 options.flush 的值为 'pre' 的情况，暂时还没有办法模拟，因为这涉及组件的更新时机，其中 'pre' 和 'post' 原本的语义指的就是组件更新前和更新后，不过这并不影响理解如何控制回调函数的更新时机。



### 过期的副作用

竞态问题通常在多进程或多线程编程中出现。

```js
let finalData

watch(obj, async () => {
    // 发送并等待网络请求
    const res = await fetch('/path/to/request')
    // 将请求结果赋值给 data
    finalData = res
})
```

这段代码会发生竞态问题。假设第一次修改 obj 对象的某个字段值，这会导致回调函数执行，同时发送了第一次请求 A。随着时间的推移，在请求 A 的结果返回之前，对 obj 对象的某个字段值进行了第二次修改，这会导致发送第二次请求 B。此时请求 A 和请求 B 都在进行中，那么哪一个请求会先返回结果呢？不确定，如果请求 B 先于请求 A 返回结果，就会导致最终 finalData 中存储的是 A 请求的结果。

![image-20231231110824018](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231231110824018.png)

由于请求 B 是后发送的，因此认为请求 B 返回的数据才是 “最新”的，而请求 A 则应该被视为“过期”的，所以希望变量 finalData 存储的值应该是由请求 B 返回的结果，而非请求 A 返回的结果。

请求 A 是副作用函数第一次执行所产生的副作用，请求 B 是副作用函数第二次执行所产 生的副作用。由于请求 B 后发生，所以请求 B 的结果应该被视为“最 新”的，而请求 A 已经“过期”了，其产生的结果应被视为无效。通过这 种方式，就可以避免竞态问题导致的错误结果。

归根结底，需要的是一个让副作用过期的手段。为了让问题更加清晰，先拿 Vue.js 中的 watch 函数来复现场景，看看 Vue.js 是如何帮助开发者解决这个问题的，然后尝试实现这个功能。

在 Vue.js 中，watch 函数的回调函数接收第三个参数 onInvalidate，它是一个函数，类似于事件监听器，可以使用 onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行：

```js
watch(obj, async (newValue, oldValue, onInvalidate) => {
    // 定义一个标志，代表当前副作用函数是否过期，默认为 false，代表没有过期
    let expired = false
    // 调用 onInvalidate() 函数注册一个过期回调
    onInvalidate(() => {
        // 当过期时，将 expired 设置为 true
        expired = true
    })

    // 发送网络请求
    const res = await fetch('/path/to/request')

    // 只有当该副作用函数的执行没有过期时，才会执行后续操作。
    if (!expired) {
        finalData = res
    }
})
```

如上面的代码所示，在发送请求之前，定义了 expired 标志变量，**用来标识当前副作用函数的执行是否过期**；接着调用 onInvalidate 函数注册了一个过期回调，当该副作用函数的执行过期时将 expired 标志变量设置为 true；最后只有当没有过期时才采用请求结果，这样就可以有效地避免上述问题了。

换句话说，onInvalidate 的原理是什么呢？在 watch 内部每次检测到变更后，在副作用函数重新执行之前，会先调用通过 onInvalidate 函数注册的过期回调，仅此而已，如以下代码所示：

```js
function watch(source, cb, options = {}) {
    let getter
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }

    let oldValue, newValue

    // cleanup 用来存储用户注册的过期回调
    let cleanup
    // 定义 onInvalidate 函数
    function onInvalidate(fn) {
        // 将过期回调存储到 cleanup 中
        cleanup = fn
    }

    const job = () => {
        newValue = effectFn()
        // 在调用回调函数 cb 之前，先调用过期回调
        if (cleanup) {
            cleanup()
        }
        // 将 onInvalidate 作为回调函数的第三个参数，以便用户使用
        cb(newValue, oldValue, onInvalidate)
        oldValue = newValue
    }

    const effectFn = effect(
        // 执行 getter
        () => getter(),
        {
            lazy: true,
            scheduler: () => {
                if (options.flush === 'post') {
                    const p = Promise.resolve()
                    p.then(job)
                } else {
                    job()
                }
            }
        }
    )

    if (options.immediate) {
        job()
    } else {
        oldValue = effectFn()
    }
}
```

实际使用案例：

```js
watch(obj, async (newValue, oldValue, onInvalidate) => {
    let expired = false
    onInvalidate(() => {
        expired = true
    })

    const res = await fetch('/path/to/request')

    if (!expired) {
        finalData = res
    }
})

// 第一次修改
obj.foo++
setTimeout(() => {
    // 200ms 后做第二次修改
    obj.foo++
}, 200)
```

如以上代码所示，修改了两次 obj.foo 的值，第一次修改是立即执行的，这会导致 watch 的回调函数执行。由于在回调函数内调用了 onInvalidate，所以会注册一个过期回调，接着发送请求 A。假设请求 A 需要 1000ms 才能返回结果，而在 200ms 时第二次修改了 obj.foo 的值，这又会导致 watch 的回调函数执行。这时要注意的是，在实现中，每次执行回调函数之前要先检查过期回调是否存在，如果存在，会优先执行过期回调。由于在 watch 的回调 函数第一次执行的时候，已经注册了一个过期回调，所以在watch 的回调函数第二次执行之前，会优先执行之前注册的过期回调，这会使得第一次执行的副作用函数内闭包的变量 expired 的值变 为 true，即副作用函数的执行过期了。于是等请求 A 的结果返回时， 其结果会被抛弃，从而避免了过期的副作用函数带来的影响，如图：

![image-20231231111951514](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231231111951514.png)



## 第五章

响应式数据本身，实现响应式数据都需要考虑哪些内容，其中的难点又是什么。如何拦截 for...in 循环？track 函数如何追踪拦截到的 for...in 循环？如何对数组进行代理？如何支持集合类型的代理？



### proxy

Proxy 可以创建一个代理对象。它能够实现对其他对象的代理，Proxy 只能代理对象，无法代理非对象值，例如字符串、布尔值等。代理指的是对一个对象**基本语义**的代理。它允许拦截并重新定义对一个对象的**基本操作**。

基本语义：读取属性值、设置属性值就属于基本语义的操作，即基本操作。

一个函数也是一个对象，所以调用函数也是对一个对象的基本操作。可以用 Proxy 来拦截函数的调用操作，这里使用 apply 拦截函数的调用：

```js
const fn = (name) => {
    console.log('我是：', name)
}


const p2 = new Proxy(fn, {
    // 使用 apply 拦截函数调用
    apply(target, thisArg, argArray) {
        target.call(thisArg, ...argArray)
    }
})

p2('hcy') // 输出：'我是：hcy'
```

Proxy 只能够拦截对一个 对象的基本操作。

那典型的非基本操作：调用对象的方法。（复合操作）

调用一个对象方法，是由两个基本语义组成的。第 一个基本语义是 get，即先通过 get 操作得到 obj.fn 属性。第二个基本语义是函数调用，即通过 get 得到 obj.fn 的值后再调用它，也就是上面说到的apply。



### Reflect

Reflect 是一个全局对象，其下有许多方法，例如：

```js
Reflect.get()
Reflect.set()
Reflect.apply()
// ...
```

Reflect 下的方法与 Proxy 的拦截器方法名字相同，任何在 Proxy 的拦截器中能够找到的方法，都能够在 Reflect 中找到同名函数。

Reflect.get 函数的功能就是提供了访问一个对象属性的默认行为，例如下面两个操作是等价的：

```js
const obj = { foo: 1 }

// 直接读取
console.log(obj.foo) // 1
// 使用 Reflect.get 读取
console.log(Reflect.get(obj, 'foo')) // 1
```

既然操作等价，那么它存在的意义是什么？实际上 Reflect.get 函数还能接收第三个参数，即指定接收者 receiver，你可以把它理解为函数调用过程中的 this，例如：

```js
const obj = { foo: 1 }
console.log(Reflect.get(obj, 'foo', { foo: 2 })) // 输出的是 2 而不是 1
```

以前的响应式对象：

```js
const obj = { foo: 1 }

const p = new Proxy(obj, {
    get(target, key) {
        track(target, key)
        // 注意，这里我们没有使用 Reflect.get 完成读取
        return target[key]
    },
    set(target, key, newVal) {
        // 这里同样没有使用 Reflect.set 完成设置
        target[key] = newVal
        trigger(target, key)
    }
})
```



新的对象：

```js
const obj = {
    foo: 1,
    get bar() {
        return this.foo
    }
}

const p = new Proxy(obj, {
    get(target, key) {
        track(target, key)
        // 注意，这里我们没有使用 Reflect.get 完成读取
        return target[key]
    },
    set(target, key, newVal) {
        // 这里同样没有使用 Reflect.set 完成设置
        target[key] = newVal
        trigger(target, key)
    }
})

effect(() => {
    console.log(p.bar) // 1
})
```

当 effect 注册的副作用函数执行时，会读取 p.bar 属性，它发现 p.bar 是一个访问器属 性，因此执行 getter 函数。由于在 getter 函数中通过 this.foo 读取了 foo 属性值，因此认为副作用函数与属性 foo 之间也会建立联系。当修改 p.foo 的值时应该能够触发响应，使得副作用函数重新执行才对。然而实际并非如此，当尝试修改 p.foo 的值时，副作用函数并没有重新执行。

问题就出在 bar 属性的访问器函数 getter 里：

```js
const obj = {
    foo: 1,
    get bar() {
        return this.foo
    }
}
```

使用 this.foo 读取 foo 属性值时，这里的 this 指向的 是谁？回顾一下整个流程。首先，通过代理对象 p 访问 p.bar，这会触发代理对象的 get 拦截函数执行：

```js
const p = new Proxy(obj, {
    get(target, key) {
        track(target, key)
        // 注意，这里我们没有使用 Reflect.get 完成读取
        return target[key]
    },
    set(target, key, newVal) {
        // 这里同样没有使用 Reflect.set 完成设置
        target[key] = newVal
        trigger(target, key)
    }
})
```

在 get 拦截函数内，通过 target[key] 返回属性值。其中 target 是原始对象 obj，而 key 就是字符串 'bar'，所以 target[key] 相当于 obj.bar。因此，当使用 p.bar 访问 bar 属性时，它的 getter 函数内的 this 指向的其实是原始对象 obj， 这说明最终访问的其实是 obj.foo。很显然，在副作用函数内通 过原始对象访问它的某个属性是不会建立响应联系的。

```js
effect(() => {
    // obj 是原始数据，不是代理对象，这样的访问不能够建立响应联系
    obj.foo
})
```

因为这样做不会建立响应联系，所以出现了无法触发响应的问题。

解决办法就是：使用Reflect.get 函数。

```js
const p = new Proxy(obj, {
    // 拦截读取操作，接收第三个参数 receiver
    get(target, key, receiver) {
        track(target, key)
        // 使用 Reflect.get 返回读取到的属性值
        return Reflect.get(target, key, receiver)
    },
    // 省略部分代码
})
```

代理对象的 get 拦截函数接收第三个参数 receiver，它代表谁在读取属性。p.bar 代理对象 p 在读取 bar 属性

使用 Reflect.get(target, key, receiver) 代替 之前的 target[key]，这里的关键点就是第三个参数 receiver。 我们已经知道它就是代理对象 p，所以访问器属性 bar 的 getter 函 数内的 this 指向代理对象 p。



### 对象

根据 ECMAScript 规范，在 JavaScript 中有两种对象，其 中一种叫作常规对象（ordinary object），另一种叫作异质对象 （exotic object）。这两种对象包含了 js中的所有对象，任何不属于常规对象的对象都是异质对象。

对象的内部方法和内部槽：

在js中函数也是一个对象。假设给出一个对 象 obj，如何区分它是普通对象还是函数呢？实际上，在 JavaScript 中，对象的实际语义是由对象的内部方法（internal method）指定的。 所谓内部方法，指的是当我们对一个对象进行操作时在引擎内部调用的方法，这些方法对于 JavaScript 使用者来说是不可见的。当访问对象属性时，引擎内部会调用 [[Get]] 这个内部方法来读取属性值。（在 ECMAScript 规范中使用 [[xxx]] 来代表内部方法或内部槽）。

对象必要的内部方法：

| 内部方法              | 签名                                              | 描述                                                         |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| [[GetPrototypeOf]]    | ( ) → Object \| null                              | 查明为该对象提供继承属性的对象， null 代表没有继承属性       |
| [[SetPrototypeOf]]    | (Object \| Null) → Boolean                        | 将该对象与提供继承属性的另一个对 象相关联。传递 null 表示没有继承属性，返回 true 表示操作成功完 成，返回 false 表示操作失败 |
| [[IsExtensible]]      | ( ) → Boolean                                     | 查明是否允许向该对象添加其他属性                             |
| [[PreventExtensions]] | ( ) → Boolean                                     | 控制能否向该对象添加新属性。如果操作成功则返回 true，如果操作失败 则返回 false |
| [[GetOwnProperty]]    | (propertyKey) → Undefined  \| Property Descriptor | 返回该对象自身属性的描述符，其键 为 propertyKey，如果不存在这样的 属性，则返回 undefined |
| [[DefineOwnProperty]] | (propertyKey, PropertyDescriptor) → Boolean       | 创建或更改自己的属性，其键为 propertyKey，以具有由 PropertyDescriptor 描述的状态。如 果该属性已成功创建或更新，则返回 true；如果无法创建或更新该属性， 则返回 false |
| [[HasProperty]]       | (propertyKey) → Boolean                           | 返回一个布尔值，指示该对象是否已 经拥有键为 propertyKey 的自己的或 继承的属性 |
| [[Get]]               | (propertyKey, Receiver) → any                     | 从该对象返回键为 propertyKey 的属 性的值。如果必须运行 ECMAScript 代码来检索属性值，则在运行代码时 使用 Receiver 作为 this 值 |
| [[Set]]               | (propertyKey, value, Receiver) → Boolean          | 将键值为 propertyKey 的属性的值设 置为 value。如果必须运行 ECMAScript 代码来设置属性值，则 在运行代码时使用 Receiver 作为 this 值。如果成功设置了属性值，则 返回 true；如果无法设置，则返回 false |
| [[Delete]]            | (propertyKey) → Boolean                           | 从该对象中删除属于自身的键为 propertyKey 的属性。如果该属性未 被删除并且仍然存在，则返回 false；如果该属性已被删除或不存 在，则返回 true |
| [[OwnPropertyKeys]]   | ( ) → List of propertyKey                         | 返回一个 List，其元素都是对象自身的属性键                    |
|                       |                                                   |                                                              |
| [[Call]]              | (any, a List of any) → any                        | 将运行的代码与 this 对象关联。由**函数调用触发**。该内部方法的参数是一个 this 值和参数列表 |
| [[Construct]]         | (a List of any, Object) → Object                  | 创建一个对象。通过 **new 运算符或 super 调用触发**。该内部方法的第一个参数是一个 List，该 List 的元素是构造函数调用或 super 调用的参数，第二个参数是最初应用 new 运算符的对象。实现该内部方法的对象称为构造函数 |

**如果一个对象需要作为函数调用，那么这个对象就必须部署内部方法 [[Call]]**。现在就可以回答前面的问题了：如何区分一个 对象是普通对象还是函数呢？一个对象在什么情况下才能作为函数调用呢？答案是，通过内部方法和内部槽来区分对象，例如**函数对象会部署内部方法 [[Call]]，而普通对象则不会**。

内部方法具有多态性，这类似于面向对象里多态的概念。这就是说，不同类型的对象可能部署了相同的内部方法， 却具有不同的逻辑。例如，普通对象和 Proxy 对象都部署了 [[Get]] 这个内部方法，但它们的逻辑是不同的，普通对象部署的 [[Get]] 内部方法的逻辑是由 ECMA 规范的 10.1.8 节定义的，而 Proxy 对象部署的 [[Get]] 内部方法的逻辑是由 ECMA 规范的 10.5.8 节来定义的。

了解了内部方法，就可以解释什么是常规对象，什么是异质对象了。满足以下三点要求的对象就是常规对象：

- 对于上面列出的内部方法，必须使用 ECMA 规范 10.1.x 节给出的定义实现； 
- 对于内部方法 [[Call]]，必须使用 ECMA 规范 10.2.1 节给出的定义实现； 
- 对于内部方法 [[Construct]]，必须使用 ECMA 规范 10.2.2 节给出的定义实现。

所有不符合这三点要求的对象都是异质对象。Proxy 对象的内部方法 [[Get]] 没有使用 ECMA 规范的 10.1.8 节给出的定义实现，所以 Proxy 是一个异质对象。

```js
const p = new Proxy(obj,{/* ... */})
p.foo
```

通过代理对象访问属性值时：引擎会调用部署在对象 p 上的内部方法 [[Get]]。到这 一步，其实代理对象和普通对象没有太大区别。它们的区别在于内部方法 [[Get]] 的实现，这里就体现了内部方法的多态性，即不同的对象部署相同的内部方法，但它们的行为可能不同。具体的不同体现在，如果在创建代理对象时没有指定对应的拦截函数，例如没有指 定 get() 拦截函数，那么当我们通过代理对象访问属性值时，代理对象的内部方法 [[Get]] 会调用原始对象的内部方法 [[Get]] 来获取 属性值，这其实就是代理透明性质。

创建代理对象时指定的拦截函数，实际上是用来自定义代理对象本身的内部方法和行为的，而不是用来指定被代理对象的内部方法和行为的。

下面列出了 Proxy 对象部署的所有内部方法以及用来**自定义**内部方法和行为的拦截函数名字：

| 内部方法              | 处理器函数               |
| --------------------- | ------------------------ |
| [[GetPrototypeOf]]    | getPrototypeOf           |
| [[SetPrototypeOf]]    | setPrototypeOf           |
| [[IsExtensible]]      | isExtensible             |
| [[PreventExtensions]] | preventExtensions        |
| [[GetOwnProperty]]    | getOwnPropertyDescriptor |
| [[DefineOwnProperty]] | defineProperty           |
| [[HasProperty]]       | has                      |
| [[Get]]               | get                      |
| [[Set]]               | set                      |
| [[Delete]]            | deleteProperty           |
| [[OwnPropertyKeys]]   | ownKeys                  |
| [[Call]]              | apply                    |
| [[Construct]]         | construct                |

其中 [[Call]] 和 [[Construct]] 这两个内部方法只有当被代理的对象是函数和构造函数时才会部署。

当要拦截删除属性操作时，可以使用 deleteProperty 拦截函数实现：

```js
const obj = { foo: 1 }
const p = new Proxy(obj, {
    deleteProperty(target, key) {
        return Reflect.deleteProperty(target, key)
    }
})

console.log(p.foo) // 1
delete p.foo
console.log(p.foo) // 未定义
```

deleteProperty 实现的是代理对象 p 的内部方法和行为，所以为了删除被代理对象上的属性值，需要使用 Reflect.deleteProperty(target, key) 来完成。



### 代理对象

**属性读取**

前面给代理对象绑定get函数，实现对被代理对象属性的读取操作的拦截。但是时实际上，读取操作不仅仅只是对象点属性（obj.xxx）这种方式。对于js来说，使用in操作符检查对象上是否有某个属性也是读取操作。

````js
effect(()=>{
    'foo' in obj
})
````

响应系统应该拦截一切读取操 作，以便当数据变化时能够正确地触发响应。下面列出了对一个普通 对象的所有可能的读取操作。

- 访问属性：obj.foo。
- 判断对象或原型上是否存在给定的 key：key in obj。
- 使用 for...in 循环遍历对象：for (const key in obj) {}。

如何拦截这些读取操作？

- 对于属性的读取，例如 obj.foo，通过 get 拦截函数实现

- 对于 in 操作符，寻找与 in 操作符对应的拦截函数，如果找不到直接与in相关的自定义内部方法和行为的拦截函数名字，这时就需要去查看ECMA规范，规范中会明确定义 in 操作符的运行时逻辑

  ![image-20240103114758916](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240103114758916.png)

  关键点在第 6 步，可以发现，in 操作符的运算结果是通过调用一 个叫作 HasProperty 的抽象方法得到的。关于 HasProperty 抽象 方法，可以在 ECMA-262 规范的 7.3.11 节中找到，它的操作如图：

  ![image-20240103114837723](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240103114837723.png)

  在第 3 步中，可以看到 HasProperty 抽象方法的返回值是通过 调用对象的内部方法 [[HasProperty]] 得到的。而 [[HasProperty]] 内部方法对应的拦截函数名叫 has，因此可以通过 has 拦截函数实现对 in 操作符的代理。

  ```js
  const obj = { foo: 1 }
  const p = new Proxy(obj, {
      has(target, key) {
          track(target, key)
          return Reflect.has(target, key)
      }
  })
  ```

- 拦截 for...in 循环，一个对象的任何操作其实都是由基本语义方法及其组合实现的， for...in 循环也不例外。为了搞清楚 for...in 循环依赖哪些基本语义方法，需要看规范。

  在规范的 14.7.5.6 节中定义了 for...in 头部的执行规则：

  ![image-20240103115348142](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240103115348142.png)

  其中的关键点在于 EnumerateObjectProperties(obj)。这 里的 EnumerateObjectProperties 是一个抽象方法，该方法返回 一个迭代器对象，规范的 14.7.5.9 节给出了满足该抽象方法的示例实现，如下面的代码所示：

  ```js
  function* EnumerateObjectProperties(obj) {
      const visited = new Set();
      for (const key of Reflect.ownKeys(obj)) {
          if (typeof key === "symbol") continue;
          const desc = Reflect.getOwnPropertyDescriptor(obj, key);
          if (desc) {
              visited.add(key);
              if (desc.enumerable) yield key;
          }
      }
      const proto = Reflect.getPrototypeOf(obj);
      if (proto === null) return;
      for (const protoKey of EnumerateObjectProperties(proto)) {
          if (!visited.has(protoKey)) yield protoKey;
      }
  }
  ```

  可以看到，该方法是一个 generator 函数，接收一个参数 obj。实际上，obj 就是被 for...in 循环遍历的对象，其关键点在 于使用 Reflect.ownKeys(obj) 来获取只属于对象自身拥有的键。 有了这个线索，如何拦截 for...in 循环的答案已经很明显了，我们 可以使用 ownKeys 拦截函数来拦截 Reflect.ownKeys 操作：

  ```js
  const obj = { foo: 1 }
  const ITERATE_KEY = Symbol()
  
  const p = new Proxy(obj, {
      ownKeys(target) {
          // 将副作用函数与 ITERATE_KEY 关联
          track(target, ITERATE_KEY)
          return Reflect.ownKeys(target)
      }
  })
  ```

  将 ITERATE_KEY 作为追踪的 key是因为 ownKeys 拦截函数与 get/set 拦截函数不同，在 set/get 中，可以得到具体操作的 key，但是在 ownKeys 中，只能拿到目标对象 target。ownKeys 用来获取一个对象的所有属于自己的键值，这个操作明显不与任何具体的键进行绑定，因此只能够构造唯一的 key 作为标识，即 ITERATE_KEY。

  追踪的是 ITERATE_KEY，那么相应地，在触发响应的时候也 应该触发它才行：

  ```js
  trigger(target, ITERATE_KEY)
  ```

  但是在什么情况下，对数据的操作需要触发与 ITERATE_KEY 相 关联的副作用函数重新执行？当为对象添加新属性时，会对 for...in 循环产生影响，所以需要触发与 ITERATE_KEY 相关联的 副作用函数重新执行。



**属性删除**

规范的 13.5.1.2 节中明确定 义了 delete 操作符的行为：

![image-20240103123715786](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240103123715786.png)

由第 5 步中的 d 子步骤可知，delete 操作符的行为依赖 [[Delete]] 内部方法。该内部方法可以使用 deleteProperty 拦截：

```js
const p = new Proxy(obj, {
    deleteProperty(target, key) {
        // 检查被操作的属性是否是对象自己的属性
        const hadKey = Object.prototype.hasOwnProperty.call(target,key)
        // 使用 Reflect.deleteProperty 完成属性的删除
        const res = Reflect.deleteProperty(target, key)

        if (res && hadKey) {
            // 只有当被删除的属性是对象自己的属性并且成功删除时，才触发更新
            trigger(target, key, 'DELETE')
        }

        return res
    }
})
```

首先检查被删除的属性是否属于对象自身，然 后调用 Reflect.deleteProperty 函数完成属性的删除工作，只有 当这两步的结果都满足条件时，才调用 trigger 函数触发副作用函数 重新执行。需要注意的是，在调用 trigger 函数时，我们传递了新的 操作类型 'DELETE'。由于删除操作会使得对象的键变少，它会影响 for...in 循环的次数，因此当操作类型为 'DELETE' 时，我们也应 该触发那些与 ITERATE_KEY 相关联的副作用函数重新执行。

```js
function trigger(target, key, type) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)

    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })

    // 当操作类型为 ADD 或 DELETE 时，需要触发与 ITERATE_KEY 相关联的副作用函数重新执行
    if (type === 'ADD' || type === 'DELETE') {
        const iterateEffects = depsMap.get(ITERATE_KEY)
        iterateEffects && iterateEffects.forEach(effectFn => {
            if (effectFn !== activeEffect) {
                effectsToRun.add(effectFn)
            }
        })
    }

    effectsToRun.forEach(effectFn => {
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn()
        }
    })
}
```





### 合理地触发响应

- 当值没有发生变化时， 应该不需要触发响应

为此，需要修改 set 拦截函数的代码，在调用 trigger 函数触发响应之 前，需要检查值是否真的发生了变化：

```js
const p = new Proxy(obj, {
    set(target, key, newVal, receiver) {
        // 先获取旧值
        const oldVal = target[key]

        const type = Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD'
        const res = Reflect.set(target, key, newVal, receiver)
        // 比较新值与旧值，只要当不全等的时候才触发响应
        if (oldVal !== newVal) {
            trigger(target, key, type)
        }

        return res
    },
})

```

仅仅进行全等比较是有缺陷的，这体现在对 NaN 的处理上。

```js
NaN === NaN // false
NaN !== NaN // true
```

换句话说，如果 p.foo 的初始值是 NaN，并且后续又为其设置了 NaN 作为新值。

优化后的代码：

```js
const p = new Proxy(obj, {
    set(target, key, newVal, receiver) {
        // 先获取旧值
        const oldVal = target[key]

        const type = Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD'
        const res = Reflect.set(target, key, newVal, receiver)
        // 比较新值与旧值，只有当它们不全等，并且不都是 NaN 的时候才触发响应
        if (oldVal !== newVal && (oldVal === oldVal || newVal ===newVal)) {
            trigger(target, key, type)
        }

        return res
    },
})
```



- 原型上的响应式数据，问题说明：

  封装一个 reactive 函数：

  ```js
  function reactive(obj) {
      return new Proxy(obj, {
          // 省略前文讲解的拦截函数
      })
  }
  
  
  const obj = {}
  const proto = { bar: 1 }
  
  const child = reactive(obj)
  const parent = reactive(proto)
  // 使用 parent 作为 child 的原型， parent也是一个响应式数据
  Object.setPrototypeOf(child, parent)
  
  effect(() => {
      console.log(child.bar) // 1
  })
  // 修改 child.bar 的值
  child.bar = 2 // 会导致副作用函数重新执行两次
  ```

  child 本身并没有 bar 属性，因此当访问 child.bar 时，值是从原 型上继承而来的。但无论如何，既然 child 是响应式数据，那么它与副作用函数之间就会建立联系，因此当执行 child.bar = 2 时，期望副作用函数会重新执行。**但如果尝试运行上面的代码，会发现副作用函数不仅执行了，还执行了两次，这会造成不必要的更新。**





## 第六章



### ref

基本数据类型的值要变为响应式数据，必须经过一层包裹。

```js
let str = 'vue'
// 无法拦截对值的修改
str = 'vue3'


// 使用一个非原始值去“包裹”原始值
const wrapper = {
    value: 'vue'
}
// 可以使用 Proxy 代理 wrapper，间接实现对原始值的拦截
const name = reactive(wrapper)
name.value // vue
// 修改值可以触发响应
name.value = 'vue3'
```

这样做导致的问题：

1. 用户为了创建一个响应式的原始值，不得不顺带创建一个包裹对象；
2. 包裹对象由用户定义，而这意味着不规范。用户可以随意命名，例如 wrapper.value、wrapper.val 都是可以的。

为了解决这两个问题，可以封装一个函数，将包裹对象的创建工作都封装到该函数中：

```js
// 封装一个 ref 函数
function ref(val) {
    // 在 ref 函数内部创建包裹对象
    const wrapper = {
        value: val
    }
    // 将包裹对象变成响应式数据
    return reactive(wrapper)
}
```

把创建 wrapper 对象的工作封装到 ref 函数内部，然后使用 reactive 函数将包裹对象变成响应式数据并返 回。这样就解决了上述两个问题。运行如下测试代码。























## 第七章

渲染器的具体实现，vue中的很多功能都是依赖于渲染器来实现的，比如：

- Transition组件
- Teleposrt组件
- Suspense组件
- template ref
- 自定义指令

渲染器的性能直接影响框架的整体性能。渲染器模块包含Diff算法，快捷路径更新方式能充分利用编译器提供的信息，大大加快了更新性能。



### 渲染器和响应式系统的结合

浏览器端的渲染器。利用副作用函数和响应式数据，可以让渲染过程自动化：

```js
const { effect, ref } = VueReactivity

function renderer(domString, container) {
    container.innerHTML = domString
}

const count = ref(1)

effect(() => {
    renderer(`<h1>${count.value}</h1>`, document.getElementById('app'))
})

count.value++
```



### 渲染器中的基本概念

- renderer：渲染器，把虚拟DOM渲染为指定平台的真实元素
- render：渲染
- 虚拟DOM（virtual DOM、vdom）：虚拟DOM是和真实DOM在结构上一一对应的一个JavaScript对象，且是树结构
- 虚拟节点（virtual node、vnode）
- 挂载(mount)：渲染器将虚拟DOM节点渲染为真实DOM节点的过程
- 挂载点（container）：一个真实存在的DOM元素，用于将渲染器创建的真实DOM挂载到它上面

```js
function createRenderer() {
    function render(vnode, container) {
        // ...
    }

    return render
}
```

为什么需要 createRenderer 函数，而不直接定义 render ? 渲染器与渲染是不同的。渲染器是更加宽泛的概念，它包含渲染。渲 染器不仅可以用来渲染，还可以用来激活已有的 DOM 元素，这个过程通常发生在同构渲染的情况下，如以下代码所示：

```js
function createRenderer() {
    function render(vnode, container) {
        // ...
    }

    function hydrate(vnode, container) {
        // ...
    }

    return {
        render,
        hydrate
    }
}

const renderer = createRenderer() 
// 首次渲染 首次调用 renderer.render 函数时，只需要创建新的 DOM 元素即可，这个过程只涉及挂载。当多次在同一个 container 上调用 renderer.render 函数进行渲染时，渲染器除了要执行挂载动作外，还要执行更新动作。
renderer.render(vnode, document.querySelector('#app'))
```

当调用 createRenderer 函数创建渲染器（就是这个函数返回的那个对象）时，渲染器不仅包含 render 函数，还包含 hydrate 函数。关于 hydrate 函 数，介绍服务端渲染时会详细讲解。这个例子说明，渲染器的内容非常广泛，而用来把 vnode 渲染为真实 DOM 的 render 函数只是其中 一部分。实际上，在 Vue.js 3 中，甚至连创建应用的 createApp 函数也是渲染器的一部分。

```js
const renderer = createRenderer()
// 首次渲染
renderer.render(oldVNode, document.querySelector('#app'))
// 第二次渲染
renderer.render(newVNode, document.querySelector('#app'))
```

如上面的代码所示，由于首次渲染时已经把 oldVNode 渲染到 container 内了，所以当再次调用 renderer.render 函数并尝试 渲染 newVNode 时，就不能简单地执行挂载动作了。在这种情况下， 渲染器会使用 newVNode 与上一次渲染的 oldVNode 进行比较，试图找到并更新变更点。这个过程叫作**“打补丁”（或更新）**，英文通常用 **patch** 来表达。但实际上，挂载动作本身也可以看作一种特殊的打补 丁，它的特殊之处在于旧的 vnode 是不存在的。

```js
function createRenderer() {
    function render(vnode, container) {
        if (vnode) {
            // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
            patch(container._vnode, vnode, container)
        } else {
            if (container._vnode) {
                // 旧 vnode 存在，且新 vnode 不存在，说明是卸载（unmount）操作
                // 只需要将 container 内的 DOM 清空即可
                container.innerHTML = ''
            }
        }
        // 把 vnode 存储到 container._vnode 下，即后续渲染中的旧 vnode
        container._vnode = vnode
    }

    return {
        render
    }
}
```

patch 函数是整个渲染器的核心入口，它承载了最重要的渲染逻辑，

```js
function patch(n1, n2, container) {
    // ...
}
```

- 第一个参数 n1：旧 vnode
- 第二个参数 n2：新 vnode
- 第三个参数 container：容器

在首次渲染时，容器元素的 container._vnode 属性是不存在 的，即 undefined。这意味着，在首次渲染时传递给 patch 函数的 第一个参数 n1 也是 undefined。这时，patch 函数会执行挂载动 作，它会忽略 n1，并直接将 n2 所描述的内容渲染到容器中。从这一 点可以看出，patch 函数不仅可以用来完成打补丁，也可以用来执行挂载。



### 自定义渲染器

通过将渲染器设计为可配置的“通用”渲染器，就可以实现渲染到任意目标平台上。

本节目标：以浏览器作为渲染的目标 平台，编写一个渲染器。通过抽离出针对浏览器的API，使得渲染器的和兴不依赖于具体平台。在此基础上，再为那些被抽离的 API 提供可配置的接口，即可实现渲染器的跨平台能力。

示例：

```js
const vnode = {
    type: 'h1',
    children: 'hello'
}

// 创建一个渲染器
const renderer = createRenderer()
// 调用 render 函数渲染该 vnode
renderer.render(vnode, document.querySelector('#app'))
```

对于虚拟DOM对象而言，不同的类型的节点对应的type值是不一样的。

patch函数：

```js
function createRenderer() {
    function mountElement(vnode, container) {
        // 创建 DOM 元素
        const el = document.createElement(vnode.type)
        // 处理子节点，如果子节点是字符串，代表元素具有文本节点
        if (typeof vnode.children === 'string') {
            // 因此只需要设置元素的 textContent 属性即可
            el.textContent = vnode.children
        }
        // 将元素添加到容器中
        container.appendChild(el)
    }


    function patch(n1, n2, container) {
        // 如果 n1 不存在，意味着挂载，则调用 mountElement 函数完成挂载
        if (!n1) {
            mountElement(n2, container)
        } else {
            // n1 存在，意味着打补丁，暂时省略
        }
    }

    function render(vnode, container) {
        if (vnode) {
            patch(container._vnode, vnode, container)
        } else {
            if (container._vnode) {
                container.innerHTML = ''
            }
        }
        container._vnode = vnode
    }

    return {
        render
    }
}
```

目标是设计一个不依赖于浏览器平台的通用渲染器，mountElement 函数内调用了大量依赖于浏览器 的 API，例如 document.createElement、el.textContent 以 及 appendChild 等。想要设计通用渲染器，第一步要做的就是将这些浏览器特有的 API 抽离。可以将这些操作 DOM 的 API 作为配置项，该配置项可以作为 createRenderer 函数的参数， 如下面的代码所示：

```js
// 在创建 renderer 时传入配置项
const renderer = createRenderer({
    // 用于创建元素
    createElement(tag) {
        return document.createElement(tag)
    },
    // 用于设置元素的文本节点
    setElementText(el, text) {
        el.textContent = text
    },
    // 用于在给定的 parent 下添加指定元素
    insert(el, parent, anchor = null) {
        parent.insertBefore(el, anchor)
    }
})

```

这样，在 mountElement 等函数 内就可以通过配置项来取得操作 DOM 的 API 了：

```js
function createRenderer(options) {

    // 通过 options 得到操作 DOM 的 API
    const {
        createElement,
        insert,
        setElementText
    } = options

    // 在这个作用域内定义的函数都可以访问那些 API
    function mountElement(vnode, container) {
        // 调用 createElement 函数创建元素
        const el = createElement(vnode.type)
        if (typeof vnode.children === 'string') {
            // 调用 setElementText 设置元素的文本节点
            setElementText(el, vnode.children)
        }
        // 调用 insert 函数将元素插入到容器内
        insert(el, container)
    }

    function patch(n1, n2, container) {
        // ...
    }

    function render(vnode, container) {
        // ...
    }

    return {
        render
    }
}
```

以上就实现了能自定义渲染器的能力。通过抽象的手段，让核心代码不再依赖平台特有的 API，再通过支持个性化配置的能力来实现跨平台。



## 第八章

渲染器的挂载和更新。

### 子节点的挂载和节点属性

虚拟DOM的子节点chilren属性：

- children是一个字符串类型的值，表示虚拟DOM节点的内本内容
- children是其他元素对应的虚拟DOM节点
- children是多种类型的值的混合（这时children的值是一个数组，元素是一个个的虚拟DOM子节点）

children的每一个 元素都是一个独立的虚拟节点对象。这样就形成了树型结构，即虚拟 DOM 树。

实现子节点的渲染，修改mountElement：

```js
function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    if (typeof vnode.children === 'string') {
        setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
        // 如果 children 是数组，则遍历每一个子节点，并调用 patch 函数挂载它们
        vnode.children.forEach(child => {
            patch(null, child, el)
        })
    }
    insert(el, container)
}
```



如何用 vnode 描述一个标签的属性，以及如何渲染这些属性？HTML 标签有很多属 性，其中有些属性是通用的，例如 id、class 等，而有些属性是特定 元素才有的，例如 form 元素的 action 属性。

最基本的属性处理：虚拟 DOM 定义了一个新的 vnode.props 字段，专门用于存放标签的属性。

```js

const vnode = {
    type: 'div',
    // 使用 props 描述一个元素的属性
    props: {
        id: 'foo'
    },
    children: [
        {
            type: 'p',
            children: 'hello'
        }
    ]
}
```

可以通过遍历 props 对象的方式， 把这些属性渲染到对应的元素上：

```js
function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    // 省略 children 的处理

    // 如果 vnode.props 存在才处理它
    if (vnode.props) {
        // 遍历 vnode.props
        for (const key in vnode.props) {
            // 调用 setAttribute 将属性设置到元素上
            el.setAttribute(key, vnode.props[key])
        }
    }

    insert(el, container)
}
```

除了使用 setAttribute 函数为元素设置属性之外，还 可以通过 **DOM 对象**直接设置：

```js
function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    // 省略 children 的处理

    if (vnode.props) {
        for (const key in vnode.props) {
            // 直接设置
            el[key] = vnode.props[key]
        }
    }

    insert(el, container)
}
```

实际上，无论是使用 setAttribute 函数， 还是直接操作 DOM 对象，都存在缺陷。在深入之前，需要先了解 HTML Attributes 和 DOM Properties。



### HTML Attributes 和 DOM Properties

HTML Attributes 和 DOM Properties的差异和联系，目的是正确的设置元素的属性。

```html
<input id="my-input" type="text" value="foo" />
```

HTML Attributes 指的就是定义在 HTML 标签上的属性。当浏览器解析这段 HTML 代码后，会创建一个与之相符的 DOM 元素对象，可以通过 JavaScript 代码获取该 DOM 对象。

通过js获取到的DOM对象上有许多的属性（properties），这些属性就是所谓的 DOM Properties。



HTML Attributes 和 DOM Properties的关系：

- 很多 HTML Attributes 在 DOM 对象上有与之同名的 DOM Properties，例如 id="my-input" 对 应 el.id，type="text" 对应 el.type，value="foo" 对应 el.value 等。

-  DOM Properties 与 HTML Attributes 的名字不总是一 模一样的，例如：

  ```html
  <div class="foo"></div>
  ```

  class="foo" 对应的 DOM Properties 则是 el.className。

- 不是所有 HTML Attributes 都有与之对应的 DOM Properties，例如：

  ```html
  <div aria-valuenow="75"></div>
  ```

  aria-* 类的 HTML Attributes 就没有与之对应的 DOM Properties。

- 也不是所有 DOM Properties 都有与之对应的 HTML Attributes，例如可以用 el.textContent 来设置元素的文本内容， 但并没有与之对应的 HTML Attributes 来完成同样的工作。

- HTML Attributes 的值与 DOM Properties 的值之间是有关联的，如：

  ```html
   <div id="foo"></div>
  ```

  其中的id属性就和DOM properties中的es.id是一一对应的且值也是一致的。把这 种 HTML Attributes 与 DOM Properties 具有相同名称（即 id）的属性 看作直接映射。

- 并不是所有 HTML Attributes 与 DOM Properties 之间 都是直接映射的关系

  ```html
  <input value="foo" />
  ```

  如果用户没有修改文 本框的内容，那么通过 el.value 读取对应的 DOM Properties 的值就 是字符串 'foo'。而如果用户修改了文本框的值，那么 el.value 的 值就是当前文本框的值。

  但如果运行下面的代码，会发生“奇怪”的现象：

  ```js
  console.log(el.getAttribute('value')) // 仍然是 'foo'
  console.log(el.value) // 'bar'
  ```

  用户对文本框内容的修改并不会影响 el.getAttribute('value') 的返回值，这个现象蕴含着 HTML Attributes 所代表的意义。实际上，HTML Attributes 的作用是设置与之 对应的 DOM Properties 的初始值。一旦值改变，那么 DOM Properties始终存储着当前值，而通过 getAttribute 函数得到的仍然是初始值。

  但仍然可以通过 el.defaultValue 来访问初始值，如下面的代码所示：

  ```js
  el.getAttribute('value') // 仍然是 'foo'
  el.value // 'bar'
  el.defaultValue // 'foo'
  ```

  说明一个 HTML Attributes 可能关联多个 DOM Properties。例如 在上例中，value="foo" 与 el.value 和 el.defaultValue 都有关联。

  可以认为 HTML Attributes 是用来设置与之对应的 DOM Properties 的初始值的，但有些值是受限制的，就好像浏览器内部做了 默认值校验。如果你通过 HTML Attributes 提供的默认值不合法，那么 浏览器会使用内建的合法值作为对应 DOM Properties 的默认值。

  ```html
  <input type="foo" />
  ```

  为 标签的 type 属性指定字符串 'foo' 是不合法的，因此浏览器会矫正这个不合法的值。所以当尝试读取 el.type 时，得到的其实是矫正后的值，即字符串 'text'，而非字 符串 'foo'。

  

  **HTML Attributes 的作用是设置与之对应的 DOM Pr operties 的初始值。**



### 设置元素属性

对于普通的 HTML 文件来说，当浏览器解析 HTML 代码后， 会自动分析 HTML Attributes 并设置合适的 DOM Properties。但用户编 写在 Vue.js 的单文件组件中的模板不会被浏览器解析，这意味着，原 本需要浏览器来完成的工作，现在需要框架来完成。

按钮的禁用功能：

```html
<button disabled>Button</button>
```

浏览器在解析这段 HTML 代码时，发现这个按钮存在一个叫作 disabled 的 HTML Attributes，于是浏览器会将该按钮设置为禁用状 态，并将它的 el.disabled 这个 DOM Properties 的值设置为 true，这一切都是浏览器帮我们处理好的。但同样的代码如果出现在 Vue.js 的模板中，则情况会有所不同。首先，这个 HTML 模板会被编 译成 vnode，它等价于：

```js
const button = {
    type: 'button',
    props: {
        disabled: ''
    }
}
```

如果在渲染 器中调用 setAttribute 函数设置属性，则相当于：

```js
el.setAttribute('disabled', '')
```

上述代码可行，浏览器会将按钮禁用。但是下面的代码：

```html
<button :disabled="false">Button</button>
```

```js
const button = {
    type: 'button',
    props: {
        disabled: false
    }
}
```

用户的本意是“不禁用”按钮，但如果渲染器仍然使用 setAttribute 函数设置属性值，则会产生意外的效果，即按钮被禁用了。

```js
el.setAttribute('disabled', false)
```

这是因为使用 setAttribute 函数设置的值总是会被字符串化。

对于按钮来说，它的 el.disabled 属性值是布尔类型的，并且它不关心具体的 HTML Attributes 的值是什么，只要 disabled 属性存 在，按钮就会被禁用。

所以，渲染器不应该总是使用 setAttribute 函数将 vnode.props 对象中的属性设置到元素上。

一个思路就是优先设置DOM Properties。

但是又有新问题了：

```html
<button disabled>Button</button>
```

```js
const button = {
    type: 'button',
    props: {
        disabled: ''
    }
}
```

如果直接用它设置元素的 DOM Properties，那么相当于：

```js
el.disabled = ''
```

由于 el.disabled 是布尔类型的值，所以当我们尝试将它设置 为空字符串时，浏览器会将它的值矫正为布尔类型的值，即 false。 所以上面这句代码的执行结果等价于：

```js
el.disabled = false
```

这违背了用户的本意，因为用户希望禁用按钮，而 el.disabled = false 则是不禁用的意思。

无论是使用 setAttribute 函数，还是直接设置元素 的 DOM Properties，都存在缺陷。要彻底解决这个问题，只能做特殊处理，即**优先设置元素的 DOM Properties，但当值为空字符串 时，要手动将值矫正为 true。**只有这样，才能保证代码的行为符合预期。

因为有一些 DOM Properties 是只读的，只能够通过 setAttribute 函数来设 置它。

下面的 mountElement 函数给出了具体的实现：

```js

function shouldSetAsProps(el, key, value) {
    // 特殊处理
    if (key === 'form' && el.tagName === 'INPUT') return false
    // 兜底
    return key in el
}

function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    // 省略 children 的处理

    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]
            // 使用 shouldSetAsProps 函数判断是否应该作为 DOM Properties设置
            if (shouldSetAsProps(el, key, value)) {
                const type = typeof el[key]
                if (type === 'boolean' && value === '') {
                    el[key] = true
                } else {
                    el[key] = value
                }
            } else {
                el.setAttribute(key, value)
            }
        }
    }

    insert(el, container)
}

```

最后，对属性设置逻辑进行抽离：

```js
const renderer = createRenderer({
    createElement(tag) {
        return document.createElement(tag)
    },
    setElementText(el, text) {
        el.textContent = text
    },
    insert(el, parent, anchor = null) {
        parent.insertBefore(el, anchor)
    },
    // 将属性设置相关操作封装到 patchProps 函数中，并作为渲染器选项传递
    patchProps(el, key, prevValue, nextValue) {
        if (shouldSetAsProps(el, key, nextValue)) {
            const type = typeof el[key]
            if (type === 'boolean' && nextValue === '') {
                el[key] = true
            } else {
                el[key] = nextValue
            }
        } else {
            el.setAttribute(key, nextValue)
        }
    }
})


function mountElement(vnode, container) {
    const el = createElement(vnode.type)
    if (typeof vnode.children === 'string') {
        setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
            patch(null, child, el)
        })
    }

    if (vnode.props) {
        for (const key in vnode.props) {
            // 调用 patchProps 函数即可
            patchProps(el, key, null, vnode.props[key])
        }
    }

    insert(el, container)
}
```



### 设置class属性

为什么需要对 class 属性进行特殊处理呢？ 这是因为 Vue.js 对 calss 属性做了增强。在 Vue.js 中为元素设置类名有以下几种方式：

1. 指定 class 为一个字符串值。

   ```html
   <p class="foo bar"></p>
   ```

2. 指定 class 为一个对象值。

   ```vue
   const cls = { foo: true, bar: false }
   <p :class="cls"></p>
   ```

3. class 是包含上述两种类型的数组。

   ```vue
   <p :class="arr"></p>
   
   const arr = [
       // 字符串
       'foo bar',
       // 对象
       {
       baz: true
       }
   ]
   
   // 对应的vnode
   const vnode = {
     type: 'p',
     props: {
       class: ['foo bar', { baz: true }]
     }
   };
   
   ```

因为 class 的值可以是多种类型，所以必须在设置元素的 class 之前将值归一化为统一的字符串形式，再把该字符串作为元素的 class 值去设置。因此，需要封装 normalizeClass 函数，用它来将不同类型的 class 值正常化为字符串。

假设现在已经能够对 class 值进行正常化了。

接下来，如何将正常化后的 class 值设置到元素上。其实，目前实现的渲染器已经能够完成 class 的渲染了。由于 class 属性对应的 DOM Properties 是 el.className，所以表 达式 'class' in el 的值将会是 false，因此，patchProps 函数会使用 setAttribute 函数来完成 class 的设置。但是在浏览器中为一个元素设置 class 有三种方式，即使用 setAttribute、el.className 或 el.classList。那么哪一种 方法的性能更好呢？下图对比了这三种方式为元素设置 1000 次 class 的性能。

![image-20240107182500597](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240107182500597.png)

el.className 的性能最优。因此，需要调整 patchProps 函数的实现，如下面的代码所示：

```js
const renderer = createRenderer({
    // 省略其他选项

    patchProps(el, key, prevValue, nextValue) {
        // 对 class 进行特殊处理
        if (key === 'class') {
            el.className = nextValue || ''
        } else if (shouldSetAsProps(el, key, nextValue)) {
            const type = typeof el[key]
            if (type === 'boolean' && nextValue === '') {
                el[key] = true
            } else {
                el[key] = nextValue
            }
        } else {
            el.setAttribute(key, nextValue)
        }
    }
})
```

使用 el.className 代替 setAttribute 函数。其实除了 class 属 性之外，Vue.js 对 style 属性也做了增强，所以也需要对 style 做类似的处理。

通过对 class 的处理，能够意识到，vnode.props 对象中定义的属性值的类型并不总是与 DOM 元素属性的数据结构保持一致， 这取决于上层 API 的设计。Vue.js 允许对象类型的值作为 class 是**为了方便开发者**，在底层的实现上，必然需要对值进行正常化后再使用。另外，正常化值的过程是有代价的，如果需要进行大量的正常化操作，则会消耗更多性能。



### 卸载

卸载操作发生在更新阶段，更新指的是，在初次挂载完成之后，后续渲 染会触发更新，如下面的代码所示：

```js
// 初次挂载
renderer.render(vnode, document.querySelector('#app'))
// 再次挂载新 vnode，将触发更新
renderer.render(newVNode, document.querySelector('#app'))
```

更新的几种情况：

1. 后续调用 render 函数渲 染空内容（即 null）

   ```js
   // 初次挂载
   renderer.render(vnode, document.querySelector('#app'))
   // 再次挂载新 vnode，将触发更新
   renderer.render(null, document.querySelector('#app'))
   ```

   卸载时需要考虑的内容：

   1. 容器的内容可能是由某个或多个组件渲染的，当卸载操作发生 时，应该正确地调用这些组件的 beforeUnmount、unmounted 等生命周期函数。 
   2. 即使内容不是由组件渲染的，有的元素存在自定义指令，我们应 该在卸载操作发生时正确执行对应的指令钩子函数。 
   3. **使用 innerHTML 清空容器元素内容的另一个缺陷是，它不会移除绑定在 DOM 元素上的事件处理函数。**

不能简单地使用 innerHTML 来完成卸载操作。正确的卸载方式是，根据 vnode 对象获取与其相关联的真实 DOM 元素，然后使用原生 DOM 操作方法将该 DOM 元素移除。为此，**需要在 vnode 与真实 DOM 元素之间建立联系**，修改 mountElement 函数，如下面的代码所示：

```js
function mountElement(vnode, container) {
  // 让 vnode.el 引用真实 DOM 元素
  const el = (vnode.el = createElement(vnode.type));
    
  if (typeof vnode.children === 'string') {
    setElementText(el, vnode.children);
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach((child) => {
      patch(null, child, el);
    });
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      patchProps(el, key, null, vnode.props[key]);
    }
  }

  insert(el, container);
}

```

当调用 createElement 函数创建真实 DOM 元素时，会把真实 DOM 元素赋值给 vnode.el 属性。在 vnode 与真实 DOM 元素之间就建立了联系，我们可以通过 vnode.el 来获取该虚拟节点对应的真实 DOM 元素。当卸载操作发生的时 候，只需要根据虚拟节点对象 vnode.el 取得真实 DOM 元素，再将 其从父元素中移除即可。

```js
function render(vnode, container) {
  if (vnode) {
    patch(container._vnode, vnode, container);
  } else {
    if (container._vnode) {
      // 根据 vnode 获取要卸载的真实 DOM 元素
      const el = container._vnode.el;
      // 获取 el 的父元素
      const parent = el.parentNode;
      // 调用 removeChild 移除元素
      if (parent) parent.removeChild(el);
    }
  }
  container._vnode = vnode;
}
```

卸载操作是比较常见且基本的操作，可以进行封装：

```js
function unmount(vnode) {
  const parent = vnode.el.parentNode;
  // 后续进行扩展
  if (parent) {
    parent.removeChild(vnode.el);
  }
}
```

- 在 unmount 函数内，有机会调用绑定在 DOM 元素上的指令 钩子函数，例如 beforeUnmount、unmounted 等。 
- 当 unmount 函数执行时，有机会检测虚拟节点 vnode 的类型。如果该虚拟节点描述的是组件，则有机会调用组件相关的生命周期函数。



### vnode的类型

当非第一次调用render函数时，需要保证新旧 vnode 所描述的内容相同。即vnode的type属性的属性值相同。在这种情况下，正确的更新操作是，先将老元素卸载，再将新元素挂载到容器中。

```js
function patch(n1, n2, container) {
  // 如果 n1 存在，则对比 n1 和 n2 的类型
  if (n1 && n1.type !== n2.type) {
    // 如果新旧 vnode 的类型不同，则直接将旧 vnode 卸载
    unmount(n1);
    n1 = null;
  }

  if (!n1) {
    mountElement(n2, container);
  } else {
    // 更新
  }
}
```

不同类型的vnode的type属性的值是不同的，不同类型的vnode需要执行的挂载或者更新的逻辑也是不同的。继续补充patch函数：

```js
function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
        unmount(n1);
        n1 = null;
    }
    // 代码运行到这里，证明 n1 和 n2 所描述的内容相同
    const { type } = n2;
    // 如果 n2.type 的值是字符串类型，则它描述的是普通标签元素
    if (typeof type === 'string') {
        if (!n1) {
            mountElement(n2, container);
        } else {
            patchElement(n1, n2);
        }
    } else if (typeof type === 'object') {
        // 如果 n2.type 的值的类型是对象，则它描述的是组件
    } else if (type === 'xxx') {
        // 处理其他类型的 vnode
    }
}
```



### 事件处理

如何处理事件，包括如何在虚拟节点中描述事件，如何把事件添加到 DOM 元素上，以及如何更新事件。



在虚拟DOM中描述事件：事件可以视作一种特殊的属性，可以约定，在 vnode.props 对象中，凡是以字符串 on 开头的属性都视作事件。

虽然在vue的单文件组件的template中使用的是@click这种格式，但是在被编译器编译后，就会编程onClick这种格式了。

```js
const vnode = {
  type: 'p',
  props: {
    // 使用 onXxx 描述事件
    onClick: () => {
      alert('clicked');
    }
  },
  children: 'text'
};
```



如何将事件添加到 DOM 元素上：只需要在 patchProps 中调 用 addEventListener 函数来绑定事件即可。

```js
patchProps(el, key, prevValue, nextValue) {
    // 匹配以 on 开头的属性，视其为事件
    if (/^on/.test(key)) {
        // 根据属性名称得到对应的事件名称，例如 onClick ---> click
        const name = key.slice(2).toLowerCase()
        // 绑定事件，nextValue 为事件处理函数
        el.addEventListener(name, nextValue)
    } else if (key === 'class') {
        // 省略部分代码
    } else if (shouldSetAsProps(el, key, nextValue)) {
        // 省略部分代码
    } else {
        // 省略部分代码
    }
}
```



如何处理更新事件?

一般的思路，需要先移除之前添加的事件处理函数，然后再将新的事件处理函数绑定到 DOM 元素上，如下面的代码所示：

```js
patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
        const name = key.slice(2).toLowerCase()
        // 移除上一次绑定的事件处理函数
        prevValue && el.removeEventListener(name, prevValue)
        // 绑定新的事件处理函数
        el.addEventListener(name, nextValue)
    } else if (key === 'class') {
        // 省略部分代码
    } else if (shouldSetAsProps(el, key, nextValue)) {
        // 省略部分代码
    } else {
        // 省略部分代码
    }
}

```

这样做能达到目的，但是还有一种性能更优的方法，**在绑定事件时，可以绑定一个伪造的事件处理函数 invoker，然后把真正的事件处理函数设置为 invoker.value 属性的值。这样当更新事件的时候，将不再需要调用 removeEventListener 函数来移除上一次绑定的事件，只需要更新 invoker.value 的值即可**，如下面的代码所示：

```js
patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
        // 获取为该元素伪造的事件处理函数 invoker
        let invoker = el._vei
        const name = key.slice(2).toLowerCase()
        if (nextValue) {
            if (!invoker) {
                // 如果没有 invoker，则将一个伪造的 invoker 缓存到 el._vei 中
                // vei 是 vue event invoker 的首字母缩写
                invoker = el._vei = (e) => {
                    // 当伪造的事件处理函数执行时，会执行真正的事件处理函数
                    invoker.value(e)
                }
                // 将真正的事件处理函数赋值给 invoker.value
                invoker.value = nextValue
                // 绑定 invoker 作为事件处理函数
                el.addEventListener(name, invoker)
            } else {
                // 如果 invoker 存在，意味着更新，并且只需要更新 invoker.value的值即可
                invoker.value = nextValue
            }
        } else if (invoker) {
            // 新的事件绑定函数不存在，且之前绑定的 invoker 存在，则移除绑定
            el.removeEventListener(name, invoker)
        }
    } else if (key === 'class') {
        // 省略部分代码
    } else if (shouldSetAsProps(el, key, nextValue)) {
        // 省略部分代码
    } else {
        // 省略部分代码
    }
}
```

事件绑定主要分为两个步骤。 

- 先从` el._vei `中读取对应的 invoker，如果 invoker 不存在， 则将伪造的 invoker 作为事件处理函数，并将它缓存到` el._vei `属性中。 
- 把真正的事件处理函数赋值给 invoker.value 属性，然后把伪 造的 invoker 函数作为事件处理函数绑定到元素上。可以看到， 当事件触发时，实际上执行的是伪造的事件处理函数，在其内部间接执行了真正的事件处理函数 invoker.value(e)。

当更新事件时，由于` el._vei `已经存在了，所以我们只需要将 invoker.value 的值修改为新的事件处理函数即可。这样，在更新 事件时可以避免一次 removeEventListener 函数的调用，从而提 升了性能。

伪造的事件处理函数的作用不止于此，它还能解 决事件冒泡与事件更新之间相互影响的问题。

**上面的代码中，在同一时刻只能缓存一个事件处理函数。**

这意味着，如果一个元素同时绑定了多种事件，将会出现事件覆盖的 现象。例如同时给元素绑定 click 和 contextmenu 事件：

```js
const vnode = {
  type: 'p',
  props: {
    onClick: () => {
      alert('clicked');
    },
    onContextmenu: () => {
      alert('contextmenu');
    }
  },
  children: 'text'
};
renderer.render(vnode, document.querySelector('#app'));

```

当渲染器尝试渲染这上面代码中给出的 vnode 时，会先绑定 click 事件，然后再绑定 contextmenu 事件。后绑定的 contextmenu 事件的处理函数将覆盖先绑定的 click 事件的处理函 数。为了解决事件覆盖的问题，我们需要重新设计 `el._vei `的数据结 构。我们应该将 `el._vei `设计为一个对象，它的键是事件名称，它的值则是对应的事件处理函数，这样就不会发生事件覆盖的现象了，如下面的代码所示：

```js
patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
        // 定义 el._vei 为一个对象，存在事件名称到事件处理函数的映射
        const invokers = el._vei || (el._vei = {})
        //根据事件名称获取 invoker
        let invoker = invokers[key]
        const name = key.slice(2).toLowerCase()
        if (nextValue) {
            if (!invoker) {
                // 将事件处理函数缓存到 el._vei[key] 下，避免覆盖
                invoker = el._vei[key] = (e) => {
                    invoker.value(e)
                }
                invoker.value = nextValue
                el.addEventListener(name, invoker)
            } else {
                invoker.value = nextValue
            }
        } else if (invoker) {
            el.removeEventListener(name, invoker)
        }
    } else if (key === 'class') {
        // 省略部分代码
    } else if (shouldSetAsProps(el, key, nextValue)) {
        // 省略部分代码
    } else {
        // 省略部分代码
    }
}

```

另外，一个元素不仅可以绑定多种类型的事件，对于同一类型的事件而言，还可以绑定多个事件处理函数。在原生 DOM 编程中，当多次调用 addEventListener 函数为元素绑定同一类型的事件时，多个事件处理函数可以共存。

为了描述同一个事件的多个事件处理函数，需要调整 vnode.props 对象中事件的数据结构，如下面的代码所示：

```js
const vnode = {
  type: 'p',
  props: {
    onClick: [
      // 第一个事件处理函数
      () => {
        alert('clicked 1');
      },
      // 第二个事件处理函数
      () => {
        alert('clicked 2');
      }
    ]
  },
  children: 'text'
};
renderer.render(vnode, document.querySelector('#app'));

```

patchProps 函数中事件处理相关的代码：

```js
patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
        const invokers = el._vei || (el._vei = {})
        let invoker = invokers[key]
        const name = key.slice(2).toLowerCase()
        if (nextValue) {
            if (!invoker) {
                invoker = el._vei[key] = (e) => {
                    // 如果 invoker.value 是数组，则遍历它并逐个调用事件处理函数
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(e))
                    } else {
                        // 否则直接作为函数调用
                        invoker.value(e)
                    }
                }
                invoker.value = nextValue
                el.addEventListener(name, invoker)
            } else {
                invoker.value = nextValue
            }
        } else if (invoker) {
            el.removeEventListener(name, invoker)
        }
    } else if (key === 'class') {
        // 省略部分代码
    } else if (shouldSetAsProps(el, key, nextValue)) {
        // 省略部分代码
    } else {
        // 省略部分代码
    }
}
```



### 事件冒泡和更新时机

事件冒泡与更新时机相结合所导致的问题。问题示例：

```js
const { effect, ref } = VueReactivity;

const bol = ref(false);

effect(() => {
    // 创建 vnode
    const vnode = {
        type: 'div',
        props: bol.value
        ? {
            onClick: () => {
                alert('父元素 clicked');
            }
        }
        : {},
        children: [
            {
                type: 'p',
                props: {
                    onClick: () => {
                        bol.value = true;
                    }
                },
                children: 'text'
            }
        ]
    };
    // 渲染 vnode
    renderer.render(vnode, document.querySelector('#app'));
});

```

问题：在首次渲染完成之后，由于 bol.value 的值 为 false，所以渲染器并不会为 div 元素绑定点击事件。当用鼠标点 击 p 元素时，即使 click 事件可以从 p 元素冒泡到父级 div 元素， 但由于 div 元素没有绑定 click 事件的事件处理函数，所以什么都不 会发生。但事实是，当尝试运行上面这段代码并点击 p 元素时，会发现父级 div 元素的 click 事件的事件处理函数竟然执行了。

原因分析：与更新机制有关。

当点击 p 元素时，绑定到它身上的 click 事件处理函数会执行， 于是 bol.value 的值被改为 true。接下来的一步非常关键，由于 bol 是一个响应式数据，所以当它的值发生变化时，会同步触发副作用函数重新执行。由于此时的 bol.value 已经变成了 true，所以在更新阶段，渲染器会为父级 div 元素绑定 click 事件处理函数。当更新完 成之后，点击事件才从 p 元素冒泡到父级 div 元素。由于此时 div 元 素已经绑定了 click 事件的处理函数，因此就发生了上述奇怪的现象。

**因为更新操作发生在事件冒泡之前，即为 div 元素绑定事件处理函数发生在事件冒泡到div上之前。**

一个很自然的想法是， 能否将绑定事件的动作挪到事件冒泡之后？但这个想法不可靠，因为无法知道事件冒泡是否完成，以及完成到什么程度。Vue.js 的更新难道不是在一个异步的微任务队列中进行的吗？那是 不是自然能够避免这个问题了呢？其实不然，换句话说，微任务会穿 插在由事件冒泡触发的多个事件处理函数之间被执行。因此，即使把 绑定事件的动作放到微任务中，也无法避免这个问题。

解决思路：触发事件的时间与绑定事件的时间之间是有联系的。

![image-20240108091316365](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240108091316365.png)

事件触发的时间要早于事件处理函数被绑定的 时间。这意味着当一个事件触发时，目标元素上还没有绑定相关的事件处理函数，我们可以根据这个特点来解决问题：**屏蔽所有绑定时间晚于事件触发时间的事件处理函数的执行**。

patchProps：

```js
patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
        const invokers = el._vei || (el._vei = {}) // 各种事件的映射表
        let invoker = invokers[key] // 具体某种事件的映射表
        const name = key.slice(2).toLowerCase()  // 事件名
        if (nextValue) {
            if (!invoker) {
                invoker = el._vei[key] = (e) => {
                    // e.timeStamp 是事件发生的时间
                    // 如果事件发生的时间早于事件处理函数绑定的时间，则不执行事件处理函数
                    if (e.timeStamp < invoker.attached) return
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(e))
                    } else {
                        invoker.value(e)
                    }
                }
                invoker.value = nextValue
                // 添加 invoker.attached 属性，存储事件处理函数被绑定的时间
                invoker.attached = performance.now()
                el.addEventListener(name, invoker)
            } else {
                invoker.value = nextValue
            }
        } else if (invoker) {
            el.removeEventListener(name, invoker)
        }
    } else if (key === 'class') {
        // 省略部分代码
    } else if (shouldSetAsProps(el, key, nextValue)) {
        // 省略部分代码
    } else {
        // 省略部分代码
    }
}
```

为伪造的事件处理函数添加了 invoker.attached 属性， 用来存储事件处理函数被绑定的时间。然后，在 invoker 执行的时 候，通过事件对象的 e.timeStamp 获取事件发生的时间。最后，比 较两者，如果事件处理函数被绑定的时间晚于事件发生的时间，则不 执行该事件处理函数。



### 更新子节点

元素子节点的情况：

1. 没有子节点
2. 有文本子节点
3. 单个元素子节点或者多个子节点作为元素组成的数组

```js
// 没有子节点
vnode = {
  type: 'div',
  children: null
};

// 文本子节点
vnode = {
  type: 'div',
  children: 'Some Text'
};

// 其他情况，子节点使用数组表示
vnode = {
  type: 'div',
  children: [{ type: 'p' }, 'Some Text']
};

```

当渲染器执行更新时，新旧子节点都分别是三种情况之一。所以，可以总结出更新子节点时全部九种可能：

![image-20240108100028438](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20240108100028438.png)

patchElement 函数的代码所示：

```js
function patchElement(n1, n2) {
    const el = (n2.el = n1.el);  // n2和n1都是父vnode
    const oldProps = n1.props;
    const newProps = n2.props;
    // 第一步：更新父vnode的props
    for (const key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            patchProps(el, key, oldProps[key], newProps[key]);
        }
    }

    // 如果老props中有但是新props中没有，则直接删除
    for (const key in oldProps) {
        if (!(key in newProps)) {
            patchProps(el, key, oldProps[key], null);
        }
    }

    // 第二步：更新 children
    patchChildren(n1, n2, el);
}


function patchChildren(n1, n2, container) {
    // 判断新子节点的类型是否是文本节点
    if (typeof n2.children === 'string') {
        // 旧子节点的类型有三种可能：没有子节点、文本子节点以及一组子节点
        // 只有当旧子节点为一组子节点时，才需要逐个卸载，其他情况下什么都不需要做
        if (Array.isArray(n1.children)) {
            n1.children.forEach((c) => unmount(c));
        }
        // 最后将新的文本节点内容设置给容器元素
        setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
        // 说明新子节点是一组子节点

        // 判断旧子节点是否也是一组子节点
        if (Array.isArray(n1.children)) {
            // 代码运行到这里，则说明新旧子节点都是一组子节点，这里涉及核心的Diff 算法
        } else {
            // 此时：
            // 旧子节点要么是文本子节点，要么不存在
            // 但无论哪种情况，我们都只需要将容器清空，然后将新的一组子节点逐个挂载
            setElementText(container, '')
            n2.children.forEach(c => patch(null, c, container))
        }
    } else {
        // 代码运行到这里，说明新子节点不存在
        // 旧子节点是一组子节点，只需逐个卸载即可
        if (Array.isArray(n1.children)) {
            n1.children.forEach(c => unmount(c))
        } else if (typeof n1.children === 'string') {
            // 旧子节点是文本子节点，清空内容即可
            setElementText(container, '')
        }
        // 如果也没有旧子节点，那么什么都不需要做
    }
}

```



### 文本和注释节点

用虚拟DOM描述文本节点和注释节点。注释节点与文本节点不同于普通标签节点，它们不具有标签名称，所以需要人为创造一些唯一的标识， 并将其作为注释节点和文本节点的 type 属性值。用 vnode.children 来存储它们对应的文本内容。

```js
// 文本节点的 type 标识
const Text = Symbol()
const newVNode = {
    // 描述文本节点
    type: Text,
    children: '我是文本内容'
}

// 注释节点的 type 标识
const Comment = Symbol()
const newVNode = {
    // 描述注释节点
    type: Comment,
    children: '我是注释内容'
}

```



```js
function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
        unmount(n1)
        n1 = null
    }

    const { type } = n2

    if (typeof type === 'string') {
        if (!n1) {
            mountElement(n2, container)
        } else {
            patchElement(n1, n2)
        }
    } else if (type === Text) { // 如果新 vnode 的类型是 Text，则说明该 vnode 描述的是文本节点
        // 如果没有旧节点，则进行挂载
        if (!n1) {
            // 使用 createTextNode 创建文本节点
            const el = n2.el = document.createTextNode(n2.children)
            // 将文本节点插入到容器中
            insert(el, container)
        } else {
            // 如果旧 vnode 存在，只需要使用新文本节点的文本内容更新旧文本节点即可
            const el = n2.el = n1.el
            if (n2.children !== n1.children) {
                el.nodeValue = n2.children
            }
        }
    }
}
```

createTextNode 和 el.nodeValue。为了保证渲染器核心的跨平台能力，需要将这两个操作 DOM 的 API 封 装到渲染器的选项中。

使用 document.createComment 函数创建注释节点元素。



### Fragment

Fragment（片断）是 Vue.js 3 中新增的一个 vnode 类型。

为什么需要 Fragment? 在 Vue.js 2 中，组件的模板不允许存在多个根节点。Vue.js 3 支持多根节点模板，所以不存在上述问题。那么， Vue.js 3 是如何用 vnode 来描述多根节点模板的？使用 Fragment。

```js
const Fragment = Symbol();
const vnode = {
  type: Fragment,
  children: [
    { type: 'li', children: 'text 1' },
    { type: 'li', children: 'text 2' },
    { type: 'li', children: 'text 3' }
  ]
};

```

对于 Fragment 类 型的 vnode 的来说，它的 children 存储的内容就是模板中所有根节 点。

有了 Fragment 后，就可以用它来描述 Items.vue 组件的模板了：

```vue
<!-- Items.vue -->
<template>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</template>
```

这段模板对应的虚拟节点是：

```js
const vnode = {
    type: Fragment,
    children: [
        { type: 'li', children: '1' },
        { type: 'li', children: '2' },
        { type: 'li', children: '3' }
    ]
}

```



```vue
<List>
  <Items />
</List>
```

```js
const vnode = {
    type: 'ul',
    children: [
        {
            type: Fragment,
            children: [
                { type: 'li', children: '1' },
                { type: 'li', children: '2' },
                { type: 'li', children: '3' }
            ]
        }
    ]
}
```

当渲染器渲染 Fragment 类型的虚拟节点时，由于 Fragment 本 身并不会渲染任何内容，所以渲染器只会渲染 Fragment 的子节点， 如下面的代码所示：

```js
function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
        unmount(n1)
        n1 = null
    }

    const { type } = n2

    if (typeof type === 'string') {
        // 省略部分代码
    } else if (type === Text) {
        // 省略部分代码
    } else if (type === Fragment) { // 处理 Fragment 类型的 vnode
        if (!n1) {
            // 如果旧 vnode 不存在，则只需要将 Fragment 的 children 逐个挂载即可
            n2.children.forEach(c => patch(null, c, container))
        } else {
            // 如果旧 vnode 存在，则只需要更新 Fragment 的 children 即可
            patchChildren(n1, n2, container)
        }
    }
}
```

渲染 Fragment 的逻辑比想象中要简单得多，因 为从本质上来说，渲染 Fragment 与渲染普通元素的区别在于， Fragment 本身并不渲染任何内容，所以只需要处理它的子节点即 可。

unmount 函数也需要支持 Fragment 类型 的虚拟节点的卸载，如下面 unmount 函数的代码所示：

```js
function unmount(vnode) {
    // 在卸载时，如果卸载的 vnode 类型为 Fragment，则需要卸载其 children
    if (vnode.type === Fragment) {
        vnode.children.forEach(c => unmount(c))
        return
    }
    const parent = vnode.el.parentNode
    if (parent) {
        parent.removeChild(vnode.el)
    }
}
```

当卸载 Fragment 类型的虚拟节点时，由于 Fragment 本身并不 会渲染任何真实 DOM，所以只需要遍历它的 children 数组，并将其 中的节点逐个卸载即可。



## Diff算法

当 新旧 vnode 的子节点都是一组节点时，为了以最小的性能开销完成更 新操作，需要比较两组子节点，用于比较的算法就叫作 Diff 算法。



## 组件实现

### 组件本质

组件本质就是一个函数或者一个js对象。

```js
const Mycomponent = { 
	name:'mycomponent',
    data(){
        return { foo:1 }
    }
}
```

**同时一个组件在vue源码中，其实都对应一种虚拟DOM节点类型。**为了使用虚拟DOM来描述一个节点是组件节点，源码中将vnode的type属性的值用来存储组件对应的选项对象了。

```js
// 该 vnode 用来描述组件，type 属性存储组件的选项对象
const vnode = {
  type: MyComponent  // 就是上面的对象
  // ...
};
```



### 组件实现

patch函数中针对组件节点的处理逻辑：

```js
function patch(n1, n2, container, anchor) {
  if (n1 && n1.type !== n2.type) {
    unmount(n1);
    n1 = null;
  }

  const { type } = n2;

  if (typeof type === 'string') {
    // 作为普通元素处理
  } else if (type === Text) {
    // 作为文本节点处理
  } else if (type === Fragment) {
    // 作为片段处理
  } else if (typeof type === 'object') {
    // vnode.type 的值是选项对象，作为组件来处理
    if (!n1) {
      // 挂载组件
      mountComponent(n2, container, anchor);
    } else {
      // 更新组件
      patchComponent(n1, n2, anchor);
    }
  }
}

```



用户如何编写组件？组件的选项对象必须包含哪些内容？组件应该拥有哪些能力？

一个组件的选项对象必须包含：render函数，render函数返回一个虚拟DOM。

```js
const MyComponent = {
  name: 'MyComponent',
  // 组件的渲染函数，其返回值必须为虚拟 DOM
  render() {
    // 返回虚拟 DOM
    return {
      type: 'div',
      children: `我是文本内容`
    };
  }
};

// 用来描述组件的 VNode 对象，type 属性值为组件的选项对象
const CompVNode = {
  type: MyComponent
};
// 调用渲染器来渲染组件
renderer.render(CompVNode, document.querySelector('#app'));
```

组件挂载函数mountComponent实现：

```js
function mountComponent(vnode, container, anchor) {
    // 通过 vnode 获取组件的选项对象，即 vnode.type  获取组件的渲染函数 render
    const { render }  = vnode.type
    // 执行渲染函数，获取组件要渲染的内容，即 render 函数返回的虚拟 DOM
    const subTree = render()
    // 最后调用 patch 函数来挂载组件所描述的内容，即 subTree
    patch(null, subTree, container, anchor)
}
```

以上就是组件的最基本实现方案。



### 组件状态和自更新

组件自身的状态和自身的响应式状态发生变化时组件的自更新。

```js
const MyComponent = {
    name: 'MyComponent',
    // 用 data 函数来定义组件自身的状态
    data() {
        return {
            foo: 'hello world'
        };
    },
    render() {
        return {
            type: 'div',
            children: `foo 的值是: ${this.foo}` // 在渲染函数内使用组件状态
        };
    }
};
```

使用 data 函数来定义组 件自身的状态，同时可以在渲染函数中通过 this 访问由 data 函数返回的状态数据。

```js
function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type
    const { render, data } = componentOptions

    // 调用 data 函数得到原始数据，并调用 reactive 函数将其包装为响应式数据
    const state = reactive(data())
    // 调用 render 函数时，将其 this 设置为 state，
    // 从而 render 函数内部可以通过 this 访问组件自身状态数据
    const subTree = render.call(state, state)
    patch(null, subTree, container, anchor)
}
```

当组件自身状态发生变化时，需要有能力触发组件更新，即组件的自更新。为此，需要将整个渲染任务包装到一个 effect 中，如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type
    const { render, data } = componentOptions

    const state = reactive(data())

    // 将组件的 render 函数调用包装到 effect 内
    effect(() => {
        const subTree = render.call(state, state)
        patch(null, subTree, container, anchor)
    })
}
```



### 组件的异步更新

由于 effect 的执行是同步的，因此当响应式数据发生变化时，与之关联的副作用函数会同步执行。换句话说，**如果多次修改响应式数据的值，将会导致渲染函数执行多次，这实际上是没有必要的。**因此，Vue3中设计了一个机制，以 使得无论对响应式数据进行多少次修改，副作用函数都只会重新执行一次。为此，实现了一个调度器，当副作用函数需要重新执行时，不会立即执行它，而是将它缓冲到一个微任务队列中，等到执行栈清空后，再将它从微任务队列中取出并执行。有了缓存机制，就有机会对任务进行去重，从而避免多次执行副作用函数带来的性能开销。

```js
// 任务缓存队列，可以自动对任务进行去重
const queue = new Set();
// 一个标志，代表是否正在刷新任务队列
let isFlushing = false;
// 创建一个立即 resolve 的 Promise 实例
const p = Promise.resolve();

// 调度器的主要函数，用来将一个任务添加到缓冲队列中，并开始刷新队列
function queueJob(job) {
  // 将 job 添加到任务队列 queue 中
  queue.add(job);
  // 如果还没有开始刷新队列，则刷新之
  if (!isFlushing) {
    // 将该标志设置为 true 以避免重复刷新
    isFlushing = true;
    // 在微任务中刷新缓冲队列
    p.then(() => {
      try {
        // 执行任务队列中的任务
        queue.forEach((job) => job());
      } finally {
        // 重置状态
        isFlushing = false;
        queue.clear = 0;
      }
    });
  }
}
```

本质上利用了微任务的异步执行机制，实现对副作用函数的缓冲。

在创建渲染副作用时使用它，如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
  const componentOptions = vnode.type;
  const { render, data } = componentOptions;

  const state = reactive(data());

  effect(
    () => {
      const subTree = render.call(state, state);
      patch(null, subTree, container, anchor);
    },
    {
      // 指定该副作用函数的调度器为 queueJob 即可
      scheduler: queueJob
    }
  );
}

```

上面这段代码存在缺陷。在 effect 函数内调用 patch 函数完成渲染时，第一个参数总是 null。这意味着， 每次更新发生时都会进行全新的挂载，而不会打补丁，这是不正确 的。正确的做法是：每次更新时，都拿新的 subTree 与上一次组件所 渲染的 subTree 进行打补丁。为此，需要实现**组件实例**，用它来维护组件整个生命周期的状态，这样渲染器才能够在正确的时机执行合适的操作。



### 组件实例

组件实例本质上就是一个对象，它维护着 件运行过程中的所有信息，例如注册到组件的生命周期函数、组件渲染的子树（subTree）、组件是否已经被挂载、组件自身的状态 （data）等。为了解决组件更新的问题，需要引入组件实例的概念，以及与之相关的状态信息，如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type;
    const { render, data } = componentOptions;

    const state = reactive(data());

    // 定义组件实例，一个组件实例本质上就是一个对象，它包含与组件有关的状态信息
    const instance = {
        // 组件自身的状态数据，即 data
        state,
        // 一个布尔值，用来表示组件是否已经被挂载，初始值为 false
        isMounted: false,
        // 组件所渲染的内容，即子树（subTree）
        subTree: null
    };

    // 将组件实例设置到 vnode 上，用于后续更新
    vnode.component = instance;

    effect(
        () => {
            // 调用组件的渲染函数，获得子树
            const subTree = render.call(state, state);
            // 检查组件是否已经被挂载
            if (!instance.isMounted) {
                // 初次挂载，调用 patch 函数第一个参数传递 null
                patch(null, subTree, container, anchor);
                // 重点：将组件实例的 isMounted 设置为 true，这样当更新发生时就不会再次进行挂载操作，
                // 而是会执行更新
                instance.isMounted = true;
            } else {
                // 当 isMounted 为 true 时，说明组件已经被挂载，只需要完成自更新即可，
                // 所以在调用 patch 函数时，第一个参数为组件上一次渲染的子树，
                // 意思是，使用新的子树与上一次渲染的子树进行打补丁操作
                patch(instance.subTree, subTree, container, anchor);
            }
            // 更新组件实例的子树
            instance.subTree = subTree;
        },
        { scheduler: queueJob }
    );
}
```

上面的代码主要涉及的就是组件自身的响应式数据发生变化后，引发组件的自更新逻辑。



### 组件生命周期函数

```js
function mountComponent(vnode, container, anchor) {
  const componentOptions = vnode.type;
  // 从组件选项对象中取得组件的生命周期函数
  const { render, data, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated } =
    componentOptions;

  // 在这里调用 beforeCreate 钩子
  beforeCreate && beforeCreate();

  const state = reactive(data());

  const instance = {
    state,
    isMounted: false,
    subTree: null
  };
  vnode.component = instance;

  // 在这里调用 created 钩子
  created && created.call(state);

  effect(
    () => {
      const subTree = render.call(state, state);
      if (!instance.isMounted) {
        // 在这里调用 beforeMount 钩子
        beforeMount && beforeMount.call(state);
        patch(null, subTree, container, anchor);
        instance.isMounted = true;
        // 在这里调用 mounted 钩子
        mounted && mounted.call(state);
      } else {
        // 在这里调用 beforeUpdate 钩子
        beforeUpdate && beforeUpdate.call(state);
        patch(instance.subTree, subTree, container, anchor);
        // 在这里调用 updated 钩子
        updated && updated.call(state);
      }
      instance.subTree = subTree;
    },
    { scheduler: queueJob }
  );
}
```

由于可能存在多个同样的组件生命周期钩子，例如来自 mixins 中的生命周期钩子函数，因此通常需要将组件生命周期钩子序列化为一个数组，但核心原理不变。



### props

组件标签在使用时，可以在标签上编写一些类似于html标签上的属性。他们也会被放到其所对应的vnode节点对象的props属性中。

```vue
<MyComponent title="A Big Title" :other="val" />
```

这段模板对应的虚拟 DOM 是：

```js
const vnode = {
  type: MyComponent,
  props: {
    title: 'A big Title',
    other: this.val
  }
};
```

在编写组件时，需要显式地指定组件会接收哪些 props 数据，如下面的代码所示：

```js
const MyComponent = {
  name: 'MyComponent',
  // 组件接收名为 title 的 props，并且该 props 的类型为 String
  props: {
    title: String
  },
  render() {
    return {
      type: 'div',
      children: `count is: ${this.title}` // 访问 props 数据
    };
  }
};
```

props有两个不同的地方存在：

- 为组件传递的 props 数据，即组件的 vnode.props 对象；
- 组件选项对象中定义的 props 选项，即 MyComponent.props（vnode.type.props） 对象。

结合这两个选项来解析出组件在渲染时需要用到的 props 数据。

```js
function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type;
    // 从组件选项对象中取出 props 定义，即 propsOption
    const { render, data, props: propsOption /* 其他省略 */ } = componentOptions;

    beforeCreate && beforeCreate();

    const state = reactive(data());
    // 调用 resolveProps 函数解析出最终的 props 数据与 attrs 数据
    const [props, attrs] = resolveProps(propsOption, vnode.props);

    const instance = {
        state,
        // 将解析出的 props 数据包装为 shallowReactive 并定义到组件实例上
        props: shallowReactive(props),
        isMounted: false,
        subTree: null
    };
    vnode.component = instance;

    // 省略部分代码
}

// resolveProps 函数用于解析组件 props 和 attrs 数据
function resolveProps(options, propsData) {
    const props = {};
    const attrs = {};
    // 遍历为组件传递的 props 数据
    for (const key in propsData) {
        if (key in options) {
            // 如果为组件传递的 props 数据在组件自身的 props 选项中有定义，则将其视为合法的 props
            props[key] = propsData[key];
        } else {
            // 否则将其作为 attrs
            attrs[key] = propsData[key];
        }
    }

    // 最后返回 props 与 attrs 数据
    return [props, attrs];
}
```

在 Vue.js 3 中，没有定义在 vnode.type.props 选项中的 props 数据将存储到 attrs 对象中。 



### 被动更新

关于 props 数据变化的问题。props 本质上是父组件的数据，当 props 发生变化时，会触发父组件重新渲染。假设父组件的模板如下：

```vue
<template>
	<MyComponent :title="title"/>
</template>
```

其中，响应式数据 title 的初始值为字符串 "A big Title"，因此首次渲染时，父组件的虚拟 DOM 为：

```js
// 父组件要渲染的内容
const vnode = {
  type: MyComponent,
  props: {
    title: 'A Big Title'
  }
};
```

当响应式数据 title 发生变化时，父组件的渲染函数会重新执行。

父组件会进行自更新。在更新过程中，渲染器发现父组件的 subTree 包含组件类型的虚拟节点，所以会调用 patchComponent 函数完成子组件的更新。

把由父组件自更新所引起的子组件更新叫作子组件的被动更新。当子组件发生被动更新时，需要做的是：

- 检测子组件是否真的需要更新，因为子组件的 props 可能是不变的；
- 如果需要更新，则更新子组件的 props、slots 等内容。

patchComponent 函数的具体实现如下：

```js
function patchComponent(n1, n2, anchor) {
  // 获取组件实例，即 n1.component，同时让新的组件虚拟节点 n2.component也指向组件实例
  // 组件的复用就是复用组件实例instance 
  const instance = (n2.component = n1.component);
  // 获取当前的 props 数据
  const { props } = instance;
  // 调用 hasPropsChanged 检测为子组件传递的 props 是否发生变化，如果没有变化，则不需要更新
  if (hasPropsChanged(n1.props, n2.props)) {
    // 调用 resolveProps 函数重新获取 props 数据
    const [nextProps] = resolveProps(n2.type.props, n2.props);
    // 更新 props
    for (const k in nextProps) {
      props[k] = nextProps[k];
    }
    // 删除不存在的 props
    for (const k in props) {
      if (!(k in nextProps)) delete props[k];
    }
  }
}

function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps);
  // 如果新旧 props 的数量变了，则说明有变化
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
    
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    // 有不相等的 props，则说明有变化
    if (nextProps[key] !== prevProps[key]) return true;
  }
  return false;
}
```

由于 props 数据与组件自身的状态数据都需要暴露到渲染函数中，并使得渲染函数能够通过 this 访问它们，因此需要封装一个渲染上下文对象，如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
  // 省略部分代码

  const instance = {
    state,
    props: shallowReactive(props),
    isMounted: false,
    subTree: null
  };

  vnode.component = instance;

  // 创建渲染上下文对象，本质上是组件实例的代理
  const renderContext = new Proxy(instance, {
    get(t, k, r) {
      // 取得组件自身状态与 props 数据
      const { state, props } = t;
      // 先尝试读取自身状态数据
      if (state && k in state) {
        return state[k];
      } else if (k in props) {
        // 如果组件自身没有该数据，则尝试从props 中读取
        return props[k];
      } else {
        console.error('不存在');
      }
    },
    set(t, k, v, r) {
      const { state, props } = t;
      if (state && k in state) {
        state[k] = v;
      } else if (k in props) {
        console.warn(`Attempting to mutate prop "${k}". Propsare readonly.`);
      } else {
        console.error('不存在');
      }
    }
  });

  // 生命周期函数调用时要绑定渲染上下文对象
  created && created.call(renderContext);

  // 省略部分代码
}
```

为组件实例创建了一个代理对象，该对 象即渲染上下文对象。它的意义在于拦截数据状态的读取和设置操作，**每当在渲染函数或生命周期钩子中通过 this 来读取数据时，都会优先从组件的自身状态中读取，如果组件本身并没有对应的数据， 则再从 props 数据中读取。**

实际上，除了组件自身的数据以及 props 数据之外，完整的组件还包含 methods、computed 等选项中定义的数据和方法，这些内容都应该在渲染上下文对象中处理。



### setup函数的作用和实现

组件的 setup 函数是 Vue.js 3 新增的**组件选项**。 setup 函数主要用于配合组合式 API，为用户提供一个地方，用于建立组合逻辑、创建响应式数据、创建通用函数、注册生命周期钩子等能力。在组件的整个生命周期中， setup 函数只会在被挂载时执行一次，它的返回值可以有两种情况。

1. 返回一个函数，该函数将作为组件的 render 函数：

   ```js
   const Comp = {
     setup() {
       // setup 函数可以返回一个函数，该函数将作为组件的渲染函数
       return () => {
         return { type: 'div', children: 'hello' };
       };
     }
   };
   ```

   常用于组件不是以模板来表达其渲染内容的情况。如果组件以模板来表达其渲染的内容，那么 setup 函数不可以再返回函 数，否则会与模板编译生成的渲染函数产生冲突。

2. 返回一个对象，该对象中包含的数据将暴露给模板使用：

   ```js
   const Comp = {
       setup() {
           const count = ref(0);
           // 返回一个对象，对象中的数据会暴露到渲染函数中
           return {
               count
           };
       },
       render() {
           // 通过 this 可以访问 setup 暴露出来的响应式数据
           return { type: 'div', children: `count is: ${this.count}` };
       }
   };
   
   ```

   setup 函数暴露的数据可以在渲染函数中通过 this 来访问。

setup 函数接收两个参数。第一个参数是 props 数据对象，第二个参数也是一个对象，通常称为 setupContext，如下面的代码所示：

```js
const Comp = {
  props: {
    foo: String
  },
  setup(props, setupContext) {
    props.foo; // 访问传入的 props 数据
    // setupContext 中包含与组件接口相关的重要数据
    const { slots, emit, attrs, expose } = setupContext;
    // ...
  }
};
```

- slots：组件接收到的插槽。
- emit：一个函数，用来发射自定义事件。
- attrs：attrs 对象。当为组件传递 props 时，那些没有显式地声明为 props 的属性会存储到 attrs 对象中。 
- expose：一个函数，用来显式地对外暴露组件数据。

通常情况下，不建议将 setup 与 Vue.js 2 中其他组件选项混合使用。

实现 setup 组件选项， 如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
  const componentOptions = vnode.type;
  // 从组件选项中取出 setup 函数
  let { render, data, setup /* 省略其他选项 */ } = componentOptions;

  const state = data ? reactive(data()) : null;
  const [props, attrs] = resolveProps(propsOption, vnode.props);

  const instance = {
    state,
    props: shallowReactive(props),
    isMounted: false,
    subTree: null
  };

  // setupContext，由于还没有讲解 emit 和 slots，所以暂时只需要attrs
  const setupContext = { attrs };
  // 调用 setup 函数，将只读版本的 props 作为第一个参数传递，避免用户意外地修改 props 的值，
  // 将 setupContext 作为第二个参数传递
  const setupResult = setup(shallowReadonly(instance.props), setupContext);
  // setupState 用来存储由 setup 返回的数据
  let setupState = null;
  // 如果 setup 函数的返回值是函数，则将其作为渲染函数
  if (typeof setupResult === 'function') {
    // 报告冲突
    if (render) console.error('setup 函数返回渲染函数，render 选项将被忽略');
    // 将 setupResult 作为渲染函数
    render = setupResult;
  } else {
    // 如果 setup 的返回值不是函数，则作为数据状态赋值给 setupState
    setupState = setupResult;
  }

  vnode.component = instance;

  const renderContext = new Proxy(instance, {
    get(t, k, r) {
      const { state, props } = t;
      if (state && k in state) {
        return state[k];
      } else if (k in props) {
        return props[k];
      } else if (setupState && k in setupState) {
        // 渲染上下文需要增加对 setupState 的支持
        return setupState[k];
      } else {
        console.error('不存在');
      }
    },
    set(t, k, v, r) {
      const { state, props } = t;
      if (state && k in state) {
        state[k] = v;
      } else if (k in props) {
        console.warn(`Attempting to mutate prop "${k}". Props are readonly.`);
      } else if (setupState && k in setupState) {
        // 渲染上下文需要增加对 setupState 的支持
        setupState[k] = v;
      } else {
        console.error('不存在');
      }
    }
  });

  // 省略部分代码
}
```



### 组件事件与 emit 的实现

emit 用来发射组件的自定义事件，如下面的代码所示：

```js
const MyComponent = {
  name: 'MyComponent',
  setup(props, { emit }) {
    // 发射 change 事件，并传递给事件处理函数两个参数
    emit('change', 1, 2);

    return () => {
      return; // ...
    };
  }
};

```

当使用该组件时，可以监听由 emit 函数发射的自定义事件：

```vue
<MyComponent @change="handler" />

const CompVNode = {
  type: MyComponent,
  props: {
    onChange: handler
  }
};
```

自定义事件 change 被编译成名为 onChange 的属 性，并存储在 props 数据对象中。

**发射自定义事件的本质就是根据事件名称去组件实例的 props 数据对象中寻找对应的事件处理函数并执行，如下面的代码所示：**

```js
function mountComponent(vnode, container, anchor) {
  // 省略部分代码

  const instance = {
    state,
    props: shallowReactive(props),
    isMounted: false,
    subTree: null
  };

  // 定义 emit 函数，它接收两个参数
  // event: 事件名称
  // payload: 传递给事件处理函数的参数
  function emit(event, ...payload) {
    // 根据约定对事件名称进行处理，例如 change --> onChange
    const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
    // 根据处理后的事件名称去 props 中寻找对应的事件处理函数
    const handler = instance.props[eventName];
    if (handler) {
      // 调用事件处理函数并传递参数
      handler(...payload);
    } else {
      console.error('事件不存在');
    }
  }

  // 将 emit 函数添加到 setupContext 中，用户可以通过 setupContext 取得 emit 函数
  const setupContext = { attrs, emit };

  // 省略部分代码
}
```

任何没有显式地声明为 props 的 属性都会存储到 attrs 中，对于事件，需要在解析 props 数据的时候对事件类型的 props 做 特殊处理，如下面的代码所示：

```js
function resolveProps(options, propsData) {
  const props = {};
  const attrs = {};
  for (const key in propsData) {
    // 以字符串 on 开头的 props，无论是否显式地声明，都将其添加到 props数据中，而不是添加到 attrs 中
    if (key in options || key.startsWith('on')) {
      props[key] = propsData[key];
    } else {
      attrs[key] = propsData[key];
    }
  }

  return [props, attrs];
}
```



### 插槽

插槽：组件会预留一些插槽，该插槽需要渲染的内容由开发者在使用组件时传递。

MyComponent 组件：

```vue
<template>
	<header><slot name="header" /></header>
	<div>
    	<slot name="body" />
    </div>
	<footer><slot name="footer" /></footer>
</template>
```

组件 MyComponent 的模板则会 被编译为如下渲染函数：

```js
// MyComponent 组件模板的编译结果
function render() {
    return [
        {
            type: 'header',
            children: [this.$slots.header()]
        },
        {
            type: 'body',
            children: [this.$slots.body()]
        },
        {
            type: 'footer',
            children: [this.$slots.footer()]
        }
    ]
}
```



使用MyComponent 组件：

```vue
<MyComponent>
    <template #header>
		<h1>我是标题</h1>
    </template>
    <template #body>
	<section>我是内容</section>
    </template>
    <template #footer>
		<p>我是注脚</p>
    </template>
</MyComponent>
```

编译结果：

```js
// 父组件的渲染函数
function render() {
  return {
    type: MyComponent,
    // 组件的 children 会被编译成一个对象
    children: {
      header() {
        return { type: 'h1', children: '我是标题' };
      },
      body() {
        return { type: 'section', children: '我是内容' };
      },
      footer() {
        return { type: 'p', children: '我是注脚' };
      }
    }
  };
}
```

渲染插槽内容的过程，就是调用插槽函数并渲染由其返回的内容的过程。

在运行时的实现上，插槽则依赖于 setupContext 中的 slots 对象，如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
    // 省略部分代码

    // 直接使用编译好的 vnode.children 对象作为 slots 对象即可
    const slots = vnode.children || {}

    // 将 slots 对象添加到 setupContext 中
    const setupContext = { attrs, emit, slots }

}
```

最基本的 slots 的实现非常简单。只需要将编译好的 vnode.children 作为 slots 对象，然后将 slots 对象添加到 setupContext 对象中。

为了在 render 函数内和生命周期钩子函数 内能够通过` this.$slots `来访问插槽内容，还需要在 renderContext 中特殊对待 `$slots `属性，如下面的代码所示：

```js
function mountComponent(vnode, container, anchor) {
    // 省略部分代码
    const slots = vnode.children || {};

    const instance = {
        state,
        props: shallowReactive(props),
        isMounted: false,
        subTree: null,
        // 将插槽添加到组件实例上
        slots
    };

    // 省略部分代码

    const renderContext = new Proxy(instance, {
        get(t, k, r) {
            const { state, props, slots } = t;
            // 当 k 的值为 $slots 时，直接返回组件实例上的 slots
            if (k === '$slots') return slots;

            // 省略部分代码
        },
        set(t, k, v, r) {
            // 省略部分代码
        }
    });

    // 省略部分代码
}
```



### 注册生命周期

Vue3中有一部分组合式 API 是用来注册生命周期钩子函数的，例如 onMounted、onUpdated 等，如下面的代码所示：

```js
import { onMounted } from 'vue';

const MyComponent = {
    setup() {
        onMounted(() => {
            console.log('mounted 1');
        });
        // 可以注册多个
        onMounted(() => {
            console.log('mounted 2');
        });

        // ...
    }
};
```

在 setup 函数中调用 onMounted 函数即可注册 mounted 生命周期钩子函数，并且可以通过多次调用 onMounted 函数来注册多个 钩子函数，这些函数会在组件被挂载之后再执行。这里的疑问在于， 在 A 组件的 setup 函数中调用 onMounted 函数会将该钩子函数注册 到 A 组件上；而在 B 组件的 setup 函数中调用 onMounted 函数会将钩子函数注册到 B 组件上，这是如何实现的呢？实际上，需要维护一个变量 **currentInstance**，**用它来存储当前组件实例，每当初始化组件并执行组件的 setup 函数之前，先将 currentInstance 设置为当前组件实例，再执行组件的 setup 函数，这样我们就可以通 过 currentInstance 来获取当前正在被初始化的组件实例，从而将 那些通过 onMounted 函数注册的钩子函数与组件实例进行关联。**

实现：

```js
// 全局变量，存储当前正在被初始化的组件实例
let currentInstance = null;
// 该方法接收组件实例作为参数，并将该实例设置为 currentInstance
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function mountComponent(vnode, container, anchor) {
    // 省略部分代码
    const slots = vnode.children || {};

    const instance = {
        state,
        props: shallowReactive(props),
        isMounted: false,
        subTree: null,
        slots,
        // 在组件实例中添加 mounted 数组，用来存储通过 onMounted 函数注册的生命周期钩子函数
        mounted: []
    };

    // 省略部分代码

    // setup
    const setupContext = { attrs, emit, slots };

    // 在调用 setup 函数之前，设置当前组件实例
    setCurrentInstance(instance);
    // 执行 setup 函数
    const setupResult = setup(shallowReadonly(instance.props), setupContext);
    // 在 setup 函数执行完毕之后，重置当前组件实例
    setCurrentInstance(null);

    // 省略部分代码
}


function onMounted(fn) {
  if (currentInstance) {
    // 将生命周期函数添加到 instance.mounted 数组中
    currentInstance.mounted.push(fn);
  } else {
    console.error('onMounted 函数只能在 setup 中调用');
  }
}

```

用户没有在 setup 函数内调用 onMounted 函数，这是错误的用法。

什么周期函数的触发：

```js
function mountComponent(vnode, container, anchor) {
    // 省略部分代码
    effect(
        () => {
            const subTree = render.call(renderContext, renderContext);
            if (!instance.isMounted) {
                // 省略部分代码

                // 遍历 instance.mounted 数组并逐个执行即可
                instance.mounted && instance.mounted.forEach((hook) => hook.call(renderContext));
            } else {
                // 省略部分代码
            }
            instance.subTree = subTree;
        },
        {
            scheduler: queueJob
        }
    );
}
```







## 编译器

本章和编译原理相关，不同用途的编译器的编写和实现难度大不相同。对于高级语言的编译器，需要开发者掌握至少：**上下文无关文法，巴科斯范式，扩展巴科斯范式书写语法规则，语法推到，理解和消除左递归，递归下降算法，类型系统等知识**。

前端常用的编译原理场景：

- 表格，报表中的自定义公式计算器（编译前段技术）；
- 设计一种领域特定语言（DSL）。

Vuejs和jsx都是DSL，实现难度不大，只需要掌握基本的编译原理技术就可以实现。

编译器本身一般是一个子程序，目的是将A语言（源代码）翻译为另一种语言B（目标代码）。这个过程叫做编译。

完整的编译过程包含：**词法分析，语法分析，语义分析，中间代码生产，优化，目标代码生成**等。

<img src="images\image-20240318093710649.png" alt="image-20240318093710649" style="zoom:200%;" />



编译前段通常与目标平台无关，仅负责分析源代码。

编译后段则通常与目标平台有关，并不一定会包含中间代码生成和优化这两个环节，这取决于具体的场景和实现。中间代码生成和优化这两个环节有时也叫“中段”。

对于 Vue.js 的模板编译器来说，源代码就是组件的模板，而目标代码是能够在浏览器平台上运行的 JavaScript 代码。

![image-20240318093939481](D:\learn-notes\vue\images\image-20240318093939481.png)



Vue编译器的目标代码：渲染函数。

 Vue.js 模板编译器的工作流程：

![image-20240318094100883](D:\learn-notes\vue\images\image-20240318094100883.png)

模板 AST就是用来描述模板的抽象语法树。

```vue
<div>
  <h1 v-if="ok">Vue Template</h1>
</div>
```

对应的模板AST：

```js
const ast = {
  // 逻辑根节点
  type: 'Root',
  children: [
    // div 标签节点
    {
      type: 'Element',
      tag: 'div',
      children: [
        // h1 标签节点
        {
          type: 'Element',
          tag: 'h1',
          props: [
            // v-if 指令节点
            {
              type: 'Directive', // 类型为 Directive 代表指令
              name: 'if'， // 指令名称为 if，不带有前缀 v19 exp: {
              // 表达式节点
              type: 'Expression',
              content: 'ok'
            }
            }
          ]
        }
      ]
    }
  ]
}
```

每一棵 AST 都有一个逻辑上的根节点，其类型为 Root。模板中真正的根节点则作为 Root 节点的 children 存在。

- 不同类型的节点的type不同
- 标签节点的子节点存储在children数组中
- **标签节点**的**属性节点**和**指令节点**存储在props中
- 不同类型的节点会有不同的属性

封装parse函数实现对模板的词法分析和语法分析，得到模板 AST。

![image-20240318094833149](D:\learn-notes\vue\images\image-20240318094833149.png)

```js
const template = `
 <div>
 <h1 v-if="ok">Vue Template</h1>
 </div>
 `;

const templateAST = parse(template);
```



在词法分析和语法分析后，在对其进行语义分析，

语义分析的例子：

- 检查 v-else 指令是否存在相符的 v-if 指令
- 分析属性值是否是静态的，是否是常量等
- 插槽是否会引用上层作用域的变量

最后并生成与模板一一对应的模板 AST。

然后将模板 AST 转换为 JavaScript AST。因为 Vue.js 模板编译器的最终目标是生成渲染函数，而渲染函数本质上是 JavaScript 代码，所以需要将模板 AST 转换成**用于描述渲染函数的 JavaScript AST**。

封装 transform 函数来完成模板 AST 到 JavaScript AST 的转换工作

![image-20240318101951478](D:\learn-notes\vue\images\image-20240318101951478.png)

```js
const templateAST = parse(template)
const jsAST = transform(templateAST)
```

然后根据JavaScript AST生成渲染函数，封装 generate 函数来完成。

![image-20240417214034883](images\image-20240417214034883.png)

```js
const templateAST = parse(template)
const jsAST = transform(templateAST)
const code = generate(jsAST)  // code就是渲染函数render对应的字符串形式
```



- 模板字符串=>模板对应的AST（parser）
- 模板对应的AST=>JavaScript对应的AST（transformer）
- JavaScript对应的AST=>render函数字符串（generator）

### 解析器的实现

parser 的实现原理与状态机。parser子程序的实现具体可以分为：

1. tokenize
2. 基于token生成模板ast的函数

解析器的入参：字符串模板。

原理是逐个读取字符串模板中的字符，并根据一定的规则将整个字符串切割为一个个Token（分词）。在基于token生成模板AST。



#### tokenize

```vue
<p>Vue</p>
```

在词法分析后得到：

- 开始标签：`<p>`
- 文本节点：vue
- 结束标签：`</p>`

解析器是如何对模板进行切割？原理是使用有限状态机。有限意味着可以穷举，自动以为着有一个while循环。

状态机有一个初始状态。

<img src="D:\learn-notes\vue\images\image-20240417214934351.png" alt="image-20240417214934351" style="zoom:200%;" />

经过这样一系列的状态迁移过程之后，最终就能够得到相应的Token。上图有的圆圈是单线的，而有的圆圈是双线的。双线代表此时状态机是一个合法的 Token。

解析 HTML 并构造 Token 的过程在 WHATWG 发布的关于浏览器解 析 HTML 的规范中，详细阐述了状态迁移。Vue.js 的模板是类 HTML 的实现。

按照有限状态机的状态迁移过程，可以编写对应的代码实现。因此，有限状态机可以帮助完成对模板的标记化（tokenized），最终将得到一系列 Token。

模拟实现：

```js
// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6 // 结束标签名称状态
};
// 一个辅助函数，用于判断是否是字母
function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

// 接收模板字符串作为参数，并将模板切割为 Token 返回
function tokenize(str) {
  // 状态机的当前状态：初始状态
  let currentState = State.initial;
  // 用于缓存字符
  const chars = [];
  // 生成的 Token 会存储到 tokens 数组中，并作为函数的返回值返回
  const tokens = [];
  // 使用 while 循环开启自动机，只要模板字符串没有被消费尽，自动机就会一直运行
  while (str) {
    // 查看第一个字符，注意，这里只是查看，没有消费该字符
    const char = str[0];
    // switch 语句匹配当前状态
    switch (currentState) {
        // 状态机当前处于初始状态
      case State.initial:
        // 遇到字符 <
        if (char === '<') {
          // 1. 状态机切换到标签开始状态
          currentState = State.tagOpen;
          // 2. 消费字符 <
          str = str.slice(1);
        } else if (isAlpha(char)) {
          // 1. 遇到字母，切换到文本状态
          currentState = State.text;
          // 2. 将当前字母缓存到 chars 数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        }
        break;
        // 状态机当前处于标签开始状态
      case State.tagOpen:
        if (isAlpha(char)) {
          // 1. 遇到字母，切换到标签名称状态
          currentState = State.tagName;
          // 2. 将当前字符缓存到 chars 数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        } else if (char === '/') {
          // 1. 遇到字符 /，切换到结束标签状态
          currentState = State.tagEnd;
          // 2. 消费字符 /
          str = str.slice(1);
        }
        break;
        // 状态机当前处于标签名称状态
      case State.tagName:
        if (isAlpha(char)) {
          // 1. 遇到字母，由于当前处于标签名称状态，所以不需要切换状态，
          // 但需要将当前字符缓存到 chars 数组
          chars.push(char);
          // 2. 消费当前字符
          str = str.slice(1);
        } else if (char === '>') {
          // 1.遇到字符 >，切换到初始状态
          currentState = State.initial;
          // 2. 同时创建一个标签 Token，并添加到 tokens 数组中
          // 注意，此时 chars 数组中缓存的字符就是标签名称
          tokens.push({
            type: 'tag',
            name: chars.join('')
          });
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0;
          // 4. 同时消费当前字符 >
          str = str.slice(1);
        }
        break;
        // 状态机当前处于文本状态
      case State.text:
        if (isAlpha(char)) {
          // 1. 遇到字母，保持状态不变，但应该将当前字符缓存到 chars 数组

          chars.push(char);
          // 2. 消费当前字符
          str = str.slice(1);
        } else if (char === '<') {
          // 1. 遇到字符 <，切换到标签开始状态
          currentState = State.tagOpen;
          // 2. 从 文本状态 --> 标签开始状态，此时应该创建文本 Token，并添加到 tokens 数组
          // 注意，此时 chars 数组中的字符就是文本内容
          tokens.push({
            type: 'text',
            content: chars.join('')
          });
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0;
          // 4. 消费当前字符
          str = str.slice(1);
        }
        break;
        // 状态机当前处于标签结束状态
      case State.tagEnd:
        if (isAlpha(char)) {
          // 1. 遇到字母，切换到结束标签名称状态
          currentState = State.tagEndName;
          // 2. 将当前字符缓存到 chars 数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        }
        break;
        // 状态机当前处于结束标签名称状态
      case State.tagEndName:
        if (isAlpha(char)) {
          // 1. 遇到字母，不需要切换状态，但需要将当前字符缓存到 chars数组
          chars.push(char);
          // 2. 消费当前字符
          str = str.slice(1);
        } else if (char === '>') {
          // 1. 遇到字符 >，切换到初始状态
          currentState = State.initial;
          // 2. 从 结束标签名称状态 --> 初始状态，应该保存结束标签名称Token
          // 注意，此时 chars 数组中缓存的内容就是标签名称
          tokens.push({
            type: 'tagEnd',
            name: chars.join('')
          });
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0;
          // 4. 消费当前字符
          str = str.slice(1);
        }
        break;
    }
  }

  // 最后，返回 tokens
  return tokens;
}

```

通过上面的parse函数解析`<p>Vue</p>`，将得到三个 Token：

```js
const tokens = tokenize(`<p>Vue</p>`);
// [
// { type: 'tag', name: 'p' }, // 开始标签
// { type: 'text', content: 'Vue' }, // 文本节点
// { type: 'tagEnd', name: 'p' } // 结束标签
// ]
```

并非总是需要所有 Token。例如，在解析模板的过程中，结束标签 Token 可以省略。这时，可以调整 tokenize函数的代码，并选择性地忽略结束标签 Token。当然，有时也可能需要更多的 Token，这都取决于具体的需求，然后据此灵活地调整代码实现。

实际上，可以通过正则表达式来精简tokenize函数的代码，**因为正则表达式的本质就是有限状态机。**



#### 构造模板AST

不同编译器之间的实现思路甚至可能完全不同，其中就包括 AST 的构造方式。

对于高级编程语言来说，例如 JavaScript ，想要为其构造 AST，较常用的一种算法叫作**递归下降算法**，这里面需要解决 GPL 层面才会遇到的很多问题，例如最基本的运算符优先级问题。

对于像 Vue.js 模板这样的 DSL 来说，可以确定的是，它不具有运算符，所以也就没有所谓的运算符优先级问题。DSL 与 GPL 的区别在于，GPL 是图灵完备的，可以使 用 GPL 来实现 DSL。而 DSL不要求图灵完备，它只需要满足特定场景下的特定用途即可。

Vue.js 的模板是类HTML 标记语言，它的格式非常固定，标签元素之间天然嵌套，形成父子关系。 因此，一棵用于描述类HTML 的 AST 将拥有与 HTML 标签非常相似的层级结构。假设有如下模板：

```vue
 <div><p>Vue</p><p>Template</p></div>
```

这段模板对应的 AST 可以设计为：

```js
const ast = {
  // AST 的逻辑根节点
  type: 'Root',
  children: [
    // 模板的 div 根节点
    {
      type: 'Element',
      tag: 'div',
      children: [
        // div 节点的第一个子节点 p
        {
          type: 'Element',
          tag: 'p',
          // p 节点的文本节点
          children: [
            {
              type: 'Text',
              content: 'Vue'
            }
          ]
        },
        // div 节点的第二个子节点 p
        {
          type: 'Element',
          tag: 'p',
          // p 节点的文本节点
          children: [
            {
              type: 'Text',
              content: 'Template'
            }
          ]
        }
      ]
    }
  ]
};
```



![image-20240417221911017](D:\learn-notes\vue\images\image-20240417221911017.png)



接下来，使用程序根据模板解析后生成的 Token 构造出这样一棵 AST。

```js
const tokens = tokenize(`<div><p>Vue</p><p>Template</p></div>`)
```

tokens：

```js
const tokens = [
  { type: 'tag', name: 'div' }, // div 开始标签节点
  { type: 'tag', name: 'p' }, // p 开始标签节点
  { type: 'text', content: 'Vue' }, // 文本节点
  { type: 'tagEnd', name: 'p' }, // p 结束标签节点
  { type: 'tag', name: 'p' }, // p 开始标签节点
  { type: 'text', content: 'Template' }, // 文本节点
  { type: 'tagEnd', name: 'p' }, // p 结束标签节点
  { type: 'tagEnd', name: 'div' } // div 结束标签节点
];

```

根据 Token 列表构建 AST 的过程，就是对 Token 列表进行扫描。从第一个 Token 开始，顺序地扫描整个 Token 列表，直到列表中的所有 Token 处理完毕。在这个过程中，需要维护一个栈 elementStack，这个栈将用于维护元素间的父子关系。每遇到一个 开始标签节点，就构造一个 Element 类型的 AST 节点，并将其压入栈中。类似地，每当遇到一个结束标签节点，就将当前栈顶的节点弹出。这样，栈顶的节点将始终充当父节点的角色。扫描过程中遇到的所有节点，都会作为当前栈顶节点的子节点，并添加到栈顶节点的 children 属性下。

开始扫描前：

<img src="images\image-20240417222218536.png" alt="image-20240417222218536" style="zoom:200%;" />



扫描完成后：

<img src="D:\learn-notes\vue\images\image-20240417222550158.png" alt="image-20240417222550158" style="zoom:200%;" />



完整的实现：

```js
// parse 函数接收模板作为参数
function parse(str) {
  // 首先对模板进行标记化，得到 tokens
  const tokens = tokenize(str);
  // 创建 Root 根节点
  const root = {
    type: 'Root',
    children: []
  };
  // 创建 elementStack 栈，起初只有 Root 根节点
  const elementStack = [root];

  // 开启一个 while 循环扫描 tokens，直到所有 Token 都被扫描完毕为止
  while (tokens.length) {
    // 获取当前栈顶节点作为父节点 parent
    const parent = elementStack[elementStack.length - 1];
    // 当前扫描的 Token
    const t = tokens[0];
    switch (t.type) {
      case 'tag':
        // 如果当前 Token 是开始标签，则创建 Element 类型的 AST 节点
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        };
        // 将其添加到父级节点的 children 中
        parent.children.push(elementNode);
        // 将当前节点压入栈
        elementStack.push(elementNode);
        break;
      case 'text':
        // 如果当前 Token 是文本，则创建 Text 类型的 AST 节点
        const textNode = {
          type: 'Text',
          content: t.content
        };
        // 将其添加到父节点的 children 中
        parent.children.push(textNode);
        break;
      case 'tagEnd':
        // 遇到结束标签，将栈顶节点弹出
        elementStack.pop();
        break;
    }
    // 消费已经扫描过的 token
    tokens.shift();
  }

  // 最后返回 AST
  return root;
}
```





#### transform

AST 的转换指的是对 AST 进行一系列操作， 将其转换为新的 AST 的过程。新的 AST 可以是原语言或原 DSL 的描述，也可以是其他语言或其他 DSL 的描述。例如，可以对模板 AST 进行操作，将其转换为 JavaScript AST。转换后的 AST 可以用于代码生成。这其实就是 Vue.js 的模板编译器将模板编译为渲染函数的过程。

<img src="D:\learn-notes\vue\images\image-20240417224410354.png" alt="image-20240417224410354" style="zoom:200%;" />

其中 transform 函数就是用来完成 AST 转换工作的。

**节点的访问**

为了对 AST 进行转换，需要能访问 AST 的每一个节点，这样才有机会对特定节点进行修改、替换、删除等操作。由于 AST 是树型数据结构，所以需要编写一个深度优先的遍历算法，从而实现对 AST 中节点的访问。

打印的工具函数：

```js
function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type;
  // 节点的描述，如果是根节点，则没有描述
  // 如果是 Element 类型的节点，则使用 node.tag 作为节点的描述
  // 如果是 Text 类型的节点，则使用 node.content 作为节点的描述
  const desc = node.type === 'Root' ? '' : node.type === 'Element' ? node.tag : node.content;

  // 打印节点的类型和描述信息
  console.log(`${'-'.repeat(indent)}${type}: ${desc}`);

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach((n) => dump(n, indent + 2));
  }
}

```

在后续编写 AST 的转换代码时，将使用 dump 函数来展示转换后的结果。

实现对 AST 中节点的访问。访问节点的方式是，从 AST 根节点开始，进行**深度优先遍历**，如下面的代码所示：

```js
function traverseNode(ast) {
  // 当前节点，ast 本身就是 Root 节点
  const currentNode = ast;
  // 如果有子节点，则递归地调用 traverseNode 函数进行遍历
  const children = currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i]);
    }
  }
}
```

traverseNode 函数用来以深度优先的方式遍历 AST。有了 traverseNdoe 函数之后，即可实现对 AST 中节点的访问。例如，可以实现一个转换功能，将 AST 中所有 p 标签转换为 h1 标签，如下面的代码所示：

```js
function traverseNode(ast) {
  // 当前节点，ast 本身就是 Root 节点
  const currentNode = ast;

  // 对当前节点进行操作
  if (currentNode.type === 'Element' && currentNode.tag === 'p') {
    // 将所有 p 标签转换为 h1 标签
    currentNode.tag = 'h1';
  }

  // 如果有子节点，则递归地调用 traverseNode 函数进行遍历
  const children = currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i]);
    }
  }
}
```

在上面这段代码中，通过检查当前节点的 type 属性和 tag 属性，来确保被操作的节点是 p 标签。接着，将符合条件的节点 的 tag 属性值修改为 'h1'，从而实现 p 标签到 h1 标签的转换。

不过随着对不同节点处理能力的加入，traverseNode 函数将会变得越来越“臃肿”。这时，能对节点的操作和访问进行解耦，可以使用回调函数的机制来实现解耦，如下面 traverseNode 函数的代码所示：

```js
// 接收第二个参数 context
function traverseNode(ast, context) {
  const currentNode = ast;

  // context.nodeTransforms 是一个数组，其中每一个元素都是一个函数
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    // 将当前节点 currentNode 和 context 都传递给 nodeTransforms 中注册的回调函数
    transforms[i](currentNode, context);
  }

  const children = currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i], context);
    }
  }
}
```

- 首先为 traverseNode 函数增加了第二 个参数 context。
- 把回调函数存储到 transforms 数组中，然后遍历该数组，并逐 个调用注册在其中的回调函数。
- 最后，将当前节点 currentNode 和 context 对象分别作为参数传递给回调函数。

使用traverseNode：

```js
function transform(ast) {
  // 在 transform 函数内创建 context 对象
  const context = {
    // 注册 nodeTransforms 数组
    nodeTransforms: [
      transformElement, // transformElement 函数用来转换标签节点
      transformText // transformText 函数用来转换文本节点
    ]
  };
  // 调用 traverseNode 完成转换
  traverseNode(ast, context);
  // 打印 AST 信息
  console.log(dump(ast));
}
```

其中，transformElement 函数和 transformText 函数的实现如下：

```js
function transformElement(node) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'h1';
  }
}

function transformText(node) {
  if (node.type === 'Text') {
    node.content = node.content.repeat(2);
  }
}
```

解耦之后，节点操作封装到了 transformElement 和 transformText 这样的独立函数中。甚至可以编写任意多个类似的转换函数，只需要将它们注册到 context.nodeTransforms中即可。这样就解决了功能增加所导致的 traverseNode 函数“臃肿” 的问题。



#### 转换上下文context

上面为什么要使用 context 对象？直接定义一个数组不就可以了吗？

为了搞清楚这个问题，就不得不提到关于上下文的知识。**可以把 Context 看作程序在某个范围内的“全局变量”。**实际上，上下文并不是一个具象的东西，它依赖于具体的使用场景。举几个例子：

- 在编写 React 应用时，可以使用 React.createContext 函数创建一个上下文对象，该上下文对象允许将数据通过组件树一层层地传递下去。无论组件树的层级有多深，只要组件在这 棵组件树的层级内，那么它就能够访问上下文对象中的数据。 
- 在编写 Vue.js 应用时，也可以通过 provide/inject 等能力，向一整棵组件树提供数据。这些数据可以称为上下文。 
- 在编写 Koa 应用时，中间件函数接收的 context 参数也是一种上下文对象，所有中间件都可以通过 context 来访问相同的数据。

上下文对象其实就是程序在某个范围内的“全局变量”。换句话说，也可以把全局变量看作全局上下文。

本节讲解的 context.nodeTransforms 数组，这里的 context 可以看作 AST 转换函数过程中的上下文数据。所有 AST 转换函数都可以通过 context 来共享数据。上下文对象中通常会维护程序的当前状态，例如当前转换的节点是哪一个？当前转换的节点的父 节点是谁？甚至当前节点是父节点的第几个子节点？等。这些信息对于编写复杂的转换函数非常有用。

构造转换上下文信息，如下面的代码所示：

```js
function transform(ast) {
  const context = {
    // 增加 currentNode，用来存储当前正在转换的节点
    currentNode: null,
    // 增加 childIndex，用来存储当前节点在父节点的 children 中的位置索引
    childIndex: 0,
    // 增加 parent，用来存储当前转换节点的父节点
    parent: null,
    nodeTransforms: [transformElement, transformText]
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}
```

在上面这段代码中，为转换上下文对象扩展了一些重要信息。 

- currentNode：用来存储当前正在转换的节点。 
- childIndex：用来存储当前节点在父节点的 children 中的位置索引。 
- parent：用来存储当前转换节点的父节点。 

紧接着，需要在合适的地方设置转换上下文对象中的数据， 如下面 traverseNode 函数的代码所示：

```js
function traverseNode(ast, context) {
  // 设置当前转换的节点信息 context.currentNode
  context.currentNode = ast;

  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    transforms[i](context.currentNode, context);
  }

  const children = context.currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      // 递归地调用 traverseNode 转换子节点之前，将当前节点设置为父节点
      context.parent = context.currentNode;
      // 设置位置索引
      context.childIndex = i;
      // 递归地调用时，将 context 透传
      traverseNode(children[i], context);
    }
  }
}
```

在递归地调用 traverseNode 函数进行子节点的转换之前，必须设置 context.parent 和 context.childIndex 的值，这样才能保证在接下来的递归转换中，context 对象所存储的信息是正确的。

有了上下文数据后，就可以实现节点替换功能了。什么是节点替换？在对 AST 进行转换的时候，可能希望把某些节点替换为其他类型的节点。例如，将所有文本节点替换成一个元素节点。为了完成节点替换，需要在上下文对象中添加 context.replaceNode 函数。该函数接收新的 AST 节点作为参数，并使用新节点替换当前正在转换的节点，如下面的代码所示：

```js
function transform(ast) {
  const context = {
    currentNode: null,
    parent: null,
    // 用于替换节点的函数，接收新节点作为参数
    replaceNode(node) {
      // 为了替换节点，我们需要修改 AST
      // 找到当前节点在父节点的 children 中的位置：context.childIndex
      // 然后使用新节点替换即可
      context.parent.children[context.childIndex] = node;
      // 由于当前节点已经被新节点替换掉了，因此我们需要将 currentNode 更新为新节点
      context.currentNode = node;
    },
    nodeTransforms: [transformElement, transformText]
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}
```

定义在context上下文对象中的replaceNode函数如何使用？可以在转换函数中使用 context.replaceNode 函数对 AST 中的节点进行替换了。

如下面 transformText 函数的代码所 示，它能够将文本节点转换为元素节点：

```js
function transformText(node, context) {
  if (node.type === 'Text') {
    // 如果当前转换的节点是文本节点，则调用 context.replaceNode 函数将其替换为元素节点
    context.replaceNode({
      type: 'Element',
      tag: 'span'
    });
  }
}
```

除了替换节点，有时还希望移除当前访问的节点。可以通过实现 context.removeNode 函数来达到目的，如下面的代码所示：

```js
function transform(ast) {
  const context = {
    currentNode: null,
    parent: null,
    replaceNode(node) {
      context.currentNode = node;
      context.parent.children[context.childIndex] = node;
    },
    // 用于删除当前节点。
    removeNode() {
      if (context.parent) {
        // 调用数组的 splice 方法，根据当前节点的索引删除当前节点
        context.parent.children.splice(context.childIndex, 1);
        // 将 context.currentNode 置空
        context.currentNode = null;
      }
    },
    nodeTransforms: [transformElement, transformText]
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}
```

这里有一点需要注意，由于当前节点被移除了，所以后续的转换函数将不再需要处理该节点。因此， 需要对 traverseNode 函数做一些调整，如下面的代码所示：

```js
function traverseNode(ast, context) {
  context.currentNode = ast;

  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    transforms[i](context.currentNode, context);
    // 由于任何转换函数都可能移除当前节点，因此每个转换函数执行完毕后，
    // 都应该检查当前节点是否已经被移除，如果被移除了，直接返回即可
    if (!context.currentNode) return;
  }
  // 一旦当前节点被删除后，该节点的子节点也不用在递归遍历处理了

  const children = context.currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      context.parent = context.currentNode;
      context.childIndex = i;
      traverseNode(children[i], context);
    }
  }
}
```



实现用于移除 文本节点的转换函数，如下面的代码所示：

```js
function transformText(node, context) {
  if (node.type === 'Text') {
    // 如果是文本节点，直接调用 context.removeNode 函数将其移除即可
    context.removeNode();
  }
}
```



#### 进入与退出

在转换 AST 节点的过程中，往往需要根据其子节点的情况来决定如何对当前节点进行转换。这就要求父节点的转换操作必须等待其所有子节点全部转换完毕后再执行。然而，目前设计的转换工作流并不支持这一能力。上文中介绍的转换工作流，是一种从根节点开始、顺序执行的工作流，如图：

<img src="D:\learn-notes\vue\images\image-20240418210723267.png" alt="image-20240418210723267" style="zoom:150%;" />

Root 根节点第一个被处理，节点层次越深，对它的处理将越靠后。这种顺序处理的工作流存在的问题是，当一个节点被处理时，意味着它的父节点已经被处理完毕了，并且无法再回过头重新处理父节点。



更加理想的转换工作流应该如图：

<img src="D:\learn-notes\vue\images\image-20240418210937100.png" alt="image-20240418210937100" style="zoom:150%;" />

由上图，对节点的访问分为两个阶段，即进入阶段和退出阶段。当转换函数处于进入阶段时，它会先进入父节点，再进入子节 点。而当转换函数处于退出阶段时，则会先退出子节点，再退出父节点。这样，只要在退出节点阶段对当前访问的节点进行处理，就一定能够保证其子节点全部处理完毕。

为了实现如图所示的转换工作流，需要重新设计转换函数的能力，如下面 traverseNode 函数的代码所示：

```js
function traverseNode(ast, context) {
  context.currentNode = ast;
  // 1. 增加退出阶段的回调函数数组
  const exitFns = [];
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    // 2. 转换函数可以返回另外一个函数，该函数即作为退出阶段的回调函数
    const onExit = transforms[i](context.currentNode, context);
    if (onExit) {
      // 将退出阶段的回调函数添加到 exitFns 数组中
      exitFns.push(onExit);
    }
    if (!context.currentNode) return;
  }

  const children = context.currentNode.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      context.parent = context.currentNode;
      context.childIndex = i;
      traverseNode(children[i], context);
    }
  }

  // 在节点处理的最后阶段执行缓存到 exitFns 中的回调函数
  // 注意，这里我们要反序执行
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}
```

数组 exitFns用来存储由转换函数返回的回调函数。接着，在 traverseNode 函数的最后，执行这些缓存在 exitFns 数组中的回调函数。这样就保证了，当退出阶段的回调函数执行时，当前访问的节点的子节点已经全部处理过了。有了这些能力之后，在编写转换函数时，可以将转换逻辑编写在退出阶段的回调函数中，从而保证在对当前访问的节点进行转换之前，其子节点一定全部处理完毕了，如下面的代码所示：

```js
function transformElement(node, context) {
  // 进入节点

  // 返回一个会在退出节点时执行的回调函数
  return () => {
    // 在这里编写退出节点的逻辑，当这里的代码运行时，当前转换节点的子节点一定处理完毕了
  };
}

```

需要注意，退出阶段的回调函数是反序执行的。这意味着，如果注册了多个转换函数，则它们的注册顺序将决定代码的执行结果。假设注册的两个转换函数分别是 transformA 和 transformB，如下面的代码所示：

```js
function transform(ast) {
  const context = {
    // 省略部分代码

    // 注册两个转换函数，transformA 先于 transformB
    nodeTransforms: [transformA, transformB]
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}
```

在上面这段代码中，转换函数 transformA 先于 transformB 被注册。这意味着，在执行转换时，transformA 的“进入阶段”会先 于 transformB 的“进入阶段”执行，而 transformA 的“退出阶段”将 晚于 transformB 的“退出阶段”执行。如果将 transformA 与 transformB 的顺序调换，那么转换函 数的执行顺序也将改变。

上面都是对模板AST的一系列操作。其中进入与退出，是讲如何对 AST 进行转换，并实现了一个基本的插件架构。即通过注册自定义的转换函数实现对 AST 的操作。



#### 模板AST转为JavaScriptAST

为什么要将模板 AST 转换为 JavaScript AST ？原因：需要将模板编译为渲染函数。而渲染函数是由 JavaScript 代码来描述的，因此，需要将模板 AST 转换为用于描述渲染函数的 JavaScript AST。

模板：

```vue
<div><p>Vue</p><p>Template</p></div>
```

与这段模板等价的渲染函数是：

```js
function render() {
  return h('div', [h('p', 'Vue'), h('p', 'Template')]);
}
```

上面这段渲染函数的 JavaScript 代码所对应的 JavaScript AST 就是我们的转换目标。那么，它对应的 JavaScript AST 是什么样子的？与模板 AST 是模板的描述一样，JavaScript AST 是 JavaScript 代码的描述。所以，本质上需要设计一些数据结构来描述渲染函数的代码。

首先，观察上面这段渲染函数的代码。它是一个函数声明， 所以首先要描述 JavaScript 中的函数声明语句。一个函数声明语句由以下几部分组成：

- id：函数名称，它是一个标识符 Identifier。
- params：函数的参数，它是一个数组。
- body：函数体，由于函数体可以包含多个语句，因此它也是一个数组。

为了简化问题，这里不考虑箭头函数、生成器函数、async 函数等情况。根据以上这些信息，就可以设计一个基本的数据结构来描述函数声明语句：

```js
const FunctionDeclNode = {
  type: 'FunctionDecl', // 代表该节点是函数声明
  // 函数的名称是一个标识符，标识符本身也是一个节点
  id: {
    type: 'Identifier',
    name: 'render' // name 用来存储标识符的名称，在这里它就是渲染函数的名称 render
  },
  params: [], // 参数，目前渲染函数还不需要参数，所以这里是一个空数组
  // 渲染函数的函数体只有一个语句，即 return 语句
  body: [
    {
      type: 'ReturnStatement',
      return: null // 暂时留空，在后续讲解中补全
    }
  ]
};
```

如上面的代码所示，使用一个对象来描述一个 JavaScript AST 节点。每个节点都具有 type 字段，该字段用来代表节点的类型。对 于函数声明语句来说，它的类型是 FunctionDecl。接着，使用id 字段来存储函数的名称。函数的名称应该是一个合法的标识符，因此 id 字段本身也是一个类型为 Identifier 的节点。在设计 JavaScript AST 的时候，可以根据实际需要进行调整。例如，完全可以将 id 字段设计为一个字符串类型的值。这样做虽然不完全符合 JavaScript 的语义，但是能够满足需求。对于函数的参数，使用 params 数组来存储。目前，设计的渲染函数还不需要参数，因此暂时设为空数组。最后，使用 body 字段来描述函数的函数体。一个函数的函数体内可以存在多个语句，所以使用一个数组来描述它。该数组内的每个元素都对应一条语句，对于渲染函数来说，目前它只有一个返回语句，所以使用一个类型为 ReturnStatement 的节点来描述该返回语句。

介绍完函数声明语句的节点结构后，再来看一下渲染函数的返回值。**渲染函数返回的是虚拟 DOM 节点**，具体体现在 h 函数的调 用。可以**使用 CallExpression 类型的节点来描述函数调用语句**，如下面的代码所示：

```js
const CallExp = {
  type: 'CallExpression',
  // 被调用函数的名称，它是一个标识符
  callee: {
    type: 'Identifier',
    name: 'h'
  },
  // 参数
  arguments: []
};
```

类型为 CallExpression 的节点拥有两个属性。 

- callee：用来描述被调用函数的名字称，它本身是一个标识符节点。 
- arguments：被调用函数的形式参数，多个参数的话用数组来描述。 



```js
function render() {
  return h('div', [h('p', 'Vue'), h('p', 'Template')]);
}
```

h 函数的第一个参数是一个字符串字面量， 可以使用类型为 StringLiteral 的节点来描述它：

```js
const Str = {
  type: 'StringLiteral',
  value: 'div'
};
```

h 函数的第二个参数是一个数组，可以使用类型为 ArrayExpression 的节点来描述它：

```js
const Arr = {
  type: 'ArrayExpression',
  // 数组中的元素
  elements: []
};
```

使用上述 CallExpression、StringLiteral、 ArrayExpression 等节点来填充渲染函数的返回值，其最终结果如下面的代码所示：

```js
const FunctionDeclNode = {
  type: 'FunctionDecl', // 代表该节点是函数声明
  // 函数的名称是一个标识符，标识符本身也是一个节点
  id: {
    type: 'Identifier',
    name: 'render' // name 用来存储标识符的名称，在这里它就是渲染函数的名称 render
  },
  params: [], // 参数，目前渲染函数还不需要参数，所以这里是一个空数组
  // 渲染函数的函数体只有一个语句，即 return 语句
  body: [
    {
      type: 'ReturnStatement',
      // 最外层的 h 函数调用
      return: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'h' },
        arguments: [
          // 第一个参数是字符串字面量 'div'
          {
            type: 'StringLiteral',
            value: 'div'
          },
          // 第二个参数是一个数组
          {
            type: 'ArrayExpression',
            elements: [
              // 数组的第一个元素是 h 函数的调用
              {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'h' },
                arguments: [
                  // 该 h 函数调用的第一个参数是字符串字面量
                  { type: 'StringLiteral', value: 'p' },
                  // 第二个参数也是一个字符串字面量
                  { type: 'StringLiteral', value: 'Vue' }
                ]
              },
              // 数组的第二个元素也是 h 函数的调用
              {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'h' },
                arguments: [
                  // 该 h 函数调用的第一个参数是字符串字面量
                  { type: 'StringLiteral', value: 'p' },
                  // 第二个参数也是一个字符串字面量
                  { type: 'StringLiteral', value: 'Template' }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
};
```

上面这段 JavaScript AST 是对渲染函数代码的完整描述。接下来的任务是，编写转换函数，将模板 AST 转换为上述 JavaScript AST。在开始之前，需要编写一些用来创建 JavaScript AST 节点的辅助函数，如下面的代码所示：

```js
// 用来创建 StringLiteral 节点
function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value
  };
}
// 用来创建 Identifier 节点
function createIdentifier(name) {
  return {
    type: 'Identifier',
    name
  };
}
// 用来创建 ArrayExpression 节点
function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements
  };
}
// 用来创建 CallExpression 节点
function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments
  };
}
```

为了把模板 AST 转换为 JavaScript AST，同样需要两个转换函数：transformElement 和 transformText，它们分别用来处理标签节点和文本节点。具体实现如下：

```js
// 转换文本节点
function transformText(node) {
  // 如果不是文本节点，则什么都不做
  if (node.type !== 'Text') {
    return;
  }
  // 文本节点对应的 JavaScript AST 节点其实就是一个字符串字面量，
  // 因此只需要使用 node.content 创建一个 StringLiteral 类型的节点即可
  // 最后将文本节点对应的 JavaScript AST 节点添加到 node.jsNode 属性下
  node.jsNode = createStringLiteral(node.content);
}

// 转换标签节点
function transformElement(node) {
  // 将转换代码编写在退出阶段的回调函数中，
  // 这样可以保证该标签节点的子节点全部被处理完毕
  return () => {
    // 如果被转换的节点不是元素节点，则什么都不做
    if (node.type !== 'Element') {
      return;
    }

    // 1. 创建 h 函数调用语句,
    // h 函数调用的第一个参数是标签名称，因此我们以 node.tag 来创建一个字符串字面量节点
    // 作为第一个参数
    const callExp = createCallExpression('h', [createStringLiteral(node.tag)]);
    // 2. 处理 h 函数调用的参数
    node.children.length === 1
      ? // 如果当前标签节点只有一个子节点，则直接使用子节点的 jsNode 作为参数
        callExp.arguments.push(node.children[0].jsNode)
      : // 如果当前标签节点有多个子节点，则创建一个 ArrayExpression 节点作为参数
        callExp.arguments.push(
          // 数组的每个元素都是子节点的 jsNode
          createArrayExpression(node.children.map((c) => c.jsNode))
        );
    // 3. 将当前标签节点对应的 JavaScript AST 添加到 jsNode 属性下
    node.jsNode = callExp;
  };
}

```

有两点需要注意：

- 在转换标签节点时，需要将转换逻辑编写在退出阶段的回调函数内，这样才能保证其子节点全部被处理完毕；
- 无论是文本节点还是标签节点，它们转换后的 JavaScript AST 节点都存储在节点的 node.jsNode 属性下。

使用上面两个转换函数即可完成标签节点和文本节点的转换，即把模板转换成 h 函数的调用。但是，转换后得到的 AST 只是用来描述渲染函数 render 的返回值的，所以最后一步要做的就是，补全 JavaScript AST，即把用来描述 render 函数本身的函数声明语句节点附加到 JavaScript AST 中。这需要编写 transformRoot 函数来实现对 Root 根节点的转换：

```js
// 转换 Root 根节点
function transformRoot(node) {
  // 将逻辑编写在退出阶段的回调函数中，保证子节点全部被处理完毕
  return () => {
    // 如果不是根节点，则什么都不做
    if (node.type !== 'Root') {
      return;
    }
    // node 是根节点，根节点的第一个子节点就是模板的根节点，
    // 当然，这里我们暂时不考虑模板存在多个根节点的情况
    const vnodeJSAST = node.children[0].jsNode;
    // 创建 render 函数的声明语句节点，将 vnodeJSAST 作为 render 函数体的返回语句
    node.jsNode = {
      type: 'FunctionDecl',
      id: { type: 'Identifier', name: 'render' },
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAST
        }
      ]
    };
  };
}
```



#### 代码生成( generate)

如何根据转换后得到的 JavaScript AST 生成渲染函数代码。代码生成本质上是字符串拼接的艺术。需要访问 JavaScript AST 中的节 点，为每一种类型的节点生成相符的 JavaScript 代码。

实现 generate 函数（编译过程的最后一步）。

```js
function compile(template) {
  // 模板 AST
  const ast = parse(template);
  // 将模板 AST 转换为 JavaScript AST
  transform(ast);
  // 代码生成
  const code = generate(ast.jsNode);

  return code;
}
```

与 AST 转换一样，代码生成也需要上下文对象。该上下文对象用来维护代码生成过程中程序的运行状态，如下面的代码所示：

```js
function generate(node) {
  const context = {
    // 存储最终生成的渲染函数代码
    code: '',
    // 在生成代码时，通过调用 push 函数完成代码的拼接
    push(code) {
      context.code += code;
    }
  };

  // 调用 genNode 函数完成代码生成的工作，
  genNode(node, context);

  // 返回渲染函数代码
  return context.code;
}
```

希望最终生成的代码具有较强的可读性，因此应该考虑生成代码的格式，例如缩进和换行等。这就需要扩展 context 对象，为其增加用来完成换行和缩进的工具函数，如下面的代码所示：

```js
function generate(node) {
  const context = {
    code: '',
    push(code) {
      context.code += code;
    },
    // 当前缩进的级别，初始值为 0，即没有缩进
    currentIndent: 0,
    // 该函数用来换行，即在代码字符串的后面追加 \n 字符，
    // 另外，换行时应该保留缩进，所以还要追加 currentIndent * 2 个空格字符
    newline() {
      context.code += '\n' + ` `.repeat(context.currentIndent);
    },
    // 用来缩进，即让 currentIndent 自增后，调用换行函数
    indent() {
      context.currentIndent++;
      context.newline();
    },
    // 取消缩进，即让 currentIndent 自减后，调用换行函数
    deIndent() {
      context.currentIndent--;
      context.newline();
    }
  };

  genNode(node, context);

  return context.code;
}

```



编写 genNode 函数。代码生成的原理其实很简单，只需要匹配各种 类型的 JavaScript AST 节点，并调用对应的生成函数即可，如下面的代 码所示：

```js
function genNode(node, context) {
  // 使用 switch 语句来匹配不同类型的节点，并调用与之对应的生成器函数。
  switch (node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context);
      break;
    case 'ReturnStatement':
      genReturnStatement(node, context);
      break;
    case 'CallExpression':
      genCallExpression(node, context);
      break;
    case 'StringLiteral':
      genStringLiteral(node, context);
      break;
    case 'ArrayExpression':
      genArrayExpression(node, context);
      break;
  }
}
```



函数声明语句的代码生成：为函数声明类型的节点生成对应的 JavaScript 代码。

```js
function genFunctionDecl(node, context) {
  // 从 context 对象中取出工具函数
  const { push, indent, deIndent } = context;
  // node.id 是一个标识符，用来描述函数的名称，即 node.id.name
  push(`function ${node.id.name} `);
  push(`(`);
  // 调用 genNodeList 为函数的参数生成代码
  genNodeList(node.params, context);
  push(`) `);
  push(`{`);
  // 缩进
  indent();
  // 为函数体生成代码，这里递归地调用了 genNode 函数
  node.body.forEach((n) => genNode(n, context));
  // 取消缩进
  deIndent();
  push(`}`);
}
```

genNodeList：为函数的参数生成对应的代码。

```js
function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    genNode(node, context);
    if (i < nodes.length - 1) {
      push(', ');
    }
  }
}

```

genNodeList 函数接收一个节点数组作为参数，并为每一个节点 递归地调用 genNode 函数完成代码生成工作。这里要注意的一点是， 每处理完一个节点，需要在生成的代码后面拼接逗号字符（,）。

```
// 如果节点数组为
const node = [节点 1， 节点 2， 节点 3]
// 那么生成的代码将类似于
'节点 1，节点 2，节点 3'
// 如果在这段代码的前后分别添加圆括号，那么它将可用于函数的参数声明
('节点 1，节点 2，节点 3')
// 如果在这段代码的前后分别添加方括号，那么它将是一个数组
['节点 1，节点 2，节点 3']
```

genArrayExpression 函数就利用了这个特点来实现 对数组表达式的代码生成，如下面的代码所示：

```js
function genArrayExpression(node, context) {
  const { push } = context;
  // 追加方括号
  push('[');
  // 调用 genNodeList 为数组元素生成代码
  genNodeList(node.elements, context);
  // 补全方括号
  push(']');
}
```

由于目前渲染函数暂时没有接收任何参数，所以 genNodeList 函数不会为其生成任何代码。对于 genFunctionDecl 函数，另外需要注意的是，由于函数体本身也是 一个节点数组，所以需要遍历它并递归地调用 genNode 函数生成代码。

对于 ReturnStatement 和 StringLiteral 类型的节点， 如下所示：

```js
function genReturnStatement(node, context) {
  const { push } = context;
  // 追加 return 关键字和空格
  push(`return `);
  // 调用 genNode 函数递归地生成返回值代码
  genNode(node.return, context);
}

function genStringLiteral(node, context) {
  const { push } = context;
  // 对于字符串字面量，只需要追加与 node.value 对应的字符串即可
  push(`'${node.value}'`);
}

```

genCallExpression 函数：

```js
function genCallExpression(node, context) {
  const { push } = context;
  // 取得被调用函数名称和参数列表
  const { callee, arguments: args } = node;
  // 生成函数调用代码
  push(`${callee.name}(`);
  // 调用 genNodeList 生成参数代码
  genNodeList(args, context);
  // 补全括号
  push(`)`);
}
```

配合上述 生成器函数的实现，将得到符合预期的渲染函数代码。运行如下测试用例：

```js
const ast = parse(`<div><p>Vue</p><p>Template</p></div>`);
transform(ast);
const code = generate(ast.jsNode);

```

得到的代码字符串如下：

```js
function render() {
  return h('div', [h('p', 'Vue'), h('p', 'Template')]);
}
```



## 解析器

解析器本质上是一个状态机。正则表达式其实也是一个状态机。因此在编写 parser 的时候，利用正则表达式能够让少写不少代码。本章用正则表达式来实现HTMl解析器。

浏览器如何对 HTML 文本进行解析？关于 HTML 文本的解析，是有规范可循的，即 WHATWG 关于 HTML 的解析规范，其中定义了完整的错误处理和状态机的状态迁移流程，还提及了一些特殊的状态，例如 DATA、CDATA、RCDATA、 RAWTEXT 等。这些状态有什么含义？它们对解析器有哪些影响？什么是 HTML 实体，以及 Vue.js 模板解析器需要如何处理 HTML 实体？

扩展：

> HTML 实体是一种特殊的字符串，它代表了文档中无法直接输入的字符。这些无法直接输入的字符包括在HTML中有特殊意义的符号（如小于号 `<` 和大于号 `>`），以及无法通过键盘直接输入的特殊字符（如版权符号 ©）。HTML 实体始终以 `&` 开头，以 `;` 结束。使用HTML实体主要有两个目的：
>
> 1. **显示特殊字符**：由于某些字符在HTML中具有特殊的含义，如 `<` 用于标记HTML标签的开始，因此无法直接在网页中显示这些字符。为了能够在页面上展示这样的特殊字符，需要使用HTML实体。
>
>    例如，若要在页面上直接显示小于号 `<`，需要使用它的HTML实体 `&lt;`。
>
> 2. **显示难以键入的字符**：某些字符，如国际货币符号或特殊的标点符号，在大多数键盘上并不容易直接输入，这时你可以使用HTML实体来表示这些字符。
>
>    例如，版权符号 © 的HTML实体是 `&copy;`。
>
> **常见的HTML实体**
>
> 以下是一些常见HTML实体的例子：
>
> - `&lt;` 表示小于号 `<`
> - `&gt;` 表示大于号 `>`
> - `&amp;` 表示和号 `&`
> - `&quot;` 表示双引号 `"`
> - `&apos;` 表示单引号 `'`
> - `&nbsp;` 表示不断行的空白格
> - `&copy;` 表示版权符号 ©
> - `&reg;` 表示注册商标符号 ®
>
> HTML实体非常丰富，涵盖了许多特殊字符、符号和各种国际文字字符。通过使用HTML实体，你可以确保这些特殊字符能够在所有浏览器中正确显示，同时避免HTML解析器误解这些字符的含义。



### 文本模式及其对解析器的影响

文本模式指的是**解析器在工作时所进入的一些特殊状态**，在不同的特殊状态下，解析器对文本的解析行为会有所不同。具体来说，当解析器遇到一些特殊标签时，会切换模式，从而影响其对文本的解析行为。这些特殊标签是：

- ` <title> 标签、<textarea> 标签，当解析器遇到这两个标签时，会切换到 RCDATA 模式；` 
- `<style>、<xmp>、<iframe>、<noembed>、<noframes>、<noscript> 等标签，当解析器遇到这些标签时，会切换到RAWTEXT模式；`
- `当解析器遇到<![CDATA[ 字符串时，会进入 CDATA 模式.`

解析器的初始模式则是 DATA 模式。对于 Vue.js 的模板 DSL 来 说，模板中不允许出现 script 标签，因此 Vue.js 模板解析器在遇 到 script标签时也会切换到 RAWTEXT 模式。

解析器的行为会因工作模式的不同而不同。WHATWG 规范的第 13.2.5.1 节给出了初始模式下解析器的工作流程，如图：

<img src="D:\learn-notes\vue\images\image-20240421101851417.png" alt="image-20240421101851417" style="zoom:150%;" />

在默认的 DATA 模式下，解析 器在遇到字符 `<`时，会切换到标签开始状态（tag open state）。换句话说，在该模式下，解析器能够解析标签元素。当解析器遇到字符 & 时，会切换到字符引用状态（character reference state），也称 HTML 字符实体状态。也就是说，在 DATA 模式下，解析器能够处理 HTML 字符实体。



当解析器处于 RCDATA 状态时，它的工作情况。下图给出了 WHATWG 规范第 13.2.5.2 节的内容。

<img src="D:\learn-notes\vue\images\image-20240421102111123.png" alt="image-20240421102111123" style="zoom:150%;" />

当解析器遇到字符 < 时，不会再切换到标签开始状态，而会切换到 RCDATA less-than sign state 状态。下图给出了 RCDATA less-than sign state 状态下解析器的工作方式。

<img src="D:\learn-notes\vue\images\image-20240421102216966.png" alt="image-20240421102216966" style="zoom:150%;" />

在 RCDATA less-than sign state 状态 下，如果解析器遇到字符 /，则直接切换到 RCDATA 的结束标签状 态，即 RCDATA end tag open state；否则会将当前字符 < 作为普通字符处理，然后继续处理后面的字符。由此可知，在 RCDATA 状 态下，解析器不能识别标签元素。这其实间接说明了在textarea标签重可以将字符 `<`作为普通文本，解析器并不会认为字符 `<` 是标签开始的标志，如下面的代码所示：

```html
<textarea>
  <div>asdf</div>asdfasdf
</textarea>
```

<img src="D:\learn-notes\vue\images\image-20240421102540515.png" alt="image-20240421102540515" style="zoom:150%;" />

在上面这段 HTML 代码中， textarea标签内存在一个 `<div> `标签。但解析器并不会把` <div> `解析为标签元素，而是作为普通文本处理。但是，在 RCDATA 模式下，解析器仍然支持 HTML 实体。因为当解析器遇到字符 & 时，会切换到字符引用状态， 如下面的代码所示：

```html
<textarea>&copy;</textarea>
```

浏览器在渲染这段 HTML 代码时，会在文本框内展示字符 ©。

解析器在 RAWTEXT 模式下的工作方式与在 RCDATA 模式下类似。 唯一不同的是，在 RAWTEXT 模式下，解析器将不再支持 HTML 实体。下图给出了 WHATWG 规范第 13.2.5.3 节中所定义的 RAWTEXT 模式下状态机的工作方式。

<img src="D:\learn-notes\vue\images\image-20240421102834998.png" alt="image-20240421102834998" style="zoom:150%;" />

RAWTEXT 模式不支持 HTML 实体。在该模式下，解析器会将 HTML 实体字符作为普通字符处理。 Vue.js 的单文件组件的解析器在遇到 script 标签时就会进入 RAWTEXT 模式，这时它会把 script 标签内的内容全部作为普通文本处理。



CDATA 模式在 RAWTEXT 模式的基础上更进一步。下图给出了 WHATWG 规范第 13.2.5.69 节中所定义的 CDATA 模式下状态机的工作方式。

<img src="D:\learn-notes\vue\images\image-20240421112116427.png" alt="image-20240421112116427" style="zoom:150%;" />

在 CDATA 模式下，解析器将把任何字符都作为普通字符处理，直 到遇到 CDATA 的结束标志为止。

 汇总了不同的模式及各其特性：

| 模式    | 能否解析标签 | 是否支持 HTML 实体 |
| ------- | ------------ | ------------------ |
| DATA    | 能           | 是                 |
| RCDATA  | 否           | 是                 |
| RAWTEXT | 否           | 否                 |
| CDATA   | 否           | 否                 |

同时不同的模式还会影响解析器对于终止解析的判断。后续编写解析器代码时，会将上述模式定义为状态表，如下面的代码所示：

```js
const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA'
};
```



### 递归下降算法构造模板 AST

实现一个更加完善的模板解析器：

```js
// 定义文本模式，作为一个状态表
const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA'
};

// 解析器函数，接收模板作为参数
function parse(str) {
  // 定义上下文对象
  const context = {
    // source 是模板内容，用于在解析过程中进行消费
    source: str,
    // 解析器当前处于文本模式，初始模式为 DATA
    mode: TextModes.DATA
  };
  // 调用 parseChildren 函数开始进行解析，它返回解析后得到的子节点
  // parseChildren 函数接收两个参数：
  // 第一个参数是上下文对象 context
  // 第二个参数是由父代节点构成的节点栈，初始时栈为空
  const nodes = parseChildren(context, []);

  // 解析器返回 Root 根节点
  return {
    type: 'Root',
    // 使用 nodes 作为根节点的 children
    children: nodes
  };
}

```

这段代码的思路与上一章中讲述的关于模板 AST 的构建思路有所不同。上一章中首先对模板内容进行标记化得到一系列 Token，然后根据这些 Token 构建模板 AST。实际上，创建 Token 与构造模板 AST 的过程可以同时进行，因为模板和模板 AST 具有同构 的特性。

另外，在上面这段代码中，parseChildren 函数是整个解析器的核心。后续会递归地调用它来不断地消费模板内容。 parseChildren 函数会返回解析后得到的子节点。假设有如下模板：

```vue
<p>1</p>
<p>2</p>
```

上面这段模板有两个根节点，即两个标签。 parseChildren 函数在解析这段模板后，会得到由这两个节点组成的数组：

```js
[
  { type: 'Element', tag: 'p', children: [/*...*/] },
  { type: 'Element', tag: 'p', children: [/*...*/] },
]
```

之后，这个数组将作为 Root 根节点的 children。 

parseChildren 函数接收两个参数。第一个参数：上下文对象 context。 第二个参数：由父代节点构成的栈，用于维护节点间的父子级关系。

parseChildren 函数本质上也是一个状态机，该状态机有多少 种状态取决于子节点的类型数量。在模板中，元素的子节点可以是以 下几种。

- 标签节点，例如 div
- 文本插值节点，例如 {{ val }}
- 普通文本节点，例如：text
-  注释节点，例如`<!---->`
- CDATA 节点，例如`<![CDATA[ xxx ]]>`

下图给出了 parseChildren 函数在解析模板过程中的状态迁移过程。

<img src="D:\learn-notes\vue\images\image-20240421120442617.png" alt="image-20240421120442617" style="zoom:150%;" />

状态迁移过程总结如下：

- 当遇到字符 < 时，进入临时状态。
  - 如果下一个字符匹配正则 /a-z/i，则认为这是一个标签节 点，于是调用 parseElement 函数完成标签的解析。注意正 则表达式 /a-z/i 中的 i，意思是忽略大小写（caseinsensitive）。
  - 如果字符串以`<!--`开头，则认为这是一个注释节点，于是 调用 parseComment 函数完成注释节点的解析。
  - 如果字符串以`<![CDATA[`开头，则认为这是一个 CDATA 节 点，于是调用 parseCDATA 函数完成 CDATA 节点的解析。
- 如果字符串以 {{ 开头，则认为这是一个插值节点，于是调用 parseInterpolation 函数完成插值节点的解析。
- 其他情况，都作为普通文本，调用 parseText 函数完成文本节 点的解析。

结合文本模式，如下面的代码所示：

```js
function parseChildren(context, ancestors) {
  // 定义 nodes 数组存储子节点，它将作为最终的返回值
  let nodes = [];
  // 从上下文对象中取得当前状态，包括模式 mode 和模板内容 source
  const { mode, source } = context;

  // 开启 while 循环，只要满足条件就会一直对字符串进行解析
  // 关于 isEnd() 后文会详细讲解
  while (!isEnd(context, ancestors)) {
    let node;
    // 只有 DATA 模式和 RCDATA 模式才支持插值节点的解析
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      // 只有 DATA 模式才支持标签节点的解析
      if (mode === TextModes.DATA && source[0] === '<') {
        if (source[1] === '!') {
          if (source.startsWith('<!--')) {
            // 注释
            node = parseComment(context);
          } else if (source.startsWith('<![CDATA[')) {
            // CDATA
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === '/') {
          // 结束标签，这里需要抛出错误，后文会详细解释原因
        } else if (/[a-z]/i.test(source[1])) {
          // 标签
          node = parseElement(context, ancestors);
        }
      } else if (source.startsWith('{{')) {
        // 解析插值
        node = parseInterpolation(context);
      }
    }

    // node 不存在，说明处于其他模式，即非 DATA 模式且非 RCDATA 模式
    // 这时一切内容都作为文本处理
    if (!node) {
      // 解析文本节点
      node = parseText(context);
    }

    // 将节点添加到 nodes 数组中
    nodes.push(node);
  }

  // 当 while 循环停止后，说明子节点解析完毕，返回子节点
  return nodes;
}

```





扩展：

> IE5.5 发明了文档模式概念，即可以使用 doctype 切换文档模式。最初的文档模式有两种：混杂模式（quirks mode）和标准模式（standards mode）。前者让 IE 像 IE5 一样（支持一些非标准的特性）， 后者让 IE 具有兼容标准的行为。虽然这两种模式的主要区别只体现在通过 CSS 渲染的内容方面，但对 JavaScript 也有一些关联影响，或称为副作用。
>
> IE 初次支持文档模式切换以后，其他浏览器也跟着实现了。随着浏览器的普遍实现，又出现了第三 种文档模式：准标准模式（almost standards mode）。这种模式下的浏览器支持很多标准的特性，但是没 有标准规定得那么严格。主要区别在于如何对待图片元素周围的空白（在表格中使用图片时最明显）。
>
> 混杂模式在所有浏览器中都以省略文档开头的 doctype 声明作为开关。这种约定并不合理，因为 混杂模式在不同浏览器中的差异非常大，不使用黑科技基本上就没有浏览器一致性可言。
>
> 标准模式通过下列几种文档类型声明开启：
>
> ```html
> <!-- HTML 4.01 Strict -->
> <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
> "http://www.w3.org/TR/html4/strict.dtd">
> 
> <!-- XHTML 1.0 Strict -->
> <!DOCTYPE html PUBLIC
> "-//W3C//DTD XHTML 1.0 Strict//EN"
> "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
> 
> <!-- HTML5 -->
> <!DOCTYPE html> 
> ```
>
> 准标准模式通过过渡性文档类型（Transitional）和框架集文档类型（Frameset）来触发：
>
> ```html
> <!-- HTML 4.01 Transitional -->
> <!DOCTYPE HTML PUBLIC
> "-//W3C//DTD HTML 4.01 Transitional//EN"
> "http://www.w3.org/TR/html4/loose.dtd">
> 
> <!-- HTML 4.01 Frameset -->
> <!DOCTYPE HTML PUBLIC
> "-//W3C//DTD HTML 4.01 Frameset//EN"
> "http://www.w3.org/TR/html4/frameset.dtd">
> 
> <!-- XHTML 1.0 Transitional -->
> <!DOCTYPE html PUBLIC
> "-//W3C//DTD XHTML 1.0 Transitional//EN"
> "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
> 
> <!-- XHTML 1.0 Frameset -->
> <!DOCTYPE html PUBLIC
> "-//W3C//DTD XHTML 1.0 Frameset//EN"
> "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
> ```
>
> 
>
> 准标准模式与标准模式非常接近，很少需要区分。人们在说到“标准模式”时，可能指其中任何一个。而对文档模式的检测也不会区分它们。
