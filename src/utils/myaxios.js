import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 获得token
  let mytoken = localStorage.getItem('itcast_login_token')
  // mytoken 存在时
  if (mytoken) {
    // 设置请求头
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default axios
