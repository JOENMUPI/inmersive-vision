import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, anulateInvoice } from '@/server/modules/invoice/infraestructure/invoice.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PATCH) anulateInvoice(req, res)
  else errorMethod(req, res)
}
