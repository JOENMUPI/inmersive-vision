import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/installment/infraestructure/supabaseDBManager";
import {
  getInstallmentUseCase,
  createInstallmentUseCase,
  deleteInstallmentUseCase,
  updateInstallmentUseCase,
  anulateInstallmentUseCase
} from "@/server/modules/installment/aplication/installment.usecase";
import { adapterResponseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/installment/infraestructure/zodValidatorManager"

export const createInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await createInstallmentUseCase({
      installments: req.body,
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

export const getInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await getInstallmentUseCase({
      installmentIds: req.query?.id ? [...req.query.id] : undefined,
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

export const getInstallmentInternal = async (ids?: string[]): Promise<adapterResponseI> => {
  return await getInstallmentUseCase({ dbManager, installmentIds: ids, validatorManager })
}

export const deleteInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await deleteInstallmentUseCase({
      installmentIds: req.query?.id ? [...req.query.id] : [],
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

export const updateInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await updateInstallmentUseCase({
      installment: req.body,
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

export const anulateInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await anulateInstallmentUseCase({
      installmentIds: req.query.id ? [...req.query.id] : [],
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