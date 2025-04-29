import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, deleteInvoice, updateInvoice } from '@/server/modules/invoice/infraestructure/invoice.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updateInvoice(req, res)
  else if (req.method === methodHTTP.DELETE) deleteInvoice(req, res)
  else errorMethod(req, res)
}
