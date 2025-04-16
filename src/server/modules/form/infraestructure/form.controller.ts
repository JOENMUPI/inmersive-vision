import { NextApiRequest, NextApiResponse } from "next";
import { adapterResponseI, adapterResponse } from "@/server/utilities/adapters";
import { FormUseCase, FormToursUseCase } from "@/server/modules/form/aplication/form.usecase";

export const sendForm = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  const response = await FormUseCase({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
  });

  res.status(response.statusHttp).json(adapterResponse({ message: response.message }))
}

export const sendFormTours = async (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
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
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<adapterResponseI>) => {
  res.status(400).json(adapterResponse({ message: 'Method not available', hasError: true,  }))
}