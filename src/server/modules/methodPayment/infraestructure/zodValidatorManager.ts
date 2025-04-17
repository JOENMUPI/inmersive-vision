import { adapterResponse } from "@/server/utilities/adapters";
import { adapterResponseI, methodPaymentModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  company_name: z.string().trim().nonempty(),
  bank_name: z.string().trim().nonempty(),
  routing_num: z.string().trim().nonempty(),
  account_num: z.string().trim().nonempty(),
  zelle: z.string().trim().nonempty(),
  url_qr: z.string().trim().nonempty().optional(),
  created_at: z.date(),
  id: z.number(),
  soft_deleted: z.boolean(),
  updated_at: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<methodPaymentModel>>): adapterResponseI<Array<methodPaymentModel>> => {
  const schema: ZodType<Array<updateBaseI<methodPaymentModel>>> = z.array(
    z.object({
      currentId: z.string().trim().nonempty(), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<methodPaymentModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: string[]): adapterResponseI<Array<methodPaymentModel>> => {
  const schema = z.array(z.string().trim().nonempty()).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<methodPaymentModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: string[]): adapterResponseI<Array<methodPaymentModel>> => {
  const schema = z.array(z.string().trim().nonempty()).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<methodPaymentModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: methodPaymentModel[]): adapterResponseI<Array<methodPaymentModel>> => {  
  const schema: ZodType<Array<methodPaymentModel>> = z.array(objectSchema.omit({
    id: true,
    updated_at: true,
    soft_deleted: true, 
    created_at: true
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