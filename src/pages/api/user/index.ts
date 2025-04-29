import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getUser, createUser } from '@/server/modules/user/infraestructure/user.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getUser(req, res)
  else if (req.method === methodHTTP.POST) createUser(req, res)
  else errorMethod(req, res)
}
