import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    user:null
  },
  mutations: {
    login(state,user) {
      state.isLogin = true;
      state.user = user;
    },
    logout(state) {
      state.isLogin = false;
      state.user = null
    }
  },
  actions: {

  }
})
