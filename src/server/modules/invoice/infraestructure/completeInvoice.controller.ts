import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import {
  createCompleteInvoiceUseCase,
  deleteCompleteInvoiceUseCase,
  getCompleteInvoiceUseCase,
} from "@/server/modules/invoice/aplication/invoiceComplete.usecase";
import { adapterResponseI, invoiceId } from "@/server/utilities/interfaces";
import { httpToCompleteInvoice, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { cookieManager } from "@/server/utilities/cookieManager";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";
import { permissionIds } from "@/server/utilities/enums";
import { clientInternalManager } from "@/server/modules/client/infraestructure/client.controller";
import { invoiceInternalManager } from "@/server/modules/invoice/infraestructure/invoice.controller";
import { methodPaymentInternalManager } from "@/server/modules/methodPayment/infraestructure/methodPayment.controller";
import { installmentInternalManager } from "@/server/modules/installment/infraestructure/installment.controller";
import { projectDescriptionInternalManager } from "@/server/modules/projectDescription/infraestructure/projectDescription.controller";
import { projectInternalManager } from "@/server/modules/project/infraestructure/project.controller";
import { invoiceIdHandler } from "@/server/modules/invoice/infraestructure/utilities/formatters";

export const createCompleteInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_INVOICE_COMPLETE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
        
    const copleteInvoicesFormatted = httpToCompleteInvoice({ httpData: req.body, optionalFieldObligatory: true })
        
    if (copleteInvoicesFormatted.hasError) res.status(400).json(copleteInvoicesFormatted)
    if (!copleteInvoicesFormatted.payload) res.status(400).json(adapterResponse({
      message: 'CopleteInvoicesFormatted parser no has payload',
      hasError: true
    }))

    const response = await createCompleteInvoiceUseCase({
      completeInvoices: copleteInvoicesFormatted.payload!,
      clientManager: clientInternalManager,
      invoiceManager: invoiceInternalManager,
      methodPaymentManager: methodPaymentInternalManager,
      installmentManager: installmentInternalManager,
      projectDescriptionManager: projectDescriptionInternalManager,
      projectManager: projectInternalManager,
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

export const getCompleteInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.GET_INVOICE_COMPLETE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const installmentIds: string[] | undefined = req.query?.installment_id ? reqQueryToArray(req.query.installment_id) : undefined  
    const publicIds: string[] | undefined = req.query?.public_id ? reqQueryToArray(req.query.public_id) : undefined  
    const projectIds: string[] | undefined = req.query?.project_id ? reqQueryToArray(req.query.project_id) : undefined 
    let invoiceIds: invoiceId[] | undefined
    
    if (installmentIds && projectIds) {
      const { hasError, message, payload } = invoiceIdHandler({
        installmentIds,
        projectIds,
        publicIds
      })
  
      if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
      invoiceIds = payload
    }
    
    const response = await getCompleteInvoiceUseCase({
      invoiceIds,
      clientManager: clientInternalManager,
      invoiceManager: invoiceInternalManager,
      methodPaymentManager: methodPaymentInternalManager,
      installmentManager: installmentInternalManager,
      projectDescriptionManager: projectDescriptionInternalManager,
      projectManager: projectInternalManager,
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

export const deleteCompleteInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.DELETE_INVOICE_COMPLETE })
          
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

    const response = await deleteCompleteInvoiceUseCase({
      invoiceIds: payload!,
      installmentManager: installmentInternalManager,
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

// export const updateInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
//   try {
//     const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
//     if (jwt.hasError) res.status(400).json(jwt)
//     if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
//     const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.EDIT_INVOICE })
        
//     if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
//     if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  

//     const invoiceFormatted = httpToUpdateBase<invoiceModel, invoiceId>({
//       httpParamId: req.query?.project_id as string ?? '',
//       httpData: req.body as never,
//       dataHandler: httpToInvoice,
//       idHandler: () => {
//         return invoiceIdHandler({
//           installmentIds: req.query?.installment_id ? reqQueryToArray(req.query?.installment_id) : [],
//           projectIds: req.query?.project_id ? reqQueryToArray(req.query?.project_id) : []
//         })
//       }
//     })

//     if (invoiceFormatted.hasError) res.status(400).json(invoiceFormatted)
//     if (!invoiceFormatted.payload) res.status(400).json(adapterResponse({
//       message: 'InvoiceFormatted parser no has payload',
//       hasError: true
//     }))

//     const response = await updateInvoiceUseCase({
//       invoice: invoiceFormatted.payload!,
//       dbManager,
//       validatorManager
//     })

//     res.status(response.statusHttp).json(adapterResponse({
//       message: response.message,
//       hasError: response.hasError,
//       payload: response.payload
//     }))
//   } catch (err) {
//     console.error(err)
//     res.status(500).json(adapterResponse({
//       message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
//       hasError: true,
//     }))
//   }
// }

// export const anulateInvoice = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
//   try {
//     const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
//     if (jwt.hasError) res.status(400).json(jwt)
//     if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

//     const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.ANULATE_INVOICE })
          
//     if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
//     if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
//     const { hasError, message, payload } = invoiceIdHandler({
//       installmentIds: req.query?.installment_id ? reqQueryToArray(req.query?.installment_id) : [],
//       projectIds: req.query?.project_id ? reqQueryToArray(req.query?.project_id) : []
//     })

//     if (hasError) res.status(400).json(adapterResponse({ message, hasError }))
//     if (!payload || payload.length === 0) {
//       res.status(400).json(adapterResponse({ message: 'InvoiceIdHandler no return a payload', hasError:true }))
//     }
    
//     const response = await anulateInvoiceUseCase({
//       invoiceIds: payload!,
//       dbManager,
//       validatorManager
//     })
  
//     res.status(response.statusHttp).json(adapterResponse({
//       message: response.message,
//       hasError: response.hasError,
//       payload: response.payload
//     }))
//   } catch (err) {
//     console.error(err)
//     res.status(500).json(adapterResponse({
//       message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
//       hasError: true,
//     }))
//   }
// }

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}
