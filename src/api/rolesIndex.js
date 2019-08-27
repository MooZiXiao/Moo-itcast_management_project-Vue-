import axios from '@/utils/myaxios.js'

// 获得所有角色的接口
export const getAllRoles = () => {
  return axios({
    url: 'roles'
  })
}

// 删除角色指定权限
export const delRightOnRoleById = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
