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

示例

```
<Ui>
  <button click="hello">{{ title }}</button>
</Ui>
<script>
  export const hello = function() {
    console.log("Hello world")
  }
</script>
```

其他文件使用：

```javascript
import UI from "./ui.mcx";
import { system, world } from "@minecraft/server";

system.run(() => {
  const players = world.getPlayers();
  UI.app.ui.show(players[0], {
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
