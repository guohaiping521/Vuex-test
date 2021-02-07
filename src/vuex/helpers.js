export const mapState = (arrayList) => {
    let obj = {};
    arrayList.forEach((item) => {//this指向谁调用就是谁的
        obj[item] = function () {
            return this.$store.state[item];
        };
    });
    return obj;
};
export const mapGetters = (arrayList) => {
    let obj = {};
    arrayList.forEach((item) => {
        obj[item] = function () {
            return this.$store.getters[item];
        };
    });
    return obj;
};
export const mapMutations = (arrayList) => {
    let obj = {};
    arrayList.forEach((item) => {
        obj[item] = function (payload) {
            return this.$store.commit(item, payload);
        };
    });
    console.log("obj===", obj);
    return obj;
};
export const mapActions = (arrayList) => {
    let obj = {};
    arrayList.forEach((item) => {
        obj[item] = function (payload) {
            return this.$store.dispatch(item, payload);
        };
    });
    console.log("obj===", obj);
    return obj;
};
