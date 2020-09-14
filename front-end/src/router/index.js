import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from './auth'

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
        meta: { 
          auth: [1, 2],
          authInRoom: [1, 2]
        }
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

router.beforeEach(auth)

export default router
