import type {
  Config as ThemeConfig
} from '@vue/theme'
export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [{
    text: '开始',
    items: [{
        text: '介绍',
        link: '/guide/introduction'
      },
      {
        text: '快速开始',
        link: '/guide/quick-start'
      }
    ]
  }],
  '/examples/': [{
    text: 'Basic',
    items: [{
        text: 'Hello World',
        link: '/examples/hello-world'
      }
    ]
  }]
}
const nav: ThemeConfig['nav'] = [{
    text: '文档',
    activeMatch: `^/(guide|examples)/`,
    items: [{
        text: '示例',
        link: '/examples/hello-world'
      },
      {
        text: '快速开始',
        link: '/guide/quick-start'
      },
      {
        text: "总览",
        link: "./guide/introduction"
      }
    ]
  },
  {
    text: " 切换语言",
    items: [{
        text: "中文",
        link: "https://zh.mbler-docs.ruanhor.dpdns.org"
      },
      {
        text: "English",
        link: "https://mbler-docs.ruanhor.dpdns.org"
      }
    ]
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
    html: false
  }
}