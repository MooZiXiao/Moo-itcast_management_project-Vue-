<template>
  <div class="rightsList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightsData" border style="width: 60%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope="scope">
              <span>{{scope.row.level | levelFormat}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRights } from '@/api/rightsIndex.js'
export default {
  data () {
    return {
      rightsData: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    getAllRights('list')
      .then(res => {
        if (res.data.meta.status === 200) {
          this.rightsData = res.data.data
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{
    line-height: 45px
}
</style>
