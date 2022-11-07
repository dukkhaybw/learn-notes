# HTML 面试

h5 中的常见标签和新增标签

css3 中没有兼容性问题 css 属性和新增属性

`<!DOCTYPE html> ` 文档声明标签，告诉浏览器 html 文档使用哪个版本的 html 来显示网页

html 文档中的 html 标签上的 lang 属性是指示当前页面是使用的什么语言。（en,zh-CN）

meta 标签中的属性 charset='uft-8' 是指示浏览器使用什么字符集来解析 html，而 html 文档本身使用的是什么编码方式得看编写 html 时编辑器采用得编码字符集。

img 标签的 src，alt，title 属性

a 标签的 href，target=‘`_self | _blank`’ , 锚点链接

`<!-- -->`注释标签

### 浏览器渲染引擎

浏览器渲染引擎也称为浏览器内核。

| 浏览器      | 渲染引擎                                |
| ----------- | --------------------------------------- |
| IE          | Trident                                 |
| Firefox     | Gecko                                   |
| Safari      | webkit                                  |
| Chrome      | Blink（基于 webkit 改造优化的渲染引擎） |
| Opera、Edge | Blink                                   |

### 如何理解 HTML 语义化?

(语义化:用合适的标签做合适的事情。)文本内容的结构化。

1. .搜索引擎的爬虫依赖于标签来确定上下文和各个关键字的权重，利于 SEO;
2. 在没有样式 CCS 情况下也以一种格式良好的方式显示，并且是容易阅读的;
3. 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解;
4. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以有意义的方式来渲染网页；

### 前端需要注意哪些`SEO`

SEO（Search Engine Optimization）：搜索引擎优化。利用搜索引擎的规则提高网站在有关搜索引擎内的自然排名。

- 合理的`title`、`description`、`keywords`：搜索对着三项的权重逐个减小。

- 语义化的`HTML`代码，符合 W3C 规范：语义化代码让搜索引擎容易理解网页。

  ![image-20220215102513624](..\typora-user-images\image-20220215102513624.png)

- 少用`iframe`：搜索引擎不会抓取`iframe`中的内容
- 重要内容`HTML`代码放在最前：搜索引擎抓取`HTML`顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
- 重要内容不要用`js`输出：爬虫不会执行 js 获取内容
- 非装饰性图片必须加`alt`

### 写出几个文本格式化标签

| 标签名              | 有无语义 | 作用             |
| ------------------- | -------- | ---------------- |
| `<strong></strong>` | 有语义化 | 加粗标签文本内   |
| `<em></em>`         | 有语义化 | 倾斜标签文本     |
| `<del></del>`       | 有语义化 | 删除线           |
| `<ins></ins>`       | 有语义化 | 下划线           |
|                     |          |                  |
| `<b></b>`           | 无语义化 | 加粗标签文本内容 |
| `<i></i>`           | 无语义化 | 倾斜标签文本     |
| `<s></s>`           | 无语义化 | 删除线           |
| `<u></u>`           | 无语义化 | 下划线           |

### HTML5 新增标签

图形标签：canvas

媒体标签：audio、video、source、track

<track> 标签为媒体元素（比如 <audio> and <video>）规定外部文本轨道，也就是字幕，字幕格式有 WebVTT 格式（.vtt 格式文件）。

这个元素用于规定字幕文件或其他包含文本的文件，当媒体播放时，这些文件是可见的。

<input> 类型：text, search, url, telephone, email, password, datepickers, range 以及 color

语义化标签：

- header，footer，article，main、section、nav、aside

### HTML5 标准提供了哪些新的 API

HTML5 新增其他内容：

- localStorage，sessionStorage

- GeolocationAPI （地理定位）

  - navigator.geolocation

  - getCurrentPosition() 方法来获得用户的位置，getCurrentPosition() 方法的第二个参数用于处理错误

    ```
    var x=document.getElementById("demo");
    function getLocation()
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else
        {
            x.innerHTML="该浏览器不支持获取地理位置。";
        }
    }
    getLocation()
    function showPosition(position)
    {
        x.innerHTML="纬度: " + position.coords.latitude +
        "<br>经度: " + position.coords.longitude;
    }
    ```

- Web Workers

- 5 个 API-拖拽释放(Drag and drop)

### 如何处理 HTML5 新标签的浏览器兼容问题

方式一： IE8/IE7/IE6 支持通过 document.createElement 方法产生的标签，可以利用这一特性让这些浏览器支持 HTML5 新标签；

浏览器支持新标签后，还需要添加标签默认的样式。

```
<script>
    document.createElement('header');
    document.createElement('nav');
    document.createElement('article');
    document.createElement('footer');
</script>
或者
var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
var i= e.length;
while (i--){
    document.createElement(e[i])
}
```

方式二：直接使用成熟的框架、使用最多的是 html5shiv 框架） html5 新元素不能被 IE6-8 识别，不能作为父节点包裹子元素，并且不能应用 CSS 样式。让 CSS 样式应用在未知元素上只需执行 document.createElement(elementName) 即可实现。html5shiv 就是根据这个原理创建的。bootstrap 框架也是使用的这个来兼容低版本 IE 的。

```html
<!--[if lt IE 9]>
  <script>
    src = 'http://html5shim.googlecode.com/svn/trunk/html5.js';
  </script>
<![endif]-->

// 引入上述包后，还需要添加为标签添加css
<style>
  article,
  aside,
  dialog,
  footer,
  header,
  section,
  footer,
  nav,
  figure,
  menu {
    display: block;
  }
</style>
```

### HTML5 引入什么新的表单属性

- **autocomplete**：属性适用于 form,以及：text, search, url, telephone, email, password, date，pickers, range, color。 ----<form autocomplete="on|off"> ; 自动完成允许浏览器预测对字段的输入。当用户在字段开始键入时，浏览器基于之前键入过的值，应该显示出在字段中填写的选项。
- novalidate ：如果使用该属性，则提交表单时不进行内容的验证。 novalidate="novalidate"
- autofocus：规定输入字段在页面加载时是否获得焦点，加载完成后，光标马上定位在该 input；
- form：form 属性的值必须是其所属表单的 id。
- placeholder：提供可描述输入字段预期值的提示信息（hint）。
- required：规定必需在提交之前填写输入字段。 如果使用该属性，则字段是必填（或必选）的。
- multiple：如果使用该属性，则允许一个以上的值，比如上传文件的时候，设置这个属性后可以一次选择几个图片；
- min 和 max：min 属性与 max 属性配合使用，可创建合法值范围，两个要一对用。语法是 选择 0-10 数字：`input type="number" name="points" min="0" max="10" `

### HTML5 页面嵌入音频

audio 元素可以包含多个音频资源， 这些音频资源可以使用 src 属性或者 source 元素来进行描述； 浏览器将会选择最合适的一个来使用。

```html
<audio src="***.mp3"></audio>

<audio controls>
  <source src="jamshed.mp3" type="audio/mpeg" />
  您的浏览器不支持音频嵌入功能。
</audio>

<audio controls="controls">
  Your browser does not support the <code>audio</code> element.
  <source src="horse.ogv" type="audio/wav" />
  <source src="axihe.mp3" type="audio/mpeg" />
  您的浏览器不支持 audio 元素。
</audio>
```

### 在 HTML5 页面嵌入视频

video 元素 用于在 HTML 或者 XHTML 文档中嵌入媒体播放器，用于支持文档内的视频播放。

```html
<video controls width="250">
  <source src="/media/examples/flower.webm" type="video/webm" />
  <source src="/media/examples/flower.mp4" type="video/mp4" />
  您的浏览器不支持 video 标签。
</video>

<!-- Simple video example -->
<video src="videofile.ogg" autoplay poster="posterimage.jpg">
  抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以 <a href="videofile.ogg">下载</a>
  并用你喜欢的播放器观看!
</video>

<!-- Video with subtitles -->
<video src="foo.ogg">
  <track kind="subtitles" src="foo.en.vtt" srclang="en" label="English" />
  <track kind="subtitles" src="foo.sv.vtt" srclang="sv" label="Svenska" />
</video>
```

### HTML5 的 form 如何关闭自动完成功能

HTML 的输入框可以拥有自动完成的功能，当你往输入框输入内容的时候，浏览器会从你以前的同名输入框的历史记录中查找出类似的内容并列在输入框下面，这样就不用全部输入进去了，直接选择列表中的项目就可以了。

`autocomplete="off"`（给不想要提示的 form 或某个 input 设置为 autocomplete=off。）

```
<form action="demo-form.php" autocomplete="off">
  First name:<input type="text" name="fname"><br>
  Last name: <input type="text" name="lname"><br>
  E-mail: <input type="email" name="email" autocomplete="off"><br>
  <input type="submit">
</form>
```

虽然你设置了`autocomplete="off"`，但是如果用户选择了记住，Chrome 还是会在下次登录给你补全的；

解决 Chrome 记住的方式：

```
<input type="password" style="display:none;width:0;height:0;">
<input data-placeholder="请输入密码" name="password" data-required="true"  type="password" autocomplete="new-password" data-max-length="50" tabindex="2" spellcheck="false" id="auto-id-1505904797992" placeholder="请输入密码">
```

### html 常见的兼容性问题

- 浏览器默认的 margin 和 padding 不同,解决方案：加一个全局的 \*{margin:0;padding:0;} 来统一。
- event 对象的区别,IE 下，event 对象有 x、y 属性，但是没有 pageX、pageY 属性；Firefox 下，event 对象有 pageX、pageY 属性，但是没有 x、y 属性
- Chrome 12px 像素,Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,解决方法：可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决
- hover 和 active 失效,改变 CSS 属性的排列顺序 L-V-H-A

### 实现不使用 border 画出 1px 高的线

可以用 background，或者加个元素高度一 ，伪类来做；

`<div style="height:1px;overflow:hidden;background:red"></div>`

### herf 和 src 的区别

href(Hypertext Reference)标识超文本引用，指向需要连结的地方，是与该页面有关联的，是引用。用在 link 和 a 等元素上，href 是引用和页面关联，**用来建立当前元素和文档之间的链接。**

src （Source）表示指向资源的来源地址，是引入目的，在请求 src 资源时会将其指向的资源下载并应用到文档中，用在 img，script，iframe 上。

src 通常用作“拿取”（引入），href 用作 "连结前往"（引用）。

### 网页中 mate viewport 具体参数使用

```
<meta  name="viewport"  content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,userscalable=no"/>

width    设置 viewport 宽度，为一个正整数，或字符串‘device-width’
device-width  设备宽度
height   设置 viewport 高度，一般设置了宽度，会自动解析出高度，可以不用设置
initial-scale    默认缩放比例（初始缩放比例），为一个数字，可以带小数
minimum-scale    允许用户最小缩放比例，为一个数字，可以带小数
maximum-scale    允许用户最大缩放比例，为一个数字，可以带小数
user-scalable    是否允许手动缩放
```

### `<meta>`标签

它描述的是关于文档的元数据信息，可用于指定描述页面的描述信息，作者，关键字等

```css
<meta name="keywords" content="关键字1，2，3，4....">：定义了文档关键词，用于搜索引擎。
<meta name="description" content="......">:定义了WEB页面的描述信息
<meta name="author" content="......">：定义作者名
<meta name="refresh" content="N">:每N秒自动刷新一次
<meta http-equiv="description" content="......">
```

### html 文档中 meta charset="UTF-8"的作用

 它并不是说该 html 页面是采用 utf-8 来编码的，而是告诉浏览器以 UTF-8 规则来解码 html 页面。页面正真的编码规则采用的是对应编辑器中确定的。如果编辑器中 GBK 对编码页面，但<meta>标签内告诉浏览器用 utf-8 解码也会导致乱码。

### 都有哪些标签？有什么意思？

### HTML 常见元素

大方向：块级标签，行内标签，行内块标签

- 块级标签

  div、p、h1~h6、ol、ul、dl、li、dt、dd、header、footer、mian、nav、section、artical、aside、table、tr、td、form、blockquote、address...

- 行内标签

  a [href ,target="_self | _blank"]、span、small、strong、em、i、button...

- 行内块标签

  img、input、textarea、

- head 区元素

  meta、title、style、link、script、base

#### 这三类标签的区别

块级元素：

- 独占一行
- 高、宽、行高以及顶和底边距都可设置。
- 如果不设置宽度，默认值是 auto，那么块级元素会占父标签的 100%

行内元素：

- 可以与其他行内元素并排

- 元素的高、宽、行高及顶部和底部边距不可设置

- 元素的宽度就是它包含的文字或图片的宽度，不可改变

- 行内元素的水平方向的 padding-left 和 padding-right 都会产生边距效果，但是竖直方向上的 padding-top 和 padding-bottom 都不会产生边距效果

- 给行内元素设置 border 是可以被渲染出来的，同时在水平方向可以挤开其他行内元素，但是在垂直方向上，不会挤开其他元素。

  ```
  span{
    border: 10px solid rebeccapurple;
  }

  <div>asd</div>
    <span>123456789</span><em>asdqweqwee</em>
  <div>qweretry</div>
  ```

  ![image-20210316121322921](..\typora-user-images\image-20210316121322921.png)

- 给行内元素设置 margin 在水平方向可以挤开其他行内元素，但是在垂直方向上直接无效，不会挤开其他元素。

  ![image-20210316121523899](..\typora-user-images\image-20210316121523899.png)

行内块元素：

- 能和其他行内块元素待在一行
- 元素的高度、宽度、行高以及顶和底边距都可设置

#### 三类标签如何相互转换

![image-20210313234047812](..\typora-user-images\image-20210313234047812.png)

#### display 的值有哪些值

CSS 1

- display: none; 既不会占据空间**，**也无法显示\*\*，相当于该元素不存在，但是在 DOM 树结构中。该属性可以用来改善重排与重绘，同时也用它来做模态窗等效果。

- display: inline;设置高度、宽度都无效，同时 text-align 属性设置也无效，但是设置了 line-height 会让 inline 元素居中。两个 inline 标签之间出现的间隔原因是 div 换行产生的换行空白。解决办法：

  - 将两个 inline 标签写到一行，

    ```
    <body>
      <div class="test">123</div><div class="test">123</div>
    </body>
    ```

  - 其他方式

    ```
    <body>
      <div class="main">
        <div class="test">zhan</div>
        <div class="test">123</div>
      </div>
    </body>
    </html>

    html{
      -webkit-text-size-adjust:none;/* 使用webkit的私有属性，让字体大小不受设备终端的调整，可定义字体大小小于12px */
    }
    .main{
      font-size:0;
      *word-spacing:-1px;/* 使用word-spacing 修复 IE6、7 中始终存在的 1px 空隙，减少单词间的空白（即字间隔） */
    }
    .test{
      display:inline;
      width: 10000px;  //宽高都无效
      height:10000px;
      border:1px solid;
      font-size:12px;
      letter-spacing: normal;/* 设置字母、字间距为0 */
      word-spacing: normal; /* 设置单词、字段间距为0 */
    }
    ```

  - chome49 浏览器只用设置父元素的 font-size 为 0 即可

- display: block; 如果不指定宽高，默认会继承父元素的宽度，并且独占一行，即使宽度有剩余也会独占一行，**高度一般以子元素撑开的高度为准**，也可以设置宽度和高度。设计一个 div 宽高都是整个屏幕：基本原理：div 继承的是父元素 body 的高度，body 是继承 html 的高度，html 是继承的浏览器屏幕的高度。

  ```
  *{
    padding: 0;
    margin:0;
  }
  html,body{
    height: 100%;
  }
  .main{
    height: 100%;
  }
  ```

- display: list-item;

  把元素作为列表显示，要完全模仿列表的话还需要加上 `list-style-position`，`list-style-type`

  ```
  <div>
    <span>111111</span>
    <span>222222</span>
    <span>333333</span>
  </div>
  
  div{
    padding-left:30px;
  }
  
  span{
    display:list-item;
    list-style:disc outside none;
  }
  ```

  ![image-20210313235628416](..\typora-user-images\image-20210313235628416.png)

CSS 2.1

- display: inline-block;**inline-block 既具有 block 的宽高特性又具有 inline 的同行元素特性。** 通过 inline-block 结合`text-align: justify` 还可以实现固定宽高的列表两端对齐布局。**inline-block 会形成一个 BFC**

- display: table; display: inline-table; display: table-cell; display: table-column; display: table-column-group; display: table-footer-group; display: table-header-group; display: table-row; display: table-row-group; display: table-caption;

  此元素会作为块级表格来显示（类似 table），表格前后带有换行符。CSS 表格能够解决所有那些我们在使用绝对定位和浮动定位进行多列布局时所遇到的问题。`display:table`的 CSS 声明能够让一个 HTML 元素和它的子节点像 table 元素一样。使用基于表格的 CSS 布局，使我们能够轻松定义一个单元格的边界、背景等样式， **而不会产生因为使用了 table 那样的制表标签所导致的语义化问题**。

  如下是使用 table 属性，实现三栏布局的例子：

  ```
  <body>
  <div class="main">
    <div class="tr tr1">  //第一行
      <div class="td">head1</div>
      <div class="td">head2</div>
      <div class="td">head3</div>
    </div>
    <div class="tr tr2">   //第二行
      <div class="td">123</div>
      <div class="td">123</div>
      <div class="td">123</div>
    </div>
  </div>
  </body>
  
  .main{
    display: table;
    width:100%;
    border-collapse: collapse;/*为表格设置合并边框模型：*/
  }
  .tr{
    display: table-row;
    border-color: inherit;
  }
  .tr1 .td{
    height:50px;
    vertical-align: middle;
  }
  .td{
    display: table-cell;
    border: 1px solid;
  }
  .td:nth-of-type(1){
    width: 100px;
  }
  .td:nth-of-type(3){
    width: 100px;
  }
  ```

CSS 3

- display: flex; display: box; display: inline-flex;

  flex 是一种弹性布局属性 **注意，设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。** 主要属性有两大类：容器属性和项目的属性

  #### 容器属性

  - flex-direction: 属性决定主轴的方向（即项目的排列方向）。
  - flex-wrap: 默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap 属性定义，如果一条轴线排不下，如何换行。
  - flex-flow: 属性是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap。
  - justify-content: 属性定义了项目在主轴上的对齐方式。
  - align-items: 属性定义项目在交叉轴上如何对齐。
  - align-content: 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

  #### 项目属性

  - order: 定义项目的排列顺序。数值越小，排列越靠前，默认为 0。
  - flex-grow: 定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
  - flex-shrink: 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
  - flex-basis: 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。
  - flex: 属性是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。
  - align-self: 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

  ```
  display: grid;
  display: inline-grid;
  
  display: ruby;
  display: ruby-base;
  display: ruby-text;
  display: ruby-base-container;
  display: ruby-text-container;
  
  /* Global values */
  display: inherit;
  display: initial;
  display: unset;
  ```

  #### display：none

  - 除了 display：none 能隐藏元素，还有什么方法可以隐藏元素
  - display：none 与 visibility：hidden 的区别
  - opacity 的兼容处理
  - filter 还能做什么事

#### 使用 css 让一个 div 消失在可视区内

1.position:absolute/relative/fixed + 方位 top/bottom/left/right: -9999px 假设有一个元素你想要与它交互，但是你又不想让它影响你的网页布局，没有合适的属性可以处理这种情况（opacity 和 visibility 影响布局， display 不影响布局但又无法直接交互——译者注）。在这种情况下，你只能考虑将元素移出可视区域。 **这个方法在创建自定义复选框和单选按钮时经常被使用。（用 DOM 模拟复选框和单选按钮，但用这个方法隐藏真正的 checkbox 和 radio 元素来“接收”焦点切换）**

2.display:none 元素不可见且盒模型不生成。使用这个属性，被隐藏的元素不占据任何空间。一旦 `display` 设为 `none` **任何对该元素直接的用户交互操作都不可能生效**。读屏软件也不会读到元素的内容。这个元素的子孙元素也会被同时隐藏。**为这个属性添加过渡动画是无效**，它的任何不同状态值之间的切换总是会立即生效。**通过 DOM 依然可以访问到这个元素**。可以通过 DOM 来操作它，该元素任然存在于 DOM 树结构中。

使用 display:none 隐藏的元素不会被百度等搜索网站检索，会影响到网站的 SEO，某些情况下可以使用 left:-100000px 来达到同样效果。

3.visibility:hidden 将它的值设为 `hidden` 将隐藏我们的元素。如同 `opacity` 属性，**被隐藏的元素依然会对我们的网页布局起作用。**与 `opacity` 唯一不同的是它**不会响应任何用户交互**。此外，元素在读屏软件中也会被隐藏。

4.width:0 + overflow:hidden ，height:0 + overflow:hidden 内容会被修剪，并且其余内容是不可见的

5.margin-top/bottom/left/right:-9999px; 移除界面

6.background-color:transparent 把背景色设置为透明

7.opacity:0 设置元素的透明度。它不是为改变元素的边界框（bounding box）而设计的。这意味着将 opacity 设为 0 只能从视觉上隐藏元素。而元素本身依然占据它自己的位置并对网页的布局起作用。它也将响应用户交互。元素和它所有的内容会被读屏软件阅读。

8.transform: translateX(-9999px)/translateY(-9999px)/translate(-9999px,-9999px)平移出去 9.transform: scale(0) 缩放

### 元素的 alt 和 title **属性** 有什么区别？

两个属性最常见用在 `<img>` 标签上。

`alt` 属性它规定在图像无法显示时的替代文本（网速慢，src 地址错误，浏览器禁用图像等）。

`title` 属性规定关于元素的额外信息，通常会在鼠标移到元素上时显示一段工具提示文本（tooltip text）。

### 自闭和标签（单标签，空标签）

- input、img、br 、hr、meta、link、base

### link 标签和@import 的区别

**1.从属关系区别** `@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是 HTML 提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

**2.加载顺序区别** 加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。

**3.兼容性区别** `@import`是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；`link`标签作为 HTML 元素，不存在兼容性问题。

**4.DOM 可控性区别** 可以通过 JS 操作 DOM ，插入`link`标签来改变样式；由于 DOM 方法是基于文档的，无法使用`@import`的方式插入样式。

**5.权重区别(该项有争议，下文将详解)** `link`引入的样式权重大于`@import`引入的样式。

**6.书写位置不同**

```
<head>
<link rel="stylesheet" type="text/css" href="theme.css" />
</head>

<style type="text/css">
        @import url("URL1");    //@import必须写在开头
        @import url("URL2");    //@import必须写在开头
</style>
```

### DOCTYPE（Document Type Declaration）文档类型声明（DTD）作用

 文档类型声明是必须的。如果没有声明文档类型,**大部分浏览器会启用“怪异模式”来处理页面**，DTD 声明还关系 CSS 会以什么模式解析甚至会影响 js 脚本的解析，浏览器解析 CSS 有两种模式：**标准模式（strict mode）和怪异模式（quirks mode）**

 DOCTYPE 声明文档类型，以便验证文档是否符合文档类型定义（DTD），同时指定了浏览器关于页面使用哪个 HTML 版本进行编写的指令，约束 html 文档的书写（如结束标签能不能少，定义了多少可以使用的标签。）

 DOCTYPE 声明不是 html 标签，必须放在 html 文档的第一行，而且绝不能在它之前添加 xml 声明语句，否则在 IE6 会触发怪异模式。在 HTML 4.0.1 中，DOCTYPE 引用了 DTD，因为 HTML 4.0.1 基于 SGML,这个版本是 IE6 开始兼容的。DTD 规定了标记语言的规则，这样浏览器才能正确的呈现内容。HTML5 不是基于 SGML，所以不需要引用 DTD，HTML5 是 IE9 开始兼容的。

 通过 document.compatMode 的返回值可以得出当前 html 文件的渲染模式。返回值有：css1Compat（标准模式和几乎标准模式） 或者 BackCompat（怪异模式） 。

 ie9 以上的浏览器中，三种模式的渲染几乎没有差别；在 ie7、8、9 中理论上有怪异模式，实际只有标准模式；在 IE6 中，标准模式和怪异模式差异最大；在 ie6 以下只有怪异模式。

### HTML 元素的嵌套关系如何确定

- 块级元素可以包含行内元素
- 块级元素不一定能包含块级元素（p 中不能包含 div）
- 行内元素一般不能包含块级元素（a 元素可以包含块级元素，因为 a 被看作透明类容模型标签了，就是这样使用 a 时，浏览器解析它的嵌套合法性时，会将 a 看作不存在的结构。）
  - `<p><a href='----'> <div></div></a></p>`这段 html 代码由浏览器完全自行解析

### 通过 Ajax 而不用 form 的默认提交行为，那是否还需要这个 form 元素

从技术上讲，并不一定需要 form 元素，但是开发时任然建议使用 form，因为在 form 元素中可以利用 submit 和 reset 控件，如果没有 form，这两个元素是不起作用的。同时，用 form 可通过一些方式批量获取表单数据，用 form 还可以和一些第三方库结合使用做表单验证。

### HTML 'data-'属性的作用是什么？

用于自定义属性，通过这种方法设置的属性被存放在了用 js 获取的 DOM 对象的 dataset 属性中。不支持该属性的浏览器可以通过 getAttribute 方法获取。

![image-20210313211207900](..\typora-user-images\image-20210313211207900.png)

![image-20210313211146255](..\typora-user-images\image-20210313211146255.png)

data 设定为 HTML 属性，他们同样能被 CSS 访问，使用函数 attr()获取。如上面的：.article-tit { width:attr(data-index)px } 或者 .article-tit[data-index='20'] { width:100px }.

### 扩展

ps 切图：

方式一：

- 右键单击图层，快速导出为 png
- 右键合并多个图层（ctrl+e）后在快速导出图层

方式二：

- 利用切片工具 手动选择切图范围
- 然后在 文件菜单 中，选择 导出 ，存储为 web 设备所用的格式界面后选择所需图片格式

方式三：

- 下载安装 cutterman 切图插件（要求 ps 为完整版的）
- 在 ps 菜单栏中的工具项目中的扩展功能中可以找到 cutterman 工具调出使用

### `HTML5`的离线储存怎么使用，工作原理能不能解释一下？

作用：在用户没有联网时，可以正常访问站点或应用，在用户联网时，自动更新缓存数据。

HTML5 的离线存储是基于一个新建的.appcache 文件的，通过这个文件上的解析清单离线存储资源，这些资源就会像 cookie 一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

使用：

```html
<!DOCTYPE html>
<-- 在html页面头部加入一个manifest的属性 -->
<html manifest="cache.manifest">
  ...
</html>
```

书写 cache.manifest 文件:

```
CACHE MANIFEST
#v0.11

CACHE:
js/app.js
css/style.css

NETWORK:
resourse/logo.png

FALLBACK:
/ /offline.html
```

**CACHE** ：在此标题下列出的文件将在首次下载后进行缓存。（由于包含 manifest 文件的页面将被自动离线存储，所以不需要把页面自身也列出来）。

**NETWORK** ：在此标题下列出的文件需要与服务器的连接，且不会被缓存，离线时无法使用。可以使用 “\*” 来指示所有其他资源/文件都需要因特网连接。

如果在 CACHE 和 NETWORK 中有一个相同的资源，那么这个资源还是会被离线存储，也就是说 CACHE 的优先级更高。

**FALLBACK**：在此标题下列出的文件规定当页面无法访问时的回退页面。比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问 offline.html。

浏览器是怎么对 HTML5 的离线储存资源进行管理和加载的呢？

在线的情况下，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问 app，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过 app 并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。离线的情况下，浏览器就直接使用离线存储的资源。

### 表单标签上的标签属性

- align：确定该表单元素，而不是单元格内内容的对其方式，值：left，right，center

- border：设置表单的单元格粗细（会生成 table 标签的边框和 td，th 标签的边框）

  ![image-20210803191615585](..\typora-user-images\image-20210803191615585.png)

- cellpadding：设置每个单元格中内容部分和该单元格的边框的距离

- cellspacing：设置两个单元格之间的间隔距离（会设置 table 标签和 td，th 标签之间的间距 和 td 与 th 之间的间隔距离 ）

合并单元格：

- rowspan='合并个数'：跨行合并
- colsoan='合并个数'：跨列合并

![image-20210803191646550](..\typora-user-images\image-20210803191646550.png)

表单控件

- 表单域 form
- 表单元素（放置在表单域中）

![image-20210803191708240](..\typora-user-images\image-20210803191708240.png)

CSS3 动画

```css
/* 定义 */
@keyframes name {
  0% {
  }
  /* .... */
  100% {
  }
}

/* 使用 */
p {
  animation-name: name;
  animation-duration: 1s;
}
```
