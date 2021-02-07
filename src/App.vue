<template>
  <div id="app">
    <div>{{ age }}</div>
    <div>{{ getAge }}</div>
    <button @click="changeAge(1)">同步加age</button>
    <button @click="addTimeAge">异步加age</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "./vuex";
export default {
  name: "App",
  data: {},
  computed: {
    ...mapState(["age"]),
    ...mapGetters(["getAge"]),
  },
  methods: {
    ...mapMutations(["changeAge"]), //拓展运算符
    addTimeAge() {
      this.$store.dispatch("changeAge", 10);
    },
  },
};
//拓展运算符
const obj1 = {
  a: 1,
};
const obj2 = {
  b: 1,
};
let obj3 = {
  ...obj1,
  ...obj2,
};
console.log("obj3===", obj3);
</script>

<style></style>
