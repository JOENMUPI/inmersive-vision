import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getUserPermission, createUserPermission } from '@/server/modules/userPermission/infraestructure/userPermission.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getUserPermission(req, res)
  else if (req.method === methodHTTP.POST) createUserPermission(req, res)
  else errorMethod(req, res)
}
