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
