import CreateApp, { appInstanceMap } from './app.js';

// 自定义元素
class MyElement extends HTMLElement {
    // 声明需要监听的属性名，只有这些属性名变化时才会触发 attributeChangedCallback
    static get observedAttributes () {
        return ['name', 'url'];
    }

    constructor () {
        super();
    }

    connectedCallback () {
        // 元素被插入到 dom 时运行，此时去加载子应用的静态资源并渲染
        console.log('micro-app is connected');

        /**
         * 创建微应用实例
         */
        const app = new CreateApp({
            name: this.name,
            url: this.url,
            container: this,
        });

        appInstanceMap.set(this.name, app); // 将微应用实例存储到 appInstanceMap 中
    }

    disconnectedCallback () {
        // 元素从 DOM 中删除时执行，此时进行一些卸载操作
        console.log('micro-app has disconnected');

        // 获取微应用实例
        const app = appInstanceMap.get(this.name);
        if (app) {
            // 如果有属性destory，则完全卸载应用包括缓存的文件
            app.unmount(this.hasAttribute('destory')); // 卸载微应用
        }
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        // 元素属性发生变化时执行，可以获取name,url 等属性的值
        console.log(`attribute ${attrName}: ${newVal}`);

        // 分别记录 name 和 url 的值
        if (attrName === 'name' && !this.name && newVal) {
            this.name = newVal;
        } else if (attrName === 'url' && !this.url && newVal) {
            this.url = newVal;
        }
    }
}

/**
 * 注册元素
 * 注册后，就可以像普通元素一样使用 micro-app, 当 micro-app 元素被插入或删除 DOM 时即可触发相应的生命周期函数
 */
export function defineElement () {
    if (!window.customElements.get('micro-app')) {
        window.customElements.define('micro-app', MyElement);
    }
}