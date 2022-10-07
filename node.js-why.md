# Node.js

Node.js是JavaScript代码运行的环境，它底层基于V8引擎。



## 前言

​	之前的js代码是写在html文档的script标签中，由浏览器打开后，解析并执行的。这时浏览器就是js代码的执行环境；要想单独写一个以js为文件并在操作系统下运行，则需要安装Node.js，由Node.js去解析执行js代码。

​	浏览器和node是js的两个不同的运行环境，所以两个运行环境中提供的各种接口对象不同（组成不同）：

- 浏览器环境
  - ECMAScript
  - BOM
  - DOM
  
  
  
- node环境
  - ECMAScript
  - 核心模块
  - 第三方模块
  - 自定义模块

### windows下的常用命令行指令

- dir：查看当前目录下的所有文件及文件夹
- md 文件夹名：在当前目录下创建文件夹
- rd 文件夹名：在当前目录下删除文件夹
- rm -rf  文件夹名：强制删除非空文件夹
- 文件名.后缀：打开对用文件
- 盘符名： ：直接跳转到对应盘符
- cls：清屏





浏览器内核是由两部分组成：

- 渲染引擎，负责解析html，布局和渲染等

- JavaScript引擎，解析执行JavaScript代码

![image-20211005133347734](.\typora-user-images\image-20211005133347734.png)



JavaScript引擎：

SpiderMonkey：FireFox，Chakra：IE，JavaScriptCore：Safari，V8：Chorme





![image-20211005133818414](.\typora-user-images\image-20211005133818414.png)

注意点：

- 函数如果没有被调用，那么在解析姐u但并不会生成抽象语法树
- 如果函数只调用一次，解释器会执行解析执行字节码（Ignition）
- 如果一个函数被多次调用，那么就会被标记为热点函数，再经过编译器转为优化的机器码，提高代码的执行性能
- 机器码实际上也会被还原为字节码，如热点函数多次调用，参数多次都是一个类型的实参，但后面某次传参不同后就需要对之前优化的机器码逆向转为字节码





node.js架构图

![image-20210717160612337](.\typora-user-images\image-20210717160612337.png)



 

 

在某个目录下运行 http-server（先安装好），可以将该目录启动服务器进行托管。

- node端无跨域安全限制:（浏览器端有跨域安全限制）

```js
const http = require('http')
http.get('url',(res)=>{  //res为响应对象
    let str = ''
    res.on('data',chunk=>{  //res绑定data事件，收集数据流
        str+= chunk
    })
    res.on('end',()=>{   //res绑定end事件
        console.log(str)
    })
})

//变相实现浏览器端的跨域问题。先基于node.js中的http模块加载跨域资源，在取得数据后，自己封装接口返回给前端实现跨域。
```



- 进程管理:

```js
// process.js文件：process已经编译到node中，不需要引入，直接使用。
function main(argv) {
  console.log(argv)
}
const arr = process.argv.slice(2)
main(arr)

console.log(arr[0])
console.log(arr[1])

运行：
node process.js value1 value2
输出为： ['value1'   'value2']    value1   value2

这是在通过命令行执行某个js脚本时，向脚本内部传入参数
在webpack中有可以设置环境变量，如：process.env.NODE_ENV = 'production'
```

- 读写文件

- 网络通信

- 数据加密







**node中的环境变量（process）：**

`process` (进程)**对象**是一个全局变量，提供了有关当前 Node.js 进程的信息并对其进行控制。 作为全局变量，它始终可供 Node.js 应用程序使用，无需使用 `require()`。 它也可以使用 `require()` 显式地访问：

```
const process = require('process');
```

process（进程）就是存在于nodejs执行环境中的一个全局变量对象（类似于浏览器的window对象）,该对象表示Node所处的当前进程，允许开发者与该进程互动。在项目中的任何一个js文件中，都能访问到这个对象及其上面的数据或者方法。

在框架中经常有类似代码段：

````javascript
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod.js')
} else {
    module.exports = require('./dev.js')
}
````



process.env表示process对象下的env对象。process.env包含着关于**系统环境的信息**,但是process.env中并不存在NODE_ENV, NODE_ENV是开发者一个自定义的变量，在webpack中它的用途是判断生产环境或开发环境的依据的。

查看process中的基本配置信息，创建一个js文件，在文件内部写入console.log(process)，然后通过node执行该文件，则会在控制台输出基本配置信息，也可以将配置信息输出到一个文件中，用node xxx.js >process.txt 则会将配置信息输出到对应的文件中。如下：

```
process {
  version: 'v14.16.1',
  versions: {
    node: '14.16.1',
    v8: '8.4.371.19-node.18',
    uv: '1.40.0',
    zlib: '1.2.11',
    brotli: '1.0.9',
    ares: '1.16.1',
    modules: '83',
    nghttp2: '1.41.0',
    napi: '7',
    llhttp: '2.1.3',
    openssl: '1.1.1k',
    cldr: '37.0',
    icu: '67.1',
    tz: '2020a',
    unicode: '13.0'
  },
  arch: 'x64',
  platform: 'win32',
  release: {
    name: 'node',
    lts: 'Fermium',
    sourceUrl: 'https://nodejs.org/download/release/v14.16.1/node-v14.16.1.tar.gz',
    headersUrl: 'https://nodejs.org/download/release/v14.16.1/node-v14.16.1-headers.tar.gz',
    libUrl: 'https://nodejs.org/download/release/v14.16.1/win-x64/node.lib'
  },
  _rawDebug: [Function: _rawDebug],
  binding: [Function: binding],
  _linkedBinding: [Function: _linkedBinding],
  _events: [Object: null prototype] {
    newListener: [Function: startListeningIfSignal],
    removeListener: [Function: stopListeningIfSignal],
    warning: [Function: onWarning]
  },
  _eventsCount: 3,
  _maxListeners: undefined,
  domain: null,
  _exiting: false,
  config: {
    target_defaults: {
      cflags: [],
      default_configuration: 'Release',
      defines: [],
      include_dirs: [],
      libraries: []
    }
  dlopen: [Function: dlopen],
  uptime: [Function: uptime],
  _getActiveRequests: [Function: _getActiveRequests],
  _getActiveHandles: [Function: _getActiveHandles],
  reallyExit: [Function: reallyExit],
  _kill: [Function: _kill],
  hrtime: [Function: hrtime] { bigint: [Function: hrtimeBigInt] },
  cpuUsage: [Function: cpuUsage],
  resourceUsage: [Function: resourceUsage],
  memoryUsage: [Function: memoryUsage],
  kill: [Function: kill],
  exit: [Function: exit],
  openStdin: [Function (anonymous)],
  allowedNodeEnvironmentFlags: [Getter/Setter],
  assert: [Function: deprecated],
  features: {
    inspector: true,
    debug: false,
    uv: true,
    ipv6: true,
    tls_alpn: true,
    tls_sni: true,
    tls_ocsp: true,
    tls: true,
    cached_builtins: true
  },
  _fatalException: [Function (anonymous)],
  setUncaughtExceptionCaptureCallback: [Function: setUncaughtExceptionCaptureCallback],
  hasUncaughtExceptionCaptureCallback: [Function: hasUncaughtExceptionCaptureCallback],
  emitWarning: [Function: emitWarning],
  nextTick: [Function: nextTick],
  _tickCallback: [Function: runNextTicks],
  _debugProcess: [Function: _debugProcess],
  _debugEnd: [Function: _debugEnd],
  _startProfilerIdleNotifier: [Function (anonymous)],
  _stopProfilerIdleNotifier: [Function (anonymous)],
  stdout: [Getter],
  stdin: [Getter],
  stderr: [Getter],
  abort: [Function: abort],
  umask: [Function: wrappedUmask],
  chdir: [Function: wrappedChdir],
  cwd: [Function: wrappedCwd],
  env: {  -------------------------------------------------------------------------------
    ALLUSERSPROFILE: 'C:\\ProgramData',
    APPDATA: 'C:\\Users\\dukkha\\AppData\\Roaming',
    CHROME_CRASHPAD_PIPE_NAME: '\\\\.\\pipe\\crashpad_13260_MTNKTFTLSEVGYFFF',
    CommonProgramFiles: 'C:\\Program Files\\Common Files',
    'CommonProgramFiles(x86)': 'C:\\Program Files (x86)\\Common Files',
    CommonProgramW6432: 'C:\\Program Files\\Common Files',
    COMPUTERNAME: 'DESKTOP-31V9NEV',
    ComSpec: 'C:\\Windows\\system32\\cmd.exe',
    DriverData: 'C:\\Windows\\System32\\Drivers\\DriverData',
    FPS_BROWSER_APP_PROFILE_STRING: 'Internet Explorer',
    FPS_BROWSER_USER_PROFILE_STRING: 'Default',
    HOMEDRIVE: 'C:',
    HOMEPATH: '\\Users\\dukkha',
    LOCALAPPDATA: 'C:\\Users\\dukkha\\AppData\\Local',
    LOGONSERVER: '\\\\DESKTOP-31V9NEV',
    NUMBER_OF_PROCESSORS: '16',
    NVM_HOME: 'D:\\Programspace\\nvm',
    NVM_SYMLINK: 'D:\\Programspace\\node',
    OneDrive: 'C:\\Users\\dukkha\\OneDrive',
    ORIGINAL_XDG_CURRENT_DESKTOP: 'undefined',
    OS: 'Windows_NT',
    Path: 'C:\\Program Files (x86)\\Common Files\\Oracle\\Java\\javapath;C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;C:\\Windows\\System32\\OpenSSH\\;D:\\Programspace\\svn\\bin;D:\\Programspace\\node.js;D:\\Programspace\\nvm;D:\\Programspace\\node;D:\\Programspace\\Git\\cmd;C:\\Users\\dukkha\\AppData\\Local\\Microsoft\\WindowsApps;D:\\Programspace\\Microsoft VS Code\\bin;D:\\Programspace\\nvm;D:\\Programspace\\node',
    PATHEXT: '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.CPL',
    PROCESSOR_ARCHITECTURE: 'AMD64',
    PROCESSOR_IDENTIFIER: 'AMD64 Family 23 Model 96 Stepping 1, AuthenticAMD',
    PROCESSOR_LEVEL: '23',
    PROCESSOR_REVISION: '6001',
    ProgramData: 'C:\\ProgramData',
    ProgramFiles: 'C:\\Program Files',
    'ProgramFiles(x86)': 'C:\\Program Files (x86)',
    ProgramW6432: 'C:\\Program Files',
    PSModulePath: 'C:\\Users\\dukkha\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules',
    PUBLIC: 'C:\\Users\\Public',
    SESSIONNAME: 'Console',
    SystemDrive: 'C:',
    SystemRoot: 'C:\\Windows',
    TEMP: 'C:\\Users\\dukkha\\AppData\\Local\\Temp',
    TMP: 'C:\\Users\\dukkha\\AppData\\Local\\Temp',
    USERDOMAIN: 'DESKTOP-31V9NEV',
    USERDOMAIN_ROAMINGPROFILE: 'DESKTOP-31V9NEV',
    USERNAME: 'dukkha',
    USERPROFILE: 'C:\\Users\\dukkha',
    windir: 'C:\\Windows',
    TERM_PROGRAM: 'vscode',
    TERM_PROGRAM_VERSION: '1.55.2',
    LANG: 'zh_CN.UTF-8',
    COLORTERM: 'truecolor',
    VSCODE_GIT_IPC_HANDLE: '\\\\.\\pipe\\vscode-git-055479e038-sock',
    GIT_ASKPASS: 'd:\\Programspace\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass.sh',
    VSCODE_GIT_ASKPASS_NODE: 'D:\\Programspace\\Microsoft VS Code\\Code.exe',
    VSCODE_GIT_ASKPASS_MAIN: 'd:\\Programspace\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass-main.js'
  },
  title: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
  argv: [
    'D:\\Programspace\\node\\node.exe',
    'C:\\Users\\dukkha\\Desktop\\node-process\\process.js'
  ],
  execArgv: [],
  pid: 12452,
  ppid: 11908,
  execPath: 'D:\\Programspace\\node\\node.exe',
  debugPort: 9229,
  argv0: 'D:\\Programspace\\node\\node.exe',
  _preload_modules: [],
  mainModule: Module {
    id: '.',
    path: 'C:\\Users\\dukkha\\Desktop\\node-process',
    exports: {},
    parent: null,
    filename: 'C:\\Users\\dukkha\\Desktop\\node-process\\process.js',
    loaded: false,
    children: [],
    paths: [
      'C:\\Users\\dukkha\\Desktop\\node-process\\node_modules',
      'C:\\Users\\dukkha\\Desktop\\node_modules',
      'C:\\Users\\dukkha\\node_modules',
      'C:\\Users\\node_modules',
      'C:\\node_modules'
    ]
  },
  [Symbol(kCapture)]: false
}

```

**process.env**属性：process.env 属性返回的是一个包含用户环境信息的对象。

**在windows环境**下配置process.env 属性的值：

```
//临时配置,直接在cmd环境配置即可，查看环境变量，添加环境变量，删除环境变量。
#node中常用的到的环境变量是NODE_ENV，首先查看是否存在 
set NODE_ENV 
#如果不存在则添加环境变量 
set NODE_ENV=production 
#环境变量追加值 set 变量名=%变量名%;变量内容 
set path=%path%;C:\web;C:\Tools 
#某些时候需要删除环境变量 
set NODE_ENV=
```

![image-20210421104110090](.\typora-user-images\image-20210421104110090.png)

实际开发应用：

1. 解决环境导致后端接口变换问题，NODE_ENV 这个字段也可以自己定义为其它的名字。修改代码里的后端地址配置

   ![image-20210421104348310](.\typora-user-images\image-20210421104348310.png)

   





#### 在node中使用环境变量

方式一：通过命令行传递

```
set PORT=65534 node bin/www

set PORT=65534 && set DB_CONN="mongodb://react-cosmos-db:swQOhAsVjfHx3Q9VXh29T9U8xQNVGQ78lEQaL6yMNq3rOSA1WhUXHTOcmDf38Q8rg14NHtQLcUuMA==@react-cosmos-db.documents.azure.com:19373/?ssl=true&replicaSet=globaldb" && set SECRET_KEY=b6264fca-8adf-457f-a94f-5a4b0d1ca2b9 && node bin/www

不方便的地在于，当变量数量过多时很不方便
```

方式二：使用 .env 文件

通过 `dotenv` 这个 npm 包可以读取 .env 文件的配置到 Nodejs 程序中。

env文件中：

```
PORT=65534
DB_CONN="mongodb://react-cosmos-db:swQOhAsVjfHx3Q9VXh29T9U8xQNVGQ78lEQaL6yMNq3rOSA1WhUXHTOcmDf38Q8rg14NHtQLcUuMA==@react-cosmos-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
SECRET_KEY="b6264fca-8adf-457f-a94f-5a4b0d1ca2b9"
```

```
npm install dotenv --save
```

```js
require("dotenv").config();
var MongoClient = require("mongodb").MongoClient;

// Reference .env vars off of the process.env object
MongoClient.connect(
  process.env.DB_CONN,
  function(err, db) {
    if (!err) {
      console.log("We are connected");
    }
  }
);
```



## node程序传递参数

```shell
node index.js coderwhy env=dev

node index.js coderwhy age=18
```

 

![image-20210717172400635](.\typora-user-images\image-20210717172400635.png)

通过node去执行某个js脚本文件时，想在命令行中增加额外的信息，然后在js脚本内部获取到后进行判断使用。

argv[2]:  coderwhy

argv[3]:  age=18





## node中常见的全局对象

- exports
- module
- require( )
- URL
- ...

**特殊的全局对象：**

这些全局对象实际上是模块中的变量，只是每个模块都有，看起来像全局变量。与此同时，这些变量因为不同模块文件而内部存放的值不同。在命令行（cmd中）交互中是无法使用的。

- __dirname：执行的文件所在的目录
- __filename：执行的文件所在目录加上文件名
- exports：
- module
- require



**常见全局对象：**

- process对象：内部存放node进程中的相关信息。

- console对象：控制控制台输出的对象，console.log,console.clear,console.trace(打印函数的第调用栈)

- 定时器对象
  - setTimeout(callback,time)
  
  - clearTimeout(timerid)
  
  - setInterval(callback,time)
  
  - clearInterval(timerid)
  
  - setImmediate(callback)
  
  - clearImmediate(timerid)
  
  - process.nextTick(callback)
  
    
  
  setTimeout(callback,0)和setImmediate(callback)和process.nextTick(callback)三个函数的区别。具体涉及事件循环执行流程
  
- global对象

  ```js
  var abc = 'abc'
  console.log(abc) // abc
  console.log(global.name)  //undefined    abc并不会挂载到global对象上，因为正node环境下每个文件都是一个模块
  
  
  // process全局对象也是global顶级对象的一个属性。在源码的内部先在一个文件模块中定义process对象后，再通过Object.DefineProperty挂载到global对象上的。
  ```

  ![image-20220217093624567](.\typora-user-images\image-20220217093624567.png)



### windows操作系统的环境变量

​	在系统的任何地方通过cmd窗口以输入指令的方式去运行一个文件或者一个程序，系统会首先在命令的当前文件目录下寻找该文件程序，如果找到直接打开或运行，如果没有，则会依次到系统的环境变量path中寻找，找到就执行，找不到就报错。所以对于要经常使用的一些软件或命令，可以配置环境变量，方便使用。（就是配置程序的可执行文件的路径）



### 进程与线程

进程：操作系统为程序的运行提供的必备的环境（车间）

线程：计算机中最小的计算单位，负责执行进程中的各种任务（车间工人），单线程或多线程



​	node是一个js代码的运行环境，同时这个环境内部还封装了一系列配套的模块，以实现通过js代码调用这些和其他类别的模块来操作系统中的文件或者数据库。（运行环境加上工具包）

​	系统的多线程运行的模式：多线程并不是说在同一个时间点同时做多件事，而是通过非常快的切换时间片来每个线程执行一点每个线程执行一点，让人感觉是在同时处理多件任务。

​	传统的java或者php服务器中，客户端发起每一个请求，服务器进程中就会开辟一个新线程，专门用来处理该请求，如线程向数据库发请求，而该线程则处于空置状态，当数据库处理完请求返回数据给线程后，线程再返回给客户端，然后线程才销毁。（该过程采用了线程池进行一定的优化） 多线程模式

​	Node服务器中，客户端发起每一个请求，服务器进程中就只会有一个主线程，专门用来处理不同的多个请求，如主线程向数据库发起一个异步的请求，而该线程则去处理其他的客户端请求了，当数据库处理完第一个请求返回数据给线程后，该主线程再去接收并返回给客户端。 单线程非阻塞IO模式



node.js服务器的有点：

- 节约内存

- 节约上下文切换的时间，传统多线程是通过不停切换操作系统时间片来运行程序的

- 锁的问题，并发资源的处理，即多个请求都需要访问一个资源的情况





## node工具

还有一个版本管理工具：n

### nvm

node.js的版本非常多，同时不同项目可能用到的node的版本不同，所以一台电脑上可能需要安装多个node的版本，以实现不同项目用不同版本的node去解析执行。而nvm就是用来管理同一台电脑上不同node版本的软件。

#### nvm常用命令：

- nvm --help :查看所有nvm命令与解释
- nvm list : 查看本机上node的所有已安装版本
- nvm install node版本号（只写数字也行）
- nvm version ：显示当前正在使用的node版本号
- nvm use 版本号：切换到对应的node版本号并使用，在命令行窗口关闭后就切回默认版本
- nvm uninstall 版本号：卸载对应的node版本号
- nvm install latest | lts ：安装最新版的node版本号
- nvm alias default  版本号 ：修改默认使用的node版本号
- nvm list available
- `nvm node_mirror https://npm.taobao.org/mirrors/node/`
- `nvm npm_mirror https://npm.taobao.org/mirrors/npm/`



Node.js中的REPL

REPL（Read-Eval-Print Loop）：简单的编程式交互环境。说白了就是小黑窗。

在node环境下，没有window和document全局对象，但是又process全局对象。





### npm

​	用于帮助Node完成第三方模块的安装，发布和依赖。通过npm下载的第三方模块（包）都放在项目的node_modules目录下，在该项目目录下的其他自定义模块要使用这些已经下载的第三方模块，直接在自定义模块中用require(“包名”)引入即可使用。

​	require("包名")搜索第三方模块的流程：在自定义模块中用reqiure（“包名”），引入第三方模块，node的找包流程是现在当前自定义文件所在目录下的node_modules中寻找是否含有该包名模块，有则直接用，没有则去上层目录的node_modules中寻找找到就用，找不到则继续往上查找，直到对应磁盘根目录，还没找到就报错。

npm全局安装的包，如果该包有cmd文件的话，那么可以直接通过在任何位置的命令行执行有关该包的命令。如果该包没有提供cmd文件，那么是无法执行任何以该包为基础的命令的。如果要在自己的项目中引入该包的话，如果该包没有实现模块化规范，那么也是无法正常引入使用的。

如果安装的包是安装在项目本地的话，同时该包又提供cmd文件的话，如果直接：包名  指令，那么默认也是寻找全局安装的该包的，但是全局并没有安装，所以也会报错。不过，可以在项目的命令行窗口中通过  node_modules/.bin/包名 指令 锁定cmd文件位置并执行它。另外可以通过配置package.json中的script脚本字段 配置 ：包名 指令 来实现包的执行，因为通过npm脚本执行命令，默认会先在全局中找包的cmd文件，没有的话，就依次从项目所在目录的最外层的 node_modules/.bin开始查找执行，没有的话就一直查找到该项目根目录文件夹下的node_modules/.bin中去寻找执行。

#### npm命令：

- npm -v  ：查看npm的版本

- npm version ：查看npm及周边软件版本

- npm  ：查看帮助说明

- npm init [ -y ] ：初始化包

- npm install  包名 | npm i  包名  ：安装包并添加到package.json中的项目依赖中 ，安装包前需要保证项目中有package.json文件

  等价于低版本npm中的npm install  包名 - -save  | npm install  包名   -S

  - npm i 包名@版本号 ：安装包的指定版本
  - npm i 包名@主版本号：安装包的主版本号中最新的那一版
  - npm i 包名@主版本号.次版本号：安装对应主版本号和次版本号中的最新版
  - npm i 包名：安装包的所有版本中的最新版

- npm install  包名 | npm i  包名 --save--dev  ：下载包并写入开发依赖项中

- npm install    包名  -g：全局安装包

- npm uninstall 包名 | npm uninstall  包名 --save--dev：删除包 

- npm remove 包名  | npm r  包名   ：删除包

- npm remove   包名  --save：删除包并从package.json中的项目依赖中去除

- npm install ：安装项目依赖的所有包

- npm install --production ：只安装项目依赖而不安装开发依赖包 

- npm view 包名 versions：查看包的所有版本列表

  ![image-20210507174629562](.\typora-user-images\image-20210507174629562.png)

- npm search 包名 ：搜索包

- npm install 包名 -registry=地址  ：从镜像源安装包

- npm config get regis

- npm config set registry  地址：设置镜像源地址

- npm config get registry ：查看镜像源地址

- npm cache clean --force：清除缓存 将本机的缓存目录中缓存下来的压缩包删除。

- npm info 包名：查看包版本号

- npm list | grep 包名：单独查看第三方包依赖的其他第三方包

  ![image-20210507195054708](.\typora-user-images\image-20210507195054708.png)

- npm list：查看当前项目引用了哪些包 

- npm outdated

- npm updated

- npm rebuild

  

#### 上传自己的包

1. 生成package.json文件并确定包的描述信息

2. 写自己的包，并命名包入口文件名为package.json中main字段对应的文件名

3. 注册自己的npm官网账号

4.  npm adduser

5. npm publish

6. 输入自己的npm账号与密码，完成上传

   上传时，npm源的地址必须是：`http://registry.npmjs.org` 

    ` npm config set registry http://registry.npmjs.org ` 

   `nrm use npm`

7. npm unpublish --force 包名：卸载线上包



#### 包描述文件---package.json

包描述文件中是对该包的说明

##### scripts字段

作用：用于指定npm的脚本命令，通过npm命令行直接调用，能**避免执行命令时输入过长的命令**，也可以**用于运行项目下的命令行工具**。

使用方式：npm run scripts字段中的key ；等价于 npm run-script  scripts字段中的key

npm run：列出该项目中package.json中已经设置好的可执行的脚本命令。

- "start"："npm run script1 & npm run script2"  ：并行执行
- "dev" : "npm run script1 && npm run script2"：继发执行

##### *dependencies*与*devDependencies*中包版本的说明

如：*"axios"*: "^0.19.2"， *@vue/cli-plugin-router"*: "~4.3.0"

0 ：主版本号（major），有重大更新

19：次版本号（minor），新增了功能

2：补丁号（patch），修复bug，偶数为稳定版，基数为较不稳定版

^：只锁定主版本号，其他号默认采用最新的

~：锁定主版本号和次版本号，补丁号用最新的

不带符号只带版本号：锁定指定版本号

只写一个 * 号：用最新版的包





package.json中的配置项目：

private:true   // 该字段为true时，标识该项目是私有的，当不小心执行npm publish命令是会让该命令无效。

"main":"index.js"    //  当该项目作为开发项目被其他开发者使用时，main字段指定的就是该项目的入口文件。

"engines":该属性用于指定Node和npm的版本号码，在安装过程中，会先检查对应的引擎版本，不对就报错。

"os"：该属性用于指定包运行在什么操作系统。

"browserslist": 该属性可以单独放在一个文件中也可以写在package.json文件中，用于确定配置打包后的JavaScript，css等的浏览器的兼容情况

 

全局安装和局部安装

全局安装都是安装配有cmd文件的工具包，而局部安装既可以安装工具包也可以安装开发使用的包；如果将开发中使用的包进行全局安装的后，尝试在项目的引入该包，是无法引入的。因为node关于第三方包的查找规则不会找到全局安装包的目录下的。





#### 在自己的项目js脚本文件中访问package.json文件中的某字段内容

最典型的就是webpack.config.js文件常常需要访问package.json中的某些字段内容。

在用npm 脚本（package.json文件中的scripts字段命令）中运行开发者编写的脚本文件（如：npm run view）才可以，直接在命令行中运行JS（如：node 脚本文件名）是拿不到值的。在开发者编写的脚本文件中，通过 `npm_package_` 前缀，npm 脚本可以拿到 package.json 里面的字段。

```
{
  "name": "foo", 
  "version": "1.2.5",
  "scripts": {
    "view": "node view.js"
  }
}
```



```
// view.js
console.log(process.env.npm_package_name); // foo
console.log(process.env.npm_package_version); // 1.2.5
变量 npm_package_name 返回 foo，变量 npm_package_version 返回 1.2.5
```



npm_package_前缀也支持嵌套的package.json字段。也就是在package.json文件的script部分中，访问该package.json文件自身的其他字段的内容。

```
"repository": {
  "type": "git",
  "url": "xxx"
},
scripts: {
  "view": "echo $npm_package_repository_type"
}
上面代码中，repository 字段的 type 属性，可以通过 npm_package_repository_type 取到。
```

#### 在package.json文件的scripts字段的脚本中访问该package.json文件中其他字段内容

$npm_config_字段名





### 通过npm安装git上的包

```
# 这样适合安装公司内部的git服务器上的项目
npm install git+https://git@github.com:lurongtao/gp-project.git(git仓库地址)

# 或者以ssh的方式
npm install git+ssh://git@github.com:lurongtao/gp-project.git（git仓库地址）
```

通过npm安装git上的包的话，在package.json中的项目或者开发依赖字段中，包名对应的版本号是git仓库的地址。

![image-20210507222845021](.\typora-user-images\image-20210507222845021.png)



**npm安装包的流程：**

执行 npm install ,没有lock文件，更具package.json中的所有依赖构建依赖关系（以扁平化的方式进行构建，以前是树结构且在以前多个包有重复依赖时，会多次下载同一个包，浪费内存和性能；采用扁平化后让所有依赖都是平级的，只有在特殊的情况下某个包依赖的是一个包的另一个不同的版本时，才会再安装一个不同版本的包），在存放这些包的远端仓库下载包对应的压缩包，下载压缩包到本地同时在本机上缓存一些压缩包（另一个项目也依赖了同样的包时，就不用再去远端下载，直接取缓存中的包），解压压缩包到项目目录下的node_modules目录中，然后生成lock文件。



之后再安装项目依赖时，就走有lock文件的情况了。

检查依赖的一致性：在package.json中的包的版本一般默认锁定了主版本号，但是在lock文件中包的版本是之前生成lock文件时包对应的明确的版本号的。   在安装时，会查看lock中包的版本符不符合package.json中包的版本规则，不符合就重新构建依赖关系。一致就检查缓存。

存对应本机上的一个目录。npm config get cache:获取缓存路径



![image-20210718140842660](.\typora-user-images\image-20210718140842660.png)

![image-20210718141319999](.\typora-user-images\image-20210718141319999.png)





#### package-lock.json



![image-20210718151422785](.\typora-user-images\image-20210718151422785.png)











### cross-env使用

运行跨平台设置和使用环境变量的脚本。

在写npm脚本时，在不同平台有兼容问题，window下和mac或者linux下写的脚本方式存在差异。 

问题：使用 NODE_ENV=production, 来设置环境变量时，大多数 Windows 命令提示将会阻塞(报错)。（异常是Windows上的Bash，它使用本机Bash。）换言之，Windows 不支持 NODE_ENV=production 的设置方式。

```
{
  "scripts": {
    "build": "NODE_ENV=production webpack --config build/webpack.config.js"  
  }
}

//windows下报错
```

在package.json文件的script字段写脚本命令时， 在给执行的js文件设置参数时，可能因为操作系统的不同而存在差异。

解决方法：

安装  npm install --save-dev cross-env

使用

```
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```



### NRM(npm registry manager)

镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 npm 源间切换。

npm install -g nrm：全局安装nrm

nrm ls ： 查看可选的源

nrm use 源名：切换源

npm config get registry：查看当前镜像源

`npm config set registry https://registry.npm.taobao.org`：切换到淘宝源

 nrm test ：测试相应源的响应时间



`npm install -g cnpm --registry=https://registry.npm.taobao.org`



扩展：

运行nrm报错问题：

```
C:\WINDOWS\system32>nrm
internal/validators.js:124
    throw new ERR_INVALID_ARG_TYPE(name, 'string', value);
    ^

[TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
  at validateString (internal/validators.js:124:11)
  at Object.join (path.js:375:7)
  at Object.<anonymous> (D:\nodejs\node_global\node_modules\nrm\cli.js:17:20)
  at Module._compile (internal/modules/cjs/loader.js:1063:30)
  at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
  at Module.load (internal/modules/cjs/loader.js:928:32)
  at Function.Module._load (internal/modules/cjs/loader.js:769:14)
  at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
  at internal/main/run_main_module.js:17:47
] {
  code: 'ERR_INVALID_ARG_TYPE'
}

```

解决方法：找到全局安装了nrm命令的目录，如：D:\Programspace\nvm\v14.16.1\node_modules\nrm，找到该目录下的cli.js文件，打开文件找到报错的第17行，注掉原17行改为如图：

```
//const NRMRC = path.join(process.env.HOME, '.nrmrc');(注掉)
const NRMRC = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.nrmrc');
```





### NPX（npm package extention）

npm 从5.2版开始，增加了 npx 命令。npx 想要解决的主要问题，就是调用项目内部安装的模块。比如，一般只在项目中安装webpack而不再全局安装webpack，如果直接在命令行运行webpack命令，则默认找全局的下的webpack，因为找不到，所以报错。在没有npx之前，可以通过以下方式运行在项目中安装的webpack：

```
方式一：
# 项目的根目录下执行
$ node-modules/.bin/webpack --version

方式二：
在package.json文件的scripts字段配置npm脚本命令
"bundle":"webpack [optins]"
npm run bundle
```

有了npx候就能简化上述命令。

npx webpack [options] ：npx 的原理 就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在。如果项目和全局都没有，npx webpack则会下载该包，但是这个下载并不会在项目与全局安装webpack相关包，而 npx 将 webpack 下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载 webpack。

npm install -g npx：全局安装npx，一般不用，npm自带npx

npx --no-install  包名：让 npx 强制使用本地模块，不下载远程模块，如果本地不存在该模块，就会报错。

npx --ignore-existing 包名：忽略本地的同名模块，强制安装使用远程模块



### yarn

- yarn init ：初始化项目
- yarn add [package] ：安装包依赖
  yarn add [package]@[version]
  yarn add [package]@[tag]
- yarn remove [package] ：移除包依赖
- yarn global remove [package]
- yarn  或者 yarn install  ：安装项目全部依赖
- yarn add [package] --dev：安装并添加到devDependencies
  yarn add [package] --peer：安装并添加到peerDependencies 
  yarn add [package] --optional：安装并添加到optionalDependencies 

![image-20210718170217000](.\typora-user-images\image-20210718170217000.png)

npm 目前支持以下几类依赖包管理：

- dependencies：生产依赖，用于指定应用依赖的外部包，这些依赖是应用发布后正常执行时所需要的，但不包含测试时或者本地打包时所使用的包。
- devDependencies：开发依赖，里面的包只用于开发环境，不用于生产环境，这些包通常是单元测试或者打包工具等，例如gulp, grunt, webpack, moca, coffee等。
- peerDependencies：同等依赖，或者叫同伴依赖，用于指定当前包（也就是你写的包）兼容的宿主版本。如：编写一个gulp的插件，而gulp却有多个主版本，我们只想兼容最新的版本，此时就可以用同等依赖（peerDependencies）来指定。
- optionalDependencies：可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望npm继续运行，就可以使用optionalDependencies。另外optionalDependencies会覆盖dependencies中的同名依赖包，所以不要在两个地方都写。
- bundledDependencies / bundleDependencies：打包依赖，bundledDependencies是一个包含依赖包名的数组对象，在发布时会将这个对象中的包打包到最终的发布包里。





### 辅助开发工具

log4js：用于记录JS日志的工具



使用方式：

- 安装：npm i log4js -D

- 引入：const log4js = require('log4js')

- 配置：log4js.configure({  

  ​	appenders:{ cheese: { type:"file" ,filename:"cheese.log" } },

  ​	categories:{ default: { appenders:[ "cheese" ],level:"error" } }

  });

- 创建实例：const  logger = log4js.getLogger( 'cheese' )
- 使用：logger.debug( )等语句用来代替console.log ( ) 语句



**appender:输出源**



## node.js特性

- 用node做服务器环境运行的程序都是单线程的，但是后台有一个I/O线程池
- 在node.js中不存在跨域问题。

```javascript
const http = require('http')   //require（）能加载并执行对应模块中的代码；返回该模块导出的接口对象，该对象中是对应模块向外暴露的属性或者方法。
http.get('url',(res)=>{
    let str=''
    res.on('data',(chunk)=>{
        str += chunk
    })
    res.on('end',()=>{
        console.log(str)
    })
})
```

- 可进行操作系统层面的操作
- 在一个JS文件中，this刚开始与exports和module.exports指向同一个堆内存对象，在exports或者module.exports其中一个改变指向后，this的指向任然不变
- 在REPL环境中执行js文件代码，js文件中的this指向global
- 一个js文件就是一个模块，在node中每个js文件中的代码都是写在一个函数内部的，所以各个模块中的变量和函数是无法直接被其他模块访问和使用的，除非开发者主动暴露模块的接口（属性或者方法）出去，并在要使用的模块进行接收。



### 模块/包分类

- 核心模块

- 第三方的Node.js模块

  是为了实现某些功能，发布的npmjs.org上的模块，按照一定的开源协议供社群使用。

- 自定义的Node.js模块

  自定义模块是在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程、速度相比核心模块稍微慢一些，但是用的非常多。



### node.js中的模块是单例模式

**node.js中的模块是单例模式的，对于同一个项目中，不同的js文件都引入的同个第三方库或者框架，那么各个js文件模块中引入的第三方库或者框架导出的对象都是同一个对象。自己因为这一点，在vue中困惑了很久。**

代码演示：

```
项目中已经下载好了vue库。
main.js中：
const Vue = require('vue')
const  Vue1 =require('./store')
console.log(Vue === Vue1);  //true

store.js中：
const Vue = require('vue')
module.exports = Vue
```



### 模块组成

模块引用, 模块定义, 模块标识

node中模块化代码的外层代码：

```
这里是一个js文件内部的代码：

console.log(arguments.callee + '')  //打印：function (exports, require, module, __filename, __dirname) { js代码 }
									//exports:用于暴露本模块的函数或者变量
									//暴露方式有：exports.key=value或module.exports.key =value或module.exports={...}
									//require:用于在本模块引入其他模块暴露的函数或者变量
									//module：表示本模块本身
									//__filename:表示本模块文件的完整路径，包含文件名
									//__dirname：表示本模块文件的完整路径，不含文件名
console.log(this); //打印：{}

function func() {
  console.log(this);   //这里的this指向的是全局对象global，下面打印的是global上的属性或者方法
}
func()    //打印：Object [global] {
                      global: [Circular *1],
                      clearInterval: [Function: clearInterval],
                      clearTimeout: [Function: clearTimeout],
                      setInterval: [Function: setInterval],
                      setTimeout: [Function: setTimeout] {
                        [Symbol(nodejs.util.promisify.custom)]: [Getter]
                      },
                      queueMicrotask: [Function: queueMicrotask],
                      clearImmediate: [Function: clearImmediate],
                      setImmediate: [Function: setImmediate] {
                        [Symbol(nodejs.util.promisify.custom)]: [Getter]
                      }
                }
}
```

标准的第三方或者自定义的模块（包）：

这些包中往往有多个js文件组成，以完成多种不同的任务和逻辑。其中常常包含以下部分：

- package.json：整个包的说明性文件
- bin：包的可执行二进制文件
- lib/src：包的源码文件
- test：测试单元



### NodeJS核心模块



#### path模块

操作路径相关的模块

```
const path = require('path')

path.dirname(pathName):获取一个文件的路径部分
path.basename(pathName):获取一个文件的文件名部分, 包括文件后缀
path:extname(pathName):获取一个文件的扩展名部分


path.join(path1,paht2,...):作用和resolve类似，起到拼接作用
const pathName = path.resolve(path1,path2 [,path3] ...) :拼接路径
上面两者的区别：
```

![image-20210718110906853](.\typora-user-images\image-20210718110906853.png)

![image-20210718110917190](.\typora-user-images\image-20210718110917190.png)

![image-20210718110931006](.\typora-user-images\image-20210718110931006.png) 





![image-20210718171737849](.\typora-user-images\image-20210718171737849.png)

上图的输出结果：

![image-20210718171812744](.\typora-user-images\image-20210718171812744.png)

在上图中的filaname2中以 / 开头，会被resolve方法认为是绝对路径。



![image-20210718171831775](.\typora-user-images\image-20210718171831775.png)

上图的输出结果：

![image-20210718171845112](.\typora-user-images\image-20210718171845112.png)



#### url模块：处理与解析 URL

- url.parse()：

  ```
  const url = require('url'); //引入url核心模块
  const myURL =url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'); 
  ```

  ![image-20210715233719893](.\typora-user-images\image-20210715233719893.png)

  ![image-20210715233732380](.\typora-user-images\image-20210715233732380.png)

- url.format(urlObject)

- url.resolve(from, to)
  ![image-20210715235145920](.\typora-user-images\image-20210715235145920.png) 

  ![image-20210715235205981](.\typora-user-images\image-20210715235205981.png)
  
- URLSearchParams 

![image-20210715235630632](.\typora-user-images\image-20210715235630632.png)

![image-20210715235651536](.\typora-user-images\image-20210715235651536.png)



浏览器端也有URLSearchParams 方法。





#### querystring内置模块

- querystring.parse(str[, sep[, eq[, options]]])
  sep:表示分组key和value之间的分隔符号
  eq：表示每组参数之间的分隔符

  ```
  const querystring = require('querystring')
  var qs = 'x=3&y=4'
  var parsed = querystring.parse(qs)
  console.log(parsed)
  ```

- querystring.stringify(obj[, sep[, eq[, options]]])

  ```
  const querystring = require('querystring')
  var qo = {
    x: 3,
    y: 4
  }
  var parsed = querystring.stringify(qo)
  console.log(parsed)
  ```

- querystring.escape(str)  :编码

  ```
  const querystring = require('querystring')
  var str = 'id=3&city=北京&url=https://www.baidu.com'
  var escaped = querystring.escape(str)
  console.log(escaped)
  ```

- querystring.unescape(str) ：解码

  ```
  const querystring = require('querystring')
  var str = 'id%3D3%26city%3D%E5%8C%97%E4%BA%AC%26url%3Dhttps%3A%2F%2Fwww.baidu.com'
  var unescaped = querystring.unescape(str)
  console.log(unescaped)
  ```

![image-20210716000353680](.\typora-user-images\image-20210716000353680.png)

![image-20210716002332917](.\typora-user-images\image-20210716002332917.png)



node执行js代码开启浏览器端的调试界面：

node --inspect --inspect-brk xxx.js

chrome://inspect





nodejs进程管理工具：

- supervisor
- nodemon
- forever
- pm2

#### http/https









#### 通过服务端代理访问跨域接口

middleware：http-proxy-middware

反向代理，node中间件

 webpack配置生产环境需求开发时就要使用http-proxy-middware中间件。它能在原生，express，koa等框架下实现代理。

```js
const http = require('http')
const url = require('url')
const { createProxyMiddleware } = require('http-proxy-middleware')

const server = http.createServer((request, response) => {
    const urlObj = url.parse(request.url, true)
    response.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    })
    if (/^\/api/.test(urlObj.pathname)) {
        let proxy = createProxyMiddleware('/api', {
            target: 'https://gate.lagou.com',
            changeOrigin: true,
            pathRewrite: {
                '/api': ''
            }
        })
        proxy(request, response)
    } else {
        console.log('error');
    }
})

server.listen(8080, () => {
    console.log('server is running')
})
```



#### Events(发布订阅者模式)

```js
const EventEmitter = require('events')  //EventEmitter是一个类，它的实例上有事件池，同时，继承它的子类上也可以有事件池

const MyEvent extends EventEmitter {}   //继承

const event = new MyEvent()

event.on('eventName1',(value)=>{
    ...
    console.log(value)
})
event.on('eventName2',(value)=>{
    ...
    console.log(value)
})

event.emit('eventName1','hello')
event.emit('eventName2','hello')


event.off('eventName',functionName)

event.eventNames()  // 获取该event对象上有几种事件

event.listenerCount('eventName')  // 获取该event对象上指定事件名的订阅了几个函数

event.listeners('click')  // 获取指定事件的事件处理函数

event.once('eventName', functionName)
```



#### File System

- 同步文件操作
- 异步回调操作
- 异步promise操作文件 



```js
const fs = require('fs')

const filePath = './test.txt'

const info = fs.statSync(filePath)   //该方法是获取文件的信息而不是文件的内容 ，同步操作

fs.stat(filePath,(error,info)=>{    // 异步读取
	if(!error){
        //...
    }        
})
console.log(123)



fs.promise.stat(filePath).then(info=>{
    
}).catch(error=>{
    
})


```

文件描述符

对于每一个进程，内部都维护着一张当前打开着的文件和资源表，但在该进程中每打开一个文件时都分配了一个称为文件描述符的简单的数字标识符。在系统层面，所有的文件系统操作都使用这些文件描述符来标识和跟踪每个特定的文件。也就是说真正操作某个文件的时候，其实是通过文件描述符来跟踪和操作对应文件的。（类Posix系统中）

node.js屏蔽了文件描述符在操作系统层面的差异。

```js
const fs = reqiure('fs')

// fd: file describtor
fs.open('./test.txt',(error,fd)=>{
    if(!error){
        fs.fstat(fd,(error,info)=>{
            // .....
        })
    }
})
```



文件及文件夹操作

```js
const fs = require('fs')


const dirname = './test'
if(!fs.existsSync(dirname)){
    fs.mkdir(dirname,err=>{
        
    })
}



//文件夹的增删改查
fs.mkdir('path/fileName',(reeor,result)=>{
	if(error){
		console.log('创建文件夹失败')
		return 
	}
	console.log('创建文件夹成功')
})

fs.rename('path/oldFileName','path/newFileName',(error,result)=>{
	if(error){
		console.log('重命名文件夹失败')
		return 
	}
	console.log('重命名文件夹成功')
})

fs.rmdir('path/oldFileName',(error,result)=>{
	if(error){
		console.log('删除文件夹失败')
		return 
	}
	console.log('删除文件夹成功')
})

fs.readdir('path/oldFileName',(error,result)=>{   // 能读取文件夹下的文件或者子文件夹，但不能递归读取子文件中的内容 
	if(error){
		console.log('读取文件夹内容失败')
		return 
	}
	console.log(result)  //如果文件夹为空的话，则result是一个空数组
})


//文件的增删改查
fs.writeFile('paht/fileName','content',(err)=>{   // 完全覆盖重写
    console.log('成功')
})

fs.appendFile('path/fileName','content',(err)=>{   //追加内容
    
})

fs.unlink('path/pathName',(err)=>{    //删除文件
    
})

fs.readFile('path/fileName', 'utf-8', (err,content)=>{    // 读取文件内容
    console.log(content)    //content默认是buffer格式，该函数中间传uft-8可以自动实现content的转换
})

fs.readFile('path/fileName', (err,content)=>{
    console.log(content.toString())    //content默认是buffer格式，该函数中间传uft-8可以自动实现content的转换
})


const content = fs.readFileSync('path/fileName')
```



```js
function getFiles(dirname){
    fs.readdir(dirname,(error,files)=>{
        for(let index=0;index<files.len;index++){
            let info = fs.statSync(path.resolve(__dirname,files[index]))
            if(info.isFile()){
                console.log(files[index])
            }else if(info.isDirectory()){
                getFiles(path.resolve(__dirname,files[index]))
            }
        }
    })
}
```







![image-20210718131330795](.\typora-user-images\image-20210718131330795.png)



![image-20210718131346434](.\typora-user-images\image-20210718131346434.png)



在nodejs10版本后，引入了基于promise的异步读取文件的模块。

```
const fs = require('fs/promise')
或者
const fsPromise = require('fs').promise
```

 nodejs在13版本以后，支持import 和export 。



遍历文件夹并确定有哪些是文件：

```js
const fs =require('fs')
const path =require('path')

function findFile(pathStr){
	if( typeof pathStr !=='string') return 
	fs.readdir(pathStr,(error,result)=>{
        if(result.length>0){
            result.forEach(item=>{
                let pathStr = path.resolve(__dirname,'./item')   //严重的错误点，该处的__dirname永远指向的是当前js文件所在的目录
                let stat = fs.statSync(pathStr);
                if(stats.isFile()){
                    console.log('pathStr对应的是文件')
                }else if(stats.isDirectory()){
					findFile(pathStr)
                }
            })
        }
	})
}


正确的写法:
const fs = require("fs");
const path = require("path");

function findFile(pathString) {
    fs.readdir(pathString, (error, result) => {
        error ? return console.log('error') : null
        if (result.length > 0) {
            result.forEach((item) => {
                let pathStr = path.resolve(pathString, item)
                let stat = fs.statSync(pathStr)  //同步方法
                if (stat) {
                    if (stat.isFile()) {
                        console.log(pathStr + "对应的是文件");
                    } else if (stat.isDirectory() && !pathStr.includes("node_modules")) {
                        findFile(pathStr)
                    }
                }
            });
        }
    });
}


另一种方式：
function findFile(pathString) {
    fs.readdir(pathString, { withFileTypes:true },(error, result) => {  //withFileTypes表示将文件的类型也一并获取到，默认值是false
        for(let file of result){
            //在加上withFileTypes后，result数组中每一项将不再是字符串，而是对象
            //对象上有一个方法isDirectory()
            if(file.isDirectory()){
                findFile(path.resolve(pathString,file.name))
            }else{
                console.log('是文件类型的有：'+file.name)
            }
        }
    });
}
```



文件监听：

```
const fs = require('fs')

fs.watch('path/fileName',(error)=>{
	....
})
```

![image-20210717120522182](.\typora-user-images\image-20210717120522182.png)



#### 文件描述符

![image-20210718130700642](.\typora-user-images\image-20210718130700642.png)

获取某个文件的文件描述符：

```
fs.open(path,(error,fd)=>{
	...
	//其中fd就是文件描述符数字
	fs.fstat(fd,(error,info)=>{
		 //info就是文件信息
	})
})
```





#### Stream

读取文件流，然后将文件流可以进行压缩，压缩完成后再输出。

```
const fs = require('fs')
const zlib = require('zlib')

const gzip = zlib.createGzip()

const readStream = fs.createReadStream('./log.txt')
const writeStream = fs.createWriteStream('./log.gzip')

readStream
	.pipe(gzip)
	.pipe(writeStream)
```



#### ReadLine

该模块允许开发者停下来输入内容，然后根据不同的输出信息走不同的逻辑。

可以用于命令行工具的开发。

```
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('你如何看待 Node.js 中文网？', (answer) => {
  // TODO：将答案记录在数据库中。
  console.log(`感谢您的宝贵意见：${answer}`);

  rl.close();
});
```



#### Crypto（加密模块）

在真实项目中，往往要涉及加密操作。

该模块既可以做对称加密也可以做非对称加密。既可以做MD5加密也可以做sha加密

 ```
 const  crypto =requier('crypto')
 
 const password = 'abc123'
 
 const secret = crypto.createHash('sha1'[ | 'md5']).update(password[, utf-8]).digest('hex')  //加密算法：sha1 , 要加密的内容：password ,加上utf-8的话用于识别中文，   加密后输出方式：hex 以十六进制表示加密结果
 
 console.log(secret)
 ```





nodejs中获取文件信息：

```
var stat = fs.statSync(filename)
console.log(stat)

{ 
　dev: 0,
  ino: 0,
  mode: 33206,
  nlink: 1,
  uid: 0,
  gid: 0,
  rdev: 0,
  size: 1747,
  atime: Tue, 03 Jan 2012 13:35:51 GMT,
  mtime: Tue, 03 Jan 2012 13:35:51 GMT,
  ctime: Wed, 21 Dec 2011 14:31:59 GMT 
}
其中atime，mtime，ctime就分别代表了访问时间，修改时间以及创建时间，都为date类型
```

nodejs使用stats对象来代表一个文件或设备信息，stats对象有如下方法：

| stats.isFile()            | 如果是文件返回 true，否则返回 false。                        |
| ------------------------- | ------------------------------------------------------------ |
| stats.isDirectory()       | 如果是目录返回 true，否则返回 false。                        |
| stats.isBlockDevice()     | 如果是块设备返回 true，否则返回 false。                      |
| stats.isCharacterDevice() | 如果是字符设备返回 true，否则返回 false。                    |
| stats.isSymbolicLink()    | 如果是软链接返回 true，否则返回 false。                      |
| stats.isFIFO()            | 如果是FIFO，返回true，否则返回 false。FIFO是UNIX中的一种特殊类型的命令管道。 |
| stats.isSocket()          | 如果是 Socket 返回 true，否则返回 false。                    |

 fs.existsSync(path)：判断文件是否存在

```
var fs = require("fs")
var stat = fs.lstatSync("./xx")
console.log(stat.isDirectory()) 
//true为文件夹
```













### express框架

后端代码开发框架。之前在写一个后台项目去管理一个静态目录时，工作量较大。和express对标的后端js框架有koa，egg等。

基本使用：

- express应用程序生成器，通过它可以快速的构建一个应用的骨架:

  - npx express-generator  或者

    

  - npm install -g  express-generator  

  - express

  

- 安装 :
  - yarn iniy- y
  - yarn add express -S

```js
const express = require('express')   //引入express框架
const app = express()	//创建express实例


app.get('/server',(request,response)=>{  // 给实例绑定get请求的api
	response.setHeader('Access-Control-Allow-Origin','*')  // 设置允许跨域访问
	response.send('hello express')		//发送并结束响应
})

app.post('/server',(request,response)=>{  // 给实例绑定post请求的api
	response.setHeader('Access-Control-Allow-Origin','*')  // 设置允许跨域访问
	response.send('hello express')		//发送并结束响应
})


app.listen(3000,(error)=>{   //开启端口号监听
	if(error){
	console.log('服务器启动失败')
	}else{
	console.log('服务器启动成功')
	}
})
```



```js
const express =require('express')
const app = express()
app.use('/',(request,respones)=>{
	...
})
app.use('/api',(request,respones)=>{
	...
})
app.listen(8080,()=>{
	console.loh('server is running')
})
//使用use设置的后端路由，解析时是从上往下解析的。如果上面的匹配了且返回给了前端内容，那么之后的规则将不再匹配。
//在express中将use中的回调函数又被称为中间件。其中中间件可以挂在多个。
    

//写法一：
app.use('/',(request, respones，next)=>{
	console.log(1)
    next()  //必须调用next方法才能继续串联执行下一个中间件。，否则就无法执行下一个中间件。这称为 ——中间件栈
},(request, respones, next)=>{
    console.log(2)
}，(request, respones)=>{   //前一个中间件函数内没有调用next方法，所以3不会有打印输出。
    console.log(3)
})  



//写法二：
const middlewares = [
  (request, respones，next)=>{
	console.log(1)
    next()  
},
  (request, respones, next)=>{
    console.log(2)
      next()
}，
  (request, respones)=>{   
    console.log(3)
}]

app.use('/', middlewares)
```





### 面试题

#### 为什么要学习nodejs

​		现在的前端在写代码时，常常把前端代码看作一个工程来写，这些工程一般都会以node作为基础，比如vue，react项目源码代码是无法在浏览器中直接运行的，它们需要webpack这样的打包器编译转化后才能在浏览器端运行。而webpack就是基于nodejs来实现的。所以学习nodejs非常有助于理解前端工程化方面的一些内容。同时也使用npm开发工具。学习node更多的是学习前端工程化，而并不一定是用它来写后端代码，而后端代码更过的是交给了java这类语言。

​	不要把面试官往用node去写后端代码方向引导。而尽量往用node去完成前端工程化或者webpack，npm方面引导。

#### 使用nodejs编写代码实现遍历文件夹及所有文件名

考察点：

nodejs中的文件系统模块——fs——的基本使用

nodejs中的文件系统模块——path——的基本使用

**函数递归的使用**

```javascript
const fs = require('fs')  
const path = require('path')

function readDir(entry) { 
  const dirInfo = fs.readdirSync(entry)  //同步读取entry目录下的所有文件及文件夹并以数组方式返回
  dirInfo.forEach(item => {
    const info = path.join(entry, item) // 进行文件或文件夹与路径的拼接
    const isDir = fs.statSync(info)  //判断路径的详细信息
    if (isDir.isDirectory()) {   //判断路径的对应的是文件还是文件夹，是文件夹就继续递归，不是则打印文件路径
      console.log('path: ' + info)  
      readDir(info)
    } else {
      console.log('file : ' + info)
    }
  })
}

readDir(__dirname)  //__dirname:代表当前文件所在的磁盘路径

```



#### Node如何做版本升级，为什么要使用nvm

为了能使用新的ES语法；在用旧版webpack做代码打包时，当项目很复杂时，导致打包速度很慢，而新版的webpack它会依赖一些新版node提供的API来提高自己的打包效率。

用nvm能高效的在本地的各个node版本中进行切换。



#### 模块化的差异，AMD,CMD,COMMENJS,ESMODULE

AMD强调依赖前置，angular就是采用的AMD方式，它的好处是某模块向用其他模块，其他模块是提前就前置好的， 降低了模块中的耦合，COMMENJS的模块间的耦合性要更强一点。

AMD,CMD,COMMENJS都是**动态引入模块**，ESMODULE则是**静态引入模块**，如

```
if(treu){
	const path = require('path')
}else{
	const fs = require('fs')
}
这种方式在COMMENJS中是可行的，也就是说commonjs中的模块是在运行时引入的，所以可以放在逻辑判断中去引入。



if(treu){
	import path from'path'
}else{
	import fs from'fs'
}
这种方式在ESMODULE中是不行的，也就是说ESMODULE中的模块是在运行其他代码之前引入的，且不可以放在逻辑判断中去引入。
```

静态引入的好处：webpack中的打包机制就希望开发者用静态的方式去引入模块，因为这样webpack可以进行代码预分析，webpack中有依赖图谱，只有代码采用import的方式引入时，它才能展开静态分析项目依赖结构，从而更快速的打包。如果用的时commonjs方式引入，则无法确定依赖图谱，这就会拖慢打包了。

**千万别和面试官主要说： commonjs用的时require/exports方式引入和导出， ESMODULE用的时export default /import方式导出。**



#### 图片上传到服务器的过程（Filereader.readAsDataURL），图片预览

```
<input type='file' onchange='load()'>

高版本浏览器：
function load (){
	const reader = new Filereader()
	reader.readAsDataURL(this.files[0])
	
	const base64Str = Filereader.readAsDataURL()//不用在意图片大小，因为不是自己写的代码
	const img = document.createElemnt('img')
	img.src=base64Str
	box.appendChild(img) //实现预览
	// 其他交给form表单提交给服务器
}

低版本浏览器：（没有 Filereader 类）
function load (){
	让input以表单形式先将图片提交给服务器，预览是预览服务器端返回的图片，开发者创建img变迁，将图片url绑定给src后再展示预览。
}

一旦file控件发生变化，就会触发change事件
```





  



## 模块化语法

在node.js中的commonjs模块化规范中，一个模块通过模块化语法（exports或者module.exports）暴露一个本质是一个对象的引用，而该对象内部存放着该模块需要暴露出去的属性或者方法。  而在另一个模块中，如果引入了一个模块并赋值给一个变量，那么该变量本质也是存放的是一个指向堆内存中的对象。所以如果模块中某一方在某个时间修改了该对象中的一个属性的话，那么在对方模块中就能反应出来。



在node中为了实现模块化导出，使用了Module类，每个模块的本质就是一个Module类的实例。所以一个js文件在node中就是一个对象实例。真正被导出的是module.exports。 而源码内部做了module.exports = exports。



前端浏览器会缓存静态脚本文件以提高性能，NodeJs 对引入过的模块都会进行缓存，以减少二次引入时的开销。不同的是，浏览器仅缓存文件，而在 NodeJs 中缓存的是编译和执行后的对象。

下图是，路径分析和文件定位步骤： 

![image-20210418105915555](.\typora-user-images\image-20210418105915555.png)



- 在一个模块中引入另一个模块时，另一个模块的加载过程是同步的，对于第一次加载的其他模块，被加载的模块会被加载并**同步执行**。
- 同一个模块被多次引入时，会走缓存取第一次加载时的导出结果
-  



面试题：

在nodejs中模块之间出现循环引用时的运行效果。

在加载模块时，是一种数据结构——树结构。图结构在遍历的过程中（DFS），有深度优先搜索和广度有限搜索（BFS）。同时，对于已经加载过的模块，它上面的loaded属性会改为true，在同一个项目中的其他模块在加载它们时，因为loaded属性为true的话，将直接走缓存。而不再执行。  同时，在node中采用的是深度有限原则。



![image-20220612100424099](.\typora-user-images\image-20220612100424099.png)





#### commonJS的不足

commonJS加载模块是同步加载的，这意味着只有等到对应的模块加载完毕后，当前模块中后面的内容才能被运行；这在服务器端不存在问题，因为各种资源本身就是存放在服务器端的，服务器端的程序在获取其他模块文件时都是本地文件，不需要经过网路请求，所以速度非常快。

但是上面的情况出现在浏览器中，就意味着需要的资源需要先请求下来，然后再加载，那么在同步的情况下意味着后续js代码将无法被正常执行，同时造成页面渲染的阻塞。所以commonjs规范是用在服务器端的。



早期想在浏览器端实现模块化，用的规范是AMD或者CMD。但是现在的浏览器中有能支持ES6的模块化语法了，同时webpack这种打包工具能将开发阶段使用的commonjs或者ES6模块化规范转为浏览器能识别的语法模式，所以现在AMD和CDM已经用得很少了。











# 模块化语法

模块化开发的最终目的是将程序划分为一个个小的结构，这些小结构中有自己逻辑代码，有自己的作用域，不影响其他结构，这个结构可以暴露自己的变量，方法，对象等给其他结构使用，也可以以特定方式导入其他结构暴露的变量，方法等

### 定义：

模块（构件）：一种可以有自己的模块名字，内部有能实现一定功能逻辑的代码的集合体。它对外表现出接口特征，对内有自己的代码逻辑和数据。简而言之，模块就是一个具有独立作用域，对外暴露特定功能接口的代码集合。

脚本和模块的异同：

都可以存在一个单独的文件中, 都可以被其他模块(脚本)引入, 也可以引入其他模块(脚本)的数据。

可以按需导入模块中的数据, 但是不能按需导入脚本中的数据，对应脚本，一旦导入了它, 就会将脚本中的所有数据全都导入到了全局作用域中。对于模块, 则可以只导入我们需要的数据。一个模块可能会暴露出很多的变量、函数和对象, 但我们可以只把需要的那一部分导入进来使用。

### 模块化的优势：

- 避免变量的命名冲突
- 代码隔离，避免相互影响
- 利于项目维护
- 模块之间的依赖明确

### 模块化的发展历程：

#### **无模块化**

表现：

```html
<script src="jquery.js"></script>
<script src="jquery_scroller.js"></script>
<script src="main.js"></script>
<script src="other1.js"></script>
<script src="other2.js"></script> 	
<script src="other3.js"></script>
```

要求：

被依赖的脚本的引入必须放在使用该脚本的其他脚本的前面，否则报错

不足：

- 引入的脚本可能直接在全局写入变量造成命名空间的污染
- 脚本之间的依赖很不明确
- 维护成本高





#### **Common.js**

Node是CommonJS规范在服务器端一个代表性实现。

Browserify是CommonJS规范在浏览器端一个代表性实现

webpack打包工具具备对CommonJS的支持和转换



注：node.js采用的模块化规范，一个单独的文件就是一个模块。

表现：

```javascript
//a.js模块(导出)
var a = 5;
var add = function(param){ 
    return a + param
}

module.exports.a = a;module.exports.add = add

// 另一种写法 exports.a = a  export.add = add

// b.js引用自定义a.js模块，参数包含路径，可省略.js（导入）
var addFn = require('./a-commonJs')
// let {a,addFn} = require('./a-commonJs')   // a-commonJs模块导出的就是一个对象，所以可以解构赋值，在导入模块修改导出模块的引用对象的变量时，会影响原导出模块的该变量（就是对象的引用赋值）
console.log(addFn.add(3)) 
```

注意：

- 导出模块内的数据或者方法的方式有：

  ```javascript
  exports.key = value
  
  exports.functionName 
  
  module.exports.key = value
  
  module.exports.functionName 
  
  module.exports = {
      key,
      functionName
  }
  
  //以下是错误的导出方式：
  exports = {
      key,
      functionName
  }
  
  //原因可以理解为在模块化函数内部有这样的代码： 
  exports = module.exports
  return module.exports
  //所以exports本质是对module.exports的引用，函数内部真正导出的是module.exports所指向的那个内存中的对象。
  ```

解决的点：

- 依赖问题被解决
- 全局命名空间污染被解决

不足：

- 当require引入一个模块时，这个方法读取的模块代码是**同步加载执行**的，在服务器端，因为模块文件都存在本地，所以读取速度可以很快，但是用在客户端的话，由于依赖的模块都是要通过网路请求获取的所以耗时较长，**CommonJS不适合浏览器端模块加载**，更合理的方案是使用异步加载，比如AMD规范。

扩展：CommonJS 在 NodeJs 中的模块加载机制

1. 路径分析
2. 文件定位
3. 编译执行

当模块在被**第一次引入的时候**，模块中的js代码会被执行一次。**模块被多次引入的时候，会有缓存，最终只加载（运行）次。**每个模块对象上有一个标识属性loaded，该属性为false时表示该模块未被加载，为true则表示已经加载。

前端浏览器会缓存静态脚本文件以提高性能，NodeJs 对引入过的模块都会进行缓存，以减少二次引入时的开销。不同的是，浏览器仅缓存文件，而在 NodeJs 中缓存的是编译和执行后的对象。

项目各个模块中加载顺序是深度优先。

下图是，路径分析和文件定位步骤：

![image-20210418105915555](.\typora-user-images\image-20210418105915555.png)

编译执行：

在定位到文件后，首先会检查该文件是否有缓存，有的话直接读取缓存，否则，会新创建一个 Module 对象。

1. 将 JavaScript 代码用函数体包装，隔离作用域。

```
(function(exports, require, modules, __filename, __dirname) {
    exports.add = function(a, b) {
      return a + b;
    };
 });

```

2. 执行函数，注入模块对象的 exports 属性，require 全局方法，以及对象实例，`__filename`, `__dirname`，然后执行模块的源码。
3. 返回模块对象 module.exports 属性。



CommonJs加载模块的过程：

commonJs模块加载js文件的过程是运行时加载的，并且是同步阻塞的；运行时加载意味着是js引擎在执行JS代码的过程中加载模块的，同步阻塞意味着一个文件没有加载结束之前，后面的代码不会执行。

commonJs导出的是一个JS对象的引用。





####  **AMD规范**(Asynchronous Module Definition)

是在前端页面中使用的js代码模块化规范。

注：RequireJS 采用的模块化规范，AMD规范则是**异步加载模块**，模块的加载不影响它后面语句的运行。所有依赖  这个模块的语句都定义在一个回调函数中，等到依赖加载完成之后，这个回调函数才会运行。     AMD需要在模块最开始就把当前模块依赖的内容导入，然后再开发，ES6模块化规范也是一样。所有的模块导入都要放在本模块的开始位置。   **依赖前置、提前执行**。

表现：

```javascript
//基于三个API。引用模块的时候，我们将模块名放在[]中作为reqiure()的第一参数；如果我们定义的模块本身也依赖其他模块,那就需要将它们放在[]中作为define()的第一参数。
require([module], callback)   //加载一个模块
define(id, [depends], callback)   //定义一个模块
require.config()   //指定引用路径

//使用：
//现在html中引入require.js
// data-main表示加载完src指定的文件后立马去下载执行data-main指定的文件
<script data-main="./index.js" src="./require.js"></script>

// index.js
(function(){
    require.config({
        baseUrl:'',
        path:{
            'bar':'./modules/bar',
            'foo':'./modules/foo'
        }
    })
    require(['foo'],function(foo){....})  // 加载并执行foo模块
})()

//./module/bar.js
define(function(){
    const name = 'jack'
    
    return {
        name:name
    }
})


// ./modules/foo.js
define(['bar'],function(bar){   //foo模块又依赖于bar模块，就会加载执行bar模块
    console.log(bar.name)
})



define(['a','b','c','d','e','f'],function(a,b,c,d,e,f){
    //必须先声明并初始化要用到的所有模块
    a.functionName();
    if(false){
        b.functionName();   //没有用到B模块，但是B模块还是会被提前执行以准备好
    }
})
```

完整实例：

```
在html文件中引入require.js模块规范实现文件

<script src='./require.js' data-main='index.js'></script> index.js作为入口文件。
data-main表示在加载完成require文件后，会立即加载并执行该属性对应得js文件


index.js中
(function(){
	require.config({
	baseUrl:''
		paths:{
			'module1':'./xxx1'
			'module2':'./xxx2'    //定义了模块 
		}
	})
	
	require(['module2'],function(module2){
		.......
	})
})()


module1.js：
define(function(){
	const name = 'abc'
	
	return {
		name:name
	}
})


module2.js：
define(['module1'], function(module1){
	console.log(module1.name)
})

```



 优点: 

- 适合在浏览器环境中异步加载模块、并行加载多个模块
- 实现 JavaScript 文件的异步加载，避免网页失去响应

不足：不能按需加载。



#### **CMD**

注：SeaJS采用的模块化规范。 **依赖就近、延迟执行**。

```javascript
define(function(require, exports, module){
	const a = require('./a')   //需要时引入
	a.functionName()
	if(false){
		const b = require('./b')  //需要时引入
        b.functionName();  
    }
})
```

完整实例：

```js
在html文件中：
<script src='./sea.js'></script>
<script>
	seajs.use('./index.js')  //入口文件
</script>

index.js:
define(function(require,export, module){
	const foo = require('./foo.js')
	console.log(foo.name)
})


foo.js:
define(function(require,export, module){
	const name = 'abc'
    module.exports = {
    	name:name
    }
})
```



#### **ES6模块化**

注：ECMAScript 6 中引入的模块化功能

import和export 是关键字而不是对象或者函数。它采用了编译器的静态分析并且加入了动态引用的方式。

在comonjs规范中，module.exports 和 require 都是js对象和函数，他们需要在代码执行阶段才能进行模块的引入和依赖的确定。

表现：

````javascript
// 模块定义 add.js
export function add(a, b) {
  return a + b;
}
export default 函数表达式|对象|变量名  //导出默认成员，一个文件只能有一个,再导出默认成员后还可以导出其他成员
export const key1 = value1
export const key2 = value2
export function fn(){...}



//不同名时，彼此之间不会覆盖或者写为  
const key1 = value1
const key2 = value2
function fn(){...}  
export {a,b,fn}   //ES6这种导出方式不同于commonJs的 module.exports = {}方式，es6中这种导出导出并不是一个对象而只是特定的语法	
// export {a:a,b:b,fn:fn} 这种对象写法是错误的。


// 以别名的方式导出
export {
	a as Ba,
    b as Bb,
    fn as Bfn
}




// 模块使用 main.js
import 变量名 form '模块标识'  //这种方式导入的时模块的默认导出成员，如果模块没有导出默认成员的话那么这个变量名对应的值就是 undefined  
                     
import { add } from "./add.js"; //加载模块中的其他成员获得
                     
import * as exportObjName from '模块标识'  //直接将模块内部导出的其他成员放在一个对象内
                     
console.log(add(1, 2)); // 3

````

完整实例：

```
在浏览器端使用：
在html文件中：
<script src='./index.js' type='module'></script>  //需要以服务器方式运行该html文件才可以，如果直接以本地文件得方式打开的化，则会报错。

```

常见的导出方式：

```
方式一：
export const name = 'abc'
export const age = 17
export const fun = function(value){
	....
} 

方式二：统一导出
export {
	name,
	age,
	fun
}

方式三：起别名并导出
export {
	name as fName
	age as fName
	funa as fFun 
}




export default xxx
```

常见的导入方式：

```
方式一：
import { name, age, fun } from './module1.js'


方式二：
import { name as mName, age as mAge, fun as mFun} from './foo.js'


方式三：
import { fName as mName, fName as mAge, fFun as mFun} from './foo.js'


方式四：
import * as foo from './foo.js'




import xxx from './foo.js'
```

export 和 import 的结合使用：

```
export {name, age, fun } from './foo.js'
```

上面export 和 import的结合使用的场景：

- 在开发和封装一个功能仓库的时候，通常希望将暴露的所有接口放在一个文件中，指定统一的接口规范方便阅读





注意：

- 在一个文件或模块中，export 可以有多个，export default 仅有一个，export 类似于具名导出，而 default 类似于导出一个变量名为 default 的变量。同时在 import 的时候，对于 export 的变量，必须要用具名的对象去承接，而对于 default，则可以任意指定变量名。

- es6的模块化语法是不能直接在node.js中使用的，虽然能在工程化项目中看到对应的用法，那是经过配置的结果

  ```
  add.js中
  export const a = 123
  export const b = 345
  
  main.js中
  import {a,b} from './add'
  console.log(add.a);
  
  执行node main.js 后控制台报错  SyntaxError: Cannot use import statement outside a module
  ```

- 错误导出方式：

  - export 123
  - export  num = 123
  - export num 
  - export function (){....}
  - export { key1:key1,key2:key2}
  - export = {key1,key2}




![image-20210718000912979](.\typora-user-images\image-20210718000912979.png)

JS引擎在解析阶段（parsing）是不执行代码的，只进行词法，语法分析，**import关键字导入的模块必须是能在解析阶段就能确定的。**不能再运行阶段有增加新的依赖关系。

import既有关键字 又有import函数。可以使用import的函数实现在代码中动态异步加载js文件。



在commonJs中可以在代码逻辑中动态通过require方法引入其他模块。因为require本质是一个函数，也是在运行阶段执行的。



在脚手架中使用的import方法，在脚手架项目中写的import函数引入的js文件会被webpack解析，webpack会将import方法中单独引入的文件单独打包到一个文件中。在使用时引入。

### ES Module加载过程

![image-20210718005204005](.\typora-user-images\image-20210718005204005.png)





问题：

![image-20210718102342842](.\typora-user-images\image-20210718102342842.png)

在index.js中打印的name是why还是aaaaaa？

答案是：aaaaaa

解析：在ES6的语法中，export导出的看似是对象方式，其实并不是，它导出的就是类似于变量本身（变量的引用）。

![image-20210718103217851](.\typora-user-images\image-20210718103217851.png)





在node.js中使用ES6的模块化规范，在node.js中默认不自动开启识别ES6的模块化规范。如果想让ES6识别js文件中模块化语法的话，有两种方式：

- 在package.json中设置type字段为module

  

- 将js文件使用.mjs扩展名

![image-20210718104011949](.\typora-user-images\image-20210718104011949.png)



在node中用ES6引入其他模块时，要加上文件扩展名。在框架的脚手架中不需要，因为脚手架处理好了。



### CommonJs和ES6区别

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

  - CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

  - ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的`import`有点像 Unix 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

    

- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

  - 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。

  - 编译时加载: ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import`时采用静态命令的形式。即在`import`时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。


CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

### 总结

对于服务端的模块而言，由于其模块都是存储在本地的，模块加载方便，所以通常是采用同步读取文件的方式进行模块加载。而对于浏览器而言，其模块一般是存储在远程网络上的，模块的下载是一个耗时的过程，所以通常是采用动态异步脚本加载的方式加载模块文件。另外，无论是客户端还是服务端的 JavaScript 模块化实现，都会对模块进行缓存，以此减少二次加载的开销。





#### CommonJS和ES6的模块化语法的相互套用情况

![image-20210718105151885](.\typora-user-images\image-20210718105151885.png)







# 开发自己的脚手架工具

类似于webpack这样的工具

其实像vue和react这样的脚手架本质上也是帮助开发者于下载一个已经存在于远端仓库的项目基本结构模板。 



在老师自己写的脚手架工具中，通过脚手架可以像vue脚手架一样安装一个基本项目目录结构。但是该项目对项目vue的配置文件，目录结构和安排都做了进一步的调整，配置好了router和vuex。比如vue项目中的webpack配置文件——vue.config.js:

```js
const path = require('path')
module.exports ={
	configureWebpack:{
		resolve:{
			alias:{
				//'@':path(__dirname,'src'),
				'components':@/components,
				'content':'components/content',
				'common':'components/common',
				'assets':'@assets',
				'services':'@/services',
				'pages':'@/pages'
			}
		}
	}
}
```



在该vue项目中一种比较高阶的写法，就是将路由和对应的组件单独分在了一个组件下面，而并非统一写在了router文件目录下。



![image-20210726092247480](.\typora-user-images\image-20210726092247480.png)



在router的入口文件中：

![image-20210726092903166](.\typora-user-images\image-20210726092903166.png)





**知识点补充**

require.context ( ) 方法

为什么有这个写法：

在项目开发中，经常需要import或者export各种模块，为了简化这种引入或者导出操作就引入了：require.context。

```
项目引入类似模块：
import A from 'components/A'
import B from 'components/B'
import C from 'components/C'
import D from 'components/D'
```

使用require.context：

```
require.context(directory, useSubdirectories, regExp)
```

1. directory: 要查找的文件路径
2. useSubdirectories: 是否查找子目录
3. regExp: 要匹配文件的正则



```
require.context('./components/', true, /\.js$/)
```

```js
类似于require.context源码：

function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};

webpackContext.resolve = webpackContextResolve;
webpackContext.id = "./src/components/test/components sync recursive \\.js$";

module.exports = webpackContext;

```

require.context执行后，返回一个方法webpackContext，这个方法又返回一个__webpack_require__，这个__webpack_require__就相当于require或者import。同时webpackContext还有二个静态方法keys与resolve，一个id属性。

1. keys: 返回匹配成功模块的名字组成的数组
2. resolve: 接受一个参数request，request为test文件夹下面匹配文件的相对路径，返回这个匹配文件相对于整个工程的相对路径
3. id: 执行环境的id，返回的是一个字符串，主要用在module.hot.accept，应该是热加载



```js
const ctx = require.context('./components/', true, /\.js$/)
console.log(ctx.keys())
// ["./A.js", "./B.js", "./C.js", "./D.js"]
```





第一步实现：

在终端窗口中输入自己的指令时能出现相应的提示或者命令

创建项目入口文件：index.js  和 package.json 文件

index.js:

```
#! /usr/bin/env node      //该语句的意思是在当前操作系统的环境变量中找一下 node 程序，并使用node来执行该index.js文件
// shebang
```

```
package.json文件中配置字段：
 "bin":{
 	"myvue":"index.js"
 }
```

完成上面的写法后：

执行 ：npm link   

将该package.json文件中的bin字段中的命令和环境变量进行链接，它会将myvue作为一个终端命令配置到环境变量中。





第二步：

根据命令行不同的指令传参输出不同的语句逻辑

如：webpack --version 输出的是版本号，  webpack --help 输出的是指令详情

这样操作需要借助一个第三方库： commander

npm install commander

在index.js中：

```
#!/user/bin/env node     
const program = require('commander')

program.version(require('./package.json').version [, '-V, --version'])  //该版本号可以从package.json中读取

program.parse(process.argv) 
```











### Buffer

在开发中很少使用js直接去处理图片，音频或者视频。在网页开发中，图片常是交给浏览器处理并显示的。JavaScript或者html 中的img等标签只是告诉浏览器这些资源的地址。由浏览器去获取并处理渲染。

某一个保存的文件并不是使用utf-8进行编码的而是GKB，那开发者在获取到文件文本的二进制数据后，再用GKB字符集转为对应的文字。

读取一张图片数据（二进制），再通过一些手段对图片进行二次处理（裁剪，格式转换，旋转，添加滤镜等），Node中可以借助一个Sharp库读取或者传入图片的Buffer对图片进行处理。

在Node中通过TCP建立长连接，TCP传输的是字节流，需要将数据转成字节在进行传入，并且需要知道传输字节的大小（客户端根据大小来判断读取多少内容）



对前端来说，一般很少操作二进制，对于服务器端为了实现很多功能，必须直接去操作二级制数据。Node环境内置提供了Buffer类，通过Buffer更方便的操作二进制数据。

Buffer结构类似于数组，数组中的每一项都是由8位二进制数字组成的一个字节。buffer可以看作存储二进制的数组。

一位二进制存储的数据是非常有限的。计算机中通常将8位合成一个单元，即一个字节（byte）8bit = 1byte，1kb = 1024byt



```js
字符串转为buufer格式：
方式一： 过时，不再推荐
const  message = 'hello'
const buffer = new Buffer(message)
console.log(buffer)  //打印的是16进制的格式的表示


方式二：
const buffer = Buffer.from(message)

一个中文占三个字节


buffer.toString('utf8')
buffer.toString()


Buffer.alloc(size[,fill[,encoding]])  // 创建一个size个字节的buffer

单独操作buffer实例中的某一位：
buffer[index] 



// 文本文件
const fs = require('fs')
fs.readFile('./test.txt',{encoding:'utf-8'},(error,content)=>{
	console.log(content)  // content是utf-8解码过的内容
})

fs.readFile('./test.txt',(error,content)=>{
	console.log(content)  // content就是buffer，二进制
	console.log(content.toString())   // 默认用utf-8解码
})




//图片文件
const fs = require('fs')
fs.readFile('./bar.png',(error,content)=>{
	console.log(content)  // 图片的二进制文件
})


// Buffer创建时，不会频繁向操作系统申请内存，它会默认先申请一个8*1024字节大小的内存，8kb
```







## http模块

Node.js开发服务器。

![image-20211005165319192](.\typora-user-images\image-20211005165319192.png)



### 创建服务器

方式一：

```js
const http =require('http')

//创建一个web服务器
const serve = http.createServer((request,response)=>{
    response.end('hello server')
    //end('xxxx')等价于下面两行
    //response.write('hello server')
    //response.end( )
})

serve.listen(3000,'localhost',(error)=>{
   console.log('server is running at 3000 port')
})
```

![image-20211005171341936](.\typora-user-images\image-20211005171341936.png)



方式二：

```js
const http =require('http')

const PORT = 3000

const server = new http.Server((request,response)=>{
     response.end('hello server')
})

server.listen(PORT,'localhost',(error)=>{
   console.log('server is running at 3000 port')
})
```

方式一和方式二两者创建服务器的底层源码都是走的一个逻辑。



### 端口号和主机名

![image-20211005171533721](.\typora-user-images\image-20211005171533721.png)





### request对象

该对象中封装的是客户端传递过来的所有信息。

- request.url
- requset.method
- request.headers



get请求的url及其参数：

```js
const http = require('http')
const url = require('url')
const qs = require('querystring')

//创建一个web服务器
const serve = http.createServer((request,response)=>{
    let { pathname, query } = url.parse(request.url)
    if( pathname === '/login' ){
        console.log(qs.parse(query))   //将字符串query转为对象类型
    }
    response.end('hello server')
})

serve.listen(3000,'localhost',(error)=>{
   console.log('server is running at 3000 port')
})
```



post请求请求体参数：

```js
const http = require('http')
const url = require('url')
const qs = require('querystring')

//创建一个web服务器
const serve = http.createServer((request,response)=>{
    let { pathname } = url.parse(request.url)
    if( pathname === '/login' ){
        if(request.method === 'POST'){
            request.setEncoding('utf-8')
            request.on('data', (data)=>{
                const { username, password } = JSON.parse(data)
            })
            request.on('end',()=>{
                console.log('传输结束')
            })
        }
        response.end('hello server')
    }
    
})

serve.listen(3000,'localhost',(error)=>{
   console.log('server is running at 3000 port')
})
```





headers

```js
const http = require('http')
const url = require('url')
const qs = require('querystring')

//创建一个web服务器
const serve = http.createServer((request,response)=>{
 	console.log(request.header)
    response.end('hello server')
})

serve.listen(3000,'localhost',(error)=>{
   console.log('server is running at 3000 port')
})
```



![image-20211005191751215](.\typora-user-images\image-20211005191751215.png)





![image-20211005214210823](.\typora-user-images\image-20211005214210823.png)



content-length:表示本次请求携带的数据的长度。 数据很小时，在一次的data监听事件中就可以拿到所有客户端发送的数据。但如果客户端是进行图片或者视频的上传时，在一次data监听事件中是无法获取到完整的数据的，网络请求会经过多次的上传数据以得到一个完整的数据。当有content-length时就能确定当前数据上传到什么程度。服务器根据已经接收到的data的长度判断上传进度。





### response对象

- response.write( )
- response.end( )



状态码

![image-20211005214826074](.\typora-user-images\image-20211005214826074.png)



- response.statusCode = 404
- response.writeHead (302)



响应头

- response.setHeader ( 'Content-Type', 'text/plain' ) 
- res.writeHead ( 200,{ 'Content-Type':'text/plain' } )



### http模块发送网络请求

http模块除了开发web服务器以外，还可以单独的发起网络请求。

```js
const http = rquire('http')
http.get('url',(response)=>{
    response.on('data',(data)=>{
        console.log(data.toString())
    })
    response.on('end',()=>{
        console.log('服务器返回的响应结束')
    })
})


const request = http.request({
    method:"POST",
    hostname:'localhost',
    port:3000
},(response)=>{
    response.on('data',(data)=>{
        console.log(data.toString())
    })
    response.on('end',()=>{
        console.log('服务器返回的响应结束')
    })
})

request.end()
```



### http模块文件上传



错误做法：

```js
const http = require('http')
const fs = require('fs')

http.createServer((resquest,response)=>{
	if(requset.url === '/upload') {
        if(request.method =='POST'){
            const fileWriter = fs.createWriteStream('./01.png', { flag:'a+' })   //表示在同级目录下生成一个01的png格式的图片，图片的内容来自客户端的数据流。
            request.on('data', (data)=>{
                fileWriter.wirte(data)   //这个data字节流是有问题的，除了图片的所有信息外，还包含图片的其他杂质信息，就导致最后服务器存放的图片不再能正常显示。
            })
            reqest.on('end', ()=>{
                res.end( '文件上传成功')   //
            })
        }
    }	    
}).listen(3000,()=>{
    console.log('server is running at 3000 port')
})
```



````js
const http = require('http')
const fs = require('fs')

http.createServer((resquest,response)=>{
	if(requset.url === '/upload') {
        if(request.method =='POST'){
            const fileWriter = fs.createWriteStream('./01.png', { flag:'a+' })   //表示在同级目录下生成一个01的png格式的图片，图片的内容来自客户端的数据流。
            request.pipe(fileWriter)   //这样存储的数据也是包含除图片外的其他数据的，导致图片无法正常解析显示
        }
    }	    
}).listen(3000,()=>{
    console.log('server is running at 3000 port')
})
````





## express框架

![image-20211005232108375](.\typora-user-images\image-20211005232108375.png)



方式二：

npm init y 

npm install express

```js
const express = require('express')

const app = express()

app.get('/',(req,res,next)=>{
    res.end('hello express')
})

app.post('/',(req,res,next)=>{
    res.end('hello express')
})

app.listen(3000,()=>{
    console.log('server is running at 3000')
})
```



### 中间件

express是一个路由和中间件的Web框架，它本身的功能很少。express应用程序本质上是一系列中间件函数（回调函数）的调用。中间件的本质是一个个传递给express框架的回调函数。这个回调函数接收三个参数：

- 请求对象（request）
- 响应对象（response）
- next函数（在express中定义的用于执行下一个中间件的函数）



中间件的能力：

- 执行开发者写的逻辑代码
- 更改请求对象和响应对象
- 结束请求并返回响应，使用的是res.end( ) 结束请求 
- 调用栈中的下一个中间件





![image-20211005233940700](.\typora-user-images\image-20211005233940700.png)



![image-20211006095738842](.\typora-user-images\image-20211006095738842.png)



全局中间件：

```js
const express = require('express')

const app = express()

//该中间件没有指定任意的请求方式或者路径，所以来自客户端的任何请求都将触发该中间的回调函数,可以注册多个中间件
app.use((req, res, next)=>{
    ......
    res.end()   //调用res.end() 方法与否并不会影响后续中间件的执行，只是单纯意味着结束了本次请求响应的周期，后面的代码包括next函数将会继续执行  
    next()
})

app.use((req, res, next)=>{
    ......
    next()
    res.end()  //这样书写系统会报错，因为前面已经结束了请求响应
})

app.use((req, res, next)=>{
    ......
    res.end()
})


app.listen(3000,()=>{
    console.log('server is running at 3000')
})
```



路径匹配中间件：

```js
const express = require('express')

const app = express()

//对应的login路径不论什么请求否是都可以匹配到
app.use('/login',(req, res, next)=>{
    ......
    next()
})

app.use((req, res, next)=>{   //一样可以运行
    ......
	next()
})

app.use('/login',(req, res, next)=>{
    ......
})

app.listen(3000,()=>{
    console.log('server is running at 3000')
})
```



路径与方法组合中间件:

```js
const express = require('express')

const app = express()

app.use((req, res, next)=>{   //一样可以运行
    ......
	next()
})

app.get('/home',(req, res, next)=>{
    .....
})

app.listen(3000,()=>{
    console.log('server is running at 3000')
})
```



连续注册中间件：

```js
const express = require('express')

const app = express()

app.use((req, res, next)=>{   //一样可以运行
    ......
	next()
})

app.get('/home',(req, res, next)=>{
    .....
    next()
},(req, res, next)=>{
    .....
    next()
},(req, res, next)=>{
    .....
    next()
},(req, res, next)=>{
    .....
    next()
},(req, res, next)=>{
    .....
    res.end()
})

app.listen(3000,()=>{
    console.log('server is running at 3000')
})
```





中间件的应用：

![image-20211006105009423](.\typora-user-images\image-20211006105009423.png)

```js
const express = require('express')

const app = express()


app.use((req, res, next)=>{
    if(req.headers['content-type'] === 'application/json'){   //专门解析json格式的数据
        req.on('data',(data)=>{
            let info = JSON.parse(data.toString())
            // 如何将info数据传递给下一个中间件
            //next(info) 这种写法是错误的，next函数不能接收任何参数，一旦接收了则表示有错误存在
            req.body += info
        })
        req.on('end', ()=>{
            next()
        })
    }else{
        next()
    }
})


app.post('/login',(req, res, next)=>{
    let info = req.body   //这就是上一个中间件处理后的客户端结果
	res.end()
})

app.post('/product',(req, res, next)=>{
    let info = req.body   //这就是上一个中间件处理后的客户端结果
    res.end()
})

/*app.post('/login',(req, res, next)=>{
    req.on('data',(data)=>{
        let info = data.toString()
    })
    req.on('end', ()=>{
        res.end()
    })
})

app.post('/product',(req, res, next)=>{
    req.on('data',(data)=>{
        let info = data.toString()
    })
    req.on('end', ()=>{
        res.end()
    })
})*/

//上面的两个中间件中都写了同样得逻辑任务，所以就可以转为一个中间件来对传给服务器的json数据进行解析

app.listen(3000,()=>{
    console.log('server is running at 3000')
})
```





![image-20211006105115936](.\typora-user-images\image-20211006105115936.png) 



第三方库：body-parser 就是专门用于处理各种来自客户端数据格式的中间件库。该库在express3.x时内置到express框架中；在express4.x时被分离出去；在express4.16.x以后，express内部内置了类似body-parser库的功能模块。



```js
app.use((req, res, next)=>{
    if(req.headers['Content-Type'] === 'application/json'){   //专门解析json格式的数据
        req.on('data',(data)=>{
            let info = JSON.parse(data.toString())
            // 如何将info数据传递给下一个中间件
            //next(info) 这种写法是错误的，next函数不能接收任何参数，一旦接收了则表示有错误存在
            req.body += info
        })
        req.on('end', ()=>{
            next()
        })
    }else{
        next()
    }
})

上面的代码等价于：

app.use(express.json())  //解析后的数据任然是放在请求体中，以方便后续的中间件中能通过req.body获取到



其他：
app.use(express.urlencoding({extended:true}))  //extended的值有true 或 false，为true表示解析 urlencoding时使用第三方的一个叫qs的库；  为false时表示使用Node.js内置的querystring库进行解析
```



针对form-data格式数据（图片上传）的解析：

依赖express官方开发的第三方库——multer

```js
const multer = require('multer')

app.use(express.json())
app.use(express.urlencoding({extended:true}))

const upload = multer()

   //如果客户端传的时key：value类型而不是文件，用any方法，该any方法永远不要用于全局中间件


app.post('/product',upload.any()，(req, res, next)=>{
	    
})
```

form-data上传文件的解析：

文件上传后端必须要将上传的文件存储到后端的本地。一般文件上传在后端都有一个单独的接口。

```js
.....

//创建multer实例对象时，传递一个上传文件存放在本地的目录路径参数
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads/')
    },
    filename:(req,file,callback)=>{
        callback(null, 自定义上传文件名)
    }
})
const upload = multer({  
    // dest:'./uploads/'   这样做后上传的文件没有具体的名字和后缀
    storage
})
app.use(upload.any())

//文件上传接口;upload.single:表示一次上传一个文件； upload.array:表示一次上传了多个文件
app.post('/upload',upload.single,(req,res,next)=>{
    let fileInfo = req.files[0]  //客户端上传的文件的信息
})


.....
```

 











