import { dbMethodPayment } from '@/server/modules/methodPayment/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, methodPaymentModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { methodPaymentTableKeys, tableNames } from '@/server/utilities/enums';

const getMethodPayment = async (methodPaymentIds?: string[]): Promise<adapterResponseI<Array<methodPaymentModel>>> => {
  const query = supabaseClient.from(tableNames.METHOD_PAYMENT)
    .select()

  if (methodPaymentIds && methodPaymentIds.length > 0) {
    query.in(methodPaymentTableKeys.ID, methodPaymentIds)
  }

  const { data, error } = await query
    .eq(methodPaymentTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<methodPaymentModel>>()
  
  if (error) {
    console.error('Error to get method payment:', error);
    return adapterResponse({ message: `Error to get method payment: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get method payments succesfully`, hasError: false, payload: data });;
  }
}

const updateMethodPayment = async (client: updateBaseI<methodPaymentModel>): Promise<adapterResponseI<Array<methodPaymentModel>>> => {
  const query = supabaseClient.from(tableNames.METHOD_PAYMENT)
    .update(client.newData)
    .eq(methodPaymentTableKeys.ID, client.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<methodPaymentModel>>();

  if (error) {
    console.error('Error updating method payment:', error)
    return adapterResponse({ message: `Error updating method payments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Method payments updated successfully', hasError: false, payload: data })
  }
}

const createMethodPayment = async (methodPayment: methodPaymentModel[]): Promise<adapterResponseI<Array<methodPaymentModel>>> => {
  const query = supabaseClient.from(tableNames.METHOD_PAYMENT)
  .insert(methodPayment)
  .select()

  const { data, error } = await query.overrideTypes<Array<methodPaymentModel>>();
  
  if (error) {
    console.error('Error inserting method payments:', error)
    return adapterResponse({ message: `Error inserting method payments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Method payments created successfully', hasError: false, payload: data }) 
  }
}

const deleteMethodPayment = async (clientId: string[]): Promise<adapterResponseI<Array<methodPaymentModel>>> => {
  const query = supabaseClient.from(tableNames.METHOD_PAYMENT)
  .delete()
  .in(methodPaymentTableKeys.ID, clientId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<methodPaymentModel>>();

  if (error) {
    console.error('Error deleting method payments:', error)
    return adapterResponse({ message: `Error deleting method payments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Method payments deleted successfully', hasError: false, payload: data })
  }
}

const anulateMethodPayment = async (props: anulateProps): Promise<adapterResponseI<Array<methodPaymentModel>>> => {
  const query = supabaseClient.from(tableNames.METHOD_PAYMENT)
  .update({ 
    [methodPaymentTableKeys.SOFT_DELETED]: props.soft_deleted,
    [methodPaymentTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(methodPaymentTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<methodPaymentModel>>();

  if (error) {
    console.error('Error anulating method payments:', error)
    return adapterResponse({ message: `Error anulating method payments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Method payments anulled successfully', hasError: false, payload: data })
  }
}

export const dbManager: dbMethodPayment = {
  anulateMethodPayment,
  createMethodPayment,
  deleteMethodPayment,
  getMethodPayment,
  updateMethodPayment
}
