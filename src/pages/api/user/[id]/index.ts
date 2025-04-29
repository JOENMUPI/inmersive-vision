import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, deleteUser, updateUser } from '@/server/modules/user/infraestructure/user.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updateUser(req, res)
  else if (req.method === methodHTTP.DELETE) deleteUser(req, res)
  else errorMethod(req, res)
}
