import { Toast } from 'vant'
/**
 * 删除URL地址上的查询参数
 * @param {string} name 参数名称
 * @param {string} [url] 链接地址
 */
function deleteUrlParam(name: string, url: string) {
  const _url = new URL(url || window.location.href)
  _url.searchParams.delete(name)
  return _url.toString()
}

/**
 * 获取URL地址上的查询参数
 * @param {string} name 参数名称
 * @param {string} [url] 链接地址
 */
function getUrlParam(name: string, url = ''): any {
  return new URL(url || window.location.href).searchParams.get(name)
}

/**
 * 获取URL地址上的所有查询参数
 * @param {string} [url] 链接地址
 * @returns {object}
 */
function getUrlAllParam(url: string) {
  return Object.fromEntries(new URL(url || window.location.href).searchParams.entries())
}

/**
 * 拼接地址，添加参数
 * @param {string} url 基础url
 * @param {object} params 需要添加的参数键值对
 */
function addUrlParams(url: string, params: { [key: string]: string }) {
  const paramArr: Array<any> = []
  Object.keys(params).forEach((key) => {
    if (params[key]) paramArr.push(`${key}=${params[key]}`)
  })
  if (paramArr.length) {
    const mark = url.includes('?') ? '&' : '?'
    return `${url}${mark}${paramArr.join('&')}`
  }
  return url
}

// 压缩图片 通过分辨率压缩
function compressImage(fileObj: any, maxHeight = 1024, maxWidth = 1024) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    const fileName = fileObj.name ? '' : `${new Date().getTime()}-${fileObj.name}`
    // 压缩图片
    reader.readAsDataURL(fileObj)
    const oSize = fileObj.size
    let path = ''
    reader.onload = (e) => {
      path = e?.currentTarget?.result
      const img = new Image()
      img.src = path
      img.onload = function () {
        const originHeight = img.height
        const originWidth = img.width
        let compressedWidth = img.width
        let compressedHeight = img.height
        if (originWidth > maxWidth && originHeight > maxHeight) {
          // 宽大 高大
          const rateW = originWidth / maxWidth
          compressedWidth = maxWidth
          compressedHeight = originHeight / rateW
          if (compressedHeight > maxHeight) {
            const rateH = compressedHeight / maxHeight
            compressedHeight = maxHeight
            compressedWidth = compressedWidth / rateH
          }
        } else if (originWidth > maxWidth && originHeight < maxHeight) {
          // 宽大 高小
          const rateW = originWidth / maxWidth
          compressedWidth = maxWidth
          compressedHeight = originHeight / rateW
        } else if (originWidth < maxWidth && originHeight > maxHeight) {
          // 宽小 高大
          const rateH = compressedHeight / maxHeight
          compressedHeight = maxHeight
          compressedWidth = maxWidth / rateH
        } else {
          // 不压缩
        }
        // canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = compressedHeight
        canvas.width = compressedWidth
        context?.clearRect(0, 0, compressedWidth, compressedHeight)
        context?.drawImage(img, 0, 0, compressedWidth, compressedHeight)
        const base64 = canvas.toDataURL('image/*')
        // base64转二进制
        canvas.toBlob(
          (blob) => {
            // const url = URL.createObjectURL(blob)
            // 回调函数返回blob的值。也可根据自己的需求返回base64的值
            resolve({ blob, base64, fileName, oSize })
          },
          'image/jpeg',
          0.9
        )
      }
    }
  })
}

/**
 * 深拷贝
 * @param {object} obj
 */
const deepClone = (obj: any) => {
  const isObject = (o: any) => {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
  }
  if (!isObject(obj)) {
    throw new Error('obj 不是一个对象！')
  }
  const isArray = Array.isArray(obj)
  const cloneObj = isArray ? [...obj] : { ...obj }
  Reflect.ownKeys(cloneObj).forEach((key) => {
    cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })
  return cloneObj
}

// 节流
function throttle(fn: any, gapTime: any, toastOption = {}) {
  if (gapTime == null || gapTime === undefined) {
    gapTime = 2000
  }

  let _lastTime: any
  return function () {
    const _nowTime = +new Date()

    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      /* eslint-disable-next-line*/
      fn.apply(this, arguments)
      _lastTime = _nowTime
    } else if (!toastOption.closeToast) {
      const text = toastOption.text || '操作过于频繁，请稍后再试'
      Toast(text)
    }
  }
}

export {
  getUrlParam,
  getUrlAllParam,
  deleteUrlParam,
  addUrlParams,
  compressImage,
  deepClone,
  throttle,
}
