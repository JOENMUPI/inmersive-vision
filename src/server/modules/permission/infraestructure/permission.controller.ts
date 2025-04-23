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
import { adapterResponseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/permission/infraestructure/zodValidatorManager"

export const createPermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await createPermissionUseCase({
      permissions: req.body,
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
    const response = await getPermissionUseCase({
      permissionIds: req.query?.id ? [...req.query.id] : undefined,
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

export const getPermissionInternal = async (ids?: string[]): Promise<adapterResponseI> => {
  return await getPermissionUseCase({ dbManager, permissionIds: ids, validatorManager })
}

export const deletePermission = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await deletePermissionUseCase({
      permissionIds: req.query?.id ? [...req.query.id] : [],
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
    const response = await updatePermissionUseCase({
      permission: req.body,
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
    const response = await anulatePermissionUseCase({
      permissionIds: req.query.id ? [...req.query.id] : [],
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