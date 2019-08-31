import axios from '@/utils/myaxios.js'

// 获得分类参数
export const getAllParams = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
