# Mbler 命令行用法

## 模块导入说明

Mbler 从 `0.2.4-rc.6` 版本开始支持模块化导入：

```javascript
// 主入口 - 包含 CLI 和核心类型
import * as mbler from "mbler";

// 构建模块 - 包含 Build、build、watch 等构建相关 API
import * as Build from "mbler/build";
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

- 提示：此命令仍在 beta

用法：

`mbler install @scope/name@version`

如果没有指定版本，使用 `latest`

从 `pmnx.qzz.io` 下载插件

## `publish` 命令

- 提示：此命令仍在 beta

用法：

`mbler publish -tag :tag_name`

发布你的插件

参数

- `tag`：设置标签名称
- `build`：`skip` 或 `on`，设置是否执行构建执行构建命令
  将会把 behavior, resources 打包成 zip 并上传到 `pmnx.qzz.io`

## `unpublish` 命令

- 提示：此命令仍在 beta

用法：
`mbler unpublish @scope/name@version`

## `login 命令

提示：此命令仍在 beta
运行输入pmnx token以登录pmnx账号，使用publish

## `config` 命令

用法：
`mbler config get <key>`  
`mbler config set <key> <value>`  
`mbler config point `  
`mbler config point <new confog file point>`

常见Key: token(存储pmnx token)
