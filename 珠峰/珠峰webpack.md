

# 珠峰webpack



学习webpack要达到的程度：

- 如何使用
- webpack打包流程
- webpack优化
- 能写插件



​		前端发展过程中，出现了许多提升开发效率的技术，这些技术往往都有各自的文件类型。而浏览器只能识别一些基本的文件类型，如 js，css，html，img，jpg，png等。如果开发者想用新技术提高开发效率，同时又希望之后的项目能被浏览器解析成功。那么就需要借助打包工具，将各式各样的文件经过打包后转为浏览器能识别的文件格式，以完成开发。



![image-20210626205632037](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210626205632037.png)



## webpack基础

自动化打包部署工具，现代JavaScript应用程序的静态模块打包器。当webpack处理应用程序时，它会递归地构建一个依赖关系图。其中包含项目需要的每个模块，然后将所有这些模块打包成一个或者多个bundle。webpack本身是基于node开发的。

## 安装webpack

课程讲解用的webpack版本：4.43.0 ，webpack-cli版本：3.3.11

方式一：

全局安装：`inp install webpack webpack-cli -g`。 安装webpack4+版本时，需要额外安装webpack-cli（命令行工具）。不推荐，全局安装的话，之后开发各个项目时，项目的打包都会默认使用全局安装的webpack版本，可能造成不同的项目中因为需要不同的webpack版本而导致冲突而无法构建项目。



方式二：

本地安装（项目安装）：`npm install webpack webpack-cli -D`



在webpack4以及以后的版本中，可以实现零配置打包项目（在项目的根目录下没有webpack.config.js文件时）。其实它有一个默认打包配置文件。

默认的配置文件内容：

配置文件必须遵循common.js模块化规范

```js
const path = require('path')
module.exports = {
	entry:'./src/index.js',  //entry支持字符串，数组 和 对象
    
    entry:['./src/index1.js','./src/index2.js']  //并不是多入口的意思，还是打包输出到main.js一个文件中
    
    entry:{
    	main:'./src/index1.js',
	}  // 等价于：entry:'./src/index.js',这种写法
	
    
    
    
	output:{
        //必须是绝对路径，所以可以依赖node的核心模块——path
		path: path.resolve(__dirname,'./dist'),   
        filename:'main.js'
	},
    
    
    
    
    mode:'production'，
    
    
    
    context:process.cwd()   //属性值就是项目打包的上下文（项目打包的相对路径），就是项目的目录路径，该配置项几乎不会去改，用默认值就行
}
```

`entry:['./src/index1.js','./src/index2.js']` ：

![image-20210626213637972](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210626213637972.png)





多入口配置：

```js
module.exports = {
	//对象类型才是多入口方式
    entry:{
    	index1:'./src/index1.js',
    	index2：'./src/index2.js'  
	} 
    
    //一旦有多入口就必须对应多出口，并且多出口的文件名称不能写死
    
	output:{
        //必须是绝对路径，所以可以依赖node的核心模块——path
		path: path.resolve(__dirname,'./dist'),   
        filename:'[name].js'   //[name]_[hash:8] 称为占位符
		//常用的占位符 : 
		//hash  用于考虑缓存，该hash表示整个项目的hash，项目文件一旦有变，则该次打包的hash就改变
		//chunkhash   用于考虑缓存，根据不同入口entry进行依赖及解析，对每个入口模块生成对应的hash，只要组成entry的项目模块没有改动，则对应的hash不变 
		//contenthash 用于考虑缓存
		//name
		//id
	},
    
    mode:'production'，  //none   production  development
    
    
    
    context:process.cwd()   //属性值就是项目打包的上下文（项目打包的相对路径），就是项目的目录路径，该配置项几乎不会去改，用默认值就行
}
```

多出口打包结果图

![image-20210626214933122](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210626214933122.png)

一个chunk对应一个bound（一个bound就是一个打包后生成的资源文件）。 

可以让不同的html文件引入各自打包好后生成的文件。从而实现多页面的项目。





模块化规范

```javascript
//模拟手写
const fs = require('fs')
function myRequire(modulePath){
    const content = fs.readFileSync(modulePath,'utf8')
    const module = { exports: {} }
    const fn = new Function('exports', 'module', 'require', '__dirname', '__filename', content+'\n return module.exports')
    return fn(module.exports, module, myRequire, __dirname, __filename)
}
```



require()方法在node中是同步的，引入一个js文件，相当于在js文件内容包裹了一个闭包，并执行js文件内的代码。





webpack模块打包器，以入口文件为起始点，分析整个项目的目录结构，将js模块和其他浏览器不能直接运行的拓展语言打包为浏览器可以运行的资源文件。在webpack中一切皆模块（图片，图标，js，css等等都看作模块），分析依赖关系，依赖关系的体现就是import语法和require语法来体现的。从webpack4.0开始，webpack可以实现零配置打包， 但任然可以自己配置。

构建：就是将源代码转换成发布到线上的可执行JavaScript，css，html代码 

webpack能力：

- 代码转换，TS转JS,SCSS转CSS等
- 文件优化，压缩源码，CSS, HTML 和 图片等
- 代码分割，提取多个页面的公共代码，提取首屏不需要执行部分的代码让其异步加载
- 模块合并，在采用模块化开发的项目中会有许多模块和文件把多个相关的模块合并为一个文件
- 自动刷新，本地源码的变化，自动重新构建
- 代码校验，代码提交到仓库前需要校验代码是否符合规范以及单元测试是否通过
- 自动发布，更新完代码后，自动构建出线上发布代码并传输给发布系统



webpack在打包时，将项目中使用到的common.js和ES6模块化规范语法都进行识别并自己在打包生成的文件中使用了自己模拟的，可以被浏览器识别的require语法进行替代。

安装项目本地的webpack，因为安装全局的webpack可能导致别人在拿到自己的项目进行打包时，运行对方电脑上全局安装的webpack，导致webpack版本的不一致。这版的学习是webpack4.0和webpack-cli3.0版本的。

但是直接全局安装，可以直接使用命令行指令。为了防止全局安装导致的版本冲突，一般选择把webpack安装在本地项目。

webpack4.0版本需要安装webpack4.0和webpack-cli3.0版本配合才能使用。

```
npm init -y
npm install webpack@4 webpack-cli@3 -D
yarn add webpack@4 webpack-cli@3 -D
```

webpack4.0版本可以实现零配置打包，但是打包只有最基本的能力。默认打包配置是：

以项目目录下的src目录下的index.js为打包入口，将打包结果默认输出到项目根目录下的dist目录下的main.js文件中，默认采用生产模式打包。

npx 指令：默认启用项目本地node_modules下面的.bin下面的相应的cmd文件。webpack.cmd文件内容：

![image-20210409083952883](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210409083952883.png)

先判断当前目录下是否有node.exe程序，有的话就使用它执行 %~dp0（表示webpack.cmd文件所在路径）的上层下的webpack/bin/webpack.js文件。没有的话，就是用全局的node执行该文件。

所以执行webpack命令其实就是先用node.js执行上面出现的webpack.js。





## webpack核心概念



核心概念：

- entry：入口，webpack执行构建的第一步

- output：输出结果，在webpack经过一些列的处理并得到最终想要的代码后输出结果一般是文件

- plugin：扩展插件，在webpack构建流程中的特定时刻注入扩展逻辑来改变构建结果或者做一些自己想做的事

- loader:模块转换器,用于把模块原内容按照需求转为新内容

- module：模块，在webpack中一切皆模块，一个模块对应着一个文件。webpack会从配置的入口开始递归找出所有依赖的模块

- chunk：代码快，一个chunk有多个模块组合而成，用于代码合并与分割。理解module 和chunk 的关系，一般情况下一个entry会打包出一个chunk，一个chunk会在硬盘上写为一个文件

  

webpack启动后，从项目入口文件entry指定的模块出发，开始递归分析其依赖的所有模块，每找到一个模块，就走loader（模块转换器）找对应的转换规则，对模块进行转换后，将不是js模块的代码转为js模块化的代码，再解析出当前模块依赖的其他模块。   这些模块以entry为单元进行分组，一个entry及其所有依赖的module被分为一组组成一个chunk，最后webpack会把所有的chunk转换为文件进行输出到硬盘上。  在整个流程中webpack会在特定的时刻执行plugin里面定义的逻辑。





开发环境下和生产环境下webpack的配置有许多不同，在webpack的配置文件中通过mode字段的值来区分是什么环境下进行打包的,webpack在不同环境下启用不同的内置配置优化。mode字段的取值可能是三者中的一个：development, production, none

![image-20210915202230172](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210915202230172.png)



![image-20210915202317068](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210915202317068.png)









默认的配置文件名：webpack.config.js/webpackfile.js(和src在同一级目录)，这个js文件的文件内容：

```javascript
//webpack是基于node.js开发的，所以webpack底层采用的是common.js模块化规范

const path = require('path')
module.exports = {  //common.js模块导出语法。
    mode: 'production',   //production 或者 development
	entry: './src/index.js',  //项目打包入口文件目录及文件名，也可以是绝对路径
    output: {
        filename: 'bundle.[hash:8].js',  //项目打包输出文件名
        path: path.resolve(__dirname,'dist'),  //必须是绝对路径
        publicPath: './'
    }
}
```



entry详情：

entry对应的值可以是一个文件路径字符串（单入口）；也可以是一个对象，对象中的每个属性名代表一个入口文件，属性值是入口文件的路径字符串。

```
entry:'./src/index.js'

entry:{
	index: './src/index.js',
	login: './src/login.js'
}
```



 output详情：

对应于entry的多入口文件，那么output的输出文件也应该是多个。

````javascript
output: {
	path:path.resolve(__dirname, 'dist'),
	filename: [name].[hash:8].js //[name]表示变量，与entry多入口中的属性名对应，对于entry是单入口，则name默认是 main
}
````







真实项目中，webpack 的配置文件可能有两套以上，所以有手动选择其他js文件作为webpack的配置文件的情况：

方式一： npx webpack --config  配置文件名

方式二：在package.json文件中配置npm脚本命令， “start”：“webpack --config  配置文件名”  ，npm run start

方式三：在package.json文件中配置npm脚本命令， “start”：“webpack ”  ，npm run start   --  --config  配置文件名（给npm run 命令  --  参数部分）





webpack打包输出的js文件的骨架结构：

````javascript
(
function (modules) { // webpackBootstrap
  // The module cache  模块缓存
    var installedModules = {};
    //installedModules对应的结构为：  "./src/index.js"  ：{i: moduleId, l: false, exports: {};

  // The require function  定义一个能在浏览器中运行的require方法 ，说白了webpack自己模拟了能在浏览器中运行的reuire方法
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "./src/index.js");  //入口模块传给__webpack_require__
}
)({
    "./src/a.js": (function (module, exports) {

        eval("module.exports = 'hello world!'\n\n//# sourceURL=webpack:///./src/a.js?");

    }),
    "./src/index.js":(function (module, exports, __webpack_require__) {

        eval("const a = __webpack_require__( \"./src/a.js\")\r\n\r\nconsole.log(a);\r\nconsole.log('hello webpack')\n\n//# sourceURL=webpack:///./src/index.js?");

    })
})
//最外层为一个匿名函数自执行，执行时传入一个对象，对象的key为项目文件的路径，value是一个函数  
````



### **开发优化：**

### **开发服务器配置：webpack-dev-server**

它默认也是根据webpack.config.js文件进行项目打包的。将项目打包生成到内存当中，并且监视源码文件的变动，一旦有变，该插件会立即重新打包，并运行。

npm  install  webpack-dev-server -D

```
devServer: {
	port: 3000,
	progress: true, //打包进度条
	contentBase: './dist',
	open: true
	compress: true
}
```

使用方式一：npx webpack-dev-server

使用方式二：在package.json文件中配置npm脚本命令， “dev”：“webpack-dev-server”  ，npm run dev





### **自动打包html文件并将打包的模块入口文件自动引入html文件中：**

npm install html-webpack-plugin  -D

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins:[
	new HtmlWebpackPlugin({
	  template: '模板html文件路径',
	  filename: 'index.html',  //打包后生成的html文件名
      minify: {
        removeAttributeQuotes: true, //移除html文件中的双引号
        collapseWhitespace: true,   //压缩html代码
        removeComments:true
      },
      hash: true, //在引入打包后的js文件时，给它在script标签中src文件名的后面加上hash值，而不是打包后的js文件有hash值 <script type=text/javascript src=boundle.js?fd7b1ef895541b8c9717></script>，解决浏览器缓存的问题，可以不用该方法而给js打包文件加hash值。 
      //chunks:[]  //没有该字段时，默认情况下，在多入口时，生成的多个chunk都会被引入到上面的template字段引入指定的html模板文件的最后面，同时引入的顺序是以entry字段中各个入口模块的循序为准，所以如果模块打包后的结果存在依赖关系的话，必须保证它们的顺序正确。
        chunks:["login","index"],  //表示只即使有很多打包入口模块，都只在打包后html模板的中引入login和index两个chunk，且顺序以entry时出现的顺序引入。
        chunksSortMode:'manual' //表示采用chunks中的顺序引入而不用entry中的引入顺序
	})
]
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



chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然也可以指定引入哪些特定的文件。

执行 webpack 命令之后，你会看到生成的 index.html 文件中，只引用了 index.js 和 index2.js

```html
<script type=text/javascript src=index.js></script>
<script type=text/javascript src=index2.js></script>
```

chunksSortMode这个选项决定了 script 标签的引用顺序。默认有四个选项，'none', 'auto', 'dependency', '{function}'。

- 'dependency' 按照不同文件的依赖关系来排序。
- 'auto' 默认值，插件的内置的排序方式
- 'none' 无序
- {function} 提供一个函数



### **css样式文件打包：**

加载器：style-loader、css-loader

```javascript
module:{
	rules:[
        {
            test:/\.css$/,
            use:
            [
                {
                    loader:'style-loader',  //将编译好的css插入style标签加到html中
                   	options:{
                        inserAt:'top'
                    }
                },
                'css-loader' //编译css文件中的@import或者css中的url（如背景图的url）语法
            ],
            include/exculde:...,
            options:...
            
        }
    ]	
}
```



### **less样式文件打包：**

加载器：style-loader、css-loader、less-loader与less

```javascript
{
    test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
            'less-loader'
        ]
}
```

### scss样式文件打包

npm install node-sass sass-loader -D

```
{
    test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
}
```





### **为css样式添加浏览器前缀：**

autoprefixer  postcss-loader

方式一：

```
{
    test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader',  //光有这项还不够，还需要加autoprefixer 再写postcss.config 文件
            'less-loader'
        ]
}

//根目录下创建一个postcss.config.js文件 
module.exports = {
 plugins: [
 	require('autoprefixer')
 ]
}
//控制浏览器的兼容版本：
在项目根目录下创建一个文件 .browserslistic
module.exports = [
	'last 1version',
	'> 1%',
	'ie 10'
]
```



方式二：

```javascript
{
    test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader：'postcss-loader'，
                options: {
					ident:'postcss',
                	plugins: [
                		require('autoprefixer')([...options])
                	]
            	}

            }
            'less-loader'
        ]
}
```

方式一和方式二都需要搭配package.json文件中的browserlist字段：

```
"browserlist" :[
	">1%",
	"last 2 versions"
]
```





### **抽离css样式文件：**

插件：npm install mini-css-extract-plugin -D

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module:{
	rules:[
        {
            test:/\.css$/,
            use:
            [
                MiniCssExtractPlugin.loader,  //将抽离的css通过link标签引入html文件中，不再使用style-loader
                'css-loader'
            ]
        }
    ]	
}
plugins:[
	new MiniCssExtractPlugin({
	  filename: 'css/[name].[contentHash].css',  //打包后生成的css文件名，采用的是生成的chunk文件的名字
      chunkFilename:"[id].css"  //在异步加载时用
	})
]

//提取的css文件会在html页面的head区域用link标签引入
```





### **压缩js与css**

npm install uglifys-webpack-plugin   optimize-css-assets-webpack-plugin   terser-webpack-plugin -D
terser-webpack-plugin 该插件用来解决uglifys-webpack-plugin不支持ES6的问题。

```javascript
const path = require('path')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifysWebpackPlugin =require('uglifys-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {  //common.js模块导出语法。
    mode: 'production',   //production 或者 development
	entry: './src/index.js',  //项目打包入口文件目录及文件名
    output: {
        filename: 'bundle.[hash:8].js',  //项目打包输出文件名
        path: path.resolve(__dirname,'dist')  //必须是绝对路径
    },
    
    optimazation: {  //优化规则选项 ，这个字段的内容都是做特定的项目优化的
        minimizer: [  //压缩优化
            //压缩css资源
            new OptimizeCssAssetsWebpackPlugin({
                
            }),//如果只配置对css的压缩，当js的压缩读取该配置对象时，没有发现可用于js压缩的插件，则就不会再压缩js文件，而只压缩css文件
            
            //压缩js资源
            new UglifysWebpackPlugin({   //这个插件现在不再使用了因为不支持es6的压缩
                cache: true, //是否使用缓存
                parallel:true, //是否并发编译
                sourceMap: true  //启动源码映射（方便调试）
            })
            
            new TerserWebpackPlugin({   //生产环境下会默认启动该插件，所以可以手动不配，但是没有开启缓存
            	parallel:true,  //开启电脑的多进程并行压缩
            	catch：true, //开启缓存
            })
        ]
    }
}
```



### **js语法转换与ESLint语法检测**

babel-loader  @babel/core  @bable/preset-env  @bable/plugin-proposal-class-properties  @babel/plugin-proposal-decorators    @babel/plugin-transform-runtime  -D

@babel/runtime  @babel/poltfill  -S



babel/poltfill :可以让es6以后的许多数据类型新增的方法进行转化。

```javascript
entry: ['@babel/polyfill','./src/index.js'], //将es6以后的方法打包到输出文件中。
module:{
    rules:[
        {
            test:/\.js$/i,
            include: path.resolve(__dirname,'src'),
            exclude:/node_modules/,   
            use:
            [
                {
                    loader: 'babel-loader',
                    options: {
                        presets:['@babel/preset-env'],//转化语法的预设es5=>es6
                        plugins:[ //基于插件处理ES6/ES7中的class的特殊语法，其他语法的话还需要引入其他插件。
                            ['@babel/plugin-proposal-decorators',{"legacy":true}],   
                            ['@babel/plugin-proposal-class-properties',{"loose":true}],
                            '@babel/plugin-transform-runtime'，
                            ...//其他的许多兼容性插件
                        ]
                    }
                }
            ,"eslint-loader"] //配置好eslint-loader后去官网下载自己选择的语法校验规则项目并生成文件（.eslintrc.json）后放到项目根目录下。
        }
    ]	
}
```

另一种写法：

![image-20210916002608007](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210916002608007.png)



















扩展：解决vscode不识别类的装饰器语法  

在项目根目录下，添加一个文件jsconfig.json

```javascript
//文件内容
{
	"comilerOptions": {
		"experimentalDecrators": true
	}
}
```





其他问题：

比如我需要在项目中使用jQuery, $不能使用了。

```
import jquery from 'jquery'
consloe.log(jquery) //正常打印
consloe.log($)  //报错

```



**暴露全局loader**

expose-loader -D

前置，后置，普通加载器



使用方式一：（在单独的要使用的模块中使用）

```javascript
//在要使用如jQuery包时，在要使用的模块中这么写：(内联加载器)
import jquery from 'expose-loader?$!jquery'
consloe.log($)    //正常打印
```



使用方式二：（在webpack.config.js模块中配置）

```
const webpack = require('webpack');
module.exports = {
	plugins：[
		new webpack.ProvidePlugin({  //在每个模块中都注入$
			‘$': 'jquery'
		})
	]
}
```



### **处理图片资源和目录分配**

在项目中使用图片的地方：

- js中创建IMG

  在js中使用图片资源，需要先将图片资源以模块化的语法导入到对应模块，然后再使用。(使用的是相对地址)

  ```javascript
  const img1 = require('./static/images/hello.jpg')
  let img = new Image()  
  img.src = img1	  //img1其实是该图片的文件路径
  document.body.appendChild(img)
  ```

- css中设置背景图

- html中img标签

- ...



npm install  file-loader url-loader -D

在项目源文件中的html页面中直接相对该html文件自己的位置通过image标签去引图片文件，打包后的html文件会放在（如dist）打包目录下，基于打包后的html文件自己的位置去找图片资源时，那时image标签的src地址便无法找到图片资源。为此可以使用html-withimg-loader  处理。

第一种加载图片的方法：

```javascript
module.exoprts = {
    module: {
        rules: [
            {
                test: '/\.(png|jpg|gif|ico|webp|bmp)$/i',
                use: [
                    {
                        loader: 'url-loader',  //对小图片做base64处理，但是大于limit的图片还是用file-loader处理   ,该url-loader内置了file-loader ，所以不需要再手动配置file-loader
                        options: {
                            limit: 200 * 1024, //200kb
                            outputPath: 'images',   //这些图片文件打包后放在打包目录下的images子目录下面存放
                            name:'[name]',    //可用name, path,folder,contenthash,hash,emoji, ext	
                            publicPath:'/images'
                        }
                    }],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.html|htm|xml/i,
                use: ['html-withimg-loader']   //处理html文件中引入的图片,
            }]
    }
}
```



第二种加载图片的方法：

```js
module.exoprts = {
    module: {
        rules: [
            {
                test: '/\.(png|jpg|gif|ico|webp|bmp)$/i',
                use: 'file-loader',  //  将图片文件拷贝并md5命名到打包后的目录下面，并将它的路径返回，它能解决css文件中引入的图片路径问题
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.html|htm|xml/i,
                use: ['html-withimg-loader']   //处理html文件中引入的图片,
            }]
    }
}
```





文件指纹：打包后输出的文件名和后缀。hash一般是结合CDN缓存来使用的，通过webpack构建之后生成的对应文件名自动带上对应的MD5值，如果文件内容有变，那么对应的文件hash值也会变，对应的HTML引用的URL地址也会变，从而触发CDN服务器从源服务器上拉取对应的新的数据，更新本地缓存。

文件指纹的生成：

- hash，和整个项目的构建有关，只要项目中有文件被修改，整个项目构建hash值就会不同，采用hash计算的话，每次构建项目时几乎生成的hash值都不一样，即使文件内容压根没有改变。这样就没办法实现缓存效果。所以出现了chunkhash和contenthash。
- chunkhash，它根据不同的入口文件（entry）进行依赖文件解析，构建对应的chunk，生成对应的hash值，在生产环境中，一般把一些公共库和程序入口文件区分开，单独进行打包构建，接着采用chunkhash的方式生成hash值，只要之后不改动公共库中的代码，那么其hash值就不会变。
- contenthash，它只在对应的单个文件内部的内容不变时，该hash值就不会变

![image-20210915223618495](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210915223618495.png)



hash值的介绍：

![image-20210915225209989](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210915225209989.png)



![image-20210916000746801](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210916000746801.png)





chunkhash可以在不同的插件单独提出的文件中使用。

![image-20210915225626427](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210915225626427.png)

### 清除打包生成的目录

npm install clean-webpack-pulgin -D

```
const {CleanWebpackPlugin} = require('clean-webpack-pulgin')


new CleanWebpackPlugin()
```





### ESlint校验代码格式

npm install eslint eslint-loader babel-eslint  -D

eslint:核心库

eslint-loader：加载器

babel-eslint：让eslint支持ES6,7..

配置文件：.eslintrc.js

```
module.exports ={
	//root:true, //是否继承根配置，因为校验规则有上千条，每种错误都自己手写很麻烦，eslint可以继承这个配置文件的规则，对默认规则进行覆盖
	
	"parser":"babel-eslint",  //将源码转为ast语法树的工具
	"extends":"airbnb"  //继承airbnb校验规则，设置了该项下面的rules就可以不用自己写了，写了就覆盖airbnb
	
	parseOptions:{
		sourceType:'module',
		ecmaVersion:"es2015"
	},  //解析选项，eslint工作原理是ast语法树解析，把代码转为ast语法树，解析语法树中的节点进行校验 
	env:{  //指定运行环境 ，  因为某些变量在不同环境下存在与否不同
		browser:true,   //window，document
		node:true      //process，require
	}，
	rules：{
		"indent":["error"，4]，   //缩进规则  ，不符合规则的使用报错而不是警告，  长度不为4时报错\
        "no-console":['error']，  //不允许出现console.log语句
        "linebreak-style":"off"   //关闭换行符规则
	}
}
```

 

### 引入字体图标

```
{
	test:/\.(woff|ttf|eot|svg|otf)$/,
	use:{
		loader:'url-loader',
		options:{
			limit:10*1024
		}
	}
}
```

![image-20210916010952620](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210916010952620.png)





## webpack进阶

​		在一个产品的前端开发过程中，一般来说会经历本地开发、测试脚本、开发自测、测试环境、预上线环境，然后才能正式的发布。对应每一个环境可能都会有所差异，比如说服务器地址、接口地址、websorket地址…… 等等。在各个环境切换的时候，就需要不同的配置参数，所以就可以用环境变量和模式，来方便我们管理。

### Node环境变量设置

webpack是运行在node.js环境中的，它有一个特点，它可以让开发者灵活的根据不同环境(开发环境、集成环境、生产环境等)，选择相应的特性的策略打包。是否使用反向代理使用接口，针对不同的静态资源(如图片等)是直接拷贝还是进行打包编译，是否替换接口地址和代码是否压缩等等，他们都能基于Nodejs的环境变量-process.env

Nodejs 提供了 `process.env` API，它返回一个包含用户环境信息的对象。当我们给 Nodejs 设置一个环境变量，并且把它挂载在 `process.env` 返回的对象上，便可以在代码中进行相应的环境判断。

项目中常给Nodejs的环境变量-process.env. NODE_ENV设置的值有：

- production
- development | staging

应用例子：

```
// webpack.config.js
module.exports = {
　　// webpack的mode(模式参数)：不同模式下进行不同的内置优化
　　mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
```

PS：`NODE_ENV` 这个名称只是开发社区的一种共识，名称内容是可以修改的。如果需要，你也可以把它定义为 `NODE_XXX`。

针对不同项目，可能需要用到的环境变量不同，所以项目的环境变量常需要有针对性的设置，一般情况会在进行执行不同命令的时候去设置。

## 在Webpack配置文件直接赋值

在 Webpack 打包配置文件中，直接给 `process.env.NODE_ENV` 赋值即可。不过，每次在不同环境下打包时，都要手动反复修改它的值。

```
// webpack.config.js

process.env.NODE_ENV = 'production';

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  ...
}
```

## 命令行（CLI）设置

### Windows 系统

Windows 系统下，最常用的命令行面板就是 `CMD`（Command的简写） 和 `Powershell`。它们的操作分别如下：

#### CMD (Command 或 命令提示符)

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

上面的环境设置只是临时的，即只针对当前运行窗口的环境有效。当CLI运行窗口关闭以后，相关设置都会丢失。

另外，虽然通过 CMD 和 Powershell 都能修改环境变量，但它们之间设置的环境变量并不会相互影响，即你在 CMD 可以设置 `NODE_ENV` 为 `production`，同时也可以在 Powershell 中设置 `NODE_ENV` 为 `development`，这也印证了上面的描述，设置只针对当前运行窗口有效 。

如果希望设置一直生效（即 本地设置），可通过 `控制面板 -> 系统和安全 -> 系统 -> 高级系统设置 -> 高级 -> 环境变量` 这样进行设置（Windows10、可能需要重启）。

### Mac 系统

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

### Git

Git(Bash)是一款跨平台的命令行终端，我们也可以用它来设置 Nodejs 环境变量，语法如下：

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

在 Git 命令行操作中，若 `NODE_ENV` 没有设置，则通过 `echo $NODE_ENV` 命令查看它时，没有任何提示。

当设置完 `NODE_ENV`（假设设置值为 `production`），再通过 `set NODE_ENV` 命令查看它时，会返回 `production`。

*在 Mac 系统下，Git安装后，是集成在系统自带的命令行终端中。*

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









































 