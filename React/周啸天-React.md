React

学习React要达到的程度：

- 能使用它完成项目开发
- 理解原理
  - redux原理
  - react-redux原理
  - 中间件原理

### 第一节——导言(p1)

Vue是mvvm框架：

- model：数据（data,computed,store）
- view：el对应的html代码，template, render
- viewModel：vue构造函数实例,对象内部实现了对数据和视图改变的监听和双向数据绑定

​     在mvvm中，需要开发者去写的是view层和model层

React是MVC框架：

- Model：
- View：
- Controll：

​      其他的理解：React其实就是view层，因为它把所有的数据和操作全写在jsx语法中。在react中开发者需要管理M,V,C三层。

学习react的话有几点基本的要求：

- 学会JSX语法后能写出视图

- 学会基于JSX做一些语法处理

- 用语法处理更改状态

- 状体更改后视图自动更新

  

​        在React中数据改变会导致视图重新渲染，而视图改变后并不能直接影响数据，需要由视图层（常常是一些原生事件）触发控制层（开发者写好的方法）来修改数据。这区别与Vue。在Vue中，我们点击按钮后，也有通过调取methods中的函数去更新data中数据的情况，这个react类似。但是vue中的视图更新会影响数据主要指的是表单元素。而在react中即使是表单元素，把表单控件中的内容改变了，不能直接影响model中的数据，必须通过表单元素的onChange事件触发controller中的方法去修改。

​		真实项目中，项目选型可以根据表单元素是否有很多来定。表单控件多可以考虑Vue，其他的话，两者差不多。真实项目中，到底用vue还是React从性能角度来讲，基本已经没有什么区别了，vue中基于Object.defineProperty中的getter和setter进行数据和视图之间的处理，而react则是自己写了一套数据的监听机制，监听数据改变以渲染视图，但大体上差不多。

​		

​		学习react不像学习vue时需要记各种指令，事件修饰符或者方法。而react就为开发者提供了一个框架模式，或者react就为开发者提供了一个监听数据的工具，数据改变去更新视图，其他的往往和写原生js一样，需要自己自由控制。

​		以后在用react开发时，跟vue一样，构建一套工程化的项目结构，按组件，模块开发，涉及组件之间的通信，路由切换，公共状态管理等。

![image-20210502102520094](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210502102520094.png)

react：框架核心

react-dom：是做webApp开发

上面这两项核心库主要适用于构建一个轻量的视图层框架。

上面的核心库是视图层框架。

要想使用react来完成大型项目的快速开发。开发者还需要选用数据层框架。

`Redux`是目前React生态中的数据层框架。





react-native: 做原生App开发

### 第二节——React脚手架（官方脚手架：create-react-app）(p2-p3)

用react开发也是基于工程化，组件化与模块化来开发的，最后将所有模块合到一个或者多个页面（多页面应用中每个页面可能也分为许多组件组成）， 也需要用到webpack。

全局安装脚手架：

npm install  -g  create-react-app

基于脚手架构建工程化项目：

create-react-app  项目名字  （不能出现大写字母，汉字或特殊字符，只能时小写字母加数字加 - ），如果电脑上安装了yarn，则默认用yarn下载构建项目需要的包。

也可以不用安装在全局，可以基于npx一步到位：

npx  create-react-app  项目名字 

基于create-react-app 脚手架 生成的项目结构：

- node_modules ：所有安装的模块

  - .bin目录下放的是本地项目的可执行文件，可以在package.json的script字段中配置脚本npm脚本命令来执行，其中就有一个react-scripts命令

- public：放项目需要编译的html模板（单页面应用放一个html文件即可，多页面应用则要放多个页面）
  - index.html:SPA单页面中，各个组件最后渲染的完成的结果都会放入到页面的#root元素 内渲染展示，该html文件除了存放最终渲染的结果外（放在root元素中），还可以自己导入一些静态资源（不支持es6module或者commonjs规范的资源），或者自己单独写一些样式和结构功能，比如做一个loading 等待层，避免由于加载过慢出现的白屏问题。
  
    
  
    在项目中可能有些第三方模块并不是基于common.js或者es6模块化语法构建的，所以在工程化项目中是无法通过import或者require语法导入的，这是必须考虑将资源放在public下面，然后再该html页面中使用相对或者绝对路径在html页面中引入，但是必须以  %PUBLIC_URL% （绝对路径）作为路径的开头，这样才能被webpack识别并打包。
  
    
  
    
  
    root盒子打包后的结构：
  
    ```
    <div id="#root">
    	<div>
    		.....
    	</div>
    </div>
    ```
  
  - xxx.html: MPA/SPA中用到的页面模板
  
  - 其他公共资源，把这些资源直接通过src或者link的方式引入页面，而不基于webpack打包。为了让webpack打包，路径可以使用（%PUBLIC_URL%）。



- src：存放项目的大部分源码
  - index.js: 项目的入口，webpack的打包入口文件（单页面应用）。在MPA中则需要创建多入口文件
  - api目录：请求服务器数据的工具库
  - store目录：存放公共状态管理
  - assets：存放公共资源(图片与样式)
  - routes：存放路由管理
  - utils ：公共的工具库
  - components：公共组件
  - ...
  
    
  
- .gitignore

- package.json

  package.json文件内容：

  - npm run start =>开发环境下启动项目（默认会基于webpack-dev-server创建一个服务，用来随时编译和渲染开发内容）
  - npm run build => 生产环境下，把编写好的内容打包编译，放到build文件目录下
  - npm run eject => 将隐藏在node_modules中的webpack配置项都暴露出来，方便自己根据需求二次更改webpack配置（面试点）
  
  
  
  ```
  "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
  }
  ```
  
  
  
  

生产依赖项：

​		react: React框架的核心，提供了状态，属性，组件，生命周期等

​		react-dom：把JSX语法渲染为真实的DOM ，最后显示在浏览器中

​		react-scripts：包含了当前工程化项目中webpack配置的内容（因为react官方认为在根目录下写webpack配置文件不美观，所以react官方的脚手架将所有webpack的配置文件和依赖都放在的node_modules中），以后通过react-scripts脚本执行命名，间接通知webpack编译打包。





在真实项目中，可能需要在脚手架的默认基础上额外安装一些第三方模块，如：react-router-dom，axios，less，less-loader等等。在安装后可能面对的情况：

情况一：

安装后不需要修改webpack配置项，安装后可直接使用。

情况二：

安装的包是基于webpack的插件或者加载器等，这时就需要对webpack的默认配置进行修改。这是就需要暴露node_modules中的默认webpack配置文件暴露后在去修改对应的配置项。





npm run eject（不可逆的操作）

执行npm run eject后项目中多出的文件及文件目录：

- package.json文件中多出了许多项目开发依赖（其中尤其注意babel-preset-react-app，它将jsx语法编译为js语法）

- scripts
  - start.js : npm run start时执行该文件，这里面设置有需要webpack打包能用到的环境变量，也可以自己在package.json文件的script中进行修改，如：

    ​		set PORT=8001&&set HOST=127.0.0.1&&node script/start.js 

    ​		POST=8081 node scripts/start.js      在mac中自定义端口号的方式

    

    webpack中的代理：

    ![image-20210618235853103](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210618235853103.png)

    

    

    ![image-20210618235920280](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210618235920280.png)

    

    

    ![image-20210619000125897](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619000125897.png)

    

    

    appBuild:项目打包后的输出文件夹。

    appHtml:表示项目打包时使用的模板html文件。

    appIndexJs:表示项目的入口文件。

    appPackage.json：表示去读取当前项目下的package.json文件，该文件中的proxy字段可以用于配置代理地址，所以以后想做proxy代理的话，可以在项目的package.json中配置proxy字段。

    

    ![image-20210619000933838](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619000933838.png)

  

  自己增加less配置：

  注意less的配置需要在开发环境和生产环境下的webpack配置文件中都添加上。

  

  ![image-20210619001507330](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619001507330.png)

  

  ![image-20210619001524074](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619001524074.png)

  

  在项目中配置less环境时遇到的问题：

  在安装完less 和less-loader之后，打包时报错，报错内容如下：

  ![image-20210626110756674](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210626110756674.png)

  

  原因：
  
  less-loader的版本过高，在项目中默认安装：
  
  ```
  "devDependencies": {
      "less": "^4.1.1",
      "less-loader": "10.0.0"
  }
  ```

  解决办法：

  安装低版本的less-loader：`yarn add less-loader@6.0.0`

  

  在项目中使用了less格式的文件但是没有配置webpack关于less文件的打包和解析包时，项目任然可以运行且不报错。只是样式文件将不会生效。

  

  
  
  
  
  - build.js： npm run build时执行该文件,和start.js类似
  - test.js
  
- config    存放的是webpack的配置文件
  - path.js
  - webpack.config.js

**基于脚手架的二次修改**（面试问题）

面试：你项目中用的是哪个脚手架？用到脚手架后关于项目的webpack重新配置你是如何做的？有没有看过脚手架生成的项目的webpack配置文件的源码，能不能基于原配置文件进行修改，优化。 



### 第三节——JSX语法（虚拟DOM）(p4)

JS:JavaScript

X:XML  

JSX语法要求：

- 每个组件的视图只能有一个根节点元素

  ```javascript
  //ReactDOM.render(JSX,container,callback)
  ReactDOM.render(<div>....</div>,document.getElementById('root'))
  //container不建议是body或者html
  //callback是在组件虚拟DOM被渲染到页面后再触发，一般不用，而用生命周期函数
  ```

- JSX语法中用 { } 绑定动态的数据值或者js表达式

  - `<p>{ truely ? value1 : value2 }</p>`
  - `{ truely ? <p>.....</p>(新jsx元素) : null }`

  - { }中可以写null或者undefined或者false，表示空元素什么也不渲染

  - 在花括号中不能直接使用引用类型的数据值（它不是合法的JSX元素），但是除了数组之外，数组的话会渲染为字符串且各个元素项之间的逗号被去掉，数组中如果有某项是引用数据类型的数据时，也不行

  - 给JSX元素设置样式

    - 设置样式类用className

      className = "类名"

      let box ="box"

      className = { box }    =>  calss = "box"

      className = { { box } }   =>calss = "[ object Object ]"

    - 设置行类样式style不能是字符串，必须是一个对象，没有双引号 

      style = { { color: 'red' ,marginRight:15+'px' } }

- react中循环绑定，不像vue，在react中没有任何指令，所有的数据嵌套和绑定都基于 {} 花括号

  ```
  ReactDOM.render(<>   //可以不用标签名，它既能将作为组件的根标签也能不被渲染为一层节点，减少dom结构的嵌套。
  	<ul>
  		{ arr.map(item=>{
  			return <li key={item.id}>
  						<span>{ item.key1 }</span>
  						<span>{ item.key2 }</span>
              	   </li>
  		})}
  	</ul>
  </>,document.getElementById('root'))
  
  //JSX要求循环绑定的元素都要设置一个key属性，它是dom diff的重要凭证
  ```



#### 在jsx语法中进行事件绑定

```
class App extends React.Component{
	constructor(props){
		super(props)
		this.handel1 = this.handle1.bind(this)
	}
	
	handle1(){
		....
	}
	
	handle2(){
		....
	}
	
	handle3=()=>{
		.....
	}
	
	handle4(xxxx,x,x){
		.....
	}
	
	render(){
		return (
			//方式一：
			<button onClick={this.handel1}></button>
			//方式二：
			<button onClick={this.handel2.bind()}></button>
			//方式三：
			<button onClick={this.handle3}></button>
			<button onClick={()=>{
				this.handle3(xxxx,xxx,x,x,..)
			}}></button>
			//方式四：
			<button onClick={()=>{
				this.handle4(xxx,xxxx,xxxx)
			}}></button>
		)
	}
}
```









### 第四节——虚拟DOM（JSX）到真实DOM的渲染原理（p5）

过程：

1. 将JSX语法基于babel-preset-react-app语法解析包变为create-element格式

   每当遇到一个元素标签都会创建一个create-element格式

   React.createElement( [ 标签名 ] , [ props | null ], ...)从第三个参数开始就是标签的子节点内容，文本节点就是文本内容，元素节点则需要再次创建一个create-element格式

   ```jsx
   <div>
   	<h2>hello react</h2>
   </div>
   
   解析为：
   
   React.createElement("div", null, React.createElement("h2", null, "hello react"));
   
   
   <div class="container" id="container" data-index="1">
   	<h2>hello react</h2>
   </div>
   
   解析为：
   
   React.createElement("div", {
     class: "container",
     id: "container",
     "data-index": "1"
   }, React.createElement("h2", null, "hello react"));
   
   
   
   <div class="container" id="container" data-index="1">
     	<h2>hello react</h2>
   	<p>hello world</p>
   </div>
   
   解析为：
   
   React.createElement("div", {
     class: "container",
     id: "container",
     "data-index": "1"
   }, 
   React.createElement("h2", null, "hello react"), 
   React.createElement("p", null, "hello world")
   );
   ```

2. 执行React.createElement， React.createElement( )执行顺序，先执行最内层的React.createElement(),然后依次往外执行，直到最外层 。React.createElement会返回一个对象（虚拟DOM）。

   对象的结构：
   
   ```javascript
   {
       $$typeof: Symbol(react.element),
       key:null,
       ref:null,
       type:标签名/组件名
       props：{
           className: "value",
           chidlren:sting|object|array|没有该属性  //只有一个子节点，children的值可能是字符串（文本节点）或者一个对象（元素节点）；如果有多个子节点，children的类型是数组。
       }
   }
   ```
   
   
   
   ```
   React.createElement("span", {className:"text"}, "欢迎大家来学习")
   ```
   
   ![image-20210421082220739](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210421082220739.png)
   
   
   
   ```
   React.createElement("span", {className:"text"}, "欢迎大家来学习",React.createElement("i",null))
   ```
   
3. 基于react-dom下的render方法把上面生成的对象变成真实的DOM。然后渲染到浏览器页面指定的容器中。

### 第五节——手写React.createElement方法和react-dom.render方法（p6）

React.createElement方法返回一个虚拟DOM节点的对象

react-dom.render方法将上面生成的对象变为真实DOM并插入到真实节点中，并由浏览器渲染出来

```javascript
//创建一个虚拟DOM对象
export function createElement(type, props, ...childs){
	let jsxObj = {
        type,
        props:{}，
        key:null
        ref:null
    }
    if(props){
        if(props.hasOwnProperty('key')){
            jsxObj.key = props.key
            delete props.key
        }
        if(props.hasOwnProperty('ref')){
            jsxObj.ref = props.ref
            delete props.ref
        }
        jsxObj.props = Object.assign(jsxObj.props,props)
    }
    if(childs.length>0){
        childs=childs.length === 1 ? child[0] : childs
        jsxObj.props.children = childs
    }
    return jsxObj 
}

//将虚拟DOM对象变为真实DOM对象
export function render(jsxObj, container, callback){
	let { type, props } = jsxObj
    let element = document.createElement(type)  //这里的type处理html中的标签字符串以外还有可能是函数组件或者类组件，而这里只考虑了html字符串的情况。 在type是函数或者类时，会把函数执行（创建一个类的实例），与此用时，会把调用组件时候设置的标签属性（props）传递给这个函数或者类。
    for(let key in props){
        if(!props.hasOwnProperty(key)) break
        if(key === 'className'){
         	element.className = props[className]
            continue
        }
        if(key === 'style'){
            for(let key in props['style']){
                if(!props.hasOwnProperty(key)) break
                element.style[key] = props['style'][key]
            }
            continue
        }
        if(key === 'children'){
            let childArry
           	childArry = Array.isArray(props['children']) ? props['children'] : [props['children']]
            childArry.forEach(item=>{
                if(typeof item ==='string'){
                    element.appendChild(document.createTextNode(item))
                     return
                }
                render(item,element)
            })
            continue
        }
        element.setAttribute(key,props[key])
    }
}
```

### 第六节——函数式组件（p7）

不管是vue还是react，通过脚手架生成一个项目后，就注定是用模块化，组件化的方式进行开发的。

react项目的入口文件基本代码：

```js
import React from 'react'   //提供了React.createElement()
import ReactDom from 'react-dom'   //提供了ReactDOM.render()

ReactDOM.render(<div>....</div>, document.getElementById('root'))
```

在react中每个组件都是一个单独的实例，和vue一样，有私有的数据,生命周期函数和自己的视图等

在react中创建组件的两种方式：

方式一：函数式组件。它内部没有生命周期函数，没有自己的独有数据

在react的工程化项目中（用vscode编辑器），我们会把需要写react组件的js文件命令为jsx文件类型，这样只有一个目的：让创建的文件识别jsx语法，而在create-react-app脚手架创建的项目中， 已经包含了对jsx文件类型的处理。

​		定义：一个js文件或者jsx文件就是一个react组件

```jsx
import React from 'react'  //每一个组件都会返回一个jsx，jsx语法通过webpack中的基于babel-preset-react-app语法解析包变为React.createElement格式,所以必须引入React。

export default function 组件名 (props){    //props由调用该组件时以组件标签属性传给标签的属性组成（对象类型）
	这里可以定于其他变量数据，在return的jsx中可以通过{}使用。
	return <div>...</div>  //函数返回值是jsx,webpack会将返回的结果变为React.createElement()的形式，所以该模块中必须引入React 
}
```



![image-20210619142404717](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619142404717.png)



![image-20210619142435164](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619142435164.png)

![image-20210619142446059](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619142446059.png)

​		![image-20210619142325164](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619142325164.png)

![image-20210619142458250](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619142458250.png)

使用：

```jsx
//入口文件中：
import React from 'react'
import ReactDom from 'react-dom'
import 组件名 from '组件路径'

ReactDOM.render(<div>
	<组件名  index=10 title = "react"></组件名>
</div>,document.getElementById('root'))
```



```jsx
ReactDOM.render(<div>
    hello world
    <Vote title = 'hello world'>
    	<span>span</span>  
    </Vote>
    <Vote title = 'hello react'/>
</div>, document.getElementById('root'))

编译结果：
"use strict";

ReactDOM.render( 
React.createElement("div", null, "hello world", React.createElement(Vote, {
  title: "hello world"
}, React.createElement("span", null, "span")),React.createElement(Vote, {
  title: "hello react"
})), document.getElementById('root'));
```

​		每一次调用函数组件，都相当于执行了一次函数。调取组件时可以选择双闭合或者单闭合标签。其中用双闭合时，可以在组件标签的中间传入其他html标签（类比与vue的插槽slot）。在组件双闭合标签中间写的内容，都将放在组件的props，传给组件，其中的内容在props中是children属性。

![image-20210422083115060](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210422083115060.png)

当在组件标签的中间传递多个元素时，在组件的内部的props.children上是以数组的方式将每个元素作为一个子元素对象存放起来的，如果想在组件内部的jsx语法部分将子元素放到特定位置，使用{ props.children [ index ] }的方式是无法取得元素的，因为{ } 中不能直接放对象，但可以直接放数组或者值类型的数据。（只有一项对象类型的子元素的话，react则做了处理）。

要使用那些对象类型的子元素，往往是借助React构造函数的Children上的map方法。

```jsx
React.Children.map ( props.children, (item, index)=>{
    if(index === 0){
        return <div>
        	{item}======{index}
        </div>
    }
} )
```

![image-20210619154111489](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619154111489.png)

![image-20210619154318625](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619154318625.png)

**函数式组件的特点**（开发简单，渲染快，但一旦组件被调用，那组件内部的信息就不再改变。）：当前组件一旦调用，组件内部的内容就不能再次变化，除非重新调用并传递新的值。函数式组件又称为静态组件——调用一次并传递属性当前组件要呈现的内容都已经确定了。没有什么状态或者生命周期函数能控制它的改变。

相比于类组件，没有state状态管控，没有生命周期函数。**传给函数组件的属性（在props中的）是只读属性，不能对它进行修改，如果尝试修改则报错。**

```
props.key = xxxx  //错误
props.key = props.key || default-value  //错误   不能设置默认值

let title = props.key || default-value  //正确
```

函数式组件不能像类组件一样基于prop-types给属性设置默认规则

```
import React from 'react'
import ReactDom from 'react-dom'

function Clock(props){
	let time = new Date().toLocaleString()
	return <div>
		<p>{time}</p>
	</div>
}

ReactDom.render(
	<div>
		<Clock title= "hello world">
			<em>react<em>
		</Clock>
	</div>,document.getElementById('root')
)
```

### 第七节——类组件（p8）

方式二：基于React.Component类创建组件(动态组件)

```js
//js中的类语法
class Clock {
	constructor(){
		this.key1 = value1   //给类的实例上添加实例自有的属性
	}
	
	key2 = value2;   //es7新增的语法，等价于向类的实例上添加自有属性
	
	protoFunc(){}   //在构造函数原型上添加方法
	
	static Func(){}   //将构造函数看作对象，添加属性给构造函数对象方法（静态方法）
	static key2 = value2  //给构造函数对象添加属性 ，ES7新增的语法（静态属性） bable中有一个包专门处理es6以后的类语法（class语法）————@babel/plugin-proposal-class-properties。
}
```

在React中创建类组件：

```jsx
class 组件名 extends React.Component{
	constructor(props){
		//props：调取组件时传递进来的属性
		super(props)  //super执行相当于把React.Component当作普通函数执行，让方法中的this指向组件实例，并尝试给组件实例根据传参添加属性。下面写了React.Component的源码，所以可以给super传递一些参数，如super(props)
	}
	//存在的问题，constructor并不是html结构的jsx语法，所还需要render方法去返回一个jsx元素。
	
	render(){     //必须要有一个render函数，它返回的内容才是组件要渲染的视图，render中的this指的就是该组件实例，所以可以访问组件实例上的属性或方法。即使在调用super时并没有传递props，在render中还是可以通过this.props来访问props上的属性的，但是在super没有传递props进去时，在constructor中访问this.props则报错。
		return <div>
			<h2> { } </h2>
		</div>
	}
}

class 组件名 extends React.PureComponent{

}

ReactDom.render(<div>
		<组件名 title= "hello world">
			<em>react<em>
		</组件名>
	</div>,document.getElementById('root')
)
```

​		当ReactDOM.render渲染虚拟组件时，如果发现虚拟DOM中 type 是类组件类型的，会创建一个这个类的实例（new 组件名（props）），并把解析出来的props传递给这个类的构造器函数。

​		创建组件实例的过程，执行constructor，执行完constructor才算成功创建了组件实例。在执行constructor时不会主动将props挂在到所创建的实例上，基于this.props不能获取组件对象上的props。

​		当执行完constructor，react继续做一些事，如果调用super时没有传props等，那在执行完constructor后，react会再次尝试将props和context等挂载到组件实例上。所以render等其他生命周期函数中就可以访问this.props中的数据了。

```
React.Component源码：
function Component(props, context, updater){
	this.props = props
	this.context = context
	this.refs = emptyObject
	this.updater = updater || ReactNoopUpdateQueue
}
```

扩展： 继承的几种方式：

1. 原型继承——子类的构造函数的prototype属性指向父类构造函数的一个实例对象 

   不足：父类实例上的私有属性与方法 和 父类原型上的属性与方法都变为了子类所有实例公有的属性或方法

2. call调用父类构造函数实现继承

   不足：只让子类继承了父类实例的私有属性，没有继承父类构造函数上的属性或方法，这种情况下用instancof检测失效

3. 寄生组合继承 Object.create

4. ES6中基于class 实现继承

```
class Parent{
	constructor(args){
	
	}
}

class Son extends Parent{
	constructor(args){
		super(value1,value2,..)
		this.key = valuen
	}
}
```

### 第八节——类组件的属性校验（p9）

对于一个类组件，重点学习两个：属性和状态。

1. 数据管控（model）：

   每一个类组件中，数据只有两种

   - 属性 props，它不能在组件内被修改，但是可以设置默认值和规则

     在react中给属性设置默认规则，比如像vue中的默认值，类型，必须传与否。在react中给属性设置规则需要依赖一个第三方插件：prop-types。

   ```
   npm install prop-types
   ```

   和Vue一样，设定的规则不会阻碍内容的渲染，不符合规则的在控制台抛出警告。

   ```
   Vue中的写法：
   props:{
   	title:{
   		type:String,
   		required:true,
   		default:'xxx'
   	}
   }
   ```

   

   给props传递进来的属性设置默认值：

   ```jsx
   import React from 'react'
   import ReactDom from 'react-dom'
   import PropType from 'prop-types'  //指定属性规则插件
   
   class 组件名 extends React.Component{
   
   	//设置默认值，不用借助prop-types插件
   	static defaultProps = {
   		title = 'hello react'
   	}
   	
   	//设置其他规则,必须借助prop-types插件，所以要在模块中引入prop-types
   	static propTypes = {
   		title:PropTypes.string.isRequired
   	}
   	
   	constructor(props){
   		super(props) 
   	}
   	render(){    
   		return <div>
   			<h2> { this.props.title } </h2>
   		</div>
   	}
   }
   
   ReactDom.render(<div>
   		<组件名>
   			<em>react<em>
   		</组件名>
   	</div>,document.getElementById('root')
   )
   ```

   

   prop-types的官方指南：

   ```javascript
   import React from 'react';
   import PropTypes from 'prop-types';
   
   class MyComponent extends React.Component {
     render() {
       // ... do things with the props
     }
   }
   
   MyComponent.propTypes = {
     // You can declare that a prop is a specific JS primitive. By default, these
     // are all optional.
     optionalArray: PropTypes.array,
     optionalBool: PropTypes.bool,
     optionalFunc: PropTypes.func,
     optionalNumber: PropTypes.number,
     optionalObject: PropTypes.object,
     optionalString: PropTypes.string,
     optionalSymbol: PropTypes.symbol,
   
     // Anything that can be rendered: numbers, strings, elements or an array
     // (or fragment) containing these types.
     // see https://reactjs.org/docs/rendering-elements.html for more info
     optionalNode: PropTypes.node,  //必须是一个元素对象
   
     // A React element (ie. <MyComponent />).
     optionalElement: PropTypes.element,   //必须是一个jsx元素
   
   
     // A React element type (eg. MyComponent).
     // a function, string, or "element-like" object (eg. React.Fragment, Suspense, etc.)
     // see https://github.com/facebook/react/blob/master/packages/shared/isValidElementType.js
     optionalElementType: PropTypes.elementType,
   
     // You can also declare that a prop is an instance of a class. This uses
     // JS's instanceof operator.
     optionalMessage: PropTypes.instanceOf(Message),  //必须是某个类的实例 
   
     // You can ensure that your prop is limited to specific values by treating
     // it as an enum.
     optionalEnum: PropTypes.oneOf(['News', 'Photos']),  //必须是其中的一个
   
     // An object that could be one of many types
     optionalUnion: PropTypes.oneOfType([
       PropTypes.string,
       PropTypes.number,
       PropTypes.instanceOf(Message)
     ]),     
   
     // An array of a certain type
     optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
   
     // An object with property values of a certain type
     optionalObjectOf: PropTypes.objectOf(PropTypes.number),
   
     // You can chain any of the above with `isRequired` to make sure a warning
     // is shown if the prop isn't provided.
   
     // An object taking on a particular shape
     optionalObjectWithShape: PropTypes.shape({
       optionalProperty: PropTypes.string,
       requiredProperty: PropTypes.number.isRequired     //必须传的属性
     }),
   
     // An object with warnings on extra properties
     optionalObjectWithStrictShape: PropTypes.exact({
       optionalProperty: PropTypes.string,
       requiredProperty: PropTypes.number.isRequired
     }),
   
     requiredFunc: PropTypes.func.isRequired,
   
     // A value of any data type
     requiredAny: PropTypes.any.isRequired,
   
     // You can also specify a custom validator. It should return an Error
     // object if the validation fails. Don't `console.warn` or throw, as this
     // won't work inside `oneOfType`.
     customProp: function(props, propName, componentName) {   //自定义验证规则
       if (!/matchme/.test(props[propName])) {
         return new Error(
           'Invalid prop `' + propName + '` supplied to' +
           ' `' + componentName + '`. Validation failed.'
         );
       }
     },
   
     // You can also supply a custom validator to `arrayOf` and `objectOf`.
     // It should return an Error object if the validation fails. The validator
     // will be called for each key in the array or object. The first two
     // arguments of the validator are the array or object itself, and the
     // current item's key.
     customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
       if (!/matchme/.test(propValue[key])) {
         return new Error(
           'Invalid prop `' + propFullName + '` supplied to' +
           ' `' + componentName + '`. Validation failed.'
         );
       }
     })
   };
   ```

### 第九节——状态管理（p10）

- 状态 state（私有状态；redux公共状态），组件内部能自己修改也能让组件重新渲染

  私有状态，类比于vue中的data

  初始化状态state，之后要在组件中使用的state都要在constructor中初始化一下

  ```jsx
  import React from 'react'
  import ReactDom from 'react-dom'
  import PropType from 'prop-types'  //指定属性规则插件
  
  class 组件名 extends React.Component{
  	static defaultProps = {
  		title = 'hello react'
  	}
  	
  	static propTypes = {
  		title:PropTypes.string
  	}
  	
  	constructor(props){
  		super(props) 
  		
  		//初始化组件私有state
  		this.state = {
  			time:new Date().toLocaleString()
  		}
  	}
  	
  	render(){     //生命周期函数
  		console.log('def')
  		return <div>
  			<h2> { this.props.title } </h2>
  			<p>{ this.state.time }</p>        //调用
  		</div>
  	}
  	
  	componentDidMount(){
  		this.state.time ='---------'    //这样是能修改state中的数据的，但是并不能触发视图重新渲染。
  		
  		this.setState({
  			time: new Date().toLocaleString()
  		}，()=>{
  			console.log('ghi')
  		})   //react.Component(组件父类)的原型上的方法   setState(partialState，callback),传参是部分状态，因为组件在初始化时，可能有很多state，而只修改其中的一部分而已。内部用Object.assign(this.state,partialState),这种方式修改state并通知视图渲染。callback会在视图被重新渲染完成后触发。
  		console.log('abc')
  		
  		上面的输出顺序是（考虑的不是初次渲染的情况而是更新state的情况）：
  		abc    
  		def
  		ghi
  		
  		
  		面试问：setState是同步还是异步？回答是：大多数情况是异步的，也有同步的情况。
  		setState会存在异步执行的情况，修改数据加重新调用render函数都在异步执行。
  		Google一下setState什么情况下是同步操作
  		setState:会修改state和通知视图重新渲染
  	}
  }
  
  ReactDom.render(<div>
  		<组件名 title='hello world'>
  			<em>react<em>
  		</组件名>
	</div>,document.getElementById('root')
  )
  ```
  
  ![image-20210619172545366](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619172545366.png)
  
  
  
  ![image-20210619172600853](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619172600853.png)
  
  
  
  ![image-20210619175747946](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210619175747946.png)
  
  
  
  react组件第一次渲染组件完成时调用的生命周期函数：componentDidMount，类比于vue的mounted生命周期函数。
  
  
  
  react的原型中还有一个函数forceUpdate，强制更新视图。
  
  this.state. key = xxxx与this.forceUpdate() 结合使用能强制更新视图。
  
  
  
  
  
  ![image-20210424081615444](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210424081615444.png)
  
  

### 第十节——受控组件和非受控组件（p11）



**把基于状态或者属性的更新来驱动视图渲染的组件称为“受控组件”（受状态管控的组件）**

通过组件标签属性传递进来的属性默认不能修改，但以下情况算是修改这些属性：

- 通过第三方插件（prop-types）设置的默认值

- 让父组件重新调用子组件并传递新的值作为标签属性

- 把获取的属性赋值给组件的状态，后期修改状态


**非受控组件不受状态管控，而是直接操作DOM**

```jsx
class 组件名 extends React.Component({
	constructor(props){
		super(props)
	}
	render(){
		return <div>
			<h3>hello react</h3>
			<p ref= 'timeBox'>{ new Date().toLocaleString() }</p>   //ref的使用方式一
			<span ref={ element =>{      //ref的使用方式二 ，用函数方式，项目中常用，其中element代表当前元素对象，相当于直接将给元素挂在到当前组件实例上了，取用时直接使用this.timeBox2获取对应的元素。
				this.timeBox2 = element
			}}>{ new Date().toLocaleString() }  </span>
		</div>
	}
	componentDidMount(){
		//渲染完后可以获取dom元素
		setInterval(()=>{
		
			//ref的使用方式一
			this.refs.timeBox.innerHTML = new Date().toLocaleString()
			
			//ref的使用方式二
			this.timeBox2.innerHTML = new Date().toLocaleString()
		},1000)
	}
})

//Component中给实例赋值了一个refs属性，它也是和vue一样用来存DOM元素的。
```

方式三：REACT HOOK 

#### refs转发

ref转发：引用转发。

将父组件定义的ref传到子组件的内部绑定子组件内部的具体某个DOM元素或者其他子组件的子组件上。子组件接收ref，并将ref向下传递。

对于**函数式组件**子组件接受来自父组件的ref转发的方式是使用React.forwardRef方法对函数组件进行封装。例子：

```jsx
const FancyButton = React.forwardRef((props, ref) => (   //子组件中
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：（父组件中）
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;

1.调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量
2.指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>
3.React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数
4.向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性
5.当 ref 挂载完成，ref.current 将指向 <button> DOM 节点
```

常规函数（没有使用React.forwardRef封装过的函数组件）和 class 组件不接收 `ref` 参数，且 props 中也不存在 `ref`。但是对于类组件也是可以进行ref的转发的。











### 第十一节——生命周期函数（p12）

组件的生命周期分为三个阶段：

- Mounting（加载阶段）
- Updating（更新阶段）
- Unmounting（卸载阶段）

**旧生命周期函数**:

![旧生命周期函数](https://segmentfault.com/img/bVbhRhS)



<img src="https://segmentfault.com/img/bVbhRvE" alt="图片描述" style="zoom: 150%;" />



**Mounting（加载阶段）：**

开始：虚拟DOM在执行render时，执行到类组件的组件标签行时算作开始

getDefaultProps: 获取默认的属性值，记得之前引入了prop-types插件给属性设置默认值和规则校验。

getInitialState：获取初始化的状态，初始化状态一般写在constructor中，写为 this.state ={ ....} ,所以这一步相当于是执行的constructor。如果不写constructor 或者  不在constructor中写 this.state 以初始化状态，那也可以直接使用ES7语法，在类的代码块中直接写：state ={....}，这相当于也是给组件实例绑定了state。所以在实际项目中可能有些公司不在类的内部写constructor构造器函数了，而直接写在公共方法区域，那也是可行的。

constructor：创建完成实例

componentWillMount: 第一次组件渲染之前，一般在这个生命周期函数中获取服务器中的数据，把获取的数据重新赋值给组件的state中或者存放到redux中 

render：第一次或者重新进行视图的渲染

componentDidMount：  第一次组件渲染完成，一般在这里可以获取dom元素，可以通过非受控组件的方式操作dom等

扩展：只要组件不销毁再重新创建，getDefaultProp，constructor，componentWillMount，componentDidMount都只执行一次。



**Updating（更新阶段）：**

​		shouldComponentUpdate：是否应该更新组件，它可以接受两个参数，nextProps,  nextState，调用setState函数时，会首先触发该生命周期函数，如果在这个函数内部访问this.state中的数据时，得到的还是原来的数据值。  而nextProps：表示即将要修改为的新属性对象 ，nextSt ate表示即将要修改为的新state对象。 如果这个方法返回true表示允许重新渲染视图，返回false则停止继续渲染视图。     

​		一般在这个生命周期函数中做组件性能优化（比如更改一些状态需要更新视图，但是有一些并不需要更新视图，所以可以在这里增加一下判断条件，返回true或false）。 

​		执行setState方法会触发shouldComponentUpdate生命周期函数，根据shouldComponentUpdate返回的时true还是false决定是否渲染组件。但是setState方法中对state的修改是能正常修改state中对应的值的。



​		forceUpdate方法是强制更新视图，不会触发shouldComponentUpdate方法。



​		shouldComponentUpdate返回true后：

- componentWillUpdate

- render

- componentDidUpdate

**Unmounting（卸载阶段）**

执行Unmount方法会卸载该组件，组件卸载并不是当前组件消失，而是不再支持数据更改后的视图自动重新渲染，和vue类似。其中路由跳转时，常触发组件的卸载。

componentWillUnmount



​		以上的更新生命周期函数都是通过控制组件的state数据的改变来触发的生命周期函数。但是一个组件中，除了state改变可以触发生命周期函数的执行，还有属性属性的改变可以触发的生命周期函数。

组件属性改变触发的生命周期函数：

```jsx
import React from 'react'
import ReactDom from 'react-dom'

class Test extends React.Component{   //类比于父组件
	constructor(props){
		super(props)
		this.state = {
			num:100
			title:'1'
		}
	}
	render(){
		//第一次创建父组件，并解析父组件的jsx，会执行全部的父组件创建阶段的生命周期函数，但是并不一定会依次执行，因为还要考虑子组件的生命收周期函数，在父组件的jsx语法中有使用其他组件时，也会创建该组件，并触发子组件的一系列生命周期函数，当父组件中的数据改变后，会再次渲染父组件，在重新渲染时，也会重新渲染子组件，但是它们都不是重新创建组件，所以触发的生命周期函数不会包含组件创建阶段的生命周期函数。   和vue中的情况一样。
		return <div>
			<h2>{ this.state.num }</h2>
			<Clock title={ this.state.title }></Clock>
			<button onClick={ ()=>{ this.setState( { this.state.title = this.state.title++ } ) } }>点击</button>
		</div>
	}
}

class Clock extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div> {this.props.title} </div>
	}
}


ReactDOM.render(<div>
	<Test  index=10></Test>
</div>,document.getElementById('root'))

```

当父组件重新渲染，子组件也会重新渲染，并在渲染子组件时首先触发子组件的componentWillReceiveProps生命周期函数。

componentWillReceiveProps(nextProps){} : 

然后执行子组件的shouldComponentUpdate

 shouldComponentUpdate返回true后：

- componentWillUpdate

- render

- componentDidUpdate



**新的生命周期**

React16.3生命周期

![image.png](https://segmentfault.com/img/bVcHbyd)



React16.4+生命周期

![image.png](https://segmentfault.com/img/bVcHbyJ)

### 第十二节——投票案例（p13）

````jsx
import React from 'react'
import ReactDOM from 'react-dom'
import propTypes from 'prop-types'

export default class Vote extends React.component{
	constructor(props){
		super(props)
		this.state={
			supNum:0,
			oppNume:0
		}
	}
	render(){
		<div className="vote-container">
			<header className="vote-header">
				<h2>{ this.props.title }</h2>
				<span> 总人数：{ this.state.supNum + this.state.oppNum }</span>
			</header>
			<div className="vote-content">
            	<p>支持人数：{ this.state.supNum }</p>
            	<p>反对人数：{ this.state.oppNum }</p>
            	<p>支持率：{ this.getRatio() }</p>
            </div>
			<footer className="vote-footer">
				<button onClick=()=>{
					this.setState({this.state.supNum=this.state.supNum++})
				} >支持</button>
                
                {/*<button onClick={this.handel.bind( xxx,xxxx )}>支持</button>*/}
                
				<button onClick=()=>{
					this.setState({this.state.oppNum=this.state.oppNum++})
				} >反对</button>
			</footer>
		</div>
	}
	//在组件的类中直接点定义组件实例要使用的方法（定义在了Vote.prototype上），这些方法中的this的指向还是不确定的，具体要看这项方法怎么被调用。   这一点和Vue中的方法是不同的，vue中方法的this都是用bind给绑定好了，无法改变的。
	//在react中为了保证方法中的this是组件实例，那么一般用箭头函数。这些函数上都可以获取事件对象。但不和原生的事件对象不一样。给事件对象上的每个属性设置了getter和setter。但用法一样。event.persist()。
	
	functionName(){}  //这种定义方式在被绑定给某个dom元素时，this是undefined 也不是绑定该事件的dom元素
	getRatio =()=>{
		let { supNum,oppNum } = this.state,
        	ratio = null,
        	total = supNum +oppNum
        ratio = total === 0 ? 0:supNum/total *100
        return (ratio).toFiexd(2) + '%'
	}
    handle=()=>{
        this.setState({
            supNum:this.supNum++
        })
    }
}

ReactDOM.render(
	<div>
		<Vote title='hello react'></Vote>
	</div> , document.getElementById('root'))
````

关于组件样式：

在项目的入口文件中引入公共样式；在react中默认是无法像Vue一样能设置组件私有的样式的（vue中的scoped），同时也无法将css代码写在组件所在的jsx文件中，要给组件写css样式，都是在组件的平级目录新建一个和组件名一样的样式文件（如：.css, .less,.scss），然后再引入到组件的jsx文件中。这样做了之后还可能存在各个组件中样式名冲突的问题，为此的解决方案有：

1. 基于额外的webpack插件，在处理样式文件时可以把组件样式控制为私有的
2. 开发者在使用样式预编译语言时，就注意样式的区分



注意点：

在该投票案例中，想给jsx语法中的某个dom元素绑定事件，在事件名等号后面的花括号中写的函数是不能加括号的，家里括号就意为着立即执行。因为不能加括号，所以就不能传参了。如果想要传参的话，可以使用 bind 函数 ，或者写为下面的形式：

```
<button onClick={this.handel} >点击</button>

<button onClick={this.handel.bind(this,[xxx])} >点击</button>

<button onClick={(ev)=>{
	this.handel(xxx)
}} >点击</button>
```



### 第十三节——面试知识点（p14）

React中的事件是合成事件，比如，pc端的点击事件在移动端会有300毫秒的延迟问题，所以react在开发框架时，发现如果就提供类似于原生事件的点击，那在移动端就存在问题。所以React为了跨平台和终端，它把所有的事件都做了代理。所以其实react中标签上的onClick事件并不和原生的oncClick事件完全一样。react中的事件绑定都是走的都是事件委托。事件对象也被代理了。

底层源码上都是基于事件委托把所有的事件进行事件代理——为了能跨平台和跨终端。事件对象也基于此进行了单独处理，类似于事件对象池，真正的事件对象在对象池中存放这，获取时才能从池内取出。目的是为了能让react在渲染的时候，保证在state，context，props三者高度统一的情况下，还能**在异步操作中能拿到事件对象**。



setState为什么要保持异步操作？

1. 避免代码执行过多造成堵塞；

2. 让一次代码逻辑中多次修改state后，组件还是只渲染一次，提高性能，这点和vue类似和浏览器的渲染队列机制。如果多次修改同一个state数据，那以最后一次的为主。Vue.$nextTick ( )

setState是异步的情况：

1. setState方法在一个合成事件中执行时
2. setState方法在一个生命周期函数中执行时

setState是同步的情况：

1. 将setState方法在另一个异步函数中执行时(定时器，原生JS事件，ajax请求，Promise)



自己去了解React.PureComponent和React.Component的区别

PureComponent给组件加了一个shouldComponentUpdate，在这个函数中做了一个之前属性和最新属性以及之前状态和最新状态的比较，如果比较后发现没有更改，则不渲染视图。

### 第十四节——组件嵌套与通信（p15,p16）

​	通信：

1. 基于属性传递props(单向：父 --> 子)，且子组件中不能修改

2. 回调函数（和JSONP和JSBridge类似）：父组件将自身的方法以标签属性的方式传给子组件，子组件调用该方法并传入参数（最常用）

   上两种方法常用在父子组件之间，虽然也可以用于祖先与后代之间，但是一层层传递过程麻烦；也可以用于兄弟组件之间的通信，但是必须保证它们有同一个父组件。

3. 执行上下文进行信息传递，它后代组件中需要的数据与方法都放在祖先元素的上下文中，后代可以直接取用

4. redux/react-redux/dva/redux-saga/mobx....

5. 开发者自己开发一套eventBus机制（发布订阅）

6. 本地存储

<img src="C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210425075620137.png" alt="image-20210425075620137" style="zoom: 200%;" />



```jsx
import React from 'react'
import ReacDOM from 'react-dom'
import Vote from './Vote'

ReacDOM.render(
	<div>  
		<Vote title='hello world'></Vote>
	</div>,document.getElementById('#root'))
```

```jsx
import React from 'react'
import propTypes from 'prop-types'
import './Vote.less'

export default class Vote extends React.Component{
	static propTypes = {
        title: PropTypes.string.isRequired,
    };
	constructor(props){
        super(props),
        this.state = {
            supNum:0
        	oppNum:0
        }
    }
	render(){
        let { supNum, oppNum } =this.state
        return <div>
            <div className= 'vote-container'>
                <h2>{ this.props.title || '默认值'}</h2>
                <span>总人数：{ supNum + oppNum } </span>
            </div>
         	<VoteMain supNum={ supNum } oppNum={ oppNum }></VoteMain>
           	<VoteFooter handle = { this.handle }></VoteFooter>
        </div>
    }

	handle=(type,num = 1)=>{
       let { supNum, oppNum } =this.state
       this.setState({
           supNum = type ==='support' ? supNum+num : supNum
           oppNum = type ==='oppose' ? oppNum+num : oppNum
       })
    }
}

class VoteMain extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        let { supNum, oppNum } =this.props
        return <main className='vote-main'>
             <p>支持人数：{supNum}</p>
             <p>反对人数：{oppNum}</p>
             <p>支持率：</p>
        <main>
    }
}

class VoteFooter extends React.Component{
     constructor(props){
          super(props)
     } 
     render(){
         let { handle } = this.props
         return  <footer className='vote-footer'>
            	<butto onClick={()=>{
                     handle('support',5)   //注意这里对onclick事件直接绑定handle的话，则没有办法传参了。
                 }}>支持</butto>   //子组件调取父组件中的方法并修改父组件中的信息
            	<butto onClick={handle.bind(null,'oppose',2)}>反对</butto>   //子组件调取父组件中的方法并修改父组件中的信息
         </footer>
     }
}

```

**bind()方法默认会在所有传参的最后面再加上事件对象event**

### 第十五节——发布订阅在React中实现组件通信（p17）

手动实现发布订阅在React中实现组件通信

```javascript
class Eventpublish{
	constructor(){
		this.pond ={}   //事件池
	}
	$on(eventName,eventFunction){
		//判断事件池中是否存在对应的事件名
		if( !this.pond.hasOwnProperty(eventName) ) {
			this.pond[eventName] = [eventFunction]
			return 
		}
		//订阅的处理函数的去重
		if(this.pond[eventName].some(item=>{
			item === eventFunction
		})) return 
		this.pond[eventName].push( eventFunction )
	}
	$emit(eventName,...args){
		if(!this.pond.hasOwnProperty(eventName)){
			return
		}
		this.pond[eventName].forEach(item=>{
			item(...args)
		})
		
		//let arr = this.pond[eventName] || []
		//arr.forEach(item =>{
		//item.call(null,...args)
		//})
	}
}

export default new Eventpublish()
```



```jsx
import React from 'react'
import propTypes from 'prop-types'
import EP from './Eventpublish.js'   //在该模块的最外层作用域添加了一个全局都能访问到的对象EP
import './Vote.less'

export default class Vote extends React.Component{
	static propTypes = {
        title: PropTypes.string.isRequired,
    };
	constructor(props){
        super(props)
    }
	render(){
        return <div>
            <div className= 'vote-container'>
                <h2>{ this.props.title || '默认值'}</h2>
                <span>总人数： </span>
            </div>
         	<VoteMain ></VoteMain>
           	<VoteFooter ></VoteFooter>
        </div>
    }
}

class VoteMain extends React.Component{
    constructor(props){
        super(props)
        this.state =  {
            supNum:0
        	oppNum:0
        }
    }
    render(){
        let { supNum, oppNum } =this.state
        return <main className='vote-main'>
             <p>支持人数：{supNum}</p>
             <p>反对人数：{oppNum}</p>
             <p>支持率：</p>
        <main>
    }
     handle(type){
       let { supNum, oppNum } =this.state
       if(type=='support'){
           this.setState({
               supNum : supNum + 1
           })
       } else {
           this.setState({
               oppNum : oppNum + 1
           })
       }      
     }
            
     //在组件第一次渲染完成之后将组件的handle事件处理函数放入到handle事件对应的事件池中。
     componentDidMount(){
     	EP.$on('handle',this.handle)            
     }
}

class VoteFooter extends React.Component{
     constructor(props){
          super(props)
     } 
     render(){
         return  <footer className='vote-footer'>
            	<butto onClick={()=>{
                     EP.$emit('handle','support')   
                 }}>支持</butto>   
            	<butto onClick={()=>{
                     EP.$emit('handle','oppose')
                 }}>反对</butto>   
         </footer>
     }
}

```



### 第十六节——执行上下文中进行组件通信（p18）

执行上下文：当前代码所执行的环境。 在React中的执行上下文指的是：

执行上下文实现组件间通信多用于祖先和后代组件，只要多个组件具有共同的祖先组件，那么就能基于执行上下文实现不管是祖先组件下的父子，爷孙组件还是兄弟组件之间的通信。 

实现思路：

1. 把所有后代中需要用到的公共状态都预先存储到共同的祖先组件的上下文中

   如何在祖先组件中存放状态：

   ```jsx
   import React ,{ Component } from 'react'
   import ReactDOM,{ render } from 'react-dom'
   import PropTypes from 'prop-types'
    
   class ancestor extends React.Component{
   	//后代组件可以获取所在上下文（祖先组件）中的一些属性值，这些属性值需要预先指定，在祖先组件中指定
   	static childContextTypes = {  //设置后代组件中可以用哪些属性并确定这些属性的类型或者方法
   		text:PropTypes.string     //redux的源码就是基于此
   		num:PropTypes.number
   	}
   	getChildContext(){   //这也是一个生命周期函数，提供后代中能用的属性的具体值或者方法
   		return {
   			num:this.state.num,
   			text:'hello world'
   		}
   	}
   }
   ```

   

2. 哪个后代组件需要用的话，直接注册获取使用（类似于vue中provied和inject）

   ```jsx
   class offspring extends Component{
   	static contextTypes = {  //后代组件中想用祖先组件中的那个属性就在这里注册获取使用，要求和祖先组件中声明时的类型一致
   		num:PropTypes.number
   	}
   }
   ```



一般都要把挂载到祖先上下文中的数据是祖先的状态或者方法（以实现响应式），后期只要修改祖先的状态，上下文中的状态就会跟着变，同时祖先元素重新渲染，后代元素也要重新渲染并获取到最新的上下文状态。

```jsx
import React from 'react'
import propTypes from 'prop-types'
import EP from './Eventpublish.js'   //在该模块的最外层作用域添加了一个全局都能访问到的对象EP
import './Vote.less'

export default class Vote extends React.Component{
	static propTypes = {
        title: PropTypes.string.isRequired,
    };
	constructor(props){
        super(props)
        this.state ={
             supNum:0
        	 oppNum:0
        }
    }
 	handle=(type)=>{
       let { supNum, oppNum } =this.state
       if(type=='support'){
           this.setState({
               supNum : supNum + 1
           })
       } else {
           this.setState({
               oppNum : oppNum + 1
           })
       }      
    }
    static childContexttypes = {
        supNum:PropTypes.number,
        supNum:PropTypes.number,
        handle:PropTypes.func 
    }

	getChildContext(){               //它是生命周期函数，它在getInitialState之后被调用执行，但是本生命周期函数能在祖先组件中的状态改变并重新渲染时被重复调用。
        let { supNum, oppNum } =this.state
        return {
			 supNum:supNum,
        	 supNum:oppNum,
             handle:this.handle
		}
    }

	render(){
        let { supNum, oppNum } =this.state
        return <div>
            <div className= 'vote-container'>
                <h2>{ this.props.title || '默认值'}</h2>
                <span>总人数：{ supNum + oppNum } </span>
            </div>
         	<VoteMain ></VoteMain>
           	<VoteFooter ></VoteFooter>
        </div>
    }
}




class VoteMain extends React.Component{
    static contextTypes = {   //注意这并不代表后代组件就能用了，这些属性是放在上下文中的(context中)
		supNum:PropTypes.number，
        oppNum:PropTypes.number
	}

    constructor(props, context){   //这步是手动将context上下文信息挂载到实例this上，但是不做的话，也能在其他地方获得context，获取的上下文状态都是能修改的，但是不会影响祖先组件的。
        super(props, context)
    }

    render(){ 
        let { supNum, oppNum } =this.context
        return <main className='vote-main'>
             <p>支持人数：{supNum}</p>
             <p>反对人数：{oppNum}</p>
             <p>支持率：</p>
        <main>
    }
}

            
            
            
class VoteFooter extends React.Component{
     static contextTypes = {   
		handle:PropTypes.func，
	}

     constructor(props,context){
          super(props,context)  //super(props)
     } 
     render(){
         let { handle } = this.context
         return  <footer className='vote-footer'>
            	<butto onClick={()=>{
                      handle('support')
                 }}>支持</butto>   
            	<butto onClick={()=>{
                      handle('oppose')
                 }}>反对</butto>   
         </footer>
     }
}
```

### 第十七节——轮播案例（p19-p20）



### 第十八节——复习（p21）

总结：

![image-20210426222038946](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426222038946.png)

![image-20210426222130512](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426222130512.png)

![image-20210426222849893](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426222849893.png)

![image-20210426222936790](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426222936790.png)

![image-20210426222948976](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426222948976.png)z

![image-20210426223303540](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426223303540.png)

![image-20210426223354586](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210426223354586.png)



### 第十九节——ContextAPI（p22）

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Count from './count.jsx'

ReactDOM.render(
	<div>
		<count></count>
	</div>,
document.getELementById('root'))
```

```jsx
import React from 'react'
import PropTypes from 'prop-types'

class CountNum extends React.Component{
	static contextTypes = {
		num: Proptype.number
	}
	render(){
        return <div>
			{ this.context.num }
		</div>
    }
}

class CountButton extends React.Component{
	static contextTypes = {
		setNum: PropsTypes.func
	}
	render(){
        return <>
		<button onClick={()=>{
			this.context.setNum()
		}}>点击加一</button>
		</>
    }
}

export default class Count extends React.Component{
	state = {
		num: 0 
	};
	setNum = ()=>{
		this.setState({
			num: this.state.num + 1
		})
	};
	
	//设置上下文信息
	static childContextTypes = {
		num: PropsTypes.number,
		setNum: PropsTypes.func
	}

	//暴露后代组件中要使用的state和方法   
	getChildContext(){   //之后该祖先组件中的state一旦改变，该生命周期函数将重新执行，以更新上下文中的最新state
		return {
			num:this.state.num
			setNum :this.setNum
		}
	}
	
	render(){
		return <div>
		 <h3>计数器</h3>
		 <CountNum></CountNum>
		 <CountButton></CountButton>
		</div>
	}
}
```

其实上面使用context的方案其实还是比较复杂的，现在React中提供了一套更方便的api方法，操作上下文。

```jsx
import React from 'react'
import PropTypes from 'prop-types'

let ThemeContext = React.creatContext() //创建了一个上下文对象，该对象中提供两个组件：
//  ThemeContext.Provider ：让祖先组件注册上下文中的内容
//  ThemeContext.Consumer：让后代组件获取上下文中的内容

class CountNum extends React.Component{
	static contextType = ThemeContext   //后代组件的注册方式一，祖先提供的state和方法存在了后代组件的this.context中了。
	render(){
        return <div>
			{ this.context.num }
		</div>
    }
}

class CountButton extends React.Component{

	render(){
        return <ThemeContext.Consumer>   //后代组件的注册方式二，把后代组件的jsx用ThemeContext.Consumer组件包裹并嵌套在函数内部，value就是祖先组件注册的上下文信息,也可以用context指代value。
			{
             	context => {  
                    return <button onClick={()=>{
						context.setNum();
					}}>点击加一</button>
                }   
            }
		</ThemeContext.Consumer>
    }
}

class Count extends React.Component{
	state = {
		num: 0 
	};
	setNum = ()=>{
		this.setState({
			num: this.state.num + 1
		})
	};
	
	render(){
		return <ThemeContext.Provider value={ {
                num:this.state.num,
                setNum:this.setNum
            } }>   //祖先的jsx语法用ThemeContext.Provider组件包裹并注册state
             <h3>计数器</h3>
             <CountNum></CountNum>
             <CountButton></CountButton>
		</ThemeContext.Provider>
	}
}
```

### 第二十节——React Hooks（p24-p27）

引言：之前在react中创建组件的方式是两种：

1. 函数式组件——静态组件，创建简单，渲染容易，无状态和周期函数。可以接受属性（props）和上下文对象（context）  
2. 类组件——动态组件，有状态和生命周期，开发难度相对大，渲染较复杂

在类组件中的生命周期函数中，如componentDidUpdate 和 componentDidMount  都需要写相同的逻辑任务，那么就有代码冗余的地方。为此，引入的react hook，它介于函数组件和类组件之间。

React Hooks中有多个函数，常用的有：useState，useRef, useEffect, useReducer。

React Hook：一种创建组件的新方式或者理解为它给函数式组件提供各种类组件内拥有的函数。创建的组件介于类组件和函数组件之间，既能像函数式组件一样开发和渲染快，也能想类组件一样，有自己的状态和生命周期函数。

#### useState（使用状态）

```jsx
import React,{ useState } from 'react'

export default function Vote(props){
    //不能直接给props中的状态赋值默认值，但是可以变相的赋默认值,title是函数的私有变量，修改它不会重新渲染组件。
    let title = this.props.title || ''  
    //想在函数式组件中拥有状态并且有状态修改后重新渲染函数式组件的方法，用React Hooks中的useState
    //let [状态，修改状态的方法] = useState(初始化状态值)   
    //方式一：
    let [supNum ,setSupNum] = useState (0)  //一个useState只能有一个状态,支持写多个useState,该方法返回的是一个数组，所以可以解构，第一个值是该组件的state ，第二个值是专门用于操作该state的方法。
    let [oppNum ,setOppNum] = useState(0)    
    
    //方式二：
     let[ state,setState ] = useState({    // usrState方法还可以接受一个函数作为参数，惰性初始化。每一次Vote组件重新渲染时，都会将初始化的对象类型的state传给useState，而useState内部又会重新赋值给state，但是只需要初始化的时候传（第一次需要传），之后的就不用再传了，所以就可以传函数返回对象类型的state。
    	supNum:0,
    	oppNum:0
    }) 
     // 不采用惰性初始化方式时，每次组件的render函数（包括第一次）被调用的时候，都会将该初始状态值传入useState中。第一次传入并没问题，但是之后render再次执行时就没有必要再传入了，这时写成函数就可以优化了。
     
     //惰性初始化:
     let[ state,setState ] = useState(()=> 
        return {
    	supNum:0,
    	oppNum:0
    })
    //state,setState都是一个对象  ，可以进行对象解构。
    //setState({...})，括号中的对象是什么，就直接把原始状态整体替换为括号中的新对象，所以在设置新状态之前，需要把之前的state对象克隆一份。写为：setState( { ...state, supNum:supNum + 1} ),每一次重新赋值状态都会额外开辟一些内存空间，所以官方推荐的是方式一。
    
    
    //方式一对应的使用方式：
    return <div>
            <h3>{title}  <span>总人数：{ supNum+oppNum }</span></h3>
            <p>支持人数：{ supNum }</p>
            <p>反对人数：{ oppNum }</p>
            <p>支持率：{}</p>
            <buttonon onClick={ ()=>{
                    setSupNum( supNum+1 )    //修改状态，并重新渲染视图 
                } }>支持</button>
            <button onClick={ ()=>{
                    setOppNum( oppNum+1 )   //修改状态，并重新渲染视图
                } }>反对</button>
    	</div>
    
    //方式二对应的使用方式：
     return <div>
                <h3>{title}  <span>总人数：{ state.supNum+ state.oppNum }</span></h3>
                <p>支持人数：{  state.supNum }</p>
                <p>反对人数：{  state.oppNum }</p>
                <p>支持率：{}</p>
                <buttonon onClick={()=>{
                        setState({
                            ...state,
                            supNum: supNum+1
                        })    //修改状态，并重新渲染视图 
                    }}>支持</button>
                <button onClick={()=>{
                        setState({
                            ...state,
                            oppNum: oppNum+1
                        })
                 }}>反对</button>
    		</div>
}
```

![image-20210427090632821](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210427090632821.png)

![image-20210427090729660](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210427090729660.png)

![image-20210427090704498](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210427090704498.png)

![image-20210427090611861](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210427090611861.png)

手写useState：

```javascript
let state
function useState(initialState){
    state || state = initialState
    function dispatchAction(newState){
        state = newState
        //之后的步骤就是重新渲染 用render()
    }
    return [state, dispatchAction]
}
```



#### useEffect（使用生命周期函数）

类似于componentDidMount/Update，相当于给当前的函数组件提供了前面的那两个生命周期函数。所以不管组件是完成初次渲染，还是完成在状态改变后渲染的，都触发useEffect执行。

使用：

1. 先在要使用的函数式组件中引入

2. useEffect( ( )=>{ ... } ,[依赖项])   ,可以接受一个函数作为第一个参数，一个可选的第二个参数表示依赖项——手动指定哪些状态值的改变会才会触发本方法。

   依赖项中有多项，只要有一项改变就会触发 useEffect执行。

   如果第二个参数不填写，那么callback每次render都会被执行。

   如果依赖项是一个空数组，则只有第一次渲染才会执行。

模拟useEffect：

```javascript
let prev 
function useEffect(callback,dependencyList){
	if(dependencyList == undefined){
		callback()
		return 
	}
	if(dependencyList.length === 0 && !prev){
		callback()
		prev = dependencyList
	}else if (dependencyList.length > 0){
		if(dependencyList.some(item, index)=>{
			return item !==prev[index]
		}){
			callback()
            prev = dependencyList
		}
	}
}

dependencyList的三种情况：undefined, [], [key1,key2,...]
let prev = [];
function useEffect(callback,dependencyList){
    let flag =  dependencyList &&  dependencyList.length>0 ? dependencyList.some((item,index) =>{
        return item !== prev[index]
    }): (prev.length === 0 ? true:false)
    
    if(!dependencyList || flag){
        callback()
        prev = dependencyList.length ===0 ?['@'] : dependencyList
    }
}

```

扩展：空数组的some方法返回false，[].some(item => item )

​			 React hooks和vue3.0很像



#### createRef/useRef（用DOM元素）

ref:让开发者可以操作dom元素。

案例：文本框自动对焦

```jsx
import React ,{ createRef, useRef， useEffect} from 'react'

export default function InputBox(props){
    const inputRef = createRef()   //inputRef:{ current: xxxx } ，创建一个对象,刚创建的时候，inputRef对象的current属性为null，当渲染组件的时候，会识别标签元素中带有 ref属性，且值为 inputRef的，把当前元素获取到赋值给inputRef的current属性，所以在渲染完成后，inputRef.current可以获取对应的dom元素对象。
    
    useEffect(()=>{
        console.log(inputRef)
    },[])
	return <div>
        <input type="text"  ref={ inputRef }/>
        <button onClick={()=>{
                inputRef.current.focus()    //createRef这种方式处理时，在点击按钮时，当前组件不会重新渲染，只是直接进行dom层面的操作。
            }}>自动聚焦</button>
    </div>

}
createRef会在函数式组件每一重新被调用渲染时重新执行，生成一个ref新的对象。useRef只会在第一次渲染时创建一个ref新的对象，之后组件重新渲染时，如果发现已经创建过，则不再创建新的ref对象。
```

在类组件中想要操作dom，用ref。在标签元素上用ref，会把所有写了ref的元素获取到，放在组件实例this.refs 上。

在函数式组件中并没有实例this的概念，也想用实例的话，要用react hooks 。

#### useReducer

useReducer和redux是相关的。

```jsx
import React,{ useReducer } from 'react'

//初始状态
let initailState = {
	n:0,
	m:0
}

//统一修改state的函数
state为容器中当前的状态
action基于dispatch派发的行为操作，派发时传递的对象
const reducer =function(state,action ){
	switch(action.type){
        case 'changeN'
            state = {...state,n:action.payload}
    		break
    	case 'changeM'
    		state = {...state,M:action.payload}
			break
    }
    return state   //返回的值是什么就会把当前容器中的状态改为什么
}

export default function ReducerBox(){
	
	let [ state,dispatch ] = useReducer(reducer,initailState)  //useReducer返回一个数组，和useState很相似,useState管控的是私有状态，useReducer管控的是公共状态。
	let { n,m } = state
    let total = parseFloat(n)+parseFloat(m)
    total =isNaN(total) ? 0 : total
    dispatch({
        
    })
    
	return <div>
        <input type='number' value={ n } onChange = {(event)=>{
                dispatch({
        			type:'cahngeN',
                    payload:parseFloat(event.target.value)
    			})
            }}> + <input type='number' value={ m } onChange = {(event)=>{
                dispatch({
        			type:'cahngeM',
                    payload:parseFloat(event.target.value)
    			})
            }}> = <span>{ total }</span>
	</div>
}
```

![image-20210428215723972](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210428215723972.png)



### 第二十一节——redux (p28-p31)

之前组件间的通信方式有：

1. props：标签属性（能实现父传子和子传父和有共同属性的兄弟）
2. 模拟发布订阅
3. 执行上下文（context）  ，问题：所有需要共享的数据都要事先就在祖先组件中定义好，而且想让数据改变的方法也要事先在祖先组件中定义好，这就导致祖先组件的业务逻辑随着项目的增大而越来越大。  

redux中管理的数据往往有两类：

- 业务逻辑数据
- 控制UI状态的数据
- 可预测化的状态管理

![image-20210704151352398](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210704151352398.png)

安装 ：npm install redux react-redux

```jsx
import React from 'react'

function VoteContent(){
	return <>
		<p>支持人数：</p>
		<p>反对人数：</p>
	</>
}

function VoteButton(){
	return <>
		<button>支持</button>
		<button>反对</button>
	</>
}


class Vote extends React.Component{
	 render(){
	 	return <div>
            <h3>hello react  <span>总人数： </span></h3>
	 		<VoteContent />
	 		<VoteButton />
	 	</div>
	 }
}

export default Vote
```

redux源码：

```javascript
redux的入口文件中导出的内容：
export {
	createStore,  //创建容器
	combineReducers,  //合并管理者
	bindActionCreators,  //创建action的行为方法
	applyMiddleware,  //应用中间件
	compose,   //类似于函数柯里化进行函数处理
	__DO_NOT_USE__ActionTypes
}
```

​	



在执行createStore函数后会返回一个对象，存储公共状态：

```javascript
createStore函数在源码中接受三个参数并返回一个对象，同时返回一个对象
export default function createStore(reducer,preloadedState, enhancer){
    ......
    return {
        dispatch,  //派发
        subscribe,  //订阅
        getState,   //获取
        repalceReducer,   //替换
        [$$observable]:observable
	}
}
```

**![image-20210620180635859](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210620180635859.png)**

使用：

对于投票案例中，各个组件之间需要共享的state有supNum和oppNum。公共状态管理并非把状态存在某个组件中，而是存在全局下。所以常在项目入口文件中引入redux。

1. 创建容器：createStore(reducer[管理者],  preloadedState[初始状态])  创建一个全局的容器，用来存储公共的状态。 页面刷新，容器中的数据不会保存。 

   
   创建一个容器就自带一个事件池。但不一定自带一个状态池。
   
   
   
   刚开始加载页面时，需要用state的组件通过store.getState从公共状态池中将数据拿到并渲染展示，当状态池中的状态改变了，所有用到那些状态的组件就都应该重新渲染（但不是像vue一样的自动渲染，需要开发者自己手动触发渲染）。在redux中使用的是发布订阅去渲染组件。
   
    第一次绑定完成数据到组件中后，需要向事件池中增加更新组件的方法store.subscribe([方法])。 
   
   当状态改变时，开发者想让组件重新渲染以拿到最新状态信息，所以开发者需要将各个组件重新渲染的方法添加 到事件池。 
   
   让组件重新渲染的方法（两种）：
   
   1. this.forceUpdata（只有类组件有）
   2. 创建一些组件自有的状态，让容器中的状态等于自己的私有状态用setState修改自己状态以实现组件更新

![image-20210429093156947](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210429093156947.png)



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/20/16ad40d90c5d46fa~tplv-t2oaga2asx-image.image)



createStore( )  方法创建的实例，在容器中的状态改变时，会通知事件池中的方法执行。  

上图中的action对象中的type是行为标识，后期将所有的行为标识进行宏观管控。

当组件中需要修改状态池中的状态时，在组件中通过store.dispatch ( ) 方法传递一个参数，该参数叫action对象，它其实会被传递给了reducer方法，作为reducer方法的 第二个参数（也就是action）。

后期，除了所有的行为标识会进行宏观管理外，所有的派发的action对象也会进行宏观管理。    以后分模块时，可能会分reducer，每个模块都有自己的reducer和该reducer管控的state。

和vuex相比：

1. vuex已经预先做了很多处理，比如：在vuex中状态一旦改变会自动通知组件重新渲染，不需要像redux一样往事件池中添加更新组件的方法。  
2. 对于mutations中某个状态单独对应着一个方法去修改，而redux是把所有关于状态的更改都放在reducer中（有点乱），只是通过actions中的不同type进行选择走哪个条件分支
3. vuex中通过module就能进行模块化的区分，但在redux中还需要自己去构建



```
store.dispatch({
	type: xxx,
	xxx: xxx  //数据
})
```



index.js中文件内容：

```jsx
import React from 'react '
import ReacDOM  from 'react-dom'
import Vote from './Vote'

import redux,{createStore} from 'redux'

const reducer = function(state={  //这里第一次执行reducer时容器中没有状态，在设置了初始值后，state拿的是初始容器中的状态，即当前模块中的状态信息。（开发时一般在reducer中设置，而不是在createStore中的preloadState中设置，因为这样可以设置每个模块的初始状态）
    supNum:0;
	oppNum:0
    每个模块都可以有自己的reducer，后期通过combineReducer将所有的reducer合并。
},action){      //action 是dispatch派发时传递的行为对象（必然有一个 type 行为标识）
    
    //为了防止现在的操作和之前的state用同一个堆内存，最好把state克隆一份再操作
    state = {...state}  //浅克隆
    state = JSON.parse(JSON.stringify(state))   //深克隆
    let n = action.n || 1
	switch(action.type){
        case 'CHANGE_SUP':
            state.supNum += n
            break
        case 'CHANGE_OPP':
            state.oppNum += n
            break
    }
    return state   //RETURN 的是什么，就将上次状态池中的state完全替换为return的state对象，必须要返回的。
};

//const store = createStore(reducer,{      //其实平时项目中一般不这么写，这么写是给当前容器赋初始状态。   创建容器时不设置统一的状态，而是按模块设置状态（即在reducer的state形参位置赋初始值） 
//	supNum:0;
//	oppNum:0
//})

const store = createStore(reducer)  //初始状态一般写在reducer内

//state：现在store容器中的状态信息
//action：dispatch派发的行为对象，对象中必然有一个行为标识type 



ReacDOM.render(<Vote  store={ store }/>,document.getElementById('root'))
//将store作为外层组件的属性传入，组件内部，组件内可以继续传给要用到store的子组件以标签属性的方式继续往内层传递（以store={ this.props.store} ）

```







```jsx
import React,{ useState, useEffect } from 'react'

function VoteContent(props){
    //let storeState = props.store.getState()
    
    //方式一：这里写为一个对象传给useState，官方并不推荐这么做
    //let [state, setState] = useState({   //这步操作，让store中的状态赋值给该函数组件私有的state上 
    //    ...props.store.getState()
    //})
    
    //方式二：一个个写    //这步操作，让store中的状态赋值给该函数组件私有的state上 
    //let [supNum, setSupNum] = useState(storeState.supNum) 
    //let [oppNum, setOppNum] = useState(storeState.oppNum)
    
    //useEffect(()=>{   //第一次加载完组件后，把组件的重新渲染的方法放到事件池中
    //    props.store.subscribe(()=>{
    //        setSupNum(storeState.supNum)
    //        setOppNum(storeState.oppNum)
    //    })
    //},[])
    
    let store = props.store,
        { supNum, oppNum } =store.getState()
    let [num, changeNum] = useState(()=>0)
    
    useEffect(()=>{   //第一次加载完组件后，把组件的重新渲染的方法放到事件池中
        store.subscribe(()=>{
            changeNum(num+1)
        })
    },[])
    
	return <>
		<p>支持人数：{ supNum }</p>
		<p>反对人数：{ oppNum }</p>
	</>
    
}

function VoteButton(props){

	return <>
		<button onClick={()=>{
            props.store.dispatch({
                type:'CHANGE_SUP',
                N:10
            })
        }}>支持</button>
		<button onClick={()=>{
            props.store.dispatch({
                type:'CHANGE_OPP'
            })
        }}>反对</button>
	</>
}

class Vote extends React.Component{
	 render(){
        let store = this.props.store,
            { supNum,oppNum } = store.getState()   //获取store 上全部的状态数据，也包括该组件要是使用的state数据
	 	return <div>
            <h3>hello react  <span>总人数： {supNum + oppNum}</span></h3>
	 		<VoteContent store={ this.props.store }/>   //再次传给子组件
	 		<VoteButton store={ this.props.store }/>    //再次传给子组件
	 	</div>
	 }
   	 componentDidMount(){   
         //subscribe函数的返回值是一个函数，调用该函数表示将该方法从事件池中移除。
         let unsubscribe = this.props.store.subscribe(()=>{ //向事件池中追加该组件重新渲染的方法
             this.forceUpdate()   //函数式组件中没有组件实例，所以也没有forceUpdate方法
         })
     }
}

export default Vote
```

vuex与redux的比较：

1. vuex中将很事都帮助开发者提前解决了，比如：当组件中用到全局状态state中的数据时，数据发生变化，vuex中可以自动触发组件重新渲染；而redux中则需要开发者手动向事件池中添加触发组件渲染的方法
2. 在vuex中想改某一个具体的状态，单独写一个方法就行了，而redux中则把所有修改state的处理全部写在reducer中通过判断action.type来确定修改什么state，看上去有些乱
3. 在做模块化区分时，vuex中通过module属性做了很好的区分，而redux中则需要自行构建





扩展：深浅拷贝

```
function deepCopy( obj ){
	if(typeof obj !== 'object' || typeof ==='null'){
		return obj
	}	
	let tempObj
	(obj instancef Array) ? tempObj =[] : tempObj={}
	for(let key in obj){
		tempObj[key] =  deepCopy(obj[key])
	}
}
```

总结：

createStore(reducer, preloadedState):创建一个容器，容器中有两部分——状态池和事件池，当状态池中的状态改变，通知事件池中的方法自上向下依次执行组件渲染。

创建store时指定一个reducer，reducer是更改状态池中状态的唯一途径，怎么修改都写在reducer中。

在组将中想要修改某个store中的某个state时，可以通过store.dispatch()派发一个行为，告诉reducer并传给reducer一个action，reducer内部通过action上的type，修改不同的state。reducer函数返回的是什么最后全局的store上的store就是什么。

在组件中通过getState()拿到状态池中的状态进行绑定渲染。 当状态池中的状态改变，通知事件池中的方法自上向下依次执行组件渲染。一般我们将状态成功绑定到相应组件上后，当状态池中状态改变后，应该让当前组件重新渲染，因为只有重新渲染才能拿到store中最新的状态信息。所以我们一般在组件中用store.subscribe( )把触发组件重新渲染的方法（方法有多种）添加到store的事件池中。 



```jsx
import React,{ useState, useEffect } from 'react'

function VoteContent(props){
    //在VoteContent中仅仅只写这几步代码也能实现组件的重新渲染，因为它的父组件vote被重新渲染，父组件重新渲染连带子组件一并重新渲染
    let store = props.store,
        { supNum, oppNum } =store.getState()
	return <>
		<p>支持人数：{ supNum }</p>
		<p>反对人数：{ oppNum }</p>
	</>
}

function VoteButton(props){

	return <>
		<button onClick={()=>{
            props.store.dispatch({
                type:'CHANGE_SUP',
                N:10
            })
        }}>支持</button>
		<button onClick={()=>{
            props.store.dispatch({
                type:'CHANGE_OPP'
            })
        }}>反对</button>
	</>
}

class Vote extends React.Component{
	 render(){
        let store = this.props.store,
            { supNum,oppNum } = store.getState()   //获取stoore 上该组件要是使用的state
	 	return <div>
            <h3>hello react  <span>总人数： {supNum + oppNum}</span></h3>
	 		<VoteContent store={ this.props.store }/>   //再次传给子组件
	 		<VoteButton store={ this.props.store }/>    //再次传给子组件
	 	</div>
	 }
   	 componentDidMount(){   
         //subscribe函数的返回值是一个函数，调用该函数表示将给方法从事件池中移除。
         let unsubscribe = this.props.store.subscribe(()=>{ //向事件池中追加该组件重新渲染的方法
             this.forceUpdate()
         })
     }
}

export default Vote
```



和vote组件平级的其他组件（函数式组件）：

```jsx
import React,{ useState, useEffect } from 'react'

export default function Other(props){
	let store = props.store
	let [state,setState] = useState(()=>{
		return {
			...store.getState()
		}
	})
	
	useEffect(()=>{
    	store.subscribe(()=>{
    		//通过修改当前函数组件被useState方法绑定state属性，触发组件的重新渲染
            setState({
                ...store.getState()
            })
        })
	},[])
	
	
		return <div>
			<p>{ supNum }====={ oppNum }</p>
		</div>
}
```

和vote组件平级的其他组件（类组件）：

```jsx
import React,{ useState, useEffect } from 'react'

export default class Other extends React.Component{
	constructor(props){
		super(props)
		this.state = {   //这步相当于给类组件设置自己私有的state状态值，只不过它的值来自全局store.getState
			...props.store.getState()
		}
	}
	componentDidMount(){
        this.props.store.subscribe(()=>{
            this.setState({
                ...this.props.store.getState()
            })
        })
    }
	render(){
		<div>
			<p>{ supNum }====={ oppNum }</p>
		</div>
	}
}
```



### 第二十二节——redux在真实项目中的使用

真实项目中的redux应用：真实项目中有许多模块。

真实项目中的目录结构：

- src：存放项目源码

  - api： 统一做后端接口管理

  - assets:存放静态资源

  - components：存公共组件

  - pages：路由匹配页面

  - routes：路由

  - store：存公共状态管理

    - reducer目录

      - index.js:  把每个模块的reducer进行合并

        ```js
        import { combineReducers }  from 'redux'
        import voteReducer from './voteReducer'
        import personReducer from './personReducer'
        
        export default combineReducers({  //通过combineReducers会按照模块名把每个模块的状态单独管理到对应模块名下，以后获取模块中的state时要用store.getState().vote.supNum。
        	vote:voteReducer,    这个对象的属性名就被用于模块分组
        	personal: personReducer
        })
        ```

        

      - voteReducer.js :vote组件的reducer

        ```js
        //每个reducer都管理自己单独的状态
        import * as TYPES from '../action-types'
        const initialState = {
           supNum:5,
           oppNum:1
        }
        export default function voteReducer(state=initialState，action){
            state = JSON.parse(JSON.Stringify(state))
            //根据对应的行为标识走不同逻辑
            switch(action.type){
                case TYPES.VOTE_CHANGE_SUONUM:
                	state.supNum++
                	break
                case TYPES.VOTE_CHANGE_OPPNUM:
                	state.oppNum++
                	break
            }
            return state
        }
        ```

      - personReducer.js ：个人中心模块的reducer

        ```js
        //每个reducer都管理自己单独的状态
        import * as TYPES from '../action-types'
        const initialState = {
           supNum:5,
           info:{}
        }
        export default function personReducer(state=initialState，action){
            state = JSON.parse(JSON.Stringify(state))
            //根据对应的行为标识走不同逻辑
            
            return state
        }
        ```

      - 其他组件的reducer

        

      

    - actions：把dispatch派发的对象集中管理
  
      - voteAction.js:vote板块的action对象管理
  
        ```js
        import * as TYPES from '../action-types'
        
        
        //这么写看似麻烦，实则还可以在每个函数中做一些列的其他操作后再返回。
        export default {
        	changeSupNum(){
        		return {
        			type: TYPES.VOTE_CHANGE_SUONUM
        		}
        	},
        	changeOppNum(){
        		return {
        			type: TYPES.VOTE_CHANGE_OPPNUM
        		}
        	}
        }
        ```

      - personAction.js:person板块的action对象管理
  
        ```js
        import * as TYPES from '../action-types'
        
        export default {
        	....
        }
        ```
  
      - index.js：合并后的action
  
        ```js
        import voteAction from './voteAction'
        import personAction from './personAction'
        
        export default {
        	vote: voteAction,
        	person: personAction
        }
        ```
  
        
  
    - index.js:创建store
  
      ```js
      import { createStore } from 'redux'
      import reducer from './reducer/index'
      
      const store = createStore(reducer)
      export default store
      ```
  
    - store-types.js(action-types.js):派发行为类型的宏观管理行为标识
  
      ```js
      //统一存放各个行为标识，避免书写错误
      export const VOTE_CHANGE_SUONUM = 'VOTE_CHANGE_SUONUM'
      export const VOTE_CHANGE_OPPNUM = 'VOTE_CHANGE_OPPNUM'
      ```
  
      
  
  - index.js：项目入口
  
  - ...

![image-20210501225930956](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210501225930956.png)

获取store中的状态，并且让组件在store中的状态改变后能重新渲染。可以将store中的状态获取并赋值给组件私有的状态，在组件第一次渲染完成后，往store的事件池中添加能使得组件重新渲染的方法。 因为在组件中修改私有的属性会触发组件重新渲染。

```jsx
import React from 'react'
import actions from './store/actions/index'

function VoteContent(props){
    let store = props.store,
        { supNum, oppNum } =store.getState().vote     +++++++
	return <>
		<p>支持人数：{ supNum }</p>
		<p>反对人数：{ oppNum }</p>
	</>
}

function VoteButton(props){

	return <>
		<button onClick={()=>{
            props.store.dispatch(
                actions.vote.changeSupNum()     ++++++++++
            )
        }}>支持</button>
		<button onClick={()=>{
            props.store.dispatch(
            	actions.vote.changeOppNum()     ++++++++++
            )
        }}>反对</button>
	</>
}


class Vote extends React.Component{
	constructor(props){   //获取全局store中的state并赋值给组件私有的state
		super(props)
		let { vote:{supNum, oppNum} } = props.store.getState()    +++++++
		this.state = {
			supNum,
			oppNum
		}
	}
	render(){
		let { supNum, oppNum } =this.state,
			store = this.props.store
		return <div>
			<h3>xxxxxxxxxx   <span>{ supNum + oppNum }</span></h3>
			<VoteContent store={ store }/>
			<VoteButton store={ store }/>
		</div>
	}
	
	componentDidmount(){
		this.props.store.subscribe(()=>{
			this.setState({
				...this.props.store.getState().vote      ++++++++
			})
		})
	}
}
export default Vote
```

使用redux时存在的不方便点：

1. 从整个项目的入口文件导入store实例，需要在各个组件中使用store时，必须通过组件标签的属性一层层传递,当然可以通过上下文实现进行改良
2. 必须考虑组件获取store中的数据后还能在store中状态改变后进行组件刷新（前面是通过将store中的状态赋值给组件私有状态上并通过组件的setState方法修改组件私有状态以触发组件重新渲染的）



redux和vuex的比较：

![image-20210626094428577](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210626094428577.png)





### 第二十三节——react-redux（p32）

在react中为了解决上述问题，基于redux二次封装了一个和vue中vuex类似的插件——react-redux。

react-redux做的事：

1. 把store实例放在祖先的上下文中
2. 在需要使用状态的组件直接获取状态就行，之后组件更新的事就交给react-redux来做

安装：`npm install react-redux  redux`

react-redux 是依赖于 redux的。

react-redux的包中,导出的内容:

![image-20210626142022113](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210626142022113.png)

react-redux中提供了一些关于hooks模式下单独处理的方法。

上图中的组件中：

`<Provider>`：称为祖先组件

`<connect>`：称为高阶组件



1. 注册：用Provider组件 并提供一个store标签属性，并包裹根组件

```jsx
import React from 'react '
import ReacDOM  from 'react-dom'
import Vote from './Vote'
import { Provider } from 'react-redux'
import store from './store/index' 

//Provider: react-redux提供的祖先组件，目的是把redux中的store放置到上下文中，供后代组件直接调取使用
//ReactDOM.render(<Vote store={ store }>,document.getElementById('root')) 不再使用 store={ store }

ReactDOM.render(
    <Provider store={store}>    //用Provider组件将祖先元素包裹
        <Vote/>
    </Provider>
    ,document.getElementById('root'))
```



2. 使用：

   在需要使用状态的组件中，引入connect 这个高阶组件，用connect 这个高阶方法，将redux容器中的state和dispatch都当作属性传给需要使用状态的组件，并**返回一个代理的组件**。 

   经过connect函数包装过的组件，会自动给redux容器的事件池中添加一个 "公共状态改变能重新触发组件重新渲染的事件方法"。 在redux中是自己写的。 

   **页面中最后使用的组件就是该函数代理后的组件。**


   connect 函数接受两个函数作为参数。connect函数内部会执行这两个函数并将 公共状态和行为对象作为 需要使用的组件的属性。

```jsx
import React from 'react'
import { connect } from 'react-redux'    //connect是一个高阶组件
import actions from './store/actions/index'

const VoteContent = connect(()=>{...state.vote},null)(function(props){
    let { supNum, oppNum} = this.props
	return <>
		<p>支持人数：{ supNum }</p>
		<p>反对人数：{ oppNum }</p>
	</>
})



class Vote extends React.Component{
	render(){
		return <div>
			<h3>xxxxxxxxxx   <span>{this.props.supNum + this.props.oppNum}</span></h3>
			<VoteContent />
			<button onClick={()=>{
            	this.props.changeSupNum()
            }}>支持</button>
            <button onClick={ this.props.changeSupNum }}>反对</button>
		</div>
	}
}

 
//function mapStateToProps(state){ //state就是redux中的状态  ，在connect内部会将redux中的state传给该方法 
//    return {    //返回的对象就是被当作属性挂在到组将上，下面是将vote模块的state挂载到Vote组将上
//        ...state.vote
//    }
//}
//function mapDispatchToProps(dispatch){
//    return {
//        changeSupNum(){
//            dispatch(actions.vote.changeSupNum())   //actions.vote.changeSupNum() 是事先在redux的action模块中定义好的方法，它返回一个行为对象（{type:xxxx,xxxx:xxxx}）。
//        },
//        changeOppNum(){
//            dispatch(actions.vote.changeOppNum())
//        }
//    }
//}
//export default connect(mapStateToProps,mapDispatchToProps)(Vote)



export default connect(state=>({...state.vote}),actions.vote)(Vote)  //导出代理后的组件

```

connect：也会将公共状态改变时重新渲染组件的事件方法添加到redux容器中。它返回的结果是一个**代理组件**，并且页面中渲染的是这个代理组件。



 

![image-20210502190319748](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210502190319748.png)

上图中的mapStateToProps的作用：将redux容器中的状态通过迭代的方式赋值给当前组件的属性。

上图中的mapDispatchToProps的作用：将redux容器中合并后的actions中要派发的行为对象也当作属性赋值给当前组件



### 补充Redux-saga

如果按照原始的redux工作流程，当在组件中产生一个action后会直接触发reducer修改state，而reducer又是一个纯函数，也就是不能在reducer中进行异步操作。

在实际开发中，组件中发出action后，在进入reducer之前需要完成一个异步任务，比如发送ajax请求拿到数据后,在进入reducer中根据请求的数据改变状态。而redux-saga就是为解决这个问题。



在redux-saga中提供了一些辅助函数，可以实现在一些特定的action被发起到reducer前时派生其他任务逻辑。

辅助函数：

- takeEvery

  

  

  

  

  

- takeLatest







### 第二十四节——同步与异步（p34）

Promise,  async/await, generator/yeild/next

### 第二十五节——redux与react-redux源码

react-redux：

```jsx
import React from 'react'
import PropTypes from 'prop-types'

//Provider是一个组件，它可以接受传递的标签属性store（redux创建的那个容器），并把store注册到上下文中，把Provider包裹的子组件进行渲染。
//祖先元素将数据注册到上下文中有两种方式：

const ThemeContext = React.createContext()

class Provider extends React.Component{
    //设置必须传递store属性
    static propTypes = {
        store: PropTypes.object.isRequired
    }
    render(){
        //渲染传递进来的子组件
        return <ThemeContext.Provider value={
               { store:this.props.store } 
            }>
         	{ this.props.children }   
        </ThemeContext.Provider>
    }
}

//connect是一个高阶组件,将mapStateToProps,rmapDispatchToProps方法执行的返回值挂在到component组件的属性上 ；向redux容器的事件池中增加一个方法，当公共状态改变，通知方法执行并重新渲染组件。
function connect(mapStateToProps,mapDispatchToProps){
    
    return function connectHOC(component){
        
        //返回一个代理组件
        return class Proxy extends React.Component{
            render(){
                return <ThemeContext.Consumer>
                    <component />
                 </ThemeContext.Consumer>
            }
        }
    }
}



export {
	Provider,
    connect
} 
```







redux源码：

redux中提供的方法等：

- combineReducers():合并多个reducer函数

- createStore()

  createStore()

  createStore()方法返回的实例store对象上有的方法：

  - getState()

  - subscribe()

  - dispatch()





### 第四十四节——react-router-dom

react中的路由管理使用的插件是react-router-dom（从第四代开始），在第三代及其以前叫react-router。为什么会有名字上的区别，因为react有两套生态，一套开发web应用，一套开发原生app。react为了让生态区分更加明显，刚开始只需要引入react一个包就可以。        后来区分了h5应用 和 app应用  ，将渲染dom那部分分为了 ReactDom  和 ReactNative   外加一个共用的核心模块 react。      后来又分出了针对web应用的路由管理模块，取名叫react-router-dom 。

在react中的路由有：

- hash路由

  http://www.xxxx.com/#/login

  http://www.xxxx.com/#/user

  http://www.xxxx.com/#/user/login

- history（browser）路由（需要服务器对404页面处理，如果请求的页面不存在，让其渲染首页内容。）

  http://www.xxx x.com/login

  http://www.xxxx.com/user

  http://www.xxxx.com/user/login

  

  

如果项目是单纯的静态页面展示（数据绑定是由客户端完成的），一般推荐使用hash路由；如果项目有些内容需要后台完成，推荐使用history路由，因为hash值不太容易和服务器端产生关联。



安装：yarn add react-router-dom

在react-router-dom想要使用hash-router需要在项目中导入hash-router组件

```
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'
//HashRouter相当于路由容器或者出口 router-view
//Route 路由规则表

```

![image-20210622090150961](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210622090150961.png)



路由匹配特点：

1. react中的路由匹配规则：不管之前的路由规则是否匹配到某个组件，依然会尝试继续匹配之后的路由规则；期望的是某条规则匹配后就不再继续往后匹配（在vue中已经做了这方面的处理，而期望的是像vue一样，匹配到某条规则后就不再继续在同一级中向下匹配。），为了在react中实现这种能力，可以将所有的路由规则用Switch组件包裹。
2. 默认路由的匹配规则是不严格匹配，可以给规则上设置exact（精准匹配）或者strict（严格匹配，不怎么使用）。react路由的默认匹配规则是只要当前路由地址中的某部分(两个 / 之间的部分)包含完整的某个路由规则就行。

> 例子：
>
> url： http://localhost:3000/#/system
>
> 它能匹配到的路由规则有：
>
> - /
> - /system
>
> 它不能匹配到的路由规则有：
>
> - /sys
> - /sysytem1
>
> url： http://localhost:3000/#/system/list
>
> 它能匹配到的路由规则有：
>
> - /
> - /system
> - /system/list
>
> 它不能匹配到的路由规则有：
>
> - /sys
> - /sysytem1
> - /system/list23





- 能搭建基本的路由规则
- 理解并能使用多级路由
- 路由传参
- 动态路由
- 路径参数
- 路由导航守卫
- 权限校验



安装：npm install  react-router-dom

```jsx
import React from 'react'
import ReactDom from 'react-dom'
import { HashRouter,Route } from 'react-router-dom'  //导入HashRouter表示使用hash路由并充当路由出口，导入BrowserRouter表示使用browser路由并充当路由出口，导入的Route用于设置路由规则。

```



```jsx
//入口模块index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';

ReactDOM.render(<App/>,
  document.getElementById('root')
);
```

```jsx
//根组件
import React, { Component } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Customer from './Customer'
import Error from './Error'
import System from './System'


class App extends Component {
  render() {
    return <>
      <header>
        <a href="#/customer">客户管理</a>
        <a href="#/system">系统管理</a>
      </header>
      <main> 
        //相当于vue中router-view
        <HashRouter>
          //开启路由规则只匹配一项即可
          <Switch> 
            // exact 实现精准匹配
            {/* <Route path='/' exact component={Customer}></Route> */}  
              
            //重定向
            <Redirect from='/' exact to='/customer'></Redirect>
            <Route path='/customer' component={Customer}></Route>
            <Route path='/system' component={System}></Route>
            <Route path='/server' render={()=>{
                      //一般可以做权限校验
                      let loginInfo = localStorage.getItem('login-info')
                      if(!loginInfo){
                          return <div>您为登录，暂无权限访问该页面</div>
                      }
                      return <Server/>
                  }}></Route>
            //仿写一个404页面
            {/* <Redirect to='/customer'></Redirect> */}
            <Route path='*' component={Error}></Route>
          </Switch>
        </HashRouter>
      </main>
    </>
  }
}

export default App

```

```jsx
//Customer.jsx
import React, { Component } from 'react'
class Customer extends Component{
  render(){
    return <div>
      客户管理界面
    </div>
  }
}
export default Customer

//System.jsx
import React, { Component } from 'react'
class System extends Component{
  render(){
    return <div>
      系统管理界面
    </div>
  }
}
export default System

//Error.jsx
import React, { Component } from 'react'
class Error extends Component{
    state = {
        second:5
    }
  render(){
    return <div>
        <p>您访问的页面不存在</p>
        <p>您将在{this.state.second}秒后跳转至首页</p>
    </div>
  }
  componentDidMount(){
      let timer = setInterval(()=>{
      	let second = this.state.second
        second--
        if(second === 0){
            //方式一：跳转
            this.props.history.push('/customer')
            
            //方式二：跳转并传参
            this.props.history.push({
                pathname: '/customer',
                search: '?lx=10',
                state: {  //隐性传参，跳转到对应页面后，再次刷新页面则state中的数据将不再存在
                	n:100
            	}
            })
            
            clearInterval(timer)
            return
        }
        this.setState({ time })
      },1000)
  }
}
export default Error

```

​		和vue不一样的是，react中所有的路由，路由规则等都是基于react-router-dom中提供的不同组件来完成。HashRouter，BrowserRouter，Switch，Redirect，Route。

​		**受路由管控组件**：通过路由规则匹配后渲染的组件。受路由管控的组件实例上的props属性上有额外的几个自动添加的属性。

​		hash路由内模拟了一套history api 的历史记录机制，每次跳转都会向记录池中推入一条记录。

![image-20210504142935559](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210504142935559.png)

history对象中的几个属性与方法：

- length：历史记录池中的数量
- go(n) :跳转特定步长的记录
- goBack()：后退
- goForward()：前进
- push()：跳转到指定的路由地址，并向记录池中追加一条记录
- replace()：替换

受路由管控组件中实现编程式路由导航：this.props.history.push('hash地址')  ，通过以上方法实现编程式导航。

![image-20210504143448730](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210504143448730.png)



loaction对象：

- search：?号传参信息
- pathname：匹配到当前组件的路由
- hash：hash值
- state：隐性传参（与vue中的隐性传参一样），页面一旦刷新，则不再保存数据

![image-20210504144127227](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210504144127227.png)



match对象：存储匹配路由规则后解析的一些数据，每次路由变化后，重新走一遍路由规则，在路由规则中每次匹配解析的结果，（当前地址和路由规则进行一层层自上而下的查找最终匹配的结果。）

![image-20210504144424149](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210504144424149.png)



404页面的跳转逻辑：

![image-20210622092934115](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210622092934115.png)

404页面的跳转逻辑的另一种方式：

![image-20210622093311249](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210622093311249.png)







**非受路由管控组件**是没有这些对象的，所以无法使用这些对象上提供的属性或者方法，也就不能实现编程式导航了。但是如果想要这些对象方法或属性，需要将非受路由管控组件用withRouter代理。

用withRouter代理的组件必须作为HashRouter或者BrowserRouter组件的子组件才能生效。

React路由和Vue路由不太一样，vue中是引入vue-router，通过创建路由实例并给路由实例传递路由规则对象，以实现路由，路由规则和路由容器（出口）是分开的。react中是通过导入react-router-dom提供一些列组件来实现。 



#### 二级路由

在需要用二级路由的组件，注意该组件必须是`<HashRouter></HashRouter>`或者`<Browser><Browser>`内部的后代组件才可以。通过一些列除了`<HashRouter></HashRouter>`或者`<Browser><Browser>`组件以外的其他路由组件所组成。一般二级及以后的路由都只需要用`<Switch>`组件包裹就可以。



`<Link>与<NavLink>`等价于vue中的``<router-link></router-link>`,也会被默认渲染为 a标签 ,具体用法如下：

```
<Link to="/"></Link>
<Link to={{
	pathname:'/',
	search:'?xxx=xxx',
	hash:'#xxx'
	但是无法使用state隐性传参，如果想用state则需要通过dom元素的点击事件，通过编程式导航进行跳转。
}}></Link>
```

![image-20210623090840078](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210623090840078.png)

和vue中一样，每次路由切换，如果渲染的是不同组件，上一个组件销毁后，下一个组件重新创建（组件的创建阶段的生命周期函数会从头开始执行一边）。如果渲染的是相同组件，组件不会销毁，只是触发组件的更新渲染。



#### 动态路由

`<Route path='/xxx/xxx/:id' component={ Xxxxx }></Route>` 

在动态路由匹配成功渲染的组件中，要获取动态传参（也就是上面的 id ），在渲染的组件中，参数存放在this.props.match.id 中存放着动态路由传参的数据。



`<NavLink>`的用法和`<link>`一样，区别在于navlink会在渲染的a标签上添加两个标签属性：aria-cuurent 和class ='active' 属性。



### 权限校验

在vue中有导航守卫，所以可以在不同的导航守卫中做权限校验。一般权限信息存放在公共状态管理中，也可以存在本地。

方式一：刚开始都显示导航部分，当点击导航时，根据有无权限，确定是否跳转和渲染。这是在路由跳转中进行判断的。 写法是在`<Route>`标签中：

```jsx
<Route path='/' component={ ()=>{
	let power = localStorage.getItem('power')
	if(power){
		return <System />
	}
	return null
}}>
```

方式二： 直接控制组件是否配渲染出来。

![image-20210623093851036](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210623093851036.png)







### 有品项目

准备工作：

1. 基于create-react-app搭建项目基本代码，删除不必要的代码和文件，简化项目结构。

2. 执行npm run eject   暴露出webpack配置文件，然后修改webpack配置文件，配置上less 

   ```
   npm install less less-loader -D
   ```

   ![image-20210624091211029](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210624091211029.png)

![image-20210624091230520](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210624091230520.png)

3. 对于不支持ES6模块化规范的js模块需要在项目的public 目录下，通过script标签加上路径变量的方式引入。这样在用webpack打包之后该文件也会被打包，但是不会合并到编译打包后的一个js文件中，而是单独分开处理，会多一次请求。

![image-20210624091633835](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210624091633835.png)

注意点：

在html页面中常常引入的资源有：

1. 一些静态资源，比如favicon.ico图标等

2. 不支持js模块的js文件

3. 要优先加载处理的的文件资源，比如loading图

4. 处理移动端响应式的基本代码，如flexible.js

   ![image-20210624092616504](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210624092616504.png)











## 面试题



### React中的key的作用和使用

### refs及其使用

### 生命周期函数

### 事件系统

### setState

### 组件间通信

### 函数组件和类组件的使用选择

### React中的性能优化

### Redux是如何将State注入到React组件上的

### Redux在实际项目中的使用及其问题

### React中的Hooks









## 项目

1. react组件
   - 函数式组件
   - 类组件
   - react hooks 组件
2. react hooks
   - useState
   - useEffect
   - useRef
   - useReducer
3. react router
   - `<HashRouter>`
   - `<BrowserRouter>`
   - `<Route>`
   - `<Redirect>`
   - `<Swith>`
   - `<withRouter>`
4. react redux
   - createStore()
   - reducer()
   - actions
   - getState()
   - subscribe()
   - dispatch()
5. antd组件库



### 项目模块

- 登录模块
  ![image-20210724092718484](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724092718484.png)

- 数据分析模块
  - 柱状图
  - 饼状图
  
  ![image-20210724092734767](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724092734767.png)
  
- 权限管理和角色管理
  - 直接给某个用户去分配权限，因为权限比较多，所以每次新建用户并分配权限比较繁琐，所以会把一些列权限作为一个集合，某一组集合代表一种角色 
  
  - 在创建好角色之后，可以针对该角色去添加或者移除某些单个权限
  
  - 所有权限的管理页面
  
    
  
  ![image-20210724092800715](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724092800715.png)
  
  ![image-20210724092829510](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724092829510.png)
  
- 用户管理
  - 用户的增删改查，权限管理，因为用户的角色不同，看到的侧边导航栏也不同

    ![image-20210724092936642](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724092936642.png)

- 新闻管理
  - 主要业务模块，写新闻，
  - 新闻分类
  - 草稿箱

- 审核模块

- 发布管理模块
  - 待发布
  - 已发布
  - 已下线





对于侧边的路由导航链接，后台提供了一个人接口，能将整个管理系统项目的所有路由接口都返回给前端。如果要管理权限的话，整个后台系统中，有一个页面——权限列表页面，是超级管理员用来控制整个系统的所有路由权限的。

![image-20210724093955865](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724093955865.png)



![image-20210724094128146](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724094128146.png)



![image-20210724094252131](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724094252131.png)



删除或者修改权限列表中的内容时，是对整个系统中的所有人员都起作用的。而针对某个角色的话，只是该角色受到影响。

角色列表中是对权限的集合划分。

![image-20210724094600037](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724094600037.png)



对于区域管理员，它能看到用户管理，但是他能创建的人员只是特定区域下的区域编辑。



这是超级管理员角色的权限分布：

![image-20210724094359829](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724094359829.png)



这是区域编辑的权限分布：

![image-20210724094507567](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724094507567.png)





### 项目创建与配置

脚手架搭建系统,使用npx：

`npx create-react-app  projectName`

准备工作：

- 项目中写的css文件的作用范围：
  在react中，不管在哪个模块下引入的css样式默认都是全局生效的，所以可能存在样式冲突的可能。在react的项目中这种引入css，在生成的项目中是通过style标签以内联式的方式放在head标签中的。
  
  - 作用在当前的组件模块
  
    - 如果希望实现只作用于当前模块，可以使用react提供css的模块写法
      具体如下：
      将项目中的css文件以xxx.module.css的形式进行命名，在需要时用该css样式文件的模块或者组件中用es6的模块化语法引入该css文件并赋值给一个变量，之后在组件的jsx语法中哪个dom元素想要使用，可以通过 className={变量名.css文件中的类名}进行使用。
      注意：react的css模块化语法对于css中的标签选择器是无效的，必须是类或者id选择器等。
  
      ![image-20210702223639050](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210702223639050.png)
  
      ![image-20210702223655622](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210702223655622.png)
  
    - 作用为全局的css样式
  
- sass开发配置：
  在create-react-app 脚手架生成的项目中，已经完成了对sass文件格式的打包配置项（less没有，需要自己配置），但是并没有安装相应的解析包。
  `npm install sass -D`

- 项目的开发环境的反向代理配置:
  [create-react-app官网](https://create-react-app.dev/docs/proxying-api-requests-in-development)

  ```
  yarn add http-proxy-middleware
  
  在项目的src目录下创建一个setupProxy.js文件并写入如下类似的内容：
  
  const { createProxyMiddleware } = require('http-proxy-middleware');
  
  module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
      })
    );
  };
  ```



项目实验测试react模块化css时出现的问题：

- react中组件的名字要是大写字母开头

  ![image-20210620222617175](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210620222617175.png)

  浏览器报错内容：

  ```
  Warning: The tag <child> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
      at child
      at div
      at App
  ```

- 在react项目中，在各个组件中单独引入的css样式并不像在vue中的style标签中写入标签属性scoped就能直接将标签内的css规则设置为该组件独有的，而是经过webpack打包后，直接放在了全局，所以很可能造成样式冲突。


  解决办法有：

  1. react中css的模块化————给css文件进行 xxx.module.css  命名，同时注意，这种命名格式的css文件中，**如果选择器是标签选择器的话，那么是不会起到限定作用的，为了只在对应组件中起作用的，而应该使用类选择或者id选择器。** 

     注意点：

     在进行了模块化命名css文件后，在引入并使用该css文件中的css样式时，则不能直接通过类名使用了，引入的样式文件会默认导出一个对象，具体的类是作为该对象的属性名的。

     ![image-20210620230017359](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210620230017359.png)

     正确的使用方式如下：

     ```jsx
     import childstyle from './child.module.css'
     function child (){
       return <div>
         child
         <p className={ childstyle.childp }>hello child</p>
       </div>
     }
     
     export default child
     ```

     

     

  2. 在项目开发过程中借助css预编译语言时就注意css的命名规则，进行按模块的细分好



- scss的引入使用

  基于脚手架生成的项目已经在webpack的配置文件中配置好相关的scss loader ，但是它并没有自动下载好处理scss的相关包，所以需要手动安装包后再使用即可。

  `npm install sass -D`

  scss可以和react中的css模块化进行配合使用

  

- 反向代理

  使用node.js中的中间件——http-proxy-middleware

  1. 使用 npm 或 Yarn 安装 `http-proxy-middleware` 

     ```
     npm install http-proxy-middleware --save-dev
     ```

  2. 在项目的src目录下创建setupProxy.js文件 ，文件中编写一下内容：

     ```
     const proxy = require('http-proxy-middleware');
      
     module.exports = function(app) {
       app.use(proxy('/api', { target: 'http://localhost:5000/' }));
     };
     
     
     或者：
     
     const { createProxyMiddleware } =require('http-proxy-middleware')
     
     module.exports = function(app){
     	app.use(
     		'/api',
     		createProxyMiddleware({
     			target:'http://localhost:5000',
     			changeOrigin:true,
     		})
     	)， 
     	app.use(
     		'/api2',
     		createProxyMiddleware({
     			target:'http://localhost:5001',
     			changeOrigin:true,
     		})
     	)
     }
     ```






注意点：

在create-react-app脚手架创建的项目中，入口文件代码如下：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// React.StrictMode 表示的是开启项目代码的严格模式，但可能导致组件生命周期函数的重复执行。
```

在React17之后， `import React from 'react'`语句在react项目中不引入也不会报错。

###  项目路由架构

控制路由细粒度，没有授权的页面无法进入。

![image-20210620232710058](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210620232710058.png)

在该项目中授权的token是放在localstorage中的。用来验证用户是否登录，没有登录则直接跳转到登录页面。

在react中，一切都是组件，路由模块也可以被看作是一个路由组件。

在react中的路由拦截思想其实就是在路由规则匹配后，在渲染组件之前进行判断，条件不同返回不同组件。在路由规则中将渲染组件写为render函数形式的话，每次路由匹配到之后，都会执行render函数以确定返回的组件情况。



安装：npm install -save react-router-dom

在src目录下新建router目录，目录下新建文件(一级路由配置文件)：

- indexRouter.js（用hooks的写法，路由文件）

  ```jsx
  import React from 'react'
  import { HashRouter, Route, Switch, BrowserRouter } from 'react-router-dom'   //引入路由包
  //HashRouter:导入它表示使用hash router
  //BrowserRouter:导入它表示使用history router
  
  //引入路由需要需要渲染的组件
  import Login from '../views/login/Login.js'   
  import NewsSandBox from '../views/sandbox/NewsSandBox.js'
  
  
  export default function IndexRouter(){
  	<HashRouter>
  	
  		写法一：
  		<Route path="/login" component={ Login }>  //表示路径是login是就加载Login组件
  		<Route path="/" component={ NewsSandBox }>  //同理  
  		{/*react中路由的匹配属于模糊匹配,当路由是login时，即会匹配到Login组件，又会匹配到NewsSandBox组件 */} 
  		
  		
  		写法二：
  		<Switch>   //启动只匹配一个，一级路由
  			<Route path="/login" component={ Login }>  //表示路径是login是就加载Login组件
              {/*<Route path="/" component={ NewsSandBox }> */} 
              {/*<Route path="/" render={ ()=> <NewsSandBox></NewsSandBox>}> */}
  			<Route path="/" render={ ()=> 
  			//判断本地是否有token存在，有则表示登录了，没有则表示没有登录，需要重定向到登录页面。记得其实是有return语句的
  				return localStorage.getItem("token")?
  				<NewsSandBox></NewsSandBox> :
  				<Redirect to="/login" />
  			}> 
              //权限校验还可以写为这种格式：<Route path="/" component={()=>{
            return localStorage.getItem('token')?<NewsSandBox></NewsSandBox>:<Redirect 			to='/login'/> }}>
              </Route>
                  
                  
              <Route path="/" exact component={ Login } />  //精确匹配
  			//路由重定向，引入路由拦截。 
  		</Switch>
  	</HashRouter>
  } 
  ```
  
  

在src目录下新建views目录，存放和路由相关的各个页面组件（一级路由组件  ）

- login目录

  - Login.js
  - Login.scss

- sandbox目录
  在NewsSandBox中，页面的侧边导航栏和顶部用户信息栏是固定的，只是不同侧边栏渲染在右侧下方的区域而已
  
  - NewsSandBox.js
  
    ```jsx
    import SiderNav from '../../components/sandbox/sider-nav/sider-nav'
    import TopHeader from '../../components/sandbox/top-header/top-header'
    import {Switch,Route,Redirect} from 'react-router-dom'
    import Home from './home/home'
    import NotFound from './notfound/not-found'
    import RightList from './right-manage/rightlist/rightlist'
    import RoleList from './right-manage/rolelist/rolelist'
    import userList from './userlist/userlist'
    
    export default function Login(){
      return <div>
            <SiderNav></SiderNav>
            <TopHeader></TopHeader>
            <Switch>  //二级路由
              <Route path='/home' component={Home}></Route>
              <Route path='/user-manage/list' component={userList}></Route>
              <Route path='/right-manage/role/list' component={RoleList}></Route>
              <Route path='/right-manage/right/list' component={RightList}>				  </Route>
              <Redirect path='/' to='/home' exact></Redirect>
              <Route path='*' component={NotFound}></Route>
            </Switch>
        </div>
    }
    ```
  
    
  
  - NewsSandBox.scss

在定义好路由组件后，在根组件实例下引入indexRouter.js文件,

```jsx
import IndexRouter from './router/IndexRouter'

function App(){
 return <div>
 			<IndexRouter></IndexRouter>
 		</div>
}
export default App
```

对于二级路由，该项目选择将它分散在组件内部。

在src目录下新建components目录，存放各个页面组件中被共享的组件





### antd-ui组件库引入

下载：`yarn add antd`

使用方式：

1. 按需引入，在需要使用某组件的模块中引入

```jsx
import React from 'react'
import {Button} from 'antd'
import './App.css'   //在App.css中引入antd样式文件  @import ’~antd/dist/antd.css‘

const App =()=>{
 return (
 	<div>
 		<Button type="primary">button</Button>
 	</div>
 )
}
```

###  使用ant design中的layout布局

侧边栏导航路由通过请求的后台数据进行动态循环渲染的。





注意点：

要实现编程式导航，那么需要用到组件的props上的history对象上提供的一些列方法，比如：push，go，forward等。但是并不是所有组件的props对象上都有history等对象的。首先 ，必须要是受路由管控组件，其次，还要注意如果想在不是受路由管控组件中使用路由对象，那么需要用高阶函数withRouter将某个组件进行封装，封装后的组将内部就能访问和获取一些列和路由相关的数据和方法了。

![image-20210627164253258](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627164253258.png)



```jsx
//这种形式的Login组件是受路由管控的组件
<Route path="/login"   component={Login}></Route>   


//这种形式的组件并不是受路由管控的组件，在组件内部无法直接使用props.history.push()这种编程式导航
<Route path="/" component={()=>{     
	return localStorage.getItem('token')?<NewsSandBox></NewsSandBox>:<Redirect to='/login'/>
}}></Route>
```

如果希望`NewsSandBox`组件内部都能访问路由提供相关数据，则需要在`NewsSandBox`组件内部使用 `withRouter`高阶函数封装一下。具体写法如下：

```jsx
import SiderNav from "../../components/sandbox/sider-nav/sider-nav";
import TopHeader from "../../components/sandbox/top-header/top-header";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";   //关键代码：withRouter
import Home from "./home/home";
import NotFound from "./notfound/not-found";
import RightList from "./right-manage/rightlist/rightlist";
import RoleList from "./right-manage/rolelist/rolelist";
import userList from "./userlist/userlist";
import { Layout } from "antd";
import "./NewsSandBox.scss";
const { Content } = Layout

function Login(props) {
  return (
    <Layout>
      <SiderNav></SiderNav>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Switch>
            <Route path="/home" component={Home}></Route>
            <Route path="/user-manage/list" component={userList}></Route>
            <Route path="/right-manage/role/list" component={RoleList}></Route>
            <Route
              path="/right-manage/right/list"
              component={RightList}
            ></Route>
            <Redirect path="/" to="/home" exact></Redirect>
            <Route path="*" component={NotFound}></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}

export default withRouter(Login)   //关键代码
```



在函数式组件中，函数的返回值部分（return语句部分）是jsx主要集中书写的部分。当然return语句前面的函数体部分也是可以使用jsx语法的。在函数式组件的jsx语法中，如果想使用函数体中定义的方法或者属性，直接花括号中书写就行。





### JsonServer模仿后台接口

实现restful  api，实现增删改查，过滤，排序和查询等。它解决的跨域问题。

在json-server中：

基础用法：

- get表示获取数据
- post表示新增数据
- put表示替换式更新
- patch表示补丁式更新
- delete表示删除

查询数据：

- ?key1=value1&key2=value2(与逻辑的查询)

  ![image-20210703133355046](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210703133355046.png)

- /key

  ![image-20210703133448118](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210703133448118.png)

  

  

高阶用法(类似表连接)：

- 通过路由部分的query传参?_embed=xxx  联合获取相关数据      向下链接
- 通过路由部分的query传参?_expand=xxx  联合获取相关数据     向上链接

比如：在请求会来一篇文章后，还想连带将该文件相关的评论给一起请求回来。

![image-20210627213303706](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627213303706.png)

![image-20210627213248715](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627213248715.png)



比如：购物车中的每个商品只是存放着商品的id，如果想要获取商品的详细信息，所以需要通过id向上查找商品详情

![image-20210627213632910](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627213632910.png)

![image-20210627213739347](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627213739347.png)







### 项目siderMenu(14)

问题：

1. 后台并不返回图标

   可以在本地准备一张路径和图标的映射数组，之后通过路径取出对应的图标组件。

   比如：

   ```jsx
   import {
     HomeOutlined,
     AppstoreOutlined,
     UnorderedListOutlined,
     AuditOutlined,
     UserAddOutlined,
     BookOutlined,
     FileAddOutlined,
     BorderOuterOutlined,
     AlignLeftOutlined,
     FormOutlined,
     QuestionCircleOutlined,
     KeyOutlined,
     LayoutOutlined,
     MenuOutlined,
     OneToOneOutlined,
     PullRequestOutlined,
   } from "@ant-design/icons";
   
   
   
   const iconList = {
     "/home": <HomeOutlined />,
     "/user-manage": <AppstoreOutlined />,
     "/user-manage/list": <UnorderedListOutlined />,
     "/right-manage": <AuditOutlined />,
     "/right-manage/role/list": <PullRequestOutlined />,
     "/right-manage/right/list": <UserAddOutlined />,
     "/news-manage": <BookOutlined />,
     "/news-manage/add": <FileAddOutlined />,
     "/news-manage/draft": <BorderOuterOutlined />,
     "/news-manage/category": <AlignLeftOutlined />,
     "/audit-manage/audit": <QuestionCircleOutlined />,
     "/audit-manage": <FormOutlined />,
     "/audit-manage/list": <UnorderedListOutlined />,
     "/publish-manage": <KeyOutlined />,
     "/publish-manage/unpublished": <LayoutOutlined />,
     "/publish-manage/published": <MenuOutlined />,
     "/publish-manage/sunset": <OneToOneOutlined />,
   };
   
   
   //使用
   
   <Menu.Item
       key={list.key}
       icon={iconList[list.key]}
       onClick={() => {props.history.push(list.key);}}>
       {list.title}
   </Menu.Item>
   ```

   ![image-20210724092234856](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210724092234856.png)

   

   

   

   

   

2. 不需要导航的项目也出现在侧边导航中,在本项目中后端返回的侧边栏数据中，有一项字段：pagepermission。带有pagepermission属性的具体对象是需要在侧边栏中渲染出来的，没有的话，说明是功能权限。具体内容如下：

   （后端返回的数据包括页面权限，功能权限和路由权限），这些内容后端会一起返回给前端，前端可以根据相应字段是否存在决定是否渲染出对应内容。   pagepermission的两种用途： 1. 表示有该项字段的是否可以被渲染到页面；  2. 改变它的真假值可以在后期进行权限管理。

   ```json
   [
       {
           "id": 1,
           "title": "首页",
           "key": "/home",
           "pagepermisson": 1,
           "grade": 1,
           "children": []
       },
       {
           "id": 2,
           "title": "用户管理",
           "key": "/user-manage",
           "pagepermisson": 1,
           "grade": 1,
           "children": [
               {
                   "id": 3,
                   "title": "添加用户",
                   "rightId": 2,
                   "key": "/user-manage/add",
                   "grade": 2
               },
               {
                   "id": 4,
                   "title": "删除用户",
                   "rightId": 2,
                   "key": "/user-manage/delete",
                   "grade": 2
               },
               {
                   "id": 5,
                   "title": "修改用户",
                   "rightId": 2,
                   "key": "/user-manage/update",
                   "grade": 2
               },
               {
                   "id": 6,
                   "title": "用户列表",
                   "rightId": 2,
                   "key": "/user-manage/list",
                   "pagepermisson": 1,
                   "grade": 2
               }
           ]
       }
   ]
   ```

   上面数据中的grade字段适用于确定是否是二级权限项的。在删除二级权限项目时，在前端页面中，首先先确定该二级权限项的父级权限项，在获取到该父级权限项目后，在父级权限项的children属性中，将对应的二级子权限项过滤掉，并重新赋值给model层数据，这样做是为了实现前端页面的删除。与此同时，获取该项的id，并向后端发请求，后端在数据库中将对应的数据删除，这样做是为了让页面在下次重新请求权限数据时，不再出现此被删除项数据。这样就不会再渲染到页面上了。

   

重点：pagepermission字段的作用，用于做侧边导航栏选项的权限控制。权限列表中可以单独控制侧边导航栏的开关的。其实最后开关所关联的也就是该pagepermission字段

![image-20210627214511851](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627214511851.png)





3. 页面已经选中某项后，刷新页面将不再选中任何项，并且展开的导航栏也一并关闭

   解决办法：

   ```jsx
   <Menu 
       theme="dark"
       mode="inline" 
       defaultSelectedKeys={ [props.location.pathname] }   //初始选中项，对应的是Menu.item组件的 key 标签属性
       defaultOpenKeys={['/'+ props.location.pathname.split('/')[1]]}  //初始展开的SubMenu项 的key 标签属性
       >
       {renderMenu(lists)}
   </Menu>
   ```

4. 从 ` / ` 路径重定向到 `/home`  是，/home对应的侧边导航栏并未选中高亮
   原因： `/`和`/home`对应的组件都是`<NewsSandBox></NewsSandBox>`  ，而`<SideMenu>`组件是个公共组件，所以在路由变化时，会复用组件，而不是重新创建组件。而在`<SideMenu>`组件中使用的Menu组件也就没由重新创建。所以 defaultSelectedKeys={ [props.location.pathname] }  也就没有重新执行。也就不能回去到最新的、home路由，也就无法高亮显示侧边的对应导航栏项。

   defaultSelectedKeys 是非受控组件使用的，对应受控组件使用的是slectedKeys。

![image-20210627220928262](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627220928262.png)

![image-20210627220937878](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627220937878.png)

5. 在该项目中侧边栏的导航并不是通过Menu.Item组件的插槽中内嵌 react-router-dom 插件中的Link组件标签来实现的。而是通过编程式导航实现。具体实现过程是：将侧边栏组件用高阶组件 （react-router-dom 中 withRouter 进行包装后导出）这样组件内部就能通过访问 props.history.push('/xxxxx')的方式实现点击后跳转。





### 自己踩过的坑：

SubMenu 组件是不能绑定点击后通过 props.history.push('/xxxxx')的方式实现点击后跳转的。如果写了那么该下拉框导航栏中的所有子导航栏的跳转效果将失效。

```jsx
const renderMenu = (menulists) => {
    return menulists.map((item) => {
        if (item.children && item.children.length > 0) {
            return <SubMenu key={item.key} title={item.title} icon={iconlist[item.key]}>
                {renderMenu(item.children)}
            </SubMenu>
        }else{
            return  <Menu.Item key={item.key} icon={iconlist[item.key]} onClick={()=>{
                    props.history.push(item.key)
                }}>{item.title}</Menu.Item>
        }
    });
};
```



在react项目中的路由匹配部分的坑：

千万不能给有子路由项的一级路由匹配组件配置精准匹配exact属性。如果这样做，在匹配二级子路由路径时将无法匹配到一级路由对应的组件，又因为二级路由出口在一级路由匹配组件的内部。所有这样的话，将导致二级组件没有地方渲染，而使得页面空白。 

```jsx
<HashRouter>
    <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={SandBox}></Route>
    </Switch>
</HashRouter>
```



在antd中，Menu组件有一个属性defaultSelectedKeys，该标签属性的值可以是一个数组，数组中的每一项自动匹配Menu.Item中key相同的项。在该新闻项目中，该属性的值中，只放了一个属性，这样同一时间只会有一个导航元素被选中，当一个导航元素下面有子导航时，选中子导航时，只会有子导航自己高亮，子导航的父级导航并不会高亮。如果希望父级导航也选中并高亮的话，解决方法如下：

方式一：

用Location对象中保存state

```
<NavLink
    to={{
        pathname: path,
        state: {key:value},
    }}
>
```

方式二：

```css
history.push({ pathname: path, state: {key:value}});
```

上面两种方式的state可以保存一级路由地址，在history中的location对象中的state属性，可以找到保存的值，然后就可以在Menu的defaultSelectedKeys中放入从location中state拿到的homePath来匹配一级路由；

```
const homePath = (this.props.location as any)?.state?.homePath || undefined;
<Menu
     defaultSelectedKeys={[pathname, homePath]}
>
```

这样就可以在子路由页面，依然可以默认选中一级菜单。





Menu组件中的选中的菜单项 key 数组中的两个类似属性

- defaultSelectedKeys ：初始选中的菜单项 key 数组，定义的是非受控的数据
- selectedKeys：当前选中的菜单项 key 数组

受控组件：组件中用到外部父级组件的状态数据，当外部状态数据改变，组件根据数据而改变 的组件

非受控组件：组件中用到外部父级组件的状态数据，当外部状态数据改变，组件不根据外部数据改变 的组件







### 权限管理

![image-20210627224115637](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627224115637.png)



管理员在权限列表中，可以对权限进行增删改，并返回给后端保存 ，其他人再次访问该侧边栏接口返回的就是不同的侧边导航数据。

目前要做的是：侧边栏展示的内容通过权限列表可以进行动态编辑。

![image-20210627225442098](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210627225442098.png)

antd中table组件的使用：

```
//导入Table组件
import {Table} from 'antd'
Table组件标签上有两个非常关键的标签属性：dataSource  和  colums   ，前者应该是一个数组，其中数组中的每一项是一个对象，对象中的全部或者部分属性将作为table组件中一行的不同列中的数据。   colums也是对象数组格式，但是每个对象代表的信息是table组件的某一列的信息。


列表中的每一行应该有属于自己的唯一的key值。可以有两种方式设置每一行的key值，一个是在datSource数据数组中的每一个对象元素上有保证有一个key值得存在，之后table组件会自动取用该对象的key值作为每一行的key  。 另一种方法是，通过设置 table组件标签的  rowKey属性，该标签属性没有的话，就是默认前面的那种情况。 自己设定的话： rowKey={ item=>{ item.id } },其中item表示的是某一列的数据对象
```



注意点：

- 在函数式组件中，如下。  在函数组件返回的jsx语法模块中需要使用的一些列变量或者方法，都可以定义在return语句的前面,然后在jsx语法中通过花括号的方式进行使用。 

- 一个函数式组件中可以使用多次react hooks

```jsx
import React, {uesEffect} from 'react'
function ComName (){
    ......
    uesEffect(()=>{xxx},[])
    uesEffect(()=>{xxx},[])
	return (
		<div>xxxxx</div>
	)
}
```





### 角色权限

如果每创建一个角色，就为该角色一项项的确定权限，那比较麻烦。所以可以提前预设好一些角色，某个角色就是一系列权限的集合体。以后只需要给某个用户直接分配角色即可确定一系列权限。写好角色列表，在创建用户时，给某个用户分配角色，以后该用户登录，那该用户的权限列表和所有的权限的权限列表进行对比即可，选择性的渲染选线项。

![image-20210707084137952](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210707084137952.png)



关于角色的删除，是在点击删除按钮后，获取对应行的数据中该角色的id，同时将前端本地的表单组件dataSource进行过滤更新，前端数据一变，可以在不刷新页面的情况下重新渲染组件。然后再拿着id去后台请求删除对应角色，以实现下次页面刷新时，对应的角色数据已经没有。



在ant dseign 组件库中，有些组件标签有类似属性，只是一个是受控组件属性，一个是非受控组件属性。非受控组件属性常常以default-开头，表示传入该组件的属性值只会在第一次渲染时生效，之后父组件的对应传给该组件属性的值再次发生变化时，在组件内部将不再同步该数据。  而受控组件则与之相反。

对于传入的受控组件的数据，在组将中完成渲染后，通过事件想要触发视图的改变，在react中是不行的，必须要先通过事件去修改传入组件的数据，然后react会自动渲染最新数据到视图上，以至于看上去像直接实现了vue中的双向数据绑定。

![image-20210707085558341](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210707085558341.png)



树形控件：

![image-20210707090023569](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210707090023569.png)





### 用户列表



![image-20210629224754228](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210629224754228.png)



通过表单组件收集用户信息，并在发往服务器之前进行表单验证。在该项目中，表单组件被提出去单独封装为了一个组件。想在使用了该组件的父组件中收集并触发该表单组件的验证方法。 对于表单组件中，想要获取某个表单控件的value值，可以通过ref获取表单实例后再获取表单控件的值。



在用户列表组件中，添加用户列表的弹出框用于收集新建用户的信息。但是在该项目中，收集用户的表单控件被提出去单独封装为一个组件了，在form表单组件中使用到的部分数据是在父组件中请求回来的，然后在父组件中通过组件标签属性的方式传给了form组件。在form组件内部通过 props.xxx获取并使用。



使用ant dseign 中的表单组件收集用户填写的信息，并完成表单校验，并传递给后台。对于表单控件，在框架中可以尝试使用ref属性来获取对应的表单元素，也可取得元素的value值。同时也可以拿到后对对应的元素进行规则校验。



在ant design中的表单组件中常常选择给Form组件绑定ref属性值，因为Form组件上有很多的校验方法和其方法。

对于该项目中的表单控件的提交和数据验证而言，因为该表单组件放在了一个Model弹框组件中，该弹框组件有确定和取消按钮的点击回调事件，在点击后需要的是去触发被封装的了表单组件的提交和校验的方法。





react hooks有一个回调函数uesRef



forwardRef是react核心库导出的一个方法。它可以接受一个**函数式组件**作为参数。该方法会向组件的形参部分传除了props以外的另一个参数——ref。  ————forwardRef对ref进行透传。

子组件使用forwardRef进行封装。  

**整个用法的目的是：想在父组件中，获取子组件内部的某个具体的dom元素或者子组件内部使用到的其他的子组件。**

forwardRef修饰子组件后，可以将父组件中ref对象透传到子组件中，并可以在内部将父组件的ref对象绑定给子组件中的其他元素。

![userForm组件](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210701091711718.png)





父组件因为是函数式组件，可以使用uesRef创建一个ref容器变量。

![image-20210701091950486](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210701091950486.png)



![image-20210708214912524](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708214912524.png)

![image-20210708215004810](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708215004810.png)



![image-20210701092104373](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210701092104373.png)







通过forwardRef对子组件进行封装，然后在使用了该组件的父组件中通过给该组件自定义ref属性，将该ref属性容器传到了子组件内部，子组件可以用它来绑定在自己内部的dom元素上。这样父组件在自己的作用域内就能访问到子组件中的dom元素了。（将父组件的ref对象透传到子组件内部。）

![image-20210701093257165](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210701093257165.png)

![image-20210701093304540](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210701093304540.png)







这种情况是，在一个表单域控件中，一个表单元素的改变会影响另一个同表单域下的另一个表单元素。在该项目中，做法如下，在组件中定义了一个状态，一个表单元素用它决定自己是否可用，而一个元素通过自己的事件去改变该状态数据的值，从而实现对一个表单元素的改变影响另一个表单元素。

![image-20210708220007563](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708220007563.png)

![image-20210708220047607](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708220047607.png)

同时，在该表单组件中，当选择角色是超级管理员式，表单控件中的区域下拉框是禁止选择的，且原来区域表单元素有值的情况下，还可以清空原来的值。

![image-20210708220300680](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708220300680.png)
![image-20210708220921208](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708220921208.png)

![image-20210708220442812](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708220442812.png)

![image-20210708220602853](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708220602853.png)



在点击模态框的确定按钮后，需要做的事有：

1. 关闭模态框，清空模态框中填写好的数据

2. 将模态框内表单控件填写的数据同步到前端本地的model层

   对于来自后台的已经创建的用户数据，如下图:

   ![image-20210708231753555](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708231753555.png)

   

   它们都有这几项字符,如图:

   ![image-20210708231824999](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708231824999.png)

   

   但是在本地新建用户时，填写的新用户的信息只有用户名，密码，地区，角色这四个字段，但是前端并不能手动设置新用户的id值，最多可以设置default和roleState值。如果现在就直接将前端获取的表单数据渲染到列表中，不取用后台返回的数据，那么之后在删除具体的某个用户时，因为没有对应的id值，而导致无法删除成功也不能实现用户是否可用的更新。

   所以需要将前端生成的基本数据提交给后端，后端返回带有id值的用户数据，然后再同步到前端本地的model层，之后就能顺利删除和更新了。

3. 将新建的用户的数据同步给后端

![image-20210708233004134](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708233004134.png)

![image-20210708233040576](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708233040576.png)

![image-20210708233138025](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708233138025.png)





刚刚创建的角色，在渲染角色名称时存在bug，但是在页面刷新后，数据将回显成功。

![image-20210708091741798](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210708091741798.png)

原因：

前面在将后端的数据同步到前端model层时，并没有通过角色名称的id去链表取出关于角色部分的数据。解决办法：

![image-20210709000343420](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709000343420.png)

手动过滤并确定role。

### 用户管理

用户状态的打开与关闭能控制用户是否可以登录，点击编辑按钮可以实现对用户的名字，密码，角色的修改。

![image-20210709002615289](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709002615289.png)

在该项目中控制用户是否可以登录的字段是soleState 是true 还是false





react中状态的更新并不是同步进行的，当改变一个数据时，该数据会控制某个dom的元素的显示和隐藏。但是在事件处理函数中设置的相应的状态数据的修改时，该处理函数还处理了其他逻辑，这样就有可能导致后面的逻辑代码无法生效。

比如在该项目中，如下图：

![image-20210702091604638](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210702091604638.png)

该UpdateVisible状态数据设为true时，会控制一个表单元素的显示，而下一行代码直接就去获取该表单元素。并尝试给表单元素设置值。但是由于设置状态数据并不是同步的，所以在将状态数据改为true的那段代码执行之后，实际的状态数据并不是立即变为true，而因为没有变为true，所以实际上表单控件并没有被创建和渲染出来，也就无法在下一行代码执行时获取到真实的dom元素。所以没能成功给表单控件设置值。

![image-20210709091753332](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709091753332.png)



解决办法：

将这两段代码变为同步执行的，在react中只要是异步函数中的代码，往往就是同步执行的。

![image-20210702092204669](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210702092204669.png)



结论：不要认为在事件处理函数中，前一段代码更改了状态数据，后面的代码就能马上基于更改为的状态数据进行任务逻辑的处理。不要以为控制dom 的状态代码一旦被解析执行后就可以直接获取dom元素进行dom操作。



### 父组件改变子组件的元素的是否可用的状态

在父组件中定义一个状态属性，然后将它作为标签属性传入给子组件内部，在子组件内部使用useEffect方法去监听该从外层父组件中传递进来的状态数据。当该数据状态以改变，就控制自己组件中有个状态数据的改变并由子组件自己的该状态数据去某个元素的状态。从而间接的实现父组件对子组件的元素的状态的控制。 







![image-20210709095713579](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709095713579.png)

![image-20210709095733168](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709095733168.png)

![image-20210709093904567](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709093904567.png)

对于useEffect函数，当第二个参数位置存在数据时。一旦第二个参数数组中的某一项数据发生改变就会让该函数重新执行一次。如果没有变化，则不执行该hook函数   。

解决bug的办法：

![image-20210709101759598](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709101759598.png)

在模态框的取消按钮点击时，有意的将要传入子组件的状态数据取一下反，这样就可以保证子组件中的useEffect函数可以每次都被调用。







用户列表主要是为了解决只有创建过的用户才能登录到该系统的权力，以及拥有哪些权限和能看到那些侧边导航栏。

接下来是把登录页面联动整个用户列表，侧边栏和导航栏信息 

点击退出登录按钮，清除token并且路由定向到登录页面，路由重定向的话建议使用props.history.replace('/login')。

注意：

在本项目中TopHeader组件并不是直接受路由管控的组件， TopHeader组件是SandBox组件内部的子组件，而SandBox组件是直接受路由管控的，所以在SandBox组件的作用域范围内可以获取到如：props.history,props.location.props.match属性。



![image-20210709220520317](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709220520317.png)



![image-20210709220736816](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709220736816.png)





对于ant design 组件中的Form表单，它有一个自身的自定时间：onFinish，当点击属于该表单域内的submit 类型的按钮时，会自动触发该表单域组件的onFinish事件，并将该表单域中的所有表单控件的数据整体作为一个对象，传入onFinish事件处理函数的第一个形参位置。



在前面的用户信息新建和更新的弹出框中，弹出框内部的From子组件并没有属于它自身的submit类型的按钮，而真正触发表单控件提交的按钮是在外层的弹出框中，所以当时并没有使用表单域控件自己的onFinish事件来验证和提交表单数据。



Form中的提交按钮：

![image-20210709221921912](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210709221921912.png)



react结合canvas粒子效果：

第三方包：react -particles-js

具体配置使用过程看p30.







对于账户的登录处理，理想的情况如下：

- 用户在登录页面填写表单用户数据
- 填写后的数据以post方式发送给后端
- 后端收到后进行逻辑判断和数据库查询，对于有登录权限的用户返回基本信息和token给前端
- 前端存好token数据在本地
- 之后在每次请求后台时都在请求头部分带上token给后端，以完成每次请求数据时校验当前用户是否登录和是否有权限



在本项目中，由于json-server能力有限，为了继续之后的业务。采用前端收集好登录数据后，用get方法请求后台，去校验是否有该字段，并且如果有该用户，还需要确认该用户的用户状态字段 ：roleState是true值才能登录成功。

在通过get方式去查询json-server模拟的后端数据中是否有对应的数据，去确认是否登录成功并实现页面跳转。在这里因为每个用户都有一个roleId，后端可以通过roleId进行表关联后查询到该用户所属的角色或者职位，并且返回该角色所能访问的具体路由有哪些。

 

![image-20210710010235897](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210710010235897.png)





在登录成功后，将用户的基本信息，id，权限等存在了local storage中并完成页面的跳转，在跳转后的系统中，头部用户信息栏的话直接取出对应的local storage中的信息然后赋值给对应元素就行。

对于侧边栏导航，之前是请求到全部的侧边栏导航路径后直接渲染，现在则在原有的条件判断中，新增肌一条关于用户的是否包含对应字段的条件判断，然后再确定好是否渲染某部分侧边栏。



目前存在的bug，超级管理员和区域管理员都是可以访问到用户列表页面的，而用户列表页又是无差别的将全部用户给渲染出来的，所有区域管理员可以设置超级管理员的用户信息，也可以将自己的信息改为超级管理员。



正确需求是：对于超级管理员，能看到用户列表页面中所有的用户的信息并能进行任意编辑。而区域管理员只能看到自己所在区域中的自己和对应区域中的区域编辑，并且他也不能将修改区域编辑到其他区域去，也不能修改角色。



![image-20210710013243013](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210710013243013.png)



![image-20210710094922090](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210710094922090.png)









### 动态路由生成

截至目前，当不同角色成功登录后，侧边导航栏是可以实现根据不同角色动态的渲染不同的导航链接。但是如果通过url地址栏输入路径时任然可以进入到相应的模块。    原因是：在项目中目前的路由路径和路径对应的组件都是之前固定写死的，所以只要url地址栏匹配上后就会去渲染对应的模块组件。

解决办法就是动态的生成路由和模块的匹配，也就是动态的生成 Route标签组件。

在sandbox中，如下图，不是写死的而是动态生成的。

![image-20210710123626258](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210710123626258.png)

动态创建路由：

- 后端返回权限列表
  ![image-20210711095554570](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711095554570.png)

- 本地像前面的字体图标表一样，有一张路径和组件的映射表

  ![image-20210711094941706](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711094941706.png)

  

- 登录用户有一张自己的



在之前的aside-bar（侧边栏）组件中，由于使用了ant design的Menu组件及其的下拉导航子链接效果，所以之前请求回来所有的侧边栏导航时是使用的json-server中的表连接的请求的接口是`http://localhost:3000/rights?_embed=children`,  但是现在是在做同级路由的动态渲染，所以不需要路由之间表现出嵌套的关系，而是数组扁平化的关系。为此就采用了Promise.all方法去分别请求多个接口，然后将请求回来的数据合并为一个数组，再由该数组去动态渲染路由。

bug：后端返回的路由包括一级路由，而在本地的路由和组件的映射表中，有子路由的一级路由是并不直接对应任何组件的，但是在动态生成Route 组件标签时，一级路由对应的地址也生成了一个路由Route，但是它对应的compoennt是undefined ，同时在没有精准匹配的情况下一旦匹配到一级路由，就停止继续匹配了。

![image-20210711101058128](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711101058128.png)



![image-20210711115517765](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711115517765.png)



截止到这里，上面的操作会将所有的路由都生成对应的Route组件标签。但是实际上Route路由是需要动态且有条件的渲染出来。所以还需要加上判断。	







### nprogress库

进度条插件，想要达成的效果是：当点击路由进行切换时，顶部会出现进度条。

![image-20210711092514770](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711092514770.png)

问题：在插件在哪里使用了？

往往是使用在一级路由对应的功能组件中。在本项目中是放在SandBox组件（内部存放了许多的二级路由出口，每次路由切换都会重新渲染组件，不一定是重新创建）中了。 

![image-20210711091957107](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711091957107.png)

每次路由改变，都会从一级路由开始重新匹配一次组件（以及路由绝对不能是精准匹配）。对于有匹配变化的组件涉及销毁和创建，所以SandBox组件每次都会重新渲染。所以在SandBox组件中使用进度条插件。

![image-20210711092453454](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711092453454.png)



![image-20210711092635614](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711092635614.png)



再次优化，想要实现的效果：在每次请求数据的过程中时，页面出现提示正在加载中效果。实现方式：

方式一：

- 给每个组件页面增加一个显示loading和在请求结束时关闭loading提示。

方式二:

- 借助axios的请求拦截器和响应拦截器去在每次请求时显示loading 响应式隐藏loading









## React面试题



#### 请说一下你对React的理解（概念题）

- 本质是什么
  用于构建用户界面的JavaScript库

- 能做什么
  可以通过组件化的方式构建快速响应的大型web应用程序

- 如何实现
  使用声明式的方式编写代码，方便阅读和调试
  组件化，将页面拆分为一个个组件，方便复用和管理，做到高内聚和低耦合（jQuery中以页面为单位，React以组件为单位）

- 比较优缺点
  开发团队和社区强大
  生态全面，既可以做web，移动端，也可以做元素app开发
  api简洁

  

  没有官方的整套解决方案，选型成本比较高（社区有一些全套解决方案如dva，umi等）
  过于灵活，不容易写出高质量的代码

  


  扩展回答：

  jsx声明式编码
  虚拟DOM实现跨平台
  React中使用到的数据结构（小顶堆，链表，发布订阅，单例）

  



#### 为什么要在react中使用JSX语法（React中为什么引入JSX语法）

- JSX是什么
  JSX是一个JavaScript的语法扩展，它可以很方便的描述UI结构和应该有的交互
  JSX其实是React.createElement语法的语法糖


  jsx语法变为React.createElement( ) 语法格式

  

- 为什么引入JSX
  为了实现声明式编程，提高编码效率和可维护 性和可读性
  代码结构非常的清晰可读
  不用引入新的概念和语法，更加的向元素的JavaScript靠拢

  

- 工作原理

  jsx是利用抽象语法树将源码结构语法变为一种抽象的树形结构，树上的每个节点表示源码中的一个结构

![image-20210711230822573](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711230822573.png)

不同语言转为抽象语法树的结构是不一样的。

jsx语法转为React.createElement( ) 语法树 和 JavaScript转为底层语法树，树的结构是不同的。



React17以前：

![image-20210711231516755](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711231516755.png)



React17以后：

![image-20210711231714935](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711231714935.png)

注意上图还自动引入了一个包 ——react/jsx-runtime,   在该包中，它引入了React，所以不需要开发者在当前上下文中主动引入React。

react/jsx-runtime封装了React.crateElement( )



classic是来的转换，将jsx转为React.crateElement( )形式

automatic是新版转换，它会对编译结果引入jsx函数，通过jsx进行转换







#### 说一下对虚拟DOM的理解

虚拟DOM是React.crateElement( )方法所返回的一个虚拟DOM,它是一个描述了真实的DOM的纯js对象。对标的是vue中vnode对象。



![image-20210711233819356](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711233819356.png)

虚拟DOM：

![image-20210711233521663](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711233521663.png)





React中的源码：

![image-20210711233932026](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210711233932026.png)



采用虚拟DOM的优缺点：

- 处理了浏览器的兼容性问题，避免用户操作真实的DOM元素
- 内容经过了xss处理，防范xss攻击
- 可以实现跨平台开发
- 更新时可以实现差异化更新，减少更新DOM的操作





- 虚拟DOM需要消耗额外的内存
- 首次渲染不一定更快



**虚拟DOM会不会更快**

- 初次渲染时并不快，但是在更新时，需要更新的元素内容较少，它可以实现精准的定量更新，不需要将全部的dom元素删除和重新添加
- 采用虚拟DOM的优势肯定不是为了追求快，而是为实现快平台，增量更新，处理兼容性问题





在React中，如果元素没有使用key值标识，则框架在dom-diff的时候就会使用索引来对比。





ReactNode和ReactElement的区别

React.createElement(type, config, children)中的children其实就是ReactNode， 而ReactElement则是React.createElementfa方法返回的结果。





#### 函数式组件和类组件的区别



相同点：

- 它们都可以接收属性对象并返回React元素

不同点：

- 编程思想不同，类组件需要创建实例，是基于面向对象的编程，而函数式组件不需要创建实例，接受输入，返回输出，是基于函数式编程的思想

- 内存占用不同，类组件需要创建并保存实例，会占用一定的内存，函数式组件不需要创建实例，可以节约内存

  ```
  class Com extends Component{
  	render(){
  	  return (<div>hello world</div>) 
  	}
  }
  const ComObject = new Com()
  let vDom = ComObject.render()
  然后渲染vDom虚拟DOM
  
  
  
  function Com (){
   return (<div>hello world</div>) 
  }
  let vDom = Com(props)
  然后渲染vDom虚拟DOM
  ```

- 捕获特性，函数组件具有**值捕获特性**
  **值捕获特性(面试)**
  
  ```jsx
  import React from 'react'
  import ReactDOM from 'react-dom'
  
  class ClassComponent extends Component{
  	state = { number:0 }
  	
  	handleClick=()=>{
          setTimeout(()=>{
              console.log(this.state.number)
          },3000)
          this.setState({
              number:this.state.number+1
          })
      }
  
  	render(){
  	  return (
            <div>
            		<p>{this.state.number}</p>
                	<button onClick={this.handleClick}>点击</button>
            </div>
  	  )
  	}
  }
  ReactDOM.render(<ClassComponent/>, document.getElementById('root'))
  
  //问题：点击按钮后，控制台打印的是什么值？
  //答案：1,  因为实例是同一个，状态对象也是同一个，如果是类组件的话，this.state永远是最新的值
  ```
  
  ```jsx
  import React from 'react'
  
  function FunctionComponent(){
      let [number, setNumber] = React.useState(0)
      const handleClick =()=>{ 
           setTimeout(()=>{
              console.log(number)
          },3000)
          setNumber(number+1) 
      }
  	return (
      	 <div>
            		<p>{number}</p>
                	<button onClick={ handleClick }>点击</button>
           </div>
      )
  }
  ReactDOM.render(<FunctionComponent/>, document.getElementById('root'))
  //问题：点击按钮后，控制台打印的是什么值？
  //答案：0,  这就是可捕获值特性的表现，函数组件被调用时类似产生了闭包概念，如果想打印最新值得话，可以使用ref。
  ```
  
- 函数组件更方便编写单元测试

- 状态,类组件有自己得实例，可以定义自己的状态而且可以修改状态并更新组件，函数式组件以前是没有状态的，现在可以使用useState 这类hooks实现状态

- 生命周期，类组件有自己的生命周期函数，可以在生命周期函数中编写代码逻辑，函数式组件之前没有生命周期函数现在可以使用useEffect实现类似生命周期函数的能力

- 逻辑复用，类组件可以通过继承，组合实现逻辑复用（ 高阶组件 ），但是官方推荐组合优于继承，函数组件可以通过自定义hooks实现逻辑复用

- 跳过更新，类组件可以通过生命周期函数**shouldComponentUpdate** 和 **PureComponent**来跳过更新，而函数式组件可以使用**React.memo**来跳过更新  


  想在属性或者状态不变的时候不更新组件就可以使用PureComponent，如果想


```jsx
下面是PureComponent的源码：
class PureComponent extends React.Component{
	shouldComponentUpdate(newProps, newProps){
		//如果新旧属性对象或者状态对象浅比较后不相等就返回true
		return !shallowEqual(this.props, newProps) || !shallowEqual(this.state, newState)
	}
}

function shallowEqual(obj1,obj2){
	if(obj1===obj2){
		return true
	}
	if(typeof obj1 != 'object' || obj1 === null || typeof obj2 != 'object' || obj2 ====null 	){
		return false
	}
	let keys1 = Object.keys(obj1)
	let keys2 = Object.keys(obj2)
	if(keys1.length !==keys2.length){
		return false
	}
	for(let key of keys1){
		if(!obj2.hasOwnProperty(key)||obj1[key]!==obj2[key]){
			return false
		}
	}
	return true
}

PureComponent组件的原理是内部重写了PureComponent方法
```

- 函数组件跳过不必要的更新使用React.memo

  ```JSX
  React.memo的使用
  
  import React from 'react'
  import ReactDOM from 'react-dom'
  
  
  function childComponent(props){
      console.log('render')
      return (
      	<>
          <span>{props.name}</span>
          </>
      )
  }
  
  const MemoChildComponent = React.Memo(childComponent)
  
  class App extends React.Component{
  	constructor(props){
  		super(props)
  		this.state = {
  			number:0
  		}
  	}
  	
  	handleClick(){
  		this.setState({
  			number:this.state.number+1
  		})
  	}
  	
  	render(){
  		let {number} = this.state
  		return (
  			<div>
  				<span>{number}</span>
                  <button onClick={this.handleClick}>点击</button>
                  <MemoChildComponent name='jack'></MemoChildComponent>
  			</div>
  		)
  	}
  }
  
  ReactDOM.render(<App/>,document.getElementById('root'))
  
  //对于上面的代码，父组件点击按钮后，会改变父组件自己的状态，父组件状态改变会导致父组件重新渲染，会更新App组件中的div，span，button 和 MemoChildComponent，但是MemoChildComponent是经过React.memo封装过了，如果传给组件的标签属性不变，则该组件不会重新渲染，内部代码也不会再次执行，所以render只打印了一次。  如果直接用时childComponent组件的话则父组件每次重新渲染，子组件都重新执行一次。
  ```

- 发展前景，函数式组件将成为主流，因为它很好的屏蔽了this问题，规范和复用逻辑，更好的适合时间分片和并发渲染
  自定义hooks在复用逻辑方面要优于类组件。

  类组件复用逻辑一般使用HOC高阶组件，特点：

  - 写起来麻烦
  - 容易出bug
  - 静态属性的继承还需要额外的处理
  - 如果复用的逻辑太多，多层嵌套，非常复杂，可读性差





类组件继承React.Component是为了获取Component类中定义的方法和生命周期函数，比如setState()方法







函数式组件对应的虚拟DOM对象中的type属性的值是FunctionComponent(props)

![image-20210712224323266](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210712224323266.png)

类组件对应的虚拟DOM对象中的type属性的值是ClassComponent()

![image-20210712224443616](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210712224443616.png)

es6中的类（class）是语法糖，在被babel编译后也是function。







**React底层区分函数式组件和类组件的方法**

在React中针对类组件，也就是继承了React.Component的组件，在Component函数的原型上有一个属性：Component.prototype.isReactComponent = { }

```
export function Component(props){
	this.props = props
	....
}
Component.prototype.isReactComponent = {//空对象}


等价写法：
class Component{
	static isReactComponent = true
	constructor(props){
		this.props = props
		...
	}
}
```

而函数式组件因为没有继承React.Component，所以原型链上是没有该属性的。







#### react的渲染流程

设计理念：

- 为了跨平台渲染只用了虚拟DOM

- 为了能快速响应而不让用户觉得卡顿，采用了异步可中断机制和增量更新机制

  浏览器刷新频率为60hz，大概16.6毫秒渲染一次，而js线程和渲染线程是互斥的，所以如果js线程执行任务的时间超过16.6毫秒的话，就会导致掉帧卡顿，解决方案是React利用空闲时间进行更新，从而不影响渲染进程。

  把耗时的一个任务分为多个小人物，分布在每一帧里执行——时间切片

为了解决js任务过大带来卡顿，React引入了fiber。







#### 对create-react-app 的默认配置自定义

使用craco

安装：

```yarn add @craco/craco
yarn add @craco/craco
```

修改 `package.json` 里的 `scripts` 属性：

```
/* package.json */
"scripts": {
-   "start": "react-scripts start",
-   "build": "react-scripts build",
-   "test": "react-scripts test",
+   "start": "craco start",
+   "build": "craco build",
+   "test": "craco test",
}
```

项目根目录创建一个 `craco.config.js` 用于修改默认配置:

```
/* craco.config.js */
module.exports = {
  // ...
};
```









### 项目介绍

