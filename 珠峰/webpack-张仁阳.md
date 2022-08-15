# Webpack

webpack前端工程化。

```shell
npm install  webpack webpack-cli --save-dev
```

用法，实战，优化和源码。

webpack是JavaScript应用程序的静态打包工具。

- webpack：核心包
- webpack-cli：命令行工具

webpack5中配置文件不再是必须的了，会有一个默认的配置文件——webpack.config.js。



## entry

- 入口起点(entry point)指示 webpack 使用哪个模块，来作为构建其内部依赖图(dependency graph) 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的
- 默认值是 `./src/index.js`，但你可以通过在 `webpack configuration` 中配置 `entry` 属性，来指定一个（或多个）不同的入口起点

```js
entry:'./src/index.js'

entry:{
    main:'./src.index.js'
}
```



## output

- `output` 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件
- 主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。



webpack本身只能识别js和json文件，如果引入的有其他类型的文件，webpack是无法识别的，为此需要使用loader加载器来加载这类文件并转为webpack可以处理的模块，一般都是js，并添加到依赖关系图中。



loader一般用于转为文件类型，插件则用来执行更为复杂的任务（打包优化，资源管理，注入环境变量...）

##  模式(mode)

- 日常的前端开发工作中，一般都会有两套构建环境

- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，包含 sourcemap 文件

- 一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，静态文件不包括 sourcemap

- webpack 4.x 版本引入了 [mode](https://webpack.docschina.org/configuration/mode/) 的概念

- 当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化

- 而如果是 development mode 的话，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建

  

| 选项        | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin |
| production  | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin |



## 区分环境   

读取变量的两个地方：

- webpack配置文件所在的node环境，该环境的全局对象上有process进程对象
- 项目的源码文件中，实际运行在浏览器中，浏览器全局对象上没有process进程对象，访问则报错





1. **`--mode`用来设置模块内的`process.env.NODE_ENV`**

- 可以在模块内(**项目源文件代码中**)通过`process.env.NODE_ENV`获取该`process.env.NODE_ENV`对应的字符串值（production或者production）进行替换，在**编译阶段**做的替换工作，它和webpack配置文件中通过进程对象（process）中的环境变量对象(env) 上的NODE_ENV 是两个完全不同的概念

````json
"script":{
    "build":"webpack --mode=development"
}
````

`webpack --mode=development`  => 设置webpack.config.js文件中mode的值为development => mode为开发模式（development ）下时，webpack内部通过webpack.definePlugin插件设置字符串process.env.NODE_ENV在项目源码中的代表的实际值为development， 在编译阶段，当解析到项目源码中有用到  process.env.NODE_ENV 时，直接将它替换为 字符串（development） 。   webpack --mode=production也是一样的原理。



其中通过命令行的--mode和配置文件中的mode取指定环境，都是一个原理，如果两者同时存在，则命令行--mode的优先级更高。





2. **`--env`用来设置webpack配置文件的函数参数**

- 无法在模块内通过`process.env.NODE_ENV`访问
- 可以在webpack 配置文件中通过**函数**获取当前环境变量

```json
"script":{
    "build":"webpack --env=development"
}
```

webpack.config.js

````js
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
````

**`--env` 用来设置webpack配置文件的函数参数**，并不直接在项目的模块文件中生效

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
    }
}
```









3. **`cross-env`用来设置node环境的`process.env.NODE_ENV`**

```
"scripts": {
  "build": "cross-env NODE_ENV=development webpack"
}
```

--env=development 只是在执行脚本时，给**函数类型**的 webpack 配置传入参数。如果在 webpack 配置文件中访问 process.env.NODE_ENV 的话，是没有值的，为 undefined。如果想修改 webpack 配置文件中访问的变量的值，可以在命令行中设置 webpack 配置文件运行的环境的环境变量。

```json
"scripts": {

  "build": "set NODE_ENV=development webpack ",  // windows下的写法。webpack 配置文件中访问 process.env.NODE_ENV ，则它的值就为development

  "build": "cross-env NODE_ENV=development webpack "  // 解决操作系统层面的命令兼容性包

},
```

webpack配置文件中读取的是node的配置的环境变量，可以通过cross-env key=value来设置。  然后在webpack配置文件中可以访问到设置的环境变量，然后再用这个环境变量作为webpack配置的项中的值，从而来改变项目模块内的变量的值或者打包方式。  

cross-env这是的环境变量在项目的模块文件中是无法访问到的。

例子：

````json
"scripts": {
	"build": "cross-env NODE_ENV=production FIRST_ENV=one webpack"
}
````

在webpack配置文件中可以访问到：

```
console.log(process.env.NODE_ENV);  // production
console.log(process.env.FIRST_ENV);   // one
```

在项目中的文件index.js：

```js
console.log(process.env.NODE_ENV);  // production  ,是由mode为production模式下的DefinePlugin插件设置的
console.log(process.env.FIRST_ENV);   //  process.env.FIRST_ENV则直接在打包后文件中存在，运行时报错
```



**vue中可以通过.env格式的文件向node环境中设置变量。借助的是一个第三方库：dotenv-expand。**



4. **`DefinePlugin`用来设置模块内的全局变量**

- 设置全局变量(全局变量不是`window`),所有模块都能读取到该变量的值
- 可以在任意模块内通过 `process.env.NODE_ENV` 获取当前的变量
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

通过插件DefinePlugin设置的变量可以直接在整个项目的源码中直访问。比如：

````js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = function (env, argv) {
  return {
    mode: 'production',
    // entry:'./src/index.js'
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
````

源码index.js中：

```js
console.log(FIRTS_VAR);   // 在打包编译后的文件中直接就用  wuyibo 字符串进行的替换
```



webpack配置文件中的mode根据不同的值，然后借助webpack.DefinePlugin插件来给项目中的源文件设置的环境变量，但是在webpack配置文件中（node环境中）无法访问到的。

--env=development  和 --mode=development两种写法都不会影响node环境中的process.env.NODE_ENV。

**--mode的优先级高于配置文件中的mode字段设置的值。**



webpack的mode默认为`production`， webpack serve的mode默认为development

- 可以在模块内通过`process.env.NODE_ENV`获取当前的变量,无法在webpack配置文件中获取此变量



webpack 的配置文件的模块导出可以是一个函数，也可以是一个配置对象。其中函数可以接受命令行传递的参数。

如果通过 webpack 的配置文件中的 mode 设置打包模式，那么在项目的各个模块文件中的 process.env.NODE_ENV 字段在打包后生成的文件中都将被替换为字符串:'development 或者 production'。比如在项目的 index.js 入口文件中写代码：

```js
console.log(process.env.NODE_ENV, '----------------');
```

在 mode 为 development 模式下，编译后文件的中的代码是：

```js
console.log('development', '----------------');
```

在 script 脚本中使用 --mode=development 的效果和在 webpack 配置文件的 mode 字段中设置值是一样的。











## webpack-dev-server

内部依赖的是express框架。

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





css-loader的配置

```js
{
    test:/\.css$/,
    use:[
        'style-loader',
        {
            loader:'css-loader',
            options:{
                url: boolean,   // 比如背景图中的url能否被识别
                import:boolean, // 是否允许使用@import css语法
                modules:boolean,  // 是否开启css模块化   import style from './index.css'
                source-map:boolean,
                importLoaders:boolean | number,
                esModules:boolean  // import style from './index.css'   style.defalut.xxx  默认为true
            }
        }
    ]
}
```

css-loader 在css文件中默认支持 ~ 符号表示node_modules文件路径，不需要用户去配置。



node-sass  sass-loader   

sass：老版后缀

scss：新版本后缀

node-sass负责将scss或者sass编译为css，原始的sass包使用ruby写的，本地安装的话需要编译，node-sass是node写的，比较好安装执行。





## eslint

npm install eslint eslint-loader babel-eslint --D

```js
module: {
    rules: [
+      {
+        test: /\.jsx?$/,
+        loader: 'eslint-loader',
+        enforce: 'pre',   //   值：  不写   pre前置    post后置   确定针对同一个文件的规则匹配的优先级
+        options: { fix: true },
+        exclude: /node_modules/,
+      },
    ]
}
```



.eslintrc.js：

````js
module.exports = {
    root: true,   // 为true说明该文件是根配置文件，可以被其他配置文件继承规则，为true是就不能再写extends继承字段了
    parser:"babel-eslint",
    //指定解析器选项
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015
    },
    //指定脚本的运行环境
    env: {
        browser: true,
    },
    // 启用的规则及其各自的错误级别
    rules: {
        "indent": "off",//缩进风格
        "quotes":  "off",//引号类型 
        "no-console": "error",//禁止使用console
    }
}
````





npm i eslint-config-airbnb eslint-loader eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks and eslint-plugin-jsx-a11y -D

```js
module.exports = {
    // 删除root文件，同时继承airbnb
    "parser":"babel-eslint",
    "extends":"airbnb",
    "rules":{
        "semi":"error",
        "no-console":"off",
        "linebreak-style":"off",
        "eol-last":"off"
        //"indent":["error",2]
    },
    "env":{
        "browser":true,
        "node":true
    }
}
```



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





## CSS兼容性

```shell
npm i postcss-loader postcss-preset-env -D
```

- [postcss-loader](https://github.com/webpack-contrib/postcss-loader)可以使用PostCSS处理CSS
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)把现代的CSS转换成大多数浏览器能理解的
- PostCSS Preset Env已经包含了`autoprefixer`和`browsers`选项



postcss配置文件：

postcss.config.js

```js
let postcssPresetEnv = require('postcss-preset-env');
module.exports={
    plugins:[postcssPresetEnv({
        browsers: 'last 5 version'
    })]
} 
```





##  资源模块

- 资源模块是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader
- `raw-loader` => `asset/source` 导出资源的源代码
- `file-loader` => `asset/resource` 发送一个单独的文件并导出 URL
- `url-loader` => `asset/inline` 导出一个资源的 data URI
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现

```diff
module.exports = {
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
+               type: 'asset/resource'   // file-loader
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
+               }
+           }
        ]
    },
  experiments: {
    asset: true
  },
};
```



## JS兼容性处理

- Babel是一个编译JavaScript的平台,可以把ES6/ES7,React的JSX转义为ES5
- Babel默认只转换新的最新ES语法,比如箭头函数

让babel能转换其他新语法需要借助包或者babel插件

- [babel-loader](https://www.npmjs.com/package/babel-loader)使用Babel和webpack转译JavaScript文件
- [@babel/core](https://www.npmjs.com/package/@babel/core)Babel编译的核心包
- [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)
- [@babel/@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react)React插件的Babel预设
- [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)把类和对象装饰器编译成ES5
- [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)转换静态类属性以及使用属性初始值化语法声明的属性

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





## webpack原理预备知识

- `Symbol.toStringTag` 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签
- 通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

```js
console.log(Object.prototype.toString.call("foo")); // "[object String]"
console.log(Object.prototype.toString.call([1, 2])); // "[object Array]"
console.log(Object.prototype.toString.call(3)); // "[object Number]"
console.log(Object.prototype.toString.call(true)); // "[object Boolean]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"


let myExports = {};
Object.defineProperty(myExports, Symbol.toStringTag, { value: "Module" });
console.log(Object.prototype.toString.call(myExports)); //[object Module]   自定义某个数据的标识
```





webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  devServer: {},
};
```



入口文件 index.js

```js
let title = require("./title.js");
console.log(title);
```



title.js:

```js
module.exports = "title";
```



打包后生成文件：

````js
(() => {
    // 存放项目依赖的所有模块（依赖关系图的生成结果）， key（模块id）是模块对于项目的所在目录，值是函数，函数体内容由模块文件的内容组成
    var modules = ({
        "./src/title.js"://不管源码中是模块路径，相对或绝对路径，最后都转为相对于项目根目录的相对路径
        ((module,exports,require) => {
            module.exports = "title";
        })
    });
    
    // 缓存已经被引入过的模块
    var cache = {};
    
    // require方法，相当于自己在浏览器端实现一个require的pollful的方法
    function require(moduleId) {
        if (cache[moduleId]) {
            return cache[moduleId].exports;
        }
        var module = cache[moduleId] = {
            exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
    }
    
    var exports = {}
    
    (() => {
        let title = require("./src/title.js");
        console.log(title);
    })();
})();
````



在webpack中由两种模块化规范，commonjs和esmodule，他们之间可以相会转换和混用。并且在webpack打包后都统一使用commonJS模块规范。如果对不同模块化规范做兼容。

### common.js 加载 common.js

```js
// index.js:
let title = require("./title");
console.log(title.name);
console.log(title.age);

// title.js
exports.name = "title_name";
exports.age = "title_age";



// 打包结果， 基本不用转换和pollfill支持
(() => {
  var modules = ({
    "./src/title.js":
      ((module, exports) => {
        exports.name = 'title_name';
        exports.age = 'title_age';
      })
  });
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
    let title = require("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  })();
})();
```



### common.js 加载 ES6 modules  

````js
// index.js:
let title = require("./title");
console.log(title);
console.log(title.age);

// title.js
export default "title_name";   // 默认导出
export const age = "title_age";  // 命名导出



// 打包结果， 基本不用转换和pollfill支持
(() => {
    // 模块定义
    var modules = ({
        "./src/title.js":
        ((module, exports, require) => {
            // es module转commonjs
            require.r(exports);  // r函数用于标识exports是一个es module的导出
            
            require.d(exports, {  // 
                "default": () => (_DEFAULT_EXPORT__),
                "age": () => (age)
            });
            const _DEFAULT_EXPORT__ = ('title_name');
            const age = 'title_age';
        })
    });
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
    
    // 给对象定义属性
    require.d = (exports, definition) => {
        for (var key in definition) {
            if (require.o(definition, key) && !require.o(exports, key)) {
                Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
            }
        }
    };
    

    require.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    
    // r函数用于标识exports是一个es module的导出
    require.r = (exports) => {   
        // 宿主环境支持symbol数据类型
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });   // [object Module]
        }
        
        // 宿主环境不支持symbol数据类型时 
        Object.defineProperty(exports, '__esModule', { value: true });  // exports.__esModule = true，通过该属性就能知道该模块文件是采用的commonJS模块还是esModule模块规范
    };
    
    
    let title = require("./src/title.js");
    // title默认是引入的那个模块
    console.log(title.default);   // es6中默认导出在commonjs中是通过default属性获取的。
    console.log(title.age);
})();
````



### ES6 modules 加载 ES6 modules

```js
//  index.js
import name, { age } from "./title";
console.log(name);
console.log(age);

// title.js
export default name = "title_name";
export const age = "title_age";


// 打包结果

"use strict";
var modules = ({
    "./src/title.js":
    ((module, exports, require) => {
        require.r(exports);
        let _DEFAULT_EXPORT__ = ('title_name');
        let age = 'title_age';
        setTimeout(() => {
            age = 'new';
        }, 1000);
        /*  require.d(exports, {
           "default": () => (_DEFAULT_EXPORT__),
           "age": () => (age)
         }); */
        exports.age = age;
    })
});
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

require.d = (exports, definition) => {
    for (var key in definition) {
        if (require.o(definition, key) && !require.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};

require.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))


require.r = (exports) => {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
};

var exports = {};

require.r(exports);
var _title_0__ = require("./src/title.js");
console.log(_title_0__["default"]);
console.log(_title_0__.age);

```





### ES6 modules 加载 common.js

```js
// index.js
import name, { age } from "./title";
console.log(name);
console.log(age);


// title.js
module.exports = {
  name: "title_name",
  age: "title_age",
};

// 打包结果
(() => {
  var modules = ({
    "./src/title.js":
      ((module) => {
        module.exports = {
          name: 'title_name',
          age: 'title_age'
        }
      })
  });
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
  require.n = (module) => {
    var getter = module && module.__esModule ?
      () => (module['default']) :
      () => (module);
    //require.d(getter, { a: getter });
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
  require.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  require.r = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  var exports = {};
  (() => {
    //只要打包前的模块是一个es module,那么就会调用require.r方法进行处理
    require.r(exports);
    var _title_0__ = require("./src/title.js");
    var _title_0___default = require.n(_title_0__);
    console.log((_title_0___default()));
    console.log(_title_0__.age);
  })();
})()
```









在a模块中使用commonjs的require语法加载b模块，b模块使用ES Module进行默认导出和命名导出，则在a模块中得到的是b模块对应的模块对象，其中包含命名导出和defaulr默认导出属性。 

````js
// index.js:
let title = require("./title");
console.log(title);  // title是title.js模块对象
console.log(title.age);

// title.js
export default "title_name";   // 默认导出
export const age = "title_age";  // 命名导出
````



![image-20220522184522377](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220522184522377.png)





面试：commonjs和es Module导出的区别？

- commonjs是在导入模块中是值和引用
- es module是在导入模块中是对导出模块导出对象或者值的内存引用



````js
// index.js
import title,{age} from './title.js'
setTimeout(()=>{
    console.log(age)   // 打印 20
},3000)

// title.js
export var age = 10
export default {}
setTimeout(()=>{
    age = 20 
},1000)
````



```js
// index.js
let title = require('./title.js')
setTimeout(()=>{
    console.log(title.age)   // 打印 10 
    console.log(title.obj.name)  // 456
},3000)

// title.js
var age = 10 
var obj = {
    name:123
}
module.exports = {
    age,
    obj
}
setTimeout(()=>{
    age = 20 
    obj.name = 456
},1000)
```





## 异步加载

懒加载和代码分割

```js
// index.js
import(/* webpackChunkName: "hello" */ "./hello").then((result) => {
    console.log(result.default);
});

// hello.js
export default 'hello';



```



代码块：webpack中每个入口都会对应一个代码块，代码块又是许多模块的集合。但是代码块又不局限于以入口wntry来作为区分条件。   事实上每个entry和异步加载的模块都会产生一个代码块，该代码块由该入口文件及它的直接和间接依赖的模块所组成。（chunk） 每个chunk都会有一个id。  id可能是entry入口中设置的名字，也能是默认生产的名字。



懒加载一定意味着代码分割。











