import { dbUser, loginI } from "@/server/modules/user/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC, hexToString } from "@/server/utilities/formatters"
import {
  adapterResponseHttpI,
  anulateProps,
  userModel,
  encryptManagerI,
  updateBaseI,
  validatorManagerI,
  jwtManagerI,
  cookieManagerI
} from "@/server/utilities/interfaces";

export const getUserUseCase = async ({
  userIds,
  dbManager,
  validatorManager
}:{
  userIds?: number[],
  dbManager: dbUser,
  validatorManager: validatorManagerI<userModel>
}): Promise<adapterResponseHttpI> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(userIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getUser(userIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No users found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: userModel[] = dbData.payload.map(user => {
    return {
      email: user.email,
      pass: user.pass,
      salt_pass: user.salt_pass,
      id: user.id,
      soft_deleted: user.soft_deleted,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createUserUseCase = async ({
  users,
  dbManager,
  encryptManager,
  validatorManager,
}:{
  users: userModel[],
  dbManager: dbUser,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<userModel> 
}): Promise<adapterResponseHttpI<Array<userModel>>> => {
  if (!users) {
    return adapterResponseHttp({ message: 'user is undefined', hasError: true, statusHttp: 500 })
  } else if (users.length === 0) {
    return adapterResponseHttp({ message: 'user no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(users)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
    
  const _users: userModel[] = users.map(user => {
    const { hash, salt } = encryptManager.encryptSHA256(user.pass)
      
    return {
      email: user.email,
      pass: hash,
      salt_pass: salt,
    }
  })

  const res = await dbManager.createUser(_users);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteUserUseCase = async ({
  userIds,
  dbManager,
  validatorManager
}:{
  userIds: number[],
  dbManager: dbUser,
  validatorManager: validatorManagerI<userModel>,
}): Promise<adapterResponseHttpI<Array<userModel>>> => {
  if (!userIds) {
    return adapterResponseHttp({ message: 'user is undefined', hasError: true, statusHttp: 500 })
  } else if (userIds.length === 0) {
    return adapterResponseHttp({ message: 'user no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(userIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteUser(userIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateUserUseCase = async ({
  user,
  dbManager,
  encryptManager,
  validatorManager
}:{
  user: updateBaseI<userModel>,
  dbManager: dbUser,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<userModel>
}): Promise<adapterResponseHttpI<Array<userModel>>> => {
  if (!user) {
    return adapterResponseHttp({ message: 'user is undefined', hasError: true, statusHttp: 500 })
  } else if (!user.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!user.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([user])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const userDB = await dbManager.getUser([user.currentId])

  if(userDB.hasError) {
    return adapterResponseHttp({ statusHttp: 400, ...userDB })
  } else if (!userDB.payload || userDB.payload.length === 0) {
    return adapterResponseHttp({ statusHttp: 400, message:'userDB not has payload', hasError: true })
  }

  const _user: updateBaseI<userModel> = {
    currentId: user.currentId,
    newData: {
      email: user.newData.email,
      pass: userDB.payload[0].pass,
      salt_pass: userDB.payload[0].salt_pass,
      id: user.newData.id,
      created_at: user.newData.created_at,
      soft_deleted: user.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateUser(_user);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateUserUseCase = async ({
  userIds,
  dbManager,
  validatorManager
}:{
  userIds: number[],
  dbManager: dbUser,
  validatorManager: validatorManagerI<userModel> 
}): Promise<adapterResponseHttpI<Array<userModel>>> => {
  if (!userIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (userIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(userIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: userIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateUser(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const loginUseCase = async ({
  loginData,
  dbManager,
  encryptManager,
  jwtManager,
  cookieManager
}:{
  loginData: loginI,
  dbManager: dbUser,
  encryptManager: encryptManagerI,
  jwtManager: jwtManagerI,
  cookieManager: cookieManagerI
}): Promise<adapterResponseHttpI<string>> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!loginData) {
    return adapterResponseHttp({ message: 'loginData is undefined', hasError: true, statusHttp: 500 })
  } else if (!cookieManager) {
    return adapterResponseHttp({ message: 'cookieManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!jwtManager) {
    return adapterResponseHttp({ message: 'jwtManager is undefined', hasError: true, statusHttp: 500 })
  }

  const dbData = await dbManager.getUserByEmail(loginData.email);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No users found with email: ' + loginData.email, hasError: false, statusHttp: 200, })
  }

  if (dbData.payload.length !== 1) {
    return adapterResponseHttp({ message: 'More than one user is not possible with: ' + loginData.email, hasError: true, statusHttp: 500 })
  }

  const _dbUser = dbData.payload[0]

  if (!encryptManager.checkSHA256({ hash: hexToString(_dbUser.pass), salt: _dbUser.salt_pass }, loginData.pass)) {
    return adapterResponseHttp({ message: 'Pass not match', hasError: true, statusHttp: 400 })
  }

  const token = jwtManager.createToken({ userId: _dbUser.id!, revoked: false })
  
  if (!token) return adapterResponseHttp({ message: 'Token is undefined', hasError: true, statusHttp: 400 })

  const tokenEncryp = encryptManager.encryptAES(token)

  if (!tokenEncryp) return adapterResponseHttp({ message: 'TokenEncryp is undefined', hasError: true, statusHttp: 400 })

  const cookie = cookieManager.createCookie({ data: tokenEncryp })

  if (!cookie) return adapterResponseHttp({ message: 'Cookie is undefined', hasError: true, statusHttp: 400 })
  
  return adapterResponseHttp({ payload: cookie, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}
