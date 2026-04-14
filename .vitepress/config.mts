import type {
  Config as ThemeConfig
} from '@vue/theme'
export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [{
      text: '教程',
      items: [{
          text: '介绍',
          link: '/guide/introduction'
        },
        {
          text: '开始',
          link: '/guide/quick-start'
        },
        {
          text: "项目结构",
          link: "/guide/project"
        },
        {
          link: '/guide/cli',
          text: "命令使用"
        },
        {
          link: '/guide/mcx',
          test: '使用mcx创建项目(Beta)'
        }
      ]
    },
    {
      text: '内部实现',
      items: [{
        text: "Mbler",
        link: "/guide/internal/mbler"
      }, {
        text: "Mcx",
        link: "/guide/internal/mcx"
      }]
    }
  ]
}
const nav: ThemeConfig['nav'] = [{
    text: '文档',
    activeMatch: `^/(guide|examples)/`,
    items: [{
        text: '开始',
        link: '/guide/quick-start'
      },
      {
        text: "介绍",
        link: "/guide/introduction"
      }
    ]
  },
  {
    text: "语言",
    items: [{
        text: "中文",
        link: "https://zh-mbler-docs.ruanhor.dpdns.org"
      },
      {
        text: "English",
        link: "https://mbler-docs.ruanhor.dpdns.org"
      }
    ]
  },
  {
    text: "Sitemap",
    link: "/sitemap.xml"
  }
]
export default {
  title: 'Mbler Docs',
  description: 'Mbler Docs',
  srcDir: "src",
  themeConfig: {
    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      }
    },
    nav,
    sidebar,
    socialLinks: [{
      icon: 'github',
      link: 'https://github.com/RuanhoR/mbler'
    }]
  },
  markdown: {
    html: true
  },
  base: "/",
}