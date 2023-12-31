- 关注技术细节
- 设计思想
- 框架的设计权衡
- 理解一些具体实现为什么选择这种方案



- vue3继承了vue2的易用性，同时使用了更少的代码实现了更多的功能。vue3在模块拆分和设计上非常合理，模块之间的耦合程度非常低，大多数模块可以独立安装使用，而不需要借助完整的vuejs运行时。
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

以全局视角，审视视图层框架的设计问题，不然容易困在细节中而看不清全貌和整体的方向。



### 声明式和命令式

声明式和命令式是视图层框架常采用的两种编程范式。

**命令式框架**

jQuery就是典型的命令时框架，命令式框架的一大特点就是——**关注过程**。代码本身描述的就是做事的过程，符合一般人的行为逻辑。

**声明式框架**

声明式框架的一大特点就是——**关注结果**。框架帮助开发者封装了过程，框架的内部实现还是依赖的命令式代码，只是将声明式的写法暴露给开发者。



**vue是基于什么目的选择了声明式**

**在框架层面，主要是出于对性能与可维护性之间的权衡。**



**声明式代码的性能不一定由于命令式代码。**

例子：将 div 标签的文本内容由hello world 修改为 hello vue3。

命令式代码明确知道要修改的是什么，所以直接调用相关命令操作即可： div.textContent = 'hello vue3' // 直接修改。理论上命令式代码可以做到极致的性能优 化，因为明确知道哪些发生了变更，只做必要的修改就行了。

声明式代码不一定能做到这一点，因为它描述的是结果：

```vue
<!-- 之前： -->
<div @click="() => alert('ok')">hello world</div>
<!-- 之后： -->
<div @click="() => alert('ok')">hello vue3</div>
```

对于框架来说，为了实现最优的更新性能，它需要找到前后的差 异并只更新变化的地方，但是最终完成这次更新的代码仍然是：div.textContent = 'hello vue3'

如果我们把直接修改的性能消耗定义为 A，把找出差异的性能消 耗定义为 B，那么有： 

- 命令式代码的更新性能消耗 = A 
- 声明式代码的更新性能消耗 = B + A

框架本身就是封装了命令式代码才实现了面向用户的声明式。



从性能角度，声明式性能不及命令式。但是vue选择了声明式方案，**原因就在于声明式代码的可维护性更强。**

在采用命令式代码开发的时候，我需要维护实现目标的整个过程，包括要手动完成 DOM 元素的创建、更新、删除等工作。而声明式代码展示的就是要的结果，看上去更加直观，至于做事的过程，并不需要关心，Vue.js 封装好了。



### 虚拟DOM

为什么需要虚拟DOM？

前面说过，声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗，因此，如果能够最小化找出差异的性能消耗，就可以让声明式代码的性能无限接近命令式代码的性能。**虚拟 DOM，就是为了最小化找出差异这一步的性能消耗而出现的。**

**理论上**基于虚拟DOM的更新不可能比原生JavaScript操作DOM更高效。之所以说理论上，因为在大部分情况 下，很难写出绝对优化的命令式代码，尤其是当应用程序的规模很大的时候，即使写出了极致优化的代码，也一定耗费了巨大的精 力，这时的投入产出比其实并不高。

虚拟DOM的引入，能在开发体验和应用性能上取得一个不错的平衡效果。



**innerHTML和虚拟DOM的性能对比：**



**创建页面时的性能对比：**

innerHTML创建、更新页面的过程，对于 innerHTML 来说， 为了创建页面，我们需要构造一段 HTML 字符串，接着将该字符串赋值给 DOM 元素的 innerHTML 属性：

```js
const html = `
<div><span>...</span></div>
`

div.innerHTML = html
```

为了渲染出页面，首先要把字符串解析成 DOM 树，这是一个 DOM 层面的计算。涉及 DOM 的运算要远比 JavaScript 层面的计算性能差，这有一个跑分结果可供参考，如图。

![image-20231228103230870](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228103230870.png)

上边是纯 JavaScript 层面的计算，循环 10000 次，每次创建一个 JavaScript 对象（虚拟DOM对象）并将其添加到数组中；下边是 DOM 操作， 每次创建一个 DOM 元素并将其添加到页面中。跑分结果显示，纯 JavaScript 层面的操作要比 DOM 操作快得多，它们不在一个数量级上。

可以用一个公式来表达通过 **innerHTML 创建页面的性能：HTML 字符串拼接的计算量 + innerHTML 的 DOM 计算量。**





虚拟 DOM 创建、更新页面的过程，虚拟 DOM 创 建页面的过程分为两步：

- 第一步是创建 JavaScript 对象，这个对象可以理解为真实 DOM 的描述；
- 第二步是递归地遍历虚拟 DOM 树并创建真实 DOM。

同样可以用一个公式来表达 **虚拟DOM创建页面的性能：创建 JavaScript 对象的计算量 + 创建真实 DOM 的计算量。**



innerHTML 和虚拟 DOM 在**创建页面时**的性能：

![image-20231228103717384](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228103717384.png)

可以看到，无论是纯 JavaScript 层面的计算，还是 DOM 层面的计 算，其实两者差距不大。这里从宏观的角度只看数量级上的差 异。如果在同一个数量级，则认为没有差异。在创建页面的时候，都 需要新建所有 DOM 元素。



**更新页面时的性能对比：**

使用 innerHTML 更新页面的过程是重新构建 HTML 字符串， 再重新设置 DOM 元素的 innerHTML 属性，哪怕只更改了一个文字，也要重新设置 innerHTML 属性。而重新设置 innerHTML 属性就等价于销毁所有旧的 DOM 元素，再全量创建新 的 DOM 元素。

使用虚拟 DOM 更新页面，它需要重新创建 JavaScript 对象（虚拟 DOM 树），然后比较新旧虚拟 DOM，找到变化的元素并更新它。

![image-20231228104101281](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228104101281.png)

在更新页面时，虚拟 DOM 在 JavaScript 层面的运算要**比创建页面时**多出一个 Diff 的性能消耗，然而它毕竟也是 JavaScript 层面的运算，所以不会产生数量级的差异。

再观察 DOM 层面的运算，可以发现虚拟 DOM 在更新页面时只会更新必要的元素，但 innerHTML 需要全量更新。**这时虚拟 DOM 的优势就体现出来了**。

另外，当更新页面时，影响虚拟 DOM 的性能因素与影响 innerHTML 的性能因素不同。对于虚拟 DOM 来说，无论页面多 大，都只会更新变化的内容，而对于 innerHTML 来说，页面越大， 就意味着更新时的性能消耗越大。如果加上性能因素，那么最终它们 在更新页面时的性能如图所示。

![image-20231228104341810](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228104341810.png)



**对比结论：**

粗略地总结一下 innerHTML、虚拟 DOM 以及 原生 JavaScript（指 createElement 等方法）在**更新页面时**的性能

![image-20231228104435412](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228104435412.png)

原生 DOM 操作方法的心智负担最大，因为要手动创建、删除、修改大量的 DOM 元素。但它的性能是最高的，不过为了使其性能最佳，要承受巨大的心智负担。另外，以这种方式编写的代码，可维护性也极差。

对于 innerHTML 来说，由于编写页面的过程有一部分是通过拼接 HTML 字符串来实现的，但 是拼接字符串总归也是有一定心智负担的，而且对于事件绑定之类的事情，还是要使用原生 JavaScript 来处理。如果 innerHTML 模板很大，则其更新页面的性能最差，尤其是在只有少量更新时。

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
    tag: 'div',
    children: [
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

![image-20231228125036439](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228125036439.png)

为此，编写了一个叫作 Compiler 的程序，它的作用就是把 HTML 字符串编译成树型结构的数据对象，于是交付给用户去用了。 那么用户该怎么用呢？最简单的方式就是让用户分别调用 Compiler 函数和 Render 函数：

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

这时框架就变成了一个运行时 + 编译时的框架。它既支持运行时，用户可以直接提供数据对象从而无须编译；又支持编译时，用户可以提供 HTML 字符串，将其编译为数据对象后再交给运行时处理。准确地说，上面的代码其实是**运行时编译**，意思是代码运行的时候才开始编译，而这会产生一定 的性能开销，因此我们也可以在构建的时候就执行 Compiler 程序将 用户提供的内容编译好，等到运行时就无须编译了，这对性能友好。



**纯编译时**

既然编译器可以把 HTML 字符串编译成数据对象，那么能不能直接编译成命令式代码。

![image-20231228125841104](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231228125841104.png)



这样只需要一个 Compiler 函数就可以了，连 Render 都不需要了。其实这就变成了一个纯编译时的框架，因为不支持任何运行时内容，用户的代码通过编译器编译后才能运行。 

一个框架既可以是纯运行时的，也可以是 纯编译时的，还可以是既支持运行时又支持编译时的。那么，它们都有哪些优缺点呢？是不是既支持运行时又支持编译时的框架最好呢？ 



**三者的对比**

纯运行时的框架由于没有编译的过程，因此没办法分析用户提供的内容，但是如果加入编译步骤，就可以分析用户提供的内容，看看哪些内容未来可能会改变， 哪些内容永远不会改变，这样就可以在编译的时候提取这些信 息，然后将其传递给 Render 函数，Render 函数得到这些信息之 后，就可以做进一步的优化了。

假如设计的框架是纯编译时的，那么它也可以分析用户提供的内容。由于不需要任何运行时， 而是直接编译成可执行的 JavaScript 代码，因此性能可能会更好，但是这种做法有损灵活性，即用户提供的内容必须编译后才能用。

在这三个方向上业内都有探索，其中 Svelte 就是纯编译时的框架，但是它的真实性能可能达不到理论高度。Vue.js 3 仍然保持了运行时 + 编译时的架构，在保持灵活性的基础上能够尽可能地去优化。





## 第二章

框架设计的关注点：

1. 框架的核心功能代码实现
2. 框架能提供的构建产物
3. 构建产物的模块格式
4. 错误或者不规范使用框架的时的报错提示与警告提示
5. 生产构建和开发构建的区别
6. 是否支持热更新等
7. 是否能实现按需加载和打包



### 开发体验

1. 友好的警告信息
2. 自定义控制台输出格式



### 框架库体积

提供尽量多的警告信息和缩小代码库的体积是存在一定冲突的。为此，vue3中引入了`__DEV__`

如果去看 Vue.js 3 的源码，就会发现每一个 warn 函数的调用 都会配合 `__DEV__ `常量的检查，例如：

```js
if (__DEV__ && !res) {
    warn(
        `Failed to mount app: mount target selector "${container}"
returned null.`
    )
}
```

Vue.js 使用 rollup.js 对项目进行构建，这里的` __DEV__ `常量实际 上是通过 rollup.js 的插件配置来预定义的，其功能类似于 webpack 中的 DefinePlugin 插件。

Vue.js 在输出资源的时候，会输出两个版本，其中一个用于开发环 境，另一个用于生产环境，当 Vue.js 构建用于开发环境的资源时，会把` __DEV__ `常量设置为 true，所以 这段代码在开发环境中是肯定存在的。

当 Vue.js 用于构建生产环境的资源时，会把` __DEV__ `常量设置为 false，这时这段分支代码永远都不会执行，因为判断条件始终为假，这段永远不会 执行的代码称为 dead code，它不会出现在最终产物中，在构建资源的时候就会被移除。

这样就做到了在开发环境中为用户提供友好的警告信息的 同时，不会增加生产环境代码的体积。



### Tree-Shaking

Vue.js 内建了很 多组件，例如Transition组件，如果项目中根本就没有用到该组件，那么它的代码不需要包含在项目最终的构建资源中。

Tree-Shaking 指的就是消除那些永远不会被执行的代 码，也就是排除 dead code，现在无论是 rollup.js 还是 webpack，都支持 Tree-Shaking。想要实现 Tree-Shaking，必须满足一个条件，即模块必须是 ESM（ES Module），因为 Tree-Shaking 依赖 ESM 的静态结构。

如果一个 函数调用会产生副作用，那么就不能将其移除。

因为静态地分析 JavaScript 代码很困难，所以像 rollup.js 这类工具 都会提供一个机制，明确地告诉 rollup.js 一段代 码不会产生副作用，你可以移除它。

```js
import {foo} from './utils'
/*#__PURE__*/ foo()
```

注意注释代码 `/*#__PURE__*/`，其作用就是告诉 rollup.js，对于 foo 函数的调用不会产生副作用，可以放心地对其进行 TreeShaking。

webpack 以及压缩工具（如 terser）都能识别它。



### 构建产物

Vue.js 的 构建产物除了有环境上的区分之外，还会根据使用场景的不同而输出 其他形式的产物。

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

在 rollup.js 中，我们可以通过配置 format: 'iife' 来输出这种 形式的资源：

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



在 Node.js 中通过 require 语句引用资源。当进行服务端渲 染时，Vue.js 的代码是在 Node.js 环境中运行的，而非浏览器环境。在 Node.js 环境中，资源的模块格式应该是 CommonJS，简称 cjs。为了能 够输出 cjs 模块的资源，可以通过修改 rollup.config.js 的配置 format: 'cjs' 来实现。





### 特性开关

在设计框架时，框架会给用户提供诸多特性（或功能），例如提供 A、B、C 三个特性给用户，同时还提供了 a、b、c 三个对应的 特性开关，用户可以通过设置 a、b、c 为 true 或 false 来代表开启或关闭对应的特性。优势：

- 对于用户关闭的特性，可以利用 Tree-Shaking 机制让其不包 含在最终的资源中。
- 该机制为框架设计带来了灵活性，可以通过特性开关任意为框架添加新的特性，而不用担心资源体积变大。同时，当框架升级 时，也可以通过特性开关来支持遗留 API，这样新用户可以选择不使用遗留 API，从而使最终打包的资源体积最小化。

vue3中实现特性开关：

- 本质是使用rollup.js的预定义常量插件来实现

  

  

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

但是这会增加用户的负担。如果 utils.js 不是仅仅提供 了一个 foo 函数，而是提供了几十上百个类似的函数，那么用户在使 用的时候就需要逐一添加错误处理程序。



第二个办法是我代替用户统一处理错误，如以下代码所示：

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

实际上，这就是 Vue.js 错误处理的原理，可以在源码中搜索到 callWithErrorHandling 函数。另外，在 Vue.js 中，也可以注 册统一的错误处理函数：

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

 使用 JavaScript 对象描述 UI 更加灵活。举个例子，假如要表示一 个标题，根据标题级别的不同，会分别采用 h1~h6 这几个标签，如果 用 JavaScript 对象来描述，只需要使用一个变量来代表 h 标签即可：

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

所以 h 函数就 是一个辅助创建虚拟 DOM 的工具函数。 一个组件要渲染的内容是通过渲染 函数来描述的，也就是上面代码中的 render 函数，Vue.js 会根据组件 的 render 函数的返回值拿到虚拟 DOM，然后就可以把组件的内容渲 染出来了。



### 渲染器

虚拟 DOM其实就是用 JavaScript 对象来描述真实的 DOM 结构。

虚拟 DOM 是如何变成真实 DOM 并渲染到浏览器页面中的——渲染器。

渲染器的作用就是把虚拟 DOM 渲染为真实 DOM。



基于虚拟DOM实现一个渲染器：'

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
                key.substr(2).toLowerCase(), // 事件名称 onClick --->
                ick
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
3. 处理 children：如果 children 是一个数组，就递归地调用 renderer 继续渲染，注意，此时要把刚刚创建的元素作为挂载点（父节点）；如果 children 是字符串，则使用 createTextNode 函数创建一个文本节点，并将其添加到新创建 的元素内。

上面的渲染器实现只是创建节点，渲染器的精髓都在更新节点的阶段。对于渲染器来说，它需要精确地找到 vnode 对象的变更点并且只更新变更的内容。就上例来说，渲染器应该只更新元素的文本内容， 而不需要再走一遍完整的创建元素的流程。



### 组件

组件的本质是什么？组件和虚拟 DOM 有什 么关系？渲染器如何渲染组件？

其实虚拟 DOM 除了能够描述真实 DOM 之外，还能够描述组件。组件并不是真实的 DOM 元素，那么如何使用虚拟 DOM 来描述呢？



#### 函数表示组件

组件就是一 组 DOM 元素的封装，这组 DOM 元素就是组件要渲染的内容，因此可以定义一个函数来代表组件，而函数的返回值就代表组件要渲染的内容：

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

可以定义用虚拟 DOM 来描述组件 了。可以让虚拟 DOM 对象中的 tag 属性来存储组件函数：

```js
const vnode = {
    tag: MyComponent
}
```

就像 tag: 'div' 用来描述 标签一样，tag: MyComponent 用来描述组件，只不过此时的 tag 属性不是标签名称，而是组件**函数**。为了能够渲染组件，需要渲染器的支持。修改前面提到的 renderer 函数，如下所示：

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

为了完成组件的渲染，我 们需要修改 renderer 渲染器以及 mountComponent 函数。

修改渲染器的判断条件：

```js
function renderer(vnode, container) {
    if (typeof vnode.tag === 'string') {
        mountElement(vnode, container)
    } else if (typeof vnode.tag === 'object') { // 如果是对象，说明
        ode 描述的是组件
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

**其实 Vue.js 中的有状态组件就是使用对象结构来表达 的。**



### 模板的工作原理

上文讲解了虚拟 DOM 是如何渲染成真实 DOM 的。

那模板是如何工作的呢？这就要提到 Vue.js 框架中的另外一个重要组成部分：编译器。

编译器和渲染器一样，只是一段程序而已，不过它们的工作内容不同。编译器的作用其实就是将模板编译为渲染函数，例如给出如下模板：

```vue
<div @click="handler">
    click me
</div>
```

对于编译器来说，模板就是一个普通的字符串，它会分析该字符 串并生成一个功能与之相同的渲染函数：

```js
render() {
    return h('div', { onClick: handler }, 'click me')
}
```

以 .vue 文件为例，一个 .vue 文件就是一个组件，如下 所示：

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

所以，无论是使用模板还是直接手写渲染函数，对于一个组件来 说，它要渲染的内容最终都是通过渲染函数产生的，然后渲染器再把 渲染函数返回的虚拟 DOM 渲染为真实 DOM，这就是模板的工作原 理，也是 Vue.js 渲染页面的流程。



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

在这段代码中，cls 是一个变量，它可能会发生变 化。渲染器的作用之一就是寻找并且只更新变化的内容，所以当变量 cls 的值发生变化时，渲染器会自行寻找变更点。对于渲染器来说，这个“寻找”的过程需要花费一些力气。

从编译器的视角来看，它能否知道哪些内容会发生变化呢？如果编译器有能力分析动态内容，并在编译阶段把这些信息提取出来，然后直接交给渲染器， 这样渲染器不就不需要花费大力气去寻找变更点了吗？这是个好想法并且能够实现。

Vue.js 的模板是有特点的，拿上面的模板来说，我们一眼就能看出其中 id="foo" 是永远不会变化的，而 :class="cls" 是一个 v-bind 绑定，它是可能发生变化的。所以编译器能识别出哪 些是静态属性，哪些是动态属性，在生成代码的时候完全可以附带这些信息：

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

通过这个例子，了解到编译器和渲染器之间是存在信息交流的，它们互相配合使得性能进一步提升，而它们之间交流的媒介就是 虚拟 DOM 对象。后面，会看到一个虚拟 DOM 对象中会包含多种数据字段，每个字段都代表一定的含义。

**虚拟 DOM 要比模板更加灵活，但模板要 比虚拟 DOM 更加直观。**

渲染器的作用是，把虚拟 DOM 对象渲染为真实 DOM 元素。它的工作原理是，递归地遍历虚拟 DOM 对象，并调用原生 DOM API 来完成真实 DOM 的创建。渲染器的精髓在于后续的更新，它会通过 Diff 算法找出变更点，并且只会更新需要更新的内容。

组件其实就是一组虚拟 DOM 元素 的封装，它可以是一个返回虚拟 DOM 的函数，也可以是一个对象，但 这个对象下必须要有一个函数用来产出组件要渲染的虚拟 DOM。

渲染 器在渲染组件时，会先获取组件要渲染的内容，即执行组件的渲染函 数并得到其返回值，我们称之为 subtree，最后再递归地调用渲染器 将 subtree 渲染出来即可。



## 第四章

- 响应式数据和副作用函数
- 避免无限递归
- 嵌套的副作用函数
- 副作用函数之间的影响
- proxy实现响应式数据
- 响应式系统的设计与实现



### 响应式数据

假设在 一个副作用函数中读取了某个对象的属性：

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

如果能实现这个目标，那么对象 obj 就是响应式数据。以上面的代码来看，还做不到这一点，因 为 obj 是一个普通对象，当修改它的值时，除了值本身发生变化之外，不会有任何其他反应。



**响应式数据的基本实现**

通过观察能发现两点线索： 

- 当副作用函数 effect **执行时**，会触发字段 obj.text 的读取操作； 
- 当修改 obj.text 的值时，会触发字段 obj.text 的设置操作。

如果能拦截一个对象的读取和设置操作，当读取字段 obj.text 时，可以把副作用函数 effect 存储起来。当设置 obj.text 时，再把副作用函数 effect 取出并执行即可，

现在问题的关键变成了如何才能拦截一个对象属性的读取和设置操作。在 ES2015 之前，只能通过 Object.defineProperty 函数实现，这是 Vue.js 2 所采用的方式。在 ES2015+ 中，可以使 用代理对象 Proxy 来实现，这是 Vue.js 3 所采用的方式。

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



如上面的代码所示，由于副作用函数已经存储到了 activeEffect 中，所以在 get 拦截函数内应该把 activeEffect 收集，这样响应系统就不依赖副作用函数的名字了。



如果我们再对这个系统稍加测试，例如在响应式数据 obj 上设 置一个不存在的属性时：

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

在匿名副作用函数内并没有读取 obj.notExist 属性 的值，所以理论上，字段 obj.notExist 并没有与副作用建立响应联 系，因此，定时器内语句的执行不应该触发匿名副作用函数重新执 行。但如果执行上述这段代码就会发现，定时器到时后，匿名副作用函数却重新执行了，这是不正确的。



**再次改进**

导致该问题的根本原因是，**没有在副作用函数与被操作的目标字段之间建立明确的联系**。

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

其中 WeakMap 的键是原始对象 target，WeakMap 的值是一个 Map 实例，而 Map 的键是原始对象 target 的 key，Map 的值是一个 由副作用函数组成的 Set。它们的关系如图：

![image-20231229203805607](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231229203805607.png)



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

![image-20231229212010582](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231229212010582.png)

副作用函数 effectFn 分别被字段 data.ok 和字段 data.text 所对应的依赖集合收集。当字段 obj.ok 的值修改为 false，并触发副作用函数重新执行后，由于此时字段 obj.text 不 会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集。如下图：

![image-20231229212131253](C:\Users\dukkha\Desktop\learn-notes\vue\images\image-20231229212131253.png)

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

**解决办法：每次副作用函数执行之前，可以先把它从所有与之关联的依赖集合中删除。**

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

**在调用 forEach 遍历 Set 集合 时，如果一个值已经被访问过了，但该值被删除并重新添加到集合， 如果此时 forEach 遍历没有结束，那么该值会重新被访问。**

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

什么场景下会 出现嵌套的 effect ? Vue.js 的渲染函数就 是在一个 effect 中执行的：

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

希望当修改 obj.foo 时会触发 effectFn1 执行。由于 effectFn2 嵌套在 effectFn1 里，所以会间接触发 effectFn2 执行，而当修改 obj.bar 时，**只**会触发 effectFn2 执 行。

当尝试修改 obj.foo 的值，会发现输出为：

```js
初始执行:
'effectFn1 执行'
'effectFn2 执行'

修改 obj.foo 的值:
'effectFn2 执行'
```

修改了字段 obj.foo 的值，发现 effectFn1 并没有重 新执行，反而使得 effectFn2 重新执行了，这不符合预期。

出现上述问题的原因：全局变量 activeEffect 来存储通过 effect 函数注册的 副作用函数，这意味着同一时刻 activeEffect 所存储的副作用函数 只能有一个。当副作用函数发生嵌套时，内层副作用函数的执行会覆 盖 activeEffect 的值，并且永远不会恢复到原来的值。这时如果再 有响应式数据进行依赖收集，即使这个响应式数据是在外层副作用函 数中读取的，它们收集到的副作用函数也都会是内层副作用函数。

解决办法：维护一个副作用函数栈 effectStack， 在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执 行完毕后将其从栈中弹出，并始终让 activeEffect 指向栈顶的副作用函数。

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

在这个语句中，既会读取 obj.foo 的值，又会设置 obj.foo 的 值，而这就是导致问题的根本原因。可以尝试推理一下代码的执 行流程：首先读取 obj.foo 的值，这会触发 track 操作，将当前副作用函数收集到“桶”中，接着将其加 1 后再赋值给 obj.foo，此时会触发 trigger 操作，即把“桶”中的副作用函数取出并执行。但问题是该副作用函数正在执行中，还没有执行完毕，就要开始下一次的执 行。这样会导致无限递归地调用自己，于是就产生了栈溢出。

解决办法：通过分析这个问题能够发现，读取和设置 操作是在同一个副作用函数内进行的。此时无论是 track 时收集的副 作用函数，还是 trigger 时要触发执行的副作用函数，都是 activeEffect。基于此，可以在 trigger 动作发生时增加守卫条件：如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行，如以下代码所示：

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

有了调度函数，我们在 trigger 函数中触发副作用函数重新执行 时，就可以直接调用用户传递的调度器函数，从而把控制权交给用 户：

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

在副作用函数中打印 obj.foo 的值，接着连续对其执行两次 自增操作，在没有指定调度器的情况下，它的输出：1  2  3。

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

前面实现的 effect 函数会立即执行传递给它的副作用函数，但在有些场景下，并不希望它立即执行，而是希望它在需要 的时候才执行，例如计算属性。这时可以通过在 options 中添加 lazy 属性来达到目的。

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

这是因为，当第一次访问 sumRes.value 的值后，变量 dirty 会设置为 false，代表不需要计算。即使我们修改了 obj.foo 的 值，但只要 dirty 的值为 false，就不会重新计算，所以导致我们得 到了错误的值。

解决办法很简单，当 obj.foo 或 obj.bar 的值发生变化时，只 要 dirty 的值重置为 true 就可以了。那么应该怎么做呢？这时就用到了 scheduler 选项，如以下代码所示：

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

sumRes 是一个计算属性，并且在另一个 effect 的副作用函数中读取了 sumRes.value 的值。如果此时修改 obj.foo 的值，我们期望副作用函数重新执行，就像我们在 Vue.js 的 模板中读取计算属性值的时候，一旦计算属性发生变化就会触发重新渲染一样。但是如果尝试运行上面这段代码，会发现修改 obj.foo 的 值并不会触发副作用函数的渲染。

从本质上看这就是一个典型的 effect 嵌套。一个计算属性内部拥有自己的 effect，并且它是懒执 行的，只有当真正读取计算属性的值时才会执行。对于计算属性的 getter 函数来说，它里面访问的响应式数据只会把 computed 内部 的 effect 收集为依赖。而当把计算属性用于另外一个 effect 时， 就会发生 effect 嵌套，外层的 effect 不会被内层 effect 中的响 应式数据收集。

解决办法：当读取计算属性的值时，我们可以手动调用 track 函数进行追踪；当计算属性依赖的响应式数据发生变化时，我 们可以手动调用 trigger 函数触发响应：

```js
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

上面这段代码能正常工作，但是注意到在 watch 函数的实现中，硬编码了对 source.foo 的读取操作。换句话说，现在只能观测 obj.foo 的改变。为了让 watch 函数具有通用性，需要一个封装一个通用的读取操作：

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

在 watch 内部的 effect 中调用 traverse 函数进行递归的读取操作，触发响应式数据中各个属性的getter函数，代替硬编码的方式，这样就能读取一个对 象上的任意属性，从而当任意属性发生变化时都能够触发回调函数执行。



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

默认情况下，一个 watch 的回调只会在响应式数据发生变化时才执行。在 Vue.js 中可以通过选项参数 immediate 来指定回调是否需要立即执行。

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

除了指定回调函数为立即执行之外，还可以通过其他选项参数来 指定回调函数的执行时机，例如在 Vue.js 3 中使用 flush 选项来指 定：

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

由于请求 B 是后发送的，因此认为请求 B 返回的数据才是 “最新”的，而请求 A 则应该被视为“过期”的，所以希望变量 finalData 存储的值应该是由请求 B 返回的结果，而非请求 A 返回 的结果。

请求 A 是副作用函 数第一次执行所产生的副作用，请求 B 是副作用函数第二次执行所产 生的副作用。由于请求 B 后发生，所以请求 B 的结果应该被视为“最 新”的，而请求 A 已经“过期”了，其产生的结果应被视为无效。通过这 种方式，就可以避免竞态问题导致的错误结果。

归根结底，需要的是一个让副作用过期的手段。为了让问题 更加清晰，先拿 Vue.js 中的 watch 函数来复现场景，看看 Vue.js 是如何帮助开发者解决这个问题的，然后尝试实现这个功能。

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

换句话说，onInvalidate 的原理 是什么呢？在 watch 内部每次检测到变更后，在副作用 函数重新执行之前，会先调用通过 onInvalidate 函数注册的过期回调，仅此而已，如以下代码所示：

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

一个函数也是一个对 象，所以调用函数也是对一个对象的基本操作。可以用 Proxy 来拦截函数的调用操作，这里使用 apply 拦截函数的调用：

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

调用一个对象下的方法，是由两个基本语义组成的。第 一个基本语义是 get，即先通过 get 操作得到 obj.fn 属性。第二个基本语义是函数调用，即通过 get 得到 obj.fn 的值后再调用它，也就是上面说到的apply。



### Reflect

Reflect 是一个全局 对象，其下有许多方法，例如：

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
| [[Call]]              | (any, a List of any) → any                        | 将运行的代码与 this 对象关联。由函数调用触发。该内部 方法的参数是一个 this 值和参数列表 |
| [[Construct]]         | (a List of any, Object) → Object                  | 创建一个对象。通过 new 运算符或 super 调用触发。该内 部方法的第一个参数是一个 List，该 List 的元素是构造 函数调用或 super 调用的参数，第二个参数是最初应用 new 运算符的对象。实现该内部方法的对象称为构造函数 |

如果一个对象需要作为函数调用，那么这个对象就必须部署内部方法 [[Call]]。现在就可以回答前面的问题了：如何区分一个 对象是普通对象还是函数呢？一个对象在什么情况下才能作为函数调用呢？答案是，通过内部方法和内部槽来区分对象，例如函数对象会部署内部方法 [[Call]]，而普通对象则不会。

内部方法具有多态性，这类似于面向对象里多态的概念。这就是说，不同类型的对象可能部署了相同的内部方法， 却具有不同的逻辑。例如，普通对象和 Proxy 对象都部署了 [[Get]] 这个内部方法，但它们的逻辑是不同的，普通对象部署的 [[Get]] 内部方法的逻辑是由 ECMA 规范的 10.1.8 节定义的，而 Proxy 对象部署的 [[Get]] 内部方法的逻辑是由 ECMA 规范的 10.5.8 节来定义的。

了解了内部方法，就可以解释什么是常规对象，什么是异质对象了。满足以下三点要求的对象就是常规对象：

- 对于上面列出的内部方法，必须使用 ECMA 规范 10.1.x 节给出 的定义实现； 
- 对于内部方法 [[Call]]，必须使用 ECMA 规范 10.2.1 节给出的 定义实现； 
- 对于内部方法 [[Construct]]，必须使用 ECMA 规范 10.2.2 节 给出的定义实现。

所有不符合这三点要求的对象都是异质对象。Proxy 对象的内部方法 [[Get]] 没有使用 ECMA 规范的 10.1.8 节给 出的定义实现，所以 Proxy 是一个异质对象。

通过代理对象访问属性值时：引擎会调用部署在对象 p 上的内部方法 [[Get]]。到这 一步，其实代理对象和普通对象没有太大区别。它们的区别在于对于 内部方法 [[Get]] 的实现，这里就体现了内部方法的多态性，即不同 的对象部署相同的内部方法，但它们的行为可能不同。具体的不同体 现在，如果在创建代理对象时没有指定对应的拦截函数，例如没有指 定 get() 拦截函数，那么当我们通过代理对象访问属性值时，代理对 象的内部方法 [[Get]] 会调用原始对象的内部方法 [[Get]] 来获取 属性值，这其实就是代理透明性质。

创建代理对象时指定的拦截函数，实际上是用来自定义代理对象本身的内部方法和行为的，而不是用来指定 被代理对象的内部方法和行为的。

下面列出了 Proxy 对象部署的所 有内部方法以及用来自定义内部方法和行为的拦截函数名字：

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

其中 [[Call]] 和 [[Construct]] 这两个内部方法只有 当被代理的对象是函数和构造函数时才会部署。

当我们要拦截删除属性操作时，可以使用 deleteProperty 拦截函数实现：

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

















### Proxy 的工作原理





























































