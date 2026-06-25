# mcx 内部

## 架构

MCX 生态系统由以下 npm 包组成：

| 包名 | 说明 |
|------|------|
| `@mbler/mcx-core` | 核心编译器：解析 `.mcx` 文件，转换为 JavaScript，提供 Rollup/Rolldown 插件 |
| `@mbler/mcx` | 运行时框架：`createApp`、`Event`、`ui` 类，用于 Minecraft Script API |
| `@mbler/mcx-types` | MCX 项目的 TypeScript 类型声明 |
| `@mbler/mcx-component` | 组件构建器类：`ItemComponent`、`BlockComponent`、`EntityComponent`、图片组件 |
| `create-mbler` | CLI 脚手架工具 (`npm create mbler`) |

## 安装

```bash
npm install @mbler/mcx-core --save
```

## 导出

```javascript
import {
  PubType,           // 内部类型命名空间
  AST,               // { tag: McxAst, prop: PropParser }
  compiler,          // CompileJS, CompileMCX, CompileError, compileJSFn, compileMCXFn, MCXNodeUtils
  utils,             // Utils 类（默认导出，静态方法）
  transform,         // 将 MCX 转换为 JavaScript
  compile_component, // compileComponent, RunScript, FilePoint 辅助函数
  rollupPlugin,      // Rollup 插件工厂
  rolldownPlugin,    // Rolldown 插件工厂
  // 组件类（从 @mbler/mcx-component 重新导出）：
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  ComponentType,     // 命名空间：组件类型定义
} from "@mbler/mcx-core";
```

## API

## AST

内部 AST 生成。

### AST#tag (McxAst)

MCX AST 解析器类。

```typescript
class McxAst {
  constructor(text: string, includeComments?: boolean);
  parseAST(): ParsedTagNode[];
  data: ParsedTagNode[];
  static generateCode(node: ParsedTagNode): string;
}
```

#### McxAst 构造函数

```typescript
constructor(text: string, includeComments?: boolean);
```

**参数：**
- `text: string` - 要解析的 MCX 文本
- `includeComments?: boolean` - 是否在 AST 中包含注释节点

---

#### McxAst parseAST

将 MCX 文本解析为带行号的 AST。

```typescript
parseAST(): ParsedTagNode[];
```

**返回值：**
- `ParsedTagNode[]` - 解析后的 AST 节点数组

---

#### McxAst generateCode

生成代码字符串（递归处理 content 数组）。

```typescript
static generateCode(node: ParsedTagNode): string;
```

**参数：**
- `node: ParsedTagNode` - 要生成代码的 AST 节点

**返回值：**
- `string` - 生成的代码字符串

---

### AST#prop (PropParser)

属性解析器函数。

```typescript
function PropParser(code: string): PropNode[];
```

**参数：**
- `code: string` - 要解析的属性代码

**返回值：**
- `PropNode[]` - 解析后的属性节点数组

---

## Compiler

### Compiler#CompileError

编译错误类。

```typescript
class CompileError extends Error {
  loc: { line: number; column: number };
  constructor(message: string, loc: { line: number; column: number });
}
```

**属性：**
- `loc: { line: number; column: number }` - 错误位置（行和列）

**参数：**
- `message: string` - 错误消息
- `loc: { line: number; column: number }` - 错误位置

---

### Compiler#compileMCXFn

将 MCX 源文件转成构建 IR。

```typescript
function compileMCXFn(mcxCode: string): MCXCompileData;
```

**参数：**
- `mcxCode: string` - MCX 源代码

**返回值：**
- `MCXCompileData` - 编译后的数据（原始 AST + JS IR + 结构位置）

---

### Compiler#compileJSFn

编译 JavaScript/TypeScript 代码。

```typescript
function compileJSFn(jsCode: string): JsCompileData;
```

**参数：**
- `jsCode: string` - JavaScript 代码

**返回值：**
- `JsCompileData` - 编译后的 JS 数据，含导入/导出重组

---

### Compiler#CompileJS

将 Babel `t.Program` 转换为 `JsCompileData` 的类。

```typescript
class CompileJS {
  constructor(node: t.Program);
  TopContext: Context;
  run(): void;
  getCompileData(): JsCompileData;
}
```

---

### Compiler#CompileMCX

解析 MCX 源并生成 `MCXCompileData` 的类。

```typescript
class CompileMCX {
  constructor(code: string);
  getCompileData(): MCXCompileData;
}
```

---

### Compiler#MCXNodeUtils

从编译器模块重新导出的工具函数。

```typescript
namespace MCXNodeUtils {
  function ImportToCache(node: t.ImportDeclaration): ImportList;
}
```

---

### rollupPlugin

创建用于 `.mcx` 和 `.ts` 文件转换的 Rollup 插件。

```typescript
function rollupPlugin(
  opt: CompileOpt,
  output: { behavior: string; resources: string; dist: string }
): Plugin;
```

**参数：**
- `opt: CompileOpt` - 编译选项（moduleDir, tsconfigPath, sourcemap 等）
- `output` - 输出目录对象

**返回值：**
- `Plugin` - Rollup 插件实例

---

### rolldownPlugin

创建用于 `.mcx` 和 `.ts` 文件转换的 Rolldown 插件。

```typescript
function rolldownPlugin(
  opt: CompileOpt,
  output: { behavior: string; resources: string; dist: string }
): RolldownPlugin;
```

**参数：**
- `opt: CompileOpt` - 编译选项
- `output` - 输出目录对象

**返回值：**
- `RolldownPlugin` - Rolldown 插件实例

---

### transform

将 MCX 转换为 JavaScript。

```typescript
async function transform(
  code: MCXCompileData,
  cache: Map<string, MCXCompileData>,
  id: string,
  context: TransformPluginContext,
  opt: CompileOpt,
  output: { behavior: string; resources: string; dist: string }
): Promise<string>;
```

**参数：**
- `code: MCXCompileData` - 编译后的 MCX 数据
- `cache: Map<string, MCXCompileData>` - 编译缓存
- `id: string` - 文件 ID
- `context: TransformPluginContext` - Rollup 转换上下文
- `opt: CompileOpt` - 编译选项
- `output` - 输出目录

**返回值：**
- `Promise<string>` - 转换后的 JavaScript 代码

---

### Utils

工具类，提供文件系统操作和类型验证等功能。

```typescript
class Utils {
  static FileExist(path: string): Promise<boolean>;
  static readFile(filePath: string, opt?: ReadFileOpt): Promise<string | object>;
  static sleep(time: number): Promise<void>;
  static TypeVerify(obj: any, types: TypeVerifyBody): boolean;
  static AbsoluteJoin(baseDir: string, inputPath: string): string;
}
```

#### Utils#FileExist

检查文件是否存在。

```typescript
static FileExist(path: string): Promise<boolean>;
```

**参数：**
- `path: string` - 文件路径

**返回值：**
- `Promise<boolean>` - 文件是否存在

---

#### Utils#readFile

读取文件内容，支持返回 string 或 object，带重试机制。

```typescript
static readFile(
  filePath: string,
  opt?: ReadFileOpt
): Promise<string | object>;
```

**参数：**
- `filePath: string` - 文件路径
- `opt?: ReadFileOpt` - 配置选项
  - `delay?: number` - 重试延迟（默认 200ms）
  - `maxRetries?: number` - 最大重试次数（默认 3）
  - `want?: 'string' | 'object'` - 返回类型（默认 'string'）

**返回值：**
- `Promise<string | object>` - 文件内容

---

#### Utils#sleep

延迟执行。

```typescript
static sleep(time: number): Promise<void>;
```

**参数：**
- `time: number` - 延迟时间（毫秒）

**返回值：**
- `Promise<void>`

---

#### Utils#TypeVerify

在运行时进行对象类型验证。

```typescript
static TypeVerify(obj: any, types: TypeVerifyBody): boolean;
```

**参数：**
- `obj: any` - 要验证的对象
- `types: TypeVerifyBody` - 类型定义，如 `{ name: 'string', age: 'number' }`

**返回值：**
- `boolean` - 是否通过验证

---

#### Utils#AbsoluteJoin

拼接路径，如果是绝对路径则直接返回，否则与基础目录拼接。

```typescript
static AbsoluteJoin(baseDir: string, inputPath: string): string;
```

**参数：**
- `baseDir: string` - 基础目录
- `inputPath: string` - 输入路径

**返回值：**
- `string` - 绝对路径

---

## 组件类

组件构建器类（`ItemComponent`、`BlockComponent`、`EntityComponent`）定义在 `@mbler/mcx-component` 中，并由 `@mbler/mcx-core` 重新导出。它们在编译时在 VM 沙箱中实例化，以生成 Minecraft JSON 组件文件。

### ItemComponent

用于创建物品 JSON 组件。

#### 构造函数参数

```typescript
interface ItemComponentOptions {
  format: string;      // 格式版本，如 "1.21.100"
  name: string;        // 物品显示名称
  id: string;          // 物品唯一标识符，如 "namespace:item_id"
  components?: ItemComponents; // 可选组件配置
}
```

#### 实例方法

| 方法 | 说明 |
|------|------|
| `toJSON()` | 生成最终的 JSON 对象 |
| `setName(newValue: string)` | 设置物品显示名称 |
| `setIcon(newValue: string)` | 设置物品图标纹理 |
| `getName()` | 获取物品显示名称 |
| `setId(newValue: string)` | 设置物品唯一标识符 |
| `getId()` | 获取物品唯一标识符 |
| `setAllowOffHand(vl: boolean)` | 设置是否允许放置在副手 |
| `setBlockPlacer(config)` | 设置方块放置器组件 |
| `setCooldown(config)` | 设置冷却组件 |
| `setCompostable(config)` | 设置堆肥组件 |
| `setBundleInteraction(config)` | 设置 bundles 交互组件 |
| `setGlint(value: boolean)` | 设置闪光效果 |
| `setHandEquipped(value: boolean)` | 设置手持装备 |
| `setDigger(config)` | 设置挖掘组件 |
| `setDamageAbsorption(config)` | 设置伤害吸收组件 |
| `setDurability(config)` | 设置耐久度组件 |
| `setDurabilitySensor(config)` | 设置耐久度传感器 |
| `setDyeable(config)` | 设置可染色组件 |
| `setEnchantable(config)` | 设置可附魔组件 |
| `setFood(config)` | 设置食物组件 |
| `setFireResistant(config)` | 设置防火组件 |
| `setEntityPlacer(config)` | 设置实体放置器 |
| `setFuel(config)` | 设置燃料组件 |
| `setKineticWeapon(config)` | 设置动能武器组件 |
| `setInteractButton(config)` | 设置交互按钮 |
| `setHoverTextColor(config)` | 设置悬浮文本颜色 |
| `setLiquidClipped(config)` | 设置液体剪切 |
| `setMaxStackSize(config)` | 设置最大堆叠数量 |
| `setPiercingWeapon(config)` | 设置穿刺武器组件 |
| `setProjectile(config)` | 设置投射物组件 |
| `setRecord(config)` | 设置唱片组件 |
| `setRarity(config)` | 设置稀有度 |
| `setRepairable(config)` | 设置可修复组件 |
| `setSeed(config)` | 设置种子组件 |
| `setStackedByData(config)` | 设置数据堆叠 |
| `setShouldDespawn(config)` | 设置消失时间 |
| `setShooter(config)` | 设置射击者组件 |
| `setStorageWeightModifier(config)` | 设置存储权重修饰符 |
| `setStorageWeightLimit(config)` | 设置存储权重限制 |
| `setStorageItem(config)` | 设置存储物品组件 |
| `setThrowable(config)` | 设置投掷物组件 |
| `setTags(tags: string[])` | 设置标签 |
| `setSwingDuration(duration: number)` | 设置摆动持续时间 |
| `setUseAnimation(animation)` | 设置使用动画 |
| `setWearable(config)` | 设置可穿戴组件 |
| `setUseModifiers(config)` | 设置使用修饰符 |

#### 使用示例

```typescript
import { ItemComponent } from "@mbler/mcx-core";

const itemComponent = new ItemComponent({
  format: "1.21.100",
  name: "Demo Item",
  id: "mcx_demo:demo_item"
});

itemComponent.setAllowOffHand(true);
itemComponent.setMaxStackSize(64);
itemComponent.setIcon("textures/items/demo");

const json = itemComponent.toJSON();
```

---

### BlockComponent

用于创建方块 JSON 组件。

#### 构造函数参数

```typescript
interface BlockComponentOptions {
  format: string;      // 格式版本
  name: string;        // 方块显示名称
  id: string;          // 方块唯一标识符
}
```

#### 实例方法

| 方法 | 说明 |
|------|------|
| `toJSON()` | 生成最终的 JSON 对象 |
| `setBlockHardness(hardness: number)` | 设置方块硬度 |
| `setBlockExplosionResistance(resistance: number)` | 设置爆炸抗性 |
| `setFriction(friction: number)` | 设置摩擦系数 |
| `setEmissive(emissive: boolean)` | 设置自发光 |
| `addComponent(name: string, value: any)` | 添加自定义组件 |

#### 使用示例

```typescript
import { BlockComponent } from "@mbler/mcx-core";

const blockComponent = new BlockComponent({
  format: "1.21.100",
  name: "Demo Block",
  id: "mcx_demo:demo_block"
});

blockComponent.setBlockHardness(1.5);
blockComponent.setBlockExplosionResistance(3.0);
blockComponent.setEmissive(true);

const json = blockComponent.toJSON();
```

---

### EntityComponent

用于创建实体 JSON 组件。

#### 构造函数参数

```typescript
interface EntityComponentOptions {
  format: string;      // 格式版本
  name: string;        // 实体显示名称
  id: string;          // 实体唯一标识符
}
```

#### 实例方法（部分）

| 方法 | 说明 |
|------|------|
| `toJSON()` | 生成最终的 JSON 对象 |
| `setId(newValue: string)` | 设置实体唯一标识符 |
| `setFormat(newValue: string)` | 设置格式版本 |
| `setIsSpawnable(value: boolean)` | 设置是否可生成 |
| `setIsSummonable(value: boolean)` | 设置是否可召唤 |
| `setAddrider(config)` | 设置骑乘组件 |
| `setAdmireItem(config)` | 设置欣赏物品组件 |
| `setAgeable(config)` | 设置可成长组件 |
| `setAngerLevel(config)` | 设置愤怒等级 |
| `setAngry(config)` | 设置愤怒组件 |
| `setAnnotationBreakDoor(config)` | 设置破门注释 |
| `setAnnotationOpenDoor()` | 设置开门注释 |
| `setAttack(config)` | 设置攻击组件 |
| `setAreaAttack(config)` | 设置区域攻击组件 |
| `setAttackCooldown(config)` | 设置攻击冷却 |
| `setBalloonable(config)` | 设置气球组件 |
| `setBarter(config)` | 设置交易组件 |
| `setBlockClimber()` | 设置方块攀爬 |
| `setBlockSensor(config)` | 设置方块传感器 |
| `setBoostable(config)` | 设置可加速组件 |
| `setBoss(config)` | 设置 Boss 组件 |
| `setBreakBlocks(config)` | 设置破坏方块 |
| `setBreathable(config)` | 设置呼吸组件 |
| `setBribeable(config)` | 设置可贿赂组件 |
| `setBreedable(config)` | 设置可繁殖组件 |
| `setBuoyant(config)` | 设置浮力组件 |
| `setBurnsInDaylight(config)` | 设置日光燃烧 |
| `setCannotBeAttacked()` | 设置不可攻击 |
| `setCanClimb()` | 设置可攀爬 |
| `setCanFly()` | 设置可飞行 |
| `setCanJoinRaid()` | 设置可参与突袭 |
| `setCanPowerJump()` | 设置可强力跳跃 |
| `setCollisionBox(config)` | 设置碰撞箱 |
| `setColor(config)` | 设置颜色 |
| `setColor2(config)` | 设置第二种颜色 |
| `setDespawn(config)` | 设置消失组件 |
| `setEconomyTradeTable(config)` | 设置经济交易表 |
| `setEnvironmentSensor(config)` | 设置环境传感器 |
| `setEquipment(config)` | 设置装备组件 |
| `setExplode(config)` | 设置爆炸组件 |
| `setFloating(config)` | 设置漂浮组件 |
| `setFollower(config)` | 设置跟随组件 |
| `setHealth(config)` | 设置生命值组件 |
| `setHerding(config)` | 设置牧群组件 |
| `setHome(config)` | 设置家组件 |
| `setHurtOnCondition(config)` | 设置条件受伤 |
| `setInertia(config)` | 设置惯性组件 |
| `setInventory(config)` | 设置物品栏 |
| `setJumpDynamic(config)` | 设置动态跳跃 |
| `setLeashable(config)` | 设置可牵引 |
| `setLookAtPlayer(config)` | 设置看向玩家 |
| `setManaged(config)` | 设置管理组件 |
| `setMountTaming(config)` | 设置骑乘驯化 |
| `setNavFly(config)` | 设置飞行导航 |
| `setNavGoal(config)` | 设置导航目标 |
| `setProjectile(config)` | 设置投射物 |
| `setRiderRotates(config)` | 设置骑乘者旋转 |
| `setScale(config)` | 设置缩放 |
| `setSchedule(config)` | 设置计划任务 |
| `setSensors(config)` | 设置传感器 |
| `setSkinSettings(config)` | 设置皮肤设置 |
| `setSoulSpeed(config)` | 设置灵魂速度 |
| `setSpawnEntity(config)` | 设置生成实体 |
| `setSwell(config)` | 设置膨胀组件 |
| `setTameable(config)` | 设置可驯化 |
| `setTeleport(config)` | 设置传送组件 |
| `setTickWorld(config)` | 设置世界 Tick |
| `setTrail(config)` | 设置痕迹 |
| `setVariant(config)` | 设置变体 |
| `setWalkTowards(config)` | 设置行走目标 |

#### 常用方法

| 方法 | 说明 |
|------|------|
| `setAirborne(isAirborne: boolean)` | 设置是否为空中生物 |
| `setCanFly(canFly: boolean)` | 设置是否可以飞行 |
| `setCanSwim(canSwim: boolean)` | 设置是否可以游泳 |
| `setHealth(health: number)` | 设置生命值 |
| `setMovementSpeed(speed: number)` | 设置移动速度 |
| `addComponent(name: string, value: any)` | 添加自定义组件 |

#### 使用示例

```typescript
import { EntityComponent } from "@mbler/mcx-core";

const entityComponent = new EntityComponent({
  format: "1.21.100",
  name: "Demo Entity",
  id: "mcx_demo:demo_entity"
});

entityComponent.setCanFly(true);
entityComponent.setHealth({ value: 20, max: 20 });

const json = entityComponent.toJSON();
```

---

### ImageComponent

用于创建图像组件（PNG、JPG、SVG、GIF）。

#### 基本用法

```typescript
import {
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent
} from "@mbler/mcx-core";

// PNG 图片
const pngImage = new PNGImageComponent("./textures/item/demo.png");

// JPG 图片
const jpgImage = new JPGImageComponent("./textures/item/demo.jpg");

// SVG 图片
const svgImage = new SVGImageComponent("./textures/item/demo.svg");

// GIF 图片
const gifImage = new GIFImageComponent("./textures/item/demo.gif");
```

#### 图像组件类型说明

| 类名 | 支持格式 | 说明 |
|------|----------|------|
| `PNGImageComponent` | `.png` | PNG 图像，适合图标和透明图像 |
| `JPGImageComponent` | `.jpg`, `.jpeg` | JPEG 图像，适合照片 |
| `SVGImageComponent` | `.svg`, `.xml` | SVG 矢量图像 |
| `GIFImageComponent` | `.gif` | GIF 动画图像 |

---

### ComponentType

类型导出命名空间，提供组件的类型定义。

```typescript
import { ComponentType } from "@mbler/mcx-core";
// ComponentType.ItemComponentOptions
// ComponentType.BlockComponentOptions
// ComponentType.EntityComponentOptions
// ComponentType.SoundEvent, ParticleType, EnchantableSlot, Rarity 等
```

---

## PubType

内部类型定义命名空间。

```typescript
import { PubType } from "@mbler/mcx-core";
// PubType.Token, PubType.ParsedTagNode, PubType.PropNode, PubType.transformCtx 等
```

---

## compile_component

内部组件编译命名空间。

```typescript
import { compile_component } from "@mbler/mcx-core";

compile_component.compileComponent(compiledCode, ctx): Promise<void>;
compile_component.clearCachedOptions(): void;
compile_component.resolveFilePoint(point, ctx, sourceIsMcxCore?): string;
compile_component.execEdit(option, ctx, isMcxCoreSource?): Promise<void>;
compile_component.generateItemTextureJson(output): Promise<void>;
compile_component.RunScript; // 类：在 Node.js VM 沙箱中运行 JS
compile_component.execESMMethod; // 枚举：transformCjs | runInVm | importESM
compile_component.transformESMToCJS(code: string): string;
```

---

## @mbler/mcx-component

`@mbler/mcx-component` 包提供组件构建器类。它是 `@mbler/mcx-core` 的依赖，其导出通过 `@mbler/mcx-core` 重新导出。

### 安装

```bash
npm install @mbler/mcx-component
```

### 导出

```typescript
import {
  ItemComponent,
  BlockComponent,
  EntityComponent,
  PNGImageComponent,
  JPGImageComponent,
  SVGImageComponent,
  GIFImageComponent,
  compareVar,  // 语义版本比较
} from "@mbler/mcx-component";
```

### 枚举

| 导出 | 说明 |
|------|------|
| `SoundEventEnum` | 所有 Minecraft 声音事件字符串 |
| `ParticleTypeEnum` | 所有粒子类型字符串 |
| `EnchantableSlotEnum` / `EnchantableSlotArray` | 所有附魔槽位字符串 |

### 文件编辑辅助函数

```typescript
import { createFileEdit } from "@mbler/mcx-component";
const edit = createFileEdit<MyType>({ /* 表达式 */ });
```

---

## create-mbler

`create-mbler` 包为新的 mbler 项目提供 CLI 脚手架工具。

### 使用

```bash
npm create mbler [dir] -- --language [zh|en]
```

### API

```typescript
import { cli, getI18n } from "create-mbler";

cli(): void;  // 运行脚手架
getI18n(key: I18nKey, language: Language): string;
```
