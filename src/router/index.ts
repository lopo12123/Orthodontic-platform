import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // default url => redir
  {
    path: '/',
    redirect: '/login'
  },

  // lazy-load belows
  {  // login page
    path: '/login',
    name: 'Login',
    component: () => import('@/views/loginPage.vue'),
    meta: {
      title: 'Welcome'
    }
  },
  {  // list page
    path: '/list',
    name: 'List',
    component: () => import('@/views/listPage.vue'),
    meta: {
      title: 'List'
    }
  },
  {  // view page
    path: '/view',
    name: 'View',
    component: () => import('@/views/viewPage.vue'),
    meta: {
      title: 'View'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
