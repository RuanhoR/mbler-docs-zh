# 开始使用Mbler

## 下载
该工具依赖于 Nodejs，因此请先到 [Nodejs](https://nodejs.org) 下载 Nodejs。如果你是手机用户，可以先搜索Termux并下载Nodejs。 

安装Nodejs后，你可以通过命令安装 [npm包地址](https://npmjs.com/package/mbler)
```bash
# NPM
npm install -g mbler
# 如果有误，试试
sudo npm install -g mbler
# pnpm
pnpm install -g mbler
```
然后，你可以确认安装是否成功
```
mbler version
```
安装完成后，您就可以开始下一步

## 创建一个项目
MBLER 有一个可以传递的工作目录上下文(可以用`mbler set-work-dir off`关闭)
```bash
mbler c .
```
将工作目录切换到当前目录。
```bash
mbler init
```
命令行输出(可用 `mbler lang zh`调整cli的语言)
```
Project Name: test
Project Description: test
Select project language: (press b to confirm, n key to select next)
ts js mcx
Initializing dependencies? (y/n): (press b to confirm, n key to select next)
no pnpm npm
Using UI modules? (y/n): y
Initialize GIT Repository? (y/n): y
Using the Beta API? (y/n): y
```
文件输出
- <img style="width: 50px;height:50px" src="/static/folder.svg"> `behavior`
 - <img style="width: 50px;height:50px" src="/static/folder.svg"> `node_modules`
 - <img style="width: 50px;height:50px" src="/static/yaml_file.svg"> `pnpm-lock.yaml`
 - <img style="width: 50px;height:50px" src="/static/json_file.svg"> `tsconfig.json`
 - <img style="width: 50px;height:50px" src="/static/json_file.svg"> `mbler.config.json`
 - <img style="width: 50px;height:50px" src="/static/json_file.svg"> `package.json`
 - <img style="width: 50px;height:50px" src="/static/folder.svg">) `resources`
其中，资源和行为可以包含原始插件包的 JSON 和其他内容。 

在`mbler build`(或`npm run build`)之后，它会被生成为一个额外的包，你可以在`mbler.config.json`中设置 outdir 为 MC Bedrock 的行为包/资源包路径，以便实时测试。
接下来是什么？
 - [学习DSL](./mcx)
 - [项目结构](./project)