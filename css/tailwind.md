bootstrap 框架中一个类名对应多个 css 属性和值 `<button calss="btn btn-primary btn-lg"></button>`

tailwindcss 中需要在 html 标签上写大量的 css 类名来实现自己想要的样式, 单个 class 类名只对应的 css 样式可以直接在 class 中定义自适应的样式

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
