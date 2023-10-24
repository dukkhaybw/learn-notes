[MQTT](https://mqtt.org/) （MQ Telemetry Transport）是一种发布/订阅模式的轻量实时数据传输协议。典型应用场景：低带宽和不稳定网络环境、物联网。用极少的代码为联网设备提供实时可靠的消息服务。

MQTT特点：

- 简单、容易实现
- 支持 QoS（设备网络环境复杂）
- 轻量且省带宽
- 数据无关（不关心 Payload 数据格式）
- 有持续地会话感知能力（时刻感知设备是否在线）



**MQTT 对比 HTTP**

- MQTT 的最小报文仅为 2 个字节，比 HTTP 占用更少的网络开销。
- MQTT 与 HTTP 都能使用 TCP 连接，并实现稳定、可靠的网络连接。
- MQTT 基于发布订阅模型，HTTP 基于请求响应，因此 MQTT 支持双工通信。
- MQTT 可实时推送消息，但 HTTP 需要通过轮询获取数据更新。
- MQTT 是有状态的，但是 HTTP 是无状态的。
- MQTT 可从连接异常断开中恢复，HTTP 无法实现此目标。



**MQTT 对比 XMPP**

MQTT 协议简单轻量、路由灵活。

- [MQTT 报文](https://www.emqx.com/zh/blog/introduction-to-mqtt-control-packets)体积小且编解码容易，XMPP 基于繁重的 XML，报文体积大且交互繁琐。
- MQTT 基于发布订阅模式，相比 XMPP 基于 JID 的点对点消息路由更为灵活。
- MQTT 支持 JSON、二进制等不同类型报文。XMPP 采用 XML 承载报文，二进制必须 Base64 编码等处理。
- MQTT 通过 QoS 保证消息可靠传输，XMPP 主协议并未定义类似机制。



海量的设备接入和设备管理对网络带宽、通信协议以及平台服务架构要求高。对于**物联网协议**来说，必须针对性地解决物联网设备通信的几个关键问题：**网络环境复杂而不可靠、内存和闪存容量小、处理器能力有限**。

MQTT 协议正是为了应对以上问题而创建，其轻量高效、可靠的消息传递、海量连接支持、安全的双向通信。



### 轻量

物联网设备通常在处理能力、内存和能耗方面受到限制。MQTT 将协议本身占用的额外消耗最小化，消息头部最小只需要占用 2 个字节，可稳定运行在带宽受限的网络环境下。同时，MQTT 客户端只需占用非常小的硬件资源，能运行在各种资源受限的边缘端设备上。



### 可靠的消息传递

MQTT 协议提供了 3 种消息服务质量等级（Quality of Service），保证在不同的网络环境下消息传递的可靠性。

- QoS 0：消息最多传递一次。

  如果当时客户端不可用，则会丢失该消息。发布者发送一条消息之后，就不再关心它有没有发送到对方，也不设置任何重发机制。

- QoS 1：消息传递至少 1 次。

  包含了简单的重发机制，发布者发送消息之后等待接收者的 ACK，如果没收到 ACK 则重新发送消息。这种模式能保证消息至少能到达一次，但无法保证消息重复。

- QoS 2：消息仅传送一次。

  设计了重发和重复消息发现机制，保证消息到达对方并且严格只到达一次。

MQTT 还提供了[清除会话（Clean Session）](https://www.emqx.com/zh/blog/mqtt-session)机制。对于那些想要在重新连接后，收到离线期间错过的消息的客户端，可在连接时设置关闭清除会话，此时服务端将会为客户端存储订阅关系及离线消息，并在客户端再次上线后发送给客户端。



### 海量连接

基于 MQTT 的物联网应用及服务可轻松具备高并发、高吞吐、高可扩展能力。通过MQTT服务器，可以连接海量的物联网设备。



### 双向通信

通过发布订阅模式，MQTT 允许在设备和服务器之间进行双向消息通信。发布者与订阅者不需要建立直接连接，也不需要同时在线，而是由服务器负责所有消息的路由和分发工作。

MQTT 支持通过 TLS/SSL 确保安全的双向通信，同时 MQTT 协议中提供的客户端 ID、用户名和密码允许实现应用层的身份验证和授权。



### 状态感知

为了应对网络不稳定的情况，MQTT 提供了[心跳保活（Keep Alive）](https://www.emqx.com/zh/blog/mqtt-keep-alive)机制。在客户端与服务端长时间无消息交互的情况下，Keep Alive 保持连接不被断开，若一旦断开，客户端可即时感知并立即重连。

同时，MQTT 设计了[遗愿（Last Will） 消息](https://www.emqx.com/zh/blog/use-of-mqtt-will-message)，让服务端在发现客户端异常下线的情况下，帮助客户端发布一条遗愿消息到指定的 [MQTT 主题](https://www.emqx.com/zh/blog/advanced-features-of-mqtt-topics)。另外，部分 MQTT 服务器如 EMQX 也提供了上下线事件通知功能，当后端服务订阅了特定主题后，即可收到所有客户端的上下线事件，这样有助于后端服务统一处理客户端的上下线事件。



### MQTT 5.0

 在 3.1.1 版本基础上增加了**会话/消息延时、原因码、主题别名、用户属性、共享订阅**等特性，提高了大型系统的性能、稳定性与可扩展性。



### MQTT 服务器

MQTT 服务器负责接收客户端发起的连接，并将客户端发送的消息转发到另外一些符合条件的客户端。



### MQTT 客户端

MQTT 应用通常需要基于 MQTT 客户端库来实现 MQTT 通信。目前，基本所有的编程语言都有成熟的开源 MQTT 客户端库（[MQTT 客户端库大全](https://www.emqx.com/zh/mqtt-client-sdk)），可直接访问 EMQ 提供的 [MQTT 客户端编程](https://www.emqx.com/zh/blog/tag/mqtt-客户端编程)系列博客，学习如何在 Java、Python、PHP、Node.js 等编程语言中使用 MQTT。

MQTT 测试工具：[MQTTX](https://mqttx.app/zh) 是一款开源的跨平台桌面客户端，它简单易用且提供全面的 MQTT 5.0 功能、特性测试，可运行在macOS, Linux 和 Windows 上。同时，它还提供了命令行及浏览器版本，满足不同场景下的 MQTT 测试需求。



## 基础概念



### MQTT 客户端

任何运行 [MQTT 客户端库](https://www.emqx.com/zh/mqtt-client-sdk)的应用或设备都是 MQTT 客户端。例如，使用 MQTT 的即时通讯应用是客户端，使用 MQTT 上报数据的各种传感器是客户端，各种 [MQTT 测试工具](https://www.emqx.com/zh/blog/mqtt-client-tools)也是客户端。

### MQTT Broker

MQTT Broker 是负责处理客户端请求的关键组件，包括建立连接、断开连接、订阅和取消订阅等操作，同时还负责消息的转发。（服务器）

### 发布-订阅模式

**发布-订阅模式**与**客户端-服务器模式**的不同在于，它将发送消息的客户端（发布者）和接收消息的客户端（订阅者）进行了解耦。发布者和订阅者之间无需建立直接连接，而是通过 MQTT代理服务器来负责消息的路由和分发。

下图展示了 MQTT 发布/订阅过程。温度传感器作为客户端连接到 MQTT Broker，并通过发布操作将温度数据发布到一个特定主题（例如 `Temperature`）。MQTT Broker 接收到该消息后会负责将其转发给订阅了相应主题（`Temperature`）的订阅者客户端。

![image-20231023091302766](C:/Users/shuyi/Desktop/learn-notes/images/image-20231023091302766.png)



### 主题

MQTT 协议根据主题来转发消息。主题通过 `/` 来区分层级，类似于 URL 路径，例如：

```awk
chat/room/1

sensor/10/temperature

sensor/+/temperature
```

MQTT 主题支持以下两种通配符：`+` 和 `#`。

- `+`：表示单层通配符，例如 `a/+` 匹配 `a/x` 或 `a/y`。
- `#`：表示多层通配符，例如 `a/#` 匹配 `a/x`、`a/b/c/d`。

*通配符主题只能用于订阅，不能用于发布。*



## MQTT 的工作流程

1. **客户端使用 TCP/IP 协议与 Broker 建立连接**，可以选择使用 TLS/SSL 加密来实现安全通信。客户端提供认证信息，并指定会话类型（Clean Session 或 Persistent Session）。
2. **客户端既可以向特定主题发布消息，也可以订阅主题以接收消息**。当客户端发布消息时，它会将消息发送给 MQTT Broker；而当客户端订阅消息时，它会接收与订阅主题相关的消息。
3. **MQTT Broker 接收发布的消息**，并将这些消息转发给订阅了对应主题的客户端。它根据 QoS 等级确保消息可靠传递，并根据会话类型为断开连接的客户端存储消息。



## 快速上手

### 准备 MQTT Broker

可以选择私有部署服务器或完全托管的云服务来建立自己的 MQTT Broker。或者也可以使用免费的公共 Broker。

在本文中，将使用 EMQ 提供的[免费公共 MQTT Broker](https://www.emqx.com/zh/mqtt/public-mqtt5-broker)，它基于完全托管的 [MQTT 云服务 - EMQX Cloud](https://www.emqx.com/zh/cloud) 创建。服务器信息如下：

> Server: `broker.emqx.io`
>
> TCP Port: `1883`
>
> WebSocket Port: `8083`
>
> SSL/TLS Port: `8883`
>
> Secure WebSocket Port: `8084`



### 准备 MQTT 客户端

在本文中，将使用 [MQTTX](https://mqttx.app/zh) 提供的支持浏览器访问的 MQTT 客户端工具，访问地址为 http://www.emqx.io/online-mqtt-client 。 MQTTX 还提供了[桌面客户端](https://mqttx.app/zh)和[命令行工具](https://mqttx.app/zh/cli)。

各种编程语言都拥有成熟的开源 MQTT 客户端库。在[流行的 MQTT 客户端库和 SDK](https://www.emqx.com/zh/mqtt-client-sdk) 中精选了多个编程语言的 MQTT 客户端库，并提供了详细的代码示例，旨在帮助快速了解 MQTT 客户端的使用。



### 创建 MQTT 连接

在使用 MQTT 协议进行通信之前，客户端需要创建一个 MQTT 连接来连接到 Broker。

在浏览器中打开 http://www.emqx.io/online-mqtt-client , 点击页面中间的 `New Connection` 按钮，将看到如下页面。



### 通过通配符订阅主题

在建立的连接上，可以订阅一个个不同的主题



### 发布 MQTT 消息

可以创建新的连接到MQTT服务器，用于发布消息到特定的主题下面。发送的消息的格式可以有多种。一旦发送了消息当相应的主题下，那么订阅了该主题的其他客户端都将收到该消息。





## MQTTJS使用

[MQTT.js](https://github.com/mqttjs/MQTT.js) 是一个开源的 [MQTT 协议](https://www.emqx.com/zh/mqtt-guide)的客户端库，使用 JavaScript 编写，主要用于 Node.js 和 浏览器环境中。是目前 JavaScript 生态中使用最为广泛的 [MQTT 客户端库](https://www.emqx.com/zh/blog/introduction-to-the-commonly-used-mqtt-client-library)。

由于 JavaScript 单线程特性，MQTT.js 是全异步 MQTT 客户端，MQTT.js 支持 **MQTT/TCP、MQTT/TLS、MQTT/WebSocket**，在不同运行环境支持的度如下：

- 浏览器环境：MQTT over WebSocket（包括微信小程序、支付宝小程序等定制浏览器环境）
- Node.js 环境：MQTT、MQTT over WebSocket

在浏览器环境中只能使用ws协议连接mqtt服务器，无法使用mqtt协议连接mqtt服务器。



```
npm install mqtt --save

# 或者CDN

<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<script>
  // 将在全局初始化一个 mqtt 变量
  console.log(mqtt)
</script>
```



MQTT.js 还提供了全局安装的方式，使用命令行工具来完成 MQTT 的连接、发布和订阅等。

```
npm install mqtt -g
```



### 代码示例

```js
const mqtt = require('mqtt')

/***
 * 浏览器环境
 * 使用协议为 ws 和 wss 的 MQTT over WebSocket 连接
 * EMQX 的 ws 连接默认端口为 8083，wss 为 8084
 * 注意需要在连接地址后加上一个 path, 例如 /mqtt
 */
const url = 'ws://broker.emqx.io:8083/mqtt'

/***
 * Node.js 环境
 * 使用协议为 mqtt 和 mqtts 的 MQTT over TCP 连接
 * EMQX 的 mqtt 连接默认端口为 1883，mqtts 为 8084
 */
// const url = 'mqtt://broker.emqx.io:1883'

// 创建客户端实例
const options = {
  // Clean session
  clean: true,
  connectTimeout: 4000,
  // 认证信息
  clientId: 'emqx_test',
  username: 'emqx_test',
  password: 'emqx_test',
}

const client = mqtt.connect(url, options)

client.on('connect', function () {
  console.log('Connected')
  // 订阅主题
  client.subscribe('test', function (err) {
    if (!err) {
      // 发布消息
      client.publish('test', 'Hello mqtt')
    }
  })
})

// 接收消息
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

```



### API介绍

#### mqtt.connect([url], options)

连接到指定的 MQTT Broker 的函数，并始终返回一个 Client 对象。第一个参数传入一个 URL 值，URL 可以是以下协议：`mqtt`, `mqtts`, `tcp`, `tls`, `ws`, `wss`。URL 也可以是一个由 URL.parse() 返回的对象。然后再传入一个 Options 对象，用于配置 MQTT 连接时的选项。当使用 WebSocket 连接时需要注意地址后是否需要加上一个 path，例如 `/mqtt`。

常用的 Options 对象中的属性值：

- Options
  - `keepalive`: 单位为`秒`，数值类型，默认为 60 秒，设置为 0 时禁止
  - `clientId`: 默认为 `'mqttjs_' + Math.random().toString(16).substr(2, 8)`，可以支持自定义修改的字符串
  - `protocolVersion`: MQTT 协议版本号，默认为 4（v3.1.1）可以修改为 3（v3.1）和 5（v5.0）
  - `clean`: 默认为 `true`，是否清除会话。当设置为 `true` 时，断开连接后将清除会话，订阅过的 Topics 也将失效。当设置为 `false` 时，离线状态下也能收到 QoS 为 1 和 2 的消息
  - `reconnectPeriod`: 重连间隔时间，单位为毫秒，默认为 1000 毫秒，**注意：**当设置为 0 以后将取消自动重连
  - `connectTimeout`: 连接超时时长，收到 CONNACK 前的等待时间，单位为毫秒，默认 30000 毫秒
  - `username`: 认证用户名，如果 Broker 要求用户名认证的话，请设置该值
  - `password`: 认证密码，如果 Broker 要求密码认证的话，请设置该值
  - will: 遗嘱消息，一个可配置的对象值，当客户端非正常断开连接时，Broker 就会向遗嘱 Topic 里面发布一条消息，格式为：
    - `topic`: 遗嘱发送的 Topic
    - `payload`: 遗嘱发布的消息
    - `QoS`: 遗嘱发送的 QoS 值
    - `retain`: 遗嘱发布的消息的 retain 标志
  - `properties`: [MQTT 5.0](https://www.emqx.com/zh/mqtt/mqtt5) 新增，可配置的对象的属性值，详情请参考：https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
- 如果需要配置 SSL/TLS 连接，Option 对象会被传递给 [`tls.connect()`](http://nodejs.org/api/tls.html#tls_tls_connect_options_callback) ，因此可以在 option 中配置以下属性
  - `rejectUnauthorized`: 是否验证服务端证书链和地址名称，设置为 false 时将跳过验证，会暴露在中间人的攻击之下，所以不建议在生产环境中使用这种配置，当设置为 true 时，将开启强认证模式，且如果是自签名证书，请在证书配置时设置 Alt name。
  - `ca`: 只有在服务器使用自签名证书时才有必要，自签名证书中生成的 CA 文件
  - `cert`: 只有当服务器需要客户证书认证时才有必要（双向认证），客户端证书
  - `key`: 只有当服务器需要客户证书认证时才有必要（双向认证），客户端密钥



### Client 事件

当连接成功后，返回的 Client 对象可通过 on 方法监听多个事件，业务逻辑可在监听的回调函数中完成。以下列举一些常用的事件：

- `connect`

  当连接成功时触发，参数为 connack

  ```javascript
  client.on('connect', function (connack) {
    console.log('Connected')
  })
  ```

- `reconnect`

  当断开连接后，经过重连间隔时间重新自动连接到 Broker 时触发

  ```javascript
  client.on('reconnect', function () {
    console.log('Reconnecting...')
  })
  ```

- `close`

  在断开连接以后触发

  ```javascript
  client.on('close', function () {
    console.log('Disconnected')
  })
  ```

- `disconnect`

  在收到 Broker 发送过来的断开连接的报文时触发，参数 packet 即为断开连接时接收到的报文，MQTT 5.0 中的功能

  ```javascript
  client.on('disconnect', function (packet) {
    console.log(packet)
  })
  ```

- `offline`

  当客户端下线时触发

  ```javascript
  client.on('offline', function () {
    console.log('offline')
  })
  ```

- `error`

  当客户端无法成功连接时或发生解析错误时触发，参数 error 为错误信息

  ```javascript
  client.on('error', function (error) {
    console.log(error)
  })
  ```

- `message`

  当客户端收到一个发布过来的 Payload 时触发，其中包含三个参数，topic、payload 和 packet，其中 topic 为接收到的消息的 topic，payload 为接收到的消息内容，packet 为 [MQTT 报文](https://www.emqx.com/zh/blog/introduction-to-mqtt-control-packets)信息，其中包含 QoS、retain 等信息

  ```javascript
  client.on('message', function (topic, payload, packet) {
    // Payload is Buffer
    console.log(`Topic: ${topic}, Message: ${payload.toString()}, QoS: ${packet.qos}`)
  })
  ```



### Client 方法

Client方法用来进行发布订阅的操作等，以下列举一些常用的方法。

- `Client.publish(topic, message, [options], [callback])`

  向某一 topic 发布消息的函数方法，其中包含四个参数：

  - topic: 要发送的主题，为字符串
  - message: 要发送的主题的下的消息，可以是字符串或者是 Buffer
  - options: 可选值，发布消息时的配置信息，主要是设置发布消息时的 QoS、Retain 值等。
  - callback: 发布消息后的回调函数，参数为 error，当发布失败时，该参数才存在

  ```javascript
  // 向 testtopic 主题发送一条 QoS 为 0 的测试消息
  client.publish('testtopic', 'Hello, MQTT!', { qos: 0, retain: false }, function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log('Published')
    }
  })
  ```

- `Client.subscribe(topic/topic array/topic object, [options], [callback])`

  订阅一个或者多个 topic 的方法，当连接成功需要订阅主题来获取消息，该方法包含三个参数：

  - topic: 可传入一个字符串，或者一个字符串数组，也可以是一个 topic 对象，`{'test1': {qos: 0}, 'test2': {qos: 1}}`
  - options: 可选值，订阅 Topic 时的配置信息，主要是填写订阅的 Topic 的 QoS 等级的
  - callback: 订阅 Topic 后的回调函数，参数为 error 和 granted，当订阅失败时 error 参数才存在, granted 是一个 {topic, qos} 的数组，其中 topic 是一个被订阅的主题，qos 是 Topic 是被授予的 QoS 等级

  ```javascript
  // 订阅一个名为 testtopic QoS 为 0 的 Topic
  client.subscribe('testtopic', { qos: 0 }, function (error, granted) {
    if (error) {
      console.log(error)
    } else {
      console.log(`${granted[0].topic} was subscribed`)
    }
  })
  ```

- `Client.unsubscribe(topic/topic array, [options], [callback])`

  取消订阅单个主题或多个主题，该方法包含三个参数：

  - topic: 可传入一个字符串或一个字符串数组
  - options: 可选值，取消订阅时的配置信息
  - callback: 取消订阅时的回调函数，参数为 error，当取消订阅失败时 error 参数才存在

  ```javascript
  // 取消订阅名为 testtopic 的 Topic
  client.unsubscribe('testtopic', function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log('Unsubscribed')
    }
  })
  ```

- `Client.end([force], [options], [callback])`

  关闭客户端，该方法包含三个参数:

  - force: 设置为 true 时将立即关闭客户端，而无需等待断开连接的消息被接受。这个参数是可选的，默认为 false。**注意**：使用该值为 true 时，Broker 无法接收到 disconnect 的报文
  - options: 可选值，关闭客户端时的配置信息，主要是可以配置 reasonCode，断开连接时的 Reason Code
  - callback: 当客户端关闭时的回调函数

  ```javascript
  client.end()
  ```





