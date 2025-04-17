import nodemailer from 'nodemailer'
import { mailerConfig } from "@/server/configs/mailer.config"
import { formDataI, formToursDataI, mailI } from "@/server/modules/form/domain/interfaces"
import { adapterResponseHttp } from "@/server/utilities/adapters"
import { envConfig } from '@/server/configs/env.config'
import { createMailFormHtml, createMailToursHtml } from '@/server/modules/form/domain/mials'
import { companyFormList } from '@/server/modules/form/domain/enums'
import { adapterResponseHttpI } from '@/server/utilities/interfaces'

const mailer = nodemailer.createTransport(mailerConfig)

/**
 * @description Esta funcion se usa para enviar el formulario al correo en el cual sera procesado por la empresa
 * @param {formDataI} form form info
 * @returns {Promise<adapterResponseHttpI<string>>} Retorna un obj para indicar si el mensaje deseado como promesa
 */
export const FormUseCase = async (form: formDataI): Promise<adapterResponseHttpI<string>> => {
  const { email, name } = form

  if (!name) return adapterResponseHttp({ message: 'Name is required', statusHttp: 400 })
  if (!email) return adapterResponseHttp({ message: 'Email is required', statusHttp: 400 })

  const mail: mailI = {
    from: envConfig.MAILER_USER,
    to: envConfig.MAILER_USER,
    subject: 'Formulario de IMMERSIVE VISION',
    html: createMailFormHtml(form)
  }

  try {
    await mailer.sendMail(mail)
    return adapterResponseHttp({ statusHttp: 200, message: 'Message sent successfully' })
  } catch (err) {
    console.error(err)
    return err instanceof Error
      ? adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: ' + err.message })
      : adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: Unexpected error' })
  }
}

export const FormToursUseCase = async (form: formToursDataI): Promise<adapterResponseHttpI<string>> => {
  const { email, description, category, company, model } = form
  
  if (!description) return adapterResponseHttp({ message: 'description is required', statusHttp: 400 })
  if (!email) return adapterResponseHttp({ message: 'Email is required', statusHttp: 400 })
  if (!category) return adapterResponseHttp({ message: 'Category is required', statusHttp: 400 })
  if (!company) return adapterResponseHttp({ message: 'Company is required', statusHttp: 400 })
  if (!model) return adapterResponseHttp({ message: 'Model is required', statusHttp: 400 })

  const mailHtml: string = createMailToursHtml(form)

  const companyMail: mailI = {
    from: `"${form.name}" <${envConfig.MAILER_USER}>`,
    to: companyFormList[form.company],
    subject: 'Formulario de peticion de tour',
    html: mailHtml
  }

  const meMail: mailI = {
    from: `"${form.name}" <${envConfig.MAILER_USER}>`,
    to: envConfig.MAILER_USER,
    subject: 'Formulario de peticion de tour',
    html: mailHtml
  }

  try {
    await Promise.all([
      mailer.sendMail(companyMail),
      mailer.sendMail(meMail),
    ])
    return adapterResponseHttp({ statusHttp: 200, message: 'Message sent successfully' })
  } catch (err) {
    console.error(err)
    return err instanceof Error
      ? adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: ' + err.message })
      : adapterResponseHttp({ statusHttp: 500, message: 'Unexpected error, please try again later: Unexpected error' })
  }
}
