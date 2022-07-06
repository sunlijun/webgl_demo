import { get, post } from '@/utils/axios'
const host = 'https://api.dhz.ink'

/**
 * 获取职业，地区，银行等，传入路径
 */
export const getPickerList = (params: string) => {
  return get(`${host}/${params}`, '')
}

//校验银行卡授权验证码
export const checkAuthCode = (params: any) => {
  return post(`${host}/qbao-policy-api/v1/applications/${params.extId}/confirm_code`, params.param)
}
