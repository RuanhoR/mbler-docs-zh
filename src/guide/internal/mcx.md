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
npm install @mbler/mcx --save
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
  // 导出的类型
  PUBTYPE: {},
  ItemComponent: [class ItemComponent],
  EntityComponent: [class EntityComponent],
  BlockComponent: [class BlockComponent]
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

### ItemCommponent
用于创建物品JSON组件
### BlockComponent
用于创建方块json组件
### EntityComponent
用于创建实体json组件