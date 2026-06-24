-- Espace personnel — devis Tarifs studio (Calculateur Vente 2)
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.studio_tarifs_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  summary_total_ht NUMERIC(14, 2) NOT NULL DEFAULT 0,
  summary_total_ttc NUMERIC(14, 2) NOT NULL DEFAULT 0,
  selected_count INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS studio_tarifs_saves_user_id_idx ON public.studio_tarifs_saves (user_id);
CREATE INDEX IF NOT EXISTS studio_tarifs_saves_user_updated_idx ON public.studio_tarifs_saves (user_id, updated_at DESC);

ALTER TABLE public.studio_tarifs_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own studio tarifs saves" ON public.studio_tarifs_saves;
CREATE POLICY "Users select own studio tarifs saves"
  ON public.studio_tarifs_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own studio tarifs saves" ON public.studio_tarifs_saves;
CREATE POLICY "Users insert own studio tarifs saves"
  ON public.studio_tarifs_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own studio tarifs saves" ON public.studio_tarifs_saves;
CREATE POLICY "Users update own studio tarifs saves"
  ON public.studio_tarifs_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own studio tarifs saves" ON public.studio_tarifs_saves;
CREATE POLICY "Users delete own studio tarifs saves"
  ON public.studio_tarifs_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_studio_tarifs_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS studio_tarifs_saves_updated_at ON public.studio_tarifs_saves;
CREATE TRIGGER studio_tarifs_saves_updated_at
  BEFORE UPDATE ON public.studio_tarifs_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_studio_tarifs_saves_updated_at();
