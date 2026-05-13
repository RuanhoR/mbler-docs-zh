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
提供的API总体结构
```
{
  AST: { tag: [class McxAst], prop: [Function: PropParser] },
  Compiler: [Object: null prototype] {
    CompileError: [class CompileError extends Error],
    CompileJS: [class CompileJS],
    compileJSFn: [Function: compileJSFn],
    compileMCXFn: [Function: compileMCXFn]
  },
  plugin: [Function: mcxPlugn],
  transform: [AsyncFunction: transform],
  utils: [class McxUtlis],
  compile_component: [Object: null prototype] {
    item: [class ItemComponent],
    entity: [class EntityComponent],
    block: [class BlockComponent]
  },
  // 导出的类型
  PUBTYPE: {},
  ItemComponent: [class ItemComponent],
  EntityComponent: [class EntityComponent],
  BlockComponent: [class BlockComponent],
  PNGImageComponent: [class PNGImageComponent],
  JPGImageComponent: [class JPGImageComponent],
  SVGImageComponent: [class SVGImageComponent],
  GIFImageComponent: [class GIFImageComponent],
  ComponentType: [Object: null prototype] {
    ItemComponentType: {...},
    BlockComponentType: {...},
    EntityComponentType: {...}
  }
}
```
(注：此表中除 `PUBTYPE` 字段，其他没有出现，使用时却有的字段为实验性或有可能删除)
### AST 字段
内部 AST 生成
#### tag
 - 使用
```javascript
const MCX = require("@mbler/mcx-core");
const ast = new MCX.AST.tag("<script>console.log('Hello world')</script>");
console.log(ast.parseAST())
```
 - 作用：把HTML字段变成带行号的AST
 - `MCX.AST.tag` 的类型：
```ts
interface BaseToken {
    data: string;
    type: TokenType;
    startIndex?: number;
    endIndex?: number;
    startLine?: number;
    loc?: MCXLoc;
}
interface TagToken extends BaseToken {
    type: 'Tag';
}
interface TagEndToken extends BaseToken {
    type: 'TagEnd';
}
interface ContentToken extends BaseToken {
    type: 'Content';
}
type Token = TagToken | TagEndToken | ContentToken;
type AttributeMap = Record<string, string | boolean>;
interface MCXLoc {
    start: {
        line: number;
        index: number;
    };
    end: {
        line: number;
        index: number;
    };
}
interface ParsedTagNode {
    start: TagToken;
    name: string;
    arr: AttributeMap;
    content: (ParsedTagContentNode | ParsedTagNode)[];
    end: TagEndToken | null;
    loc: MCXLoc;
}
interface ParsedTagContentNode {
    data: string;
    type: 'TagContent';
}
// MCX.AST.tag
declare class McxAst {
    constructor(text: string);
    parseAST(): ParsedTagNode[];
    /**
     * 生成代码字符串（递归处理 content 数组）
     * @param node 要生成代码的AST节点
     * @returns 生成的代码字符串
     */
    static generateCode(node: ParsedTagNode): string;
}
```
#### prop
 - 使用
```javascript
const MCX = require("@mbler/mcx-core");
const ast = MCX.AST.prop("aaa=10\nbbb = bbb");
console.log(ast)
```
 - 作用：把`key=value`的格式转成AST
 - 类型
```ts
type PropValue = number | string | object;
interface PropNode {
    key: string;
    value: PropValue;
    type: "PropChar" | "PropObject";
}
// MCX.AST.prop
declare function PropParser(code: string): PropNode[];
```

### Compiler 字段
用到的类型
```ts
interface BuildCache {
    call: callList[];
    import: ImportList[];
    export: Array<ExportNamedDeclaration | ExportAllDeclaration | ExportDefaultDeclaration>;
}
declare const _MCXstructureLocComponentTypes: {
    readonly items: "item";
    readonly blocks: "block";
    readonly entities: "entity";
};
type MCXstructureLocComponentType = typeof _MCXstructureLocComponentTypes[keyof typeof _MCXstructureLocComponentTypes];
interface MCXstructureLoc {
    script: string;
    Event: {
        on: "after" | "before";
        subscribe: Record<string, string>;
        loc: {
            line: number;
            pos: number;
        };
        isLoad: boolean;
    };
    Component: Record<string, {
        type: MCXstructureLocComponentType;
        useExpore: string;
        loc: {
            line: number;
            pos: number;
        };
    }>;
}
declare class JsCompileData {
    node: t.Program;
    BuildCache: BuildCache;
    File: string;
    isFile: boolean;
    constructor(node: t.Program, BuildCache?: BuildCache);
    setFilePath(dir: string): void;
}
declare class MCXCompileData {
    raw: ParsedTagNode[];
    JSIR: JsCompileData;
    strLoc: MCXstructureLoc;
    File: string;
    isFile: boolean;
    constructor(raw: ParsedTagNode[], JSIR: JsCompileData, strLoc: MCXstructureLoc);
    setFilePath(dir: string): void;
}

declare class CompileError extends Error {
    loc: {
        line: number;
        pos: number;
    };
    constructor(message: string, loc: {
        line: number;
        pos: number;
    });
}
```
#### compileMCXFn
 - 使用
```javascript
const MCX = require("@mbler/mcx-core");
const buildIR = MCX.Compiler.compileMCXFn("<Event @after tick='50'>EntityHitEntity=entity</Event><script>export const entity = function(event){console.log(event)}</script>");
console.log(buildIR)
```
 - 作用：把 `mcx` 源文件转成构建IR
 - 类型
```ts
declare function compileMCXFn(mcxCode: string): MCXCompileData;
```

### plugin 字段
生成rollup语言扩展

### transform
把mcx修改为js

### ItemComponent
用于创建物品 JSON 组件

#### 基本用法
```typescript
import { ItemComponent } from "@mbler/mcx-core";

const itemComponent = new ItemComponent({
  format: "1.21.100", // 格式版本
  name: "Demo Item",
  id: "mcx_demo:demo_item"
});

// 设置物品允许放置在副手
itemComponent.setAllowOffHand(true);

// 设置物品最大堆叠数量
itemComponent.setMaxStackSize(64);

// 添加自定义组件
itemComponent.addComponent("minecraft:hand_equipped", true);

// 生成 JSON
const json = itemComponent.toJSON();
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