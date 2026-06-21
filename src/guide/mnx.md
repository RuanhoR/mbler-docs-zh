# MNX 市场

MNX 是一个构建在 MCX 生态之上的 Minecraft Bedrock 附加包市场。它允许开发者通过中心化的注册表发布、分发和管理他们的附加包。

## 概述

- **公共注册表** — 浏览和下载社区附加包，访问 [pmnx.qzz.io](https://pmnx.qzz.io)
- **版本管理** — 语义化版本控制，支持发布渠道（如 `latest`、`beta`）
- **基于作用域的发布** — 在用户/团队命名空间下组织（`@scope/name`）
- **令牌认证** — 通过 CI/CD 实现自动化的安全 API 访问

## 发布工作流

1. **构建**你的附加包：`mbler build`
2. **登录**你的 MNX 账户：`mbler login <token>`
3. **发布**：`mbler publish -tag latest`
4. **管理**版本：通过 MNX 网页界面或 CLI

## 安装包

用户可以直接安装已发布的附加包：

```bash
mbler install @scope/name@version
```

如果未指定版本，则使用最新版本。附加包将下载并解压到 Minecraft 游戏目录。

卸载已安装的附加包：

```bash
mbler uninstall @scope/name@version
```

## CLI 命令

| 命令 | 说明 |
|---------|------|
| `mbler login <token>` | 向 MNX 进行身份验证 |
| `mbler publish` | 发布你的附加包 |
| `mbler unpublish @scope/name@version` | 移除已发布的版本 |
| `mbler view @scope/name` | 列出可用版本 |
| `mbler install @scope/name@version` | 安装到游戏目录 |
| `mbler uninstall @scope/name@version` | 从游戏目录移除 |
| `mbler profile` | 显示已登录用户信息 |
| `mbler config get token` | 查看当前认证令牌 |

## 链接

- [MNX 网站](https://pmnx.qzz.io)
- [CLI 参考](/guide/cli)
