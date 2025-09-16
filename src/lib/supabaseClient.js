import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Garde-fou en dev (ne log pas la clé entière)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Variables Supabase manquantes', {
    hasUrl: Boolean(supabaseUrl),
    anonKeyLen: supabaseAnonKey ? supabaseAnonKey.length : 0,
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
