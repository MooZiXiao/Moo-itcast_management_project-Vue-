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
                    // 需创建 home 组件
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
  
  - 在 views 文件夹中创建 **home.vue**
  
    ```vue
    <template>
        <div class="home">
            首页
        </div>
    </template>
    <script>
    export default {
        
    }
    </script>
    <style lang="less" scoped>
    
    </style>
    ```
  
  - 添加路由 **/router.js**
  
    ```js
    {
      name: 'home',
      path: '/home',
      component: Home
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
        next({ path: '/login' })
      } 
    })
    ```
  

##4.后台home组件的制作 

- ### element-ui 搭建

  #### >>Container 布局容器

  ```html
  <el-container>
    <!-- 左边菜单项 -->
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>Header</el-header>
      <!-- 坑 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
  ```

  ####>>NavMenu 导航菜单

  **unique-opened  是否只保持一个子菜单的展开  boolean**

  **router  是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转    boolean**

  ```html
  <!-- 左边菜单项 -->
  <el-aside width="200px">
      <el-menu
               :router='true'
               :unique-opened='true'
               class="el-menu-vertical-demo"
               @open="handleOpen"
               @close="handleClose"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               >
          <el-submenu index="1">
              <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
              </template>
              <el-menu-item index="1-1">用户列表</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
              <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航二</span>
              </template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
      </el-menu>
  </el-aside>
  ```

  - 设置 icon图标 - 加入logo

    部分代码

    ```html
    <h1><a href="javascript:;">LOGO</a></h1>
    -------------------------------------------------
    <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="1-1">
            <template slot="title">
              <i class="el-icon-check"></i>
              <span>用户列表</span>
            </template>
          </el-menu-item>
          <el-menu-item index="1-2">
            <template slot="title">
              <i class="el-icon-check"></i>
              <span>选项2</span>
            </template>
          </el-menu-item>
      </el-submenu>
    ```

    

  - 设置对应样式

    ```css
    .home {
      height: 100%;
      .el-menu-admin:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
      }
      .el-container {
        height: 100%;
      }
      .el-aside {
        background-color: #545c64;
      }
      .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #545c64;
      }
      h1 a{
        display: block;
        width: 200px;
        height: 59px;
        text-indent: -9999px;
        background: url('../assets/logo.png') -20px,#fff ;
        background-size: 240px 59px;
        &:hover {
          background-color: #f1f1f1;
        }
      }
      .toggle-btn {
        padding: 0 15px;
        margin-left: -20px;
        font-size: 36px;
        color: white;
        cursor: pointer;
        line-height: 60px;
        &:hover {
          background-color: #4292CF;
        }
      }
      .system-title {
        font-size: 28px;
        color: white;
      }
      .exit{
        color: white;
      }
    }
    ```

  - ### 头部部分

    ```html
    <el-header>
      <a href="javascript:;" class="toggle-btn myicon-menu"></a>
      <h2 class="system-title">木一了后台管理</h2>
      <a href="javascript:;" class="exit">退出</a>
    </el-header>
    ```

  - ### home组件默认显示welcome组件信息

    - #### 创建welcome组件

      ```html
      <template>
          <div class="welcome">
              欢迎来到木一了后台管理
          </div>
      </template>
      <style lang="less" scoped>
      
      </style>
      ```

    - ### 配置路由 /router.js

      ```js
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
          }
        ]
      }
      ```

      

## 5.用户列表

- ### 用户列表组件制作

  #### >>用户列表创建

  ```html
  <template>
      <div class="userList">
          用户列表
      </div>
  </template>
  <script>
  export default {
      
  }
  </script>
  <style lang="less" scoped>
  
  </style>
  
  ```

  #### >>路由配置 - router.js

  ```js
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
            name: 'userlist',
            path: 'userlist',
            component: UserList
          }
        ]
      }
    ]
  }
  ```

  #### >>home.vue菜单的修改

  ```html
  // 修改index为对应跳转的路由
  <el-menu-item index="/home/userList">
  ```

- ### 用户列表的制作

  #### >>面包屑 --  Breadcrumb 面包屑

  ```html
  <el-breadcrumb separator-class="el-icon-caret-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>
  ```

  ####>> 搜索 + 添加按钮 -- Input 输入框 + Button 按钮

  ```html
  <div style="margin-top: 15px;">
    <el-input placeholder="请输入内容" class="input-with-select" style="width:300px;margin-right:12px;">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success">添加</el-button>
  </div>
  ```

  #### >>表格 -- Table 表格 + Switch 开关 + Button 按钮 + Tooltip 文字提示

  ```html
  <el-table border :data="tableData" style="width: 100%; margin-top:15px">
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="date" label="姓名" width="120"></el-table-column>
    <el-table-column prop="name" label="邮箱" width="160"></el-table-column>
    <el-table-column prop="address" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template>
        <el-switch active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="320">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
          <el-button type="primary" plain icon="el-icon-edit"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="分配" placement="top-start">
          <el-button type="info" plain icon="el-icon-plus"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <el-button type="warning" plain icon="el-icon-delete"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  ```

  