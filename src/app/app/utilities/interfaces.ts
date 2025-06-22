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
  accountNumber: string
  routingNumber: string
  zelle: string
}

export interface mountInvoiceI {
  currentInstallment: number;
  totalInstallment: number;
  paidMount: number;
  mount: number
  pendingMount: number;
}

export interface descriptionPdfI {
  amount: number
  description: string
}