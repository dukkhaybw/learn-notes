# DOM 变化的检测

## 总览

1. Object.defineProperty
2. Mutation events
3. MutationObserver
4. 自定义元素生命周期
5. CSS3 animation

## Object.defineProperty

代码示例：

这个代码示例为整个页面的所有 div 元素设置一个 rows 属性，并给该属性设置了 getter 和 setter 函数。

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

不足：只支持对象自身属性（HTML 标签通过 js 获取后就是 JS 原生对象）变化的检测，元素及其后代元素的删除和添加无法被检测到。

扩展：

**`HTMLDivElement`** 接口提供了一些特殊属性（它也继承了通常的 [`HTMLElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement) 接口）来操作 [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div) 元素。

## Mutation events

示例代码：

```js
element.addEventListener('DOMNodeInserted',function(event){
    // event.target就是依次插入的DOM节点
}，false)
```

DOMNodeInserted 这个事件是在对应的

对 IE 下的 textarea 标签的 resize polyfill

```js
document.addEventListener('DOMNodeInserted', function (event) {
  var target = event.target;
  if (target.nodeName.toLowerCase() === 'textarea') {
    // 如果是textarea元素
  }
});
```

其他 Mutation events 事件：

![image-20220604133048223](.\typora-user-images\image-20220604133048223.png)

![image-20220604133111622](.\typora-user-images\image-20220604133111622.png)

兼容性好，但是性能问题严重，因为这些事件一旦触发就是同步执行的，可能造成页面卡顿。

## MutationObserver

使用示例：

![image-20220604133321598](.\typora-user-images\image-20220604133321598.png)

性能非常好，对应的处理函数是微任务。

## 自定义元素生命周期

![image-20220604133606509](.\typora-user-images\image-20220604133606509.png)

![image-20220604133952060](.\typora-user-images\image-20220604133952060.png)

对内置元素的支持：

![image-20220604134022468](.\typora-user-images\image-20220604134022468.png)

性能高,兼容性差

## CSS3 animation

该方法主要借助 animationend 事件回调来判断 dom 元素的变化。此方法可以检测到元素的添加，删除，元素的属性变化，只需要配和合适的选择器使用即可。

![image-20220604134348881](.\typora-user-images\image-20220604134348881.png)

不同的元素的不同变化需要不同的代码来实现，例如元素的删除的检测就是通过兄弟元素的动画变化来处理，无法抽象为固定方法，只能具体场景具体使用。
