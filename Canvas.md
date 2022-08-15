# Canvas

## APIS

`<canvas width='num1' height='num2'>文本区域写的内容在不支持canvas的浏览器中会被展示<canvas>`

注意点：canvas标签的宽高不能用过CSS来设置（因为通过css设置有拉伸变形）。 在通过js获取到canvas标签后设置宽高的方式是canvas.width = 'num',而不是canvas.style.width ='num'的方式



```
<canvas id='canvas' width='800' height='500'></canvas>
<script>
	let canvas = document.getElementById('canvas')  //获取canvas画布
	let ctx = canvas.getContext('2d')   //获取上下文（画笔）
</script>
```



```
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

![image-20210810210641575](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210810210641575.png)

```
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

![image-20210810210823568](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210810210823568.png)

```
ctx.lineWidth ='num'
ctx.strokeStyle = 'color'
ctx.stroke()
```

```
另一种画线方式：
let path = new Path2D()
path.moveTo(100,100)
path.lineTo(200,200)
ctx.stroke(path)
```



矩形：

```
ctx.beginPath()
ctx.rect(x,y,width,height)
ctx.stroke()
ctx.closePath() 

上面等价于下面一句：

ctx.fillRect(x,y,width,height)
```



弧形：

```
ctx.beginPath()
ctx.arc(x,y,r，startAngle,endAngle,clockDirection)
ctx.stroke()
ctx.closePath() 
```

```
for(leti=50;i<300;i+=20){
	ctx.beginPath()
	ctx.arc(200,200,i,2*Math.PI,true)
	ctx.closePath() 
	ctx.stroke()
}
```

![image-20210810214315993](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210810214315993.png)





图片：

`drawImage` 方法的第三个也是最后一个变种有8个新参数，用于控制做切片显示的

```
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
drawImage(image, dx,dy)  //图片对象上只放两个数字参数时，表示图片左上角开始于画布的什么位置，而不进行切片。
```

![image-20210810214630687](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210810214630687.png)

```
创建一个图片对象
let image = new Image()
image.src = 'url'  //一旦设置图片对象的src属性，那么图片资源请求将立即发出，注意是异步请求
image.onload = function(){
	ctx.drawImage(image,200,200)
}
```



## 基本的面向对象制作动画

所有绘制到canvas上的图形会立即别栅格化，无法通过js获取到。所以要移动图像，需要重新清除画布，再画一个新的图画。

```
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

```
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

在canvas动画中最常见的就是一个对象上有更新自己和渲染自己的原型方法。





## 图片裁剪



基于react，canvas做一个类似于微信头像的裁切和上传功能。

这个项目中图片的裁切是基于前端的canvas实现

- react创建组件
- 组件中使用jsx语法构建页面
- 属性和状态的管理
- canvas实现图片裁切
- html5拖拽

项目基于create-react-app创建项目框架
基于REM构建响应式页面，现在真实项目中响应式常用的方案有：

- @media
- rem
- flex


```
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
- 实现图片在canvas中的放大和缩小和移动
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

在react的jsx语法模块，定义在组件实例的原型上的非箭头函数形式的方法，被直接用在jsx中的DOM元素作为事件处理函数的时候，函数内部的this指向的并不是组件实例而是绑定该事件的DOM元素。例如：

```jsx
fun(){
    console.log(this)  //这时this代表的button元素
}
render(){
    return <button onClick={this.fun}></button>
}

<button onClick={this.fun.bind(this)}></button>   //手动绑定this为组件实例
```



初始化确定canvas画布的大小和内部裁剪层的大小和定位。

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

input type='file' 的表单控件的在change事件被触发时，上传的文件对象在该元素对象的files中，图片文件对象的格式如下：

![image-20210818214219101](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210818214219101.png) 





在通过FileReader将读出的图片通过canvas.drawImage(image,x,y,width,height)绘制到canvas画布上后，可能出现的情况是：图片的原始尺寸大于整个canvas画布的宽高，导致图片超出部分无法显示。

![image-20210818000850368](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210818000850368.png)

需要开发者做的处理：

根据当前图片的宽高和当前canvas元素的宽高大小，让图片在canvas中完全显示。如果当前图片的width / height 大于1，则保证图片的宽要和canvas的宽一样大。所以宽缩小的比例是： canvas.width / image.width 。 为了保证图片的高也等比缩放，所以图片的高等于： image.height *  canvas.width / image.width。如果width / height 小于1 ，则用高度。

处理过后的图片情况：

![image-20210818221631779](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210818221631779.png)

在处理的图片在canvas中的位置后的表现情况：

![image-20210818222012698](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210818222012698.png)





图片拖动：

具体流程，当开始按下是，先记录按下时的坐标位置（相对于画布的位置）

当移动的时候不断获取最新鼠标位置，减去之前初始的位置得出偏移量，

然后再重新根据最新图标绘制图形。

```jsx
<canvas className='canvas' 
    width = {w}
    height = {h}
    ref={t=>this._canvas=t}
    onTouchStart = {
        ev=>{ //手指事件对象中可能记录多个手指的位置信息，在这里只取第一个
            let point = ev.changeTouches[0]
            this.startX = point.clientX
            this.startY = point.clientY
        }
    }
    onTouchMove = {
        ev=>{
            let point = ev.changeTouches[0]
            let moveX = point.clientX - this.startX
            	moveY = point.clientY - this.startY
            //在实际项目中的时候还需要判断用户是否是真的需要移动图片，而不是因为误触导致的行为
            if(Math.abs(moveX)>10||Math.abs(moveY)>10){
                this.imageTop += moveY
                this.imageLeft += moveX
                this.drawImage()  
            }
            //如果只处理到上面的情况的话，移动图片会导致图片快速的移动并离开视野范围，这是因为moveX/Y在每次移动时都是以onTouchStart事件中确定的startX/Y为初始位置，这就导致moveY/X不断变大，导致图片每次的偏移量就越来越大。所以要更新一下每次移动后的新坐标
            this.startX = point.clientX
            this.startY = point.clientY
        }
    }
></canvas>	
```

![image-20210818225230686](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210818225230686.png)





保存图片的操作：

裁剪图片，先将mask框部分选中的数据读取出来，使用canvas中getImageDate(x,y,width,height)

```jsx
 <button className='submit' onClick={
 	ev=>{
        if(!this.img) return 
        let iamgesData = this.ctx.getImageDate(maskLeft,maskTop,maskWidth,maskHeight)
        //上面的图片数据不能直接就交给img的src属性，而要变为图片
        let temCanvas = document.createElement('canvas'),
            temCtx = temCanvas.getContext('2d')
        temCanvas.width = maskWidth
        temCanvas.height = maskHeight
        temCtx.putImageData(iamgesData,0,0,0,0,maskWidth,maskHeight)
        //某个需要展示切后图片的img元素
        img.src = temCanvas.toDataURL('image/png')
    }
 }>保存图片</button>
```

