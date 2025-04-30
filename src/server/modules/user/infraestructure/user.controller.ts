import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/user/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import {
  getUserUseCase,
  createUserUseCase,
  deleteUserUseCase,
  updateUserUseCase,
  anulateUserUseCase
} from "@/server/modules/user/aplication/user.usecase";
import { adapterResponseI, userModel } from "@/server/utilities/interfaces";
import { validatorManager } from "@/server/modules/user/infraestructure/zodValidatorManager"
import { httpToId, httpToUpdateBase, httpToUser, reqQueryToArray } from "@/server/utilities/formatters";

export const createUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const usersFormatted = httpToUser({ httpData: req.body, optionalFieldObligatory: false })
    
    if (usersFormatted.hasError) res.status(400).json(usersFormatted)
    if (!usersFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UsersFormatted parser no has payload',
      hasError: true
    }))

    const response = await createUserUseCase({
      users: usersFormatted.payload!,
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

export const getUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const usersFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: !!req.query?.id,
      isNumber: true
    })
    
    if (usersFormatted.hasError) res.status(400).json(usersFormatted)
    if (!usersFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UsersFormatted parser no has payload',
      hasError: true
    }))

    const response = await getUserUseCase({
      userIds: usersFormatted.payload,
      dbManager,
      validatorManager
    })
  
    const userAgent = req.headers['user-agent'];
    const clientIp = req.socket.remoteAddress;
    const clientIplocal = req.socket.localAddress;
    const Iplocal = req.socket.address();
    res.status(response.statusHttp).json(adapterResponse({
      message: response.message + ' User-Agent: ' + userAgent + ' IP del cliente: ' + clientIp + ' clientIplocal ' + clientIplocal +' Iplocal ' + Iplocal,
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

export const getUserInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getUserUseCase({ dbManager, userIds: ids, validatorManager })
}

export const deleteUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const usersFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (usersFormatted.hasError) res.status(400).json(usersFormatted)
    if (!usersFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UsersFormatted parser no has payload',
      hasError: true
    }))

    const response = await deleteUserUseCase({
      userIds: usersFormatted.payload!,
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

export const updateUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const userFormatted = httpToUpdateBase<userModel>({
      httpParamId: req.query?.id as string ?? '',
      httpData: req.body as never,
      dataHandler: httpToUser,
      idHandler: httpToId
    })

    if (userFormatted.hasError) res.status(400).json(userFormatted)
    if (!userFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UserFormatted parser no has payload',
      hasError: true
    }))

    const response = await updateUserUseCase({
      user: userFormatted.payload!,
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

export const anulateUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const usersFormatted = httpToId({
      ids: req.query?.id ? reqQueryToArray(req.query.id) : [],
      isOptional: false,
      isNumber: true
    })
    
    if (usersFormatted.hasError) res.status(400).json(usersFormatted)
    if (!usersFormatted.payload) res.status(400).json(adapterResponse({
      message: 'UsersFormatted parser no has payload',
      hasError: true
    }))

    const response = await anulateUserUseCase({
      userIds: usersFormatted.payload!,
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