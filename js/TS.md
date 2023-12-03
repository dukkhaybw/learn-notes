## 数组类型

TS中又两种方式来表示数组类型：

1. type[]方式

   ```ts
   const digits:number[] = [1,2,3,4]
   
   const color:(number|string)[] = ['red',0]
   ```

   

2. `Array<Type>`

   ```ts
   const digits:Array<number> = [4,5,6,7]
   
   const red:Array<number|string> = ['red',0]
   ```

   

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

