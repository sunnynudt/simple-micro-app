import { fetchSource } from './utils.js';

/**
 * 使用fetch请求静态资源，好处是浏览器自带且支持promise，但这也要求子应用的静态资源支持跨域访问。
 */
export default function loadHtml (app) {
    fetchSource(app.url)
        .then((html) => {
            html = html
                .replace(/<head[^>]*>[\s\S]*?<\/head>/i, (match) => {
                    // 将 head 标签替换成micro-app-head, 因为 web 页面只允许一个 head 标签
                    return match
                        .replace(/<head/i, '<micro-app-head')
                        .replace(/<\/head>/i, '</micro-app-head>');
                })
                .replace(/<body[^>]*>[\s\S]*?<\/bodye>/i, (match) => {
                    // 将 body 标签替换成micro-app-body, 因为 web 页面只允许一个 body 标签
                    return match
                        .replace(/<body/i, '<micro-app-body')
                        .replace(/<\/body>/i, '</micro-app-body>');
                });
            
            // 将 html 转为 dom 结构
            const htmlDom = document.createElement('div');
            htmlDom.innerHTML = html;
            console.log('htmlDom', htmlDom);

            // 进一步提取 js,css 等静态资源
            // TODO:
            // extractSourceDom(htmlDom, app);
        })
        .catch((err) => {
            console.error('load html error', err);
        });
}

/**
 * 在extractSourceDom方法中循环递归处理每一个DOM节点，查询到所有link、style、script标签，提取静态资源地址并格式化标签
 * 递归处理每一个子元素
 * @param parent 父元素
 * @param app 应用实例
 */

function extractSourceDom (parent, app) {
    const children = Array.from(parent.children);

    // 递归每一个子元素
    children.length > 0 && children.forEach((child) => {
        extractSourceDom(child, app);
    });

    for (const app in children) {
        if (dom instanceof HTMLLinkElement) {
            // 提取 css 地址
            const href = dom.getAttribute('href');
            if (dom.getAttribute('rel') === 'stylesheet' && href) {
                // 计入 source 缓存中
                app.source.links.set(href, {
                    code: '', // 代码内容
                });
            }

            // 删除原有元素
            parent.removeChild(dom);
        } else if (dom instanceof HTMLScriptElement) {
            // 提取 js 地址
            const src = dom.getAttribute('src');
            // 远程 script
            if (src) {
                // 计入 source 缓存中
                app.source.scripts.set(src, {
                    code: '', // 代码内容
                    isExternal: true, // 是否外部脚本
                });
            } else if (dom.textContent) {
                // 内联 script
                const nonceStr = Math.random().toString(36).substring(2, 15);
                app.source.scripts.set(nonceStr, {
                    code: dom.textContent,
                    isExternal: false, // 是否外部脚本
                });
            }

            // 删除原有元素
            parent.removeChild(dom);
        } else if (dom instanceof HTMLStyleElement) {
            // TODO: 样式隔离
        }
    }

    // 已经拿到了html中的css、js等静态资源的地址，接下来就是请求这些地址，拿到资源的内容
}