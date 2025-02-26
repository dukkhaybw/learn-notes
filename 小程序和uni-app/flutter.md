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







一个Flutter程序





The use of Java options environment variables detected. Such variables override IDE configuration files (*.vmoptions) and may cause performance and stability issues. Please consider deleting these variables: JAVA_TOOL_OPTIONS.







JAVA_HOME

D:\javaJDK8
