# ES6

## Babel转码器

### 作用

将ES6及其之后的语法转为ES5语法，以实现对老版本浏览器的支持。

### 使用

#### 在项目中使用

1. 在项目根目录下中安装Babel

```
npm install -D @babel/core
```

2. 在项目根目录下编写配置文件—— .babelrc
   该文件是用来设置转码规则和转码插件的，基本格式如下：

```
{
	"presets":[],
	"plugins":[]
}
```

presets字段设置转码规则，官方提供以下的规则集，根据需要安装：

```
//最新转码规则
npm install -D @babel/preset-env

//react转码规则
npm install -D @babel/preset-react
```

将上面下载的规则加入.babelrc文件中：

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

Babel提供了命令行转码工具 @babel/cli，用于命令行转码。

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

#### 在REPL环境中直接运行

@babel/node 模块的babel-node命令能开启一个支持ES6的REPL环境，它就像node 命令一样，同时还支持直接运行ES6的代码。

安装：

```shell
npm install -D @babel/node
```

使用：

在项目根目录下打开终端中，在终端中输入 npx  babel-node   ，开启REPL环境，直接编辑和执行ES6的代码即可，或者通过该命令指定一个写有ES6代码的js文件去执行该文件中的代码。

![image-20210908234232007](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210908234232007.png)



#### @babel/register模块

@babel/register模块改写了require命令，为它加上了一个钩子。此后在每次使用require加载.js , .jsx , .es , .es6为后缀名的文件时，就会先用Babel进行转码

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

要执行该index.js文件时就不需要手动对index.js进行转码，直接在终端执行 node index.js  即可。

需要注意的是：@babel/register只会对require命令加载的文件进行转码，而不会对当前文件进行转码，另外，由于它是实时转码，所以只适合在开发环境下使用。



#### Polyfill

babel默认只会转换新的Javascript语句，而不会转换新的API(比如：Iterator ,  Generator , Set , Map , Proxy , Reflect , Symbol , Promise等全局对象和许多新的数组的API，以及一些定义在全局对象上的方法,比如：Object.assign )。

比如：ES6在Array对象原型上新增了Arra y.from( )方法，Babel默认不会转码这个方法，如果像让这个方法运行，可以使用core-js和regenerator-runtime（提供generator函数的转码），为当前环境提供一个踮脚函数。

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

Babel默认不转码的API很多，具体可以上网查看。

#### 在浏览器环境下直接使用  

在html页面中直接引入[@*babel/standalone* · Babel](https://www.baidu.com/link?url=Ah0gBvG3bEG0NCyvfyMdE-TxoJaci2WighhauNc3i_L7GcUtnIFvQ6fcH4ogQDj57BEbHPi-8-wRBVFKk6_m7_&wd=&eqid=ae8f8052000141d8000000046138de61)  js文件即可。

![image-20210909000349721](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210909000349721.png)





