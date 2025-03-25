import nodemailer from 'nodemailer'
import { mailerConfig } from "@/server/configs/mailer.config"
import { formDataI } from "@/server/modules/form/domain/interfaces"
import { adapterRes, adapterResI } from "@/server/utilities/adapterRes"
import { envConfig } from '@/server/configs/env.config'
import { tryUtil } from '@/server/utilities/tryUtil'

const mailer = nodemailer.createTransport(mailerConfig)

/**
 * @description Esta funcion se usa para enviar el formulario al correo en el cual sera procesado por la empresa
 * @param {formDataI} form form info
 * @returns {Promise<adapterResI<string>>} Retorna un obj para indicar si el mensaje deseado como promesa
 */
export const FormUseCase = (form: formDataI): adapterResI<string> => {
  const { email, name, phone } = form

  if (!name) return adapterRes({ response: 'Name is required', statusHttp: 400 })
  if (!email) return adapterRes({ response: 'Email is required', statusHttp: 400 })

  let mail = {
    from: envConfig.MAILER_USER,
    to: envConfig.MAILER_USER,
    subject: 'Formulario de IMMERSIVE VISION',
    html: `<b>Name: </b>${name}<br><b>Email: </b>${email}<br>`.toString()
  }

  if (phone) {
    const htmlAux = `${mail.html}<b>Phone: </b>${phone}`.toString()
    mail = { ...mail, html: htmlAux }
  }

  return tryUtil<adapterResI<string>>({
    callback: async () => {
      await mailer.sendMail(mail)
    },
    retSuccess: adapterRes({ statusHttp: 200, response: 'Message sent successfully' }),
    retError: (err) => adapterRes({ statusHttp: 500, response: 'Unexpected error, please try again later: ' + err })
  })
}
