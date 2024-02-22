使用vite创建项目

```bash
create-vite 
```

hash路由的本质原理是监听window对象的hashchange事件，然后执行相应的逻辑。

browser路由的本质原理是使用H5的History API：history.pushState()和history.replaceState 结合window.onpopstate事件实现的。

**pushState方法执行并不会触发window.onpopstate事件，但是history的back，go，forward方法的执行会触发window.onpopstate事件**



纯原生的逻辑中，不管是hash模式还是browser模式，尽管执行相应的hash改变或者路由改变的方法，他们都不会刷新页面，只是单纯修改url部分或者触发一些路由相关事件。并不是说调用了history.back除了url变为上一次的路径外，页面内容也要变为该上一个对应的页面内容（但并不是刷新页面）。

如果希望页面内容也回到上一个路径对应的页面内容，需要开发者自己拦截路由改变触发的事件，在事件中再补充页面更新的代码逻辑。



pushState的第一个参数是给每个特定路径的一个自定义状态数据，PopStateEvent.state中就是pushState的第一个参数的值。



```bash
npm install react-router-dom@6
```



## 动态CMS系统

数据库中的表和字段、界面布局都是可以通过前台去配置的。

后端：egg.js+mysql

前端：umi4 + ant Design Pro + formily



模板引擎：nunjucks

为什么在动态CMS项目中使用模板引擎？在开发时，要实现动态管理，包括项目代码和数据库表都可以动态生成，为此就需要使用模板引擎和ast去动态生成代码并编辑代码。

nunjucks基本使用：

- 渲染模板字符串

```js
const nunjucks = require('nunjunks')
nunjucks.configure({autoescape:true})
let result = nunjucks.renderString(`hello {{username}}`,{username:'test'})
console.log(result) 
```

- 渲染文件

  可以配置查找模板文件所在的目录

```js
const nunjucks = require('nunjunks')
const path = require('path')
nunjucks.configure(path.resolve(__dirname,'views'), {autoescape:true})
let result = nunjucks.render('index.html',{username:'test'})
console.log(result) 
```

- 与express联用

```js
const express = require('express')
const nunjucks = require('nunjunks')
const path = require('path')

const app = express()
nunjucks.configure(path.resolve(__dirname,'views'), {
    autoescape:true,
    express:app
})

app.get('/',(req,res)=>{
    res.render('index.html',{username:'test'})
})

app.listen(3000,()=>{
    console.log('3000')
})
```





