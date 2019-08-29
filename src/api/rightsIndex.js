import axios from '@/utils/myaxios.js'

// 显示所有权限接口
export const getAllRights = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 左侧菜单权限
export const getAllMenus = () => {
  return axios({
    url: 'menus'
  })
}
