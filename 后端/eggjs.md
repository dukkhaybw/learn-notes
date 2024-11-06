目录如何建立

文件如何划分





## 动态CMS系统

后台内容管理系统，用户，角色，权限等。

- 后端：eggjs+ mysql
- 前端：umi4 + ant design proV5 + formily



动态：数据库的表，数据库中的字段，界面的布局是在前端可以配置的，展示的时候根据前台配置的字段进行，编译的方式和布局去渲染页面。



## 前置知识

### 模板引擎

选择nunjucks模板引擎。

Nunjucks是Mozilla开发的一个纯JavaScript编写的模板引擎，既可以用在Node环境下，又可以运行在浏览器端。



为什么使用模板引擎？

动态CMS系统中很多东西都是动态的，包括代码的动态生成，数据库表的动态生成。他们都需要借助模板引擎去实现。

使用模板引擎和AST去动态生成代码和修改代码。



```shell
npm install nunjucks
```



#### 渲染字符串

```js
let nunjucks=require('nunjucks');

nunjucks.configure({autoescape: true});
let ret = nunjucks.renderString('hello {{username}}',{username: 'zfpx'});

console.log(ret);
```



#### 渲染文件

- views是一个文件夹
- view目录必须创建在根目录下

```js
let nunjucks=require('nunjucks');

nunjucks.configure('views',{autoescape:true});
let ret2 = nunjucks.render('index.html',{username: 'zfpx'});

console.log(ret2);
```



views\index.html

```js
hello {{username}}
```





#### 和express集成

```js
let express=require('express');
const nunjucks=require('nunjucks');
const path=require('path');

let app=express();

nunjucks.configure(path.resolve(__dirname,'views'),{
    autoescape: true,  // 自动转译一些特殊字符，比如script标签
    express:app
});

app.get('/',function (req,res) {
    res.render('index.html',{name:'zfpx'});
});

app.listen(8080);
```







#### 语法

##### 变量

变量会从模板上下文获取，如果你想显示一个变量可以：

```js
{{ username }}
```



##### 过滤器

过滤器是一些可以执行变量的函数，通过管道操作符 (|) 调用，并可接受参数，也可以级联多个过滤器。

```js
let nunjucks=require('nunjucks');
nunjucks.configure({autoescape: true});

let ret=nunjucks.renderString(`
{{ names | join(",") }}
`,{names: ['name1','name2']});
console.log(ret);

let ret2=nunjucks.renderString(`
{{word | replace("world", "there") | capitalize}}
`,{word:'hello world'});
console.log(ret2);
```



##### if

if 为分支语句，与 javascript 中的 if 类似。

```js
let nunjucks=require('nunjucks');
nunjucks.configure({autoescape: true});
let ret=nunjucks.renderString(`
{% if score > 90 %}
 优
{% elseif score>80 %}
 良
{% elseif score>70 %}
 中
{% elseif score >60 %}
 及格
{% else %}
 不及格
{% endif %}
`,{score:79});
console.log(ret);
```



##### for

for 可以遍历数组 (arrays) 和对象 (dictionaries)。

```js
let nunjucks=require('nunjucks');
nunjucks.configure({autoescape: true});
let ret=nunjucks.renderString(`
<ul>
 {% for item in items %}
   <li>{{loop.index}} {{item.id}}:{{item.name}}</li>
   {% endfor %}
</ul>
`,{items: [{id:1,name:'zfpx1'},{id:2,name:'zfpx2'}]});
console.log(ret);
```

- loop.index: 当前循环数 (1 indexed)
- loop.index0: 当前循环数 (0 indexed)
- loop.revindex: 当前循环数，从后往前 (1 indexed)
- loop.revindex0: 当前循环数，从后往前 (0 based)
- loop.first: 是否第一个
- loop.last: 是否最后一个
- loop.length: 总数





##### 模板继承

- 模板继承可以达到模板复用的效果，当写一个模板的时候可以定义 "blocks"，子模板可以覆盖他

- 同时支持多层继承。

  

  **index.js**

  ```js
  let nunjucks=require('nunjucks');
  const path=require('path');
  
  nunjucks.configure(path.resolve(__dirname,'views'),{autoescape:true});
  let ret2 = nunjucks.render('login.html',{name: 'zfpx'});
  
  console.log(ret2);
  ```

  

  **layout.html**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>layout模板</title>
  </head>
  <body>
    <h1>我是头</h1>
    {% block content%}
      我是layout模板的内容name= {{name}}
    {% endblock%}
    <h1>我是尾</h1>
  </body>
  </html>
  ```

  

  **login.html**

  ```html
  {% extends "layout.html" %}
  
  {% block content%}
  <form action="">
      用户名 <input type="text">
  </form>
  {% endblock%}
  ```

  

##### 包含

include 可引入其他的模板，可以在多模板之间共享一些小模板，如果某个模板已使用了继承那么 include 将会非常有用。

**index.js**

```js
let nunjucks=require('nunjucks');
const path=require('path');
nunjucks.configure(path.resolve(__dirname,'views'),{autoescape:true});
let ret2=nunjucks.render('items.html',{items: [{id:1,name:'zfpx1'},{id:2,name:'zfpx2'}]});
console.log(ret2);
```

**items.html**

```html
{% extends "layout.html" %}

{% block content %}
      <ul>
          {% for item in items %}
          {% include "item.html" %}
        {% endfor %}  
      </ul>
{% endblock %}
```

**item.html**

```html
<li>{{item.id}}:{{item.name}}</li>
```





### Mock



#### 什么是Mock

- Mock其实就是真实数据存在之前，即调试期间的代替品



#### 如何Mock数据？

- 最low的方式将 Mock 数据写在代码里、json文件里；
- 利用 Charles 、Fiddler等代理工具，将 URL 映射到本地文件；
- 本地起 Mock Server，即mockjs，每次修改了后还要重启服务



#### Mock语法

- [mockjs](http://mockjs.com/examples.html)

| 占位符     | 含义                                                         |
| :--------- | :----------------------------------------------------------- |
| @ip        | 随机输出一个IP                                               |
| @id        | 随机输出长度18的字符，不接受参数                             |
| array/1-10 | 随机输出1-10长度的数组，也可以直接是固定长度                 |
| object/2   | 输出一个两个key值的对象                                      |
| @image()   | 返回一个占位图url，支持size, background, foreground, format, text |
| @cname     | 生成一个中文名                                               |
| @datetime  | 生成一个随机的时间                                           |

```js
let Mock = require('mockjs');
let result = Mock.mock({
    "code": 0,
    "message": "请求成功",
    "data|20": [{
        "id":"@id",
        "ip":"@ip",
        "name": "@cname",
        "userId": "@id",
        "stars|2":['★'],
        "colors|2":{red:'red',yellow:'yellow',blue:'blue'},
        "avatar":"@image()",
        "createAt": "@datetime"
    }]
})
console.log(result);
```



#### easy-mock

- [easy-mock](https://easy-mock.com/)
- Easy Mock就是一个在线创建mock的服务平台，帮你省去你 配置、安装、起服务、维护、多人协作Mock数据不互通等一系列繁琐的操作



#### 基本用法

```js
{
  "data|5": [{
    "id|1-1000": 1,
    "title": "@csentence",
    "url": "@url",
    "image": "@image(300x200)",
    "createAt": "@datetime"
  }],
  "code": 0
}
```



#### 高阶用法

| 对象             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| Mock             | Mock 对象                                                    |
| _req.url         | 获得请求 url 地址                                            |
| _req.method      | 获取请求方法                                                 |
| _req.params      | 获取 url 参数对象                                            |
| _req.querystring | 获取查询参数字符串(url中?后面的部分)，不包含 ?               |
| _req.query       | 将查询参数字符串进行解析并以对象的形式返回，如果没有查询参数字字符串则返回一个空对象 |
| _req.body        | 当 post 请求以 x-www-form-urlencoded 方式提交时，我们可以拿到请求的参数对象 |
| …                | _req.cookies、ip、host等等 [docs](https://easy-mock.com/docs) |

```js
GET /mock/5cfa0f3b9a819c502224e47f/news?%3Fcode=0&name=zhufeng HTTP/1.1
Accept: application/json, */*
Content-Type: application/json
//简单模拟登录，根据用户传入的参数，返回不同逻辑数据
{
  success: true,
  data: {
    name: function({
      _req
    }) {
      return _req.query.name;
    },
    code: function({
      _req
    }) {
      return _req.query.code ? 0 : 1;
    },
    data: function({
      _req,
      Mock
    }) {
      return {
        token: Mock.mock("@guid()"),
        userId: Mock.mock("@id(5)"),
        cname: Mock.mock("@cname()"),
        name: Mock.mock("@name()"),
        avatar: Mock.mock("@image(200x100, #FF6600)")
      }
    }
  }
}
```

#### 在线调试

- [在线调试](https://easy-mock.com/mock/5a0aad39eace86040209063d/pjhApi_1510649145466/api/common/logins#!method=post)







## eggjs

- [egg.js](https://eggjs.org/zh-cn/intro/)
- 提供基于 Egg 定制上层框架的能力
- 高度可扩展的插件机制
- 内置多进程管理
- 基于 Koa 开发，性能优异
- 框架稳定，测试覆盖率高
- 渐进式开发



### 目录结构

```js
├── package.json
├── app.js (app.js 和 agent.js 用于自定义启动时的初始化工作)
├── agent.js (可选)
├── app
|   ├── router.js(用于配置 URL 路由规则)
│   ├── controller(用于解析用户的输入，处理后返回相应的结果)
│   |   └── home.js
│   ├── service (用于编写业务逻辑层，可选)
│   |   └── user.js
│   ├── middleware (用于编写中间件，可选)
│   |   └── response_time.js
│   ├── schedule (用于定时任务，可选)
│   |   └── my_task.js
│   ├── public (用于放置静态资源，可选)
│   |   └── reset.css
│   ├── extend (用于框架的扩展，可选)
│   |   └── application.js app 对象指的是 Koa 的全局应用对象，全局只有一个，在应用启动时被创建。
│       ├── context.js (Context 指的是 Koa 的请求上下文，这是 请求级别 的对象)
│       ├── request.js (Request 对象和 Koa 的 Request 对象相同，是 请求级别 的对象)
│       ├── response.js (Response 对象和 Koa 的 Response 对象相同，是 请求级别 的对象)
│       ├── helper.js (Helper 函数用来提供一些实用的 utility 函数)
│   ├── view (用于放置模板文件)
│   |   └── home.tpl
├── |── model (用于放置领域模型)
│   |   └── home.tpl
│   └── extend (用于框架的扩展)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config(用于编写配置文件)
|   ├── plugin.js(用于配置需要加载的插件)
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test(用于单元测试)
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```











