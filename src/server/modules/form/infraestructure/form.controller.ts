import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponse } from "@/server/utilities/adapters";
import { FormUseCase, FormToursUseCase } from "@/server/modules/form/aplication/form.usecase";
import { adapterResponseI } from "@/server/utilities/interfaces";

export const sendForm = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await FormUseCase({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    });
  
    res.status(response.statusHttp).json(adapterResponse({ message: response.message }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const sendFormTours = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  try {
    const response = await FormToursUseCase({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      category: req.body.category,
      company: req.body.company,
      description: req.body.description,
      model: req.body.model,
    });
  
    res.status(response.statusHttp).json(adapterResponse({ message: response.message, hasError: response.statusHttp !== 200 }))
  } catch (err) {
    console.error(err)
    res.status(500).json(adapterResponse({
      message: 'Unexpected error, please try again later: ' + (err instanceof Error ? err.message : 'Unexpected error'),
      hasError: true,
    }))
  }
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true,  }))
}