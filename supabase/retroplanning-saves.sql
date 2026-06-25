-- Espace personnel — rétroplanning stratégie sauvegardé par utilisateur
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.retroplanning_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  operations_count INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS retroplanning_saves_user_id_idx ON public.retroplanning_saves (user_id);
CREATE INDEX IF NOT EXISTS retroplanning_saves_user_updated_idx ON public.retroplanning_saves (user_id, updated_at DESC);

ALTER TABLE public.retroplanning_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own retroplanning saves" ON public.retroplanning_saves;
CREATE POLICY "Users select own retroplanning saves"
  ON public.retroplanning_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own retroplanning saves" ON public.retroplanning_saves;
CREATE POLICY "Users insert own retroplanning saves"
  ON public.retroplanning_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own retroplanning saves" ON public.retroplanning_saves;
CREATE POLICY "Users update own retroplanning saves"
  ON public.retroplanning_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own retroplanning saves" ON public.retroplanning_saves;
CREATE POLICY "Users delete own retroplanning saves"
  ON public.retroplanning_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_retroplanning_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS retroplanning_saves_updated_at ON public.retroplanning_saves;
CREATE TRIGGER retroplanning_saves_updated_at
  BEFORE UPDATE ON public.retroplanning_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_retroplanning_saves_updated_at();
