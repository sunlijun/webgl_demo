/**
 * 校验手机验证码
 * @param {*} value 数据值
 */
export default (value: any) => {
  if (value && value.length === 4 && /^\d{4}$/.test(value)) {
    return true
  } else {
    return false
  }
}
