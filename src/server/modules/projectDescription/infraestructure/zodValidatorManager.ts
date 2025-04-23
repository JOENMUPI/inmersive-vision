import { adapterResponse } from "@/server/utilities/adapters";
import { projectDescriptionTableKeys } from "@/server/utilities/enums";
import { adapterResponseI, projectDescriptionModel, updateBaseI, validatorManagerI } from "@/server/utilities/interfaces";
import { z, ZodType } from 'zod'

const objectSchema = z.object({
  [projectDescriptionTableKeys.DESCRIPTION]: z.string().trim().nonempty(),
  [projectDescriptionTableKeys.PROJECT_ID]: z.number().min(1),
  [projectDescriptionTableKeys.INVOICE_PRUBLIC_ID]: z.string().trim().nonempty(),
  [projectDescriptionTableKeys.UNITARY_PRICE]: z.number().min(1),
  [projectDescriptionTableKeys.ELEMENT_NUM]: z.number().min(1),
  [projectDescriptionTableKeys.ID]: z.number(),
  [projectDescriptionTableKeys.CREATED_AT]: z.date(),
  [projectDescriptionTableKeys.SOFT_DELETED]: z.boolean(),
  [projectDescriptionTableKeys.UPDATED_AT]: z.date(),
});

const validateUpdate = (models: Array<updateBaseI<projectDescriptionModel>>): adapterResponseI<Array<projectDescriptionModel>> => {
  const schema: ZodType<Array<updateBaseI<projectDescriptionModel>>> = z.array(
    z.object({
      currentId: z.string().trim().nonempty(), 
      newData: objectSchema,
    }
  )).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<projectDescriptionModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateDelete = (ids: string[]): adapterResponseI<Array<projectDescriptionModel>> => {
  const schema = z.array(z.string().trim().nonempty()).min(1) 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<projectDescriptionModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateGet = (ids?: string[]): adapterResponseI<Array<projectDescriptionModel>> => {
  const schema = z.array(z.string().trim().nonempty()).optional() 

  const { success, error } = schema.safeParse(ids)
  const response = adapterResponse<projectDescriptionModel[]>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

const validateInsert = (models: projectDescriptionModel[]): adapterResponseI<Array<projectDescriptionModel>> => {  
  const schema: ZodType<Array<projectDescriptionModel>> = z.array(objectSchema.omit({
    [projectDescriptionTableKeys.ID]: true,
    [projectDescriptionTableKeys.UPDATED_AT]: true,
    [projectDescriptionTableKeys.SOFT_DELETED]: true, 
    [projectDescriptionTableKeys.CREATED_AT]: true
  })).min(1) 

  const { success, error } = schema.safeParse(models)
  const response = adapterResponse<Array<projectDescriptionModel>>({ hasError: !success, message: 'All done' }) 
  
  if (error && error.errors.length > 0) response.message = error.errors[0].path + ": " + error.errors[0].message
  
  return response
}

export const validatorManager: validatorManagerI<projectDescriptionModel> = {
  validateInsert,
  validateDelete,
  validateGet,
  validateUpdate
}