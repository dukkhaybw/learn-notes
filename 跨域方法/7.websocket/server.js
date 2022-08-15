// const express = require('express')
// let app = express()
const WebSocket = require('ws')
let wss =new WebSocket.Server({port:3000 })//通过websocket创建服务应用
wss.on('connection', function (ws) {
  ws.on('message',function (data) {
    console.log(data);
  })
  ws.send('hello page')
})




// app.listen(3000)  这是监听的http300的接口