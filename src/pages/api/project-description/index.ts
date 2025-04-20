import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod,
  getProjectDescription,
  createProjectDescription
} from '@/server/modules/projectDescription/infraestructure/projectDescription.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.GET) getProjectDescription(req, res)
  else if (req.method === methodHTTP.POST) createProjectDescription(req, res)
  else errorMethod(req, res)
}
