前面是js和移动端相关核心的，基础的思想讲解

以Ajax为切入口，去理解完全前后端分离的项目中如何完成前后端数据通信和交互。

## 项目发布

1. 购买一台服务器（ 万网(阿里云) ）（服务器联网后会自动分配一个外网ip地址）

   虚拟云服务器（多人共享一台服务器）  |     独立主机

2. 购买一个域名

3. 域名和外网IP映射（DNS解析）

4. 备案

5. 把本地项目的源码通过FTP协议上传到服务器指定的目录中（FTP上传工具）

6. 使用web端的工具在同一台服务器中发布项目（IIS => windows、 apache | tomcat => Linux、nginx）

   指定当前域名访问服务器后，到底执行服务器本机中的哪个项目源码

   

![image-20211120165326021](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120165326021.png)



![image-20211120165401988](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120165401988.png)





file zille界面：

![image-20211120165825380](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120165825380.png)



![image-20211120165836974](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120165836974.png)

![image-20211120165845571](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120165845571.png)







客户端：用于向服务器发送请求的计算机

服务器端：用于接受客户端请求并响应一定内容的计算机，服务器本地也分磁盘，不同磁盘下存放着不同的项目源码（这些源码是通过开发者的电脑通过FTP软件上传的）

在服务器上还有WEB发布工具用于配置项目源码和域名端口号的映射，基于WEB发布工具在服务器上创建许多服务，当客户端访问时，服务器会匹配出具体访问哪个服务。

DNS域名解析服务器







### 在浏览器地址栏输入一个url后到页面展示完成的过程（面试）

![image-20211120172048247](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120172048247.png)

![image-20211120172250664](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120172250664.png)





![image-20211120173222041](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120173222041.png)



## URL的完整组成

传输协议`://`域名:端口号/请求路径名称?传参#hash



.com:商用国际域名

.cn：商用中文域名

.net：用于网络供应服务商（系统类网站常用）

.org：用于非政府的官方组织

.edu：用于教育机构

.gov：用于政府机构



一级域名（qq.com）

二级域名（`www.qq.com`）

三级域名（xxx.xxx.qq.com）





请求路径对应的是服务器本地的项目目录及其资源，但是有些网站为了安全考虑可能对URL进行伪重写技术。





## 前端性能优化

![image-20211120184207802](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211120184207802.png)

![image-20211121093218923](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211121093218923.png)

![image-20211121093337572](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211121093337572.png)



4. 减少对DOM的操作（主要是减少重绘和回流（重排））
   - 注意重排的分离读写，把对DOM的设置操作全部写在一起，因为新版的浏览器有一个智能缓存机制，该机制如果发现第一条语句是修改DOM操作的代码，则会排查下面的语句是否还是和DOM操作有关的语句，如果下面紧接着的多条语句的也是操作DOM相关的语句，则会将这些全部操作DOM的语句放入临时处理的地方集中，直到后面解析到一句非DOM操作的语句时，再将前面集中管理的语句集合统一一次执行。所以尽可能将设置语句集中书写。
   - 使用文档碎片或者字符串拼接做数据绑定（DOM的动态创建）
   - 减少JS中嵌套循环的使用
5. 图片懒加载（延迟加载），减少页面第一次加载时http请求的次数，刚开始加载页面时，所有真实图片都不去发HTTP请求加载，而是给一张占位的背景图，当页面加载完后，并且图片在可视区域内后再去做图片加载
6. 利用304缓存技术对不经常更新的静态资源文件做缓存处理（js,css,静态图片）减少HTTP请求次数和请求大小
7. 多利用事件委托机制
8. CSS雪碧图技术
9. 尽量减少CSS表达式的使用（expression）；减少CSS中Filter滤镜属性使用；css中开启图层；在导入或引入CSS时，尽量少使用@import方式导入，因为@import是同步操作，只有把@import需要导入css导入完，才会向下加载，而link标签则是异步加载
10. 减少COOKIE的使用和大小
11. 页面数据的获取采用异步和延迟分批加载
12. 页面出现音频视频标签时，不要在页面加载过程中也去加载这些资源（设置标签的preload='none'），不然页面加载速度会变慢，等待页面加载完成后音频视频在被播放时再去加载音视频资源
13. 前后端数据交互尽可能采用JSON格式传递数据
14. 使用window.requestAnimationFrame 这个JS中的帧动画代替传统的定时器动画
15. 建议使用尾递归（将递归放在该方法的末尾执行）
16. 基于script标签的defer属性或者async属性来异步加载
17. CDN加速（重量级优化但费钱）





## Ajax

```js
let xhr = new XMLHtppRequest()
xhr.open(method,url,async,user-name,user-pass)
// async:默认值是true，表示异步请求

xhr.onreadystatechange = () =>{
    if(xhr.readyState ===4 && xhr.status === 200){
        //....
    }
}

xhr.send()
```



![image-20211121121528563](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20211121121528563.png)





