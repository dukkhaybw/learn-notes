# ahooks

这是一个优秀的React Hooks库。其能避免常见的闭包带来的数据更新不同步的问题。



```shell
npm install --save ahooks
```





## useRequest

这个Hook是异步数据管理的 Hook，React 项目中的网络请求场景可以使用 `useRequest` 。

通过插件式组织代码，核心代码极其简单，并且可以很方便的扩展出更高级的功能。目前已有能力包括：

- 自动请求/手动请求
- 轮询
- 防抖
- 节流
- 屏幕聚焦重新请求
- 错误重试
- loading delay
- SWR(stale-while-revalidate)
- 缓存



使用案例：

默认情况下，`useRequest` 第一个参数是一个异步函数，在组件初始化时，会自动执行该异步函数。同时自动管理该异步函数的 `loading` , `data` , `error` 等状态。

```jsx
import { useState } from 'react'
import { useRequest } from 'ahooks'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const {data,error,loading} = useRequest(requestData)

  function requestData(){
    return fetch('http://jsonplaceholder.typicode.com/posts').then(response => response.json())
  }
  console.log(data,error,loading)

  return (
    <div>
      {data.map(item=><li key={item.id}>{item.title}</li>)}
      <button onClick={()=>setCount(count+1)}>{count}</button>
    </div>
  )
}

export default App
```



**手动触发**

如果设置了 `options.manual = true`，则 `useRequest` 不会默认执行，需要通过 `run` 或者 `runAsync` 来触发执行。

```jsx
const { loading, run, runAsync  } = useRequest(changeUsername, {
    manual: true,
    onSuccess: (result, params) => {
        setState('');
        message.success(`The username was changed to "${params[0]}" !`);
    },
    onError: (error) => {
        message.error(error.message);
    },
});

const onClick = async () => {
    try {
        await runAsync(state);
        setState('');
        message.success(`The username was changed to "${state}" !`);
    } catch (error) {
        message.error(error.message);
    }
};

<button onClick={run} disabled={loading}>
    {loading ? 'Loading' : 'Edit'}
</button>
```

`run` 与 `runAsync` 的区别在于：

- `run` 是一个普通的同步函数，会自动捕获异常，可以通过 `options.onError` 来处理异常时的行为。

- `runAsync` 是一个返回 `Promise` 的异步函数，如果使用 `runAsync` 来调用，则意味着需要自己捕获异常。

  ```ts
  runAsync().then((data) => {
    console.log(data);
  }).catch((error) => {
    console.log(error);
  })
  ```



通过 `run(username)` 来修改用户名，可以配置`onSuccess` 和 `onError` 来处理成功和失败，也可以在返回值对象中解构出数据data，error等信息。

通过 `runAsync(username)` 来修改用户名，此时必须通过 catch 来自行处理异常。



`useRequest` 提供了以下几个生命周期配置项，供在异步函数的不同阶段做一些处理。

- `onBefore`：请求之前触发
- `onSuccess`：请求成功触发
- `onError`：请求失败触发
- `onFinally`：请求完成触发



```jsx
const { loading, run } = useRequest(editUsername, {
    manual: true,
    onBefore: (params) => {
        message.info(`Start Request: ${params[0]}`);
    },
    onSuccess: (result, params) => {
        setState('');
        message.success(`The username was changed to "${params[0]}" !`);
    },
    onError: (error) => {
        message.error(error.message);
    },
    onFinally: (params, result, error) => {
        message.info(`Request finish`);
    },
});

<button disabled={loading} type="button" onClick={() => run(state)}>
    {loading ? 'Loading' : 'Edit'}
</button>
```



**刷新**

`useRequest` 提供了 `refresh` 和 `refreshAsync` 方法，可以使用上一次的参数，重新发起请求。

假如在读取用户信息的场景中

1. 读取了 ID 为 1 的用户信息 `run(1)`
2. 通过某种手段更新了用户信息
3. 想重新发起上一次的请求，那就可以使用 `refresh` 来代替 `run(1)`，这在复杂参数的场景中是非常有用的

```jsx
import { useRequest } from 'ahooks';
import Mock from 'mockjs';
import React, { useEffect } from 'react';

function getUsername(id){
    console.log('use-request-refresh-id', id);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Mock.mock('@name'));
        }, 1000);
    });
}

export default () => {
    const { data, loading, run, refresh } = useRequest((id) => getUsername(id), { manual: true });

    useEffect(() => {
        run(1); 
    }, []);

    if (loading) {
        return <div>loading...</div>;
    }
    return (
        <div>
            <p>Username: {data}</p>
            <button onClick={refresh} type="button">
                Refresh
            </button>
        </div>
    );
};
```

`refresh` 和 `refreshAsync` 的区别和 `run` 和 `runAsync` 是一致的。





```tsx
const {
  loading: boolean,
  data?: TData,
  error?: Error,
  params: TParams || [],
  run: (...params: TParams) => void,
  runAsync: (...params: TParams) => Promise<TData>,
  refresh: () => void,
  refreshAsync: () => Promise<TData>,
  mutate: (data?: TData | ((oldData?: TData) => (TData | undefined))) => void,
  cancel: () => void,
} = useRequest<TData, TParams>(
  service: (...args: TParams) => Promise<TData>,
  {
    manual?: boolean,
    defaultParams?: TParams,
    onBefore?: (params: TParams) => void,
    onSuccess?: (data: TData, params: TParams) => void,
    onError?: (e: Error, params: TParams) => void,
    onFinally?: (params: TParams, data?: TData, e?: Error) => void,
  }
);
```









