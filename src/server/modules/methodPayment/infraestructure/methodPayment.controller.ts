import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/methodPayment/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import { validatorManager } from "@/server/modules/methodPayment/infraestructure/zodValidatorManager"
import { adapterResponseI } from "@/server/utilities/interfaces";
import {
  getMethodPaymentUseCase,
  createMethodPaymentUseCase,
  anulateMethodPaymentUseCase,
  deleteMethodPaymentUseCase,
  updateMethodPaymentUseCase
} from "@/server/modules/methodPayment/aplication/methodPayment.usecase";

export const createMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await createMethodPaymentUseCase({
      methodPayments: req.body,
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

export const getMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await getMethodPaymentUseCase({
      methodPaymentIds: req.query?.id ? [...req.query.id] : undefined,
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

export const getMethodPaymentInternal = async (ids?: string[]): Promise<adapterResponseI> => {
  return await getMethodPaymentUseCase({ dbManager, methodPaymentIds: ids, encryptManager })
}

export const deleteMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await deleteMethodPaymentUseCase({
      clientIds: req.query?.id ? [...req.query.id] : [],
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

export const updateMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await updateMethodPaymentUseCase({
      methodPayment: req.body,
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

export const anulateMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await anulateMethodPaymentUseCase({
      methodPaymentIds: req.query.id ? [...req.query.id] : [],
      dbManager,
      validatorManager,
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