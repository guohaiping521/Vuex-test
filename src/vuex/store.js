import applyMixin from "./mixin"
import ModuleCollection from "./module/module-collection"
import { forEach } from "./util"
let Vue;
function installModule(store, rootState, path, modules) {
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((prev, currentValue) => {
            return prev[currentValue]
        }, rootState)
        //会区分是否为响应式数据
        Vue.set(parent, path[path.length - 1], modules.state);
    }
    modules.forEachMutations((mutation, fnName) => {
        store._mutations[fnName] = store._mutations[fnName] || []
        store._mutations[fnName].push((data) => {
            return mutation.call(store, modules.state, data);
        })
    })
    modules.forEachActions((action, fnName) => {
        store._actions[fnName] = store._actions[fnName] || []
        store._actions[fnName].push((data) => {
            action.call(store, rootState, data);
        });
    })
    modules.forEachGetters((getter, fnName) => {
        store._wrappedGetters[fnName] = function () {
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
}
class Store {
    constructor(options) {
        this._mutations = [];
        this._actions = [];
        this._wrappedGetters = [];

        //1.收集用户传入的参数，树形结构
        let moduleCollection = new ModuleCollection(options);
        let state = moduleCollection.root.state;
        //2.安装模块，属性定义在store上
        installModule(this, state, [], moduleCollection.root);
        restoreVm(this, state);
        console.log(state);
        //     this.getters = options.getters;
        //     this.mutations = options.mutations;
        //     this.actions = options.actions;
        //     let computed = {}
        //     this._mutations = []
        //     this._actions = []
        //     let state = options.state;
        //     forEach(this.getters, (getterFn, fnName) => {
        //         computed[fnName] = () => {
        //             return getterFn(state);
        //         };
        //         Object.defineProperty(this.getters, fnName, {
        //             get: () => {
        //                 return this._vm[fnName];
        //             }
        //         });
        //     });
        //     forEach(this.mutations, (mutationFn, fnName) => {
        //         this._mutations[fnName] = (data) => {
        //             mutationFn(state, data);
        //         };
        //     });
        //     forEach(this.actions, (actionFn, fnName) => {
        //         this._actions[fnName] = (data) => {
        //             actionFn(this, data);
        //         };
        //     });
        //     //补充get与set方法，不然无法监听变化
        //     this._vm = new Vue({
        //         data() {
        //             return {
        //                 $$state: state
        //             }
        //         },
        //         computed
        //     })
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
}
const install = (plugin) => {
    Vue = plugin
    applyMixin(plugin);
}

export {
    Store,
    install
}