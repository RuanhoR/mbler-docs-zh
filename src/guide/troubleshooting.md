# 故障排除 & 常见问题

## 常见问题

### `mbler: command not found`

Mbler 未安装或不在 PATH 中。

**解决方法：**

```bash
npm install -g mbler
```

如果使用 `pnpm`，请确保 pnpm 全局 bin 目录在 PATH 中：

```bash
pnpm setup
# 然后重启终端
```

### 构建失败：`Cannot find module '@minecraft/server'`

`@minecraft/server` 模块是外部的，不应在本地安装——它在运行时由 Minecraft Bedrock 引擎提供。Mbler 会在打包时自动将其标记为外部。

**解决方法：** 确保 `mbler.config.js` 的 `build.rollupExternal` 中没有列出 `@minecraft/server` 或 `@minecraft/server-ui`（它们已在内部处理）。

### 未设置 `BUILD_MODULE=release`

仅在环境中设置 `BUILD_MODULE=release` 时才会生成 `.mcaddon` 压缩包。`mbler build` 命令默认不会创建压缩包——请使用 `mbler publish`，它会自动设置此标志。

**手动生成发布包：**

```bash
BUILD_MODULE=release mbler build
```

### 确定性 UUID 已更改

Mbler 根据项目名称、类型和盐值确定性地生成 UUID。如果重命名项目或更改 `package.json` 中的 `name`，UUID 将更改，这会破坏现有世界。

**解决方法：** 发布插件后保持 `name` 字段稳定。

### 监视模式未检测到文件更改

在某些系统上（例如 WSL、Docker、网络文件系统），chokidar 可能无法可靠地检测到更改。

**解决方法：**

1. 确保没有使用网络驱动器
2. 尝试手动运行 `mbler build`
3. 在 WSL 上，将项目存储在 Linux 文件系统中（而不是 `/mnt/c/`）

### VS Code 中语言服务器未启动

**解决方法：**

1. 打开命令面板（`Ctrl+Shift+P`）
2. 运行 `MCX: Restart Language Server`
3. 如果仍然失败，检查是否安装了 `@mbler/mcx-server`：
   ```bash
   npm install @mbler/mcx-server --save-dev
   ```

### `mcx-tsc` 无输出直接退出

MCX TypeScript 编译器（`mcx-tsc`）底层使用 Volar。如果没有任何输出，可能是 TypeScript 配置问题。

**解决方法：** 检查项目根目录下是否存在 `tsconfig.json`，并且是否包含了你的 `.mcx` 文件。

---

## 常见问题

### 我可以使用纯 JavaScript 而不是 TypeScript 吗？

可以。在 `mbler.config.js` 中设置 `script.lang: "js"` 即可。

### 我可以同时使用 JS 和 MCX 文件吗？

可以。`.mcx` 文件由 `@mbler/mcx-core` 的 Rolldown 插件编译为 JavaScript。你可以自由混合使用 `.ts`、`.js` 和 `.mcx` 文件。

### 如何在不发布的情况下测试插件？

将 `mbler.config.js` 中的 `outdir` 直接指向 Minecraft Bedrock 的行为包/资源包文件夹：

```js
outdir: {
  behavior: "/path/to/com.mojang/development_behavior_packs/my-addon",
  resources: "/path/to/com.mojang/development_resource_packs/my-addon",
}
```

然后运行 `mbler build`——输出将直接进入游戏目录。

### 日志文件在哪里？

```bash
mbler log point
# 输出：/home/user/.cache/mbler/latest.log
```

### 如何更改 CLI 语言？

```bash
mbler lang       # 显示当前语言
mbler lang zh    # 切换到中文
mbler lang en    # 切换到英文
```

### 支持哪些 Minecraft 版本？

Mbler 支持任何使用 Script API 的 Minecraft Bedrock 版本（v1.19.50+）。在 `mbler.config.js` 中设置 `mcVersion` 为目标版本。

### 如何更新 mbler？

```bash
npm update -g mbler
```

查看当前版本：

```bash
mbler version
```

### 可以在 CI/CD 流水线中使用 mbler 吗？

可以。`login`、`publish` 和 `unpublish` 命令设计用于自动化。将 MNX 令牌安全地存储为 CI 密钥，然后使用：

```bash
mbler login $MNX_TOKEN
mbler publish -tag latest
```

---

## Mbler 如何解析 SAPI 版本

当你在 `mbler.config.js` 中设置 `mcVersion: "1.21.100"` 时，Mbler 需要找到与目标 Minecraft 版本对应的 `@minecraft/server` 和 `@minecraft/server-ui` npm 包版本。此解析过程在 `src/build/sapi.ts` 中实现。

### 问题背景

Minecraft Bedrock 的 Script API（`@minecraft/server`）会向 npm 发布许多版本，每个版本都在版本字符串中嵌入了目标 Minecraft 版本。例如：

```
2.1.0-beta.1.21.100-stable   → Minecraft 1.21.100
2.0.0-beta.1.21.60-stable    → Minecraft 1.21.60
2.5.0-beta.1.21.120-preview  → Minecraft 1.21.120（预览版）
```

版本字符串格式为：`<sapi-version>-<channel>.<embedded-mc-version>-<stability>`。

### 解析算法

1. **获取 npm 注册表**：Mbler 从 `https://registry.npmjs.com` 获取 `@minecraft/server` 和 `@minecraft/server-ui` 的所有版本。

2. **提取 MC 版本**：对每个 npm 版本，使用正则表达式提取嵌入的 Minecraft 版本：
   ```
   /-(?:rc|beta)(?:\.[^-.]+)*?\.((?:\d+\.){2}\d+)/
   ```
   这个正则匹配类似 `beta.1.21.100` 的模式，并捕获 `1.21.100`。

3. **分类发布版本**：每个条目被分类为：
   - **正式版（稳定）** — 版本字符串包含 `-stable`
   - **测试版（预览）** — 其他所有版本（候选发布版、预览版等）

4. **构建版本映射表**：结果是一个查找表，将每个 Minecraft 版本映射到其最新的正式版和测试版 SAPI 版本：

   ```json
   {
     "server": {
       "1.21.60": { "formal": "2.0.0-beta.1.21.60-stable", "beta": "" },
       "1.21.100": { "formal": "2.1.0-beta.1.21.100-stable", "beta": "" },
       "1.21.120": { "formal": "", "beta": "2.5.0-beta.1.21.120-preview" }
     }
   }
   ```

5. **缓存**：映射表保存到 `~/.mbler/_sapi_version.json`，供离线重复使用。调用 `refresh()` 可更新缓存。

6. **查找**（`generateVersion`）：
   - 首先尝试**精确匹配** `mcVersion`
   - 如果没有精确匹配，查找**最接近的更低版本**（例如，如果你请求 `1.21.110` 但只有 `1.21.100` 存在，则回退到 `1.21.100`）
   - 如果没有更低的版本，则使用**最早可用**的版本
   - 默认返回正式（稳定）版本，如果设置了 `isBeta` 则返回测试版
   - 如果请求的渠道为空，则回退到另一个渠道

7. **版本缩短**（`evalVersion`）：返回的版本会被缩短以用于 `manifest.json` 依赖。例如：
   ```
   "2.1.0-beta.1.21.100-stable" → "2.1.0-beta"
   ```
   只保留预发布标签的前两个段。

### 调试 SAPI 解析

要查看 Mbler 为你的项目解析了哪个版本，运行：

```bash
BUILD_MODULE=release mbler build
```

解析后的版本会出现在生成的 `manifest.json` 的 `dependencies` 中。你也可以直接查看缓存文件：

```bash
cat ~/.mbler/_sapi_version.json
```
