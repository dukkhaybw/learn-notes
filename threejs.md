## 前言

- WebGL
  基于webGL，现在网页可以做出许多精美的3D动画。学习webGL需要图形学，js和glsl两种语言。如果不通过three.js直接使用webGL，势必需要从底层去学起，这就要求开发者必须了解着色器语法（编写顶点着色器，片元着色器），但是使用three.js的话，前期可以先绕过这些底层，降低学习的坡度。
- Three.js
  three.js是一个让开发者用JS进行webGL类项目开发的类库，基于原生WebGL封装的通用Web3D引擎。没有原生WebGL基础，也可以直接学习Three.js。
- 3D建模



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



**WebGL**

原生WebGL和图形学是Three.js的底层知识，难度相对较大。建议先基于threejs入门原生WebGL，对渲染管线和着色器语法有一定了解，在根据个人情况学习图形学相关理论知识。计算机图形学相关的理论书籍，不用上来就看，可以有一定three.js和原生WebGL基础在看。



**3D建模——Blender**

对于复杂的模型，需要通过3D建模软件绘制模型，一般可以通过Blender、3dmax、c4d等三维软件实现。对于3D建模，一般工作的时候，都是美术负责。关于3D建模，对于程序员而言，可以选择Blender学习，Blender更轻量，且开源免费。



扩展：

>  Cesium也是一款WebGL的3D引擎，相比Three.js封装更进一步，主要是给GIS行业使用，并不像three.js那么通用。



## 指导

基础能力

1. **了解3D美术知识**，必须要明白什么是mesh（网格目数），geomerty（几何）,material（材料）,texture（纹理，材质）是什么。必须要明白什么是mesh，geomerty,material,texture是什么。在3D环境下想要一个东西变大可以改变一个物体的scale也可以调整position.z，甚至改变摄像机的机位，想要一个东西变亮你可以调整物体的diffuse反射属性，也可以加强光照值。
2. **掌握Javascript以及OOP程序开发**，明白如何使用js进行面向对象编程，尤其使用threejs构建比较复杂的网页游戏时候，必须做到更清晰的模块化，利用设计模式和数据结构进行数据和显示的绑定。动画怎么写？物体排列怎么做？人物角色寻路算法？物体间碰撞？攻击伤害等属性配置？以上这些都是游戏开发能力的本质，这个是不管用什么引擎都应该掌握的。
3. 渲染器、场景、镜头、灯光、建模、模型贴图、带素材导入模型

掌握以上两点才是threejs的核心能力，如果有了以上能力想要处理更加酷炫的效果，利用threejs的shaderMaterial自己编写顶点着色以及片元着色处理比如卡通效果或者某些非得用shader才能解决的问题。



3D 场景前置知识

1. 场景(Scene)：是物体、光源等元素的容器，可以配合 chrome 插件使用，抛出 window.scene即可实时调整 [obj](https://www.zhihu.com/search?q=obj&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840}) 的信息和材质信息。 
2. 相机（Camera）：场景中的相机，代替人眼去观察，场景中只能添加一个，一般常用的是[透视相机](https://www.zhihu.com/search?q=透视相机&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})（PerspectiveCamera） 
3. 物体对象（Mesh）：包括二维物体（点、线、面）、三维物体，模型等等 
4. 光源（Light）：场景中的光照，如果不添加光照场景将会是一片漆黑，包括全局光、平行光、点光源等 
5. 渲染器（Renderer）:场景的渲染方式，如webGL\canvas2D\Css3D。 
6. 控制器(Control): 可通过键盘、鼠标控制相机的移动



##  本地官网搭建

[官网](https://threejs.org/)比较慢，所以可以再本地构建官网。

1. 去到threejs的github仓库，克隆一份下来，安装项目依赖后用script脚本启动，在本地开启一个网站服务

因为threejs每月更新的时候，API会有变化，建议实际开发的时候，three.js API的使用规则，一切以**项目threejs版本**对应的**文档**为准，在**本地预览**任何指定的版本文档。

官方文件目录介绍：

```
three.js-文件包
└───build——three.js相关库，可以引入你的.html文件中。
    │
└───docs——Three.js API文档文件
    │───index.html——打开该文件，本地离线方式预览threejs文档
└───examples——大量的3D案例，是你平时开发参考学习的最佳资源
    │───jsm——threejs各种功能扩展库
└───src——Three.js引擎的源码，有兴趣可以阅读。
    │
└───editor——Three.js的可视化编辑器，可以编辑3D场景
    │───index.html——打开应用程序  
```

![image-20230328115707654](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230328115707654.png)







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

- 三维空间场景，场景中有物体，模拟眼睛的相机
- 物体
- 相机
- 渲染器



**场景**

`const scene = new Three.Scene()`

创建一个三位空间，用于摆放东西来交给three.js来渲染，这是放置物体、灯光和摄像机的地方。





**相机**

Three.js中常用的有两种类型的相机：**正交（orthographic）相机、透视（perspective）相机**。一般情况下为了模拟人眼都是使用透视相机； 正交镜头的特点是，物品的渲染尺寸与它距离镜头的远近无关。也就是说在场景中移动一个物体，其大小不会变化。正交镜头适合2D游戏。 透视镜头则是模拟人眼的视觉特点，距离远的物体显得更小。透视镜头通常更适合3D渲染。

`const camera = new THREE.PerspectiveCamera(fov,aspect,near,far)`

参数说明：

fov：视野角度，从镜头可以看到的场景的部分。通常3D游戏的FOV取值在60-90度之间较好的默认值为60 

aspect：渲染区域的[纵横比](https://www.zhihu.com/search?q=纵横比&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})。较好的默认值为window.innerWidth/window.innerHeight 

near：最近离镜头的距离 

far：远离镜头的距离

![img](https://picx.zhimg.com/80/v2-752c181080b141b5553685312eec3615_720w.webp?source=1940ef5c)

创建摄像机以后还要对其进行移动、然后对准物体积聚的场景中心位置，分别是设置其 position和调用 lookAt 方法，参数均是一个 [xyz向量](https://www.zhihu.com/search?q=xyz向量&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})(new THREE.Vector3(x,y,z))

```text
camera.position：控制相机在整个3D环境中的位置（取值为3维坐标对象-THREE.Vector3(x,y,z)）
camera.lookAt：控制相机的焦点位置，决定相机的朝向（取值为3维坐标对象-THREE.Vector3(x,y,z)）
```



1. 相机的视野形状是一个锥体，就会有一个平面的长和宽的比例，角度
2. 下图中红色区域表示一旦物体距离小于这部分，就不可见
3. 下图的黄色部分表示只有物体在这个锥体范围内就是可见的，其他地方则不可见

![image-20230327160355015](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230327160355015.png)



用three.js打造一个最基础的场景进行显示。

```js
import * as Three from "three";

const scene = new Three.Scene(); // 初始化场景

const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // 创建透视相机

camera.position.set(0, 0, 10); // 设置相机位置

scene.add(camera); // 将相机添加到场景中，添加对象到这个对象的子级，可以添加任意数量的对象。 当前传入的对象中的父级将在这里被移除，因为一个对象仅能有一个父级。

const cubeGeometry = new Three.BoxGeometry(1, 1, 1); // 建立方体
const material = new Three.MeshBasicMaterial({ color: "red" }); // 一个以简单着色（平面或线框）方式来绘制几何体的材质。这种材质不受光照的影响。
const cube = new Three.Mesh(cubeGeometry, material);
scene.add(cube);

// 初始化渲染器
const render = new Three.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(render.domElement);

render.render(scene, camera);
```

上面的代码渲染出来的画面是纯平面的。



### 灯光

在Three.js中光源是必须的，如果一个场景你不设置灯光那么世界将会是一片漆黑。Three.js内置了多种光源以满足特定场景的需要。可以根据自己的项目需要来选择何种灯光。

**光源分类**

![img](https://picx.zhimg.com/80/v2-504e6174bf542f3eabca4b7d677ac6f3_720w.webp?source=1940ef5c)

关于光源的详细 API 参考 threejs 官网，demo 也很完整 [传送门](https://link.zhihu.com/?target=https%3A//threejs.org/examples/%3Fq%3Dlight%23webgl_lights_physical)



### Mesh

在计算机里，一条弧线是由有限个点构成的有限条线段连接得到的。当线段数量越多，长度就越短，当达到无法察觉这是线段时，一条平滑的弧线就出现了。 计算机的三维模型也是类似的。只不过线段变成了平面，普遍用三角形组成的网格来描述。把这种模型称之为 Mesh 模型。 在 threeJs 的世界中，材质(Material)+几何体(Geometry)就是一个 mesh。设置其name属性可以通过scene.getObjectByName(name)获取该物体对象；**Geometry就好像是骨架，材质则类似于皮肤**，对于材质和几何体的分类见下表格。

**材质分类**：

![img](https://picx.zhimg.com/80/v2-66a88f1f5f27642cbcce47094be53bdc_720w.webp?source=1940ef5c)



**几何图形**

- **2D**
  ![img](https://picx.zhimg.com/80/v2-3d8f5799292a587afa709db6462db125_720w.webp?source=1940ef5c)

  
  
- **3D**

  ![img](https://picx.zhimg.com/80/v2-134d43bc1fc5d171ba71e95810780054_720w.webp?source=1940ef5c)



- **加载外部模型**

  一般来讲场景中不可能都是一些常规形状，或多或少项目中都会用到一些外部的模型资源，比如动物啊，装饰物，再加上一些动画，这样整个场景更加显得生动， threejs 中可以通过一些方式来加载外部的模型资源。

  加载外部模型，是通过Three.js加载器（Loader）实现的。加载器把文本/二进制的模型文件转化为Three.js对象结构。 每个[加载器](https://www.zhihu.com/search?q=加载器&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})理解某种特定的文件格式。

  **需要注意的是，由于贴图的尺寸必须是(2的幂数)X (2的幂数)，如：1024X512，所以为了防止贴图变形，平面的宽度比例需要与贴图的比例一致。**

  **支持的格式**

  ![img](https://pic1.zhimg.com/80/v2-1d0ce3c0d53441b7e4f0a33e6e148a4a_720w.webp?source=1940ef5c)

在项目一开始尝试是使用 [dae](https://www.zhihu.com/search?q=dae&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840}) 文件，后面发现 json 文件更加方便一点，所以最终使用的是 jsonloader 导入 json 文件。json文件可以通过 blender 或者3DMax 导出，他们都有各自的 [export json](https://www.zhihu.com/search?q=export json&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})的插件。在软件中处理好模型贴图和动画以后，导出 json 文件和相应的贴图文件给到前端即可。



### 粒子

**THREE.Sprite**

在WebGlRenderer渲染器中使用THREE.Sprite创建的粒子可以直接添加到scene中。创建出来的粒子总是面向镜头的。即不会有倾斜变形之类透视变化，只有近大远小的变化。



### 场景交互

Three.js中并没有直接提供“点击”功能，可以基于THREE.Raycaster来判断鼠标当前对应到哪个物体,用来进行碰撞检测.



### 动画

场景中如果添加了各种 mesh 和模型并给他加入了一些 [tweend](https://www.zhihu.com/search?q=tweend&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})动画会发现他并不会运动，因为场景并没有实时渲染，所以要让场景真的动起来，需要用到**requestAnimationFrame**。





### 轨道控制器

为了能看到立体的图形，需要添加控制器，这里使用轨道控制器。

Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动，以获取不同角度的画面。

```diff
import * as Three from "three";
+ import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new Three.Scene(); // 初始化场景

const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // 创建透视相机

camera.position.set(0, 0, 10); // 设置相机位置

scene.add(camera); // 将相机添加到场景中，添加对象到这个对象的子级，可以添加任意数量的对象。 当前传入的对象中的父级将在这里被移除，因为一个对象仅能有一个父级。

const cubeGeometry = new Three.BoxGeometry(1, 1, 1); // 建立方体
const material = new Three.MeshBasicMaterial({ color: "red" }); // 一个以简单着色（平面或线框）方式来绘制几何体的材质。这种材质不受光照的影响。
const cube = new Three.Mesh(cubeGeometry, material);
scene.add(cube);

// 初始化渲染器
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

+ new OrbitControls(camera, renderer.domElement);  // 创建轨道控制器 ，将相机捕捉的画面交给canvas绘制，但是画面需要重新渲染才行

+ function render() {
+   renderer.render(scene, camera);
+   requestAnimationFrame(render);
+ }

+ render();
```





### 辅助坐标系

```js
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
```





### 物体移动





### 缩放与旋转



### 动画性能

避免出现时快时慢的情况。

requestAnimationFrame方法被触发的时间间隔并不一定和屏幕的刷新率同步(16.6ms)，如果某一帧中有关任务执行时间过长，那么下一次requestAnimationFrame方法被触发时，时间间隔就不确定了，而下面的代码中每一帧的requestAnimationFrame的回调函数中都增加固定的移动距离，所有有的时间比如90ms时间移动0.01，有的时候16.6ms移动0.01。

![image-20230327195933834](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230327195933834.png)

所以下面这种动画的计算方式就有可能存在时快时慢的情况：

```js
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new Three.Scene(); // 初始化场景

const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // 创建透视相机

camera.position.set(0, 0, 10); // 设置相机位置

scene.add(camera); // 将相机添加到场景中，添加对象到这个对象的子级，可以添加任意数量的对象。 当前传入的对象中的父级将在这里被移除，因为一个对象仅能有一个父级。

const cubeGeometry = new Three.BoxGeometry(1, 1, 1); // 建立方体
const material = new Three.MeshBasicMaterial({ color: "red" }); // 一个以简单着色（平面或线框）方式来绘制几何体的材质。这种材质不受光照的影响。
const cube = new Three.Mesh(cubeGeometry, material);

scene.add(cube);

// 添加辅助坐标系
const axesHelper = new Three.AxesHelper(5);
scene.add(axesHelper);

// 初始化渲染器
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

function render(time) {
  console.log(time);  // 时间不定  ++++++++++++++++++++++++++++
  let x = cube.position.x;
  let xRotation = cube.rotation.x;
  x += 0.01;
  if (x >= 5) {
    x = 0;
  }
  xRotation += 0.01;
  if (xRotation >= 2 * Math.PI) {
    xRotation = 0;
  }
  cube.position.set(x, 0, 0);
  cube.rotation.set(xRotation, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
```



扩展：

> **`window.requestAnimationFrame()`** 告诉浏览器——开发者希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
>
> 回调函数执行次数通常与浏览器屏幕刷新次数相匹配。
>
> 回调函数会被传入[`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)参数，[`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)指示当前被 `requestAnimationFrame()` 排序的回调函数被触发的时间，该参数与[`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)的返回值相同，它表示`requestAnimationFrame()` 开始去执行回调函数的时刻。
>
> Performance.now()返回值表示为从浏览器第一帧渲染完之后到当前调用时经过的时间，是一个累加值。



为了解决上面的问题，则使用通过请求动画帧回调中的时间参数来控制物体移动：

```js
function render(time) {
  let t = time / 1000 % 5;  // +++++++++++++++++++++++
  let x = cube.position.x;
  let xRotation = cube.rotation.x;
  x = t * 1;
  if (x >= 5) {
    x = 0;
  }
  xRotation = t;
  if (xRotation >= 2 * Math.PI) {
    xRotation = 0;
  }
  cube.position.set(x, 0, 0);
  cube.rotation.set(xRotation, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
```





在requestAnimationFrame方法的回调函数中一种一个时间传参，如果项目中有多个物体分别有自己不同的计时，这时就不方便了。

为此，three.js提供了一个clock对象，用于控制和跟踪时间。































