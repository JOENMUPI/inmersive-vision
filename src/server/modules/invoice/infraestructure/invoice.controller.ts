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
import { adapterResponseI, invoiceId, invoiceModel, updateBaseI } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/invoice/infraestructure/zodValidatorManager"
import { httpToInvoice, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { cookieManager } from "@/server/utilities/cookieManager";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";
import { permissionIds } from "@/server/utilities/enums";
import { invoiceInternalManagerI } from "@/server/modules/invoice/domain/interfaces";
import { invoiceIdHandler } from "@/server/modules/invoice/infraestructure/utilities/formatters";

export const createInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_INVOICE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
        
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
    
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.GET_INVOICE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

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

export const deleteInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.DELETE_INVOICE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

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
    
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.EDIT_INVOICE })
        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  

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

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.ANULATE_INVOICE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
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

const getInvoiceInternal = async (ids?: invoiceId[]): Promise<adapterResponseI<Array<invoiceModel>>> => {
  return await getInvoiceUseCase({ dbManager, invoiceIds: ids, validatorManager })
}

const createInvoiceInternal = async (invoices: invoiceModel[]): Promise<adapterResponseI<Array<invoiceModel>>> => {
  return await createInvoiceUseCase({ dbManager, invoices, validatorManager })
}

const deleteInvoiceInternal = async (ids: invoiceId[]): Promise<adapterResponseI<Array<invoiceModel>>> => {
  return await deleteInvoiceUseCase({ dbManager, invoiceIds: ids, validatorManager })
}

const updateInvoiceInternal = async (invoice: updateBaseI<invoiceModel, invoiceId>): Promise<adapterResponseI<Array<invoiceModel>>> => {
  return updateInvoiceUseCase({ dbManager, invoice, validatorManager })
}

export const invoiceInternalManager: invoiceInternalManagerI = {
 getInvoiceInternal,
 createInvoiceInternal,
 deleteInvoiceInternal,
 updateInvoiceInternal
}