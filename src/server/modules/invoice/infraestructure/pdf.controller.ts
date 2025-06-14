import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { PdfUseCase } from "@/server/modules/invoice/aplication/pdf.usecase";
import { adapterResponseI } from "@/server/utilities/interfaces";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { encryptManager } from "@/server/utilities/cryptojs";
import { cookieManager } from "@/server/utilities/cookieManager";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";
import { permissionIds } from "@/server/utilities/enums";
import { httpToCompleteInvoice } from "@/server/utilities/formatters";


export const createPdf = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
            
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_INVOICE_COMPLETE })
          
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
        
    const copleteInvoicesFormatted = httpToCompleteInvoice({ httpData: [req.body] as never, optionalFieldObligatory: true })
        
    if (copleteInvoicesFormatted.hasError) res.status(400).json(copleteInvoicesFormatted)
    if (!copleteInvoicesFormatted.payload) res.status(400).json(adapterResponse({
      message: 'CopleteInvoicesFormatted parser no has payload',
      hasError: true
    }))

    const response = await PdfUseCase(copleteInvoicesFormatted.payload![0], !!req.body.isInvoice);
  
    res.status(response.statusHttp).json(adapterResponse<object>({
      message: response.message,
      payload: response.payload,
      hasError: response.hasError
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