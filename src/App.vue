<template>
  <div id="app">
    <!-- <div>{{ $store.state.age }}</div>
    <div>{{ $store.getters.getOldAge }}</div> -->
    <!-- <button @click="addAge">加age</button> -->
  </div>
</template>

<script>
export default {
  name: "App",
  data: {},
  components: {},
  mounted() {},

  methods: {
    addAge() {
      this.$store.state.age += 1;
    },
    addTimeAge() {
      this.$store.commit("changeAge", 10);
    },
  },
};
</script>

<style></style>
