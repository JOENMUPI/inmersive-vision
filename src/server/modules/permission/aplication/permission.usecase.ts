import { dbPermission } from "@/server/modules/permission/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC } from "@/server/utilities/formatters"
import {
  adapterResponseHttpI,
  anulateProps,
  permissionModel,
  updateBaseI,
  validatorManagerI
} from "@/server/utilities/interfaces";

export const getPermissionUseCase = async ({
  permissionIds,
  dbManager,
  validatorManager
}:{
  permissionIds?: string[],
  dbManager: dbPermission,
  validatorManager: validatorManagerI<permissionModel>
}): Promise<adapterResponseHttpI> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(permissionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getPermission(permissionIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No permissions found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: permissionModel[] = dbData.payload.map(permission => {
    return {
      description: permission.description,
      id: permission.id,
      soft_deleted: permission.soft_deleted,
      created_at: permission.created_at,
      updated_at: permission.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createPermissionUseCase = async ({
  permissions,
  dbManager,
  validatorManager,
}:{
  permissions: permissionModel[],
  dbManager: dbPermission,
  validatorManager: validatorManagerI<permissionModel> 
}): Promise<adapterResponseHttpI<Array<permissionModel>>> => {
  if (!permissions) {
    return adapterResponseHttp({ message: 'permission is undefined', hasError: true, statusHttp: 500 })
  } else if (permissions.length === 0) {
    return adapterResponseHttp({ message: 'permission no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(permissions)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const _permissions: permissionModel[] = permissions.map(permission => ({
    description: permission.description,
  }))

  const res = await dbManager.createPermission(_permissions);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deletePermissionUseCase = async ({
  permissionIds,
  dbManager,
  validatorManager
}:{
  permissionIds: string[],
  dbManager: dbPermission,
  validatorManager: validatorManagerI<permissionModel>,
}): Promise<adapterResponseHttpI<Array<permissionModel>>> => {
  if (!permissionIds) {
    return adapterResponseHttp({ message: 'permission is undefined', hasError: true, statusHttp: 500 })
  } else if (permissionIds.length === 0) {
    return adapterResponseHttp({ message: 'permission no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(permissionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deletePermission(permissionIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updatePermissionUseCase = async ({
  permission,
  dbManager,
  validatorManager
}:{
  permission: updateBaseI<permissionModel>,
  dbManager: dbPermission,
  validatorManager: validatorManagerI<permissionModel>
}): Promise<adapterResponseHttpI<Array<permissionModel>>> => {
  if (!permission) {
    return adapterResponseHttp({ message: 'permission is undefined', hasError: true, statusHttp: 500 })
  } else if (!permission.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!permission.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([permission])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _permission: updateBaseI<permissionModel> = {
    currentId: permission.currentId,
    newData: {
      description: permission.newData.description,
      id: permission.newData.id,
      created_at: permission.newData.created_at,
      soft_deleted: permission.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updatePermission(_permission);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulatePermissionUseCase = async ({
  permissionIds,
  dbManager,
  validatorManager
}:{
  permissionIds: string[],
  dbManager: dbPermission,
  validatorManager: validatorManagerI<permissionModel> 
}): Promise<adapterResponseHttpI<Array<permissionModel>>> => {
  if (!permissionIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (permissionIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(permissionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: permissionIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulatePermission(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
