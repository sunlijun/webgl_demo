/**
 * 检查身高体重和BMI
 * @param {*} value 数据值
 */
import { Toast } from 'vant'
import moment from '@/utils/moment'
import checkId from './checkId'

export default (ID = '', height = '', weight = '') => {
  if (!ID || !checkId(ID) || !height) return false
  const age = moment.calculatedIDAge(ID)
  const value = Number(height)
  if (age < 2 && (value > 110 || value < 40)) {
    Toast('身高须在40cm-110cm')
    return false
  }
  if (age >= 2 && age < 8 && (value > 160 || value < 70)) {
    Toast('身高须在70cm-160cm')
    return false
  }
  if (age >= 8 && age < 16 && (value > 200 || value < 110)) {
    Toast('身高须在110cm-200cm')
    return false
  }
  if (age >= 16 && (value > 200 || value < 141)) {
    Toast('身高须在141cm-200cm')
    return false
  }
  if (!weight) return true
  if (weight) {
    // 计算BMI
    const BMI = Number(weight) / ((value / 100) * (value / 100))
    if (BMI > 30) {
      Toast('BMI大于30')
      return false
    }
    if (BMI < 16) {
      Toast('BMI小于16')
      return false
    }
  }
  return true
}
