import axios from '@/utils/myaxios.js'

// 显示所有的角色
export const getAllRoles = () => {
  return axios({
    url: 'roles'
  })
}
