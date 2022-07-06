/**
 * 检查身高体重和BMI
 * @param {*} value 数据值
 */
import { Toast } from 'vant'
import moment from '@/utils/moment'
import checkId from './checkId'

export default (ID = '', weight = '', height = '') => {
  if (!ID || !checkId(ID) || !weight) return false
  const age = moment.calculatedIDAge(ID)
  const value = Number(weight)
  if (age < 2 && (value > 25 || value < 2.5)) {
    Toast('体重须在2.5kg-25kg')
    return false
  }
  if (age >= 2 && age < 8 && (value > 50 || value < 7)) {
    Toast('体重须在7kg-50kg')
    return false
  }
  if (!height) return true
  if (height) {
    // 计算BMI
    const BMI = value / ((Number(height) / 100) * (Number(height) / 100))
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
