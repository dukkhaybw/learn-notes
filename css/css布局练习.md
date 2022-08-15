# 练习

### 知识点：

- 通过查看设计稿发现整个网站距离两边都有一些空白边距，所以可以使用一个容器，方便调整边距。

- 头部可以用语义化标签header

- 导航栏用nav

- 导航按钮可以用a标签

- 主要内容区域可以使用main标签标识

- 底部用footer语义化标签

- 在写页面时，可以尝试先写html结构再写css样式

- 按钮默认有圆角效果，取消圆角效果设置:border-radius: 0; 

- 字体阴影text-shadow

- object-fit属性指定该元素的内容应该如何调整自己的宽度或者高度去适应父容器的高度与宽度。用在img标签中时，一般可以对该元素进行保留原始比例的剪切、缩放或者直接进行拉伸等。

  object-fit: fill|contain|cover|scale-down|none|initial|inherit;

  - fill:根据需要压缩或者拉伸图片，以填充满父容器(默认值)

    ![image-20210517225029508](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210517225029508.png)

  - contain:只对一边需要压缩或者拉伸图片，另一边按照原有比例等比例压缩或者拉升。不能保证填充满父容器

    ![image-20210517224846490](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210517224846490.png)

  - cover：对图片进行等比例的压缩或者拉升，确保完全覆盖父容器，但是可能会切掉图片的部分内容

    ![image-20210517224902323](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210517224902323.png)

  - scale-down：对图片进行等比例的压缩或者拉升，当最短的一边占满则不再拉升或者压缩，可能无法完全覆盖父容器

    ![image-20210517224944668](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210517224944668.png)

  - none：保留原有元素内容的长度和宽度，也就是说内容不会被重置。

![image-20210517225007211](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210517225007211.png)