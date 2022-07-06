/**
 * 检查性别
 * @param {*} value 数据值
 */
export default (value = '', rules: any) => {
  if (!rules.isLimitGender) return true
  if (!value || value.length < 18) return false
  if (rules.isLimitGender && rules.sex === 1 && (value.substring(16, 17) - 0) % 2 === 0) {
    return true
  } else if (rules.isLimitGender && rules.sex === 0 && (value.substring(16, 17) - 0) % 2 !== 0) {
    return true
  }
  return false
}
