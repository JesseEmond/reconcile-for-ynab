import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

import store from '../store'

Vue.use(VueRouter)

function ifNotAuthenticated(to, from, next) {
  if (!store.ynab) {
    next()
  } else {
    next('/')
  }
}

function ifAuthenticated(to, from, next) {
  if (store.ynab) {
    next()
  } else {
    next('/login')
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated,
  },
]

const router = new VueRouter({
  routes
})

export default router
