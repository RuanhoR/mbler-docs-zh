# 项目结构

## 什么是Mbler项目的项目结构？

```
project
  | resources
    | 原版资源json(manifest.json将会自动生成必需字段，如果写了就是添加设置)
  | behavior
    | 原版行为包资源(manifest.json将会自动生成必需字段，如果写了就是添加设置)
    | scripts
      | 在mbler.config.json中声明的主脚
      | *.ts | *.mcx(如果Mbler Config中script.lang使用了ts或mcx)
  | mbler.config.json (Mbler Config)
  | package.json (通常不用改)
```

提示：如果在`behavior`或`resources`下写了manifest.json，那么mbler将会合并

- 之前
  `/behavior/manifest.json`

```json
{
  "a": "b"
}
```

- 之后（演示）:
  `/behavior/manifest.json`

```json
{
  "format_version": 2,
  "header": {
    "name": "@ruanhor/example",
    "description": "demo for mcx",
    "uuid": "3f87bcfc-135c-49c7-8b89-faabf4f146a5",
    "version": [0, 0, 1],
    "min_engine_version": [1, 21, 120]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "189303d5-3a12-4e27-8b89-ac861f1116b3",
      "description": "From Mbler(https://github.com/RuanhoR/mbler). welcome to star and contribute!",
      "version": [0, 0, 1]
    },
    {
      "type": "script",
      "entry": "scripts/index.js",
      "language": "javascript",
      "uuid": "95221dac-04ae-4054-8b89-ccb57c29920e",
      "description": "sapi generate by mbler, weclome to download and star at https://github.com/RuanhoR/mbler",
      "version": [0, 0, 1]
    }
  ],
  "capabilities": ["script_eval"],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "2.4.0-beta"
    },
    {
      "module_name": "@minecraft/server-ui",
      "version": "2.1.0-beta"
    }
  ],
  "a": "b"
}
```
