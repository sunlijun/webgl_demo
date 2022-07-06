/**
 * 投保年龄校验
 * @param {*} value 数据值
 * @param {*} rules 规则 (min、max)
 */
import moment from '@/utils/moment'

export default (value = '', rules: any) => {
  if (!value) return false
  const min = rules.minAge || 0
  const max = rules.maxAge || 0
  const t = rules.denyDay || 0
  const minDay = rules.minDay
  const age = moment.calculatedIDAge(value, t)
  if (parseInt(minDay)) {
    const ageDay = moment.calculatedIDDay(value, t)
    if (ageDay < minDay || age < min || age > max) {
      return false
    }
  } else if ((age < min || age > max) && max) {
    return false
  } else if (age < min) {
    return false
  }
  return true
}
