import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getCompleteInvoice, createCompleteInvoice } from '@/server/modules/invoice/infraestructure/completeInvoice.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getCompleteInvoice(req, res)
  else if (req.method === methodHTTP.POST) createCompleteInvoice(req, res)
  else errorMethod(req, res)
}
