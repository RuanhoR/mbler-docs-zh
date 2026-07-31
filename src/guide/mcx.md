# 在 Mbler 中的 mcx DSL

## 简介

mcx 是Mbler中为方便书写的一种类似Vue的DSL。

### 已完成的功能

- **VSCode 扩展**：支持语法高亮、代码补全、悬浮文档、格式化
- **TypeScript 类型支持**：通过 `@mbler/mcx-language-server` 提供 LSP 支持
- **Component MCX**：支持 Item、Block、Entity 组件定义
- **UI MCX**：用户界面构建
- **Event MCX**：事件处理

### 安装 @mbler/mcx-core

```bash
npm install @mbler/mcx-core --save
```

### 组件 API 概览

`@mbler/mcx-component` 导出以下组件类：

```javascript
import {
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  ComponentType,
} from "@mbler/mcx-component";
```

## 使用

用 `mbler init`创建项目（如果未安装mbler请去 [开始](./quick-start)），选择mcx为语言。  
然后，将会自动生成模板包，可以尝试改一些东西。

## 正式了解

MCX 目前分为以下几种

- UI MCX
- Event MCX
- App MCX
- Component MCX

### UI MCX

构建游戏内表单，支持两种模式：

- **`<Ui>`** — CustomForm（响应式，Observable 绑定）。需要 `@minecraft/server-ui` >= 2.1。
- **`<Form>`** — 传统 FormData（ModalFormData / ActionFormData / MessageFormData）。兼容任意版本。

#### 可用标签

标签映射到底层 Minecraft 表单 API 方法：

| 标签                  | `<Ui>` (CustomForm) | `<Form type="modal">` (ModalFormData) | `<Form type="action">` (ActionFormData) | `<Form type="message">` (MessageFormData) |
| --------------------- | ------------------- | ------------------------------------- | --------------------------------------- | ----------------------------------------- |
| `title`               | 构造参数            | `.title()`                            | `.title()`                              | `.title()`                                |
| `label`               | `.label()`          | `.label()`                            | `.label()`                              | —                                         |
| `header`              | `.header()`         | `.header()`                           | `.header()`                             | —                                         |
| `body`                | —                   | `.label()`                            | `.body()`                               | `.body()`                                 |
| `divider`             | `.divider()`        | `.divider()`                          | `.divider()`                            | —                                         |
| `spacer`              | `.spacer()`         | —                                     | —                                       | —                                         |
| `close-button`        | `.closeButton()`    | —                                     | —                                       | —                                         |
| `input` / `textField` | `.textField()`      | `.textField()`                        | —                                       | —                                         |
| `toggle`              | `.toggle()`         | `.toggle()`                           | —                                       | —                                         |
| `dropdown`            | `.dropdown()`       | `.dropdown()`                         | —                                       | —                                         |
| `slider`              | `.slider()`         | `.slider()`                           | —                                       | —                                         |
| `submit`              | —                   | `.submitButton()`                     | —                                       | —                                         |
| `button`              | `.button()`         | —                                     | `.button()`                             | —                                         |
| `button-m`            | —                   | —                                     | —                                       | `.button1()` / `.button2()`               |

#### 传统表单（非响应式）

```
<Form>
  <title>Hello</title>
  <label>欢迎, {{ playerName }}!</label>
  <button click="close">关闭</button>
</Form>
<script>
  export const prop = ["playerName"];
  export function close() { /* 关闭 */ }
</script>
```

#### CustomForm 响应式模式（Setup）

```
<Ui setup>
  <title>设置</title>
  <input>{{ name }}</input>
  <toggle>{{ enabled }}</toggle>
  <button click="save">保存</button>
</Ui>
<script>
import { onStartup, onMounted } from "@mbler/mcx";

const name = defineProp("Player")
const enabled = defineProp(true)

onStartup(() => { /* 首次显示前执行一次 */ })
onMounted(() => { /* 每次显示执行 */ })

function save() { /* name.value 获取当前值 */ }
</script>
```

支持的类型：`modal`、`action`、`message`。

#### For 循环

使用 `in` 或 `of` 遍历数组：

```
<Ui setup>
  <input for="item in items">{{ item }}</input>
</Ui>
<script>
const items = ["A", "B", "C"]
</script>
```

#### 在其他文件中使用

```javascript
import UI from "./ui.mcx";
import { showForm } from "@mbler/mcx";
import { system, world } from "@minecraft/server";

system.run(() => {
  const players = world.getPlayers();
  showForm(UI, players[0], {
    title: "TEST",
  });
});
```

### Event mcx

示例

```
<Event @after tick="50">
  EntityHitEntity = hit
</Event>
<script>
export function hit(event) {
  console.log(event)
}
</script>
```

外部使用：(最好是在App Mcx中导入)

```
<script>
import event from "./event.mcx";
event.subscribe() // 全部注册，也可以 event.subscribe("EntityHitEntity")
</script>
```

### Component MCX

首先，创建一个 .mcx 文件，在里面加上 `<Component>` 标签  
演示

```
<Component>
  <items>
    <item id="demo">itemComponent</item>
  </items>
</Component>
<script>
import { ItemComponent } from "@mbler/mcx-component"
const itemComponent = new ItemComponent({
  format: "1.21.100", // 格式版本
  name: "Demo Item",
  id: "mcx_demo:demo_item"
});
itemComponent.setAllowOffHand(true) // 允许放在副手
export {
  itemComponent
}
</script>
```

解释

- Component
  组件定义的根标签
  - items
    - 声明这里要定义 item 的JSON
      - item 声明这里要定义一个物品从script的导出，内容是导出字符串，属性的id是文件Id
- Script
  - 必须实现在Component定义的这个导出，否则编译时期会报错

关于 @mbler/mcx-core 的组件导出，详见 [MCX 核心 API 参考](./internal/mcx)

### App MCX

App MCX 是附加包的**入口点**。它编排事件 MCX 文件，并在附加包挂载时运行设置逻辑。

示例：

```
<script>
import event from "./event.mcx";

export default {
  app: {
    event: [event]
  },
  setup(ctx) {
    console.log("附加包已挂载！", ctx);
  }
}
</script>
```

编译后的输出由 `@mbler/mcx` 中的 `createApp` 使用：

```javascript
import { createApp } from "@mbler/mcx";
import { world } from "@minecraft/server";
import app from "./app.mcx";

const myApp = createApp(app);
myApp.mount(world);
```

**工作原理：**

1. App MCX 导入一个或多个事件 MCX 文件
2. `createApp(app)` 创建 `App` 实例
3. `app.mount(world)` 将所有导入的事件 MCX 文件加载为 `Event` 对象，传入 `ctx.event`，然后调用 `setup(ctx)`
4. 在 `setup` 中，你可以调用 `event.subscribe()` 注册所有事件处理器

**App MCX 的结构：**

- 必须导出一个**默认对象**，包含：
  - `app.event` — 编译后的事件 MCX 模块数组
  - `setup(ctx)` — 在事件初始化后调用，接收包含 `{ event: Event[] }` 的 `MCXCtx`

运行时 API 请参见 [运行时框架 API](./internal/runtime)。
