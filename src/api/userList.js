import axios from '@/utils/myaxios.js'

// 获得所有用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户
export const addUser = (data) => {
  return axios({
    method: 'post',
    url: 'users',
    data
  })
}

// 修改用户状态
export const updateUserState = (type, id) => {
  return axios({
    method: 'put',
    url: `users/${id}/state/${type}`
  })
}

// 修改用户
export const editUser = (data) => {
  return axios({
    method: 'put',
    url: `users/${data.id}`,
    data: { email: data.email, mobile: data.mobile }
  })
}

// 分配角色
export const updateUserRole = (data) => {
  return axios({
    method: 'put',
    url: `users/${data.id}/role`,
    data: { rid: data.rid }
  })
}

// 删除单个用户
export const delUserById = (id) => {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}
