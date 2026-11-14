# JSON UI 插件

[![npm](https://img.shields.io/npm/v/@mbler/mcx-plugin-jsonui?label=npm)](https://www.npmjs.com/package/@mbler/mcx-plugin-jsonui)

`@mbler/mcx-plugin-jsonui` 把 `<Ui type="jsonui">` 编译成真正的 [JSON UI](https://mcbeui.netlify.app/) 资源文件，让 `.mcx` 既能写 SAPI 表单，也能修改原版界面 —— HUD 元素、server form 屏幕，或者整块自定义界面。

插件基于 [MCX 编译器插件](./mcx-plugin) 实现，不会改动内置的 `<Ui>` / `<Form>` 表单编译逻辑：

1. `<Ui>` 先被编译成一份纯 JSON UI 文档（namespace + 控件）；
2. 再由 **availability（可用性）适配器** 决定这份文档写到哪里、怎么挂进原版界面。

`<Ui>` 上除保留属性外的所有属性都会原样写进 JSON UI（合法的 JSON 值会自动转成数字/布尔/数组/对象），子标签变成 `controls`，嵌套标签递归变成子控件，所以新增控件类型不需要改编译器。

## 安装

```bash
# 0.0.1 仍是预览版，需要显式指定 alpha 标签
pnpm add -D @mbler/mcx-plugin-jsonui@alpha

# <script> 里用到的运行时工具（Molang binding、JSONUIComponent 类型）
pnpm add @mbler/mcx-component
```

包地址：<https://www.npmjs.com/package/@mbler/mcx-plugin-jsonui>

```js
// mbler.config.js
import { defineConfig } from "mbler";
import jsonui from "@mbler/mcx-plugin-jsonui";

export default defineConfig({
  description: "my ui addon",
  mcVersion: "1.21.120",
  script: { lang: "mcx", main: "index.ts" },
  mcxPlugin: [jsonui()],
});
```

`jsonui()` 可以带选项，也可以和其他编译器插件一起用：

```js
mcxPlugin: [jsonui({ uiDir: "ui", formMarker: "my_ui:" }), myOtherPlugin];
```

## 写一个界面

```xml
<Ui type="jsonui" target="shop" availability="server_form" namespace="mypack">
  <label text="商店" size="[80, 20]" />
  <button id="buy" text="购买" />
  <panel id="row" size="[100, 30]">
    <image texture="textures/ui/icon" />
  </panel>
</Ui>
```

### 根属性

| 属性                             | 说明                                                          |
| -------------------------------- | ------------------------------------------------------------- |
| `type="jsonui"`                  | 启用插件（必填）；用 `<JsonUi>` 根标签时可以省略 `type`       |
| `target`                         | 目标屏幕 / 控件名；可省略，此时用文件名推导                   |
| `availability` / `avail` / `use` | 挂载方式，默认 `file`                                         |
| `namespace` / `ns`               | JSON UI namespace，默认取 `.mcx` 文件名                       |
| `id`                             | 根控件 id，默认 `target` 或 namespace                         |
| `element-type` / `control-type`  | 根控件 `type`，默认 `screen`                                  |
| `file` / `save`                  | 额外把原始 JSON 文档另存到该路径                              |
| 其他任意属性                     | 原样写入根控件（如 `size`、`anchor_from`、`bindings`）        |

子标签的 `id` / `name` 决定控件名，`type` 属性（没有则用标签名）决定控件类型；`:xxx="expr"` 会保留表达式字符串，便于写绑定。

## availability（可用性）

| 名称             | 产物                                                                   | target                    | 全局唯一 |
| ---------------- | ---------------------------------------------------------------------- | ------------------------- | -------- |
| `file`（默认）   | `ui/<namespace>.json`，登记进 `_ui_defs.json`                          | 可选                      | 否       |
| `server_form`    | `ui/<namespace>_<target>.json` + 共享 `ui/server_form.json` 路由壳     | 可选                      | 否       |
| `hud`            | `ui/<namespace>_hud.json`，向 `hud_screen` 注入 `modifications`        | 可选（默认 `hud_screen`） | 否       |
| `vanilla`        | `ui/<namespace>_vanilla.json`，子控件按 id 覆盖原版元素                | 可选                      | **是**   |
| `none`           | 不写文件，文档只保留在编译后的模块里                                   | 可选                      | 否       |

### `server_form`

采用 Bedrock Wiki 的 “Modifying Server Forms” 路由：在 `main_screen_content` 插入 gated factory 指向 `@<namespace>.root`，`long_form` 用标题前缀隐藏原生表单。脚本侧把 `getFormTitle()` 作为 `ActionFormData` 的标题即可点亮自定义屏：

```js
// behavior/scripts/index.ts
import { ActionFormData } from "@minecraft/server-ui";
import shop from "./shop.mcx";

world.afterEvents.itemUse.subscribe(({ source }) => {
  new ActionFormData()
    .title(shop.jsonui.getFormTitle()) // 默认 'mbler_ui:shop'
    .body("挑一个吧")
    .show(source);
});
```

所有 `server_form` 屏共用同一个 `ui/server_form.json` 路由壳，加屏不会重复壳文件。

### `hud` 与 `vanilla`

- `hud` 通过 `onBuildEnd` 追加 `modifications` 来改 HUD 屏；
- `vanilla` 用于覆盖原版控件（如 `hud_title`），一次构建里只允许出现一次，超了插件会报错。

### 自定义 availability

```js
import { defineJsonUIAvailability, jsonui } from "@mbler/mcx-plugin-jsonui";

const myScreen = defineJsonUIAvailability({
  name: "my_screen",
  requiresTarget: true, // 强制要求 target
  singleton: false, // true = 全局只允许一个
  emit(ctx) {
    const file = `${ctx.uiDir}/${ctx.namespace}.mine.json`;
    return {
      files: [{ path: file, content: ctx.document }],
      uiDefs: [file],
      meta: { path: file, formTitle: `my_ui:${ctx.target}` },
    };
  },
});

export default jsonui({ availabilities: [myScreen] });
```

插件选项：`availability`、`namespace`、`uiDir`（默认 `ui`）、`formMarker`（默认 `mbler_ui:`）、`saveRaw`、`resourcesDir`（覆盖输出目录）、`availabilities`。

## 编译后的模块

生成的 `.mcx` 模块会导出描述对象、`JSONUIComponent` 类和实例：

```ts
import ui, { JSONUIComponent, jsonui } from "./shop.mcx";

jsonui.document; // 纯 JSON UI 文档
jsonui.getPath(); // 'ui/mypack_shop.json'
jsonui.getControls(); // 根控件的 controls
jsonui.getFormTitle(); // 'mbler_ui:shop'（仅 server_form）
```

`JSONUIComponent` 也可以从 `@mbler/mcx-plugin-jsonui/component` 直接导入。它不依赖任何 Node 模块，因此能在 `<Component>` 编译期脚本和游戏内 Script API 里使用：

```js
import { ActionFormData } from "@minecraft/server-ui";
import shop from "./shop.mcx";

new ActionFormData().title(shop.jsonui.getFormTitle()).body("...").show(player);
```

## 用 `<script>` 建 binding（Molang）

JSON UI 界面在把控件绑到数据之前只是一堆静态标记。jsonui 文件里的 `<script>` 代码会进入生成的模块，因此能直接访问 `jsonui`，在加载时改造文档。binding 用 `@mbler/mcx-component` 的 `Molang` 构建：

```ts
import { Molang } from "@mbler/mcx-component";

// query.get_health / 20 * 100 -> 标签文本
jsonui.text("hp", Molang.query("get_health").div(20).mul(100));

// 血量低于 25% 才显示警告
jsonui.visible(
  "low_hp",
  Molang.query("get_health").lt(5),
  "always_when_visible",
);

// 显式 binding 对象
jsonui.bind("title", Molang.bind.view(Molang.variable("#text"), "#label"));
```

`Molang` 是个小构造器，每个运算符都返回新表达式，长条件也能读：

| 用法 | 生成的 Molang |
| --- | --- |
| `Molang.query("get_health")` | `query.get_health` |
| `Molang.variable("#text")` / `Molang.variable("$score")` | `#text` / `$score` |
| `Molang.context("hud_title_text_string")` | `context.hud_title_text_string` |
| `Molang.math("clamp", x, 0, 100)` | `math.clamp(x, 0, 100)` |
| `Molang.when(cond, a, b)` | `(cond ? a : b)` |
| `Molang.string("HP: ")` | `'HP: '` |
| `expr.add / sub / mul / div / mod` | `(a + b)` … |
| `expr.gt / gte / lt / lte / eq / neq` | `(a > b)` … |
| `expr.and / or / not / neg` | `(a && b)` … |

binding 本身由 `Molang.bind` 产出：

```ts
Molang.bind.view(source, "#text"); // binding_type: 'view'
Molang.bind.global(source, "#visible"); // binding_type: 'global'
Molang.bind.collection(source, "#text", "shop_items"); //集合内绑定
Molang.bind.of({ source, target: "#alpha", condition: "always" }); // 任意字段
```

`toJSON()` 返回 JSON UI 需要的对象（`binding_type`、`binding_condition`、`source_property_name`、`target_property_name` 等），可以直接塞进 `bindings`。

## 运行时控件操作

`JSONUIComponent`（也就是 `jsonui` 实例）提供了其余方法，界面不必局限于模板里声明的控件：

| 方法 | 作用 |
| --- | --- |
| `bind(id, binding, { create?, replace? })` / `addBinding(...)` | 给控件追加一条或多条 binding |
| `setBindings(id, bindings)` / `clearBindings(id)` | 替换 / 清空 binding |
| `text(id, expr)` / `visible(id, expr)` | `#text` 与 `#visible` 的快捷写法 |
| `addControl(parentId, id, element)` | 运行时声明控件，比如列表的每一行 |
| `removeControl(parentId, id)` | 从父控件里移除 |
| `findElement(id)` / `getBindings(id)` | 读取文档（含嵌套控件） |

id 不存在时 `bind()` 会抛错，除非传 `{ create: true }`——它会就地声明一个同 id 的 `panel`，脚本动态造行时很实用：

```ts
jsonui.bind("rows", Molang.bind.view("#text", "#text"), { create: true });
for (const item of items) {
  jsonui.addControl("rows", item.id, { type: "label", text: item.name });
}
```

::: tip
`<script>` 与生成的文档共享同一个模块作用域，所以具名导出可用（`export function open(player) {}`），但 `export default` 已被 jsonui 描述对象占用——写了插件会直接报编译错误。
:::

## 没有 `<script>` 的文件

`.mcx` 里可以只有 `<Ui type="jsonui">`。编译器会先报「缺少 script」，插件通过 `onThrow` 从源码里重新解析并恢复，因此仍然会输出 `.json` 与模块，纯 UI 文件可以保持声明式写法。

## `_ui_defs.json`

所有生成的 UI 文件会在 `onBuildEnd` 合并进 `ui/_ui_defs.json`，并保留已有条目，因此插件可以和手写的 JSON UI 文件共存在同一个资源包里。

## 相关资料

- JSON UI 文档：<https://mcbeui.netlify.app/>
- `_ui_defs.json`：<https://mcbeui.netlify.app/document/ui_defs>
- [MCX 编译器插件](./mcx-plugin)
