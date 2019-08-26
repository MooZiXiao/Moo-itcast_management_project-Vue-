import axios from '@/utils/myaxios.js'

// 显示所有权限接口
export const getAllRights = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
