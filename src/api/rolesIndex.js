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

// 在角色列表添加勾选的权限接口
export const addRightsOnRoles = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}

// 添加角色
export const addRole = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 编辑角色接口
export const editRoleById = (data) => {
  return axios({
    method: 'put',
    url: `roles/${data.id}`,
    data
  })
}

// 删除角色
export const delRoleById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
