# uni-app

它是用 Vue 写的可多端使用的开源框架。uni-app 提供了条件编译优化，可以为特定的平台写针对性的代码。uni-app 打包为 app 时使用的是 H5+的引擎，所以 H5+中所有的能力都能在 uni-app 中使用。

## 前言

Uni-app 是一个前端应用框架，它基于 Vu e.js 进行开发。

小程序开发框架，App 跨平台框架和 H5 开发框架。一套前端代码可以编译为跨平台的应用。

uni-app 中内置了组件和一些列的 api（跨平台封装）。

## 项目创建

方式一：

HBuilderX 内置相关环境，开箱即用（App 开发版）。

- 打开 HBuilderX 编辑器
- 在点击工具栏里的文件 -> 新建 -> 项目
- 选择`uni-app`类型，输入工程名，选择模板，点击创建，即可成功创建

HBuilderX 可视化界面创建的项目，编译器在 HBuilderX 的安装目录下的 plugin 目录，随着 HBuilderX 的升级会自动升级编译器。

方式二：

vue-cli 的命令行创建。

- npm install -g @vue/cli
- vue create -p dcloudio/uni-preset-vue my-project
- 选择项目模板

`cli` 创建的项目，编译器安装在项目下，并且不会跟随 HBuilderX 升级，如需升级编译器，执行 `npm update`，或者手动修改 package.json 中的 uni 相关依赖版本后执行 `npm install`。更新后可能会有新增的依赖并不会自动安装，手动安装缺少的依赖即可。

已经使用`cli`创建的项目，如果想继续在 HBuilderX 里使用，可以把工程拖到 HBuilderX 中。注意如果是把整个项目拖入 HBuilderX，则编译时走的是项目下的编译器。如果是把 src 目录拖入到 HBuilderX 中，则走的是 HBuilderX 安装目录下 plugin 目录下的编译器。

## 开发规范

`uni-app` 使用 vue 的语法+小程序的标签和 API

- 功能页面采用的是.vue 文件组件
- 元素标签以小程序的标签为主
- 接口以微信小程序相似，但需将前缀 `wx` 替换为 `uni`
- 数据绑定及事件处理同 `Vue.js` 规范，补充了 App 及页面的生命周期
- 使用 flex 布局进行开发

创建项目

开发工具：

- HbuilderX（App 开发版）

- 微信开发者工具

- 打开编辑器，点击左上角文件=>新建=>项目

  ![image-20210807102416821](.\typora-user-images\image-20210807102416821.png)

### 项目运行到微信开发者工具

首次使用微信开发者工具运行 uni-app 项目时，需要进行运行设置，配置微信开发者工具的路径。

![image-20210807102712775](.\typora-user-images\image-20210807102712775.png)

![image-20210807102810047](.\typora-user-images\image-20210807102810047.png)

![image-20210807102932692](.\typora-user-images\image-20210807102932692.png)

在配置好后，点击运行，选择如图：

![image-20210807103550549](.\typora-user-images\image-20210807103550549.png)

在使用微信小程序运行时遇到的问题记录：、

[error] 工具的服务端口已关闭。要使用命令行调用工具，请在下方输入 y 以确认开启，或手动打开工具 -> 设置 -> 安全设置，将服务端口开启。

<img src=".\typora-user-images\image-20210807103700000.png" alt="image-20210807103700000" style="zoom:200%;" />

原因是微信开发者工具的安全设置选项中服务端口没有开启，打开就可以解决。

![image-20210807103855748](.\typora-user-images\image-20210807103855748.png)

### 项目运行到安卓手机

小米手机设置=> 我的设备=>全部参数=>多次点击 MIUI 版本=>启动开发者模式=>返回设置页面首页=>选择更多设置=>进入开发者页面=>开启 USB 调试。

![image-20210807105212607](.\typora-user-images\image-20210807105212607.png)

### 项目文件说明

![image-20210807111216211](.\typora-user-images\image-20210807111216211.png)

pages：业务页面存放目录

static：存放项目的静态资源目录

unpackage：存放打包编译后文件的目录，一般不会对它内部的内容进行修改

App.vue:：在该文件中可以进行一些全局的配置或者对全局进行监听,可以进行全局样式的编写。项目根组件，所有页面都是在 app.vue 下进行切换的，**内部可以调用应用的生命周期函数**。

main.js：项目的入口文件，初始化 vue 实例并使用需要的插件

manifest.json：该文件本身是一个 json 文件，但是该编辑器对它进行了可视化的方式显示。在该文件中可以对项目进行配置，比如：对 app 图标，启动图，SDK（地图，登录与支付等）进行配置

pages.json：通过它可以配置**页面的路由**，**导肮栏和选项卡**等页面信息（经常使用该文件进行配置）

uni.scss：对项目基础样式的预设变量，之后也是可以修改的。

### uni-app 页面样式和布局

尺寸单位：

尺寸单位支持 px 和 rpx

px：表示的是 css 中 px 项目，可能 1px 代表多个移动端设备的物理像素点。

rpx：默认用 750rpx 表示所有设备 100%的宽度，如果一个元素宽度的是 375rpx 的话，意味着它在不同尺寸的设备下都会占该设备宽度的一般。

样式导入：

- 因为 uni-app 是基于 Vue 的，所以可以在.vue 文件的`<style>`部分使用 @import 'xxx/xxx/xxx.css'; 的方式引入。

- `<view :style="{color:pink}"></view>`

- `<view class="className"></view>`

- 在项目的 App.vue 文件中编写的 css 样式可以被应用到整个项目的所有文件，在其他页面中需要使用时，直接通过类名的方式调用即可，在该文件中可以声明整个项目公共的样式

  注意：在 App.vue 文件中定义了一个类名，同时在 pages 文件夹下面的具体业务页面文件中也定义了相同的类名，在业务页面使用该类名时，默认使用的是该业务页面中定义的类名对应的 css 规则，会有覆盖的效果。但是该业务页面定义的 css 只在该页面文件中才有效。

在做小程序开发时，pages.json 文件中的 pages 字段中的一个路径对应的业务页面就是整个项目的初始页面。

### pages.json 配置文件

[官网 pagesAPI](https://uniapp.dcloud.io/collocation/pages)

pages.json

- globalStyle 字段用于进行全局的配置，可以通过它设置应用的状态栏，导航条，标题和窗口背景颜色等
- pages 字段配置应用由哪些页面组成，pages 节点接收一个数组，数组每个项都是一个对象，其属性值有 path 和 style。

### uni-app 基础组件

### 图片上传与预览

uni.chooseImages(options)
