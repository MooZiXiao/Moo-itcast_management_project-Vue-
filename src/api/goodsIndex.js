import axios from '@/utils/myaxios.js'

// 获得商品数据
export const getAllGoods = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
