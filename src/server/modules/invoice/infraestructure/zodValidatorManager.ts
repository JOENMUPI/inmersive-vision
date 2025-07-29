import { adapterResponse } from "@/server/utilities/adapters";
import { invoiceTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, invoiceId, invoiceModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [invoiceTableKeys.REF_NUM_PAID]: z.string().trim().nonempty().optional(),
  [invoiceTableKeys.PUBLIC_ID]: z.string().trim().nonempty() ,
  [invoiceTableKeys.CLIENT_ID]: z.number().min(1),
  [invoiceTableKeys.INSTALLMENT_NUM]: z.number().min(1),
  [invoiceTableKeys.MOUNT_PAY]: z.number().min(1), 
  [invoiceTableKeys.METHOD_PAYMENT_ID]: z.number().min(1),
  [invoiceTableKeys.URL_QR]: z.string().trim().nonempty().optional(),
  [invoiceTableKeys.PROJECT_ID]: z.number().min(1),
  [invoiceTableKeys.CREATION_DATE]: z.date(),
  [invoiceTableKeys.EXPIRATION_DATE]: z.date(),
  [invoiceTableKeys.CREATED_AT]: z.date(),
  [invoiceTableKeys.SOFT_DELETED]: z.boolean(),
  [invoiceTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<invoiceModel, invoiceId>>): adapterResponseI<Array<invoiceModel>> => {
  const schema: ZodType<Array<updateBaseI<invoiceModel, invoiceId>>> = z.array(
    z.object({
      currentId: z.object({
        [invoiceTableKeys.PROJECT_ID]: z.number().min(1),
        [invoiceTableKeys.INSTALLMENT_NUM]: z.number().min(1)
      }), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<invoiceModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: invoiceId[]): adapterResponseI<Array<invoiceModel>> => {
  const schema: ZodType<Array<invoiceId>> = z.array(objectSchema.pick({
    [invoiceTableKeys.PROJECT_ID]: true,
    [invoiceTableKeys.INSTALLMENT_NUM]: true
  })).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<invoiceModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: invoiceId[]): adapterResponseI<Array<invoiceModel>> => {
  const schema: ZodType<Array<invoiceId> | undefined> = z.array(objectSchema.pick({
    [invoiceTableKeys.PROJECT_ID]: true,
    [invoiceTableKeys.INSTALLMENT_NUM]: true
  })).optional()

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<invoiceModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: invoiceModel[]): adapterResponseI<Array<invoiceModel>> => {  
  const schema: ZodType<Array<Omit<invoiceModel, 'public_id'>>> = z.array(objectSchema.omit({
    [invoiceTableKeys.PUBLIC_ID]: true,
    [invoiceTableKeys.UPDATED_AT]: true,
    [invoiceTableKeys.SOFT_DELETED]: true, 
    [invoiceTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<invoiceModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  return response
}

export const validatorManager: validatorManagerI<invoiceModel, invoiceId> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}