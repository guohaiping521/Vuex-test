import applyMixin from "./mixin"
import ModuleCollection from "./module/module-collection"
import { forEach } from "./util"
let Vue;
function installModule(store, rootState, modules) {
    modules.forEachMutations((mutation, fnName) => {
        store._mutations.push((data) => {
            mutation.call(store, state, data);
        });
    })
    modules.forEachActions((action, fnName) => {
        store._actions.push((data) => {
            action.call(store, state, data);
        });
    })
    modules.forEachGetters((getter, fnName) => {
        store._wrappedGetters.push((data) => {
            getter.call(store, state, data);
        });
    })
    modules.forEachChild((module, fnName) => {
        installModule(store, module.state, module);
    })
}
class Store {
    constructor(options) {
        this._mutations = [];
        this._actions = [];
        this._wrappedGetters = [];
        //1.收集用户传入的参数，树形结构
        let moduleCollection = new ModuleCollection(options);
        //2.安装模块，属性定义在store上
        installModule(this, moduleCollection.state, moduleCollection.root);
        console.log(moduleCollection.root);
        this.getters = options.getters;
        this.mutations = options.mutations;
        this.actions = options.actions;
        let computed = {}
        this._mutations = []
        this._actions = []
        let state = options.state;
        forEach(this.getters, (getterFn, fnName) => {
            computed[fnName] = () => {
                return getterFn(state);
            };
            Object.defineProperty(this.getters, fnName, {
                get: () => {
                    return this._vm[fnName];
                }
            });
        });
        forEach(this.mutations, (mutationFn, fnName) => {
            this._mutations[fnName] = (data) => {
                mutationFn(state, data);
            };
        });
        forEach(this.actions, (actionFn, fnName) => {
            this._actions[fnName] = (data) => {
                actionFn(this, data);
            };
        });
        //补充get与set方法，不然无法监听变化
        this._vm = new Vue({
            data() {
                return {
                    $$state: state
                }
            },
            computed
        })
    }
    commit = (fnName, data) => {
        this._mutations[fnName](data)
    }
    dispatch = (fnName, data) => {
        this._actions[fnName](data)
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