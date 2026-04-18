# Mbler 命令行用法
## `c` 命令
介绍：切换/查看工作目录  
用法：mbler c [?:dir]  
 - 没有第二个参数：查询工作目录
 - 有第二个参数：设置工作目录  

示例：
```bash
mbler c .
# 应输出设置成功
```
## `init` 命令
初始化项目，用法
```bash
mbler init
```
## `lang` 命令
切换/查询工具语言，用法
```bash
mbler lang
# 应输出 zh 或 en
mbler lang en
# 应输出 en
```
## `version` 命令
查询工具版本，用法
```bash
mbler version
# 输出： commit: xxxx version: xxx
mbler version -show commit
# 输出： commit: xxx
```
## `build` 命令
将项目构建为 mc 插件。如果环境变量中的 `BUILD_MODULE` 为 `build`，它还会生成一个可以导入游戏的包。

## `watch` 命令
监视更改并实时构建。无参数，依赖工作目录上下文。

## `set-work-dir` 命令
设置工作目录管理模式。
示例
- 使用当前工作目录
```bash
mbler set-work-dir off
```
- 使用工作目录管理器
```bash
mbler set-work-dir on
# 设置工作目录
mbler work ./project
```

## `work` 命令

设置工作目录，更多请参见 `set-work-dir`

## `install` 命令
- 提示：此命令正在计划中

用法：

`mbler install @scope/name@version`

如果没有指定版本，使用 `latest`

从 `pmnx.qzz.io` 下载插件

## `publish` 命令
- 提示：此命令正在计划中

用法：

`mbler publish -tag :tag_name`

发布你的插件

参数
 - `tag`：设置标签名称
 - `build`：`skip` 或 `on`，设置是否可以执行构建命令

## `unpublish` 命令
- 提示：此命令正在计划中

用法：
`mbler unpublish @scope/name@version`

## `set-token` 命令
- 提示：此命令正在计划中

用法：
`mbler set-token <token>`
设置你的 `pmnx.qzz.io` 令牌