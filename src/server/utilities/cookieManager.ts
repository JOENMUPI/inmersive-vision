import cookieX from 'cookie'
import { cookieManagerI, createCookieProps } from './interfaces'

const createCookie = ({ data, maxAge = 60 * 60 }: createCookieProps): string => {
  const _cookie = cookieX.serialize('token', data, { secure: process.env.NODE_ENV !== 'development', httpOnly: true, maxAge })
  return _cookie
}

export const cookieManager: cookieManagerI = {
  createCookie,
}
