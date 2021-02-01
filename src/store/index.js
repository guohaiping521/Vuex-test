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
      return state.age;
    },
    getOldAge(state) {
      return state.oldAge;
    }
  },
  mutations: {
    changeAge(state, data) {
      state.age += data;
      console.log("执行了changeAge", state.age);
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
    moduleA: {
      state: {
        moduleAge: 30,
        moduleAoldAge: 11
      },
      getters: {
        getMAge(state) {
          console.log("执行了getAge");
          return state.age;
        },
        getMoldAge(state) {
          console.log("执行了 getOldAge");
          return state.oldAge + 10;
        }
      },
      mutations: {
        changeMage(state, data) {
          console.log("data");
          state.age += data;
        },
        changeMname(state, data) {
          state.name = data + "更改了";
        }
      },
      actions: {
        changeMage({ commit }, data) {
          setTimeout(() => {
            commit("changeAge", data)
          }, 2000
          );
        }
      },
      modules: {
        moduleC: {
          state: {
            moduleAge: 10,
            moduleAoldAge: 11
          },
          modules: {
            moduleD: {
              state: {
                moduleAge: 10,
                moduleAoldAge: 11
              }
            }
          }
        },
      }
    },
    moduleB: {
      state: {
        bAge: 10,
        boldAge: 11
      },
      getters: {
        getBage(state) {
          console.log("执行了getAge");
          return state.age;
        },
        getBoldAge(state) {
          console.log("执行了 getOldAge");
          return state.oldAge + 10;
        }
      },
      mutations: {
        changeBage(state, data) {
          console.log("data");
          state.age += data;
        },
        changeBname(state, data) {
          state.name = data + "更改了";
        }
      },
      actions: {
        changeBage({ commit }, data) {
          setTimeout(() => {
            commit("changeAge", data)
          }, 2000
          );
        }
      },
    }
  }
})
//1.默认模块没有作用域问题
//2.状态不要和模块的名称相同
//3.计算属性直接通过getts取值
//4.如果增加namespaced: true会将这个模块的属性都封装在作用域下
//5.默认会找当前模块是哪个是否有namespaced，并且将父级的namespaced一同算上
