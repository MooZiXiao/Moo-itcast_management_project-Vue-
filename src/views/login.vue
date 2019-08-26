<template>
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
          <el-input v-model="loginForm.password" type='password' placeholder="请输入密码" prefix-icon="myicon-key" @keypress.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/loginIndex.js'
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
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
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
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color:#fff;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: #249bb9;
    border: 1px solid #f1f1f1;
    box-shadow: 0 0 10px #f1f1f1;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #249bb9;
      box-shadow: 0 1px 15px #ccc;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .login-btn {
      width: 100%;
      background:#056d86;
    }
  }
}
</style>
