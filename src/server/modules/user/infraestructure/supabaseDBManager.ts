import { dbUser } from '@/server/modules/user/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, userModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { userTableKeys, tableNames } from '@/server/utilities/enums';

const getUser = async (userIds?: number[]): Promise<adapterResponseI<Array<userModel>>> => {
  const query = supabaseClient.from(tableNames.USERS)
    .select()

  if (userIds && userIds.length > 0) {
    query.in(userTableKeys.ID, userIds)
  }

  const { data, error } = await query
    .eq(userTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<userModel>>()
  
  if (error) {
    console.error('Error to get users:', error);
    return adapterResponse({ message: `Error to get users: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get users succesfully`, hasError: false, payload: data });;
  }
}

const updateUser = async (user: updateBaseI<userModel>): Promise<adapterResponseI<Array<userModel>>> => {
  const query = supabaseClient.from(tableNames.USERS)
    .update(user.newData)
    .eq(userTableKeys.ID, user.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<userModel>>();

  if (error) {
    console.error('Error updating users:', error)
    return adapterResponse({ message: `Error updating users: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Users updated successfully', hasError: false, payload: data })
  }
}

const createUser = async (users: userModel[]): Promise<adapterResponseI<Array<userModel>>> => {
  const query = supabaseClient.from(tableNames.USERS)
  .insert(users)
  .select()

  const { data, error } = await query.overrideTypes<Array<userModel>>();
  
  if (error) {
    console.error('Error inserting users:', error)
    return adapterResponse({ message: `Error inserting users: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'users created successfully', hasError: false, payload: data }) 
  }
}

const deleteUser = async (userId: number[]): Promise<adapterResponseI<Array<userModel>>> => {
  const query = supabaseClient.from(tableNames.USERS)
  .delete()
  .in(userTableKeys.ID, userId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<userModel>>();

  if (error) {
    console.error('Error deleting users:', error)
    return adapterResponse({ message: `Error deleting users: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Users deleted successfully', hasError: false, payload: data })
  }
}

const anulateUser = async (props: anulateProps): Promise<adapterResponseI<Array<userModel>>> => {
  const query = supabaseClient.from(tableNames.USERS)
  .update({ 
    [userTableKeys.SOFT_DELETED]: props.soft_deleted,
    [userTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(userTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<userModel>>();

  if (error) {
    console.error('Error anulating users:', error)
    return adapterResponse({ message: `Error anulating users: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Users anulled successfully', hasError: false, payload: data })
  }
}

const getUserByEmail = async (email: string): Promise<adapterResponseI<Array<userModel>>> => {
  const { data, error } = await supabaseClient.from(tableNames.USERS)
    .select()
    .ilike(userTableKeys.EMAIL, email)
    .overrideTypes<Array<userModel>>()

  if (error) {
    console.error('Error to get users by email:', error);
    return adapterResponse({ message: `Error to get users by email: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get users by email succesfully`, hasError: false, payload: data });;
  }
}

export const dbManager: dbUser = {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  anulateUser,
  getUserByEmail
}
