-- Espace personnel — devis SMS / RCS sauvegardés par utilisateur
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.sms_devis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sms_type TEXT NOT NULL CHECK (sms_type IN ('sms', 'rcs')),
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sms_devis_user_id_idx ON public.sms_devis (user_id);
CREATE INDEX IF NOT EXISTS sms_devis_user_updated_idx ON public.sms_devis (user_id, updated_at DESC);

ALTER TABLE public.sms_devis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own sms devis" ON public.sms_devis;
CREATE POLICY "Users select own sms devis"
  ON public.sms_devis FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own sms devis" ON public.sms_devis;
CREATE POLICY "Users insert own sms devis"
  ON public.sms_devis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own sms devis" ON public.sms_devis;
CREATE POLICY "Users update own sms devis"
  ON public.sms_devis FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own sms devis" ON public.sms_devis;
CREATE POLICY "Users delete own sms devis"
  ON public.sms_devis FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_sms_devis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sms_devis_updated_at ON public.sms_devis;
CREATE TRIGGER sms_devis_updated_at
  BEFORE UPDATE ON public.sms_devis
  FOR EACH ROW
  EXECUTE FUNCTION public.set_sms_devis_updated_at();
