import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/userPermission/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import {
  getUserPermissionUseCase,
  createUserPermissionUseCase,
  deleteUserPermissionUseCase,
  updateUserPermissionUseCase,
  anulateUserPermissionUseCase
} from "@/server/modules/userPermission/aplication/userPermission.usecase";
import { adapterResponseI, userPermissionId, userPermissionModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/userPermission/infraestructure/zodValidatorManager"
import { httpToId, httpToUpdateBase, httpToUserPermission, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { cookieManager } from "@/server/utilities/cookieManager";
import { permissionIds } from "@/server/utilities/enums";

const userPermissionIdHandler = ({
  permissionIds,
  userIds
}: { permissionIds: string[], userIds: string[]}): adapterResponseI<Array<userPermissionId>> => {
  const userPermissionIds: userPermissionId[] = [] 
  
  if(permissionIds?.length !== userIds?.length) {
    return adapterResponse({
      message: 'permission_ids and user_ids no have same lenthg',
      hasError: true,
    })
  } 

  const permissionIdsFormatted = httpToId({ ids: permissionIds, isOptional: false, isNumber: true })
  
  if (permissionIdsFormatted.hasError) return adapterResponse({ message: permissionIdsFormatted.message, hasError: true })
  if (!permissionIdsFormatted.payload) adapterResponse({
    message: 'PermissionIdsFormatted parser no has payload',
    hasError: true
  })

  const userIdsFormatted = httpToId({ ids: userIds, isOptional: false, isNumber: true })
  
  if (userIdsFormatted.hasError) return adapterResponse({ message: userIdsFormatted.message, hasError: true })
  if (!userIdsFormatted.payload) adapterResponse({
    message: 'UserIdsFormatted parser no has payload',
    hasError: true
  })

  for(let i = 0; i < userIdsFormatted.payload!.length; i++) {
    userPermissionIds.push({
      permission_id: permissionIdsFormatted.payload![i],
      user_id: userIdsFormatted.payload![i]
    })
  }

  return adapterResponse({
    message: 'All done',
    hasError: false,
    payload: userPermissionIds
  }) 
}

export const createUserPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
      
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_USER_PERMISSION })
                    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const userPermissionsFormatted = httpToUserPermission({ httpData: req.body, optionalFieldObligatory: false })
                
    if (userPermissionsFormatted.hasError) res.status(400).json(userPermissionsFormatted)
    if (!userPermissionsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UserPermissionsFormatted parser no has payload',
      hasError: true
    }))

    const response = await createUserPermissionUseCase({
      userPermission: userPermissionsFormatted.payload!,
      dbManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const getUserPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.GET_USER_PERMISSION })
                    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
    const { message, hasError, payload } = userPermissionIdHandler({
      permissionIds: req.query?.installmentIds ? reqQueryToArray(req.query.installmentIds) : [],
      userIds: req.query?.projectIds ? reqQueryToArray(req.query.projectIds) : [],
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload) res.status(400).json(adapterResponse({ message: 'UserPermissionIdHandler no has payload', hasError: true }))
    
    const response = await getUserPermissionUseCase({
      userPermissionIds: payload,
      dbManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const getUserPermissionInternal = async (ids?: userPermissionId[]): Promise<adapterResponseI<Array<userPermissionModel>>> => {
  return await getUserPermissionUseCase({ dbManager, userPermissionIds: ids, validatorManager })   
}

export const deleteUserPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.DELETE_USER_PERMISSION })
                  
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
    const { hasError, message, payload } = userPermissionIdHandler({
      permissionIds: req.query?.permission_id ? reqQueryToArray(req.query.permission_id) : [],
      userIds: req.query?.user_id ? reqQueryToArray(req.query.user_id) : []
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload || payload.length === 0) {
      res.status(400).json(adapterResponse({ message: 'InvoiceIdHandler no return a payload', hasError:true }))
    } 

    const response = await deleteUserPermissionUseCase({
      userPermissionIds: payload!,
      dbManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const updateUserPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
      
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.EDIT_USER_PERMISSION })
                    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const userPermissionFormatted = httpToUpdateBase<userPermissionModel, userPermissionId>({
      httpParamId: req.query?.user_id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToUserPermission,
      idHandler: () => {
        return userPermissionIdHandler({
          permissionIds: req.query?.permission_id ? reqQueryToArray(req.query?.permission_id) : [],
          userIds: req.query?.user_id ? reqQueryToArray(req.query?.user_id) : []
        })
      }
    })

    if (userPermissionFormatted.hasError) res.status(400).json(userPermissionFormatted)
    if (!userPermissionFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UserPermissionFormatted parser no has payload',
      hasError: true
    }))
    
    const response = await updateUserPermissionUseCase({
      userPermission: userPermissionFormatted.payload!,
      dbManager,
      encryptManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const anulateUserPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.ANULATE_USER_PERMISSION })
                    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const { hasError, message, payload } = userPermissionIdHandler({
      permissionIds: req.query?.permission_id ? reqQueryToArray(req.query.permission_id) : [],
      userIds: req.query?.user_id ? reqQueryToArray(req.query.user_id) : []
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload || payload.length === 0) {
      res.status(400).json(adapterResponse({ message: 'InvoiceIdHandler no return a payload', hasError:true }))
    }

    const response = await anulateUserPermissionUseCase({
      userPermissionIds: payload!,
      dbManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const checkUserPermissionInternal = async (id: userPermissionId): Promise<adapterResponseI<boolean>> => {
  const userPermission = await getUserPermissionInternal([id])

  if (userPermission.hasError) return adapterResponse({ message: userPermission.message, hasError: true })
  if (!userPermission.payload) return adapterResponse({ message: 'No payload in userPermission', hasError: false, payload: false })
  if (userPermission.payload.length > 1) return adapterResponse({ message: 'userPermission will be one', hasError: true })
  return adapterResponse({ message: 'All done', hasError: false, payload: !!userPermission.payload![0].is_allowed })
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}