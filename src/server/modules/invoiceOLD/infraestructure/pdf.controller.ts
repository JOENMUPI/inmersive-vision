import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { PdfUseCase } from "@/server/modules/invoiceOLD/aplication/pdf.usecase";
import { adapterResponseI } from "@/server/utilities/interfaces";

export const createPdf = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
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
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true }))
}