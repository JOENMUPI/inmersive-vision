import { companyFormKeys } from "./enums";

export interface formDataI {
  name: string;
  email: string;
  phone: string;
}

export interface mailI {
  from: string
  to: string
  subject: string
  html: string
}

export interface formToursDataI {
  name: string;
  description: string;
  company: companyFormKeys;
  model: string;
  category: string
  email: string;
  phone: string;
}
