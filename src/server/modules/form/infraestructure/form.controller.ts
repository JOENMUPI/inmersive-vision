import { NextApiRequest, NextApiResponse } from "next";
import { responseHttpI, responseHttp } from "@/server/utilities/httpRes";
import { FormUseCase } from "../aplication/form.usecase";

export const sendForm = (req: NextApiRequest, res: NextApiResponse<responseHttpI>) => {
  const response = FormUseCase({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
  });

  res.status(response.statusHttp).json(responseHttp({ message: response.response }))
}

export const errorMethod = (req: NextApiRequest, res: NextApiResponse<responseHttpI>) => {
  res.status(400).json(responseHttp({ message: 'Method not available' }))
}