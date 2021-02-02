import applyMixin from "./mixin"
import ModuleCollection from "./module/module-collection"
import { forEach } from "./util"
let Vue;

function installModule(store, rootState, path, modules) {
    let nameSpaced = store._modules.getNamespaced(path);
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((prev, currentValue) => {
            return prev[currentValue]
        }, rootState)
        //会区分是否为响应式数据
        Vue.set(parent, path[path.length - 1], modules.state);
    }
    modules.forEachMutations((mutation, fnName) => {
        store._mutations[nameSpaced + fnName] = store._mutations[nameSpaced + fnName] || []
        store._mutations[nameSpaced + fnName].push((data) => {
            mutation.call(store, modules.state, data);
            store._subscribers.forEach(sub => {

                sub({ mutation, fnName }, store.state);
            });

        })
    })
    modules.forEachActions((action, fnName) => {
        store._actions[nameSpaced + fnName] = store._actions[nameSpaced + fnName] || []
        store._actions[nameSpaced + fnName].push((data) => {
            action.call(store, rootState, data);
        });
    })
    modules.forEachGetters((getter, fnName) => {
        store._wrappedGetters[nameSpaced + fnName] = function () {
            //加上返回，不然undefined
            return getter.call(store, modules.state);
        }
    })

    modules.forEachChild((module, fnName) => {
        installModule(store, rootState, [...path, fnName], module);
    })
}
function restoreVm(store, state) {
    let computed = {}
    let oldVm = store._vm;
    store.getters = {}
    forEach(store._wrappedGetters, (getterFn, fnName) => {
        computed[fnName] = function () {//精华所在
            return getterFn()
        }
        Object.defineProperty(store.getters, fnName, {
            get: () => {
                return store._vm[fnName];//精华所在
            }
        })
    })
    store._vm = new Vue({
        data() {
            return {
                $$state: state
            }
        },
        computed
    })
    if (oldVm) {
        Vue.nextTick(() => {
            oldVm.$destroy()
        })
    }
}
class Store {
    constructor(options) {
        this._mutations = [];
        this._actions = [];
        this._wrappedGetters = [];
        this._subscribers = []
        //1.收集用户传入的参数，树形结构
        this._modules = new ModuleCollection(options);
        let state = this._modules.root.state;
        //2.安装模块，属性定义在store上
        installModule(this, state, [], this._modules.root);
        restoreVm(this, state);
        //插件的实现
        options.plugins.forEach(fn => {
            fn(this)
        });
    }
    commit = (fnName, data) => {
        forEach(this._mutations[fnName], (mutation, fnName) => {
            return mutation(data);//仅需要这个参数，不需要传state（基础不扎实）
        })
    }
    dispatch = (fnName, data) => {
        forEach(this._actions[fnName], (action, fnName) => {
            return action(data);
        })
    }
    get state() {
        return this._vm._data.$$state;
    }
    registerModule(path, options) {
        if (typeof path == 'string') path = [path]
        this._modules.register(path, options);
        installModule(this, this._modules.root.state, [], this._modules.newModule);
        restoreVm(this, this._modules.root.state);
    }
    subscribe(fn) {
        this._subscribers.push(fn)
    }
    replaceState(newState) {
        this._vm._data.$$state = newState;
    }
}
const install = (plugin) => {
    Vue = plugin
    applyMixin(plugin);
}

export {
    Store,
    install
}