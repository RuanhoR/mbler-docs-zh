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

## 创建一个项目

```bash
pnpm create mbler
```

交互式输入内容，大功告成！

其中，资源和行为可以包含原始插件包的 JSON 和其他内容。

在`mbler build`(或`npm run build`)之后，它会被生成为一个额外的包，你可以在`mbler.config.js`中设置 outdir 为 MC Bedrock 的行为包/资源包路径，以便实时测试。
接下来干什么？

- [学习DSL](./mcx)
- [项目结构](./project)
