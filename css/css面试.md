# css 面试

## 布局板块

### 三列布局

#### 定位方式

定位方式存在的缺陷：

1. 中间列不能优先加载
2. 当页面小于 200px（左右两列的固定宽度时），左右两列定位重合且混乱，中间列的宽度为 0 并被压在下层无法看见
3. 采用定位后不利于之后的布局
4. 中间列背景有部分被左右两列定位所覆盖

> `CSS部分`
>
> ```<style>
>  * {
>    margin: 0;
>    padding: 0;
>  } 
>  div {
>      height: 50px;
>  }
>
> .left {
>    position: absolute;
>    top: 0;
>    left: 0;
>    width: 100px;
>    background-color: orchid;
>    opacity: 0.5;
> }
>
> .right {
>    position: absolute;
>    top: 0;
>    right: 0;
>    width: 100px;
>    background-color: rebeccapurple;
>    opacity: 0.5;
> }
>
> .middle {
>    margin: 0 100px;
>    background-color: orange;
> }
>
>
>     HTML部分
>
> <body style="opsition:relative">
>   <div class="left">left内容</div>
>   <div class="middle">middle内容</div>
>   <div class="right">right内容</div>
> </body>
> ```

#### 浮动方式

浮动方式存在的缺陷：

1. 中间列不能优先加载
2. 中间列随页面变小时，最小宽度可以变为零
3. 中间列背景有部分被左右两列定位所覆盖，只有文本内容能不被覆盖

> `CSS部分`
>
> ``` <style>
> * {
>   margin: 0;
>   padding: 0;
> }
> div {
>   height: 50px;
> }
>
> .left {
>   float: left;
>   width: 100px;
>   background-color: orchid;
> }
>
> .right {
>   float: right;
>   width: 100px;
>   background-color: red;
> }
>
> .middle {
>   padding: 0 100px;
>   background-color: orange;
> }
> ```
>
> `HTML部分`
>
> ```
> <div class="left">left内容</div>
> <div class="right">right内容</div>
> <div class="middle">middle内容</div>
> ```

#### 圣杯布局

圣杯布局的不足:

1. 没有实现伪等高布局

思考记录：

 在 .middle .left .right 三个盒子都不浮动时，设置盒子的 margin 为负值是无法达到效果的。当一个盒子没有浮动时，设置它的 margin-right 为负值会被浏览器默认无效；当设置它的 margin-left 为负值时，它会基于自己原本的位置向左移动，直到移出可视区域，但是因为前面的有其他元素，所以是无法自动移动到前一个元素同一行的。（margin-left 和 margin- right 在不是浮动的情况下只是控制盒子的左右位置的，如果前面的元素和自己都浮动了，则可以达到上下控制盒子的位置的效果。）

 margin-top 和 margin-bottom 在盒子没有浮动的情况下，能实现盒子的上下移动。

> `CSS部分`
>
> ```css
> * {
>   margin: 0;
>   padding: 0;
> }
>
> .content {
>   margin: 0 100px; //最好使用padding
> }
>
> .content > div {
>   float: left;
>   height: 100px;
> }
>
> .left {
>   position: relative;
>   top: 0;
>   left: -100px;
>   margin-left: -100%; //left是相对定位时，百分比单位的参照对象时最近一级父块级元素的padding+content的宽度
>   width: 100px;
>   background-color: orange;
> }
>
> .right {
>   position: relative;
>   top: 0;
>   right: -100px;
>   margin-left: -100px;
>   width: 100px;
>   background-color: orchid;
> }
>
> .middle {
>   width: 100%; //middle是静态定位时，百分比单位的参照对象时最近一级父块级元素的padding+content的宽度
>   background-color: paleturquoise;
> }
>
> footer {
>   height: 100px;
>   background-color: coral;
> }
>
> .clearfix::after {
>   content: '';
>   display: block;
>   clear: both;
> }
> .clearfix {
>   *zoom: 1;
> }
> ```
>
> `HTML部分`
>
> ```
> <div class="content clearfix">
>     <div class="middle">middle内容</div>
>     <div class="left">left内容</div>
>     <div class="right">right内容</div>
> </div>
> <footer></footer>
> ```

#### 圣杯布局的改进:

> `CSS部分`
>
> ```
> 	* {
>     margin: 0;
>     padding: 0;
>   }
>
>   .content {
>  	 overflow:hidden;   //伪等高布局加入
>      padding: 0 100px;
>   }
>
>   .content>div {
>     float: left;
>     padding-bottom: 10000px;  //伪等高布局加入
>     margin-bottom: -10000px;  //伪等高布局加入
>   }
>
>   .left {
>     position: relative;
>     top: 0;
>     left: -100px;
>     margin-left: -100%;   //left是相对定位时，百分比单位的参照对象时最近一级父块级元素的padding+content的宽度
>     width: 100px;
>     background-color: orange;
>   }
>
>   .right {
>     position: relative;
>     top: 0;
>     left: 100px;
>     margin-left: -100px;
>     width: 100px;
>     background-color: orchid;
>   }
>
>   .middle {
>     width: 100%; //middle是静态定位时，百分比单位的参照对象时最近一级父块级元素的padding+content的宽度
>     background-color: paleturquoise;
>   }
>
>   footer {
>     height: 100px;
>     background-color: coral;
>   }
>
>   .clearfix::after {
>     content: '';
>     display: block;
>     clear: both;
>   }
>   .clearfix{
>     *zoom:1;
>   }
> ```
>
> `HTML部分`
>
> ```
> <div class="content clearfix">
>     <div class="middle">
>       middle内容
>     </div>
>     <div class="left">
>       left内容
>     </div>
>     <div class="right">
>       right内容
>     </div>
> </div>
> <footer></footer>
> ```

#### 双飞翼布局

> `CSS部分`
>
> ```
> 	* {
>    margin: 0;
>    padding: 0;
>  }
>
>  .content {
>    color: black;
>  }
>
>  .content>div {
>    float: left;
>  }
>
>  .middle {
>    width: 100%;
>    background-color: #afc;
>  }
>
>  .left {
>    margin-left: -100%;
>    width: 100px;
>    background-color: blueviolet;
>    opacity: 0.2;
>
>  }
>
>  .right {
>    margin-left: -100px;
>    width: 100px;
>    background-color: coral;
>    opacity: 0.2;
>  }
>
>  .middle_inner {
>    margin: 0 100px;
>    background-color: crimson;
>  }
>   .clearfix {
>    *zoom: 1
>  }
>
>  .clearfix::after {
>    content: '';
>    display: block;
>    clear: both;
>  }
> ```
>
> `HTML部分`
>
> ```html
> <div class="content clearfix">
>   <div class="middle">
>     <div class="middle_inner">middle内容</div>
>   </div>
>   <div class="left">left内容</div>
>   <div class="right">right内容</div>
> </div>
> ```

#### 利用 flex

```css
 <style>
      .container {
        display: flex;
      }
      .middle {
        flex-grow: 1;
        height: 100px;
        background-color: pink;
      }
      .left {
        order: -1;
        width: 200px;
        height: 100px;
        background-color: #afc;
      }
      .right {
        width: 200px;
        height: 100px;
        background-color: #6fd;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="middle"></div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </body>
```

#### 利用 calc（）

```html
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .container > div {
    float: left;
  }
  /* //注意空格 calc()能计算的计算表达式里，在加号(“+”)和减号(“-”)两边要留空格，而乘号(“*”)和除号(“*”)没有这个要求 */
  .middle {
    width: calc(100% - 400px);
    margin: 0 200px;
    background-color: pink;
  }
  .left {
    margin-left: calc(-100%);
    width: 200px;
    background-color: transparent;
  }
  .right {
    width: 200px;
    margin-left: -200px;
    background-color: transparent;
  }
</style>

<body>
  <div class="container">
    <div class="middle">middle</div>
    <div class="left">left</div>
    <div class="right">right</div>
  </div>
</body>
```

### 粘连布局

> `CSS部分`
>
> ```css
> * {
>   margin: 0;
>   padding: 0;
> }
>
> html,
> body {
>   height: 100%;
> }
>
> .content {
>   min-height: 100%;
>   overfl: hidde; //清除浮动
> }
>
> .footer {
>   height: 20px;
>   margin-top: -20px;
>   background-color: darkgray;
> }
>
> .inner {
>   padding-bottom: 20px;
> }
> ```
>
> `HTML部分`
>
> ```
> <div class="content">
>   <div class="inner">
>     <h2>阿斯弗</h2>
>     <h2>阿斯弗</h2>
>   </div>
> </div>
> <div class="footer">
>   footer
> </div>
> ```

### 两列布局

#### 两列布局(方式一):

借鉴了双飞翼布局的思想

> ```css
> <style>
>    * {
>      margin: 0;
>      padding: 0;
>    }
>
>    .left {
>      float: left;
>      width: 200px;
>      height: 50px;
>      background-color: darkorange;
>      /* opacity: 0; */
>    }
>
>    .right {
>      width: 100%;
>      height: 50px;
>      background-color: darkorchid;
>    }
>
>    .right_content {
>      height: 50px;
>      margin-left: 200px;
>      background-color: darksalmon;
>    }
>  </style>
>
> <body>
>  <div class="left"> left </div>
>  <div class="right">
>    <div class="right_content">right</div>
>  </div>
> </body>
> ```

#### 两列布局方式二(最干净的方式)

> ```css
> <style>
>    * {
>      margin: 0;
>      padding: 0;
>    }
>
>    .left {
>      float: left;
>      width: 200px;
>      height: 50px;
>      background-color: darkorange;
>    }
>
>    .right {
>      overflow: hidden; /*开启BFC模式*/
>      height: 50px;
>      background-color: darkorchid;
> 	}
>  </style>
>
> <body>
>  <div class="left">left</div>
>  <div class="right">right</div>
> </body>
> ```

#### 方式三：flex

> ```html
> <style>
>   .wrap {
>     display: flex;
>   }
>   .left {
>     width: 200px;
>     height: 500px;
>     background-color: rgba(145, 22, 196, 0.1);
>   }
>   /* flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。 */
>   .right {
>     flex-grow: 1;
>     height: 500px;
>     background-color: greenyellow;
>   }
> </style>
> <div class="wrap">
>   <div class="left"></div>
>   <div class="right">asdasd</div>
> </div>
> ```

#### 方式四：浮动

> ```javascript
> <div class="left"></div><div class="right">asdasd</div><style> .left {   float: left;   width: 200px;   height: 500px;   background-color: rgba(145, 22, 196, 0); } .right {   margin-left: 200px;   height: 500px;   background-color: greenyellow; }</style>
> ```
>
> 注意点：右侧盒子没有给到具体宽度

#### 方式五：

> ```javascript
> <div class="left"></div><div class="right">asdasd</div>.left {   float: left;   width: 200px;   height: 500px;   background-color: rgba(145, 22, 196, 0); } .right {   width: calc(100%-200px);   margin-left: 200px;   height: 500px;   background-color: greenyellow; }
> ```
>
> 注意点：右侧盒子采用了 css 计算方式动态计算宽度。

#### 方式六(grid 布局)：

> ```
> .box{ height: 400px;border: 1px solid red;margin: 20px auto;display: grid; grid-template-columns: 100px  auto;grid-template-rows: 100%;}.left{background-color: #afc;}.right{background-color: #ccc;}<div class="box"> <div class="left"></div> <div class="right"></div></div>
> ```

### 0.5px 边框

**border-image** 属性允许在元素的边框上绘制图像。` 使用 border-image 时，其将会替换掉 ``border-style ` 属性所设置的边框样式。

```
/* border-image: image-source image-height image-width image-repeat */
```

**`linear-gradient()`** 函数用于创建一个表示两种或多种颜色线性渐变的图片。由于`数据类型系`的子数据类型，`只能被用于`可以使用的地方。因此，`linear-gradient()` 并不适用于`background-color`以及类似的使用 `color`数据类型的属性中。

```
linear-gradient([ [ [ <angle> | to [top | bottom] || [left | right] ],]? <color-stop>[, <color-stop>]+);
```

<img src=".\typora-user-images\image-20210316112147418.png" alt="image-20210316112147418" style="zoom:80%;" />

background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);

第一个 rgba(255,255,255,.15) 25%,说的是从左下角开始起到 25%为 rgba(255,255,255,.15),这里默认隐藏了起始点的设定，然后 transparent 25%到 50%是透明的( transparent),然后就是 50%到 75%为 rgba(255,255,255,.15)这个颜色，接着就是从 75%到 100%为 transparent,这里又省略了一个 100%他是默认值

#### 单边框

##### 方式一：border + border-image:linear-gradient(线性渐变)

```css
<div class="border"></div><style>.border{    width:200px;    height:200px;    background-color:red;    border-bottom:1px solid transparent;    border-image:linear-gradient(to bottom,transparent 50%, blue 50%) 0 0 100% 0;}</style>
```

注意：background-color 的值会从边框区域开始生效，如果某个元素有边框，同时边框的颜色为 transparent，那么边框区域的颜色也会是 background-color 的值。所以上述的 0.5px 的边框中，能有 200.5px 的像素看上去是红色的，其中的 0.5px 是由于线性渐变有一半是 transparent 导致的。

##### 方式二：伪元素 + border-image:linear-gradient(线性渐变)

```html
<div class="border"></div>

<style>
  .border {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: red;
  }
  .border::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background-image: linear-gradient(to bottom, transparent 50%, blue 50%); //正确写法
    //border-image: linear-gradient(to bottom, transparent 50%, 63 0.3%) 0 0 100% 0;完全错误
  }
</style>
注意：上面这种情况高度实际可见的为199.5px，有0.5px为伪元素的高度。
```

#### 多边框

**定位 + 伪元素 + transform（缩放 scale）**

```html
<div class="border"></div>

<style>
  .border {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: red;
  }
  .border::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 200%;
    width: 200%;
    border: 1px solid black;
    transform-origin: 0 0;
    transform: scale(0.5);
  }
</style>
```

注意点：transform :scale（）会对元素的可见区域进行缩放，包括 content、padding、border。

### css 画基本图形

#### 圆形

```html
<div class="circle"></div>
.circle{ width:100px; height:100px; background-color:red; border-radius:50px;
(或者50%、大于宽和高的一半的数值px都会得到一样的效果)}
```

#### 三角形

```html
<div class="triangle"></div>
.triangle{ width:0px; height:0px; line-height:0; fonst-size:0; border:10px solid transparent;
border-bottom-color: red;}.box{ width: 0; height: 0; border-left: 20px solid transparent;
border-right: 20px solid transparent; border-bottom: 20px solid teal;}
```

#### clip-path 属性实现任何图形

不支持 IE 和 Firefox，支持 webkit 浏览器，在现代浏览器中需要使用`-webkit-`前缀。

##### 圆形

```html
<div class="circle"></div>
.circle{ height: 100px; width: 100px; padding: 20px; background-color: #afc; border: 10px solid red;
clip-path: circle(50%); //50%表示}创建圆形，需要给circle传入三个值：半径和圆心坐标（x
y），用at关键字来定义圆心坐标。
```

![image-20210321085229533](.\typora-user-images\image-20210321085229533.png)

##### 三角形

```css
<div class="triangle"></div>

.triangle{
    width:100px;
    height:100px;
    background-color: #afc;
    clip-path: polygon(0 100%, 50% 0, 100% 100%);  //左上   右上  右下  polygon多边形
}




/*方案二*/
.box {
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom-color: #afc;
}
<div class="box"></div>
```

注意：clip-path：polygon（）通过定义多个点，自动连接后，最后取闭合后形成任意形状的图形。点的取值可以是固定值或百分比，而且点的数量也可以固定。

##### 扇形

```html
<style>
  /*方案一：*/
  .box {
    width: 0;
    height: 0;
    border-width: 50px;
    border-style: solid;
    border-color: transparent transparent green;
    border-radius: 50px;
  }

  /*方案二：*/
  div {
    height: 100px;
    width: 100px;
    background-color: #afc;
    clip-path: ellipse(100% 100% at 0% 0%);
  }
</style>

<div class="box"></div>
```

### 垂直水平居中

已知父元素宽高固定和子元素的宽高

- 方式一：父元素开启 BFC（防止子元素外边距塌陷），给子元素设置父元素宽高减去子元素宽高的 margin-top 与 margin-left 值

- 方式二：给父元素开启怪异盒子模型（box-sizing：border-box），设置父元素的 padding-top 与 padding-left

未知子元素的宽高

#### 方式一:flex

```html
<div style="width: 300px;height: 300px;" class="wrap">
  <div style="width: 100px;height: 100px;" class="box"></div>
</div>
<style>
  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #afc;
  }
  .box {
    background-color: pink;
  }
</style>

<div style="width: 300px;height: 300px;" class="wrap">
  <div style="width: 100px;height: 100px;" class="box"></div>
</div>
<style>
  .wrap {
    display: flex;
    background-color: #afc;
  }
  .box {
    margin: auto;
    background-color: pink;
  }
</style>
```

#### 方式二：table-cell

```html
<div style="width: 300px;height: 300px;" class="wrap">
  <div style="width: 100px;height: 100px;" class="box"></div>
</div>
<style>
  .wrap {
    display: table-cell;
    text-align: center; /*或者不要改行*/
    vertical-align: middle;
    background-color: #afc;
  }
  .box {
    display: inline-block; //在不要上面行的情况下，margin：0 auto
    background-color: pink;
  }
</style>
display:
table-cell;它本身是为了控制文本的水平和垂直居中的，所以要让子元素转为行内块元素。它要求父元素必须有固定宽高。
```

#### 方式三：inline-block + vertical-align（近似水平垂直居中）

```html
<div style="width: 300px;height: 300px;" class="wrap">
  <div style="width: 100px;height: 100px;" class="box"></div>
</div>
.wrap{ text-align:center; line-height: 300px; } .box{ display: inline-block; vertical-align: middle;
}
```

#### 方式四:abslute + 负 margin （知道子元素宽高）

```html
<style>
  .container {
    position: relative;
    width: 500px;
    height: 500px;
    border: 1px solid;
  }
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -100px;
    width: 200px;
    height: 200px;
    background-color: #afc;
  }
</style>
<div class="container">
  <div class="box"></div>
</div>
//将盒子基于当前位置往左上方移动自己宽高的一般}不足，这种情况开发者必须知道子元素的宽高，以用于设置margin负值。
```

#### 方式五:abslute + margin:auto（ 不知道子元素宽高）

```html
<div class="wrap">
  <div class="box"></div>
</div>

<style>
  .wrap {
    width: 600px;
    height: 600px;
    position: relative;
    border: 1px solid;
  }

  .box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100px;
    height: 100px;
    margin: auto;
    background-color: #afc;
  }
</style>
//
这种情况也必须要知道子元素的宽高，如果宽高不固定，首先会默认让子元素的宽高调到最大以满足布局约束。
```

#### 方式六：abslute + transform：translate(-50%,-50%)

```html
<style>
  .container {
    position: relative;
    width: 500px;
    height: 500px;
    border: 1px solid;
  }
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #afc;
  }
</style>
<div class="container">
  <div class="box">asdkjsahdkjhsalkdjaslkdjlasdasdasdasdasaskhd</div>
</div>

//CSS3属性，-50%是相对于子元素自身的宽高，兼容性不够好}
```

#### 方式七:grid

```html
<div style="width: 300px;height: 300px;" class="wrap">
  <div style="width: 100px;height: 100px;" class="box"></div>
</div>
<style>
  .wrap {
    display: grid;
  }
  .box {
    align-self: center;
    justify-self: center;
  }
</style>
```

#### 方式八：用 JS 来实现

### 问题：

#### margin 纵向重叠问题

```css
p {
    font-size: 16px;
    line-height: 1;
    margin-top: 10px;
    margin-bottom: 15px;
}
<p>AAA</p>
<p></p>
<p></p>
<p></p>
<p>BBB</p>
问题：元素AAA与元素BBB之间的距离是多少？答案：15px考查点： 1.相邻元素中，前一个节点的margin-bottom与后一个节点的margin-top会发生重叠；2。空元素也会重叠。
```

#### BFC 的理解与应用

BFC，块级格式化上下文，一个开启了新 BFC 的盒子是独立布局的，盒子里面的子元素的样式不会影响到外面的元素

在同一个 BFC 中的两个毗邻的块级盒在垂直方向（和布局方向有关系）的 margin 会发生折叠。

一个页面是由很多个 Box 组成的,元素的类型和 display 属性,决定了这个 Box 的类型 W。

不同类型的 Box,会参与不同的 Formatting Context（决定如何渲染文档的容器）,因此 Box 内的元素会以不同的方式渲染,也就是说 BFC 内部的元素和外部的元素不会互相影响。

##### 如何开启 BFC，作用

- 1、浮动元素，float 除 none 以外的值
- 2、绝对定位元素，position（absolute，fixed）
- 3、display 为以下其中之一的值 inline-blocks，table-cells，table-captions
- 4、overflow 除了 visible 以外的值（hidden，auto，scroll）

- 1、可以阻止边距折叠（margin collapsing）
- 2、可以包含内部元素的浮动
- 3、可以阻止元素被浮动覆盖(用于两列布局)

#### 溢出文本显示省略号

```css
单行文本：（要让盒子的宽度固定，而不能由内容撑开）
white-space:nowrap;  //强制文本一行显示
overflow:hidden;  //超出部分隐藏
text-overflow:ellipsis;  //溢出部分显示省略号

多行文本：
overflow:hidden;
text-overflow:ellipsis;
display:-webkit-box;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
```

## 响应式板块

 响应式布局指的是同一页面在不同屏幕尺寸下有不同的布局。传统的开发方式是 PC 端开发一套，手机端再开发一套，而使用响应式布局只要开发一套就够，缺点就是`CSS`比较重。

 响应式设计与自适应设计的区别：响应式开发一套界面，通过检测视口分辨率，针对不同客户端在客户端做代码处理，来展现不同的布局和内容；自适应需要开发多套界面，通过检测视口分辨率，来判断当前访问的设备是 pc 端、平板、手机，从而请求服务层，返回不同的页面。

### 响应式布局的实现方案

#### 1. 媒体查询

![image-20210317191806567](.\typora-user-images\image-20210317191806567.png)

不管是移动优先还是 PC 优先，都是依据当随着屏幕宽度增大或减小的时候，后面的样式会覆盖前面的样式。因此，移动端优先首先使用的是`min-width`，PC 端优先使用的`max-width`。

**移动优先:**

```
/* iphone6 7 8 */body {    background-color: yellow;}/* iphone 5 */@media screen and (max-width: 320px) {    body {      background-color: red;    }}/* iphoneX */@media screen and (min-width: 375px) and (-webkit-device-pixel-ratio: 3) {    body {      background-color: #0FF000;    }}/* iphone6 7 8 plus */@media screen and (min-width: 414px) {    body {      background-color: blue;    }}/* ipad */@media screen and (min-width: 768px) {    body {      background-color: green;    }}/* ipad pro */@media screen and (min-width: 1024px) {    body {      background-color: #FF00FF;    }}/* pc */@media screen and (min-width: 1100px) {    body {      background-color: black;    }}
```

**PC 优先：**

```
/* pc width > 1024px */    body {        background-color: yellow;    }/* ipad pro */@media screen and (max-width: 1024px) {    body {        background-color: #FF00FF;    }}/* ipad */@media screen and (max-width: 768px) {    body {        background-color: green;    }}/* iphone6 7 8 plus */@media screen and (max-width: 414px) {    body {        background-color: blue;    }}/* iphoneX */@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {    body {        background-color: #0FF000;    }}/* iphone6 7 8 */@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 2) {    body {        background-color: #0FF000;    }}/* iphone5 */@media screen and (max-width: 320px) {    body {        background-color: #0FF000;    }}
```

#### 2.百分比布局

 通过百分比单位，可以使得浏览器中组件的宽和高随着浏览器的高度的变化而变化，从而实现响应式的效果。Bootstrap 里面的栅格系统就是利用百分比来定义元素的宽高，`CSS3`支持最大最小高，可以将百分比和`max(min)`一起结合使用来定义元素在不同设备下的宽高。

 子元素的`height`或`width`中使用百分比，是相对于子元素的直接父元素，`width`相对于父元素的`width`，`height`相对于父元素的`height`；子元素的`top`和`bottom`如果设置百分比，则相对于直接非`static`定位(默认定位)的父元素的高度，同样子元素的`left`和`right`如果设置百分比，则相对于直接非`static`定位(默认定位的)父元素的宽度；子元素的`padding`如果设置百分比，不论是垂直方向或者是水平方向，都相对于直接父亲元素的`width`，而与父元素的`height`无关。跟`padding`一样，`margin`也是如此，子元素的`margin`如果设置成百分比，不论是垂直方向还是水平方向，都相对于直接父元素的`width`；`border-radius`不一样，如果设置`border-radius`为百分比，则是相对于自身的宽度，除了`border-radius`外，还有比如`translate`、`background-size`等都是相对于自身的；

 从上述对于百分比单位的介绍我们很容易看出如果全部使用百分比单位来实现响应式的布局，有明显的以下两个缺点：

- 计算困难，如果我们要定义一个元素的宽度和高度，按照设计稿，必须换算成百分比单位。
- 可以看出，各个属性中如果使用百分比，相对父元素的属性并不是唯一的。比如`width`和`height`相对于父元素的`width`和`height`，而`margin`、`padding`不管垂直还是水平方向都相对比父元素的宽度、`border-radius`则是相对于元素自身等等，造成我们使用百分比单位容易使布局问题变得复杂。

#### 3.rem

 `rem`单位都是相对于根元素 html 的`font-size`来决定大小的,根元素的`font-size`相当于提供了一个基准，当页面的 size 发生变化时，只需要改变`font-size`的值，那么以`rem`为固定单位的元素的大小也会发生响应的变化。 因此，如果通过`rem`来实现响应式的布局，只需要根据视图容器的大小，动态的改变`font-size`即可（而`em`是相对于父元素的）。

 **rem 响应式的布局思想：**

- 一般不要给元素设置具体的宽度，但是对于一些小图标可以设定具体宽度值
- 高度值可以设置固定值，设计稿有多大，我们就严格有多大
- 所有设置的固定值都用`rem`做单位（首先在 HTML 总设置一个基准值：`px`和`rem`的对应比例，然后在效果图上获取`px`值，布局的时候转化为`rem`值)
- js 获取真实屏幕的宽度，让其除以设计稿的宽度，算出比例，把之前的基准值按照比例进行重新的设定，这样项目就可以在移动端自适应了

#### 4.视口单位

`css3`中引入了一个新的单位`vw/vh`，与视图窗口有关，`vw`表示相对于视图窗口的宽度，`vh`表示相对于视图窗口高度，除了`vw`和`vh`外，还有`vmin`和`vmax`两个相关的单位。各个单位具体的含义如下：

vw 相对于视窗的宽度，1vw 等于视口宽度的 1%，即视窗宽度是 100vwvh 相对于视窗的高度，1vh 等于视口高度的 1%，即视窗高度是 100vh; vmin vw 和 vh 中的较小值; vmax vw 和 vh 中的较大值

## 定位板块

#### CSS 中定位的方式有哪些,position 属性的值有哪些,他们之间的区别

- 默认值：initial（浏览器默认值）
- 继承父级元素的定位机制：inherit
- 默认：static
  - 没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）
  - 其包含块为祖先元素中最近的块容器盒的内容区域（即去掉 padding 的部分）
- 相对定位：relative , 相对于其正常位置进行定位
  - 相对定位时，无论是否进行移动，元素仍然占据原来的空间。因此，移动元素会导致它覆盖其他框
  - 其包含块为祖先元素中最近的块容器盒的内容区域（即去掉 padding 的部分）
- 绝对定位：absolute（注意`z-index`）,相对于包含块进行定位
  - 其祖先元素中最近的 position 属性非 static 的元素
  - 如果都找不到，则为初始化包含块（ initial containing block）
  - 根元素所在的包含块被称为 初始化包含块（initial containing block），在常用的浏览器环境下，指的是大小和 viewport 相同的矩形

```html
<style type="text/css">    *{        margin: 0;        padding: 0;    }    html{        margin: 30px;        border: 1px solid deeppink;    }    body{        margin: 30px;        border: 1px solid yellow;    }    #test{        position: absolute;        left: 10px;        top: 10px;        width: 100px;        height: 100px;        background: pink;    }</style></head><body>    <div id="test">        123    </div></body>渲染结果如下：
```

![image-20210319223150288](.\typora-user-images\image-20210319223150288.png)

- 固定定位：fixed，相对于浏览器窗口进行定位，其包含块由 viewport（视图窗口） 建立；
- 粘性定位：sticky，该定位基于用户滚动的位置

### z-index 的工作原理，使用范围

`z-index` 只有在`position` 设置为除 `static` 属性上的元素上时，它才能更改层叠顺序，在元素没有设置任何 `position` 的情况下，z-index 将不会起任何作用。`z-index` 只适用于层叠环境中的元素。当父元素的堆叠顺序被设置的时候，这也意味着，它的子元素的堆叠顺序不能高于或低于这一顺序 (相对于父元素的堆叠上下文)。

## 图文样式板块

#### line-height 的继承问题

面试案例：

```css
body{
    font-size:20px;
    line-height:200%;
}
p{
    font-size:16px
}
<body>
	<p>aaa</p>
</body>
问题：p标签的行高是多少？答案：40px
考查点：
1. 如果父元素中行高是具体的数字，如 30px，子元素没有设置行高时，直接继承 父元素的 30px 行高
2. 如果父元素中行高是比例，如 2 ，1.5，子元素没有设置行高时，直接继承 父元素行高的比例 ，然后乘上自己的font-size后得出自己的行高
3. 如果父元素中行高是百分比，如 200%，子元素没有设置行高时，直接继承 父元素行高的百分比乘上父元素的font-size后得出的行高
```

## CSS3 动画板块

### 动画

transition（过渡）

在 CSS 3 引入 Transition（过渡）这个概念之前，CSS 是没有时间轴的。也就是说，所有的状态变化，都是即时完成。transition 的作用在于，指定状态变化所需要的时间。transition 需要明确知道，开始状态和结束状态的具体数值，才能计算出中间状态。比如，height 从 0px 变化到 100px，transition 可以算出中间状态。但是，transition 没法算出 0px 到 auto 的中间状态，也就是说，如果开始或结束的设置是 height: auto，那么就不会产生动画效果。类似的情况还有，display: none 到 block，background: url(foo.jpg)到 url(bar.jpg)等等。

```css
transition: 属性名 耗时;
transition: 属性名1 耗时1,属性名2 耗时2;
transition:  耗时1 属性名1,耗时2 延迟时间2 属性名2;
transition-timing-function：linear | ease-in | ease-out | cubic-bezier
```

transition 的优点在于简单易用，但是它有几个很大的局限。

（1）transition 需要事件触发，所以没法在网页加载时自动发生。

（2）transition 是一次性的，不能重复发生，除非一再触发。

（3）transition 只能定义开始状态和结束状态，不能定义中间状态，也就是说只有两个状态。

（4）一条 transition 规则，只能定义一个属性的变化，不能涉及多个属性。

CSS Animation 就是为了解决这些问题而提出的。

### transform（2D）

#### translate（平移）

transform:translate(x,y)

transform:translateX(N)

transform:translateY(N)

translate 的特点：

- 不影响其他元素的排版位置，只是会盖住标准流中的盒子。position：absolute 与 margin 都会影响其他盒子排版。
- 对行内标签没有效果
- translate（n%,n%）是相对于元素自身元素的宽与高

#### rotate（旋转）

transform:rotate(Ndeg)：正值顺时针旋转，负值逆时针旋转

transform-origin：x y; ：默认的旋转中心点为元素的中心点 （50%，50%），其他单位有像素，top，bottom，left，right，center

#### scale（缩放）

transform:scale(x , y):x，y 也可以是整数或者小数，（1，1）等价于没有缩放，（2，2）宽高都方法 2 倍，（0.5，05）宽高都缩小一倍。

之前通过修改盒子的宽度与高度实现缩放，会影响其他盒子的排版，同时宽度是向两边扩展，而高度只是向下扩展无法向上扩展。scale 的缩放则不会影响其他盒子的排版，而且可以设置缩放的中心点。

2D 动画的复合写法：

transform：translate(x,y) rotate(Ndeg) scale(2); 注意点：注意书写顺序。建议先些平移再写其他属性。

### 动画（animation）

通过设置多个节点来精准控制一个或者一组动画。相比于过渡，动画能实现更多的变化，更多的控制和连续自动播放。先定义动画，再使用动画。

定义：

```css
@keyframes 动画名称 {   //keyframes：关键帧    0%{ //动画开启时元素的样式     可以用form代替0%    }    n%{//动画在整个运动时间的百分之n时元素的样式            }    100%{ //动画结束时元素的样式   可以用to代替100%            }}
```

使用：

```css
css选择器{
    animation-name:动画名称; 必写    animation-duration:动画耗时; 必写	animation-timing-function:'ease'|'linear'|steps(); 规定动画的速度曲线    animation-delay:0; 规定动画延迟多久开始执行    animation-iteration-count:1;  规定动画播放的次数（infinite）    animation-direction：规定动画是否在下一周期逆向播放，默认normal,alternate:逆播放    animation-play-state:规定动画过程中是否可以被暂停，默认：running,还有paused    animation-fill-mode:规定动画结束后的状态，保持在结束位置：forward，回到起点位置：backwards(默认)}css选择器{	animation:动画名称 动画耗时 [速度曲线 延迟时间 播放次数 逆向与否 结束状态];}
```

### transform（3D）

#### translate（平移）

transform:translate3d(x,y,z) ; 没有项也要写 0 填充

transform:translateX(N)

transform:translateY(N)

transform:translateZ(N)

#### perspective（透视）

模拟人眼到屏幕的距离。透视属性写在被观察元素的父级上。

perspective：Npx

#### rotate（旋转）

transform:rotateX(Ndeg)：以 x 为轴旋转，正值元素上边往内部倾斜，底部往外边倾斜，负值相反。

transform:rotateY(Ndeg)：以 y 为轴旋转，正值元素左边往外部倾斜，右边往内部倾斜，负值相反。

transform:rotateZ(Ndeg)：以 z 为轴旋转，正值顺时针旋转，负值逆时针旋转。

transform:rotate3d(n1,n2,n3,ndeg)

#### transform-style

控制元素内部的子元素是否开启 3d 空间，默认不开启（flat）。父元素开启 3d 立体空间（preserve-3d）。

## CSS 面试

#### 溢出文本显示省略号

```css
盒子的宽度需要固定，不能由内容撑开。
white-space:nowrap;overflow:hidden;text-overflow:ellipisis;
```

#### css 识别选择器的顺序

从右往左，因为这样有可能一次就选中元素，算法复杂度低，如果没有一次就选中，也有效的降低了搜索范围。

#### 设置元素浮动后，该元素的 display 值是

自动变成 display:block; `absolute`和`float`都会隐式改变 display；

#### 清除浮动

原因与目的：

- 浮动最初的目的是实现文字环绕图片效果的
- 可能出现父元素的高度塌陷
- 浮动元素甚至影响到了其父元素的兄弟元素排版
- 浮动元素只影响它后面的元素排版

清除浮动：

- 给父级元素设置固定高度

- 给浮动的元素的下一个兄弟元素添加，clear: left;（左边不允许有浮动的元素）或者 clear: both;（两边都不允许就是`both`） 父元素结束标签之前插入清除浮动的**块级元素**，必须是一个**块级元素**，否则无法撑起父级元素高度。 缺点：添加无意义标签，语义化差。（clear：left/right；）清除左/右侧浮动元素对当前元素的影响。原理：设置了 clear 属性的元素浏览器会自动为该元素添加一个上外边距，以使它的位置不受它前面浮动元素的影响。clear：both；清除两侧中最大影响的那侧。

- 利用伪元素（clearfix）

  ```
  .clearfix::after{
  	content:'';
  	display:block;
  	clear:both;
  	height: 0;  //提高兼容性
  }
  .clearfix{
  	*zoom: 1;  /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
  }
  
  缺点：ie6-7不支持伪元素：after，使用zoom:1触发hasLayout.


  .clearfix:after,.clearfix:before{
  	content: "";
  	display: block;
  }
  .clearfix:after{
  	clear: both;
  }
  .clearfix{
  	*zoom: 1;
  }
  既清除了浮动，又实现了内部子元素的外边距问题导致父元素外边距一起塌陷的问题。


  .clearfix:after,.clearfix:before{
  	content: "";
  	display: block;
  	clear: both;
  }
  .clearfix{
  	*zoom: 1;  /*开启haslayout*/
  }
  ```

- 利用 overflow 不为 visible 清除浮动，触发 BFC

- 父元素也浮动，本质也是开启了父元素的 BFC

- 在父元素内部的最后加`<br clear="all" />`

- 父元素内部的最后加空标签清浮动`<div style="clear: both;"></div>`

#### 系统默认滚动条

html 标签上不会出现滚动条，系统滚动条默认是设置在文档上的。

#### CSS 中 link 与@import 的区别

**1.从属关系区别** `@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

**2.加载顺序区别** 加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。

**3.兼容性区别** `@import`是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；`link`标签作为 HTML 元素，不存在兼容性问题。

**4.DOM 可控性区别** 可以通过 JS 操作 DOM ，插入`link`标签来改变样式；由于 DOM 方法是基于文档的，无法使用`@import`的方式插入样式。

**5.权重区别** `link`引入的样式权重大于`@import`引入的样式。

**6.书写位置不同**

```css
<head>
	<link rel="stylesheet" type="text/css" href="theme.css" />
</head>
<style type="text/css">
        @import url("URL1");    //@import必须写在开头
        @import url("URL2");    //@import必须写在开头
</style>
  ```

#### CSS hack

 由于不同厂商的流览器或某浏览器的不同版本（如 IE6-IE11,Firefox/Safari/Opera/Chrome 等），对 CSS 的支持、解析不一样，导致在不同浏览器的环境中呈现出不一致的页面展现效果。这时，为了获得统一的页面效果，就需要**针对不同的浏览器或不同版本写特定的 CSS 样式**，我们把这个针对不同的浏览器/不同版本写相应的 CSS code 的过程，叫做 CSS hack。

#### line-height 各种单位总结

1.line-height 可以被定义为：body{line-height:normal;} 浏览器使用 1.0-1.2 line-height .这是一个初始值。

2.line-height 可以被定义为：body{line-height:inherit;}

3.line-height 可以使用一个百分比的值 body{line-height:120%;}

4.line-height 可以被定义为一个长度值(px,em 等) body{line-height:25px;}

5.line-height 也可以被定义为纯数字， body{line-height:1.2}

![image-20210317184243648](.\typora-user-images\image-20210317184243648.png)

![image-20210317184302870](.\typora-user-images\image-20210317184302870.png)

![image-20210317184316121](.\typora-user-images\image-20210317184316121.png)

![image-20210317184329949](.\typora-user-images\image-20210317184329949.png)

一般来说，设置行高为值：纯数字是最理想的方式。因为其会随着对应的 font-size 而放缩。

- normal 同 number 效果一样，会在每个后代元素下重新计算出实际值，系数约 1.2

- %同 number+px/em/rem 单位效果一样，后代元素会直接继承父元素的 line-height 计算结果值

- 当一个元素是使用不带单位的数字，声明的值会被继承，也就是说这个值会在子元素中用来与子元素本身的 font-size 重新计算子元素的 line-height。

#### 继承

定义：父元素设置了某属性，子元素也会有该属性

常用会被继承的 css 属性

> ```php
> color, cursor,font-family, font-size, font-style,font-weight, font, letter-spacing,line-height, list-styletext-align, text-indent, word-spacing
> ```

#### 渐进增强与优雅降级（设计思想）

 由于低级浏览器不支持 CSS3，但是 CSS3 有许多非常好的属性，所以在高级浏览器中使用 CSS3，而在低级浏览器只保证最基本的功能。二者的目的都是关注不同浏览器下的不同体验，但是它们侧重点不同，所以导致了工作流程上的不同。

 渐进增强（Progressive Enhancement）：一开始就针对**低版本浏览器**进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验。

 优雅降级（Graceful Degradation）：一开始就构建站点的**完整功能**，然后再针对低版本浏览器进行兼容。比如一开始使用 CSS3 的特性构建了一个应用，然后逐步针对各大浏览器进行 hack 使其可以在低版本浏览器上正常浏览。

![image-20210317175921269](.\typora-user-images\image-20210317175921269.png)

渐进增强的写法，优先考虑老版本浏览器的可用性，最后才考虑新版本的可用性。而在现在前缀 CSS3 和正常 CSS3 都可用的情况下，**正常 CSS3 会覆盖前缀 CSS3。**

优雅降级的写法，优先考虑新版本浏览器的可用性，最后才考虑老版本的可用性。而在现在前缀 CSS3 和正常 CSS3 都可用的情况下，**前缀 CSS3 会覆盖正常的 CSS3。**

#### 如何消除图片底部的空白缝隙

方式 1：img {dislpay：block；}

方式 2：img {vertical-align：bottom；}

方式 3：font-size：0；

方式 4：.box {line-height ：0； }

#### 如何控制一个元素的显示和隐藏

方式一：display：none

- 元素还在 dom 树中，但是不可见，同时也不占有页面位置
- 父元素 display：none 后，子元素完全不可见也不能有效操作子元素
- 会让浏览器重绘重排，性能消耗较大

方式二：opacity:0

- 元素在页面上，可点击其占据位置，但是看到的是后面的背景颜色
- 父元素设置 opacity:0 后，子元素将无法看到，可点击子元素占据位置
- 重建图层，性能消耗小

方式三：visibility：hidden

- 元素在页面上，不可点击其占据位置。
- 可以被子元素继承
- 只导致页面重绘

方式四：设置元素的 width、height、padding、border 与 margin 为 0，内部有子元素时，还要设置 overflow：hidden。

方式五：设置元素的 position，通过 left 与 top 为一个很大的数值。

方式六：设置元素的 position 和 z-index 为一个负值。

#### 自定义单选框外观样式

```css
/* 考察的知识点：  如何隐藏一个盒子内的子元素； */        label {    position: relative;    overflow: hidden;    float: left;    width: 100px;    height: 100px;    margin: 5px;}label>input {    position: absolute;    top: -999px;    left: -999px;}label>div {    width: 100%;    height: 100%;    background-color: pink;    border-radius: 50%;    border: 1px solid red;    box-sizing: border-box;}<label>    <input type="radio" name="hobby">    <div></div></label><label>    <input type="radio" name="hobby">    <div></div></label><label>    <input type="radio" name="hobby">    <div></div></label>
```

#### css 中的变量

css 中变量的定义：变量名前面加两个 ”--“

变量使用：var(--变量名)

```css
.header {  --color: white;  color: var(--color);  // the color is black  --color: black;}
```

#### display:inline-block 的缺陷

会把元素之间的空格/换行当作文本，占据一定的位置，导致元素之间会产生间隙。

解决办法：

方式一、让元素之间没有空格或者换行。

方式二、给元素的父元素设置 font-size:0 ,目的是让该父元素中所有元素的字体大小（包括空格和换行的字体大小）都为零，那就没有间隙了。再单独给该父元素中的子元素设置字体大小。

方式三、不用 display:inline-block，而该为 float：left 加上清除浮动。

方式四、对父元素使用 flex 布局（兼容性略差）。

#### 浮动布局是什么

浮动属性(float)设计的初衷是为了解决页面展示样式时需要文字环绕图片的场景；浮动元素会生成一个块级框，而不论它本身是何种元素。浮动是对后面元素的影响。

#### CSS 模块化遇到了哪些问题

- 全局污染：CSS 使用全局选择器机制来设置样式，优点是方便重写样式。缺点是所有的样式都是全局生效，样式可能被错误覆盖
- 命名混乱：由于全局污染的问题，多人协同开发时为了避免样式冲突，选择器越来越复杂，容易形成不同的命名风格，很难统一。
- 依赖管理不彻底
- 无法共享变量

CSS 模块化的解决方案有很多，但主要有两类：

- 彻底抛弃 CSS，使用 JS 或 JSON 来写样式

  Radium，jsxstyle，react-style 属于这一类。优点是能给 CSS 提供 JS 同样强大的模块化能力。缺点是不能利用成熟的 CSS 预处理器（或后处理器）,Sass/Less/PostCSS，:hover 和 :active 伪类处理起来复杂。

- 另一类是依旧使用 CSS，但使用 JS 来管理样式依赖，CSS Modules。

  ```javascript
  结合 Webpack 的 css-loader 后，就可以在 CSS 中定义样式，在 JS 中导入。
  // webpack.config.js
  test: /\.less$/,
      use: [
          'style-loader',
          {
              loader: 'css-loader',
              options: {
                  modules: true,
                  localIdentName: '[name]__[local]-[hash:base64:5]',
              },
          },
      ],
  }
  ```

#### CSS 机制 At-rule（@符）

@import、@media、@font-face、@keyframes、@document、@page、@supports、@charset、@namespace

#### 文档流中的块级盒子的水平方向布局约束

元素在其父元素中水平方向的位置必须满足下列公式：

 maright-left +border-left+padding-left+width+padding-right+border-right+margin-right = 父元素的内容区（content）的宽度

 默认值：0+0+0+auto+0+0+0 = content width

上述等式必须成立，如果不成立，则称为过度约束，则浏览器会自动调整。

 调整方式：

 若上述 7 个值中没有 auto 的情况，则浏览器会自动调整 margin-right 的值以使等式满足，所以在文档流中，如果某父元素中的子元素有设置 width 为固定值，其他项都没有设置，则元素从左侧为最初布局位置。

 上述 7 个值中，有三个属性的值可以设为 auto，分别是：width、margin-left 与 margin-right：

 如果三者中只有某个属性为 auto，则浏览器自动调整值为 auto 那个属性对应的值以使等式成立；

 如果将一个宽度与一个外边距设置为 auto，则宽度会调整到最大，设为 auto 的 margin 则自动为 0；

 如果将三个值都设置为 auto，则 margin 都取 0，而宽度调到满足等式为止；

 如果两个外边距的值为 auto，宽度固定值，则左右两个外边距平分使等式满足的值（这就是水平居中）。

#### 不考虑其他因素，下面哪种的渲染性能高

```
.box a{  ....}
a{....}
第二种，css的浏览器对选择器的查询是从右向左查询，对于第二种，浏览器只需要寻找到所有a，而对于第一种，它要先找到所有a然后再找box下的所有a，它进行了二次筛选。
```

#### 禁止鼠标右键菜单事件

```
document.addEventListener('contextmenu',function(e){ e.preventDefault() })//取消了默认的上下文菜单
```

#### 禁止鼠标选中

```
document.addEventListener('selectstart',function(e){ e.preventDefault() })//禁止鼠标选中文本
```

#### 相邻元素外边距问题

 垂直外边距重叠的条件：

- 相邻

- 垂直方向

- 外边距

  为了解决外边距重叠的情况，只要破坏上面三者中的一个条件就能满足。

 两个或多个相邻的文档流中的块元素垂直方向上的 margin 会折叠。当两者都是正数时，真实的垂直外边距取两者中较大者；当两者都是负数时，真实的垂直外边距取两者中绝对值较大者；当两者一正一负时，真实的垂直外边距取两者之和。水平方向的 margin 不会发生折叠的现象。 浮动元素、inline-block 元素、绝对定位元素的 margin 不会和垂直方向上其他元素的 margin 折叠（开启了 BFC）

![image-20210315143021921](.\typora-user-images\image-20210315143021921.png)

![image-20210315143112939](.\typora-user-images\image-20210315143112939.png)

![image-20210315143203401](.\typora-user-images\image-20210315143213536.png)

![image-20210315143233786](.\typora-user-images\image-20210315143233786.png)

 父子元素之间垂直外边塌陷：父元素没有设置 margin-top 而内部的第一个子元素设置了 margin-top:50px，那么这个外边距会作用在父元素上，而不是把子元素设置为距离父元素上边框 50px; 如果父子元素同时设置了 margin-top，那么父元素的外边距取它们中较大者的值。

 解决方法：1. 给父元素开启 BFC ； 2.给父元素加上边框 ； 3.子元素不用外边距而改为父元素用 padding

### display:none 和 visibility:hidden 的区别

- 这两个声明都可以让元素隐藏，两者都会出现在 DOM 树结构中，display:none 的节点不会出现在 layout tree 上，visibility:hidden 会出现在 layout tree 中
- 不同之处在于 display:none 隐藏后的元素不占据任何空间它各边的元素会合拢，而 visibility:hidden 隐藏的元素空间依旧存在
- **display:none 隐藏产生 reflow 和 repaint(回流与重绘)，而 visibility:hidden 没有这个影响前端性能的问题**
- **“连带性”，display:none； 一旦父节点元素应用了 display:none，父节点及其子孙节点元素全部不可见，而且无论其子孙元素如何设置都没用。 visibility:hidden；父级设计 hidden，子元素默认不现实，但是可以用过 visibility:visible 显示出子元素，无渲染与回流。**

### CSS3 有哪些新特性

- CSS3 实现圆角（border-radius），阴影（box-shadow），
- 对文字加特效（text-shadow、），线性渐变（gradient），旋转（transform）
- transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);// 旋转,缩放,定位,倾斜
- 媒体查询，多栏布局
- 线性渐变 （gradient）

### CSS 的“伪类”和“伪元素”有什么区别

一个更像是从 css 类的角度处理，另一个更像是从 html 标签的角度处理。单冒号(:)用于 CSS3 伪类，双冒号(::)用于 CSS3 伪元素。

### div+css 的布局较 table 布局有什么优点

- 改版的时候更⽅便 只要改 css ⽂件。

- ⻚⾯加载速度更快、结构化清晰、⻚⾯显示简洁。

- 表现与结构相分离。

- 易于优化（ seo ）搜索引擎更友好，排名更容易靠前。

#### 元素的百分比设定是相对于什么

子元素的 width 和 height 是百分比时，是基于父元素的内容区宽度和高度为基准的。

子元素的 padding 是百分比时，四个边都是参照父元素的内容区的宽度为基准的。单个边距为百分比时，也是一样，依据的也是父容器的宽度，而不是高度。 子元素的 margin 是百分比时，四个边都是参照父元素的内容区的宽度为基准的。单个边距为百分比时，也是一样，依据的也是父容器的宽度，而不是高度。

#### 文档流和文本流

文本流是元素内部的一系列的字符的排列规则。

文档流指的是 HTML 中元素在计算布局排版的过程中,所有处于文档流中的元素会自动的从左到右(非块级元素),从上到下(块级元素)的排列规则。

元素在排版中的定位类型分为三种:

(1)文档流:块级格式化的块级盒子, 行内格式化的行内盒子以及相对定位与粘性定位的块级盒子和行内盒子

(2)浮动(float)，浮动会使元素脱离文档流,但是并不会脱离文本流,在文本流中还是占有位置的

(3)绝对定位(position:absolute/fixed)，绝对定位(position:absolute)会使元素脱离文档流和文本流。

#### position:relative 和负 margin 都可以使元素位置发生偏移?二者有什么区别?

position:relative 和负 margin 都可以使元素位置发生偏移,二者的区别在于：

- 负 margin 会使元素在文档流中的位置发生偏移，它会放弃偏移之前占据的空间，紧挨其后的元素会填充这部分空间；

- 相对定位后元素位置发生偏移，它仍会坚守原来占据的空间，不会让文档流的其他元素流入。

#### 单个 div 元素实现双边框

```css
方式一： .box {
  width: 50px;
  height: 50px;
  box-shadow: 0px 0px 0px 10px rosybrown;
  border: 20px solid red;
}

方式二： .box {
  width: 50px;
  height: 50px;
  box-shadow: 0px 0px 0px 10px rosybrown, 0px 0px 0px 20px rgb(228, 40, 40);
  margin: 50px;
}
其他方法： 伪元素 .box {
  width: 50px;
  height: 50px;
  border: 20px solid pink;
  background-color: #afc;
  margin: 50px;
  position: relative;
}
.box::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 10px solid tomato;
}
```

box-shadow: h-shadow v-shadow blur spread color inset，h-shadow1 v-shadow1 blur1 spread1 color1 inset1; box-shadow 向框添加一个或多个阴影。该属性是由逗号分隔的阴影列表，每个阴影由 2-4 个长度值、可选的颜色值以及可选的 inset 关键词来规定。省略长度的值是 0。

| 值         | 描述                                     |
| :--------- | :--------------------------------------- |
| _h-shadow_ | 必需。水平阴影的位置。允许负值。         |
| _v-shadow_ | 必需。垂直阴影的位置。允许负值。         |
| _blur_     | 可选。模糊距离。                         |
| _spread_   | 可选。阴影的尺寸。                       |
| _color_    | 可选。阴影的颜色。请参阅 CSS 颜色值。    |
| inset      | 可选。将外部阴影 (outset) 改为内部阴影。 |

#### 一个 DIV 实现双大于号指针

```css
.box {
  width: 50px;
  height: 50px;
  border-width: 2px 2px 0 0;
  border-style: solid;
  border-color: tomato;
  margin: 50px;
  padding: 5px;
  transform: rotateZ(45deg);
}
.box:before {
  content: ' ';
  display: inline-block;
  height: 50px;
  width: 50px;
  border-width: 2px 2px 0 0;
  border-color: #000;
  border-style: solid;
}
```

![image-20210315183946743](.\typora-user-images\image-20210315183946743.png)

#### 边界 border`和轮廓`outline

- 轮廓不占据空间，在元素内容之外绘制,可能覆盖其他元素，border 则会挤开其他元素的位置
- 根据规范，轮廓不必为矩形，尽管通常是矩形。

```
/* 颜色 | 样式 | 宽度 */outline: green solid 3px;/* width | style | color */border: medium dashed green; 如果边框的样式未定义，它将不可见。 这是因为样式默认为none。
```

#### 图片水平垂直居中

```html
<style type="text/css">
    *{
        margin: 0;
        padding: 0;
    }
    #wrap{
        height: 400px;
        width: 400px;
        border: 1px solid ;
        margin: 0 auto;
        text-align: center;
    }
    #wrap:after{
        content: "";
        display: inline-block;
        height: 100%;
        width: 0px;
        background: pink;
        vertical-align: middle;
    }
    #wrap img{
        vertical-align: middle;
    }
</style>
</head>
<body>
    <div id="wrap">
        <img src="img/img2.jpg" width="150"/>
    </div>
</body>
渲染结果：
```

<img src=".\typora-user-images\image-20210319234112668.png" alt="image-20210319234112668" style="zoom:80%;" />

#### 自定义检测低版本 ie 的函数

```
自定义检测低版本ie的函数:
<script type="text/javascript">
      console.log(isIE(8));


      //js中的作用域都是函数作用域
      function isIE(version){
        var b = document.createElement("b");
        b.innerHTML="<!--[if IE "+version+"]><i></i><![endif]-->";
        return   b.getElementsByTagName("i").length == 1 ;
      }

    //伪数组:  具有length属性的js对象
//    console.log(document.body.getElementsByTagName("i").length);
  </script>
```

#### classList 属性及方法（HTML5 属性）

element.classList：它返回对应元素的 class 属性值组成的类数组对象。classList 本身是只读属性，但同时它也有一些方法，可以实现对元素类的操作。

classList 上可以使用的方法：

- add(_class1, class2, ..._): 在元素中添加一个或多个类名。 如果指定的类名已存在，则不会添加
- remove(_class1, class2, ..._)： 移除元素中一个或多个类名。
- toggle(_class,_ true|false)：在元素中切换类名。第一个参数为要在元素中移除的类名，并返回 false。如果该类名不存在则会在元素中添加类名，并返回 true。
- contains(_class_)： 返回布尔值，判断指定的类名是否存在。
- item(_index_)： 返回元素中索引值对应的类名。索引值从 0 开始。

通过 classList 可以实现对一个元素类的增删改查。

**判断一个元素中是否有某个类名：**

```javascript
function hasClassName(node, className) {
  if (classname && node.classList && node.classList.contains) {
    return node.classList.contains(classname);
  } else {
    return node.className.includes(className) || node.className.indexOf(className) != -1;
  }
}
```

**移除一个元素中某个类名：**

```javascript
function removeClassName(node, className) {
  if (className && node && node.classList && node.classList.remove) {
    node.classList.remove(className);
  } else {
    node.className = node.className.replace(new RegExp('\\b' + className + '\\b'), '');
  }
}
```

**为某个节点添加指定的 className:**

```javascript
function addClassName(node, className) {
  var cn = node.className;
  if (className && node && node.classList && node.classList.add) {
    node.classList.add(className);
  } else {
    if ((' ' + cn + ' ').indexOf(' ' + className + ' ') === -1) {
      node.className = cn + ' ' + className;
    }
  }
}
```

**在某个节点上进行指定的两个或多个 className 的切换:**

```javascript
function toggle(node, className1) {
  if (className && node && node.classList && node.classList.toggle) {
    node.classList.toggle(className);
  } else {
    if (dom.hasClassName(node, className)) {
      dom.removeClassName(node, className);
    } else {
      dom.addClassName(node, className);
    }
  }
}
```

**获取属性值：**

```
HTMLElementObject.className
```

**设置属性值：**

```
HTMLElementObject.className = classname
```

#### 查找两个节点是否有共同的父节点并返回结果

```javascript
//递归
function findParentNode(node1, node2) {
  if (node1.contains(node2)) {
    return node1;
  } else if (node2.contains(node1)) {
    return node2;
  } else {
    let parentNode = node1.parentNode;
    return findParent(parentNode, node2);
  }
}

//循环
function commonParentNode(Node1, Node2) {
  for (; Node1; Node1 = Node1.parentNode) {
    if (Node1.contains(Node2)) {
      return Node1;
    }
  }
}
```

### 字体图标（iconfont）使用

作用：将一些常用和通用的小图标以字体的方式表现出来，而不再使用精灵图或者小图片。

- 字体图标放大或者缩小都不会导致失真效果
- 可以很方便的切换和改变字体图标颜色等
- 文件大小小，一次请求就能满足本次页面所有用到该字体库的所有地方

使用方法：

方式一：unicode 引用（最早期的使用方式）

特点：

- 兼容性最好，支持 ie6+，及所有现代浏览器
- 支持按字体的方式去动态调整图标大小，颜色，字体阴影等
- 不支持多色

1. 前往字体图标库中选择并下载到本地，解压将文件目录命名为 font（约定）后放在项目的根目录下，目录中的可能文件组成有一下部分

![image-20210528195552880](.\typora-user-images\image-20210528195552880.png)

2. 在使用到的页面引入上图中的 iconfont.css 文件

   ```css
   @font-face {
     font-family: 'iconfont'; /* Project id 2578247 */
     src: url('iconfont.woff2?t=1622201641915') format('woff2'), url('iconfont.woff?t=1622201641915')
         format('woff'), url('iconfont.ttf?t=1622201641915') format('truetype');
   }

   .iconfont {
     font-family: 'iconfont' !important;
     font-size: 16px;
     font-style: normal;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
   ```

   或者在该页面中写入一下 css 部分

   ```
   <style>
   //可以注意字体文件的相对路径
   @font-face {font-family: 'iconfont';
       src: url('iconfont.eot');
       src: url('iconfont.eot?#iefix') format('embedded-opentype'),
       url('iconfont.woff') format('woff'),
       url('iconfont.ttf') format('truetype'),
       url('iconfont.svg#iconfont') format('svg');
   }
   .iconfont {
     font-family: "iconfont" !important;
     font-size: 16px;
     font-style: normal;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
   </style>
   ```

3. 在页面中需要使用字体图标的地方以以下方式使用

   ```
   <i class="iconfont">&#x33;</i>  //&#x33;是字体图标对应的编码，可以在文件目录的案例中找到或者在字体图标下载的那个网站下载的那个页面找到  ，同时，类名也是必不可少的，因为css中定义了该类选中的元素应该使用的是指定的字体族，上例中字体组叫：’iconfont'
   ```

   ![image-20210528200518574](.\typora-user-images\image-20210528200518574.png)

![image-20210528200549426](.\typora-user-images\image-20210528200549426.png)

方式二：font-class 引用（常用方式）

font-class 是 unicode 使用方式的一种变种，主要是解决 unicode 书写不直观，语意不明确的问题。

特点：

- 兼容性良好，支持 ie8+，及所有现代浏览器
- 相比于 unicode 语意明确，书写更直观，可以很容易分辨这个 icon 是什么
- 因为使用 class 来定义图标，所以当要替换图标时，只需要修改 class 里面的 unicode 引用
- 多色图标不支持

1. 引入项目下面生成的 fontclass 代码

   ![image-20210528195552880](.\typora-user-images\image-20210528195552880.png)

   ```html
   <link rel="stylesheet" href="font/iconfont.css" /> //对应上图中的iconfont.css
   ```

   文件中的 css 样式安排如下，可以看出，都是给要使用字体图标的元素添加类名并且使用了为元素选择器去对应字体图标的编码数字。

```css
@font-face {
    font-family: "iconfont";
    /* Project id 2578247 */
    src: url('iconfont.woff2?t=1622201641915') format('woff2'), url('iconfont.woff?t=1622201641915') format('woff'), url('iconfont.ttf?t=1622201641915') format('truetype');
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-ihome-:before {
  content: "\e631";
}

.icon-ihome-1:before {
  content: "\e632";
}

.icon-ihome-2:before {
  content: "\e633";
}

.icon-ihome-3:before {
  content: "\e634";
}
....
```

使用方式：

```html
<span class="iconfont icon-xxx"> </span> //以类名的方式使用
```

方式三：Symbol 引用

这种用法其实是做了一个 SVG 的集合

特点：

- 支持多色图标
- 通过一些技巧，支持像字体那样，通过 `font-size`, `color` 来调整样式
- 兼容性较差，支持 IE9+，及现代浏览器
- 浏览器渲染 SVG 的性能一般，还不如 png

1. 引入项目下面生成的 symbol 代码

   ```
   <script src="/font/iconfont.js"></script>
   ```

2. 加入通用 CSS 代码（引入一次就行）

   ```
   <style>
   .icon {
       width: 1em;
       height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
   }
   </style>
   ```

3. 挑选相应图标并获取类名，应用于页面

   ```
   <svg class="icon" aria-hidden="true">
     <use xlink:href="#icon-xxx"></use>
   </svg>
   ```
