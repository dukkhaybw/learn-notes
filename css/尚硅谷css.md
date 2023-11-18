# css 知识总结

## 系统滚动条

滚动条有两个，一个在 document 上，一个在 body 上。默认只显示 document 上的滚动条。

在 body 不设置高度的时候，body 的高度由内容撑开。而 document 上的滚动条是否出现取决于 body 的高度是否超出视口的高度。

document 上的滚动条受到 html 和 body 的 overflow 属性的值影响。

- 只有 body 和 html 中的其中一个设置的 overflow：scroll 时，滚动条打开的都是 document 上的滚动条
- 给 body 上设置 overflow：scroll 的同时给 html 设置 overflow：hidden，则关闭 document 上的滚动条而开启 body 上的滚动条
- 给 body 和 html 同时设置 overflow：hidden，那 document 和 body 上的滚动条都关闭
- 给 body 和 html 同时设置 overflow：scroll，那 document 和 body 上的滚动条都打开
- 只给 body 或者 html 其中一个设置 overflow:hidden 时，都隐藏 document 上的滚动条

如果想让 body 上的滚动条代替 document 上的滚动条，需要先让 body 占满整个视口的高度（height：100%），宽度默认为 auto。

```css
html{
    overflow:hidden;
    height:100%;  //提供高度给视口高度给body去参照继承
}
body{
    overflow:auto;
    height:100%;
}

在没给html设置height：100%时，直接给body设置height：100%是无效的，body的高度还是由内容撑开。
```

给 html 设置的许多属性都直接作用于 document 上，因为 document 无法获取和控制。

在 css 中由外向内依次是：document =>初始包含块 =>html =>body



## 初始包含块

初始包含块是一个视口大小的矩形。它也是 html 元素的包含块，初始包含块由用户代理建立。

浮动元素和定位元素的包含块有不同情况：

对于浮动元素的包含块为最近的块级祖先元素。

对于一个非根元素，如果它的 position 为 relative 或者 static，则该元素的包含块为最近一级的父级块元素的内容（content）区域。

对于一个非根元素，如果它的 position 为 absolute，则包含块设置为最近的 position 值不为 static 的祖先元素，并且 top 和 left 值的基点是该祖先元素的 padding 区域的左上角。

对于开启绝对定位的元素，在父级元素都没有开启定位的情况下，元素参考初始包含块进行定位。

定位的元素的 top（bottom）与 left（right）值：

- left（right）：定义了定位元素的左外边距边界与其包含块左边界之间的偏移，非定位元素设置此属性无效。
- 默认值：auto
- 百分比单位： 设置以包含块元素的 padding 以内的区域的宽度的百分比计的左边位置。可使用负值。 percentages of the width of the containing block

- top（bottom）：该属性定义了一个定位元素的上外边距边界与其包含块上边界之间的偏移。
- 默认值：auto
- 百分比单位： 设置以包含块元素的 padding 以内的区域的高度的百分比计的上边位置。可使用负值。

## 百分比单位参照

width 的默认值不是 0，而是 auto，当单位为百分比时，参照包含块的 content 区域的宽度。

height 的默认值不是 0，也不是 auto，而是由内容撑开，当单位为百分比时，参照包含块的 content 区域的高度。

margin 与 padding 的默认值为 0，不是 auto，当单位为百分比时，都参照包含块的的 content 区域的宽度。

## css 引入方式：

- 通过在头部写 link 标签

  ```
  <link rel="stylesheet" href="./index.css" type="text/css">
  ```

- css 规则写在 style 这个 html 标签内部

  ```
  <style>
      h1{
        color: blue;
      }
  </style>
  ```

- 写在标签的 style 属性内部

  ```
  <h1 style="font-size: 20px;">hello world</h1>
  ```

- 分模块导入其他 css，可以将一些公共的 css 样式抽离出来，染后，在其他 css 文件中引入，或者直接在需要使用的该样式文件的 html 中引入

  ```
  在其他css首部引入另一个css
  @import url("common-css/header.css");
  /* @import url("./common-css/header.css"); */  //都正确
  
  在html文件中引入
  <style>
  	@import url("common-css/header.css")
  </style>
  ```

  #### link 标签 与 @import 指令的区别(面试)

  > **1.从属关系区别** >`@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。
  >
  > **2.加载顺序区别** 写在一个加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。
  >
  > **3.兼容性区别** >`@import`是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；`link`标签作为 HTML 元素，不存在兼容性问题。
  >
  > **4.DOM 可控性区别** 可以通过 JS 操作 DOM ，插入`link`标签来改变样式；由于 DOM 方法是基于文档的，无法使用`@import`的方式插入样式。
  >
  > **5.没有权重区别** >`link`引入的样式权重并不大于`@import`引入的样式，在同一个页面中引入它们，在权重一样的情况下都遵循层叠原则
  >
  > **6.书写位置不同**

### 属性选择器

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

当这些伪类同时应用于同一个元素时，它们的优先级顺序如下：

1. link：适用于未访问过的链接（默认状态）。优先级最低。
2. visited：适用于已访问过的链接。优先级次于 link。
3. hover：适用于鼠标悬停在链接上的状态。优先级在 link 和 visited 之上。
4. active：适用于链接被激活的状态，通常是用户点击链接但尚未释放鼠标按钮的瞬间。优先级最高。





## fixed 定位

fixed 定位参照真正的视口定位，视口的左上角为 left：0 和 top：0。fixed 定位不支持在 ie6 中使用。但是可以在 html、body 和视口三合一的情况下，通过 position：absolute 来模拟实现 fixed 布局。

## 字体大小问题

在 chrome 中字体默认大小为 16px，最小为 12px，小于 12px 的数自动变为 12px，但是设置 font-size：0 时，可以让字体不可见。字体设为负数时，自动变为 16px。

Box 是 CSS 布局的对象和基本单位（即一个页面是由很多个 Box 组成的）。 元素的类型（块级或行内） 和 displhy 属性的值，决定了这个 Box 的类型。不同类型的 Box，会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此**Box 内**的元素会以不同的方式渲染。

块级盒子：display 属性为 block，list-item，table 的元素，参与 block fomatting context（BFC）

行内盒子：display 属性为 inline，inline-block，inline-table 的元素，参与 inline formatting context（IFC）

## Formatting context

Formatting context 它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context（简称 BFC）Inline formatting context（简称 IFC）。

## Block Formatting Context（块级 格式化 环境）

BFC 是一个独立的渲染区域，只有 Block-level box 参与，它规定了**内部的**(不包括自己）Block-levelBox 如何布局，并且与这个区域外部毫不相干。某个元素自己开启 BFC 后，将不再受父元素的 BFC 规则的约束，同时自己内部的块级元素都将收到 BFC 的约束。

BFC 中块级元素的布局规则：

- 内部的块级元素独占一行
-
- 内部的块级 Box 会在垂直方向，一个接一个地放置。
- BFC 自身的区域不会与外部元素的 float box 重叠。
- 内部的 box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻的 BOX 的 margin 会发生重叠
- BFC 就是页面上一个隔离的区域，外面不会影响到内部爱，内部也不会影响到外面
- 计算 BFC 高度时，浮动元素也会被计算在内（清除浮动 haslayout）

根元素 html 自带 BFC，其他开启 BFC 的方式：

- float 属性不为 none
- position 为 absolute 或 fixed
- overflow 不为 visible
- display 为 inline-block，table-cell，table-caption，flex，inline-flex

## 盒子模型

CSS 盒模型的组成：外边距（margin）+ 边框（border）+ 内边距（padding）+ 实际内容（content）

两类盒模型：

- W3C 盒子模型(标准盒模型)

  盒子总宽度/高度 = `width/height + padding + border + margin`。（ 即 width/height 只是内容高度，不包含 padding 和 border 值 ）

  box-sizing: content-box;

  ![image-20210216182223406](..\typora-user-images\image-20210216182223406.png)

- IE 盒子模型(怪异盒模型)

  盒子总宽度/高度 = `width/height + margin = (内容区宽度/高度 + padding + border) + margin`。（ 即 width/height 包含了 padding 和 border 值 ）

  box-sizing: border-box;

  ![image-20210216183733380](..\typora-user-images\image-20210216183733380.png)

### JS 获取盒模型对应的宽和高

- `dom.style.width/height` 只能取到行内样式的宽和高，style 标签中和 link 外链的样式取不到。
- `dom.offsetWidth/offsetHeight` 包括高度（宽度）、内边距和边框，不包括外边距。最常用，兼容性最好。
- `dom.getBoundingClientRect().width/height` 也是得到渲染后的宽和高，大多浏览器支持。IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离。
- `dom.currentStyle.width/height` （只有 IE 兼容）取到的是最终渲染后的宽和高
- `window.getComputedStyle(dom).width/height` 同（2）但是多浏览器支持，IE9 以上支持。

### Flex 布局（弹性布局）

#### 概念

 响应式地实现各种页面布局。任何一个容器(包括行类元素)都可以指定为 Flex 布局。父元素设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

```css
.selector{
  display: -webkit-flex; //兼容Webkit 内核的浏览器Safari
  display: flex | inline-flex;
}
flex： 将对象作为弹性伸缩盒显示，没有为父元素设置宽度时，默认为auto；
inline-flex：将对象作为内联块级弹性伸缩盒显示，没有给父元素设置宽度，但是父元素默认会根据子元素的宽高去自适应。
```

 父元素开启 flex 布局后，父元素称为容器，而父元素内的子元素自动转为容器成员（项目）。项目默认沿主轴排列。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)

#### 容器（父元素）上的属性：

- display：flex

- flex-direction：属性决定主轴的方向

## 视口

视口：浏览器上(也可能是一个 app 中的 webview)用来显示网页的那部分区域。pc 端的视口是浏览器窗口区域，而在移动端有三个不同的视口概念：布局视口、视觉视口、理想视口。

布局视口：移动设备上的浏览器都会把自己默认的布局视口设为 980px 或其他值，个人理解是，在 pc 端给布局宽度 980px 左右的页面，可以在移动端完全的展示出来，但是因为移动端的设备水平方向上物理像素一般要小于 980px（iphone6 的物理像素是 750px）移动端浏览器为了做到全部展示默认布局视口大小(980px 左右的水平宽度)的页面时，就会对页面进行压缩，所以导致在 pc 端能正常显示的页面内容看上去非常小（文字，图片很小）；还有一种情况，当在 pc 端设置的一个宽度非常大的盒子(2000px)时，在移动端去查看，因为移动端浏览器默认是 980px,所以移动端会压缩页面，但是只呈现大约 pc 端 980px 像素左右的内容，剩下的就会由滚动条来拖动展现。如下图：

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .container {
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

![image-20210428164404256](..\typora-user-images\image-20210428164404256.png)

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .container {
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

![image-20210428164312366](..\typora-user-images\image-20210428164312366.png)

视觉视口：

用户通过屏幕看到能看到的页面区域，因为移动端浏览器默认布局视口是 980px，所以对于 pc 端页面，可能一打开一个转为 pc 端设计的页面时，看到的是经过缩放后的页面，但是个人理解，这时在没有横向滚动条的情况下，视觉视口是和布局视口相等的。但是当移动端用户缩放了页面时，视觉视口所要表现的 css 像素就变少了，视觉视口算数变小了。

下面是我在移动端放大页面后的效果图,刚打开页面时，效果如上面的第一张图，手动放大后，布局视口任然为 1000px，但是视觉视口能展现的内容变得很少了，但是字看上去更大了。视口整体所展现的 css 像素变少了，所以算视口变小了。

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .container {
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

![image-20210428170351865](..\typora-user-images\image-20210428170351865.png)

理想视口：

布局视口的宽度设置成了理想视口（浏览器/设备屏幕的宽度）。

 <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0,  maximum-scale=1.0, minimum-scale=1.0">

像素单位：

- css 像素：css 中使用的像素单位（px），1px 在客观世界是对应一个具体长度和宽度的。衡量页面上的内容大小。

- 设备像素（物理像素）：物理设备显示的单位，与设备、硬件有关，不同设备的物理像素是不同的，且出厂时就确定了。它是每个设备能控制显示的最小单位（小点）。

- 设备像素比（DPR）（物理像素比）：在页面没有缩放的情况下，设备像素比（DPR） = 设备像素个数 / 视觉视口 css 像素个数(device-width) ，1px 的 CSS 像素在单一方向上要占据多少了物理像素点。

### Bootstrap

前端 UI 框架，快速开发响应式网页，不适合开发固定设计稿的网页。

版本：Bootstrap3

#### 学习目标

熟悉 Bootstrap 中类的使用

理解 Boostrap 中的编程思想

#### 两个重点容器

- .container 固定宽度的一个容器，在不同屏幕区间中，表现出的固定宽度不同。
- .container-fluid 占屏幕的 100%的宽度，两边 15px 的 padding

#### 栅格系统

实现响应式布局能力

- 将屏幕默认分为了 12 等份的宽度，在给元素设置宽度时，以列为单位进行设置。而具体占几列是通过类名来实现的
- 框架将屏幕的大小定义了 4 中尺寸，通过 bootstrap 一系列的栅格类去控制元素在不同的屏幕尺寸下所占的列数 ![image-20210802000500137](..\typora-user-images\image-20210802000500137.png)
- 列偏移

## css 属性的书写顺序

建议：

布局定位相关样式：display、position、float、clear、visibility、overflow

自身属性：width、height、margin、padding、border、background

文本属性：color、font、text-decoration、text-align、vertical-align、white-space、break-word

其他属性（CSS3）：content、cursor、border-radius、box-shadow、text-shadow、background：linear-gradient

![image-20210427232930713](..\typora-user-images\image-20210427232930713.png)

## 页面布局的整体思路

1. 先确定页面布局的版心，常是一个固定宽度且水平居中的盒子
2. 分析页面中的行模块和以及每行中的列模块
3. 一行中的列模块常用浮动实现，但是注意清除浮动，再确定列的大小，然后再是列的位置
4. 先写出 html 结构，再写样式，先理清楚布局结构，再写代码

### 导航栏结构建议

- 标签用 nav
- 内部是一个 ul 中放多个 li
- 每个小 li 中放入一个 a 标签
- 将 li 标签浮动
- a 标签变为块级元素不设置固定的宽度设置内边距将 a 标签撑开
