import { NextApiRequest } from "next";
import { adapterResponseI, encryptManagerI, jwtManagerI, tokenI, userPermissionId } from "@/server/utilities/interfaces";
import { adapterResponse } from "@/server/utilities/adapters";
import { getUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";

export const checkPhone = (val: string): boolean => {
  return /^\+([1-9]{1}[0-9]{0,2})\s?([0-9]{8,14})$/.test(val)
}

export const checkEmail = (val: string): boolean => {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(val);
}

export const checkJWT = async ({
  encryptManager,
  jwtManager,
  req
}: {
  req: NextApiRequest, jwtManager: jwtManagerI, encryptManager: encryptManagerI }): Promise<adapterResponseI<tokenI>> => {
  const  { cookies } = req
  if (!cookies) return adapterResponse({ message: 'No cookies provided', hasError: true })
  
  const { token } = cookies
  if (!token) return adapterResponse({ message: 'No token provided', hasError: true })
  
  const decrypToken = encryptManager.decryptAES(token)  
  if (!decrypToken) return adapterResponse({ message: 'DecrypToken is undefined', hasError: true })

  const decodedToken = jwtManager.verifyToken(decrypToken)

  if (decodedToken.hasError) return adapterResponse({ message: decodedToken.message, hasError: true })
  if (!decodedToken.payload) return adapterResponse({ message: 'No payload in decoded token', hasError: true })
  if (decodedToken.payload.revoked) return adapterResponse({ message: 'Token revoked', hasError: true })
  return adapterResponse({ message: 'Token valid', hasError: false, payload: decodedToken.payload })
}

export const checkUserPermission = async (id: userPermissionId): Promise<adapterResponseI<boolean>> => {
  const userPermission = await getUserPermissionInternal([id])

  if (userPermission.hasError) return adapterResponse({ message: userPermission.message, hasError: true })
  if (!userPermission.payload) return adapterResponse({ message: 'No payload in userPermission', hasError: false, payload: false })
  if (userPermission.payload.length > 1) return adapterResponse({ message: 'userPermission will be one', hasError: true })
  return adapterResponse({ message: 'All done', hasError: false, payload: !!userPermission.payload![0].is_allowed })
}