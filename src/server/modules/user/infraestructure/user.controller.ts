import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { dbManager } from "@/server/modules/user/infraestructure/supabaseDBManager";
import { encryptManager } from "@/server/utilities/cryptojs"
import {
  getUserUseCase,
  createUserUseCase,
  deleteUserUseCase,
  updateUserUseCase,
  anulateUserUseCase,
  loginUseCase
} from "@/server/modules/user/aplication/user.usecase"
import { cookieManager } from "@/server/utilities/cookieManager"
import { jwtManager } from "@/server/utilities/JWTManager"
import { adapterResponseI, userModel } from "@/server/utilities/interfaces"
import { validatorManager } from "@/server/modules/user/infraestructure/zodValidatorManager"
import { httpToId, httpToLogin, httpToUpdateBase, httpToUser, reqQueryToArray } from "@/server/utilities/formatters"
import { checkJWT } from "@/server/utilities/validations";
import { permissionIds } from "@/server/utilities/enums";
import { checkUserPermissionInternal } from "@/server/modules/userPermission/infraestructure/userPermission.controller";

export const createUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })

    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.CREATE_USER })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))

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
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.GET_USER })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
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

export const getUserInternal = async (ids?: number[]): Promise<adapterResponseI> => {
  return await getUserUseCase({ dbManager, userIds: ids, validatorManager })
}

export const deleteUser = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.DELETE_USER })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
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
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.EDIT_USER })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
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
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))
    
    const hasPermission = await checkUserPermissionInternal({ user_id: jwt.payload!.userId, permission_id: permissionIds.ANULATE_USER })
                        
    if (hasPermission.hasError) res.status(400).json(adapterResponse({ message: hasPermission.message, hasError: true }))
    if (!hasPermission.payload) res.status(401).json(adapterResponse({ message: 'User no have permission for this action', hasError: true }))
  
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

export const login = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const loginFormatted = httpToLogin({ httpData: req.body as never, optionalFieldObligatory: false })

    if (loginFormatted.hasError) res.status(400).json(loginFormatted)
    if (!loginFormatted.payload) res.status(400).json(adapterResponse({
      message: 'LoginFormatted parser no has payload',
      hasError: true
    }))

    const _loginUseCase = await loginUseCase({
      loginData: loginFormatted.payload!,
      dbManager,
      encryptManager,
      cookieManager,
      jwtManager
    })

    if (_loginUseCase.hasError) res.status(_loginUseCase.statusHttp).json({ message: _loginUseCase.message, hasError: true })
    if (!_loginUseCase.payload) res.status(_loginUseCase.statusHttp).json(adapterResponse({
      message: 'LoginUseCase parser no has payload',
      hasError: true
    }))
    
    res.setHeader('Set-Cookie', _loginUseCase.payload!).status(_loginUseCase.statusHttp).json(adapterResponse({
      message: 'Logged succesfully',
      hasError: _loginUseCase.hasError
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
} 

export const logout = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const jwt = await checkJWT({ req, jwtManager, encryptManager, cookieManager })
    if (jwt.hasError) res.status(400).json(jwt)
    if (!jwt.payload) res.status(400).json(adapterResponse({ message: 'JWT parser no has payload', hasError: true }))

    const tokenCookieLogout = cookieManager.createCookie({ data: "", maxAge: 0 })
    
    res.setHeader('Set-Cookie',  tokenCookieLogout).status(200).json(adapterResponse({
      message: 'Logout succesfully',
      hasError: false
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
