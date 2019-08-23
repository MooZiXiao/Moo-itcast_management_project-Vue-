<template>
  <div class="userList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 + 添加按钮 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px;margin-right:12px;"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table border :data="userData" style="width: 100%; margin-top:15px">
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
    <!-- 分页 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      userData: [
      ]
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  line-height: 45px;
}
</style>
