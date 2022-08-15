# Git

## 学习Git的六条主线：

|        |            |
| ------ | ---------- |
| 工作区 | Git对象    |
| 暂存区 | tree对象   |
| 本地库 | commit对象 |

**repository**：版本库，简单理解成一个目录，这个目录里面的所有文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。

## 版本控制

版本控制软件是一种记录一个或若干文 件内容变化，以便将来查阅特定版本修订情况的系统。

作用：可以将某个文件回溯到之前的状态，甚至将整个项目都回退到过去某 个时间点的状态。就算把整个项目中的文件改的改删的删，也可以恢复到原先的样子。可以比较文件的变化细节，查出最后是谁修改了哪个地方，从而找出导致怪异问题出现的原因，又是谁在何时报告了某个功能缺陷等等。

### 集中化版本控制系统---代表：SVN

优势：

- 有一个单一的集中管理的服务器，保存所有文件的修订版本（版本库 ）
- 协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新
- 每个人都可以在一定程度上看到项目中的其 他人正在做些什么
- 管理员也可以轻松掌控每个开发者的权限，并且管理一个集中化的版本控制系统
- 每次存的都是差异 需要的硬盘空间会相对的小一点  可是回滚的速度会很慢,回滚是类似不断打补丁的方式
- 必须联网才能工作，在局域网内还好，带宽够大，速度够快，可如果在互联网上，遇到网速慢的话，可能提交一个10M的文件就需要5分钟

缺点：

- 中央服务器的单点故障
- 中央服务器的磁盘发生故障，会有丢失数据的风险

### 分布式版本控制系统---代表：Git

客户端并不只提取最新版本的文件快照，而是把代码仓库完整地镜像下来。分布式的版本控制系统在管理项目时 存放的不是项目版本与版本之间的差异，它存的是索引(所需磁盘空间很少 所以每个客户端都可以放下整个 项目的历史记录)，版本回退时直接跳转到对应的版本的索引就能实现。

优势：

- 断网的情况下也可以进行开发
- 避免了服务器的单点故障问题
- 分支切换速度快
- 每个人的电脑上都是一个完整的版本库
- 极其强大的分支管理

## 初始化配置

在下载安装好git后，对于第一次使用git的电脑，需要进行初始化配置。配置 Git 的工作环境。配置工作只需一 次，以后升级时还会沿用现在的配置。

配置：

git config 命令用来配置或读取相应的工作环境变量

> 用户名称和电子邮件地址，每次 Git 提交(提交到本地库)时都会引用这两条信息，说明是**谁提交了更新**，所以会随更新内容一 起被永久纳入历史记录。
>
> 
>
> 系统中对所有用户都普遍适用的配置：
>
> 配置文件存放目录：D:\Git\etc\gitconfig
>
> git config --system user.name "----"
>
> git config --system user.email -------@---.com
>
> 
>
> 配置文件存放目录：C:\Users\dukkha\.gitconfig
>
> git config --global user.name "----"
>
> git config --global user.email -------@---.com
>
> 
>
> 当前项目的 Git 目录中的配置文件：
>
> 配置文件所在目录：项目目录中的 .git\config 
>
> git config  user.name "----"
>
> git config  user.email -------@---.com
>
> 
>
> 每一个级别的配置都会覆盖上层的相同配置（从上往下，级别上升）
>
> 
>
> 要检查已有的配置信息，可以使用 git config --list 
>
> 
>
> 删除配置信息 
>
> git config --global --unset user.email
>
> git config --global --unset user.name



### linux基础命令

- clear ：清除屏幕

- pwd：打印当前所在目录路径  ,pwd:print working directory

- touch 文件名：在当前目录新建一个文件

- ls -a：查看隐藏文件  ，ls: list show

- mkdir 目录名：在所在命令行目录下创建一个目录

- rm 文件名：删除该文件

- rm -rf  目录名：删除非空目录（慎用）

- less 文件名：以分页方式查看文件内容（Q键退出 、空格键与B键翻页）

- cd .. : 返回上级目录

- echo 'test content'：往控制台输出信息

- echo 'test content' > test.txt：往text文件中写入箭头后面的内容，当前目录没有该文件就创建并写入。

- ll/ls ：将当前目录下的 子文件&子目录平铺在控制台

- find 目录名： 将对应目录下的子孙文件&子孙目录平铺在控制台

- find 目录名 -type f ：将对应目录下的文件平铺在控制台

- rm 文件名 ： 删除文件 

- mv 源文件 重命名文件: 重命名 

- cat 文件的 url : 查看对应文件的内容

- vim 文件的 url：选择文件进行内容编辑
  - 按 i 进插入模式 进行文件的编辑
  - 按 esc 键
  - 按 ：键 进行命令的执行
    - :q! 强制退出（不保存）
    - :wq 保存退出 
    - :set nu 设置行号
  
  
  
  ![image-20220203102449705](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20220203102449705.png)
  

### 初始化新仓库

- git init


  到此项目所在的目录，要对现有的某个项目开始用 Git 管理，该项目文件夹中的后代文件夹不能再次用git init初始化新仓库了。初始化后，在当前目录下会出现一个名为 .git 的目录，所有 Git 需要的数据和资源都存放在这个目录中。不过目前，仅仅是按照既有的结构框架初始化好了里边所有的文件和目录，但我们还没有开始跟踪管理项目中的任何一个文件。

| .git目录结构 |                                          |
| ------------ | ---------------------------------------- |
| hooks        | 目录包含客户端或服务端的钩子脚本；       |
| info         | 包含一个全局性排除文件                   |
| logs         | 保存日志信息                             |
| objects      | 目录存储所有数据内容；                   |
| refs         | 目录存储指向数据的提交对象的指针（分支） |
| config       | 文件包含项目特有的配置选项               |
| description  | 用来显示对仓库的描述信息                 |
| HEAD         | 文件指示目前被检出的分支                 |
| index        | 文件保存暂存区信息                       |

以后在提交数据之前，需要做一些任务（如代码校验），则需要将第三方工具放在hooks中，类似于js中的回调。

配置文件所在目录：项目目录中的 .git\config 文件中

git config  user.name "----"

git config  user.email -------@---.com



## Git对象

git核心是一个简单的键值对数据库。可以向该数据库插入任意类型的内容，它会返回一个键值，通过该键值可以在任意时刻再次检索该内容。

生成的git对象被放在了项目目录下的 .git\objects\git对象hash的头两位数\hash剩余的数字作为文件名的文件中。

**直接将工作区中的内容生成了git对象跳过暂存区而直接放到了本地库。**（每次文件发生改变都需要再次对该文件执行该命令，文件的hash值也随之改变）

生成git对象的底层命令：

- echo 'test content' | git hash-object -w --stdin ：
  -w 选项指示 hash-object 命令存储数据对象；若不指定此选项，则 该命令仅返回对应的键值  ；             
  --stdin（standard input）选项则指示该命令从标准输入读取内容； 若不指定此选项，则须在命令尾部给出待存储文件的路径 。

  | ：表示执行另外一条命令
  
- git hash-object -w 文件路径 ：将该文件压缩为二进制文件生成git对象并将git对象存放到本地库中。

- git hash-object 文件路径：只返回对应文件的键值，不生成git对象也不放入本地库中。这个命令只是为了得到某个文件内容生成的唯一hash值（文件内容没变，hash值就不变）。

  生成git对象的底层命令在生成git对像后，都被放在了本地仓库中了。它本质是做了文件内容和文件哈希值之间的一一对应关系（绑定关系）。

查看 .git\objects\中的文件：

- find .git/objects -type f 

查看某个git对象的文件内容：

- git cat-file -p githash值

查看某个git对象的数据类型：

- git cat-file -t githash值

   

  git对象是一个key：value组成的键值对，key为文件内容对应的hash值，value为文件内容。它在git中是blob类型的数据。

​		确实可以通过git对象，实现对文件内容和数据的一定程度上的管理了，但是会发现生成git对象很麻烦，同时在之后如果要会看某次文件的内容，就必须要通过 git cat-file -p githash值 命令去查看，就必须记得git对象的hash值，这是不现实的。同时，文件名并没有被保存——我们仅保存了文件的内容。

​		以上的操作都是在对本地数据库进行操作 不涉及暂存区



## 树对象

<u>**真正的项目快照本质是树对象**</u>

作用：解决文件名保存的问题，也允许我们将多个文件组织到一起。

 .git\objects\中的文件被Git 以一种类似于 UNIX 文件系统的方式存储。.git\objects\中的所有内容均以 树对象和数据对象(git 对象)或者提交对象的形式存储，其中树对象对应了 UNIX 中的目录项， 数据对象(git 对象)则大致上对应文件内容。

一个树对象包含了一条或多条记录（每条记录含有一个指向 git 对象或者子树对象的 SHA-1 指针，以及相应的模式、类 型、文件名信息）。一个树对象也可以包含另一个树对象。

生成树对象的命令：

- git update-index --add --cacheinfo  文件模式（数字）    git对象hash值   git对象对应的文件名  ：该命令只是将上面操作得到的给git对象的hash值和文件名进行了绑定，然后推入到暂存区，这个操作并没有生成新的git对象或者树对象。**如果已经有一个相同的文件名与一个git对象的hash值进行了绑定，且已经被推入暂存区中后，再用一个不同的git对象的hash值 与该文件名进行绑定并推入暂存区，则之前暂存区中的内容将被覆盖。**
  - 文件模式为：
    - 100644，表明这是一个普通文件 ；
    - 100755，表示一个可执行文件；
    - 120000，表示一个符号链接。
  - --add 选项： 因为此前该文件并不在暂存区中 首次需要—add 
  - --cacheinfo 选项： 因为将要添加的文件位于 Git 数据库中，而不是位于当前 目录下 所有需要 —cacheinfo
- echo 'new file' > new.txt | git update-index --add new.txt     ：直接将刚刚生成的new.txt文件推入到暂存区。
  这一命令相当于：
  git hash-object -w 文件路径及名字  和  git update-index --add --cacheinfo  文件模式    git对象hash值   git对象对应的文件名    的结合。
- git write-tree：将暂存区中的所有一个或者多个绑定了文件名的git对象组织为一组后生成一个树对象，同时暂存区也并没有清空。生成的树对象也有一个hash值。

查看树对象：

- git cat-file -p 树对象hash值

**查看暂存在状态的指令：**

- git ls-files -s :查看当前暂存区状态。



​	 Git 根据某一时刻暂存区（即 index 区域）所表示的状态创建并记录 一个对应的树对象，如此重复便可依次记录（某个时间段内）一系列的树对象。其实树对象是对暂存区内操作的抽象，这颗树对象相当于就是快照。

​     树对象存在的问题：确实可以通过树对象确定一个项目版本的内容组成了，然而，若想重用这些快照，你必须记住所有三个 SHA-1 哈希值。 并且，你也完全不知道是谁保存了这些快照，在什么时刻保 存的，以及为什么保存这些快照。

## 提交对象

提交对象能弥补树对象的不足。

每个提交对象都有一个自己的hash值。同时提交对象是链式的。

创建提交对象的命令：

- git commit-tree treehash -m “提交树”：基于提供的树对象创建新的提交对象,并在stdout上发出新的提交对象的hash值，**使用git log检查提交，无法查看到这类提交对象的存在，同时也不会移动head指针。**

- echo 'messages' | git commit-tree 树对象hash值 ：根据指定的一个树对象的 SHA-1 值，以及该提交的父提交对象（如果有的话 第一次将暂存区做快 照就没有父对象）

- echo 'messages' | git commit-tree 树对象hash值 -p 树对象hash值：根据指定的一个树对象的 SHA-1 值，以及该提交的父提交对象（如果有的话 第一次将暂存区做快 照就没有父对象）

  messages：对本次提交对象的日志说明。

查看提交对象：

- git cat-file -p 提交对象hash值

提交对象的格式：

​	它先指定一个顶层树对象，代表当前项目快照；然后是作者/提交者信息（依 据你的 user.name 和 user.email 配置来设定，外加一个时间戳）；留空 一行，最后是提交注释。



## 三类对象底层命令汇总

-  git hash-object -w 文件名(修改了多少个工作目录中的文件 此命令就要被执行多少次)
- git update-index --add --cacheinfo  文件模式  \  git对象hash值   git对象对应的文件名
- git write-tree
- echo 'messages' | git commit-tree 树对象hash值



## 工作区文件状态

- 已跟踪：是指本来就被纳入版本控制管理的文件，在上次快照中有它们的记录 或者 虽然没有被提交过，但是有生成过对应的git对象并被推入到暂存区了的文件。

  在工作一段时间后，已跟踪过的文件的状态：

  - 已提交
  - 已修改
  - 已暂存

- 未跟踪：既没有上次更新时的快照，也不在当前的暂存区域。

![image-20210116164602077](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210116164602077.png)

## 高层命令

- git init：初始化新仓库

- git status：确定各个文件当前处于什么状态

- git diff：当前做的哪些更新还没有暂存，分支的工作区和暂存区进行比较不同

- git diff  --cached：比较暂存区和版本库中区别

- git diff branvhName：比较工作区和版本库中的区别

- git diff 分支名 ：分支的工作区和本地库进行比较不同

- git diff --cached：查看有哪些更新已经暂存起来准备好了下次提交

- git add 文件名及url ：在 git add 后面可以指明要跟踪的文件或目录路径。如果是目录的话，就说明要递归 跟踪该目录下的所有文件。git add 的潜台词就是把目标文件快照生成git对象放入版本库，同时将git对象放入暂存区域，也就是 add file into staged area，同时未曾跟踪过的文件标记为已跟踪。

  对同一个文件执行多次编辑，并且每次编辑后都生成了git对象，那么每次生成的git对象是唯一的，但是将每次的git对象都推入到暂存区并用同一文件名，则会覆盖。

  git add 命令等价于下面的两个命令的组合：

  - git hash-object -w 文件名
  - git update-index --add --cacheinfo  文件模式  \  git对象hash值   git对象对应的文件名

- git commit ：这种方式会启动文本编辑器以便输入本次提交的说明。

  git commit –m “message xxx”

  git commit 的使用建议：

  ​    当暂存区域已经准备妥当可以提交时，在此之前，请一定要确认还有什么修改 过的或新建的文件还没有 git add 过，否则提交的时候不会记录这些还没暂存起来 的变化。所以，每次准备提交前，先用 git status 看下，是不是都已暂存起来了， 然后再运行提交命令 git commit。提交时记录的是放在暂存区域的快照，任何还未暂存的仍然保持已修改状态， 可以在下次提交时纳入版本管理。每一次运行提交操作，都是对你项目作一次快照， 以后可以回到这个状态，或者进行比较。

- git commit  -a  -m  '------' ： 跳过暂存区域 。Git 会自动把所有**已经跟踪过的文件**暂存起来一并提交， 从而跳过 git add 步骤。

- git rm 文件名：在工作区删除某个文件（不放入回收站），并将该删除操作生成一个git对象推入暂存区，之后只需要提交就可以。如果手动删除，该需要自己手动gir add ./ 生成git对象并推入暂存区。

-  git mv 原文件名 新文件名  将工作目录中的文件进行重命名 再将修改添加到暂存区

  等价于一下三条命令：

  - $ mv README.txt README 
  - $ git rm README.txt 
  - $ git add README

- git log：查看历史提交

- git log --pretty=oneline   

- git log --oneline

- git reflog

- git --version



## 分支

分支意味着你可以把你的工作从开发主线上分离开来，以免影响开发主线。**分支的本质是一个指向提交对象的可移动指针，它可能被head指向。**

**git branch**

- git branch 分支名： 基于当前所在分支指向的提交对象上创建 一个新分支，并不会自动切换到新分支中去。

- git branch ： 如果不加任何参数运行它， 会得到当前所有分支的一个列表。

- git branch -d name： 删除分支，不能在某分支上执行该命令来删除自己。往往是要切到master分支上去删除另一个需要删除的分支。不能删除没有被合并的分支。

- git branch -D name：强制删除分支

- git branch -v：查看每个分支的最后一次提交

- **git branch name commitHash ：新建一个分支并且使分支指向对应的提交对象，实现版本跳转**

- git branch –-merged ：查看哪些分支已经合并到当前分支 在这个列表中分支名字前没有 * 号的分支通常可以使用 git branch -d 删除掉；

- git branch --no-merged： 查看所有包含未合并工作的分支 尝试使用 git branch -d 命令删除在这个列表中的分支时会失败。如果真的想要删除分支并丢掉那些工作，可以使用 -D 选项强制删 除它;

- git log --oneline –decorate:查看当前分支所指对象。

- git log --oneline --decorate --graph --all：查看所有分支记录

- git config --global alias.别名  “git命令”：给git命令配置别名

  ```shell
  git config --global alias.st status           git st  === git status
  git config --global alias.lol "log --oneline --decorate --graph --all"
  ```

  

**git checkout**

- git checkout name：切换到name分支

- git checkout -b 分支名：创建分支并将head指向该分支。等价于：git branch name 与  git checkout name 两步做的事。

  ​      **分支切换会改变工作目录中的文件 在切换分支时，一定要注意你工作目录里的文件会被改变。**
  **如果是切换 到一个较旧的分支，你的工作目录会恢复到该分支最后一次提交时的样子。如 果 Git 不能干净利落地完成这个任务，它将禁止切换分支。**

  ​      如果在某个分支中，我新创建了一些文件并操作了那些新建的文件，但是这些文件因为时刚刚新建的所以并没有加入到git进行管理，在这种情况下，如果要切换到主分支master，是可以切换的，但同时git为了安全起见，会把从来没有被git管理过的那些新建的文件一起跟着分支进行切换。

  ​     如果在某个分支中，我对一些已经被纳入了git管理的文件进行了操作修改，这些文件因为之前已经加入到git进行管理，在这种情况下，这些文件属于已修改状态，如果要切换到主分支master，git为了安全起见，是不可以切换的，必须先在当前分支下提交后才能切换。

  ​      **坑：在切换分支时，项目中有从没跟踪过的新文件，或者新文件被暂存了但是从没有提交过，那么切换分支是可以执行的，切换分支时这些没有被跟踪过的新文件将会随着切换分支而一起切换。但是这种操作可能会污染其他分支**

  切换分支时的注意点：

  - 切换分支会改变head指针的指向
  - 切换分支会改变工作区文件目录结构
  - 切换分支会改变暂存区内容

- git log --oneline --decorate --graph --all ：查看项目分叉历史

- git merge 分支名

  - 快进合并：由于当 前 master 分支所指向的提交是你当前提交的直接上游，所以 Git 只是简 单的将指针向前移动。因为这种情况下的合并操作没有需要解决的分歧
  - 典型合并：有机会产生冲突,解决冲突 --> 打开冲突的文件 进行修改 add commit 



在分支上的工作做到一半时 如果有切换分支的需求, 我们应该将现有的工作存储起来
    git stash : 会将当前分支上的工作推到一个栈中
    分支切换    进行其他工作   完成其他工作后   切回原分支
    git stash apply : 将栈顶的工作内容还原 但不让任何内容出栈 
    git stash drop  : 取出栈顶的工作内容后 就应该将其删除(出栈)
    git stash pop   :      git stash apply +  git stash drop 
    git stash list : 查看存储



### 后悔药(面试常问)

**撤销工作目录的修改**   :  git checkout -- **filename**，在某次提交（文件已经被gitGuam管理）之后，又开发了一段时间，但是开发的效果差，并且没有将最新的编辑推入到暂存区，想回到上一次提交时工作区对应的文件内容，而不是ctrl +z回去，那可以使用该命令。 注意，在执行本条命令后，将不能再回到效果差的那个编辑状态了。（底层是用暂存区的文件内容覆盖工作区没有推入暂存区的那次编辑。）

**撤销暂存区的修改**     :  git reset HEAD  **filename**，在某次提交之后，又开发了一段时间，但是开发的效果差，并且将最新的编辑推入到暂存区，这时想让暂存区的内容是上一次提交时的暂存区的内容，可以使用该命令。但是并没有对工作区将最新的编辑进行覆盖。如果想让工作区也回到上次提交时对应的内容，可以再加上git checkout -- filename

在同一个分支上回**滚到之前的历史版本**：git reset --hard **版本号**  ，在某次提交到本地库后，运行该命令，会用对应版本号的工作区，暂存区和版本库内容依次覆盖当前的三个区域的内容。

git reset --hard^：快速回到上一次提交。

> 注意点:
>
> **在一条分支上,进行了一次commit后,三个区域的文件内容都一样了.如果之后再对工作区新增文件或者对之前已经跟踪过的文件进行了修改,但是没有加入暂存区或者加入看暂存区而没有提交,这时再进行版本回滚时,会导致新增的文件或者修改丢失.**



**撤销提交** :  git commit --amend，注释写错了,重新给用户一次机会改注释





git reset --soft commithash ：该指令并不是单纯的移动head指针，git checkout branchName 则是只移动head到指定的分支上且工作区，暂存区的内容都将变化。   git reset --soft commithash 则是移动head和head指向的分支名到指定的提交对象但是工作区和暂存区的内容仍旧是移动head前和head指向的分支对应的提交对象的工作区和暂存区的内容。

该指令的本质是撤销了上一次的git commit -m  ,所以再次执行git commit -m则能达到和git commit --amend同样的效果，即修改提交备注信息。 

```shell
git reset --soft HEAD~        head~表示前一次提交对象的别名
```







git reset [--mixed] commithash：该指令的作用是在git reset --soft commithash的基础上，再撤销暂存区的内容到上一次提交的状态。





git reset --hard commithash：该指令的作用是在git reset [--mixed] commithash的基础上，再撤销工作区的内容到上一次提交的状态。







### 路径reset

所有的路径reset都要省略第一步!
    第一步是移动HEAD指向  我们知道HEAD本质指向一个分支 分支的本质是一个提交对象 
    提交对象 指向一个树对象 树对象又很有可能指向多个git对象 一个git对象代表一个文件!
    HEAD可以代表一系列文件的状态!
git reset [--mixed] commithash filename  

​     用commithash中filename的内容重置暂存区





### checkout深入理解

git   checkout brancname  跟   git reset --hard commithash特别像
    共同点
        都需要重置 HEAD   暂存区   工作目录
    区别
         checkout对工作目录是安全的    reset --hard是强制覆盖
         checkout动HEAD时不会带着分支走而是切换分支
         reset --hard时是带着分支走

checkout + 路径
      git checkout commithash  filename
           重置暂存区
           重置工作目录
      git checkout -- filename
          重置工作目录  

```
git  checkout commithash   &   git reset --hard commithash         
    1.  checkout只动HEAD    --hard动HEAD而且带着分支一起走
    2.  checkout对工作目录是安全的   --hard是强制覆盖工作目录

git checkout  commithash
git checkout --filename  
      相比于git reset --hard  commitHash --filename  
      第一  第二步都没做
      只会动了工作目录
git checkout  commithash  <file>    
      将会跳过第 1 步 
      更新暂存区 
      更新工作目录   
```



### eslint

js代码的检查工具
下载: npm i eslint -D
使用:
    生成配置文件 npx eslint --init
    检查js文件   npx eslint 目录名
    命中的规则:
        字符串必须使用单引号
        语句结尾不能有分号
        文件的最后必须要有换行

###  eslint结合git

husky: 哈士奇, 为Git仓库设置钩子程序
使用
    在仓库初始化完毕之后 再去安装哈士奇
    在package.json文件写配置
        "husky": {
            "hooks": {
              "pre-commit": "npm run lint"   
              //在git commit之前一定要通过npm run lint的检查
              // 只有npm run lint不报错时 commit才能真正的运行
            }
          }           



## git工作流程

不能在项目没有一次提交的情况下创建分支,因为创建了分支后分支没有能指向的提交对象.一个项目必须有一个根提交,然后才能基于该提交创建其他分支.

功能分支（feature branch）与补丁分支（hotfix branch）。

完成开发后，该分支合并到主分支，然后被分支删除。

![image-20210227195713911](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210227195713911.png)

两个重要分支：

- 主分支`master`：用于存放对外发布的版本，任何时候在这个分支拿到的，都是稳定的分布版
- 开发分支`develop`：用于日常开发，存放最新的开发版。

三种短暂分支：

- 功能分支（feature branch）

- 补丁分支（hotfix branch）

- 预发分支（release branch）

  它们往往都是从开发分支或者主分支中分离出来的小分支。一旦完成开发，它们就会被合并进`develop`或`master`，然后被删除。

## Git 重新关联远程仓库地址

### 三个必须懂得概念

```
本地分支

正常的数据推送 和 拉取步骤
    1. 确保本地分支已经跟踪了远程跟踪分支
    2. 拉取数据 : git pull
    3. 上传数据: git push
    
一个本地分支怎么去跟踪一个远程跟踪分支
    1. 当克隆的时候 会自动生成一个master本地分支(已经跟踪了对应的远程跟踪分支)
    2. 在新建其他分支时 可以指定想要跟踪的远程跟踪分支
            git checkout -b 本地分支名 远程跟踪分支名
            git checkout --track  远程跟踪分支名 
    3. 将一个已经存在的本地分支 改成 一个跟踪分支   
            git branch -u 远程跟踪分支名     


远程跟踪分支(remote/分支名)
远程分支
```

### 远程协作的基本流程

```
第一步: 项目经理创建一个空的远程仓库,在github上操作

第二步: 项目经理创建一个待推送的本地仓库
	git remote 别名 仓库地址(https)
    git init ; 将源码复制进来
    修改用户名 修改邮箱
    git add
    git commit 
    
第三步: 为远程仓库配别名  配完用户名 邮箱
第四步: 在本地仓库中初始化代码 提交代码
第五步: 推送
	清理windows凭据
    git push  别名 分支  (输入用户名 密码;推完之后会附带生成远程跟踪分支)
    
第六步: 邀请成员,在github上操作 
	
第七步: 成员克隆远程仓库
	git clone  仓库地址 (在本地生成.git文件 默认为远程仓库配了别名 orgin)
    只有在克隆的时候 本地分支master 和 远程跟踪分支别名/master 是有同步关系的
    
第八步: 成员做出修改
	修改源码文件
    git add 
    git commit 
     
第九步: 成员推送自己的修改
	git push  别名 分支 (输入用户名 密码;推完之后会附带生成远程跟踪分支)
	
第十步: 项目经理拉取成员的修改
	git fetch 别名 (将修改同步到远程跟踪分支上)
    git merge 远程跟踪分支
```

### 做跟踪

```
克隆仓库时 会自动为master做跟踪
本地没有分支
    git checkout --track 远程跟踪分支(remote/分支名)
本地已经创建了分支
    git branch -u 远程跟踪分支(remote/分支名)
```

### 推送

```
git push
```

### 拉取

```
git pull
```

### pull request

```
让第三方人员参与到项目中 fork
```

git push --set-upstream origin master（本地）:master（远程）(仓库首次推送)

git push :仓库首次推送过了之后，可以直接用git push，因为第一次用了 --set-upstream

git push -u origin master:master：指将本地仓库的master分支推到远程仓库的master分支。如果远程仓库有则合并，没有则创建。

git push -u origin a：b   ：指将本地仓库的a分支推到远程仓库的b分支。如果远程仓库有则合并，没有则创建。

git remote add origin 远程仓库地址：将本地仓库和远程仓库建立连接。origin 是指代远程仓库地址的别名，可以另起。

git remote -v ：查看本地的该仓库与远程对应仓库地址之间的对应关系。一个本地库可以对应多个远程仓库，只是每个远程仓库对应的别名不一样，别名代表的远程地址也不一样。

git remote remove 远程仓库别名

git remote --help :查看帮助



```git
修改本地仓库对应的远程仓库地址的三种方式：
一：
git remote set-url origin [url] 
git remote ste-url 远程仓库别名 新url：切换远程仓库地址。

二：
git remote rm origin 
git remote add origin [url]

三：
直接修改.git文件夹下的config文件
```



### 使用频率最高的五个命令

git status
git add
git commit
git push [+ [origin] + [分支名]  ]
git pull  





## git其他知识点补充

### 对项目空文件夹的管理

​		如果一个项目根目录下有空目录，那git会自动忽略对对该文件目录的管理，但是开发者本意并不希望该目录被忽略。对此，可以在该空目录下创建一个 .gitkeep 文件，该文件内部什么都不写。那么该目录和该文件就会被git管理起来。



### 在git中参与到其他开源项目

- 在github的项目中可以提交issues
- fork开源项目的代码仓库到自己的仓库，在clone到本地，然后进行开发后推到自己的远端仓库，然后再考虑将fork下来的仓库请求合并到源仓库，以达到参与其他开源项目的目的，只能通过fork的仓库才有资格申请提交合并请求到源仓库。

### github中仓库的描述

1. 给仓库添加技术栈,可以让他人通过关键字搜索到本仓库
2. 仓库产品的网址
3. 通过在本地创建一个分支-----gh-pages ,来发布仓库的静态页,将分支提交到线上仓库,然后github就会自动根据这个分支(分支中含有js,css与html)给你生成一个静态网站。



### 关于SSH密钥

SSH（Secure Shell安全外壳协议）是一种网络协议，用于计算机之间的加密登录。建立在应用层和传输层基础上的安全协议。为了便于访问github等，要生成ssh公钥，这样就不用每一次访问github都要输入用户名和密码。

SSH之所以能够保证安全，原因在于它采用了公钥加密。
整个过程是这样的：（1）远程主机收到用户的登录请求，把自己的公钥发给用户。（2）用户使用这个公钥，将登录密码加密后，发送回来。（3）远程主机用自己的私钥，解密登录密码，如果密码正确，就同意用户登录。

#### 准备条件

先在github或者gitlab或者gitee上先注册账号，本地安装git。

#### 生成步骤：

1. 本地成功安装了git后，单击鼠标右键，选择Git Bush here，打开git bush 
2. 键入命令：ssh-keygen -t rsa -C "email@email.com"，引号中是你在github上的注册邮箱，之后设定你的ssh密码

![image-20210525124137318](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525124137318.png)

3. 第二步已经成功的生成了ssh key，再输入eval  "ssh-agent -s"，如图：

   ![image-20210525124238587](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525124238587.png)

4. 再输入ssh-add ~/.ssh/id_rsa，再输入你设定的ssh的密码，在输入ssh-add ~/.ssh/id_rsa可能会产生“could not open a connection to your authentication agent”错误，如图：

   ![image-20210525124323933](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525124323933.png)

5. 这时直接输入：ssh-agent bash，再输入ssh-add ~/.ssh/id_rsa就可以，如图：

   ![image-20210525124431244](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525124431244.png)

6. 将key添加到github账户中去：

   1）用vim复制key的内容：vim ~/.ssh/id_rsa.pub，右键复制出现的内容，如图：

   ![image-20210525124526577](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525124526577.png)

   2）添加到github中

   找到setting中的ssh keys，如图：

   ![img](https://img-blog.csdn.net/20160405145304882?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

   ![img](https://img-blog.csdn.net/20160405145424617?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

   ![img](https://img-blog.csdn.net/20160405145606711?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

   将刚才的复制的keys粘贴即可。

7. 测试：

   输入ssh -T git@gitub.com，如图，说明已经完成。



#### 在拉去项目时遇到的问题

在gitlab上已经注册好了账户，并且按上面的步骤也都生成了ssh密钥吗，并且在gitlab上也配置好了。但是在本地执行克隆命令时，报错。如下

```
git clone git@gitlab.example.com:initwehealth/initwehealth.git 

Cloning into 'initwehealth'...
ssh: Could not resolve hostname gitlab.example.com: Name or service not known
fatal: Could not read from remote repository.

Please make sure you have the correct access rights

```

原因：

搭建gitlab之后，使用了自己的域名映射，或者我们使用的公用git地址，使用了域名做前缀，但是没有提供域名解析功能导致。

```
unable to access 'http://gitlab.xxxx/gateway.git/': Could not  resolve host xxxx
```

有两种解决方案：

1.将域名换成ip

   比如 gitlab.example.com 对应的ip为 http://192.168.1.101/ ，那么我们只要在git clone的时候变成ip就好。

2.添加host记录

打开文件C:\Windows\System32\drivers\etc\hosts（注意这是一个只读文件，使用nodepad++使用管理员打开或者将这个文件的只读关闭）

 加入自定义域名解析：

   gitlab中仓库的ip地址   gitlab.example.com

 ![image-20210525125942567](C:\Users\dukkha\AppData\Roaming\Typora\typora-user-images\image-20210525125942567.png)

注意写 github.com 或者 其他网址的时候，直接写一级域名，比如 github.com 而不是 git@github.com

 完成后就可以clone项目了。





### git新增命令

git switch 命令专门用来切换分支、创建并切换分支等。

git switch 切换分支：