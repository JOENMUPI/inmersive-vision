import { dbUserPermission } from "@/server/modules/userPermission/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC } from "@/server/utilities/formatters"
import {
  adapterResponseHttpI,
  anulateProps,
  encrypManagerI,
  updateBaseI,
  userPermissionId,
  userPermissionModel,
  validatorManagerI
} from "@/server/utilities/interfaces";

export const getUserPermissionUseCase = async ({
  userPermissionIds,
  dbManager,
  validatorManager
}:{
  userPermissionIds?: userPermissionId[],
  dbManager: dbUserPermission,
  validatorManager: validatorManagerI<userPermissionModel, userPermissionId>
}): Promise<adapterResponseHttpI> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(userPermissionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getUserPermission(userPermissionIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No user permissions found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: userPermissionModel[] = dbData.payload.map(userPermission => {
    return {
      is_allowed: userPermission.is_allowed,
      permission_id: userPermission.permission_id,
      user_id: userPermission.user_id,
      soft_deleted: userPermission.soft_deleted,
      created_at: userPermission.created_at,
      updated_at: userPermission.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createUserPermissionUseCase = async ({
  userPermission,
  dbManager,
  validatorManager,
}:{
  userPermission: userPermissionModel[],
  dbManager: dbUserPermission,
  validatorManager: validatorManagerI<userPermissionModel, userPermissionId> 
}): Promise<adapterResponseHttpI<Array<userPermissionModel>>> => {
  if (!userPermission) {
    return adapterResponseHttp({ message: 'user permission is undefined', hasError: true, statusHttp: 500 })
  } else if (userPermission.length === 0) {
    return adapterResponseHttp({ message: 'user permission no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(userPermission)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const _userPermissions: userPermissionModel[] = userPermission.map(userPermission => ({
    permission_id: userPermission.permission_id,
    user_id: userPermission.user_id,
    is_allowed: userPermission.is_allowed
  }))

  const res = await dbManager.createUserPermission(_userPermissions);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteUserPermissionUseCase = async ({
  userPermissionIds,
  dbManager,
  validatorManager
}:{
  userPermissionIds: userPermissionId[],
  dbManager: dbUserPermission,
  validatorManager: validatorManagerI<userPermissionModel, userPermissionId>,
}): Promise<adapterResponseHttpI<Array<userPermissionModel>>> => {
  if (!userPermissionIds) {
    return adapterResponseHttp({ message: 'user permission is undefined', hasError: true, statusHttp: 500 })
  } else if (userPermissionIds.length === 0) {
    return adapterResponseHttp({ message: 'user permission no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(userPermissionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteUserPermission(userPermissionIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateUserPermissionUseCase = async ({
  userPermission,
  dbManager,
  encryptManager,
  validatorManager
}:{
  userPermission: updateBaseI<userPermissionModel, userPermissionId>,
  dbManager: dbUserPermission,
  encryptManager: encrypManagerI,
  validatorManager: validatorManagerI<userPermissionModel, userPermissionId>
}): Promise<adapterResponseHttpI<Array<userPermissionModel>>> => {
  if (!userPermission) {
    return adapterResponseHttp({ message: 'UserPermission is undefined', hasError: true, statusHttp: 500 })
  } else if (!userPermission.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!userPermission.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([userPermission])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _UserPermission: updateBaseI<userPermissionModel, userPermissionId> = {
    currentId: userPermission.currentId,
    newData: {
      is_allowed: userPermission.newData.is_allowed,
      permission_id: userPermission.newData.permission_id,
      user_id: userPermission.newData.user_id,
      created_at: userPermission.newData.created_at,
      soft_deleted: userPermission.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateUserPermission(_UserPermission);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateUserPermissionUseCase = async ({
  userPermissionIds,
  dbManager,
  validatorManager
}:{
  userPermissionIds: userPermissionId[],
  dbManager: dbUserPermission,
  validatorManager: validatorManagerI<userPermissionModel, userPermissionId> 
}): Promise<adapterResponseHttpI<Array<userPermissionModel>>> => {
  if (!userPermissionIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (userPermissionIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(userPermissionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps<userPermissionId> = {
    ids: userPermissionIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateUserPermission(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
