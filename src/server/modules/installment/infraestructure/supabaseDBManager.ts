import { dbInstallment } from '@/server/modules/installment/domain/interfaces';
import { adapterResponse } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, installmentModel, updateBaseI, adapterResponseI } from '@/server/utilities/interfaces';
import { installmentTableKeys, tableNames } from '@/server/utilities/enums';

const getInstallment = async (installmentIds?: string[]): Promise<adapterResponseI<Array<installmentModel>>> => {
  const query = supabaseClient.from(tableNames.INSTALLMENT)
    .select()

  if (installmentIds && installmentIds.length > 0) {
    query.in(installmentTableKeys.ID, installmentIds)
  }

  const { data, error } = await query
    .eq(installmentTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<installmentModel>>()
  
  if (error) {
    console.error('Error to get installments:', error);
    return adapterResponse({ message: `Error to get installments: ${error.message}`, hasError: true, });
  } else {
    return adapterResponse({ message: `Get installments succesfully`, hasError: false, payload: data });;
  }
}

const updateInstallment = async (installment: updateBaseI<installmentModel>): Promise<adapterResponseI<Array<installmentModel>>> => {
  const query = supabaseClient.from(tableNames.INSTALLMENT)
    .update(installment.newData)
    .eq(installmentTableKeys.ID, installment.currentId)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<installmentModel>>();

  if (error) {
    console.error('Error updating installments:', error)
    return adapterResponse({ message: `Error updating installments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Installments updated successfully', hasError: false, payload: data })
  }
}

const createInstallment = async (installments: installmentModel[]): Promise<adapterResponseI<Array<installmentModel>>> => {
  const query = supabaseClient.from(tableNames.INSTALLMENT)
  .insert(installments)
  .select()

  const { data, error } = await query.overrideTypes<Array<installmentModel>>();
  
  if (error) {
    console.error('Error inserting installments:', error)
    return adapterResponse({ message: `Error inserting installments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Installments created successfully', hasError: false, payload: data }) 
  }
}

const deleteInstallment = async (installmentId: string[]): Promise<adapterResponseI<Array<installmentModel>>> => {
  const query = supabaseClient.from(tableNames.INSTALLMENT)
  .delete()
  .in(installmentTableKeys.ID, installmentId)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<installmentModel>>();

  if (error) {
    console.error('Error deleting installments:', error)
    return adapterResponse({ message: `Error deleting installments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Installments deleted successfully', hasError: false, payload: data })
  }
}

const anulateInstallment = async (props: anulateProps): Promise<adapterResponseI<Array<installmentModel>>> => {
  const query = supabaseClient.from(tableNames.INSTALLMENT)
  .update({ 
    [installmentTableKeys.SOFT_DELETED]: props.soft_deleted,
    [installmentTableKeys.UPDATED_AT]: props.update_at,
  })
  .in(installmentTableKeys.ID, props.ids)
  .select()
  
  const { data, error } = await query.overrideTypes<Array<installmentModel>>();

  if (error) {
    console.error('Error anulating installments:', error)
    return adapterResponse({ message: `Error anulating installments: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Installments anulled successfully', hasError: false, payload: data })
  }
}

export const dbManager: dbInstallment = {
  createInstallment,
  deleteInstallment,
  getInstallment,
  updateInstallment,
  anulateInstallment
}
