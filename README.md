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
  import './styles/index.less'
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

## 3.登录组件

- ### 下载-引入-使用element-ui

  下载  **npm i element-ui -S**

  在 **main.js** 中 引入

  ```js
  import './styles/element.less'
  import ElementUI from 'element-ui'
  
  Vue.use(ElementUI)
  ```

  在 **login.vue** 中 >> **element-ui  form表单 - Input输入框**

  ```vue
  <div class="login">
      <div class="container">
          <img src="../assets/avatar.png" class="avatar">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="myicon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="myicon-key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  ```

  ```js
  export default {
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    }
  }
  ```

  设置二次验证 -- 点击 登陆按钮

  ```js
  methods: {
      login () {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            console.log(111)
          } else {
            this.$message.warning('请输入必填项！')
          }
        })
      }
    }
  ```

  

- ### 登录业务

  - #### 封装axios

    下载  **npm install axios**

    创建 **utils** 文件夹，创建 **myaxios.js** 

    ```
    import axios from 'axios'
    
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    
    export default axios
    ```

  - **login**组件的**axios** 请求

    创建 **utils** 文件夹，创建 **loginIndex.js**

    ```js
    import axios from '@/utils/myaxios.js'
    
    export const login = (data) => {
      return axios({
        method: 'post',
        url: 'login',
        data
      })
    }
    ```

  - **login.vue** 引入并验证
  
    ```js
    methods: {
        login () {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              login(this.loginForm)
                .then(res => {
                  if (res.data.meta.status === 200) {
                    localStorage.setItem('itcast_login_token', res.data.data.token)
                    this.$router.push({ name: 'home' })
                  } else {
                    this.$message.warning(res.data.meta.msg)
                  }
                })
                .catch(() => {
                  this.$message.error('服务器错误，请稍后再试！')
                })
            } else {
              this.$message.warning('请输入必填项！')
            }
          })
        }
      }
    ```
  
    
  
  - **导航守卫**
  
    在 **main.js** 中
  
    ```js
    router.beforeEach((to, from, next) => {
      let token = localStorage.getItem('itcast_login_token')
      if (token || to.path === '/login') {
        next()
      } else {
        next('/login')
      } 
    })
    ```
  
    