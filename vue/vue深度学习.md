模拟的 menu 菜单的情况：

a-menu 组件：

```vue
<template>
  <ul>
    <slot></slot>
  </ul>
</template>

<script>
export default {};
</script>
```

a-sub-menu 组件

```vue
<template>
  <li>
    <span @click="handleShow">
      <slot name="title"></slot>
    </span>
    <ul v-if="isShow">
      <slot></slot>
    </ul>
  </li>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    handleShow() {
      this.isShow = !this.isShow;
    }
  }
};
</script>
```

a-menu-item 组件：

```vue
<template>
  <li>
    <slot></slot>
  </li>
</template>

<script>
export default {};
</script>
```

基本用法：

```vue
<template>
  <div>
    <a-menu>
      //ul
      <a-sub-menu>
        //li <template slot="title">导航一</template> //span //ul
        <a-sub-menu>
          //li <template slot="title">导航1-1</template> //span //ul
          <a-menu-item>导航1-1-1</a-menu-item> //li <a-menu-item>导航1-1-2</a-menu-item> //li
          <a-menu-item>导航1-1-3</a-menu-item> //li <a-menu-item>导航1-1-4</a-menu-item> //li
          <a-menu-item>导航1-1-5</a-menu-item> //li
        </a-sub-menu>
        <a-menu-item>导航1-2</a-menu-item> //li <a-menu-item>导航1-3</a-menu-item> //li
      </a-sub-menu>
      <a-menu-item>导航二</a-menu-item> //li <a-menu-item>导航三</a-menu-item> //li
      <a-menu-item>导航四</a-menu-item> //li
    </a-menu>
  </div>
</template>

<script>
import Amenu from './component/Amenu.vue';
import AmenuItem from './component/AmenuItem.vue';
import ASubMenu from './component/ASubMenu.vue';
export default {
  components: {
    'a-menu': Amenu,
    'a-menu-item': AmenuItem,
    'a-sub-menu': ASubMenu
  }
};
</script>
```

重点是用数据驱动菜单项自动根据数据结构生成视图

期望的使用方式是：

```vue
<template>
  <menu :data="data"></menu>
</template>

<script>
export default {
       data(){
           return {
               data:[
                   {name:'导航一',id:1,children:[
                       {name:'导航1-1'，id:1.1,children:[
                        	{name:'导航1-1-1',id:1.2}
                        	{name:'导航1-1-2',id:1.3}
                        	{name:'导航1-1-3',id:1.4}
                        ]},
       				{name:'导航1-2'，id:1.5}
                   ]},
                   {name:'导航二',id:2},
                   {name:'导航三',id:3}
               ]
           }
       }
   }
</script>
```

menu 组件中：

```vue
<template>
  <a-menu>
    <-- 接下来有可能是submenu或者menu item组件 -->
    <template v-for="item in data">
      <a-submen v-if="item.children" :key="item.id">
        <template slot="title">{{ item.name }}</template>
        <tempalte v-for="itemChild in item.children">
          <a-submenu v-if="itemChild.children" :key="itemChild.id">
            <template slot="title">{{ itemChild.name }}</template>
          </a-submenu>
          <a-menu-item v-else :key="itemChild.id">{{ itemChild.name }}</a-menu-item>
        </tempalte>
      </a-submen>
      <a-menu-item v-else :key="item.id">{{ item.name }}</a-menu-item>
    </template>
  </a-menu>
</template>

<script>
import AMenu from './components/a-menu.vue';
import AMenuItem from './components/a-menu-item.vue';
import ASubmenu from './components/a-submenu.vue';
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AMenu,
    AMenuItem,
    ASubmenu
  }
};
</script>
```

```vue
<template>
  <a-menu>
    <reder-menu :data="data"></reder-menu>
  </a-menu>
</template>

<script>
import AMenu from './components/a-menu.vue'
import AMenuItem from './components/a-menu-item.vue'
import ASubmenu from './components/a-submenu.vue'
   let rederMenu =  {
       name:"RenderMenu"
       template:`
		<template v-for="item in data">
       	<a-submen v-if="item.children" :key="item.id">
               <template slot="title">{{item.name}}</template>
			<RenderMenu :data="item.children"></RenderMenu>
   		</a-submen>
           <a-menu-item v-else :key="item.id">{{item.name}}</a-menu-item>
	</template>
	`,
       props:{
           data:{
               type:Array,
               default:()=>[]
           }
       }
       components:{
       	AMenuItem,
       	ASubmenu
   	}
   }



   export default {
       props:{
           data:{
               type:Array,
               default:()=>[]
           }
       },
       components:{
           AMenu,
           rederMenu
       }
   }
</script>
```

对于递归组件自身，需要给当前需要递归的组件提供一个 name 属性，并且可以在当前组件的模板部分中内通过该组件的 name 属性值作为标签名代表该组件自身，并传入对应的参数。以实现组件的自行递归。

## render 函数

通过 template 定义一个组件的模板的话，有时很不灵活。官方的例子,定义了一个组件叫 Level，其中在多次调用组件标签的时候，给组件标签绑定了一个属性 type，只是 type 对应的值是 1，2，3，4，5，6。组件内可以根据 type 的数值确定返回 h1~h6 的标签。

在 Level 组件中使用 template 作为模板的写法：

```vue
<template>
  <div>
    <h1 v-if="type == '1'">
      <slot></slot>
    </h1>
    <h2 v-else-if="type == '2'">
      <slot></slot>
    </h2>
    <h3 v-else-if="type == '3'">
      <slot></slot>
    </h3>
    <h4 v-else-if="type == '4'">
      <slot></slot>
    </h4>
    <h5 v-else-if="type == '5'">
      <slot></slot>
    </h5>
    <h6 v-else>
      <slot></slot>
    </h6>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    }
  }
};
</script>
```

使用 render 函数对上面的内容进行简化：

书写 render 函数的位置：

位置一：

在.vue 文件中，当写了 template 模板内容后，如果又在 js 部分的配置对象中书写 render 函数的话，那么 vue-loader 将会将 template 部分的内容转为 render 函数形式，并覆盖掉 js 部分的配置对象中写的 render 函数。如果没有写 template 部分的话，则 js 部分中配置对象上的 render 函数可以生效。

位置二：

在.js 文件中，封装为函数组件。

```js
import '.../.../xxx.scss';
export default {
  props: {
    type: {
      type: String
    }
  },
  render(h) {
    (h) => createElement; //该方法会创建一些虚拟节点，本质是用对象表示DOM元素结构，开发者可以将该虚拟节点渲染为真实的DOM元素之后，再放在页面上。
    //render函数中的this指代的是当前的函数组件的实例
    return h('h' + this.type, {}, this.$slots.default);
  }
};
```

```js
原生js的写法：
render (h){
   return h('h'+this.type,{},[
       this.$slots.default,
       h('span',{
           on:{   //这是在给标签元素绑定的事件
               click(){
                   alert(1)
               }
           },
           attrs：{   //给标签元素绑定标签属性
           	a:1
       	   }
       },'hello world')
   ])
}
```

```jsx
jsx的写法：  和react中的并不一样
export default {
    props:{
        type:{
            type:String
        }
    },
    data(){
        return {
            value:'hello'
        }
    }
    //在jsx语法中无法在使用vue提供的v-model能力，如果需要实现v-model的能力，则需要自行实现
	render (h){
        let tag = 'h'+this.type
   		return (<div>
                <tag a={1}>{this.$slots.default}</tag>
                {this.value}
                <input type='text' value={this.value} on-input={this.input}/>
                // 给dom元素绑定属性和原生的事件 on-eventName
                </div>)
	},
	methods:{
        input(e){
           this.value = e.target.value
        }
    }
}
```

### 作用域插槽(scope-slot)

需求： 用户可以自定义列表组件,开发者在使用列表组件时，如果用户没有传入自己想要渲染的 html 标签元素，则内部再用默认的 html 元素进行渲染，如果传了则用用户自己定义的。

目的是用户自定义组件的内容

```
<List :data='data' tag='span'></List>
```

方法一：

```vue
<List :data='data' :render='render'></List>

export default {
	methods:{
		render(h, item){  //这里传h的原因是 jsx默认要使用createElemnt方法
			return <span>{item}<span>
		}
	}
}



List组件
<template>
	<ul>
		<template v-for='a in arr'>
            <xxx v-if='render':key='a' :render='render' :item='a'></xxx>
            <li v-else :key='a'>{{ a }}</li>
         </template>
	</ul>
</template>
<script>
    import xxx from './xxx.js'
    export default {
        props:['arr','render'],
        components:{
            xxx
        }
    }
</script>
```

xxx.js

```jsx
export default {
  props: ['render', 'item'],
  render(h) {
    return this.render(h, item);
  }
};
```

方法一借助了 vue 中的函数式组件来渲染用户的自定义行为。

方法二：

借助作用域插槽

匿名插槽：

![image-20211106160619727](.\typora-user-images\image-20211106160619727.png)

![image-20211106161440799](.\typora-user-images\image-20211106161440799.png)

![image-20211106161451532](.\typora-user-images\image-20211106161451532.png)

具名插槽：

![image-20211106161656594](.\typora-user-images\image-20211106161656594.png)

![image-20211106161728331](.\typora-user-images\image-20211106161728331.png)

![image-20211106163029874](.\typora-user-images\image-20211106163029874.png)

![image-20211106164715159](.\typora-user-images\image-20211106164715159.png)

### message 组件

模拟的是 element-ui 组件库中 message 组件。

用法：

- this.$message( {options} )

- import { Message } from 'element-ui'

  Message(options) 或者 Message.success(options)

原理：

对于消息弹框组件，当该组件被触发的时候，会在 body 标签的最后面追加一个 div。而不是放在了 id='app'的那个元素中。所以弹框是相对于真个页面的。

Message 组件：

```js
import MessageComponent from './Message.vue';
import Vue from 'vue';
const Message = {
  success(options) {
    //触发该方法时创建一个组件并将组件插入到body最后
    //将Message.vue文件挂载到内存中，挂载完后可以拿到内存中的真实 dom 元素
    let vm = new Vue({
      render(h) {
        return h(MessageComponent);
      }
    }).$mount();
    document.body.appendChild(vm.$el); //将内存中的dom元素取出来挂载到页面中。这样每次点击时都会生成一个新的组件并插入到页面中
  }
};
export { Message };
```

Message 组件第二版(通过数据驱动)：

```js
import MessageComponent from './Message.vue'
import Vue from 'vue'
const Message ={
	success(options){
		//触发该方法时创建一个组件并将组件插入到body最后
		//将Message.vue文件挂载到内存中，挂载完后可以拿到内存中的真实 dom 元素
		let vm = new Vue({
			render(h){
				return h(MessageComponent)     //这种情况下是不好使用ref来获取MessageComponent实例的。
			}
		}).$mount()
        vm.$children[0].add(options)
		document.body.appendChild(vm.$el)  //将内存中的dom元素取出来挂载到页面中。这样每次点击时都会生成一个新的组件并插入到页面中
	}
}
export {
	Message
}
//上面这种写法存在问题：
每次外部调用Message.success(options)方法时，都会创建一个新的vm实例然后追加到页面上，没有实现累加的效果


进一步的改进：采用单例模式,也利用了闭包


import MessageComponent from './Message.vue'
import Vue from 'vue'

let instance
let getVueInstance = () => {
    instance = new Vue({
			render(h){
				return h(MessageComponent)
			}
	}).$mount()
    document.body.appendChild(instance.$el)
}

// getVueInstance() 将函数getVueInstance的调用放在这里其实并不好，因为一上来不论用户点击消息弹窗与否，都会创建一个消息弹窗实例，更好的做法是将getVueInstance放在success方法内部在先判断instance是否存在的情况下再决定是否调用。

const Message ={
	success(options){
        !instance && getVueInstance()
        instance.$children[0].add(options)
	}
}
export {
	Message
}

export default {
    install (_Vue){
        //在install 方法中可以  1. 注册全局组件    2.注册全局指令    3.往原型上添加方法或者属性
        let $message ={}
        Object.keys(Message).forEach(key=>{
            $message[key] = Message[key]
        })
        _Vue.prototype.$message = $message
        //注意：其实上一行代码可以这样写  _Vue.prototype.$message = Message  。但是姜文来时给出的回答是：他这么做是不希望用户能改写Message中的方法，所以他选择先拷贝一份再去使用

    }
}

```

MessageComponent 组件(通过数据驱动)：

数据驱动的思想是：

在 MessageComponent 组件中有一个数组，每次点击按钮时就往数组中追加一个带有表示 id 的数据对象，组件内部循环这个数据对象进行动态的渲染。在清除组件弹框时直接清除该数组就行。

```vue
<template>
  <div>
    <div v-for="layer in layers" :key="layer.id">
      {{ layer.message }}
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return  {layers:[]}
    }，
    mounted(){
        this.id = 0
    },
    methods：{
    	add(options){   //在被外界调用并接收传参后，由于每一项都是一个对象类型的数据，这里还需要额外的增加一个当前对象的id，以便于之后定时器一到时间后用于找出并删除该对象。
            //这个id其实并不需要实现响应式能力，所以不必要初始化在该组件的data中，所以这里采用了在mounted中初始化
            let layer = {...options,id:++this.id}
            this.layer.push(layer)
            layer.timer = setTimeout(()=>{
                this.remove(layer)
            },options.duration)
        },
        remove(layer){   //清除定时器和移除弹层
            clearTimeout(layer.timer)
            this.layers = this.layers.filter(item=>layer.id!==item.id)
        }
	}
}
</script>
```

重点能力是：

- 在每次点击的时，能触发 MessageComponent 组件的某个方法并往该组件的 layers 数组中追加一项数据

- 要实现上面的能力就需要 MessageComponent 组件暴露一个方法，在外部去调用（可能的方案有： ref，$parent或者$children）

## vue.config.js

常用配置：

```js
let path = require('path');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/xxxx/' : '/',
  outputDir: 'assets',
  assetsDir: 'static',
  runtimeCompiler: true, //是否可以使用template模板
  parallel: require('os').cpus().length > 1, // 有多核cpu时启动并行压缩
  productionSourceMap: false, //生产环境下不使用sourceMap

  //改变原有的webpack配置
  chainWebpack: (config) => {
    config.resolve.alias.set('component', path.resolve(__dirname, 'src/component'));
  },

  //新增webpack插件
  configWebpack: {
    plugins: []
  },

  devServer: {
    // 代理
    proxy: {
      '/api': {
        target: 'http://xxxxx/xxx',
        changeOrigin: true
      }
    }
  },
  //第三方插件配置
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 插入全局样式
        path.resolve(__dirname, 'src/assets/common.less')
      ]
    }
  }
};
```

## JWT 认证

项目中 axios 的封装一般在工具库文件夹中。

utils/ajaxRequest.js:

```js
import axios from 'axios'

// 为了每个请求的连接器方法不同

class AjaxRequest{
    constructor(){
        this.baseURL = process.env.NODE_ENV === 'development'? 'http://xxxx/xx':'/'
        this.timeout = 5000
    }
    request(config){
        const instance =axios.create({
            baserURL:this.baseURL,
            timeout:this.timeout
        })
        // 公共的请求拦截器
        instance.interceptors.request.use(config=>{
            // ...
            return config
        },error =>{
            Promise.reject(error)
        })

        // 公共的响应拦截器
        instance.interceptors.response.use(res={
             // ...
             config.header.xxx='xxx'
             return res.data
         },error =>{
            Promise.reject(error)
        })

        return instance(config)
    }
}
export default new AjaxRequest()
```

在项目的创建一个文件夹——api，存放专门 ajaxRequest.js 工具包

请求后端的方法放在 api 目录下，有一部分将在 vuex 中进行调用

api/index.js

```js


export
```

## Vue 权限管理

在实际项目中，关于全选的控制的方式很多。一种如下：

在项目的 router 路由模块中定义一个和后端讨论好的整个项目中会跳转的路由规则表。但是整个项目默认一开始只有两个路由规则。当用户进入到项目中时，首先通过路由级别的拦截器去判断当前用户是否有权限（是否有权限存放在了 store 中），如果用户没有权限，则去服务端拉去权限信息,拿到权限后更具整个项目使用的路由规则表筛洗后再动态的添加路由。

```js
import Vue from 'vue'
import Router from 'vue-router'
imoort store from '../store/index'
import Home from './views/Home.vue'

Vue.use(Router)
export const authRoutes = [
    {
        path:"/cart",
        name:'cart',
        component:()=>import('@/views/Cart'),
        children:[
        	{
        		path:'cart-list',
        		name:'cart-list',
        		component:()=>import('@/views/CartList'),
                children:[
                    {
                        path:'lottery',
                        name:'lottery',
                        component:()=>import('@/views/Lottery'),
                    },
                    {
                        path:'product',
                        name:'product',
                        component:()=>import('@/views/Product'),
                    },
                ]
    		},
        ]
    }
]

const router = new Router({
    mode:'history',
    base: process.env.BASE_URL,
    // 默认一开始只有两个路由规则，之后根据用户的权限，解析出对应的路由规则，然后动态的加到该router对象中
    routes:[
        {
            path:'/',
            name:'home',
            component:Home
        },
        {
            path:'*',
            component:{
                render(h){
                    return h('h1',{},'Not Found')
                }
            }
        }
    ]
})

router.beforeEach(async (to,from,next)=>{
    if(store.state.hasPermission){
        // 有权限直接通过
        next()
    }else{
        // 没权限，先获取权限，访问后端，获取当前用户的权限存入vuex中，然后根据权限信息渲染导航菜单menu

        // 获取需要添加的路由
        let newRoutes = await store.dispatch('getNewRoute')
        // 动态添加路由
        router.addRoutes(newRoutes)
        next({...to,replace:true})
    }
})

export default router
```

store/index.js:

```js
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { authRoutes } from '../router.index.js';

Vue.use(Vuex);

axios.defaults.baseURL = 'http://localhost:3000';
axios.interceptors.response.use((res) => {
  return res.data;
});

const getTreeList = (menuList) => {
  let menu = [],
    routeMap = {},
    auths = [];
  menuList.forEach((m) => {
    auths.push(m.auth);
    m.children = [];
    routeMap[m.id] = m;
    if (m.pid === -1) {
      menu.push(m);
    } else {
      if (routeMap[m.id]) {
        routeMap[m.id].children.push(m);
      }
    }
  });
  return { menu, auths };
};

const formatList = (authRoutes, auths) => {
  return authRoutes.filter((route) => {
    if (auths.includes(route.name)) {
      if (route.children) {
        route.children = formatList(route.children, auths);
      }
      return true;
    }
  });
};

export default new Vuex.Store({
  state: {
    hasPermission: false,
    menuList: []
  },
  mutations: {
    setMenuList(state, menu) {
      state.menuList = menu;
    },
    setHasPermission(state) {
      state.hasPermission = true;
    }
  },
  actions: {
    async getNewRoute({ commit }) {
      // 发请求获取后端权限数据
      let { menuList } = await axios.get('/roleAuth');
      // 将后端返回的扁平化数据变为树结构
      let { menu, auths } = getTreeList(menuList);
      // 将该用户拥有的对应路由的权限有无
      commit('setMenuList', menu);
      let needRoutes = formatList(authRoutes, auths);
      commit('setHasPermission');
      return needRoutes;
    }
  }
});
```

服务端代码：

```js
const express = require('express')

const app = express()
app.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Content-type')
    res.header('Access-Control-Allow-Methods','*')
    res.header('Content-type','application/json;charset=utf-8')
    next()
})

app.get('/roleAuth',(req.res)=>{
    res.json({
        menuList:[
            {
                pid:-1,
                name:'购物车',
                id:1,
                auth:'cart'
            },
            {
                pid:1,
                name:'购物车列表',
                id:4,
                auth:'cart-list'
            },
            {
                pid:4,
                name:'彩票',
                id:5,
                auth:'lottery'
            },
            {
                pid:4,
                name:'商品',
                id:6,
                auth:'product'
            },
        ]
    })
})

app.listen(3000)
```

按钮级别的权限，一般后端会返回一个列表，说明哪些按钮有权限

```js
// 在store中
state：{
    btnPermission：{
        edit:true,
        add:false
    }
}
```

组件中使用的方式：

方式一：直接从 store 中取出（不建议）

```vue
<button v-if="$store.state.btnPermisson.edit">
    编辑
</button>
<button v-if="$store.state.btnPermisson.add">
    添加
</button>
```

方式二：封装指令

```vue
<template>
  <div>
    <button v-has="edit">编辑</button>
    <button v-has="add">添加</button>
  </div>
</template>

<script>
export default {
  directives: {
    has: {
      inserted(el, bindings, vnode) {
        // vnode中有一个非常常用的属性context，指的就是在指令所属的组件是谁
        let flag = vnode.context.store.btnPermisson[bindings['value']];
        !flag && el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
};
</script>
```

## 第四节

Vuex 是什么，怎么用，使用场景

vuex 持久化，vuex 中的数据是存在内存中的，代码属性会丢失

vuex 中 action 和 mutation 的区别

![image-20210829115121102](.\typora-user-images\image-20210829115121102.png)

项目入口文件：main.js

```js
import Vue from 'vue';
import App from './App.vue';
import store from './store.js';

new Vue({
  store,
  render(h) {
    return h(App);
  }
}).$mount('#app');
```

App.vue 文件：

```vue
<template>
  <div>
    App
    {{ $store.name }}
    {{ $store.getters.getName }}
  </div>
</template>
```

store.js 文件：

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); //默认调用该对象上的install方法并将VUe构造函数作为第一个参数传入install方法中

export default new Vuex.Store({
  state: {
    name: 'jack'
  },
  getters: {
    getName(state) {
      return state.name + ' li';
    }
  },
  mutations: {},
  actions: {}
});
```

```js
let Vue
const install = (_Vue){
	Vue = _Vue
	Vue.mixin(
		beforeCreate(){
        	if(this.$options && this.$options.store){
        		this.$store = this.$options.store
    		}else{
               this.$store = this.$parent && this.$parent.$store
            }
        }
	)
}

const forEach = (obj,cb)=>{   //自定义的工具方法迭代对象使用
    Object.keys(obj).forEach(key=>{
        cb(key,obj[key])
    })
}


class Store {
	constructor(options){
	 	this.state = options.state   //目前这种写法数据不具有响应式的能力，state中的状态数据一变并不会导致视图更新


        // vuex中实现state响应式的核心代码：这也是vuex高度依赖vue框架的原因。但是这样做了之后数据是有响应式的能力了，但是在去state中的状态数据时，需要这样取 ：$store.state.state.xxx
        this.state = new Vue({
            data(){
                return {state:options.state}
            }
        })


        //下面的写法解决了 $store.state.state.xxx这样的冗余取值问题
        this.s = new Vue({
            data(){
                return {state:options.state}
            }
        })




        //getters
        let getters = options.getters
       	this.getters = {}
        Object.keys(getters).forEach(getterName=>{
            Object.defineProperty(this.getters,getterName,{
                get:()=>{
                    return getters[getterName](this.state)
                }
            })
        })




        //mutations 发布订阅模式，先存下mutations配置项中的函数，然后在commit的时候触发回调并传入参数
        let mutations  = options.mutations
        this.mutations = {}
        Object.keys(mutations).forEach(mutationName=>{
            this.mutationns[mutationName] = (payload) =>{
                mutations[mutationName](this.state,payload)
            }
        })



        let actions = options.actions
      	this.actions ={}
        //forEach(actions,(actionName,fn)=>{
        //    this.actions[actionName] =(payload) =>{
        //        fn(this,payload)
        //    }
        //})


        Object.keys(actions).forEach(actionName=>{
            this.actions[actionName] = (payload)=>{
                actions[actionName](this,payload)
            }
        })

        this._modules = new ModuleCollection(options)  //收集依赖，把用户穿的options对象格式化为一个想要的树形结构

	}


    //原型对象上的方法：
    get state (){   //类的属性访问器
        return  this.s.state
    }

    commit = (mutationName,payload)=>{
        this.mutations[mutationName](payload)
    }

    dispatch('actionName',payload){
        this.actions[actionName](payload)
    }
}

class ModuleCollection (){
    constructor(options){

    }
}

export default {
	install
	Store
}
```

在 vuex 中的 mutaitiopns 中其实是可以写异步任务的。

原生的 vuex 强大的地方就是可以实现分模块。

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    a: {
      state: {
        a: 1 //分模块后的，在组件中的获取方式： this.$store.state.a.a
      }
    },
    b: {
      state: {
        b: 2
      }
    }
  },
  state: {
    age: 10
  },
  getters: {},
  mutaions: {},
  actions: {}
});
```

在 vuex 中会将当前用户传入的数据先进行格式化，因为用户写的配置对象的数据结构并不好分层次。

```
let root = {
	_raw:optins,
	_children:{
		a:{
			_raw:{},
			_children:{},
			state:{a:1}
		},
		b:{

		}
	},
	state:options.state
}
```

主流的 UI 框架有：

PC 端

- element-ui
- iview

移动端

- vant
- and-vue
- cube-ui

## 第六节

项目实战——移动端

- 选择列表

- 下拉加载

- 轮播

- 切换动画

移动端单位问题：

px,em,rem,vh,vw

在该项目中，使用 px 作为单位。但是仅仅用 px 并不能实现不同屏幕下的页面效果。这时需要使用插件，淘宝的 px2rem。

安装：

```
npm intall lib-flexible --save
npm install --save-dev px2rem-loader
```

该插件可以帮助将 px 转为 rem。

使用：

在 main.js 文件中引入'lib-flexible' 插件

```
import 'lib-flexible/flexible'
```

配置 vue.config.js 文件：

```
module.export = {
	chainWebpack:config => {
		config.module
			.rule('scss')
				.test(/.scss/)
				.oneOf('vue')
				.resourceQuery(/\?vue/)
				.use('px2rem')
				.loader('px2rem-loader')
				.options({
					remUnit:75
				})
	}
}
```

### 项目目录

assets:存放静态资源

component：存放公共的组件，放多个功能页面都用到的组件

views：存放功能组件页面，每个页面都是一个视图，当一个功能页面很大时，希望将该功能页面拆为许多小组件，但这些组件并不共用，就不应该放在 components 目录下，这时可以在 view 目录中就功能页面继续创建一个目录，存放入口文件和它的小组件。

router 目录

store 目录

utils 目录

api 目录

vue add xxx :表示用 vue 脚手架去安装某个插件，插件安装完成后，会改写项目的目录和结构

vue add cube-ui

项目安装完成后，默认设置 html 的字体大小为 37.5px。是移动端屏幕宽度的 1/10。

在 vue 的项目中在 vue-router 模块采用匹配后加载的方式加载并渲染组件时的注意情况：

```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/index.vue'
import Loading from '@/component/loading.vue'
//高阶函数
const loadable = (asyncFunction)=>{
    const component = ()=>{
        return {
            component:asyncFunction(),
            loading:Loading
        }
    }
    return {  //该方法最后返回一个组件，组件需要有render，然后在路由模块中调用render去渲染一个异步组件
        render(h){
           return h(component)
        }
    }
 }

Vue.use(Router)

export default {
	mode:'history',
	base:process.env.BASE_URL,
	routes:[
		{
			path:'/',
			name:'home',
            component:Home
		},
        {
            path:'/course',
            name'course,
            //异步组件
            component:()=>import('@/views/course/index.vue') //当该组件非常大的时候，会出现白屏
        },

    	{
            path:'/course',
            name'course,
            //异步组件
            component:loadable(()=>import('@/views/course/index.vue')) //当该组件非常大的时候，会出现白屏幕
        },



    	{
            path:'/profile',
            name'profile,
            component:()=>import('@/views/profile/index.vue')
        }，
        {
            path:'/profile',
            name'profile,
            component:loadable(()=>import('@/views/profile/index.vue'))
        }，
	]
}

//对于上面说到的白屏效果，为了避免白屏，做好增加一个loading页面，表示在匹配到对应路由后，先显示一个loading组件，在功能组件加载完后再替换掉loading组件,在vue的项目中已经提供此功能了，只需要配置一下就好。
```

路由组件的加载状态：

```js
异步组件的工厂函数可以返回如下格式的对象
const AsyncComponent =()=>{
	component:import('./Component.vue'),  //需要真正加载的组件
	loading:loadingComponent,   //异步组件加载时使用的组件
	error:ErrorComponent,   //加载失败时使用的组件
	delay:200,  //展示加载组件的延时时间，默认200
	timeout:3000  // 加载超时时间
}
```

在 utils 目录中专门写一个异步加载路由匹配组件的工具函数（高阶函数：函数的参数是另一个函数）

loadable.js

```js
//实现loading效果
import Loading from '@/component/loading.vue'

export default function loading(asyncCallback){
    const component = ()=>{
        component: asyncCallback(),
        loading: Loading
    }
    return {
        render(h){
            return h(component)
        }
    }
}
```

在 vue 的 component 配置属性中，该属性的值可以是引入的.vue 文件组件 或者 一个对象，对象中有一个 render 函数。

例子：

```
impport Home from '@/views/Home.vue'


component:Home


component:{
	render(h){
		return h('h1',{},['hello world'])
	}
}

```

监控路由中的路径变化：

可以解决在页面刷新的情况下，再次高亮刷新之前的导航栏情况，而不再使用默认的初始高亮项。同时希望页面一加载就让 watch 立刻执行一次。

```js
watch:{
    //$route(newVal, oldVal){.....}
     $route：{
         handler(newVal, oldVal){

    	 }，
         immediate:true
     }
}
```

![image-20210829202416679](.\typora-user-images\image-20210829202416679.png)

页面刷新时我的课程项目自动选中。

移动端中将 tab 栏固定到底部如果采用 position:fixed,会出现当活动屏幕时，tab 栏不断的抖动。所以建议采用 flex 布局。

![image-20210829202824335](.\typora-user-images\image-20210829202824335.png)

![image-20210829202851092](.\typora-user-images\image-20210829202851092.png)

### 项目对 axios 的封装

utils 目录下的 ajaxRequest.js 工具包，专门发送 ajax 请求

因为类能扩展，所以采用封装为类。对于项目的不同模块，请求的表现可能存在差异，给这个 axios 实例加的属性不一定在另一个 axios 实例上需要。 所以要保证 axios 实例对于不同模块可以保持唯一性。每次请求的时候都创建一个全新的 axios 实例，以实现对每个请求独立增加拦截器.

请求接口时，在开发环境下的请求接口是本地地址（localhost），上线时可能访问的是根路径下的某某文件（/xxx/xx）。

```js
import axios from 'axios'
import { Toast } from 'cube-ui'

class AjaxRequest {
    constructor(){
        this.baseURL = process.env.NODE_ENV !== 'production' ?  本地地址 :'http://xxxx:80/';
            //基础路径，每次请求时都带上这个路径，但可以区分开发环境还是生产环境以实现走不同路径
        this.timeout = 3000
        this.toast =Toast.$create({   //全局的loading弹窗，定为类属性避免多次创建多个弹窗组件实例
            txt:'正在加载中'，
            time：0
        })
        this.queue ={}  //请求的队列，每请求一次就往队列中追加一项，什么时候请求全部响应并结束后，在调用一次this.toast.hide()
    }
    request(options){
        //options 中可能有请求的路径，方法，header，数据
        let instance = axios.create()
        let config = {...options, baseURL:this.baseURL, timeout:this.timeout}  //将基础配置和用户设置的配置项进行合并

        this.setInterceptor(instance，options.url)  //给实例增加拦截器
        return instance(config)    //返回一个promise实例
    }

    setInterceptor(instance,url){
        //请求拦截
        instance.interceptors.request.use((config)=>{

            this.toast.show()  //这样写的话每有一个请求，就触发该实例上的show方法，导致看上去不断的屏闪loading组件

            //解决loading闪烁问题,这里采用的思想是，根据条件，只调用一次this.toast.show()
            //请求前增加请求队列
            if(Object.keys(this.queue).length ===0 ){
                this.toast.show()
               }
            this.queue[url] = url
            //这里可以开启显示loading
            return config
        }, (error) =>{
            return Promise.reject(error)
        })

        //相应拦截
        instance.interceptors.response.use((result)=>{

            delete this.queue[url]  //对应接口的请求完成后删除对应的queue中的url项
            if(Object.keys(this.queue).length ===0 ){
                this.toast.hide()   //当请求队列清空后，说明所有的请求都返回响应，则可以结束loading组件的全局展示
            }
            // this.toast.hide()
            // 可以在这里根据返回的状态码做各种匹配  和 关闭loading
            if(result.data.code === 0){
                return res.data.data
            }else{
                return res
            }
        },error=>{
            return Promise.reject(error)
        })
    }

}

export default new AjaxRequest   //外部引入该实例后可以调用该实例的request方法，方法内部创建一个axios实例去发请求。




使用：
new AjaxRequest.requset({
    url:"/xxx",
    methods
}).then((res)=>{...})
```

在封装好 axios 的请求工具包后，需要专门在一个 api 接口中去写一个调用方法来调用这个接口并传入路径。

在 api 目录中，可以根据各个不同功能路由页面去分页面调取。也可以分组件调取。

比如 home 路由模块：

```js
import axios from '@/utils/ajaxRequest.js';

export const fetchCategory = () => {
  axios.requset({
    url: '/xxx' //因为基础路径已经配好了,所以不同再写
  });
};
```

### 项目配置 vuex

对每个页面都封装一个 Vuex 模块，不是放在全局的 state 中。

页面组件中 dispatch(action) --->ajax --->commit (mutations) ----> 修改状态

store/index.js

```js
import Vue from 'vue';
import Vuex from 'vuex';
import home from './moudles/home';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    home
  },
  state: {
    //放全部组件都可以使用的数据状态
  },
  mutations: {},
  actions: {}
});

export default store;
```

store/modules/home.js

```js
import fetchCategory from '@/api/home'

export default {
	//如果模块不开启命名空间的话，当其他模块中的actions或者mutations中有同名的方法时，在一个组件中调用同名的方法时，则都会执行,解决办法，为模块开启命名空间。   在开启命名空间后，只能通过某个命名来调用对应模块中的方法。
	//开启命名空间后在组件中的调用方式  ： this.$store.dispatch('home/setXxxx'),
	//为了在组件中使用对应模块中的actions或者mutations，可以在组件中使用vuex中提供的方法，比如：mapActions('moduleName',['actionName'])
	namespaced:true,
	state:{

	}
	actions:{
		async setXxxx({commit},payload){
			let data = await fetchCategory()
			commit('setXxxx',data)
		}
	},
	mutations:{
		setXxxx(state.payload){
			state.xxxx = payload
		}
	}
}
```

在组件中使用分模块的 store 中的 actions，mutations 等的几种方式：

```
方式一：
this.$store.dispatch("moduleName/actionName")


方式二：
import { mapActions } from 'vuex'

methods:{
	...mapActions('moduleName', ['actionName'])
}


方式三：
import { createNamespacedHelpers } from 'vuex'
let { mapActions, mapState } = createNamespacedHelpers('moudleName')

methods:{
	...mapActions(['actionName'])
}
computed:{
	...mapState(['stateName'])
}
```

在 vuex 中常常会创建一个 actions-type.js 模块，专门用于存放公共的属性和变量，避免变量写错。

做 vuex 状态持久化的包——vuex-persistis

为什么使用 vuex 请求数据：

- 如果将数据请求接口写在每个页面中，每次页面切换导致数据丢失，下次回到该页面都要重新请求，但是如果对应组件中调用在 vuex 中对应模块的 actions 中发出请求，在请求回数据后将数据存放在 vuex 的 state 中后，再下次切换回对应也页面后就可以先判断 vuex 中是否有对应的数据，如果有就不再发送请求。 （只要用户不刷新）
- 对于数据和功能在多个页面中都使用到了，就可以实现复用。

可回收列表

一般的列表有一个特点，数据会多，导致生成许多的 dom 元素，不断滑动就能不断的增多新的 DOM 元素，当页面元素过多时可能有卡顿的效果。 而可回收列表就是控制列表 dom 元素的数量在一个合适的范围内。

### 取消 axios 请求

axios 中取消指定请求的方式：

```js
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/api/xxx', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
});

cancel();
```

在本项目中，每次发请求都会产生一个新的取消本次请求的实例。

```js
instance.interceptors.requset.use((config) => {
  let CancelToken = axios.CancelToken; //CancelToken构造函数只存在于axios上而不存在于axios.create产生的实例上。
  config.cancelToken = new CancelToken(function (c) {
    //将能取消本次请求的取消方法 c 统一存放在全局的vuex中的状态中
    store.commit(type.PUSH_TOKEN, c);
  }); //在本次请求的配置对象中增加额外的配置属性
});
```

切换路由页面时就先将存放在 vuex 中的所有请求的取消函数取出来依次执行一次。 所以可以在全局的路由守卫中将所有的触发取消请求的 mutation 函数。

周边知识补充：

Object.values(obj) ：返回一个给定对象自身的所有可枚举属性值的数组，值的顺序与使用[`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)-in 循环枚举原型链中的属性 )

```js
var obj = { foo: 'bar', baz: 42 };
console.log(Object.values(obj)); // ['bar', 42]

// array like object
var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.values(obj)); // ['a', 'b', 'c']
```

### 登录

用户登录成功后，会将信息存放在 vuex 的全局状态中，在 vuex 中保存的和用户有关的信息有：

- 按钮权限
- 菜单权限
- 验证信息
- 用户头像
- token
- 用户名

权限校验，用户没有登录时是无法查看我的课程页面的，单击我的课程导航栏时判断是否有权限，没有权限则跳转到登录页面，同时通过在 url 地址栏访问我的课程时也是需要先判断是否有权限的。

在用户登录后，在用户的个人中心可以看到用户的一系列的权限列表项目，这些项目页面是动态加载的，刚开始打包时并不会打包该路由，只有在用户登录后才能**动态加载**该路由。

在首页中课程的详情页面，如果用户没有购买该课程，是无法看到对应课 程的观看按钮，按钮级别的权限。也是通过用户登录后返回按钮权限后，配置显示按钮。

![image-20210904202518240](.\typora-user-images\image-20210904202518240.png)

![image-20210904202539778](.\typora-user-images\image-20210904202539778.png)

当路由页面切换的时候，每次切换路由都会重新创建组件视图，这样会重新走一下组将创建阶段的生命周期函数，重新发起不必要的网络请求，如果希望避免这种情况，一般选择做缓存，使用——keep-alive 组件，它可以缓存组件对应的虚拟节点。

但是有些页面并不希望被缓存，这时就会将 keeo-alive 的部分写两份，一份由 keep-alive 包裹，一部分没有用 keep-alive 包裹，然后再在路由配置中设置一个条件，确定哪个路由对应的页面不走缓存。

```
<div class="container">
    <transition :name='move'>
        <keep-alive>
        	<router-view  v-if="$route.meta.kkepAlive"></router-view>
        <keep-alive>
    </transition>

    <transition :name='move'>
    	<router-view v-if="!$route.meta.kkepAlive"></router-view>
    </transition>
</div>
```

使用 keep-alive 后会有两个生命周期函数

- activated ( ) { } :页面切换回来时触发
- deactivated ( ) { } :页面切换离开时触发

滚动页面后，然后切换路由然后再切换回该页面，这时应该记录一下上次的滚动条的位置。获取到上次滚动位置的数据后存放在哪里的问题: 该位置数据并不会影响视图渲染，所以不必存在 vuex 中，因为存在 vuex 中的数据是被监听且是响应式的。 一般的选择是放在 sessionStorage 中，这样页面一关闭的话，就能自动清除。

补充：

在 vue 中，通过 this.$refs.xxx  获取的是组件实例，想要获取组件的dom节点的话，要使用this.$refs.xxx .$el 获取。

### 路由守卫

只有通过路由匹配渲染时，在匹配组件中才有的生命周期函数。

在路由守卫**beforeRouteEnter**函数中访问 this 时是 undefined，因为这时候还没渲染出对应的组件实例，但是如果想要获取组件实例，可以采用在 next( ) 中传入一个回调函数，回调函数的第一个参数就是组件实例。

注意点：该组件在 router 文件中使用了组件进行修饰，所以 beforeRouteEnter 这类路由级别的生命周期函数是写在该 course.vue 组件的脚本中的，当路由跳转时时无法触发 course.vue 组件内部写的路由级别的守卫的。

router/index.js 中：

```
{
    path:'/course',
    name'course,
    //异步组件
    component:loadable(()=>import('@/views/course/index.vue')) //当该组件非常大的时候，会出现白屏幕
},

loadable(()=>import('@/views/course/index.vue'))函数返回的组件中并没有定义路由级别的生命周期函数，而自己写的生命周期函数写在了course.vue组件文件中，所以匹配到/course路由时，将不会触发course.vue组件文件中写的路由级别的什么周期函数。除非改写为：

{
    path:'/course',
    name'course,
    component:()=>import('@/views/course/index.vue')
},
```

course.vue 组件：

```vue
<template>
  <div class="course">
    <h1>course</h1>
  </div>
</template>

<script>
export default {
  //  路由守卫
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(vm); //  vm代表当前组件实例，但是该回调函数会在当前组件创建完成后再被调用
    });
  },
  beforeRouteUpdata() {
    //  比如动态路由的动态阐述部分变化时，会触发该函数的执行      比如：/detail/1  变为  detail/2
  },
  beforeRouteLeave(to, from, next) {
    //  ...
  }
};
</script>

<style>
.course h1 {
  background-color: #afc;
}
</style>
```

每次切换页面时，都要实时的去获取判断当前用户的登录状态。但是不建议从 vuex 中去获取用户的登录状态，因为一刷新页面 vuex 中的数据就没有了。 在页面切换的时候，先去 vuex 中查看用户信息是否存在，如果不存在，就再次发送一个请求去获取数据并且验证当前用户是否登录。

用户登录成功后会有 token，每次发送请求时都带上 token，在后端用 token 去获取用户信息，如果有用户信息，则说明用户已经登录过了，token 验证失败则说明用户信息错误。

对于该项目而言一级路由组件的 meta 中设置了 needLogin 字段以判断页面是否是需要登录后才能访问的，但是对于该路由下面的子路由，其实是没有设置 needLogin 字段的。 已经登录的用户通过 url 地址栏还能访问到 login 页面 。

该项目中有两个组件是和 router/index.js 下面的路由组件分开的。是单独建立一个路由表，到时候，用户登录了并且需要哪些路由就动态的加载。如果说一开始就写死在 router/index.js 文件中的 routes 路由配置项中了，那么用户就有可能通过 url 渗透进入响应的页面。 在该项目中，这两个组件及其路由在用户没有登录的情况下压根不用打包和加载。是根据后端的权限动态的加载对应的组件。

扩展：vue 中路由跳转时一个栈结构，每次跳转都会产生一个历史记录，如果本次跳转希望将上次的跳转替换掉，在路由守卫中可以写为 `next({...to, replace:true})`

### Table 组件封装

功能

- 基本表格格式，以数据驱动表格的生成
- 隔行变色
- 表格边框
- 固定表头(表单滚动时，表头固定不动)
- 表头排序（配合后台完成）
- 操作列（自定义列中的内容为各种元素标签）
- 表单数据加载中的 loading 状态

该 demo 项目是基于 vue 官方提供的快速原型开发工具的。

```
npm install -g @vue/cli-service-global
```

启动项目(在原型项目中执行下列命令行指令)：

```
vue serve
```

项目依赖的其他包：

```
npm install stylus stylus-loader webpack lodash
```

写组件时，最先要想的是怎么设计它。

在给组件直接自定义一个标签属性时的情况:

```
<my-table border></my-table>
等价于下面写法：
<my-table :border="true"></my-table>
```

### vue3.0 响应式原理

基于 proxy 实现数据变更检测，vue2.0 是基于 defineProperty 实现的数据变更检测，性能比较低，递归消耗内存。

vue3.0 的核心 API：composition API ，这些 API 都是基于函数方式的。

响应式模块是基于 composition API，先学习 composition API 在学习 proxy 的实现。

vue3.0 采用 ts 进行支持类型推断并重写源码，以前想要 vue 支持 ts 可能要使用到类的装饰器（@）。类的装饰器并不支持后期更新语法会更改，不灵活。为了更好的提示类型推断，vue3.0 都采用了函数式编程而不用类。内部方法基本都采用函数的方式，再也看不到 new Vue 这样的调用方式。

以前用 vue2.0 存在很多问题：

- 数据通信和组件间共享数据和方法会采用所谓的高阶函数（高阶组件：把共同的方法都放在父级组件或者函数中去做，用父级组件去渲染不同的子组件，这是就必须要使用一个副父级组件，这样会导致无意义的渲染一层父级）
- mixin 的缺陷，比如默认组件中可能有一些自己的属性或者数据，使用 mixin 可能导致变量名冲突
- 作用域插槽则可能导致数据来源不明确

composition API 的特点：

- 写简单易懂
- 将逻辑进行耦合，以前是方法写在 methods 中，数据写在 data 中，computed 属性也单独放，代码分散。
- 将多个方法组合进行使用

```html
<div id="app"></div>

<script>
  const App ={
  	setup(){   //等级于之前的created 生命周期函数，只会执行一次
  		let state = Vue.reactive({name:'jack'})\
  		function change(){   //在vue2.0中methods中的方法的this是用bind函数绑定死的，但是在vue3.0中函数中的this就不会固定了
  			state.name = 'tom'
  		}
  		return {
  			state,
  			change
  		}
  	}
  	template:'<div @click="change">{{state.name}}</div>'
  }
  Vue.createApp().mount(App,app)
</script>
```

公用方法，比如获取鼠标位置的功能函数，这个函数会在许多地方被使用，以前的写法是写在 vue 的原型对象上，现在的写法是：

```html
<div id="app"></div>

<script>
     function usePosition(){
         let position = Vue.reactive({x:0,y:0})
         function update(e){
             position.x = e.pageX
             position.y = e.pageY
         }
         //下面的这两个生命周期谁都不属于，usePosition在哪里用，下面两个生命周期就属于谁，相当于将生命周期的方法单独抽离到一个函数中，
         Vue.onMounted(()=>{
             window.addEventListener('mousemove',update)
         })
         Vue.onUnmounted(()=>{
             window.removeEventListener('mousemove',update)
         })
         return {
             position
         }

         return Vue.toRefs(position)
     }


  const App ={
  	setup(){   //等级于之前的created 生命周期函数，只会执行一次
  		let state = Vue.reactive({name:'jack'})
             let { position } = usePosition()
             let {x,y} = usePosition()
  		function change(){   //在vue2.0中methods中的方法的this是用bind函数绑定死的，但是在vue3.0中函数中的this就不会固定了
  			state.name = 'tom'
  		}
  		return {
  			state,
  			change
  		}
  	}
  	template:`<div @click="change">{{state.name}}----{{position.x}}---{{position.y}}
     	{{x}}----{{y}}</div>`
  }
  Vue.createApp().mount(App,app)
</script>
```

```
定义响应式数据：
Vue.reactive({name:'zf'})

//副作用
Vue.effect(()=>{
	...
})
```

```js
//能实现代理第一层对象

function reactive(target){

    return createReactiveObject(target)
}

//判断是否是对象
function isObject(val){
    return typeof val ==='object' && val!==null
}

//创建响应式对象
function createReactiveObject(target){
    if(!isObject(target)){
        return target
    }
    let baseHandler = {
        get(target,key,receiver){
            let result = Reflect.get(target,key,receiver)
            return result
            // return target[key]
        },
        set(target,key,value,receiver){
            //target[key] = value  //这样写的缺陷，如果设置没有成功（对象属性的属性描述符writable为false）
            let result = Reflect.set(target,key,value,receiver)
            return result   //true  or  false
        },
        deleteProperty(target,key){
            let result = return Reflect.deleteProperty(target,key)
            return result
        }
    }
    let observed = new Proxy(target,baseHandler)
    return observed
}

reflect的优点：不会报错而且有返回值，可以替代Object上的方法
```

```js
//能实现代理第二层对象

let toProxy = new WeakMap()  //弱引用映射表，放置原对象和代理过的对象
let toRaw = new WeakMap()  //被代理过的对象：原对象

function reactive(target){
    return createReactiveObject(target)
}

//判断是否是对象
function isObject(val){
    return typeof val ==='object' && val!==null
}

//创建响应式对象
function createReactiveObject(target){
    if(!isObject(target)){
        return target
    }
    let proxy = toProxy.get(target)  //如果target对象已经被代理过，则将代理过的结果返回即可
    if(proxy){
        return proxy
    }

    if(toRaw.has(target)){   //防止代理过的对象被再次代理
        return target
    }

    let baseHandler = {
        get(target,key,receiver){
            let result = Reflect.get(target,key,receiver)
            return isObject(result) ? reactive(result) : result
            // return target[key]
        },
        set(target,key,value,receiver){
            //target[key] = value  //这样写的缺陷，如果设置没有成功（对象属性的属性描述符writable为false）
            let result = Reflect.set(target,key,value,receiver)
            return result   //true  or  false
        },
        deleteProperty(target,key){
            let result = return Reflect.deleteProperty(target,key)
            return result
        }
    }
    let observed = new Proxy(target,baseHandler)
    toProxy.set(target,observed)
    toRaw.set(observed,target )
    return observed
}

//避免多层代理和对元对象的再次代理
//hash表  映射表
let toProxy = new WeakMap()  //弱引用映射表，放置原对象和代理过的对象
let toRaw = new WeakMap()  //被代理过的对象：原对象




```

proxy 的递归并不是一上来就递归，而是在取值时，有必要递归时再递归。多层代理通过 get 方法返回内存对象的代理对象实现。

proxy 的不足是兼容性差。

```js
let toProxy = new WeakMap()
let toRaw = new WeakMap()

function reactive(target){
    return createReactiveObject(target)
}

function isObject(val){
    return typeof val ==='object' && val!==null
}


function createReactiveObject(target){
    if(!isObject(target)){
        return target
    }
    let proxy = toProxy.get(target)
    if(proxy){
        return proxy
    }

    if(toRaw.has(target)){
        return target
    }

    let baseHandler = {
        get(target,key,receiver){
            let result = Reflect.get(target,key,receiver)
            return isObject(result) ? reactive(result) : result

        },
        set(target,key,value,receiver){
            console.log(key,value)
            //区分改属性和新增属性
            let hasKey = hasOwn(target,key)
            let oldValue = target[key]
            let result = Reflect.set(target,key,value,receiver)
             if(!hasKey){
                console.log('新增属性')
            }else if(oldValue !== value ){   // 这里表示旧属性更改过了,为了屏蔽无意义的修改
                console.log('修改属性')
            }


            return result
        },
        deleteProperty(target,key){
            let result = return Reflect.deleteProperty(target,key)
            return result
        }
    }
    let observed = new Proxy(target,baseHandler)
    toProxy.set(target,observed)
    toRaw.set(observed,target )
    return observed
}

function hasOwn( target, key ){
    return target.hasOwnProperty(key)
}

let arr = [1,2,3]
let proxy = reactive(arr)
proxy.push(4)  //这会触发两次set函数
// 分别输出 ： 3  4 （表示索引3设置值为4）  和  length  4 （表示设置length属性的值为4）
//

```

数组的 push 方法做了两件事：

- 在原数组末尾追加一个元素项
- 将数组的 length 属性加一

**依赖收集(发布订阅)：**

```js
//栈结构
//响应式（副作用函数）
function effect(fn) {
  //把fn变为响应式的函数
  let effect = createReactiveEffect(fn);
  effect();
}

function createReactiveEffect(fn) {}
```

### 核心原理

数据和模板进行编译，编译为最终想要的结果再将该结果渲染到页面上。如果没有指定 el 或者 template 或者 render 函数的话，则不进行任何编译渲染。

```html
<div id="app">
  <input type="text" v-model="school.name" />
  <div>{{school.name}}</div>
  <div>{{school.age}}</div>
  <ul>
    <li>1</li>
    <li>2</li>
  </ul>
</div>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      school: {
        name: '珠峰',
        age: 10
      }
    }
  });
</script>
```

```js
//基类：负责调度其他类或者方法办事情
class Vue{
    constructor(options){
        //new Vue的实现上会传入一个配置对象参数，同时实例对象上有一系列的属性和方法，比如this.$el this.$option  this.$data  ,这些属性都来自new Vue时传递的配置对象options中。

        this.$el = options.el
        this.$data =options.data
        this.$options = options
        //....

        if(this.$el){

             new Observer(this.$data)   //该类的作用是循环其中的每一项，并由Object.defineProperty重新定义属性

            //编译模板,编译el指代的dom元素及其后代节点组成的字符串模板
            //this.$el待编译的模板     this.$data 数据

            new Compiler(this.$el,this)
        }

    }
}


class Compiler{
    constructor(el,vm){
        this.vm = vm
        //在options中的el可能的格式有：字符串， DOM节点，所以需要判断el的数据类型
		this.el = this.isElementNode(el) ? el : docuemnt.querySelector(el)
        //把当前节点中的元素获取到并放在内存中
        let fragment = this.node2fragment(this.el)
        //把节点中的内容和数据进行替换(编译)
        this.compile(fragment)



        //把替换好的文档碎片再加到页面中
        this.el.appendChild(fragment)
    }

    //判断是否是DOM元素节点
    isElementNode(node){
        return node.nodeType === 1
    }

    //把当前节点中的元素获取到并放在内存中
    node2fragment(node){
        //创建一个文档碎片，将节点中的所有后代节点都放到文档碎片中
        //firstChild 可以获取到换行的非元素子节点
        let fragment = document.createDocumentFragment()
        let firtChild
        while (firstChild = node.firstChild){
            fragment.appendChild(firstChild)
        }
        return fragment
    }

    //编译文档碎片和数据
    compile(node){
        let childNodes = node.childNodes  //文档碎片的所有子节点（不包括后代）组成的类数组对象
        [...childNodes].forEach(child=>{
            if(this.isElementNode(child)){
                this.compileElement(child)
                //注意子元素内部可能还有自己的节点元素，所以需要递归遍历
                this.compile(child)
            }esle{
                this.compileText(child)
            }
        })
    }

    //编译DOM元素节点的方法
    compileElement(node){
        let attributes = node.attributes
        [...attributes].forEach(attr)=>{
            let {name, value:expr} =attr   // v-model   school.name
            if(this.isDirective(name)){
                let [,directive] = name.split('-')
                CompileUtil[directive](node,expr,this.vm)
            }
        }
    }

    //判断元素阶段的标签属性中s是否有Vue框架中的指令
    isDirective(attrName){
        return attrName.startWith('v-')
    }

    //编译文本节点的方法
    compileText(node){
        //注意不能使用node.innerHtml，因为它获取的是节点中的文本节点而不是文本对应的字符串
        let content = node.textContent
        if(/\{\{(.+?)\}\}/.test(content)){
            CompileUtil['text'](node, content, this.vm)
        }
    }
}


//编译工具，不同的功能要调用该对象内部不同的函数,独立于所有类，能在所有类中被调用
CompileUtil = {

    model(node,expr,vm){  //node是文档碎片中的dom元素节点 ，expr是该节点标签属性上的属性对应的值， vm则是 new Vue时创建的根实例，上面有$data等数据可用
        //该方法是给表单控件设置value属性
        // node.value = xxx
        let fn = this.updater['modelUpdater']
        let value = this.getVal(vm,expr)
        fn(node,value)
    },

    html(){
        // node.innerHTML = xxx


    },

    text(node , expr, vm){
        let fn = this.updater['textUpdater']
        let content = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(vm,arg[1])
        })
    	fn(node,content)
    },

    updater:{
        modelUpdater(node,value){
            node.value = value
        },
        htmlUpdater(){

        },
        textUpdater(node, value){
            node.textContent = value
        }

    },

    getVal(vm,expr){
		return expr.split('.').reduce((data,current)=>{
            return data[current]
        },vm.$data)
    }
}
```

补充知识：

str.replace(regexp|substr, newSubStr|function)

方法返回一个由替换值替换掉匹配到的项后的新字符串，匹配模式有部分匹配和全局匹配。

模式可以是一个字符串或者一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。**如果`pattern`是字符串，则仅替换第一个匹配项。** 可以指定一个函数作为第二个参数。在这种情况下，当匹配执行后，该函数就会执行。 函数的返回值作为替换字符串。 另外要注意的是，如果第一个参数是正则表达式，并且其为全局匹配模式，那么这个方法将被多次调用，每次匹配都会被调用。

不会影响原字符出。

模板编译好后，接下来要做的就是当改变 this.$data 中的属性后视图更新。也就是说在给对象属性赋值的时候，监控到对属性的操作。这就是 vue 中的数据劫持。 以前定义一个属性是 `let obj = {name:'jack' , age:20}` ，现在的定义方式是：Object.defineProperty(obj,key,descriptos)。

```js
class Observer {
  constructor(data) {
    this.Observer(data);
  }

  //对数据进行观察
  observer(data) {
    if (data && typeof data == 'object') {
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }

  defineReactive(obj, key, value) {
    this.observer(value); //递归绑定get和set
    Object.defineProperty(obj, key, {
      get: () => {
        return value;
      },
      set: (newVal) => {
        //在更新数据的同时，让组件视图进行更新
        if (newVal !== value) {
          this.observer(newVal);
          value = newVal;
        }
      }
    });
  }
}
```

![image-20210911090522570](.\typora-user-images\image-20210911090522570.png)

![image-20210911090743966](.\typora-user-images\image-20210911090743966.png)

![image-20210911090915322](.\typora-user-images\image-20210911090915322.png)

截至目前数据劫持类（Observer）和 模板编译类（Compiler）没有具体关系，应该实现的能力是数据一边就重新编译。为了让两者产生联系，就使用了一种设计模式——发布订阅（观察者模式）。

```js
//每个实例就是一个观察者
class Watcher{
	constructor(vm, expr, callback){
        this.vm = vm    //存在类的实例对象上作为属性这要是为了在原型对象上的方法中方便取用
        this.expr = expr
        this.callback = callback
        //每new Watch实例后，当数据变化了，应该对新值和老值进行比较，不同才调用callback
        // 默认先存放一个老值
        this.oldVal = this.get()
    }

    //CompileUtil是全局定义的工具函数的对象，前面独立于任何类之外创建的

    get(){
        Dep.target = this  //先将watcher自己放在Dep构造函数上作为静态属性
        let value = CompileUtil.getVal(this.vm, this.expr)   //这步骤同步执行完成后再执行下一步
        Dep.target = null //先将watcher自己放在Dep构造函数上作为静态属性，不取消则任何值都会添加watcher
        return value
    }

    update(){  //更新操作，数据变化后会调用该方法
        let newVal = CompileUtil.getVal(this.vm, this.expr)   //注意，当代码中通过vm|this.xxx = xxxx时，因为是引用数据类型，所以这时是可以直接取到最新的值的。
        if(newVal !== this.oldVal){
            this.callback(newVal)
        }
    }
}


上面的观察者在对数据进行监视后，还需要一个地方存放每个观察者的地方，到时候数据一变，让所有的观察者依次执行update

class Dep{
    constructor(){
        this.subs = []   //存放所有的watcher
    }

    //订阅
    addSub(watcher){   //添加watcher
        this.subs.push(watcher)
    }

    //发布
 	notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}




class Observer{
	constructor(data){
		this.Observer(data)
	}

	//对数据进行观察
	observer(data){
		if(data && typeof data == 'object'){
            for(let key in data){
                this.defineReactive(data,key,data[key])
            }
        }
	}

    defineReactive(obj, key, value){
        this.observer(value)  //递归绑定get和set
        let dep = new Dep()   //给每一个函数都加上一个具有发布订阅的功能，   该defineReactive函数能形成一个闭包，每次执行都创建一个只属于当前闭包的dep实例。   某一个数据变化，只会对应触发该数据自己的闭包中的dep中的subs属性中存放的watcher的update方法
        Object.defineProperty(obj, key, {
            get:()=>{
               	//创建watcher实例时，会在Watcher构造函数中执行this.get()，this.get()方法中会调用CompileUtil.getVal(this.vm, this.expr)，这样就触发了vm.$data中的get方法，即当前的这个get方法。在
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set:(newVal)=>{  //在更新数据的同时，让组件视图进行更新
                if(newVal !==value){
                    this.observer(newVal)
                    value = newVal
                    dep.notify()
                }

            }
        })
    }
}









//编译工具，不同的功能要调用该对象内部不同的函数
CompileUtil = {

    model(node,expr,vm){  //node是文档碎片中的dom元素节点 ，expr是该节点标签属性上的属性对应的值， vm则是 new Vue时创建的根实例，上面有$data等数据可用
        //该方法是给表单控件设置value属性
        // node.value = xxx
        let fn = this.updater['modelUpdater']
        new Wather(vm,expr,(newVal)=>{  //这是在给inpyut输入框添加一个观察者，如果之后数据更新会触发该watcher上的update中方法，再触发该fn方法
            fn(node,newVal)
        })
+++        node.addEventListener('input',(e)=>{
+++            let value = e.target.value   //获取表单控件中用户输入的值，用来更新数据，数据一旦变化会基于前面的set自动触发视图更新
+++            this.setValue(vm,expr,value)
+++        })
        let value = this.getVal(vm,expr)
        fn(node,value)
    },

+++   setValue(vm ,expr,value){
+++        expr.split('.').reduce((data,current,index,arr)=>{
+++            if(arr.length-1 === index){
+++                 return data[current] = value   //这步赋值会触发对应cm.$data中数据的set方法
+++            }
+++            return data[current]
+++       },vm.$data)
+++    }

    html(){
        // node.innerHTML = xxx


    },

    text(node , expr, vm){
        let fn = this.updater['textUpdater']
        let content = expr.replace(/\{\{(.+?)\}\}/g,()...args=>{
            new Watcher(vm,args[1],(newVal)=>{  //表达式可能是{{xxx.xxx}}---{{xxx.qqq}}等有多个插值表达式，所以要对双大括号中的每一个数据都进行监视
            	fn(node,this.getContentValue(vm,expr))
        	})
            return this.getVal(vm,arg[1])
        })
    	fn(node,content)
    },

    getContentValue(vm,expr){
        return expr.replace(/\{\{(.+?)\}\}/g,(..args)=>{
          return this.getVal(vm,args[1])
        })
    }

    updater:{
        modelUpdater(node,value){
            node.value = value
        },
        htmlUpdater(){

        },
        textUpdater(node, value){
            node.textContent = value
        }

    },

    getVal(vm,expr){
		return expr.split('.').reduce((data,current)=>{
            return data[current]
         },vm.$data)
    }
}

vm$watch(vm, key, (newVale)=>{
    ....
})
```

截至上面，数据改变可以驱动视图更新，但是视图改变并不能影响数据。为此，需要给视图表单控件加上事件，一旦输入则更新对应的数据（上面的代码已经加上了）

基于前面的代码，在取 vue 实例上的 data 中的值时，需要通过 vm.$data.xxx 的方式来获取。而在 Vue 的中是只需要通过 vm.xxx 的方式就能获取。为此就需要对数据进行代理，将 data 中的数据代理到 vm 上。

```js
class Vue{
    constructor(options){
        this.$options = options
        this.$data = options.data
        this.$el = options.el
        ...
        if(this.$el){
            new Observer(this.$data)

            //进行数据代理 将vm上的取值操作都代理到vm.$data中
            this.proxyVm(this.$data)

            new Compiler(this.$el,this)
        }
    }
    proxyVm(data){
        for(let key in data){
            Object.defineProperty(this,key, {
                get(){
                   return data[key]
                }
            })
        }
    }
}
```

上面的代码实现的 vue 的最为基本的核心源码。

### 计算属性

增加对 computed 的源码讲解,计算属性可以缓存，如果计算属性依赖的数据不变，则不用更新对应的计算属性。在计算属性的方法内部，有去取用$data中的数据，取值就会给在使用到计算属性的节点增加一个watcher，取用的$data 中的数据一旦变化，对应节点的视图也会更新。

```js
class Vue{
    constructor(options){
        this.$options = options
        this.$data = options.data
        this.$el = options.el
        let computed = options.computed
        ...
        if(this.$el){
            new Observer(this.$data)

            //进行数据代理 将vm上的取值操作都代理到vm.$data中

		   //在全局工具函数中的getVal函数中使用reduce的获取表达式的值是通过获取 vm.$data.xxx的方式获取的，而computed属性刚开始并不在vmm.$data中，所以需要先将computed属性代理到this.$data中，然后再代理到vm中。
            for(let key in computed){
                Object.defineProperty(this.$data,key,{
                    get:()=>{
                       return computed[key].call(this)     //核心，计算属性根据依赖的属性添加watch
                    }
                })
            }
            this.proxyVm(this.$data)  //注意代理顺序需要在computed属性代理到vm.$data之后再进行

            new Compiler(this.$el,this)
        }
    }
    proxyVm(data){
        for(let key in data){
            Object.defineProperty(this,key, {
                get(){
                   return data[key]
                }
            })
        }
    }
}
```

### methods 属性的原理

```js
class Vue{
    constructor(options){
        this.$options = options
        this.$data = options.data
        this.$el = options.el
        let methods =options.methods
        let computed = options.computed
        ...
        if(this.$el){
            new Observer(this.$data)

            //进行数据代理 将vm上的取值操作都代理到vm.$data中

		   //在全局工具函数中的getVal函数中使用reduce的获取表达式的值是通过获取 vm.$data.xxx的方式获取的，而computed属性刚开始并不在vmm.$data中，所以需要先将computed属性代理到this.$data中，然后再代理到vm中。
            for(let key in computed){
                Object.defineProperty(this.$data,key,{
                    get:()=>{
                       return computed[key].call(this)     //核心，计算属性根据依赖的属性添加watch
                    }
                })
            }

            //代理mehods中的方法
            for (let key in methods){
                 Object.defineProperty(this,key,{
                    get:()=>{
                       return methods[key].call(this)     //核心，计算属性根据依赖的属性添加watch
                    }
                })
            }


            this.proxyVm(this.$data)  //注意代理顺序需要在computed属性代理到vm.$data之后再进行

            new Compiler(this.$el,this)
        }
    }
    proxyVm(data){
        for(let key in data){
            Object.defineProperty(this,key, {
                get(){
                   return data[key]
                },
                set(newVal){
                    data[key] = newVal
                }
            })
        }
    }
}





//编译DOM元素节点的方法
compileElement(node){
    let attributes = node.attributes
    [...attributes].forEach(attr)=>{
        let {name, value:expr} =attr   // v-model   school.name
        if(this.isDirective(name)){
            let [,directive] = name.split('-')   //针对 v-on:click = 'change'
           	let [directiveName,eventName] = directive.split(':')

            CompileUtil[directiveName](node,expr,this.vm,eventName)
        }
    }
}


//编译工具，不同的功能要调用该对象内部不同的函数,独立于所有类，能在所有类中被调用
CompileUtil = {

    model(node,expr,vm){  //node是文档碎片中的dom元素节点 ，expr是该节点标签属性上的属性对应的值， vm则是 new Vue时创建的根实例，上面有$data等数据可用
        //该方法是给表单控件设置value属性
        // node.value = xxx
        let fn = this.updater['modelUpdater']
        let value = this.getVal(vm,expr)
        fn(node,value)
    },

    on(node,expr,vm,eventName){   //expr就是methods中的事件处理函数的函数名字   比如v-on:click='change'  中的change
   		node.addEventListener(eventName,(e)=>{
            vm[expr].call(vm, e)
        })
    },

    html(node,expr,vm){
        // node.innerHTML = xxx
        let fn = this.updater['htmlUpdater']
       	new Watcher(vm,expr,(newVal)=>{
            fn(ndoe,newVal)
        })
        let value = this.getVal(vm,expr)
        fn(node,value)
    },

    text(node , expr, vm){
        let fn = this.updater['textUpdater']
        let content = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(vm,arg[1])
        })
    	fn(node,content)
    },

    updater:{
        modelUpdater(node,value){
            node.value = value
        },
        htmlUpdater(node,value){
            node.innerHTML = value
        },
        textUpdater(node, value){
            node.textContent = value
        }

    },

    getVal(vm,expr){
		return expr.split('.').reduce((data,current)=>{
            return data[current]
        },vm.$data)
    }
}
```

## Vue 服务端渲染（SSR）

### 概念

SPA 应用都属于客户端渲染， 前端写好工程代码打包，在 html 中引入使用浏览器获取到 js 等文件后解析执行后渲染。服务端渲染主要是通过服务器渲染，相当于在服务器端将解析执行好的 html 结果交给客户端渲染，但是 html 中并没有实现 js 逻辑和 css 样式

- 客户端异步渲染不利于 SEO 搜索引擎优化
- SSR 直接将 HTML 字符串传递给客户端，大大加快首屏加载速度
- SSR 占用更过的服务端 CPU 和内存
- 一些常用的浏览器端 API 可能无法使用，像 vue，它有自己的生命周期，mounted，beforMount 都表示 DOM 加载完成或加载之前，这时候，我们只能在服务端调用其中的 beforCreate 和 created 两个生命周期函数，因为它们两个和 dom 没有关系

SSR(Server-Side-Rendering)与 CSR(Client Side Rendering)的区别

SSR:传统的渲染方式，由服务端把渲染的完整的页面 f 返回给客户端。这样减少了一次客户端到服务端的一次 http 请求，加快相应速度，一般用于首屏的性能优化。由 node.js 服务器直接先在服务端渲染出 HTML 页面。具体流程是：客户端请求到达后端后，后端拉取 cgi 接口数据，根据指出 bundle，生成 render 对象，而 render 对象将执行客户端代码构建 vdom，再生成 html 字符串填充进模板 html ，然后服务器返回被填充过的 html 资源，浏览器解析后加载 css，js，再 css 加载结束后触发 fp 和 fmp。然后是 vue 实例的初始化，接管后端直接生成的 html 资源以实现 html 页面的逻辑响应。

CSR:用户首次发送请求只能得到小部分的指引性 HTML 代码。第二次请求将会请求更多包含 HTML 字符串的 JS 文件。一般是静态资源服务器（CDN）直接返回渲染好数据的 html 资源，浏览器收到后，解析 html，加载 css，js，其中 css 资源加载结束后，页面会尽快的进行首屏渲染（fp），而 js 加载依赖完成后，vue 实例初始化，然后拉去页面中的数据最后页面渲染（fmp）。

**简而言之，就是数据拼接 HTML 字符串这件事放在服务端还是客户端造成了两者区别。**

![image-20210911212755255](.\typora-user-images\image-20210911212755255.png)

![image-20210911212809352](.\typora-user-images\image-20210911212809352.png)

![image-20210911212836989](.\typora-user-images\image-20210911212836989.png)

SSR 的不足：

- 对服务器提出更高的要求，生成虚拟 DOM 如果相对较长的运行和计算耗时
- 由于 cgi 拉取和 vdom 直出后才吐出 HTML 页面，FMP 虽然提前了，但是 FP 相对延迟
- 相比 CSR，SSR 渲染后，由于仍然需要进行依赖、vue 初始化，页面可交互时间并没有较大改善

### 服务端渲染的实现

前端项目开发时正常开发，在打包时将项目打包出两份。在项目的入口文件（main.js）中分别打包出一个 server entry 和 client entry 。打包还是依赖于 webpack。可以认为服务端渲染主要还是靠 webpack 来实现。 可以将服务端入口和客户端入口分别打包出两个 Bundle。通过服务端 Bundle 渲染出 html 字符串，这个 html 字符串会返给前端，但是 html 字符串中并没有一些 js 逻辑。需要再将打包出的客户端代码再挂载到 html 字符串中，这样 html 就能拥有 js 逻辑。

![image-20210911163927804](.\typora-user-images\image-20210911163927804.png)

技术点：

- webpack 配置
- koa 的应用
- vue 的基础 API

项目依赖：

```json
{
  "name": "vue-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "koa": "^2.13.1",
    "koa-router": "^10.1.1",
    "koa-static": "^5.0.0",
    "vue": "^2.6.14",
    "vue-router": "^3.5.2",
    "vue-server-renderer": "^2.6.14",
    "vuex": "^3.6.2"
  }
}
```

服务端基本代码：

```js
const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static'); //静态服务中间件
const Vue = require('vue');
const fs = require('fs');
const VueServerRender = require('vue-server-renderer'); //vue官方提供的做服务端渲染的包,它内部有一个渲染方法可用于渲染实例

const app = new Koa();
const router = new Router();
const vm = new Vue({
  //el:'#app'  这个配置选项是不能再写了的，因为服务端没有dom操作和元素一说
  data() {
    return {
      msg: 'hello yibo'
    };
  },
  template: `<div>{{msg}}</div>`
});

const template = fs.readFileSync('./template.html', 'utf8'); //模板中有vue-ssr-outlet占位符

//创建渲染函数
let render = VueServerRender.createRenderer({
  template
}); //创建一个渲染器

router.get('/', async (ctx) => {
  //通过渲染函数渲染上面创建的vue实例
  ctx.body = await render.renderToString(vm);
});

app.use(router.routes());

app.listen(3000);
```

全面的项目：

项目依赖：

```shell
yarn add webpack webpack-cli webpack-dev-server babel-loader @babel/preset-env @babel/core vue-style-loader css-loader vue-loader vue-template-compiler html-webpack-plugin  webpack-merge -D
```

package.json 文件：

```json
{
  "name": "vue-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "koa": "^2.13.1",
    "koa-router": "^10.1.1",
    "koa-static": "^5.0.0",
    "vue": "^2.6.14",
    "vue-router": "^3.5.2",
    "vue-server-renderer": "^2.6.14",
    "vuex": "^3.6.2"
  },
  "devDependencies": {
    "@babel/core": "^7.15.5",
    "@babel/preset-env": "^7.15.6",
    "babel-loader": "^8.2.2",
    "css-loader": "^6.2.0",
    "html-webpack-plugin": "^5.3.2",
    "vue-loader": "^15.9.8",
    "vue-style-loader": "^4.1.3",
    "vue-template-compiler": "^2.6.14",
    "webpack": "^5.52.1",
    "webpack-cli": "^4.8.0",
    "webpack-dev-server": "^4.2.0",
    "webpack-merge": "^5.8.0"
  }
}
```

webpack.config.js(这是一个能跑 vue 项目的基本的 webpack 配置：这是客户端使用的 webpack 配置文件)

```js
const path = require('path');
const VueLoader = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = (dir) => {
  return path.resolve(__dirname, dir);
};

module.exports = {
  entry: resolve('./src/main.js'),
  output: {
    filename: 'bundle.js',
    path: resolve('./dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoader(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('./src/public/index.html')
    })
  ],
  resolve: {
    extensions: ['.js', '.vue']
  },
  mode: 'development'
};
```

对于 webpack 的配置文件，一般不会放在项目的根目录下，在 vue 的项目中关于 webpack 的配置文件一般单独放在一个叫做 build 的目录下，专门用于做构建项目使用。

在服务端生成 html 字符串，但是字符串中要引入的 js 代码是前端项目中的客户端代码打包后生成的 js 文件，而不是服务端打包生成的 js 文件，服务端只是将 server 端打包后的结果生成为一个 html。html 中真正挂载的是 client 打包后的结果。、

在将项目代码针对客户端和服务器端分别都打包一份后，主要是给后台服务器去使用（koa），koa 服务器需要将服务端打包的结果渲染为字符串，返回给客户端，同时将 client bundle 挂载到 html 中。

流程总结：

先打包一个客户端和服务器端，服务端代码用于生成 html 字符串结构交给浏览器，然后再将挂载到 html 上。再进行客户端激活，让 html 字符串拥有 js 能力并实现前端的 SEO 优化。

面试问题：

Vue SSR 中的路由的跳转规则，什么时候是通过服务端渲染，什么时候又是通过前端路由来实现的？

面试问题：

- 虚拟 dom 是什么？
- 如何创建虚拟 DOM
- 虚拟 DOM 如何渲染为真实 DOM
- 虚拟 DOM 如何 patch
- 虚拟 DOM 的优势
- Vue 中的 key 的具体作用
- Vue 中的 diff 算法

浏览器直接操作 DOM 元素很耗费性能，开发者可以将 DOM 元素表示为一个 js 对象。元素 DOM 对象上有上百个属性，非常重。 创建虚拟 DOM 就是在创建一个 js 对象，把 DOM 树转为 js 对象树结构。
