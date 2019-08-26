import axios from '@/utils/myaxios.js'

// 获得所有角色的接口
export const getAllRoles = () => {
  return axios({
    url: 'roles'
  })
}
