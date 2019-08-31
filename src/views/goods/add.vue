<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right" style="background:#fff;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'list' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps
      :active="activeName-0"
      finish-status="success"
      simple
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 表单 -->
    <el-form :model="addForm" :rules="rules" ref="addForm" style="margin:15px auto 0;">
      <!-- 标签页 -->
      <el-tabs
        :before-leave='beforeLeave'
        @tab-click='handleClick'
        type="border-card"
        v-model="activeName"
        tabPosition="left"
      >
        <el-tab-pane label="基本信息">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" style="margin-left:11px" prop="goods_number">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="catData"
              :props="catParams"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销" style="margin-left:8px">
            <el-radio-group v-model="addForm.is_promote" style='margin-left:5px;'>
                <el-radio label="1" border>是</el-radio>
                <el-radio label="2" border>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
            <el-checkbox-group v-model="item.attr_vals" size="small" v-for='item in attrVals' :key='item.attr_id'>
                <el-row style="margin-bottom:20px;">
                    <el-col :span="4" style='text-align:center'>
                        <el-tag style='border:0;font-size:18px;background:#fff;margin-right:15px;' v-show='item.attr_vals.length !== 0'>{{item.attr_name}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-checkbox :label="subItem" border v-for='(subItem,index) in item.attr_vals' :key='index' style="margin-bottom:10px;"></el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
            <el-form-item :label="item.attr_name" v-for='item in staticVals' :key='item.attr_id'>
                <el-input v-model="item.attr_vals" readonly></el-input>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
            <el-upload
                accept='image/jpeg,image/png,image/gif'
                :before-upload='beforeUpload'
                :headers='setToken()'
                :on-success='handSuccess'
                class="upload-demo"
                action="http://localhost:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
            <quillEditor v-model="addForm.goods_introduce"></quillEditor>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="width:20%;margin:20px auto">
        <el-button type="info">取消</el-button>
        <el-button type="success" @click="addGoods">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import { getAllCates } from '@/api/cateIndex.js'
import { getAllParams } from '@/api/paramsIndex.js'
import { addGood } from '@/api/goodsIndex.js'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      // 静态参数
      staticVals: [],
      // 动态参数
      attrVals: [],
      // 文件上传列表
      fileList: [],
      // 级联数据
      catData: [],
      // 级联显示参数
      catParams: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 表单验证规则
      rules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' }
        ]
      },
      // 标签页
      activeName: '0',
      // 添加参数
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        is_promote: '2',
        pics: [],
        attrs: []
      }
    }
  },
  methods: {
    // 添加
    addGoods () {
      // 分类处理
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      // 动态参数的处理
      console.log(this.attrVals)
      this.attrVals.forEach(e => {
        let id = e.attr_id
        e.attr_vals.forEach(v => {
          this.addForm.attrs.push({
            attr_id: id,
            attr_value: v
          })
        })
      })
      console.log(this.addForm)
      // 二次验证
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 调用接口
          try {
            let res = await addGood(this.addForm)
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg)
              this.$router.push({ name: 'list' })
            } else if (res.data.meta.status === 401) {
              this.$message.success(res.data.meta.msg + '，请联系主管分配权限')
            }
          } catch (exp) {
            this.$message.error('服务器异常，请稍候再试')
          }
        } else {
          this.$message.error('请输入必填项')
        }
      })
    },
    // 切换标签之前
    beforeLeave (activeName, oldActiveName) {
      if (activeName === '1' || activeName === '2') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.warning('请选择三级分类')
          this.activeName = '0'
          return false
        }
      }
    },
    // 切换
    async handleClick () {
      if (this.activeName === '1') {
        try {
          let res = await getAllParams(this.addForm.goods_cat[2], 'many')
          console.log(res)
          if (res.data.meta.status === 200) {
            this.attrVals = res.data.data
            // 设置attr_vals
            this.attrVals.forEach(e => {
              e.attr_vals = e.attr_vals.split(',')
            })
            console.log(this.attrVals)
          }
        } catch (exp) {
          this.$message.error('服务器异常，请稍候再试')
        }
      } else if (this.activeName === '2') {
        let res = await getAllParams(this.addForm.goods_cat[2], 'only')
        console.log(res)
        if (res.data.meta.status === 200) {
          this.staticVals = res.data.data
        }
      }
    },
    // 图片上传
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      //  console.log(file, fileList)
      let tmp = file.response.data.tmp_path
      this.addForm.pics.forEach((e, i) => {
        if (e.pic === tmp) {
          this.addForm.pics.splice(i, 1)
        }
      })
    },
    // 文件上传成功
    handSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      if (response.meta.status === 200) {
        this.$message.success(response.meta.msg)
        this.addForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    // 设置请求头，图片上传会绕过拦截器
    setToken () {
      return { Authorization: localStorage.getItem('itcast_login_token') }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview (file) {
      console.log(file)
    },
    // 图片上传前
    beforeUpload (file) {
      if (file.type.indexOf('image/') === -1) {
        this.$message.warning('请上传符合的图片格式，如：jpeg,png,gif')
        return false
      }
    }
  },
  async mounted () {
    try {
      let res = await getAllCates(3)
      //  console.log(res)
      if (res.data.meta.status === 200) {
        this.catData = res.data.data
      }
    } catch (exp) {
      this.$message.error('服务器错误，请稍候再试')
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  line-height: 45px;
  font-size: 18px;
}
.el-input {
  width: 60%;
}
#pane-4{
    height:320px;
    .quill-editor{
        height: 250px;
    }
}
</style>
