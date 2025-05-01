import cookie from 'cookie'
import { cookieManagerI, createCookieProps } from './interfaces'

const createCookie = ({ data, maxAge = 60 * 60 }: createCookieProps): string => {
  const _cookie = cookie.serialize('token', data, { secure: process.env.NODE_ENV !== 'development', httpOnly: true, path:'/', maxAge })
  return _cookie
}

export const cookieManager: cookieManagerI = {
  createCookie,
}
