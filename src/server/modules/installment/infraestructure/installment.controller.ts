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
import { adapterResponseI, installmentModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/installment/infraestructure/zodValidatorManager"
import { httpToId, httpToInstallment, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";

export const createInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
                
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const installmentFormatted = httpToInstallment({ httpData: req.body, optionalFieldObligatory: false })
        
    if (installmentFormatted.hasError) res.status(400).json(installmentFormatted)
    if (!installmentFormatted.payload) res.status(400).json(adapterResponse({
      message: 'InstallmentFormatted parser no has payload',
      hasError: true
    }))


    const response = await createInstallmentUseCase({
      installments: installmentFormatted.payload!,
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
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
                
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const idsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (idsFormatted.hasError) res.status(400).json(idsFormatted)
    if (!idsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'IdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await getInstallmentUseCase({
      installmentIds: idsFormatted.payload!,
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

export const getInstallmentInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getInstallmentUseCase({ dbManager, installmentIds: ids, validatorManager })
}

export const deleteInstallment = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
                
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const idsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (idsFormatted.hasError) res.status(400).json(idsFormatted)
    if (!idsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'IdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await deleteInstallmentUseCase({
      installmentIds: idsFormatted.payload!,
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
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
                
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const installmentFormatted = httpToUpdateBase<installmentModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToInstallment,
      idHandler: httpToId
    })

    if (installmentFormatted.hasError) res.status(400).json(installmentFormatted)
    if (!installmentFormatted.payload) res.status(400).json(adapterResponse({
      message: 'InstallmentFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateInstallmentUseCase({
      installment: installmentFormatted.payload!,
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
    const jwt = await checkJWT({ req, jwtManager, encryptManager })
                
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
       
    const idsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (idsFormatted.hasError) res.status(400).json(idsFormatted)
    if (!idsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'IdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulateInstallmentUseCase({
      installmentIds: idsFormatted.payload!,
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