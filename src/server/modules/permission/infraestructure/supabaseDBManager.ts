import { dbPermission } from '@/server/modules/permission/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, permissionModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { permissionTableKeys, tableNames } from '@/server/utilities/enums';

const getPermission = async (permissionIds?: number[]): Promise<adapterResponseI<Array<permissionModel>>> => {
  const query = supabaseClient.from(tableNames.PERMISSION)
    .select()

  if (permissionIds && permissionIds.length > 0) {
    query.in(permissionTableKeys.ID, permissionIds)
  }

  const { data, error } = await query
    .eq(permissionTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<permissionModel>>()
  
  if (error) {
    console.error('Error to get permissions:', error);
    return adapterResponse({ message: `Error to get permissions: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get permissions succesfully`, hasError: false, payload: data });;
  }
}

const updatePermission = async (permission: updateBaseI<permissionModel>): Promise<adapterResponseI<Array<permissionModel>>> => {
  const query = supabaseClient.from(tableNames.PERMISSION)
    .update(permission.newData)
    .eq(permissionTableKeys.ID, permission.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<permissionModel>>();

  if (error) {
    console.error('Error updating permissions:', error)
    return adapterResponse({ message: `Error updating permissions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'permissions updated successfully', hasError: false, payload: data })
  }
}

const createPermission = async (permissions: permissionModel[]): Promise<adapterResponseI<Array<permissionModel>>> => {
  const query = supabaseClient.from(tableNames.PERMISSION)
  .insert(permissions)
  .select()

  const { data, error } = await query.overrideTypes<Array<permissionModel>>();
  
  if (error) {
    console.error('Error inserting permissions:', error)
    return adapterResponse({ message: `Error inserting permissions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Permissions created successfully', hasError: false, payload: data }) 
  }
}

const deletePermission = async (permissionId: number[]): Promise<adapterResponseI<Array<permissionModel>>> => {
  const query = supabaseClient.from(tableNames.PERMISSION)
  .delete()
  .in(permissionTableKeys.ID, permissionId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<permissionModel>>();

  if (error) {
    console.error('Error deleting permissions:', error)
    return adapterResponse({ message: `Error deleting permissions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Permissions deleted successfully', hasError: false, payload: data })
  }
}

const anulatePermission = async (props: anulateProps): Promise<adapterResponseI<Array<permissionModel>>> => {
  const query = supabaseClient.from(tableNames.PERMISSION)
  .update({ 
    [permissionTableKeys.SOFT_DELETED]: props.soft_deleted,
    [permissionTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(permissionTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<permissionModel>>();

  if (error) {
    console.error('Error anulating permissions:', error)
    return adapterResponse({ message: `Error anulating permissions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Permissions anulled successfully', hasError: false, payload: data })
  }
}

export const dbManager: dbPermission = {
  createPermission,
  deletePermission,
  getPermission,
  updatePermission,
  anulatePermission
}
