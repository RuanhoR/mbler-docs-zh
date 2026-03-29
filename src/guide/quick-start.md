# 开始使用Mbler

## 下载
本工具依赖于 Nodejs，因此请先去[Nodejs](https://nodejs.org)下载nodejs。如果你是手机党，可以先去搜索Termux并下载Nodejs。  

安装完Nodejs，可通过命令安装
```bash
# npm
npm install -g mbler
# if error, try
sudo npm install -g mbler
# pnpm
pnpm install -g mbler
```
如果需要手动安装，可以去 [下载](/other/download) 下载zip，解压后运行
```bash
npm i && npm link
```
然后，可以确认一下是否成功安装
```
mbler version
```
安装完成，就可以开始下一步了

## 创建项目
mbler具有工作目录的上下文，可通过
```bash
mbler c .
```
切换工作目录为当前目录。
```bash
mbler init
```
将会输出
```
项目名称: test
项目描述: test
选择项目语言：  (按 b 确认，n 键选择下一个)
ts     js     mcx
初始化依赖? (y/n):  (按 b 确认，n 键选择下一个)
no     pnpm     npm
使用UI模块? (y/n): y
初始化GIT仓库? (y/n): y
使用Beta Api? (y/n): y
```
将会生成文件
 - <img style="width: 50px;height:50px" src="/static/folder.svg"> `behavior`
 - <img style="width: 50px;height:50px" src="/static/folder.svg"> `node_modules`
 - <img style="width: 50px;height:50px" src="/static/yaml_file.svg"> `pnpm-lock.yaml`
 - <img style="width: 50px;height:50px" src="/static/json_file.svg"> `tsconfig.json` (仅输入的语言为ts或mcx)
 - <img style="width: 50px;height:50px" src="/static/json_file.svg"> `mbler.config.json`
 - <img style="width: 50px;height:50px" src="/static/json_file.svg"> `package.json`
 - <img style="width: 50px;height:50px" src="/static/folder.svg">) `resources`

其中，resources和behavior里面，可以放原版附加包的json等内容。  

在`mbler build`(或`npm run build`)后，将会生成成附加包，可以设置`mbler.config.json`中的outdir为mc bedrock的行为包/资源包路径，以实时测试。
下一步？
 - [学习DSL](./mcx)
 - [项目结构](./project)