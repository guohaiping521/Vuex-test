<template>
  <div id="app">
    <div>{{ $store.state.age }}</div>
    <div>{{ $store.getters.getAge }}</div>
    <button @click="addAge">同步加age</button>
    <button @click="addTimeAge">异步加age</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data: {},
  components: {},
  mounted() {
    // console.log("mounter===",this.$store.getters);
  },

  methods: {
    addAge() {
      this.$store.commit("changeAge", 10);
    },
    addTimeAge() {
      this.$store.dispatch("changeAge", 10);
    },
  },
};
</script>

<style></style>
