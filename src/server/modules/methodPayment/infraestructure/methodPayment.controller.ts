import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/methodPayment/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import { validatorManager } from "@/server/modules/methodPayment/infraestructure/zodValidatorManager"
import { adapterResponseI, methodPaymentModel } from "@/server/utilities/interfaces";
import {
  getMethodPaymentUseCase,
  createMethodPaymentUseCase,
  anulateMethodPaymentUseCase,
  deleteMethodPaymentUseCase,
  updateMethodPaymentUseCase
} from "@/server/modules/methodPayment/aplication/methodPayment.usecase";
import { httpToId, httpToMethodPayment, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";

export const createMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const proyectsFormatted = httpToMethodPayment({ httpData: req.body, optionalFieldObligatory: false })
            
    if (proyectsFormatted.hasError) res.status(400).json(proyectsFormatted)
    if (!proyectsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ProjectIdsFormatted parser no has payload',
      hasError: true
    }))
    
    const response = await createMethodPaymentUseCase({
      methodPayments: proyectsFormatted.payload!,
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
    const methodPaymentFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (methodPaymentFormatted.hasError) res.status(400).json(methodPaymentFormatted)
    if (!methodPaymentFormatted.payload) res.status(400).json(adapterResponse({
      message: 'MethodPaymentFormatted parser no has payload',
      hasError: true
    }))

    const response = await getMethodPaymentUseCase({
      methodPaymentIds: methodPaymentFormatted.payload,
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

export const getMethodPaymentInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getMethodPaymentUseCase({ dbManager, methodPaymentIds: ids, encryptManager, validatorManager })
}

export const deleteMethodPayment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const methodPaymentFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (methodPaymentFormatted.hasError) res.status(400).json(methodPaymentFormatted)
    if (!methodPaymentFormatted.payload) res.status(400).json(adapterResponse({
      message: 'MethodPaymentFormatted parser no has payload',
      hasError: true
    }))

    const response = await deleteMethodPaymentUseCase({
      methodPaymentIds: methodPaymentFormatted.payload!,
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
    const methodPaymentFormatted = httpToUpdateBase<methodPaymentModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToMethodPayment,
      idHandler: httpToId
    })

    if (methodPaymentFormatted.hasError) res.status(400).json(methodPaymentFormatted)
    if (!methodPaymentFormatted.payload) res.status(400).json(adapterResponse({
      message: 'MethodPaymentFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateMethodPaymentUseCase({
      methodPayment: methodPaymentFormatted.payload!,
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
    const methodPaymentFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (methodPaymentFormatted.hasError) res.status(400).json(methodPaymentFormatted)
    if (!methodPaymentFormatted.payload) res.status(400).json(adapterResponse({
      message: 'MethodPaymentFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulateMethodPaymentUseCase({
      methodPaymentIds: methodPaymentFormatted.payload!,
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