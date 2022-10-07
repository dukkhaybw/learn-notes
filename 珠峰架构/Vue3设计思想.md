Vue3设计思想

Vue3有哪些提升

与Vue2对比





Vue3响应式原理和依赖收集，reactive，effect，watch，computed，ref实现原理





## monorepo仓库构建

1. 下载pnpm  `npm install pnpm -g`

2. pnpm init

3. 创建多包管理配置文件pnpm-workspace.yaml
   ```yaml
   packages:
    - 'packages/*'   - 表示该根目录下的packages目录中存放各个独立的模块
   ```

   > 对于monorepo项目，当安装一个第三方包时，有可能该包是packages目录下某个项目私有的（私有的被安装在packages下该独立项目子项目的目录的node_modules中），也有可能是packages目录下的多个项目公共的（公共的包被安装在根目录下的node_modules目录中）。
   >
   > pnpm install qs -w （安装到当前工作目录的根模块，被公用）

![image-20221006110118822](.\images\image-20221006110118822.png)



扩展：

> // .npmrc
>
> shamefully-hosit = true   将第三方模块的依赖进行打平到node_modules目录下（这是为pnpm设置的，因为pnpm安装时默认采用符号连接，将第三方的依赖放在node_modules/.pnpm目录下的，这样就能避免幽灵依赖的情况），但是npm本身就是使用打平安装的方式，所以使用npm安装时不需要设置该配置选项。
>
> npm不支持monorepo方式，yarn可以，但是配置麻烦。learna也可以。

![image-20221006110632272](.\images\image-20221006110632272.png)

4. pnpm install esbuild typescript minimist -D -w



5. 项目中模块之间的相互引用
