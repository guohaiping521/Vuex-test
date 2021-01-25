import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    age: 10
  },
  getters: {
    getAge(state) {
      return state.age;
    }
  },
  mutations: {
    changeAge(state, data) {
      state.age += data;
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
