import { dbInvoice } from '@/server/modules/invoice/domain/interfaces';
import { adapterResponse, auxiliaryId } from '@/server/utilities/adapters';
import { supabaseClient } from '@/server/utilities/supabaseClient'
import { anulateProps, invoiceModel, updateBaseI, adapterResponseI, invoiceId } from '@/server/utilities/interfaces';
import { invoiceTableKeys, tableNames } from '@/server/utilities/enums';

const getInvoice = async (invoiceIds?: invoiceId[]): Promise<adapterResponseI<Array<invoiceModel>>> => {
  const query = supabaseClient.from(tableNames.INVOICE)
    .select()

  if (invoiceIds && invoiceIds.length > 0) {
    const projectsIds: number[] = []
    const installmentsIds: number[] = []

    invoiceIds.forEach(invoiceId => {
      projectsIds.push(invoiceId.project_id)
      installmentsIds.push(invoiceId.installment_id)
    })
    
    query.in(invoiceTableKeys.PROJECT_ID, projectsIds)
    query.in(invoiceTableKeys.INSTALLMENT_ID, installmentsIds)
  }

  const { data, error } = await query
    .eq(invoiceTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<invoiceModel>>()

  if (error) {
    console.error('Error to get invoices:', error);
    return adapterResponse({ message: `Error to get invoices: ${error.message}`, hasError: true, });
  } 

  let dataFiltered = data
  if (invoiceIds && invoiceIds.length > 0) {
    const allowedIds = new Set(invoiceIds.map(id => auxiliaryId(id.project_id.toString(), id.installment_id.toString())))
    dataFiltered = data.filter(el => allowedIds.has(auxiliaryId(el.project_id.toString(), el.installment_id.toString())))
  }
  return adapterResponse({ message: `Get invoices succesfully`, hasError: false, payload: dataFiltered });;
}

const updateInvoice = async (invoice: updateBaseI<invoiceModel, invoiceId>): Promise<adapterResponseI<Array<invoiceModel>>> => {
  const query = supabaseClient.from(tableNames.INVOICE)
    .update(invoice.newData)
    .eq(invoiceTableKeys.PROJECT_ID, invoice.currentId.project_id)
    .eq(invoiceTableKeys.INSTALLMENT_ID, invoice.currentId.installment_id)
    .select()

  const { data, error } = await query
    .overrideTypes<Array<invoiceModel>>();

  if (error) {
    console.error('Error updating invoices:', error)
    return adapterResponse({ message: `Error updating invoices: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Invoices updated successfully', hasError: false, payload: data })
  }
}

const createInvoice = async (invoices: invoiceModel[]): Promise<adapterResponseI<Array<invoiceModel>>> => {
  const query = supabaseClient.from(tableNames.INVOICE)
  .insert(invoices)
  .select()

  const { data, error } = await query.overrideTypes<Array<invoiceModel>>();
  
  if (error) {
    console.error('Error inserting invoices:', error)
    return adapterResponse({ message: `Error inserting invoices: ${error.message}`, hasError: true })
  } else {
    return adapterResponse({ message: 'Invoices created successfully', hasError: false, payload: data }) 
  }
}

const deleteInvoice = async (invoiceId: invoiceId[]): Promise<adapterResponseI<Array<invoiceModel>>> => {
  const response: invoiceModel[] = []

  for(const id of invoiceId) {
    const query = supabaseClient.from(tableNames.INVOICE)
    .delete()
    .eq(invoiceTableKeys.INSTALLMENT_ID, id.installment_id)
    .eq(invoiceTableKeys.PROJECT_ID, id.project_id)
    .select()
    
    const { data, error } = await query.overrideTypes<Array<invoiceModel>>();
  
    if (error) {
      const fallback = await createInvoice(response)
      if (fallback.hasError) return adapterResponse({ message: `Error on fallback deleting invoices: ${fallback.message}`, hasError: true })

      console.error('Error deleting invoices:', error)
      return adapterResponse({ message: `Error deleting invoices: ${error.message}`, hasError: true })
    } 

    response.push(...data)
  }
  
  return adapterResponse({ message: 'Invoices deleted successfully', hasError: false, payload: response })
}

const anulateInvoice = async (props: anulateProps<invoiceId>): Promise<adapterResponseI<Array<invoiceModel>>> => {
  const response: invoiceModel[] = []
  
  for(const id of props.ids) {
    const query = supabaseClient.from(tableNames.INVOICE)
    .update({ 
      [invoiceTableKeys.SOFT_DELETED]: props.soft_deleted,
      [invoiceTableKeys.UPDATED_AT]: props.update_at,
    })
    .eq(invoiceTableKeys.PROJECT_ID, id.project_id)
    .eq(invoiceTableKeys.INSTALLMENT_ID, id.installment_id)
    .select()

    const { data, error } = await query.overrideTypes<Array<invoiceModel>>();
    
    if (error) {
      console.error('Error anulating invoices:', error)
      return adapterResponse({ message: `Error anulating invoices: ${error.message}`, hasError: true })
    } 
    response.push(...data)
  }

  return adapterResponse({ message: 'Invoices anulled successfully', hasError: false, payload: response })  
}

const getLastInvoice = async (): Promise<adapterResponseI<Array<invoiceModel>>> => {
  const query = supabaseClient.from(tableNames.INVOICE)
    .select()
    .order('created_at', { ascending: false })
    .limit(1);
    
  const { data, error } = await query
    .eq(invoiceTableKeys.SOFT_DELETED, false)
    .overrideTypes<Array<invoiceModel>>()
  
  if (error) {
    console.error('Error to get invoices:', error);
    return adapterResponse({ message: `Error to get last invoice: ${error.message}`, hasError: true });
  } else {
    return adapterResponse({ message: `Get last invoice succesfully`, hasError: false, payload: data });;
  }
}

export const dbManager: dbInvoice = {
  createInvoice,
  deleteInvoice,
  getInvoice,
  updateInvoice,
  anulateInvoice,
  getLastInvoice
}
