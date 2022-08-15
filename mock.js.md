# Mock.js

在后端接口并未开发完成的时候，需要前端自己去模拟请求后端数据并渲染。模拟请求后端数据的方式有：

- 本地新建相应的json文件并添加一些模拟数据，无法模拟数据的增删改查

  

- 使用第三方工具json-server，不能随机生成所需数据

  

- 使用mock.js动态模拟，mock.js能拦截ajax请求，可随机生成所需数据，可模拟对数据的增删改查



### mock.js的基本使用

##### 在项目中安装：

npm install mockjs --save-dev



##### 创建mock.js工具目录和内部模块：

```
//引入mockjs
import Mock from 'mockjs'

//使用mockjs模拟数据  Mock.mock(url,data);  url用正则写，get请求传参时，也能拦截数据。
Mock.mock('/\/api\/msdk\/proxy\/query_common_credit/', {
    "ret":0,
    "data":
      {
        "mtime": "@datetime",//随机生成日期时间
        "score|1-800": 800,//随机生成1-800的数字
        "rank|1-100":  100,//随机生成1-100的数字
        "stars|1-5": 5,//随机生成1-5的数字
        "nickname": "@cname",//随机生成中文名字
      }
});

//   注意不需要导出

//   Mock.mock(/\/sample\/edit\/location/, "get", Sample.location); 表示在项目中用axios请求该路径时，会随机创建并返回data中确定好的数据内容。
```

##### main.js里面引入该文档

```
import './mock/index.js'           //此部分引入的是我们所编写的mockjs模块
```

##### 在vue组件中使用

```
query_common_credit(){
      var url = '/api/msdk/proxy/query_common_credit';
      this.$axios.get(url)
        .then(response => {
          
        })
        .catch(error => {
          
        })
    }
```



##### 其他设置项

Mock.setup( settings )配置拦截 Ajax 请求时的行为。支持的配置项仅仅有：timeout

设置延时请求到数据：

```csharp
//延时400s请求到数据
Mock.setup({
    timeout: 400
})
//延时200-600毫秒请求到数据
Mock.setup({
    timeout: '200-600'
})
```

其他用法：

```
npm install mockjs --save-dev
// 引入 Mock
var Mock = require('mockjs')

// 定义数据类型
var data = Mock.mock({
  // 20条数据
  "data|20": [{
    // 商品种类
    "goodsClass": "女装",
    // 商品Id
    "goodsId|+1": 1,
    //商品名称
    "goodsName": "@ctitle(10)",
    //商品地址
    "goodsAddress": "@county(true)",
    //商品等级评价★
    "goodsStar|1-5": "★",
    //商品图片
    "goodsImg": "@Image('100x100','@color','小甜甜')",
    //商品售价
    "goodsSale|30-500": 30

  }]
})
// 输出结果随机生成的数据（node index.js）
 console.log(data);
```

例子：

```
var obj = {'aa':'11', 'bb':'22', 'cc':'33', 'dd':'44'};

// Mock响应模板
Mock.mock('http://test.com', {
    "user|1-3": [{   // 随机生成1到3个数组元素
        'name': '@cname',  // 中文名称
        'id|+1': 88,    // 属性值自动加 1，初始值为88
        'age|18-28': 0,   // 18至28以内随机整数, 0只是用来确定类型
        'birthday': '@date("yyyy-MM-dd")',  // 日期
        'city': '@city(true)',   // 中国城市
        'color': '@color',  // 16进制颜色
        'isMale|1': true,  // 布尔值
        'isFat|1-2': true,  // true的概率是1/3
        'fromObj|2': obj,  // 从obj对象中随机获取2个属性
        'fromObj2|1-3': obj,  // 从obj对象中随机获取1至3个属性
        'brother|1': ['jack', 'jim'], // 随机选取 1 个元素
        'sister|+1': ['jack', 'jim', 'lily'], // array中顺序选取元素作为结果
        'friends|2': ['jack', 'jim'] // 重复2次属性值生成一个新数组
    },{
        'gf': '@cname'
    }]
});



输出结果：
{
    "user": [
        {
            "name": "董静",
            "id": 88,
            "age": 25,
            "birthday": "2015-04-01",
            "city": "湖南省 怀化市",
            "color": "#c0f279",
            "isMale": false,
            "isFat": false,
            "fromObj": {
                "dd": "44",
                "aa": "11"
            },
            "fromObj2": {
                "bb": "22",
                "cc": "33"
            },
            "brother": "jack",
            "sister": "jack",
            "friends": [
                "jack",
                "jim",
                "jack",
                "jim"
            ]
        },
        {
            "gf": "田杰"
        }
    ]
}
```

其他用法：

```
Mock.mock('http://test.com', 'get', function() {
    return Mock.mock({
        "user|1-3": [{
            'name': '@cname',
            'id': 88
        }
      ]
    });
});


输出可能结果：
{
    "user": [
        {
            "name": "许超",
            "id": 88
        }
    ]
}
```





### 关于data中数据的定义

```
数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value

注意：
属性名 和 生成规则 之间用竖线 | 分隔。 
生成规则 是可选的。 
生成规则 有 7 种格式： 
'name|min-max': value 
'name|count': value 
'name|min-max.dmin-dmax': value 
'name|min-max.dcount': value 
'name|count.dmin-dmax': value 
'name|count.dcount': value
//属性值自动加 1，初始值为 `number` 'name|+step': value    
```

- 随机数据的生成   **Mock.Random 提供的完整方法（占位符）如下**

  | 类型          | 方法                                                         |
  | ------------- | ------------------------------------------------------------ |
  | Basic         | boolean, natural, integer, float, character, string, range, date, time, datetime, now |
  | Image         | image, dataImage                                             |
  | Color         | color                                                        |
  | Text          | paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle |
  | Name          | first, last, name, cfirst, clast, cname                      |
  | Web           | url, domain, email, ip, tld                                  |
  | Address       | area, region                                                 |
  | Helper        | capitalize, upper, lower, pick, shuffle                      |
  | Miscellaneous | guid, id                                                     |

  

  

  ```
  const data = Mock.mock({
  	"color": "@color",
  	//中文名
  	"name": "@cname",
  	 //邮政编码
     "code":"@zip"
     //省市县
     "countrysx":"@county(true)",
     // 邮箱：
     "email": "@email",
     //中国大区
     "cregion":"@region",
     // 省
     "cprovince":"@province",
     //市
     "ccity":"@city",
  })
  ```

  注意点：

  - 属性值是对象 Object

    

    ```
    'name|count': object
    ```

    从属性值 `object` 中随机选取 `count` 个属性。

    ```
    'name|min-max': object
    ```

    从属性值 `object` 中随机选取 `min` 到 `max` 个属性。

    

    

  - 属性值是数组 Array

    ```
    'name|1': array
    ```

    从属性值 `array` 中随机选取 1 个元素，作为最终值。

    ```
    'name|+1': array
    ```

    从属性值 `array` 中顺序选取 1 个元素，作为最终值。

    ```
    'name|min-max': array
    ```

    通过重复属性值 `array` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`。

    ```
    'name|count': array
    ```

    通过重复属性值 `array` 生成一个新数组，重复次数为 `count`。

    

    

    

  - ### 属性值是函数 Function

    ```
    'name': function
    ```

    执行函数 `function`，取其返回值作为最终的属性值，函数的上下文为属性 `'name'` 所在的对象。

    

  - ###  属性值是正则表达式 RegExp

    ```
    'name': regexp
    ```

    根据正则表达式 `regexp` 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。



## Mock.Random 扩展方法

```js
// 引入 Mock
var Mock = require('mockjs')

var random = Mock.Random;

//扩展数据模板
random.extend({
  type: function (index:number) {
    const types = ['products', 'industryApp', 'solution', 'experts'];
    return this.pick(types[index])
  }
});

// 定义数据类型
const  menuSource:Array<any> = [];
 menuSource[0] = Mock.mock({
  "type": "@type(0)",
   'data|3-4':[{
     'id|+1': 1,
     name: "@ctitle( 4,6)",
     "childs|5-10": [{
       'id|+1': 1,
       name: "@ctitle(4,6)",
     }]
   }]
});
// 输出结果
 console.log(data);



Random.extend({
    weekday: function(date) {
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return this.pick(weekdays);
    },
    sex: function(date) {
        var sexes = ['男', '女', '中性', '未知'];
        return this.pick(sexes);
    }
});

console.log(Random.weekday());  // 结果: Saturday
console.log(Mock.mock('@weekday'));  // 结果: 112Tuesday
console.log(Random.sex());  // 结果: 男
console.log(Mock.mock('@sex'));  // 结果: 未知
```

## mockjs获取前端传递的数据

```js
axios({
      method: "get",
      url: "/getGoods",
      data: {
        id:2
      }
    }).then(data => {
      //成功的回调函数，返回的是增加的数据
      console.log(data.data.data);
      this.url = data.data.data[0].goodsImg
    });
  }

  Mock.mock("/getGoods", "get", (config) => {
  console.log(config);
  return data;
})

mockjs可以通过option.body获取前端传递的数据
```





