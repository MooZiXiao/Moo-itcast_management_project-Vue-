<template>
  <div class="userList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 + 添加按钮 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px;margin-right:12px;"
        v-model="userobj.query"
        @input.native='init'
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="showAddDialog">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table border :data="userData" style="width: 100%; margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" v-model="scope.row.mg_state" inactive-color="#ff4949" @change="updateUserState(scope.row.mg_state, scope.row.id)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" plain icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配" placement="top-start">
            <el-button type="info" plain icon="el-icon-plus" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="warning" plain icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加dialog -->
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
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
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
  </div>
</template>
<script>
import { getAllUsers, addUser, updateUserState, editUser } from '@/api/userList.js'
export default {
  data () {
    return {
      // 编辑对话框
      editDialogFormVisible: false,
      // 编辑数据对象
      editform: {
        id: '',
        email: '',
        mobile: ''
      },
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
      },
      // 分页总记录数
      total: 0,
      // 存储的数据
      userData: [],
      // 传入的参数
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 3
      }
    }
  },
  methods: {
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
    },
    // 显示对话框
    showEditDialog (row) {
      // 显示对话框
      this.editDialogFormVisible = true
      // 显示对应数据
      this.editform.username = row.username
      this.editform.id = row.id
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
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
    },
    // 显示添加dialog
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    // 添加用户
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
            .catch(() => {
              this.$message.error('添加失败！')
            })
        } else {
          this.$message.warning('请输入必填项！')
        }
      })
    },
    // dialog取消
    addCancel () {
      this.addDialogFormVisible = false
      this.$refs.addform.resetFields()
    },
    // 分页
    handleSizeChange (val) {
      this.userobj.pagesize = val
      this.init()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.userobj.pagenum = val
      this.init()
      // console.log(`当前页: ${val}`)
    },
    init () {
      getAllUsers(this.userobj)
        .then(res => {
          if (res.status === 200) {
            this.userData = res.data.data.users
            this.total = res.data.data.total
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
