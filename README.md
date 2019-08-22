# itcast_management_project

## npm install -g @vue/cli  --  下载脚手架

## npm create 项目名称 -- 下载项目

## 1.配置项目

- ### 删除不需要的文件、图片 -- Helloword.vue等

- ### 删除对应的代码

- ### 将myfonts文件夹及图片加到assets文件夹中

- ### 将styles文件夹加到src文件夹中

- ### main.js中引入index.less

  ```js
  import './styles/element.less'
  ```

##2.封装路由

- ### 创建login.vue

  在**views**文件夹中创建**login.vue**

- ### 下载、引入等路由操作（封装）

  下载 **npm i vue-router**

  在**router**文件夹中创建**router.js**

  并映射下一组件（login）

  ```js
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import Login from '@/views/login.vue'
  
  Vue.use(VueRouter)
  
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
      }
    ]
  })
  ```

  在**main.js**中

  ```js
  import router from '@/router/router.js'
  
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
  ```

  在**App.vue**中

  ```vue
  <div id="app">
  	<router-view />
  </div>
  ```