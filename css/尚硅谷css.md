# css知识总结

## 系统滚动条

滚动条有两个，一个在document上，一个在body上。默认只显示document上的滚动条。

在body不设置高度的时候，body的高度由内容撑开。而document上的滚动条是否出现取决于body的高度是否超出视口的高度。

document上的滚动条受到html和body的overflow属性的值影响。

- 只有body和html中的其中一个设置的overflow：scroll 时，滚动条打开的都是document上的滚动条
- 给body上设置overflow：scroll 的同时给html设置overflow：hidden，则关闭document上的滚动条而开启body上的滚动条
- 给body和html同时设置overflow：hidden，那document和body上的滚动条都关闭
- 给body和html同时设置overflow：scroll，那document和body上的滚动条都打开
- 只给body或者html其中一个设置overflow:hidden时，都隐藏document上的滚动条

如果想让body上的滚动条代替document上的滚动条，需要先让body占满整个视口的高度（height：100%），宽度默认为auto。

```css
html{
    overflow:hidden;
    height:100%;  //提供高度给视口高度给body去参照继承
}
body{
    overflow:auto;
    height:100%;   
}

在为给html设置height：100%时，直接给body设置height：100%是无效的，body的高度还是由内容撑开。
```



给html设置的许多属性都直接作用于document上，因为document无法获取和控制。

在css中由外向内依次是：document =>初始包含快 =>html =>body



## 初始包含快

初始包含快是一个视口大小的矩形。，它也是html元素的包含块，初始包含块由用户代理建立。

浮动元素和定位元素的包含块有不同情况：

对于浮动元素的包含块为最近的块级祖先元素。

对于一个非根元素，如果它的position为relative或者static，则该元素的包含块为最经一级的父级块元素的内容（content）区域。

对于一个非根元素，如果它的position为absolute，则包含块设置为最近的position值不为static的祖先元素，并且top和left值的基点是该祖先元素的padding区域的左上角。

对于开启绝对定位的元素，在父级元素都没有开启定位的情况下，元素参考初始包含块进行定位。



定位的元素的top（bottom）与left（right）值：

- left（right）：定义了定位元素的左外边距边界与其包含块左边界之间的偏移，非定位元素设置此属性无效。
- 默认值：auto
- 百分比单位： 设置以包含块元素的padding以内的区域的宽度的百分比计的左边位置。可使用负值。 percentages of the width of the containing block



- top（bottom）：该属性定义了一个定位元素的上外边距边界与其包含块上边界之间的偏移。
- 默认值：auto
- 百分比单位： 设置以包含块元素的padding以内的区域的高度的百分比计的上边位置。可使用负值。



## 百分比单位参照

width的默认值不是0，而是auto，当单位为百分比时，参照包含块的content区域的宽度。

height的默认值不是0，也不是auto，而是由内容撑开，当单位为百分比时，参照包含块的content区域的高度。

margin与padding的默认值为0，不是auto，当单位为百分比时，都参照包含块的的content区域的宽度。





## css引入方式：

- 通过在头部写link标签

  ```
  <link rel="stylesheet" href="./index.css" type="text/css">
  ```

- css规则写在style这个html标签内部

  ```
  <style>
      h1{
        color: blue;
      }
  </style>
  ```

- 写在标签的style属性内部

  ```
  <h1 style="font-size: 20px;">hello world</h1>
  ```

- 分模块导入其他css，可以将一些公共的css样式抽离出来，染后，在其他css文件中引入，或者直接在需要使用的该样式文件的html中引入

  ```
  在其他css首部引入另一个css
  @import url("common-css/header.css");
  /* @import url("./common-css/header.css"); */  //都正确
  
  在html文件中引入
  <style>
  	@import url("common-css/header.css")
  </style>
  ```

  #### link 标签 与 @import指令的区别(面试)

  >**1.从属关系区别**
  >`@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。
  >
  >**2.加载顺序区别**
  >写在一个加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。
  >
  >**3.兼容性区别**
  >`@import`是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；`link`标签作为 HTML 元素，不存在兼容性问题。
  >
  >**4.DOM可控性区别**
  >可以通过 JS 操作 DOM ，插入`link`标签来改变样式；由于 DOM 方法是基于文档的，无法使用`@import`的方式插入样式。
  >
  >**5.没有权重区别**
  >`link`引入的样式权重并不大于`@import`引入的样式，在同一个页面中引入它们，在权重一样的情况下都遵循层叠原则
  >
  >**6.书写位置不同**



#### 属性选择器

```
可以使用多种基础选择器和属性选择器进行组合
input[title]{  //选出含有该属性的元素进行css样式设计
	...
}

input[title="value"]{ //选出含有该属性且属性值只为value的元素进行css样式设计
	....
}

input[title$='str']{ //选出含有该属性且属性值为str结尾的元素进行css样式设计
	...
}

input[title^='str']{ //选出含有该属性且属性值以str开头的元素进行css样式设计
	...
}

input[title*='str']{ //选出含有该属性且属性中有为str字段（不用是一个独立的单词，可以只出现一部分含还该str就可以）的元素进行css样式设计
	...
}

input[title~='str']{ //选出含有该属性且属性值以str作为一个完整单词出现的元素进行css样式设计
	...
}

input[title|='str']{ //选出含有该属性且属性值以str开头或者str-开头出现的元素进行css样式设计
	...
}
```



### 伪类选择器

```
以元素所处的状态或者对不存在的元素进行设置，
对于超链接a标签有四种状态：
1.未点击过的  :link
2.点击过的   :visited
3.点击的瞬间  :active
4.鼠标经过  :hover

根标签选择器：
:root{

}
```





## fixed定位

fixed定位参照真正的视口定位，视口的左上角为left：0和top：0。fixed定位不支持在ie6中使用。但是可以在html、body和视口三合一的情况下，通过position：absolute来模拟实现fixed布局。





## 字体大小问题

在chrome中字体默认大小为16px，最小为12px，小于12px的数自动变为12px，但是设置font-size：0 时，可以让字体不可见。字体设为负数时，自动变为16px。







Box是CSS布局的对象和基本单位（即一个页面是由很多个Box组成的）。 元素的类型（块级或行内） 和 displhy 属性的值，决定了这个Box的类型。不同类型的Box，会参与不同的Formatting Context（一个决定如何渲染文档的容器），因此**Box内**的元素会以不同的方式渲染。

块级盒子：display 属性为block，list-item，table的元素，参与block fomatting context（BFC）

行内盒子：display 属性为inline，inline-block，inline-table的元素，参与inline formatting context（IFC）



## Formatting context

Formatting context  它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。
最常见的Formatting context有Block fomatting context（简称BFC）Inline formatting context（简称IFC）。



## Block Formatting Context（块级 格式化 环境）

BFC是一个独立的渲染区域，只有Block-level box参与，它规定了**内部的**(不包括自己）Block-levelBox如何布局，并且与这个区域外部毫不相干。某个元素自己开启BFC后，将不再受父元素的BFC规则的约束，同时自己内部的块级元素都将收到BFC的约束。

BFC中块级元素的布局规则：

- 内部的块级元素独占一行
- 
- 内部的块级Box会在垂直方向，一个接一个地放置。
- BFC自身的区域不会与外部元素的float box重叠。
- 内部的box垂直方向的距离由margin决定。属于同一个BFC的两个相邻的BOX的margin会发生重叠
- BFC就是页面上一个隔离的区域，外面不会影响到内部爱，内部也不会影响到外面
- 计算BFC高度时，浮动元素也会被计算在内（清除浮动haslayout）





根元素html自带BFC，其他开启BFC的方式：

- float属性不为none
- position为absolute或fixed
- overflow不为visible
- display为inline-block，table-cell，table-caption，flex，inline-flex





## 盒子模型

CSS盒模型的组成：外边距（margin）+ 边框（border）+ 内边距（padding）+ 实际内容（content）

两类盒模型：

- W3C盒子模型(标准盒模型)

  盒子总宽度/高度 = `width/height + padding + border + margin`。（ 即 width/height 只是内容高度，不包含 padding 和 border 值 ）

  box-sizing: content-box;

  ![image-20210216182223406](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210216182223406.png)

  

- IE盒子模型(怪异盒模型)

  盒子总宽度/高度 = `width/height + margin = (内容区宽度/高度 + padding + border) + margin`。（ 即 width/height 包含了 padding 和 border 值 ）

  box-sizing: border-box;

  ![image-20210216183733380](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210216183733380.png)



### JS获取盒模型对应的宽和高

- `dom.style.width/height` 只能取到行内样式的宽和高，style 标签中和 link 外链的样式取不到。
- `dom.offsetWidth/offsetHeight` 包括高度（宽度）、内边距和边框，不包括外边距。最常用，兼容性最好。
- `dom.getBoundingClientRect().width/height` 也是得到渲染后的宽和高，大多浏览器支持。IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离。
- `dom.currentStyle.width/height` （只有IE兼容）取到的是最终渲染后的宽和高
- `window.getComputedStyle(dom).width/height` 同（2）但是多浏览器支持，IE9 以上支持。



### Flex布局（弹性布局）

#### 概念

​	响应式地实现各种页面布局。任何一个容器(包括行类元素)都可以指定为 Flex 布局。父元素设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

```css
.selector{
  display: -webkit-flex; //兼容Webkit 内核的浏览器Safari
  display: flex | inline-flex;
}
flex： 将对象作为弹性伸缩盒显示，没有为父元素设置宽度时，默认为auto；
inline-flex：将对象作为内联块级弹性伸缩盒显示，没有给父元素设置宽度，但是父元素默认会根据子元素的宽高去自适应。
```

​	父元素开启flex布局后，父元素称为容器，而父元素内的子元素自动转为容器成员（项目）。项目默认沿主轴排列。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)

#### 	容器（父元素）上的属性：

- display：flex

- flex-direction：属性决定主轴的方向

  

## 视口

视口：浏览器上(也可能是一个app中的webview)用来显示网页的那部分区域。pc端的视口是浏览器窗口区域，而在移动端有三个不同的视口概念：布局视口、视觉视口、理想视口。

布局视口：移动设备上的浏览器都会把自己默认的布局视口设为980px或其他值，个人理解是，在pc端给布局宽度980px左右的页面，可以在移动端完全的展示出来，但是因为移动端的设备水平方向上物理像素一般要小于980px（iphone6的物理像素是750px）移动端浏览器为了做到全部展示默认布局视口大小(980px左右的水平宽度)的页面时，就会对页面进行压缩，所以导致在pc端能正常显示的页面内容看上去非常小（文字，图片很小）；还有一种情况，当在pc端设置的一个宽度非常大的盒子(2000px)时，在移动端去查看，因为移动端浏览器默认是980px,所以移动端会压缩页面，但是只呈现大约pc端980px像素左右的内容，剩下的就会由滚动条来拖动展现。如下图：

```html
<style>
    *{
      margin: 0;
      padding: 0;
    }
    .container{
      height: 100px;
      width: 1000px;
      background-color: #afc;
    }
</style>

<body>
  <div class="container">
    <p>asdlhkzxckjalskrdhlqwndlaskc</p>
  </div>
</body>
```



![image-20210428164404256](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210428164404256.png)



```html
<style>
    *{
      margin: 0;
      padding: 0;
    }
    .container{
      height: 100px;
      width: 2000px;
      background-color: #afc;
    }
</style>

<body>
  <div class="container">
    <p>asdlhkzxckjalskrdhlqwndlaskc</p>
  </div>
</body>
```





![image-20210428164312366](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210428164312366.png)

视觉视口：

用户通过屏幕看到能看到的页面区域，因为移动端浏览器默认布局视口是980px，所以对于pc端页面，可能一打开一个转为pc端设计的页面时，看到的是经过缩放后的页面，但是个人理解，这时在没有横向滚动条的情况下，视觉视口是和布局视口相等的。但是当移动端用户缩放了页面时，视觉视口所要表现的css像素就变少了，视觉视口算数变小了。

下面是我在移动端放大页面后的效果图,刚打开页面时，效果如上面的第一张图，手动放大后，布局视口任然为1000px，但是视觉视口能展现的内容变得很少了，但是字看上去更大了。视口整体所展现的css像素变少了，所以算视口变小了。

```html
<style>
    *{
      margin: 0;
      padding: 0;
    }
    .container{
      height: 100px;
      width: 1000px;
      background-color: #afc;
    }
</style>
<body>
  <div class="container">
    <p>asdlhkzxckjalskrdhlqwndlaskc</p>
  </div>
</body>
```



![image-20210428170351865](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210428170351865.png)

理想视口：

布局视口的宽度设置成了理想视口（浏览器/设备屏幕的宽度）。

 <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0,  maximum-scale=1.0, minimum-scale=1.0">	



像素单位：

- css像素：css中使用的像素单位（px），1px在客观世界是对应一个具体长度和宽度的。衡量页面上的内容大小。

- 设备像素（物理像素）：物理设备显示的单位，与设备、硬件有关，不同设备的物理像素是不同的，且出厂时就确定了。它是每个设备能控制显示的最小单位（小点）。

- 设备像素比（DPR）（物理像素比）：在页面没有缩放的情况下，设备像素比（DPR） = 设备像素个数 / 视觉视口css像素个数(device-width)   ，1px的CSS像素在单一方向上要占据多少了物理像素点。










### Bootstrap

前端UI框架，快速开发响应式网页，不适合开发固定设计稿的网页。

版本：Bootstrap3



#### 学习目标

熟悉Bootstrap中类的使用

理解Boostrap中的编程思想

#### 两个重点容器

- .container
  固定宽度的一个容器，在不同屏幕区间中，表现出的固定宽度不同。
- .container-fluid
  占屏幕的100%的宽度，两边15px的padding



#### 栅格系统

实现响应式布局能力

- 将屏幕默认分为了12等份的宽度，在给元素设置宽度时，以列为单位进行设置。而具体占几列是通过类名来实现的
- 框架将屏幕的大小定义了4中尺寸，通过bootstrap一系列的栅格类去控制元素在不同的屏幕尺寸下所占的列数
  ![image-20210802000500137](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210802000500137.png)
- 列偏移





## css属性的书写顺序

建议：

布局定位相关样式：display、position、float、clear、visibility、overflow

自身属性：width、height、margin、padding、border、background

文本属性：color、font、text-decoration、text-align、vertical-align、white-space、break-word

其他属性（CSS3）：content、cursor、border-radius、box-shadow、text-shadow、background：linear-gradient

![image-20210427232930713](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210427232930713.png)





## 页面布局的整体思路

1. 先确定页面布局的版心，常是一个固定宽度且水平居中的盒子
2. 分析页面中的行模块和以及每行中的列模块
3. 一行中的列模块常用浮动实现，但是注意清除浮动，再确定列的大小，然后再是列的位置
4. 先写出html结构，再写样式，先理清楚布局结构，再写代码

### 导航栏结构建议

- 标签用nav
- 内部是一个ul中放多个li
- 每个小li中放入一个a标签
- 将li标签浮动
- a标签变为块级元素不设置固定的宽度设置内边距将a标签撑开

































