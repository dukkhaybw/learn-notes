注意不同**数据结构**在 JavaScript 语言中的**实现方式**和**应用场景**，以便在之后的开发中用于实际生产。

- javascript 基础语法以及 ES6+的新特性
- 数组，栈，队列，双端队列，链表，集合，字典，散列表，递归，树，堆和图等数据结构
- 各种基础的排序，搜索算法和随机算法
- 动态规划和贪心算法等高级算法
- 函数式编程
- 算法复杂度

作为前端开发者，需要使用 JavaScript 这门语言来实现各种业务逻辑。同时 JavaScript 这门语言原生提供了一些数据结构，比如数组和对象，而某些场景下，需要其他的数据结构来组织和确定数据之间的关系和联系，这时需要开发者自己去**基于 JavaScript 原生提供的一些数据结构去实现 JavaScript 中没有的其他的数据结构**。因为在某些情况下，特定的数据结构会有更好的性能也更容易实现业务需求。

对于算法，就是解决问题的一系列步骤逻辑，但对于不同的问题，需要算法和数据结构的相互配合才能更好的实现和解决问题。所以才会在计算机科学中看到数据结构和算法的高度绑定出现的原因，而且不同的算法之间是存在性能差异的。

1. JavaScript 基础语法和环境搭建
2. ES6+后的 JavaScript 新语法功能
3. 数据结构——数组，数组的创建和常用方法
4. 数据结构——栈，实现栈，栈的常见操作方法和应用场景
5. 数据结构——队列，实现不同类型的队列，队列的常见操作和应用场景
6. 数据结构——链表，实现不同类型的链表（利用对象和一个指针变量），链表的常见操作方法和案例
7. 数据结构——集合，实现集合（存储非重复性的元素）
8. 数据结构——字典和散列表的实现及他们的区别，散列冲突
9. 递归概念，声明式和递归式算法的区别
10. 数据结构——树，实现树和树的遍历和增删改查
11. 数据结构——二叉堆和堆排序，最小（大）堆，使用堆优化优先队列
12. 数据结构——图，不同算法遍历图，深度和广度优先搜素算法遍历图
13. 算法——排序和搜素算法
14. 算法——算法技巧和著名算法介绍
15. 算法——算法复杂度，大 O 表示法



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
  constructor() {
    this.stack = []; // 使用数组来保存栈中的每一项元素
  }

  // 入栈方法
  push(...args) {
    this.stack.push(...args);
  }

  // 出栈方法
  pop() {
    return this.stack.pop();
  }

  // 获取栈顶元素
  peek() {
    return this.stack[this.stack.length - 1];
  }

  // 判断栈是否为空
  isEmpty() {
    return this.stack.length === 0;
  }

  // 清空栈
  clear() {
    this.stack.length = 0;
  }

  // 查询栈中有多少元素
  size() {
    return this.stack.length;
  }
}
```

算法案例：

十进制转为二进制

```js
function divideBy2(num) {
  if (num < 2) {
    return String(num);
  }
  let binaryString = '';
  let stack = new Stack();

  while (num !== 1) {
    stack.push(Math.floor(num % 2));
    num = Math.floor(num / 2);
  }
  stack.push(1);
  return stack.stack.reverse().join('');
}
```

将十进制转为任意进制

```js
function baseConverter(number, base) {
  let stack = new Stack();
  let rem;
  let binaryString = '';
  let digital = '0123456789ABCDEF';

  while (number > 0) {
    rem = Math.floor(number % base);
    stack.push(rem);
    number = Math.floor(number / base);
  }
  while (!stack.isEmpty) {
    binaryString += digital[stack.pop()];
  }
  return binaryString;
}
```

## 队列

队列的特点是先进先出。

默认队列：

```js
class Queue {
  constructor() {
    this.queueArr = [];
  }

  // 入队
  enqueue(...args) {
    this.queueArr.push(...args);
  }

  // 出队
  dequeue() {
    return this.queueArr.shift();
  }

  // 取出对列中的第一个元素
  front() {
    return this.queueArr[0];
  }

  // 判断栈是否为空
  isEmpty() {
    return this.queueArr.length === 0;
  }

  // 清空栈
  clear() {
    this.queueArr.length = 0;
  }

  // 查询栈中有多少元素
  size() {
    return this.queueArr.length;
  }
}
```

最小优先级队列

```js
class PriorityQueue {
  constructor() {
    this.queue = [];
    this.ElementConstructor = function ElementConstructor(element, priority) {
      this.element = element;
      this.priority = priority;
    };
  }

  enqueue(element, priority) {
    let ElementConstructor = this.ElementConstructor;
    let elementObj = new ElementConstructor(element, priority);
    let len = this.queue.length;
    if (!len) {
      this.queue.push(elementObj);
    }

    for (let i = 0; i < len; i++) {
      let item = this.queue[i];
      if (priority < item.priority) {
        return this.queue.splice(i, 0, elementObj);
      } else if (priority >= item.priority && priority < this.queue[i + 1].priority) {
        return this.queue.splice(i, 0, elementObj);
      } else if (i === len - 1) {
        this.queue.push(elementObj);
      }
    }
  }

  // 出队
  dequeue() {
    return this.queueArr.shift();
  }

  // 取出对列中的第一个元素
  front() {
    return this.queueArr[0];
  }

  // 判断栈是否为空
  isEmpty() {
    return this.queueArr.length === 0;
  }

  // 清空栈
  clear() {
    this.queueArr.length = 0;
  }

  // 查询栈中有多少元素
  size() {
    return this.queueArr.length;
  }
}
```

算法案例：

击鼓传花游戏（循环队列）

```js
class Queue {
  constructor() {
    this.queueArr = [];
  }

  // 入队
  enqueue(...args) {
    this.queueArr.push(...args);
  }

  // 出队
  dequeue() {
    return this.queueArr.shift();
  }

  // 取出对列中的第一个元素
  front() {
    return this.queueArr[0];
  }

  // 判断栈是否为空
  isEmpty() {
    return this.queueArr.length === 0;
  }

  // 清空栈
  clear() {
    this.queueArr.length = 0;
  }

  // 查询栈中有多少元素
  size() {
    return this.queueArr.length;
  }
}

function hotPotato(num, ...namelist) {
  let queue = new Queue();
  queue.enqueue(...namelist);
  let time = 0;
  while (queue.size() !== 1) {
    if (time != num) {
      let firstElement = queue.dequeue();
      queue.enqueue(firstElement);
      time++;
    } else if (time === num) {
      queue.dequeue();
    }
  }
  return queue.front();
}
```

## 链表

数组用于以顺序存放数据的数据结构，每种语言都实现了数组。

特点：查询和获取数组中的元素的性能都非常高，

不足：

1. 在大多数语言中，数组的大小是固定的
2. 在数组的起点或者中间插入或者删除元素时，因为需要移动元素，性能都非常差。

链表也可以用来存储数据（动态存储）

特点：

1. 链表中的元素在内存中并不是连续存放的
2. 在链表中的每一个元素，都有一个属性指向自身的数据，同时又有一个属性指向下一个元素的引用地址
3. 相比于数组，链表删除或者添加元素时，不需要移动其他元素。

![image-20220817204953458](.\typora-user-images\image-20220817204953458.png)

不足：当需要获取链表中的某个元素时，则需要从起点开始迭代链表直到找到所需要的元素，这样查询或者获取元素的性能表现不及数组。

### 实现链表

特点：

1. 每个链表有一个 count 属性，表示链表中元素的数量；
2. 有一个 indexOf 方法，用于在链表中找到一个特定的元素；
3. 一个用于比较节点是否相等的一个工具方法，也可以有开发者自行定义
4. 有一个属性保存链表的第一个元素
5. 链表中的每个元素都是一个对象，该对象上有两个属性，element 表示元素值，next 表示指向链表下一个元素项的指针

```js
class Node {
  constructor(element, next = undefined) {
    this.element = element;
    this.next = next;
  }
}

function defaultIsEqual(a, b) {
  return a === b;
}

// 链表
class LinkedList {
  constructor(equalFn) {
    this.count = 0; // 表示链表中的元素数量
    this.head = null;
    this.IsEqualFn = equalFn || defaultIsEqual;
  }
}
```

链表类的方法：

1. push(element)：向链表尾部添加一个新元素。
2. insert(element, position)：向链表的特定位置插入一个新元素。
3. getElementAt(index)：返回链表中特定位置的元素。如果链表中不存在这样的元素， 则返回 undefined。
4. remove(element)：从链表中移除一个元素。
5. indexOf(element)：返回元素在链表中的索引。如果链表中没有该元素则返回-1。
6. removeAt(position)：从链表的特定位置移除一个元素。
7. isEmpty()：如果链表中不包含任何元素，返回 true，如果链表长度大于 0 则返回 false。
8. size()：返回链表包含的元素个数，与数组的 length 属性类似。
9. toString()：返回表示整个链表的字符串。由于列表项使用了 Node 类，就需要重写继 承自 JavaScript 对象默认的 toString 方法，让其只输出元素的值。

```js
// 链表
class LinkedList {
  constructor(equalFn) {
    this.count = 0; // 表示链表中的元素数量
    this.head = null;
    this.IsEqualFn = equalFn || defaultIsEqual;
  }

  push(element) {
    let node = new Node(element);
    this.count++;
    if (!this.head) {
      this.head = node;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }
}
```

```js
class Node {
  constructor(element) {
    this.element = element;
    this.next = undefined;
  }
}

function defaultIsEqual(a, b) {
  return a === b;
}

// 链表
class LinkedList {
  constructor(equalFn) {
    this.count = 0;
    this.head = null;
    this.IsEqualFn = equalFn || defaultIsEqual;
  }
  push(element) {
    let node = new Node(element);
    this.count++;
    if (!this.head) {
      // 空链表
      this.head = node;
      return;
    }
    // 非空列表
    let lastNode = this.head.next;
    while (lastNode.next) {
      lastNode = lastNode.next;
    }
    lastNode.next = node;
  }

  /*push(element) {
        this.count ++
        if(!this.head){
            // 空链表
            let node = new Node(element)
            this.head = node 
            this.last = node
            return 
        }
        // 非空列表
        let node = new Node(element)
        this.last.next = node
        this.last = node
    }*/

  removeAt(index) {
    // 当需要移除的像不在链表范围内时
    if (index > this.count || index < 1) {
      return;
    }
    // 移除第一项
    if (index === 1) {
      this.head = this.head.next;
    } else {
      // 移除中间项
      let prev;
      let current = this.head;
      while (index-- > 1) {
        prev = current;
        current = current.next;
      }
      prev.next = current.next;
      this.count--;
      return current.element;
    }
  }
}
```

## 树

非顺序的数据结构。一个树结构包含一系列存在父子节点关系的节点，其中每个节点都有一个父节点（除了根节点以外）以及零个或者多个子节点。

### 特点

1. 查找效率非常高
2. 分层

### 术语

- 根节点：树顶部的节点
- 内部节点：至少有一个子节点的节点
- 外部节点（叶节点）：没有子元素的节点
- 子树：由节点和它的后代节点构成的一个树
- 节点深度：直接祖先节点的数量
- 树的高度：所有节点中深度最大节点的深度值

### 二叉树

树中的每个节点最多只有两个子节点。

#### 二叉搜索树（BST）

只允许在树的左侧节点存放比父节点小的值，在右侧节点存放比父节点大的值。

![image-20220825125236432](.\typora-user-images\image-20220825125236432.png)

#### 树及其方法

![image-20220825130741730](.\typora-user-images\image-20220825130741730.png)

树中的每个节点的结构：

```js
export class Node {
  constructor(key) {
    this.key = key; // 节点值
    this.left = null; // 左侧子节点引用,术语称为:边
    this.right = null; // 右侧子节点引用,术语称为:边
  }
}
```

树的主体：

```js
import Node from './node.js';
import defaultEqualFn from './defaultEqualFn.js';

class BinarySearchTree {
  constructor(equalFn = defaultEqualFn) {
    this.equaltFn = equalFn;
    this.root = null;
  }
}
```

树的方法：
