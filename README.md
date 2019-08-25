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

## 2.封装路由

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
  

## 4.后台home组件的制作 

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

  #### >>NavMenu 导航菜单

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

  #### >> 搜索 + 添加按钮 -- Input 输入框 + Button 按钮

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

- ### 获得数据

  #### >>发送请求 -- api文件夹中创建userList.js

  ```js
  import axios from '@/utils/myaxios.js'
  
  // 获得所有用户数据
  export const getAllUsers = (params) => {
      return axios({
          url: 'users',
          params
      })
  }
  ```

  #### >>引入-使用

  ```js
  import { getAllUsers } from '@/api/userList.js'
  ----------------------------------------------
  // 添加参数对象
  // 传入的参数
  userobj: {
      query: '',
      pagenum: 1,
      pagesize: 3
  }
  ----------------------------------------------
  mouted(){
      getAllUsers(this.userobj)
          .then(res => {
          csonsole.log(res)
      })
          .catch(err => {
          console.log(err)
      })
  }
  ```

  #### >>拦截器

  > **由于 API V1 认证统一使用 Token 认证需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌**

  ```js
  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
      // 获得token
      let mytoken = localStorage.getItem('itcast_login_token')
      // mytoken 存在时
      if (mytoken) {
        //设置请求头
        config.headers.Authorization = mytoken
      }
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    })
  ```

  #### >>获得数据,显示数据

  #####获得数据

  ```js
  // 组件一加载就触发的钩子函数
  mounted () {
      getAllUsers(this.userobj)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            this.userData = res.data.data.users
          }
        })
        .catch(err => {
          console.log(err)
        })
  }
  ```

  ##### 显示数据

  ```html
  <el-table-column type="index" width="50"></el-table-column>
  	<el-table-column prop="username" label="姓名" width="120"></el-table-column>
  	<el-table-column prop="email" label="邮箱" width="160"></el-table-column>
  	<el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch active-color="#13ce66" v-model="scope.row.mg_state" inactive-color="#ff4949"></el-switch>
          </template>
      </el-table-column>}
  ```

- ### 查询功能

  #### >>封装getAllUsers请求 -- userList.vue

  ```js
    methods: {
      init () {
        getAllUsers(this.userobj)
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              this.userData = res.data.data.users
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    mounted () {
      this.init()
    }
  ```

  #### >>实现查询

  ```html
  <div style="margin-top: 15px;">
    <el-input
      placeholder="请输入内容"
      class="input-with-select"
      style="width:300px;margin-right:12px;"
      // 双向绑定传入的参数
      v-model="userobj.query"
      // 事件监听器
      @input.native='init'
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success">添加</el-button>
  </div>
  ```

- ### 分页

  #### >>分页制件 -- Pagination 分页

  ```html
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="userData.pagenum"
    :page-sizes="[1, 2, 3, 4]"
    :page-size="userobj.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
  ```

  #### >>数据、方法设置

  ```js
  // data 设置变量
  // 分页总记录数
  total: 0,
  --------------------------------------
  // methods
  // 分页
  handleSizeChange (val) {
    // 当前页显示几条
    this.userobj.pagesize = val
    // 调用请求
    this.init()
    // console.log(`每页 ${val} 条`)
  },
  handleCurrentChange (val) {
    this.userobj.pagenum = val
    this.init()
    // console.log(`当前页: ${val}`)
  }
  ```

- ### 用户添加

  **思想：**

  **首先需要点击‘添加’按钮**

  **然后按钮显示出添加dialog**

  **填入数据，通过表单rules验证数据**

  **点击dialog的确认按钮则需要进入二次验证输入的数据**

  **且调用添加用户的接口**

  **成功则给出对应提示，更新页面并重置表单**

  #### >>添加dialog - Dialog 对话框

  **加入dialog后还需要对表单加入验证等操作**
  
  ```html
  <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
    <el-form :model="addform" :label-width="'80px'" ref='addform' :rules='rules'>
      <el-form-item label="用户名称" prop='username'>
        <el-input v-model="addform.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop='password'>
        <el-input v-model="addform.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop='email'>
        <el-input v-model="addform.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop='mobile'>
        <el-input v-model="addform.mobile" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </div>
</el-dialog>
  ```

  #### ＞＞对应data数据

  ```js
  // 添加dialog boolean
  addDialogFormVisible: false,
  // 添加的数据对象
  addform: {
  	username: '',
  	password: '',
  	email: '',
  	mobile: ''
  },
  // 验证规则
  rules: {
  	username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  	password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
  	email: [{ pattern: /\w+[@]+\w+[.]+\w+/, message: '请输入正确的邮箱', trigger: 'blur' }],
  	mobile: [{ pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }]
  }
  ```
  
  #### >>设置添加接口 - userList.js
  
  ```js
  // 添加用户
  export const addUser = (data) => {
    return axios({
      method: 'post',
      url: 'users',
      data
    })
  }
  ```
  
  #### >>二次验证+(引入)调用接口 -- 实现添加
  
  ```js
  addUser () {
    // 二次验证
    this.$refs.addform.validate(valid => {
      if (valid) {
        addUser(this.addform)
          .then(res => {
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg)
              this.addDialogFormVisible = false
              this.init()
              this.$refs.addform.resetFields()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      } else {
        this.$message.warning('请输入必填项！')
      }
    })
  }
  ```

- ###  用户状态修改

  **思想：设置接口，点击swith开关，通过change事件返回新的状态值，调用接口传入参数，实现修改**

  #### >>设置接口 - userList.js

  ```js
  // 修改用户状态
  export const updateUserState = (type, id) => {
    return axios({
      method: 'put',
      url: `users/${id}/state/${type}`
    })
  }
  ```

  #### >>设置点击方法(传参)并调用接口

  ```html
  <el-switch active-color="#13ce66" v-model="scope.row.mg_state" inactive-color="#ff4949" @change="updateUserState(scope.row.mg_state, scope.row.id)"></el-switch>
  ```

  ```js
  // 修改用户状态
  updateUserState (type, id) {
    updateUserState(type, id)
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.init()
        } else {
          this.$message.error(res.data.meta.msg)
        }
      })
      .catch(() => {
        this.$message.error('用户状态修改失败')
      })
  }
  ```

- ### 用户编辑

  **思想: **

  **点击当前行的编辑按钮**

  **显示dialog对话框（则需先添加对应的对话框）**

  **通过自定义模板的slot-scope属性的scope来获得当前行数据，创建显示接口**

  **将对应的数据显示在对话框中**

  **设置对话框中输入的数据的验证**

  **创建编辑接口**

  **设置编辑点击事件调用接口，二次验证数据**

  **编辑成功关闭对话框，更新页面**

  #### >>编辑对话框设置 -- userList.vue

  ```html
  <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
    <el-form :model="editform" :label-width="'80px'" :rules='rules' ref="editform">
      <el-form-item label="用户名">
        <el-input v-model="editform.username" auto-complete="off" disabled style='width:88px'></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop='email'>
        <el-input v-model="editform.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop='mobile'>
        <el-input v-model="editform.mobile" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </div>
  </el-dialog>
  ```

  #### >>调用显示对话框方法（传参 -- scope.row）-- userList.vue -- methods

  ```js
  showEditDialog (row) {
    // 显示对话框
    this.editDialogFormVisible = true
    // 显示对应数据
    this.editform.username = row.username
    this.editform.id = row.id
    this.editform.email = row.email
    this.editform.mobile = row.mobile
  }
  ```

  #### >>设置编辑接口 -- userList.js

  ```js
  export const editUser = (data) => {
    return axios({
      method: 'put',
      url: `users/${data.id}`,
      data: { email: data.email, mobile: data.mobile }
    })
  }
  ```

  #### >>二次验证，调用编辑接口 -- userList.vue -- methods

  ```js
  // 编辑用户
  editUser () {
    this.$refs.editform.validate(valid => {
      if (valid) {
        editUser(this.editform)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.init()
              this.editDialogFormVisible = false
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      } else {
        this.$message.warning('请输入必填项')
      }
    })
  }
  ```

- ### 分配角色

  **思想 **

  **点击分配按钮，显示对话框**

  **对话框中显示用户名及角色选择**

  **角色选择需要设置获取所有角色接口**

  **通过组件一加载便调用获取所有角色的接口，使之显示在对应对话框中**

  **设置分配角色修改的接口**

  **通过点击调用，成功关闭对话框并更新页面**

  #### >>设置对话框 -- userList.vue

  ```html
  <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
    <el-form :model="grantform" :label-width="'80px'">
      <el-form-item label="用户名">
        <el-input v-model="grantform.username" auto-complete="off" disabled style="width:80px"></el-input>
      </el-form-item>
      <el-form-item label="选择">
      <el-select v-model="grantform.rid" clearable placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.value"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="grantDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateUserRole">确 定</el-button>
    </div>
  </el-dialog>
  ```

  #### >>设置获得所有角色接口 -- /api/roleIndex.js

  ```js
  export const getAllRoles = () => {
    return axios({
      url: 'roles'
    })
  }
  ```

  #### >>调用获得所有角色接口 -- userList.vue -- mounted

  ```js
  getAllRoles()
    .then(res => {
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
      }
    })
    .catch((err) => {
      console.log(err)
    })
  ```

  #### >>在对话框显示对应数据  -- userList.vue -- methods

  ```js
  // 显示分配角色对话框
  showGrantDialog (row) {
    // 显示对话框
    this.grantDialogFormVisible = true
    // 显示对应数据
    this.grantform.id = row.id
    this.grantform.rid = row.role_id
    this.grantform.username = row.username
  }
  ```

  #### >>设置分配角色接口  -- userList.js

  ```js
  export const updateUserRole = (data) => {
    return axios({
      method: 'put',
      url: `users/${data.id}/role`,
      data: { rid: data.rid }
    })
  }
  ```

  #### >>调用接口，实现分配角色 -- userList.vue -- methods

  ```js
  updateUserRole () {
    if (this.grantform.rid) {
      updateUserRole(this.grantform)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.grantDialogFormVisible = false
            this.init()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
    } else {
      this.$message.warning('请选择角色')
    }
}
  ```

- #### 单个用户删除

  **思想**

  **点击删除按钮，弹出提示框**

  **按确定删除用户，则需通过自定义模板的scope获得当行数据**

  **设置删除接口，绑定删除方法，传入参数id,调用删除接口**

  **成功提示并更新页面**

  #### >>设置提示 -- MessageBox 弹框 -- userList.vue -- methods

  ```js
  
  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.$message({
      type: 'success',
      message: '删除成功!'
    });
  }).catch(() => {
    this.$message({
      type: 'info',
      message: '已取消删除'
    })        
  })
  ```

  #### >>删除接口 -- userList.js

  ```js
  // 删除单个用户
  export const delUserById = (id) => {
    return axios({
      method: 'delete',
      url: `users/${id}`
    })
  }
  ```

  #### >>调用删除接口

  ```js
  // 删除用户
  delUserById (row) {
    this.$confirm('此操作将永久删除用户, 是否继续?', '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delUserById(row.id)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // 分页的显示
            if (this.userData.length === 1) {
              if (this.userobj.pagenum > 1) {
                this.userobj.pagenum--
                this.init()
              }
            }
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }
  ```

  