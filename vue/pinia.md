# Pinia

pnpm create vite

一个有[组合式 API](https://github.com/vuejs/composition-api) 的 Vue 状态管理库。同时支持 Vue 2 和 Vue 3，并且不强制要求开发者使用组合式 API。

Pinia是强依赖于Vue的，因为内部用到vue中提供的方法，而且数据的来源都是组件实例上的，实现跨组件或页面共享状态，可通过插件扩展 Pinia 功能

## Pinia和Vuex的对比区别

- Pinia采用TS编写，对类型有非常好的支持和提示；Vuex在这方面需要开发者自己去编写很多类型配合使用

- Pinia体积轻量，使用简单

- Pinia中不再引入Vuex中才有的mutation概念，且原生支持异步

- Pinia即支持Composition API（避免了this指向问题），又兼容options API

- Vuex有模块嵌套特点，使用module来区分模块，模块嵌套过深的话，使用起来不方便，需要借助Vuex提供的工具方法来一定程度简化数据的操作

- Vuex中的模块会被注册到根模块上，如果根模块上有和子模块名字一样的数据，那么子模块的会覆盖根模块上的这个属性

  ```js
  new Vuex.Stroe({
    state:{a:1},
    module:{
      a:{
        state:{}
      }
    }
  })
  ```

- Vuex中只能有一个store（树结构）

- Pinia支持多个平级的store，且彼此之间可以相互引用，而最大程度的避免了命名冲突问题

- 不再有嵌套结构的**模块**。可以通过导入和使用另一个 Store 来隐含地嵌套 stores 空间。虽然 Pinia 从设计上提供的是一个扁平的结构，但仍然能够在 Store 之间进行交叉组合。**甚至可以让 Stores 有循环依赖关系**。

- 不再有**可命名的模块**。考虑到 Store 的扁平架构，Store 的命名取决于它们的定义方式，甚至可以说所有 Store 都应该命名。



## 基本使用

```bash
npm install pinia
```



### 以类似Vuex的方式使用Pinia

Vue中注册插件的方式：

```js
const app = createApp(App)

app.use({
  install(app,...options){
    // ...
  }
}, options)xx

app.use(function (app,...options){
  // ...
},options)
```





在入口文件中注册Pinia：

```js
import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'

// 创建一个 pinia 实例 (根 store) 并将其传递给应用
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```



实现一个store：

Options API写法：

```js
import {defineStore} from 'pinia'

export const useCountStore = defineStore('counter',{
  state:()=>{
    return {count:0}
  },
  getters:{
    double(stroe){
      return this.count*2
    }
  },
  actions:{
    increment(payload){
      this.count+=payload 
    }
  }
})


export const useCountStore = defineStore({
  id:'counter',
  state:()=>{counter:0}，
  // ...
})
```



Composition API写法：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```



组件中使用:

```vue
<script setup>
import {useCountStore} from './stroes/counter'
const store = useCountStore() // 不能直接结构后使用，不然会丧失响应式的能力；可以通过toRefs来解构使用
store.$patch({ count: counter.count + 1 })
</script>

<template>
	<p>{{store.count}}</p>
	<div>{{store.double}}</div>
	<button @click="store.count++"> ++ </button>  不建议直接修改，虽然有效
	<button @click="store.increment(2)">+2</button> 
</template>
```

不能结构store中的属性或者计算属性后使用，这样丧失了响应式。可以借助toRefs和pinia内部提供的方法来解决这个问题。



### 基本概念

#### Store

Store (如 Pinia) 是一个保存状态和业务逻辑的对象，它并不与组件树绑定。**它承载着全局状态**。每个组件都可以读取和写入它。它有**三个概念**，[state](https://pinia.vuejs.org/zh/core-concepts/state.html)、[getter](https://pinia.vuejs.org/zh/core-concepts/getters.html) 和 [action](https://pinia.vuejs.org/zh/core-concepts/actions.html)，这些概念相当于组件中的 `data`、 `computed` 和 `methods`。

Store 是用 `defineStore()` 定义的，它的第一个参数要求是一个 **唯一的标识**：

```js
import { defineStore } from 'pinia'

// 可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
  // 其他配置...
})
```

第一个参数：也被用作 *id* ，是必须传入的， Pinia 将用它来连接 store。

第二个参数可接受两类值：Setup 函数或 Option 对象。



**Option Store**

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```



 `$reset` 方法**仅支持 Options API 风格的 Store**，默认情况下**不支持 Composition API 风格的 Store**。

使用[Options API](https://pinia.vuejs.org/zh/core-concepts/#option-stores) 时，可以通过调用 store 的 `$reset()` 方法将 state 重置为初始值。

```js
const store = useStore()

store.$reset()
// 在 $reset() 内部，会调用 state() 函数来创建一个新的状态对象，并用它替换当前状态。  composition API是无法支持这个方法的
```

在 [Setup Stores](https://pinia.vuejs.org/core-concepts/#setup-stores) 中，需要创建自己的 `$reset()` 方法：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```





**Setup Store**

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  // 返回一个带有想暴露出去的属性和方法的对象
  return { count, doubleCount, increment }  
})
```

Setup store 也可以依赖于全局**提供**的属性，比如路由。任何[应用层面提供](https://vuejs.org/api/application.html#app-provide)的属性都可以在 store 中使用 `inject()` 访问，就像在组件中一样：

```js
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'

export const useSearchFilters = defineStore('search-filters', () => {
  const route = useRoute()
  // 这里假定 `app.provide('appProvided', 'value')` 已经调用过
  const appProvided = inject('appProvided')

  // ...
	 // 不要返回像 route 或 appProvided (上例中)之类的属性，因为它们不属于 store，而且你可以在组件中直接用 useRoute() 和 inject('appProvided') 访问。
  return {
    // ...
  }
})
```



> 注意，新的属性**如果没有在 `state()` 中被定义**，则不能被添加。它必须包含初始状态。





**使用store**

前面虽然定义了一个 store，但在第一次使用 `<script setup>` 调用 `useStore()` 之前，store 实例是不会被创建的（类似懒汉式的单例模式）：

```js
<script setup>
import { useCounterStore } from '@/stores/counter'
// 可以在组件中的任意位置访问 `store` 变量
const store = useCounterStore()
</script>
```

`store` 是一个用 `reactive` 包装的对象，这意味着不需要在 getters 后面写 `.value`。就像 `setup` 中的 `props` 一样，**不能对它进行解构**：

```js
<script setup>
import { useCounterStore } from '@/stores/counter'
import { computed } from 'vue'

const store = useCounterStore()
// ❌ 这将不起作用，因为它破坏了响应性
// 这就和直接解构 `props` 一样
const { name, doubleCount } = store
name // 将始终是 "Eduardo" //
doubleCount // 将始终是 0 //
setTimeout(() => {
  store.increment()
}, 1000)
// ✅ 这样写是响应式的
// 💡 当然你也可以直接使用 `store.doubleCount`
const doubleValue = computed(() => store.doubleCount)
</script>
```

为了从 store 中提取属性时保持其响应性，需要使用 `storeToRefs()`。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，可以直接从 store 中解构 action，因为它们也被绑定到 store 上：

```js
<script setup>
  import { storeToRefs } from 'pinia'
  const store = useCounterStore()
  // `name` 和 `doubleCount` 是响应式的 ref
  // 同时通过插件添加的属性也会被提取为 ref
  // 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
  const { name, doubleCount } = storeToRefs(store)
  // 作为 action 的 increment 可以直接解构
  const { increment } = store
</script>
```





**修改state**

`$patch` 方法**同时支持 Options API 和 Composition API 风格的 Store 写法**，因为它操作的是 Store 的 `state`，而这两种风格的 Store 在 Pinia 中最终都会被统一处理为响应式对象。

可以调用 `$patch` 方法。它允许用一个 `state` 的补丁对象在同一时间更改多个属性：

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

用这种语法的话，有些变更真的很难实现或者很耗时：任何集合的修改（例如，向数组中添加、移除一个元素或是做 `splice` 操作）都需要你创建一个新的集合。因此，`$patch` 方法也接受一个函数来组合这种难以用补丁对象实现的变更。

```js
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```



**不能完全替换掉** store 的 state，因为那样会破坏其响应性。但是，可以 *patch* 它。

```js
// 这实际上并没有替换`$state`
store.$state = { count: 24 }
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 })
```



##### 订阅 state

类似 Vuex 的 [subscribe 方法](https://vuex.vuejs.org/zh/api/index.html#subscribe)，可以通过 store 的 `$subscribe()` 方法侦听 state 及其变化。比起普通的 `watch()`，使用 `$subscribe()` 的好处是 *subscriptions* 在 *patch* 后只触发一次。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```

默认情况下，*state subscription* 会被绑定到添加它们的组件上 (如果 store 在组件的 `setup()` 里面)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 `{ detached: true }` 作为第二个参数，以将 *state subscription* 从当前组件中*分离*：

```js
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$subscribe(callback, { detached: true })
</script>
```



可以在 `pinia` 实例上使用 `watch()` 函数侦听整个 state。

```js
watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true } 
)
```



#### Getter

可以通过 `defineStore()` 中的 `getters` 属性来定义它们。**推荐**使用箭头函数，并且它将接收 `state` 作为第一个参数：

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 自动推断出返回类型是一个 number
    doubleCount(state) {
      return state.count * 2
    },
    // 返回类型**必须**明确设置  
    doublePlusOne(): number {
      // 整个 store 的 自动补全和类型标注 
      return this.doubleCount + 1  // 通过 this，可以访问到其他任何 getter
    },
  },
})
```

也可以通过 `this` 访问到**整个 store 实例**，**但(在 TypeScript 中)必须定义返回类型**。

直接访问 store 实例上的 getter：

```js
<script setup>
import { useCounterStore } from './counterStore'

const store = useCounterStore()
</script>

<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>
```



*Getter* 只是幕后的**计算**属性，所以不可以向它们传递任何参数。不过，你可以从 *getter* 返回一个函数，该函数可以接受任意参数：

```js
export const useUserListStore = defineStore('userList', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

使用：

```js
<script setup>
import { useUserListStore } from './store'
const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// 请注意，你需要使用 `getUserById.value` 来访问
// <script setup> 中的函数
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

当你这样做时，**getter 将不再被缓存**。它们只是一个被你调用的函数。不过，你可以在 getter 本身中缓存一些结果，虽然这种做法并不常见，性能会更好：

```js
export const useUserListStore = defineStore('userList', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```





访问其他store中的getter：

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

作为 store 的一个属性，可以直接访问任何 getter(与 state 属性完全一样)。



#### Action

```js
import { useAuthStore } from './auth-store'

export const useCounterStore = defineStore('main', {
  state: () => ({
    count: 0,
    preferences: null,
  }),
  actions: {
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
    async fetchUserPreferences() {
      const auth = useAuthStore() // 使用其他的store中的数据
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

action 也可通过 `this` 访问**整个 store 实例**。

**`action` 可以是异步的**，可以在它们里面 `await` 调用任何 API，以及其他 action。

```js
<script setup>
const store = useCounterStore()
// 将 action 作为 store 的方法进行调用
store.randomizeCounter()
</script>
<template>
  <!-- 即使在模板中也可以 -->
  <button @click="store.randomizeCounter()">Randomize</button>
</template>
```



##### 订阅 action

可以通过 `store.$onAction()` 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。

`after` 表示在 promise 解决之后，允许你在 action 解决后执行一个回调函数。

`onError` 允许在 action 抛出错误或 reject 时执行一个回调函数。这些函数对于追踪运行时错误非常有用。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    // after可以写多个 
    after((result) => {
      console.log(
        `Finished "${name}" after ${
        Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

默认情况下，*action 订阅器*会被绑定到添加它们的组件上。这意味着，当该组件被卸载时，它们将被自动删除。如果想在组件卸载后依旧保留它们，请将 `true` 作为第二个参数传递给 *action 订阅器*，以便将其从当前组件中分离：

```js
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$onAction(callback, true)
</script>
```



### 插件

常用插件实现的能力：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **仅**应用插件于特定 store

插件通过 `pinia.use()` 添加到 pinia 实例的。

示例：通过返回一个对象将一个静态属性添加到所有 store。直接通过在一个插件中返回包含特定属性的对象来为每个 store 都添加上特定属性。

```js
import { createPinia } from 'pinia'

// 创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 在安装此插件后，插件可以保存在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将该插件交给 Pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 *context*。

```js
export function myPiniaPlugin(context) {
  context.pinia // 用 `createPinia()` 创建的 pinia。
  context.app // 用 `createApp()` 创建的当前应用(仅 Vue 3)。
  context.store // 该插件想扩展的 store
  context.options // 定义传给 `defineStore()` 的 store 的可选对象。
  // ...
}

pinia.use(myPiniaPlugin)
```

插件只会应用于**在 `pinia` 传递给应用后**创建的 store，否则它们不会生效。

使用插件（如 `pinia-plugin-persistedstate`）或在 Store 的 `hydrate` 生命周期处理。





## 原理实现

index.js:

```js
export { defineStore } from "./defineStore.js";
export { createPinia } from "./createPinia.js";
```



rootState.js:

```js
export const PiniaSymbol = Symbol(); // 用于provide和inject
```



createPinia.js:

```js
import { ref } from "vue";
import { PiniaSymbol } from "./rootState";

export function createPinia() {
  const state = ref({}); // store的id 和store的state，getter等组成的对象进行映射
  
  // 该pinia对象是管理所有的store的
  const pinia = {
    install(app) {
      // Vue.prototype.$pinia = pinia  Vue2的方式
      
      // 这种全局绑定的方式是为支持options api的写法，组件中通过this.$pinia方式获取该pinia实例对象的
      app.config.globalProperties.$pinia = pinia;

      // 这种全局绑定的方式是为支持composition api的写法，组件中通过inject注入使用
      app.provide(PiniaSymbol, pinia);
    },
    state,
    _s: new Map(), // 用于缓存不同store，避免多次调用store的useXxx之间彼此独立，起到一个单例模式的效果
  };

  return pinia;
}

```



defineStore.js:

```js
import { computed, getCurrentInstance, inject, reactive, toRefs } from "vue";
import { PiniaSymbol } from "./rootState";

export function defineStore(idOrOptions, setupOptions) {
  let id;
  let options;

  // 兼容两种用户传参方式
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setupOptions;
  } else {
    id = idOrOptions.id;
    options = idOrOptions;
  }

  // 在组件内部被调用的，用于返回仓库函数
  function useStore() {
    // 只有该方法是在组件中使用的时候才能获取到到pinia对象
    // 因为provide方法是将数据注入到组件的实例对象上的
    // inject方法也是从组件实例对象上取数据的
    const currentInstance = getCurrentInstance();
    const pinia = currentInstance && inject(PiniaSymbol);

    if (pinia) {
      if (!pinia._s.has(id)) {
        // 第一次调用，懒创建该store。
        if (typeof setupOptions === "function") {
          // 针对的是composition api的函数
          createSetUpStore(id, options, pinia);
        } else {
          // 针对的是options api的函数
          createOptionStore(id, options, pinia);
        }
      }

      // 对于已经注册过的仓库，直接返回
      return pinia._s.get(id);
    }
  }

  return useStore;
}

function createOptionStore(id, options, pinia) {
  const { state, actions, getters } = options;

  function setUp() {
    pinia.state.value[id] = state ? state() : {}; // 非响应式的数据
    const localState = toRefs(pinia.state.value[id]);
    const setUpState = Object.assign(
      localState,
      actions,
      Object.keys(getters).reduce((computeds, getterKey) => {
        computeds[getterKey] = computed(() => {
          return getters[getterKey].call(store);
        });
        return computeds;
      }, {})
    );
    return setUpState;
  }

  createSetUpStore(id, setUp, pinia);
}

function createSetUpStore(id, setUp, pinia) {
  const store = reactive({});

  const setUpState = setUp();

  function wrap(action) {
    return () => {
      return action.call(store, ...arguments);
    };
  }

  for (const key in setUpState) {
    if (Object.prototype.hasOwnProperty.call(setUpState, key)) {
      const element = setUpState[key];
      if (typeof value === "function") {
        setUpState[key] = wrap(element);
      }
    }
  }

  Object.assign(store, setUpState);
  pinia._s.set(id, store);
}
```





扩展：

> Vue3的全局属性机制。Vue3的实例创建是通过createApp，所以可能需要用app.config.globalProperties来挂载这些属性和方法。
>
> 如何编写插件，如何安装到应用中。
>
> 插件通常是一个函数或者包含install方法的对象。然后通过app.use()来安装。
>
> 如何让TypeScript支持这些全局属性，避免类型错误。需要在声明文件中扩展ComponentCustomProperties接口，这样在组件中使用时能有类型提示。
>
>
> 响应式的数据，可能需要使用provide/inject，并结合ref或reactive来保持响应性。
>
> 区分**全局属性和依赖注入**的不同使用场景，比如需要响应式数据的话，用provide可能更合适。
>
> 
> 
>
> 插件示例：
>
> ```js
> // plugins/global.js
> export default {
>   install: (app, options) => {
>     // 添加全局方法
>     app.config.globalProperties.$greet = (name) => {
>       return `Hello, ${name}! From global plugin`
>     }
> 
>     // 添加全局数据（推荐使用响应式）
>     const globalData = Vue.reactive({
>       version: '1.0.0',
>       author: 'Your Name',
>       config: {
>         apiUrl: 'https://api.example.com'
>       }
>     })
> 
>     // 通过 provide/inject 实现响应式数据共享
>     app.provide('globalData', globalData)
> 
>     // 或者直接挂载到全局属性（注意：如果不是响应式数据则是非响应式的）
>     app.config.globalProperties.$global = globalData
>   }
> }
> ```
>
> 
>
> 安装插件：
> ```js
> import { createApp } from 'vue'
> import App from './App.vue'
> import globalPlugin from './plugins/global'
> 
> const app = createApp(App)
> app.use(globalPlugin)
> app.mount('#app')
> ```
>
> 
>
> 类型声明（针对 TypeScript 项目）
>
> ```ts
> // src/types/global.d.ts
> import { ComponentCustomProperties } from 'vue'
> 
> declare module 'vue' {
>   interface ComponentCustomProperties {
>     $greet: (name: string) => string
>     $global: {
>       version: string
>       author: string
>       config: {
>         apiUrl: string
>       }
>     }
>   }
> }
> 
> export {}
> ```
>
> 
>
>
> 使用：
>
> 组合式 API（推荐）：
>
> ```js
> <script setup>
> import { inject } from 'vue'
> 
> // 通过 inject 获取响应式数据
> const globalData = inject('globalData')
> 
> // 访问全局方法
> const { proxy } = getCurrentInstance()
> const sayHello = () => {
>   console.log(proxy.$greet('Alice'))
> }
> </script>
> 
> <template>
>   <div>
>     <p>版本号: {{ globalData.version }}</p>
>     <p>API地址: {{ globalData.config.apiUrl }}</p>
>     <button @click="sayHello">打招呼</button>
>   </div>
> </template>
> ```
>
> 
>
> 选项式 API：
>
> ```js
> <script>
> export default {
>   mounted() {
>     console.log(this.$greet('Bob')) // 调用全局方法
>     console.log(this.$global.author) // 访问全局数据
>   }
> }
> </script>
> ```
>
>
> 关键点：
>
> 1. **全局方法**：通过 `app.config.globalProperties` 添加，可在任何组件实例中通过 `this` 访问
> 2. **全局数据**：
>    - 使用 `provide/inject` 方式更适合响应式数据共享
>    - 使用 `Vue.reactive()` 创建响应式对象
>    - 直接挂载到 `globalProperties` 的数据默认不具备响应性，需要用 `reactive` 包裹
> 3. **TypeScript 支持**：
>    - 需要扩展 `ComponentCustomProperties` 接口
>    - 确保类型声明文件被正确加载

### 最佳实践建议：

1. 对于需要响应式更新的数据，优先使用 `provide/inject` 方式
2. 全局方法命名建议添加统一前缀（如 `$`）以避免命名冲突
3. 避免在全局属性中存放过多数据，保持插件的轻量化







在 Pinia 中，当通过 `app.use(pinia)` 安装插件后，Vue 应用实例上会自动注册一个全局的 `$pinia` 属性。这个属性的主要作用和设计目的如下：

------

**核心目的**

**提供访问 Pinia 根实例的统一入口**
`$pinia` 是 Pinia 的根实例（Pinia instance），它承担着以下关键职责：

------

1. **Store 实例管理中心**

- **管理所有注册的 Store**
  通过 `$pinia._s` 可以访问到所有已创建的 Store 实例的 Map 集合（开发环境下谨慎使用）

  ```js
  console.log(this.$pinia._s) // 查看所有 Store 实例
  ```

- **Store 生命周期控制**
  负责 Store 的创建、缓存和销毁（当组件卸载时自动清理相关联的 Store）

------

2. **跨组件访问 Store**

- **在非组合式 API 环境中访问 Store**
  在选项式 API 或普通 JS 文件中，可以通过 `$pinia` 直接获取 Store：

  ```js
  // 在普通 JS 模块中
  import { useUserStore } from './stores/user'
  
  export function checkAuth() {
    const pinia = window.app.$pinia // 通过应用实例获取
    const userStore = useUserStore(pinia) // 显式传入 pinia 实例
  }
  ```

------

3. **插件集成入口**

- **为 Pinia 插件提供挂载点**
  插件可以通过 `$pinia` 访问到所有 Store 实例：

  ```js
  pinia.use((context) => {
    console.log(context.pinia) // 当前 pinia 实例
    console.log(context.store) // 当前正在初始化的 store
  })
  ```

------

4. **SSR 支持**

- **服务端渲染时的状态隔离**
  在 SSR 场景下，每个请求会创建独立的 `$pinia` 实例，确保不同用户间的状态隔离：

  javascript

  复制

  ```js
  // server.js
  export default function handleRequest(req) {
    const pinia = createPinia()
    const app = createApp(App).use(pinia)
    // 每个请求独立的 pinia 实例
  }
  ```

------

5. **高级状态操作**

- **直接访问全局状态**
  通过 `$pinia.state.value` 可以访问到所有 Store 的原始状态（慎用）：

  javascript

  复制

  ```js
  console.log(this.$pinia.state.value) // 所有 Store 的原始状态树
  ```

------



**典型使用场景示例**

在路由守卫中访问 Store

```js
// router.js
router.beforeEach((to) => {
  // 通过全局属性访问
  const pinia = window.app.$pinia
  const authStore = useAuthStore(pinia)
  
  if (!authStore.isLoggedIn) return '/login'
})
```



在工具函数中访问 Store

```js
// utils/analytics.js
export function trackEvent(eventName) {
  const pinia = window.app.$pinia // 获取全局实例
  const analyticsStore = useAnalyticsStore(pinia)
  analyticsStore.logEvent(eventName)
}
```

------



**注意事项**

1. **常规开发中不需要直接操作 `$pinia`**
   大多数情况下应该使用 `useStore()` 组合式函数：

   ```js
   // 正确方式（自动注入 pinia 实例）
   const store = useStore()
   ```

   

2. **TypeScript 类型支持**
   如果需要扩展类型声明：

   ```typescript
   declare module 'vue' {
     interface ComponentCustomProperties {
       $pinia: Pinia
     }
   }
   ```

3. **避免直接修改状态**

   ```typescript
   // ❌ 危险操作
   this.$pinia.state.value.cartStore = {} 
   
   // ✅ 应该通过 Store 方法修改
   const cartStore = useCartStore()
   cartStore.clearCart()
   ```

------

**架构设计视角**

Pinia 通过 `$pinia` 实现了：

- **集中式实例管理**：统一管理所有 Store 的生命周期
- **依赖注入系统**：为 Store 提供隐式的上下文传递
- **框架可扩展性**：为插件系统提供基础设施





## 辅助方法

使用方式和实现原理。

### 批量修改状态

```vue
<script>
const store = useCounterStore();
  
const handleClick = ()=>{
  store.$patch({count:100})  // 补丁式修改
}

const handleClick = () => {
  store.$patch((state) => {
    state.count++;
    state.count++;
  })
}
</script>
```









