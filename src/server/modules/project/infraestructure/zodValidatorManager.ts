import { adapterResponse } from "@/server/utilities/adapters";
import { adapterResponseI, projectModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  total_installment: z.number().min(1),
  public_id: z.string().trim().nonempty(),
  id: z.number(),
  created_at: z.date(),
  soft_deleted: z.boolean(),
  updated_at: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<projectModel>>): adapterResponseI<Array<projectModel>> => {
  const schema: ZodType<Array<updateBaseI<projectModel>>> = z.array(
    z.object({
      currentId: z.string().trim().nonempty(), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<projectModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: string[]): adapterResponseI<Array<projectModel>> => {
  const schema = z.array(z.string().trim().nonempty()).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<projectModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: string[]): adapterResponseI<Array<projectModel>> => {
  const schema = z.array(z.string().trim().nonempty()).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<projectModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: projectModel[]): adapterResponseI<Array<projectModel>> => {  
  const schema: ZodType<Array<projectModel>> = z.array(objectSchema.omit({
    id: true,
    updated_at: true,
    soft_deleted: true, 
    created_at: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<projectModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<projectModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}