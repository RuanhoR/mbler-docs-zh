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
  minify: false,
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

### `minify`

打包后脚本的压缩引擎。

- 类型：`boolean | 'oxc' | 'terser' | 'esbuild'`
- 默认值：`false`
- 设置为 `true` 时使用默认压缩器。设置为特定引擎名称（`'oxc'`、`'terser'`、`'esbuild'`）可选择特定的压缩工具。

### `build`

高级构建配置。

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

#### `build.outputDir`

编译后脚本在行为包输出中的子目录。

- 类型：`string`
- 默认值：`"scripts"`

#### `build.outputFilename`

覆盖打包脚本的输出文件名。

- 类型：`string`
- 默认值：从入口脚本名称派生

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
