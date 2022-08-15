React服务端渲染框架

手写SSR基本原理

Next.js



渲染模式：

- 服务端渲染

  页面上html内容是由服务器生产。
  ```js
  let express = require('express');
  let app = express();
  app.get('/', (req, res) => {
    res.send(`
          <html>
            <body>
              <div id="root">hello</div>
            </body>
          </html>
      `);
  });
  app.listen(8080);
  ```

  

- 客户端渲染

  页面上的内容由于浏览器运行JS脚本而渲染到页面上

  - 浏览器访问服务器
  - 服务器返回一个空的HTML页面，里面有一个JS资源链接，比如`client`
  - 浏览器下载JS代码并在浏览器中运行
  - 内容呈现在页面上

  ```js
  let express = require('express');
  let app = express();
  app.get('/', (req, res) => {
    res.send(`
          <html>
            <body>
              <div id="root"></div>
              <script>root.innerHTML = 'hello'</script>
            </body>
          </html>
      `);
  });
  app.listen(8090);
  ```

  

CSR的不足：

- 首屏等待 在客户端渲染的模式下，所有的数据请求和DOM渲染都在浏览器端完成,所以第一次访问页面时，可能会出现白屏，而服务器端渲染会在服务器端进行数据请求和DOM渲染，浏览器收到的完整的内容，可以渲染页面  
- SEO SPA对搜索引擎不够友好



