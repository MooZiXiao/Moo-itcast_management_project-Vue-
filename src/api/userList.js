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
