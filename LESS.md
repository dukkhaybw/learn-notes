# LESS

Less  是一门的CSS 扩展语言。

在页面中写less的方式：

在`<style type="text/less">`中less语法，在文档末尾引入less.js编译页面中的less

在less中/* */注释可以被编译生成css，而 // 单行注释无法被编译到生成的css中

## 变量

### 定义方式：

@变量名：变量值（css合法值）

变量值的不同取值：

- 值为 css属性值（使用变量来代表CSS规则中的值）

  ```css
  @width: 10px;
  @height: @width + 10px;
  @color：pink;
  
  #header {
    width: @width;
    height: @height;
  }
  
  编译为：
  #header {
    width: 10px;
    height: 20px;
  }
  ```

- 值为css选择器（使用变量来代表CSS中的选择器）

  ```css
  // Variables
  @my-selector: banner;
  
  // Usage 注意用法
  .@{my-selector} {
    font-weight: bold;
    line-height: 40px;
    margin: 0 auto;
  }  
  
  或者：
  @my-selector: .banner;
  
  // Usage 注意用法
  @{my-selector} {
    font-weight: bold;
    line-height: 40px;
    margin: 0 auto;
  }  
  
  
  都编译为：
  .banner {
    font-weight: bold;
    line-height: 40px;
    margin: 0 auto;
  }
  ```

  

- 值为css属性名（使用变量来代表CSS规则中的属性名）

  ```css
  @m:margin;
  
  p{
    @{m}:50px
  }
  
  编译为：
  p{
    margin:50px
  }
  
  
  
  @property: color;
  
  .widget {
    @{property}: #0ee;
    background-@{property}: #999;
  }
  
  
  编译为：
  .widget {
    color: #0ee;
    background-color: #999;
  }
  ```

  

- 值为URL地址

  ```css
  // Variables
  @images: "../img";
  
  // Usage 注意用法
  body {
    color: #444;
    background: url("@{images}/white-sand.png"); 
  }
  
  
  // Variables
  @themes: "../../src/themes";
  
  // Usage
  @import "@{themes}/tidal-wave.less";
  
  ```

### 变量引用另一个变量

```css
@primary:  green;

.section {
  @color: primary;

  .element {
    color: @@color;
  }
}

编译为：
.section .element {
  color: green;
}
```

### 变量的延迟加载

变量在使用之前不必声明

```css
.lazy-eval {
  width: @var;
}

@var: @a;
@a: 9%;


编译为：
.lazy-eval {
  width: 9%;
}
```

### 变量存在块级作用域

同一个作用域下：两次定义变量时，使用变量的最后定义。

不同作用域中查找变量：从当前作用域向上搜索。

```css
@var: 0;
.class {
  @var: 1;
  .brass {
    @var: 2;
    three: @var;
    @var: 3;
  }
  one: @var;
}


编译为：
.class {
  one: 1;
}
.class .brass {
  three: 3;
}
```

### 属性作为变量（$css属性名）

将一个选择器的css属性对应的值作为另一个css属性的值，将属性像变量一样对待。像变量一样，Less将选择当前/父范围内的最后一个属性作为“最终”值。

```css
.block {
  color: red; 
  .inner {
    background-color: $color; 
  }
  color: blue;  
} 

编译为：
.block {
  color: red; 
  color: blue;  
} 
.block .inner {
  background-color: blue; 
}
```

## 引用父选择器 `&`

**&操作符等价于嵌套规则的父（如果有，则加上其他祖先元素）选择器，在对现有选择器应用修改类或伪类时最常用。**

```css
a {
  color: blue;
  &:hover {
    color: green;
  }
}

编译为：
a {
  color: blue;
}

a:hover {
  color: green;
}
```

**&的另一个典型用法是产生重复的类名**

```css
.button {
  &-ok {
    background-image: url("ok.png");
  }
  &-cancel {
    background-image: url("cancel.png");
  }

  &-custom {
    background-image: url("custom.png");
  }
}

编译为：
.button-ok {
  background-image: url("ok.png");
}
.button-cancel {
  background-image: url("cancel.png");
}
.button-custom {
  background-image: url("custom.png");
}
```

&在选择器中可能出现多次，这使得重复引用父选择器而不重复它的名字。

```css
.link {
  & + & {
    color: red;
  }

  & & {
    color: green;
  }

  && {
    color: blue;
  }

  &, &ish {
    color: cyan;
  }
}

编译为：
.link + .link {
  color: red;
}
.link .link {
  color: green;
}
.link.link {
  color: blue;
}
.link, .linkish {
  color: cyan;
}
```

**`&`代表所有父选择器（而不仅仅是最接近的祖先）**

```css
.grand {
  .parent {
    & > & {
      color: red;
    }

    & & {
      color: green;
    }

    && {
      color: blue;
    }

    &, &ish {
      color: cyan;
    }
  }
}

编译为：
.grand .parent > .grand .parent {
  color: red;
}
.grand .parent .grand .parent {
  color: green;
}
.grand .parent.grand .parent {
  color: blue;
}
.grand .parent,
.grand .parentish {
  color: cyan;
}
```

**&更改选择器顺序**

```css
.header {
  .menu {
    border-radius: 5px;
    .no-borderradius & {
      background-image: url('images/button-background.png');
    }
  }
}

编译为：
.header .menu {
  border-radius: 5px;
}
.no-borderradius .header .menu {
  background-image: url('images/button-background.png');
}
```

## 继承（extend）

extend类似于less中的一个伪类选择器。它将祖先选择器与它所引用选择器，即括号内的参数，相匹配。

```css
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}
编译为：
nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}
```

extend要么附加到选择器中，要么放置到规则集中。它看起来像一个伪类，带有选择器参数，后面可选地跟着关键字all。

```css
.a:extend(.b) {}

// the above block does the same thing as the below block
.a {
  &:extend(.b);
}


.c:extend(.d all) {
  // extends all instances of ".d" e.g. ".x.d" or ".d.x"
}
.c:extend(.d) {
  // extends only instances where the selector will be output as just ".d"
}
```

extend可以包含一个或多个要扩展的类，用逗号分隔。

```css
.e:extend(.f) {}
.e:extend(.g) {}

// the above and the below do the same thing
.e:extend(.f, .g) {}
```

## 混合（mixins）

CSS是由许多 **规则** 组成,每条规则又是由 ***选择器*** 与 ***声明块组成*** ,声明块由***一条或者多条声明*** 组成,***声明*** 由***CSS属性名*** : ***CSS属性值*** 组成

类如: h1 {color : red ; background : pink}



混合：将一系列声明从一个规则引入到另一个规则。

- 普通混合
- 不带输出的混合（加括号）
- 带参数的混合（括号内由变量）
- 带参数的并有默认值的混合
- 带多个参数的混合
- 命名参数
- 匹配模式
- arguments变量