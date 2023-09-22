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



