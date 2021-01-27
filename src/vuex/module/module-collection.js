import Module from "./module";
import { forEach } from "../util"
export default class ModuleCollection {
    constructor(options) {
        this.register([], options);
    }
    register(path, options) {
        let module = new Module(options);
        if (path.length === 0) {//根部
            this.root = module;
        } else {//子孩子
            //path==>moduleA   parent==>root  addChild  moduleA
            //path==>["moduleA", "moduleC"]   root.getChild(moduleA)==>addChild
            //以此类推
            //上一次的返回值   当前的值
            let parent = path.slice(0, -1).reduce((prev, currentValue) => {
                return prev.getChild(currentValue);
            }, this.root)
            parent.addChild(path[path.length - 1], module);
        }
        forEach(options.modules, (fn, fnName) => {
            this.register([...path, fnName], fn);
        })
    }
}