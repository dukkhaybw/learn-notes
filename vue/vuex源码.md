# Vuex 源码

Vuex的核心、插件机制、模块机制，命名空间和辅助函数。

```bash
vue create vuex-project --force
```



## 前言

在 Vue 的组件间通信时，有很多种形式，父传子，子传父，跨级传递，provied/inject 等，但是并不直观。

Vuex 是借鉴了 Redux，Flux 的思想，但是它不像 Redux 可以用在 vue 项目中，可以用在 react 项目中或者 jQuery 项目中。Vuex 是专门为 Vue 设计的，不能脱离 Vue。在 Vuex 中数据也是单向流动的。

![image-20210805221956971](..\typora-user-images\image-20210805221956971.png)

为了组件之间的相互通信，现在将所有的数据都存放在 Vuex 生成的 store 中，store 中存放的是公共的状态 state。需要对应状态的组件可以直接去 store 内部取数据。但是取用数据的组件不能直接的修改 store 中的状态数据，它需要手动派发一个行为。组件派发事件到 mutations 中，通过 mutations 来改变 store 中的状态。在 store 中的状态更改之后，会触发用到对应状态的组件重新渲染而非创建（响应式变化）。 对于异步派发的行为，比如要先请求一个数据，然后将请求后的数据放在 store 中，这时就必须组件先 dispatch 一个 action，在对应的 action 中去请求后台接口，把接口请求回来的数据拿到后，再去提交一个 mutaition，再由 mutations 去更改 store，store 中的状态一变，再去重新渲染对应的组件。

## 使用

在项目中创建了 store 目录，在 store 目录中创建 store.js，在内部引入了 Vue 和 Vuex，并调用了 Vue.use(Vuex)，然后创建一个 store 实例并导出（const store = new Vuex.Store({......}) ）。在项目入口文件 main.js 中引入 store.js 并将 store 实例作为 new Vue( ) 根实例的配置对象（注入 store），这样每个组件内部都能通过自生的\$store属性访问到存放在store中的状态数据。（\$store.state.xxx）

Vue.use(Vuex)说明插件内部暴露了一个 install 方法。同时 new Vuex.Store({...}) 说明 Vuex 中有一个属性 Store，并且该属性对应的值是一个类。并且在创建实例的时候会传入一系列的配置对象的选项。创建的配置对象属性有：state，mutations，actions，getters 和 modules。

组件直接去修改 store 中的状态数据是能被修改成功的，但是并不建议这样使用的。如果组件想同步的更改状态，可以调用 commit 方法，提交给 mutations。

在组件中：@click="()=>{$store.commit('mutationFun1',{key:value})}"

在 store 中：mutations：{ mutationFun1(state,payload){ .... } }

在 mutations 中的各个方法中尽量不要有异步函数，虽然写了默认是没有问题的。但是 mutations 中的方法中有异步操作时，在严格模式下会报错。



store/index.js：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)  // Vue.use方法内部会调用Vuex的install方法

export default const store = new Vuex.store({
  state:{
    count:1
  },
  // 等价于计算属性
  getters:{
    count2(state){
      return state.age * 2
    }
  },
  // 执行同步更改state的操作
  mutations:{
			changeCount(state, payload){
        state.age += payload
      }
  },
  // 执行异步更改state的操作
  actions:{
			asyncChangeCount({commit,dispatch},payload){
        setTimeout(()=>{
        	commit('changeCount',payload)
        },1000)
      }
  }
}) 
```



src/main.js:

```js
import Vue from 'vue'
import store from './store/index.js'
import App from './App。vue'

Vue.config.productionTip = false

new Vue({
  store,
  render:(h)=>h(App)
}).$mount('#app')
```



App.vue：

```vue
<template>
  <div id='app'>
  	<p>
      {{$store.state.count}}
  	</p>
    <p>
      {$store.getters.count2}}
  		</p>
    <butoon @click="$stroe.commit('changeCount',2)">+2</butoon>
    <butoon @click="$stroe.dispatch('asyncChangeCount',2)">async+2</butoon>
  </div>
</template>
```



## 原理

在 Vuex 内部：

这是简版的 Vuex 原理，其中并没有涉及到模块的情况。

```js
let Vue

const forEach = (object,callback)=>{
  Object.keys(object).forEach(item=>{
    callback(item,object[item])
  })
}

class Store{
  //options就是用户new实例时传入的配置对象
  constructor(options){ 
    //这种做法直接将state对象的属性挂载到store实例上，虽然组件是可以获取到state中对应的属性数据了，但是一旦这些属性的属性值发生改变将无法响应视图做出改变。如果想要响应式的更新页面视图，那需要使用Vue的依赖收集。将state中的数据做成响应式的。
    //let state = options.state
    //this.state = state

    const computed = { }
    
     let getters = options.getters
    //把开发者传递的getters对象中的每个函数，转为当前实例的store上作为属性存在。（这可以作为一道面试问题：如果一个对象内部全是方法，每个方法都对应有一个返回值，那你能否在获取这些函数返回值时，给没有返回结果前面加上一个 ‘~’字符作为前置了？）
    this.getters = {}
    forEach(getters,(getterName,value)=>{
      computed[getterName] = ()=>{
        return value(this.state)
      }
      Object.defineProperty(this.getters,getterName,{
        get:()=>{  //注意使用箭头函数，否则this指向出错
          return this._vm[getterName]
        }
      })
    })
    

    this._vm = new Vue({   //Vuex中的核心源码，所以Vuex才是强依赖于Vue的，创建Vue的实例，保证状态更新可以刷新视图
      data:{
        // 在Vue中以$开头的数据不会被挂载到vue实例上
        $$state:options.state
      },
      computed
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

  // 本质是发布订阅模式
  commit = (mutationName,payload)=>{
    this.mutations[mutationName](payload)
  }

  // 本质是发布订阅模式
  dispatch = (actionName,payload)=>{
    this.actions[actionName](payload)
  }

  //类的属性访问器，获取实例上的state属性就会执行此方法。为这么这样写了？这样写的话，可以在获取该属性之前做一些逻辑任务的处理。
  get state(){   
    //.... 逻辑处理
    return this._vm._data.$$state
  }
}

// 插件安装
const install = (_Vue)=>{
  Vue = _Vue
  Vue.mixin({
    beforeCreate(){
      //把父组件的store属性放到每个组件实例及自身身上
      if(this.$options.store){  //根实例
        this.$store = this.$options.store
      }else{   //后代实例
        this.$store = this.$parent && this.$parent?.$store
      }
    }
  })
}
//目的是让当前插件不再手动引入Vue构造函数，这样就避免的在插件打包时再次打包一次Vue

export default {
  Store,  //容器初始化
  install
}
```

在项目入口文件中引入 store 的实例，并挂载到根实例上了。根实例上的 store 属性会被放到根实例的所有后代组件实例上，用$store 属性表示。（但是并不是通过放在 Vue 的原型对象上实现的）不放在原型上的原因是，在该项目中如果还创建了其他的根实例，但是该根实例并不需要使用 store，但是由于是放在 Vue 的原型对象上的，所以这个根实例也被迫能访问到该 store 实例了。

应该达到的效果是只有传了 store 配置项的根实例及其后代组件才能访问到 store 实例。为了实现该功能，内部采用了 Vue.mixin 方法。该方法的作用是抽离公共的逻辑，放一些方法，这些方法在每创建一个实例时都会被混入到 Vue 实例中。



> Vue 中的 Mixin 机制允许开发者定义被多个组件共享的方法、计算属性、生命周期钩子等选项。当一个 mixin 被使用时，它的选项将被“混入”到组件的选项中。这种机制有助于代码的复用，尤其是在处理多个组件需要共享相同功能时。
>
> Mixin 的原理主要基于 JavaScript 的对象合并策略。当组件和 mixin 包含相同选项时，这些选项将以特定的方式合并到组件中。Vue 内部使用的合并策略如下：
>
> 1. **数据对象** (`data`): 组件和 mixin 中的 `data` 对象会被合并。如果有冲突，组件中的数据优先级更高。
> 2. **生命周期钩子**：组件和 mixin 中的生命周期钩子函数会被合并到一个数组中，且 mixin 中的钩子函数会**先于**组件中的钩子函数被调用。
> 3. **方法** (`methods`), **计算属性** (`computed`), 和 **侦听器** (`watch`): 如果组件和 mixin 包含相同名称的方法、计算属性或侦听器，组件中的选项将优先。
> 4. **组件选项**：如 `components`, `directives` 和 `filters` 等选项会被合并。如果有冲突，组件中的选项优先。
> 5. **自定义选项**: 对于自定义选项，Vue 允许通过全局 `Vue.config.optionMergeStrategies` 来定义自定义合并策略。



在 Vuex 中最核心的功能是，不把所有的状态都放在一个 state 中，而是能对状态进行分模块的管理。

注意点：

- 在使用 Vue.use(插件名，{ key1:value1, key2:value2 })还可以选择性的传入第二个及以上的参数，在 intall 函数内部也能获取到。
- extends 与 mixin，extends 可以继承于指定类的所有属性，mixin 是混合所有的方法。
- for(let key in obj){ ... }的性能不好，因为会遍历原型对象，最好写成 Object.keys(obj).forEach(item=>{.....}) ,并且 Object.keys 就不必再使用 hasOwnproperty 进行判断是否是私有属性。
- 子模块的模块名不能和父模块 state 中的状态一致，如果一致的话，子模块的模块名会覆盖父模块 state 中同名的状态

**嵌套的组件之间的beforeCreate生命周期函数的执行顺序是先父再子的。**



### 完整实现

vuex/index.js

```js
import { Store, install } from './store';

export default {
    Store,
    install
}
```



store.js：

```js
import applyMixin from './mixin'

let Vue;

export class Store {
  constructor(options){
    let state = options.state;
    this._vm = new Vue({
      data:{
        $$state:state,  // 定义$开头的变量不会被代理到实例上
      }
    });
  }
  get state(){
    return this._vm._data.$$state
  }
}

export const install = (_Vue) =>{
  Vue = _Vue;
  applyMixin(Vue);
}
```

当使用Vue2的use方法注册插件时，默认会执行插件暴露的install方法并传入Vue的构造函数。



mixin.js：

```js
const applyMixin = (Vue) => {
  Vue.mixin({
    beforeCreate: vuexInit
  })
}

function vuexInit() {
  // this就是一个个的vue实例对象
  const options = this.$options;
  if (options.store) { 
    // 给根实例增加$store属性
    this.$store = options.store;
  } else if (options.parent && options.parent.$store) {
    // 给组件增加$store属性
    this.$store = options.parent.$store;
  }
}
export default applyMixin
```



###  实现getter

```js


const forEachValue = (object,callback)=>{
  Object.keys(object).forEach(item=>{
    callback(object[item], item)
  })
}
```



store.js

```js
import { forEachValue } from '../util'
let Vue;

export class Store {
  constructor(options){
    let state = options.state;

    this.getters = {};
    const computed = {}
    forEachValue(options.getters, (fn, key) => {
      computed[key] = () => {
        return fn(this.state);
      }
      Object.defineProperty(this.getters,key,{
        get:()=> this._vm[key]
      })
    });

    this._vm = new Vue({
      data:{
        $$state:state,  // 定义$开头的变量不会被代理到实例上
      },
      computed // 利用计算属性实现缓存
    });
  }
  get state(){
    return this._vm._data.$$state
  }
}
```



### 实现mutations

```js
export class Store {
  constructor(options) {
    // ...
    
    this.mutations = {};
    forEachValue(options.mutations, (fn, key) => {
      this.mutations[key] = (payload) => fn.call(this, this.state, payload)
    });
  }
  commit = (type, payload) => {
    this.mutations[type](payload);
  }
}
```



### 实现actions

```js
export class Store {
  constructor(options) {
    this.actions = {};
    forEachValue(options.actions, (fn, key) => {
      this.actions[key] = (payload) => fn.call(this, this,payload);
    });
  }
  dispatch = (type, payload) => {
    this.actions[type](payload);
  }
}
```





## 模块化

### 模块化的使用

```js
// 定义模块
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  },
  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}

const moduleB = {
  state: () => ({ /* 模块B的状态 */ }),
  mutations: { /* 模块B的mutations */ },
  actions: { /* 模块B的actions */ },
  getters: { /* 模块B的getters */ }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```



在模块内部，可以通过其状态（state）、变更（mutations）、行为（actions）和获取器（getters）来管理该模块的状态。模块内部的 mutation 和 getter 接收的第一个参数是模块的局部状态对象。

#### 访问模块的状态

模块的状态可以通过 `store.state.moduleName` 来访问：

```js
console.log(store.state.a.count) // 访问模块A的状态
```

#### 提交模块的变更

可以在组件中使用 `store.commit` 来提交变更：

```js
store.commit('increment')
```

注意，如果模块使用了命名空间（通过添加 `namespaced: true` 属性），那么`commit` 和 `dispatch` 也需要包含模块路径：

```js
store.commit('a/increment')
```

#### 分发模块的行为

类似于变更，行为也可以通过 `store.dispatch` 分发：

```
javascriptCopy code
store.dispatch('incrementIfOddOnRootSum')
```

同样，对于命名空间的模块，需要包含模块路径：

```js
store.dispatch('a/incrementIfOddOnRootSum')
```

#### 通过模块的获取器获取状态

可以通过 `store.getters['getterName']` 访问获取器：

```js
console.log(store.getters['doubleCount'])
```

对于命名空间的模块，获取器的访问也需要包含模块路径：

```js
console.log(store.getters['a/doubleCount'])
```



**在组件中使用**

在 Vue 组件中，可以使用 `computed` 属性来访问 Vuex store 中的状态。这样可以保证当 store 中的状态改变时，组件能够自动更新。

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  computed: {
    count() {
      return this.$store.state.a.count;
    }
  }
}
</script>
```

#### 提交变更（Mutations）

可以通过 `this.$store.commit` 方法提交 mutation，改变 store 中的状态。

```vue
<template>
  <button @click="increment">Increment</button>
</template>

<script>
export default {
  methods: {
    increment() {
      this.$store.commit('a/increment');
    }
  }
}
</script>
```

#### 分发行为（Actions）

类似地，你可以通过 `this.$store.dispatch` 方法分发 action。

```vue
<template>
  <button @click="incrementIfOddOnRootSum">Increment If Odd</button>
</template>

<script>
export default {
  methods: {
    incrementIfOddOnRootSum() {
      this.$store.dispatch('a/incrementIfOddOnRootSum');
    }
  }
}
</script>
```

#### 使用获取器（Getters）

可以通过 `this.$store.getters` 访问 Vuex store 中的 getters。

```vue
<template>
  <div>{{ doubleCount }}</div>
</template>

<script>
export default {
  computed: {
    doubleCount() {
      return this.$store.getters['a/doubleCount'];
    }
  }
}
</script>
```

#### 使用 `mapState`, `mapGetters`, `mapActions`, `mapMutations` 辅助函数

为了在组件中更方便地使用 Vuex 的功能，Vuex 提供了几个辅助函数，可以更简洁地映射状态、getters、mutations 和 actions 到组件的计算属性和方法中。

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="incrementIfOddOnRootSum">Increment If Odd</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      count: state => state.a.count
    }),
    ...mapGetters([
      'a/doubleCount'
    ])
  },
  methods: {
    ...mapMutations([
      'a/increment'
    ]),
    ...mapActions([
      'a/incrementIfOddOnRootSum'
    ])
  }
}
</script>
```

使用这些辅助函数，你可以更容易地在组件中集成 Vuex 功能，让代码更加简洁和易于维护。

直接在模板（template）中访问 Vuex store 的状态或者在其他地方（例如 methods 或 lifecycle hooks）直接引用而不通过 computed 属性，是可行的，但这样做通常不是最佳实践，尤其对于状态的访问。主要原因如下：

#### 为什么推荐使用 computed 属性：

1. **响应性：** Vue 的响应性系统会跟踪 computed 属性的依赖关系，并在依赖的响应式数据变化时重新计算。这意味着当 Vuex store 中的状态变化时，依赖这个状态的 UI 也会自动更新。如果你直接在模板中访问 Vuex 状态或在 methods 中引用它，Vue 也能检测到状态变化并更新视图，但这样做失去了 computed 属性的缓存机制。
2. **性能：** computed 属性是基于它们的依赖进行缓存的。只有在它们依赖的响应式属性改变时才会重新计算。这意味着如果 store 中的状态没有改变，多次访问 computed 属性将不会重新计算，直接返回之前的计算结果，从而节省性能。
3. **代码组织和维护性：** 使用 computed 属性可以让组件保持清晰的数据流向，易于理解和维护。状态的来源和计算逻辑都封装在 computed 属性中，使得组件的其他部分（如模板或方法）更专注于它们自己的逻辑。



```vue
<template>
  <div>{{$store.state.moduleName.someState}}</div>
</template>
```

这种方式的缺点是，如果 Vuex 状态非常频繁地变化，它可能导致性能问题，因为 Vue 不能有效地缓存结果，每次状态变化都会导致组件重新渲染。



### 模块化实现机制

下面是一个options的示例：

```js
const options = {
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  },
  modules: {
    a: {
      state: {
        value: 1
      },
      mutations: {
        updateValue(state, payload) {
          state.value = payload
        }
      }
    },
    b: {
      state: {
        value: 2
      },
      modules: {
        c: {
          state: {
            value: 3
          }
        }
      }
    }
  }
}
```





```js
import ModuleCollection from './module/module-collection'
import applyMixin from './mixin'

let Vue;

export class Store {
  constructor(options){
    let state = options.state;

    this._modules = new ModuleCollection(options);

    this.getters = {};
    const computed = {}
    forEachValue(options.getters, (fn, key) => {
      computed[key] = () => {
        return fn(this.state);
      }
      Object.defineProperty(this.getters,key,{
        get:()=> this._vm[key]
      })
    });

    this._vm = new Vue({
      data:{
        $$state:state,  // 定义$开头的变量不会被代理到实例上
      },
      computed // 利用计算属性实现缓存
    });

  }
  get state(){
    return this._vm._data.$$state
  }
}
```



module/module-collection.js:

```js
import { forEachValue } from '../util'

export default class ModuleCollection {
  constructor(options) {
    // 初始化时以一个空数组（表示路径）和传入的选项（模块定义）作为参数
    this.register([], options)
  }
  // 接收路径（path，表示模块的命名空间路径）和模块定义（rootModule）作为参数
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    };
    if (path.length == 0) {
      this.root = newModule;
    } else {
      // 如果不是根模块，则找到其父模块，并将新模块添加到父模块的_children对象中。
      let parent = path.slice(0,-1).reduce((memo,current)=>{
        return memo._children[current];
      },this.root);
      parent._children[path[path.length-1]] = newModule;
    }
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module);
      })
    }
  }
}
```

段代码定义了一个`ModuleCollection`类，用于以递归的方式收集和注册Vuex中的模块和子模块，建立起一个模块树，其中包含了模块的原始定义、状态和子模块关系。





抽离模块：

````js
export default class Module {
  constructor(rawModule) {
    this._children = {};
    this._rawModule = rawModule;
    this.state = rawModule.state
  }
  getChild(key) {
    return this._children[key]
  }
  addChild(key, module) {
    this._children[key] = module
  }
  forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
  forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }
  forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }
  forEachChild(fn) {
    forEachValue(this._children, fn);
  }
}
````







## Vuex4

### Vue3中使用`vuex`

**`store.js`**

```js
import { createStore } from 'vuex'

export default createStore({
  state: { // 状态
    count: 0
  },
  getters: { // 计算属性
    double(state) {
      return state.count * 2
    }
  },
  mutations: { // 同步方法
    add(state, payload) {
      state.count += payload;
    }
  },
  actions: { // 异步方法
    asyncAdd({ commit }, payload) {
      setTimeout(() => {
        commit('add', payload)
      }, 1000);
    }
  }
});
```



**main.js**

```js
import store from './store'
createApp(App).use(store /*injectKey*/).mount('#app')
```





**App.vue**：

```vue
<template>
  <div>当前数量:{{count}} {{$store.state.count}}</div>
  <div>翻倍 :{{double}} {{$store.getters.double}}</div>
  <button @click="add">+</button>
  <button @click="asyncAdd">异步+</button>
</template>

<script>
  import {computed} from 'vue'
  import {useStore} from 'vuex'
  export default {
    name: 'App',
    setup(){
      const store = useStore();
      return {
        count:computed(()=>store.state.count),
        double:computed(()=>store.getters.double),
        add:()=>store.commit('add',1),
        asyncAdd:()=>store.dispatch('asyncAdd',2)
      }
    }
  }
</script>
```

