import { adapterResponse } from "@/server/utilities/adapters";
import { adapterResponseI, clientModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  name: z.string().trim().nonempty(),
  email: z.string().trim().nonempty(),
  phone: z.string().trim().nonempty(),
  address: z.string().trim().nonempty(),
  id: z.number(),
  created_at: z.date(),
  soft_deleted: z.boolean(),
  updated_at: z.date(),
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
    id: true,
    updated_at: true,
    soft_deleted: true, 
    created_at: true
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