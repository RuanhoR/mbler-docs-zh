# 运行时框架 (`@mbler/mcx`)

`@mbler/mcx` 包为编译后的 MCX 应用提供运行时框架。它在 Minecraft Bedrock 的 Script API 环境中运行。

## 安装

```bash
npm install @mbler/mcx
```

## 导出

```javascript
import { createApp, Event, ui, Utils, types } from "@mbler/mcx";
```

## createApp

从编译后的 MCX 应用文件创建 `App` 实例。

```typescript
function createApp(app: MCXFile<'app'>): App;
```

**参数：**
- `app: MCXFile<'app'>` — 编译后的 app `.mcx` 文件的默认导出

**返回值：**
- `App` — 应用实例

**使用示例：**
```javascript
import { createApp } from "@mbler/mcx";
import { world } from "@minecraft/server";
import app from "./app.mcx";

const myApp = createApp(app);
myApp.mount(world);
```

---

## App

由 `createApp` 返回的应用实例。

```typescript
class App {
  constructor(public app: MCXFile<'app'>);
  mount(world: World): void;
}
```

### App#mount

将应用挂载到 Minecraft 世界。初始化所有导入的事件 MCX 文件，将其传入 `ctx.event`，然后调用 `setup(ctx)`。

```typescript
mount(world: World): void;
```

**参数：**
- `world: World` — Minecraft 世界实例（来自 `@minecraft/server`）

**执行流程：**
1. 遍历 `this.app.app.event`（如果存在）
2. 为每个编译后的事件 MCX 创建 `Event` 实例
3. 在每个实例上调用 `event.useWorld(world)`
4. 将所有事件推入 `ctx.event`
5. 调用应用的 `setup(ctx)` 函数

---

## Event

封装 Minecraft `WorldAfterEvents` / `WorldBeforeEvents`，提供事件处理器管理。

```typescript
class Event {
  constructor(opt: EventOpt);
  subscribe(...events: string[]): boolean;
  unsubscribe(...events: string[]): boolean;
  useWorld(w: World): void;
}
```

### Event#constructor

```typescript
constructor(opt: EventOpt);
```

**参数：**
- `opt: EventOpt` — 事件配置

```typescript
interface EventOpt {
  on: 'after' | 'before';                          // 订阅 after 或 before 事件
  data: Record<string, (event: any) => void>;      // 事件名 -> 处理器映射
  extends?: MCXFile<'event'>[];                    // 继承的事件 MCX 文件
  tick?: number;                                   // 节流间隔（毫秒）
}
```

### Event#subscribe

将事件处理器绑定到 Minecraft 世界事件。

```typescript
subscribe(...events: string[]): boolean;
```

**参数：**
- `events: string[]` — 要订阅的事件名称（例如 `"PlayerJoin"`, `"EntityHitEntity"`）。如果不传参数，则订阅**所有**已注册的处理器。

**返回值：**
- `boolean` — 如果所有订阅都成功则返回 `true`

### Event#unsubscribe

解绑事件处理器。

```typescript
unsubscribe(...events: string[]): boolean;
```

**参数：**
- `events: string[]` — 要取消订阅的事件名称。如果不传参数，则取消所有订阅。

**返回值：**
- `boolean` — 如果所有取消订阅都成功则返回 `true`

### Event#useWorld

切换用于事件绑定的世界实例。

```typescript
useWorld(w: World): void;
```

**参数：**
- `w: World` — 新的世界实例

### 使用示例

```javascript
import { Event } from "@mbler/mcx";

const event = new Event({
  on: "after",
  data: {
    PlayerJoin: (event) => {
      console.log(`玩家加入: ${event.player.name}`);
    },
  },
});

event.subscribe("PlayerJoin");
```

---

## ui

构建和显示 Minecraft Bedrock UI 表单（ModalFormData, ActionFormData, MessageFormData）。

```typescript
class ui {
  constructor(
    UIConfig: MCXUIOpt,
    mcxSrcFn: (ctx: MCXCtx & { $prop?: Record<string, any> }) => any
  );
  show(player: Player, prop: Record<string, any>): Promise<void>;
}
```

### ui#constructor

```typescript
constructor(UIConfig: MCXUIOpt, mcxSrcFn: (ctx: MCXCtx & { $prop?: Record<string, any> }) => any);
```

**参数：**
- `UIConfig: MCXUIOpt` — UI 布局配置（由编译后的 UI MCX 自动生成）
- `mcxSrcFn` — 返回已解析属性的源函数

### ui#show

向玩家显示 UI 并使用运行时属性。

```typescript
show(player: Player, prop: Record<string, any>): Promise<void>;
```

**参数：**
- `player: Player` — 目标玩家
- `prop: Record<string, any>` — 运行时属性（解析 `{{ propName }}` 和 `:param` 绑定）

### UI 布局类型

| 类型 | UI 表单类型 | 说明 |
|------|-------------|------|
| `title` | 全部 | 表单标题 |
| `body` | ModalForm, ActionForm | 标签/正文文本 |
| `divider` | ModalForm, ActionForm | 视觉分隔线 |
| `input` | ModalForm | 文本输入框 |
| `slider` | ModalForm | 滑块控件 |
| `toggle` | ModalForm | 开关 |
| `dropdown` | ModalForm | 下拉选择 |
| `submit` | ModalForm | 提交按钮 |
| `button` | ActionForm | 操作按钮 |
| `button-m` | MessageForm | 消息对话框按钮 |

### 动态属性绑定

UI MCX 支持运行时属性绑定：

- **内容绑定**：`{{ propName }}` — 在运行时通过 `prop.propName` 解析
- **参数绑定**：`:param="propName"` — 通过 `{ useProp: "propName" }` 解析
- **点击处理器**：`<button click="functionName">` — 从脚本导出中解析

### 使用示例

```javascript
import ui from "./ui.mcx";
import { world, system } from "@minecraft/server";

system.run(() => {
  const player = world.getPlayers()[0];
  ui.app.ui.show(player, { title: "你好！" });
});
```

---

## Utils

工具函数。

```typescript
function generateAntiShake<T extends Function>(fn: T, tick: number): T;
```

### generateAntiShake

创建函数的节流版本。如果在 `tick` 毫秒内再次调用，则阻止执行。`Event` 内部使用它来实现 `tick` 选项。

```typescript
function generateAntiShake<T extends Function>(fn: T, tick: number): T;
```

**参数：**
- `fn: T` — 要节流的函数
- `tick: number` — 节流间隔（毫秒）

**返回值：**
- `T` — 节流后的函数

---

## types

重新导出 `@mbler/mcx-types` 中的所有 TypeScript 类型。

```typescript
import type { MCXCtx, EventOpt, MCXUIOpt, MCXFile, Event, ui } from "@mbler/mcx";
```
