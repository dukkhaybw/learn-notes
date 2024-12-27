Vue3项目管理系统

- 项目搭建
- 常见组件编写
- 组件规划
- 项目文件夹规划
- 整个开发流程
- 缓存
- 动态组件



Vue3项目的开发环境搭建

- 从零到一配置项目所需要的内容
- 组件动态加载配置
- 样式编写
- 项目文件夹规划
- eslint和prettier



## 项目脚手架搭建

使用vite搭建项目，本地node版本是20以上的，安装依赖主要依赖pnpm。

- npm install pnpm -g



使用pnpm创建一个基于vite的项目：

- pnpm create vite [projectName --template vue-ts]
- cd projectName 
- pnpm install 
- pnpm run dev

vue的版本是3.5





## **代码规范**

### **eslint**

通过vite快速创建的一个项目默认情况下是不会配置和eslint相关的依赖和配置文件的，需要开发者自行引入并配置。

vscode中项目插件的安装推荐：当希望其他项目组的成员也能安装某些插件时，可以在vscode中的插件市场中，点击插件的右下角的设置齿轮图标，然后选择添加到工作区建议，这样项目的根目录下就能自动生成一个.vscode目录，里面的extensions.json中就会有推荐的插件。

```json
{
  "recommendations": ["Vue.volar", "dbaeumer.vscode-eslint"]
}
```

- `npx eslint --init`  然后通过问答的方式去选择如何使用eslint，选择后它会自动安装依赖和生产eslint的配置文件
- 可以在项目的package.json中增加一个脚本命令，执行这个脚本让eslint根据配置文件去校验项目中的目标文件，以查看哪些不符合规范的文件的代码情况： `"lint": "eslint"`

eslint也能做一些代码格式化相关的工作，只是一般不会用eslint作格式化，同时，eslint针对代码中存在问题的一些代码行，可以尽可能的进行修复，可以通过配置setting.json文件在保存项目文件时自动修复，也可以配置脚本命令，通过命令去找出项目所有存在问题的代码，并尝试修复：`“lint:fix”:"eslint --fix --quiet"` ，修复和忽略警告。

eslint主要作代码规范校验并可以尝试修复。



### **prettier**

prettier主要是格式化代码的。比如每个语句最后是否有分号，是用双引号还是单引号之类的。

- pnpm install prettier eslint-plugin-prettier eslint-config-prettier -D

这三个包 **`prettier`**、**`eslint-plugin-prettier`**、**`eslint-config-prettier`** 通常一起使用来确保代码风格一致性，并减少 ESLint 和 Prettier 之间的冲突。它们之间的关系如下：

1. **Prettier**

- **作用**：Prettier 是一个代码格式化工具，专注于代码的**格式**，例如缩进、行尾、引号、空格等问题。
- **工作原理**：它完全忽略代码的语义（如 ESLint 的规则），只处理代码的外观，使代码格式化成一致的风格。

2. **eslint-plugin-prettier**

- **作用**：将 Prettier 的格式化功能集成到 ESLint 中作为一个规则。它使 ESLint 也能够检查 Prettier 的格式问题。
- **工作原理**：当代码格式不符合 Prettier 的规则时，ESLint 将会报错。这使得 ESLint 可以同时处理**代码逻辑**和**代码格式**。
- **用法**：可以在 `.eslintrc` 配置文件中加入 `plugin:prettier/recommended` 来启用这个插件。

3. **eslint-config-prettier**

- **作用**：解决 ESLint 和 Prettier 之间的**规则冲突**。ESLint 有一些规则会与 Prettier 的格式化规则冲突（比如空格、缩进等），`eslint-config-prettier` 通过禁用与 Prettier 冲突的 ESLint 规则来解决这种冲突。
- **工作原理**：它禁用所有和代码格式相关的 ESLint 规则，让 Prettier 完全控制格式化问题。

总结关系：

1. **Prettier** 是用于格式化代码的工具。
2. **eslint-plugin-prettier** 将 Prettier 作为 ESLint 的一部分来运行，通过 ESLint 报告 Prettier 的格式化问题。
3. **eslint-config-prettier** 禁用 ESLint 中可能与 Prettier 冲突的格式化规则，确保两者兼容。

使用顺序：

1. **Prettier** 负责格式化代码。
2. **eslint-plugin-prettier** 在 ESLint 中检查 Prettier 的格式问题。
3. **eslint-config-prettier** 禁用 ESLint 中与 Prettier 冲突的规则，使 Prettier 完全控制代码格式。



prettier.config.js

```js
export default {
  singleQuote: false,
  semi: false,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
  endOfLine: "auto"
}
```





解决prettier和eslint之间的规则冲突：

eslint.config.js(eslint9版本的配置文件)

```js
import globals from "globals"
import pluginJs from "@eslint/js" // 校验js规范，推荐规范
import tseslint from "typescript-eslint" // 推荐的ts规范
import pluginVue from "eslint-plugin-vue" // 推荐的vue规范
import prettierRecommended from "eslint-plugin-prettier/recommended"

export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] }, // 需要校验的文件位置和类型
  {
    // 源码中可以直接使用的一些全局变量
    languageOptions: {
      globals: {
        // 浏览器中的全局变量，比如window
        ...globals.browser,
        // node中的全局变量，比如global
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  // 校验vue中的ts代码
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    // 需要eslint忽略的校验文件的类型
    ignores: [".css", "*.d.ts"],
    // 自定义的校验规则
    rules: {
      "no-console": "warn",
      semi: "error",
      "vue/multi-word-component-names": "off"
    }
  },
  // 使用prettier中的格式化规则覆盖eslint推荐的同名规则
  prettierRecommended
]


```



解决代码格式上面的冲突之后， 如果一个项目文件中有代码格式问题的话，还需要自己手动一行行的修改，为了能就格式方面的问题在保存文件的时候自动格式化文件，需要开启vscode编辑器自带的自动格式化后保存功能即可。选择默认的格式化插件为prettier

![image-20241121145452037](D:\learn-notes\vue\images\image-20241121145452037.png)

同时在每次保存时，自动格式化一下：

![image-20241121145554846](D:\learn-notes\vue\images\image-20241121145554846.png)





**编辑自身的配置**

.editorconfig

```
root=true

[*]
charset = uft-8
indent_style = space
indent_size = 2
end_of_line = lf
```





## **代码提交管理**

如果在没做代码提交校验时，即使项目中有不符合规范的代码，当开发人员保存后，仍旧可以提交到git仓库中，影响代码规范。这时就希望在每个提交之前，先让git去自动执行一个eslint 脚本命令，之后通过校验后才能继续提交，没通过就不能提交。

给git添加勾子，husky提供了不同的勾子，每次提交前，提交后等不同的节点都可以去执行一些自动化的任务（比如提交代码后的自动部署等）。

- `pnpm install husky  lint-staged -D`

但是每次提交的时候并不需要针对所有文件都去进行一次校验，而只需要对有变化的文件进行校验，这时就需要借助lint-staged。



`Husky` 是一个用于管理 Git hooks 的工具，它可以帮助开发者在 Git 生命周期的不同阶段（如提交前、提交后、推送前等）执行自定义的脚本或命令。通过使用 `Husky`，可以轻松地将这些钩子集成到项目中，而不需要手动创建和维护 Git 钩子文件。

Husky 可以轻松设置和管理 Git 钩子，例如 `pre-commit`、`pre-push` 和 `commit-msg` 等。通过简单的配置，可以让开发团队在代码提交前自动执行检查，提高代码质量。

安装和使用示例：

1. **安装 Husky**：

   ```bash
   npm install husky --save-dev
   ```

2. **启用 Git 钩子**：

   ```bash
   npx husky init
   ```

3. **添加钩子**： 

   方式一：例如，添加一个 `pre-commit` 钩子，在每次提交之前运行 lint-staged：

   ```bash
   npx husky add .husky/pre-commit "npm run lint-staged"
   ```

   此时的package.json文件中的内容如下：

   ```json
   {
       "lint-staged": {
           "*.js": ["eslint --fix", "prettier --write"]
       }
   }
   ```

   

   方式二：

   **配置文件示例**（在 `package.json` 或独立的配置文件中）：

   ```json
   {
       "lint-staged": {
           "*.js": ["eslint --fix", "prettier --write"]
       },
       "husky": {
           "hooks": {
               "pre-commit": "lint-staged",
               "commit-msg": "commitlint --edit $1"
           }
       }
   }
   ```

结合其他工具：

- **Lint-staged**：在提交前只对被修改的文件执行检查。
- **Commitlint**：检查提交信息的格式，确保符合团队规范。

使用场景：

- **代码质量控制**：在团队开发中，确保提交的代码符合格式和质量标准。
- **自动化工作流**：通过自动执行命令，减少人工检查的工作量。



`Husky` 提供了一些常用的命令和配置选项，帮助管理和使用 Git hooks。以下是一些常见的 `Husky` 指令及其用途：

**初始化 Husky**：npx husky init

这一步会在项目根目录下创建一个 `.husky` 目录，并设置必要的文件。

**创建和管理 Hooks**

1. **创建一个新的 Hook**

```
npx husky add .husky/<hook-name>
```

例如，创建一个 `pre-commit` 钩子：

```
npx husky add .husky/pre-commit
```

这会创建一个 `.husky/pre-commit` 脚本文件，并打开它以供编辑。

1. **编辑 Hook 脚本** 编辑 `.husky/<hook-name>` 文件，添加你想要执行的命令。例如，编辑 `.husky/pre-commit` 文件：

   ```
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   npx lint-staged
   ```

2. **列出所有 Hooks**

   ```
   npx husky list
   ```

   这会显示当前项目中所有的 Husky 钩子。

3. **删除一个 Hook**

   ```
   rm -rf .husky/<hook-name>
   ```

   例如，删除 `pre-commit` 钩子：

   ```
   rm -rf .husky/pre-commit
   ```

**配置文件**

**也**可以在 `package.json` 中直接配置 Husky 钩子，这种方式更加简洁和易于管理。例如：

```
{
  "husky": {
    "hooks": {
      "pre-commit": "npx lint-staged",
      "pre-push": "npm test",
      "post-merge": "npm install"
    }
  }
}
```

**常见 Hooks**

以下是一些常用的 Git hooks 及其常见用途：

- **pre-commit**: 在提交前运行，常用于代码格式化和质量检查。

- **pre-push**: 在推送前运行，常用于运行测试。

- **post-checkout**: 在切换分支后运行，常用于环境配置。

- **post-merge**: 在合并后运行，常用于环境配置。

- **prepare-commit-msg**: 在准备提交消息时运行，常用于自动生成提交消息。

  ```
  node scripts/generate-commit-message.js
  ```

**其他命令**

- **启用或禁用 Hooks**

  ```
  git config --bool core.hooksPath true
  ```

  或

  ```
  git config --bool core.hooksPath false
  ```

- **检查 Husky 版本**

  ```
  npx husky --version
  ```

**示例**

假设你已经安装了 `lint-staged` 和 `ESLint`，并且希望在提交前自动格式化 JavaScript 文件并检查代码质量， `package.json` 可能看起来像这样：

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "eslint": "^7.0.0",
    "husky": "^6.0.0",
    "lint-staged": "^10.0.0",
    "prettier": "^2.0.0"
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test",
      "post-merge": "npm install"
    }
  }
}
```

通过这些命令和配置，可以轻松地管理和使用 Git hooks，确保代码质量和一致性。



**Lint-staged** 是一个用于在 Git 提交时**只对被修改**的文件执行 linters 和其他命令的工具。它的主要目的是提高开发效率，确保在代码提交时只检查和处理实际被更改的文件，从而减少不必要的开销。

主要功能和特性：

1. **针对性执行**：只对暂存区（staged）中的文件执行指定的 linting 和格式化命令，而不是对整个代码库进行检查。这可以显著提高执行速度，特别是在大型项目中。
2. **与 Husky 集成**：通常与 Husky 配合使用，在 Git 提交前执行 lint-staged，以确保提交的代码符合预设的标准。
3. **灵活配置**：允许用户自定义每种文件类型对应的 linting 和格式化工具。例如，可以对 JavaScript 文件使用 ESLint，对 CSS 文件使用 stylelint 等。
4. **支持多种工具**：与多种 linters 和格式化工具兼容，易于集成到现有工作流中。

安装和使用示例：

1. **安装 lint-staged**：

   ```
   npm install lint-staged --save-dev
   ```

2. **配置 lint-staged**： 可以在 `package.json` 中配置 lint-staged，例如：

   ```json
   {
       "lint-staged": {
           "src/**/*.{js,cjs,ts,vue}": [
               "npm run lint:fix"
           ],
           "src/**/*.{html,css,scss,json}": [
               "npx prettier --fix"
           ],
           "*.md": "npx prettier --write"
       },
       "husky": {
           "hooks": {
               // 在commit前，先执行lint-staged命令
               // lint-staged会读取上面的配置想，针对不同类型的文件执行不同的命令行命令
               "pre-commit": "lint-staged",
               "pre-push": "npm test",
               "post-merge": "npm install"
           }
       }
   
   }
   ```

3. **与 Husky 集成**： 在 Git 提交前运行 lint-staged：

   ```bash
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

使用场景：

- **代码质量控制**：确保在提交代码时，所有被修改的文件都符合格式和质量标准。
- **提高效率**：通过只检查改动的文件，节省时间和计算资源。
- **自动化工作流**：简化开发流程，减少手动检查和修复代码的工作量。







### **git提交说明规范**

- pnpm install @commitlint/cli @commitlint/config-conventional -D

commitlint.config.cjs:

```js
module.exports = {
    extends:['@commitlint/config-conventional']
}
```

增加git hook：commit-msg

```
npx commitlint --edit $1
```





## vue-router配置

项目中的试图组件一般放在src/views目录中。项目共享组件一般放在src/components中。

- pnpm install vue-router

项目的路由配置一般放在src/router目录中

index.ts:

```ts
import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import Layout from "@/layout/index.vue"

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/index.vue")
      }
    ]
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router

```

main.ts:

```ts
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

const app = createApp(App)
app.use(router)
app.mount("#app")
```



App.vue:

```vue
<script setup lang="ts"></script>

<template>
  <router-link to='/dashboard'>dashboard</router-link>
  <router-view></router-view>
</template>

<style scoped></style>

```



## pinia配置

pinia和vuex的不同之处在于，pinia有多个store。所以项目中统一状态管理的文件夹一般放在src/stores目录中。

- pnpm install pinia -S

创建：

![image-20241121161301760](D:\learn-notes\vue\images\image-20241121161301760.png)

注册：

![image-20241121161340112](D:\learn-notes\vue\images\image-20241121161340112.png)



使用：

不能解构，解构会导致响应式丧失。

![image-20241121161523810](D:\learn-notes\vue\images\image-20241121161523810.png)



## 路径别名

有两个地方需要配置：

1. vite编译打包项目时是被路径别名的配置

   cite.config.js:

   ```js
   import { defineConfig } from "vite"
   import path from "path"
   import vue from "@vitejs/plugin-vue"
   
   // https://vite.dev/config/
   export default defineConfig({
     resolve: {
       alias: [
         {
           find: "@",
           replacement: path.resolve(__dirname, "src")
         }
       ]
     },
     plugins: [vue()]
   })
   ```

   

2. vscode编辑器中ts识别的路径别名，用于ctrl+左键跳转文件使用

   tsconfig.json

   ```json
   {
       "compilerOptions": {   
           "baseUrl": ".",
           "paths": {
               "@/*": ["src/*"]
           }
       }
   }
   ```

   





## 引入组件库

- pnpm install element-plus -S

全量引入element-plus库：

main.ts

```ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import ElementPlus from "element-plus"
import App from "./App.vue"
import router from "./router"
import "element-plus/dist/index.css"

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount("#app")

```



element-plus组件库是用ts编写的，组件库提供了一个类型文件，存放在element-plus包下面的global.d.ts中，如果希望项目中使用的element-plus中的组件时有类型提示，可以额外扩展ts的类型声明文件。通过`tsconfig.json` 文件中，`compilerOptions` 下的 `types` 补充element-plus的类型文件即可：

```json
{
    "compilerOptions": {
        "types": ["element-plus/global"]
    }

}
```



扩展：

`tsconfig.json` 文件中，`compilerOptions` 下的 `types` 选项用于指定要包含的类型声明文件（即 `.d.ts` 文件）。这项配置主要用来控制编译时 TypeScript 引擎加载哪些**全局类型声明**，从而避免加载不必要的类型库或模块。

**用途**

`types` 选项允许你手动指定要加载的类型声明包，而不是 TypeScript 默认自动加载所有可能存在的类型声明。默认情况下，TypeScript 会从 `node_modules/@types/` 目录中自动加载所有的全局类型声明文件。如果你只想加载某些特定的类型声明，可以通过 `types` 选项来进行控制。

**语法**

`types` 的值是一个数组，数组中的每个元素都是一个 `@types` 包的名称，或者是一个自定义的类型声明目录名称。

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "lodash"]
  }
}
```

**功能解释**

- **类型声明文件**：TypeScript 支持 `.d.ts` 类型声明文件，它们提供了对第三方库、全局变量的类型定义。
- **控制自动加载**：通过 `types` 选项，你可以精确控制哪些类型声明文件应该被加载，而不是让 TypeScript 默认加载 `@types/` 目录下的所有类型。

**示例**

1. **自动加载（默认行为）**

   TypeScript 默认会自动加载 `node_modules/@types/` 目录中的所有类型声明。如果你安装了 `@types/node` 和 `@types/jest`，它们会自动被加载：

   ```
   npm install --save-dev @types/node @types/jest
   ```

   此时，不需要在 `tsconfig.json` 中设置 `types` 选项，TypeScript 会自动加载这些类型声明。

2. **手动加载指定的类型**

   如果你不希望自动加载所有的全局类型声明，而是只想加载特定的类型库，比如 `node` 和 `jest`，可以在 `tsconfig.json` 中进行如下设置：

   ```json
   {
     "compilerOptions": {
       "types": ["node", "jest"]
     }
   }
   ```

   这样 TypeScript 只会加载 `@types/node` 和 `@types/jest`，而忽略其他类型声明。

3. **忽略所有类型声明**

   如果你不想加载任何全局类型声明，可以将 `types` 设置为空数组：

   ```json
   {
     "compilerOptions": {
       "types": []
     }
   }
   ```

**使用场景**

- **限制类型声明的加载**：在大型项目中，可能会有很多自动加载的类型声明，但并不是所有类型都被用到。通过 `types` 选项，你可以限制 TypeScript 只加载你指定的类型声明，避免不必要的类型检查，提升编译性能。
- **避免类型冲突**：有时候，项目中不同库的类型声明可能会产生冲突，使用 `types` 选项可以避免不需要的类型声明被加载，减少冲突风险。

**总结**

- `types` 选项用于手动指定要包含的类型声明包。
- 它能帮助控制编译时 TypeScript 自动加载的全局类型声明，避免加载不需要的类型。
- `types` 常用于提高编译性能或解决类型冲突。



## 布局组件



## 样式

管理系统一般有两个独立的页面，登录页和管理系统内部页。

布局组件：





#### 扩展css变量

开发者定义可复用的值，提高样式的可维护性和灵活性。

1. **定义变量**

CSS变量通常使用两条短横线作为前缀，并在`:root`或其他选择器中定义。例如：

```css
:root {
  --main-color: #3498db;
  --font-size: 16px;
}
```

- `:root` 是 CSS 中的一个伪类，表示文档的根元素（通常是 `html`）。在 `:root` 中定义的变量可以全局使用。
- `--main-color` 和 `--font-size` 是变量名，后面是它们的值。

2. **使用变量**

变量通过 `var()` 函数使用，语法如下：

```css
color: var(--main-color);
font-size: var(--font-size);
```

- **基本用法**：`var(--变量名)`。

- 带默认值：`var(--变量名, 默认值)`，如果变量未定义或值无效，使用默认值。例如：

  ```css
  color: var(--secondary-color, #ff0000);
  ```

**实际例子**

```css
:root {
  --main-bg-color: #f0f0f0;
  --main-text-color: #333;
  --button-padding: 10px 20px;
}

body {
  background-color: var(--main-bg-color);
  color: var(--main-text-color);
}

button {
  padding: var(--button-padding);
  background-color: var(--main-text-color);
  color: var(--main-bg-color);
}
```

**CSS变量的优点**

1. **可复用性**：减少重复定义的代码。

2. **动态性**：变量的值可以根据上下文动态改变，例如通过 JavaScript 更新：

   ```js
   document.documentElement.style.setProperty('--main-color', '#ff5722');
   ```

3. **简化维护**：只需更改变量值即可影响所有使用该变量的地方。

**注意事项**

1. **浏览器支持**：CSS变量在现代浏览器中已被广泛支持，但在 IE 浏览器中不支持。
2. **作用域**：CSS变量具有作用域，可以在特定的选择器中定义并使用，只对该选择器及其子元素生效。





`:root` 是 CSS 中的一个伪类，它表示文档的根元素，通常是 HTML 文档中的 `<html>` 元素。它可以用来为整个文档定义全局的样式规则。

**特性与作用**

1. **全局作用范围**

   - 使用 `:root` 伪类定义的样式通常适用于整个文档。
   - 因为 `:root` 的优先级比直接选择 `html` 元素高，适合用来定义全局变量或样式。

2. **常用于 CSS 自定义变量（CSS Variables）**
   `:root` 是定义全局 CSS 变量的最佳位置，因为它的作用范围覆盖整个文档。例如：

   ```css
   :root {
     --primary-color: #3498db;
     --font-size: 16px;
   }
   
   body {
     color: var(--primary-color);
     font-size: var(--font-size);
   }
   ```

3. **与 HTML 元素的区别**
   尽管在大多数情况下 `:root` 和 `html` 选择器表现一致，但 `:root` 是一个伪类，它的优先级比直接选择 `html` 要高。

   ```css
   html {
     color: red;
   }
   
   :root {
     color: blue;
   }
   ```

   在上述例子中，文档中的文本颜色会是蓝色，因为 `:root` 的样式覆盖了 `html` 的样式。

4. **作用范围**
   如果需要使用不同的作用域，可以在特定子元素上重新定义变量，这些变量会覆盖 `:root` 中的全局定义：

   ```css
   :root {
     --main-bg-color: white;
   }
   
   body {
     background-color: var(--main-bg-color);
   }
   
   section.dark-theme {
     --main-bg-color: black;
   }
   ```

   在 `section.dark-theme` 中，背景颜色会变为黑色，而其他地方依然是白色。

