## 前置知识

Go的学习和应用方向：

- 区块链开发
- Go服务器端开发
- 游戏软件开发
- Golang分布式
- 云计算





计算机的硬件性能提升非常快，但主流的编程语言发展滞后，不能充分利用多核CPU的优势来提升软件性能。现有语言处理大并发的能力不够好。



Go语言的特点：

- 结合静态编译语言的安全和性能  与 动态语言的开发效率

- 从 C 语言中继承了很多理念，包括表达式语法，控制结构，基础数据类型，调用参数传值，指针等，也保留了和 C 语言一样的编译执行方式及弱化的指针

  ```go
  //go 语言的指针的使用特点(体验) 
  func testPtr(num *int) { 
    *num = 20
  }
  ```

  

- 引入包的概念，用于组织程序结构，Go语言项目中每一个文件都属于一个包，而不能单独存在，在一个go文件中使用类似`package xxx`语句表明这个go文件属于哪个包

  ```go
  package main // 该文件属于main包
  
  import "fmt"
  func sayOk(){
    fmt.Println('ok')
  }
  ```

- 自动垃圾回收机制

- 语言层面支持大并发，使用并发简单，通过gorouttine线程可实现大并发处理，充分利用多核cpu

- 基于 CPS 并发模型(Communicating Sequential Processes )实现

- 吸收了管道通信机制，形成 Go 语言特有的管道 channel 通过管道 channel , 可以实现不同的goroute之间的相互通信。

- 函数可以返回多个值

  ```go
  func getSumAndSub(n1 int, n2 int)(int, int){
    sum := n1 + n2
    sub := n1 - n2
    return sum , sub
  }
  ```

- 支持切片（类比动态数组，集合）  ，延时执行defer





## 开发环境搭建

SDK 的全称(Software Development Kit 软件开发工具包)，他提供了开发语言提供的各种工具包，编译工具，运行工具等。



go语言的程序基本结构。 











