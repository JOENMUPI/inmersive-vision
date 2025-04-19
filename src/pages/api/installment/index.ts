import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getInstallment, createInstallment } from '@/server/modules/installment/infraestructure/installment.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getInstallment(req, res)
  else if (req.method === methodHTTP.POST) createInstallment(req, res)
  else errorMethod(req, res)
}
