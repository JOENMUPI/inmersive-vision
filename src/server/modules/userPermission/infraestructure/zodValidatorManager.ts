import { adapterResponse } from "@/server/utilities/adapters";
import { userPermissionTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, userPermissionModel, updateBaseI, validatorManagerI, userPermissionId } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [userPermissionTableKeys.IS_ALLOWED]: z.boolean(),
  [userPermissionTableKeys.USER_ID]: z.number(),
  [userPermissionTableKeys.PERMISSION_ID]: z.number(),
  [userPermissionTableKeys.CREATED_AT]: z.date(),
  [userPermissionTableKeys.SOFT_DELETED]: z.boolean(),
  [userPermissionTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<userPermissionModel, userPermissionId>>): adapterResponseI<Array<userPermissionModel>> => {
  const schema: ZodType<Array<updateBaseI<userPermissionModel, userPermissionId>>> = z.array(
    z.object({
      currentId: z.object({
        [userPermissionTableKeys.USER_ID]: z.number().min(1),
        [userPermissionTableKeys.PERMISSION_ID]: z.number().min(1) 
      }), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<userPermissionModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: userPermissionId[]): adapterResponseI<Array<userPermissionModel>> => {
  const schema = z.array(z.object({
    [userPermissionTableKeys.USER_ID]: z.number().min(1),
    [userPermissionTableKeys.PERMISSION_ID]: z.number().min(1)
  })).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<userPermissionModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: userPermissionId[]): adapterResponseI<Array<userPermissionModel>> => {
  const schema = z.array(z.object({
    [userPermissionTableKeys.USER_ID]: z.number().min(1),
    [userPermissionTableKeys.PERMISSION_ID]: z.number().min(1)
  })).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<userPermissionModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: userPermissionModel[]): adapterResponseI<Array<userPermissionModel>> => {  
  const schema: ZodType<Array<userPermissionModel>> = z.array(objectSchema.omit({
    [userPermissionTableKeys.UPDATED_AT]: true,
    [userPermissionTableKeys.SOFT_DELETED]: true, 
    [userPermissionTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<userPermissionModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<userPermissionModel, userPermissionId> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}