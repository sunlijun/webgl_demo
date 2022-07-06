/**
 * 校验医保 value = 2 时不需要医保
 * @param {*} value 数据值
 */
export default (value: any, rules: any) => {
  if (rules.isHealth && value === 2) {
    return false
  } else {
    return true
  }
}
