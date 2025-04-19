import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, anulateInstallment } from '@/server/modules/installment/infraestructure/installment.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PATCH) anulateInstallment(req, res)
  else errorMethod(req, res)
}
