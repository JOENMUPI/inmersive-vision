import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/project/infraestructure/supabaseDBManager";
import {
  getProjectUseCase,
  createProjectUseCase,
  deleteProjectUseCase,
  updateProjectUseCase,
  anulateProjectUseCase
} from "@/server/modules/project/aplication/project.usecase";
import { adapterResponseI, projectModel, updateBaseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/project/infraestructure/zodValidatorManager"
import { httpToId, httpToProject, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { cookieManager } from "@/server/utilities/cookieManager";
import { permissionIds } from "@/server/utilities/enums";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";
import { projectInternalManagerI } from "../domain/interfaces";

export const createProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
      
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_PROJECT })
                
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
          
    const proyectsFormatted = httpToProject({ httpData: req.body, optionalFieldObligatory: false })
        
    if (proyectsFormatted.hasError) res.status(400).json(proyectsFormatted)
    if (!proyectsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await createProjectUseCase({
      projects: proyectsFormatted.payload!,
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

export const getProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
   
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.GET_PROJECT })
                
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
      
    const projectIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (projectIdsFormatted.hasError) res.status(400).json(projectIdsFormatted)
    if (!projectIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await getProjectUseCase({
      projectIds: projectIdsFormatted.payload,
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

export const deleteProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
         
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.DELETE_PROJECT })
                
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const projectIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (projectIdsFormatted.hasError) res.status(400).json(projectIdsFormatted)
    if (!projectIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await deleteProjectUseCase({
      projectIds: projectIdsFormatted.payload!,
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

export const updateProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
         
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.EDIT_PROJECT })
                
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const projectFormatted = httpToUpdateBase<projectModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToProject,
      idHandler: httpToId
    })

    if (projectFormatted.hasError) res.status(400).json(projectFormatted)
    if (!projectFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ClientFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateProjectUseCase({
      project: projectFormatted.payload!,
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

export const anulateProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
         
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.ANULATE_PROJECT })
                
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
    
    const projectIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (projectIdsFormatted.hasError) res.status(400).json(projectIdsFormatted)
    if (!projectIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulateProjectUseCase({
      projectIds: projectIdsFormatted.payload!,
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

const getProjectInternal = async (ids?: number[]): Promise<adapterResponseI<Array<projectModel>>> => {
  return await getProjectUseCase({ dbManager, projectIds: ids, validatorManager })
}

const createProjectInternal = async (projects: projectModel[]): Promise<adapterResponseI<Array<projectModel>>> => {
  return await createProjectUseCase({ dbManager, projects, validatorManager })
}

const deleteProjectInternal = async (ids: number[]): Promise<adapterResponseI<Array<projectModel>>> => {
  return await deleteProjectUseCase({ dbManager, projectIds: ids, validatorManager })
}

const updateProjectInternal = async (project: updateBaseI<projectModel>): Promise<adapterResponseI<Array<projectModel>>> => {
  return updateProjectUseCase({ dbManager, project, validatorManager })
}

export const projectInternalManager: projectInternalManagerI = {
 getProjectInternal,
 createProjectInternal,
 deleteProjectInternal,
 updateProjectInternal
}