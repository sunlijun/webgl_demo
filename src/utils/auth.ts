import { qscTokenValid, setQscToken, setToken, deleteToken } from './token'
import { loginQbaoApi } from '@/api/module/login'
const passportScene = 'wa_zzck_1'

/**
 * 获取passport返回的用户信息
 */
export const getUserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
  return userInfo || {}
}

/**
 * 检查登录状态，true为已登录，false为未登录
 */
async function checkLogin(): Promise<any> {
  try {
    //先检测passport是否登录
    const isQscTokenValid: any = await qscTokenValid()
    if (!isQscTokenValid) {
      return false
    }
    const { access_token, user_info }: { access_token: string; user_info: any } = isQscTokenValid

    // const isQTokenValid: any = qTokenValid()
    // 若passport已登录，判断q保登录状态
    if (access_token) {
      // 更新本地存储中Qsc-Token的值
      setQscToken(access_token)
      localStorage.setItem('user_info', JSON.stringify(user_info))

      // q保未登录时调用q保登录接口
      // if (!isQTokenValid) {
      await loginQbao(access_token)
      // }
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

/**
 * q保登录，内部方法，外部无需手动调用
 */
async function loginQbao(token: any) {
  const params = {
    qsc_token: token,
  }
  const res: any = await loginQbaoApi(params)
  if (res) {
    setToken(res)

    return res
  } else {
    return Promise.reject(res.errMsg)
  }
}

/**
 * passport登录，内部方法，外部无需手动调用
 */
async function loginQsc(): Promise<any> {
  const res = await window.QscP.login({ passport_scene: passportScene, modal: 'simple' })
  localStorage.setItem('user_info', JSON.stringify(res.user_info))
  setQscToken(res.access_token)
  return res
}

/**
 * 用户登录，内部会先判断是否已登录
 * 登录成功返回用户信息
 * 登录失败抛出reject，并打印错误信息
 */
async function login() {
  try {
    const { access_token, user_info } = await loginQsc()
    await loginQbao(access_token)

    return user_info
  } catch (error) {
    deleteToken()
    return Promise.reject(error)
  }
}

/**
 * 获取短信验证码
 * @param {String} phone 手机号，11位，仅支持国内手机号
 * @param {String} vcs 登录: login_by_sms，绑定: bind_phone，换绑: alter_phone
 */

function getSmsCode({ phone = '', vcs = 'login_by_sms' }) {
  return window.QscP.sendSms({ phone, vcs })
}

/**
 * 提交短信验证码
 * @param {String} phone 手机号，11位，仅支持国内手机号
 * @param {String} smsCode 短信验证码
 * @param {String} vcs 登录: login_by_sms，绑定: bind_phone，换绑: alter_phone
 */
function submitSmsCode({ phone = '', smsCode = '', vcs = 'login_by_sms' }) {
  return window.QscP.submit({ phone, smsCode, vcs })
}

/**
 * 使用短信验证码登录
 * @param {Object} opt 登录信息
 * @property {String} opt.phone 手机号，11位，仅支持国内手机号
 * @property {String} opt.smsCode 短信验证码
 * @property {String} opt.vcs 登录: login_by_sms，绑定: bind_phone，换绑: alter_phone
 */
async function loginBySmsCode(opt = {}): Promise<any> {
  try {
    const { access_token, user_info } = await submitSmsCode(opt)
    await loginQbao(access_token)

    localStorage.setItem('user_info', JSON.stringify(user_info))
    setQscToken(access_token)

    return user_info
  } catch (error) {
    console.error('loginBySmsCode error:', error)
    // await Toast("短信登录异常")

    deleteToken()
    return Promise.reject(error)
  }
}

export { checkLogin, login, loginBySmsCode, getSmsCode, loginQsc }
