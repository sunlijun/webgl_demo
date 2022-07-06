/**
 * 校验必填字段的规则
 * @param {*} value 数据值
 */
export default (value: any) => {
  if (!value) {
    return false
  } else {
    return true
  }
}
