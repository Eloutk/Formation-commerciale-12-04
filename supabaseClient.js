import { createClient } from '@supabase/supabase-js'

// ⛔ À personnaliser :
const supabaseUrl = 'https://gdefqkzwkxzuwgztcuot.supabase.co' // remplace par ton URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZWZxa3p3a3h6dXdnenRjdW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjU1MDYsImV4cCI6MjA1ODk0MTUwNn0.QLVVzn9r-CF_d4syXPPJSBi6nm9RsBt4WCqB1nKbSY0'          // remplace par ta clé publique (API keys > anon)

export const supabase = createClient(supabaseUrl, supabaseKey)

