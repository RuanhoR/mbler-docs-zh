# 推荐工具链：ESLint、Vitest 与 MFD 下载页

`create-mbler` 生成的项目开箱即带构建、监听和类型检查。本页介绍三个推荐搭配使用的工具——**ESLint**（代码检查）、**Vitest**（单元测试）、**MFD**（静态下载页）——每个都给出从零开始的完整配置，所有内容来自一个真实在维护的项目 [LuckBlock](https://github.com/RuanhoR/LuckBlock)，可直接照抄复现。

你不需要是工具链开发者，只要会用命令行即可。三个工具相互独立，按需取用。

## 约定

以下所有命令均在项目根目录（`mbler.config.js` 所在目录）执行，包管理器以 pnpm 为例（npm 用户把 `pnpm add -D` 换成 `npm i -D` 即可）。

## ESLint：检查 TS 与 .mcx 代码

ESLint 负责两类检查：TypeScript 源码的通用规则，以及 `.mcx` 文件的结构校验（事件绑定、标签重复等）。

### 安装

```bash
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser @mbler/eslint-plugin-mcx
```

### 配置

在项目根目录新建 `eslint.config.mjs`（flat config 格式）：

```js
// @ts-check
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import mcx from "@mbler/eslint-plugin-mcx";

export default [
  {
    // 构建产物与依赖不参与检查
    ignores: ["dist/**", "node_modules/**", "dist.mcaddon"],
  },
  {
    // TypeScript 源码与测试文件的通用规则
    files: ["behavior/scripts/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "prefer-const": "error",
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-empty": "off",
    },
  },
  // lint .mcx 文件（模板 + 内嵌 <script>），mcx.configs.recommended 已含推荐规则集
  mcx.configs.recommended,
];
```

### 接入脚本

在 `package.json` 的 `scripts` 中加入：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

```bash
pnpm lint        # 检查
pnpm lint:fix    # 自动修复可修复的问题
```

`mcx.configs.recommended` 里的具体规则（如事件名必须是 `@minecraft/server` 中存在的事件）见 [ESLint 与 Vitest 插件](./plugins) 一页的规则表。规则会读取你项目里安装的 `@minecraft/server` 类型定义，无需额外维护事件名单。

## Vitest：不开游戏就能跑单元测试

addon 脚本依赖 `@minecraft/server`，这个包**只在游戏内可用**，Node 里装了也加载不了。解决办法是在测试配置里把它别名到一个本地 mock——测试只用到导入期的表面 API，mock 不需要还原游戏行为。

### 安装

```bash
pnpm add -D vitest
```

### Mock 与配置

新建 `tests/mocks/minecraft-server.ts`，写一个最小桩（按你项目实际用到的导出增删即可）：

```ts
// tests/mocks/minecraft-server.ts
// 最小 @minecraft/server(+ui) 桩：测试只需要 import 不报错，
// 不需要真实游戏行为。
export const world = {
  getDimension: () => {
    throw new Error("not available outside Minecraft");
  },
  sendMessage: () => {},
};
export const system = { run: (fn: () => void) => fn() };
export const BlockComponentTypes = {};

export class ItemStack {
  constructor(
    public _id?: string,
    public _amount?: number,
  ) {}
}
export class Block {}
export class Player {}
export const EquipmentSlot = { Mainhand: "Mainhand", Offhand: "Offhand" };
export const EntityComponentTypes = {};
export const EnchantmentType = {};
```

在项目根目录新建 `vitest.config.ts`：

```ts
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { defineConfig } from "vitest/config";
import { vitePlugin } from "@mbler/mcx-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverMock = path.join(__dirname, "tests", "mocks", "minecraft-server.ts");

export default defineConfig({
  resolve: {
    alias: {
      // beta 运行时包无法在 Node 中加载；单测只需要 import 期的表面存在
      "@minecraft/server": serverMock,
      "@minecraft/server-ui": serverMock,
    },
  },
  plugins: [
    vitePlugin(
      {
        // 编译后 .mcx 中的裸 id（如 @mbler/mcx）从这里解析
        moduleDir: path.join(__dirname, "node_modules"),
        tsconfigPath: path.join(__dirname, "tsconfig.json"),
        sourcemap: false,
        ts,
      },
      // 一次性输出目录，测试不会读取
      {
        dist: path.join(__dirname, ".mcx-out"),
        behavior: path.join(__dirname, ".mcx-out"),
        resources: path.join(__dirname, ".mcx-out"),
      },
    ),
  ],
  test: {
    include: ["tests/**/*.spec.ts"],
    environment: "node",
  },
});
```

`vitePlugin` 来自 `@mbler/mcx-core`（`create-mbler` 生成的 mcx 项目已作为依赖安装），作用是让测试代码可以直接 `import` `.mcx` 文件编译后的模块。

### 编写与运行测试

测试放在 `tests/` 下，命名 `*.spec.ts`。一个最小的示例：

```ts
// tests/core.spec.ts
import { describe, expect, it } from "vitest";
import { randomNum } from "../behavior/scripts/core/utils";

describe("randomNum", () => {
  it("stays within [min, max]", () => {
    for (let i = 0; i < 200; i++) {
      const n = randomNum(3, 7);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(7);
    }
    expect(randomNum(5, 5)).toBe(5);
  });
});
```

接入脚本并运行：

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

```bash
pnpm test
```

::: tip 什么值得测
纯逻辑函数（随机、解析、数值计算、数据变换）最适合单测；依赖游戏运行时的部分（世界事件、实体操作）在 mock 环境下只能测导入期行为。LuckBlock 的实践是：工具函数与解析器全部覆盖，游戏交互交给进游戏手测。
:::

## MFD：给 addon 生成一个下载页

写好的 addon 总要发给别人。MFD（`@mbler/mfd`）为你的 addon 生成一个**静态下载页**——markdown 介绍、MC 版本选择器、`.mcaddon` 下载链接，产出一个纯静态目录，可以部署到任意静态托管（GitHub Pages、Cloudflare Pages 等），不依赖任何注册表。

### 安装与配置

```bash
pnpm add -D @mbler/mfd
```

在项目根目录新建 `mfd.config.js`：

```js
// @ts-check
import { defineConfig } from "@mbler/mfd";

export default defineConfig({
  title: { zh: "幸运方块", en: "Lucky Block" },
  mcVersion: { min: "1.26.30", max: "1.26.45" },
  description: {
    zh: `# 幸运方块

一个简单的 Minecraft 基岩版**幸运方块**玩法模组。

## 安装

选择与你的 Minecraft 版本匹配的 \`dist.mcaddon\` 下载后导入游戏即可。
`,
    en: `# Lucky Block

A simple Minecraft Bedrock **Lucky Block** gameplay addon.

## Install

Download the \`dist.mcaddon\` matching your Minecraft version and import it into the game.
`,
  },
});
```

- `title` / `description` 支持中英双语，页面语言跟随访问者系统语言；
- `mcVersion` 的 min/max 决定页面上版本选择器的范围；
- `description` 是完整 markdown，页面会原样渲染。

### 生成页面

先确保项目根目录有 `mbler build` 的产物 `dist.mcaddon`（release 构建：`cross-env BUILD_MODULE=release mbler build`），然后：

```bash
npx mfd page
```

产出在 `dist-page/<slug>/`（`slug` 由 addon 名生成），是纯静态文件（`index.html`、`assets/`）。把这个目录整体上传到任意静态托管即可；`dist.mcaddon` 与页面一同部署后，下载链接自动指向它。

本地预览：

```bash
npx mfd serve
```

会起一个本地服务，同时提供页面、manifest 与 addon 下载端点，浏览器打开提示的地址即可。

## 一条龙：推荐的完整 scripts

三个工具配好后，`package.json` 的 `scripts` 大致长这样（与 LuckBlock 一致）：

```json
{
  "scripts": {
    "dev": "mbler watch",
    "build": "cross-env BUILD_MODULE=release mbler build",
    "dev-build": "mbler build",
    "type-check": "mcx-tsc",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest run"
  }
}
```

日常改完代码的验收顺序：

```bash
pnpm type-check && pnpm lint && pnpm test && pnpm build
```

发新版本时再补一步 `npx mfd page` 刷新下载页。全部命令都不需要打开游戏。
