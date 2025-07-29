import { dbMethodPayment } from "@/server/modules/methodPayment/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { dateToUTC, hexToString } from "@/server/utilities/formatters"
import {
  adapterResponseHttpI,
  anulateProps,
  methodPaymentModel,
  encryptManagerI,
  updateBaseI,
  validatorManagerI
} from "@/server/utilities/interfaces";

export const getMethodPaymentUseCase = async ({
  methodPaymentIds,
  dbManager,
  encryptManager,
  validatorManager
}:{
  methodPaymentIds?: number[],
  dbManager: dbMethodPayment,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<methodPaymentModel>
}): Promise<adapterResponseHttpI<Array<methodPaymentModel>>> => {
  if (!validatorManager) {
    return adapterResponseHttp({ message: 'Validator manager is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(methodPaymentIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getMethodPayment(methodPaymentIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'Method payments not found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: methodPaymentModel[] = dbData.payload.map(methodPayment => {
    return {
      bank_name: encryptManager.decryptAES(hexToString(methodPayment.bank_name)),
      zelle: encryptManager.decryptAES(hexToString(methodPayment.zelle)),
      routing_num: encryptManager.decryptAES(hexToString(methodPayment.routing_num)),
      account_num: encryptManager.decryptAES(hexToString(methodPayment.account_num)),
      company_name: encryptManager.decryptAES(hexToString(methodPayment.company_name)),
      id: methodPayment.id,
      soft_deleted: methodPayment.soft_deleted,
      created_at: methodPayment.created_at,
      updated_at: methodPayment.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createMethodPaymentUseCase = async ({
  methodPayments,
  dbManager,
  encryptManager,
  validatorManager
}:{
  methodPayments: methodPaymentModel[],
  dbManager: dbMethodPayment,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<methodPaymentModel>
}): Promise<adapterResponseHttpI<Array<methodPaymentModel>>> => {
  if (!methodPayments) {
    return adapterResponseHttp({ message: 'Method payment is undefined', hasError: true, statusHttp: 500 })
  } else if (methodPayments.length === 0) {
    return adapterResponseHttp({ message: 'Method payment no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'Validator manager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(methodPayments)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const _methodPayments: methodPaymentModel[] = methodPayments.map(methodPayment => ({
    bank_name: encryptManager.encryptAES(methodPayment.bank_name),
    zelle: encryptManager.encryptAES(methodPayment.zelle),
    routing_num: encryptManager.encryptAES(methodPayment.routing_num),
    account_num: encryptManager.encryptAES(methodPayment.account_num),
    company_name: encryptManager.encryptAES(methodPayment.company_name),
  }))

  const res = await dbManager.createMethodPayment(_methodPayments);

  if (res.payload && res.payload.length > 0) {
    res.payload = res.payload.map(methodPayment => {
      return {
        bank_name: encryptManager.decryptAES(hexToString(methodPayment.bank_name)),
        zelle: encryptManager.decryptAES(hexToString(methodPayment.zelle)),
        routing_num: encryptManager.decryptAES(hexToString(methodPayment.routing_num)),
        account_num: encryptManager.decryptAES(hexToString(methodPayment.account_num)),
        company_name: encryptManager.decryptAES(hexToString(methodPayment.company_name)),
        id: methodPayment.id,
        soft_deleted: methodPayment.soft_deleted,
        created_at: methodPayment.created_at,
        updated_at: methodPayment.updated_at
      }
    })
  }

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteMethodPaymentUseCase = async ({
  methodPaymentIds,
  dbManager,
  validatorManager
}:{
  methodPaymentIds: number[],
  dbManager: dbMethodPayment,
  validatorManager: validatorManagerI<methodPaymentModel>
}): Promise<adapterResponseHttpI<Array<methodPaymentModel>>> => {
  if (!methodPaymentIds) {
    return adapterResponseHttp({ message: 'Method payment is undefined', hasError: true, statusHttp: 500 })
  } else if (methodPaymentIds.length === 0) {
    return adapterResponseHttp({ message: 'Method payment no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'Validator manager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(methodPaymentIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteMethodPayment(methodPaymentIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateMethodPaymentUseCase = async ({
  methodPayment,
  dbManager,
  encryptManager,
  validatorManager
}:{
  methodPayment: updateBaseI<methodPaymentModel>,
  dbManager: dbMethodPayment,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<methodPaymentModel>
}): Promise<adapterResponseHttpI<Array<methodPaymentModel>>> => {
  if (!methodPayment) {
    return adapterResponseHttp({ message: 'methodPayments is undefined', hasError: true, statusHttp: 500 })
  } else if (!methodPayment.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!methodPayment.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'Validator manager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([methodPayment])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _methodPayments: updateBaseI<methodPaymentModel> = {
    currentId: methodPayment.currentId,
    newData: {
      bank_name: encryptManager.encryptAES(methodPayment.newData.bank_name),
      zelle: encryptManager.encryptAES(methodPayment.newData.zelle),
      routing_num: encryptManager.encryptAES(methodPayment.newData.routing_num),
      account_num: encryptManager.encryptAES(methodPayment.newData.account_num),
      company_name: encryptManager.encryptAES(methodPayment.newData.company_name),
      id: methodPayment.newData.id,
      created_at: methodPayment.newData.created_at,
      soft_deleted: methodPayment.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateMethodPayment(_methodPayments);

  if (res.payload && res.payload.length > 0) {
    res.payload = res.payload.map(methodPayment => {
      return {
        bank_name: encryptManager.decryptAES(hexToString(methodPayment.bank_name)),
        zelle: encryptManager.decryptAES(hexToString(methodPayment.zelle)),
        routing_num: encryptManager.decryptAES(hexToString(methodPayment.routing_num)),
        account_num: encryptManager.decryptAES(hexToString(methodPayment.account_num)),
        company_name: encryptManager.decryptAES(hexToString(methodPayment.company_name)),
        id: methodPayment.id,
        soft_deleted: methodPayment.soft_deleted,
        created_at: methodPayment.created_at,
        updated_at: methodPayment.updated_at
      }
    })
  }

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateMethodPaymentUseCase = async ({
  methodPaymentIds,
  dbManager,
  validatorManager,
}:{
  methodPaymentIds: number[],
  dbManager: dbMethodPayment,
  validatorManager: validatorManagerI<methodPaymentModel>
}): Promise<adapterResponseHttpI<Array<methodPaymentModel>>> => {
  if (!methodPaymentIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (methodPaymentIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'Validator manager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(methodPaymentIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps = {
    ids: methodPaymentIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateMethodPayment(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
