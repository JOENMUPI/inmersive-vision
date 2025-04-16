import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponseI, adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/client/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import {
  getClientUseCase,
  createClientUseCase,
  deleteClientUseCase,
  updateClientUseCase,
  anulateClientUseCase
} from "@/server/modules/client/aplication/client.usecase";

export const createClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await createClientUseCase({
    clients: req.body,
    dbManager,
    encryptManager
  })

  res.status(response.statusHttp).json(adapterResponse({
    message: response.message,
    hasError: response.hasError,
    payload: response.payload
  }))
}

export const getClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await getClientUseCase({
    clientIds: req.query?.id ? [...req.query.id] : undefined,
    dbManager,
    encryptManager
  })

  res.status(response.statusHttp).json(adapterResponse({
    message: response.message,
    hasError: response.hasError,
    payload: response.payload
  }))
}

export const getClientInternal = async (ids?: string[]): Promise<adapterResponseI> => {
  return await getClientUseCase({ dbManager, clientIds: ids, encryptManager })
}

export const deleteClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await deleteClientUseCase({
    clientIds: req.query?.id ? [...req.query.id] : [],
    dbManager
  })

  res.status(response.statusHttp).json(adapterResponse({
    message: response.message,
    hasError: response.hasError,
    payload: response.payload
  }))
}

export const updateClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await updateClientUseCase({
    clients: req.body,
    dbManager,
    encryptManager
  })

  res.status(response.statusHttp).json(adapterResponse({
    message: response.message,
    hasError: response.hasError,
    payload: response.payload
  }))
}

export const anulateClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await anulateClientUseCase({
    ids: req.query.id ? [...req.query.id] : [],
    dbManager,
  })

  res.status(response.statusHttp).json(adapterResponse({
    message: response.message,
    hasError: response.hasError,
    payload: response.payload
  }))
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}