import nodemailer from 'nodemailer'
import { mailerConfig } from "@/server/configs/mailer.config"
import { formDataI, formToursDataI, mailI } from "@/server/modules/form/domain/interfaces"
import { adapterRes, adapterResI } from "@/server/utilities/adapterRes"
import { envConfig } from '@/server/configs/env.config'
import { tryUtil } from '@/server/utilities/tryUtil'
import { createMailFormHtml, createMailToursHtml } from '../domain/mials'

const mailer = nodemailer.createTransport(mailerConfig)

/**
 * @description Esta funcion se usa para enviar el formulario al correo en el cual sera procesado por la empresa
 * @param {formDataI} form form info
 * @returns {Promise<adapterResI<string>>} Retorna un obj para indicar si el mensaje deseado como promesa
 */
export const FormUseCase = (form: formDataI): adapterResI<string> => {
  const { email, name } = form

  if (!name) return adapterRes({ response: 'Name is required', statusHttp: 400 })
  if (!email) return adapterRes({ response: 'Email is required', statusHttp: 400 })

  const mail: mailI = {
    from: envConfig.MAILER_USER,
    to: envConfig.MAILER_USER,
    subject: 'Formulario de IMMERSIVE VISION',
    html: createMailFormHtml(form)
  }

  return tryUtil<adapterResI<string>>({
    callback: async () => {
      await mailer.sendMail(mail)
    },
    retSuccess: adapterRes({ statusHttp: 200, response: 'Message sent successfully' }),
    retError: (err) => adapterRes({ statusHttp: 500, response: 'Unexpected error, please try again later: ' + err })
  })
}

export const FormToursUseCase = (form: formToursDataI): adapterResI<string> => {
  const { email, description, category, company, model } = form
  
  if (!description) return adapterRes({ response: 'description is required', statusHttp: 400 })
  if (!email) return adapterRes({ response: 'Email is required', statusHttp: 400 })
  if (!category) return adapterRes({ response: 'Category is required', statusHttp: 400 })
  if (!company) return adapterRes({ response: 'Company is required', statusHttp: 400 })
  if (!model) return adapterRes({ response: 'Model is required', statusHttp: 400 })

  const mailHtml: string = createMailToursHtml(form)

  const companyMail: mailI = {
    from: `"${form.name}" <${envConfig.MAILER_USER}>`,
    to: form.company,
    subject: 'Formulario de peticion de tour',
    html: mailHtml
  }

  const meMail: mailI = {
    from: `"${form.name}" <${envConfig.MAILER_USER}>`,
    to: envConfig.MAILER_USER,
    subject: 'Formulario de peticion de tour',
    html: mailHtml
  }

  return tryUtil<adapterResI<string>>({
    callback: async () => {
      await Promise.all([
        mailer.sendMail(companyMail),
        mailer.sendMail(meMail),
      ])
    },
    retSuccess: adapterRes({ statusHttp: 200, response: 'Message sent successfully' }),
    retError: (err) => adapterRes({ statusHttp: 500, response: 'Unexpected error, please try again later: ' + err })
  })
}
