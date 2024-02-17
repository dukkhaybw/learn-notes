## 什么是gulp

- gulp

  是可以自动化执行任务的工具，在平时开发的流程里面,一定有一些任务需要手工重复得执行，比如:

  - 把文件从开发目录拷贝到生产目录（拷贝文件）

  - 把多个 JS 或者 CSS 文件合并成一个文件（编译js，css，文件合并）

  - 对JS文件和CSS进行压缩

  - 把sass或者less文件编译成CSS

  - 压缩图像文件

  - 创建一个可以实时刷新页面内容的本地服务器

    > 只要你觉得有些动作是要重复去做的,就可以把这些动作创建成一个gulp任务,然后在指定的条件下自动执行



## gulp特点

- 易于使用，通过代码优于配置的策略,Gulp 让简单的任务简单，复杂的任务可管理
- 快速构建，利用 node.js 流的威力,你可以快速构建项目并减少频繁的 IO 操作
- 高质量的插件，Gulp 严格的插件指南确保插件如你期望的那样简洁地工作
- 易于学习





## 基本使用

```shell
npm install --g gulp-cli
npm install --save-dev gulp
```

gulp主要用于定义任务并执行任务。

使用gulp需要在项目根目录下写一个配置文件：gulpfile.js或者Gulpfile.js。

当执行gulp命令时，gulp会自动加载该文件，在该文件中可以编写任意的JavaScript代码和使用node中的模块。同时该文件导出的任何函数都会被注册到gulp的任务系统中。

```js
function defaultTask(done){
  console.log('defaultTask');
  done();
}

exports.default = defaultTask;
```



```shell
gulp 
 or
gulp default
```

打印如下：

```
PS C:\Users\shuyi\Desktop\test\gulp> gulp
[09:38:00] Using gulpfile ~\Desktop\test\gulp\gulpfile.js
[09:38:00] Starting 'default'...
defaultTask
[09:38:00] Finished 'default' after 1.72 ms
```



gulpfile.js:

```js
const fs = require('fs');
const through = require('through2');
const { series, parallel } = require('gulp');
function callbackTask(done) {
    setTimeout(() => {
        console.log('callbackTask');
        done();
    }, 1000);
}
function promiseTask() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('promiseTask');
            resolve();
        }, 1000);
    });
}
async function asyncTask() {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
    console.log('asyncTask');
}
function streamTask() {
    return fs.createReadStream('input.txt')
        .pipe(through((chunk, encoding, next) => {
            setTimeout(() => {
                next(null, chunk);
            }, 1000);
        }))
        .pipe(fs.createWriteStream('output.txt'))
}

const parallelTask = parallel(callbackTask, promiseTask, asyncTask, streamTask);
const seriesTask = series(callbackTask, promiseTask, asyncTask, streamTask);
exports.callback = callbackTask
exports.promise = promiseTask
exports.async = asyncTask
exports.stream = streamTask
exports.parallel = parallelTask
exports.series = seriesTask
```



### 定义任务

每个gulp任务都是一个异步的JS函数，该函数接收一个错误优先的回调函数或返回一个流、承诺、事件发射器、子进程或可观察的函数。由于平台的一些限制，不支持同步任务。

任务分类：

1. 公有任务：有gulpfile文件导出，可以被gulp命令行执行
2. 私有任务：用于内部使用，通常用于series()或parallel()组合的一部分。

私有任务本质和公有任务一样，都是函数，但用户永远不能独立执行它。要注册一个公有任务，必须从 Gulpfile 中导出该任务函数。

```js
const { series } = require('gulp');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```



```
PS C:\Users\shuyi\Desktop\test\gulp> gulp --tasks
[10:17:02] Tasks for ~\Desktop\test\gulp\gulpfile.js
[10:17:02] ├── build
[10:17:02] └─┬ default
[10:17:02]   └─┬ <series>
[10:17:02]     ├── clean
[10:17:02]     └── build
```



### 任务组合

借助两个方法series或者parallel，允许将单个任务组合成更大的操作。这两种方法都接受任意数量的任务函数或组合操作。series()` 或者 `parallel()可以嵌套在它们自己或者彼此之间到任何深度。

串行执行：

```js
const { series } = require('gulp');

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.build = series(transpile, bundle);
```



并行执行：

```js
const { parallel } = require('gulp');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.build = parallel(javascript, css);
```



动态组合：

```js
const { series } = require('gulp');

function minify(cb) {
  // body omitted
  cb();
}

function transpile(cb) {
  // body omitted
  cb();
}

function livereload(cb) {
  // body omitted
  cb();
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(transpile, minify);
} else {
  exports.build = series(transpile, livereload);
}
```



嵌套：

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  publish
);
```



### 多次执行

```js
// This is INCORRECT
const { series, parallel } = require('gulp');

const clean = function(cb) {
  // body omitted
  cb();
};

const css = series(clean, function(cb) {
  // body omitted
  cb();
});

const javascript = series(clean, function(cb) {
  // body omitted
  cb();
});

exports.build = parallel(css, javascript);
```

这种情况下，clean会被执行两次而导致一些不可预期的情况，建议改成如下情况：

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```





## 异步任务

node中处理异步任务有多种方式，如：

1. 错误优先的异步回调函数
2. 基于事件发布订阅的流
3. promise
4. 事件发布
5. 子进程
6. 观察者模式

gulp对所有这些异步任务都做了统一的标准化处理。

当任务函数返回一个流、promise、事件发射器、子进程或可观察到的内容时，成功或错误将通知到gulp是继续还是结束。如果一个任务出错，gulp 将立即结束并显示该错误。

当使用 `series()`组合任务时，错误将结束组合，并且不会执行进一步的任务。当使用`parallel()`组合任务时，错误将结束组合，但其他并行任务可能完成，也可能不完成。



**返回函数**

如果任务函数不返回任何值，则必须要调用传给该任务函数的done函数，表示任务完成。

```js
function callbackTask(done) {
  // `done()` should be called by some async work
  done();
}

exports.default = callbackTask;
```

如果要使用错误优先回调指示任务中发生了错误，请将 Error 作为唯一参数调用它。

```js
function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'));
}

exports.default = callbackError;
```

也可以将此回调传递给另一个 API，而不是自己调用它。

```js
const fs = require('fs');

function passingCallback(cb) {
  // fs.access用于检查文件或目录的访问权限
  fs.access('gulpfile.js', cb);
}

exports.default = passingCallback;
```





**返回流**

src()：创建从文件系统读取vinyl对象的流。

dest()：创建用于将vinyl对象写入文件系统的流。

```js
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
```



**返回promise**

```js
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;
```



**返回事件发布者**

```js
const { EventEmitter } = require('events');

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
}

exports.default = eventEmitterTask;
```



**返回子进程**

```js
const { exec } = require('child_process');

function childProcessTask() {
  return exec('date');
}

exports.default = childProcessTask;
```



**返回观察者**

```js
const { Observable } = require('rxjs');

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;
```



**async/await**

```js
const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(version);
  await Promise.resolve('some result');
}

exports.default = asyncAwaitTask;
```



gulp不再支持同步任务。



## 操作文件

### src()

`src()`接收一个用于读取文件系统的通配符（glob），并生成一个Node流（stream）。它会定位所有匹配的文件，并将它们读取到内存中以通过流传递。通过`src()`生成的流应当从任务中返回，以表示异步操作的完成，正如在创建任务中所提到的。

```js
const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
```

流（stream）的主要API是`.pipe()`方法，用于链式连接转换流（Transform streams）或可写流（Writable streams）。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}
```



### dest()

`dest()`方法接收一个输出目录字符串，并生成一个Node流，通常被用作终止器流（terminator stream）。当它接收到通过流传递的文件时，它会将文件的内容和其他细节写入到指定目录的文件系统中。还有一个名为`symlink()`的方法，与`dest()`类似，但是它创建的是符号链接而不是文件（详见`symlink()`方法）。

通常，在`src()`和`dest()`之间会使用`.pipe()`方法将插件放置在流中，并对流中的文件进行转换处理。插件可以对文件进行各种操作和转换，从而实现对流中文件的处理。



`src()`也可以放置在流水线的中间，根据给定的通配符将文件添加到流中。额外的文件只会在流的后续转换中可用。如果通配符有重叠，那些文件将被再次添加。这在将一些文件转译为纯JavaScript文件之前，将文件添加到流中并对所有内容进行混淆压缩时非常有用。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}
```



`dest()`也可以在流水线的中间使用，将中间状态写入文件系统。当接收到一个文件时，当前状态会被写入文件系统，路径会被更新以表示输出文件的新位置，然后该文件会继续流动到下一个处理阶段。

这个功能对于在同一流水线中创建未经压缩和经过压缩的文件非常有用。通过在合适的位置使用`dest()`，可以在处理过程中生成不同版本的文件，例如原始版本和经过压缩的版本。

```js
const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(dest('output/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}
```



`src()`可以在三种模式下操作：缓冲模式（buffering）、流模式（streaming）和空模式（empty）。这些模式是通过`src()`上的`buffer`和`read`选项进行配置的。

- 缓冲模式是默认模式，它将文件内容加载到内存中。许多插件通常在缓冲模式下操作，而且很多插件不支持流模式。
- 流模式主要用于处理无法一次性加载到内存中的大型文件，比如大的图像或电影。内容会从文件系统以小块的形式进行流式传输，而不是一次性加载。如果您需要使用流模式，请寻找支持该模式的插件，或者自己编写插件来实现流模式。
- 空模式不包含任何内容，在仅需要处理文件元数据时非常有用。



**解释通配符（Globs）**
通配符（Glob）是一个由字面字符和/或通配符字符组成的字符串，用于匹配文件路径。通配符匹配是使用一个或多个通配符定位文件系统上的文件的过程。

`src()`方法期望接收一个单独的通配符字符串或一个通配符字符串的数组，以确定流水线将操作哪些文件。至少要找到一个通配符匹配，否则`src()`将报错。当使用通配符字符串的数组时，它们按数组顺序进行匹配，这对于负向通配符特别有用。



**段落和分隔符**
**段落是分隔符之间的所有内容。**通配符中的分隔符始终是斜杠（/）字符，无论操作系统如何，即使在Windows中路径分隔符是反斜杠（\）。在通配符中，双斜杠（\）被保留为转义字符。

在下面的示例中，星号（*）被转义，因此它被视为字面字符而不是通配符字符。

```
'glob_with_uncommon_\\*_character.js'
```

请避免使用Node的路径方法（如`path.join`）来创建通配符（globs）。在Windows上，它会生成无效的通配符，因为Node使用`\\`作为分隔符。同样的原因，也请避免使用`__dirname`全局变量、`__filename`全局变量或`process.cwd()`。

这是因为通配符的分隔符始终是正斜杠（`/`），而不受操作系统的影响。因此，应该直接使用正斜杠来创建通配符，而不依赖于Node的路径方法或特定的全局变量。

```
const invalidGlob = path.join(__dirname, 'src/*.js');
```



`*`：匹配单个段落中的任意数量（包括零个）字符。在匹配一个目录中的文件时非常有用。

```
'*.js'  这个通配符将匹配像index.js这样的文件，但不会匹配像scripts/index.js或scripts/nested/index.js这样的文件。
```



`**`：匹配跨段落的任意数量（包括零个）字符。在匹配嵌套目录中的文件时非常有用。请确保适当限制双星号通配符的使用，以避免不必要地匹配大型目录。

```'scripts/**/*.js'
'scripts/**/*.js'  在这里，通配符适当地限制在scripts/目录中。它将匹配像scripts/index.js、scripts/nested/index.js和scripts/nested/twice/index.js这样的文件。
```





由于通配符在数组中按顺序匹配，负向通配符必须在数组中至少跟随一个非负向通配符。首先，非负向通配符找到一组匹配，然后负向通配符从这些结果中删除一部分。当排除目录中的所有文件时，您必须在目录名后面添加`/**`，通配符库会在内部进行优化。

```
['scripts/**/*.js', '!scripts/vendor/**']
```

如果在负向通配符之后跟随任何非负向通配符，后续的匹配结果将不会被删除。

```
['scripts/**/*.js', '!scripts/vendor/**', 'scripts/vendor/react.js']
```

负向通配符可以作为限制双星号通配符的一种替代方法。

```
['**/*.js', '!node_modules/**']
```













