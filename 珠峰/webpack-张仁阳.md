# 前端工程化

## Webpack

在webpack中会将各种各样的文件都看作一个模块，模块之间可能相互依赖。webpack打包所有的这些资源文件编译为一些前端环境(浏览器环境)能识别的一些文件（静态资源），比如js，css，png等。



```shell
npm install webpack webpack-cli --save-dev
```

webpack 是 JavaScript 应用程序的静态打包工具。

- webpack：核心包
- webpack-cli：命令行工具，主要是在执行 webpack 命令时，解析命令行中设置的一些列参数，加载 webpack 配置文件（默认 webpack.config.js）



## 浏览器直接使用 ES module

```html
<script src="./src/index.js" type="module"></script>
//这样就可以了
```

ES6 模块化语法：

```js
// index.js:
import { sum, mul } from './js/math.js'

console.log(sum(20,30))
console.log(mul(20,30))
```

```js
math.js:
export const sum =(num1,num2)=>{
    return num1 + num2
}

export const mul =(num1,num2)=>{
    return num1 * num2
}
```

**证明 ES6 的模块化语法是需要发起网络请求：**

![image-20220310071821033](..\typora-user-images\image-20220310071821033.png)



![image-20220310072112724](..\typora-user-images\image-20220310072112724.png)

在上面，直接使用 file 协议打开本地的 index.html 文件，产生跨域请求。说明 ES6 的 import 语法是需要发起网络请求的。

```
npx webpack --entry ./src/main.js --output-path ./build

npx webpack --config  ./xxx/xxx.js
```



## entry

- 入口起点(entry point)告诉webpack 使用哪个模块，来作为构建其内部依赖图(dependency graph) 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的
- 默认值是 `./src/index.js`，但可以通过在 `webpack configuration` 中配置 `entry` 属性，来指定一个（或多个）不同src入口起点

```js
entry: './src/index.js';

entry: {
  main: './src.index.js';
}
```



## output

- `output` 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件
- 主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。

如果引入的有其他类型的文件，webpack 是无法识别的，为此需要使用 loader 加载器来加载这类文件并转为 webpack 可以处理的模块，一般都是 js，并添加到依赖关系图中。

loader 一般用于转为文件类型，插件则用来执行更为复杂的任务（打包优化，资源管理，注入环境变量...）



## loader

- webpack 只能理解 `JavaScript` 和 `JSON` 文件
- loader 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中

loader 的几种使用方式：

- import '**style-loader!css-loader!**../css/creatediv.css' （内联式，不推荐）

- CLI 方式（不推荐）

  package.json:

  ```
  {
      "build":"webpack --module-bind 'css=style-loader!css-loader'"
  }
  ```

- webpack 配置文件中写 loader

对应规则下面的loader是从右向左执行的，最右侧的loader接收到是对应类型的文件的源码，最左侧的loader一定会返回一个js模块。





## plugin

loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量

- clean-webpack-plugin

  ```js
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  
  plugins: [new CleanWebpackPlugin()];
  
  ```


  现在可以在webpack 的output配置项中编写一个字段clean：boolean 实现clean-webpack-plugin插件的能力。 

  ```js
  {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      clean: true,
    },
  }
  ```

  

- html-webpack-plugin

  html-webpack-plugin 插件在调用时如果不传递模板参数，则该包的内部有一个默认的 ejs 模板可供使用----default_index.ejs

  ```ejs
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title><%= htmlWebpackPlugin.options.title %></title>
    </head>
    <body>
    </body>
  </html>
  ```

  ```js
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  plugins: [
    new HtmlWebpackPlugin({
      title: 'hello world',
      template: './public/index.html'
    })
  ];
  ```

- copy-webpack-plugin

  注意，该插件只是将指定目录下的文件拷贝一份到打包输出的文件夹中，但是并不将拷贝后的文件自动引入到打包生成的html中。
  
  [文档](https://www.webpackjs.com/plugins/copy-webpack-plugin#root)
  
  ```js
  const CopyWebpackPlugin  = require('copy-webpack-plugin')
  
  plugins:[
      new CopyWebpackPlugin({
          patterns:[
              {
                  from:'public',
                  globOptions:{
                      ignore:[
                          "**/index.html",   // 排除public下的index.html
                          "**/.DS_Store",
                          ...
                      ]
                  }
              }
          ]
      })
  ]
  ```



## 模式(mode)

- 前端开发工作中，一般都会有两套构建环境

- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，需要 sourcemap 文件，热更新

- 一套构建时使用，生成打包文件直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，不包括 sourcemap，可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件

- webpack 4.x 版本引入的 [mode](https://webpack.docschina.org/configuration/mode/) 的概念

- 当指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化

- 如果是 development mode 的话，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建

| 选项 | 描述 |
| :-- | :-- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin |
| production | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin |



```js
module.export = {
  mode: 'development', // 等于开启下面的这些配置
  
  devtool: 'eval',
  cache: true,
  performace: {
    hints: false
  },
  output: {
    pathinfo: true
  },
  optimization: {
    moduleIds: 'named',
    chunkIds: 'named',
    mangleExports: false,
    nodeEnv: 'development',
    flagIncludedOrder: false,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    },
    emitOnErrors: true,
    checkWasmTypes: false,
    removeAvailableModules: false,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  }
};
```





```js
module.export = {
  mode: 'production', // 等于开启下面的这些配置

  devtool: 'eval',
  cache: true,
  performace: {
    hints: 'warning'
  },
  output: {
    pathinfo: false
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    mangleExports: 'deterministic',
    nodeEnv: 'production',
    flagIncludedOrder: true,
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    },
    emitOnErrors: true,
    checkWasmTypes: false,
    removeAvailableModules: false,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  }
};
```

![image-20211004195304621](..\typora-user-images\image-20211004195304621.png)



## 区分环境

读取变量的两个地方：

- webpack 配置文件被读取时所在的 node 环境，该环境的全局对象上有 process 进程对象
- 项目的源码文件实际运行在的浏览器环境中，浏览器全局对象上没有 process 进程对象，访问则报错



1. **`--mode`用来间接设置模块内（源代码中）的`process.env.NODE_ENV`**

- 可以在模块内(**项目源文件代码中**)通过`process.env.NODE_ENV`获取该`process.env.NODE_ENV`对应的字符串值（development 或者 production）并进行替换，这是在**编译阶段**做的替换工作，它和 webpack 配置文件中通过进程对象（process）中的环境变量对象(env) 上的 NODE_ENV 是两个完全不同的概念

```json
"script":{
    "build":"webpack --mode=development"
}
```

具体过程：`webpack --mode=development` => 设置 webpack.config.js 文件中 mode 的值为 development => mode 为开发模式（development ）下时，webpack 内部通过 webpack.definePlugin 插件设置字符串 process.env.NODE_ENV 在项目源码中的代表的实际值为 development， **在编译阶段，当解析到项目源码中有用到变量：process.env.NODE_ENV 时，直接将它替换为字符串（development）**，process.env.NODE_ENV字符串除外。 webpack --mode=production 也是一样的原理。

其中通过命令行的--mode 和配置文件中的 mode 取指定环境，都是一个原理，如果两者同时存在，则命令行--mode 的优先级更高。



2. **`--env`用来设置 webpack 配置文件的函数参数**

- 无法在模块内通过`process.env.NODE_ENV`访问
- 可以在 webpack 配置文件中通过配置文件导出的**函数**获取当前环境变量

```json
"script":{
    "build":"webpack --env=development"
}
```



webpack.config.js

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log(process.env.NODE_ENV)   // 值为undefined

module.exports = function (env, argv) {
  console.log(env)  // development:true
  console.log(argv)
  return {
    mode: 'production',
    entry:'./src/index.js'
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
      }),
      new webpack.DefinePlugin({
        FIRTS_VAR: "'wuyibo'"
      })
    ]
  };
};
```

**`--env` 用来设置 webpack 配置文件导出的函数的参数**，并不直接在项目的模块文件中生效。

在 script 脚本中使用 --env=development 的效果是为 webpack 配置文件默认导出的是函数时，可以在函数的参数中获取到该命令行中设置的参数。例如 script 脚本中：`"build": "webpack --env=development"` 那么下面代码中的 env 就是：`{ WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, development: true }`。argv 的结构则是：`{ env: { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, development: true } }`，但是因为 mode 默认没有设置时使用的是 production 模式，所以打包出来代码中的 process.env.NODE_ENV 变量的取值仍旧是 production 字符串。

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env, argv) {
  console.log(env);
  console.log(argv);
  return {
    // mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
      })
    ]
  };
};
```



3. **`cross-env`用来设置 node 环境的`process.env.NODE_ENV`**

```
"scripts": {
  "build": "cross-env NODE_ENV=development webpack"
}
```

--env=development 只是在执行脚本时，给**函数类型**的 webpack 配置传入参数。如果在 webpack 配置文件中访问 process.env.NODE_ENV 的话，是没有值的，为 undefined。如果想修改 webpack 配置文件中访问的变量的值，可以在命令行中设置 webpack 配置文件运行的环境的环境变量。

```json
"scripts": {

  "build": "set NODE_ENV=development webpack",  // windows下的写法。webpack 配置文件中访问 process.env.NODE_ENV ，则它的值就为development

  "build": "cross-env NODE_ENV=development webpack"  // 解决操作系统层面的命令兼容性包

},
```

webpack 配置文件中读取的是 node 配置的环境变量，可以通过 cross-env key=value 来设置。 然后在 webpack 配置文件中可以访问到设置的环境变量，然后再用这个环境变量作为 webpack 配置项中的值，从而来改变项目模块内的变量的值或者打包方式。

cross-env 设置的环境变量在项目的模块文件中是无法访问到的。

例子：

```json
"scripts": {
	"build": "cross-env NODE_ENV=production FIRST_ENV=one webpack"
}
```

在 webpack 配置文件中可以访问到：

```
console.log(process.env.NODE_ENV);  // production
console.log(process.env.FIRST_ENV);   // one
```

在项目中的文件 index.js：

```js
console.log(process.env.NODE_ENV); // production  ,是由mode为production模式下的DefinePlugin插件设置的
console.log(process.env.FIRST_ENV); //  process.env.FIRST_ENV则直接在打包后文件中存在，运行时报错
```

**vue 中可以通过.env 格式的文件向 node 环境中设置变量。借助的是一个第三方库：dotenv-expand。**



4. **`DefinePlugin`用来设置模块内(源码中)的全局变量**

- 设置全局变量(全局变量不是`window`),所有模块都能读取到该变量的值
- 可以在任意模块内通过 `process.env.xxx`等任意字段表示自己设置好的值
- 但无法在`node环境`(webpack 配置文件中)下获取当前的变量
- 注意在值为字符串是需要用引号包裹代引号的字符串

```js
plugins:[
   new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV)，
       'back_end_url':'"http://xxxx.xxx/xxx"'
   })
]
```

通过插件 DefinePlugin 设置的变量可以直接在整个项目的源码中直访问。比如：

```js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env, argv) {
  return {
    mode: 'production',
    entry: {
      main: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
      }),
      new webpack.DefinePlugin({
        FIRTS_VAR: "'wuyibo'"
      })
    ]
  };
};
```

源码 index.js 中：

```js
console.log(FIRTS_VAR); // 在打包编译后的文件中直接就用  wuyibo 字符串进行的替换
```

在 vue 项目中的 index.html 文件中有: `<% BASE_URL %> favicon.ico` ,其中 BASE_URL 是要取全局下的该变量对应的值。

```js
const { DefinePlugin } = require('webpack');

plugins: [
  new DefinePlugin({
    BASE_URL: "'./'"
  })
];
```

webpack 的配置文件的模块导出可以是一个函数，也可以是一个配置对象。其中函数可以接受命令行传递的参数。



## Browserlist

在不同的前端工具之间共用目标浏览器和 node 版本的配置文件。它主要被以下工具使用(许多的 webpack 插件会依赖它)：

```
Autoprefixer
Babel
post-preset-env
eslint-plugin-compat
stylelint-unsupported-browser-features
postcss-normalize
```

Browserlist 可以编写的字段：

- defaults : Browserslist的默认浏览器 (> 0.5%,last 2 versions, Firefox ESR, not dead)。
- 5%:通过全局使用情况统计信息选择的浏览器版本。 >=，<和<=工作过
  - 5% in Us:使用美国使用情况统计信息。它接受两个字母的国家/地区代码。
  - \>5%in alt-As:使用亚洲地区使用情况统计信息，有关所有区域代码的列表，请参见aniuse-lite/data/reqions
  - \>5%in my stats:使用自定义用法数据
  - \>5% in browserslist-config-mycompany stats :使用 来自的自定义使用情况数据browserslist-onfig-mycompany/browserslist-stats,json.
  - cover 99.5%:提供覆盖率的最受欢迎的浏览器
  - cover 99.5%in us:与上述相同，但国家/地区代码由两个字母组成
  - cover 99.5%in my stats:使用自定义用法数据
- dead:24个月内没有官方支持或更新的浏览器，现在是E 10 Mob 11 BlackBerry 10Blackery7，Samsung 4和OperaMobile 12.1.
- last 2versions:每个浏览器的最后2个版本。
  - last 2 Chrome versions:最近2个版本的Chrome浏览器
  - last2 major versions或last 2 ios major versions:最近2个主要版本的所有次要/补丁版本
- not ie<= 8:排除先前查询选择的浏览器。
- browserslist config:在Browserslist配置中定义的浏览器。在差异服务中很有用，可用于修改用户的配置。



可以编写类似于这样的配置:
>\> 1%
>last 2 versions
>not dead

那么之后，这些工具会根据配置来获取相关的浏览器信息，以方便决定是否需要进行兼容性的支持:

- 条件查询使用的是caniuse-lite的工具，这个工具的数据来自于caniuse的网站上;



直接使用 browserslist 命令行工具查询根据条件匹配到的浏览器：

```
npx browserslist ">1%, last 2 version, not dead"
```

![image-20220828190451254](..\typora-user-images\image-20220828190451254.png)

Browserlist 可以编写的位置：

- 在 package.json 中的配置

  ```json
  {
    "browserslist": [
      "last 1 version",
      "> 1%",
      "maintained node versions",
      "not dead"
    ]
  }

  或者

  "browserslist": {
      "production": [
          "> 1%",
          "ie 10"
      ],
      "development": [
          "last 1 chrome version",
          "last 1 firefox version"
      ]
  }

  ```

- 单独的一个配置文件.browserslistrc 文件

  ```
  # 注释是这样写的，以#号开头
  > 1%  #代表全球超过1%使用的浏览器
  last 1 version #最后的一个版本
  maintained node versions #所有还被 node 基金会维护的 node 版本
  not dead
  
  或者
  
  [production staging]
  > 1%
  last 2 version
  not dead
  
  [development]
  last 1 chrome version
  last 1 firefox version
  
  不配置默认为：**> 0.5%, last 2 versions, Firefox ESR, not dead**
  ```
  
  

 ## webpack-dev-server

| 类别      | 配置名称   | 描述                                                         |
| :-------- | :--------- | :----------------------------------------------------------- |
| output    | path       | 指定输出到硬盘上的目录                                       |
| output    | publicPath | 表示的是打包生成的index.html文件里面引用资源的前缀           |
| devServer | publicPath | 表示的是打包生成的静态文件所在的位置(若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值) |
| devServer | static     | 用于配置提供额外静态文件内容的目录                           |

内部依赖的是 express 框架。

onBeforeSetupMiddleware 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。

  ```js
devServer:{
  static:path.resolve(__dirname,'public'),
	port:8080,
	open:true,
	proxy:{
        '/api':'http://localhost:3000',
        '/api2':{
            target:'http://localhost:3001',
            pathRewrite:{"^/api":''}
        }
    },
  // webpack-dev-server 内部就是一个express服务器，devServer就是express执行返回值
  onBeforeSetupMiddleware(devServer){// express()
     // 简单模拟一个后端接口
     devServer.app.get('/api/users', (req, res) => {
       res.json([{ id: 1 }, { id: 2 }]);
     });
  }
}
  ```

使用 webpack-dev-server 时，内部会使用 webpack 的配置文件模拟打包，并将打包后生成文件的文件根目录和static字段指定的文件夹合并后，作为 web 服务器的根目录（/），当访问该地址时，默认访问的就是根目录下的 index.html 文件。而 devServer 配置项指定的目录中的文件也会直接放在本地服务器的根目录下。



## css-loader 配置

```js
{
    test:/\.css$/,
    use:[
        'style-loader',
        {
            loader:'css-loader',  //会读取源CSS文件，并且自动可以识别里面import语句并把对应CSS内容合并过来
            options:{
                url: boolean,   // 比如背景图中的url能否被识别
                import:boolean, // 是否允许css中使用@import css语法
                modules:boolean,  // 是否开启css模块化   import style from './index.css'
                source-map:boolean,
                importLoaders:boolean | number,  
                esModules:boolean  // import style from './index.css'   style.defalut.xxx  默认为true
            }
        }
    ]
}
```

> importLoaders:boolean | number,  // importloaders Allows to enables/disables or setups number of loaders applied before CSS loader for @import at-rules

css-loader 在 css 文件中默认支持 **~ 符号**表示 node_modules 文件路径，不需要用户去配置。

- @是webpack设置的路径别名在，在webpack配置文件中设置以后，也可以在css中使用
- Starting with version 4.0.0, absolute paths are parsed based on the server root
- To import assets from a node modules path (include resolve.modules) and for alias, prefix it with a ~

```js
{
  resolve:{
    alias:{
      "@':path.resolve('src')
    }
  }
}
```



```css
bg{
  width:100px;
  height:100px;
  background-image: url(images/kf.jpg);
  background-image: url(@/images/kf.jpg);
  background-image:; url(~module/images/a.jpg);  // 取node_modules/module/images/a.jpg
}
```

不能在js文件中不配置就使用“~”，比如不能：import img from '~module/images/a.jpg'



node-sass  sass-loader

sass：老版后缀

scss：新版本后缀

node-sass 负责将 scss 或者 sass 编译为 css，原始的 sass 包使用 ruby 写的，本地安装的话需要编译，node-sass 是 node 写的，比较好安装执行。

dart-sass



## webpack-dev-middleware

[webpack-dev-middleware](https://www.npmjs.com/package/)就是在 Express 中提供 `webpack-dev-server` 静态服务能力的一个中间件

npm install webpack-dev-middleware --save-dev

```js
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');

webpackOptions.mode = 'development';
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
```

- webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可
- 而使用`webpack-dev-middleware`的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等



## CSS 兼容性

PostCSS 是一个独立的工具，可以脱离 webpack 单独使用（postcss-cli 在命令行单独使用 postcss 时需要安装该插件）。可以通过 JavaScript 来转换样式，css 的转换和适配，自动添加浏览器厂商前缀，css 样式重置，css 单位转换。

还需要结合Browserlist的版本兼容配置文件来使用。 

```shell
npm i postcss-loader postcss-preset-env -D
```

- [postcss-loader](https://github.com/webpack-contrib/postcss-loader)可以使用 PostCSS 处理 CSS
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)把现代的 CSS 转换成大多数浏览器能理解的插件集合
- PostCSS Preset Env 已经包含了`autoprefixer`和`browserlists`选项

postcss 配置文件：

postcss.config.js

```js
let postcssPresetEnv = require('postcss-preset-env');
module.exports={
    plugins:[postcssPresetEnv({
        browsers: 'last 5 version'
    })]
}


module.exports = {
    plugins:[
        // require("autoperfixer")  or
        // require("postcss-preset-env") or
        "postcss-preset-env"
    ]
}



{
    test:/\.css/,
		use:[
        {loader:'style-loader'},
        'css-loader',
        {
            loader:'postcss-loader',
            options:{
               postcssOptions:{
                    plugins:[
                        // require("autoprefixer"),//这个插件可以不再写了，因为postcss-preset-env中内置使用了autoprefixer
                        require("postcss-preset-env")
                        //or
                    	// require('pluginName')(传参)
                    ]
                }
                // plugins:["postcss-preset-env"]   这是另一种写法
            }
        }    //postcss-loader内部会调用options配置中指定的postcss插件对样式文件加兼容性前缀
    ]
}
```

配置文件的内容也可以写在 package.json 文件中。

```diff
{
+  "browserslist": {
+    "development": [
+      "last 1 chrome version",
+      "last 1 firefox version",
+      "last 1 safari version"
+    ],
+    "production": [
+      ">0.2%"
+    ]
+  }
}
```





## 资源模块

- [Rule.type](https://webpack.js.org/configuration/module/#rule)
- [asset-modules](https://webpack.js.org/guides/asset-modules/)

type 的四种类型：

1. asset/resource
2. asset/source
3. asset/inline
4. asset

```js
output:{
    filename:'js/bundle.js',
    path:path.resolve(__dirname,"./build"),

    assetModuleFilename:"img/[name].[hash:6][ext]"     //这会是下面图片资源打包后存放了目录,所有通过 assetModule打包的文件都放在设置的值的目录下，当然后面可以针对每个loader进行不同的配置
}



{
    test:/\.(jpg|png|svg|gif|jpeg)$/,
   	type:"asset/resource"
}
```

- 资源模块是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader
- `raw-loader` => `asset/source` 导出资源的源代码
- `file-loader` => `asset/resource` 发送一个单独的文件并导出 URL

  ```js
  output:{
      filename:'bundle.js',
      path:path.resolve(__dirname,"./build")
  }
  
  
  {
    test:/\.(jpg|png|svg|gif|jpeg)$/,
    type:"asset/resource",
      generator:{
        filename:"img/[name].[hash:6][ext]"   //img会是图片资源打包后存放了目录
      }
  }



- `url-loader` => `asset/inline` 导出一个资源的 data URI

  ```js
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname,"./build")
  }
  
  
  {
    test:/\.(jpg|png|svg|gif|jpeg)$/,
    type:"asset/inline"  // 不要配置文件打包路径，因为没有输出文件，都在js中以base64表示了
  }



- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现

  ```js
  
  output:{
      filename:'bundle.js',
      path:path.resolve(__dirname,"./build")
  }
  
  {
    test:/\.(jpg|png|svg|gif|jpeg)$/,
    type:"asset",
      generator:{
        filename:"img/[name].[hash:6][ext]"
      },
      parser:{
        dataUrlCondition:{
          maxSize: 100 *1024   // 小于该体积（100kb）则打包为base64
        }
      }
  }
  ```



```diff
module.exports = {
	output:{
		path:path.resolve(__dirname,'dist')
		filename:'main.js',
+   	assetModuleFilename:'assets/[hash][ext][query]'  // 指定打包输出文件的名字（方式一）
	}
    module:{
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-react"
                            ]
                        },

                    }
                ],
                exclude:/node_modules/
            },
+           {
+               test: /\.png$/,
+               type: 'asset/resource',   // file-loader
+               generator:{
+									filename:'images/[hash][ext]'  (方式二 )
+               }
+           },
+           {
+               test: /\.ico$/,
+               type: 'asset/inline'   // url-loader
+           },
+           {
+               test: /\.txt$/,
+               type: 'asset/source'   // raw-loader
+           },
+           {
+               test: /\.jpg$/,
+               type: 'asset',
+               parser: {
+                   dataUrlCondition: {
+                     maxSize: 4 * 1024 // 4kb
+                   }
+               }，
+               generator:{
+									filename:'images/[hash][ext]'  (方式二 )
+               }
+           }
        ]
    },
  experiments: {
    asset: true
  },
};
```



```js
{
    test:/\.(ttf|eot|woff|woff2)$/,
    type:'asset/resource',
    generator:{
        filename:"font/[name].[hash:6][ext]"
    }
}
```



### query

```
assetModuleFilename:'assets/[hash][ext][query]'
```

query 表示查询参数，比如在源码中：

```js
import png from './assets/images/logo.png?time=2022-8-21';
```

那么打包后生成的，在引入这个文件的时候会在 url 地址的 query 中加上上面设置的值。

项目中使用图片：

- css 中 background-image

  ```css
  #box {
    background-image: url('../asset/images/xx/xxx.jpg');
  }
  ```

- img 标签的 src 属性

  ```js
  const imgEl = new Image()
  imgEl.src = require('./src/asset/images/xx/xx.jpg').default   file-loader 5版本中的特点
  
  
  import imgSrc from './src/asset/images/xx/xx.jpg'
  const imgEl = new Image()
  imgEl.src = imgSrc

有时经过 webpack 打包后的文件希望保留源文件的名字再外加一些特别的标识符进行表示。

这时候可以借助 webpack 中占位符来实现。常用的占位符：

- [ext] 文件扩展名

- [name] 原文件名

- [hash] 本地打包的 hash 值

- [contentHash] 该文件内容对应的 hash 值

- [hash:length] 指定长度的 hash 值

- [path] 文件相对于 webpack 配置文件的路径

现在无法直接在 webpack5 中使用 file-loader，url-loader 来打包 CSS 文件中的图片了，而需要改动：

现在不能直接像上图一样在 css 中引用图片了：具体参考文章https://blog.csdn.net/w184167377/article/details/118930758

  ```js
{
    test: /\.(jpe?g|png|svg|gif)$/,
    use: [
            {
                loader: "url-loader",
                options: {
                    name: "[name]-[hash:6].[ext]",
                    esModule: false,
                    limit: 100 * 1024
                }
            }
        ],
     type: "javascript/auto"
}
  ```



## 清除打包目录

在较为新版本的 webaack 中可以不再使用 clear-webpack-plugin 插件来清楚打包生成的目录。可以通过下面的方式来指定：

```js
output:{
    path:path.resolve(__dirname,'dist')
    filename:'main.js',
    clean:true  // +++++++++++++++++++++++++++
}
```



## JS 兼容性处理

- Babel 默认只转换新的最新 ES 语法,比如箭头函数

让 babel 能转换其他新语法需要借助包或者 babel 插件

- [babel-loader](https://www.npmjs.com/package/babel-loader)使用 Babel 和 webpack 转译 JavaScript 文件,用来读取加载项目源码中的 js 文件
- [@babel/core](https://www.npmjs.com/package/@babel/core)Babel 编译的核心包,babel-loader 读取的源码传给@babel/core，由@babel/core 将源码转为 AST 语法树，但是它不知道怎么转为代码，它需要将不同的 ast 部分转发给不同插件或者预设取处理
- [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)
- [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react) React 插件的 Babel 预设
- [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) 把类和对象装饰器编译成 ES5
- [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) 转换静态类属性以及使用属性初始值化语法声明的属性

```shell
npm i babel-loader @babel/core @babel/preset-env @babel/preset-react  -D
npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-proposal-private-property-in-object  @babel/plugin-proposal-private-methods -D
```

```diff
  module: {
    rules: [
+      {
+        test: /\.jsx?$/,
+        use: {
+          loader: 'babel-loader',
+          options: {
+            presets: ["@babel/preset-env", '@babel/preset-react'],
+            plugins: [
+              ["@babel/plugin-proposal-decorators", { legacy: true }],
+              ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
+              ["@babel/plugin-proposal-private-methods", { "loose": true }],
+              ["@babel/plugin-proposal-class-properties", { loose: true }],
+            ],
+          },
+        },
+      },
      ]
  }
```

装饰器的写法：

```js

function readonly(target,key,descriptor){
    descriptor.writable = false
}

class Person {
    @readonly PI =3.14
}

let person = new Person()
person.PI = 3.15
console.log(person)  // PI还是3.14



function decode(target,key,descriptor){

}
// 写法一：  legacy（传奇）:true 表示老的规则,可以这么写
@decode
class Person {}

// 写法二（新写法）：
class @decode Person {}

```

loose：true表示可以以obj.xxx的方式给对象添加属性，为false的话表示babel最后以object.defineProperty的方式给对象添加属性。



## eslint

### 旧版配置

npm install eslint eslint-loader babel-eslint --D

```js
module: {
    rules: [
+      {
+        test: /\.jsx?$/,
+        loader: 'eslint-loader',
+        enforce: 'pre',   //   值：不写  pre前置  post后置 确定针对同一个文件的规则匹配的优先级
+        options: { fix: true },
+        exclude: /node_modules/,
+      }, // 先检查代码风格，在进行编译

+      {
+        test: /\.jsx?$/,
+        use: {
+          loader: 'babel-loader',
+          options: {
+            presets: ["@babel/preset-env", '@babel/preset-react'],
+            plugins: [
+              ["@babel/plugin-proposal-decorators", { legacy: true }],
+              ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
+              ["@babel/plugin-proposal-private-methods", { "loose": true }],
+              ["@babel/plugin-proposal-class-properties", { loose: true }],
+            ],
+          },
+        },
+      },
    ]
}
```

.eslintrc.js：

```js
module.exports = {
  root: true, // 为true说明该文件是根配置文件，可以被其他配置文件继承规则，为true是就不能再写extends继承字段了
  parser: 'babel-eslint', // 代码中有es6以后的写法，默认情况下可能不认识，需要使用babel-eslint识别新语法
  //指定解析器选项
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  },
  //指定脚本的运行环境
  env: {
    browser: true,
    node: true
  },
  // 启用的规则及其各自的错误级别
  rules: {
    indent: 'off', //缩进风格
    quotes: 'off', //引号类型
    'no-console': 'error' //禁止使用console
  }
};
```

npm i  eslint-config-airbnb  eslint-loader  eslint eslint-plugin-import  eslint-plugin-react  eslint-plugin-react-hooks  eslint-plugin-jsx-a11y -D

```js
module.exports = {
  // 删除root文件，同时继承airbnb
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    semi: 'error',
    'no-console': 'off',
    'linebreak-style': 'off',
    'eol-last': 'off'
    //"indent":["error",2]
  },
  env: {
    browser: true,
    node: true
  }
};
```



### 新版配置

npm install eslint -D

npx eslint. --init 问答式选择生产.eslintrc.js文件，同时会安装一些配置预设和插件。

以前通过配置loader实现在编译阶段对源代码规范的校验并在不规范的情况下报错。

现在则改为插件的形式。同时原来的解析器babel-eslint已经停止维护了，现在使用@babel/eslint-parser。

```js
// webpack.config.js

const ESLintPlugin = require('eslint-webpack-plugin');

plugins:[
  new ESLintPlugin({
    fix: true,
  }),
]
```



.eslintrc.js

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@babel/eslint-parser',  // 不用这个解析器则是用eslint默认的
  extends: ['plugin:react/recommended', 'airbnb'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': 'error',
    'no-undef': 'error',
  },
};

```





## webpack 原理预备知识

- `Symbol.toStringTag` 是一个内置 symbol，它通常作为对象的属性使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签
- 通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

```js
console.log(Object.prototype.toString.call('foo')); // "[object String]"
console.log(Object.prototype.toString.call([1, 2])); // "[object Array]"
console.log(Object.prototype.toString.call(3)); // "[object Number]"
console.log(Object.prototype.toString.call(true)); // "[object Boolean]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"

let myExports = {};
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' });
console.log(Object.prototype.toString.call(myExports)); //[object Module]   自定义某个数据的标识
```



webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
};
```



入口文件 index.js

```js
let title = require('./title.js');
console.log(title);
```

title.js:

```js
module.exports = 'title';
```

打包后生成文件：

```js
// modules存放项目除了入口模块之外依赖的所有模块（依赖关系图的生成结果）， key（模块id）是模块对于项目的所在根目录的路径，值是函数，函数体内容由模块文件的内容组成
var modules = {
  //不管源码中是模块路径，相对或绝对路径，最后都转为相对于项目根目录的相对路径
  './src/title.js': (module, exports, require) => {
    module.exports = 'title';
  }
};

// 缓存已经被引入过的模块
var cache = {};

// require方法，相当于自己在浏览器端实现一个require的pollful的方法
function require(moduleId) {
  if (cache[moduleId]) {
    return cache[moduleId].exports;
  }
  
  var module = cache[moduleId] = {
    exports: {}
  }z;
  
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

var exports = {};

let title = require('./src/title.js');   // 可以看出整个代码是同步执行的
console.log(title);
```



当index.js中引入两个依赖文件test1.js和test2.js时的打包结果：

```js
var webpackModules = {
  "./src/test/test1.js": (module, unusedWebpackExports, webpackRequire) => {
    module = webpackRequire.nmd(module);
    module.export = "test1";
  },
  
  "./src/test/test2.js": (module, unusedWebpackExports, webpackRequire) => {
    module = webpackRequire.nmd(module);
    module.export = "test2";
  },
};

var webpackModuleCache = {};

function webpackRequire(moduleId) {
  var cachedModule = webpackModuleCache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (webpackModuleCache[moduleId] = {
    id: moduleId,
    loaded: false,
    exports: {},
  });
  webpackModules[moduleId](module, module.exports, webpackRequire);
  module.loaded = true;
  return module.exports;
}

webpackRequire.nmd = (module) => {
  module.paths = [];
  if (!module.children) module.children = [];
  return module;
};

var webpackExports = {};

const test1 = webpackRequire("./src/test/test1.js");
const test2 = webpackRequire("./src/test/test2.js");
console.log(test1);
console.log(test2);
```



在 webpack 中有两种模块化规范，commonjs 和 esmodule，他们之间可以相会转换和混用。并且在 webpack 打包后都统一使用 commonJS 模块规范。如果对不同模块化规范做兼容。



### common.js 加载 common.js

```js
// index.js:
let title = require('./title');
console.log(title.name);
console.log(title.age);

// title.js
exports.name = 'title_name';
exports.age = 'title_age';


// 打包结果
var modules = {
  // 定义了一个对象，用模块的路径作为key, 函数作为值value ，将每一个加载的模块以及模块对应的代码，代码该函数内部，然后该函数作为值，而模块的路径对应key。 在commonjs中并没有将入口文件加入到__webpack_modules__对象内部作为一个属性。而在ES6的中是做了的。可以看下面的ES6打包文件
  './src/title.js': (module, exports) => {
    exports.name = 'title_name';
    exports.age = 'title_age';
  }
};

var cache = {}; // 一旦整个项目中有一个文件引入了一个模块后，后续该项目中的其他文件再引入相同的文件，则实际上都是同一个导出。

function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {}
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

var exports = {};

let title = require('./src/title.js');
console.log(title.name);
console.log(title.age);
```



### common.js 加载 ES6 modules

```js
// index.js:
let title = require('./title');
console.log(title.default);
console.log(title.age);

// title.js
export default 'title_name'; // 默认导出
export const age = 'title_age'; // 命名导出

// 打包结果
(() => {
  // 模块定义
  var modules = {
    './src/title.js': (module, exports, require) => {
      // es module转commonjs
      
      const _DEFAULT_EXPORT__ = 'title_name';  // 注意这里是const定义的变量，所以在导入该模块的文件中是无法修改该变量的值的
      const age = 'title_age';
      
      require.r(exports); // r函数用于标识exports是一个es module的导出

      require.d(exports, {
        default: () => _DEFAULT_EXPORT__,
        age: () => age // 从这里可以看出esmodule的导出，导出的时变量本身，这不同于commonjs导出的是值或者对象引用，而且在定义时，并没有提供对应属性的setter方法，所以导入该模块的其他模块是无法修改该导出变量的值的。 而且该模块中在后续修改了该变量对应的值后，其他模块再次访问导出的变量时，会是最新的值。
      });
      
    }
  };
  
  var cache = {};

  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }

  // 给对象定义属性
  require.d = (exports, definition) => {
    for (var key in definition) {
      if (require.o(definition, key) && !require.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key]   // 只定义了getter
      }
    }
  };

  require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

  // r函数用于标识exports是一个es module的导出
  require.r = (exports) => {
    // 宿主环境支持symbol数据类型
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' }); // [object Module]
    }

    // 宿主环境不支持symbol数据类型时
    Object.defineProperty(exports, '__esModule', { value: true }); // exports.__esModule = true，通过该属性就能知道该模块文件是采用的commonJS模块还是esModule模块规范
  };

  let title = require('./src/title.js');
  // title默认是引入的那个模块
  console.log(title.default); // es6中默认导出在commonjs中是通过default属性获取的。
  console.log(title.age);
})();
```



### ES6 modules 加载 ES6 modules

```js
//  index.js
import name, { age } from './title';
console.log(name);
console.log(age);

// title.js
export default name = 'title_name';
export const age = 'title_age';

// 打包结果

var modules = {
  './src/title.js': (module, exports, require) => {
    require.r(exports);
    let _DEFAULT_EXPORT__ = 'title_name';
    let age = 'title_age';
    setTimeout(() => {
      age = 'new';
    }, 1000);
    require.d(exports, {
      "default": () => (_DEFAULT_EXPORT__),
      "age": () => (age)
    }); 
  }
};
var cache = {};
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {}
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  }
};

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

require.r = (exports) => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  }
  Object.defineProperty(exports, '__esModule', { value: true });
};

var exports = {};

require.r(exports);
var _title_0__ = require('./src/title.js');
console.log(_title_0__['default']);
console.log(_title_0__.age);
```



### ES6 modules 加载 common.js

```js
// index.js
import name, { age } from './title';
console.log(name);  // 这里的默认导入实际上就是被导入的commonjs模块的module.exports对象
console.log(age);

// title.js
module.exports = {
  name: 'title_name',
  age: 'title_age'
};

// 打包结果
(() => {
  var modules = {
    './src/title.js': (module) => {
      module.exports = {
        name: 'title_name',
        age: 'title_age'
      };
    }
  };
  
  var cache = {};
  
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (cache[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  
  require.n = (module) => {
    var getter = module && module.__esModule ? () => module['default'] : () => module;
    require.d(getter, { a: getter });
    //给getter添加一个a属性，a的值就是getter的返回值 getter.a
    return getter;
  };
  
  require.d = (exports, definition) => {
    for (var key in definition) {
      if (require.o(definition, key) && !require.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
  
  require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  
  require.r = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  
  var exports = {};
  
  (() => {
    //只要打包前的模块是一个es module,那么就会调用require.r方法进行处理
    require.r(exports);
    var _title_0__ = require('./src/title.js');
    var _title_0___default = require.n(_title_0__);
    console.log(_title_0___default());
    console.log(_title_0__.age);
  })();
  
})();
```

在 a 模块中使用 commonjs 的 require 语法加载 b 模块，b 模块使用 ES Module 进行默认导出和命名导出，则在 a 模块中得到的是 b 模块对应的模块对象，其中包含命名导出和 default 默认导出属性。 

```js
// index.js:
let title = require('./title');
console.log(title); // title是title.js模块对象
console.log(title.age);

// title.js
export default 'title_name'; // 默认导出
export const age = 'title_age'; // 命名导出
```

![image-20220522184522377](..\typora-user-images\image-20220522184522377.png)



面试：commonjs 和 es Module 导出的区别？

- commonjs 是在导入模块中是值和引用
- es module 是在导入模块中是对导出模块导出对象或者值的内存引用

```js
// index.js
import title, { age } from './title.js';
setTimeout(() => {
  console.log(age); // 打印 20
}, 3000);

// title.js
export var age = 10;
export default {};
setTimeout(() => {
  age = 20;
}, 1000);
```

```js
// index.js
let title = require('./title.js');
setTimeout(() => {
  console.log(title.age); // 打印 10
  console.log(title.obj.name); // 456
}, 3000);

// title.js
var age = 10;
var obj = {
  name: 123
};
module.exports = {
  age,
  obj
};
setTimeout(() => {
  age = 20;
  obj.name = 456;
}, 1000);
```



## 异步加载

懒加载和代码分割

```js
// index.js  import返回的结果是一个promise实例，返回的结果不管源文件是commonjs还是esmodule，都包装为esmodule
import(/* webpackChunkName: "hello" */ './hello.js').then((result) => {
  console.log(result.default);
});

// hello.js
export default 'hello';
```

打包后，用户访问打包后的 html 文件，该文件引入了整个项目的启动 js 文件（build.js 或者 main.js）,不会加载拆包后没有用到的 js 文件。当在浏览器中执行启动 js 文件时，该文件会将用到的 js 文件通过创建 script 标签的形式去加载拆包的 js 文件，请求回来的js文件一解析执行就会触发已经在前端被定义好的方法——webpackJsonpCallback，这个方法会将请求回来js的文件依次内容挂载到modules，同时执行相应文件之前准备的promise的resolve方法。当所有文件都加载完成且promise的resolve方法都成功调用后，将触发Promise.all，然后在promise.all的then方法中依次触发require方法，加载并执行已经挂载到modules上的请求回来的js文件内容。

```js
debugger;
var modules = {}; // 模块定义存放在这个对象中
var cache = {};

function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {}
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  }
};

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

require.r = (exports) => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    });
  }
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
};

function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0;
  }
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  //依次取出promise的resolve方法，让它对应的promise变成成功态
  while (resolves.length) {
    resolves.shift()();
  }
}

//已经安装过的，或者说已经加载好的代码块
//key是代码块的名字，值是代码块的状态
//main就是默认代码块的名称 0表示已经加载完成
var installedChunks = {
  main: 0
  //当一个代码块它的值是一个数组的时候表示此代码块对应的JS文件正在加载中
  //'src_hello_js':[resolve,reject,promise]=>0
};

require.f = {};
require.p = ''; // 这个值取的是webpack文件中output配置项中的publicPath的值。
require.u = (chunkId) => chunkId + '.js';
require.l = (url) => {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
  script.onload = ()=>{
    script.remove()
  }
};

//jsonp 通过JSONP的方式加载chunkId对应的JS文件，生成一个promise放到promises数组里
require.f.j = (chunkId, promises) => {
  let installedChunkData = installedChunks[chunkId];
  if(installedChunkData===0){
    return 
  }
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise;
  //installedChunkData=[resolve,reject,promise]
  promises.push(promise);
  const url = require.p + require.u(chunkId);
  require.l(url);
};

require.e = (chunkId) => {
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
};

const chunkLoadingGlobal = (window['webpackChunk_2_bundle'] = []);

chunkLoadingGlobal.push = webpackJsonpCallback;

require
  .e('src_hello_js')
  .then(require.bind(require, './src/hello.js'))
  .then((result) => {
    console.log(result.default);
  });

//代码块其实就模块的集合
```



```js
(self['webpackChunk_2_bundle'] = self['webpackChunk_2_bundle'] || []).push([
  ['src_hello_js'],
  {
    './src/hello.js': (module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        default: () => _DEFAULT_EXPORT__
      });
      const _DEFAULT_EXPORT__ = 'hello';
    }
  }
]);
```

代码块：webpack 中每个入口都会对应一个代码块，代码块又是许多模块的集合。但是代码块又不局限于以入口 entry 来作为区分条件。 事实上每个 entry 和异步加载的模块都会产生一个代码块，该代码块由该入口文件及它的直接和间接依赖的模块所组成。（chunk） 每个 chunk 都会有一个 id。 id 可能是 entry 入口中设置的名字，也能是默认生产的名字。

懒加载一定意味着代码分割。



## AST

- 抽象语法树（Abstract Syntax Tree，AST）是源代码语法结构的一种抽象表示
- 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构
- 原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，可以精准的定位到声明语句、赋值语句、运算语句等，实现对代码的分析、优化、变更等操作

### 用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等
- 优化变更代码，改变代码结构使达到想要的结构

![ast](http://img.zhufengpeixun.cn/ast.jpg)



第一步：词法解析，拆成最小词法单元，一个个分词（token）都有自己的含义。

第二步：语法分析，生成 ast，树程序由一行行代码组成，每行代码都是 body 中的某个元素，body 本身是数组格式，每个元素都有一个类型（如：变量声明）是一个节点。



`JavaScript Parser`是把 JavaScript 源码转化为抽象语法树的解析器

JavaScript 的代表 parser 有哪些：

- SpiderMonkey
- estree（规范）
- esprima
- acorn
- babel parser



### AST节点

- [estree](https://github.com/estree/estree)
- [spec.md](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
- [astexplorer](https://astexplorer.net/)
- AST节点
  - File 文件
  - Program 程序
  - Literal 字面量，代表一个值， NumericLiteral（数字） StringLiteral（字符串） BooleanLiteral（布尔）
  - Identifier 标识符，代表一个变量
  - Statement 语句
  - Declaration 声明语句
  - Expression 表达式
  - Class 类
  - VariableDeclaration 变量声明，一个 VariableDeclaration 中可能存在多个 VariableDeclarator，一行声明多个变量
  - VariableDeclarator
  - FunctionDeclaration，函数声明
  - BlockStatement，块级语句



### 遍历语法树

AST**是深度优先遍历**

```shell
npm install esprim estraverse escodegen -S
```

esprim：把 JS 源代码转成 AST 语法树

estraverse：遍历语法树,修改树上的节点

escodegen：把 AST 语法树重新转换成代码

```js
let esprima = require('esprima'); //把JS源代码转成AST语法树
let estraverse = require('estraverse'); ///遍历语法树,修改树上的节点
let escodegen = require('escodegen'); //把AST语法树重新转换成代码

let code = `function ast(){}`;
let ast = esprima.parse(code);

let indent = 0;
const padding = () => ' '.repeat(indent);

// 深度优先遍历
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + '进入');
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'newAst'; // 修改函数名字
    }
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + '离开');
  }
});

const result = escodegen.generate(AST);
console.log(result); // 重新生成代码
```

```
Program进入
  FunctionDeclaration进入
    Identifier进入
    Identifier离开
    BlockStatement进入
    BlockStatement离开
  FunctionDeclaration离开
Program离开
```

![image-20230430112849654](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230430112849654.png)



## babel

工作过程分为三个部分：

- Parse(解析) 将源代码转换成抽象语法树，树上有很多的[estree 节点](https://github.com/estree/estree)

- Transform(转换) 对抽象语法树进行转换

- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![ast-compiler-flow.jpg](https://img.zhufengpeixun.com/ast-compiler-flow.jpg)



### babel 插件

- [@babel/parser](https://github.com/babel/babel/tree/master/packages/@babel/parser) 可以把源码转换成 AST
- [@babel/traverse](https://www.npmjs.com/package/babel-traverse)用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- [@babel/generate](https://github.com/babel/babel/tree/master/packages/@babel/generate) 可以把 AST 生成源码，同时生成 sourcemap

- [@babel/types](https://github.com/babel/babel/tree/master/packages/babel-types) 用于 AST 节点的工具库, 它包含了构造节点、验证节点类型以及变换 AST 节点的方法
- [@babel/template](https://www.npmjs.com/package/@babel/template)可以简化 AST 的创建逻辑，快速创建结点
- [@babel/code-frame](https://www.npmjs.com/package/@babel/code-frame)可以打印代码位置
- [@babel/core](https://www.npmjs.com/package/@babel/core) Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
- [babylon](https://www.npmjs.com/package/babylon) Babel 的解析器，以前叫 babel parser,是基于 acorn 扩展而来，扩展了很多语法,可以支持 es2020、jsx、typescript 等语法
- [babel-types-api](https://babeljs.io/docs/en/next/babel-types.html)
- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babeljs.io](https://babeljs.io/en/repl.html) babel 可视化编译器
- [babel-types](https://babeljs.io/docs/en/babel-types)
- [类型别名](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2489-L2535)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types)



## AST 的前置知识

### 访问器模式

- 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- **Visitor 的对象中定义了用于 AST 中获取具体节点的方法**
- **Visitor 上挂载以节点 `type` 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法**
- 说白了 Visitor 就是一个对象，该对象可以提供许多不同的方法（这些方法的名字就是AST中不同节点的名字），供给不同的访问者调用不同的方法
- 插件就是一个访问器对象，每个插件只关注一个 AST 中不同的节点类型，并对这些关注的节点进行操作



### path

语法树上的每个节点会对应一个路径

[path](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/path/index.ts)

路径对象上的属性或者方法：

- node 当前 AST 节点
- parent 父 AST 节点
- parentPath 父 AST 节点的路径
- scope 作用域
- get(key) 获取某个属性的 path
- set(key, node) 设置某个属性
- is 类型(opts) 判断当前节点是否是某个类型
- find(callback) 从当前节点一直向上找到根节点(包括自己)
- findParent(callback)从当前节点一直向上找到根节点(不包括自己)
- insertBefore(nodes) 在之前插入节点
- insertAfter(nodes) 在之后插入节点
- replaceWith(replacement) 用某个节点替换当前节点
- replaceWithMultiple(nodes) 用多个节点替换当前节点
- replaceWithSourceString(replacement) 把源代码转成 AST 节点再替换当前节点
- remove() 删除当前节点
- traverse(visitor, state) 遍历当前节点的子节点,第 1 个参数是节点，第 2 个参数是用来传递数据的状态
- skip() 跳过当前节点子节点的遍历
- stop() 结束所有的遍历

每个路径对应一个节点。



### scope

- [scope](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/scope/index.ts)

scope 对象上的属性或者方法：

- scope.bindings 当前作用域内声明的所有变量
- scope.path 生成作用域的节点对应的路径
- scope.references 所有的变量引用的路径
- getAllBindings() 获取从当前作用域一直到根作用域的集合
- getBinding(name) 从当前作用域到根使用域查找变量
- getOwnBinding(name) 在当前作用域查找变量
- parentHasBinding(name, noGlobals) 从当前父作用域到根使用域查找变量
- removeBinding(name) 删除变量
- hasBinding(name, noGlobals) 判断是否包含变量
- moveBindingTo(name, scope) 把当前作用域的变量移动到其它作用域中
- generateUid(name) 生成作用域中的唯一变量名,如果变量名被占用就在前面加下划线



### 转换箭头函数插件

```js
const core = require('@babel/core');
const types = require('@babel/types');
const arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions');

let arrowFunctionPlugin2 = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { node } = path;
      node.type = 'FunctionExpression';
      hoistFunctionEnvironment(path);
      const body = node.body;
      //判断body节点是不是BlockStatement
      if (!types.isBlockStatement(body)) {
        //快速方便的构建节点
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
    }
  }
};

function hoistFunctionEnvironment(path) {
  //1.看看当前节点里有没有使用到this
  const thisPaths = getThisPaths(path);
  if (thisPaths.length > 0) {
    //可以用来生成_this变量的路径
    const thisEnv = path.findParent((parent) => {
      //如果是函数，但是不是箭头函数的话就返回true
      //return types.isFunctionDeclaration(parent)|| parent.isProgram();;
      return (parent.isFunction() && !parent.isArrowFunctionExpress()) || parent.isProgram();
    });
    let thisBindings = '_this';
    //如果此路径对应的作用域中没_this这个变量
    if (!thisEnv.scope.hasBinding(thisBindings)) {
      //向它对应的作用域里添加一个变量 ，变量名_this,变量的值this
      const thisIdentifier = types.identifier(thisBindings);
      thisEnv.scope.push({
        id: thisIdentifier,
        init: types.thisExpression()
      });
      thisPaths.forEach((thisPath) => {
        thisPath.replaceWith(thisIdentifier);
      });
    }
  }
}

function getThisPaths(path) {
  let thisPaths = [];
  //遍历此路径所有的子路径
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    }
  });
  return thisPaths;
}
//这是JS源代码，用字符串表示
const sourceCode = `
const sum = (a,b)=>{
  const minis = (a,b)=>{
    console.log(this);
    return a-b;
  }
  return a+b;
}
`;

const result = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin2]
});
console.log(result.code);

/**
var _this = this;
const sum = (a,b)=>{
   console.log(_this);
  return a+b;
}
 */
```



### 日志插件

```js
const core = require('@babel/core');
const types = require('@babel/types');
const pathLib = require('path');
//state代表状态，用在在插件处理的过程传递一些值或者变量
let arrowFunctionPlugin2 = {
  visitor: {
    CallExpression(path, state) {
      state.age = 100;
      const { node } = path;
      if (types.isMemberExpression(node.callee)) {
        if (node.callee.object.name === 'console') {
          if (['log', 'info', 'warn', 'error', 'debug'].includes(node.callee.property.name)) {
            //获取这个console.log节点所在的行和列
            const { line, column } = node.loc.start;
            const filename = pathLib.relative(__dirname, state.file.opts.filename);
            node.arguments.unshift(types.stringLiteral(`${filename} ${line}:${column}`));
          }
        }
      }
    },
    FunctionExpression(path,state){
       console.log(state.age)  // 100   
    }
  }
};
//实现一个日志插件
const sourceCode = `
  console.log('hello');
`;
const result = core.transform(sourceCode, {
  filename: 'main.js',
  plugins: [arrowFunctionPlugin2]
});
console.log(result.code);
```





### 数据埋点

当调用方法时，向服务器发送一个请求，通知服务器。

```js
const core = require('@babel/core')
const types = require('@babel/types')
const pathLib = require('path')
const autoTrackerPlugin = require('./auto-tracker-plugin')

const sourceCode = `
	function sum(a, b){
		return a + b
	};
	
	const multiply = function(a, b){
		return a * b 
	};
	
	const minus = (a, b)=>a + b;
	
	class Calculator{
		divide(a, b){
			return a/b
		}
	}
`
const result = core.transform(sourceCode,{
  plugins: [autoTrackerPlugin({name:'logger'})]
});
console.log(result.code);
```



auto-tracker-plugin.js：

```js
const core = require('@babel/core');
const types = require('@babel/types');
const template = require('@babel/template');
const importModule = require('@babel/helper-module-imports');
/**
 * babel插件可以写为一个对象，也可以写为一个函数，写为函数是，可以调用函数并传参
 * 实现此插件需要二步
 * 1.判断是否源代码里已经引入了logger模块，如果引入了直接用，如果没有引入要手工引入
 * 2.找到代码中所有的函数，向里面插件调用logger方法
 */
const autoTrackerPlugin = (options) => {
  return {
    visitor: {
      Program: {
        enter(path,state) {
          let loggerId;
          path.traverse({
            ImportDeclaration(path) {//此方法会进入多次
              const importedModuleName = path.get('source').node.value;
              if (importedModuleName === options.name) {
                const specifierPath = path.get('specifiers.0');
                if (specifierPath.isImportDefaultSpecifier()//默认导入 import logger from 'logger'
                  || specifierPath.isImportSpecifier()//普通导入 import {logger} from 'logger'
                 ||specifierPath.ImportNamespaceSpecifier()) {//命名空间导入  import * as logger from
                  loggerId = specifierPath.node.local.name;
                }
                path.stop();//不再遍历了，跳过后续的所有的查找和遍历
              }
            }
          });
          //如果loggerId在遍历完了以后还是undefined。说明源码中没有主动引入logger
          if (!loggerId) {
            //  import xx from 'logger'
            loggerId = importModule.addDefault(path, options.name, {
              nameHint:path.scope.generateUid(options.name)
            });
          }
          //ejs 模板引擎 返回的是一个语法树的节点
          state.loggerNode = template.statement(`LOGGER();`)({
            LOGGER:loggerId
          });
        }
      },
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(path,state) {
        const { node } = path;
        if (node.id&&options.whiteLists.includes(node.id.name)) {
          ///如果它的body已经是一个语句块了，直接在块的开始添加方法调用即可
        if (types.isBlockStatement(node.body)) {
          node.body.body.unshift(state.loggerNode);
        } else {
          const newNode = types.blockStatement([
            state.loggerNode,
            types.expressionStatement(node.body)
          ]);
          path.get('body').replaceWith(newNode);
        }
        }
      }
    }
  }
}
module.exports = autoTrackerPlugin;
```

先学习 

转化后的代码：

```js
const sourceCode = `
	import logger from 'logger'
	
	function sum(a, b){
		logger()
		return a + b
	};
	
	const multiply = function(a, b){
		logger()
		return a * b 
	};
	
	const minus = (a, b)=>{
		logger()
		return a + b
	};
	
	class Calculator{
		divide(a, b){
			logger()
			return a/b
		}
	}
`
```

上面这些插件都可以在babel-loader中进行配置后使用。



模拟eslint：

```js
function eslintPlugin({fix}) {
  return {
    pre(file) {
      file.set('errors',[]);
    },
    visitor: {
      CallExpression(path,state) {
        const { node } = path;
        const errors = state.file.get('errors');
        if (node.callee.object && node.callee.object.name === 'console') {
          Error.stackTraceLimit = 0;
          errors.push(path.buildCodeFrameError(`代码中不能出现console.log语句`),Error);
          if (fix) {
            path.parentPath.remove();
          }
        }
      }
    },
    post(file) {
      console.log(file.get('errors'));
    }
  }
}
module.exports = eslintPlugin;
```



模拟代码压缩：

uglifyPlugin.js

其中的Scopable是类型别名，其实就是一系列ast节点名的组合，类似于TS的联合类型。

- [类型别名](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2174-L2191)

```js
function uglifyPlugin() {
  return {
    visitor: {
      Scopable(path) {
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          //在当前的作用域中生成一个不重复的变量名
          const newName = path.scope.generateUid('t');
          // age => ? name=？
          binding.path.scope.rename(key,newName);
        });
      }
    }
  }
}
module.exports = uglifyPlugin;
```



按需加载：

以lodash为例子，babel-plugin-import，且这个库只支持antd，antd-mobile，lodash，materia-ui。

webapck.config.js:

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options:{
                   plugins:[
                     [
                       'babel-plugin-import',
                       {
                         libraryName:'lodash', // 查看lodash的核心包，可以发现，lodash中每个功能函数都直接放在loadsh文件夹的根目录中，而babel-plugin-import插件默认是取目标库下面的lib文件夹中找对应的文件，所以还需要设置库的目标文件所在的目录。
                         libraryDirectory:''  // 这个值默认是lib
                       }
                     ]
                   ]
                }
        },
      },
    ],
  },
};
```

按需加载的本质：

```js
import { flatten, concat } from "lodash";
// 转为下面的代码形式
import flatten from "lodash/flatten";
import concat from "lodash/flatten";
```

![image-20230430174616023](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230430174616023.png)

转为：

![image-20230430174629719](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230430174629719.png)

编译顺序为首先`plugins`从左往右,然后`presets`从右往左。



```js
//babel核心模块
const core = require('@babel/core');
//用来生成或者判断节点的AST语法树的节点
let types = require("@babel/types");

const visitor = {
    ImportDeclaration(path, state) {
        const { node } = path;//获取节点
        const { specifiers } = node;//获取批量导入声明数组
        const { libraryName, libraryDirectory = 'lib' } = state.opts;//获取选项中的支持的库的名称
        //如果说此节点导入的包名和配置的按需加载包名是一样的，并且不是默认导入的话
        if (node.source.value === libraryName
            //并且导入不是默认导入才会进来
            && !types.isImportDefaultSpecifier(specifiers[0])) {
            //遍历批量导入声明数组
            const declarations = specifiers.map(specifier => {
                //返回一个importDeclaration节点
                return types.importDeclaration(
                    //导入声明importDefaultSpecifier flatten
                    [types.importDefaultSpecifier(specifier.local)],
                    //导入模块source lodash/flatten
                    types.stringLiteral(libraryDirectory ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}` : `${libraryName}/${specifier.imported.name}`)
                );
            })
            path.replaceWithMultiple(declarations);//替换当前节点
        }
    }
}


module.exports = function () {
    return {
        visitor
    }
}
```

注意，在webpack配置文件中配置该插件后，传给插件的参数的方式是以下这种：

```js
{
  test: /\.js$/,
  use: {
    loader: "babel-loader",
    options:{
      plugins:[
        [
        	'babel-plugin-import',
          {
          libraryName:'lodash', 
          libraryDirectory:'' 
          }
        ]
      ]
    }
  },
},
```

这种方式传参时，对应插件中获取这些参数的方式是通过下面这种方式获取：

```
const { libraryName, libraryDirectory = 'lib' } = state.opts;//获取选项中的支持的库的名称
```



在webpack中使用自己编写的bable插件：

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options:{
                   plugins:[
                     [
                       path.resolve(__dirname,'plugins/babel-plugin-import.js'),
                       {
                         libraryName:'lodash',
                         libraryDirectory:''
                       }
                     ],
                      [
                       path.resolve(__dirname,'plugins/babel-plugin-import.js'),
                       {
                         libraryName:'antd'
                       }
                     ]
                   ]
                }
        },
      },
    ],
  },
};
```



上面的代码中@babel/types 两个作用 1.判断某个节点是不是某个类型 2.快速通过工厂方法创建节点实例

[Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)

**babel参考资料：**

- [Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
- [babel-types](https://github.com/babel/babel/tree/master/packages/babel-types)
- [不同的 parser 解析 js 代码后得到的 AST](https://astexplorer.net/)
- [在线可视化的看到 AST](http://resources.jointjs.com/demos/javascript-ast)
- [babel 从入门到入门的知识归纳](https://zhuanlan.zhihu.com/p/28143410)
- [Babel 内部原理分析](https://octman.com/blog/2016-08-27-babel-notes/)
- [babel-plugin-react-scope-binding](https://github.com/chikara-chan/babel-plugin-react-scope-binding)
- [transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译,启用插件 `babel-plugin-transform-runtime` 后，Babel 就会使用 babel-runtime 下的工具函数
- [ast-spec](https://github.com/babel/babylon/blob/master/ast/spec.md)
- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)



## webpack 工作流

面试问

### 调试 webpack

方式一：

package.json 中

```json
{
  "script": {
    "build":"webpack"
  }
}
```

当执行这个脚本命令时，找到项目根目录下 node_modules 目录下的.bin 目录下的 webpack.cmd，该文件中执行的是 node_modules 目录下的 webpack/bin/webpack.js 文件，该文件中会去调用 webpack-cli 目录中的 bin 目录中的 cli.js 文件。所以可以直接调试 cli 文件：

```js
node --inspect-brk ./node_modules/webpack/bin/webpack.js


node --inspect-brk ./node_modules/webpack-cli/bin/cli.js
```

> 然后打开 Chrome 浏览器控制台调试

<img src="./webpack-张仁阳.assets/image-20230213214843358.png" alt="image-20230213214843358" style="zoom:50%;" />



方式二：

在 vscode 中通过调试文件进行 webpack 源码调试。

- 打开工程目录，点击调试按钮，再点击小齿轮的配置按钮系统就会生成 `launch.json` 配置文件
- 修改好了以后直接点击 F5 就可以启动调试

.vscode\launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug webpack",
      "skipFiles": ["<node_internals>/**"],  // 跳过node核心模块代码
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
    }
  ]
}
```

> 在webpack-cli包中的cli.js文件中添加断点后便可以开始调试。



方式三：

vscode 中启动该文件进行调试 debugger.js:

```js
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
dubugger;
const compiler = webpack(webpackConfig);  
//4.执行Compiler对象的 run 方法开始执行编译
compiler.run((err, stats) => {
  if (err) {
    console.log(err);
  } else {
    //stats代表统计结果对象
    console.log(
      stats.toJson({
        assets: true, // 其它是一个代码块（chunk）到文件的对应关系
        chunks: true, // 从入口模块出发，找到此入口模块依赖的模块，或者依赖的模块依赖的模块，合在一起组成一个代码块
        modules: true // 打包的模块，项目源码仓库中的每个文件都是一个模块（js文件，jsx文件，图片，html，css等）
      })
    );
  }
});
```



打包后生产文件需要注意的地方：

index.js源文件：

```js
const title = require('./title.js')

console.log('entry1',title)
```

title.js源文件：

```js
const msg = require('./msg.js')

console.log(msg,'msg')

module.exports = 'title' 
```

msg.js源文件：

```js
module.exports = 'msg' 
```

index.js是项目的入口文件。

打包后生成的结果：

```js
(() => {
  var modules = {

    "./src/msg.js": module => {
      module.exports = 'msg';
    }
    ,
    "./src/title.js": module => {
      let msg = require("./src/msg.js"); // 源码中是./msg.js

      module.exports = 'title' + msg;
    }

  };
  var cache = {};
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  var exports = {};
  (() => {
    let title = require("./src/title.js"); // 源码中是./title.js
    console.log('entry1', title);
  })();
})();
```

从中可以看到，在源文件的源码中，引入其他模块文件时，使用的都是从该模块文件出发到目标文件的相对路径。但是打包后生成的文件中，所有源码中的模块导入语句中的路径都变成了以项目根目录为统一出发点的相对路径。



### loader

webpack 的 loder 的本质就是一个 JavaScript 函数，用于转换或者翻译 webpack 不能识别的模块转为 js 或者 json 模块。

webpack.config.js:

```js
module.exports = {
    module:{
        rules:[
            {
                test:/\.xxx$/,
                use:[
                    path.resolve(__dirname,'loaders/loder1.js')
                    path.resolve(__dirname,'loaders/loder2.js')
                ]
            }
        ]
    }
}
```

loaders/loader1.js:

```js
function loader1(source) {
  return source + '------';
}

module.exports = loader1;
```

loaders/loader2.js:

```js
function loader2(source) {
  // return source+'++++'
  return `module.exports = ${source}+++++++`;
}

module.exports = loader2;
```





### tapable

- tapable 是一个类似于 Node.js 中的 EventEmitter 的库，但更专注于自定义事件的触发和处理
- webpack 通过 tapable 将实现与流程解耦，所有具体实现通过插件的形式存在

```js
class SyncHook {
  constructor(args) {
    this.args = args;
    this.argsLength = args ? args.length : 0;
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call() {
    let args = Array.prototype.slice.call(arguments, 0, this.argsLength);
    this.taps.forEach((tap) => tap(...args));
  }
}

let hook = new SyncHook();

hook.tap('some name', () => {
  console.log('some name');
});

class Plugin {
  apply() {
    hook.tap('Plugin', () => {
      console.log('Plugin ');
    });
  }
}
new Plugin().apply();
hook.call();
```



### plugin

在 webpack 中，有非常多类似 SyncHook 这种构造函数的**实例属性值**，写插件就是在这些实例属性值的订阅数组中添加一系列的方法。然后在 webpack 开始打包编译之后在各个阶段调用这些实例属性值中订阅好的方法，并执行逻辑。

webpack 插件的格式是固定的，插件是一个类，需要实例化，实例化后的值有一个原型方法 apply。

**插件的之间的书写顺序并不会影响各个插件的执行顺序，但是如果两个插件监听的是一个 hook，那么书写顺序就和执行顺序有关了。**

插件的挂载或者说监听是在 webpack 启动编译前全部挂载的。具体由哪些 hook 实例属性值，可以在官网中查看。

plugins/run1-plugin.js

```js
class RunPlugin {
  apply(compiler) {
    // 在此插件里可以监听run这个钩子
    // compiler上面就有许多的hook类的实例，比如run
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('run1:开始编译');
    });
  }
}
module.exports = RunPlugin;
```

plugins/run2-plugin.js

```js
class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('run2:开始编译');
    });
  }
}
module.exports = RunPlugin;
```

plugins/done-plugin.js

```js
class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('done:结束编译');
    });
  }
}
module.exports = DonePlugin;

/* let compiler = {
  hooks: {
    run:new Hook(),
    done:new Hook()
  }
} */
```



webpack.config.js

```js
const path = require('path');
const Run1Plugin = require('./plugins/run1-plugin');
const Run2Plugin = require('./plugins/run2-plugin');
const DonePlugin = require('./plugins/done-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    //插件的挂载或者说监听是在编译启动前全部挂载的
    new Run1Plugin(),
    new Run2Plugin(),
    new DonePlugin()
  ]
};
```

babel 和 webpack 的关系是什么？ 执行顺序是？ webpack 在编译的时候，如果遇到 js 文件，会调用 babel-loader 进行文件内容的转换在 babel 转换的时候会使用 babel 插件来转换。



### webpack 编译流程

配置文件参考：

webpack.config.js:

```js
const path = require('path');
const Run1Plugin = require('./plugins/run1-plugin');
const Run2Plugin = require('./plugins/run2-plugin');
const DonePlugin = require('./plugins/done-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  cache: {
    type :'filesystem'
  },
  entry: {
    entry1: './src/entry1.js',
    entry2:'./src/entry2.js'  // name就是此模块属于哪个模块
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:'[name].js'
  },
  resolve: {
    extensions:['.js','.jsx','.ts','.tsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          //最左则的loader需要返回合法的JS
          path.resolve(__dirname, 'loaders/loader2.js'),
          //最右侧的loader拿到的是源代码
          path.resolve(__dirname, 'loaders/loader1.js')
        ]
      }
    ]
  },
  plugins: [
    //插件的挂载或者说监听是在编译启动前全部挂载的
    new Run1Plugin(),
    new Run2Plugin(),
    new DonePlugin()
   ]
}
```



1. **初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象**

2. **用上一步得到的配置对象初始化 `Compiler` 对象**

3. **加载(挂载)所有配置的插件，插件是在编译开始之前全部挂载（订阅）好的，等到后面编译过程中触发插件的中各种订阅函数**

4. **执行 Compiler 对象的 run 方法开始执行编译**

5. **根据配置中的`entry`找出入口文件**

6. **从入口文件出发,调用所有配置的`Loader`对模块进行编译**

7. **再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理**

8. **根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk**

9. **再把每个 Chunk 转换成一个单独的文件加入到输出列表**

10. **在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统**

    在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到对应的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

    

    
    dubugger.js:
    
    ```js
    const webpack = require('./webpack');
    const webpackConfig = require('./webpack.config');
    dubugger;
    const compiler = webpack(webpackConfig);
    //4.执行`Compiler`对象的 run 方法开始执行编译
    compiler.run((err, stats) => {
      if (err) {
        console.log(err);
      } else {
        //stats代表统计结果对象
        console.log(
          stats.toJson({
            files: true, //代表打包后生成的文件
            assets: true, //其它是一个代码块到文件的对应关系
            chunks: true, //从入口模块出发，找到此入口模块依赖的模块，或者依赖的模块依赖的模块，合在一起组成一个代码块
            modules: true //打包的模块
          })
        );
      }
    });
    ```
    
    
    
    
    
    
    webpack.js:
    
    ```js
    const Compiler = require("./Compiler");
    
    function webpack(options) {
      // 1.初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
      //argv[0]是Node程序的绝对路径 argv[1] 正在运行的脚本
      const argv = process.argv.slice(2);  // 真正需要的shell参数
      const shellOptions = argv.reduce((shellOptions,options)=>{
        // options = '--mode=development'
        const [key,value] = options.split('=');
        shellOptions[key.slice(2)] = value;
        return shellOptions;
      }, {});
      
      const finalOptions = { ...options, ...shellOptions };  // 这里就体现的shell中设置参数的权重更高的原因
      
      //2.用上一步得到的参数初始化 `Compiler` 对象，单例的
      const compiler = new Compiler(finalOptions);
      
      //3.加载所有配置的插件  plugins这就是插件类的实例组成的数组
      const { plugins } = finalOptions;
      for (let plugin of plugins) {
        plugin.apply(compiler);
      }
      return compiler;
    }
    
    module.exports = webpack;
    ```
    
    
    
    Compiler.js:
    
    ````js
    const { SyncHook } = require('tapable');
    const Compilation = require('./Compilation');
    const fs = require('fs');
    const path = require('path');
    
    // Compiler代表整个编译过程，在编译一启动时创建，贯穿整个编译打包的生命周期且是单例的，整个编译打包过程中就一个实例。
    class Compiler {
      constructor(options) {
        this.options = options;
        this.hooks = {
          // Compiler 实例上有许多构造函数实例化后的钩子
          run: new SyncHook(), // 在开始编译之前调用
          done: new SyncHook() // 在编译完成时执行
        };
      }
      
      run(callback) {
        this.hooks.run.call(); // 在编译开始前触发run钩子执行
        
        // 在编译的过程中会收集所有依赖的模块或者说文件
        // stats指的是统计信息 modules chunks  files=bundle assets指的是文件名和文件内容的映射关系
        const onCompiled = (err, stats, fileDependencies) => {
          console.log('stats', stats);
          console.log('fileDependencies', fileDependencies);
          //10.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
          for (let filename in stats.assets) {
            let filePath = path.join(this.options.output.path, filename);
            fs.writeFileSync(filePath, stats.assets[filename], 'utf8');
          }
          callback(err, { toJson: () => stats });
          for (let fileDependency of fileDependencies) {
            //监听依赖的文件变化，如果依赖的文件变化后会开始一次新的编译
            fs.watch(fileDependency, () => this.compile(onCompiled));
          }
          this.hooks.done.call(); // 在编译完成时触发done钩子执行
        };
        
        // 调用compile方法进行编译
        this.compile(onCompiled);
      }
      
      // 开启一次新的编译
      compile(callback) {
        // 每次编译 都会创建一个新的Compilation实例
        let compilation = new Compilation(this.options, this);
        compilation.build(callback);
      }
    }
    
    module.exports = Compiler;
    ````
    
    
    
    
    
    Compilation.js:
    
    ````js
    const path = require('path')
    const fs = require('fs');
    const parser = require('@babel/parser');
    const types = require('@babel/types');
    const traverse = require('@babel/traverse').default;
    const generator = require('@babel/generator').default;
    
    const baseDir = normalizePath(process.cwd());
    function normalizePath(path) {
      return path.replace(/\\/g, '/');
    }
    
    class Compilation {
      constructor(options, compiler) {
        this.options = options;
        this.compiler = compiler;
        this.modules = [];// 这里放置本次编译涉及的所有的模块
        this.chunks = [];// 本次编译所组装出的代码块
        this.assets = {};// key是文件名,值是文件内容
        this.files = [];// 代表本次打包出来的文件
        this.fileDependencies =new Set();// 本次编译依赖的文件或者说模块
      }
      
      build(callback) {
        // 5.根据配置中的entry找出入口文件
        let entry = {};
        if (typeof this.options.entry === 'string') {
          entry.main = this.options.entry;
        } else {
          entry = this.options.entry;
        }
        
        for (let entryName in entry) {
          //   const baseDir = normalizePath(process.cwd());
          let entryFilePath = path.posix.join(baseDir, entry[entryName]);  // 将entry中的相对地址转为从磁盘根路径出发的绝对地址
          
          this.fileDepxendencies.add(entryFilePath);
          // 6.从入口文件出发,调用所有配置的Loader对模块进行编译
          let entryModule = this.buildModule(entryName, entryFilePath);
          // this.modules.push(entryModule);
          // 8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
          let chunk = {
            name: entryName,
            entryModule,
            modules:this.modules.filter(module=>module.names.includes(entryName))
          }
          this.chunks.push(chunk);
        }
        
        //9.再把每个 Chunk 转换成一个单独的文件加入到输出列表
        this.chunks.forEach(chunk => {
          const filename = this.options.output.filename.replace('[name]',chunk.name);
          this.files.push(filename);
          this.assets[filename] = getSource(chunk);
        });
        
        callback(null, {
          modules: this.modules,
          chunks: this.chunks,
          assets: this.assets,
          files: this.files,
        }, this.fileDependencies);
      }
      /**
       * 编译模块
       * @param {*} name 模块所属的代码块(chunk)的名称，也就是entry配置项的key entry1 entry2
       * @param {*} modulePath 模块的路径，绝对路径
       */
      buildModule(name, modulePath) {
        //1.读取文件的内容
        let sourceCode = fs.readFileSync(modulePath, 'utf8');  // 同步读取文件内容
        let { rules=[] } = this.options.module;
        //根据规则找到所有的匹配的loader
        let loaders = [];
        rules.forEach(rule => {   // 从这段代码逻辑可以看出，针对某个类型的文件会遍历webpack配置文件中的所有rule，命中其中符合test规则的文件，然后用loader进行处理，如果有多个规则都能命中同一个文件，那么都会对前面rule处理过的文件源码进行进一步处理。
          if (modulePath.match(rule.test)) {
            loaders.push(...rule.use);
          }
        });
        //调用所有配置的Loader对模块进行转换
        sourceCode = loaders.reduceRight((sourceCode, loader) => {
          return require(loader)(sourceCode);
        }, sourceCode);
        
        // 7.再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理 ， 找出某个模块文件中依赖的其他模块则是通过AST查找获取
        // 声明当前模块的ID
        let moduleId = './' + path.posix.relative(baseDir, modulePath);  // relative方法返回一个相对的路径
        //创建一个模块，ID就是相对于根目录的相对路径，dependencies就是此模块依赖的模块
        //name是模块所属的代码块的名称, 如果一个模块属于多个代码块，那么name就是一个数组（比如一个模块被多个入口中的其他模块都引用了。）
        let module = { id: moduleId, dependencies: [], names: [name] };
        let ast = parser.parse(sourceCode, { sourceType: 'module' });
        //Visitor是babel插件中的概念，此处没有
        traverse(ast, {
          CallExpression:({ node }) =>{
            if (node.callee.name === 'require') {
              let depModuleName = node.arguments[0].value; // "./title"
              let depModulePath;
              if (depModuleName.startsWith('.')) {
                //暂时先不考虑node_modules里的模块，先只考虑相对路径
                const currentDir = path.posix.dirname(modulePath);
                //要找当前模块所有在的目录下面的相对路径
                depModulePath = path.posix.join(currentDir, depModuleName);
                //此绝对路径可能没有后续，需要尝试添加后缀
                const extensions = this.options.resolve.extensions;
                depModulePath = tryExtensions(depModulePath, extensions);
              } else {//如果不是以.开头的话，就是第三方模块
                depModulePath = require.resolve(depModuleName)
              }
              this.fileDependencies.add(depModulePath);
              //获取依赖的模块的ID,修改语法树，把依赖的模块名换成模块ID
              let depModuleId = './' + path.posix.relative(baseDir, depModulePath)
              node.arguments[0] = types.stringLiteral(depModuleId);
              //把依赖的模块ID和依赖的模块路径放置到当前模块的依赖数组中
              module.dependencies.push({
                depModuleId,
                depModulePath
              });
            }
          }
        })
        //使用改造后的ast语法要地重新生成新的源代码
        let { code } = generator(ast);
        module._source = code;
        
        // 递归当前模块依赖的其他模块
        module.dependencies.forEach(({ depModuleId, depModulePath }) => {
          //判断此依赖的模块是否已经打包过了或者说编译 过了
          let existModule = this.modules.find(module => module.id === depModuleId);
          if (existModule) {
            existModule.names.push(name);
          } else {
            let depModule = this.buildModule(name, depModulePath);   // 这里的name使用的是第一次传入的那个值，如entry1和entry2
            this.modules.push(depModule);
          }
        });
        return module;
      }
    }
    
    function tryExtensions(modulePath,extensions) {
      if (fs.existsSync(modulePath)) {
        return modulePath;
      }
      for (let i = 0; i < extensions.length; i++){
        let filePath = modulePath + extensions[i];
        if (fs.existsSync(filePath)) {
          return filePath;
        }
      }
      throw new Error(`找不到${modulePath}`);
    }
      
    function getSource(chunk) {
      return `
      (() => {
        var modules = {
          ${
            chunk.modules.map((module) => `
              "${module.id}": module => {
                ${module._source}
              }
            `).join(',')
          }
        };
        var cache = {};
        function require(moduleId) {
          var cachedModule = cache[moduleId];
          if (cachedModule !== undefined) {
            return cachedModule.exports;
          }
          var module = cache[moduleId] = {
            exports: {}
          };
          modules[moduleId](module, module.exports, require);
          return module.exports;
        }
        var exports = {};
        (() => {
          ${chunk.entryModule._source}
        })();
      })();
      `;
    }
    module.exports = Compilation;
    ````
    
    
    
    
    

compiler和compilation概念辨析：

`compiler`实例对象上挂载着webpack环境所有的配置信息，包括loader，plugins，entry等等，`compiler`实例对象是在启动webpack的时候实例化好的，它是全局唯一的，可以理解为webpack实例

`Compiler` 模块是 webpack 的主要引擎，它通过 [CLI](https://www.webpackjs.com/api/cli) 或者 [Node API](https://www.webpackjs.com/api/node) 传递的所有选项创建出一个 compilation 实例。 它扩展（extends）自 `Tapable` 类，**用来注册和调用插件**。 大多数面向用户的插件会首先在 `Compiler` 上注册。



compilation 对象代表了一次资源版本的构建。它包含了当前的模块资源(modules)、编译生成资源(asset)、变化的文件(files)、以及被跟踪依赖的状态信息(fileDependencies)等。当 webpack 以开发模式运行时，每当检测到一个依赖文件发生变化变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也可以读取到 compiler 对象。

`Compilation` 模块会被 `Compiler` 用来创建新的 compilation 对象（或新的 build 对象）。 `compilation` 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。

`Compilation` 类扩展(extend)自 `Tapable`，并提供了以下生命周期钩子。 可以按照 compiler 钩子的相同方式来调用 tap。



扩展：

> tapable 是 webpack 的一个核心工具，它暴露了 tap、tapAsync、tapPromise 方法，可以使用这些方法来触发 compiler 钩子，使得插件可以监听 webpack 在运行过程中广播的事件，然后通过 compiler 对象去操作 webpack。也可以使用这些方法注入自定义的构建步骤，这些步骤将在整个编译过程中的不同时机触发。 
>
> deps的变化会导致整个依赖链路上的内容都重新编译还是只编译变化部分？ 
>
> 如果有文件变化的话，在webpack5以前会全部会重新编译，比较慢，所以在webpack5以前可以使用：cache hardsource dllplugin等方法提升打包构建速度，但是 webpack5以后，内置这些缓存机制。





## loader

loader的细节。

- loader 是一个模块文件导出的函数。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain
- compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）



###  loader执行时机

![webpackflowloader](http://img.zhufengpeixun.cn/webpackflowloader.jpg)



### loader分类

loader有四种执行时机分类，它们的组合是有顺序的。

- post(后置)
- inline(内联)
- normal(正常)
- pre(前置)

一个loader在被具体配置到webpack之前，是没办法区分它是在具体的哪个时机被调用的。

因为loader配置可以是由多个配置文件合并而来，为了保证执行的时候按我们希望的顺序执行，所以可以给loader区分调用时机。



如何表示某个loader被放置在这四种执行时机中的哪一种？

1. 通过每个rule规则中，设置enforce配置项的值来解决，`enforce:'pre'|'post'|'normal',`不写默认normal
2. 或者通过loader 的内联写法实现，`inline-loader1!inline-loader2!${entryFile}`



### loader的工作

![image-20230219130529675](./webpack-张仁阳.assets/image-20230219130529675.png)

loader的调用是依赖**loader-runner**这个库进行的。

```js
const { runLoaders } = require("loader-runner");
const path = require("path");
const fs = require("fs");  // webpack-dev-server启开发服务器的时候 memory-fs
const entryFile = path.resolve(__dirname, "src/index.js");
//如何配置行内
let request = `inline-loader1!inline-loader2!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post-loader1", "post-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre-loader1", "pre-loader2"],
  },
];
let parts = request.split("!");  // [inline-loader1,inline-loader2, xxx/xxx/xx/src/index.js]
let resource = parts.pop(); // 弹出最后一个元素 entryFile=src/index.js

let inlineLoaders = parts; // [inline-loader1,inline-loader2]
let preLoaders = [], postLoaders = [], normalLoaders = [];

for (let i = 0; i < rules.length; i++){
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}

let loaders = [
  ...postLoaders,
  ...inlineLoaders,
  ...normalLoaders,
  ...preLoaders,
];

let resolveLoader = (loader) => path.resolve(__dirname, "loaders-chain", loader);  // loaders-chain是自己创建的文件夹，里面是自己写的loader

//把loader数组从名称变成绝对路径
loaders = loaders.map(resolveLoader);

runLoaders(
  {
    resource, //你要加载的资源
    loaders,
    context: { name: "zhufeng", age: 100 }, //保存一些状态和值
    readResource: fs.readFile.bind(this),
  },
  (err, result) => {
    console.log(err); //运行错误
    console.log(result); //运行的结果
    console.log(
      result.resourceBuffer ? result.resourceBuffer.toString("utf8") : null
    ); //读到的原始的文件
  }
);
```



### 内联loader的特殊配置

- [loaders/#configuration](https://webpack.js.org/concepts/loaders/#configuration)

| 符号 | 变量                 | 含义                                    |                                                              |
| :--- | :------------------- | :-------------------------------------- | ------------------------------------------------------------ |
| `-!` | noPreAutoLoaders     | 不要前置和普通 loader                   | Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders |
| `!`  | noAutoLoaders        | 不要普通 loader                         | Prefixing with ! will disable all configured normal loaders  |
| `!!` | noPrePostAutoLoaders | 不要前后置和普通 loader,只要内联 loader | Prefixing with !! will disable all configured loaders (preLoaders, loaders, postLoaders) |

```js
// loader分类跟loader自己没有关系，跟使用时候的配置有关系
// eslint-loader中配置的pre  babel-loader=normal
/**
 * Auto=Normal
 * !  noAuto
 * -! noPreAuto
 * !! noPrePostAuto
 */
```

```js
let request = `!inline-loader1!inline-loader2!${entryFile}`;

let request = `-!inline-loader1!inline-loader2!${entryFile}`;

let request = `!!inline-loader1!inline-loader2!${entryFile}`;
```

源码实现：

```diff
const { runLoaders } = require("./loader-runner");
const path = require("path");
const fs = require("fs");//webpack-dev-server启开发服务器的时候 memory-fs
const entryFile = path.resolve(__dirname, "src/index.js");
//如何配置行内
let request = `inline-loader1!inline-loader2!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post-loader1", "post-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre-loader1", "pre-loader2"],
  },
];
+ let parts = request.replace(/^-?!+/,'').split('!');
let resource = parts.pop();//弹出最后一个元素 entryFile=src/index.js
let inlineLoaders = parts;//[inline-loader1,inline-loader2]
let preLoaders = [],postLoaders=[],normalLoaders=[];
for(let i=0;i<rules.length;i++){
    let rule = rules[i];
    if(rule.test.test(resource)){
        if(rule.enforce==='pre'){
            preLoaders.push(...rule.use);
        }else if(rule.enforce==='post'){
            postLoaders.push(...rule.use);
        }else{
            normalLoaders.push(...rule.use);
        }
    }
}
+ let loaders = [];
+ if(request.startsWith('!!')){
+     loaders = [...inlineLoaders];
+     //noPreAutoLoaders
+ }else if(request.startsWith('-!')){
+     loaders = [...postLoaders,...inlineLoaders];
+ }else if(request.startsWith('!')){
+     //noAutoLoaders
+     loaders = [...postLoaders,...inlineLoaders,...preLoaders];
+ }else{
+     loaders = [...postLoaders,...inlineLoaders,...normalLoaders,...preLoaders];
+ }

let resolveLoader = loader=>path.resolve(__dirname,'loaders-chain',loader)
//把loader数组从名称变成绝对路径
loaders= loaders.map(resolveLoader);
runLoaders({
    resource,//你要加载的资源
    loaders,
    context:{name:'zhufeng',age:100},//保存一些状态和值
    readResource:fs.readFile.bind(this)
},(err,result)=>{
    console.log(err);//运行错误
    console.log(result);//运行的结果
    console.log(result.resourceBuffer?result.resourceBuffer.toString('utf8'):null);//读到的原始的文件
});
```





### pitch

- 比如 a!b!c!module, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个 pitching loader 返回了非空值就相当于在它以及它右边的 loader 已经执行完毕
- 比如如果 b的pitch 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b，并且源文件也没有被读取过 
- loader 根据返回值可以分为两种，一种是返回 js 代码（一个 module 的代码，含有类似 module.export 语句）的 loader，还有不能作为最左边 loader 的其他 loader
- 有时候想把两个第一种 loader chain 起来，比如 style-loader!css-loader! 问题是 css-loader 的返回值是一串 js 代码，如果按正常方式写 style-loader 的参数就是一串代码串
- 为了解决这种问题，我们需要在 style-loader 里执行 require(css-loader!resources)

pitch 与 loader 本身方法的执行顺序图



```
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```



![image-20230219154119989](.//webpack-张仁阳.assets/image-20230219154119989.png)

 

![image-20230219154632771](./webpack-张仁阳.assets/image-20230219154632771.png)

一旦有某个loader的有pitch，并且被执行后返回不为假值。则并不会进行源文件的读取操作。





**扩展知识**

runSyncOrAsync既可以是同步也可以是异步。

```js
function runSyncOrAsync(fn, callback) {
  let sync = true;
  global.async=()=> {
    sync = false;
    return callback;
  }
  fn();
  if(sync){
    callback();
  }
}

// 这个方法是同步还是异步，取决于fn中的代码逻辑
// 同步的使用方式：
function normal() {
  // 函数体中不能有调用global.async的语句
  //const callback= global.async();
  console.log('normal');
  //setTimeout(callback,3000);
}

// 异步的使用方式：
function normal() {
  const callback= global.async();
  console.log('normal');
  setTimeout(callback,3000);
}

function callback() {
  console.log('callback');
}

runSyncOrAsync(normal,callback);

```



**loader扩展：**

webpack配置文件中：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const loader1 = require("./loaders/loader1");
const loader2 = require("./loaders/loader2");
const loader3 = require("./loaders/loader3");
const loader4 = require("./loaders/loader4");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [loader3, loader4],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [loader1, loader2],
      },
    ],
  },
};

```

对应的loader内容：

```js
function loadern(sourceCode) {
  console.log("loadern0000000000000000000000000000000");
  return sourceCode;
}

module.exports = loadern;
// 上面的n表示1~4
```

当针对统一个类型的文件进行打包时，如果有多个规则都能命中同一个类型的文件。那么loader 的执行将是越往下的写的规则中的loader越先执行。（前提是没有设置规则的优先级enforce字段的值和特殊配置）

![image-20230501161310674](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230501161310674.png)



![image-20230501161353594](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230501161353594.png)



对应的源码是：

```js
//1.读取文件的内容
let sourceCode = fs.readFileSync(modulePath, 'utf8');  // 同步读取文件内容
let { rules=[] } = this.options.module;
//根据规则找到所有的匹配的loader
let loaders = [];
rules.forEach(rule => {   // 从这段代码逻辑可以看出，针对某个类型的文件会遍历webpack配置文件中的所有rule，命中其中符合test规则的文件，然后用loader进行处理，如果有多个规则都能命中同一个文件，那么都会对前面rule处理过的文件源码进行进一步处理。
  if (modulePath.match(rule.test)) {
    loaders.push(...rule.use);
  }
});
//调用所有配置的Loader对模块进行转换   
sourceCode = loaders.reduceRight((sourceCode, loader) => {
  return require(loader)(sourceCode);
}, sourceCode);
```



### babel-loader

```shell
npm install @babel/core @babel/preset-env -D
```



webpack.config.js:

```json
{
  test:/\.js$/,
  exclude:/node_modules/,
  resolveLoader:{
    alias:{
      'bable-loader':path.resolve(__dirname,'/loaders/babel-loader.js')  // 方式二，起别名的方式
    }
    
    modules:[path.resolve(__dirname,'loaders'),'node_modules']  // 方式三
  },
  use:{
    loader:path.resolve(__dirname,'/loaders/babel-loader.js'),  // 方式一
    
    loader:'babel-loader',  // 方式二和方式三公用，起别名的方式
    
    
    options:{
      presets:['@babel/preset-env']
    }
  }
}
```





### babel-loader.js

- [babel-loader](https://github.com/babel/babel-loader/blob/master/src/index.js)
- [@babel/core](https://babeljs.io/docs/en/next/babel-core.html)
- [babel-plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/)

```js
const babel = require('@babel/core');
const path = require('path');
function loader(source,ast,inputSourceMap) {
  // 异步
  // 在loader里this其实是一个称为loaderContext的对象
  // 需要把loader的执行从同步变成异步
  // https://webpack.docschina.org/api/loaders/#thisresourcepath
  // 告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  // console.log(this);
  const callback = this.async();
  let options = this.getOptions();
  let babelOptions = {
    ...options,
    ast:true,
    sourceMaps: true,// 当前转换babel的时候要生成sourcemap
    inputSourceMap// 接收上一个份sourcemap
  }
  babel.transformAsync(source, babelOptions).then(({ code }) => {
    // 在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
    callback(null, code);
    // this.callback(null,code);
  });
}
module.exports = loader;


/* 
同步转换
function loader(source) {
  //在loader里this其实是一个称为loaderContext的对象
  let options = this.getOptions();
  const { code} = babel.transformSync(source,options);  // transformSync同步编译
  return code;
} */

/**
 * babel-loader只是提供一个转换函数，但是它并不知道要干啥要转啥
 * @babel/core 负责把源代码转成AST，然后遍历AST，然后重新生成新的代码
 * 但是它并不知道如何转换语换法，它并不认识箭头函数，也不知道如何转换
 * @babel/transform-arrow-functions 插件其实是一个访问器，它知道如何转换AST语法树
 * 因为要转换的语法太多，插件也太多。所以可一堆插件打包大一起，成为预设preset-env
 */
```



### style-loader

- previousRequest 前面的 loader
- currentRequest 自己和后面的 loader+资源路径
- remainingRequest 后面的 loader+资源路径
- data: 和普通的 loader 函数的第三个参数一样,而且 loader 执行的全程用的是同一个对象
- 注意`sourceMaps`最后有个`s`

```js
//css文本代码 export default 
const path = require('path');
function loader(source) { }
function normalize(path) {
  return path.replace(/\\/g, '/');
}

// pitch是loader的一个方法
loader.pitch = function(remainingRequest) {
  console.log('remainingRequest', remainingRequest);
  console.log('context',this.context);//index.less模块所在的目录 可以用作解析其他模块成员的上下文
  //1.获取剩下的请求
  //2.用!分割得到各个部分的绝对路径前面是loader路径，后面是文件路径
  //3.把路径从绝对路径变成相对于根目录的相对路径
  //路径的前面要加上!!,只使用行内loader,不使用rule里面配置的loader,不然就会死循环了
/*   const request = "!!"+(remainingRequest.split('!').map(
    //request => this.utils.contextify(this.context, request)
    //这个路径其实就是模块的ID
    requestAbsPath => ("./" + path.posix.relative(normalize(this.context), normalize(requestAbsPath)))
  ).join('!'));
  console.log('request', request);
   */
  const request = "!!"+(remainingRequest.split('!').map(
    request => this.utils.contextify(this.context, request)
  ).join('!'));
  console.log('request', request);
  let script = `
     let styleCSS = require(${JSON.stringify(request)});
     let style = document.createElement('style');
     style.innerHTML =styleCSS;
     document.head.appendChild(style);
   `;
   return script;
}
module.exports = loader;
//require("!!../loaders/less-loader.js!./index.less");


/**
[
  C:\aproject\webpack202208\5.loader\loaders\less-loader.js,
 C:\aproject\webpack202208\5.loader\src\index.less
]
request=[
 ./loaders\less-loader.js,
 .\src\index.less
]
 * 
 */
```



### less-loader

```js
const less = require('less');
function loader(source) {
  // 该loader函数中的this就是由loader-runner库绑定的，李米娜有一些方法和属性
  let callback = this.async();
  less.render(source, { filename: this.resource }, (err, output) => {
    callback(err,`module.exports = ${JSON.stringify(output.css)}`);
  });
}
module.exports = loader;
```



### loader-runner实现

loader-runner的使用：

```js
const { runLoaders} = require('./loader-runner');
const path = require('path');
const fs = require('fs');

const entryFile = path.resolve(__dirname, 'src/index.js')

let request = `inline-loader1!inline-loader2!${entryFile}`;
const rules = [
  {
    test: /\.js$/,
    use:['normal-loader1','normal-loader2']
  },
  {
    test: /\.js$/,
    enforce:'pre',
    use:['pre-loader1','pre-loader2']
  },
  {
    test: /\.js$/,
    enforce:'post',
    use:['post-loader1','post-loader2']
  }
]
const parts = request.replace(/^-?!+/,'').split('!');
let resource = parts.pop();
let inlineLoaders = parts;
let preLoaders = [], postLoaders = [], normalLoaders = [];
for (let i = 0; i < rules.length; i++){
  let rule = rules[i];
  if (resource.match(rule.test)) {
    if (rule.enforce == 'pre') {
      preLoaders.push(...rule.use);
    }else if (rule.enforce == 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
let loaders = [];
if (request.startsWith('!!')) {
  loaders = inlineLoaders;
} else if (request.startsWith('-!')) {
  loaders = [...postLoaders,...inlineLoaders];
} else if (request.startsWith('!')) {
  loaders = [
    ...postLoaders,
    ...inlineLoaders,
    ...preLoaders
  ]
} else {
  loaders = [
    ...postLoaders,
    ...inlineLoaders,
    ...normalLoaders,
    ...preLoaders
  ]
}
//把loader从一个名称变成一个绝地路径
loaders = loaders.map(loader => path.resolve(__dirname, 'loader-chain', loader));
debugger
runLoaders({
  resource,//要处理的资源文件
  loaders,//资源文件需要经过发些loader的处理
  context: {age:18,author:'zhufeng'},
  readResource:fs.readFile//读文件用哪个方法
}, (err, result) => {//finalCallback
  console.log(err);
  console.log(result.result[0].toString());//转换后的结果
  //转换前源文件的内容
  console.log(result.resourceBuffer);
  console.log(result.resourceBuffer?result.resourceBuffer.toString():null);
});
```



**实现：**

每个loader导出的函数中的this都是由loader-runner这个库绑定的。 





## 插件

### 前置知识

面试的时候手写并发，并发控制，异步机制代码，都可以参考tapable库的这些方法。tapable可以独立使用。

异步任务的并发数控制函数。

例题：

> 请实现如下的函数，可以批量请求数据，所有的URL地址在urls参数中，同时可以通过max参数控制请求的并发度，当所有请求结束之后，需要执行callback回调函数，发请求的函数可以直接使用fetch即可。
>
> function sendRequest(urls:string[],max:number,callback:()=>void){ }



#### 插件核心tapable

webpack插件机制：

- webpack 实现插件机制的大体方式是：
  - 创建 - webpack 在其内部对象上创建各种钩子；
  - 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
  - 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。
- Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例
- 通过事件和注册和监听，触发 webpack 生命周期中的函数方法

webpack插件钩子（生命周期函数）可视化工具：[wepback-plugin-visualizer](https://www.npmjs.com/package/wepback-plugin-visualizer)

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```



####  tapable 分类

1. ##### 按同步异步分类

   - Hook 类型可以分为`同步Sync`和`异步Async`，异步又分为`并行`(一起开始，全部结束才结束)和`串行`（前一个结束后一个才开始）
     ![image-20230410195505070](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410195505070.png)

2. **按返回值分类**

   ![image-20230410195529852](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410195529852.png)

   

   - basic：执行每一个事件函数，**串行**，不关心函数的返回值,有 SyncHook、AsyncParallelHook、AsyncSeriesHook

     ![image-20230410200044645](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200044645.png)

   - waterfall：如果前一个事件函数的结果 `result !== undefined`,则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook

     ![image-20230410200145319](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200145319.png)

     ```js
     const { SyncWaterfallHook } = require('tapable');
     /**
      * 形参数组
      * 形参的名义没有意义
      */
     const hook = new SyncWaterfallHook(['name', 'age']);
     /**
      * tap的第一个参数是回调函数的名称，但是这个名字只是给程序员看的
      */
     hook.tap('1', (name,age) => {
       console.log(1, name, age);
       return 'result1'
     });
     hook.tap('2', (name,age) => {
       console.log(2, name, age);
       return 'result2'
     });
     hook.tap('3', (name,age) => {
       console.log(3,name,age);
     });
     hook.call('zhufeng',18);
     ```

     

   - bail：执行每一个事件函数，遇到第一个钩子的返回值结果 `result !== undefined` ，则不再继续往后执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook

     ![image-20230410200127561](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200127561.png)

   - loop：不停的循环执行事件函数，直到所有函数结果 `result === undefined`,有 SyncLoopHook 和 AsyncSeriesLoopHook

     ![image-20230410200204253](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200204253.png)

     ```js
     const { SyncLoopHook } = require('tapable');
     /**
      * 不停的执行回调函数，直到结果等于undefined
      */
     const hook = new SyncLoopHook(['name', 'age']);
     let counter1 = 0,counter2 = 0,counter3 = 0;
     
     hook.tap('1', (name,age) => {
       console.log(1, 'counter1',counter1);
       if (++counter1===1) {
         counter1 = 0;
         return;
       }
       return true;
     });
     
     hook.tap('2', (name,age) => {
       console.log(2, 'counter2',counter2);
       if (++counter2===2) {
         counter2 = 0;
         return;
       }
       return true;
     });
     
     hook.tap('3', (name,age) => {
       console.log(3, 'counter3',counter3);
       if (++counter3==3) {
         counter3 = 0;
         return;
       }
       return true;
     });
     hook.call('zhufeng',18);
     ```

     



## webpack优化

1. 查找模块时，尽量缩小查找范围

   ```js
   module.exports = {
   	resolve:{
   		extensions:['js','jsx','ts','json'],  // 配置后，在项目中require或import其他模块时，可以省略文件扩展名
   		alias:{
   			@:path.resolve(__dirname,'src'),
   			myLib:'具体的库所在目录'
   		},
   		modules:['my_modules','node_modules'], // 对于查找第三方库，webpack默认使用nodejs的默认规则，即去node_modules目录中查找，如果自己的库想模拟这个查找路径，就可以在这个字段中配置 
       mainFields:['browser', 'module', 'main'], // 默认值，指的是对于引入一个包，查找文件时，依次参考package.json文件中的哪个字段指向的文件
      	mainFiles:['indexz'], // 默认值，当目录下没有 package.json 文件时，会默认使用目录下的 index.js 这个文件可以在这里配置
   	},
     
     
     // resolveLoader 用于配置解析 loader 时的 resolve 配置,默认的配置
     resolveLoader:[
       modules: [ 'node_modules' ],
       extensions: [ '.js', '.json' ],
       mainFields: [ 'loader', 'main' ],
     ],
     
     module:{
       // 可以用于配置哪些模块文件的内容不需要进行解析,不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度
       // 一般来说我们拿到模块后要分析里面的依赖的模块import/require
       // 这些模块我们知道它肯定没有依赖别的模块 jquery lodash,所以可以省这一步
       noParse: /jquery|lodash/, // 正则表达式  
       // 或者使用函数
       noParse(content) {
         return /jquery|lodash/.test(content)
       },
     },
     
     plugins:[
       // IgnorePlugin用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去
       new webpack.IgnorePlugin({  
         contextRegExp:/moment$/,  // 目标库的正则   匹配引入模块路径的正则表达式
         resourceRegExp: /^\.\/locale/   // 库中需要忽略文件夹的正则   匹配模块的对应上下文，即所在目录名
       })
     ]
   }
   ```
   
   IgnorePlugin的典型使用就是用于忽略moment这个包的语言库文件，对于自己需要的语言文件，自己自行单独导入到项目中即可。
   ![image-20230502192840848](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230502192840848.png)
   
   ```js
   import moment from  'moment';
   import 'moment/locale/zh-cn';  // 自行导入
   console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
   ```
   
   

2. 打包耗时分析

   ```webpack.config.js
   const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
   const smw = new SpeedMeasureWebpackPlugin();
   module.exports =smw.wrap({
   	// ...
   });
   ```

   

3. 打包体积分析

   ```js
   const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
   module.exports={
     plugins: [
       new BundleAnalyzerPlugin()
     ]
   }
   ```

   



## webpack构建库

- [outputlibrarytarget](https://webpack.js.org/configuration/output/#outputlibrarytarget)
- 在使用webpack编写自己开发的库给别人使用时，需要配置这个字段中的值
- 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到
- `output.library` 配置导出库的名称
- `output.libraryExport` 配置要导出的模块中哪些子模块需要被导出。 它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
- `output.libraryTarget` 配置以何种方式导出库,是字符串的枚举类型，支持以下配置

| libraryTarget | 使用者的引入方式                    | 使用者提供给被使用者的模块的方式         |
| :------------ | :---------------------------------- | :--------------------------------------- |
| var           | 只能以script标签的形式引入我们的库  | 只能以全局变量的形式提供这些被依赖的模块 |
| commonjs      | 只能按照commonjs的规范引入我们的库  | 被依赖模块需要按照commonjs规范引入       |
| commonjs2     | 只能按照commonjs2的规范引入我们的库 | 被依赖模块需要按照commonjs2规范引入      |
| amd           | 只能按amd规范引入                   | 被依赖的模块需要按照amd规范引入          |
| this          |                                     |                                          |
| window        |                                     |                                          |
| global        |                                     |                                          |
| umd           | 可以用script、commonjs、amd引入     | 按对应的方式引入                         |

```js
module.exports = {
  entry:'./src/index.js',
 	output:{
    path:path.resolve('build'),
    filename:'[name].js',
    library:'myTools',
    libraryTarget:'var'
  } 
}
```





## 提取CSS

```shell
npm install  mini-css-extract-plugin --save-dev
```



```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
+const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
+    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
+      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
+      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
+      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
       {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type:'asset/resource',
        generator:{
          filename:'images/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
+   new MiniCssExtractPlugin({
+      filename: 'style/[name].css'
+   })
  ]
};
```



## 开发模式下压缩文件

- [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)是一个优化和压缩CSS资源的插件
- [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin)是一个优化和压缩JS资源的插件

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
+ const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
+ const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
+  mode: 'none',   // 如果mode是production,会自动启用压缩插件,如果配置为none表示不会启用压缩插件
  devtool: false,
  entry: './src/index.js',
+  // js文件的压缩
+  optimization: {
+    minimize: true,
+    minimizer: [
+      new TerserPlugin(),
+    ],
+  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type:'asset/resource',
        generator:{
          filename:'images/[hash][ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
  
+   // html文件压缩
    new HtmlWebpackPlugin({
    template: './src/index.html',
+     minify: {  
+        collapseWhitespace: true,
+        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
+    new OptimizeCssAssetsWebpackPlugin(),  // css文件压缩
  ],
};
```



## CDN

- [public-path](https://webpack.js.org/guides/public-path/#root)
- [external-remotes-plugin](https://npmmirror.com/package/external-remotes-plugin)

- HTML文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的URL变成指向CDN服务器的地址
- 静态的JavaScript、CSS、图片等文件开启CDN和缓存，并且文件名带上HASH值
- 为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上
- 可以通过在 HTML HEAD 标签中 加入`<link rel="dns-prefetch" href="http://img.zhufengpeixun.cn">`去预解析域名，以降低域名解析带来的延迟





## 文件指纹

- 打包后输出的文件名和后缀
- hash一般是结合CDN缓存来使用，通过webpack构建之后，生成对应文件名自动带上对应的MD5值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的HTML引用的URL地址也会改变，触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存。

指纹占位符

| 占位符名称  | 含义                                                        |
| :---------- | :---------------------------------------------------------- |
| ext         | 资源后缀名                                                  |
| name        | 文件名称                                                    |
| path        | 文件的相对路径                                              |
| folder      | 文件所在的文件夹                                            |
| hash        | 每次webpack构建时生成一个唯一的hash值                       |
| chunkhash   | 根据chunk生成hash值，来源于同一个chunk，则chunkhash值就一样 |
| contenthash | 根据内容生成hash值，文件内容相同hash值就相同                |

- Hash 是整个项目的hash值，其根据每次编译内容计算得到，每次编译之后都会生成新的hash,即修改任何文件都会导致所有文件的hash发生改变

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");  // 删除多余的css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
+  entry: {
+    main: './src/index.js',
+    vender:['lodash']
+  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[hash:8].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};

```



- chunkhash；采用hash计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样没办法实现缓存效果，需要换另一种哈希值计算方式，即chunkhash,chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着采用chunkhash的方式生成哈希值，那么只要不改动公共库的代码，就可以保证其哈希值不会受影响

```diff
const path = require("path");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "production",
  entry: {
    main: './src/index.js',
    vender:['lodash']
  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[chunkhash].css"
    })
  ],
};

```



- contenthash；使用chunkhash存在一个问题，就是当在一个JS文件中引入CSS文件，编译后它们的chunkhash是相同的，而且只要js文件发生改变 ，关联的css文件chunkhash也会改变，这个时候可以使用`mini-css-extract-plugin`里的`contenthash`值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建

```diff
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'[name].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
+      filename: "[name].[contenthash].css"
    }),
  ],
};
```



可以开发一个插件，将打包后的文件自动推送到CDN服务器上。



不同hash的特点：

![variableHash](https://img.zhufengpeixun.com/variableHash.jpg)

```js
function createHash(){
   return  require('crypto').createHash('md5');
}
let entry = {
    entry1:'entry1',
    entry2:'entry2'
}
let entry1 = 'require depModule1';//模块entry1
let entry2 = 'require depModule2';//模块entry2

let depModule1 = 'depModule1';//模块depModule1
let depModule2 = 'depModule2';//模块depModule2
//如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效
let hash =  createHash()
.update(entry1)
.update(entry2)
.update(depModule1)
.update(depModule2)
.digest('hex');
console.log('hash',hash)
//chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
//在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
let entry1ChunkHash = createHash()
.update(entry1)
.update(depModule1).digest('hex');;
console.log('entry1ChunkHash',entry1ChunkHash);

let entry2ChunkHash = createHash()
.update(entry2)
.update(depModule2).digest('hex');;
console.log('entry2ChunkHash',entry2ChunkHash);

let entry1File = entry1+depModule1;
let entry1ContentHash = createHash()
.update(entry1File).digest('hex');;
console.log('entry1ContentHash',entry1ContentHash);

let entry2File = entry2+depModule2;
let entry2ContentHash = createHash()
.update(entry2File).digest('hex');;
console.log('entry2ContentHash',entry2ContentHash);
```





自己写的修改hash的plugin：

```js
class HashPlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.hooks.compilation.tap('HashPlugin',(compilation,params)=>{
            //如果你想改变hash值，可以在hash生成这后修改
            compilation.hooks.afterHash.tap('HashPlugin',()=>{
                let fullhash = 'fullhash';//时间戳
                console.log('本次编译的compilation.hash',compilation.hash);
                compilation.hash= fullhash;//output.filename [fullhash]
                for(let chunk of compilation.chunks){
                    console.log('chunk.hash',chunk.hash);
                    chunk.renderedHash = 'chunkHash';//可以改变chunkhash
                    console.log('chunk.contentHash',chunk.contentHash);
                    chunk.contentHash= { javascript: 'javascriptContentHash','css/mini-extract':'cssContentHash' }
                }
            });
        });
    }
}
module.exports = HashPlugin;
/**
 * 三种hash
 * 1. hash compilation.hash 
 * 2. chunkHash 每个chunk都会有一个hash
 * 3. contentHash 内容hash 每个文件会可能有一个hash值
 */
```



## moduleIds & chunkIds的优化

- module: 每一个文件(js,css,jpg,字体等)其实都可以看成一个 module
- chunk: webpack打包最终的代码块，代码块会生成文件，一个文件对应一个chunk
- 在webpack5之前，没有从entry打包的chunk文件（通过import方法动态导入的模块），都会以1、2、3...的文件命名方式输出,删除某些些文件可能会导致缓存失效
- 在生产模式下，默认启用这些功能chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用`确定性`的方式将短数字 ID(3 或 4 个字符)短hash值分配给 modules 和 chunks
- chunkId设置为deterministic，则output中chunkFilename里的[name]会被替换成确定性短数字ID
- 虽然chunkId不变(不管值是deterministic | natural | named)，但更改chunk内容，chunkhash还是会改变的

| 可选值            | 含义                         | 示例          |
| :---------------- | :--------------------------- | :------------ |
| natural（默认值） | 按使用顺序的数字ID           | 1             |
| named             | 方便调试的高可读性id         | src_two_js.js |
| deterministic     | 根据模块名称生成简短的hash值 | 915           |
| size              | 根据模块大小生成的数字id     | 0             |

webpack.config.js

```diff
const path = require('path');
module.exports = {
    mode: 'development',
    devtool:false,
+   optimization:{
+       moduleIds:'deterministic',
+       chunkIds:'deterministic'
+   }
}
```

src\index.js

```js
import('./one');
import('./two');
import('./three');
```



实现微前端的方式：

1. iframe
2. qiankun
3. 模块联邦 



## 模块联邦

一般用于实现微前端。 典型的产品：qiankun。

- Module Federation的动机是为了不同开发小组间共同开发一个或者多个应用

- 应用将被划分为更小的应用块，一个应用块，可以是比如头部导航或者侧边栏的前端组件，也可以是数据获取逻辑的逻辑组件
- 每个应用块由不同的组开发
- 应用或应用块共享其他其他应用块或者库



- **使用Module Federation时，每个应用块都是一个独立的构建，有自己的打包配置，这些构建都将编译为容器**
- 容器可以被其他应用或者其他容器应用
- 一个被引用的容器被称为remote，引用者被称为 host ， remote 暴露模块给 host，host 则可以使用这些暴露的模块，这些模块被成为remote 模块

![image-20230503091426077](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230503091426077.png)

模块联邦必须异步导入（ import('xxxx.js') ）。

使用了模块联邦后的项目不同的容器项目可以选择不同的技术栈，但是可能比较难进行不同应用块之间的组件间通信，但是必须都依赖于webpack5。



| 字段     | 类型   | 含义                                                         |
| -------- | ------ | ------------------------------------------------------------ |
| name     | string | 必传值，即输出的模块名，被远程引用时路径为${name}/${expose}  |
| library  | object | 声明全局变量的方式，name为umd的name                          |
| filename | string | 构建输出的文件名                                             |
| remotes  | object | 远程引用的应用名及其别名的映射，使用时以key值作为name        |
| exposes  | object | 被远程引用时可暴露的资源路径及其别名                         |
| shared   | object | 与其他应用之间可以共享的第三方依赖，使你的代码中不用重复加载同一份依赖 |



















## Rollup

webpack打包的特点：

1. 打包后的代码会待用webpack自生的逻辑代码，且体积打
2. 打包速度慢，且配置可以很多样复杂
3. 开发JS类库不适合使用webpack来进行打包



### 先导

rollup是专门用于打包开发的JS类库，支持打包生成umd/commonjs/es的js代码，学习rollup为vite打基础。vite开发时用的是esbuild（也是一个打包工具，用Go语言写的）打包；上线时使用的是rollup打包，而且vite内部的插件机制也是复用rollup的插件机制。

rollup插件和vite插件可以复用，vite插件是一个简化版的rollup插件，webpack使用的是commonjs规范，rullup使用的是ESM规范吗 webpack和rollup都会支持esm 和commonjs 但是打包出来的结果 webpack只能是commonjs，rollup可以打包出commonjs也可以打包出esm。rollup自带支持Tree-shaking，本质是消除无用的js代码，只处理函数和顶层的import/export变量



- amd：`Asynchronous Module Definition`异步模块定义
- ES6 module：es6提出了新的模块化方案
- `IIFE(Immediately Invoked Function Expression)`：立即执行函数表达式，声明一个函数，声明完了立即执行
- UMD：`Universal Module Definition`，通用模块定义
- `cjs`：nodejs采用的模块化标准，commonjs使用方法`require`来引入模块,这里`require()`接收的参数是模块名或者是模块文件的路径



```shell
npm i  @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript lodash rollup  postcss rollup-plugin-postcss rollup-plugin-terser tslib typescript rollup-plugin-serve rollup-plugin-livereload -D
```



rollup配置文件

rollup.config.js：

```js
export default {
  input:'./src/main.js',
  output:{
   file: 'dist/bundle.cjs.js',//输出的文件路径和文件名
    format: 'cjs',//五种输出的格式 amd/es/iife/umd/cjs
    name: 'libName',//当format格式为iife和umd的时候必须提供变量名
  }
}
```



### 引入Babel

```shell
npm install @rollup/plugin-babel @babel/core @babel/preset-env -D
```



```js
import babel from '@rollup/plugin-babel';

export default {
	// ...
  plugins: [
    babel({
      exclude: /node_modules/
    })
  ]
}
```



.babelrc

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ]
}
```





### 使用第三方npm模块

rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式`import/export`。大量的npm模块是基于CommonJS模块方式，这就导致了大量 npm 模块不能直接编译使用。所以辅助rollup.js编译支持 npm模块和CommonJS模块方式的插件就应运而生。

- rollup-plugin-node-resolve 插件允许加载第三方模块
- @rollup/plugin-commons 插件将它们转换为ES6版本

```shell
npm install @rollup/plugin-node-resolve @rollup/plugin-commonjs -D
```



```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [
    resolve(),
    commonjs(),
  ],
}

```





### 支持CDN 

第三方库通过cdn引入，不直接出现在打包后的源码中。

src/main.js:

```js
import _ from 'lodash';
import $ from 'jquery';
console.log(_.concat([1,2,3],4,5));
console.log($);
export default 'main';
```



index.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>

  <body>
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <script src="bundle.js"></script>   引入打包后的js文件
  </body>

</html>
```



rollup.config.js:

```diff
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
+       format:'iife',// 使用iife
+       name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
+       globals:{
+           lodash:'_', //告诉rollup全局变量_即是lodash
+           jquery:'$' // $即是jquery
+       }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs()
    ],
+   external:['lodash','jquery']
}
```



打包生成文件的内容：

![image-20230506210020159](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230506210020159.png)





### 支持TS

```shell
npm install @rollup/plugin-typescript -D

npx tsc --init
```



rollup.config.js

```js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
  ]
}
```





### 支持压缩

```js
import { terser } from 'rollup-plugin-terser';

export default {
	// ...
  plugins: [
    terser()
  ]
}
```





### 支持CSS

本质也是在head中加入style标签。

```js
import postcss from 'rollup-plugin-postcss';

export default {
	// ...
  plugins: [
    postcss()
  ]
}
```





### 支持开发服务器



```json
"scripts": {
  "build": "rollup --config",
  "dev": "rollup --config -w",
  // "build": "rollup --config rollup.config.build.js",
  // "dev": "rollup --config rollup.config.dev.js -w"
},
```



```js
import serve from 'rollup-plugin-serve';

export default {
  // ...
  plugins: [
    serve({
      open: true,
      port: 8080,
      contentBase: './dist'
    })
  ]
}
```



### 热更新

```js
import livereload from 'rollup-plugin-livereload'

export default {
  // ...
  plugins: [
    livereload(),
  ]
}
```





### Rollup原理



#### **前置知识**

rollup 使用了 `acorn` 和 `magic-string` 两个库。

[magic-string](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fmagic-string)是一个操作字符串和生成source-map的工具,`magic-string` 是 rollup 作者写的。下面是 github 上的示例：

```js
var MagicString = require('magic-string');
var magicString = new MagicString('export var name = "beijing"');
//类似于截取字符串
console.log(magicString.snip(0,6).toString()); // export
//从开始到结束删除字符串(索引永远是基于原始的字符串，而非改变后的)
console.log(magicString.remove(0,7).toString()); // var name = "beijing"

//很多模块，把它们打包在一个文件里，需要把很多文件的源代码合并在一起
let bundleString = new MagicString.Bundle();
bundleString.addSource({
    content:'var a = 1;',
    separator:'\n'
});
bundleString.addSource({
    content:'var b = 2;',
    separator:'\n'
});
/* let str = '';
str += 'var a = 1;\n'
str += 'var b = 2;\n'
console.log(str); */
console.log(bundleString.toString());
// var a = 1;
// var b = 2;
```



#### **AST**

[astexplorer](https://astexplorer.net/)

使用 JavaScript 编写的 JavaScript 解析器：

- [Esprima](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjquery%2Fesprima)
- [Acorn](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fternjs%2Facorn)

上面两个解析出来的AST都符合 [The Estree Spec](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.comb%2Festree%2Festree) 规范。

rollup和Webpack 解析代码用的是 Acorn。

- [UglifyJS 2](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmishoo%2FUglifyJS2)：一个 JavaScript 代码压缩器，其实它自带了一个代码解析器，也可以输出 AST，但是它的功能更多还是用于压缩代码
- [Shift](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fshapesecurity%2Fshift-parser-js)



- Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![1d821a22ff221e924731a6d8c8a654c4](https://img.zhufengpeixun.com/1d821a22ff221e924731a6d8c8a654c4)





一个使用Acorn解析JavaScript代码并输出函数名的例子：

```js
const acorn = require("acorn");

const code = `
  function add(x, y) {
    return x + y;
  }
  
  let result = add(1, 2);
  console.log(result);
`;

const ast = acorn.parse(code, {
  ecmaVersion: 2021
});

console.log(ast)

ast.body.forEach(node => {
  if (node.type === 'FunctionDeclaration') {
    console.log(`Function name: ${node.id.name}`);
  }
});
```

打印内容：

```
Node {
  type: 'Program',
  start: 0,
  end: 98,
  body: [
    Node {
      type: 'FunctionDeclaration',
      start: 3,
      end: 45,
      id: [Node],
      expression: false,
      generator: false,
      async: false,
      params: [Array],
      body: [Node]
    },
    Node {
      type: 'VariableDeclaration',
      start: 51,
      end: 74,
      declarations: [Array],
      kind: 'let'
    },
    Node {
      type: 'ExpressionStatement',
      start: 77,
      end: 97,
      expression: [Node]
    }
  ],
  sourceType: 'script'
}
Function name: add
```







```js
const acorn = require("acorn");

const code = `import $ from "jquery"`;

const ast = acorn.parse(code, {
  ecmaVersion: 2021,
  sourceType: "module",
});

console.dir(ast);

ast.body.forEach((node) => {
  if (node.type === "FunctionDeclaration") {
    console.log(`Function name: ${node.id.name}`);
  }
});
```

打印内容：

```
Node {
  type: 'Program',
  start: 0,
  end: 22,
  body: [
    Node {
      type: 'ImportDeclaration',
      start: 0,
      end: 22,
      specifiers: [Array],
      source: [Node]
    }
  ],
  sourceType: 'module'
}
```





```js
const acorn = require("acorn");
const sourceCode = `import $ from "jquery"`;
const ast = acorn.parse(sourceCode, {
  locations: false,
  ranges: true,
  sourceType: "module",
  ecmaVersion: 8,
});
//遍历语法树
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      console.log("进入" + node.type);
    },
    leave(node) {
      console.log("离开" + node.type);
    },
  });
});

function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}
function visit(node, parent, enter, leave) {
  if (enter) {
    enter(node, parent);
  }
  const keys = Object.keys(node).filter((key) => typeof node[key] === "object");
  keys.forEach((key) => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val.type) {
          visit(val, node, enter, leave);
        }
      });
    } else {
      visit(value, node, enter, leave);
    }
  });
  if (leave) {
    leave(node, parent);
  }
}
```

打印：

```
进入ImportDeclaration
进入ImportDefaultSpecifier
进入Identifier
离开Identifier
离开ImportDefaultSpecifier
进入Literal
离开Literal
离开ImportDeclaration
```



![d39f73349c0580b4bfe6aa106ef0b1ae](https://img.zhufengpeixun.com/d39f73349c0580b4bfe6aa106ef0b1ae)





#### **实现**

启动文件：

```js
const path = require('path');
const rollup = require('./lib/rollup')

const entry = path.resolve(__dirname,'./src/main.js')
const output = path.resolve(__dirname,'./dist/bundle.js')

rollup(entry,output)
```



rollup本质是一个方法。rollup中的Bundle实例类比于webpack中的Compiler实例。rollup中每个文件也对应一个模块，webpack中也如此。

rollup.js文件内容：

```js
const Bundle = require('./bundle.js')

function rollup(entry,output){
  // entry和output分别是打包入口文件和出口文件的绝对路径
  // 使用rollup打包时，会创建一个统筹全局的bundle实例对象，调用它的build方法进行打包编译工作
  const bundle = new Bundle({entry});
  bundle.build(output)
}

module.exports = rollup
```





bundle.js:

```js
const path = require('path');
const fs = require('fs');
const MagicString = require('magic-string');
const Module = require('./module.js');

class Bundle{
  constructor(options){
    this.entryPath = path.resolve(options.entry)   // 不管是相对路径还是绝对路径，都统一改为绝对路径
  }
  
  build(output){
    const entryModule = this.fetchModule(this.entryPath)
    
    this.statements = entryModule.expandAllStatements()  //该文件源码对应的AST中所有节点组成的数组，将它们节点的_source属性对应的代码字符串拼接起来就能生成新的源代码
    
    const {code} = this.generate()
    fs.writeFileSync(output, code)
  }
  
  fetchModule(importee){
    let route = importee;
    if(route){
      const code = fs.readFileSync(route,'uft8') // 读取原文件内容
      // 每个文件都对应着一个模块，即一个module实例对象
      const module = new Module({
        code,
        path: route,
        bundle: this
      })
      
      return module
    }
  }
  
  generate(){
    let bundle = new MagicString.Bundle()
    this.statements.forEach(statement=>{  // 把每个ast节点对应的源码都添加到bundle实例中
      const source = statement._source.clone()
      bundle.addSource({
        content:source,
        separator:'\n'
      })
    })
    return {code: bundle.toString()}
  }
}
```





module.js：

```js
const MagicString = require('magic-string')
const { parse } = require('acorn')
const analyse = require('./ast/analyse')

// 每个文件对应的模块对象上都有该文件的源码包装过的MagicString实例，该源码文件所在的路径，该源码文件属于哪个bundle
// 同时每个模块上都有自己的源码对应的ast，同时，每个ast上的节点对象上也有三个属性：_included，_module，_source
// _source：存放着该ast节点对应的源码字符串
// _module：存放着该ast节点所属的源码文件生成的模块实例对象
// _included: 表示这条语句默认不包括在输出的结果
class Module{
  constructor({code,path,bundle}){
    this.code = new MagicString(code);  // 将模块的源代码包装为MagicString，方便后期操作
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code,{
      ecmaVersion:8,
      sourceType:'module'
    })
    analyse(this.ast, this.code, this)
  }
  
  expandAllStatements(){
    let allStatements = [];
    this.ast.body.forEach(statement=>{
      let statements = this.expandAllStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }
  
  expandAllStatement(statement){
    statement._included = true
    let result = []
    result.push(statement)
    return result 
  }
}
```





ast/analyse.js:

```js

function analyse(ast,code,module){
  ast.body.forEach((statement)=>{
    Object.defineProperties(statement,{
      _included: {value: false,writable: true},
      _module: {value: module},
      _source: {value: code.snip(statement.start,statement.end)}
    })
  })
}

module.exports = analyse
```



