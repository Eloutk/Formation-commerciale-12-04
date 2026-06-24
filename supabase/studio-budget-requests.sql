-- Demandes d'approche budgétaire studio (Graphisme / Créa-Fixe)
-- À exécuter dans Supabase > SQL Editor
-- Make : déclencher sur INSERT dans cette table → message Slack canal « demande-studio »

CREATE TABLE IF NOT EXISTS public.studio_budget_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  section_id TEXT NOT NULL,
  section_label TEXT NOT NULL,
  prestation_id TEXT NOT NULL,
  prestation_label TEXT NOT NULL,
  prestation_variant TEXT,
  slack_channel TEXT NOT NULL DEFAULT 'demande-studio',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS studio_budget_requests_created_idx
  ON public.studio_budget_requests (created_at DESC);

ALTER TABLE public.studio_budget_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users insert own studio budget requests" ON public.studio_budget_requests;
CREATE POLICY "Users insert own studio budget requests"
  ON public.studio_budget_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own studio budget requests" ON public.studio_budget_requests;
CREATE POLICY "Users view own studio budget requests"
  ON public.studio_budget_requests
  FOR SELECT
  USING (auth.uid() = user_id);
