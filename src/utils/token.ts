const passport_scene = 'wa_zzck_1'
const globalData: any = {}

// passport校验是否登录
async function checkLogin(): Promise<any> {
  try {
    const prevValue = window.QscP.__noRedirect
    window.QscP.__noRedirect = true
    const res = await window.QscP.checkLogin({ passport_scene })
    window.QscP.__noRedirect = prevValue
    return res
  } catch (error) {
    return false
  }
}

async function qscTokenValid(): Promise<any> {
  try {
    return await checkLogin()
  } catch (error) {
    window.qlog(error, 11)
    localStorage.removeItem('Qsc-Token')
    globalData['Qsc-Token'] = null
    return false
  }
}

/**
 * 判断Q保token是否有或是否过期
 */
function qTokenValid(): any {
  const token = getToken()
  const timestamp = Date.parse(String(new Date()))
  if (token && token.expire_at && parseInt(token.expire_at) > timestamp / 1000) {
    return true
  }
  globalData['token'] = null
  localStorage.removeItem('token')
  return false
}

/**
 * 获取Q保的token
 */
function getToken(): any {
  let token = globalData['token']
  if (!token) {
    token = JSON.parse(localStorage.getItem('token')) || ''
    if (token) {
      globalData['token'] = token
    }
  }
  return token
}

/**
 * 设置Qsc-Token
 */
function setQscToken(qsc_token: any): void {
  localStorage.setItem('Qsc-Token', qsc_token)
  globalData['Qsc-Token'] = qsc_token
}

/**
 * 获取Qsc-Token
 */
function getQscToken() {
  let token = globalData['Qsc-Token']
  if (!token) {
    token = localStorage.getItem('Qsc-Token')
    if (token) {
      globalData['Qsc-Token'] = token
    }
  }
  return token
}

/**
 * 设置Q保的token
 */
function setToken(token: any) {
  localStorage.setItem('token', JSON.stringify(token))
  globalData['token'] = token
}

/**
 * 删除Q保的token
 */
function deleteToken(): void {
  globalData['token'] = null
  globalData['Qsc-Token'] = null
  localStorage.removeItem('token')
  localStorage.removeItem('Qsc-Token')
  localStorage.removeItem('openId')
}

export { qscTokenValid, qTokenValid, setQscToken, setToken, deleteToken, getToken, getQscToken }
