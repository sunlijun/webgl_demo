/**
 * px 换算 rem
 */
function px2rem(d: any) {
  let val: any = parseFloat(d) / 75
  if (typeof d === 'string' && d.match(/px$/)) {
    val = val.toFixed(6) + 'rem'
  }
  return val
}

/**
 * 处理内联样式
 *  1. px 转 rem
 * @param {String} str 样式字符串
 * @returns {String} 样式
 */
function processStyleStr(str: string) {
  if (!str || typeof str !== 'string') return ''
  // if (process.server) return ''
  return str.replace(/(\d{1,6})px/g, (_match: any, $1: any) => `${px2rem($1)}rem`)
}

export { px2rem, processStyleStr }
