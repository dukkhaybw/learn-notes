**为什么tree-shaking需要依赖于ESM模块化规范而不能依赖于CommonJS模块化规范？**

Tree shaking是一种用于优化前端打包结果体积的技术，它可以通过**静态分析**的方式，**识别并移除未使用的代码**，从而减小最终打包文件的大小。

> 静态分析是一种在**编译时或运行前**对代码进行分析的，通过对代码的结构、语法和上下文进行解析，以获取有关代码行为和属性的信息。它是在不实际执行代码的情况下进行分析，主要用于发现潜在的问题、优化代码以及生成相关的元数据。
>
> 这种分析可以包括以下内容：
>
> 1. 语法分析：对代码的语法进行解析，确保代码符合语法规范。它可以检测到潜在的语法错误，例如拼写错误、缺失的分号等。
> 2. 类型检查：可以推断代码中的变量类型和函数参数类型，并检查类型是否匹配。这有助于在编译时发现类型错误，提高代码的健壮性和可靠性。
> 3. 控制流分析：追踪代码中的控制流，即代码执行的路径。它可以确定条件语句的分支、循环的迭代次数等信息。对代码优化和性能分析。
> 4. 数据流分析：可以跟踪代码中的数据流，即数据在程序中的传递和变化。检测到未使用的变量、未初始化的变量以及潜在的数据依赖关系。
> 5. 依赖分析：确定模块之间的依赖关系，包括导入和导出关系。这对于模块加载和打包工具的优化非常重要，例如确定哪些模块是被使用的，从而进行tree shaking。
>
> 通过静态分析，开发者可以在代码执行之前发现潜在的问题和优化点，从而提高代码的质量和性能。静态分析工具和编译器经常使用静态分析来进行代码检查、优化和生成相关的元数据。

而前端模块化规范中，CommonJS (CJS) 和 ECMAScript模块 (ESM)一个重要的区别就是在静态分析和优化方面的能力。

Tree shaking的核心原理是通过**静态分析**来确定代码中的哪些部分是被使用的，哪些是未使用的。ESM规范在设计时考虑了静态分析的需求，ESM的**静态导入和导出机制**允许在编译时进行静态分析，因此打包工具可以准确地知道哪些模块被导入，哪些被使用。这使得打包工具能够更好地进行tree shaking，移除未使用的代码。

相比之下，**CJS规范的导入和导出机制是动态的**，它允许**在运行时根据条件**导入和导出模块。这种动态性使得静态分析工具很难在编译时确定哪些代码是被使用的，因此在CJS规范下实现tree shaking是非常困难的。



**为什么CJS规范的导入和导出机制是动态的，而ESM规范的导入和导出机制是静态的？**

CJS规范（CommonJS）和ESM规范（ECMAScript模块）在导入和导出机制上的差异主要源于它们的设**计目标和使用场景**。

CJS规范最初是为了在服务器端（如Node.js）使用而设计的，它的主要目标是实现模块化的代码组织和代码共享。CJS模块使用`require`函数进行导入，该函数接受一个模块标识符，并在**运行时**动态加载所需的模块。这种动态导入的特性使得CJS模块可以根据条件和运行时的逻辑来决定加载哪些模块，从而实现更灵活的模块加载。

相比之下，ESM规范是在浏览器环境下的JavaScript模块化标准。ESM模块使用`import`语句进行导入，它在编译时就确定了需要导入的模块，并且这些导入语句必须位于模块的**顶层作用域**。这种静态导入的特性使得ESM模块的导入关系在编译时就可以确定，从而可以进行静态分析和优化。

静态导入的优势在于它提供了更多的优化和分析机会。打包工具可以在编译时静态地分析模块之间的依赖关系，确定哪些模块是被使用的，哪些是未使用的，进而进行tree shaking等优化操作。此外，静态导入还可以提供更好的模块解析和加载性能，因为导入关系在编译时就已经确定，不需要在运行时进行动态加载和解析。

总结起来，CJS规范的导入和导出机制是动态的，适用于服务器端和动态加载的场景，而ESM规范的导入和导出机制是静态的，适用于浏览器环境和静态分析优化的场景。这些规范的设计目标和使用场景导致了它们在导入和导出机制上的差异。



# Rollup

roollup是一个ES模块打包器。可以将项目源码中使用到的各个模块打包合并为一个文件或者多个文件。

rollup和webpack的作用类似，但是整体小巧很多。Rollup更聚焦于JS打包，虽然可以引入一些额外的功能，它并不是要和webpack全面竞争，而是希望提供一个高效的esmodule打包器，充分利用esmodule的特性构建出结构比较扁平，性能比较出众的类库。

Rollup中实现扩展的唯一方式就是插件，不像webpack中划分了loader，plugin等扩展方式。

webpack 打包的特点：

1. 打包后的代码会带有 webpack 自身的逻辑代码，且体积大
2. 打包速度慢，且配置可以很多样复杂
3. 开发 JS 类库不适合使用 webpack 来进行打包
4. 配合插件几乎可以完成前端工程化中的绝大部分任务

webpack中实现功能扩展有几种方式？比如除了loader，plugin外还有什么吗



### 先导

rollup 是专门用于打包 JS 类库，支持打包生成 umd/commonjs/es 的 js 代码，学习 rollup 是为 vite 打基础。vite 开发时用的是 esbuild（也是一个打包工具，用 Go 语言写的）打包；上线时使用的是 rollup 打包，而且 vite 内部的插件机制也是复用 rollup 的插件机制。

rollup 插件和 vite 插件可以复用，vite 插件是一个简化版的 rollup 插件，webpack 使用的是 commonjs 规范，rullup 使用的是 ESM 规范吗？ webpack 和 rollup 都会支持 esm 和 commonjs 但是打包出来的结果 webpack 只能是 commonjs，rollup 可以打包出 commonjs 也可以打包出 esm。rollup 自带支持 Tree-shaking，本质是消除无用的 js 代码，只处理函数和顶层的 import/export 变量

模块化规范：

- amd：`Asynchronous Module Definition`异步模块定义
- ES6 module：es6 提出了新的模块化方案
- `IIFE(Immediately Invoked Function Expression)`：立即执行函数表达式，声明一个函数，声明完了立即执行
- UMD：`Universal Module Definition`，通用模块定义
- `cjs`：nodejs 采用的模块化标准，commonjs 使用方法`require`来引入模块,这里`require()`接收的参数是模块名或者是模块文件的路径



rollup打包生成项目的特点：

1. 打包生成文件内容非常的简洁，没有像webpack中那么大量的引导代码和polyfill，基本就是按照源码的导入顺序将源代码提取到一起
2. 会自动进行tree-shaking
3. **使用esmodule模块化时，代码中是不能直接导入并解析json文件的（需要借助插件：rollup-plugin-json）**



```shell
npm i @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript lodash rollup  postcss rollup-plugin-postcss rollup-plugin-terser tslib typescript rollup-plugin-serve rollup-plugin-livereload -D
```

```json
{
  "script": {
    "build": "rollup --config"
  }
}
```

rollup 配置文件

rollup.config.js：

```js
export default {
  input: './src/main.js',
  output: {
    file: 'dist/bundle.cjs.js', // 输出的文件路径和文件名
    format: 'cjs', // 五种输出的模块化的格式 amd/es/iife/umd/cjs
    name: 'libName' // 当format格式为iife和umd的时候必须提供变量名，该变量名会挂载到全局对象上。
  }
};
```



### 引入 Babel

```shell
npm install @rollup/plugin-babel @babel/core @babel/preset-env -D
```

```js
import babel from '@rollup/plugin-babel';

export default {
  // ...
  plugins: [
    babel({
      exclude: /node_modules/
    })
  ]
};
```

.babelrc

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false  // 关闭babel转换模块化规范
      }
    ]
  ]
}
```



要让 rollup 的 tree-shaking 生效，必须使用 esmodule 模块化规范编写代码，**只处理函数和顶层的 import/export 变量，并有作用域提升的效果**（可以将原来两个文件中的代码合并到一个文件中）。



### 使用第三方 npm 模块

rollup.js 编译源码中的模块引用时，默认只支持 ESM的模块方式`import/export`。大量的 npm 包是基于 CommonJS 模块开发的，这就导致了大量 npm 包不能直接编译使用。所以辅助 rollup.js 编译支持 npm 包和 CommonJS 模块方式的插件就应运而生。

如果源码中使用到了通过npm安装到当前目录下的node_modules中的包时，rollup默认并不能识别并去该node_modules中打包该依赖包。

- @rollup-plugin-node-resolve 插件辅助rollup去查找第三方依赖模块（node_modules 中的库）
- @rollup/plugin-commonjs 插件将commonjs模块转换可以识别的内容

```shell
npm install @rollup/plugin-node-resolve @rollup/plugin-commonjs -D
```

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './src/main.js',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [resolve(), commonjs()]
};
```



### 支持 CDN

第三方库通过 cdn 引入，不直接出现在打包后的源码中。

src/main.js:

```js
import _ from 'lodash';
import $ from 'jquery';
console.log(_.concat([1, 2, 3], 4, 5));
console.log($);
export default 'main';
```

index.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <script src="bundle.js"></script>
    引入打包后的js文件
  </body>
</html>
```

rollup.config.js:

```diff
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',// 使用iife
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
+       globals:{
+           lodash:'_', //告诉rollup全局变量_即是lodash
+           jquery:'$' // $即是jquery
+       }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs()
    ],
+   external:['lodash','jquery']
}
```

打包生成文件的内容：

![image-20230506210020159](D:\learn-notes\工程化\images\image-20230506210020159.png)



### 支持 TS

```shell
npm install @rollup/plugin-typescript -D

npx tsc --init
```

rollup.config.js

```js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [typescript()]
};
```



### 支持压缩

```js
import { terser } from 'rollup-plugin-terser';

export default {
  // ...
  plugins: [terser()]
};
```



### 支持 CSS

本质也是在 head 中加入 style 标签。

```js
import postcss from 'rollup-plugin-postcss';

export default {
  // ...
  plugins: [postcss()]
};
```



### 支持开发服务器

```json
{
  "scripts": {
    "build": "rollup --config",
    "dev": "rollup --config -w"
    // "build": "rollup --config rollup.config.build.js",
    // "dev": "rollup --config rollup.config.dev.js -w"
  }
}
```

```js
import serve from 'rollup-plugin-serve';

export default {
  // ...
  plugins: [
    serve({
      open: true,
      port: 8080,
      contentBase: './dist'
    })
  ]
};
```



### 热更新

```js
import livereload from 'rollup-plugin-livereload';

export default {
  // ...
  plugins: [livereload()]
};
```



### 代码分割

1. 使用import函数动态导入实现代码分割
2. 多入口打包，且公共部分会单独提取出来，配置文件中的input字段的值为数组或者对象



### 扁平化输出

扁平化输出（Flattened output）通常指的是构建工具（如Webpack或Rollup）在处理模块依赖时，将这些依赖整合到尽可能少的文件中，以减少产出文件的数量，从而提高加载效率。这种方法特别适用于库或工具的开发，因为它可以减少最终用户需要加载的资源数量。



### Rollup中的扁平化输出

Rollup默认就会将项目的所有模块打包到一个文件中（除非特别配置多入口或代码分割），这是因为Rollup专注于ES模块，可以静态分析模块间的导入和导出关系，从而有效地将代码合并到一个文件中。

以下是一个简单的Rollup配置示例，它将多个JavaScript模块打包为一个扁平化的单一文件：

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js', // 入口文件
  output: {
    file: 'bundle.js', // 输出文件
    format: 'iife', // 立即执行函数表达式(iife)格式适用于浏览器
  },
  plugins: [
    resolve(), // 告诉Rollup如何查找外部模块
    commonjs() // 将CommonJS模块转换为ES6，便于Rollup处理
  ]
};
```

这个配置会将所有依赖整合到`bundle.js`文件中，实现了扁平化输出。



### Webpack中的扁平化输出

Webpack默认会为每个入口点生成一个文件，以及额外的代码分割文件（如果配置了代码分割）。要在Webpack中实现类似Rollup的扁平化输出，可以通过优化配置来减少输出文件的数量，例如使用`optimization.splitChunks`来合并公共模块，但这并不是传统意义上的"扁平化输出"。

如果你的目的是生成一个尽可能扁平化的库或包，可以考虑以下策略：

- 使用单一入口点。
- 避免代码分割，或仅对特定情况使用。
- 使用插件如`TerserWebpackPlugin`来压缩输出。

以下是一个基础的Webpack配置示例，演示如何配置一个简单的输出：

```js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'MyLibrary',
    libraryTarget: 'umd'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

此配置将项目打包为一个文件，并尽量压缩代码体积。然而，Webpack的强项是应用级别的打包而不是库的打包，因此，对于打包库而言，Rollup可能是一个更合适的选择，因为它的设计更侧重于扁平化输出和ES模块的支持。

总结来说，要实现扁平化输出，选择合适的工具和配置是关键。Rollup在这方面提供了内建的优势，而Webpack则需要通过配置和插件来逼近这种效果。



## Rollup 原理

#### **前置知识**

rollup 使用了 `acorn` 和 `magic-string` 两个库。

[magic-string](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fmagic-string)是一个操作字符串和生成 source-map 的工具,`magic-string` 是 rollup 作者写的。下面是 github 上的示例：

```js
var MagicString = require('magic-string');
var magicString = new MagicString('export var name = "beijing"');

//类似于截取字符串
//裁剪出原始字符串开始和结束之间所有的内容
//返回一个克隆后的MagicString的实例
console.log(magicString.snip(0, 6).toString()); // export
//从开始到结束删除字符串(索引永远是基于原始的字符串，而非改变后的
console.log(magicString.remove(0, 7).toString()); // var name = "beijing"

//很多模块，把它们打包在一个文件里，需要把很多文件的源代码合并在一起
let bundleString = new MagicString.Bundle();
bundleString.addSource({
  content: 'var a = 1;',
  separator: '\n'
});
bundleString.addSource({
  content: 'var b = 2;',
  separator: '\n'
});
/* 
let str = '';
str += 'var a = 1;\n'
str += 'var b = 2;\n'
console.log(str); 
*/
console.log(bundleString.toString());
// var a = 1;
// var b = 2;
```



#### AST

[astexplorer](https://astexplorer.net/)

使用 JavaScript 编写的 JavaScript 解析器：

- [Esprima](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjquery%2Fesprima)
- babel-parser
- [Acorn](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fternjs%2Facorn)

上面三个解析出来的 AST 都符合 [The Estree Spec](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.comb%2Festree%2Festree) 规范，本质是一个带有层级的 js 对象。

rollup 和 Webpack 解析代码用的是 Acorn。

- [UglifyJS 2](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmishoo%2FUglifyJS2)：一个 JavaScript 代码压缩器，它自带了一个代码解析器，也可以输出 AST，但是它的功能更多还是用于压缩代码
- [Shift](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fshapesecurity%2Fshift-parser-js)



- Parse(解析) 将源代码转换成抽象语法树，树上有很多的符合 estree规范的节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码





![image-20240303211123742](D:/learn-notes/工程化/images/image-20240303211123742.png)

Acorn 的解析源代码时，可以接收的options配置对象上的一些属性：

- **ecmaVersion**，设置要解析的 JavaScript 的 ECMA 版本，默认是 ES7。
- **sourceType**，这个配置项有两个值：`module` 和 `script`，默认是 `script`。主要是严格模式和 `import/export` 的区别。ES6 中的模块是严格模式，也就是无须添加 `use strict`。通常浏览器中使用的 script 是没有 `import/export` 语法的。
- **locations**，默认值是 `false`，设置为 `true` 之后会在 AST 的节点中携带多一个 `loc` 对象来表示当前的开始和结束的行数和列数。
- **ranges**，显示范围
- **onComment**，传入一个回调函数，每当解析到代码中的注释时会触发，可以获取注释内容，参数列表是：`[block, text, start, end]`。`block` 表示是否是块注释，`text` 是注释内容，`start` 和 `end` 是注释开始和结束的位置。

使用 acorn 进行词法分析结果 API：const tokens = [...acorn.tokenizer(code, options)]。

词法分析例子：

```js
const acorn = require('acorn');

const code = `
import { name } from "hello.js";
console.log(name);
`;

const tokens = [...acorn.tokenizer(code)];

console.log(tokens);
```

打印结果：

```
[
  Token {
    type: TokenType {
      label: 'import',
      keyword: 'import',
      beforeExpr: false,
      startsExpr: true,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: null
    },
    value: 'import',
    start: 1,
    end: 7
  },
  Token {
    type: TokenType {
      label: '{',
      keyword: undefined,
      beforeExpr: true,
      startsExpr: true,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: [Function (anonymous)]
    },
    value: undefined,
    start: 8,
    end: 9
  },
  Token {
    type: TokenType {
      label: 'name',
      keyword: undefined,
      beforeExpr: false,
      startsExpr: true,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: [Function (anonymous)]
    },
    value: 'name',
    start: 10,
    end: 14
  },
  Token {
    type: TokenType {
      label: '}',
      keyword: undefined,
      beforeExpr: false,
      startsExpr: false,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: [Function (anonymous)]
    },
    value: undefined,
    start: 15,
    end: 16
  }
	// ...
]
```



ATS 节点：

符合[The Estree Spec](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Festree%2Festree)规范的 AST 节点用 `Node` 对象来标识，`Node` 对象应该符合这样的接口：

```js
interface Position {
  line: number; // >= 1
  column: number; // >= 0
}

interface SourceLocation {
  source: string | null;
  start: Position;
  end: Position;
}

interface Node {
  type: string; // type 字段表示不同的节点类型
  loc: SourceLocation | null; // loc 字段表示源码的位置信息
}
```

AST 节点类型：

1. **Identifier**，标识符，写 JS 时自定义的名称，如变量名，函数名，属性名，都归为标识符。相应的接口是这样的：

   ```ts
   interface Identifier <: Expression, Pattern {
       type: "Identifier";
       name: string;
   }
   ```

2. **Literal**，字面量，代表了一个值

   ```ts
   interface Literal <: Expression {
       type: "Literal";
       value: string | boolean | null | number | RegExp;
   }
   ```

3. **RegExpLiteral**，正则字面量，解析正则表达式的内容。

   ```ts
   interface RegExpLiteral <: Literal {
     regex: {
       pattern: string;
       flags: string;
     };
   }
   ```

4. **Programs**，根节点，代表了一棵完整的程序代码树。

   ```ts
   interface Program <: Node {
       type: "Program";
       body: [ Statement ];  // body 属性是一个数组，包含了多个 Statement（即语句）节点。
   }
   ```

5. **Functions**，函数声明或者函数表达式节点。

   ```ts
   interface Function <: Node {
       id: Identifier | null;  // 函数名
       params: [ Pattern ];  // 一个数组，表示函数的参数
       body: BlockStatement; // 一个块语句
   }
   ```

   不会找到 `type: "Function"` 的节点的，但是你可以找到 `type: "FunctionDeclaration"` 和 `type: "FunctionExpression"`，因为函数要么以声明语句出现，要么以函数表达式出现，都是节点类型的组合类型。

   > 根据这两个接口的定义，一个实现了`Function`接口的对象应该具有以下属性和方法：
   >
   > 1. `id`: 一个可选的`Identifier`对象，表示函数的名称（如果存在）。
   > 2. `params`: 一个由`Pattern`类型元素组成的数组，表示函数的参数列表。
   > 3. `body`: 一个`BlockStatement`对象，表示函数的主体语句块。
   >
   > 注意，这里的`Identifier`和`Pattern`都是其他接口，因此一个实现了`Function`接口的对象，还必须同时实现这两个接口。
   >
   > 例如，以下是一个实现了`Function`接口的对象的示例代码：
   >
   > ```ts
   > const myFunc: Function = {
   >   id: {
   >     type: 'Identifier',
   >     name: 'myFunc'
   >   },
   >   params: [
   >     {
   >       type: 'Identifier',
   >       name: 'arg1'
   >     },
   >     {
   >       type: 'Identifier',
   >       name: 'arg2'
   >     }
   >   ],
   >   body: {
   >     type: 'BlockStatement',
   >     body: [
   >       {
   >         type: 'ExpressionStatement',
   >         expression: {
   >           type: 'CallExpression',
   >           callee: {
   >             type: 'Identifier',
   >             name: 'console.log'
   >           },
   >           arguments: [
   >             {
   >               type: 'BinaryExpression',
   >               operator: '+',
   >               left: {
   >                 type: 'Identifier',
   >                 name: 'arg1'
   >               },
   >               right: {
   >                 type: 'Identifier',
   >                 name: 'arg2'
   >               }
   >             }
   >           ]
   >         }
   >       }
   >     ]
   >   }
   > };
   > ```
   >
   > 这个示例中的`myFunc`对象实现了`Function`接口，具有`id`、`params`和`body`三个属性，分别对应函数的名称、参数和主体。其中，`id`是一个`Identifier`对象，`params`是一个包含两个`Identifier`对象的数组，`body`是一个包含一个`ExpressionStatement`对象的`BlockStatement`对象。

扩展：

> ```ts
> interface RegExpLiteral <: Literal {
>   regex: {
>      pattern: string;
>      flags: string;
>   };
> }
> ```
>
> 在 TypeScript 中，`<:`符号表示继承关系。在这个例子中，`RegExpLiteral`是一个接口(interface)，它继承自另一个接口`Literal`。继承使得`RegExpLiteral`可以拥有`Literal`中定义的所有属性和方法，并且可以在`RegExpLiteral`中添加新的属性和方法。因此，这个语句的意思是，`RegExpLiteral`是一个继承自`Literal`的接口。

一个使用 Acorn 解析 JavaScript 代码并输出函数名的例子：

```js
const acorn = require('acorn');

const code = `
  function add(x, y) {
    return x + y;
  }
  
  let result = add(1, 2);
  console.log(result);
`;

const ast = acorn.parse(code, {
  ecmaVersion: 2021
});

console.log(ast);

ast.body.forEach((node) => {
  if (node.type === 'FunctionDeclaration') {
    console.log(`Function name: ${node.id.name}`);
  }
});
```

打印内容：

```
Node {
  type: 'Program',
  start: 0,
  end: 98,
  body: [
    Node {
      type: 'FunctionDeclaration',
      start: 3,
      end: 45,
      id: [Node],
      expression: false,
      generator: false,
      async: false,
      params: [Array],
      body: [Node]
    },
    Node {
      type: 'VariableDeclaration',
      start: 51,
      end: 74,
      declarations: [Array],
      kind: 'let'
    },
    Node {
      type: 'ExpressionStatement',
      start: 77,
      end: 97,
      expression: [Node]
    }
  ],
  sourceType: 'script'
}

Function name: add
```

```js
const acorn = require('acorn');

const code = `import $ from "jquery"`;

const ast = acorn.parse(code, {
  ecmaVersion: 2021,
  sourceType: 'module'
});

console.dir(ast);

ast.body.forEach((node) => {
  if (node.type === 'FunctionDeclaration') {
    console.log(`Function name: ${node.id.name}`);
  }
});
```

打印内容：

```
{
  "type": "Program",
  "start": 0,
  "end": 22,
  "body": [
    {
      "type": "ImportDeclaration",
      "start": 0,
      "end": 22,
      "specifiers": [
        {
          "type": "ImportDefaultSpecifier",
          "start": 7,
          "end": 8,
          "local": {
            "type": "Identifier",
            "start": 7,
            "end": 8,
            "name": "$"
          }
        }
      ],
      "source": {
        "type": "Literal",
        "start": 14,
        "end": 22,
        "value": "jquery",
        "raw": "\"jquery\""
      }
    }
  ],
  "sourceType": "module"
}
```

```js
const acorn = require('acorn');

const sourceCode = `import $ from "jquery"`;

const ast = acorn.parse(sourceCode, {
  locations: false,
  ranges: true,
  sourceType: 'module',
  ecmaVersion: 8
});

//遍历语法树
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      console.log('进入' + node.type);
    },
    leave(node) {
      console.log('离开' + node.type);
    }
  });
});

/**
 * 以深度优先的方式遍历此节点
 * @param {*} astNode 
 * @param {*} param1 
 */
function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}
function visit(node, parent, enter, leave) {
  if (enter) {
    enter.call(null, node, parent);
  }
  const keys = Object.keys(node).filter(key => typeof node[key] == 'object');
  keys.forEach(key => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach(child => visit(child, node, enter, leave))
    } else if (value && value.type) {
      visit(value, node, enter, leave)
    }
  });
  if (leave) {
    leave.call(null, node, parent);
  }
}
```

打印：

```
进入ImportDeclaration
进入ImportDefaultSpecifier
进入Identifier
离开Identifier
离开ImportDefaultSpecifier
进入Literal
离开Literal
离开ImportDeclaration
```

![d39f73349c0580b4bfe6aa106ef0b1ae](http://img.zhufengpeixun.com/d39f73349c0580b4bfe6aa106ef0b1ae)



**作用域**

```js
class Scope {
  constructor(options = {}) {
    //作用域的名称
    this.name = options.name;
    //父作用域
    this.parent = options.parent;
    //此作用域中定义的变量
    this.names = options.names || [];
  }
  add(name) {
    this.names.push(name);
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this;
    } else if (this.parent) {
      return this.parent.findDefiningScope(name);
    } else {
      return null;
    }
  }
}

module.exports = Scope;

var a = 1;
function one() {
  var b = 2;
  function two() {
    var c = 3;
    console.log(a, b, c);
  }
}
let globalScope = new Scope({
  name: 'global',
  names: ['a','one'],
  parent: null
});
let oneScope = new Scope({
  name: 'oneScope',
  names: ['b','two'],
  parent: globalScope
});
let twoScope = new Scope({
  name: 'twoScope',
  names: ['c'],
  parent: oneScope
});

console.log(
  twoScope.findDefiningScope('a').name,
  twoScope.findDefiningScope('b').name,
  twoScope.findDefiningScope('c').name,
  twoScope.findDefiningScope('d')
);
```



## Rollup实现

#### 目录结构

- [rollup 代码仓库地址](https://gitee.com/zhufengpeixun/rollup)

```js
├── package.json
├── README.md
├── src
    ├── ast
    │   ├── analyse.js // 分析AST节点的作用域和依赖项
    │   ├── Scope.js // 有些语句会创建新的作用域实例
    │   └── walk.js // 提供了递归遍历AST语法树的功能
    ├── Bundle// 打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出
    │   └── index.js
    ├── Module// 每个文件都是一个模块
    │   └── index.js
    ├── rollup.js // 打包的入口模块
    └── utils
        ├── map-helpers.js
        ├── object.js
        └── promise.js
```



#### 单文件打包实现

启动文件：

```js
const path = require('path');
const rollup = require('./lib/rollup');

const entry = path.resolve(__dirname, './src/main.js');
const output = path.resolve(__dirname, './dist/bundle.js');

rollup(entry, output);
```

rollup 本质是一个方法，rollup 中的 Bundle 实例类比于 webpack 中的 Compiler 实例。rollup 中每个文件也对应一个模块，webpack 中也如此。

rollup.js 文件内容：

```js
const Bundle = require('./bundle.js');

function rollup(entry, output) {
  // entry和output分别是打包入口文件和出口文件的绝对路径
  // 使用rollup打包时，会创建一个统筹全局的bundle实例对象，调用它的build方法进行打包编译工作
  const bundle = new Bundle({ entry });
  bundle.build(output);
}

module.exports = rollup;
```

bundle.js:

```js
const path = require('path');
const fs = require('fs');
const MagicString = require('magic-string');
const Module = require('./module.js');

class Bundle {
  constructor(options) {
    this.entryPath = path.resolve(options.entry); // 不管是相对路径还是绝对路径，都统一改为绝对路径
    this.modules = new Set();
  }

  build(output) {
      
    const entryModule = this.fetchModule(this.entryPath);  // 会针对每个文件创建一个模块实例

    this.statements = entryModule.expandAllStatements(); //该文件源码对应的AST中所有节点组成的数组，将它们节点的_source属性对应的代码字符串拼接起来就能生成新的源代码

    const { code } = this.generate();
    fs.writeFileSync(output, code);
  }

  fetchModule(importee) {
    let route = importee;
    if (route) {
      const code = fs.readFileSync(route, 'uft8'); // 读取原文件内容
      // 每个文件都对应着一个模块，即一个module实例对象
      const module = new Module({
        code,
        path: route,
        bundle: this
      });
      this.modules.add(module);
      return module;
    }
  }

  generate() {
    let bundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      // 把每个ast节点对应的源码都添加到bundle实例中
      const source = statement._source.clone();
      bundle.addSource({
        content: source,
        separator: '\n'
      });
    });
    return { code: bundle.toString() };
  }
}
```

module.js：

```js
const MagicString = require('magic-string');
const { parse } = require('acorn');
const analyse = require('./ast/analyse');

// 每个文件对应的模块对象上都有该文件的源码包装过的MagicString实例，该源码文件所在的路径，该源码文件属于哪个bundle
// 同时每个模块上都有自己的源码对应的ast，同时，每个ast上的节点对象上也有三个属性：_included，_module，_source
// _source：存放着该ast节点对应的源码字符串
// _module：存放着该ast节点所属的源码文件生成的模块实例对象
// _included: 表示这条语句默认不包括在输出的结果
class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename:path }); // 将模块的源代码包装为MagicString，方便后期操作
    this.path = path;
    this.bundle = bundle; // 该模块术语哪个bundle
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    });
    analyse(this.ast, this.code, this);
  }

  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      let statements = this.expandAllStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }

  expandAllStatement(statement) {
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
}
```

ast/analyse.js:

```js
function analyse(ast, code, module) {
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _included: { value: false, writable: true },
      _module: { value: module },
      _source: { value: code.snip(statement.start, statement.end) }
    });
  });
}

module.exports = analyse;
```



#### 实现 tree-shaking

main.js

```js
import {name ,age} from './msg'
function asy(){
    console.log('hello',name)
}
say()
```



msg.js

```js
export var name = 'abc'
export var age = 123
```

最终的打包结果应该是这样的：

```js
var name = 'abc'
function asy(){
    console.log('hello',name)
}
say()
```



多文件打包以及tree-shaking。

思路：拿到一个模块后，分析它的导入和导出的变量，使用到了哪些变量，后面只留下使用到的哪些变量和它的定义语句

每个文件模块实例对象上的属性及说明：

module.js

```js
const MagicString = require('magic-string');
const { parse } = require('acorn');
const analyse = require('./ast/analyse');
const { hasOwnProperty } = require('./utils');
const SYSTEM_VARS = ['console', 'log'];
class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code);
    this.path = path;
    this.bundle = bundle;
    //先获取语法树
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    });
    //存放本模块内导入了哪些变量 main.js中导入了name和age变量，对msg.js来说没有导入任何变量
    this.imports = {};   // 格式是{ source:',/msg', importName }
    //存放本模块中导出了哪些变量 ，对于maing.js来说没有导出任何变量，msg.js导出了name和age两个变量
    this.exports = {};
    //存放本模块的顶级变量的定义语句是哪条
    this.definitions = {};
    //存放变量修改语句
    this.modifications = {};
    //重命名的变量
    this.canonicalNames = {};
    //分析语法树
    analyse(this.ast, this.code, this);
  }
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      if (statement.type === 'ImportDeclaration') return;
      //默认情况下我们不包括所有的变量声明语句
      if (statement.type === 'VariableDeclaration') return;
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true;
    let result = [];
    //找到此语句使用到的变量，把这些变量的定义语句取出来，放到result数组里
    //var name = 'zhufeng';
    const _dependsOn = Object.keys(statement._dependsOn);
    _dependsOn.forEach((name) => {
      //找到此变量的定义语句，添加到结果里
      let definitions = this.define(name);
      result.push(...definitions);
    });
    //console.log(name);
    result.push(statement);
    //还要找到此语句定义的变量，把此变量对应的修改语句也包括进来
    //name += 'jiagou' name += '2'
    const defines = Object.keys(statement._defines);
    defines.forEach((name) => {
      //找到此变量的修改语句
      const modifications = hasOwnProperty(this.modifications, name) && this.modifications[name];
      if (modifications) {
        modifications.forEach((modification) => {
          //为了避免同一行代码在结果 里输出二次
          if (!modification._included) {
            let statements = this.expandStatement(modification);
            result.push(...statements);
          }
        });
      }
    });
    return result;
  }
  define(name) {
    //区分此变量是函数内自己声明的，还是外部导入的
    if (hasOwnProperty(this.imports, name)) {
      //获取是从哪个模块引入的哪个变量
      const { source, importName } = this.imports[name];
      //获取导入的模块 source相对于当前模块路径的相对路径 path是当前模块的绝对路径
      const importedModule = this.bundle.fetchModule(source, this.path);
      const { localName } = importedModule.exports[importName]; //msg.js exports[name]
      return importedModule.define(localName);
    } else {
      //如果非导入模块，是本地模块的话,获取 此变量的变量定义语句
      let statement = this.definitions[name];
      if (statement) {
        if (statement._included) {
          return [];
        } else {
          return this.expandStatement(statement);
        }
      } else {
        if (SYSTEM_VARS.includes(name)) {
          return [];
        } else {
          throw new Error(`变量${name}既没有从外部导入，也没有在当前的模块内声明!`);
        }
      }
    }
  }
  rename(name, replacement) {
    this.canonicalNames[name] = replacement;
  }
  getCanonicalName(name) {
    return this.canonicalNames[name] || name;
  }
}
module.exports = Module;
```

lib\ast\analyse.js

分析一个模块导入和导出了哪些变量。

- 第 1 个循环 找出导入导出的变量，因为一个模块需要知道用到的变量是自己本模块中定义的还是从别的模块导入的，如果是来自别的模块，则需要别的模块中定义和处理了这个变量的语句（包括函数体中的相关操作等），以便之后能进行代码的提取后合并
- 第 2 个循环 找出定义和依赖的变量

```js
const walk = require('./walk');
const Scope = require('./scope');
const { hasOwnProperty } = require('../utils');
/**
 * 分析模块对应的AST语法树
 * @param {*} ast 语法树
 * @param {*} code 源代码
 * @param {*} module 模块实例
 */
function analyse(ast, code, module) {
  //开始第1轮循环 找出本模块导入导出了哪些变量  不会递归遍历
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _included: { value: false, writable: true }, //表示这条语句默认不包括在输出结果里
      _module: { value: module }, //指向它自己的模块
      //这是这个语句自己对应的源码
      _source: { value: code.snip(statement.start, statement.end) },
      _dependsOn: { value: {} }, //依赖的变量
      _defines: { value: {} }, //存放本语句定义了哪些变量
      _modifies: { value: {} } //存放本语句修改哪些变量
    });
    //找出导入了哪些变量?
    if (statement.type === 'ImportDeclaration') {
      //获取导入的模块的相对路径
      let source = statement.source.value; //./msg
      // statement.specifiers 就是import导入的哪些变量名字组成的数组
      statement.specifiers.forEach((specifier) => {
        let importName = specifier.imported.name; //导入的变量名
        let localName = specifier.local.name; //当前模块的变量名
        // 没有使用as 重命名的情况下两个变量的值是一样的importName，localName
        // 当前模块内导入的变量名localName来自于source模块导出的importName变量
        module.imports[localName] = { source, importName };
      });
    } else if (statement.type === 'ExportNamedDeclaration') {
      const declaration = statement.declaration;
      if (declaration && declaration.type === 'VariableDeclaration') {
        const declarations = declaration.declarations;
        declarations.forEach((variableDeclarator) => {
          //var a=1,b=2,c=3;
          const localName = variableDeclarator.id.name;
          const exportName = localName; //age age
          module.exports[exportName] = { localName };
        });
      }
    }
  });
  //开始第2轮循环 创建作用域链 ，递归遍历语法树
  //需要知道本模块内用到了哪些变量，用到的变量留下，没用到不管了
  //我还得知道这个变量是局部变量，还是全局变量
  //一上来创建顶级作用域
  let currentScope = new Scope({ name: '模块内的顶级作用域' });
  ast.body.forEach((statement) => {
    function addToScope(name, isBlockDeclaration) {
      //是否块级变量
      currentScope.add(name, isBlockDeclaration); //把此变量名添加到当前作用域的变量数组中
      //如果说当前的作用域没有父作用域了，说它就是顶级作用域，那此变量就是顶级变量
      if (
        !currentScope.parent ||
        //如果当前的作用域(BlockStatement)是块级作用域，并且变量声明不是块级声明，是var
        (currentScope.isBlock && !isBlockDeclaration)
      ) {
        //表示此语句定义了一个顶级变量 IfStatement._defines['age']=true
        statement._defines[name] = true;
        //此顶级变量的定义语句就是这条语句
        module.definitions[name] = statement;
      }
    }
    function checkForReads(node) {
      if (node.type === 'Identifier') {
        //表示当前这个语句依赖了node.name这个变量
        statement._dependsOn[node.name] = true;
      }
    }
    function checkForWrites(node) {
      function addNode(node) {
        const { name } = node; //name age
        statement._modifies[name] = true; //表示此语句修改了name这个变量
        //module.modifications对象 属性是变量名 值是一个修改语句组成的数组
        if (!hasOwnProperty(module.modifications, name)) {
          module.modifications[name] = [];
        }
        //存放此变量对应的所有的修改语句
        module.modifications[name].push(statement);
      }
      if (node.type === 'AssignmentExpression') {
        addNode(node.left);
      } else if (node.type === 'UpdateExpression') {
        addNode(node.argument);
      }
    }
    walk(statement, {
      enter(node) {
        checkForReads(node);
        checkForWrites(node);
        let newScope;
        switch (node.type) {
          case 'FunctionDeclaration':
          case 'ArrowFunctionDeclaration':
            addToScope(node.id.name); //把函数名添加到当前的作用域变量中
            const names = node.params.map((param) => param.name);
            newScope = new Scope({
              name: node.id.name,
              parent: currentScope, //当创建新的作用域的时候，父作用域就是当前作用域
              names,
              isBlock: false //函数创建的不是一个块级作用域
            });
            break;
          case 'VariableDeclaration':
            node.declarations.forEach((declaration) => {
              if (node.kind === 'let' || node.kind === 'const') {
                addToScope(declaration.id.name, true);
              } else {
                addToScope(declaration.id.name);
              }
            });
            break;
          case 'BlockStatement':
            newScope = new Scope({ parent: currentScope, isBlock: true });
            break;
          default:
            break;
        }
        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope });
          currentScope = newScope;
        }
      },
      leave(node) {
        //如果当前节点有有_scope,说明它前节点创建了一个新的作用域，离开此节点的时候，要退出到父作用域
        if (Object.hasOwnProperty(node, '_scope')) {
          currentScope = currentScope.parent;
        }
      }
    });
  });
}
module.exports = analyse;
```

walk.js:

```js
function walk(astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}
function visit(node, parent, enter, leave) {
  if (enter) {
    enter(node, parent);
  }
  const keys = Object.keys(node).filter((key) => typeof node[key] === 'object');
  keys.forEach((key) => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach((val) => {
        visit(val, node, enter, leave);
      });
    } else if (value && value.type) {
      visit(value, node, enter, leave);
    }
  });
  if (leave) {
    leave(node, parent);
  }
}
module.exports = walk;
```



## rollup 插件

启动脚本：

debugger.js

```js
import { rollup, watch } from 'rollup';
import inputOptions from './rollup.config.js';
(async function () {
  //打包阶段
  const bundle = await rollup(inputOptions);
  //生成阶段
  await bundle.generate(inputOptions.output);
  //写入阶段
  await bundle.write(inputOptions.output);
  /* 
    const watcher = watch(inputOptions);
    watcher.on('event', event => {
      console.log(event);
    });
    setTimeout(() => {
      watcher.close();
    }, 1000); */
  //关闭阶段
  await bundle.close();
})();
```

rollup.config.js

```js
export default {
  input: './src/index.js',
  output: {
    dir: 'dist'
  }
};
```

package.json

```json
{
  "type": "module",
  "script": {
    "build": "rollup -c"
  }
}
```

**插件**

- [Rollup 插件](https://rollupjs.org/guide/en/#plugins-overview)是一个对象或者一个函数返回一个对象（对象的属性在rollup内部又分为： 属性，构建钩子，输出生成钩子等），该对象具有的属性或者方法（其实就是 rollup 的钩子函数）将在下面介绍。
- 插件允许通过自定义 Rollup 的行为来扩展其功能，例如，在打包之前转换代码，或在 `node_modules` 文件夹中查找第三方模块。
- [插件列表](https://github.com/rollup/awesome)

![image-20241107174212470](D:\learn-notes\工程化\images\image-20241107174212470.png)

**插件规范**

- 应该有一个清晰的名称，带有`rollup-plugin-prefix`
- 在 package.json 中包含插件关键字
- 尽可能使用异步方法。
- 如果合适的话，确保插件输出正确的`sourcemap`
- 如果插件使用“虚拟模块”（例如，用于辅助功能），请在模块 ID 前面加上`\0`。这会阻止其他插件尝试处理它



**插件函数返回的对象上的属性**

- name，插件的名称，用于错误消息和警告，值为字符串。
- version，插件的版本，用于插件间通信



**简单的插件示例：**

以下插件将拦截对 `virtual-module` 的任何导入，而不访问文件系统。例如，如果希望在浏览器中使用 Rollup，这是必要的。甚至可以用来替换入口点，如示例所示。

```js
// @filename: rollup-plugin-my-example.js
export default function myExample () {
  return {
    name: 'my-example', // this name will show up in logs and errors
    resolveId ( source ) {
      if (source === 'virtual-module') {
        // this signals that Rollup should not ask other plugins or check
        // the file system to find this id
        return source;
      }
      return null; // other ids should be handled as usually
    },
    load ( id ) {
      if (id === 'virtual-module') {
        // the source code for "virtual-module"
        return 'export default "This is virtual!"';
      }
      return null; // other ids should be handled as usually
    }
  };
}

// @filename: rollup.config.js
import myExample from './rollup-plugin-my-example.js';
export default ({
  input: 'virtual-module', // resolved by our plugin
  plugins: [myExample()],
  output: [{
    file: 'bundle.js',
    format: 'es'
  }]
});
```



单个的钩子不仅可以是函数，也可以是对象。在这种情况下，实际的钩子函数（或 `banner`、`footer`、`intro`、`outro` 的值）必须指定为 `handler`。rollup针对各个hook，提供了额外的可选属性来改变钩子的执行：

- order: "pre" | "post" | null

  如果有几个插件实现了这个钩子，可以指定这个插件在其他插件之前运行（`"pre"`），之后运行（`"post"`），或按用户指定的位置运行（不指定值或 `null`）。

  ```js
  export default function resolveFirst() {
      return {
          name: 'resolve-first',
          // resolveId 在这里就是一个对象，因为需要提供额外的数据
          resolveId: {
              order: 'pre',
              handler(source) {
                  if (source === 'external') {
                      return { id: source, external: true };
                  }
                  return null;
              }
          }
      };
  }
  
  export default function resolveFirst() {
      return {
          name: 'resolve-first',
          // resolveId 在这里就是一个函数
          resolveId(source) {
              if (source === 'external') {
                  return { id: source, external: true };
              }
              return null;
          }
      };
  }
  ```

- sequential: boolean

  设置这个hook不与其他插件的同名钩子并行运行。只能用于并行钩子。使用此选项会使 Rollup 等待所有先前插件的结果，然后执行该插件的钩子，然后再并行运行剩余的插件。例如，当你有插件 A、B、C、D、E 都实现了同一个并行钩子，而中间的插件 C 设置了 `sequential: true`，那么 Rollup 会首先并行运行 A 和 B，然后单独运行 C，最后再并行运行 D 和 E。

  当你需要在不同的 `writeBundle` 钩子中运行多个命令行工具，并且这些工具相互依赖时，这一点非常有用（注意，如果可能的话，建议在顺序执行的 `generateBundle` 钩子中添加或删除文件，因为这样更快，适用于纯内存构建，并允许其他内存构建插件看到这些文件）。你可以将此选项与 `order` 结合使用以进行额外的排序。

  ```js
  import path from 'node:path';
  import { readdir } from 'node:fs/promises';
  
  export default function getFilesOnDisk() {
  	return {
  		name: 'getFilesOnDisk',
  		writeBundle: {
  			sequential: true,
  			order: 'post',
  			async handler({ dir }) {
  				const topLevelFiles = await readdir(path.resolve(dir));
  				console.log(topLevelFiles);
  			}
  		}
  	};
  }
  ```

  



**Build Hooks**

- 构建钩子集合是一个个的回调函数，目的是与构建过程交互
  - 钩子是在构建的不同阶段被调用的函数
  - 钩子可以影响构建的运行方式，提供关于构建的信息，或者在构建完成后修改构建
  - 有不同种类的钩子
    - `async` 钩子可以返回`Promise`，但是这个promise的结果必须符合rollup的要求；如果不返回promise，钩子将被标记为`sync`（默认 async）
    - `first` 如果有几个插件实现了这个钩子，钩子会按顺序运行，直到钩子返回一个非`null`或 `undefined`，那其他插件的这个钩子函数将不再执行，而转而执行流程下的下一个钩子函数
    - `sequential` 如果几个插件实现了这个钩子，那么它们都将按照指定的插件顺序运行。如果一个钩子是异步的，那么这种类型的后续钩子将等待当前钩子被解析
    - `parallel` 如果多个插件实现了这个钩子，那么它们都将按照指定的插件顺序运行。如果一个钩子是异步的，那么这类后续钩子将并行运行，而不是等待当前钩子
  - `Build Hooks`在构建阶段运行，该阶段由`rollup.rollup(inputOptions)`触发
  - 它们主要负责在`rollup`处理输入文件之前定位、提供和转换输入文件
  - 构建阶段的第一个钩子是`options`，最后一个钩子总是`buildEnd`
  - 如果出现生成错误，将在此之后调用`closeBundle`

下图build阶段的hooks说明图：

<img src="D:\learn-notes\工程化\images\image-20241107181623466.png" alt="image-20241107181623466" style="zoom:150%;" />



plugins\rollup-plugin-build.js

```js
function build(pluginOptions) {
    return {
        name: 'build', //插件的名字
        /**
     *inputOptions对象中的值必须是下面这些：acorn, acornInjectPlugins, cache, context, experimentalCacheExpiry, external, inlineDynamicImports, input, makeAbsoluteExternalsRelative, manualChunks, maxParallelFileOps, maxParallelFileReads, moduleContext, onwarn, perf, plugins, preserveEntrySignatures, preserveModules, preserveSymlinks, shimMissingExports, strictDeprecations, treeshake, watch
     */
        async options(inputOptions) {
            console.log('options');
            //此钩子一般不使用 因为它是在汇总配置之前执行的
            return { ...inputOptions };
        },

        async buildStart(inputOptions) {
            //如果想读取所有的插件的配置内容的汇总，需要buildStart
            console.log('buildStart');
            //inputOptions.input = ['./src/index2.js']
        },

        //正常来说，rollup标准行为，如果是相对模块路径./hello.js默认行为是找到这个文件在硬盘上的绝对路径传给load里的id参数
        async resolveId(source, importer) {
            console.log('resolveId', source, importer);//source=virtual-module
            if (source === 'virtual-module') {
                return source;//first 只要有一个插件钩子返回了不为空的值，后面插件钩子不走了，默认行为也不走了
            }
        },
        //load默认行为是用fs模块读取文件内容  一般来说id是模块的绝对路径
        //如果有插件的钩子返回了内容，后面的钩子以下默认行为都不要了
        async load(id) {
            if (id === 'virtual-module') {
                return `export default "virtual";`;
            }
            console.log('load', id);
        },

        async shouldTransformCachedModule({ id, code, ast }) {
            console.log('shouldTransformCachedModule', id);
            return false; //每次从缓存在加载都需要重新转换
        },

        async transform(code, id) {
            console.log('transform');
        },
		  // AST 语法树分析
        async moduleParsed(moduleInfo) {
            console.log('moduleInfo');
        },

        async resolveDynamicImport(specifier, importer) {
            console.log('resolveDynamicImport', specifier, importer);
            //return { id: 'C:/aproject/webpack202208/13.rollup/src/msg.js' };
        },

        async buildEnd() {
            console.log('buildEnd');
        }
    };
}

export default build;
```

rollup.config.js

```diff
+import build from './plugins/rollup-plugin-build.js';
export default {
  input: "./src/index.js",
  output: [{
    dir: 'dist',
  }],
  plugins: [
+   build()
  ]
} 
```



**钩子函数的调用时机问题：**

在编写的 Rollup 插件中，插件返回的对象中的每个 hook 方法并不会在加载到任何模块代码时都被调用一次。每个 hook 方法会在 Rollup 构建过程的不同阶段被调用，具体调用时机取决于 Rollup 构建流程中的特定事件。

比如，在插件中实现了 `options` 方法和 `buildStart` 方法。`options` 方法只在配置选项解析完成后被调用一次，而 `buildStart` 方法在每次构建开始时被调用一次。它们不会在加载每个模块时都被调用。

与之对比，一些其他的钩子，如`load`和`transform`，确实会对每个模块调用。`load`钩子在Rollup需要加载模块源代码时调用，`transform`钩子用于在模块的源代码上应用转换。这些钩子允许插件对模块的加载和处理进行干预。

在项目中，如果有两个 JavaScript 文件，一个是打包的入口文件，另一个是入口文件所依赖的文件，那么在编写的 Rollup 插件中，以下方法会被调用多次：

1. `resolveId(source, importer)`：该方法在解析模块路径时被调用。对于每个模块文件，包括入口文件和它所依赖的文件，都会调用该方法来解析模块的路径。
2. `load(id)`：该方法在加载模块代码时被调用。对于每个模块文件，包括入口文件和它所依赖的文件，都会调用该方法来加载模块的代码。
3. `transform(code, id)`：该方法在模块代码转换阶段被调用。对于每个模块文件，包括入口文件和它所依赖的文件，都会调用该方法来转换模块的代码。
4. `buildEnd(error)`：该方法在构建完成时被调用。在整个构建过程结束时，只会调用一次。

需要注意的是，每个方法的调用次数取决于你的项目的具体配置和模块依赖关系。如果在插件的配置选项中指定了多个入口文件，那么这些方法可能会被调用多次，每个入口文件都会触发一次相应的调用。



### 钩子函数介绍

#### options

- [big-list-of-options](https://rollupjs.org/guide/en/#big-list-of-options)

| 字段          | 值                                              |      |
| :------------ | :---------------------------------------------- | ---- |
| Type          | (options: InputOptions) => InputOptions \| null | null |
| Kind          | async, sequential（异步串行）                   |      |
| Previous Hook | 这是构建阶段的第一个钩子                        |      |
| Next Hook     | buildStart                                      |      |

- 这个钩子是在Rollup读取并解析配置文件后、开始构建之前调用的。它允许插件修改或替换Rollup的选项(`rollup.rollup` 的选项对象)。`options`钩子只会被调用一次，而不是对每个模块调用一次。它的主要用途是允许插件修改构建的初始选项。操作（修改或者新增）的必须是rollup预设好的那些字段
- 返回`null`的话rollup不会替换任何配置的内容
- 如果需要阅读`options`，建议使用`buildStart`钩子，因为**options**钩子函数的InputOptions并不是最终的options对象， 因为`buildStart`钩子在所有 `options` 钩子的转换完成后可以访问选项
- 与 `onLog` 钩子类似，这个钩子在 Rollup 完全配置之前运行，因此无法访问大多数插件上下文实用函数。唯一支持的属性是 `this.meta` 以及用于日志和错误处理的 `this.error`、`this.warn`、`this.info` 和 `this.debug`
- 一般不使用这个hook



#### buildStart

| 字段          | 值                                                           |
| :------------ | :----------------------------------------------------------- |
| Type          | (options: InputOptions) => void  还有一种是在输出阶段的钩子函数接受的outputOptions |
| Kind          | async, parallel（并行）                                      |
| Previous Hook | options                                                      |
| Next Hook     | resolveId并行解析每个入口点                                  |

- 这个钩子在Rollup开始构建过程、解析模块之前被调用（在每次 `rollup.rollup` 构建时调用）。它提供了一个时机来执行一些准备工作，比如验证插件的选项、初始化插件需要的资源等。`buildStart`钩子也是只被调用一次，它不会对每个模块都调用，因为它标志着构建过程的开始
- 每次`rollup.rollup build`都要调用此钩子
- 当您需要访问传递给rollup的选项时，建议使用这个钩子
- 因为它考虑了所有`options`钩子的转换，还包含未设置选项的默认值
- 这里的InputOptions是输入选项，不包含配置文件中的输出配置项，比如output配置项

build\plugin-buildStart.js

```js
export default function buildStart() {
  return {
    name: 'buildStart',
    buildStart(InputOptions) {
      console.log('buildStart', InputOptions);
      // InputOptions是输入选项，不包含配置文件中的输出配置项，比如output配置项
    }
  };
}
```



#### resolveId

| 字段          | 值                                                           |       |      |
| :------------ | :----------------------------------------------------------- | ----- | ---- |
| Type          | ResolveIdHook                                                | false | null |
| Kind          | async, first                                                 |       |      |
| Previous Hook | `buildStart`(如果我们正在解析入口点)，`moduleParsed`（如果我们正在解析导入），或者作为`resolveDynamicImport`的后备方案。此外，这个钩子可以在构建阶段通过调用插件钩子触发。`emitFile`发出一个入口点，或在任何时候通过调用此。`resolve`可手动解析id |       |      |
| Next Hook     | 如果解析的`id`尚未加载，则`load`，否则`buildEnd`             |       |      |

```ts
type ResolveIdHook = (
	source: string,   // source：本模块的路径
	importer: string | undefined,   // importer导入本模块的那个模块的路径
	options: {
		attributes: Record<string, string>;
		custom?: { [plugin: string]: any };
		isEntry: boolean;   // 本模块是否是入口模块
	}
) => ResolveIdResult;

type ResolveIdResult = string | null | false | PartialResolvedId;

interface PartialResolvedId {
	id: string;
	external?: boolean | 'absolute' | 'relative';
	attributes?: Record<string, string> | null;
	meta?: { [plugin: string]: any } | null;
	moduleSideEffects?: boolean | 'no-treeshake' | null;
	resolvedBy?: string | null;
	syntheticNamedExports?: boolean | string | null;
}
```



- 定义自定义解析器

- 解析程序可用于定位第三方依赖关系等。这里`source`是导入语句中所写的导入对象，即来源就是 `"../bar.js"`

  ```js
  import { foo } from '../bar.js';
  ```

- `importer`是导入模块的完全解析id，对于上面的代码，也就是引入bar.js模块的当前模块的文件绝对路径

- 在解析**入口**点时，`importer`通常是undefined，而source则是入口文件的绝对路径

- 这里的一个例外是通过`this.emitFile`生成的入口点。在这里，您可以提供一个`importer`参数，rollup内部提供的工具函数this.emitFile

- 对于这些情况，`isEntry`选项将告诉您，我们是否正在解析用户定义的入口点、发出的块，或者是否为此提供了`isEntry`参数。解析上下文函数

- 例如，您可以将其用作为入口点定义自定义代理模块的机制。以下插件将代理所有入口点以注入`polyfill`导入

- 返回`null`将遵循其他`resolveId`函数，最终遵循默认的解析行

- 返回`false`信号，表示源应被视为`外部模块`，不包括在`bundle`中 `

- resolveId钩子函数的默认行为是，如果引入的是相对路径开头的其他模块，比如:'./，../'，那么该钩子函数默认返回该模块在硬盘上的绝对路径，并传递给load钩子函数作为第一个参数

- 只要有一个插件的resolvedId钩子返回了不为空的值，后面插件的resolvedId钩子就不再执行，默认的resolvedId也不再执行



**案例：**

build\plugin-polyfill.js

针对每一个入口模块自动引入polyfill，并将该polyfill包中的代码打包到输出文件中。

就是在入口模块中插入一行代码：import 'polyfill' ， 同时这个包的代码不会被tree-shaking掉。

原理是通过代理模块实现的。

```js
const PROXY_SUFFIX = "?inject-polyfill";
const POLYFILL_ID = "\0polyfill"; //在polyfill id前面加上\0，告诉其他插件不要尝试加载或转换它
function polyfill() {
  return {
    name: "inject-polyfill", //插件的名字
    async resolveId(source, importer, options) {
      if (source === POLYFILL_ID) {
        // 对于polyfills，应始终考虑副作用
        // 否则，使用`treeshake.moduleSideEffects:false`可能会阻止包含polyfill，
        // 就是说明这个被引入的模块包含副作用函数，不要被tree-shaking所去除掉
        return { id: POLYFILL_ID, moduleSideEffects: true };
      }

      // options.isEntry为true表示该模块是入口模块
      if (options.isEntry) {
        //PluginContext.resolve将导入解析为模块ID（即文件名）
        //查找模块块的ID或者说文件名或者说此模块的文件的绝对路径
        // this.resolve会调用注册给rollup的所有插件中的resolveId钩子函数，而skipSelf为true表示跳过自己这个钩子函数，不然会死循环
        const resolution = await this.resolve(source, importer, {
          skipSelf: true,
          ...options,
        });
        //如果此模块无法解析，或者是外部模块,要以直接返回，rollup会报错或进行external提示
        if (!resolution || resolution.external) {
          return resolution;
        }
        //加载模块内容
        //1.读取模块内容 触发load钩子 2.转换模块内容 触发transform钩子 3.模块解析 ast 分析ast, moduleParsed
        //因为我们想把这个模块设置为有副作用,不要实现tree shaking
        //PluginContext.load的一个方法,内部会负责读取文件,
        //1.读取文件 的时候会触发load这个钩子
        //2.转换文件内容 触发transform这个钩子
        //3.AST语法解析找import依赖  触发moduleParsed这个钩子
        //仅在第一次加载时添加。因此我们在这里触发加载。
        const moduleInfo = await this.load(resolution);
        //表示此模块有副作用,不要tree shaking
        moduleInfo.moduleSideEffects = true;
        //C:\\aproject\\webpack202208\\13.rollup\\src\\index.js?inject-polyfill
        return `${resolution.id}${PROXY_SUFFIX}`;
      }
      return null;
    },
    //这是插件时的一个钩子
    load(id) {
      //读取模块的内容 默认行为是读硬盘上的文件
      if (id === POLYFILL_ID) {
        // 替换为实际的polyfill import '@babel/polyfill'
        return `console.log('例子代码')`;
      }
      //如果是一个需要代理的入口,特殊 处理 下,生成一个中间的代理模块
      if (id.endsWith(PROXY_SUFFIX)) {
        //C:\\aproject\\webpack202208\\13.rollup\\src\\index.js
        const entryId = id.slice(0, -PROXY_SUFFIX.length);

        const { hasDefaultExport } = this.getModuleInfo(entryId);
        let code = `
            import ${JSON.stringify(POLYFILL_ID)};
            import ${JSON.stringify(entryId)}
        `;
        //命名空间重新导出不会重新导出默认值，因此我们需要在这里进行特殊处理
        if (hasDefaultExport) {
          code += `export { default } from ${JSON.stringify(entryId)};`;
        }
        //如果钩子有返回值了,不去走后面的load钩子了,也不会读硬盘上的文件了 webpack loader pitch
        return code;
      }
      return null;
    },
  };
}
/* 
let plugins = [{
  name: 'plugin1',
  resolveId: (source, importer) => {
    resolve()
  }
}, { resolveId: (source, importer) => 'yyy' }]
function resolve(source, importer, options) {
  //在resolve的过程 也会遍历所有的插件的resolveId方法
  let resolution;
  for (let i = 0; i < plugins.length; i++) {
    if (options.skipSelf && plugins[i].name === 'plugin1') continue;
    const resolveId = plugins[i].resolveId;
    if (resolveId) {
      resolution = resolveId(source, importer);
      if (resolution) return resolution;
    }
  }
  return { id: path.resolve(path.dirname(importer), source) };
} */

export default polyfill;

/**
 * resolveId 查找引入的模块的绝对路径
 * entry  ./src/index.js
 * 
 * resolution
  {
    external: false,//是否是外部模块
    id: 'C:\\aproject\\webpack202208\\13.rollup\\src\\index.js',//此模块的绝对路径
    moduleSideEffects: true,//模块是否有副作用，有副作用的话禁 用tree shaking 
  }

  https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
check-is-array (imported by src/index.js)
  默认情况下,rollup只认相对路径，不认识第三方模块。如果遇到第三方模块，会认为是外部依赖

  webpack  
  load=读取模块内容 
  transform 转换模块内容 类似于webpack里的loader
  moduleParsed 把内容转成AST并解析import依赖
 */

```



#### load

| 字段          | 值                                                           |      |
| :------------ | :----------------------------------------------------------- | ---- |
|               | (id) => string                                               | null |
| Kind          | async, first                                                 |      |
| Previous Hook | 解析加载id的`resolveId`或`resolveDynamicImport`。此外，这个钩子可以在任何时候从插件钩子中通过调用`this.load`来触发预加载与id对应的模块 |      |
| Next Hook     | `transform`可在未使用缓存或没有使用相同代码的缓存副本时转换加载的文件，否则应使用`TransformCachedModule` |      |

- 返回`null`会推迟到其他加载函数（最终是从文件系统加载的默认行为）

- 为了防止额外的解析开销，例如这个钩子已经使用了这个。parse出于某种原因，为了生成AST，这个钩子可以选择性地返回`{code，AST，map}`对象。`ast`必须是标准的`ESTree ast`，每个节点都有开始和结束属性。如果转换不移动代码，可以通过将map设置为null来保留现有的sourcemaps。否则，您可能需要生成源映射。请参阅关于源代码转换的部分

- 当在Rollup插件中实现了`load`这个钩子后，它会为项目中的每个模块（通常是每个`.js`文件，或者是通过其他插件能够处理的文件类型）调用一次。`load`钩子的主要作用是告诉Rollup如何读取和加载模块的内容，**它为插件提供了一个机会来直接提供模块的内容，而不是让Rollup从文件系统中读取。**

  当Rollup尝试加载一个模块时，它会按照插件数组中的顺序调用这些插件的`load`钩子，直到某个插件返回非`null`或非`undefined`的结果。这意味着如果你的插件返回了模块的内容，Rollup会使用这个返回值作为模块的内容，而不会继续调用后续插件的`load`钩子，也不会从文件系统中加载该模块。

  这个机制使得`load`钩子非常适合于以下用途：

  - 直接提供某些模块的内容，而不是从磁盘读取。
  - 实现虚拟模块，即在构建过程中动态生成的模块。
  - 代理某些模块的加载，可能是为了添加一些特定的处理逻辑，或者改变模块的原始路径等。

  需要注意的是，虽然`load`钩子对每个模块都会调用，但是插件开发者需要确保他们的`load`实现逻辑正确处理不同的模块路径，以避免不必要的处理逻辑应用于所有模块。



####  transform

| 字段          | 值                                                           |
| :------------ | :----------------------------------------------------------- |
| Type          | (code: string, id: string) => TransformResult                |
| Kind          | async, sequential                                            |
| Previous Hook | `load` 当前处理的文件的位置。如果使用了缓存，并且有该模块的缓存副本，那么如果插件为该钩子返回true，则应`shouldTransformCachedModule` |
| Next Hook     | `moduleParsed` 一旦文件被处理和解析，模块就会被解析          |

```ts
type TransformResult = string | null | Partial<SourceDescription>;

interface SourceDescription {
	code: string;
	map?: string | SourceMap;
	ast?: ESTree.Program;
	attributes?: { [key: string]: string } | null;
	meta?: { [plugin: string]: any } | null;
	moduleSideEffects?: boolean | 'no-treeshake' | null;
	syntheticNamedExports?: boolean | string | null;
}
```



- 可用于转换单个模块
- 为了防止额外的解析开销，例如这个钩子已经使用了`this.parse`生成AST
- 这个钩子可以选择性地返回`{code，AST，map}`对象
- ast必须是标准的ESTree ast，每个节点都有`start`和`end`属性
- 如果转换不移动代码，可以通过将map设置为null来保留现有的sourcemaps。否则，您可能需要生成源映射。请参阅关于源代码转换的部分

```js
npm install rollup-pluginutils @rollup/plugin-babel @babel/core @babel/preset-env  -D
```



plugins\rollup-plugin-babel.js：

```js
import { createFilter } from 'rollup-pluginutils'
import babel from '@babel/core'

function plugin(pluginOptions = {}) {
  const defaultExtensions = ['.js', '.jsx']
  const { exclude, include, extensions = defaultExtensions } = pluginOptions;
  const extensionRegExp = new RegExp(`(${extensions.join('|')})$`)
  // createFilter 工具方法，返回一个过滤器函数
  const userDefinedFilter = createFilter(include, exclude);
  const filter = id => extensionRegExp.test(id) && userDefinedFilter(id);
  return {
    name: 'babel',
    async transform(code, id) {
        // 并不是所有的文件都需要babel去处理的，所以这里就是在过滤掉那些不需要转的文件类型
      if (!filter(id)) return null;
      let result = await babel.transformAsync(code, pluginOptions.babel);  // 将源代码转为抽象语法树等信息
      return result
    }
  }
}
export default plugin

/* const userDefinedFilter = createFilter('./src', './src');
const result = userDefinedFilter('./src');
//exclude优先级更高
console.log('result', result); */
```



#### shouldTransformCachedModule

| 字段          | 值                                                           |
| :------------ | :----------------------------------------------------------- |
| Type          | ShouldTransformCachedModuleHook                              |
| Kind          | async, first                                                 |
| Previous Hook | `load` 加载缓存文件以将其代码与缓存版本进行比较的位置        |
| Next Hook     | `moduleParsed` if no plugin returns true, otherwise `transform`. |

```ts
type ShouldTransformCachedModuleHook = (options: {
	ast: AstNode;
	code: string;
	id: string;
	meta: { [plugin: string]: any };
	moduleSideEffects: boolean | 'no-treeshake';
	syntheticNamedExports: boolean | string;
}) => boolean | NullValue;
```



- 如果使用了`Rollup`缓存（例如，在监视模式下或通过JavaScript API显式使用），如果在加载钩子之后，加载的代码与缓存副本的代码相同，则Rollup将跳过模块的转换钩子
- 为了防止这种情况，丢弃缓存的副本，而是转换一个模块，插件可以实现这个钩子并返回true。
- 这个钩子还可以用来找出缓存了哪些模块，并访问它们缓存的元信息
- 如果一个插件没有返回true，Rollup将触发其他插件的这个钩子，否则将跳过所有剩余的插件。

```js
npx rollup -c -w
shouldTransformCachedModule
transform
moduleParsed

shouldTransformCachedModule
moduleParsed
```



### 插件上下文对象

Plugin Context（this）

大多数钩子的上下文对象，其中一些常用的属性或者方法如下：

#### this.resolve

```ts
type Resolve = (
	source: string,
	importer?: string,
	options?: {
		skipSelf?: boolean;
		isEntry?: boolean;
		attributes?: { [key: string]: string };
		custom?: { [plugin: string]: any };
	}
) => ResolvedId;


interface ResolvedId {
	id: string; // the id of the imported module  本模块的结对路径
	external: boolean | 'absolute'; // 是否是外部模块 is this module external, "absolute" means it will not be rendered as relative in the module
	attributes: { [key: string]: string }; // import attributes for this import
	meta: { [plugin: string]: any }; // custom module meta-data when resolving the module
	moduleSideEffects: boolean | 'no-treeshake'; // are side effects of the module observed, is tree-shaking enabled 模块中的代码是否有副作用，以决定是否能tree-shaking
	resolvedBy: string; // which plugin resolved this module, "rollup" if resolved by Rollup itself
	syntheticNamedExports: boolean | string; // does the module allow importing non-existing named exports
}
```



**自己模拟this.resolve工具方法**

```js
let plugins = [{
  name: 'plugin1',
  resolveId: (source, importer) => {
    return 'xxx'
  }
}, { resolveId: (source, importer) => 'yyy' }]

function resolve(source, importer, options) {
  //在resolve的过程 也会遍历所有的插件(包括自己)的resolveId方法
  let resolution;
  for (let i = 0; i < plugins.length; i++) {
    if (options.skipSelf && plugins[i].name === 'plugin1') continue;
    const resolveId = plugins[i].resolveId;
    if (resolveId) {
      resolution = resolveId(source, importer);
      if (resolution) return resolution;
    }
  }
  return { id: path.resolve(path.dirname(importer), source) };
}
```





`this.resolve` 方法在 Rollup 插件中用于解析导入路径到模块 ID（即文件名），并确定导入是否应被视为外部模块。这个方法非常有用，因为它允许插件在处理导入时进行自定义解析，从而实现更复杂的构建逻辑。

**`this.resolve` 方法的用途**

1. **解析导入路径**：
   - `this.resolve` 可以将一个模块的导入路径解析为一个绝对路径或模块 ID。
   - 这对于处理非标准的导入路径、别名、或动态导入非常有用。
2. **确定外部模块**：
   - `this.resolve` 可以返回一个对象，其中包含 `id` 和 `external` 属性。
   - 如果 `external` 属性为 `true` 或 `"absolute"`，Rollup 会将该模块视为外部模块，不会将其包含在最终的打包结果中。
3. **传递额外信息**：
   - `this.resolve` 可以接受额外的参数，如 `isEntry`、`custom` 和 `attributes`，这些参数可以传递给处理解析请求的其他插件，以便它们可以根据这些信息做出决策。

**方法签名**

```js
this.resolve(
  source,          // 导入路径字符串
  importer,        // 导入者的路径字符串（可选）
  options,         // 选项对象（可选）
  callback         // 回调函数（可选）
)
```

**参数说明**

- **source** (`string`)：要解析的导入路径。
- **importer** (`string` | `undefined`)：导入者的路径。如果没有导入者，可以传入 `undefined`。
- options (object | undefined)：可选的选项对象，包含以下属性：
  - **isEntry** (`boolean`)：是否是入口模块。
  - **custom** (`object`)：特定于插件的选项。
  - **attributes** (`object`)：导入断言属性。
- **callback** (`function` | `undefined`)：回调函数，用于异步解析。如果使用同步解析，可以省略。

**返回值**

- **Promise**：如果使用异步解析，返回一个 Promise，解析结果是一个对象。
- **Object**：如果使用同步解析，直接返回一个对象。

**解析结果对象**

- **id** (`string`)：解析后的模块 ID。
- **external** (`boolean` | `"absolute"`)：是否为外部模块。
- **meta** (`object`)：附加的元数据信息。
- **resolvedBy** (`string`)：解析该模块的插件名称。

**示例**

以下是一个简单的示例，展示了如何在插件中使用 `this.resolve` 方法：

```js
export default function myPlugin() {
  return {
    name: 'my-plugin',

    resolveId(source, importer) {
      // 同步解析
      if (source === 'my-virtual-module') {
        return {
          id: '/path/to/my-virtual-module.js',
          external: false,
          meta: { type: 'virtual' }
        };
      }

      // 异步解析
      return this.resolve(source, importer, { isEntry: false, custom: { key: 'value' }, attributes: { type: 'json' } })
        .then(result => {
          if (result.id) {
            // 进一步处理解析结果
            return result;
          }
          return null; // 解析失败
        });
    }
  };
}
```

**总结**

`this.resolve` 方法在 Rollup 插件中用于解析导入路径，并确定导入是否应被视为外部模块。它允许插件在处理导入时进行自定义解析，从而实现更复杂的构建逻辑。通过传递额外的选项和使用回调函数，可以实现同步和异步解析。



#### 外部模块

在 Rollup 构建过程中，**外部模块**是指那些不会被包含在最终打包输出中的模块。这些模块通常已经在用户的环境中可用，例如通过 `node_modules` 安装的第三方库，或者全局安装的模块，通过CDN引入。通过将模块标记为外部模块，Rollup 可以避免重复打包这些模块，从而减小最终输出文件的大小。

**外部模块的标识**

在 Rollup 中，可以通过以下几种方式将模块标记为外部模块：

1. **配置文件中的 `external` 选项**：

   - 在 Rollup 配置文件中，可以通过 `external` 选项指定哪些模块应该被视为外部模块。

   - 例如：

     ```js
     export default {
       input: 'src/index.js',
       output: {
         file: 'dist/bundle.js',
         format: 'cjs'
       },
       external: ['lodash', 'moment']
     };
     ```

   - 在这个例子中，`lodash` 和 `moment` 被标记为外部模块，不会被包含在最终的打包输出中。

2. **插件中的 `resolveId` 钩子**：

   - 在插件的 `resolveId` 钩子中，可以通过返回一个包含 `external` 属性的对象来标记模块为外部模块。

   - 例如：

     ```js
     export default function myPlugin() {
       return {
         name: 'my-plugin',
         resolveId(source, importer) {
           if (source === 'some-external-library') {
             return {
               id: 'some-external-library',
               external: true
             };
           }
           return null;
         }
       };
     }
     ```

   - 在这个例子中，`some-external-library` 被标记为外部模块。

**外部模块的行为**

1. **不包含在输出中**：
   - 标记为外部模块的模块不会被包含在最终的打包输出中。Rollup 会生成一个引用这些外部模块的导入语句。
2. **生成引用**：
   - 在生成的输出文件中，外部模块会被引用，而不是被内联。例如，如果 `lodash` 被标记为外部模块，生成的输出文件中会有类似 `require('lodash')` 的语句。
3. **环境依赖**：
   - 由于外部模块不会被包含在输出中，因此在运行生成的代码时，这些外部模块必须已经在环境中可用。例如，如果使用 `npm` 或 `yarn` 安装了这些外部模块，它们会在 `node_modules` 中找到。

**示例**

假设你有一个项目，使用了 `lodash` 和 `moment` 这两个第三方库。你希望这些库不被包含在最终的打包输出中，而是通过 `node_modules` 加载。你可以在 Rollup 配置文件中这样做：

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  external: ['lodash', 'moment'],
  plugins: [
    resolve(),
    commonjs()
  ]
};
```

生成的输出文件可能会类似于：

```js
const _ = require('lodash');
const moment = require('moment');

function myFunction() {
  console.log(_.capitalize('hello world'));
  console.log(moment().format());
}

module.exports = myFunction;
```

在这个例子中，`lodash` 和 `moment` 被标记为外部模块，因此它们不会被包含在 `bundle.js` 中，而是通过 `require` 语句引用。

**总结**

**外部模块**是指那些不会被包含在最终打包输出中的模块。通过在 Rollup 配置文件中使用 `external` 选项或在插件的 `resolveId` 钩子中返回 `external` 属性，可以将模块标记为外部模块。这样做可以减小最终输出文件的大小，并确保外部模块在运行时已经存在于环境中。



使用与 Rollup 相同的插件解析导入到模块 ID（即文件名），并确定导入是否应为外部模块。如果返回 `null`，表示 Rollup 或任何插件都无法解析该导入，但用户没有明确标记为外部模块。如果返回一个绝对的外部 ID，并且该 ID 在输出中应保持绝对路径（通过 `makeAbsoluteExternalsRelative` 选项或在 `resolveId` 钩子中显式选择），则 `external` 将为 `"absolute"` 而不是 `true`。

默认情况下，`skipSelf` 为 `true`，因此在解析时会跳过调用 `this.resolve` 的插件的 `resolveId` 钩子。当其他插件在处理原始 `this.resolve` 调用时也在它们的 `resolveId` 钩子中调用 `this.resolve` 并且源和导入者完全相同时，原始插件的 `resolveId` 钩子也会被跳过。这里的理由是，插件已经表明它在此时不知道如何解析特定的源和导入者的组合。如果你不希望这种行为，可以将 `skipSelf` 设置为 `false` 并自行实现无限循环预防机制（如有必要）。

你还可以通过 `custom` 选项传递特定于插件的选项，详见自定义解析器选项。

你在这里传递的 `isEntry` 值将传递给处理此调用的 `resolveId` 钩子，否则如果有导入者将传递 `false`，如果没有导入者将传递 `true`。

如果你传递一个对象作为 `attributes`，它将模拟解析带有断言的导入，例如 `attributes: {type: "json"}` 模拟解析 `import "foo" assert {type: "json"}`。这将传递给处理此调用的 `resolveId` 钩子，并最终可能成为返回对象的一部分。

在从 `resolveId` 钩子中调用此函数时，你应该始终检查是否有必要传递 `isEntry`、`custom` 和 `attributes` 选项。

`resolvedBy` 的值指的是哪个插件解析了此源。如果由 Rollup 自身解析，值将为 `"rollup"`。如果在插件的 `resolveId` 钩子中解析了此源，值将为插件的名称，除非它返回了一个显式的 `resolvedBy` 值。此标志仅用于调试和文档目的，不会被 Rollup 进一步处理。



## Output Generation Hooks

输出生成钩子可以提供关于生成的 bundle 的信息，并在构建完成后修改构建。它们的工作方式和类型与构建钩子相同，但会在每次调用 `bundle.generate(outputOptions)` 或 `bundle.write(outputOptions)` 时分别被调用。仅使用输出生成钩子的插件也可以通过输出选项传递，因此只会在特定的输出中运行。

输出生成阶段的第一个钩子是 `outputOptions`，最后一个钩子取决于输出生成的方式：如果通过 `bundle.generate(...)` 成功生成，则是 `generateBundle`；如果通过 `bundle.write(...)` 成功生成，则是 `writeBundle`；如果在输出生成过程中发生错误，则是 `renderError`。

此外，`closeBundle` 可以作为最后一个钩子被调用，但用户需要手动调用 `bundle.close()` 来触发它。

![image-20241107183043333](D:\learn-notes\工程化\images\image-20241107183043333.png)

![image-20241107183014525](D:\learn-notes\工程化\images\image-20241107183014525.png)

