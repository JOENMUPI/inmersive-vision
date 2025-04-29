import { dbProjectDescription } from '@/server/modules/projectDescription/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, projectDescriptionModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { projectDescriptionTableKeys, tableNames } from '@/server/utilities/enums';

const getProjectDescription = async (projectDescriptionIds?: number[]): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT_DESCIPTION)
    .select()

  if (projectDescriptionIds && projectDescriptionIds.length > 0) {
    query.in(projectDescriptionTableKeys.ID, projectDescriptionIds)
  }

  const { data, error } = await query
    .eq(projectDescriptionTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<projectDescriptionModel>>()
  
  if (error) {
    console.error('Error to get project descriptions:', error);
    return adapterResponse({ message: `Error to get project descriptions: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get project descriptions succesfully`, hasError: false, payload: data });;
  }
}

const updateProjectDescription = async (
  projectDescription: updateBaseI<projectDescriptionModel>
): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT_DESCIPTION)
    .update(projectDescription.newData)
    .eq(projectDescriptionTableKeys.ID, projectDescription.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<projectDescriptionModel>>();

  if (error) {
    console.error('Error updating project descriptions:', error)
    return adapterResponse({ message: `Error updating project descriptions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Project descriptions updated successfully', hasError: false, payload: data })
  }
}

const createProjectDescription = async (
  projectDescriptions: projectDescriptionModel[]
): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT_DESCIPTION)
  .insert(projectDescriptions)
  .select()

  const { data, error } = await query.overrideTypes<Array<projectDescriptionModel>>();
  
  if (error) {
    console.error('Error inserting project descriptions:', error)
    return adapterResponse({ message: `Error inserting project descriptions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Project descriptions created successfully', hasError: false, payload: data }) 
  }
}

const deleteProjectDescription = async (projectDescriptionId: number[]): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT_DESCIPTION)
  .delete()
  .in(projectDescriptionTableKeys.ID, projectDescriptionId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<projectDescriptionModel>>();

  if (error) {
    console.error('Error deleting project descriptions:', error)
    return adapterResponse({ message: `Error deleting project descriptions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Project descriptions deleted successfully', hasError: false, payload: data })
  }
}

const anulateProjectDescription = async (props: anulateProps): Promise<adapterResponseI<Array<projectDescriptionModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT_DESCIPTION)
  .update({ 
    [projectDescriptionTableKeys.SOFT_DELETED]: props.soft_deleted,
    [projectDescriptionTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(projectDescriptionTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<projectDescriptionModel>>();

  if (error) {
    console.error('Error anulating project descriptions:', error)
    return adapterResponse({ message: `Error anulating project descriptions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Project descriptions anulled successfully', hasError: false, payload: data })
  }
}

export const dbManager: dbProjectDescription = {
  createProjectDescription,
  deleteProjectDescription,
  getProjectDescription,
  updateProjectDescription,
  anulateProjectDescription
}
