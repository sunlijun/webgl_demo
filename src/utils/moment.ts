/**
 * 时间计算
 * Each engineer has a duty to keep the code elegant
 * @author liuting
 * @date 2020-04-14
 */

const dayTime = 24 * 60 * 60 * 1000 // 一天的毫秒数 = // 24小时 * 每小时60分 * 每分钟60秒 * 每秒1000毫秒

/**
 * 当前时间延期t天后的时间
 * @param {Number} t 延期天数
 * @return {Date} t天后的时间
 */
const getTDate = (t: any) => {
  return new Date(new Date().getTime() + parseInt(t) * dayTime)
}

/**
 * 当前时间延期t天后的时间
 * @param {Number} t 延期天数
 * @return {Date} t天后的时间
 */
const getTFromDate = (formDate: any, t: any) => {
  return new Date(new Date(formDate.replace(/-/g, '/')).getTime() + parseInt(t) * dayTime)
}

/**
 * 根据身份证号拿到出生年月对应的Date对象
 * @param {String} ID 身份证号
 * @returns {Date} 身份证号对应的Date日期
 */
const CALBirthDateByID = (ID: any) => {
  ID = String(ID)
  let YMD = ''
  if (ID.length === 15) {
    YMD = '19' + ID.substr(6, 6)
  } else {
    YMD = ID.substr(6, 8)
  }
  const month = parseInt(YMD.substr(4, 2)) - 1
  return new Date(YMD.substr(0, 4), month, YMD.substr(6, 2))
}

/**
 * 根据出生YMD（年月日）拿到Date对象
 * @param {String} YMD 出生年月
 * @return {Date} 出生年月对应的Date对象
 */
const getBirthDateByYMD = (YMD: string) => {
  if (!YMD?.length) return null
  YMD = YMD.replace(/[^0-9]/gi, '')
  const month = parseInt(YMD.substring(4, 6)) - 1
  const birthDate = new Date(Number(YMD.substring(0, 4)), month, Number(YMD.substring(6, 8)))
  return birthDate
}

/**
 * 根据目标日期和出生日期计算
 * @param {Date} tDate 目标日期
 * @param {Date} birthDate 出生日期
 * @return {Number} 年龄
 */
const getFullAge = (tDate: any, birthDate: any) => {
  // shouldMinusAge 如果没过生日，周岁需要在当前年龄的基础上减1
  const shouldMinusAge = notPassBirthDay(birthDate, tDate)
  const targetYear = tDate.getFullYear()
  const birthYear = birthDate.getFullYear()
  let fullAge = targetYear - birthYear
  if (shouldMinusAge) {
    fullAge = fullAge - 1
  }
  return fullAge
}

/**
 * 目标时间是否已过生日，没过生日，周岁需要减1
 * @param {Date} birthDate 生日Date对象
 * @param {Date} tDate 目标时间Date对象
 * @return {Boolean} 是不是还没过生日，如果没过生日，返回true，周岁需要减1
 */
const notPassBirthDay = (birthDate: any, tDate: any) => {
  const birthMonth = birthDate.getMonth()
  const birthMonthDay = birthDate.getDate()
  const nowMonth = tDate.getMonth()
  const nowMonthDay = tDate.getDate()
  if (nowMonth < birthMonth) {
    return true
  } else if (nowMonth === birthMonth) {
    if (nowMonthDay < birthMonthDay) {
      return true
    }
  }
  return false
}

export default {
  /**
   * 根据 ID 计算天数
   * @param {String} ID 身份证号
   * @param {Number} t 生效时间
   * @return {Number} 生效天数
   */
  calculatedIDDay(ID: String, t = 0) {
    // 出生到现在的毫秒值
    const timeMSGapVal = new Date().getTime() - CALBirthDateByID(ID).getTime()
    return parseInt(String(timeMSGapVal / dayTime)) + t
  },

  /**
   * 根据 ID 计算周岁
   * @param {String} ID 身份证号
   * @param {Number} t 生效时间
   * @return {Number} 生效年龄
   */
  calculatedIDAge(ID: String, t = 0) {
    const targetDate = getTDate(t)
    const birthDate = CALBirthDateByID(ID)
    return getFullAge(targetDate, birthDate)
  },
  /**
   * 根据 ID 计算周岁以及目标日期计算周岁
   * @param {String} ID 身份证号
   * @param {Number} t 生效时间
   * @return {Number} 生效年龄
   */
  calculatedIDAgeFromDate(ID: String, formDate: any, t = 0) {
    const targetDate = getTFromDate(formDate, t)
    const birthDate = CALBirthDateByID(ID)
    return getFullAge(targetDate, birthDate)
  },

  /**
   * 根据 YMD 计算天数
   * @param {String} YMD 生日
   * @param {Number} t 生效时间
   * @return {Number} 生效天数
   */
  calculatedYMDDay(YMD: String, t = 0) {
    const birthDateLong = getBirthDateByYMD(YMD).getTime()
    const targetDateLong = new Date().getTime()
    const day = parseInt(String((targetDateLong - birthDateLong) / dayTime)) + t
    return day
  },

  /**
   * 根据 YMD 计算周岁
   * @param {String} YMD 生日
   * @param {Number} t 生效时间
   * @return {Number} 生效年龄
   */
  calculatedYMDAge(YMD: String, t = 0) {
    const birthDate = getBirthDateByYMD(YMD)
    const targetDate = getTDate(t)
    return getFullAge(targetDate, birthDate)
  },

  /**
   * 按年份计算周岁（月份、日期按当前时间计算）
   * @param {String} year 年份
   * @param {Number} t 生效时间
   * @return {Number} 生效年龄
   */
  calculatedDateAge(year: any, t = 0) {
    const targetDate = getTDate(t)
    return targetDate.getFullYear() - year
  },

  /**
   * 按周岁计算天数（月份、日期按当前时间计算）
   * @param {String} age 周岁
   * @param {Number} interval 区间
   * @return {Number} 生效天数
   */
  calculatedAgeToDay(age: any, interval = 0) {
    const date = new Date()
    let year = date.getFullYear() - parseInt(age)
    if (interval !== 0) {
      year = year - 1
    }
    const month = date.getMonth()
    const dayDate = date.getDate()

    const birthDate = new Date(year, month, dayDate)
    const days = parseInt(String((date.getTime() - birthDate.getTime()) / dayTime))
    return days
    // let date = new Date()
    // let year = date.getFullYear() - age
    // let month = date.getMonth()
    // let dayDate = date.getDate()
    // // 如果今天是2月29号，而出生的那年没有29号，则按3月1日计算
    // if(month === 2 && dayDate === 29) {
    //     if(year%4 === 0 && year%100 !== 0 || year%400 ===0 ){
    //         dayDate = 28
    //     }
    // }
    // const YMD = String(year) + String(month) + dayDate
    // let day = parseInt((date.getTime() - getBirthDateByYMD(YMD).getTime())/dayTime)
    // return day + t
  },

  /**
   * 根据 ID 计算性别
   * @param {String} ID 身份证号
   * @return {Number} 性别 1 => 男，0 => 女
   */
  calculatedIDSex(ID: any) {
    ID = String(ID)
    let sexno, sex

    if (ID.length === 18) {
      sexno = ID.substring(16, 17)
    } else if (ID.length === 15) {
      sexno = ID.substring(14, 15)
    } else {
      return false
    }

    const tempid = sexno % 2
    if (tempid === 0) {
      sex = '0'
    } else {
      sex = '1'
    }

    return sex
  },

  /**
   * 根据年份获取生肖
   * @param {String} year 年份
   * @return {String} 生肖
   */
  calculatedYearZodiac(year: any) {
    const animals = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
    const index = year % 12
    return animals[index]
  },

  /**
   * 根据 ID 计算生日
   * @param {String} ID 身份证号
   * @return {String} 生日
   */
  calculatedIDToYMD(ID: any) {
    let birthday = ''
    ID = String(ID)
    if (ID.length === 15) {
      birthday = '19' + ID.substr(6, 6)
    } else if (ID.length === 18) {
      birthday = ID.substr(6, 8)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
    return birthday
  },
  countCurrentDays(targetDate: any) {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() < 9 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
    const dateStr = year + '-' + month + '-' + day
    const date1 = Date.parse(dateStr)
    const date2 = Date.parse(targetDate)
    if (date1 > date2) {
      return 0
    }
    return Math.floor(Math.abs(date2 - date1) / (24 * 3600 * 1000))
  },
  /**
   * 获取次日年月日
   */
  getnextDayTime() {
    const nextDate = getTDate(1)
    const year = nextDate.getFullYear()
    const month =
      nextDate.getMonth() < 9 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1
    const day = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate()
    return year + '-' + month + '-' + day
  },
  /**
   * 根据生效日期计算与当前时间相差天数
   */
  getBeginDiffer(formDate: any) {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() < 9 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
    const dateStr = year + '-' + month + '-' + day
    const sDate1 = Date.parse(dateStr)
    const sDate2 = Date.parse(formDate)
    if (sDate2 > sDate1) {
      return Math.floor(Math.abs(sDate2 - sDate1) / (24 * 3600 * 1000))
    }
  },
  underAgeDay(id: any) {
    let birthday = ''
    if (id.length === 15) {
      birthday = '19' + id.substr(6, 6)
    } else if (id.length === 18) {
      birthday = id.substr(6, 8)
    }

    const targetYaer = parseInt(birthday.substring(0, 4)) + 18
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
    let targetBirthday: any = targetYaer + birthday.substring(4, birthday.length)

    targetBirthday = new Date(targetBirthday.replace(/-/g, '/'))
    const currentData = new Date()
    const time = targetBirthday.getTime() - currentData.getTime()
    if (time > 0 && time <= 24 * 60 * 60 * 1000) {
      return true
    } else {
      return false
    }
  },
  /**
   * 两个日期之间计算年数
   */
  getTDateYear(startDate = '', endDate = '') {
    const sDate = new Date(Date.parse(startDate.replace(/-/g, '/')))
    const eDate = new Date(Date.parse(endDate.replace(/-/g, '/')))
    let yL = eDate.getFullYear() - sDate.getFullYear()
    let mL = eDate.getMonth() + 1 - (sDate.getMonth() + 1)
    const dL = eDate.getDate() - sDate.getDate()
    let result = 0
    if (dL < 0) mL--
    if (mL < 0) yL--
    if (yL > 0) {
      result = yL
    } else {
      result = 0
    }
    return result
  },
  getBirthDateByYMD,
}
