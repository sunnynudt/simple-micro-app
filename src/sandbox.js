export default class Sandbox {
    active = false; // 沙箱是否正在运行
    microWindow = {}; // 代理的对象
    injectedKeys = new Set(); // 新添加的属性，在卸载时清空

    constructor() {
        this.proxyWdinow = new Proxy(this.microWindow, {
            get: (target, key) => {
                // 优先从代理对象上取值
                if (Reflect.has(target, key)) {
                    return Reflect.get(target, key);
                }

                // 否则兜底到window对象上取值
                const rawValue = Reflect.get(window, key);

                // 如果兜底的值是函数，则需要绑定window对象，如 consle, alert等
                if (typeof rawValue === 'function') {
                    const valueString = rawValue.toString();
                    // 排除构造函数
                    if (!/^function\s+[A-Z]/.test(valueString) && !/^class\s+/.test(valueString)) {
                        return rawValue.bind(window);
                    }
                }

                return rawValue;
            },

            set: (target, key, value) => {
                // 沙箱只有在运行时可以设置变量
                if (this.active) {
                    Reflect.set(target, key, value);

                    // 记录添加的变量，用于后续清空操作
                    this.injectedKeys.add(key);
                }

                return true;
            },

            deleteProperty: (target, key) => {
                // 当前key存在于代理对象上时，才能满足删除条件
                if (target.hasOwnProperty(key)) {
                    return Reflect.deleteProperty(target, key);
                }

                return true;
            }
        })
    }
    
    // 启动
    start () {
        if (!this.active) {
            this.active = true;
        }
    }

    // 停止
    stop () {
        if (this.active) {
            this.active = false;

            // 清空新添加的属性
            this.injectedKeys.forEach(key => {
                Reflect.deleteProperty(this.microWindow, key);
            });

            this.injectedKeys.clear();
        }
    }

    // 修改js作用域
    bindScope (code) {
        window.proxyWdinow = this.proxyWdinow;
        return `;(
            function(window, self) {
                with(window) {
                    ;${code}\n
                }
            }
        ).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`
    }
}