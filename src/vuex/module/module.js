import { forEach } from "../util"
export default class Module {
    constructor(options) {
        this.state = options.state;
        this._children = {};
        this._rawModule = options;
    }
    addChild(key, module) {
        this._children[key] = module;
    }
    getChild(key) {
        return this._children[key]
    }
    forEachMutations(fn) {
        if (this._rawModule.mutations) {
            forEach(this._rawModule.mutations, fn)
        }
    }
    forEachActions(fn) {
        if (this._rawModule.actions) {
            forEach(this._rawModule.actions, fn)
        }
    }
    forEachGetters(fn) {
        if (this._rawModule.getters) {
            forEach(this._rawModule.getters, fn)
        }
    }
    forEachChild(fn) {
        if (this._children) {
            forEach(this._children, fn)
        }
    }
}
