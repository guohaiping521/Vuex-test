const applyMixin = (Vue) => {
    //执行两次（App.vue/main.js）
    Vue.mixin({
        beforeCreate: vueInit
    });
}
function vueInit() {
    let options = this.$options;
    if (options.store) {
        this.$store = options.store
    } else if (options.parent) {
        this.$store = options.parent.$store;
    }
}

export default applyMixin;