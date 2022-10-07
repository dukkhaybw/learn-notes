# Websocket 实时通信

## Http 协议

### 定义

Http 是客户端/服务器模式中请求-响应所用的协议，在这种模式中，客户端(一般是 web 浏览器)向服务器提交 HTTP 请求，服务器响应请求的资源。

### 特点

- HTTP 是半双工协议，也就是说，在同一时刻数据只能单向流动，客户端向服务器发送请求(单向的)，请求完成后服务器响应请求(单向的)。（类比于传呼机）
- 服务器不能主动推送数据给浏览器。

单工，半双工和全双工。

### 双向通信

Comet 是一种用于 web 的推送技术，能使服务器实时地将更新的信息传送到客户端，而无须客户端发出请求，目前有三种实现方式:轮询（polling） 长轮询（long-polling）和 iframe 流（streaming）。

#### 轮询

- 轮询是客户端和服务器之间会一直进行连接，每隔一段时间就询问一次
- 这种方式连接数会很多，一个接受，一个发送。而且每次发送请求都会有 Http 的 Header，会很耗流量，也会消耗 CPU 的利用率

![polling](http://img.zhufengpeixun.cn/polling.jpg)

```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/click', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.end(new Date().toLocaleString());
});
app.listen(8000);
```

```js
let clock = document.getElementById('clock');
setInterval(function () {
  let xhr = XMLHttpRequest();
  xhr.open('GET', '/clock', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      clock.innerText = xhr.responseText;
    }
  };
  xhr.send();
}, 1000);

// 缺点：每个客户端都有一个自己的请求，导致服务器高并发
```

#### 长轮询

- 长轮询是对轮询的改进版，客户端发送 HTTP 给服务器之后，看有没有新消息，如果没有新消息，就一直等待
- 当有新消息的时候，才会返回给客户端。在某种程度上减小了网络带宽和 CPU 利用率等问题。
- 由于 http 数据包的头部数据量往往很大（通常有 400 多个字节），但是真正被服务器需要的数据却很少（有时只有 10 个字节左右），这样的数据包在网络上周期性的传输，难免对网络带宽是一种浪费

![image-20211225132334192](.\typora-user-images\image-20211225132334192.png)

```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/click', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  let timer = setInterval(() => {
    let data = new Date();
    let seconds = date.getSeconds();
    if (second % 5 === 0) {
      // 可以理解为运行5秒后在返回响应给前端
      res.end(new Date().toLocaleString());
      clearInterval(timer);
    }
  }, 1000);
});
app.listen(8000);
```

```js
let clock = document.getElementById('clock');
function send() {
  let xhr = XMLHttpRequest();
  xhr.open('GET', '/clock', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      clock.innerText = xhr.responseText;
      send();
    }
  };
  xhr.send();
}
send();

// 当前一次的请求回来后再发下一次请求
```

#### iframe 流

- 通过在 HTML 页面里嵌入一个隐藏的 iframe,然后将这个 iframe 的 src 属性设为对一个长连接的请求,服务器端就能源源不断地往客户推送数据。

![iframeflow](http://img.zhufengpeixun.cn/iframeflow.png)

```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/clock', function (req, res) {
  res.header('Content-Type', 'text/html');
  setInterval(function () {
    res.write(`
            <script type="text/javascript">
                parent.document.getElementById('clock').innerHTML = "${new Date().toLocaleTimeString()}";
            </script>
        `);
  }, 1000);
});
app.listen(8080);
```

```html
<div id="clock"></div>
<iframe src="/clock" style=" display:none" />
```

缺点是：页面的页面 favicon 图片一直是环在旋转。

#### EventSource 流

- HTML5 规范中提供了服务端事件 EventSource，浏览器在实现了该规范的前提下创建一个 EventSource 连接后，便可收到服务端的发送的消息，这些消息需要遵循一定的格式，对于前端开发人员而言，只需在浏览器中侦听对应的事件皆可
- SSE 的简单模型是：一个客户端去从服务器端订阅一条`流`，之后服务端可以发送消息给客户端直到服务端或者客户端关闭该“流”，所以 eventsource 也叫作`"`server-sent-event`
- EventSource 流的实现方式对客户端开发人员而言非常简单，兼容性良好
- 对于服务端，它可以兼容老的浏览器，无需 upgrade 为其他协议，在简单的服务端推送的场景下可以满足需求
- 不能跨域

webpack 中的热更新。

##### 浏览器端

- 浏览器端，需要创建一个`EventSource`对象，并且传入一个服务端的接口 URI 作为参
- 默认 EventSource 对象通过侦听`message`事件获取服务端传来的消息
- `open`事件则在 http 连接建立后触发
- `error`事件会在通信错误（连接中断、服务端返回数据失败）的情况下触发
- 同时`EventSource`规范允许服务端指定自定义事件，客户端侦听该事件即可

```html
<script>
  var eventSource = new EventSource('/eventSource');  /eventSource 是后端接口地址
  eventSource.onmessage  = function(e){
      console.log(e.data);
  }
  eventSource.onerror  = function(err){
      console.log(err);
  }
</script>
```

##### 服务端

- 事件流的对应 MIME 格式为`text/event-stream`，而且其基于 HTTP 长连接。针对 HTTP1.1 规范默认采用长连接，针对 HTTP1.0 的服务器需要特殊设置。
- event-source 必须编码成 utf-8 的格式，消息的每个字段使用"\n"来做分割，并且需要下面 4 个规范定义好的字段：
  - Event: 事件类型
  - Data: 发送的数据
  - ID: 每一条事件流的 ID
  - Retry： 告知浏览器在所有的连接丢失之后重新开启新的连接等待的时间，在自动重新连接的过程中，之前收到的最后一个事件流 ID 会被发送到服务端

```js
let express = require('express');
let app = express();
app.use(express.static(__dirname));
let sendCount = 1;
app.get('/eventSource', function (req, res) {
  res.header('Content-Type', 'text/event-stream');
  let timer = setInterval(() => {
    res.write(`event:message\nid:${sendCount++}\ndata:${Date.now()}\n\n`);
    // 其中的event:message 中，事件是message，它必须和前端的eventSource上特定的事件名一一对应（具体事件名可以自定义，但是必须对应。）表示后端返回的数据将触发前端创建的eventSource对象上的message事件
  }, 1000);
  res.on('close', function () {
    clearInterval(timer);
  });
});
app.listen(8888);
```

```js
let express = require('express');
let app = express();
app.use(express.static(__dirname));
const SseStream = require('ssestream');
let sendCount = 1;
app.get('/eventSource', function (req, res) {
  const sseStream = new SseStream(req);
  sseStream.pipe(res);
  const pusher = setInterval(() => {
    sseStream.write({
      id: sendCount++,
      event: 'message',
      retry: 20000, // 告诉客户端,如果断开连接后,20秒后再重试连接
      data: { ts: new Date().toTimeString() }
    });
  }, 1000);

  res.on('close', () => {
    clearInterval(pusher);
    sseStream.unpipe(res);
  });
});
app.listen(8888);
```

Http 协议的问题：请求头和响应头内容过大（避免不了的，因为是协议规定），并发压力很大。上面的实时通讯方式（基于 http 协议）并不是原生意义上的双工模式。

html5 开发一套全新的协议：websocket。http 协议和 websocket 协议都是应用层协议，都基于 TCP 协议之上。

## Websocket

### 定义

- [WebSockets_API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 规范定义了一个 API 用以在网页浏览器和服务器建立一个 socket 连接。通俗地讲：在客户端和服务器保有一个持久的连接，两边可以在任意时间开始发送数据。
- HTML5 开始提供的一种浏览器与服务器进行全双工通讯的网络技术
- 属于应用层协议，它基于 TCP 传输协议，并复用 HTTP 的握手通道。

### websocket 优势

- 支持双向通信，实时性更强。
- 更好的二进制支持。
- 较少的控制开销。连接创建后，ws 客户端、服务端进行数据交换时，协议控制的数据包头部较小。
- 可以跨域

### websocket 实战

#### 服务端

npm i ws -S

```js
let express = require('express');
const path = require('path');
let app = express();
let server = require('http').createServer(app);
app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.listen(3000);

//-----------------------------------------------
let WebSocketServer = require('ws').Server;
let wsServer = new WebSocketServer({ port: 8888 });
// socket 套接字（插座）
wsServer.on('connection', function (socket) {
  console.log('连接成功');
  socket.on('message', function (message) {
    console.log('接收到客户端消息:' + message);
    socket.send('服务器回应:' + message);
  });
});
```

#### 客户端

```html
<script>
  let ws = new WebSocket('ws://localhost:8888');
  ws.onopen = function () {
    console.log('客户端连接成功');
    ws.send('hello');
  };
  ws.onmessage = function (event) {
    console.log('收到服务器的响应 ' + event.data);
  };
</script>
```
