### 目前前端面临的挑战

- 国内前端市场内卷严重，求职者多，岗位少，薪水有所下降
- 国内大厂对从业者的年龄和能力都有对应阶段匹配的要求
- 国内卡学历和学校，外企在这方面很松，但一般都是全站工程师

### 应对方案

- **独立开发**：
  - **自由职业者**：成为自由职业者，接受各种项目外包。
  - **创业项目**：开发自己的产品或服务，通过市场需求来验证和改进，寻找创业机会。
- **Remote远程工作**：
  - **全球机会**：利用互联网平台，寻找全球范围内的远程工作机会，避开中国本地市场的激烈竞争。
  - **灵活工作**：远程工作提供了更加灵活的工作时间和地点选择，有助于提高工作生活的平衡。
- **外企**：
  - **国际视野**：国内外企通常具有更广阔的国际视野和更为成熟的技术体系，加入外企可以学习到先进的开发理念和方法。
  - **职业发展**：外企的职业发展路径更加清晰，晋升机制相对完善，可以获得更好的职业发展机会。

### 技能储备

- **Nest.js**：
  - **全面掌握**：深入学习Nest.js框架，掌握其核心概念和使用方法，包括控制器、提供者、模块、中间件、异常过滤器、管道、守卫、拦截器等。
  - **项目实战**：通过实际项目练习，熟悉Nest.js在真实环境中的应用，提升自己的全栈开发能力。
- **英语**：
  - **语言能力**：提升英语听说读写能力，能够流利地与全球客户和团队沟通。
  - **技术文档**：熟练阅读和理解英语技术文档，快速获取最新的技术资讯和资源。

通过独立开发、远程工作和加入外企，大龄前端开发者可以有效应对竞争加剧的挑战。同时，通过技能储备，如掌握Nest.js和提升英语水平，增强自身的竞争力，为职业发展铺平道路。



1. 全站工程师（远程工作前端比后端多）
2. web3领域
3. 英语必须要好
4. 外企，一般要求全站
5. 远程工作



nestjs支持微服务，底层基于express，也可以选择Fastify。

Nest (NestJS) is a framework for building efficient, scalable [Node.js](https://nodejs.org/) server-side applications. It uses progressive JavaScript, is built with and fully supports [TypeScript](http://www.typescriptlang.org/) (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Under the hood, Nest makes use of robust HTTP Server frameworks like [Express](https://expressjs.com/) (the default) and optionally can be configured to use [Fastify](https://github.com/fastify/fastify) as well!



### nestjs示例

```
$ npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata @nestjs/platform-express 
$ npm install -g ts-node
```



| 包名                     | 介绍                                                         |
| :----------------------- | :----------------------------------------------------------- |
| @nestjs/core             | NestJS 框架的核心模块，提供构建、启动和管理 NestJS 应用程序的基础方法。 |
| @nestjs/common           | 包含构建 NestJS 应用的基础方法和常用装饰器、工具类、接口等，用于定义控制器、服务、中间件、守卫、拦截器、管道、异常过滤器等。 |
| rxjs                     | 用于构建异步和事件驱动程序的库，基于可观察序列的概念，提供强大的功能来处理异步数据流。 |
| reflect-metadata         | 在 JavaScript 和 TypeScript 中实现元编程的库，通过提供元数据反射 API，允许在运行时检查和操作对象的元数据。 |
| @nestjs/platform-express | NestJS 的平台适配器，用于将 NestJS 应用与 Express.js 集成，提供 Express.js 的中间件、路由等功能，并享受 NestJS 的模块化、依赖注入等高级特性。 |
| ts-node                  | 是一个用于直接执行 TypeScript 代码的 Node.js 实现，它允许开发者在不预先编译的情况下运行 TypeScript 文件 |



src\main.ts

```js
// 从 @nestjs/core 模块中导入 NestFactory，用于创建 Nest 应用实例
import { NestFactory } from '@nestjs/core';
// 导入应用的根模块 AppModule
import { AppModule } from './app.module';
// 定义一个异步函数 bootstrap，用于启动应用
async function bootstrap() {
  // 使用 NestFactory.create 方法创建一个 Nest 应用实例，并传入根模块 AppModule
  const app = await NestFactory.create(AppModule);
  // 让应用监听 3000 端口
  await app.listen(3000);
}
// 调用 bootstrap 函数，启动应用
bootstrap();
```

`NestFactory` 是 NestJS 框架中用于创建 Nest 应用实例的核心类。它提供了一组静态方法，用于引导和启动应用程序。

`NestFactory.create`创建一个 Nest 应用实例，默认使用 Express 作为底层 HTTP 服务器。



src\app.module.ts

```js
// 从 '@nestjs/common' 模块中导入 Module 装饰器
import { Module } from '@nestjs/common';
// 从当前目录导入 AppController 控制器
import { AppController } from './app.controller';
// 使用 @Module 装饰器定义一个模块
@Module({
  // 在 controllers 属性中指定当前模块包含的控制器
  controllers: [AppController],
})
// 定义并导出 AppModule 模块
export class AppModule {}
```

`@Module` 是 NestJS 框架中的一个装饰器，用于定义模块。模块是组织代码的基本单元，它们将相关的组件（如控制器、服务、提供者等）组合在一起。NestJS 的模块系统受到了 Angular 的启发，旨在促进代码的模块化和可维护性。



src\app.controller.ts

```js
// 导入 Controller 和 Get 装饰器
import { Controller, Get } from '@nestjs/common';
// 使用 @Controller 装饰器标记类为控制器
@Controller()
export class AppController {
  // 构造函数，目前没有任何参数和逻辑
  constructor() {}
  // 使用 @Get 装饰器标记方法为处理 GET 请求的路由
  @Get()
  // 定义 getHello 方法，返回类型为字符串
  getHello(): string {
    // 返回字符串 'hello'
    return 'hello';
  }
}
```

`@Controller` 是 NestJS 框架中的一个装饰器，用于定义控制器。控制器是处理传入 HTTP 请求的核心组件。每个控制器负责处理特定的请求路径和相应的 HTTP 方法。控制器使用路由装饰器（如 `@Get`、`@Post` 等）来定义路由和请求处理方法。

`@Get` 是 NestJS 框架中的一个装饰器，用于将控制器方法映射到 HTTP GET 请求。这个装饰器是由 `@nestjs/common` 模块提供的。通过使用 `@Get` 装饰器，可以指定该方法处理特定路径上的 GET 请求。



package.json

```json
{
  "name": "2.first-step",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node src/main.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@nestjs/common": "^10.3.9",
    "@nestjs/core": "^10.3.9",
    "@nestjs/platform-express": "^10.3.9",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  }
}
```



tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
  }
}
```



| 选项名                             | 选项介绍                                                     |
| :--------------------------------- | :----------------------------------------------------------- |
| `module`                           | 指定生成的模块代码的模块系统，`commonjs` 是 Node.js 的模块系统。 |
| `declaration`                      | 生成 `.d.ts` 声明文件。                                      |
| `removeComments`                   | 删除编译后的注释。                                           |
| `emitDecoratorMetadata`            | 为装饰器生成元数据。                                         |
| `experimentalDecorators`           | 启用实验性的装饰器特性。                                     |
| `esModuleInterop`                  | 允许从没有默认导出的模块中默认导入。这对于兼容性模块非常有用。 |
| `target`                           | 指定 ECMAScript 目标版本，`ES2021` 是一种现代的 JavaScript 版本。 |
| `sourceMap`                        | 生成对应的 `.map` 文件。                                     |
| `outDir`                           | 指定编译输出目录为 `./dist`。                                |
| `baseUrl`                          | 设置解析非相对模块名的基准目录为 `./`。                      |
| `incremental`                      | 启用增量编译，提升编译速度。                                 |
| `skipLibCheck`                     | 跳过对所有声明文件的类型检查。                               |
| `strictNullChecks`                 | 启用严格的空值检查。                                         |
| `noImplicitAny`                    | 禁止隐式 `any` 类型。                                        |
| `strictBindCallApply`              | 启用严格的 `bind`、`call` 和 `apply` 方法检查。              |
| `forceConsistentCasingInFileNames` | 强制文件名大小写一致。                                       |
| `noFallthroughCasesInSwitch`       | 禁止 switch 语句中的 case 语句贯穿（fall through）。         |





#### 扩展：

`ts-node` 是一个用于直接执行 TypeScript 代码的 Node.js 实现，它允许开发者在不预先编译的情况下运行 TypeScript 文件。`ts-node` 结合了 TypeScript 编译器和 Node.js，使得开发和测试 TypeScript 代码更加便捷。

1. **即时编译和执行**：
   - `ts-node` 在运行时即时编译 TypeScript 代码，并将其传递给 Node.js 以执行。这避免了需要先手动编译 TypeScript 代码为 JavaScript 的步骤。
2. **REPL 环境**：
   - 提供一个 REPL（Read-Eval-Print Loop）环境，可以在其中直接输入和执行 TypeScript 代码，类似于 Node.js REPL。
3. **集成 TypeScript 配置**：
   - `ts-node` 可以读取和使用项目中的 `tsconfig.json` 配置文件，以确保代码按照指定的 TypeScript 编译选项执行。



**基本用法**

1. **直接运行 TypeScript 文件**：

```sh
ts-node src/index.ts
```

这条命令会即时编译并运行 `src/index.ts` 文件中的 TypeScript 代码。

1. **使用 REPL**：

```sh
ts-node
```

进入 REPL 环境后，可以直接输入和执行 TypeScript 代码。

1. **指定 `tsconfig.json`**：

如果需要使用特定的 `tsconfig.json` 配置文件，可以使用 `--project` 选项：

```sh
ts-node --project tsconfig.json src/index.ts
```



**配合其他工具**

1. **与 nodemon 配合**：

在开发过程中，可以结合 `nodemon` 使用 `ts-node`，以便在代码更改时自动重启应用：

```sh
nodemon --exec ts-node src/index.ts
```

1. **测试框架集成**：

许多测试框架（如 Mocha、Jest）都支持与 `ts-node` 集成，以便直接编写和运行 TypeScript 测试代码。

**使用 Mocha**：

```sh
mocha --require ts-node/register src/**/*.spec.ts
```

**使用 Jest**：

在 `jest.config.js` 中配置：

```javascript
module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js']
};
```



**性能优化**

在大型项目中，运行 TypeScript 代码的性能可能会受到影响。可以使用一些选项来优化 `ts-node` 的性能：

1. **跳过类型检查**： 使用 `--transpile-only` 选项跳过类型检查，只进行转译：

   ```sh
   ts-node --transpile-only src/index.ts
   ```

2. **启用缓存**： 使用 `--cache` 选项启用编译结果的缓存，以加快后续运行速度：

   ```sh
   ts-node --cache src/index.ts
   ```

3. **使用 swc 编译器**： `swc` 是一个速度非常快的 TypeScript/JavaScript 编译器，可以与 `ts-node` 配合使用：

   首先安装 `ts-node` 和 `@swc/core`：

   ```sh
   npm install ts-node @swc/core @swc/helpers
   ```

   然后使用 `ts-node` 时指定 `swc` 作为编译器：

   ```sh
   ts-node --swc src/index.ts
   ```

**总结**

`ts-node` 使开发者能够在 Node.js 环境中直接运行 TypeScript 代码，而无需预先编译。它简化了开发流程，提高了开发效率，特别适合于快速开发和测试 TypeScript 应用程序。结合其他工具（如 nodemon 和测试框架）。



#### @nestjs/core

`@nestjs/core` 是 NestJS 框架的核心模块，提供了构建、启动和管理 NestJS 应用程序的基础设施。它包含了一些关键的类、接口和功能，用于处理**依赖注入、模块管理、生命周期管理**等。下面将详细讲解 `@nestjs/core` 的主要组成部分和它们的功能。

**主要功能和组成部分**

1. **NestFactory**：
   - 用于创建和启动 NestJS 应用程序。它提供了静态方法 `create` 和 `createMicroservice`，用于分别创建标准的 HTTP 应用和微服务应用。
   - 主要方法：
     - `create(AppModule)`: 创建一个 HTTP 应用程序实例。
     - `createMicroservice(AppModule, options)`: 创建一个微服务实例。
2. **INestApplication**：
   - 这是 NestJS 应用实例的接口，定义了应用实例的方法和属性。
   - 主要方法：
     - `listen(port, callback)`: 启动应用并监听指定端口。
     - `getHttpServer()`: 获取底层的 HTTP 服务器实例。
     - `close()`: 关闭应用。
3. **ModuleRef**：
   - 模块引用，用于在运行时动态解析和获取模块中的提供者实例。
   - 主要方法：
     - `get<T>(type: Type<T> | string | symbol, options?: { strict: boolean }): T`: 获取指定类型或标识符的提供者实例。
     - `resolve<T>(type: Type<T> | string | symbol, options?: { strict: boolean }): Promise<T>`: 异步获取指定类型或标识符的提供者实例。
4. **Reflector**：
   - 反射工具类，用于获取和处理装饰器元数据。在实现守卫、拦截器、管道等功能时，常用于访问自定义元数据。
   - 主要方法：
     - `get<T, K>(metadataKey: K, target: Type<any> | Function): T`: 获取指定元数据键的值。
     - `getAll<T>(metadataKey: any): T[]`: 获取所有元数据键的值。
5. **生命周期钩子**：
   - NestJS 提供了一些生命周期钩子，用于在应用程序的不同阶段执行自定义逻辑。
   - 主要接口：
     - `OnModuleInit`: 实现 `onModuleInit` 方法，在模块初始化时执行。
     - `OnModuleDestroy`: 实现 `onModuleDestroy` 方法，在模块销毁时执行。
     - `OnApplicationBootstrap`: 实现 `onApplicationBootstrap` 方法，在应用程序启动完成时执行。
     - `OnApplicationShutdown`: 实现 `onApplicationShutdown` 方法，在应用程序关闭时执行。

**代码示例**

以下是一个使用 `@nestjs/core` 构建和启动 NestJS 应用程序的示例：

```typescript
import { NestFactory } from '@nestjs/core';
import { Module, Injectable, Controller, Get } from '@nestjs/common';

// 服务
@Injectable()
class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// 控制器
@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// 模块
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

// 创建和启动应用
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
```

**详解**

1. **服务 (AppService)**：
   - `@Injectable` 装饰器标记 AppService 类为可注入服务。
   - `getHello` 方法返回字符串 "Hello World!"。
2. **控制器 (AppController)**：
   - `@Controller` 装饰器标记 AppController 类为控制器。
   - `@Get` 装饰器标记 `getHello` 方法为处理 GET 请求的路由。
3. **模块 (AppModule)**：
   - `@Module` 装饰器配置模块的控制器和提供者。
4. **应用启动 (bootstrap)**：
   - 使用 `NestFactory.create` 方法创建应用实例。
   - 通过 `app.listen` 启动应用监听 3000 端口，并输出应用运行信息。

通过 `@nestjs/core` 提供的这些功能，开发者可以构建、配置和管理 NestJS 应用程序的各个方面，从而实现高效、可扩展的应用开发。





Nextjs的核心就是express + 装饰器语法。



## 基础知识

###  装饰器

在nextjs中有各种装饰器：

- 类装饰器
- 参数装饰器
- 函数装饰器
- 属性装饰器

了解装饰器的语法，装饰器函数的参数，参数的含义和基本使用。



### Reflect

Reflect 是 ES6 中引入的一个内置对象，它提供了一些反射方法，这些方法与那些在 Object 和 Function 原型上的方法具有相同的名称和功能。Reflect 的引入主要是为了使操作对象的行为变得更规范和一致，并且提供一个与 Proxy 对象互补的 API。下面是对 Reflect 的详细讲解。

#### Reflect 的方法

Reflect 对象的方法大致可以分为三类：对象操作、函数调用和原型操作。以下是 Reflect 所提供的所有方法及其说明：

1. **对象操作方法**
   - **Reflect.get(target, propertyKey[, receiver])**：获取对象的属性值，相当于 `target[propertyKey]`。
   - **Reflect.set(target, propertyKey, value[, receiver])**：设置对象的属性值，相当于 `target[propertyKey] = value`。
   - **Reflect.deleteProperty(target, propertyKey)**：删除对象的属性值，相当于 `delete target[propertyKey]`。
   - **Reflect.has(target, propertyKey)**：检查对象是否有某个属性，相当于 `propertyKey in target`。
   - **Reflect.defineProperty(target, propertyKey, descriptor)**：定义对象的属性，相当于 `Object.defineProperty(target, propertyKey, descriptor)`。
   - **Reflect.getOwnPropertyDescriptor(target, propertyKey)**：获取对象自有属性的描述符，相当于 `Object.getOwnPropertyDescriptor(target, propertyKey)`。
   - **Reflect.ownKeys(target)**：返回对象的所有自有属性的键，相当于 `Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。
2. **函数调用方法**
   - **Reflect.apply(target, thisArgument, argumentsList)**：调用一个函数，相当于 `Function.prototype.apply.call(target, thisArgument, argumentsList)`。
   - **Reflect.construct(target, argumentsList[, newTarget])**：构造一个实例，相当于 `new target(...argumentsList)`。
3. **原型操作方法**
   - **Reflect.getPrototypeOf(target)**：获取对象的原型，相当于 `Object.getPrototypeOf(target)`。
   - **Reflect.setPrototypeOf(target, prototype)**：设置对象的原型，相当于 `Object.setPrototypeOf(target, prototype)`。
   - **Reflect.isExtensible(target)**：检查对象是否是可扩展的，相当于 `Object.isExtensible(target)`。
   - **Reflect.preventExtensions(target)**：让一个对象变得不可扩展，相当于 `Object.preventExtensions(target)`。

#### 具体示例

##### Reflect.get 和 Reflect.set

```javascript
const obj = { a: 1 };

// 获取对象的属性值
console.log(Reflect.get(obj, 'a')); // 1

// 设置对象的属性值
Reflect.set(obj, 'b', 2);
console.log(obj.b); // 2
```

#####  Reflect.deleteProperty

```javascript
const obj = { a: 1, b: 2 };

// 删除对象的属性
Reflect.deleteProperty(obj, 'a');
console.log(obj); // { b: 2 }
```

#####  Reflect.has

```javascript
const obj = { a: 1 };

// 检查对象是否有某个属性
console.log(Reflect.has(obj, 'a')); // true
console.log(Reflect.has(obj, 'b')); // false
```

##### Reflect.defineProperty

```javascript
const obj = {};

// 定义对象的属性
Reflect.defineProperty(obj, 'a', {
  value: 1,
  writable: true,
  enumerable: true,
  configurable: true
});
console.log(obj.a); // 1
```

#####  Reflect.apply

```javascript
function sum(a, b) {
  return a + b;
}

// 调用函数
console.log(Reflect.apply(sum, undefined, [1, 2])); // 3
```

##### Reflect.construct

```javascript
function Person(name) {
  this.name = name;
}

// 构造实例
const person = Reflect.construct(Person, ['John']);
console.log(person.name); // John
```

##### Reflect.getPrototypeOf 和 Reflect.setPrototypeOf

```javascript
const obj = { a: 1 };
const proto = { b: 2 };

// 获取对象的原型
console.log(Reflect.getPrototypeOf(obj)); // {}

// 设置对象的原型
Reflect.setPrototypeOf(obj, proto);
console.log(Reflect.getPrototypeOf(obj)); // { b: 2 }
```





### reflect-metadata

`reflect-metadata` 是一个用于 TypeScript 和 ECMAScript **提案**的元数据反射库。它通过提供对元数据的定义和检索支持，简化了装饰器（Decorators）的使用。该库实现了多种元数据相关功能，可以在类、方法、参数和属性上设置和获取元数据。



要使用 `reflect-metadata`，首先需要将其安装到你的项目中。你可以使用 npm 或 yarn 进行安装：

```bash
npm install reflect-metadata
```



#### 使用方法

在使用 `reflect-metadata` 之前，需要在代码的入口文件（例如 `index.ts` 或 `main.ts`）中引入 `reflect-metadata`：

```typescript
import 'reflect-metadata';
```

`reflect-metadata` 提供了一组用于定义和检索元数据的方法：

1. **`Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)`**：定义元数据。
2. **`Reflect.hasMetadata(metadataKey, target, propertyKey)`**：检查目标对象是否具有指定的元数据。
3. **`Reflect.getMetadata(metadataKey, target, propertyKey)`**：获取目标对象的元数据。
4. **`Reflect.getOwnMetadata(metadataKey, target, propertyKey)`**：获取目标对象的自有元数据。
5. **`Reflect.deleteMetadata(metadataKey, target, propertyKey)`**：删除目标对象的元数据。

```ts
import 'reflect-metadata';

// 定义一个类
class MyClass {
  private myProperty: string;

  constructor(value: string) {
    this.myProperty = value;
  }

  // 定义一个方法，并为其添加元数据
  @Reflect.metadata('customKey', 'customValue')
  myMethod() {
    console.log(`Executing myMethod`);
  }
}

// 实例化 MyClass
const instance = new MyClass('Hello');

// 1. 定义元数据
Reflect.defineMetadata('key1', 'value1', instance, 'myProperty');

// 2. 检查是否具有指定的元数据
const hasMetadata = Reflect.hasMetadata('key1', instance, 'myProperty');
console.log(`Has metadata 'key1' for 'myProperty': ${hasMetadata}`);

// 3. 获取元数据
const metadataValue = Reflect.getMetadata('key1', instance, 'myProperty');
console.log(`Metadata 'key1' value for 'myProperty': ${metadataValue}`);

// 4. 获取自有元数据（针对方法）
const ownMetadataValue = Reflect.getOwnMetadata('customKey', instance, 'myMethod');
console.log(`Own metadata 'customKey' value for 'myMethod': ${ownMetadataValue}`);

// 5. 删除元数据
Reflect.deleteMetadata('key1', instance, 'myProperty');
const deletedMetadata = Reflect.getMetadata('key1', instance, 'myProperty');
console.log(`Metadata 'key1' after deletion: ${deletedMetadata}`);
```

元数据：描述数据的数据。



### 类

类的定义

TypeScript 中的类是基于 ECMAScript 2015（ES6）标准的实现，并在其基础上增加了类型支持和其他特性，使得面向对象编程更加完善和强大。

1. **类的定义**：
   - 类是对象的蓝图，定义了对象的属性和方法。
2. **构造函数**：
   - `constructor` 是一个特殊的方法，用于在创建对象实例时初始化对象。
3. **成员变量**：
   - 类的属性，可以是实例属性或静态属性。
4. **方法**：
   - 类的行为，可以是实例方法或静态方法。

```js
class Person {
  // 实例属性
  name: string;
  age: number;
  // 静态属性
  static species: string = 'Homo sapiens';
  // 构造函数
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  // 实例方法
  greet(): string {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
  // 静态方法
  static speciesInfo(): string {
    return `All humans belong to the species ${Person.species}.`;
  }
}
// 创建类的实例
const person1 = new Person('John', 30);
// 调用实例方法
console.log(person1.greet()); // 输出: Hello, my name is John and I am 30 years old.
// 调用静态方法
console.log(Person.speciesInfo()); // 输出: All humans belong to the species Homo sapiens.
```



```js
// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
// 实例方法
Person.prototype.greet = function () {
  return 'Hello, my name is ' + this.name + ' and I am ' + this.age + ' years old.';
};
// 静态属性
Person.species = 'Homo sapiens';
// 静态方法
Person.speciesInfo = function () {
  return 'All humans belong to the species ' + Person.species + '.';
};
// 创建类的实例
var person1 = new Person('John', 30);
// 调用实例方法
console.log(person1.greet()); // 输出: Hello, my name is John and I am 30 years old.
// 调用静态方法
console.log(Person.speciesInfo()); // 输出: All humans belong to the species Homo sapiens.
```



### 装饰器

在 js中，装饰器是一种特殊类型的声明，它能够附加到类声明、方法、访问符、属性或参数上，可以修改类的行为。装饰器是一个实验性的特性，需要在 `tsconfig.json` 文件中启用 `experimentalDecorators` 编译器选项。

#### 装饰器的类型

1. **类装饰器（Class Decorators）**：应用于类构造函数，可以用于修改类的定义。
2. **方法装饰器（Method Decorators）**：应用于方法，可以用于修改方法的行为。
3. **访问器装饰器（Accessor Decorators）**：应用于类的访问器属性（getter 或 setter）。
4. **属性装饰器（Property Decorators）**：应用于类的属性。
5. **参数装饰器（Parameter Decorators）**：应用于方法参数。



| 装饰器名称                          | 装饰器描述                                 | 装饰器的参数说明                                             |
| :---------------------------------- | :----------------------------------------- | :----------------------------------------------------------- |
| 类装饰器（Class Decorators）        | 应用于类构造函数，可以用于修改类的定义。   | `constructor: Function`                                      |
| 方法装饰器（Method Decorators）     | 应用于方法，可以用于修改方法的行为。       | `target: Object, propertyKey: string, descriptor: PropertyDescriptor` |
| 访问器装饰器（Accessor Decorators） | 应用于类的访问器属性（getter 或 setter）。 | `target: Object, propertyKey: string, descriptor: PropertyDescriptor` |
| 属性装饰器（Property Decorators）   | 应用于类的属性。                           | `target: Object, propertyKey: string`                        |
| 参数装饰器（Parameter Decorators）  | 应用于方法参数。                           | `target: Object, propertyKey: string, parameterIndex: number` |



#### 类装饰器

##### 简单类装饰器

```js
function logClass(constructor: Function) {
    console.log("Class created:", constructor.name);
}

@logClass
class Person {
    constructor(public name: string) {}
}

// 输出: Class created: Person
```



##### 类装饰器工厂

装饰器工厂是一个返回装饰器函数的函数，可以接受参数来控制装饰器的行为。

```js
function logClassWithParams(message: string) {
    return function (constructor: Function) {
        console.log(message, constructor.name);
    };
}

@logClassWithParams("Creating class:")
class Car {
    constructor(public model: string) {}
}

// 输出: Creating class: Car
```



##### 修改类的行为

这个装饰器扩展了类的功能，添加了一个新的属性和方法。

```js
function addTimestamp<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        timestamp = new Date();
    };
}

interface Document{
    timestamp: Date;
} 

@addTimestamp
class Document {
    constructor(public title: string) {}
}

const doc = new Document("My Document");
//const doc = new Document("My Document") as Document & { timestamp: Date };
console.log(doc.title); // My Document
console.log(doc.timestamp); // 当前日期和时间

export {}
```

当一个类的名字和一个接口的名字是一样的话，会进行一个声明合并。



##### 替换类的构造函数

可以通过返回一个新的构造函数来替换原有的构造函数，从而修改类的实例化过程。

```js
function replaceConstructor<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            console.log("Instance created");
        }
    };
}

@replaceConstructor
class User {
    constructor(public name: string) {}
}

const user = new User("Alice");
// 输出: Instance created
```



#### 方法装饰器

在 TypeScript 中，方法装饰器（Method Decorators）用于修饰类的方法。它们可以用于修改方法的行为、添加元数据、进行日志记录、权限检查等。方法装饰器的目标是类的方法，其签名为

`(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void | PropertyDescriptor`。

##### 方法装饰器的语法

方法装饰器是一个接受三个参数的函数：

1. **`target`**：装饰的目标对象，对于静态成员来说是类，对于实例成员（属性或者方法）是类的原型对象。
2. **`propertyKey`**：装饰的成员名称。
3. **`descriptor`**：成员的属性描述符。



##### 日志记录（切片编程）

可以在方法调用前后记录日志，跟踪方法调用情况。

```js
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments: ${args}`);
        const result = originalMethod.apply(this, args);
        console.log(`Result: ${result}`);
        return result;
    };
    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(2, 3);
```



##### 权限检查

可以在方法调用前检查用户权限，决定是否允许调用。

```js
function authorize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;  // 原方法
    descriptor.value = function (...args: any[]) {
        const user = { roles: ['admin'] };
        if (!user.roles.includes('admin')) {
            throw new Error("User is not authorized to call this method");
        }
        return originalMethod.apply(this, args);
    };
    return descriptor;
}

class AdminPanel {
    @authorize
    deleteUser(userId: string) {
        console.log(`User ${userId} deleted`);
    }
}
const adminPanel = new AdminPanel();
adminPanel.deleteUser('123'); // User 123 deleted
```



##### 方法缓存

可以缓存方法的返回结果，以提高性能。

```js
function cache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cacheMap = new Map<string, any>();
    descriptor.value = function (...args: any[]) {
        const key = JSON.stringify(args);
        if (cacheMap.has(key)) {
            return cacheMap.get(key);
        }
        const result = originalMethod.apply(this, args);
        cacheMap.set(key, result);
        return result;
    };
    return descriptor;
}

class MathOperations {
    @cache
    factorial(n: number): number {
        if (n <= 1) {
            return 1;
        }
        return n * this.factorial(n - 1);
    }
}
const mathOps = new MathOperations();
console.log(mathOps.factorial(5)); // 120
console.log(mathOps.factorial(5)); // 从缓存中获取结果
```



#### 访问器装饰器

访问器装饰器（Accessor Decorators）是TS中的一种装饰器类型，用于装饰类的访问器属性（getter 和 setter）。访问器装饰器可以用于修改或替换访问器的行为，添加元数据，进行日志记录等。

##### 访问器装饰器的语法

访问器装饰器是一个接受三个参数的函数：

1. **`target`**：装饰的目标对象，对于静态成员来说是类，对于实例成员是类的原型对象。
2. **`propertyKey`**：访问器的名称。
3. **`descriptor`**：访问器的属性描述符。

访问器装饰器的签名为 `(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void | PropertyDescriptor`。

##### 日志记录

可以在访问器的 `get` 和 `set` 方法中添加日志记录，以跟踪属性的访问和修改。

```js
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalGet = descriptor.get;
    const originalSet = descriptor.set;
    if (originalGet) {
        descriptor.get = function() {
            const result = originalGet.apply(this);
            console.log(`Getting value of ${propertyKey}: ${result}`);
            return result;
        };
    }
    if (originalSet) {
        descriptor.set = function(value: any) {
            console.log(`Setting value of ${propertyKey} to: ${value}`);
            originalSet.apply(this, [value]);
        };
    }
    return descriptor;
}
class User {
    private _name: string;
    constructor(name: string) {
        this._name = name;
    }
    @log
    get name() {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
}
const user = new User("Alice");
console.log(user.name); // Getting value of name: Alice
user.name = "Bob"; // Setting value of name to: Bob
console.log(user.name); // Getting value of name: Bob
```





##### 权限控制

可以在访问器中添加权限检查，以控制属性的访问权限。

```js
function adminOnly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalGet = descriptor.get;
    descriptor.get = function() {
        const user = { role: 'user' }; // 示例用户对象
        if (user.role !== 'admin') {
            throw new Error("Access denied");
        }
        return originalGet.apply(this);
    };
    return descriptor;
}
class SecureData {
    private _secret: string = "top secret";
    @adminOnly
    get secret() {
        return this._secret;
    }
}
const data = new SecureData();
try {
    console.log(data.secret); // 抛出错误: Access denied
} catch (error) {
    console.log(error.message);
}
```



#### 属性装饰器

属性装饰器（Property Decorators）用于修饰类的属性。属性装饰器用于添加元数据或进行属性初始化等操作，但不同于方法装饰器和类装饰器，它不能直接修改属性的值或属性描述符。

##### 属性装饰器的语法

属性装饰器是一个接受两个参数的函数：

1. **`target`**：装饰的目标对象，对于静态属性来说是类，对于实例属性是类的原型对象。
2. **`propertyKey`**：装饰的属性名称。

属性装饰器的签名为 `(target: Object, propertyKey: string | symbol) => void`。



##### 元数据添加

属性装饰器常用于添加元数据，可以结合 `Reflect` API 使用，以便在运行时获取元数据。

```js
import "reflect-metadata";

function required(target: any, propertyKey: string) {
    Reflect.defineMetadata("required", true, target, propertyKey);
}
class User {
    @required
    username: string;
}
function validate(user: User) {
    for (let key in user) {
        if (Reflect.getMetadata("required", user, key) && !user[key]) {
            throw new Error(`Property ${key} is required`);
        }
    }
}
const user = new User();
user.username = "";
validate(user); // 抛出错误：Property username is required
```



##### 属性访问控制

可以使用属性装饰器来定义属性的访问控制或初始值设置。

```js
function defaultValue(value: string) {
  return function (target: any, propKey: string) {
    let val = value;
    const getter = function () {
      return val;
    };
    const setter = function (newVal) {
      val = newVal;
    };
    Object.defineProperty(target, propKey, {
      enumerable: true,
      configurable: true,
      get: getter,
      set: setter,
    });
  };
}

class Settings {
  @defaultValue("dark")
  theme: string;
}

const s1 = new Settings();
console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(s1), "theme"));//有值
console.log(Object.getOwnPropertyDescriptor(s1, "theme"));//undefined
console.log(s1.theme, "--theme");//dark --theme
```



- 请注意上述写法仅限于target为ES2015时可用，因为在老版本中类的属性是放在原型对象上的

  ```js
  {
    "compilerOptions": {
      "target": "ES2015"
    }
  }
  ```

- 对于版本无效，因为在新版本中，类的属性是放在类的实例上的

  ```js
  {
    "compilerOptions": {
      "target": "ESNext",
    }
  }
  ```

如果是新版本的话就需要使用类装饰器了

```js
function defaultValues(defaults: { [key: string]: any }) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        Object.keys(defaults).forEach(key => {
          if (this[key] === undefined) {
            this[key] = defaults[key];
          }
        });
      }
    }
  }
}
@defaultValues({
  theme: "dark",
})
class Settings {
  theme: string;
}
const s1 = new Settings();
console.log(s1.theme);  // 输出应该是 "dark"
```

##### 注意事项

1. **不可直接修改属性值**： 属性装饰器不能直接修改属性值或描述符，只能用于添加元数据或做一些初始化操作。
2. **配合其他装饰器使用**： 属性装饰器通常与其他类型的装饰器（如方法装饰器、类装饰器）配合使用，以实现更复杂的功能。



#### 参数装饰器

参数装饰器（Parameter Decorators）用于修饰类构造函数或方法的参数。参数装饰器主要用于为参数添加元数据，以便在运行时能够获取这些元数据并进行相应的处理。与其他装饰器不同，参数装饰器不直接修改参数的行为或值。

##### 参数装饰器的语法

参数装饰器是一个接受三个参数的函数：

1. **`target`**：装饰的目标对象，对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. **`propertyKey`**：参数所属的方法的名称。
3. **`parameterIndex`**：参数在参数列表中的索引。

参数装饰器的签名为 `(target: Object, propertyKey: string | symbol, parameterIndex: number) => void`。

##### 参数验证

可以使用参数装饰器在方法调用时验证参数的值。

```js
// 引入 reflect-metadata 库，用于反射元数据操作
import "reflect-metadata";
// 参数装饰器函数，用于验证方法参数
function validate(target: any, propertyKey: string, parameterIndex: number) {
    // 获取现有的必需参数索引数组，如果不存在则初始化为空数组
    const existingRequiredParameters: number[] = Reflect.getOwnMetadata("requiredParameters", target, propertyKey) || [];
    // 将当前参数的索引添加到必需参数索引数组中
    existingRequiredParameters.push(parameterIndex);
    // 将更新后的必需参数索引数组存储到方法的元数据中
    Reflect.defineMetadata("requiredParameters", existingRequiredParameters, target, propertyKey);
}
// 方法装饰器函数，用于在方法调用时验证必需参数
function validateParameters(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 保存原始方法
    const method = descriptor.value;
    // 修改方法，使其在调用时验证必需参数
    descriptor.value = function (...args: any[]) {
        // 获取方法的必需参数索引数组
        const requiredParameters: number[] = Reflect.getOwnMetadata("requiredParameters", target, propertyKey) || [];
        // 遍历必需参数索引数组，检查相应的参数是否为 undefined
        for (let parameterIndex of requiredParameters) {
            if (args[parameterIndex] === undefined) {
                // 如果必需参数为 undefined，则抛出错误
                throw new Error(`Missing required argument at position ${parameterIndex}`);
            }
        }
        // 调用原始方法并返回其结果
        return method.apply(this, args);
    };
}

// 定义 User 类
class User {
    // 构造函数，初始化 name 属性
    constructor(private name: string) {}
    // 使用 validateParameters 方法装饰器装饰 setName 方法
    @validateParameters
    setName(@validate newName: string) {
        // 设置新的 name 属性值
        this.name = newName;
    }
}
// 创建一个 User 实例
const user = new User("Alice");
// 调用 setName 方法，传入有效参数
user.setName("Bob"); // 正常
// 调用 setName 方法，传入 undefined 作为参数，触发参数验证错误
user.setName(undefined); // 抛出错误: Missing required argument at position 0
// 导出一个空对象，以避免模块级别作用域污染
export {}
```



##### 注意事项

1. **只能用于参数**： 参数装饰器只能应用于方法的参数，不能应用于类或属性。
2. **依赖反射元数据**： 参数装饰器通常依赖 `Reflect` API 来存储和访问元数据，因此需要引入 `reflect-metadata` 库，并在 `tsconfig.json` 中启用 `emitDecoratorMetadata` 选项。



#### 各种装饰器的执行顺序

**执行顺序**

1. **属性装饰器（Property Decorators）**和**方法装饰器（Method Decorators）**以及**访问器装饰器（Accessor Decorators）**
   - 按照它们在类中出现的顺序，从上到下依次执行。
2. **参数装饰器（Parameter Decorators）**
   - 在执行方法装饰器之前执行，按照参数的位置从右到左依次执行。
   - 对于同一个参数的多个装饰器，也是从从右向左依次执行
3. **类装饰器（Class Decorators）**
   - 最后执行。

**示例代码及执行顺序**

以下是一个示例代码，展示了各种装饰器的执行顺序：

```js
function classDecorator() {
    return function (constructor: Function) {
        console.log('Class decorator');
    };
}

function methodDecorator() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('Method decorator');
    };
}

function accessorDecorator() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('Accessor decorator');
    };
}

function propertyDecorator() {
    return function (target: any, propertyKey: string) {
        console.log('Property decorator');
    };
}

function parameterDecorator() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        console.log('Parameter decorator');
    };
}

@classDecorator()
class Example {
    @propertyDecorator()
    prop: string;

    @accessorDecorator()
    get myProp() {
        return this.prop;
    }

    @methodDecorator()
    method(@parameterDecorator() param: any) {
        console.log('Method execution');
    }
}
```

**执行顺序的输出**

```ts
Property decorator
Accessor decorator
Parameter decorator
Method decorator
Class decorator
function parameter1Decorator1() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        console.log('parameter1Decorator1');
    };
}
function parameter1Decorator2() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        console.log('parameter1Decorator2');
    };
}
function parameter2Decorator1() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        console.log('parameter2Decorator1');
    };
}
function parameter2Decorator2() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        console.log('parameter2Decorator2');
    };
}

class Example {
    method(
        @parameter1Decorator1() @parameter1Decorator2()param1,
        @parameter2Decorator1() @parameter2Decorator2()param2
    ) {
        console.log('Method execution');
    }
}
```

**执行顺序的输出**

```
parameter2Decorator2
parameter2Decorator1
parameter1Decorator2
parameter1Decorator1
```

