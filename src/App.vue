<template>
  <div id="app">
    <div>{{ $store.state.age }}</div>
    <div>{{ $store.getters.getAge }}</div>
    <button @click="addAge">加age</button>
    <button @click="addTimeAge">过一段时间</button>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
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
