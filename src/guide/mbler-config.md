# mbler.config.js

`mbler.config.js` 是 Mbler 项目的配置文件，使用 ES Module 格式，放在项目根目录。

## 基本结构

```js
import { defineConfig } from "mbler";

export default defineConfig({
  description: "我的 Addon",
  mcVersion: "1.21.100",
  script: {
    lang: "ts",
    main: "index.ts",
  },
  minify: "oxc",
});
```

## 配置项

### `name` 和 `version`

::: tip
`name` 和 `version` 从项目根目录的 `package.json` 中读取，无需在 `mbler.config.js` 中配置。
:::

- `name` — Addon 包名，必须符合 `@scope/name` 格式（如 `@ruanhor/my-addon`）。用于 UUID 生成和 MNX 发布。
- `displayName` — 可选。在生成的 `manifest.json` 中显示的人类可读名称。如果未设置，则回退使用 `name`。
- `version` — Addon 版本号（如 `0.0.1-beta`）

```js
export default defineConfig({
  name: "@ruanhor/my-addon",
  displayName: "我的超赞 Addon",
  version: "0.0.1",
  // ...
});
```

### `description`

**必填。** Addon 的简短描述，会写入生成的 `manifest.json`。

- 类型：`string`
- 示例：`"我的第一个 Minecraft Addon"`

### `mcVersion`

**必填。** 目标 Minecraft 版本。用于生成 manifest 中的 `min_engine_version` 字段以及解析 `@minecraft/server` 依赖版本。

- 类型：`string`
- 示例：`"1.21.100"`

### `script`

脚本相关配置。

- 类型：`object`
- 属性：
  - `main` — 入口脚本文件（相对于 `behavior/scripts/`）
  - `lang` — 脚本语言：`"js"`、`"ts"` 或 `"mcx"`
  - `ui` — 是否使用 `@minecraft/server-ui`（默认 `false`）
  - `UseBeta` — 是否使用 Beta API（默认 `false`）

```js
script: {
  lang: "ts",
  main: "index.ts",
  ui: true,
}
```

### `outdir`

自定义输出目录。未设置时的默认值：
- `behavior` → `dist/dep`
- `resources` → `dist/res`
- `dist`（发布压缩包）→ `dist-pkg`

```js
outdir: {
  behavior: "./dist/behavior_pack",
  resources: "./dist/resource_pack",
  dist: "./dist/release",
}
```

### `outGameOnDev`

开发时直接将构建结果输出到 Minecraft 游戏目录的 `development_behavior_packs` 和 `development_resource_packs`，省去手动复制步骤。

- 类型：`boolean`
- 默认值：`false`
- 启用后会询问游戏目录路径（与 `mbler install` 复用同一套询问逻辑，路径会缓存到全局配置），构建产物直接写入游戏开发包目录
- 当环境变量 `BUILD_MODULE=release` 时此选项不生效，仍走原有的 `outdir` 配置（以支持发布打包）

```js
outGameOnDev: true,
```

### `minify`

打包后脚本的压缩引擎。

- 类型：`'oxc' | 'terser' | 'esbuild' | 'none'`
- 默认值：省略该字段时为 `'oxc'`
- `'none'` 表示完全不做脚本压缩，构建产物保持可读。设置为特定引擎名称（`'oxc'`、`'terser'`、`'esbuild'`）可选择特定的压缩工具。

### `manifest`

manifest.json 的完整自定义配置节，同时作用于行为包和资源包的 manifest 生成。`format_version` 固定为 `2`，不可配置。

::: tip
如果你在包源目录（`behavior/` 或 `resources/`）中自己提供了 `manifest.json`，它仍会浅合并覆盖 mbler 生成的 manifest（参见[项目结构](./project)）。
:::

- `pack_scope` — 资源包作用域：`'any'`（默认）、`'world'` 或 `'global'`
- `platform_locked` — 设为 `true` 时禁止该包在其他玩家的世界或服务器上使用
- `base_game_version` — 世界模板基于的游戏版本
- `allow_random_seed` — 世界模板是否使用随机种子
- `lock_template_options` — 世界模板是否默认禁止玩家修改世界选项
- `capabilities` — 额外功能数组，可选值：`'chemistry'`、`'editorExtension'`、`'experimental_custom_ui'`、`'pbr'`、`'raytraced'`、`'script_eval'`。有脚本的包会自动加入 `'script_eval'`，用户设置会与之合并去重。
- `dependencies` — 额外依赖数组，追加在自动生成的 SAPI 依赖（`@minecraft/server`，开启 `script.ui` 时还有 `@minecraft/server-ui`，以及 `build.otherDeps`）之后。支持两种形式：
  - 包依赖 — `{ uuid, version, name? }`，按 UUID 依赖其他包，`version` 为 `string | number[]`
  - 脚本模块依赖 — `{ module_name?, uuid?, version }`，Minecraft 1.21.120 起 `version` 可为 `'beta'`
- `subpacks` — 子包数组：`{ name, folder_name, memory_tier, memory_performance_tier? }`
- `settings` — 游戏内附加包设置控件数组：
  - `{ type: 'label', text? }`
  - `{ type: 'input', text?, name, default? }`
  - `{ type: 'toggle', text?, name, default? }`
  - `{ type: 'slider', text?, name, min?, max?, step?, default? }`
  - `{ type: 'dropdown', text?, name, options?, default? }` — `options` 项为字符串或 `{ text, name }`
- `metadata` — 包元数据：`{ authors?, license?, url?, product_type? }`。`product_type: 'addon'` 表示该包属于附加包（行为包不会禁用成就）。`metadata.generated_with` 由 mbler 自动注入 `{ mbler: [版本号] }`，不可覆盖。

::: tip TypeScript 枚举
TypeScript 配置中可从 `mbler` 导入 `MblerPackScope`、`MblerManifestCapability`、`MblerManifestSettingType`（`'label' | 'input' | 'toggle' | 'slider' | 'dropdown'`）和 `MblerManifestProductType`。纯 JavaScript 配置直接写字符串值即可。
:::

```js
manifest: {
  pack_scope: "any",
  platform_locked: false,
  capabilities: ["pbr"],
  dependencies: [
    { module_name: "@minecraft/server-admin", version: "1.0.0-beta" },
  ],
  subpacks: [
    { name: "高清材质", folder_name: "hd", memory_tier: 4 },
  ],
  settings: [
    { type: "label", text: "基础设置" },
    { type: "input", text: "玩家名", name: "playerName", default: "Steve" },
    { type: "toggle", text: "开启特效", name: "fx", default: true },
    { type: "slider", text: "音量", name: "volume", min: 0, max: 100, step: 1, default: 50 },
    { type: "dropdown", text: "难度", name: "difficulty", options: ["简单", "困难"], default: "简单" },
  ],
  metadata: {
    authors: ["Ruanhor"],
    license: "MIT",
    url: "https://github.com/RuanhoR/mbler",
    product_type: "addon",
  },
}
```

### `build`

高级构建配置。脚本产物固定写入行为包的 `scripts/` 目录，输出文件名由 `script.main` 推导（扩展名统一为 `.js`）；`script.lang: "mcx"` 项目固定为 `scripts/index.js`。

```js
build: {
  rollupPlugins: [],
  rollupExternal: ["some-lib"],
  cache: "auto",
  cachePath: "mbler/rolldown.bin",
  bundle: true,
  onStart: (ctx) => { console.log("构建开始"); },
  onEnd: (ctx) => { console.log("构建结束"); },
  onWarn: (ctx, warning) => { console.warn(warning); },
}
```

#### `build.rollupPlugins`

额外的 Rolldown 插件。

- 类型：`Plugin[]`

#### `build.rollupExternal`

标记为外部（不打包）的额外模块名。当你希望某些依赖保留在打包之外时使用。

- 类型：`string[]`
- 示例：`["@some-org/some-lib"]`

#### `build.cache`

Rolldown 构建缓存模式。

- 类型：`"none" | "memory" | "file" | "filesystem" | "auto"`
- 默认值：`"auto"`（解析为 `"file"` 缓存）

#### `build.cachePath`

缓存文件的自定义路径。

- 类型：`string`
- 默认值：`mbler/rolldown.bin`（相对于项目根目录）

#### `build.bundle`

是否通过 Rolldown 打包脚本。

- 类型：`boolean`
- 默认值：`true`
- 当为 `false` 时，脚本将原样复制而不打包

#### `build.clean`

是否在每次构建前清理输出目录。

- 类型：`boolean`
- 默认值：`true`

#### `build.onStart`

构建开始前的回调。

- 类型：`(ctx: MblerConfigData) => void | Promise<void>`

#### `build.onEnd`

构建完成后的回调。

- 类型：`(ctx: MblerConfigData) => void | Promise<void>`

#### `build.onWarn`

构建警告时的回调。

- 类型：`(ctx: MblerConfigData, warning: Error) => void | Promise<void>`
