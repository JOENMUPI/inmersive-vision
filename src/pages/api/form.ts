import { errorMethod, sendForm } from '@/server/modules/form/infraestructure/form.controller'
import { adapterResponse, adapterResponseI } from '@/server/utilities/adapters'
import { methodHTTP } from '@/server/utilities/enums'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) res.status(200).json(adapterResponse({ message: 'Hello from Next.js!' }))
  else if (req.method === methodHTTP.POST) sendForm(req, res)
  else errorMethod(req, res)
}
