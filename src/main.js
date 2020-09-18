import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueInputAutowidth from 'vue-input-autowidth'
import VueCurrencyInput from 'vue-currency-input'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueInputAutowidth)
Vue.use(VueCurrencyInput)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
