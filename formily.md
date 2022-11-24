## 传统表单的问题

- 字段数量多后性能降低
- 字段关联逻辑复杂
  - 一对多(异步)
  - 多对一(异步)
  - 多对多(异步)

- 表单数据管理复杂
  - 表单值转换逻辑复杂(前后端格式不一致)
  - 同步默认值与异步默认值合并逻辑复杂
  - 跨表单数据通信
- 表单状态管理复杂，让数组数据在移动，删除过程中，字段状态能够做到跟随移动
- 难进行表单复用
- 动态渲染
- 难以进行字段配置化
- 没有跨端渲染
- 表单布局多样
  - 纵向布局
  - 横向布局
  - 网格布局
  - 弹性布局
  - 自由布局



## Formily的核心设计思路



### 什么是Formily

一款面向前端中后台复杂场景的 **数据 + 协议** 驱动的表单框架。 完成各种复杂的页面表单需求，他也提供了一个表单设计器，可以快速搭建表单。



核心特点：

1. 高性能，在有大量表单字段和高频率输入数据时，能有O(1)的时间复杂度
2. 框架无关，兼容React，React-Native，Vue
3. 生态完备，formiy在组件的桥接层支持多种UI库
4. 协议驱动，可以借助Formily，让后端通过一份JSON来动态驱动表单渲染，实现表单的可配置，可搭建



设计原则：

1. 单一职责
2. 优雅命名



核心架构：

![img](https://img.alicdn.com/imgextra/i3/O1CN01iEwHrP1NUw84xTded_!!6000000001574-55-tps-1939-1199.svg)

Formily 分为了内核层+协议层，UI 桥接层，扩展组件层，和配置应用层。

内核层是表单相关而与UI 无关的领域模型系统，它保证了用户管理的逻辑和状态是不耦合任何一个框架。

协议层是基于JSONScheme扩展出来的一个表单协议。

UI 桥接层是基于formily内核与各种前端框架对接的中间层。

扩展组件层是建立在UI桥接层和各种组件库对接的中间层。

配置应用层是借助formily可以构建纯源码，低代码，无代码等各种应用解决方案。

JSON Schema 独立存在，给 UI 桥接层消费，保证了协议驱动在不同 UI 框架下的绝对一致性，不需要重复实现协议解析逻辑。



## 具体设计思路





### 精确渲染

在 React 场景下实现一个表单需求，因为要收集表单数据，实现一些联动需求，大多数都是通过 setState 来实现字段数据收集，学习成本低，但是却又引入了性能问题，因为每次输入都会导致所有字段全量渲染，虽然在 DOM 更新层面是有 diff，但是 diff 也是有计算成本的，浪费了很多计算资源，如果用时间复杂度来看的话，初次渲染表单是 O(n)，字段输入时也是 O(n)，不合理。

采用MVVM设计模式，将视图模型抽象出来，然后在 DSL 模板层消费，DSL 借助某种依赖收集机制，然后在视图模型中统一调度，保证每次输入都是精确渲染的。

采用Mobx状态管理解决方案，核心依赖追踪机制和响应式模型的抽象能力。



### 领域模型

表单的联动可以非常复杂，包含了字段间的各种关系，大多数表单联动，基本上都是基于某些字段的值改变引发的联动，但是，实际业务需求可能会比较恶心，不仅要基于某些字段值引发联动，还会基于其他副作用值引发联动，比如应用状态，服务端数据状态，页面 URL，某个字段 UI 组件内部数据，当前字段自身的其他数据状态，某些特殊异步事件等等。

想要达成一个联动关系，核心是将字段的某些状态属性与某些数据关联起来，这里的某些数据可以是外界数据，也可以是自身数据，比如字段的显示/隐藏与某些数据的关联，又比如字段的值与某些数据关联，还比如字段的禁用/编辑与某些数据关联。

如果要表达一个字段，那么字段的路径一定要有，因为要描述整个表单树结构；

要管理起字段对应 UI 组件的属性，比如 Input 和 Select 都有它的属性，举个例子，Input 的 placeholder 与某些数据关联，或者 Select 的下拉选项与某些数据关联；

![image-20221119191946098](/Users/wuyi/Desktop/study-note/images/image-20221119191946098.png)

根据这些需求，抽象出一个接口Filed：

```ts
interface Field {
   path:string[],
   value:any,
   visible:boolean,
   disabled:boolean,
   component:[Component,ComponentProps]
}
```

component 属性，它代表了字段所对应的 UI 组件和 UI 组件属性，这样就实现了某些数据与字段组件属性关联，甚至是与字段组件关联的能力。

字段的外包裹容器，通常都叫 FormItem，它主要负责字段的外围的交互样式，比如字段标题，错误提示的样式等等，如果想要囊括更多联动，比如某些数据与 FormItem 的联动，那就得把外包裹容器也加进去。

抽象出字段模型，它包含了字段相关的所有状态，只要去操作这些状态就能引发联动。



### 路径系统

在表单领域模型中的字段模型，必须还要有一个表单模型作为顶层模型，顶层模型管理着所有字段模型，每个字段都有着自己的路径。



### 生命周期

借助 Mobx 和路径系统，抽象了之后，方案就像个黑盒，外界无法感知到方案内部状态流转过程，想要在某个过程阶段内实现一些逻辑则无法实现，所以，需要另外一个概念，生命周期，只要将整个表单生命周期作为事件钩子暴露给外界，这样就能做到了既有抽象，但又灵活的表单方案。



### 协议驱动

要实现动态可配置表单，那必然是需要将表单结构变得可序列化，序列化的方式有很多种，可以是以 UI 为思路的 UI 描述协议，也可以是以数据为思路的数据描述协议，因为表单本身就是为了维护一份数据，对于表单场景而言，数据协议最适合不过，想要描述数据结构，采用了JSON-sheme协议。因为 JSON Schema 协议上本身就有很多校验相关的属性，这就天然和表单校验关联上了。

UI 描述协议适合更通用的 UI 表达，描述表单当然不在话下，只是它会更偏前端协议，相反，JSON-Schema，在后端模型层，都是可表达的，在描述数据上更通用，所以两种协议，各有所长，只是在单纯表单领域，JSON-Schema 会更偏领域化一些。

如果选用 JSON-Schema，我们怎么描述 UI，怎么描述逻辑呢？单纯的描述数据，想要输出实际业务可用的表单页面，不太现实。

[react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)的解法是，数据是数据，UI 是 UI，各个协议都是非常纯净的协议，但是却带来了较大的维护成本和理解成本，用户要开发一个表单，需要不断的在两种协议心智上做切换，所以，如果从技术视角来看这样的拆分，其实是非常合理的，但是从产品视角来看的话，拆分则是把成本抛给了用户，所以，**Formily 的表单协议会更加倾向于在 JSON-Schema 上做扩展。扩展了void类型来描述数据无关的布局容器或者控件；为了不污染标准 JSON-Schema 属性，统一以`x-*`格式来描述UI控件与控件的属性。**

```json
{
  "type": "string",
  "title": "字符串",
  "description": "这是一个字符串",
  "x-component": "Input",
  "x-component-props": {
    "placeholder": "请输入"
  }
}
```

UI 协议与数据协议混合在一起，只要有一个统一的扩展约定，也还是能保证两种协议职责单一。同时可以将临时状态（数据）封装在渲染引擎或者组件内部。



在某些字段上包裹一个 UI 容器,Formily 定义了一个新的 schema type，叫`void`。在 JSON Schema 中，引入 void，代表一个虚数据节点，表示该节点并不占用实际数据结构。

```json
{
  "type": "void",
  "title": "卡片",
  "description": "这是一个卡片",
  "x-component": "Card",
  "properties": {
    "string": {
      "type": "string",
      "title": "字符串",
      "description": "这是一个字符串",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请输入"
      }
    }
  }
}
```

这样就可以描述了一个 UI 容器了，因为可以描述 UI 容器，我们就能轻易封装一个场景化的组件。

描述字段间联动:

```json
{
  "type": "object",
  "properties": {
    "source": {
      "type": "string",
      "title": "Source",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请输入"
      }
    },
    "target": {
      "type": "string",
      "title": "Target",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请输入"
      },
      "x-reactions": [
        {
          "dependencies": ["source"],
          "when": "{{$deps[0] == '123'}}",
          "fulfill": {
            "state": {
              "visible": true
            }
          },
          "otherwise": {
            "state": {
              "visible": false
            }
          }
        }
      ]
    }
  }
}
```

借助`x-reactions`描述了 target 字段，依赖了 source 字段的值，如果值为`'123'`的时候则显示 target 字段，否则隐藏，这种联动方式是一种**被动联动**





主动联动:只需要将`x-reactions`换个位置，放到 source 字段上，然后再指定一个 target 即可。

```json
{
  "type": "object",
  "properties": {
    "source": {
      "type": "string",
      "title": "Source",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请输入"
      },
      "x-reactions": [
        {
          "when": "{{$self.value == '123'}}",   // 条件
          "target": "target",   // 目标字段
          "fulfill": {   // 条件满足的动作

            "state": {
              "visible": true
            }
          },
          "otherwise": {  // 条件不满足的动作

            "state": {
              "visible": false
            }
          }
        }
      ]
    },
    "target": {
      "type": "string",
      "title": "Target",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请输入"
      }
    }
  }
}
```



### 分层架构

Formily的架构设计

![img](https://img.alicdn.com/imgextra/i3/O1CN01iEwHrP1NUw84xTded_!!6000000001574-55-tps-1939-1199.svg)

Formily 分为了内核层，UI 桥接层，扩展组件层，和配置应用层。

内核层是 UI 无关的，它保证了用户管理的逻辑和状态是不耦合任何一个框架。

JSON Schema 独立存在，给 UI 桥接层消费，保证了协议驱动在不同 UI 框架下的绝对一致性，不需要重复实现协议解析逻辑。





Formily是一个抽象了表单领域模型的 MVVM 表单解决方案





## 快速开始

### 安装依赖

```shell
npm install --save @formily/core   // 责管理表单的状态，表单校验，联动等
npm install --save @formily/react  // 一个 UI 库来接入内核数据，用来实现最终的表单交互效果
npm install --save antd moment @formily/antd  // 
```



### 使用

```ts
import React from 'react'
import { createForm } from '@formily/core'
import { FormProvider, Field } from '@formily/react'
import { FormItem, Input } from '@formily/antd'
```

