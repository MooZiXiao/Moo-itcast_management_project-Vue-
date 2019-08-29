import axios from '@/utils/myaxios.js'

// 订单数据
export const getAllOrders = (params) => {
  return axios({
    url: 'orders',
    params
  })
}
