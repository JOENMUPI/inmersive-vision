/**
 *
 * @description Retorna un obj con la informacion de las variables de entorno o sustitutos si no las encuentra
 */

export const envConfig = {
  MAILER_USER: process.env.MAILER_USER || 'MAILER_USER',
  MAILER_PASS: process.env.MAILER_PASS || 'MAILER_PASS',
  SUPABASE_URL: process.env.SUPABASE_URL || 'SUPABASE_URL',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'SUPABASE_ANON_KEY',
  ENCRYPT_KEY: process.env.ENCRYPT_KEY || 'ENCRYPT_KEY',
}
