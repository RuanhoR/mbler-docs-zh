# ESLint 与 Vitest 插件

mbler 工具链为 `.mcx` 文件提供了两个官方插件，分别用于代码检查和单元测试：

- **[`@mbler/eslint-plugin-mcx`](https://www.npmjs.com/package/@mbler/eslint-plugin-mcx)** — ESLint 解析器 + 规则，直接 lint `.mcx` 文件
- **[`@mbler/vite-plugin-mcx`](https://www.npmjs.com/package/@mbler/vite-plugin-mcx)** — Vite/Vitest 插件，让测试里可以 `import` 编译后的 `.mcx` 模块

## ESLint 插件

### 安装

```bash
pnpm add -D @mbler/eslint-plugin-mcx
```

### 配置（flat config）

```js
// eslint.config.js
import mcx from "@mbler/eslint-plugin-mcx";

export default [
  ...其他配置,
  mcx.configs.recommended,
];
```

`mcx.configs.recommended` 作用于所有 `**/*.mcx` 文件，包含以下规则：

| 规则 | 默认级别 | 说明 |
| --- | --- | --- |
| `mcx/valid-event-binding` | error | `<Event>` 绑定的事件名必须是已知的 `@minecraft/server` 世界事件，且处理函数必须在 `<script>` 中导出 |
| `mcx/no-duplicate-root-tag` | error | `App` / `Event` / `Ui` / `Form` / `script` 每个文件只能出现一次（可通过 `unique` 选项调整） |
| `mcx/valid-prop-value` | error | 形似 JSON 对象/数组的属性值必须能通过 `JSON.parse` |
| `mcx/require-script-lang` | warn | `<script>` 必须声明 `lang="ts"` |

### 规则选项

- `valid-event-binding`：`{ allowUnknown?: boolean, extraEvents?: string[], ignoreKeys?: string[] }`。`McxExtendsBy` 等 `Mcx*` 编译器指令始终放行。
- `no-duplicate-root-tag`：`{ unique?: string[] }`（默认 `['App', 'Event', 'Ui', 'Form', 'script']`）。
- `require-script-lang`：`{ allow?: string[] }`（默认 `['ts']`）。

### 手动配置（自行挑选规则）

```js
export default [
  {
    files: ["**/*.mcx"],
    languageOptions: { parser: mcx.parser },
    plugins: { mcx },
    rules: {
      "mcx/valid-event-binding": [
        "error",
        { extraEvents: ["myEvent"], allowUnknown: false },
      ],
    },
  },
];
```

## Vitest 插件

`@mbler/vite-plugin-mcx` 封装了 `@mbler/mcx-core` 的 `rollupPlugin`，不改核心代码：

- 只让 `.mcx` 进入内部 transform，`.ts` 与图片仍走 Vite 自带的 esbuild/资源管线；
- `resolveId` 失败时回退给宿主解析器而不是抛错（裸导入仍会按 `moduleDir` 解析）；
- `.mcx` 文件内容变化时自动重建内部缓存，watch 模式不会读到旧编译结果；
- 不转发 `buildEnd` 的纹理 JSON 生成等副作用。

### 安装

```bash
pnpm add -D @mbler/vite-plugin-mcx
```

### 配置

```ts
// vitest.config.ts
import ts from "typescript";
import { defineConfig } from "vitest/config";
import { mcxPlugin } from "@mbler/vite-plugin-mcx";

export default defineConfig({
  plugins: [
    mcxPlugin(
      {
        moduleDir: "behavior/modules", // 裸导入（如 @mbler/mcx）的解析目录
        tsconfigPath: "tsconfig.json",
        sourcemap: false,
        ts,
      },
      // mcx-core 需要的输出目录；测试时用临时路径即可
      { dist: ".mcx-out", behavior: ".mcx-out", resources: ".mcx-out" },
    ),
  ],
  test: {},
});
```

之后就可以在测试里直接导入 `.mcx`：

```ts
import event from "./event.mcx";

test("event file compiles", () => {
  expect(event.type).toBe("event");
});
```

### 类型声明

```ts
declare module "*.mcx" {
  const mod: {
    type: string;
    setup?: (...args: unknown[]) => unknown;
    app?: Record<string, unknown>;
  };
  export default mod;
}
```

## 自定义规则

ESLint 插件把模板 AST 挂在 `ast.mcxTemplate`（也可通过 `services.mcxTemplate` 获取），自定义规则可以直接遍历 `ParsedTagNode` 树来检查模板结构。多个 `<script>` 块会合并进同一个 Program（作用域分析基于第一个块）。
