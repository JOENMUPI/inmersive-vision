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

export interface generatePdfI {
  pdfData: pdfDataI,
  client: clientI
  paymentInfo: paymentInfoI,
  mountInvoice: mountInvoiceI
}

export interface pdfDataI {
  isInvoice: boolean;
  dateExpiration: Date
  dateCreation: Date;
  idProject: string;
  descriptions: descriptionPdfI[];
  id: string
}

export interface clientI {
  name: string
  address: string
  email: string
  phone: string
  id: string
}

export interface paymentInfoI {
  id: string
  bankName: string
  companyName: string
  urlQr?: string;
  accountNumber: number
  routingNumber: number
  zelle: string
}

export interface mountInvoiceI {
  currentInstallment: number;
  totalInstallment: number;
  paidMount: number;
  pendingMount: number;
}

export interface descriptionPdfI {
  amount: number
  description: string
}