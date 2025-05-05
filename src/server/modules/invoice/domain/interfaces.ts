import {
  adapterResponseI,
  anulateProps,
  clientModel,
  installmentModel,
  invoiceId,
  invoiceModel,
  methodPaymentModel,
  projectDescriptionModel,
  projectModel,
  updateBaseI,
} from "@/server/utilities/interfaces";

export interface completeInvoiceI {
  invoices: invoiceModel
  installments: installmentModel
  projectDescription: projectDescriptionModel[]
  project?: projectModel
  client: clientModel
  methodPayment: methodPaymentModel
}

export interface dbInvoice {
  getInvoice: (ids?: invoiceId[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  createInvoice: (invoices: invoiceModel[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  updateInvoice: (invoice: updateBaseI<invoiceModel, invoiceId>) => Promise<adapterResponseI<Array<invoiceModel>>>
  deleteInvoice: (ids: invoiceId[]) => Promise<adapterResponseI<Array<invoiceModel>>>
  anulateInvoice: (ids: anulateProps<invoiceId>) => Promise<adapterResponseI<Array<invoiceModel>>>
  getLastInvoice: () => Promise<adapterResponseI<Array<invoiceModel>>>
}
