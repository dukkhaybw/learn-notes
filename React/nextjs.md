## 服务器端渲染

前端用户发起请求，后端收到请求后，后端先调用数据库，获得数据之后，再将数据和页面元素进行拼接，组合成完整的html页面，再直接返回给浏览器以便于用户浏览，浏览器拿到html直接渲染就可以了。



## 客户端渲染

浏览器先请求回来一个基本的html，其中有少量的脚本，然后后续数据再通过浏览器的ajax或者fetch动态获取，获取回来的数据再填充到dom元素上并展示。



两者的比较：

1. 服务端渲染需要消耗更多的服务器资源（CPU，内存等）
2. 客户端渲染可以将静态资源部署到cdn上，实现高并发
3. 服务器端渲染对SEO友好



## React原生提供的服务器端渲染方法

环境：

- nodejs
- express
- react
- react-dom
- babel-node
- babel-cli
- babel-preset-env
- babel-preset-react
- babel-plugin-transform-decorators-legacy

```shell
npm install express@4 react@16 react-dom@16 babel-preset-env@1 babel-preset-react@6 babel-plugin-transform-decorators-legacy@1 babel-cli
```



```shell
cross-env NODE_ENV=test nodemon --exec babel-node src/server.js
```

package.json：

```json
{
  "name": "react-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=test nodemon --exec babel-node src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "babel-cli": "^6.26.0",
    "babel-plugin-transform-decorators-legacy": "^1.3.5",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "express": "^4.18.3",
    "react": "^16.14.0",
    "react-dom": "^16.14.0"
  },
  "devDependencies": {
    "cross-env": "^7.0.3",
    "nodemon": "^3.1.0"
  }
}
```



.babelrc：

```
{
  "presets": ["env", "react"],
  "plugins": ["transform-decorators-legacy"]
}
```





server.js:

```js
import express from 'express'

var app = express()

app.get('/',(req,res)=>{
  res.send(`<h1>hello world</h1>`)
})

app.listen(3000,(error)=>{
  console.log('server is lintening at 3000!')
})
```



React服务器端渲染最主要的方法是react-dom/server包中的**renderToString**和**renderToStaticMarkup**方法，这两个方法的主要作用都是将react组件转为html字符串。然后服务器后续可以将这些html字符串传递前端浏览器进行渲染。



React15中：

**renderToString**和**renderToStaticMarkup**方法的区别：

- **renderToString**：将react component转化位html字符串，同时生成的html的DOM会带有额外的属性，比如各个DOM都会有data-reactid标签属性，组件的第一个根DOM会有data-checksum属性
- **renderToStaticMarkup**：同样是将react component转为html字符串，但是生成的html的DOM中不会有额外的属性。

这两个属性的属性值都是一些数字。



data-reactid的作用：用于起到标识组件中DOM标签的作用，

data-checksum的作用：是用于后端判断组件的数据是否有变，这个data-checksum属性的值一变，说明这个组件需要重新渲染，而不能复用之前渲染的结果。

两个属性都是为了提高react渲染组件的性能的。





## 后端直接将React组件返回给前端的情况

server.js：

```js
const express = require('express');
const React = require('react');
const App = require('./components/App.jsx');

const app = express();

app.get('/', (req, res) => {
  const list = [1, 2, 3, 4, 5, 6];
  res.send(<App list={list} />);
});

app.listen(3000, function () {
  console.log('server is running at 3000');
});
```



App.jsx：

```jsx
export default function App(props) {
  return (
    <div>
      <ul>
        {props.list.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
```



客户端请求后得到的结果：

![image-20240309104004760](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20240309104004760.png)

这就是组件被转化为虚拟DOM对象对应的字符串形式。组件并没有被转为对应的html字符串返给前端。



**React15的情况**

使用renderToString方法将react组件转为html字符串：

```diff
const express = require('express');
const React = require('react');
+ const { renderToString } = require('react-dom/server')
const App = require('./components/App.jsx');

const app = express();

app.get('/', (req, res) => {
  const list = [1, 2, 3, 666];
  const html = renderToString(<App list={list} />)
  res.send(html);
});

app.listen(3000, function () {
  console.log('server is running at 3000');
});
```



这时浏览器再去请求回来后，渲染的页面结果如下：

![image-20240309105630604](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20240309105630604.png)

且标签上有上面说过的属性：

<img src="C:\Users\dukkha\Desktop\learn-notes\React\images\image-20240309105730843.png" alt="image-20240309105730843" style="zoom:200%;" />



重点注意：由于服务器端渲染，renderToString或者renderToStaticMarkup方法都只是将组件渲染为html字符串，不会涉及js事件绑定的操作。

比如下面为button标签添加的一个事件绑定，App.jsx：

```jsx
import { useState } from 'react'

export default function App(props) {
  const [count,setCount]  = useState(0)
  return (
    <div>
      <button onClick={()=>setCount(count+1)}>{count+1}</button>
      <ul>
        {props.list.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
```



这时客户端得到html后，再去点击button，浏览器中是没有任何反应的。html没有任何有关JavaScript的脚本。

所以renderToString或者renderToStaticMarkup方法只是将组件的虚拟DOM转为html字符串，其中涉及的js的，比如事件绑定之类，他是不会处理的。



从react16开始，renderToString或者renderToStaticMarkup方法渲染出来的html字符串就去掉了标签上的data-reactid和data-checksum属性。



在React15中，当重新渲染节点时，ReactDOM.render()方法执行与服务端生成的字符挨个比对。如果一旦有不匹配的，不论什么原因，React在开发模式下会发出警告，替换整个服务端的节点数，

 

在React16中，客户端渲染使用差异算法检查服务端生成的节点的准确性。相比于React15更宽松;例如，不要求服务端生成的节点属性与客户端顺序完全一致。当React16的客户端渲染器检测到节点不匹配，仅仅是尝试修改不匹配的HTML子树，而不是修改整个HTML树。



## React同构

renderToString或者renderToStaticMarkup方法是不能对react组件中的事件绑定进行处理的，返回的是纯html字符串。 为了让页面具备行为，需要将事件绑定的js脚本文件以script标签的形式内嵌到要返回给浏览器的html字符串中，浏览器获取到该html后解析，发起请求js文件，js文件请求回来后，解析执行进行事件绑定。



同构的案例：

1. 使用create-react-app创建一个项目
2. 将express和create-react-app项目的配置文件进行结合
3. 将create-react-app编译打包生成的文件目录通过express公开`app.use('/',express.static("build"))`

通过webpack将项目打包生成html，js，css等文件并输出到指定的目录中（这种情况下的html的body中基本没有html标签，有的只是对js文件，css文件的引入标签，直接将这个html交给浏览器的话， 算不上服务器端渲染）。

要使用服务器端渲染是需要借助后端服务器实现的，自己启动一个express后接受来自浏览器的请求，然后根据请求，读取之前webpakc打包后生成的html文件，同时将要渲染的组件调用renderToString方法，将renderToString方法返回的html插入到上一步读取出来的html的特定位置，然后再返回给浏览器，浏览器接受到的html除了包含组件转成的html部分之外，还有webpack打包生成的脚本文件等，加载并解析执行js脚本实现事件绑定的效果。



```js
app.get('/',(req,res)=>{
  const html = fs.readFileSync('./build/index.html'); // 将webpack打包生成的html，该html中插入了打包生成的js，css等文件，作为模板
  const content = renderToString(<App/>);  // 将要服务端渲染的组件生成其对应html字符串
  res.send(html.toString().replace(`<div id="root"></div>`,`<div id="root">${content}</div>`)) // 将该html字符串内嵌到打包生成的html的特定位置
})

app.use('/',express.static('build')) // 将打包生成的目标目录作为静态资源文件夹暴露出去
```





![image-20240309140846793](C:\Users\dukkha\Desktop\learn-notes\React\images\image-20240309140846793.png)



这种情况下，如果开发者直接修改了App组件的代码，并重新执行了server.js文件，这时浏览器再去请求对应路径下的html时，首先会渲染一个包含对App组件进行最新修改的部分，并渲染处理来。但是同时原来的html中引入的是上一次webpack生成的脚本文件，当这个脚本文件一致性，又会重新去渲染整个页面，导致App中新编辑的修改内容被覆盖而无法表现为最新的页面UI。所以基于这种方式的服务端渲染，必须在有改动之后重启服务端之前，重新使用webpack打包生成最新的代码才可以。



而nextjs框架就是基于上面的基本原理，做了一个集成。自动实现同构操作，而不用开发者自己去做。



## nextjs

 next是服务器端渲染的框架，具有如下特点:

- 热更新，自动路由，单文件组件，服务端渲染
- 生态系统兼容:next.js与js、node、react生态系统协作良好
- 自动代码分割，预读取，动态组件，静态输出





### 安装

```shell
npm isntall next react react-dom -S
```



package.json：

```json
{
  "script":{
    "dev":"next"
  }
}
```

页面内容写在pages目录下（规定，因为next框架执行时会默认去这个目录下查找文件并生成其对应的html，且路由也是以文件的路径来自动生成的）。





### 样式

nextjs支持css,scaa,less,styles。





在Next.js中使用CSS、LESS等样式文件有多种方法，包括**全局样式、模块化样式以及预处理器**（如LESS）。Next.js**原生支持**CSS和Sass，对于其他样式预处理器（如LESS），你可能需要进行一些配置。下面是如何在Next.js项目中使用这些样式的指南：

### 1. 使用内置的CSS支持

#### 全局样式

要在Next.js中添加全局样式，可以在`pages/_app.js`文件中导入一个CSS文件。这对于应用全局的基础样式很有用。

```js
// pages/_app.js
import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

#### CSS Modules

Next.js支持CSS模块，允许使用局部作用域的CSS。可以为每个组件创建一个CSS文件，并像这样导入它们：

```js
// components/YourComponent.module.css
.title {
  color: red;
}

// components/YourComponent.js
import styles from './YourComponent.module.css';

export default function YourComponent() {
  return <h1 className={styles.title}>Hello World</h1>;
}
```

### 2. 使用Sass

要在Next.js项目中使用Sass，首先需要安装`sass`：

```
npm install sass
```

然后，可以像使用CSS那样使用`.scss`或`.sass`文件了。

### 3. 使用LESS或其他预处理器

虽然Next.js默认不支持LESS，但可以通过自定义Next.js的Webpack配置来添加LESS支持。这通常是通过安装相关的Webpack加载器和修改`next.config.js`文件来实现的。

首先，安装`less`和`less-loader`：

```bash
npm install less less-loader
```

然后，在项目根目录创建或更新`next.config.js`文件，自定义Webpack配置：

```js
// next.config.js
const withLess = require('@zeit/next-less');
module.exports = withLess({
  webpack(config, options) {
    return config;
  }
});
```

**注意：** 由于Next.js和相关工具的版本更新，配置可能会有所不同。建议查阅官方文档或相关包的文档获取最新的配置方法。

使用此配置后，就可以在Next.js项目中导入`.less`文件了，就像使用CSS模块一样。





## 头部定制

在Next.js中，可以使用内置的`Head`组件来定制各个页面的`<head>`标签部分。这个组件允许为每个页面添加自定义的元数据，比如页面标题、描述、关键字等，从而提升SEO性能和用户体验。`Head`组件是来自`next/head`。

### 使用`Head`组件定制页面的`<head>`

在页面文件中，导入`Head`组件并在组件内部使用它来定义想要添加到`<head>`中的元素。

```jsx
// pages/your-page.js
import Head from 'next/head';

export default function YourPage() {
  return (
    <>
      <Head>
        <title>你的页面标题</title>
        <meta name="description" content="你的页面描述" />
        <link rel="icon" href="/favicon.ico" />
        // 你可以根据需要添加更多的元素
      </Head>
      {/* 页面内容 */}
      <h1>Hello, Next.js</h1>
    </>
  );
}
```

### 示例：动态标题

也可以根据页面的内容动态更改`<head>`中的内容。例如，如果页面标题取决于从API获取的数据或是某种动态内容，可以这样做：

```jsx
import Head from 'next/head';

export default function DynamicTitlePage({ title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="动态页面描述" />
      </Head>
      {/* 页面内容 */}
      <h1>{title}</h1>
    </>
  );
}

// 假设这是你获取动态内容的函数
export async function getServerSideProps() {
  // 你的数据获取逻辑
  const title = "动态标题示例";
  return {
    props: { title }, // 将标题作为prop传递给页面组件
  };
}
```

通过使用`Head`组件，可以轻松地为每个页面设置个性化的SEO标签和其他重要的元数据。这对于提高网站的可发现性和用户体验至关重要。记住，`Head`组件可以在应用的任何页面中使用，甚至可以在组件中使用，以便为特定组件添加特定的元数据。





## 生命周期函数

在React组件的所有生命周期的基础上，额外补充了。其中getInitialProps函数在初始化组件props属性时被调用的，只在服务器端运行，且没有跨域限制。且不能用于子组件上，不能用在页面组件上。

传递给该函数的参数：

- pathname
- query
- asPath
- req
- res











# 珠峰nextjs

服务端渲染框架，支持同构。

- 同构：项目即支持客户端渲染，又支持服务器端渲染，静态生成
- 客户端渲染（SPA）缺点
  - 首屏速度加载慢
  - 不支持SEO和搜索引擎优化
  - 首页需要通过请求初始化数据



单页面应用的工作流程：

客户端请求服务器，服务器首先返回包含js脚本的一个非常简单的html，客户端收到html解析html并加载js等其他资源，然后再执行加载完成的js脚本进行页面渲染。



SSR应用的工作流程：

客户端请求服务器，服务器获取数据后和html进行结合，将合成的html发给客户端，客户端直接解析渲染就可以了。对于一些事件绑定，再去请求js回来执行进行绑定即可，和解析展示html不冲突。优势：

- 首屏速度加载变快

- 支持SEO和搜索引擎优化
- 首页需要的初始化数据可以交给后台处理



<img src="http://img.zhufengpeixun.cn/renderflow.png" alt="renderflow" style="zoom:200%;" />



- [Next.js英文文档](https://nextjs.org/docs),[Next.js中文文档](https://nextjs.frontendx.cn/docs/) 是一个轻量级的 React 服务端渲染应用框架
- 默认支持服务端渲染
- 自动根据页面进行代码分割
- 基于页面的客户端路由方案
- 基于 Webpack 的开发环境，支持热模块替换
- 可以跟`Koa`或者其它`Node.js`服务器进行集成
- 支持 Babel 和 Webpack 的配置项定制
- 静态文件服务 public



```bash
yarn add --dev react  react-dom  next axios redux react-redux express  body-parser  cors express-session connect-mongo mongoose koa koa-router
```



package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```





## 页面

- 以 ./pages作为服务端的渲染和索引的根目录
- pages 是 next.js 中非常重要的一个目录，其中每一个 js 文件就代表一个页面，都导出一个react组件，但是有两个例外，`_app.js` 和 `_document.js`
- next.js会将pages下的js文件根据其路径名和文件名自动生成对应的路由
- `pages`组件代码自动分割
- next.js项目运行之后会自动生成`.next`目录



以调试的方式启动package.json中的script脚本命令：

launch.json：

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": ["run-script", "dev"],
      "runtimeExecutable": "npm",
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}

```





下面是一个基本nextjs项目目录结构

<img src="C:\Users\dukkha\Desktop\learn-notes\React\images\image-20240309191025201.png" alt="image-20240309191025201" style="zoom:150%;" />





当执行npm run dev后，会在项目根目录下生成一个.next目录，其中.next/server/pages下的文件其实就对应项目根目录下的pages中的一个个的js文件，但是其中的几个下划线开头的文件是nextjs默认就会有的。

其中客户端访问时才会懒编译生成页面对对应的.next/server/pages下的同名js文件，比如上图中已经访问过index.jsx页面了而没有访问过user.jsx，所以.next/server/pages下才只有index.js而没有user.js，如果这时客户端再访问/user路径，则.next/server/pages下也会生成user.js文件（**懒编译**）。





## 样式

nextjs默认支持样式，现在不需要配置就能直接支持css.less.scss等，也可以使用styled-components。

- 绑定 `styled-jsx` 来生成独立作用域的 `CSS`
- 支持本地和全局`css`
- 

###  pages/_app.js

- `App`组件是每个页面的根组件，页面切换时 App 不会销毁，但是里面的页面组件会销毁，因此可以利用这个来设置全局属性和样式
- 一旦重写以及后续修改了一个_app.js文件后，都需要重新启动项目
- 全局 css 只能写在这里，否则会报错
  - 当页面变化时保持页面布局
  - 当路由变化时保持页面状态
  - 注入额外数据到页面里



```jsx
import App, { Container } from 'next/app';
import Link from 'next/link';  // 声明式导航
import _appStyle from './_app.module.css';  // 模块化css
import '../styles/global.css';  // 全局css

// LayoutApp可以理解为整个应用的布局组件
class LayoutApp extends App {
  render() {
    let { Component } = this.props;  // Component就是指代具体pages下面的页面组件
    return (
      <div>
        <style jsx>
          // 作用域内样式
          {
            `li{
               display:inline-block;
               margin-left:10px;
               line-height:31px;
             }`
          }
        </style>
        <div>
          <header>
            <img src="/images/jglogo.png" className={_appStyle.logo}/>
            <ul>
              <li><Link href="/"><a>首页</a></Link></li>
              <li><Link href="/user" ><a>用户管理</a></Link></li>
              <li><Link href="/profile"><a>个人中心</a></Link></li>
            </ul>
          </header>
          <Component />
          <footer style={{ textAlign: 'center' }} >@copyright</footer>
        </div>
      </div>
    )
  }
}
export default LayoutApp;
```



可以项目根目录下建立一个public目录，存放静态文件，比如图片（public/images/jglogo.png）等。



_app.module.css

```css
.logo{
  width: 120px;
  height: 31px;
  float: left;
}
```

css文件带module和不带module是不一样的，前者会自动开启css模块化。



styles\global.css

```css
html,
body {
  padding: 0;
  margin: 0;
}
```



### 路由跳转

**声明式导航**

pages\user.js：

```jsx
import Link from 'next/link'

export default function () {
  return (
    <div>
      <p>User</p>
      <Link href="/">首页</Link>
    </div>
  )
}
```



**命令式导航**

pages\profile.js：

```jsx
import router from 'next/router'

export default function () {
  return (
    <div>
      <p>User</p>
      <button onClick={() => router.back()}>返回</button>
    </div>
  )
}
```



**页面的层级结构式：_document.js=>_app.js=>具体页面.js**



一般对于SSR来说，访问的第一个页面时走服务端渲染，但是后面通过路由转换的就是客户端渲染了。





### 二级路由

layoutApp和页面组件的生命周期执行顺序。

####  后台顺序

- LayoutApp getInitialProps
- UseList getInitialProps
- LayoutApp constructor
- UseList constructor

#### 前台顺序

- 初次渲染
  - LayoutApp constructor
  - UseList constructor
- 路由切换
  - LayoutApp getInitialProps
  - UseList getInitialProps
  - UseList constructor



_app.js：

```jsx
import App from 'next/app';
import Link from 'next/link';
import _appStyle from './_app.module.css';
import '../styles/global.css';
class LayoutApp extends App{
+  static async getInitialProps({ Component, ctx }) {
+    let pageProps = {};
+    if (Component.getInitialProps)
+      pageProps = await Component.getInitialProps(ctx);
+    return { pageProps };
+  }
  render() {
+    let { Component,pageProps } = this.props;
    return (
      <div>
        <style jsx>
          {
            `li{
display:inline-block;
margin-left:10px;
line-height:31px;
}`
          }
        </style>
        <div>
          <header>
            <img src="/images/jglogo.png" className={_appStyle.logo}/>
            <ul>
              <li><Link href="/"><a>首页</a></Link></li>
+              <li><Link href="/user/list" ><a>用户管理</a></Link></li>
              <li><Link href="/profile"><a>个人中心</a></Link></li>
            </ul>
          </header>
+          <Component {...pageProps} />
          <footer style={{ textAlign: 'center' }} >@copyright 珠峰架构</footer>
        </div>
      </div>
    )
  }
}
export default LayoutApp;
```


在这段代码中，标注有`+`号的代码行是对`_app.js`文件中的`LayoutApp`类进行修改或增加功能的部分。这个文件是一个Next.js项目中的核心文件，用于初始化页面的布局和设置。具体来说：

1. `static async getInitialProps({ Component, ctx }) { ... }`
   - 这行代码定义了一个静态的异步方法`getInitialProps`，它是Next.js的一个生命周期方法，用于在服务器端渲染和客户端路由跳转之前获取并传递数据。这个方法接收一个对象作为参数，包含`Component`和`ctx`（上下文）两个属性。
   - `Component`是即将渲染的页面组件，`ctx`是一个包含各种请求相关信息的上下文对象。
   - 方法内部，首先定义了一个空对象`pageProps`，用于存储页面组件的props。如果即将渲染的页面组件定义了自己的`getInitialProps`方法，则调用该方法并等待其解析完成，将返回的props赋值给`pageProps`。
   - 最后，方法返回一个包含`pageProps`的对象，这样`pageProps`就可以被组件在渲染时使用了。
2. `let { Component, pageProps } = this.props;`
   - 这行代码通过解构赋值从组件的props中提取出`Component`和`pageProps`。`Component`是要渲染的页面组件，`pageProps`是通过`getInitialProps`方法获取的页面专有的props。
   - 这样做的目的是使得每个页面组件都能接收到自己专有的props，便于在组件内部使用。
3. `<li><Link href="/user/list" ><a>用户管理</a></Link></li>`
   - 这行代码添加了一个新的列表项和链接到导航中，使得用户可以通过点击“用户管理”链接跳转到`/user/list`路径对应的页面。`Link`组件是Next.js提供的，用于客户端的页面导航。
4. `<Component {...pageProps} />`
   - 这行代码的作用是渲染当前路由对应的页面组件，并将`pageProps`作为props传递给该组件。这样，每个页面组件都能接收到其需要的数据和属性，实现数据的预加载和传递。

总的来说，这些带有`+`号的代码行使得这个Next.js项目能够在服务端获取页面所需的数据，并通过props传递给页面组件，在客户端实现无刷新的页面跳转，并且添加了用户管理的导航链接。



### 二级布局

二级路由的布局组件：

pages/user/layout.js

```jsx
import Link from 'next/link';

function UserLayout(props) {
  return (
    <div>
      <div>
        <ul>
          <li><Link href="/user/list"><a>用户列表</a></Link></li>
          <li><Link href="/user/add"><a>添加用户</a></Link></li>
        </ul>
        <div>
          {props.children}
        </div>
      </div>
    </div>
  )
}
export default UserLayout;
```



pages\user\list.js：

```jsx
import Link from 'next/link';
import UserLayout from './layout';

UseList.getInitialProps = async (ctx) => {
  let list = [{ id: 1, name: '张三'}, { id: 2, name: '李四'}];
  return { list };
}
function UseList(props) {
  return (
    <UserLayout>
      <ul>
        {
          props.list.map((user)=>(
            <li key={user.id}>
              <Link href={`/user/detail/${user.id}`}>{user.name}</Link>
            </li>
          ))
        }
      </ul>
    </UserLayout>
  )
}

export default UseList;
```



pages\user\add.js:

```jsx
import Link from 'next/link';
import UserLayout from './layout';
import React from 'react';
function UserAdd(props) {
  let nameRef = React.useRef();
  let passwordRef = React.useRef();
  let handleSubmit  = (event)=>{
    event.preventDefault();
    let user = {name:nameRef.current.value,password:passwordRef.current.value};
    console.log('添加',user);
  }
  return (
    <UserLayout>
      <form onSubmit={handleSubmit}>
        用户名:<input  ref={nameRef}/>
        密码:<input  ref={passwordRef}/>
        <button type="submit">添加</button>
      </form>
    </UserLayout>
  )
}

export default UserAdd;
```



pages\user\detail\\[id].js:

```jsx
import React from 'react';
import UserLayout from '../layout';

function UserDetail(props) {
  return (
    <UserLayout>
      <p>ID:{props.user.id}</p>
    </UserLayout>
  )
}
UserDetail.getInitialProps = async (ctx) => {
  return { user:{id:ctx.query.id}};
}
export default UserDetail;
```



### 调用接口













