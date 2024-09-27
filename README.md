# 文件/文件同步工具

## *by NoRain*

## 2023/12/24

### 基于node开发的一个多端文件/文字同步工具

![screenshot](screenshot.png)

|版本|说明|
|---|---|
|1.0.0|初版|
|1.1.0|修复重复上传文字bug，添加文件大小提示|
|1.2.0|添加夜间模式|
|1.3.0|添加当前页面二维码|
|1.4.0|打包成exe|
|1.5.0|添加端口动态切换，防止端口被占用|
|1.6.0|修复打包之后无法下载文件的BUG|
|1.7.0|打开启动服务器之后默认浏览器，并且开放服务器配置，把启动改为串行操作|
|1.8.0|尝试添加断线重连机制，添加vconsole.min.js，可以在config配置打开|
|2.0.0|尝试修复手机浏览器切后台消息没同步BUG，添加欢迎语，统一数据格式|
|2.1.0|优化代码，大修|
|2.2.0|添加上传进度条，可配置显示的最小文件体积|
|2.3.0|接入clipboard.min.js|
|2.4.0|修复```npm run watch```BUG|
|3.0.0|完善打包流程，兼容浏览器不支持download属性|
|4.0.0|把npm包管理改为pnpm，请使用16.14版本及以上的node，添加webpack打包|
|5.0.0|大修，前端代码分离更细|
|5.1.0|细调，添加右键文件“发送到服务器功能”,基于[另一个.net项目:QuickSendTool](https://github.com/NoRainLand/QuickSendTool)|
|5.1.1|更新[QuickSendTool](https://github.com/NoRainLand/QuickSendTool)版本|
|5.2.0|微调|
|5.3.0|修正QuickSendTool工具发送过来的文件带中文名编码错误问题|
|5.3.1|修正一部分虚拟网卡导致的网址错误问题，添加一个控制台joke接口，可通过控制台joke()调用|

### 使用方式

**本人基于node版本16.16.0+pnpm开发，版本太低可能会导致编译/运行报错。**

#### 初始化

- 执行```pnpm install```初始化
- 执行```pnpm run copy```复制网页和图标到对应位置

#### 构建

- 执行```pnpm run build```构建

#### 开发

- 执行```pnpm run watch```开启代码监听并且自动刷新服务器(网页修改需要手动刷新)

#### 运行

- 执行```pnpm run debug```开启带```--trace-warnings```参数的服务器
- 如果没有自动打开默认浏览器，可以手动打开命令的输出的网址。

#### 打包

- 以下内容可以参看这里[这个链接](https://blog.csdn.net/weixin_68397463/article/details/132533284)
- 直接执行```pnpm run exec```，这时候会提示你正在下载某个文件……，这个下载速度极慢，所以你可以直接到[github地址](https://github.com/vercel/pkg-fetch/releases)下载你对应的版本，也就是刚才你控制台打印的版本。
- 放到任意目录，然后复制出来两份，分别名为 fetched-你的版本-你的平台-x64  built-你的版本-你的平台-x64
- 修改目录下的plugins/rcedit.js中的options配置
- 执行```pnpm run rcedit```进行修补
- 把这两个文件放到你的.pgk-cache目录下，这个目录通常在 C:\Users\你的名字\.pkg-cache\你的版本 下
- 执行```pnpm run exec``` 完成打包

#### 一些说明

- 第一次运行提示乱七八糟的,能运行就别管.
- 数据库安装失败,多执行```npm install```几次试试，实在不行就下载[我打包好的文件](https://github.com/NoRainLand/filesync/releases/tag/untagged-effc87f7dee701d8da7f)，但是你解压之后还是要执行一次```npm install```（并且记得不要把package-lock.json，package.json两个文件给覆盖了），因为我后面有添加了新的库（主要是sqlite3库下载可能会出问题）
- 如果打包报错类似如下所示的话，可以参考[这里](https://segmentfault.com/a/1190000041958374),项目目录下提供了我下载好的文件。

```txt
[0] > pkg@5.8.1
[0] > Fetching base Node.js binaries to PKG_CACHE_PATH
[0] > Not found in remote cache:
[0]   {"tag":"v3.4","name":"node-v14.20.0-win-x64"}
[0] > Building base binary from source:
[0]   built-v14.20.0-win-x64
[0] > Fetching Node.js source archive from nodejs.org...
[0] > Error! AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
```

pkgx打包体积理论上会很小，但是据说会有一些问题，我没试过，可以参考[这里](https://bjun.tech/blog/xphp/225)

工具的图标是通过[这个网址](https://cn.pic2ico.com/)转格式，推荐！

打包出来之后执行程序的图标可能会因为win系统缓存导致一直显示旧的，这时候重启电脑可能有效果，或者重命名打包出来的文件。

### 部分使用的开源库

[picocss](https://picocss.com/):用于语义化HTML的极简CSS框架. #强烈推荐，本应用的样式基本都是靠这个。

~~[vConsole](https://github.com/Tencent/vConsole):一个轻量、可拓展、针对手机网页的前端开发者调试面板。已经移除，因为使用npm加载之后pkg打包有问题~~

vConsole的某一个库（具体忘了）在pkg打包会报错，弃用之。

[qrcodejs](https://github.com/davidshimjs/qrcodejs):QRCode.js是一个制作二维码的JS库. #还有别的选择么

[clipboard](https://github.com/zenorocha/clipboard.js):现代粘贴板复制，无需Flash，gzip压缩后只有3kb的JS库

[heroicons](https://heroicons.dev/):来自[@steveschoger](https://twitter.com/steveschoger)的基于MIT协议的开源图标库

以及请让我谦逊地向你介绍我写的工具：

[QuickSendTool](https://github.com/NoRainLand/QuickSendTool)win平台下把右键选中的某个文件发送到特定http接口的小工具

### 如果你喜欢这个项目，可以请我喝杯奶茶

![joke](joke.png)
