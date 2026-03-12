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