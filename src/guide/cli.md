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

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler install @scope/name@version
```

如果没有指定版本，则使用最新版本。

从 `pmnx.qzz.io` 下载附加包并复制到 Minecraft 游戏目录（行为包/资源包）。

## `uninstall` 命令

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler uninstall @scope/name@version
```

从 Minecraft 游戏目录中移除已安装的附加包。

## `login` 命令

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler login [token]
```

向 MNX 市场进行身份验证。如果未提供 token，将以交互方式提示输入。

## `profile` 命令

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler profile
```

显示当前登录的用户信息。

## `publish` 命令

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler publish -tag :tag_name
```

将你的附加包发布到 MNX 市场。

选项：

- `-tag` — 版本标签（例如 `latest`、`beta`）
- `-build` — `skip` 或 `enable`（默认：`enable`），是否在发布前执行构建

## `unpublish` 命令

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler unpublish @scope/name@version
```

从 MNX 市场中移除已发布的版本。

## `view` 命令

> 测试阶段 — 可能发生变化。

用法：

```bash
mbler view @scope/name
```

列出 MNX 市场上某个包的所有已发布版本。

## `config` 命令

管理全局 CLI 配置，存储在 `~/.config/.mbler.config.global.cli.json`。

用法：

```bash
mbler config get <key>
mbler config set <key> <value>
mbler config point
mbler config point <new config file path>
```

常见 key：
- `token` — 存储 MNX 认证令牌

## `log` 命令

管理 CLI 日志文件（`~/.cache/mbler/latest.log`）。

用法：

```bash
mbler log point    # 显示日志文件路径
mbler log clean    # 清空日志文件
```
