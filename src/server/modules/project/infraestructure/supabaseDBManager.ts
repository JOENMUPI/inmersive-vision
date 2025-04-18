import { dbProject } from '@/server/modules/project/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, projectModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { projectTableKeys, tableNames } from '@/server/utilities/enums';

const getProject = async (projectIds?: string[]): Promise<adapterResponseI<Array<projectModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT)
    .select()

  if (projectIds && projectIds.length > 0) {
    query.in(projectTableKeys.ID, projectIds)
  }

  const { data, error } = await query
    .eq(projectTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<projectModel>>()
  
  if (error) {
    console.error('Error to get projects:', error);
    return adapterResponse({ message: `Error to get projects: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get projects succesfully`, hasError: false, payload: data });;
  }
}

const updateProject = async (project: updateBaseI<projectModel>): Promise<adapterResponseI<Array<projectModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT)
    .update(project.newData)
    .eq(projectTableKeys.ID, project.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<projectModel>>();

  if (error) {
    console.error('Error updating projects:', error)
    return adapterResponse({ message: `Error updating projects: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'projects updated successfully', hasError: false, payload: data })
  }
}

const createProject = async (projects: projectModel[]): Promise<adapterResponseI<Array<projectModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT)
  .insert(projects)
  .select()

  const { data, error } = await query.overrideTypes<Array<projectModel>>();
  
  if (error) {
    console.error('Error inserting projects:', error)
    return adapterResponse({ message: `Error inserting projects: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Projects created successfully', hasError: false, payload: data }) 
  }
}

const deleteProject = async (projectId: string[]): Promise<adapterResponseI<Array<projectModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT)
  .delete()
  .in(projectTableKeys.ID, projectId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<projectModel>>();

  if (error) {
    console.error('Error deleting projects:', error)
    return adapterResponse({ message: `Error deleting projects: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Projects deleted successfully', hasError: false, payload: data })
  }
}

const anulateProject = async (props: anulateProps): Promise<adapterResponseI<Array<projectModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT)
  .update({ 
    [projectTableKeys.SOFT_DELETED]: props.soft_deleted,
    [projectTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(projectTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<projectModel>>();

  if (error) {
    console.error('Error anulating projects:', error)
    return adapterResponse({ message: `Error anulating projects: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Projects anulled successfully', hasError: false, payload: data })
  }
}

const getLastProject = async (): Promise<adapterResponseI<Array<projectModel>>> => {
  const query = supabaseClient.from(tableNames.PROJECT)
    .select()
    .order('created_at', { ascending: false })
    .limit(1);
    
  const { data, error } = await query
    .eq(projectTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<projectModel>>()
  
  if (error) {
    console.error('Error to get projects:', error);
    return adapterResponse({ message: `Error to get last project: ${error.message}`, hasError: true });
  } else {
    return adapterResponse({ message: `Get last project succesfully`, hasError: false, payload: data });;
  }
}

export const dbManager: dbProject = {
  createProject,
  deleteProject,
  getProject,
  updateProject,
  anulateProject,
  getLastProject
}
