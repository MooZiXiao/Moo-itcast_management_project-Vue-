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
          <el-row
            v-for="first in props.row.children"
            :key="first.id"
            style="margin: 15px; border-bottom: 1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                :type="'warning'"
                @close="cnt=0;delRightOnRoleById(props.row, first.id)"
              >{{ first.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'success'"
                    style="margin-bottom:15px;"
                    @close="cnt=0;delRightOnRoleById(props.row, second.id)"
                  >{{ second.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-right:8px;margin-bottom:8px"
                    @close="cnt=0;delRightOnRoleById(props.row, third.id)"
                  >{{ third.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-show="props.row.children.length === 0">
            <el-col
              :span="24"
              style="text-align:center; font-size:18px; color:rgb(56, 111, 143)"
            >该角色没有添加角色授权噢</el-col>
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
            <el-button type="info" plain icon="el-icon-plus" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="warning" plain icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权对话框 -->
    <el-dialog title="权限分配" :visible.sync="grantDialogFormVisible">
      <el-tree
        ref='tree'
        :default-expand-all='true'
        :data="rightsData"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRightsOnRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoles, delRightOnRoleById, addRightsOnRoles } from '@/api/rolesIndex.js'
import { getAllRights } from '@/api/rightsIndex.js'
export default {
  data () {
    return {
      // 对象，显示的文本
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 勾选了的id
      checkArr: [],
      // 显示角色授权对话框
      grantDialogFormVisible: false,
      // 所有权限数据
      rightsData: [],
      // 设置删除了所有级权限的提示数
      cnt: 0,
      // 获得角色数据
      rolesData: []
    }
  },
  methods: {
    // 角色权限的添加
    async addRightsOnRoles () {
      // 获得勾选id
      let arr = this.$refs.tree.getCheckedNodes()
      // 遍历arr，拼接arr
      let temp = []
      for (let i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      // 将temp中的数据对象，转化成数组
      temp = temp.join(',').split(',')
      // 数组去重
      temp = [...new Set(temp)]
      // 调用接口
      let res = await addRightsOnRoles(this.rowId, temp.join(','))
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantDialogFormVisible = false
        this.init()
      } else {
        this.$message.success(res.data.meta.msg)
      }
    },
    // 显示角色授权对话框
    showGrantDialog (row) {
      this.grantDialogFormVisible = true

      // 获得对应行的角色id
      this.rowId = row.id

      // 显示权限数据
      getAllRights('tree')
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.rightsData = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 重置数据
      this.checkArr.length = 0
      // 获得已有权限的id
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.checkArr.push(third.id)
              })
            }
          })
        }
      })
    },
    // 删除角色权限
    delRightOnRoleById (row, rightId) {
      delRightOnRoleById(row.id, rightId).then(res => {
        if (res.data.meta.status === 200) {
          // 当删除了一级时，会提示出三条成功提示，为了让其只显示一条则做以下处理
          // 为了重置cnt=0,则需要在各个close事件重置cnt
          if (this.cnt === 0) {
            this.$message.success(res.data.meta.msg)
            this.cnt++
          }
          // 由于删除成功后会返回删除后对应的数据，所以可以不刷新整个表格数据，而来更新
          row.children = res.data.data
          // 三级所有子项删除后，二级没有移除，当一级只有一个二级时且二级的三级子项并没有子项时，应当移除一级
          row.children.forEach(first => {
            if (first.children.length === 0) {
              // 一级权限下没有二级
              // 调用删除方法
              this.delRightOnRoleById(row, first.id)
            } else {
              first.children.forEach(second => {
                // 二级权限下没有三级
                if (second.children.length === 0) {
                  this.delRightOnRoleById(row, second.id)
                }
              })
            }
          })
        } else {
          this.$message.success(res.data.meta.msg)
        }
      })
    },
    // 封装获得所有角色函数
    init () {
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
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  line-height: 45px;
}
</style>
