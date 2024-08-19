# Canvas

基本使用

1. 创建canvas元素
2. 获取canvas上下文对象
3. 使用上下文对象上的api画图



可以事先在html中准备canvasDOM，也可以通过JavaScript动态创建并插入。canvas默认的大小是300乘以150的大小。

```html
<canvas height='300' width='400' id='canvas'></canvas>
```



## APIS

`<canvas width='num1' height='num2'>文本区域写的内容在不支持canvas的浏览器中会被展示<canvas>`

注意点：canvas 标签的宽高不能通过 CSS 来设置（因为通过 css 设置有拉伸变形）。 在通过 js 获取到 canvas 标签后设置宽高的方式是 canvas.width = 'num'，而不是 canvas.style.width ='num'的方式

```html
<canvas id='canvas' width='800' height='500'></canvas>
<script>
	let canvas = document.getElementById('canvas')  //获取canvas画布
	let ctx = canvas.getContext('2d')   //获取上下文（画笔）
</script>
```



### 线段

```js
ctx.beginPath()

ctx.moveTo(100,100)
ctx.lineTo(200,200)
ctx.lineTo(260,130)
ctx.lineTo(400,400)
ctx.lineTo(600,10)
ctx.stroke()

ctx.closePath() //将开始点到结束点的路径连接闭合
```

先描边再闭合路径如下图：

![image-20210810210641575](..\typora-user-images\image-20210810210641575.png)

```js
ctx.beginPath()

ctx.moveTo(100,100)
ctx.lineTo(200,200)
ctx.lineTo(260,130)
ctx.lineTo(400,400)
ctx.lineTo(600,10)

ctx.closePath() //结束画的动作，将开始点到结束点的路径连接闭合
ctx.stroke()
```

先闭合再描边如下图：

![image-20210810210823568](..\typora-user-images\image-20210810210823568.png)

```js
ctx.lineWidth ='num'
ctx.strokeStyle = 'color'
ctx.stroke()
```



### Path2D

比如项目中有很多相同的重复的图形需要画，如果每次都一个个的写路径再绘制，那么就会有大量相同的路径代码。为此，可以使用path2D来封装一个固定的路径，其他任何地方要使用，直接取用即可。

使用： 

```js
let linePath = new Path2D()
linePath.moveTo(100,100)
linePath.lineTo(200,200)
ctx.stroke(linePath)


let heartPath = new Path2D()
heartPath.moveTo(300,200)
heartPath.bezierCurveTo(250, 150, 400, 200, 300, 200)
heartPath.bezierCurveTo(200, 200, 250, 150, 300, 200)
ctx.stroke(heartPath)
ctx.fill(heartPath)   // 这会独立填充heartPath
```



### 矩形

```js
ctx.beginPath()
ctx.rect(x,y,width,height)  // 绘制路径，但是不填充也不描边
ctx.stroke()  // 或者 ctx.fill()
ctx.closePath()

// 上面等价于下面一句：
ctx.fillRect(x,y,width,height)  // 绘制矩形并填充


ctx.strokeReact(x,y,width,height) // 绘制一个非填充的矩形 
```



### 擦除

```js
ctx.clearRect(x,y,width,height) // 清除画布上的指定位置和宽高矩形中的内容，一般用于清除整个画布

let height = 0 
const tId = setInterval(()=>{
  ctx.clearReact(0,height,画布宽度,height) 
  height++
  if(height>画布高度){
		clearInterval(tId)
  }
},10)
```



### 弧形

[`arc(x, y, radius, startAngle, endAngle, anticlockwise)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc)

```js
ctx.beginPath()
ctx.arc(x,y,r，startAngle,endAngle[,clockDirection])  // 弧度制的角度, 默认顺时针开始画, 即false
ctx.stroke()
ctx.closePath()
```



```js
for(leti=50;i<300;i+=20){
	ctx.beginPath()
	ctx.arc(200,200,i,2*Math.PI,true)
  ctx.stroke()
	ctx.closePath()
}
```

![image-20210810214315993](..\typora-user-images\image-20210810214315993.png)

默认是顺时针画圆弧（clockDirection默认值是false）



[`arcTo(x1, y1, x2, y2, radius)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arcTo)

arcTo方法根据三个点，其中起始点和acrTo的前两个传参组成的坐标点连线形成一条辅助线，acrTo的方法的前两个参数和后两个参数分别构成的点之间连线成一条辅助线，然后arcTo的最后一个参数用于确定画的圆形与这俩条辅助线相切的圆，两个切点之间的那部分圆弧就是最后的结果。

```js
ctx.moveTo(300,200)  // 起点位置
ctx.arcTo(300,250,250,250,25)   // 另外两个点和圆弧的半径大小
ctx.stroke()
```

![image-20240408223801438](D:\learn-notes\images\image-20240408223801438.png)



### 贝塞尔曲线

```
ctx.moveTo(x,y)
ctx.quadraticCurveTo(x1,y1,x2,y2)
```



### 颜色

```js
ctx.fillStyle = '#ccc'

ctx.strokeStyle = 'red'   // 也可以设置为grba()


ctx.globalAlpha = 0.5  // 设置全局透明度，包括路径和填充的透明度
```



### 渐变

线性渐变

```js
const linearGradient = ctx.createLinearGradient(x1, y1, x2, y2)
linearGradient.addColoStop(1, color1)
linearGradient.addColoStop(0~1, color3)
linearGradient.addColoStop(1, color2)
ctx.fillStyle = linearGradient()
ctx.fillRect(x1, y1, x2, y2)


const betweenPosition = 0
const timerId = setInterval(()=>{
  ctx.clearRect(0,0,canvasDom.width,canvasDom.height)
  
  linearGradient.addColoStop(0, color1)
  linearGradient.addColoStop(betweenPosition, color3)
  linearGradient.addColoStop(1, color2)
  ctx.fillStyle = linearGradient()
  ctx.fillRect(x1, y1, x2, y2)
  betweenPosition += 0.01
  
  if(betweenPosition >= 1){
    clearInterval(timerId)
  }
},16)
```

![image-20240725215934680](images\image-20240725215934680.png)



### patterns

填充图案(或者另一个canvas对象)而不是一个具体的颜色或者渐变。可以用于实现印章的功能。

```js
const img = new Image()
img.src = "url"

img.onload = function (){
  const imgPattern = ctx.createPattern(img, 'no-repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 600, 400)
}
```





### 线条样式

线条的粗细，风格（虚线） 等。

```js
ctx.lineWidth = number

ctx.lineCap = 'butt' | 'round' | 'square'

ctx.lineJoin = 'mitter' | 'round' | 'bevel'

ctx.setLineDash([10, 5])
ctx.lineDashOffset = 10  // 可以做线段移动的动画
```





### 阴影

```js
ctx.shadowOffsetX = number
ctx.shadowOffsetY = number
ctx.shadowBlur = number
ctx.shadowColor = color
```





### 图像

绘制图片的话，需要先等图片加载完毕才可以。

`drawImage` 方法的第三个也是最后一个变种有 8 个新参数，用于控制做切片显示的

```js
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
drawImage(image, dx, dy, dWidth, dHeight)   // 将在一整张图片进行按比例缩放后，绘制到指定的canvas的位置
drawImage(image, dx,dy)  //图片对象上只放两个数字参数时，表示图片左上角开始于画布的什么位置，而不进行切片。
```

<img src="..\typora-user-images\image-20210810214630687.png" alt="image-20210810214630687" style="zoom:200%;" />

```js
// 创建一个图片对象
let image = new Image()
image.src = 'url'  //一旦设置图片对象的src属性，那么图片资源请求将立即发出，注意是异步请求
image.onload = function(){
	ctx.drawImage(image,200,200)
}
```





### 视频

可以给视频进行添加水印。

```js
btn.onclick = function(){
  video.play()
  render()
}

let img = new Image()
img.src = 'url'

function render(){
  ctx.drawImages(video,0,0,canvaWidth,canvasHeight)
  ctx.drawImages(img,dx,dy,dWidth, dHeight)
  requestAnimationFrame(render)
}
```



### 文字

```js
ctx.font = 'numberpx  fontFamily'
ctx.fillText('text', x ,y, maxWidth)   // 在指定的 (x, y) 位置填充指定的文本，绘制的最大宽度是可选的，

ctx.strokeText('text', x ,y, maxWidth)  // 在指定的 (x,y) 位置绘制文本边框，绘制的最大宽度是可选的。
```

文字的位置如何放置：

```js
// 文本水平对象
ctx.textAlign = 'center' | 'end' | 'start'(默认) | 'left' | 'right'

// 文本基线对齐
ctx.textBaseline = 'middle' | 'top' | 'bottom' | 'alphabetic'

// 文本的书写方向
ctx.direction = 'rtl' | 'ltr'

// 预测量文本的宽度,如下这张图就是获取到的信息
let data = ctx.measureText('文本内容')
```

<img src="D:\learn-notes\前端可视化\images\image-20240726224656999.png" alt="image-20240726224656999" style="zoom:150%;" />



### 移动

移动的是整个canvas原点的位置和相应的坐标系（初始是（0，0））

```js
ctx.translate(x,y)
```



### 缩放

缩放的也是x轴或者y轴的坐标系

```js
ctx.scale(xNumber,yNumber)
```



### 旋转

旋转的也是坐标系

```js
ctx.totate(Math.PI)
```



### 矩阵缩放、平移与旋转

```js
ctx.transform(a,b,c,d,e,f)
```



### 合成

globalCompositeOperation 属性设置如何将一个源（新的）图像绘制到目标（已有）的图像上。

- 源图像 = 打算放置到画布上的绘图。
- 目标图像 = 已经放置在画布上的绘图。

这个属性用来设置要在绘制新形状时应用的合成操作的类型，比如在一个蓝色的矩形上画一个红色的圆形，是红色在上显示，还是蓝色在上显示，重叠的部分显示还是不显示，不重叠的部分又怎么显示，等一些情况。

在取默认值的情况下，都是显示的，新画的图形会覆盖原来的图形。

在canvas中，先画一个图形后再画一个图形时，如果位置有重叠得地方，那么后画得图形会覆盖掉先画得图形。如果不是单纯想要实现这种效果，想要采用其他的图层的合成方式。那么可以自己设置图层的合成方式。

可以在已有图形位置后面画新的图形，也可以遮盖已有图形，还可以镂空已有图形的特定位置（做类似橡皮擦的功能，刮刮卡效果）等。

globalCompositeOeration用于设置在新绘制的图形时采用怎样的遮盖策略。

```js
ctx.globalCompositeOperation = 'source-over'(默认)  
```



用法： 

表格中的蓝色矩形为目标图像，红色圆形为源图像。

| 属性值           | 描述                                                         | 效果                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| source-over      | 默认。在目标图像上显示源图像。                               | ![img](https://segmentfault.com/img/remote/1460000022781545) |
| source-atop      | 在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。 | ![img](https://segmentfault.com/img/remote/1460000022781546) |
| source-in        | 在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的。 | ![img](https://segmentfault.com/img/remote/1460000022781547) |
| source-out       | 在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的。 | ![img](https://segmentfault.com/img/remote/1460000022781548) |
| destination-over | 在源图像上方显示目标图像。                                   | ![img](https://segmentfault.com/img/remote/1460000022781549) |
| destination-atop | 在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示。 | ![img](https://segmentfault.com/img/remote/1460000022781551) |
| destination-in   | 在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的。 | ![img](https://segmentfault.com/img/remote/1460000022781550) |
| destination-out  | 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。 | ![img](https://segmentfault.com/img/remote/1460000022781552) |
| lighter          | 显示源图像 + 目标图像。                                      | ![img](https://segmentfault.com/img/remote/1460000022781553) |
| copy             | 显示源图像。忽略目标图像。                                   | ![img](https://segmentfault.com/img/remote/1460000022781556) |
| xor              | 使用异或操作对源图像与目标图像进行组合。                     | ![img](https://segmentfault.com/img/remote/1460000022781554) |

参考文章：https://segmentfault.com/a/1190000016214908



### 裁剪

想根据自己绘制的路径去在绘制的路径内部展示内容就可以使用裁剪。

```js
ctx.clip([Path2D对象])
```



### 状态保存与恢复

save 和 restore 方法是用来保存和恢复 canvas 状态的，都没有参数。Canvas 的状态就是当前画面应用的所有样式和变形的一个快照。
Canvas 状态存储在栈中，每当save()方法被调用后，当前的状态就被推送到栈中保存。一个绘画状态包括：

- 当前应用的变形(即移动，旋转和缩放)
- 以及下面这些属性:strokeStyle, fillstyle, globalAlpha, lineWidth, lineCap, lineJoin, miterlimit,lineDashOffset, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor,globalCompositeOperation, font, textAlign, textBaseline, direction, imageSmoothingEnabled
- 当前的裁切路径(clipping path)



### 像素操作

深入了解 Canvas 画布真实像素的原理，事实上，可以直接通过 lmageData 对象操纵像素数据，直接读取或将数据数组写入该对象中。深入了解如何控制图像使其平滑(反锯齿)以及如何从 Canvas 画布中保存图像。

ImageData对象中存储着 canvas 对象真实的像素数据，它包含以下几个只读属性:

- width：图片宽度，单位是像素
- height：图片高度，单位是像素
- data：Uint8ClampedArray 类型的一维数组，包含着 RGBA 格式的整型数据，范围在0至 255 之间(包括255)

data 属性返回一个 Uint8ClampedArray，它可以被使用作为查看初始像素数据。每个像素用4个 1bytes值 (按照红，绿，蓝和透明值的顺序，这就是”RGBA”格式)来代表。每个颜色值部份用0至 255 来代表。每个部份被分配到一个在数组内连续的索引，左上角像素的红色部份在数组的索引0位置。像素从左到右被处理，然后往下，遍历整个数组，Uint8ClampedArray 包含高度 x 宽度 x 4bytes 数据，索引值从0到(高度 x 宽度 x4)-1例如，要读取图片中位于第 50 行，第 200 列的像素的蓝色部份，会写以下代码:

```js
const blueComponent = imagesData.data[((50 * imagesData.width *4))+(200 * 4)+2]
```

根据行、列读取某像素点的 R/G/B/A 值的公式：

```js
imageData.data[((50*(imageData.width*4))+(200*4))+ 0/1/2/3];
```

可能用会使用 Uint8ClampedArray.length 属性来读取像素数组的大小(以bytes 为单位)：

```js
var numBytesimageData.data.length;
```





**创建ImageData 对象**

创建一个新的，空白的lmageData对象，你应该会使用createlmageData0方法。有2个版本的createlmageData(方法。

```js
var myImageDatactx.createImageData(width,height);
```

上面代码创建了一个新的具体特定尺寸的ImageData对象。所有像素被预设为透明黑。

也可以创建一个被 anotherlmageData对象指定的相同像素的ImageData对象。这个新的对象像素全部被预设为透明黑。这个并非复制了图片数据。

```js
var myImageData= ctx.createImageData(anatherImageData);
```





**得到场景像素数据**

为了获得一个包含画布场景像素数据的lmageData对像，你可以用 getlmageData0 方法:

```js
var myImageData= ctx.getImageData(left, top, width, height);
```

这个方法会返回一个|mageData对象，它代表了画布区域的对象数据，此画布的四个角落分别表示为(left, top), (left + width, top), (left, top + height), 以及(left + width, top + height) 四个点。这些坐标点被设定为画布坐标空间元素。

```js
let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight)

for(let i = 0; i<imageData.data.length; i+=4){
  imageData.data[i] = number
  imageData.data[i+1] = number1
  imageData.data[i+2] = number2
  imageData.data[i+3] = number2
}

ctx.putImageData(imageData,0,0)
```





### 图形选择-isPointInPath(x,y)

isPointInPath(x,y) 是canvas 2d中的内置方法，它可以判断一个点位是否在路径中。
isPointInPath(x,y) 面向的对象是路径，所以对文字、fillRect()、strokeRect()不好使。
路径的基本概念：
在使用canvas 的getContext('2d') 方法获取canvas 上下文对象ctx 的时候， ctx上便挂载了一个空的路径集合。
在ctx.beginPath() 之后，所绘制的所有路径都会被添加到这个路径集合里，isPointInPath(x,y) 方法判断的就是x、y 点是否在这个路径集合的所有路径里。这个路径可以不用画出来，只要路径集合里有路径即可。
注意，在下一次ctx.beginPath() 时，路径集合会被置空。











## 基本的面向对象制作动画

所有绘制到 canvas 上的图形会立即别栅格化，无法通过 js 获取到。所以要移动图像，需要重新清除画布，再画一个新的图画。

```html
<canvas id='canvas' width='800' height='500'></canvas>
<script>
	let canvas = document.getElementById('canvas')
	let ctx = canvas.getContext('2d')
	let x = 100
	setInterval(()=>{
		x+=5
		ctx.clearRect(0,0,canvas.width,canvas.height) //先清除画布
		ctx.beginPath()
		ctx.arc(x,100,50,0,2*Math.PI,false)
		ctx.fill()
		ctx.closePath()
	},16)
</script>
```

面向对象的本质就是对象实例自己管好自己的属性。

```js
<canvas id='canvas' width='800' height='500'></canvas>
<script>
	let canvas = document.getElementById('canvas')
	let ctx = canvas.getContext('2d')
	function Ball(x,y,r,color,speed){
		this.x = x;
		this.y = y;
		this.r = r
		this.color = color
		this.speed = speed
	}
	Ball.prototype = {
		render:function(){
			ctx.beginPath()
			ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
			ctx.fillStyle = this.color
			ctx.fill()
		}
		update:function(){
			this.x += this.speed
		}
	}
	let b1 = new Ball(100,100,50,'pink',1)
	let b2 = new Ball(100,300,100,'skyblue',2)

	setInterval(()=>{
		ctx.clearRect(0,0,canvas.width,canvas.height)
		b1.update()
		b1.render()
		b2.update()
		b3.render()
	},16)
</script>
```

在 canvas 动画中最常见的就是一个对象上有更新自己和渲染自己的原型方法。





## 图片裁剪

基于 react，canvas 做一个类似于微信头像的裁切和上传功能。

这个项目中图片的裁切是基于前端的 canvas 实现

- react 创建组件
- 组件中使用 jsx 语法构建页面
- 属性和状态的管理
- canvas 实现图片裁切
- html5 拖拽

项目基于 create-react-app 创建项目框架基于 REM 构建响应式页面，现在真实项目中响应式常用的方案有：

- @media
- rem
- flex

```html
<script>
	//计算rem
    ~function(){
        let event = 'onorientationchange' in window ? 'onorientationchange' :'resize'
        let computed =()=>{
            let HTML = document.documentElement,
                deviceW = HTML.clientWidth,
                designW = 750,
                ratios = deviceW/designW
            if(deviceW >=designW) ratio =100
            HTML.style.fontSize = ratios +'px'
            window.ratio = ratios
        }
        computed()
        window.addEventListener(event,computed)
    }()
</script>

判断是否存在移动端的横屏竖屏事件，有则用，无则用resize事件代替
```

项目的开发流程：

- 点击头像区域实现头像裁剪组件的显示，当点击返回或者保存图片时，实现头像裁剪组件的隐藏，总结就是两个区域的分别显示与隐藏
- 在头像裁剪组件中，首先要在点击选择图片后实现图片的读取与预览在绘制区域（canvas）
- 实现图片在 canvas 中的放大和缩小和移动
- 保存图片是把选中部分的图片进行裁剪
- 保存后将裁剪的图像回显到头像区域，在真实项目中可能需要先把裁剪好的图片传给服务器，服务器存好后，再返回头像页面去获取存在服务器中的头像信息

```jsx
图片裁剪部分html
render(){
    return (
        <div className='clipBox'>
            <div className='canvasBoxDiv'>
                <canvas className='canvas'></canvas>
                <div className='mask'></div>
            </div>

			<div className='btnBox'>
                <input type='file' accept='image/*' className='file'></input>
                <button className='choose'>选择图片</button>
                <button>方法</button>
                <button>缩小</button>
                <button className='submit'>保存图片</button>
            </div>

        </div>

    )
}
```

注意点：

在 react 的 jsx 语法模块，定义在组件实例的原型上的非箭头函数形式的方法，被直接用在 jsx 中的 DOM 元素作为事件处理函数的时候，函数内部的 this 指向的并不是组件实例而是绑定该事件的 DOM 元素。例如：

```jsx
fun(){
    console.log(this)  //这时this代表的button元素
}
render(){
    return <button onClick={this.fun}></button>
}

<button onClick={this.fun.bind(this)}></button>   //手动绑定this为组件实例
```

初始化确定 canvas 画布的大小和内部裁剪层的大小和定位。

```jsx
class imageClip extends Component{
    constructor(props){
        super(props)
        let winW = document.documentElement.clientWidth,
            ratio = window.ratio //html的字体大小，因为前面采用的是响应式rem布局
        let w = winW -0.4*ratio,   //被用作canvas的宽度
            h = w, //被用作canvas的高度
            maskW = 0.7*w,  //遮罩层的高度
            maskH = maskW,  //遮罩层的宽度
            maskLeft = (w- maskW)/2,  //遮罩层的left
            maskTop = (h-maskH)/2 //遮罩层的top
        this.state = {
            w,h,maskW,maskH,maskLeft,maskTop,
            maskShow:false
        }
    }

    inputFileChange=()=>{
        this.setState({maskShow:true})
        //获取文件对象
        let file = this._file.files[0]
        if(!file)return
        //使用内置对象读取文件对象以转为base64的格式，读取的结果存放在reader的result属性上。
        let reader = new FileReader()
        reader.readAsDateURL(file)
        reader.onload = () => {
            this.img = new Image()
            this.img.src = reader.result
            this.img.onload = () => {
                //将读取的结果交给canvas进行绘制，但是如果不处理图片的大小，可能导致canvas不能完全展示完整的图片
                let ratioWH = 1,
                    {w,h} =this.state  //w,h 是canvas的宽和高
                this.imageTruthWidth = this.img.width
                this.imageTruthHeight = this.img.height
                this.imageWidth = this.img.width
                this.imageHeight = this.img.height
                //图片的宽大于高 或者图片的宽小于高的情况都叫图片进行压缩或者拉伸
                if(this.imageWidth>this.imageHeight){
                    ratioWH = this.imageWidth / w
                    this.imageWidth = w
                    this.imageHeight = h / ratioWH
                }else{
                    ratioWH = this.imageHeight / h
                    this.imageHeight = h
                    this.imageWidth = w / ratioWH
                }
                //图片的left和top值，用以实现在canvas中水平和垂直居中
                this.imageLeft = (w - this.imageWidth)/2
                this.imageTop = (h -this.imageHeight)/2
                this.drawImage()
            }
        }
    }

    drawImage = ()=>{
        let {w,h} =this.state
        this.ctx = this._canvas.getContext('2d')
        this.ctx.clearReact(0,0,w,h)  //清除画布内容
        this.ctx.drawImage(this.img,this.imageLeft,this.imageTop, this.imageWidth ,this.imageHeight)
    }

    render(){
        let { w,h,maskW,maskH,maskLeft,maskTop,maskShow} = this.state
        return (
            <div className='clipBox'>
                <div className='canvasBoxDiv'>
                    <canvas className='canvas'
                    	width = {w}
                        height = {h}
                        ref={t=>this._canvas=t}
                    ></canvas>
                    <div className='mask' style={{
                            display:maskShow?'black':'none',
                            width:maskW + 'px',
                            height:maskH +'px',
                            top:maskTop +'px',
                            left:maskLeft+'px'
                        }}></div>
                </div>

                <div className='btnBox'>
                    <input type='file' accept='image/*' className='file' ref={
                            x=>{this._file=x}}
                        	onChange={this.inputFileChange}
                        ></input>
                    <button className='choose' onClick={()=>{
                            this._file.click()
                        }}>选择图片</button>
                    <button onClick={
                            ()=>{
                                if(this.img){
                                    this.imageWidth +=10
                                    this.imageHeight +=10
                                    this.drawImage()
                                }
                            }
                        } >放大</button>
                    <button onClick={
                            ()=>{
                                if(this.img){
                                    this.imageWidth -=10
                                    this.imageHeight -=10
                                    this.drawImage()
                                }
                            }
                        }>缩小</button>
                    <button className='submit' onClick={}>保存图片</button>
                </div>
            </div>
        )
    }

}
```

input type='file' 的表单控件的在 change 事件被触发时，上传的文件对象在该元素对象的 files 中，图片文件对象的格式如下：

![image-20210818214219101](..\typora-user-images\image-20210818214219101.png)

在通过 FileReader 将读出的图片通过 canvas.drawImage(image,x,y,width,height)绘制到 canvas 画布上后，可能出现的情况是：图片的原始尺寸大于整个 canvas 画布的宽高，导致图片超出部分无法显示。

![image-20210818000850368](..\typora-user-images\image-20210818000850368.png)

需要开发者做的处理：

根据当前图片的宽高和当前 canvas 元素的宽高大小，让图片在 canvas 中完全显示。如果当前图片的 width / height 大于 1，则保证图片的宽要和 canvas 的宽一样大。所以宽缩小的比例是： canvas.width / image.width 。 为了保证图片的高也等比缩放，所以图片的高等于： image.height \* canvas.width / image.width。如果 width / height 小于 1 ，则用高度。

处理过后的图片情况：

![image-20210818221631779](..\typora-user-images\image-20210818221631779.png)

在处理的图片在 canvas 中的位置后的表现情况：

![image-20210818222012698](..\typora-user-images\image-20210818222012698.png)

图片拖动：

具体流程，当开始按下是，先记录按下时的坐标位置（相对于画布的位置）

当移动的时候不断获取最新鼠标位置，减去之前初始的位置得出偏移量，

然后再重新根据最新图标绘制图形。

```jsx
<canvas
  className='canvas'
  width={w}
  height={h}
  ref={(t) => (this._canvas = t)}
  onTouchStart={(ev) => {
    //手指事件对象中可能记录多个手指的位置信息，在这里只取第一个
    let point = ev.changeTouches[0];
    this.startX = point.clientX;
    this.startY = point.clientY;
  }}
  onTouchMove={(ev) => {
    let point = ev.changeTouches[0];
    let moveX = point.clientX - this.startX;
    moveY = point.clientY - this.startY;
    //在实际项目中的时候还需要判断用户是否是真的需要移动图片，而不是因为误触导致的行为
    if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10) {
      this.imageTop += moveY;
      this.imageLeft += moveX;
      this.drawImage();
    }
    //如果只处理到上面的情况的话，移动图片会导致图片快速的移动并离开视野范围，这是因为moveX/Y在每次移动时都是以onTouchStart事件中确定的startX/Y为初始位置，这就导致moveY/X不断变大，导致图片每次的偏移量就越来越大。所以要更新一下每次移动后的新坐标
    this.startX = point.clientX;
    this.startY = point.clientY;
  }}
></canvas>
```

![image-20210818225230686](.\typora-user-images\image-20210818225230686.png)

保存图片的操作：

裁剪图片，先将 mask 框部分选中的数据读取出来，使用 canvas 中 getImageDate(x,y,width,height)

```jsx
<button
  className='submit'
  onClick={(ev) => {
    if (!this.img) return;
    let iamgesData = this.ctx.getImageDate(maskLeft, maskTop, maskWidth, maskHeight);
    //上面的图片数据不能直接就交给img的src属性，而要变为图片
    let temCanvas = document.createElement('canvas'),
      temCtx = temCanvas.getContext('2d');
    temCanvas.width = maskWidth;
    temCanvas.height = maskHeight;
    temCtx.putImageData(iamgesData, 0, 0, 0, 0, maskWidth, maskHeight);
    //某个需要展示切后图片的img元素
    img.src = temCanvas.toDataURL('image/png');
  }}
>
  保存图片
</button>
```







### PixiJS

JavaScript图形库。用于开发交互式的图形，游戏应用的库。可以用于开发设计稿，海报和各种酷炫的效果。它底层是基于WebGl技术的，使用webgl渲染图形，具有良好的性能和效率。







