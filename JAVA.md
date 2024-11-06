

# JAVA

java有许多优秀的语言特性。java是一个完整的平台，有庞大的库（大量可重用的代码），是一个提供了安全性，跨操作系统的可移植性，自动垃圾收集，绘图功能，网络连接功能和数据库存取功能等服务的**执行环境**。

java语法易读和易理解。





java的特点：

1. 简单性

   java语言在设计的时候就借鉴了c++，但是提出了c++中很少使用，难以理解，容易混淆的特性。（没有头文件，指针运算），结构，联合，操作符重载，虚基类等。

2. 面向对象

   不支持多继承，但是接口特性强大。

3. 分布式

   java提供的例程库用于处理http，ftp等基于tcp/ip协议。

4. 健壮性

   java强调早期问题的检测，运行时检测，与C++不同的是，java采用的指针模型可以消除重写内存和损坏数据的可能性。java的编译器也能检测许多在其他语言的运行时才能检测出来的问题。

5. 安全性

   因为java要用于开发网络应用和分布式系统，所以java在设计之初，就考虑了安全性，比如防止蠕虫病毒攻击的运行时堆栈溢出，无法破坏自己进程空间之外的内存，无法实现未经授权的文件读写。基于安全沙箱环境。



## 语言概述

程序：计算机能运行的一系列有序指令的集合，它为了解决某个问题。

java技术体系平台：

- java SE
- Java EE
- Java ME



java特点：

- 面向对象（oop）
- 强类型机制，异常处理，垃圾的自动回收
- 跨平台
- 解释型语言，编译后生成的.class文件可以在不同的操作系统下运行



Java虚拟机：

- 一种虚拟的计算机，它有自己的指令集和不同的存储区域，他能执行指令，管理数据、内存、寄存器。
- 不同操作系统下有不同的虚拟机
- 具体不是java语言跨平台而是不同平台有自己的java虚拟机



java的运行机制和过程：

xxx.java代码文件编译（javac  xxx.java）=> xxx.class文件=> 不同操作系统下的JVM（Java虚拟机）执行.class文件( java xxx ) 



JDK：

- JDK 的全称(Java Development Kit Java 开发工具包) 

- JDK = JRE + java 的开发工具 [java, javac,javadoc,javap 等] 

- JDK 是提供给 Java 开发人员使用的，其中包含了 java 的开发工具，也包括了 JRE

  

JRE：

- JRE(Java Runtime Environment Java 运行环境)
- JRE = JVM + Java 的核心类库[类]
- 如果想要运行一个开发好的Java 程序，计算机中只需要安装 JRE 即可



JDK、JRE 和 JVM 的包含关系 

- JDK = JRE + 开发工具集（例如 Javac,java 编译工具等) 
- JRE = JVM + Java SE 标准类库（java 核心类库） 
- 如果只想运行开发好的 .class 文件只需要 JRE





## 语言基础

### hello案例

```java
//1. public class Hello 表示 Hello 是一个类,是一个 public 公有的类
//2. Hello{ } 表示一个类的开始和结束
//3. public static void main(String[] args) 表示一个主方法,即我们程序的入口
//4. main() {} 表示方法的开始和结束
//5. System.out.println("hello,world~"); 表示输出"hello,world~"到屏幕
//6. ;表示语句结束
public class Hello {
    //编写一个 main 方法
    public static void main(String[] args) {
        System.out.println("hello");
    }
}

//一个源文件中最多只能有一个 public 类。其它类的个数不限。[演示]
//Dog 是一个类
//编译后，每一个类，都对于一个.class
class Dog {
    //可以将 main 方法写在非public 类中，然后指定运行非 public 类，这样入口方法就是非 public 的 main 方法
    public static void main(String[] args) {
        System.out.println("hello, 小狗狗~");
    }
}

// ......
```

javac Hello.java  (将源文件编译为字节码文件)

java Hello (不能带.class后缀) ：该指令是指找到Hello这个主类来执行，执行的是上面编写的Hello这个类。

**一个文件中最多只能有一个public类，如果一个文件中有了public类，那文件名和该类的名字必须一样。**



文件名和public类的类名不一样的情况

![image-20230817103828247](images\image-20230817103828247.png)

如果一个源文件中有其他处理public修饰的类以的类，那么在编译的时候，会生成这些类对应的class文件。

![image-20230817103622201](images\image-20230817103622201.png)



![image-20230817103655130](images\image-20230817103655130.png)



![image-20230817104130871](images\image-20230817104130871.png)





### 文档注释

通过文档注释，注释的内容可以被Jdk提供的工具javadoc解析，生成一套以网页文件形式展示的程序的说明文档，一般用于对类进行注释。

```java
/**
	*	@author name
	* @version 1.0.0
	*/
public class Comment{
  public static void main(String[] args){
    
  }
}
```

@xxxxx 被叫做javadoc标签，并不是随便写的。



```shell
javadoc -d 目录名 -xx -yy 文件名.java

javadoc -d d:\\temp -author -version Comment.java
```





### 数据类型

每一种数据都属于某种明确的数据类型，在内存中分配了不同大小的内存空间(字节)。

- 基本数据类型
  - 数值型
    - 整数类型，存放整数
      - byte、short、int、long
    - 浮点类型，存放小数
      - floaf
      - double
  - 字符型，存放单个字符，单引号 ， char
  - 布尔型，存放true或者false，boolean
- 引用数据类型
  - 类，class
  - 接口，interface
  - 数组，[ ]

<img src=".\images\image-20230910184014124.png" alt="image-20230910184014124" style="zoom:200%;" />



java中整型的常量默认的类型是int型，声明long型常量时数值后面必须带 'l'或者‘L'。



浮点型：

![image-20230910184423041](images\image-20230910184423041.png)

- 浮点数=符号位+指数位+尾数位 
- 尾数部分可能丢失，造成精度损失(小数都是近似值)
- java中的浮点型常量默认是double型

```java
float num1 = 1.1; // 错误
float num2 = 1.1F; // 对
double num3 = 1.1; // 对
double num4 = 1.1f; // 对
```



java类的组织形式：

- 包
  - 接口
  - 类
    - 字段
    - 构造方法
    - 成员方法
    - ...
  - 异常
- 包
  - 接口
  - 类
    - 字段
    - 构造方法
    - 成员方法
    - ...
  - 异常
- 包
  - 接口
  - 类
    - 字段
    - 构造方法
    - 成员方法
    - ...
  - 异常
- ...

<img src=".\images\image-20230817183810277.png" alt="image-20230817183810277" style="zoom:200%;" />





字符类型

字符类型可以表示单个字符,字符类型是 char，char 是两个字节(可以存放汉字)，多个字符用字符串String。

```java
char c1 = 'a';
char c2 = '\t';
char c3 = '韩';
char c4 = 97;
```

- 在java中字符的本质是一个整数，输出时对应的是unicode编码集中的字符
- 可以直接给一个char类型的变量赋值一个整数
- char类型的值或者变量是可以进行运算的，相当于一个整数参与运算

```java

char c1 = 97;
System.out.println(c1); // a
char c2 = 'a'; 
System.out.println((int)c2);  // 要输出对应的数字，可以(int)字符   输出'a' 对应的数字
char c3 = '韩';
System.out.println((int)c3);//38889
char c4 = 38889;
System.out.println(c4);//韩

//char 类型是可以进行运算的，相当于一个整数，因为它都对应有 Unicode 码. 
System.out.println('a' + 10);//107
char c5 = 'b' + 1;//98+1==> 99
System.out.println((int)c5); //99
System.out.println(c5); //99->对应的字符->编码表 ASCII(规定好的)=>c
```

注意‘a’ + 10 不是‘a10’，因为‘a’不是字符串，只有字符串才是拼接功能。



![image-20241004160204946](D:\learn-notes\images\image-20241004160204946.png)





布尔类型：

boolean：true、false。

- 占一个字节
- 不可以用0或者非0的整数代替false或true



### 自动数据类型转换

当java程序中在进行赋值或者运算操作时，精度小的数据类型可以自动转为精度大的数据类型。

两条转换路径：

- char => int => long => float => double
- byte => short => int => long => float => double



- 有多种类型的数据混合运算时，系统首先自动将所有数据转换成容量最大的那种数据类型，然后再进行计算。

  ```java
  int a = 'c';  //  可以
  double d = 80;  // 可以
  
  int n1 = 10; //ok
  //float d1 = n1 + 1.1;//错误 n1 + 1.1 => 结果类型是 double
  //double d1 = n1 + 1.1;//对 n1 + 1.1 => 结果类型是 double
  float d1 = n1 + 1.1F;//对 n1 + 1.1 => 结果类型是 floa
  ```

  

- 当把精度(容量)大的数据类型赋值给精度(容量)小的数据类型时，就会报错，反之就会进行自动类型转换。

  ```java
  int n2 = 1.1; //错误 double -> int
  ```

  

- (byte, short) 和 char之间不会相互自动转换

  ```java
  // 当把具体数赋给 byte 时，先判断该数是否在 byte 范围内，如果是就可以
  byte b1 = 10; //对 , byte:-128-127
  
  int n2 = 1; //n2 是 int
  byte b2 = n2; //错误，原因： 如果是变量赋值，判断类型
  
  char c1 = b1; //错误， 原因 byte 不能自动转成 char
  ```

  

- byte，short，char 他们三者可以计算，在计算时首先转换为int类型

  ```java
  byte b2 = 1;
  byte b3 = 2;
  short s1 = 1;
  //short s2 = b2 + s1;//错, b2 + s1 => int
  
  int s2 = b2 + s1;//对, b2 + s1 => int
  
  //byte b4 = b2 + b3; //错误: b2 + b3 => int
  ```

  

- boolean 不参与转换

  ````java
  //boolean 不参与转换
  boolean pass = true;
  //int num100 = pass;// boolean 不参与类型的自动转换
  ````

  

- 自动提升原则:表达式结果的类型自动提升为操作数中最大的类型

  ```java
  byte b4 = 1;
  short s3 = 100;
  int num200 = 1;
  float num300 = 1.1F;
  double num500 = b4 + s3 + num200 + num300; //float -> double
  ```

  



在java中，为什么 int a = 10 或者  byte b = 10 并不会出现编译错误，而float c = 1  + 1.1就会报编译错误？ 

在 Java 中，出现这个现象的原因与 **数据类型的精度和自动类型提升规则** 相关。

1. **`int a = 10` 和 `byte b = 10` 不会报错**

**原因：常量表达式可以直接赋值**

- 当你写 `int a = 10` 或者 `byte b = 10` 时，`10` 是一个编译时的常量表达式，编译器知道它的值并且可以安全地将其赋值给 `int` 和 `byte` 类型的变量。
- Java 编译器会自动处理**常量表达式**的赋值。对于 `byte`、`short`、`char` 这些数据类型，只要你赋的值在它们的范围之内（例如 `byte` 的范围是 `-128` 到 `127`），编译器会自动将常量值赋给变量。

```java
byte b = 10;  // 合法，因为 10 是常量，且在 byte 的范围内
int a = 10;   // 合法，因为 10 是常量并适合 int 类型
```

2. **`float c = 1 + 1.1` 会报编译错误**

**原因：默认的 `double` 类型不能隐式转换为 `float`**

- 在 Java 中，**小数的默认类型是 `double`**。因此，`1.1` 是一个 `double` 类型的常量，而不是 `float` 类型的常量。
- 当你写 `float c = 1 + 1.1` 时，`1` 是 `int` 类型，而 `1.1` 是 `double` 类型。根据 Java 的自动类型提升规则，`int` 和 `double` 进行运算时，`int` 会被自动提升为 `double`，然后 `1 + 1.1` 的结果是 `double` 类型。
- `double` 类型的值不能直接赋值给 `float` 类型，因为 `double` 的精度比 `float` 高，直接赋值会有可能丢失精度。Java 需要你显式地进行类型转换。

**解决办法：显式类型转换**

你可以使用强制类型转换来将 `double` 转换为 `float`：

```java
float c = (float) (1 + 1.1);  // 合法，因为你显式地将 double 转换为 float
```

**为什么 `float c = 1.1` 也会报错？**

即使你直接写 `float c = 1.1;`，也会报错，因为 `1.1` 是 `double` 类型，不能隐式转换为 `float`。

解决办法是加上后缀 `f`，明确告诉编译器这是一个 `float` 类型的常量：

```
java


复制代码
float c = 1.1f;  // 合法，1.1f 是 float 类型常量
```

3. **总结**

- **`int`、`byte` 和其他整数类型的常量**可以直接赋值给变量，只要数值在该类型的范围内，编译器会自动处理。
- **`double` 是 Java 中浮点数的默认类型**，而 `float` 的精度较低，所以不能隐式地将 `double` 赋值给 `float`，需要进行显式的类型转换或使用 `float` 类型常量（后缀 `f`）。
- 通过显式转换或使用 `f` 后缀，**可以避免编译错误**







在 Java 中，不同类型之间的赋值操作遵循严格的类型转换规则。这些规则决定了在特定情况下是否需要显式转换（强制类型转换）以及编译器是否会自动进行隐式转换。你提到的两个情况：

1. **`int a = 10;` 或 `byte b = 10;`** 不会出现编译错误。
2. **`float c = 1 + 1.1;`** 会出现编译错误。

以下是对此现象的详细解释：

1. **整数赋值与隐式转换**

a. **`int a = 10;`**

- **解析**：这里将整数常量 `10` 赋值给变量 `a`，其类型为 `int`。
- **原因**：`10` 是一个整数常量，默认类型为 `int`。将 `int` 赋值给 `int` 类型变量是完全匹配的，不需要任何转换，因此不会出现编译错误。

b. **`byte b = 10;`**

- **解析**：将整数常量 `10` 赋值给变量 `b`，其类型为 `byte`。

- **原因**：

  - 虽然 `byte` 的取值范围是 `-128` 到 `127`，而 `10` 处于这个范围内。
  - Java 允许**编译时常量表达式**（如直接赋值的整数常量）从较大的整数类型（如 `int`）隐式地**窄化**到较小的整数类型（如 `byte`、`short` 或 `char`），前提是该常量值在目标类型的范围内。
  - 因此，`byte b = 10;` 是合法的，不需要显式转换。

  ```java
  byte b = 10; // 合法，因为10在byte的范围内
  ```

2. **浮点数赋值与编译错误**

#### **`float c = 1 + 1.1;`**

- **解析**：将表达式 `1 + 1.1` 的结果赋值给变量 `c`，其类型为 `float`。

- **原因**：

  - 在 Java 中，默认的浮点数类型是 `double`。因此，`1.1` 被解析为 `double` 类型。
  - 表达式 `1 + 1.1` 中，`1` 被提升为 `double`，然后与 `1.1` 进行加法运算，结果是 `double` 类型。
  - 试图将 `double` 类型的结果赋值给 `float` 类型的变量 `c` 时，**从 `double` 到 `float` 是一种** **窄化转换**，即从较高精度的类型转换为较低精度的类型。
  - Java 不允许**隐式的窄化转换**，因为这可能导致精度丢失或数据截断。因此，这会导致编译错误。

  ```java
  float c = 1 + 1.1; // 编译错误：可能会丢失精度，从 double 转换为 float
  ```

**如何修复这个错误？**

有几种方法可以将表达式的结果正确赋值给 `float` 类型的变量：

a. **使用浮点数字面量（`f` 或 `F`）**

通过在数字后面加上 `f` 或 `F`，将其明确声明为 `float` 类型。

```
java


复制代码
float c = 1.0f + 1.1f; // 合法，所有数值都是 float 类型
```

b. **显式强制类型转换**

使用强制类型转换将 `double` 类型的结果转换为 `float`。

```
java


复制代码
float c = (float)(1 + 1.1); // 合法，通过强制转换
```

c. **分步赋值**

将 `double` 类型的表达式结果赋值给一个 `double` 类型的变量，然后再将其转换为 `float`。

```
java复制代码double temp = 1 + 1.1;
float c = (float) temp; // 合法，通过分步转换
```

3. **总结**

- **整数赋值**：
  - **`int a = 10;`**：直接将 `int` 类型的常量赋值给 `int` 变量，完全匹配，无需转换。
  - **`byte b = 10;`**：虽然 `byte` 类型小于 `int`，但 Java 允许编译时常量在范围内的隐式窄化转换。
- **浮点数赋值**：
  - **`float c = 1 + 1.1;`**：表达式结果为 `double` 类型，无法隐式转换为 `float`，导致编译错误。
  - **解决方法**：使用浮点数字面量 (`f`/`F`) 或显式强制类型转换。

4. **补充说明：类型转换的原则**

Java 中的类型转换遵循以下基本原则：

1. **自动类型转换（隐式转换）**：
   - **适用情况**：从较小的数据类型转换为较大的数据类型（如 `int` 到 `long`，`float` 到 `double`）。
   - **原因**：不涉及精度丢失或数据截断，编译器自动处理。
2. **强制类型转换（显式转换）**：
   - **适用情况**：从较大的数据类型转换为较小的数据类型（如 `double` 到 `float`，`long` 到 `int`）。
   - **原因**：可能涉及精度丢失或数据截断，需要程序员明确声明转换意图。

理解这些类型转换规则，有助于避免在编写 Java 代码时遇到不必要的编译错误。



### 强制数据类型转换

自动类型转换的逆过程，将容量大的数据类型转换为容量小的数据类型。使用时要加上强制转换符( )，但可能造成精度降低或溢出,格外要注意。

```java
int i = (int)1.9;
System.out.println(i);

int j = 100;
byte b1 = (byte)j;
System.out.println(b1);
```



- 强转符号只针对于最近的操作数有效，往往会使用小括号提升优先级

  ```java
  //int x = (int)10*3.5+6*1.5; //编译错误： double -> int
  int x = (int)(10*3.5+6*1.5); // (int)44.0 -> 44
  System.out.println(x); //44
  ```

  

- char类型可以保存 int的常量值，但不能保存int的变量值，需要强转

  ```java
  char c1 = 100: //ok
  int m = 100: //ok
  char c2 = m; //错误
  char c3 = (char)m; //ok
  System.outprintln(c3)://100对应的字符
  ```

  

- byte和short,char 类型在进行运算时，当做int类型处理

```java
short s = 12; //ok
s = s-9; //错误 int ->short
byte b = 10; //ok
b = b + 11; //错误 int->byte
b =(byte)(b+11); //正确，使用强转
char c = 'a'; //ok
int i = 16; //ok
float d = .314F: //ok
double result = c + i + d; //ok float->double
byte b = 16; //ok
short s = 14: //ok
short t = s + b; //错误 int ->short
```



基本数据类型和 String 类型的转换



基本数据类型转字符串类型：

```java
int n1 = 100;
float f1 = 1.1F;
double d1 = 4.5;
boolean b1 = true;
String s1 = n1 + "";
String s2 = f1 + "";
String s3 = d1 + "";
String s4 = b1 + "";
System.out.printIn(s1 + " " + s2 + " " + s3 + " " + s4);
```



字符串类型转为基本类型：通过基本类型的包装类再调用parseXXX方法即可。

```java
//String->对应的基本数据类型
String s5 = "123";
//会在 OOP 讲对象和方法的时候回详细
//解读 使用 基本数据类型对应的包装类，的相应方法，得到基本数据类型
int num1 = Integer.parseInt(s5);
double num2 = Double.parseDouble(s5);
float num3 = Float.parseFloat(s5);
long num4 = Long.parseLong(s5);
byte num5 = Byte.parseByte(s5);
boolean b = Boolean.parseBoolean("true");
short num6 = Short.parseShort(s5);

System.out.println("===================");

System.out.println(num1);//123
System.out.println(num2);//123.0
System.out.println(num3);//123.0
System.out.println(num4);//123
System.out.println(num5);//123
System.out.println(num6);//123
System.out.println(b);//tru


//怎么把字符串转成字符 char -> 含义是指 把字符串的第一个字符得到
//解读 s5.charAt(0) 得到 s5 字符串的第一个字符 '1' 
System.out.println(s5.charAt(0));
```



注意：**在将 String 类型转成基本数据类型时，要确保String类型能够转换成有效的数据 ，比如可以把"123" , 转成一个整数，但是不能把 "hello" 转成一个整数**。如果格式不正确，就会抛出异常，程序就会终止。

````java
String str = "hello";
//转成 int
int n1 = Integer.parseInt(str);
System.out.println(n1);
````



## 运算符

运算符是一种特殊的符号，用以表示数据的运算、赋值和比较等。 

- 算术运算符 

  算术运算符是对数值类型的变量进行运算的。

- 赋值运算符 

- 关系运算符 [比较运算符] 

- 逻辑运算符 

- 位运算符

- 三元运算符



### 算数运算符

**% 的本质是一个公式：a % b = a - a / b * b**

```java
// /使用
System.out.println(10 / 4); //从数学来看是 2.5, java 中 2
System.out.println(10.0 / 4); //java 是 2.5

double d = 10 / 4;//java 中 10 / 4 = 2, 2=>2.0
System.out.println(d);// 是 2.0


// % 取模 ,取余
// 在 % 的本质 看一个公式! a % b = a - a / b * b
// -10 % 3 => -10 - (-10) / 3 * 3 = -10 + 9 = -1
// 10 % -3 = 10 - 10 / (-3) * (-3) = 10 - 9 = 1
// -10 % -3 = (-10) - (-10) / (-3) * (-3) = -10 + 9 = -1

System.out.println(10 % 3); //1
System.out.println(-10 % 3); // -1
System.out.println(10 % -3); //1
System.out.println(-10 % -3);//-1
```



```java
//++的使用
int i = 10;
i++; // 自增 等价于 i = i + 1; => i = 11
++i; // 自增 等价于 i = i + 1; => i = 12
System.out.println("i=" + i); // 12
/*
作为表达式使用
前++：++i 先自增后赋值
后++：i++先赋值后自增
*/
int j = 8;
//int k = ++j; //等价 j=j+1;k=j;
int k = j++; // 等价 k =j;j=j+1;
System.out.println("k=" + k + "j=" + j);//8 9
```





面试题：

```java
// int i = 1;//i->1
// i = i++; //规则使用临时变量: (1) temp=i;(2) i=i+1;(3)i=temp;
// System.out.println(i); // 1


// int i = 1;//i->1
// i = i++; //规则使用临时变量: (1) temp=i;(2) i=i+1;(3)i=temp;
// System.out.println(i); // 1


// 测试输出
int i1 = 10;
int i2 = 20;
int i = i1++;
System.out.print("i="+i);//10
System.out.println("i2="+i2);//20
i = --i2;
System.out.print("i="+i);//19
System.out.println("i2="+i2);//19
```



复合赋值运算符会进行类型转换

```java
int n1 = 10;
n1 += 4;// n1 = n1 + 4;
System.out.println(n1); // 14
n1 /= 3;// n1 = n1 / 3;//4
System.out.println(n1); // 4

//复合赋值运算符会进行类型转换
byte b = 3;
b += 2; // 等价 b = (byte)(b + 2);
b++; // b = (byte)(b+1);
```





**练习题**

- 假如还有 59 天放假，问：合 xx 个星期零 xx 天
- 定义一个变量保存华氏温度，华氏温度转换摄氏温度的公式为：5/9*(华氏温度-100),请求出华氏温度对应的摄氏温度。



### 关系运算符

- 关系运算符的结果都是 boolean 型，也就是要么是 true，要么是 false 
- 关系表达式 经常用在 if 结构的条件中或循环结构的条件中



### 逻辑运算符

用于连接多个条件（多个关系表达式），最终的结果也是一个 boolean 值。

- 短路与 && ， 短路或 ||，取反 !
- 逻辑与 &，逻辑或 |，^ 逻辑异或
- 对于&&短路与而言，如果第一个条件为 false ,后面的条件不再判断 
- 对于&逻辑与而言，如果第一个条件为 false ,后面的条件仍然会判断
- || 短路或：如果第一个条件为 true，则第二个条件不会判断，最终结果为 true，效率高 
-  | 逻辑或：不管第一个条件是否为 true，第二个条件都要判断，效率低



```java
byte b = 3;
b += 2;   // 等价于 b = (byte) (b + 2)

b++; // 等价于 b = (byte) (b + 1)
```



### 三元运算符

条件表达式 ? 表达式 1: 表达式 2; 

运算规则： 

1. 如果条件表达式为 true，运算后的结果是表达式 1；
1. 如果条件表达式为 false，运算后的结果是表达式 2；
1. 表达式 1 和表达式 2 要为可以赋给接收变量的类型(或可以自动转换)

```java
int a = 10;
int b = 99;
// 解读
// 1. a > b 为 false
// 2. 返回 b--, 先返回 b 的值,然后在 b-1
// 3. 返回的结果是 99
int result = a > b ? a++ : b--;
System.out.println("result=" + result);
System.out.println("a=" + a);
System.out.println("b=" + b);

int res = a > b ? a++ : --b;
if ( a > b) {
    res = a++;
} else {
    res = --b;
} 
```





## 标识符

- Java 对各种变量、方法和类等命名时使用的字符序列称为标识符
- 凡是自己可以起名字的地方都叫标识符 int num1  90;

标识符的命名规则(必须遵守)：

- 由26个英文字母大小写，0-9 ，或 $ 组成

- 数字不可以开头。int 3ab = 1;//错误

- 不可以使用关键字和保留字，但能包含关键字和保留字

- Java中严格区分大小写，长度无限制。int totalNum = 10: int n = 90:

- 标识符不能包含空格。int a b = 90;

  

命名规范：

- 包名：多单词组成时所有字母都小写：aaa.bbb.ccc //比如 com.hsp.crm

- 类名、接口名：多单词组成时，所有单词的首字母大写：XxxYyyZzz [大驼峰] 比如： TankShotGame

- 变量名、方法名：多单词组成时，第一个单词首字母小写，第二个单词开始每个单词首字母大写：xxxYyyZzz[小驼峰， 简称 驼峰法] 比如： tankShotGame

- 常量名：所有字母都大写。多单词时每个单词用下划线连接：XXX_YYY_ZZZ 比如 ：定义一个所得税率 TAX_RATE

  



用于定义数据类型的关键字：class、**interface、enum**、byte、short、int、long、float、double、char、boolean、void

用于定义数据类型值的关键字：true、false、null

定义**访问权限修饰符**的关键字：private，protected，public

定义**类，函数，变量修饰符**的关键字：abstract，final，static，synchronized

定义**类与类之间关系**的关键字：extends，implements

定义**建立实例以及应用实例，判断实例**的关键字：new，this，super，instanceof

用于异常处理的关键字：try、catch、finally、throw、throws

用于包的关键字：package、import

其他修饰符关键字：native、strictfp、transient、volatile、assert



   



## 键盘输入

需要一个扫描器(对象), 就是Scanner。

1. 导入该类的所在包, java.util.* 
2. 创建该类对象（声明变量）
3. 调用里面的功能

```java
import java.util.Scanner;//表示把 java.util 下的 Scanner 类导入
public class Input {
    public static void main(String[] args) {
        //接受用户的输入
        //步骤
        //Scanner 类 表示 简单文本扫描器，在 java.util 包
        //1. 引入/导入 Scanner 类所在的包
        //2. 创建 Scanner 对象 , new 创建一个对象
        // myScanner 就是 Scanner 类的对象
        Scanner myScanner = new Scanner(System.in);
        //3. 接收用户输入了， 使用 相关的方法
        System.out.println("请输入名字");
        //当程序执行到 next 方法时，会等待用户输入~~~ 
        String name = myScanner.next(); //接收用户输入字符串
        System.out.println("请输入年龄");
        int age = myScanner.nextInt(); //接收用户输入 int
        System.out.println("请输入薪水");
        double sal = myScanner.nextDouble(); //接收用户输入 double
        System.out.println("人的信息如下:");
        System.out.println("名字=" + name + " 年龄=" + age + " 薪水=" + sal);
    }
}
```



```java
int a=1>>2; // 1 向右位移 2 位
int b=-1>>2;//算术右移
int c=1<<2;//算术左移
int d=-1<<2;//
int e=3>>>2;//无符号右移
//a,b,c,d,e 结果是多少
System.out.println("a="+a);
System.out.println("b="+b);
System.out.println("c="+c);
System.out.println("d="+d);
System.out.println("e="+e);

/*
a=0
b=-1
c=4
d=-4
e=0
*/
```



> 在Java中，整数类型（如`int`）是以补码形式表示的。在进行位运算时，如果操作数是有符号的，Java会将其扩展为32位补码。这种扩展是通过将最高位复制到所有扩展的位来完成的。
>
> 解析代码 `int b = -1 >> 2;`：
>
> 首先，将-1表示为32位补码形式：
>
> - 原始值：1111 1111 1111 1111 1111 1111 1111 1111（32位补码）
>
> 接下来，执行右移操作 `>> 2`，将所有位向右移动两位。在右移时，左侧空出的位将由符号位（最高位）填充。
>
> - 移位后的值：1111 1111 1111 1111 1111 1111 1111 1111（32位补码）
>
> 最后，将补码转换回整数表示。由于最高位仍然是1，表示负数，因此结果为负数。
>
> 因此，最终结果为 `b = -1`。
>
> 
>
> 代码 `int b = -1 << 2;`：
>
> 首先，将-1表示为32位补码形式：
>
> - 原始值：1111 1111 1111 1111 1111 1111 1111 1111（32位补码）
>
> 接下来，执行左移操作 `<< 2`，将所有位向左移动两位。在左移时，右侧空出的位将填充为零。
>
> - 移位后的值：1111 1111 1111 1111 1111 1111 1111 1100（32位补码）
>
> 最后，将补码转换回整数表示。由于最高位仍然是1，表示负数，因此结果为负数。
>
> 因此，最终结果为 `b = -4`。
>
> 请注意，在计算机中，负数的补码表示是通过将其对应的正数的补码按位取反，并在最后加1来得到的。在左移操作中，负数的补码形式会根据左移的位数而改变，因此结果可能不是期望的。如果希望得到预期的结果，请确保理解位运算和补码表示的规则，并根据需要进行适当的转换。



```java
~2=? // 按位取反
2&3=?// 2 按位与 3
2|3=? ~-5=?
13&7=?
5|4=?
-3^3=?//^ 按位异或
```

> 在Java中，`~` 是位求反（bitwise complement）操作符。它会对操作数的每个位执行逻辑取反操作，即将每个位的0变为1，将每个位的1变为0。
>
> 对于整数值2（以补码形式表示），其二进制表示为：
> 0000 0000 0000 0000 0000 0000 0000 0010
>
> 应用位求反操作 `~` 后，将得到：
> 1111 1111 1111 1111 1111 1111 1111 1101
>
> 这是一个32位补码表示，因为在Java中整数类型（如`int`）默认为32位。
>
> 因此，在Java中，`~2` 的结果为 -3（以补码形式表示）。



- 二进制的最高位是符号位: 0表示正数,1表示负数
- 正数的原码，反码，补码都一样
- 负数的反码=它的原码符号位不变，其它位取反(0->1,1->0)
- 负数的补码=它的反码+1，负数的反码 =负数的补码 - 1
- 0的反码，补码都是0
- java没有无符号数，java中的数都是有符号的
- 在计算机运算的时候，都是以补码的方式来运算的.
- 当我们看运算结果的时候，要看他的原码



java没有区分数字型数值是否有符号位，都是统一为有符号的数。



对于负数的反码计算，可以按照以下步骤进行：

1. 将负数的绝对值转换为二进制表示形式。
2. 对二进制表示的每一位进行取反操作，即0变为1，1变为0。这就是反码的基本概念。

假设要计算-5的反码：

1. 首先，将5转换为二进制，得到 00000101。
2. 对二进制表示的每一位进行取反操作，得到 11111010。



负数的补码计算方法如下：

1. 首先，将负数的绝对值转换为二进制表示形式。
2. 然后，将二进制数中的每一位取反，即0变为1，1变为0。这就是反码的基本概念。
3. 最后，将所有位数取反后的二进制数的最低有效位（LSB）加1，得到最终的反码表示。

举个例子来说明：

假设要计算-5的反码：

1. 首先，将5转换为二进制，得到 00000101。
2. 将二进制数中的每一位取反，得到 11111010。
3. 最低有效位加1，得到最终的反码表示：11111011。

因此，-5的反码是 11111011。



7个位运算：&、|、 ^ 、~、>>、<<和 >>>

按位与&：两位全为1，结果为1，否则为0

按位或：两位有一个为1，结果为1，否则为0

按位异或：两位一个为0,一个为1，结果为1，否则为0

按位取反~：0->1  1->0

算术右移 >>：低位溢出,符号位不变,并用符号位补溢出的高位

算术左移 <<: 符号位不变,低位补 0

\>>> 逻辑右移也叫无符号右移,运算规则是: 低位溢出，高位补 0

**没有 <<< 符号**



a %b，当a是小数时，公式 = a- (int)a / b* b

-10.5%3 = -10.5 - (-10)/3 * 3 = -10.5 + 9 = -1.5

```java
int num1=(int)"18"; //错误 应该 Integer.parselnt("18”) ;
int num2=18.0; //错误 double -> int
double num3=3d;//ok 
double num4=8: //ok int -> double

int i=48; 
char ch = i+1; //错误int ->char

byte b = 19; 
short s = b+2; //错误 int ->short
```



## 流程控制语句

```java
import java.util.Scanner;//导入

Scanner myScanner = new Scanner(System.in);
System.out.println("请输入年龄");
//把年龄保存到一个变量 int age
int age = myScanner.nextInt();

char gender = scanner.next().charAt(0)  // 接收字符
```



在java中只要是一个表达式就一定会有一个值返回。

switch注意事项和细节

1. 表达式返回值的数据类型应和case后的**常量**类型一致，或者是可以自动转成可以相互比较类型，比如输入的是字符，而常量是 int

   ```java
   public class Details{
     public static void main(String[] args){
       char c = 'c';
       switch(c){
         case 'a':
           // ....
           break;
         case "b":
           // ....
           break;
       }
     }
   }
   
   // 编译阶段直接报错，因为字符串"b" 不能和char进行兼容。
   ```

   

   ```java
   public class Details{
     public static void main(String[] args){
       char c = 'c';
       switch(c){
         case 'a':
           // ....
           break;
         case 20:
           // ....
           break;
       }
     }
   }
   
   // 编译和执行都能通过，因为char类型可以自动转换为int类型
   ```

   

   
   
2. **switch(表达式)中表达式的返回值必须是：byte，short，int，char，enum，String中的一种**

   ````java
   double c = 1.1;
   switch(c){//错误
     case 1.1 : //错误
       System.out.println( "ok3");
       break;
   ````

3. **case子句中的值必须是常量（或者常量表达式），而不能是变量**

   ```java
   int a = 1;
   int c = 2;
   
   switch(c){
     case a : //错误
       System.out.println( "ok3");
       break;
   ```

   

4. default子句是可选的，当没有匹配的case时，执行default

5. break语句用来在执行完一个case分支后使程序跳出switch语句块; 如果没有写break，程序会顺序执行到switch结尾，或者直到遇到break语句

   

<img src=".\images\image-20230818090119123.png" alt="image-20230818090119123" style="zoom:200%;" />

需要注意的是，如果没有在相应的case语句中使用`break;`语句，程序将会继续执行下一个case语句的代码块，这被称为"case穿透"。在某些情况下，可以利用"case穿透"来实现一些特定的逻辑。



### 循环

- 循环条件是返回一个布尔值的表达式 
- for( ;循环判断条件; ) 中的初始化和变量迭代可以写到其它地方，但是两边的分号不能省略。
- 循环初始值可以有多条初始化语句，但要求类型一样，并且中间用逗号隔开，循环变量迭代也可以有多条变量迭代语句，中间用逗号隔开。

<img src=".\images\image-20230818101136055.png" alt="image-20230818101136055" style="zoom:200%;" />





## 数组

java中的数组只能存放多个同一类型的数据。数组属于引用类型下面的一种子类型。

定义数组方式：

1. 数据类型[] 数组名字 ={元素值1,....};
2. 数据类型 数组名字[] ={元素值1,....};
3. 数据类型[] 数组名字 = new 数据类型[length];

 java中数组创建后，如果没有赋值，则根据类型不同，会有不同的默认值。





### 二维数组

动态初始化：

类型`[][]` 数组名 = new 类型`[n][m]`   表示一个有n个元素的数组（行），数组中的每一个元素又是一个有m个元素的数组（列）。





## IEDA

IEDA以项目为单位管理代码。





## 包

在同一个包中不能有同名的类。

包的作用：

1. 区分相同名字的类
2. 用于分组管理不同的类
3. 控制访问范围



包的基本语法：

package xxx.yyy.zzz

package是一个关键字，表示打包，把包中的类进行打包。

 xxx.yyy.zzz表示一个包名

xxx.yyy也表示一个包名

这段代码；package xxx.yyy.zzz一般放在相应包下的类文件的第一行（且只有一句），声明当前类所在的包。







系统包和自定义包。



包的本质：实际上就是创建不同的文件夹来保存类文件。



包的命名规则：

1. 只能包含数字、字母、下划线、小圆点，但不能用数字开头，不能是关键字或保留字

- demo.class.exec1（x）

- demo.12a  （x）

- demo.ab12.oa（√）

  

命名规范：

- 一般是小写字母+小圆点一般是
- com.公司名.项目名.业务模块名
- 比如:com.hspedu.oa.model        com.hspedu.oa.controller
- 举例:
  - com.sina.crm.user // 用户模块
  - com.sina.crm.order // 订单模块
  - com.sina.crm.utils // 工具类





一个包下面可以有很多类文件，java中常用的包有：

1. java.lang.*：lang包是基本包，默认就会引入的，不需要自己再引入，lang包下面的类直接在代码中使用就可以。
2. java.util.*：由java系统提供的工具包，工具类
3. java.net.*：网络包，开发网络通信应用时要使用的包
4. java.awt.*：用java来做桌面端应用程序的包，GUI





**如何引入包：**

引入一个包的目的是使用包下面的类。

1. import java.util.Scanner：表示只引入该包下的这一个类（建议使用这种）
2. import java.util.*：表示引入该包下的所有类都引入







## 访问修饰符

java中提供了四种访问控制修饰符，，用于控制方法和属性的访问权限（范围）。

1. public：对所有范围公开
2. protected：对子类和同一个包中的其他类可以访问
3. 默认（什么都不写）：向同一个包中的类公开
4. private：只有本类自己可以访问

![image-20241009194848533](D:\learn-notes\images\image-20241009194848533.png)





在 Java 中，访问修饰符（**Access Modifiers**）决定了类、属性、方法等成员的可访问范围。主要有四种访问修饰符：

1. **`public`**：任何地方都可以访问。
2. **`protected`**：同一个包内和不同包的子类中可以访问。
3. **（默认，包级访问，default）**：仅在同一个包内可以访问（如果不指定修饰符，默认即为此访问级别）。
4. **`private`**：只能在类的内部访问，其他任何地方都无法访问。

下面从**类自身**、**类的子类**、**类的实例对象**、**子类的实例对象**四个角度，详细讲解这些修饰符的使用及它们的访问权限，并通过代码示例辅助理解。

1. **类自身的访问权限**

类自身可以访问所有的成员变量和方法，不论是 `private`、`protected`、`default` 还是 `public`。即类内部的所有方法和属性都是可见的。

代码示例：

```java
class ParentClass {
  public int publicVar = 1;
  protected int protectedVar = 2;
  int defaultVar = 3; // 默认访问修饰符
  private int privateVar = 4;

  public void printVars() {
    // 类的自身可以访问所有成员
    System.out.println("Public: " + publicVar);
    System.out.println("Protected: " + protectedVar);
    System.out.println("Default: " + defaultVar);
    System.out.println("Private: " + privateVar);  // 类内部可以访问 private 成员
  }
}
```

2. **类的子类的访问权限**

类的子类可以访问 `public`、`protected` 和 `default`（同包时），但无法直接访问 `private` 的成员。如果子类和父类不在同一个包中，子类只能访问 `public` 和 `protected` 的成员，不能访问 `default` 和 `private`。

代码示例：

```java
public class ParentClass {
  public int publicVar = 1;
  protected int protectedVar = 2;
  int defaultVar = 3; // 包访问权限
  private int privateVar = 4;

  public void printVars() {
    System.out.println("ParentClass - privateVar: " + privateVar);
  }
}

class ChildClass extends ParentClass {
  public void printChildVars() {
    System.out.println("Public: " + publicVar); // 可以访问
    System.out.println("Protected: " + protectedVar); // 可以访问
    System.out.println("Default: " + defaultVar); // 同包可以访问
    // System.out.println("Private: " + privateVar); // 不可以访问，编译错误
  }
}
```

如果子类在不同包中：

```java
package other;

import ParentClass;

public class DifferentPackageChild extends ParentClass {
  public void printChildVars() {
    System.out.println("Public: " + publicVar); // 可以访问
    System.out.println("Protected: " + protectedVar); // 可以访问
    // System.out.println("Default: " + defaultVar); // 不可以访问，编译错误
    // System.out.println("Private: " + privateVar); // 不可以访问，编译错误
  }
}
```

3. **类的实例对象的访问权限**

通过类的实例对象，只能访问 `public` 成员。其他如 `protected`、`default` 和 `private` 都不能通过外部实例对象访问，除非是在同一个包中的 `default` 成员。

代码示例：

```java
public class TestAccess {
  public static void main(String[] args) {
    ParentClass parent = new ParentClass();
    System.out.println(parent.publicVar); // 可以访问
    // System.out.println(parent.protectedVar); // 编译错误，不能通过实例访问
    // System.out.println(parent.defaultVar); // 编译错误，不能通过实例访问（除非同包）
    // System.out.println(parent.privateVar); // 编译错误，不能通过实例访问
  }
}
```

4. **子类的实例对象的访问权限**

子类的实例对象同样只能访问 `public` 成员，其他如 `protected` 和 `default` 成员不能通过外部实例对象直接访问，`private` 成员也不可以访问。

代码示例：

```java
public class TestAccess {
  public static void main(String[] args) {
    ChildClass child = new ChildClass();
    System.out.println(child.publicVar); // 可以访问
    // System.out.println(child.protectedVar); // 编译错误，不能通过实例访问
    // System.out.println(child.defaultVar); // 编译错误，不能通过实例访问（除非同包）
    // System.out.println(child.privateVar); // 编译错误，不能通过实例访问
  }
}
```

### 总结

| **访问修饰符** | **类自身** | **子类（同包）** | **子类（不同包）** | **实例对象** |
| -------------- | ---------- | ---------------- | ------------------ | ------------ |
| `public`       | 访问       | 访问             | 访问               | 访问         |
| `protected`    | 访问       | 访问             | 访问               | 不可访问     |
| `default`      | 访问       | 访问             | 不可访问           | 不可访问     |
| `private`      | 访问       | 不可访问         | 不可访问           | 不可访问     |

- **`public`**：无论在类内部、子类或通过实例，都可以访问。
- **`protected`**：可以被类自身、同包的子类、不同包的子类访问，但不能通过实例访问。
- **`default`**（包级访问）：只能被类自身、同包的子类访问，不能跨包访问，也不能通过实例访问。
- **`private`**：只能在类自身内部访问，其他地方都不能访问。





## 接口

在 **Java** 中，接口可以定义**常量**（`public static final`）属性，但**不能定义普通的实例属性**。接口的目的是定义类应实现的行为，因此它不应该包含状态（实例属性），而只能定义行为（方法）。但是，接口可以包含常量，这些常量通常用于为实现接口的类提供一些全局的值。

### 1. **接口中的属性（常量）定义与使用**：

- 在接口中定义的属性必须是**`public static final`**，即**常量**。虽然你可以省略这些修饰符，但接口中的所有属性默认就是 `public static final` 的。
- 常量必须在定义时进行初始化。

#### 代码示例：

```java
public interface MyInterface {
  // 定义一个常量，默认是 public static final
  int MAX_SIZE = 100;

  // 抽象方法，必须在实现类中实现
  void doSomething();
}

class MyClass implements MyInterface {
  @Override
  public void doSomething() {
    System.out.println("常量 MAX_SIZE 的值是：" + MAX_SIZE);
  }

  public static void main(String[] args) {
    MyClass obj = new MyClass();
    obj.doSomething();
  }
}
```

在这个例子中，`MAX_SIZE` 是接口中的一个常量，它可以直接在实现类中使用，接口常量通常用于配置全局的、不变的值。

2. **接口中不能定义普通实例属性**：

接口中的属性只能是常量，不能定义普通的实例属性，因为接口的主要目的是提供行为契约（即方法定义），而不是持有状态（即属性）。普通实例属性是类的职责，而不是接口的职责。

3. **为什么在接口中定义常量（属性）？**

- **全局常量**：接口中的常量可以在多个类中共享，不需要重复定义。例如，一些常量值可能是某个接口所关联的业务逻辑的一部分，它可以被多个实现类使用。
- **提高代码可读性和维护性**：定义接口常量可以避免魔法值（magic numbers）出现在代码中，增强代码的可读性。所有实现类都可以通过接口直接访问常量。
- **避免重复**：如果多个类都使用同样的常量值，可以通过接口统一定义，避免重复代码。

**使用场景示例：**

- **错误代码或状态标志**： 在定义错误代码或状态标志时，接口常常用于保存这些常量：

```java
public interface ErrorCode {
  int SUCCESS = 0;
  int ERROR_NOT_FOUND = 404;
  int ERROR_INTERNAL = 500;
}

public class MyService implements ErrorCode {
  public int processRequest() {
    // 使用接口常量
    return SUCCESS;
  }
}
```

- **接口版本控制**： 接口常量可以用于定义不同版本的标识：

  ```java
  public interface ApiVersion {
      String VERSION_1 = "v1.0";
      String VERSION_2 = "v2.0";
  }
  
  public class ApiService implements ApiVersion {
      public void printVersion() {
          System.out.println("API 版本: " + VERSION_1);
      }
  }
  ```

**总结：**

- **接口中可以定义常量（`public static final`）属性**，但不能定义普通的实例属性。
- 常量用于定义全局、不可变的值，增强代码的可读性和维护性。
- 常见的使用场景包括定义错误代码、状态标志、API 版本等。





在 **Java** 中，接口的方法可以有具体实现，但这取决于 Java 的版本。

- 在 Java 8及之后的版本中，接口可以包含两种有具体实现的方法：
  1. **默认方法**（`default` methods）
  2. **静态方法**（`static` methods）

1. **默认方法**（`default` methods）

Java 8 引入了**默认方法**，接口中的方法可以使用 `default` 关键字修饰并提供具体实现。这允许接口在不破坏现有实现的情况下向后兼容。例如，当接口需要添加新的功能时，可以通过 `default` 方法来避免对所有实现类进行修改。

**代码示例：**

```java
public interface MyInterface {
  // 默认方法，有具体实现
  default void defaultMethod() {
    System.out.println("这是一个默认方法的实现");
  }

  // 抽象方法，必须在实现类中实现
  void abstractMethod();
}

public class MyClass implements MyInterface {
  // 实现抽象方法
  @Override
  public void abstractMethod() {
    System.out.println("实现了抽象方法");
  }

  public static void main(String[] args) {
    MyClass myClass = new MyClass();
    myClass.abstractMethod();   // 输出: 实现了抽象方法
    myClass.defaultMethod();    // 输出: 这是一个默认方法的实现
  }
}

```

在这个例子中，`MyInterface` 定义了一个 `defaultMethod`，并提供了具体的实现。实现类 `MyClass` 可以选择重写 `defaultMethod`，也可以直接使用接口中的实现。

2. **静态方法**（`static` methods）

Java 8 还允许在接口中定义**静态方法**，静态方法必须使用 `static` 关键字，并且它们只能通过接口本身调用，不能通过实现类的实例来调用。

代码示例：

```java
public interface MyInterface {
  // 静态方法，有具体实现
  static void staticMethod() {
    System.out.println("这是一个静态方法的实现");
  }

  // 抽象方法
  void abstractMethod();
}

public class MyClass implements MyInterface {
  @Override
  public void abstractMethod() {
    System.out.println("实现了抽象方法");
  }

  public static void main(String[] args) {
    MyClass myClass = new MyClass();
    myClass.abstractMethod();   // 输出: 实现了抽象方法

    // 调用接口中的静态方法
    MyInterface.staticMethod(); // 输出: 这是一个静态方法的实现
  }
}

```

在这个例子中，`MyInterface` 定义了一个 `staticMethod`，并提供了具体实现。静态方法只能通过接口类名来调用，不能通过实现类或其实例调用。

3. **抽象方法**

除了默认方法和静态方法，接口中的其他方法仍然是抽象方法，必须在实现类中进行实现。

**为什么要在接口中定义默认方法和静态方法？**

- **默认方法**的主要目的是为了**向后兼容**。在接口中添加新方法时，不需要强制所有实现类都去实现这个新方法，避免对现有代码造成影响。
- **静态方法**可以用于将与接口紧密相关的辅助工具方法放在接口中，而不是放在工具类里，使代码更具组织性。

4. **Java 9 中的私有方法**

从 Java 9 开始，接口中还可以定义**私有方法**（`private` methods），用于辅助其他默认方法或静态方法。私有方法只能在接口内部被调用，不能被外部类或实现类直接调用。

代码示例：

```java
public interface MyInterface {
  // 默认方法
  default void defaultMethod() {
    privateMethod();
    System.out.println("默认方法调用了私有方法");
  }

  // 私有方法
  private void privateMethod() {
    System.out.println("这是私有方法的实现");
  }
}

public class MyClass implements MyInterface {
  public static void main(String[] args) {
    MyClass myClass = new MyClass();
    myClass.defaultMethod(); // 输出: 这是私有方法的实现
    //      默认方法调用了私有方法
  }
}

```

**总结：**

- Java 8

   开始，接口中可以有具体实现，主要有两种方式：

  - **默认方法（`default`）**：提供默认实现，允许子类继承或重写。
  - **静态方法（`static`）**：定义静态工具方法，只能通过接口名调用。

- **Java 9** 开始，接口还可以包含**私有方法**，用于在接口内部复用代码。

- 这些特性增加了接口的灵活性，使得在不破坏现有实现的情况下扩展接口变得更加容易。







java基础

javaweb

主流的框架和项目管理















