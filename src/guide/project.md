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

