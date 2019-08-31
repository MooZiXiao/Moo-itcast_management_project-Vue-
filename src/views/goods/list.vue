<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="goodsParams.query"
        class="input-with-select"
        @keypress.enter.native="init"
        style="width:300px;margin-right:15px;"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" @click="$router.push({name: 'add'})">商品添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="goodsForm" border style="width: 100%;margin-top:15px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="320"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template slot-scope="scope">{{ scope.row.add_time | timeFormat('-')}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="商品编辑" placement="top">
            <el-button type="success" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="商品删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="商品审核" placement="top">
            <el-button type="primary" icon="el-icon-finished" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsParams.pagenum"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="goodsParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      style="margin-top:15px; background:#f1f1f1;padding:5px 10px"
    ></el-pagination>
  </div>
</template>
<script>
import { timeFormat } from '@/utils/myfilters.js'
import { getAllGoods } from '@/api/goodsIndex.js'
export default {
  data () {
    return {
      // 分页总记录数
      pageTotal: 0,
      // 商品数据
      goodsForm: [],
      // 商品参数
      goodsParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  methods: {
    // 分页
    handleSizeChange (val) {
      this.goodsParams.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.goodsParams.pagenum = val
      this.init()
    },
    // 封装
    async init () {
      try {
        let res = await getAllGoods(this.goodsParams)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.goodsForm = res.data.data.goods
          this.pageTotal = res.data.data.total
        } else if (res.data.meta.status === 401) {
          this.$message.error(res.data.meta.msg + '，请联系主管分配权限')
        }
      } catch (exp) {
        this.$message.error('服务器异常，请稍候再试')
      }
    }
  },
  filters: {
    timeFormat
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
