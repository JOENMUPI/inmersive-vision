import { dbInvoice } from "@/server/modules/invoice/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { typePublicId } from "@/server/utilities/enums";
import { dateToUTC, hexToString } from "@/server/utilities/formatters"
import { generatePublicId } from "@/server/utilities/generators";
import {
  adapterResponseHttpI,
  anulateProps,
  invoiceModel,
  updateBaseI,
  validatorManagerI,
  invoiceId,
  encryptManagerI
} from "@/server/utilities/interfaces";

export const getInvoiceUseCase = async ({
  invoiceIds,
  dbManager,
  validatorManager,
  encryptManager
}:{
  invoiceIds?: invoiceId[],
  dbManager: dbInvoice,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<invoiceModel, invoiceId>
}): Promise<adapterResponseHttpI<Array<invoiceModel>>> => {
  if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateGet(invoiceIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  const dbData = await dbManager.getInvoice(invoiceIds);
  
  if (dbData.hasError) return adapterResponseHttp({ message: dbData.message, hasError: dbData.hasError, statusHttp: 500 })
  else if (!dbData.payload || dbData.payload.length === 0) {
    return adapterResponseHttp({ message: 'No invoices found', hasError: false, statusHttp: 200 })
  }

  const dataFormatted: invoiceModel[] = dbData.payload.map(invoice => {
    return {
      client_id: invoice.client_id,
      creation_date: invoice.creation_date,
      expiration_date: invoice.expiration_date,
      installment_num: invoice.installment_num,
      url_qr: invoice.url_qr ? encryptManager.decryptAES(hexToString(invoice.url_qr)) : undefined,
      mount_pay: invoice.mount_pay,
      method_payment_id: invoice.method_payment_id,
      ref_num_paid: invoice.ref_num_paid,
      project_id: invoice.project_id,
      public_id: invoice.public_id,
      soft_deleted: invoice.soft_deleted,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at
    }
  })
  
  return adapterResponseHttp({ payload: dataFormatted, message: dbData.message, hasError: dbData.hasError, statusHttp: 200 })
}

export const createInvoiceUseCase = async ({
  invoices,
  dbManager,
  validatorManager,
  encryptManager
}:{
  invoices: invoiceModel[],
  dbManager: dbInvoice,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<invoiceModel, invoiceId> 
}): Promise<adapterResponseHttpI<Array<invoiceModel>>> => {
  if (!invoices) {
    return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
  } else if (invoices.length === 0) {
    return adapterResponseHttp({ message: 'invoice no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateInsert(invoices)
  
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })
  
  let lastPublicId: string | undefined
  let errResArr  
  const lastInvoice = await dbManager.getLastInvoice()
  
  if(lastInvoice.hasError) return adapterResponseHttp({ message: lastInvoice.message, hasError: true, statusHttp: 400 }) 
  if(lastInvoice.payload && lastInvoice.payload.length > 0) lastPublicId = lastInvoice.payload[0].public_id
  
  const _invoices: invoiceModel[] = invoices.map(invoice => {
    const publicId = generatePublicId({ typePublicId: typePublicId.INVOICE, lastPublicId })
    
    if (publicId.hasError) errResArr = adapterResponseHttp({ statusHttp: 500, message: publicId.message, hasError: true })
    else if (!publicId.payload) errResArr = adapterResponseHttp({ statusHttp: 500, message: 'publicId no has payload', hasError: true })
    
    lastPublicId = publicId.payload!
    return {
      client_id: invoice.client_id,
      creation_date: invoice.creation_date,
      expiration_date: invoice.expiration_date,
      installment_num: invoice.installment_num,
      mount_pay: invoice.mount_pay,
      url_qr: invoice.url_qr ? encryptManager.encryptAES(invoice.url_qr) : undefined,
      method_payment_id: invoice.method_payment_id,
      project_id: invoice.project_id,
      public_id: publicId.payload!,
      ref_num_paid: invoice.ref_num_paid,
    }
  })

  if (errResArr) return errResArr

  const res = await dbManager.createInvoice(_invoices);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const deleteInvoiceUseCase = async ({
  invoiceIds,
  dbManager,
  validatorManager
}:{
  invoiceIds: invoiceId[],
  dbManager: dbInvoice,
  validatorManager: validatorManagerI<invoiceModel, invoiceId>,
}): Promise<adapterResponseHttpI<Array<invoiceModel>>> => {
  if (!invoiceIds) {
    return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
  } else if (invoiceIds.length === 0) {
    return adapterResponseHttp({ message: 'invoice no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(invoiceIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const res = await dbManager.deleteInvoice(invoiceIds);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const updateInvoiceUseCase = async ({
  invoice,
  dbManager,
  validatorManager,
  encryptManager
}:{
  invoice: updateBaseI<invoiceModel, invoiceId>,
  dbManager: dbInvoice,
  encryptManager: encryptManagerI,
  validatorManager: validatorManagerI<invoiceModel, invoiceId>
}): Promise<adapterResponseHttpI<Array<invoiceModel>>> => {
  if (!invoice) {
    return adapterResponseHttp({ message: 'invoice is undefined', hasError: true, statusHttp: 500 })
  } else if (!invoice.currentId) {
    return adapterResponseHttp({ message: 'currentId is undefined', hasError: true, statusHttp: 500 })
  } else if (!invoice.newData) {
    return adapterResponseHttp({ message: 'newData is undefined', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!encryptManager) {
    return adapterResponseHttp({ message: 'encryptManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateUpdate([invoice])
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const _invoice: updateBaseI<invoiceModel, invoiceId> = {
    currentId: invoice.currentId,
    newData: {
      client_id: invoice.newData.client_id,
      creation_date: invoice.newData.creation_date,
      expiration_date: invoice.newData.expiration_date,
      installment_num: invoice.newData.installment_num,
      mount_pay: invoice.newData.mount_pay,
      url_qr: invoice.newData.url_qr ? encryptManager.encryptAES(invoice.newData.url_qr) : undefined,
      method_payment_id: invoice.newData.method_payment_id,
      project_id: invoice.newData.project_id,
      public_id: invoice.newData.public_id,
      ref_num_paid: invoice.newData.ref_num_paid,
      created_at: invoice.newData.created_at,
      soft_deleted: invoice.newData.soft_deleted,
      updated_at: dateToUTC(new Date())
    }
  }
  
  const res = await dbManager.updateInvoice(_invoice);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}

export const anulateInvoiceUseCase = async ({
  invoiceIds,
  dbManager,
  validatorManager
}: {
  invoiceIds: invoiceId[],
  dbManager: dbInvoice,
  validatorManager: validatorManagerI<invoiceModel, invoiceId> 
}): Promise<adapterResponseHttpI<Array<invoiceModel>>> => {
  if (!invoiceIds) {
    return adapterResponseHttp({ message: 'ids is undefined', hasError: true, statusHttp: 500 })
  } else if (invoiceIds.length === 0) {
    return adapterResponseHttp({ message: 'ids no data', hasError: true, statusHttp: 500 })
  } else if (!dbManager) {
    return adapterResponseHttp({ message: 'dbManager is undefined', hasError: true, statusHttp: 500 })
  } else if (!validatorManager) {
    return adapterResponseHttp({ message: 'validatorManager is undefined', hasError: true, statusHttp: 500 })
  }

  const validator = validatorManager.validateDelete(invoiceIds)
  if (validator.hasError) return adapterResponseHttp({ statusHttp: 400, ...validator })

  const data: anulateProps<invoiceId> = {
    ids: invoiceIds,
    soft_deleted: true,
    update_at: dateToUTC(new Date())
  }

  const res = await dbManager.anulateInvoice(data);

  if (res.hasError) return adapterResponseHttp({ message: res.message, hasError: res.hasError, statusHttp: 500 })
  else return adapterResponseHttp({ payload: res.payload, message: res.message, hasError: res.hasError, statusHttp: 200 })
}
