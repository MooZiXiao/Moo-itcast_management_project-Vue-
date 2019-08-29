// 过滤时间
export const timeFormat = (time, spe) => {
  time = new Date(time * 1000)
  return time.getFullYear() + spe + time.getMonth() + spe + time.getDate()
}

// 付款方式
export const payFormat = (val) => {
  if (val === '0') {
    return '未支付'
  } else if (val === '1') {
    return '支付宝'
  } else if (val === '2') {
    return '微信'
  } else if (val === '3') {
    return '银行卡'
  }
}
