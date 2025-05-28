import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function createQuizTables() {
  try {
    // Création de la table quiz_progress
    const { error: progressError } = await supabaseAdmin.rpc('create_quiz_progress_table')
    if (progressError) throw progressError

    // Création de la table quiz_answers
    const { error: answersError } = await supabaseAdmin.rpc('create_quiz_answers_table')
    if (answersError) throw answersError

    return { success: true }
  } catch (error) {
    console.error('Error creating tables:', error)
    return { success: false, error }
  }
} 