import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/projectDescription/infraestructure/supabaseDBManager";
import {
  getProjectDescriptionUseCase,
  createProjectDescriptionUseCase,
  deleteProjectDescriptionUseCase,
  updateProjectDescriptionUseCase,
  anulateProjectDescriptionUseCase
} from "@/server/modules/projectDescription/aplication/projectDescription.usecase";
import { adapterResponseI, projectDescriptionModel, updateBaseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/projectDescription/infraestructure/zodValidatorManager"
import { httpToId, httpToProjectDescription, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { cookieManager } from "@/server/utilities/cookieManager";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";
import { permissionIds } from "@/server/utilities/enums";
import { projectDescriptionInternalManagerI } from "../domain/interfaces";

export const createProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({
      user_id: jwt.payload!.userId,
      permission_id: permissionIds.CREATE_PROJECT_DESCRIPTION
    })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
    
    const projectDescriptionsFormatted = httpToProjectDescription({ httpData: req.body, optionalFieldObligatory: false })
        
    if (projectDescriptionsFormatted.hasError) res.status(400).json(projectDescriptionsFormatted)
    if (!projectDescriptionsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectDescriptionFormatted parser no has payload',
      hasError: true
    }))
    
    const response = await createProjectDescriptionUseCase({
      projectDescriptions: projectDescriptionsFormatted.payload!,
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

export const getProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({
      user_id: jwt.payload!.userId,
      permission_id: permissionIds.GET_PROJECT_DESCRIPTION
    })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true })) 
    
    const projectDescriptionIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (projectDescriptionIdsFormatted.hasError) res.status(400).json(projectDescriptionIdsFormatted)
    if (!projectDescriptionIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectDescriptionIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await getProjectDescriptionUseCase({
      projectDescriptionIds: projectDescriptionIdsFormatted.payload!,
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

export const deleteProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({
      user_id: jwt.payload!.userId,
      permission_id: permissionIds.DELETE_PROJECT_DESCRIPTION
    })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true })) 
      
    const projectDescriptionIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (projectDescriptionIdsFormatted.hasError) res.status(400).json(projectDescriptionIdsFormatted)
    if (!projectDescriptionIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectDescriptionIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await deleteProjectDescriptionUseCase({
      projectDescriptionIds: projectDescriptionIdsFormatted.payload!,
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

export const updateProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({
      user_id: jwt.payload!.userId,
      permission_id: permissionIds.EDIT_PROJECT_DESCRIPTION
    })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true })) 
      
    const projectDescriptionFormatted = httpToUpdateBase<projectDescriptionModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToProjectDescription,
      idHandler: httpToId
    })

    if (projectDescriptionFormatted.hasError) res.status(400).json(projectDescriptionFormatted)
    if (!projectDescriptionFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectDescriptionFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateProjectDescriptionUseCase({
      projectDescription: projectDescriptionFormatted.payload!,
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

export const anulateProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const hasPermission = await checkUserPermissionInternal({
      user_id: jwt.payload!.userId,
      permission_id: permissionIds.ANULATE_PROJECT_DESCRIPTION
    })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true })) 
        
    const projectDescriptionIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (projectDescriptionIdsFormatted.hasError) res.status(400).json(projectDescriptionIdsFormatted)
    if (!projectDescriptionIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectDescriptionIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulateProjectDescriptionUseCase({
      projectDescriptionIds: projectDescriptionIdsFormatted.payload!,
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

const getProjectDescriptionInternal = async (ids?: number[]): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  return await getProjectDescriptionUseCase({ dbManager, projectDescriptionIds: ids, validatorManager })
}

const createProjectDescriptionInternal = async (projectDescriptions: projectDescriptionModel[]): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  return await createProjectDescriptionUseCase({ dbManager, projectDescriptions, validatorManager })
}

const deleteProjectDescriptionInternal = async (ids: number[]): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  return await deleteProjectDescriptionUseCase({ dbManager, projectDescriptionIds: ids, validatorManager })
}

const updateProjectDescriptionInternal = async (projectDescription: updateBaseI<projectDescriptionModel>): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  return updateProjectDescriptionUseCase({ dbManager, projectDescription, validatorManager })
}

export const projectDescriptionInternalManager: projectDescriptionInternalManagerI = {
 getProjectDescriptionInternal,
 createProjectDescriptionInternal,
 deleteProjectDescriptionInternal,
 updateProjectDescriptionInternal
}