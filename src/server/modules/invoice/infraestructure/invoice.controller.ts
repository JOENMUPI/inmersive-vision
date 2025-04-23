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
import { adapterResponseI, invoiceId } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/invoice/infraestructure/zodValidatorManager"

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

  for(let i = 0; i < projectIds.length - 1; i++) {
    if (Number.isNaN(Number(installmentIds[i]) || Number.isNaN(Number(projectIds[i])))) {
      return adapterResponse({
        message: 'intallment_id or project_id is not a valid number',
        hasError: true,
      })
    }

    invoiceIds.push({
      installment_id: Number(installmentIds[i]),
      project_id: Number(projectIds[i])
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
    const response = await createInvoiceUseCase({
      invoices: req.body,
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
    const installmentIds: string[] | undefined = req.query?.installment_id ? [...req.query.installment_id] : undefined  
    const projectIds: string[] | undefined = req.query?.project_id ? [...req.query.project_id] : undefined 
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
    const { hasError, message, payload } = invoiceIdHandler({
      installmentIds: req.query?.installment_id ? [...req.query.installment_id] : [],
      projectIds: req.query?.project_id ? [...req.query.project_id] : []
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload || payload.length === 0) {
      res.status(400).json(adapterResponse({ message: 'invoiceIdHandler no return a payload', hasError:true }))
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
    const response = await updateInvoiceUseCase({
      invoice: req.body,
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
    const { hasError, message, payload } = invoiceIdHandler({
      installmentIds: req.query?.installment_id ? [...req.query.installment_id] : [],
      projectIds: req.query?.project_id ? [...req.query.project_id] : []
    })

    if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
    if (!payload || payload.length === 0) {
      res.status(400).json(adapterResponse({ message: 'invoiceIdHandler no return a payload', hasError:true }))
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