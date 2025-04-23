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
  urlQr: string;
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