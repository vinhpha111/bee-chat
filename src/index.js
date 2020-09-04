import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
Vue.use(VueRouter)
let routes = new VueRouter([
	{
		path: '/',
    	component: require('./App.vue')
	}
])
new Vue({
  el: '#app',
  router: routes,
  render: h => h(App),
})