import { adapterResponse } from "@/server/utilities/adapters";
import { clientTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, clientModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [clientTableKeys.NAME]: z.string().trim().nonempty(),
  [clientTableKeys.EMAIL]: z.string().trim().nonempty(),
  [clientTableKeys.PHONE]: z.string().trim().nonempty(),
  [clientTableKeys.ADDRESS]: z.string().trim().nonempty(),
  [clientTableKeys.ID]: z.number(),
  [clientTableKeys.CREATED_AT]: z.date(),
  [clientTableKeys.SOFT_DELETED]: z.boolean(),
  [clientTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<clientModel>>): adapterResponseI<Array<clientModel>> => {
  const schema: ZodType<Array<updateBaseI<clientModel>>> = z.array(
    z.object({
      currentId: z.string().trim().nonempty(), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<clientModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: string[]): adapterResponseI<Array<clientModel>> => {
  const schema = z.array(z.string().trim().nonempty()).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<clientModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: string[]): adapterResponseI<Array<clientModel>> => {
  const schema = z.array(z.string().trim().nonempty()).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<clientModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: clientModel[]): adapterResponseI<Array<clientModel>> => {  
  const schema: ZodType<Array<clientModel>> = z.array(objectSchema.omit({
    [clientTableKeys.ID]: true,
    [clientTableKeys.UPDATED_AT]: true,
    [clientTableKeys.SOFT_DELETED]: true, 
    [clientTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<clientModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<clientModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}