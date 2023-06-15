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
  },

  themeConfig: {
    editLink: { pattern: 'https://github.com/zely-js/core/edit/main/docs/:path' },

    nav: [
      { text: 'Guide', link: '/guide/what-is-zely' },
      { text: 'APIs', link: '/apis/introduction' },
      { text: 'Config', link: '/apis/config' },
      { text: 'Blog', link: '/blog/introduction' },
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
      '/blog/': sidebarBlog(),
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/zely-js/core' }],
  },
});

function sidebarBlog() {
  return [
    { text: 'Intro', items: [{ text: 'Introduction', link: '/blog/introduction' }] },
  ];
}

function sidebarApis() {
  return [
    {
      text: 'Javascript Apis',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/apis/introduction' },
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
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Routing', link: '/guide/routing' },
        { text: 'Middlewares', link: '/guide/middlewares' },
        { text: 'Typescript', link: '/guide/typescript' },
        { text: 'Build', link: '/guide/build' },
        { text: 'Page Data', link: '/guide/page' },
        { text: 'Plugin', link: '/guide/plugin' },
        { text: 'Data Fetching', link: '/guide/fetch' },
      ],
    },
    {
      text: 'Community',
      collapsed: false,
      items: [{ text: 'Contributing', link: '/guide/contributing' }],
    },
  ];
}
