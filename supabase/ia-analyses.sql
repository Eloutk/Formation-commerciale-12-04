-- Analyses IA + pré-prompts personnalisés (Mon espace admin)
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.ia_pre_prompts (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id TEXT NOT NULL,
  pre_prompt TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, action_id)
);

CREATE TABLE IF NOT EXISTS public.ia_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id TEXT NOT NULL,
  name TEXT NOT NULL,
  pre_prompt TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  input_kind TEXT NOT NULL DEFAULT 'pdf',
  input_label TEXT,
  input_url TEXT,
  client_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ia_analyses_user_id_idx ON public.ia_analyses (user_id);
CREATE INDEX IF NOT EXISTS ia_analyses_user_created_idx ON public.ia_analyses (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ia_analyses_action_idx ON public.ia_analyses (user_id, action_id);

ALTER TABLE public.ia_pre_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ia_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own ia pre prompts" ON public.ia_pre_prompts;
CREATE POLICY "Users manage own ia pre prompts"
  ON public.ia_pre_prompts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own ia analyses" ON public.ia_analyses;
CREATE POLICY "Users manage own ia analyses"
  ON public.ia_analyses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_ia_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ia_analyses_updated_at ON public.ia_analyses;
CREATE TRIGGER ia_analyses_updated_at
  BEFORE UPDATE ON public.ia_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ia_analyses_updated_at();

DROP TRIGGER IF EXISTS ia_pre_prompts_updated_at ON public.ia_pre_prompts;
CREATE TRIGGER ia_pre_prompts_updated_at
  BEFORE UPDATE ON public.ia_pre_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ia_analyses_updated_at();
