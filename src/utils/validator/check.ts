import { Toast } from 'vant'
import required from './required'
import messages from './defaultMessage'
import checkChineseName from './checkChineseName'
import checkSmsCode from './checkSmsCode'
import checkId from './checkId'
// import checkGender from './checkGender'
import checkPhone from './checkPhone'
import checkInsuredAge from './checkInsuredAge'
// import checkSocial from './checkSocial'
import checkIdcardPeriod from './checkIdcardPeriod'
import checkAddress from './checkAddress'
import checkEmail from './checkEmail'

const strategy = {
  checkChineseName,
  required,
  check,
  checkSmsCode,
  checkId,
  // checkGender,
  checkPhone,
  checkInsuredAge,
  // checkSocial,
  checkIdcardPeriod,
  checkAddress,
  checkEmail,
}
let errMessageArr: Array<any>, successMessageArr: Array<any>
/**
 * 校验方法
 * @param {*} data     // 校验数据
 * @param {*} rules    // 校验规则
 * @param {*} mode     // 1 => 不对空数据校验
 */
function check(data: any, rules = {}) {
  errMessageArr = []
  successMessageArr = []
  const ruleKeys = Object.keys(rules)
  ruleKeys.forEach((value) => {
    validator(data, data[value], rules[value], value)
  })
  if (errMessageArr.length > 0) {
    for (let i = 0; i < errMessageArr.length; i++) {
      if (errMessageArr[i].toast) {
        Toast(errMessageArr[i].msg)
        break
      }
    }
    return errMessageArr
  } else {
    return successMessageArr
  }
}

function validator(data: any, valueItem: any, rulesItem: Array<any>, valuekey: any) {
  let errorObj, Errmsg
  rulesItem.forEach((rule) => {
    // 兼容复杂类型
    if (rule.complexFormat) {
      const addr = rule.complexFormat.match(/[a-zA-Z0-9_]+|[[0-9]+]/gi)
      const examine: Array<any> = getDataArr(data, addr, 0, [], '')
      if (examine.length) {
        examine.forEach((value) => {
          if (!rule.mode || (rule.mode === 1 && value.data)) {
            errorObj = strategy[rule.strategy](value.data, rule)
            if (!errorObj) {
              Errmsg = {
                code: -1,
                attr: rule.complexFormat ? rule.complexFormat : rule.attr,
                rule: rule.strategy,
                toast: rule.toast === undefined,
                msg: rule.message || messages[rule.strategy],
              }
              errMessageArr.push(Errmsg)
            }
          }
        })
      }
    } else if (!rule.mode || (rule.mode === 1 && valueItem)) {
      errorObj = strategy[rule.strategy](valueItem, rule)
      if (!errorObj) {
        Errmsg = {
          code: -1,
          attr: rule.attr ? rule.attr : valuekey,
          rule: rule.strategy,
          toast: rule.toast === undefined,
          msg: rule.message || messages[rule.strategy],
        }
        errMessageArr.push(Errmsg)
      }
    }
  })
}
// 校验复杂格式
function getDataArr(data: any, addr: any, i = 0, arr: Array<any>, path = '') {
  let ergodic = getErgodicPath(path, addr[i])
  if (i < addr.length - 1 && data) {
    if (addr[i].match(/[a-zA-Z]{1}/)) {
      getDataArr(data[addr[i]], addr, ++i, arr, ergodic)
    } else if (addr[i] === '[]') {
      i++
      for (let j = 0, k = data.length; j < k; j++) {
        if (typeof data[j] !== 'string') {
          ergodic = getErgodicPath(path, '[' + j + ']')
          getDataArr(data[j], addr, i, arr, ergodic)
        }
      }
    } else if (addr[i].match(/[[0-9]+]/gi)) {
      getDataArr(data[parseInt(addr[i].replace(/[[\]]?/gi, ''))], addr, ++i, arr, ergodic)
    }
  } else {
    const t = addr[i].match(/[0-9]{0,9}/gi)
    if (addr[i].match(/^\[[0-9]{0,9}\]$/)) {
      if (addr[i].length === 2) {
        for (let m = 0, n = data.length; m < n; m++) {
          if (typeof data[m] === 'string') {
            arr.push({
              path: ergodic,
              data: data[m],
            })
          } else {
            arr.push({
              path: ergodic,
              data: undefined,
            })
          }
        }
      } else if (typeof data[t[1]] === 'string') {
        arr.push({
          path,
          data: data[t[1]],
        })
      } else {
        arr.push({
          path: ergodic,
          data: undefined,
        })
      }
    } else if (addr[i].match(/[[0-9]+]/gi)) {
      const info = data[parseInt(addr[i].replace(/[[\]]?/gi, ''))]
      if (typeof info === 'string') {
        arr.push({
          path: ergodic,
          data: info,
        })
      } else {
        arr.push({
          path: ergodic,
          data: undefined,
        })
      }
    } else if (typeof data[addr[i]] === 'string' || typeof data[addr[i]] === 'number') {
      arr.push({
        path: ergodic,
        data: data[addr[i]],
      })
    } else {
      arr.push({
        path: ergodic,
        data: undefined,
      })
    }
  }
  return arr
}
// 获取遍历路径
function getErgodicPath(path: any, addr: any) {
  if (addr.match(/\[/)) {
    path = path.replace(/\.$/, '') + addr
  } else {
    path = path ? path + '.' + addr : addr
  }
  return path
}

export default check
