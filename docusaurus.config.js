// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

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

    i18n: {
        defaultLocale: 'zh-CN',
        locales: ['zh-CN', 'en-US'],
        localeConfigs: {
            'en-US': {
                label: 'English',
            },
            'zh-CN': {
                label: '简体中文',
            },
        },
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
                        sidebarId: 'androidSidebar',
                        position: 'left',
                        label: 'Android 开发文档',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'communitySidebar',
                        position: 'left',
                        label: 'Avaota 社区教程',
                    },
                    {
                        type: 'docSidebar',
                        sidebarId: 'buildrootSidebar',
                        position: 'left',
                        label: 'Buildroot 教程',
                    },
                    {
                        type: 'localeDropdown',
                        position: 'right',
                        dropdownItemsAfter: [
                            {
                                type: 'html',
                                value: '<hr style="margin: 0.3rem 0;">',
                            },
                            {
                                to: 'https://crowdin.com/project/docsavaotafun',
                                label: 'Help Us Translate',
                            },
                        ],
                    },
                    {
                        href: 'https://github.com/AvaotaSBC',
                        position: 'right',
                        className: 'header-github-link',
                        'aria-label': 'GitHub repository',
                    },
                ],
            },
            footer: {
                style: 'dark',
                copyright: `Copyright © AvaotaSBC Team. ${new Date().getFullYear()}. Built BUILDCOMMIT with Docusaurus.<br/><a href="https://beian.miit.gov.cn/">滇ICP备19005195号-3</a>`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
            },
            algolia: {
                appId: '48O7DQDPJM',
                apiKey: '6917f76a781efafd4d33d26cd5100862',
                indexName: 'avaota',
                contextualSearch: true,
                searchPagePath: 'search',
                insights: false,
            },
        }),
};

export default config;
