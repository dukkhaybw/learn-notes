



```js
Vue.createApp({
    template:`<div>hello world</div>`
}).mount('#app')


Vue.createApp({
    template:`<div>
    	<p>{{count}}</p>
    	<button @click='add'>+1</button>
    	<button @click='sub'>11</button>
    </div>`,
    data(){
        return {
            count:0
        }
    },
    methods:{
        add(){
            this.count++
        },
        sub(){
            this.count--
        }
    }
}).mount('#app')
```



```js
<script type='x-template' id='tem'>
    <div>
    	<p>{{count}}</p>
    	<button @click='add'>+1</button>
    	<button @click='sub'>11</button>
    </div>
</script>


Vue.createApp({
    template:`#tem`,
    data(){
        return {
            count:0
        }
    },
    methods:{
        add(){
            this.count++
        },
        sub(){
            this.count--
        }
    }
}).mount('#app')
```



```js
<template  id='tem'>
    <div>
    	<p>{{count}}</p>
    	<button @click='add'>+1</button>
    	<button @click='sub'>11</button>
    </div>
</template>


Vue.createApp({
    template:`#tem`,
    data(){
        return {
            count:0
        }
    },
    methods:{
        add(){
            this.count++
        },
        sub(){
            this.count--
        }
    }
}).mount('#app')
```



**Vue源码调试**

- github下载Vue项目

- 下载项目依赖
- npm run dev :将Vue源码项目打包生成Vue的最终文件（packages/vue/dist/vue.global.js）
- 在npm run dev 对应的脚本后面，开启 --sourcemap：然后就能实现对源文件的debugger了





**基本指令**

- {{}}

- v-once

- v-text

- v-html

- v-on（@）

  可以绑定一个对象，对象的key是不同的事件， 值是对应的处理函数。

  事件对象用$event。

- v-bind（:）
  可以动态绑定标签的属性。也可以直接将一个对象进行展开后作为· 标签属性。

- v-pre

- v-cloak

- v-if / v-else-if / v-else

- v-show

- v-model

- v-for





vite

vite build

vite preview







标签的静态class和:calss可以结合使用，也可以和方法结合使用。



## 项目搭建

系统管理：

- 用户管理：用户有某个角色，角色有不同的菜单权限

- 部门管理：用户属于某一个部门

- 菜单管理：

- 角色管理：不同角色可以分配不同的菜单权限

  



 

vue create projectName

![image-20220210153619196](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220210153619196.png)



使用babel处理ts语法，对ts的编译有两种方式，一种通过typescript工具的tsc命令； 用babel编译ts同时还会使用polyfill对代码打补丁。

### 代码规范

editorConfig+prettier+ESLint

Commitizen+Commitlint+husky

#### 编辑器格式化

不同编辑器的编码风格——.editorconfig配置（应对不同操作系统，不同编辑器）

在项目的根目录下创建闻文件：.editorconfig

一般的内容：

```yaml
 # http://editorconfig.org

root = true    # 表示文件所在目录就是项目的根目录

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

在webstorm中，编辑环境会自动检测并使用项目根目录下的.editorconfig文件，但是在vscode中需要借助插件——EditorConfig for VS Code，该插件会自动读取并使用项目根目录下的.editorconfig文件。



#### 代码自动格式化

支持对js，ts，css，less，scss，vue，react，json，md，jsx进行格式化。

在项目中安装prettier

```shell
npm install prettier -D
```

在项目的根目录下创建文件——.prettierrc

一般文件的内容有：

```
{
	"trailingComma": "none",
	"tabWidth": 2,
	"semi": true,
	"singleQuote": true,
	"endOfLine": "lf",
	"printWidth": 100,
	"bracketSpacing": true, //在对象字面量声明所使用的的花括号后（{）和前（}）输出空格 
	"arrowParens": "always",
	"useTabs": false
}
```

配置项说明：

* useTabs：使用tab缩进还是空格缩进；false表示使用空格作为缩进
* tabWidth：tab是空格的情况下是几个空格；
* printWidth：当行字符的长度；
* singleQuote：使用单引号还是双引号；
* trailingComma：在多行输入的尾逗号是否添加；
* semi：语句末尾是否要加分号，默认值true，选择false表示不加；



.prettierignore的格式化忽略文件：

````
/dist/*
/build/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
````



在vscode中还需要安装prettier插件，在vscode编辑器开启自动保存并格式化功能的时候，保存单个文件时prettier就会自动化堆该个文件进行格式化。

![image-20220406233014566](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220406233014566.png)

如果想对整个项目的文件进行自动格式化，则可以在npm脚本中配置：

```json
"prettier": "prettier --write ."  
```



#### 代码编码规范

vscode安装eslint插件

在prettier和eslint并存时，存在两者的代码规范冲突的情况，需要安装第三方包解决冲突：

```shell
npm i eslint-plugin-prettier eslint-config-prettier -D  
```

修改在项目的根目录下文件——.eslintrc.js

```js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [   // 规范集
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'plugin:prettier/recommended'  // +++++++++++++++++++++++++++++++++++++
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {   // 对特定规则进行开关
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
```



#### 代码git管理规范

git Husky 和 eslint。

在执行 `git commit ` 命令的时候对项目进行校验和自动格式化（每次提交前我们都要对代码进行格式化以及 `eslint` 和 `stylelint` 的规则校验），如果不符合eslint规范，那么自动通过规范进行修复，通过Husky工具，修复后进行提交。

husky是一个git hook工具，可以帮助我们触发git提交的各个阶段：pre-commit、commit-msg、pre-push

自动配置命令：

```
npx husky-init "&&" npm install   // windows下&&用引号包裹才生效
```

上面命令行执行的任务有：

- 安装husky 为项目开发依赖


![image-20220201214123038](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220201214123038.png)

- 在项目目录下创建 `.husky` 文件夹，在提交（git commit -m 'xxxx'）之前会执行npm run lint脚本

  ![image-20220201214155109](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220201214155109.png)

- 在package.json中添加一个脚本，husky包自行使用的，开发者不用管

  ![image-20220201214220796](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220201214220796.png)

在之后的项目提交commit时，git会先读取pre-commit文件内容，并执行文件中指定的script脚本命令 ——npm run lint。修复代码规范问题后才能提交成功。



对 git 缓存区最新改动过的文件进行以上的格式化和 lint 规则校验。执行 `git commit` 之前的钩子 `pre-commit` ，借助这个钩子我们就能执行 `lint-staged` 所提供的代码文件格式化及 lint 规则校验。

```
npm install husky lint-staged -D
```

package.json:

```json
"lint-staged": {
    "*.{ts,tsx,js}": [
      "eslint --config .eslintrc.js"
    ],
    "*.{css,less,scss}": [
      "stylelint --config .stylelintrc.js"
    ],
    "*.{ts,tsx,js,json,html,yml,css,less,scss,md}": [
      "prettier --write"
    ]
  },

```

![image-20220503183541310](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220503183541310.png)





> Starting with v3.1 you can now use different ways of configuring lint-staged:
>
> - `lint-staged` object in your `package.json`
>
> - .lintstagedrc 
>
>   file in JSON or YML format, or you can be explicit with the file extension:
>
>   - `.lintstagedrc.json`
>   - `.lintstagedrc.yaml`
>   - `.lintstagedrc.yml`
>
> - .lintstagedrc.mjs or lint-staged.config.mjs file in ESM format
>
>   - the default export value should be a configuration: `export default { ... }`
>
> - .lintstagedrc.cjs  or  lint-staged.config.cjs file in CommonJS format
>
>   - the exports value should be a configuration: `module.exports = { ... }`
>
> - `lint-staged.config.js` or `.lintstagedrc.js` in either ESM or CommonJS format, depending on whether your project's *package.json* contains the `"type": "module"` option or not.
>
> - Pass a configuration file using the `--config` or `-c` flag









#### 项目git提交备注规范

vue开源项目的提交备注规范，这样可以快速定位每次提交的内容，方便之后对版本进行控制。

![image-20220201215036807](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220201215036807.png)



在开发项目时，并不建议通过命令行的方式来编写提交备注

```shell
git commit -m 'xxx:xxxxxxxxxxxxxxxxx'
```

为此可以借助一个第三方工具——Commitizen（Commitizen 是一个帮助编写规范 commit message 的工具）

```shell
npm install commitizen -D
```

安装cz-conventional-changelog，初始化cz-conventional-changelog:

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

上面的命令行所做的事：

![image-20220202093025999](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093025999.png)

并且在package.json中进行配置，之后在执行工具命令的时候，会读取该path路径下的工具：

![image-20220202093108387](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093108387.png)



使用commitizen进行代码的规范提交——npx cz

* 第一步是选择type，本次更新的类型

| Type     | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| feat     | 新增特性 (feature)                                           |
| fix      | 修复 Bug(bug fix)                                            |
| docs     | 修改文档 (documentation)                                     |
| style    | 代码格式修改(white-space, formatting, missing semi colons, etc) |
| refactor | 代码重构(refactor)                                           |
| perf     | 改善性能(A code change that improves performance)            |
| test     | 测试(when adding missing tests)                              |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等） |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具(比如更改测试环境)                     |
| revert   | 代码回退                                                     |

- 本体提交编辑项目的类型

![image-20220202093531681](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093531681.png)



* 第二步选择本次修改的范围（作用域，提示本次编辑修改的是项目的哪个模块）

![image-20220202093625650](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093625650.png)

* 第三步选择提交的信息

![image-20220202093643162](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093643162.png)

* 第四步提交详细的描述信息

![image-20220202093704386](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093704386.png)

* 第五步是否是一次重大的更改

![image-20220202093718425](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093718425.png)

* 第六步是否影响某个open issue

![image-20220202093734087](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093734087.png)

我们也可以在scripts中构建一个命令来执行 cz：

![image-20220202093843737](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220202093843737.png)

####   强制git命令行规范

[commitlint](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fconventional-changelog%2Fcommitlint) 可以帮助我们进行 git commit 时的 message 格式是否符合规范，

按照cz来规范了提交风格，但是依然可以通过 `git commit` 命令行方式按照不规范的格式提交，为此的强制解决方案：

* 通过commitlint来限制提交；

1.安装 @commitlint/config-conventional 和 @commitlint/cli

```shell
npm i @commitlint/config-conventional @commitlint/cli -D
```

2.在根目录创建commitlint.config.js文件，配置commitlint

```js
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['build', 'ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'anno']
        ]
    }
}

/**
 * build : 改变了build工具 如 webpack
 * ci : 持续集成新增
 * chore : 构建过程或辅助工具的变动
 * feat : 新功能
 * docs : 文档改变
 * fix : 修复bug
 * perf : 性能优化
 * refactor : 某个已有功能重构
 * revert : 撤销上一次的 commit
 * style : 代码格式改变
 * test : 增加测试
 * anno: 增加注释
 */

```

3.使用husky生成commit-msg文件，验证提交信息：

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

![image-20220503183951754](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220503183951754.png)

配置上面的git提交信息强制规范后，在命令行中通过git commit -m 'xxxxxxxxx'方式提交时，不满足使用commitizen进行代码的规范提交，将无法提交。

配置提交脚本命令：

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "prettier": "prettier --write .",
    "prepare": "husky install",
    "commit": "cz"   // 告诉组员以后提交时，不再使用git commit -m 'xxxx',而使用npm run commit提交
  },
```

#### conventional-changelog

项目的开发可以根据规范的提交说明快速生成开发日志，从而方便开发者或用户追踪项目的开发信息和功能特性。[conventional-changelog](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fconventional-changelog%2Fcommitlint) 可以帮助我们快速生成 `changelog`

npm install conventional-changelog-cli -D

package.json:

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
  },
}
```











### 项目webpack配置

vue.config.js有三种配置方式：

* 方式一：直接通过CLI提供给我们的选项来配置：
  * 比如publicPath：配置应用程序部署的子目录（默认是 `/`，相当于部署在 `https://www.my-app.com/`）；
  * 比如outputDir：修改输出的文件夹；
* 方式二：通过configureWebpack修改webpack的配置：
  * 可以是一个对象，直接会被合并；
  * 可以是一个函数，会接收一个config，可以通过config来修改配置；
* 方式三：通过chainWebpack修改webpack的配置：
  * 是一个函数，会接收一个基于  [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的config对象，可以对配置进行修改；

```js
module.exports = {
    // outputDir:'',  //配置方式一，由vue cli自身提供的代表webpack配置文件中的某项
    
    
    // configreWebpack:{   //配置方式二：和webpack中的配置属性一样，之后进行合并
    //   resolve:{
	// 		alias:{
    //		  component:'@/component'
	//		}    
	//	}
	//}
    
    
    // 配置方式三,将基础的webpack配置对象传给该函数，在函数内部进行覆盖式修改
    configureWebpack:(config)=>{
        consfig.reslove.alias ={
            //.....
        }
    }
    
    
    //配置方式四
    chainWebpack:(config)=>{
        config.resolve.alias.set('x',url).set('xxx',url)
    }
}





const path = require('path')

module.exports = {
  outputDir: './build',
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       views: '@/views'
  //     }
  //   }
  // }
  // configureWebpack: (config) => {
  //   config.resolve.alias = {
  //     '@': path.resolve(__dirname, 'src'),
  //     views: '@/views'
  //   }
  // },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src')).set('views', '@/views')
  }
}
```



### vue-router配置

```shell
npm install vue-router 
```



```ts
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';  //type 表示引入的是TS的类型，而不是别的什么函数，type可以省略

const routes: RouteRecordRaw[] = [   // 使用一个接口，限制routes的属性和配置
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/main',
    component: () => import('@/views/main/main.vue')
  }
];

const router = createRouter({
  routes,
  history: createWebHashHistory()   //hashHistory模式
});

export default router;

```



### vuex配置

```shell
npm install vuex 
```

```ts
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      message: 'hello'
    };
  }
});

export default store;

```



main.ts:

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // vue-router
import store from './store';   //vuex

createApp(App).use(router).use(store).mount('#app');

```



### element-plus

组件库安装：

```shell
npm install element-plus
```

完整引入:

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';   // +++++++++++++++++++++++++++
import 'element-plus/dist/index.css';   // +++++++++++++++++++++++++++

createApp(App)
    .use(router)
    .use(store)
    .use(ElementPlus) //+++++++++++++++
    .mount('#app');
```







自动导入:

- 自动引入element-plus2

```shell
npm install -D unplugin-vue-components unplugin-auto-import @element-plus/icons-vue
```

- vue.config.js

  ```js
  const AutoImport = require('unplugin-auto-import/webpack')
  const Components = require('unplugin-vue-components/webpack')
  const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
  
  module.exports = {
    configureWebpack: {
      plugins: [
        AutoImport({
          resolvers: [ElementPlusResolver()]
        }),
        Components({
          resolvers: [ElementPlusResolver()]
        })
      ]
    }
  }
  ```

按需引入缺少样式，引入样式的方式：

- 全部样式

  ````ts
  // 项目入口main.ts
  import 'element-plus/dist/index.css';
  ````



运行时，会自动生成auto-imports.d.ts和components.d.ts文件导入组件

使用：

```vue
<template>
  <div>
    <h2>{{ $store.state.message }}</h2>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// 直接使用，无需引入后注册 	

export default defineComponent({
  setup() {
    return {};
  }
});
</script>

<style scoped></style>
```



element-plus中字体图标的引用使用需要在使用字体图标的组件中引入对应的字体图标组件并注册，然后具体的使用是：

```vue
<template>
  <div class="login-container">
    <h1>后台管理系统</h1>
    <el-tabs type="border-card" stretch>
      <el-tab-pane>
        <template #label>
          <span>
              <-- 使用字体图标篇-->
            <el-icon><Avatar /></el-icon>账号登录
          </span>
        </template>
        <login-account></login-account>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span>
              <-- 使用字体图标篇-->
            <el-icon><iphone /></el-icon>手机登录    
          </span>
        </template>
        <login-phone></login-phone>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Avatar, Iphone } from '@element-plus/icons-vue';  //引入字体图标
import loginAccount from './components/login-account.vue';
import loginPhone from './components/login-phone.vue';

export default defineComponent({
  name: 'Login',
  components: {
    Avatar,  // +++++++++++++++
    Iphone,  // +++++++++++++++
    loginAccount,
    loginPhone
  },
  setup() {
    return {};
  }
});
</script>

<style scoped lang="scss"></style>
```



### axios

```shell
npm install axios
```

项目由多个功能模块，可以为每个模块都创建一个axios实例。

axios.ts

```ts
import axios from 'axios';

import { ElLoading } from 'element-plus';

import type { AxiosInstance } from 'axios';
import type { IRequestInterceptors, IRequestConfig, ILoading } from './type';

class IRequest {
  instance: AxiosInstance;
  interceptors?: IRequestInterceptors;
  loading?: ILoading;
  isLoading?: boolean;
  constructor(config: IRequestConfig) {
    this.instance = axios.create(config); // 每次new时都创建一个新的axios实例并设置基础配置
    this.interceptors = config.interceptors;
    this.isLoading = config.isLoading ? true : false;

    // 公共请求拦截器，写在此处将后于实例特有的拦截器之后执行 ，建议写在特有拦截器后面
    // 公共响应拦截器，写在此处将后于实例特有的拦截器之后执行

    // 对应实例独有的请求拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestInterceptor,
      config.interceptors?.requestInterceptorCatch
    );

    // 实例独有的响应拦截器
    this.instance.interceptors.response.use(
      config.interceptors?.responseInterceptor,
      config.interceptors?.responseInterceptorCatch
    );

    // 公共请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (this.isLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
            fullscreen: true
          });
        }
        return config;
      },
      (error) => {
        console.log('公共请求失败拦截');
        return error;
      }
    );

    // 公共响应拦截器
    this.instance.interceptors.response.use(
      (result) => {
        // http请求成功服务器内部错误拦截
        this.loading?.close();
        if (result.status >= 200 && result.status < 300) {
          const serveCode = result.data.state;
          if (serveCode == 1) {
            console.log('服务器内部错误：1');
          } else if (serveCode == 2) {
            console.log('服务器内部错误：2');
          } else if (serveCode == 3) {
            console.log('服务器内部错误：3');
          } else {
            return result.data;   //   其中的result的数据格式是AxiosResponse，而result.data不是了。
          }
        }
      },
      (error) => {
        // http请求失败拦截
        const status = error.response.status;
        if (status == 404) {
          console.log('http请求失败：404，请求的资源不存在');
        } else if (status == 500) {
          console.log('http请求失败：500');
        } else if (status == 300) {
          console.log('http请求失败：300');
        }
        this.loading?.close();
        return error;
      }
    );
  }

  // 采用自己扩展的IRequestConfig接口，实现单个请求可传递拦截器函数
  request<T>(config: IRequestConfig<T>): Promise<T> {
    // 单个请求的拦截器设置
    if (config.interceptors?.requestInterceptor) {
      config = config.interceptors.requestInterceptor(config);
    }

    // 单个请求是否添加loading
    if (config.isLoading) {
      this.isLoading = true;
    }
    return new Promise((resolve, reject) => {
      // 在用实例进行网络请求时，可以传入自定义的请求配置项
      this.instance
        .request<any, T>(config)
        .then((data) => {
          if (config.interceptors?.responseInterceptor) {
            data = config.interceptors.responseInterceptor(data);
          }
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    });
  }
  get<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }
  post<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }
  delete<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }
  put<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' });
  }
  patch<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }
}

export default IRequest;
```

config.ts

```ts
let BASE_URL = '';
const BASE_TIME = 5000;

if (process.env.NODE_ENV === 'development') {
  BASE_URL = '/api'; // 协议和域名直接走代理
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = '';
} else {
  BASE_URL = '';
}

export { BASE_URL, BASE_TIME };
```

index.ts

```ts
import IRequest from './axios';
import { BASE_URL, BASE_TIME } from './config';

// 创建一个实例，内部封装基础url等，目前整个项目只使用了一个请求实例和一个基础url
// 后期随着项目的增大，可以针对每个大模块都创建一个实例，并且设置基础url
const ItemRequest = new IRequest({
  baseURL: BASE_URL,
  timeout: BASE_TIME,

  // 针对该实例的拦截器
  interceptors: {
    requestInterceptor(config) {
        
        
      // 可以在这里携带token，token可以存放在vuex或者localstorage中
      // const token = '';
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
        
        
      console.log('请求成功拦截器');
      return config;
    },
    requestInterceptorCatch(error) {
      console.log('请求失败拦截器');
      return error;
    },
    responseInterceptor(result) {
      console.log('响应成功拦截器');
      return result;
    },
    responseInterceptorCatch(error) {
      console.log('响应失败拦截器');
      return error;
    }
  }
});
export { ItemRequest };
```

接口声明文件type.ts

```ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 扩展拦截器接口
export interface IRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (config: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

export interface IRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: IRequestInterceptors<T>;
  isLoading?: boolean;
}

export interface ILoading {
  setText: (text: string) => void;
  remvoeElLoadingChild: () => void;
  close: () => void;
  handleAfterLeave: () => void;
  $el: HTMLElement;
  originalPosition: import('vue').Ref<string>;
  originalOverflow: import('vue').Ref<string>;
  visible: import('vue').Ref<boolean>;
  background: import('vue').Ref<string>;
  svg: import('vue').Ref<string>;
  svgViewBox: import('vue').Ref<string>;
  spinner: import('vue').Ref<string | boolean>;
  text: import('vue').Ref<string>;
  fullscreen: import('vue').Ref<boolean>;
  lock: import('vue').Ref<boolean>;
  customClass: import('vue').Ref<string>;
  target: import('vue').Ref<HTMLElement>;
  beforeClose?: import('vue').Ref<(() => boolean) | undefined> | undefined;
  closed?: import('vue').Ref<(() => void) | undefined> | undefined;
}
```







### 环境变量

方式一：手动修改不同变量的值

方式二：根据进程的环境变量，process.env.NODE_ENV

方式三：vue.cli脚手架搭建的项目中的写法：

- .env.development

- .env.production

- .env.test

- .env

  在上述文件中书写key = value的方式

  在项目的文件中使用：process.env.key

  



### tsconfig.json说明

```json
{
  "compilerOptions": {
    "target": "esnext",  // 转为那个版本的es语法，但是如果借助babel转化ts，则不用关注这项，因为babel会更具browerslistrc进行浏览器语法转化
    "module": "esnext",  // 目标代码使用的模块化方案
    "strict": true,  // 开启ts的严格检查
    "jsx": "preserve",  // 对jsx的处理
    "importHelpers": true,  
    "moduleResolution": "node",   // 按照node方式解析模块的规则
    "skipLibCheck": true,   // 跳过对第三方库的类型检测  
    "esModuleInterop": true,  // 是否混合commonjs和es模块的导入与导出，和下一项搭配使用
    "allowSyntheticDefaultImports": true,
      
    "sourceMap": true,  // 生成映射文件
    "baseUrl": ".",   // 文件路径解析时的基本路径
    "types": ["webpack-env"],   // 对应具体解析使用的类型
    "paths": {   // 编译阶段的路径解析，类似webpack 中的 alias
      "@/*": ["src/*"]
    },
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"]   // 可以在项目中使用哪些环境中的类型
  },
    
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "tests/**/*.ts", "tests/**/*.tsx"], // 当前哪些ts代码需要被解析
  "exclude": ["node_modules"]   // 排除哪些目录中的ts文件的解析
}

```





### ts类型定义

在项目中加载一些比较特殊的文件，比如.vue，.jpg，.png等，加载这些文件的时候默认ts是不认识这些文件的，也就会认为这些文件不是一个模块而报错。

对于文件的类型声明：

```ts
/* eslint-disable */
// 声明 .vue文件时模块类型，并且模块中导出什么样的类型
declare module '*.vue' {   
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;  
}
```





### css样式初始化

npm install normalize.css

再设定一些整个项目常用的css样式。

### 登录页面逻辑

在登录页面正确输入后，点击登录按钮触发在login的store模块中的登录action函数，该函数触发封装的login模块的网络请求，网络请求成功后返回token（保存到本地，之后在请求拦截体重添加token）和用户id，将token commit到motations中，再到login模块的store中。同时在action中根据id和token发出请求用户数据的请求，请求成功后保存到本地和vuex中。

1. 登录逻辑
2. 数据保存（vuex和localstorage）
3. 发送其他请求
4. 获取用户数据
5. 跳转首页









### 项目文件命名规范



文件夹：全部小写，多个单词之间用 - 分割

文件名：全部小写，多个单词之间用 - 分割

组件名：全部小写，多个单词之间用 - 分割

css类名：全部小写，多个单词之间用 - 分割



### 扩展

在ts中Promimse构造函数是支持泛型的。

从下面的源码可以看出：泛型 T  将作为then函数的onfulfilled函数的参数的数据格式。

```ts
interface Promise<T> {
  
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

   
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}


new Promise<sting>((resolve,reject)=>{
    resolve('asd')
}).then((res)=>{
    console.log(res)  //res的数据格式是传入的泛型 string
})
```



vue3.0项目中的defineComponent说明：

```ts
<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// defineComponent 函数的作用主要是用于TS,这样会编写传入的配置对象的使用会有代码提示
export default defineComponent({
  name: 'App',
  components: {},
  setup(){}
});
</script>

<style lang="scss"></style>
```



在TS中获取某个组件的实例的数据类型：

构造一种类型，由类型的构造函数的实例类型组成。

```ts
InstanceType<typeof 组件名>  // InstanceType 是TS内置的类型，表示取类实例对象的类型
    

例子：
type FormInstance = InstanceType<typeof ElForm>;

const loginFormRef = ref<FormInstance>();   //这样就获取到对应组件的实例对象的数据类型，之后可以通过提示查看到组件上的属性或者方法


class C {
  x = 0;
  y = 0;
}
 
type T0 = InstanceType<typeof C>;
type T0 = C
                       
type T1 = InstanceType<any>;
type T1 = any
                       
type T2 = InstanceType<never>;
type T2 = never
                       
type T3 = InstanceType<string>;
Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
type T3 = any
                       
type T4 = InstanceType<Function>;
Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
Type 'Function' provides no match for the signature 'new (...args: any): any'.
type T4 = any

```



