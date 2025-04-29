import { adapterResponse } from "@/server/utilities/adapters";
import { methodPaymentTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, methodPaymentModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [methodPaymentTableKeys.COMPANY_NAME]: z.string().trim().nonempty(),
  [methodPaymentTableKeys.BANK_NAME]: z.string().trim().nonempty(),
  [methodPaymentTableKeys.ROUTING_NUM]: z.string().trim().nonempty(),
  [methodPaymentTableKeys.ACCOUNT_NUM]: z.string().trim().nonempty(),
  [methodPaymentTableKeys.ZELLE]: z.string().trim().nonempty(),
  [methodPaymentTableKeys.URL_QR]: z.string().trim().nonempty().optional(),
  [methodPaymentTableKeys.CREATED_AT]: z.date(),
  [methodPaymentTableKeys.ID]: z.number(),
  [methodPaymentTableKeys.SOFT_DELETED]: z.boolean(),
  [methodPaymentTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<methodPaymentModel>>): adapterResponseI<Array<methodPaymentModel>> => {
  const schema: ZodType<Array<updateBaseI<methodPaymentModel>>> = z.array(
    z.object({
      currentId: z.number().min(1), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<methodPaymentModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: number[]): adapterResponseI<Array<methodPaymentModel>> => {
  const schema = z.array(z.number().min(1)).min(1) 
  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<methodPaymentModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: number[]): adapterResponseI<Array<methodPaymentModel>> => {
  const schema = z.array(z.number().min(1)).optional() 
  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<methodPaymentModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: methodPaymentModel[]): adapterResponseI<Array<methodPaymentModel>> => {  
  const schema: ZodType<Array<methodPaymentModel>> = z.array(objectSchema.omit({
    [methodPaymentTableKeys.ID]: true,
    [methodPaymentTableKeys.UPDATED_AT]: true,
    [methodPaymentTableKeys.SOFT_DELETED]: true, 
    [methodPaymentTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<methodPaymentModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<methodPaymentModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}