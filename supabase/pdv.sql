-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.pdv_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  client_name TEXT,
  message TEXT,
  pdf_filename TEXT NOT NULL,
  pdf_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.pdv_validations ENABLE ROW LEVEL SECURITY;

-- Autoriser l'insertion (utilisateur connecté)
CREATE POLICY "Users can insert pdv validations"
  ON public.pdv_validations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Autoriser la lecture de ses propres validations (optionnel)
CREATE POLICY "Users can view own pdv validations"
  ON public.pdv_validations
  FOR SELECT
  USING (auth.uid() = user_id);

