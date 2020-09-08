import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import i18n from './i18n'
import './css/w3.css'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:4000/api/'

axios.interceptors.request.use(function (config) {
  const token = store.getters.getToken;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

new Vue({
  router,
  store,
  axios,
  i18n,
  render: h => h(App)
}).$mount('#app')
