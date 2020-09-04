import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './css/main.module.css'

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
  render: h => h(App)
}).$mount('#app')
