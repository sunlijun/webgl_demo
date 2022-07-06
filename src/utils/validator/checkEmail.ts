/**
 * 校验电子邮箱的规则
 * @param {*} value 数据值
 */
export default (value: any) => {
  if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
    return true
  } else {
    return false
  }
}
