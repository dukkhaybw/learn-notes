# Web API

## 第 12 章：BOM(浏览器对象模型)

### window 对象

。window 对象在浏览器中一是 ECMAScript 中的 Global 对象，二是浏览器窗口的 JavaScript 接口。网页中定义的所有 对象、变量和函数都以 window 作为其 Global 对象，都可以访问其上定义的 parseInt()等全局方法。

var 声明的所有全局变量和函 数都会变成 window 对象的属性和方法。

使用 let 或 const 替代 var，则不会把变量添加给全局对象。

#### 窗口对象的属性

窗口关系属性：

- top：指向最上层窗口（浏览器窗口本身）
- parent：指向当前窗口的父窗口（如<iframe>内联框架的父级窗口）
- self：指 window 对象本身

窗口位置属性：

- screenLeft：表示**窗口**相对于**屏幕左侧**的距离（css 像素）
- screenTop：表示**窗口**相对于**屏幕顶部**的距离（css 像素）

窗口大小属性：

- innerWidth 与 innerHeight ：返回浏览器窗口中**页面视口**的大小（不包含浏览器边框和工具栏）。

  其他返回页面视口大小的属性：

  - document.documentElement.clientWidth 和 document.documentElement.clientHeight 返回页面视口的宽度和高度。

  - document.body.clientWidth 和 document.body.clientHeight 返回页面视口的宽度和高度。

    ```javascript
    确定页面视口的大小的兼容性写法：
    let pageWidth = window.innerWidth,
      pageHeight = window.innerHeight;
    if (typeof pageWidth != "number") {
      if (document.compatMode == "CSS1Compat"){  //检查页面是否处于标准模式
      pageWidth = document.documentElement.clientWidth;
      pageHeight = document.documentElement.clientHeight;
      } else {
      pageWidth = document.body.clientWidth;
      pageHeight = document.body.clientHeight;
      }
    }
    ```

- outerWidth 与 outerHeight ：返回浏 览器窗口自身的大小（不管是在最外层 window 上使用，还是在窗格中使用）。

滑动视口后页面相对于视口的滚动距离的属性：

- window.pageXoffset/window. scrollX ：返回视口相对于文档左侧滚动了多少像素的距离。
- window.pageYoffset/window.scrollY ：返回视口相对于文档顶部滚动了多少像素的距离。

移动视口的方法：

- window.scroll(x，y) ：视口移动到距离文档左上角（0，0）点多少像素。

- window.scrollTo(x，y)：视口滚动到页面上的（x，y）

- window.scrollBy(x，y)：相对于当前视口滚动 （x，y）像素

  上述三个方法可以接收一个对象作为参数：

  如：// 正常滚动 window.scrollTo({ left: 100, top: 100, behavior: 'auto' });

   // 平滑滚动 window.scrollTo({ left: 100, top: 100, behavior: 'smooth' });

#### 窗口对象的方法：

- moveTo (x，y )：要移动到的新位置的绝对坐标 x 和 y

- moveBy (x，y )：相对当前位置在两个方向上移动的像素数

  依浏览器而定，以上两个方法可能会被部分或全部禁用

- resizeTo()和 resizeBy()方法调整窗口大小。这两个方法都接收两个参数，resizeTo() 接收新的宽度和高度值，而 resizeBy()接收宽度和高度各要缩放多少。

  依浏览器而定，以上两个方法可能会被部分或全部禁用

#### 导航与打开新窗口

- window.open（）

  作用：用于导航到指定 URL，也可以用于打开新浏览器窗口。

  参数： 4 个参数，要加载的 URL、目标窗口名字或者内联框架的名字、特性字符串、表示新窗口在浏览器历史记录中是否替代当前加载页 面的布尔值（只有在不打开新窗口时才会使用）。如果 window.open()的第二个参数是一个已经存在的窗口或窗格（frame）的名字，则会在对应的 窗口或窗格中打开 URL。第二个参数也可以是一个特殊的窗口名，比如\_self、 \_parent、\_top 或\_blank。

   // 与相同 window.open("`http://www.wrox.com/`", "topFrame");

   window.open("`http://www.wrox.com/`", "topFrame");

  返回值：返回一个对新建窗口的引用。

- 保存新窗口引用的变量名.close()

  作用：关闭新打开的窗口。

  注意点：只能用于 window.open()创建的弹出窗口。

- 保存新窗口引用的变量名.opener : 新创建窗口的 window 对象有一个属性 opener，指向打开它的窗口。虽然新建窗口中有指向打开它的窗口的指针，但反之则不然。窗口不会跟踪记录自己打开的新窗口， 因此开发者需要自己记录。

  在某些浏览器中，每个标签页会运行在独立的进程中。如果一个标签页打开了另一个，而 window 对象需要跟另一个标签页通信，那么标签便不能运行在独立的进程中。在这些浏览器中，可以将新打开 的标签页的 opener 属性设置为 null，表示新打开的标签页可以运行在独立的进程中。

#### scope.clearTimeout(timeoutID)的注意点：（防抖函数中踩坑）

```javascript
let timer = setTimeout(() => {
  console.log('asd');
}, 1000);
clearTimeout(timer);
console.log(timer); //输出的timer值并不为null，或者undefined，而是某个数字。
```

 JavaScript 是单线程的，所以每次 只能执行一段代码。为了调度不同代码的执行，JavaScript 维护了一个任务队列。其中的任务会按照添 加到队列的先后顺序执行。setTimeout()的第二个参数只是告诉 JavaScript 引擎在指定的毫秒数过后 把任务添加到这个队列。如果队列是空的，则会立即执行该代码。如果队列不是空的，则代码必须等待 前面的任务执行完才能执行。

 注意定时函数本身的 this 指向，this 值在非严格模式下始终指向 window，而在严格模式下是 undefined。传给定时器函数的回调函数的 this 一般也指向 window。如果 给 setTimeout()提供了一个箭头函数，那么 this 会保留为定义它时所在的词汇作用域。

#### 物理像素比

物理像素与 CSS 像素之间的转换比率： window.devicePixelRatio

#### 系统对话框

- alert（）：alert()只接收一个要显示给用户的字符串参数；如果传给 alert()的参数 不是一个原始字符串，则会调用这个值的 toString()方法将其转换为字符串。

- confirm() ：确认框，用户单击了 OK 按钮还是 Cancel 按钮，可以判断 confirm()方法的返回值：true 表示单击 了 OK 按钮，false 表示单击了 Cancel 按钮或者通过单击某一角上的 X 图标关闭了确认框。

- prompt() ：提示框的用途是提示用户输入消息。 除了 OK 和 Cancel 按钮，提示框还会显示一个文本框，让用户输入内容。prompt()方法接收两个参数： 要显示给用户的文本，以及文本框的默认值（可以是空字符串）。如果用户单击了 OK 按钮，则 prompt()会返回文本框中的值。如果用户单击了 Cancel 按钮，或者 对话框被关闭，则 prompt()会返回 null。

  这些对话框都是同步的模态对话框，即在它们显示的时候，代码会停止执行， 在它们消失以后，代码才会恢复执行。

### location 对象

提供了当前窗口中加载文档的信息，以及保存着把 URL 解析为离散片段后能够通过属性访问的信息。它既是 window 的属性，也是 document 的属性， window.location 和 document.location 指向同一个对象。

URL：protocol://host[:port]/path/[?query]#fragment

location 对象的属性：

| 属 性               | 说 明                                                         |
| ------------------- | ------------------------------------------------------------- |
| location.hash       | URL 散列值（井号后跟零或多个字符），如果没有则 为空字符串     |
| location.host       | 服务器名及端口号                                              |
| location.href       | 当前加载页面的完整 URL。location 的 toString() 方法返回这个值 |
| location.pathname   | URL 中的路径和（或）文件名                                    |
| location.search     | URL 的查询字符串。这个字符串以问号开头                        |
| location.protocol " | 页面使用的协议。通常是"http:"或"https:"                       |

```javascript
let getQueryStringArgs = function () {
  // 取得没有开头问号的查询字符串
  let qs = location.search.length > 0 ? location.search.substring(1) : '',
    // 保存数据的对象
    args = {};
  // 把每个参数添加到 args 对象
  for (let item of qs.split('&').map((kv) => kv.split('='))) {
    let name = decodeURIComponent(item[0]),
      value = decodeURIComponent(item[1]); //参数名和参数值在使用 decodeURIComponent()解码,因为查询字符串通常是被编码后的格式
    if (name.length) {
      args[name] = value;
    }
  }
  return args;
};
```

#### URLSearchParams

给 URLSearchParams 构造函数传入一个查询字符串，就可以创建一个实例。这个实例上暴露了 get()、 set()和 delete()等方法，可以对查询字符串执行相应操作。

```javascript
let qs = '?q=javascript&num=10';
let searchParams = new URLSearchParams(qs);
alert(searchParams.toString()); // " q=javascript&num=10"
searchParams.has('num'); // true
searchParams.get('num'); // 10
searchParams.set('page', '3');
alert(searchParams.toString()); // " q=javascript&num=10&page=3"
searchParams.delete('q');
alert(searchParams.toString()); // " num=10&page=3"

let qs = '?q=javascript&num=10';
let searchParams = new URLSearchParams(qs);
for (let param of searchParams) {
  console.log(param);
}
// ["q", "javascript"]
// ["num", "10"]
```

#### 基于 loaction 实现页面跳转

 location.assign("URL 地址") ：立即启动导航到新 URL 的操作，同时在浏览器历史记录中增加一条记录。如果给 location.href 或 window.location 设置一个 URL，也会以同一个 URL 值调用 assign()方法。

window.location =‘URL’

location.href = 'URL'

修改 location 对象的属性也会修改当前加载的页面。其中，hash、search、hostname、pathname 和 port 属性被设置为新值之后都会修改当前 URL，除了 hash 之外，只要修改 location 的一个属性，就会导致页面重新加载新 URL。

 loaction.replace():接收一个 URL 参数，但重新加载后不会增加历史记录。

 location.reload()：重新加载当前显示的页面。调用 reload()而不传参 数，页面会以最有效的方式重新加载。如果页面自上次请求以来没有修改过，浏览器可能会 从缓存中加载页面。如果想强制从服务器重新加载，可以像下面这样给 reload()传个 true。

### navigator 对象

客户端标识浏览器的标准，但是与其他 BOM 对象一样，每个浏览器都支持自己的属性。navigator 对象的属性通常用于确定浏览器的类型。

### 插件检查

window.navigator.plugins

### history 对象

表示当前窗口首次使用以来用户的导航历史记录。

history.go(n)：可以在用户历史记录中沿任何方向导航，可以前进也可以后退。这个方法只接收一个参数， 这个参数可以是一个整数，表示前进或后退多少步。

history.back()

history.forward()

history.length

## 第十三章：客户端检测

由于各个浏览器厂商针对相同或者类似的功能，可能使用的是不同的接口，所以为了尽可能的保证产品在不同浏览器中的表现一致。所以常常要进行客户端的检测，以针对不同客户端采用不同的接口以实现相同的功能。

### api 检测（能力检测）

用 js 代码写一套简单逻辑，以判断浏览器是否支持某种接口。这种方式不要求事先知道特定浏览器的信息，只需检测自己关心的能力是否存在即可。

原则：

- 应该先检测最常用的方式，可以避免无谓检测
- 必须检测切实需要的特性，某个属性存在并不代表别的属性也存在。

基本逻辑：

```
if (object.propertyInQuestion) {
 // 使用 object.propertyInQuestion
}
```

### 安全能力检测

检测能力是否存在的同时，验证其是否能够展现出预期的行为。因为某个属性存在，并不一定代表该属性就能实现相应的功能，有可能开发者会手动添加一个同名的属性而导致虽然检测存在，但是不是预期的功能。

### 基于能力检测进行浏览器分析

通过一些列的能力检测分析出浏览器是哪个厂商的哪个版本。因为使用能力检测而非用户代理检测的优点在于，**伪造用户代理字符串很简单**，而伪造能够欺骗能力检 测的浏览器特性却很难。可以根据对浏览器特性的检测并与已知特性对比，确认用户使用的是什么浏览器。这样可以获得比 用户代码嗅探（稍后讨论）更准确的结果。

```
// 检测浏览器是否具有 DOM Level 1 能力
let hasDOM1 = !!(document.getElementById && document.createElement &&
 			  document.getElementsByTagName);
```

### 用户代理检测

通过浏览器的用户代理字符串确定使用的是什么浏览器。用户代理字符串包含在每个 HTTP 请求的头部，在 JavaScript 中可以通过 navigator.userAgent 访问。在服务器端，常见的做法 是根据接收到的用户代理字符串确定浏览器并执行相应操作。而在客户端，用户代理检测被认为是不可 靠的，只应该在没有其他选项时再考虑。

缺陷：

浏览器通过在用户代理字符串包含 错误或误导性信息来欺骗服务器。

通过解析浏览器返回的用户代理字符串，可以极其准确地推断出下列相关的环境信息：

 浏览器

 浏览器版本

 浏览器渲染引擎

 设备类型（桌面/移动）

 设备生产商

 设备型号

 操作系统

 操作系统版本

### 软件与硬件检测

现代浏览器提供了一组与页面执行环境相关的信息，包括浏览器、操作系统、硬件和周边设备信息。 这些属性可以通过暴露在 window.navigator 上的一组 API 获得。

### 浏览器元数据

navigator.geolocation 属性暴露了 Geolocation API，可以让浏览器脚本感知当前设备的地理位 置。这个 API 只在安全执行环境（通过 HTTPS 获取的脚本）中可用。



## 第十四章：DOM(文档对象模型)

文档对象模型是操作 html 页面的入口。

 DOM 文档对象模型是浏览器对 html 源码在浏览器内部的一种表示形式，JavaScript 可以通过 DOM 对 HTML 任何部分进行操作。HTML 首先经过 Tokeniser**标记化**，通过**词法分析**，将输入 html 内容解析成多个标记，根据识别后的标记进行**DOM 树构造**, 在 DOM 树构造过程中会创建 Document 对象，然后以 Document 为根节点的 DOM 树不断进行修改，向其中添加各种元素。

**DOM 是由多层节点构成的树结构文档**。其中，节点分为很多类型，节点对象上有不同的属性，数据和方法，同时节点对象之间可能存在某种关系。

document 表示文档节点

document.documentElement 表示 html 元素对象

document.body 表示 body 元素对象

document.head：表示 head 元素对象

因为所有的节点类型（在通过 JS 获取后，本质都是 js 对象）都继承了 Node 构造函数的原型，所以 Node 原型对象上的属性和方法都能被所有类型的节点所访问。只是节点类型在继承 Node 构造函数的基础之上还继承了其他类型的构造函数不同而存在差异。

1. nodeType：返回值为数字（1-12）。节点类型
   - 元素节点：数值为 1
   - 属性节点：数值为 2
   - 文本节点：数值为 3

下面着两个属性的值完全取决于节点的类型而定。

1. nodeName：对于元素节点，nodeName 往往是标签名，而 nodeValue 则是 null。
2. nodeValue：对于文本节点而言，nodeNmae 没有意义，而 nodeValue 则是文本内容。

```javascript
let ele = document.getElementById('app');
if (ele.nodeType === 1) {
  //判断节点类型
  console.log('this is a elemrnt node.');
}
```



### 根据节点之间的关系获取其他节点  的属性

子元素，父元素，兄弟元素，祖先元素，后代元素

- node.childNodes：返回值为一个**动态**的该元素的所有子节点（包含元素节点和文本节点）组成的类数组对象，该对象是 NodeList 构造函数的实例。NodeList 是一个类数组对象，用于存储可以按索引号存取的有序节点。NodeList 是**实时的活动对象**，**而不是第一次访问时所获得内容的快照**。
  - 使用中括号或使用 item()方法访问 NodeList 中的元素。 someNode.childNodes[0]， someNode.childNodes.item(1)， someNode.childNodes.length;
  - **把 NodeList 对象转换为数组，** **let arrayOfNodes = Array.prototype.slice.call(someNode.childNodes,0)**                    **let arrayOfNodes = Array.from(someNode.childNodes);**
  - 获取当前元素的所有子节点（包含各种类型的节点）
- ele.children:获取当前元素中所有的元素子节点（ie 低版本中也会将注释看作元素子节点）。--------**面试**

  扩展：

  > `dom.children` 和 `dom.childNodes` 是访问 DOM 节点的子元素的两种不同方式，它们之间有一些关键的区别：
  >
  > 
  >
  > 1. **节点类型**：
  >    - `dom.childNodes` 包括元素节点、文本节点和注释节点等所有类型的子节点。这意味着，除了常规的 HTML 元素外（例如 `<div>`、`<span>`等），它还可以包含文本（包括空白字符）和注释。
  >    - `dom.children` 仅包含元素节点，即那些实际的 HTML 元素。它不包括文本节点或注释节点。
  > 2. **返回类型**：
  >    - `dom.childNodes` 返回一个 `NodeList` 对象，这个对象是一个节点的集合，包括文档中的所有类型的节点。
  >    - `dom.children` 返回一个 `HTMLCollection` 对象，它是一个仅包含元素节点的集合。
  > 3. **实时性**：
  >    - 通过 `childNodes` 获取的 `NodeList` 是实时的，反映了 DOM 的当前状态。
  >    - `HTMLCollection` 对象（例如由 `dom.children` 返回的）总是实时的，反映了 DOM 的当前状态。当 DOM 结构发生改变时，`HTMLCollection` 会自动更新。
  > 4. **使用场景**：
  >    - 当需要处理元素的所有子节点（包括文本和注释节点）时，应使用 `dom.childNodes`。
  >    - 当仅需处理元素的子元素节点（忽略文本和注释节点）时，`dom.children` 更加适合。
  >
  > 
  >
  > 总结来说，根据你的具体需求选择使用 `dom.children` 或 `dom.childNodes`。如果你需要处理所有类型的子节点，包括文本和注释，`dom.childNodes` 是一个好的选择。如果你只关心子元素本身，而不关心它们之间的文本或注释，那么 `dom.children` 会更为合适。

  

- ele.parentNode：返回某节点的父节点。
- ele.previousSibling：返回某节点的前一个兄弟节点或者 null。
- ele.previousElementSibling：返回某节点的前一个兄弟元素节点或者 null（不兼容 ie 低版本浏览器）。
- ele.nextSibling：返回某节点的下一个兄弟节点或者 null。
- ele.nextElementSibling：返回某节点的下一个兄弟元素节点或者 null（不兼容 ie 低版本浏览器）。

- parent.firstChild：返回父节点中的第一个子节点 或者 null，等价于：someNode. childNodes[0]。

- parent.firstElementChild：返回父节点中的第一个元素子节点 或者 null。（不兼容 ie 低版本浏览器）。

- parent.lastChild：返回父节点中的最后一个子节点或者 null，等价于：someNode.childNodes[someNode. childNodes.length-1]。

- parent.lastElemrntChild：返回父节点中的最后一个元素子节点或者 null。（不兼容 ie 低版本浏览器）。

- **hasChildNodes()：这个方法如果返回 true 则说明节点有一个或多个子节点。**

- ownerDocument：所有节点都有的属性。指向代表整个文档的文档节点 （即：document）。

上面这些属性执行的dom元素都只是只读的不能用于修改。



### 节点操作（增删改查和移动节点）

- document.createElement ( '标签名' ) ：创建一个 dom 元素。

- document.createTextNode ( )：创建一个文本节点。

- parent.appendChild( node ) : 用于在 childNodes 列表末尾添加节点。appendChild()方法返回新添加的节点。**如果把文档中已经存在的节点传给 appendChild()，则这个节点会从之前的位置被转移到新位置。**

- parent.insertBefore( dom 元素，指定元素)：参数：要插入的节点和参照节点。调用这个方法后，要插入的节点会变成参照节点的 前一个同胞节点，并被返回。未指定插入节点则与 appendChild 等价。

- parent.replaceChild()：接收两个参数：要插入的节点和要替换的节点。要替换的节点会被返回并从文档 树中完全移除，要插入的节点会取而代之。

- parent.removeChild()：接收一个参数，即要移除 的节点。被移除的节点会被返回。

  **上面介绍的 4 个方法都用于操纵某个节点的子元素，也就是说使用它们之前必须先取得父节点**（使用前必须获取到 parentNode）。

  

- cloneNode()：返回与调用它的节点一模一样的节 点。cloneNode()方法接收一个布尔值参数，表示是否深复制。在传入 true 参数时，会进行深复制， 即复制节点及其整个子 DOM 树。如果传入 false，则只会复制调用该方法的节点。复制返回的节点属 于文档所有，但尚未指定父节点，所以可称为**孤儿节点**（orphan）。可以通过 appendChild()、 insertBefore()或 replaceChild()方法把孤儿节点添加到文档中。**该方法不会复制添加到 DOM 节点上的 js 属性，比如事件处理程序，这个方法只复制 HTML 属性，以及可选性地复制子节点。**

- normalize()：处理文档子树中的文本节 点。在节点上调用 normalize()方法会检测这个节点的所有后代，如果发现空文本节点，则将其删除；如果两个同胞节点是相邻的，则将其合并为一个文本节点。



### 节点类型

#### **Document 类型**

指代整个文档。文档对象 document 是 HTMLDocument 的实例（HTMLDocument 继承 Document），表示整个 HTML 页面。document 是 window 对象的属性，因此是一个全局对象。

document 对象

- nodeType : 9

- nodeName : '#document'

- nodeValue : null

- parentNode : null

- ownerDocument : null

- childNodes: 可能是 DocumentType(文档类型标签)、documentElement(html 标签)、comment(注释)
  - document.documentElement ：指向html
  - document.doctype
  - document.body：指向body

document.title ：读写页面的标题

document.URL： 当前页面的完整 URL

document.domain：页面的域名,可以用于实现跨域传递数据。

**面试跨域问题：**

domain 属性是可以设置的。出于安全考虑，给 domain 属性设置的值是有限制的。如果 URL 包含子域名如 p2p.wrox.com，则可以将 domain 设置为"wrox.com"（URL 包含“www” 时也一样，比如` www.wrox.com`）。不能给这个属性设置 URL 中不包含的值，比如：

 // 页面来自 p2p.wrox.com

 document.domain = "wrox.com"; // 成功

 document.domain = "nczonline.net"; // 出错！

**当页面中包含来自某个不同子域的窗格（frame）或内嵌窗格（iframe）时，设置 document.domain 是有用的。**因为跨源通信存在安全隐患，所以不同子域的页面间无法通过 JavaScript 通信。此时，在每个页面上把 document.domain 设置为相同的值，这些页面就可以访问对方的 JavaScript 对象了。比如，一个加载自 www.wrox.com 的页面中包含一个内嵌窗格，其中的页面加载自 p2p.wrox.com。这两个页面的 document.domain 包含不同的字符串，内部和外部页面相互之间不能访问对方的 JavaScript 对象。如果每个页面都把 document.domain 设置为 wrox.com，那这两个页面之间就可以通信了。

浏览器对 domain 属性还有一个限制，即这个属性一旦放松就不能再收紧。比如，把 document.domain 设置为"wrox.com"之后，就不能再将其设置回"p2p.wrox.com"，后者会导致错误，比如： // 页面来自 p2p.wrox.com document.domain = "wrox.com"; // 放松，成功 document.domain = "p2p.wrox.com"; // 收紧，错误！

documen.referrer：链接到当前页面的那个页面的 URL，如果当前页面没有来源，则 referrer 属性包含空字符串。

document.write() :单纯写入

document.writeIn()：写入后结尾追加一个换行符

在页面渲染期间通过 document.write()向文档中输出内容。如果是在页面加载完之后再调用 document.write()，则输出的内容会重写整个页面。

document.open() 与 document.close()



### Element 对象

元素节点都是 HTMLElement 构造函数的实例，而 HTMLElement 则继承了 Element 构造函数。

nodeType 等于 1；

nodeName、tagName 值为元素的标签名；

nodeValue 值为 null；

parentNode 值为 Document 或 Element 对象；

子节点可以是 Element、Text、Comment、ProcessingInstruction、CDATASection、 EntityReference 类型。

以下的属性可读可写：

- element.id
- element.title
- element.className
- element.classList：
  - add('calssName')
  - remove('calssName')



### Text 对象

nodeType：3

nodeName："#text"

nodeValue：节点中包含的文本 ，值等价于 data 属性

parentNode：Element 对象

不支持子节点

取得文本节点的引用后，可以像这样来修改它： div.firstChild.nodeValue = "Some other message";

方法：

- appendData(text)
- deleteData(offset,count)
- insertData(offset,count)
- replaceData(offset,count,text)
- spliteText(offset)
- substringData(offset,count)

document.createTextNode( )

### DocumentFragment 类型（面试可以问的批量处理多个节点的优化）

在所有节点类型中，DocumentFragment 类型是唯一一个在标签中没有对应表示的类型。能够包含和操作节点，却没有完整文档那样额外的消耗。

作用：不能直接把文档片段添加到文档。相反，文档片段的作用是充当其他要被添加到文档的节点的仓库。

创建文档片段：

let fragment = document.createDocumentFragment();

文档片段从 Node 类型继承了所有文档类型具备的可以执行 DOM 操作的方法。如果文档中的一个 节点被添加到一个文档片段，则该节点会从文档树中移除，不会再被浏览器渲染。添加到文档片段的新 节点同样不属于文档树，不会被浏览器渲染。可以通过 appendChild()或 insertBefore()方法将文 档片段的内容添加到文档。在把文档片段作为参数传给这些方法时，这个文档片段的所有子节点会被添 加到文档中相应的位置。文档片段本身永远不会被添加到文档树。

例子：

```
<ul id="myList"></ul>
```

假设想给这个`<ul>`元素添加 3 个列表项。如果分 3 次给这个元素添加列表项，浏览器就要重新渲染 3 次页面，以反映新添加的内容。为避免多次渲染，下面的代码示例使用文档片段创建了所有列表项， 然后一次性将它们添加到了`<ul>`元素：

```
let fragment = document.createDocumentFragment();
let ul = document.getElementById("myList");
for (let i = 0; i < 3; ++i) {
 let li = document.createElement("li");
 li.appendChild(document.createTextNode(`Item ${i + 1}`));
 fragment.appendChild(li);
}
ul.appendChild(fragment);
```



### 获取节点的 api

- **document**.getElementById ( ) , getElementById（）方法的**上下文只能是 document**，这是因为 document 是 HTMLDocument 的实例（HTMLDocument 继承 Document），而 getElementById 则是 Document 原型对象上方法。返回一个匹配特定 ID 的元素，如果当前文档中拥有特定 ID 的元素不存在则返回 null。

  > 这个方法是全局 `document` 对象**特有**的，因为 ID 在整个文档中应该是唯一的。没有理由在子元素上提供相同的方法，因为 ID 的唯一性意味着你无法在文档的不同部分找到多个具有相同 ID 的元素。

- **someNode**.getElementsByTagName ([’标签名‘]) ：在指定的上下文中，基于元素的标签名动态获取一组元素的集合（HTMLCollection 元素集合，类数组对象，每项元素都是一个 dom 元素对象），这个集合对象上还有一个方法 namedItem，调用它并传入一个字符串，可以获取其中 name 标签属性为参数字符串的元素。

  HTMLCollection 对象还有一个额外的方法 namedItem()，可通过标签的 name 属性取得某一项 的引用。例如，假设页面中包含`<img src="myimage.gif" name="myImage"> `元素： img 那么也可以像这样从 images 中取得对这个 img 元素的引用： let myImage = images.namedItem("myImage"); 对于 name 属性的元素，还可以直接使用中括号来获取，如下面的例子所示： let myImage = images["myImage"];

  要取得文档中的所有元素，可以给 getElementsByTagName()传入\*。

  ```js
  // 在整个文档中搜索所有的 <div> 元素
  var divs = document.getElementsByTagName('div');
  
  // 在某个特定元素内部搜索所有的 <span> 元素
  var spans = someElement.getElementsByTagName('span');
  ```

  

- context.getElementsByClassName ([‘类名’]) ：在指定的上下文中，基于元素的类名获取一组元素的集合（不兼容 ie6 到 8，HTMLCollection 元素集合，类数组对象，每项元素都是一个 dom 元素对象）

- document.getElementByName ( 'name' ) :根据元素 name 属性值，在整个文档中获取一组元素集合（NodeList 元素集合，类数组对象，每项元素都是一个 dom 元素对象），在 ie 低版本浏览器中只能获取表单元素。

- context.querySlector('css 选择器') 不兼容 ie6 到 8

- context.querySlectorAll('css 选择器') 不兼容 ie6 到 8



### 设置 dom 元素样式

- element.style.xxx :获取当前元素的行内样式（无法获取 css 中的样式）
- element.style.xxx = xxxxxx ： 设置当前元素的行内样式 （无法获取 css 中的样式）
- element.style.cssText =''` key :value;key:value`'':批量设置元素的行内样式
- element.className ：获取或者设置当前元素的样式类名
- element.className = ‘xxxx’ ： 会覆盖元素之前的类
- element.className += ‘ xxxx’ ：会在元素之前的类的基础上，拼接新的类名
- element.classList.add( ' xxxx') :向元素的样式集合中新增一个类名（兼容性略差）

###### Window.getComputedStyle( ) IE 不支持

返回一个对象，包含元素的所有 CSS 属性的值。只读属性。

```
let style = window.getComputedStyle(element, [pseudoElt]);
等价于  document.defaultView.getComputedStyle(elem1, [pseudoElt]);
element：DOM元素，用于获取计算样式。
pseudoElt：指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
```

###### let cssObj = element.currentStyle （IE 中）

返回一个对象，包含元素的所有 CSS 属性的值。只读属性。

###### 操作元素属性/自定义属性

- dom 元素对象.xxx=xxx :这种方式操作的是堆内存，dom 树结构中不可见

元素（标签）有原生的属性，当使用 JavaScript 获取到该元素后则对应的是该元素的 JS 对象。元素拥有的原生属性会在元素的 JS 对象中有特定的属性来表示，往往和元素的原生标签属性同名（但 class 对应的是 className）。但是对于开发者自定义的非 data-开头的标签属性则不会在标签对应的 JS 对象中有对应的属性名与之对应。

以下三个方法可以用于操作自定义属性也可以用于操作原生属性。

- ele.setAttribute(key ,value) ：这种方式操作的是 dom 结构，在 dom 树中可见。
- ele.getAttribute(key)：也可以用于获取开发者自定义的标签属性。
- ele.removeAttribute(key)

元素的所有属性也可以通过相应 DOM 元素对象的属性来取得。可以获取标签默认属性，但是无法获取到自定义属性。

###### 自定义标签属性的默认规则（html5 新增）

命名以 data-名 方式。获取这类属性可以通过，element.dataset.名 或者 element.dataset ['名']

通过 DOM 对象访问的属性中有两个返回的值跟使用 getAttribute()取得的值不一样。首先是 style 属性，这个属性用于为元素设定 CSS 样式。在使用 getAttribute()访问 style 属性时，返回的 是 CSS 字符串。而在通过 DOM 对象的属性访问时，style 属性返回的是一个（CSSStyleDeclaration） 对象。DOM 对象的 style 属性用于以编程方式读写元素样式，因此不会直接映射为元素中 style 属 性的字符串值。

第二个属性其实是一类，即事件处理程序（或者事件属性），比如 onclick。在元素上使用事件属 性时（比如 onclick），属性的值是一段 JavaScript 代码。如果使用 getAttribute()访问事件属性， 则返回的是字符串形式的源代码。而通过 DOM 对象的属性访问事件属性时返回的则是一个 JavaScript 函数（未指定该属性则返回 null）。这是因为 onclick 及其他事件属性是可以接受函数作为值的。

**因为元素属性也是 DOM 对象属性，所以直接给 DOM 对象的 HTMLElement 属性赋值也可以设置元素属性的值。**

在 DOM 对象上添加自定义属性，如下面的例子所示，不会自动让它变成元素的属性：

```
div.mycolor = "red";
alert(div.getAttribute("mycolor")); // null（IE 除外）
```

#### 例子

用 js 获取的 div 元素对象的原型链`__proto__`往上指向 HTMLDivElement.prototype，继续往上指向 HTMLElement.prototype,继续往上指向 Element.prototype，继续往上指向 Node.prototype,再往上指向 EventTarget.prototype，再往上指向 Object.prototype

element.clientWidth

element.clientHeight

element.offsetWidth

element.offsetHeight

### DOM 编程

动态创建脚本：

```js
方式一：
function loadScript(url) {
  let script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}


方式二：
let script = document.createElement("script");
script.appendChild(document.createTextNode("function sayHi(){alert('hi');}"));
document.body.appendChild(script);

方式三(IE)：
var script = document.createElement("script");
script.text = "function sayHi(){alert('hi');}";
document.body.appendChild(script);


方式四：兼容
function loadScriptString(code){
  var script = document.createElement("script");
  script.type = "text/javascript";
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex){
    script.text = code;
  }
  document.body.appendChild(script);
}
```

**通过 innerHTML 属性创建的`<script>`元素永远不会执行。**浏览器会尽责地创建`<script>`元素，以及其中的脚本文本，但解析器会给这个`<script>` 元素打上永不执行的标签。只要是使用 innerHTML 创建的 `<script>`元素，以后也没有办法强制其执行。



### 动态样式

```js
方式一：
function loadStyles(url){
 let link = document.createElement("link");
 link.rel = "stylesheet";
 link.type = "text/css";
 link.href = url;
 let head = document.getElementsByTagName("head")[0];
 head.appendChild(link);
}

方式二：
let style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode("body{background-color:red}"));
let head = document.getElementsByTagName("head")[0];
head.appendChild(style);

方式三：
let style = document.createElement("style");
style.type = "text/css";
try{
 style.appendChild(document.createTextNode("body{background-color:red}"));
} catch (ex){
 style.styleSheet.cssText = "body{background-color:red}";
}
let head = document.getElementsByTagName("head")[0];
head.appendChild(style);

方式四：通用
function loadStyleString(css){
 let style = document.createElement("style");
 style.type = "text/css";
 try{
 style.appendChild(document.createTextNode(css));
 } catch (ex){
 style.styleSheet.cssText = css;
 }
 let head = document.getElementsByTagName("head")[0];
 head.appendChild(style);
}
```

注意应该把元素添加到元素而不是 元素，这样才能保证所有浏览器都能正常运行。



#### MutationObserver 接口

MutationObserver 接口，可以在 DOM 被修改时异步执行回调（微任务）。**使 用 MutationObserver 可以观察整个文档、DOM 树的一部分，或某个元素。此外还可以观察元素属性、子节点、文本，或者前三者任意组合的变化。**

取代：MutationEvent

基本用法：

MutationObserver 本身是构造函数，它接受一个回调函数作为参数。

```
let observer = new MutationObserver((mutationRecords,mutationObserver) => console.log(mutationRecords,mutationObserver));

mutationRecords：数组，数组中包含的信息有发生的变化，哪一部分受到了影响。因为回调执行之前可能同时发生多个满足观察条件的事件，所以每次执行回调都会传入一个包含按顺序入队的 MutationRecord 实例的数组。

MutationObserver：是上面的observer实例对象
```

observer 实例默认并不会关联任何 DOM 部分。要把这个实例和某个 DOM 部分关联起来，需要使用实例对象上的 observe（）方法，这个方法接收两个必需的参数：要观察其变化的 DOM 节点，以及一个 MutationObserverInit 对象。MutationObserverInit **对象用于控制观察哪些方面的变化**，是一个键/值对形式配置选项。

**MutationObserverInit**:控制观察范围，该配置对象的具体取值和含义：

![image-20210810235508390](..\typora-user-images\image-20210810235508390.png)

![image-20210810235524355](..\typora-user-images\image-20210810235524355.png)

```
observer.observe(document.body, { attributes: true });
```

执行以上代码后，元素上任何属性发生变化都会被这个 MutationObserver 实例发现，然 后就会异步执行注册的回调函数。元素后代的修改或其他非属性修改都不会触发回调进入任务队列。

**mutationRecords 相关的例子**

```
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords));
observer.observe(document.body, { attributes: true });
document.body.setAttribute('foo', 'bar');

// [
// {
// addedNodes: NodeList [],  对于"childList"类型的变化，返回包含变化中添加节点的 NodeList默认为空 NodeList
// attributeName: "foo",
// attributeNamespace: null,
// nextSibling: null,
// oldValue: null,
// previousSibling: null
// removedNodes: NodeList [],   对于"childList"类型的变化，返回包含变化中删除节点的 NodeList默认为空 NodeList
// target: body      被修改影响的目标节点
// type: "attributes"
// }
// ]


连续修改会生成多个 MutationRecord 实例，下次回调执行时就会收到包含所有这些实例的数组，顺序为变化事件发生的顺序：
let observer = new MutationObserver(
 (mutationRecords) => console.log(mutationRecords));
observer.observe(document.body, { attributes: true });
document.body.className = 'foo';
document.body.className = 'bar';
document.body.className = 'baz';
// [MutationRecord, MutationRecord, MutationRecord]
```

每次 MutationRecord 被添加到 MutationObserver 的记录队列时，仅当之前没有已排期的微任 务回调时（队列中微任务长度为 0），才会将观察者注册的回调（在初始化 MutationObserver 时传入） 作为微任务调度到任务队列上。这样可以保证记录队列的内容不会被回调处理两次。

**性能、内存与垃圾回收**

MutationObserver 的引用

MutationObserver 实例与目标节点之间的引用关系是非对称的。MutationObserver 拥有对要 观察的目标节点的弱引用。因为是弱引用，所以不会妨碍垃圾回收程序回收目标节点。然而，目标节点却拥有对 MutationObserver 的强引用。如果目标节点从 DOM 中被移除，随后 被垃圾回收，则关联的 MutationObserver 也会被垃圾回收。

MutationRecord 的引用 、

记录队列中的每个 MutationRecord 实例至少包含对已有 DOM 节点的一个引用。如果变化是 childList 类型，则会包含多个节点的引用。记录队列和回调处理的默认行为是耗尽这个队列，处理 每个 MutationRecord，然后让它们超出作用域并被垃圾回收。 有时候可能需要保存某个观察者的完整变化记录。保存这些 MutationRecord 实例，也就会保存 它们引用的节点，因而会妨碍这些节点被回收。如果需要尽快地释放内存，建议从每个 MutationRecord 中抽取出最有用的信息，然后保存到一个新对象中，最后抛弃 MutationRecord。



## 第 15 章 DOM 扩展

DOM 选择器：

- querySelector ( ): querySelector()方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配 项则返回 null。 在 Document 上使用 querySelector()方法时，会从文档元素开始搜索；在 Element 上使用 querySelector()方法时，则只会从当前元素的后代中查询。

- querySelectorAll ( ) : 接收一个用于查询的 CSS 选择符参数，返回所有匹配的节点，而不止一个。这个方法返回的是一个 NodeList 的**静态实例**。**它是一 个静态的“快照”，而非“实时”的查询。**这样的底层实现避免了使用 NodeList 对象可能造成的性 能问题。

  与 querySelector()一样，querySelectorAll()也可以在 Document、DocumentFragment 和 Element 类型上使用。

- getElementsByClassName ( ): 接收一个参数，即包含一个或多个类名的字符串，返回类名中 包含相应类的元素的 NodeList。如果提供了多个类名，则顺序无关紧要。这个方法只会返回以调用它的对象为根元素的子树中所有匹配的元素。

- matches ( ) : 接收一个 CSS 选择符参数，如果元素 匹配则该选择符返回 true，否则返回 false。使用这个方法可以方便地检测某个元素会不会被 querySelector()或 querySelectorAll()方 法返回。

- find ( )

- findAll ( )

DOM 新属性：

- childElementCount：返回子元素数量（不包含文本节点和注释）
- firstElementChild：指向第一个 Element 类型的子元素（Element 版 firstChild）
- lastElementChild：指向最后一个 Element 类型的子元素
- previousElementSibling：指向前一个 Element 类型的同胞元素
- nextElementSibling：指向后一个 Element 类型的同胞元素

要操作类名，可以通过 className 属性实现添加、删除和替换。但 className 是一个字符串， 所以每次操作之后都需要重新设置这个值才能生效，即使只改动了部分字符串也一样。

例子：

```
<div class="bd user disabled">...</div>

// 要删除"user"类
let targetClass = "user";
// 把类名拆成数组
let classNames = div.className.split(/\s+/);
// 找到要删除类名的索引
let idx = classNames.indexOf(targetClass);
// 如果有则删除
if (idx > -1) {
 classNames.splice(i,1);
}
// 重新设置类名
div.className = classNames.join(" ");
```

#### classList 属性

classList 有 length 属性表示自己包含多少项，也可以通过 item()或中括号取得个别的元素。

方法：

- add(value)，向类名列表中添加指定的字符串值 value。如果这个值已经存在，则什么也不做。
- contains(value)，返回布尔值，表示给定的 value 是否存在。
- remove(value)，从类名列表中删除指定的字符串值 value。
- toggle(value)，如果类名列表中已经存在指定的 value，则删除；如果不存在，则添加。

#### 焦点管理

document.activeElement：指代当前拥 有焦点的 DOM 元素。不必非得是表单元素才能聚焦。默认情况下，document.activeElement 在页面刚加载完之后会设置为 document.body。而在 页面完全加载之前，document.activeElement 的值为 null。

document.hasFocus()：返回布尔值，表示文档是否拥有焦点

#### 页面加载状态属性

- document.readyState：该属性可能有两种值中的一个，以判断文档是否加载完毕。

  - loading，表示文档正在加载
  - complete，表示文档加载完成

  注意：之前判断页面加载完成的方式是 document.onload 事件。

  ```
  if (document.readyState == "complete"){
   // 执行操作
  }
  ```

#### 页面渲染模式属性

IE6 提供了以标准或混杂模式渲染页面的能力之后，检测页面渲染模式成为一个必要的需求。

- document.compatMode：这个属性唯一的任务是指示浏览器当前处于什么渲染模式。

标准模式下 document.compatMode 的值是"CSS1Compat"，而在混杂模式下， document.compatMode 的值是"BackCompat"。

#### 自定义属性

自定义标签属性建议以 data-开头，以便告诉浏览器，这些属性既不包含 与渲染有关的信息，也不包含元素的语义信息。

```
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>

let div = document.getElementById("myDiv")
// 取得自定义数据属性的值
let appId = div.dataset.appId
let myName = div.dataset.myname
// 设置自定义数据属性的值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";
```

定义了自定义数据属性后，可以通过元素的 dataset 属性来访问。该属性是一个对象，该对象的属性名是 data-字段后面的部分，属性值则对应着标签属性的值。

#### 插入 HTML 属性

- innerHTML：可读可写的属性。在读取 innerHTML 属性时，会返回元素所有后代的 HTML 字符串，包括元素、注释和文本节点。 而在写入 innerHTML 时，则会根据提供的字符串值以新的 DOM 子树替代元素中原来包含的所有节点。

注意：设置 innerHTML 会导致浏览器将 HTML 字符串解析为相应的 DOM 树。这意味着 设置 innerHTML 属性后马上再读出来会得到不同的字符串。这是因为返回的字符串是将 原始字符串对应的 DOM 子树序列化之后的结果。

在所有现代浏览器中，通过 innerHTML 插入的 script 标签是不会执行的。而在 IE8 及之前的版本中，只要这样插入的 script 元素指定了 defer 属性，且 script 之前是“受控元素”（scoped element），那就是可以执行的。

IE 会把 innerHTML 中从非受控元素开始的内容都删掉，也就 是说下面的例子是行不通的：

```
// 行不通
div.innerHTML = "<script defer>console.log('hi');<\/script>";
在这个例子中，innerHTML 字符串以一个非受控元素开始，因此整个字符串都会被清空。为了达
到目的，必须在<script>前面加上一个受控元素，例如文本节点或没有结束标签的元素（如<input>）。


因此，下面的代码就是可行的：
// 以下都可行
div.innerHTML = "_<script defer>console.log('hi');<\/script>"
div.innerHTML = "<div>&nbsp;</div><script defer>console.log('hi');<\/script>"
div.innerHTML = "<input type=\"hidden\"><script defer>console.log('hi');<\/script>"

第一行会在<script>元素前面插入一个文本节点。为了不影响页面排版，可能稍后需要删掉这个文本节点。第二行与之类似，使用了包含空格的<div>元素。空<div>是不行的，必须包含一点内容，以强制创建一个文本节点。同样，这个<div>元素可能也需要事后删除，以免影响页面外观。第三行使用了一个隐藏的<input>字段来达成同样的目的。因为这个字段不影响页面布局，所以应该是最理想的方案。
```

在 IE 中，通过 innerHTML 插入 style 也会有类似的问题。多数浏览器支持使用 innerHTML 插 入 style 元素。

```
div.innerHTML = "<style type=\"text/css\">body {background-color: red; }</style>";
```

但在 IE8 及之前的版本中， style 也被认为是非受控元素，所以必须前置一个受控元素。

```
div.innerHTML = "_<style type=\"text/css\">body {background-color: red; }</style>";
div.removeChild(div.firstChild);
```

**注意：script 元素与 style 或注释一样，都是“非受控元素”（NoScope element），也就是在页面上看不到它们。**

#### outerHTML 属性

读取 outerHTML 属性时，会返回调用它的元素自身（及所有后代元素）的 HTML 字符串。在写入 outerHTML 属性时，调用它的元素包括元素自身会被传入的 HTML 字符串经解释之后生成的 DOM 子树取代。

```
div.outerHTML = "<p>This is a paragraph.</p>";

等价于：

let p = document.createElement("p");
p.appendChild(document.createTextNode("This is a paragraph."));
div.parentNode.replaceChild(p, div);
```

#### 插入标签

- insertAdjacentHTML()
- insertAdjacentText()

它们都接收两个参数：要插入标记的位置和要插入的 HTML 或文本。第一个参数 必须是下列值中的一个：

 "beforebegin"，插入当前元素前面，作为前一个同胞节点；

 "afterbegin"，插入当前元素内部，作为新的子节点或放在第一个子节点前面；

 "beforeend"，插入当前元素内部，作为新的子节点或放在最后一个子节点后面；

 "afterend"，插入当前元素后面，作为下一个同胞节点。

注意这几个值是不区分大小写的。第二个参数会作为 HTML 字符串解析（与 innerHTML 和 outerHTML 相同）或者作为纯文本解析（与 innerText 和 outerText 相同）。

#### 性能管理

用本节介绍的方法替换子节点可能在浏览器（特别是 IE）中导致内存问题。比如，如果被移除的 子树元素中之前有关联的事件处理程序或其他 JavaScript 对象（作为元素的属性），那它们之间的绑定关 系会滞留在内存中。如果这种替换操作频繁发生，页面的内存占用就会持续攀升。在使用 innerHTML、 outerHTML 和 insertAdjacentHTML()之前，最好手动删除要被替换的元素上关联的事件处理程序和 JavaScript 对象。

```
for (let value of values){
 ul.innerHTML += '<li>${value}</li>'; // 别这样做！
}

建议：
let itemsHtml = "";
for (let value of values){
 itemsHtml += '<li>${value}</li>';
}
ul.innerHTML = itemsHtml;
```

#### 页面滚动

滚动页面中的某个区域。

- scrollIntoView() 它存在于所有 HTML 元素上；可以滚动浏览器窗口或容器元素以便包含元

  素进入视口。这个方法的参数如下：

   alignToTop 是一个布尔值。

   true：窗口滚动后元素的顶部与视口顶部对齐。

   false：窗口滚动后元素的底部与视口底部对齐。

   scrollIntoViewOptions 是一个选项对象。

   behavior：定义过渡动画，可取的值为"smooth"和"auto"，默认为"auto"。

   block：定义垂直方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默

  认为 "start"。

   inline：定义水平方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默

  认为 "nearest"。

   不传参数等同于 alignToTop 为 true。

**contains()**方法：确定一个元素是不是另一个元素的后代。contains()方法应该在要搜索的祖先元素上调用，参数是待确定的目标节点。返回值是布尔值。

compareDocumentPosition()方法：也可以确定节点间的关系。这个方法会返回表示两个节点关系的位掩码。下表给出了这些位掩码的说明。

掩 码 节点关系

0x1 断开（传入的节点不在文档中）

0x2 领先（传入的节点在 DOM 树中位于参考节点之前）

0x4 随后（传入的节点在 DOM 树中位于参考节点之后）

0x8 包含（传入的节点是参考节点的祖先）

0x10 被包含（传入的节点是参考节点的后代）

innerText 属性与 outerText 属性

## 第 16 章 DOM2 DOM3

和 CSS 样式相关的 API

#### 行内样式

任何通过行内 style 方式设置 css 样式的标签元素，在通过 js 获取到对应的 DOM 对象后，都会有一个 style 属性，其中包含通过 HTML style 属性为元素设置的所有样式信息，但**不包含通过层叠机制从文档样式和外部样式中继承来的样式**。

```
element.style.xxxYyy
element.style.xxx
element.style.cssFloat
```

任何时候，只要获得了有效 DOM 元素的引用，就可以通过 JavaScript 来设置样式。

```
let myDiv = document.getElementById("myDiv");
// 设置背景颜色
myDiv.style.backgroundColor = "red";
// 修改大小
myDiv.style.width = "100px";
myDiv.style.height = "200px";
// 设置边框
myDiv.style.border = "1px solid black";
```

在通过 style 属性获取值时，如果元素上没有 style 属性，则 style 对象包含所有可能的 CSS 属性的空值。

DOM 标签对象的 style 属性上的其他属性和方法：

- cssText，包含 style 属性中的 CSS 代码 ，可读可写，写是覆盖式的写。

  ```js
  Div.srtyle.cssText = 'width:25px;height:100px;background-color:green';
  ```

- length，应用给元素的 CSS 属性数量

- getPropertyPriority(_propertyName_)，如果 CSS 属性 _propertyName_ 使用了!important 则返回"important"，否则返回空字符串

- getPropertyValue(_propertyName_)，返回属性 _propertyName_ 的字符串值

- item(_index_)，返回索引为 _index_ 的 CSS 属性名

  ```js
  for (let i = 0, len = myDiv.style.length; i < len; i++) {
    console.log(myDiv.style[i]); // 或者用 myDiv.style.item(i)
  }
  ```

- removeProperty(_propertyName_)，从样式中删除 CSS 属性 _propertyName_,删除后的样式属性将采用默认值

- setProperty(_propertyName, value, priority_)，设置 CSS 属性 _propertyName_ 的值为*value*，_priority_ 是"important"或空字符串

通过 element.style.attr 的方式的不足：只能获取到行内样式，获取不了外部样式。

#### 计算样式

DOM2 Style 在 document.defaultView 上增加了 getComputedStyle()方法。这个方法接收两个参数：要取得计算样式的元素和伪元素字符串（如":after"）。如果不需要查询伪元素，则第二个参数可以传 null。

```
<head>
 <title>Computed Styles Example</title>
 <style type="text/css">
 #myDiv {
 background-color: blue;
 width: 100px;
 height: 200px;
 }
 </style>
</head>
<body>
 <div id="myDiv" style="background-color: red; border: 1px solid black"></div>
</body>



let myDiv = document.getElementById("myDiv");
let computedStyle = document.defaultView.getComputedStyle(myDiv, null);
console.log(computedStyle.backgroundColor); // "red"
console.log(computedStyle.width); // "100px"
console.log(computedStyle.height); // "200px"
console.log(computedStyle.border); // "1px solid black"（在某些浏览器中）
```

计算样式的不足之处是：在所有浏览器中计算样式都是只读的，不能修改 getComputedStyle()方法返回的对象，且计算样式 API 返回的对象中还有浏览器默认的属性对应的属性值。

补充：

如果要想获取元素的外部样式，可以选用 currentStyle 属性和 getComputedStyle 属性，但这两个属性不能设置样式,只能获取样式，而且这两个属性有其兼容性，具体来说：

currentStyle 属性用法：ele.currentStyle["attr"]或 ele.currentStyle.attr；特点：该属性只兼容 IE,不兼容火狐和谷歌

getComputedStyle 属性用法：window.getComputedStyle(ele,null)[attr] 或 window.getComputedStyle(ele,null).attr （两个参数，元素和伪类。第二个参数不是必须的，当不查询伪类元素的时候可以忽略或者传入 null）特点：该属性是兼容火狐谷歌,不兼容 IE8 及以下（IE9 及以上版本可兼容）

document.style Sheets：表示文档中可用的样式表的集合，其中有 length 属性，是一个类数组对象。

#### 元素尺寸系列

##### 偏移尺寸

元素在屏幕上占用的所有视觉空间由其高度和宽度决定，包括所有内边距、滚动条和边框（但不包含外边距）。

- offsetHeight，元素在垂直方向上占用的像素尺寸，包括它的高度、水平滚动条高度（如果可

  见）和上、下边框的高度。

- offsetWidth，元素在水平方向上占用的像素尺寸，包括它的宽度、垂直滚动条宽度（如果可

  见）和左、右边框的宽度。

- offsetLeft，元素左边框外侧距离包含元素左边框内侧的像素数（相对于包含元素）。

- offsetTop，元素上边框外侧距离包含元素上边框内侧的像素数（相对于包含元素）。

- offsetParent，元素的包含元素。包含元素并不一定就是最近的一级的父级元素。

![image-20210812225607457](..\typora-user-images\image-20210812225607457.png)

要确定一个元素在页面中的偏移量，可以把它的 offsetLeft 和 offsetTop 属性分别与 offsetParent 的相同属性相加，一直加到根元素。下面是一个例子：

```js
function getElementLeft(element) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

function getElementTop(element) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}
```

提示：

所有这些偏移量属性都是只读的，每次访问都会重新计算。因此，尽量减少对它们的查询次数，比如把查询的值保存在局部变量中，以提高性能。

#### 客户端尺寸

客户端尺寸指的是元素内容及其内边距所占用的空间。

![image-20210812225623696](..\typora-user-images\image-20210812225623696.png)

clientWidth 是内容区宽度加左、右内边距宽度

clientHeight 是内容区高度加上、下内边距高度

客户端尺寸实际就是元素内部的空间，因此不包含滚动条占用的空间。

这两个属性最常用于确定浏览器视口尺寸，即检测 document.documentElement 的 clientWidth 和 clientHeight。这两个属性表示视口（<html>或<body>元素）的尺寸。

提示：

所有这些偏移量属性都是只读的，每次访问都会重新计算。

#### 滚动尺寸

![image-20210812225726107](..\typora-user-images\image-20210812225726107.png)

document.documentElement.scrollHeight 就是整个页面垂直方 向的总高度，可读可写。

scrollWidth 和 scrollHeight 与 clientWidth 和 clientHeight 之间的关系在不需要滚动的 文档上是分不清的。如果文档尺寸超过视口尺寸，则在所有主流浏览器中这两对属性都不相等， scrollWidth 和 scollHeight 等于文档内容的宽度，而 clientWidth 和 clientHeight 等于视口 的大小。

scrollLeft 和 scrollTop 的值是可以设置的。

#### 确定元素尺寸

element.getBoundingClientRect():该方法返回一个对象，包含 6 个属性：left、top、right、bottom、height 和 width。这些属性给出了元素在页面中相对于视 口的位置。

![image-20210812232548731](..\typora-user-images\image-20210812232548731.png)

#### 节点遍历

通过 document.createNodeIterator()方 法创建 NodeIterator 类型实例。这个方法接收以下 4 个参数。

- root，作为遍历根节点的节点。
- whatToShow，数值代码，表示应该访问哪些节点。
- filter，NodeFilter 对象或函数，表示是否接收或跳过特定节点。
- entityReferenceExpansion，布尔值，表示是否扩展实体引用。这个参数在 HTML 文档中没 有效果，因为实体引用永远不扩展。

whatToShow 参数是一个位掩码，通过应用一个或多个过滤器来指定访问哪些节点。这个参数对应 的常量是在 NodeFilter 类型中定义的。

- NodeFilter.SHOW_ALL，所有节点。
- NodeFilter.SHOW_ELEMENT，元素节点。
- NodeFilter.SHOW_ATTRIBUTE，属性节点。由于 DOM 的结构，因此实际上用不上。
- NodeFilter.SHOW_TEXT，文本节点。
- NodeFilter.SHOW_CDATA_SECTION，CData 区块节点。不是在 HTML 页面中使用的。
- NodeFilter.SHOW_ENTITY_REFERENCE，实体引用节点。不是在 HTML 页面中使用的。
- NodeFilter.SHOW_ENTITY，实体节点。不是在 HTML 页面中使用的。
- NodeFilter.SHOW_PROCESSING_INSTRUCTION，处理指令节点。不是在 HTML 页面中使用的。
- NodeFilter.SHOW_COMMENT，注释节点。
- NodeFilter.SHOW_DOCUMENT，文档节点。
- NodeFilter.SHOW_DOCUMENT_TYPE，文档类型节点。
- NodeFilter.SHOW_DOCUMENT_FRAGMENT，文档片段节点。不是在 HTML 页面中使用的。
- NodeFilter.SHOW_NOTATION，记号节点。不是在 HTML 页面中使用的。

这些值除了 NodeFilter.SHOW_ALL 之外，都可以组合使用。比如，可以像下面这样使用按位或 操作组合多个选项：

- let whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT;

NodeIterator 的两个主要方法是 nextNode()和 previousNode()。nextNode()方法在 DOM 子树中以深度优先方式进前一步，而 previousNode()则是在遍历中后退一步。创建 NodeIterator 对象的时候，会有一个内部指针指向根节点，因此第一次调用 nextNode()返回的是根节点。当遍历到 达 DOM 树最后一个节点时，nextNode()返回 null。previousNode()方法也是类似的。当遍历到达 DOM 树最后一个节点时，调用 previousNode()返回遍历的根节点后，再次调用也会返回 null。

TreeWalker 是 NodeIterator 的高级版。除了包含同样的 nextNode()、previousNode()方法， TreeWalker 还添加了如下在 DOM 结构中向不同方向遍历的方法。

- parentNode()，遍历到当前节点的父节点。
- firstChild()，遍历到当前节点的第一个子节点。
- lastChild()，遍历到当前节点的最后一个子节点。
- nextSibling()，遍历到当前节点的下一个同胞节点。
- previousSibling()，遍历到当前节点的上一个同胞节点。

TreeWalker 对象要调用 document.createTreeWalker()方法来创建，这个方法接收与 document.createNodeIterator()同样的参数：作为遍历起点的根节点、要查看的节点类型、节点 过滤器和一个表示是否扩展实体引用的布尔值。因为两者很类似，所以 TreeWalker 通常可以取代 NodeIterator。



## 第 17 章 事件

js 和 html 之间的交互通过事件来处理，在事件被触发后，会调用事件处理函数做相应的业务逻辑处理。

### 事件流

重点：理解一个事件发生时，在DOM元素或者说标签之间得传递顺序，同时理解基于事件流机制而出现得高级使用方式——事件委托（React框架的事件系统就是一个典型的事件委托）。

**事件**：在文档或浏览器窗口中，某个时刻发生的一个动作或者行为（可以是用户出发的也可以时浏览器自身触发的）。

浏览器底层为页面上的 DOM 元素提供了一系列的原生事件属性（onclick、onkeyup、onmousemov、onload 等），当开发者获得页面中的某个 DOM 元素后，可以为它注册某个事件。若希望在事件发生时，处理业务，则可以对该元素的事件进行订阅。-----这类模型叫：观察者模式。



**理解为什么会有事件流这个概念？**

在一张纸上画几个同心圆，把手指放到圆心上，则手指不仅是在最里面的一个圆圈里，而且是在所有的圆圈里。当时的IE和网景的浏览器开发团队都是以同样的方式看待浏览器事件的。当点击一个按钮时，实际上不光点击了这个按钮，还点击了它的容器以及整个页面。

 **什么又是事件流？**

**事件流**：描述了页面元素接收事件的顺序（事件在页面中各个部分之间的传播顺序）。



#### 事件冒泡

IE 事件流被称为事件冒泡。

IE的团队认为：事件从最具体的元素（文档树中最深的节点）开始触发，然后向上传播至没有那么具体的元素（文档）。现代浏览器中的事件会一直冒泡到 window 对象。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Event Bubbling Example</title>
  </head>
  <body>
    <div id="myDiv">Click Me</div>
  </body>
</html>
```

在点击页面中的 myDiv 元素后，click 事件会以如下顺序发生：

1. myDiv 的点击事件触发
2. body 的点击事件触发
3. html 的点击事件触发
4. document 的点击事件触发

myDiv 元素被点击，最先触发myDiv 这个div上 click 事件。然后，click 事件沿 DOM 树一 路向上，在经过的每个节点上依次触发，直至到达 document 对象。

![image-20240427191533543](images\image-20240427191533543.png)

所有现代浏览器都支持事件冒泡，只是在实现方式上会有一些变化。IE5.5及早期版本会跳过html元素（从直接到 document）。现代浏览器中的事件会一直冒泡到 window 对象。



#### 事件捕获

由网景公司提出的事件流模型。

事件捕获是最不具体的节点应该最先收到事件，而最具体的节点应该最后收到事件。为什么要这么做了，是为了在事件到达最终目标前开发者有能力选择是否提前拦截事件。

实际上，所有浏览器都是从 window 对象开始捕获事件，而 DOM2 Events 规范规定的是从 document 开始。

上面的例子，如果采用事件捕获流程来看，触发click事件的顺序是：

1. document 的点击事件触发
2. html 的点击事件触发
3. body 的点击事件触发
4. myDiv 的点击事件触发

在事件捕获中，click 事件首先由 document 元素捕获，然后沿 DOM 树依次向下传播，直至到达实际的目标元素div。

![image-20240427192139645](images\image-20240427192139645.png)

事件捕获得到了所有现代浏览器的支持。 实际上，所有浏览器都是从 window 对象开始捕获事件，而 DOM2 Events规范规定的是从 document 开始。



#### 事件流

DOM2 Events 规范规定事件流分为 3 个阶段：事件捕获、到达目标和事件冒泡。

事件捕获最先发生， **为提前拦截事件提供了可能**。然后，实际的目标元素接收到事件。最后一个阶段是冒泡，如果有需要处理业务逻辑，最迟要在这个阶段响应事件。

![image-20201228201106496](images\image-20201228201106496.png)



在 DOM 事件流中，实际的目标（元素）在捕获阶段不会接收到事件。这是因为捕获阶段被规定为从 document 到目标元素之前。下一阶段，会在目标元素上触发事件的“到达目标” 阶段，通常在事件处理时被认为是冒泡阶段的一部分。然后，冒泡阶段开始，事件反向传播至文档。

大多数支持 DOM 事件流的浏览器实现了一个小拓展。虽然 DOM2 Events 规范明确捕获阶段不命中事件目标，但现代浏览器都会在捕获阶段在事件目标上触发事件。最终结果是在事件目标上有两个机会来处理事件。

**所有现代浏览器都支持 DOM 事件流，只有 IE8 及更早版本不支持。**





### 事件处理函数

事件不一定非得是用户的行为触发的，也可以是浏览器自动触发的。为了响应事件而调用的函数被称为事件处理程序。

扩展:with

> ```js
> const obj = { name: 'test', age: 18 };
> 
> function fn() {
>   with (document) {
>     with (obj) {
>       // 属性值
>       console.log(age);
>     }
>   }
> }
> 
> fn();
> ```
>
> JavaScript中的`with`语句被设计用于临时扩展一个代码块的作用域链。它可以用来对一个特定对象的多个属性进行操作，而不必重复引用对象本身。基本的语法如下：
>
> ```js
> with (expression) {
>   statements
> }
> ```
>
> 在`with`语句中，`expression`是一个**对象**，而`statements`是一个或多个语句。在`with`块内部，可以直接编写对象`expression`的属性而不需要重复对象名。例如：
>
> ```js
> let obj = {a: 1, b: 2, c: 3};
> 
> with (obj) {
>   a = 3;
>   b = 4;
>   c = 5;
> }
> ```
>
> 在上面的代码中，`with`语句使我们可以直接访问和修改对象`obj`的属性，而不必每次访问或修改属性时都写`obj.`。
>
> 尽管`with`语句看起来可以简化代码，但它并不推荐使用，原因如下：
>
> 1. **性能问题**：`with`语句会改变正常的作用域链查找规则，这可能会导致JavaScript引擎优化困难，影响代码的执行效率。
> 2. **可维护性问题**：使用`with`会使代码的可读性和可维护性降低。在`with`块内部的变量可能指的是对象的属性，也可能指的是外部作用域的变量，这使得代码难以理解和调试。
> 3. **严格模式下被禁用**：在ECMAScript 5引入的严格模式（strict mode）中，`with`语句是被完全禁用的。这意味着在使用严格模式时，任何`with`语句会导致语法错误。



#### 事件处理函数书写位置：

##### 写在 HTML 元素内

- 以使用事件处理程序的名字（on + 事件）作为 HTML 元素的属性，值为能执行的 js 代码

- 属性的值必须是能够执行的 JavaScript 代码

- 在 HTML 元素中定义的事件处理程序可以包含精确的动作指令（js 代码），也可以调用在页面其他地方定义的脚本中的函数名,也可以是外部文件中定义的.

- 以这种方式指定的事件处理函数有一些特殊的地方。首先，会创建一个函数来**封装**属性的值。这个函数有一个特殊的局部变量 event，其中保存的就是 event 对象，同时this指向window对象，而不是指向绑定函数的那个html标签。

  

  ```html
  事件处理函数的参数部分接受一个由浏览器底层传递的event事件对象
  <input type="button" value="Click Me" onclick="console.log(event)"/>
  
  这种绑定事件处理函数的方式中，事件处理函数中，this 值相当于事件的目标元素（input标签对应DOM对象）
  <input type="button" value="Click Me" onclick="console.log(event.type);console.log(event.type)">
  
  
  这种绑定事件处理函数的方式中，this指向的不是input标签对应DOM对象
  <input type="button" value="Click Me" onclick="showMessage(event)"/>
  <script>
    function showMessage(event) {
      console.log("Hello world!");
      console.log(event);
      console.log(this)   // this指向window，并不指向input标签元素对象
    }
  </script>
  ```
  
  在这个函数中， document 和元素自身的成员都可以被当成局部变量来访问。这是通过使用 with 实现的：这意味着事件处理程序可以更方便地访问自己的属性。
  
  ```js
  function() {
      with(document) {
          with(this) {
              // 属性值
          }
      }
  }
  
  <input type="button" value="Click Me" onclick="console.log(value)">
  ```
  
  如果这个元素是一个表单输入框，则作用域链中还会包含表单元素，事件处理程序对应的函数等价于如下这样:
  
  ```html
  <form method="post">
    <input type="text" name="username" value="">
    <input type="button" value="Echo Username"
           onclick="console.log(username.value)">
  </form> 
  
  // 等价于下面
  <script>
    function() {
      with(document) {
        with(this.form) {
          with(this) {
            // 属性值
          }
        }
      }
    }
  </script>
  ```
  
  
  
  在 HTML 中指定事件处理程序可能存在的问题：
  
  1. dom 元素已经渲染到页面，但 js 代码还没有解析完成，所以当这个使用用户触发响应的事件，事件处理程序的代码还无法执行。
  2. 对事件处理程序作用域链的扩展在不同浏览器中可能导致不同的结果。
  3. HTML 与 JavaScript 强耦合，非常不利于维护



##### 通过JS 代码指定事件处理函数

传统方式：

###### DOM0 事件规范的方式：

- 把一个函数赋值给DOM 元素对象的一个事件处理程序属性

- 要使用 JavaScript 指定事件处理程序，必须先取得要操作对象的引用

- 每个元素（包括 window 和 document）都有事件处理程序属性（通常小写的，以onxxx开头），只要把这个属性赋值为一个函数即可

  ```js
  let btn = document.getElementById('myBtn'); // 获取元素
  btn.onclick = function () {   // 给元素的对应事件属性赋值为一个事件处理函数
    console.log(this.id); // "myBtn"
  };
  ```

- 这种事件绑定都是在代码执行阶段进行绑定的

- 事件处理程序会在元素的作用域中运行，即 **this 等于元素**

  ```js
  let btn = document.getElementById("myBtn");
  btn.onclick = function() {
    console.log(this.id); // "myBtn"   通过 this 可以访问元素的任何属性和方法
  }; 
  ```

- 以这种方式添加事件处理程序是**注册在事件流的冒泡阶段**的

- 通过将事件处理程序属性的值设置为 null，可以移除通过 DOM0 方式添加的事件处理程序。如：

  ```js
   btn.onclick = null; // 移除事件处理程序。
  ```

- 只支持给一个事件添加一个处理程序

  ```js
  let btn = document.getElementById("myBtn");
  btn.onclick = function() {
    console.log(1);
  }; 
  
  // 运行时，这个属性赋值覆盖掉上一个属性赋值
  btn.onclick = function() {
    console.log(2); 
  }; 
  ```
  
  



###### DOM2 Events 事件规范的方式：

- addEventListener() ：为 dom 元素的事件绑定事件处理函数

- removeEventListener() ：为 dom 元素的事件移除事件处理函数

  这两个方法暴露在所有 DOM 节点上，它们接收 3 个参数：**事件名、事件处理函数和一个布尔值，**

  布尔值为：true 表示在捕获阶段调用事件处理程序，

  布尔值为：false（默认值）表示在冒泡阶段调用事件处理程序。

  

  事件处理程序同样在被附加到的元素的作用域中运行（this指向DOM本身）。

  使用 DOM2 方式的主要优势是**可以为同一个事件添加多个事件处理程序。**多个事件处理程序以添加顺序来触发。
  
  ```javascript
  let btn = document.getElementById("myBtn");
  btn.addEventListener("click", () => {
    console.log(this.id);
  }, false);
  
  
  btn.addEventListener("click", () => {
    console.log("Hello world!");
  }, false); 
  ```
  
  **通过 addEventListener()添加的事件处理程序只能使用 removeEventListener()并传入与添加时同样的参数来移除。**这意味着使用 addEventListener()添加的**匿名函数无法移除**.
  
  ```javascript
  let btn = document.getElementById('myBtn');
  let handler = function () {
    console.log(this.id);
  };
  btn.addEventListener('click', handler, false);
  // 其他代码
  btn.removeEventListener('click', handler, false); // 有效果！
  ```



###### IE浏览器专有的事件绑定方式：

- attachEvent(’事件处理程序的名字‘，事件处理函数名)

- detachEvent(’事件处理程序的名字‘,，事件处理函数名)

  因为 IE8 及更早版本**只支持事件冒泡**，所以使用 attachEvent()添加的事件处理程序只会添加到冒泡阶段。

  ```js
  var btn = document.getElementById("myBtn");
  btn.attachEvent("onclick", function() {   // onclick
    console.log(this === window);  // true
  });
  
  btn.attachEvent("onclick", function() {
    console.log("Hello world!");
  });
  
  ```

  使用 attachEvent()时，事件处理程序是在全 局作用域中运行的，因此 this 等于 window。

  attachEvent()方法**也可以给一个元素添加多个事件处理程序**。事件处理程序会**以添加它们的顺序反向触发**。

  使用 attachEvent()添加的事件处理程序将使用 detachEvent()来移除，只要提供相同的参数。作为事件处理程序添加的匿名函数也无法移除。
  
  ```javascript
  var btn = document.getElementById('myBtn');
  var handler = function () {
    console.log('Clicked');
  };
  btn.attachEvent('onclick', handler);
  // 其他代码
  btn.detachEvent('onclick', handler); //成功移除
  ```



###### 跨浏览器的事件绑定方式（处理事件绑定在不同浏览器中的兼容性问题）自己编写：

主要依赖能力检测：

```javascript
var EventUtil = {
  addHandler: function(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  
  removeHandler: function(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  }
};
// 这两个方法并没有解决所有跨浏览器一致性问题，比如 IE的作用域问题、多个事件处理程序执行顺序问题等。
```



### 事件对象（event）

#### DOM事件对象

在 dom 的事件处理函数中，有一个对象 event，它内部的属性与方法代表的事件的所有相关信息。（如：事件源元素、事件类型等），比如：鼠标操作导致的事件会生成鼠标位置信息，而键盘操作导致的事件会生成与被按下的键是什么键等有关的信息。

```js
let btn = document.getElementById("myBtn");
btn.onclick = function(event) {
  console.log(event.type); // "click"
};

btn.addEventListener("click", (event) => {
  console.log(event.type); // "click"
}, false);
```



 不同的事件类型的事件对象有不同的属性和方法，但是也有一些一下的公共属性和方法：

| 属性/方法 | 类型 | 读/写 | 说明 |
| --- | --- | --- | --- |
| bubbles | 布尔值 | 只读 | 表示事件是否冒泡 |
| cancelable | 布尔值 | 只读 | 表示是否可以取消事件的默认行为 |
| **currentTarget** | 元素 | 只读 | **当前事件处理程序绑定的元素** |
| defaultPrevented | 布尔值 | 只读 | true 表示已经调用 preventDefault()方法（DOM3 Events 中新增） |
| detail | 整数 | 只读 | 事件相关的其他信息 |
| eventPhase | 整数 | 只读 | 表示调用事件处理程序的阶段：1 代表捕获阶段，2 代表 到达目标，3 代表冒泡阶段 |
| **preventDefault()** | 函数 | 只读 | **用于取消事件的默认行为。只有 cancelable 为 true 才 可以调用这个方法** |
| stopImmediatePropagation() | 函数 | 只读 | 用于取消所有后续事件捕获或事件冒泡，并阻止调用任 何后续事件处理程序（DOM3 Events 中新增） |
| **stopPropagation**() | 函数 | 只读 | **用于取消所有后续事件捕获或事件冒泡。只有 bubbles 为 true 才可以调用这个方法** |
| **target** | 元素 | 只读 | **事件被触发的具体元素目标，事件处理函数可能不在它上面** |
| trusted | 布尔值 | 只读 | true 表示事件是由浏览器生成的。false 表示事件是开 发者通过 JavaScript 创建的（DOM3 Events 中新增） |
| **type** | 字符串 | 只读 | **被触发的事件类型** |
| View | AbstractView | 只读 | 与事件相关的抽象视图。等于事件所发生的 window 对象 |



- **this，target和currentTarget**

**在事件处理程序内部，this 对象始终等于 currentTarget 的值，而 target 只包含事件的实际目标。**

如果事件处理程序直接添加在了意图的目标，则 this、currentTarget 和 target 的值是一样的。示例：

```js
let btn = document.getElementById("myBtn");
btn.onclick = function(event) {
  console.log(event.currentTarget === this); // true
  console.log(event.target === this); // true
}; 
```

上面的 click 事件的目标是按钮，所以这 3 个值是相等的。如果这个事件处理程序是添加到按钮的父节点（如 document.body）上， 那么它们的值就不一样了。比如下面的例子在 document.body 上添加了单击处理程序，但是点击的是按钮标签：

```js
document.body.onclick = function(event) {
  console.log(event.currentTarget === document.body); // true
  console.log(this === document.body); // true
  console.log(event.target === document.getElementById("myBtn")); // true
}; 
```

这种情况下点击按钮，this 和 currentTarget 都等于 document.body，这是因为它是注册事件 处理程序的元素。而 target 属性等于按钮本身，这是因为那才是 click 事件真正的目标。由于按钮 本身并没有注册事件处理程序，因此 click 事件冒泡到 document.body，从而触发了在它上面注册的 处理程序。



- **type** 

  type 属性在一个处理程序处理多个事件时很有用。比如下面的处理程序中就使用了 event.type：

  ```js
  let btn = document.getElementById('myBtn');
  let handler = function (event) {
    switch (event.type) {
      case 'click':
        console.log('Clicked');
        break;
      case 'mouseover':
        event.target.style.backgroundColor = 'red';
        break;
      case 'mouseout':
        event.target.style.backgroundColor = '';
        break;
    }
  };
  btn.onclick = handler;
  btn.onmouseover = handler;
  btn.onmouseout = handler;
  ```

  

- **preventDefault()**

  preventDefault()方法用于阻止特定事件的默认动作。比如，链接的默认行为就是在被单击时导 航到 href 属性指定的 URL。如果想阻止这个导航行为，可以在 onclick 事件处理程序中取消，如下面的例子所示：

  ```js
  let link = document.getElementById("myLink");
  link.onclick = function(event) {
    event.preventDefault();
  };
  ```

  任何可以通过 preventDefault()取消默认行为的事件，其事件对象的 cancelable 属性都会设置为 true。

  

- **stopPropagation()**

  用于立即阻止事件流在 DOM 结构中传播，取消后续的事件**捕获**或**冒泡**。

  ```js
  let btn = document.getElementById("myBtn");
  btn.onclick = function(event) {
    console.log("Clicked");
    event.stopPropagation();
  };
  
  document.body.onclick = function(event) {  // 点击上面的按钮后，没有冒泡，所以不再触发body.onclick
    console.log("Body clicked");
  }; 
  ```



- **eventPhase 属性**

  用于确定事件流当前所处的阶段。如果事件处理程序在捕获阶段被调用，则 eventPhase 等于 1；如果事件处理程序在目标上被调用，则 eventPhase 等于 2；如果事件处理程序 在冒泡阶段被调用，则 eventPhase 等于 3。不过要注意的是，虽然“到达目标”是在冒泡阶段发生的， 但其 eventPhase 仍然等于 2。

  ```js
  let btn = document.getElementById("myBtn");
  document.body.addEventListener("click", (event) => {
    console.log(event.eventPhase); // 1
  }, true);
  document.body.onclick = (event) => {
    console.log(event.eventPhase); // 3
  }; 
  ```

**event 对象只在事件处理程序执行期间存在，一旦执行完毕，就会被销毁。**



#### IE事件对象

在 IE 浏览器中获取事件对象的方法：IE 事件对象是需要根据事件处理程序被绑定的方式不同以不同方式来访问。

如果事件处理程序是使用 DOM0 方式绑定的，则 event 对象只是 window 对象的一个属性。

```javascript
var btn = document.getElementById('myBtn');
btn.onclick = function () {
  let event = window.event;
  console.log(event.type); // "click"
};
```

如果事件处理程序是使用 attachEvent()指定的，则 event 对象会作为唯一的参数传给处理函数。但是处理函数内部的 this 指向的是 window 对象。

```javascript
var btn = document.getElementById('myBtn');
btn.attachEvent('onclick', function (event) {
  console.log(event.type); // "click"
});
```

如果是使用 HTML 属性方式指定的事件处理程序，则 event 对象同样可以通过变量 event 访问（与 DOM 模型一样）。

```javascript
<input type="button" value="Click Me" onclick="console.log(event.type)">
```



 IE事件对象上的重点属性和方法：

| 属性/方法      | 类型   | 读/写 | 说明                                                         |
| -------------- | ------ | ----- | ------------------------------------------------------------ |
| cancelBubble   | 布尔值 | 读/写 | 默认为 false，设置为 true 可以取消冒泡（与 DOM 的 stopPropagation()方法相同） |
| returnValue    | 布尔值 | 读/写 | 默认为 true，设置为 false 可以取消事件默认行为 （与 DOM 的 preventDefault()方法相同） |
| **srcElement** | 元素   | 只读  | **事件目标（与 DOM 的 target 属性相同）**                    |
| **type**       | 字符串 | 只读  | **被触发的事件类型**                                         |



事件处理程序的作用域取决于绑定它的方式，因此 this 值并不总是等于事件目标。建议对于 IE 低版本浏览器使用事件对象的 srcElement 属性代替 this。

```js
var btn = document.getElementById("myBtn");
btn.onclick = function() {
  console.log(window.event.srcElement === this); // true
};

btn.attachEvent("onclick", function(event) {
  console.log(event.srcElement === this); // false
}); 
```



为了能在不同的浏览器中获取事件对象 event，可以自己手写兼容性代码：

```javascript
var EventUtil = {
  addHandler: function(element, type, handler) {
    // 为节省版面，删除了之前的代码
  },
  getEvent: function(event) {    //返回事件对象event函数
    return event ? event : window.event;
  },
  getTarget: function(event) {   //返回事件目标
    return event.target || event.srcElement;
  },
  preventDefault: function(event) {    //阻止事件的默认行为
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  removeHandler: function(element, type, handler) {
    // 为节省版面，删除了之前的代码
  },
  stopPropagation: function(event) {    //停止事件流的 DOM 方法
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
};


使用：
btn.onclick = function(event) {
  event = EventUtil.getEvent(event);
};


btn.onclick = function(event) {
  event = EventUtil.getEvent(event);
  let target = EventUtil.getTarget(event);
};

let link = document.getElementById("myLink");
link.onclick = function(event) {
  event = EventUtil.getEvent(event);
  EventUtil.preventDefault(event);
};
```



#### 事件类型

浏览器中不同事件的事件处理函数接受到事件对象中会保存一些不同和相同的数据信息。

DOM3 Events 定义的事件类型：

- 用户界面事件（UIEvent）：涉及与 BOM 交互的**通用**浏览器事件
- 焦点事件（FocusEvent）：在元素获得和失去焦点时触发
- 鼠标事件（MouseEvent）：使用鼠标在页面上执行某些操作时触发
- 滚轮事件（WheelEvent）：使用鼠标滚轮（或类似设备）时触发
- 输入事件（InputEvent）：向文档中输入文本时触发
- 键盘事件（KeyboardEvent）：使用键盘在页面上执行某些操作时触发
- DOM 和 BOM 专有事件：专有事件基本上都是根据开发者需求而不是按照规范增加的，因此不同浏览器的实现可能不同
- HTML5事件



##### 用户界面事件

这类事件并不一定是用户的具体操作触发的。主要有以下几种事件：

- **load**：

  - 在 window 对象上，load 事件会在整个页面（包括所有外部资源如图片、JavaScript 文件和 CSS 文件）加载完成后触发。

  - 窗格（iframe） 都加载完成后触发
  - 在`img`元素上当图片加载完成后触发
  - 在object元素上当相应对象加载完成后触发

  一般来说，任何在 window 上发生的事件，都可以通过给body元素上对应的属性赋值来指定。

  注意：在通过 JavaScript **创建**新img元素时，也可以给这个元素指定一个在加载完成后执行的事件处理程序。在这里，关键是要在赋值 src 属性前指定事件处理程序，如下所示：

  ```js
  window.addEventListener("load", () => {
    let image = document.createElement("img");
    image.addEventListener("load", (event) => {
      console.log(event.target.src);
    });
    document.body.appendChild(image);
    image.src = "smile.gif";
  });
  ```

  这个例子首先为 window 指定了一个 load 事件处理程序。**因为示例涉及向 DOM 中添加新元素， 所以必须确保页面已经加载完成。如果在页面加载完成之前操作 document.body，则会导致错误。**

  **注意，下载图片并不一定要把img元素添加到文档，只要给它设置了 src 属性就会立即开始下载。**

  

  也可以用 DOM0 的 Image 对象来加载图片资源。在 DOM 出现之前，客户端都使用 Image 对象预先加载图片。可以像使用前面（通过 createElement()方法创建）的img元素一样使用 Image 对象。下面的例子使用新 Image 对象实现了图片预加载.

  要将使用 `new Image()` 创建的图片对象加入到DOM中，可以使用以下步骤：

  1. 使用 `new Image()` 创建一个图片对象。
  2. 设置图片的 `src` 属性为想要显示的图片的URL。
  3. 将这个图片对象添加到DOM的某个元素中，比如一个 `<div>` 元素。

  下面是一个示例代码：

  ```html
  <div id="imageContainer"></div> <!-- 图片将被添加到这个容器 -->
  
  <script>
    // 步骤1: 创建一个新的图片对象
    var img = new Image();
  
    // 步骤2: 设置图片的source
    img.src = 'https://example.com/path/to/image.jpg'; // 替换为你自己的图片URL
  
    // 可选: 设置其他属性，比如alt文本
    img.alt = '描述文字';
  
    // 步骤3: 选择你想要添加图片的元素
    var container = document.getElementById('imageContainer');
  
    // 将图片对象添加到容器元素中
    container.appendChild(img);
  </script>
  ```

  

  扩展：

  > ```js
  > document.addEventListener("DOMContentLoaded", (event) => { 
  >   console.log("Content loaded");
  > }); 
  > ```

  

  扩展：

  > 在JavaScript中，`load` 事件通常与那些需要加载外部资源或需要时间来渲染的元素相关联。下面是一些常见标签元素以及如何为它们添加 `load` 事件监听器的示例。
  >
  > - **图片(img)**
  >
  >   ```html
  >   <img src="image.png" id="exampleImage">
  >   
  >   <script>
  >     document.getElementById('exampleImage').addEventListener('load', function(event) {
  >       console.log('图片已加载完成');
  >       console.log(event.target.src);  // 图片地址
  >     });
  >   </script>
  >   ```
  >
  > - **文档(window)**
  >
  >   ```html
  >   <script>
  >     window.addEventListener('load', function(event) {
  >       console.log('页面的所有资源（包括图片、CSS文件等）已经完全加载完成');
  >     });
  >   </script>
  >   ```
  >
  > - **iframe**
  >
  >   ```html
  >   <iframe src="page.html" id="exampleIframe"></iframe>
  >   
  >   <script>
  >     document.getElementById('exampleIframe').addEventListener('load', function() {
  >       console.log('iframe内容已加载完成');
  >     });
  >   </script>
  >   ```
  >
  > - **script**
  >
  >   ```html
  >   <script id="exampleScript">
  >     console.log('这个脚本正在运行，但它本身不会触发加载事件。');
  >   </script>
  >   <script>
  >     document.getElementById('exampleScript').addEventListener('load', function() {
  >       // 这个事件监听器不会被触发，因为<script>元素不触发load 事件。
  >       console.log('脚本标签加载完成');
  >     });
  >   </script>
  >   ```
  >
  >   在 `<script>` 标签的情况下，实际上它们不会触发 `load` 事件。通常，JavaScript 脚本会在加载到文档时立即执行，不需要等待 `load` 事件。我提供这个例子是为了展示并解释常见误解。

- unload：在 window 上当页面完全卸载后触发，在窗套上当所有窗格都卸载完成后触发，在object元素上当相应对象卸载完成后触发。

  unload 事件一般是在从一个页面导航到另一个页面时触发，最常用于清理引用，以避免内存泄漏。

- error：在 window 上当 JavaScript 报错时触发，在img元素上当无法加载指定图片时触发， 在object元素上当无法加载相应对象时触发，在窗套上当一个或多个窗格无法完成加载时触发。

- select：在文本框（input 或 textarea）上当用户选择了一个或多个字符时触发。
  扩展：

  > select事件通常与文本选择有关。在HTML中，`<input>` 和 `<textarea>` 元素可以触发 "select" 事件，当用户选择其中的文本时会发生这个事件。以下是一些 `select` 事件触发的示例。
  >
  > - `<input>` 元素中触发 `select` 事件
  >
  >   ```html
  >   <input type="text" value="选择这段文字试试" id="myInput">
  >           
  >   <script>
  >     document.getElementById('myInput').addEventListener('select', function(event) {
  >       console.log('文本被选择');
  >     });
  >   </script>
  >   ```
  >
  >   

- resize：在 window 或窗格上当窗口或窗格被缩放时触发。

  应该避免在这个事件处理程序中执行过多计算。否则可能由于执行过于频繁而导致浏览器响应明确变慢。这个事件在 window 上触发，因此可以通过 JavaScript 在 window 上或者为元素添加 onresize 属性来指定事件处理程序。（这里可以**涉及防抖或者节流函数**）

- scroll：当用户滚动包含滚动条的元素时在元素上触发。元素包含已加载页面的滚动条。



##### 焦点事件

在页面元素获得或失去焦点时触发。这些事件可以与 document.hasFocus()和 document.activeElement 一起为开发者提供用户在页面中的信息。

典型的焦点事件：

- blur：当元素失去焦点时触发。**这个事件不冒泡**，所有浏览器都支持。

- focus：当元素获得焦点时触发。**这个事件不冒泡**，所有浏览器都支持

  



##### 鼠标和滚轮事件

鼠标事件是非常常用的**一组**事件。典型的鼠标事件：

- click：在用户单击鼠标主键（通常是左键）或按键盘回车键时触发。后者主要是基于无障碍的考虑，让键盘和鼠标都可以触发 onclick 事件处理程序。

- dblclick：在用户**双击**鼠标主键（通常是左键）时触发。

- mousedown：在用户按下任意鼠标键时触发。
  ```js
  // 阻止图像默认拖拽
  const img=document.querySelector("img");
  img.addEventListener("mousedown",mouseHandler);
  function mouseHandler(e){
      e.preventDefault();
  }
  
  // 阻止文字的拖拽和选择
  document.body.addEventListener("mousedown",mouseHandler);
  function mouseHandler(e){
      e.preventDefault();
  }
  ```

  

- mouseenter：在用户把鼠标光标从元素外部移到元素内部时触发。这个事件不冒泡，也不会在光标经过后代元素时触发。

- mouseleave：在用户把鼠标光标从元素内部移到元素外部时触发。这个事件不冒泡，也不会在 光标经过后代元素时触发。

- mousemove：在鼠标光标在元素上移动时**反复**触发。

- mouseout：在用户把鼠标光标从一个元素移到另一个元素上时触发。移到的元素可以是原始元 素的外部元素，也可以是原始元素的子元素。

- mouseover：在用户把鼠标光标从元素外部移到元素内部时触发。

- mouseup：在用户释放鼠标键时触发。

- contextmenu：鼠标右键菜单

  去除单击右键菜单:

  ```js
  document.body.addEventListener("contextmenu",clickHandler);
  function clickHandler(e){
      e.preventDefault();//阻止事件默认行为
      console.log(e.type);
  }
  ```

  

**页面中的所有元素都支持鼠标事件。**除了 mouseenter 和 mouseleave，所有鼠标事件都会冒泡， 都可以被取消，而这会影响浏览器的默认行为。

由于事件之间存在关系，因此取消鼠标事件的默认行为也会影响其他事件。

比如，**click 事件触发的前提是 mousedown 事件触发后，紧接着又在同一个元素上触发了 mouseup 事件。**如果 mousedown 和 mouseup 中的任意一个事件被取消，那么 click 事件就不会触发。类似地， 两次连续的 click 事件会导致 dblclick 事件触发。只要有任何逻辑阻止了这两个 click 事件发生（比如取消其中一个 click 事件或者取消 mousedown 或 mouseup 事件中的任一个），dblclick 事件就不会发生。这 4 个事件永远会按照如下顺序触发：

1. mousedown 
2. mouseup 
3. click 
4. mousedown
5. mouseup 
6. click 
7. dblclick

**注意上面的事件触发顺序。**

**鼠标事件有一个子类别：滚轮事件。**滚轮事件只有一个事件 mousewheel，反映的是鼠标滚轮。



鼠标事件都是在浏览器视口中的某个位置上发生的。

##### 鼠标事件对象

|               |                                                              |
| ------------- | ------------------------------------------------------------ |
| event.clientX | 返回鼠标事件触发时，鼠标相对于浏览器窗口可视区左上角的 X 距离；例如，不论页面是否有水平滚动，当点击客户端区域的左上角时，鼠标事件的 `clientX` 值都将为 0。 |
| event.clientY | 返回鼠标事件触发时，鼠标相对于浏览器窗口可视区左上角的 Y 距离，同理 |
| event.pageX   | 返回鼠标事件触发时，鼠标相对于**整个文档页面**的左上角的 X 距离，比如，如果页面有滚动条且向右滚动 200px ，然后鼠标点击距离窗口左边 100px 的位置，pageX 所返回的值将是 300。 |
| event.pageY   | 返回鼠标事件触发时，鼠标相对于**整个文档页面**的左上角的 Y 距离 |
| event.screenX | 返回鼠标事件触发时，鼠标相对于电脑屏幕左上角的 X 距离        |
| event.screenY | 返回鼠标事件触发时，鼠标相对于电脑屏幕左上角的 Y 距离        |
| event.offsetX | 规定了事件对象与目标节点的内填充边（padding edge）在 X 轴方向上的偏移量。 |
| event.offsetY | 规定了事件对象与目标节点的内填充边（padding edge）在 Y 轴方向上的偏移量。 |

以上属性都是只读属性。



扩展：

> 在JavaScript中，`event.offsetY` 是一个事件属性，它在鼠标或指针事件发生时提供了一种衡量方法，用来确定在Y轴方向上，事件触发点相对于事件目标节点的内填充边（padding edge）的偏移量。理解这个概念，需要分清两个部分：事件对象和目标节点。
>
> **事件对象（Event Object）**
>
> 事件对象是一个包含所有与事件相关信息的对象。当在文档中发生事件（如点击、滑动、按键等）时，浏览器会创建这个对象。它包含了事件的详情，比如事件类型（点击、滑动等）、触发事件的元素、事件发生的时间，以及像`offsetX`和`offsetY`这样的属性，这些属性提供了事件发生位置的具体信息。
>
> **目标节点（Target Node）**
>
> 目标节点是事件实际发生的元素或者节点。比如，如果你在一个按钮元素上点击，那么这个按钮就是事件的目标节点。在事件对象中，可以通过`event.target`来访问这个节点。这个节点是事件传播过程中的一个重要概念，并且是判断事件具体发生位置的关键。
>
> **`event.offsetY`的理解**
>
> 当你理解了事件对象和目标节点后，`event.offsetY`的概念就相对直接了。`event.offsetY`提供的是，在Y轴方向上，事件发生点（比如鼠标点击或指针触摸的点）相对于目标节点的内填充边的偏移量。这个“内填充边”指的是目标节点的padding边界，不包括边框（border）和外边距（margin）。
>
> **例子**
>
> 如果你有一个带有一定`padding`的`<div>`元素，当你在这个`<div>`内部的任意位置点击时，`event.offsetY`将会告诉你点击位置相对于`<div>`的顶部padding边界的垂直距离。如果`<div>`的顶部有10像素的padding，你在`<div>`的顶部边界点击，那么`event.offsetY`的值接近于10（因为你实际点击的位置是padding内部，而不是直接在内容或边界上）。



<img src="images\image-20240502170855394.png" alt="image-20240502170855394" style="zoom:200%;" />

**在页面没有滚动时，pageX 和 pageY 与 clientX 和 clientY 的值相同。**





- `<script>`元素会在 JavaScript 文件加载完成后触发 load 事件，从而可以动态检测。与图片不同，要下载 JavaScript 文件必须同时指定 src 属性并把 script 元素添加到文档中。因此指定事件处理程序和指定 src 属性的顺序在这里并不重要。

  ```
  window.addEventListener("load", () => {
   let script = document.createElement("script");
   script.addEventListener("load", (event) => {
   console.log("Loaded");
   });
   script.src = "example.js";
   document.body.appendChild(script);
  });
  ```

- link元素触发 load 事件,与 script 节点一样，在指定 href 属性并把 link 节点添加到文档之前不会下载样式表。

  ```
  window.addEventListener("load", () => {
   let link = document.createElement("link");
   link.type = "text/css";
   link.rel= "stylesheet";
   link.addEventListener("load", (event) => {
   console.log("css loaded");
   });
   link.href = "example.css";
   document.getElementsByTagName("head")[0].appendChild(link);
  });
  ```



- 鼠标事件的修饰键：在触发鼠标事件时，还希望确认用户是否按下了键盘按钮。如果按下了，才进行业务处理。这是就需要用到修饰键属性：

  - shiftKey、ctrlKey、altKey 和 metaKey。这几属性会在各自对应的修饰键被按下时包含布尔值 true，没有被按下时包含 false。在鼠标事件发生的，可以通过这几个属性来 检测修饰键是否被按下。

    ```javascript
    let div = document.getElementById('myDiv');
    div.addEventListener('click', (event) => {
      let keys = new Array();
      if (event.shiftKey) {
        keys.push('shift');
      }
      if (event.ctrlKey) {
        keys.push('ctrl');
      }
      if (event.altKey) {
        keys.push('alt');
      }
      if (event.metaKey) {
        keys.push('meta');
      }
      console.log('Keys: ' + keys.join(','));
    });
    ```

- 鼠标事件中的按键属性： mousedown 和 mouseup 事件来说，event 对象上会有一个 button 属性，表示按下或释放的是鼠标的左键、右键或者中键。这个 button 属性定义了 3 个值：0 表示鼠标主键、1 表示鼠标中键（通常 也是滚轮键）、2 表示鼠标副键。鼠标主键通常是左边的按键，副键通常是右边的按键。

**额外事件信息**

DOM2 Events 规范在 event 对象上提供了 detail 属性，以给出关于事件的更多信息。对鼠标事件来说，detail 包含一个数值，**表示在给定位置上发生了多少次单击。**单击相当于在同一个像素上发生一次 mousedown 紧跟一次 mouseup。detail 的值从 1 开始，每次单击会加 1。如果鼠标在 mousedown 和 mouseup 之间移动了，则 detail 会重置为 0。



- mousewheel 事件：用户使用鼠标滚轮时触发，包括在垂直方向上任意滚动。这个事件会在**任何元素上触发（可以为页面上的任何元素或文档添加 onmousewheel 事件处理程序）**，并冒泡到 document 和 window。

滚轮事件的事件对象上的一个新属性 —— wheelDelta，鼠标向前滚动时，该值为正数，向后滚动时该值为负数。

![image-20210813201753734](..\typora-user-images\image-20210813201753734.png)

扩展：

> 在现代浏览器中，鼠标滚轮的滚动方向可以通过监听 `wheel` 事件来判断。该事件在用户滚动鼠标滚轮时触发，并且它的事件对象中包含了 `deltaY` 属性，该属性表示Y轴的滚动距离，其值的正负和大小能够表明滚动的方向和相对强度：
>
> 
>
> - 当 `deltaY` 是正值时，它表明鼠标滚轮是向下滚动的，对应的页面会向上滚动。
> - 当 `deltaY` 是负值时，它表明鼠标滚轮是向上滚动的，对应的页面会向下滚动。
>
> 
>
> 下面是一个简单的例子来说明如何使用 `wheel` 事件来判断滚动方向：
>
> ```js
> document.addEventListener('wheel', function(event) {
>   if (event.deltaY < 0) {
>     console.log('滚轮向上滚动');
>   } else if (event.deltaY > 0) {
>     console.log('滚轮向下滚动');
>   }
> });
> ```
>
> 在实际应用中，可能希望根据滚动强度来实施不同的操作，那就可以使用 `deltaY` 的绝对值来作进步的逻辑判断。
>
> 请注意，`wheel` 事件也包含了 `deltaX` 和 `deltaZ`，分别表示水平轴和Z轴的滚动，但鼠标滚轮通常只影响Y轴（垂直方向）。
>
> 此外，存在 `deltaMode` 属性，该属性指定 `deltaX`、`deltaY` 和 `deltaZ` 的单位，有三种可能的值：
>
> 
>
> - `DOM_DELTA_PIXEL`（默认值，0）：`delta` 值以像素为单位。
> - `DOM_DELTA_LINE`（值为1）：`delta` 值以行为单位。
> - `DOM_DELTA_PAGE`（值为2）：`delta` 值以页面为单位。
>
> 
>
> 大多数情况下，`deltaMode` 的默认值是 `DOM_DELTA_PIXEL`，意味着滚动信息是以像素为单位的。根据具体需求，可能需要根据 `deltaMode` 来调整滚动逻辑。



输入事件（InputEvent）：向文档中输入文本时触发。

键盘事件（KeyboardEvent）：用户操作键盘时触发。

- keydown，用户按下键盘上某个键时触发，而且持续按住会重复触发
- keyup，用户释放键盘上某个键时触发
- keypress：用户按下键盘上某个键并产生字符时触发，而且持续按住会重复触发，esc键也能触发。（类似的事件是textInput事件）
- 即 textInput：输入事件，用于在文本显示给用 户之前更方便地截获文本输入。**textInput 会在文本被插入到文本框之前触发。**
- 对于键盘事件的事件对象中，keyCode 属性中会保存一个键码

**所有元素都支持这些键盘事件**。

用户按下一个键后，事件的触发顺序：

1. keydown
2. keypress
3. keyup

这里 keydown 和 keypress 事件会在文本框出现变化之前触发，而 keyup 事件会在文本框出现变化之后触发。如果一个字符键被按住不放，keydown 和 keypress 就会重复触发，直到这个键被释放。



**键码**

对于 keydown 和 keyup 事件，event 对象的 keyCode 属性中会保存一个键码，对应键盘上特定的一个键。字母和数字键 keyCode 的值与小写字母和数字的 ASCII 编码一致。

```js
let textbox = document.getElementById("myText");
textbox.addEventListener("keyup", (event) => {
  console.log(event.keyCode);
}); 
```

一些键和键码的对应关系：

| 键         | 键 码 |
| ---------- | ----- |
| 数字键盘 0 | 96    |
| 数字键盘 1 | 97    |
| 数字键盘 2 | 98    |
| ...        | ...   |
| 数字键盘 9 | 105   |
|            |       |

浏览器在 event 对象上支持 charCode 属性，只有发生 **keypress** 事件时这个属性才会被设置值，包含的是按键字符对应的 ASCII 编码。通常，charCode 属性的值是 0，在 keypress 事件发生时则是对应按键的键码。

**一旦有了字母编码，就可以使用 String.fromCharCode()方法将其转换为实际的字符了。**





#### HTML5 事件

1. contextmenu 事件：鼠标右键的上下文菜单事件。

   - 确定何时该右键显示上下文菜单

   - 如何避免默认的上下文菜单起作用

   - **允许开发者取消默认的上下文菜单并提供自定义菜单**

   - contextmenu 事件冒泡，因此只要给 document 指定一个事件处理程序就可以处理页面上的所有同类事件

   - 禁止弹出鼠标右键上下文菜单，可以为相应的元素注册 contextmenu 事件，然后在事件处理函数中阻止默认行为

     ```javascript
     如：阻止整个页面的右键菜单出现：
     window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
     })
      
     其他实例：
     html部分：
     <!DOCTYPE html>
     <html>
     <head>
      <title>ContextMenu Event Example</title>
     </head>
     <body>
      <div id="myDiv">Right click or Ctrl+click me to get a custom context menu.
      Click anywhere else to get the default context menu.</div>
      <ul id="myMenu" style="position:absolute;visibility:hidden;background-color:
      silver">
      <li><a href="http://www.somewhere.com"> somewhere</a></li>
      <li><a href="http://www.wrox.com">Wrox site</a></li>
      <li><a href="http://www.somewhere-else.com">somewhere-else</a></li>
      </ul>
     </body>
     </html>
      
     js部分：
     window.addEventListener("load", (event) => {
      let div = document.getElementById("myDiv");
      div.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      let menu = document.getElementById("myMenu");
      menu.style.left = event.clientX + "px";
      menu.style.top = event.clientY + "px";
      menu.style.visibility = "visible";
      });
      document.addEventListener("click", (event) => {
      document.getElementById("myMenu").style.visibility = "hidden";
      });
     });
     ```

2. beforeunload 事件：给开发者提供询问用户是否确定关闭当前页面的机会。

```javascript
window.addEventListener('beforeunload', (event) => {
  let message = "I'm really going to miss you if you go.";
  event.returnValue = message;
  return message;
});
```

3. **DOMContentLoaded 事件**：在 DOM 树构建完成后立即触发，而不用等待图片、JavaScript 文件、CSS 文件或其他资源加载完成。

   - window 的 load 事件会在页面**完全加载**后触发，因为要等待很多外部资源加载完成，所以会花费较长时间。

   - 要给 document 或 window 添加事件处理程序（实际的事件目标是 document，但会冒泡到 window）。

     

   - DOMContentLoaded 事件通常用于添加事件处理程序或执行其他 DOM 操作。**这个事件始终在 load 事件之前触发。**

   - 对于不支持 DOMContentLoaded 事件的浏览器，可以使用超时为 0 的 setTimeout()函数，通过其回调来设置事件处理程序，比如： setTimeout(() => { // 在这里添加事件处理程序 }, 0);

4. **hashchange 事件**

   - onhashchange 事件处理程序必须添加给 **window**，每次 URL 散列值发生变化时会调用它。
   - event 对象有两个新属性：oldURL 和 newURL。这两个属性分别保存变化前后的 URL，而且是包含散列值的 完整 URL。



#### 移动端事件

**设备事件**

设备事件可以用于确定用户使用移动设备的方式。主要是面向移动手机和平板。

1. orientationchange 事件，判断用户的设备是处于垂直模式还是水平模式。

   window.orientation 属性有以 下 3 种值之一：0 表示垂直模式，90 表示左转水平模式（主屏幕键在右侧），–90 表示右转水平模式（主 屏幕键在左）。

   ![image-20240503130057796](D:\learn-notes\js\images\image-20240503130057796.png)

   每当用户旋转设备改变了模式，就会触发 orientationchange 事件。

2. deviceorientation 事件，获取设备的加速计信息， 而且数据发生了变化，这个事件就会在 window 上触发。注意，deviceorientation 事件只反映设备在空间中的朝向，而不涉及移动相关的信息。

   ![image-20240503130357793](images\image-20240503130357793.png)

3. devicemotion 事件，用于提示设备实际上在移动，而不仅仅是改变了朝向。例如，可以用来确定设备正在掉落或者正拿在一个行走的人手里。



**触摸及手势事件**

因为移动设备没有鼠标和键盘，所以常规的鼠标和键盘事件不足以创建具有完整交互能力的网页。

触摸屏通常不支持鼠标操作。开发移动端页面时需要注意的地方：

1. 不支持 dblclick 事件。双击浏览器窗口可以放大，但没有办法覆盖这个行为。
2. 单指点触屏幕上的可点击元素会触发 mousemove 事件。如果操作会导致内容变化，则不会再触发其他事件。如果屏幕上没有变化，则会相继触发 mousedown、mouseup 和 click 事件。点触不可点击的元素不会触发事件。可点击元素是指点击时有默认动作的元素（如链接）或指定 了 onclick 事件处理程序的元素。
3. mousemove 事件也会触发 mouseover 和 mouseout 事件。
4. 双指点触屏幕并滑动导致页面滚动时会触发 mousewheel 和 scroll 事件。

 触摸事件：

1. touchstart：手指放到屏幕上时触发（即使有一个手指已经放在了屏幕上）。

2. touchmove：手指在屏幕上滑动时连续触发。在这个事件中调用 preventDefault()可以阻止滚动。

3. touchend：手指从屏幕上移开时触发。

   以上事件都会冒泡，也都可以被取消。

   触摸事件的事件对象上的属性：bubbles、 cancelable、view、clientX、clientY、screenX、screenY、detail、altKey、shiftKey、 ctrlKey 和 metaKey。

   

   触摸事件还提供了以下 3 个属性用于跟踪触点：

   - touches：Touch 对象的数组，表示当前屏幕上的每个触点。
   - targetTouches：Touch 对象的数组，表示特定于事件目标的触点
   - changedTouches：Touch 对象的数组，表示自上次用户动作之后变化的触点。

   每个 Touch 对象都包含下列属性：

   - clientX：触点在视口中的 x 坐标。
   - clientY：触点在视口中的 y 坐标。
   - identifier：触点 ID。
   - pageX：触点在页面上的 x 坐标。
   - pageY：触点在页面上的 y 坐标。
   - screenX：触点在屏幕上的 x 坐标。
   - screenY：触点在屏幕上的 y 坐标。
   - target：触摸事件的事件目标。

   这些属性可用于追踪屏幕上的触摸轨迹。



#### 内存与性能

**页面中事件处理函数的数量与页面整体性能直接相关。**

原因：

- 每个函数都是独立的对象，都占用内存空间，对象越多，性能越差。
- 绑定事件处理函数时都需要先获取 DOM 元素，所需访问 DOM 的次数会先期对对对 造成整个页面交互的延迟。
- 页面卸载不完全导致内存泄露

**使用事件处理函数时的页面性能改善方法：**

- 事件委托：事件委托基于事件冒泡，可以只使用一个事件处理程序来管理一种类型的事件。

  实例：

  ```javascript
  <ul id="myLinks">
   <li id="goSomewhere">Go somewhere</li>
   <li id="doSomething">Do something</li>
   <li id="sayHi">Say hi</li>
  </ul>

  不考虑性能的方式：
  let item1 = document.getElementById("goSomewhere");
  let item2 = document.getElementById("doSomething");
  let item3 = document.getElementById("sayHi");
  item1.addEventListener("click", (event) => {
   location.href = "http:// www.wrox.com";
  });
  item2.addEventListener("click", (event) => {
   document.title = "I changed the document's title";
  });
  item3.addEventListener("click", (event) => {
   console.log("hi");
  });

  利用事件委托：
  let list = document.getElementById("myLinks");
  list.addEventListener("click", (event) => {
   let target = event.target;
   switch(target.id) {
   case "doSomething":
   document.title = "I changed the document's title";
   break;
   case "goSomewhere":
   location.href = "http:// www.wrox.com";
   break;
   case "sayHi":
   console.log("hi");
   break;
   }
  });

  ```

- 删除事件处理程序

  及时删除不用的事件处理程序。很多 Web 应用性能不佳都是由于无用的事件处理程序长驻内存导致的。

  无用的事件处理程序长驻内存的原因：

  - 删除带有事件处理程序的元素。比如通过真正的 DOM 方法 removeChild()或 replaceChild()删除节点。最常见的还是使用 innerHTML 整体替换页面的某一部分。被 innerHTML 删除的元素上如果有事件处理程序，被删除之后仍然关联着一个事件处理程序。事件处理程序仍然挂在按钮上面，不会被垃圾收集程序正常清理。

  处理方法：如果知道某个元素会被删除，那么最好在删除它之前手工删除它的事件处理程序。

  实例：

  ```javascript
  没有删除事件处理函数：
  <div id="myDiv">
   <input type="button" value="Click Me" id="myBtn">
  </div>
  <script type="text/javascript">
   let btn = document.getElementById("myBtn");
   btn.onclick = function() {
   // 执行操作
   document.getElementById("myDiv").innerHTML = "Processing...";
   // 不好！
   };
  </script>
  
  删除了事件处理函数：
  <div id="myDiv">
   <input type="button" value="Click Me" id="myBtn">
  </div>
  <script type="text/javascript">
   let btn = document.getElementById("myBtn");
   btn.onclick = function() {
   // 执行操作
   btn.onclick = null; // 删除事件处理程序
   document.getElementById("myDiv").innerHTML = "Processing...";
   };
  </script>
  ```

  **注意，在事件处理程序中删除按钮会阻止事件冒泡。只有事件目标仍然存在于文档中时，事件才会冒泡。**

- 页面卸载

  如果在页面卸载后事件处理程序没有被清理，则它们仍然会残留在内存中。之后，浏览器每次加载和卸载页面（比如通过前进、后退或刷新），内存中残留对 象的数量都会增加，这是因为事件处理程序不会被回收。

  处理方法：一般来说，最好在 onunload 事件处理程序中趁页面尚未卸载先删除所有事件处理程序。



#### 模拟事件

事件都是由用户交互或浏览器功能触发。但是也可以通过 JavaScript 在任何时候触发任意事件，开发者不用通过具体的某个用户行为，也能通过 js 代码模拟实现相应的事件，并且同样具备事件冒泡等机制。**这在测试情况下是非常有用的。**

DOM 事件模拟步骤：

1. 使用 document.createEvent()方法创建一个 event 对象。这个方法接收一个参数，此参数是一个表示要创建事件类型的字符串。在 DOM2 中，所有这些字符串都是英文复数形式， 但在 DOM3 中，又把它们改成了英文单数形式。可用的字符串值是以下值之一。

- "UIEvents"（DOM3 中是"UIEvent"）：通用用户界面事件（鼠标事件和键盘事件都继承自这个事件）。
- "MouseEvents"（DOM3 中是"MouseEvent"）：通用鼠标事件。
- "HTMLEvents"（DOM3 中没有）：通用 HTML 事件（HTML 事件已经分散到了其他事件大类中）。

键盘事件是后来在 DOM3 Events 中增加的。

2. 使用事件相关的信息对上面的 event 对象进行初始化

   比如模拟鼠标事件，先创建一个新的鼠标 event 对象，可以调用 event 对象的上 initMouseEvent( )方法对 event 对象进行初始化。该方法接受 15 个参数，分别对应鼠标事件会暴露的属性。具体参数参考如下：

   - **type**（字符串）：要触发的事件类型，如"click"。
   - **bubbles**（布尔值）：表示事件是否冒泡。为精确模拟鼠标事件，应该设置为 true。
   - **cancelable**（布尔值）：表示事件是否可以取消。为精确模拟鼠标事件，应该设置为 true。
   - **view**（AbstractView）：与事件关联的视图。基本上始终是 document.defaultView。
   - screenX（整数）：事件相对于屏幕的 x 坐标。
   - screenY（整数）：事件相对于屏幕的 y 坐标。
   - clientX（整数）：事件相对于视口的 x 坐标。
   - clientY（整数）：事件相对于视口的 y 坐标。
   - ctrlkey（布尔值）：表示是否按下了 Ctrl 键。默认为 false。
   - altkey（布尔值）：表示是否按下了 Alt 键。默认为 false。
   - shiftkey（布尔值）：表示是否按下了 Shift 键。默认为 false。
   - metakey（布尔值）：表示是否按下了 Meta 键。默认为 false。
   - button（整数）：表示按下了哪个按钮。默认为 0。
   - relatedTarget（对象）：与事件相关的对象，只在模拟 mouseover 和 mouseout 时使用。
   - event 对象的 target 属性会自动设置为调用 dispatchEvent()方法时传入的节点。

   例子：

   ```js
   let btn = document.getElementById("myBtn");
   // 创建 event 对象
   let event = document.createEvent("MouseEvents");
   // 初始化 event 对象
   event.initMouseEvent("click", true, true, document.defaultView,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
   // 触发事件
   btn.dispatchEvent(event);
   ```

3. 使用 dispatchEvent()方法。这个方法存在于所有支持事件的 DOM 节点之上。dispatchEvent()方法接收一个参数，即表示要触发事件的 event 对象。调用 dispatchEvent()方法之后，事件被模拟触发，接着便冒泡并触发事件处理程序执行。



##### 模拟键盘事件

1. let event = createEvent( "KeyboardEvent" )

2. event.initKeyboardEvent(type,bubbles,cancelable,view,key,location,modifiers,repeat)

    type（字符串）：要触发的事件类型，如"keydown"。

    bubbles（布尔值）：表示事件是否冒泡。为精确模拟键盘事件，应该设置为 true。

    cancelable（布尔值）：表示事件是否可以取消。为精确模拟键盘事件，应该设置为 true。

    view（AbstractView）：与事件关联的视图。基本上始终是 document.defaultView。

    key（字符串）：按下按键的字符串代码。

    location（整数）：按下按键的位置。0 表示默认键，1 表示左边，2 表示右边，3 表示数字键盘， 4 表示移动设备（虚拟键盘），5 表示游戏手柄。

    modifiers（字符串）：空格分隔的修饰键列表，如"Shift"。

    repeat（整数）：连续按了这个键多少次。

```js
let textbox = document.getElementById("myTextbox"),
 event;
// 按照 DOM3 的方式创建 event 对象
if (document.implementation.hasFeature("KeyboardEvents", "3.0")) {
 event = document.createEvent("KeyboardEvent");
 // 初始化 event 对象
 event.initKeyboardEvent("keydown", true, true, document.defaultView, "a",
 0, "Shift", 0);
}
// 触发事件
textbox.dispatchEvent(event);

这个例子模拟了同时按住 Shift 键和键盘上 A 键的 keydown 事件。
```



##### 模拟用户界面事件

模拟通用 HTML 事件例子：

```
let event = document.createEvent("HTMLEvents");
event.initEvent("focus", true, false);
target.dispatchEvent(event);
```



##### 自定义事件

自定义事件不会触发原生 DOM 事件，但可以让开发者定义自己的事件。要创建自定义事件，需要调用 createEvent("CustomEvent") 。返回的对象包含 initCustomEvent()方法。

- let event = createEvent("CustomEvent")
- event.initCustomEvent(type，bubbles，cancelable，detail )
  - type（字符串）：要触发的事件类型，如"myevent"。
  - bubbles（布尔值）：表示事件是否冒泡。
  - cancelable（布尔值）：表示事件是否可以取消。
  - detail（对象）：任意值。作为 event 对象的 detail 属性

例子：

```js
let div = document.getElementById('myDiv'),
  event;
div.addEventListener('myevent', (event) => {
  console.log('DIV: ' + event.detail);
});
document.addEventListener('myevent', (event) => {
  console.log('DOCUMENT: ' + event.detail);
});
if (document.implementation.hasFeature('CustomEvents', '3.0')) {
  event = document.createEvent('CustomEvent');
  event.initCustomEvent('myevent', true, false, 'Hello world!');
  div.dispatchEvent(event);
}
```

DOM3 增加，事件发布订阅者模式。



## 第 18 章 动画与 Canvas 图形

### requestAnimationFrame( )

之前的动画是通过定时器来实现的。定时动画的问题在于无法准确知晓循环之间的延时。循环间隔的事件需要较短，才不会觉得卡帧，但又要有一定的长度，以便浏览器可以绘制出变化。一般计算机显示器的屏 幕刷新率都是 60Hz，基本上意味着每秒需要重绘 60 次。大多数浏览器会限制重绘频率，使其不超出屏 幕的刷新率，这是因为超过刷新率，用户也感知不到。

实现平滑动画最佳的重绘间隔为 1000 毫秒/60，大约 17 毫秒。

无论 setInterval()还是 setTimeout()都是不能保证时间精度的。作为第二个参数的延时 只能保证何时会把代码添加到浏览器的任务队列，不能保证添加到队列就会立即运行。

requestAnimationFrame()方法接收一个参数，此参数是一个要在重绘屏幕前调用的函数。这个函数就是修改 DOM 样式以反映下一次重绘有什么变化的地方。

```js
function updateProgress() {
    var div = document.getElementById("status");
    div.style.width = (parseInt(div.style.width, 10) + 5) + "%";
    if (div.style.left != "100%") {
        requestAnimationFrame(updateProgress);
    }
}
requestAnimationFrame(updateProgress);
requestAnimationFrame()也返回一个请求 ID
cancelAnimationFrame(ID)可以取消ID
```

#### 通过 requestAnimationFrame 节流

支持这 个方法的浏览器实际上会暴露出作为钩子的回调队列。所谓钩子（hook），就是浏览器在执行下一次重 绘之前的一个点。这个回调队列是一个可修改的函数列表，包含应该在重绘之前调用的函数。每次调用 requestAnimationFrame()都会在队列上推入一个回调函数，队列的长度没有限制。这个回调队列的行为不一定跟动画有关。**不过，通过 requestAnimationFrame()递归地向队列 中加入回调函数，可以保证每次重绘最多只调用一次回调函数。这是一个非常好的节流工具。**

在频繁执 行影响页面外观的代码时（比如滚动事件监听器），可以利用这个回调队列进行节流。

```
没有做节流的代码：
function expensiveOperation() {
 console.log('Invoked at', Date.now());
}
window.addEventListener('scroll', () => {
 expensiveOperation();
});


如果想把事件处理程序的调用限制在每次重绘前发生，那么可以像这样下面把它封装到 requestAnimationFrame()调用中：
function expensiveOperation() {
 console.log('Invoked at', Date.now());
}
window.addEventListener('scroll', () => {
 window.requestAnimationFrame(expensiveOperation);
});

这样会把所有回调的执行集中在重绘钩子，但不会过滤掉每次重绘的多余调用。此时，定义一个标
志变量，由回调设置其开关状态，就可以将多余的调用屏蔽

let enqueued = false;
function expensiveOperation() {
 console.log('Invoked at', Date.now());
 enqueued = false;
}
window.addEventListener('scroll', () => {
 if (!enqueued) {
 enqueued = true;
 window.requestAnimationFrame(expensiveOperation);
 }
});
```

### canvas

#### 基本骨架：

```
<canvas id="drawing" width="200" height="200">A drawing of something.</canvas>

let drawing = document.getElementById("drawing");
// 确保浏览器支持<canvas>
if (drawing.getContext) {
 let context = drawing.getContext("2d");
 // 其他代码
}
```

#### 导出 canvas 上的图画：

使用 toDataURL()方法，该方法接受一个参数用来指定要生成的图像的 MIME 类型。

例子：导出 PNG 图片(默认将图像编码为 PNG 格式，除非另行指定)：

```
let drawing = document.getElementById("drawing");
// 确保浏览器支持<canvas>
if (drawing.getContext) {
 // 取得图像的数据 URI
 let imgURI = drawing.toDataURL("image/png");
 // 显示图片
 let image = document.createElement("img");
 image.src = imgURI;
 document.body.appendChild(image);
}
```



#### 2D 绘图上下文

坐标参考点是（0，0），在 元素的左上角。绘图的画，可以选择填充或者描边，填充以指定样式（颜色、渐变或图像）自动填充形 状，而描边只为图形边界着色。

填充或者描边的风格通过 fillStyle 和 strokeStyle 设置。

```
let drawing = document.getElementById("drawing");
// 确保浏览器支持<canvas>
if (drawing.getContext) {
 let context = drawing.getContext("2d");
 context.strokeStyle = "red";
 context.fillStyle = "#0000ff";
}
```

#### 矩形相关 API：

- fillRect()：绘制并填充矩形
- strokeRect()：绘制矩形轮廓
- clearRect()：擦除画布中某个区域

这些方法都接收 4 个参数：矩形 x 坐标、矩形 y 坐标、 矩形宽度和矩形高度。这几个参数的单位都是像素。

lineWidth 属性设置描边宽度

lineCap 属性设置线条端点的形状

lineJoin 属性控制线条交点的形状

#### 绘制路径相关 API：

```
ctx.beginPath()  //表示要开始绘制新路径
ctx.closePath()  //结束本次路径绘制，绘制一条返回起点的线
```

moveTo(x, y)：不绘制线条，只把绘制光标移动到(x, y)。

lineTo(x, y)：绘制一条从上一点到(x, y)的直线。

rect(x, y, width, height)：以给定宽度和高度在坐标点(x, y)绘制一个矩形。这个方法 与 strokeRect()和 fillRect()的区别在于，它创建的是一条路径，而不是独立的图形。

arc(x, y, radius, startAngle, endAngle, counterclockwise)：以坐标(x, y)为圆 心，以 radius 为半径绘制一条弧线，起始角度为 startAngle，结束角度为 endAngle（都是 弧度）。最后一个参数 counterclockwise 表示是否逆时针计算起始角度和结束角度（默认为 顺时针）。

arcTo(x1, y1, x2, y2, radius)：以给定半径 radius，经由(x1, y1)绘制一条从上一点 到(x2, y2)的弧线。

在路径绘制结束后，可以用 fillStyle 属性来指定填充颜色，用 fill()方法来填充；也可以指定 strokeStyle 属性并调用 stroke()方法来描画路径，还可以调用 clip()方法基于已有路径创建一个新剪切区域。

#### 绘制文本相关 API：

- fillText( )
- strokeText( )

这两个方法都接收 4 个参数：要绘制的字符串、x 坐标、y 坐标和可选的最大像素 宽度。这两个方法最终绘制的结果都取决于以下 3 个属性：

- font： CSS 语法指定的字体样式、大小、字体族等，比如"10px Arial"。
- textAlign：指定文本的对齐方式，可能的值包括"start"、"end"、"left"、"right"和 "center"。
- textBaseLine：指定文本的基线，可能的值包括 "top" 、 "hanging" 、 "middle" 、 "alphabetic"、"ideographic"和"bottom"。

这些属性都有相应的默认值，因此没必要每次绘制文本时都设置它们。
