/**
 * 设备、环境检查
 */

/**
 * 安卓
 * @returns {Boolean}
 */
function isAndroid() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('android')
}

/**
 * iOS
 * @returns {Boolean}
 */
function isIOS() {
  const ua = navigator.userAgent.toLowerCase()
  return /iPad|iPhone|iPod/.test(ua)
}

/**
 * iPhone
 * @returns {Boolean}
 */
function isIPhone() {
  const ua = navigator.userAgent.toLowerCase()
  return /iPhone/.test(ua)
}

/**
 * iPhone 刘海屏机型：X XS, XS Max, XR, 11, 11 Pro, 11 Pro Max, 12 ...
 * @returns {Boolean}
 */
function isIPhoneX() {
  if (!isIPhone()) {
    return false
  }

  const screens = [
    { dpr: 3, width: 375, height: 812 },
    { dpr: 3, width: 414, height: 896 },
    { dpr: 2, width: 414, height: 896 },
  ]
  if (typeof window !== 'undefined' && window) {
    const { devicePixelRatio, screen } = window
    const { width, height } = screen
    return screens.some(
      (item) => item.dpr === devicePixelRatio && item.width === width && item.height === height
    )
  }
  return false
}

/**
 * 微信内置浏览器
 * @returns {Boolean}
 */
function isWechat() {
  const ua = navigator.userAgent.toLowerCase()
  return /MicroMessenger/i.test(ua)
}

/**
 * 微信小程序的 web-view
 * @returns {Boolean}
 */
function isWechatMP() {
  const ua = navigator.userAgent.toLowerCase()
  return /miniProgram/i.test(ua)
}

// 获取 Qisd
function __getQiSdDs() {
  // 对应修改
  let id = localStorage.__QiSd
  if (!id) {
    id = 'qxyxx-xsxyx-yxcxy-'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    localStorage.setItem('__QiSd', id)
  }
  return id
}

export { isAndroid, isIOS, isIPhone, isIPhoneX, isWechat, isWechatMP, __getQiSdDs }
