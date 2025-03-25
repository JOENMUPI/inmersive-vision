import nodemailer from 'nodemailer'
import mailerConfig from '@/server/configs/mailer.config'
import envConfig from '@/server/configs/env.config'

// Variables
const mailer = nodemailer.createTransport(mailerConfig)

// logic
/**
 * @description Esta funcion se usa para enviar el formulario al correo en el cual sera procesado por la empresa
 * @param {String} email Correo electronico del cliente
 * @param {String} name Nombre del cliente
 * @param {String} message Description dada por el cliente
 * @param {Array<JSON>} files Archivos enviados por el cliente
 * @param {JSON} carshop Lista de servicios requerida por el cliente
 * @returns Retorna un booleano para indicar si el mensaje fue enviado exitosamente a su destino
 */



export const sendFormUtil = async (email, name, message, files, carshop) => {
  try {
    let mail = {
      from: envConfig.MAILER_USER,
      to: envConfig.MAILER_USER,
      subject: 'Formulario de peticion GOFT',
      html: `<b>Name: </b>${name || ''}<br><b>Email: </b>${email}<br><b>Request:</b><p>${message}</p>`.toString()
    }

    if (files) {
      const attachments = files.map((file) => {
        return {
          filename: file.name,
          content: file.data,
          encoding: 'base64'
        }
      })

      mail = { ...mail, attachments }
    }

    if (carshop) {
      const htmlAux = `${mail.html}<br><br><h1>Carchop</h1><br><b>Total mount: $</b>${carshop.mount}
        ${carshop.items.map((item) => {
          return (
            `<br><br><b>${item.service}</b>
            ${(item.inputs > 1) ? `<br><b>Buildings: </b>${item.buildings}` : ''}
            <br><b>${item.measure.type}: </b>${item.meters}
            <br><b>Mount: </b>${item.mount.toFixed(2)}
            `
          )
        })
      }`.toString()

      mail = { ...mail, html: htmlAux }
    }

    await mailer.sendMail(mail)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}