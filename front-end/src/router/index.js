import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { auth: [1, 2] }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/index.vue'),
    meta: { auth: [1] }
  },

  {
    path: '/*',
    name: 'error_404',
    component: () => import('../views/Error404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let auth = to.meta.auth
  let currentUser = store.getters.getUserInfo
  if (auth) {
    if (currentUser && auth.indexOf(currentUser.role) !== -1) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else if (currentUser && to.name === 'Login') {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
