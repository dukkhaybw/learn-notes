# Chrome DevTools

**面板简介：**

1. 元素面板

   作用：操作 `DOM` 和 `CSS` 来布局和改变样式
   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/168274461fd902c3~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

2. 控制台面板
   作用：查看报错，警告信息、作为shell与`JavaScript` 交互
   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/1682744620ff580a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

3. 源代码面板
   作用：设置源码断点来调试 `JavaScript` ，或者通过 `Workspaces`（工作区）连接本地文件来使用开发者工具的实时编辑器

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/16827446443e67ff~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

4. 网络面板
   作用：了解请求和下载的资源文件并优化网页加载性能，模拟不同网络环境，查看资源时间轴
   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/1682744620013519~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

5. 性能面板
   可以记录和查看网站生命周期内发生的各种事件的运行时性能

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/1682744620601483~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

6. 内存面板

   跟踪变量的内存使用，项目的内存使用和内存泄漏

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/16827446210a9e18~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

7. 应用面板
   检查加载的`IndexedDB` 与 `Web SQL` 数据库，本地和会话存储，`cookie` ，应用程序缓存，图像，字体和样式表

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/16827446eff22017~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

8. 安全面板

   调试混合内容问题，证书问题

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/7/16827447112db421~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

对 `DevTools` 里面数据进行 **复制** 或者 **保存** 的操作

**copy()**

通过在控制台面板（console）中使用全局的copy()方法复制任何页面中任何全局的数据或者指定对象的属性或者方法。然后再ctrl + v实现粘贴。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16787442a1444125~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**Store as global**

如果在 `console` 中打印了一堆数据，然后想对这些数据在不影响它原来值的情况下，做一些额外的操作。可以将它转换成一个全局变量，只需要 **右击** 它，并选择 “`Store as global variable`” (保存为全局变量) 选项。

第一次使用的话，它会创建一个名为 `temp1` 的变量，第二次创建 `temp2`，第三次 ... 。





**保存堆栈信息**

用于定位各种报错问题。可以直接把堆栈跟踪的信息保存为一个文件，而不只是截图发给同事。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16787442c1b6d1f7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**Copy HTML**

在Element面板，右击或者点击在 `HTML` 元素边上的省略号 (...) 就可以将它 `copy` 到剪贴板中。也可以使用[ctrl] + [c]。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16787442daaa7199~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**快捷键**

切换 `DevTools` 窗口的展示布局：

使用一个快捷键 `ctrl + shift + D` (`⌘ + shift + D` Mac) 来实现位置的切换。

![image-20230303175919664](images/image-20230303175919664.png)



切换 `DevTools` 的面板：

- 按下 `ctrl + [` 和 `ctrl + ]` 可以从当前面板的分别向左和向右切换面板。

- 按下 `ctrl + 1` 到 `ctrl + 9`可以直接转到编号`1`...`9`的面板(`ctrl + 1` 转到元素面板，`ctrl + 4` 转到网络信息面板)，这组快捷键默认被禁用，可以通过 `DevTools`>>`Settings` >>`Preferences`>>`Appearance` 打开这个选项。

  ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/18/167c07cf4d56febf~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**递增/递减**

使用 `带有` 或者 `不带有修饰键` 的 `上` / `下` 箭头按键， 可以实现递增和递减 `0.1` ， `1` 或者 `10` 这样数值类型的值。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/18/167c07cf43b2f06e~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



**查找**

elements， logs， sources & network 中，每一个都支持 `[ctrl] + [f]` 快捷方式。

- 在 `Elements` 面板中 - 通过 `string` ，选择器 或者 `XPath` 来查找

- 而在 `Console`， `Network` 以及 `Source` 面板 - 通过区分大小写，或者可以被视为表达式的 `strings`， 来查找

  ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/22/168747e72320ff3a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**Command**

`Command` 菜单可以帮助快速找到那些被隐藏起来的功能。

- 在 `Chrome` 的调试打开的情况下 按下 [ `Ctrl]` + `[Shift]` + `[P]` (Mac： `[⌘]` + `[Shift]`+ `[P]` )

- 或者使用 `DevTools` 的 `dropdown` 按钮下的这个选项

  ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679a2adf8945253~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

  可供选择的命令列表，归为几个部分：
  ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679a2e13926d71b~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**截图**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679a37dbce34984~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



**切换面板布局**

将 `样式面板` 从 `html预览` 的底部移动到右边或者周围其他的位置

打开 `Commands` 菜单并且输入 `layout` ，你会看到 `2` 到 `3` 个可供选择的项(这里不再显示已经激活的选项)：

- 使用横向面板布局
- 使用纵向面板布局
- 使用自动面板布局

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679a4aa44c58106~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

<div class="se-99266477" data-code-language="python" data-slate-type="pre" data-slate-object="block" data-key="45"><div class="se-5bb00fd9 se-da36c9c9"><span></span></div><div class="se-6cfa8042"><div class="se-3203aec9 se-29a57a03" data-code-line-number="1"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="2"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="3"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="4"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="5"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="6"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="7"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="8"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="9"></div><div class="se-3203aec9 se-29a57a03" data-code-line-number="10"></div></div><div class="se-0d66d93e"><div data-simplebar="init"><div class="simplebar-wrapper" style="margin: 0px;"><div class="simplebar-height-auto-observer-wrapper"><div class="simplebar-height-auto-observer"></div></div><div class="simplebar-mask"><div class="simplebar-offset" style="right: 0px; bottom: 0px;"><div class="simplebar-content-wrapper" style="height: auto; overflow: scroll;"><div class="simplebar-content" style="padding: 0px;"><div data-origin="pm_code_preview"><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="46"><span data-slate-object="text" data-key="47"><span data-slate-leaf="true" data-offset-key="47:0" data-first-offset="true"><span class="hljs-keyword" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">from</span></span></span></span><span data-slate-object="text" data-key="48"><span data-slate-leaf="true" data-offset-key="48:0" data-first-offset="true"><span data-slate-string="true"> langchain.llms </span></span></span><span data-slate-object="text" data-key="49"><span data-slate-leaf="true" data-offset-key="49:0" data-first-offset="true"><span class="hljs-keyword" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">import</span></span></span></span><span data-slate-object="text" data-key="50"><span data-slate-leaf="true" data-offset-key="50:0" data-first-offset="true"><span data-slate-string="true"> OpenAIChat</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="51"><span data-slate-object="text" data-key="52"><span data-slate-leaf="true" data-offset-key="52:0" data-first-offset="true"><span class="hljs-keyword" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">from</span></span></span></span><span data-slate-object="text" data-key="53"><span data-slate-leaf="true" data-offset-key="53:0" data-first-offset="true"><span data-slate-string="true"> langchain.text_splitter </span></span></span><span data-slate-object="text" data-key="54"><span data-slate-leaf="true" data-offset-key="54:0" data-first-offset="true"><span class="hljs-keyword" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">import</span></span></span></span><span data-slate-object="text" data-key="55"><span data-slate-leaf="true" data-offset-key="55:0" data-first-offset="true"><span data-slate-string="true"> SpacyTextSplitter</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="56"><span data-slate-object="text" data-key="57"><span data-slate-leaf="true" data-offset-key="57:0" data-first-offset="true"><span class="hljs-keyword" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">from</span></span></span></span><span data-slate-object="text" data-key="58"><span data-slate-leaf="true" data-offset-key="58:0" data-first-offset="true"><span data-slate-string="true"> llama_index </span></span></span><span data-slate-object="text" data-key="59"><span data-slate-leaf="true" data-offset-key="59:0" data-first-offset="true"><span class="hljs-keyword" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">import</span></span></span></span><span data-slate-object="text" data-key="60"><span data-slate-leaf="true" data-offset-key="60:0" data-first-offset="true"><span data-slate-string="true"> GPTListIndex, LLMPredictor, SimpleDirectoryReader</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="61"></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="62"><span data-slate-object="text" data-key="63"><span data-slate-leaf="true" data-offset-key="63:0" data-first-offset="true"><span data-slate-string="true">documents = SimpleDirectoryReader(</span></span></span><span data-slate-object="text" data-key="64"><span data-slate-leaf="true" data-offset-key="64:0" data-first-offset="true"><span class="hljs-string" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">'./data/mr_fujino'</span></span></span></span><span data-slate-object="text" data-key="65"><span data-slate-leaf="true" data-offset-key="65:0" data-first-offset="true"><span data-slate-string="true">).load_data()</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="66"><span data-slate-object="text" data-key="67"><span data-slate-leaf="true" data-offset-key="67:0" data-first-offset="true"><span data-slate-string="true">llm_predictor = LLMPredictor(llm=OpenAIChat(temperature=</span></span></span><span data-slate-object="text" data-key="68"><span data-slate-leaf="true" data-offset-key="68:0" data-first-offset="true"><span class="hljs-number" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">0</span></span></span></span><span data-slate-object="text" data-key="69"><span data-slate-leaf="true" data-offset-key="69:0" data-first-offset="true"><span data-slate-string="true">, model_name=</span></span></span><span data-slate-object="text" data-key="70"><span data-slate-leaf="true" data-offset-key="70:0" data-first-offset="true"><span class="hljs-string" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">"gpt-3.5-turbo"</span></span></span></span><span data-slate-object="text" data-key="71"><span data-slate-leaf="true" data-offset-key="71:0" data-first-offset="true"><span data-slate-string="true">, max_tokens=</span></span></span><span data-slate-object="text" data-key="72"><span data-slate-leaf="true" data-offset-key="72:0" data-first-offset="true"><span class="hljs-number" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">1024</span></span></span></span><span data-slate-object="text" data-key="73"><span data-slate-leaf="true" data-offset-key="73:0" data-first-offset="true"><span data-slate-string="true">))</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="74"><span data-slate-object="text" data-key="75"><span data-slate-leaf="true" data-offset-key="75:0" data-first-offset="true"><span data-slate-string="true">list_index = GPTListIndex(documents, llm_predictor=llm_predictor, </span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="76"><span data-slate-object="text" data-key="77"><span data-slate-leaf="true" data-offset-key="77:0" data-first-offset="true"><span data-slate-string="true">                          text_splitter=SpacyTextSplitter(pipeline=</span></span></span><span data-slate-object="text" data-key="78"><span data-slate-leaf="true" data-offset-key="78:0" data-first-offset="true"><span class="hljs-string" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">"zh_core_web_sm"</span></span></span></span><span data-slate-object="text" data-key="79"><span data-slate-leaf="true" data-offset-key="79:0" data-first-offset="true"><span data-slate-string="true">, chunk_size = </span></span></span><span data-slate-object="text" data-key="80"><span data-slate-leaf="true" data-offset-key="80:0" data-first-offset="true"><span class="hljs-number" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">2048</span></span></span></span><span data-slate-object="text" data-key="81"><span data-slate-leaf="true" data-offset-key="81:0" data-first-offset="true"><span data-slate-string="true">))</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="82"><span data-slate-object="text" data-key="83"><span data-slate-leaf="true" data-offset-key="83:0" data-first-offset="true"><span data-slate-string="true">response = list_index.query(</span></span></span><span data-slate-object="text" data-key="84"><span data-slate-leaf="true" data-offset-key="84:0" data-first-offset="true"><span class="hljs-string" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">"下面鲁迅先生以第一人称‘我’写的内容，请你用中文总结一下:"</span></span></span></span><span data-slate-object="text" data-key="85"><span data-slate-leaf="true" data-offset-key="85:0" data-first-offset="true"><span data-slate-string="true">, response_mode=</span></span></span><span data-slate-object="text" data-key="86"><span data-slate-leaf="true" data-offset-key="86:0" data-first-offset="true"><span class="hljs-string" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">"tree_summarize"</span></span></span></span><span data-slate-object="text" data-key="87"><span data-slate-leaf="true" data-offset-key="87:0" data-first-offset="true"><span data-slate-string="true">)</span></span></span></div><div class="se-b8b36fe5 se-f3f578f6" data-slate-type="code-line" data-slate-object="block" data-key="88"><span data-slate-object="text" data-key="89"><span data-slate-leaf="true" data-offset-key="89:0" data-first-offset="true"><span class="hljs-built_in" data-slate-type="mark-class" data-slate-object="mark"><span data-slate-string="true">print</span></span></span></span><span data-slate-object="text" data-key="90"><span data-slate-leaf="true" data-offset-key="90:0" data-first-offset="true"><span data-slate-string="true">(response)</span></span></span></div></div></div></div></div></div><div class="simplebar-placeholder" style="width: auto; height: 201px;"></div></div><div class="simplebar-track simplebar-horizontal" style="visibility: visible;"><div class="simplebar-scrollbar" style="width: 538px; transform: translate3d(0px, 0px, 0px); display: block;"></div></div><div class="simplebar-track simplebar-vertical" style="visibility: visible;"><div class="simplebar-scrollbar" style="height: 221px; transform: translate3d(0px, 0px, 0px); display: block;"></div></div></div></div></div>

**切换主题**

在 `Commands` 菜单中寻找与 `theme` 相关的选项，实现 `明亮` & `暗黑` 两种主题之间的切换。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679a56481366d25~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**代码块复用**

对于一个脚本只是偶尔运行一下，记住一段这样的脚本会很麻烦。使用Snippets，存放 `JavaScript` 代码到 `DevTools` 中，方便复用这些 `JavaScript` 代码块。

进入到 `Sources` 面板，在导航栏里选中 `Snippets` 这栏，点击 `New snippet(新建一个代码块)` ，然后输入的代码之后保存，现在可以通过右击菜单或者快捷键： `[ctrl] + [enter]` 来运行它：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/29/167f5b6997643be2~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





在 `Chrome` 的 `Elements` 面板中， `$0` 是对我们当前选中的元素节点的引用。$1 是对上一次我们选择的节点的引用，`$2` 是对在那之前选择的节点的引用，等等。一直到 $4。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16785c75b56d3a80~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**$和 ?**

$: 如果没有在 `App` 中定义过 `$` 变量 (例如 `jQuery` )的话，它在 `console` 中就是对这一大串函数 `document.querySelector` 的别名。

?:它不仅执行 `document.querySelectorAll` 并且它返回的是：一个节点的 **数组** ，而不是一个 `Node list`,本质上来说 `Array.from(document.querySelectorAll('div')) === ?('div')`。





**`$_`**

调试的过程中，经常会通过打印查看一些变量的值，但如果想看一下上次执行的结果，可以不用再输入一次代码执行。直接使用`$_`,`$_` 是对上次执行的结果的 **引用** 。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16785d333e7c1d7f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**$i**

在 `Dev Tools` 里面来使用 `npm` 插件。有时只是想试一下新出的 `npm` 包，现在不用再大费周章去建一个项目测试了，只需要在 [Chrome插件:Console Importer](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fconsole-importer%2Fhgajpakhafplebkdljleajgbpdmplhie%2Frelated) 的帮助之下，快速的在 `console` 中引入和测试一些 `npm` 库。

运行 `$i('lodash')` 或者 `$i('moment') `几秒钟后，就可以获取到 `lodash / momentjs` 。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/16785da0dea963fb~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)







**console.log 的 "bug"**

当使用console.log来打印某个对象，并且两次打印之间，还会对这个对象进行修改，最后查看打印的结果发现，修改前的打印和修改后的打印，竟然是一样的。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/11/1679a0d3a708ef3e~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



可以看到，一共有两次打印，一次期望打印原始信息，一次期望打印修改后的信息，并且把属性 `a` 从 `0` 改成 `1` ，`name` 属性从 `Tomek` 改成 `Not Tomek`。但是都是打印修改后的结果。

原因：`console` 中打印出的对象，在你打印出他内容之前，是以引用的方式保存的。

为此应对方法：

- 打印一个从这个对象复制出来的对象。
- 使用资源面中的断点来调试
- 使用 `JSON.stringify()` 方法处理打印的结果









**异步console**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e0201c187733~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e020118e0846~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e0201c5c5fd7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



- `Storage` 系统的 **占用数** 和 **空闲数**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e02019dbfde7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





- 设备的 **电池信息**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e09d64ce9285~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



- **媒体能力**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e0201c6930dc~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- **Cache storage keys**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/12/1679e02015fb7bc3~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)





**条件断点**

有时设置的断点被执行了太多次，假设有一个包含 `200` 次的循环，但是只对第 `110` 次循环的结果感兴趣，又或者只对一些满足某些条件的结果感兴趣，这时就使用条件断点。



`Conditional breakpoints` 条件断点

- 右击行号，选择 `Add conditional breakpoint...(添加条件断点)`
- 或者右击一个已经设置的断点并且选择 `Edit breakpoint(编辑断点)`
- 然后输入一个执行结果为 `true` 或者 `false` 的表达式（它的值其实不需要完全为 `true` 或者 `false` 尽管那个弹出框的描述是这样说的）。
- 在这个表达式中你可以使用任何这段代码可以获取到的值（当前行的作用域）。

如果条件成立，这个断点就会暂停代码的执行：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/17/167b94b8f36112b7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)







![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/17/167b955a1f0311fc~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)







**自定义格式转换器**

`DevTools` 的 `console` 有默认的对 `object` 的转换格式，但有时候想用不同的方式来处理，那我们就可以自定义输出对象的函数，它通常被称为 `Custom Formatter` 。



























