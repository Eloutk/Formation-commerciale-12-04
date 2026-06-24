-- Migration — demandes budgétaires studio : description + pièce jointe
-- À exécuter si studio-budget-requests.sql (v1) est déjà en place

ALTER TABLE public.studio_budget_requests
  ADD COLUMN IF NOT EXISTS need_description TEXT,
  ADD COLUMN IF NOT EXISTS attachment_filename TEXT,
  ADD COLUMN IF NOT EXISTS attachment_path TEXT,
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_mime_type TEXT,
  ADD COLUMN IF NOT EXISTS attachment_size_bytes BIGINT;

-- Anciennes lignes sans description utilisateur
UPDATE public.studio_budget_requests
SET need_description = COALESCE(need_description, message, '')
WHERE need_description IS NULL OR btrim(need_description) = '';

UPDATE public.studio_budget_requests
SET message = COALESCE(NULLIF(btrim(message), ''), need_description, 'Demande studio')
WHERE message IS NULL OR btrim(message) = '';

ALTER TABLE public.studio_budget_requests
  ALTER COLUMN need_description SET DEFAULT '',
  ALTER COLUMN need_description SET NOT NULL,
  ALTER COLUMN message SET DEFAULT '',
  ALTER COLUMN message SET NOT NULL;

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
