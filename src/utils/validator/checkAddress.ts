/**
 * 检查详细地址
 * @param {*} value 数据值
 */
export default (value = '') => {
  if (value.length < 8) {
    return false
  }
  if (value.indexOf('号') < 0 && value.indexOf('室') < 0) {
    return false
  }
  return true
}
