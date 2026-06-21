# MBLER API

## 使用

### 安装

```bash
npm i mbler --save
```

### 导入

Mbler 从 `0.2.4-rc.6` 版本开始支持模块化导入：

```javascript
// 主入口
import * as mbler from "mbler";

// 构建模块入口 (推荐) - 包含 Build、build、watch 等构建相关 API
import * as Build from "mbler/build";
```

::: warning 废弃提示
从 `0.2.4-rc.6` 版本开始，**不推荐**使用 `mbler.Build` 或 `mbler.default.Build` 来访问构建 API。这些 API 已迁移到 `mbler/build` 入口点。

旧写法（已废弃）:

```javascript
import * as mbler from "mbler";
mbler.Build; // 已废弃
mbler.build; // 已废弃
```

新写法（推荐）:

```javascript
import * as Build from "mbler/build";
Build.Build; // 新的 Build 类
Build.build; // 新的 build 函数
```
:::

## 总览

### 主入口 `mbler`

```javascript
require("mbler");
/* return: {
  LanguageNames: [ 'zh', 'en' ],
  cli: [AsyncFunction: cli],
  cmdList: [...],
  commander: {
    Input: [class Input],
    click: [Function: click],
    onEnd: [Function: onEnd]
  },
  defineConfig: [Function: defineConfig],
  i18n: {},
  templateMblerConfig: {...}
}*/
```

### 构建模块入口 `mbler/build`

从 `0.2.4-rc.6` 版本开始，提供独立的构建模块入口：

```javascript
require("mbler/build");
/* return: {
  default: [class Build],
  Build: [class Build],
  build: [Function: build],
  watch: [Function: watch],
  McxTsc: [Function: McxTsc]
}*/
```

**使用场景：**

- 当你只需要构建功能而不需要 CLI 或其他功能时
- 用于封装自定义的构建流程
- 减少不必要的依赖导入

# API

## mbler

### mbler#cli

运行一个 cli 服务，解析当前 cli 参数。

```typescript
function cli(): Promise<void>;
```

**参数：** 无

**返回值：**

- `Promise<void>` - CLI 执行完成

---

### mbler#defineConfig

定义 Mbler 配置文件类型，用于类型提示。

```typescript
function defineConfig(config: MblerConfigData): MblerConfigData;
```

**参数：**

- `config: MblerConfigData` - Mbler 配置数据

**返回值：**

- `MblerConfigData` - 返回传入的配置对象

---

## Types

### Types#LanguageNames

支持的语言名称列表。

```typescript
const LanguageNames: ["zh", "en"];
```

---

### Types#cmdList

可用命令列表。

```typescript
const cmdList: readonly [
  "c", "work", "help", "h", "init", "version",
  "build", "watch", "lang", "set-work-dir",
  "publish", "unpublish", "install", "uninstall",
  "login", "profile", "view", "config"
];
```

---

### Types#templateMblerConfig

默认配置模板。

```typescript
const templateMblerConfig: MblerConfigData;
```

---

### Types#CliParam

CLI 参数接口。

```typescript
interface CliParam {
  params: string[];
  opts: Record<string, string>;
}
```

**属性：**

- `params: string[]` - 命令行参数数组
- `opts: Record<string, string>` - 选项键值对

---

### Types#MblerConfigData

配置文件数据接口。

```typescript
interface MblerConfigData {
  name: string;
  displayName?: string;
  description: string;
  version: string;
  mcVersion: string | string[];
  outdir?: MblerConfigOutdir;
  script?: MblerConfigScript;
  minify?: boolean | 'oxc' | 'terser' | 'esbuild';
  build?: MblerBuildConfig;
}
```

**属性：**
- `name: string` - 包名（必填），用于 UUID 生成和 MNX 发布
- `displayName?: string` - 可选，在 manifest.json 中显示的名称；未设置时回退使用 `name`
- `description: string` - 项目描述（必填）
- `version: string` - 项目版本（必填）
- `mcVersion: string | string[]` - Minecraft 版本（必填）
- `outdir?: MblerConfigOutdir` - 输出目录配置
- `script?: MblerConfigScript` - 脚本配置
- `minify?: boolean` - 是否压缩代码
- `build?: MblerBuildConfig` - 构建配置

---

### Types#MblerConfigOutdir

输出目录配置接口。

```typescript
interface MblerConfigOutdir {
  behavior?: string;
  resources?: string;
  dist: string;
}
```

**属性：**

- `behavior?: string` - 行为包输出目录
- `resources?: string` - 资源包输出目录
- `dist: string` - 主输出目录（必填）

---

### Types#MblerConfigScript

脚本配置接口。

```typescript
interface MblerConfigScript {
  main: string;
  ui?: boolean;
  lang?: "ts" | "mcx" | "js";
  UseBeta?: boolean;
}
```

**属性：**

- `main: string` - 入口文件（必填）
- `ui?: boolean` - 是否启用 UI
- `lang?: "ts" | "mcx" | "js"` - 脚本语言类型
- `UseBeta?: boolean` - 是否使用 Beta API

---

### Types#MblerBuildConfig

构建配置接口。

```typescript
interface MblerBuildConfig {
  rollupPlugins?: Plugin[];
  cache?: "auto" | "enable" | "disable";
  bundle?: boolean;
  onEnd?: (config: MblerConfigData) => Promise<void>;
  onStart?: (config: MblerConfigData) => Promise<void>;
  onWarn?: (config: MblerConfigData, warning: Error) => void;
}
```

**属性：**

- `rollupPlugins?: Plugin[]` - 自定义 Rollup 插件
- `cache?: "auto" | "enable" | "disable"` - 缓存模式
- `bundle?: boolean` - 是否打包
- `onEnd?: (config: MblerConfigData) => Promise<void>` - 构建完成回调
- `onStart?: (config: MblerConfigData) => Promise<void>` - 构建开始回调
- `onWarn?: (config: MblerConfigData, warning: Error) => void` - 警告回调

---

### Types#ManifestData

清单数据接口。

```typescript
interface ManifestData {
  format_version: number;
  header: {
    name: string;
    description: string;
    uuid: string;
    version: number[];
    min_engine_version: number[];
  };
  modules: Array<{
    type: "script" | "data" | "resources";
    uuid: string;
    description?: string;
    version: number[];
    language?: string;
    entry?: string;
  }>;
  dependencies?: Array<{
    module_name: string;
    version: string;
  }>;
  subpack?: Array<{
    folder_name: string;
    name: string;
    memory_tier: number;
  }>;
  capabilities?: string[];
}
```

---

## commander

### commander#Input

工具类：提供控制台交互功能，比如高亮菜单渲染、交互式选择等。

```typescript
class Input {
  static render(arr: string[], index: number): string;
  static select<T extends Array<any>>(tip: string, arr: T): Promise<T[number]>;
  static use(task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void): void;
}
```

#### commander#Input#render

渲染菜单字符串，高亮选中项。

```typescript
static render(arr: string[], index: number): string;
```

**参数：**

- `arr: string[]` - 菜单选项数组
- `index: number` - 选中项索引

**返回值：**

- `string` - 渲染后的菜单字符串

---

#### commander#Input#select

交互式菜单选择。

```typescript
static select<T extends Array<any>>(tip: string, arr: T): Promise<T[number]>;
```

**参数：**

- `tip: string` - 提示文字
- `arr: T` - 选项数组

**返回值：**

- `Promise<T[number]>` - 选中的结果

---

#### commander#Input#use

注册全局按键回调。

```typescript
static use(task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void): void;
```

**参数：**

- `task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void` - 回调函数

**返回值：** 无

---

### commander#click

等待某个按键被按下。

```typescript
function click(
  name: string,
  options?: { ctrl?: boolean; alt?: boolean }
): Promise<void>;
```

**参数：**

- `name: string` - 按键名称（必填）
- `options?: { ctrl?: boolean; alt?: boolean }` - 按键选项

**返回值：**

- `Promise<void>` - 按键按下时 resolve

---

### commander#onEnd

注册进程退出时的回调任务。

```typescript
function onEnd(task: () => void): void;
```

**参数：**

- `task: () => void` - 退出时执行的回调函数

**返回值：** 无

---

## i18n

### i18n#default

国际化模块的默认导出。

```typescript
interface i18n extends language {
  __internal: {
    class: Lang;
    set: (newLang: "zh" | "en") => void;
  };
}
```

---

### i18n#Lang

语言管理类。

```typescript
class Lang {
  init(): void;
  set(newLang: "zh" | "en"): void;
  get(): language;
}
```

#### i18n#Lang#init

初始化语言设置。

```typescript
init(): void;
```

---

#### i18n#Lang#set

设置当前语言。

```typescript
set(newLang: "zh" | "en"): void;
```

**参数：**

- `newLang: "zh" | "en"` - 语言类型

---

#### i18n#Lang#get

获取当前语言配置。

```typescript
get(): language;
```

**返回值：**

- `language` - 当前语言配置

---

## Build (mbler/build)

### Build#build

进行一次构建。

```typescript
function build(cliParam: CliParam, work: string): Promise<number>;
```

**参数：**

- `cliParam: CliParam` - CLI 参数对象
- `work: string` - 工作目录路径

**返回值：**

- `Promise<number>` - 返回状态码，0 表示成功

---

### Build#watch

启动监听模式，文件变化时自动重新构建。

```typescript
function watch(cliParam: CliParam, work: string): Promise<number>;
```

**参数：**

- `cliParam: CliParam` - CLI 参数对象
- `work: string` - 工作目录路径

**返回值：**

- `Promise<number>` - 返回状态码，0 表示成功

---

### Build#Build

构建类，提供更细粒度的构建控制。

```typescript
class Build {
  currentConfig: MblerConfigData | null;
  srcDirs: { behavior: string; resources: string } | null;
  outdirs: { behavior: string; resources: string; dist: string } | null;
  module: "behavior" | "resources" | "all" | null;
  init: boolean;

  constructor(
    opts: Record<string, string>,
    baseBuildDir: string,
    resolve: (a: number) => void,
    isWatch?: boolean,
  );

  start(): Promise<void>;
  watch(): Promise<null | undefined>;
  getWatchers(): { rollup: any; chokidar: any } | null;
  closeWatchers(): void;
}
```

#### Build#Build#constructor

```typescript
constructor(
  opts: Record<string, string>,
  baseBuildDir: string,
  resolve: (a: number) => void,
  isWatch?: boolean,
);
```

**参数：**

- `opts: Record<string, string>` - 选项
- `baseBuildDir: string` - 基础构建目录
- `resolve: (a: number) => void` - 完成回调
- `isWatch?: boolean` - 是否监听模式

---

#### Build#Build#start

开始构建。

```typescript
start(): Promise<void>;
```

**返回值：**

- `Promise<void>` - 构建完成

---

#### Build#Build#watch

启动监听模式。

```typescript
watch(): Promise<null | undefined>;
```

**返回值：**

- `Promise<null | undefined>`

---

#### Build#Build#getWatchers

获取监听器句柄。

```typescript
getWatchers(): { rollup: any; chokidar: any } | null;
```

**返回值：**

- `{ rollup: any; chokidar: any } | null` - 监听器句柄

---

#### Build#Build#closeWatchers

关闭监听器。

```typescript
closeWatchers(): void;
```

---

### Build#McxTsc

MCX TypeScript 编译器。

```typescript
class McxTsc {
  constructor();
  transform(code: string, options?: object): string;
}
```