import { adapterResponse } from "@/server/utilities/adapters";
import { installmentTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, installmentModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [installmentTableKeys.INSTALLMENT_NUM]: z.number().min(1),
  [installmentTableKeys.MOUNT_PAY]: z.number().min(1),
  [installmentTableKeys.PROJECT_ID]: z.number().min(1),
  [installmentTableKeys.ID]: z.number(),
  [installmentTableKeys.CREATED_AT]: z.date(),
  [installmentTableKeys.SOFT_DELETED]: z.boolean(),
  [installmentTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<installmentModel>>): adapterResponseI<Array<installmentModel>> => {
  const schema: ZodType<Array<updateBaseI<installmentModel>>> = z.array(
    z.object({
      currentId: z.string().trim().nonempty(), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<installmentModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: string[]): adapterResponseI<Array<installmentModel>> => {
  const schema = z.array(z.string().trim().nonempty()).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<installmentModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: string[]): adapterResponseI<Array<installmentModel>> => {
  const schema = z.array(z.string().trim().nonempty()).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<installmentModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: installmentModel[]): adapterResponseI<Array<installmentModel>> => {  
  const schema: ZodType<Array<installmentModel>> = z.array(objectSchema.omit({
    [installmentTableKeys.ID]: true,
    [installmentTableKeys.UPDATED_AT]: true,
    [installmentTableKeys.SOFT_DELETED]: true, 
    [installmentTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<installmentModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<installmentModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}