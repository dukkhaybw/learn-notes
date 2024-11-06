# 基于 Vue 的 Excel 表格上传解析和导出

项目效果：

- 将表格中选中的数据以 excel 表格的方式导出
- 本地 excel 表格上传到服务器
- 数据采集
- 数据上传到服务器
- 列表展示
- 分页处理
- 搜索

项目依赖：

- @vue/cli

- less less-loader

- axios qs

- element-ui

- vue-router

- xlsx

基于 vue 脚手架生成的 vue 项目的 public 文件目录中可能会存放和引入到 index.html 页面的资源有：

- 公共 CSS
- 不支持模块化语法的 JS 库
- 处理移动端白屏效果。进入页面先展示 loading，然后再展示页面

Element-ui 中的上传组件——Upload 组件默认情况下选中一个文件就会把该文件上传到服务器端。服务器对应的地址由 action 属性指定。

要实现的效果是选择一个 Excel 文件，将文件中的数据显示到页面就可以。选择文件后进行本地解析，只是将解析后的数据传递给服务器。

在 upload 组件中标签属性上有一个 auto-upload 表示是否在选取文件后立即上传。

设置自己的上传需要定义属性 http-request，它会覆盖默认的上传行为，可以自定义上传的实现。

对于上传大文件，需要将文件进行切片化管理，切完后把文件的断点续传到服务器，由服务器进行合并。

对于上传组件，它有一个 on-change 事件，每次选择上传文件，上传成功或者失败都会触发该事件。在该事件对应的事件处理函数的事件对象中可以获取到选择的文件对象(event.raw)

在拿到文件对象后，要读取文件对象中的内容数据，使用 js 或者 H5 中新增加的 FileReader 函数。

```js
//将文件数据按照二进制进行读取
function readFile(file) {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file); //二进制格式读取
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
  });
}
```

注：一般想把文件通过断点续传的方式传给服务器，用 base64 格式读取。如果想在本地读取解析文件中的数据，一般采用二进制方式读取。

在拿到 FileReader 读取的文件数据后， 对数据进行解析。将二进制或者 base64 数据再解析为我们想要的数据格式。

excel 表格解析包——xlsx

```js
let workbook = xlsx.read(data,{type:'binary'}),
	worksheet = workbook.Sheets[work.SheetNames[0]]
data = xlsx.utils.sheet_to_json(worksheet)    //excel表格数据变为json格式
//data是一个数组，数组中每一项是一个对象，对象中有几个属性是由表格有多少列表头决定的，并且表头的值将作为对象的属性名，所以如果表头是中文的话，对象的属性名也是中文。但是在传给服务器时属性名中不应该出现中文。所以还需要处理。

let arr =[]
data.forEach(item=>{
	let obj = {}
	for(let key in character){
		if(!character.hasOwnProperty(key)) break;
		let v = character[key],
			text = v.text,
            type = v.type;
        let value = item[text] || ''
        type ==='string'? value=String(value):null
        type ==='number'? value=Number(value):null
        obj[key] =value || ''
	}
})

```

workbook 的数据格式：

![image-20210808204615381](..\typora-user-images\image-20210808204615381.png)

SheetNames：表示一个 excel 文件中的多个多个子表。

![image-20210808204737033](..\typora-user-images\image-20210808204737033.png)

Sheets：每个子表中的具体信息

![image-20210808204819288](..\typora-user-images\image-20210808204819288.png)

每个子表的基本结构：

![image-20210808204937366](..\typora-user-images\image-20210808204937366.png)

!ref:数据开始和结束对应的单元格

![image-20210808205037833](..\typora-user-images\image-20210808205037833.png)

![image-20210808205053652](..\typora-user-images\image-20210808205053652.png)

!margins:表示页码信息。

!merges:表示当前表格中的单元格合并情况

xlsx.utils.sheet_to_json(worksheet)方法转为 json 格式的数据：

![image-20210808210714274](..\typora-user-images\image-20210808210714274.png)
