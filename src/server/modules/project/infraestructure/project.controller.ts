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
import { adapterResponseI, projectModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/project/infraestructure/zodValidatorManager"
import { httpToId, httpToProject, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";

export const createProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
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

export const getProjectInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getProjectUseCase({ dbManager, projectIds: ids, validatorManager })
}

export const deleteProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
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