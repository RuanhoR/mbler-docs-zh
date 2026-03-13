# 在 Mbler 中的 mcx DSL
## 简介
mcx 是Mbler中为方便书写的一种类似Vue的DSL，目前才起步两个月，许多功能不完善，以下为还没写完的地方  
 - vscode 语法高亮，格式化插件
 - 在ts中导入mcx没有类型(准备用volar实现，有点复杂(volar是动态修改typescript的代码))
 - Component MCX  

## 使用

用 `mbler init`创建项目（如果未安装mbler请去 [开始](./quick-start)），选择mcx为语言。  
然后，将会自动生成模板包，可以尝试改一些东西。  

## 正式了解

MCX 目前分为以下几种
  - UI MCX
  - Event MCX
  - App MCX  
  - Component MCX

### UI MCX
示例
```
<Ui>
  <button click="hello">{{ title }}</button>
</Ui>
<script>
  export const hello = function() {
    console.log("Hello world")
  }
</script>
```
其他文件使用：
```javascript
import UI from "./ui.mcx"
import { system, world } from "@minecraft/server"

system.run(()=>{
  const players = world.getPlayers();
  UI.app.ui.show(players[0], {
    title: "TEST"
  })
})
```
### Event mcx 

示例
```
<Event @after tick="50">
  EntityHitEntity = hit
</Event>
<script>
export function hit(event) {
  console.log(event)
}
</script>
```

外部使用：(最好是在App Mcx中导入)

```
<script>
import event from "./event.mcx";
event.subscribe() // 全部注册，也可以 event.subscribe("EntityHitEntity")
</script>
```
### Component MCX
这个不用想了，还在计划阶段