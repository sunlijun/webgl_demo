/**
 * 校验手机号的规则
 * @param {*} value 数据值
 */
export default (value = '') => {
  if (/^1\d{10}$/.test(value)) {
    return true
  } else {
    return false
  }
}
