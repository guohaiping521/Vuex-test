import applyMixin from "./mixin"
import { forEach } from "./util"
let Vue;

class Store {
    constructor(options) {
        this.getters = options.getters;
        this.mutations = options.mutations;
        this.actions = options.actions;
        let computed = {}
        this._mutations = []
        this._actions = []
        let state=options.state;
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