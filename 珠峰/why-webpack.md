webpack 实现 commonjs 打包后的源码：

```js
(function () {
  var __webpack_modules__ = {
    './src/js/format.js': function (module) {
      //在执行该模块时一共传入了三个参数 module, module.exports, __webpack_require__
      const formatTime = (time) => {
        return '2021-9-18';
      };
      const formatString = (time) => {
        return 'x-x-x';
      };

      //将对应模块要导出的变量或者方法放入到module对象中，而module对象其实是__webpack_require__函数在闭包情况下存放的一个变量
      module.exports = {
        formatTime,
        formatString
      };
    }
  };

  //定义了一个对象，作为加载模块的缓存
  var __webpack_module_cache__ = {};

  //定义一个函数，当加载一个模块时会通过该函数进行加载
  function __webpack_require__(moduleId) {
    //moduleId 为 './src/js/format.js'
    var cachedModule = __webpack_module_cache__[moduleId];
    //判断缓存中是否已经加载过该模块
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }

    //给module和__webpack_module_cache__[moduleId]赋值同一个内存地址中的对象
    //这里形成了一个闭包
    var module = (__webpack_module_cache__[moduleId] = { exports: {} });

    //加载执行该模块
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }

  var __webpack_exports__ = {};

  //下面是立即执行函数的另一种写法，具体开始执行代码逻辑
  !(function () {
    const { formatTime, formatString } = __webpack_require__('./src/js/format.js'); //这是在加载入口模块
    console.log(formatTime(123));
    console.log(formatString(456));
    console.log('hello world');
  })();
})();
```

模块化实际上给了每个模块一个函数作用域。封装几个函数，将一个个的模块放在对象中进行管理。

ES6 模块化语法的实现原理：

```js
(function () {
  'use strict';
  //任然是定义了一个对象，对象内部存放模块映射
  var __webpack_modules__ = {
    './src/js/math.js': function (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) {
      __webpack_require__.r(__webpack_exports__);

      //给exports对象设置代理   definition
      __webpack_require__.d(__webpack_exports__, {
        sum: function () {
          return sum;
        },
        mut: function () {
          return mut;
        }
      });
      const sum = (n1, n2) => {
        return n1 + n2;
      };

      const mut = (n1, n2) => {
        return n1 * n2;
      };
    }
  };

  //模块加载缓存
  var __webpack_module_cache__ = {};

  //require函数的自定义实现
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      //检测缓存
      return cachedModule.exports;
    }

    var module = (__webpack_module_cache__[moduleId] = {
      exports: {}
    });

    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    return module.exports;
  }

  !(function () {
    //给函数对象__webpack_require__添加一个叫d的属性，且赋值为一个函数
    __webpack_require__.d = function (exports, definition) {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();

  !(function () {
    //给函数对象__webpack_require__的原型对象中添加一个叫o的属性，且赋值为一个函数
    __webpack_require__.o = function (obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };
  })();

  !(function () {
    //给函数对象__webpack_require__添加一个叫r的属性，且赋值为一个函数，给exports对象增加了一些属性，作用是记录一个模块是否是ES6模块，以后在判断加载的模块是es6模块还是commonjs模块
    __webpack_require__.r = function (exports) {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
  })();

  var __webpack_exports__ = {};

  !(function () {
    __webpack_require__.r(__webpack_exports__); //用于记录是一个—__esModules:ture

    //开始加载第一个模块
    var _js_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./src/js/math.js');

    console.log((0, _js_math_js__WEBPACK_IMPORTED_MODULE_0__.sum)(123, 456));
    //等价于	console.log( _js_math_js__WEBPACK_IMPORTED_MODULE_0__.sum(123, 456))
    console.log((0, _js_math_js__WEBPACK_IMPORTED_MODULE_0__.mut)(456, 1));
    console.log('hello world');
  })();
})();
```

## source-map

- 原理
- 作用
- 如何方便进行调试

认识：

- 开发和生产过程中泡在浏览器中的代码和项目源码往往有很大的差异
- 比如源码采用 ES6 转换为 ES5 会增加大量的 ES5 代码
- 源码的行号和打包后代码的行号差异很大
- 代码丑化压缩过，变量名改变
- TS 转为 JS

当开发过程中项目出现 bug，那就需要锁定报错的源码的位置。借助 source-map 就可以实现打包后代码到源码的映射，从而更快锁定错误出现的位置，以进行修复。使得浏览器可以重构原始源并再调试器中显示重建的原始源代码。

使用：

方式一：

```js
module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, './bundle')
  }
};
```

使用：

1. 根据源文件生成 source-map 文件(webpack 配置生成)

2. 在转换后的代码最后添加一个注释，指向 source-map 文件

source-map 文件说明：

- version：当前使用的 source-map 生产文件包版本

- sources：生产 source-map 文件的源文件有哪些和打包的源代码

- file：打包后的文件项目文件，也就是 source-map 文件对应的文件

- mappings：source-map 用来和源文件进行映射的信息，是 base64VLQ 编码

- sourcesContent：转换前的具体代码信息，和 sources 是对应关系

- names：转换前的变量名和属性名

- sourceRoot：所有的 source 相对的根目录

在 webpack.config.js 文件中有一个和 mode,entry,output 平级的字段——devtool，通过它进行 source-map 配置。

![image-20210920202101069](.\typora-user-images\image-20210920202101069.png)

![image-20210920193508765](.\typora-user-images\image-20210920193508765.png)

在 eval 模式下，可以在模块的源代码的最后增加一个特殊的注释（这种注释只在 eval 函数中才有效）， /# soureURL =webpack://xxxxxx/xxxx。

![image-20210920090042609](.\typora-user-images\image-20210920090042609.png)

devtool 的不同取值：

- false
- eval
- none（直接不写 devtool 字段，在生产环境下使用）

- source-map：包括项目源码和 webpack 中的代码都做了还原

![image-20210920195734080](.\typora-user-images\image-20210920195734080.png)

- eval-source-map

![image-20210920195847810](.\typora-user-images\image-20210920195847810.png)

eval 和 source-map 字段的组合，会让 source-map 内容在打包后的每个源码的 eval 字符串的最后面加上 sourceURl 的 base64 内容。 source-map 都是生成到 eval 函数最后面。

- inline-source-map

所有的 source-map 依然是进行了 base64 编码的，因为打包后的 js 文件中不再使用 eval 函数包裹每个模块，所以它不是放在每个模块对应的 eval 的后面了，而是直接放在打包生成的文件的最后面了。

![image-20210920200839940](.\typora-user-images\image-20210920200839940.png)

该 source-map 是当前项目中所有模块都生成的内容，所以在打包执行时，即使某个模块的文件有报错的代码出现，由于 source-map 不受 eval 的限制，所以每个项目模块的映射都能完整体现。

![image-20210920201614585](.\typora-user-images\image-20210920201614585.png)

- cheap-source-map

![image-20210920204538909](.\typora-user-images\image-20210920204538909.png)

- cheap-module-source-map

![image-20210920205808312](.\typora-user-images\image-20210920205808312.png)

![image-20210920205936692](.\typora-user-images\image-20210920205936692.png)

- hidden-source-map

![image-20210920210236616](.\typora-user-images\image-20210920210236616.png)

![image-20210920210346524](.\typora-user-images\image-20210920210346524.png)

自己手动加上后有会生效 source-map。

- nosources-source-map

![image-20210920210521077](.\typora-user-images\image-20210920210521077.png)

![image-20210920212238227](.\typora-user-images\image-20210920212238227.png)

相对的最佳实践

![image-20210920212501056](.\typora-user-images\image-20210920212501056.png)

## Babel

![image-20220307074738357](.\typora-user-images\image-20220307074738357.png)

babel 本身是可以单独使用的一个工具，可以不和 webpack 配置使用。

如果希望在终端中使用 babel 编译 js 文件，需要安装的最基本的包有：

- @babel/core:该包只能被调用或者在源码中引入来配合使用
- @babel/cli：babel 命令行工具，安装后可以在终端执行 babel 的可执行命令并传入参数，以处理文件

```shell
npx babel src --out-dir result            //只写文件的话，会将文件下的所有js都转换,并输出到result中
```

源码：

![image-20210920214434926](.\typora-user-images\image-20210920214434926.png)

转换后代码：

![image-20210920214503314](.\typora-user-images\image-20210920214503314.png)

这里可以发现源码并没有被 babel 进行更多的转换，因为只是使用了 babel 的内核，对于代码要如何转换，还需要使用其他插件转换对应语法，比如对箭头函数进行转换的插件。

箭头函数插件：npm install @babel/plugin-transform-arrow-functions -D

```shell
npx babel src --out-dir result  --plugins=@babel/plugin-transform-arrow-functions
```

![image-20210920215102557](.\typora-user-images\image-20210920215102557.png)

const 字符转为 var 的插件：@babel/pulgin-transform-block-scoping

```
npx babel src --out-dir result  --plugins=@babel/plugin-transform-arrow-functions,@babel/plugin-transform-block-scoping
```

![image-20210920215240261](.\typora-user-images\image-20210920215240261.png)

这样一个一个语法特性去转的话，需要安装非常多的插件。但是其实不需要，如果想要一次性配置很多语法插件，这时可以选择预设-------@babel/preset-env

```shell
npx babel src --out-dir result  --presets=@babel/preset-env
```

![image-20210920215643389](.\typora-user-images\image-20210920215643389.png)

![image-20210920215901150](.\typora-user-images\image-20210920215901150.png)

Babel 的底层代码转换的逻辑：

babel 将 ES6 语法的源码生成 ES6 对应的 AST 语法树，在将 ES6 对应的语法树转为另一个可以转为 ES5 代码的新的 AST 语法树，再将新的 AST 语法树生成 ES5 的代码（babel 本质就是 JavaScript 的一个编译器）。

![image-20210920230600288](.\typora-user-images\image-20210920230600288.png)

![image-20210920230615950](.\typora-user-images\image-20210920230615950.png)

## babel 结合 webpack 的使用

webpack 默认情况下只识别 ES6 中的模块化语法并进行转换，但是对于箭头函数，let，class，const 等的语法和关键字默认是无法直接转为 ES5 的代码的。

需要在 webpack 加载 js 时，对 js 文件使用一下 babel。

babel-loader :该 loader 会自动去使用 babel 工具对加载的 js 进行转换

@babel/core

babel-loader

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        'babel-loader' //单纯这样只是使用Babel的核心部分，但是对于es6中的关键字或语法没有转换,这里只告诉要使用babel-loader但没有说明要用哪些插件
      ]
    }
  ];
}
```

npm install @babel/plugin-transform-arrow-functions @babel/plugin-transform-block-scoping -D

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-arrow-functions',
              '@babel/plugin-transform-block-scoping'
            ]
          }
        }
      ]
    }
  ];
}
```

npm install @babel/preset-env -D

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      ]
    }
  ];
}
```

这样配置以后，会用.browserslistrc 先查询需要兼容的浏览器情况，然后在确定之后，使用@babel/preset-env 插件对语法 进行针对性的转换。

在项目中没有.browserslistrc 文件的时候，Babel 就提供了另一种方式来设置需要兼容的目标浏览器。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: ['chrome 88'] //优先级高于.browserslistrc文件，不建议这么写
                }
              ]
            ]
          }
        }
      ]
    }
  ];
}
```

![image-20211004222808041](.\typora-user-images\image-20211004222808041.png)

早期 babel/preset 中会见到下面的情况：

![image-20220311220855764](.\typora-user-images\image-20220311220855764.png)

![image-20211004222916792](.\typora-user-images\image-20211004222916792.png)

![image-20210921000205776](.\typora-user-images\image-20210921000205776.png)

babel.config.js:

```js
module.export = {
  presets: ['@babel/preset-env'],
  plugins: []
};
```

## polyfill

![image-20210921000756977](.\typora-user-images\image-20210921000756977.png)

![image-20210921003250741](.\typora-user-images\image-20210921003250741.png)

```
PS C:\Users\dukkha\Desktop\webpac\02> npm install @babel/polyfill -S

npm WARN deprecated @babel/polyfill@7.12.1: 🚨 This package has been deprecated in favor of separate inclusion of a polyfill and regenerator-runtime (when needed). See the @babel/polyfill docs (https://babeljs.io/docs/en/babel-polyfill) for more information.

npm WARN deprecated core-js@2.6.12: core-js@<3.4 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Please, upgrade your dependencies to the actual version of core-js.
```

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

使用：

![image-20210921003318054](.\typora-user-images\image-20210921003318054.png)

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage"
      }
    ]
  ]
}




PS C:\Users\dukkha\Desktop\webpac\02> npx webpack

WARNING (@babel/preset-env): We noticed you're using the `useBuiltIns` option without declaring a core-js version. Currently, we assume version 2.x when no version is passed. Since this default version will likely change in future versions of Babel, we recommend explicitly setting the core-js version you are using via the `corejs` option.

You should also be sure that the version you pass to the `corejs` option matches the version specified in your `package.json`'s `dependencies` section. If it doesn't, you need to run one of the following commands:

  npm install --save core-js@2    npm install --save core-js@3
  yarn add core-js@2              yarn add core-js@3
```

![image-20210921003338380](.\typora-user-images\image-20210921003338380.png)

![image-20210921003509849](.\typora-user-images\image-20210921003509849.png)

core-js regenerator-runtime -S

```js
module.export = {
    presets:[
        [ "@babel/preset-env",
        	{
                useBuiltIns:"usage"           //该属性表示哪些语法特性需要构建进打包后的文件中，取值有：false表示不使用poyfily；   usage：表示根据源码中需要使用哪些poyfill就引入哪些，没有用到的就不引入；  entry：表示只要是目标浏览器需要的poyfill都一并引入
                //usage可能存在问题，比如第三方库可能本身已经实现了一些关于poyfill的语法特性，如果在自己的项目中再次构建一次语法特性，可能两者存在冲突。为此的解决方法是在webpack.config.js的加载js的loader的地方通过exclude字段排除第三方的包
                corejs:3  //和package.json中Corder.js的版本对应  ，不写默认指定的是corejs:2版本
            }
        ]
    ]
}
```

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: [['@babel/preset-env']]
          }
        }
      ]
    }
  ];
}
```

```js
module.export = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry', //只在这个文件中这么写默认是不会使用任何poyfill语法特性的，必须在入口文件中引入core-js/stable  和  regenereator-runtime/runtime
        corejs: 3
      }
    ]
  ]
};
```

项目的入口文件中：

```js
import 'core-js/stable';
import 'regenereator-runtime/runtime';
```

其他更细致的引入 pylfill 的方式：在 github 中的 core-js 库中可以查看

![image-20210921003126190](.\typora-user-images\image-20210921003126190.png)

## Plugin-transform-runtime

![image-20210921003814818](.\typora-user-images\image-20210921003814818.png)

使用：

![image-20210921004353401](.\typora-user-images\image-20210921004353401.png)

![image-20220311223628784](.\typora-user-images\image-20220311223628784.png)

```js
module.export = {
    presets:[
        [ "@babel/preset-env",
        	{
                useBuiltIns:"entry",
                corejs:3   //不写的话，默认的采用2.0的版本的
            }
        ]
    ],
    plugins:[
        [
            "@babel/plugin-transform-runtime",
            corejs:3
        ]
    ]
}
```

## 对 React 中 jsx 的支持

![image-20210921175427009](.\typora-user-images\image-20210921175427009.png)

```shell
npm install --save-dev @babel/preset-react
```

```js
module.export = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3 //不写的话，默认的采用2.0的版本的
      }
    ],
    ['@babel/preset-react']
  ]
};
```

webpack.config.js:

```js
module:{
    rules:[
        {
            test:/\.(js|jsx)$/,
            exclude:/node_modules/
            use:[
                "babel-loader"
            ]
        }
    ]
}
```

在加载到 js 或者 jsx 文件后，使用 webpack.config.js 文件中的对应的 js 或者 jsx 中配置上的 loader，在这里是 babel-loader 进行过处理，在识别到 jsx 语法后，会使用在项目根目录下的 babel.config.js 文件中提前设置好的 react 预设————@babel/preset-react，这个预设意味着很多的插件，就会使用这些插件处理 jsx 语法，以实现正常的加载。

## Typescript 的编译

全局安装 typescript 编译器

```shell
npm install typescript -g
```

使用：

```shell
tsc xxx/xxx/xxx/xx.ts     //使用命令行编译指定ts文件
```

在真实项目中，有一些列的 ts 文件，开发者是不可能通过命令行的方式一行行的一个一个文件的去使用 TS 编译器去编译的。所以需要对 webpack.config.js 进行配置。

npm install typescript ts-loader -D

ts-loader 中有依赖依赖 typescript 包，所以可以只手动安装 ts-loader 即可直接使用。

```js
module: {
  rules: [
    {
      test: /\.ts/,
      use: [{ loader: 'ts-loader' }]
    }
  ];
}
```

当要对象中的 ts 文件进行统一编译的时候，要求项目根目录下必须有一个关于 ts 的配置文件的——tsconfig.json。这个文件中记录 ts 中所有需要的相关信息。比如编译为 ES5 还是 ES6 的源代码，编译的模块化语法选择 commonjs 还是 ES6 语法等。

**命令行创建 tsconfig.json 文件：在终端中输入 tsc --init**

使用 babel 来编译 ts 时不需要借助 typescript 工具。

在 ts 文件中使用了 promise 等新语法特性时，通过 ts-loader 编译后的代码时不会处理这些新的语法特性的（没有做 poyfill）。

![image-20210921210223415](.\typora-user-images\image-20210921210223415.png)

```js
module: {
  rules: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader' //在babel.config.js文件中设置ts语法预设
        }
      ]
    }
  ];
}
```

ts-loader 和 babel-loader 都编译 ts 代码。

![image-20210921221920422](.\typora-user-images\image-20210921221920422.png)

babel-loader 的不足是：不会对代码进行非常强的类型校验。源码类型有错误的时候。在打包时任然可以打包成功。但是使用 ts-loader，则有类型错误时使用 ts-loader 则直接打包失败。

![image-20210921222111551](.\typora-user-images\image-20210921222111551.png)

第一点的意思是：如果自己的项目中使用到的新的 es6 以后的语法特性较少的话，可以考虑只使用 tsc 来编译和转换 js 源码

第二点的意思是：**如果自己的项目中用到的语法特性较多，可以使用 babel 来转换转化 ts 源码，但是在转换源码之前可以使用 tsc 先不带有输出的检测一下变量类型。**

```js
module: {
  rules: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    }
  ];
}
```

在执行打包命令行指令**之前**进行类型检测：

tec --noEmit 指令只检测变量类型而不直接输出任何文件。其他写法：

在 package.json 文件中：

```js
"script"{
	"build":"npm run type-check & webpack --config wk.config.js",   //写法一 一个&的话，前一个命令行出错会阻塞后一个的执行


	"type-check":"tsc --noEmit",   //写法二

    "type-check-watch":"tsc --noEmit --watch"   //写法三

}
```

## ESLint

![image-20210921224411806](.\typora-user-images\image-20210921224411806.png)

使用：

![image-20210921230453153](.\typora-user-images\image-20210921230453153.png)

npm install eslint -D

```shell
npx eslint --init   //自动生成eslint的配置文件
```

.eslintrc.js:

```js
module.exports = {
  env: {
    browser: true, // 要检查的js代码是运行在浏览器端
    commonjs: true, // 使用commonjs模块化规范
    es2021: true // 对ES2021以前的语法都可以进行检查
  },
  extends: [
    'eslint:recommended', // 继承eslint官方推荐的检查规则
    'plugin:react/recommended', // 继承react推荐的检查规则
    'plugin:@typescript-eslint/recommended' //继承typescript推荐的检查规则
  ],
  parser: '@typescript-eslint/parser', // js代码的解析器，eslint默认的代码解析器是espree；由于项目中存在ts代码所以编译指定为专门解析ts代码的解析器
  parserOptions: {
    ecmaFeatures: {
      jsx: true // 对jsx语法也进行检查
    },
    ecmaVersion: 'latest', // 和env中配置的ECMA版本对应
    sourceType: 'module' // 如果我们在初始化的时候选择了模块化规范是Commonjs 如果要想同时支持ESmodule，那么必须在解析配置这里写上这一句，否则会报错
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {}
};
```

ESLint 的基本原理：

1. ESLint 通过默认的 JS 编译器 espree 将要检查的源代码进行词法分析，转化为 tokens 数组
2. tokens 数组经过语法分析，生成抽象语法树 AST
3. 深度遍历 AST 的同时访问每一个节点，并为每一个节点应用插件
4. 插件在工作的时候对不符合规则的语法报告错误并进行修复

![image-20210921230602081](.\typora-user-images\image-20210921230602081.png)

![image-20210921224931615](.\typora-user-images\image-20210921224931615.png)

![image-20210921224951663](.\typora-user-images\image-20210921224951663.png)

es2021:表示 es2021 前的那些语法特性都可以编写。

es2016 表示 es2016 后的语法特性不建议编写。

![image-20210921225101314](.\typora-user-images\image-20210921225101314.png)

![image-20210921225929175](.\typora-user-images\image-20210921225929175.png)

extends 表示继承，继承其他插件的 ESLint 规则。

parser 解析器

![image-20210921225232047](.\typora-user-images\image-20210921225232047.png)

![image-20210921230002920](.\typora-user-images\image-20210921230002920.png)

在选择 commonjs 规范后引入 es6 模块化规范：

![image-20210921230221865](.\typora-user-images\image-20210921230221865.png)

手动取消特定的代码格式检测能力：

![image-20210921230929498](.\typora-user-images\image-20210921230929498.png)

![image-20210921230844940](.\typora-user-images\image-20210921230844940.png)

![image-20210921231324930](.\typora-user-images\image-20210921231324930.png)

规则的值有三种取法：

- off（0）
- warn（1）
- error（2）

eslint-loader

可以在加载 js 文件时使用该 loader，该 loader 在内部使用 eslint 对代码进行校验。在 webpack-dev-server 中也是一样，会先校验源码的规范性，然后才能成功跑起项目来。

```js
module: {
  rules: [
    {
      test: /\.jsx?$/,
      use: ['babel-loader', 'eslint-loader']
    }
  ];
}
```

在 vscode 中使用 eslint 插件

prettier 插件

![image-20210922085943584](.\typora-user-images\image-20210922085943584.png)

## 加载 vue 文件

vue vue-loader vue-template-compiler

```js
{
    test:/\.vue$/,
    use:[
        {
            loader:"vue-loader"
        }
    ]
}
```

在使用 vue-loader 的同时必须还要使用一个插件才能正确处理.vue 类型的文件。这个插件在安装 vue-loader 的同时就一并安装了。

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin');

plugins: [new VueLoaderPlugin()];
```

如果在.vue 文件中使用了 less 或者 scss 或者 styles 的预编译语言时，则还需要使用它们对应的 loader。

```js
{
    test:/\.vue/,
    use:['vue-loader']
}


{
    test:/\.less$/,
    use:[
        "style-loader",
        {
            loader:"css-loader",
            options:{
                importLoaders:2
            }
        },
        "postcss-loader",
        "less-loader"
    ]
}
```

## DevServer

webpack 中开启本地服务，将打包后的文件放在该服务中进行访问。

![image-20210922232425355](.\typora-user-images\image-20210922232425355.png)

watch 加上 live-server 插件：

- 项目中一个文件变化就会完全重新编译整个项目源码
- 编译成功后都会生成新的文件
- live-server 无法脱离 vscode 软件的依赖
- live-server 每次都完全重新刷新整个页面

![image-20210922232526656](.\typora-user-images\image-20210922232526656.png)

方式一：

![image-20210922232837806](.\typora-user-images\image-20210922232837806.png)

```js
{
    watch:true,   // 下者依赖前者
    watchOptions:{
        ignored:/node_modules/,
        aggregateTimeout:300,
        poll:1000
    }
}
```

## webpack-dev-server

webpack-dev-server

package.json:

```json
"script":{
    "serve":"webpack-dev-serve",  //以前的写法
    "serve":"webpack serve"  //现在， 内部 webpack-cli会会分析到serve字段的存在，就会利用webpack-dev-server 这个包来启动项目
}
```

![image-20210922234304870](.\typora-user-images\image-20210922234304870.png)

## webpack-dev-middleware

![image-20210922235400145](.\typora-user-images\image-20210922235400145.png)

![image-20210922235254411](.\typora-user-images\image-20210922235254411.png)

## HMR

![image-20210923085509208](.\typora-user-images\image-20210923085509208.png)

![image-20210923085921170](.\typora-user-images\image-20210923085921170.png)

![image-20211007115446381](.\typora-user-images\image-20211007115446381.png)

## 框架中的 HMR

![image-20210923090002045](.\typora-user-images\image-20210923090002045.png)

![image-20211007115646190](.\typora-user-images\image-20211007115646190.png)

**React 中的 HMR**

![image-20210923224219869](.\typora-user-images\image-20210923224219869.png)

注意：该 React 热更新插件只能在开发环境下使用，而不能在生产环境下使用的。

**Vue 中的 HMR**

![image-20210923225305158](.\typora-user-images\image-20210923225305158.png)

**HMR 的原理**

![image-20210923225935598](.\typora-user-images\image-20210923225935598.png)

![image-20210923225840210](.\typora-user-images\image-20210923225840210.png)

![image-20210923232041086](.\typora-user-images\image-20210923232041086.png)

## webpack 中的路径配置项

**output**中的 publicPath

![image-20210924191925842](.\typora-user-images\image-20210924191925842.png)

publicPath 在打包后生成的 html 文件中，在该 html 文件中引入其他资源文件（js,css,img 等）的路径前面拼接上 publicPath 属性对应的值。

![image-20210924232842567](.\typora-user-images\image-20210924232842567.png)

该字段的作用是：对于打包后的 html 中，对应经过 webpack 打包的其他资源文件。在打包后的 html 中 何如引入这些经过 webpack 打包后在输出目录中生成的对应资源的。比如 webpack 打包后生成的 js，css 和 img 在打包的 html 文件中是通过相应的标签的 src，href，url 等属性来引入的。而 publicPath 就是决定这些标签是以什么路径开头的。

## devServer 字段中的系列配置

**devServer**中的 publicPath

![image-20210924192014580](.\typora-user-images\image-20210924192014580.png)

![image-20210924233534255](.\typora-user-images\image-20210924233534255.png)

webpack-dev-serve 中本地运行项目时，默认是将项目的根目录作为对应域名端口号下的根路径的。打包后的 html 文件和 js 文件在内存中是和项目根目录在同一个目录下。这就是 publicPath 的能力。

这个属性就是决定 webpack-dev-serve 该工具包将 webpack 模拟打包后的虚拟文件跑在具体某个子目录中的。项目打包后的所有文件默认是跑在 webpack.config.js 文件的同级目录的，即项目的根目录可以默认看作服务器的根路径——' / '。

**devServer**中的 contentBase

该值一般时绝对路径。

![image-20210924192435488](.\typora-user-images\image-20210924192435488.png)

contentBase 该属性的理解是，它指明的是对于打包前的 html 模板中，相对于该模板 html 的位置出发的路径。例如：自己在项目的根目录下准备了一个 html 模板文件，同时也在该目录下的 myasset 文件中放置了一些不能被 webpack 打包的资源文件，我直接在该未打包的模板 html 文件中通过比如 script 标签，link 标签，以该 html 相对这些资源文件的路径在 html 模板中引入。 在 webpack-de-serve 打包后会将该模板 html 一并打包到设置好的输出文件目录中，这时其实运行的 html 相对于这些资源文件的位置是发生了变化，但是仍然能生效，就是 contentBase 能设置的。

![image-20210925213114132](.\typora-user-images\image-20210925213114132.png)

watchContentBase：表示开启对 contentBase 目录下文件的监测，一旦有变化，重新刷新浏览器。

在 webpack-dev-derve 启动好本地项目后，在开发过程中，一旦某段代码写错后，webpack-dev-derve 就会编译失败，编译失败后浏览器中也会显示错误信息，当之后修复好对应的错误后，webpack-dev-serve 则又会编译成功并且会重新刷新浏览器，之前的错误信息都会消失。如果不希望完全重新刷新浏览，而是只重新编译出错模块的内容，则只需要在 devServer 字段中增加 hotOnly 属性并设置为 true 即可。

![image-20210925213702295](.\typora-user-images\image-20210925213702295.png)

![image-20210925213909861](.\typora-user-images\image-20210925213909861.png)

localhost 域名默认情况下是无法在同一网段下面被其他电脑所访问的，除非自己在自己的本机上设置 loaclhost 对应的是另一个电脑的 IP 地址。

![image-20210925214215744](.\typora-user-images\image-20210925214215744.png)

![image-20210925215613897](.\typora-user-images\image-20210925215613897.png)

```js
devServer:{
    hot:true,
    hotOnly:true,
    compress:true,
    contentBase:path.resolve(__dirname,"./why"),
    proxy:{
        "/api": {
            target:"http://xxxxxx:xxx/",
            pathRewrite:{
                "^/api":""
            }，
            secure:false,
            changeOrigin:true
        }
    }
}
```

默认情况下，代理是不能支持 https 协议的代理的，如果还是要代理到 https 的服务器，则需要配置 secure 为 false 值。

![image-20210925220053852](.\typora-user-images\image-20210925220053852.png)

包中的源码：，从下图可以看出，设置 changeOrigin 字段后，源码内部会修改请求头中的 host 属性。

![image-20210925220043402](.\typora-user-images\image-20210925220043402.png)

解决**开发环境**下，**SPA 单页面应用**和**history 模式**下的页面刷新显示 404 的问题（hash 模式下没有该问题）。

![image-20210925221338744](.\typora-user-images\image-20210925221338744.png)

```js
devServer:{
    hot:true,
    hotOnly:true,
    compress:true,
    contentBase:path.resolve(__dirname,"./why"),
    proxy:{
        "/api": {
            target:"http://xxxxxx:xxx/",
            pathRewrite:{
                "^/api":""
            }，
            secure：false，
            changeOrigin:true
        }
    },
    historyApiFallback:true
    //or
    historyApiFallback:{
      rewrites:[
          {
              from:'/^\/$/', to:'/views/index.html'
          },
          {
          	  from:'/./', to: '/views/404.html'
          }
          // .....
      ]
    }
}
```

## resolve 模块解析

在开发中会使用许多模块，比如自定义模块，第三方模块，nodejs 内置模块。导入不同模块采用的路径方式。

webpack 配置项中的 resolve 字段用于设置模块如何被解析。webpack 使用 enhanced-resolved 来解析文件路径。

```js
resolve:{
    // 指定好扩展名后可以在require或者import文件时，不用加上文件的扩展名，webpack自动按下面的顺序尝试匹配加载
    extensions:['.wasm', '.mjs', '.js', '.json' , '.jsx', '.ts', '.vue'],

    // 路径别名
    alias:{
        "@":path.resolve(__dirname,"./src"),
        "pages":path.resolve(__dirname,"./src/pages"),
    },
    // webpack在查找非绝对或者相对路径开头的模块（第三方模块）时，默认从下面的modules配置中的目录中查找
    modules:['node_modules'],  //默认值

    // 在没有package.json文件指定入口时，默认使用哪个文件作为入口文件
    mainFiles:['index']      //默认值

    // 找一个包中的package.json中的指定的字段对应的值作为作为包的入口文件所在，优先级高于mainFiles
    mainFields:['browser','module','main']
}
```

resolve.modules 是用来设置模块搜索的目录，设定目录以后，import 模块路径，就可以从一个子目录开始写，这样就可以缩短模块引入路径。例如：

```js
resolve: {
  modules: ['./src/components'];
}
```

则引入 src 下的 components 下的 utils 模块，就可以

```
import 'utils'
```

这样就可以省略前面的 src/components 路径，作用是省略路径书写，让 webpack 自己查找。

resolve.alias 则是给路径设置别名，作用是用别名代替前面的路径，不是省略，而是用别名代替前面的长路径。这样其实有个好处，就是 webpack 直接会去别名对应的目录去查找模块，减少了 webpack 自己去按目录查找模块的时间。例如:

```js
resolve：{
    alias:{
        'com':'./src/components'
    }
}
```

引入 utils 模块，就可以这样写

```
import 'com/utils'
```

也达到了缩短引入路径的目的，写法与 resolve.modules 略有不同。

```js
{
    // 这个字段是配置webpack查找loader个规则，字段和resolve是一样的,下面是默认配置
    resolveLoader:{
        extensions:[ '.js', '.json'],
        modules:['node_modules'],
        mainFields:['loader','main']
    }
}
```

## noParse

该字段用于配置哪些模块文件的内容不需要进行解析。

常用于没有第三方依赖库的模块，提高构建速度。一般加载模块后，获取模块内容，转为抽象语法树，解析依赖，对于没有依赖的包就不需要解析依赖。

```js
module:{
    noParse:/jquery|lodash/,

    noParse(moduleName){
    	return /jquery|lodash/.test(moduleName)  // true则标识不需要解析
    },
    rules:[

    ]
}
```

## IgnorePlugin

用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进来。

例子：对应 moment 包，该包做了国际化，所以源码中有一个目录（locale）专门存放了 100 多个国家的语言文件，webpack 打包时，会将这些国家的语言文件打包到项目中，实际并不需要这么多种语言文件。所以需要在打包的时候忽略这些语言文件。

```js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/, //引入的模块名
      resourceRegExp: /^\.\/locale/ // 该模块目录下的哪些目录中的文件需忽略
    })
  ]
};
```

其中的中文也会被过滤，为此需要在项目中单独引入中文语言包。

```js
import 'moment/locale/zh-cn';
```

## webpack 配置文件的分离

之前的打包配置文件都是放在一个 webpack 的配置文件中，在生成和开发环境下都是加载的这一个配置文件，这是存在不足的，比如在开发环境下不需要加载某些插件和某些配置。所以需要对其进行分离。

项目中关于 webpack 配置文件专门的存放目录一般叫 —— config。内部存放所有 webpack 相关的配置文件和加载配置时使用的一些函数工具包。

如果通过在 package.json 文件中的 script 脚本命令去加载不同环境下的配置文件进行项目的打包，必须要向 webpack 或者 webpack-dev-serve 指定使用哪个配置文件：

```json
"scripts":{
   "build":"webpack --config ./config/webpack.prod.js",
   "serve":"webpack serve --config ./config/webpack.dev.js",
   "watch":"webpack --watch"
}
```

上面这种写法的各个配置文件中的写法

webpack.dev.js:

```js
const commonConfig = require('./webpack.common.js');
const { merge } = require('webpack-merge');

const devConfig = {
  mode: 'development'
};

module.exports = merge(commonConfig, devConfig);
```

webpack.prod.js:

```js
const commonConfig = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const prodConfig = {
  mode: 'production'
};
module.exports = merge(commonConfig, prodConfig);
```

![image-20210926210315458](.\typora-user-images\image-20210926210315458.png)

```js
module.exports = {
    context：path.resolve(__dirname,"./")     //现在context指的就是当前webpack配置文件所在的目录了，entry会基于该路径拼接后去查找项目入口文件，所以这时下面的文件可以写为 ../src/main.js 了。
    entry:"../src.main.js",
    output:{
       path:path.resolve(__dirname, "../build")
    }
}
```

context 在文件内部的值具体是什么是由该文件是通过什么样的命令行指令执行的。比如：

- node xxx.js :该 js 文件中 context 代表的就是该文件所在的路径
- node yyy/xxx/xx.js :该文件内部的 context 代表的就是最前面 yyy 目录所在的路径

```js
context：path.resolve(__dirname,"../")
entry:"./src/main.js",    //entry写相对路径时，并不是相对于该webpack文件所在的位置，而是相对于context配置的路径的，而该context配置的默认值是process.cwd()对应的值。
```

```json
"scripts":{
   "build2":"webpack --config  ./config/webpack.coomon.js --env production",
   "serve2":"webpack serve --config  ./config/webpack.coomon.js --env development",
}
```

上面这种写法的 webpack.common.js 文件写法： 加载同一个文件的区分方式

```js
const path = require('path')

module.exports = function(env){   // env中的参数来自webpack命令行中传递的参数
    console.log(env)
    cosnt isProduction = env.production   //传了就为true，没传就为undefined
    return {
        entry:"./src.main.js",  //注意当前的webpack.common.js其实是在项目根目录下的config目录中的，如果相对于该文件去找项目的入口文件的话，那其实应该写为："../src/main.js"，但是实际上时不能这样（../src/mian.js）写的。
        output:{
            path:path.resolve(__dirname, "../build")  //而这里需要写为../
        }
    }
}
```

上面的 env 打印的情况：

![image-20210925230549697](.\typora-user-images\image-20210925230549697.png)

![image-20210925230621281](.\typora-user-images\image-20210925230621281.png)

**正式介绍配置分离**

webpack.common.js:

webpack-merge -D

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { merge } = require("webpack-merge")
const prodConfig = require("./webpack.prod.js")
const devConfig = require("./webpack.dev.js")
const resolveAppPath = require('./pathUtils.js')

const commonConfig = {
    entry:'./src/main.js',
    output:{
        filename:'bundle.js',
        path:resolveAppPath('./build')
    },
    resolve:{
        extensions:['.wasm','.mjs','.js','.json','.jsx','.ts','.vue'],
        alias:{
            "@":resolveAppPath('./src'),
            "pages": resolveAppPath('./src/pages')
        }
    },
    module:{
        rules:[
            {
                test:/\.jsx?$/i,
                use:"babel-loader"
            },
            {
                test:/\.vue$/i,
                use:'vue-loader'
            },
            {
                test:/\.css$/i,
                use:[
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
    plugins:[
    	new HtmlWebpackPlugin({
    		template:"./index.html"
		}),
   		new VueLoaderPlugin()
	]
}

module.exports = function (env){
    const isProduction = env.production

    process.env.production = isProduction ? 'production':'development'    //告知Babel.config.js文件当前的环境

    return isProduction ? merge(commonConfig,prodConfig):merge(commonConfig,devConfig)   //合并配置文件的核心代码
}
```

webpack.dev.js:

```js
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
    hotOnly: true,
    compress: true,
    contentBase: path.resolve(__dirname, './my-assets'),
    watchContentBase: true,
    proxy: {
      '/api': {
        target: 'https://xxxxx:xxxx/',
        pathRewrite: {
          '^/api': ''
        },
        secure: false,
        changeOrigin: true
      }
    }
  },
  historyApiFallback: {
    rewrites: [
      {
        from: '/^/$/',
        to: '/views/index.html'
      },
      {
        from: '/./',
        to: '/views/404.html'
      }
    ]
  },
  plugins: [
    new ReactRefreshWebpackPlugin() //该插件必须和babel.config.js中的 ["react-refresh/babel"]一起使用才行
  ]
};
```

webpack.prod.js:

```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [new CleanWebpackPlugin({})]
};
```

webpack 配置文件中需要使用到的工具包：

pathUtils.js

```js
const path = require('path');

const appDir = process.cwd(); // 指令执行时所在的路径
const resolveAppPath = (relativePath) => {
  path.resolve(appDir, relativePath);
};
module.exports = resolveAppPath;
```

babel.config.js 文件的根据环境进行的配置：

```js
const presets = [['@babel/preset-env'], ['@babel/preset-react']];

const plugins = [];

const isProduction = process.env.production === 'production' ? true : false;

if (!isProduction) {
  plugins.push(['react-refresh/babel']);
}

module.exports = {
  presets,
  plugins
};
```

注意在项目的源码中的 js 文件中，可以通过 process.env.NODE_ENV 获取到当前是开发环境还是生产环境。但是在 babel.config.js 文件中，由于它并不是项目源码中的文件所以在 babel.config.js 中访问 process.env.NODE_ENV 的话，取到的值是 undefined。

路径工具包：

```js
const path = require('path');

const addDir = process.cwd();

const resolveApp = (relativePath) => {
  return path.resolve(appDir, relativePath);
};

exports.resolveApp = resolveApp;
```

`process.cwd()` 方法返回 Node.js 进程的当前工作目录

```
import { cwd } from 'process';

console.log(`Current directory: ${cwd()}`);
```

## 代码分离

之前将所有的代码都打包到一个 bundle.js 文件中，意味着这个 js 文件的体积会非常大。其中包括业务代码，webpack 相关的代码和框架和第三方包的代码都打包到一个 js 文件中了。当浏览器首次加载该 js 文件时就会导致速度较慢。在开发中，常常选择将大的 js 文件拆分为许多小的 js 文件，之后就可以按需加载。

![image-20210926223820186](.\typora-user-images\image-20210926223820186.png)

webpack.common.js 文件中：

### 方式一：

```js
const path  = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { merge } = require("webpack-merge")
const prodConfig = require("./webpack.prod.js")
const devConfig = require("./webpack.dev.js")

const commonConfig = {
    //多入口文件
    entry:{
    	main:"./src/main.js",  // +++++++++++++++++++++++++++++++
        index:"./src/host.js"   // +++++++++++++++++++++++++++++++
    },

    //多出口文件
    output:{
        filename:'[name].bundle.js',    // +++++++++++++++++++++++++++++++
        path:path.resolve(__dirname,'../build')
    },
    resolve:{
        extensions:['.wasm','.mjs','.js','.json','.jsx','.ts','.vue'],
        alias:{
            "@":path.resolve(__dirname,"../src"),
            "pages":path.resolve(__dirname,"../src/pages")
        }
    },
    module:{
        rules:[
            {
                test:/\.jsx?$/i,
                use:"babel-loader"
            },
            {
                test:/\.vue$/i,
                use:'vue-loader'
            },
            {
                test:/\.css/i,
                use:[
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
    plugins:[
    	new HtmlWebpackPlugin({
    		template:"../index.html"
		}),
   		new VueLoaderPlugin()
	]
}

module.exports = function (env){
    const isProduction = env.production

    process.env.production = isProduction ? 'production':'development'    //告知Babel.config.js文件当前的环境

    return isProduction ? merge(commonConfig,prodConfig):merge(commonConfig,devConfig)   //合并配置文件的核心代码
}
```

### 方式二：

entry dependencise(入口依赖)

![image-20210926230934747](.\typora-user-images\image-20210926230934747.png)

![image-20210926231003585](.\typora-user-images\image-20210926231003585.png)

打包结果：

![image-20211007153218173](.\typora-user-images\image-20211007153218173.png)

### 方式三：

SplitChunks

![image-20210927085132251](.\typora-user-images\image-20210927085132251.png)

![image-20220307223059758](.\typora-user-images\image-20220307223059758.png)

![image-20210927182244689](.\typora-user-images\image-20210927182244689.png)

async：对异步导入的模块进行分包

initial：对同步导入的模块进行分包

all：对同步和异步导入的模块都进行分包（常用）

![image-20210927182313513](.\typora-user-images\image-20210927182313513.png)

![image-20210927182327321](.\typora-user-images\image-20210927182327321.png)

```js
const path  = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { merge } = require("webpack-merge")
const prodConfig = require("./webpack.prod.js")
const devConfig = require("./webpack.dev.js")
const TerserPlugin = require("terser-webpack-plugin")

const commonConfig = {
    //多入口文件
    entry:{
    	main:"./src/main.js",   // +++++++++++++++++++++++++++++++++
        index:"./src/host.js"    // +++++++++++++++++++++++++++++++++
    },

    //多出口文件
    output:{
        filename:'[name].bundle.js',
        path:path.resolve(__dirname,'../build')
    },
    resolve:{
        extensions:['.wasm','.mjs','.js','.json','.jsx','.ts','.vue'],
        alias:{
            "@":path.resolve(__dirname,"../src"),
            "pages":path.resolve(__dirname,"../src/pages")
        }
    },
    module:{
        rules:[
            {
                test:/\.jsx?$/i,
                use:"babel-loader"
            },
            {
                test:/\.vue$/i,
                use:'vue-loader'
            },
            {
                test:/\.css/i,
                use:[
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    optimization:{
      //对代码进行压缩
      minimizer:[
          new TerserPlugin({
              extractComments:false
          })，

      ],
      splitChunks:{
          //chunks:"async"   //表示对异步操作进行分离
          //chunks:"initial"   //表示对同步代码进行分离
          chunks:"all",  //表示对同步和异步的代码都进行分离    // +++++++++++++++++++++++++++++++++


          //其他常见的配置属性   // +++++++++++++++++++++++++++++++++
          minSize:2000,  //拆包时最小包的最小体积必须是20kb以上，拆包的体积达不到20kb则默认不拆（优先级更高） // +++++++++++++++++++++++++++++++++
          maxSize：4000,  // 将大于40kb的包拆分为多个体积不小于20kb的包  // +++++++++++++++++++++++++++++++++

          minChunks:2,  //表示要拆的包在至少两个chunk中被引入过才会被拆包，在多入口项目中使用 // +++++++++++++++++++++++++++++++++

          cacheGroups:{   //缓存组:指的是符合条件的所有合并为一个单独的包  // ++++++++++++++++++++++++
              vendor:{
                  test: /[\\/]node_modules[\\/]/,   // test的值是路径时，表示全部来自该路径下的包都被打包为一个文件vendor中，[\\/]是兼容windows和mac的写法，取/或\
                  filename:"[id]_vendors.js",     //匹配到的所有包 统一打包到该文件
                  priority:-10   //优先级，数值越大优先级越高
              },
              自定义要拆出来的包的包名：{
              		test：/filename/,
              		filename:"[id]_自定义包名.js",

          	  },
          	  bar:{
                test:/bar/,
                filename:'[id]_bar.js'
              },
          	  default:{
                minChunks:2,   //表示一个包至少被引用几次才能被拆包
              	filename:"common_[id].js",
                priority:-20
              }
          }
      }
    },
    plugins:[
    	new HtmlWebpackPlugin({
    		template:"../index.html"
		}),
   		new VueLoaderPlugin()
	]
}

module.exports = function (env){
    const isProduction = env.production

    process.env.production = isProduction
    return isProduction ? merge(commonConfig,prodConfig):merge(commonConfig,devConfig)
}
```

![image-20210927085306746](.\typora-user-images\image-20210927085306746.png)

vue 脚手架中的 splitChunks：

![image-20210927091739763](.\typora-user-images\image-20210927091739763.png)

React 脚手架中的 splitChunks：

![image-20210927091822756](.\typora-user-images\image-20210927091822756.png)

一般项目中的同步引入的代码，一般框架中都可能拆包出来 4 个 js 文件：

- main.js
- vendor_chunks.js:在 vue 项目中该打包后的文件存放的是第三方的包文件
- common_chunks.js: 在 vue 项目中有多个入口文件文件时，在每个文件 chunk 中都引入过的包就拆分到这个 js 文件中（在 SPA 应用中是不存在的）
- runtime.js

### import 动态导入的拆包

![image-20210927183013405](.\typora-user-images\image-20210927183013405.png)

在项目中通过 import 函数动态导入其他模块，这是一个异步的操作。在 webpack 项目中，只要是异步导入的代码，webpack 都会进行代码分离并生成一个单独的文件，不论 splitChunks 中 chunks 的值是什么，并且不论动态导入的 js 模块的代码的大小。

路由懒加载和组件懒加载时常用 import 函数语法引入，这样就能自动让 webpack 分包。每个 import 动态引入的模块都会被 webpack 单独拆分打包为一个 js 文件。

注意：

**在 webpack 中，通过 import 动态导入获取到一个对象，真正导出的内容在该对象的 default 属性中，所以需要做一个简单的解构。**

动态打包的 js 的命名问题：

动态导入的模块一定会打包成独立的文件，而不会采用 cacheGroups 中的配置，那么对动态导入的模块的打包文件的命名，一般会在 output 中，通过 chunkFilename 属性来命名。

```js
output:{
    filename:"[name].bundle.js",
    path:resolveApp("./build"),
    chunkFilename:"chunk_[id]_[hash:6]_[name].js"   // 如果没写这项，则打包文件命名参考filename的格式
}
```

但是默认情况下 chunkFilename 中 name 的值和 id 的值是一样的，如果希望采用指定的名字的花，可以通过魔法注释的方式实现。

- optimization.chunkIds 告知 webpack 当选择模块 id 时需要使用哪种算法。将 `optimization.chunkIds` 设置为 `false` 会告知 webpack 没有任何内置的算法会被使用，但自定义的算法会由插件提供。`optimization.chunkIds` 的默认值是 `false`。

  如果环境是开发环境，那么 `optimization.chunkIds` 会被设置成 `'named'`, 但当在生产环境中时，它会被设置成 `'deterministic'`

  如果上述的条件都不符合, `optimization.chunkIds` 会被默认设置为 `'natural'`

  | 选项值 | 描述 |
  | :-- | :-- |
  | `'natural'` | 按使用顺序的数字 id。不足：文件名没有语义，不利于缓存 |
  | `'named'` | 对调试更友好的可读的 id。使用包所在目录作为文件名，推荐在开发环境使用 |
  | `'deterministic'` | 在不同的编译中不变的短数字 id。文件内容不变，id 不变，有益于长期缓存。在生产模式中会默认开启。 |
  | `'size'` | 专注于让初始下载包大小更小的数字 id。 |
  | `'total-size'` | 专注于让总下载包大小更小的数字 id。 |

  - natural (使用自然数作为拆包文件名名称一部分，一个导入的文件被去除后，下次打包后面的模块会重新依次变更文件名重新命名，这样不利于缓存)

    ![image-20210927222032877](.\typora-user-images\image-20210927222032877.png)

  - named（使用包所在的目录作为拆包后 js 文件的名称，开发环境推荐使用）

    ![image-20210927222329169](.\typora-user-images\image-20210927222329169.png)

  - deterministic（使用算法生成的 id 作为文件名，对于相同的文件生成的 id 是不变的，生产环境推荐使用）

    ![image-20210927223419528](.\typora-user-images\image-20210927223419528.png)

在 output 配置项中 chunkFilename 字段是专门用来设置项目中 import 语法异步加载的包的打包后生产的包的包名的。

```js
output: {
  //...
  chunkFilename: '[name].chunk.js'; //默认情况下name是算法生成的id
}
```

![image-20210927223925530](.\typora-user-images\image-20210927223925530.png)

如果想要设置拆包文件的文件名是通过——magic comments (魔法注释)，webpack 在解析到异步加载的模块时，也会解析到异步模块对应的魔法注释，将魔法注释中设置的文件名作为打包后文件的文件名。

魔法注释的写法：

```js
import(/* webpackChunkName:"myname"*/"./foo").then(res=>{
    ......
})
```

在 vue 项目中，对于路由组件的异步导入就是这样做的。

```js
const Foo = () => import('./Foo.vue');

const router = new VueRouter({
  routes: [{ path: '/foo', component: Foo }]
});

const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue');
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue');
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue');
```

![image-20210927231217568](.\typora-user-images\image-20210927231217568.png)

**import 动态导入某一个文件模块最常用在代码懒加载**

代码懒加载的案例：

提前设置一些元素，单击某个元素会展示特定的页面部分，同时刚开始会有一个默认的页面部分被展示。默认非初始页面部分的内容不需要加载。等点击相应的按钮后再加载对应的页面内容。

![image-20210927183516972](.\typora-user-images\image-20210927183516972.png)

上面这种懒加载的不足：在对应元素的相应事件被触发后，才会动态的去导入某个文件并解析执行。但是这个过程有主要的两大步：1. 先去服务器下载对应的模块代码； 2.对下载回来的代码进行解析执行。 所以由于会请求服务器资源，所以过程可能较为缓慢。

希望的做法：

在显示首屏内容时对应的其他异步模块的内容一开始是不随着首屏的资源一起下载（加载）到本地浏览器的，但是在首屏的内容加载显示完后，浏览器利用空余时间提前下载其他模块需要使用的资源。之后再点击图标后就不用下载，直接交给浏览器解析执行并渲染就行。

/ _ webpackPrefetch: true _ / ：预获取（常用）

为了达到这个目的，需要做的是利用魔法注释告知 webpack 进行单独配置。

```js
import(
    /* webpackChunkName:'mybundle'*/
    /* webpackPrefetch: true */    //设置这段魔法注释后，在打包后的项目中，在所有主要的资源都加载成功后，最后会加载这个异步引入的模块代码
    "./element").then(res=>{
    ......
})
```

/ _ webpackPreload: true _ / ：预加载

与 prefetch 指令相比，preload 指令有许多不同之处：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
- 浏览器支持程度不同。

对于懒加载，并非所有的文件都需要使用懒加载的能力。对于一些很少可能性被用户使用的模块，如果采用预获取或者预加载的方式的话，反而可能浪费用户的流量和性能。

注意：

```js
import xxx from './xxxx/xx.js'; //这种方式是同步导入的，如果要拆包的话，需要主动在webpack中设置，通过webpack配置文件中的optimization字段中的splitChunks的不同字段来确定同步模块或者异步模块的打包规则

import('./xxx/xx.js'); //异步动态导入模块，这时即使自己不做任何配置，webpack也会自动拆包分包这些异步导入模块，通过魔法注释和在output中设置chunkFilename 来指定拆包后的文件的名字。
```

![image-20210928092543927](.\typora-user-images\image-20210928092543927.png)

![image-20210928092525959](.\typora-user-images\image-20210928092525959.png)

optimization.runtimeChunk 配置：

该属性决定是否把一些运行时的代码抽离到一个单独的文件中。 对于项目中的需要 import 加载的模块， webpack 有一系列的代码是专门用于处理动态加载其他模块。而这一系列的代码默认是放在打包后的主模块文件中的，比如打包后生成的 bundle.js.

如果想将这一系列的代码进行抽离，可以配置 runtimeChunk。

![image-20210928095251597](.\typora-user-images\image-20210928095251597.png)

```js
runtimeChunk:true     //true等价于设置multiple

runtimeChunk:'single'


runtimeChunk:{
    name:'my-runtimefile-name'
}

runtimeChunk:{
    name:function(entryPoint){
        return `my-${entryPoint.name}`
    }
}
```

## CDN

![image-20210928110633501](.\typora-user-images\image-20210928110633501.png)

![image-20210928113025243](.\typora-user-images\image-20210928113025243.png)

将第三方的库配置到 CDN 中，将自己项目的源码打包的文件放在自己的服务器中。接下来要做的就是第三方库的路径修改为 cdn 路径。找到项目中使用到的第三方库，配置它的 extenals 属性，用来排除打包的模块。在打包生成的项目代码中就没有了排除模块的代码了，用户拿到打包后代码并不能直接运行，为此需要在 html 模板中引入排除模块包的 cdn 地址。

```js
output：{
    //...
},
externals:{    //该配置项放在生成环境打包的配置文件中
    lodash:"_",     //key是要排除打包的第三方库，value是指该库向外暴露的全局对象
    dayjs:"dayjs"
}
```

在模板 html 文件中手动添加对应包的 cdn 地址。

![image-20210928130702203](.\typora-user-images\image-20210928130702203.png)

webpack 在打包完项目后，会将打包后生成的 js 资源通过 script 标签的形式放在 head 标签的内部的最后面的。

![image-20210928131220918](.\typora-user-images\image-20210928131220918.png)

注意在开发环境下不需要对第三方库使用 cdn 连接的形式引入，这样的效率低。**在将 externals 移动到生产环境下后**，**如何避免模板 html 中引用的 cdn 文件的 script 标签无效。**

```js
externals:{    //该配置项放在生成还击打包的配置文件中
    lodash:"_",     //key是要排除打包的第三方库，value是指该库向外暴露的全局对象
    dayjs:"dayjs"
}
```

模板 html 中：

```html
ejs语法中的判断语句 <% if(process.env.NODE_ENV ==="production"){%>
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
...... <% }%>
```

## shimming 预支全局变量

![image-20210928133529454](.\typora-user-images\image-20210928133529454.png)

![image-20210928133540466](.\typora-user-images\image-20210928133540466.png)

![image-20210928133610940](.\typora-user-images\image-20210928133610940.png)

## 抽取 CSS

npm intall mini-css-extract-plugin -D

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //这个插件需要使用在两个地方，插件定义出的和loader定义处

module: {
  rules: [
    {
      test: /\.css$/i,
      use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
    }
  ];
}

plugins: [
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:6].css'
  })
];
```

注意：

```js
const isProduction = undefined

console.log(!isProduction)   //true

process.env.isProduction = isProduction
console.log(!process.env.isProduction)  //  false
console.log( process.env.isProduction , typeof process.env.isProduction )  //undefined  string

console.log(env)

process.env.abc = 123
console.log(process.env.abc,  typeof process.env.abc)  //123  string


结论：只要是往process.env中添加任何属性，都会自动转为对应的字符串格式。注意只是对于node.js中的env对象而言，往它内部添加属性，属性对应的属性值默认会被node存为其对应的字符串。
```

## hash、ContentHash、ChunkHash

文件指纹：

指纹占位符号

| 占位符名称  | 含义                                                          |
| ----------- | ------------------------------------------------------------- |
| ext         | 资源后缀名                                                    |
| name        | 文件名称                                                      |
| path        | 文件的相对路径                                                |
| folder      | 文件所在的文件夹                                              |
| hash        | 每次 webpack 构建时生成一个唯一的 hash 值                     |
| chunkhash   | 根据 chunk 生成 hash 值，来源于同一个 chunk，则 hash 值就一样 |
| contenthash | 根据内容生成 hash 值，文件内容相同 hash 值就相同              |

- Hash 是整个项目的 hash 值，其根据每次编译内容计算得到，每次编译之后都会生成新的 hash,即修改任何文件都会导致所有文件的 hash 发生改变,如果项目中没有任何文件变化，则 hash 值不变。

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
+  entry: {
+    main: './src/index.js',
+    vender:['lodash']
+  },
  output:{
    path:path.resolve(__dirname,'dist'),
+    filename:'[name].[hash:4].js'
+    filename:'[name].[chunkhash:4].js'
  },
  devServer:{
    hot:false
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader:'thread-loader',
            options:{
              workers:3
            }
          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
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
+      filename: "[name].[hash:4].css"
+      filename: "[name].[chunkhash:4].css"
+      filename: "[name].[contenthash:4].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ],
};
```

- chunkhash 采用 hash 计算的话，每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。这样子是没办法实现缓存效果，我们需要换另一种哈希值计算方式，即 chunkhash,chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

- 使用 chunkhash 存在一个问题，就是当在一个 JS 文件中引入 CSS 文件，编译后它们的 hash 是相同的，而且只要 js 文件发生改变 ，关联的 css 文件 hash 也会改变,这个时候可以使用`mini-css-extract-plugin`里的`contenthash`值，保证即使 css 文件所处的模块里就算其他文件内容改变，只要 css 文件内容不变，那么不会重复构建

![image-20220702132035199](.\typora-user-images\image-20220702132035199.png)

模拟 hash 值得生成：

```js
function createHash() {
  return require('crypto').createHash('md5');
}
let entry = {
  entry1: 'entry1',
  entry2: 'entry2'
};
let entry1 = 'require depModule1'; //模块entry1
let entry2 = 'require depModule2'; //模块entry2

let depModule1 = 'depModule1'; //模块depModule1
let depModule2 = 'depModule2'; //模块depModule2
//如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效
let hash = createHash()
  .update(entry1)
  .update(entry2)
  .update(depModule1)
  .update(depModule2)
  .digest('hex');
console.log('hash', hash);

//chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
//在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
let entry1ChunkHash = createHash().update(entry1).update(depModule1).digest('hex');
console.log('entry1ChunkHash', entry1ChunkHash);

let entry2ChunkHash = createHash().update(entry2).update(depModule2).digest('hex');
console.log('entry2ChunkHash', entry2ChunkHash);

let entry1File = entry1 + depModule1;
let entry1ContentHash = createHash().update(entry1File).digest('hex');
console.log('entry1ContentHash', entry1ContentHash);

let entry2File = entry2 + depModule2;
let entry2ContentHash = createHash().update(entry2File).digest('hex');
console.log('entry2ContentHash', entry2ContentHash);
```

在打包某一些文件时，比如代码分割的第三方包文件，css 文件用 contenthash 都是更合适的，js 文件使用 chunkHash（最佳实践）。

## moduleIds & chunkIds 的优化

- module: 每一个文件其实都可以看成一个 module
- chunk: webpack 打包最终生成的代码块，代码块会生成文件, 一个 chunk 对应一个文件
- 在 webpack5 之前，**没有**从 entry 打包的 chunk 文件，都会以 1、2、3...的文件命名方式输出,删除某些些文件可能会导致缓存失效
- 在生产模式下，默认启用这些功能 chunkIds: "deterministic", moduleIds: "deterministic"，此算法采用`确定性`的方式将短数字 ID(3 或 4 个字符)短 hash 值分配给 modules 和 chunks
- chunkId 设置为 deterministic，则 output 中 chunkFilename 里的[name]会被替换成确定性短数字 ID
- 虽然 chunkId 不变(不管值是 deterministic | natural | named)，但更改 chunk 内容，chunkhash 还是会改变的

| 可选值        | 含义                           | 示例          |
| :------------ | :----------------------------- | :------------ |
| natural       | 按使用顺序的数字 ID            | 1             |
| named         | 方便调试的高可读性 id          | src_two_js.js |
| deterministic | 根据模块名称生成简短的 hash 值 | 915           |
| size          | 根据模块大小生成的数字 id      | 0             |

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

## DLL

DLL:动态链接库（Dynamic Link Library）,指的是可以将共享的且不经常改变的代码单独对这部分代码做一次编译，抽取成一个共享的库，让项目直接引用编译好的库即可。意味着之后再编译项目时，不再需要对那部分代码进行编译。

第一步：

- 先将需要共享的库打包为一个 DLL 库

第二步：

- 在其它需要使用到该库的项目中引入就可以

**配置生成 DLL 库：**

![image-20210929092757296](.\typora-user-images\image-20210929092757296.png)

在升级到 webpack4 之后，React 和 Vuejs 脚手架都移除了 DLL 库。

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['react', 'react-dom'], //入口指的是那些需要打包为DLL的库，比如react 和 react-dom
  output: {
    path: path.resolve(__dirname, './dll'),
    filename: '[name].dll.js',
    library: '[name].dll' //一般情况下，当将项目作为一个DLL库时会设置这个属性,表示包名
  },
  plugins: [
    //DllPlugin用于打包生成dll库 ，而另一个DllReferencePlugin则是在使用dll时表示要应用哪一个dll包
    new webpack.DllPlugin({
      name: '[name].dll', //打包的DLL库时使用的包名
      path: path.resolve(__dirname, './dll/[name].mainfest.json')
      // 表示使用哪一个DLL库，生成一个对应的mainfest文件和生成的位置。该json文件可以对上面打包的的DLL库做描述，别的项目在引用DLL库时可以根据mainfest.json去找到对应的DLL库，在使用该DLL库
    })
  ]
};
```

![image-20210929085554060](.\typora-user-images\image-20210929085554060.png)

webpack --config 上面的配置文件名： 打包生成 DLL 库。

**使用：**

![image-20210929092833890](.\typora-user-images\image-20210929092833890.png)

在要使用 DLL 库的项目中将上面打包生成的 dll 目录复制粘贴到当前项目的根目录下。

注意，在该项目中虽然之后打包时会跳过对 DLL 库中的模块的打包，但是本项目仍然需要下载安装对应的包，为的是不让项目中的 import 语句报错。webpack 只是在打包时会跳过对应的 DLL 库中的模块。

使用 DLL 的项目中的 webpack 配置：

通过一个插件，让项目打包时去引入刚刚复制粘贴到该项目下的 dll 目录中的内容。

```js
plugins: [
  new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, './dll/react.manifest.json')
  })
];
```

![image-20210929091026001](.\typora-user-images\image-20210929091026001.png)

在配置完上面的代码进行项目打包后，打包后的项目中将不再有对应的 dll 库中存在的模块。但是这时如果直接去运行项目的话，仍然是无法直接运行的。

![image-20210929091553327](.\typora-user-images\image-20210929091553327.png)

现在已经告知项目通过查找 dll 库中的 mainfest.json 文件，但是具体的 dll 库的引入依然是需要插入到 index.html 模板中的，如果没有插入，则在现有的项目打包的源码中仍然是缺少对应的 dll 中的库文件的。

**向模板 html 中插入对应的 dll 中的对应 js 库**

npm install add-asset-html-webpack-plugin -D

```js
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

plugins: [
  new AddAssetHtmlWebpackPlugin({
    filepath: path.resolve(__dirname, '../dll/react_dll.js') //该插件进行的操作相当于将dll目录下的对应的库复制到打包后生成的目录（build）下（没有放在更内存的目录中），并在模板HTML中插入对应的库文件
  })
];
```

![image-20210929093440320](.\typora-user-images\image-20210929093440320.png)

## Terser

**注意 css 和 js 代码的压缩在 mode 为生成模式下时，不用手动配置，webpack 会自动启用。**

terser 是 JavaScript 的一个解释器，丑化和压缩代码的工具集。早期对代码进行压缩使用的是 uglify-js 来压缩和丑化，但现在已经不再维护并且不支持 ES6+的语法。

npm install terser :这样安装后会安装一个他对应的 cli 工具。

命令行中使用 terset：

npx terser inputfilename -o outputfilename -x(其他参数)

![image-20210929144717288](.\typora-user-images\image-20210929144717288.png)

```js
const TerserPlugin = require('terser-webpack-plugin')

optimization:{
    minimize:true,    //在minimize为true的情况下，minimizer才生效
    minimizer:[
        new TerserPlugin({
            extractComments:false,    //是否将注释剥离到单独的文件中
            parallel:true,   //能开启多核处理器打包
            terserOptions:{
                ....
            }
        })
    ]
}
```

![image-20210929152837773](.\typora-user-images\image-20210929152837773.png)

![image-20210929152626267](.\typora-user-images\image-20210929152626267.png)

## 对 CSS 的压缩(常在生成环境使用)

方式一：

npm install css-minimizer-webpack-plugin -D

```js
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin ');

plugins: [new CssMinimizerWebpackPlugin()];
```

方式二：

npm install optimize-css-assets-webpack-plugin -D

```js
const OptiCss = require('optimize-css-assets-webpack-plugin');

plugins: [new OptiCss()];
```

## 压缩 HTML

```js
plugins: [
  new HtmlWebpackPlugin({
    tempalte: './src/index.html',
    minify: {
      removeComments: true
      // ...
    }
  })
];
```

## Scope Hosting

![image-20210929155505451](.\typora-user-images\image-20210929155505451.png)

```
const webpack = require('webpack');


plugins: [
    new CleanWebpackPlugin(),
    new CssMinimizerWebpackPlugin(),
+   new webpack.optimize.ModuleConcatenationPlugin()
  ]
```

扩展：

在导入 npm 安装的第三方库的时候，具体加载的包的入口文件一般会在包的 package.json 中的特定字段指定。

当从 npm 包中导入模块时（例如，`import * as D3 from 'd3'`），此选项将决定在 `package.json` 中使用哪个字段导入模块。根据 webpack 配置中指定的 [`target`](https://webpack.docschina.org/concepts/targets)同。

当 `target` 属性设置为 `webworker`, `web` 或者没有指定：

**webpack.config.js**

```
module.exports = {
  //...
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  },
};
```

## Tree Shaking

**JavaScript 的 tree shaking**

消除项目中没有被调用过的代码。tree shaking 依赖于 ES Module 的静态语法分析（即在不执行任何代码的情况下就能明确模块之间的依赖关系）。

webpack 中实现 tree shaking 的两种不同的方案：(主要针对 JavaScript 代码)

![image-20210929160730738](.\typora-user-images\image-20210929160730738.png)

- 方案一：usedExports

  ![image-20210929161449178](.\typora-user-images\image-20210929161449178.png)

  ![image-20210929161549195](.\typora-user-images\image-20210929161549195.png)

- 方案二：sideEffects

  ![image-20210929162641713](.\typora-user-images\image-20210929162641713.png)

![image-20220324192851014](.\typora-user-images\image-20220324192851014.png)

**css 的 tree shaking**(常在生产环境下使用)

npm install purgecss-webpack-plugin -D ：在安装该插件的时，会顺带安装 PurgeCSS 这个工具库。所以就不用单独再次安装 PurgeCSS 了。

对 css 的 tree shaking 本质是使用 PurgeCSS 这个工具库来实现的。

![image-20210929171310040](.\typora-user-images\image-20210929171310040.png)

```js
const PurgeCssWebpackPlugin = require('purgecss-webpack-plugin');
const glob = require('glob'); //glob库一般不用手动安装其他库也依赖了它，对文件或者文件名通过正则表达式进行匹配

plugins: [
  new PurgeCssWebpackPlugin({
    //paths:表示哪个目录中的源码需要做css的tree shaking，不仅仅只是针对css文件
    paths: glob.sync(`${path.resolve(__dirname, '../src')}/**/*`, { nodir: true }),
    safelist: function () {
      return {
        standard: ['html', 'body'] //表示排除那些css选择器的tree shaking
      };
    }
  })
];
```

## HTTP 压缩

![image-20210929181413091](.\typora-user-images\image-20210929181413091.png)

npm install compression-webpack-plugin -D

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

plugins: [
  new CompressionWebpackPlugin({
    threshold: 0, //文件的代码量很小的情况下，是不会进行压缩的
    test: /\.(css|js)$/i, //对所有的css和js文件进行压缩
    minRatio: 0.8, //代码压缩的最小比例（压缩后文件大小/原文件大小），如果压缩后的文件的大小比上源文件大小没办法达到指定的压缩比例的话，则不再压缩源文件。
    algorithm: 'gzip' //使用的压缩算法
  })
];
```

HTML 文件代码压缩

```js
plugins:[
	new HtmlWebpackPflugin({
        template:'./index.html',
        inject:true,  //设置打包后的静态资源是否插入到打包后的html模板中或者如何插入 。值：false、head、body
        cache:true,
        minify:isProduction?{
            removeComments:true,
            ....
        }:false
    })
]
```

![image-20210929195654337](.\typora-user-images\image-20210929195654337.png)

将打包的资源注入到 html 中(生产环境使用)：inlinechunkhtmlplugin

react-dev-utils -D

```js
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new CleanWebpackPlugin(),
  new CssMinimizerWebpackPlugin(),
  new CompressionWebpackPlugin({
    threshold: 0,
    test: /\.(css|js)$/i,
    minRatio: 0.8,
    algorithm: 'gzip'
  }),
  new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.*\.js/])
];
```

webpack 用于开发第三方库：

使用 ES6 module 或者 commonjs 模块化开发的源代码，希望别人可以通过 npm 下载后在不同的环境（浏览器，node）中使用。使用 webpack 作为打包工具的方法：

npm install webpack webpack-cli -D

```js
const path = require('path')

module.exports={
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist')
        filename:'vue.js',
+       libraryTarget:'umd',
+       library:'Vue',
+       globalObject:'this'   // 'document'
    }
}
```

以上就是 webpack 配置部分的课程内容

## 打包分析

打包的时间分析

默认情况下 webpack 会给开发者一个总的打包时间，并没有说明加载每个模块的耗时或者在用某个插件时该插件的耗时。

![image-20210929212250763](.\typora-user-images\image-20210929212250763.png)

控制台输出的时间：

![image-20210929212303795](.\typora-user-images\image-20210929212303795.png)

## 费时分析

npm install speed-measure-webpack-plugin -D

使用：

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();

module.export = smw({
  // webpack的配置对象
});
```

打包文件的体积分析：

将所有打包后生成的文件的信息生成在一个文件中。之后在该文件中查看文件大小。

```json
  "script":{
      "status":"webpack --config ./webpack/webpack.common.js --env production --profile --json=status.json"
  }
```

![image-20220324234019680](.\typora-user-images\image-20220324234019680.png)

![image-20220324234045319](.\typora-user-images\image-20220324234045319.png)

![image-20220324234111764](.\typora-user-images\image-20220324234111764.png)

![image-20220324234149593](.\typora-user-images\image-20220324234149593.png)

![image-20220324234207210](.\typora-user-images\image-20220324234207210.png)

![image-20220324234617896](.\typora-user-images\image-20220324234617896.png)

[网址](https://webpack.js.org/guides/code-splitting/#bundle-analysis)

[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

![image-20220324235113412](.\typora-user-images\image-20220324235113412.png)

webpack-bundle-analyzer -D

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

plugins: [new BundleAnalyzerPlugin()];
```

结果图：

![image-20220324235024265](.\typora-user-images\image-20220324235024265.png)

webpack 的打包过程

plugin 会在哪些阶段被调用

module 在解析时是如何解析的

### React 脚手架分析

React 脚手架的运行机制。脚手架的运行使用 react-scripts

## webpack 的启动流程

![image-20210929215117195](.\typora-user-images\image-20210929215117195.png)

## webpack 源码

## webpack 插件机制

实现插件的大体步骤：

- 创建：webpack 在其内部对象上创建各种钩子
- 注册：插件将自己的方法注册到对应的钩子上，交给 webpack
- 调用：webpack 编译的过程中会自动的触发相应的钩子，即触发插件的方法，实现额外的逻辑

webpack 本质上是一种事件流机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例。

通过事件的注册和监听，触发 webpack 生命周期中的函数方法。

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

// tapable中一共九个钩子
```

![image-20210930091350586](.\typora-user-images\image-20210930091350586.png)

## 自定义 Loader

Loader 是用于对模块的源码进行转换的。本质是一个 JS 模块，它导出一个函数。loader runner 库负责调用该函数，并将上一个 loader 产生的结果或者资源文件传入。

```js

```

## Tapable

webpack 中有两个非常重要的类：Compiler 和 Compilation。

这两个类通过 Hook 注入插件的方式，来监听 webpack 的所有生命周期。而 Compiler 和 Compilation 通过创建 Tapable 中各种 kooh 实例来得到 hook。

数据类型

null 和 undefined

- 是否是关键字
- 默认赋值
- 垃圾回收赋值

  0.1+0.2 != 0.3 ,衍生问题：对比两个数（小数）字是否相等的方法

|a-b| <0.000000001

## webpack 面试

- 前端项目部署上线

- webpack 配置文件如何拆分与合并

- webpack-dev-serve 是什么和怎么做代理

- 样式文件如何处理和浏览器前缀兼容，抽离 css 样式

- 图片资源的处理

- 多入口文件

- 抽离公共代码（公共模块代码或者第三方模块代码）

### 与 webpack 类似的工具还有哪些，同时你为什么选择 webpack（考察面试者是否沉淀，资深，经验丰富）

1. grunt：自动化，对于需要反复重复的任务，比如压缩，编译，单元测试和 linting 等，简化工作。使用 Gruntfile 配置文件配置好任务，任务运行期就会自动的完成相应的任务，最早的打包工具，通过配置进行打包。
