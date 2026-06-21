# 开始使用 Mbler

## 系统要求

Mbler 需要 [Node.js](https://nodejs.org)（v18 或更高版本）。如果你在 Android 上使用，可以通过 [Termux](https://termux.com) 运行 Node.js。

## 安装

通过 npm 或 pnpm 全局安装 Mbler：

```bash
npm install -g mbler
# 或者
pnpm install -g mbler
```

验证安装是否成功：

```
mbler version
```

## 创建项目

```bash
pnpm create mbler
```

按照交互式提示配置你的项目。这将生成：

- `behavior/` — 行为包文件（脚本、动画等）
- `resources/` — 资源包文件（纹理、模型、音效等）
- `mbler.config.js` — 项目配置文件
- `package.json` — Node.js 项目元数据

## 构建

```bash
mbler build
```

这将打包你的脚本，使用确定性 UUID 生成 `manifest.json`，并输出附加包。将 `mbler.config.js` 中的 `outdir` 设置为 Minecraft 行为包/资源包文件夹的路径，即可实时测试。

## 监视模式

```bash
mbler watch
```

当源文件发生变化时自动重新构建——非常适合开发。

## 接下来干什么？

- [学习 MCX DSL](./mcx) — 创建物品、实体、UI 和事件
- [项目结构](./project) — 了解目录布局
- [CLI 参考](./cli) — 所有可用命令
- [mbler.config.js 参考](./mbler-config) — 配置选项
- [VS Code 扩展](./vscode) — 安装语言服务器以获得语法高亮和自动补全
