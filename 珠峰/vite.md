# Vite

- 简单使用
- 工作原理
- 具体实现

## 定义

vite是下一代前端开发和构建工具。

vite的特点：

1. 启动速度快，webpack启动慢是因为需要编译打包文件
1. 使用原生的ESM文件，无需打包
1. 快速的热更新（HMR）
1. 对ts，less，scss，jsx等开箱即用
1. 打包构建使用的是rollup，所以可以复用rollup插件
1. 支持ts语法提示

vite在开发环境下使用esbuild打包，在生成环境下用rollup打包。



## 基本使用

@vitejs/plugin-vue库让vite支持vue。

```shell
mkdir vite-learn
npm intall vite @vitejs/plugin-vue vue -S
```



 vite.config.js:

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});

```



package.json:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}    
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
    <div id="app"></div>
    <script src="./src/main.js" type="module"></script>
  </body>
</html>
```



src/main.js:

```js
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```



App.vue:

```vue
<template>
  <h1>App</h1>
</template>
```



简单解释一下vite的开发环境打包工作要点：

1. 当运行npm run dev后，启动一个本地项目的服务器，vite会以index.html文件为入口， 找到html中的main.js，再分析main.js文件中的依赖包，如果依赖包是第三方库，那vite回去node_modules中找到对应的库，读取里面package.json中的module字段指向的文件（如果有的话），以该文件作为来源打包（同时该文件中依赖的其他文件也会被一并打包），如果没有，同时源文件是commonjs 的话，需要转为esmodule格式

2. 将上面找到的文件及其依赖整体打包放到node_modules中的.vite/deps中，名字就是对应的库的名字

   ![image-20230512202323634](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/vite.images/image-20230512202323634.png)

   内部的_metadata.json中存放着原第三方依赖库的基本数据

   ```js
   {
     "hash": "6fd45ff7",
     "browserHash": "79a0c776",
     "optimized": {
       "vue": {
         "src": "../../vue/dist/vue.runtime.esm-bundler.js",  // 库的源文件地址
         "file": "vue.js",
         "fileHash": "290fd2b2",
         "needsInterop": false
       }
     },
     "chunks": {}
   }
   ```

   这个库文件——vue.runtime.esm-bundler.js是vue3的运行时的ESmodule版本文件。同时vue的源码库中的package.json中的module字段也是执行这个库文件的。如下图：

   ![image-20230512203013465](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/vite.images/image-20230512203013465.png)



4. 当浏览器启动来访问本地开发服务器时，先请求index.html，再请求其中的main.js，而main.js中引用的第三方包的地址将变为node_modules/.vite/deps中对应的库文件。如下图：

   ![image-20230512203753292](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/vite.images/image-20230512203753292.png)

   ![image-20230512203810995](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/vite.images/image-20230512203810995.png)



> 注意：如果第三方库不支持es module，则需要进行转换后才能使用，内部进行转换。





## Esbuild

vite在开发环境打包是用的Esbuild，[ESbuild](https://esbuild.github.io/api/) 是一款基于 Golang 开发的一款打包工具，相比传统的打包工具，主打性能优势，在构建速度上可以快 10~100 倍。

![img](https://static.zhufengpeixun.com/ESbuild_1653147079963.jpeg)



```shell
npm install esbuild -D
```



main.js:

```js
console.log("title");
```



esbuild.js:

```js
require("esbuild").buildSync({  // 以同步的方式编译文件
  entryPoints: ["main.js"],  // 入口文件
  outfile: "out.js",  // 打包生成文件
});
```





### esbuild内容类型

- [content-types](https://esbuild.github.io/content-types/#javascript)
- 每个内容类型（可以理解为每种文件类型）都有一个关联的`加载器`，加载器会告诉 esbuild 如何解释文件内容。默认情况下，某些文件扩展名已经为它们配置了加载器，但是可以覆盖默认值，类似于webpack中的各种类型文件的loader。

js文件的加载器是js，ts文件的加载器是ts或者tsx，jsx文件的加载器是jsx或者tsx，json的文件用json加载，css的是css等等。

![image-20230512220730488](C:/Users/shuyi/Desktop/study-notes/%E7%8F%A0%E5%B3%B0/vite.images/image-20230512220730488.png)



使用：

main.js

```js
let title = <h1>hello</h1>;
console.log(title);
```



esbuild.js

```js
require("esbuild").buildSync({
  entryPoints: ["main.js"],
  bundle: true,
  loader: { ".js": "jsx" },  // +++++++++ js类型的文件用jsx加载器来加载
  outfile: "out.js",
});
```



out.js：

```js
let title = /* @__PURE__ */ React.createElement('h1',null,'hello');
console.log(title);
```





### Esbuild插件

- [plugins](https://esbuild.github.io/plugins/#finding-plugins)
- [plugins](https://github.com/esbuild/community-plugins)
- 一个 esbuild 插件是一个包含 name 和 setup 函数的对象
- 它们以数组的形式传（在vite.config.js中配置）递给构建 API 调用,`setup`函数在每次`BUILD API`调用时都会运行一次



**插件中涉及的概念：**

 

**命名空间**

- 每个模块都有一个关联的命名空间。默认情况下，esbuild 在 file 命名空间中运行，该命名空间对应于文件系统上的文件
- 但是 esbuild 也可以处理在文件系统上没有对应位置的“虚拟”模块
- 插件可用于创建虚拟模块。虚拟模块通常使用命名空间而不是 file 将它们与文件系统模块区分开来,通常命名空间特定于创建它们的插件



**过滤器**

- 每个build上的回调函数的第一个对象参数中都必须提供一个正则表达式作为过滤器。当路径与其过滤器不匹配时，esbuild 使用它来跳过调用回调

- 命名空间也可用于过滤。回调必须提供过滤正则表达式，但也可以选择提供命名空间以进一步限制匹配的路径

  

```ts
interface OnResolveOptions {
  filter: RegExp;
  namespace?: string;
}
```



**Resolve 回调**

- build上的回调函数——onResolve 将在 esbuild 构建的每个模块中的每个导入**路径**上运行

- 回调可以自定义 esbuild 如何进行路径解析。例如，它可以拦截导入路径并将它们重定向到其他地方。它还可以将路径标记为外部

- 回调可以返回而不提供将路径解析的责任传递给下一个回调的路径。对于给定的导入路径，onResolve 所有插件的所有回调都将按照它们注册的顺序运行，直到有人负责路径解析。如果没有回调返回路径，esbuild 将运行其默认路径解析逻辑

- onResolve函数的的第二个参数是一个回调函数，该回调函数的是esbuild调用时会传给该回调，参数的接口类型如下：

  ```ts
  interface OnResolveArgs {
    path: string;
    importer: string;
    namespace: string;
    resolveDir: string;
    kind: ResolveKind;
    pluginData: any;
  }
  
  type ResolveKind =
    | 'entry-point'
    | 'import-statement'
    | 'require-call'
    | 'dynamic-import'
    | 'require-resolve'
    | 'import-rule'
    | 'url-token'
  ```

- onResolve函数的的第二个参数是一个回调函数，该回调函数饿返回值的接口如下：

  ```ts
  interface OnResolveResult {
    errors?: Message[];
    external?: boolean;
    namespace?: string;
    path?: string;
    pluginData?: any;
    pluginName?: string;
    sideEffects?: boolean;
    suffix?: string;
    warnings?: Message[];
    watchDirs?: string[];
    watchFiles?: string[];
  }
  
  interface Message {
    text: string;
    location: Location | null;
    detail: any; // The original error from a JavaScript plugin, if applicable
  }
  
  interface Location {
    file: string;
    namespace: string;
    line: number; // 1-based
    column: number; // 0-based, in bytes
    length: number; // in bytes
    lineText: string;
  }
  ```

  



**Resolve 参数**

- 当 esbuild 调用由 注册的回调时 onResolve，它将为这些参数提供有关导入路径的信息：
- path 这是来自底层模块源代码的逐字未解析路径
- namespace 这是包含要解析的此导入的模块的名称空间



**onLoad 回调**

- 该函数的参数的值依赖于前面onResolve函数的第二个回调函数的返回值

- onLoad 将为每个未标记为外部的唯一路径/命名空间对运行添加的回调

- **它的工作是返回模块的内容并告诉 esbuild 如何解释它**

- 回调可以在不提供模块内容的情况下返回。在这种情况下，加载模块的责任被传递给下一个注册的回调。对于给定的模块，onLoad 所有插件的所有回调都将按照它们注册的顺序运行，直到有人负责加载模块。如果没有回调返回模块的内容，esbuild 将运行其默认的模块加载逻辑

- onLoad 函数的的第二个参数是一个回调函数，该回调函数的是esbuild调用时会传给该回调，参数的接口类型如下：

  ```ts
  interface OnLoadArgs {
    path: string;
    namespace: string;
    suffix: string;
    pluginData: any;
  }
  
  
  ```

- onLoad 函数的的第二个参数是一个回调函数，该回调函数饿返回值的接口如下：

  ```ts
  interface OnLoadResult {
    contents?: string | Uint8Array;
    errors?: Message[];
    loader?: Loader;
    pluginData?: any;
    pluginName?: string;
    resolveDir?: string;
    warnings?: Message[];
    watchDirs?: string[];
    watchFiles?: string[];
  }
  
  interface Message {
    text: string;
    location: Location | null;
    detail: any; // The original error from a JavaScript plugin, if applicable
  }
  
  interface Location {
    file: string;
    namespace: string;
    line: number; // 1-based
    column: number; // 0-based, in bytes
    length: number; // in bytes
    lineText: string;
  ```

  



**onLoad 选项**

- filter 每个回调都必须提供一个过滤器，它是一个正则表达式。当路径与此过滤器不匹配时，将跳过注册的回调
- namespace 这是可选的。如果提供，回调仅在提供的命名空间中的模块内的路径上运行



**load 结果**

- contents 将此设置为字符串以指定模块的内容。如果设置了此项，则不会针对此已解析路径运行更多加载回调。如果未设置，esbuild 将继续运行在当前回调之后注册的加载回调。然后，如果内容仍未设置，如果解析的路径在 file 命名空间中，esbuild 将默认从文件系统加载内容
- loader 这告诉 esbuild 如何解释内容。例如，js 加载器将内容解释为 JavaScript，css 加载器将内容解释为 CSS。js 如果未指定，则加载程序默认为。有关所有内置加载程序的完整列表，请参阅内容类型页面。





示例：

被打包文件：entry.js

```js
import { OS } from 'env';  // 注意这个env既不是第三方依赖也不是node原生库，也没有本地真实文件
console.log(OS);
```



启动esbuild进行打包文件：

```js
//webpack loader pitch 读文件 normal
const envPlugin = require('./envPlugin.js')

require('esbuild')
  .build({
    entryPoints: ['entry.js'],
    bundle: true,
    plugins: [envPlugin],
    outfile: 'out.js'
  }).catch((error) => console.log(error))

```

直接运行启动esbuild进行打包的文件会报错，因为entry.js中引入了env，但是实际上是没有的。



#### envPlugin插件

这个插件对env这种虚拟模块进行 **模块拦截**

```js
let envPlugin = {
  name: 'env',//插件的名字
    
  //setup函数在每次BUILD API调用时都会运行一次
  setup(build) {//设置函数
    //webpack resolveLoader rollup resolveId 它们都是在获取此模块的绝对路径
    // onResolve 将在 esbuild 构建的每个模块中的每个导入路径上运行
    //在编译每个模块的时候,会用模块的路径和此回调的filter正则进行匹配,匹配上执行回调,匹配不上则跳过此回调
    //如果不写onResolve回调,esbuild会默认去硬盘上找模块路径
    build.onResolve({ filter: /^env$/, namespace: 'file' }, ({ path }) => {//env ./env
      return {
        external: false,//是否是外部模块,如果是外部的话不处理了
        namespace: 'env-namespace',//表示此模块属于env-namespace命名空间了
        //C:\aproject\webpack202208\14.vite\env.js
        path: 'C:/aproject/webpack202208/14.vite/env.js'  // env 解析得到的路径 ,在默认情况下,如果是普通模块的话,会返回普通模块文件系统中的绝对路径
      }
    });
    /* build.onResolve({ filter: /^vue$/, namespace: 'file' }, ({ path }) => {
      return {
        external: true,
        path// env 解析得到的路径 ,在默认情况下,如果是普通模块的话,会返回普通模块文件系统中的绝对路径
      }
    }); */
    // 下面的这个filter是用来匹配上面onResolve函数中回调函数返回的path对应的值的。也就是上面的15行
    build.onLoad({ filter: /^env$/, namespace: 'env-namespace' }, ({ path }) => {
      return {
        contents: JSON.stringify(process.env),
        loader: 'json' // 表示上面的contents内容用json这个加载器处理
      }
    });

  }
}

//webpack loader pitch 读文件 normal
require('esbuild')
  .build({
    entryPoints: ['entry.js'],
    bundle: true,
    plugins: [envPlugin],
    outfile: 'out.js'
  }).catch((error) => console.log(error))

module.exports = envPlugin; 

/**
{
  path: 'env',//引入的模块的名字
  namespace: 'file',//命名空间的名字 ,可以用来过滤
  importer: 'C:\\aproject\\webpack202208\\14.vite\\entry.js',  //从哪里引入的,或者说是哪个模块引入的这个env
  resolveDir: 'C:\\aproject\\webpack202208\\14.vite',//根目录
  kind: 'import-statement',//导入语句
} 
*/
```



严格来说，如果一个项目的所有模块都是用esmodule模块化来编写的，可以完全不用esbuild进行打包就可以直接在浏览器中运行项目了，之所以还使用esbuild进行开发打包，是为了能更好的处理第三方依赖，使用esbuild将第三方库中的所有相关的esmodule模块化的文件统一打包合并后方法node_modules/.vite/deps目录中，减少大量因为文件依赖而发起的http请求数量。同时还能处理只支持commonjs模块化语法的库，将commonjs转为esmodule。





## vite实现

```shell
npm init -y 

npm install connect es-module-lexer resolve check-is-array esbuild fast-glob fs-extra serve-static magic-string chokidar ws  hash-sum --save
```



### **vite依赖的第三方模块说明**



#### connect

- [connect](https://www.npmjs.com/package/connect)是一个后端服务器框架，它使用模块化组件作为中间件，以可重用的方式实现 web 程序的逻辑

- 在 Connect 中，中间件组件是一个函数，它拦截 HTTP 服务器提供的请求和响应，执行逻辑，然后，或者结束响应，或者把它传递给下一个中间件组件

- Connect 用分配器把中间件`连接`在一起

- Express 构建在 Connect 之上的更高层的框架

  

基本使用：

```js
const connect = require("connect");
const http = require("http");

const middlewares = connect();
middlewares.use(function (req, res, next) {
  console.log("middleware1");
  next();
});
middlewares.use(function (req, res, next) {
  console.log("middleware2");
  next();
});
middlewares.use(function (req, res, next) {
  res.end("Hello from Connect!");
});
http.createServer(middlewares).listen(3000);
```





#### serve-static

- [serve-static](https://www.npmjs.com/package/serve-static)是一个静态文件中中间件，将指定的目录作为服务器的一个静态资源托管目录



基本使用：

```js
const connect = require('connect');
const static = require('serve-static');
const http = require('http');
//connect=>express=>koa
const app = connect();
app.use(static(__dirname));
http.createServer(app).listen(3000, () => console.log('3000'));
```



#### es-module-lexer

- **[es-module-lexer](https://www.npmjs.com/package/es-module-lexer)是一个 JS 模块语法解析器**，用于分析各个模块的导入导出情况。

  

基本使用：

```js
const { init, parse } = require("es-module-lexer");
(async () => {
  await init;
  const [imports, exports] = parse(`import _ from 'lodash';\n export var p = 5`);
  console.log(imports);
  console.log(exports);
})();
```





#### resolve

- [resolve](https://www.npmjs.com/package/resolve)实现了 node 的`require.resolve()`算法，就是得到一个文件的绝对路径的库。



基本使用：

```js
const resolve = require('resolve')
const res = resolve.sync('check-is-array', { basedir: __dirname });  // 返回该第三方模块入口文件的绝对路径
console.log(res);
//C:\aproject\webpack202208\vite50\node_modules\check-is-array\index.js
```





#### fast-glob

- [fast-glob](https://www.npmjs.com/package/fast-glob)该包提供了一些方法，用于遍历文件系统，并根据`Unix Bash shell`使用的规则返回与指定模式的定义集匹配的路径名
- 用途就是用来找文件



```js
const fg = require("fast-glob");
(async () => {
  const entries = await fg(["**/*.js"]);
  console.log(entries);
})();
```





#### magic-string

- [magic-string](https://www.npmjs.com/package/magic-string)是一个用来操作字符串的库，rollup作者写的，rollup中也在使用。



基本使用：

```js
const MagicString = require("magic-string");
const ms = new MagicString("var age = 10");
ms.overwrite(10, 12, "11");
console.log(ms.toString());
```





### 实现命令行



package.json：

```json
{
  "bin":{
    "vite":"./bin/vite.js"
  }
}
```



bin/vite.js:

```
#!/usr/bin/env node
require("../lib/cli");
```



lib/cli.js:

```js
console.log("vite3");
```



```shell
npm link 
```



扩展：

> npm link 
>
> npm rooot -g
>
> 包的链接分为两步:
>
> 1. 在一个包文件夹内执行 `npm link` 将在全局文件 **{prefix}/npm/node_modules/** 内，创建一个符号链接（symlink），这个链接指向 `npm link` 命令执行的地方。
>
> 2. 到其它目录下，执行 `npm link packageName` 命令，将会创建一个从全局安装的 **packageName** 到当前文件内的 **node_modules** 下的符号链接。
>
>    需要注意的的是， **packageName** 是取自包的 **package.json** 中 **name** 字段，不是文件夹名称。
>
>    包的名称可能有作用域前缀，如果有， **packageName** 也要对应加上。
>
> 解除 link：npm **unlink** --**no**-save **package** && npm install







### 实现http服务器

lib\cli.js

```diff
+let { createServer } = require('./server');
+(async function () {
+  const server = await createServer();
+  server.listen(9999);
+})();
```



lib\server\index.js

```js
const connect = require("connect");
async function createServer() {
  const middlewares = connect();
  const server = {
    async listen(port) {
      require("http")
        .createServer(middlewares)
        .listen(port, async () => {
          console.log(`dev server running at: http://localhost:${port}`);
        });
    },
  };
  return server;
}
exports.createServer = createServer;
```



### 实现静态文件中间件

lib\server\index.js

```diff
const connect = require('connect');
+const serveStaticMiddleware = require('./middlewares/static');
+const resolveConfig = require('../config');
async function createServer() {
+ const config = await resolveConfig()
  const middlewares = connect();
  const server = {
    async listen(port) {
      require('http').createServer(middlewares)
        .listen(port, async () => {
          console.log(`dev server running at: http://localhost:${port}`)
        })
    }
  }
+ middlewares.use(serveStaticMiddleware(config))
  return server;
}
exports.createServer = createServer;
```





lib\server\middlewares\static.js

```js
const static = require("serve-static");
function serveStaticMiddleware({ root }) {
  return static(root);
}
module.exports = serveStaticMiddleware;
```



lib\config.js

```js
const { normalizePath } = require("./utils");
async function resolveConfig() {
  const root = normalizePath(process.cwd());
  let config = {
    root,
  };
  return config;
}
module.exports = resolveConfig;
```



lib\utils.js

```js
function normalizePath(id) {
  return id.replace(/\\/g, "/");
}
exports.normalizePath = normalizePath;
```





index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vite2</title>
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```



main.js

```js
console.log("main");
```





### 分析第三方依赖

1. 以index.html为入口文件，扫描整个项目，找到依赖的第三方模块进行**预编译**

2. 编译这些第三方模块，放到.vite/deps目录中 

3. 重写返回的导入路径，指向编译后的文件

   ```
   main.js：
   
   import { createApp } from 'vue'; 
   
   import { createApp } from '/node_modules/.vite/deps/vue.js'; 
   ```

4. 请求服务器的时候,服务器可以返回/node_modules/.vite/deps/vue.js

