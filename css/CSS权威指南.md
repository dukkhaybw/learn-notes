# CSS 权威指南(Cascading Style Sheet)



CSS有一些准则可以遵循，熟记各种属性值及其对应的特性就能快速上手CSS。

CSS属性、CSS概念、属性的深入分析和CSS规则。并且基于这些CSS**规则**创造一些全新的CSS实现。

**在CSS里，页面上的任何看似简单的呈现都是由许多CSS属性共同作用的结果。**手册中罗列的CSS属性及其值只是表层的、独立的一些特性，每个CSS属性在CSS中，都和其他多个CSS属性发生着关系。

对CSS特性的描述就有助于对CSS的整体认知。编程语言看重逻辑思维和抽象能力，但CSS本身并无逻辑可言，看重的是特性间的相互联系和具象能力。



历史

互联网初期，由于页面样式越来越复杂多样，原来在html上写一些简单样式的能力无法再满足新的需求，急需一门专门负责样式的语言，当时就有除了CSS以外的其他样式语言，但是最后CSS依赖自己的层叠特性取得成功。

CSS（Cascading Style Sheets）——层叠样式表，样式可以层层累加。



文档流：“流”实际上是CSS世界中的一种基本的定位和布局机制，可以理解为现实世界的一套物理规则。引导元素排列和定位的规则。

- HTML标签默认就遵循文档流规则
- 文档流可以被打破，来实现各种复杂布局



CSS3

- CSS3媒体查询以及许多响应式布局特性的出现，如图片元素的srcset属性、CSS的object-fit属性。
- 弹性盒子布局（flexible box layout）
- 格栅布局（grid layout）
- 圆角、阴影和渐变
- transform变换
- filter滤镜和混合模式
- animation



块级元素：

- “块级元素”和“display为block的元素”不是一个概念

  > `<li>元素默认的display值是list-item, <table>元素默认的display值是table，但是它们均是“块级元素”，因为它们都符合块级元素的基本特征，也就是一个水平流上只能单独显示一个元素，多个块级元素则换行显示。`

由于“块级元素”具有换行特性，因此理论上它都可以配合clear属性来清除浮动带来的影响。

```css
.clear:after {
  content: '';
  display: table;  // 也可以是block，或者是list-item
  clear: both;
}
```



每个元素都两个盒子，外在盒子和内在盒子。外在盒子负责元素是可以一行显示，还是只能换行显示；内在盒子负责宽高、内容呈现什么的。按照display的属性值不同，值为block的元素的盒子实际由外在的“块级盒子”和内在的“块级容器盒子”组成，值为inline-block的元素则由外在的“内联盒子”和内在的“块级容器盒子”组成，值为inline的元素则内外均是“内联盒子”。

为何display属性值是inline-block的元素既能和图文一行显示，又能直接设置width/height;因为有两个盒子，外面的盒子是inline级别，里面的盒子是block级别。

实际上，如果遵循这种理解，display:block应该脑补成display:block-block，display:table应该脑补成display:block-table，我们平时的写法实际上是一种简写。

由上面的结论得到的衍生知识点：**display:inline-table**

外面是“内联盒子”，里面是“table盒子”。得到的就是一个可以和文字在一行中显示的表格。



**元素都有内外两个盒子，我们平常设置的width/height属性是作用在哪个盒子上？**

内在盒子，也就是“容器盒子”。

**width的默认值是auto，并不是看上去的宽度100%显示这么简单，而是一种margin/border/padding和content内容区域自动分配水平空间的机制。**



格式化宽度仅出现在“绝对定位模型”中，也就是出现在position属性值为absolute或fixed的元素中。在默认情况下，绝对定位元素的宽度表现是“包裹性”，宽度由内部尺寸决定，但是，有一种情况其宽度是由外部尺寸决定的，是什么情况呢？

当left/top或top/bottom对立方位的属性值同时存在的时候，元素的宽度表现为“格式化宽度”，其宽度大小相对于最近的具有定位特性（position属性值不是static）的祖先元素计算。

代码说明：

```css
div { position: absolute; left: 20px; right: 20px; }
```

假设该<div>元素最近的具有定位特性的祖先元素的宽度是1000像素，则这个<div>元素的宽度是960（即1000-20-20）像素。

此外，和上面的普通流一样，“格式化宽度”具有完全的流体性，也就是margin、border、padding和content内容区域同样会自动分配水平（和垂直）空间。













## 第一章

### 背景

> 早期的 html 标签都是有结构化和含义化的,能相对有含义的去描述文档中的各个部分.但是它们对于这些部分应该采用什么显示样式却不涉及.在之后的发展中,对于样式的需求开始越发提高,这就出现了一些容易设置样式但是缺少语义的标签(如:<font>,<big>).但是容易设置样式的标签用的多了,表示语义化的标签用得少了,使得文档的可用性降低.(以前的开发中,使用结构化的 HTML 标签意味着要放弃对于页面外观的很多控制.)

### 结构化和语义化标签的优势 (语义化:用正确的标签做正确的事情。)

1. .搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO;
2. 在没有样式 CCS 情况下也以一种文档格式显示，并且是容易阅读的;
3. 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解;
4. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以有意义的方式来渲染网页；
5. 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

### CSS 产生

> 为了让 html 更加专注于结构化和语义化,就将负责方式的那部分功能给单独提取出来了,这就产生了用于设置样式的 CSS,但它的功能远远比在标签上设置样式强大.以前对于同类标签的相同样式是需要对每个标签都单独设置的,修改时也需要一项一项去找出来并修改.在使用了 CSS 之后可以将所有的样式代码集中放在一个位置,进行统一管理,更加方便修改.由于 CSS 的产生,以前主要用于设置页面样式而缺乏语义的标签也逐渐不再被使用,W3C 已经逐渐废弃了这些标签.

### 简述块级元素和行内元素

1. 块级元素独占一行
2. 块级元素的默认宽度为 auto,它等于父级元素的 content 部分的宽度
3. 块级元素不能嵌套在行内元素中
4. 行内元素一行可放置多个

### link 标签

作用:引入外部样式表

```
<head>
<link rel="stylesheet" type="text/css" href="theme.css" />
</head>
```

### @import 指令

作用:引入一个外部样式表

最常用的场景:在一个样式表中引入其他的样式表 (**外部样式表不能包含任何 html 标签,所以不能使用<link>标签**)

```
 <style type="text/css">
        @import url("URL1");    //@import必须写在开头
        @import url("URL2");    //@import必须写在开头
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

### 内联样式

```
<标签名 style="css属性名:css属性值;css属性名:css属性值;"></标签名>
内部样式表
外部样式表
```

### 网页组成

- 结构（HTML）
- 样式（CSS）
- 行为（JavaScript）

### 软件架构

C（客户端）/S（服务器）架构

- 客户端必须下载安装
- 更新频繁，C 端和 S 端都要更新
- 无法跨平台
- c 端与 s 端通信采用自有协议，相对安全

B（客户端）/S（服务器）架构

- 使用浏览器访问网页客户端
- 不用安装软件，直接访问
- 不用客户端更新软件
- 可跨平台

服务端进行业务逻辑处理。

## 第二章

> 浏览器在读取选择器时,是从右往左的顺序.
>
> CSS 是由许多 **规则** 组成,每条规则又是由 **_选择器_** 与 **_声明块组成_** ,声明块由**_一条或者多条声明_** 组成,**_声明_** 由**_CSS 属性名_** : **_CSS 属性值_** 组成
>
> 类如: h1 {color : red ; background : pink}

### 选择器

1. 元素选择器(标签选择器)

   > 元素选择器通常都是 HTML 元素
   >
   > > ```css
   > > html {
   > >   color: black;
   > > }
   > > h1 {
   > >   color: gray;
   > > }
   > > ```

2. 通配符选择器

   > 匹配所有元素
   >
   > > ```css
   > > * {
   > >   color: red;
   > > }
   > > ```

3. 类选择器

4. ID 选择器

5. 属性选择器

   > 选择具有某个特定属性的元素,而无论属性的值是什么.
   >
   > > ```css
   > > h1[class] {
   > >   color: silver;
   > > }
   > > a[href][title] {
   > >   font-weight: bold;
   > > }
   > > ```
   >
   > 选择那些某个属性为某个确定值的元素
   >
   > > ```css
   > > p[class='urgent warning'] {
   > >   font-weight: bold;
   > > }
   > > ```
   >
   > 基于属性值的一部分而不是整个值来选择元素
   >
   > > | 类型 | 描述 |
   > > | :-- | :-- | --- |
   > > | `[foo~="bar"]` | 选择所有带有`foo`属性、且`foo`属性被空白分隔的单词列表中含有单词`bar`的元素。 |
   > > | `[foo*="bar"]` | 选择所有带有`foo`属性、且`foo`属性值中含有子串`bar`的元素。 |
   > > | `[foo^="bar"]` | 选择所有带有`foo`属性、且`foo`属性值以`bar`开头的元素。 |
   > > | `[foo$="bar"]` | 选择所有带有`foo`属性、且`foo`属性值以`bar`结束的元素。 |
   > > | `[foo | ="bar"]` | 选择所有带有`foo`属性、且`foo`属性值以`bar`开头后接一个短线（`U+002D`）或者属性值是`bar`的元素。 |

#### 基础选择器的符合用法

1. 后代选择器

2. 子代选择器

3. 并集选择器

   > 把相同的样式引用在多个元素上
   >
   > > ```css
   > > h2,
   > > p {
   > >   color: gray;
   > > }
   > > h1,
   > > h2,
   > > h3,
   > > h4,
   > > h5,
   > > h6 {
   > >   color: gray;
   > >   background: white;
   > >   padding: 0.5em;
   > >   border: 1px solid black;
   > >   font-family: Charcoal, sans-serif;
   > > }
   > > ```

4. 兄弟选择器

   > 选择在同一个父级元素下紧跟着另一个元素的元素，组合器使用加号（`+`）
   >
   > > ```css
   > > h1 + p {
   > >   margin-top: 0;
   > > }
   > > ```
   >
   > **一般兄弟选择器**:这个组合器允许选择同一个父元素下，跟随（不一定是紧跟随）在某个元素后面的所有元素，使用波浪线符号（`~`）。

#### 伪类选择器(根据某种条件或者状态选中页面中的元素并应用响应样式)

1. 链接伪类(**只应用于链接**)

   - a:link ：表示未访问过的链接
   - a:visited ：表示访问过的链接，只能设置颜色相关声明
   - :target (通过该选择器可以模拟 CSS 样式的选项卡 )

2. 动态伪类(根据元素的所处的用户动作而应用)

   - :hover ：鼠标移入的
   - :active ：正在点击的
   - :focus(用于表单控件)

3. 伪类选择器`:root`选择文档的根元素(在 HTML 文档中，可以直接选择`html`元素，不需要使用`:root`伪类。)

4. 使用伪类`:empty`，可以选择任何没有子节点的元素——没有任何类型的子元素：**包含**文本节点，包括文字和空白。（注释既不会被当成内容，也不会被当成空白）

5. **CSS3 引入了否定伪类：not（）**

   > ：not（）的工作方式是将其附加到元素上，然后在括号中填充一个简单的选择器。
   >
   > 这简单的选择器是：类型选择器，通用选择器，属性选择器，类选择器，ID 选择器或伪类。

6. 伪元素选择器（伪元素将虚构元素插入文档中以实现某些效果）

   > 伪元素采用双冒号语法;
   >
   > 伪元素必须放置在它们出现的选择器的最末端。
   >
   > > ::first-letter 伪元素设置所有非内联元素（非行类元素）的第一个字母。
   > >
   > > ::first-line 可用于影响元素中文本的第一行。
   > >
   > > > ::first-letter 和::first-line 伪元素当前只能应用于块显示元素（例如标题或段落），而不能应用于行内元素（例如超链接）
   > >
   > > :: before 和:: after 在元素内部的前面或者后面插入生成的内容并设置其样式。

7. 唯一子元素 `:only-child `选出那些元素中只有一个子元素的元素中的子元素

   > 选中所有由超链接元素包装的图像
   >
   > > ```css
   > > a[href] img:only-child {     // 与a[href]>img：onlychild不同
   > >   border: 2px solid black;
   > > }
   > >
   > > a[href] img：only-child 匹配所有符合条件的图像，该图像是唯一子元素，但不代表是祖先元素的子元素，可以是后代元素。想要被选中，该图像元素必须是其直接父级的唯一子元素，并且是链接的后代，但是该父级本身可以是该链接的后代。
   > > ```
   >
   > 注意点：
   >
   > 1. 唯一子元素伪类总是应用于子元素，而不应用于父元素；
   > 2. 在后代选择器中使用:only-child 时，不用严格列出元素之间的父子关系

8. UI 状态伪类 (表单控件状态)

   | 类型           | 描述                                                                       |
   | :------------- | :------------------------------------------------------------------------- |
   | :enabled       | 指向那些允许输入的 UI 元素（例如表单中的 input）                           |
   | :disabled      | 指向那些不允许输入的 UI 元素（例如表单中被禁止输入的 input）               |
   | :checked       | 指向已经被选中的单选或复选框，无论是文档自身选中的还是用户点击选中的       |
   | :indeterminate | 指向没有被选中的单选或复选框，这个状态仅能通过 js 来设置，不用由用户来触发 |
   | :default       | 指向被默认选中的单选、复选框或下拉框                                       |
   | :valid         | 指向用户输入合法数据的元素                                                 |
   | :invalid       | 指向用户输入不合法数据的元素                                               |
   | :in-range      | 指向用户输入的数据在指定大小范围内的元素                                   |
   | :out-ofrange   | 指向用户输入的数据不在指定大小范围内的元素                                 |
   | :required      | 指向要求用户必须输入数据的元素                                             |
   | :optional      | 指向不强制要求用户必须输入数据的元素                                       |
   | :read-write    | 指向可编辑元素                                                             |
   | :read-only     | 指向只读元素                                                               |

9. 结构性伪类（在子元素找）

   :nth-child(n)

   :first-child 用于选择作为其他元素的第一个子元素的元素。

   :last-child 用于选择作为其他元素的最后一个子元素的元素。

    选择器名:nth-child(n)：该类型的选择器如果冒号的前面没有空格而是直接跟着选择器，那么等价于：先找出所有有子元素的父元素，然后在这些父元素的内部找出第 n 个子元素，再判断这个子元素是不是冒号前面指定的那类标签元素，不是就无法匹配到。是，就对选中的子元素使用对应 css 样式。

    等价于：先找出第几个子元素，如果该子元素是冒号前面指定的那类元素，则应用 css 样式。

   ```css
   <ul
     > <p
     > asd</p
     > <li
     > 1</li
     > <li
     > 2</li
     > <li
     > 3</li
     > <li
     > 4</li
     > </ul
     > ul
     :first-child {
     background-color: #afc;
   } //选中ul下面的第一个子元素，不论该子元素是什么标签
   
   ul li:first-child {
     background-color: #afc;
   } //这种情况无法选中任何元素，因为ul的第一个子元素不是li，而是p
   
   ul li:nth-child(1) {
     background-color: #afc;
   } //这种情况无法选中任何元素，因为ul的第一个子元素不是li，而是p
   
   ul :nth-child(1) {
     background-color: #afc;
   } //选中ul下面的第一个子元素，不论该子元素是什么标签
   
   li: nth-child(
     1
   ); //选中所有元素的子元素中的第一个，且第一个必须是li标签才可以。而不管li标签是div或者ul等下面的子元素。
   ```

   **正方向范围**

   li:nth-child(n+6)

   选中从第 6 个开始的子元素

   **负方向范围**

   :nth-child(-n+9)

   选中从第 1 个到第 9 个子元素。使用 :nth-child(-n+9) ，就相当让你选中第 9 个和其之前的所有子元素

   **前后限制范围**

   :nth-child(n+4):nth-child(-n+8)

   选中第 4-8 个子元素。使用 nth-child(n+4):nth-child(-n+8) 我们可以选中某一范围内子元素，上面的例子里是从第 4 个到第 8 个子元素

   **奇数、偶数位**

   :nth-child(odd)

   :nth-child(even)

   **隔选择子元素**

   :nth-child(3n+1),

   选择 1,4,7,10

   :nth-of-type(n) ：先找出不同层级中的同类型的标签，然后在已经选出的这些标签中找第 n 个元素，对它应用样式。

   :first-of-type 另一个元素中选择一个元素类型的第一个,这允许在给定元素内选择第一个表之类的操作，不管它前面的元素是什么。

   :last-of-type ：在另一个元素中选择一个元素类型的最后一个。 这允许在给定元素内选择第一个表之类的操作，不管它前面的元素是什么。

   ```css
   <body>
     <div id="wrap">
       <p>one</p>
       <div>我是div</div>
       <p>two</p>
       <p>three</p>
       <p>four</p>
     </div>
     <p>qwe</p>
     <p>zxc</p>
     <p>tyu</p>
   </body>


   <style>
       p:nth-of-type(3) {
         background: red;    //选出了 three 和 tyu 所对应的p标签
       }

       #wrap p:nth-child(3) {
         background: yellow;  //选出了two所对应的p标签
       }
     </style>
   ```

   **结构伪类例子**

   ```css
   <section>
   	<p>一号</p>
   	<div>二号</div>
   	<div>三号</div>
   </section>

   section div:nth-child(1){声明块}：选不出任何元素
   section div:nth-of-type(1){声明块}：选出二号元素
   ```

## 第三章

### “继承”

继承是一种机制，通过这种机制，某些样式不仅应用于指定的元素，还应用于它的后代元素。

> HTML 中的向上传播规则有一个例外:应用于“body”元素的背景样式可以传递给“HTML”元素，后者是文档的根元素，因此定义了它的画布。只有当“body”元素有一个定义好的背景，而 html 元素没有时，才会发生这种情况。
>
> 继承的声明完全谈不上特异性，特异性低于通配符选择器。

### “特异性”

 对于每个规则，用户代理评估选择器的特异性，并将其附加到规则中的每个声明，特异性值将被赋给它的所有相关声明。当一个元素有两个或多个相互冲突的属性声明时，具有最高特异性的属性声明将胜出。

> 选择器的特异性由选择器本身的组件决定。特异性值可以表达为四个部分，像这样:' 0,0,0,0 '。
>
> - 对于选择器中给定的每个 ID 属性值，添加' 0,1,0,0 '。 //注意 ID 选择器和以' ID '属性为目标的属性选择器
>
> - 对于选择器中给出的每个类属性值、属性选择或伪类，添加' 0,0,1,0 '。
>
> - 对于选择器中给出的每个元素和伪元素，添加' 0,0,0,1 '。
>
> - 组合子和通用选择器对特异性没有任何贡献,添加'0,0,0,0'。
>
> - 对于继承的特异性是没有特异性。
>
> - 第一个零是为内联样式声明保留的，它胜过任何其他声明的特殊性。
>
> - !important 重要的总是在声明的结尾，分号的前面。
>
>   > 所有的!重要的声明被分组在一起，而具体的冲突在该组内相对解决。类似地，所有不重要的声明都放在一起考虑，不重要的组中的任何冲突都使用特殊性来解决。因此，在重要的和不重要的声明冲突的任何情况下，重要的声明“总是”获胜。

### “层叠”

当两个同样特殊的规则应用于相同的元素。

> 1. 查找包含与给定元素匹配的选择器的所有规则。
>
> 2. 按显式权重对应用于给定元素的所有声明排序。那些规则写着‘!重要的比不重要的更重要。
>
> 3. 按来源对应用于给定元素的所有声明进行排序。有三个基本的来源:作者、读者和用户代理。通常情况下，作者的风格胜过读者的风格。”!重要的“读者风格比任何其他风格都强，包括”!重要的作者风格。author 和 reader 样式都会覆盖用户代理的默认样式。
>
>    > 1. 读者重要声明
>    > 2. 作者重要声明
>    > 3. 正常的作者声明
>    > 4. 读者正常的声明
>    > 5. 用户代理声明
>
> 4. 根据“特异性”对应用于给定元素的所有声明进行排序。特异性高的元素比特异性低的元素具有更高的权重。
>
> 5. 如果两个规则具有完全相同的显式权重、来源和特性，则样式表中稍后出现的规则胜出。

## 第四章

### CSS 属性值

1. 值为关键字
   - **inherit** 关键词使元素上该属性的值继承其父元素响应属性的值。换句话来说，在继承没有发生的情况下，它会强行进行属性继承。
   - **initial** 关键词可以将属性的值恢复成初始值，某种程度上可以说它“重置”了该值。
   - **unset** 关键词是 inherit 和 initial 的通用替代。如果一个属性是继承的，unset 的效果跟 inherit 关键词的效果相同，如果一个属性不是继承的，unset 的效果则跟 initial 关键词的效果相同。
   - **all**（一个 CSS 属性名,指代全部属性，除 direction、Unicode-bidi。）,它只能接受全局关键词。 // #example {all: inherit;}
2. 值为字符串
   - 字符串值是用单引号或双引号引起来的任意字符序列
3. 值为 URL
   - 绝对地址
   - 相对地址
4. 数字与百分比

#### 文档流中水平方向的布局约束

子元素在父元素内部水平方向的位置由下面的等式决定：

margin（left/right） + border（left/right）+ padding（left/right）+width = 其父元素内容区的 width（这个等式必须成立，不成立则称为过度约束，浏览器会自动调整以使得等式成立）

上面的各项的默认值是： 0 + 0 + 0 + auto=父元素 content-width

上述等式中，可以将值设为 auto 的有：width，margin（-left/right）

从上面的等式可以得出的结论有：

- 块级子元素在不设置 width 时，默认取 auto ，而浏览器将父元素全部的 content-width 都赋给了子元素作为 width

- 如果上述的 7 个值中都没有被设置为 auto 的情况，则在等式不成立时，浏览器默认将自动调整 margin-right 的值以使得等式成立

- margin（-left/right）的值设为 auto 时，会自动调整其值以满足等式

- 如果将 width 和某个（或两个）外边距的值设置为 auto，则优先将 width 调到最大以满足等式

- 如果 width 值固定，margin 为 auto，则左右 margin 各分一半以使得等式成立（这便是元素水平居中的原理）

- 如果 width 超出了父元素的 content-width，则子元素 margin-right 会设为负值

元素浮动后，上面的等式不必必须成立。

#### 文档流中水平方向的布局

默认情况下父元素的高度被内容撑开，如果父元素设置了固定高度，则用固定高度。

子元素在父元素的内容区中排列，如果子元素大小超过父元素，则子元素会从父元素中溢出，父元素使用 overflow 属性可以设置如何处理子元素溢出的情况。

overflow：visible | hidden | scroll | auto

overflow-x：visible | hidden | scroll | auto

overflow-y：visible | hidden | scroll | auto

#### 元素绝对定位后水平方向的布局约束

开启绝对定位的元素的 top：0 与 left：0 是包含块的 padding 区的左上角。

子元素在父元素内部水平方向的位置由下面的等式决定：

left + right +margin（left/right） + border（left/right）+ padding（left/right）+width = 其父元素 padding 区的 width（这个等式必须成立，不成立则称为过度约束，浏览器会自动调整以使得等式成立）

上面的各项的默认值是：auto + auto + 0 + 0 + 0 + auto=父元素 padding-width

结论：

- 当 left ，right 设置为 0 时，width 未设置宽度时，子元素的 width 默认就是父元素 padding-width 的值
- 当 left ，right 设置为 0 时，width 设置固定宽度，margin 为 auto 时，子元素在父元素内部水平居中

#### 元素绝对定位后垂直方向的布局约束

子元素在父元素内部垂直方向的位置由下面的等式决定：

top+ bottom +margin（top/bottom） + border（top/bottom）+ padding（top/bottom）height = 其父元素 padding 区的 height（这个等式必须成立，不成立则称为过度约束，浏览器会自动调整以使得等式成立）

上面的各项的默认值是：auto + auto + 0 + 0 + 0 + 内容区高度=父元素 padding-height

结论：

- 当 top，bottom 设置为 0 时，height 设置固定高度，margin 为 auto 时，子元素在父元素内部垂直居中

### Flex（弹性布局）

旧版本实现 flex 布局的方式：

```css
display:-webkit-box;  //超出部分溢出显示
float:left;	//超出部分自动换行

旧版容器上的属性：
display:-webkit-box;
-webkit-box-orient:horizontal | vertical;  //主轴方向
-webkit-box-direction:normal | reverse;  //主轴项目排列方向
-webkit-box-pack: start | end |center | justify  //多余空间放主轴右边或下边 | 左边或上边 |子项目两边  |  子项目之间
-webkit-box-align: start | end |center;  //侧轴富裕空间多余空间放主轴下边或右边  |  上边或左边 |子项目两边
```

新版 flex 布局：

```css
可以为任何一个容器指定为 Flex 布局（行内元素也可以）
display: -webkit-flex;
display:flex; (display: inline-flex;)
设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效

容器属性：
flex-direction: row | row-reverse | column | column-reverse;
flex-wrap: nowrap | wrap | wrap-reverse;
justify-content: flex-start | flex-end | center | space-between | space-around;
align-items: flex-start | flex-end | center | baseline | stretch;
align-content: flex-start | flex-end | center | space-between | space-around | stretch;

项目属性：
order: <integer>
flex-grow: <number>; /* default 0 */
flex-shrink: <number>; /* default 1 */
flex-basis: <length> | auto; /* default auto */
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

容器属性：

flex-flow：

flex-direction：属性决定主轴的方向（即项目的排列方向）。

flex-wrap：默认情况下，项目都排在一条线（又称"轴线"）上。`flex-wrap`属性定义，如果一条轴线排不下，如何换行。

justify-content：属性定义了项目在主轴上的对齐方式。

align-items：属性定义项目在交叉轴上如何对齐。

align-content：属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

![image-20210317135918657](.\typora-user-images\image-20210317135918657.png)

项目属性： `order`属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0。

`flex-grow`属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大,所有项目使用自身设置的固定大小。 如果所有项目的`flex-grow`属性都为 1，则它们将等分**剩余空间**（如果有的话）。如果一个项目的`flex-grow`属性为 1，其他项目都为 0，则前者占据剩余空间。

剩余空间：容器的宽度减去内部所有子元素的固定宽度后剩下的空间。剩余空间的每一份= 剩余空间宽度/所有设置了 flex-grow 的项目的 flex-grow 值的和。

`flex-shrink`属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。如果所有项目的`flex-shrink`属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为 0，其他项目都为 1，则空间不足时，前者不缩小。 `flex-basis`属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。 `flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。 `align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

### Grid 布局

将网页以网格为单位进行划分。然后组合网格进行页面布局。

容器：设置的 display:grid;声明的父级元素

项目：在设置了 display:grid;声明的父级元素内部的直接一级的所有子元素。父元素内部的后代元素并不是称为项目。

#### 容器上的属性：

**display:grid | inline-grid;** 前者表示将元素设置为块级的网格布局，元素本身独占一行，元素内部实现网格布局，后者表示将元素设置为行内块的网格布局，元素本身可以和其他行内或行内块元素并排显示，而元素内部实现网格布局。

**grid-template-columns** 指定列的宽度，对应的值可以是多个，有几个就代表有几列，值代表相应列的宽度。

**grid-template-rows** 指定行的高度，对应的值可以是多个，有几个就代表有几行，值代表相应行的高度。

如果项目的宽度或者高度总和小于容器的宽度和高度也是可行的。

> 上面两个属性的属性值可以采用的单位：
>
> - 数字 + px
>
> - 数字 + %
>
> - 数字 + fr
>
>   设置为 fr，等价于将容器的宽度或者高度平均分为 n 份，各行或者各列对应的高度或宽度 = (父元素 content-box 的高度 /n ) \* 对应数字
>
> - auto
>
>   auto 会自动占满余下的空间
>
> - repeat(n,宽度或者高度)：表示将宽度或高度重复 n 次

 下图中给父级元素开启了网格布局，同时设置了 padding 和 border，可以看出，grid-template-columns 和 grid-template-rows 都是从父级元素的 content-box 开始计算的。

![image-20210323184327466](.\typora-user-images\image-20210323184327466.png)



 grid-template-columns 和 grid-template-rows 只要他们的宽度或者高度总和超过了父元素的宽度或者高度，那么多出部分会在父元素的外部显示。可以给父元素设置 overflow: hidden;以隐藏超出部分。

 grid-template-columns 和 grid-template-rows 两者必须一起使用，否则无法生效，即使只有一行或者一列都需要设置 grid-template-columns：100%或者 grid-template-rows: 100%;。

display: grid; grid-template-columns: 100px auto; grid-template-rows: 100%;表示一行两列，左边 100px，右边自适应。

> 取值例子：可混用，不建议 auto 与 fr 套用
>
> grid-template-columns : 200px 200px 200px;
>
> grid-template-columns : 33.33% 20% 33.33%;
>
> grid-template-columns : 1fr 1fr 1fr;
>
> grid-template-columns : 100px auto;
>
> grid-template-columns : 33.33% 200px 100px;
>
> grid-template-columns : repeat(3,1fr)
>
> grid-template-columns : repeat(3,1fr 2fr)

**grid-row-gap** :设置行与行之间的间距。

**grid-column-gap** :设置列与列之间的间距。

**justify-content** :设置整个内容区域在容器中的水平方向上的对齐方式

**align-content** :设置整个内容区域在容器中的垂直方向上的对齐方式

**place-content** :`<align-content> |<justify-content>`

> 容器内部的项目内容的总宽度和高度是可能小于父容器的宽度和高度的，这是就可以对整个内容区域进行很好的布局。
>
> 可设置的属性值有：
>
> - start
> - end
> - center
> - space-around
> - space-between
> - space-evenly
> - stretch

**justify-items** : 设置**单元格内的内容**在水平方向上的对齐方式

**align-items** :设置**单元格内的内容**在垂直方向上的对齐方式

> 可设置的属性值有：
>
> - start
> - end
> - center
> - stretch

place-items:`<align-items> |<justify-items>`

**grid-template-areas** : "a b c" "d d f" "g h ."; 为网格内的每个单元格进行命名

#### 项目上的属性：

设置项目放在容器中的哪个网格中或者哪几个网格中。

方式一：用边框线来设置

```
grid-row-start:n;
grid-row-end:n+1|[n];
grid-column-start:n
grid-column-end:n+1|[n];
```

方式二：用给容器元素设置的 grid-template-areas 对应的网格名确认边框线

```
grid-row-start:name-start;
grid-row-end:name-end;
grid-column-start:name-start;
grid-column-end:name-end;

简写：
grid-row:name-start/name-end;
grid-column:name-start/name-end;

再简写：
grid-row:name;
grid-column:name;

再简写：
grid-area:name
```

设置单个项目中的内容在该单元格中的对齐方式：

```
align-self
justify-self
place-self
- start
- end
- center
- stretch
```

### css 中原生定义变量

定义变量：--变量名

使用：var(--变量名)

自定义 css 变量适合放在根元素上，即 html 标签上，在 css 中:root 能直接代表 html 标签

```css
 定义变量可分多种情况：
1、定义全局变量
:root {
  --borderColor: #ccc;
}

2、定义某元素下的变量
.look{
  --borderColor: #ccc;
}

3、定义媒体查询下的变量
@media screen and (min-width: 1025px) {
    :root {
        --borderColor: #ccc;
　　 }
}

使用：
.has-border-table > tr > td {
  border-right: 1px solid var(--borderColor);
}

less中定义变量
定义：
@bg-color : #d9d9d9;
使用：
.has-border-table > tr > td {
  border-right: 1px solid var(@bg-color);
}

sass中定义变量
定义：
$bg-color : #d9d9d9;
使用：
.has-border-table > tr > td {
  border-right: 1px solid var($bg-color);
}

```

## 移动端适配方案

### Flexible 方案

借助 JavaScript 控制`viewport`的能力，使用`rem`模拟`vw`的特性从而达到适配目的的一套解决方案。`rem`是相对于`html`元素的`font-size`来做计算的计算属性值。通过设置`documentElement`的`fontSize`属性值就可以统一整个页面的布局标准。

```javascript
// set 1rem = viewWidth / 10
function setRemUnit() {
  var rem = docEl.clientWidth / 10; //将页面宽度切为10份
  // docEl为document.documentElement，即html元素
  docEl.style.fontSize = rem + 'px'; //将页面宽度的十分之一作为html的font-size
}
setRemUnit();
```
