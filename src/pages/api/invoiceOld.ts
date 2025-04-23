import { errorMethod, createPdf } from '@/server/modules/invoiceOLD/infraestructure/pdf.controller'
import { adapterResponseI } from '@/server/utilities/interfaces'
import { methodHTTP } from '@/server/utilities/enums'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.POST) createPdf(req, res)  
  else errorMethod(req, res)
}
