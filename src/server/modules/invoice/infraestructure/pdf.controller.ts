import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponseI, adapterResponse } from "@/server/utilities/adapters";
import { PdfUseCase } from "@/server/modules/invoice/aplication/pdf.usecase";

export const createPdf = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await PdfUseCase({
    id: '0',
    dateCreation: new Date(),
    dateExpiration: new Date(),
    descriptions: [],
    idProject: '',
    isInvoice: true,
  });

  res.status(response.statusHttp).json(adapterResponse<object>({
    message: response.message,
    payload: response.payload,
    hasError: response.hasError
  }))
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}