# rem布局

解决问题：

- 页面布局时文字的大小也能随着屏幕的变化而变化
- 流式布局和flex布局主要都是针对宽度布局，但是高度是确定的，rem布局可以让高度自适应
- 屏幕变化时让元素的宽和高等比例缩放

rem（root em）是一个相对单位，与之类似的是em，em相对的是父元素的字体大小。rem则是相对于html元素的字体大小而定的。

使用em的话会因为每个盒子可能的字体大小不同，导致整个页面很难有一个统一的标准。而rem则很好的避免了这个问题。在不同的屏幕宽度下，对html元素的字体大小进行设置，就能间接的实现相应式。



媒体查询（media query）——css3新语法

通过媒体查询设置在不同的屏幕尺寸下，让html的font-size属性设置为不同字体大小。而页面中的其他元素都使用rem来作为长度单位。

```
@media mediaType and|not|only (media feature){
	css规则
}
```

mediaType：

- all
- scree
- print 

media feature:

- width
- min-width
- max-width



```
	@media screen and (max-width:2000px){   //小于等于2000px
      body{
        background-color: #afc;
      }
    }
    @media screen and (max-width:900px){
      body{
        background-color: #ccc;
      }
    }
    @media screen and (max-width:690px){
      body{
        background-color: rgb(27, 78, 48);
      }
    }
    @media screen and (max-width:375px){
      body{
        background-color: rgb(241, 188, 42);
      }
    }
```

```
@media screen and (min-width:375px){
	...
}
@media screen and (min-width:539px){
	...
}
@media screen and (min-width:974px){
	...
}
@media screen and (min-width:1120px){
	...
}
```

## link标签中的媒体查询

当在不同的屏幕尺寸下，有一些列的css样式需要应用。这是如果将css样式都写在一个css文件中就会非常杂乱。这时可以将不同屏幕尺寸下的一套css样式分为一个css文件，再通过结合媒体查询按条件生效。

```
<link href='./index320.css' media='screen and (min-width:320px)'></link>
<link href='./index640.css' media='screen and (min-width:640px)'></link>
```





### 开发中注意

当设计师给到自己移动端的原稿图时，自己首先要确定原稿图的css像素是多大。然后按照原稿图中的每个元素的自身px单位大小，按照一个基准（原稿图的10分之一或者15分之一或者20分之一），将他们转为rem单位，然后之后的只需要改变html的字体大小就可以实现宽高的动态变化。





让一些不能等比例自适应的元素在屏幕尺寸发生改变时能等比例的缩放。以前的开发，让宽度可以等比例缩放，但是高度是写死的。现在希望在不同屏幕尺寸下，高度也能产生变化。页面元素的宽高也能按照原有比例进行缩放。

## rem适配方案

媒体查询加上rem。

实际开发时的方案

按照设计稿与设备宽度的比例，动态计算并设置html标签的font-size大小；css中，将设计稿**元素**中的宽高和相对位置取值，按照同等比例换算为rem为单位的值。

开发中帮助实现rem布局的技术：

技术一：

- less
- 媒体查询
- rem

设计稿中常见的尺寸宽度：

| 设备          | 宽度                                            |
| ------------- | ----------------------------------------------- |
| iphone4，5    | 640px                                           |
| iPhone6，7，8 | 750px                                           |
| android       | 320px,360px,375px,384px,400px,414px,500px,720px |











技术二：

- flexible.js
- rem

不用写不同屏幕下的媒体查询，而用js实现。它内部的原理是将当前设备划分为10等份，一等份作为html的文字大小 ，不同屏幕下比例还是一致的。







## Bootstrap

（*）通配符选择器是无法匹配到伪元素选择器的，所以在bootstrap中使用了如下css：

```
*{
	box-sizing:border-box;
}
:after,:before{
	box-sizing:border-box;
}
```

在bootstrap中的css样式重置使用的是Normalize.css。



### 流体容器

class="container-fluid"的容器，就相当于width为auto的容器。

![image-20210516225224967](.\typora-user-images\image-20210516225224967.png)

### 固定容器（常用）

class = "container"的容器，多出了媒体查询。

![image-20210516225422378](.\typora-user-images\image-20210516225422378.png)

![image-20210516231143812](.\typora-user-images\image-20210516231143812.png)

### 栅格系统

在固定容器内部，有行和列的区分。

行：class="row"，一行分为12列。













## 移动端布局方案

移动端浏览器主要考虑webkit内核，兼容性较好。

### 视口

浏览器显示页面内容的那部分屏幕区域。

- 布局视口
- 视觉视口
- 理想视口

布局视口（layout viewport）

在pc端的布局一般都在980px以上，而手机端的浏览器在没有做移动端适配的情况下，默认能设置为980px的布局视口，但是980px及以上的页面需要在750像素的手机或者更小的手机上展示出来的。所以会自动将页面进行压缩，导致的结果就是页面元素看上去偏小，无法看清楚，需要手动缩放和滑动。

pc端页面：

![image-20210531225133695](.\typora-user-images\image-20210531225133695.png)

pc端未作适配的页面在手机上显示：

![image-20210531225219215](.\typora-user-images\image-20210531225219215.png)



视觉视口（visual viewport）

用户所能看到的页面的那部分区域。



理想视口（ideal viewport）

布局视口的宽度就等于设备的视觉视口的宽度，这样就无需缩放。

开启理想视口需要使用meta标签。 



多倍图

物理像素（分辨率）：真实存在的物理像素点，只是不同设备的物理像素点数量不一样。

在oc端开发时，开发单位也写为1px，但是它并不意味着和移动端的1物理像素对应。这就导致了一个问题，在开发时我们的图片都是用css像素表示的，如果同样单位的大小的图片放在移动端去显示的话，图片所占据的物理像素点可能翻倍

。而如果想让图片呈现出最好的显示效果，就需要让1物理像素和图片的1css像素一一对应。所以常常看到设计师给的设计图往往是移动端布局宽度的2倍或者3倍或者多倍。这样自己在切除图片并使用时，可以统一设置将图片元素的宽高设为之前的二分之一，然后在移动端会自动方法。



### 移动端技术选型

移动端开发时，布局时的宽度就是设备屏幕的宽度。

#### 单独制作移动端页面

- 流式布局（百分比布局）

  元素的宽度不再写死，而多用百分比，高度可以固定。

- flex布局

- less+rem布局+媒体查询或者flexible.js

- 混合布局



#### pc端和移动端统一的响应式页面

- 媒体查询
- bootstrap



















