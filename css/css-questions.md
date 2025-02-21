## 目录

- [CSS 选择器的优先级是如何计算的？](#css-选择器的优先级是如何计算的)
- [重置（resetting）CSS 和 标准化（normalizing）CSS 的区别是什么？你会选择哪种方式，为什么？](#重置resettingcss-和-标准化normalizingcss-的区别是什么你会选择哪种方式为什么)
- [请阐述`Float`定位的工作原理。](#请阐述float定位的工作原理)
- [请阐述`z-index`属性，并说明如何形成层叠上下文（stacking context）。](#请阐述z-index属性并说明如何形成层叠上下文stacking-context)
- [请阐述块格式化上下文（Block Formatting Context）及其工作原理。](#请阐述块格式化上下文block-formatting-context及其工作原理)
- [有哪些清除浮动的技术，都适用哪些情况？](#有哪些清除浮动的技术都适用哪些情况)
- [请解释什么是精灵图（css sprites），以及如何实现？](#请解释什么是精灵图css-sprites以及如何实现)
- [如何解决不同浏览器的样式兼容性问题？](#如何解决不同浏览器的样式兼容性问题)
- [如何为功能受限的浏览器提供页面？ 使用什么样的技术和流程？](#如何为功能受限的浏览器提供页面-使用什么样的技术和流程)
- [有什么不同的方式可以隐藏内容（使其仅适用于屏幕阅读器）？](#有什么不同的方式可以隐藏内容使其仅适用于屏幕阅读器)
- [你使用过栅格系统吗？偏爱哪一个？](#你使用过栅格系统吗偏爱哪一个)
- [你是否使用过媒体查询或移动优先的布局？](#你是否使用过媒体查询或移动优先的布局)
- [你熟悉制作 SVG 吗？](#你熟悉制作-svg-吗)
- [除了`screen`，你还能说出一个 @media 属性的例子吗？](#除了screen你还能说出一个-media-属性的例子吗)
- [编写高效的 CSS 应该注意什么？](#编写高效的-css-应该注意什么)
- [使用 CSS 预处理的优缺点分别是什么？](#使用-css-预处理的优缺点分别是什么)
- [对于你使用过的 CSS 预处理，说说喜欢和不喜欢的地方？](#对于你使用过的-css-预处理说说喜欢和不喜欢的地方)
- [如何实现一个使用非标准字体的网页设计？](#如何实现一个使用非标准字体的网页设计)
- [解释浏览器如何确定哪些元素与 CSS 选择器匹配。](#解释浏览器如何确定哪些元素与-css-选择器匹配)
- [描述伪元素及其用途。](#描述伪元素及其用途)
- [说说你对盒模型的理解，以及如何告知浏览器使用不同的盒模型渲染布局。](#说说你对盒模型的理解以及如何告知浏览器使用不同的盒模型渲染布局)
- [`* { box-sizing: border-box; }`会产生怎样的效果？](#--box-sizing-border-box-会产生怎样的效果)
- [`display`的属性值都有哪些？](#display的属性值都有哪些)
- [`inline`和`inline-block`有什么区别？](#inline和inline-block有什么区别)
- [`relative`、`fixed`、`absolute`和`static`四种定位有什么区别？](#relativefixedabsolute和static四种定位有什么区别)
- [你使用过哪些现有的 CSS 框架？你是如何改进它们的？](#你使用过哪些现有的-css-框架你是如何改进它们的)
- [你了解 CSS Flexbox 和 Grid 吗？](#你了解-css-flexbox-和-grid-吗)
- [请解释在编写网站时，响应式与移动优先的区别。](#请解释在编写网站时响应式与移动优先的区别)
- [响应式设计与自适应设计有何不同？](#响应式设计与自适应设计有何不同)
- [你有没有使用过视网膜分辨率的图形？当中使用什么技术？](#你有没有使用过视网膜分辨率的图形当中使用什么技术)
- [什么情况下，用`translate()`而不用绝对定位？什么时候，情况相反。](#什么情况下用translate而不用绝对定位什么时候情况相反)



### CSS 选择器的优先级是如何计算的？

浏览器通过优先级规则，判断元素展示哪些样式。优先级通过 4 个维度确定，假定以`a、b、c、d`命名，分别代表以下含义：

1. `a`表示是否使用内联样式（inline style）。如果使用，`a`为 1，否则为 0。
2. `b`表示 ID 选择器的数量。
3. `c`表示类选择器、属性选择器和伪类选择器数量之和。
4. `d`表示标签（类型）选择器和伪元素选择器之和。

优先级的结果并非通过以上四个值生成一个得分，而是每个值分开比较。`a、b、c、d`权重从左到右，依次减小。判断优先级时，从左到右，一一比较，直到比较出最大值，即可停止。所以，如果`b`的值不同，那么`c`和`d`不管多大，都不会对结果产生影响。比如`0，1，0，0`的优先级高于`0，0，10，10`。

当出现优先级相等的情况时，最晚出现的样式规则会被采纳。如果你在样式表里写了相同的规则（无论是在该文件内部还是其它样式文件中），那么最后出现的（在文件底部的）样式优先级更高，因此会被采纳。

在写样式时，我会使用较低的优先级，这样这些样式可以轻易地覆盖掉。尤其对写 UI 组件的时候更为重要，这样使用者就不需要通过非常复杂的优先级规则或使用`!important`的方式，去覆盖组件的样式了。

###### 参考

- https://www.smashingmagazine.com/2007/07/css-specificity-things-you-should-know/
- https://www.sitepoint.com/web-foundations/specificity/



### 重置（resetting）CSS 和 标准化（normalizing）CSS 的区别是什么？你会选择哪种方式，为什么？

- **重置（Resetting）**： 重置意味着除去所有的浏览器默认样式。对于页面所有的元素，像`margin`、`padding`、`font-size`这些样式全部置成一样。你将必须重新定义各种元素的样式。
- **标准化（Normalizing）**： 标准化没有去掉所有的默认样式，而是保留了有用的一部分，同时还纠正了一些常见错误。

当需要实现非常个性化的网页设计时，我会选择重置的方式，因为我要写很多自定义的样式以满足设计需求，这时候就不再需要标准化的默认样式了。

###### 参考

- https://stackoverflow.com/questions/6887336/what-is-the-difference-between-normalize-css-and-reset-css



### `Float`定位的工作原理

浮动（float）是 CSS 定位属性。浮动元素从网页的正常流动中移出，但是保持了部分的流动性，会影响其他元素的定位（比如文字会围绕着浮动元素）。这一点与绝对定位不同，绝对定位的元素完全从文档流中脱离。

CSS 的`clear`属性通过使用`left`、`right`、`both`，让该元素向下移动（清除浮动）到浮动元素下面。

如果父元素只包含浮动元素，那么该父元素的高度将塌缩为 0。可以通过清除（clear）从浮动元素后到父元素关闭前之间的浮动来修复这个问题。

有一种 hack 的方法，是自定义一个`.clearfix`类，利用伪元素选择器`::after`清除浮动。[另外还有一些方法](https://css-tricks.com/all-about-floats/#article-header-id-4)，比如添加空的`<div></div>`和设置浮动元素父元素的`overflow`属性。与这些方法不同的是，`clearfix`方法，只需要给父元素添加一个类，定义如下：

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

值得一提的是，把父元素属性设置为`overflow: auto`或`overflow: hidden`，会使其内部的子元素形成块格式化上下文（Block Formatting Context），并且父元素会扩张自己，使其能够包围它的子元素。

###### 参考

- https://css-tricks.com/all-about-floats/

  

### 请阐述`z-index`属性，并说明如何形成层叠上下文（stacking context）。

CSS 中的`z-index`属性控制重叠元素的垂直叠加顺序。`z-index`只能影响`position`值不是`static`的元素。

没有定义`z-index`的值时，元素按照它们出现在 DOM 中的顺序堆叠（层级越低，出现位置越靠上）。非静态定位的元素（及其子元素）将始终覆盖静态定位（static）的元素，而不管 HTML 层次结构如何。

层叠上下文是包含一组图层的元素。 在一组层叠上下文中，其子元素的`z-index`值是相对于该父元素而不是 document root 设置的。每个层叠上下文完全独立于它的兄弟元素。如果元素 B 位于元素 A 之上，则即使元素 A 的子元素 C 具有比元素 B 更高的`z-index`值，元素 C 也永远不会在元素 B 之上.

每个层叠上下文是自包含的：当元素的内容发生层叠后，整个该元素将会在父层叠上下文中按顺序进行层叠。少数 CSS 属性会触发一个新的层叠上下文，例如`opacity`小于 1，`filter`不是`none`，`transform`不是`none`。

###### 参考

- https://css-tricks.com/almanac/properties/z/z-index/
- https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context



### 请阐述块格式化上下文（Block Formatting Context）及其工作原理。

块格式上下文（BFC）是 Web 页面的可视化 CSS 渲染的部分，是块级盒布局发生的区域，也是浮动元素与其他元素交互的区域。

一个 HTML 盒（Box）满足以下任意一条，会创建块格式化上下文：

- `float`的值不是`none`.
- `position`的值不是`static`或`relative`.
- `display`的值是`table-cell`、`table-caption`、`inline-block`、`flex`、或`inline-flex`。
- `overflow`的值不是`visible`。

在 BFC 中，每个盒的左外边缘都与其包含的块的左边缘相接。

两个相邻的块级盒在垂直方向上的边距会发生合并（collapse）。更多内容请参考[边距合并（margin collapsing）](https://www.sitepoint.com/web-foundations/collapsing-margins/)。

###### 参考

- https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
- https://www.sitepoint.com/understanding-block-formatting-contexts-in-css/



### 有哪些清除浮动的技术，都适用哪些情况？

- 空`div`方法：`<div style="clear:both;"></div>`。
- Clearfix 方法：上文使用`.clearfix`类已经提到。
- `overflow: auto`或`overflow: hidden`方法：上文已经提到。

在大型项目中，会使用 Clearfix 方法，在需要的地方使用`.clearfix`。设置`overflow: hidden`的方法可能使其子元素显示不完整，当子元素的高度大于父元素时。



### 请解释什么是精灵图（css sprites），以及如何实现？

精灵图，也称雪碧图。因常见碳酸饮料雪碧的英文名也是 Sprite，因此也有人会使用雪碧图的非正式译名。

精灵图是把多张图片整合到一张上的图片。它被运用在众多使用了很多小图标的网站上（Gmail 在使用）。实现方法：

1. 使用生成器将多张图片打包成一张精灵图，并为其生成合适的 CSS。
1. 每张图片都有相应的 CSS 类，该类定义了`background-image`、`background-position`和`background-size`属性。
1. 使用图片时，将相应的类添加到你的元素中。

好处：

- 减少加载多张图片的 HTTP 请求数（一张精灵图只需要一个请求）。但是对于 HTTP2 而言，加载多张图片不再是问题。
- 提前加载资源，防止在需要时才在开始下载引发的问题，比如只出现在`:hover`伪类中的图片，不会出现闪烁。

###### 参考

- https://css-tricks.com/css-sprites/

  

### 如何解决不同浏览器的样式兼容性问题？

- 在确定问题原因和有问题的浏览器后，使用单独的样式表，仅供出现问题的浏览器加载。这种方法需要使用服务器端渲染。
- 使用已经处理好此类问题的库，比如 Bootstrap。
- 使用 `autoprefixer` 自动生成 CSS 属性前缀。
- 使用 Reset CSS 或 Normalize.css。



### 如何为功能受限的浏览器提供页面？ 使用什么样的技术和流程？

- 优雅的降级：为现代浏览器构建应用，同时确保它在旧版浏览器中正常运行。
- 渐进式增强：构建基于用户体验的应用，但在浏览器支持时添加新增功能。
- 利用 [caniuse.com](https://caniuse.com/) 检查特性支持。
- 使用 `autoprefixer` 自动生成 CSS 属性前缀。
- 使用 [Modernizr](https://modernizr.com/)进行特性检测。



### 有什么不同的方式可以隐藏内容（使其仅适用于屏幕阅读器）？

这些方法与可访问性（a11y）有关。

- `width: 0; height: 0`：使元素不占用屏幕上的任何空间，导致不显示它。
- `position: absolute; left: -99999px`： 将它置于屏幕之外。
- `text-indent: -9999px`：这只适用于`block`元素中的文本。
- Metadata： 例如通过使用 Schema.org，RDF 和 JSON-LD。
- WAI-ARIA：如何增加网页可访问性的 W3C 技术规范。

即使 WAI-ARIA 是理想的解决方案，我也会采用绝对定位方法，因为它具有最少的注意事项，适用于大多数元素，而且使用起来非常简单。

###### 参考

- https://www.w3.org/TR/wai-aria-1.1/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- http://a11yproject.com/

[[↑] 回到顶部](#目录)

### 你使用过栅格系统吗？偏爱哪一个？

我使用 `float`-based 栅格系统，因为它相比 flex、grid 系统，拥有更多浏览器的支持。它已经在 Bootstrap 中使用多年，并且已经被证明是可行的。

[[↑] 回到顶部](#目录)

### 你是否使用过媒体查询或移动优先的布局？

是的，一个例子就是根据窗口的尺寸改变导航的样式。

[[↑] 回到顶部](#目录)

### 你熟悉制作 SVG 吗？

是的，你可以使用内联 CSS、嵌入式 CSS 部分或外部 CSS 文件对形状进行着色（包括指定对象上的属性）。在网上大部分 SVG 使用的是内联 CSS，不过每个类型都有优点和缺点。

通过设置`fill`和`stroke`属性，可以完成基本着色操作。`fill`可以设置内部的颜色，`stroke`可以设置周围绘制的线条的颜色。你可以使用与`HTML`中使用的 CSS 颜色命名方案相同的 CSS 颜色命名方案：颜色名称（即`red`）、RGB 值（即`rgb(255,0,0)`）、十六进制值、RGBA 值等等。

```html
<rect
  x="10"
  y="10"
  width="100"
  height="100"
  stroke="blue"
  fill="purple"
  fill-opacity="0.5"
  stroke-opacity="0.8"
/>
```

###### 参考

- https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes

[[↑] 回到顶部](#目录)

### 除了`screen`，你还能说出一个 @media 属性的例子吗？

- `all` 适用于所有设备。
- `print` 为了加载合适的文档到当前使用的可视窗口. 需要提前咨询 paged media（媒体屏幕尺寸）, 以满足个别设备网页尺寸不匹配等问题。
- `screen` 主要适用于彩色的电脑屏幕
- `speech` 解析 speech 这个合成器. 注意: CSS2 已经有一个相似的媒体类型叫 aural.

###### 参考

- https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media

[[↑] 回到顶部](#目录)

### 编写高效的 CSS 应该注意什么？

首先，浏览器从最右边的选择器，即关键选择器（key selector），向左依次匹配。根据关键选择器，浏览器从 DOM 中筛选出元素，然后向上遍历被选元素的父元素，判断是否匹配。选择器匹配语句链越短，浏览器的匹配速度越快。避免使用标签和通用选择器作为关键选择器，因为它们会匹配大量的元素，浏览器必须要进行大量的工作，去判断这些元素的父元素们是否匹配。

[BEM (Block Element Modifier)](https://bem.info/)原则上建议为独立的 CSS 类命名，并且在需要层级关系时，将关系也体现在命名中，这自然会使选择器高效且易于覆盖。

搞清楚哪些 CSS 属性会触发重新布局（reflow）、重绘（repaint）和合成（compositing）。在写样式时，避免触发重新布局的可能。

###### 参考

- https://developers.google.com/web/fundamentals/performance/rendering/
- https://csstriggers.com/

[[↑] 回到顶部](#目录)

### 使用 CSS 预处理的优缺点分别是什么？

优点：

- 提高 CSS 可维护性。
- 易于编写嵌套选择器。
- 引入变量，增添主题功能。可以在不同的项目中共享主题文件。
- 通过混合（Mixins）生成重复的 CSS。
- 将代码分割成多个文件。不进行预处理的 CSS，虽然也可以分割成多个文件，但需要建立多个 HTTP 请求加载这些文件。

缺点：

- 需要预处理工具。
- 重新编译的时间可能会很慢。

[[↑] 回到顶部](#目录)

### 对于你使用过的 CSS 预处理，说说喜欢和不喜欢的地方？

喜欢：

- 绝大部分优点上题以及提过。
- Less 用 JavaScript 实现，与 NodeJS 高度结合。

**Dislikes:**

- 我通过`node-sass`使用 Sass，它用 C ++ 编写的 LibSass 绑定。在 Node 版本切换时，我必须经常重新编译。
- Less 中，变量名称以`@`作为前缀，容易与 CSS 关键字混淆，如`@media`、`@import`和`@font-face`。



### 如何实现一个使用非标准字体的网页设计？

使用`@font-face`并为不同的`font-weight`定义`font-family`。



### 解释浏览器如何确定哪些元素与 CSS 选择器匹配。

这部分与上面关于编写高效的 CSS 有关。浏览器从最右边的选择器（关键选择器）根据关键选择器，浏览器从 DOM 中筛选出元素，然后向上遍历被选元素的父元素，判断是否匹配。选择器匹配语句链越短，浏览器的匹配速度越快。

例如，对于形如`p span`的选择器，浏览器首先找到所有`<span>`元素，并遍历它的父元素直到根元素以找到`<p>`元素。对于特定的`<span>`，只要找到一个`<p>`，就知道`<span>`已经匹配并停止继续匹配。

###### 参考

- https://stackoverflow.com/questions/5797014/why-do-browsers-match-css-selectors-from-right-to-left

[[↑] 回到顶部](#目录)

### 描述伪元素及其用途。

CSS 伪元素是添加到选择器的关键字，去选择元素的特定部分。它们可以用于装饰（`:first-line`，`:first-letter`）或将元素添加到标记中（与 content:...组合），而不必修改标记（`:before`，`:after`）。

- `:first-line`和`:first-letter`可以用来修饰文字。
- 上面提到的`.clearfix`方法中，使用`clear: both`来添加不占空间的元素。
- 使用`:before`和`after`展示提示中的三角箭头。鼓励关注点分离，因为三角被视为样式的一部分，而不是真正的 DOM。如果不使用额外的 HTML 元素，只用 CSS 样式绘制三角形是不太可能的。

###### 参考

- https://css-tricks.com/almanac/selectors/a/after-and-before/

[[↑] 回到顶部](#目录)

### 说说你对盒模型的理解，以及如何告知浏览器使用不同的盒模型渲染布局。

CSS 盒模型描述了以文档树中的元素而生成的矩形框，并根据排版模式进行布局。每个盒子都有一个内容区域（例如文本，图像等）以及周围可选的`padding`、`border`和`margin`区域。

CSS 盒模型负责计算：

- 块级元素占用多少空间。
- 边框是否重叠，边距是否合并。
- 盒子的尺寸。

盒模型有以下规则：

- 块级元素的大小由`width`、`height`、`padding`、`border`和`margin`决定。
- 如果没有指定`height`，则块级元素的高度等于其包含子元素的内容高度加上`padding`（除非有浮动元素，请参阅下文）。
- 如果没有指定`width`，则非浮动块级元素的宽度等于其父元素的宽度减去父元素的`padding`。
- 元素的`height`是由内容的`height`来计算的。
- 元素的`width`是由内容的`width`来计算的。
- 默认情况下，`padding`和`border`不是元素`width`和`height`的组成部分。

###### 参考

- https://www.smashingmagazine.com/2010/06/the-principles-of-cross-browser-css-coding/#understand-the-css-box-model

[[↑] 回到顶部](#目录)

### `* { box-sizing: border-box; }`会产生怎样的效果？

- 元素默认应用了`box-sizing: content-box`，元素的宽高只会决定内容（content）的大小。
- `box-sizing: border-box`改变计算元素`width`和`height`的方式，`border`和`padding`的大小也将计算在内。
- 元素的`height` = 内容（content）的高度 + 垂直方向的`padding` + 垂直方向`border`的宽度
- 元素的`width` = 内容（content）的宽度 + 水平方向的`padding` + 水平方向`border`的宽度

[[↑] 回到顶部](#目录)

### `display`的属性值都有哪些？

- `none`, `block`, `inline`, `inline-block`, `table`, `table-row`, `table-cell`, `list-item`.

TODO

[[↑] 回到顶部](#目录)

### `inline`和`inline-block`有什么区别？

我把`block`也加入其中，为了获得更好的比较。

|  | `block` | `inline-block` | `inline` |
| --- | --- | --- | --- |
| 大小 | 填充其父容器的宽度。 | 取决于内容。 | 取决于内容。 |
| 定位 | 从新的一行开始，并且不允许旁边有 HTML 元素（除非是`float`） | 与其他内容一起流动，并允许旁边有其他元素。 | 与其他内容一起流动，并允许旁边有其他元素。 |
| 能否设置`width`和`height` | 能 | 能 | 不能。 设置会被忽略。 |
| 可以使用`vertical-align`对齐 | 不可以 | 可以 | 可以 |
| 边距（margin）和填充（padding） | 各个方向都存在 | 各个方向都存在 | 只有水平方向存在。垂直方向会被忽略。 尽管`border`和`padding`在`content`周围，但垂直方向上的空间取决于'line-height' |
| 浮动（float） | - | - | 就像一个`block`元素，可以设置垂直边距和填充。 |

[[↑] 回到顶部](#目录)

### `relative`、`fixed`、`absolute`和`static`四种定位有什么区别？

经过定位的元素，其`position`属性值必然是`relative`、`absolute`、`fixed`或`sticky`。

- `static`：默认定位属性值。该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 top, right, bottom, left 和 z-index 属性无效。
- `relative`：该关键字下，元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。
- `absolute`：不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。
- `fixed`：不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先。
- `sticky`：盒位置根据正常流计算(这称为正常流动中的位置)，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。在所有情况下（即便被定位元素为 `table` 时），该元素定位均不对后续元素造成影响。当元素 B 被粘性定位时，后续元素的位置仍按照 B 未定位时的位置来确定。`position: sticky` 对 `table` 元素的效果与 `position: relative` 相同。

###### 参考

- https://developer.mozilla.org/en/docs/Web/CSS/position

[[↑] 回到顶部](#目录)

### 你使用过哪些现有的 CSS 框架？你是如何改进它们的？

- **Bootstrap**： 更新周期缓慢。Bootstrap 4 已经处于 alpha 版本将近两年了。添加了在页面中广泛使用的微调按钮组件。
- **Semantic UI**：源代码结构使得自定义主题很难理解。非常规主题系统的使用体验很差。外部库的路径需要硬编码（hard code）配置。变量重新赋值没有 Bootstrap 设计得好。
- **Bulma**： 需要很多非语义的类和标记，显得很多余。不向后兼容，以至于升级版本后，会破坏应用的正常运行。

[[↑] 回到顶部](#目录)

### 你了解 CSS Flexbox 和 Grid 吗？

了解。Flexbox 主要用于一维布局，而 Grid 则用于二维布局。

Flexbox 解决了 CSS 中的许多常见问题，例如容器中元素的垂直居中，粘性定位（sticky）的页脚等。Bootstrap 和 Bulma 基于 Flexbox，这是创建布局的推荐方式。我之前曾使用过 Flexbox，但在使用`flex-grow`时遇到了一些浏览器不兼容问题（Safari），我必须使用`inline-blocks`和手动计算百分比宽度，来重写我的代码，这种体验不是很好。

Grid 创建基于栅格的布局，是迄今为止最直观的方法（最好是！），但目前浏览器支持并不广泛。

###### 参考

- https://philipwalton.github.io/solved-by-flexbox/



### 请解释在编写网站时，响应式与移动优先的区别。

### 响应式设计与自适应设计有何不同？

响应式设计和自适应设计都以提高不同设备间的用户体验为目标，根据视窗大小、分辨率、使用环境和控制方式等参数进行优化调整。

响应式设计的适应性原则：网站应该凭借一份代码，在各种设备上都有良好的显示和使用效果。响应式网站通过使用媒体查询，自适应栅格和响应式图片，基于多种因素进行变化，创造出优良的用户体验。就像一个球通过膨胀和收缩，来适应不同大小的篮圈。

自适应设计更像是渐进式增强的现代解释。与响应式设计单一地去适配不同，自适应设计通过检测设备和其他特征，从早已定义好的一系列视窗大小和其他特性中，选出最恰当的功能和布局。与使用一个球去穿过各种的篮筐不同，自适应设计允许使用多个球，然后根据不同的篮筐大小，去选择最合适的一个。

###### 参考

- https://developer.mozilla.org/en-US/docs/Archive/Apps/Design/UI_layout_basics/Responsive_design_versus_adaptive_design
- http://mediumwell.com/responsive-adaptive-mobile/
- https://css-tricks.com/the-difference-between-responsive-and-adaptive-design/

[[↑] 回到顶部](#目录)

### 你有没有使用过视网膜分辨率的图形？当中使用什么技术？

我倾向于使用更高分辨率的图形（显示尺寸的两倍）来处理视网膜显示。更好的方法是使用媒体查询，像`@media only screen and (min-device-pixel-ratio: 2) { ... }`，然后改变`background-image`。

对于图标类的图形，我会尽可能使用 svg 和图标字体，因为它们在任何分辨率下，都能被渲染得十分清晰。

还有一种方法是，在检查了`window.devicePixelRatio`的值后，利用 JavaScript 将`<img>`的`src`属性修改，用更高分辨率的版本进行替换。

###### 参考

- https://www.sitepoint.com/css-techniques-for-retina-displays/

[[↑] 回到顶部](#目录)

### 什么情况下，用`translate()`而不用绝对定位？什么时候，情况相反。

`translate()`是`transform`的一个值。改变`transform`或`opacity`不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。而改变绝对定位会触发重新布局，进而触发重绘和复合。`transform`使浏览器为元素创建一个 GPU 图层，但改变绝对定位会使用到 CPU。 因此`translate()`更高效，可以缩短平滑动画的绘制时间。

当使用`translate()`时，元素仍然占据其原始空间（有点像`position：relative`），这与改变绝对定位不同。

###### 参考

- https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/

[[↑] 回到顶部](#目录)

### 其他答案

- https://neal.codes/blog/front-end-interview-css-questions
- https://quizlet.com/28293152/front-end-interview-questions-css-flash-cards/
- http://peterdoes.it/2015/12/03/a-personal-exercise-front-end-job-interview-questions-and-my-answers-all/







### 流式布局

流式布局（Fluid Layout）是一种通过**百分比单位**定义元素尺寸的布局方式，使页面能够根据浏览器窗口或容器尺寸的变化**动态调整布局**，从而实现多屏幕适配。其核心目标是让内容在不同屏幕尺寸下保持相对合理的展示效果。

#### **流式布局的特点**

1. **百分比单位**：元素的宽度通常使用百分比（如 `width: 80%;`）而非固定像素值（如 `width: 1200px;`）。
2. **动态适应**：页面内容会随着浏览器窗口的缩放自动伸缩，避免水平滚动条的出现。
3. **容器驱动**：元素尺寸依赖于父容器或视口（viewport）的大小。
4. **与固定布局对比**：固定布局（Fixed Layout）使用像素单位，布局尺寸固定，而流式布局更灵活。

**实现流式布局**

1. **百分比宽度**：

   ```css
   .container {
     width: 90%; /* 容器宽度占视口的90% */
     margin: 0 auto; /* 居中 */
   }
   .column {
     width: 30%; /* 子元素占容器的30% */
     float: left;
   }
   ```

2. **限制最大/最小宽度**：

   ```css
   .container {
     max-width: 1200px; /* 最大宽度限制，避免在大屏幕上过度拉伸 */
     min-width: 320px;   /* 最小宽度限制，避免在小屏幕上挤压 */
   }
   ```

3. **盒模型优化**：
   使用 `box-sizing: border-box`，确保内边距（padding）和边框（border）不破坏百分比计算：

   ```css
   * {
     box-sizing: border-box;
   }
   ```

4. **媒体查询（补充）**：
   流式布局常与响应式设计结合，通过媒体查询（Media Queries）进一步优化不同屏幕下的细节：

   ```css
   @media (max-width: 768px) {
     .column {
       width: 100%; /* 小屏幕下占满整行 */
     }
   }
   ```

------

**流式布局 vs. 其他布局方式**

| **类型**       | **单位**    | **特点**                              | **适用场景**         |
| :------------- | :---------- | :------------------------------------ | :------------------- |
| **固定布局**   | 像素（px）  | 尺寸固定，不随视口变化                | 传统桌面端页面       |
| **流式布局**   | 百分比（%） | 动态调整宽度，高度通常固定            | 多屏幕适配的基础方案 |
| **响应式布局** | 混合单位    | 结合流式布局 + 媒体查询 + 弹性盒/网格 | 复杂多设备适配       |
| **弹性布局**   | Flex/Grid   | 基于容器空间自动分配子元素位置和尺寸  | 组件级或局部动态布局 |

------

### **流式布局的优缺点**

**优点**：

- 适配不同屏幕宽度，减少水平滚动问题。
- 实现简单，适合内容型网站（如新闻、博客）。

**缺点**：

- **高度通常固定，垂直空间可能未被充分利用。**
- 内容过度拉伸可能导致阅读体验下降（如长文本行）。
- 复杂布局难以仅通过百分比实现，需结合其他技术（如 Flexbox、Grid）。

------



**应用场景**

1. **新闻/博客网站**：以文字内容为主，流式布局可确保文本行宽适应屏幕。
2. **早期响应式设计**：作为响应式设计的基础，结合媒体查询实现断点优化。
3. **移动端优先**：在小屏幕下自然扩展，再通过媒体查询增强大屏幕体验。

------



**简单的两栏流式布局**

```html
<div class="container">
  <div class="main-content">主内容（70%）</div>
  <div class="sidebar">侧边栏（30%）</div>
</div>
```

运行 HTML

```css
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}
.main-content {
  width: 70%;
  float: left;
}
.sidebar {
  width: 30%;
  float: left;
}
/* 清除浮动 */
.container::after {
  content: "";
  display: table;
  clear: both;
}
```

