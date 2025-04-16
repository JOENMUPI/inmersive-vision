import { adapterResponseI } from '@/server/utilities/adapters'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, deleteClient, updateClient } from '@/server/modules/client/infraestructure/client.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updateClient(req, res)
  else if (req.method === methodHTTP.DELETE) deleteClient(req, res)
  else errorMethod(req, res)
}
