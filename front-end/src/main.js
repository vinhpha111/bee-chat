import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import i18n from './i18n'
import _ from 'lodash'
import './css/w3.css'

Object.defineProperty(Vue.prototype, '$_', { value: _ });

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:4000/api/'

axios.interceptors.request.use(function (config) {
  const token = store.getters.getToken;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
      // Reject promise if usual error
      if (error.response.status !== 498) {
          return Promise.reject(error);
      }

      if (!store.getters.beingRefreshToken && store.getters.getRefreshToken) {
        await store.commit('setBeingRefreshToken', true)
        store.dispatch('getToken').then(res => {
          store.commit('setToken', res.data.token)
          store.commit('setRefreshToken', res.data.refreshToken)
          store.commit('setBeingRefreshToken', false)
        }).catch(() => {
          store.commit('setToken', '')
          store.commit('setRefreshToken', '')
          store.commit('setBeingRefreshToken', '')
        })
      }
      
      await timeout(500)

      if (store.getters.getToken || store.getters.beingRefreshToken) {
        error.response.config.headers['Authorization'] = 'Bearer ' + store.getters.getToken;
        return axios(error.response.config);
      }

      return Promise.reject(error);
  }
)

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

new Vue({
  router,
  store,
  axios,
  i18n,
  render: h => h(App)
}).$mount('#app')
