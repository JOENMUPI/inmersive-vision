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
import { adapterResponseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/project/infraestructure/zodValidatorManager"

export const createProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await createProjectUseCase({
      projects: req.body,
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
    const response = await getProjectUseCase({
      projectIds: req.query?.id ? [...req.query.id] : undefined,
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

export const getProjectInternal = async (ids?: string[]): Promise<adapterResponseI> => {
  return await getProjectUseCase({ dbManager, projectIds: ids, validatorManager })
}

export const deleteProject = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await deleteProjectUseCase({
      projectIds: req.query?.id ? [...req.query.id] : [],
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
    const response = await updateProjectUseCase({
      project: req.body,
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
    const response = await anulateProjectUseCase({
      projectIds: req.query.id ? [...req.query.id] : [],
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