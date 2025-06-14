import { adapterResponseHttp } from "@/server/utilities/adapters"
import { adapterResponseHttpI, completeInvoiceI } from "@/server/utilities/interfaces"
import { generatePdf } from "@/server/modules/invoice/aplication/utils/generatePdf"
import { pdfDataI, clientI, mountInvoiceI, paymentInfoI } from "@/server/modules/invoice/domain/interfaces"

export const PdfUseCase = async (completeInvoice: completeInvoiceI, isInvoice: boolean): Promise<adapterResponseHttpI<object>> => {
  const pdfData: pdfDataI = {
    dateCreation: completeInvoice.invoice.creation_date,
    dateExpiration: completeInvoice.invoice.expiration_date,
    descriptions: completeInvoice.projectDescriptions.map(data => ({ amount: data.unitary_price, description: data.description })),
    id: completeInvoice.invoice.public_id,
    idProject: completeInvoice.project.public_id,
    isInvoice,
  }

  const client: clientI = {
    address: completeInvoice.client.address,
    email: completeInvoice.client.email,
    name: completeInvoice.client.name,
    phone: completeInvoice.client.phone,
    id: completeInvoice.client.id ? String(completeInvoice.client.id) : '',
  }

  const paymentInfo: paymentInfoI = {
    accountNumber: Number(completeInvoice.methodPayment.account_num),
    bankName: completeInvoice.methodPayment.bank_name,
    companyName: completeInvoice.methodPayment.company_name,
    id: String(completeInvoice.methodPayment.id),
    routingNumber: Number(completeInvoice.methodPayment.routing_num),
    urlQr: completeInvoice.methodPayment.url_qr,
    zelle: completeInvoice.methodPayment.zelle,
  }

  const mountInvoice: mountInvoiceI = {
    currentInstallment: completeInvoice.installment.installment_num,
    paidMount: completeInvoice.projectDescriptions.map((el) => el.unitary_price * el.element_num).reduce((acc, val) => acc + val),
    pendingMount: 10,
    totalInstallment: completeInvoice.project.total_installment    
  }

  try {
    const res = await generatePdf({
      client,
      pdfData,
      paymentInfo,
      mountInvoice,
    })

    return adapterResponseHttp({ statusHttp: 200, message: 'PDF sent successfully', payload: { pdf: res }})
  } catch (err) {
    console.error(err)
    return err instanceof Error
      ? adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: ' + err.message })
      : adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: Unexpected error' })
  }
}
