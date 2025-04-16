import { supabaseCongif } from '@/server/configs/supabase.config';
import { createClient as createClientSupabase  } from '@supabase/supabase-js'

export const supabaseClient = createClientSupabase(supabaseCongif.url, supabaseCongif.anonKey)
