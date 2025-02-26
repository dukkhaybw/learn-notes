# 前端工程化

webpack使用、原理和优化

## Webpack

webpack 是一个JS应用程序的静态文件打包工具。

在 webpack 中会将各种类型的文件都看作一个模块，且模块之间可能相互依赖。webpack 打包所有的这些资源文件并编译为一些前端环境(浏览器环境)能识别的一些文件（静态资源），比如 js，css，png 等。

```shell
npm init -y
npm install webpack webpack-cli --save-dev
```

- webpack：核心包
- webpack-cli：命令行工具，主要是在执行 webpack 命令时，解析命令行中设置的一系列参数（一组命令和选项），加载 webpack 配置文件（默认 webpack.config.js），调用webpack核心包中的方法进行构建打包。通过webpack-cli，可以在命令行中指定Webpack的配置文件、执行不同的构建模式（如开发模式或生产模式）、观察文件变化并自动重新构建等。

在命令行中输入 `webpack` 并附带一些选项时，Webpack CLI会执行以下步骤来处理命令：

1. 解析命令行参数：Webpack CLI会解析命令行中输入的选项和参数，并根据它们的值进行配置。
2. 加载配置文件：Webpack CLI会尝试加载默认的配置文件 `webpack.config.js`，如果存在的话。如果命令行中使用了 `--config` 选项指定了其他配置文件，Webpack CLI会加载该文件。
3. 合并配置：Webpack CLI会将命令行选项和配置文件中的配置合并，以形成最终的Webpack配置对象。
4. 创建Webpack编译器类对象：Webpack CLI使用合并后的配置创建一个Webpack编译器类的实例对象，该编译器对象将负责处理打包过程。
5. 执行Webpack编译器：Webpack编译器开始执行打包过程。它会根据配置中的入口文件和依赖关系，**递归地解析和处理**各个模块，并将它们打包成最终的输出文件。
6. 输出打包结果：一旦Webpack编译器完成打包过程，它会将生成的输出文件写入指定的输出目录。

在执行过程中，Webpack CLI还可以根据命令行选项和配置文件中的其他配置，执行一些额外的操作，例如启动开发服务器、监听文件变化并自动重新打包等。



## 浏览器使用 ES module

```html
<script src="./src/index.js" type="module"></script>
// 必须指明type为module
```

ES6 模块化语法：

```js
// index.js:
import { sum, mul } from './js/math.js';

console.log(sum(20, 30));
console.log(mul(20, 30));
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

**ES6 的模块化规范在浏览器中是需要发起网络请求：**

![image-20220310071821033](images\image-20220310071821033.png)

![image-20220310072112724](images\image-20220310072112724.png)

在上面，直接使用 file 协议打开本地的 index.html 文件，产生跨域请求，同时网络面板中也有针对index.js的网络请求。说明 ES6 的 import 语法是需要发起网络请求的。



## entry

- 入口(entry point)告诉 webpack 使用哪个模块或者哪几个模块，作为构建其内部依赖图(dependency graph) 的开始。进入入口后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的

- 默认值是 `./src/index.js`，但可以通过在 `webpack configuration` 中配置 `entry` 属性，来指定一个（或多个）不同 src 入口起点

- **entry 中配置的相对路径会以脚本命令执行时所在的路径（process.cwd()）作为基准路径。**

  比如：当前项目根目录为test，该目录下有webpack.config.js文件，其中的entry字段值为：'./src/index.js'，如果跳转到test的上级目录下，执行webpack --config  ./test/webpack.config.js，那么将因为找不到入口文件而报错。

  报错信息如下： 

  ```
  PS C:\Users\Desktop\webpack202208\test> cd ..
  PS C:\Users\Desktop\webpack202208> npx webpack --config .\test\webpack.config.js
  Active code page: 65001
  asset index.html 2.62 KiB [emitted]
  asset main.js 99 bytes [emitted] (name: main)
  
  ERROR in main
  Module not found: Error: Can't resolve './src/index.js' in 'C:\Users\Desktop\webpack202208'
  resolve './src/index.js' in 'C:\Users\dukkha\Desktop\webpack202208'
    using description file: C:\Users\dukkha\package.json (relative path: ./Desktop/webpack202208)
      Field 'browser' doesn't contain a valid alias configuration
  ```
  
  

```js
entry: './src/index.js';


entry:['url1','url2']  // 这两个文件的内容都会打包到一个main.js文件中
// 单入口等价于下面这种写法


entry: {
  main: './src.index.js';
}


entry:(context, environment) => {
    console.log('Context:', context);
    console.log('Environment:', environment);
    // 根据环境变量动态返回入口文件
    if (environment.production) {
      return './src/index.prod.js';
    } else {
      return './src/index.dev.js';
    }
    //  也可以返回对象或者数组
  },
      
     
  entry:{
      main:{
          import './src/index.js',
          dependOn:'xxx',
          runtime:'runtime-name'// 单独设置这个入口模块的runtime代码
      }
  }
```

如果 `entry` 字段被配置为一个函数，那么 Webpack 会在运行时调用这个函数，并传递一些特定的参数。

以下是 Webpack 内部对 `entry` 函数的处理逻辑及其传参的详细解释：

- **`context`**: Webpack 的上下文路径，通常是配置中的 `context` 字段值。如果没有显式设置 `context`，默认是 Webpack 配置文件所在的目录。
- **`environment`**: 一个对象，包含 Webpack CLI 或构建脚本中传递的 `mode` 和其他环境变量。



## output

- `output` 属性告诉 webpack 在哪里输出它所创建的 bundle，以及**如何命名这些文件**

  主要输出文件的默认值是：./dist/main.js，其他生成文件默认放置在./dist文件夹中

- output 中的 path 路径则是一个绝对路径，具体打包后生成的打包文件夹在哪里取决于 path 的值

- **如果不配置 output 中的 path 选项，则该项的默认值是：process.cwd()，而不是'./dist'这种相对路径或者 path.resolve(\_\_dirname, "dist")**，但默认的配置文件有配置这个属性的值





## loader

- webpack 只能理解 `JavaScript` 和 `JSON` 文件
- loader 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到webpack依赖图中

loader 的几种使用方式：

- import '**style-loader!css-loader!**../css/creatediv.css' （内联式，不推荐，只正对这个一个文件使用指定的loader）

- CLI 方式（不推荐）

  package.json:

  ```json
  {
    "build":"webpack --module-bind 'css=style-loader!css-loader'"
  }
  ```

- webpack 配置文件中写 loader

  对应规则的 loader 是从右向左执行的，最右侧的 loader 接收到是对应类型的文件的源码，最左侧的 loader 一定会返回一个 js 模块。

  ```js
  module.exports ={
    module:{
      rules:[
        {
          test:/\.css$/,
          use:['style-loader','css-loader']
        }
      ]
    },
    context:process.cwd()   // 属性值就是项目打包的上下文（项目打包的相对路径），就是项目的目录路径，该配置项几乎不会去改，用默认值就行
  }
  ```



如果有同类型的文件，并且想针对不同情况执行不同的 loader，可以使用 Webpack 的 `oneOf` 配置。`oneOf` 是 Webpack 4 及以上版本中的一个功能，用来提高性能，确保每个文件只经过其中一个 loader 处理。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        oneOf: [
          {
            resourceQuery: /babel/, // 针对 URL 中包含 ?babel 的资源，使用 babel-loader
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] },
          },
          {
            loader: 'babel-like-loader', // 其他情况下使用自定义的 babel-like-loader
            options: {},
          },
        ],
      },
    ],
  },
};

```



### oneOf

`oneOf` 是用来优化模块规则匹配的一个关键字。它允许你定义一组规则，但 **每个文件只会匹配其中一个规则**，而不会继续匹配后续规则。这种机制可以提升构建效率，避免文件被多个规则重复处理。

#### **`oneOf` 的工作方式**

- `oneOf` 是 `module.rules` 中的一个属性，值是一个规则数组。
- Webpack 会按顺序遍历数组中的规则，遇到第一个匹配的规则后就停止继续匹配。
- 如果没有匹配任何规则，Webpack 会抛出错误，除非提供了默认的处理方式。

以下是一个典型的 Webpack 配置，使用 `oneOf` 优化规则匹配：

````js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'], // 处理 CSS 文件
          },
          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'], // 处理 SCSS 文件
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            type: 'asset/resource', // 处理图片文件
          },
        ],
      },
    ],
  },
};

````

在这个配置中：

- 如果文件是 `.css`，会应用 `css-loader` 和 `style-loader`。
- 如果文件是 `.scss`，会应用 `sass-loader`。
- 如果文件是图片格式（`.png`, `.jpg`, `.gif`），会使用 `asset/resource`。

`oneOf` 确保每个文件 **只匹配第一个符合条件的规则**，后续规则不再处理该文件。



#### **`oneOf` 的优点**

1. **性能优化：**
   - 避免文件被多个规则重复匹配。
   - Webpack 在找到匹配规则后停止继续匹配，减少不必要的开销。
2. **明确的规则优先级：**
   - 通过规则的顺序，控制不同规则的优先级。
3. **更清晰的配置结构：**
   - 将相关的规则归纳到一起，配置更具可读性。

------

#### **`oneOf` 的注意事项**

1. **顺序很重要：**

   - `oneOf` 中的规则按顺序匹配，先定义的规则优先级高。
   - 如果规则顺序不合理，可能会导致预期外的行为。

2. **默认规则：**

   - 如果没有任何规则匹配，Webpack 会抛出错误。
   - 可以在 `oneOf` 中添加一个默认规则，例如 `file-loader` 或 `asset/resource`，以确保所有文件都有处理方式。

   ```js
   oneOf: [
     // 前面的规则...
     {
       // 默认规则
       type: 'asset/resource',
     },
   ];
   ```

3. **与其他配置的兼容性：**

   - `oneOf` 适用于需要明确优先级的场景，但某些场景（如 `include` 和 `exclude` 配置）可能需要额外注意规则的适配性。

   

## plugin

插件可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量

- clean-webpack-plugin

  ```js
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  
  plugins: [new CleanWebpackPlugin()];
  ```

  **现在可以在 webpack 的 output 配置项中编写一个字段 clean：boolean 实现 clean-webpack-plugin 插件的能力。**

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

  ```javascript
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  plugins: [
    new HtmlWebpackPlugin({
      template: '模板html文件路径path',
      filename: 'index.html', //打包后生成的html文件名
      minify: {
        removeAttributeQuotes: true, //移除html文件中的双引号
        collapseWhitespace: true, //压缩html代码
        removeComments: true
      },
      hash: true, //在引入打包后的js文件时，给它在script标签中src文件名的后面加上hash值，而不是打包后的js文件有hash值 <script type=text/javascript src=boundle.js?fd7b1ef895541b8c9717></script>，解决浏览器缓存的问题，可以不用该方法而给js打包文件加hash值。
        
      //chunks:[]  没有该字段时，默认情况下，在多入口时，生成的多个chunk都会被引入到上面的template字段引入指定的html模板文件的最后面，同时引入的顺序是以entry字段中各个入口模块的循序为准，所以如果模块打包后的结果存在依赖关系的话，必须保证它们的顺序正确。
        
      chunks: ['login', 'index'], //表示只即使有很多打包入口模块，都只在打包后html模板的中引入login和index两个chunk，且顺序以entry时出现的顺序引入。
        
      chunksSortMode: 'manual' //表示采用chunks中的顺序引入而不用entry中的引入顺序
    })
  ];
  ```

  

  

  ```js
  // webpack.config.js
  entry: {
      index: path.resolve(__dirname, './src/index.js'),
      index1: path.resolve(__dirname, './src/index1.js'),
      index2: path.resolve(__dirname, './src/index2.js')
  }
  ...
  plugins: [
      new HtmlWebpackPlugin({
          ...
          chunks: ['index','index2']
      })
  ]
  ```

  chunks 选项的作用主要是针对多入口(entry)文件。当有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然也可以指定引入哪些特定的文件。

  执行 webpack 命令之后，会看到生成的 index.html 文件中，只引用了 index.js 和 index2.js

  ```html
  <script type=text/javascript src=index.js></script>
  <script type=text/javascript src=index2.js></script>
  ```

  chunksSortMode 这个选项决定了 script 标签的引用顺序。默认有四个选项，'none', 'auto', 'dependency', '{function}'。

  - 'dependency' 按照不同文件的依赖关系来排序。
  - 'auto' 默认值，插件的内置的排序方式
  - 'none' 无序
  - {function} 提供一个函数

- copy-webpack-plugin

  用于将文件或文件夹从源目录复制到构建目录。它可以用于复制任何类型的文件，包括JavaScript文件。copy-webpack-plugin本身并不会自动将复制的JavaScript文件插入到打包后的HTML文件中。它的主要功能是复制文件，而不涉及HTML文件的修改或处理。所以在源码中使用时，一定要注意源码中引用的相对路径和打包后文件间的相对路径必须统一，不然无法找到对应的资源文件。

  **注意，该插件只是将指定目录下的文件拷贝一份到打包输出的文件夹中，但是并不将拷贝后的文件自动引入到打包生成的 html 中**。

  [文档](https://www.webpackjs.com/plugins/copy-webpack-plugin#root)
  
  ```js
  const CopyWebpackPlugin  = require('copy-webpack-plugin')
  
  plugins:[
      new CopyWebpackPlugin({
          patterns:[
              {
                  from:'src/public',
                  to: 'public'  // 将src/public目录下的文件复制到构建目录的public目录下
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
  
  

下图是源码中，直接以相对路径引用图片资源的情况：

![image-20231215095204895](.\images\image-20231215095204895.png)

下图是打包后生成文件的相对路径的情况：

![image-20231215095243255](.\images\image-20231215095243255.png)

可以看出他们必须保持一致才可以正常工作。

如果将插件的配置改为下面这样：

```js
const CopyWebpackPlugin  = require('copy-webpack-plugin')

plugins:[
  new CopyWebpackPlugin({
    patterns:[
      {
        from:'src/public',
        // to: 'public'  取消行代码
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

打包结果如下：

![image-20231215095528253](.\images\image-20231215095528253.png)

相对位置发生改变，则使用打包后的文件发布上线的话，则找不到对应的图片资源。





## 模式(mode)

- 开发构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，需要 sourcemap 文件，热更新

- 生产构建生成打包文件直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，不包括 sourcemap，可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件

- webpack 4.x 引入的 [mode](https://webpack.docschina.org/configuration/mode/) 

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

  devtool: false,
  cache: false,
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
      }),
      new TerserPlugin(/*...*/)
      // ...
    ]
  }
};
```



## 区分环境

读取变量的两个地方：

- webpack 配置文件被读取时所在的 node 环境，该环境的全局对象上有 process 进程对象

- 项目的源码文件实际运行所在的浏览器环境中，浏览器全局对象上没有 process 进程对象，访问则报错

  

1. **`--mode`用来间接设置模块内（源代码中）的`process.env.NODE_ENV`**

- 可以在模块内(**项目源文件代码中，不包括webpack配置文件**)通过`process.env.NODE_ENV`获取该`process.env.NODE_ENV`对应的字符串值（development 或者 production）并进行替换，这是在**编译阶段**做的**替换工作**，它和 webpack 配置文件中通过进程对象（process）中的环境变量对象(env) 上的 NODE_ENV 是两个完全不同的概念

```json
"script":{
    "build":"webpack --mode=development"
}
```

具体过程：`webpack --mode=development` => 设置 webpack.config.js 文件中 mode 的值为 development => mode 为开发模式（development ）下时，webpack 内部通过 webpack.definePlugin 插件设置字符串 process.env.NODE_ENV 在项目源码中的代表的实际值为 development， **在编译阶段，当解析到项目源码中有用到变量：process.env.NODE_ENV 时，直接将它替换为字符串（development）**，process.env.NODE_ENV 字符串除外。 webpack --mode=production 也是一样的原理。

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

**`--env` 用来设置传给 webpack 配置文件导出的函数的参数**，并不直接在项目的模块文件中生效。

在 script 脚本中使用 --env=development 的效果是为 webpack 配置文件默认导出的是函数时，可以在函数的参数中获取到该命令行中设置的参数。例如 script 脚本中：`"build": "webpack --env=development"` 那么下面代码中的 env 就是：`{ WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, development: true }`。argv 的结构则是：`{ env: { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, development: true } }`，但是因为 mode 默认没有设置时使用的是 production 模式，所以打包出来的源代码中的 process.env.NODE_ENV 变量的取值仍旧是 production 字符串。



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

webpack 配置文件中读取的是 node 配置的环境变量，可以通过 cross-env key=value 来设置。 然后在 webpack 配置文件中可以访问到设置的环境变量，然后再用这个环境变量作为 webpack.DefinePlugin插件配置项中的值，从而来改变项目模块内的变量的值或者打包方式。

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
console.log(process.env.NODE_ENV); // production,是由mode为production模式下的DefinePlugin插件设置的
console.log(process.env.FIRST_ENV); //  process.env.FIRST_ENV则直接在打包后文件中存在，运行时报错
```

**vue，react脚手架项目中可以通过.env 格式的文件向 node 环境中设置变量。借助的是一个第三方库：dotenv-expand。**



4. **`DefinePlugin`用来设置模块内(源码中)的全局变量**

- 设置所有模块都能读取到的值
- 可以在任意模块内通过 `process.env.xxx`或者其他**任意字段**表示自己设置好的值
- 无法在`node环境`(webpack 配置文件中)下获取当前的变量
- 注意在值为字符串是需要用引号包裹代引号的字符串

```js
plugins:[
   new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV)，
       'back_end_url':'"http://xxxx.xxx/xxx"'
   })
]
```

通过插件 DefinePlugin 设置的key可以直接在整个项目的源码中直访问。比如：

```js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env, argv) {
  return {
    mode: 'production',
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

**webpack 的配置文件的模块导出可以是一个函数，也可以是一个配置对象。其中函数可以接受命令行传递的参数。**



### Windows

#### CMD 

```
# 查看所有环境变量
set

# 查看单个环境变量（以 NODE_ENV 为例）
set NODE_ENV

# 设置单个环境变量（以 NODE_ENV 为例）
set NODE_ENV=production

# 删除单个环境变量（以 NODE_ENV 为例）
set NODE_ENV=
```

如果 `NODE_ENV` 没有设置，则通过 `set NODE_ENV` 命令查看时，会提示 `环境变量 NODE_ENV 没有定义`。

当设置完 `NODE_ENV`（假设设置值为 `production`），再通过 `set NODE_ENV` 命令查看时，会返回 `NODE_ENV=production`。

#### Powershell

```
# 查看所有环境变量
ls env:

# 查看单个环境变量（以 NODE_ENV 为例）
$env:NODE_ENV

# 设置单个环境变量（以 NODE_ENV 为例）
$env:NODE_ENV="production"

# 删除单个环境变量（以 NODE_ENV 为例）
del env:NODE_ENV
```

在 Powershell 命令面板的操作中，若 `NODE_ENV` 没有设置，则通过 `set NODE_ENV` 命令查看它时，没有任何提示。

当设置完 `NODE_ENV`（假设设置值为 `production`），再通过 `set NODE_ENV` 命令查看它时，会返回 `production`。

**注意点**

上面的环境设置只是临时的，即只针对当前运行窗口的环境有效。当 CLI 运行窗口关闭以后，相关设置都会丢失。

另外，虽然通过 CMD 和 Powershell 都能修改环境变量，但它们之间设置的环境变量并不会相互影响，即你在 CMD 可以设置 `NODE_ENV` 为 `production`，同时也可以在 Powershell 中设置 `NODE_ENV` 为 `development`，这也印证了上面的描述，设置只针对当前运行窗口有效 。

如果希望设置一直生效（即 本地设置），可通过 `控制面板 -> 系统和安全 -> 系统 -> 高级系统设置 -> 高级 -> 环境变量` 这样进行设置（Windows10、可能需要重启）。

### Mac 

因为只集成一种命令行终端，它设置 Nodejs 环境变量的语法如下：

```
# 查看所有环境变量
env

# 查看单个环境变量（以 NODE_ENV 为例）
echo $NODE_ENV

# 设置单个环境变量（以 NODE_ENV 为例）
export NODE_ENV=production

# 删除单个环境变量（以 NODE_ENV 为例）
unset NODE_ENV
```

在配置完 Nodejs 环境变量后，你就可以继续运行项目中的打包命令了。



### Lunix

```
# 查看所有环境变量
env

# 查看单个环境变量（以 NODE_ENV 为例）
echo $NODE_ENV

# 设置单个环境变量（以 NODE_ENV 为例）
export NODE_ENV=production

# 删除单个环境变量（以 NODE_ENV 为例）
unset NODE_ENV
```

在命令行操作中，若 `NODE_ENV` 没有设置，则通过 `echo $NODE_ENV` 命令查看它时，没有任何提示。

当设置完 `NODE_ENV`（假设设置值为 `production`），再通过 `set NODE_ENV` 命令查看它时，会返回 `production`。

但是，采用 命令行（CLI）设置 的方式来修改 Nodejs 环境变量有一个不好地方。即每次在运行打包命令前，都要先通过 `set NODE_ENV=xx` 或者 `export NODE_ENV=xx` 等类似的命令来设置或者切换环境变量（这里指的是重开了命令窗口，或者切换打包环境的情况下）。

第二种做法，即配置 package.json。

## 配置 package.json

在项目配置文件 package.json 中，根据不同的打包命令去设置相应的 Nodejs 环境变量，是一种非常主流的做法。其实本质上来说，只是将在命令行面板设置环境变量的命令语句放到了 `package.json` 文件中，把 设置环境变量 和 打包 两个命令合并运行而已。

这种方式，就是将 `NODE_ENV` 注入到 `process.env` 对象。不同环境下，设置如下：

### Windows 系统

在这种方式下，无论你是使用 CMD (命令提示符) 还是 Powershell 命令行工具，你都可以在 `package.json` 这样配置：

```
// package.json

{
  ...
  "scripts": {
    "build": "set NODE_ENV=production&& npm run clean && webpack",
    "clean": "rimraf ./build && mkdirp build",
  }
}
```

配置完后（`mkdirp` 是一个生成文件夹的第三方包），你只需要在命令行面板运行 `npm run build` 即可完成打包。

**注意点**

在 Windows 系统中，你必须移除环境变量命令与 `&&` 符号之间的空白。否者，配置的命令不能生效！

### Mac 系统

```
// package.json

{
  ...
  "scripts": {
    "build": "export NODE_ENV=production && npm run clean && webpack",
    "clean": "rimraf ./build && mkdirp build",
  }
}
```

从上面描述可以看到，不论是不同的操作系统，还是不同的命令行终端，虽然目的都是设置 Nodejs 环境变量，但它们的语法都不尽相同。这就带来两个问题：

- 在 Windows 开发部署的项目，可能在 Mac 系统无法正常打包
- 在跨平台开发的项目上，你还得记住每个命令行终端所使用的语法，也麻烦

为了解决这一问题，有人开发了 `cross-env`。

### 跨平台 - cross-env

[cross-env](https://www.npmjs.com/package/cross-env) 是一个跨平台设置环境变量的第三方包，它可以让你只配置一行命令，就能轻松地在多个平台设置环境变量。

首先，安装它（由于多个项目在用，所以就全局安装了）：

```
npm install -g cross-env
```

然后，在 `package.json` 文件中进行设置：

```
// package.json

{
  ...
  "scripts": {
    "build": "npm run clean && cross-env NODE_ENV=production webpack",
    "clean": "rimraf ./build && mkdirp build",
  }
}
```

这样，不管电脑是 Windows 系统还是 Mac 系统 ，不管用的 Powershell 还是 Git，你都可以正常设置 Nodejs 环境变量了。注意，`cross-env NODE_ENV=production && npm run clean && webpack` 此类的设置不能使环境变量生效。原因是 `&&` 符号把命令语句分离成了多个，每一个命令执行的环境都是隔离的，而 `cross-env` 无法作用于其他环境的命令。



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

- defaults : Browserslist 的默认浏览器 (> 0.5%,last 2 versions, Firefox ESR, not dead)。
- 5%:通过全球使用情况统计信息选择的浏览器版本。 >=，<和<=工作过
  - 5% in Us:使用美国使用情况统计信息。它接受两个字母的国家/地区代码。
  - \>5%in alt-As:使用亚洲地区使用情况统计信息，有关所有区域代码的列表，请参见 aniuse-lite/data/reqions
  - \>5%in my stats:使用自定义用法数据
  - \>5% in browserslist-config-mycompany stats :使用 来自的自定义使用情况数据 browserslist-onfig-mycompany/browserslist-stats,json.
  - cover 99.5%:提供覆盖率的最受欢迎的浏览器
  - cover 99.5%in us:与上述相同，但国家/地区代码由两个字母组成
  - cover 99.5%in my stats:使用自定义用法数据
- dead:24 个月内没有官方支持或更新的浏览器，现在是 E 10 Mob 11 BlackBerry 10Blackery7，Samsung 4 和 OperaMobile 12.1.
- last 2versions:每个浏览器的最后 2 个版本。
  - last 2 Chrome versions:最近 2 个版本的 Chrome 浏览器
  - last2 major versions 或 last 2 ios major versions:最近 2 个主要版本的所有次要/补丁版本
- not ie<= 8:排除先前查询选择的浏览器。
- browserslist config:在 Browserslist 配置中定义的浏览器。在差异服务中很有用，可用于修改用户的配置。

可以编写类似于这样的配置:

> \> 1% last 2 versions not dead

之后这些工具会根据配置来获取相关的浏览器信息，以方便决定是否需要进行兼容性的支持:

- 条件查询使用的是 caniuse-lite 的工具，这个工具的数据来自于 caniuse 的网站上;

直接使用 browserslist 命令行工具查询根据条件匹配到的浏览器：

```
npx browserslist ">1%, last 2 version, not dead"
```

![image-20220828190451254](images\image-20220828190451254.png)

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

| 类别 | 配置名称 | 描述 |
| :-- | :-- | :-- |
| output | path | 指定打包生成的输出到硬盘上的目录 |
| output | publicPath | 表示的是打包生成的 index.html 文件里面引用资源的前缀，同时动态引入的其他脚本也是基于这个路径去请求的 |
| devServer | static | 用于配置提供额外静态文件内容的目录 |

内部依赖的是 express 框架。onBeforeSetupMiddleware 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。

```js
module.exports ={
    devServer:{
        static:path.resolve(__dirname,'public'),
        port:8080,
        open:true,
        compress:true,  // 启动gzip压缩
        hot:true, // 启动模块热更新
        watchFiles:[ 'path'],  // 不写就监控所有文件
        historyApiFallback:true, // 参数用于设置是否启用 HTML5 历史记录 API，用于处理单页应用的路由问题。默认情况下，当使用浏览器的前进/后退按钮时，devServer 会尝试根据 URL 路径查找对应的静态资源，如果找不到就返回 404。如果启用了 historyApiFallback，则会将这些请求重定向到 index.html，然后交给前端路由来处理
        proxy:{
            '/api':'http://localhost:3000',
            '/api2':{
                target:'http://localhost:3001',
                pathRewrite:{"^/api2":''}
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
}
```

使用 webpack-dev-server 时，内部会使用 webpack 的配置文件模拟打包，并将打包后生成文件的文件根目录和 static 字段指定的文件夹合并后，作为 web 服务器的根目录（/），当访问该地址时，默认访问的就是根目录下的 index.html 文件。而 devServer 配置项指定的目录中的文件也会直接放在本地服务器的根目录下。



```js
webpackRequire.p = 'http://www.baidu.com';  // 这个就是output中publicPath配置项设置的值

webpackRequire.f.j = (chunkId, promises) => {
    var promise = new Promise(
        (resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject])
    );
    promises.push((installedChunkData[2] = promise));
    var url = webpackRequire.p + webpackRequire.u(chunkId);
    webpackRequire.l(url);
};
```





## css-loader 配置

css-loader：处理 CSS 中的 `url` 与 `@import`，并将其视为模块引入，此处是通过 postcss 来解析处理。`css-loader` 的原理就是借助postcss，用 `postcss-value-parser` 解析 CSS 为 AST，并将 CSS 中的 `url()` 与 `@import` 解析为模块。

将 CSS 文件中的样式代码转换成 JavaScript 对象，并以commonjs写法导出，以便于其他 Loader 或插件进行处理。



style-loader：使用 DOM API 加载 CSS 资源，使得 CSS 需要在 JS 资源加载完后通过执行js动态创建style标签，容易出现页面抖动，性能低且对于 SSR 不友好。由于性能需要，在线上通常需要单独加载 CSS 资源，这要求打包器能够将 CSS 打包，此时需要借助于 [mini-css-extract-plugin(opens in a new tab)](https://github.com/webpack-contrib/mini-css-extract-plugin) 将 CSS 单独抽离出来。

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

> importLoaders:boolean | number, // importloaders Allows to enables/disables or setups number of loaders applied before CSS loader for @import at-rules

css-loader 在 css 文件中默认支持 **~ 符号**表示 node_modules 文件路径，不需要用户去配置。

- @是 webpack 设置的路径别名，在 webpack 配置文件中设置以后，也可以在 css 中使用
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

不能在 js 文件中不配置就使用“~”，比如不能：import img from '~module/images/a.jpg'

node-sass sass-loader；sass：老版后缀；scss：新版本后缀

node-sass 负责将 scss 或者 sass 编译为 css，原始的 sass 包使用 ruby 写的，本地安装的话需要编译，node-sass 是 node 写的，比较好安装执行。



## webpack-dev-middleware

[webpack-dev-middleware](https://www.npmjs.com/package/)就是在 Express 中提供 `webpack-dev-server` 静态服务能力的一个中间件

```shell
npm install webpack-dev-middleware --save-dev
```



```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');

const app = express();
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
```

- webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可
- 而使用`webpack-dev-middleware`的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等



## CSS 兼容性

PostCSS 是一个独立的工具，可以脱离 webpack 单独使用（postcss-cli 在命令行单独使用 postcss 时需要安装该插件）。可以通过 JavaScript 来转换css样式，css 的转换和适配，自动添加浏览器厂商前缀，css 样式重置，css 单位转换。

- `PostCSS` 将 CSS 解析成 AST（抽象语法树），然后使用插件对 AST 进行处理，最后将处理后的 AST 转换为 CSS 代码
- [autoprefixer](https://github.com/postcss/autoprefixer) 是 PostCSS 的一个插件，它可以根据指定的浏览器版本自动添加所需的浏览器前缀。通过使用 autoprefixer，我们可以避免手动添加浏览器前缀的麻烦，同时也可以确保项目在各个浏览器中正确地显示
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env) 是 PostCSS 的一个插件集合，它可以使用未来的 CSS 语法，而不需要等待浏览器支持。postcss-preset-env 包含了一些常用的 CSS 预处理器的语法，如 Sass 和 Less，以及一些未来的 CSS 语法，如 CSS Grid、CSS Variables 等
- [postcss-less](https://github.com/shellscape/postcss-less) 是 PostCSS 的一个插件，它可以让我们使用 Less 预处理器的语法，从而可以更方便地编写 CSS 代码。通过使用 postcss-less，可以在 Webpack 构建项目时自动将 Less 代码转换为标准的 CSS 代码



还需要结合 Browserlist 的版本兼容配置文件来使用。

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





## 资源模块

- [Rule.type](https://webpack.js.org/configuration/module/#rule)
- [asset-modules](https://webpack.js.org/guides/asset-modules/)

type 的四种类型：

1. asset/resource 生成单独的文件并导出 URL，在默认情况下，使用`asset/resource`类型的加载器会生成带有`[hash][ext][query]`后缀的文件名。如果需要自定义文件名，可以通过设置`output.assetModuleFilename`属性进行控制
2. asset/source   导出资产的源代码
3. asset/inline  导出资产的数据 URI
4. asset  会自动选择导出数据 URI 还是生成单独的文件,可以设置文件大小限制来实现

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
  ```

- `url-loader` => `asset/inline` 导出一个资源的 base64

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
        maxSize: 10 *1024   // 小于该体积（10kb）则打包为base64
      }
    }
  }



```js
{
    test:/\.(ttf|eot|woff|woff2)$/,
    type:'asset/resource',
    generator:{
        filename:"font/[name].[ext]"
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
  imgEl.src = require('./src/asset/images/xx/xx.jpg').default  //  file-loader 5版本中的特点
  
  import imgSrc from './src/asset/images/xx/xx.jpg'
  const imgEl = new Image()
  imgEl.src = imgSrc

有时经过 webpack 打包后的文件希望保留源文件的名字再外加一些特别的标识符进行表示。这时候可以借助 webpack 中占位符来实现。常用的占位符：

- [ext] 文件扩展名

- [name] 原文件名

- [hash] 本地打包的 hash 值

- [contentHash] 该文件内容对应的 hash 值

- [hash:length] 指定长度的 hash 值

- [path] 文件相对于 webpack 配置文件的路径

现在无法直接在 webpack5 中使用 file-loader，url-loader 来打包 CSS 文件中的图片了，而需要改动：

具体参考文章https://blog.csdn.net/w184167377/article/details/118930758

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





### 图片压缩

- image-webpack-loader可以在Webpack打包过程中对图片进行优化和压缩，从而减小图片文件的大小，提高页面加载速度和响应速度
- 这个库直接安装的话，比较难安装成功，因为里面依赖了一些二进制文件需要编译，网络环境不好的话，就难安装上
- 它的底层依赖于imagemin和一系列的图像优化工具，包括 mozjpeg、optipng、pngquant、svgo、gifsicle和webp等，可以自动选择最优的优化工具对图片进行处理
  - optipng：用于压缩PNG图片的配置项
  - pngquant：同样用于压缩PNG图片的配置项，可以设置图片质量和压缩速度
  - svgo：用于压缩SVG图片的配置项，包含多个插件
  - gifsicle：用于压缩Gif图片的配置项
  - webp：用于将JPG/PNG图片压缩并转换为WebP图片格式的配置项

```diff

   {
        test: /\.(png)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(jpg)$/,
        type: "asset/inline"
      },
      {
        test: /\.(bmp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 1024
          }
        }
      },
      {
        test: /\.svg$/i,
       type: "asset/source"
      },
+     {
+       // 匹配文件的正则表达式，这里表示匹配JPG、PNG、GIF和SVG格式的图片文件
+       test: /\.(jpe?g|png|gif|svg)$/i, 
	     type:'xxxx'  // 也可以在这里设置
+       use: [
+         {
+            // 使用image-webpack-loader对图片进行优化和压缩
+           loader: 'image-webpack-loader',
+           options: {
+             // 是否禁用图片优化和压缩
+             disable: process.env.NODE_ENV === 'development', 
+             mozjpeg: {
+               progressive: true, // 是否开启渐进式JPEG，可以有效提升JPEG图片加载速度
+               quality: 65 // 压缩JPEG图片的质量，取值范围为0到100，值越大质量越好但文件越大
+             },
+             optipng: {
+               enabled: true // 是否开启PNG图片的优化，可以有效提升PNG图片加载速度
+             },
+             pngquant: {
+               // 压缩PNG图片的质量范围，取值范围为0到1，值越大质量越好但文件越大
+               // 第一个数字表示压缩质量的下限，第二个数字表示压缩质量的上限
+               quality: [0.65, 0.9], 
+               speed: 4 // 压缩PNG图片的速度，取值范围为1到10，值越大速度越快但质量越低
+             },
+             svgo: {
+               plugins: [ // 压缩SVG图片的插件列表，这里包含removeViewBox和cleanupIDs两个插件
+                 { //用于删除SVG图片中的viewBox属性
+                   //viewBox属性是用来指定SVG视口范围的，它的值是一个矩形框的坐标和宽高
+                   removeViewBox: false
+                 },
+                 { //用于删除SVG图片中的无用ID属性
+                   cleanupIDs: true
+                 }
+               ]
+             },
+             gifsicle: {
+               interlaced: true // 是否开启GIF图片的隔行扫描,可以有效提升GIF图片加载速度
+             }
+           }
+         }
+       ]
+     } 
```



### 图片响应式

- 响应式图片是指能够根据设备屏幕大小和分辨率等因素动态调整显示大小和清晰度的图片
- 在不同设备上显示同一张图片时，响应式图片可以自动选择最优的图片版本，从而保证图片显示效果的一致性和优化网站性能
- responsive-loader是一个webpack的loader，用于实现响应式图片的功能。它可以根据设备屏幕大小和像素密度等因素自动调整图片大小和清晰度，从而提高网站的用户体验和性能
  - sizes：用于指定不同尺寸的图片大小。在这个例子中，我们指定了4个不同的图片大小，分别是300px、600px、1200px和2000px。当加载图片时，responsive-loader会根据设备的屏幕大小和像素密度等因素自动选择最合适的图片大小
  - adapter：用于指定图片处理库。在这个例子中，我们使用了sharp库，它是一个高性能的图片处理库，可以用来自动调整图片大小和清晰度
- srcset和sizes是HTML中img标签的两个属性，用于实现响应式图片的功能，可以根据设备屏幕大小和像素密度等因素自动选择最合适的图片版本和显示大小，从而提高网站的用户体验和性能
- srcset属性用于指定不同尺寸和清晰度的图片版本，它的值是一个以逗号分隔的图片列表，每个图片元素包含了图片URL和对应的宽度或像素密度等信息
- sizes属性用于指定图片在不同屏幕尺寸下的显示大小，它的值是一个以逗号分隔的尺寸列表，每个尺寸元素包含了媒体查询和对应的尺寸信息
- 浏览器加载这个img标签时，它会根据设备的屏幕大小和像素密度等因素，选择最合适的图片版本，并根据sizes属性指定的尺寸大小进行显示

```bash
npm i responsive-loader sharp --save
```



```diff
+     {
+                test: /\.(jpe?g|png)$/i,
+               //oneOf是一个优化选项，用于提高打包的速度
+               oneOf:[
+                   {
+                       //resourceQuery是一个用于匹配请求资源的URL中查询字符中
+                       resourceQuery:/sizes/,
+                       use:[
+                           {
+                            loader:'responsive-loader',
+                            options:{
+                               // sizes:[300,600,1024],
+                               adapter:require('responsive-loader/sharp')
+                            }
+                           }
+                        ]
+                   },
+                   {
+                       type: 'asset/resource',
+                   }
+               ]
+           }  
```



源码中使用：

```js
import responsiveImg from './images/bg.png?sizes[]=300,sizes[]=600,sizes[]=1024';
console.log(responsiveImg);
let image = new Image();
image.srcset = responsiveImg.srcSet;
image.sizes = `(min-width: 1024) 1024px,100vw`;
document.body.appendChild(image);
```



打印的responsiveImg变量的值

![image-20241226180902970](D:\learn-notes\工程化\images\image-20241226180902970.png)



## JS 兼容性处理

- Babel 默认只转换新的 ES 语法，比如箭头函数

让 babel 能转换其他新语法需要借助包或者 babel 插件

- [babel-loader](https://www.npmjs.com/package/babel-loader)使用 Babel 和 webpack 转译 JavaScript 文件，用来读取加载项目源码中的 js 文件
- [@babel/core](https://www.npmjs.com/package/@babel/core)Babel 编译的核心包,babel-loader 读取的源码传给@babel/core，由@babel/core 将源码转为 AST 语法树，但是它不知道怎么转为代码，它需要将不同的 ast 部分转发给不同插件或者预设取处理
- [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env) 是 Babel 的一个预设，用于自动检测目标环境并根据需要转换 JavaScript 代码
- [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react) React 插件的 Babel 预设
- `@babel/preset-typescript` 是 Babel 的一个规则集，用于将 TypeScript 代码转译为 JavaScript 代码
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

loose：true 表示可以以 obj.xxx 的方式给对象添加属性，为 false 的话表示 babel 最后以 object.defineProperty 的方式给对象添加属性。



### babel-polyfill

- Babel默认只转换新的Javascript语法，而不转换新的API，比如
  - Iterator, Generator, Set, Maps, Proxy, Reflect,Symbol,Promise 等全局对象
  - 在全局对象上的方法，比如说ES6在Array对象上新增了`Array.find`方法，Babel就不会转码这个方法
- 如果想让这个方法运行，必须使用 `babel-polyfill`来转换等
- Babel 7.4之后不再推荐使用@babel/polyfill
- babel v7 推荐使用@babel/preset-env代替以往的诸多polyfill方案
- [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill)
- [babel-runtime](https://babeljs.io/docs/en/babel-runtime)
- [babel-plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

```bash
npm i @babel/polyfill
```

- `babel-polyfill` 它是通过向全局对象和内置对象的`prototype`上添加方法来实现的。比如运行环境中不支持`Array.prototype.find`方法，引入`polyfill`, 我们就可以使用`ES6`方法来编写了，但是缺点就是会造成全局空间污染
- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)为每一个环境的预设
- `@babel/preset-env`默认只支持语法转化，需要开启`useBuiltIns`配置才能转化API和实例方法
- `useBuiltIns`可选值包括："usage" | "entry" | false, 默认为 false，表示不对`polyfills` 处理，这个配置是引入 polyfills 的关键
- `useBuiltIns: false` 此时不对 `polyfill` 做操作。如果项目中手动引入了 `@babel/polyfill`，则无视配置的浏览器兼容，全量引入所有的 `polyfill`，无视需要兼容的浏览器条件，打包体积大



#### useBuiltIns: false 

src/index.js

```js
import '@babel/polyfill';
let sum = (a, b) => a + b;
let promise = Promise.resolve();
console.log([1, 2, 3].find(item => item === 2));
```

webpack.config.js

```diff
const path = require('path');
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceType: "unambiguous",
+                       presets: [["@babel/preset-env", { useBuiltIns: false }]]
                    }
                }
            }
        ]
    },
    plugins: []
};
```



#### **useBuiltIns: "entry"**

- 在项目入口引入一次（多次引入会报错）

- "useBuiltIns": "entry" 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill。需要在入口文件手动添加 `import '@babel/polyfill'`，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill，不管自己编写的源代码中是否需要兼容哪些API，都根据条件统一打包到源码中

- 这里需要指定 core-js 的版本,`corejs`默认是2

- 如果配置 `corejs: 3`, 则`import '@babel/polyfill'` 需要改成 `import 'core-js/stable';import 'regenerator-runtime/runtime';`

  ```bash
  npm install --save core-js@2    npm install --save core-js@3
  ```

  

  core-js@2

  ```js
  import '@babel/polyfill';
  let sum = (a, b) => a + b;
  let promise = Promise.resolve();
  console.log([1, 2, 3].find(item => item === 2));
  ```

  

  core-js@3


  ```js
  import 'core-js/stable';
  import 'regenerator-runtime/runtime';
  let sum = (a, b) => a + b;
  let promise = Promise.resolve();
  console.log([1, 2, 3].find(item => item === 2));
  ```

  #### webpack.config.js

  ```diff
  {
    test: /\.js?$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
  +         presets: [["@babel/preset-env", { useBuiltIns: 'entry', corejs: { version: 3 } }]]
        }
    }
  }
  ```



#### **"useBuiltIns": "usage" **

- "useBuiltIns": "usage" `usage` 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
- 当设置为usage时，polyfill会自动按需添加，不再需要手工引入`@babel/polyfill`





### babel-runtime

- 为了解决babel-folyfill全局空间污染的问题，提供了单独的包[babel-runtime](https://babeljs.io/docs/en/babel-runtime)用以提供编译模块的工具函数
- 简单说 `babel-runtime` 更像是一种按需加载的实现，比如你哪里需要使用 `Promise`，只要在这个文件头部`import Promise from 'babel-runtime/core-js/promise'`就行了

```bash
npm i babel-runtime --save-dev
```

src/index.js

```js
import Promise from 'babel-runtime/core-js/promise';
const p = new Promise(()=> {});
```



### babel-plugin-transform-runtime

- @babel/plugin-transform-runtime插件是为了解决
  - 多个文件重复引用 相同helpers(帮助函数)=>提取运行时
  - 新API方法全局污染 -> 局部引入
- 启用插件`babel-plugin-transform-runtime`后，Babel就会使用`babel-runtime`下的工具函数
- `babel-plugin-transform-runtime`插件能够将这些工具函数的代码转换成`require`语句，指向为对`babel-runtime`的引用
- babel-plugin-transform-runtime 就是可以在我们使用新 API 时自动 importbabel-runtime里面的polyfill
  - 当使用 `async/await` 时，自动引入 `babel-runtime/regenerator`
  - 当使用 ES6 的静态事件或内置对象时，自动引入 `babel-runtime/core-js`
  - 移除内联`babel helpers`并替换使用`babel-runtime/helpers` 来替换

```bash
npm i @babel/plugin-transform-runtime @babel/runtime-corejs3 --save-dev
```

webpack.config.js

```js
{
    test: /\.js?$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            sourceType: "unambiguous",
            presets: [["@babel/preset-env", { useBuiltIns: 'usage', corejs: { version: 3 } }]],
            plugins: [
                [
                    "@babel/plugin-transform-runtime",
                    {
                        corejs: 3,
                        helpers: true,
                        regenerator: true
                    }
                ],
            ]
        }
    }
 }
```

当我们使用 ES6 的静态事件或内置对象时自动引入 babel-runtime/core-js

```js
//var _Promise = __webpack_require__("./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js");
const p = new Promise(() => { });
console.log(p);
```



#### helpers: true

- 移除内联babel helpers并替换使用`babel-runtime/helpers` 来替换
- 避免内联的 helper 代码在多个文件重复出现

```js
class A {

}
class B extends A {

}
console.log(new B());
```

#### regenerator: true

- 是否开启`generator`函数转换成使用`regenerator runtime`来避免污染全局域

```js
//var _regeneratorRuntime = __webpack_require__(/*! @babel/runtime-corejs3/regenerator */ "./node_modules/@babel/runtime-corejs3/regenerator/index.js");

function* gen() {

}
console.log(gen());
```



#### 最佳实践

- @babel/preset-env和plugin-transform-runtime二者都可以设置使用corejs来处理polyfill

####  项目开发

- useBuiltIns使用usage

- plugin-transform-runtime只使用其移除内联复用的辅助函数的特性，减小打包体积

  ```json
  {
    "presets": [
      [
        "@babel/preset-env",
        {
          "useBuiltIns": "usage",
          "corejs": 3
        }
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: false,
          helpers: true,
          regenerator: true
        }
      ]
    ]
  }
  ```

#### 类库开发

- 类库开发尽量不使用污染全局环境的`polyfill`，因此`@babel/preset-env`只发挥语法转换的功能
- polyfill由`@babel/plugin-transform-runtime`来处理，推荐使用core-js@3

```json
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3
        }
      }
    ]
  ]
}
```



#### polyfill-service

- [polyfill.io](https://polyfill.io/v3/)自动化的 JavaScript Polyfill 服务
- [polyfill.io](https://polyfill.io/v3/)通过分析请求头信息中的 UserAgent 实现自动加载浏览器所需的 polyfills

```js
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
```





## TS

在 Webpack 中，`ts-loader` 和 `babel-loader` 都可以用来将 TypeScript 转换为 JavaScript，但它们的设计目标和工作方式不同，因此在实际使用中会有所区别。

- `ts-loader` 是 Webpack 中的一个加载器，用于将 TypeScript 代码转换成 JavaScript 代码。它是基于 typescript 编译器实现的，支持所有 TypeScript 的语法和特性，可以帮助开发者在 Webpack 中使用 TypeScript 进行开发
- 直接使用 TypeScript 编译器 (`tsc`) 进行编译。
- 完全遵循 `tsconfig.json` 的配置，例如模块解析、类型检查等。
- 内置类型检查功能，能在编译过程中发现类型错误。
- 可能会导致构建速度变慢，尤其是在大项目中。
- 完全支持 TypeScript 的所有功能和特性。
- 如果项目依赖 TypeScript 的高级特性（如路径映射、声明文件生成等），`ts-loader` 更合适。



webpack.config.js

```diff
const path = require('path');
module.exports = {
+ entry: './src/index.ts',
  module: {
    rules: [
+     {
+       test: /\.ts$/,
+       use: 'ts-loader',
+       exclude: /node_modules/
+     },
    ]
  },

};
```



- `@babel/preset-typescript` 是 Babel 的一个预设，用于将 TypeScript 代码转换为 JavaScript 代码

- 使用 Babel 进行转译，需要借助 `@babel/preset-typescript` 来支持 TypeScript 语法。

- Babel 只负责语法转换，不进行类型检查，需要额外运行 TypeScript 类型检查工具（例如 `tsc --noEmit` 或 `fork-ts-checker-webpack-plugin`）来捕捉类型错误。

- 适合更高效的转译流程，尤其是在大型项目中。

  

```diff
      {
        test: /\.ts$/,
        use: 
+       [
+         {
+           loader: 'babel-loader',
+           options: {
+             presets: ['@babel/preset-typescript']
+           }
+         }
+       ],
        exclude: /node_modules/
      },
```



### 选择

- **只用 TypeScript 的项目：**
  - 推荐使用 `ts-loader`，因为它完全遵循 TypeScript 的配置，且更适合处理 TypeScript 专属特性。
- **TypeScript + Babel 的项目：**
  - 推荐使用 `babel-loader`，并结合 Babel 的生态。如果需要类型检查，可以搭配 `fork-ts-checker-webpack-plugin` 或单独运行 `tsc`。
- **大型项目：**
  - 如果构建性能是关键因素，可以选择 `babel-loader` 进行快速语法转译，同时使用独立的类型检查流程（如 `tsc --noEmit`）。



### 最佳实践

如果需要在项目中结合两者的优势，可以这样配置：

1. 使用 `babel-loader` 转译 TypeScript 代码。
2. 使用 `fork-ts-checker-webpack-plugin` 或 `tsc --noEmit` 进行类型检查。

例如：

```js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
```

这样既能享受 Babel 的高性能和生态，又能确保 TypeScript 的类型安全。



## eslint

- ESLint是JavaScript代码检查工具，在编写代码时自动检查代码风格(这个一般交给prettier去做)和语法错误。为了满足不同团队和项目的代码规范需求，ESLint生态中出现了许多基于不同代码规范的规则集合和插件
- `eslint-config-airbnb` 是Airbnb提供的代码风格规则集。它的优点在于提供了一套完整的、可自定义的代码规范，旨在帮助开发者编写具有一致性和可读性的代码
- `eslint-config-standard`遵循Standard.js代码风格规范，提供了最便捷的统一代码风格的方式。使用该规则集可以避免因代码风格不一致而引起的错误和混乱
- `eslint-plugin-vue`和`eslint-plugin-react`插件来实现对SFC文件和React代码风格的检查
- 针对TypeScript代码的检查，可以使用`@typescript-eslint/eslint-plugin`插件来检查代码风格和语法错误
- `eslint-plugin-sonarjs`插件，该插件基于`Sonar`提供了代码质量检查工具，提供圈复杂度、代码重复率等检测功能



### 旧版配置

```shell
npm install eslint eslint-loader babel-eslint --D
```

```diff
module: {
    rules: [
+      {
+        test: /\.jsx?$/,
+        loader: 'eslint-loader',
+        enforce: 'pre',   //   值：不写  pre前置  post后置 确定针对同一个文件的规则匹配的优先级
+        options: { fix: true },
+        exclude: /node_modules/,
+      }, // 先检查代码风格，在进行编译
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

```shell
npm i eslint-config-airbnb eslint-loader eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y -D
```

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

npx eslint. --init 问答式选择生产.eslintrc.js 文件，同时会安装一些配置预设和插件。

以前通过配置 loader 实现在编译阶段对源代码规范的校验并在不规范的情况下报错。

现在则改为插件的形式。同时原来的解析器 babel-eslint 已经停止维护了，现在使用@babel/eslint-parser。

```js
// webpack.config.js

const ESLintPlugin = require('eslint-webpack-plugin');

plugins: [
  new ESLintPlugin({
    fix: true
  })
];
```

.eslintrc.js

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@babel/eslint-parser', // 不用这个解析器则是用eslint默认的
  extends: ['plugin:react/recommended', 'airbnb'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': 'error',
    'no-undef': 'error'
  }
};
```



## MAP项目配置

在 Webpack 中，当项目有多个模板 HTML 文件且每个模板 HTML 都对应一个入口模块时，需要使用多入口配置来构建。以下是典型的 Webpack 配置文件示例，适用于这样的场景：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entries = {
  index: './src/index.js',
  about: './src/about.js',
  contact: './src/contact.js',
};

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js', // 输出的文件名对应入口名称
    clean: true, // 清理旧文件  
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    ...Object.keys(entries).map((entryName) => 
      new HtmlWebpackPlugin({
        filename: `${entryName}.html`, // 生成的 HTML 文件名
        template: `./src/templates/${entryName}.html`, // 模板路径
        chunks: [entryName], // 指定入口文件    chunks 用于指定当前模板使用的入口模块，防止加载不相关的 JS 文件。
      })
    ),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // 提取公共模块   配置 optimization.splitChunks 提取公共模块（如第三方库），减少重复代码。
    },
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 8080,
  },
};

```



```text
project/
├── src/
│   ├── index.js
│   ├── about.js
│   ├── contact.js
│   ├── templates/
│   │   ├── index.html
│   │   ├── about.html
│   │   └── contact.html
│   ├── styles/
│   │   ├── index.css
│   │   ├── about.css
│   │   └── contact.css
├── dist/
├── webpack.config.js
├── package.json
```



`HtmlWebpackPlugin` 插件中的 `chunks` 选项的作用是指定当前生成的 HTML 文件中需要引入的 JavaScript 模块（即 Webpack 中的入口文件）。它提供了精确的控制，确保只包含与当前 HTML 文件相关的脚本，从而避免加载多余的文件。

------

### **`chunks` 选项的主要功能**

1. **指定引入的脚本**:
   - 当项目使用多入口配置时，每个入口文件可能会生成不同的 JavaScript 文件。通过 `chunks` 指定关联的入口文件，可以确保 HTML 文件只引入相关的 JS 文件。
2. **优化加载性能**:
   - 通过只加载所需的模块，减少不必要的脚本加载，提升页面性能。
3. **避免冲突**:
   - 当每个页面使用不同的模块时，避免引入错误或不需要的代码导致的冲突或错误。

------

### **`chunks` 的使用场景**

#### 1. 多入口配置

在多页面应用中，不同的 HTML 文件对应不同的入口模块。例如：

- `index.html` 对应 `index.js`
- `about.html` 对应 `about.js`
- `contact.html` 对应 `contact.js`

**配置示例**:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    about: './src/about.js',
    contact: './src/contact.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.html',
      chunks: ['index'], // 仅引入 index.js
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: './src/templates/about.html',
      chunks: ['about'], // 仅引入 about.js
    }),
    new HtmlWebpackPlugin({
      filename: 'contact.html',
      template: './src/templates/contact.html',
      chunks: ['contact'], // 仅引入 contact.js
    }),
  ],
};
```

#### 2. 引入多个入口文件

有时一个页面需要引入多个入口文件，可以在 `chunks` 中同时指定：

**配置示例**:

```js
new HtmlWebpackPlugin({
  filename: 'dashboard.html',
  template: './src/templates/dashboard.html',
  chunks: ['index', 'about'], // 同时引入 index.js 和 about.js
});
```

------

### **不使用 `chunks` 会发生什么？**

如果不设置 `chunks`，`HtmlWebpackPlugin` 会默认引入所有的入口模块（即 `entry` 中的所有文件）。这可能导致以下问题：

1. 加载多余脚本:
   - 所有的入口文件都会被加载，可能包含不相关的代码，浪费资源。
2. 潜在的冲突:
   - 不同页面的脚本可能相互影响（如全局变量冲突）。

------

### **对比 `chunks` 和 `excludeChunks`**

- **`chunks`**: 指定要包含的入口模块。
- **`excludeChunks`**: 指定要排除的入口模块。

**示例**:

```js
// 只引入指定模块
new HtmlWebpackPlugin({
  filename: 'index.html',
  chunks: ['index'], // 仅引入 index.js
});

// 排除指定模块
new HtmlWebpackPlugin({
  filename: 'index.html',
  excludeChunks: ['about', 'contact'], // 排除 about.js 和 contact.js
});
```

------

### 总结

`chunks` 的作用是为每个生成的 HTML 文件精确指定需要加载的入口模块，避免引入不必要的脚本文件，提升加载性能和代码管理效率。合理使用 `chunks` 可以确保 Webpack 配置更灵活、更高效。





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

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'，
    clean:true
  },
  plugins: [
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
// modules存放项目中除了入口模块之外依赖的所有模块（依赖关系图的生成结果）， key（模块id）是模块对于项目的所在根目录的相对路径，值是函数，函数体内容由模块文件的内容组成
var modules = {
  //不管源码中是模块路径，相对或绝对路径，最后都转为相对于项目根目录的相对路径
  './src/title.js': (module, exports, require) => {
    module.exports = 'title';
  }
};

// 缓存已经被引入过的模块
var cache = {};

// require方法，相当于webpack在浏览器端实现一个require的polyfull的方法
function require(moduleId) {
  if (cache[moduleId]) {
    return cache[moduleId].exports;
  }

  var module = cache[moduleId] = {
    id: moduleId,
    loaded: false,
    exports: {}
  }z;

  modules[moduleId](module, module.exports, require);
  return module.exports;
}

var exports = {};

let title = require('./src/title.js');   // 可以看出整个代码是同步执行的
console.log(title);
```



当 index.js 中引入两个依赖文件 test1.js 和 test2.js 时的打包结果：

```js
var webpackModules = {
  './src/test/test1.js': (module, unusedWebpackExports, webpackRequire) => {
    module = webpackRequire.nmd(module);
    module.export = 'test1';
  },

  './src/test/test2.js': (module, unusedWebpackExports, webpackRequire) => {
    module = webpackRequire.nmd(module);
    module.export = 'test2';
  }
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
    exports: {}
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

const test1 = webpackRequire('./src/test/test1.js');
const test2 = webpackRequire('./src/test/test2.js');
console.log(test1);
console.log(test2);
```

在 webpack 中有两种模块化规范，commonjs 和 esmodule，他们之间可以相会转换和混用。并且在 webpack 打包后都统一使用 commonJS 模块规范。



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
  // 定义了一个对象，将每一个加载的模块以及模块对应的代码，添加到该函数内部，然后该函数作为值，而模块的路径对应key。 在commonjs中并没有将入口文件加入到__webpack_modules__对象内部作为一个属性。而在ES6的中是做了。可以看下面的ES6打包文件
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
        age: () => age // 从这里可以看出esmodule的导出，导出的是变量本身，这不同于commonjs导出的是值或者对象引用，而且在定义时，并没有提供对应属性的setter方法，所以导入该模块的其他模块是无法修改该导出变量的值的。 而且该模块中在后续修改了该变量对应的值后，其他模块再次访问导出的变量时，会是最新的值。
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
export default 'title_name';
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
      default: () => _DEFAULT_EXPORT__,
      age: () => age
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
console.log(name); // 这里的默认导入实际上就是被导入的commonjs模块的module.exports对象
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
    //只要打包前的模块是一个es module,那么就会调用require.r方法进行标识
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

![image-20220522184522377](images\image-20220522184522377.png)



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

懒加载和代码分割，原生的代码分割点，可以分割模块为一个个单独的文件一个个加载。 

```js
// index.js  import返回的结果是一个promise实例，返回的结果不管源文件是commonjs还是esmodule，都包装为esmodule
import(/* webpackChunkName: "hello" */ './hello.js').then((result) => {
  console.log(result.default);
});

// hello.js
export default 'hello';
```

打包后，用户访问打包后的 html 文件，该文件引入了整个项目的启动 js 文件（build.js 或者 main.js）,不会加载拆包后没有用到的 js 文件。当在浏览器中执行启动 js 文件时，该文件会将用到的 js 文件通过创建 script 标签的形式去加载拆包的 js 文件，请求回来的 js 文件一解析执行就会触发已经在前端被定义好的方法——webpackJsonpCallback，这个方法会将请求回来 js 的文件依次内容挂载到 modules，同时执行相应文件之前准备的 promise 的 resolve 方法。当所有文件都加载完成且 promise 的 resolve 方法都成功调用后，将触发 Promise.all，然后在 promise.all 的 then 方法中依次触发 require 方法，加载并执行已经挂载到 modules 上的请求回来的 js 文件内容。

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
  script.onload = () => {
    script.remove();
  };
};

//jsonp 通过JSONP的方式加载chunkId对应的JS文件，生成一个promise放到promises数组里
require.f.j = (chunkId, promises) => {
  let installedChunkData = installedChunks[chunkId];
  if (installedChunkData === 0) {
    return;
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



**src_hello_js.js**：

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

- 抽象语法树（Abstract Syntax Tree，AST）是源代码结构的一种抽象表示
- 它以树状的形式表现编程语言的代码结构，树上的每个节点都表示源代码中的一种结构
- 原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操作这颗树，可以精准的定位到声明语句、赋值语句、运算语句等，实现对代码的分析、优化、变更等操作

### 用途

- 代码语法、风格检查，代码的格式化、高亮、错误提示、自动补全等
- 优化变更代码，改变代码结构使达到想要的结构

![ast](http://img.zhufengpeixun.cn/ast.jpg)

第一步：词法解析，拆成最小词法单元，一个个分词（token）都有自己的含义。

第二步：语法分析，生成 ast，程序由一行行代码组成，每行代码都是 body 中的某个元素，body 本身是数组格式，每个元素都有一个类型（如：变量声明）是一个节点。

`JavaScript Parser`是把 JavaScript 源码转化为抽象语法树的解析器



在 JavaScript 社区中，有几个常用的 JavaScript 解析器（Parser）。以下是其中一些常见的 JavaScript 解析器：

1. Acorn: 一个轻量、快速的 JavaScript 解析器，完全由js代码实现，它以可扩展的方式解析 JavaScript 代码，并将其转换为抽象语法树（AST）。Acorn 被广泛用于各种工具和项目中（webpack、rollup中）。
2. Esprima: Esprima 可以将 JavaScript 代码解析为标准的 ECMAScript 5.1 语法树。Esprima 也支持扩展，可以通过插件机制实现对 ECMAScript 6+ 的解析。
3. Babel Parser: Babel Parser（以前称为 Babylon）是 Babel 项目中使用的 JavaScript 解析器。它支持解析最新的 ECMAScript 规范，并且与 Babel 的转换工具链紧密集成。
4. Shift Parser: Shift Parser 是一个可扩展的 ECMAScript 解析器框架，它提供了一组 API 和工具，用于构建自定义的 JavaScript 解析器。Shift Parser 的目标是提供一个通用的解析器框架，适用于各种 ECMAScript 版本和语言扩展。



### AST 节点

- [estree](https://github.com/estree/estree)规范
- [spec.md](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)
- [astexplorer](https://astexplorer.net/)
- AST 节点（node）
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



```js
var ast = 'test'
```

上面的js代码使用acorn解析器生成的ast内容如下：

```js
{
  "type": "Program",
  "start": 0,
  "end": 16,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 16,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 16,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 7,
            "name": "ast"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 16,
            "value": "test",
            "raw": "'test'"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```





### 遍历语法树

AST**是深度优先遍历**

选用esprima解析器及其配套工具。

它们提供了对 Esprima 解析器的补充和扩展功能。以下是一些与 Esprima 解析器相关的常见工具库：

1. Escodegen: Escodegen 是一个 JavaScript 代码生成器，它使用 esprima 解析器生成的抽象语法树（AST），将其转换回等效的 JavaScript 代码。Escodegen 允许你根据需要自定义生成的代码的格式和风格。
2. Esquery: Esquery 是一个用于在 JavaScript AST 中执行 CSS 风格查询的库。它允许你使用选择器语法从 JavaScript AST 中选择和提取特定的节点。Esquery 可以与 Esprima 解析器一起使用，以便在 AST 上执行高级的查询操作。
3. Esprima-walk: Esprima-walk 是一个用于遍历和访问 JavaScript AST 的工具库。它提供了一组简单的 API，使你能够轻松地访问 AST 中的节点，并执行自定义的操作或分析。
4. Estraverse: Estraverse 是一个 JavaScript AST 遍历器，它提供了对 AST 的深度优先遍历功能。它允许你在遍历 AST 时执行自定义的回调函数，并对节点进行修改或分析。
5. Eslevels: Eslevels 是一个用于静态分析和提取 JavaScript 代码中声明的变量和函数的库。它使用 Esprima 解析器解析 JavaScript 代码，并生成一组声明节点，使你能够分析代码中的变量作用域和依赖关系。

```shell
npm install esprima estraverse escodegen -S
```

esprima：把 JS 源代码转成 AST 语法树

estraverse：遍历语法树，修改树上的节点

escodegen：把 AST 语法树重新转换成代码

```js
let esprima = require('esprima'); //把JS源代码转成AST语法树
let estraverse = require('estraverse'); ///遍历语法树,通过插件修改树上的节点
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

const result = escodegen.generate(ast);
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



```json
{
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifier",
        "name": "ast",
      },
      "params": [],
      "body": {
        "type": "BlockStatement",
        "body": [],
      },
      "generator": false,
      "expression": false,
      "async": false
    }
  ],
  "sourceType": "module",
}
```



Babel Parser 和 Esprima 是两个独立的 JavaScript 解析器，它们具有相似的目标，即解析 JavaScript 代码并生成相应的抽象语法树（AST）。尽管它们有相似的功能，但它们是由不同的团队开发和维护的，并且有一些区别。

下面是 Babel Parser 和 Esprima 之间的一些关系和区别：

1. 代码基础：Babel Parser 是 Babel 项目中的一部分，它是作为 Babel 的默认解析器而开发的。它的代码基础是基于 Babylon 项目，该项目在后来改名为 Babel Parser。而 Esprima 是一个独立的项目，由独立的团队进行开发和维护。
2. ECMAScript 版本支持：Babel Parser 的设计目标是支持最新的 ECMAScript 语法和功能，包括 ECMAScript 2015+ 的特性，以及尚未被主流浏览器完全支持的提案。Esprima 则主要支持 ECMAScript 5.1 的语法，虽然它也可以通过插件进行扩展以支持 ECMAScript 6+ 的特性。
3. 插件生态系统：Babel Parser 配合 Babel 的插件生态系统使用，这使得开发人员可以添加和使用各种转换和插件来修改或转换 JavaScript 代码。Esprima 本身并没有提供类似的插件系统，但可以与其他工具库结合使用，实现类似的功能。



## Babel

工作过程分为三个部分：

- Parse(解析) 将源代码转换成抽象语法树，树上有很多的[estree 节点](https://github.com/estree/estree)

- Transform(转换) 对抽象语法树进行转换

- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

<img src="http://img.zhufengpeixun.com/ast-compiler-flow.jpg" alt="ast-compiler-flow.jpg" style="zoom:200%;" />

### babel 插件

- [@babel/parser](https://github.com/babel/babel/tree/master/packages/@babel/parser) 可以把源码转换成 AST
- [@babel/traverse](https://www.npmjs.com/package/babel-traverse)用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- [@babel/generate](https://github.com/babel/babel/tree/master/packages/@babel/generate) 可以把 AST 生成源码，同时生成 sourcemap

- [@babel/types](https://github.com/babel/babel/tree/master/packages/babel-types) 用于 AST 节点的工具库, 它包含了构造节点、验证节点类型以及变换 AST 节点的方法，帮助修改语法树
- [@babel/template](https://www.npmjs.com/package/@babel/template)可以简化 AST 的创建逻辑，快速创建结点
- [@babel/code-frame](https://www.npmjs.com/package/@babel/code-frame)可以打印代码位置
- [@babel/core](https://www.npmjs.com/package/@babel/core) Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse，并实现了插件功能，在 Babel 转换过程中，`@babel/parser` 被 `@babel/core` 使用，用于解析输入的 JavaScript 代码。`@babel/parser` 将代码解析为 AST，并将 AST 传递给 `@babel/core`，后者在 AST 上应用各种 Babel 插件和转换规则，执行代码转换操作。因此，`@babel/parser` 是 `@babel/core` 的一个重要依赖模块，用于提供代码解析的功能。
- [babylon](https://www.npmjs.com/package/babylon) Babel 的解析器，以前的babel parser,是基于 acorn 扩展而来，扩展了很多语法,可以支持 es2020、jsx、typescript 等语法
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
- **Visitor 上挂载以节点的 `type` 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法**
- **说白了 Visitor 就是一个对象，该对象可以提供许多不同的方法（这些方法的名字就是 AST 中不同节点的名字），供给不同的访问者调用不同的方法**
- 插件就是一个访问器对象，每个插件只关注一个 AST 中不同的节点类型，并对这些关注的节点进行操作



javascript中的另一种访问器模式代码例子：

访问器模式（Accessor Pattern）通过定义访问器方法来**封装对对象属性的访问和修改操作**。访问器模式提供了一种间接访问对象属性的方式，以便在访问和修改属性时可以执行额外的逻辑或进行验证。 

在访问器模式中，有两种类型的访问器方法：

1. Getter（获取器）：Getter方法用于获取对象属性的值。它通过定义一个函数来访问对象属性，并在访问时执行特定的逻辑。Getter方法通常以`get`关键字为前缀，后面跟着属性名，例如`get propertyName()`。
2. Setter（设置器）：Setter方法用于设置对象属性的值。它通过定义一个函数来修改对象属性，并在修改时执行特定的逻辑。Setter方法通常以`set`关键字为前缀，后面跟着属性名，例如`set propertyName(value)`。

```js
const person = {
  firstName: 'John',
  lastName: 'Doe',
  
  get fullName() {
    return this.firstName + ' ' + this.lastName;
  },
  
  set fullName(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
};

console.log(person.fullName); // 输出: "John Doe"

person.fullName = 'Jane Smith';
console.log(person.firstName); // 输出: "Jane"
console.log(person.lastName); // 输出: "Smith"
```



### path

语法树上的每个节点会对应一个路径（path 和 node 一一对应）。[path](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/path/index.ts)

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
- traverse(visitor, state) **遍历当前节点的子节点,第 1 个参数是节点，第 2 个参数是用来传递数据的状态**
- skip() 跳过当前节点子节点的遍历
- stop() 结束所有的遍历

每个路径对应一个节点。



### scope

[scope](https://github.com/babel/babel/blob/main/packages/babel-traverse/src/scope/index.ts)对象上的属性或者方法：

- scope.bindings 当前作用域内声明的所有变量
- scope.path 生成作用域的节点对应的路径
- scope.references 所有的变量引用的路径
- getAllBindings() 获取从当前作用域一直到根作用域的集合
- getBinding(name) 从当前作用域到根作用域查找变量
- getOwnBinding(name) 在当前作用域查找变量
- parentHasBinding(name, noGlobals) 从当前父作用域到根作用域查找变量
- removeBinding(name) 删除变量
- hasBinding(name, noGlobals) 判断是否包含变量
- moveBindingTo(name, scope) 把当前作用域的变量移动到其它作用域中
- generateUid(name) 生成作用域中的唯一变量名,如果变量名被占用就在前面加下划线



### 转换箭头函数插件

```js
const core = require('@babel/core');
const types = require('@babel/types');

const arrowFunctionPlugin = require('@babel/plugin-transform-arrow-functions').default;


let arrowFunctionPlugin2 = {
  // visitor属性是固定的，babel内部就是写死取的这个属性
  visitor: {
    // 这个的方法名字就是抽象语法树中各种节点对应的类型type
    ArrowFunctionExpression(path) {
      const { node } = path;
      node.type = 'FunctionExpression';
     
      const body = node.body;
      //判断body节点是不是BlockStatement  (a,b)=>a + b; 
      if (!types.isBlockStatement(body)) {
        //快速方便的构建节点
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
       // 处理this需要提升的问题
       hoistFunctionEnvironment(path);
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
const sum = function (a,b){
  console.log(_this);
  return a+b;
}
 */
```



### 日志插件

`state.file.opts.filename` 表示当前正在处理的文件的路径。

```js
const core = require('@babel/core');
const types = require('@babel/types');
const pathLib = require('path');
//state代表状态，用在在插件处理的过程传递一些值或者变量
let consolePlugin = {
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
    FunctionExpression(path, state) {
      console.log(state.age); // 100
    }
  }
};
//实现一个日志插件
const sourceCode = `
  console.log('hello');
`;
const result = core.transform(sourceCode, {
  filename: 'main.js',
  plugins: [consolePlugin]
});
console.log(result.code);
```



要实现在每个 console.log 语句中添加打印文件、行数和列数的信息，可以编写一个自定义的 Babel 插件。以下是一个简单的示例插件，可实现该功能：

在项目根目录下创建一个名为 `.babelrc` 的文件，配置 Babel 的转换规则和插件：

```rc
{
  "presets": ["@babel/preset-env"],
  "plugins": ["console-log-info"]  // 需要发布这个包
}
```

或者在webpack配置文件中：

```js
const consolePlugin = require('./plugins/consolePlugin.js');

module.exports = {

  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [consolePlugin]
          }
        }
      },
    ]
  },
};

```



```js
// 这个插件可以直接在webpack中的babel-loader中配置即可使用
const pathLib = require('path');

module.exports = function ({ types }) {
  return {
    visitor: {
      CallExpression(path, state) {
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
      }
    }
  };
};

```

打印表示：

<img src=".\images\image-20230824171919123.png" alt="image-20230824171919123" style="zoom:200%;" />



```js
const pathLib = require('path');

module.exports = function ({ types }) {
  return {
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        if (types.isMemberExpression(node.callee)) {
          if (node.callee.object.name === 'console') {
            if (['log', 'info', 'warn', 'error', 'debug'].includes(node.callee.property.name)) {
              const fileInfo = state.file.opts.filename.split('/');
              const fileName = fileInfo[fileInfo.length - 1];
              const { line, column } = node.loc.start;

              const logStatement = types.stringLiteral(`[${fileName}:${line}:${column}]`);
              const args = path.node.arguments;
              args.unshift(logStatement);

              path.replaceWith(types.callExpression(types.identifier('console.log'), args));
            }
          }
        }
      }
    }
  };
};

```

打印表示：

<img src=".\images\image-20230824172327152.png" alt="image-20230824172327152" style="zoom:200%;" />



### 数据埋点

当调用方法时，向服务器发送一个请求，通知服务器。

```js
const core = require('@babel/core');
const autoTrackerPlugin = require('./auto-tracker-plugin');

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
`;
const result = core.transform(sourceCode, {
  plugins: [
    autoTrackerPlugin({
      name: 'logger',
      whiteList: ['sum'] // 针对叫这个函数的名的函数添加数据埋点
    })
  ]
});
console.log(result.code);
```

数据埋点中的 babel 插件在这里导出的是一个函数，该函数返回一个对象。

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
        enter(path, state) {
          let loggerId;
          path.traverse({
            ImportDeclaration(path) {
              //此方法会进入多次
              const importedModuleName = path.get('source').node.value;
              if (importedModuleName === options.name) {
                const specifierPath = path.get('specifiers.0');
                if (
                  specifierPath.isImportDefaultSpecifier() || //默认导入 import logger from 'logger'
                  specifierPath.isImportSpecifier() || //普通导入 import {logger} from 'logger'
                  specifierPath.ImportNamespaceSpecifier()
                ) {
                  //命名空间导入  import * as logger from
                  loggerId = specifierPath.node.local.name;
                }
                path.stop(); //不再遍历了，跳过后续的所有的查找和遍历
              }
            }
          });
          //如果loggerId在遍历完了以后还是undefined。说明源码中没有主动引入logger
          if (!loggerId) {
            //  import xx from 'logger' , 构建一个抽象语法树节点
            loggerId = importModule.addDefault(path, options.name, {
              nameHint: path.scope.generateUid(options.name)
            });
          }
          //类似ejs 模板引擎 返回的是一个语法树的节点
          state.loggerNode = template.statement(`LOGGER();`)({
            LOGGER: loggerId
          });
        }
      },
      'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod'(path, state) {
        const { node } = path;
        // 白名单
        if (node.id && options.whiteLists.includes(node.id.name)) {
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
  };
};
module.exports = autoTrackerPlugin;
```

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
`;
```



### 模拟 eslint

```js
function eslintPlugin({ fix }) {
  return {
    // 遍历语法树之前执行该pre函数
    pre(file) {
      file.set('errors', []);
    },
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        const errors = state.file.get('errors');
        if (node.callee.object && node.callee.object.name === 'console') {
          Error.stackTraceLimit = 0; // 设置调用栈的长度
          errors.push(path.buildCodeFrameError(`代码中不能出现console.log语句`), Error); // 构建代码错误
          if (fix) {
            path.parentPath.remove();
          }
        }
      }
    },
    post(file) {
      console.log(file.get('errors'));
    }
  };
}
module.exports = eslintPlugin;
```



### 代码压缩

uglifyPlugin.js

其中的 Scopable 是类型别名，其实就是一系列 ast 节点名的组合，类似于 TS 的联合类型。

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
          binding.path.scope.rename(key, newName);
        });
      }
    }
  };
}
module.exports = uglifyPlugin;
```



### 按需加载

以 lodash 为例子，babel-plugin-import，且这个库只支持 antd，antd-mobile，lodash，materia-ui。

webapck.config.js:

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                'babel-plugin-import',
                {
                  libraryName: 'lodash', // 查看lodash的核心包，可以发现，lodash中每个功能函数都直接放在loadsh文件夹的根目录中，而babel-plugin-import插件默认是取目标库下面的lib文件夹中找对应的文件，所以还需要设置库的目标文件所在的目录。
                  libraryDirectory: '' // 这个值默认是lib
                }
              ]
            ]
          }
        }
      }
    ]
  }
};
```

按需加载的本质：

```js
import { flatten, concat } from 'lodash';
// 转为下面的代码形式
import flatten from 'lodash/flatten';
import concat from 'lodash/flatten';
```

![image-20230430174616023](images\image-20230430174616023.png)

转为：

![image-20230430174629719](images\image-20230430174629719.png)

编译顺序为首先`plugins`从左往右,然后`presets`从右往左。

```js
//babel核心模块
const core = require('@babel/core');
//用来生成或者判断节点的AST语法树的节点
let types = require('@babel/types');

const visitor = {
  ImportDeclaration(path, state) {
    const { node } = path; //获取节点
    const { specifiers } = node; //获取批量导入声明数组
    const { libraryName, libraryDirectory = 'lib' } = state.opts; //获取选项中的支持的库的名称
    //如果说此节点导入的包名和配置的按需加载包名是一样的，并且不是默认导入的话
    if (
      node.source.value === libraryName &&
      //并且导入不是默认导入才会进来
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      //遍历批量导入声明数组
      const declarations = specifiers.map((specifier) => {
        //返回一个importDeclaration节点
        return types.importDeclaration(
          //导入声明importDefaultSpecifier flatten
          [types.importDefaultSpecifier(specifier.local)],
          //导入模块source lodash/flatten
          types.stringLiteral(
            libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
          )
        );
      });
      path.replaceWithMultiple(declarations); //替换当前节点
    }
  }
};

module.exports = function () {
  return {
    visitor
  };
};
```

注意，在 webpack 配置文件中配置该插件后，传给插件的参数的方式是以下这种：

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

在 webpack 中使用自己编写的 bable 插件：

```js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                path.resolve(__dirname, 'plugins/babel-plugin-import.js'),
                {
                  libraryName: 'lodash',
                  libraryDirectory: ''
                }
              ],
              [
                path.resolve(__dirname, 'plugins/babel-plugin-import.js'),
                {
                  libraryName: 'antd'
                }
              ]
            ]
          }
        }
      }
    ]
  }
};
```

上面的代码中@babel/types 两个作用：

1. 判断某个节点是不是某个类型 
2. 快速通过工厂方法创建节点实例

[Babel 插件手册](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)

**babel 参考资料：**

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

扩展：使用 babel 中的 types 库和 template 库创建 ast 节点的差别。

当有一个非常复杂或者源码非常多的一个代码段需要创建，那么 types 库只能一个个一层层的创建然后再一个个一层层的组合。 而 template 库可以基于源代码字符串快速创建其对应的抽象语法树。

```js
const template = require('@babel/template');
let astNode = template.statement('xxx')({
  xxx: `源码部分`
});
```



## webpack 工作流

### 调试 webpack

**方式一：**

package.json 中

```json
{
  "script": {
    "build": "webpack"
  }
}
```

当执行这个脚本命令时，找到项目根目录下 node_modules 目录下的.bin 目录下的 webpack.cmd，该文件中执行的是 node_modules 目录下的 webpack/bin/webpack.js 文件，该文件中会去调用 webpack-cli 目录中的 bin 目录中的 cli.js 文件。所以可以直接调试 cli 文件：

```js
node --inspect-brk ./node_modules/webpack/bin/webpack.js


node --inspect-brk ./node_modules/webpack-cli/bin/cli.js
```

> 然后打开 Chrome 浏览器控制台调试

<img src="images\image-20230213214843358.png" alt="image-20230213214843358" style="zoom:50%;" />



**方式二：**

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
      "skipFiles": ["<node_internals>/**"], // 跳过node核心模块代码
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/node_modules/webpack-cli/bin/cli.js"
    }
  ]
}
```

> 在 webpack-cli 包中的 cli.js 文件中添加断点后便可以开始调试。



**方式三：**

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
        assets: true, // 其实它是一个代码块（chunk）到文件的对应关系
        chunks: true, // 从入口模块出发，找到此入口模块依赖的模块，或者依赖的模块依赖的模块，合在一起组成一个代码块，懒加载模块及其依赖也是一个chunk
        modules: true // 打包的模块，项目源码仓库中的每个文件都是一个模块（js文件，jsx文件，图片，html，css等）
      })
    );
  }
});
```

打包后生产文件需要注意的地方

index.js 源文件：

```js
const title = require('./title.js');

console.log('entry1', title);
```

title.js 源文件：

```js
const msg = require('./msg.js');

console.log(msg, 'msg');

module.exports = 'title';
```

msg.js 源文件：

```js
module.exports = 'msg';
```

index.js 是项目的入口文件。

打包后生成的结果：

```js
var modules = {
    './src/msg.js': (module) => {
        module.exports = 'msg';
    },
    './src/title.js': (module) => {
        let msg = require('./src/msg.js'); // 源码中是./msg.js

        module.exports = 'title' + msg;
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
var exports = {};

let title = require('./src/title.js'); // 源码中是./title.js
console.log('entry1', title);
```

从中可以看到，在源文件的源码中，引入其他模块文件时，使用的都是从该模块文件出发到目标文件的相对路径，**但是**打包后生成的文件中，所有源码中的模块导入语句中的路径都变成了以项目根目录为统一出发点的相对路径。



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
          path.resolve(__dirname,'loaders/loader1.js'),
          path.resolve(__dirname,'loaders/loader2.js')
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
- webpack 通过 tapable 将 实现 与 流程 解耦，所有具体实现通过插件的形式存在

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

new Plugin().apply();  // 插件注册自己的逻辑
hook.call(); // 编译打包过程中调用自己已经注册的逻辑
```



### plugin

在 webpack 中，有非常多类似 SyncHook 这种构造函数的**实例属性值**，写插件就是在这些实例属性值的订阅数组中添加一系列的方法。然后在 webpack 开始打包编译之后在各个阶段调用这些实例属性值中订阅好的方法，并执行逻辑。

webpack 插件的格式是固定的，插件是一个类，需要实例化，实例化后的值有一个原型方法 apply。

**插件之间的书写顺序并不会影响各个插件的执行顺序，但是如果两个插件监听的是一个 hook，那么书写顺序就和执行顺序有关了。**

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
  plugins: [
    //插件的挂载或者说监听是在编译启动前全部挂载的
    new Run1Plugin(),
    new Run2Plugin(),
    new DonePlugin()
  ]
};
```

babel 和 webpack 的关系是什么？ 执行顺序是？ webpack 在编译的时候，如果遇到 js 文件，会调用 babel-loader 进行文件内容的转换，在转换的时候会使用 babel 插件来转换。





当多个 loader 匹配到同一个文件时，Webpack 将按照配置中 loader 规则的顺序依次应用这些 loader。

在下配置片段中，有两个 loader 都匹配到了 `.txt` 文件，它们的顺序如下：

```js
module: {
  rules: [
    {
      test: /\.txt$/,
      use: [loader1]   // 在没有主动配置enforce字段的情况下
    },
    {
      test: /\.txt$/,
      use: [loader2]
    }
  ]
}
```

根据这个配置，Webpack 将首先应用 `loader1`，然后再应用 `loader2`。

换句话说，先使用 `loader1` 处理 `.txt` 文件，然后将处理结果传递给 `loader2`。这样可以形成一个 loader 链，每个 loader 都可以对文件进行一些特定的处理。

请注意，loader 的处理顺序可能会对最终的处理结果产生影响，因此在配置 loader 的顺序时，需要根据实际需求和 loader 的功能来确定顺序。

如果希望 `loader2` 先处理 `.txt` 文件，然后再由 `loader1` 处理处理结果，只需调整配置中两个 loader 的顺序即可：

```js
module: {
    rules: [
        {
            test: /\.txt$/,
            use: [loader2]  // 在没有主动配置enforce字段的情况下
        },
        {
            test: /\.txt$/,
            use: [loader1]
        }
    ]
}
```

这样，Webpack 将首先应用 `loader2`，然后再应用 `loader1`。



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
    type: 'filesystem'
  },
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js' // name就是此模块属于哪个模块
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
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
};
```

1. **初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象**

2. **用上一步得到的配置对象初始化 `Compiler` 对象**

3. **加载(挂载)所有配置的插件，插件是在编译开始之前全部挂载（订阅）好的，等到后面编译过程中触发插件的中各种订阅函数**

4. **执行 Compiler 对象的 run 方法开始执行编译，内部会创建新建一个Compilation实例对象，然后调用该实例对象的build方法开始打包构建**

5. **build方法中，根据配置中的`entry`找出入口文件**

6. **从入口文件出发,调用所有配置的`Loader`对模块进行编译，得到各个loader处理后的文件代码，然后通过bable去生成并解析该文件（AST）中的代码，目的是收集到该文件依赖的其他依赖文件模块，共给下一步使用**

7. **在结束本模块的ast语法树分析后，将收集到的本模块依赖的其他模块递归本步骤直到所有入口依赖的文件都经过了本步骤的处理**

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
    const Compiler = require('./Compiler');
    
    function webpack(options) {
      // 1.初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
      //argv[0]是Node程序的绝对路径 argv[1] 正在运行的脚本
      const argv = process.argv.slice(2); // 真正需要的shell参数
      const shellOptions = argv.reduce((shellOptions, options) => {
        // options = '--mode=development'
        const [key, value] = options.split('=');
        shellOptions[key.slice(2)] = value;
        return shellOptions;
      }, {});
    
      const finalOptions = { ...options, ...shellOptions }; // 这里就体现的shell中设置参数的权重更高的原因
    
      //2.用上一步得到的参数初始化 `Compiler` 对象，单例的，compiler实例对象管理着整个打包过程
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

    ```js
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
    ```

    Compilation.js:

    ```js
    const path = require('path');
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
        this.modules = []; // 这里放置本次编译涉及的所有的模块
        this.chunks = []; // 本次编译所组装出的代码块
        this.assets = {}; // key是文件名,值是文件内容
        this.files = []; // 代表本次打包出来的文件
        this.fileDependencies = new Set(); // 本次编译依赖的文件或者说模块
        // 这个对象上也有很多的hook
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
          let entryFilePath = path.posix.join(baseDir, entry[entryName]); // 将entry中的相对地址转为从磁盘根路径出发的绝对地址
    
          this.fileDepxendencies.add(entryFilePath);
          // 6.从入口文件出发,调用所有配置的Loader对模块进行编译
          let entryModule = this.buildModule(entryName, entryFilePath);
          // this.modules.push(entryModule);
          // 8.根据入口和模块之间的依赖关系，  Chunk
          let chunk = {
            name: entryName,
            entryModule,
            modules: this.modules.filter((module) => module.names.includes(entryName))
          };
          this.chunks.push(chunk);
        }
    
        //9.再把每个 Chunk 转换成一个单独的文件加入到输出列表
        this.chunks.forEach((chunk) => {
          const filename = this.options.output.filename.replace('[name]', chunk.name);
          this.files.push(filename);
          this.assets[filename] = getSource(chunk);
        });
    
        callback(
          null,
          {
            modules: this.modules,
            chunks: this.chunks,
            assets: this.assets,
            files: this.files
          },
          this.fileDependencies
        );
      }
      /**
       * 编译模块
       * @param {*} name 模块所属的代码块(chunk)的名称，也就是entry配置项的key entry1 entry2
       * @param {*} modulePath 模块的路径，绝对路径
       */
      buildModule(name, modulePath) {
        //1.读取文件的内容
        let sourceCode = fs.readFileSync(modulePath, 'utf8'); // 同步读取文件内容
        let { rules = [] } = this.options.module;
        //根据规则找到所有的匹配的loader
        let loaders = [];
        rules.forEach((rule) => {
          // 从这段代码逻辑可以看出，针对某个类型的文件会遍历webpack配置文件中的所有rule，命中其中符合test规则的文件，然后用loader进行处理，如果有多个规则都能命中同一个文件，那么都会对前面rule处理过的文件源码进行进一步处理。
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
        let moduleId = './' + path.posix.relative(baseDir, modulePath); // relative方法返回一个相对的路径
        //创建一个模块，ID就是相对于根目录的相对路径，dependencies就是此模块依赖的模块
        //name是模块所属的代码块的名称, 如果一个模块属于多个代码块，那么name就是一个数组（比如一个模块被多个入口中的其他模块都引用了。）
        let module = { id: moduleId, dependencies: [], names: [name] };
        let ast = parser.parse(sourceCode, { sourceType: 'module' });
        //Visitor是babel插件中的概念，此处没有
        traverse(ast, {
          CallExpression: ({ node }) => {
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
              } else {
                //如果不是以.开头的话，就是第三方模块
                depModulePath = require.resolve(depModuleName);
              }
              this.fileDependencies.add(depModulePath);
              //获取依赖的模块的ID,修改语法树，把依赖的模块名换成模块ID
              let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
              node.arguments[0] = types.stringLiteral(depModuleId);
              //把依赖的模块ID和依赖的模块路径放置到当前模块的依赖数组中
              module.dependencies.push({
                depModuleId,
                depModulePath
              });
            }
          }
        });
        //使用改造后的ast语法要地重新生成新的源代码
        let { code } = generator(ast);
        module._source = code;
    
        // 递归当前模块依赖的其他模块
        module.dependencies.forEach(({ depModuleId, depModulePath }) => {
          //判断此依赖的模块是否已经打包过了或者说编译过了
          let existModule = this.modules.find((module) => module.id === depModuleId);
          if (existModule) {
            existModule.names.push(name);
          } else {
            let depModule = this.buildModule(name, depModulePath); // 这里的name使用的是第一次传入的那个值，如entry1和entry2
            this.modules.push(depModule);
          }
        });
        return module;
      }
    }
    
    function tryExtensions(modulePath, extensions) {
      if (fs.existsSync(modulePath)) {
        return modulePath;
      }
      for (let i = 0; i < extensions.length; i++) {
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
          ${chunk.modules
            .map(
              (module) => `
          "${module.id}": (module, exports, require) => {
            ${module._source}
          }
        `
            )
            .join(',')}
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
    ```

compiler 和 compilation 概念辨析：

`compiler`实例对象上挂载着 webpack 环境所有的配置信息，包括 loader，plugins，entry 等等，`compiler`实例对象是在启动 webpack 的时候实例化好的，它是全局唯一的，可以理解为 webpack 实例

`Compiler` 模块是 webpack 的主要引擎，它通过 [CLI](https://www.webpackjs.com/api/cli) 或者 [Node API](https://www.webpackjs.com/api/node) 传递的所有选项创建出一个 Compiler实例。 它扩展（extends）自 `Tapable` 类，**用来注册和调用插件**。 大多数面向用户的插件会首先在 `Compiler` 上注册。

compilation 对象代表了一次资源版本的构建。它包含了当前的模块资源(modules)、编译生成资源(asset)、变化的文件(files)、以及被跟踪依赖的状态信息(fileDependencies)等。当 webpack 以开发模式运行时，每当检测到一个依赖文件发生变化变化，一次新的 compilation 将被创建。compilation 对象也提供了很多事件回调供插件做扩展。通过 compilation 也可以读取到 compiler 对象。

`Compilation` 模块会被 `Compiler` 用来创建新的 compilation 对象（或新的 build 对象）。 `compilation` 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。

`Compilation` 类扩展(extend)自 `Tapable`，并提供了以下生命周期钩子。 可以按照 compiler 钩子的相同方式来调用 tap。

扩展：

> tapable 是 webpack 的一个核心工具，它暴露了 tap、tapAsync、tapPromise 方法，可以使用这些方法来触发 compiler 钩子，使得插件可以监听 webpack 在运行过程中广播的事件，然后通过 compiler 对象去操作 webpack。也可以使用这些方法注入自定义的构建步骤，这些步骤将在整个编译过程中的不同时机触发。
>
> deps 的变化会导致整个依赖链路上的内容都重新编译还是只编译变化部分？
>
> 如果有文件变化的话，在 webpack5 以前会全部会重新编译，比较慢，所以在 webpack5 以前可以使用：cache hardsource dllplugin 等方法提升打包构建速度，但是 webpack5 以后，内置这些缓存机制。



## loader

- loader 是一个模块文件导出的函数。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain
- compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）

### loader 执行时机

![webpackflowloader](http://img.zhufengpeixun.cn/webpackflowloader.jpg)

### loader 分类

loader 有四种执行时机分类，它们的组合是有顺序的。

- post(后置)
- inline(内联)，只针对指定的设置了内联loader的模块文件起作用
- normal(正常)
- pre(前置)

一个 loader 在被具体配置到 webpack 之前，是没办法区分它是在具体的哪个时机被调用的。

因为 loader 配置可以是由多个配置文件合并而来，为了保证执行的时候按我们希望的顺序执行，所以可以给 loader 区分调用时机。

如何表示某个 loader 被放置在这四种执行时机中的哪一种？ 

1. 通过每个 rule 规则中，设置 enforce 配置项的值来解决，`enforce:'pre'|'post'|'normal',`不写默认 normal
2. 或者通过 loader 的内联写法实现，`inline-loader1!inline-loader2!${entryFile}`

### loader 的工作

<img src="images\image-20230219130529675.png" alt="image-20230219130529675" style="zoom:200%;" />

loader 的调用是依赖**loader-runner**这个库进行的。

```js
const { runLoaders } = require('loader-runner');
const path = require('path');
const fs = require('fs'); // webpack-dev-server启开发服务器的时候 memory-fs
const entryFile = path.resolve(__dirname, 'src/index.js');
//如何配置行内
let request = `inline-loader1!inline-loader2!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ['normal-loader1', 'normal-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post-loader1', 'post-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'pre',
    use: ['pre-loader1', 'pre-loader2']
  }
];
let parts = request.split('!'); // [inline-loader1,inline-loader2, xxx/xxx/xx/src/index.js]
let resource = parts.pop(); // 弹出最后一个元素 entryFile=src/index.js

let inlineLoaders = parts; // [inline-loader1,inline-loader2]
let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];

for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}

let loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];

let resolveLoader = (loader) => path.resolve(__dirname, 'loaders-chain', loader); // loaders-chain是自己创建的文件夹，里面是自己写的loader

//把loader数组从名称变成绝对路径
loaders = loaders.map(resolveLoader);

runLoaders(
  {
    resource, //你要加载的资源
    loaders,
    context: { name: 'zhufeng', age: 100 }, //保存一些状态和值
    readResource: fs.readFile.bind(this)
  },
  (err, result) => {
    console.log(err); //运行错误
    console.log(result); //运行的结果
    console.log(result.resourceBuffer ? result.resourceBuffer.toString('utf8') : null); //读到的原始的文件
  }
);
```



### 内联 loader 的特殊配置

- [loaders/#configuration](https://webpack.js.org/concepts/loaders/#configuration)

| 符号 | 变量 | 含义 |  |
| :-- | :-- | :-- | --- |
| `-!` | noPreAutoLoaders | 不要前置和普通 loader | Prefixing with -! will disable all configured preLoaders and loaders but not postLoaders |
| `!` | noAutoLoaders | 不要普通 loader | Prefixing with ! will disable all configured normal loaders |
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

- 比如 a!b!c!module, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a，如果其中任何一个 pitching loader 返回了非空值就相当于在它以及它右边的 loader 已经执行完毕

- 比如，如果 b 的 pitch 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b，并且源文件也没有被读取过

- loader 根据返回值可以分为两种，一种是返回 js 代码（一个 module 的代码，含有类似 module.export 语句）的 loader，还有不能作为最左边 loader 的其他 loader

- 有时候想把两个第一种（都返回一个符合commonjs规范的JS代码的loader） loader chain 起来，比如 style-loader!css-loader! 问题是 css-loader 的返回值是一串 js 代码，如果按正常方式写 style-loader 的参数就是一串代码串，为了解决这种问题，就需要在 style-loader 里执行 require(css-loader!resources)

  

**使用pitch的情况**：

实现loader的`pitch`方法可以在特定情况下提供额外的灵活性和控制，这对于优化构建过程、条件性地处理模块、或在特定的预处理步骤中非常有用。以下是一些需要实现`pitch`方法的场景：

1. **条件性跳过后续的loader**：如果你的loader可以根据某些条件（例如，资源的路径、查询参数、或者项目的配置）决定不需要执行后续的loader，你可以在`pitch`方法中根据这些条件返回一个结果，从而跳过后续的loader处理。
2. **避免不必要的处理**：当确定某些资源不需要经过复杂的转换或处理时，通过`pitch`方法直接返回结果可以减少不必要的计算和处理时间，优化构建性能。
3. **资源替换或代理**：在某些场景下，可能需要基于开发环境和生产环境来替换资源或者提供资源的代理版本。通过`pitch`方法，可以根据环境或配置条件动态决定使用哪个版本的资源。
4. **提前处理共享数据**：如果你的loader需要在实际处理资源之前预处理一些数据，或者需要在loader链中的不同loader之间共享数据，可以使用`pitch`方法的`data`参数来实现。这样，你可以在`pitch`阶段计算或准备数据，并在实际的loader处理函数中使用这些数据。
5. **插入额外的资源或代码片段**：在处理某个资源之前，如果需要向模块注入额外的代码片段或依赖，`pitch`方法提供了一个机会来实现这一点。通过在`pitch`阶段动态修改请求或添加额外的资源，可以灵活地控制资源的处理过程。
6. **性能优化**：对于一些重的处理过程，如果可以通过简单的检查来预先判断结果，那么在`pitch`方法中提前返回这个结果可以避免后续不必要的处理，从而达到性能优化的目的。

实现`pitch`方法不总是必要的，只有当你需要上述提到的额外控制或优化时，才考虑添加。正确使用`pitch`方法可以让你的loader更加灵活和高效，但也需要谨慎处理，以避免引入不必要的复杂性或潜在的问题。



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

![image-20230219154119989](images\image-20230219154119989.png)

![image-20230219154632771](images\image-20230219154632771.png)

一旦有某个 loader 有 pitch，并且被执行后返回不为假值，则并不会进行源文件的读取操作。

> 在Webpack中，Loader的`pitch`函数接收四个参数。这些参数分别是：
>
> 1. `remainingRequest`：表示当前模块的剩余请求路径。它是一个字符串，包含了当前模块的相对路径，以及在处理当前模块之前还需要加载的其他模块的请求路径。
> 2. `previousRequest`：表示当前模块的前一个请求路径。它是一个字符串，包含了前一个处理该模块的Loader的请求路径。
> 3. `data`：一个可选的参数，是一个对象，可以用于在Loader之间共享数据。
> 4. `context`：表示Loader的上下文对象。它是一个对象，包含了与当前模块相关的一些信息，如当前模块的绝对路径、请求路径等。
>
> 这些参数可以帮助Loader在处理模块时进行更精细的控制和决策。通过分析和操作这些参数，Loader可以根据需要修改模块请求的顺序、路径等，以满足特定的需求。



每个loader函数在webpack内部被调用的时候，都会为该loader函数绑定一个this，又被称为loader上下文：https://www.webpackjs.com/api/loaders/#the-loader-context



**扩展知识**

runSyncOrAsync 既可以是同步也可以是异步。

```js
function runSyncOrAsync(fn, callback) {
  let sync = true;
  global.async = () => {
    sync = false;
    return callback;
  };
  fn();
  if (sync) {
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
  const callback = global.async();
  console.log('normal');
  setTimeout(callback, 3000);
}

function callback() {
  console.log('callback');
}

runSyncOrAsync(normal, callback);
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

function loader(source, inputAst, inputSourceMap) {

  // 在loader里，this是一个称为loaderContext的对象，上面有很多方法可以使用,其中就包括getOptions
  // 需要把loader的执行从同步变成异步
  const callback = this.async();
  let options = this.getOptions();

  // 检查是否存在AST，如果存在，则直接使用，否则将source作为转译输入
  if (!inputAst) {
    // 没有提供AST，回退到使用source代码
    let babelOptions = {
      ...options,
      ast: true,
      sourceMaps: true,
      inputSourceMap
    };

    babel.transformAsync(source, babelOptions).then(({ code, map, ast }) => {
      // 在loader执行完成后才让调用callback表示本loader已经完成了
      callback(null, code, map, ast);
    }).catch(err => callback(err));
  } else {
    // 直接使用提供的AST进行转译
    let babelOptions = {
      ...options,
      ast: true,
      sourceMaps: true,
      inputSourceMap
    };

    // 使用transformFromAstAsync直接转换AST
    babel.transformFromAstAsync(inputAst, source, babelOptions).then(({ code, map, ast }) => {
      // 在loader执行完成后才让调用callback表示本loader已经完成了
      callback(null, code, map, ast);
    }).catch(err => callback(err));
  }
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

如果在多个loader中都使用了@babel/core来解析源代码，为了性能考虑可以在多个loader之间传递第一个babel/core解析源码后得到ast对象，而不必在每个loader中都调用babel/core转换一遍源代码。

loader函数接收三个参数：`source`（源代码文本），`inputAst`（前一个loader可能提供的AST），和`inputSourceMap`（上一个loader提供的source map）。



从 webpack 5 开始，`this.getOptions` 可以获取到 loader 上下文对象。它用来替代来自 [loader-utils](https://github.com/webpack/loader-utils#getoptions) 中的 `getOptions` 方法。





扩展：

在 Webpack 的 loader 链中，如果多个 loader 都使用了 Babel 进行代码转换，理论上可以通过共享 Babel 生成的 AST（抽象语法树）来提高性能，避免重复的解析步骤。**Babel 本身是支持 AST 的输入和输出的**，这意味着前一个 loader 可以生成 AST，而后一个 loader 可以直接复用这个 AST，而不必重新解析代码。

不过，Webpack 本身并不自动处理 AST 的传递，**你需要手动实现 AST 在 loader 之间的共享**。需要在每个 loader 中显式地处理 AST 的输入和输出。

**如何共享 Babel 的 AST？**

1. **前一个 loader 输出 AST**： 使用 Babel 处理时，可以让第一个 loader 输出 AST，而不是最终的代码。

2. **后一个 loader 复用 AST**： 后续的 loader 可以直接接受 AST 作为输入，而不需要再次解析源码。

**实现步骤**

假设有两个使用 Babel 的 loader，并希望它们共享 AST。可以通过在 Webpack 的 loader 中传递 AST 来实现。

1. 自定义 `babel-loader` 来输出 AST

   首先，修改一个自定义的 Babel loader，使其输出 AST：

   ```js
   // first-babel-loader.js
   
   const babel = require('@babel/core');
   
   module.exports = function(source) {
     const options = this.getOptions() || {};
   
     // 转换代码，并输出 AST
     const result = babel.transformSync(source, {
       ...options,
       ast: true, // 生成 AST
       code: false, // 不生成代码
     });
   
     // 通过 this.callback 传递 AST
     this.callback(null, result.ast, null);
   };
   
   ```

2. **后续 loader 接收 AST 作为输入**

   然后，实现第二个 loader，它接收并处理 AST，而不是源码。

   ```js
   // second-babel-loader.js
   
   const babel = require('@babel/core');
   
   module.exports = function(source) {
     // 检查是否已经有 AST，如果有，直接使用 AST
     const options = this.getOptions() || {};
   
     let ast = typeof source === 'string' ? null : source; // 判断传入的是否是 AST
   
     if (!ast) {
       // 如果没有 AST，解析源码（这应该不会发生，因为第一个 loader 会传 AST）
       const result = babel.transformSync(source, { ...options, ast: true });
       ast = result.ast;
     }
   
     // 在此基础上对 AST 进行二次处理，生成最终代码
     const result = babel.transformFromAstSync(ast, null, {
       ...options,
       code: true, // 生成代码
     });
   
     // 返回最终的代码
     return this.callback(null, result.code, result.map);
   };
   
   ```

3. **Webpack 配置文件**

   ```js
   const path = require('path');
   
   module.exports = {
     module: {
       rules: [
         {
           test: /\.js$/,
           exclude: /node_modules/,
           use: [
             {
               loader: path.resolve(__dirname, 'second-babel-loader.js'), // 第二个 loader 使用 AST
               options: {
                 presets: ['@babel/preset-env'],
               },
             },
             {
               loader: path.resolve(__dirname, 'first-babel-loader.js'), // 第一个 loader 生成 AST
               options: {
                 presets: ['@babel/preset-env'],
               },
             },
           ],
         },
       ],
     },
   };
   
   ```

   

**关键点：**

- **第一个 loader (`first-babel-loader.js`)** 负责解析源码并生成 AST，然后将 AST 传递给下一个 loader。
- **第二个 loader (`second-babel-loader.js`)** 直接接收 AST 并在此基础上进行进一步的转换。
- 通过这种方式，多个 loader 之间可以共享 AST，避免了每个 loader 重新解析源码的开销。这在需要进行多次转换的场景下，能够显著提升性能。





### style-loader

这个函数(pitch)在常规的loader转换函数执行之前被调用，提供了一个机会来决定是否跳过后续的loader或者在没有处理资源的情况下直接返回结果。

`pitch`函数接收以下参数：

1. **remainingRequest**：一个包含了所有剩余请求的字符串。这些剩余的请求包括了loader链中位于当前loader后面的loader，以及最终的资源路径。这个字符串可以直接被webpack使用，以便在某些场景下重新启动loader处理流程。
2. **precedingRequest**：一个包含了所有前置请求的字符串。这些前置请求包括了loader链中位于当前loader前面的所有loader。这个信息可以用来了解资源在到达当前loader之前已经经过了哪些处理。
3. **data**：一个可以在pitch和普通loader转换函数之间共享数据的对象。这个对象是空的，可以被当前loader的`pitch`函数和主体（normal）函数使用，以在两者之间共享信息。

函数的返回值有特别的含义：

- 如果`pitch`函数返回一个值（不是`undefined`），这个返回的结果会被用来跳过剩余的loader并直接处理这个结果，就像是这个结果已经通过了所有剩余的loader一样。
- 如果没有返回值（或者返回`undefined`），webpack就会继续执行剩余的loader链，最后处理资源。

`pitch`函数的使用场景包括但不限于：

- 根据特定条件提前结束loader处理。
- 在资源被实际处理之前，修改或添加必要的预处理步骤。
- 在不同loader之间共享数据。

通过使用`pitch`函数，可以在资源加载和转换过程中添加更多的控制逻辑，使得资源的处理更加灵活和高效。



- previousRequest 前面的 loader
- currentRequest 自己和后面的 loader+资源路径
- remainingRequest 后面的 loader+资源路径
- data: 和普通的 loader 函数的第三个参数一样,而且 loader 执行的全程用的是同一个对象
- 注意`sourceMaps`最后有个`s`

```js
//css文本代码 export default
const path = require('path');

function normalize(path) {
    return path.replace(/\\/g, '/');
}

function loader(source) {}

// pitch是loader的一个方法
loader.pitch = function (remainingRequest) {
    console.log('remainingRequest', remainingRequest);
    console.log('context', this.context); //index.less模块所在的目录 可以用作解析其他模块成员的上下文
    //1.获取剩下的请求
    //2.用!分割得到各个部分的绝对路径，前面是loader路径，后面是文件路径
    //3.把路径从绝对路径变成相对于根目录的相对路径
    //路径的前面要加上!!,只使用行内loader,不使用rule里面配置的loader,不然就会死循环了
    /*   
  	const request = "!!"+(remainingRequest.split('!').map(
    //这个路径其实就是模块的ID
    requestAbsPath => ("./" + path.posix.relative(normalize(this.context), 							normalize(requestAbsPath)))).join('!'));
  console.log('request', request);
    */
    const request = '!!' + remainingRequest.split('!')
    .map((request) => this.utils.contextify(this.context, request)).join('!');
    console.log('request', request);
    let script = `
     let styleCSS = require(${JSON.stringify(request)});
     let style = document.createElement('style');
     style.innerHTML =styleCSS;
     document.head.appendChild(style);
   `;
    return script;
};
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

less-loader返回的是css代码，但是如果返回的不是一段css代码而是js代码的话，就需要后续的loader对返回的是js代码也要提供支持。

```js
const less = require('less');
function loader(source) {
  // 该loader函数中的this就是由loader-runner库绑定的，里面有一些方法和属性
  let callback = this.async();
  less.render(source, { filename: this.resource }, (err, output) => {
      // callback(err,output.css)  // 直接返回css代码
    callback(err, `module.exports = ${JSON.stringify(output.css)}`);  // 返回js代码
  });
}
module.exports = loader;  
```



### loader-runner 实现

loader-runner 的使用：

```js
const { runLoaders } = require('./loader-runner');
const path = require('path');
const fs = require('fs');

const entryFile = path.resolve(__dirname, 'src/index.js');

let request = `inline-loader1!inline-loader2!${entryFile}`;
const rules = [
  {
    test: /\.js$/,
    use: ['normal-loader1', 'normal-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'pre',
    use: ['pre-loader1', 'pre-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post-loader1', 'post-loader2']
  }
];
const parts = request.replace(/^-?!+/, '').split('!');
let resource = parts.pop();
let inlineLoaders = parts;
let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (resource.match(rule.test)) {
    if (rule.enforce == 'pre') {
      preLoaders.push(...rule.use);
    } else if (rule.enforce == 'post') {
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
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) {
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
//把loader从一个名称变成一个绝对路径
loaders = loaders.map((loader) => path.resolve(__dirname, 'loader-chain', loader));
debugger;

runLoaders(
  {
    resource, //要处理的资源文件
    loaders, //资源文件需要经过发些loader的处理
    context: { age: 18, author: 'zhufeng' },
    readResource: fs.readFile //读文件用哪个方法
  },
  (err, result) => {
    //finalCallback
    console.log(err);
    console.log(result.result[0].toString()); //转换后的结果
    //转换前源文件的内容
    console.log(result.resourceBuffer);
    console.log(result.resourceBuffer ? result.resourceBuffer.toString() : null);
  }
);
```



**loader 的运行流程**

![img](http://static.zhufengpeixun.com/loaderflow1_1661312752787.jpg)

**实现**

- [LoaderRunner.js](https://github.com/webpack/loader-runner/blob/v2.4.0/lib/LoaderRunner.js)
- [NormalModuleFactory.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L180)
- [NormalModule.js](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModule.js#L292)

![image-20240217143955675](images\image-20240217143955675.png)

![image-20240217144031893](images\image-20240217144031893.png)

每个 loader 导出的函数中的 this 都是由 loader-runner 这个库绑定的。

```js
/**
 * 根据loader的绝对路径创建loader对象
 * @param {*} loaderAbsPath
 */
function createLoaderObject(loaderAbsPath) {
  const normal = require(loaderAbsPath);
  const pitch = normal.pitch;
  //如果设置normal.raw属性为true的话，那么loader的normal函数参数就是一个Buffer,否则就是一个字符串
  const raw = normal.raw;
  return {
    path: loaderAbsPath,
    normal,
    pitch,
    raw,
    data: {}, //每个loader都有一个自已的自定对象，可以有用来保存和传递数据
    pitchExecuted: false, //表示此loader的pitch已经执行过了
    normalExecuted: false //表示此loader的normal函数已经执行过了
  };
}

/**
 * 转换loader的参数
 * @param {*} args 参数
 * @param {*} raw 布尔值，表示loader想要字符串还是想要Buffer
 */
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString();
  }
}

function iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback) {
  if (loaderContext.loaderIndex < 0) {
    return pitchingCallback(null, args);
  }
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
  }
  let fn = currentLoader.normal; //就是loader里的normal函数
  currentLoader.normalExecuted = true;
  convertArgs(args, currentLoader.raw);
  //要以同步或者异步的方式执行fn
  runSyncOrAsync(fn, loaderContext, args, (err, ...returnArgs) => {
    if (err) pitchingCallback(err);
    return iterateNormalLoaders(processOptions, loaderContext, returnArgs, pitchingCallback);
  });
}


function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  let isSync = true; //默认fn的的执行是同步
  let isDone = false; //表示当前的函数是否已经完成了
  loaderContext.callback = (err, ...args) => {
    if (isDone) {
      throw new Error('callback(): The callback was already called.');
    }
    isDone = true;
    //callback 是不是要判断下isSync的值啊
    runCallback(err, ...args);
  };
  loaderContext.async = () => {
    isSync = false;
    return loaderContext.callback;
  };
  let result = fn.apply(loaderContext, args);
  //如果当前的执行是同步的话
  if (isSync) {
    isDone = true;
    runCallback(null, result);
  }
  //如果是异步，不会立刻调用runCallback,需要你在loader的内部手工触发callback,然后执行runCallback
}


function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
    processOptions.resourceBuffer = resourceBuffer; //要加载的资源的二进制数组 Buffer
    loaderContext.loaderIndex--;
    iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], pitchingCallback);
  });
}

function iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, pitchingCallback);
  }
  //获取当前索引对应的loader对象
  let currentLoader = loaderContext.loaders[loaderContext.loaderIndex];

  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
  }
  //因为我们要保证一个loader pitch或者说normal只走一次
  //获取当前loader对应的pitch函数
  let fn = currentLoader.pitch;
  currentLoader.pitchExecuted = true;
  if (!fn) {
    return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
  }

  runSyncOrAsync(
    fn,
    loaderContext,
    [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data],
    (err, ...returnArgs) => {
      //判断pitch方法的返回值有没有，如果有则跳过后面的loader,返回头执行前一个loader
      if (returnArgs.length > 0 && returnArgs.some((item) => item)) {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback);
      } else {
        return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
      }
    }
  );
}

function runLoaders(options, finalCallback) {
  //resource要处理的资源，或者说要编译的模块路径
  //loaders处理此路径的loaders
  //context指的是loader函数在执行的时候this指针
  //readResource读取文件的方法fs.readFile
  const { resource, loaders = [], context = {}, readResource } = options;
  //loaders现在是一个loader模块的绝对路径，转成一个对象
  const loaderObjects = loaders.map(createLoaderObject);
  const loaderContext = context; //这个对象就是loader执行的时候的this指针
  loaderContext.resource = resource; //加载的模块
  loaderContext.readResource = readResource; //读取文件的方法
  loaderContext.loaders = loaderObjects; //存放loaders对象数组
  loaderContext.loaderIndex = 0; //当前正在处理的loader的索引
  loaderContext.callback = null; //可以手工调用此方法向后执行下一个loader
  loaderContext.async = null; //可以把loader运行从同步变为异步,并返回this.callback
  //代表整个请求
  Object.defineProperty(loaderContext, 'request', {
    get() {
      //把loader的绝对路径和要加载的资源的绝对路径用!拼在一起
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join('!');
    }
  });

  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join('!');
    }
  });

  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join('!');
    }
  });

  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .join('!');
    }
  });

  Object.defineProperty(loaderContext, 'data', {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    }
  });

  const processOptions = {
    readResource, //fs.readFile
    resourceBuffer: null //要读取的资源的源代码，它是一个Buffer,就二进制字节数组
  };
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    //pitchingCallback
    finalCallback(err, {
      result, //是最终处理的结果 ,其实就是最左则的loader的normal 返回值
      resourceBuffer: processOptions.resourceBuffer
    });
  });
}

exports.runLoaders = runLoaders;
```

一个面试题，有两个函数A和B，其中B函数，有时候希望它是在A执行后同步执行的，有时候希望它是在A执行后异步执行的，如何实现这个工具函数，它接受A，B作为实参？

如果该函数是同步的，那么这两个函数会依次执行，如果这个函数是异步的，那么希望后面那个函数在该异步函数执行完后再执行，现在需要实现一个工具函数来达到这个目的。

```js
function runSyncOrAsync(fn,loaderContent,args,runCallback){
    let isSync = true;// 默认同步
    let isDone = false
    loaderContext.callback = (err,...args)=>{
        if(isDone){
            thorow new Error('已经执行过callback函数，无法再次执行')
        }
        isDone = true
        return runCallback(err,...args)
    }
    loaderContext.async = ()=>{
        isSync = false;
        return loaderContext.callback
    }
    let result = fn.apply(loaderContext,args);
    if(isSync){
        isDone = true
        runCallback(null,result)
    }
}
```



模拟同步：

```js
function normal(){
    console.log('normal')
    return 'normal'
}

function callback(value){
    cons.log('callback'+value)
}

function runSyncOrAsync(fn,callback){
    const result = fn()
    callback(result)
}

runSyncOrAsync(normal,callback)
```



模拟异步：

```js
function normal() {
  console.log('normal');
  const callback = this.async();
  setTimeout(() => {
    callback('normal');
  });
}

function callback(value) {
  console.log('callback' + value);
}

function runSyncOrAsync(fn, callback) {
  const contextFn = {
    sync: true
  };

  contextFn.async = function () {
    contextFn.sync = false;
    return callback;
  };

  const result = fn.call(contextFn);
  if (contextFn.sync) {
    callback(result);
  }
}

runSyncOrAsync(normal, callback);
```





## 模拟实现微型的webpack

模拟一个核心功能俱全的微型 Webpack 需要包含以下几个关键部分：

1. **入口文件的解析**：通过递归分析依赖关系，构建模块依赖图。
2. **打包**：将所有的模块合并成一个或多个文件。
3. **Loader 机制**：支持对不同类型的文件进行转换，如将 ES6 转换为 ES5。
4. **插件机制**：通过生命周期钩子扩展 Webpack 功能。

我们会使用 Node.js 实现一个微型的 Webpack，虽然简化了很多功能，但它能帮助理解 Webpack 的核心设计。

1. **模块依赖解析**

首先，需要递归解析入口文件及其依赖模块。这里可以用 Node.js 的 `fs` 模块来读取文件，并通过 `babel` 来解析并转换模块。

2. **模拟 Loader 机制**

为了模拟 Loader，会允许配置一个简单的函数链，处理每个模块的内容。

3. **模拟插件系统**

插件系统基于 Webpack 的生命周期钩子机制，用事件驱动模型来实现插件功能。

**代码实现**

下面是一个简单的微型 Webpack 的实现。

```js
// 微型Webpack的实现
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { SyncHook } = require('tapable'); // 使用Tapable来模拟事件机制

class MiniWebpack {
    constructor(options) {
        this.entry = options.entry; // 入口文件
        this.output = options.output; // 输出配置
        this.modules = []; // 模块依赖数组
        this.loaders = options.loaders || []; // 模拟Loader数组
        this.plugins = options.plugins || []; // 插件
        this.hooks = {
            beforeRun: new SyncHook(['compiler']), // 注册钩子
            afterCompile: new SyncHook(['compiler']),
            emit: new SyncHook(['compiler']),
            done: new SyncHook(['stats']),
        };

        // 应用插件
        this.plugins.forEach(plugin => plugin.apply(this));
    }

    // 读取文件内容并解析
    parseModule(filename) {
        let content = fs.readFileSync(filename, 'utf-8');

        // 处理 Loader
        this.loaders.forEach(loader => {
            if (loader.test.test(filename)) {
                content = loader.use(content);
            }
        });

        // 使用 Babel 将 ES6 转换为 ES5
        const { ast, code } = babel.transformSync(content, {
            ast: true,
            presets: ['@babel/preset-env'],
        });

        // 提取依赖模块
        const dependencies = [];
        babel.traverse(ast, {
            ImportDeclaration({ node }) {
                dependencies.push(node.source.value);
            },
        });

        return { filename, code, dependencies };
    }

    // 构建模块依赖图
    buildDependencyGraph(entry) {
        const entryModule = this.parseModule(entry);
        const graph = [entryModule];

        // 递归解析模块依赖的其他模块
        for (const mod of graph) {
            mod.dependencies.forEach(dep => {
                const depPath = path.resolve(path.dirname(mod.filename), dep);
                const depModule = this.parseModule(depPath);
                graph.push(depModule);
            });
        }

        return graph;
    }

    // 生成打包后的代码
    generateCode(graph) {
        const modules = graph
        .map(mod => {
            return `"${mod.filename}": function(require, module, exports) { ${mod.code} }`;
        })
        .join(',');

        return `
      (function(modules) {
        function require(filename) {
          const fn = modules[filename];
          const module = { exports: {} };
          fn(require, module, module.exports);
          return module.exports;
        }
        require("${this.entry}");
      })({${modules}});
    `;
    }

    // 执行打包
    run() {
        this.hooks.beforeRun.call(this);

        // 构建依赖图
        const graph = this.buildDependencyGraph(this.entry);

        this.hooks.afterCompile.call(this);

        // 生成代码并写入文件
        const output = this.generateCode(graph);

        this.hooks.emit.call(this);

        fs.writeFileSync(this.output.path, output, 'utf-8');

        this.hooks.done.call({ output });
    }
}

module.exports = MiniWebpack;
```

### 使用方式

#### 1. 定义 Loader

在这个微型 Webpack 中，Loader 只是简单的函数转换。我们可以传入一个匹配文件类型的正则表达式和处理函数。

```
js复制代码// loader例子
module.exports = {
  test: /\.js$/,
  use(content) {
    // 简单的转换
    return content.replace(/console\.log/g, 'alert');
  }
};
```

#### 2. 定义插件

我们可以通过插件来扩展 Webpack 的功能，例如在打包的不同阶段执行自定义逻辑。插件通过 `apply` 方法注册到 Webpack 中。

```
js复制代码// plugin例子
class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tap('HelloWorldPlugin', () => {
      console.log('Webpack 构建开始！');
    });
    compiler.hooks.done.tap('HelloWorldPlugin', stats => {
      console.log('Webpack 构建完成！');
    });
  }
}

module.exports = HelloWorldPlugin;
```

#### 3. Webpack 配置

```
js复制代码const MiniWebpack = require('./mini-webpack');
const HelloWorldPlugin = require('./hello-world-plugin');
const babelLoader = require('./babel-loader');

const config = {
  entry: './src/index.js',
  output: {
    path: './dist/bundle.js',
  },
  loaders: [babelLoader],
  plugins: [new HelloWorldPlugin()],
};

const compiler = new MiniWebpack(config);
compiler.run();
```

### 运行打包流程

假设我们有以下项目结构：

```
bash复制代码/src
  index.js
  other.js
mini-webpack.js
babel-loader.js
hello-world-plugin.js
```

`index.js` 通过 `import` 依赖了 `other.js`。当我们运行 `node build.js`，Webpack 就会按照如下流程执行：

1. **解析入口文件**：从 `entry` 开始，解析代码，提取依赖关系，并通过 Loader 处理文件。
2. **构建依赖图**：递归解析所有的依赖文件，构建完整的模块依赖图。
3. **生成代码**：根据依赖图，将所有模块打包成一个文件，使用自定义的 `require` 函数来加载模块。
4. **触发插件**：插件会在构建的不同阶段通过钩子系统执行自定义逻辑。



## 插件

### 前置知识

面试的时候手写并发控制，异步机制代码，都可以参考 tapable 库的这些方法。tapable 可以独立使用。

异步任务的并发数控制函数。

例题：

> 请实现如下的函数，可以批量请求数据，所有的 URL 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发度，当所有请求结束之后，需要执行 callback 回调函数，发请求的函数可以直接使用 fetch 即可。
>
> function sendRequest(urls:string[],max:number,callback:()=>void){ }



在webpack中，`Compiler`和`Compilation`实例上的hooks使用了多种类型，以提供不同的插件机制，从而允许插件开发者在webpack的编译过程中的不同阶段以不同的方式参与进来。每种类型的hook都有其特定的行为和用途，这使得webpack的插件系统非常灵活和强大。

Webpack 本质上是一种事件流机制，它的核心架构设计就是围绕着 **事件驱动** 和 **插件系统** 来构建的。这种设计让 Webpack 本身非常灵活，能够通过插件系统扩展其功能，开发者可以使用插件深入控制 Webpack 的打包过程。

**Webpack 的核心设计理念**

1. **Tapable**：Webpack 底层使用了一个名为 `Tapable` 的库，这是 Webpack 的事件驱动机制的核心。`Tapable` 提供了钩子（Hooks）机制，类似于发布-订阅模式，可以在 Webpack 生命周期的各个关键节点上挂载事件，并触发事件。
2. **生命周期钩子（Hooks）**：Webpack 的整个打包过程被划分为多个阶段，每个阶段都有生命周期钩子（Hooks），如：`compile`、`emit`、`done` 等。插件可以在这些钩子上挂载自定义逻辑，扩展 Webpack 的功能。
3. **插件系统（Plugins）**：Webpack 的插件系统使得插件可以在打包过程中任何时刻“插入”定制化的功能。插件通过钩子与 Webpack 的事件流进行交互，从而修改、增强 Webpack 的行为。
4. **Loader 机制**：Webpack 中 loader 是专门处理模块转换的，loader 是作用于模块的，但和插件的设计理念相同，loader 也可以被认为是 webpack 插件系统的一部分。它们一起完成了对文件的转化和打包工作。

**Webpack 底层架构设计的主要组件**

1. **Tapable 库**

Webpack 中的 `Tapable` 是核心库，它类似于一个事件发布订阅系统，Webpack 的所有事件都是通过 Tapable 的 hooks 来管理。`Tapable` 提供了多种类型的 hooks，常用的如 `SyncHook`、`AsyncSeriesHook`、`AsyncParallelHook`，这些 hooks 控制着同步、异步的插件执行流程。

```js
const { SyncHook } = require('tapable');

class MyPlugin {
    apply(compiler) {
        compiler.hooks.compile.tap('MyPlugin', (params) => {
            console.log('Compile is starting...');
        });
    }
}
// 这个例子展示了如何在 compile 钩子上注册一个同步钩子来执行自定义代码。
```

2. **Webpack 生命周期和钩子**

Webpack 的运行分为多个阶段，比如：

- **Initialization**：初始化 Webpack 配置文件、解析模块依赖
- **Compilation**：递归处理模块依赖图，生成最终的代码包
- **Optimization**：代码优化，如 Tree Shaking、代码压缩等
- **Emit**：将打包好的资源输出到文件系统

每个阶段都有生命周期钩子，例如 `beforeCompile`、`afterCompile`、`emit` 等，开发者可以通过插件系统在这些生命周期中注册钩子，扩展功能。

3. **Compiler 和 Compilation**

- **Compiler** 是 Webpack 的核心对象，负责启动 Webpack 的整个打包过程。所有插件通过 `compiler` 对象与 Webpack 进行交互。
- **Compilation** 代表了 Webpack 打包过程中每一次构建的状态，包含了所有的模块、资源和生成代码的详细信息。插件可以通过 `compilation` 对象来访问和修改模块的具体打包结果。

**Compiler 和 Compilation 的关系**：

- `Compiler` 是全局的，它负责管理整个 Webpack 构建生命周期。
- `Compilation` 是每次打包的上下文，它管理构建的细节（包括每个模块的依赖、处理、优化等）。

4. **插件机制**

Webpack 的插件机制通过 `Compiler` 和 `Compilation` 提供的钩子机制允许开发者在打包过程中“拦截”或“修改” Webpack 的行为。插件通过 `apply` 方法挂载到 `compiler` 上，并利用生命周期钩子执行自定义逻辑。

5. **Loader 系统**

- **Loader** 是用来转换模块的，比如将 `.scss` 转换为 `.css`，将 ES6+ 转换为 ES5。Loader 负责将不同类型的文件（如 CSS、图片等）转为 Webpack 可以理解的模块。
- Loader 只作用于单个文件，而插件则可以作用于整个构建过程，Loader 可以组合使用形成链式处理，Loader 的顺序和插件的机制都可以通过 Webpack 配置灵活控制。

**Webpack 插件系统的优势**

1. **灵活性**：通过插件，开发者可以非常轻松地扩展 Webpack 的功能，而不需要去修改 Webpack 核心代码。
2. **强大的生命周期管理**：Webpack 提供了众多的生命周期钩子，开发者可以在打包过程的任何时刻插入自己的逻辑，精细地控制打包过程。
3. **插件生态丰富**：Webpack 的插件生态非常丰富，从代码优化、文件压缩到模块热更新，Webpack 插件几乎覆盖了所有常见的需求。
4. **事件驱动模型**：Webpack 通过事件驱动的架构实现了高度的模块化和解耦，插件可以通过订阅不同的钩子来控制整个打包过程，这种设计带来了很高的可维护性和扩展性。

**插件系统的实际应用场景**

- **代码压缩**：通过插件在 `emit` 阶段将生成的文件进行压缩，例如 `TerserPlugin`。
- **代码分离**：通过插件可以实现代码的按需加载或分离，`SplitChunksPlugin` 就是一个经典的分离代码的插件。
- **自动生成 HTML 文件**：例如 `HtmlWebpackPlugin` 可以自动生成带有正确依赖的 HTML 文件。
- **热模块替换**：通过 `HotModuleReplacementPlugin` 可以实现模块的热更新而不需要重新加载整个页面。



#### 插件核心 tapable

webpack 插件机制：

- webpack 实现插件机制的大体方式是：
  - 创建 - webpack 在其内部对象上创建各种钩子；（如compiler对象上的hooks上的run或者done）
  - 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
  - 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。
  
- Webpack 本质上是一种**事件流的机制**，它的工作流程会将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都继承自 Tapable 

  所以webpack中插件的勾子函数分布在Compiler ，Compilation 等实例对象上，也就可以选择在这些对象的勾子上注册自己的插件。

- 通过事件注册和监听，触发 webpack 生命周期中的函数方法

webpack 插件钩子（生命周期函数）可视化工具：[wepback-plugin-visualizer](https://www.npmjs.com/package/wepback-plugin-visualizer)

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
  AsyncSeriesWaterfallHook
} = require('tapable');
```

#### tapable 分类

1. ##### 按同步异步分类

   - Hook 类型可以分为`同步Sync`和`异步Async`，异步又分为`并行`(一起开始，全部结束才结束)和`串行`（前一个结束后一个才开始） 

     ![image-20230410195505070](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410195505070.png)

     

2. **按返回值分类**

   ![image-20230410195529852](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410195529852.png)

   - basic：执行每一个事件函数，不关心函数的返回值，有SyncHook、AsyncParallelHook、AsyncSeriesHook

     ![image-20230410200044645](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200044645.png)

     ```js
     const { SyncHook } = require('tapable');
     const  hook = new SyncHook(['name','age']);   // 形参数组，其中的元素的名字没有什么意义，重要的是这个数组的长度，他的长度会是下面回调函数接受到的实际参数的个数
     
     // tap函数接受的第一个参数是表示回调的名字，其实也没有什么用
     hook.tap('1',(name,age)=>{
         console.log(name,age)
     })
     hook.tap('2',(name,age)=>{
         console.log(name,age)
     })
     hook.tap('3',(name,age)=>{
         console.log(name,age)
     })
     
     hook.call('tom',18)
     ```
   
     
   
   - waterfall：如果前一个事件函数的结果 `result !== undefined`，则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook
   
     ![image-20230410200145319](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200145319.png)
   
     
   
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
     hook.tap('1', (name, age) => {
       console.log(1, name, age);  // 'zhufeng', 18
       return 'result1';
     });
     hook.tap('2', (name, age) => {
       console.log(2, name, age);  // 'result1', 18
       return 'result2';
     });
     hook.tap('3', (name, age) => {
       console.log(3, name, age);  // 'result2', 18
     });
     hook.call('zhufeng', 18);
     ```
   
   - bail：执行每一个事件函数，遇到第一个钩子的返回值结果 `result !== undefined` ，则不再继续往后执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook
   
     ![image-20230410200127561](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200127561.png)
   
   - loop：不停的循环执行事件函数，直到所有函数结果 `result === undefined`，有 SyncLoopHook 和 AsyncSeriesLoopHook
   
     ![image-20230410200204253](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230410200204253.png)
   
     
     
     ```js
     const { SyncLoopHook } = require('tapable');
     /**
      * 不停的执行回调函数，直到结果等于undefined
      */
     const hook = new SyncLoopHook(['name', 'age']);
     let counter1 = 0,
       counter2 = 0,
       counter3 = 0;
     
     hook.tap('1', (name, age) => {
       console.log(1, 'counter1', counter1);
       if (++counter1 === 1) {
         counter1 = 0;
         return;
       }
       return true;
     });
     
     hook.tap('2', (name, age) => {
       console.log(2, 'counter2', counter2);
       if (++counter2 === 2) {
         counter2 = 0;
         return;
       }
       return true;
     });
     
     hook.tap('3', (name, age) => {
       console.log(3, 'counter3', counter3);
       if (++counter3 == 3) {
         counter3 = 0;
         return;
       }
       return true;
     });
     hook.call('zhufeng', 18);
     ```



异步的hook，注册方式有3种：

1. tap：注册同步回调函数
2. tapAsync：注册异步回调函数，该函数接收的第三个参数是一个callback函数，调用这个callback函数表示该异步执行完成了
3. tapPromise：注册promise的回调函数，回调函数的返回值必须是promise实例
4. 触发就没有call，只有callAsync、promise

```js
const { AsyncParallelHook } = require('tapable');
const hook = new AsyncParallelHook(['name', 'age']);
//异步的hook，注册方式有3种  tap tapAsync tapPromise

/* hook.tap('1', (name,age) => {
  console.log(1, name, age);
});
hook.tap('2', (name,age) => {
  console.log(2, name, age);
});
hook.tap('3', (name,age) => {
  console.log(3,name,age);
});
// 触发就没有call ，有callAsync promise
hook.callAsync('zhufeng', 18, () => {
  console.log('done');
}); */

/* console.time('cost');
hook.tapAsync('1', (name,age,callback) => {
  setTimeout(() => {
    console.log(1, name, age);
    callback();
  }, 1000);
});
hook.tapAsync('2', (name,age,callback) => {
  setTimeout(() => {
    console.log(2, name, age);
    callback();
  }, 2000);
});
hook.tapAsync('3', (name,age,callback) => {
  setTimeout(() => {
    console.log(3, name, age);
    callback();
  }, 3000);
});


//触发就没有call，只有callAsync、promise
hook.callAsync('zhufeng', 18, () => {
  console.log('done');
  console.timeEnd('cost');
}); */

console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log(1, name, age);
      resolve();
    }, 1000);
  });
});
hook.tapPromise('2', (name,age) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log(2, name, age);
      resolve();
    }, 2000);
  });
});
hook.tapPromise('3', (name,age) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log(3, name, age);
      resolve();
    }, 3000);
  });
});

hook.promise('zhufeng', 18).then(() => {
  console.log('done');
  console.timeEnd('cost');
});
```



#### tapable原理







###  插件

在webpack的插件开发中，选择合适的hook类型对于实现插件的功能非常关键。不同的hooks允许插件在编译流程的不同阶段以不同的方式介入。以下是一些具体插件案例，展示了它们为什么会选择在相应的hook类型中注册函数：

1. SyncHook案例 - `HtmlWebpackPlugin`

`HtmlWebpackPlugin`使用`SyncHook`来操纵生成的HTML文件。它在`compilation`的`html-webpack-plugin-before-html-generation`阶段注册一个同步的hook，这允许它在HTML文件被生成之前修改HTML的内容。由于这个过程不需要异步操作，`SyncHook`就足够满足需求。

2. SyncBailHook案例 - `MiniCssExtractPlugin`

`MiniCssExtractPlugin`可能会在`normal-module-loader`阶段使用`SyncBailHook`，这是因为它需要判断是否应该提取CSS到单独的文件。如果某个条件满足（例如，模块是CSS模块），它可以立即返回结果并阻止后续插件的执行，因此`SyncBailHook`适合这种场景。

3. SyncWaterfallHook案例 - `DefinePlugin`

`DefinePlugin`使用`SyncWaterfallHook`在模块的源代码中替换全局变量。它在`compilation`的`compilation`阶段注册函数，允许它接收前一个插件处理的结果（源代码），然后添加或修改定义的全局变量，并将修改后的源代码传递给链中的下一个插件。

4. AsyncParallelHook案例 - `CopyWebpackPlugin`

`CopyWebpackPlugin`需要将文件从一个位置复制到另一个位置，这个过程可以并行执行以提高效率。因此，它在`emit`阶段使用`AsyncParallelHook`，这样可以同时开始复制多个文件而不阻塞编译过程。

5. AsyncSeriesHook案例 - `CleanWebpackPlugin`

`CleanWebpackPlugin`在编译开始之前需要清除`output`目录中的旧文件。这个过程应该在其他异步任务开始之前完成，因此它使用`AsyncSeriesHook`在`compilation`的`emit`阶段注册一个异步函数，确保清除操作完成后再执行后续操作。

6. AsyncSeriesWaterfallHook案例 - `TerserWebpackPlugin`

`TerserWebpackPlugin`用于压缩JavaScript代码。它可能在`optimize-chunk-assets`阶段使用`AsyncSeriesWaterfallHook`，这样可以接收到前一个插件处理的代码（如果有的话），然后进行压缩操作，并将结果传递给链中的下一个插件。由于这个过程中每个插件的输出都可能成为下一个插件的输入，所以选择`AsyncSeriesWaterfallHook`是合适的。

这些案例展示了不同hooks类型在实现webpack插件时的应用。选择正确的hook类型对于插件能够正确并高效地工作至关重要。通过这些hooks，插件能够在编译流程的适当阶段以期望的方式执行操作，从而实现复杂的构建和优化任务。



插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。webpack 内部也是通过大量内部插件实现的，插件几乎能够任意更改 webpack 编译结果。

在 webpack 中，不同类型的实例对象很多，对象上的钩子也有很多。

webpack 内部可以加载插件的常用对象：

| 对象 | 钩子 |
| :-- | :-- |
| [Compiler](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compiler.js) | run,compile,compilation,make,emit,done... |
| [Compilation](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js) | buildModule,normalModuleLoader,succeedModule,finishModules,seal,optimize,after-seal... |
| [Module Factory](https://github.com/webpack/webpack/blob/master/lib/ModuleFactory.js) | beforeResolver,afterResolver,module,parser... |
| Module |  |
| [Parser](https://github.com/webpack/webpack/blob/master/lib/Parser.js) | program,statement,call,expression... |
| [Template](https://github.com/webpack/webpack/blob/master/lib/Template.js) | hash,bootstrap,localVars,render... |



[Compiler](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compiler.js)(编译器对象)

- run：开启编译
- compile：开始编译
- compilation：开始创建一次新的编译
- make：构建入口
- emit：准备输出结果
- done：完成编译，是一个asyncSeriesHook



[Compilation](https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js)（编译器对象），每当开启一次新的编译就创建一个新的 compilation

- buildModule：构建模块
- normalModuleLoader：加载普通模块
- succeedModule：成功编译一个模块
- finishModules：所有模块都编译完成
- seal：封装代码块
- optimize：优化
- after-seal：封装完成



[Module Factory](https://github.com/webpack/webpack/blob/master/lib/ModuleFactory.js) （模块工厂）

- beforeResolver：解析之前（解析：拿到对应模块的需要被那些 loader 处理的 loader 文件的路径和该模块资源本身）
- afterResolver：解析后（解析：拿到对应模块的需要被那些 loader 处理的 loader 文件的路径和该模块资源本身）
- module：创建模块
- parser：通过语法树解析模块依赖



[Parser](https://github.com/webpack/webpack/blob/master/lib/Parser.js) （解析语法树）

遍历语法树时遇到下面这些节点就触发这些节点名函数

- program
- statement
- call
- expression



[Template](https://github.com/webpack/webpack/blob/master/lib/Template.js)，根据模板生成最后的源代码

- hash
- bootstrap
- localVars
- render



**创建插件**

- 插件是一个类
- 类上有一个 apply 的实例方法
- apply 的参数是 compiler

```js
class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    // ...
  }
}
module.exports = DonePlugin;
```

在插件开发中最重要的两个资源就是`compiler`和`compilation`对象。

- compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
- compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。



**compiler上的插件：**

```js
class DonePlugin{
  apply(compiler) {
      // 同步回调
    compiler.hooks.done.tap('DonePlugin', (stats) => {
      console.log('DonePlugin.tap');
    });
      
      // 异步回调
    compiler.hooks.done.tapAsync('DonePlugin', (stats,callback) => {
      console.log('DonePlugin.tapAsync');
      callback(null);
    });
  }
}
module.exports = DonePlugin;
```





**compilation上的插件：**

要获取compilation实例的话，需要通过compiler.hooks.compilation这个hook来获取，订阅这个hook后，该订阅函数的回调参数就是接收webpack内部传递的compilation实例。

```js
/**
 * 在编译完成后，希望把dist目录下所有的文件打在一个压缩包，保存到输出目录里
 */
const jszip = require('jszip');
const {RawSource } = require('webpack-sources');
class ArchivePlugin{
  apply(compiler) {
    compiler.hooks.compilation.tap('ArchivePlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync({ name: 'ArchivePlugin' }, (assets) => {
        const zip = new jszip();
        for (const pathname in assets) {
          const source = assets[pathname];
          const sourceCode = source.source();//返回源代码字符串
          zip.file(pathname, sourceCode);
        }
        return zip.generateAsync({ type: 'nodebuffer' }).then(content => {
          assets[`${Date.now()}.zip`] = new RawSource(content);
         /*  assets[`${Date.now()}.zip`] = {
            source() {
              return content;
            }
          } */
        });
      });
    });
  }
}
module.exports = ArchivePlugin;
```





#### **自动外联插件**

- [ExternalsPlugin.js](https://github.com/webpack/webpack/blob/0d4607c68e04a659fa58499e1332c97d5376368a/lib/ExternalsPlugin.js)
- [ExternalModuleFactoryPlugin](https://github.com/webpack/webpack/blob/eeafeee32ad5a1469e39ce66df671e3710332608/lib/ExternalModuleFactoryPlugin.js)
- [ExternalModule.js](https://github.com/webpack/webpack/blob/eeafeee32ad5a1469e39ce66df671e3710332608/lib/ExternalModule.js)
- [parser](https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L87)
- [factory](https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L66)
- [htmlWebpackPluginAlterAssetTags](https://github.com/jantimon/html-webpack-plugin/blob/v3.2.0/index.js#L62)

传统在wabpack中配置cdn，一般在项目中引入一些著名的公共库的话，如果不做任何处理，该公共库的源代码会被一并打包到最终生成的文件中，增加打包文件的体积。  为了解决这个问题，可以通过cdn来解决，一般步骤如下：

1. 在html-webpack-plugin插件的模板html中添加cdn外链脚本，他们会在全局window对象上挂载属性，比如vue，_，$等，自己必须知道这个变量名字才行

2. 在webpakc配置中的externals选项中配置需要排除的依赖库，如：
   ```js
   {
       "externals":{
           'jquery':'$',  // 当项目中引入jquery后，引入的jquery对应的变量名字不再去node_modules中找了，直接去window.$上找
           'lodash':'_'，
           'vue':'vue'
       }
   }
   ```



现在自己来写一个插件将上面的两步通过插件来实现。

使用插件如下：

```js
{
    plugins:[
        new AutoExternalPlugin({
            jquery:{
                url:'http://xxx.cdn/xxx/xxx.js',
                variable:'$'
            },
            {
              // ....
        	}
        })
    ]
}
```



该插件除了要识别源码内部是否引入需要被排除打包的库，还需要和使用html-webpack-plugin生成的html模板内容进行交互。

- `检测依赖` 当检测到有`import或者require`该指定的`library`时，将其设置为不打包类似`exteral`,并在指定模版中加入 script,那么如何检测某个模块中通过 import或者require方法引入了需要排除的模块了？这里就用`Parser`
- `external依赖` 需要了解 external 是如何实现的，webpack 的 external 是通过插件`ExternalsPlugin`实现的，ExternalsPlugin 通过`tap` `NormalModuleFactory` 在每次创建 Module 的时候判断是否是`ExternalModule`，如果是则创建外部模块，如果不是则创建普通模块，所以就用到了AsyncSeriesBailHookss
- webpack4 加入了模块类型之后，`Parser`获取需要指定类型 moduleType,一般使用`javascript/auto`即可

```js
const { ExternalModule } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
class AutoExternalPlugin {
  constructor(options) {
    this.options = options;
    this.externalModules = Object.keys(options);
    this.importedModules = new Set();
  }
  apply(compiler) {
    //获取到普通模块工厂,此工厂在Compiler创建的时候就直接创建好了。
    //饭店=Compiler 招聘一个厨师 normalModuleFactory
    //每当接到订单，顾客点个蛋炒饭，或者说创建一个模块，会由厨师normalModuleFactory创建这个模块
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
      //模块工厂会负责创建模块，创建完模块要编译模块，就是把模块源码转成语法树AST，然后遍历语法树找依赖
      //在遍历语法树的时候，遇到不同的点节会触发不同的事件
      normalModuleFactory.hooks.parser
        .for('javascript/auto')
        .tap('AutoExternalPlugin', (parser) => {
          parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
            if (this.externalModules.includes(source))
              this.importedModules.add(source);
          });
          //call是一个hookMap {key:Hook} 判断call这个hookMap里有没有require这个key对应的hook,如果有返回，没有则创建再返回
          parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
            const source = expression.arguments[0].value;
            if (this.externalModules.includes(source))
              this.importedModules.add(source);
          });
        })
      //2.改造模块的生产过程，拦截生成过程，判断如果是外部模块的话，生产一个外部模块并返回
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
        const { request } = resolveData;//获取加载的模块名 request = jquery
        //如果这个要创建的模块是外部模块的话
        if (this.externalModules.includes(request)) {
          let { variable } = this.options[request];
            // ExternalModule就是原生的external配置项在源码中使用到的工具类
          callback(null, new ExternalModule(variable, 'window', request));
        } else {
          callback(null);
        }
      });
    })
    //3.向产出的html里插入CDN的脚本
    compiler.hooks.compilation.tap('AutoExternalPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin', (data,callback) => {
        const { assetTags } = data;
        for(let key of this.importedModules){
          assetTags.scripts.unshift({
            tagName: 'script',
            voidTag: false,
            attributes: {
              defer: false,
              src:this.options[key].url
            }
          });
        }
        console.log(assetTags);
        callback(null,data);
      });
    });

  }
}
module.exports = AutoExternalPlugin;
/**
 * 实现思路 
 * 1.找到本项目中的所有依赖的模块，看看哪些在AutoExternalPlugin配置了
 * 也就是说看看项目里有没有使用jquery和lodash
 * 因为用到了才需要处理为外部模块，如果没有用过就不需要任何处理
 * 2.如何找本项目依赖了哪些模块?
 * import 'lodash'
 * require('query'); callExpression
 * 所以我要找项目中的import和require语句，或者说节点
 * Compiler=>NormalModuleFactory=>Parser=>import/require
 */
/**
 * HtmlWebpackPlugin核心功能
 * 1.编译HTML模板
 * 2.根据webpack传递过来的资源信息assets,生成标签.js=>script,css=>link
 * 3.把标签注入HTML文件中
 * 4.写入硬盘 emit就是指写入硬盘
 */
```

html-webpack-plugin该插件会向compilation上挂载一些额外的hook实例。



## AsyncQueue

异步队列。通过它可以实现并行执行任务。

在 **Webpack** 中，**AsyncQueue** 是一个用于处理异步任务的内部机制。它管理和调度异步操作，并确保这些操作在合适的时机执行。Webpack 需要在构建流程中处理大量的异步任务（如模块解析、文件读取、插件操作等），而 **AsyncQueue** 通过一种队列机制，帮助管理这些任务，确保它们按照一定顺序执行，并避免重复操作。

**AsyncQueue 的核心概念**

**AsyncQueue** 实质上是一个任务队列系统，它的主要作用是：

- **缓存任务结果**：对已经处理过的任务进行缓存，避免重复执行。
- **任务去重**：同一个任务在未完成之前，只允许被执行一次，后续相同的任务会被缓存起来，等任务完成后统一处理。
- **任务并发管理**：控制任务的并发执行，确保在合适的时机调度任务，避免资源耗尽或不必要的并发操作。

**AsyncQueue 的使用场景**

1. **模块解析**：
   - Webpack 在解析依赖模块时，使用 **AsyncQueue** 来管理模块解析任务。当某个模块正在被解析时，其他依赖于该模块的任务将被暂时挂起，直到该模块解析完成。
2. **文件处理**：
   - 在构建过程中，Webpack 需要读取和处理多个文件（如 JS 文件、CSS 文件等）。这些文件的读取往往是异步的。通过 **AsyncQueue**，Webpack 可以有效地管理这些文件读取操作，避免重复读取，并确保在文件读取完毕后再执行后续操作。
3. **插件系统**：
   - Webpack 插件在执行过程中可能会涉及大量异步操作，例如压缩文件、输出文件等。**AsyncQueue** 帮助插件系统管理这些异步任务，使得插件之间能够有效协同工作。

**AsyncQueue 的核心方法和工作流程**

1. **enqueue**：将任务放入队列中等待执行。
   - 每个任务在被放入队列后会被立即执行，或在前置任务完成后执行。
2. **process**：处理任务，并将任务的结果缓存，避免重复执行。
   - 处理任务时，若发现任务已经存在缓存，会直接返回缓存结果，而不会重新执行。
3. **resolve**：当任务完成时，通知队列该任务已经处理完毕，并唤醒后续依赖该任务的任务。

**AsyncQueue 的工作流程**

1. **任务入队**：当 Webpack 需要执行某个异步操作（如模块解析）时，首先检查该任务是否已经存在缓存，若不存在则将任务放入队列。
2. **任务执行**：队列按照一定顺序执行任务，并记录每个任务的执行结果。若某个任务依赖其他任务，则会等待依赖任务完成后再执行。
3. **任务缓存**：一旦任务执行完成，结果会被缓存起来，后续相同的任务不会重复执行，而是直接返回缓存结果。
4. **任务完成**：当所有任务完成后，Webpack 继续后续的构建流程。

**AsyncQueue 的实际应用场景**

- **模块解析与文件读取**：Webpack 需要异步加载模块和读取文件内容，**AsyncQueue** 能确保每个模块或文件只被解析一次，避免重复解析和读取，提升构建性能。
- **多任务调度**：Webpack 插件系统中，多个插件之间的任务调度可能存在依赖，**AsyncQueue** 能够帮助管理这些复杂的任务依赖和执行顺序。

### **总结**

**AsyncQueue** 是 Webpack 内部的一个异步任务队列机制，它帮助管理和调度异步任务，避免重复执行，提升构建的效率。它的主要使用场景包括模块解析、文件处理和插件执行，通过它的队列机制，Webpack 能有效管理复杂的异步操作，确保任务的正确执行顺序和资源的高效利用。

采用缓存，懒编译和并行编译等方式提升编译速度。而AsyncQueue是webpack5中新增加的优化机制。AsyncQueue可以实现并行执行指定数量的异步任务。内部对任务进行并发的控制或者说管理。 

给你一系列的异步任务，要求写一个管理器去并发控制他们的执行，同时能指定并发的数量。

使用：

```js
//webpack 缓存 懒编译 并行编译
//AsyncQueue 可以实现并行执行任务
//任务的并发控制或者说管理工具 AsyncQueue
const AsyncQueue = require('webpack/lib/util/AsyncQueue');

function processor(module, callback) {
  //异步是模拟异步创建模块的过程
  setTimeout(() => {
    console.log('process ', module);
    callback(null, { ...module, content: module.key + '内容' });
  }, 3000);
}

const getKey = (module) => module.key;

let queue = new AsyncQueue({
  name: 'createModule', // 队列的名字
  parallelism: 3, // 允许的并发数量
  processor, // 处理模块的方法
  getKey // 通过这个方法获取每个任务唯一标识
});

const start = Date.now();

// 向队列中添加任务
queue.add({ key: 'module1' }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: 'module2' }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: 'module3' }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: 'module4' }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: 'module5' }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
queue.add({ key: 'module1' }, (err, createdModule) => {
  console.log(createdModule);
  console.log((Date.now() - start) / 1000);
});
```

源码：

````javascript
const QUEUED_STATE = 0;//已经 入队，待执行
const PROCESSING_STATE = 1;//处理中
const DONE_STATE = 2;//处理完成
class ArrayQueue {
    constructor() {
        this._list = [];
    }
    enqueue(item) {
        this._list.push(item);//[1,2,3]
    }
    dequeue() {
        return this._list.shift();//移除并返回数组中的第一个元素
    }
}
class AsyncQueueEntry {
    constructor(item, callback) {
        this.item = item;//任务的描述
        this.state = QUEUED_STATE;//这个条目当前的状态
        this.callback = callback;//任务完成的回调
    }
}

class AsyncQueue {
    constructor({ name, parallelism, processor, getKey }) {
        this._name = name;//队列的名字
        this._parallelism = parallelism;//并发执行的任务数
        this._processor = processor;//针对队列中的每个条目执行什么操作
        this._getKey = getKey;//函数，返回一个key用来唯一标识每个元素
        this._entries = new Map();
        this._queued = new ArrayQueue();//将要执行的任务数组队列 
        this._activeTasks = 0;//当前正在执行的数，默认值1
        this._willEnsureProcessing = false;//是否将要开始处理
    }
    add = (item, callback) => {
        const key = this._getKey(item);//获取这个条目对应的key
        const entry = this._entries.get(key);//获取 这个key对应的老的条目
        if (entry !== undefined) {
            if (entry.state === DONE_STATE) {
                process.nextTick(() => callback(entry.error, entry.result));
            } else if (entry.callbacks === undefined) {
                entry.callbacks = [callback];
            } else {
                entry.callbacks.push(callback);
            }
            return;
        }
        const newEntry = new AsyncQueueEntry(item, callback);//创建一个新的条目
        this._entries.set(key, newEntry);//放到_entries
        this._queued.enqueue(newEntry);//把这个新条目放放队列
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing);
        }
    }
    _ensureProcessing = () => {
        //如果当前的激活的或者 说正在执行任务数行小于并发数
        while (this._activeTasks < this._parallelism) {
            const entry = this._queued.dequeue();//出队 先入先出
            if (entry === undefined) break;
            this._activeTasks++;//先让正在执行的任务数++
            entry.state = PROCESSING_STATE;//条目的状态设置为执行中
            this._startProcessing(entry);
        }
        this._willEnsureProcessing = false;
    }
    _startProcessing = (entry) => {
        this._processor(entry.item, (e, r) => {
            this._handleResult(entry, e, r);
        });
    }
    _handleResult = (entry, error, result) => {
        const callback = entry.callback;
        const callbacks = entry.callbacks;
        entry.state = DONE_STATE;//把条目的状态设置为已经完成
        entry.callback = undefined;//把callback
        entry.callbacks = undefined;
        entry.result = result;//把结果赋给entry
        entry.error = error;//把错误对象赋给entry
        callback(error, result);
        if (callbacks !== undefined) {
            for (const callback of callbacks) {
                callback(error, result);
            }
        }
        this._activeTasks--;
        if (this._willEnsureProcessing === false) {
            this._willEnsureProcessing = true;
            setImmediate(this._ensureProcessing);
        }
    }
}
module.exports = AsyncQueue;
````



## webpack 优化

1. 查找模块时，尽量缩小查找范围

   ```javascript
   module.exports = {
       resolve:{
           extensions:['.js','.jsx','.ts','.json'],  // 配置后，在项目中require或import其他模块时，可以省略文件扩展名
           alias:{
           	@:path.resolve(__dirname,'src'),
           	myLib:'具体的库所在目录'
       	},
       
   		modules:['my_modules','node_modules'], // 对于查找第三方库，webpack默认使用nodejs的默认规则，即去node_modules目录中查找，如果自己的库想模拟这个查找路径，就可以在这个字段中配置
       
       	mainFields:['browser', 'module', 'main'], // 默认值，指的是对于引入一个包，查找文件时，依次参考package.json文件中的哪个字段指向的文件
       
       	mainFiles:['index.js'], // 默认值，当目录下没有 package.json 文件时，会默认使用目录下的 index.js 这个文件可以在这里配置
   	},
       
       // resolveLoader 用于配置解析 loader 时的 resolve 配置,默认的配置
       resolveLoader:{
           modules: ['node_modules'],
           extensions: [ '.js', '.json' ],
           mainFields: [ 'loader', 'main' ],
       },
           
       module:{
               // 可以用于配置哪些模块文件的内容不需要进行解析,不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度
               // 一般来说我们拿到模块后要分析里面的依赖的模块import/require
               // 有些模块我们知道它肯定没有依赖别的模块如jquery lodash,所以可以省这一步
               //noParse: /jquery|lodash/, // 正则表达式
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
   
   
   

 IgnorePlugin 的典型使用就是用于忽略 moment 这个包的语言库文件，对于自己需要的语言文件，自己自行单独导入到项目中即可。 

![image-20230502192840848](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230502192840848.png)

```js
import moment from 'moment';
import 'moment/locale/zh-cn'; // 自行导入
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
```



2. 打包耗时分析

   ```js
   const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
   const smw = new SpeedMeasureWebpackPlugin();
   module.exports =smw.wrap({
   	// ...
   });
   ```

3. 打包体积分析

   ```js
   const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
   module.exports = {
     plugins: [new BundleAnalyzerPlugin()]
   };
   ```



## webpack 构建库

- webpack的配置文件中的output对象中的library选项允许将模块导出的内容作为库（library）暴露给外部使用
- `library`属性用于指定库的名称，可以是一个字符串或者一个对象。如果是一个字符串，则将其作为全局变量暴露给浏览器环境。如果是一个对象，则可以在对象中指定library的名称和导出方式等相关选项
- `libraryExport`属性用于指定要导出的内容，可以是一个字符串、一个字符串数组或者一个对象。如果是一个字符串，则将该字符串指定的导出内容暴露给外部使用。如果是一个字符串数组，则将数组中指定的导出内容暴露给外部使用。如果是一个对象，则可以在对象中指定要导出的内容和导出方式等相关选项
- libraryTarget属性用于指定库的导出方式，可以是以下值之一：
  - `var`：将库导出为一个变量，该变量在全局作用域下可用
  - `assign`：将库导出为一个变量，该变量在全局作用域下可用，但可以被其他库或模块覆盖
  - `this`：将库导出为一个变量，该变量在this对象下可用
  - `window`：将库导出为一个变量，该变量在window对象下可用（仅在浏览器环境下有效）
  - `global`：将库导出为一个变量，该变量在global对象下可用（仅在Node.js环境下有效）
  - `commonjs`：将库导出为一个CommonJS模块，该模块在Node.js环境下可用
  - `commonjs2`：将库导出为一个CommonJS2模块，该模块在Node.js环境下可用
  - `amd`：将库导出为一个AMD模块，该模块在浏览器环境下可用
  - `umd`：将库导出为一个UMD模块，该模块既可在浏览器环境下，也可在Node.js环境下使用



- [output librarytarget](https://webpack.js.org/configuration/output/#outputlibrarytarget)
- 在使用 webpack 编写自己开发的库给别人使用时，需要配置这个字段中的值
- 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到
- `output.library` 配置导出库的名称
- `output.libraryExport` 配置要导出的模块中哪些子模块需要被导出。 它只有在 output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
- `output.libraryTarget` 配置以何种方式导出库,是字符串的枚举类型，支持以下配置

| libraryTarget | 使用者的引入方式                      | 使用者提供给被使用者的模块的方式         |
| :------------ | :------------------------------------ | :--------------------------------------- |
| var           | 只能以 script 标签的形式引入我们的库  | 只能以全局变量的形式提供这些被依赖的模块 |
| commonjs      | 只能按照 commonjs 的规范引入我们的库  | 被依赖模块需要按照 commonjs 规范引入     |
| commonjs2     | 只能按照 commonjs2 的规范引入我们的库 | 被依赖模块需要按照 commonjs2 规范引入    |
| amd           | 只能按 amd 规范引入                   | 被依赖的模块需要按照 amd 规范引入        |
| this          |                                       |                                          |
| window        |                                       |                                          |
| global        |                                       |                                          |
| umd           | 可以用 script、commonjs、amd 引入     | 按对应的方式引入                         |

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    library: 'myTools',
    libraryTarget: 'var'
  }
};
```



现代化的npm包都会打包输出多种模块化规范的文件

webpack目前不支持打包成esmodule格式的库。

```js
const path = require('path');
const {merge} = require('webpack-merge');

const baseConfig = {
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
    externals:[
        //nodeExternals()  //排除所有的第三方模块，就是把node_modules里的模块全部设置为外部模块
    ],
    output:{
        //library:'math',
        //libraryExport:'add',
        clean:true
    },
}

module.exports = [
    merge(baseConfig,{
        output:{
            filename:'[name]-window.js',
            libraryTarget:'window'
        }
    }), 
    merge(baseConfig,{
        output:{
            filename:'[name]-commonjs.js',
            libraryTarget:'commonjs2'
        }
    }),  
    merge(baseConfig,{
        output:{
            filename:'[name]-umd.js',
            libraryTarget:'umd'
        }
    }), 
    merge(baseConfig,{
        output:{
            filename:'[name]-amd.js',
            libraryTarget:'amd'
        }
    }) 
]
```





**externals**

一般编写一个库的时候，自己的项目中并不要打包第三方依赖到自己最后打包的文件中，而是在package.json中通过同等依赖配置项来进行设置。在用户安装了自己的包之后，直接使用用户项目环境中安装的同等依赖包。

- `externals`选项用于指定哪些模块应该被视为外部模块，不应该被打包进输出的bundle中
- externals选项可以是一个对象、一个字符串、一个正则表达式或者一个函数
  - 如果是一个字符串，则表示要排除的模块名称
  - 如果是一个正则表达式，则表示要排除的模块名称与该正则表达式匹配的所有模块。
  - 如果是一个函数，则在函数中可以自定义判断哪些模块应该被排除在打包之外，需要返回一个布尔值来表示是否排除该模块
- 如果是一个对象，该对象的键表示要排除的模块名称，值表示在哪种环境下使用该模块。可以指定`commonjs`、`commonjs2`、`amd`或者`root`等选项来指定在不同的环境下使用该模块时的名称

![image-20241227191314855](D:\learn-notes\工程化\images\image-20241227191314855.png)

如果依赖了很多第三方模块，可以使用webpack-node-externals插件即可。

```json
externals: [
    nodeExternals()
],
```

- `webpack-node-externals`是一个npm包，它可以帮助排除Node.js应用程序中不需要打包的第三方模块。与webpack的externals选项类似，webpack-node-externals也可以将指定的模块排除在webpack打包之外，从而减小输出的bundle体积，提高应用程序的加载速度
- `nodeExternals`函数将返回一个排除所有`node_modules`中的模块的externals对象。这样，所有的`node_modules`中的模块都将被排除在webpack打包之外



## 提取 CSS

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
+      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
+      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] },
+      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
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

- [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)是一个优化和压缩 CSS 资源的插件
- [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin)是一个优化和压缩 JS 资源的插件

```diff
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
+ const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
+ const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
+  mode: 'none',   // 如果mode是production,会自动启用压缩插件,如果配置为none表示不会启用压缩插件，但可以自己配
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
          filename:'images/[contenthash][ext]'
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

- HTML 文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的 URL 变成指向 CDN 服务器的地址
- 静态的 JavaScript、CSS、图片等文件开启 CDN 和缓存，并且文件名带上 HASH 值
- 为了并行加载不阻塞，把不同的静态资源分配到不同的 CDN 服务器上
- 可以通过在 HTML HEAD 标签中 加入`<link rel="dns-prefetch" href="http://img.zhufengpeixun.cn">`去预解析域名，以降低域名解析带来的延迟



## 文件指纹

- 打包后输出的文件名和后缀
- hash 一般是结合 CDN 缓存来使用，通过 webpack 构建之后，生成对应文件名自动带上对应的 MD5 值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。
- **如果 webpack 打包时任何文件都没有变动，则本次打包的 hash 和上一次的 hash 一样**

指纹占位符

| 占位符名称  | 含义                                                               |
| :---------- | :----------------------------------------------------------------- |
| ext         | 资源后缀名                                                         |
| name        | 文件名称                                                           |
| path        | 文件的相对路径                                                     |
| folder      | 文件所在的文件夹                                                   |
| hash        | 每次 webpack 构建时生成一个唯一的 hash 值                          |
| chunkhash   | 根据 chunk 生成 hash 值，来源于同一个 chunk，则 chunkhash 值就一样 |
| contenthash | 根据内容生成 hash 值，文件内容相同 hash 值就相同                   |

- hash：每次构建项目生成的唯一hash值，所有文件共享同一个hash值。只要项目文件有任何改变，整个项目的hash值都会改变。因此，如果你使用了hash并且只是改变了项目中的一个文件，所有文件都会生成一个新的hash，这将导致客户端需要重新下载所有文件，即使大部分文件实际上并未改变。

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

- chunkhash：它根据不同的入口文件(Entry)或者不同的chunk进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着采用 chunkhash 的方式生成哈希值，那么只要不改动公共库的代码，就可以保证其哈希值不会受影响。
  只有所属chunk的内容改变时，hash值才会改变。这就意味着，如果你在项目中改变了一个文件，只有这个文件所在的chunk的hash值会改变，其他的chunk不会改变。这实际上可以让客户端只下载改变了的文件，而不是所有文件。

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

- contenthash：使用 chunkhash 存在一个问题，就是当在一个 JS 文件中引入 CSS 文件，编译后它们的 chunkhash 是相同的，而且只要 js 文件发生改变 ，关联的 css 文件 chunkhash 也会改变，这个时候可以使用`mini-css-extract-plugin`里的`contenthash`值，保证即使 css 文件所处的模块里就算其他文件内容改变，只要 css 文件内容不变，那么不会重复构建

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

打包后的内容上传到自己的服务器后，CDN 服务器并不会主动请求我们的服务器以更新最新的资源文件，但可以开发一个插件，将打包后的文件自动推送到 CDN 服务器上。



不同 hash 的特点：

![variableHash](http://img.zhufengpeixun.com/variableHash.jpg)

```js
function createHash() {
  return require('crypto').createHash('md5');
}

// 两个入口文件
let entry = {
  entry1: 'entry1',
  entry2: 'entry2'
};

// 两个文件内部的具体内容
let entry1 = "requir('depModule1')"; //模块entry1
let entry2 = "require('depModule2')"; //模块entry2

// 两个入口文件分别依赖的模块文件中的内容
let depModule1 = 'depModule1'; //模块depModule1
let depModule2 = 'depModule2'; //模块depModule2

//如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效
let hash = createHash()
  .update('entry1ID') // 并不是使用的模块文件中的内容生成hash，而是使用的模块的id名字来生成hash，一旦有文件变化，这个模块ID就会变化
  .update('entry2ID')
  .update('depModule1ID')
  .update('depModule2ID')
  .digest('hex');
console.log('hash', hash);

//chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
//在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着采用chunkhash的方式生成哈希值，那么只要不改动公共库的代码，就可以保证其哈希值不会受影响
let entry1ChunkHash = createHash().update('entry1ID').update('depModule1ID').digest('hex');
console.log('entry1ChunkHash', entry1ChunkHash);

let entry2ChunkHash = createHash().update('entry2ID').update('depModule2ID').digest('hex');
console.log('entry2ChunkHash', entry2ChunkHash);

let entry1ContentHash = createHash().update(entry1).update(depModule1).digest('hex');
console.log('entry1ContentHash', entry1ContentHash);

let entry2File = entry2 + depModule2;
let entry2ContentHash = createHash().update(entry2File).digest('hex');
console.log('entry2ContentHash', entry2ContentHash);
```



自己写的修改 hash 的 plugin：

```js
class HashPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('HashPlugin', (compilation, params) => {
      //如果你想改变hash值，可以在hash生成这后修改
      compilation.hooks.afterHash.tap('HashPlugin', () => {
        let fullhash = 'fullhash'; //时间戳
        console.log('本次编译的compilation.hash', compilation.hash);
        compilation.hash = fullhash; //output.filename [fullhash]
        for (let chunk of compilation.chunks) {
          console.log('chunk.hash', chunk.hash);
          chunk.renderedHash = 'chunkHash'; //可以改变chunkhash  renderedHash就是chunkhash
          console.log('chunk.contentHash', chunk.contentHash);
          chunk.contentHash = {
            javascript: 'javascriptContentHash',
            'css/mini-extract': 'cssContentHash'
          };
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



## moduleIds & chunkIds 的优化

- module: 每一个文件(js,css,jpg,字体等)其实都可以看成一个 module
- chunk: webpack 打包最终的代码块，代码块会生成文件，一个 chunk对应一个文件，同时每个entry入口都会对应一个chunk，一个chunk都会对应的一个文件。但是反之，一个文件并不一定都是根据entry来生成的，有可能是import动态导入导致代码分割生成的文件 
- 在 webpack5 之前，不是根据 entry 配置打包生成的 chunk 文件（**通过 import 方法动态导入的模块**），都会以 1、2、3...的文件命名方式输出，删除某些文件可能会导致缓存失效
- 在生产模式下，默认启用这些功能 chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用`确定性`的方式将短数字 ID(3 或 4 个字符)，短 hash 值分配给 modules 和 chunks
- chunkId 设置为 deterministic，则 output 中 chunkFilename 里的[name]会被替换成确定性短数字 ID
- 虽然 chunkId 不变(不管值是 deterministic | natural | named)，但更改 chunk 内容，chunkhash 还是会改变的

| 可选值                  | 含义                           | 示例          |
| :---------------------- | :----------------------------- | :------------ |
| natural（默认值）自然数 | 按使用顺序的数字 ID            | 1             |
| named                   | 方便调试的高可读性 id          | src_two_js.js |
| deterministic           | 根据模块名称生成简短的 hash 值 | 915           |
| size                    | 根据模块大小生成的数字 id      | 0             |

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



one.js

```js
export default 'one'
```

two和three的文件内容和one类似。



在webpack的配置文件中：

```js
+   optimization:{
+       moduleIds:'natural',
+       chunkIds:'natural'
+   }
```

打包后生成的文件的名字如下（以前默认就是natural）：

![image-20241104145153320](D:\learn-notes\工程化\images\image-20241104145153320.png)

采用natural的缺点：

如果代码中移除了two的依赖，那么原来的three就会变成新的2，如果在没有采用hash或者chunkhash等的情况下，会导致文件的缓存失效。



在webpack的配置文件中：

```js
+   optimization:{
+       moduleIds:'deterministic',
+       chunkIds:'deterministic'
+   }
```

打包后生成的文件的名字如下（现在默认就是deterministic）：

![image-20241104145716760](D:\learn-notes\工程化\images\image-20241104145716760.png)

那么在这种情况下，如果源码中再次移除two，这时，打包后的结果，one和three对应仍然是原来的文件名而没有改变。

![image-20241104145858973](D:\learn-notes\工程化\images\image-20241104145858973.png)

这样就能长期缓存。

如果想把动态加载的多个模块根据需要合并为一个文件，那就需要借助splitChunksPlugin配置来实现。





实现微前端的方式：

1. iframe
2. qiankun
3. 模块联邦

## 模块联邦

一般用于实现微前端。 典型的产品：qiankun。

- Module Federation 的动机是为了不同开发小组间共同开发一个或者多个应用

- 应用将被划分为更小的应用块，一个应用块，可以是比如头部导航或者侧边栏的前端组件，也可以是数据获取逻辑的逻辑组件
- 每个应用块由不同的组开发
- 应用或应用块共享其他其他应用块或者库

- **使用 Module Federation 时，每个应用块都是一个独立的构建，有自己的打包配置，这些构建都将编译为容器**
- 容器可以被其他应用或者其他容器应用
- 一个被引用的容器被称为 remote，引用者被称为 host ， remote 暴露模块给 host，host 则可以使用这些暴露的模块，这些模块被成为 remote 模块

![image-20230503091426077](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230503091426077.png)

**模块联邦必须异步导入（ import('xxxx.js') ）。**

使用了模块联邦后的项目，不同的容器项目可以选择不同的技术栈，但是可能比较难进行不同应用块之间的组件间通信，但是必须都依赖于 webpack5。

| 字段     | 类型   | 含义                                                                   |
| -------- | ------ | ---------------------------------------------------------------------- |
| name     | string | 必传值，即输出的模块名，被远程引用时路径为${name}/${expose}            |
| library  | object | 声明全局变量的方式，name 为 umd 的 name                                |
| filename | string | 构建输出的文件名                                                       |
| remotes  | object | 远程引用的应用名及其别名的映射，使用时以 key 值作为 name               |
| exposes  | object | 被远程引用时可暴露的资源路径及其别名                                   |
| shared   | object | 与其他应用之间可以共享的第三方依赖，使你的代码中不用重复加载同一份依赖 |





## 代码分割

### **方式一**

通过配置 entry 为多个入口实现代码分割，每个入口和它的依赖都会生成一个代码块而生成单独的文件

这种方式的不足：

1. 不够灵活，一个入口对应一个代码块，对应一个文件，不能将核心的应用程序进行拆分
2. 如果入口 chunks 之间包含重复的模块(如：lodash)，那些重复模块都会被引入到各自生成的文件中

```js
{
  entry: {
    entry1: "./src/entry1.js",
    entry2: "./src/entry2.js",
  },
}
```

entry1.js 和 entry.js 代码：

```js
const title = require('./title');
console.log(title);
```

title.js:

```js
module.exports = 'title';
```

打包生成两个文件 entry1.js 和 entry2.js，它们内部都有以下代码段：

```js
var webpackModules = {
  './src/title.js': (module) => {
    module.exports = 'title';
  }
};
```

html 中：

```html
<script defer src="entry1.js"></script>
<script defer src="entry2.js"></script>
```



### **方式二**

动态导入和懒加载。

import()是一个 JS 语法，webpack 在打包编译的时候，如果遇到 import 语法会把它转换成 require.e，require.e 是通过动态创建 script 标签实现的。

- 用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载，在给单页应用做按需加载优化时
- 一般采用以下原则：
  - 对网站功能进行划分，每一类一个 chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
  - 被分割出去的代码需要一个按需加载的时机

webpack.config.js：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    clean: true
  },
  mode: 'development',
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

video.js，假设这个文件非常大

```js
module.exports = 'video';
```

index.js

```js
document.getElementById('btn').addEventListener('click', function () {
  import('./video').then((result) => {
    console.log(result);
  });
});
```

index.html

```html
<button id="play">播放</button>
```

以上面的代码打包后，生成文件放到浏览器中运行时，浏览器先请求 html 文件，html 文件内容有如下代码段：

```html
<script defer src="main.js"></script></head>
<body>
  <div id="btn">按钮</div>
</body>
```

这会再去请求 main.js 文件，该文件请求回来后进行执行，给 button 绑定上 click 事件，但是因为没有触发该点击事件，所以不会自动的去加载对应的懒加载文件，当点击后才会发起网络请求并加载对应的文件。

点击按钮前的网络面板请求面板如下：

![image-20230522224854354](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230522224854354.png)

点击按钮后，网络面板如下：

![image-20230522224927703](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230522224927703.png)



**与方式二相关的 preload 和 prefetch**

import(/\*_ webpackPreload:true _/ "./video")中的即使使用了魔法注释也不会生效，必须配置一个插件才行。`@vue/preload-webpack-plugin `。

![image-20241104195759783](D:\learn-notes\工程化\images\image-20241104195759783.png)

为什么配置了 webpackPreload:true没有效果？

如果想一个script脚本设置为preload，预先拉取，它的优先级是非常高的，它应该和main.js并行加载，所以说不可能把插preload的link标签的操作动作放在main.js里面执行，只能把这个工作交给html-webpack-plugin，动态的向html文件里插入链接。

为了能尽快的加载需要的文件（比如加载完主要文件后，自动去加载一些懒加载文件，不用点击按钮再加载那些懒加载文件），这是就需要使用 prefetch 或者 preload 解决方案了。具体如下：

```shell
npm install @vue/preload-webpack-plugin -D
```

以前的就包名叫： webpackpreload-webpack-plugin。@vue/preload-webpack-plugin 则是新包名。

**preload**

- preload 通常用于本页面要用到的关键资源，包括关键 js、字体、css 文件，需要preload的资源会在加载到html文件后，和其他通过script引入的脚本有一样的优先级，并行加载
- preload 将会把资源的下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度
- 在资源上添加预先加载的注释，你指明该模块需要立即被使用
- 一个资源的加载的优先级被分为五个级别,分别是
  - Highest 最高
  - High 高
  - Medium 中等
  - Low 低
  - Lowest 最低
- 未作 preload 或者 prefetch 处理的异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 `Low`
- [link-rel-prefetch-preload-in-webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
- [Support for webpackPrefetch and webpackPreload](https://github.com/jantimon/html-webpack-plugin/issues/1317)
- [preload-webpack-plugin](https://www.npmjs.com/package/@vue/preload-webpack-plugin)
- [webpackpreload-webpack-plugin](https://www.npmjs.com/package/webpackpreload-webpack-plugin)
- [ImportPlugin.js](https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/dependencies/ImportParserPlugin.js#L108-L121)

![prefetchpreload](http://img.zhufengpeixun.cn/prefetchpreload.png)

webpack.config.js：

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
  output: {
    clean: true,
  },
  mode: "development",
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
+    new PreloadWebpackPlugin(),
  ],
};
```

index.js：

```js
document.getElementById('btn').addEventListener('click', function () {
  import('./video').then((result) => {
    console.log(result);
  });
});
```

其他的 video.js，html 模板文件都没变。

执行打包操作后生成的 html 文件中有如下代码段：

```html
<head>
	<script defer src="main.js"></script>
  <link href="src_video_js.js" rel="preload" as="script"></link>  // 多出了这行预加载代码，这就是那个插件的原理
</head>

<body>
  <div id="btn">按钮</div>
</body>
```

项目在浏览器中打开后，网络面板的情况：

![image-20230522230333865](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230522230333865.png)

可以看到，在没有点击按钮的情况下，懒加载文件就被预先加载到本地了，但是按钮的点击事件并没有执行，控制台并没有打印内容，当点击按钮后，没有再发起网络情况，而直接打印了懒加载文件的内容。这就加速的资源文件的获取速度，实现的想要的目的。

**自行实现@vue/preload-webpack-plugin 插件，完全一摸一样的实现。该插件不会去读取 import 函数中编写的魔法注释，只要是 import 方法加载的模块，都会自动加上其对应`<link href="moduleID.js" rel="preload" as="script">`**

```js
/**
 * 原理和思路
 * 此插件会查找本项目中所有的异步代码块，
 * 把这些异步代码块对应的JS文件都添加一个link标签, <link href="moduleID.js" rel="preload" as="script">
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

class PreloadWebpackPlugin {
  constructor() {}
  apply(compiler) {
    // 监听compilation钩子，获取compilation对象
    compiler.hooks.compilation.tap('PreloadWebpackPlugin', function (compilation) {
      // 获取HtmlWebpackPlugin向compilation添加的钩子,alterAssetTags
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
        'PreloadWebpackPlugin',
        (htmlData) => {
          const { chunks } = compilation;   // chunks表示编译得到的所有代码块
          const files = chunks
            .filter((chunk) => !chunk.canBeInitial())  // chunk.canBeInitial()表示是否是同步引入的模块
            .reduce((files, chunk) => {
              return files.add(...chunk.files);
            }, new Set());
          files.forEach((file) => {
            htmlData.assetTags.styles.unshift({
              tagName: 'link',
              attributes: {
                rel: 'preload',
                href: file
              }
            });
          });
        }
      );
    });
  }
}

module.exports = PreloadWebpackPlugin;
```

从插件的源码可以得到 preload 的原理是在 webpack 打包阶段就将所有的异步加载的文件，生成一一对应的`<link href="moduleID.js" rel="preload" as="script">`，然后直接添加html的到 head 标签中。当浏览器一加载到 index.html 中，在解析 link 标签时就会直接去**阻塞加载并执行**对应的脚本文件。

preload 不是 webpack 原生支持的，必须安装对应的插件，并且该插件**不会**根据 webpack 魔法注释来设置指定脚本的 preload，而是直接将项目中所有的异步加载脚本都 preload，所以需要慎用。



https://webpack.docschina.org/api/module-methods#magic-comments

```js
// 单个目标
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackExports: ["default", "named"] */
  'module'
);

// 多个可能的目标
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  `./locale/${language}`
);
```



https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules

**prefetch(预先拉取)**

- prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在**闲时**（就是脚本执行完后）去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源
- prefetch 魔法注释是 webpack 原生就支持的，不需要配置任何插件，而且 webpack 对于`/* webpackPrefetch:true */`魔法注释是能识别的，只有加了`/* webpackPrefetch:true */`的脚本才会有 prefetch 的效果
- ==prefetch 的原理是，在**打包的脚本中动态**的为需要 prefetch 的脚本创建 link 标签`<link rel="prefetch" as="script" href="url/moduleID">`并添加到 head 中，并不是在 webpack 打包阶段就创建并加入到 index.html 中==

**prefetch 实例**

index.js:

```js
document.getElementById('btn').addEventListener('click', function () {
  // 一个有prefetch魔法注释，一个没有
  import(/* webpackPrefetch:true  */ './video').then((result) => {
    console.log(result);
  });
  import('./title').then((result) => {
    console.log(result);
  });
});
```

title.js 和 video.js：

```js
export default "title";


export default "video.js";
```

index.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="btn">按钮</div>
  </body>
</html>
```

webpack.config.js：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    clean: true
  },
  mode: 'development',
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};
```

打包后生成结果：

![image-20230523103333835](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523103333835.png)

index.html：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script defer src="main.js"></script>
  </head>
  <body>
    <div id="btn">按钮</div>
  </body>
</html>
```

main.js:

```js
var webpackModules = {};
var webpackModuleCache = {};
function webpackRequire(moduleId) {
  var cachedModule = webpackModuleCache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (webpackModuleCache[moduleId] = {
    exports: {}
  });
  webpackModules[moduleId](module, module.exports, webpackRequire);
  return module.exports;
}
webpackRequire.m = webpackModules;

var deferred = [];
webpackRequire.O = (result, chunkIds, fn, priority) => {
  if (chunkIds) {
    priority = priority || 0;
    for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--)
      deferred[i] = deferred[i - 1];
    deferred[i] = [chunkIds, fn, priority];
    return;
  }
  var notFulfilled = Infinity;
  for (var i = 0; i < deferred.length; i++) {
    var [chunkIds, fn, priority] = deferred[i];
    var fulfilled = true;
    for (var j = 0; j < chunkIds.length; j++) {
      if (
        (priority & (1 === 0) || notFulfilled >= priority) &&
        Object.keys(webpackRequire.O).every((key) => webpackRequire.O[key](chunkIds[j]))
      ) {
        chunkIds.splice(j--, 1);
      } else {
        fulfilled = false;
        if (priority < notFulfilled) notFulfilled = priority;
      }
    }
    if (fulfilled) {
      deferred.splice(i--, 1);
      var r = fn();
      if (r !== undefined) result = r;
    }
  }
  return result;
};

webpackRequire.F = {};
webpackRequire.E = (chunkId) => {
  Object.keys(webpackRequire.F).map((key) => {
    webpackRequire.F[key](chunkId);
  });
};

var getProto = Object.getPrototypeOf ? (obj) => Object.getPrototypeOf(obj) : (obj) => obj.proto;
var leafPrototypes;
webpackRequire.t = function (value, mode) {
  if (mode & 1) value = this(value);
  if (mode & 8) return value;
  if (typeof value === 'object' && value) {
    if (mode & 4 && value.esmodule) return value;
    if (mode & 16 && typeof value.then === 'function') return value;
  }
  var ns = Object.create(null);
  webpackRequire.r(ns);
  var def = {};
  leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
  for (
    var current = mode & 2 && value;
    typeof current == 'object' && !~leafPrototypes.indexOf(current);
    current = getProto(current)
  ) {
    Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => value[key]));
  }
  def['default'] = () => value;
  webpackRequire.d(ns, def);
  return ns;
};

webpackRequire.d = (exports, definition) => {
  for (var key in definition) {
    if (webpackRequire.o(definition, key) && !webpackRequire.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  }
};

webpackRequire.f = {};
webpackRequire.e = (chunkId) => {
  return Promise.all(
    Object.keys(webpackRequire.f).reduce((promises, key) => {
      webpackRequire.f[key](chunkId, promises);
      return promises;
    }, [])
  );
};

webpackRequire.u = (chunkId) => {
  return '' + chunkId + '.js';
};

webpackRequire.g = (function () {
  if (typeof globalThis === 'object') return globalThis;
  try {
    return this || new Function('return this')();
  } catch (e) {
    if (typeof window === 'object') return window;
  }
})();

webpackRequire.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

var inProgress = {};
var dataWebpackPrefix = '01split:';
webpackRequire.l = (url, done, key, chunkId) => {
  if (inProgress[url]) {
    inProgress[url].push(done);
    return;
  }
  var script, needAttach;
  if (key !== undefined) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      if (
        s.getAttribute('src') == url ||
        s.getAttribute('data-webpack') == dataWebpackPrefix + key
      ) {
        script = s;
        break;
      }
    }
  }
  if (!script) {
    needAttach = true;
    script = document.createElement('script');
    script.charset = 'utf-8';
    script.timeout = 120;
    if (webpackRequire.nc) {
      script.setAttribute('nonce', webpackRequire.nc);
    }
    script.setAttribute('data-webpack', dataWebpackPrefix + key);
    script.src = url;
  }
  inProgress[url] = [done];
  var onScriptComplete = (prev, event) => {
    script.onerror = script.onload = null;
    clearTimeout(timeout);
    var doneFns = inProgress[url];
    delete inProgress[url];
    script.parentNode && script.parentNode.removeChild(script);
    doneFns && doneFns.forEach((fn) => fn(event));
    if (prev) return prev(event);
  };
  var timeout = setTimeout(
    onScriptComplete.bind(null, undefined, {
      type: 'timeout',
      target: script
    }),
    120000
  );
  script.onerror = onScriptComplete.bind(null, script.onerror);
  script.onload = onScriptComplete.bind(null, script.onload);
  needAttach && document.head.appendChild(script);
};

webpackRequire.r = (exports) => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    });
  }
  Object.defineProperty(exports, 'esmodule', {
    value: true
  });
};

var scriptUrl;
if (webpackRequire.g.importScripts) scriptUrl = webpackRequire.g.location + '';
var document = webpackRequire.g.document;
if (!scriptUrl && document) {
  if (document.currentScript) scriptUrl = document.currentScript.src;
  if (!scriptUrl) {
    var scripts = document.getElementsByTagName('script');
    if (scripts.length) {
      var i = scripts.length - 1;
      while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
    }
  }
}
if (!scriptUrl) throw new Error('Automatic publicPath is not supported in this browser');
scriptUrl = scriptUrl
  .replace(/#.*$/, '')
  .replace(/\?.*$/, '')
  .replace(/\/[^\/]+$/, '/');
webpackRequire.p = scriptUrl;

var installedChunks = {
  main: 0
};
webpackRequire.f.j = (chunkId, promises) => {
  var installedChunkData = webpackRequire.o(installedChunks, chunkId)
    ? installedChunks[chunkId]
    : undefined;
  if (installedChunkData !== 0) {
    if (installedChunkData) {
      promises.push(installedChunkData[2]);
    } else {
      if (true) {
        var promise = new Promise(
          (resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject])
        );
        promises.push((installedChunkData[2] = promise));
        var url = webpackRequire.p + webpackRequire.u(chunkId);
        var error = new Error();
        var loadingEnded = (event) => {
          if (webpackRequire.o(installedChunks, chunkId)) {
            installedChunkData = installedChunks[chunkId];
            if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
            if (installedChunkData) {
              var errorType = event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message =
                'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              installedChunkData[1](error);
            }
          }
        };
        webpackRequire.l(url, loadingEnded, 'chunk-' + chunkId, chunkId);
      }
    }
  }
};
webpackRequire.F.j = (chunkId) => {
  if (
    (!webpackRequire.o(installedChunks, chunkId) || installedChunks[chunkId] === undefined) &&
    true
  ) {
    installedChunks[chunkId] = null;
    var link = document.createElement('link');
    if (webpackRequire.nc) {
      link.setAttribute('nonce', webpackRequire.nc);
    }
    link.rel = 'prefetch';   // 本行就体现了prefetch的具体原理
    link.as = 'script';   
    link.href = webpackRequire.p + webpackRequire.u(chunkId);
    document.head.appendChild(link);
  }
};
webpackRequire.O.j = (chunkId) => installedChunks[chunkId] === 0;
var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
  var [chunkIds, moreModules, runtime] = data;
  var moduleId,
    chunkId,
    i = 0;
  if (chunkIds.some((id) => installedChunks[id] !== 0)) {
    for (moduleId in moreModules) {
      if (webpackRequire.o(moreModules, moduleId)) {
        webpackRequire.m[moduleId] = moreModules[moduleId];
      }
    }
    if (runtime) var result = runtime(webpackRequire);
  }
  if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (webpackRequire.o(installedChunks, chunkId) && installedChunks[chunkId]) {
      installedChunks[chunkId][0]();
    }
    installedChunks[chunkId] = 0;
  }
  return webpackRequire.O(result);
};
var chunkLoadingGlobal = (self['webpackChunk_01split'] = self['webpackChunk_01split'] || []);
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(
  null,
  chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
);

webpackRequire.O(
  0,
  ['main'],
  () => {
    webpackRequire.E('src_video_js');
  },
  5
);

var webpackExports = {};
document.getElementById('btn').addEventListener('click', function () {
  webpackRequire
    .e('src_video_js')
    .then(webpackRequire.t.bind(webpackRequire, './src/video.js', 23))
    .then((result) => {
      console.log(result);
    });
  webpackRequire
    .e('src_title_js')
    .then(webpackRequire.bind(webpackRequire, './src/title.js'))
    .then((result) => {
      console.log(result);
    });
});
webpackExports = webpackRequire.O(webpackExports);
```

其中 main.js 中有段代码如下：

```js
webpackRequire.F.j = (chunkId) => {
  if (
    (!webpackRequire.o(installedChunks, chunkId) || installedChunks[chunkId] === undefined) &&
    true
  ) {
    installedChunks[chunkId] = null;
    var link = document.createElement('link');
    if (webpackRequire.nc) {
      link.setAttribute('nonce', webpackRequire.nc);
    }
    link.rel = 'prefetch'; // ++++++++++++++++++++++++++++
    link.as = 'script'; // ++++++++++++++++++++++++++++
    link.href = webpackRequire.p + webpackRequire.u(chunkId);
    document.head.appendChild(link);
  }
};
```

从这段代码就能看出 prefetch 的工作原理和 preload 的不同了。prefetch是在加载main并执行的时候采取通过js去创建link标签并加载需要prefetch的文件的，而preload则是直接通过html-webpack-plugin这个插件直接生成对应的link标签来预先加载对应的文件的。

![image-20231209103803358](.\images\image-20231209103803358.png)

当打开 index.html 时，网络面板的情况：

![image-20230523104427230](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523104427230.png)

当点击按钮后，网络面板的情况：

![image-20230523104535086](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523104535086.png)

video.js 因为 prefetch 而直接走本地缓存了，而 title.js 因为没有配置 prefetch，所以走的是网络请求。

**prefetch 和 preload 混用的情况**

![image-20230523110716387](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523110716387.png)

![image-20230523111357293](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523111357293.png)

对于@vue/preload-webpack-plugin 插件，即使不写了 preload 的魔法注释也会生效，默认还是将全部懒加载的模块都设置为 preload。这样所有懒加载资源优先级都提高了很多，存在隐患。（如果想一个 script 脚本设置为 preload，预先拉取，他的优先级是非常高的，它应该和 main.js 并行加载，所以说不可能把插件 preload 脚本的的动作放在 main.js 里面执行时加载，只能把这个工作交给 html-webpack-plugin,动态的向 html 文件里插入链接）。



为了解决 preload 无法生效的问题，自己写了一个插件：webpackpreload-webpack-plugin。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPreloadWebpackPlugin = require('webpackpreload-webpack-plugin');

module.exports = {
  output: {
    clean: true
  },
  mode: 'development',
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new WebpackPreloadWebpackPlugin()
  ]
};
```

webpackpreload-webpack-plugin：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
class WebpackpreloadWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('PreloadWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(
        'PreloadWebpackPlugin',
        (htmlData) => {
          const { publicPath, assetTags } = htmlData;
          const { entrypoints, moduleGraph, chunkGraph } = compilation;
          for (const entrypoint of entrypoints) {
            // webpack内部已经识别好魔法注释中的prefetch和preload了，并将preload放置在getChildrenByOrders方法的返回值中了
            const preloaded = entrypoint[1].getChildrenByOrders(moduleGraph, chunkGraph).preload; // is ChunkGroup[] | undefined
            if (!preloaded) return;
            const chunks = new Set();
            for (const group of preloaded) {
              for (const chunk of group.chunks) chunks.add(chunk);
            }
            const files = new Set();
            for (const chunk of chunks) {
              for (const file of chunk.files) files.add(file);
            }
            const links = [];
            for (const file of files) {
              links.push({
                tagName: 'link',
                attributes: {
                  rel: 'preload',
                  href: `${publicPath}${file}`
                }
              });
            }
            assetTags.styles.unshift(...links);
          }
        }
      );
    });
  }
}
module.exports = WebpackpreloadWebpackPlugin;
```

webpack 获取到源代码后，将源代码转为语法树进行遍历，遍历时捕获 import 节点，内部会自行识别魔法注释。

plugins\ImportPlugin.js：

```js
class ImportPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('ImportPlugin', (compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.parser.for('javascript/auto').tap('ImportPlugin', (parser) => {
        parser.hooks.importCall.tap('ImportParserPlugin', (expr) => {
          const { options } = parser.parseCommentOptions(expr.range);
          console.log(options);
        });
      });
    });
  }
}
module.exports = ImportPlugin;
```

这个 webpack 插件的作用是为了解析 JavaScript 源代码中的 import 语句，并且提取出注释中的选项信息。

具体来说，该插件在 Webpack 编译过程中的"compilation"阶段，注册了一个钩子函数用于处理普通模块工厂(normalModuleFactory)中的 JavaScript 模块。当解析 JavaScript 源代码时，该插件会在 import 调用的语法树节点中注册一个钩子函数，用于解析注释中的选项信息，并将其输出到控制台中。

因此，这个插件的作用并不是修改代码的行为，而是提供了一种在 Webpack 编译过程中对代码进行静态分析的方式，以便于进行代码构建和优化。



###  方式三

**提取公共代码**

- [split-chunks-plugin](https://webpack.js.org/plugins/split-chunks-plugin)
- [split-chunks-plugin](https://webpack.docschina.org/plugins/split-chunks-plugin/)
- [common-chunk-and-vendor-chunk](https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk)
- 配置单页应用，配置多页应用

**为什么需要提取公共代码**

- 大网站有多个页面，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题
- 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
- 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

**如何提取**

- 基础类库，方便长期缓存
- 页面之间的公用代码
- 各个页面单独生成文件

**module chunk bundle**

- module：就是 js 的模块化（一个文件就是一个模块），webpack 支持 commonJS、ES6 等模块化规范
- chunk: chunk 是 webpack 根据功能拆分出来的，包含三种情况
  - 项目入口（entry）
  - 通过 import()动态引入的代码
  - 通过 splitChunks 拆分出来的代码
- bundle：bundle 是 webpack 打包之后的各个文件，一般就是和 chunk 是一对一的关系，bundle 就是对 chunk 进行编译压缩打包等处理之后的产出



**splitChunks**

- [split-chunks-plugin](https://webpack.js.org/plugins/split-chunks-plugin)
- 将[optimization.runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk)设置为 true 或 'multiple'，会为每个入口添加一个只含有 runtime 的额外 chunk

![image-20230523223616658](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523223616658.png)

**默认值**

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

webpack 将根据以下条件自动拆分 chunks：

- 新的 chunk 可以被共享，或者模块来自于 `node_modules` 文件夹
- 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
- 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
- 当加载初始化页面时，并发请求的最大数量小于或等于 30

当尝试满足最后两个条件时，最好使用较大的 chunks。

webpack.config.js ：

```js
module.exports = {
  //...
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js',
    page3: './src/page3.js'
  },
  optimization: {
      // 下面是默认的splitChunks
    splitChunks: {
      chunks: 'all', // 默认作用于异步chunk，值为all/initial/async
      minSize: 30000, // 默认值是30kb,代码块的最小尺寸
      minRemainingSize: 0,
      minChunks: 1,   // 表示在提取公共代码的时候，一个模块被多少个入口用入才会进行提取
      maxAsyncRequests: 3,  //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
      maxInitialRequests: 8,  //限制入口的拆分数量
      enforceSizeThreshold: 50000,
      name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      automaticNameDelimiter: "~", //默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
      cacheGroups: {
        // 缓存组 ， 当一个模块命中多个缓存组的规则时，则根据priority的值进行拆包
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 越大，优先级高
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2, // 这里如果配置了，则这里的minChunks会覆盖外层的minChunks
          priority: -20,
          reuseExistingChunk: true
        }
        // .. 其他自定义规则即拆包名字
      }
    },
    //把运行时当成一个代码块进行单独提取
    //runtime 为了让打包后的代码在浏览器里能运行 要模拟一个require方法 这个就叫运行时
    //可以把runtimeChunk设置为true就可以把运行时代码块单独提取，实现长期缓存
    //因为运行时代码只是一个工具代码，跟业务无关，不管你的业务如何写，它始终不变
    runtimeChunk: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'page1.html',
      chunks: ['page1'] // 把page1和page1分拆出去的代码块生成的文件插入此模块
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'page2.html',
      chunks: ['page2']
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'page3.html',
      chunks: ['page3']
    }),
    new webpackPreloadWebpackPlugin(),
    new ImportPlugin(),
    new AssetWebpackPlugin()
  ]
};
```

![image-20230523231023734](webpack-%E5%BC%A0%E4%BB%81%E9%98%B3.images/image-20230523231023734.png)

```js
{
  optimization: {
    //指定代码块的分割方式 表示选择哪些代码块进行分割，async(异步import) initial(同步) all（全部）
    splitChunks: {
      chunks: 'all',
      //表示分割出去的代码块最小的体积 0就是不限制分割出去的代码块的体积
      minSize: 0,
      //加载入口文件时，并行请求的最大数量 默认为5
      maxInitialRequests: 5,//一个chunk最多拆成5个包
      // page1 module1 module2 jquery
      //按需加载文件时，并行请求的最大数量 默认为3
      maxAsyncRequests: 3,
      //表示在提取公共代码的时候，一个模块被多少个入口用入才会进行提取
      minChunks: 2,
          
      //在以前是没有cacheGroups这个概念
      //默认情况下有二个缓存组 defaultVendors default
      cacheGroups: {
        defaultVendors: false,
        default: false,
        xxx: {
          minChunks: 1,//按这个条件，如果一个模块被 引用了1次以上，就需要被 提取到单独的代码块中
          //需要把index.js提到到common代码块中，提取了以后main里就要删除index.js模块
          //最终会有两个代码块 1个是空的main,一个是包括index.js的common
          //重用现在的代码块 false 不重用
          //本来我要提取分割index.js,那么新分割出去的代码块里只有一个index.js
          //但是发现在现在main里也刚好有我想提取的代码块，直接把main当成分割出去代码复用
          reuseExistingChunk: true//如果能重用，就不会再生成一个新的common代码块了，直接重用main.js
          // reuseExistingChunk表示如果当前的代码包含已经被从主bundle中分割出去的模块，它将会被重用，而不会生成一个新的代码块
        }
          
        //第三方
        //覆盖默认缓存组，因为我们有两个默认缓存组 defaultVendors,default
        /*  defaultVendors: {
           test: /node_modules/,//如果模块的路径里有node_modules的话就属于这个vendor缓存组
           priority: -10
         },
         
         default: {
           minChunks: 2,
           priority: -20
         } */
      }
  }
}
```

```js
{
    optimization: {
        splitChunks: {
            // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
            chunks: 'all',
            // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
            minSize: 0,//默认值是20000,生成的代码块的最小尺寸
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/, //条件
                    priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
                },
                default: {
                    minChunks: 2,////被多少模块共享,在分割之前模块的被引用次数
                    priority: -20
                },
            },
        },
    },
}
```

打包生成情况：

```js
//入口代码块
page1.js
page2.js
page3.js
//异步加载代码块
src_asyncModule1_js.js
//defaultVendors缓存组对应的代码块
defaultVendors-node_modules_jquery_dist_jquery_js.js
defaultVendors-node_modules_lodash_lodash_js.js
//default代缓存组对应的代码块
default-src_module1_js.js
default-src_module2_js.js
```

模拟过程：

```js
let page1Chunk = {
  name: 'page1',
  modules: ['A', 'B', 'C', 'lodash']
};

let page2Chunk = {
  name: 'page2',
  module: ['C', 'D', 'E', 'lodash']
};

let cacheGroups = {
  vendor: {
    test: /lodash/
  },
  default: {
    minChunks: 2
  }
};

let vendorChunk = {
  name: `vendor~node_modules_lodash_js`,
  modules: ['lodash']
};
let defaultChunk = {
  name: `default~page1~page2`,
  modules: ['C']
};
```

**工作流程**

1. SplitChunksPlugi 先尝试把`minChunks`规则的模块抽取到单独的`Chunk`中
2. 判断该 Chunk 是否满足`maxInitialRequests`配置项的要求
3. 判断体积是否满足`minSize`的大小，如果小于`minSize`则不分包，如果大于`minSize`判断是否超过`maxSize`,如果大于`maxSize`则继续拆分成更小的包



[maxInitialRequest](http://www.zhufengpeixun.com/front/html/103.13.splitChunks.html)：用于设置 Initial Chunk 最大并行请求数。

[maxAsyncRequests](http://www.zhufengpeixun.com/front/html/103.13.splitChunks.html)：用于设置 Async Chunk 最大并行请求数。

请求数是指加载一个`Chunk`时所需要加载的所有的分包数量,包括`Initial Chunk`，但不包括`Async Chunk`和`runtimeChunk`



```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetPlugin = require('./asset-plugin');
module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        page1: "./src/page1.js",
        page2: "./src/page2.js",
        page3: "./src/page3.js",
    },
    optimization: {
        splitChunks: {
            // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
            chunks: 'all',
            // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
            minSize: 0,//默认值是20000,生成的代码块的最小尺寸
            // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
            minChunks: 1,
            // 表示按需加载文件时，并行请求的最大数目。默认为5。
            maxAsyncRequests: 3,
            // 表示加载入口文件时，并行请求的最大数目。默认为3
            maxInitialRequests: 5,
            // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
            automaticNameDelimiter: '~',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/, //条件
                    priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
                },
                default: {
                    minChunks: 2,////被多少模块共享,在分割之前模块的被引用次数
                    priority: -20
                },
            },
        },
        runtimeChunk: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ["page1"],
            filename: 'page1.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ["page2"],
            filename: 'page2.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ["page3"],
            filename: 'page3.html'
        }),
        new AssetPlugin()
    ]
}
```

webpack-assets-plugin.js

plugins\webpack-assets-plugin.js

```js
class WebpackAssetsPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    //每当webpack开启一次新的编译 ，就会创建一个新的compilation
    compiler.hooks.compilation.tap('WebpackAssetsPlugin', (compilation) => {
      //每次根据chunk创建一个新的文件后会触发一次chunkAsset
      compilation.hooks.chunkAsset.tap('WebpackAssetsPlugin', (chunk, filename) => {
        console.log(chunk.id, filename);
      });
    });
  }
}
module.exports = WebpackAssetsPlugin;
```

page1.js

```js
let module1 = require('./module1');
let module2 = require('./module2');
let $ = require('jquery');
console.log(module1,module2,$);
import( /* webpackChunkName: "asyncModule1" */ './asyncModule1');
```

page2.js

```js
let module1 = require('./module1');
let module2 = require('./module2');
let $ = require('jquery');
console.log(module1,module2,$);
```

page3.js

```js
let module1 = require('./module1');
let module3 = require('./module3');
let $ = require('jquery');
console.log(module1,module3,$);
```

module1.js

```js
module.exports = 'module1';
```

module2.js

```js
console.log("module2");
```

module3.js

```js
console.log("module3");
```

asyncModule1.js

```js
import _ from 'lodash';
console.log(_);
```

 打包后的结果

```js
//入口代码块
page1.js
page2.js
page3.js
//异步加载代码块
src_asyncModule1_js.js
//defaultVendors缓存组对应的代码块
defaultVendors-node_modules_jquery_dist_jquery_js.js
defaultVendors-node_modules_lodash_lodash_js.js
//default代缓存组对应的代码块
default-src_module1_js.js
default-src_module2_js.js
```

计算过程

```js
let page1Chunk= {
    name:'page1',
    modules:['A','B','C','lodash']
}

let page2Chunk = {
    name:'page2',
    module:['C','D','E','lodash']
}

let  cacheGroups= {
    vendor: {
      test: /lodash/,
    },
    default: {
      minChunks: 2,
    }
};

let vendorChunk = {
    name:`vendor~node_modules_lodash_js`,
    modules:['lodash']
}
let defaultChunk = {
    name:`default~page1~page2`,
    modules:['C']
}
```

reuseExistingChunk

- [reuseExistingChunk](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroupscachegroupreuseexistingchunk)表示如果当前的代码包含已经被从主bundle中分割出去的模块，它将会被重用，而不会生成一个新的代码块

index.js

```js

```

webpack.config.js

```diff
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetPlugin = require('./asset-plugin');
module.exports = {
    mode: 'development',
    devtool: false,
+   entry: './src/index.js',
    optimization: {
        splitChunks: {
            // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
            chunks: 'all',
            // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
            minSize: 0,//默认值是20000,生成的代码块的最小尺寸
            // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
            minChunks: 1,
            // 表示按需加载文件时，并行请求的最大数目。默认为5。
            maxAsyncRequests: 3,
            // 表示加载入口文件时，并行请求的最大数目。默认为3
            maxInitialRequests: 5,
            // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
            automaticNameDelimiter: '~',
+           cacheGroups: {
+               defaultVendors: false,
+               default: false,
+               common: {
+                   minChunks: 1,
+                   reuseExistingChunk: false
+               }
+           }
        },
+       runtimeChunk: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
        new AssetPlugin()
    ]
}
```

**结果**

```js
//reuseExistingChunk: false
main main.js
common-src_index_js common-src_index_js.js

//reuseExistingChunk: true
main main.js
```



