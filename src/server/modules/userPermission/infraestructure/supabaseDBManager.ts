import { dbUserPermission } from '@/server/modules/userPermission/domain/interfaces';
import { adapterResponse, auxiliaryId } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, userPermissionModel, updateBaseI, adapterResponseI, userPermissionId } from '@/server/utilities/interfaces';
import { userPermissionTableKeys, tableNames } from '@/server/utilities/enums';

const getUserPermission = async (userPermissionIds?: userPermissionId[]): Promise<adapterResponseI<Array<userPermissionModel>>> => {
  const query = supabaseClient.from(tableNames.USER_PERMISSION)
    .select()

  if (userPermissionIds && userPermissionIds.length > 0) {
    const usersIds: number[] = []
    const permissionsIds: number[] = []

    userPermissionIds.forEach(userPermissionId => {
      usersIds.push(userPermissionId.user_id)
      permissionsIds.push(userPermissionId.permission_id)
    })
    
    query.in(userPermissionTableKeys.USER_ID, usersIds)
    query.in(userPermissionTableKeys.PERMISSION_ID, permissionsIds)
  }

  const { data, error } = await query
    .eq(userPermissionTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<userPermissionModel>>()

  if (error) {
    console.error('Error to get user permissions:', error);
    return adapterResponse({ message: `Error to get user permissions: ${error.message}`, hasError: true, });
  } 

  let dataFiltered = data
  if (userPermissionIds && userPermissionIds.length > 0) {
    const allowedIds = new Set(userPermissionIds.map(id => auxiliaryId(id.user_id.toString(), id.permission_id.toString())))
    dataFiltered = data.filter(el => allowedIds.has(auxiliaryId(el.project_id.toString(), el.installment_id.toString())))
  }
  return adapterResponse({ message: `Get user permissions succesfully`, hasError: false, payload: dataFiltered });;
}

const updateUserPermission = async (
  userPermission: updateBaseI<userPermissionModel, userPermissionId>
): Promise<adapterResponseI<Array<userPermissionModel>>> => {
  const query = supabaseClient.from(tableNames.USER_PERMISSION)
    .update(userPermission.newData)
    .eq(userPermissionTableKeys.USER_ID, userPermission.currentId.user_id)
    .eq(userPermissionTableKeys.PERMISSION_ID, userPermission.currentId.permission_id)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<userPermissionModel>>();

  if (error) {
    console.error('Error updating userPermissions:', error)
    return adapterResponse({ message: `Error updating userPermissions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'User permissions updated successfully', hasError: false, payload: data })
  }
}

const createUserPermission = async (userPermissions: userPermissionModel[]): Promise<adapterResponseI<Array<userPermissionModel>>> => {
  const query = supabaseClient.from(tableNames.USER_PERMISSION)
  .insert(userPermissions)
  .select()

  const { data, error } = await query.overrideTypes<Array<userPermissionModel>>();
  
  if (error) {
    console.error('Error inserting userPermissions:', error)
    return adapterResponse({ message: `Error inserting userPermissions: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'User permissions created successfully', hasError: false, payload: data }) 
  }
}

const deleteUserPermission = async (userPermissionId: userPermissionId[]): Promise<adapterResponseI<Array<userPermissionModel>>> => {
  const response: userPermissionModel[] = []
  
  for(const id of userPermissionId) {
    const query = supabaseClient.from(tableNames.USER_PERMISSION)
    .delete()
    .eq(userPermissionTableKeys.USER_ID, id.user_id)
    .eq(userPermissionTableKeys.PERMISSION_ID, id.permission_id)
    .select()
    
    const { data, error } = await query.overrideTypes<Array<userPermissionModel>>();
  
    if (error) {
      const fallback = await createUserPermission(response)
      if (fallback.hasError) return adapterResponse({
        message: `Error on fallback deleting user permissions: ${fallback.message}`,
        hasError: true
      })

      console.error('Error deleting user permissions:', error)
      return adapterResponse({ message: `Error deleting user permissions: ${error.message}`, hasError: true })
    } 

    response.push(...data)
  }
  
  return adapterResponse({ message: 'User permission deleted successfully', hasError: false, payload: response })
}

const anulateUserPermission = async (props: anulateProps<userPermissionId>): Promise<adapterResponseI<Array<userPermissionModel>>> => {
  const response: userPermissionModel[] = []
  
  for(const id of props.ids) {
    const query = supabaseClient.from(tableNames.USER_PERMISSION)
    .update({ 
      [userPermissionTableKeys.SOFT_DELETED]: props.soft_deleted,
      [userPermissionTableKeys.UPDATED_AT]: props.update_at,
    })
    .eq(userPermissionTableKeys.USER_ID, id.user_id)
    .eq(userPermissionTableKeys.PERMISSION_ID, id.permission_id)
    .select()
    const { data, error } = await query.overrideTypes<Array<userPermissionModel>>();
    if (error) {
      const fallback = await createUserPermission(response)
      if (fallback.hasError) return adapterResponse({
        message: `Error on fallback deleting user permissions: ${fallback.message}`,
        hasError: true
      })

      console.error('Error anulating user permissions:', error)
      return adapterResponse({ message: `Error anulating user permissions: ${error.message}`, hasError: true })
    } 
    response.push(...data)
  }

  return adapterResponse({ message: 'User permissions anulled successfully', hasError: false, payload: response })  
}

export const dbManager: dbUserPermission = {
  createUserPermission,
  updateUserPermission,
  getUserPermission,
  deleteUserPermission,
  anulateUserPermission
}
