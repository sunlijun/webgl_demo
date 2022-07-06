import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Toast } from 'vant'
import { isWechat, isWechatMP } from '@/utils/device'
import { deleteToken, getToken, getQscToken } from '@/utils/token'
import { login } from '@/utils/auth'

// TODO 清理token
const clearLocalToken = () => {
  deleteToken()
}
// 客户端类型
const client_type = () => {
  if (isWechat() && !isWechatMP()) {
    // 微信
    return 'mp'
  } else if (isWechat() && isWechatMP()) {
    // 小程序
    return 'qsbao_weapp'
  } else {
    // 默认h5
    return 'h5'
  }
}
// 请求实例
const instance = axios.create({
  method: 'post',
  timeout: 60000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

// 请求拦截策略，按域名划分，主要配置头部
const requestStrategy = (host: string, config: AxiosRequestConfig) => {
  const token = getToken().access_token || ''
  switch (host) {
    case 'qapi.qsebao.com':
    case 'dy-api.qschou.com':
      {
        let authorization = token ? `Bearer ${token}` : ''
        if (config.url?.includes('/passport/login')) {
          authorization = `Bearer (${getQscToken() || ''})`
        }
        if (!config.headers) config.headers = {}
        config.headers['Client-Type'] = client_type()
        config.headers['Authorization'] = authorization
        config.headers['content-type'] = 'application/json'
      }
      break
    case 'centerfiles.qschou.com':
      {
        if (!config.headers) config.headers = {}
        config.headers['Qsc-Token'] = getQscToken() || ''
      }
      break
    default:
      break
  }
}

// 请求拦截
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 针对不同域名服务进行配置
    const { hostname } = new URL(String(config.url))
    requestStrategy(hostname, config)
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 请求拦截策略，按域名划分，主要做额外操作
const responseStrategy = (host: string, response: AxiosResponse) => {
  switch (host) {
    case 'qapi.qsebao.com':
    case 'dy-api.qschou.com':
      // 重置boid逻辑
      if (response.data.code === 0 && isOrderPath(String(response.config.url))) {
        // resetBoid()
      }
      break
    default:
      break
  }
}

// 响应拦截
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log(response)
    const { hostname } = new URL(String(response.config.url))
    responseStrategy(hostname, response)
    return response
  },
  (error: any) => {
    // do something
    return Promise.reject(error)
  }
)

/**
 * 请求方法
 * @param {object} options 请求配置对象
 * @param {array|'all'} options.customHandleCode 自定义处理方式的code
 * @returns {Promise} 接口响应 data
 */
function request(options: any = {}) {
  const { customHandleCode = [], ...config } = options
  return new Promise((resolve, reject) => {
    instance
      .request({ ...config })
      .then((response) => {
        const resData = response.data
        const { data, code, msg } = resData
        // 标记，all 原样返回
        if (customHandleCode === 'all') {
          resolve(resData)
        } else if (code === 0) {
          resolve(data)
        } else if (code === '40000') {
          // 清空token
          clearLocalToken()
          // 提示
          Toast(msg)
          // 登录
          toLogin()
        } else {
          // 排除回溯返回错误提示
          if (!response.config.url.includes('https://bt.qsebao.com/')) {
            Toast(msg || '网络错误')
          }
          reject(resData)
        }
      })
      .catch((error) => {
        console.log(error)
        reject({ code: '-000001', msg: '数据获取异常请稍后再试！' }) // eslint-disable-line
      })
  })
}

// GET 封装
const get = (url: string, params: any, options = {}) =>
  request({ method: 'GET', url, params, ...options })

// POST 封装
const post = (url: string, data: any, options = {}) =>
  request({ method: 'POST', url, data, ...options })

// 前往登录页
function toLogin() {
  login()
  // const callback = encodeURIComponent(window.location.href)
  // setTimeout(() => {
  //     const qbaoLoginUrl = 'login'
  //     window.location.href = `${qbaoLoginUrl}?callback=${callback}`
  // }, 200)
}

/**
 * 是否为下单请求接口
 * @param {String} url 请求地址
 * @returns {Boolean}
 */
function isOrderPath(url: string) {
  const orderPaths = ['']

  return orderPaths.some((path) => url.includes(path))
}

export { get, post }
export default request
