# ES6

## Babel 转码器

### 作用

将 ES6 及其之后的语法转为 ES5 语法，以实现对老版本浏览器的支持。

### 使用

#### 在项目中使用

1. 在项目根目录下中安装 Babel

```
npm install -D @babel/core
```

2. 在项目根目录下编写配置文件—— .babelrc 该文件是用来设置转码规则和转码插件的，基本格式如下：

```
{
	"presets":[],
	"plugins":[]
}
```

presets 字段设置转码规则，官方提供以下的规则集，根据需要安装：

```
//最新转码规则
npm install -D @babel/preset-env

//react转码规则
npm install -D @babel/preset-react
```

将上面下载的规则加入.babelrc 文件中：

```
{
	"presets":[
		"preset-env",
		"@babel/preset-react"
	],
	"plugins":[]
}
```

#### 在命令行中使用

Babel 提供了命令行转码工具 @babel/cli，用于命令行转码。

先安装命令行工具：

```
npm install -D @babel/cli
//注意安装在了项目中而没有安装在全局，所以没法直接通过使用 babel xxx 命令运行
```

基本使用方法：

```shell
//转码结果输出到标准输出
npx babel example.js


//转码结果输出为一个文件
npx babel example.js --out-file output.js
//或者
npx babel example.js --o output.js


//转换整个目录下的js文件到指定的目录
npx babel src --out-dir lib
//或者
npx babel src -d lib


//生成source map文件
npx babel src -d lib -s
```

#### 在 REPL 环境中直接运行

@babel/node 模块的 babel-node 命令能开启一个支持 ES6 的 REPL 环境，它就像 node 命令一样，同时还支持直接运行 ES6 的代码。

安装：

```shell
npm install -D @babel/node
```

使用：

在项目根目录下打开终端中，在终端中输入 npx babel-node ，开启 REPL 环境，直接编辑和执行 ES6 的代码即可，或者通过该命令指定一个写有 ES6 代码的 js 文件去执行该文件中的代码。

![image-20210908234232007](.\typora-user-images\image-20210908234232007.png)

#### @babel/register 模块

@babel/register 模块改写了 require 命令，为它加上了一个钩子。此后在每次使用 require 加载.js , .jsx , .es , .es6 为后缀名的文件时，就会先用 Babel 进行转码

安装：

```
npm install --D @babel/register
```

使用：

```
//index.js
//模块中必须首先加载 @babel/register
require('@babel/regieter')
require('./es6.js')
```

要执行该 index.js 文件时就不需要手动对 index.js 进行转码，直接在终端执行 node index.js 即可。

需要注意的是：@babel/register 只会对 require 命令加载的文件进行转码，而不会对当前文件进行转码，另外，由于它是实时转码，所以只适合在开发环境下使用。

#### Polyfill

babel 默认只会转换新的 Javascript 语句，而不会转换新的 API(比如：Iterator , Generator , Set , Map , Proxy , Reflect , Symbol , Promise 等全局对象和许多新的数组的 API，以及一些定义在全局对象上的方法,比如：Object.assign )。

比如：ES6 在 Array 对象原型上新增了 Arra y.from( )方法，Babel 默认不会转码这个方法，如果像让这个方法运行，可以使用 core-js 和 regenerator-runtime（提供 generator 函数的转码），为当前环境提供一个踮脚函数。

安装：

```
npm install -D core-js regenerator-runtime
```

使用：

在脚本中引入上面两个模块。

```
import 'core-js'
import 'regenerator-runtime/runtime'
//或者
require(core-js)
require(regenerator-runtime/runtime)
```

Babel 默认不转码的 API 很多，具体可以上网查看。

#### 在浏览器环境下直接使用

在 html 页面中直接引入[@_babel/standalone_ · Babel](https://www.baidu.com/link?url=Ah0gBvG3bEG0NCyvfyMdE-TxoJaci2WighhauNc3i_L7GcUtnIFvQ6fcH4ogQDj57BEbHPi-8-wRBVFKk6_m7_&wd=&eqid=ae8f8052000141d8000000046138de61) js 文件即可。

![image-20210909000349721](.\typora-user-images\image-20210909000349721.png)
