# CSS复习



标题标签和p标签中不能放其他块级元素，



## 滚动条

html元素自身没有滚动条，即使在html元素设置了固定高度的情况下，超出部分的导致滚动条的出现，滚动条也是出现在文档document上的。

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

![image-20220523000403272](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220523000403272.png)

html和body在不设置高度的情况下，默认都是由内容撑开高度。但内容超过页面可视区高度时，将默认在文档上生成滚动条。

当html和body都设置了高度的使用，比如高度都是100%且overflow都不明确设置值或者都为auto时，当body中的内容的高度超过body高度在100%情况下的高度时，将由内容区域撑开页面的高度，产生系统滚动条，而html和body的高度不变。 

当html和body都设置了高度的使用，比如高度都是100%且html设置overflow为hidden 而body的overflow为auto时，当body中的内容的高度超过body高度在100%情况下的高度时，将由内容区域仍旧是一个页面可视区的高度而并没有撑开页面，但是会出现滚动条，而通过滚动body的滚动条来展示多余的部分。



下面代码的情况虽然body的高度继承了html，而html的高度继承了document，但是在body中内容超出body高度时，滚动条任然不是产生在body而是产生在文档上的。 (单独给html或者body设置overflow为auto时，仍然只出现文档滚动条)

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

![image-20220523003125725](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220523003125725.png)



在body高度固定，却body和html的高度都为固定值时，才会在body和文档上都出现滚动条。

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

![image-20220523003358420](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220523003358420.png)







在html的overflow值为hidden而body的高度确定且overflow值为auto时，才会只出现body的滚动条而隐藏系统滚动条。

面试：绝对定位模拟固定定位

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    html {
        height: 100%;
        overflow: hidden;   // 隐藏系统滚动条
    }
    body {
        height: 100%;
        overflow: auto;  // 打开body自身的滚动条
    }
    .fiexd {
        position: absolute;  // 
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

border-image-source：该属性使用一张图片作为边框样式，默认为none，而导致border-style定义的css样式生效。

```css
border-image-source: url(....)
border: 10px solid;
```

border-image-slice：将border-image-source指定的图片分为9个区域，四角加四边和一个中心区域，并且可以指定偏移量，默认是100%。

```css
border-image-slice:n1% n2% n3% n4%;          // 上  右  下  左
```

border-image-repeat：定义图片如何填充边框。

border-image-width：定义图片边框宽度。

border-image-outset





行高的继承特点需要注意





## CSS动画

### transform

平移：

```css
transform:translate(x,y)

transform:translateX(x)

transform:translateY(y)
```

移动的元素不会影响其他元素的位置，transform移动是使用百分比单位时，是以元素自身的宽度和高度为基准，对行内元素没有效果。





旋转：

```css
transform:ratate(ndeg)

transform-origin:x y;
```





缩放：

```css
transform:scale(n1,n1)
```

不会影响其他元素的位置



动画相对于过渡能实现更细腻的控制。







定义动画：

```css
@keyframes animationName {
    0%{
        //...
    }
    10%{
        //...
    }
    //....
    100%{
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



