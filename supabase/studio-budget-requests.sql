-- Demandes d'approche budgétaire studio (Graphisme / Créa-Fixe)
-- À exécuter dans Supabase > SQL Editor (nouvelle installation)
-- Make : déclencher sur INSERT → message Slack canal « demande-studio »

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
  client_name TEXT NOT NULL,
  project_theme TEXT NOT NULL,
  project_date TEXT NOT NULL,
  project_name TEXT NOT NULL,
  slack_channel TEXT NOT NULL DEFAULT 'demande-studio',
  need_description TEXT NOT NULL,
  message TEXT NOT NULL,
  devis_pdf_filename TEXT,
  devis_pdf_path TEXT,
  devis_pdf_url TEXT,
  devis_pdf_size_bytes BIGINT,
  attachment_filename TEXT,
  attachment_path TEXT,
  attachment_url TEXT,
  attachment_mime_type TEXT,
  attachment_size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS studio_budget_requests_created_idx
  ON public.studio_budget_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS studio_budget_requests_user_idx
  ON public.studio_budget_requests (user_id, created_at DESC);

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

-- Bucket Storage pour les pièces jointes des demandes studio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-budget-requests',
  'studio-budget-requests',
  false,
  20971520,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users upload own studio budget attachments" ON storage.objects;
CREATE POLICY "Users upload own studio budget attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'studio-budget-requests'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users read own studio budget attachments" ON storage.objects;
CREATE POLICY "Users read own studio budget attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'studio-budget-requests'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users delete own studio budget attachments" ON storage.objects;
CREATE POLICY "Users delete own studio budget attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'studio-budget-requests'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
