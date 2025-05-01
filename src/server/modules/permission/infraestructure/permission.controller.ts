import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/permission/infraestructure/supabaseDBManager";
import {
  getPermissionUseCase,
  createPermissionUseCase,
  deletePermissionUseCase,
  updatePermissionUseCase,
  anulatePermissionUseCase
} from "@/server/modules/permission/aplication/permission.usecase";
import { adapterResponseI, permissionModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/permission/infraestructure/zodValidatorManager"
import { httpToId, httpToPermission, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { checkJWT } from "@/server/utilities/validations";

export const createPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
        
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const permissionsFormatted = httpToPermission({ httpData: req.body, optionalFieldObligatory: false })
        
    if (permissionsFormatted.hasError) res.status(400).json(permissionsFormatted)
    if (!permissionsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'PermissionFormatted parser no has payload',
      hasError: true
    }))

    const response = await createPermissionUseCase({
      permissions: permissionsFormatted.payload!,
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

export const getPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
        
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const permissionIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (permissionIdsFormatted.hasError) res.status(400).json(permissionIdsFormatted)
    if (!permissionIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'PermissionIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await getPermissionUseCase({
      permissionIds: permissionIdsFormatted.payload,
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

export const getPermissionInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getPermissionUseCase({ dbManager, permissionIds: ids, validatorManager })
}

export const deletePermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
        
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const permissionIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (permissionIdsFormatted.hasError) res.status(400).json(permissionIdsFormatted)
    if (!permissionIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'PermissionIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await deletePermissionUseCase({
      permissionIds: permissionIdsFormatted.payload!,
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

export const updatePermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
        
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const permissionFormatted = httpToUpdateBase<permissionModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToPermission,
      idHandler: httpToId
    })

    if (permissionFormatted.hasError) res.status(400).json(permissionFormatted)
    if (!permissionFormatted.payload) res.status(400).json(adapterResponse({
      message: 'PermissionFormatted parser no has payload',
      hasError: true
    }))

    const response = await updatePermissionUseCase({
      permission: permissionFormatted.payload!,
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

export const anulatePermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
        
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const permissionIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (permissionIdsFormatted.hasError) res.status(400).json(permissionIdsFormatted)
    if (!permissionIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'PermissionIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulatePermissionUseCase({
      permissionIds: permissionIdsFormatted.payload!,
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

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}