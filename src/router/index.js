import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Account from '../views/Account.vue'

import store from '../store'
import auth from '../api/auth'

Vue.use(VueRouter)

function ifNotAuthenticated(to, from, next) {
  if (!store.isLoggedIn()) {
    next()
  } else {
    next('/')
  }
}

function ifAuthenticated(to, from, next) {
  if (store.isLoggedIn()) {
    store.maybeFirstLoad()
    next()
  } else {
    next('/login')
  }
}

function checkOAuthCallback(to, from, next) {
  const token = auth.tryParseToken(to.path)
  if (token) {
    store.login(token)
    next('/')
  } else {
    next()
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
  {
    path: '/account/:id',
    name: 'Account',
    component: Account,
    beforeEnter: ifAuthenticated,
    props: true,
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(checkOAuthCallback)

export default router
