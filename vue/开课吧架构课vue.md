# vue 架构课

## 组件化实战 p1

### 组件通信方式

- props

- $on/$emit

- eventBus

  在某些项目中，使用 eventBus 的方式是在 main.js 入口文件中为 Vue 构造函数的原型对象上添加一个属性$bus,该属性对应的值是 Vue 构造函数的一个实例。这样在该根实例下的所有组件实例都能通过原型访问到该属性，并在它上面订阅和发布事件。 因为每个 vue 的实例都有一个自己的事件池，都实现了事件发布订阅者模式。

  ```
  Vue.prototype.$bue = new Vue()
  ```

  兄弟组件（或者直接联系的组件）之间想借助 eventBus 实现组件间通信，那必须是使用同一个对象上的事件发布订阅能力。

- vuex

- $parent
- $childeren：借助索引访问具体的子组件实例，但是索引不能保证子元素的顺序
- $root：指向根组件实例
- $refs

使用上面的这几种方式进行组件化的通信的化，会增加组件之间的耦合性，不利于组件的复用。在开发通用的组件库的时候，开发者不能强制用户必须使用某些工具，所以不得不尽可能的借助 vue 中原生提供的方法来完成组件之间的通信。

- provide/inject

  这种方式传递的数据不是响应式的数据，但是可以传递一个具有 getter 和 setter 函数的对象以实现响应式。

  ```
  祖先组件
  provied(){
  	return{
  		vm:this
  	}
  }


  后代组件
  inject:['vm']

  inject:{
    vm1:'vm'
  }

  inject:{
    vm1:{
    	from:'vm',
    	default: '{}'
    }
  }
  ```

- $attrs/$listeners：在 ui 组件中常用来实现跨层级组件的传递标签属性

  在父组件中，对来自上层组件的数据进行自动展开，并传给自己的子组件，

  ```
  <son v-bind="$attrs"></son>

  对于son组件来说，它内部会将这些数据自动展开，并作为最外层原生dom元素的标签属性，同时在可以直接在自己组件内部通过$attrs.xxx的方式进行取用（class和style除外）

  <son v-on="$listeners"></son>

  $listeners上存放的其实是父组件事件池中的事件。在没有使用v-on展开给子组件时， 子组件想要使用父组件$listeners上的方法时，需要用props$listeners传给子组件。在用v-on展开后，在子组件内可以直接通过this.$emit()触发。
  ```

### 插槽

用于组件的复合式开发，在通用组件库开发中大量使用到。

#### 匿名插槽

```
son:
<div>
	<h3>hello vue</h3>
	<slot></slot>
</div>
```

#### 具名插槽

注意调用方式

```
son:
<div>
	<h3>hello vue</h3>
	<slot name='content'></slot>
</div>


<son>
	<template v-slot:content></template>
</son>
```

#### 作用域插槽

父组件在调用子组件时，在子组件标签的文本区域中要使用到的一些数据来自子组件内部时使用。

```
son:
<div>
	<h3>hello vue</h3>
	<slot myname='jack'></slot>
</div>


<son>
	<template v-slot:default="slotProps">{{slotProps.myname}}</template>
</son>
```

### 实战

1. 仿 element-ui 的通用表单组件

   - 数据收集，管理
   - 数据校验

   需要实现的组件有：

   - my-form 组件

     - 指定表单所用的数据和校验规则

     - 实现 validata()全局校验方法，提交时从整个表单控件的角度，一次触发子组件内部的校验规则，在全部都成功的情况下才能触发后续任务。

   - my-form-item 组件

     - label 标签的有无控制内部 label 标签的有无
     - prop 属性名称
     - 表单单项的校验规则 validate()
     - 显示错误信息

   - my-form-input 组件

     - 维护数据的双向绑定
     - 图标和反馈

#### my-form-input 组件

```
<template>
  <div>
    <!-- 能在该组件被父组件使用时，父组件能用v-model实现数据的双向绑定  -->
    <input :type="tyoe" :value='value' @input= 'onInput'>
  </div>
</template>

<script>
export default {
  props:{
    value:{
      type:String,
      default:''
    },
    type:{
      type:String,
      default:'text '
    }
  },
  methods:{
    onInput(e){
      this.$emit('input',e.target.value )
      // this.$emit('validate')  虽然该组件的父级组件是mt-form-item，但是该组件是通过插槽的方式传入到足迹组件内部的，父级组件只是留了一个slot插槽，我们是不能在插槽上绑定事件的。

      //在elemnt-ui中使用的是dispatch方法
      //这里使用$parent
      this.$parent.$emit('validate')
    }
  }
}
</script>

```

注意点：

当提到做双向数据绑定的时候，第一时间想到的是 v-model，但是上述的情况是在模拟组件的封装。如果给 input 表单控件使用 v-model 属性双向绑定数据的话，那么数据只能定义在该组件内部，而无法传递除去给外部。 真正的使用场景是，使用在使用组件控件的时候，在组件标签上使用 v-model 绑定一个自己组件的数据，该数据同时会传给组件内部，组件内部是需要用 props 来接受，并绑定到表单控件中的，同时监听表单控件的 input 事件，将数据同步到父组件中。

其中这个方法的重点是：给组件标签使用 v-model 绑定一个数据实际上就等价于以下情况：

```
<son v-model='fatherData'></son>

<son :value='fatherData' @input='value => fatherData = value'></son>
```

其他需求：

以后用户在调用——my-form-input 组件时，还会给组件标签传递标签的内置属性和自定义属性，比如 class, style ,placholder 等，如果组件内部要使用，还需要使用 props 注册，过程比较繁琐。 这时就能在子组件内部的标签的上使用 v-bind='$attrs'，将父组件以标签属性传递的数据直接展开到对应的元素上。  同时vue也会默认自动在组件的最外层标签上自动展开$attrs 中有的属性，如果不想在最外层标签上展开，可以设置组件的配置项中 inheritAttrs:false。

#### my-form-item 组件

```
<template>
  <div>
    <!-- 确定有无label的显示 -->
    <label for="" v-if='label'>{{label}}</label>
    <!-- 提供给表单控件使用的插槽 -->
    <slot></slot>
    <!-- 错误提示的dom元素 -->
    <p v-if="error" class="error">{{error}}</p>

   	<span>{{form.model[prop]}}</span>

  </div>
</template>

<script>
import Schema from 'async-validator'
export default {
  inject:['form'],
  props:{
    lable:{
      type: String,
      default: ''
    },
    prop:{     //目的是为了取出form表单容器实例对象model上的特定属性，以用来进行单项表单的规则校验
      type:String,
      default:''
    }

  },
  data() {
    return {
      error:''
    }
  },
  mounted(){
  	this.$on('validate',()=>{
  		this.validate()
  	})
  },
  methods:{
  	validate(){   //单项的校验
  		//表单项目验证使用的是async-validator（element-ui中），所以需要npm安装
  		const rules = this.form.rules[this.prop]  //那规则
  		const value = this.form.model[this.prop]  //获取值
  		const schema = new Schema({
  			[this.prop]:rules
  		})
  		return schema.validate({   //因为rules规则可能是一个异步的规则校验，所以该方法返回一个promise实例
  			[this.prop]:value
  		},error=>{
  			if(error){
  				this.error = error[0].message
  			}else{
  				this.error=''
  			}
  		})
  	}
  }
}
</script>

<style scoped>
.error{
  color: red;
}
</style>
```

![image-20210603005936585](.\typora-user-images\image-20210603005936585.png)

#### my-form 组件

```
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide(){
  	return {
  	  form:this   //this指的就是该表单组件实例本身
  	}
  },
  props:{
    model:{
      type:Object,
      required:true
    },
    rules:Object
  }，
  methods:{
  	validate(cb){  //全局的校验方法
  		//执行该表单容器内部所有my-form-item表单项的validate方法，并且统一处理
  		//my-form-item表单项的validate方法返回的是promise实例
  		这里使用promise.all（）就能获取所有验证结果
  		先尝试获取自己内部的所有item组件，并调用它们的validate方法
  		const tasks = this.$children
  		.filter(item=>item.prop)   //这步是过滤掉没有传递prop属性的组件
  		.map(item=>item.validata())

  		Promise.all(task).then(()=>{
  		  cb(true)
  		}).catch(()=>{
  	      cb(false)
  		})

  	}
  }
}
</script>

<style>

</style>
```

由于现在已经不再必须依赖于表单的 submit 提交能力，所以外层不一定非得使用 form 标签。表单控件对外提供了一些列的接口。 表单项数据，校验规则，全局校验方法。

model 数据来来自于组件——my-form 的父组件，但是它最终的使用者是——my-form-input 组件或者 my-form-item 组件。

将表单域中所需要的所有数据都绑为具体的某个表单容器组件，目的是为了统一管理，组件内部会用 provide 和 inject 传递给后代组件该表单容器组件实例，这样后代组件就能直接访问这些数据了，由于数据是已经实现响应式能力的，所以具备响应式能力。

![image-20210603020432875](.\typora-user-images\image-20210603020432875.png)

关于校验：

什么时候触发校验规则函数，是在 my-form-input 表单项的 input 事件或者 change 事件或者 blur 事件发生时触发。

在 element-ui 中表单项的校验规则写法如下：

```
rules:{
	username:[{require:true,message:'请输入用户名'}]，
	password:[{require:true,message:'请输入密码'}]
}
```

注意点：在上面的校验规则可能是一个异步的校验，比如去服务器请求用户名是否重名的判断，这时就需要等待。

上面的组件封装还不够健壮，原因：

- 在 my-form-input 组件中使用$parent属性直接获取父组件my-form-item上的表单验证函数的,使用$parent 的话就让组件之间必须是父子组件的关系，否则将失效。所以这种写法导致的组件间的强耦合。

  在 element-ui 中的解决方案是：

  ```
  emitter.js文件：

  function broadcast(componentName,eventName,params){
  	this.$children.forEach(child=>{
  		var name = child.$options.componentName
  		if(name === componentName ){
  			child.$emit.apply(child,[eventName].concat(params))
  		}else{
  			broadcast.apply(child,[componentName,eventName].concat([params]))
  		}
  	})
  }

  //componentName 是组件名
  //eventName事件名称
  //params参数数组
  遍历所有的子元素，并且在子组件的配置对象中有一项属性名叫  componentName  ，用来确定组件实例，这时递归的过程，相对消耗性能


  export default {
  	methods：{
  		dispatch(componentName,eventName,params){
  			var parent = this.$parent || this.$root
  			var name = parent.$options.componentName

  			while(parent && (!name || name !==componentName)){
  				parent = parent.$parent
  				if(parent){
  					name = parent.$options.componentName
  				}
  			}
  			if(parent){
  				parent.$emit.apply(parent, [eventName].concat(params))
  			}
  		},
  		boradcast(componentName,eventName,params){
  			boradcast.call(this,componentName,eventName,params)
  		}
  	}
  }

  ```

  在需要使用 emitter 模块的组件中引入 emitter 模块，然后在组件内部使用 mixin 方法，将 emitter 暴露出来的 methods 对象和组件自己的 methods 对象进行混入，这样就能在组件内直接使用 dispatch 和 boradcast 方法了。 同时注意，要为组件的配置对象自定义一个属性名：componentName 项。

### 使用 Vue.extend()方法创建组件实例

Vue.extend()的具体使用方法：

```
//组件的配置对象  或者 是一个.vue文件
const compObject = {
	data(){

	},
	props:{

	},
	methods:{

	}
}
const CompConstructor = Vue.extend(compObject)   //CompConstructor是一个构造函数
const instaceCom =  new CompConstructor({propsData:{}})    //propsData以这种固定的方式传参
instaceCom.$mount()
document.body.appendChild(instaceCom.$el)
instaceCom.remove = ()=>{
	document.body.removeChild(instaceCom.$el)\
	instaceCom.$destory()
}
```

装 vue 的插件建议使用 vue add 插件名 。

## vue-router 和 vuex 的原理 p2

vue-router 想要实现的情况：

当浏览器的 url 地址栏的内容发生变化的时候，不能发生页面跳转，并且页面也能部分更新视图。有两种解决方案：

- hash

  hashchange 事件触发时，去查询 vue-router 插件初始化时，生成的一个路由表，路由表的结构如下：

  ```
  {
  	'/':{},
  	'/home':{},
  	'/login':{},
  	....
  }
  ```

  将来 hash 地址变化后，监听并提取出路径部分去查询路由表，查找到对应的路由定义，路由定义中有一个非常重要的属性 component，将它取出 给到 router-view 组件，在 router-view 组件中将路由定义中的 component 组件重新调用自己的 render 方法 render(h){ h(component) }

- history

在 vue 项目的 router 目录中的 index.js 文件中引入 Vue 和 vue-router。然后使用 Vue.use(VueRouter)。

为什么要 use( ) ,use 方法做了什么？

- 因为每个 vue 实例都能通过 this.$router访问到根实例的配置对象上的router属性，所以可以猜测use(VueRouter)内部在Vue的原型对象上添加了一个$router 属性

- 实现并且注册了两个全局组件 router-link 和 router-view

对于 hash 路由，监听 hashchange 事件，通知 router-view 更新，

- 利用 vue 的数据响应式
- 制造一个响应式数据 f 表示当前的 url，在 router-view 的 render 函数中使用它，url 一变就导致 render 函数重新执行

任务：

- 实现一个 vue 插件
  - 插件内部要实现一个 VueRouter 类
  - 在 Vue 的原型对象上添加了一个$router 属性
  - 插件内部要实现一个 install 方法
  - 实现并且注册了两个全局组件 router-link 和 router-view
  - 在 mian.js 中给根实例的配置对象中传入 VueRouter 的实例，该实例起到的作用是什么？

```
let _Vue

class myVueRouter{
	constructor(options){
		this.$options = options
		const initial = window.location.hash.slice(1) || '/'
		Vue.util.defineReactive(this,'current',initial)
		//this.currentURL = '/'
		监听hash路由的改变
		window.addEventListenr('hashchange',this.onhashchange.bind(this))
		window.addEventListenr('load',this.onhashchange.bind(this))
		生成一个响应式的url



		this.routeMap = {}
		this.$options.routes.forEach(route=>{
			this.routeMap[route.path] = route
		})



	}
	onhashchange(){
		this.current = window.location.hash.slice(1)

	}
}

//这里的形参Vue之后在外部被use()时会传入Vue构造函数本身，之后要在myVueRouter类中使用Vue构造函数，所以需要在install方法中将Vue暴露给这整个模块,这个模块的其他地方就能使用了。
myVueRouter.install = function( Vue ){
	_Vue = Vue
	1.在根实例及其所有后代组件实例上挂载$router
	Vue.mixin({
		beforeCreate(){
			全局给每个实例混入该生命周期函数，将来在每个实例创建的过程中再调用
			if(thi.$options.router){
				Vue.prototype.$router = this.$options.router
			}
		}
	})

	2.注册两个全局组件
	Vue.componment('router-link',{
		props:{
			to:{
				type:String,
				required:true
			}
		}
		render(h){
			return h('a',{attrs:{href:`#${this.to}`}},this.$slots.default)
		}
	})
	Vue.component('router-view',{
		render(h){
			获取路由表中路由对应的组件
			const routes = this.$router.$options.routes
			const current = this.$router.current
			const route = routes.find(route=>route.path === current)
			const component = route? route.component :null
			return h( component )



			const {routeMap,current} = this.$router
			const component = routeMap[current] ? routeMap[current].component:null
			return h(component)
		}
	})
}

export default myVueRouter
```

问题点：

- 当 hash 值改变后，如何通知 router-view 组件获取到路由表中的对应组件进行动态渲染， 内部使用了 vue 的数据响应原理，制造一个响应式的数据代表当前的 url，在 router-view 的 render 函数中使用该响应式数据。当该数据改变后，router-view 的 render 函数能重新执行。

扩展知识点：

vue 组件中的 render 函数的使用方式有以下两种，

- h(tagName, props, childrenNodes)

  > render(h) { h( 'div' ,{ attrs:{ key:value } }, helloVue) }

- jsx 语法

  > render(){
  >
  > ​ return `<a href={'#'+this.to} > { this.$slots.default }</a>`
  >
  > }

## vuex 的实现

设计思路：

- 集中式的状态存储和管理 某个应用中所有组件使用的数据
- 以特定的规则保证数据改变的可预测性
- 单向数据流
- 不要把状态存放在各个组件内，这样不利于组件间数据共享
- 存放在 state 中的数据必须是响应式的

vue add vuex

核心概念：

- state：存放数据和状态
- mutations：直接更改状态的函数
- actions：异步调取 mutations 中的函数
- store：是上面三者存放的位置

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		//state中的数据是响应式的，如何做到
	},
	mutations:{
		edit(state){
			//思考state是如何传入的
		}
	},
	actions:{
		syncedit({commit}){

		}
	},
	getter:{

	},
	modules:{

	}
})
```

任务：

- 给实例挂载$store 属性
- 声明 Store 类
  - 响应式的 state 属性
  - commit()方法可以修改 state
  - dispatch()方法
  - getters 的实现

```
let _Vue
class Store{
	constructor(options){
		//隐藏state
		this._vm = new Vue({
			data:{
				$$state:options.state
			}
		})
		//保存mutations
		this._mutations = options.mutations
		//保存actions
		this._actions = options.actions

		//绑定this是指向store实例
		const store = this
		const { commit, action } = this
		this.commit = function bindCommit(type,payload){
			commit.call(store,type,payload)
		}
		this.action = function bindActions(type,payload){
			return actions.call(store, type, payload)
		}

	}
	get state(){
		return this._vm._data.$$state
	}
	set state(newVal){
		console.error('please use replaceState to reset state')
	}

	commit(type,payload){
		//执行配置对象mutations中的方法去修改数据
		this._commit[type]? this._commit[type](this.state,payload):null
	}
	dispatch(type,payload){
		this.actions[type] ?  return entry(this,pauload) :null

	}
}

function install (Vue){
	_Vue = Vue
	Vue.mixin({
		beforCreate(){
			if(this.$options.store){
				Vue.prototype.$store = this.$options.store
			}
		}
	})
}

export deafault { Store, install }
```

Vue.util.defineReactive()方法适合去定义一个响应式的属性

new Vue()则更适合直接定义一个响应式的对象

## vue 插件的写法

## render 函数用法

## 数据响应式(Vue.util.defineReactive 或者 new Vue())

## 递归组件

组件在自己的模板内调用自身。组件配置对象中的 name 对于组件的递归是必须的。递归组件的数据通常是树状结构的。

二级路由的实现

动态路由

router-view 的嵌套使用

router-link

函数式组件

jsx 语法
