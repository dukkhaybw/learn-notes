# DOM变化的检测

## 总览

1. Object.defineProperty
2. Mutation events
3. MutationObserver
4. 自定义元素生命周期
5. CSS3 animation



## Object.defineProperty

代码示例：

这个代码示例为整个页面的所有div元素设置一个rows属性，并给该属性设置了getter和setter函数。

```js
Object.defineProperty(HTMLDivElement,'rows'，{
	configurable:true,
	writeable:true,
	enumerable:true,
	get(){
    	return this.getAttribute('rows')
	},
	set(value){
     	if(this.getAttribute('rows')!===value){
            this.setAttribute('rows',value)
        }
    }
})
```

优点：该方法的兼容性好。

不足：只支持对象自身属性（HTML标签通过js获取后就是JS原生对象）变化的检测，元素及其后代元素的删除和添加无法被检测到。



扩展：

**`HTMLDivElement`** 接口提供了一些特殊属性（它也继承了通常的 [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement) 接口）来操作 [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div) 元素。



## Mutation events

示例代码：

```js
element.addEventListener('DOMNodeInserted',function(event){
    // event.target就是依次插入的DOM节点
}，false)
```

DOMNodeInserted这个事件是在对应的



对IE下的textarea标签的resize polyfill

```js
document.addEventListener('DOMNodeInserted',function(event){
    var target = event.target
    if(target.nodeName.toLowerCase()==='textarea'){
        // 如果是textarea元素
    }
})
```



其他Mutation events事件：

![image-20220604133048223](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604133048223.png)



![image-20220604133111622](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604133111622.png)



兼容性好，但是性能问题严重，因为这些事件一旦触发就是同步执行的，可能造成页面卡顿。



## MutationObserver

使用示例：

![image-20220604133321598](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604133321598.png)

性能非常好，对应的处理函数是微任务。





## 自定义元素生命周期

![image-20220604133606509](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604133606509.png)

![image-20220604133952060](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604133952060.png)



对内置元素的支持：

![image-20220604134022468](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604134022468.png)



性能高,兼容性差



## CSS3 animation

该方法主要借助animationend事件回调来判断dom元素的变化。此方法可以检测到元素的添加，删除，元素的属性变化，只需要配和合适的选择器使用即可。

![image-20220604134348881](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220604134348881.png) 



不同的元素的不同变化需要不同的代码来实现，例如元素的删除的检测就是通过兄弟元素的动画变化来处理，无法抽象为固定方法，只能具体场景具体使用。





















