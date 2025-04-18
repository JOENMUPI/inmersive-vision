import { adapterResponse } from "@/server/utilities/adapters";
import { projectTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, projectModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [projectTableKeys.TOTAL_INSTALLMENT]: z.number().min(1),
  [projectTableKeys.PUBLIC_ID]: z.string().trim().nonempty(),
  [projectTableKeys.ID]: z.number(),
  [projectTableKeys.CREATED_AT]: z.date(),
  [projectTableKeys.SOFT_DELETED]: z.boolean(),
  [projectTableKeys.UPDATED_AT]: z.date(),
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
  const schema: ZodType<Array<Omit<projectModel, `${projectTableKeys.PUBLIC_ID}`>>> = z.array(objectSchema.omit({
    [projectTableKeys.ID]: true,
    [projectTableKeys.UPDATED_AT]: true,
    [projectTableKeys.SOFT_DELETED]: true, 
    [projectTableKeys.CREATED_AT]: true,
    [projectTableKeys.PUBLIC_ID]: true
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