# VSCode 扩展

MCX 提供 VSCode 扩展来提供更好的开发体验。

## 安装

### 方式一：从 VSCode 市场安装

在 VSCode 扩展市场中搜索 `mcx.language.support` 并安装。

### 方式二：使用 Mbler 自动配置

当你使用 Mbler 创建项目时，它会自动配置语言服务器相关设置。

## 功能

VSCode 扩展提供以下功能：

- **语法高亮**：支持 mcx 文件的语法高亮
- **代码补全**：提供 mcx 标签和属性的自动补全
- **悬浮文档**：将鼠标悬停在标签或属性上时显示文档
- **格式化**：支持 mcx 文件的代码格式化
- **错误提示**：显示编译错误和警告

## 语言服务器

MCX 使用 `@mbler/mcx-language-server` 作为语言服务器后端。

### 安装语言服务器

```bash
npm install @mbler/mcx-server --save-dev
```

### 配置 TypeScript

在 `tsconfig.json` 中添加 mcx 类型支持：

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@mbler/mcx-language-server"
      }
    ]
  }
}
```

### 使用语言服务器 API

```javascript
import { createMCXLanguagePlugin } from "@mbler/mcx-server";
import * as ts from "typescript";

const languagePlugin = createMCXLanguagePlugin(ts);
```

## TSPlugin

`@mbler/mcx-language-server` 还提供 TypeScript 插件，用于增强 TypeScript 对 mcx 文件的类型检查。

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