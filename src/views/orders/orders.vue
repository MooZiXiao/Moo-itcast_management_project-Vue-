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
      <el-table-column prop="order_number" label="订单编号" width="230"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="user_id" label="下单用户"></el-table-column>
      <el-table-column prop="order_pay" label="订单支付">
          <template slot-scope="scope">{{ scope.row.order_pay | orderPayFormat }}</template>
      </el-table-column>
      <el-table-column prop="pay_status" label="是否付款">
        <template slot-scope="scope">{{ scope.row.pay_status | payStatusFormat }}</template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="100">
          <template slot-scope="scope">{{ scope.row.create_time | timeFormat('-') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="订单编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click='showEditDialog(scope.row)'></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="订单详情" placement="top">
            <el-button type="success" icon="el-icon-d-caret" @click="showDetailDialog(scope.row.order_id)"></el-button>
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
    <!-- 编辑对话框 -->
    <el-dialog title="订单编辑" :visible.sync="editDialogFormVisible">
      <el-form :label-width="'150px'" :model='editParams' :rules='rules' ref='editform'>
        <el-form-item label="订单是否发货">
          <el-radio-group v-model="editParams.is_send" size="medium" @change='getIsSend'>
            <el-radio-button label="是">已发货</el-radio-button>
            <el-radio-button label="否">未发货</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单支付">
          <el-radio-group v-model="editParams.order_pay" size="medium" @change='getOrderPay'>
            <el-radio-button label="0">未支付</el-radio-button>
            <el-radio-button label="1">支付宝</el-radio-button>
            <el-radio-button label="2">微信</el-radio-button>
            <el-radio-button label="3">银行卡</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单价格" prop='order_price'>
          <el-input v-model="editParams.order_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单数量">
          <el-input v-model="editParams.order_number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-radio-group v-model="editParams.pay_status" size="medium" @change='getPayStatus'>
            <el-radio-button label="0">未付款</el-radio-button>
            <el-radio-button label="1">已付款</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 订单详情 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogTableVisible">
      <el-form>
        <el-form-item label='订单编号'><span style='font-size:18px'>{{detailData.order_number}}</span></el-form-item>
        <el-form-item>
          <el-collapse style='width:80%;margin:auto;'>
            <el-collapse-item :title="'商品 '+ item.goods_id" :name="item.id" v-for="item in detailData.goods" :key='item.id'>
              <div>商品数量：<b style='font-size:16px'>{{item.goods_number}}</b></div>
              <div>商品价格：<b style='color:#f00'>￥<span style='font-size:18px'>{{item.goods_price}}</span></b></div>
              <div>商品总价：<b style='color:#f00'>￥<span style='font-size:18px'>{{item.goods_total_price}}</span></b></div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
        <el-form-item label='订单支付'>
          <span style='color:#00f;font-size:18px'>{{detailData.order_pay | orderPayFormat}}</span>
        </el-form-item>
        <el-form-item label='商品总价'>
          <b style='color:#f00'>￥<span style='font-size:18px'>{{totalPrice}}</span></b>
        </el-form-item>
        <el-form-item style=''>
           创建时间：<span style='color:#00f;font-size:16px'>{{detailData.create_time | timeFormat('-')}}</span>
        </el-form-item>
        <el-form-item style='margin:auto;width:12%'>
          <el-button plain @click="detailDialogTableVisible=false">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getAllOrders, editOrderById, getOredrDetailById } from '@/api/ordersIndex.js'
import { timeFormat, orderPayFormat, payStatusFormat, isSendFormat, getTotalPrice } from '@/utils/myfilters.js'
export default {
  data () {
    return {
      // 总价
      totalPrice: 0,
      // 详情数据
      detailData: [],
      // 显示详情对话框
      detailDialogTableVisible: false,
      // 编辑对话框
      editDialogFormVisible: false,
      // 规则
      rules: {
        order_price: [{ required: true, message: '订单价格不能为空', trigger: 'blur' }]
      },
      // 编辑参数
      editParams: {
        id: '',
        is_send: '',
        order_pay: 0,
        order_price: 0,
        order_number: 0,
        pay_status: '0'
      },
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
    // 显示详情对话框
    async showDetailDialog (row) {
      this.detailDialogTableVisible = true
      try {
        let res = await getOredrDetailById(row)
        if (res.data.meta.status === 200) {
          this.detailData = res.data.data
          // console.log(this.detailData)
          // 商品总价
          this.totalPrice = getTotalPrice(this.detailData.goods)
        } else if (res.data.meta.status === 401) {
          this.$message.error(res.data.meta.msg + '，请联系主管分配权限')
        }
      } catch (exp) {
        this.$message.error('服务器异常，请稍候再试')
      }
    },
    // 编辑
    editOrder () {
      // return
      // 二次验证
      this.$refs.editform.validate(async valid => {
        if (valid) {
          try {
            // 过滤是否发货
            this.editParams.is_send = isSendFormat(this.editParams.is_send)

            // console.log(this.editParams.pay_status)
            // return
            let res = await editOrderById(this.editParams)
            console.log(res)
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg)
              this.editDialogFormVisible = false
              this.init()
            } else if (res.data.meta.status === 401) {
              this.$message.error(res.data.meta.msg + '，请联系主管分配权限')
            } else {
              this.$message.error(res.data.meta.msg)
            }
          } catch (exp) {
            this.$message.error('服务器异常')
          }
        } else {
          this.$message.warning('请输入必填项')
        }
      })
    },
    // 获得单选值
    getIsSend (obj) {
      this.editParams.is_send = obj
    },
    getOrderPay (obj) {
      this.editParams.order_pay = obj
    },
    getPayStatus (obj) {
      this.editParams.pay_status = obj
    },
    // 显示对话框
    showEditDialog (row) {
      this.editDialogFormVisible = true
      this.editParams.id = row.order_id
      this.editParams.is_send = row.is_send
      this.editParams.order_pay = row.order_pay
      this.editParams.order_price = row.order_price
      this.editParams.order_number = row.order_number
      this.editParams.pay_status = row.pay_status
    },
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
    timeFormat, orderPayFormat, isSendFormat, payStatusFormat
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
.el-input{
  width:60%;
}
</style>
