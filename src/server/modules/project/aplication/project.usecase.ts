import { dbProject } from "@/server/modules/project/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC } from "@/server/utilities/formatters"
import { adapterResponseHttpI, anulateProps, projectModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { generatePublicId } from "../domain/generators";

export const getProjectUseCase = async ({
  projectIds,
  dbManager,
  validatorManager
}:{
  projectIds?: string[],
  dbManager: dbProject,
  validatorManager: validatorManagerI<projectModel>
}): Promise<adapterResponseHttpI> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(projectIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getProject(projectIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No projects found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: projectModel[] = dbData.payload.map(project => {
    return {
      public_id: project.public_id,
      total_installment: project.total_installment,
      id: project.id,
      soft_deleted: project.soft_deleted,
      created_at: project.created_at,
      updated_at: project.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createProjectUseCase = async ({
  projects,
  dbManager,
  validatorManager,
}:{
  projects: projectModel[],
  dbManager: dbProject,
  validatorManager: validatorManagerI<projectModel> 
}): Promise<adapterResponseHttpI<Array<projectModel>>> => {
  if (!projects) {
    return adapterResponseHttp({ message: 'project is undefined', hasError: true, statusHttp: 500 })
  } else if (projects.length === 0) {
    return adapterResponseHttp({ message: 'project no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(projects)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const lastProject = await dbManager.getLastProject()
  let lastPublicId: string | undefined
  
  if (lastProject.hasError) return adapterResponseHttp({ statusHttp: 500, ...lastProject })
  if (lastProject.payload && lastProject.payload[0]) lastPublicId = lastProject.payload[0].public_id 

  let errResArr
  const _projects: projectModel[] = projects.map(project => {
    const resPublicId = generatePublicId(lastPublicId)
  
    if (resPublicId.hasError) errResArr = adapterResponseHttp({ statusHttp: 500, message: resPublicId.message, hasError: true })
    if (!resPublicId.payload) errResArr = adapterResponseHttp({ statusHttp: 500, message: 'resPublicId no has payload', hasError: true })
    
    lastPublicId = resPublicId.payload 
    return {
      public_id: resPublicId.payload!,
      total_installment: project.total_installment
    }
  })

  if (errResArr) return errResArr

  const res = await dbManager.createProject(_projects);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteProjectUseCase = async ({
  projectIds,
  dbManager,
  validatorManager
}:{
  projectIds: string[],
  dbManager: dbProject,
  validatorManager: validatorManagerI<projectModel>,
}): Promise<adapterResponseHttpI<Array<projectModel>>> => {
  if (!projectIds) {
    return adapterResponseHttp({ message: 'project is undefined', hasError: true, statusHttp: 500 })
  } else if (projectIds.length === 0) {
    return adapterResponseHttp({ message: 'project no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(projectIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteProject(projectIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateProjectUseCase = async ({
  project,
  dbManager,
  validatorManager
}:{
  project: updateBaseI<projectModel>,
  dbManager: dbProject,
  validatorManager: validatorManagerI<projectModel>
}): Promise<adapterResponseHttpI<Array<projectModel>>> => {
  if (!project) {
    return adapterResponseHttp({ message: 'project is undefined', hasError: true, statusHttp: 500 })
  } else if (!project.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!project.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([project])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _project: updateBaseI<projectModel> = {
    currentId: project.currentId,
    newData: {
      public_id: project.newData.public_id,
      total_installment: project.newData.total_installment,
      id: project.newData.id,
      created_at: project.newData.created_at,
      soft_deleted: project.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateProject(_project);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateProjectUseCase = async ({
  projectIds,
  dbManager,
  validatorManager
}:{
  projectIds: string[],
  dbManager: dbProject,
  validatorManager: validatorManagerI<projectModel> 
}): Promise<adapterResponseHttpI<Array<projectModel>>> => {
  if (!projectIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (projectIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(projectIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: projectIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateProject(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
