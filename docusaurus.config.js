// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Avaota SBC',
  tagline: 'Avaota SBC Linux Boards Docs.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'http://docs.avaota.fun/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AvaotaSBC', // Usually your GitHub org/user name.
  projectName: 'avaota-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      }),
    ],
  ],

  themeConfig:
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Avaota SBC文档',
        logo: {
          alt: 'AvaotaSBC',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'avaotsbcSidebar',
            position: 'left',
            label: 'Avaota SBC 文档',
          },
          {
            type: 'docSidebar',
            sidebarId: 'linuxManualSidebar',
            position: 'left',
            label: 'AvaotaOS 开发手册',
          },
          {
            type: 'docSidebar',
            sidebarId: 'driverManualSidebar',
            position: 'left',
            label: 'BSP 驱动文档',
          },
		  {
            type: 'docSidebar',
            sidebarId: 'androidSidebar',
            position: 'left',
            label: 'Android 开发文档',
          },
		  {
            type: 'docSidebar',
            sidebarId: 'ampSidebar',
            position: 'left',
            label: 'AMP 异构开发',
          },
		  {
            type: 'docSidebar',
            sidebarId: 'communitySidebar',
            position: 'left',
            label: 'Avaota 社区教程',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © AvaotaSBC Team. ${new Date().getFullYear()}. Built BUILDCOMMIT with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
