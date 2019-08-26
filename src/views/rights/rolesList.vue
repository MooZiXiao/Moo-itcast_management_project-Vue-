<template>
  <div class="rolesList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success">添加</el-button>
    <!-- 表格 -->
    <el-table :data="rolesData" border style="width: 100%; margin-top:15px;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="first in props.row.children" :key="first.id" style="margin: 15px; border-bottom: 1px dashed #ccc">
            <el-col :span="4">
              <el-tag closable :type="'success'">{{ first.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                    <el-tag closable :type="'info'" style='margin-bottom:15px;'>{{ second.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                    <el-tag closable :type="'error'" v-for='third in second.children' :key='third.id' style='margin-right:8px;margin-bottom:8px'>{{ third.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="320">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" plain icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top-start">
            <el-button type="info" plain icon="el-icon-plus"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="warning" plain icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRoles } from '@/api/rolesIndex.js';
export default {
  data () {
    return {
      // 获得角色数据
      rolesData: []
    }
  },
  mounted () {
    getAllRoles()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.rolesData = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  line-height: 45px;
}
</style>
