-- Espace personnel — simulations Stratégie Social Media (Simulateur Média Link)
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.simulateur_media_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  summary_impressions NUMERIC(14, 0) NOT NULL DEFAULT 0,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS simulateur_media_saves_user_id_idx ON public.simulateur_media_saves (user_id);
CREATE INDEX IF NOT EXISTS simulateur_media_saves_user_updated_idx ON public.simulateur_media_saves (user_id, updated_at DESC);

ALTER TABLE public.simulateur_media_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own simulateur media saves" ON public.simulateur_media_saves;
CREATE POLICY "Users select own simulateur media saves"
  ON public.simulateur_media_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own simulateur media saves" ON public.simulateur_media_saves;
CREATE POLICY "Users insert own simulateur media saves"
  ON public.simulateur_media_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own simulateur media saves" ON public.simulateur_media_saves;
CREATE POLICY "Users update own simulateur media saves"
  ON public.simulateur_media_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own simulateur media saves" ON public.simulateur_media_saves;
CREATE POLICY "Users delete own simulateur media saves"
  ON public.simulateur_media_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_simulateur_media_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS simulateur_media_saves_updated_at ON public.simulateur_media_saves;
CREATE TRIGGER simulateur_media_saves_updated_at
  BEFORE UPDATE ON public.simulateur_media_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_simulateur_media_saves_updated_at();
