import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
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
    path: '/',
    meta: { auth: [1, 2] },
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/',
        name: 'Index',
        component:() => import('../views/Index.vue'),
        meta: { auth: [1, 2] }
      },
      {
        path: '/room/add',
        name: 'Room',
        component: () => import('../views/room/add.vue'),
        meta: { auth: [1, 2] }
      },
      {
        path: '/room/:slug',
        name: 'Room',
        component: () => import('../views/room/index.vue'),
        meta: { auth: [1, 2] }
      }
    ]
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

router.beforeEach(async (to, from, next) => {
  let auth = to.meta.auth
  let currentUser = store.getters.getUserInfo
  if (!currentUser) {
    try {
      const userResponse = await store.dispatch('getUser')
      if (userResponse) {
        currentUser = userResponse.data
        store.commit('setUserInfo', currentUser)

        // join socket
        await store.dispatch('instanceSocket', 'http://localhost:4000').then(function(){
          console.log('has connect socket');
        })
        store.dispatch('emitSocketCallback', {on: 'join', token: store.getters.getToken}).then(res => {
          console.log(res)
        }).catch(function(err){
          console.log(err)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

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
