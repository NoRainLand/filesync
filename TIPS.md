# 一些简单的记录

Promise可以把回调函数改写为异步函数

sqlite3不存在异步操作，所有的操作都会阻塞线程，好处很明显，不容易出问题，坏处是性能“可能”跟不上。

node存在“相对代码运行路径”以及“相对项目路径”的说法，可以使用path模组中的__dirname获取“相对代码运行路径”

Pkg打包出来的目录和打包前的目录对不上，需要通过(<any>process).pkg判断是否为打包之后的，然后用process.cwd()替换__dirname获取“相对打包后的代码运行路径”

http服务器这边写的太乱，需要整理一下

resolve可以通过resolve:Function传递？

多学学await async 用法吧。
