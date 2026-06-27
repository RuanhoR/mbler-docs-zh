import type { Config as ThemeConfig } from "@vue/theme";
export const sidebar: ThemeConfig["sidebar"] = {
  "/guide/": [
    {
      text: "教程",
      items: [
        {
          text: "介绍",
          link: "/guide/introduction",
        },
        {
          text: "开始",
          link: "/guide/quick-start",
        },
        {
          text: "项目结构",
          link: "/guide/project",
        },
        {
          link: "/guide/cli",
          text: "命令使用",
        },
        {
          link: "/guide/mbler-config",
          text: "mbler.config.js",
        },
        {
          link: "/guide/mcx",
          text: "使用mcx创建项目(Beta)",
        },
        {
          text: "Vscode 扩展",
          link: "/guide/vscode",
        },
        {
          text: "MNX 市场",
          link: "/guide/mnx",
        },
        {
          text: "故障排除 & 常见问题",
          link: "/guide/troubleshooting",
        },
      ],
    },
    {
      text: "内部实现",
      items: [
        {
          text: "Mbler",
          link: "/guide/internal/mbler",
        },
        {
          text: "Mcx 核心",
          link: "/guide/internal/mcx",
        },
        {
          text: "运行时框架",
          link: "/guide/internal/runtime",
        },
      ],
    },
  ],
};
const nav: ThemeConfig["nav"] = [
  {
    text: "文档",
    activeMatch: `^/(guide|examples)/`,
    items: [
      {
        text: "开始",
        link: "/guide/quick-start",
      },
      {
        text: "介绍",
        link: "/guide/introduction",
      },
    ],
  },
  {
    text: "语言",
    items: [
      {
        text: "中文",
        link: "https://zh-d.pmnx.qzz.io",
      },
      {
        text: "English",
        link: "https://en-d.pmnx.qzz.io",
      },
    ],
  },
  {
    text: "Sitemap",
    link: "/sitemap.xml",
  },
];
export default {
  title: "Mbler Docs",
  description: "Mbler Docs",
  srcDir: "src",
  themeConfig: {
    outline: {
      level: [1, 2, 3, 4, 5, 6],
    },
    search: {
      provider: "local",
    },
    footer: {
      license: {
        text: "MIT License",
        link: "https://opensource.org/licenses/MIT",
      },
    },
    nav,
    sidebar,
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/RuanhoR/mbler",
      },
    ],
  },
  markdown: {
    html: true,
  },
  base: "/",
};
