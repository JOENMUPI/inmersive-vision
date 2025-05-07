import {
  adapterResponseI,
  anulateProps,
  invoiceId,
  invoiceModel,
  updateBaseI,
} from "@/server/utilities/interfaces";

export interface dbInvoice {
  getInvoice: (ids?: invoiceId[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  createInvoice: (invoices: invoiceModel[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  updateInvoice: (invoice: updateBaseI<invoiceModel, invoiceId>) => Promise<adapterResponseI<Array<invoiceModel>>>
  deleteInvoice: (ids: invoiceId[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  anulateInvoice: (ids: anulateProps<invoiceId>) => Promise<adapterResponseI<Array<invoiceModel>>>
  getLastInvoice: () => Promise<adapterResponseI<Array<invoiceModel>>>
}

export interface invoiceInternalManagerI {
  getInvoiceInternal: (ids?: invoiceId[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  createInvoiceInternal: (invoices: invoiceModel[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  deleteInvoiceInternal: (ids: invoiceId[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  updateInvoiceInternal: (invoice: updateBaseI<invoiceModel, invoiceId>) => Promise<adapterResponseI<Array<invoiceModel>>>
}