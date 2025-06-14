import { dbInstallment, installmenteGetPropI } from "@/server/modules/installment/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC } from "@/server/utilities/formatters"
import {
  adapterResponseHttpI,
  anulateProps,
  installmentModel,
  updateBaseI,
  validatorManagerI
} from "@/server/utilities/interfaces";

export const getInstallmentUseCase = async ({
  installmentProps = {} as installmenteGetPropI,
  dbManager,
  validatorManager
}:{
  installmentProps?: installmenteGetPropI,
  dbManager: dbInstallment,
  validatorManager: validatorManagerI<installmentModel>
}): Promise<adapterResponseHttpI<Array<installmentModel>>> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validatorId = validatorManager.validateGet(installmentProps.installmentIds)
  if (validatorId.hasError) return adapterResponseHttp({ statusHttp: 400, ...validatorId })
  
  const validatorProjectId = validatorManager.validateGet(installmentProps.projectId)
  if (validatorProjectId.hasError) return adapterResponseHttp({ statusHttp: 400, ...validatorId })

    const validatorInstallmentNum = validatorManager.validateGet(installmentProps.installmentNum)
  if (validatorInstallmentNum.hasError) return adapterResponseHttp({ statusHttp: 400, ...validatorId })

  const dbData = await dbManager.getInstallment(installmentProps);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No installments found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: installmentModel[] = dbData.payload.map(installment => {
    return {
      installment_num: installment.installment_num,
      mount_pay: installment.mount_pay,
      project_id: installment.project_id,
      id: installment.id,
      soft_deleted: installment.soft_deleted,
      created_at: installment.created_at,
      updated_at: installment.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createInstallmentUseCase = async ({
  installments,
  dbManager,
  validatorManager,
}:{
  installments: installmentModel[],
  dbManager: dbInstallment,
  validatorManager: validatorManagerI<installmentModel> 
}): Promise<adapterResponseHttpI<Array<installmentModel>>> => {
  if (!installments) {
    return adapterResponseHttp({ message: 'installment is undefined', hasError: true, statusHttp: 500 })
  } else if (installments.length === 0) {
    return adapterResponseHttp({ message: 'installment no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(installments)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const _installments: installmentModel[] = installments.map(installment => ({
    installment_num: installment.installment_num,
    mount_pay: installment.mount_pay,
    project_id: installment.project_id,
  }))

  const res = await dbManager.createInstallment(_installments);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteInstallmentUseCase = async ({
  installmentIds,
  dbManager,
  validatorManager
}:{
  installmentIds: number[],
  dbManager: dbInstallment,
  validatorManager: validatorManagerI<installmentModel>,
}): Promise<adapterResponseHttpI<Array<installmentModel>>> => {
  if (!installmentIds) {
    return adapterResponseHttp({ message: 'installment is undefined', hasError: true, statusHttp: 500 })
  } else if (installmentIds.length === 0) {
    return adapterResponseHttp({ message: 'installment no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(installmentIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteInstallment(installmentIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateInstallmentUseCase = async ({
  installment,
  dbManager,
  validatorManager
}:{
  installment: updateBaseI<installmentModel>,
  dbManager: dbInstallment,
  validatorManager: validatorManagerI<installmentModel>
}): Promise<adapterResponseHttpI<Array<installmentModel>>> => {
  if (!installment) {
    return adapterResponseHttp({ message: 'installment is undefined', hasError: true, statusHttp: 500 })
  } else if (!installment.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!installment.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([installment])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _installment: updateBaseI<installmentModel> = {
    currentId: installment.currentId,
    newData: {
      installment_num: installment.newData.installment_num,
      mount_pay: installment.newData.mount_pay,
      project_id: installment.newData.project_id,
      id: installment.newData.id,
      created_at: installment.newData.created_at,
      soft_deleted: installment.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateInstallment(_installment);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateInstallmentUseCase = async ({
  installmentIds,
  dbManager,
  validatorManager
}:{
  installmentIds: number[],
  dbManager: dbInstallment,
  validatorManager: validatorManagerI<installmentModel> 
}): Promise<adapterResponseHttpI<Array<installmentModel>>> => {
  if (!installmentIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (installmentIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(installmentIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: installmentIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateInstallment(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
