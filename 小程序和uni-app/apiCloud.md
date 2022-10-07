# APICloud

- 低代码开发的平台
- 面向前端的App混合开发技术
- 具备管理后台和API开发的[数据云](https://link.juejin.cn/?target=https%3A%2F%2Fwww.apicloud.com%2FdataCloud)（即云函数开发）
- 提供给UE/UI的 [码前](https://link.juejin.cn/?target=https%3A%2F%2Fwww.devbefore.com%2F)，提供需求->原型->UI的一站式快速生成



## 开发环境

- 官方开发的[APICloudStudio3](https://docs.apicloud.com/Download/download)
- android模拟器（可选）
- 注册APICloud账号



## 创建测试应用

### 创建方式

方式一：

1. 在官方的开发者工具中，在登录的情况下，点击**项目**中的**新建项目**

### ![image-20220927132316372](D:\学习笔记\小程序和uni-app\images\image-20220927132316372.png)



![6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880130c6d5d34cd892cd678221a96487~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

创建成功后，开发工具会自动拉取云端的项目代码，如下图：

![9.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1bddfb59ba34ec89adc1a6fd10894c2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



> 因为云端项目数据使用svn方式进行的仓库存储，所以需要本地安装有svn环境，开发工具才能完成代码的拉取。





方式二：

登录APICloud官网，点击创建应用。

![image-20220927132740619](D:\学习笔记\小程序和uni-app\images\image-20220927132740619.png)



![image-20220927132821664](D:\学习笔记\小程序和uni-app\images\image-20220927132821664.png)



### 导入项目

当用户创建一个新的应用时，Studio3开发工具会自动导入项目代码，不需要手动进行代码导入。 

当不是创建应用而是需要导入一个已有的应用项目时，可以按以下内容进行操作执行：

1. 启动APICloud Studio3 开发工具，点击顶部菜单的「项目」-> 「导入项目」

![10.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4bfd382ee934ae8a3ad1d7de716dc05~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

2. 点击导入项目，「本地导入」和「云端检出」,如果用户是第一次导入项目，本地并不存在项目代码，或者想重新生成一个项目代码副本，可以选择云端检出；       如果本地已存在项目，则选择本地导入即可。

![11.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/592f3358c5f747ba8d289e0c5048014c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

- 本地导入：在弹出的对话框中先选中预导入项目所在文件夹，再点击底部的「打开」按钮即可完成项目的本地导入。

- 云端检出：在弹出的项目列表中，选择自己准备导入的项目名称，在弹出页面选择准备存储项目代码的本地文件夹->点击底部的「Select Repository Location」按钮即可完成项目的代码导入。

![image-20220927133718733](D:\学习笔记\小程序和uni-app\images\image-20220927133718733.png)

> 开发者如果本地已存在如`TortoiseSVN`、`Cornerstone`等第三方的SVN工具，开发者也可以通过第三方的Svn工具进行云端代码的导出，然后再通过「本地导入」的方式，将项目代码导入开发工具中。 具体的项目云端svn仓库的存储地址和密码的信息获取如下：
>
> 1. 登录云端官网，进入控制台页面
> 2. 选择对应的项目,并点击进入
> 3. 选择代码页->查看仓库地址及密码
> 4. 打开第三方svn工具，进行svn仓库的信息填写，完成svn项目的检出



### 提交本地代码到云端

1. 完成项目导入后，某些场景可能需要我们更新一下本地代码到云端最新版本。

> 也可以通过其他第三方SVN工具拉取代码的方式，完成代码的云端同步更新

![17.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70bb2e77d4f74bdd882388e6e0c9ccbe~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

2. 当修改完代码以后，我们需要将本地代码同步更新到云端仓库，具体操作如下

![18.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b520dbd6602451486b064809282812d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

填写提交日志信息后提交即可。

> 提交以后，即可在云端-控制台-代码页面看到提交的代码记录信息。



## 代码调试

### 方式一

如果是查看纯粹的静态样式，可以使用浏览器打开对应页面，或者直接在开发工具上鼠标右键点击页面文件，然后选择「实时预览」选项，即可在开发工具中查看。



### 方式二

 真机联调

真机调试主要有2种方式:

- 通过USE数据线使手机和电脑连接进行同步

  
  

- 通过Wifi网络进行真机同步

  WIFI真机联调的操作流程：

  1. 编译测试应用安装包，打开编译自定义Loader页面

     ![24.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a5c9dd50505462aaf7de3a93ad1eaec~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  2. 编译自定义Loader

     ![23.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5a1093bc5214c32a9adc5f810f8b056~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

     

  3. 安装自定义Loader到手机

     ![25.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f33bab195f1432eb47a74ae1a7eeab2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

     > 以上操作也可以自行在浏览器里去操作实现，具体为使用浏览器登录官网，在控制台里选择「模块」- 「自定义Loader」页面进行操作，是同样的效果。

  4. 手机安装好后，打开软件，然后将开发者工具中项目和手机链接，在手机中启动自定义Loader应用，可见到以下页面

     ![27.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3f75fdf756d4e538a330988286d9fc1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  5. 双击灰色操作球，调起连接面板，这里就对应到在开发工具上显示的二维码设备连接界面

  ![31.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b30b3e19754ada984be18d78c8acd3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  6. 链接地址查看

  ![29.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddd606c62d6a45b6ac728e756f7e053a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  

  ![30.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2069a14f3fb4939896c2f56e94cacb9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  

7. 建立连接成功后，在开发工具中鼠标右键点击根目录，然后「选择WIFI同步【全量】」

> 全量和增量的区别，全量是将开发工具内的应用代码全部覆盖到手机的应用上，进行全部替换。而增量是开发工具在同步数据之前会对比开发工具内的代码和应用内的页面代码，会进行页面对比，只替换那些不同的页面。首次同步建议使用全量，后续使用增量即可。

![32.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85ba5debc13c43c089b4418053bd885a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

同步数据完成后，应用会自动重启，显示最新的代码界面,如下图就是成功同步代码后的应用界面。



8. 修改数据,需要手动同步效果

![34.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2ca5e459ac246bd94ace005d37179ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



## 编译打包

编译的过程是在服务器端在线完成的，所以需要保证服务端仓库的代码是最新版，务必保证将本地的代码同步提交的云端服务器。

本地提交到云端：

![38.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9d8242ff08b44758f6210be15f9326b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



可以登录[官网-控制台](https://link.juejin.cn/?target=)查看代码更新记录，用于判断提交是否成功及查看当前应用最新版本的代码情况

![39.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d26406eaf464c35b7834a9815d22ad6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)



### 版本编译

1. 创建证书
   - 登录[APICloud官网控制台](https://link.juejin.cn/?target=https%3A%2F%2Fwww.apicloud.com%2Fconsole) ->选择对应的应用，进入应用详情页，对于`android`系统有2种方式生成证书，一种是通过上传方式将已经存在的证书上传，如果没有证书，则可以使用另一种方式，即利用官方提供的「一键创建证书|」功能直接快速创建生成证书。

![41.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/575e05c08899480bb9decf90e7904087~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

- 如果已有证书，则可以点击更新 ->点击 Android证书下的「选择证书」在弹出框选择对应的本地证书即可。



### 云编译

证书生成成功后进行版本编译。

![43.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69f5ed23197c4adcb521d2aa93246425~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

编译完成后，可以选择下载安装包文件，或者直接用手机内置的浏览器扫描图中的二维码进行安装。



## `APICloud`原生模块

APICloud原生模块是指使用原生语言（android，Object-C）封装好的具备特定功能的SDK程序, 让开发者可以在JavaScript的编程环境内直接调用使用。开发者无需关心模块的内部实现，只需简单的函数调用，即可完成各种复杂原生功能的开发。

官网主页 -> 云市场 -> 模块store查看官网已上线600+的各种功能的APICloud模块。

![47.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e315f45517ac42ab8dd52436b1e65318~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



点击模块store页面内列表中的任一一个模块图标，即可进入模块详情介绍页，如下图：



![50.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9b7084b2ecd456da549b49be66faec0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



### 使用

1. 登录官网控制台 -> 选择应用，进入应用详情页 -> 选择「模块」 -> 选择 「模块库」

![48.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57ab959675454a21b972d4dd40d40383~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

2. 搜索查找需要的功能模块
   ![56.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57ab3e8181e84b5381e6ec5cccddb6b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



3. 在模块详情也 点击「立即使用」按钮 -> 弹出界面选择对应的应用 -> 点击「确认添加」按钮，完成应用的添加（也可以点击上图的右上角+号图标直接添加）

![51.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe90ea333d8b48e7af2507fab584f024~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

返回应用详情，然后在模块->已添加模块页，可查看当前应用已添加的所有模块。

![53.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/499f87503c324052af70f56974184ef9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



> 每当有新的模块添加到应用中时，为了使模块在代码中生效，我们需要重新进行一次编译。其内在原理时 所有的原生模块代码都存储在官网服务器上，当某个应用需要使用某个模块时，服务器需要通过编译功能动态的将模块对应的代码注入到具体的应用中，这样模块才可以在这个应用中生效。

![54.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f879c6f0757420e9e7c3257496db113~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



编译成功后，重新下载自定义loader，并安装到手机端。

使用案例：

```js
apiready = function () {
    var moviePlayer = api.require('moviePlayer');
    moviePlayer.open({
        rect: { 
            x: 0,
            y: 150,
            w: api.frameWidth,
            h: 300
        },
        styles: {
            foot: {
                bg: 'rgba(0,0,0,0.5)',
                height: 44,
                currentTimeLabel: {
                    textSize: 14,
                    textColor: "#FFF",
                    textWidth: 43,
                    marginLeft: 5
                },
                totalTimeLabel: {
                    textSize: 14,
                    textColor: "#FFF",
                    textWidth: 43,
                    marginRight: 5
                }
            }
        },
        path: 'http://7o50kb.com2.z0.glb.qiniucdn.com/c1.1.mp4',
        autoPlay: true
    }, function (ret, err) {});

};
```

效果：

![58.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdbe50c5189c4072b0330cd092b02849~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)



模块的具体使用可以在官网中具体查看。





























