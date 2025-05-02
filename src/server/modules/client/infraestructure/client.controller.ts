import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/client/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import {
  getClientUseCase,
  createClientUseCase,
  deleteClientUseCase,
  updateClientUseCase,
  anulateClientUseCase
} from "@/server/modules/client/aplication/client.usecase";
import { adapterResponseI, clientModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/client/infraestructure/zodValidatorManager"
import { httpToClient, httpToId, httpToUpdateBase, reqQueryToArray } from "@/server/utilities/formatters";
import { checkJWT } from "@/server/utilities/validations";
import { jwtManager } from "@/server/utilities/JWTManager";
import { permissionIds } from "@/server/utilities/enums";
import { cookieManager } from "@/server/utilities/cookieManager";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";

export const createClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
                    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_CLIENT })
    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true })) 
    
    const clientsFormatted = httpToClient({ httpData: req.body, optionalFieldObligatory: false })
    
    if (clientsFormatted.hasError) res.status(400).json(clientsFormatted)
    if (!clientsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ClientFormatted parser no has payload',
      hasError: true
    }))
    
    const response = await createClientUseCase({
      clients: clientsFormatted.payload!,
      dbManager,
      encryptManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const getClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
                    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.GET_CLIENT })
    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const clientIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (clientIdsFormatted.hasError) res.status(400).json(clientIdsFormatted)
    if (!clientIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ClientFormatted parser no has payload',
      hasError: true
    }))
    
    const response = await getClientUseCase({
      clientIds: clientIdsFormatted.payload!,
      dbManager,
      encryptManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const getClientInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getClientUseCase({ dbManager, clientIds: ids, encryptManager, validatorManager })
}

export const deleteClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
                    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.DELETE_CLIENT })
    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const clientIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (clientIdsFormatted.hasError) res.status(400).json(clientIdsFormatted)
    if (!clientIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ClientIdsFormatted parser no has payload',
      hasError: true
    }))

    const response = await deleteClientUseCase({
      clientIds: clientIdsFormatted.payload!,
      dbManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const updateClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
                    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.EDIT_CLIENT })
    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
    
    const ClientFormatted = httpToUpdateBase<clientModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToClient,
      idHandler: httpToId
    })

    if (ClientFormatted.hasError) res.status(400).json(ClientFormatted)
    if (!ClientFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ClientFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateClientUseCase({
      client: ClientFormatted.payload!,
      dbManager,
      encryptManager,
      validatorManager
    })

    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const anulateClient = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
                    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.ANULATE_CLIENT })
    
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

    const clientIdsFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (clientIdsFormatted.hasError) res.status(400).json(clientIdsFormatted)
    if (!clientIdsFormatted.payload) res.status(400).json(adapterResponse({
      message: 'ClientFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulateClientUseCase({
      clientIds: clientIdsFormatted.payload!,
      dbManager,
      validatorManager
    })
  
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message,
      hasError: response.hasError,
      payload: response.payload
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}