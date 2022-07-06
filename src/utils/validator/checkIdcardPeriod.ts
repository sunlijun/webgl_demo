/**
 * 校验身份证有效期
 * @param {*} value 数据值
 */
import { Toast } from 'vant'
import moment from '@/utils/moment'
import checkId from './checkId'

export default (ID = '', startDate = '', endDate = '', isLong = false) => {
  if (!ID || !checkId(ID)) return false
  if ((!isLong && (!startDate || !endDate)) || (isLong && !startDate)) return false
  const age = moment.calculatedIDAge(ID)
  if (startDate && endDate) {
    if (age < 16) {
      if (moment.getTDateYear(startDate, endDate) != 5) {
        Toast('不满16周岁，有效期须为5年')
        return false
      }
    }
    if (age >= 16 && age <= 25) {
      if (
        moment.getTDateYear(startDate, endDate) != 10 &&
        moment.getTDateYear(startDate, endDate) != 5
      ) {
        Toast('16周岁至25周岁，有效期须为10年或5年')
        return false
      }
    }
    if (age >= 26 && age <= 45) {
      if (
        moment.getTDateYear(startDate, endDate) != 20 &&
        moment.getTDateYear(startDate, endDate) != 10
      ) {
        Toast('26周岁至45周岁，有效期须为10年或20年')
        return false
      }
    }
    // if (age >= 26 && age <= 45) {
    //   if (moment.getTDateYear(startDate, endDate) != 20) {
    //     Toast('26周岁至45周岁，有效期须为20年')
    //     return false
    //   }
    // }
    if (age >= 46) {
      if (moment.getTDateYear(startDate, endDate) != 20 && !isLong) {
        Toast('大于等于46周岁，有效期须为20年')
        return false
      }
    }
  }
  if (isLong && age < 46) {
    Toast('身份类型选择长期年龄须满46周岁')
    return false
  }
  return true
}
