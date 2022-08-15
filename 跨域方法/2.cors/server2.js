const express = require('express');

const app = express();

app.use(function (req, res, next) {
  let origin = req.headers.origin;  //获取请求源
  let whiteList = ['http://localhost:3000']
  if (whiteList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);  //将origin设置为可以请求的源 ,这种方式的话，默认允许客户端发送get与 head 请求，不支持其他请求方式  ,如果设置为 * 号，那则无法与 设置允许客户端Ajax请求携带cookie 连用

    res.setHeader('Access-Control-Allow-Headers', 'name,age');  //设置允许客服端设置哪些请求头信息

    res.setHeader('Access-Control-Allow-Methods', 'PUT');  // 设置允许客户端设置哪些请求方式

    res.setHeader('Access-Control-Allow-Max-Age', 6000);   // 预检测存活时间(options请求)

    res.setHeader('Access-Control-Allow-Credentials', true)  // 允许客户端Ajax请求携带cookie
    
    res.setHeader('Access-Control-Expose-Headers','name,age,gender') //允许前端获取哪个请求头

    //一般Ajax请求会先发送一个option请求方式到服务器端，用于确认该服务器支持哪些请求方式，能接受对应Ajax请求方式时，再发给服务端
    if (req.method === 'OPTIONS') {
      res.end()  //针对options请求方式不做任何处理
    }
  }
  next()
});

app.get('/getData', function (req, res) {
  console.log(req.headers);
  res.setHeader('name','wuyibo')
  res.end('hello express');
})
app.put('/getData', function (req, res) {
  console.log(req.headers);
  res.end('hello express');
})

app.listen(4000);