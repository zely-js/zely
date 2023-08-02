import { defineConfig } from 'vitepress';

import pkg from '../../packages/zely/package.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Zely',
  description: 'a Backend Framework for Node.js',

  cleanUrls: true,
  lastUpdated: true,

  head: [['meta', { name: 'theme-color', content: '#944cc2' }]],

  markdown: {
    theme: 'material-theme-palenight',
    lineNumbers: true,
  },

  themeConfig: {
    editLink: { pattern: 'https://github.com/zely-js/core/edit/main/docs/:path' },

    nav: [
      { text: 'guide', link: '/guide/what-is-zely' },
      { text: 'apis', link: '/apis/introduction' },
      { text: 'config', link: '/apis/config' },
      { text: 'blog', link: '/blog/introduction' },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: 'CHANGELOG',
            link: 'https://github.com/zely-js/core/blob/main/packages/zely/CHANGELOG.md',
          },
          {
            items: [
              {
                text: 'prext docs',
                link: 'https://prext.netlify.app',
              },
            ],
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': sidebarGuide(),
      '/apis/': sidebarApis(),
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/zely-js/core' }],
  },
});

function sidebarApis() {
  return [
    {
      text: 'Javascript Apis',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/apis/introduction' },
        { text: 'Apis', link: '/apis/apis' },
        { text: 'Server', link: '/apis/server' },
        { text: 'Plugin', link: '/apis/plugin' },
        { text: 'Osik', link: '/apis/osik' },
      ],
    },
    {
      text: 'Config References',
      collapsed: false,
      items: [{ text: 'Config', link: '/apis/config' }],
    },
  ];
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is Zely?', link: '/guide/what-is-zely' },
        {
          text: 'Getting Started',
          link: '/guide/getting-started',
          items: [{ text: 'Typescript', link: '/guide/typescript' }],
          collapsed: true,
        },
        {
          text: 'Routing',
          link: '/guide/routing',
          items: [
            { text: 'Methods', link: '/guide/methods' },
            { text: 'Page Data', link: '/guide/page' },
            { text: 'Customizing Response', link: '/guide/prewrite' },
            { text: 'Data Fetching', link: '/guide/fetch' },
          ],
          collapsed: true,
        },
        { text: 'Middlewares', link: '/guide/middlewares' },
        { text: 'Build', link: '/guide/build' },
        { text: 'Plugin', link: '/guide/plugin' },
        { text: 'with Frameworks', link: '/guide/framework' },
      ],
    },
    {
      text: 'Community',
      collapsed: false,
      items: [{ text: 'Contributing', link: '/guide/contributing' }],
    },
  ];
}
