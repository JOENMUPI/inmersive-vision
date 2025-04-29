import { dbProjectDescription } from "@/server/modules/projectDescription/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC } from "@/server/utilities/formatters"
import {
  adapterResponseHttpI,
  anulateProps,
  projectDescriptionModel,
  updateBaseI,
  validatorManagerI
} from "@/server/utilities/interfaces";

export const getProjectDescriptionUseCase = async ({
  projectDescriptionIds,
  dbManager,
  validatorManager
}:{
  projectDescriptionIds?: number[],
  dbManager: dbProjectDescription,
  validatorManager: validatorManagerI<projectDescriptionModel>
}): Promise<adapterResponseHttpI> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(projectDescriptionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getProjectDescription(projectDescriptionIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No project descriptions found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: projectDescriptionModel[] = dbData.payload.map(projectDescription => {
    return {
      description: projectDescription.description,
      project_id: projectDescription.project_id,
      element_num: projectDescription.element_num,
      invoice_public_id: projectDescription.invoice_public_id,
      unitary_price: projectDescription.unitary_price,
      id: projectDescription.id,
      soft_deleted: projectDescription.soft_deleted,
      created_at: projectDescription.created_at,
      updated_at: projectDescription.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createProjectDescriptionUseCase = async ({
  projectDescriptions,
  dbManager,
  validatorManager,
}:{
  projectDescriptions: projectDescriptionModel[],
  dbManager: dbProjectDescription,
  validatorManager: validatorManagerI<projectDescriptionModel> 
}): Promise<adapterResponseHttpI<Array<projectDescriptionModel>>> => {
  if (!projectDescriptions) {
    return adapterResponseHttp({ message: 'projectDescription is undefined', hasError: true, statusHttp: 500 })
  } else if (projectDescriptions.length === 0) {
    return adapterResponseHttp({ message: 'projectDescription no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(projectDescriptions)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const _projectDescriptions: projectDescriptionModel[] = projectDescriptions.map(projectDescription => ({
    description: projectDescription.description,
    project_id: projectDescription.project_id,
    element_num: projectDescription.element_num,
    invoice_public_id: projectDescription.invoice_public_id,
    unitary_price: projectDescription.unitary_price
  }))

  const res = await dbManager.createProjectDescription(_projectDescriptions);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteProjectDescriptionUseCase = async ({
  projectDescriptionIds,
  dbManager,
  validatorManager
}:{
  projectDescriptionIds: number[],
  dbManager: dbProjectDescription,
  validatorManager: validatorManagerI<projectDescriptionModel>,
}): Promise<adapterResponseHttpI<Array<projectDescriptionModel>>> => {
  if (!projectDescriptionIds) {
    return adapterResponseHttp({ message: 'projectDescription is undefined', hasError: true, statusHttp: 500 })
  } else if (projectDescriptionIds.length === 0) {
    return adapterResponseHttp({ message: 'projectDescription no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(projectDescriptionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteProjectDescription(projectDescriptionIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateProjectDescriptionUseCase = async ({
  projectDescription,
  dbManager,
  validatorManager
}:{
  projectDescription: updateBaseI<projectDescriptionModel>,
  dbManager: dbProjectDescription,
  validatorManager: validatorManagerI<projectDescriptionModel>
}): Promise<adapterResponseHttpI<Array<projectDescriptionModel>>> => {
  if (!projectDescription) {
    return adapterResponseHttp({ message: 'projectDescription is undefined', hasError: true, statusHttp: 500 })
  } else if (!projectDescription.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!projectDescription.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([projectDescription])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _projectDescription: updateBaseI<projectDescriptionModel> = {
    currentId: projectDescription.currentId,
    newData: {
      description: projectDescription.newData.description,
      project_id: projectDescription.newData.project_id,
      element_num: projectDescription.newData.element_num,
      invoice_public_id: projectDescription.newData.invoice_public_id,
      unitary_price: projectDescription.newData.unitary_price,
      id: projectDescription.newData.id,
      created_at: projectDescription.newData.created_at,
      soft_deleted: projectDescription.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateProjectDescription(_projectDescription);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateProjectDescriptionUseCase = async ({
  projectDescriptionIds,
  dbManager,
  validatorManager
}:{
  projectDescriptionIds: number[],
  dbManager: dbProjectDescription,
  validatorManager: validatorManagerI<projectDescriptionModel> 
}): Promise<adapterResponseHttpI<Array<projectDescriptionModel>>> => {
  if (!projectDescriptionIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (projectDescriptionIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(projectDescriptionIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: projectDescriptionIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateProjectDescription(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
