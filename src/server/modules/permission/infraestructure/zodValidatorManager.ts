import { adapterResponse } from "@/server/utilities/adapters";
import { permissionTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, permissionModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [permissionTableKeys.DESCRIPTION]: z.string().trim().nonempty(),
  [permissionTableKeys.ID]: z.number(),
  [permissionTableKeys.CREATED_AT]: z.date(),
  [permissionTableKeys.SOFT_DELETED]: z.boolean(),
  [permissionTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<permissionModel>>): adapterResponseI<Array<permissionModel>> => {
  const schema: ZodType<Array<updateBaseI<permissionModel>>> = z.array(
    z.object({
      currentId: z.string().trim().nonempty(), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<permissionModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: string[]): adapterResponseI<Array<permissionModel>> => {
  const schema = z.array(z.string().trim().nonempty()).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<permissionModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: string[]): adapterResponseI<Array<permissionModel>> => {
  const schema = z.array(z.string().trim().nonempty()).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<permissionModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: permissionModel[]): adapterResponseI<Array<permissionModel>> => {  
  const schema: ZodType<Array<permissionModel>> = z.array(objectSchema.omit({
    [permissionTableKeys.ID]: true,
    [permissionTableKeys.UPDATED_AT]: true,
    [permissionTableKeys.SOFT_DELETED]: true, 
    [permissionTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<permissionModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<permissionModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}