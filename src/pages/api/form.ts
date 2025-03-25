import { errorMethod, sendForm } from '@/server/modules/form/infraestructure/form.controller'
import { responseHttp, responseHttpI } from '@/server/utilities/httpRes'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<responseHttpI>) {
  if (req.method === 'GET') res.status(200).json(responseHttp({ message: 'Hello from Next.js!' }))
  else if (req.method === 'POST') sendForm(req, res)
  else errorMethod(req, res)
}
