import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, anulateProjectDescription } from '@/server/modules/projectDescription/infraestructure/projectDescription.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PATCH) anulateProjectDescription(req, res)
  else errorMethod(req, res)
}
