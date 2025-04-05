import { errorMethod, sendFormTours } from '@/server/modules/form/infraestructure/form.controller'
import { responseHttpI } from '@/server/utilities/httpRes'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<responseHttpI>) {
  if (req.method === 'POST') sendFormTours(req, res)  
  else errorMethod(req, res)
}
