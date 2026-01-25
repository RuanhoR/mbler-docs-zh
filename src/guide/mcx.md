# mbler mcx

mcx是测试功能。
以下是示例
index.js
```javascript
import { createApp } from "mcx"
import {world} from "@minecraft/server"
import App from "./app.mcx"
createApp(App, world)
```
app.mcx
```
<script>
import Event from "./event.mcx";
import Component from "./component.mcx";
// Since this compiles into static JSON, it’s a macro, so it cannot be called repeatedly
Component.use();
// Register all events inside, you can also cancel all with `unsubscribe`, or specify events by name
Event.subscibe();
```

event.mcx
```
<Event @after>
PlayerJoin=eventHandler
</Event>
<script>
exports.PlayerJoin = function(event) {
    event.player.sendMessage("Welcome to the game")
}
</script>
```

component.mcx
```
<Component>
<items> <!-- register items -->
<item id=test>subscribe</item>
</items>
</Component>
<script>
import {
ItemComponent
} from "@mbler/mcx"
export.subscribe = new ItemComponent({
    id: "mbler_test:test",
    opt: {
        stacked_by_data: true,
        max_stack_size: true,
        display_name: "Test Item",
        allow_off_hand: true,
        hand_equipped: true,
        foil: true,
        glint: true
    }
})
</script>
```
这是一个示例 mcx 项目。mcx 本身尚未完全实现，欢迎贡献（mcx 位于 mbler 源代码的 `src/mcx` 目录中）。