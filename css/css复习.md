# CSS 复习

标题标签和 p 标签中不能放其他块级元素，

## 滚动条

html 元素自身没有滚动条，即使在 html 元素设置了固定高度的情况下，超出部分的导致滚动条的出现，滚动条也是出现在文档 document 上的。

```html
<style>
  html {
    margin: 10px;
    padding: 10px;
    border: 2px solid #ccc;
    overflow: auto;
  }
  .app {
    height: 1200px;
  }
</style>

<body>
  <div class="app"></div>
</body>
```

![image-20220523000403272](..\typora-user-images\image-20220523000403272.png)

html 和 body 在不设置高度的情况下，默认都是由内容撑开高度。但内容超过页面可视区高度时，将默认在文档上生成滚动条。

当 html 和 body 都设置了高度的使用，比如高度都是 100%且 overflow 都不明确设置值或者都为 auto 时，当 body 中的内容的高度超过 body 高度在 100%情况下的高度时，将由内容区域撑开页面的高度，产生系统滚动条，而 html 和 body 的高度不变。

当 html 和 body 都设置了高度的使用，比如高度都是 100%且 html 设置 overflow 为 hidden 而 body 的 overflow 为 auto 时，当 body 中的内容的高度超过 body 高度在 100%情况下的高度时，将由内容区域仍旧是一个页面可视区的高度而并没有撑开页面，但是会出现滚动条，而通过滚动 body 的滚动条来展示多余的部分。

下面代码的情况虽然 body 的高度继承了 html，而 html 的高度继承了 document，但是在 body 中内容超出 body 高度时，滚动条任然不是产生在 body 而是产生在文档上的。 (单独给 html 或者 body 设置 overflow 为 auto 时，仍然只出现文档滚动条)

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  html {
    height: 100%;
  }
  body {
    height: 100%;
    border: 2px solid;
    overflow: auto;
  }
  .app {
    height: 1200px;
  }
</style>

<body>
  <div class="app"></div>
</body>
```

![image-20220523003125725](..\typora-user-images\image-20220523003125725.png)

在 body 高度固定，却 body 和 html 的高度都为固定值时，才会在 body 和文档上都出现滚动条。

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  html {
    height: 100%;
    overflow: auto;
  }
  body {
    height: 100%;
    border: 2px solid;
    overflow: auto;
  }
  .app {
    height: 1200px;
  }
</style>
<body>
  <div class="app"></div>
</body>
```

![image-20220523003358420](..\typora-user-images\image-20220523003358420.png)

在 html 的 overflow 值为 hidden 而 body 的高度确定且 overflow 值为 auto 时，才会只出现 body 的滚动条而隐藏系统滚动条。

面试：绝对定位模拟固定定位

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  html {
    height: 100%;
    overflow: hidden; // 隐藏系统滚动条
  }
  body {
    height: 100%;
    overflow: auto; // 打开body自身的滚动条
  }
  .fiexd {
    position: absolute; //
    width: 50px;
    height: 50px;
    top: 50px;
    left: 50px;
    background-color: #afc;
  }
  .app {
    height: 1200px;
  }
</style>
<body>
  <div class="fiexd"></div>
  <div class="app"></div>
</body>
```

## 边框图片

border-image-source：该属性使用一张图片作为边框样式，默认为 none，而导致 border-style 定义的 css 样式生效。

```css
border-image-source: url(....)
border: 10px solid;
```

border-image-slice：将 border-image-source 指定的图片分为 9 个区域，四角加四边和一个中心区域，并且可以指定偏移量，默认是 100%。

```css
border-image-slice: n1% n2% n3% n4%; // 上  右  下  左
```

border-image-repeat：定义图片如何填充边框。

border-image-width：定义图片边框宽度。

border-image-outset

行高的继承特点需要注意

## CSS 动画

### transform

平移：

```css
transform:translate(x,y)

transform:translateX(x)

transform:translateY(y)
```

移动的元素不会影响其他元素的位置，transform 移动是使用百分比单位时，是以元素自身的宽度和高度为基准，对行内元素没有效果。

旋转：

```css
transform:ratate(ndeg)

transform-origin:x y;
```

缩放：

```css
transform: scale(n1, n1);
```

不会影响其他元素的位置

动画相对于过渡能实现更细腻的控制。

定义动画：

```css
@keyframes animationName {
  0% {
    //...
  }
  10% {
    //...
  }
  //....
  100% {
    //...
  }
}
```

使用动画：

```css
animation-name:animationName
animation-duration:time s


animation-timing-function:steps(n)
```



## BFC

BFC的概念，特点和开启BFC能解决的问题。





- 通过查看设计稿发现整个网站距离两边都有一些空白边距，所以可以使用一个容器，方便调整边距。

- 头部可以用语义化标签 header

- 导航栏用 nav

- 导航按钮可以用 a 标签

- 主要内容区域可以使用 main 标签标识

- 底部用 footer 语义化标签

- 在写页面时，可以尝试先写 html 结构再写 css 样式

- 按钮默认有圆角效果，取消圆角效果设置border-radius: 0;

- 字体阴影 text-shadow

- object-fit 属性指定该元素的内容应该如何调整自己的宽度或者高度去适应父容器的高度与宽度。用在 img 标签中时，一般可以对该元素进行保留原始比例的剪切、缩放或者直接进行拉伸等。

  object-fit: fill|contain|cover|scale-down|none|initial|inherit;

  - fill:根据需要压缩或者拉伸图片，以填充满父容器(默认值)

    ![image-20210517225029508](C:/Users/shuyi/Desktop/learn-notes/typora-user-images/image-20210517225029508.png)

  - contain:只对一边需要压缩或者拉伸图片，另一边按照原有比例等比例压缩或者拉升。不能保证填充满父容器

    ![image-20210517224846490](C:/Users/shuyi/Desktop/learn-notes/typora-user-images/image-20210517224846490.png)

  - cover：对图片进行等比例的压缩或者拉升，确保完全覆盖父容器，但是可能会切掉图片的部分内容

    ![image-20210517224902323](C:/Users/shuyi/Desktop/learn-notes/typora-user-images/image-20210517224902323.png)

  - scale-down：对图片进行等比例的压缩或者拉升，当最短的一边占满则不再拉升或者压缩，可能无法完全覆盖父容器

    ![image-20210517224944668](C:/Users/shuyi/Desktop/learn-notes/typora-user-images/image-20210517224944668.png)

  - none：保留原有元素内容的长度和宽度，也就是说内容不会被重置。

![image-20210517225007211](C:/Users/shuyi/Desktop/learn-notes/css/images/image-20210517225007211.png)







## CSS 文本换行

正常情况下，在固定宽度的盒子中的**中文**会自动换行。例子如下

html：

```html
<body>
  <div class="test">哈哈哈哈哈哈哈哈哈哈</div>
</body>
```

css:

```css
.test{
  width: 60px;
  background-color: aquamarine;
}
```

页面效果：

![image-20231120092206310](C:/Users/shuyi/Desktop/learn-notes/css/images/image-20231120092206310.png)

所以就如以上所说的，对于固定宽度的盒子，盒子内部的中文文字超过盒子的宽度时，会自动换行。



**当遇到非常长的英文单词或者很长的URL时，文本可能就不会自动换行，从而导致各种布局问题。**

html：

```html
<body>
  <div class="test">https://www.runoob.com/w3cnote/css-nowrap-break-word.html</div>
</body>
```

css还是和上面一样。这时页面的表现如下：

![image-20231120092103824](C:/Users/shuyi/Desktop/learn-notes/css/images/image-20231120092103824.png)



为此可以参考一些css属性来解决：

- `overflow-wrap`
- `word-break`
- `white-space`
- `line-break`
- `hyphens`



### overflow-wrap

overflow-wrap：用来说明当一个不能被分开的字符串太长而不能填充其包裹盒时，为防止其溢出，浏览器是否允许这样的单词中断换行。
