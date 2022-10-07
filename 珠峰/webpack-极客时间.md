多种构建场景：

- 多页面打包

- SSR
- PWA

- Prerender

多种构建策略：

- 多实例构建
- 并行压缩
- 公共资源分包
- tree shaking
- 动态 polyfill

webpack 构建打包速度，打包后文件体积优化，前端工作流，团队开发规范实施

使用 webpack 的原因：是因为软件的应用场景和开发方式不断变化。web 前端开发由传统的 pc 端页面开发转为多种终端的开发，所以需要在开发过程中同时考虑兼容性，pc，h5 等不同终端的开发。

针对不同的应用场景做不同的打包。pc 中后台重点在支持单页面应用的打包构建；h5 页面通常对性能和可访问性要求高，构建时需要考虑支持服务端渲染和 PWA 离线缓存；

项目开发中使用众多的 node.js 生态中的第三方模块，而这些模块无法直接运行在浏览器端直接引入使用，需要借助构建工具

三大框架都基于 webpack 进行转换后在浏览器端才能运行

熟悉 webpack 的使用和原理

发现页面打包的速度缺陷和资源体积问题并进行优化

熟悉原理有助于跨端开发其他应用

webpack 的打包理念：一切皆为模块。在 webpack 中不仅仅 js 是模块，其他 html，css，图片和字体等都可以被视为模块。

webpack 配置异常灵活，具备强大的插件扩展能力。

## 基本概念和日常开发的实用技巧

webpack 核心概念和开发技巧

- 构建工具发展史
- entry，output，mode，loader，plugin
- webapck 资源解析，文件压缩，文件指纹，热更新
- tree shaking，code split，多页面打包，Prerender，PWA，首屏渲染

### 构建工具发展史

使用 webpack 的必要性：

- 转换 ES6 语法
- 转换 jsx
- css 预处理器
- 代码压缩和混淆
- 资源压缩

早期编写前端代码是没法压缩，代码逻辑容易暴露。当时是找一些在线工具丑化压缩源代码后下载，过程繁琐。后来使用 ant+YUI Tool 丑化压缩。之后业界 requireJS，sea.js 模块概念的发展，前端开始模块化编写代码，由此演变出 grunt（将构建过程分为一个个的任务，每个任务处理一件事，打包过程分为解析 css，html，js，图片，压缩，文件指纹等都是一个个任务），任务处理完成后，在本地生成打包结果的文件，涉及 io 比较耗时，由此发展出 gulp（也是一个任务驱动的打包器，但是它基于文件流，每一步构建出来的结果并不会存放在本地磁盘，而是存在内存中，然后在下一个步骤直接使用上一个步骤的内存资源，大大加速打包速度）。

![image-20220313130322206](.\typora-user-images\image-20220313130322206.png)

### 为什么选择 webpack

- 社区非常活跃
- 生态丰富
- 配置灵活，插件易扩展
- 官方更新迭代速度快

默认配置文件：webpack.config.js

通过 webpack --config 指定配置文件名字

```js
const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'./dist')
    },
    mode:'production',
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[....]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            tempalte:'./public/index.html'
        })
    ]
}
```

安装 webpack

npm init -y

webpack webpack-cli -D

webpack:4.31.0

webpack-cli:3.3.2

webpack4 以后将 webpack 内核和 webpack 的 cli 进行了分离，因此在实际项目中必须同时安装上面的两个包。

- entry

  指定项目的打包入口。

  情况：

  单入口(字符串)，一般是 SPA

  多入口（对象，key：入口，value：path），一般是多页面应用

- output

  指定将打包后的文件输出到具体的磁盘位置

  情况：

  - 单入口

    ```js
    module.exports = {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
      }
    };
    ```

  - 多入口

    ```js
    module.exports = {
      entry: {
        idnex: './src/index.js',
        main: './src/main.js'
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist')
      }
    };
    ```

- loader

webpack 原生只支持 js 和 json 两种文件类型。通过 loader 去支持其他文件类型并把它们转为有效的模块且添加到依赖图中。loader 本身是一个函数，接受源文件作为参数，返回转换后的结果，结果给下一步使用。

常用 loader：

- babel-loader:转换 ES6 语法等
- css-loader：对 css 文件进行加载和解析
- style-loader：对 css 进行包装
- less-loader：对 less 转为 css
- ts-loader：将 ts 转为 js
- file-loader：对资源文件进行打包
- url-loader：同 file-loader 一样
- rew-loader：将文件以字符串的形式导入
- thread-loader：多进程打包 js 和 css，正常情况下 webpack 打包只开一个进程，该 loader 可以让 webpack 以多进程的方式打包 js 和 css，加快打包速度。

- plugin

  增强 webpack 的能力，常用于对打包输出的 js 文件的优化，资源管理和环境变量的注入。

  常见的 plugin 有：

  - CommonsChunkPlugin：多页面打包时，将 chunks 相同的模块代码提取为公共的 js

  - CleanWebpackPlugin：清理构建目录

  - ExtractTextWebpackPlugin：将 css 提取为独立 css 文件

  - CopyWebpackPlugin：将文件或者文件夹拷贝到打包输出的目录

  - HtmlWebpackPlugin：创建 html 并自动引入打包后的文件

  - UglifyjsWebpack：压缩 js ，webpack 内置了

  - ZipWebpackPlugin：将打包的资源生成一个 zip 包

- mode

  指定当前的构建环境是 production，development 还是 none。根据 mode 的不同值，自动触发 webpack 内置的函数

![image-20220313150356340](.\typora-user-images\image-20220313150356340.png)

- babel-loader

  npm install @babel/core @babel/preset-env babel-loader -D

  babel/core：7.4.4

  babel/preset-env：7.4.4

  babel-loader:8.0.5

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            use: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      tempalte: './public/index.html'
    })
  ]
};
```

babel 支持 React

npm install @babel/preset-react -D

babel 的配置文件——babelconfig.js（有多种命名方式）:

```js
module.exports = {
    preset:[   // 一个preset是一些列plugin的集合
        "@babel/preset-env",
+       "@babel/preset-react"
    ],
    plugins:[   /// 一个plugins对应一个功能
        @babel/proposal-class-properties
    ]
}
```

- webpack 种的文件监听

轮询判断文件的最后编辑时间是否变化。

```json
"script":{
    "build":"webpack --watch"
}
```

或者

```
module.export={
	watch:true,  // 默认值是false，标识不开启文件监听
	watchOptions:{
		ignored:/node_modules/,   // 默认值为空，标识不监听的文件夹或者文件，支持正则
		aggregateTieout:300,  // 监听到变化后会等300ms再去执行，默认300ms，类似防抖
		poll:1000  // 判断文件是否发生变化是通过不断的轮询询问系统指定文件有没有变化来实现的，默认每秒访问1000次
	}
}
```

不足：

- 每次构建完成后，需要手动刷新浏览器
- 涉及文件在磁盘上的 i/o 操作，速度慢

- webpack 的热更新

webpack-dev-server 需要使用 HotModuleReplacementPlugin 插件配合

```js
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  static: {
    directory: path.join(__dirname, 'public'), // webpack5.x 静态文件x
  },
  hot: true,
}
```

热更新原理：

- webpack Compile: 将 JS 编译成 Bundle

- HMR Server 将热更新的文件输出给 HMR Runtime

- Bundle server: 提供给文件在浏览器的访问

- HRM runtime: 会被注入到浏览器，将更新文件的变化

- bundle.js: 构建输出的文件

![image-20220711130739384](.\typora-user-images\image-20220711130739384.png)

HMR Server（服务端）和 HRM runtime（浏览器端） 的协议是 websocket 协议

启动阶段在文件系统中进行编译，将初始的代码经过 webpack 的 webpack Compile 进行打包，将编译打包好的文件传输给 Bundle Server 服务器，它可以被浏览器请求和响应。（1，2，A，B）

热更新阶段，本地文件发生变化，代码经过 webpack 的 webpack Compile 进行编译，编译好后将代码发送给 HMR Server，由 HMR Server 将变化的文件内容（一般是 json 格式）传输给 HRM runtime，HRM runtime 接收到后更新代码。

- webpack-dev-middleware

WDM 将 webpack 输出文件传给服务器， 适用于灵活的定制场景

- js 压缩

  使用 webpack 内置的插件——uglifyjs-webpack-plugin，默认打包的 js 文件就会被压缩，不用再做额外操作，也可以手动的安装这个插件，然后设置一些额外参数，比如开启并行压缩

- css 压缩

optimize-css-assets-webpack-plugin 加上 cssnano 压缩 css 代码

```js
plugins: [
  new OptimizeCssAssetPlugin({
    assetNameRegExp: /\.css$/i,
    cssProcessor: require('cssnano')
  })
];
```

- html 压缩

  ```js
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'), // 模板中可以使用ejs的语法
      filename: 'index.html',
      chunks: ['index'], // 标识生成html要使用哪些打包生成的chunk
      inject: true, //打包后的资源自动注入html中
      minify: {
        html5: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })
  ];
  ```

  通常一个页面需要对应一个 html-webpack-plugin 配置，如果是多个入口的项目的话，那每个入口都需要对应一个 html-webpack-plugin 配置。

- 文件指纹

  做文件缓存 。

  - hash：和整个项目的构建有关，只要项目文件有修改，整个项目构建的 hash 值就会改变
  - chunkHash：和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值（一般用于 js）
  - contentHash：根据文件内容来定义 hash。文件内容不变，则 contenthash 不变（一般用于 css）

```js
output:{
    filename:'[name]_[chunkhash:8].js',
    path
},
plugins:[
    new MiniCssExtractPlugin({
        filename:'[name][contenthash:8].css'
    })
]
```

### webpack 做 rem 自动转化

移动端 css px 自动转为 rem。

px2rem-loader -D

lib-flexible -S ： 动态计算 html 的字体大小

```js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'px2rem-loader',
          options: {
            remUnit: 75, // 1rem = 75px
            remPrecision: 8 // px转为rem后保留的小数点位数
          }
        }
      ]
    }
  ];
}
```

### 资源内联

- js，css 代码内联到 html 中
- 图片，字体内联到代码中

意义：

- 页面框架的初始化脚本，例如：lib-flexible 库的初始化计算 html 字体大小
- 上报相关打点，比如 pageStart，css 和 js 初始化和加载完成时间点的代码都需要放在 html 中而不能和源码一起打包
- 首屏 css 内联避免闪动
- 减少网络请求数

图片的内联：

使用 url-loader 并设置文件打包体积。

html 和 js 内联：

**raw-loader**内联 html

直接在 html 页面将一段在许多页面中都共享的 meta 内联到 html 中。

```html
${require('raw-loader!babel-loader!./meta.html!')
```

![image-20220711202056813](.\typora-user-images\image-20220711202056813.png)

```html
<meta http-equiv=”Set-Cookie” content=”cookievalue=xxx; expires=Friday,12-Jan-2001 18:18:18 GMT;
path=/”>:如果网页过期，那么存盘的cookie将被删除。必须使用GMT的时间格式。
<meta
  http-equiv="expires"
  content="时间"
/>：用于设定网页的到期时间。一旦网页过期，必须到服务器上重新传输。
<meta http-equiv="”Refresh”" content="”5;URL”" />：告诉浏览器在【数字】秒后跳转到【一个网址】 <meta
http-equiv=”content-Type” content=”text/html; charset=utf-8″>：设定页面使用的字符集。
<meta charset="”utf-8″" />：在HTML5中设定字符集的简写写法。
<meta
  http-equiv="”Pragma”"
  content="”no-cache”"
/>：禁止浏览器从本地计算机的缓存中访问页面内容。访问者将无法脱机浏览。
<meta
  http-equiv="”Window-target”"
  content="”_top”"
/>：用来防止别人在iframe(框架)里调用自己的页面，这也算是一个非常实用的属性。
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
:强制浏览器按照特定的版本标准进行渲染。但不支持IE7及以下版本。如果是ie浏览器就用最新的ie渲染，如果是双核浏览器就用chrome内核。
```

x

raw-loader 内联 js

```
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible')}</script>
```

css 内联：

方案一：style-loader

```js
const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'./dist')
    },
    mode:'production',
    module:{
        rules:[
            {
                test:/\.scss$/,
                use:[
                    {
                        loader:'style-loader',
                        options:{
                            insertAt:'top', // 将样式插入到head
                            singleton:true  // 将所有的style变迁合成一个
                        }
                    }，
                    'css-loader'
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            tempalte:'./public/index.html'
        })
    ]
}
```

方案二：html-inline-css-webpack-plugin

将打包提取出来的 css 文件，内联到 html 的 head 中。

### 多页面应用打包

多页面应用有多个 html 文件。

每个页面对应一个 entry，同时每个页面也对应一个 html-webpack-plugin。所以以这种方式构建多页面应用时，有新页面加入时都不得不在 entry 和 html-webpack-plugin 中配置对应的页面打包配置，很繁琐。

通用化的解决方案：

动态获取 entry 和动态设置 html-webpack-plugin 的数量

约定所有的入口文件的命名存在共性，比如：./src/xxx/index.js。通过 js 脚本获取对应目录下的文件夹，从而得出入口文件的数量，在打包时，动态设置 entry 和 html-webpack-plugin。

npm install glob

```js
const glob = require('glob')

entry:glob.sync(path.join(__dirname.'./src/*/index.js')
```

项目目录结构：

- src
  - assets
  - utils
  - index
    - index.js
    - index.html
    - ....
  - login
    - index.js
    - index.html
    - ......
  - .....

```js
const glob = require('glob');

const setMap = () => {
  // 动态设置entry和htmlWebpackPlugin
  const entry = {};
  const htmlWebpackPlugin = [];

  const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.js'));

  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugin
  };
};
```

entryFiles 的结构

![image-20220313183306290](.\typora-user-images\image-20220313183306290.png)

pageName 的结构

![image-20220313202756490](.\typora-user-images\image-20220313202756490.png)

### 提取页面公共资源

多页面项目中，每个子项目中都使用了一些相同的基础库和一些公共的自定义模块。默认打包时，每个项目都会单独打包一份公用的库和自定义模块。

- 基础库分离将 react 、react-dom 基础包通过 cdn 引入、不打入 bundle 中。同时，需要在项目的 html 中通过 script 脚本引入库的 cdn 地址。

  ```
  npm add html-webpack-externals-plugin -D
  ```

  ```
  new HtmlWebpackExternalsPlugin({
    externals: [
      {
        module: 'react',
        entry: 'https://unpkg.com/react@18/umd/react.production.min.js',
        global: 'React'
      },
      {
        module: 'react-dom',
        entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        global: 'ReactDOM'
      }
    ]
  })
  ```

- 利用 SplitChunksPlugin 进行公共脚本分离

  chunks 参数说明

  - async 异步引入的库进行分离 （default）
  - initial 同步引入的库进行分离
  - all 所有的库进行分离

  ```
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // 最小包体积
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'venders',
          chunks: 'all'
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
  ```

### tree shaking

一个模块中可以有许多方法，只要其中的某个方法使用到了，则整个模块都会被打包 bundle 中去，tree shaking 就是只把用到的方法进行打包，没用到的会在丑化阶段删除。

在 webpack 中默认支持，在 mode 为 production 时，默认开启。

**要求必须使用 ES6 的语法，CJS 的方式不支持。**

dce（dead code elimination）

- 代码不会被执行
- 不可到达
- 代码执行的结果不会被用到
- 代码只会影响到死变量 （只读不写）

原理：

利用 ES6 模块化的特点，es6 模块语法 import ，export 都只能在模块的顶层语句中出现(当前模块的最外层作用域中)，import 模块的名称只能是字符串常量（不能动态设置 import 的内容），import 一个模块后不能再对引入的模块进行修改。

tree shaking 本质是对模块的代码进行静态的分析，因此在**编译的阶段**就需要确定哪些代码是否被使用，而不能在代码运行阶段进行分析。tree shaking 了解到哪些代码没有用到后，将它们进行注释标记，在丑化阶段进行删除。

### scope hoisting

webpack mode -> production 默认开启

没开启 scope hoisting 时打包结果：

![image-20220313211718660](.\typora-user-images\image-20220313211718660.png)

- 存在大量的函数闭包代码，导致打包体积增大
- 代码运行时函数作用域增多，内存开销变大

原理： 将所有的模块的代码按照引用顺行放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突。

对比：通过 scope hoisting 可以减少函数声明代码和内存开销。

为什么 webpack 打包后文件需要被函数包裹？

为的是让浏览器支持模块化特性，因为 webpack 在打包时会将其他模块化的语法进行 polyfill，模块转换

### 代码分割

- splitChunks 提取多页面中使用的自定义基础模块或者 一些第三方库及其 cdn 加载
- 动态 import，require.ensure

```
npm install @babel/plugin-syntax-dynamic-import  -D
```

babel 配置文件中：

```
plugins: ['@babel/plugin-syntax-dynamic-import']
```

- 工程化方式编写一份健壮的可维护的 webpack 构建配置
- webpack 构建速度优化和打包体积优化策略
- 速度方面：并行压缩，多实例构建，使用 webpack 缓存
- 构建体积：公共资源分包，动态采用 polyfill，动态加载
- 单元测试
- 冒烟测试
- 测试用例覆盖率

- webpack 原理
- webpack 内部运行原理
- 编写自定义 loader 和插件

- webpack 运用到实际项目
- 提升开发阶段和打包阶段的构建体验
- react 全家桶和 webpck 的结合
