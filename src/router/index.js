import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Account from '../views/Account.vue'
import Privacy from '../views/Privacy.vue'

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

async function ifAuthenticated(to, from, next, blocking) {
  if (store.isLoggedIn()) {
    const firstLoad = store.maybeFirstLoad()
    if (blocking) {
      await firstLoad
    }
    next()
  } else {
    next('/login')
  }
}

async function ifAuthenticatedBlockingLoad(to, from, next) {
  return ifAuthenticated(to, from, next, /*blocking=*/true)
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
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/account/:id',
    name: 'Account',
    component: Account,
    beforeEnter: ifAuthenticatedBlockingLoad,
    props: true,
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(checkOAuthCallback)

export default router
