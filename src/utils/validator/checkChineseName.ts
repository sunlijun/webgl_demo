/**
 * 校验中文姓名的规则
 * @param {*} value 数据值
 */
export default (value = '') => {
  if (
    value.length > 1 &&
    value.length < 200 &&
    /^(([\u4E00-\u9FA5\uF900-\uFA2D]{1,20}·)+)?[\u4E00-\u9FA5\uF900-\uFA2D]{1,50}$/.test(value)
  ) {
    return true
  } else {
    return false
  }
}
