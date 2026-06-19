-- Espace personnel — stratégies Calculateur de vente (Social media) sauvegardées par utilisateur
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.vente2_strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vente2_strategies_user_id_idx ON public.vente2_strategies (user_id);
CREATE INDEX IF NOT EXISTS vente2_strategies_user_updated_idx ON public.vente2_strategies (user_id, updated_at DESC);

ALTER TABLE public.vente2_strategies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Users select own vente2 strategies"
  ON public.vente2_strategies FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Users insert own vente2 strategies"
  ON public.vente2_strategies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Users update own vente2 strategies"
  ON public.vente2_strategies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Users delete own vente2 strategies"
  ON public.vente2_strategies FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_vente2_strategies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vente2_strategies_updated_at ON public.vente2_strategies;
CREATE TRIGGER vente2_strategies_updated_at
  BEFORE UPDATE ON public.vente2_strategies
  FOR EACH ROW
  EXECUTE FUNCTION public.set_vente2_strategies_updated_at();
