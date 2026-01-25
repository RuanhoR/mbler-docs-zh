# 开始使用
## 提示
> 提示：请确保你有一些基本的命令行经验，并且了解 JavaScript 的基本语法。

## 安装
它基于 Node.js 和 TypeScript，因此你不能直接使用它来克隆 Git 仓库。

 - 从github: 你应该访问 [这个页面](https://github.com/RuanhoR/mbler/releases)，选择最新版本，点击 `dist.zip` 下载。
- [下载](/public/mbler-dist-0.1.1.zip)
然后解压这个压缩包。（如果你是 Windows 用户，请使用像 7-zip 这样的工具）用终端打开它。

在解压的文件夹中，进入 dist 文件夹。

然后，请安装 [Node.js](https://nodejs.org)。接着，运行
```bash
npm install && npm link
```
安装 mbler。

## 初始化你的项目包
你可以选择任意文件夹，用终端打开它。
由于 mbler 有工作目录功能，你应该先运行
```bash
mbler -c .
```
然后，在该文件夹中运行
```bash
mbler init
```
示例输出（如果你想使用英语，请运行 `mbler lang en`）
```
# mbler init
项目名称: test
项目描述: demo
支持的 Minecraft 版本: 1.21.100
使用 Script Api 吗？(Y/N) Y
主脚本路径(如 ./index.js): index.js
使用 UI 吗？(Y/N) Y
选择语言 (按 b 确认，n 键选择下一个)
ts js mcx
```
它会生成一些文件夹和文件。

## 编写你的 Minecraft 插件
打开刚初始化文件夹中的 `behavior/scripts` 文件夹。
在该文件夹中创建主文件（就是你刚初始化时输入的那个文件名）。

如果你选择了 ts，就写 TypeScript；如果选择了 js，就写 JavaScript。

如果你选择 mcx，请访问 [mcx](/guide/mcx)。