import jwt from 'jsonwebtoken'
import { envConfig } from '@/server/configs/env.config'
import { adapterResponseI, jwtManagerI, tokenI } from '@/server/utilities/interfaces'
import { adapterResponse } from './adapters'

const createToken = (data: tokenI): string => {
  const token = jwt.sign(data, envConfig.JWT_SECRET_KEY, { expiresIn: '1h' })
  return token
}

const verifyToken = (token: string): adapterResponseI<tokenI> => {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET_KEY)
    return adapterResponse({ message: 'All done', hasError: false, payload: decoded as tokenI })
  } catch(err) {
    console.error(err)
    return adapterResponse({ message: 'Token not valid: ' + (err instanceof Error ? err.message : 'unexpected error') , hasError: true })
  }
}

export const jwtManager: jwtManagerI = {
  createToken,
  verifyToken
}
