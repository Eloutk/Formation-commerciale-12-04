import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://giypbnrlmscsnkivfogu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeXBibnJsbXNjc25raXZmb2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDA4ODAsImV4cCI6MjA2NDAxNjg4MH0.004Y5Zl2PvOqUI43Rq_d6seSWCtOGJkQXwnts1URF4w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null
        return window.localStorage.getItem(key)
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem(key, value)
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return
        window.localStorage.removeItem(key)
      },
    },
  },
}) 