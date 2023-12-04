

基本使用，基础类型。

TS的特点和为什么出现TS





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

























































