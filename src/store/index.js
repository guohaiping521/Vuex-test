import Vue from 'vue'
import Vuex from '../vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    age: 10,
    oldAge: 11
  },
  getters: {
    getAge(state) {
      console.log("执行了getAge");
      return state.age;
    },
    getOldAge(state) {
      console.log("执行了 getOldAge");
      return state.oldAge + 10;
    }
  },
  mutations: {
    changeAge(state, data) {
      console.log("data");
      state.age += data;
    },
    changeName(state, data) {
      state.name = data + "更改了";
    }
  },
  actions: {
    changeAge({ commit }, data) {
      setTimeout(() => {
        commit("changeAge", data)
      }, 2000
      );
    }
  },
  modules: {
  }
})
