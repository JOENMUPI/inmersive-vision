import { adapterResponseI } from '@/server/utilities/adapters'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, anulateClient } from '@/server/modules/client/infraestructure/client.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PATCH) anulateClient(req, res)
  else errorMethod(req, res)
}
