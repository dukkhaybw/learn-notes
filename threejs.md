## 前言

基于webGL，网页可以做出许多精美的3D动画。

three.js是一个让开发者用JS搭建并进行webGL类项目开发的类库。学习webGL需要图形学，js和glsl两种语言。如果不通过three.js直接使用webGL，势必需要从底层去学起，这就要求开发者必须了解着色器语法（编写顶点着色器，片元着色器），但是使用three.js的话，前期可以先绕过这些底层，降低学习的坡度。

安排：

1. 掌握three.js中基本的概念（点，线，面，集合体，材质，物体，场景，相机，渲染器，动画，控制器）
2. 搭建基础场景和3D物体用于显示，调试代码
3. 深入上述的基础概念，通过官网文档去了解各个属性和概念
4. 学习PBR，PBR是基于物理的光照原理的渲染，环境贴图，凹凸贴图，置换贴图，放射光，金属贴图，粗糙度贴图
5. 通过PBR把光照效果显示出凹凸不平，折射不同角度的光照的效果
6. 粒子
7. 让网页和物体进行交互
8. 物理引擎，重力，反弹，摩擦力
9. 着色器技术语言
10. 控制用GPU方式渲染
11. 理解threejs底层对webGL的封装
12. 编写顶点着色器，片元着色器，了解整个图形渲染的原理
13. 曲线和物体运动结合
14. 学习绘制结构图，建模，blender软件



##  本地官网搭建

[官网](https://threejs.org/)比较慢，所以可以再本地构建官网。

1. 去到threejs的github仓库，克隆一份下来，安装项目依赖后用script脚本启动，在本地开启一个网站服务





## parcel构建开发环境

1. 模块化开发
2. 热更新

过程：

1. 创建一个文件夹

2. npm init -y

3. npm install parcel-bundler -D ，  新版本的parcel直接通过 npm install parcel -D 

4. 编写script脚本命令

   ```json
   {
     "script":{
       "dev": "parcel ./src/index.html",
       "build": "parcel build ./src/index.html"
     }
   }
   ```


   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Document</title>
       <link rel="stylesheet" href="assets/css/index.css" />
     </head>
     <body>
       <!-- 下面这行是重点 -->
       <script src="main.js" type="module"></script>  
     </body>
   </html>
   
   ```

   



自己在配置过程中遇到的问题：

1. 即使是开发环境下打包，也会生成dist文件，这时不要用本地file协议打开html，而要用本地服务器

2. 代码执行的效果不应该自己去用live server插件启动服务器，而用该打包工具自动启动的本地服务器地址就可以

3. threejs的导入方式必须是`import * as three from "three";`，不然three将为undefined

   





### threejs基础

要搭建一个最简单的threejs相关网页需要的元素：

- 场景
- 物体
- 相机
- 渲染器



```js
// 1 xxx. 初始化场景
```





