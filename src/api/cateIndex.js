import axios from '@/utils/myaxios.js'

// 获得商品数据
export const getAllCates = (type) => {
  return axios({
    url: 'categories',
    params: { type }
  })
}
