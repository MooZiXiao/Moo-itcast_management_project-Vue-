<template>
  <div class="orders">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="orderParams.query"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keypress.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success">测试订单</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="orderData" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="240"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="user_id" label="下单用户"></el-table-column>
      <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">{{ scope.row.pay_status | payFormat }}</template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{ scope.row.create_time | timeFormat('-') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="订单编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="订单详情" placement="top">
            <el-button type="success" icon="el-icon-d-caret"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    style='margin-top:15px; background:#f1f1f1; padding:5px 10px'
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="orderParams.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="orderParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { getAllOrders } from '@/api/ordersIndex.js'
import { timeFormat, payFormat } from '@/utils/myfilters.js'
export default {
  data () {
    return {
      // 分页总数
      total: 0,
      // 订单数据
      orderData: [],
      // 订单传入参数
      orderParams: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      }
    }
  },
  methods: {
    // 分页
    handleSizeChange (val) {
      this.orderParams.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.orderParams.pagenum = val
      this.init()
    },
    // 封装
    async init () {
      try {
        let res = await getAllOrders(this.orderParams)
        if (res.data.meta.status === 200) {
          this.orderData = res.data.data.goods
          this.total = res.data.data.total
        } else if (res.data.meta.status === 401) {
          this.$message.error(res.data.meta.msg + '，请找主管分配权限')
        }
      } catch (exp) {
        this.$message.error('服务器错误，请稍候再试')
      }
    }
  },
  filters: {
    timeFormat, payFormat
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
