import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { methodHTTP } from '@/server/utilities/enums'
import {
  errorMethod,
  deleteUserPermission,
  updateUserPermission
} from '@/server/modules/userPermission/infraestructure/userPermission.controller'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updateUserPermission(req, res)
  else if (req.method === methodHTTP.DELETE) deleteUserPermission(req, res)
  else errorMethod(req, res)
}
