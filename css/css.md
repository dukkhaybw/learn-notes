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

**浮动元素和定位元素的包含块有不同情况：**

对于浮动元素的包含块为**最近的块级祖先元素**。

对于一个非根元素，如果它的 position 为 relative 或者 static，则该元素的包含块为**最近一级的父级块元素的内容（content）区域**。

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

- 分模块导入其他 css，可以将一些公共的 css 样式抽离出来，然后，在其他 css 文件中引入，或者直接在需要使用的该样式文件的 html 中引入

  ```
  在其他css首部引入另一个css
  @import url("common-css/header.css");
  /* @import url("./common-css/header.css"); */ 
  
  在html文件中引入
  <style>
  	@import url("common-css/header.css")
  </style>
  ```

  #### link 标签 与 @import 指令的区别(面试)

  > **1.从属关系区别** >`@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。
  >
  > **2.加载顺序区别** 写在一个加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面css加载后被加载。
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
input[title]{  //选出含有该属性的元素
	...
}

input[title="value"]{ //选出含有该属性且属性值为value的元素
	....
}

input[title$='str']{ //选出含有该属性且属性值为str结尾的元素
	...
}

input[title^='str']{ //选出含有该属性且属性值以str开头的元素
	...
}

input[title*='str']{ //选出含有该属性且属性中有为str字段（不用是一个独立的单词，可以只出现一部分含还该str就可以）的元素
	...
}

input[title~='str']{ //选出含有该属性且属性值以str作为一个完整单词出现的元素
	...
}

input[title|='str']{ //选出含有该属性且属性值以str开头或者str-开头出现的元素
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
4.鼠标经过   :hover

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

Formatting context 它是**页面中的一块渲染区域，并且有一套渲染规则**，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context（简称 BFC）Inline formatting context（简称 IFC）。

## Block Formatting Context（块级 格式化 环境）

BFC 是一个独立的渲染区域，只有 Block-level box 参与，它规定了**内部的**(不包括自己）Block-levelBox 如何布局，并且与这个区域外部毫不相干。某个元素自己开启 BFC 后，将不再受父元素的 BFC 规则的约束，同时自己内部的块级元素都将受到 BFC 的约束。

BFC 中块级元素的布局规则：

- 内部的块级元素独占一行
- 内部的块级 Box 会在垂直方向，一个接一个地放置
- **BFC 自身的区域不会与外部元素的 float box 重叠**
- 内部的 box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个**相邻**的 BOX 的 margin 会发生重叠
- BFC 就是页面上一个隔离的区域，外面不会影响到内部爱，内部也不会影响到外面
- **计算 BFC 高度时，浮动元素也会被计算在内（清除浮动 haslayout）**

根元素 html 自带 BFC，其他开启 BFC 的方式：

- float 属性不为 none
- position 为 absolute 或 fixed
- overflow 不为 visible
- display 为 inline-block，table-cell，table-caption，flex，inline-flex



## 盒子模型

CSS 盒模型的组成：外边距（margin）+ 边框（border）+ 内边距（padding）+ 实际内容（content）

两类盒模型：

- **标准盒模型**

  盒子总宽度/高度 = `width/height + padding + border + margin`。（ 即 width/height 只是设置的内容高度，不包含 padding 和 border 值 ）

  box-sizing: content-box;

  ![image-20210216182223406](..\typora-user-images\image-20210216182223406.png)

- **IE 盒子模型**

  盒子总宽度/高度 = `width/height + margin = (内容区宽度/高度 + padding + border) + margin`。（ 即 width/height 包含了 padding 和 border 值 ）

  box-sizing: border-box;

  ![image-20210216183733380](..\typora-user-images\image-20210216183733380.png)

### JS 获取盒模型对应的宽和高

- `dom.style.width/height` 只能取到行内样式的宽和高，style 标签中和 link 外链的样式取不到。
- `dom.offsetWidth/offsetHeight` 包括高度（宽度）、内边距和边框，不包括外边距。最常用，兼容性最好。
- `dom.getBoundingClientRect().width/height` 也是得到渲染后的宽和高，大多浏览器支持。IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离。
- `dom.currentStyle.width/height` （只有 IE 兼容）取到的是最终渲染后的宽和高
- `window.getComputedStyle(dom).width/height`但是多浏览器支持，IE9 以上支持。



## 视口

视口：浏览器上(也可能是一个 app 中的 webview)用来显示网页的那部分区域。pc 端的视口是浏览器窗口区域，而在移动端有三个不同的视口概念：**布局视口、视觉视口、理想视口**。

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

```html
 <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0,  maximum-scale=1.0, minimum-scale=1.0">
```




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

- 框架将屏幕的大小定义了 4 中尺寸，通过 bootstrap 一系列的栅格类去控制元素在不同的屏幕尺寸下所占的列数 

  ![image-20210802000500137](..\typora-user-images\image-20210802000500137.png)

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





# tailwindcss 

bootstrap 框架中一个类名对应多个 css 属性和值 `<button calss="btn btn-primary btn-lg"></button>` tailwindcss 中需要在 html 标签上写大量的 css 类名来实现自己想要的样式, 单个 class 类名只对应的一个 css 样式，可以直接在 class 中定义自适应的样式

```html
<figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
  <img class="w-24 h-24 rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512" />
  <div class="pt-6 text-center space-y-4">
    <blockquote>
      <p class="text-lg font-medium">
        “Tailwind CSS is the only framework that I've seen scale on large teams. It’s easy to customize, adapts to any
        design, and the build size is tiny.”
      </p>
    </blockquote>
    <figcaption class="font-medium">
      <div class="text-sky-500 dark:text-sky-400">Sarah Dayan</div>
      <div class="text-slate-700 dark:text-slate-500">Staff Engineer, Algolia</div>
    </figcaption>
  </div>
</figure>
```

tailwindcss 的优势：

- 随着项目的增大，所有的 class 都是框架内置提供的，且用不到的还会被框架剔除，css 代码并不会增加多少

- 比起内联样式要写属性名和值，tailwindcss 只需要写一个类名即可

- 采用移动优先的策略，不必再写媒体查询 css 代码，可以再任意类名前面加上 sm: md: lg:等前缀实现页面的响应式设计，可以直接在 class 中定义自适应样式

  - `md:flex` 表示当屏幕尺寸大于 medium 时，才表现出 flex 布局。
  - `md:p-0`表示当屏幕尺寸大于 medium 时，padding 取 0

- 支持 hover:和 focus:状态

- class 名词过长也可以使用@apply 指令将原子类的样式赋值到自己的 css 中

  ```css
  .btn {
    @apply text base font bg-sky-500 text-white;
  }
  ```

- 暗黑模式，dark:

- 容易扩展调整，在 tailwind.config.js 配置文件中配置自己的颜色，字体，尺寸等

- 相当于帮助构建了一套设计系统，规范，约束设计

- 基于内置的 api 约束，在颜色，间距，版式，阴影等方面使用上有一定的约束而不是使用任意颜色值，规范网页

- vscode 插件支持 -tailwindcss

一个 css 原子类框架，不必再写 css 而全部使用类代替，比如 flex,pt-4,text-center 等。

示例代码：

```html
<div class="container mx-auto p-10 md:p-20 duration-500">
  <div class="mx-auto flex max-w-xl flex-wrap shadow-lg md:flex-nowrap">
    <img src="https://cdn.yiban.io/style_template/1578647793165_5758926.jpg" class="h-auto w-full md:w-40" />
    <div class="my-auto p-10">
      <h1 class="text-2xl font-semibold text-gray-800">2023 新年快乐</h1>
      <div class="mt-2 text-base text-gray-400">
         恭贺新年快乐
        <span class="text-red-500">财源滚滚</span>
      </div>
    </div>
  </div>
</div>
```

上面的 HTML 代码片段以及 Tailwind CSS 类的页面的表现如下：

1. `container mx-auto p-10 md:p-20 duration-500`：
   - `container`：设置最大宽度并根据屏幕大小居中内容。
   - `mx-auto`：在水平方向上自动分配外边距，实现水平居中。
   - `p-10`：在小屏幕上所有方向的内边距为 `10`。
   - `md:p-20`：在中等屏幕尺寸（如平板）和更大的屏幕上，内边距增加到 `20`。
   - `duration-500`：设置过渡效果的持续时间为 500 毫秒。
2. `flex max-w-xl flex-wrap shadow-lg md:flex-nowrap`：
   - `flex`：设置为弹性容器。
   - `max-w-xl`：最大宽度设置为 `xl` 尺寸。
   - `flex-wrap`：允许子元素在必要时换行。
   - `shadow-lg`：应用大号阴影效果。
   - `md:flex-nowrap`：在中等屏幕尺寸及以上不允许子元素换行。
3. 图片 (`img`) 标签：
   - `h-auto w-full md:w-40`：在小屏幕上图片宽度为容器的 100%（`w-full`），高度自动调整（`h-auto`）以保持图片的宽高比；在中等屏幕尺寸及以上，图片宽度被限制为 `40`。
4. 文字容器 (`div`)：
   - `my-auto p-10`：在 Y 轴方向上自动调整外边距以垂直居中，所有方向的内边距为 `10`。
5. 标题 (`h1`)：
   - `text-2xl font-semibold text-gray-800`：文本尺寸为 `2xl`，字体半粗体，文本颜色为灰色。
6. 文本段落 (`div`)：
   - `mt-2 text-base text-gray-400`：上边距为 `2`，文本尺寸为基础大小，文本颜色为淡灰色。

此代码实现了一个响应式设计，包括图片和文本的布局。在小屏幕上，内容可能会堆叠，而在中等屏幕尺寸及以上，图片和文本将会并排显示，且不会换行。图片和文本区域都会有内边距和边框阴影，形成突出的卡片效果。在过渡效果方面，可能会应用到某些 CSS 属性的变化，使得这些变化在 500 毫秒内平滑过渡。



什么是 tailwindcss？

从最开始写 css 到现在写 css，这个习惯是否有什么变化？风格是否有什么变化？

假设需要实现一个类似金字塔的页面：

```html
<div class="demo1"></div>
<div class="demo2"></div>
<div class="demo3"></div>
<div class="demo4"></div>
<div class="demo5"></div>
<div class="demo6"></div>
```

```css
/* 原生写法 */
.demo1 {
  width: 100px;
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}
.demo2 {
  width: 200px;
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}
.demo3 {
  width: 300px;
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}
.demo4 {
  width: 400px;
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}
.demo5 {
  width: 500px;
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}
.demo6 {
  width: 600px;
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}
```

上面这种当时的代码量有非常多的冗余代码。

优化：

```html
<div class="demo1 demo"></div>
<div class="demo2 demo"></div>
<div class="demo3 demo"></div>
<div class="demo4 demo"></div>
<div class="demo5 demo"></div>
<div class="demo6 demo"></div>
```

```css
/* 组件化的写法 */
/* 样式组件 */
.demo {
  height: 30px;
  background-color: darkorange;
  text-align: center;
  color: #fff;
  line-height: 30px;
  margin-bottom: 10px;
}

.demo1 {
  width: 100px;
}
.demo2 {
  width: 200px;
}
.demo3 {
  width: 300px;
}
.demo4 {
  width: 400px;
}
.demo5 {
  width: 500px;
}
.demo6 {
  width: 600px;
}
```

这种写法也方便扩展和维护。其实 bootstrp 等一下 css 框架就是借用了组件化的思想预先实现了一批 css 样式类，开发者直接取用就可以。

组件化的不足：需要自己取定义样式的情况的不够灵活，需要考虑自己写能覆盖 bootstrap 中的样式。

而 tailwindcss 采用了另一种设计思想——**零件化或者原子化**

他不帮助开发者封装任何样式组件，他是将每一个单独的样式给封装起来了。





### 移动端布局

# rem 布局

解决问题：

- 页面布局时文字的大小也能随着屏幕的变化而变化
- 流式布局和 flex 布局主要都是针对宽度布局，但是高度是确定的，rem 布局可以让高度自适应
- 屏幕变化时让元素的宽和高等比例缩放

rem（root em）是一个相对单位，与之类似的是 em，em 相对的是父元素的字体大小。rem 则是相对于 html 元素的字体大小而定的。

使用 em 的话会因为每个盒子可能的字体大小不同，导致整个页面很难有一个统一的标准。而 rem 则很好的避免了这个问题。在不同的屏幕宽度下，对 html 元素的字体大小进行设置，就能间接的实现相应式。

媒体查询（media query）——css3 新语法

通过媒体查询设置在不同的屏幕尺寸下，让 html 的 font-size 属性设置为不同字体大小。而页面中的其他元素都使用 rem 来作为长度单位。

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

## link 标签中的媒体查询

当在不同的屏幕尺寸下，有一些列的 css 样式需要应用。这是如果将 css 样式都写在一个 css 文件中就会非常杂乱。这时可以将不同屏幕尺寸下的一套 css 样式分为一个 css 文件，再通过结合媒体查询按条件生效。

```
<link href='./index320.css' media='screen and (min-width:320px)'></link>
<link href='./index640.css' media='screen and (min-width:640px)'></link>
```

### 开发中注意

当设计师给到自己移动端的原稿图时，自己首先要确定原稿图的 css 像素是多大。然后按照原稿图中的每个元素的自身 px 单位大小，按照一个基准（原稿图的 10 分之一或者 15 分之一或者 20 分之一），将他们转为 rem 单位，然后之后的只需要改变 html 的字体大小就可以实现宽高的动态变化。

让一些不能等比例自适应的元素在屏幕尺寸发生改变时能等比例的缩放。以前的开发，让宽度可以等比例缩放，但是高度是写死的。现在希望在不同屏幕尺寸下，高度也能产生变化。页面元素的宽高也能按照原有比例进行缩放。

## rem 适配方案

媒体查询加上 rem。

实际开发时的方案

按照设计稿与设备宽度的比例，动态计算并设置 html 标签的 font-size 大小；css 中，将设计稿**元素**中的宽高和相对位置取值，按照同等比例换算为 rem 为单位的值。

开发中帮助实现 rem 布局的技术：

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

不用写不同屏幕下的媒体查询，而用 js 实现。它内部的原理是将当前设备划分为 10 等份，一等份作为 html 的文字大小 ，不同屏幕下比例还是一致的。

## Bootstrap

（\*）通配符选择器是无法匹配到伪元素选择器的，所以在 bootstrap 中使用了如下 css：

```
*{
	box-sizing:border-box;
}
:after,:before{
	box-sizing:border-box;
}
```

在 bootstrap 中的 css 样式重置使用的是 Normalize.css。

### 流体容器

class="container-fluid"的容器，就相当于 width 为 auto 的容器。

![image-20210516225224967](D:\learn-notes\css\images\image-20210516225224967.png)

### 固定容器（常用）

class = "container"的容器，多出了媒体查询。

![image-20210516225422378](D:\learn-notes\css\images\image-20210516225422378.png)

![image-20210516231143812](D:\learn-notes\css\images\image-20210516231143812.png)

### 栅格系统

在固定容器内部，有行和列的区分。

行：class="row"，一行分为 12 列。



### 视口

浏览器显示页面内容的那部分屏幕区域。

- 布局视口
- 视觉视口
- 理想视口

布局视口（layout viewport）

在 pc 端的布局一般都在 980px 以上，而手机端的浏览器在没有做移动端适配的情况下，默认能设置为 980px 的布局视口，但是 980px 及以上的页面需要在 750 像素的手机或者更小的手机上展示出来的。所以会自动将页面进行压缩，导致的结果就是页面元素看上去偏小，无法看清楚，需要手动缩放和滑动。

pc 端页面：

![image-20210531225133695](D:\learn-notes\css\images\image-20210531225133695.png)

pc 端未作适配的页面在手机上显示：

![image-20210531225219215](D:\learn-notes\css\images\image-20210531225219215.png)

视觉视口（visual viewport）

用户所能看到的页面的那部分区域。

理想视口（ideal viewport）

布局视口的宽度就等于设备的视觉视口的宽度，这样就无需缩放。

开启理想视口需要使用 meta 标签。

多倍图

物理像素（分辨率）：真实存在的物理像素点，只是不同设备的物理像素点数量不一样。

在 oc 端开发时，开发单位也写为 1px，但是它并不意味着和移动端的 1 物理像素对应。这就导致了一个问题，在开发时我们的图片都是用 css 像素表示的，如果同样单位的大小的图片放在移动端去显示的话，图片所占据的物理像素点可能翻倍

。而如果想让图片呈现出最好的显示效果，就需要让 1 物理像素和图片的 1css 像素一一对应。所以常常看到设计师给的设计图往往是移动端布局宽度的 2 倍或者 3 倍或者多倍。这样自己在切除图片并使用时，可以统一设置将图片元素的宽高设为之前的二分之一，然后在移动端会自动方法。





#### 移动端适配或者布局方案

- 流式布局（百分比布局），元素的宽度不再写死，而多用百分比，高度可以固定。

- flex 布局

- less+rem 布局+媒体查询或者 flexible.js

- 混合布局

- 单独制作移动端页面

- 媒体查询
- bootstrap







## flex

传统的布局方式是：基于盒子模型+display+position+float实现。

任何一个容器都可以指定为 Flex 布局：

```css
.box{
  display: flex;
}

.box{
  display: inline-flex;
}
```

盒子设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

<img src="D:\learn-notes\css\images\image-20240307211042215.png" alt="image-20240307211042215" style="zoom:200%;" />

容器上的属性：

- flex-direction：决定主轴的方向（即项目的排列方向）。

  ```css
  .box {
    flex-direction: row | row-reverse | column | column-reverse;
  }
  ```

  ![image-20240307211224811](D:\learn-notes\css\images\image-20240307211224811.png)

  - `row`（默认值）：主轴为水平方向，起点在左端。
  - `row-reverse`：主轴为水平方向，起点在右端。
  - `column`：主轴为垂直方向，起点在上沿。
  - `column-reverse`：主轴为垂直方向，起点在下沿。

- flex-wrap：是否允许换行

  ```css
  .box{
    flex-wrap: nowrap | wrap | wrap-reverse;
  }
  ```

  

- flex-flow：`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

- justify-content：定义了项目在主轴上的对齐方式。

  ```css
  .box {
    justify-content: flex-start | flex-end | center | space-between | space-around;
  }
  ```

- align-items：定义项目在交叉轴上如何对齐。

  ```css
  .box {
    align-items: flex-start | flex-end | center | baseline | stretch;
  }
  ```

  

- align-content：定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

  ```css
  .box {
      align-content: flex-start | flex-end | center | space-between | space-around | stretch;
  }
  ```

  

**项目上的属性**

- `order`：定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- `flex-grow`：定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。
- `flex-shrink`：定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- `flex-basis`：定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。
- `flex`：`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。
- `align-self`：允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。



## Grid

它将网页划分成一个个网格，可以任意组合不同的网格，做出各种各样的布局。

Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。

