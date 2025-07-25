import { errorMethod, sendFormTemplates } from '@/server/modules/form/infraestructure/form.controller'
import { adapterResponseI } from '@/server/utilities/interfaces'
import { methodHTTP } from '@/server/utilities/enums'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.POST) sendFormTemplates(req, res)  
  else errorMethod(req, res)
}
