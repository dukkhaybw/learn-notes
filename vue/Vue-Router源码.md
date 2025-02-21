# Vue-Router 源码解析（姜文）

核心点：

- 二级路由实现原理
- 动态路由
- `<router-view>`的嵌套使用
- `<router-link>`
- 函数式组件，jsx 语法

## vue-router 的项目根目录文件夹下

项目中 router.js 文件内容安排：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(VueRouter)  //使用Vue.use(),默认会调用传参(传参是函数时)或者传参对象的install静态方法,但VueRouter是对象写法时，则有一个instll方法，如果是类的写法时，则会有一个install的静态方法。

const routes = [
	{
		path:'/home',  //一级路由
        name:'home',
        component:Home
        children:[
            {
                path:'a',
                component:()=>import ('./xxx/xxxx/xxx.vue')
            },
            {
                path:'/home/a',
                component:{
                    render(h){
                        return <p>hello world</p>
                    }
                }
            }
        ]
	},
    {
		path:'/about',
        name:'about',
        component:About
        component：()=>import ('./views/About.vue')   //异步加载
	}
]

export default new VueRouter({  //导出的实例对象在main.js中引入，并被注入到根实例上
    mode:'hash',
    routes
})

//VueRouter可以通过new调用，所以是一个类或者构造函数，并且前面使用了Vue.use()方法传入这个类名，所以当前类上还有一个静态方法install() 方法。
```

vue-router 本质是 vue 框架的一个插件，依赖于 Vue ，但是在 vue-router 的源码中是没有用 import 的方式去引入 vue 的,但是在 vue-router 内部却能正常运行。（不在 vue-router 中引入 vue 的原因是 webpack 在打包时，如果解析到该插件中引入了 vue 作为依赖，那会将 vue 打包到 vue-router 中，增大打包体积，所以 vue 框架考虑了在调用 install 方法时，会将 Vue 构造函数作为实参传入到 install 方法中）。

对于 Vue 的所有插件，核心功能可能就是以下中的几件事：

- 注册全局属性，如 vue-router 中的$route , $router
- 注册全局指令，如 v-scroll
- 注册全局组件，如各种 UI 插件，`<router-view>`, `<router-link>`

## 手写 vue-router 插件

### vue-router 文件目录下的 index.js 入口文件

```js
//vue-router文件目录下的index.js入口文件
import install from './install.js';
import createMatcher from './create-matcher.js';
import HashHistory from './history/hash.js';

//一个类内部除了可以写实例上才有的属性和实例共享的方法 或者 类的静态属性或者方法时，还可以写一些其他逻辑,但是是写在constructor中。
//在new VueRouter()时会传入一个配置对象，配置对象内有routes等
export default class VueRouter {
  constructor(options) {
    //路由：根据不同的路径跳转不同的组件
    //options中的routes 的路径和组件的数据结构需要进行优化（对象打平），方便之后获取url后直接渲染对应的组件
    this.matcher = createMatcher(options.routes || []); //该方法的返回值中有两个方法：match负责匹配路径，   addRoutes动态添加路由配置

    //createMatcher创建匹配器，内部会格式化（数组扁平化）开发者设置的routes属性，并提供两个方法，用来添加或匹配对应的路由和组件

    this.$options = options;

    //创建路由系统,内部放路由跳转的方法，如： history.push()  或者  this.$router.push() ...
    //一般有一个属性 mode   this.mode:'hash' | 'history'
    this.mode = options.mode || 'hash'; //根据模式来创建不同的路由对象，路由对象其实就是一个类，公共的方法放在基类上， new HashHistory   或者  new H5History
    this.history = new HashHistory(this); //this指的就是VueRouter的实例，这样做后，就能在HashHistory函数内部中获取到VueRouter的实例并可以调取实例的属性或者共享的原型上的方法。
  }

  //实例方法，存放在原型中，初始化
  init(app) {
    //init函数的作用是初始化路由应用，但是为了方便路由应用，我们会创建一个匹配器matcher，匹配器的作用是先将用户传入的路由规则扁平化，之后在使用时，当url中的路径变化，可以方便的截取到路径部分，并用路径去已经扁平化好的对象中找出对应的记录    app指代的就是根实例       init方法在根实例的beforeCreate中被调用
    //首先获取到路由系统，先根据当前路径显示指定的组件
    const history = this.history;
    const setUpHashListener = () => {
      history.setupListener();
    };
    history.transtionsTo(history.getCurrntLocation(), setUpHashListener);
  }

  match(location) {
    //该函数的作用是代码分成，中转
    return this.matcher.match(location);
  }
}

//Vue.use(VueRouter)默认调用下面的install方法
VueRouter.install = install; //源码中将install方法单独抽离为install.js文件
```

格式化用户在创建 router 实例时配置对象中的 routes：routes 的数据结构如下，将树结构格式化为数组结构，之后可以拿到用户访问的 hash 路径，然后直接去数组中查询到对应组件后直接取出并渲染。

```
const routes = [
	{
		path:'/home',  //一级路由
        name:'home',
        component:Home
        children:[
        	path:'a'
        ]
	},
    {
		path:'/about',
        name:'about',
        component:About
	}
]
```

### install.js 文件

为每个组件混入 beforCreate 函数，并调用调用了 init 方法。

```js
//install.js文件
//install函数就是一个入口方法，用于安装插件

export let _Vue;
export default function install(Vue) {
  //注意Vue框架只是将vue构造函数传给了install函数内部，所以只能在install 函数中访问到Vue构造函数，但是在vue-router文件目录下的index.js入口文件也想使用Vue构造函数要怎么办了？  设置可以通过在install方法内部将Vue构造函数赋值给一个外部变量并暴露出去就好。方法如下：
  _Vue = Vue;

  //该插件核心的方法，混入，可以通过混入，给根实例及其所有后代实例（组件实例）都添加属性或者方法等。
  //目的：将在main.js文件中的根实例上注入的router属性绑给根实例及其所有后代实例(即给所有的实例都添加一些方法或者属性)
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        //this.$options.router存在值，说明就是this就是根实例（new Vue（）实例 ）
        this._routerRoot = this;
        this._router = this.$options.router; //this.$options.router就是router模块 new VueRouter创建的实例对象。

        this._router.init(this); //这个this就是根实例
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot;
        //为什么不直接用this.$parent方式访问到父组件，而是要写为上面这种形式了？
        //为了让每个后代实例都有一个属性代表的是根实例：_routerRoot
      }
    } //vue框架内部会将这个生命周期函数放到各个实例中去和组件自有的beforeCreate都放在一个数组中，之后在组件被渲染时依次执行。    生命周期函数中的this指代的时正在被创建的实例
  });
}
```

createMatcher 创建匹配器核心函数：

```
//该方法的返回值中有两个方法：match负责匹配路径对象中的内容，（路径对象的大致格式：{'/':'记录','/about':'记录'，....}）                addRoutes动态添加路由配置对象数组
this.matcher = createMatcher(options.routes || [])
//createMatcher最终返回一个对象有  match 和 addRoutes
```

### create-matcher.js

```js
import creatRouteMap from './create-route-map.js'

export default function createMatcher(routes){   //routes为当前用户配置的路由规则
	//扁平化用户传入的路由规则配置对象，一个路径对应一个组件，创建路由映射表,初始化配置
    let { pathList, pathMap, namePath } = creatRouteMap(routes)  //该方法会将routes中的所有路径，也就是path项都提取出来，存放在一个数组中，如[ '/','/home','/about','/about/a','/about/b',....]   还会创建一个映射表 ，如：{ '/': '记录对象' ,'/about':'记录对象', '/about/b':'记录对象' ... } ,还有路径名的映射表namePath等

    //匹配的方法
    function match(loaction){
        //loaction是当前组件对应的路径部分，用它来找到记录中对应的组件，并生成一个匹配到的数组
        比如，如果locations是 /about/a  ，匹配到了{ path：'/about/a',component:a } 但是并不能直接就渲染该组件了，还必须找到它的父路径对应的组件，并先渲染父路径对应的组件，然后再在父组件的路由出口中渲染自己的组件。
    }

    //动态添加路由配置对象的中元素项
    function addRoutes(routes){   //添加新的配置 routes 和创建 router 实例时传入的配置像router一样的结构
        creatRouteMap(routes,pathList,pathMap)   //再次创建一个路由映射表，并添加到pathList 和 pathMap中去
    }

    //router.addRoutes([ path: '/aaa',component: 'xxx'])  在权限管理时用得比较多

    return {
        match
        addRoutes
    }
}
```

### create-route-map.js

扁平化用户传入的路由规则配置对象，一个路径对应一个组件，创建路由映射表,初始化配置。该方法会将 routes 中的所有路径，也就是 path 项都提取出来，存放在一个数组中，如[ '/','/home','/about','/about/a','/about/b',....] 还会创建一个映射表 ，如：{ '/': '记录对象' ,'/about':'记录对象', '/about/b':'记录对象' ... } ,还有路径名的映射表 namePath 等

```js
export default function creatRouteMap(routes,oldPathList,oldPathMap){   //将用户传入的数据格式化
	let pathList = oldPathList || []
    let pathMap = oldPathMap || Object.create(null) //没有原型链的的对象
    routes.forEach(route=>{
        addRouteRecord( route,pathList,pathMap )
    })

    return {
        pathList,
        pathMap
    }
}

/*route的数据结构{
	path:'/about',
    name:'about',
    component:About
	children:[{
		path:'a',
		name:'a',
		component:A
	}]
}

pathList的数据结构  [ '/','/home','/about','/about/a','/about/b',....]
pathMap的数据结构   { '/': 记录 ,'/about':记录, ... }
*/


function addRouteRecord( route, pathList, pathMap, parent){
    let path =parent?`${parent.path}/${route.path}`: route.path  //对于二级路由，将二级路由进行拼接
    let record = {
        path,
        component:route.component
        parent
    }
    if(!pathMap[path]){
        pathList.push(path)
        pathMap[path] = record
    }
    if(route.children){
        route.children.forEach(item=>{
            addRouteRecord(item,pathList, pathMap,route)
        })
    }
}
```

如果递归时，不传递 route 和判断 let path =parent?`${parent.path}/${route.path}`: route.path 则出现下图的情况，其中 "a" 其实应该对应的是/about/a ,b 也应该如此。

![image-20210606154223080](.\typora-user-images\image-20210606154223080.png)

下图是改进后的结果：

![image-20210529202010882](.\typora-user-images\image-20210529202010882.png)

**面试题：把树结构数据变为对象，把对象变为树结构。**

## history 文件目录下

### base.js 文件(基类)：

```js
export default class History{
     constructor(router){     //router就是new VueRouter后生成的实例，也被挂载到根实例上了
        this.router = router

         //默认路由中应该保存一个当前的路径后续会更改这个路径

         this.current = createRoute(null,{
             path:'/',
             matched:[]
         })

         //{
         //    path:'/about/a',
         //    matched:['/about' '/about/a']
         //}
    }
    transtionTo(location,onComplete){  //去到对应的路径之后，还需要监听路径变化
        //location将要跳转到的路径，要拿着它去路由映射表中查找相应的组件
        //onComplete跳转成功后执行的方法，如果不传就不执行
        let route =this.router.match(location)   //用当前路径找出对应的路由规则中的记录
        /about/a  => {path:'/about/a',matched:[aobut, aboutA]}

    }
}

export function createRoute(record, location){
   let res = []
   if(record){}
   return {
       ...location,
       matched:res
   }
}
```

### hash.js 文件：

```js
import History from './base.js';

function getHash() {
  return window.location.hash.slice(1); //这种写法不兼容Firefox
}

//HashHistory继承了父类——History
export default class HashHistory extends History {
  constructor(router) {
    //在router的入口文件index.js中调用 new HashHistory(this),this代的就是new VueRouter的实例对象。
    super(router);
  }
  getCurrentLocation() {
    //返回hash路由路径部分或者history的路径部分
    return getHash();
  }
  setupListener() {
    window.addEventListener('hashchange', () => {
      this.transtionTo(getHash());
    });
  }
}
```

![image-20210529210218868](.\typora-user-images\image-20210529210218868.png)

vue 中支持三种路由：

- hashHistory
- H5History
- abstruct（服务端使用）

极简版的 vue-router 实现：

```js
let _Vue

class VueRouter{

	constructor({routes}){
        let routerMap={}
        routes.forEach(item=>{
            if(!routerMap[item.path]){
                routerMap[item.path] = item
            }
        })

        this.routerMap = routerMap
        this.current = {
            path:'',
            component:{
                template:'<h1><h1>'
            }
        }

		this.listener()
	}

    listener(){
        window.addEventlistener('load',()=>{
            let hash = window.location.hash
            if(!hash){
                window.location.hash = '/'
            }
            hash = window.location.hash
            let cuurentRoute = this.search(hash.slice(1))
            if(cuurentRoute){
                this.current.path = cuurentRoute.path
                this.current.component = cuurentRoute.component
            }
        })
        window.addEventlistener('hashchange',()=>{
            let hash = window.location.hash
            let cuurentRoute = this.search(hash.slice(1))
            if(cuurentRoute){
                this.current.path = cuurentRoute.path
                this.current.component = cuurentRoute.component
            }

        })
    }

    search(path){
       if(this.routerMap[path]){
           return this.routerMap[path]
       }
        return null
    }
}


VueRouter.install =function (Vue,options){
    _Vue = Vue //vue构造函数的本地化
    Vue.mixin({
        beforCreate(){
            if(this.$options.router){   //this指代混入了该声明周期函数的实例或者组件实例
                this._routerRoot = this
                this._router = this.$options.router
                Vue.util.defineReactive(this,'_route', this.$options.router.current)
            } else {
              	this.__routerRoot = this.$parent && this.$parent._routerRoot
            }
        }
    })

   	Vue.component('router-link',{
        props:{
            to:{
                type:String
            }
        }
        render(h){  //h（ createElement() ）将虚拟dom结构转为真实dom结构
            return h('a',{ attrs:{href: '#'+ this.to }},this.$slots.default )
        }
    })
    Vue.component('router-view',{
        render(h){
            let component = this._routerRoot._router
            return h(component)
        }
    })
}


if(typeod Vue !== 'undefined'){  //在浏览器中通过cdn引入时，全局有Vue，在vue-router中则自动调用use。
     Vue.use(VueRouter)
}


//在vue-router中路由的响应式的实现是通过vue构造函数上的一个api实现的Vue.util.defineReactive ()
```
