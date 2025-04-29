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
import { adapterResponseI, projectDescriptionModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/projectDescription/infraestructure/zodValidatorManager"
import { httpToId, httpToProjectDescription, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";

export const createProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
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

export const getProjectDescriptionInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getProjectDescriptionUseCase({ dbManager, projectDescriptionIds: ids, validatorManager })
}

export const deleteProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
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