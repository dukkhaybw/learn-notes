# Ant-design学习

## 安装

### 模块化项目中

npm install ant-design-vue --save   或者  yarn add ant-design-vue

> 组件库支持 vue 的新特性`slot-scope`, `provide / inject`

### 浏览器中

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antd`。

> 注意：引入 antd.js 前需要自行引入 [moment](http://momentjs.com/)。



## 基本使用

先安装到项目中

```
方式一：全局完整引入
import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);
//在全局将所有组件都注册完成，可以直接在该根实例下的所有后代组件中使用。具体使用方法，参考官网。


方式一：全局部分引入
import Vue from 'vue';
import { Button, message } from 'ant-design-vue';
import App from './App';
 import 'ant-design-vue/dist/antd.css';


/* v1.1.2 方式一*/
Vue.component(Button.name, Button);
Vue.component(Button.Group.name, Button.Group);

/* v1.1.3+ 自动注册Button下组件，如Button.Group */
Vue.use(Button);

Vue.prototype.$message = message;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
```

```
这种方式需要事先安装   babel-plugin-import   用于按需加载组件代码和样式的 babel 插件
npm install babel-plugin-import -D  或者
yarn add babel-plugin-import --dev
插件会帮你转换成 ant-design-vue/lib/xxx 的写法。另外此插件配合 style 属性可以做到模块样式的按需自动加载。


方式二：只加载用到的组件
在项目根目录下配置的.babelrc文件中 或者 babel-loader option文件中
{
  "plugins": [
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }] // `style: true` 会加载 less 文件
  ]
}


在入口文件main.js中按需引入，并注册到全局上：
import { DatePicker } from 'ant-design-vue';
Vue.use(DatePicker);

```

```
方式三：手动按需引入
import DatePicker from 'ant-design-vue/lib/date-picker'; // 加载 JS
import 'ant-design-vue/lib/date-picker/style/css'; // 加载 CSS
// import 'ant-design-vue/lib/date-picker/style';         // 加载 LESS

```





### 表单（form）的使用

封装好的组件：a-form