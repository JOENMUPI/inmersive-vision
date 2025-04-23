import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, deletePermission, updatePermission } from '@/server/modules/permission/infraestructure/permission.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updatePermission(req, res)
  else if (req.method === methodHTTP.DELETE) deletePermission(req, res)
  else errorMethod(req, res)
}
