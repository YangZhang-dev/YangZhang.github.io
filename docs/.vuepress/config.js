// .vuepress/config.js
import { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { copyCodePlugin } from "vuepress-plugin-copy-code2";
import { copyrightPlugin } from "vuepress-plugin-copyright2";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import metadata from '../metadata';
export default {    
    title: 'zzzzz',// 设置网站标题
    description: 'zzys的博客',
    base: '/',   // 设置站点根路径
  
    theme: defaultTheme({
        repo:'https://github.com/YangZhang-dev',
        repoLabel:"跳转仓库",
        footer:metadata.footer,
        editLink: false,
        search: true,
        searchMaxSuggestions: 10,
        lastUpdatedText: "上次更新",
        navbar:[
            {
                text:"test",
                link:"/test/"
            },
            {
                text:"my",
                link:"/my/",
            }
        ],

        sidebar:{
            "/test":[
                {
                    text:"test目录",
                    children:["/test/test","/test/test1"]
                }
            ],
            "/my":[
                {
                    text:"my目录",
                    children:["/my/my"]
                }
            ],
        }
    }),


    plugins: [
        copyCodePlugin({
            showInMobile: true
        }),
        copyrightPlugin({
            global: true,
            triggerLength:10,
            author: "YangZhang",
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
