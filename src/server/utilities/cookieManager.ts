import { cookieManagerI, createCookieProps, getCookieProps } from '@/server/utilities/interfaces'

const createCookie = ({ data, maxAge = 60 * 60 }: createCookieProps): string => {
  const _cookie = `token=${data}; Max-Age=${maxAge}; Path=/; HttpOnly"`
  return _cookie
}

const getCookie = ({ req, key }: getCookieProps): string => {
  const  { cookies } = req
  return cookies[key] ?? ''
}

export const cookieManager: cookieManagerI = {
  createCookie,
  getCookie
}
