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
import { adapterResponseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/projectDescription/infraestructure/zodValidatorManager"

export const createProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await createProjectDescriptionUseCase({
      projectDescriptions: req.body,
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
    const response = await getProjectDescriptionUseCase({
      projectDescriptionIds: req.query?.id ? [...req.query.id] : undefined,
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

export const getProjectDescriptionInternal = async (ids?: string[]): Promise<adapterResponseI> => {
  return await getProjectDescriptionUseCase({ dbManager, projectDescriptionIds: ids, validatorManager })
}

export const deleteProjectDescription = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await deleteProjectDescriptionUseCase({
      projectDescriptionIds: req.query?.id ? [...req.query.id] : [],
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
    const response = await updateProjectDescriptionUseCase({
      projectDescription: req.body,
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
    const response = await anulateProjectDescriptionUseCase({
      projectDescriptionIds: req.query.id ? [...req.query.id] : [],
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