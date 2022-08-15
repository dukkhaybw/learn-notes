

### 基础

**XMLHttpRequest** 构造函数的实例用于发出ajax请求。

浏览器发送ajax请求有两种方式：

- XHR对象

- Fetch函数

  **fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象**

请求头key:value

get请求参数有两种：

- query参数 (?id=1)：直接写在url地址栏中
- params参数(/1),在axios配置对象中的params参数最后是以？key=value的形式拼接到路由地址栏的

请求报文和响应报文

### 请求体参数 

请求报文中的Content-Type用来描述请求体的参数的格式

参数格式：

- Content-Type: application/x-www-form-urlencoded;charset=utf-8  ：用于键值对参数，参数的键值用=连接, 参数之间用&连接
  name=jack&age=12
- Content-Type: application/json;charset=utf-8 ：用于 json 字符串参数
  {"name": "jack", "age": 12}
- Content-Type:multipart/form-data  :文件的格式

响应报文中的Content-Type用来描述响应体的参数的格式

参数格式：

- Content-Type: text/html；charset=utf-8
- Set-Cookie:xxxx=xxx;path=/





### 服务端接口（API） 的分类（面试）（前后台交互的接口）

- REST API  （restful）
  - 发送请求进行 CRUD 哪个操作由请求方式来决定
  - 同一个请求路径可以进行多个操作
  - 请求方式会用到 GET/POST/PUT/DELETE/PATCH
- 非 REST API （restless）
  - 请求方式不决定请求的 CRUD 操作
  - 一个请求路径只对应一个操作
  - 一般只有 GET（一般用于查询）/POST（增删改）





### json-server 搭建 REST API

json-server是快速搭建 REST API 的工具包。这里使用 json-server 是为了快速实现对自己写的axios代码的测试。

快速上手：

- ```
  npm install -g json-server
  ```

- 在一个特定的文件夹下新建 db.json 文件并写入类似内容

  ```
  {
    "posts": [
      { "id": 1, "title": "json-server", "author": "typicode" }
    ],
    "comments": [
      { "id": 1, "body": "some comment", "postId": 1 }
    ],
    "profile": { "name": "typicode" }
  }
  ```

- ```
  json-server --watch db.json  //启动json服务
  ```





### AJAX对象

ajax对象的构造函数：XMLHttpRequest

const xhr =new XMLHttpRequest()

Ajax**实例对象**上的属性或者事件或者方法：

​		属性

- status: 响应状态码值, 比如 200, 404

- statusText: 响应状态文本

- readyState: 标识请求状态的只读属性
  0：初始化完成
  1：open（）调用完成
  2：send( )调用完成
  3：服务端返回数据过程中
  4：服务端返回数据过程结束
  readyState每改变一次就触发onreadystatechange绑定的处理函数一次。

  

- response: 响应体数据

- responseType: 指定响应数据类型

- timeout: 指定请求超时时间, 默认为 0 代表没有限制


  事件

- onreadystatechange: 绑定 readyState 改变的监听函数

- ontimeout: 绑定超时的监听

- onerror: 绑定请求网络错误的监听


  方法

- open(): 初始化一个请求, 参数为: (method, url [, async])

- send(data): 发送请求，它是异步发送的，所以onreadystatechange绑定事件处理函数可以在该语句之后

- abort(): 中断请求

- getResponseHeader(name): 获取指定名称的响应头值

- getAllResponseHeaders(): 获取所有响应头组成的字符串 

- setRequestHeader(name, value): 设置请求头



#### AJAX的http请求和一般的http请求差异

- 对服务器端来说, 没有任何区别, 区别在浏览器端
- 浏览器端发请求: 只有 XHR 或 fetch 发出的才是 ajax 请求, 其它所有的都是非 ajax 请求,浏览器有特定的发送ajax请求的线程，一般的http请求由浏览器的网络模块发送
- 一般请求: 浏览器一般会直接启动渲染与解析，显示响应体数据, 也就是我们常说的刷新/ 跳转页面
- Ajax请求获取数据后如果没有处理数据的代码，则不会有任何界面变化，无历史记录无法回退，无法跨域，对SEO不友好
- ajax 请求: 浏览器不会在收到响应数据后自动对界面进行任何更新操作, 只是调用监视的回调函数并传入响应相关数据，由回调函数开启局部渲染

#### ajax对象的属性与方法

1. 属性

   - xhr.status：响应状态码

   - xhr.statusText：响应状态字符串

   - xhr.readyState：请求状态码 （0，1，2，3，4）

   - xhr.responseType：指定响应数据自动解析为该属性对应的值的类型

   - xhr.response：响应数据

   - xhr.timeout：定义超时时间

   
   
   
   
2. 事件

   - xhr.ontimeout：请求超时时触发事件

   - xhr.onreadystatechange  ：请求状态码改变时触发事件

   - xhr.onerror：请求错误时触发事件

   

3. 方法

   - xhr.open(method, url  [, async])
   - xhr.send(data)
   - xhr.abort( )
   - xhr.getResponseHeader(name)
   - xhr.getAllResponseHeaders()
   - xhr.setRequestHeader(name, value)

#### Ajax的基本使用：

```JS
button.onclick = function(){
	const xhr = new XMLHttpRequest() // 创建Ajax实例对象
    xhr.open(method, url)
    xhr.responesType = 'json' //将响应回来的数据当做json格式的并自动解析为js对象类型，即xhr.response直接以对象形式获取，不用再解析
    xhr.onreadystatechange = function(){
        if(xhr.readystate ===4){    //判断服务器是否结束返回了数据过程
            if(xhr.status >=200 && xhr.status < 300){   // 判断服务器返回的数据中的状态码是否是成功的状态码
                // 通过 xhr.response 取出响应数据，进行一系列操作，如dom创建与渲染
            }
        }
    }
    xhr.send()
}

xhr.onreadystatechange = function(){} 可以简写为xhr.onload =function()
```

在Ajax中设置get请求的参数：

```
xhr.open('get', url?key1=value1&key2=value2)
xhr.open('get', url/:value)
```

在Ajax中设置post请求的参数：

```
xhr.open('post', url)

xhr.send('key1=value1&key2=value2')
xhr.send(JSON.stringify(dataObj)
```

解决ie缓存方式：

```
xhr.open(method,'url?t='+ Date now())
```

处理Ajax请求重复发送的情况：

```
let flag =false;
const xhr = new XMLHttpRequest() // 创建Ajax实例对象
button.onclick = function(){
    if(flag){
        xhr.abort()
    }
    flag = true
    xhr.open(method, url)
    xhr.responesType = 'json' //将响应回来的数据当做json格式的并自动解析为js对象类型，即xhr.response直接以对象形式获取，不用再解析
    xhr.onreadystatechange = function(){
        if(xhr.readystate ===4){    //判断服务器是否结束返回了数据过程
            if(xhr.status >=200 && xhr.status < 300){   // 判断服务器返回的数据中的状态码是否是成功的状态码
                // 通过 xhr.response 取出响应数据，进行一系列操作，如dom创建与渲染
                flag = false
            }
        }
    }
    xhr.send()
}
```

jQuery中发送Ajax请求

方式一：

```
$.get/post('url',{key1:value1,key2:value2..},callback,响应体数据类型)
```

方式二：

```
$.ajax({
	url:'url',
	data:{key1:value1,key2:value2..},
	type:'get/post',
	success(){},
	dataType:'json',
	error(){},
	timeout: ~ ,
	header:{}
})
```

jQuery发送JSONP请求

```
$.getJSON('URL?callback=函数名'，function(){

})
```

### axios

**axios库中的axios既可以作为函数去调用，也可以作为对象去调用。（jQuery的写法）**

```js
axios.get('...')

axios({  //配置对象
	method:'get',
	url:'...'
})

//配置对象中的属性与属性值的格式都是确定好的，有他们各自的意义。
```

###  axios的特点

```
对原生XHR的封装，只不过它是Promise的实现版本，符合最新的ES规范
基于promise的封装XHR的异步ajax请求库
浏览器端/node端都可以使用
支持请求／响应拦截器
支持请求取消
请求/响应数据转换
批量发送多个请求
```

### 封装ajax为axios

```js
function axios({
	url,
	method='GET',
	params={},  //该配置项专门用于指定get请求或者delete请求url的query部分的参数的，问号后面的参数
	data={}  // `data` 是作为请求主体被发送的数据,只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
	
    // syntax alternative to send data into the body
    // method post
    // only the value is sent, not the key
    //data: 'Country=Brasil&City=Belo Horizonte',
	
	
}){
	return new Promise((resolve, reject)=>{
		method = method.toUpperCase()  //请求方法转为大写
		//处理get传参方式一
		let queryArray=[]
		let index = 0
		for(let key in params){
			queryArray[index++]=[key,params[key]]   
		}
		queryArray = queryArray.map(item=>{
			return item.join('=')
		})
		queryArray = queryArray.join('&')
		queryArray ? url = url + '?'+queryArray : null
		
		//处理get传参方式二
		let queryString = ''
		for(let key in params){
			queryString + = key + '=' + params[key]
		}
		queryString ? queryString='?'+queryString:null
		url= url+queryString
		
		
		
		const xhr = new XMLHttpRequest()
		xhr.open(url, method, false)
		xhr.onreadstatechange = function(){
			if( xhr.readyState === 4 ){
				if(xhr.status >= 200 && xhr.status < 300){
					const response = {
						data:JSON.parse(xhr.respones),
						status:xhr.status,
						statusText:xhr.statusText
					}
					resolve(response)
				}else{
					reject(xhr.response)
				}
			}
		}
		if(method === 'GET'){
			xhr.send(null)
		}else if( method === 'POST'){
			//这部分是关于post请求的请求体参数的处理
			data = JSON.stringify(data)
			xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')//
			xhr.send(data)
		}
		
	})
}
```



#### axios的基础用法

```
axios(config): 通用/最本质的发任意类型请求的方式
axios(url[, config]): 可以只指定url发get请求
axios.request(config): 等同于axios(config)
axios.get(url[, config]): 发get请求
axios.delete(url[, config]): 发delete请求
axios.post(url[, data, config]): 发post请求
axios.put(url[, data, config]): 发put请求

axios.defaults.xxx: 请求的默认全局配置
axios.interceptors.request.use(): 添加请求拦截器
axios.interceptors.response.use(): 添加响应拦截器

axios.create([config]): 创建一个新的axios(它没有下面的功能)

axios.Cancel(): 用于创建取消请求的错误对象
axios.CancelToken(): 用于创建取消请求的token对象
axios.isCancel(): 是否是一个取消请求的错误
axios.all(promises): 用于批量执行多个异步请求
axios.spread(): 用来指定接收所有成功数据的回调函数的方法
```



### axios.create(config)（面试点）

axios的ajax的二次封装,应用场景：一个前端项目需要向多个不同域名的服务器发送ajax请求，如果只用axios对象是只能配置一个基础域名，用axios的二次封装对象，则每个单独的对象都可以配置自己的基础域名。

```
import axios from 'axios'

const instance = axios.create({
	baseURL:''
})

export default instance
```

分别向两个不同域名的后台发请求，且都有默认的基础路由等配置，那么至少需要一个instance对象和一个axios对象。 



axios.default.baseURL = '........'

```
const instance = axios.create({
	baseURL:'........' 
})
instance({
	url:'....',
	method:'...'
})
```





### axios的处理链流程（请求和响应拦截器）

拦截器底层用的就是promise。use方法指定的回调函数就是promise的成功或者失败的回调函数，拦截器的成功或者失败的回调函数之间和最终请求发出的函数之间能实现串联。

请求拦截器是后添加的先执行，而响应拦截器是后添加的后执行。在请求拦截器中的成功的回调函数中，必须返回config对象，它能被传给下一请求拦截器的成功的回调函数或者传给请求最终被发出的那个函数。在请求拦截器中的失败的回调函数中，必须返回失败的promise对象，它能被传给下一请求拦截器的失败的回调函数或者传给请求最终被发出的那个函数。

响应拦截中的成功或者失败的回调函数，也必须返回response或者失败的promise对象，以继续走之后的回调函数。也可以实现中断回调。

```
axios.defaults.baseURL = 'xxxxxxxx'

//请求拦截器
axios.interceptors.request.use(
	(config)=>{
		console.log(1)
		return config
	},
	error=>{
		return Promise.reject(error)
	}
)
axios.interceptors.request.use(
	(config)=>{
		console.log(2)
		return config
	},
	error=>{
		return Promise.reject(error)
	}
)


//响应拦截器
axios.interceptor.response.use(
	response=>{
		console.log(3)
		return response
	},
	error=>{
		console.log(4)
		return Promise.reject(error)
	}
)
axios.interceptor.response.use(
	response=>{
		console.log(5)
		return response
	},
	error=>{
		console.log(6)
		return Promise.reject(error)
	}
)


axios.get('/xxxx')
```

打印输出的顺序如下：

![image-20210703210808024](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210703210808024.png)

2  =》 1  =》 3 =》5



### axios请求的取消

在请求发出但未完成时才有效。

```
const CancelToken = axios.CancelToken
let cancel 

axios({
	url:'http://xxxxxx.xxx/xxxx',
	CancelToken: new CancelToken(()=>{
		cancle = c
	})
}).then(res=>{
	cancel = null
	console.log(res.data)
},error=>{
	cancel =null
	console.log(error)
})


在某个事件处理函数中，当开发者调用cancel函数时，将取消该对应的请求。
cancel('XXXXXX')  //调用该函数后，将会出该该axios请求的失败的回调函数，并传入该参数。  同时error对象时axios中自己定义的一种错误对象 Cancel 错误    ，这区别去普通的错误 Error。  同时在axios中提供了一个方法可以检测错误对象是不是 axios中的Cancel错误对象————axios.isCancel(error)  返回true或者false
```



另一中取消请求的场景：

有多个dom元素可以触发请求，但是同一个时间只能允许一个请求是能被发出去的。在上一个请求并没有成功响应之前，再次 点击新的请求，之前的请求将取消，并发起一个新的请求。

```
const CancelToken = axios.CancelToken
let cancel 

function request1 (){
	if(cancel instanceof 'function'){
		cancel('取消请求')
	}
	axios.get('xxxxxx',{
		cancelToken = new CancelToken((c)=>{
			cancel=c
		})
	}).then(res=>{
		cancel = null
		console.log(res)
	}).catch(reeoe=>{
		cancel = null
		console.log(error)
	})
}


function request2 (){
	if(cancel instanceof 'function'){
		cancel('取消请求')
	}
	axios.get('xxxxxx',{
		cancelToken = new CancelToken((c)=>{
			cancel=c
		})
	}).then(res=>{
		cancel = null
		console.log(res)
	}).catch(reeoe=>{
		cancel = null
		console.log(error)
	})
}
```

高频执行上面代码中的两个函数时，出现的情况如下：

![image-20210703223438234](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210703223438234.png)

并不是每次都能成功取消上一次的请求的。



解决上面出现的问题：

```
const CancelToken = axios.CancelToken
let cancel 

function request1 (){
	if(typeof cancel ==='function'){
		cancel('取消请求')
	}
	axios.get('xxxxxx',{
		cancelToken = new CancelToken((c)=>{
			cancel=c
		})
	}).then(res=>{
		cancel = null
		console.log(res)
	}).catch(error=>{
		if(axios.isCancel(error)){    +++++++++++
			console.log(error)
		}else{
			cancel = null
			console.log(error)
		}
	})
}


function request2 (){
	if(typeof cancel === 'function'){
		cancel('取消请求')
	}
	axios.get('xxxxxx',{
		cancelToken = new CancelToken((c)=>{
			cancel=c
		})
	}).then(res=>{
		cancel = null
		console.log(res)
	}).catch(reeoe=>{
		if(axios.isCancel(error)){    +++++++++++
			console.log(error)
		}else{
			cancel = null
			console.log(error)
		}
	})
}
```

现在的处理结果：

![image-20210703224500013](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210703224500013.png)





之前出错的原因：

发出请求一并且请求尚未成功响应时，触发请求二并且执行cancel方法，将前一次的请求取消了。然后在请求二的函数体剩下的代码中，有给cancel变量赋值新的方法。  在触发第二次请求时，第一次请求的cancel函数执行后，会异步触发promise对象的失败的回调。当失败的回调在下一个事件环中被执行时，cancel变量实际存放的时用于取消第二次请求的取消请求函数。所以该异步回调直接将该cancel方法赋值为null，在第三次发出请求时，由于cancel变量中存放的是null所以没法取消第二次的请求了。这就是bug出现的原因。







上面的代码的中，两次请求的详细度很高，这时就可以借助拦截器函数进行代码简化

优化：

```
const CancelToken = axios.CancelToken
let cancel 

axios.interceptors.request.use((config)=>{
	if(typeof cancel === 'function'){
		cancel('取消请求')
	}
	config.cancelToken = new CancelToken((c)=>{
			cancel=c
	}
})

axios.interceptors.response.use(
	(response)=>{
		cancel = null 
		return response	
	},
	error=>{
		if(axios.isCancel(error)){    +++++++++++
			return  new Promise()   //中断promise链
		}else{
			cancel = null 
			return Promise.reject(error)
		}
	 	
	}
)


function request1 (){
	axios.get('xxxxxx')
	.then( res=>{
		console.log(res)
	}).catch(error=>{
		console.log(error)
	})
}


function request2 (){
	axios.get('xxxxxx')
	.then(res=>{
		console.log(res)
	})
	.catch(error=>{
		console.log(error)
	})
}
```









### 源码分析

源码难点与流程分析:

![](http://vipkshttp1.wiz.cn/ks/share/resources/49c30824-dcdf-4bd0-af2a-708f490b44a1/584701e2-1d9b-4523-b9b2-0f33e838dd7f/index_files/e5692e36861bd1d2fa1735c5ab801af7.png)





在axios中，既能用在浏览器端发送ajax请求，也可用于node.js中发送一般的http请求。在浏览器端它走的是对ajax对象的封装，在node.js中，它走的是对原生http模块的封装。

在axios源码中有Axios函数和axios函数，用instanceof检测axios函数是否是Axios的实例对象，返回值是false，但是在底层axios函数实际上继承了Axios实例和Axios的原型。可以在实现上将axios看作Axios的实例。开发者在使用的时候，使用的是axios函数对象。

Axios函数对象的原型上有一个方法Axios.prototype.request = function request(config){  .....  }，axios函数实际上就是 使用bind方法调用Axios.prototype.request 后的返回的函数，其中的this指向的是Axios的实例对象。

```js
axios包的入口文件中:
var axios = createInstance(defaults);

axios.Axios = Axios;

function createInstance(defaultConfig) {
  /* 
  创建Axios的实例
      原型对象上有一些用来发请求的方法: get()/post()/put()/delete()/request()
      自身上有2个重要属性: defaults/interceptors
  */  
  var context = new Axios(defaultConfig);

  // axios和axios.create()对应的就是request函数
  // Axios.prototype.request.bind(context)
  var instance = bind(Axios.prototype.request, context); // axios

  // 将Axios原型对象上的方法拷贝到instance上: request()/get()/post()/put()/delete()
  utils.extend(instance, Axios.prototype, context); 

  // 将Axios实例对象上的属性拷贝到instance上: defaults和interceptors属性
  utils.extend(instance, context);

  return instance;
}


function Axios(instanceConfig) {
  // 将指定的config, 保存为defaults属性
  this.defaults = instanceConfig;
  // 将包含请求/响应拦截器管理器的对象保存为interceptors属性
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  // 合并配置
  config = mergeConfig(this.defaults, config);
  // 添加method配置, 默认为get
  config.method = config.method ? config.method.toLowerCase() : 'get';

  /*
  创建用于保存请求/响应拦截函数的数组
  数组的中间放发送请求的函数
  数组的左边放请求拦截器函数(成功/失败)
  数组的右边放响应拦截器函数
  */
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  // 后添加的请求拦截器保存在数组的前面
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  // 后添加的响应拦截器保存在数组的后面
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
  

  // 通过promise的then()串连起所有的请求拦截器/请求方法/响应拦截器
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  // 返回用来指定我们的onResolved和onRejected的promise
  return promise;
};


// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});


// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');


//这里可以看出，axios和axios.create()方法返回的实例对象都可以看作Axios的实例对象，它们都是request函数，都有Axios原型上的方法，都有Axios实例对象上的属性：defaults 和 interceptors，这些事相同点。   
//不同点是:
// axios.create()方法返回的实例对象的基础配置项很可能不一样，因为createInstance(mergeConfig(axios.defaults, instanceConfig)) ，在开发者传了自己的配置对象时，开发者的配置对象中的某些属性会覆盖默认配置对象上的同名属性。如果开发者不传自己的配置对象，则采用默认的配置对象。
//重点不同点：在axios.create语句之后，代码还给默认的创建的axios对象方法上添加了  Cancel  ，CancelToken， isCancel ， all 等方法，而这都是axios.create()方法执行后返回的instance实例方法所没有的。

```

axios.create()返回的实例对象方法上的属性和方法如图：

![image-20210704105107695](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210704105107695.png)

可以看到没有Cancel等方法的存在。



默认创建的axios对象方法如下图：

![image-20210704105244341](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210704105244341.png)





![image-20210520232846632](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210520232846632.png)



执行axios(config)在底层调用的是Axios.prototype.request( ),执行axios.get ( ) 在底层调用的也是Axios.prototype.request( )。axios() 本质就是axios.request()。





```
1. axios与Axios的关系
   axios函数对应的是Axios.prototype.request方法通过bind(Axiox的实例)产生的函数
   axios有Axios原型上的所有发特定类型请求的方法: get()/post()/put()/delete()
   axios有Axios的实例上的所有属性: defaults/interceptors
   后面又添加了create()/CancelToken()/all()

2. axios.create()返回的对象与axios的区别
   1). 相同: 
       都是一个能发任意请求的函数: request(config)
       都有发特定请求的各种方法: get()/post()/put()/delete()
       都有默认配置和拦截器的属性: defaults/interceptors
   2). 不同:
       默认匹配的值不一样
       instance没有axios后面添加的一引起方法: create()/CancelToken()/all()

3. axios发请求的流程
   1). 整体流程: request(config)  ===> dispatchRequest(config) ===> xhrAdapter(config)

   2). request(config): 将请求拦截器 / dispatchRequest() / 响应拦截器 通过promise链串连起来, 返回promise

   request方法的作用是使用promise将请求拦截器 ，发送Ajax请求函数，响应拦截器和响应结果处理函数串联起来。
   
   
   3). dispatchRequest(config): 转换请求数据 ===> 调用xhrAdapter()发请求 ===> 请求返回后转换响应数据. 返回promise
   
   dispatchRequest函数主要负责转换请求体数据和响应体数据（注意不是url路径中的query部分的数据），并且在请求数据转换完成后 调用  xhrAdapter方法，然后再响应数据接收到后，对响应数据进行转换并返回转换好的数据给promise 的回调函数。
   

   4). xhrAdapter(config): 创建XHR对象, 根据config进行相应设置, 发送特定请求, 并接收响应数据, 返回promise 

4. axios的请求/响应拦截器是什么?
   1). 请求拦截器: 在真正发请求前, 可以对请求进行检查或配置进行特定处理的函数, 
              包括成功/失败的函数, 传递的必须是config
   2). 响应拦截器: 在请求返回后, 可以对响应数据进行特定处理的函数,
              包括成功/失败的函数, 传递的默认是response
              
              
              
5. axios的请求/响应数据转换器是什么?
   1). 请求转换器: 对请求头和请求体数据进行特定处理的函数
       setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
       return JSON.stringify(data)
   2). 响应转换器: 将响应体json字符串解析为js对象或数组的函数
       response.data = JSON.parse(response.data)

6. response的整体结构
   {
       data,
       status,
       statusText,
       headers,
       config,
       request
   }
   
   成功的异步请求的结果就是封装后的response对象本身，而失败的请求的结果是error对象，这个error对象已经被封装过了，如果想要获取失败结果的response则通过error对象上的response对象获取结果。

7. error的整体结构
   {
       message,
       request,
       response
   }

8. 如何取消未完成的请求
   1).当配置了cancelToken对象时, 保存cancel函数
       创建一个用于将来中断请求的cancelPromise
       并定义了一个用于取消请求的cancel函数
       将cancel函数传递出来
   2.调用cancel()取消请求
       执行cacel函数, 传入错误信息message
       内部会让cancelPromise变为成功, 且成功的值为一个Cancel对象
       在cancelPromise的成功回调中中断请求, 并让发请求的proimse失败, 失败的reason为Cacel对象
```



![](http://vipkshttp1.wiz.cn/ks/share/resources/49c30824-dcdf-4bd0-af2a-708f490b44a1/584701e2-1d9b-4523-b9b2-0f33e838dd7f/index_files/b0f95169782409e7576bc9704b93b693.png)









## 项目中Axios的二次封装



- 针对整个项目做一个单独的axios二次封装基础包
- 针对不同的接口需要不同格式的传参方式进行扩展
- 取消重复的请求
- 资源加载loading展示
- http状态码错误诊断





最基础的axios封装：

axios.js:

````js
import axios from 'axios';

function IAxios(axiosConfig) {
  const service = axios.create({
    baseURL: 'http://localhost:8888', // 设置统一的请求前缀
    timeout: 10000, // 设置统一的超时时长
  });

  return service(axiosConfig)   // Promise对象
}

export default IAxios;
````





使用：

```js
import IAxios from './axios.js'

export function requestTestApi(){
    retunr IAxios({
        url:'/api/xxx',    // 请求是绝对路径，也可以直接填入url参数中，baseUrl 参数不并会再加上个前缀
        method:'get'
    })
}
```





请求参数的格式：

- Content-Type: application/json （Axios默认，直接将json格式的数据作为请求的data属性的值即可）
- Content-Type: application/x-www-form-urlencoded
- Content-Type: multipart/form-data



Content-Type: application/json:

```js
import IAxios from './axios';

export function login(paramsList) {
  return IAxios({
    url: '/api/login',
    method: 'post',
    data: paramsList
  });
}
```



Content-Type: application/x-www-form-urlencoded: (参数数据序列化处理)

```js
// user.js
import IAxios from './axios';

export function loginAPI(paramsList) {
  return IAxios({
    url: '/api/login',
    method: 'post',
    data: paramsList,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [   // 允许在向服务器发送前，修改请求数据，但只能用在 'PUT'，'POST' 和 'PATCH' 请求方法且后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
      (data) => {
        let result = ''
        for (let key in data) {
          result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
        }
        return result.slice(0, result.length - 1)
      }
    ],
  });
}

// transformResponse 能在传递给 then/catch 前，允许修改响应数据
```



npm install qs

```js
import qs from 'qs';
export function loginAPI(paramsList) {
  return myAxios({
    url: '/api/login',
    method: 'post',
    data: paramsList,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      (data) => {
        return qs.stringify(data)
      }
    ],
  });
}
```







### 取消重复请求

取消重复请求操作，其实取消后的请求还是有可能会到达了后端，只是前端浏览器不处理。

面对的场景：

- 快速连续点击一个按钮，如果这个按钮未进行控制，就会发出重复请求；一般前端会对这个按钮进行状态处理控制，后端也会有一些幂等控制处理策略
- 对于列表数据，可能有tab状态栏的频繁切换查询，如果请求响应很慢，也会产生重复请求。当然现在很多列表都会做缓存，如Vue中用 `<keep-alive />`。

```js
var CancelToken = axios.CancelToken;
var cancel;

axios({
  url:'/user/12345',
  method:'get',
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// 取消请求
cancel();  // 找个地方存起来
```



思路:

- 收集正在**请求中**的**接口**，也就是接口状态还是pending状态的，让他们形成队列储存起来。
- 如果相同接口再次被触发，则直接取消正在请求中的接口并从队列中删除，再重新发起请求并储存进队列中；
- 如果接口返回结果，就从队列中删除，以此过程来操作。



收集请求中的接口并判断哪些请求是重复请求：

只要是**请求地址、请求方式、请求参数**一样，那么我们就能认为是一样的。而我们要存储的队列里面的数据结构很明显应该是以键值对的形式来存储，这里面我们选择 `Map` 对象来操作。























































