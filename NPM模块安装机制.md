# NPM模块安装机制

先说明一下本人的实验环境：

> node版本：16.17.0
>
> npm版本：8.15.0
>
> 日期：2023-1-13



npm install 命令用来安装模块到`node_modules`目录。

## npm install packageName

安装之前，`npm install packageName`会先检查package.json和lock文件中包版本是否符合规则，不符合规则，则会重新下载安装规则范围内最新的包，并更新lock文件。 符合规则，并且有新的版本，则会升级覆盖本地本地包的版本，并更新package.json和lock文件。



如果希望，一个模块不管是否安装过，npm 都要强制重新安装，可以使用`-f`或`--force`参数。

```shell
npm install <packageName> --force
```



当项目中同时存在package.json和package.lock.json文件，但是没有node_modules时，执行npm install时，规则如下：

1. 首先，将两个文件中包的版本号进行版本规则校验，**不是校验两个文件中的包的版本是否完全一致，而是package.lock.json中指定的版本是否兼容package.json中所表示的包的版本范围。**
   >包的版本规则说明：
   >
   >- 版本通常由三位组成，形如：X.Y.Z 
   >
   >  
   >
   >版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
   >
   >- 主版本号(major)：当做了不兼容的 API 修改，
   >- 次版本号(minor)：当做了向下兼容的功能性新增，可以理解为Feature版本，
   >- 修订号(patch)：当做了向下兼容的问题修正，可以理解为Bug fix版本。

   以lodash版本为例，下图是lodash的所有版本情况：

   ![image-20230113150624563](C:/Users/shuyi/Desktop/study-notes/NPM%E6%A8%A1%E5%9D%97%E5%AE%89%E8%A3%85%E6%9C%BA%E5%88%B6.assets/image-20230113150624563.png)

```json
{
  "dependencies": {
    "lodash": "^3.9.0"   // 主版本号锁定不变，允许下载次版本号和修订号不同的版本
    // ^3.9.0 表示版本号 >=3.9.0 且 <= 3.10.1 都是允许符合规则的版本
  }
}

{
  "dependencies": {
    "lodash": "~3.9.0"   // 主版本号和次版本号锁定不变，允许下载修订号不同的版本
    // ^3.9.0 表示版本号 >=3.9.0 且 <= 3.9.3 都是允许符合规则的版本
  }
}

{
  "dependencies": {
    "lodash": "3.9.0"   // 主版本号和次版本号和修订号都锁定不变，不允许下载不同的版本
  }
}

```



回到正题，package.json和package.lock.json同一个包版本比较。例子：

### 情况一

package.json中：

```json
{
  "dependencies": {
    "lodash": "~3.9.0"
  }
}
```



lock.json中：

```json
{
  "name": "esm",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "lodash": "~3.9.0"
      }
    },
    "node_modules/lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  },
  "dependencies": {
    "lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  }
}
```

这时执行npm install，因为lock文件中的lodash版本`3.9.3` 符合package.json中 `~3.9.0`所代指的范围，所以直接根据lock文件中的包版本和地址进行下载安装。



### 情况二

package.json中：

```json
{
  "dependencies": {
    "lodash": "^3.9.0"
  }
}
```



lock.json中：

```json
{
  "name": "esm",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "lodash": "^3.9.0"
      }
    },
    "node_modules/lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  },
  "dependencies": {
    "lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  }
}
```

这时执行npm install，因为lock文件中的lodash版本`3.9.3` **还是**符合package.json中 `~3.9.0`所代指的范围，所以直接根据lock文件中的包版本和地址进行下载安装。



### 情况三

package.json中：

```json
{
  "dependencies": {
    "lodash": "^3.10.0"   // ~3.10.0 也是同一个情况
  }
}
```



lock.json中：

```json
{
  "name": "esm",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "lodash": "^3.9.0"
      }
    },
    "node_modules/lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  },
  "dependencies": {
    "lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  }
}
```

这时，lock文件中的lodash版本不再满足`^3.10.0`规则范围，再执行npm install 时，将根据packages.json文件去下载该版本规则范围内最新的版本，然后会更新lock文件内容：

```JSON
{
  "name": "esm",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "lodash": "^3.10.0"
      }
    },
    "node_modules/lodash": {
      "version": "3.10.1",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.10.1.tgz",
      "integrity": "sha512-9mDDwqVIma6OZX79ZlDACZl8sBm0TEnkf99zV3iMA4GzkIT/9hiqP5mY0HoT1iNLCrKc/R1HByV+yJfRWVJryQ=="
    }
  },
  "dependencies": {
    "lodash": {
      "version": "3.10.1",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.10.1.tgz",
      "integrity": "sha512-9mDDwqVIma6OZX79ZlDACZl8sBm0TEnkf99zV3iMA4GzkIT/9hiqP5mY0HoT1iNLCrKc/R1HByV+yJfRWVJryQ=="
    }
  }
}

```



### 情况四

package.json中：

```json
{
  "dependencies": {
    "lodash": "^4.0.0"
  }
}
```



lock.json中：

```json
{
  "name": "esm",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "lodash": "^3.9.0"
      }
    },
    "node_modules/lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  },
  "dependencies": {
    "lodash": {
      "version": "3.9.3",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-3.9.3.tgz",
      "integrity": "sha512-v5SKZhnCUujcTpFpHEIJZDVcBM2OYjROx732HyJ6kzKZtwStTb4LG6noqmK9etHqDNhf6X7itXx5s0hTpAXPpQ=="
    }
  }
}
```

这时，lock文件中的lodash版本不再满足`^4.0.0`规则范围，再执行npm install 时，将根据packages.json文件去下载该版本规则范围内最新的版本，然后会更新lock文件内容：

```json
{
  "name": "esm",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "lodash": "^4.0.0"
      }
    },
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg=="
    }
  },
  "dependencies": {
    "lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmmirror.com/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg=="
    }
  }
}
```





### 总结

如果本地有package.lock.json文件，但再次安装（npm install）时，会判断package.lock.json文件中包的版本是否在package.json文件中对应包的版本规则范围内，如果在则根据lock文件中包的版本规则走后续下载流程；如果不在，则根据package.json文件中包的版本规则范围，去下载该范围内最新的包的版本，并更新lock文件。

引用一张其他开发者的流程图：

![img](https://ask.qcloudimg.com/http-save/1692602/t3tec9quf9.png?imageView2/2/w/1620)





## npm update packageName

如果想更新已安装模块，就要用到[`npm update`](https://docs.npmjs.com/cli/update)命令。

> ```bash
> $ npm update <packageName>
> ```

它会先到远程仓库查询最新版本，然后查询本地版本。如果本地版本不存在，或者远程版本较新，就会安装远程版本，并更新本地的lock文件。



## 查询库版本

npm 模块仓库提供了一个查询服务，叫做 registry 。以 npmjs.org 为例，它的查询服务网址是 [`https://registry.npmjs.org/`](https://registry.npmjs.org/) 。

这个网址后面跟上模块名，就会得到一个 JSON 对象，里面是该模块所有版本的信息。比如，访问 [`https://registry.npmjs.org/react`](https://registry.npmjs.org/react)，就会看到 react 模块所有版本的信息。



```SHELL
$ npm view react

# npm view 的别名
$ npm info react
$ npm show react
$ npm v react
```

![image-20230113110128722](C:/Users/shuyi/Desktop/study-notes/NPM%E6%A8%A1%E5%9D%97%E5%AE%89%E8%A3%85%E6%9C%BA%E5%88%B6.assets/image-20230113110128722.png)



如果要查看一个库的所有历史版本：

```shell
$ npm view react versions
```

![image-20230113110028731](C:/Users/shuyi/Desktop/study-notes/NPM%E6%A8%A1%E5%9D%97%E5%AE%89%E8%A3%85%E6%9C%BA%E5%88%B6.assets/image-20230113110028731.png)



registry 网址的模块名后面，还可以跟上版本号或者标签，用来查询某个具体版本的信息。比如， 访问 https://registry.npmjs.org/react/17.0.2 ，就可以看到 React 的 17.0.2 版。

返回的 JSON 对象里面，有一个`dist.tarball`属性，是该版本压缩包的网址。

> ```javascript
> dist: {
>   shasum: '2a57c2cf8747b483759ad8de0fa47fb0c5cf5c6a',
>   tarball: 'http://registry.npmjs.org/react/-/react-0.14.6.tgz' 
> },
> ```

到这个网址下载压缩包，在本地解压，就得到了模块的源码。`npm install`和`npm update`命令，都是通过这种方式安装模块的。



## 缓存

`npm install`或`npm update`命令，从 registry 下载压缩包之后，都存放在本地的缓存目录。

这个缓存目录，在 Linux 或 Mac 默认是用户主目录下的`.npm`目录，在 Windows 默认是`%AppData%/npm-cache`。通过配置命令，可以查看这个目录的具体位置。

```shell
$ npm config get cache
$HOME/.npm
```





















