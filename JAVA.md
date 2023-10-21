

# JAVA

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







数据类型

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

- 在java中字符的本质是一个整数，输出时对应的时unicode编码集中的字符
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
  // int n2 = 1; //n2 是 int
  // byte b2 = n2; //错误，原因： 如果是变量赋值，判断类型
  // char c1 = b1; //错误， 原因 byte 不能自动转成 char
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



字符串类型转为基本类型：

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

### 

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



switch注意事项和细节

1. 表达式数据类型应和case 后的常量类型一致，或者是可以自动转成可以相互比较类型，比如输入的是字符，而常量是 int

2. switch(表达式)中表达式的返回值必须是：byte，short，int，char，enum，String中的一种

   ````java
   double c = 1.1;
   switch(c){//错误
   	case 1.1 : //错误
           System.out.println( "ok3");
           break;
   ````

3. case子句中的值必须是常量（或者常量表达式），而不能是变量
4. default子句是可选的，当没有匹配的case时，执行default
5. break语句用来在执行完一个case分支后使程序跳出switch语句块; 如果没有写break，程序会顺序执行到switch结尾，或者直到遇到break语句

<img src=".\images\image-20230818090119123.png" alt="image-20230818090119123" style="zoom:200%;" />

需要注意的是，如果没有在相应的case语句中使用`break;`语句，程序将会继续执行下一个case语句的代码块，这被称为"case穿透"。在某些情况下，可以利用"case穿透"来实现一些特定的逻辑。



### 循环

- 循环条件是返回一个布尔值的表达式 
- for( ;循环判断条件; ) 中的初始化和变量迭代可以写到其它地方，但是两边的分号不能省略。
- 循环初始值可以有多条初始化语句，但要求类型一样，并且中间用逗号隔开，循环变量迭代也可以有多条变量迭代语句，中间用逗号隔开。

<img src=".\images\image-20230818101136055.png" alt="image-20230818101136055" style="zoom:200%;" />





### 面向对象编程基础

#### 类与对象



