# VSCode 扩展

MCX 提供 VSCode 扩展来提供更好的开发体验。

## 安装

### 方式一：从 VSCode 市场安装

在 VSCode 扩展市场中搜索 `ruanhor.mcx-vscode-client` 并安装。

### 方式二：使用 Mbler 自动配置

当你使用 Mbler 创建项目时，它会自动配置语言服务器相关设置。

## 功能

VSCode 扩展提供以下功能：

- **语法高亮**：支持 mcx 文件的语法高亮
- **代码补全**：提供 mcx 标签和属性的自动补全
- **悬浮文档**：将鼠标悬停在标签或属性上时显示文档
- **格式化**：支持 mcx 文件的代码格式化
- **错误提示**：显示编译错误和警告
- **语言服务器**：集成 LSP 语言服务器
- **TypeScript 支持**：自动配置 TypeScript 插件

---

## 扩展详细功能

### # 代码补全 (Completion Provider)

扩展提供以下补全功能：

#### MCX 标签补全

当输入 `<` 时触发，提供以下标签：

- `script` - 脚本块
- `Event` - 事件定义块
- `Component` - 组件定义块
- `Ui` - UI 定义块
- `items` - 物品组件定义
- `blocks` - 方块组件定义
- `entities` - 实体组件定义
- `item` - 物品定义
- `block` - 方块定义
- `entity` - 实体定义

#### 属性补全

在标签内输入时触发，提供常用属性：

- `id` - 元素唯一标识符
- `lang` - 脚本语言 (ts/js)
- `@before` - 前置事件钩子
- `@after` - 后置事件钩子

#### 脚本块补全

在 `<script>` 块内提供：

- **import 补全**：`Event`, `createApp`
- **路径补全**：`"./event"`, `"./events"`
- **Minecraft 事件补全**：
  - `playerJoin` - 玩家加入
  - `playerLeave` - 玩家离开
  - `playerDie` - 玩家死亡
  - `playerRespawn` - 玩家重生
  - `blockBreak` - 方块破坏
  - `blockPlace` - 方块放置
  - `itemUse` - 物品使用
  - `itemUseOn` - 物品对实体使用
  - `entityHit` - 实体攻击
  - `entityDie` - 实体死亡
  - `projectileHit` - 投射物命中
  - `weatherChange` - 天气变化
  - `timeChange` - 时间变化
- **Event 方法补全**：`subscribe`, `unsubscribe`, `useWorld`, `createApp`

---

### # 悬浮文档 (Hover Provider)

悬停在标签或属性上时显示详细文档：

#### 标签文档

- **`<script>`**：脚本块，用于嵌入 TypeScript/JavaScript 代码
  - 属性：`lang`, `id`, `@before`, `@after`
  - 语言：`ts`, `js`
- **`<Event>`**：Minecraft 事件处理器定义块
  - 属性：`id`
- **`<Component>`**：组件定义块
  - 属性：`id`
- **`<Ui>`**：UI 定义块
  - 属性：`id`

#### 属性文档

- **`id`**：元素的唯一标识符
- **`lang`**：脚本语言规范 (`ts` 或 `js`)
- **`@before`** / **`@after`**：事件钩子，在主逻辑前后执行代码

---

### # 格式化 (Formatting Provider)

支持 `.mcx` 文件的代码格式化，使用 `Shift+Alt+F` 或命令面板触发。

---

### # 语言服务器集成

扩展会自动启动语言服务器客户端，提供：

- 语义分析
- 类型检查
- 错误诊断

#### 命令

- **`mcx.restart.language`**：重启语言服务器

在命令面板 (Ctrl+Shift+P) 中输入 `MCX: Restart Language Server` 可重启语言服务器。

---

### # TypeScript 插件集成

扩展会自动检测并配置 TypeScript 插件 (`@mbler/mcx-ts-plugin`)：

1. 检测 VSCode TypeScript 扩展
2. 自动激活并配置插件
3. 为 `.mcx` 文件提供类型支持

---

## 语言服务器

MCX 使用 `@mbler/mcx-server` 作为语言服务器后端。

### 安装

```bash
npm install @mbler/mcx-server --save-dev
```

### @mbler/mcx-server API

#### 安装

```bash
npm install @mbler/mcx-server --save
```

#### 导出

```javascript
import {
  MCXVirtualCode,
  createMCXLanguagePlugin,
  createMCXVirtualCode,
  type MCXLanguagePlugin
} from "@mbler/mcx-server";
```

| 导出                      | 类型       | 说明              |
| ------------------------- | ---------- | ----------------- |
| `MCXVirtualCode`          | `class`    | MCX 虚拟代码类    |
| `createMCXLanguagePlugin` | `function` | 创建 MCX 语言插件 |
| `createMCXVirtualCode`    | `function` | 创建 MCX 虚拟代码 |
| `MCXLanguagePlugin`       | `type`     | 语言插件类型定义  |

#### createMCXLanguagePlugin

创建 MCX 语言插件，用于 Volar 语言服务器。

```typescript
function createMCXLanguagePlugin(
  ts: typeof import("typescript"),
): MCXLanguagePlugin;
```

**参数：**

- `ts: typeof import("typescript")` - TypeScript 模块

**返回值：**

- `MCXLanguagePlugin` - MCX 语言插件实例

**使用示例：**

```typescript
import * as ts from "typescript";
import { createMCXLanguagePlugin } from "@mbler/mcx-server";

const languagePlugin = createMCXLanguagePlugin(ts);
```

#### 运行独立语言服务器

```bash
# 使用 npx
npx mcx-language-server

# 或全局安装后使用
npm install -g @mbler/mcx-server
mcx-language-server
```

---

## TSPlugin

`@mbler/mcx-ts-plugin` 提供 TypeScript 插件，用于增强 TypeScript 对 mcx 文件的类型检查。

### 安装

```bash
npm install @mbler/mcx-ts-plugin --save-dev
```

### 配置

在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@mbler/mcx-ts-plugin"
      }
    ]
  }
}
```
