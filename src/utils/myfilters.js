// 过滤时间
export const timeFormat = (time, spe) => {
  // console.log(time)
  time = new Date(time * 1000)
  return time.getFullYear() + spe + time.getMonth() + spe + time.getDate()
}

// 付款方式
export const orderPayFormat = (val) => {
  // console.log(val)
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

// 是否付款
export const payStatusFormat = (val) => {
  if (val === '0') {
    return '未付款'
  } else if (val === '1') {
    return '已付款'
  }
}

// 是否发货
export const isSendFormat = (val) => {
  if (val === '是') {
    return 1
  } else if (val === '否') {
    return 0
  }
}

// 总价
export const getTotalPrice = (arr) => {
  if (arr) {
    let total = 0
    arr.forEach(e => {
      total += e.goods_total_price
    })
    return total
  }
}
