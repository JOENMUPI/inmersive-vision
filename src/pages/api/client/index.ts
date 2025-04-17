import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, getClient, createClient } from '@/server/modules/client/infraestructure/client.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getClient(req, res)
  else if (req.method === methodHTTP.POST) createClient(req, res)
  else errorMethod(req, res)
}
