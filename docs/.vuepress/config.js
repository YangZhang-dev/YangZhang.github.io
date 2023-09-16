// .vuepress/config.js
import { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { copyCodePlugin } from "vuepress-plugin-copy-code2";
import { copyrightPlugin } from "vuepress-plugin-copyright2";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import useGenerateSideBar from './hook/useGenerateSideBar';
import metadata from './metadata';
export default {    
    title: metadata.title,
    description: metadata.description,
    theme: defaultTheme({
        repo: metadata.github,
        footer:metadata.footer,
        editLink: false,
        search: true,
        searchMaxSuggestions: 10,
        lastUpdatedText: "上次更新",
        navbar:[
            {
                text:"interview",
                link:"/interview/"
            },
            {
                text:"code",
                link:"/code/",
            }
        ],
        sidebar: useGenerateSideBar()   
    }),

    plugins: [
        copyCodePlugin({
            showInMobile: true
        }),
        copyrightPlugin({
            global: true,
            triggerLength:10,
            author: metadata.author,
            license: metadata.footer
        }),

        searchPlugin({
            // 排除首页
            isSearchable: (page) => page.path !== '/',
            searchMaxSuggestions:5,
        }),
        mdEnhancePlugin({
            // 启用任务列表
            tasklist: true,
            footnote: true,
            mark: true,
            imgLazyload: true,
            mermaid: true,
            // 使用 KaTeX 启用 TeX 支持
            katex: true,
            // 启用下角标功能
            sub: true,
            // 启用上角标
            sup: true,
        }),
    ],
};
