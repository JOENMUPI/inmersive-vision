import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, deleteMethodPayment, updateMethodPayment } from '@/server/modules/methodPayment/infraestructure/methodPayment.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updateMethodPayment(req, res)
  else if (req.method === methodHTTP.DELETE) deleteMethodPayment(req, res)
  else errorMethod(req, res)
}
