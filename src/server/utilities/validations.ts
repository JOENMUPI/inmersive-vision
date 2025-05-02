import { NextApiRequest } from "next";
import { adapterResponseI, cookieManagerI, encryptManagerI, jwtManagerI, tokenI } from "@/server/utilities/interfaces";
import { adapterResponse } from "@/server/utilities/adapters";

export const checkPhone = (val: string): boolean => {
  return /^\+([1-9]{1}[0-9]{0,2})\s?([0-9]{8,14})$/.test(val)
}

export const checkEmail = (val: string): boolean => {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(val);
}

export const checkJWT = async ({
  encryptManager,
  jwtManager,
  req,
  cookieManager
}: {
  req: NextApiRequest,
  jwtManager: jwtManagerI,
  encryptManager: encryptManagerI,
  cookieManager: cookieManagerI
}): Promise<adapterResponseI<tokenI>> => {
  const token = cookieManager.getCookie({ key: 'token', req })
  if (!token) return adapterResponse({ message: 'No cookies provided', hasError: true })
  
  const decrypToken = encryptManager.decryptAES(token)  
  if (!decrypToken) return adapterResponse({ message: 'DecrypToken is undefined', hasError: true })

  const decodedToken = jwtManager.verifyToken(decrypToken)

  if (decodedToken.hasError) return adapterResponse({ message: decodedToken.message, hasError: true })
  if (!decodedToken.payload) return adapterResponse({ message: 'No payload in decoded token', hasError: true })
  if (decodedToken.payload.revoked) return adapterResponse({ message: 'Token revoked', hasError: true })
  return adapterResponse({ message: 'Token valid', hasError: false, payload: decodedToken.payload })
}