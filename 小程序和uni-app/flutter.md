Flutter 是一个由 Google 开发的开源 UI 软件开发工具包（SDK），用于构建跨平台的移动、Web 和桌面应用程序。

Flutter 是一个用于构建 **高性能** 应用程序的框架。特点包括：

- **跨平台**：使用一套代码库，可以同时开发 iOS、Android、Web、Windows、macOS 和 Linux 应用程序。
- **丰富的 UI 组件**：提供了一套丰富的预构建 UI 组件（称为 Widgets），可以轻松创建美观的用户界面。
- **高性能**：Flutter 应用程序直接编译为本地机器代码，避免了性能瓶颈，运行流畅。

- **Dart 编程语言**：Flutter 使用 Dart 语言开发，Dart 是一种面向对象、强类型的语言。
- **Widgets**：Flutter 的所有 UI 都是由 Widgets 构建的。Widgets 是 Flutter 的基本构建块，按钮、文本、布局等都继承自它。
- **热重载（Hot Reload）**：在开发过程中，修改代码后可以立即看到效果，无需重新启动应用程序。



## 环境搭建

[官网](https://flutter.dev/)

[中文官网](https://flutter.cn/?_gl=1*1qnqn3u*_ga*NzMyNzM2MTQyLjE3NDA1NDAwNTc.*_ga_HPSFTRXK91*MTc0MDU0NTQyMS4yLjEuMTc0MDU0NjY0My42MC4wLjA.)

[国内配置镜像和环境变量](https://docs.flutter.cn/community/china/)

如何安装Flutter

参考官网开始流程。

1. 选择操作系统

   ![image-20250226131332673](D:\learn-notes\小程序和uni-app\images\image-20250226131332673.png)

2. 选择需要用flutter开发的应用类型

   ![image-20250226131409415](D:\learn-notes\小程序和uni-app\images\image-20250226131409415.png)

   选好后，他会给到相应类型的应用的Flutter相关环境以及工具的配置。如下都是根据用户的选择跳转的安装流程页面：

   ![image-20250226131618144](D:\learn-notes\小程序和uni-app\images\image-20250226131618144.png)

   ![image-20250226131634170](D:\learn-notes\小程序和uni-app\images\image-20250226131634170.png)

   ![image-20250226131648335](D:\learn-notes\小程序和uni-app\images\image-20250226131648335.png)

   

   下面以安卓为例。

   提示：无需单独安装 Dart，因为 Flutter SDK 包含了完整的 Dart SDK。

3. 下载安装开发工具

   - [Git for Windows](https://gitforwindows.org/) 2.27 或更高的版本来管理源代码。
   - [Android Studio](https://developer.android.com/studio/install#windows) 2024.1.1 (Koala) 或更高版本来调试和编译 Android 的 Java 或 Kotlin 代码。 Flutter 需要完整版本的 Android Studio。

   当安装了FlutterSDK并配置了环境变量后，运行`flutter doctor` 它会列出这些软件包的其他不同版本。如果出现这种情况，请安装它推荐的版本。

4. 推荐的开发工具

   - [Visual Studio Code](https://code.visualstudio.com/docs/setup/windows) 加上使用 [Flutter extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter)。
   - [Android Studio](https://developer.android.com/studio/install#windows) 2024.1.1 (Koala) 或更高版本使用 [Flutter plugin for IntelliJ](https://plugins.jetbrains.com/plugin/9212-flutter).
   - [IntelliJ IDEA](https://www.jetbrains.com/help/idea/installation-guide.html) 2024.1 或更高版本使用 [Flutter plugin for IntelliJ](https://plugins.jetbrains.com/plugin/9212-flutter).

   使用任意文本编辑器或集成开发环境 (IDE)，并结合 Flutter 的命令行工具，来使用 Flutter 构建应用程序。

   使用带有 Flutter 扩展或插件的 IDE 会提供代码自动补全、语法高亮、widget 编写辅助、调试以及其他功能。

5. 安装Flutter SDK

   官网上提到两种安装方式，一个是借助vscode中flutter插件，通过命令行的方式安装，另一种是下载压缩包解压安装，然后两种方式都需要配置环境变量。

   这里采用后一种方式：

   [下载链接](https://docs.flutter.cn/release/archive)

   ![image-20250226132926384](D:\learn-notes\小程序和uni-app\images\image-20250226132926384.png)





## 创建应用

```bash
flutter create my_flutter_app

cd my_flutter_app

# 确保模拟器已启动，然后在项目目录中运行以下命令：
flutter run 
# 应用将自动编译并部署到模拟器，启动后即可看到默认的 Flutter 示例应用。
```

![image-20250226182529423](D:\learn-notes\小程序和uni-app\images\image-20250226182529423.png)



**`.dart_tool`**：Dart 工具生成的目录，用于存储 Dart 编译器和工具的缓存文件。通常不需要手动修改或关注这个目录。

**`.idea`**：IntelliJ IDEA 或 Android Studio 生成的目录，用于存储 IDE 的配置文件（如运行配置、代码风格设置等）。如果使用其他编辑器（如 VS Code），这个目录可能不存在。

**`android`**

- Android 平台的特定代码和配置文件目录。包含 Android 项目的 Gradle 构建文件、清单文件（`AndroidManifest.xml`）等。
- 如果需要为 Android 平台添加原生代码或修改 Android 特定的配置，可以在这个目录中操作。

**`build`**

- 构建输出目录，包含编译生成的文件（如 APK、AAB、iOS 应用包等）。每次运行 `flutter build` 或 `flutter run` 时，生成的文件都会存储在这里。

**`ios`**

- iOS 平台的特定代码和配置文件目录。包含 Xcode 项目文件、`Info.plist` 等。
- 如果需要为 iOS 平台添加原生代码或修改 iOS 特定的配置，可以在这个目录中操作。

**`lib`**

- 这是 Flutter 应用的主要代码目录， Dart 代码通常都放在这里。
- `main.dart` 是应用的入口文件，Flutter 应用从这里启动。

**`linux`**：Linux 平台的特定代码和配置文件目录。如果需要为 Linux 平台添加原生代码或修改 Linux 特定的配置，可以在这个目录中操作。

**`macos`**： macOS 平台的特定代码和配置文件目录。如果需要为 macOS 平台添加原生代码或修改 macOS 特定的配置，可以在这个目录中操作。

**`test`**：这是单元测试和集成测试的目录。可以在这里编写测试代码来验证应用的逻辑和功能。

**`web`**：Web 平台的特定代码和配置文件目录。如果你需要为 Web 平台添加原生代码或修改 Web 特定的配置，可以在这个目录中操作。

**`windows`**： Windows 平台的特定代码和配置文件目录。如果需要为 Windows 平台添加原生代码或修改 Windows 特定的配置，可以在这个目录中操作。



1. **`.gitignore`**

- 这是一个 Git 配置文件，用于指定哪些文件或目录应该被 Git 忽略（即不纳入版本控制）。例如，`build` 目录通常会被忽略。

2. **`.metadata`**

- 这是 Flutter 工具生成的文件，用于记录项目的元数据（如 Flutter SDK 版本）。通常不需要手动修改。

3. **`analysis_options.yaml`**

- 这是 Dart 静态分析工具的配置文件，用于定义代码分析规则（如 lint 规则）。可以在这里自定义代码风格和静态分析行为。

4. **`new_name.iml`**

- 这是 IntelliJ IDEA 或 Android Studio 生成的项目配置文件，包含项目的模块设置。文件名通常与项目名称一致。

5. **`pubspec.lock`**

- 这是 Dart 包管理工具生成的文件，用于锁定项目依赖的具体版本。确保团队成员使用相同的依赖版本。

6. **`pubspec.yaml`**

- 这是 Flutter 项目的核心配置文件，定义了项目的元数据（如名称、描述、版本）和依赖项（如第三方库）。可以在这里添加、更新或删除依赖项。

7. **`README.md`**

- 这是项目的说明文件，通常用于描述项目的功能、使用方法、安装步骤等。可以根据需要修改这个文件。





项目入口文件： `lib/main.dart` 

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter Demo Home Page'),
      ),
      body: Center(
        child: Text('Hello, Flutter!'),
      ),
    );
  }
}
```



#### 导入 Flutter 材料设计库

```dart
import 'package:flutter/material.dart';
```

- 导入 Flutter 的 Material Design 组件库。Material Design 是 Google 推出的**一套设计规范**，里面提供了丰富的 Material 组件（如按钮、卡片、导航栏等），用于构建美观的 UI

#### 定义 `main` 函数

```dart
void main() {
  runApp(MyApp());
}
```

- `main` 函数是 Dart 程序的入口点。Flutter 应用从这里开始执行。
- `runApp()` 是 Flutter 的核心函数，用于启动应用并挂载根组件（`MyApp`）。

#### 定义 `MyApp` 类

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}
```

- `MyApp` 应用的根组件，配置了应用的主题和首页，是一个继承自 `StatelessWidget` 的类。`StatelessWidget` 表示一个不可变的组件（即它的状态不会改变），`build()` 方法是所有 StatelessWidget的子类必须实现的方法，用于描述如何构建 UI。
- `MaterialApp` 是一个 Material Design 风格的应用框架，提供了应用的基本结构和配置：
  - `title`：应用的标题。
  - `theme`：定义应用的主题。这里使用 `ThemeData` 设置主色调为蓝色。
  - `home`：应用的首页，这里设置为 `MyHomePage`。



#### 定义 `MyHomePage` 类

```dart
class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter Demo Home Page'),
      ),
      body: Center(
        child: Text('Hello, Flutter!'),
      ),
    );
  }
}
```

- `MyHomePage` 应用的首页，定义了页面的布局和内容，也是一个 `StatelessWidget`。
- `Scaffold` 是 Material Design 的一个布局结构，提供了基本的页面框架，包括：
  - `appBar`：页面顶部的导航栏，这里使用 `AppBar` 组件，标题为 `Flutter Demo Home Page`。
  - `body`：页面的主要内容区域。这里使用 `Center` 组件将内容居中显示，`Text` 组件用于显示文本 `Hello, Flutter!`。



`flutter doctor` 是 Flutter 开发工具中的一个命令，用于检查开发环境的配置情况，确保所有必要的依赖项已正确安装并配置。运行该命令后，它会生成一份报告，指出当前环境中存在的问题，并提供相应的修复建议。

**主要作用**

1. **检查 Flutter 安装**：确认 Flutter SDK 是否正确安装。
2. **检查 Dart SDK**：确保 Dart SDK 已正确安装并与 Flutter 兼容。
3. **检查 Android 工具链**：验证 Android Studio、SDK、模拟器等是否配置正确。
4. **检查 iOS 工具链**：确认 Xcode 和相关工具是否已安装并配置。
5. **检查 IDE 插件**：确保 Android Studio 或 VS Code 中的 Flutter 和 Dart 插件已安装。
6. **检查连接设备**：确认是否有可用的物理设备或模拟器。

**使用方法**

在终端或命令行中运行以下命令：

```bash
flutter doctor
```

**输出示例**

```plaintext
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.5.1, on macOS 11.5.2 20G95 darwin-x64, locale en-US)
[✓] Android toolchain - develop for Android devices (Android SDK version 30.0.3)
[✓] Xcode - develop for iOS and macOS
[✓] Chrome - develop for the web
[✓] Android Studio (version 4.2)
[✓] VS Code (version 1.60.0)
[✓] Connected device (1 available)

• No issues found!
```

**常见问题及解决**

- **Android SDK 未安装**：按提示安装 Android SDK 并设置环境变量。
- **Xcode 未安装**：在 macOS 上安装 Xcode 并同意许可协议。
- **设备未连接**：连接设备或启动模拟器。
- **IDE 插件未安装**：在 Android Studio 或 VS Code 中安装 Flutter 和 Dart 插件。







## Dart

示例：

```dart
main(List<String> args) {
  print('Hello World');
}
```



### 数据类型

Dart作为强类型语言，支持多种数据类型。首先，**基本数据类型**比如**数字（int, double）、字符串（String）、布尔（bool）**。然后是**集合类型**，比如**List、Set、Map。**还有特殊的类型如Runes和Symbol，这些可能不太常用。

Dart中的dynamic和Object类型，虽然严格来说不是数据类型，但处理动态类型时会用到。还有**Null类型**，以及**用户自定义的类和枚举**。

这些类型的基本分类和用途，比如哪些是原始类型，哪些是对象类型。需要解释清楚每个类型的特点和常见用法。比如int和double的区别，String的不可变性，List和Map的使用场景。

Dart在空安全之后，所有类型默认都是非空的。

#### 基本数据类型（原始类型）

1. **数值类型**

   - **`int`**：整数类型（如 `42`, `-3`）。
   - **`double`**：浮点数类型（如 `3.14`, `-0.5`）。
   - Dart 中没有单独的 `float` 类型，所有浮点数用 `double` 表示。

   ```dart
   // 1.整数类型int
   int age = 18;
   int hexAge = 0x12;
   print(age);
   print(hexAge);
   
   // 2.浮点类型double
   double height = 1.70;
   print(height);
   ```

   

2. **字符串类型**

   - **`String`**：表示文本（如 `"Hello"`）。
   - 支持插值（`${expression}`）和多行字符串（用 `'''` 或 `"""` 包裹）。

   

   ```dart
   // 1.定义字符串的方式
   var s1 = 'Hello World';
   var s2 = "Hello Dart";
   var s3 = 'Hello\'Fullter';
   var s4 = "Hello'Fullter";
   
   
   // 2.表示多行字符串的方式
   var message1 = '''
   哈哈哈
   呵呵呵
   嘿嘿嘿''';
   ```

   字符串和其他变量或表达式拼接: 使用${expression}, 如果表达式是一个标识符, 那么{}可以省略。

   ```dart
   // 3.拼接其他变量
   var name = 'abc';
   var age = 20;
   var height = 1.7;
   print('my name is ${name}, age is $age, height is $height');
   ```

   

   

   字符串和数字之间的转化：

   ```dart
   // 字符串和数字转化
   // 1.字符串转数字
   var one = int.parse('111');
   var two = double.parse('12.22');
   print('${one} ${one.runtimeType}'); // 111 int
   print('${two} ${two.runtimeType}'); // 12.22 double
   
   // 2.数字转字符串
   var num1 = 123;
   var num2 = 123.456;
   var num1Str = num1.toString();
   var num2Str = num2.toString();
   var num2StrD = num2.toStringAsFixed(2); // 保留两位小数
   print('${num1Str} ${num1Str.runtimeType}'); // 123 String
   print('${num2Str} ${num2Str.runtimeType}'); // 123.456 String
   print('${num2StrD} ${num2StrD.runtimeType}'); // 123.46 String
   ```

   

   

3. **布尔类型**

   - **`bool`**：仅有两个值 `true` 和 `false`。
   - 用于条件判断（如 `if (isEnabled) { ... }`）。

   **注意: Dart中不能判断非0即真, 或者非空即真。**

   ```dart
    var message = 'Hello Dart';
     // 错误的写法
     if (message) {
       print(message)
     }
   ```

   

#### 集合类型

1. **`List`**：有序集合，类似于数组。

   ```dart
   List<int> numbers = [1, 2, 3];
   List<String> names = ["Alice", "Bob"];
   
   // 1.使用类型推导定义
   var letters = ['a', 'b', 'c', 'd'];
   print('$letters ${letters.runtimeType}'); // [a, b, c, d] List<String>
   
   // 2.明确指定类型
   List<int> numbers = [1, 2, 3, 4];
   print('$numbers ${numbers.runtimeType}'); // [1, 2, 3, 4] List<int>
   ```

2. **`Set`**：无序且元素唯一的集合。

   ```dart
   Set<int> uniqueNumbers = {1, 2, 3};
   
   // 1.使用类型推导定义
   var lettersSet = {'a', 'b', 'c', 'd'};
   print('$lettersSet ${lettersSet.runtimeType}');
   
   // 2.明确指定类型
   Set<int> numbersSet = {1, 2, 3, 4};
   print('$numbersSet ${numbersSet.runtimeType}');
   ```

3. **`Map`**：键值对集合，键唯一。

   ```dart
   Map<String, int> scores = {"Alice": 90, "Bob": 85};
   
   // 1.使用类型推导定义
   var infoMap1 = {'name': 'why', 'age': 18};
   print('$infoMap1 ${infoMap1.runtimeType}');
   
   // 2.明确指定类型
   Map<String, Object> infoMap2 = {'height': 1.88, 'address': '北京市'};
   print('$infoMap2 ${infoMap2.runtimeType}');
   ```



#### 集合操作







#### 特殊类型

1. **`Runes`**：表示 Unicode 字符（如 `\u{1F600}` 输出 😀）。

   ```dart
   Runes emoji = Runes('\u{1F600}');
   ```

2. **`Symbol`**：表示 Dart 程序中的符号（反射时使用，较少直接操作）。

   ```dart
   Symbol s = #someSymbol;
   ```



#### 动态与通用类型

1. **`dynamic`**：动态类型，关闭静态类型检查。

   ```dart
   dynamic value = 10; // 可以赋值为任意类型
   value = "Hello";    // 合法
   ```

2. **`Object`**：所有 Dart 对象的基类。

   ```dart
   Object obj = 42;
   obj = "Text";       // 合法，但需显式类型转换
   ```

------

#### 空类型（Null Safety）

- **`Null`**：表示空值。

- **可空类型**：在空安全模式下，类型默认非空，需显式声明可空性。

  ```dart
  int? nullableInt = null; // 允许为 null
  String? name = null;     // 可空字符串
  ```

------

#### 用户自定义类型

1. **类（`class`）**：通过自定义类创建对象。

   ```dart
   class Person {
     String name;
     int age;
     Person(this.name, this.age);
   }
   Person user = Person("Alice", 30);
   ```

2. **枚举（`enum`）**：定义一组命名的常量值。

   ```dart
   enum Status { pending, success, error }
   Status currentStatus = Status.pending;
   ```

------

#### 类型总结

| **类型**     | **示例**                        | **用途**       |
| :----------- | :------------------------------ | :------------- |
| `int`        | `42`, `-3`                      | 整数计算       |
| `double`     | `3.14`, `-0.5`                  | 浮点数计算     |
| `String`     | `"Hello"`                       | 文本处理       |
| `bool`       | `true`, `false`                 | 逻辑判断       |
| `List`       | `[1, 2, 3]`                     | 有序集合       |
| `Set`        | `{1, 2, 3}`                     | 唯一元素集合   |
| `Map`        | `{"key": "value"}`              | 键值对存储     |
| `dynamic`    | `dynamic x = 10; x = "text"`    | 动态类型操作   |
| `Object`     | `Object obj = 42;`              | 通用对象基类   |
| 用户自定义类 | `Person user = Person("Alice")` | 封装数据和行为 |

------

#### 注意事项

- **空安全（Null Safety）**：Dart 默认启用空安全，所有类型默认非空，需用 `?` 声明可空（如 `int?`）。
- **类型推断**：使用 `var` 或 `final` 时，类型会根据初始值自动推断。
- **类型转换**：使用 `as` 进行**显式类型转换**（如 `(value as int).toDouble()`）。







### 变量

Dart是一种**强类型**的语言，但同时也支持**类型推断**，所以声明变量的方式可能包括**显式类型声明和隐式类型推断**两种。

在Dart中，可以使用`var`关键字来声明变量，这时候变量的类型会根据初始化的值自动推断出来。例如`var name = 'John';`这里name会被推断为String类型。不过，如果变量没有初始化，使用`var`的话，变量会是动态类型，也就是可以赋任何类型的值。

显式类型声明，比如`String name = 'John';`这样直接指定变量类型。这种方式下，变量一旦声明为某个类型，后续赋值必须符合该类型，否则会报错。这可能和`var`有区别，尤其是在变量初始化之后再次赋值时。

Dart中还有`dynamic`类型，用`dynamic`声明的变量可以改变类型，类似于JavaScript中的变量。例如`dynamic value = 10; value = 'hello';`这是允许的。而使用`var`声明的变量一旦类型推断确定后，就不能再改变类型了。即`var`和`dynamic`的区别。

`final`和`const`关键字，它们用于声明不可变的变量。`final`变量只能被赋值一次，赋值可以在运行时进行，而`const`变量是编译时常量，必须在声明时就初始化。例如`final time = DateTime.now();`是合法的，但`const time = DateTime.now();`会报错，因为DateTime.now()是运行时的值。此外，`const`还可以用来创建不可变的对象实例，而`final`则用于变量。

总结一下，Dart中定义变量的方式主要有以下几种：

1. 使用`var`关键字进行类型推断。

2. 显式指定类型，如`String name = 'John';`。

3. 使用`dynamic`声明动态类型变量。

4. 使用`final`声明不可变的变量，赋值一次。

5. 使用`const`声明编译时常量。

每种方式的区别，包括类型确定时机、可变性、作用域、内存分配等。比如，`var`和显式类型声明的区别在于类型推断和显式指定，但一旦类型确定后，两者在后续赋值时的限制是一样的。而`dynamic`允许变量类型变化，这在需要灵活处理类型时很有用，但会失去类型安全性。



`final`和`const`的区别在于赋值时机和是否为编译时常量。`final`变量可以在运行时确定值，而`const`必须在编译时确定，且`const`变量是隐式`final`的。例如，`const`可以用于常量表达式，而`final`不行。



在类中，`final`变量必须在构造函数执行之前初始化，而实例变量可以是`final`的，但必须在构造函数体开始之前初始化，或者通过构造函数参数初始化。



每种声明方式的使用场景和注意事项。比如，推荐在大多数情况下使用`var`和显式类型声明以提高代码可读性和类型安全，而`dynamic`应谨慎使用，只在必要时使用。`final`和`const`用于不可变数据，可以提高程序的安全性和性能。

`const`不仅用于变量，还可以用于创建常量值，比如`const list = [1,2,3];`这样的列表是不可变的。

`late`关键字，用于延迟初始化，允许变量在声明时不初始化，但在使用前必须赋值。这在Dart 2.12之后引入的非空安全特性中常见，用于处理需要稍后初始化的变量。例如`late String description;`然后在某个方法中赋值。



#### **显式类型声明**

```dart
String name = 'John';
int count = 0;
```

- 变量类型在声明时明确固定。
- 后续赋值必须与声明类型一致，否则编译报错。



#### 使用 `var` 关键字（类型推断）

```dart
var name = 'John'; // 推断为 String
var list = [1, 2, 3]; // 推断为 List<int>
```

- 类型由初始值自动推断，一旦确定后不可更改。
- 若未初始化，变量类型为 `dynamic`（但应避免未初始化）。

- 与显式类型声明等效，但语法更简洁。
- 不能重新赋值为其他类型。



#### 使用 `dynamic` 关键字（动态类型）

```dart
dynamic value = 10; // 可赋值为任意类型
value = 'Hello';    // 合法
value = true;       // 合法
```

- 允许变量在运行时改变类型。
- 完全绕过静态类型检查，可能引发运行时错误。
- 仅在需要高度灵活性时使用（如处理 JSON 数据）。



#### 使用 `final` 关键字（运行时常量）

```dart
final name = 'John';             // 类型推断为 String
final String greeting = 'Hello'; // 显式指定类型
final time = DateTime.now();     // 运行时确定值
```

- 变量只能赋值一次，赋值后不可修改。
- 值可以在运行时确定（如调用函数或构造函数）。

- 与 `const` 不同，`final` 变量可以是运行时的值。
- 适用于对象属性和需要延迟初始化的变量。



#### 使用 `const` 关键字（编译时常量）

- 值必须在编译时确定（如字面量、其他 `const` 变量或常量表达式）。
- 隐式 `final`，不可修改。
- 与 `final` 不同，`const` 要求值在编译时已知。
- 可以创建不可变的集合（如 `const List`）。

```dart
String getName() {
  return 'coderwhy';
}

main(List<String> args) {
  const name = getName(); // 错误的, 因为要执行函数才能获取到值
  final name = getName(); // 正确的
}


// const放在赋值语句的右边，可以共享对象，提高性能
class Person {
  const Person();
}

main(List<String> args) {
  final a = const Person();
  final b = const Person();
  print(identical(a, b)); // true

  final m = Person();
  final n = Person();
  print(identical(m, n)); // false
}
```





#### `late` 关键字（延迟初始化）

```dart
late String description; // 声明时不初始化

void init() {
  description = 'Initialized'; // 使用前必须赋值
}
```

- 允许变量声明时不初始化，但在使用前必须赋值。
- 结合 `final` 使用：`late final int id;`（赋值一次后不可修改）。
- 避免非空安全警告，适用于依赖外部初始化的变量（如 Flutter 的 `initState`）。
- 需要稍后初始化的变量（常见于 Flutter 状态管理）。





### 类型判断

如何判断一个变量的数据类型。

#### 使用 `is` 关键字（类型检查）

`is` 关键字用于检查变量是否是某个类型，返回布尔值（`true`/`false`）。这是最常用的类型判断方式。

```dart
void main() {
  dynamic value = 42;

  // 检查是否为 int 类型
  if (value is int) {
    print("value 是整数");
  } else if (value is String) {
    print("value 是字符串");
  }
}
```



#### 使用 `runtimeType` 属性（获取类型对象）

`runtimeType` 是 Dart 中所有对象的属性，返回一个 `Type` 对象，表示变量的实际运行时类型。

```dart
void main() {
  var value = 3.14;
  print(value.runtimeType); // 输出：double

  dynamic data = "Hello";
  print(data.runtimeType);  // 输出：String
}
```



#### 使用 `as` 关键字（类型转换）

`as` 用于将变量强制转换为指定类型，若类型不匹配会抛出 `TypeError`。通常结合 `is` 使用以确保安全。

```dart
void main() {
  dynamic value = "Hello";

  if (value is String) {
    String text = value as String; // 显式转换（可省略，因为已用 is 检查）
    print(text.toUpperCase());
  }
}
```





####  空安全下的类型检查

在空安全（Null Safety）模式下，需注意可空类型（`?`）的判断。

```dart
void checkType(dynamic value) {
  if (value == null) {
    print("value 是 null");
  } else if (value is int) {
    print("value 是整数");
  }
}
```





#### 泛型类型的判断

对于泛型集合（如 `List<T>`），`runtimeType` 会返回具体类型，但需注意 Dart 的泛型类型擦除问题。

```dart
void main() {
  List<int> numbers = [1, 2, 3];
  print(numbers.runtimeType); // 输出：List<int>

  List<String> names = ["Alice"];
  print(names.runtimeType);   // 输出：List<String>
}
```



### 函数

```dart
返回类型 函数名(参数列表) {
  // 函数体
  return 返回值;
}
```

示例

```dart
int add(int a, int b) {
  return a + b;
}

void main() {
  print(add(3, 5)); // 输出：8
}
```

- **返回值类型**：可以是任意数据类型（如 `int`、`String`），若无返回值则用 `void`。
- **参数**：需指定参数类型，多个参数用逗号分隔。

------

#### 可选参数

Dart 支持两种可选参数：**位置可选参数**和**命名可选参数**。

**位置可选参数**

- 使用 `[]` 包裹参数，**参数按位置传递**。
- 必须为非空参数或提供默认值。

```dart
String greet(String name, [String? greeting]) {
  return greeting != null ? "$greeting, $name!" : "Hello, $name!";
}

void main() {
  print(greet("Alice")); // 输出：Hello, Alice!
  print(greet("Bob", "Hi")); // 输出：Hi, Bob!
}
```

**命名可选参数**

- 使用 `{}` 包裹参数，**参数按名称传递**。
- 必须为非空参数或提供默认值。

```dart
void printUser({String name = "Guest", int age = 0}) {
  print("Name: $name, Age: $age");
}

void main() {
  printUser(name: "Alice", age: 30); // 输出：Name: Alice, Age: 30
  printUser(); // 输出：Name: Guest, Age: 0
}



// 命名可选参数
printInfo1(String name, {int age, double height}) {
  print('name=$name age=$age height=$height');
}

// 调用printInfo1函数
printInfo1('asd'); // name=asd age=null height=null
printInfo1('asd', age: 33); // name=asd age=33 height=null
printInfo1('asd', age: 33, height: 1.7); // name=asd age=33 height=1.7
printInfo1('asd', height: 1.5); // name=asd age=null height=1.5
```

------

**默认参数值**

可为可选参数设置默认值，当调用未传递参数时使用默认值。

```dart
void connect({String host = "localhost", int port = 8080}) {
  print("Connecting to $host:$port");
}

void main() {
  connect(); // 输出：Connecting to localhost:8080
  connect(host: "example.com"); // 输出：Connecting to example.com:8080
}
```

------

#### **匿名函数（Lambda 表达式）**

没有名称的函数，通常用于回调或简化代码。

语法

```dart
(参数列表) {
  // 函数体
};
```

示例

```dart
void main() {
  List<int> numbers = [1, 2, 3];
  
  numbers.forEach((number) {
    print(number * 2);
  });
  
  // 单行写法（箭头函数）
  numbers.forEach((number) => print(number * 2));
}
```

------

#### 箭头函数

当函数体只有一行时，可用 `=>` 简化。

```dart
int multiply(int a, int b) => a * b;

void main() {
  print(multiply(4, 5)); // 输出：20
}
```

------

#### 函数作为对象

Dart 中函数是一等公民，可赋值给变量或作为参数传递。

```dart
void main() {
  // 将函数赋值给变量
  Function operation = (int a, int b) => a + b;
  print(operation(3, 4)); // 输出：7

  // 函数作为参数传递
  void execute(Function func, int x, int y) {
    print(func(x, y));
  }
  
  execute((a, b) => a * b, 5, 6); // 输出：30
}


main(List<String> args) {
  // 1.将函数赋值给一个变量
  var bar = foo;
  print(bar);

  // 2.将函数作为另一个函数的参数
  test(foo);

  // 3.将函数作为另一个函数的返回值
  var func =getFunc();
  func('jack');
}

// 1.定义一个函数
foo(String name) {
  print('传入的name:$name');
}

// 2.将函数作为另外一个函数的参数
test(Function func) {
  func('tom');
}

// 3.将函数作为另一个函数的返回值
getFunc() {
  return foo;
}
```

------

#### 异步函数

使用 `async` 和 `await` 处理异步操作（如网络请求、文件读写）。

```dart
Future<void> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  print("Data loaded!");
}

void main() {
  fetchData();
  print("Loading..."); // 先输出 "Loading..."，2秒后输出 "Data loaded!"
}
```

------

#### 生成器函数

生成可迭代序列，使用 `sync*`（同步）或 `async*`（异步）。

同步生成器

```dart
Iterable<int> countUp(int max) sync* {
  for (int i = 1; i <= max; i++) {
    yield i; // 生成值
  }
}

void main() {
  countUp(3).forEach(print); // 输出 1, 2, 3
}
```

异步生成器

```dart
Stream<int> countDown(int max) async* {
  for (int i = max; i >= 1; i--) {
    yield i;
    await Future.delayed(Duration(seconds: 1));
  }
}

void main() async {
  await for (int num in countDown(3)) {
    print(num); // 每秒输出 3, 2, 1
  }
}
```

------

#### 总结

| **函数类型**     | **语法**                                 | **适用场景**       |
| :--------------- | :--------------------------------------- | :----------------- |
| 基本函数         | `int add(int a, int b) { ... }`          | 通用逻辑封装       |
| 可选参数（位置） | `[String? greeting]`                     | 可选参数按位置传递 |
| 可选参数（命名） | `{String name = "Guest"}`                | 可选参数按名称传递 |
| 匿名函数         | `(a, b) => a + b`                        | 回调或临时函数     |
| 箭头函数         | `int multiply(int a, int b) => a * b;`   | 单行函数简化       |
| 异步函数         | `Future<void> fetchData() async { ... }` | 网络请求、文件操作 |
| 生成器函数       | `sync*` / `async*`                       | 生成序列数据       |

------

#### 最佳实践

1. **明确参数类型**：增强代码可读性和安全性。
2. **合理使用可选参数**：避免函数参数过多。
3. **优先使用箭头函数**：简化单行逻辑。
4. **异步操作处理**：用 `async`/`await` 替代嵌套回调。





### 作用域

Dart 采用的是**静态词法作用域**（Lexical Scoping），也称为**词法作用域**。这意味着变量的作用域在代码编写时就已经确定，而不是在运行时动态确定。作用域的范围由代码的物理结构（如大括号 `{}`）决定。

**特点**

1. **作用域由代码结构决定**：变量的可见性由其声明的位置决定。
2. **嵌套作用域**：内部作用域可以访问外部作用域的变量，但外部作用域不能访问内部作用域的变量。
3. **作用域链**：当在当前作用域找不到变量时，会沿着作用域链向上查找。

------

**代码示例**

示例 1：基本作用域

```dart
void main() {
  int outerVar = 10; // 外部作用域变量

  void innerFunction() {
    int innerVar = 20; // 内部作用域变量
    print("innerVar: $innerVar"); // 访问内部变量
    print("outerVar: $outerVar"); // 访问外部变量
  }

  innerFunction();
  // print(innerVar); // 错误：innerVar 在此作用域不可见
}
```

- **输出**：

  ```
  innerVar: 20
  outerVar: 10
  ```

  

------

示例 2：嵌套作用域

```dart
void main() {
  int a = 1;

  void firstLevel() {
    int b = 2;

    void secondLevel() {
      int c = 3;
      print("a: $a, b: $b, c: $c"); // 访问所有外层变量
    }

    secondLevel();
    // print(c); // 错误：c 在此作用域不可见
  }

  firstLevel();
  // print(b); // 错误：b 在此作用域不可见
}
```

- **输出**：

  ```
  a: 1, b: 2, c: 3
  ```

------

示例 3：作用域链

```dart
void main() {
  int x = 10;

  void outerFunction() {
    int x = 20; // 遮蔽外部的 x

    void innerFunction() {
      print("x: $x"); // 访问最近的 x
    }

    innerFunction();
  }

  outerFunction();
}
```

- **输出**：

  ```
  x: 20
  ```

  

------

示例 4：全局作用域

```dart
int globalVar = 100; // 全局变量

void main() {
  print("globalVar: $globalVar"); // 访问全局变量

  void localFunction() {
    int localVar = 200; // 局部变量
    print("globalVar: $globalVar, localVar: $localVar");
  }

  localFunction();
  // print(localVar); // 错误：localVar 在此作用域不可见
}
```

- **输出**：

  ```
  globalVar: 100
  globalVar: 100, localVar: 200
  ```

- **说明**：

  - 全局变量 `globalVar` 在整个程序中可见。
  - 局部变量 `localVar` 只在 `localFunction` 中可见。

------

**静态词法作用域 vs 动态作用域**

| **特性**           | **静态词法作用域**            | **动态作用域**     |
| :----------------- | :---------------------------- | :----------------- |
| **作用域确定时机** | 代码编写时确定                | 运行时确定         |
| **变量查找规则**   | 沿着代码结构向上查找          | 沿着调用栈向上查找 |
| **示例语言**       | Dart、JavaScript、Python、C++ | Bash、Emacs Lisp   |

------

**总结**

- Dart 的静态词法作用域由代码的物理结构决定，变量的可见性在编写代码时就已经确定。
- 内部作用域可以访问外部作用域的变量，但外部作用域无法访问内部作用域的变量。
- 作用域链的查找规则是从内向外逐级查找。

通过理解 Dart 的作用域规则，可以更好地组织代码，避免变量冲突和意外行为。





### 闭包

Dart 中有**闭包（Closure）**的概念。闭包是指一个函数可以捕获并保存其词法作用域及其词法作用域链上的变量，即使函数在其原始作用域之外执行，仍然可以访问这些变量。

**特点**

1. **捕获变量**：闭包可以捕获其词法作用域中的变量。
2. **延长变量生命周期**：即使外部函数已经执行完毕，闭包仍然可以访问其捕获的变量。
3. **函数作为对象**：闭包是 Dart 中函数作为一等公民的体现，可以赋值给变量、作为参数传递或从函数返回。

```dart
void main() {
  Function makeAdder(int addBy) {
    return (int i) => addBy + i; // 返回一个闭包
  }

  var add2 = makeAdder(2); // 创建一个加 2 的闭包
  var add5 = makeAdder(5); // 创建一个加 5 的闭包

  print(add2(3)); // 输出：5 (2 + 3)
  print(add5(3)); // 输出：8 (5 + 3)
}
```

- `makeAdder` 函数返回一个匿名函数（闭包），该闭包捕获了 `addBy` 变量。
- 即使 `makeAdder` 执行完毕，闭包仍然可以访问 `addBy`。

```dart
void main() {
  Function counter() {
    int count = 0;
    return () {
      count++; // 捕获并修改 count
      print("Count: $count");
    };
  }

  var increment = counter();
  increment(); // 输出：Count: 1
  increment(); // 输出：Count: 2
  increment(); // 输出：Count: 3
}
```



```dart
void main() {
  var functions = [];
  for (var i = 0; i < 3; i++) {
    functions.add(() => print(i)); // 捕获循环变量 i
  }

  functions.forEach((func) => func()); // 输出：2, 2, 2
}
```

- 在循环中创建的闭包捕获的是同一个变量 `i`，而不是每次循环时的值。
- 最终 `i` 的值为 `2`，因此所有闭包输出 `2`。

```dart
void main() {
  var functions = [];
  for (var i = 0; i < 3; i++) {
    functions.add(() {
      var current = i; // 捕获当前循环的值
      return () => print(current);
    }());
  }

  functions.forEach((func) => func()); // 输出：0, 1, 2
}
```

- 通过立即执行函数（IIFE）捕获当前循环的值，解决闭包捕获问题。
- 每个闭包捕获的是不同的 `current` 值。



所有函数都返回一个值。如果没有指定返回值，则语句返回null；隐式附加到函数体。

```dart
main(List<String> args) {
  print(foo()); // null
}

foo() {
  print('foo function');
}
```





### 运算符

只记录比较特殊的运算符。

```dart
var num = 7;

print(num ~/ 3); // 整除操作, 结果2;
```

??=赋值操作

- 当变量为null时，使用后面的内容进行赋值。
- 当变量有值时，使用自己原来的值。

```dart
var name = null;
name ??= 'abc'; 
print(name);  // 打印abc
```

条件运算符

```dart
// var temp = 'abc';
var temp = null;
var name = temp ?? 'qwe';
print(name);  
```

**expr1 ?? expr2**

- 如果expr1是null，则返回expr2的结果;
- 如果expr1不是null，直接使用expr1的结果。

**级联语法：..**

- 希望对一个对象进行连续的操作，可以使用级联语法

```dart
// 级联运算符
var list = [1, 2, 3]
  ..add(4)
  ..add(5);
print(list); // [1, 2, 3, 4, 5]


class Person {
  String name = '';

  void run() {
    print("${name} is running");
  }

  void eat() {
    print("${name} is eating");
  }

  void swim() {
    print("${name} is swimming");
  }
}

main(List<String> args) {
  final p1 = Person();
  p1.name = 'abc';
  p1.run();
  p1.eat();
  p1.swim();

  final p2 =
      Person()
        ..name = "qwe"
        ..run()
        ..eat()
        ..swim();
}
```



**其他**

```dart
// 条件成员访问
var obj;
print(obj?.length); // null


// 类型测试运算符
print(a is int); // true
print(a is! String); // true
```





### 流程控制语句

- ####  `if` 语句

- #### `if-else` 语句

- #### `else-if` 语句

- #### `switch-case` 语句

  ```dart
  switch (variable) {
    case value1:
      // 当 variable 等于 value1 时执行
      break;
    case value2:
      // 当 variable 等于 value2 时执行
      break;
    default:
      // 当没有匹配的 case 时执行
  }
  ```

- #### `for` 循环

  ```dart
  for (int i = 0; i < 5; i++) {
    print(i); // 输出 0, 1, 2, 3, 4
  }
  
  
  // 用于遍历集合（如列表、集合等）
  var list = [1, 2, 3];
  for (var item in list) {
    print(item); // 输出 1, 2, 3
  }
  ```

- `while`循环

  ```dart
  int i = 0;
  while (i < 5) {
    print(i); // 输出 0, 1, 2, 3, 4
    i++;
  }
  ```

- #### `do-while` 循环

  ```dart
  int i = 0;
  do {
    print(i); // 输出 0, 1, 2, 3, 4
    i++;
  } while (i < 5);
  ```

  

  **跳转语句**

  用于改变程序的执行顺序。

  `break`

  用于终止循环或 `switch` 语句。

  ```dart
  for (int i = 0; i < 5; i++) {
    if (i == 3) {
      break; // 当 i 等于 3 时终止循环
    }
    print(i); // 输出 0, 1, 2
  }
  ```

  `continue`

  用于跳过当前循环的剩余部分，直接进入下一次循环。

  ```dart
  for (int i = 0; i < 5; i++) {
    if (i == 3) {
      continue; // 跳过 i 等于 3 的情况
    }
    print(i); // 输出 0, 1, 2, 4
  }
  ```

  `return`

  用于从函数中返回值并终止函数执行。

  ```dart
  int add(int a, int b) {
    return a + b; // 返回 a + b 的结果
  }
  ```

  `throw`

  用于抛出异常。

  ```dart
  if (value < 0) {
    throw Exception('Value cannot be negative');
  }
  ```

  ------

  

  **异常处理**

  用于处理程序运行时的错误。

  `try-catch`

  捕获并处理异常。

  ```dart
  try {
    // 可能抛出异常的代码
  } catch (e) {
    print('An error occurred: $e');
  }
  ```

  `try-catch-finally`

  无论是否发生异常，`finally` 块中的代码都会执行。

  ```dart
  try {
    // 可能抛出异常的代码
  } catch (e) {
    print('An error occurred: $e');
  } finally {
    print('This will always run');
  }
  ```

  `on` 关键字

  用于捕获特定类型的异常。

  ```dart
  try {
    // 可能抛出异常的代码
  } on FormatException {
    print('FormatException occurred');
  } on Exception catch (e) {
    print('Unknown exception: $e');
  }
  ```

  ------

  **其他流程控制**

   `assert`

  用于调试时检查条件是否为 `true`，如果为 `false` 则抛出异常。

  ```dart
  assert(condition, 'Condition is false');
  ```

  `await` 和 `async`

  用于异步编程，控制异步代码的执行顺序。

  ```dart
  Future<void> fetchData() async {
    var data = await fetchFromServer(); // 等待异步操作完成
    print(data);
  }
  ```

  ------

  **示例代码**

  ```dart
  void main() {
    // 条件语句
    int age = 18;
    if (age >= 18) {
      print('You are an adult');
    } else {
      print('You are a minor');
    }
  
    // 循环语句
    for (int i = 0; i < 3; i++) {
      print('For loop: $i');
    }
  
    // 跳转语句
    for (int i = 0; i < 5; i++) {
      if (i == 3) {
        break;
      }
      print('Break: $i');
    }
  
    // 异常处理
    try {
      var result = 10 ~/ 0;
    } catch (e) {
      print('Caught an exception: $e');
    } finally {
      print('Finally block executed');
    }
  }
  ```





### 类

使用 `class` 关键字定义类，通过构造函数初始化对象，支持继承、接口、混入（Mixin）等特性。

```dart
class Person {
  // 成员变量（属性）
  String name;
  int age;

  // 默认构造函数
  Person(this.name, this.age);

  // 命名构造函数
  Person.anonymous() {
    name = 'Unknown';
    age = 0;
  }

  // 方法
  void sayHello() {
    print('Hello, I am $name, $age years old.');
  }
}

// 使用类
void main() {
  var person1 = Person('Alice', 30);
  var person2 = Person.anonymous();
  person1.sayHello(); // 输出：Hello, I am Alice, 30 years old.
}
```



**构造函数**：

- 支持默认构造函数、工厂构造函数（`factory`）。

```dart
class Point {
  final double x, y;
  Point(double x, double y)  : x = x, y = y {
    print('Point created at ($x, $y)');
  }
}
```

- 命名构造函数（如 `ClassName.named()`）

  - 因为不支持方法（函数）的重载，所以没办法创建相同名称的构造方法。

  ```dart
  class Person {
    String name;
    int age;
  
    Person() {
      name = '';
      age = 0;
    }
  	// 命名构造方法
    Person.withArgments(String name, int age) {
      this.name = name;
      this.age = age;
    }
  
    @override
    String toString() {
      return 'name=$name age=$age';
    }
  }
  
  // 创建对象
  var p1 = new Person();
  print(p1);
  var p2 = new Person.withArgments('qwe', 20);
  print(p2);
  ```

- 初始化列表（`Initializer list`）可在构造函数体执行前初始化成员变量。

  ```dart
  class Point {
    final num x;
    final num y;
    final num distance;
  
    // 错误写法,这里之所以不对是因为 这几个成员变量都是final 类型的，必须在在构造函数执行之前初始化好
    // Point(this.x, this.y) {
    //   distance = sqrt(x * x + y * y);
    // }
  
    // 正确的写法，:后面就是在初始化列表
    Point(this.x, this.y) : distance = sqrt(x * x + y * y);
  }
  ```

  



**访问控制**：

- Dart 没有 `public`/`private` 修饰符，成员默认是公开的。
- 以下划线 `_` 开头的成员为私有（仅在当前文件可见）。

```dart
class Secret {
  String _privateData = 'hidden'; // 私有变量
}
```

**继承**：

- 使用 `extends` 继承父类，`super` 调用父类方法。

```dart
class Student extends Person {
  String school;
  Student(String name, int age, this.school) : super(name, age);
}
```

**接口和混入（Mixin）**：

- 使用 `implements` 实现接口，`with` 混入 Mixin。

```dart
class Developer extends Person with CodeSkills implements Employee {
  // ...
}
```



> 注意点：
>
> - 在方法中使用属性(成员/实例变量)时，`可以不加this`；
> - 在方法中通常使用属性时，会`省略this`，但是有`命名冲突`时，`this不能省略`；
>
> 
>
> 当通过类创建一个对象时，会调用这个类的构造方法。
>
> - 当类中`没有明确指定构造方法`时，将默认拥有一个`无参的构造方法`。
>
> - 当自定义了构造方法时，`默认的构造方法将会失效`，不能使用
>
>   - 可能希望明确的写一个默认的构造方法，但是会和自定义的构造方法冲突；
>   - Dart本身`不支持函数的重载`（名称相同, 参数不同的方式）。
>
>   - 可以实现自己的toString方法
>
>   ```dart
>   class Person {
>     String name;
>     int age;
>   
>     Person(String name, int age) {
>       this.name = name;
>       this.age = age;
>     }
>   
>     @override
>     String toString() {
>       return 'name=$name age=$age';
>     }
>   }
>   ```
>
> - 在实现构造方法时，如果接受的参数就是需要给对应的**`属性`**赋值，为此，Dart提供了一种更加简洁的`语法糖形式`。
>
>   ```dart
>   Person(String name, int age) {
>     this.name = name;
>     this.age = age;
>   }
>   
>   // 等同于
>   Person(this.name, this.age);
>   ```
>
>   



**重定向构造方法**

重定向构造方法指的是一个构造函数将初始化过程重定向到另一个构造函数，通常用于简化代码或在不同的构造方式之间共享逻辑。

重定向构造方法使用冒号（:）和this关键字来指向另一个构造方法。例如，在定义一个类时，可能有多个构造方法处理不同的参数情况，而其中一些构造方法可能只是将参数传递给另一个构造方法，这时候就可以使用重定向。

在一个构造方法中去调用另外一个构造方法, 这个时候可以使用`重定向构造方法`：

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);
  Person.fromName(String name) : this(name, 0);
}
```

在 `Person.fromName(String name)` 这个命名构造函数中，不能在函数体中调用 `this(name, 0)` 。因为在 Dart 中，重定向构造方法是在冒号后面使用 `this` 调用其他构造方法，而不是在函数体中调用。



**常量构造方法**

**常量构造方法（Constant Constructor）** 是一种特殊的构造函数，用于创建**编译时常量对象**。它的核心目的是优化性能，确保在程序运行前（编译时）生成**不可变且唯一**的实例，避免重复创建相同的对象。

要定义一个常量构造方法，需要满足以下条件：

1. **类的所有成员变量必须是 `final` 类型**（不可变）。
2. **构造函数必须用 `const` 关键字声明**。
3. **实例化时必须使用 `const` 关键字**。



**非常量构造方法代码**：

```dart
main(List<String> args) {
  var p1 = Person('asd');
  var p2 = Person('asd');
  print(identical(p1, p2)); // false
}

class Person {
  String name;

  Person(this.name);
}
```

将构造方法前加`const进行修饰`，那么可以保证同一个参数，创建出来的对象是相同的。

```dart
main(List<String> args) {
  var p1 = const Person('asd');
  var p2 = const Person('asd');
  print(identical(p1, p2)); // true
}

class Person {
  final String name;

  const Person(this.name);
}


class Point {
  // 所有字段必须为 final
  final int x;
  final int y;

  // 使用 const 声明常量构造函数
  const Point(this.x, this.y);
}

void main() {
  // 实例化时必须使用 const
  const p1 = Point(1, 2);
  const p2 = Point(1, 2);
  const p3 = Point(2, 3);

  print(p1 == p2); // true（相同参数，指向同一实例）
  print(p1 == p3); // false（参数不同）
}
```



**常量构造方法的作用**

**性能优化**

- 编译时创建对象：常量对象在编译时生成，而非运行时。

- **唯一性保证**：相同参数的 `const` 实例会指向同一个内存地址（类似单例），避免重复分配内存。

  ```dart
  const p1 = Point(1, 2);
  const p2 = Point(1, 2);
  print(identical(p1, p2)); // true（内存地址相同）
  ```

**强制不可变性**

- 类的成员必须为 `final`，确保对象创建后无法被修改，增强代码安全性和可预测性。

 **与普通构造方法的区别**

| **特性**         | **常量构造方法**                          | **普通构造方法**                 |
| :--------------- | :---------------------------------------- | :------------------------------- |
| **构造函数声明** | 必须用 `const` 修饰                       | 无特殊修饰符                     |
| **成员变量**     | 必须全部为 `final`                        | 可以是可变变量                   |
| **实例化方式**   | 必须用 `const` 实例化（否则视为普通对象） | 用 `new` 或省略关键字实例化      |
| **内存分配**     | 编译时生成，相同参数共享内存              | 运行时生成，每次实例化分配新内存 |

```dart
// 普通构造方法
class NormalPoint {
  int x;
  int y;
  NormalPoint(this.x, this.y);
}

void main() {
  var np1 = NormalPoint(1, 2);
  var np2 = NormalPoint(1, 2);
  print(identical(np1, np2)); // false（内存地址不同）
}
```



**使用场景**

**不可变数据模型**

- 例如坐标点、颜色、配置项等无需修改的模型。

  ```dart
  class Color {
    final int r, g, b;
    const Color(this.r, this.g, this.b);
  }
  
  const red = Color(255, 0, 0);
  ```

 **Flutter 中的优化**

- 在 Flutter 中，广泛使用 `const` 构造函数创建小部件（Widget），减少重建开销。

  ```dart
  const Text(
    'Hello',
    style: TextStyle(fontSize: 16),
  )
  ```

------

 注意事项

1. **必须显式使用 `const`**：

   - 即使构造函数是 `const`，实例化时仍需用 `const` 才能生成编译时常量。

     ```dart
     var p = Point(1, 2); // 普通对象（非 const）
     ```

2. **参数必须为编译时常量**：

   - 如果构造函数参数是动态计算的（如函数返回值），不能使用 `const`。

     ```dart
     // 错误示例：参数不是编译时常量
     const p = Point(1 + 2, 3); 
     ```

3. **常量上下文传播**：

   - 在常量上下文中（如集合的 `const` 声明），可以省略内部实例的 `const`。

     ```dart
     const points = [Point(1, 2), Point(3, 4)]; // 合法
     ```

------

总结

- **常量构造方法**用于创建编译时不可变对象，提升性能和内存利用率。



**工厂构造方法**

```dart
main(List<String> args) {
  var p1 = Person('abc');
  var p2 = Person('abc');
  print(identical(p1, p2)); // true
}

class Person {
  String name;

  static final Map<String, Person> _cache = <String, Person>{};

  factory Person(String name) {
    if (_cache.containsKey(name)) {
      return _cache[name];
    } else {
      final p = Person._internal(name);
      _cache[name] = p;
      return p;
    }
  }

  Person._internal(this.name);
}

```







JavaScript 的类（ES6+）与 Dart 在语法和功能上有以下主要区别：

**构造函数**

| 特性             | Dart                                   | JavaScript (ES6+)                              |
| :--------------- | :------------------------------------- | :--------------------------------------------- |
| **构造函数定义** | 使用与类同名的构造函数或命名构造函数。 | 使用 `constructor` 方法。                      |
| **初始化方式**   | 支持初始化列表（`:` 语法）。           | 在 `constructor` 内初始化属性。                |
| **示例**         | `Person(this.name, this.age);`         | `constructor(name, age) { this.name = name; }` |

**访问控制**

| 特性         | Dart                          | JavaScript (ES6+)                      |
| :----------- | :---------------------------- | :------------------------------------- |
| **私有成员** | 成员以下划线 `_` 开头为私有。 | 使用 `#` 前缀定义私有字段（ES2022+）。 |
| **示例**     | `String _secret;`             | `#secret = 'hidden';`                  |

**类型系统**

| 特性         | Dart                         | JavaScript (ES6+)            |
| :----------- | :--------------------------- | :--------------------------- |
| **类型声明** | 强类型，需显式声明成员类型。 | 动态类型，无需声明成员类型。 |
| **类型检查** | 编译时类型检查。             | 运行时类型检查。             |

 **继承与混入**

| 特性              | Dart                         | JavaScript (ES6+)                    |
| :---------------- | :--------------------------- | :----------------------------------- |
| **继承**          | 单继承（`extends`）。        | 单继承（`extends`）。                |
| **混入（Mixin）** | 显式通过 `with` 使用 Mixin。 | 通过组合或原型链模拟（无原生语法）。 |

**Getter/Setter**

| 特性         | Dart                                    | JavaScript (ES6+)                                            |
| :----------- | :-------------------------------------- | :----------------------------------------------------------- |
| **定义方式** | 使用 `get`/`set` 关键字。               | 通过 `get`/`set` 方法或 `Object.defineProperty`。            |
| **示例**     | `dart<br>get fullName => '$name $age';` | `js<br>get fullName() { return `${this.name} ${this.age}`; }` |

**操作符重载**

| 特性         | Dart                      | JavaScript (ES6+) |
| :----------- | :------------------------ | :---------------- |
| **是否支持** | 支持（如 `+`, `==` 等）。 | 不支持。          |

------

**代码示例对比**

Dart 类 vs JavaScript 类

```dart
// Dart
class Animal {
  String name;
  Animal(this.name); // 默认构造函数
  void speak() => print('$name makes a sound');
}

class Dog extends Animal {
  Dog(String name) : super(name);
  @override
  void speak() => print('$name barks!');
}
```



```javascript
// JavaScript (ES6+)
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }
  speak() {
    console.log(`${this.name} barks!`);
  }
}
```

------

**总结**

- **Dart 类**：强类型、支持初始化列表、命名构造函数、显式 Mixin 和接口、操作符重载。
- **JavaScript 类**：动态类型、基于原型链、无操作符重载和 Mixin 原生支持，私有字段需用 `#` 定义。



















## Material 和 Widget 

在 Flutter 中，**Material** 和 **Widget** 是两个核心概念，它们共同构成了 Flutter 应用程序的 UI 框架。

### **Widget**

- **Widget** 是 Flutter 应用程序的基本构建块。在 Flutter 中，**一切都是 Widget**，包括按钮、文本、布局、动画等。

- Widget 可以是可见的（如按钮、文本）或不可见的（如布局、手势检测器）。

- Widget 是轻量级的、不可变的（immutable），它们描述了应用程序 UI 的配置。

  

**Widget 的类型**

- **StatelessWidget**：不可变的 Widget，一旦创建就不能更改（例如文本、图标）。
- **StatefulWidget**：可以动态更新的 Widget，内部通过 `State` 对象管理状态（例如计数器、表单输入）。

**示例代码**

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Flutter Demo')),
        body: Center(child: Text('Hello, Flutter!')),
      ),
    );
  }
}
```

在这个例子中，`MaterialApp`、`Scaffold`、`AppBar`、`Center` 和 `Text` 都是 Widget。

**与前端中的类似概念**

- **类似 HTML 元素**：Widget 类似于前端开发中的 HTML 元素（如 `<div>`、`<p>`、`<button>` 等）。
- **类似 React 组件**：Widget 类似于 React 中的组件（Component），尤其是 React 的函数组件和类组件。
  - `StatelessWidget` 类似于 React 的函数组件（无状态）。
  - `StatefulWidget` 类似于 React 的类组件（有状态）。****





### **Material**

- **Material** 是 Flutter 中实现 **Material Design** 规范的**一套 Widget 和主题**。

- Material Design 是由 Google 推出的一套设计语言，强调简洁、直观和一致的用户体验。

- Flutter 提供了丰富的 Material Widget（如 `AppBar`、`Button`、`Card` 等），帮助开发者快速构建符合 Material Design 的应用程序。

  

**Material 的核心 Widget**

- **MaterialApp**：应用程序的根 Widget，用于配置 Material Design 主题、路由等。
- **Scaffold**：提供应用程序的基本布局结构，包括 `AppBar`、`Drawer`、`BottomNavigationBar` 等。
- **AppBar**：顶部的应用栏。
- **Button**：各种按钮（如 `ElevatedButton`、`TextButton`）。
- **Card**：卡片式布局。

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primarySwatch: Colors.blue), // Material 主题
      home: Scaffold(
        appBar: AppBar(title: Text('Material Demo')),
        body: Center(
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Text('This is a Material Card!'),
            ),
          ),
        ),
      ),
    );
  }
}
```

在这个例子中，`MaterialApp`、`Scaffold`、`AppBar` 和 `Card` 都是 Material Widget。



**与前端中的类似概念**

- **类似 CSS 框架**：Material 类似于前端中的 CSS 框架（如 Bootstrap、Tailwind CSS），提供了一套预定义的样式和组件。
- **类似 Material-UI**：Material 类似于 React 生态系统中的 Material-UI 库，后者也是基于 Material Design 规范实现的。





**Material 和 Widget 的关系**

- **Material 是基于 Widget 实现的**：Material 是 Flutter 提供的一套符合 Material Design 规范的 Widget。
- **Widget 是更基础的概念**：Material Widget 是 Widget 的一种，专门用于实现 Material Design。



**与前端开发的对比总结**

| Flutter 概念        | 前端中的类似概念                      | 说明                                                         |
| :------------------ | :------------------------------------ | :----------------------------------------------------------- |
| **Widget**          | HTML 元素、React 组件                 | Widget 是 Flutter 的基本构建块，类似于 HTML 元素或 React 组件。 |
| **StatelessWidget** | React 函数组件（无状态）              | 不可变的 Widget，类似于 React 的函数组件。                   |
| **StatefulWidget**  | React 类组件（有状态）                | 可动态更新的 Widget，类似于 React 的类组件。                 |
| **Material**        | CSS 框架（如 Bootstrap）、Material-UI | Material 是基于 Widget 实现的一套符合 Material Design 规范的组件库。 |
