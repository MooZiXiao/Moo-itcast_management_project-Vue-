<template>
  <div class="home">
    <el-container>
      <!-- 左边菜单项 -->
      <el-aside width="200px">
        <h1>
          <a href="javascript:;">LOGO</a>
        </h1>
        <el-menu
          :router="true"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#386f8f"
          text-color="#fff"
          active-background-color="#ccc"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/home/userList">
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
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>导航二</span>
            </template>
            <el-menu-item index="2-1">
              <template slot="title">
                <i class="el-icon-check"></i>
                <span>选项1</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2-2">
              <template slot="title">
                <i class="el-icon-check"></i>
                <span>选项2</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <a href="javascript:;" class="toggle-btn myicon-menu"></a>
          <h2 class="system-title">木一了后台管理</h2>
          <a href="javascript:;" class="exit">退出</a>
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
export default {
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
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
    width: 200px;
    height: 59px;
    text-indent: -9999px;
    background: url("../assets/logo.png") -20px, #fff;
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
}
</style>
