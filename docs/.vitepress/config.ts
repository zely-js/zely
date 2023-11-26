import { defineConfig } from 'vitepress';

import pkg from '../../packages/zely/package.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Zely1',
  description: 'a Backend Framework for Node.js',

  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#944cc2' }],
    [
      'link',
      {
        href: 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
        rel: 'stylesheet',
      },
    ],
    [
      'link',
      {
        rel: 'prefetch',
        href: '/assets/background.png',
      },
    ],
  ],

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    editLink: { pattern: 'https://github.com/zely-js/core/edit/main/docs/:path' },

    nav: [
      { text: 'Zely2', link: 'https://zely2.netlify.app' },
      { text: 'Docs', link: '/guide/what-is-zely' },
      { text: 'Apis', link: '/apis/introduction' },
      { text: 'Packages', link: '/packages/packages' },
      { text: 'Blog', link: '/blog/introduction' },
      {
        text: `v${pkg.version}`,
        link: `https://github.com/zely-js/core/releases/tag/zely%40${pkg.version}`,
      },
    ],

    sidebar: {
      '/guide/': sidebarGuide(),
      '/apis/': sidebarApis(),
      '/packages/': sidebarPackages(),
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
        {
          text: 'Libraries',
          collapsed: true,
          items: [
            { text: 'Zept', link: '/packages/zept' },
            { text: 'Osik', link: '/packages/osik' },
          ],
        },
      ],
    },
    {
      text: 'Config References',
      collapsed: false,
      items: [{ text: 'Config', link: '/apis/config' }],
    },
  ];
}
function sidebarPackages() {
  return [
    {
      text: 'Packages',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/packages/packages' },
        { text: 'osik', link: '/packages/osik' },
        { text: '@zely/plugin-cors', link: '/packages/cors' },
      ],
    },
    {
      text: 'Zept',
      collapsed: false,
      items: [
        { text: 'zept', link: '/packages/zept' },
        { text: '@zept/http', link: '/packages/zept-http' },
      ],
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
      items: [
        { text: 'Contributing', link: '/guide/contributing' },
        { text: 'Playground', link: '/guide/playground' },
      ],
    },
  ];
}
