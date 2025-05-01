import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/invoice/infraestructure/supabaseDBManager";
import {
  getInvoiceUseCase,
  createInvoiceUseCase,
  deleteInvoiceUseCase,
  updateInvoiceUseCase,
  anulateInvoiceUseCase
} from "@/server/modules/invoice/aplication/invoice.usecase";
import { adapterResponseI, invoiceId, invoiceModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/invoice/infraestructure/zodValidatorManager"
import { httpToId, httpToInvoice, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { cookieManager } from "@/server/utilities/cookieManager";

const invoiceIdHandler = ({
  installmentIds,
  projectIds
}: { installmentIds: string[], projectIds: string[]}): adapterResponseI<Array<invoiceId>> => {
  const invoiceIds: invoiceId[] = [] 
  
  if(installmentIds?.length !== projectIds?.length) {
    return adapterResponse({
      message: 'Installment_ids and project_ids no have same lenthg',
      hasError: true,
    })
  } 

  const installmentIdsFormatted = httpToId({ ids: installmentIds, isOptional: false, isNumber: true })
  
  if (installmentIdsFormatted.hasError) return adapterResponse({ message: installmentIdsFormatted.message, hasError: true })
  if (!installmentIdsFormatted.payload) adapterResponse({
    message: 'InstallmentIdsFormatted parser no has payload',
    hasError: true
  })

  const projectIdsFormatted = httpToId({ ids: projectIds, isOptional: false, isNumber: true })
  
  if (projectIdsFormatted.hasError) return adapterResponse({ message: projectIdsFormatted.message, hasError: true })
  if (!projectIdsFormatted.payload) adapterResponse({
    message: 'ProjectIdsFormatted parser no has payload',
    hasError: true
  })

  for(let i = 0; i < projectIdsFormatted.payload!.length; i++) {
    invoiceIds.push({
      installment_id: installmentIdsFormatted.payload![i],
      project_id: projectIdsFormatted.payload![i]
    })
  }

  return adapterResponse({
    message: 'All done',
    hasError: false,
    payload: invoiceIds
  }) 
}

export const createInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
        
    const invoicesFormatted = httpToInvoice({ httpData: req.body, optionalFieldObligatory: false })
            
    if (invoicesFormatted.hasError) res.status(400).json(invoicesFormatted)
    if (!invoicesFormatted.payload) res.status(400).json(adapterResponse({
      message: 'InvoicesFormatted parser no has payload',
      hasError: true
    }))

    const response = await createInvoiceUseCase({
      invoices: invoicesFormatted.payload!,
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

export const getInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const installmentIds: string[] | undefined = req.query?.installment_id ? reqQueryToArray(req.query.installment_id) : undefined  
    const projectIds: string[] | undefined = req.query?.project_id ? reqQueryToArray(req.query.project_id) : undefined 
    let invoiceIds: invoiceId[] | undefined

    if (installmentIds && projectIds) {
      const { hasError, message,  payload } = invoiceIdHandler({
        installmentIds,
        projectIds
      })
  
      if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
      invoiceIds = payload
    }

    const response = await getInvoiceUseCase({
      invoiceIds,
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

export const getInvoiceInternal = async (ids?: invoiceId[]): Promise<adapterResponseI> => {
  return await getInvoiceUseCase({ dbManager, invoiceIds: ids, validatorManager })
}

export const deleteInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const { hasError, message, payload } = invoiceIdHandler({
      installmentIds: req.query?.installment_id ? reqQueryToArray(req.query.installment_id) : [],
      projectIds: req.query?.project_id ? reqQueryToArray(req.query.project_id) : []
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload || payload.length === 0) {
      res.status(400).json(adapterResponse({ message: 'InvoiceIdHandler no return a payload', hasError:true }))
    }

    const response = await deleteInvoiceUseCase({
      invoiceIds: payload!,
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

export const updateInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const invoiceFormatted = httpToUpdateBase<invoiceModel, invoiceId>({
      httpParamId: req.query?.project_id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToInvoice,
      idHandler: () => {
        return invoiceIdHandler({
          installmentIds: req.query?.installment_id ? reqQueryToArray(req.query?.installment_id) : [],
          projectIds: req.query?.project_id ? reqQueryToArray(req.query?.project_id) : []
        })
      }
    })

    if (invoiceFormatted.hasError) res.status(400).json(invoiceFormatted)
    if (!invoiceFormatted.payload) res.status(400).json(adapterResponse({
      message: 'InvoiceFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateInvoiceUseCase({
      invoice: invoiceFormatted.payload!,
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

export const anulateInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const { hasError, message, payload } = invoiceIdHandler({
      installmentIds: req.query?.installment_id ? reqQueryToArray(req.query?.installment_id) : [],
      projectIds: req.query?.project_id ? reqQueryToArray(req.query?.project_id) : []
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload || payload.length === 0) {
      res.status(400).json(adapterResponse({ message: 'InvoiceIdHandler no return a payload', hasError:true }))
    }
    
    const response = await anulateInvoiceUseCase({
      invoiceIds: payload!,
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