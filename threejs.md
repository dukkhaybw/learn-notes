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

原生WebGL和图形学是Three.js的底层知识，难度相对较大。建议先基于threejs入门原生WebGL，对渲染管线和着色器语法有一定了解，在根据个人情况学习图形学相关理论知识。计算机图形学相关的理论书籍，不用上来就看，可以有一定three.js和原生WebGL基础再看。



**3D建模——Blender**

对于复杂的模型，需要通过3D建模软件绘制模型，一般可以通过Blender、3dmax、c4d等三维软件实现。对于3D建模，一般工作的时候，都是美术负责。关于3D建模，对于程序员而言，可以选择Blender学习，Blender更轻量，且开源免费。



扩展：

>  Cesium也是一款WebGL的3D引擎，相比Three.js封装更进一步，主要是给GIS行业使用，并不像three.js那么通用。



## 指导

基础能力

1. **了解3D美术知识**，必须要明白什么是mesh（网格目数），geomerty（几何）,material（材料）,texture（纹理，材质）是什么。必须要明白什么是mesh，geomerty,material,texture。在3D环境下想要一个东西变大可以改变一个物体的scale也可以调整position.z，甚至改变摄像机的机位，想要一个东西变亮你可以调整物体的diffuse反射属性，也可以加强光照值。
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

   



## threejs基础

要搭建一个最简单的threejs相关网页需要的元素：

- 三维空间场景，场景中有物体，模拟眼睛的相机
- 物体
- 相机
- 渲染器



### 场景

创建一个三位空间，用于摆放东西来交给three.js来渲染，这是放置物体、灯光和摄像机的地方。

可以把三维场景[Scene](https://threejs.org/docs/index.html?q=sc#api/zh/scenes/Scene)对象理解为虚拟的3D场景，用来表示模拟生活中的真实三维场景,或者说三维世界。

```js
// 创建3D场景对象Scene
const scene = new THREE.Scene();
```





### 相机

Three.js中常用的有两种类型的相机：**正交（orthographic）相机、透视（perspective）相机**。一般情况下为了模拟人眼都是使用透视相机； 正交镜头的特点是，物品的渲染尺寸与它距离镜头的远近无关。也就是说在场景中移动一个物体，其大小不会变化。正交镜头适合2D游戏。 透视镜头则是模拟人眼的视觉特点，距离远的物体显得更小。透视镜头通常更适合3D渲染。

```js
// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(fov,aspect,near,far)
```



参数说明：

| 参数   | 含义                                                         | 默认值 |
| :----- | :----------------------------------------------------------- | :----- |
| fov    | 相机视锥体竖直方向视野角度，通常3D游戏的FOV取值在60-90度之间较好的默认值为60 | 50     |
| aspect | 相机视锥体水平方向和竖直方向长度比，一般设置为Canvas画布宽高比width / height | 1      |
| near   | 相机视锥体近裁截面相对相机距离                               | 0.1    |
| far    | 相机视锥体远裁截面相对相机距离，far-near构成了视锥体高度方向 | 2000   |

![img](https://picx.zhimg.com/80/v2-752c181080b141b5553685312eec3615_720w.webp?source=1940ef5c)

![视锥体](http://www.webgl3d.cn/threejs/%E8%A7%86%E9%94%A5%E4%BD%93.png)

创建摄像机以后还要对其进行移动、然后对准物体积聚的场景中心位置，分别是设置其 position和调用 lookAt 方法，参数均是一个 [xyz向量](https://www.zhihu.com/search?q=xyz向量&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})(new THREE.Vector3(x,y,z))

```text
camera.position：控制相机在整个3D环境中的位置（取值为3维坐标对象-THREE.Vector3(x,y,z)）
camera.lookAt：控制相机的焦点位置，决定相机的朝向（取值为3维坐标对象-THREE.Vector3(x,y,z)）


//相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(200, 200, 200); 

camera.lookAt(0, 10, 0);  //y轴上位置10
camera.lookAt(mesh.position);//指向mesh对应的位置
```



![img](http://www.webgl3d.cn/threejs/%E7%9B%B8%E6%9C%BA%E4%BD%8D%E7%BD%AE%E5%92%8C%E7%9B%AE%E6%A0%87.png)



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



### 改变相机观察目标

```js
// 改变相机观察目标点
camera.lookAt(1000, 0, 1000);
```

注意相机控件OrbitControls会影响lookAt设置，注意手动设置OrbitControls的目标参数

```js
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 相机控件.target属性在OrbitControls.js内部表示相机目标观察点，默认0,0,0
// console.log('controls.target', controls.target);
controls.target.set(1000, 0, 1000);
controls.update();//update()函数内会执行camera.lookAt(controls.targe)
```



### 渲染器

```js
const renderer = new THREE.WebGLRenderer({
  antialias:true,
});
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
renderer.antialias = true,
  
// 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setClearColor(0x444444, 1); //设置背景颜色

renderer.render(scene, camera); //执行渲染操作

document.body.appendChild(renderer.domElement);
```









### 灯光

在Three.js中光源是必须的，如果一个场景不设置灯光那么世界将会是一片漆黑。Three.js内置了多种光源以满足特定场景的需要。可以根据自己的项目需要来选择何种灯光。

**光源分类**

![img](https://picx.zhimg.com/80/v2-504e6174bf542f3eabca4b7d677ac6f3_720w.webp?source=1940ef5c)

关于光源的详细 API 参考 threejs 官网，demo 也很完整 [传送门](https://link.zhihu.com/?target=https%3A//threejs.org/examples/%3Fq%3Dlight%23webgl_lights_physical)

![image-20230406142537277](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406142537277.png)

![image-20230406142550642](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406142550642.png)



```js
// 点光源：两个参数分别表示光源颜色和光照强度
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
const pointLight = new THREE.PointLight(0xffffff, 1.0);

//点光源位置
pointLight.position.set(400, 0, 0);//点光源放在x轴上

scene.add(directionalLight); //点光源添加到场景中
```



**平行光**

平行光辅助观察`DirectionalLightHelper`

通过点光源辅助观察对象[DirectionalLightHelper](https://threejs.org/docs/index.html?q=LightHelper#api/zh/helpers/DirectionalLightHelper)可视化点光源。

```js
// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(80, 100, 50);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);

// DirectionalLightHelper：可视化平行光
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xff0000);
scene.add(dirLightHelper);
```



平行光照射到网格模型Mesh表面，光线和模型表面构成一个入射角度，入射角度不同，对光照的反射能力不同。

光线照射到**漫反射网格材质**[MeshLambertMaterial](https://threejs.org/docs/index.html?q=MeshLambertMaterial#api/zh/materials/MeshLambertMaterial)对应Mesh表面，Mesh表面对光线反射程度与入射角大小有关。

![image-20230406143407861](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406143407861.png)





**光源辅助观察器**

通过点光源辅助观察对象[PointLightHelper ](https://threejs.org/docs/index.html?q=PointLightHelper#api/zh/helpers/PointLightHelper)可视化点光源。

```js
// 光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
scene.add(pointLightHelper);
```





### Mesh

在计算机里，一条弧线是由有限个点构成的有限条线段连接得到的。当线段数量越多，长度就越短，当达到无法察觉这是线段时，一条平滑的弧线就出现了。 计算机的三维模型也是类似的。只不过线段变成了平面，普遍用三角形组成的网格来描述。把这种模型称之为 Mesh 模型。 在 threeJs 的世界中，材质(Material)+几何体(Geometry)就是一个 mesh。设置其name属性可以通过scene.getObjectByName(name)获取该物体对象；**Geometry就好像是骨架，材质则类似于皮肤**，对于材质和几何体的分类见下表格。

```js
// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0,10,0);
// 把网格模型mesh添加到三维场景scene中
scene.add(mesh); 
```



**材质分类**：

![img](https://picx.zhimg.com/80/v2-66a88f1f5f27642cbcce47094be53bdc_720w.webp?source=1940ef5c)

```js
//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,//0xff0000设置材质颜色为红色
}); 
```





**几何图形**

Three.js提供了各种各样的几何体API，用来表示三维物体的几何形状。

```js
//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(100, 100, 100);  // 创建一个长宽高都为100的正方体
```



- **2D**
  ![img](https://picx.zhimg.com/80/v2-3d8f5799292a587afa709db6462db125_720w.webp?source=1940ef5c)

  
  
- **3D**

  ![img](https://picx.zhimg.com/80/v2-134d43bc1fc5d171ba71e95810780054_720w.webp?source=1940ef5c)

![img](http://www.webgl3d.cn/threejs/%E5%87%A0%E4%BD%95%E4%BD%93Geometry.svg)

Three.js的材质默认正面可见，反面不可见,对于**矩形**平面`PlaneGeometry`、**圆形**平面如果你想看到两面，可以设置`side: THREE.DoubleSide`。

```js
new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide, //两面可见
});
```



`MeshPhongMaterial`和`MeshLambertMaterial`都会收到光照的影响区别在于，对光线反射方式有差异。

`MeshPhongMaterial`可以实现`MeshLambertMaterial`不能实现的高光反射效果。对于高光效果，可以想象一下，在太阳下面观察一辆车，会发现在特定角度和位置，可以看到车表面某个局部区域非常高亮。

```js
// 模拟镜面反射，产生一个高光效果
const material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444, //高光部分的颜色
});
```





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

场景中如果添加了各种 mesh 和模型并给他加入了一些 [tweend](https://www.zhihu.com/search?q=tweend&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A501346840})动画会发现他并不会运动，因为场景并没有实时渲染，所以要让场景真的动起来，需要用到**requestAnimationFrame**(请求动画帧)。

```js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
// renderer.render(scene, camera); //执行渲染操作
document.body.appendChild(renderer.domElement);

// 渲染函数
function render() {
    renderer.render(scene, camera); //执行渲染操作
    mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
    requestAnimationFrame(render);//请求再次执行渲染函数render，渲染下一帧
}
render();
```





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



```js
// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
  renderer.render(scene, camera); //执行渲染操作
  // 浏览器控制台查看相机位置变化
  console.log('camera.position',camera.position);
});//监听鼠标、键盘事件
```

OrbitControls本质上就是改变相机的参数，比如相机的位置属性，改变相机位置也可以改变相机拍照场景中模型的角度，实现模型的360度旋转预览效果，改变透视投影相机距离模型的距离，就可以改变相机能看到的视野范围。



### 辅助坐标系

```js
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
```



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



### 全屏渲染

```js
// onresize 事件会在窗口被调整大小时发生
window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
};
```





### 辅助开发工具

#### stats

通过stats.js库可以查看three.js当前的渲染性能，具体说就是计算three.js的渲染帧率(FPS),所谓渲染帧率(FPS)，简单说就是three.js每秒钟完成的渲染次数，一般渲染达到每秒钟60次为最佳状态。

```js
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js';


//创建stats对象
const stats = new Stats();
//stats.domElement:web页面上输出计算结果,一个div元素，
document.body.appendChild(stats.domElement);
// 渲染函数
function render() {
	//requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
	stats.update();
	renderer.render(scene, camera); //执行渲染操作
	requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();
```



#### gui.js库

**dat.gui.js**可视化改变三维场景，对HTML、CSS和JavaScript进行了封装，借助**dat.gui.js**可以快速创建控制三维场景的UI交互界面。

创建一个GUI对象，可以看到浏览器右上角多了一个交互界面，GUI本质上就是一个前端js库。

通过`domElement`属性可以获取gui界面的HTML元素，那就意味着可以改变默认的style样式，比如位置、宽度等。

```js
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 实例化一个gui对象
const gui = new GUI();

//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.width = '300px';
```



执行gui的`add()`方法可以快速创建一个UI交互界面，比如一个拖动条，可以用来改变一个JavaScript对象属性的属性值。

格式：`add(控制对象，对象具体属性，其他参数)`

**其他参数**，可以一个或多个，数据类型也可以不同，gui会自动根据参数形式，自动生成对应的交互界面。

参数3和参数4，分别是一个**数字**，交互界面是一个鼠标可以拖动的**拖动条**，可以在一个区间改变属性的值

执行`gui.add(obj, 'x', 0, 100);`可以发现右上角gui界面增加了新的内容，可以控制obj对象x属性的新交互界面。

```js
//创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
const obj = {
    x: 30,
};
// gui增加交互界面，用来改变obj对应属性
gui.add(obj, 'x', 0, 100);
```



**gui改变threejs光照强度测试**



```js
// 通过GUI改变mesh.position对象的xyz属性
gui.add(pointLight, 'intensity', 0, 2.0);
```



**gui改变threejs模型位置测试**

`mesh.position`是JavaScript对象，具有`x`、`y`、`z`属性,这三个属性分别表示模型的xyz坐标，这就是说，gui改变`mesh.position`的`x`、`y`、`z`属性，就可以可视化改变mesh的位置。

```js
gui.add(mesh.position, 'x', 0, 180);
gui.add(mesh.position, 'y', 0, 180);
gui.add(mesh.position, 'z', 0, 180);
```





`add()`创建的交互界面，会默认显示所改变属性的名字，为了通过交互界面更好理解，改变的某个对象属性，可以通过`name()`方法改变gui生成交互界面显示的内容。

```js
const gui = new GUI();//创建GUI对象 
gui.add(ambient, 'intensity', 0, 2.0).name('环境光强度').step(0.1).onChange(function(value){
    mesh.position.x = value;
	// 你可以写任何你想跟着obj.x同步变化的代码
	// 比如mesh.position.y = value;
});;
gui.add(directionalLight, 'intensity', 0, 2.0).name('平行光强度').step(0.1).onChange(function(value){
    mesh.position.x = value;
	// 你可以写任何你想跟着obj.x同步变化的代码
	// 比如mesh.position.y = value;
});;
```



**gui调试颜色命名等**

```js
const obj = {
    color:0x00ffff,
};
// .addColor()生成颜色值改变的交互界面
gui.addColor(obj, 'color').onChange(function(value){
    mesh.material.color.set(value);
});
```



**gui调试下拉菜单、单选框**

格式：`add(控制对象，对象具体属性，参数3, ...)`

参数3是一个**数组或者对象**，生成交互界面是下拉菜单。

```js
const obj = {
    scale: 0,
};
// 参数3数据类型：数组(下拉菜单)
gui.add(obj, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
    mesh.position.y = value;
});

const obj = {
    scale: 0,
};
// 参数3数据类型：对象(下拉菜单)
gui.add(obj, 'scale', {
    left: -100,
    center: 0,
    right: 100
    // 左: -100,//可以用中文
    // 中: 0,
    // 右: 100
}).name('位置选择').onChange(function (value) {
    mesh.position.x = value;
});
```



如果`add()`改变属性的对应的数据类型如果是布尔值，那么交互界面就是一个单选框。

```js
const obj = {
    bool: false,
};
// 改变的obj属性数据类型是布尔值，交互界面是单选框
gui.add(obj, 'bool').name('是否旋转');

gui.add(obj, 'bool').name('旋转动画');

// 渲染循环
function render() {
    // 当gui界面设置obj.bool为true,mesh执行旋转动画
    if (obj.bool) mesh.rotateY(0.01);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
```



**gui.js分组**

当GUI交互界面需要控制的属性比较多的时候，为了避免混合，可以适当分组管理，这样更清晰。

gui交互界面不分组,只有一个默认的总的菜单。

```js
const gui = new GUI(); //创建GUI对象 
//创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
const obj = {
    color: 0x00ffff,// 材质颜色
    specular: 0x111111,// 材质高光颜色
};

// 材质颜色color
gui.addColor(obj, 'color').onChange(function(value){
    material.color.set(value);
});
// 材质高光颜色specular
gui.addColor(obj, 'specular').onChange(function(value){
    material.specular.set(value);
});

// 环境光强度
gui.add(ambient, 'intensity',0,2);
// 平行光强度
gui.add(directionalLight, 'intensity',0,2);
// 平行光位置
gui.add(directionalLight.position, 'x',-400,400);
gui.add(directionalLight.position, 'y',-400,400);
gui.add(directionalLight.position, 'z',-400,400);
```



`new GUI()`实例化一个gui对象，默认创建一个总的菜单，通过gui对象的`addFolder()`方法可以创建一个子菜单，当通过GUI控制的属性比较多的时候，可以使用`addFolder()`进行分组。

```js
const gui = new GUI(); //创建GUI对象 
const obj = {
    color: 0x00ffff,// 材质颜色
};
// 创建材质子菜单
const matFolder = gui.addFolder('材质');
matFolder.close();
// 材质颜色color
matFolder.addColor(obj, 'color').onChange(function(value){
    material.color.set(value);
});
// 材质高光颜色specular
matFolder.addColor(obj, 'specular').onChange(function(value){
    material.specular.set(value);
});


// 环境光子菜单
const ambientFolder = gui.addFolder('环境光');
// 环境光强度
ambientFolder.add(ambient, 'intensity',0,2);

// 平行光强度
dirFolder.add(directionalLight, 'intensity',0,2);
// 平行光位置
dirFolder.add(directionalLight.position, 'x',-400,400);
dirFolder.add(directionalLight.position, 'y',-400,400);
dirFolder.add(directionalLight.position, 'z',-400,400);


```

`addFolder()`返回的子文件夹对象，同样具有gui对象的`add()`、`onChange()`、`addColor()`属性。

gui对象创建的总菜单或`gui.addFolder()`创建的子菜单都可以用代码控制交互界面关闭或开展状态。

```js
const gui = new GUI(); //创建GUI对象 
gui.close();//关闭菜单

// 创建材质子菜单
const matFolder = gui.addFolder('材质');
matFolder.close();//关闭菜单
```

`.addFolder()`创建的对象，同样也具有`.addFolder()`属性，可以继续嵌套子菜单。



### 总结

three.js是以面向对象编程的方式编写源码的。提供了各种各样的类(构造函数),通过`new`关键字可以实例化类(构造函数)，获得一个对象，对象具有属性和方法。

子类是通过父类派生出来的，会继承父类的属性或方法。

- 环境光、平行光源的父类Light
- mesh、light光源的父类Object3D

如果通过文档查询一个类的方法或属性，除了可以查询类本身，还可以查询类的父类。

可以通过实例化后的对象获取或者修改属性，也可以在用类实例化对象的时候初始化一些属性。

```js
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, 
    side:THREE.DoubleSide,
    transparent:true,
    opacity:0.5,
});
console.log('material.color',material.color);
console.log('material.side',material.side);
console.log('material.transparent',material.transparent);
console.log('material.opacity',material.opacity);
// 访问对象属性改变属性的值
material.transparent = false;
material.opacity = 1.0;

// 通过对象的方法改变对象的属性
console.log('模型位置属性',mesh.position);
mesh.position.x = 50;//访问属性改变位置x坐标
mesh.translateX(50);//执行方法改变位置属性
```



## 几何体

**几何体**geometry的**顶点**

**缓冲类型几何体BufferGeometry**

threejs的长方体`BoxGeometry`、球体`SphereGeometry`等几何体都是基于[BufferGeometry (opens new window)](https://threejs.org/docs/index.html?q=BufferGeometry#api/zh/core/BufferGeometry)类构建的，BufferGeometry是一个没有任何形状的空几何体，可以通过BufferGeometry自定义任何几何形状，具体一点说就是定义**顶点数据**。



**`BufferAttribute`定义几何体顶点数据**

通过javascript[类型化数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays)`Float32Array`创建一组xyz坐标数据用来表示几何体的顶点坐标。

```js
//类型化数组创建顶点数据
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);
```

通过threejs的属性缓冲区对象[BufferAttribute](https://threejs.org/docs/index.html?q=BufferAttribute#api/zh/core/BufferAttribute)表示threejs几何体顶点数据。

```js
// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3); 
```

通过`geometry.attributes.position`设置几何体顶点位置属性的值`BufferAttribute`。

```js
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;
```



### 点模型

点模型[Points](https://threejs.org/docs/index.html?q=Points#api/zh/objects/Points)和网格模型`Mesh`一样，都是threejs的一种模型对象，只是大部分情况下都是用Mesh表示物体。点模型`Points`有自己对应的点材质[PointsMaterial](https://threejs.org/docs/index.html?q=Points#api/zh/materials/PointsMaterial)

```js
const pointGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  50,
  0,
  0, //顶点2坐标
  0,
  100,
  0, //顶点3坐标
  0,
  0,
  10, //顶点4坐标
  0,
  0,
  100, //顶点5坐标
  50,
  0,
  10, //顶点6坐标
]);
const attribue = new THREE.BufferAttribute(vertices, 3);
pointGeometry.attributes.position = attribue;
// 点渲染模式
const pointMaterial = new THREE.PointsMaterial({
  color: 0xffff00,
  size: 1, //点对象像素尺寸
});
const points = new THREE.Points(pointGeometry, pointMaterial); //点模型对象
points.position.set(0, 0, 50);
scene.add(points); // 模型对象插入场景中
```

根据上面的vertices坐标点，渲染出一个个的点物体。

![image-20230406170200640](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406170200640.png)



### 线模型

线模型`Line`渲染顶点数据

```js
const pointGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  50,
  0,
  0, //顶点2坐标
  0,
  100,
  0, //顶点3坐标
  0,
  0,
  10, //顶点4坐标
  0,
  0,
  100, //顶点5坐标
  50,
  0,
  10, //顶点6坐标
]);
const attribue = new THREE.BufferAttribute(vertices, 3);
pointGeometry.attributes.position = attribue;
// 点渲染模式
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000, //线条颜色
});
const points = new THREE.Line(pointGeometry, lineMaterial); //点模型对象
points.position.set(10, 0, 50);
scene.add(points); // 模型对象插入场景中
```

渲染效果是从第一个点开始到最后一个点，依次连成线。

threejs线模型除了Line，还提供了[LineLoop](https://threejs.org/docs/index.html?q=line#api/zh/objects/LineLoop)、[LineSegments，区别在于绘制线条的规则不同。

![image-20230406170115086](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406170115086.png)



### 网格模型

用网格模型`Mesh`渲染自定义几何体`BufferGeometry`的顶点坐标。

网格模型Mesh其实就一个一个三角形(面)拼接构成。使用使用网格模型Mesh渲染几何体geometry，就是几何体所有顶点坐标三个为一组，构成一个三角形，多组顶点构成多个三角形，就可以用来模拟表示物体的表面。

![image-20230406165718469](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406165718469.png)

 网格模型三角形：正反面

- 正面：逆时针
- 反面：顺时针

空间中一个三角形有正反两面，那么Three.js的规则是如何区分正反面的？眼睛(相机)对着三角形的一个面，如果三个顶点的顺序是逆时针方向，该面视为正面，如果三个顶点的顺序是顺时针方向，该面视为反面。

```js
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff, //材质颜色
  side: THREE.FrontSide, //默认只有正面可见
  // side: THREE.DoubleSide, //两面可见
  // side: THREE.BackSide, //设置只有背面可见
});
```

![image-20230406170345776](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230406170345776.png)



### 构建矩形平面

几何体顶点位置数据`geometry.attributes.position`，该属性的值必须是THREE.BufferAttribute实例对象

一个矩形平面，可以至少通过两个三角形拼接而成。而且两个三角形有两个顶点的坐标是重合的。

注意三角形的正反面问题：保证矩形平面两个三角形的正面是一样的，也就是从一个方向观察，两个三角形都是逆时针或顺时针。

```js
const gemoetry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  50,
  0,
  0, //顶点2坐标
  0,
  100,
  0, //顶点3坐标
  50,
  0,
  0, //顶点4坐标
  50,
  100,
  0, //顶点5坐标
  0,
  100,
  0, //顶点6坐标
]);
const attribue = new THREE.BufferAttribute(vertices, 3);
gemoetry.attributes.position = attribue;
// 点渲染模式
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, //线条颜色
});
const faces = new THREE.Mesh(gemoetry, material); //点模型对象
faces.position.set(10, 0, 50);
scene.add(faces); // 模型对象插入场景中
```

网格模型Mesh对应的几何体BufferGeometry，拆分为多个三角后，很多三角形重合的顶点位置坐标是相同的，这时候如果你想减少顶点坐标数据量，可以借助几何体顶点索引`geometry.index`来实现。



```js
const gemoetry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  80,
  0,
  0, //顶点2坐标
  80,
  80,
  0, //顶点3坐标
  0,
  80,
  0, //顶点4坐标
]);
const indexes = new Uint16Array([
  // 下面索引值对应顶点位置数据中的顶点坐标
  0, 1, 2, 0, 2, 3,
]);

const attribue = new THREE.BufferAttribute(vertices, 3);  // 这里第二个参数改为4是无法直接渲染一个矩形平面的。

gemoetry.attributes.position = attribue;
gemoetry.index = new THREE.BufferAttribute(indexes, 1);
// 点渲染模式
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000, //线条颜色
});
const faces = new THREE.Mesh(gemoetry, material); //点模型对象
faces.position.set(10, 0, 50);
scene.add(faces); // 模型对象插入场景中
```



### 顶点法线数据

顶点法线(法向量)数据`geometry.attributes.normal`

可以测试下，把前面两节课的案例源码中`MeshBasicMaterial`材质改为`MeshLambertMaterial`材质，会发现原来的矩形平面无法正常渲染，使用受光照影响的材质，几何体BufferGeometry需要定义**顶点法线**数据。

```js
// MeshBasicMaterial不受光照影响
// 使用受光照影响的材质，几何体Geometry需要定义顶点法线数据
const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff, 
    side: THREE.DoubleSide, //两面可见
});
```

数学上的法线概念，比如一个平面，法线的就是该平面的垂线，如果是光滑曲面，一点的法线就是该点切面的法线。

Three.js中法线和数学中法线概念相似，只是定义的时候更灵活，会根据需要进行调整。

Three.js中法线是通过顶点定义，默认情况下，**每个顶点都有一个法线数据，可以单独设置**，就像每一个顶点都有一个位置数据。

**坐标点的法线和灯光的入射角度之间的差值越小，反光程度越高。**

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene(); // 创建场景对象

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  80,
  0,
  0, //顶点2坐标
  80,
  80,
  0, //顶点3坐标
  0,
  80,
  0, //顶点4坐标
]);
const indexes = new Uint16Array([
  // 下面索引值对应顶点位置数据中的顶点坐标
  0, 1, 2, 0, 2, 3,
]);

// 灯光的入射角度是1，1，1照射到0，0，0，所以算是45度角， 自己可以改变一下下面坐标点，看看平面的反光程度是不同的，材质是MeshPhongMaterial
const normals = new Float32Array([
  1,
  1,
  1, //顶点1法线( 法向量 )
  0,
  0,
  1, //顶点2法线
  0,
  0,
  1, //顶点3法线
  0,
  0,
  1, //顶点4法线
]);

const attribue = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribue;
geometry.index = new THREE.BufferAttribute(indexes, 1);
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);
// 点渲染模式
const material = new THREE.MeshPhongMaterial({
  color: 0xff0000, //线条颜色
});
const faces = new THREE.Mesh(geometry, material); //点模型对象
faces.position.set(10, 0, 50);
scene.add(faces); // 模型对象插入场景中

const camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000); // 创建相机对象
camera.position.set(100, 100, 100);
camera.lookAt(0, 0, 0);
scene.add(camera);

const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.position.set(200, 200, 200);
scene.add(pointLight);

// 光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setClearColor(0x444444, 1); //设置背景颜色
renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
```



### 材质属性

线条模式渲染，查看几何体三角形结构。

```js
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, 
    wireframe:true,//线条模式渲染mesh对应的三角形数据
});
```



### 细分数

矩形平面几何体至少需要两个三角形拼接而成。

```js
 //矩形几何体PlaneGeometry的参数3,4表示细分数，默认是1,1
const geometry = new THREE.PlaneGeometry(100,50,1,1);
```

把一个矩形分为2份，每个矩形2个三角形，总共就是4个三角形

```js
const geometry = new THREE.PlaneGeometry(100,50,2,1);
```

把一个矩形分为4份，每个矩形2个三角形，总共就是8个三角形

```js
const geometry = new THREE.PlaneGeometry(100,50,2,2);
```



球体`SphereGeometry`参数2、3分别代表宽、高度两个方向上的细分数，默认32,16，具体多少以你所用版本为准。

```js
const geometry = new THREE.SphereGeometry( 50, 32, 16 );
```

如果球体细分数比较低，表面就不会那么光滑。

```js
const geometry = new THREE.SphereGeometry( 15, 8, 8 );
```





### 旋转、缩放、平移

BufferGeometry通过`.scale()`、`.translate()`、`.rotateX()`、`.rotateY()`等方法可以对几何体本身进行缩放、平移、旋转,这些方法本质上都是改变几何体的顶点数据。

![img](http://www.webgl3d.cn/threejs/BufferGeometry.svg)



```js
// 几何体xyz三个方向都放大2倍
geometry.scale(2, 2, 2);
// 几何体沿着x轴平移50
geometry.translate(50, 0, 0);
// 几何体绕着x轴旋转45度
geometry.rotateX(Math.PI / 4);
// 几何体旋转、缩放或平移之后，查看几何体顶点位置坐标的变化
// BufferGeometry的旋转、缩放、平移等方法本质上就是改变顶点的位置坐标
console.log('顶点位置数据', geometry.attributes.position);
```



```js
geometry.translate(50, 0, 0);//偏移
// 居中：已经偏移的几何体居中，执行.center()，可以看到几何体重新与坐标原点重合
geometry.center();
```





##  三维向量Vector3

点模型`Points`、线模型`Line`、网格网格模型`Mesh`等模型对象的父类都是[Object3D](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/core/Object3D)，如果想对这些模型进行旋转、缩放、平移等操作，如何实现，可以查询Threejs文档[Object3D](https://threejs.org/docs/index.html?q=Object3D#api/zh/core/Object3D)对相关属性和方法的介绍。

![img](http://www.webgl3d.cn/threejs/%E7%88%B6%E7%B1%BBobject.jpg)

三维向量`Vector3`有xyz三个分量，threejs中会用三维向量`Vector3`的实例作为很多其他对象的属性的属性值，比如位置`position`和缩放`scale`属性。

`Vector3`对象具有属性`x`、`y`、`z`，`Vector3`对象还具有`set()`等方法。

```js
//new THREE.Vector3()实例化一个三维向量对象
const v3 = new THREE.Vector3(0,0,0);
console.log('v3', v3);
v3.set(10,0,0);//set方法设置向量的值
v3.x = 100;//访问x、y或z属性改变某个分量的值
```

模型位置`position`属性的值就是一个三维向量对象，那意味着，想改变位置属性，就应该查询文档Vector3。模型位置`position`的默认值是`THREE.Vector3(0.0,0.0,0.0)`，表示坐标原点。

设置网格模型y坐标

```javascript
mesh.position.y = 80;
```

设置模型xyz坐标

```javascript
mesh.position.set(80,2,10);
```

执行`translateX()`、`translateY()`等方法本质上改变的都是模型的位置属性`position`，可以多次执行该语句，每次执行都是相对上一次的位置进行平移变换。

**沿着自定义的方向移动：**

```js
//向量Vector3对象表示方向
const axis = new THREE.Vector3(1, 1, 1);
axis.normalize(); //向量归一化
//沿着axis轴表示方向平移100
mesh.translateOnAxis(axis, 100);
```



## 角度属性

模型的角度属性rotation，该属性的属性值是欧拉对象[Euler](https://threejs.org/docs/index.html?q=Euler#api/zh/math/Euler)。

```js
// 创建一个欧拉对象，表示绕着xyz轴分别旋转45度，0度，90度
const Euler = new THREE.Euler( Math.PI/4,0, Math.PI/2);

const Euler = new THREE.Euler();
Euler.x = Math.PI/4;
Euler.y = Math.PI/2;
Euler.z = Math.PI/4;
```

通过属性设置欧拉对象的三个分量值。

角度属性`.rotation`的值是欧拉对象`Euler`，意味着你想改变属性`.rotation`,可以查询文档关于`Euler`类的介绍。

```javascript
const Euler = new THREE.Euler();
Euler.x = Math.PI/4;
Euler.y = Math.PI/2;
Euler.z = Math.PI/4;

//绕y轴的角度设置为60度
mesh.rotation.y += Math.PI/3;
//绕y轴的角度增加60度
mesh.rotation.y += Math.PI/3;
//绕y轴的角度减去60度
mesh.rotation.y -= Math.PI/3;

// 绕着Y轴旋转90度
mesh.rotateY(Math.PI / 2);
//控制台查看：旋转方法，改变了rotation属性
console.log(mesh.rotation);
```

模型执行`.rotateX()`、`.rotateY()`等旋转方法，你会发现改变了模型的角度属性`.rotation`。

绕着某个轴旋转：

网格模型绕`(0,1,0)`向量表示的轴旋转`π/8`。

```js
const axis = new THREE.Vector3(0,1,0);//向量axis
mesh.rotateOnAxis(axis,Math.PI/8);//绕axis轴旋转π/8
```



## 颜色

材质对象有color属性，该属性对应属性值是颜色对象`Color`。颜色对象有三个属性，分别为`.r`、`.g`、`.b`，表示颜色RGB的三个分量。

```js
// 查看Color对象设置0x00ff00对应的的.r、.g、.b值  默认是纯白色0xffffff。
const color = new THREE.Color(0x00ff00);

color.r = 0.0;
color.b = 0.0;

color.setRGB(0,1,0);//RGB方式设置颜色
color.setHex(0x00ff00);//十六进制方式设置颜色
color.setStyle('#00ff00');//前端CSS颜色值设置颜色

color.set(0x00ff00);//十六进制方式设置颜色
color.set('#00ff00');//前端CSS颜色值设置颜色
```

`Color`提供了`.setHex()`、`.setRGB()`、`.setStyle()`、`.set()`等修改颜色值的方法。





## 材质父类

MeshBasicMaterial、MeshLambertMaterial、MeshPhongMaterial等子类网格材质会从父类`Material`继承一些属性和方法，比如透明度属性`.opacity`、面属性`.side`、是否透明属性`.transparent`等。



模型对象的几何体`.geometry`和材质属性`.material`。

```js
const mesh = new THREE.Mesh(geometry, material);
console.log('mesh',mesh);

console.log('mesh.geometry',mesh.geometry);
console.log('mesh.material',mesh.material);
// 访问模型材质,并设置材质的颜色属性
mesh.material.color.set(0xffff00);
// 访问模型几何体,并平移几何体顶点数据
mesh.geometry.translate(0,100,0);

const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.position.x = 100;
// 两个mesh共享一个材质，改变一个mesh的颜色，另一个mesh2的颜色也会跟着改变
// mesh.material和mesh2.material都指向同一个material
// 三者等价：mesh.material、mesh2.material、material
mesh.material.color.set(0xffff00);
// 三者等价：mesh.geometry、mesh2.geometry、geometry
mesh.geometry.translate(0,100,0);
```





## 克隆与复制

克隆与复制在three.js中很多对象都具有的方法。

克隆`.clone()`是复制一个和原对象一样的新对象，是浅拷贝。

复制`.copy()`是把一个对象属性的属性值赋值给另一个对象

```js
const v1 = new THREE.Vector3(1, 2, 3);
console.log('v1',v1);
//v2是一个新的Vector3对象，和v1的.x、.y、.z属性值一样
const v2 = v1.clone();
console.log('v2',v2);

const mesh2 = mesh.clone();
mesh2.position.x = 100;
// 改变材质颜色，或者说改变mesh2颜色，mesh和mesh2颜色都会改变
// material.color.set(0xffff00);
mesh2.material.color.set(0xffff00);
// 通过克隆.clone()获得的新模型和原来的模型共享材质和几何体


const mesh2 = mesh.clone();
// 克隆几何体和材质，重新设置mesh2的材质和几何体属性
mesh2.geometry = mesh.geometry.clone();
mesh2.material = mesh.material.clone();
// 改变mesh2颜色，不会改变mesh的颜色
mesh2.material.color.set(0xff0000);


const v1 = new THREE.Vector3(1, 2, 3);
const v3 = new THREE.Vector3(4, 5, 6);
//读取v1.x、v1.y、v1.z的赋值给v3.x、v3.y、v3.z
v3.copy(v1);


// 渲染循环
function render() {
    mesh.rotateY(0.01);// mesh旋转动画
    // 同步mesh2和mesh的姿态角度一样，不管mesh姿态角度怎么变化，mesh2始终保持同步
    mesh2.rotation.copy(mesh.rotation);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();
```



## 组对象Group

![image-20230407093408288](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230407093408288.png)

创建了两个网格模型mesh1、mesh2，通过`THREE.Group`类创建一个组对象group,然后通过`add`方法把网格模型mesh1、mesh2作为设置为组对象group的子对象，然后在通过执行`scene.add(group)`把组对象group作为场景对象的scene的子对象。

```js
//创建两个网格模型mesh1、mesh2
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshLambertMaterial({color: 0x00ffff});
const group = new THREE.Group();
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.translateX(25);
//把mesh1型插入到组group中，mesh1作为group的子对象
group.add(mesh1);
//把mesh2型插入到组group中，mesh2作为group的子对象
group.add(mesh2);
// group.add(mesh1,mesh2);

//把group插入到场景中作为场景子对象
scene.add(group);
```

场景对象Scene、组对象Group都有一个子对象属性`.children`,通过该属性可以访问父对象的子对象，子对象属性`.children`的值是数组，所有子对象是数组的值。

父对象执行`.add()`方法的本质就是把参数中的子对象添加到自身的子对象属性`.children`中。

![image-20230407093700636](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230407093700636.png)

场景对象Scene的子对象，除了组对象`Group`之外，还可以看到环境光`AmbientLight`、平行光`DirectionalLight`、辅助坐标对象`AxesHelper`。

一般来说网格模型Mesh、点模型Points、线模型Line是树结构的最外层叶子结点。构建层级模型的中间层一般都是通过Threejs的`Group`类来完成，`Group`类实例化的对象可以称为组对象。

场景对象`Scene`、组对象`Group`的`.add()`方法都是继承自它们共同的基类(父类)`Object3D`。

`.add()`方法可以单独插入一个对象，也可以同时插入多个子对象。



**网格模型mesh1、mesh2作为设置为父对象group的子对象，如果父对象group进行旋转、缩放、平移变换，子对象同样跟着变换，就像头旋转了，眼睛会跟着头旋转。**





`Object3D`作为`Group`来使用。某种程度上，可把两者画等号，只是`Group`更加语义化，Object3D本身就是表示模型节点的意思。

```js
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
const obj = new THREE.Object3D();//作为mesh1和mesh2的父对象
obj.add(mesh1,mesh2);
```

threejs默认mesh也可以添加子对象,其实原因很简单，mesh和Group父类都是Object3D，本质上也可以认为都是Object3D。

```js
//threejs默认mesh也可以添加子对象,mesh基类也是Object3D
mesh1.add(mesh2);
```



## 遍历模型

场景对象Scene和各种子对象构成一个层级模型

在层级模型中可以给一些模型对象通过`.name`属性命名进行标记。

```js
const group = new THREE.Group();
group.name='小区房子';
const mesh = new THREE.Mesh(geometry, material);
mesh.name='一号楼';
```



创建一个如下图的层级结构:

![img](http://www.webgl3d.cn/threejs/%E5%B1%82%E7%BA%A7%E6%A8%A1%E5%9E%8B.svg)



```js
// 批量创建多个长方体表示高层楼
const group1 = new THREE.Group(); //所有高层楼的父对象
group1.name = "高层";
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 60, 10);
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
    group1.add(mesh); //添加到组对象group1
    mesh.name = i + 1 + '号楼';
    // console.log('mesh.name',mesh.name);
}
group1.position.y = 30;


const group2 = new THREE.Group();
group2.name = "洋房";
// 批量创建多个长方体表示洋房
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 30, 10);
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ffff
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 30;
    group2.add(mesh); //添加到组对象group2
    mesh.name = i + 6 + '号楼';
}
group2.position.z = 50;
group2.position.y = 15;

const model = new THREE.Group();
model.name='小区房子';
model.add(group1, group2);
model.position.set(-50,0,-25);
```



层级树的遍历：

```js
// 递归遍历model包含所有的模型节点
model.traverse(function(obj) {
    console.log('所有模型节点的名称',obj.name);
    // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
    if (obj.isMesh) {//判断条件也可以是obj.type === 'Mesh'
        obj.material.color.set(0xffff00);
    }
});
```



获取某个具体的模型：

查找一个模型树中的某个节点。

```js
// 返回名.name为"4号楼"对应的对象
const nameNode = scene.getObjectByName ("4号楼");
nameNode.material.color.set(0xff0000);
```

更多的查找方法和方法的使用细节可以查看基类Object3D



## 坐标

一个物体可能属于某个组，而这个组可以进行移动，如属于某个组的物体移动了，那么它将在所属分组的基础上进行移动。

```js
// mesh的世界坐标就是mesh.position与group.position的累加
const mesh = new THREE.Mesh(geometry, material); 
mesh.position.set(50, 0, 0);  // 如果物体添加的坐标系，这种移动方式会让坐标系一起移动
geometry.translate(50/2,0,0,); // 而这种方式则是让物体相对于自身的坐标系进行移动，坐标系不会移动
const group = new THREE.Group();
group.add(mesh);
group.position.set(50, 0, 0);
```



1. 改变子对象的`.position`，子对象在3D空间中的坐标会发生改变。
2. 改变父对象的`.position`，子对象在3D空间中的位置也会跟着变化，也就是说父对象`.position`和子对象`.position`叠加才是才是子对象的`.position`。

任何一个模型的**本地坐标**(**局部坐标**)就是模型的`.position`属性。

一个模型的**世界坐标**，说的是，模型自身`.position`和所有父对象`.position`累加的坐标。



**获取世界坐标**

`mesh.getWorldPosition(Vector3)`读取一个模型的世界坐标，并**把读取结果存储到参数`Vector3`中**。

```js
// 声明一个三维向量用来表示某个坐标
const worldPosition = new THREE.Vector3();
// 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
mesh.getWorldPosition(worldPosition);
console.log('世界坐标',worldPosition);
console.log('本地坐标',mesh.position);
```



**给物体添加一个局部坐标系**

```js
//可视化mesh的局部坐标系
const meshAxesHelper = new THREE.AxesHelper(50);
mesh.add(meshAxesHelper);
```





## 纹理贴图

通过纹理贴图加载器`TextureLoader`的`load()`方法加载一张图片可以返回一个纹理对象`Texture`，纹理对象`Texture`可以作为模型材质颜色贴图`.map`属性的值。

```js
const geometry = new THREE.PlaneGeometry(200, 100); 
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./earth.jpg');
const material = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture,//map表示材质的颜色贴图属性
});



material.map = texture;
```



**顶点UV坐标**的作用是从纹理贴图上提取像素映射到网格模型Mesh的几何体表面上。·

```js
const geometry = new THREE.PlaneGeometry(200, 100); //矩形平面
// const geometry = new THREE.BoxGeometry(100, 100, 100); //长方体
// const geometry = new THREE.SphereGeometry(100, 30, 30);//球体
console.log('uv',geometry.attributes.uv);
```

顶点UV坐标可以在0~1.0之间任意取值，纹理贴图**左下角**对应的UV坐标是`(0,0)`，**右上角**对应的坐标`(1,1)`。

![image-20230407214817109](C:/Users/shuyi/Desktop/study-notes/threejs.images/image-20230407214817109.png)

顶点UV坐标`geometry.attributes.uv`和顶点位置坐标`geometry.attributes.position`是一一对应的，

UV顶点坐标你可以根据需要在0~1之间任意设置，具体怎么设置，要看你想把图片的哪部分映射到Mesh的几何体表面上。

```js
/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
    0, 0, //图片左下角
    1, 0, //图片右下角
    1, 1, //图片右上角
    0, 1, //图片左上角
]);
// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

```



**矩形图片剪裁为圆形渲染**

通过圆形几何体`CircleGeometry`创建一个网格模型Mesh，把一张图片作为圆形Mesh材质的颜色贴图。

```js
//CircleGeometry的顶点UV坐标是按照圆形采样纹理贴图
const geometry = new THREE.CircleGeometry(60, 100);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('./texture.jpg');
const material = new THREE.MeshBasicMaterial({
    map: texture,//map表示材质的颜色贴图属性
    side:THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);

```























