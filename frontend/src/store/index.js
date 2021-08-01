import Vue from 'vue'
import Vuex from 'vuex'
import APICalls from '@/services/APICalls.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: '',
    currentGreenhouse: null,
  },
  mutations: {
    SET_USER_DATA (state, userData) {
      console.log('setting user data');
      console.log(userData);
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData))
      if(userData.token) {
        state.token = userData.token;
      }
    },
    SET_CURRENT_GREENHOUSE (state, greenhouseId) {
      console.log('setting currentGreenhouse');
      state.currentGreenhouse = greenhouseId;
      console.log(`currentGreenhouse: ${state.currentGreenhouse}`);
    },
    CLEAR_USER_DATA () {
      // state.user = null
      // state.token = ''
      localStorage.removeItem('user');
      location.reload();
    }
  },
  actions: {
    register ({ commit }, credentials) {
      APICalls.setUserData(credentials)
        .then(({ data }) => {
          console.log(data)
          commit('SET_USER_DATA', data)
        })
    },
    login ({ commit }, credentials) {
      console.log("credentials" + credentials);
      console.log(credentials)
      return new Promise((resolve, reject) => {
        APICalls.login(credentials)
        .then(({ data }) => {
          console.log('adding data')
          resolve(commit('SET_USER_DATA', data))
        })
        .catch(error => {
          reject(error.response.data.errors)
        })
      })
    },
    logout({ commit }) {
      commit('CLEAR_USER_DATA')
    },
    setCurrentGreenhouse ({ commit }, greenhouseId) {
      commit('SET_CURRENT_GREENHOUSE', greenhouseId)
    }
  },
  getters: {
    loggedIn (state) {
      return !!state.user;
    }
  }
})
