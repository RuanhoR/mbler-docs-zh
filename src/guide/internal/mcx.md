# mcx 内部

## 架构
```
 mcx
   | mcx-core
   | mcx-types
   | mcx-client
```
 - mcx-client: 运行时框架
 - mcx-types: ts 类型包
 - mcx-core: 核心编译器

## mcx-core 提供的 API
安装
```bash
npm install @mbler/mcx-core --save
```

## API

## AST

内部 AST 生成。

### AST McxAst

MCX AST 解析器类。

```typescript
class McxAst {
  constructor(text: string);
  parseAST(): ParsedTagNode[];
  static generateCode(node: ParsedTagNode): string;
}
```

#### AST McxAst constructor

```typescript
constructor(text: string);
```

**参数：**
- `text: string` - 要解析的 MCX 文本

---

#### AST McxAst parseAST

将 MCX 文本解析为带行号的 AST。

```typescript
parseAST(): ParsedTagNode[];
```

**返回值：**
- `ParsedTagNode[]` - 解析后的 AST 节点数组

---

#### AST McxAst generateCode

生成代码字符串（递归处理 content 数组）。

```typescript
static generateCode(node: ParsedTagNode): string;
```

**参数：**
- `node: ParsedTagNode` - 要生成代码的 AST 节点

**返回值：**
- `string` - 生成的代码字符串

---

### AST prop

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

### Compiler CompileError

编译错误类。

```typescript
class CompileError extends Error {
  loc: { line: number; pos: number };
  constructor(message: string, loc: { line: number; pos: number });
}
```

**属性：**
- `loc: { line: number; pos: number }` - 错误位置

**参数：**
- `message: string` - 错误消息
- `loc: { line: number; pos: number }` - 错误位置

---

### Compiler#compileMCXFn

将 MCX 源文件转成构建 IR。

```typescript
function compileMCXFn(mcxCode: string): MCXCompileData;
```

**参数：**
- `mcxCode: string` - MCX 源代码

**返回值：**
- `MCXCompileData` - 编译后的数据

---

### Compiler#compileJSFn

编译 JavaScript 代码。

```typescript
function compileJSFn(jsCode: string): JsCompileData;
```

**参数：**
- `jsCode: string` - JavaScript 代码

**返回值：**
- `JsCompileData` - 编译后的 JS 数据

---

### plugin

生成 Rollup 语言扩展。

```typescript
function mcxPlugin(options: CompileOpt): Plugin;
```

**参数：**
- `options: CompileOpt` - 编译选项

**返回值：**
- `Plugin` - Rollup 插件

---

### transform

将 MCX 转换为 JavaScript。

```typescript
async function transform(
  code: string,
  id: string,
  options: TransformOptions
): Promise<TransformResult>;
```

**参数：**
- `code: string` - MCX 代码
- `id: string` - 文件 ID
- `options: TransformOptions` - 转换选项

**返回值：**
- `Promise<TransformResult>` - 转换结果

---

### # utils

工具类，提供文件系统操作和类型验证等功能。

```typescript
class McxUtils {
  static FileExsit(path: string): Promise<boolean>;
  static readFile(filePath: string, opt?: ReadFileOpt): Promise<string | object>;
  static sleep(time: number): Promise<void>;
  static TypeVerify(obj: any, types: TypeVerifyBody): boolean;
  static AbsoluteJoin(baseDir: string, inputPath: string): string;
}
```

#### utils#FileExsit

检查文件是否存在。

```typescript
static FileExsit(path: string): Promise<boolean>;
```

**参数：**
- `path: string` - 文件路径

**返回值：**
- `Promise<boolean>` - 文件是否存在

---

#### utils#readFile

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

#### utils#sleep

延迟执行。

```typescript
static sleep(time: number): Promise<void>;
```

**参数：**
- `time: number` - 延迟时间（毫秒）

**返回值：**
- `Promise<void>`

---

#### utils#TypeVerify

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

#### utils#AbsoluteJoin

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

### ItemComponent
用于创建物品 JSON 组件

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
| `#ItemComponent#toJSON()` | 生成最终的 JSON 对象 |
| `#ItemComponent#setName(newValue: string)` | 设置物品显示名称 |
| `#ItemComponent#setIcon(newValue: string)` | 设置物品图标纹理 |
| `#ItemComponent#getName()` | 获取物品显示名称 |
| `#ItemComponent#setId(newValue: string)` | 设置物品唯一标识符 |
| `#ItemComponent#getId()` | 获取物品唯一标识符 |
| `#ItemComponent#setAllowOffHand(vl: boolean)` | 设置是否允许放置在副手 |
| `#ItemComponent#setBlockPlacer(config)` | 设置方块放置器组件 |
| `#ItemComponent#setCooldown(config)` | 设置冷却组件 |
| `#ItemComponent#setCompostable(config)` | 设置堆肥组件 |
| `#ItemComponent#setBundleInteraction(config)` | 设置 bundles 交互组件 |
| `#ItemComponent#setGlint(value: boolean)` | 设置闪光效果 |
| `#ItemComponent#setHandEquipped(value: boolean)` | 设置手持装备 |
| `#ItemComponent#setDigger(config)` | 设置挖掘组件 |
| `#ItemComponent#setDamageAbsorption(config)` | 设置伤害吸收组件 |
| `#ItemComponent#setDurability(config)` | 设置耐久度组件 |
| `#ItemComponent#setDurabilitySensor(config)` | 设置耐久度传感器 |
| `#ItemComponent#setDyeable(config)` | 设置可染色组件 |
| `#ItemComponent#setEnchantable(config)` | 设置可附魔组件 |
| `#ItemComponent#setFood(config)` | 设置食物组件 |
| `#ItemComponent#setFireResistant(config)` | 设置防火组件 |
| `#ItemComponent#setEntityPlacer(config)` | 设置实体放置器 |
| `#ItemComponent#setFuel(config)` | 设置燃料组件 |
| `#ItemComponent#setKineticWeapon(config)` | 设置动能武器组件 |
| `#ItemComponent#setInteractButton(config)` | 设置交互按钮 |
| `#ItemComponent#setHoverTextColor(config)` | 设置悬浮文本颜色 |
| `#ItemComponent#setLiquidClipped(config)` | 设置液体剪切 |
| `#ItemComponent#setMaxStackSize(config)` | 设置最大堆叠数量 |
| `#ItemComponent#setPiercingWeapon(config)` | 设置穿刺武器组件 |
| `#ItemComponent#setProjectile(config)` | 设置投射物组件 |
| `#ItemComponent#setRecord(config)` | 设置唱片组件 |
| `#ItemComponent#setRarity(config)` | 设置稀有度 |
| `#ItemComponent#setRepairable(config)` | 设置可修复组件 |
| `#ItemComponent#setSeed(config)` | 设置种子组件 |
| `#ItemComponent#setStackedByData(config)` | 设置数据堆叠 |
| `#ItemComponent#setShouldDespawn(config)` | 设置消失时间 |
| `#ItemComponent#setShooter(config)` | 设置射击者组件 |
| `#ItemComponent#setStorageWeightModifier(config)` | 设置存储权重修饰符 |
| `#ItemComponent#setStorageWeightLimit(config)` | 设置存储权重限制 |
| `#ItemComponent#setStorageItem(config)` | 设置存储物品组件 |
| `#ItemComponent#setThrowable(config)` | 设置投掷物组件 |
| `#ItemComponent#setTags(tags: string[])` | 设置标签 |
| `#ItemComponent#setSwingDuration(duration: number)` | 设置摆动持续时间 |
| `#ItemComponent#setUseAnimation(animation)` | 设置使用动画 |
| `#ItemComponent#setWearable(config)` | 设置可穿戴组件 |
| `#ItemComponent#setUseModifiers(config)` | 设置使用修饰符 |

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
用于创建方块 JSON 组件

**注意**：当前版本 BlockComponent 仅包含基础结构，实际方法正在完善中。

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
| `#BlockComponent#toJSON()` | 生成最终的 JSON 对象 |

#### 使用示例
```typescript
import { BlockComponent } from "@mbler/mcx-core";

const blockComponent = new BlockComponent({
  format: "1.21.100",
  name: "Demo Block",
  id: "mcx_demo:demo_block"
});

const json = blockComponent.toJSON();
```

---

### EntityComponent
用于创建实体 JSON 组件

#### 构造函数参数
```typescript
interface EntityComponentOptions {
  format: string;      // 格式版本
  name: string;        // 实体显示名称
  id: string;          // 实体唯一标识符
}
```

#### 实例方法 (部分)
| 方法 | 说明 |
|------|------|
| `#EntityComponent#toJSON()` | 生成最终的 JSON 对象 |
| `#EntityComponent#setId(newValue: string)` | 设置实体唯一标识符 |
| `#EntityComponent#setFormat(newValue: string)` | 设置格式版本 |
| `#EntityComponent#setIsSpawnable(value: boolean)` | 设置是否可生成 |
| `#EntityComponent#setIsSummonable(value: boolean)` | 设置是否可召唤 |
| `#EntityComponent#setAddrider(config)` | 设置骑乘组件 |
| `#EntityComponent#setAdmireItem(config)` | 设置欣赏物品组件 |
| `#EntityComponent#setAgeable(config)` | 设置可成长组件 |
| `#EntityComponent#setAngerLevel(config)` | 设置愤怒等级 |
| `#EntityComponent#setAngry(config)` | 设置愤怒组件 |
| `#EntityComponent#setAnnotationBreakDoor(config)` | 设置破门注释 |
| `#EntityComponent#setAnnotationOpenDoor()` | 设置开门注释 |
| `#EntityComponent#setAttack(config)` | 设置攻击组件 |
| `#EntityComponent#setAreaAttack(config)` | 设置区域攻击组件 |
| `#EntityComponent#setAttackCooldown(config)` | 设置攻击冷却 |
| `#EntityComponent#setBalloonable(config)` | 设置气球组件 |
| `#EntityComponent#setBarter(config)` | 设置交易组件 |
| `#EntityComponent#setBlockClimber()` | 设置方块攀爬 |
| `#EntityComponent#setBlockSensor(config)` | 设置方块传感器 |
| `#EntityComponent#setBoostable(config)` | 设置可加速组件 |
| `#EntityComponent#setBoss(config)` | 设置Boss组件 |
| `#EntityComponent#setBreakBlocks(config)` | 设置破坏方块 |
| `#EntityComponent#setBreathable(config)` | 设置呼吸组件 |
| `#EntityComponent#setBribeable(config)` | 设置可贿赂组件 |
| `#EntityComponent#setBreedable(config)` | 设置可繁殖组件 |
| `#EntityComponent#setBuoyant(config)` | 设置浮力组件 |
| `#EntityComponent#setBurnsInDaylight(config)` | 设置日光燃烧 |
| `#EntityComponent#setCannotBeAttacked()` | 设置不可攻击 |
| `#EntityComponent#setCanClimb()` | 设置可攀爬 |
| `#EntityComponent#setCanFly()` | 设置可飞行 |
| `#EntityComponent#setCanJoinRaid()` | 设置可参与突袭 |
| `#EntityComponent#setCanPowerJump()` | 设置可强力跳跃 |
| `#EntityComponent#setCollisionBox(config)` | 设置碰撞箱 |
| `#EntityComponent#setColor(config)` | 设置颜色 |
| `#EntityComponent#setColor2(config)` | 设置第二种颜色 |
| `#EntityComponent#setDespawn(config)` | 设置消失组件 |
| `#EntityComponent#setEconomyTradeTable(config)` | 设置经济交易表 |
| `#EntityComponent#setEnvironmentSensor(config)` | 设置环境传感器 |
| `#EntityComponent#setEquipment(config)` | 设置装备组件 |
| `#EntityComponent#setExplode(config)` | 设置爆炸组件 |
| `#EntityComponent#setFloating(config)` | 设置漂浮组件 |
| `#EntityComponent#setFollower(config)` | 设置跟随组件 |
| `#EntityComponent#setHealth(config)` | 设置生命值组件 |
| `#EntityComponent#setHerding(config)` | 设置牧群组件 |
| `#EntityComponent#setHome(config)` | 设置家组件 |
| `#EntityComponent#setHurtOnCondition(config)` | 设置条件受伤 |
| `#EntityComponent#setInertia(config)` | 设置惯性组件 |
| `#EntityComponent#setInventory(config)` | 设置物品栏 |
| `#EntityComponent#setJumpDynamic(config)` | 设置动态跳跃 |
| `#EntityComponent#setLeashable(config)` | 设置可牵引 |
| `#EntityComponent#setLookAtPlayer(config)` | 设置看向玩家 |
| `#EntityComponent#setManaged(config)` | 设置管理组件 |
| `#EntityComponent#setMountTaming(config)` | 设置骑乘驯化 |
| `#EntityComponent#setNavFly(config)` | 设置飞行导航 |
| `#EntityComponent#setNavGoal(config)` | 设置导航目标 |
| `#EntityComponent#setProjectile(config)` | 设置投射物 |
| `#EntityComponent#setRiderRotates(config)` | 设置骑乘者旋转 |
| `#EntityComponent#setScale(config)` | 设置缩放 |
| `#EntityComponent#setSchedule(config)` | 设置计划任务 |
| `#EntityComponent#setSensors(config)` | 设置传感器 |
| `#EntityComponent#setSkinSettings(config)` | 设置皮肤设置 |
| `#EntityComponent#setSoulSpeed(config)` | 设置灵魂速度 |
| `#EntityComponent#setSpawnEntity(config)` | 设置生成实体 |
| `#EntityComponent#setSwell(config)` | 设置膨胀组件 |
| `#EntityComponent#setTameable(config)` | 设置可驯化 |
| `#EntityComponent#setTeleport(config)` | 设置传送组件 |
| `#EntityComponent#setTickWorld(config)` | 设置世界Tick |
| `#EntityComponent#setTrail(config)` | 设置痕迹 |
| `#EntityComponent#setVariant(config)` | 设置变体 |
| `#EntityComponent#setWalkTowards(config)` | 设置行走目标 |

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

#### 构造函数参数
```typescript
interface ItemComponentOptions {
  format: string;      // 格式版本，如 "1.21.100"
  name: string;        // 物品显示名称
  id: string;          // 物品唯一标识符，如 "namespace:item_id"
}
```

#### 常用方法
| 方法 | 说明 |
|------|------|
| `setAllowOffHand(allow: boolean)` | 设置是否允许放置在副手 |
| `setMaxStackSize(size: number)` | 设置最大堆叠数量 |
| `setIcon(texture: string)` | 设置物品图标纹理 |
| `addComponent(name: string, value: any)` | 添加自定义组件 |
| `toJSON()` | 生成最终的 JSON 对象 |

---

### BlockComponent
用于创建方块 JSON 组件

#### 基本用法
```typescript
import { BlockComponent } from "@mbler/mcx-core";

const blockComponent = new BlockComponent({
  format: "1.21.100",
  name: "Demo Block",
  id: "mcx_demo:demo_block"
});

// 设置方块硬度
blockComponent.setBlockHardness(1.5);

// 设置方块爆炸抗性
blockComponent.setBlockExplosionResistance(3.0);

// 设置方块亮度
blockComponent.setEmissive(true);

const json = blockComponent.toJSON();
```

#### 构造函数参数
```typescript
interface BlockComponentOptions {
  format: string;      // 格式版本
  name: string;        // 方块显示名称
  id: string;          // 方块唯一标识符
}
```

#### 常用方法
| 方法 | 说明 |
|------|------|
| `setBlockHardness(hardness: number)` | 设置方块硬度 |
| `setBlockExplosionResistance(resistance: number)` | 设置爆炸抗性 |
| `setFriction(friction: number)` | 设置摩擦系数 |
| `setEmissive(emissive: boolean)` | 设置自发光 |
| `addComponent(name: string, value: any)` | 添加自定义组件 |
| `toJSON()` | 生成最终的 JSON 对象 |

---

### EntityComponent
用于创建实体 JSON 组件

#### 基本用法
```typescript
import { EntityComponent } from "@mbler/mcx-core";

const entityComponent = new EntityComponent({
  format: "1.21.100",
  name: "Demo Entity",
  id: "mcx_demo:demo_entity"
});

// 设置实体是否是空中生物
entityComponent.setAirborne(true);

// 设置实体是否可以移动
entityComponent.setCanFly(true);

// 添加自定义组件
entityComponent.addComponent("minecraft:behavior.random_stroll", {
  priority: 0,
  speed: 1.0
});

const json = entityComponent.toJSON();
```

#### 构造函数参数
```typescript
interface EntityComponentOptions {
  format: string;      // 格式版本
  name: string;        // 实体显示名称
  id: string;          // 实体唯一标识符
}
```

#### 常用方法
| 方法 | 说明 |
|------|------|
| `setAirborne(isAirborne: boolean)` | 设置是否为空中生物 |
| `setCanFly(canFly: boolean)` | 设置是否可以飞行 |
| `setCanSwim(canSwim: boolean)` | 设置是否可以游泳 |
| `setHealth(health: number)` | 设置生命值 |
| `setMovementSpeed(speed: number)` | 设置移动速度 |
| `addComponent(name: string, value: any)` | 添加自定义组件 |
| `toJSON()` | 生成最终的 JSON 对象 |

---

### ImageComponent
用于创建图像组件（PNG、JPG、SVG、GIF）

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
类型导出模块，提供组件的类型定义

```typescript
import * as ComponentType from "@mbler/mcx-core/ComponentType";

// ItemComponentType - 物品组件类型定义
// BlockComponentType - 方块组件类型定义
// EntityComponentType - 实体组件类型定义
```