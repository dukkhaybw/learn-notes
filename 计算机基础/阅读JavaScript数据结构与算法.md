

JavaScript语言基础知识



涉及数据结构：

- 数组
- 栈
- 队列
- 链表
- 集合
- 字典
- 散列
- 表
- 树
- 图



涉及算法：

- 各种排序算法
- 搜索算法
- 动态规划
- 贪心算法





JavaScript应用场景：

- 前端
- 后端服务器
- 数据库



注意对应数据结构在JavaScript语言中的实现方式和应用场景，以便在之后的开发中用于实际生产。





## 栈

栈是一种先进后出的数据结构。

在计算机中，栈结构常被用于管理函数调用之间的关系（调用栈），编译器中用于构建抽象语法树

关于栈的名词：

- 栈顶
- 栈底
- 入栈
- 出栈

代码实现：

```js
class Stack {
    constructor(){
        this.stack = []  // 使用数组来保存栈中的每一项元素
    }
    
    // 入栈方法
	push(...args){
        this.stack.push(...args)
    }
    
    // 出栈方法
    pop(){
        return this.stack.pop()
    }
    
    // 获取栈顶元素
    peek(){
        return this.stack[this.stack.length-1]
    }
    
    // 判断栈是否为空
    isEmpty(){
        return this.stack.length === 0
    }
    
    // 清空栈
    clear(){
        this.stack.length = 0
    }
    
    // 查询栈中有多少元素
    size(){
        return this.stack.length
    }
}
```



算法案例：

十进制转为二进制

```js
function divideBy2(num){
    if(num < 2){
        return String(num)
    }
    let binaryString = ''
    let stack = new Stack()
     
    while(num!==1){
        stack.push(Math.floor(num%2))
        num = Math.floor(num/2)
    }
    stack.push(1)
    return stack.stack.reverse().join('')
}
```



将十进制转为任意进制

```js
function baseConverter(number,base){
    let stack = new Stack()
    let rem
    let binaryString = ''
    let digital ='0123456789ABCDEF'
    
    while(number>0){
        rem = Math.floor(number%base)
        stack.push(rem)
        number = Math.floor(number/base)
    }
    while(!stack.isEmpty){
        binaryString += digital[stack.pop()]
    }
    return binaryString
}
```



## 队列

队列的特点是先进先出。

默认队列：

```js
class Queue{
    constructor(){
        this.queueArr = []
    }
    
    // 入队
    enqueue(...args){
        this.queueArr.push(...args)
    }
    
    // 出队
    dequeue(){
        return this.queueArr.shift()
    }
    
    // 取出对列中的第一个元素
    front(){
        return this.queueArr[0]
    }
    
        // 判断栈是否为空
    isEmpty(){
        return this.queueArr.length === 0
    }
    
    // 清空栈
    clear(){
        this.queueArr.length = 0
    }
    
    // 查询栈中有多少元素
    size(){
        return this.queueArr.length
    }
}
```



最小优先级队列

```js
class PriorityQueue{
    constructor(){
        this.queue = []
        this.ElementConstructor = function ElementConstructor(element,priority){
            this.element = element
            this.priority = priority
        }
    }
    
    enqueue(element,priority){
        let ElementConstructor = this.ElementConstructor
        let elementObj = new ElementConstructor(element,priority)
        let len = this.queue.length
        if(!len){
            this.queue.push(elementObj)
        }
        
        for(let i=0;i<len;i++){
            let item = this.queue[i]
            if(priority<item.priority){
               return this.queue.splice(i,0,elementObj)
            } else if (priority>=item.priority&&priority<this.queue[i+1].priority){
                return this.queue.splice(i,0,elementObj)
            } else if(i===len-1){
                this.queue.push(elementObj)
            }
        }
    }
    
       // 出队
    dequeue(){
        return this.queueArr.shift()
    }
    
    // 取出对列中的第一个元素
    front(){
        return this.queueArr[0]
    }
    
        // 判断栈是否为空
    isEmpty(){
        return this.queueArr.length === 0
    }
    
    // 清空栈
    clear(){
        this.queueArr.length = 0
    }
    
    // 查询栈中有多少元素
    size(){
        return this.queueArr.length
    }
}
```





算法案例：

击鼓传花游戏（循环队列）

```js
class Queue{
    constructor(){
        this.queueArr = []
    }
    
    // 入队
    enqueue(...args){
        this.queueArr.push(...args)
    }
    
    // 出队
    dequeue(){
        return this.queueArr.shift()
    }
    
    // 取出对列中的第一个元素
    front(){
        return this.queueArr[0]
    }
    
        // 判断栈是否为空
    isEmpty(){
        return this.queueArr.length === 0
    }
    
    // 清空栈
    clear(){
        this.queueArr.length = 0
    }
    
    // 查询栈中有多少元素
    size(){
        return this.queueArr.length
    }
}

function hotPotato(num,...namelist){
    let queue = new Queue()
    queue.enqueue(...namelist)
    let time = 0
    while(queue.size()!==1){
        if(time!=num){
           let firstElement =  queue.dequeue()
           queue.enqueue(firstElement)
            time++
        }else if(time === num){
            queue.dequeue()
        }
    }
    return queue.front()
}
```











