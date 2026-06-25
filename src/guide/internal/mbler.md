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
  McxTsc: [Function: McxTsc],
  Sapi: [Module],
  BuildCacheManager: [class BuildCacheManager],
  Progress: [class Progress],
  generateRelease: [Function: generateRelease],
  terserPlugin: [Function: terserPlugin],
  esbuildPlugin: [Function: esbuildPlugin],
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
  "login", "profile", "view", "config", "log"
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
  mcVersion: string;
  outdir?: MblerConfigOutdir;
  script?: MblerConfigScript;
  minify?: 'oxc' | 'terser' | 'esbuild';
  build?: Partial<MblerBuildConfig>;
}
```

**属性：**
- `name: string` - 包名（必填），用于 UUID 生成和 MNX 发布
- `displayName?: string` - 可选，在 manifest.json 中显示的名称；未设置时回退使用 `name`
- `description: string` - 项目描述（必填）
- `version: string` - 项目版本（必填）
- `mcVersion: string` - Minecraft 版本（必填）
- `outdir?: MblerConfigOutdir` - 输出目录配置
- `script?: MblerConfigScript` - 脚本配置
- `minify?: 'oxc' | 'terser' | 'esbuild'` - 压缩引擎（默认：'oxc'）
- `build?: Partial<MblerBuildConfig>` - 构建配置

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
  rollupPlugins: Plugin[];
  rollupExternal: string[];
  cache: 'none' | 'memory' | 'file' | 'filesystem' | 'auto';
  cachePath: string;
  bundle: boolean;
  clean?: boolean;
  outputDir: string;
  outputFilename: string;
  onEnd: (ctx: MblerConfigData) => void | Promise<void>;
  onStart: (ctx: MblerConfigData) => void | Promise<void>;
  onWarn: (ctx: MblerConfigData, warning: Error) => void | Promise<void>;
}
```

**属性：**

- `rollupPlugins: Plugin[]` - 自定义 Rollup 插件
- `rollupExternal: string[]` - 额外外部模块
- `cache: 'none' | 'memory' | 'file' | 'filesystem' | 'auto'` - 缓存模式
- `cachePath: string` - 缓存文件路径
- `bundle: boolean` - 是否通过 Rollup 打包脚本（默认：true）
- `clean?: boolean` - 构建前清理输出目录（默认：true）
- `outputDir: string` - 输出子目录（默认：'scripts'）
- `outputFilename: string` - 强制输出文件名
- `onEnd: (ctx: MblerConfigData) => void | Promise<void>` - 构建完成回调
- `onStart: (ctx: MblerConfigData) => void | Promise<void>` - 构建开始回调
- `onWarn: (ctx: MblerConfigData, warning: Error) => void | Promise<void>` - 警告回调

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
  currentLang: "zh" | "en";
  init(): void;
  set(newLang: "zh" | "en"): boolean;
  get(): language;
}
```

#### i18n#Lang#init

初始化语言设置（从 `~/.cache/mbler/lang.db` 读取）。

```typescript
init(): void;
```

---

#### i18n#Lang#set

设置当前语言。

```typescript
set(newLang: "zh" | "en"): boolean;
```

**参数：**

- `newLang: "zh" | "en"` - 语言类型

**返回值：**

- `boolean` - 是否设置成功

---

#### i18n#Lang#get

获取当前语言配置。

```typescript
get(): language;
```

**返回值：**

- `language` - 当前语言配置

---

## Logger

日志写入 `~/.cache/mbler/latest.log`。

```typescript
class Logger {
  static i(tag: string, msg: string): void;  // INFO
  static w(tag: string, msg: string): void;  // WARN
  static e(tag: string, msg: string): void;  // ERROR
  static d(tag: string, msg: string): void;  // DEBUG
  static LogFile: string;                     // 当前日志文件路径
}
```

---

## UUID

确定性 UUID 生成。

```typescript
import { fromString } from "mbler"; // 或 from "mbler/uuid"

function fromString(input: string, salt?: string): string;
```

**参数：**

- `input: string` - 输入字符串
- `salt?: string` - 可选盐值

**返回值：**

- `string` - 确定性 UUID v4

---

## 工具函数

从主入口导出的工具函数。

```typescript
function ReadProjectMblerConfig(project: string): Promise<MblerConfigData>;
function readFileAsJson<T>(filePath: string): Promise<T>;
function writeJSON(filePath: string, data: unknown): Promise<void>;
function showText(text: string, needNextLine?: boolean): void;
function input(tip?: string, show?: boolean): Promise<string>;
function fileExists(file: string): Promise<boolean>;
function findReadme(dir: string): Promise<string | null>;
function join(baseDir: string, inputPath: string): string;
function stringToNumberArray(str: string): [number, number, number];
function compareVersion(a: string, b: string): number;
function isValidVersion(version: string): boolean;
function runCommand(param: string[], cwd: string, stdio: string): Promise<{ code: number | null; data: string }>;
function sleep(time: number): Promise<void>;
```

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

MCX TypeScript 编译器（基于 Volar）。

```typescript
function McxTsc(tscpath?: string): void;
```

**参数：**

- `tscpath?: string` - TypeScript 的 tsc.js 路径（默认：`require.resolve('typescript/lib/tsc')`）

**说明：**
运行带有 MCX 语言支持的 TypeScript 编译器，为 `.mcx` 文件和图片导入提供类型检查。

---

### Build#Sapi

SAPI 版本解析器 — 从 npm 获取 `@minecraft/server` 版本映射。

```typescript
namespace Sapi {
  function refresh(): Promise<void>;
  function generateVersion(
    module: string,
    mcVersion: string,
    isBeta: boolean,
    withFull: boolean
  ): string;
}
```

---

### Build#BuildCacheManager

增量构建的缓存管理器。

```typescript
class BuildCacheManager {
  constructor(baseDir: string, mode?: string, isWatch?: boolean, cachePath?: string);
  getMode(): string;
  shouldUseIncrementalBuild(): boolean;
}
```

---

### Build#Progress

进度条显示。

```typescript
class Progress {
  constructor(max: number);
  update(current: number): void;
}
```

---

### Build#terserPlugin

terser 压缩的 Rollup 插件（需要在项目中安装 `terser`）。

```typescript
function terserPlugin(baseDir: string): Plugin;
```

---

### Build#esbuildPlugin

esbuild 压缩的 Rollup 插件（需要在项目中安装 `esbuild`）。

```typescript
function esbuildPlugin(baseDir: string): Plugin;
```

---

### Build#generateRelease

将输出目录压缩为 `.mcaddon` 文件。

```typescript
function generateRelease(build: {
  outdirs: { behavior: string; resources: string; dist: string };
  module: 'behavior' | 'resources' | 'all';
}): Promise<void>;
```
