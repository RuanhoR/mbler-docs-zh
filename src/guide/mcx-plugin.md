# MCX 编译器插件（`mcxPlugin`）

不用改 `@mbler/mcx-core` 就能扩展 MCX 编译器。插件就是一个带 `name` 和一组钩子的普通对象，它会在内置 transform 前后拿到每个 `.mcx` 文件，可以改写生成模块、注册新的根标签，或者额外产出文件（资源包、JSON UI 文档、生成的资源等）。

```js
// mbler.config.js
import { defineConfig } from "mbler";
import jsonui from "@mbler/mcx-plugin-jsonui";

export default defineConfig({
  description: "demo",
  mcVersion: "1.21.120",
  script: { lang: "mcx", main: "index.ts" },
  mcxPlugin: [jsonui()],
});
```

::: tip
`mcxPlugin` 只在 `script.lang: "mcx"` 时生效；`ts` / `js` 项目会忽略该字段。
:::

## 插件结构

```ts
import type { McxPlugin } from "@mbler/mcx-core";

const myPlugin: McxPlugin = {
  name: "my-plugin", // 必填，用于报错信息
  tags: {}, // 自定义根标签处理函数
  onTransform, // 内置 transform 之前
  onTransformed, // 内置 transform 之后
  onThrow, // 编译报错时尝试恢复
  onBuildStart, // 构建生命周期
  onBuildEnd,
};
```

| 钩子                              | 触发时机                        | 返回值                                        |
| --------------------------------- | ------------------------------- | --------------------------------------------- |
| `tags[name](node, ctx)`           | 遇到同名根标签                  | `string` = 整体替换模块输出                   |
| `onTransform(ctx)`                | 内置 transform 之前             | `string` = 短路内置编译                       |
| `onTransformed(code, ctx)`        | 内置 transform 之后             | `string` = 替换当前代码                       |
| `onThrow(error, ctx)`             | 编译或 transform 抛错           | `string` = 恢复，并作为模块输出               |
| `onBuildStart()` / `onBuildEnd()` | 整次构建前后（不是每个文件）    | —                                             |

所有钩子都可以是 async。

## 钩子上下文

每个钩子都会收到同一个「按文件」的上下文：

| 字段                         | 说明                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| `id`                         | `.mcx` 文件的绝对路径                                             |
| `source`                     | 原始 `.mcx` 源码（没有 `<script>` 的文件同样可用）                |
| `code`                       | 当前生成的 JS：transform 前是源码，之后是编译产物                 |
| `nodes`                      | 本文件的根标签节点（`name`、`arr`、`content`、`loc`）             |
| `opt`                        | 传给编译器的 `CompileOpt`                                         |
| `output`                     | `{ dist, behavior, resources }` 输出目录                          |
| `plugins`                    | 解析后的插件列表，按执行顺序                                      |
| `tag(name)` / `tags(name)`   | 取第一个 / 全部同名根标签                                         |
| `registerTag(name, handler)` | 为本文件注册一个根标签处理函数                                    |
| `addImport(code)`            | 在模块顶部插入 import                                             |
| `addStatement(code)`         | 在模块顶层追加语句                                                |
| `addExport(name, expr)`      | 新增或替换默认导出对象上的字段                                    |
| `setType(type)`              | 覆盖默认导出对象的 `type` 字段                                    |
| `error(message, loc?)`       | 带位置信息地抛出 bundler 错误                                     |

## 自定义根标签

`tags`（或 `ctx.registerTag`）让插件接管内置编译器不认识的根标签，`@mbler/mcx-plugin-jsonui` 里的 `<JsonUi>` 就是这么来的：

```ts
import { defineMcxPlugin } from "@mbler/mcx-core";

export default defineMcxPlugin({
  name: "layout",
  tags: {
    Layout(node, ctx) {
      // node.arr 是属性，node.content 是子标签
      ctx.addImport(`import { render } from "my-layout-runtime";`);
      ctx.addExport("layout", JSON.stringify(node.arr));
      ctx.setType("layout");
    },
  },
});
```

```xml
<Layout size="[100, 50]" />
```

编译出的模块默认导出会带上 `type: "layout"` 和 `layout` 字段，并注入上面的 import，可以直接交给 `<Component>` 或任何消费 MCX 模块的运行时。

处理函数也可以 `return` 一个字符串来替换整个模块 —— 当这个标签就是整个文件时很方便。

::: tip
被插件接管的根标签对内置 transform 来说是透明的，所以 `<Panel>` / `<Layout>` / `<JsonUi>` 可以和 `<script>` 写在同一个文件里；只有内置 `<Ui>` / `<Form>` 表格里列出的标签保持原有行为。
:::

## 替换编译产物

`onTransform` 在内置的 `<App>` / `<Ui>` / `<Form>` / `<Event>` / `<Component>` 处理之前运行，返回字符串就完全跳过内置 transform：

```ts
onTransform(ctx) {
  const ui = ctx.tag("Ui");
  if (!ui) return; // 不是我的，交给内置 transform
  return generateModule(ui, ctx); // 整体替换
}
```

注意：即使编译器拒绝了某个文件（例如没有 `<script>` 的 `.mcx`），`ctx.source` 也一定可用，因此 `onThrow` 可以自己解析源码并恢复：

```ts
onThrow(error, ctx) {
  if (!/must has a script/i.test(error.message)) return;
  return compileFromSource(ctx.source);
}
```

`onTransformed` 作用于最终 JS，并且会在多个插件之间链式调用，所以多个插件可以先后处理同一个模块。

## 执行顺序

插件按数组顺序执行 —— `[a(), b()]` 中 `a` 的所有钩子都先于 `b`。`onTransform` 遇到第一个返回字符串的插件就停止，`onTransformed` 则每个插件都会执行。

下面两种写法都支持：

```js
mcxPlugin: jsonui(),                  // 单个插件
mcxPlugin: [jsonui(), myPlugin],      // 工厂调用 + 普通对象
```

工厂返回的插件各自持有独立状态，所以每个 addon 调用一次 `jsonui()` 就有一份互不干扰的构建状态。

## 构建生命周期

`onBuildStart` / `onBuildEnd` 会由 `mbler` 使用的 Rolldown 插件转发，测试里的 `vitePlugin` 也会转发：

- `onBuildStart` —— 清缓存、重置计数器；
- `onBuildEnd` —— 落盘聚合文件（JSON UI 插件的 `ui/_ui_defs.json` 就是在这里写的）。

## 在测试中使用插件

`vitePlugin` 接受同样的 `mcxPlugin` 字段，因此单测里也能带着插件编译 `.mcx`：

```ts
// vitest.config.ts
import ts from "typescript";
import { defineConfig } from "vitest/config";
import { vitePlugin } from "@mbler/mcx-core";
import jsonui from "@mbler/mcx-plugin-jsonui";

export default defineConfig({
  plugins: [
    vitePlugin(
      {
        moduleDir: "behavior/modules",
        tsconfigPath: "tsconfig.json",
        sourcemap: false,
        ts,
        mcxPlugin: [jsonui()],
      },
      { dist: ".mcx-out", behavior: ".mcx-out", resources: ".mcx-out" },
    ),
  ],
});
```

## 官方插件

| 包                                        | 作用                                              |
| ----------------------------------------- | ------------------------------------------------- |
| [`@mbler/mcx-plugin-jsonui`](./jsonui)    | 把 `<Ui type="jsonui">` 编译成 JSON UI 资源文件    |

属性与 availability 的完整说明见 [JSON UI 插件](./jsonui)。
