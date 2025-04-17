import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getMethodPayment, createMethodPayment } from '@/server/modules/methodPayment/infraestructure/methodPayment.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getMethodPayment(req, res)
  else if (req.method === methodHTTP.POST) createMethodPayment(req, res)
  else errorMethod(req, res)
}
