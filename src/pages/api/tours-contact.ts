import { errorMethod, sendFormTours } from '@/server/modules/form/infraestructure/form.controller'
import { adapterResponseI } from '@/server/utilities/adapters'
import { methodHTTP } from '@/server/utilities/enums'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.POST) sendFormTours(req, res)  
  else errorMethod(req, res)
}
