import Vue from 'vue'
import App from './App.vue'
import './styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router/router.js'

Vue.config.productionTip = false

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('itcast_login_token')
  if (token || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
