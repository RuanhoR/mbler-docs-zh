# MBLER API

## 使用

### 安装

```bash
npm i mbler --save
```

### 导入

```javascript
// esmodule
import * as mbl from "mbler";
```

## 总览

```javascript
require("mbler");
/* return: {
  Build: [Object: null prototype] {
    Build: [class Build],
    build: [Function: build],
    default: [class Build],
    watch: [Function: watch]
  },
  Types: [Object: null prototype] {
    LanguageNames: [ 'zh', 'en' ],
    cmdList: [
      'c',     'work',
      'help',  'h',
      'init',  'version',
      'build', 'watch',
      'lang'
    ],
    templateMblerConfig: {
      name: 'demo',
      description: 'demo',
      version: '0.0.0',
      mcVersion: '1.21.100',
      script: [Object],
      minify: false,
      outdir: [Object]
    }
  },
  cli: [AsyncFunction: cli],
  commander: [Object: null prototype] {
    Input: [class Input],
    click: [Function: click],
    onEnd: [Function: onEnd]
  },
  i18n: [Object: null prototype] { default: {} }
}*/
```

## API

### cli

运行一个cli服务，解析当前cli参数  
直接调用，无参数

```typescript
function cli(): Promise<void>;
```

---

### Build

为手动控制内部构建的api，你可以使用这个api进行封装你的应用程序中对构建的处理

#### build

进行一次构建，需要参数

```typescript
function build(cliParam: CliParam, work: string): Promise<number>;
```

**参数：**

- `cliParam: CliParam` - CLI参数对象
- `work: string` - 工作目录路径

**返回值：**

- `Promise<number>` - 返回状态码，0表示成功

#### watch

启动监听模式，文件变化时自动重新构建

```typescript
function watch(cliParam: CliParam, work: string): Promise<number>;
```

**参数：**

- `cliParam: CliParam` - CLI参数对象
- `work: string` - 工作目录路径

**返回值：**

- `Promise<number>` - 返回状态码，0表示成功

#### Build 类

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

  // 开始构建
  start(): Promise<void>;

  // 启动监听模式
  watch(): Promise<null | undefined>;

  // 获取监听器句柄
  getWatchers(): {
    rollup: rollup.RollupWatcher;
    chokidar: ReturnType<typeof watch$1>;
  } | null;

  // 关闭监听器
  closeWatchers(): void;
}
```

**属性：**
| 属性 | 类型 | 说明 |
|------|------|------|
| `currentConfig` | `MblerConfigData \| null` | 当前配置 |
| `srcDirs` | `{ behavior: string; resources: string } \| null` | 源目录 |
| `outdirs` | `{ behavior: string; resources: string; dist: string } \| null` | 输出目录 |
| `module` | `'behavior' \| 'resources' \| 'all' \| null` | 当前模块类型 |
| `init` | `boolean` | 初始化状态 |

**方法：**
| 方法 | 说明 |
|------|------|
| `start()` | 开始构建 |
| `watch()` | 启动监听模式 |
| `getWatchers()` | 获取监听器句柄 |
| `closeWatchers()` | 关闭监听器 |

---

### Types

类型定义模块

#### CliParam

CLI参数接口

```typescript
interface CliParam {
  params: string[];
  opts: Record<string, string>;
}
```

**属性：**
| 属性 | 类型 | 说明 |
|------|------|------|
| `params` | `string[]` | 命令行参数数组 |
| `opts` | `Record<string, string>` | 选项键值对 |

#### MblerConfigData

配置文件数据接口

```typescript
interface MblerConfigData {
  name: string;
  description: string;
  version: string;
  mcVersion: string | string[];
  outdir?: MblerConfigOutdir;
  script?: MblerConfigScript;
  minify?: boolean;
}
```

**属性：**
| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 项目名称 |
| `description` | `string` | 是 | 项目描述 |
| `version` | `string` | 是 | 项目版本 |
| `mcVersion` | `string \| string[]` | 是 | Minecraft版本 |
| `outdir` | `MblerConfigOutdir` | 否 | 输出目录配置 |
| `script` | `MblerConfigScript` | 否 | 脚本配置 |
| `minify` | `boolean` | 否 | 是否压缩代码 |

#### MblerConfigOutdir

输出目录配置接口

```typescript
interface MblerConfigOutdir {
  behavior?: string;
  resources?: string;
  dist: string;
}
```

**属性：**
| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `behavior` | `string` | 否 | 行为包输出目录 |
| `resources` | `string` | 否 | 资源包输出目录 |
| `dist` | `string` | 是 | 主输出目录 |

#### MblerConfigScript

脚本配置接口

```typescript
interface MblerConfigScript {
  main: string;
  ui?: boolean;
  lang?: "ts" | "mcx" | "js";
  UseBeta?: boolean;
}
```

**属性：**
| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `main` | `string` | 是 | 入口文件 |
| `ui` | `boolean` | 否 | 是否启用UI |
| `lang` | `'ts' \| 'mcx' \| 'js'` | 否 | 脚本语言类型 |
| `UseBeta` | `boolean` | 否 | 是否使用Beta API |

#### ManifestData

清单数据接口

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

**属性：**
| 属性 | 类型 | 说明 |
|------|------|------|
| `format_version` | `number` | 格式版本 |
| `header` | `object` | 清单头部信息 |
| `modules` | `array` | 模块列表 |
| `dependencies` | `array` | 依赖列表 |
| `subpack` | `array` | 子包配置 |
| `capabilities` | `string[]` | 能力列表 |

#### language

语言配置接口

```typescript
interface language {
  description: string;
  help: {
    [K in (typeof cmdList)[number] | "cmds"]: string | readonly string[];
  };
  default: {
    unexpected: string;
    youis: string;
  };
  workdir: {
    set: string;
    nfound: string;
  };
  init: {
    initDes: string;
    name: string;
    description: string;
    useGIT: string;
    useUI: string;
    lang: string;
    betaApi: string;
    mcVersion: string;
    noName: string;
    noMCVersion: string;
    noLanguare: string;
  };
}
```

#### npmFetchData

NPM包信息接口

```typescript
interface npmFetchData {
  name: string;
  "dist-tags": Record<string, string>;
  versions: Record<
    string,
    {
      maintainers: { name: string; mail: string }[];
      dist: { shasum: string; tarball: string };
      author: { name: string; mail: string };
      license: string;
      version: string;
    }
  >;
  readme: string;
  keywords: string[];
  homepage: string;
  time: Record<string, string>;
}
```

#### 常量

**LanguageNames**

```typescript
const LanguageNames: ["zh", "en"];
```

支持的语言名称列表

**cmdList**

```typescript
const cmdList: readonly [
  "c",
  "work",
  "help",
  "h",
  "init",
  "version",
  "build",
  "watch",
  "lang",
];
```

可用命令列表

**templateMblerConfig**

```typescript
const templateMblerConfig: MblerConfigData = {
  name: 'demo',
  description: 'demo',
  version: '0.0.0',
  mcVersion: '1.21.100',
  script: { ... },
  minify: false,
  outdir: { ... }
}
```

默认配置模板

---

### commander

控制台交互模块

#### Input 类

工具类：提供控制台交互功能，比如高亮菜单渲染、交互式选择等

```typescript
class Input {
  // 渲染菜单，高亮选中项
  static render(arr: string[], index: number): string;

  // 交互式菜单选择器
  static select<T extends Array<any>>(tip: string, arr: T): Promise<T[number]>;

  // 注册全局按键回调
  static use(
    task: (name: string, ctrl: boolean, alt: boolean, raw: string) => void,
  ): void;
}
```

**静态方法：**
| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `render` | `arr: string[]`, `index: number` | `string` | 渲染菜单字符串，高亮选中项 |
| `select` | `tip: string`, `arr: T` | `Promise<T[number]>` | 交互式菜单选择 |
| `use` | `task: Function` | `void` | 注册按键回调 |

#### click

等待某个按键被按下

```typescript
function click(
  name: string,
  options?: { ctrl?: boolean; alt?: boolean },
): Promise<void>;
```

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | 是 | 按键名称 |
| `options.ctrl` | `boolean` | 否 | 是否需要Ctrl组合键 |
| `options.alt` | `boolean` | 否 | 是否需要Alt组合键 |

**返回值：**

- `Promise<void>` - 按键按下时resolve

#### onEnd

注册进程退出时的回调任务

```typescript
function onEnd(task: () => void): void;
```

**参数：**

- `task: () => void` - 退出时执行的回调函数

---

### i18n

国际化模块

```typescript
interface i18n extends language {
  __internal: {
    class: Lang;
    set: (newLang: "zh" | "en") => void;
  };
}
```

**Lang 类方法：**
| 方法 | 说明 |
|------|------|
| `init()` | 初始化语言设置 |
| `set(newLang)` | 设置当前语言 |
| `get()` | 获取当前语言配置 |
