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
    }

    disconnectedCallback () {
        // 元素从 DOM 中删除时执行，此时进行一些卸载操作
        console.log('micro-app has disconnected');
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        // 元素属性发生变化时执行，可以获取name,url 等属性的值
        console.log(`attribute ${attr}: ${newVal}`);
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