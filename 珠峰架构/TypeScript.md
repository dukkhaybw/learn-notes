# TypeScript

**类型就是拥有一系列共同特征的数据组成的集合体，对于集合来说，最小的集合是空集，它不包含任何值，在 TS 中与之对应的类型是 never。第二小的集合是包含单个值的集合，如字面量类型。**

TS 包含 JS 的所有新旧语法特性，并引入了**变量类型**（类型校验），让 JavaScript 从**动态类型**的语言变为了**静态类型**的语言。

TS 优点：

- **类型系统的语法提示**

- **避免开发过程中因为没有考虑全面变量可能的值的类型而报错**

- **编译阶段类型系统的检查**

- **类型推论、代码补全、接口提示、跳转到定义、代码重构**

  

概要：

- 类型别名 type
- 非空断言 ！，as，字面量类型，`<类型>variable`
- 函数类型，函数参数的默认值，可选参数和剩余运算符，指定函数的 this 类型，函数重载
- TS 中获取一个值的数据类型：typeof 
- 类，类的静态属性，静态方法，原型方法，原型属性，实例属性，属性访问器，类的属性修饰符：public，private，protected，readonly
- 接口的作用，接口没有具体实现，全是抽象，接口描述函数，接口描述对象
- 抽象类约束其他类，可以有抽象和具体实现
- 接口描述构造函数，接口也可以约束类
- 泛型，泛型的作用，泛型在函数中使用，泛型在箭头函数中的使用，泛型在接口内部使用
- type中使用泛型，接口泛型，泛型约束 extends，keyof



当对象的属性多余接口要求实现的情况的解决办法：

- 通过第三个变量赋值（中转）
- 断言
- 在原有接口基础上进行继承扩展
- 重复声明同一个接口
- 自定义任意接口



## 开发环境

### 使用 rollup

```shell
npm install rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve -D
```

rollup:打包 js 类库的工具

typescript：第三方模块，编译ts代码的同时**内部也提供许多的 ts 类型**

rollup-plugin-typescript2:关联 rollup 和 typescript 这两个包的第三方库

@rollup/plugin-node-resolve:第三方模块的解析规则插件,在 import 某个文件时，自动找 index.js 文件。告诉 rollup 如何查找外部模块。

rollup 配置文件：

rollup.config.js:

```js
import ts from 'rollup-plugin-typescript2'; // ts 插件
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  input: 'src/index.ts',
  output: {
    file: path.resolve(__dirname, 'dist/bundle.js'),
    format: 'iife', // 自执行函数 格式化的格式，增加一个作用域
    name: 'xxx',
    sourcemap: true // umd 可以支持 amd 和 commonjs规范
  },
  plugins: [
    ts({
        tsconfig:path.resolve(__dirname, 'tsconfig.json'),
    }), // ts()内部会创建一个默认的配置，如果你有配置文件他就会找自己的配置文件
    nodeResolve({
        extension:['.js','.ts']
    })
  ]
};
```

package.json:

```json
"script":{
    "dev":"rollup -c -w"
},
"type":"module"
```

一般情况下写 ts 时，需要生成一个 ts 的配置文件以自定义一些规则。

```shell
tsc --help，tsc --init
```



tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ES5",                                 
     "lib": [
      "ESNext",
      "DOM",
     ],                                       
    "module": "ESNext",                               
    "sourceMap": true,                                
    "esModuleInterop": true,                            
    "forceConsistentCasingInFileNames": true,            
    "strict": true,                                      
    "strictNullChecks": true,                         
  }
}
```





### 使用 webpack

```shell
npm init -y

npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader @babel/core @babel/preset-env babel-loader core-js
```

- typescript: ts 编译器
- ts-loader: ts 加载器，用于在 webpack 中加载 ts 文件并连接 typescript
- @babel/core
  - babel 的核心工具
- @babel/preset-env
  - babel 的预定义环境
- @babel-loader
  - babel 在 webpack 中的加载器
- core-js
  - core-js 用来使旧版本的浏览器支持新版 ES 语法（polyfill）

webpack.config.js:

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  optimization:{
    minimize: false // 关闭代码压缩，可选
  },
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  devServer: {
    contentBase: './dist'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    environment: {
      arrowFunction: false // 关闭webpack的箭头函数，
    },
    clean:true
  },
  resolve: {
    extensions: [".ts", ".js",'.cjs','.json']   // 未写文件后缀名时，依次尝试该数组中的元素作后缀
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
            options:{
              presets: [
                [
                  "@babel/preset-env",
                  {
                    "targets":{
                      "chrome": "58",
                      "ie": "11"
                    },
                    "corejs":"3",
                    "useBuiltIns": "usage"
                  }
                ]
              ]
            }
          },
          "ts-loader"
        ],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title:'TS测试'，
      temlate:'./public/index.html'
    }),
  ]
}
```

tsconfig.json（使用 typescript 将源码转为指定版本）:

```json
{
  "compilerOptions": {
    "target": "ES2015", // （使用typescript将源码转为指定版本）
    "module": "ES2015",
    "strict": true
  }
}
```

package.json：

```json
{
  "scripts": {
    "build": "webpack",
    "start": "webpack serve --open"
  }
}
```



### 使用 typescript 包

- 安装 typescript 解析器（将 ts 转为 js），ts 解析器使用 nodejs 写的 **npm install typescript -g**

使用：

- 创建一个 ts 格式的文件，写入 ts 代码
- 在文件所在目录中用命令行窗口打开，执行 tsc xxx.ts 命令将 ts 编译为 js 文件
- 编译文件时，使用 -w 指令后，TS 编译器会自动监视文件的变化，并在文件发生变化时对文件进行重新编译
- 如果直接使用 tsc 指令，则可以自动将当前项目下的所有 ts 文件编译为 js 文件,但是能直接使用 tsc 命令的前提是，要先在项目根目录下创建一个 ts 的配置文件 tsconfig.json



### tsconfig.json 配置

- **include**：定义希望被编译文件所在的目录

- 默认值：["\*\*/\*"]

- 例子：

  ```json
  "include":["src/**/*", "tests/**/*"]   //所有src目录和tests目录下的文件都会被编译
  ```

  

- **exclude**：定义需要排除在外的目录

- 默认值：["node_modules", "bower_components", "jspm_packages"]

- 例子：

  ```json
  "exclude": ["./src/hello/**/*"]  //src下hello目录下的文件都不会被编译
  ```

  
  
- **extends**：用于指定继承自其他配置文件的基本配置。

- 当一个 `tsconfig.json` 文件中包含 `extends` 属性时，它可以引用另一个配置文件的路径，从而继承该配置文件的设置。这样可以方便地共享和扩展配置，避免重复配置相同的选项。具体来说，当一个 `tsconfig.json` 文件使用 `extends` 属性引用其他文件时，它会合并基础配置文件的设置，并将自己的设置与之合并。这样可以形成一个包含所有继承配置的综合配置。

- 下面是一个示例，展示了如何使用 `extends` 属性继承另一个配置文件：

  ```json
  // baseConfig.json
  {
    "compilerOptions": {
      "target": "es5",
      "strict": true
    }
  }
  ```

  

  ```json
  // tsconfig.json
  {
    "extends": "./baseConfig.json",
    "compilerOptions": {
      "outDir": "./dist",
      "target": "es2016" 
    },
    "include": [
      "./src"
    ]
  }
  ```

  `tsconfig.json` 将继承 `baseConfig.json` 中的 `compilerOptions` 配置，同时保留自己的 `compilerOptions` 配置。最终的合并结果将包含从两个配置文件中继承的配置。

  最后的结果等价于下面这个文件内容：

  ```json
  {
    "compilerOptions": {
      "target": "es2016",
      "strict": true,
      "outDir": "./dist"
    },
    "include": [
      "./src"
    ]
  }
  ```

  这意味着继承的配置文件中的值会被后续的配置文件中的同名选项值所覆盖。

  

- **files**：指定被编译文件的列表，只有需要编译的文件少时才会用到

- 例子：

  ```json
  "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts"
    ]  // 列表中的文件都会被TS编译器所编译
  ```



### compilerOptions（编译选项）

- target

  - 设置 ts 代码编译的目标版本

  - 可选值：

    - ES3（默认）、ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext

  - 示例：

    ```json
    "compilerOptions": {
        "target": "ES6"
    }
    ```

     如上设置，所编写的 ts 代码将会被编译为 ES6 版本的 js 代码

- lib

  - 指定代码运行时所包含的库（宿主环境）

  - 可选值：

    - ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext、DOM、WebWorker、ScriptHost ......

  - 示例：

    ```json
    "compilerOptions": {
        "lib": ["ES6", "DOM"]
    }
    ```
  
- module

  - 设置编译后代码使用的模块化系统

  - 可选值：

    - CommonJS、UMD、AMD、System、ES2020、ESNext、None

  - 示例：

    ```json
    "compilerOptions": {
        "module": "CommonJS"
    }
    ```

- outDir

  - 编译后文件的所在目录

  - 默认情况下，编译后的 js 文件会和 ts 文件位于相同的目录，设置 outDir 后可以改变编译后文件的位置

  - 示例：

    ```json
    "compilerOptions": {
        "outDir": "dist"
    }
    ```

     设置后编译后的 js 文件将会生成到 dist 目录

- outFile

  - 将所有的文件编译为一个 js 文件，默认会将所有编写在全局作用域中的代码合并为一个 js 文件，如果 module 制定了 None、System 或 AMD 则会将模块一起合并到文件之中

  - 示例：

    ```json
    "compilerOptions": {
        "outFile": "dist/app.js"
    }
    ```

- **rootDir**

  - **指定代码的根目录，默认情况下编译后文件的目录结构会以最长的公共目录为根目录，通过 rootDir 可以手动指定根目录**

  - 示例：

    ```json
    "compilerOptions": {
        "rootDir": "./src"
    }
    ```

- **allowJs**

  - 是否对 js 文件编译

- **checkJs**

  - 是否对 js 文件进行检查

  - 示例：

    ```json
    "compilerOptions": {
        "allowJs": true,
        "checkJs": true
    }
    ```

- removeComments

  - 是否删除注释
  - 默认值：false

- noEmit

  - 不对代码生成编译后文件
  - 默认值：false

- sourceMap

  - 是否生成 sourceMap
  - 默认值：false

- 严格检查

  - strict
    - 启用所有的严格检查，默认值为 true，设置后相当于开启了所有的严格检查
  - alwaysStrict
    - 总是以严格模式对代码进行编译
  - noImplicitAny
    - 禁止隐式的 any 类型
  - noImplicitThis
    - 禁止类型不明确的 this
  - strictBindCallApply
    - 严格检查 bind、call 和 apply 的参数列表
  - strictFunctionTypes
    - 严格检查函数的类型
  - strictNullChecks
    - 严格的空值检查
  - strictPropertyInitialization
    - 严格检查属性是否初始化

- 额外检查

  - noFallthroughCasesInSwitch
    - 检查 switch 语句包含正确的 break
  - noImplicitReturns
    - 检查函数没有隐式的返回值
  - noUnusedLocals
    - 检查未使用的局部变量
  - noUnusedParameters
    - 检查未使用的参数

- 高级

  - allowUnreachableCode
    - 检查不可达代码
    - 可选值：
      - true，忽略不可达代码
      - false，不可达代码将引起错误
  - noEmitOnError
    - 有错误的情况下不进行编译
    - 默认值：false
  
  

typescript.json 配置项解释：

```json
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. 指定ECMAScript的目标版本*/,

    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. 指定模块代码的生成方式*/

    // "lib": [],                             /* Specify library files to be included in the compilation. 指定编译的时候用来包含的编译文件*/

    // "allowJs": true,                       /* Allow javascript files to be compiled. 允许编译JS文件*/

    // "checkJs": true,                       /* Report errors in .js files. 在JS中包括错误*/

    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. 指定JSX代码的生成方式 是保留还是react-native或者react*/
    // preserve:保留jsx语法和tsx文件后缀     react-native：保留jsx语法但会把后缀改为js    react：表示不保留jsx语法直接编译为es5，文件后缀改为js

    // "declaration": true,                   /* Generates corresponding '.d.ts' file.生成相应的类型声明文件 */

    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. 为每个类型声明文件生成相应的sourcemap*/

    // "sourceMap": true,                     /* Generates corresponding '.map' file. 生成对应的map文件 */

    // "outFile": "./",                       /* Concatenate and emit output to single file. 合并并且把编译后的内容输出 到一个文件里*/

    // "outDir": "./",                        /* Redirect output structure to the directory.按原始结构输出到目标目录 */

    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. 指定输入文件的根目录，用--outDir来控制输出的目录结构*/

    // "composite": true,                     /* Enable project compilation 启用项目编译*/

    // "removeComments": true,                /* Do not emit comments to output. 移除注释*/

    // "noEmit": true,                        /* Do not emit outputs. 不要输出*/

    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */

    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. 当目标是ES5或ES3的时候提供对for-of、扩展运算符和解构赋值中对于迭代器的完整支持*/

    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule').r把每一个文件转译成一个单独的模块 */

    /* Strict Type-Checking Options */
    //"strict": true,                           /* Enable all strict type-checking options. 启用完全的严格类型检查 */

    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. 不能使用隐式的any类型*/

    // "strictNullChecks": true,              /* Enable strict null checks. 启用严格的NULL检查*/

    // "strictFunctionTypes": true,           /* Enable strict checking of function types. 启用严格的函数类型检查*/

    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions.启用函数上严格的bind call 和apply方法 */

    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. 启用类上初始化属性检查*/

    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type.在默认的any中调用 this表达式报错 */

    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. 在严格模式下解析并且向每个源文件中发射use strict*/

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. 有未使用到的本地变量时报错 */

    // "noUnusedParameters": true,            /* Report errors on unused parameters. 有未使用到的参数时报错*/

    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. 当不是所有的代码路径都有返回值的时候报错*/

    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. 在switch表达式中没有替代的case会报错 */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). 指定模块的解析策略 node classic*/
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. 在解析非绝对路径模块名的时候的基准路径*/
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. 一些路径的集合*/
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. 根目录的列表，在运行时用来合并内容*/
    // "typeRoots": [],                       /* List of folders to include type definitions from. 用来包含类型声明的文件夹列表*/
    // "types": [],                           /* Type declaration files to be included in compilation.在编译的时候被包含的类型声明 */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking.当没有默认导出的时候允许默认导入，这个在代码执行的时候没有作用，只是在类型检查的时候生效 */
    //"esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'.*/
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks.不要symlinks解析的真正路径 */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. 指定ts文件位置*/
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. 指定 map文件存放的位置 */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. 源文件和sourcemap 文件在同一文件中，而不是把map文件放在一个单独的文件里*/
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. 源文件和sourcemap 文件在同一文件中*/

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. 启动装饰器*/
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```



## typescript 语法

ts 的第三方包和其他项目的第三方包都可以提供自带的很多类型 （先掌握基本类型， ts 中高级类型，内置类型（就是typescript包下面的lib下面的大量的.d.ts文件中定义的类型）， 自己去定义类型，类型体操）

ts 最终会被编译成 js ，所添加的类型最后都会被删除掉 ，只是为了开发者来进行约束的，最终编译的结果就是一堆空气，在 js 中不可见。

后续注意点：

1. 变量 ：后面的都是类型
2. **类型推导**，会根据赋的值的类型来推导变量类型
3. ts 类型是从安全的角度出发的， 一切从安全角度来考虑，如果是安全的就可以赋值
4. ts 是在开发的时候来检测，不是在运行的时候，所以代码并没有被真正的执行

当编写一个ts文件时，可以增加一句export {} ，表示这个文件是一个独立的模块，定义的变量不会在全局下，也就不与其他ts文件中的同名变量冲突。



### 基本类型

```ts
// String / string 的区别  (大写开头的叫类类型，小写开头叫基本类型)

let num2: number = Number(12); // 强制转化后返回的是一个number类型的值

// 描述的是基本数字类型用number，描述构造函数的实例用Number
let num3: Number = new Number(12); // number 只能描述基本类型，所以不能来描述实例
let num4: Number = 123; // 该行不报错，但尽量不要用类类型来描述基本类型. 后续自定义类型会有大写的情况


// 在变量类型为任意值（any）的变量上访问任何属性和方法都是被TS允许的，对它的任何操作，返回的内容的类型都是任意值
let anyThing: any = 'hello';
console.log(anyThing.myName);  
anyThing.setName('Jerry'); // 但是执行时报错

const name = 'abc'  // name的类型就是字面量类型：'abc' 即：const name:'abc' = 'abc'
let name = 'abc'  // name的类型就是字符串类型：string 即：const name:string = 'abc'
```



### undefined 和 null

null 和 undefined 在ts中也有对应的类型 就是null和undefined。
null和undefiend是任何类型的子类型，但需要修改文件：typescript.json中的 "strictNullChecks"为false才行。
strictNullChecks 参数用于严格空检查模式，在严格空检查模式下， null 和 undefined 值都不属于任何一个类型，它们只能赋值给自己这种类型或者 any。

```tsx
// 在严格模式下 null只能给null，undefined只能给undefined
let un: undefined = undefined; 
let nu: null = null; 

// 非严格模式下
let x: number = 1;
x = undefined;    // 不报错
x = null;   // 不报错
```



### 联合类型

- 联合类型（Union Types）表示赋值可以为多种类型中的一种，联合类型使用 **|** 分隔每个类型
- **未赋值时**联合类型上只能访问两个类型共有的属性和方法
- 类型断言可以将一个联合类型的变量，指定为一个更加具体的类型
- 不能将联合类型断言为不存在的类型，除非使用双重断言

```tsx
// 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，只能访问此联合类型的所有类型里共有的属性或方法
// 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5

myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错  index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.

// | 是交集还是并集？  设置值时是并集 ts中联合类型可以看成并集 取值看成交集
type IValue = number | string | HTMLElement; // 联合类型只能使用共享的方法，非共享不能使用，当确定类型后 就会根据类型来继续识别
```





### 枚举

```tsx
// 枚举类型:普通枚举、异构枚举：用的非常少,有数字也有其他值

//普通枚举:转为js后，用对象来表示
enum STATUS {
  OK=200,
  NOT_FOUND=404,
  REDRICT=302,
}

console.log(STATUS.OK); // 可以正举， 还可以反举 （只能是数字的值才可以反举）
// -------------------------------------------
// 普通枚举编译结果：
var STATUS;
(function (STATUS) {
  STATUS[STATUS["OK"] = 200] = "OK";
  STATUS[STATUS["NOT_FOUND"] = 404] = "NOT_FOUND";
  STATUS[STATUS["REDRICT"] = 302] = "REDRICT";
})(STATUS || (STATUS = {}));
// -------------------------------------------


//常量枚举:  （常量枚举不会编译成对象，直接用常量替换）
const enum STATUS {
  OK,
  NOT_FOUND,
  MOVED,
  a = 'b',
  b = 100,
  c,
}
// 枚举对应的值一般都是数字，会根据开头的值来推断下一个的数值，没给具体数值则从零开始
console.log(STATUS.OK);   // 编译结果：console.log(0 /* OK */);
```



### never

```tsx
// never 永远不  永远达不到的情况  1）  程序出错了   2） 死循环   3） 走不到的情况
function throwNewError(): never {
  throw new Error('出错');
}
function whileTrue(): never {
  // 标识此函数执行的返回值是never
  while (true) {}
}

//never是其它类型(null undefined)的子类型，代表不会出现的值
let ne!:never
let un: undefined = ne;

// 走不到的情况 通常可以用never来保证代码的完整性 （完整性保护），

// 自定义类型
type ICircle = { r: number; xx: 'circle' }; // xx标识叫可辨类型，指代两种类型上都共有属性，只是属性值不同
type ISquare = { width: number; xx: 'square' };  

function validate(obj: never) {}
function getArea(obj: ICircle | ISquare) {
  // 联合类型的取值时，只能取到公共的属性
  if (obj.xx === 'circle') {
    return obj.r * obj.r;
  }
  if (obj.xx === 'square') {
    return obj.width * obj.width;
  }
  validate(obj); // 永远都走不到才正常，走到了就不正常了
}
// 这个代码校验完整性
```



### void

```tsx
// void 类型  函数不写返回值默认就是void ， 默认不写不是undefined？  undefined 可以兼容void类型
function sum(): void {
  // undefined 可以赋予给void。  不能标识为返回值为undefiend类型, undefiend类型只能被赋予undefiend
  // 当声明一个变量类型是 void 的时候，它的非严格模式(strictNullChecks:false)下仅可以被赋值为 null 和 undefined
  // 严格模式(strictNullChecks:true)下只能返回undefined
}
```



never 和 void 的区别

- void 可以被赋值为 null 和 undefined 的类型。 never 则是一个不包含值的类型。

- 拥有 void 返回值类型的函数能正常运行。拥有 never 返回值类型的函数无法正常返回，无法终止，或会抛出异常。



### object

```tsx
// object类型 除了基本类型都可以用object来标识  标识对象和函数
// object和any的区别
// object：表示变量是一个纯对象，且没有任何初始属性，所以不会有语法提示。  当在函数内部不取一个对象的任何属性或者方法时就可以使用object
function create(target: object) {
  // target. 不会有任何原型方法的提示
  
  target.xxx   // 提示object上没有'xxx'的错误
}
create([]);

function create(target: Object) {
  target.valueof()      // 使用Object时，表示该变量是Object构造函数的实例对象，对象上有原型属性的提示
}

function create(target: any) {
  target.xxx   // 没有错误提示
} 

```



`{}`、`object` 和 `Object` 这三个类型有以下区别：

1. `{}` 类型：表示空对象类型。它表示一个没有任何属性的对象，即空对象。例如，`const obj: {} = {};` 表示 `obj` 是一个空对象。`{}` 类型不允许添加任何属性或方法。
2. `object` 类型：表示非原始类型的对象。它是 TypeScript 中的顶级类型，包括除了 `null` 和 `undefined` 之外的所有非原始类型。这意味着 `object` 可以是对象、数组、函数等。例如，`const obj: object = {};` 表示 `obj` 是一个空对象。使用 `object` 类型时，属性和方法的结构和类型信息会被忽略，编译器将对象视为任意类型，并无法提供属性和方法的类型检查和代码提示。
3. `Object` 类型：表示 JavaScript 中的对象类型。它是 JavaScript 内置的构造函数 `Object` 的类型。在 TypeScript 中，`Object` 表示具有任意属性和方法的对象。例如，`const obj: Object = {};` 表示 `obj` 是一个空对象。与 `object` 类型不同的是，使用 `Object` 类型时，编译器会提供属性和方法的类型检查和代码提示。但需要注意的是，`Object` 类型也包括一些 JavaScript 内置对象的属性和方法，如 `toString()`、`hasOwnProperty()` 等，这些属性和方法并不适用于所有对象。

综上所述，`{}` 类型表示空对象类型，`object` 类型表示非原始类型的对象，而 `Object` 类型表示 JavaScript 中具有任意属性和方法的对象类型。



###  symbol和bitInt

```tsx
  // js 中有symbol和bitInt ts中可以使用，但是一般用不到
  // 使用 BigInt 可以安全地存储和操作大整数
  // 在使用 BigInt 的时候，必须添加 ESNext 的编译辅助库
  // 要使用 "target": "ESNext"
  // number 和 BigInt类型不一样,不兼容

let s1：symbol = Symbol(); // 对象的key可以是symbol
let s2 = Symbol();

console.log(s1 === s2);   // false

let b1: bigint = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(100);
```



### 扩展

```tsx
let name = '123'; // 无法重新声明块范围变量“name”。 默认ts中有声明过name属性了，所以在有的时候 不能在重新声明了

export {}; // 把name封装到了一个函数中， 实现了模块化了，模块化特点不会污染全局
```



### 字面量类型

- 字面量类型的变量要和实际的字面量值一一对应,如果不一致就会报错

```ts
// 类型除了基本类型之外还可以是字面量类型，表示变量只能是指定的值或者指定几个值中的一个。
type IA = 1; // 固定的字面量来作为类型
let x: IA = 1;

type direction = 'up' | 'down' | 'left' | 'right'; // 啥都编译不出来
let d: direction = 'left'; // type中可以采用联和类型,接口不能使用

const right: 'Right' = 'Right';

type Direction = 'Up' | 'Down' | 'Left' | 'Right';
function move(direction: Direction) {}
move('Up');
```



### 数组

```ts
// 类型 + 方括号 表示
let fibonacci1: number[] = [1, 1, 2, 3, 5];

let fibonacci4: (number | string)[] = [1, '1', 2, 3, 5];

// 数组泛型
let fibonacci: Array<number> = [1, 1, 2, 3, 5];

// 用接口表示数组, 虽然接口也可以用来描述数组，但是一般不会这么做，因为这种方式比前两种方式复杂,不过有一种情况例外，那就是它常用来表示类数组
interface NumberArray {
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];

interface IArr {
  [num:number]:string
}
let arr:IArr = ['a','b','c']

function sum() {
  let args: number[] = arguments;
}
// Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
// 上例中，arguments 实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口：
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}

// TypeScript中内置的类数组接口：
// 常用的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection
function sum() {
  let args: IArguments = arguments;
}

// 其中IArguments：
interface IArguments {
  [index: number]: any;
  length: number;
  callee: Function;
}
```



### 元组

数组不限制长度和内部存储的顺序，元组要限制长度和顺序

```tsx
let tuple: [string, number, boolean] = ['', 1, true]; // 这里必须要有三个值
let tuple: [name:string, age:number, male:boolean] = ['', 1, true]; // 这里必须要有三个值

// 元组可以新增已经存在的类型，没有初始被指定的类型是无法添加到数组中的。
tuple.push(1); // 要求必须是三个类型中的一个，即string或者number或者boolean
tuple.push({})  // 提示错误，对象类型不是 string或者number或者boolean 中的任意类型

tuple[3]; // 但是为了安全，限制了不能使用第四个，所以该行代码无法获取数组元素，即使上面追加了 1为索引3对应的值，提示错误：在索引 "3" 处没有元素。
```



### 函数

```ts
// 给函数的参数、返回值，函数本身添加类型声明

// 函数声明（Function Declaration）和函数表达式（Function Expression）：
// 函数声明（Function Declaration）,这种方式不能标注函数类型，只能是ts推导的类型
function sum(x, y) {
  return x + y;
}

// 函数表达式（Function Expression），可以标识类型
let mySum = function (x, y) {
  return x + y;
};

// sum的变量类型是由类型推断得出的
function sum(x: string, y: string): string {
  return x + y;
}
// 上面的sum没有声明类型，虽然ts可以推断为函数，但是没有主动标识函数的类型，这样在开发时就少了对函数的提示信息
// 输入多余的（或者少于要求的）参数，是不被允许的

//如果要现在写一个函数表达式（Function Expression），会写成这样：
let mySum = function (x: number, y: number): number {
  return x + y;
};
// 这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。如果需要手动给 mySum 添加类型，则应该是这样：

let mySum: (a: number, b: number) => number = function (x: number, y: number): number {
  return x + y;
};

let mySum: (x: number, y: number) => number = function (x, y) {
  return x + y;
};
// 或者
let mySum: {(x: number, y: number): number} = function (x, y) {
  return x + y;
};

type GetUsernameFunction = (x: string, y: string) => string;  // 这个是用作指定函数的类型
let getUsername: GetUsernameFunction = function (firstName:string, lastName:string) {  //  函数中的参数的类型是对函数传参的限制
  return firstName + lastName;
};

// 函数表达式式的话 可以标识类型
// 可以通过表达式来进行声明, ts中具备类型推导， 可以根据右边的值来推算变量的类型
const sum: (x: string, y: string) => string = (x: string, y: string): string => x + y;

type ISum = (a: string, b: string) => string; //类型别名
// 一般情况下如果给变量标识上了类型，就是限制必须按照类型赋予结果
const sum: ISum = (x: string, y: string): string => x + y;

// sum('1','2')

// 函数的默认值  可选参数  剩余运算符 都可以正常使用
// TypeScript 会将添加了默认值的参数识别为可选参数

// ? 不等价于 string | undefiend      联合类型也是表示必须传递的

// 函数的默认值   可选参数
function defaultFn(a: string = '123', b: string, c?: string) {
  console.log(a + b + c);
  return a + b + c;
}
defaultFn(undefined, '2');
// 函数调用时的参数要和函数定义时的参数的个数匹配（排除可选参数和有默认值的参数）
// 必填参数不能位于可选参数后面, 在TS中函数的形参和实参必须一样，不一样就要配置可选参数,而且必须是最后一个参数

// 剩余运算符
function spreadArguments(...args: number[]) {
  return args.reduce((start, current) => {
    return (start += current);
  }, 0);
}
spreadArguments(1, 2, 3, 4, 5);

function spreadArguments(...args: any[]) {
  return args.reduce((start, current) => {
    return (start += current);
  }, 0);
}

// 可以取一个具体值的类型
let thisObj = { name: 'zf', age: 18 };
type MyThis = typeof thisObj; // typeof 是ts中的，表示取出值对应的ts类型
// 即:
type MyThis = {
    name: string;
    age: number;
}

type IKeys = keyof MyThis  // => type IKeys = 'name'|'age'
callThis.call(thisObj, 'abc');
// 使用函数this必须要标明this的类型

// this类型必须放置第一个参数上，并且表示的形参参数名字必须叫this
function callThis(this: MyThis, value: string) {
  // 在ts中函数使用this时必须要标识this的类型
}


// 函数的重载     根据参数来决定这个函数是做什么的  只能用function关键字来实现，箭头函数不能用重载
// 'abc' => ['a','b','c']
// 123 => [1,2,3]

// string => number[]
// number => string[]

// ts函数的重载指的就是类型或者参数个数不同  - js只能通过判断参数的类型来实现重载
function toArray(value: string): string[]; // 重载情况，它们必须和函数的定义放在一起，中间不能有其他代码
function toArray(value: number): number[];
function toArray(value: string | number | boolean) {
  // 写ts的时候 不关心代码是否ok， 只是做类型校验而已
  if (typeof value === 'string') {
    return value.split('');
  } else {
    return value.toString().split('').map(Number);
  }
}
// 上面这个类型声明 为了安全起见 必须要包含重载的类型
let r = toArray(123);

// 接口定义函数
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function (source: string, subString: string) {
  return source.search(subString) !== -1;
};

export {};
```

函数重载：

定义重载签名和实现签名。

重载签名中定义了函数中每个参数的类型和函数的返回值类型，但是不包含函数体部分，一个函数可以有多个重载签名。

实现签名的参数的类型和返回值的类型都需要使用更通用的类型，且包含函数部分，一个函数只能有一个实现签名。

将重载签名和实现签名结合后就是函数重载。 在调用函数时，传参只能时重载签命中的某一个。当 ts 编译器处理函数重载时它会查找重载签名列表，尝试使用第一个符合重载的定义。

**除了重载普通函数外，也可以对类中的方法进行重载**



### 断言

（! 或者 as typeName 或者` <xxx>`value）

TS有两种主要的断言方式：类型断言（Type Assertion）和非空断言（Non-null Assertion）。

1. 类型断言（Type Assertion）：

   类型断言用于告诉编译器某个值的具体类型，即**强制**将一个表达式断定为特定的类型。类型断言有两种形式：

   - 尖括号语法：使用尖括号`<Type>`将值断言为特定类型。

   ```ts
   let value: any = "hello";
   let length: number = (<string>value!).length;
   ```

   - as 语法：使用`value as Type`将值断言为特定类型。

     ```ts
     let value: any = "hello";
     let length: number = (value! as string).length;
     ```

     

2. 非空断言（Non-null Assertion）：

   非空断言用于告诉编译器一个值肯定不为 null 或 undefined。非空断言使用后缀感叹号!来表示。

   ```ts
   let element: HTMLElement | null = document.getElementById("myElement");
   element!.classList.add("active");
   
   let element = document.getElementById("myElement")!;
   ```

需要注意的是，使用断言时需要谨慎，确保断言的类型与实际值的类型相符，以避免潜在的**运行时错误**。同时，过度使用断言可能会破坏TS的类型检查机制。



```ts
// 类型断言 可以断定某个变量是可能的几种变量类型中的某一种 （手动判断） 断言后出错了，就要自己承担
// getElementById可能返回的是HTMLElement或者null，下面一行的代码只能承载HTMLElement 但是类型可能是null ，不兼容，会提示错误
let el: HTMLElement = document.getElementById('root');

let el: HTMLElement | null = document.getElementById('root'); // 可以通过判断来具体化类型   if语句判断

// 当开发认为该变量一定会有值时，用！做类型断言
// !是ts中的一个标识 非空断言， 如果为空那就会出问题
el!.style.background = 'red'; // 出错后果自负

el?.style.backgroundColor; // 这个是es10的 链判断运算符  这个是取值运算符没有赋值的功能

// as 语法
function getVal(el: IValue) {
  // 强制转化类型 双重断言 不建议使用会破坏原有类型 ，可能会发生意向不到的问题
  el as any as boolean; // 不能断言成一个不存在的类型 因为不安全  （可以采用双重断言来解决）
  (el as HTMLElement).querySelector('root');

  (<HTMLElement>el).querySelector('root'); // 这种方式和as语法一样就是强制转化
  // 建议使用as
}

let name: string | number;
console.log((name as string).length);
console.log((name as number).toFixed(2));
console.log(name as boolean); // 报错

// 双重断言
interface Person {
  name: string;
  age: number;
}
const person = 'zhufeng' as any as Person; 

export {};
```



类型断言的用途：

- 将一个联合类型断言为其中一个类型

```ts
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  if (typeof animal.swim === 'function') {
    return true;
  }
  return false;
}
// index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
//   Property 'swim' does not exist on type 'Cat'.

interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === 'function') {
    //  断言 as Fish
    return true;
  }
  return false;
}

// 类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误

interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function swim(animal: Cat | Fish) {
  (animal as Fish).swim();
}

const tom: Cat = {
  name: 'Tom',
  run() {
    console.log('run');
  }
};
swim(tom);
// 上面的例子编译时不会报错，但在运行时会报错：
// Uncaught TypeError: animal.swim is not a function

// 原因是 (animal as Fish).swim() 这段代码隐藏了 animal 可能为 Cat 的情况，将 animal 直接断言为 Fish 了，而 TypeScript 编译器信任了我们的断言，故在调用 swim() 时没有编译错误。

// 可是 swim 函数接受的参数是 Cat | Fish，一旦传入的参数是 Cat 类型的变量，由于 Cat 上没有 swim 方法，就会导致运行时错误了。
```

- 将一个父类断言为更加具体的子类

```ts
class ApiError extends Error {
  code: number = 0;
}
class HttpError extends Error {
  statusCode: number = 200;
}

function isApiError(error: Error) {
  if (typeof (error as ApiError).code === 'number') {
    return true;
  }
  return false;
}

// 上面的例子中，声明了函数 isApiError，它用来判断传入的参数是不是 ApiError 类型，为了实现这样一个函数，它的参数的类型必须是更为基础的抽象的父类 Error，这样的话这个函数就能接受 Error 或它的子类作为参数了。但是由于父类 Error 中没有 code 属性，故直接获取 error.code 会报错，需要使用类型断言获取 (error as ApiError).code。

// 在这个例子中有一个更合适的方式来判断是不是 ApiError，那就是使用 instanceof
class ApiError extends Error {
  code: number = 0;
}
class HttpError extends Error {
  statusCode: number = 200;
}

function isApiError(error: Error) {
  if (error instanceof ApiError) {
    return true;
  }
  return false;
}
```

上面的例子中，确实使用 instanceof 更加合适，因为 ApiError 是一个 JavaScript 的类，能够通过 instanceof 来判断 error 是否是它的实例。

但是有的情况下 ApiError 和 HttpError 不是一个真正的类，而只是一个 TypeScript 的接口（interface），接口是一个类型，不是一个真正的值，它在编译结果中会被删除，当然就无法使用 instanceof 来做运行时判断了：

```ts
interface ApiError extends Error {
  code: number;
}
interface HttpError extends Error {
  statusCode: number;
}

function isApiError(error: Error) {
  if (error instanceof ApiError) {
    return true;
  }
  return false;
}

// index.ts:9:26 - error TS2693: 'ApiError' only refers to a type, but is being used as a value here.

// 此时就只能用类型断言，通过判断是否存在 code 属性，来判断传入的参数是不是 ApiError 了：
interface ApiError extends Error {
  code: number;
}
interface HttpError extends Error {
  statusCode: number;
}

function isApiError(error: Error) {
  if (typeof (error as ApiError).code === 'number') {
    return true;
  }
  return false;
}
```

- 将任何一个类型断言为 `any` 有的时候，非常确定一段代码不会出错。将一个变量断言为 any 后，在 `any` 类型的变量上，访问任何属性都是允许的。（将一个变量断言为 `any` 可以说是解决 TypeScript 中类型问题的最后一个手段）
- 将 `any` 断言为一个具体的类型遇到 `any` 类型的变量时，我们可以选择无视它，任由它滋生更多的 `any`。也可以选择改进它，通过类型断言及时的把 `any` 断言为精确的类型，使代码向着高可维护性的目标发展。

类型断言总结：

- 联合类型可以被断言为其中一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型

类型断言的限制：若 `A` 兼容 `B`，那么 `A` 能够被断言为 `B`，`B` 也能被断言为 `A`。



### 类

- "strictPropertyInitialization": true 启用类属性初始化的严格检查
- name!:string

```ts
// 类在ts中可以当做类型也可以当做值. 类类型可以描述实例

type a = String   //类充当类型

// 1)ts在类中使用this 需要先声明类型之后在使用
class Circle{
    constructor( x, y, r){
        this.x = x;   // 这三行都提示错误，因为这样写类型的this上是不存在x,y,r属性的，当在使用this时需要先描述一下this上有哪些属性
        this.y = y;
        this.t = r;
    }
}

class Circle{
    x:number  // 等价于声明一个x，并将x赋值到this上
    y:number
    r:number
    constructor( x:number , y:number , r:number ){
        this.x = x;    // 将new时传入的参数赋值给指定的this实例上的的指定属性
        this.y = y;
        this.t = r;
    }
}


class Circle {
    x!:number
    y!:number
    r!:number

    // public x!:number   // 不写public时，默认就用了public
    // public y!:number
    // public r!:number

    // x?:number
    // y?:number
    // r?:number
    constructor( x:number, y:number, r:number){
        this.x = x;    // 将new时传入的参数赋值给指定的this实例上的的指定属性，没有赋值的话，new创建的实例将为空值
        this.y = y;
        this.r = r;
    }
}



class Circle {
    constructor( public x:number,public y:number, public r:number){   //直接将参数定义到this上了，不用再写this.x = x this.y = y  this.r = r
        // public表示类接受x,y,r三个参数，并且将它们自动挂载到this上，也就不用再写下面代码了：
        // this.x = x
        // this.y = y
        // this.r = r
        // 没有写 public 的参数默认不会自动挂载到this上，可以手动挂载
    }
}

class Circle {
    constructor(x:number, y:number,  r:number){ // 这三个参数没有使用public，表示在new该构造函数时只传入了一个参数，并没将该参数挂载到this上，所以可以手动绑到this上 ，
    }
}



// 2)属性修饰符 public private protected readonly  都只是ts中的
// public 叫公开的：子类可以访问 自己可以访问 外界可以访问（构造函数的实例和子类的实例都可以访问）
// private 私有的： 只能自己访问（自己的constructor函数和原型方法可以访问）其他人（子类，子类实例和自身的实例都不可以访问）不可以  js是没有这些修饰的
// protected 受保护的  子类的contructor构造函数和子类的原型方法可以访问 自己构造函数和原型方法可以访问 外界（子类的实例和自己的实例都不可以访问）不可以访问
// readonly 表示只能在初始化的时候修改值，初始化完毕后不能再修改 类似const (初始化包含声明的时候和constructor中)

class Animal{
    constructor(public name: string) { }
}

class Cat extends Animal{
    constructor(name: string, public age: number) {
        super(name);
    }
}

const cat1 = new Cat('Tom', 18)


// 使用private实现单例模式
class Singleton {
  static instance: Singleton | null;
  private constructor() {}

  static getInstance: () => Singleton = function () {
    if (Singleton.instance === null) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  };
}




// protected
class Animal{
    protected constructor(public name: string) {} // 抽象类，不能被new调用
}

class Cat extends Animal{
    constructor(name: string, public age: number) {
        super(name);
    }
}

new Animal('老虎')  // 提示错误，因为因为Animal的constructor 是 protected
const cat1 = new Cat('Tom', 18)



// private
class Animal{
    private constructor(public name: string) {  } // 不用被new调用，也不能被继承
}

class Cat extends Animal{  // 提示错误，因为Animal的constructor 是 private
    constructor(name: string, public age: number) {
        super(name);
    }
}
const cat1 = new Cat('Tom', 18)




// readonly
class Animal {
    public readonly name: string = 'abc'// this.name = 'abc'
    constructor(name: string) {
        this.name = name; // 这里也是初始化
    }
  
    eat(val: string, age: number): void { // 原型上的方法 是共享的. 这里的void指代的是不关心返回值
        console.log('2')
    }
  
    static drink() { } // 静态的方法只能通过类来调用
}


// extends 1) 继承原型属性和方法 2） 继承类中的静态方法
// Cat.__proto__ = Animal
// Cat.prototype = Object.create(Animal.prototype)

class Cat extends Animal {
    constructor(name: string, public age: number) {
        super(name); // Animal.constructor.call(this,name)
    }
  
    type = {}; // 这个type是放在实例上的

    // 声明原型上的属性，而不是实例属性
    get type() { // 如果想添加原型属性 可以通过 getter来添加 类的属性访问器
        return {}
    }

    // 静态属性
    staic aaa = 123  // 用类名.aaa表示属性

    static get xxx() {   // 属性访问器转为ES5时都是用Object.defineProperty表示xxx
        return 'xxx'
    }
    // 原型方法
	  // 子类重写父类的方法 类型参数需要一致
    eat(val: string): string {
        super.eat(val, 18); // super指代的是什么  super = 父类的.prototype
        return 'abc'
    }
    // 静态方法
    static drink() {
        super.drink(); // super = Animal  //父类的静态方法
    }
}
const cat1 = new Cat('Tom', 18)
const cat2 = new Cat('Tom', 18)
cat2.eat('abc');
// console.log(cat1.type === cat2.type)





class Ref{
    constructor(private _value:string){ }
    get value(){
        return this._value
    }
    set value(newValue){
        this._value = newValue
    }
}
let r = new Ref('123');
r.value = '123'


// super有两种情况在构造函数中和 static方法中访问的都是父类，在原型方法中是父类的原型


// 类中有  实例属性 （每一个实例上都会添加一个）、   原型属性（多个实例间共享的）、    静态属性和方法（直接访问的） 、   属性访问器 就是defineProperty 代理
export { }
```

```ts
/**
 * 当我们写一个类的时候,会得到2个类型
 * 1. 构造函数类型的函数类型
 * 2. 类的实例类型
 */
class Component {
  static myName: string = '静态名称属性';
  myName: string = '实例名称属性';
}
let com = Component;
//Component类名本身表示的是实例的类型
//ts 一个类型 一个叫值

let c: Component = new Component();
let f: typeof Component = com;
```



类的原型属性(get 和 set)：

```ts
class User {
  // 等价于  constructor(public myname: string) {}
  myname: string;
  constructor(myname: string) {
    this.myname = myname;
  }
  get name() {
    return this.myname;
  }
  set name(value) {
    this.myname = value;
  }
}

let user = new User('zhufeng');
user.name = 'jiagou';
console.log(user.name);

//编译后的结果：
('use strict');
var User = /** @class */ (function () {
  function User(myname) {
    this.myname = myname;
  }
  Object.defineProperty(User.prototype, 'name', {
    get: function () {
      return this.myname;
    },
    set: function (value) {
      this.myname = value;
    },
    enumerable: true,
    configurable: true
  });
  return User;
})();
var user = new User('zhufeng');
user.name = 'jiagou';
console.log(user.name);
```

- TypeScript 的类型系统同样也允许将 interface、type、 class 上的属性标识为 readonly

  ```ts
  interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
  }
  
  let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
  };
  
  tom.id = 9527;
  
  // 只读的属性的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
  // index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
  ```
  
- readonly 实际上只是在`编译`阶段进行代码检查。而 const 则会在`运行时`检查

```ts
class Animal {
  public readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  changeName(name: string) {
    this.name = name; // 该行报错，因为不能修改只读属性name的值
  }
}

let a = new Animal('zhufeng');
a.changeName('jiagou');
```



### 类的装饰器

- 装饰器能够被附加到类声明、方法、属性或参数上，可以修改类的行为
- 常见的装饰器有类装饰器、属性装饰器、方法装饰器和参数装饰器
- 装饰器的写法分为普通装饰器和装饰器工厂

类装饰器在类声明之前声明，用来监视、修改或替换类定义

```ts
//当装饰器修饰类的时候，会把构造器传递给装饰器函数作为参数
function addNameEat(constructor: Function) {
  constructor.prototype.name = 'zhufeng'; //  constructor.prototype是Person类的原型对象，所以相当于在类的原型对象上添加的原型属性，之前添加原型属性是需要借助get和set函数实现的。
  constructor.prototype.eat = function () {
    console.log('eat');
  };
}

@addNameEat
class Person {
  name!: string;
  eat!: Function;
  constructor() {}
}
let p: Person = new Person();
console.log(p);
console.log(p.name);
p.eat();
```

![image-20220119113643545](..\typora-user-images\image-20220119113643545.png)

```ts
//还可以使用装饰器工厂
function addNameEatFactory(name: string) {
  return function (constructor: Function) {
    constructor.prototype.name = name;
    constructor.prototype.eat = function () {
      console.log('eat');
    };
  };
}
@addNameEatFactory('zhufeng')
class Person {
  name!: string;
  eat!: Function;
  constructor() {}
}
let p: Person = new Person();
console.log(p.name);
p.eat();
```

```ts
//还可以替换类,不过替换的类要与原类结构相同
function enhancer(constructor: Function) {
  return class {
    name: string = 'jiagou';
    eat() {
      console.log('吃饭饭');
    }
  };
}
@enhancer
class Person {
  name!: string;
  eat!: Function;
  constructor() {}
}
let p: Person = new Person();
console.log(p.name);
p.eat();
```

属性装饰器

- 属性装饰器表达式会在运行时当作函数被调用，传入下列 2 个参数
- 属性装饰器用来装饰属性

  - 第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
  - 第二个参数是属性的名称

- 方法装饰器用来装饰方法
  - 第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
  - 第二个参数是方法的名称
  - 第三个参数是方法描述符

```ts
//修饰实例属性
function upperCase(target: any, propertyKey: string) {
  let value = target[propertyKey];
  const getter = function () {
    return value;
  };
  // 用来替换的setter
  const setter = function (newVal: string) {
    value = newVal.toUpperCase();
  };
  // 替换属性，先删除原先的属性，再重新定义属性
  if (delete target[propertyKey]) {
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }
}

//修饰实例方法
function noEnumerable(target: any, property: string, descriptor: PropertyDescriptor) {
  console.log('target.getName', target.getName);
  console.log('target.getAge', target.getAge);
  descriptor.enumerable = true;
}

//重写方法
function toNumber(target: any, methodName: string, descriptor: PropertyDescriptor) {
  let oldMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    args = args.map((item) => parseFloat(item));
    return oldMethod.apply(this, args);
  };
}

class Person {
  @upperCase
  name: string = 'zhufeng';
  public static age: number = 10;
  constructor() {}
  @noEnumerable
  getName() {
    console.log(this.name);
  }
  @toNumber
  sum(...args: any[]) {
    return args.reduce((accu: number, item: number) => accu + item, 0);
  }
}
let p: Person = new Person();
for (let attr in p) {
  console.log('attr=', attr);
}
p.name = 'jiagou';
p.getName();
console.log(p.sum('1', '2', '3'));
```

参数装饰器

- 会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元数据
  - 第 1 个参数对于静态成员是类的构造函数，对于实例成员是类的原型对象
  - 第 2 个参数的名称
  - 第 3 个参数在函数列表中的索引

```ts
interface Person {
  age: number;
}

function addAge(target: any, methodName: string, paramsIndex: number) {
  console.log(target);
  console.log(methodName);
  console.log(paramsIndex);
  target.age = 10;
}

class Person {
  login(username: string, @addAge password: string) {
    console.log(this.age, username, password);
  }
}
let p = new Person();
p.login('zhufeng', '123456');
```

装饰器执行顺序

- 有多个**参数装饰器**时：从最后一个参数依次向前执行
- 方法和方法参数中参数装饰器先执行。
- 类装饰器总是最后执行
- **方法和属性装饰器，谁在前面谁先执行。**因为参数属于方法一部分，所以参数会一直紧紧挨着方法执行
- 类比 React 组件的 componentDidMount 先上后下、先内后外

```ts
function Class1Decorator() {
  return function (target: any) {
    console.log('类1装饰器');
  };
}
function Class2Decorator() {
  return function (target: any) {
    console.log('类2装饰器');
  };
}
function MethodDecorator() {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    console.log('方法装饰器');
  };
}
function Param1Decorator() {
  return function (target: any, methodName: string, paramIndex: number) {
    console.log('参数1装饰器');
  };
}
function Param2Decorator() {
  return function (target: any, methodName: string, paramIndex: number) {
    console.log('参数2装饰器');
  };
}
function PropertyDecorator(name: string) {
  return function (target: any, propertyName: string) {
    console.log(name + '属性装饰器');
  };
}

@Class1Decorator()
@Class2Decorator()
class Person {
  @PropertyDecorator('name')
  name: string = 'zhufeng';
  @PropertyDecorator('age')
  age: number = 10;
  @MethodDecorator()
  greet(@Param1Decorator() p1: string, @Param2Decorator() p2: string) {}
}

/**
name属性装饰器
age属性装饰器
参数2装饰器
参数1装饰器
方法装饰器
类2装饰器
类1装饰器
 */
```



### 接口

接口：

- 用来描述复杂数据（对象，类，函数等）的结构、组成
- 接口没有具体的实现（抽象）
- 接口可以描述函数，对象和类等，和 type 有一定的类似
- 把一些类中共有的属性和方法抽象出来,可以用来约束实现此接口的类
- 一个类可以继承另一个，实现多个接口
- interface 中可以用分号或者逗号分割每一项，也可以什么都不加

接口和 type 的区别：

1.  type 可以使用联合类型 interface 不支持联合类型

```ts
interface ISum {
    (a: string, b: string): string
} | number  // 这会提示报错，因为interface不支持联合类型

type ISum = ((a: string, b: string) => string) | number;   // type支持联合类型,不会提示错误
```

2. interface 同名可以合并， type 重名会报错

   ```ts
   interface IFruit {
     name: string;
     color: string;
     taste: 'sweet' | 'sour'; // 枚举
   }
   // 2) 声明一个同名接口就使用了接口的自动合并，会将接口合并在一起。
   interface IFruit {
     // 在上面的 IFruit的接口基础上声明一个同名的接口，只是接口中规定的内容不同
     age: number;
   }

   // 上面接口的重复声明不报错

   type a = 1;
   type a = 2;
   // 上面的type重复声明会提示错误
   ```

3. interface 可以继承扩展， type 无法继承扩展

   ```ts
   interface IFruit {
     name: string;
     color: string;
     taste: 'sweet' | 'sour';
   }
   
   // 可以继承一个或者多个其他接口
   interface myFruit extends IFruit {
     age: number;
   }
   
   let fruit1: MyFruit = {
     //不会提示错误
     name: 'zf',
     color: 'green',
     taste: 'sweet',
     age: 18
   };
   ```

4. type 可以在内部使用 in 语法 interface 不能使用 in

   ```ts
   interface IPerson1 {
       handsome: string
       name:string
   }
   interface IPerson2 {
       high: string
       name:number
   }

   type Spread<T extends object> = { 
       [K in keyof T]: T[K]  // 循环类型  for(let k in T)
   }
   type IPerson3 = Spread<IPerson1 & IPerson2>

   // ---------------------------------------------------------------------

   interface Spread<T extends object>  { 
       [K in keyof T]: T[K]   // 报错，语法不支持
   }

   ```

5. 接口可以继承类

   ```ts
   class My {}
   
   interface MF extends My {}
   
   let fruit: MF = {};
   ```

```ts
interface ISum { // 混合接口 即描述函数又描述函数上的属性
    (a: string, b: string): string
    a: number
}

const fn =  (x: string, y: string): string => x + y;
fn.a = 100
const sum: ISum = fn


const sum: ISum = (x: string, y: string): string => x + y;
sum.a = 100;


// 最多的情况是用接口来描述对象
interface IFruit {
    color: () => string // 接口的值都是类型，不能有具体的实现
    size: number
}

let fruit1: IFruit =  {  // 这种情况ts会校验赋值给fruit1的对象符不符合iFruit接口，赋值的时候，变量的形状必须和接口的形状保持一致
    color: () => 'abc',
    size: 13,
    xxx:123  // 该行提示错误---------------------
}


export { }
```



```ts

// 用户经常会编写对应的接口 接口中有对应的数据

// 接口中也有自己的修饰符  —— ？ readonly
// 1）和type的第一个区别就是 type可以使用联合类型  interface 不支持联合类型
// 2) interface同名可以合并 type重名会报错
// 3) interface 可以扩展， type无法扩展
// 4) type可以在内部使用in语法 interface不能使用in

interface IV {
  readonly color: string   //可读不可改
  taste: string,
  size?: number  // 如果变成了可选属性，对应的值可能是 number | undefined 和函数的可选参数是一样的
}
let veg:IV = {
  color: 'red', // 仅读属性只要声明完毕后就无法再次修改了
  taste: 'sweet',
}
veg.size?.toFixed()  // ts语法可以自动提示并自动加上?
// veg.color = 'green' // 仅读属性也是不能修改的


// ts 中有一个语法 as const 将某个变量（变量是对象的话），对应的值全部作为常量存在，只能读不能改
let obj = {name:'jack',age:17} as const
obj.name = 'tom'  //该行提示错误，因为属性只读不能改 -------------------------


// 接口中的属性如果没有加？ 标识表示是必填的属性， 赋值的时候属性必须要存在
interface IFruit {
  name: string
  color: string,
  taste: 'sweet' | 'sour',  // 枚举
}

// 对于接口没有规定的属性和方法的解决方式：
// 1) 可以利用ts中的兼容性来解决, 如果类型不兼容则无法赋值  （兼容：你的要求我都满足就可以）  能力弱
// ---------------------------------------------------
interface IFruit {
  name: string
  color: string,
  taste: string,  // 枚举
}
let obj = {
  name:'abc',
  color:'green',
  taste:'sour',
  age:18
}
let fruit: IFruit = obj
// ---------------------------------------------------



// 2) 声明一个同名接口就使用了接口的 自动合并 会将接口合并在一起。
// ---------------------------------------------------
interface IFruit {
  name: string
  color: string,
  taste: 'sweet' | 'sour',  // 枚举
}
interface IFruit {  // 在上面的 IFruit的接口基础上声明一个同名的接口，只是接口中规定的内容不同，破环最初的接口类型，导致后面用该接口是必须设置age属性  ，所以尽量不要使用
  age:number
}
let fruit1: IFruit = {
  name: 'zf',
  color: 'green',
  taste: 'sweet',
  age: 18,
}
// 这样就是使用了接口的 自动合并 会将接口合并在一起。 尽量在编写类型的时候不要接口重名
// ---------------------------------------------------


// 3) 可以基于原有的类型在进行扩展出新的类型，继承
// ---------------------------------------------------
interface IFruit {
  name: string
  color: string,
  taste: 'sweet' | 'sour',  // 枚举
}
interface MFruit extends IFruit{
  age:number
}
let fruit1: MFruit = {
  name: 'zf',
  color: 'green',
  taste: 'sweet',
  age: 18,
}
// ---------------------------------------------------


// 4) 直接断言成一个已经存在的实现 可以实现兼容
// ---------------------------------------------------------
interface IFruit { // 接口中的属性如果没有加？ 标识表示是必填的属性， 赋值的时候属性必须要存在
  name: string
  color: string,
  taste: 'sweet' | 'sour',  // 枚举
}
let fruit1: IFruit = {
  name: 'zf',
  color: 'green',
  taste: 'sweet',
  age: 18,
} as  IFruit // 断言，但是对于age属性没法提示，且提示错误，因为不安全
// ---------------------------------------------------------


// 5) 定义任意接口  可以通过 [key:string]:any
// ---------------------------------------------------------
interface IFruit { // 接口中的属性如果没有加？ 标识表示是必填的属性， 赋值的时候属性必须要存在
  name: string
  color: string,
  taste: 'sweet' | 'sour',  // 枚举
}
interface IVegetables {
  type: string,
}
interface MyFruit extends IFruit, IVegetables {  // 多继承
  [key: string]: any // 可以接收任意类型 +++++++++++++++++++++++++++++
}
let fruit1: MyFruit = {
  type: '水果',
  name: 'zf',
  color: 'green',
  taste: 'sweet',
  age: 18,
  xxx: 123,
  1: 100,
  [Symbol()]: 299
}
// ---------------------------------------------------------


// 一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型
// 一旦定义了任意属性，那么以确定的属性和可选属性的类型都必须是它的类型的子集：
interface Person {
  name: string;
  age?: number;  //报错
  [propName: string]: string;
}

let tom: Person = {
  name: 'Tom',
  age: 25,   // 报错
  gender: 'male'
};

// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.




interface IArr { // 可索引接口 就是可以通过索引来取值
  [xxx: number]: any
}
let myArr1: IArr = [1,2,3,'abc']
let myArr2: IArr = { 0: 1, 1: 2, 2: 3 }


interface IArr { 
  [key: number]: any
	push():void 
}

// 声明的接口还可以通过索引的方式访问它的类型
// 接口嵌套
interface ResponseData{
  username:string,
  token:string
}

interface ReturnVal{
  code:number,
  data: ResponseData
}

type ICode = ReturnVal['code'];
type IUsername = ReturnVal['data']['username']; // 可以用于取值的类型
type IKeys = ReturnVal[keyof ReturnVal]; // 取值的类型, 可以采用这种方式


interface Speakable{
  speak:()=>void  // 表示的是实例方法
  speak():void // 表示的是原型方法
}

class Speaker implements Speakable {
  speak:()=>void
  constructor(){
    this.speak = ()=>{}
  }
  
  // 原型方法
  speak():void{
    
  }
}

// -------------------以上是描述对象的------------------------------


// 一个接口可以继承多个接口， 接口可以用于继承类
interface SpeakChinese {
    speakChinese(): void
}
interface SpeakEnglish {
    speakEnglish(): void
}
class Speak {
    public a!: string;
}
interface Speakable extends SpeakEnglish, SpeakChinese, Speak {
    speak(): void // 实现的是原型方法
    //  speak:()=>void // 实现的是实例方法
}
class Speaker implements Speakable {
    public a!: string;
    speakEnglish(): void {
        throw new Error("Method not implemented.");
    }
    speakChinese(): void {
        throw new Error("Method not implemented.");
    }
    speak() {
        return 100
    }
}



// 接口还可以用于描述类和类的实例  可以采用抽象类来进行一个描述
// 在没有编写具体类的时候就能限制某个类中必须有一些具体的方法和属性等。

// 抽象类要增加abstract关键字， 增加后此类不能被new. 抽象类可以定义抽象方法。 定义后的抽象方法或者属性必须要子类实现
// 抽象类中可以存着非抽象的方法或者属性，对于抽象类中的非抽象方法和属性其他类的实例直接就能继承
// 抽象方法只能出现在抽象类中，不能出现在非抽象类中
abstract class Animal {
  public a:number
  abstract name: string
  abstract eat(): void
  abstract drink(): void

  constructor(){
    this.a = 1
  }

  speak() { // 已经实现好的
    console.log('speak')
  }
}
// --------------------------------------------------
class Cat extends Animal {
  name = '猫'
  eat(): void {
    throw new Error("Method not implemented.")
  }
  drink(): void {
    throw new Error("Method not implemented.")
  }
}
// --------------------------------------------------


abstract class Cat extends Animal {
  name = '猫'
  eat(): void {
    throw new Error("Method not implemented.")
  }
  drink(): void {
    throw new Error("Method not implemented.")
  }
}






// 抽象：是否有实现
// 接口也可以限制类型 接口中不能有非抽象的方法. 接口中都是抽象的， 不能写具体的实现（就是方法是没法写具体逻辑代码的）

// ----------------------------------------------------------
interface IEat {  //这种写法描述的理应是实例上的属性
  eat: () => void // 在接口中约束类的话都是描述的实例  实例上的 还是原型上的呢？

  //eat:()=>{   // 这就是具体实现，但是在抽象类中会有具体的实现
  //    // 代码....
  //}
}
class Tom implements IEat, IDrink {
  public eat: () => void // 等价于eat: () => void
  public constructor() {
    this.eat = () => { }
  }
}
// ----------------------------------------------------------



interface IEat {
  eat: () => void
}

interface IDrink {  // 这种方法描述的理应是原型上的属性
  drink(): void
}

// 上面两种写法是可以混淆使用的 ts不会区分是原型还是实例 只要有就行。 但是提示上`drink():void`是原型上的
// 用接口限制类 的类型，需要使用的是implements（实现）关键字而不是extends
class Tom implements IEat, IDrink {
  public eat: () => void // 等价于eat: () => void
  public constructor() {
    this.eat = () => { }
  }
  public drink(): void {
    throw new Error("Method not implemented.")
  }
}
let tom = new Tom
// ? 表示的是取值 （js语法）  !非空 赋值 （ts的断言）




// ----------------------------------------接口来描述类中的构造函数---------------------------------------
// 接口来描述类中的构造函数 如何做？
// 类只能描述实例， 不能描述类本身
// 想描述类本身 需要采用typeof 来进行米描述

// ----------------------------------------------
class Mouse {
  constructor(public name: string, public age: number) { }
}
class Dog {
  constructor(public type: string) {}
}

function getInstance(clazz: Mouse){  // 报错，类只能描述实例， 不能描述类本身
  return new clazz
}   

function getInstance(clazz:typeof Mouse){
  return new clazz
}     // 取构造函数的字面量来描述，限制类     方式一
let instance = getInstance(Mouse)

let instance = getInstance(Dog) // 提示错误，因为取的是  typeof Mouse的类型，传入Dog，则Dog类的构造函数必须有name和age属性
// ----------------------------------------------



function getInstance(class:{new (name:string,age:number):Mouse|Dog}):void{}  //   方式二，    不同typeof 类名，而用new (key:type,...):className  来表示

// 用来描述构造函数的， 构造函数中需要返回一个any的实例
function getInstance(class:{new (name:string,age:number):any}):void{}


type IClazz1 = new (name:string,age:number) => Mouse | Dog
type IClazz2 = new (...args: any[]) => Mouse | Dog   //  方式三  使用 type 别名


interface IClazz3 {             // 方式四 ， 使用接口
  new(name: string, age: number): any
}

function getInstance(clazz: IClazz3, name: string, age: number) {
  return new clazz(name, age)
}
let instance = getInstance(Mouse, 'jerry', 10)
// 上面的instance实例没法明确指明实例是Mouse类型实例还是Dog类型实例
// 区分具体的实例了


type IClazz = new (...args: any[]) => Mouse | Dog

// 重载
function getInstance(class:{new( name: string, age: number):Mouse}, name: string, age: number):Mouse
function getInstance(class:{new( type:string):Dog}, name: string, age: number):Dog
function getInstance(clazz: IClazz, name: string, age: number):Dog|Mouse {
  return new clazz(name, age)
}
let instance = getInstance(Mouse, 'jerry', 10)


// ------------------------------------------------------------------------
class Mouse {
  constructor(public name: string, public age: number) {}
}

class Dog {
  constructor(public type: string) {}
}
type cla1 = new (...args: any[]) => Mouse | Dog;

function getInstance(
clazz: { new (name: string, age: number): Mouse },
 name: string,
 age: number,
): Mouse;
function getInstance(clazz: { new (type: string): Dog }, name: string, age: number): Dog;
function getInstance(clazz: cla1, name: string, age: number): Mouse | Dog {
  return new clazz(name, age);
}

let instance1 = getInstance(Dog,'tom',18);
let instance2 = getInstance(Mouse,'tom',18);
// ---------------------------------------------------------------------------



export { }
```



用接口和抽象类的不同点：

- 接口中只能是抽象类的方法，但是抽象类中的方法可以有具体实现（逻辑）并能和被子类继承

  ```ts
  abstract class Animal {
    public a: number;
    abstract name: string;
    abstract eat(): void;
    abstract drink(): void;
    constructor() {
      this.a = 1;
    }
    speak() {
      // 这就是抽象类中的具体实现
      console.log('speak');
    }
  }
  
  interface IEat {
    eat: () => void; // 这就是抽象，不能有具体实现
    //eat:()=>{   // 这就是具体实现，但是在抽象类中会有具体的实现
    //    // 代码....
    //}
  }
  ```

  

- 类不能继承接口，只能实现，并且类可以实现多个接口；但是类可以继承抽象类，类只能一次继承一个类

  ```ts
  abstract class Animal {
    public a: number;
    abstract name: string;
    abstract eat(): void;
    abstract drink(): void;
    constructor() {
      this.a = 1;
    }
    speak() {
      console.log('speak');
    }
  }
  
  class Cat extends Animal {
    // 继承抽象类
    name = '猫';
    eat(): void {
      throw new Error('Method not implemented.');
    }
    drink(): void {
      throw new Error('Method not implemented.');
    }
  }
  
  // --------------------------------------------------
  
  interface IEat {
    eat: () => void;
  }
  interface IDrink {
    drink(): void;
  }
  class Tom implements IEat, IDrink {
    // 实现，并实现多个就扣
    public eat: () => void;
    public constructor() {
      this.eat = () => {};
    }
    public drink(): void {
      throw new Error('Method not implemented.');
    }
  }
  let tom = new Tom();
  ```

typeof 需要取用具体值的类型。

```ts
interface V1 {
  x: number;
}
interface V2 {
  x: number;
  y: string;
}
type Subtypeof<T, U> = T extends U ? true : false;

type A = Subtypeof<V2, V1>; // true
type A = Subtypeof<V1, V1>; // true
type A = Subtypeof<V1, V2>; // false
```

了解 TS 中的类型和 TS 所采用的结构化类型系统是 TS 进阶的关键。



### 泛型变量

类型占位符。泛形可以用在函数，接口，类和type类型别名中。

```ts
// 泛型的作用：就是在定义类型的时候，还不能确定是什么类型，需要等待使用的时候才能确定类型
class Cat {
  constructor(public name: string, public age: number) {}
}
class Dog {
  constructor(public name: string) {}
}

// type IClazz = new (...args: any[]) => Cat | Dog 根据对应的位置去猜测泛型的值
function getInstance<T, K>(clazz: new (...args: any[]) => T, name: K, age?: number): K {
  // 泛型在代码中无法判断具体类型，因为此时函数没有执行，并不知道类型

  // if (clazz instanceof Dog) {
  //     return new clazz(name)// new Dog 返回的就是T  -> Dog的实例
  // } else {
  //     return new clazz(name, age) // new Cat -> T ->  Cat的实例
  // }
  // return new clazz()
  return name;
}
// ts 具备推到的功能 "猜一猜“, 根据位置推断对应的类型
let result1 = getInstance<Dog>(Dog, 'tom');
let result2 = getInstance<Cat>(Cat, 'tom');
let r = getInstance(Cat, 123);

function createArray<T>(times: number, val: T): T[] {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
}
createArray(5, 'abc');
createArray(5, 123);

 
// -------------------------------------------------------  接口中使用泛型
interface ICreateArra {
  <T>(times: number, val: T): T[];
}
const createArray: ICreateArra = (times, val) => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
};

type ICreateArray = <T>(times: number, val: T) => T[];
const createArray: ICreateArray = (times, val) => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
};
let arr1 = createArray(5, 'abc'); // createArray的类型如何标识

interface ICreateArra<T> {
  (times: number, val: T): T[];
}
const createArray: ICreateArra<T> = (times, val) => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
};

// 区分接口泛型


// 在函数签名前面声明的泛型表示调用的时候才会确定类型
interface ICallback {
  <T>(item: T): void; 
}

// 接口后面加泛型意味着使用接口的时候就能确定类型了
interface ICallback<T> {
  (item: T): void;
}

// ---------------------------------------------
type ICallback<T> = (item: T) => void;
type IForEach = <T>(arr: T[], callback: ICallback<T>) => void;
let forEach: IForEach = (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]); // 这里的t是无法推导的
  }
};
forEach([1, 'string'], (item) => {
  console.log(item);
});

// 交换参数

function swap<T, K>(tuple: [T, K]): [K, T] {
  // 这里可以使用多个泛型， 泛型会依靠位置来进行猜测
  return [tuple[1], tuple[0]];
}
let arr = swap([1, 'abc']);

// function sum<T>(a: T, b: T) { // 无法保证两个泛型相加  T + T => T
//     // T没有确定类型前 是不能做运算、取值操作的
//     return a + b;
// }

// 泛型约束 ， 约束泛型值的一个范围

// 所谓的满足 就是拥有他的特性, 只要涵盖要求的属性即可
// function getVal<T extends {toString:()=>string}>(val:T){}
// getVal(123);

// function sum<T extends string>(a: T, b: string){
//     return a+b
// }
// let val = sum('a','b')
// type IA = { a: 1 };
// type IB = { b: 2 }
// function getVal<T extends IA | IB>(val: T) {} // 或者
// getVal({a:1});

let o1 = { name: 'zf', age: 12 };
let o2 = { name: 'zf', age: 12 };

// extends 要满足   T extends number | string
// keyof 取某个 类型中的所有key
type xxx = keyof any; //  string | number | symbol

function getValueFromKey<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
let val = getValueFromKey(o1, 'age');

export {};
```



**泛型默认值**

```ts
type IUnion<T = boolean> = T | string | number 
```



**泛型约束**

使用的TS关键字是：extends

```ts
function getVal<T>(val:T){
  return val
}

// 针对上面的函数，要求不能传入对象类型的数据。  要实现这个需求，以前是使用联合类型加上函数重载实现，即：
function getVal(val:string):string
function getVal(val:number):number
function getVal(val:string|number):string|number{
  return val
}

// 如果使用泛形的话，就需要对泛形进行约束，即：
function getVal<T extends string|number>(val:T){
  return val
}

// 约束传参至少必须有length属性
function getLen<T extends {length:number}>(val:T){
  return val.length
}
z
function getVal<T extends object, K extends keyof T>(obj:T,key:K){
  return obj[key]
}
```





### 交叉类型

```ts
// 联合类型:可以是A或者B且只能是其中一类 并集     交叉类型 交集
interface IPerson1 {
  handsome: string;
}
interface IPerson2 {
  high: string;
}

type IPerson3 = IPerson1 & IPerson2;

let p: IPerson3 = {
  handsome: '123' // 提示错误 ， 类型 "{ handsome: string; }" 中缺少属性 "high"，但类型 "IPerson2" 中需要该属性。
};

interface IPerson1 {
  handsome: string;
  name: string;
}
interface IPerson2 {
  high: string;
  name: number;
}
// 一类高的人  一类帅的人 =》 又高又帅

type Spread<T extends object> = {
  // 循环类型  for(let k in T)
  [K in keyof T]: T[K];
};
type IPerson3 = Spread<IPerson1 & IPerson2>;  // 对于有冲突的类型，那就取never

// typeof 取js中对应的类型的   keyof 可以用来取类型中的key  extends 约束
let name!: never;
let person3: IPerson3 = {
  // person3是交叉后的结果
  handsome: '帅',
  high: '高',
  name // 因为无法相交
};
let person1: IPerson1 = person3; // 可以赋值，满足接口的兼容性
let person2: IPerson2 = person3;

// 默认将两个对象展开 他的类型就是 交叉类型
function merge<T extends object, K extends object>(a: T, b: K) {
  //:T&K
  return { ...a, ...b };
}
let r = merge({ a: 1 }, { b: 2, a: 'abc' }); //  a的类型将会是never类型     这里的merge不能是T&K，会出现问题
r.a = 100; // 报错，因为 a 在第一个对象中是number 在第二对象中是string，两种类型冲突，对吼默认采用a的类型为never
// 为此要使用条件类型来确定最后以哪个a的值为准。

interface IFruit {
  color: string;
}
let fruit: IFruit & { taset: string } = {
  color: 'red',
  taset: 'sour'
};
// 交叉类型 可以组合多个类型，但是组合的时候如果类型冲突会出现never的情况

interface handsome {
  handsome: string;
}

interface total {
  total: string;
}

type p1 = handsome | total;

let p: p1 = {
  handsome: '123',
  total: '456'
};
let p: p1 = {
  handsome: '123'
};

let p: p1 = {
  total: '456'
};

type p2 = handsome & total;

let p0: p2 = {
  handsome: 'qwe',
  total: 'asd'
};

export {};
```



### 条件类型

TS中使用的是三元表达式，这个表达式只能在type中去使用，无法在接口中使用。

类型的级别：谁能赋给谁

```ts
// 子类型 extends 父类型 就为true

type StatusCode<T> = T extends 200 | 201d  ? 'success' : 'fail'
```





### 内置类型

```ts
// 条件类型   类型冲突的时候用来判断以谁为准
// 鸟 -》 天空  鱼-》 水  你给的是鸟 -》 天空    给一个类型就返回另一个类型 条件判断
interface Bird {
  name: '鸟';
}
interface Fish {
  name: '鱼';
}
interface Sky {
  color: '蓝色';
}
interface Water {
  color: '透明';
}
type IChangeEnv<T extends Fish | Bird> = T extends Fish ? Water : Sky;
type IEnv = IChangeEnv<Fish | Bird>; // Water | Sky

type IChangeEnv<T extends Fish | Bird> = T extends Fish ? Water : Sky;
// 通过条件判断的方式返回对应的类型， 如果放入的是联合类型那么具备·分发·的能力. 如果放入的不是联合类型就不在有分发的能力了
// 只能在裸类型中使用 , 如果泛型被包裹 那么就不会产生分发效果了
type IChangeEnv<T extends Fish | Bird> = [T] extends Fish ? Water : Sky; // 不会产生分发效果

// TS中很多内置的类型都是基于条件类型来实现的

// -------------有了条件类型之后 可以解答ts中内置类型的实现了--------------------

// Exclude 自带的功能  指定基本类型和字面量类型
type Exclude<T, K> = T extends K ? never : T; // 从T中查找有没有满足K的 如果有则删除 没有直接返回
type ExcludeType = Exclude<number | 'abc' | boolean, string>; // 在一组类型中删除某个

type ExcludeType = Exclude<number | string | boolean, string>; // 在一组类型中删除某个

type Extract<T, K> = T extends K ? T : never;
type ExtractType = Extract<number | string | boolean, string>; // 排除其他非string的类型
type ExtractType = Extract<number | string, boolean | string>;

let r = document.getElementById('root');
type x = Exclude<typeof r, null>; // x为排除掉null后的类型，即只有HTMLElement类型

let r = document.getElementById('root');
type NonNullable<T> = T extends null | undefined ? never : T;
type NonullType = NonNullable<null | undefined>;

// --------------循环内置的类型---------in语法 ----------------------------
interface Person {
  name: string;
  age: number;
}
type Partial<T extends object> = {
  [k in keyof T]?: T[K];
};
// -----------------
type partialPerson = Partial<Person>; // 原生 Partial 是不支持深度递归的

type partialPerson = {
  name: string | undefined;
  age: number | undefined;
};

interface Person {
  name?: string;
  age: number;
  address: {
    num: number;
  };
}

//  -------------------------TS类型的递归--------------------------------

type DeepPartial<T> = {
  // 原生的是不支持深度递归的
  // 可以通过条件判断递归ts的类型
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type IPartialPerson = Partial<Person>;
let partialPerson: IPartialPerson = {
  name: 'zf'
};

// -------------------------------------------------------
type Required<T extends object> = {
  [K in keyof T]-?: T[K]; // -？ 表示去掉？
};
type RequiredType = Required<IPartialPerson>; // Required表示必填  原生实现支持

type Readonly<T> = {
  readonly //  Readonly表示只读   原生实现支持
  [K in keyof T]: T[K];
};
type ReadonlyType = Readonly<RequiredType>;

// Pick 在对象中做挑选 Omit
interface IAnimal {
  type: string;
  name: string;
  age: number;
  address: string;
}
type Pick<T extends object, K extends keyof T> = { [M in K]: T[M] }; // in Object,keys()
type PickType = Pick<IAnimal, 'type' | 'address' | 'age'>;

// type Omit<T extends object, K extends keyof T> =  { [M in Exclude<keyof T, K>]: T[M] }
type Omit<T extends object, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type OmitType = Omit<IAnimal, 'name'>; // 这里怎么实现呢？

// Recordv记录 key:value  标识函数的参数使用record

// let obj:Record<'a' | 'b' | 'c',number> = { a: 1, b: 2, c: 3 };

// type Record<K extends keyof any, V> = { // 就是一个主要是 key，value格式即可
//     [X in K]: V // for(x in K)
// }
function mapping<K extends keyof any, V, R>(
  obj: Record<K, V>,
  cb: (key: K, value: V) => R
): Record<K, R> {
  let result = {} as Record<K, R>;
  for (let key in obj) {
    result[key] = cb(key, obj[key]);
  }
  return result;
}
// 这里不关心对象的组成   映射成另一种结构
let mapResult = mapping({ a: 1, b: 2, c: 'abc' }, (key, value) => {
  // ={a:3, b:6 , c:9}
  return value;
});
// Exluced Extract Requrired  Readonly  Partial NonNullable Pick Omit Record

// Pick 在对象中挑选，原生实现了
interface IAnimal {
  type: string;
  name: string;
  age: number;
  address: string;
}
// 从动物类型中挑选出只包含type和name的属性
type PickType1 = Pick<IAnimal, 'type'>;
type PickType2 = Pick<IAnimal, 'type' | 'address'>;
//等价于
type PickType3 = {
  type: string;
  address: string;
};
// Pick 的实现
type Pick<T extends object, K extends keyof T> = {
  [M in K]: T[M];
};

// Omit  剔除或者移除指定类型
interface IAnimal {
  type: string;
  name: string;
  age: number;
  address: string;
}
type PickType1 = Omit<IAnimal, 'name'>;
//等价于
type PickType3 = {
  type: string;
  address: string;
  age: number;
};

// Omit 的实现
type Omit<T extends object, K extends keyof T> = { [M in Exclude<keyof T, K>]: T[M] };

// Record 记录 描述对象  key:value      表示函数的参数使用record
type Record<K extends keyof any, T> = { [P in K]: T };
let obj: Record<string, number> = { a: 1, b: 2 };

// let obj:Record<'a' | 'b' | 'c',number> = { a: 1, b: 2, c: 3 };

// type Record<K extends keyof any, V> = { // 就是一个主要是 key，value格式即可
//     [X in K]: V // for(x in K)
// }
function mapping<K extends keyof any, V, R>(
  obj: Record<K, V>,
  cb: (key: K, value: V) => R
): Record<K, R> {
  let result = {} as Record<K, R>;
  for (let key in obj) {
    result[key] = cb(key, obj[key]);
  }
  return result;
}
// 这里不关心对象的组成   映射成另一种结构
let mapResult = mapping({ a: 1, b: 2, c: 'abc' }, (key, value) => {
  // ={a:3, b:6 , c:9}
  return value;
});
// Exluced Extract Requrired  Readonly  Partial NonNullable Pick Omit Record

export {};
```



### merge

```ts
// 利用内置类型来实现更加丰富的类型

interface IPerson1 {
  handsome: string;
  name: string;
}
interface IPerson2 {
  high: string;
  name: number;
}
// 去掉person1 中name  与person2 合并即可
// 对象的合并都是两个两个合并
// function merge<T extends object, K extends object>(a: T, b: K): Omit<T, keyof K> & K {
//     return { ...a, ...b }
// }
function merge<T extends object, K extends object>(
  a: T,
  b: K
): Pick<T, Exclude<keyof T, keyof K>> & K {
  return { ...a, ...b };
}
let person1: IPerson1 = { handsome: '帅', name: 'person1' };
let person2: IPerson2 = { high: '高', name: 123 };

let obj = merge(person1, person2);
// 1) 我们像找到两个人之间的差异的部分  handsome + high  + 冲突的部分 就可以了
// 普通的基本类型 exclude  extract ， 如果是对象Omit或者Pick

export {};
```



### 类型保护

```ts
// 类型保护  js本身就实现了类型保护 typeof instanceof  in操作符
function isType(val: string | number) {
  if (typeof val === 'string') {
    val;
  } else {
    val;
  }
}

class Person {}
class Animal {}
function isAnimal(val: Person | Animal) {
  if (val instanceof Animal) {
    val;
  } else {
    val;
  }
}

interface IPerson1 {
  handsome: string;
  name: string;
}
interface IPerson2 {
  high: string;
  name: number;
}
function isPerson1(val: IPerson1 | IPerson2) {
  if ('handsome' in val) {
    val;
  } else {
    val;
  }
}

// 通过增加一个标识符来区分类型: 可辨识类型,借助一个公共属性，但是属性的值不同
interface ICircle {
  kind: 'circle';
  r: number;
}
interface IRant {
  kind: 'rant';
  with: number;
  height: number;
}
function isCircle(val: ICircle | IRant): val is ICircle {
  //  val is ICircle 意味着返回值为true就是圆， 自定义类型保护
  return val.kind == 'circle';
}
function getArea(val: ICircle | IRant) {
  // true是圆  还是false是圆
  if (isCircle(val)) {
    val;
  }
}

function isObject(val: any): val is object {
  // 自定义类型保护
  return Object.prototype.toString.call(val) === `[Object object]`;
}
let v = {};
if (isObject(v)) {
  console.log(v);
}

// 兼容性
export default {};
```

### 类型兼容性

理解为 TS 内置的隐含的规范，确定多个变量之间能否彼此相互赋值。不是具体的应用场景而是编写规范。（什么样的变量何可以给什么样的变量赋值）

```ts
// 不要死记 ts中的兼容性 ， 情况太多不方便记忆  （ts永远从我们的安全性来考虑） 如果安全则可以赋值
// 基本类型、字面量类型  联合类型

let n1!: string | number;
let n2!: string | number | boolean;

// 如果n2 是一个boolean， 能把n2赋予给n1吗？
n2 = n1; // 在基本类型的联合类型中的 两个变量之间的赋值，联合类型少且都包含联合类型的那个变量可以赋予给联合类型多的那个变量  n2 是n1 的父亲 ，因为n1中有的n2都有

//  接口的兼容性， 多的可以赋值给少的
interface IFruit1 {
  color: string;
}
interface IFruit2 {
  color: string;
  taset: string;
}
let fruit1!: IFruit1;
let firuit2!: IFruit2;
fruit1 = firuit2; // 因为你要的属性我都有则可以赋值，多余的属性不认（fruit1不能提示taset属性）。 所以对于接口类型而言 多的可以赋予给少的

// 函数的兼容性
// 对于函数的参数而言，少的可以赋值给多的,
let fn1!: (a: string, b: string) => string;
let fn2!: (a: string, b: string, c: string) => string;
// 声明了三个 但是只用了两个 安全的， 定义了2个 ， 用了三个不安全 ， 少的参数可以赋予给多的参数
fn2 = fn1;

// type ICallback<T> = (item: T,key:number) => void;
// type IForEach = <T>(arr: T[], callback: ICallback<T>) => void;
// let forEach: IForEach = (arr, callback) => {
//     for (let i = 0; i < arr.length; i++) {
//         callback(arr[i],i); // 这里的t是无法推导的
//     }
// }
// forEach([1, 'string'],(item)=>{})

//返回值的特征
// 对于返回值来说 （联合类型）  遵照的就是联合类型的兼容的
let fn3!: (a: string, b: string) => string | number | boolean;
let fn4!: (a: string, b: string) => string;

// 类的兼容性。 鸭子类型检测，只要长得一样就认为是鸭子. 在类中一旦有了除public之外的其他修饰符(private,protect) 就永远不相等了
class Person {
  public name!: string;
}
class Animal {
  public name!: string;
}

let person = new Person();
let animal = new Animal();

person = animal;
animal = person;

// 枚举类型  枚举不兼容
enum A {}
enum B {}

// 父子间的兼容  协变与逆变
class Parent {
  public money!: number;
}
class Son extends Parent {
  public car!: number;
}
class Grandson extends Son {
  public pay!: string;
}
// 传父亲 （参数是逆变的，可以传递父亲）
// 返儿子 （返回值是协变的 可以返回孩子）
function fn(cb: (val: Son) => Son) {
  // val 是son 说明可以处理 money和car
}
// 如果关闭 strictFunctionTypes字段 参数则是双向协变的
fn((val: Parent) => new Grandson());

function fn5(cb: (val: string | number | boolean) => string | boolean) {
  // 因为调用函数的时候 只能传递 string | number | booleanb
  cb(true);
}
fn5((val: string | number | boolean | null) => 'abc');
export default {};
```

### unknown

```ts
// unknown 也是ts中一个类型    any尽量不要写，写了any就放弃了类型校验

// unknown 和 any 非常类似 但是是一个安全类型。 我们在使用unknown类型的时候需要将类型进行具体话。 缩小范围在使用

// 任何类型都是unknown的子类型 , 如果当前类型是unknown 只能将这个类型赋予给unknown any

let a: unknown = {};
let a: unknown = 1;

let a: unknown = {};
let b: number = a; //该行报错：不能将类型“unknown”分配给类型“number”

let c: any = {};
let d: string = c; // 该行不报错

// 可以将所有不知道的类型标识成unknown, 但是有的场景还是需要用any的
function sum(a: unknown, b: number) {
  // unknown这个类型不能进行运算 + - 也不能调用属性
  // return a + b;
  if (typeof a === 'number') {
    // 类型保护
    return a + b;
  }
  if (typeof a === 'string') {
    return a + b;
  }
  return a as boolean; // unknown 和 任何类型作为联合类型 返回的就是unknown
}

function isObject(val: unknown): val is object {
  return Object.prototype.toString.call(val) === `[Object object]`;
}

type X = string | number | unknown;

let data: unknown = JSON.parse('{name:"zf",age:13}');

type ISchool = { name: string; age: string };
function isSchool(data: any): data is ISchool {
  return data.age !== undefined && data.age !== undefined;
}
if (isSchool(data)) {
  data.name;
}

type inter = unknown & number; // 取交集的话返回的是其他类型

// type IKey = keyof unknown; // 我们的unknown 是不支持keyof
type IMap<T = number> = {
  [K in keyof T]: T[K];
};
type t = IMap<any>;

// data.name ?  // 不安全
// data.age ?

export {};
```

### infer

```ts
// infer  ts中可以自动推断类型  关键字“infer”

// Exclude Extract Omit Pick Required Readonly Record   Partial NonNullable

// 1） 我们想获取函数的返回值的类型

// redux 我想获取reducer中的默认返回值
var getUserInfo = (name: string, age: number) => {
  return { name: 'zf', age: 13 };
};

// 需要拿到函数的返回值类型来标识参数

// [P in keyof T]
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type MyReturnType = ReturnType<typeof getUserInfo>;

// 2) 去函数的参数的类型
//type xxx = T extends Function ? P :  never
type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
  ? P
  : never;
type MyParamaters = Parameters<typeof getUserInfo>;

class My {
  // 类的实例类型是？类类型
  constructor(x: string, y: string) {}
}
// 类可以描述实例充当实例的类型
// 类的类型需要typeof取值
type InstanceType<T extends { new (...args: any[]): any }> = T extends {
  new (...args: any[]): infer Instance;
}
  ? Instance
  : never;
type MyInstanceType = InstanceType<typeof My>; // 一般用不到

type ConstructorParameters<T extends { new (...args: any[]): any }> = T extends {
  new (...args: infer P): any;
}
  ? P
  : never;
type MyConstrcutorParamaters = ConstructorParameters<typeof My>;

type P1 = MyConstrcutorParamaters[0];

// ReturnType
// 推断泛型

// 将一个元组类型转化成 一个联合类型  编译后就是空气

type Transfer<T> = T extends Array<infer X> ? X : never;
type MyTransfer = Transfer<[string, number, boolean]>;
// type TupleToUnion = [string,number,boolean][number]

// ts实战 讲ts中的各种复杂的场景
// 命名空间 、 声明文件 、 tsconfig

export {};
```

### 命名空间

```ts
// namespace  这个一般在项目中使用不到，在编写声明文件的时候一般会被用到(一般第三方包都有声明文件了)

// 我们在一个模块中， 想维护多段逻辑，而且逻辑中有重名的部分 （命名冲突）, 希望代码互相不干扰就可以采用命名空间

// 命名空间最强大的功能。 用来扩展
// 命名空间的策略： 1） 命名空间可以用来和类进行合并  2) 命名空间可以和函数进行合并 (可以在函数上扩展一些需要的自定义属性)
// 3) 命名空间可以和枚举合并    (同名的命名空间也会合并)
// 4) 接口和命名空间无法合并

export namespace Zoo {
  export class Monkey {}
  export namespace Felid {
    export const cat = '猫';
    export const panda = '熊猫';
  }
}
Zoo.Monkey;
Zoo.Felid.cat; // 防止命名冲突
// ----------------------------------------------------------------
// 同名的命名空间也会合并
namespace Home {
  export class Monkey {}
  export const a = 1;
}
namespace Home {
  export class Monkey1 {}
  export const a1 = 1;
}
// ----------------------------------------------------------------

// 命名空间可以用来和类进行合并
class Home {}

namespace Home {
  export class Monkey1 {}
  export const a1 = 1;
}

Home.a1; // 1
Home.Monkey1;

// ----------------------------------------------------------------
//命名空间可以和函数进行合并
function Home() {}
namespace Home {
  export class Monkey1 {}
  export const a1 = 1;
}
Home.a; // 1
Home.Monkey1;

// ----------------------------------------------------------------
// 命名空间可以和枚举合并
namespace Home {
  export class Monkey1 {}
  export const a1 = 1;
}
enum Home {
  BABAY,
  WIFE
}
// ----------------------------------------------------------------

export {};
```

```ts
import { Zoo } from './15.namespace';

Zoo.Felid.cat;

// 我们通过 cdn 引入了一个库  jquery

$().css('color', 'red');
$().html('hello world');

$.fn.extend();

getArr('ABC');

String.prototype.xx = function () {};

window.__prod__;

// 将这个接口放到全局下， 一般不会使用
declare global {
  interface String {
    // 当前模块的string
    a: 'xxx';
  }
}

String.prototype.a = 'xxx';

// import Home from './home.vue' // vue-loader  vite-plugin/vue

// console.log(Home)

import xx from './1.jpg';
import md from 'xx.md';

console.log(xx);

export {};
```

```ts
// 类型声明文件  全局的文件 可以在任何地方使用 （后缀是用.d.ts 来命名的） ts会检测根目录下的所有.d.ts文件

// 默认会扫描所有目录下 .d.ts (我们一般不建议把.d.ts 辅助文件放到src)

// 使用declare都是全局的 可以直接声明，但是不能有具体的实现
declare const jqurryName: string; // 就是为了代码提示不报错

declare function $(): {
  css(key: string, value: string): void;
  html(value: string): void;
};

// 代码提示都是 声明文件，不会走到真正的代码中
namespace $ {
  export namespace fn {
    function extend(): void;
  }
}

declare function getArr(key: number): number[];
declare function getArr(key: string): string[];

declare enum Seaons {
  spring,
  summer,
  autum,
  winter
}

// 直接就合并到了全局的接口上
interface String {
  //interface 同名的可以合并
  xx: () => void;
}

interface Window {
  __prod__: 'proudction';
}

declare module '*.vue' {
  // shim-vue.d.ts
  // export let vue:string
  export default 'hello ';
}

declare module '*.jpg';
declare module '*.md';

// 仅仅是使用ts的时候 有些变量没有 我声明后能 欺骗编辑器，具体的逻辑还是要你自己写的
```



### 类型声明文件

一个声明文件就是一个全局的文件，可以在任何地方使用。后缀是.d.ts 声明的。ts 会检测根目录下及其后代目录下的所有.d.ts 文件。我们一般不建议将.d.ts 辅助文件放到 src 目录下。

my.d.ts:

```ts
// 使用declare声明的类型都是全局的，可以直接声明，但是不能有具体的实现。 就是为了代码提示不报错
declare let jQuery: string;

// declare可以声明变量，函数，类，枚举等等

// 声明全局变量，可以项目的任何地方访问
declare function $(): {
  css(key: string, value: string): void;
  html(value: string): void;
};

// 如果在一般ts文件中而不是.d.ts文件中，则不会对上面的declare $ 进行扩展
namespace $ {
  namespace fn {
    function extend(): void;
  }
}

// $.fn.extend()

// 函数重载
declare function getArr(key: number): number[];
declare function getArr(key: string): string[];
```

一般项目中会有一个和 src 平级的目录，typing 放自己的 或者 types 放第三方.d.ts 文件

```ts
declare enum STATUS {
    OK:200,
    NOT_FOUND：404
}

// 全局同名接口自动合并到全局的同名的接口中
interface String {
    xx:()=>void   // 扩展原型方法
}


declare global {
    interface String {
        a:'xxxx'
    }
}

```

以下是一些常见的 `.d.ts` 文件放置位置的示例：

1. 根目录：将所有的 `.d.ts` 文件都放置在项目的根目录下。这种方式可以使得所有的声明文件集中在一个地方，方便查找和管理。

   ```
   ├── src/
   │   ├── index.ts
   │   └── ...
   ├── typings/
   │   ├── library1.d.ts
   │   ├── library2.d.ts
   │   └── ...
   ├── tsconfig.json
   └── ...
   ```

2. 相同目录：将每个 `.d.ts` 文件与相应的代码文件放置在同一个目录下。这种方式可以使得每个模块或库的声明文件与其对应的代码文件紧密关联，方便维护。

   ```
   ├── src/
   │   ├── index.ts
   │   ├── library1/
   │   │   ├── library1.ts
   │   │   └── library1.d.ts
   │   └── library2/
   │       ├── library2.ts
   │       └── library2.d.ts
   ├── tsconfig.json
   └── ...
   ```

   



### 声明模块

在项目中，当使用一些第三方包的时候，这些没有对 ts 进行支持的第三方包暴露的变量或者函数，直接在项目中使用时，因为 ts 没有检测到对应的数据类型而会提示错误，这时就需要自己去定义全局的.d.ts 文件去解决报错提示。

```ts
declare module '*.svg' {
  const path: string;
  export default path;
}

declare module '*.bmp' {
  const path: string;
  export default path;
}

declare module '*.gif' {
  const path: string;
  export default path;
}

declare module '*.jpg' {
  const path: string;
  export default path;
}

declare module '*.jpeg' {
  const path: string;
  export default path;
}

declare module '*.png' {
  const path: string;
  export default path;
}

declare module '*.png'; // 让ts可以解析一些没有的文件，让ts可以识别而不报错

declare module '*.tsx' {
  export let name: string;
}

// ------------------------------------

import Home from './components/home.tsx';
// 在ts中会报错，找不到模块
Home.name; // 会提示有name属性

// 当引入.vue文件时，该文件导出的数据就是component类型的    声明模块就是为了不报错
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

### 

## 书籍阅读

- HTML5技术增强了web应用的能力边界
- nodejs让服务器可以运行js项目
- Electron解决跨平台桌面端应用程序开发
- TensorFlow.js为js引入机器学习



- 业务场景变多，业务逻辑变复杂

- 前端项目规模急剧增加

- js本身是一门动态弱类型的语言，不适合开发大型复杂应用

- ECMAScript新特性的支持性存在环境差异

- 敏捷开发以应对多变的需求

- 跳转到定义和重命名标识符的缺少

  

在TypeScript语言的知识结构中至少包含了以下两大部分：

- JavaScript语言编程。
- TypeScript新增的语言特性以及核心的类型系统。



### TS介绍

TS产生背景，解决的问题。

TypeScript代码不能直接运行，它需要先被编译成JavaScript代码然后才能运行。Type-Script编译器（tsc）将负责把TypeScript代码编译为JavaScript代码。

TS的基本设计原则：

- TypeScript应该生成简洁、符合编写习惯并易于识别的JavaScript代码；
- TypeScript不应该对代码进行激进的性能优化。

类型系统是TS的核心，为JS引入了静态类型支持，可以使用类型注解为程序添加静态类型信息。

TypeScript中的静态类型是可选的，它不强制要求为程序中的每一部分都添加类型注解。

TypeScript支持类型推导的功能，编译器能够自动推断出大部分表达式的类型信息，开发者只需要在程序中添加少量的类型注解便能拥有完整的类型信息。
