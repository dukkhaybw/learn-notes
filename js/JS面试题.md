# JS 面试题

### JS 是什么

1. JavaScript 是一门**脚本语言**。可以在**网页**上实现复杂的功能，包括操作页面中的 DOM 元素、CSS 样式，地图，动画等等。

2. JavaScript 是**弱类型语言**。这意味着**变量可以被隐式地转换为另一个类型**。

   二元运算符 + 会把两个操作数转换为字符串，除非两个操作数都为数字类型。

   二元操作符 - 会把两个操作数转换为数字类型。

   一元操作符，包括 + 和 -，都会把操作数转换为数字。

3. JavaScript 是**动态类型的语言**，变量存放的数据的类型不固定

4. JavaScript 是**单线程的语言** JavaScript 需要和页面进行交互，操作 DOM 等，如果是多线程的话，会带来很复杂的同步问题。假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？所以这决定了它只能是单线程。
5. JavaScript 是基于**面向对象的语言**

### 互联网工作原理

当用户的电脑接入互联网后，用户电脑将获得一个 IP 地址，远端服务器在接入互联网后也将分配一个 IP 地址。（客户端是面向用户的应用程序；服务端是在远程计算机上运行的应用程序。）客户端可以在需要时和服务端通过互联网进行通信。客户端在发送请求给远端服务器之前，需要用到 TCP/IP 协议族建立连接。

TCP/IP 协议族分为五层：

- 应用层：提供特定于应用程序的协议 HTTP FTP IMAP(邮件)，数据在应用层准备好还不一定能发出，需要下层先成功地建立连接。
- TCP 传输控制层 ：发送数据包到计算机上使用特定的端口号的应用程序
- IP 网络层： 使用 IP 地址将数据包发送到特定的计算机上
- 链路层：将二进制数据包与网络信号相互之间转换
- 物理层

网络协议通过分层来明确每一层的职责，通过定义明确的接口来协同工作，上层可以使用下层提供的功能，而不必关注各个层之间如何实现。

### 一次完整的数据交互

 客户端在发出 http 请求以获取某个页面文件时，先通过 IP 地址去寻找到远端的服务器地址，然后，再通过 TCP 进行三次握手，成功建立连接，这时应用层数据可以开始通信了，应用层消息在发送前被分为许多数据包片段，通过应用层进入 TCP 传输控制层后，每个数据包会分配一个源端口号和目标端口号，端口号用来确定目标计算机上的哪一个应用程序要接收并使用该数据包。再由 TCP 传输控制层进入 IP 网络层后，每个数据包将会被附上本机 IP 地址和目标计算机的 IP 地址（数据包）以及 MAC 地址（数据帧）。有了 IP 地址和端口号之后，链路层将数据包的文本信息转义为电子信号 ，然后通过电缆传输，在电缆的另一端的路由器检查每个数据包的目标地址，并确定发送至何处（期间 MAC 地址不断更新）。最终数据包到达远端服务器，然后从 TCP/IP 协议族的底部开始往上运行，当数据包向上通过协议族时客户端添加的所有路由数据，如 IP 地址、端口号都将从数据包中剥离，当数据到达栈顶时，数据包已经可以重新恢复成最初的形式，通过端口号，可以将数据传递给当前服务器监听该端口号的应用程序，应用程序根据当前请求的数据做出反应。并将响应数据通过刚才的方式返回给客户端，之后就是浏览器自身的任务处理了。

 TCP 是一种**面向连接**的**可靠**字节流服务协议，TCP 必须先经过 3 次握手建立连接之后才能交换数据。某一方每收到的一个数据包（或者建立连接时用的握手包）都会向发送方发送 ack 确认，以确保发送成功与接收成功。三次握手完成之后，双方的操作系统才会开辟资源为对方服务。

 IP 是不可靠的无连接协议，它并不关心数据包是否到达目的地，也不关心连接和端口号，它的工作是发送数据包并将其路由到目标计算机，其中每个数据包都是独立的，所以有可能会乱序到达目标地址或者在传输途中丢失。

 为了保证数据包到达和顺序正确，这都是由 TCP 来控制的，当数据包过大时，在 IP 层会进行分包。由于各个数据包在物理链路层走的物理链路不一样，传输速度也不一样，导致数据包没有按照顺序到达目的地，但是 TCP 会根据数据包上携带的序列号来进行排序重组，并且发送发在一个特定的时间内没有接收到到接收数据包方的 ack 确认时，则发送方会重新传送该数据包。

DNS：

 DNS（Domain Name Server）：域名服务器

 作用:将域名和对应的 ip 互相转换

 特点：DNS 中保存着域名和 ip 地址的表，一个域名可以对应一个 IP 地址，一个 IP 地址可以对应多个域名。

 gTLD(generic Top-Level DNS Server)：顶级域名服务器。为所有的.com、.net、.org 后缀做域名解析服务。

 DNS 解析过程:

 url => 本地 DNS 服务器（ISP 提供）查询是否有，有则返回，没有则继续后面的内容 => 访问根服务器（顶级域名服务器） ，解析 ulr 是从右到左解析的，(.cn=>.com=>一级域名=>二级域名）

IP：

internet Protocol Address（互联网协议地址，IP 地址）

分配给用户上网使用的互联网协议

ipv4 是四组十进制数字，ipv6 是八组十六进制数字

端口号：服务器中的不用应用程序。

TCP：

Transmission Control Protocol :传输控制协议

TCP/IP 协议族：提供了点对点的连接机制，制定了数据的封装，定位，传输，路由数据接收的标准。

UDP：

User Data Protocol：用户数据协议

特点：面向无连接

www:是指用浏览器访问页面的服务，所以网站的主页的域名以前常常加入 www 这个二级域名，现在的二级域名往往对应着不同的业务，而不同的业务由同一个公司的多台服务器分别处理。

`htttp://qq.com`:一级域名

`htttp://www.qq.com`:二级域名

`htttp://xxxx.xxxx.qq.com`:三级域名

### 互联网的组成

 客户端电脑通过调制解调器 modem（猫），将计算机的数字信号翻译为可沿普通电话线传送的模拟信号后，在公共电话网络进行网络传输，公共电话网络通过连接 ISP（网络服务提供商）来接入互联网。数据包经过电话网络和 ISP 后，它们将路由到 ISP 的主干网络，数据包通常会从此经过多个路由器，并经过多个主干网络直到找到目的地，互联网骨干网由许多相互连接的大型网络组成。这些大型网络被称为网络服务提供商（NSP）。NSP 是为 ISP 提供网络主干服务的公司，ISP 可以从 NSP 那里批量购入带宽，为客户提供网络接入服务，NSP 网络通过网络访问点 NAP 相连来交换数据包流量，每个 NSP 都必须至少连接到三个网络访问点（NAP），数据包流量可能会通过 NAP，从一个 NSP 的主干跳到另一个 NSP 的主干。

### 互联网正确传数据包的过程（通过 IP 地址访问）

 在互联网中有一种特殊的计算器---路由器， 它有一个路由表，记录了其子网络上的所有 IP 地址，但它并不知道上层网络所包含的 IP 地址，当数据包到达路由器，路由器检查路由表中是否有目的地的 ip 地址，如果有则直接发送给那个网络，否则就向上层发送数据，在更高的层级去寻找拥有该 IP 的路由器，如果依然没有找到，则再次往上发送 ，直到到达 NSP 主干网为止，连接到 NSP 骨干网的路由器拥有最大的路由表，通过这张表可以可以将数据包路由到正确的骨干网，然后开始向下传播，进入越来越小的网络，直到找到目的地为止，这样就访问到了远端服务器。

### 互联网正传数据包的过程（通过域名访问）

浏览器通过 DNS(一个分布式数据库，它记录的域名和 IP 地址的对应关系)，在浏览器中输入网址时，浏览器首先连接 DNS 服务器，获取到该域名的 IP 地址后，浏览器再连接访问该 IP 的服务器，有了 DNS 后，之后服务器的 IP 地址发生变化，只需要重新绑定一下域名和新 IP 地址就可以了。

### 浏览器

浏览器在接收到服务器返回数据后到呈现在页面上这个过程中的操作。

 浏览器是运行在操作系统上的一个应用程序，每个应用程序必须**至少**启动一个进程来执行其功能。那一个程序往往需要运行很多任务，那进程就会创建一些线程来帮助它去执行这些细小的任务。

 **进程**是操作系统进行资源分配和调度的基本单元，可以申请和拥有计算机资源，进程是程序的基本执行实体。

 **线程**是操作系统 CPU 能够进行运算调度的最小单位，一个进程中可以并发多个线程，每条线程并行执行不同的任务。

 当启动一个程序时，操作系统会为该程序创建进程并分配内存空间，该应用程序的状态都保存在该内存空间里。当应用关闭时，该内存空间就会被回收。**进程可以启动更多的进程来执行任务**，由于每个进程分配的内存空间是独立的，如果两个进程间需要传递某些数据，则需要通过进程间通信管道 IPC 来传递。很多应用程序都是多进程的结构，这样是为了避免某一个进程卡死，由于进程间相互独立，这样不会影响到整个应用程序。进程可以将任务分成多个更细小的任务，然后通过创建多个线程，并行执行不同的任务。同一进程下的线程之间是可以直接通信共享数据的。现在的浏览器是一个多进程结构。

![img](https://i0.hdslb.com/bfs/article/80942859bb7b6928c88f20f732f3a5e0d85f317a.png@1320w_702h.webp)

#### 简化的浏览器结构：

- 用户界面：用于展示除标签页窗口之外的其他用户界面内容，地址栏，前进与后退按钮书签菜单等

- 浏览器引擎：用于在用户界面和渲染引擎之间传递数据

  - 数据存储持久层：帮助浏览器保存各种数据，如：cookie

- 渲染引擎（浏览器内核、UI 线程）：负责渲染用户请求的页面内容（渲染引擎下面还有很多小的功能模块）
  - 网络请求模块：负责网络请求
  - js 解析器：解析执行 js 代码
- 数据存储

![浏览器简化结构图](https://i0.hdslb.com/bfs/article/2f3b7cce7785b70f308c6093616eefc05e002caf.jpg@1320w_892h.webp)

#### 浏览器中线程：

- js 线程
- UI 线程
- 浏览器事件触发线程
- 定时触发器线程
- 异步 HTTP 请求线程
- .....

**渲染引擎（浏览器内核）：**IE 使用的 Trident，Firefox 是 Gecko，Sarafi 使用的 webkit，Chrome 是使用的基于 webkit 改造优化的 Blink 渲染引擎，Opera 和 Edge 也是使用的 Blink。

**常见的 JavaScript 引擎：**SpiderMonkey: fireFox ；Chakra: ie ；JavaScriptCore：webkit ；V8：Chrome

![image-20210717152837153](..\typora-user-images\image-20210717152837153.png)



**JavaScript 引擎和浏览器内核之间的关系：**

浏览器内核一般由两部分组成：

负责解析 html，css，布局和渲染部分

负责解析和执行 JavaScript 部分

v8 引擎是使用 c++，c 和 JavaScript 编写的。它实现了 ECMAScript 和 WebAssembly。

v8 内部执行 JavaScript 代码的流程：

![image-20210717154201378](..\typora-user-images\image-20210717154201378.png)

上图中的 parse 模块会将 JavaScript 代码转为 AST（抽象语法树），因为 lgnition(解释器)不能直接识别 JavaScript 代码。

- 注意点：如果函数没有被调用，那么是不会被转为 AST 的

ignition 解释器会将 AST 转为 ByteCode（字节码），同时会收集 TurboFan 优化所需要的信息（比如函数形参的数据类型），如果函数值调用了一次的话，ignition 只会解析执行为 ByteCode。所以一个函数被多次调用时才会做优化，所以开发者在使用函数时，注意保持传参的多次一致性可以提高编译速度。

TurboFan 是一个编译器，可以将 ByteCode 编译为 CPU 可以直接执行的机器语言。如果一个函数被多次调用时，那么该函数就会被标记为热点函数，然后经过 TurboFan 转换成优化过的机器码，提高代码的执行性能。

![image-20210717155854314](..\typora-user-images\image-20210717155854314.png)

还有一个模块是负责内存回收的——Orinoco。

早期的浏览器并不是多进程的结构，而是个单进程结构。

 一个进程中大概有页面线程负责页面渲染和展示等，JavaScript 线程执行 js 代码，还有其他各种线程。单进程的结构引发了很多的问题。

 一是不稳定，其中一个线程的卡死可能会导致整个进程出问题，比如你打开多个标签页，有一个标签页卡死，可能会导致整个浏览器无法正常运行；

 二是不安全，线程之间是可以共享数据，那 js 线程岂不是可以随意访问进程内的数据；

 三是不流畅，一个进程需要负责太多事情，会导致运行效率的问题。

现代浏览器都是一个多进程结构（根据进程功能不同来拆解浏览器）：

<img src="https://i0.hdslb.com/bfs/article/a866edf0f607820915960d2233987c7d965529c2.png@1320w_694h.webp" alt="img" style="zoom: 67%;" />

- 浏览器进程：浏览器进程负责与浏览器的其他进程协调工作。想成一个工厂里的主管，用来协调各个进程部门。
- 网络进程：负责发起接受网络请求
- GPU 进程：负责图形渲染
- 插件进程：负责控制网站使用的所有插件，例如 Flash。这里插件并不是指的是 Chrome 市场里安装的扩展
- 渲染器进程：用来控制显示 tab 标签内的所有内容，浏览器在默认情况下会为每个标签页都创建一个进程，这和你启动 chrome 时选择的进程模型有关。

### 浏览器工作原理（浏览器是如何渲染页面）

1. 在浏览器地址栏输入地址，**浏览器进程** 的 **UI 线程** 会捕捉输入内容，如果访问的是网址，则 UI 线程会启动一个 **网络线程** 来请求 DNS 进行域名解析接着开始连接服务器获取数据。如果你的输入不是网址而是一串关键词，浏览器就会知道你是要搜索，于是就会使用你默认配置的搜索引擎来查询。
2. 网络线程走互联网获取到数据后，会通过 SafeBrowsing 来检查该站点的是否是恶意站点。如果是则会展示个警告页面，告诉你这个站点有安全问题，浏览器会阻止你的访问。当然你也可以强行继续访问。SafeBrowsing 是谷歌内部的一套站点安全系统，通过检测该站点的数据来判断是否安全。比如通过查看该站点的 ip 是否在他们的黑名单内。
3. 当返回数据准备完毕并且安全校验通过，**网络线程** 会通知 **UI 线程**，然后 UI 线程 会创建一个 **渲染器进程** 来渲染页面。浏览器进程通过 IPC 管道将数据传递给渲染器进程，正式进入渲染流程。
4. 此时地址栏的状态更新，比如 histroy 更新，现在可以点击导航栏的后退。**渲染器进程** 收到的数据，也就是 html。渲染器进程的核心任务就是把 html、js、css、img 等资源渲染成用户可交互的 web 页面。
5. 渲染器进程的主线程将 html 解析，构造 dom 数据结构，
   - HTML 经过 Tokeniser 标记化，通过词法分析，将输入 html 内容解析成多个标记
   - 根据识别后的标记进行 DOM 树构造, 在 DOM 树构造过程中会创建 Document 对象，然后以 Document 为根节点的 DOM 树不断进行修改，向其中添加各种元素。
   - HTML 代码中往往会引入一些额外的资源，比如图片，css 和 js 脚本等。图片和 css 这些资源需要通过网络下载或者从缓存中直接加载。这些资源不会阻塞 html 的解析，因为他们不会影响 DOM 的生成，但当 html 解析过程中遇到 script 标签，将停止 html 解析流程，转而去加载解析并且执行 js。为什么不直接跳过 js 的加载和执行这一过程，等 html 解析完后再加载运行 js 呢？这是因为，浏览器不知道 js 的执行是否会改变当前页面的 html 的结构，如果 js 代码了调用 document.write 方法来修改 html，那之前的 html 的解析就没有任何意义了。这也就是为什么我们一直说要把 script 标签要放在合适的位置，或者使用 async 或 defer 属性来异步加载执行 js。
6. html 解析完成后，获得一个 dom tree，但还不直到 dom tree 上每个节点的样式，主线程解析 CSS 并确定每个 DOM 节点的计算样式
7. 通过遍历 DOM tree 和计算好的样式，生成 layout tree，layout tree 上的每个节点都标记了 x，y 坐标和边框尺寸
   - 这里需要注意的一点是 DOM Tree 和 layout tree 并不是一一对应的
   - 设置了 display:none 的节点不会出现在 layout tree 上
   - 在 before 伪类中添加了 content 值的元素，content 的内容会出现在 layout tree,不会出现在 DOM 树里
   - 因为 DOM 是通过 html 解析获得，并不关心样式。而 layout tree 是根据 dom tree 和计算好的样式来生成，layout tree 是和最后展示在屏幕上的的节点是对应的。
8. 现在我们已经知道元素的大小，形状和位置，这还不够，我们还需要做什么了呢。还需要知道以什么样的顺序绘制各个节点。举例来说，z-index 这个属性会影响节点绘制的层级关系。如果我们按照 dom 的层级结构来绘制页面，则会导致错误的渲染。为了保证在屏幕上展示正确的层级，在绘制阶段，主线程遍历 layout tree 创建一个绘制记录表，该表记录了绘制的顺序。
   - 现在知道了文档的绘制顺序，到了该把这些信息转化成像素点显示在屏幕的时候了。那这种行为，被称为 rasterizing,栅格化。现在的 Chrome 使用了一种更复杂的栅格化流程，叫做 compositing 组合。Compositing 是一种将页面的各个部分分成多个图层，分别对其进行栅格化并在合成器线程 compositor thread 的单独线程中进行合成页面的技术。简单来说就是，页面所有的元素按照某种规则进行分图层，并把图层都栅格化好了，然后只需要把可视区的内容组合成一帧展示给用户即可。
9. 主线程遍历 layout tree 生成 layer tree。当 layer tree 生成完毕和绘制顺序确定后，主线程将这些信息传递给 compositor 线程。合成器线程将每个图层栅格化。一层可能像页面的整个长度一样大，因此合成器线程将它们切分为多个图块，然后将每个图块发送给栅格线程。栅格线程栅格化每个图块并将它们存储在 GPU 内存中。对图块进行栅格化后。合成器线程可以给不同的栅格线程分别优先级，比如栅格化可视区域图块的栅格线程优先处理。当图块栅格化完成后，合成器线程将收集称为“draw quads”的图块信息，这些信息里记录了包含诸如图块在内存中的位置和在页面的哪个位置绘制图块的信息。根据这些数据合成器线程生成了一个合成器 Frame。然后这个合成器 frame 通过 IPC 传送给浏览器进程，接着浏览器进程将 compositor frame 传到 GPU，然后 GPU 渲染展示到屏幕上。当你的页面然后变化，比如你滚动了当前页面，则会生成一个新的 compositor frame，新的 frame 再传给 GPU。再次渲染到屏幕上。

上述流程的总结：

 浏览器进程的网络线程请求获取到 html 数据和通过 IPC 将数据传给渲染器进程的主线程，主线程将 html 解析成构造 DOM 树，然后计算样式，根据 DOM 树和样式生成 layout Tree，通过遍历 layout tree 生成绘制顺序表和 layer tree，然后主线程将 layer Tree 和 绘制顺序信息 一起传给合成器线程，合成器线程按规则进程分图层，并把图层分为更小的图块传给栅格线程进行栅格化，栅格化完成后，合成器线程会获得栅格线程传过来的"draw quads"图块信息，根据这些信息，合成器线程合成了一个 frame（合成器帧），然后将该合成 frame 通过 IPC 传回给浏览器进程，浏览器进程在传到 GPU 进行渲染，最后就展示到你的屏幕上了。当页面发生变化，如滚动了当前页面，则会生成一个新的合成器帧，新的合成器帧再转给 GPU，再次渲染到屏幕上。



 **重绘与重排（回流）**

 **当我们改变一个尺寸、位置或隐藏显示等属性时，会重新进行样式计算，布局，绘制，以及后面的所有流程。这种行为我们称为重排。当我们改变某个元 素的颜色属性时，不会重新触发布局，但还是触发会样式计算和绘制，这个就是重绘。我们可以发现重排和重绘会占用主线程，还有一个东西的运行也是在主线程，js，既然他们都是在主线程运行，就会出现抢占执行时间的问题。**

 重排必定引发重绘，反之不一定。

 table 及其内部元素可能需要多次计算才能确定好其在渲染树中节点的属性，比同等元素要花费的时间更多，所以要尽量避免使用 table 布局页面。

<img src="..\typora-user-images\image-20210224095253834.png" alt="image-20210224095253834" style="zoom: 50%;" />

<img src="..\typora-user-images\image-20210224095403333.png" alt="image-20210224095403333" style="zoom:50%;" />

 重排的常见操作：

- 页面初始化渲染

- 添加或者删除可见 DOM

- 元素位置的改变，使用动画

- 改变元素尺寸——大小，外边框，外边距

- 浏览器窗口尺寸的改变

- 填充内容的改变，如文本的改变引起的计算值宽度或高度的改变

- 读取某些元素属性：offsetLeft / top / Height / Width 等

  重绘重排的代价：耗时，耗性能。

 如果你们写了个不断导致重绘重排的动画，浏览器则需要在每一帧都会运行样式计算、布局和绘制的操作，我们知道当页面以每秒大于 60 帧的刷新率，才不会让用户感觉到页面卡顿。

 如果你在运行动画时，还有大量的 js 任务需要执行，因为布局绘制和 js 的执行都是在主线程运行的，当在一帧的时间内，布局和绘制结束后，还有剩余时间，js 就会拿到主线程的使用权，如果 js 执行时间过长就会导致在下一帧开始时，js 没有及时归还主线程，导致下一帧动画没有按时渲染，就会出现页面动画的卡顿。

<img src="..\typora-user-images\image-20210224094544390.png" alt="image-20210224094544390" style="zoom: 67%;" />

**针对重绘和重排的优化手段：**

- 针对动画，第一种就是可以通过 requestAnimationFrame 这个 api 来帮助我们解决这个问题。requestAnimationFrame 这个方法会在每一帧被调用，通过这个 api 的回调参数，我们可以知道每一帧当前还剩余的，我们可以把 js 运行任务分成一些小块，在时间用完前，归还主线程，react 最新的渲染引擎 react fiber 就是用到了这个 api 来做了很多优化，后面我也会出一期视频专门来讲 React 的最新渲染引擎 React Fiber。

<img src="..\typora-user-images\image-20210224095452461.png" alt="image-20210224095452461" style="zoom:50%;" />

- 第二个优化方法，我们知道栅格化整个流程是不占用主线程的，只在合成器和栅格线程中运行，这就意味着它无需和 js 抢夺的主线程。刚才提到，如果我们反复重绘和重排，可能会导致掉帧，因为有可能会有 js 的执行阻塞了主线程。css 中有个动画属性叫 transform，通过该属性实现的动画，不会经过布局和绘制，而是直接运行在 Compositor 和 rasterizing 线程中，所以不会受到主线程中 js 执行的影响。更重要的是 transform 的动画，由于不需要经过布局绘制样式计算，所以节省了很多运算时间。可以让复杂的动画更加流畅。位置变化，宽高变化，那这些都可以使用 transform 来代替。

  <img src="..\typora-user-images\image-20210224095555676.png" alt="image-20210224095555676" style="zoom:50%;" />

- 浏览器自己会维护一个队列，用于存放引起回流与重绘的操作，在操作达到一定时间或者一定时间间隔，一次性批量处理。

- 开发者可以合并多次操作和样式修 改，如使用 DocumentFragment 片段

```javascript
let frag = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  let li = document.createElemnt('li');
  li.innerText = '这是：' + i;
  frag.appendChild(li);
}
document.body.appendChild(frag);
```

### JavaScript 运行原理

js 是如何被编译的、v8 引擎的原理、事件循环与异步回调、垃圾收集

代码编译角度看计算机如何运行 js 代码：

低级语言（偏向直接操作硬件）：执行熟读快、难编写代码、兼容性差

高级语言（偏向利于人类阅读和编写的语言）：简单，方便阅读书写，抽象，越高级执行效率越差

用高级语言转为低级语言来间接的控制硬件。

JavaScript 借鉴了 C 语言的基本语法，Java 的数据类型和内存管理，Scheme 语言的函数式编程(将函数提升至第一等公民)，self 语言的原型链的继承机制。JavaScript 是函数式编程和面向对象编程的结合。

JavaScript 是一门**动态类型**的语言，在用 js 定义一个变量时是完全不用关系它的类型的，用 var 声明一个变量，然后给该变量赋任何类型的数据值，在静态类型的语言中必须提前声明变量的类型并且赋正确的值，对于引用类型的数据，在 js 中可以在声明赋值以后，再随意的增删内部的属性。对于编译器来说，源代码中提供的信息太少，js 的语言特性让编译器没办法在运行前知道变量的类型，只有在运行期间才能确定各个变量的类型，这就导致 js 无法在运行前编译出更加迅速的，低级的语言代码。js 虽然是动态类型的语言，但它执行起来依然很快，尤其是在启动时，基本瞬间完成。

现代 js 引擎都使用了一项技术：运行时编译（Just-In-Time Compilation），JIT 在运行阶段生成机器代码，而不是提前生成，JIT 把代码的生成机器代码和运行结合在一起。在运行阶段，收集类型信息，然后根据这些信息编译生成机器代码，之后再运行这些机器码。与运行时编译对应的是预编译（Ahead Of Time）。js 作为一门高级语言在被 cpu 执行前，要先通过**JavaScript 引擎**（程序）将它转化为机器语言并执行。 js 有许多执行引擎，chrome 的 v8，webkit 使用的 JavaScriptCore，Firefox 的 SpiderMonkey，QuicksJS 和 React Native 中使用的 Hermes。

 各引擎在编译 js 代码是过程差不多，先将 js 代码通过解析器，解析成抽象语法树（AST），再通过解释器将 AST 编译成为字节码（bytecode，一种跨平台的中间表示，不同于最终的机器码，字节码与平台无关，能在不同操作系统上运行），字节码最后通过编译器生成机器代码，由于不同平台使用的机器代码会有差异，所以编译器会根据当前的平台来编译出响应的机器代码（汇编代码）。

![image-20210913005756173](..\typora-user-images\image-20210913005756173.png)

### js 引擎如何编译 js 代码和优化 js 代码

 V8 引擎是一个接收 JavaScript 代码编译代码然后执行的 C++程序，编译后的代码可以运行在多种操作系统处理器上。V8 的主要工作：编译与执行 js 代码，处理调用栈（call stack），内存分配（heap memory），垃圾回收（GC）。

 V8 如何编译执行 js 代码：

 在编译和执行时，用到三个重要组件：解析器（parser），解释器（interpreter）和编译器（compiler）

![image-20210913010208306](..\typora-user-images\image-20210913010208306.png)

 解析器负责将 js 源码解析成抽象语法树（AST），解释器负责 AST 编译成为字节码并执行，编译器负责生成机器代码。

 在早期 V8 引擎（5.9 版本以前），V8 引擎没有解释器，却有两个编译器，它的编译流程是：解析器负责将 js 源码解析成抽象语法树（AST），然后由 Full-codegen 编译器直接使用 AST 来编译出机器代码（基准的，未被优化的机器代码），而不进行中间转换，Full-codegen 编译器又称为基准编译器，用它生成的是一个基准的未被优化的机器代码，这样做的好处是当第一次执行 js 时，就是直接使用了高效的机器代码，因为没有中间的字节码产生，所以就不需要解释器。当代码运行一段时间后，v8 引擎中的分析线程收集了足够多的数据来帮助另一个编译器 Crankshaft 来做代码优化，然后需要优化的代码重新解析生成 AST，然后 Crankshaft 使用生成好的 AST 再生成优化后的机器代码来提升运行的效率，所以 Crankshaft 的编译器又被称为优化编译器。这样设计的初衷是好的，减少了抽象语法树到字节码的转换时间，提高 web 浏览器中 js 的执行性能。但是这样的架构设计也带来的一些问题：1. 生成的机器码会占用大量的内存。 2. 缺少中间层的字节码，很多性能优化策略无法实施，导致 V8 性能提升缓慢。 3.之前的编译器无法很好的支持和优化新的 js 语法。

为了解决上述问题，V8 团队用了三年半的时间开发了一套新的 V8 架构。

![image-20210913011346340](.\typora-user-images\image-20210913011346340.png)

![image-20210913010831509](.\typora-user-images\image-20210913010831509.png)

新的 V8 架构：

![image-20210913011451853](.\typora-user-images\image-20210913011451853.png)

![image-20210913011723685](.\typora-user-images\image-20210913011723685.png)

![image-20210913012056189](.\typora-user-images\image-20210913012056189.png)

但是在获得抽象语法树之后，V8 引擎加入了解释器 Ignition，语法树通过解释器 Ignition 生成 bytecode 字节码，此时 AST 就被清除了以释放内存空间，生成的字节码（bytecode）直接被解释器执行，同时生成的 bytecode 将作为基准执行模型。字节码更加简洁，生成的字节码大小相当于等效的基准机器代码的 25%到 50%左右。在代码的不断运行过程中，解释器收集到了很多的可以用来优化代码的信息，比如变量的类型，哪些函数执行的频率较高，这些信息被发送给编译器，v8 引擎新的编译器 TurboFan 会根据这些信息和字节码来编译出经过优化后的机器代码。

![image-20210913012237025](.\typora-user-images\image-20210913012237025.png)

扩展几个 V8 引擎在处理 js 过程中的一些优化策略：

- 如果函数只是声明却没有被调用时，则该函数不会被解析生成 AST，也就不会生成字节码
- 如果函数只被调用一次，则 Ignition 生成的字节码后，就直接被解释执行了，TurboFan 不会进行优化编译，因为 TurboFan 需要 Ignition 收集函数执行时的类型信息，这就要求函数至少执行大于一次，TurboFan 才能进行优化编译
- 如果函数被调用多次则它有可能会被识别为热点函数，当 Ignition 解释器收集的类型信息确定后这时 TurboFan 则会将字节码编译为优化后的机器代码，以提高代码的执行性能，之后执行这个函数时，就直接运行优化后的机器代码，所以整体来说，就是处于一个运行字节码和优化的机器代码共存的一个状态。

随着 js 源码不断被执行会有更多的源码被标记为热点代码，也就会产生更多的机器代码，这里要注意的是，在某些情况下 ，优化后的机器代码可能会被逆向还原为字节码。这个过程叫做 deoptimization。这是因为 js 是一门动态类型的语言，会导致一个 Ignition 收集到的信息是错误的，比如有一个函数 sum,在函数声明时，js 引擎并不知道参数 x，y 是什么类型的，但是在后面的多次调用中，传入的 x,y 都是整型，sum 函数被识别为热点函数，解释器将收集到的类型信息和该函数对应的字节码发送给编译器，于是编译器生成优化后的机器代码中就假定 sum 函数的参数 x，y 都是整型，之后再遇到该函数的调用就直接使用运行速度更快的机器代码，如果此时你调用 sum 函数传入了字符串，机器代码不知道如何处理字符串的参数，于是就需要进行 deoptimization（回退字节码），由解释器来解释执行

```
function (x,y){
	return x+y
}
```

所以说我们尽量不要把一个变量类型变来变去，对传入函数的参数的类型也是最好固定，否则会给 V8 引擎带来一些影响，会损失一点性能。

![image-20210913013122983](.\typora-user-images\image-20210913013122983.png)

![image-20210913013836411](.\typora-user-images\image-20210913013836411.png)

新的架构除了解决上面说到 3 个问题，还带来了一些好处：

- 由于不需要一开始就直接编译 js 源码为机器代码，而是生成了中间层的字节码，字节码的生成速度远远大于机器码的生成速度，所以网页初始化解析执行 js 的时间缩短了，网页就能更快的 onload
- 在生成的优化机器代码时，不需要从源码中重新编译，而是使用字节码并且当需要 deoptimization 时，只需要回退到中间层的字节码解析执行就可以

新的架构在性能上由很大的提升并且各个功能模块的职能也更加清晰有利于 js 之后的扩展。

### js 调用栈

![image-20210913015054535](.\typora-user-images\image-20210913015054535.png)

先进后出的机制来管理函数的执行。

函数的声明是不会放入栈中的，一定是被调用的函数才会入栈。

### return

```
function foo() {
    return
  {
     value: 1
  };
}
console.log(typeof foo());

结果：undefined
考查点：JavaScript 的分号是可选的，  return 语句在换行后，JavaScript 会自动给它的结尾加上分号，而在 return 之后的代码都不会执行  ，所以 foo() 的返回结果是 undefined。解决方法是在每行结尾都写上分号，这样就能清楚的知道代码在哪里结束。
```

### 浏览器解析执行 js 代码的底层机制

在浏览器中打开页面，浏览器会解析渲染相关代码，包括其中的 js 代码（代码自上而下执行）；

在执行 js 脚本时，浏览器会提供一个代码执行的环境，这个环境叫做 ECStack（Execution Context Stack 执行环境栈），是一个栈内存；

最开始执行全局代码，形成一个 EC（GLOBAL）全局执行上下文，在栈内存中执行全局代码；

在全局的执行上下文中有一个 VO（GLOBAL）全局变量对象，把全局代码里定义的变量和对应的值存在 VO 中；

```javascript
let a = 12;
在代码执行里的过程（明确顺序，非常重要）：
1.创建一个值12（基本类型的值直接存在栈内存中）；
2.创建一个变量a，把它存储在VO（全局）中
3.让变量a与值12关联在一起（= 赋值操作）
```

![image-20210209221501222](..\typora-user-images\image-20210209221501222.png)

![image-20210209221558026](..\typora-user-images\image-20210209221558026.png)

大厂面试题：

![image-20210209222309850](..\typora-user-images\image-20210209222309850.png)

![image-20210209224142008](..\typora-user-images\image-20210209224142008.png)

![image-20210209224354570](..\typora-user-images\image-20210209224354570.png)

执行上下文栈和作用域链

每个函数在执行时，都会产生一个执行上下文，js 引擎创建了一个执行上下文栈来管理这些函数的执行上下文，ECStack。

作用域在函数定义的时候就决定了。函数会有一个内部属性 [scope] ，它内部存放着所有父级变量对象，查找变量时，首先在当前执行上下文的变量对象中查找，找到就用，找不到就去上级变量对象中查找，最后可能到全局上下文的变量对象。多个执行上下文所构成的链就叫作用域链。

### this 指向

js 中的 this 代表的是执行该函数的主体，而 js 中的 context 代表的是当前函数执行的上下文环境（区域）。

函数中的 this 是谁和函数在哪里定义的和在哪里执行的都没有关系。

**自执行函数内部的 this 永远指向全局对象 window**

回调函数内部的 this 一般都是 window

```
var a = 5;
var obj = {
    a: 3,
  foo: function() {
    console.log(this.a);
  }
}


var objFoo = obj.foo;
objFoo();


结果：5
考查点：在调用函数时，它内部的 this 指向的是调用对象，例如 obj.foo() this 指向的是 obj 对象。如果在全局调用函数时， this 指向的是全局对象，在浏览器中为 window。objFoo 相当于是在获取了 obj 对象的 foo 方法引用后，在全局进行调用，所以 this 指向的是 window 对象。使用 var 在顶级作用域中定义的变量会添加到 window 中，所以 objFoo() 调用打印的是全局中的 a。
```

对象字面量是没有作用域的，它只是堆内存中的一个空间。

```javascript
360面试题：
var num =20
var obj = {
    num :30,
    fn: (function(num){
        this.num *=3
        num +=15
        var num = 45
        return function(){
            this.num *=4
            num +=20
            console.log(num)
        }
    })(num)
}
var fn = obj.fn
fn()
obj.fn()
console.log(window.num,obj.num)   //这里出错
```

面试题解析：

![](.\typora-user-images\image-20210131094948330.png)

### 阿里面试(做错)：

```javascript
题一：
let a ={ n:1 }
let b = a
a.x = a = { n:2 }  //重点是在本行的执行顺序，  带成员访问的要优先处理   ，等价于  a = a.x = { n:2 }
console.log ( a.x ) //undefined
console.log ( b )	//{ n:1,x:{ n:2 } }



题二：
let a = ?
if(a==1 && a==2 && a==3){
    console.log(1)
}
问什么时候输出1
方法一：
let a ={
    i:0,
    toString(){
        return ++this.i
    }
}
方法二：
var i = 0
Object.defineProperty(window, 'a', {
    get(){
        return ++i
    }
})
方法三：
let a=[1,2,3]
a.join=a.shift()
```

![image-20210210103922151](..\typora-user-images\image-20210210103922151.png)

```
做错：
var a = 0;
if (true) {
    a = 1;
    function a() {return '123'}
    a = 21;
    console.log(a);
}
console.log(a);
```

![image-20210307143940832](..\typora-user-images\image-20210307143940832.png)

```javascript
腾讯面试：
let x = [1,2,3]
let y = x
let z = [4,5,6]
y[0] = 10
y = z
z[1]=20
z[2] = z = 30
console.log(x,y,z)

注意点：
z[2] = z = 30  ，这种语句理解为先创建一个值为30，然后让在z[2]指向30，也让z指向30。错误理解是：先将30赋值给z，然后再用z对应的值赋值给z[2]

```

```javascript
已知下面代码可以修改BOX元素的样式
> box.style.color='red'
那么下面的写法是否可以修改元素的样式，如果不可以，是为什么？
写法一：
let a= box.style
a.color='pink'

写法二：
let b =box.style.color
b='green'
```

![image-20210210155522872](.\typora-user-images\image-20210210155522872.png)

### 数据隐式类型转换

```
腾讯面试：
var a = 'abc'+ 123 + 456  //'abc123456'
var b = '456' - ' 123'  //333
var c = 100 + true + 21.2 + null + undefined + 'Tencent' + [] + null + 9 + false  //'NaNTencentnull9false'
('b'+'a'+ +'a'+'a').toLowerCase()   // "banana"


var str = 'abc123'
var num = parseInt(str)
if(num ==NaN ){
  alert(NaN)
}else if (num ==123){
  alert(123)
}else if (typeof num == 'number' ){
  alert('number')
}else {
  alert('str')
}
//弹出 number

以下能输出"1"的有？
alert(1)    // alert / confirm 弹窗输出，会把要输出的内容转为字符串后输出
console.log(parseInt(1.3))     // 不是字符串的，先转为字符串（String（1.3）），然后再调用parseInt（）
console.log(1)   //输出原本的数据格式,并不会进行格式转换
console.log(isNaN(1))    //输出false
console.log(parseInt('1'))    //输出数字类型的 1


以下输出"undefined"的有？
console.log(alert(1))  // 先执行alert（），再打印alert（）的返回结果 ，输出的式undefined
typeof undefined    //输出“undefined”
console.log(parseInt(undefined))  //NaN
isNaN(undefined)   // true  ,对于不是数字类型的参数，先调用Number（）将其转为数字类型，再检测

以下输出true的有？
isNaN（null）
isNaN（parseInt（null））
Number（null）
Number（undefined）
parseFloat（null）

以下的输出结果
parseInt('')  //
Number('')
isNaN('')
parseInt(null)
Number(null)
isNaN(null)
parseInt('12px')
Number('12px')
isNaN('12px')

考点：parseInt与Number的转换规则完全不同，而isNaN中参数不是数值类型时，内部隐式调用的Number（）方法先转换为数值类型后再检测。
parseInt中接收的不是字符串类型的，先用String（）转为字符串，然后再转为数值类型。Number的转换规则看书。


if(isNaN(NaN) == ''){
 console.log('abc')
}else {
 console.log('bcd')
}


var a = 0;
var b = a;
b++;
alert(a)
var o = {};
o.a = 0;
var b = o;
b.a = 10;
alert(o.a)
```

### a++与 a+=1 是否一致

分情况讨论

- 如果 a 是数字类型，则 a++与 a+=1 表现一致
- 如果 a 是由纯数字组成的字符串类型，则 a++是把数字字符串转为数字（用 Number（）进行转换）后再进行数学运算加一，而 a +=1 是将数字字符串和数字 1 进行字符串拼接
- 如果 a 中是有任何非数字字符的字符串，则 a++返回的结果就是 NaN,因为 Number（）转换为 NaN 后再加一也是 NaN，而 a+=1 还是进行字符串拼接

对于 a++，如果 a 不是数字类型的值，都会默认先调用 Number（）将 a 进行隐式转换后，再尝试进行加 1 运算

### 为什么 0.1+0.2 不等于 0.3（进制转换的规则）

在计算机底层，所有的数据都是以二进制的形式存储的，即使是数学运算时，也是先将数据转为二进制后再进行计算的。

进制转换的规则：

- 整数转换

  `n*2^(n-1) + n-1*2^(n-2)+...+(0|1)*2^0`

- 小数转换

  `n*2^-1+n*2^-2+....`

```
11 //二进制
转 十进制
1*2^1+1*2^0 = 3



1010  //二进制
转 十进制
1*2^3 + 0*2^2 + 1*2^1 + 0*2^0 = 10

0.1  //二进制
转  十进制
0*2^0 +1*2^-1 = 0.5

0.1  //十进制
转  二进制
0.1*2 =0.2    0
0.2*2 =0.4    0
0.4*2 =0.8    0
0.8*2 =1.6    1
0.6*2 =1.2    1
0.2*2 =0.4    0
0.4*2 =0.8    0
0.8*2 =1.6    1
0.6*2 =1.2    1
........
所以0.1转为二进制  0.00011001100110011.....

0.2  //十进制、
转  二进制
0.2*2 = 0.4   0
0.4*2 = 0.8   0
0.8*2 = 1.6   1
0.6*2 = 1.2   1
0.2*2 = 0.4   0
.....
所以0.2转为二进制   0.0011001100110011.....

所以在将0.1+0.2转为二进制进行运算时，已经出现偏差所以无法等于0.3  而是0.300000000000004


```

### 浏览器中常用的输出方式

- console 系列
  - console.log：输出任意数据类型的数据，控制台展示的也是对应的数据类型
  - console.dir：输出一个对象或者一个值的详细信息，不可以一次性输出多个值
  - console.table：把多维的 JSON 数据以表格形式输出
  - console.time / timeEnd：计算出 time/timeEnd 中间所有程序执行所消耗的时间
  - console.warn：以警告的方式输出
- 弹窗系列（window 的方法）
  - alert：浏览器窗口中弹出一个提示框，提示框中输出指定的信息
  - confirm：提供了确定和取消两种选择，true 点击的是确定 false 点击的是取消
  - prompt：在 confirm 的基础上给用户提供书写操作的原因等信息，点击的是取消，返回结果是 null；点击的是确定，会把用户输入的原因信息返回
- 其他
  - document.write

### script 标签放在头部与尾部的区别，以及如何解决

 js 是一门单线程的语言，同时 js 引擎和渲染引擎都共用一个线程，所以当执行渲染任务时，必须停止 js 的执行，反之也是一样的。

 把所有 JavaScript 文件都放在 <head> 里，也就意味着必须把所有 JavaScript 代码都下载、解析和执行完成后，才能开始渲染页面（页面在浏览器解析到的起始标签时开始渲染）。对于需要很多 JavaScript 的页面，这会 导致页面渲染的明显延迟，在此期间浏览器窗口完全空白。为解决这个问题，现代 Web 应用程序通常 将所有 JavaScript 引用放在元素中的页面内容后面。

### 数组长度

```
const arr = [1, 2, 3, 4];
arr.length = 0;
console.log(arr[0]);


结果：undefined
考查点：array 的 length 属性能反过来控制数组的元素数量，在给 arr.length 设置为 0 时，arr 就变成了空数组，再访问里边的元素就都是 undefined。
```

### typeof 能判断哪些数据类型

1. 可以判断所有的值类型数据，除了 null，typeof 返回值都是字符串形式的

2. 可以判断引用类型数据，但是不能判断具体属于对象下面的哪类细分对象

3. 可以判断函数类型

   ===可以判断 undefined 和 null 类型。

   判断函数： typeof 变量名 === ‘function’ ；typeof 函数名 => ‘function‘

### 数据类型的判断方法

1. Object.prototype.toString.call() :只能校验当前已经存在的类型（不能校验自定义类型）
2. instanceof
3. constructor
4. Array.isArray

## typeof 和 instanceof 的区别

typeof 可以校验的数据类型：undefined，function，string，number，boolean，symbol，bigInt。对于 null 的校验的返回值是"object"。但是 null 本身并不是引用类型数据。 typeof function(){ } : "function";其他引用数据类型统一返回"object"。

`typeof` 在判断一个 object 的数据的时候只能告诉这个数据是 object, 而不能细致的具体到是哪一种 object。

```js
Object.prototype.toString.call([]); //"[object Array]"
Object.prototype.toString.call(/\.css/i); //"[object RegExp]"
Object.prototype.toString.call(function () {}); //"[object Function]"

Object.prototype.toString.call(1); // "[object Number]"  //实际1是基本数据类型

Object.prototype.toString.call(true); // "[object Boolean]"

Object.prototype.toString.call('hi'); // "[object String]"

Object.prototype.toString.call(null); // "[object Null]"

Object.prototype.toString.call(undefined); // "[object Undefined]"

Object.prototype.toString.call(Symbol(1)); // "[object Symbol]"

Object.prototype.toString.call({ a: 'hi' }); // "[object Object]"

Object.prototype.toString.call([1, 'a']); // "[object Array]"

Object.prototype.toString.call(() => {}); // "[object Function]"

class A {}
let a = new A();
Object.prototype.toString.call(a); //"[object Object]"
```

```js
function myInstanceof(target, obj) {
  let proto = obj.__proto__;
  while (proto) {
    if (proto == target.prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}
```

instanceof 判断一个实例是否属于某种类型，也可以判断一个实例是否是其父类型或者祖先类型的实例。

原理是：判断构造函数的 prototype 原型对象在实例的`__proto__`组成的原型链上。

```js
function Foo() {}

Object instanceof Object; // true
Function instanceof Function; // true
Function instanceof Object; // true
Foo instanceof Foo; // false
Foo instanceof Object; // true
Foo instanceof Function; // true
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/28/163a55d5d35b866d~tplv-t2oaga2asx-watermark.awebp)

## js 在底层是怎么存储数据的类型信息

一个 js 变量在底层是以什么方式记录该变量存储的数据是一个什么类型的数据的。

js 在底层存储变量时，会在变量的机器码的低位 1-3 位存储其类型信息。

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

对于 `undefined` 和 `null` 来说，这两个值的信息存储是有点特殊：

`null`：所有机器码均为 0，typeof`在判断 null 时，由于 null 的所有机器码均为 0，因此直接被当做了对象。

`undefined`：用 −2^30 整数来表示。

### undefined 和 null 的区别

undefined 表示声明了变量但并未赋值，null 表示声明了变量并赋值为 null；

何时给变量赋值为 null：

- 在确定变量之后要被用于保存对象类型的数据但不能马上确定具体的对象数据时；
- 垃圾回收时；
- 解绑 DOM 事件时。

变量类型和数据类型：

 变量类型：指的是根据变量内存放的值是基本数据类型还是引用数据类型分；

 数据类型：基本数据类型和引用数据类型

### window.onload 和 DOMContentLoaded 的区别

```
DOM完整的解析过程：
1、浏览器下载对应的 html 页面。

2、浏览器解析 html 页面的 DOM 结构。

3、开启下载线程对文档中的所有资源按优先级排序下载。

4、主线程继续解析文档，到达 head 节点 ，head 里的外部资源无非是外链样式表和外链 js。发现有外链 css 或者外链 js，如果是外链 js ，则停止解析后续内容，等待该资源下载，下载完后立刻执行。如果是外链 css，继续解析后续内容。

5、解析到 body
	如果body中只有 DOM 元素：DOM 树构建完，页面首次渲染。

	有 DOM 元素、外链 js：当解析到外链 js 的时候，该 js 尚未下载到本地，则 js 之前的 DOM 会被渲染到页面上，同时 js 会阻止后面 	DOM 的构建，即后面的 DOM 节点并不会添加到文档的 DOM 树中。所以，js 执行完之前，我们在页面上看不到该 js 后面的 DOM 元素。

	有 DOM 元素、外链 css：外链 css 不会影响 css 后面的 DOM 构建，但是会阻碍渲染。简单点说，外链 css 加载完之前，页面还是白屏。

	有 DOM 元素、外链 js、外链 css：外链 js 和外链 css 的顺序会影响页面渲染，这点尤为重要。当 body 中 js 之前的外链 css 未加载		完之前，页面是不会被渲染的。         当body中 js 之前的 外链 css 加载完之后，js 之前的 DOM 树和 css 合并渲染树，页面渲染出		该 js 之前的 DOM 结构。

6、文档解析完毕，页面重新渲染。当页面引用的所有 js 同步代码执行完毕，触发 DOMContentLoaded 事件。

7、html 文档中的图片资源，js 代码中有异步加载的 css、js 、图片资源都加载完毕之后，load 事件触发。


<body>
  <!-- 白屏 -->
  <div id="div1"></div>
  <!-- 白屏 -->
  <link rel="stylesheet" href="./c1.css" />
  <!-- 白屏 -->
  <link rel="stylesheet" href="./c3.css" />
  <!-- 如果此时 j1.js 尚未下载到本地，则首次渲染，此时的 DOM 树 只有 div1 ，所以页面上只会显示 div1，样式是 c1.css 和 c3.css 的并集。-->
  <!-- 如果此时 j1.js 已经下载到本地，则先执行 j1.js，页面不会渲染，所以此时仍然是白屏。-->
  <!--下面的 js 阻塞了 DOM 树的构建，所以下面的 div2 没有在文档的 DOM 树中。 -->
  <script src="http://test.com:9000/mine/load/case2/j1.js
  "></script>
  <!-- j1.js 执行完毕，继续 DOM 解析，div2 被构建在文档 DOM 树中，此时页面上有了div2 元素，样式仍然是 c1.css 和 c3.css 的并集 -->
  <link rel="stylesheet" href="./c4.css" />
  <!-- c4.css 加载完毕，重新构建render树，样式变成了 c1.css、c3.css 和 c4.css 的并集 -->
  <div id="div2"></div>
  <script>
  // 利用 performance 统计 load 加载时间。
    window.onload=function(){console.log(performance.timing.loadEventStart - performance.timing.fetchStart);}
  </script>
</body>



window.onload在 window 对象上，当页面 DOM 结构中的 js、css、图片，以及 js 异步加载的 js、css 、图片都加载完成之后，才会触发 load 事件。
DOMContentLoaded 事件在 html文档加载完毕，并且 html 所引用的内联 js、以及外链 js 的同步代码都执行完毕后触发。
```

下载/加载：都指的是浏览器将资源下载到本地的过程。

### 浏览器对同一域名下的资源并发下载线程数，chrome 为 6 个

 浏览器对**同一域名**下的下载并发不超过 6 个。超过 6 个的话，剩余的将会在队列中等待，这就是为什么我们要将资源收敛到不同的域名下，也是为了充分利用该机制，最大程度的并发下载所需资源，尽快的完成页面的渲染。如果 n 个不同域名的话，在浏览器设置的最大并发上限以内(默认是 10 个)，是可以达到 n \* 6 个的最大并发的下载的。

### 提升（Hoisting)

```
function bar() {
	var foo;
	function foo(){};
    return foo;
  foo = 10;
  foo = '11';
}
console.log(typeof bar());

结果：function
```

### JS 数据类型分类（堆与栈）

内存是一个临时的空间，数据在内存中有两部分：数据本身和代表这块空间的内存地址值。

内存分为：栈内存和堆内存。



### 深拷贝和浅拷贝(也会问到 JSON.stringify JSON.parse 这种方案的弊端)

深浅拷贝的概念：javaScript 中的变量存储对象都是存堆内存地址的，所以浅拷贝会导致 obj1 和 obj2 指向同一块内存地址。通过其中一个变量操作对象的内容，都是在原来的内存指向的数据上做修改会导致拷贝对象和源对象都发生改变，而深拷贝是开辟一块新的内存地址，将原对象的各个属性逐个复制进去。对拷贝对象和源对象各自的操作互不影响。

深浅拷贝不需要考虑函数，因为函数常常是直接调用的，每次调用函数都返回一个新的值，所以不需要考虑函数。

```javascript
// 自己定义的简易深拷贝方法：
function deepClone(obj){
    if(typeof obj !=="object" || obj === null){
        return obj
    }
    if(obj instanceof RegExp){
        return new RegExp(obj)
    }
    if(obj instanceof Date){
        return new Date(obj)
    }
    //  let temObj = new obj.constructor  高级写法
    let tempObj = obj instanceof Array ? []:{}
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            tempObj[key]=deepClone(obj[key])
        }
    }
    return tempObj
}
// 上面这套代码存在循环引用的问题，例如：
let obj = {age:{name:123}}
obj.xxx = obj
//解决循环应用的话需要借助set或者map结构



function deepClone(obj,hash = new WeakMap()){
    if(typeof obj !=="object" || obj === null){
        return obj
    }
    if(obj instanceof RegExp){
        return new RegExp(obj)
    }
    if(obj instanceof Date){
        return new Date(obj)
    }
    if(hash.has(obj)) return hash.get(obj)  //++++++++++++++++
    //  let temObj = new obj.constructor  高级写法
    let tempObj = obj instanceof Array ? []:{}
    hash.set(obj,tempObj)   // +++++++++++++
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            tempObj[key]=deepClone(obj[key], hash)
        }
    }
    return tempObj
}




jQuery中的深拷贝方法：
//实现深拷贝函数
function deepClone(data) {
    const type = this.judgeType(data);
    let obj = null;
    if (type == 'array') {
        obj = [];
        for (let i = 0; i < data.length; i++) {
            obj.push(this.deepClone(data[i]));
        }
    } else if (type == 'object') {
        obj = {}
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                obj[key] = this.deepClone(data[key]);
            }
        }
    } else {
        return data;
    }
    return obj;
}

function judgeType(obj) {
    // tostring会返回对应不同的标签的构造函数
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
}
```

其他拷贝方法：

- Object.assign ( ) ：对每个源对象执行的是浅复制。（复制 源对象 上属性值为对象类型的数据的内存地址），用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，它将返回目标对象。

  如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。

  ```js
  const target = { a: 1, b: 2 };
  const source = { b: 4, c: 5 };

  const returnedTarget = Object.assign(target, source);

  console.log(target); // expected output: Object { a: 1, b: 4, c: 5 }
  console.log(returnedTarget); // expected output: Object { a: 1, b: 4, c: 5 }
  console.log(returnedTarget === target); //true
  ```

- let newObj = {...obj1,...boj2...} ：对每个源对象执行的是浅复制。（复制 源对象 上属性值为对象类型的数据的内存地址）

**let newObj = JSON.parse(JSON.stringify(obj))** ：深拷贝，利用`JSON.stringify` 将 js 对象序列化（`JSON字符串`），再使用`JSON.parse`来反序列化(还原)js 对象；

JSON.stringify JSON.parse 的不足：

- 如果 obj 里面有时间对象，则`JSON.stringify`后再`JSON.parse`的结果，时间将只是字符串的形式。而不是时间对象；

  ```javascript
  var test = {
    name: 'a',
    date: [new Date(1536627600000), new Date(1540047600000)]
  };

  let b;
  b = JSON.parse(JSON.stringify(test));
  ```

  ![image-20210217011115765](.\typora-user-images\image-20210217011115765.png)

- 如果 obj 里有`RegExp`、`Error`对象，则序列化的结果将只得到空对象；

- 如果 obj 里有函数，`undefined`，则序列化的结果会把函数或 undefined 丢失；

  ![image-20211212162653701](.\typora-user-images\image-20211212162653701.png)

  打印结果：

  ![image-20211212162701453](.\typora-user-images\image-20211212162701453.png)

- 如果 obj 里有 NaN、Infinity 和-Infinity，则序列化的结果会变成 null

- `JSON.stringify()`只能序列化对象的可枚举的自有属性，例如 如果 obj 中的对象是有构造函数生成的， 则使用`JSON.parse(JSON.stringify(obj))`深拷贝后，会丢弃对象的`constructor`；

- 如果对象中存在循环引用的情况也无法正确实现深拷贝；

### set 和 map 的相关面试

set:集合

集合 set 何如实现并集，交集和差集

```js
let s01 = [1, 2, 3, 6, 1, 7];
let s02 = [3, 4, 5];

console.log(typeof new Set([1, 2, 3, 4, 5, 2])); //'object'

// 并集
function union(s1, s2) {
  return [...new Set([...new Set(s01), ...new Set(s02)])];
}

// 交集
function intersection(s1, s2) {
  let newS = [...new Set(s1)].filter((item) => {
    return new Set(s2).has(item);
  });
  return newS;
}

// 差集
function diff(s1, s2) {
  let newS = [...new Set(s1)].filter((item) => {
    return !new Set(s2).has(item);
  });
  return newS;
}
```

map：映射

key 可以是任何值

```js
let m = new Map();
m.set('name', 'jack');
m.set('name', 'tom'); //覆盖前面的name

let obj = { name: 1 };
m.set(obj, '456');
obj = null;
console.log(obj); //null
console.log(m); // {'name'=>'tom',{name:1}=>'456'}
// 情况是虽然将obj置为null了，但是当前的map中还引用着{name:1}对象，该对象并没有被销毁。
```

WeakMap

weakMap 的 key 必须是对象类型。

```js
let m = new WeakMap();
m.set('name', 'jack'); // 该行报错， WeakMap的key必须是对象类型

let obj = { name: 1 };
m.set(obj, '456');
obj = null;
console.log(obj); //null
console.log(m); // { {name:1}=>'456' }
// 情况是将obj置为null了，但是当前的weakmap中不会强引用着{name:1}对象，该对象可以被销毁。
```

map 和 WeakMap 的区别。

```js
let obj = {
  other: 'abc',
  get name() {
    return this.other;
  },
  set name(vale) {
    this.other = val;
  }
};
```

### symbol 类型的函数、循环应用、相同引用如何实现深拷贝

### 数组常用的 API，这些 API 中哪些会影响原数组，哪些不会影响原数组，它们的返回值又是什么？

- reduce 方法,使用案例：

  ```js
  let keys = ['name','age']
  let values = ['jack',20]
  
  let result = keys.reduce(function(prev,current,index,arr){
      prev[current] = values[index]
      return prev
  },{})
  
  // 写法二：  逗号运算符
  let result = keys.reduce(
      (prev,current,index,arr)=>(prev[current] = values[index],prev),{}
  )
  
  console.log(result)



  // 阿里面试题
  function compose(...fns){
      return function(...args){
          let lastFn = fns.pop()
          return fns.reduce((prv,next,index,arr)=>{
              return next(prv)
          },lastFn(...args))
      }
  }

  function compose (...fns){  [add,upper,sum]
      return fns.reduce((a.b)=>{
          return (...args)=>{
              return a(b(...args))
          }
      })
  }

  let compose = (...fns)=>fns.reducer((a,b)=>(...args)=>a(b(...args)))
  ```

  手写 reduce：

  ```js
  function reduce = (callback,prev){
      for(let i=0;i<this.length,i++){
          if(prev){
              prev = callback(prev,this[i],i,this)
          }else{
              prev = this[i]
              prev = callback(prev,this[i+1],i+1,this)
              i++
          }
      }
      return prev
  }
  ```

### 闭包及它的优缺点

### 原型与原型链

作者为什么设计继承机制？

 作者在设计 JS 之初，认为这门语言没必要设计的很复杂，只要能完成一些简单的操作就可以了（比如判断用户表单的填写情况）。而当时正是面向对象编程语言大火的时候（c++与 java），布兰登·艾奇**设计 JS 中的所有数据类型都是对象**，这和 java 的非常相似。因为数据类型都可以归为对象类型，所以就有了一个难题：到底要不要设计“**继承**”机制？因为如果真的设计一门简单的脚本语言，其实不需要有“**继承**”机制，但是 js 中的数据底层都是对象类型，必须要有一种机制将所有对象联系起来，所以布兰登·艾奇还是选择设计了“**继承**”。但是他不打算引入“**类（class）**”的概念，（因为一旦有了“**类**”，JS 就时一种完整的面向对象编程语言了而过于正式，增加了初学者的难度。) 他就借鉴了 java 中的 new 命令，用来从原型对象中生成一个实例对象。因为 js 中没有“类”的概念，所以就要考虑怎么来表示原型对象。他想到 C++和 java 使用 new 命令时，都会调用“**类**”的构造函数（constructor），他就做了一个简单的设计，在 JS 中，new 命令后面跟的不是类，而是构造函数。构造函数中的 this 表示实例对象。

作者为什么设计原型？

 new 构造函数的缺点：**无法共享属性和方法**。每个 new 出的实例对象都是独立的，都有自己的属性和方法的副本，无法数据共享的同时页极大的浪费内存资源。为此就给构造函数设计了一个 prototyp 属性，这个属性是一个对象，所有实例都西昂的共享属性和方法都放在这个属性内。那些不需要共享的属性和方法放在构造函数内。

 实例对象在创建时，自动生成一个`__proto__`属性，它自动引用构造函数的 prototype 属性所指向的对象。由于所有的实例对象都共享一个原型对象，那么外界看起来就像 prototype 对象是实例对象的原型，而实例对象则表现得像是继承了 prototype 对象一样。

### 事件循环

JavaScript 是一门单线程语言。为了协调事件、用户交互、脚本、UI 渲染和网络处理等行为，浏览器引擎必须使用 event loop。Event Loop 包含两类：一类是基于 Browsing Context ，一种是基于 Worker ，二者是独立运行的。

所有的任务可以分为同步任务和异步任务，同步任务是立即执行的任务，同步任务一般会直接进入到主线程中执行；而异步任务是异步执行的任务，比如 ajax 网络请求，setTimeout 定时与 dom 事件等都属于异步任务，异步任务会通过任务队列( Event Queue )的机制来进行协调。

![img](https://images2018.cnblogs.com/blog/698814/201809/698814-20180906144953689-838865376.jpg)

 同步和异步任务分别进入不同的执行环境，同步的进入主线程，即主执行栈，异步的进入 Event Queue 。主线程内的任务执行完毕为空，才会去 Event Queue 读取对应的任务，推入主线程执行。 上述过程的不断重复就是我们说的 Event Loop (事件循环)。

 每次事件循环时的主要流程“：

1. 在此次循环中选择最先被推入队列的任务，如果有则执行(一次)

执行 JavaScript 代码和 UI 渲染都有规定的执行时间段。

浏览器事件循环机制和 Node 事件循环机制。

浏览器端事件循环机制：

- 主线程执行栈（js 执行和渲染执行的）
- 任务队列
  - 宏队列（宏任务）：定时器、DOM 事件与 Ajax
  - 微队列（微任务）：Promise

### class 类的理解

### 防抖和节流

- **防抖（debounce）**

  原理：当事件被触发，让事件所对应的处理函数延迟执行，在延迟的时间段内再次触发事件时，取消定时器后重新计时并延迟执行，以达到整个过程只执行一次事件处理函数的目的。

  应用场景：

  1. scroll 事件滚动触发

  2. 搜索框输入查询

  3. 表单验证

  4. 按钮提交事件

  5. 浏览器缩放事件（resize）

  防抖函数功能点：

  - 可根据第三个参数选择立即执行还是延迟执行
  - 能自主决定延迟时间
  - 回调函数中的 this 指向触发事件的 dom 元素
  - 回调函数中可以接收事件对象 event
  - 防抖函数可以取消
  - 可以接收回调函数的返回结果

  ```javascript
  function debounce(fn, wait = 1000, immediate = false) {  //wait是触发的事件间隔
      let timer, result;    //timer用于记录上一次的事件定时器回调是否完成；result用于接收返回值
      let debounced = function (...args) { //...args 用于将函数接收的参数转为数组，并放在args中
          if (timer) {
              clearTimeout(timer);
          }
          if (immediate) {  //immediate表示是否事件一开始就触发，但之后不触发
              let callnow = !timer;     //用于处理fn执行报错的情况
              timer = setTimeout(() => {
                  timer = null;
              }, wait);
              if (callnow) {
                  result = fn.apply(this, args)
              }
          } else {
              timer = setTimeout(() => {
                  result=fn.apply(this, args);   //result在这步是无法返回的，因为当前的函数是在setTimeout这个异步函数中执行的。
              }, wait);
          }
          return result;
      }
      debounced.cancel = function () {   //防抖函数的取消
          clearTimeout(timer);
          timer= null;
      }
      return debounced;
  }



  <div class="box" id="box"></div>
    <button id="btn">取消防抖</button>
  let count = 0,
      box = document.getElementById('box'),
      btn = document.getElementById('btn')

  function move() {
      box.innerHTML = count++
      return 'hello debounce'
  }

  function debounce(func, time, immediate) {
      let timerId,callNow,self,result
      let debounce = function () {
          self = this
          clearTimeout(timerId)
          if (immediate) {
              callNow = !timerId
              timerId = setTimeout(function(){
                  timerId= null
              },time)
              if(callNow){
                  result = func.apply(this,arguments)
              }
          } else {
              timerId = setTimeout(function () {
                  result= func.call(this)
              }, time)
          }
          return result
      }
      debounce.cancel = function(){
          clearTimeout(timerId)
          timerId= null
      }
      return debounce
  }
  let debounceMove = debounce(move, 2000, false)
  box.addEventListener('mousemove',debounceMove )
  btn.addEventListener('click',debounceMove.cancel)
  ```

- **节流（throttle）**

  原理：如果事件持续触发，则每个一段事件执行一次事件处理函数，默认第一次立即执行和最后一次延迟执行，但是可以手动设置是否立即执行第一次或延迟执行最后一次。

  利用**时间戳**和**定时器**实现节流

  ```javascript
  第一版：开始立即触发，最后一次不触发
  function throttle(fn, wait = 1000) {
      let context, args
      let oldTimer = 0
      return function () {
          context = this
          args = arguments
          let now =Date.now()
          if (now - oldTimer > wait) {
              fn.apply(context, ...args)
              oldTimer = now
          }
      }
  }

  //在第一次触发事件时，先获取当前事件发生时的时间戳，然后和一个初始化的时间戳进行运算，如果运算结果大于开发者设定的时间，则立即执行，并将当前时间戳保存给初始时间戳变量。现在再触发事件时，又再次获取事件触发时的时间戳，和上次的初始时间戳比较，大于开发者设定时间则立即执行。
  ```

  ```javascript

  第二版：第一次不触发，最后一次触发
  function throttle(fn, wait = 2000) {
      let timer, context
      return function () {
          context = this
          if (!timer) {
              timer = setTimeout(() => {
                  fn.apply(context, ...arguments)
                  timer = null
              }, wait)
        }
      }
  }
  ```

  ```javascript
  完整版：
  function throttle(fn, wait = 1000, options) {
      let context, args, timer
      let oldTimer = 0
      if (!options) options = {}
      return function () {
          context = this
          args = arguments
          let now = new Date().valueOf()
          if (options.leading == false && !oldTimer) { //options.leading为false是禁止第一次执行
              oldTimer = now
          }
          if (now - oldTimer > wait) {
              if (timer) {
                  clearTimeout(timer)
                  timer = null
              }
              fn.apply(context, args)
              oldTimer = now
          }
          if (!timer && options.trailing !== false) {  //options.trailing为false是禁止最后一次执行
              timer = setTimeout(function () {
                  oldTimer = new Date().valueOf()
                  timer = null
                  fn.apply(context, args)
              }, wait)
          }
      }
  }

  let count = 0
  let div = document.getElementsByTagName('div')[0]
  let btn = document.getElementById('btn')
  function move(e) {
      console.log(this);
      div.innerText = count++
      return 'asd'
  }
  let active = throttle(move)
  div.addEventListener('mousemove', active)

  options.trailing，options.leading不能同时为false
  ```

### 常见算法(排序洗牌等)

### promise 系列问题

- 了解 Promise 吗？

  Promise 是异步编程的一种解决方案，比传统的异步解决方案【回调函数】和【事件】更合理、更强大。现已被 ES6 纳入进规范中。

- Promise 解决的痛点是什么？Promise 解决的痛点还有其他方法可以解决吗？如果有，请列举。

  回调地狱

- Promise 如何使用？

  **new** Promise(请求 1)

  .then(请求 2(请求结果 1))

  .then(请求 3(请求结果 2))

  .then(请求 4(请求结果 3))

  .then(请求 5(请求结果 4))

  .catch(处理异常(异常信息))

- Promise 常用的方法有哪些？它们的作用是什么？

  - Promise.resolve(value)

    > 1、类方法，该方法返回一个以 value 值解析后的 Promise 对象 1、如果这个值是个 thenable（即带有 then 方法），返回的 Promise 对象会“跟随”这个 thenable 的对象，采用它的最终状态（指 resolved/rejected/pending/settled）。
    >
    > 2、如果传入的 value 本身就是 Promise 对象，则该对象作为 Promise.resolve 方法的返回值返回。 3、其他情况以该值为成功状态返回一个 Promise 对象。
    >
    > ```
    > //如果传入的 value 本身就是 Promise 对象，则该对象作为 Promise.resolve 方法的返回值返回。
    > function fn(resolve){
    >     setTimeout(function(){
    >         resolve(123);
    >     },3000);
    > }
    > let p0 = new Promise(fn);
    > let p1 = Promise.resolve(p0);
    > // 返回为true，返回的 Promise 即是 入参的 Promise 对象。
    > console.log(p0 === p1);
    > ```

  - Promise.reject
  - Promise.prototype.then
  - Promise.prototype.catch
  - Promise.race
  - Promise.all

- Promise 在事件循环中的执行过程是怎样的？

- Promise 的业界实现都有哪些？

  业界有了很多实现来解决回调地狱的痛点。比如业界著名的 **Q** 和 **bluebird**，**bluebird** 甚至号称运行最快的类库。

- 能不能手写一个 Promise 的 polyfill（原生 API）。

  `Polyfill`的准确意思为：用于实现浏览器并不支持的原生 API 的代码。

#### Promise 出现的原因

处理异步回调请求

```
请求1(function(请求结果1){
    请求2(function(请求结果2){
        请求3(function(请求结果3){
            请求4(function(请求结果4){
                请求5(function(请求结果5){
                    请求6(function(请求结果3){
                        ...
                    })
                })
            })
        })
    })
})

```

**回调地狱的问题**：

- 代码臃肿，可读性差，耦合度过高，可维护性差，代码复用性差，容易滋生 bug，只能在回调里处理异常。

### async/await

### ES6 装饰器

### 跨域形成原因以及解决方案

 当前页面的 url 与请求的资源所在的 url 两者之间的**协议**，**域名**或者**端口号**，**只要有一个不同**就符合跨域的情况。Ajax 默认遵守**浏览器的同源策略**，如果出现跨域的情况，则无法发送跨域请求。

```javascript
//跨域的例子
http://zf.cn:8080/ 与 http://zf.cn:8081/
http://www.zf.cn:8080/ 与 http://a.zf.cn:8080/
http://www.zf.cn:8080/ 与 https://www.zf.cn:8080/
```

为什么浏览器不支持跨域：

 浏览器中可能存在 cookie，LocalStorage 都是同域下的，不支持跨域；

 DOM 元素也有同源策略限制，在一个页面引用其他域名下的页面（用 iframe），也无法实现对 iframe 页面的跨域操作；

 Ajax 不支持跨域，**实际上 Ajax 的请求是能从客户端发出的，只是响应结果被浏览器给拦截了。**

为什么要实现跨域：

 因为项目的开发上线时，可能前端和后端项目所放的服务器地址不同。

实现跨域的方法：

- JSONP

  只能发送 get 请求，不支持 post，put，delete；

  不安全，可以导致 xss 攻击，假如引入的资源中套入其他 script 标签，可以将其他脚本加入自己的页面中，不安全。

  `<img src="http://xxxxx.xxx/xxx.jpg">`

  `<link href="cdn">`

  `<script src="">`

  ```javascript
  //定义jsonp请求函数
  function jsonp({ url, params, cb }) {
    return new Promise((resolve, reject) => {
      //返回一个promise对象
      window[cb] = function (data) {
        //现在全局绑定一个等待被回调的函数
        resolve(data); //一旦jsonp请求回来后调用该函数，并将数据传出去
        document.body.removeChild(script); //删除script元素
      };
      let script = document.createElement('script'); //创建script标签
      let arr = [];
      let queryObj = { ...params, cb };
      for (let key in queryObj) {
        //解析查询字符串
        arr.push(`${key}=${queryObj[key]}`);
      }
      let src = `${url}?arr.join('&')`;
      script.src = src;
      document.body.appendChild(script); //发出jsonp请求
    });
  }

  jsonp({
    url: 'xxxxxxxxx',
    params: {
      name: 'jack'
    },
    cb: 'show'
  }).then((data) => {
    console.log(data);
  });
  ```

- 服务端 CORS（Cross-Origin Resource Sharing）

  客户端要传给服务器端数据可以通过以下方式：

  - url 中的查询字符串（?key=value&key=value）
  - 请求体传数据
  - 请求头传数据( xhr.setRequestHeader('key','value') )

  ```javascript
  这是3000端口号下的html页面中的代码：
  
  const xhr =new XMLHttpRequest();
  
  document.cookie = 'password=asd'; //这个代码是在给页面设置cookie，在跨域请求时，服务器端是不会收到cookie的，因为cookie默认不允许跨域
  xhr.withCredentials=true; //加上这段代码，开启Ajax对象 ——xhr的跨域强制携带cookie   报错四
  
  xhr.open('GET','http://localhost:4000/getData')  //报错一
  xhr.setRequestHeader('name','jack')  //报错二
  [xhr.open('GET','http://localhost:4000/getData')]  //报错三 ，用put请求
  xhr.onreadystatechange=function(){
      if(xhr.readyState ===4 ){
          if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
              console.log(xhr.responseText);
              console.log(xhr.getResponseHeader('name'))  //报错五：客服端不支持取用服务器端设置的响应头数据
          }
      }
  }
  xhr.send()


  ```

  ```

  //报错一：不支持跨域
  Access to XMLHttpRequest at 'http://localhost:4000/getData' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

  //报错二：不支持请求头跨域
  Access to XMLHttpRequest at 'http://localhost:4000/getData' from origin 'http://localhost:3000' has been blocked by CORS policy: Request header field name is not allowed by Access-Control-Allow-Headers in preflight response.

  //报错三：不支持PUT请求方式跨域
  Access to XMLHttpRequest at 'http://localhost:4000/getData' from origin 'http://localhost:3000' has been blocked by CORS policy: Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.


  //报错四：不支持cookie跨域
  Access to XMLHttpRequest at 'http://localhost:4000/getData' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.


  //报错五：客服端不支持取用服务器端设置的响应头数据
  Refused to get unsafe header "name"
  ```

  ```javascript
  //报错的解决方式
  app.use(function (req, res, next) {
    let origin = req.headers.origin; //获取请求源
    let whiteList = ['http://localhost:3000'];
    if (whiteList.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin); //将origin设置为可以请求的源 ,这种方式的话，默认允许客户端发送get与 head 请求，不支持其他请求方式  ,如果设置为 * 号，那则无法与 设置允许客户端Ajax请求携带cookie 连用   解决报错一

      res.setHeader('Access-Control-Allow-Headers', 'name,age'); //设置允许客服端设置哪些请求头信息  解决报错二

      res.setHeader('Access-Control-Allow-Methods', 'PUT'); // 设置允许客户端设置哪些请求方式   解决报错三

      res.setHeader('Access-Control-Allow-Max-Age', 6000); // 预检测存活时间(options请求)

      res.setHeader('Access-Control-Allow-Credentials', true); // 允许客户端Ajax请求携带cookie   解决报错四

      res.setHeader('Access-Control-Expose-Headers', 'name,age,gender'); //允许前端获取哪个请求头     解决报错五

      //一般Ajax请求会先发送一个option请求方式到服务器端，用于确认该服务器支持哪些请求方式，能接受对应Ajax请求方式时，再发给服务端
      if (req.method === 'OPTIONS') {
        res.end(); //针对options请求方式不做任何处理
      }
    }
    next();
  });

  app.get('/getData', function (req, res) {
    console.log(req.headers);
    res.setHeader('name', 'wuyibo');
    res.end('hello express');
  });

  app.put('/getData', function (req, res) {
    console.log(req.headers);
    res.end('hello express');
  });

  app.listen(4000);
  ```

  一般 Ajax 请求会先发送一个 option 请求方式到服务器端，用于确认该服务器支持哪些请求方式，能接受对应 Ajax 请求方式时，再发给服务端。

  ![image-20210324175112717](.\typora-user-images\image-20210324175112717.png)

  ![image-20210324175128424](.\typora-user-images\image-20210324175128424.png)

- postMessage（两个域下的两个页面之间的通信手段（不是数据通信而是页面通信））

  ```
  a页面（3000端口号）
  <h1>a</h1>
    <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe>
    <script>
      function load() {
        let frame = document.getElementById('frame');
        frame.contentWindow.postMessage('hello frame','http://localhost:4000');
        window.onmessage=function (e) {
          console.log(e.data);
        }
      }
    </script>


  b页面（4000端口号）
  <h1>b</h1>
    <script>
      window.onmessage =function(e){
        console.log(e.data);
        e.source.postMessage('hello a',e.origin);
      }
    </script>
  ```

- window.name（也是依赖于 iframe 标签）

  ```

  ```

- location.hash（也是依赖于 iframe 标签）

- document.domain(专门做子域名和父域名之间通信)

- http-proxy

- nginx

- websocket

### Websocket 和 ajax 的区别

### 箭头函数和普通函数有什么区别，箭头函数能否使用 new 去创建实例及原因。

- 箭头函数在语法上比普通函数更加简洁
- 箭头函数中没有自己的 this，它内部的 this 是继承函数所处的上下文 this
- 对箭头函数使用 call 与 apply 也不能改变内部 this 指向
- 箭头函数中没有 arguments，能基于...args 获取传参组成的数组
- 箭头函数不能使用 new 关键字 去调用，因为箭头函数没有 prototype（显示原型）和 this

### 实现一个 call/bind(call,apply,bind 区别)

call 的特点：

- 改变函数内部的 this 指向
- 让当前函数执行

面试题：

```js
function fn1(){
	console.log(1)
}

function fn2(){
	console.log(2)
    console.log(this)
}

fn1.call(fn2)   // 1

fn1.call.call.call(fn2)     // 2  window


Function.prototype.call = function(context=window,..args){
	this()
}


手写call
Function.prototype.call = function (context){
    context = context? Object(context) : window
    context.fn = this
    let args = []
    let length = arguments.length
    for (let i=1;i<length;i++){
        args.push(arguments[i])
    }
    let result = eval(`context.fn(${args})`)
	delete context.fn
    return result
}


手写apply
Function.prototype.apply = function(context,args){
    context = context?Object(context):window
    context.fn = this
    let result = context.fn(...args)
    return result
}



bind方法可以绑定this指向和绑定参数
bing方法返回一个绑定后的函数（高阶函数）
如果返回的绑定函数被new调用，原来调用bind绑定函数this的函数内部的this就不再指向bind绑定的上下文对象了，同时返回的绑定函数内部的this 则代表的是 该绑定函数的实例
new 出来的实例对象可以访问使用bind方法的原函数的原型

手写bind
Function.prototype.bind = function (context,...args1){
    context = context?Object(context):window
    let that = this
    let Fn =function(){}
    let bindFun = function(...args2){
        if(this instanceof bindFun){
            return that.apply(this,[...args1,...args2])
        }
        context.fn = that
        let result = context.fn(...args1,...args2)
        return result
    }
    Fn.prototype = that.prototype
    bindFun.prototype = new Fn()   //通过这种方法将bindFun的原型和that的原型进行直接的分离
    return bindFun
}

使用bind绑定的函数如果使用 new 的方式进行调用的话，则函数内部的this指向不再是调用bind时传递的第一个上下文参数了。

  ```

在 js 中不能直接对 this 进行赋值操作。

字符串和数组进行拼接的话，会将数组调用 toString 方法后再与字符串进行拼接。

这三个方法都是函数对象去调用的，所以它们是定义在构造函数 Function（）的 prototype 上的。

call 与 apply 在指定的函数内部的 this 指向的同时调用执行的函数，在传递多个(3 个以上参数时，call 的性能要稍好于 apply。

用 ES6 的展开运算符可以让 call 实现 apply 的使用方式。

bind 返回一个新函数，新韩淑被调用时内部会调用原函数且原函数的 this 指向为 bind（）的第一个参数。

仿写 call | apply | bind（）

```javascript
call：
Function.prototype.call=function(context,...args){
    if(context===undefined || context === null ){
        context=window
    }
    let result
    context.temmpFun = this
    result = context.tempFun(...args)
    delete context.tempFun
    return result
}
//注意的知识点：
1. 构造函数Function的原型上的方法，在通过函数对象去调用时，方法内部的this指向函数对象（函数本身）
2. 当把一个函数赋值给某个对象的一个属性的属性值时，再通过 对象.属性名 的方式去调用函数时，h函数内部this指向对象

apply：
Function.prototype.apply=function(context,args){
    if(context===undefined || context === null ){
        context=window
    }
    let result
    context.temmpFun = this
    result = context.tempFun(...args)
    delete context.tempFun
    return result
}

bind:
Function.prototype.bind=function(obj,...args1){
    if(obj===undefined || obj === null ){ obj=window }
    let that = this  //调用bind方法的那个函数
    return function(...args2){
        return  (function(obj,...args1,...args2){
            let result
            obj.temmpFun = that
            result = obj.tempFun(...args1,...args2)
            delete obj.tempFun
            return result
        })
    }
}

Function.prototype.myBind = function (context,...args) {
    let _this = this
    return function(...innerArgs){
        _this.apply(context,args.concat(innerArgs))
    }
}

```

注意点：

fn.call | apply | bind (undefined | null) 时，函数 fn 内部的 this 指向 window。

### 实现（5）.add(3).minus(2),使其输出结果为：6

```javascript
(function(){
    function check(n){
        n=Number(n)
        return isNaN(n)? 0 : n
    }
    function add(n){
        n = check(n)
        return this + n
    }
    function minus(n){
        n = check(n)
        return this - n
    }
    ['add','minus'].forEach(item =>{
      Number.prototype[item]=eval(item)
    })
})()

考查知识点：类（构造函数）和实例以及在类的原型上自定义方法并且能实现链式调用。
要是实现链式调用的话，需要在函数执行后返回的数据的类型是对象数据类型。
```

### 创建对象的方式

> var obj = {};新建的对象继承了 Object 的显示原型
>
> ![image-20210303210653756](.\typora-user-images\image-20210303210653756.png)
>
> ```
> var descriptor = Object.create(null); // 没有继承任何属性，__proto__ 属性指向 null
> ```
>
> ![image-20210303210810563](.\typora-user-images\image-20210303210810563.png)

### Object.defineProperty 都有那些参数,以及参数解释

作用：直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。它是构造函数 Object 的函数对象上的方法。是一种更加高级的给对象添加属性的方法。

语法：Object.defineProperty(obj, prop, descriptor)

参数：

- obj：要定义属性的对象

- prop：要定义或修改的属性的名称或 `Symbol`

- descriptor：要定义或修改的属性描述符。*数据描述符*和*存取描述符*

  - **configurable**：当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认值：false
  - **enumerable**：当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中。默认为 `false`。

  - **value**：该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
  - **writable**：当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被`赋值运算符`改变。默认值：false

  - **get**：属性的 getter 函数，如果没有 getter，则为 `undefined`。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。默认为 `undefined`
  - **set**：属性的 setter 函数，如果没有 setter，则为 `undefined`。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象。默认为 `undefined`



返回值：被传递给函数的对象。

obj.key =value 和 Object.defineProperty 两类给对象添加属性的方法的具体差别：

obj.key =value，通过赋值操作添加的普通属性是可枚举的，在枚举对象属性时会被枚举到（`for...in` 或 Object.keys 方法），可以改变这些属性的值，也可以删除这些属性。

Object.defineProperty，这个方法允许修改默认的额外选项（或配置）。默认情况下，使用 `Object.defineProperty()` 添加的属性值是不可修改（immutable）的。

### 浏览器如何跨标签页通信

### localStorage、sessionStorage 与 Cookie 之间的区别

它们三者都是以 key=value 的形式存储数据的。都是存储在客户端。

cookie：**按照域名存储或者域名下的文件路径进行存储，在同一个域名或者同一域名的同一个文件目录及其子目录下的多个页面中是可以访问的**，不能跨浏览器使用。不足：每次发起 http 请求时，cookie 会被携带着一起发往服务器，消耗带宽，这样要 cookie 存储的数据大小要小。一次只能设置一条 cookie。在设置 cookie 时，每条的分号后面可以书写对本条 cookie 的描述，如过期时间和路径。

localStorage：可以在同一域名下的多个页面进行访问，且不会随着 http 请求发往服务端，它是持久化的本地存储，除非主动删除数据，否则数据是不会过期。

sessionStorage：只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。不能在同一个域名下的多个页面进行共享，只能在同一窗口下进行共享。只要页面不关闭，哪怕是硬性重加载也不会清除 sessionStorage 中的数据。

背景介绍

 cookie 非常小，它的大小限制为 4KB 左右。它的主要用途是保存登录信息，比如登录某个网站可以看到“记住密码”，这通常就是通过在 Cookie 中存入一段识别用户身份的数据来实现的。

 localStorage，它是 HTML5 标准中新加入的。在 IE 6 中，就有一个叫 userData 的用于本地存储，而当时考虑到浏览器的兼容性，更通用的方案是使用 Flash。现在，localStorage 已经被大多数浏览器所支持

 sessionStorage，它与 localStorage 的接口类似，但保存数据的生命周期与 localStorage 不同。它只是可以将一部分数据在当前会话中保存下来，刷新页面数据依旧存在。但当页面关闭后，sessionStorage 中的数据就会被清空。

区别

| 特性 | Cookie | localStorage | sessionStorage |
| --- | --- | --- | --- |
| 数据的生命期 | 一般由服务器生成，可设置失效时间。如果在浏览器端生成 Cookie，默认是关闭浏览器后失效 | 除非被清除，否则永久保存 | 仅在当前会话下有效，关闭页面或浏览器后被清除 |
| 存放数据大小 | 4K 左右,50 条左右 | 一般为 5MB | 一般为 5MB |
| 与服务器端通信 | 每次都会携带在 HTTP 头中，如果使用 cookie 保存过多数据会带来性能问题 | 仅在客户端（即浏览器）中保存，不参与和服务器的通信 | 仅在客户端（即浏览器）中保存，不参与和服务器的通信 |
| 易用性 | 需要程序员自己封装，源生的 Cookie 接口不友好 | 源生接口可以接受，亦可再次封装来对 Object 和 Array 有更好的支持 | 源生接口可以接受，亦可再次封装来对 Object 和 Array 有更好的支持 |

应用场景

 每个 HTTP 请求都会带着 Cookie 的信息，所以 Cookie 要小，比较常用的一个应用场景就是判断用户是否登录。针对登录过的用户，服务器端会在他登录时往 Cookie 中加入一段加密过的唯一辨识单一用户的辨识码，下次只要读取这个值就可以判断当前用户是否登录啦。曾经还使用 Cookie 来保存用户在电商网站的购物车信息，如今用 localStorage，HTML5 游戏通常会产生一些本地数据，localStorage 则是非常适合做这个工作的。如果遇到一些内容特别多的表单，为了优化用户体验，我们可能要把表单页面拆分成多个子页面，然后按步骤引导用户填写。这时候 sessionStorage 的作用就发挥出来了。

安全问题：

 不是什么数据都适合放在 Cookie、localStorage 和 sessionStorage 中的。使用它们的时候，需要时刻注意是否有代码存在 XSS 注入的风险。因为只要打开控制台，就随意修改它们的值，也就是说如果你的网站中有 XSS 的风险，它们就能对你的 localStorage 进行操作。所以不适合用它们存储你系统中的敏感数据。

基本 API：

| sessionStorage.setItem("key", "value"); | localStorage.setItem("site", "js8.in"); |
| --- | --- |
| var value = sessionStorage.getItem("key"); | var site = localStorage.getItem("site"); |
| sessionStorage.removeItem("key"); | localStorage.removeItem("site"); |
| sessionStorage.clear(); | localStorage.clear(); |
|  |  |
| document.cookie=‘key=value；expires=过期事件戳;path=/’ | 设置同名 cookie（相同路径下），作用是修改 |
| document.cookie=‘key=value；expires=‘new Date() | 设置过期时间戳等于删除 cookie |

```
var storage = window.localStorage;
for(var i=0, len=storage.length; i<len;i++){
    var key = storage.key(i);
    var value = storage.getItem(key);
    console.log(key + "=" + value);
}
```

扩展：

```
设置一个有时效性的cookie，在document.cookie='key=value;expires='+new Date()或者document.cookie='key=value;expires= 时间对象的字符串'。
new Date()返回的是终端时间，而不是世界标准时间。 而cookie的过期时间是用的世界标准时间，所以用new Date()产生的时间戳做过期时间时，要注意转换为世界标准时间。东八区时间要早于时间标准时间8个小时，如果设置expires时间为东八区早上的8点整，那么cookie是在东八区的下午16点整失效。
设置一个30s后失效的cookie：
var time = new Date()
var t1 = time.getTime()
var t2 = t1 -1000*60*60*8 + 1000*30
time.setTime(t2)
document.cookie = 'name=jack;expires'+ time

封装一个添加或者删除cookie的方法：
function handleCoolie(key,value,expires,path){
	let str = key + '='+ value
	if(expires){
		var time = new Date()
		var t1 = time.getTime()
		var t2 = t1 -1000*60*60*8 + 1000*30
		time.setTime(t2)
		str =str+';pexpires='time
	}
	if(path){
		str=str + 'path='+path
	}
	document.cookie=str
}

封装去获取cookie并以对象的形式输出：
function getCookie(){
	let obj={}
	if(document.cookie){
        let cookies = document.cookie.split(';')
        cookies.map(item=>{
            let cookieArray = item.split('=')
            obj[cookieArray[0]]=cookieArray[1]
        })
        return obj
	}else{
		return obj
	}
}
```

### 如何给 localStorage 加上 max-age 功能:

### requestAnimation

### 如何遍历对象(接下来会问有何不同)

### 搜索框输入需要注意的点(其实还是在问防抖)

### 原生实现 inserAfter

### 事件委托应用场景，e.target 和 e.currentTarget 区别

### HTTP 缓存，对应字段，Cache-Control 都有那些值

浏览器缓存一般都是针对静态资源，比如 js、css、图片等。

**缓存相关的请求|响应头**

- Expires：响应头，代表该资源的过期时间。
- Cache-Control：请求/响应头，缓存控制字段，精确控制缓存策略。
- If-Modified-Since：请求头，资源最近修改时间，由浏览器告诉服务器。
- Last-Modified：响应头，资源最近修改时间，由服务器告诉浏览器。
- Etag：响应头，资源标识，由服务器告诉浏览器。
- If-None-Match：请求头，缓存资源标识，由浏览器告诉服务器。
- 配对使用的字段：
  - If-Modified-Since 和 Last-Modified
  - Etag 和 If-None-Match

**原始模型**

- 浏览器请求静态资源 a.js。（请求头：1KB）

- 服务器读取磁盘文件 a.js，返给浏览器。（10KB（a.js）+1KB（响应头） = 11KB）。

- 浏览器再次请求，服务器又重新读取磁盘文件 a.js，返给浏览器。

- 如此循环，L（流量） = N（访问次数） \* 12。

- 该方式缺点很明显：

  - 浪费用户流量。
  - 浪费服务器资源，服务器要读磁盘文件，然后发送文件到浏览器。
  - 浏览器要等待 a.js 下载并且执行后才能渲染页面，影响用户体验。

  > js 执行时间相比下载时间要快的多，如果能优化下载时间，用户体验会提升很多。

**浏览器增加缓存机制**

- 浏览器第一次请求 a.js，缓存 a.js 到本地磁盘。（1+10+1 =12KB）
- 浏览器再次请求 a.js，直接走浏览器缓存（200，from cache），不再向服务器发起请求。（0KB）
- L（流量） = 12KB。
- 优点：
  - 大大减少带宽。
  - 由于减少了 a.js 下载时间，相应的提高了用户体验。
- 缺点：服务器上 a.js 更新时，浏览器感知不到，拿不到最新的 js 资源。

**服务器和浏览器约定资源过期时间机制**

- 用 Expires 字段来控制（响应头信息）

- 浏览器第一次请求一个静态资源 a.js。（1KB）

- 服务器把 a.js 和 a.js 的缓存过期时间(Expires：Mon, 26 Sep 2018 05:00:00 GMT)发给浏览器。（10+1=11KB）

- 浏览器接收到 a.js，同时记住了过期时间。

- 在 2018 年 9 月 26 日 5 点之前，浏览器再次请求 a.js，便不再请求服务器，直接使用上一次缓存的 a.js 文件。（0KB）

- 在 2018 年 9 月 26 日 5 点 01 分，浏览器请求 a.js，发现 a.js 缓存时间过了，于是不再使用本地缓存，而是请求服务器，服务器又重新读取磁盘文件 a.js，返给浏览器，同时告诉浏览器一个新的过期时间。（1+10+1=12KB）。

- 如此往复。

- 优势：

  - 在过期时间以内，为用户省了很多流量。
  - 减少了服务器重复读取磁盘文件的压力。
  - 缓存过期后，能够得到最新的 a.js 文件。

  缺点还是有：

  - 缓存过期以后，服务器不管 a.js 有没有变化，都会再次读取 a.js 文件，并返给浏览器。

**服务器告诉浏览器资源上次修改时间机制**

服务器每次返回 a.js 的时候，还要告诉浏览器 a.js 在服务器上的最近修改时间 Last-Modified （GMT 标准格式）。

浏览器访问 a.js 文件。（1KB）

服务器返回 a.js 的时候，告诉浏览器 a.js 文件。（10+1=11KB） 在服务器的上次修改时间 Last-Modified（GMT 标准格式）以及缓存过期时间 Expires（GMT 标准格式）

当 a.js 过期时，浏览器带上 If-Modified-Since（等于上一次请求的 Last-Modified） 请求服务器。（1KB）

服务器比较请求头里的 Last-Modified 时间和服务器上 a.js 的上次修改时间：

- 如果一致，则告诉浏览器：你可以继续用本地缓存（304）。此时，服务器不再返回 a.js 文件。（1KB）

- 如果不一致，服务器读取磁盘上的 a.js 文件返给浏览器，同时告诉浏览器 a.js 的最近的修改时间 Last-Modified 以及过期时间 Expires。（1+10=11KB）

- 如此往复。

- 优点：

  - 缓存过期后，服务器检测如果文件没变化，不再把 a.js 发给浏览器，省去了 10KB 的流量。
  - 缓存过期后，服务器检测文件有变化，则把最新的 a.js 发给浏览器，浏览器能够得到最新的 a.js。

- 缺点：

  - Expires 过期控制不稳定，因为浏览器端可以随意修改时间，导致缓存使用不精准。

  - Last-Modified 过期时间只能精确到秒。

    1、如果 a.js 在一秒时间内经常变动，同时服务器给 a.js 设置无缓存，那浏览器每次访问 a.js，都会请求服务器，此时服务器比较发给浏览器的上次修改时间和 a.js 的最近修改时间，发现都是在同一时间（因为精确到秒），因此返回给浏览器继续使用本地缓存的消息（304），但事实上服务器上的 a.js 已经改动了好多次了。所以这种情况，浏览器拿不到最新的 a.js 文件。

    2、如果在服务器上 a.js 被修改了，但其实际内容根本没发生改变，会因为 Last-Modified 时间匹配不上而重新返回 a.js 给浏览器。

**增加相对时间的控制，引入 Cache-Contorl 机制**

服务器除了告诉浏览器 Expires ，同时告诉浏览器一个相对时间 Cache-Control：max-age=10 秒。意思是在 10 秒以内，使用缓存到浏览器的 a.js 资源。浏览器先检查 Cache-Control，如果有，则以 Cache-Control 为准，忽略 Expires。如果没有 Cache-Control，则以 Expires 为准。

**增加文件内容对比，引入 Etag 机制**

为了解决文件修改时间只能精确到秒带来的问题，我们给服务器引入 Etag 响应头，a.js 内容变了，Etag 才变。内容不变，Etag 不变，可以理解为 Etag 是文件内容的唯一 ID。 同时引入对应的请求头 If-None-Match，每次浏览器请求服务器的时候，都带上 If-None-Match 字段，该字段的值就是上次请求 a.js 时，服务器返回给浏览器的 Etag。

- 浏览器请求 a.js。

- 服务器返回 a.js，同时告诉浏览器过期绝对时间（Expires）以及相对时间（Cache-Control：max-age=10），以及 a.js 上次修改时间 Last-Modified，以及 a.js 的 Etag。

- 10 秒内浏览器再次请求 a.js，不再请求服务器，直接使用本地缓存。

- 11 秒时，浏览器再次请求 a.js，请求服务器，带上上次修改时间 If-Modified-Since 和上次的 Etag 值 If-None-Match。

- 服务器收到浏览器的 If-Modified-Since 和 Etag，发现有 If-None-Match，则比较 If-None-Match 和 a.js 的 Etag 值，忽略 If-Modified-Since 的比较。

- a.js 文件内容没变化，则 Etag 和 If-None-Match 一致，服务器告诉浏览器继续使用本地缓存（304）。

- 如此往复。

不管用 Expires 还是 Cache-Control，他们都只能够控制缓存是否过期，但是在缓存过期之前，浏览器是无法得知服务器上的资源是否变化的。只有当缓存过期后，浏览器才会发请求询问服务器。

**最终方案**

不让 html 文件缓存，每次访问 html 都去请求服务器。所以浏览器每次都能拿到最新的 html 资源。a.js 内容更新的时候，我们修改一下 html 中 a.js 的版本号。通过设置 html 不缓存，html 引用资源内容变化则改变资源路径的方式，就解决了无法及时得知资源更新的问题。当然除了以版本号来区分，也可以以 MD5hash 值来区分。使用 webpack 打包的话，借助插件可以很方便的处理。

Cache-Control 除了可以设置 max-age 相对过期时间以外，还可以设置成如下几种值：

- public，资源允许被中间服务器缓存。浏览器请求服务器时，如果缓存时间没到，中间服务器直接返回给浏览器内容，而不必请求源服务器。
- private，资源不允许被中间代理服务器缓存。浏览器请求服务器时，中间服务器都要把浏览器的请求透传给服务器。
- no-cache，浏览器不做缓存检查。每次访问资源，浏览器都要向服务器询问，如果文件没变化，服务器只告诉浏览器继续使用缓存（304）。
- no-store，浏览器和中间代理服务器都不能缓存资源。每次访问资源，浏览器都必须请求服务器，并且，服务器不去检查文件是否变化，而是直接返回完整的资源。
- must-revalidate，可以缓存，但是使用之前必须先向源服务器确认。
- proxy-revalidate，要求缓存服务器针对缓存资源向源服务器进行确认。
- s-maxage：缓存服务器对资源缓存的最大时间。

### new 过程都发生了什么和模拟

函数体内部判断一个函数是否是通过 new 关键字进行调用的：

```js
function Fun() {
  if (this instanceof Fun) {
    console.log('该函数是通过new方式调用的');
  }
}
```

发生的事情（所作的操作）：

- 创建一个全新的对象并返回
- 该全新的对象的`__proto__`属性指向使用 new 调用的这个函数的显式原型 prototype
- 执行该用 new 调用的函数的函数体代码，并且这些代码中的 this 指的是上面创建的全新实例对象
- 在 new 调用的函数的 函数体中有主动返回值时，当返回值是基本数据类型时则忽略这类返回值而直接返回创建好的全新的对象，当返回值是引用数据类型时则直接返回该引用类型的值而不再返回创建的全新对象

粗略版本的 new 实现：

```js
function mockNew(constructor,...args){
	let obj ={}
    obj.__proto__ = constructor.prototype
    let result = constructor.call(obj,...args)
    if(result intanceof Object && !(result intanceof constructor)){
        return result
    }
    return obj
}
```

完整版本的 new 实现：

```js
function myNew(constructorFun, ...args) {
  //如果constructorFun不是函数的话直接报错
  if (!(typeof constructorFun === 'function')) {
    throw Error('newOperator function the first param must be a function');
  }
  //使用 Object.create创建一个全新的对象并且对象的隐式原型指向constructorFun.prototype的显式原型
  let newObj = Object.create(constructorFun.prototype);

  //执行constructorFun函数体代码并将函数体中this指向新创建的实例对象
  let returnObj = constructorFun.call(newObj, ...args);

  //判断执行完函数体后是否主动返回值并判断返回值的类型以确定最后函数的返回值
  if ((typeof returnObj === 'object' && returnObj !== null) || typeof returnObj === 'function') {
    return returnObj;
  } else {
    return newObj;
  }
}
```

```js
Object.create(proto, [propertiesObject]) 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 它接收两个参数，不过第二个可选参数是属性描述符（不常用，默认是undefined）。
```

```js
Object.create = function (proto, propertiesObject) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object: ' + proto);
  } else if (proto === null) {
    throw new Error(
      "This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."
    );
  }

  if (typeof propertiesObject != 'undefined')
    throw new Error(
      "This browser's implementation of Object.create is a shim and doesn't support a second argument."
    );

  function F() {}
  F.prototype = proto;
  return new F();
};
```

### 跳出 forEach 循环

 开发时用到 for 语句对数组进行循环，在对数组进行循环时一般会定义一些变量（如数组长度、索引）。在 ES6 之前只存在函数作用域与全局作用域，这就导致循环中定义的变量名在循环结束后外泄。在平时的开发中，在循环中当满足某个条件时，可以使用 return 或 break 来退出 for 循环。其实从严格意义上来说，return 并不是中止了 for 循环，而是中止的 for 循环所在的那个函数。函数中止了连带中止的 for 循环。

 在 es5 中如果我们使用 foeEach 来对数组进行循环，是无法使用 return 或者 break 退出 forEach 循环的，如下面的代码：

```javascript
var arr=[1,2,3,4,5,6]
arr.forEach(item=>{
    console.log(item)
    if(item === 2) return
})    //输出结果：1 2 3 4 5 6     return语句没有生效


var arr=[1,2,3,4,5,6]
arr.forEach(item=>{
    console.log(item)
    if(item === 2) {break}
})   //Uncaught SyntaxError: Illegal break statement   直接报错

break语句在js的执行器中，它只能出现在for循环体内部或者swith语句中。如果break出现在函数当中，那么解释器就会报错，上面代码中，break 出现在了箭头函数中。
```

 为什么使用 return 与 break 都不能结束 forEach 循环的原因：

```javascript
var arr=[1,2,3,4,5,6]
arr.forEach(item=>{
    console.log(item)
    if(item === 2) return //或者 break
})    //输出结果：1 2 3 4 5 6     return语句没有生效

上面的代码等价于下面的代码：

for(let i=0,len=arr.length;i<len;i++){
    (arr=>{
        console.log(arr[i])
        if(arr[i]===2) return  //或者break
    })(arr)
}   //当return时，其实只是中止了当此的箭头函数的执行，并没有中止外层的for循环
```

中止 forEach（）循环的方法：

```javascript
没有办法中止或者跳出forEach（）循环，除非抛出异常。
//方式一：
var arr=[1,2,3,4,5,6]
try{
    arr.forEach(item=>{
        console.log(item)
        if(item === 2) throw item
    })
}catch(e){}

//方式二：让循环体在条件满足时跑空,flag命名空间污染，forEach循环次数并未减少
var arr=[1,2,3,4,5,6]
var flag
arr.forEach(item=>{
    if(!flag){
        console.log(item)
        if(item === 2) flag=true
    }
})

//改进：forEach接收第二个参数，代表循环体中的this指向,避免了命名空间污染
var arr=[1,2,3,4,5,6]
arr.forEach(item=>{
    if(!this.flag){
        console.log(item)
        if(item === 2) this.flag=true
    }
}，{})

//方式三：
var arr=[1,2,3,4,5,6]
arr.forEach((item,i)=>{
    console.log(item)
    if(item === 2){
       arr=arr.splice(0)
    }
}，{})
```

forEach(callback)循环执行逻辑：

- callback 会执行多少次，一开始就有数组的长度决定了，如果在 callback 中增加个该数组的长度也不会增加 callback 被执行的次数。

  ![image-20210318220940121](.\typora-user-images\image-20210318220940121.png)

  ![image-20210318220448286](.\typora-user-images\image-20210318220448286.png)

- callback 执行时对应的值是以索引为参考的

  ```
  var arr=[1,2,3,4,5]

  arr.forEach(item=>{
    console.log(item)  //1  1  1  1  1
    arr.unshift(123)
  })
  arr  //[123,123,123,123,123,1,2,3,4,5]
  ```

- 如果传入的值不存在，那 forEach 循环自动结束。

### 循环调用异步操作

```javascript
for (var i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 5 5 5 5 5
  }, i * 1000);
}

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 0 1 2 3 4
  }, i * 1000);
}

for (var i = 0; i < 5; i++) {
  (function (i) {
    setTimeout(() => {
      console.log(i); // 0 1 2 3 4
    }, i * 1000);
  })(i);
}

for (var i = 0; i < 5; i++) {
  (function () {
    setTimeout(() => {
      console.log(i); // 5 5 5 5 5
    }, i * 1000);
  })(i);
}

for (var i = 0; i < 5; i++) {
  setTimeout(
    (function (i) {
      console.log(i); // 0 1 2 3 4
    })(i),
    i * 1000
  );
}
//做错，node环境下报错，在浏览器环境下 0 1 2 3 4 ，对于setTimeout，传入第一个参数是自执行函数时，等价于setTimeout(undefine,i*1000),自执行函数直接执行了。

setTimeout(() => {
  console.log(1);
}, 0);
new Promise(function (resolve, reject) {
  console.log(2);
  resolve();
  console.log(3);
}).then((data) => {
  console.log(4);
});
console.log(5);
//2 3 5 4 1
```

### 空数组比较

```
[] == ![]  //true
```

逻辑非（ ！）会让数据先用 Boolean（）转为布尔值后再取反。对象 == 布尔 ，都转为数字后再比较 。

运算优先级。

### 使用 Promise 加载一个网络图片，如果加载失败返回一张默认图片占位

```
function loadImg(src){
	let img = new Image()
	return new Promise(resolve,reject){
		img.src = src
		document.body.appendChild(img)
		img.onload = ()=>{
			resolve(isuccessed
		}
		img.onerror =function (){
			img.src= '失败图片的URL'
		 	reject('图片加载失败')
		}
	}
}
loadImg('./images/01.jpg').then(value)=>{
	console.log(value)
}，(reason)=>{
	console.log(reason)
})
```

### 图片上传的预览

```javascript
<div id="preview"></div>
<input type="file" onchange="preview(this)" />

function preview(file) {
    //file 就是上面的input文件传入控件
    var prevDiv = document.getElementById('preview');  //获取预览盒子
    if (file.files && file.files[0]) {   //判断文件控件中是否传入文件并有一项内容
        var reader = new FileReader();
        reader.onload = function (evt) {
            prevDiv.innerHTML = '<img src="' + evt.target.result + '" />';
        }
        reader.readAsDataURL(file.files[0]);
    }else {
        prevDiv.innerHTML ='<div class="img" style="src=\'' + file.value + '\'"></div>';
    }
}

知识点:
对于type = "file"的表单控件，它的change时间被触发时，可以将该控件以this传入处理函数中。
FileReader，它是一个构造函数，它的实例对象上有异步读取存储在用户计算机上的文件的内容的方法。
```

有必要详细了解一下 FileReader 的实例对象：

实例的属性：

- error (只读)：表示在读取文件时发生的错误 。

- readyState（只读）：表示`FileReader`状态的数字。取值如下

  | 常量名    | 值  | 描述                  |
  | --------- | --- | --------------------- |
  | `EMPTY`   | `0` | 还没有加载任何数据.   |
  | `LOADING` | `1` | 数据正在被加载.       |
  | `DONE`    | `2` | 已完成全部的读取请求. |

- result（只读）:在调用该对象实例上的异步读取文件的方法成功后。该对象的 result 属性将会有读取操作完成后的文件数据，数据的格式取决于：使用哪个方法来启动读取操作。

实例对象的事件：

- onabort:该事件在读取操作被中断时触发。

- onerror:该事件在读取操作发生错误时触发。

- onload:该事件在读取操作完成时触发。

- onloadstart:该事件在读取操作开始时触发。

- onloaded:该事件在读取操作结束时（要么成功，要么失败）触发。

- onprogress:该事件在读取`Blob`时触发。

  以上这些实践都可以使用 addEventListener 绑定

实例对象的方法：

- abort（）
- readAsArrayBuffer()
- readAsBinaryString()
- readAsDataURL()
- readAsText()

### 从用户输入 URL 后带页面渲染成功整个过程（越细越好）

可以考虑三种情况：

- 用户输入关键字，浏览器会用默认的搜索引擎根据关键字生成地址，开始导航
- 用户输入域名
- 用户输入 IP 地址

浏览器进程会准备一个渲染进程用于渲染页面，网络进程进行资源加载，最终将加载的资源通过 ipc 交给渲染进程来处理，到渲染完成。

### 网络七层模型：

- 应用层
  - 应用层
  - 表示层
  - 会话层
- 传输层
- 网络层
- 链路层
  - 数据链路层
  - 物理层

### 三次握手过程中的通信内容：

- 标志位：

  - SYN（同步序列编号）
  - ACK（确认字符）

- 状态：
  - listen：监听 TCP 端口的连接请求
  - syn-sent：在发送连接请求后等待匹配的连接请求
  - syn-received：在收到和发送一个连接请求后等待对连接请求的确认
  - establised：代表一个打开的连接，数据可以传送给用户

![image-20210326142055430](.\typora-user-images\image-20210326142055430.png)

![image-20210326142129962](.\typora-user-images\image-20210326142129962.png)

### vue 中 delete 与 vue.delete 删除数组的不同

### forEach、for in 、for of 的区别

### DOM0 级事件与 DOM2 级事件

dom0 语法：element. on 事件名=function(){}

dom2 语法：element.addEventListener('事件名‘，function(){})

运行机制：

dom0 是给元素的某个事件属性绑定方法（同一个事件属性的有效的绑定只有一个，后面能覆盖前面的）

dom2 是基于事件池机制完成，给同一个元素某个事件属性每增加一个绑定的方法，都会往事件池中存放一个。当事件被触发时会依次执行事件池中的事件。dom2 中可以给一些特殊的事件类型绑定方法，这些事件类型 dom0 中不支持，例如：DOMContentLoaded、transitionend...

### jQuery 中$(document).ready（）【$(function(){})】与 window.onload 的区别

window.onload 是 dom0 级事件绑定，所以在同一个页当中，window.onload 只能绑定一个有效方法。load 事件是在页面 dom 结构和其他所有资源都加载完成后再触发。

$(document).ready（）是基于 dom2 级事件绑定的，可以绑定多个方法。它是用的 DOMContentLoaded 事件，所以绑定的函数会在 dom 结构加载完成就立即触发。

新版本浏览器会根据元素和事件类型对新增的方法做重复校验，但是 ie6-ie8 不行。

当事件行为触发，会把事件池中的方法按照添加的顺序依次执行，但是 ie6-ie8 中执行的顺序是不固定的。

ie6-8 中事件对象要自己主动以 window.event 的方式传入。且事件只有冒泡阶段。

### dom2 的事件池机制

- 基于 addEventListener/attachEvent（）【ie6-ie8】向事件池中追加方法

- removeEventListener/detachEvent（）从事件池中移除方法

### 交换两个变量的值

方式一：

```javascript
var a = 10,
  b = 20,
  c;
c = a;
a = b;
b = c;
c = null;
```

方式二：

```JavaScript
var a=10,b=20
a=a+b
b=a-b
a=a-b
```

方式三：

```javascript
var a = 10,
  b = ((20)[(a, b)] = [b, a]);
```

方式四：

```javascript
var a = 10,
  b = 20;
a = [a, b];
b = a[0];
a = a[1];
```

方式五：

```javascript
var a = 10,
  b = 20;
a = { a: a, b: b };
b = b.a;
a = a.b;
```

方式六：（数组不仅仅可以保存数据，还可以让数据运算后再保存下来）

```javascript
var a = 10,
  b = 20;
a = [b, (b = a)][0];
```

方式七：（按位异或法）两个数字的对应二进制位中，同一位上的数字取 0，不同取 1

```javascript
var a = 10,
  b = 20;
a = a ^ b;
b = b ^ a;
a = a ^ b;
```

### 服务端渲染（SSR）与客户端渲染（SPA）

服务端渲染：将组件或页面在服务器端完成数据填充、渲染，生成客户端要展示的 html 字符串，再发送到浏览器解析 HTML。（ fat-server, thin-client 模式）

![image-20210210202734993](.\typora-user-images\image-20210210202734993.png)

客户端渲染：html 仅作为静态文件，客户端在请求时，服务端不做任何处理，直接以原文件的形式返回给客户端客户端，然后根据 html 上的 JavaScript（ajax），访问服务器端提供的一些 api 使得客户端端可以获取到数据，然后客户端拿到 json 数据之后再在客户端进行 html 页面的拼接，然后展示在浏览器上。（fat-client, thin-server 模式）

![image-20210210202835358](.\typora-user-images\image-20210210202835358.png)

两者的区别：谁来完成 html 文件的完整拼接。

服务端渲染优缺点

- 优点
  - **客户端页面展示耗时少**
  - **有利于 SEO**
  - **无需占用客户端资源**。即解析模板的工作完全交由后端来做，客户端只要解析标准的 html 页面即可。
  - **后端生成静态化文件**。即生成缓存片段，这样就可以减少数据库查询浪费的时间了，且对于数据变化不大的页面非常高效 。
- 缺点：
  - **不利于前后端分离，开发效率低。**无法进行分工合作。
  - **占用服务器端资源**

客户端渲染你优缺点

- 优点
  - **前后端分离**。前端专注于前端 UI，后端专注于 api 开发，且前端有更多的选择性，而不需要遵循后端特定的模板。
  - **体验更好**。可以使体验更接近于原生 app。
- 缺点
  - **前端响应较慢**。如果是客户端渲染，前端还要进行拼接字符串的过程，需要耗费额外的时间，不如服务器端渲染速度快。
  - **不利于 seo**

### 数组去重

方式一：

```javascript
for(let i=0;i<arr.length;i++){
    let item=arr[i]
    for(let j = i+1 ;j<arr.length; j++){
      if( item === arr[j]){
        arr.splice(j,1)  //数组塌陷
        j--
     }
   }
}
优化：
for(let i=0;i<arr.length;i++){
    let item=arr[i]
    for(let j = i+1 ;j<arr.length; j++){
      if( item === arr[j]){
        arr[j]=arr[length - 1]
        arr.length--
        j--
     }
   }
}


let arr =[1,2,3,4,5,6,7,89,8,2,7,6,1,2,6,6,6,6,6,5]
let temparr=[]
for(let i=0;i<arr.length;i++){
    let item = arr[i]
    if(temparr.includes(item)){
        continue
    }else{
        temparr.push(item)
    }
}
console.log(temparr);
```

方式二：

```javascript
let obj={}
for(let i=0;i<arr.length;i++){
    let item =arr[i]
    if(obj[item] !== undefined){
        arr[j]=arr[length - 1]
        arr.length--
        j--
        continue
    }
    obj[item] =item
}

只有一个循环，性能更好
如果数组中的元素存在对象类型的元素，或者字符串类型的数字，也可能出现重复的问题，如果元素本来就是undefined，也会出问题。
```

方式三：

```javascript
arr = Array.from(new Set(arr));

arr = [...new Set(arr)];

arr.filter((item, index) => {
  return arr.indexOf(item) === index;
});
```

### 性能测试

```javascript
方式一：
let t1 = new Date()
执行的代码段
console.log(new Date() - t1)

方式二：（更加精确）
console.time('标识符')
执行的代码段
console.timeEnd('标识符')
```

### 笔试题

```javascript
var a={}, b='123', c=123
a[b]='b'
a[c]='c'
console.log(a[b])

考查点：对象中非对象类型的数据做属性名时，该数据与该数据的字符串形式操作的同一个属性名对应的属性值。

var a={}, b=Symbol('123'), c=Symbol('123')
a[b]='b'
a[c]='c'
console.log(a[b])

考查点：Symbol类型的数据是唯一的不和任何其他Symbol类型数据相等。

var a={}, b={'abc':123}, c={'asd':456}
a[b]='b'
a[c]='c'
console.log(a[b])

考查点：对象类型的数据被用做另一个对象的属性名时，该数据会被转为字符串类型(toString()方法)的数据之后再作为另一个对象的属性名使用。{}=>"[object  Object]"  [10,20] =>"10,20"



function Foo(){
	Foo.a =function(){
        console.log(1)
    }
    this.a=function(){
        console.log(2)
    }
}
Foo.prototype.a=function(){
    console.log(3)
}
Foo.a=function(){
    console.log(4)
}

Foo.a()
let obj=new Foo()
obj.a()
Foo.a()
```

```
var test = (function(i){
  return function(){
  	alert(i*2)
  }
})(2)
test(5)

输出结果是字符串"4",而不是数字4。
```

#### 做错

```
var a = 0,b = 0
function A(a){
	A = function(b){
		alert(a + b++)
	}
	alert(a++)
}
A(1)
A(2)

```

![image-20210220230642003](.\typora-user-images\image-20210220230642003.png)

#### 阿里巨难面试

```
function Foo(){
    getName = function(){
        console.log(1);
    };
    return this;
}

Foo.getName = function(){
    console.log(2);
}

Foo.prototype.getName = function(){
    console.log(3);
}

var getName = function(){
    console.log(4);
}

function getName(){
    console.log(5);
}
Foo.getName()
getName()
Foo().getName()
getName()
new Foo.getName()
new Foo().getName()
new new Foo().getName()



//输出以下的输出结果

//函数Foo的静态方法
Foo.getName();//2

//function getName有提前声明的规则，声明后被var getName= 。。覆盖，则getName为4
getName();//4

//Foo()的return this为window，window.getName 在Foo里面被覆盖，则输出1
Foo().getName();//1

//同上，因调用了Foo();window的getName被覆盖
getName();//1

//依然只是调用了Foo对象上的getName,又因为Foo.getNname，所以相当于
/**
 *  function a(){console.log(2)};
 *  new a();
 * **/
new Foo.getName();//2

//先执行了new Foo()；返回一个对象，这个对象的getName为prototype上的getName,相当于(new Foo()).getName();
new Foo().getName();//3

//
new new Foo().getName();//3

错在没有弄清除运算符的优先级：具体优先级看该链接
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
```

| 优先级 | 运算类型 | 关联性 | 运算符 |
| :-- | :-- | :-- | :-- | --- | --- |
| 21 | [`圆括号`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Grouping) | n/a（不相关） | `( … )` |
| 20 | [`成员访问`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#点符号表示法) | 从左到右 | `… . …` |
| 20 | [`需计算的成员访问`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#括号表示法) | 从左到右 | `… [ … ]` |
| 20 | [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) (带参数列表) | n/a | `new … ( … )` |
| 20 | [函数调用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions) | 从左到右 | `… ( … )` |
| 20 | [可选链（Optional chaining）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining) | 从左到右 | `?.` |
| 19 | [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) (无参数列表) | 从右到左 | `new …` |
| 18 | [后置递增](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Increment)(运算符在后) | n/a | `… ++` |
| 18 | [后置递减](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Decrement)(运算符在后) | n/a | `… --` |
| 17 | [逻辑非](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_NOT) | 从右到左 | `! …` |
| [按位非](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT) | `~ …` |  |  |
| [一元加法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus) | `+ …` |  |  |
| [一元减法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_negation) | `- …` |  |  |
| [前置递增](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Increment) | `++ …` |  |  |
| [前置递减](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Decrement) | `-- …` |  |  |
| [typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof) | `typeof …` |  |  |
| [void](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void) | `void …` |  |  |
| [delete](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete) | `delete …` |  |  |
| [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) | `await …` |  |  |
| 16 | [幂](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Exponentiation) | 从右到左 | `… ** …` |
| 15 | [乘法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Multiplication) | 从左到右 | `… * …` |
| [除法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Division) | `… / …` |  |  |
| [取模](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Remainder) | `… % …` |  |  |
| 14 | [加法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Addition) | 从左到右 | `… + …` |
| [减法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Subtraction) | `… - …` |  |  |
| 13 | [按位左移](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) | 从左到右 | `… << …` |
| [按位右移](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) | `… >> …` |  |  |
| [无符号右移](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) | `… >>> …` |  |  |
| 12 | [小于](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Less_than_operator) | 从左到右 | `… < …` |
| [小于等于](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Less_than__or_equal_operator) | `… <= …` |  |  |
| [大于](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Greater_than_operator) | `… > …` |  |  |
| [大于等于](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Greater_than_or_equal_operator) | `… >= …` |  |  |
| [in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in) | `… in …` |  |  |
| [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) | `… instanceof …` |  |  |
| 11 | [等号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality) | 从左到右 | `… == …` |
| [非等号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Inequality) | `… != …` |  |  |
| [全等号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity) | `… === …` |  |  |
| [非全等号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Nonidentity) | `… !== …` |  |  |
| 10 | [按位与](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_AND) | 从左到右 | `… & …` |
| 9 | [按位异或](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_XOR) | 从左到右 | `… ^ …` |
| 8 | [按位或](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_OR) | 从左到右 | `… | …` |
| 7 | [逻辑与](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_AND) | 从左到右 | `… && …` |
| 6 | [逻辑或](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_OR) | 从左到右 | `… |  | …` |
| 5 | [空值合并](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) | 从左到右 | `… ?? …` |
| 4 | [条件运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) | 从右到左 | `… ? … : …` |
| 3 | [赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators) | 从右到左 | `… = …` |
| `… += …` |  |  |  |
| `… -= …` |  |  |  |
| `… **= …` |  |  |  |
| `… *= …` |  |  |  |
| `… /= …` |  |  |  |
| `… %= …` |  |  |  |
| `… <<= …` |  |  |  |
| `… >>= …` |  |  |  |
| `… >>>= …` |  |  |  |
| `… &= …` |  |  |  |
| `… ^= …` |  |  |  |
| `… | = …` |  |  |  |
| `… &&= …` |  |  |  |
| `… |  | = …` |  |  |  |
| `… ??= …` |  |  |  |
| 2 | [yield](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield) | 从右到左 | `yield …` |
| [yield\*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*) | `yield* …` |  |  |
| 1 | [展开运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator) | n/a | `...` … |
| 0 | [逗号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comma_Operator) | 从左到右 | `… , …` |

### 数组 reduce 方式实现

```javascript
Array.prototype.myreduce = function (callback, initalValue) {
  let result;
  if (initalValue) {
    result = initalValue;
    for (let i = 0; i < this.length; i++) {
      result = callback(result, this[i], i, this);
    }
  } else {
    result = this[0];
    for (let i = 1; i < this.length; i++) {
      result = callback(result, this[i], i, this);
    }
  }
  return result;
};
```

### 实现数组 filter 方法

```javascript
Array.prototype.myfilter = function (callback, context = this) {
  let tempArr = [];
  for (let index = 0; index < this.length; index++) {
    const element = this[index];
    let flag = callback.call(context, element, index, this);
    if (flag) {
      tempArr.push(element);
    }
  }
  return tempArr;
};
```

### 让函数必须以 new 的方式调用

```javascript
var Parent = function Parent(name) {
    //this :类实例或者window或其它
    //Parent :构造函数本身
    _classCallCheck(this, Parent);
    this.name = name;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor) {
        throw new TypeError("Cannot call a function without 'new'");
    }
}
```

### Object.prototype.toString.call()

```javascript
function isType(type) {
  return function (param) {
    return Object.prototype.toString.call(param) === `[object ${type}]`;
  };
}
```

### Webworker 多线程

特点：

- 完全受主线程控制
- 不能操作 DOM

### 任务队列

try 中放 return，finally 还是否会执行

### 数组与对象的区别

### 封装与拆箱

### 如何解析一段四则运算字符串（’2+5\*6-8/2+6+8‘）

### mouseover 和 mouseenter 的区别

`mouseover`和`mouseenter`对应的是`mouseout`和`mouseleave`

1. 是否支持冒泡

   - onmouseover 事件支持冒泡，onmouseenter 事件不冒泡。

      只有当鼠标指针在对象的边界之外并且用户将鼠标指针移动到对象的边界内（从 border 开始算起）时，事件才会触发。如果鼠标指针当前在对象的边界内，则为了触发事件，用户必须将鼠标指针移动到对象的边界外，然后再回到对象的边界内。

      一个元素有子元素时，对于绑定有 onmouseenter 事件的父元素而言，当鼠标由父元素移入到子元素内时，不会触发父元素的 onmouseenter 事件。由子元素移出到父元素时，也不会触发 onmouseenter，因为都相当于在父元素的内部。

      一个元素有子元素时，对于绑定有 onmouseover 事件的父元素而言，当鼠标由父元素移入到子元素内时，会触发父元素的 onmouseover 事件。由子元素移出到父元素时，也会触发 onmouseover。

#### 用 mouseover 模拟 mouseenter 的实现

关键点：event.relatedTarget 、 event.target、node.contains(otherNode)

1. relatedTarget 事件属性返回与事件的目标节点相关的节点。
2. 对于 mouseover 事件来说，relatedTarget 属性是鼠标指针移到目标节点上时所离开的那个节点。
3. 对于 mouseout 事件来说，relatedTarget 属性是离开目标时，鼠标指针进入的节点。

### offset 系列（动态的）

都是只读属性，都不带单位。

- HTMLElement.offsetParent：指的是距该元素最近的`position`不为 static 的祖先元素，如果没有则指向`body`元素。或者最近的 table,td,th,body 元素。当元素的 style.display 设置为 "none" 时，`offsetParent` 返回 `null`。
- HTMLElement.offsetTop：它返回当前元素相对于其 `offsetParent`元素的顶部边框的距离。
- HTMLElement.offsetLeft：它返回当前元素相对于其 `offsetParent`元素的左边边框的距离。
- HTMLElement.offsetWidth：返回一个元素的布局宽度，包含元素的边框(border)、水平线上的内边距(padding)、竖直方向滚动条(scrollbar)（如果存在的话）、以及 CSS 设置的宽度(width)的值。
- HTMLElement.offsetHeight：返回该元素的像素高度，高度包含该元素的垂直内边距和边框，且是一个整数。包括元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话），不包含:before 或:after 等伪类元素的高度。

![image-20210303094929374](.\typora-user-images\image-20210303094929374.png)

offset 系列与 style 的区别：

- offset 可以得到任意样式表中的样式值
- offset 系列获得的数值是没有单位的
- offsetWidth 包含 padding+border+width
- offsetWidth 等属性是只读属性，只能获取不能赋值
- 获取元素大小位置，用 offset 更合适

- style 只能得到行内样式表中的样式值
- style.width 获得的是带有单位的字符串
- style.width 获得不包含 padding 和 border 的值
- style.width 是可读写属性，可以获取也可以赋值
- 要给元素更改值，则需要用 style 改变

### client 系列（动态的）

只读属性

- Element.clientWidth：属性表示元素的内部宽度，以像素计。该属性包括内边距 padding，但不包括边框 border、外边距 margin 和垂直滚动条（如果有的话）。当在根元素(<html>元素)上使用 clientWidth 时(或者在<body>上，如果文档是在 quirks(怪异)模式下)，将返回 viewport 的宽度(不包括任何滚动条)

- Element.clientHeight：它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。

- element.clientTop：一个元素顶部**边框的宽度**（以像素表示）。不包括顶部外边距或内边距。`clientTop` 是只读的。

- element.clientLeft：一个元素左**边框的宽度**（以像素表示）。不包括外边距或内边距。`clientLeft 是只读的。

![image-20210303102143813](.\typora-user-images\image-20210303102143813.png)

### scroll 系列

- Element.scrollWidth： 表示元素**内容宽度**，包括由于 overflow 溢出而在屏幕上不可见的内容。它包含元素的内边距，但不包括边框，外边距或垂直滚动条（如果存在）。scrollWidth 也包括 ::before 和 ::after 这样的伪元素。
- Element.scrollHeight ：表示一个**元素内容高度**，包括由于溢出导致的视图中不可见内容。包括元素的 padding，但不包括元素的 border 和 margin。scrollHeight 也包括 ::before 和 ::after 这样的伪元素。
- Element.scrollTop 属性可以**获取或设置**一个元素的内容垂直滚动的像素数。一个元素的 `scrollTop` 值是这个元素的**内容顶部**（卷起来的）到它的视口可见内容（的顶部）的距离。当一个元素的内容没有产生垂直方向的滚动条，那么它的 `scrollTop` 值为`0`。
- Element.scrollLeft 属性可以读取或设置元素滚动到元素左边的距离。
- Element.scrollTo() 方法可以使界面滚动到给定元素的指定坐标位置。

**判定元素是否滚动到底**:

```
element.scrollHeight - element.scrollTop === element.clientHeight
```

### 鼠标事件（MouseEvent）中的鼠标位置

- event.pageY：表示的是鼠标事件发生时，鼠标位置距离整个 page 页面的顶部的距离(也就是包括页面中顶部被滚去的距离)，不带单位。

- event.clientY:表示的是鼠标事件发生时，鼠标位置距离浏览器的可视区域的顶部的距离（不包括浏览器的标签栏和菜单栏，也不包括浏览器顶部滚去的距离）。

- event.screenY:表示的是鼠标事件发生时，鼠标位置距离显示屏幕上边沿的距离（不包括整个页面滚去的距离）。
- window.scrollY:表示从浏览器可视区域开始算起，整个 page 页面已经滚去的距离
- event.offsetY：鼠标相对于事件源元素的 `Y` 坐标，只有 IE 有这个属性

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/1/17134e89da2d591b~tplv-t2oaga2asx-image.image)

### Element.getClientRects()动态值

返回一个类数组对象，内部元素是具体某个 DOM 元素对象的具体布局和尺寸信息。包含元素的 left、top、right 与 bottom，单位为像素，这些属性值是**相对于视口的 top-left 的**，而**不是相对于元素带定位的父级元素**的。

![image-20210303100825082](.\typora-user-images\image-20210303100825082.png)

### Element.getBoundingClientRect()动态值

 返回一个**对象**，对象属性的组成是元素的大小及其相对于视口的位置。如果是标准盒子模型，元素的尺寸等于`width/height` + `padding` + `border-width`的总和。如果`box-sizing: border-box`，元素的的尺寸等于 `width/height`。返回的结果是包含完整元素的最小矩形，并且拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`这几个以像素为单位的只读属性用于描述整个边框。除了`width` 和 `height` 以外的属性是**相对于视图窗口的左上角**来计算的。

 当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，**当滚动位置发生了改变，top 和 left 属性值就会随之立即发生变化**（因此，它们的值是相对于视口的，而不是绝对的）。如果需要获得相对于整个网页左上角定位的属性值，那么只要给 top、left 属性值加上当前的滚动位置（通过 window.scrollX 和 window.scrollY），这样就可以获取与当前的滚动位置无关的值。

![image-20210303101259061](.\typora-user-images\image-20210303101259061.png)

![image-20210303101642616](.\typora-user-images\image-20210303101642616.png)

![image-20210303101726903](.\typora-user-images\image-20210303101726903.png)

### 图片按需加载（元素到可视区域再加载）

核心：页面的上边距到视口上边界的距离小于视口高度时，表示元素开始出现在页面可见区域。

三个重点的 API：

- document.documentElement.clientHeight
- ele.getBoundingClientRect().top
- window | document.scroll 事件

```javascript
let center = document.querySelector('.center');
let topLength;
let bodyHeight;
window.addEventListener('scroll', function () {
  topLength = center.getBoundingClientRect().top;
  bodyHeight = document.documentElement.clientHeight;
  if (topLength + 200 < bodyHeight) {
    center.innerHTML = '元素到达可视区';
  }
});
```

### 手写 instanceof 的实现

instanceof 运算符用于测试构造函数的 prototype 属性是否出现在对象原型链中的任何位置。

```javascript
let box = document.getElementsByClassName('box')[0],
  btn = document.getElementById('btn');

function animation(element, target) {
  if (element.timerId) return;
  element.timerId = setInterval(function () {
    let { left, top } = element.getBoundingClientRect();
    if (left < target) {
      left += Math.ceil((target - left) / 10);
      top += Math.ceil((target - top) / 10);
      element.style.left = left + 'px';
      element.style.top = top + 'px';
    } else {
      clearInterval(element.timerId);
    }
  }, 20);
}
btn.addEventListener('click', function () {
  animation(box, 500);
});
```

### 网页验证码的作用及几种常见验证码

- 滑动拼图
- 文字点选
- 推理拼图
- 短信
- 智能无感知

文字点选，推理拼图，滑动拼图，短信这些都是购买的服务。前端只要就是拿到相应内容，发 Ajax 到后台，由后台接口处理即可。后台拿到前端发送过来的数据，调用购买的短信接口实现发送短信到手机上。

#### 封装动画

```javascript
let box = document.getElementsByClassName('box')[0];
function animation(element, target) {
  element.timerId = setInterval(function () {
    let { left, top } = element.getBoundingClientRect();
    if (left < target) {
      left += 10;
      top += 10;
      element.style.left = left + 'px';
      element.style.top = top + 'px';
    } else {
      clearInterval(element.timerId);
    }
  }, 20);
}
animation(box, 500);
//getBoundingClientRect方法获取的都是只读属性且不带单位，element.style读取的是行内样式，且可读可写。将定时器id存放在dom元素上，能减少变量冲突的可能性。
```

### property 和 attribute 的区别

### 手写图片懒加载代码

```javascript
//常规方法实现图片懒加载
let loadingImage = (funtion(){
 	let domImage = document.createELement('img')
	document.body.appendChild(domImage)
	let img = new Image()
    img.onload = function(){
        domImage.src = this.src
    }
	return {
        domImage.src = '小图片地址'
        setSrc:funtion(src){
        	img.src = src
    	}
    }
 })()
loadingImage.setSrc('大图片url')





// 代理模式实现图片懒加载
let imgFunc = (function () {
    let imgNode = document.createElement('img')
    document.body.appendChild(imgNode)  //一上来就给页面添加了一个没有src的图片节点
    return{
        setSrc:function (src) {  //第三步 src = ./loading.gif
            imgNode.src = src
        }
    }
})();

let proxyImg = (function () {  //闭包
    let img = new Image()
    img.onload = function () {  //一上来就在内存中创建一个新的图片节点，并绑定了load事件
        imgFunc.setSrc(this.src)  //第五步 ，修改页面上已经存在的img节点的src指向
    }
    return {
        setSrc:function (src) {   // 第二步 src = ./pic.png
            imgFunc.setSrc('./loading.gif')
            img.src= src  //第四步
        }
    }
})()

proxyImg.setSrc('./pic.png')  //第一步
```

### 设计模式

#### 单例模式

一个构造函数（类）只能实例化一个对象，之后每次再对构造函数或类用 new 调用，都只是返回之前的第一次创建好的实例对象。

能节省内存资源

应用：自定义弹出层，vuex 和管理命名空间、数据与方法、登录框

```javascript
方式一：
var Single = (function(){
	function Demo(){
	  this.msg = 'msg'
	}
	Demo.prototype.getMsg = function(){
	  console.log(this.msg)
	}
	//其他复杂逻辑
	let instance = new Demo()
	return function(){
	  return instance
	}
})()
上述方式的不足，即使没有使用，也会自动实例化一次。

改进方式一：惰性单例
var Single = (function(){
	function Demo(){
	  this.msg = 'msg'
	}
	Demo.prototype.getMsg = function(){
	  console.log(this.msg)
	}
	//其他复杂逻辑
	let instance
	return function(){
	  instance ? instance: instance = new Demo()
	  returen instance
	}
})()



//之前实现登录框的方式
let loginLayer= (function(){
    let div = document.createElement('div')
    div.innerHTML = '登录弹框内容'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
})()
btn.onclick = function (){
    loginLayer.style.display = 'block'
}
//这种方式的不足，dom元素是存在与dom树结构中的，不管用不用都在，占用资源。


//js单例模式实现登录框
let loginLayerFun =(function(){
    let div
    return function(){
        if(!div){
            div = document.createElement('div')
            div.innerHTML = '登录弹框内容'
            div.style.display = 'none'
            document.body.appendChild(div)
        }
        return div
    }
})()
btn.onclick = function (){
    let loginLayer = loginLayerFun()
    loginLayer.style.display = 'block'
}
//这种方式的不足：职责不单一。


let loginLayerFun =(function(){
    let result
    return function(fn,...args){
        return result || result= fn(...args)
    }
})()

let createDiv = function(){
    let div = document.createElement('div')
    div.innerHTML = '登录弹框内容'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
}

btn.onclick = function (){
    let loginLayer = loginLayerFun(createDiv)
    loginLayer.style.display = 'block'
}


//ES6的单例模式
class Person{
    constructor(name,age,gender){
        if(!Person.instance){
            this.name = name;
            this.age = age;
            this.gender = gender;
            Person.instance = this
        }
        return Person.instance
    }
}




//ES6的单例模式方式二
class Login {
    constructor(){
        this.init()
    }

    //初始话方法（类的原型上）
    init(){
        let mask = document.createElement('div')
        mask.classList.add('mask-layer')
        mask.innerHTML='登录框的html结构'
        document.body.insertBefore(mask,document.body.childNodes[0])
        Login.addCloseLoginEvent()  //关闭登录框事件
    }
    //给登录框中关闭按钮绑定点击事件
    static addCloseLoginEvent(){
        this.getLoginDom('.close-btn').addEventListener('click',()=>{
            this.getLoginDom('.mask-layer').style = 'display:"none"'
        })
    }
    //获取元素的静态方法，定义在类上面
    static getLoginDom(cls){
        return document.querySelector('cls')
    }

    //获取实例单例
    static getInstance(){
        if(!this.instance){
            this.instance = new Login()
        }else{
            //移除遮罩层style后显示遮罩层
            this.getLoginDom('.mask-layer').removeAttribute('style')
        }
        return this.instance
    }
}
Login.getLoginDom('.login-btn').addEventListener('click',()=>{
    Login.getInstance()
})
```

#### 策略模式

在一个对象内部，以对象方法的形式封装一系列的算法或者逻辑代码，要使用时传入对应情况下的参数就可以。将算法的使用和算法的实现分开。

一个策略模式的组成：

- 一组策略类或者对象，内部封装了具体的算法逻辑
- 环境类（Context），它接收调用请求，随后调用特定的策略类

案例题：

奖金计算，绩效为 S 的，年终奖是工资的 4 倍，绩效为 A 的，年终奖是工资的 3 倍，绩效为 B 的，年终奖是工资的 2 倍

```javascript
//传统的代码写法

let calculateBonus = function (level,salary){
    if(level === 'S'){
        return 4*salary
    }
    if(level === 'A'){
        return 3*salary
    }
    if(level === 'B'){
        return 2*salary
    }
}
calculateBonus('S',6000)
calculateBonus('B',6000)

//使用策略模式
let strategies={
    'S':function(salary){
        return 4*salary
    },
    'A':function(salary){
        return 3*salary
    },
    'B':function(salary){
        return 2*salary
    }
}
let calculateBonus = Function (level,salary) {
    return strategies[level](salary)
}

calculateBonus('S',6000)
calculateBonus('B',6000)
```

#### 外观模式

让多个方法一起被调用。

#### 工厂模式

前端性能优化方案（从 TCP 请求到接口请求到页面绘制）

数据类型与数据类型转换，

堆栈内存

闭包，作用域，AO,VO,EC，ECStack,scope，GO，栈内存释放与否，初始模块化思想，柯里化函数编程思想，compose 函数编程

面向对象，原型与原型链，this，基于面向对象与原型链进行插件组件封装

浏览器渲染队列（event loop，event queen），同步异步编程 ，浏览器渲染遇到 link 或者 script 怎么处理，crp 进程节点优化

DOM 事件，dom2 级事件池机制，观察者模式（事件发布订阅者模式）

ES6 promise async/await 源码，基于 generator 写 async/await 源码

http1.0、1.1，http2.0，https，三次握手四次挥手，http 层面如何做 dns 优化，如何在 http 发送请求过程中做优化，http 报文

Ajax 四步操作，ajax 的 get 与 post 请求，常规状态码理解，axios 的理解源码

canvas，webGL，移动端

vue，react 基础与源码，性能优化，代码优化，http 层优化，webpack 层优化安全优化

node，express koa

小程序开发

transition 与 animation 的区别

get 请求与 post 请求的区别

有了 post 为什么还需要 get

闭包

vue 双向数据绑定原理

声明周期函数

Promise

async/await

css 实现两列布局

单例，多例

设计模式

SPA 与传统应用

为什么 SEO 对 spa 不友好

服务端渲染

前端路由

nginx 负载均衡

不同请求分配到不同服务器

### 页面有 10 个按钮，我需要统计每个按钮点击了多少次

```JavaScript
<button>1</button>
<button>2</button>
<button>3</button>
<button>4</button>
<button>5</button>
<button>6</button>
<button>7</button>
<button>8</button>
<button>9</button>
<button>10</button>

方式一：
<script>
    let btns = document.getElementsByTagName('button')
	let arr = {}
	for(let i=0;i<btns.length;i++){
    	let time = 0
    	arr[i]=time
    	btns[i].addEventListener('click',function(){
        	arr[i]=time++
    })
}
</script>
//本质还是用闭包解决,这里用算是用了块级作用域

方式二：
let arr = {}
for(let i=0;i<10;i++){
    btns[i].addEventListener('click',(function(){
        let timer = 0
        return function(){
            arr[i]=++timer
            console.log(arr[i]);
        }
    })()
  )
}
```

### document.write()与 inner HTML 的区别

document.write()可以向文档中写入 html 表达式或者 js 代码。

```javascript
window.onload= function(){
    document.write('<h2>hello world!</h2>')
}
onload事件在页面加载完成后触发，这时再执行write方法的话，会让页面内容完全重写为新的内容。在一定情况下，即使不使用onload事件，在body最后的脚本中执行write方法也可能导致页面重写。
将含有write方法的script标签脚本放在body之前或者body体中且没有load事件，则不会覆盖页面内容。
```

### 补漏知识点

#### 函数式编程

函数组合，把处理数据的函数想管道一样连接起来，然后让数据穿过管道得到最终结果。

```javascript
const add1 = (x)=>x+1;
const mul3 = (x)=>x*3;
const div2 = (x)=>x/2;
div2(mul3(add1(add1(0))))
这种代码的可读性非常差。

const compose = (...arg) => {
    方式一：
    /* let funStr = '',
        rightStr = '';
      arg.forEach(item=>{ rightStr+=')'})
      arg.forEach(item=>{funStr+=item.name+'('})
      return (val) => {
        console.log(funStr+`${val}`+rightStr);
        return  eval(funStr+`${val}`+rightStr)
      } */

    方式二：
    arg= arg.reverse()
    return val =>{
        for(let i=0;i<arg.length;i++){
            val = arg[i](val)
        }
        return val
    }
}

let fn = compose(div2, mul3, add1, add1)
console.log(fn(0))

//在上面的例子中，传给compose函数的函数实参只是预先存放起来了(存在了compose函数的作用域中，闭包)，并返回一个函数，当执行返回的函数时，再取出闭包中的函数实参进行执行。这种思想是函数柯里化思想。
//函数柯里化：执行一个方法，传入一些实参，先形成一个不销毁的栈，把传递的这些值先存储起来（不立即使用），返回一个函数给栈外面的变量，当执行返回的函数时，将预先存在不销毁的栈中的而数据拿出来使用。基于闭包。
```

```javascript
const fn =function fn(x,y){
    console.log(this,x,y);
    this.val =x+y
}
let obj ={name:'珠峰'}
document.body.onclick =fn;   //注意：这是this指向body，x为事件对象，y为undefined,同时这种方式是无法传参数的，如果写为document.body.onclick =fn(1,2);则不会给body绑定任何事件
//要求：我现在要给body绑定click事件，并给将this指向上面的obj，还要给函数传递两个参数10，20，并且也要取得事件对象event。
方式一：
document.body.onclick =fn.bind(obj,1,2,e); //这里我并没有传递事件对象，而事件对象默认就在bind方法的最后一个参数获取。

方式二：
document.body.onclick =(function(num1,num2){
    return function (e){
        let that =this
        return fn.call(that,num1,num2)
    };
})(10,20)
```

### for 循环条件判断问题

```javascript
var x;
debugger;
for (var i = 0, j = 0; i < 6, j < 10; i++, j++) {
  x = i + j;
}
alert(x); //'18'

var x;
let num = 0;
debugger;
for (var i = 0, j = 0; j < 10, i < 6, num < 5; i++, j++) {
  x = i + j;
  num++;
}
console.log(x); //8

//从上面代码的执行结果来看，真正起到条件判断得语句都是中间代码块中得最后一条语句。
```

### 用原生 js 获取某个元素下面的所有元素节点

```javascript
let obj = [];
function getChilderenNodes(element) {
  let children = element.children;
  for (let value of children) {
    if (value.children.length > 0) {
      obj.push(value);
      getChilderenNodes(value);
    } else {
      obj.push(value);
    }
  }
  return obj;
}
```

### 事件代理

### DOM 事件和事件流

### 合并两个对象的方法（尽量写多个方法）

### 同步回调和异步回调的区别，如何解决异步回调地狱问题

### 如何判断图片加载完成

1. 图片的 onload 事件

### js 中判断变量为数组的方法有哪些

### js 中创建对象的方法有哪些

### 统计某个字符出现的次数

### 编写一个 b 继承 a 的方法

### js 延迟加载的方式

### 什么是严格模式，它有什么好处与坏处

### 身份证的正则表达式

### 如何阻止事件冒泡和默认事件行为

### 手写源码面试题

1. 防抖与节流
2. 深拷贝
3. 数组扁平化
4. 单列模式
5. 数组去重
6. 手写 promise.all 和 promise.race
7. 模拟实现 new
8. 实现 call、apply 与 bind
9. 模拟实现 Object.create()
10. 千分位分隔符
11. 实现三角形
12. 三栏和双栏布局

### Websocket

多人实时聊天是通过聊天服务器进行双边沟通的。http 是基于请求响应模型，服务器要与客户端进行沟通的话，必须要基于客户端的请求，而不能主动与客户端进行通信。所以用 http 很难实现实时聊天能力。对于实时聊天功能可以基于 websocket。

> websocket 协议是基于 tcp 的一种新的**网络协议**,它实现的客户端和服务器的全双工(full-duplex)通信.服务器可以主动与客户端进行通信.同时,websocket 是一种持久协议,而 http 不是.

websocket 常常使用在实时推送消息类场景下(如聊天).

### 手写模拟实现 ES6 中模板字符串变量替换功能

```
let name ='jack',age=20
let desc = "${name}今年${age}岁了"

function replaceTemplateStr(desc){
	return desc.replace(/\$\{([^}]+)\}/g,function(matchStr,key){
		return eval(key)
	})
}

templateStr(desc)
matchStr依次为匹配到的 ${name},${age}
key依次为分组：name，age
[^}]:表示除了}以外的任意字符
+：出现一到多次
()：分组
```

### 自定义一个判断数据类型的函数

```javascript
function isType(type) {
  return function (param) {
    return Object.prototype.toString.call(param) == `[object ${type}]`;
  };
}

let isString = isType('String');
let isArray = isType('Array');
console.log(isString('abc'));
console.log(isArray([]));

//重点：Object.prototype.toString.call(param)
```

### 指定一个函数被调用一定次数后才能执行一次

```
let fun= (function(){
	let count =1
	return function (){
		if(count++ === 3){
			console.log('abc')
		}
	}
})()

//利用闭包进行计数


function after(time){
	let count =1
	return function (){
		if(count++ === time){
			console.log('abc')  //这里也可以是其他函数的调用
		}
	}
}
```

### 回调函数

异步的回调函数存在的问题

- 无法捕获回调函数内部的错误
- 无法 return 回调函数内部的结果
- 形成回调地狱，总耗时为每个异步的执行时间累加

### 异步回调的解决方案

#### 事件发布订阅来实现

```javascript
let fs = require('fs');
let eventEmitter = require('events'); //node中的核心模块，用于引入创建事件发布订阅实例对象的构造函数
let eve = new eventEmitter(); //创建事件发布订阅者实例对象
let html = {}; //用于存放异步回调后的结果
eve.on('ready', function (key, result) {
  //给实例订阅ready事件绑定事件处理函数并存放在eve对象内部
  html[key] = result;
  if (Object.keys(html).length == 2) {
    console.log(html);
  }
});

fs.readFile('./xxx1.xxx', 'utf8', function (error, template) {
  eve.emit('ready', 'template', template); //发出eve对象上的ready事件，并传递回调函数的结果
});

fs.readFile('./xxx2.xxx', 'utf8', function (error, data) {
  eve.emit('ready', 'data', data); //发出eve对象上的ready事件，并传递回调函数的结果
});
```

#### 通过哨兵函数实现

```javascript
let fs =require('fs')

let html ={}    //用于存放异步回调后的结果

function done (key,result){   //哨兵函数
    html[key]=result
    if(Object.keys(html).length == 2){
        console.log(html)
    }
}

fs.readFile('./xxx1.xxx','utf8',function(error,template){
    done('template',template)
})

fs.readFile('./xxx2.xxx','utf8',function(error,data){
  	done('data',data)
})
//要取得异步回调函数内部的数据结果，可以使用在异步回调内部调用其他外部定义的函数，并传入参数


上述方法的改进，对哨兵函数进行封装：

let fs =require('fs')

function render(length,callback){   //闭包用于保存私有变量
    let html ={}
    returnn function(key,result){   //哨兵函数
    html[key]=result
    if(Object.keys(html).length == length){
        callback(html)
    }
}

let done = render(4,function(html){
      console.log(html)
 })

fs.readFile('./xxx1.xxx','utf8',function(error,template){
    done('template',template)
})

fs.readFile('./xxx2.xxx','utf8',function(error,data){
  	done('data',data)
})
```

ECMAScript262 中数据类型的标准定义

typeof

返回值是字符串类型的数据

null 返回的是"object" ，原因：数据在底层是用二进制进行检测的，数据 000 开头为对象，而 null 在底层的二进制是 000000，所以也被识别为 object。

在区分函数和对象时

无法更细的区分对象类型

![image-20210421203404946](.\typora-user-images\image-20210421203404946.png)

instanceof

constructor

Object.prototype.toString.call(value)

Array.isArray

isNaN

![image-20210421203616625](.\typora-user-images\image-20210421203616625.png)

![image-20210421203709301](.\typora-user-images\image-20210421203709301.png)

![image-20210421203741652](.\typora-user-images\image-20210421203741652.png)

![image-20210421204726600](.\typora-user-images\image-20210421204726600.png)

让 utils 函数库工具在浏览器端和 node 端都能使用。

![image-20210421205201401](.\typora-user-images\image-20210421205201401.png)

面试：

- js 数据类型检测
- Symbol 类型深入
- this

## 数据类型检测方法

- typeof

  底层机制是什么？检测数据类型的二进制前三位

  直接在计算机的底层基于数据类型的值的二进制进行检测，js 中的每中数据类型在计算机底层存储时都是以二进制形式存储，每个类型的数据的二进制都有自己的特定二进制数字开头 （搜索了解）

  对象类型存储在计算机中其二进制都是以 000 开头，null 也是以 000 开头的，所以 typeof null 返回的是字符串 'object' 。

  不足：

  - 没法准确的判断引用数据类型，由此衍生出 instanceof
  - 对于引用类型和 null 无法区分

- instanceof

  底层机制:只要构造函数的原型出现在所需要检测的实例对象的原型链上时就返回 true。 数字，布尔值，字符串都一定是 Number，Boolean，String 类的实例对象，但是在使用 instanceof 检测时都统一返回 false

  手写 instanceof

  不足：

  - 基本类型无法检测
  - 由于开发者可以肆意的修改原型指向，所以检测出来的结果是不准确的
  - 对于存在原型链继承关系的情况，则无法具体细分它是否是普通对象还是其他对象了
  - 检测对象类型不准确及其原因（基于原型链检测）

  ![image-20211101225004559](.\typora-user-images\image-20211101225004559.png)

  ```js
  function instance_of(example, classFun) {
    let classProto = classFun.prototype,
      exampleProto = Object.getPrototypeOf(example);
    while (exampleProto) {
      if (exampleProto === classProto) true;
      exampleProto = Object.getPrototypeOf(exampleProto);
    }
    return false;
  }
  ```

- constructor

  数据的原型上的 constructor 也是可以随意改动的，所以也存在不准确的问题。 ![image-20211101230756257](.\typora-user-images\image-20211101230756257.png)

  什么时候使用：获取一个数据的类型，同时创建出一个相同类型的数据，在数组或者对象的深浅拷贝中使用。

- Object.prototype.toString.call ( )

  标准检测数据类型的方法，该方法不是将数据转换对应的字符串，而是返回当前实例所属类的信息。

  ![image-20211101231531706](.\typora-user-images\image-20211101231531706.png)

  ![image-20211101231459358](.\typora-user-images\image-20211101231459358.png)

借鉴 jQuery 的中 type 方法，自行封装一个类型检测通用方法。

## js 中三类循环对比以及性能分析

- for 循环以及 forEach 底层原理
- for in 循环的 BUG 以及解决方案
- for of 循环的底层机制

扩展：

new Array(n)是创建一个数组实例。内部指定一个数字，表示创建一个指定长度的数组，叫稀疏数组（一个数字中有连续的两项元素为空值的话就叫稀疏数组）。拿去稀疏数组进行操作或循环时可能存在不准确的地方，并且不能调用许多数组方法，比如 forEach，map 等。

稀疏数组例子：

![image-20211102081814011](.\typora-user-images\image-20211102081814011.png)

性能比较：

for 循环和 while 循环

![image-20211102082257162](.\typora-user-images\image-20211102082257162.png)

![image-20211102082315298](.\typora-user-images\image-20211102082315298.png)

![image-20211102082336890](.\typora-user-images\image-20211102082336890.png)

![image-20211102082347567](.\typora-user-images\image-20211102082347567.png)

结论（浏览器环境下，node 下则不同）：

- 基于 var 声明循环的控制变量时，for 循环和 while 循环的性能差不多
- 基于 let 声明循环的控制变量时，for 循环比 while 循环的性能好

原因：在使用 var 时，定义的循环的控制变量是全局的，全局上下文中的循环的控制变量会占有内存空间不被释放，使用 let 的话，定义的循环的控制变量会在每次 for 循环后被释放，所以不占用内存，所以性能是由作用域导致的，而不是循环本身差异导致的。

手写数组原型上的所有迭代与循环方法。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da612633e59f4310ac8084381c79f63a~tplv-k3u1fbpfcp-watermark.image?)

forEach 的性能要比 for 循环的性能差。forEach 循环接受两个参数，第一个是函数，其中函数的形参位置会默认传入三个值，分别是当前循环项，当前循环项的索引，循环的数组本身；同时 forEach 的第二个参数位置还能指定第一个函数参数执行时的 this 指向。forEach 方法本身除了循环以外还做了许多其他处理，比如传参，判断类型，改变 this 指向等。

js 实现 forEach

```
Array.prototype._forEach = function (callback,context){
  if(typeof callback !== 'function') return
  let self =this,
      len = this.length,
      i=0,
      context = context? context:window
  for(;i<len;i++){
    callback.call(context,this[i],i,this)
  }
}
```

for in 循环的性能很差，原因是它迭代的是整个对象中所有可枚举的属性（绝大部分私有属性和少部分共有属性，即原型链上的属性）,所以递归整个原型链会很耗时同时还要判断是否可枚举。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e226e1c7f46046dea2825ac00d8a70e3~tplv-k3u1fbpfcp-watermark.image?)

问题：

- 遍历顺序以数字优先
- 无法遍历 Symbol 属性
- 可以遍历到公有的可枚举方法

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46406e98695b4b25a9bacec76f38ae10~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e2518ad06fb42648f025e3a0660bfe0~tplv-k3u1fbpfcp-watermark.image?)

for of 循环的原理是按照数据类型本身实现的迭代器规范进行遍历的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d178564d122f4a17bd4c2191dec70388~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caa1badfa8dc4b30ba1390d168023e69~tplv-k3u1fbpfcp-watermark.image?)

## 谈一下你对 this 的理解和应用场景

```js
Function.prototype.call = function (context, ...arg) {
  let self = this,
    key = Symbol('KEY'),
    result;
  context == null ? (context = window) : null;
  !/^(object|function)$/i.text(typeof context) ? (context = Object(context)) : null;
  context[key] = self;
  result = context[key](...arg);
  delete context[key];
  return result;
};
```

```js
Function.prototype.bind = function (context, ...arg1) {
  let self = this;
  return function (...arg2) {
    this.call(context, ...arg1, ...arg2);
  };
};
```

## 项目亮点难点

功能性和业务性方面：

- 单点登录
- 权限的多维度控制
- 多组件信息的复杂共享类问题
- 产品安全解决决策
- 数据埋点&性能监控
- 直播类，音频视频类，实时通讯类，可视化处理类

重点讲解：

- webpack 性能优化
- HTTP 层面优化
- 页面渲染优化
- 骨架屏
- 延迟/异步加载
- 大数据渲染优化
- 大文件传输处理
- 组件插件的封装
  - 公共方法库
  - 插件和组件封装，二次封装
  - Vue 自定义指令

其他技术栈或者方面的学习

## 数组的深浅拷贝

浅克隆：

数组

- let newArr = [...arr ]
- let newArr = arr.concat( [ ] )
- let newArr = arr.slice( )
- ......

对象

- let newObj = { ...obj } ，可以拷贝 Symbol 属性

- let newObj = Object.assign( { } , obj ) ，可以拷贝 Symbol 属性

- 自己写循环实现，注意 Symbol 属性的拷贝，具体实现

  ```js
  let obj = {
      ....
  }
  let keysArr = [...Object.keys( obj ), ...Object.getOwnPropertySymbols(obj)]
  let newObj = {}
  keysArr.forEach((key)=>{
      newObj[key] = obj[key]
  })
  ```

浅克隆的封装：

```js
function shallowClone(obj) {
  let type = toType(obj); //toType参考jQuery源码
  let Ctor = obj.__proto__.constructor;

  // 处理Symbol 和 bigInt
  if (/^(symbol|bigint)$/i.test(type)) return Object(obj);

  //正则，日期对象
  if (/^(regexp|date)$/i.test(type)) return new Ctor(obj);

  //对于错误对象类型
  if (/^(error)$/i.test(type)) return new Ctor(obj.message);

  //对于函数
  if (/^function$/i.test(type)) {
    // 返回一新函数，但是新函数执行会将老函数执行以实现相同效果
    return function () {
      return obj.call(this, ...arguments);
    };
  }

  //针对数组和对象
  if (/^(object|array)$/i.test(type)) {
    // 方式一：
    return type == 'array' ? [...obj] : { ...obj };

    //方式二：
    let result = new Ctor();
    let keysArr = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
    keysArr.forEach((key) => {
      result[key] = obj[key]; //这样就可以拷贝Symbol类型
    });
    return result;
  }
  return obj;
}
```

![image-20211102213341049](.\typora-user-images\image-20211102213341049.png)

深克隆

```js
//基于浅克隆
function deepClone(obj, cache = new Set()) {
  let type = toType(obj); //toType参考jQuery源码
  let Ctor = obj.__proto__.constructor;
  if (!/^(object|array)$/i.test(type)) return shallowClone(obj);

  //避免循环引用带来的死循环
  if (cache.has(obj)) return;
  cache.add(obj);

  //数组或对象
  let result = new Ctor();
  let keysArr = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
  keysArr.forEach((key) => {
    //再次调用deepClone时把catch传进去，保证每次递归都是一个cache
    result[key] = deepClone(obj[key], cache); //这样就可以拷贝Symbol类型
  });
  return result;
}
```

参考 lodash 的克隆源码。

## 对象合并

意义：

- 插件组件封装：外部传入的参数和默认参数的合并
- 业务需求
- .....

{...target,obj } 和 Object.assign(target,obj) 也是合并对象，但是不足是基于浅比较实现的对象合并。

自行封装 merge 方法：

![image-20211103082528123](.\typora-user-images\image-20211103082528123.png)

![image-20211103082950748](.\typora-user-images\image-20211103082950748.png)

**定义一些规则，让两个对象的合并按照一系列的规则进行合并。**

## queryURLParams 的三种实现方案

## AOP（面向切片编程）

概念：AOP 的主要作用是把一些跟核心业务逻辑模块无关的功能抽离（日志统计，安全控制和异常处理），将这些功能抽离出来后，在通过动态织入的方式参入到业务逻辑模块中。

埋点：比如用户触发某个行为时，会有业务逻辑代码处理，同时还有一部分和业务逻辑无关的逻辑需要执行。一般的做法是当事件行为发生时，在事件处理函数中先做一些无关业务的代码逻辑，然后再做一些业务代码逻辑，然后又执行一些业务逻辑无关代码，然后结束事件处理函数。对于许多复杂业务逻辑和主业务无关的逻辑，为了保证代码的合理应用，需要将业务无关抽离，抽离后通过动态的方式按需要的顺序引用依次执行。

控制代码执行顺序。

装饰器模式

![image-20211103085122663](.\typora-user-images\image-20211103085122663.png)

```js
Function.prototype.before =function before( callback ){
    if(typeof callback !== 'function') throw new TypeError(`callback must be a function`)
    let self = this
    return function proxy (..args){
        callback.call(this , ...args)
        return self.call(this, ...args)
    }
}

Function.prototype.after =function after( callback ){
    if(typeof callback !== 'function') return
    let self = this  // this指的是before函数执行后返回的那个代理函数
    return function proxy (..args){
        let result = self.call(this, ...args)
        callback.call(this, ...args)
        return result
    }
}


function func(){
    console.log('func')
}

func.before(
    // before函数中的this是func
    ()=>{
    	condole.log('before')
	}
).after(
    // after函数中的this是before函数执行后返回的那个代理函数
    ()=>{
    	condole.log('after')
	}
)()

```



## 项目发布

1. 购买一台服务器（ 万网(阿里云) ）（服务器联网后会自动分配一个外网 ip 地址）

   虚拟云服务器（多人共享一台服务器） | 独立主机

2. 购买一个域名

3. 域名和外网 IP 映射（DNS 解析）

4. 备案

5. 把本地项目的源码通过 FTP 协议上传到服务器指定的目录中（FTP 上传工具）

6. 使用 web 端的工具在同一台服务器中发布项目（IIS => windows、 apache | tomcat => Linux、nginx）

   指定当前域名访问服务器后，到底执行服务器本机中的哪个项目源码

![image-20211120165326021](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20211120165326021.png)

![image-20211120165401988](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20211120165401988.png)

file zille 界面：

![image-20211120165825380](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20211120165825380.png)

![image-20211120165836974](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20211120165836974.png)

![image-20211120165845571](C:\Users\dukkha\Desktop\learn-notes\js\images\image-20211120165845571.png)





## 前端性能优化

不建议上来就说，做了图片的 base64，代码压缩合并等。而是从实际工作触发，说明为什么需要做优化？说一下实际开发中，系统中的什么问题或者指标影响到业务，通过什么样的努力去完善和解决了它们。

1. 首屏时间
2. 首次交互时间
3. 首次有意义的内容的渲染出现时间



1. 在JS中尽量减少闭包的使用 (原因: 闭会产生不释放的栈内存)
   - 循环给元素做事件绑定的时候，尽可能的把后期需要的信息(例如索引)存储到元素的自定义属性上，而不是创建闭包存储
   - 可以在最外层形成一个闭包，把一些后续需要的公共信息进行存储，而不是每一个方法都创建闭包(例如单例模式)
   - 尽可能的手动释放不被占用的内存

2. 尽量合并CSS和JS文件(把需要引入的CSS合并为一个，JS也是合并为一个)，原理是在减少HTTP请求次数，尽可能的把合并后的代码进行压缩，减小HTTP请求资源的大小
   - webpack这种自动化构建工具，可以帮我们实现代码的合并和压缩 (工程化开发)
   - 在移动开发(或者追求高性能的PC端开发，如果CSS或者JS不是需要很多，可以选择把css和is编程内嵌式(也就是代码直接写在HTML中

3. 尽量使用字体图标或者SVG图标，来代替传统的PNG等格式的图片(因为字体图标等是矢量图(基于代码编写出来的)，放大不会变形，而且渲染速度快，相对比位图要小一些)

4. 减少对 DOM 的操作（主要是减少重绘和回流（重排））
   - 注意重排的分离读写，把对 DOM 的设置操作全部写在一起，因为新版的浏览器有一个智能缓存机制，该机制如果发现第一条语句是修改 DOM 操作的代码，则会排查下面的语句是否还是和 DOM 操作有关的语句，如果下面紧接着的多条语句的也是操作 DOM 相关的语句，则会将这些全部操作 DOM 的语句放入临时处理的地方集中，直到后面解析到一句非 DOM 操作的语句时，再将前面集中管理的语句集合统一一次执行。所以尽可能将设置语句集中书写。
   - 使用文档碎片或者字符串拼接做数据绑定（DOM 的动态创建）
   - 减少 JS 中嵌套循环的使用
5. 图片懒加载（延迟加载），减少页面第一次加载时 http 请求的次数，刚开始加载页面时，所有真实图片都不去发 HTTP 请求加载，而是给一张占位的背景图，当页面加载完后，并且图片在可视区域内后再去做图片加载
6. 利用 304 缓存技术对不经常更新的静态资源文件做缓存处理（js,css,静态图片）减少 HTTP 请求次数和请求大小
7. 多利用事件委托机制
8. CSS 雪碧图技术
9. 尽量减少 CSS 表达式的使用（expression）；减少 CSS 中 Filter 滤镜属性使用；css 中开启图层；在导入或引入 CSS 时，尽量少使用@import 方式导入，因为@import 是同步操作，只有把@import 需要导入 css 导入完，才会向下加载，而 link 标签则是异步加载
10. 减少 COOKIE 的使用和大小
11. 页面数据的获取采用异步和延迟分批加载
12. 页面出现音频视频标签时，不要在页面加载过程中也去加载这些资源（设置标签的 preload='none'），不然页面加载速度会变慢，等待页面加载完成后音频视频在被播放时再去加载音视频资源
13. 前后端数据交互尽可能采用 JSON 格式传递数据
14. 使用 window.requestAnimationFrame 这个 JS 中的帧动画代替传统的定时器动画
15. 建议使用尾递归（将递归放在该方法的末尾执行）
16. 基于 script 标签的 defer 属性或者 async 属性来异步加载
17. CDN 加速（重量级优化但费钱）

