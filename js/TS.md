

大纲：

- 搭建 TypeScript 开发环境。
- 掌握 TypeScript 的基础类型、联合和交叉类型
- 类型断言及其作用和用法。
- TypeScript 中函数、类中的类型声明方式。
- 掌握类型别名、接口的作用和定义。
- 掌握泛型及其应用场景，熟练应用泛型。
- 灵活运用条件类型、映射类型与内置类型。
- 创建和使用自定义类型。
- 理解命名空间、模块的概念以及使用场景。
- TS 中的类型保护，装包拆包
- 类型推导。
- TypeScript 类型层级系统。
- 函数的协变与逆变。
- infer 的用法与技巧。
- 模板字符串类型。
- 灵活编写与运用类型声明文件，扩展 TypeScript 的类型系统。
- 详解 TS 中类型文件查找规则。
- 熟练使用装饰器，运用反射数据扩展装饰器的功能，实现控制反转、依赖注入。
- TSConfig 配置文件。
- TS 类型体操
- 实现一个完整的 Axios 库



## ts基础

开发环境搭建

方式一：

全局安装 typescript 库，通过命令行方式指定编译某个特定的 ts 文件或者某个目录下的所有 ts 文件，同时可以开启监控文件变化的能力

```shell
npm install typescript -g

tsc --init   // 创建一个tsconfig.json配置文件

tsc  // 执行编译
tsc --watch
```

tsconfig.json指导tsc如何进行打包，打包后的结果，打包后代码采用什么模块化方案等。

 

方式二：

在vscode中直接右键选择run code，直接让node运行ts代码。

这种方法需要安装两个东西：

1. coder runner 插件
2. npm install ts-node -g



方式三：

通过webpack，rollup等打包工具自动编译打包。

```sh
npm init -y

npm install typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve rollup-plugin-serve -D

npx tsc --init
```



rollup`配置操作`rollup.config.js

esm模块化规范写的代码需要打开package.json中的type字段为module。

同时esm中不支持commonjs中的__dirname和 \_\_filename字段，需要自己去构建这两个变量。

```js
import ts from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: "src/index.ts",  // 可以相对，可以绝对路径
  output: {
    format: "iife",
    file: path.resolve(__dirname, "dist/bundle.js"),
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    ts({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
    serve({
      openPage: "/public/index.html",  // script标签的src属性指向的是'/dist/bundle.js
      port: "3000",
    }),
  ],
};
```



`package.json`配置

```json
{
  "scripts": {
    "start": "rollup -c -w"
  },
  "type":"module"
}
```

tsconfig.json中module改为ESNext。



在vscode中可以针对typescript进行编辑器设置，比如使用对ts进行格式化，缩进，提示等。 	

![image-20250210142449885](D:\learn-notes\js\images\image-20250210142449885.png)





ts中类型分类：

1. 内置类型，node_modules/typescript/lib就是一系列内置的类型声明，
2. 内置的基础类型
3. 内置的高级类型
4. 第三方库提供类型
5. 自定义类型



在ts项目中，默认每个文件都是在全局下的，如果要避免不同文件中类型的重复定义或者冲突，需要开启文件的模块化，在文件中增加一句export {} 就标识这是一个开启了模块的ts文件。就能起到隔离的效果。



### 基础类型

在 TypeScript 中，`string` 和 `String` 看起来相似的类型，但有重要的区别。

1. **`string` 与 `String`**

- **`string`**：原始类型（primitive type），表示普通的字符串值。它表示的是一个由字符组成的基本数据类型，可以直接赋予字符串字面量（如 `"hello"`）。

  ```ts
  let name: string = "Alice";
  ```

- **`String`**：是 JavaScript 中的**内置对象类型**，它是一个对象类型，表示一个字符串对象。`String` 是 `string` 类型的**包装类**，它提供了方法和属性来操作字符串。例如，使用 `new String("hello")` 会创建一个 `String` 对象，而不是一个原始的字符串值。

  ```ts
  let nameObj: String = new String("Alice");
  console.log(nameObj.toUpperCase()); // "ALICE"
  ```

  注意：

  - `String` 是一个构造函数，它可以用来创建字符串对象，一般不推荐使用，因为它比原始的 `string` 类型更复杂，并且通常会导致不必要的对象包装，进而影响性能。
  - 在大多数情况下，应该使用原始的 `string` 类型，而不是 `String` 类型。

2. **总结和区别**

为什么应该避免使用 `String` 和 `Number`？

- **性能**：原始类型（`string` 和 `number`）通常更高效，因为它们是值类型，而 `String` 和 `Number` 是引用类型，会涉及到对象的创建和垃圾回收。
- **避免混淆**：使用原始类型时，代码更加简洁和清晰。包装类型对象（如 `new String()` 和 `new Number()`）可能会导致代码的复杂性增加，同时可能出现一些意外的行为。

例子：`string` vs `String` 

```ts
// string vs String
let primitiveStr: string = "Hello";  // 原始字符串
let objectStr: String = new String("Hello");  // 字符串对象
console.log(primitiveStr === objectStr);  // false, 因为原始类型与对象类型是不同的

```



TypeScript允许将基本类型的值赋给对应的包装对象类型的变量。这是因为JavaScript会自动将基本类型的值转换为对应的包装对象实例。

```ts
let a: string = "123";
let b: String = "456";
let d: String = new String("789");   // 这是合法的，因为字符串字面量会被隐式地转换为String对象

let c: string = new String("789"); // 不能将类型“String”分配给类型“string”。
```



### 类型层级

类型层级是类型系统中不同类型之间的**兼容性关系**和**继承关系**的抽象结构。它定义了**当一个类型的变量**（或表达式）**赋值给另一个类型的变量时，是否会被 TypeScript 编译器接受**、如何推断类型兼容性，以及类型之间的子类型/父类型关系。

任何类型都是any，unknown的子类型，而never是所有类型的子类型，中间包括各种原始类型、对象类型、联合类型等。这种层级结构在类型检查时起到关键作用，例如在变量赋值、函数参数传递、泛型约束等场景中，判断类型是否兼容。比如string**字面量**类型是string的子类型，而string又是string | number的子类型。



**类型层级的作用**

主要是确保类型安全，同时允许一定程度的灵活性。例如，**子类型的变量可以赋值给父类型的变量，但反过来不行**。函数参数的类型是否兼容也依赖于类型层级。比如，函数参数接受父类型时，可以传入子类型的值，因为子类型具有父类型的所有特性。

1. **类型兼容性检查**
   决定一个类型能否赋值给另一个类型（例如：子类型可赋值给父类型）。
2. **函数参数校验**
   控制函数参数的输入类型是否合法（例如：逆变与协变）。
3. **泛型约束**
   在泛型中限制类型参数的范围（如 `T extends SomeType`）。
4. **联合/交叉类型推导**
   推断联合类型（`|`）和交叉类型（`&`）的行为。
5. **类型推断优化**
   帮助 TypeScript 推断变量或表达式的类型。



类型层级可以视为一个树状结构，顶端是**最宽泛**的类型（如 `unknown`），底端是**最具体**的类型（如 `never`）。以下是关键层级关系：

#### **顶层类型（Top Types）**

- **`unknown`**：所有类型的父类型，表示“未知类型”，需类型断言或收窄后才能使用。
- **`any`**：动态类型，可赋值给任何类型，也可接受任何类型（绕过类型检查）。

```ts
let a: any = "hello";
let b: unknown = "world";
let c: string = a;     // ✅ any 可赋值给任何类型
let d: string = b;     // ❌ unknown 需断言：b as string
```

####  底层类型（Bottom Type）

- **`never`**：所有类型的子类型，表示“永不存在的值”（如抛出错误或死循环）。

  ```ts
  function error(): never {
    throw new Error();
  }
  let e: string = error(); // ✅ never 可赋值给任何类型
  ```

####  **原始类型层级**

- **字面量类型 < 单类型 < 联合类型**
  例如：`"hello"` 是 `string` 的子类型，`string` 是 `string | number` 的子类型。

  ```ts
  let s1: "hello" = "hello";
  let s2: string = s1;       // ✅ 字面量类型 → 父类型
  let s3: string | number = s2; // ✅ 单类型 → 联合类型
  ```

#### 对象类型层级

- **结构化子类型（Structural Subtyping）**
  如果类型 `A` 要求的属性或者方法在类型 `B` 中都有，且B类型还有一下额外的属性或者方法（且类型兼容），则 `B` 是 `A` 的子类型。

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

let animal: Animal = { name: "Milo" };
let dog: Dog = { name: "Buddy", breed: "Labrador" };

animal = dog; // ✅ Dog 是 Animal 的子类型（属性更多）
// dog = animal; // ❌ 缺少 breed 属性
```



#### **函数类型层级**

- **参数类型逆变（Contravariant）**
  函数参数的类型是父类型，但是该函数还可接该父类型对应的子类型（逆方向兼容）。
- **返回值类型协变（Covariant）**
  函数返回值的子类型可赋值给父类型。

```ts
type Handler = (arg: string) => void;

// 参数类型：父类型 → 可接受子类型的处理函数
const handler1: Handler = (arg: "hello") => {}; // ❌ 需要更宽泛的类型
const handler2: Handler = (arg: string) => {};  // ✅
const handler3: Handler = (arg: unknown) => {}; // ✅ 参数类型逆变

// 返回值类型：子类型 → 可赋值给父类型
type Factory = () => string;
const factory1: Factory = () => "hello";        // ✅
const factory2: Factory = () => "hello" as const;// ✅ 字面量是 string 的子类型
```



```ts
type Handler = (arg: string) => void;

// 参数类型：父类型 → 可接受子类型的处理函数
const handler1: Handler = (arg: "hello") => {}; // ❌ 需要更宽泛的类型
```

TypeScript中的函数参数类型兼容性规则。函数参数的赋值兼容性是**逆变**的，也就是说，**当把一个函数赋值给另一个函数类型时，参数类型必须是相同或者更宽泛的类型，而不是更具体的类型**。

Handler类型定义了一个参数为string的函数。用户尝试将一个参数类型为"hello"（字符串字面量类型）的函数赋值给Handler类型的变量。因为"hello"是string的子类型，更具体，所以按照逆变规则，这里应该是不允许的。这会导致类型错误，因为函数参数需要是string，而用户提供的函数参数只能接受更具体的类型"hello"，无法处理所有可能的string值。

**错误原因**

1. **函数参数类型兼容性问题**：

   - `Handler` 类型定义的参数是 `string`，表示它接受**任意字符串**。
   - 赋值的函数 `handler1` 的参数类型被显式标注为字面量类型 `"hello"`，这意味着它**只能接受值为 `"hello"` 的字符串**。
   - TypeScript 要求函数的参数类型在赋值时遵循**逆变（Contravariant）规则**，即参数类型必须**兼容或更宽泛**（而不是更具体）。

2. **类型安全性问题**：

   - 如果将 `handler1` 赋值给 `Handler` 类型，通过 `Handler` 调用它并传递任意字符串：

     ```typescript
     const handler: Handler = handler1;
     handler("world"); // 运行时实际调用的是 `handler1`，但 `handler1` 只能处理 `"hello"`
     ```

   - 这会导致潜在的运行时错误，因此 TypeScript 会在编译阶段阻止这种赋值。

**核心规则总结**

- **函数参数的赋值兼容性是逆变的**：目标类型的参数类型必须是当前函数参数类型的父类型（或相同类型）。
- **子类型参数无法赋值给父类型参数**：字面量类型 `"hello"` 是 `string` 的子类型，因此不符合逆变规则。



**为什么参数类型是逆变的？**

- **类型安全目标**：确保函数在被调用时，**实际传入的参数**始终满足函数内部对参数的所有操作。

- **示例**：

  ```typescript
  type Handler = (arg: string) => void;
  const handler: Handler = (arg: "hello") => {
    console.log(arg.toUpperCase());
  };
  
  // 如果允许赋值：
  handler("world"); // 实际传入 "world"，但函数内部期望的是 "hello" 的特有行为
  ```

  这里 `arg.toUpperCase()` 虽然对 `string` 有效，但如果函数内部依赖 `"hello"` 的特定逻辑（例如访问某个不存在于其他字符串的属性），则会导致运行时错误。





**类型层级示例**

**赋值兼容性**

```typescript
type A = string | number;
type B = string;
let a: A = "hello";
let b: B = a; // ❌ A 是 B 的父类型，不可赋值
let c: A = b; // ✅ B 是 A 的子类型
```



**联合与交叉类型**

```typescript
type C = { name: string };
type D = { age: number };
type E = C & D; // { name: string; age: number }（更具体，层级更低）
type F = C | D; // 只需满足 C 或 D 之一（更宽泛，层级更高）
```



**泛型约束**

```typescript
function log<T extends string>(value: T): T {
  console.log(value);
  return value;
}
log("hi");      // ✅ 字面量类型是 string 的子类型
log(String(42));// ✅
```

------

**类型层级的意义**

1. **类型安全**
   通过层级约束，避免非法的类型赋值（如 `number` 赋值给 `string`）。
2. **代码灵活性**
   允许子类型替换父类型（如 `Dog` 替换 `Animal`），支持多态。
3. **工具类型实现**
   内置工具类型（如 `Partial<T>`、`Pick<T>`）依赖类型层级的操作。
4. **框架与库设计**
   泛型和类型约束广泛应用于 React、Vue 等框架的类型定义。





协变、逆变、双向协变等概念。

**TypeScript的结构类型系统，即基于形状（属性）而非名义（名称）的类型兼容，比如两个接口如果结构相同，即使名称不同，也是兼容的。**

类型层级在类型检查、泛型、函数参数传递、类型推断等方面的应用，理解为什么需要这个概念。

联合类型和交叉类型在层级中的位置，比如string | number是string和number的父类型，而string & number（虽然实际不可能存在）是never。

根据TypeScript官方文档，类型层级中，never是最底层，所有类型的子类型。any和unknown是顶层，但any更为特殊，可以赋值给任何类型，也可以被任何类型赋值，而unknown只能赋值给any或unknown，需要类型断言。

在类型层级中，unknown是顶部的安全类型，any是不安全的顶部类型。其他类型如string、number等位于其下。**联合类型会生成更高层级的类型，而交叉类型则生成更低层级的类型。**例如，string | number的层级高于string和number，而string & number（如果可能的话）则更低，但实际可能为never。

所以，**结构类型系统下，类型兼容性是基于结构而非声明的，因此即使两个类型名称不同，只要结构兼容，就可以赋值。**这也影响了类型层级的关系。

总结来说，类型层级的作用包括确定类型之间的兼容性，指导类型检查，允许安全的类型替换，以及在泛型约束中限制类型参数的范围等。



**类型层级概念**

在ts中，所有的类型可以看作是一个层级结构，不同类型之间有父子关系。层级结构中的某些类型可以被认为是“更通用的”（supertype），而某些类型是“更具体的”（subtype）。例如，`number` 是一个具体的类型，而 `any` 是非常通用的类型，代表可以兼容任何类型。

**TypeScript 的主要类型层级：**

1. **`any` 类型**

   - `any` 是 TypeScript 中最顶层的类型，表示“任何类型”。任何类型的值都可以赋值给 `any` 类型，而 `any` 类型的值也可以赋值给任何其他类型。
   - 它是最宽松的类型，意味着它处于类型层级的最顶层，能兼容所有类型。
   - 使用 `any` 时，TypeScript 的类型检查器基本上就不会对其进行类型推断和检查。

   ```ts
   let a: any = 123; // 可以是数字
   a = 'hello'; // 也可以是字符串
   ```

2. **`unknown` 类型**

   - `unknown` 是比 `any` 更安全的顶层类型，表示“未知的类型”。它和 `any` 不同，不能直接赋值给其他具体类型，必须先进行类型检查或类型断言。
   - 它是所有类型的父类型，但在使用时必须进行类型检查，确保安全性。

   ```ts
   let b: unknown = 'hello';
   let c: string = b; // Error: 不能直接赋值，必须先检查
   ```

3. **`never` 类型**

   - `never` 是最底层的类型，表示“永远不会有值”的类型。比如一个永远不会返回值的函数（如抛出错误或无限循环的函数），它的返回类型就是 `never`。
   - 它是所有类型的子类型，意味着可以将 `never` 类型的值赋值给任何类型，但没有类型的值可以赋给 `never` 类型。

   
   
4. **原始类型**

   - TypeScript 支持的原始类型有 `string`、`number`、`boolean`、`symbol`、`null`、`undefined` 等。这些类型处于类型层级中较低的位置，比 `any` 和 `unknown` 更具体，但比 `never` 更通用。
   - 例如，`string` 是 `any` 的子类型，`null` 和 `undefined` 是所有类型的子类型（如果你启用了严格模式，情况会稍微不同）。

   ```ts
   let d: string = 'abc';
   let e: number = 123;
   ```

5. **对象类型**

   - TypeScript 中的对象类型（`object`）包括普通的对象、类、数组、函数等。这些类型可以具有更复杂的层次结构。例如，类和接口的继承关系就形成了它们自己的层级。
   - 对象类型通常是由多个属性和方法组成的结构化类型，可以有子类型（通过继承或接口实现）。

6. **联合类型和交叉类型**

   - 联合类型（`A | B`）是两个或多个类型的并集，意味着可以是多种类型中的任何一种。联合类型的层级通常是它的各个类型的公共父类型。
   - 交叉类型（`A & B`）是两个或多个类型的交集，意味着必须同时满足多个类型的约束。交叉类型的层级更具体，因为它同时具备所有参与类型的特征。

   ```ts
   let f: string | number = 'hello'; // 联合类型
   let g: { name: string } & { age: number } = { name: 'John', age: 30 }; // 交叉类型
   ```

7. **`void` 类型**

   - `void` 通常用于表示一个函数没有返回值，和 `never` 不同，`void` 表示函数可以返回 `undefined` 或不返回任何值。
   - 它可以出现在类型层级的中间，但不能赋值给其他具体类型（如 `string`）。

   ```ts
   function logMessage(): void {
     console.log('This function returns nothing.');
   }
   ```

**类型层级的兼容性**

在 TypeScript 中，类型的层次结构决定了类型的**兼容性**。类型兼容性基于结构性子类型（Structural Subtyping）规则。简单来说，一个类型可以赋值给另一个类型，如果它满足被赋值类型的结构要求。

兼容性规则的几个示例：

1. **更宽泛的类型兼容更具体的类型**

   - `any` 可以兼容所有类型。
   - `unknown` 虽然是顶层类型，但它不能直接赋值给其他具体类型。
   - `never` 是所有类型的子类型，可以赋值给任何类型，但无法从其他类型获取值。

   ```typescript
   let x: any = 42;
   let y: number = x; // 合法
   let z: never;
   // z = 42; // 错误，`never` 不能被赋值
   ```

2. **结构化类型的兼容性**

   - TypeScript 使用结构化类型系统，即两个类型的兼容性是基于它们的属性和方法是否匹配。一个对象的类型可以赋值给另一个对象类型，只要它具有所需的结构。

   ```ts
   interface A {
     name: string;
   }
   interface B {
     name: string;
     age: number;
   }
   let personA: A = { name: 'John' };
   let personB: B = { name: 'John', age: 30 };
   personA = personB; // 合法，因为 `personB` 具有 `name` 属性
   ```



### type

`type` 关键字用于创建类型别名（type alias），它可以用来定义任何类型的结构。类型别名可以用来简化复杂的类型定义，并提高代码的可读性和复用性。示例：

```ts
type Username = string;
type Age = number;
type IsAdmin = boolean;


type User = {
  name: string;
  age: number;
  isAdmin: boolean;
};


type ID = string | number;

type Coordinates = [number, number];

type Direction = 'north' | 'south' | 'east' | 'west';

type GreetFunction = (name: string) => string;
```



```ts
/ 交叉类型
type Point = { x: number; y: number };
type Point3D = Point & { z: number };
let point3D: Point3D = { x: 1, y: 2, z: 3 };


/ 映射类型
type Keys = 'name' | 'age';
type Person = { [K in Keys]: string };
let person: Person = { name: 'John', age: '30' };
// Equivalent to:
// type Person = {
//   name: string;
//   age: string;
// };
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

/ 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
let nonNullableValue: NonNullable<string | null> = 'Hello';
// let nonNullableValue: string

/ 类型查询
const obj = { name: 'John' };
type ObjType = typeof obj;
let anotherObj: ObjType = { name: 'Jane' };
// Equivalent to:
type ObjType = {
    name: string;
}
```



- **`type`** 不支持继承和扩展，但可以通过交叉类型实现类似的效果。
- **`type`** 不支持合并，定义相同的类型别名会导致编译错误。
- **`type`** 可以用于复杂的类型定义和类型操作，提高代码的可读性和复用性。





映射类型允许对类型的每个属性进行遍历和修改，这就像对属性名执行了一次“循环”。

```ts
type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K];
};

type Original = {
  name: string;
  age: number;
};

type ReadonlyOriginal = ReadonlyType<Original>;

// 结果类型：
// type ReadonlyOriginal = {
//   readonly name: string;
//   readonly age: number;
// }


type PartialType<T> = {
  [K in keyof T]?: T[K];
};

type Original = {
  name: string;
  age: number;
};

type PartialOriginal = PartialType<Original>;

// 结果类型：
// type PartialOriginal = {
//   name?: string;
//   age?: number;
// }


type ExtractStringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type Original = {
  name: string;
  age: number;
  address: string;
};

type StringKeys = ExtractStringProperties<Original>;

// 结果类型：
// type StringKeys = "name" | "address"



type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Original = {
  name: string;
  details: {
    age: number;
    address: {
      city: string;
    };
  };
};

type ReadonlyOriginal = DeepReadonly<Original>;

// 结果类型：
// type ReadonlyOriginal = {
//   readonly name: string;
//   readonly details: {
//     readonly age: number;
//     readonly address: {
//       readonly city: string;
//     };
//   };
// }
```



在自己编写类型的时候，使用type更多。在描述数据结构，比如接口的返回值的时候用接口更多一些。

接口可以继承type。



### 接口

对行为或者结构的描述。

接口主要用于定义对象，函数，类以及多种值的混合的类型

1. 接口中不能包含具体的实现（和抽象类进行对比）

2. type重在声明一个新的类型，interface重在对对象或者函数的描述

3. 定义的interface 不能再使用使用联合类型，接口内部的类型字段可以使用联合类型

   ```ts
   type IFn =
     | {
         a: string;
         b: number;
       }
     | {
         c: boolean;
       };
   
   interface IFn {
     a: string | number;
     b: number;
   }
   
   
   interface IFn {
         a: string;
         b: number;
       }
     | {
         c: boolean;
       };   // 错误写法
   ```

   

4. 已经定义好的一个type类型无法在对他直接进行扩展，只能修改该type的类型定义，且type不能重名，用交叉类型（`&`）来实现类似继承的效果

   ![image-20241117153002654](D:\learn-notes\js\images\image-20241117153002654.png)

5. 已经定义好的interface可以再次扩展，interface重名的情况下会合并

   ![image-20241117152920246](D:\learn-notes\js\images\image-20241117152920246.png)

6. interface可以通过扩展（`extends`）来继承多个接口

   ```ts
   interface A {
     name: string;
   }
   
   interface B extends A {
     age: number;
   }
   ```

7. interface 不支持条件类型或直接定义联合类型



声明类型：

接口描述对象

```ts
// type描述对象
type IObj = {
    name:string;
    age:number;
}

// 接口描述对象
interface IObj {
    name:string;
    age:number; 
}
```





接口描述函数

```ts
// type描述函数
type IFn = (a:string,b:number)=>void

type IFn = {
    (a:string,b:number):void
}

// 接口描述函数
interface IFn {
    (a:string,b:number):void
}
```



接口描述混合类型

```ts
// type描述混合；欸行
type IFn = {
    ():number
    count:number
}

// 接口描述函数
interface IFn {
    ():number
    count:number
}

```

![image-20241117165359259](D:\learn-notes\js\images\image-20241117165359259.png)

改为使用 `const` 定义后，TypeScript 不再报错的原因在于**类型推断和常量绑定的不同行为**。

![image-20241117165409432](D:\learn-notes\js\images\image-20241117165409432.png)

**`let` 的行为**

当使用 `let` 定义时，TypeScript 认为 `click` 是一个可以被重新赋值的变量，因此它无法安全地推断 `click` 的类型和行为。以下是具体的问题：

- 在 `let` 的场景下，`click` 的值是动态的，TypeScript 认为 `click` 的值可能被重新赋予一个与 `IFn` 不匹配的值。
- 在函数体中（`return click.count++`），`click` 的类型是一个动态变量，编译器无法保证此时 `click` 一定包含 `count` 属性。

由于 `let` 定义的变量可以被重新赋值，TypeScript 的类型检查变得更加严格，从而导致报错。

------

**`const` 的行为**

使用 `const` 定义时，`click` 被视为一个**常量绑定**，它的引用不能被重新分配。因此，TypeScript 能更安全地推断 `click` 的类型和结构。

**关键点**：

1. **绑定类型为 `IFn`**：
   - 使用 `const` 时，TypeScript 知道 `click` 永远不会被重新分配，因此 `click` 被严格绑定为 `IFn` 类型。
   - 编译器会确保 `click` 符合 `IFn` 的类型要求。
2. **函数引用的类型推断**：
   - 在函数内部（`return click.count++`），`click` 的类型已被确认为 `IFn`，并且编译器知道它包含 `count` 属性，因此不会报错。

------



**代码执行过程**

```ts
const click: IFn = () => {
    return click.count++;
};
click.count = 0;
```

1. `const click` 定义后，`click` 被绑定为 `IFn` 类型。
2. 编译器知道 `click` 包含 `count` 属性，因此在 `return click.count++` 时不会报错。
3. 因为 `click` 是常量，不能被重新赋值，因此类型检查时无需考虑其他可能性。



**为什么 `let` 和 `const` 的行为不同？**

- **`let`**：`click` 可以重新赋值，编译器需要处理更多的不确定性。因此，编译器在检查 `click` 是否符合接口要求时更加严格，尤其在匿名函数和属性绑定时容易出错。
- **`const`**：`click` 是不可重新赋值的，类型绑定是确定的。编译器可以安全地推断 `click` 的完整类型，并允许你在函数内部引用 `click.count`。

**总结**

- 使用 `const` 时，类型绑定更安全，避免了重新赋值导致的潜在类型不匹配问题，因此不会报错。
- 如果必须使用 `let`，可以通过**类型断言**或 **`Object.assign`** 等方式来显式满足接口要求。





### 模块和命名空间

模块和命名空间是**类型声明文件**的基础。

默认情况下写ts代码时，代码一般默认处在一个全局的空间中。

通过模块的方式或者命名空间的方式来进行划分

模块：外部模块

命名空间：内部模块

index.ts:

```ts
let name:string = 'asd'  // 报错，无法重新声明快范围变量name
```

这时的代码就在一个全局的空间中。通过模块或者命名空间来将这个文件单独划分为一个空间，避免声明的冲突。

主要采用es6的模块规范来创建空间，如果文件中含有import或者export，就被认为是一个独立的空间，不会和其他空间相互影响。

```ts
let name:string = 'asd' 

export {}
```



在ts中，esm规范模块可以打包成amd规范，也可打包成commonjs规范。

源码都是esm：

index.ts

```ts
import a from "./a";
console.log(a);
```

a.ts

```ts
export default "ad";
```

tsconfig.json

```json
{
  "compilerOptions": {
      "module": "AMD"
  }
}
```

npx tsc 

编译后生成代码：

index.js

```ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./a"], function (require, exports, a_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    a_1 = __importDefault(a_1);
    console.log(a_1.default);
});
```

a.js

```js
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "ad";
});
```





tsconfig.json

```json
{
  "compilerOptions": {
      "module": "CommonJS"
  }
}
```

npx tsc 

编译后生成代码：

index.js

```ts
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const a_1 = __importDefault(require("./a"));
console.log(a_1.default);

```

a.js

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "ad";
```





但是使用tsc编译commonjs规范时，无法将其打包为amd规范文件。即使tsconfig.json中的 "module": "AMD" 也是不会生效的，打包后的文件还是和打包前的文件一样，没有任何变化。 对于"module": "ESNext" 也是一样不会生效，commonjs规范无法打包为esm规范。

源码都是commonjs：

index.ts

```ts
const a = require("./a");
console.log(a);
```

a.ts

```ts
module.exports = "asd";
```

tsconfig.json

```json
{
  "compilerOptions": {
      "module": "AMD"   // ESNext也是一样的效果
  }
}
```

npx **tsc**

编译后生成代码：

index.js

```ts
"use strict";
const a = require("./a");
console.log(a);

```

a.js

```js
"use strict";
module.exports = "asd";
```



对于一些早期的第三方库，它使用的是commonjs规范，但是我们自己的项目是esm模块化规范。

但是如果我的项目使用的是commonjs规范，同时还想在源码中使用esm规范，两者之间要搭配使用。

比如：

index.ts

```ts
const a = require("./a");
console.log(a);
```

a.ts

```ts
module.exports = "asd";
```

tsconfig.json

```json
{
  "compilerOptions": {
      "module": "CommonJS"  
  }
}
```

会报错如下：

![image-20241120142125212](D:\learn-notes\js\images\image-20241120142125212.png)

如果目标环境需要混合使用 CommonJS 和 ES Modules，可以使用 `esModuleInterop` 和 `allowSyntheticDefaultImports`：

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```





在 TypeScript（TS）中，**模块** 是一种将代码组织成逻辑单元的方法，用于封装变量、函数、类等，避免全局作用域污染，同时便于代码的复用、维护和管理。

**模块的定义**

- 模块是一个有自己作用域的文件或代码单元，其中定义的变量、函数、类等默认不暴露到全局作用域。
- **每个 TypeScript 文件只要它使用了 `export` 或 `import` 关键字，都是一个模块**。



**模块分类**

在 TypeScript 中，模块主要分为两种：

1. **内部模块（Internal Modules）**（已废弃）：

   - 以前 TypeScript 中使用 `namespace` 关键字来创建模块，称为“内部模块”。

   - 现代 TypeScript 不推荐这种用法，建议使用外部模块。

   - 示例：

     ```ts
     namespace MathOperations {
       export function add(a: number, b: number): number {
         return a + b;
       }
     }
     console.log(MathOperations.add(1, 2)); // 输出: 3
     ```

2. **外部模块（External Modules）**：

   - 基于文件级模块系统（ES Modules），通过 `import` 和 `export` 实现模块化。

   - 示例：

     ```ts
     // math.ts
     export function add(a: number, b: number): number {
       return a + b;
     }
     
     // main.ts
     import { add } from "./math";
     console.log(add(1, 2)); // 输出: 3
     ```

**模块的作用**

**避免命名冲突**

模块提供了独立的作用域，防止同名变量、函数、类等在全局作用域中互相覆盖。例如：

```ts
// file1.ts
export const name = "Module1";

// file2.ts
export const name = "Module2";

// main.ts
import { name as name1 } from "./file1";
import { name as name2 } from "./file2";

console.log(name1, name2); // 输出: Module1 Module2
```



**提高代码复用性**

模块允许将通用功能封装起来，在不同的地方通过导入使用，减少重复代码：

```ts
// utils.ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// app.ts
import { greet } from "./utils";
console.log(greet("Alice")); // 输出: Hello, Alice!

```

**提高代码的可维护性**

通过模块化，代码可以按照功能拆分为多个文件，便于团队协作和后期维护。例如，按功能拆分为：

- `user.ts`（用户相关逻辑）
- `auth.ts`（身份认证相关逻辑）
- `db.ts`（数据库操作相关逻辑）



**支持动态加载**

借助 ES Modules 的动态导入（`import()`），模块可以在运行时按需加载，提升应用性能：

```ts
async function loadModule() {
  const { greet } = await import("./utils");
  console.log(greet("Bob"));
}
loadModule();
```





在 TypeScript 中，**命名空间**（`namespace`）是一种将代码组织在逻辑分组内的机制，用于在同一项目中管理变量、函数、类和接口的作用域。它可以防止命名冲突，同时保持代码的结构清晰。



#### **命名空间的定义和用法**

#### **定义命名空间**

使用 `namespace` 关键字来定义命名空间：

```ts
namespace MyNamespace {
  export const greeting = "Hello, World!";

  export function sayHello(name: string): string {
    return `${greeting} My name is ${name}.`;
  }

  export class Greeter {
    constructor(private name: string) {}

    greet(): string {
      return `Hello, ${this.name}!`;
    }
  }
}


namespace App {
  export namespace MathUtils {
    export function square(x: number): number {
      return x * x;
    }
  }

  export namespace StringUtils {
    export function capitalize(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
}

console.log(App.MathUtils.square(4)); // 输出: 16
console.log(App.StringUtils.capitalize("typescript")); // 输出: Typescript
```

#### **使用命名空间**

由于命名空间中的成员默认是私有的，需要通过 `export` 关键字导出才能在命名空间外部访问。

```ts
// 访问命名空间中的成员
console.log(MyNamespace.greeting); // 输出: Hello, World!
console.log(MyNamespace.sayHello("Alice")); // 输出: Hello, World! My name is Alice.

const greeter = new MyNamespace.Greeter("Bob");
console.log(greeter.greet()); // 输出: Hello, Bob!
```

#### **多文件命名空间**

可以将一个命名空间拆分到多个文件中，**但需要确保在编译时这些文件被正确组合**。例如：

**文件 1：`file1.ts`**

```ts
namespace MyNamespace {
  export const greeting = "Hello from File 1";
}
```

**文件 2：`file2.ts`**

```ts
namespace MyNamespace {
  export function greet(): string {
    return greeting;
  }
}
```

编译时将它们合并：

```bash
tsc --outFile combined.js file1.ts file2.ts
```

在 `combined.js` 中，`MyNamespace` 会合并为一个统一的对象。



#### **命名空间的应用场景**

1. **防止命名冲突**

   - 当多个模块或组件中有相同的类名、函数名、常量名时，命名空间可以将它们隔离，避免命名冲突。

   **示例：**

   ```ts
   namespace MathUtils {
     export function add(x: number, y: number): number {
       return x + y;
     }
   }
   
   namespace StringUtils {
     export function add(x: string, y: string): string {
       return x + y;
     }
   }
   
   console.log(MathUtils.add(1, 2)); // 输出: 3
   console.log(StringUtils.add("Hello, ", "World!")); // 输出: Hello, World!
   ```

2. **逻辑分组**

   - 将相关的代码（如工具函数、常量或类）组织在一起，方便管理和理解。

   **示例：**

   ```ts
   namespace Utils {
     export function formatDate(date: Date): string {
       return date.toISOString().split("T")[0];
     }
   
     export function capitalize(str: string): string {
       return str.charAt(0).toUpperCase() + str.slice(1);
     }
   }
   
   console.log(Utils.formatDate(new Date())); // 输出: 当前日期
   console.log(Utils.capitalize("typescript")); // 输出: Typescript
   ```

3. **封装大型项目的模块**

   - 在大型项目中，可以使用命名空间为每个模块创建独立的逻辑分组，而不需要引入额外的模块化工具。

   **示例：**

   ```ts
   namespace UserModule {
     export interface User {
       id: number;
       name: string;
     }
   
     export class UserService {
       private users: User[] = [];
   
       addUser(user: User): void {
         this.users.push(user);
       }
   
       listUsers(): User[] {
         return this.users;
       }
     }
   }
   
   const userService = new UserModule.UserService();
   userService.addUser({ id: 1, name: "Alice" });
   console.log(userService.listUsers()); // 输出: [{ id: 1, name: "Alice" }]
   ```

   

4. **命名空间与接口结合**

   命名空间可以扩展接口，将接口分组到命名空间中管理。

   ```ts
   namespace Models {
     export interface User {
       id: number;
       name: string;
     }
   
     export interface Product {
       id: number;
       title: string;
       price: number;
     }
   }
   
   const user: Models.User = { id: 1, name: "Alice" };
   const product: Models.Product = { id: 1, title: "Laptop", price: 1500 };
   
   console.log(user, product);
   ```

5. **命名空间与类结合**

   命名空间可以用来组织类，将类按照功能分组。

   ```ts
   namespace Shapes {
     export class Circle {
       constructor(public radius: number) {}
   
       area(): number {
         return Math.PI * this.radius * this.radius;
       }
     }
   
     export class Rectangle {
       constructor(public width: number, public height: number) {}
   
       area(): number {
         return this.width * this.height;
       }
     }
   }
   
   const circle = new Shapes.Circle(5);
   console.log(circle.area()); // 输出: 78.53981633974483
   
   const rectangle = new Shapes.Rectangle(4, 5);
   console.log(rectangle.area()); // 输出: 20
   
   ```

6. **命名空间与模块化结合**

   命名空间可以分布在多个文件中，通过 `--outFile` 或手动引入来合并。这样可以组织大型项目，同时避免全局污染。

   #### **多文件组织示例**

   **文件 1：`MathUtils.ts`**

   ```ts
   namespace Utils {
     export namespace Math {
       export function add(a: number, b: number): number {
         return a + b;
       }
     }
   }
   ```

   **文件 2：`StringUtils.ts`**

   ```ts
   namespace Utils {
     export namespace String {
       export function toUpperCase(str: string): string {
         return str.toUpperCase();
       }
     }
   }
   ```

   **文件 3：`main.ts`**

   ```ts
   /// <reference path="./MathUtils.ts" />
   /// <reference path="./StringUtils.ts" />
   
   console.log(Utils.Math.add(10, 20)); // 输出: 30
   console.log(Utils.String.toUpperCase("hello")); // 输出: HELLO
   ```

   编译时合并：

   ```bash
   tsc --outFile dist/app.js MathUtils.ts StringUtils.ts main.ts
   ```

7. **外部命名空间（声明文件中的用法）**

   在与全局变量或外部库（如 jQuery）交互时，可以使用命名空间声明外部依赖。

   ```ts
   // 定义一个全局 jQuery 对象的类型声明
   declare namespace jQuery {
     export function ajax(url: string, settings: any): void;
     export function on(event: string, handler: () => void): void;
   }
   
   // 使用外部依赖
   jQuery.ajax("http://example.com", { method: "GET" });
   jQuery.on("click", () => console.log("Clicked!"));
   ```

8. **合并命名空间与函数、类**

   命名空间可以与函数或类合并扩展。

   ```ts
   function Counter() {
     let count = 0;
     return {
       increment: () => count++,
       getCount: () => count,
     };
   }
   
   namespace Counter {
     export function reset() {
       console.log("Counter reset!");
     }
   }
   
   const counter = Counter();
   counter.increment();
   console.log(counter.getCount()); // 输出: 1
   Counter.reset(); // 输出: Counter reset!
   
   
   
   
   
   
   class Greeter {
     constructor(public name: string) {}
     greet(): string {
       return `Hello, ${this.name}`;
     }
   }
   
   namespace Greeter {
     export const defaultName = "World";
   }
   
   const greeter = new Greeter(Greeter.defaultName);
   console.log(greeter.greet()); // 输出: Hello, World
   ```

   



#### **命名空间 vs 模块**

**区别：**

| 特性         | 命名空间 (`namespace`)           | 模块 (`module` / ES Modules)                          |
| ------------ | -------------------------------- | ----------------------------------------------------- |
| **加载方式** | 编译后在全局共享一个作用域       | 每个模块在其作用域内运行                              |
| **使用场景** | 用于在单个文件或多文件中逻辑分组 | 用于更大的项目和模块化环境                            |
| **编译目标** | 内联到一个文件中（需手动合并）   | 原生支持，适用于现代模块化环境（如 Node.js 或浏览器） |
| **代码隔离** | 仅逻辑分组，无严格隔离           | 严格隔离，必须通过导入导出交互                        |
| **现代支持** | 已被模块化方案逐步取代           | 标准化的模块机制，推荐使用                            |

------

**推荐使用场景**

- **命名空间适用场景：**

  - 用于小型项目或工具库。
  - 不依赖现代模块化工具链时。
  - 需要与旧的 JavaScript 项目兼容时。

- **模块适用场景：**

  - 大型项目或现代 TypeScript 应用。

  - 使用 Webpack、Rollup 等工具进行打包时。

  - 与现代模块化生态（如 Node.js、ES Modules）集成时。

    

### export =

在 ts 中，`export =` 是一种用于兼容 **CommonJS** 和 **AMD** 模块系统的语法，用来表示一个模块的导出值。你在一些第三方库（如 lodash）的类型声明文件中看到 `export =`，通常是为了兼容这些库的非 ES Modules 风格的导出。

**`export =` 的用法**

- `export =` 语法用于导出模块的主对象或函数，而不是使用 `export` 或 `export default` 的方式。
- 它常见于那些以 **CommonJS** 风格导出的模块（如 `module.exports = ...`）。

#### **示例：`export =` 用法**

假设有一个模块如下：

```js
// commonjsModule.js (CommonJS 模块)
const lodash = require("lodash");
module.exports = lodash;
```

对应的 TypeScript 类型声明可能是：

```ts
// index.d.ts
declare const lodash: {
  chunk: (array: any[], size: number) => any[]; // 仅举例说明
  // ...其他 lodash 的方法
};
export = lodash;
```

在这种情况下，TypeScript 用户可以通过以下方式使用它：

```ts
import lodash = require("lodash");

const result = lodash.chunk([1, 2, 3, 4], 2);
console.log(result); // 输出: [[1, 2], [3, 4]]
```



#### **`export =` 的作用**

**兼容 CommonJS**

许多老旧的库，如 `lodash` 和 `express`，使用 CommonJS 风格导出主对象，而不是 ES Modules 的 `export default` 或 `export`。为了在 TypeScript 中正确描述这些模块的类型，`export =` 提供了兼容方式。

**配合 `import = require`**

当使用 `export =` 时，TypeScript 要求使用 **`import = require`** 的语法来导入模块。这是为了符合 CommonJS 的导入风格。

------

** `export =` 和 `export default` 的区别**

| 特性         | `export =`                             | `export default`                   |
| ------------ | -------------------------------------- | ---------------------------------- |
| **适用场景** | 兼容 CommonJS 或 AMD 模块              | ES Modules 标准                    |
| **导入语法** | `import x = require("module");`        | `import x from "module";`          |
| **输出结构** | 导出整个模块为单一值                   | 导出默认值，其他值用 `export` 支持 |
| **兼容性**   | 适用于非 ES Modules 的库，如 lodash 等 | 适用于现代 JavaScript 模块         |

------

**如果想用 `import` 导入 `export =` 的模块**

对于使用 `export =` 的模块，TypeScript 默认要求使用 `import = require` 的方式导入。然而，如果你想使用现代的 `import` 语法，可以启用 `esModuleInterop` 或 `allowSyntheticDefaultImports` 选项：

**在 tsconfig.json 中：**

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**然后使用现代导入语法：**

```ts
import lodash from "lodash";

const result = lodash.chunk([1, 2, 3, 4], 2);
console.log(result); // 输出: [[1, 2], [3, 4]]
```

这两个选项告诉 TypeScript，将 `export =` 模块自动处理为默认导出，允许用 `import` 语法导入。

------

**总结**

- **`export =` 是为兼容 CommonJS/AMD 模块设计的语法**，用于描述 `module.exports` 的导出。
- 配合 **`import = require`** 使用，符合 CommonJS 风格。
- 如果希望使用现代 `import` 语法，可以启用 `esModuleInterop` 或 `allowSyntheticDefaultImports`。
- 在现代 TypeScript 项目中，尽量使用标准的 ES Modules 风格 (`export` 和 `export default`) 来编写代码，但在需要兼容老旧库时，`export =` 是必不可少的工具。



### 类型声明文件

正常情况下模块都是以ts或者js结尾的，很少有.vue,.jpg.png等结尾。

使用情况列举：

1. 项目中的代码有些是使用cdn引入
2. 有些包使用js写的，没有类型提示
3. 项目中使用了未提供官方类型声明的第三方库
4. 有些模块导入并不是导入的js，ts文件，而是图片等
5. 项目中存在全局变量、工具函数等需要定义类型
6. 定义项目内部的共享类型

这时就需要添加一些声明文件。

如果我只在某个ts文件中写如下代码：

```ts
declare let age:number
```

那么整个项目中的其他文件中使用age变量时，默认会提示类型错误信息。

如果希望整个项目下的所有文件中都能直接访问age而不报错，一般的做法是在项目的根目录下创建一个文件夹：typings，在里面创建一些`.d.ts`文件，然后将declare语句定义在里面。



在项目中创建一个 `typings` 目录，用来存放一系列的 `.d.ts` 类型声明文件，是一种常见的开发实践。

**清晰的组织结构**：将所有自定义的 `.d.ts` 文件集中放置在 `typings` 目录中，方便管理类型声明，避免类型定义散落在项目各处。

**区分类型声明与业务代码**：将类型定义与业务逻辑分离，便于维护和升级。

TypeScript 支持通过 `tsconfig.json` 的 `typeRoots` 字段指定类型声明文件的搜索路径。`typings` 是一个约定俗成的目录名称，开发者通常将其作为 `typeRoots` 的值：

```ts
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./node_modules/@types"]
  }
}
```

这样，TypeScript 编译器会优先从 `typings` 目录中加载类型声明。

有时第三方库的官方类型声明文件不完整或不准确，可以通过在 `typings` 中创建声明文件来补充或覆盖这些类型。

- 示例：补充第三方库的类型声明

```ts
// typings/custom-lodash.d.ts
declare module "lodash" {
  export function customMethod(param: string): string;
}
```

#### **目录结构示例**

```text
project/
│
├── src/               # 源代码目录
├── typings/            # 类型声明文件目录
│   ├── global.d.ts      # 定义全局变量类型
│   ├── third-party.d.ts  # 第三方库的补充类型声明
│   └── utils.d.ts       # 项目工具函数类型声明
├── tsconfig.json         # TypeScript 配置文件
```



#### **类型声明文件内容示例**

##### **1. 定义全局变量**

```
// typings/global.d.ts
declare const API_BASE_URL: string; // 全局常量
```

使用：

```
console.log(API_BASE_URL); // 提供类型检查和智能提示
```

------

##### **2. 为第三方库补充类型**

```
// typings/third-party.d.ts
declare module "some-library" {
  export function customFunction(param: number): void;
}
```

使用：

```
import { customFunction } from "some-library";
customFunction(123); // 提供类型支持
```

------

##### **3. 定义工具函数的类型**

```
// typings/utils.d.ts
declare namespace Utils {
  function log(message: string): void;
  function format(date: Date): string;
}
```

使用：

```
Utils.log("Hello, world!");
console.log(Utils.format(new Date()));
```

类型声明文件应该只包含类型定义，不应该包含任何实现代码。





在 TypeScript 中，写在 `.d.ts` 文件中的类型声明能够在项目的其他文件中直接使用，主要是因为 TypeScript 的编译器会自动加载这些声明文件并将它们的内容作为全局类型定义的一部分。这种机制来源于 TypeScript 的类型系统设计，以下是关键的原因和原理：

**TypeScript 自动加载 `.d.ts` 文件**

**全局类型声明**

- `.d.ts` 文件的内容可以声明全局作用域中的类型、变量或模块。

- TypeScript 编译器会在项目中自动发现并加载这些文件（如果配置得当）。

  ```ts
  // global.d.ts
  declare const API_BASE_URL: string; // 全局变量
  
  // src/main.ts
  console.log(API_BASE_URL); // 自动识别，无需额外导入
  ```

  

TypeScript 会根据项目的配置自动搜索 `.d.ts` 文件：

1. **`typeRoots` 配置**：

   - `tsconfig.json` 中的 `typeRoots` 决定了哪些目录会被搜索。

   - 默认情况下，TypeScript 会自动搜索 `node_modules/@types` 和项目中的全局声明文件。

     ```ts
     {
       "compilerOptions": {
         "typeRoots": ["./typings", "./node_modules/@types"]
       }
     }
     ```

2. **`include` 配置**：

   - `tsconfig.json` 中的 `include` 决定了哪些文件或目录会被 TypeScript 编译器加载。

     ```ts
     {
       "include": ["src/**/*.ts", "typings/**/*.d.ts"]
     }
     ```

     

#### **声明文件的作用范围**

**全局声明**

在 `.d.ts` 文件中使用 `declare` 声明的变量、类型或模块，默认会被视为全局可用。任何项目中的文件都可以直接使用这些声明，而不需要显式导入。

```ts
// typings/global.d.ts
declare const API_KEY: string;

// src/index.ts
console.log(API_KEY); // 自动识别 API_KEY 类型为 string
```

**模块声明**

如果 `.d.ts` 文件中的声明被写成模块形式（`declare module`），这些类型和变量只在导入时可用。

```ts
// typings/my-module.d.ts
declare module "my-module" {
  export function greet(name: string): string;
}

// src/index.ts
import { greet } from "my-module";
greet("Alice"); // 类型检查正常
```



#### **TypeScript 的类型合并机制**

TypeScript 会将 `.d.ts` 文件中的声明与项目中已有的类型合并，形成一个统一的类型系统。这种合并机制使得 `.d.ts` 文件中的声明可以无缝地与代码结合。

**全局合并**

多个 `.d.ts` 文件中的全局声明会自动合并到同一个全局作用域中。

```ts
// typings/global.d.ts
declare const VERSION: string;

// typings/env.d.ts
declare const NODE_ENV: "development" | "production";

// src/index.ts
console.log(VERSION, NODE_ENV); // 自动识别
```

**接口合并**

如果多个 `.d.ts` 文件中定义了同名接口，TypeScript 会自动将这些接口合并。

```ts
// typings/user.d.ts
interface User {
  id: number;
  name: string;
}

// typings/user-extra.d.ts
interface User {
  isActive: boolean;
}

// src/index.ts
const user: User = {
  id: 1,
  name: "Alice",
  isActive: true,
};
```



#### **使用 `.d.ts` 文件的典型场景**

**为全局变量定义类型**

- 全局变量通常由外部环境（如浏览器、Node.js）或框架提供，`.d.ts` 文件可以为这些变量添加类型声明。

  ```ts
  // typings/global.d.ts
  declare const APP_VERSION: string;
  declare function log(message: string): void;
  
  // src/index.ts
  console.log(APP_VERSION); // 提供类型提示
  log("Hello, world!"); // 类型检查正常
  ```

**为第三方库补充类型**

- 如果第三方库没有提供类型支持，可以通过 `.d.ts` 文件为它们补充类型声明。

  ```ts
  // typings/third-party.d.ts
  declare module "legacy-library" {
    export function init(config: object): void;
    export const version: string;
  }
  
  // src/index.ts
  import { init, version } from "legacy-library";
  init({ key: "value" });
  console.log(version);
  
  ```

**定义模块的类型**

- 如果项目中有自定义模块，可以通过 `.d.ts` 文件定义模块的类型信息。

  ```ts
  // typings/my-utils.d.ts
  declare module "my-utils" {
    export function parse(data: string): object;
    export function stringify(obj: object): string;
  }
  
  // src/index.ts
  import { parse, stringify } from "my-utils";
  
  const data = parse('{"key": "value"}');
  console.log(stringify(data));
  ```



**TypeScript 编译器会扫描项目中所有符合配置的 `.d.ts` 文件**，将它们的内容加载为全局或模块类型的一部分。

**`declare` 关键字会将类型声明注册到全局作用域或模块中**，使得项目中的其他代码可以直接访问这些类型声明，而不需要额外的导入。

**TypeScript 的类型合并机制**会将多个 `.d.ts` 文件中的声明整合到一个统一的类型系统中。



#### 非代码资源的声明

在 TypeScript 项目中引入图片、样式等非代码资源时，可能会出现类型报错，例如：`Cannot find module './image.png'` 或 `Cannot find module './style.css'`。这是因为 TypeScript 默认只能识别 `.ts` 和 `.js` 文件中的模块，对于非代码资源，需要手动定义类型声明。

以下是如何解决这些问题的方法：

**1. 为非代码资源创建类型声明**

可以通过创建 `.d.ts` 文件来定义这些资源的类型声明。例如：

**1.1 声明图片资源**

为图片文件（如 `.png`、`.jpg`、`.svg`）创建类型声明：

```ts
// typings/images.d.ts
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// typings/vue-shim.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

使用示例：

```ts
import logo from './logo.png';

console.log(logo); // 输出图片路径作为字符串
```

------

**1.2 声明样式文件**

为样式文件（如 `.css`、`.scss`）创建类型声明：

```ts
// typings/styles.d.ts
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
```

使用示例：

```ts
import styles from './style.css';

console.log(styles.className); // 提供类型检查和智能提示
```

------

**声明其他资源文件**

为其他类型的资源（如 `.json`、`.mp3`、`.mp4`）创建类型声明：

```ts
// typings/others.d.ts
declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.mp3' {
  const value: string;
  export default value;
}

declare module '*.mp4' {
  const value: string;
  export default value;
}
```



#### **使用现成的社区声明**

如果不想手动定义，可以直接安装社区维护的声明文件，例如：

**安装类型声明支持**

```bash
npm install --save-dev @types/css-modules
```

**使用声明**

安装的声明文件会自动生效，例如，`@types/css-modules` 会让你直接导入 `.css` 文件而不报错。

------

**总结**

当 TypeScript 项目中引入图片、样式等资源时，遇到类型提示报错可以通过以下步骤解决：

1. **创建 `.d.ts` 类型声明文件**，为图片、样式等资源定义类型。
2. **配置 `tsconfig.json`**，确保 TypeScript 加载声明文件。
3. **配置 Webpack 或 Vite**，支持非代码资源的打包。
4. **使用社区维护的类型声明**，如 `@types/css-modules`。

通过这些方法，你的项目将能够顺利引入这些资源，并获得类型检查和智能提示的支持。



#### **类型声明文件内容示例**

**类型声明文件**（Type Declaration Files）是ts中专门用来描述 JavaScript 代码或第三方库的类型信息的文件。类型声明文件的扩展名是 `.d.ts`，它不会包含实际的实现代码，仅仅提供代码的类型定义和接口描述。

类型声明文件的作用是为 TypeScript 提供静态类型检查和智能提示，即使是在使用用 JavaScript 编写的库时，也能获得完整的类型信息。



#### **类型声明文件的作用**

1. **为 JavaScript 项目提供类型支持**

- 如果项目是用 JavaScript 编写的，但希望使用 TypeScript 进行类型检查，类型声明文件可以定义类型信息，而不需要重写代码。

  ```ts
  // math.d.ts
  declare function add(x: number, y: number): number;
  
  // 使用 math.js（JavaScript 文件）
  const sum = add(1, 2); // TypeScript 能识别 add 的类型并进行检查
  ```

  

2. **为第三方库提供类型支持**

- 很多流行的 JavaScript 库（如 Lodash、jQuery）没有内置 TypeScript 支持，可以通过安装或编写类型声明文件，使 TypeScript 能正确推断和检查这些库的类型。

  ```ts
  import _ from "lodash";
  const arr = _.chunk([1, 2, 3, 4], 2); // 自动提供类型提示和错误检查
  
  ```

3. **提高开发体验**

- 类型声明文件能提供智能提示、自动补全功能，提高开发效率和代码质量。

  ```ts
  declare const API: {
    fetchData: (url: string) => Promise<any>;
    sendData: (url: string, data: any) => Promise<void>;
  };
  
  API.fetchData("https://example.com").then((data) => {
    console.log(data); // 提供智能提示
  });
  ```

  

#### **类型声明文件的基本写法**

**1. 定义全局变量的类型**

为全局变量定义类型，使 TypeScript 能识别它们。

```ts
// example.d.ts
declare const API_URL: string;
declare function fetchData(url: string): Promise<any>;
```

在 TypeScript 文件中使用：

```ts
console.log(API_URL); // 提供类型提示
fetchData(API_URL).then((data) => console.log(data)); // 类型检查正常
```

------

**2. 定义模块的类型**

如果需要为模块提供类型支持，可以使用 `declare module` 定义模块的类型。

```ts
// math.d.ts
declare module "math" {
  export function add(x: number, y: number): number;
  export function multiply(x: number, y: number): number;
}
```

使用：

```ts
import { add, multiply } from "math";

console.log(add(5, 10)); // 正确
console.log(multiply(2, 3)); // 正确
```

------



```ts
declare namespace _ {
  function a(): void;
  function b(): void;
  function c(): void;
}

// 导出为 CommonJS 模块
export = _;

// 同时将命名空间暴露为全局变量
export as namespace _;

```

#### **作用**

1. **声明命名空间**：将相关的函数、类、类型等归类到一个命名空间 `_` 中，方便在模块化或非模块化代码中使用。

2. 兼容 CommonJS 和全局变量

   ：

   - `export = _`: 表示将命名空间 `_` 导出为模块，兼容 CommonJS 写法（如 `require('_')`）。
   - `export as namespace _`: 允许在非模块化环境中（比如直接在浏览器中加载）通过全局变量 `_` 访问。

#### **使用场景**

- 用于声明一个库，既可以作为模块化代码（`import`/`require`）引入，又可以直接在全局环境中使用。
- 常见于既支持模块化导入、又支持全局暴露的库类型定义（如 `lodash`）。



**3. 使用接口和类型别名**

类型声明文件支持 TypeScript 的接口和类型别名，用来描述对象的结构。

```ts
// user.d.ts
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

type Role = "admin" | "editor" | "viewer";
```

使用：

```ts
const user: User = { id: 1, name: "Alice", isActive: true };
let role: Role = "admin";
```

------

**4. 声明命名空间**

类型声明文件可以定义命名空间来描述全局变量或模块。

```ts
// utils.d.ts
declare namespace Utils {
  function log(message: string): void;
  function error(message: string): void;
}
```

使用：

```ts
Utils.log("Hello, TypeScript!");
Utils.error("Something went wrong.");
```

------

#### **类型声明文件的分类**

**1. 内置类型声明**

TypeScript 自带的类型声明文件定义了许多核心功能和标准库（如 `Math`、`Array`、`Promise`）的类型信息。

**2. 第三方库的类型声明**

大多数流行的 JavaScript 库都有对应的类型声明文件，通常通过 **DefinitelyTyped** 项目提供。可以通过 npm 安装这些类型声明文件。

```bash
npm install --save-dev @types/lodash
```

安装后，直接在项目中使用：

```ts
import _ from "lodash";
const arr = _.chunk([1, 2, 3, 4], 2); // 类型检查正常
```

**3. 自定义类型声明**

如果使用的是内部模块或库，可以手动编写类型声明文件。

```ts
// custom-library.d.ts
declare module "custom-library" {
  export function customFunction(param: string): void;
}
```

------

#### **类型声明文件的使用场景**

1. **与未提供 TypeScript 支持的 JavaScript 代码或库配合使用**。
2. **为已有项目增加类型检查而不改动原代码**。
3. **定义全局变量或模块的类型信息**。
4. **为其他开发者提供类型支持，作为库的文档**。

------

#### **如何创建和使用类型声明文件**

**1. 自动生成类型声明文件**

TypeScript 可以从现有代码中生成 `.d.ts` 文件。

```bash
tsc --declaration --emitDeclarationOnly
```

**2. 手动创建类型声明文件**

新建 `.d.ts` 文件并将其放置在项目的 `types` 或其他约定位置。

**3. 配置 `tsconfig.json`**

确保 TypeScript 能找到类型声明文件。

```json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```



### TS 中类型文件查找规则

TypeScript 中的类型文件查找规则是指编译器如何寻找并解析类型声明文件（`.d.ts` 文件）以提供类型检查和自动补全支持。

#### **类型文件的查找范围**

TypeScript 会通过以下两种方式查找类型文件：

1. **显式类型声明**：通过 `/// <reference path="...">` 或 `import` 明确指定路径。
2. **隐式类型声明**：通过配置文件或默认规则，自动查找类型声明文件。

#### **查找步骤**

**2.1 模块解析策略**

TypeScript 支持两种模块解析策略：

- **`Node` 模块解析**（默认）：按照 Node.js 的模块解析规则查找文件。
- **`Classic` 模块解析**：为非模块化代码设计，更简单但限制较多。

可以在 `tsconfig.json` 中通过 `compilerOptions.moduleResolution` 指定：

```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

以下说明以 `Node` 模块解析为例。

------

#### **2.2 查找模块的 `.d.ts` 文件**

当导入一个模块时，TypeScript 按以下顺序查找模块的类型定义：

1. **查找同名文件或目录**

   - 如果导入的模块是 

     ```
     import x from './myModule'
     ```

     ，TypeScript 会依次查找：

     1. `./myModule.ts`
     2. `./myModule.tsx`
     3. `./myModule.d.ts`
     4. `./myModule/index.ts`
     5. `./myModule/index.tsx`
     6. `./myModule/index.d.ts`

2. **查找 `package.json` 中的 `types` 字段**

   - 如果导入的是一个包，例如 `import x from 'my-library'`，TypeScript 会读取 

     `node_modules/my-library/package.json`中的 `types`或 `typings`字段：

     ```json
     {
       "name": "my-library",
       "main": "dist/index.js",
       "types": "dist/index.d.ts"
     }
     ```

   - 如果 `types` 字段存在，TypeScript 会使用 `dist/index.d.ts` 作为类型定义文件。

3. **查找默认的 `index.d.ts` 文件**

   - 如果 `package.json` 中没有 `types` 字段，TypeScript 会尝试查找模块目录下的 `index.d.ts` 文件。

4. **查找全局类型声明**

   - 如果模块没有找到对应的 `.d.ts` 文件，TypeScript 会继续在全局类型声明目录（`typeRoots` 配置）中查找。



## tsconfig.json配置文件

理解每个配置项的作用。

npm init -y

npm install typescript -D

npx tsc --init



配置文件中的配置项分为几个部分：

- 项目部分，关于项目层面的优化

  ```json
   /* Projects */
      // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
      // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
      // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
      // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
      // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
      // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */
  ```

- 语言和环境部分

  ```json
      /* Language and Environment */
      "target": "ES2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
      // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
      // "jsx": "preserve",                                /* Specify what JSX code is generated. */
      // "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
      // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
      // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
      // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
      // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
      // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
      // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
      // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
      // "moduleDetection": "auto",   
  ```

- 模块部分的配置，编译后模块的模块化规范等

  ```json
   /* Modules */
      "module": "ESNext" /* Specify what module code is generated. */,
      // "rootDir": "./",                                  /* Specify the root folder within your source files. */
      // "moduleResolution": "node10",                     /* Specify how TypeScript looks up a file from a given module specifier. */
      // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
      // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
      // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
      // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
      // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
      // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
      // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
      // "allowImportingTsExtensions": true,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
      // "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
      // "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
      // "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
      // "noUncheckedSideEffectImports": true,             /* Check side effect imports. */
      // "resolveJsonModule": true,                        /* Enable importing .json files. */
      // "allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
      // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */
  
  ```

- 对js的支持部分

- 打包后输出文件的部分

- 转换部分

- 类型检测部分

- 其他，比如跳过类库的类型检测









### target

配置文件：tsconfig.json中的说明

在 `tsconfig.json` 文件中，`"target"` 字段指定 TypeScript 编译器编译后生成的 JavaScript 代码的 ECMAScript 目标版本。通过设置 `"target"`，可以控制 TypeScript 编译器生成的 JavaScript 代码的语法和特性，从而确保它在特定的 JavaScript 环境中运行。不同的目标值会影响编译后 JavaScript 代码的语法和可用的特性。

`target` 字段的常见值及其作用：

**ES3**

- 生成兼容 ECMAScript 3 的 JavaScript 代码，这是最早期的 JavaScript 标准，几乎所有的现代浏览器都可以支持。
- 不支持较新的 ECMAScript 特性（例如，箭头函数、类、模块等）。

**ES5**

- 生成符合 ECMAScript 5（2009年发布）的 JavaScript 代码。
- 支持 `Object.create`、`Array.isArray`、`JSON` 等方法，以及严格模式（strict mode），但仍不支持 `class`、箭头函数、async/await 等新特性。

**ES6 / ES2015**

- 生成符合 ECMAScript 6（2015年发布）的 JavaScript 代码。
- 支持类（`class`）、模块（`import` / `export`）、箭头函数、`let` / `const` 声明、模板字符串等新特性。
- 通常用于支持较新浏览器（如现代的 Chrome、Firefox）或 Node.js 环境。

**ES2016**

- 生成符合 ECMAScript 2016（也称为 ES7）的 JavaScript 代码。
- 引入了 `Array.prototype.includes` 等新特性。

**ES2017**

- 生成符合 ECMAScript 2017（也称为 ES8）的 JavaScript 代码。
- 引入了 `async`/`await` 语法，以及 `Object.entries`、`Object.values` 等方法。

**ES2018**

- 生成符合 ECMAScript 2018（也称为 ES9）的 JavaScript 代码。
- 支持异步迭代（`for-await-of`）、正则表达式的捕获组名称等。

**ES2019**

- 生成符合 ECMAScript 2019（也称为 ES10）的 JavaScript 代码。
- 包括 `Array.prototype.flat`、`Object.fromEntries` 等特性。

**ES2020**

- 生成符合 ECMAScript 2020（也称为 ES11）的 JavaScript 代码。
- 引入了空值合并运算符（`??`）和可选链（`?.`）等特性。

**ES2021**

- 生成符合 ECMAScript 2021（也称为 ES12）的 JavaScript 代码。
- 引入了逻辑赋值运算符（`&&=`, `||=`, `??=`）等特性。

**ES2022**

- 生成符合 ECMAScript 2022（也称为 ES13）的 JavaScript 代码。
- 引入了类字段（class fields）等新特性。

**ES2023**

- 生成符合 ECMAScript 2023（也称为 ES14）的 JavaScript 代码。

**ESNext**

- 生成最新版本的 ECMAScript 特性，支持 ECMAScript 标准中的所有最新特性。
- 这通常意味着你会得到实验性或尚未正式规范化的特性，适合希望跟上最新 JavaScript 特性的项目。



如果 `tsconfig.json` 文件中将 `target` 设置为 `ES3`，而 TypeScript 源代码中使用了较新的语言特性（如 `class`、箭头函数等），在编译后，TypeScript 编译器会尝试将这些现代的特性转译为 ES3 兼容的代码。由于 ECMAScript 3 并不支持 `class`、箭头函数等特性，TypeScript 会通过某些手段模拟这些特性，使得编译后的代码能在不支持这些现代特性的环境中运行。

下面是一些常见的转译结果：

1. **类（`class`）转译为函数构造器**

ES3 中没有 `class` 语法，因此 TypeScript 会将 `class` 转译为一个基于函数的构造器，模拟出类似的行为。

**源代码：**

```typescript
class Person {
    constructor(public name: string) {}
    greet() {
        console.log(`Hello, ${this.name}`);
    }
}
```

**编译后的 ES3 代码：**

```typescript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    console.log("Hello, " + this.name);
};
```

2. **箭头函数转译为普通函数**

ES3 不支持箭头函数，因此 TypeScript 会将箭头函数转换为普通函数，并且会手动绑定 `this`，以确保正确的上下文。

**源代码：**

```typescript
const greet = () => {
    console.log("Hello, world!");
};
```

**编译后的 ES3 代码：**

```typescript
var greet = function() {
    console.log("Hello, world!");
};
```

如果箭头函数是在类中使用，TypeScript 会特别处理，确保 `this` 指向正确的对象。

3. **`let` / `const` 转译为 `var`**

ES3 不支持 `let` 和 `const`，所以 TypeScript 会将它们转换为 `var`，这会导致作用域行为上的差异。`let` 和 `const` 具有块级作用域，而 `var` 具有函数级作用域。

**源代码：**

```typescript
let x = 10;
const y = 20;
```

**编译后的 ES3 代码：**

```typescript
var x = 10;
var y = 20;
```

4. **箭头函数中的 `this` 问题**

箭头函数绑定了函数定义时的 `this`，而普通函数则是调用时绑定 `this`。在 ES3 中，由于没有箭头函数的语法，TypeScript 会生成普通函数，并且通过手动绑定 `this` 来模仿箭头函数的行为。

5. **`for...of` / `for...in` 转译为传统的 `for` 循环**

ES3 不支持 `for...of`，所以会转译为传统的 `for` 循环。

**源代码：**

```typescript
for (let item of array) {
    console.log(item);
}
```

**编译后的 ES3 代码：**

```typescript
for (var i = 0; i < array.length; i++) {
    var item = array[i];
    console.log(item);
}
```

总结

当你将 `target` 设置为 `ES3` 时，TypeScript 会尽力将现代的语言特性（如类、箭头函数等）转译为 ES3 可以理解的代码。这通常会导致生成的代码变得冗长且复杂，并且会失去一些现代特性（例如，`let` 和 `const` 的作用域行为）。这种设置一般适用于必须在非常旧的浏览器或 JavaScript 环境中运行的项目，但如果可以使用更新的 JavaScript 版本，建议使用更高的 `target` 设置，以充分利用现代 JavaScript 的特性和优化。







如果 `tsconfig.json` 中将 `target` 设置为 **ES2016**，那么编译后的 JavaScript 代码将会符合 ECMAScript 2016（即 ES7）标准，并且会支持大部分 ES6 的特性（如类、箭头函数等），以及 ES7 引入的特性。对于较新的 JavaScript 特性，TypeScript 编译器会根据目标版本生成相应的代码。

编译后的 ES2016 代码

一些具体的例子，如何从较新的 TypeScript 代码转译为 **ES2016** 代码。

1. **类（`class`）**

ES6 引入了 `class` 语法，并且 ES2016 仍然支持该语法，因此类的代码将保持原样。

**源代码：**

```typescript
class Person {
    constructor(public name: string) {}
    greet() {
        console.log(`Hello, ${this.name}`);
    }
}
```

**编译后的 ES2016 代码：**

```typescript
class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(`Hello, ${this.name}`);
    }
}
```

2. **箭头函数**

ES6 引入了箭头函数，ES2016 仍然支持箭头函数，因此箭头函数也会保持原样。

3. **`async` / `await`**

虽然 `async` / `await` 是在 **ES2017** 中引入的，但如果你的 `target` 是 **ES2016**，TypeScript 会将 `async` 函数转译为一个通过 **Promises** 实现的代码。这意味着，`async/await` 语法在编译时会被转换为基于 `Promise` 的代码。

**源代码：**

```typescript
async function greetAsync() {
    let greeting = await fetchGreeting();
    console.log(greeting);
}
```

**编译后的 ES2016 代码：**

```typescript
function greetAsync() {
    return fetchGreeting().then(function(greeting) {
        console.log(greeting);
    });
}
```

4. **`for...of`**

`for...of` 循环是 ES6 引入的，它用于迭代可迭代对象（如数组、字符串、Map、Set等）。ES2016 支持 `for...of` 循环，因此这种语法不会被转译。

5. **`let` 和 `const`**

`let` 和 `const` 是 ES6 中引入的，用于声明变量和常量。在 **ES2016** 中，它们被完全支持，因此它们的声明方式不会被转换。

6. **`Array.prototype.includes`**

ES2016 引入了 `Array.prototype.includes` 方法，该方法用于判断数组中是否包含某个元素。如果你的代码中使用了这个方法，并且你将 `target` 设置为 **ES2016**，则该方法会被保留在编译后的代码中。

**源代码：**

```typescript
let arr = [1, 2, 3];
console.log(arr.includes(2)); // true
```

**编译后的 ES2016 代码：**

```typescript
let arr = [1, 2, 3];
console.log(arr.includes(2)); // true
```

总结

当 `target` 设置为 **ES2016** 时，TypeScript 编译器将保留大部分 ES6 和 ES7 的特性，比如 `class`、箭头函数、`let` / `const` 声明、`for...of` 等，并且会正确地处理 ES7 引入的特性（如 `Array.prototype.includes`）。不过，`async` / `await` 等功能会被转译为基于 `Promise` 的代码，因为它们是在 **ES2017** 中引入的，不会原样保留。

因此，编译后的代码会比较简洁，符合 ES6/ES7 的语法，并且能够在支持 ES2016 的浏览器或环境中顺利运行。如果目标环境不支持 `async/await`，这些功能将通过 `Promise` 进行模拟。











下面这段typescript代码

```ts
type ICallback = (a:string,b:number,c:boolean) => string;
function fn(callback:ICallback){

}

fn(()=>{
    return 'abc'
})
```

这时typescript为什么不会报错，在调用fn时传的函数不应该必须有三个对应类型的实参参数吗？



在这段 TypeScript 代码中，TypeScript 不会报错的原因是 TypeScript 对函数参数的检查是**允许省略参数**的，这是一种宽松的类型检查机制。

根据 TypeScript 的函数类型检查规则，当你定义一个函数类型时，传递给这个函数的实参数量可以少于定义的参数数量。只要你传入的参数符合定义的参数类型，剩余的参数可以被省略。这是因为 JavaScript 本身允许函数参数是可选的，如果函数内部没有使用到某些参数，缺少这些参数不会导致错误。

来看你的例子：

```ts
type ICallback = (a: string, b: number, c: boolean) => string;
function fn(callback: ICallback) {}
fn(() => {
  return 'abc';
});
```

- `fn` 函数期望的 `callback` 类型是 `ICallback`，它有三个参数 `a: string`, `b: number`, `c: boolean`，并且返回一个 `string`。
- 然而，当你传递一个函数 `() => 'abc'` 时，这个函数没有接受任何参数，并且返回了一个 `string`。

根据 TypeScript 的规则，传递的函数**可以忽略掉不使用的参数**。尽管 `ICallback` 定义了三个参数，实际传递的回调函数没有使用这些参数，TypeScript 仍然认为这是一个有效的回调，因为函数的签名（输入和输出类型）是兼容的。

**核心原因：**

- TypeScript 允许你传递比定义中更少的参数，因为在 JavaScript 中，未提供的参数默认值是 `undefined`，因此从类型系统的角度来说，少于定义的参数数量是可以接受的。
- 只要你返回的类型（`string`）符合预期的返回类型，TypeScript 就会认为传入的函数符合 `ICallback` 类型。

因此，虽然 `ICallback` 定义了三个参数，但你不需要在回调函数中实际使用它们，这就是 TypeScript 不报错的原因。







```ts
type ICallback = (a:string,b:number,c:boolean) => string;
function fn(callback:ICallback){

}

fn(()=>{ })
```

那这段代码中为什么ts会提示错误了？

在这段代码中，TypeScript 会提示错误的原因是**回调函数的返回类型不符合预期**。

**具体解释**：

在 `fn` 函数中，`callback` 的类型是 `ICallback`，其签名如下：

```typescript
type ICallback = (a: string, b: number, c: boolean) => string;
```

这意味着 `callback` 函数必须接受三个参数：`a: string`、`b: number`、`c: boolean`，并且必须**返回一个 `string` 类型**的值。

但在下面这段代码中：

```ts
fn(() => {
  // 没有返回值
});
```

你传递的回调函数没有返回任何值，即回调函数的返回类型是 `void`，而 `ICallback` 期望的返回类型是 `string`。TypeScript 会在这里报错，因为返回类型不符合预期。

**错误提示的原因：**

- 回调函数的签名规定了返回类型必须是 `string`，但你传递的回调函数没有返回任何值（`undefined`），这与 `ICallback` 中定义的返回类型不匹配。

TypeScript 提示的错误大致会是：

```python
Type '() => void' is not assignable to type '(a: string, b: number, c: boolean) => string'.
```

**如何修复这个错误：**

你有两种选择来修复这个问题：

1. **提供一个返回值**，以符合 `ICallback` 的类型要求：

   ```ts
   fn(() => {
     return 'some string';  // 确保回调函数返回一个字符串
   });
   ```

2. **修改 `ICallback` 的定义**，如果你不需要回调函数返回值，可以将返回类型改为 `void`：

   ```ts
   type ICallback = (a: string, b: number, c: boolean) => void;  // 改为返回 void
   ```

总结，TypeScript 会报错是因为回调函数的返回类型与预期的 `string` 类型不匹配。



**为什么上面这个问题中的第二种修改 ICallback 的定义的将string返回值变为void就可以了了？string类型应该不能赋值给viod类型吗？**

深入探讨一下为什么将返回类型从 `string` 改为 `void` 之后代码就不会报错了，尽管 `string` 类型和 `void` 类型看似互不兼容。

**回调函数返回类型问题的背景：**

在 TypeScript 中，`void` 类型表示函数不返回值，或者说它的返回值是 `undefined`。这意味着在函数的上下文中，如果一个函数返回 `void`，它并不强制要求返回值。

**原因分析：**

当你把 `ICallback` 的返回类型改为 `void` 时，像这样：

```typescript
type ICallback = (a: string, b: number, c: boolean) => void;
```

这意味着 `callback` 函数现在**不需要**返回任何值。因此，当你传递一个不返回值的回调函数时，TypeScript 认为这是有效的，因为 `void` 允许没有返回值或者返回 `undefined`。例如：

```typescript
fn(() => {
  // 不需要返回值，符合 (a: string, b: number, c: boolean) => void
});
```

**为什么 `void` 可以接受 `string` 类型的返回值：**

在 TypeScript 中，函数的返回类型 `void` 和其他返回类型（如 `string`）有一个**特殊的兼容性规则**。具体表现为：

- **`void` 可以兼容任意返回类型**：当 TypeScript 判断一个函数返回 `void` 时，它并不严格检查函数是否返回了某个具体的值，哪怕实际上函数返回了一个值（例如 `string`），TypeScript 也不会报错。这是因为 `void` 本质上表示 "不关心返回值"。

  例如，以下代码是合法的：

  ```typescript
  type ICallback = () => void;
  fn(() => {
    return 'abc';  // 实际上返回了一个字符串，但不会报错
  });
  ```

- **`void` 允许忽略返回值**：当你把返回类型定义为 `void` 时，TypeScript 表示你可以忽略这个函数的返回值。因此，即使函数返回了一个 `string`，但因为类型是 `void`，TypeScript 不会关心并忽略掉这个返回值。

  反之，如果你将返回类型定义为 `string`，那么 TypeScript 会强制要求回调函数必须返回一个 `string`，否则会报错。这就是你之前遇到的问题。

**总结：**

- 当你将返回类型从 `string` 改为 `void` 时，TypeScript 允许你在回调函数中不返回任何值，甚至返回一个非 `void` 类型的值也不会报错。因为 `void` 类型的兼容性规则允许忽略函数的实际返回值，即便它返回了 `string` 类型的值，TypeScript 也会忽略。
- 但是，如果返回类型是 `string`，TypeScript 则会强制要求回调函数返回一个 `string`，否则会报错。

这个规则使得 `void` 类型更加灵活，而 `string` 类型则更加严格。





**只读数组**

只读数组只允许程序读取数组中的元素而不允许修改数组元素。TS中定义只读数组的方式：

1. `ReadonlyArray<T>`内置类型

   ```ts
   const color:ReadonlyArray<number> = [255,0,0]
   ```

2. readonly修饰符

   ```ts
   const color:readonly number[] = [255,0,0]
   ```

   readonly修饰符不能与泛型数组类型一起使用，比如下面的写法是不允许的：

   ```ts
   const color:readonly Array<number> = [255,0,0]
   ```

3. `Readonly<T>`内置工具类型

   该工具类型用于定义只读对象类型。它能够将类型参数T中的所有属性转为只读属性，它的源码定义如下：

   ```ts
   type Readonly<T> = {
     readonly [P in keyof T]:T[P]
   }
   ```

   使用：

   ```ts
   const color:Readonly<number[]> = [255,0,0]
   ```

只读数组：

```ts
const color:readonly number[] = [255,0,0]

console.log(color[0])

color[0] = 100 // 提示报错

// 只读数组也不支持会修改数组元素的方法，如push，pop等。

color.push(255) // 提示报错
```

进行赋值操作时，可以将一般数组赋值给一个只读数组类型的变量，但是不能将只读数组赋值给一个一般数组类型的变量。

```ts
const a:number[] = [0]
const ra:readonly number[] = [0]

const x:readonly number[] = a
const y:number[] = ra
```





## 元组

TS中元组是数组类型的子类型，元组是长度固定的，且每个元素的数据类型都确定的数组。

```ts
[type1,type2,...,typen]
```

元素的数量和类型都必须一一对应与兼容。

**只读元组**

只读元组是只读数组的子类型，定义只读元组如下：

1. readonly 修饰符
2. `Readlony<T>`工具类型

```ts
const point:readonly [number.number] = [0,0]
const point:Readlony<[number.number]>= [0,0]
```

**可选元素**

```ts
[type1,type2?,...,typen?]
```

**剩余元素**

```ts
const tuple:[number,...string[]]
```



## 对象类型

TS中提供了多种定义对象类型的方式：

1. Object类型
2. object类型
3. 对象类型字面量



**Object类型**

JS中的Object是一个构造函数，它的在TS中对应的定义如下：

```ts
interface ObjectConstructor {
    new(value?: any): Object;
    (): any;
    (value: any): any;
    readonly prototype: Object;
    getPrototypeOf(o: any): any;
    getOwnPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | undefined;
    getOwnPropertyNames(o: any): string[];
    create(o: object | null): any;
    create(o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
    defineProperty<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): T;
    defineProperties<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T;
    seal<T>(o: T): T;
    freeze<T extends Function>(f: T): T;
    freeze<T extends {[idx: string]: U | null | undefined | object}, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;
    freeze<T>(o: T): Readonly<T>;
    preventExtensions<T>(o: T): T;
    isSealed(o: any): boolean;
    isFrozen(o: any): boolean;
    isExtensible(o: any): boolean;
    keys(o: object): string[];
}
```

从上面可以看出，Object.prototype属性的类型为Object类型。Object类型的作用是描述Javascript中几乎所有对象都共享的属性和方法。Object.prototype的类型就是Object类型。

Object类型的具体定义如下：

```ts
interface Object {
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
}
```

Object类型里定义的方法都是通用的对象方法，如“valueOf()”方法。

Object类型有一个特点，那就是除了undefined值和null值外，其他任何值都可以赋值给Object类型。示例如下：

```ts
let obj: Object;

// 正确
obj = { x: 0 };
obj = true;
obj = 'hi';
obj = 1;

// 编译错误
obj = undefined;
obj = null;
```

在使用Object类型时容易出现的一个错误是，将Object类型应用于自定义变量、参数或属性等的类型。示例如下：

```ts
01 const point: Object = { x: 0, y: 0 };
```

此例中，将常量point的类型定义为Object类型。虽然该代码不会产生任何编译错误，但它是一个明显的使用错误。Object类型的用途是描述“Object.prototype”对象的类型，即所有对象共享的属性和方法。在描述自定义对象类型时有很多更好的选择，完全不需要使用Object类型，例如object类型和对象字面量类型等。在TypeScript官方文档中也明确地指出了不应该使用Object类型，而是应该使用object类型来代替。





**object类型**

表示非原始类型。

```ts
const point: object = { x: 0, y: 0 };
```

object类型的关注点在于类型的分类，它强调一个类型是非原始类型，即对象类型。object类型的关注点不是该对象类型具体包含了哪些属性，例如对象类型是否包含一个名为name的属性，因此，不允许读取和修改object类型上的自定义属性。示例如下：

```ts
const obj: object = { foo: 0 };

// 编译错误！属性'foo'不存在于类型'object'上
obj.foo;

// 编译错误！属性'foo'不存在于类型'object'上
obj.foo = 0;
```

在object类型上仅允许访问对象的公共属性和方法，也就是Object类型中定义的属性和方法。示例如下：

```ts
const obj: object = {};

obj.toString();
obj.valueOf();
```

在object类型上仅允许访问对象的公共属性和方法，也就是Object类型中定义的属性和方法。示例如下：

```ts
let nonPrimitive: object;

// 下列赋值语句均会产生编译错误
nonPrimitive = true;
nonPrimitive = 'hi';
nonPrimitive = 1;
nonPrimitive = 1n;
nonPrimitive = Symbol();
nonPrimitive = undefined;
nonPrimitive = null;
```

只有非原始类型，也就是对象类型能够赋给object类型。示例如下：

```ts
let nonPrimitive: object;

// 正确
nonPrimitive = {};
nonPrimitive = { x: 0 };
nonPrimitive = [0];
nonPrimitive = new Date();
nonPrimitive = function () {};
```

object类型仅能够赋值给以下三种类型：

- 顶端类型any和unknown。
- Object类型。
- 空对象类型字面量“{}”

```TS
const nonPrimitive: object = {};
const a: any = nonPrimitive;
const b: unknown = nonPrimitive;


const obj: Object = nonPrimitive;


const obj: {} = nonPrimitive;
```



在JavaScript中，有一些内置方法只接受对象作为参数。例如，前面提到的“Object.create()”方法，该方法的第一个参数必须传入对象或者null值作为新创建对象的原型。如果传入了原始类型的值，例如数字1，那么将产生运行时的类型错误。示例如下：

```ts
// 正确
const a = Object.create(Object.prototype);
const b = Object.create(null);

// 类型错误
const c = Object.create(1);
```

在没有引入object类型之前，没有办法很好地描述“Object.create()”方法签名的类型。TypeScript也只好将该方法第一个参数的类型定义为any类型。在引入了object类型之后，TypeScript更新了“Object.create()”方法签名的类型，使用object类型来替换any类型。





**对象类型字面量**

基础写法：

```ts
{
    TypeMember  // 类型成员
    TypeMember
    ...
}
```

在该语法中，TypeMember表示对象类型字面量中的类型成员。

类型成员可分为以下五类：

- 属性签名

  属性签名声明了对象类型中属性成员的名称和类型。它的语法如下所示：
  ```ts
  {
      PropertyName: Type;
  }
  ```

  PropertyName表示对象属性名，可以为标识符、字符串、数字和可计算属性名；Type表示该属性的类y型。

  

- 调用签名

- 构造签名

- 方法签名

- 索引签名



```ts
const point: { x: number; y: number } = { x: 0, y: 0 };  // 对象类型字面量
```



### 多余属性

对象的多余属性简单理解为多出来的属性。多余属性会对类型间关系的判定产生影响。例如，一个类型是否为另一个类型的子类型或父类型，以及一个类型是否能够赋值给另一个类型。

假设存在源对象类型和目标对象类型两个对象类型，那么当满足以下条件时，就说源对象类型相对于目标对象类型存在多余属性，具体条件如下：

- 源对象类型是一个“全新（Fresh）的对象字面量类型”。
- 源对象类型中存在一个或多个在目标对象类型中不存在的属性。

“全新的对象字面量类型”指的是由**对象字面量**经过TS的类型推导推断出的类型，如下图：

![image-20231204091033560](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20231204091033560.png)

上例中，由赋值语句右侧的对象字面量“{ x: 0, y: 0 }”推断出的类型为全新的对象字面量类型“{ x: 0, y: 0 }”。同时也要注意区分，赋值语句左侧类型注解中的“{x: number, y: number }”不是全新的对象字面量类型。如果将赋值语句右侧的类型视作源对象类型，将赋值语句左侧的类型视作目标对象类型，那么不存在多余属性。

```ts
const point:{x:number,y:number} = {x:0,y:0,z:0}  // 其中右侧推导的全新的对象字面量类型相对于左侧的目标对象类型多出了一个z属性。
```



**多余属性检查**

多余属性会影响类型间的子类型兼容性以及赋值兼容性，也就是说编译器不允许在一些操作中存在多余属性。

例如，将对象字面量赋值给变量或属性时，或者将对象字面量作为函数参数来调用函数时，编译器会严格检查是否存在多余属性。若存在多余属性，则会产生编译错误。·

```ts
let point: {
  x: number;
  y: number;
} = { x: 0, y: 0, z: 0 };
//                编译错误！z是多余属性

function f(point: { x: number; y: number }) {}
f({ x: 0, y: 0, z: 0 });
//              编译错误！z是多余属性
```



**为什么要多余属性检查**

1. 在正常的使用场景中，如果我们直接将一个对象字面量赋值给某个确定类型的变量，那么通常没有理由去故意添加多余属性。

2. 从类型可靠性的角度来看待多余属性检查。当把对象字面量赋值给目标对象类型时，若存在多余属性，那么将意味着对象字面量本身的类型彻底丢失了，如下图：

   ![image-20231204092547352](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20231204092547352.png)

   此例中，将包含多余属性的对象字面量赋值给类型为“{ x: number; y: number }”的point常量后，程序中就再也无法引用对象字面量“{ x: 0, y: 0, z: 0 }”的类型了。从类型系统的角度来看，该赋值操作造成了类型信息的永久性丢失，因此编译器认为这是一个错误。

多余属性检查最直接的帮助是发现属性名的拼写错误。



**避开多余属性检查**

如果确定不想让编译器对代码进行多余属性检查，那么有多种方式能实现。

**方式一：**使用类型断言

类型断言能够对类型进行强制转换。类型断言能够绕过多余属性检查的真正原因是，处于类型断言表达式中的对象字面量将不再是“全新的对象字面量类型”，因此编译器也就不会对其进行多余属性检查，下例中的第5行代码能够证明这一点：

```ts
// 无编译错误
const p0: { x: number } = { x: 0, y: 0 } as { x: number };

// 无编译错误
const p1: { x: number } = { x: 0, y: 0 } as { x: 0; y: 0 };
```



**方式二：**启用“--suppressExcessPropertyErrors”编译选项

启用该编译选项能够完全禁用整个TypeScript工程的多余属性检查，但同时也将完全失去多余属性检查带来的帮助。



**方式三：**使用“// @ts-ignore”注释指令

该注释指令能够禁用针对某一行代码的类型检查。

```ts
// @ts-ignore
const point: { x: number } = { x: 0, y: 0 };
```



**方式四：**目标对象类型添加索引签名

若目标对象类型上存在索引签名，那么目标对象可以接受任意属性，因此也就谈不上多余属性。

```ts
const point: {
    x: number;
    [prop: string]: number; // 索引签名
} = { x: 0, y: 0 };
```



**方式五：**先将对象字面量赋值给某个变量，然后再将该变量赋值给目标对象类型，那么将不会执行多余属性检查。这种方法能够生效的原理与类型断言类似，那就是令源对象类型不为“全新的对象字面量类型”，于是编译器将不执行多余属性检查。下面代码的第4行，赋值语句右侧不是对象字面量，而是一个标识符，因此temp的类型不是“全新的对象字面量类型”：

```ts
const temp = { x: 0, y: 0 };

// 无编译错误
const point: { x: number } = temp; 
```





## 函数类型

为函数添加类型，函数中的类型有：

- 参数的类型
- 返回值类型
- this类型
- 函数重载



**函数参数**

```ts
function add(x: number, y: number) {
    return x + y;
}

function add(x, y) {
//           ~~~~
//           参数x和y隐式地获得了'any'类型

    return x + y;
}
```

注意，如果启用了“--noImplicitAny”编译选项，那么此例中的代码将会产生编译错误。我们必须指明参数的类型，如果期望的类型就是any类型，则需要使用类型注解来明确地标注。



**可选参数**

在JS中，函数的每一个参数都是可选参数，而在TS中，默认情况下函数的每一个参数都是必选参数。在调用函数时，编译器会检查传入实际参数的个数与函数定义中形式参数的个数是否相等。如果两者不相等，则会产生编译错误。如果一个参数是可选参数，那么就需要在函数类型定义中明确指定。

在函数形式参数名后面添加一个问号“?”就可以将该参数声明为可选参数。

```ts
01 function add(x: number, y?: number) {
02     return x + (y ?? 0);
03 }



01 function add(x: number, y?: number, z?: number) {
02     return x + (y ?? 0) + (z ?? 0);
03 }
```

**函数的可选参数必须位于函数参数列表的末尾位置。在可选参数之后不允许再出现必选参数，否则将产生编译错误。**

```ts
function add(x?: number, y: number) {
    //                   编译错误！必选参数不能出现在可选参数之后
}
```

在“--strictNullChecks”模式下，TypeScript会自动为可选参数添加undefined类型。TypeScript允许给可选参数传入一个undefined值。

需要注意的是，为参数添加undefined类型不等同于该参数是可选参数。若省略了“?”符号，则参数将成为必选参数，在调用时必须传入一个实际参数值。

```TS
/**
* --strictNullChecks=true
*/
function add(x: number, y?: number) {
    return x + (y ?? 0);
}

add(1);            // 1
add(1, 2);         // 3
add(1, undefined); // 1




function add(x: number, y: number|undefined) {
    return x + (y ?? 0);
}

add(1);            // 1 ,编译报错，必须传
add(1, 2);         // 3
```





**默认参数**

函数默认参数类型可以通过类型注解定义，也可以根据默认参数值自动地推断类型。

例如，下例中函数默认参数x的类型通过类型注解明确定义，而默认参数y的类型则是根据默认值0推断出的类型，最后两个参数的类型均为number类型。

```TS
01 function add(x: number = 0, y = 0) {
02     return x + y;
03 }
```

如果函数定义了默认参数，并且默认参数处于函数参数列表末尾的位置，那么该参数将被视为可选参数，在调用该函数时可以不传入对应的实际参数值。例如，下例中参数y是默认参数，且处于参数列表的末尾，因此参数y成了可选参数。在调用add函数时，允许不传入参数y的实际参数值。

```ts
01 function add(x: number, y: number = 0) {
02     return x + y;
03 }
04 
05 add(1);    // 1
06 add(1, 2); // 3
```



在语法上，同一个函数参数不允许同时声明为可选参数和默认参数，否则将产生编译错误。

```ts
01 function f(x?: number = 0) {
02     //     ~
03     //     编译错误！参数不能同时使用?符号和初始化值
04 }
```

如果默认参数之后存在必选参数，那么该默认参数不是可选的参数，在调用函数时必须传入对应的实际参数值。示例如下：

```ts
01 function add(x: number = 0, y: number) {
02     return x + y;
03 }
04 
05 add(1);            // 编译错误
06 add(1, 2);         // 正确
07 add(undefined, 2); // 正确
```



**剩余参数**

剩余参数类型应该为数组或者元组。

```ts
function f(...args:number[]){
    
}

function f1(...args:[string,number]){
    
}
```



如果剩余参数的类型为元组类型，那么编译器会将剩余参数展开为独立的形式参数声明。

```ts
function f0(...args: [boolean, number]) {}

// 等同于：

function f1(args_0: boolean, args_1: number) {}



function f0(...args: [boolean, string?]) {}

// 等同于：

function f1(args_0: boolean, args_1?: string) {}


function f0(...args: [boolean, ...string[]]) {}

// 等同于：

function f1(args_0: boolean, ...args_1: string[]) {}
```

在了解了元组类型剩余参数的展开行为后，我们也就清楚了该如何传入对应的实际参数。





**解构参数类型**

可以使用类型注解为解构参数添加类型信息。

````ts
function f0([x, y]: [number, number]) {}
f0([0, 1]);

function f1({ x, y }: { x: number; y: number }) {}
f1({ x: 0, y: 1 });
````





**返回值类型**

在绝大多数情况下，TypeScript能够根据函数体内的return语句等自动推断出返回值类型，因此也可以省略返回值类型

在TypeScript的原始类型里有一个特殊的空类型void，该类型唯一有意义的使用场景就是作为函数的返回值类型。如果一个函数的返回值类型为void，那么该函数只能返回undefined值。这意味着函数明确地返回了一个undefined值，或者函数没有调用return语句，在这种情况下函数默认返回undefined值。

如果没有启用“--strictNullChecks”编译选项，那么void返回值类型也允许返回null值。



**函数类型字面量**

使用函数类型字面量来描述某个函数的类型。

函数类型字面量是定义函数类型的方法之一，它能够指定函数的参数类型、返回值类型以及泛型类型参数。函数类型字面量的语法与箭头函数的语法相似，具体语法如下所示：

```ts
(ParameterList) => Type
```

ParameterList表示可选的函数形式参数列表；Type表示函数返回值类型；形式参数列表与返回值类型之间使用胖箭头“=>”连接。

函数类型字面量中的形式参数名与实际函数值中的形式参数名不必相同。

```ts
let f: (x: number) => number;

f = function (y: number): number {
    return y;
};
```



**调用签名**

函数在本质上是一个对象，但特殊的地方在于函数是可调用的对象。因此，**可以使用对象类型来表示函数类型。**若在对象类型中定义了调用签名类型成员，那么称该对象类型为函数类型。调用签名的语法如下所示：

```ts
{
    (ParameterList): Type
}
```

ParameterList表示函数形式参数列表类型，Type表示函数返回值类型，两者都是可选的。

下例中，使用**对象类型字面量**和**调用签名**定义了一个函数类型，该函数类型接受两个number类型的参数，并返回number类型的值：

```ts
let add: { (x: number, y: number): number };

add = function (x: number, y: number): number {
    return x + y;
};
```



函数类型字面量完全等同于仅包含一个类型成员并且是调用签名类型成员的对象类型字面量。换句话说，函数类型字面量是仅包含单个调用签名的对象类型字面量的简写形式，如下所示：

```
{ ( ParameterList ): Type }

// 简写为：

( ParameterList ) => Type
```





## 构造函数类型字面量

构造函数类型字面量是用来**定义构造函数**类型的方法之一。它能够指定构造函数的参数类型、返回值类型以及泛型类型参数。构造函数类型字面量的具体语法如下所示：

```
new ( ParameterList ) => Type
```

new是关键字，ParameterList表示可选的构造函数形式参数列表类型，Type表示构造函数返回值类型。



**构造签名**

构造签名的用法与调用签名类似。若在对象类型中定义了构造签名类型成员，那么称该对象类型为构造函数类型。构造签名的语法如下所示：

```ts
{
    new (ParameterList): Type
}
```

使用对象类型字面量和构造签名定义了一个构造函数类型，该构造函数接受一个string类型的参数，并返回新创建的对象：

```ts
let Dog: { new (name: string): object };

Dog = class {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
};

let dog = new Dog('huahua');
```

构造函数类型字面量完全等同于仅包含一个类型成员并且是构造签名类型成员的对象类型字面量。换句话说，构造函数类型字面量是仅包含单个构造签名的对象类型字面量的简写形式，如下所示：

```ts
{ new ( ParameterList ): Type }

// 简写为：

new ( ParameterList ) => Type
```



有一些函数被设计为既可以作为普通函数使用，同时又可以作为构造函数来使用。例如，JavaScript内置的“Number()”函数和“String()”函数等都属于这类函数

若在对象类型中同时定义调用签名和构造签名，则能够表示既可以被直接调用，又可以作为构造函数使用的函数类型。示例如下：

```ts
{
    new (x: number): Number;  // <- 构造签名
    (x: number): number;      // <- 调用签名
}


const a: number = Number(1);

const b: Number = new Number(1);




declare const F: {
  new (x: number): Number; // <- 构造签名
  (x: number): number; // <- 调用签名
};

// 作为普通函数调用
const a: number = F(1);

// 作为构造函数调用
const b: Number = new F(1);

```



## 函数重载

重载函数是指一个函数同时拥有多个同类的函数签名。例如，一个函数拥有两个及以上的调用签名，或者一个构造函数拥有两个及以上的构造签名。当使用不同数量和类型的参数调用重载函数时，可以执行不同的函数实现代码。

TypeScript中的重载函数与其他编程语言中的重载函数略有不同。下例中定义了一个重载函数add。它接受两个参数，若两个参数的类型为number，则返回它们的和；若两个参数的类型为数组，则返回合并后的数组。在调用add函数时，允许使用这两个调用签名之一并且能够得到正确的返回值类型。示例如下：

```ts
function add(x: number, y: number): number;
function add(x: any[], y: any[]): any[];
function add(x: number | any[], y: number | any[]): any {
  if (typeof x === 'number' && typeof y === 'number') {
    return x + y;
  }
  if (Array.isArray(x) && Array.isArray(y)) {
    return [...x, ...y];
  }
}

const a: number = add(1, 2);
const b: number[] = add([1], [2]);
```

在使用函数声明定义函数时能够定义重载函数。重载函数的定义由以下两部分组成：

- 一条或多条函数重载语句。
- 一条函数实现语句。



**重载语句**

不带有函数体的函数声明语句叫作函数重载。例如，下例中的add函数声明没有函数体，因此它属于函数重载：

```ts
function add(x: number, y: number): number;
```

函数重载的语法中不包含函数体，它只提供了函数的类型信息。

在函数重载中，不允许使用默认参数。函数重载应该位于函数实现之前，每一个函数重载中的函数名和函数实现中的函数名必须一致。例如，下例中第1行和第2行分别定义了两个函数重载，第3行是函数实现。它们具有相同的函数名add，并且每一个函数重载都位于函数实现之前。示例如下：

```ts
function add(x: number, y: number): number;
function add(x: any[], y: any[]): any[];
function add(x: number | any[], y: number | any[]): any {
    // 省略了实现代码
}
```

在各个函数重载语句之间以及函数重载语句与函数实现语句之间不允许出现任何其他语句，否则将产生编译错误。



**实现语句**

函数实现包含了实际的函数体代码，每一个重载函数只允许有一个函数实现，并且它必须位于所有函数重载语句之后，否则将产生编译错误。

函数实现中的函数签名不属于重载函数的调用签名，只有函数重载中的函数签名能够作为重载函数的调用签名。例如，下例中的add函数只有两个调用签名，分别为第1行与第2行定义的两个重载签名，而第3行函数实现中的函数签名不是add函数的调用签名，如下所示：

```ts
function add(x: number, y: number): number;
function add(x: any[], y: any[]): any[];
function add(x: number | any[], y: number | any[]): any {
  // 省略了实现代码
}
```

因此，可以使用两个number类型的值来调用add函数，或者使用两个数组类型的值来调用add函数。但是，不允许使用一个number类型和一个数组类型的值来调用add函数，尽管在函数实现的函数签名中允许这种调用方式。

函数实现需要兼容每个函数重载中的函数签名，函数实现的函数签名类型必须能够赋值给函数重载的函数签名类型。

```ts
function foo(x: number): boolean;
//       ~~~
//       编译错误：重载签名与实现签名的返回值类型不匹配
function foo(x: string): void;
//       ~~~
//       编译错误：重载签名与实现签名的参数类型不匹配
function foo(x: number): void {
    // 省略函数体代码
}
```

此例中，重载函数foo可能的参数类型为number类型或string类型，同时返回值类型可能为boolean类型或void类型。因此，在函数实现中的参数x必须同时兼容number类型和string类型，而返回值类型则需要兼容boolean类型和void类型。我们可以使用联合类型来解决这些问题，示例如下：

```ts
function foo(x: number): boolean;
function foo(x: string): void;
function foo(x: number | string): any {
    // 省略函数体代码
}
```

在其他一些编程语言中允许存在多个函数实现，并且在调用重载函数时编程语言负责选择合适的函数实现执行。在TypeScript中，重载函数只存在一个函数实现，开发者需要在这个唯一的函数实现中实现所有函数重载的功能。这就需要开发者自行去检测参数的类型及数量，并根据判断结果去执行不同的操作。示例如下：

```ts
function add(x: number, y: number): number;
function add(x: any[], y: any[]): any[];
function add(x: number | any[], y: number | any[]): any {
    if (typeof x === 'number' && typeof y === 'number') {
        return x + y;
    }

    if (Array.isArray(x) && Array.isArray(y)) {
        return [...x, ...y];
    }
}
```





























# 面试



### 对TS的理解和它与JS的区别

TypeScript是JavaScript的超集，任何合法的JS代码都是有效的TS代码。TS的主要特点包括静态类型系统，编译时检查类型错误，提高代码质量。

**对 TypeScript 的理解**

1. **静态类型系统**
   TS 的核心是**类型注解**和**编译时类型检查**。通过为变量、函数参数、返回值等添加类型约束，可以在开发阶段捕获潜在的类型错误（如 `string` 赋值给 `number`），减少运行时错误。
2. **增强的工具支持**
   类型系统为 IDE 提供了丰富的类型信息，支持**智能提示**、**代码补全**、**重构安全**等功能，显著提升开发效率和代码可维护性。
3. **渐进式采用**
   TS 兼容 JS 语法，允许逐步迁移。开发者可以仅对部分代码添加类型，或直接使用 `.js` 文件，通过类型推断和声明文件（`.d.ts`）与现有 JS 生态无缝集成。
4. **现代语法支持**
   TS 支持 ES6+ 语法（如装饰器、可选链 `?.`），并能通过编译降级为旧版 JS（如 ES5），兼容旧环境。
5. **面向复杂工程**
   类型系统、泛型、接口等特性，使 TS 更适合大型项目，提升代码可读性、可维护性，降低团队协作成本。



**区别：**

- 类型系统，TS有静态类型，JS是动态类型。TS可以在开发阶段捕捉错误，而不用等到运行时。例如，定义一个变量为number类型，如果赋值字符串，TS会直接报错，而JS不会。
- 工具支持。TS因为有类型信息，IDE的提示会更强大，比如自动补全、参数提示等。重构代码的时候也会更安全，因为类型检查可以确保改动不会破坏已有的代码逻辑。
- 编译过程。TS需要编译成JS才能运行，而JS可以直接在浏览器或Node.js中执行。
- 接口和泛型TS支持，JS不支持。接口可以定义对象的结构，泛型增加代码的复用性。比如用接口来约束一个函数参数必须包含特定属性，这样在调用时如果不符合就会报错。
- TS支持最新的ECMAScript特性，并且可以将代码编译成不同版本的JS，这样即使环境不支持新语法，也能通过编译降级来兼容。

TS的缺点，比如学习曲线，学习类型系统，增加开发初期的成本。还有项目配置，需要tsconfig.json等配置。不过TS在大型项目中优势明显，因为类型系统能帮助团队协作，减少潜在的bug。而小项目可能觉得TS配置麻烦，这时候用JS更快捷。



**ypeScript 与 JavaScript 的区别**

| **特性**         | **TypeScript**                    | **JavaScript**                  |
| :--------------- | :-------------------------------- | :------------------------------ |
| **类型系统**     | 静态类型（编译时检查）            | 动态类型（运行时检查）          |
| **编译环节**     | 需编译为 JS 后执行                | 直接执行（浏览器/Node.js）      |
| **类型注解**     | 支持（如 `let age: number = 25`） | 不支持                          |
| **接口与泛型**   | 支持接口、泛型等高级类型          | 不支持                          |
| **错误检测时机** | 编码阶段即可发现类型错误          | 运行时可能暴露类型错误          |
| **工具链支持**   | 强大的 IDE 智能提示和重构支持     | 有限的工具提示（依赖 JSDoc 等） |
| **适用场景**     | 中大型项目、长期维护、团队协作    | 小型项目、快速原型开发          |



**TS是如何编译降级来支持低版本浏览器的？在tsconfig.json配置文件中哪个字段又与这里的编译降级有关？**

TS编译器（tsc）如何处理ES6+代码转成ES5等旧版JS，比如箭头函数变成普通函数，async/await转成生成器或Promise等。

tsconfig.json中的相关字段。target和lib这两个选项。target指定编译后的JS版本，比如ES5，而lib则指定包含的类型定义，比如DOM、ES2015等。另外，downlevelIteration可能也需要提到，特别是在处理for-of循环时的兼容性问题。

为什么需要同时配置target和lib，或者如何处理某些ES6+特性在低版本浏览器中的缺失。这时候需要解释polyfill的作用，以及如何与TS配置配合使用。



TS 通过将现代 js 语法转换为旧版本 JS（如 ES5）来实现对低版本浏览器的兼容，这一过程称为**编译降级（Downleveling）**。其核心机制和关键配置如下：

- **语法转换**  TypeScript 编译器（`tsc`）会将 ES6+ 语法（如箭头函数、`class`、`async/await`）转换为等效的 ES5 语法：

  ```ts
  // TS 源码（ES6+）
  const sum = (a: number, b: number) => a + b;
  
  // 输出 JS（ES5）
  var sum = function(a, b) { return a + b; };
  ```

- **API 兼容性处理**  对于 ES6+ 新增的 API（如 `Promise`、`Array.from`），TS **不会自动生成 polyfill**，需手动引入第三方库（如 `core-js`）来兼容旧环境。

- **模块化转换**  通过配置模块格式（如 `CommonJS`、`AMD`），将 ES6 `import/export` 转换为 `require/module.exports` 等旧模块语法。



**tsconfig.json 中的相关配置字段**

1. **`target`**（核心降级配置）

   `target`指定了编译后的JS版本，比如ES5、ES6等。TS编译器会根据这个设置，将现代JS语法转换成目标版本的等效代码。例如，箭头函数在ES5中会被转成普通函数，而在ES6及以上可能保持不变。

   ```json
   {
     "compilerOptions": {
       "target": "ES5"  // 将代码降级到 ES5 语法
     }
   }
   ```

   

2. **`lib`**（类型声明库配置）

   指定项目中使用哪些TS的内置 API 类型声明（如 `DOM`、`ES2015.Promise`）。

   ```json
   {
     "compilerOptions": {
       "lib": ["ES5", "DOM"]  // 仅包含 ES5 和 DOM 类型，兼容旧浏览器需排除高版本 API 类型
     }
   }
   ```

3. **`downlevelIteration`**（迭代器降级）

   启用后，将 `for...of` 循环转换为兼容旧环境的等效代码（需要配合 `Symbol.iterator` 的 polyfill）。

   ```json
   {
     "compilerOptions": {
       "downlevelIteration": true
     }
   }
   ```



**Polyfill 补充**

- `target` 仅处理语法降级，不处理 API 缺失（如 `Promise`、`fetch`）。
- 需手动引入 `core-js` 或 `@babel/polyfill` 填充缺失 API。

```js
// 安装 core-js（提供 ES6+ API 的实现）
npm install core-js

// 在入口文件引入 polyfill
import "core-js/stable";
```

通过调整 `target`，TypeScript 在语法层面实现精准降级，确保代码兼容旧环境，同时保持开发时的高效性和类型安全。





**TypeScript的`target`配置如何将源码转换为不同目标版本的JavaScript**

选择几个有代表性的ES特性，比如箭头函数、类、模板字符串、async/await等，展示它们在ES5、ES6、ES2017等不同目标版本下的转换结果。

TS编译器（tsc）在转换时会根据目标版本决定是否降级语法。例如，当目标是ES6时，箭头函数可能不会被转换，因为ES6支持箭头函数；而当目标是ES5时，箭头函数会被转换为function表达式。

某些语法结构可能需要额外的配置，比如`downlevelIteration`来处理for...of循环在ES5中的兼容性问题。

TS不会自动添加polyfill，比如Promise或Array.from这样的API，这些需要用户自己通过core-js等库来处理。

不同target设置下的输出。比如，同一段TS代码，在target设置为ES5和ES6时，生成的JS代码有什么不同。

考虑一个包含箭头函数、类、模板字符串和async/await的TS文件。针对不同的target，编译后的代码会不同。对于ES5，箭头函数变成function，类变成构造函数，模板字符串可能变成字符串拼接，async/await可能被转换成生成器或Promise链。而对于ES6，箭头函数和类保持不变，模板字符串也保留，async/await可能需要ES2017或更高的target才会保持不变，否则可能被转换。

模块系统的转换，比如如果module设置为CommonJS，那么import/export会被转换成require/module.exports，但这也和target版本有关吗？或者module是独立配置的？

**代码示例**

```ts
// 包含箭头函数、类、模板字符串、async/await
const greet = (name: string) => `Hello, ${name}`;

class Person {
  constructor(public age: number) {}
  getAge() { return this.age; }
}

async function fetchData() {
  const response = await fetch('...');
  return response.json();
}
```

- **`target: "ES5"`（降级到 ES5）**

  ```js
  "use strict";
  // 箭头函数 → 转为普通函数
  var greet = function (name) { return "Hello, ".concat(name); };
  
  // 类 → 转为构造函数和原型链
  var Person = /** @class */ (function () {
    function Person(age) {
      this.age = age;
    }
    Person.prototype.getAge = function () { return this.age; };
    return Person;
  }());
  
  // async/await → 转为 Promise 链（生成辅助函数）
  function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, fetch('...')];
          case 1:
            response = _a.sent();
            return [2 /*return*/, response.json()];
        }
      });
    });
  }
  ```

  #### **关键转换规则**

  - **箭头函数**：转换为 `function` 表达式。
  - **类**：转换为基于原型的构造函数。
  - **模板字符串**：转换为 `concat` 或字符串拼接（根据配置）。
  - **async/await**：生成 `__awaiter` 和 `__generator` 辅助函数，模拟异步行为（需引入 `tslib` 或配置生成辅助代码）。

-  **`target: "ES2015"`（ES6）**

  ```js
  "use strict";
  // 箭头函数保留（ES6 原生支持）
  const greet = (name) => `Hello, ${name}`;
  
  // 类保留（ES6 原生支持）
  class Person {
    constructor(age) {
      this.age = age;
    }
    getAge() { return this.age; }
  }
  
  // async/await → 转为生成器函数（ES6 支持生成器）
  function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch('...');
      return response.json();
    });
  }
  ```

  #### **关键转换规则**

  - **箭头函数/类/模板字符串**：保留原生语法（ES6 已支持）。
  - **async/await**：降级为生成器函数（需 `target: ES2015` 或更低），但仍依赖辅助函数（如 `__awaiter`）。

  

- ### **`target: "ES2017"`**

  ```js
  "use strict";
  // 所有现代语法保留
  const greet = (name) => `Hello, ${name}`;
  
  class Person {
    constructor(age) {
      this.age = age;
    }
    getAge() { return this.age; }
  }
  
  // async/await 保留（ES2017 原生支持）
  async function fetchData() {
    const response = await fetch('...');
    return response.json();
  }
  ```

  #### **关键转换规则**

  - **async/await**：不再转换，直接保留（ES2017 原生支持）。





### TS中的数据类型

基础类型和高级类型

TS包括JS的所有数据类型，比如string、number、boolean、null、undefined、symbol、bigint，还有对象类型如object、array等。但TS还引入了静态类型，所以还有更多类型，比如any、unknown、void、never，以及联合类型、交叉类型、字面量类型、元组、枚举、类型别名、接口等。

#### 基础类型

**基础类型**

**JavaScript 原生类型**

| 类型        | 描述                     | 示例                           |
| :---------- | :----------------------- | :----------------------------- |
| `string`    | 字符串                   | `let name: string = "Alice"`   |
| `number`    | 数值（整数、浮点数）     | `let age: number = 25`         |
| `boolean`   | 布尔值（`true`/`false`） | `let isDone: boolean = false`  |
| `null`      | 空值                     | `let n: null = null`           |
| `undefined` | 未定义值                 | `let u: undefined = undefined` |
| `symbol`    | 唯一标识符（ES6）        | `const sym: symbol = Symbol()` |
| `bigint`    | 大整数（ES2020）         | `let big: bigint = 100n`       |



**TypeScript 扩展的基础类型**

| 类型      | 描述                           | 示例                                                         |
| :-------- | :----------------------------- | :----------------------------------------------------------- |
| `any`     | 动态类型（关闭类型检查）       | `let data: any = "hello"; data = 10;`                        |
| `unknown` | 类型安全的 `any`（需类型断言） | `let value: unknown = "hi"; let str: string = value as string;` |
| `void`    | 无返回值（常用于函数）         | `function log(): void { console.log('done'); }`              |
| `never`   | 永不返回的值（如抛出错误）     | `function error(): never { throw new Error(); }`             |



#### 对象类型

**对象类型（Object Types）**

**数组**

| 语法          | 示例                                   |
| :------------ | :------------------------------------- |
| `类型[]`      | `let nums: number[] = [1, 2]`          |
| `Array<类型>` | `let list: Array<string> = ["a", "b"]` |

**元组（Tuple）**

固定长度和类型的数组：

```typescript
let user: [string, number] = ["Alice", 25];
user[0] = "Bob";  // ✅
user[1] = "30";   // ❌ 类型错误
```

**枚举（Enum）**

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
}
let dir: Direction = Direction.Up;
```

**对象字面量类型**

```typescript
let obj: { name: string; age: number } = { name: "Alice", age: 25 };
```



#### 高级类型（Advanced Types）

##### **联合类型（Union Types）**

```typescript
let value: string | number = "hello";
value = 10; // ✅
```



##### **交叉类型（Intersection Types）**

交叉类型（Intersection Types）是 TS 中一种**组合多个类型**的特性，通过 `&` 符号将多个类型合并成一个新类型。新类型将包含所有被合并类型的成员，实现类型的“叠加”。

**基本用法**

- **合并对象类型**：将多个对象类型的属性合并为一个新类型。

  ```ts
  type Person = { name: string };
  type Employee = { employeeId: number };
  
  // 交叉类型：同时拥有 name 和 employeeId
  type Staff = Person & Employee;
  
  const alice: Staff = {
    name: "Alice",
    employeeId: 12345, // ✅ 必须同时满足两个类型的属性
  };
  ```

- **合并函数类型**：可用于函数签名，表示函数需同时满足多个约束。

  ```ts
  type Loggable = { log: (msg: string) => void };
  type Serializable = { serialize: () => string };
  
  // 交叉后的对象必须同时实现 log 和 serialize 方法
  type LoggerSerializer = Loggable & Serializable;
  
  const service: LoggerSerializer = {
    log: (msg) => console.log(msg),
    serialize: () => JSON.stringify({ data: "test" }),
  };
  ```

  

**核心特性**

- **类型叠加（属性合并）**：交叉类型会合并所有类型的属性，**同名属性需要兼容**

  ```ts
  type A = { id: number; value: string };
  type B = { id: string; enabled: boolean };
  
  // 错误：id 的类型冲突（number & string → never）
  type C = A & B; // ❌ 类型 'number' 和 'string' 无法合并为 never
  ```

- **与联合类型的区别**

  - **联合类型（`|`）**：表示“或”关系，类型为其中之一。

  - **交叉类型（`&`）**：表示“与”关系，类型需同时满足所有条件。

    ```ts
    type U = string | number; // U 可以是 string 或 number
    type I = { a: string } & { b: number }; // I 必须同时有 a 和 b
    ```

-  **原始类型的交叉**

  交叉原始类型（如 `string & number`）会被推断为 `never`，因为它们没有交集：

  ```typescript
  type Impossible = string & number; // 类型为 never
  ```



**应用场景**

1. **组合多个接口**

合并分散定义的接口，创建复合类型：

```typescript
interface User { name: string }
interface Admin { permissions: string[] }

type SuperUser = User & Admin;

const user: SuperUser = {
  name: "Bob",
  permissions: ["read", "write"],
};
```

2. **扩展第三方库类型**

在不修改源码的情况下，扩展第三方类型：

```typescript
// 假设第三方类型定义
declare module "lib" {
  export interface Config { apiUrl: string }
}

// 本地扩展：添加自定义属性
type CustomConfig = Config & { timeout: number };

const config: CustomConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000, // ✅ 合并后的属性
};
```

3. **与泛型结合实现灵活组合**

通过泛型动态合并类型：

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge(
  { name: "Alice" }, 
  { age: 30 }
); // 类型为 { name: string } & { age: number }
```

4. **类型工具的实现**

交叉类型常用于构建工具类型（Utility Types）：

```typescript
// 实现一个合并所有属性的工具类型
type Combine<T, U> = T & U;

type Combined = Combine<
  { a: number }, 
  { b: string }
>; // { a: number; b: string }
```

------

**注意事项**

1. **避免无意义的交叉**
   确保被合并类型之间存在实际交集，例如避免 `string & number` 这样的矛盾组合。

2. **同名属性的兼容性**
   如果多个类型有同名属性，它们的类型必须兼容（否则结果为 `never`）：

   ```typescript
   type X = { id: number };
   type Y = { id: string };
   type Z = X & Y; // ❌ id 的类型为 number & string → never
   ```

3. **优先使用接口继承（`extends`）**
   在需要显式继承关系时，优先使用 `interface` 的 `extends` 语法，增强可读性：

   ```typescript
   interface Animal { name: string }
   interface Dog extends Animal { breed: string } // 更清晰的继承关系
   ```

------

总结

- **交叉类型的本质**：通过 `&` 合并多个类型的成员，生成一个更具体的类型。
- **适用场景**：组合对象属性、扩展第三方类型、动态类型合并。
- **优势**：灵活性强，无需显式继承即可复用现有类型。
- **注意点**：处理同名属性冲突，避免无意义交叉。





##### **字面量类型（Literal Types）**

精确到具体值：

```typescript
let status: "success" | "error"; // 只能赋值 "success" 或 "error"
```

**类型别名（Type Aliases）**

```typescript
type UserID = string | number;
let id: UserID = "abc123";
```

**接口（Interface）**

定义对象结构（可扩展性强）：

```typescript
interface User {
  name: string;
  age: number;
  greet?(): void; // 可选方法
}
const alice: User = { name: "Alice", age: 25 };
```

**泛型（Generics）**

可复用的类型模板：

```typescript
function identity<T>(arg: T): T {
  return arg;
}
identity<number>(10); // 明确泛型类型
```

------



#### 其他特殊类型

##### **索引签名（Index Signatures）**

动态对象属性：

```typescript
interface StringArray {
  [index: number]: string; // 索引为数字，值为字符串
}
const arr: StringArray = ["a", "b"];
```

##### **函数类型**

定义函数参数和返回值：

```typescript
type AddFunc = (a: number, b: number) => number;
const add: AddFunc = (a, b) => a + b;
```

##### **条件类型（Conditional Types）**

基于条件推导类型（常用于工具类型）：

```typescript
type IsString<T> = T extends string ? true : false;
type Result = IsString<"hello">; // true
```

##### **映射类型（Mapped Types）**

批量转换类型：

```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type ReadonlyUser = Readonly<User>; // 所有属性变为只读
```

##### **类型断言（Type Assertion）**

手动指定类型（绕过编译器推断）：

```typescript
let value: unknown = "hello";
let str1: string = value as string;  // 方式一
let str2: string = <string>value;    // 方式二（JSX 中不推荐）
```



#### `keyof` 操作符

获取对象类型的所有**键名**组成的联合类型（Union Type）。

````ts
type Keys = keyof T; // T 为对象类型


interface User {
  id: number;
  name: string;
  age: number;
}

type UserKeys = keyof User; // "id" | "name" | "age"
````

**应用场景**

**动态访问属性**：结合泛型约束确保键名合法。

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // 安全访问
}

const user: User = { id: 1, name: "Alice", age: 25 };
getProperty(user, "name"); // ✅ 返回 string
getProperty(user, "gender"); // ❌ 类型错误
```

**索引访问类型（Indexed Access Types）**

通过键名（或联合类型键名）直接访问对象类型的**属性值类型**。

```ts
type ValueType = T[K]; // K 为键名或联合类型


type UserNameType = User["name"]; // string
type UserAgeType = User["age"];   // number

// 联合键名访问
type UserValueTypes = User["id" | "name"]; // number | string


type PropType<T, K extends keyof T> = T[K];
type UserIdType = PropType<User, "id">; // number
```



**映射类型（Mapped Types）**

基于 `keyof` 和索引签名，批量转换对象类型的属性，生成新类型。

```ts
// 将 T 的所有属性变为可选
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// 将 T 的所有属性变为只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};


// 将 User 的所有属性转换为字符串类型
type Stringify<T> = {
  [K in keyof T]: string;
};

type StringUser = Stringify<User>;
// { id: string; name: string; age: string }
```



**条件类型与索引结合**

通过条件判断动态生成类型，常用于复杂工具类型。

**示例：过滤特定类型属性**

```typescript
type FilterNumberProps<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T]; // 提取值为 number 的键名

type UserNumberKeys = FilterNumberProps<User>; // "id" | "age"
```

------

**类型索引的核心作用**

1. **动态属性约束**
   通过索引签名处理未知属性名的对象（如配置、字典）。

2. **类型安全访问**
   利用 `keyof` 和索引访问类型确保属性操作的合法性。

3. **批量类型转换**
   使用映射类型快速生成衍生类型（如 `Partial`、`Readonly`）。

4. **复杂类型推导**
   结合条件类型实现动态类型逻辑（如筛选、转换属性）。

5. **工具库开发**

   创建灵活可复用的工具类型（如 `Pick<T, K>`、`Omit<T, K>`）。



#### 类型约束

在 TS 中，**类型约束（Type Constraints）** 是一种通过限制泛型（Generics）或类型的允许范围来确保代码类型安全的机制。它通过 `extends` 关键字或条件类型（Conditional Types）等工具，明确告诉 TypeScript 编译器某个类型必须满足特定条件，从而在编译阶段捕获潜在的类型错误。



**用法**

1. **泛型约束（Generic Constraints）**

最常见的类型约束形式，用于限制泛型参数的类型范围。

**语法**：`<T extends SomeType>`

- 表示泛型 `T` 必须继承或符合 `SomeType` 的结构。

```ts
// 约束 T 必须包含 length 属性
function logLength<T extends { length: number }>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // 5（字符串有 length）
logLength([1, 2, 3]); // 3（数组有 length）
logLength(123); // 错误：number 没有 length 属性 ❌
```



**条件类型中的约束**

通过条件判断进一步细化类型。

**语法**：`T extends U ? X : Y`

- 如果 `T` 符合类型 `U`，则返回 `X`，否则返回 `Y`。

```ts
type IsString<T> = T extends string ? "Yes" : "No";

type A = IsString<"hello">; // "Yes"
type B = IsString<123>;     // "No"
```



**多重约束**

通过 `&` 交叉类型实现多条件约束。

```ts
interface HasName { name: string }
interface HasAge { age: number }

// 约束 T 必须同时满足 HasName 和 HasAge
function logPerson<T extends HasName & HasAge>(person: T): void {
  console.log(`${person.name} is ${person.age} years old.`);
}

logPerson({ name: "Alice", age: 30 }); // ✅
logPerson({ name: "Bob" }); // 错误：缺少 age ❌
```



**结合 `keyof` 的键约束**

确保访问对象属性的安全性。

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 25 };
getProperty(user, "name"); // "John" ✅
getProperty(user, "email"); // 错误：email 不是 user 的键 ❌
```



**应用场景**

1. **确保函数参数合法性**

```typescript
// 约束参数必须为数字或可转换为数字的字符串
function add<T extends number | string>(a: T, b: T): number {
  return Number(a) + Number(b);
}

add(3, 5);       // 8 ✅
add("10", "20"); // 30 ✅
add(true, false);// 错误：boolean 不符合约束 ❌
```

2. **构建工具类型**

```typescript
// 提取数组元素的类型（若 T 是数组）
type ElementType<T> = T extends (infer U)[] ? U : T;

type Numbers = ElementType<number[]>; // number
type NotArray = ElementType<string>;  // string
```

3. **限制类的泛型参数**

```typescript
interface Serializable {
  serialize(): string;
}

// 要求泛型 T 必须实现 Serializable 接口
class Storage<T extends Serializable> {
  constructor(private data: T) {}

  save(): string {
    return this.data.serialize();
  }
}
```

------

**类型约束 vs 类型断言**

| **类型约束**                     | **类型断言**                       |
| :------------------------------- | :--------------------------------- |
| 在编译时通过类型系统限制类型范围 | 运行时强制指定类型，绕过类型检查   |
| 提供静态安全保障                 | 可能引入运行时错误风险             |
| 推荐用于明确已知类型关系的场景   | 仅在无法通过类型约束解决时谨慎使用 |

------

**注意事项**

1. **避免过度约束**：过于严格的约束可能降低代码灵活性。
2. **结合条件类型**：灵活处理不同类型的分支逻辑。
3. **利用类型推断**：TypeScript 通常能自动推断约束后的类型，无需手动指定。



#### Mixin

具体是什么，怎么用，以及为什么需要用它。

类可以通过继承来复用代码。但是有时候继承会有一些问题，比如只能单继承，不够灵活。

mixin是一种设计模式，允许将多个类的功能组合到一个类中。在TypeScript中，mixin可能通过某种方式实现多重继承的效果，但具体是怎么实现的。

在JavaScript中，可以通过对象组合或者混入函数来混合多个对象的方法和属性到目标对象中。TypeScript作为JavaScript的超集，可能也支持类似的方式，并且提供了类型检查。那在TypeScript里，mixin是如何保证类型安全的？

需要用类表达式或者高阶函数来实现。比如，定义一个接受基类并返回扩展后的类的函数。这样的函数可以添加新的方法或属性到类中，然后通过多次应用不同的mixin函数来组合功能。例如：

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;
    activate() {
      this.isActivated = true;
    }
    deactivate() {
      this.isActivated = false;
    }
  };
}

class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const TimestampedActivatableUser = Timestamped(Activatable(User));
const user = new TimestampedActivatableUser("John");
console.log(user.timestamp); // 输出当前时间戳
user.activate();
console.log(user.isActivated); // 输出 true
```

Timestamped和Activatable都是mixin，它们分别添加了时间戳和激活功能到User类中。通过组合这两个mixin，得到的新类同时具有两者的功能。



在TypeScript中，**Mixin** 是一种通过组合多个类的功能来增强现有类的设计模式。它解决了单继承的限制，允许更灵活地复用代码。以下是关键点解析：

**Mixin的核心概念**

1. **定义**：
   - Mixin是一个函数，接收一个基类并返回扩展后的新类，通过组合多个Mixin逐步增强类的功能。
   - 它本质上是利用TypeScript的类型系统和类表达式，实现类似多重继承的效果。
2. **实现方式**：
   - 使用 **高阶函数** 生成类表达式。
   - 通过泛型和构造函数类型（`Constructor<T>`）确保类型安全。

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}
```



**Mixin的典型用法**

1. **组合功能**：

   ```typescript
   class User { name: string; }
   const ActiveUser = Timestamped(Activatable(User)); // 组合两个Mixin
   const user = new ActiveUser("John");
   user.activate(); // 来自Activatable
   console.log(user.timestamp); // 来自Timestamped
   ```

2. **类型推断**：

   - TypeScript会自动推断混合后的类型，无需手动声明交叉类型。

   - 若需显式定义，可使用接口合并：

     ```typescript
     interface ActiveUser extends User, Timestamped, Activatable {}
     ```

------

**注意事项**

1. **命名冲突**：

   - 若多个Mixin有同名属性或方法，后面的会覆盖前面的。需通过命名规范避免冲突。

2. **构造函数参数**：

   - Mixin通常不直接处理构造参数，基类负责初始化自身参数。

   - 若Mixin需要参数，需在函数中显式传递：

     ```typescript
     function WithAge<TBase extends Constructor>(Base: TBase, age: number) {
       return class extends Base {
         age = age;
       };
     }
     ```

3. **拼写错误与类型检查**：

   - TypeScript会检查Mixin中的属性/方法是否存在，但需注意逻辑错误（如`this.isActivated`拼写错误）。

------

**为什么使用Mixin？**

- **解决单继承问题**：突破类只能继承一个父类的限制。
- **高复用性**：将通用功能（如日志、激活状态）拆分为独立Mixin，按需组合。
- **灵活性**：动态调整类的功能，无需修改原有类结构。

------

**总结**：Mixin通过函数式组合扩展类，是TypeScript中实现代码复用的强大工具。合理使用可提升代码模块化，但需注意命名冲突和类型安全。





#### 类型映射

在 TS 中，**类型映射（Mapped Types）** 是一种通过**遍历**已有类型的属性并对其键（Key）或值（Value）进行转换来**动态生成新类型的工具**。它类似于 JavaScript 中的 `map` 函数，但作用于类型系统层面，能够显著提高代码的类型安全性和复用性。



1. **基本语法**

类型映射通过 `in` 关键字遍历**联合类型**中的每个成员，结合 `keyof` 获取对象类型的键集合，最终生成新的对象类型。

```typescript
type MappedType<T> = {
  [Key in keyof T]: T[Key];
};
```

- **`keyof T`**：获取 `T` 的所有键组成的联合类型（如 `"name" | "age"`）。
- **`Key in ...`**：遍历每个键。
- **`T[Key]`**：获取原始类型 `T` 中对应键的值类型。

------

**内置的映射类型**

TypeScript 提供了一些常用的内置映射类型：

| **内置类型**       | **作用**                              | **示例**                                                     |
| :----------------- | :------------------------------------ | :----------------------------------------------------------- |
| **`Partial<T>`**   | 将 `T` 的所有属性变为可选             | `type PartialUser = Partial<User>;`（所有属性可选）          |
| **`Required<T>`**  | 将 `T` 的所有属性变为必选             | `type RequiredUser = Required<User>;`（所有属性必填）        |
| **`Readonly<T>`**  | 将 `T` 的所有属性变为只读             | `type ReadonlyUser = Readonly<User>;`（所有属性不可修改）    |
| **`Pick<T, K>`**   | 从 `T` 中选取指定键 `K` 的子集        | `type UserName = Pick<User, "name">;`（仅保留 `name` 属性）  |
| **`Record<K, V>`** | 创建一个键为 `K`，值为 `V` 的对象类型 | `type UserMap = Record<"id"| "email", string>;`（键为 `id`和`email`，值均为 `string`） |

------

**进阶用法**

1. **修改属性修饰符**

通过 `+` 或 `-` 操作符控制属性的可选性（`?`）和只读性（`readonly`）。

```typescript
// 移除所有属性的可选修饰符（变为必选）
type Concrete<T> = {
  [Key in keyof T]-?: T[Key];
};

// 添加 readonly 修饰符
type Locked<T> = {
  readonly [Key in keyof T]: T[Key];
};
```

------

2. **修改键名或值类型**

结合模板字面量类型（Template Literal Types）或条件类型（Conditional Types）动态修改键名或值。

**示例1：修改键名**

```typescript
// 给所有键添加前缀 "get"
type Getters<T> = {
  [Key in keyof T as `get${Capitalize<Key & string>}`]: () => T[Key];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// 等效于：
// { getName: () => string; getAge: () => number }
```

**示例2：过滤或转换值类型**

```typescript
// 仅保留值为函数的属性
type FunctionProperties<T> = {
  [Key in keyof T as T[Key] extends Function ? Key : never]: T[Key];
};

type API = { fetch: () => void; id: number };
type APIFunctions = FunctionProperties<API>; // { fetch: () => void }
```

------

3. **条件映射**

结合条件类型实现动态类型分支。

```typescript
// 若属性是函数类型，则返回其返回值类型，否则保留原类型
type UnwrapFunctions<T> = {
  [Key in keyof T]: T[Key] extends (...args: any[]) => infer R ? R : T[Key];
};

type Actions = { getUser: () => string; age: number };
type Unwrapped = UnwrapFunctions<Actions>; // { getUser: string; age: number }
```

------

**应用场景**

1. **API 响应数据转换**

将后端返回的数据类型转换为前端需要的格式：

```typescript
// 后端返回的原始类型
type ApiResponse = {
  id: string;
  created_at: Date;
  updated_at: Date;
};

// 移除时间戳字段，生成前端需要的类型
type FrontendData<T> = Omit<T, "created_at" | "updated_at">;

type UserResponse = FrontendData<ApiResponse>; // { id: string }
```

------

2. **表单验证**

动态生成表单控件的类型，确保每个字段都有对应的验证状态：

```ts
type FormFields = { username: string; password: string };

// 为每个字段添加验证状态
type ValidatedForm<T> = {
  [Key in keyof T]: {
    value: T[Key];
    isValid: boolean;
  };
};

type LoginForm = ValidatedForm<FormFields>;
// 等效于：
// {
//   username: { value: string; isValid: boolean };
//   password: { value: string; isValid: boolean };
// }
```

------

3. **Redux 状态管理**

生成 Action 类型，避免手动重复定义：

```typescript
type ActionTypes = "ADD_TODO" | "REMOVE_TODO" | "UPDATE_TODO";

// 自动生成 Action 类型
type Actions = {
  [Key in ActionTypes]: {
    type: Key;
    payload: Key extends "ADD_TODO" ? string : number;
  };
}[ActionTypes];

// 等效于：
// { type: "ADD_TODO"; payload: string } | { type: "REMOVE_TODO"; payload: number } | ...
```

------

**注意事项**

1. **性能问题**
   过度复杂的类型映射可能导致类型检查变慢，尤其是在处理大型对象类型时。
2. **映射限制**
   无法直接映射某些特殊类型（如联合类型或交叉类型），需结合条件类型处理。
3. **修饰符顺序**
   `readonly` 和 `?` 的修饰符顺序会影响最终类型，例如 `+readonly` 和 `-?` 需谨慎使用。

------

**总结**：
类型映射是 TypeScript 中强大的元编程工具，能够通过动态生成类型来减少重复代码，增强类型安全性。合理使用内置映射类型（如 `Partial`、`Pick`）和自定义映射逻辑，可以显著提升代码的可维护性。





### 工具类型

#### Exclude

 `Exclude` 是 TypeScript 内置的工具类型，它的作用是**从联合类型 `T` 中排除所有可以赋值给类型 `U` 的成员**。它的标准定义是 `Exclude<T, U>`，即从 T 中排除那些可以赋值给 U 的类型。

 `Exclude` 的实现机制涉及到条件类型（Conditional Types）和分布式条件类型（Distributive Conditional Types）的特性。当 T 是一个联合类型时，条件类型会分布到每个成员上，逐一检查是否满足条件，然后合并结果。

例如，`Exclude<string | number, number>` 实际上会被处理为 `Exclude<string, number> | Exclude<number, number>`，也就是 `string | never`，**而 `never` 在联合类型中会被忽略**，所以最终结果是 `string`。

```ts
type Exclude<T, U> = T extends U ? never : T;
```

1. **条件类型 (`T extends U ? ...`)**

- 判断 `T` 是否可以赋值给 `U`。
- 如果 `T` 是联合类型，条件类型会触发**分布式分发（Distributive Conditional Types）**，即对联合类型中的每个成员单独应用条件判断。

2. **`never` 的作用**

- 如果 `T` 的某个成员可以赋值给 `U`，则返回 `never`（表示排除该成员）。
- 如果 `T` 的某个成员不能赋值给 `U`，则保留该成员。

3. **联合类型的自动简化**

- TypeScript 会自动从联合类型中移除 `never`，例如 `"a" | never` 会被简化为 `"a"`。



**具体执行步骤**

假设有以下类型：

```typescript
type Result = Exclude<"a" | "b" | "c", "a">;
```

1. **分发联合类型**：

   ```typescript
   // 对联合类型的每个成员独立应用条件判断
   ("a" extends "a" ? never : "a") |
   ("b" extends "a" ? never : "b") |
   ("c" extends "a" ? never : "c")
   ```

2. **逐一判断**：

   - `"a" extends "a"` → `true` → 返回 `never`
   - `"b" extends "a"` → `false` → 返回 `"b"`
   - `"c" extends "a"` → `false` → 返回 `"c"`

3. **合并结果**：

   ```typescript
   never | "b" | "c" → "b" | "c"
   ```

最终结果：

```typescript
type Result = "b" | "c"; // ✅
```



**对比 `Exclude` 和 `Extract`**

- **`Exclude<T, U>`**：从 `T` 中排除可赋值给 `U` 的成员。

  ```typescript
  type A = Exclude<"a" | 1 | true, string>; // 1 | true
  ```

- **`Extract<T, U>`**：从 `T` 中保留可赋值给 `U` 的成员。

  ```typescript
  type B = Extract<"a" | 1 | true, string>; // "a"
  ```



#### infer 

**`infer`** 是一个用于**在条件类型中推断（infer）未知类型**的关键字。它的核心作用是**在类型系统的模式匹配过程中，动态捕获并命名一个未知的子类型**，从而使类型系统能够基于现有类型结构生成新的类型。

**`infer` 的核心作用**

1. **模式匹配**
   在条件类型（`T extends U ? X : Y`）中，`infer` 允许你从 `U` 的结构中**提取某个部分的类型**，并将其赋值给一个类型变量（如 `P`）。
2. **动态类型推断**
   它不依赖手动指定的泛型参数，而是通过分析类型结构自动推断出类型。

**`infer` 的语法**

`infer` 只能在条件类型的 `extends` 子句中使用，语法为：

```ts
T extends <包含 infer 的类型模式> ? 推断结果 : 其他情况
```



**示例解析**

以 `Parameters<T>` 工具类型为例：

```typescript
type Parameters<T> = 
  T extends (...args: infer P) => any ? P : never;
```

**1. 分解逻辑**

- **条件判断**：检查 `T` 是否是一个函数类型（`(...args: any) => any`）。
- **模式匹配**：如果是函数类型，则使用 `infer P` **捕获函数参数的类型**（`args` 的类型），并将其命名为 `P`。
- **返回结果**：如果匹配成功，返回 `P`（即参数类型）；否则返回 `never`。

**2. 具体示例**

```
// 定义一个函数类型
type MyFunc = (a: string, b: number) => boolean;

// 提取参数类型
type MyParams = Parameters<MyFunc>; // [string, number]
```

- **匹配过程**：
  1. `MyFunc` 匹配模式 `(...args: infer P) => any`。
  2. 推断出 `P` 的类型为 `[string, number]`。
  3. 返回 `P`。

------

**`infer` 的常见使用场景**

1. **提取函数参数类型**

```typescript
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
```

2. **提取函数返回值类型**

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func = () => string;
type Result = ReturnType<Func>; // string
```

3. **提取数组/元组的元素类型**

```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;

type Arr = number[];
type Elem = ElementType<Arr>; // number
```

4. **提取 Promise 的泛型参数**

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Promised = Promise<string>;
type Unwrapped = UnwrapPromise<Promised>; // string
```

------

#### **`infer` 的工作原理**

1. **模式匹配**
   TypeScript 会将目标类型 `T` 与条件类型中的模式（如 `(...args: infer P) => any`）进行匹配。
2. **捕获子类型**
   如果匹配成功，`infer` 会将模式中对应位置的类型捕获到变量（如 `P`）中。
3. **返回结果**
   根据捕获的类型生成最终结果。

------

**注意事项**

1. **只能在条件类型中使用**
   `infer` 必须结合 `extends` 和条件类型（`T extends U ? X : Y`）使用，不能单独使用。

2. **联合类型的分发特性**
   如果 `T` 是联合类型，条件类型会分发（Distribute）到每个成员：

   ```typescript
   type Example<T> = T extends { data: infer U } ? U : never;
   type Input = { data: string } | { data: number };
   type Output = Example<Input>; // string | number
   ```

3. **多重 `infer` 匹配**
   可以在一个条件类型中使用多个 `infer`：

   ```typescript
   type FirstArg<T> = 
     T extends (first: infer F, ...rest: any[]) => any ? F : never;
   ```

------

**`infer` vs 泛型参数**

| **`infer`**                                           | **泛型参数**             |
| :---------------------------------------------------- | :----------------------- |
| 在条件类型中动态推断类型                              | 在定义时显式声明类型     |
| 用于从已有类型中提取子类型                            | 用于定义可复用的类型参数 |
| 示例：`type X = T extends Array<infer U> ? U : never` | 示例：`type Y<T> = T[]`  |

------

**总结**

- **`infer`** 是 TypeScript 类型系统中的一种模式匹配工具，用于在条件类型中动态推断子类型。
- 它使得类型系统能够基于现有类型的结构生成新的类型（如提取函数参数、返回值等），极大地增强了类型编程的灵活性。
- 经典应用包括 `Parameters<T>`、`ReturnType<T>` 等内置工具类型。









