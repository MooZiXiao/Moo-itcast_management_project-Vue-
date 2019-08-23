import axios from '@/utils/myaxios.js'

// 获得所有用户数据
export const getAllUsers = (params) => {
    return axios({
        url: 'users',
        params
    })
}