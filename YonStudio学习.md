YonStudio 学习

创建项目

方式一：登录用友 web 端，选择移动应用开发，创建新应用

方式二：在 YonStudio 开发工具中创建项目，也是需要登录账号

只要是同一个账号，web 端创建的项目可以在 YonStudio 中导入，在 YonStudio 中创建的项目会自动同步到 web 端。

项目打包前准备

先将项目代码同步到云端，这样在云端打包时才能基于最新的代码进行编译打包。

登录官网的移动开发工作台，选择应用进入应用管理界面，切换到「代码上传」页面，进行代码上传，有以下两种代码上传方式：

1. 通过第三方 Git 仓库上传
2. 将本地文件压缩成 widget.zip 文件进行上传
3. 填写网址，可以将网址打包为移动 APP。

建议项目代码的整体结构都是最外层的文件夹名称需要命名为 widget。

App 预览

在 iOS 设备预览，要先在应用管理的「APP 证书」页面上传编译证书才能编译应用。如果暂时没有苹果证书，可以安装 AppLoader 进行预览。

项目打包

方式一：在 YonStudio 左侧图标栏中，点击云的那个图标，选择移动打包将在 YonStudio 内打开移动打包界面。

方式二：直接在浏览器里面访问移动工作台的「移动打包」界面进行编译。

填写了基本信息后，点击的“开始打包”按钮开始编译，编译完成后扫描二维码即可安装。

App 调试

提供 WiFi 真机同步功能，设备安装 AppLoader 或者自定义 loader 应用后，可以将 YonStudio 中的项目代码通过 WiFi 同步到 loader 中进行预览。

AppLoader：由官方提供，iOS、Android 设备可直接扫码安装，对于没有 iOS 证书的开发者比较方便，里面内置了部分平台常用的移动原生插件，可以将多个项目代码同步到里面查看。

自定义 loader：在 YonStudio 中项目根目录下点击左侧图标栏中的云图标，选择“编译自定义 Loader”进行编译，或者在云端「移动开发工作台」-选择并进入具体应用-「移动插件」-「loader 调试」界面进行编译，iOS 编译之前需上传编译证书，插件按照需要进行添加，**只可同步一个项目到里面查看**。和证书、包名相关的功能只能使用自定义 loader 测试。

WiFi 真机同步

原理：通过在 YonStudio 中建立调试服务器，接收真机设备的连接，进行调试。需要手机上安装官方提供的 AppLoader，或者自己自定义的 loader，重点注意，**如果使用到自己的原生插件，则必须使用自定义的 loader**。在局域网内通过 WiFi 实现应用快速真机同步和实时预览的服务。

WiFi 真机同步支持一对多的同步，即同一个项目可同时同步到多个真机；WiFi 真机的同步策略为“增量”策略，即每次同步仅同步被编辑过的文件，因此同步速度快。

**WiFi 真机实时预览**，提供在真机上**实时加载运行指定页面并预览效果**的功能，支持对包括模块在内的所有端 API 的调试和预览。

使用流程

1. 使用前，要使电脑和手机连接的是同一个 WiFi 或者局域网中
2. 在 YonStudio 点击左侧栏选择「真机同步图标」-「通过 Wi-Fi 连接新的设备」
3. 出现连接二维码、ip 和端口号
4. 编译自定义 loader，扫二维码安装到手机
5. 打开手机上的“友开发”或自定义 loader，进行连接
6. 自定义 loader 安装到手机后，可在手机系统设置-应用管理中给自定义 loader 允许存储权限。打开自定义 loader APP 后，可以看到一个灰色圆球，点击该“球”，将会在屏幕上弹出一个配置调试服务信息的对话框
7. 点击自定义 loader 中下拉框中的扫一扫，扫描 studio 中二维码进行连接。也可以手动输入 IP 地址及端口号
8. 点击对话框中的“连接”按钮，如果配置正确，将显示连接成功，同时“球”变为绿色
9. 连接成功后， 在项目根目上右键，弹出右键菜单后选择 WIFI 同步命令。或者用快捷键的方式对某项目进行 WiFi 真机同步
10. 同步状态将实时显示在真机屏幕上，同步完成后将自动热重启该应用
11. 连接成功后，也可在 YonStudio 项目的任意 html 或 stml 文件上右键，或者快捷键的方式对该文件进行 WiFi 真机实时预览

> 自定义 loader 只支持对该 loader 所在项目进行 WiFi 真机同步或实时预览，“友开发”支持对所连接的 YonStudio 中所有项目进行 WiFi 真机同步或实时预览，但是后者缺少自定义的插件等一些定制化的插件。

API 和移动插件

[API](https://developer.yonyou.com/docs/Client-API/API)对象是开发者必须熟练掌握的一个基础对象，提供了构建应用程序所需要的一些基本的方法，如窗口操作、网络请求等。api 为内置 js 对象，不需要引用即可使用。

移动插件是对 api 功能的一个扩展，平台云市场内提供了各种移动原生插件，如百度地图、极光推送、微信登录等，使用移动原生插件之前需要先在移动开发工作台的移动插件界面进行添加，或者通过 config.xml 中的 feature 字段添加移动原生插件。

如果平台移动原生插件不能满足项目需求，开发者也可以扩展自定义移动原生插件，开发完成后将移动原生插件包上传到“自定义插件”里面，然后添加使用。参考[移动原生插件开发指南-iOS](https://developer.yonyou.com/docs/Mobile-Plugin-Dev/Guide-Dev-NativePlugins-iOS)，[移动原生插件开发指南-AndroidEclipse](https://developer.yonyou.com/docs/Mobile-Plugin-Dev/Guide-Dev-NativePlugins-AndroidEclipse)，[移动原生插件开发指南-AndroidStudio](https://developer.yonyou.com/docs/Mobile-Plugin-Dev/Guide-Dev-NativePlugins-AndroidStudio)。

> 注意：移动原生插件是原生功能的扩展，添加或更新移动原生插件后需要重新编译安装应用才生效。

代码中使用移动原生插件时需先通过 api.require 方法进行引用，如：

```js
var fs = api.require('fs');
fs.exist({ path: 'fs://file.txt' }, function (ret, err) {});
```

config.xml 配置文件

每一个应用的 widget 包必须有一个 config.xml 配置文件，它位于 widget 包的根目录下。该配置文件能配置应用入口页、云端 ID、应用偏好设置、权限配置、移动原生插件等，并且该配置文件也是整个 Widget 的入口。

字段说明：

- autoLaunch：指定应用在启动时向用户展示一个启动界面，并控制该启动界面在适当的时候隐藏。如该字段置为 false，则启动页需要开发者自行调相关接口关闭(api.removeLaunchView)。置为 true，则引擎自动关闭。默认显示 3 秒后关闭，如 3 秒内网页未加载完毕则一直等待，直到网页加载完毕再关闭启动页。

- fullScreen：配置应用是否全屏运行。如果该字段为 true，应用将以全屏的方式启动，并以全屏方式运行。运行过程中可随时通过 YonBuilder 移动开发平台开放的 API（api.setFullScreen）控制退出全屏或重新进入全屏。云编译有效。

- autoUpdate：配置应用是否自动检测更新。如果该字段为 true，应用在启动时将自动与云端握手，并检查本应用是否有更新，是否被强制关闭，是否强制更新等（以上控制可在云端控制台“版本”中设置）。应用运行过程中会根据这些设置进行相关操作，如：自动下载、强制关闭应用等；若配置为 false，则不会弹出任何更新提示。云编译有效。

- debug：配置应用是否处于调试模式。如果该字段为 true，标识应用进入调试模式，应用运行过程中发生的因代码书写失误等原因导致的 Js 报错（引起执行中断）信息，将会以弹窗的方式覆盖在应用最上方，供开发者参考。

- allowKeyboardExtension：置是否允许使用第三方键盘。若不允许，键盘弹出后将不能选择第三方输入法进行输入。只支持 iOS，云编译有效。

- softInputMode：配置键盘弹出后页面的处理方式。云编译有效。

  - resize：弹出键盘时会把页面往上推移，iOS 平台 resize 和 auto 等效;
  - pan：弹出键盘时页面不会被往上推移
  - auto：由系统根据输入框位置决定是否页面往上推移

- font：用于配置字体文件，配置以后在前端页面里面就可以使用该字体。字体文件需放在 widget 目录里面，可以同时配置多种字体。所配置字体在 iOS 全局有效；Android 在 Tablayout 和使用 avm 技术开发的页面中有效。其中，如果要支持 Android 平台，family 字段为必选项，且不支持一个 family 配置多个字体文件。须在 css 代码中使用对应的 FamilyName 对字体进行引用。

  ```xml
  //配置一个值：
  <preference name="font" family="testFont" value="widget/res/xingkai.ttf" />

  //配置多个值，各值之间用竖线 | 隔开：
  <preference name="font" family="testFont" value="widget/res/xingkai.ttf | widget/res/lishu.ttf" />
  ```

  使用：

  ```css
  .font-text {
    font-size: 18px;
    font-family: testFont;
    color: #000;
  }
  ```

- urlScheme：配置应用的 URL Scheme，该 scheme 用于从浏览器或其他应用中启动本应用，并且可以传递参数数据。此字段云编译有效。配置后，外部浏览器页面里面就可以通过 a 标签链接打开应用

  ```html
  <a href="myscheme://?param1=xxx&param2=xxx">测试打开应用</a>
  ```

  ```xml
  <preference name="urlScheme" value="myscheme" />
  ```

  注意：value 的值必须是小写，否则将不起作用。

- querySchemes：iOS9 中对检测应用是否安装的方法做了限制，只允许检测在 Info.plist 中配置过的 LSApplicationQueriesSchemes 字段（即白名单列表）里面的应用。所以若代码里面调用了 api.appInstalled 等方法来检测应用是否安装，那么需要在此字段里面配置被检测应用的 URL Scheme 才能得到期望的结果。

  配置示例：

  ```xml
  //多个值之间用英文逗号隔开
  <preference name="querySchemes" value="weixin,sinaweibo" />
  ```

  以下是常用的一些应用的 URL Scheme：

  ```xml
  <key>LSApplicationQueriesSchemes</key>
   <array>
      <!-- 微信 URL Scheme 白名单-->
      <string>wechat</string>
      <string>weixin</string>

      <!-- 新浪微博 URL Scheme 白名单-->
      <string>sinaweibohd</string>
      <string>sinaweibo</string>
      <string>sinaweibosso</string>
      <string>weibosdk</string>
      <string>weibosdk2.5</string>

      <!-- QQ、Qzone URL Scheme 白名单-->
      <string>mqqapi</string>
      <string>mqq</string>
      <string>mqqOpensdkSSoLogin</string>
      <string>mqqconnect</string>
      <string>mqqopensdkdataline</string>
      <string>mqqopensdkgrouptribeshare</string>
      <string>mqqopensdkfriend</string>
      <string>mqqopensdkapi</string>
      <string>mqqopensdkapiV2</string>
      <string>mqqopensdkapiV3</string>
      <string>mqzoneopensdk</string>
      <string>wtloginmqq</string>
      <string>wtloginmqq2</string>
      <string>mqqwpa</string>
      <string>mqzone</string>
      <string>mqzonev2</string>
      <string>mqzoneshare</string>
      <string>wtloginqzone</string>
      <string>mqzonewx</string>
      <string>mqzoneopensdkapiV2</string>
      <string>mqzoneopensdkapi19</string>
      <string>mqzoneopensdkapi</string>
      <string>mqzoneopensdk</string>

      <!-- 支付宝  URL Scheme 白名单-->
      <string>alipay</string>
      <string>alipayshare</string>
  </array>
  ```

- customRefreshHeader：用于配置在页面里默认使用的自定义下拉刷新原生插件名称，配置后页面里面可以使用指定的下拉刷新原生插件来实现各种各样的下拉刷新效果。使用自定义下拉刷新时，页面里面需调用 api.setCustomRefreshHeaderInfo 方法。

  ```xml
  <preference name="customRefreshHeader" value="UIPullRefresh" />
  ```

- launcher：仅 Android 平台有效。用于配置云编译后的应用在安装到用户手机等设备上后，是否在桌面显示应用图标。如果配置为 false，应用安装完后将不会在用户手机桌面显示图标，用户无法直接使用，需被第三方应用调起才能使用。该功能通常用于某主应用管理多个子应用的场景。

- checkSslTrusted：用于配置是否检查 https 证书是受信任的。如果 https 服务器端证书不是正规机构颁发的，则需要配置 false，否则应用将无法访问数据。

- appCertificateVerify：仅 iOS 平台有效。用于配置是否校验应用证书。若配置为 true，应用被重签名后将无法再使用。

**Feature**

Feature 用于声明本应用使用到的平台扩展原生插件功能、第三方 SDK 等接入规范、运行时组件，并声明该原生插件默认需要传入的参数及值（param），每个 Feature 对应一个或多个参数值。YonBuilder 移动应用通过这些原生插件为用户提供特定的功能。

name：原生插件名称。

forceBind：表示是否强制绑定原生插件，为 true 时在网站上面该原生插件会被自动勾选上且不能去掉，默认值为 true。

platform：配置云编译时使用该原生插件的平台，取值范围 all、ios、android，默认值为 all。例如应用里面有虚拟类商品时，安卓平台可以使用支付宝、微信等第三方支付原生插件，而 iOS 要上架 AppStore 则必须使用苹果内购，并且安装包内也不能包含支付宝、微信支付等资源。此时则可以配置支付宝、微信支付原生插件对应 feature 的 platform 字段值为 android，这样云编译 iOS 包时不会将支付宝、微信支付原生插件编译进去。

配置示例：

```xml
<feature name="moduleName" forceBind="false" platform="all">
    <param name="xxx" value="xxx" />
</feature>
```

- weiXin：配置微信专用的 URL Scheme，使得本应用可以启动微信客户端，并与之交换数据，同时可以从微信客户端返回到本应用

  ```xml
  <feature name="weiXin">
      <param name="urlScheme" value="wx7779c7c063a9d4d9" />
      <param name="apiKey" value="wx7779c7c063a9d4d9" />
      <param name="apiSecret" value="a354f72aa1b4c2b8eaad137ac81434cd" />
  </feature>
  ```

  1. param-urlScheme：声明此字段为 URL Scheme 类型
  2. param-value：对应 urlScheme 类型的值。通过微信开放平台申请。用于从当前应用跳到微信后能够回到当前应用。
  3. param-apiKey：在微信开放平台申请的 apiKey，使用微信的开放接口，必须申请该 key。
  4. param-value：在微信开放平台申请的 apiKey 的值。

**Permission**

Permission 用于声明本应用用到的所有系统权限。YonBuilder 移动开发平台开放的 API 接口以及提供的服务或者功能中，可能需要向操作系统申请某些权限，YonBuilder 移动开发平台将这些权限归类并抽象后提供给开发者，开发者通过简单的字段声明，YonBuilder 移动开发平台云端在编译应用时，将会判别 permission 字段并给应用安装包添加相应的系统权限（即应用安装时，系统向用户展示的权限列表）。

前端开发框架

前端 apiutil.css 和 apiutil.js 框架 ，apiutil.css 处理不同平台浏览器的默认样式，apiutil.js 提供最基础的 JavaScript 方法，所有方法在$api 对象下。

## YonBuilder 移动应用开发平台

开发移动端应用。

### 平台的开发能力

一共有四种开发模式可以选择：

1. Native App
2. MX App
3. App Clip
4. Web App

### AVMJS

AVMJS 是用友平台自研的一个移动端优先的高性能跨端 JavaScript 框架。可以一套代码打包为多端使用，性能体验趋近于原生应用。写法类似于 Vue，分为了 UI 部分，业务逻辑部分和数据模型部分。同时这个框架提供了很多自定义的组件，用于实现移动端的功能。

### stml

stml 文件是一个专用的文件类型，它的结构和 Vue 单文件组件类似，用的是类似 html 的标签来描述一个组件或者页面。

```vue
<template>
  <view class="page"> </view>
</template>
<script>
export default {
  name: 'test',
  apiready() {
    //....
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
.page {
  height: 100%;
}
</style>
```
