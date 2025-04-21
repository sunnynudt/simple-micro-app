import loadHtml from './source.js';
import Sandbox from './sandbox.js';

export const appInstanceMap = new Map(); // 存放微应用实例

/**
 * 创建微应用实例
 * 很显然，初始化操作要放在 connectedCallback 中 执行。
 * 我们声明一个类，它的每一个实例都代表一个微应用，用于控制微应用的资源加载、渲染和卸载等。
 * 这个类的实例会在 connectedCallback 中被创建。
 */
export default class CreateApp {
    constructor({ name, url, container }) {
        this.name = name; // 微应用名称
        this.url = url; // 微应用地址
        this.container = container; // 容器元素,micro-app元素
        this.status = 'loading'; // 组件状态，created,loading,mount,unmount
        loadHtml(this); // 加载静态资源

        this.sandbox = new Sandbox(); // 创建沙箱实例
    }

    // 存放应用的静态资源
    source = {
        links: new Map(), // link元素对应的静态资源
        scripts: new Map(), // script元素对应的静态资源
    }

    /**
     * 资源加载完时执行
     */
    onLoad (htmlDom) {
        try {
            console.log('onLoad 资源加载完毕 -----> ');
            console.log('this.source', this.source);
            console.log('appInstanceMap', appInstanceMap);
            console.log('this', this);
            console.log('onLoad 资源加载完毕 <-----');
        } catch (e) {
            console.log(e);
        }

        this.loadCount = this.loadCount ? this.loadCount + 1 : 1; // 记录加载次数
        // 第二次执行且组件未卸载时执行渲染
        if (this.loadCount === 2 && this.status !== 'unmount') {
            // 记录DOM结构用于后续操作
            this.source.html = htmlDom; // htmlDom 结构
            this.mount(); // 执行渲染
        }
    }

    /**
     * 资源加载完后进行渲染
     * 在mount方法中将DOM结构插入文档中，然后执行js文件进行渲染操作，此时微应用即可完成基本的渲染。
     */
    mount () {
        try {
            console.log('mount 资源加载完后进行渲染 ---->');
            console.log('this.source', this.source);
            console.log('appInstanceMap', appInstanceMap);
            console.log('this', this);
            console.log('mount 资源加载完后进行渲染 <-----');
        } catch (e) {
            console.log(e);
        }

        // 克隆dom节点
        const cloneHtml = this.source.html.cloneNode(true);
        // 创建一个fragment节点作为模板，这样不会产生冗余元素
        const fragment = document.createDocumentFragment();
        Array.from(cloneHtml.childNodes).forEach((node) => {
            // 将克隆的节点插入到fragment中
            fragment.appendChild(node);
        });
        
        // 将格式化后的dom节点插入到容器中
        this.container.appendChild(fragment);

        // sandbox
        this.sandbox.start(); // 启动沙箱

        // 执行js
        this.source.scripts.forEach((info) => {
            // (0, eval)(info.code);
            // 修改js作用域
            (0, eval)(this.sandbox.bindScope(info.code));
        });

        // 标记应用为已渲染
        this.status = 'mount';
    }

    /**
     * 卸载应用
     * 执行关闭沙箱、清空缓存等操作
     * @param destory 是否完全卸载应用，删除缓存资源
     */

    unmount (destory) {
        try {
            console.log('unmount 卸载应用 ----->');
            console.log('this.source', this.source);
            console.log('appInstanceMap', appInstanceMap);
            console.log('this', this);
            console.log('destory', destory);
            console.log('unmount 卸载应用 <-----');
        } catch (e) {
            console.log(e);
        }

        this.status = 'unmount'; // 标记应用为已卸载
        this.container = null; // 清空容器

        this.sandbox.stop(); // 停止沙箱
        if (destory) {
            // 当destory为true时，删除应用的实例，此时所有静态资源失去了引用，自动被浏览器回收。
            appInstanceMap.delete(this.name); // 删除微应用实例
        }
    }
}