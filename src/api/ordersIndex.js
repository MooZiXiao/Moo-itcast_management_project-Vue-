import axios from '@/utils/myaxios.js'

// 订单数据
export const getAllOrders = (params) => {
  return axios({
    url: 'orders',
    params
  })
}

// 编辑订单
export const editOrderById = (data) => {
  return axios({
    url: `orders/${data.id}`,
    method: 'put',
    data
  })
}

// 订单详情
export const getOredrDetailById = (id) => {
  return axios({
    url: `orders/${id}`
  })
}
