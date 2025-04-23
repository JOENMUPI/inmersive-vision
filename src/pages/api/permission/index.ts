import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getPermission, createPermission } from '@/server/modules/permission/infraestructure/permission.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getPermission(req, res)
  else if (req.method === methodHTTP.POST) createPermission(req, res)
  else errorMethod(req, res)
}
