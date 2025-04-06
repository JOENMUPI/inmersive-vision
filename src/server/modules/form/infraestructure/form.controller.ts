import { NextApiRequest, NextApiResponse } from "next";
import { responseHttpI, responseHttp } from "@/server/utilities/httpRes";
import { FormUseCase, FormToursUseCase } from "../aplication/form.usecase";

export const sendForm = async (req: NextApiRequest, res: NextApiResponse<responseHttpI>) => {
  const response = await FormUseCase({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
  });

  res.status(response.statusHttp).json(responseHttp({ message: response.response }))
}

export const sendFormTours = async (req: NextApiRequest, res: NextApiResponse<responseHttpI>) => {
  const response = await FormToursUseCase({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    category: req.body.category,
    company: req.body.company,
    description: req.body.description,
    model: req.body.model,
  });

  res.status(response.statusHttp).json(responseHttp({ message: response.response }))
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<responseHttpI>) => {
  res.status(400).json(responseHttp({ message: 'Method not available' }))
}