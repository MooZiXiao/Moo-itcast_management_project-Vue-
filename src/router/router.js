import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/user/users.vue'
import RightsList from '@/views/rights/rightsList.vue'
import RolesList from '@/views/rights/rolesList.vue'
import Orders from '@/views/orders/orders.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'rights',
          path: 'rights',
          component: RightsList
        },
        {
          name: 'roles',
          path: 'roles',
          component: RolesList
        },
        {
          name: 'orders',
          path: 'orders',
          component: Orders
        }
      ]
    }
  ]
})
