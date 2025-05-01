import { adapterResponse } from "@/server/utilities/adapters";
import { userTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, userModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [userTableKeys.PASS]: z.string().trim().nonempty(),
  [userTableKeys.EMAIL]: z.string().trim().nonempty(),
  [userTableKeys.SALT_PASS]: z.string().trim().nonempty(),
  [userTableKeys.ID]: z.number(),
  [userTableKeys.CREATED_AT]: z.date(),
  [userTableKeys.SOFT_DELETED]: z.boolean(),
  [userTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<userModel>>): adapterResponseI<Array<userModel>> => {
  const schema: ZodType<Array<updateBaseI<userModel>>> = z.array(
    z.object({
      currentId: z.number().min(1), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<userModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: number[]): adapterResponseI<Array<userModel>> => {
  const schema = z.array(z.number().min(1)).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<userModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: number[]): adapterResponseI<Array<userModel>> => {
  const schema = z.array(z.number().min(1)).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<userModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: userModel[]): adapterResponseI<Array<userModel>> => {  
  const schema: ZodType<Array<userModel>> = z.array(objectSchema.omit({
    [userTableKeys.ID]: true,
    [userTableKeys.UPDATED_AT]: true,
    [userTableKeys.SOFT_DELETED]: true, 
    [userTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<userModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<userModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}