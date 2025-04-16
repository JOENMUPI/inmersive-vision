import { adapterResponseHttp, adapterResponseHttpI } from "@/server/utilities/adapters"
import { pdfDataI } from "@/server/modules/invoice/domain/interfaces"
// import { generatePdf } from "@/server/modules/invoice/aplication/generatePdf"

export const PdfUseCase = async (form: pdfDataI): Promise<adapterResponseHttpI<object>> => {
  const {
    dateCreation
  } = form

  if (!dateCreation) return adapterResponseHttp({ message: 'Date creation is required', statusHttp: 400 })

  try {
    // const res = await generatePdf({
    //   // data aqui
    // })
    return adapterResponseHttp({ statusHttp: 200, message: 'Message sent successfully' })
  } catch (err) {
    console.error(err)
    return err instanceof Error
      ? adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: ' + err.message })
      : adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: Unexpected error' })
  }
}
