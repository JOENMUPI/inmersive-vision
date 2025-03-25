import { envConfig } from '@/server/configs/env.config'

/**
 * @description Retorna un obj con la configuracion necesaria para enviar mensajes por medio de mailer
 */

export const mailerConfig = {
  service: 'Gmail',
  // host: 'smtp.gmail.com',
  // port: 465,
  // secure: true, // true for 465, false for other ports
  auth: {
    user: envConfig.MAILER_USER,
    pass: envConfig.MAILER_PASS
  }
}
