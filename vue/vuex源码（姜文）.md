# Vuex 源码

## 前言

在 Vue 的组件通信时，有很多种形式，父传子，子传父，跨级传递，provied/inject 等等，但是并不直观。实现组件间通信最方便的方式是 Vuex。

Vuex 是借鉴了 Redux，Flux 等思想的，但是它不像 Redux 可以又在 vuex 项目中，可以用在 react 项目中或者 jQuery 项目中。Vuex 是专门为 Vue 设计的，不能脱离 Vue。在 Vuex 中数据也是单向流动的。

![image-20210805221956971](.\typora-user-images\image-20210805221956971.png)

为了组件之间的相互通信，现在将所有的数据都存放在 Vuex 生成的 store 中，store 中存放的是公共的状态 state。需要对应状态的组件可以直接去 store 内部取数据。但是取用数据的组件不能直接的修改 store 中的状态数据，它需要手动派发一个行为。组件派发事件到 mutations 中，通过 mutations 来改变 store 中的状态。在 store 中的状态更改之后，会触发用到对应状态的组件重新渲染而非创建（响应式变化）。 对于异步派发的行为，比如要先请求一个数据，然后将请求后的数据放在 store 中，这时就必须组件先 dispatch 一个 action，在对应的 action 中去请求后台接口，把接口请求回来的数据拿到后，再去提交一个 mutaition，再由 mutations 去更改 store，store 中的状态一变，再去重新渲染对应的组件。

## 使用

在项目目录中创建了 store 目录，在 store 目录中创建的 store.js,在内部引入了 Vue 和 Vuex，并调用了 Vue.use(Vuex)，然后创建一个 store 实例并导出（const store = new Vuex.Store({......}) ）。在项目入口文件 main.js 中引入 store.js 并将 store 实例作为 new Vue( ) 根实例的配置对象（注入 store），这样每个组件内部都能通过自生的$store属性访问到存放在store中的状态数据。（$store.state.xxx）

Vue.use(Vuex)说明插件内部暴露了一个 install 方法。同时 new Vuex.Store({...}) 说明 Vuex 中有一个属性 Store，并且该属性对应的值是一个类。并且在创建实例的时候会传入一系列的配置对象的选项。创建的配置对象属性有：state，mutations，actions，getters 和 modules。

组件直接去修改 store 中的状态数据是能被修改成功的，但是并不建议这样使用的。如果组件想同步的更改状态，可以调用 commit 方法，提交给 mutations。

在组件中：@click="()=>{$store.commit('mutationFun1',{key:value})}"

在 store 中：mutations：{ mutationFun1(state,payload){ .... } }

在 mutations 中的各个方法中尽量不要有异步函数，虽然写了默认是没有问题的。但是 mutations 中的方法中有异步操作时，在严格模式下会报错。

![image-20210805230621103](.\typora-user-images\image-20210805230621103.png)

store 中的准备工作：

![image-20210805232551471](.\typora-user-images\image-20210805232551471.png)

组件中使用的大致方式：

![image-20210805231638563](.\typora-user-images\image-20210805231638563.png)

## 原理

在 Vuex 内部：

这是简版的 Vuex 原理，其中并没有涉及到模块的情况。

```js
let Vue

const foEach = (object,callback)=>{
    Object.keys(object).forEach(item=>{
         callback(item,object[item])
    })
}

class Store{
	constructor(options){  //options就是用户new实例时传入的配置对象

        //这种做法直接将state对象的属性挂载到store实例上，虽然组件是可以获取到state中对应的属性数据了，但是一旦这些属性的属性值发生改变将无法响应视图做出改变。如果想要响应式的更新页面视图，那需要使用Vue的依赖收集。将state中的数据做成响应式的。
        //let state = options.state
        //this.state = state


        this.vm = new Vue({   //Vuex中的核心源码，所以Vuex才是强依赖于Vue的，创建Vue的实例，保证状态更新可以刷新视图
            data:{
                state:options.state
            }
        })
        let getters = options.getters
        //把开发者传递的getters对象中的每个函数，转为当前实例的store上作为属性存在。（这可以作为一道面试问题：如果一个对象内部全是方法，每个方法都对应有一个返回值，那你能否在获取这些函数返回值时，给没有返回结果前面加上一个 ‘~’字符作为前置了？）
        this.getters = {}
        forEach(getters,(getterName,value)=>{
            Object.defineProperty(this.getters,getterName,{
                 get:()=>{  //注意使用箭头函数，否则this指向出错
               		return value(this.state)
           	 	 }
            })
        })

        let mutations = options.mutations
        this.mutations = {}
        forEach(mutations,(mutationName,value)=>{
            this.mutations[mutationName] = (payolad)=>{
                value(this.state, payolad)
            }
        })

        let actions = options.actions
        this.actions = {}
        forEach(actions,(actionName,value)=>{
            this.actions[actionName] = (payload)=>{
                value(this,payload)
            }
        })
    }

	commit = (mutationName,payload){
        this.mutations[mutationName](payload)
    }

	dispatch = (actionName,payload)=>{
        this.actions[actionName](payload)
    }

    get state(){   //类的属性访问器，获取实例上的state属性就会执行此方法。为这么这样写了？这样写的话，可以在获取该属性之前做一些逻辑任务的处理。
        //.... 逻辑处理
        return this.vm.state
    }
}


const install = (_Vue)=>{
	Vue = _Vue
    Vue.mixin({
        beforeCreate(){
            //把父组件的store属性放到每个组件实例及自身身上
            if(this.$options.store){  //根实例
                this.$store = this.$options.store
            }else{   //后代实例
                this.$store = this.$parent && this.&parent.$store
            }
        }
    })
}
//目的是让当前插件不再手动引入Vue构造函数，这样就避免的在插件打包时再次打包一次Vue

export default {
	Store,
	install
}
```

在项目入口文件中引入 store 的实例，并挂载到根实例上了。根实例上的 store 属性会被放到根实例的所有后代组件实例上，用$store 属性表示。（但是并不是通过放在 Vue 的原型对象上实现的）不放在原型上的原因是，在该项目中如果还创建了其他的根实例，但是该根实例并不需要使用 store，但是由于是放在 Vue 的原型对象上的，所以这个根实例也被迫能访问到该 store 实例了。

应该达到的效果是只有传了 store 配置项的根实例及其后代组件才能访问到 store 实例。为了实现该功能内部采用了 Vue.mixin 方法。该方法的作用是抽离公共的逻辑，放一些方法，这些方法在每创建一个实例时都会被混入到 Vue 实例中。

注意点：

- 用 Vue.mixin 混入的生命周期函数会比在实例内定义的同名生命周期函数先执行。
- 在使用 Vue.use(插件名，{ key1:value1, key2:value2 })还可以选择性的传入第二个及以上的参数，在 intall 函数内部也能获取到。
- extends 与 mixin，extends 可以继承于指定类的所有属性，mixin 是混合所有的方法。
- 依赖收集是响应式数据原理的一部分。
- for(let key in obj){ ... }的性能不好，因为会遍历原型对象，最好写成 Object.keys(obj).forEach(item=>{.....}) ,并且 Object.keys 就不必再使用 hasOwnproperty 进行判断是否是私有属性。

在 Vuex 中最核心的功能是，不把所有的状态都放在一个 state 中，而是能对状态进行分模块的管理。

注意：

- 子模块的模块名不能和父模块 state 中的状态一致，如果一致的话，子模块的模块名会覆盖父模块 state 中同名的状态
