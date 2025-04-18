import { adapterResponseI } from '@/server/utilities/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorMethod, deleteProject, updateProject } from '@/server/modules/project/infraestructure/project.controller'
import { methodHTTP } from '@/server/utilities/enums'
 
export default function handler(req: NextApiRequest, res: NextApiResponse<adapterResponseI>) {
  if (req.method === methodHTTP.PUT) updateProject(req, res)
  else if (req.method === methodHTTP.DELETE) deleteProject(req, res)
  else errorMethod(req, res)
}
