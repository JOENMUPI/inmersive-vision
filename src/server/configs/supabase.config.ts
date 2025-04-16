import { envConfig }  from '@/server/configs/env.config'

/**
 *
 * @description Retorna un obj con la informacion de las variables de entorno o sustitutos si no las encuentra
 */
export const supabaseCongif = {
  url: envConfig.SUPABASE_URL,
  anonKey: envConfig.SUPABASE_ANON_KEY,
}
