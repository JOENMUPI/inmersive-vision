import { dbClient } from '@/server/modules/client/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, clientModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { clientTableKeys, tableNames } from '@/server/utilities/enums';

const getClient = async (clientIds?: string[]): Promise<adapterResponseI<Array<clientModel>>> => {
  const query = supabaseClient.from(tableNames.invoice)
    .select()

  if (clientIds && clientIds.length > 0) {
    query.in(clientTableKeys.ID, clientIds)
  }

  const { data, error } = await query
    .eq(clientTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<clientModel>>()
  
  if (error) {
    console.error('Error to get clients:', error);
    return adapterResponse({ message: `Error to get clients: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get clients succesfully`, hasError: false, payload: data });;
  }
}

const updateClient = async (client: updateBaseI<clientModel>): Promise<adapterResponseI<Array<clientModel>>> => {
  const query = supabaseClient.from(tableNames.invoice)
    .update(client.newData)
    .eq(clientTableKeys.ID, client.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<clientModel>>();

  if (error) {
    console.error('Error updating clients:', error)
    return adapterResponse({ message: `Error updating clients: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Clients updated successfully', hasError: false, payload: data })
  }
}

const createClient = async (clients: clientModel[]): Promise<adapterResponseI<Array<clientModel>>> => {
  const query = supabaseClient.from(tableNames.invoice)
  .insert(clients)
  .select()

  const { data, error } = await query.overrideTypes<Array<clientModel>>();
  
  if (error) {
    console.error('Error inserting clients:', error)
    return adapterResponse({ message: `Error inserting clients: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Clients created successfully', hasError: false, payload: data }) 
  }
}

const deleteClient = async (clientId: string[]): Promise<adapterResponseI<Array<clientModel>>> => {
  const query = supabaseClient.from(tableNames.invoice)
  .delete()
  .in(clientTableKeys.ID, clientId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<clientModel>>();

  if (error) {
    console.error('Error deleting clients:', error)
    return adapterResponse({ message: `Error deleting clients: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Clients deleted successfully', hasError: false, payload: data })
  }
}

const anulateClient = async (props: anulateProps): Promise<adapterResponseI<Array<clientModel>>> => {
  const query = supabaseClient.from(tableNames.invoice)
  .update({ 
    [clientTableKeys.SOFT_DELETED]: props.soft_deleted,
    [clientTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(clientTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<clientModel>>();

  if (error) {
    console.error('Error anulating clients:', error)
    return adapterResponse({ message: `Error anulating clients: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Clients anulled successfully', hasError: false, payload: data })
  }
}

export const dbManager: dbClient = {
  createClient,
  deleteClient,
  getClient,
  updateClient,
  anulateClient
}
