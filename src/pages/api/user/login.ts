import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, login } from '@/server/modules/user/infraestructure/user.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.POST) login(req, res)
  else errorMethod(req, res)
}
