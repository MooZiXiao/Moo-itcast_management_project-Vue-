<template>
  <div class="home">
    <el-container>
      <!-- 左边菜单项 -->
      <el-aside width="auto">
        <h1>
          <a href="javascript:;">LOGO</a>
        </h1>
        <el-menu
          :collapse='isCollapse'
          :router="true"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          background-color="#386f8f"
          text-color="#fff"
          active-background-color="#ccc"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="first.id + ''" v-for="first in menuData" :key="first.id">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+ second.path" v-for="second in first.children" :key="second.id">
              <template slot="title">
                <i class="el-icon-check"></i>
                <span>{{second.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <a href="javascript:;" class="toggle-btn myicon-menu" @click="isCollapse=!isCollapse"></a>
          <h2 class="system-title">木一了后台管理</h2>
          <a href="javascript:;" class="exit" @click="exit">退出</a>
        </el-header>
        <!-- 坑 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getAllMenus } from '@/api/rightsIndex.js'
export default {
  data () {
    return {
      // 收缩展开
      isCollapse: false,
      menuData: []
    }
  },
  methods: {
    // 退出
    exit () {
      localStorage.setItem('itcast_login_token', '')
      this.$router.push({ name: 'login' })
    }
  },
  async mounted () {
    try {
      let res = await getAllMenus()
      if (res.data.meta.status === 200) {
        this.menuData = res.data.data
      }
    } catch (exp) {
      this.$message.error('服务器错误，请稍候再试')
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu{
    width:auto
  }
  .el-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #044c5e;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #044c5e;
  }
  h1 a {
    display: block;
    // width: 200px;
    height: 59px;
    text-indent: -9999px;
    background: url("../assets/logo.png") -30px, #fff;
    // background-size: 240px 59px;
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
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .exit {
    color: white;
  }
  .el-menu-item.is-active {
    background-color: #044c5e !important;
  }
  // .el-submenu{
  //   width: 200px !important
  // }
}
</style>
