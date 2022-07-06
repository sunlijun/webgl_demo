/**
 * 校验身份证号的规则
 * @param {*} value 数据值
 */
export default (value = '') => {
  // 注意，目前该正则表达式只能检测到 1900-2049 年间18位的身份证
  const regex =
    /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|20[1-4][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  }
  if (!value || !regex.test(value)) {
    return false
  } else if (!city[value.substr(0, 2)]) {
    return false
  } else if (value.length === 18) {
    // 18位身份证需要验证最后一位校验位
    const valueArr = value.split('')
    // ∑(ai×Wi)(mod 11)
    // 加权因子
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    // 校验位
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    let ai = 0
    let wi = 0
    for (let i = 0; i < 17; i++) {
      ai = Number(valueArr[i])
      wi = factor[i]
      sum += ai * wi
    }
    if ('' + parity[sum % 11] !== valueArr[17].toLocaleUpperCase()) {
      return false
    }
  }
  return true
}
