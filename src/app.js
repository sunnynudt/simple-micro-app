


/**
 * 创建微应用实例
 * 很显然，初始化操作要放在 connectedCallback 中 执行。
 * 我们声明一个类，它的每一个实例都代表一个微应用，用于控制微应用的资源加载、渲染和卸载等。
 * 这个类的实例会在 connectedCallback 中被创建。
 */
export default class CreateApp {
    constructor() {}

    status = 'created'; // 组件状态，created,loading,mount,unmount

    // 存放应用的静态资源
    source = {
        links: new Map(), // link元素对应的静态资源
        scripts: new Map(), // script元素对应的静态资源
    }

    /**
     * 资源加载完时执行
     */
    onLoad () {

    }

    /**
     * 资源加载完后进行渲染
     */
    mount () {

    }

    /**
     * 卸载应用
     * 执行关闭沙箱、清空缓存等操作
     */

    unmount () {

    }
}

export const appInstanceMap = new Map(); // 存放微应用实例