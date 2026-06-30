-- Pige commerciale — captures d'écran enregistrées par utilisateur
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.pige_commerciale_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  comment TEXT,
  image_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Regroupe les captures d'un même enregistrement (projet) — idempotent si déjà appliqué
ALTER TABLE public.pige_commerciale_saves
  ADD COLUMN IF NOT EXISTS project_id UUID;

UPDATE public.pige_commerciale_saves
  SET project_id = id
  WHERE project_id IS NULL;

ALTER TABLE public.pige_commerciale_saves
  ALTER COLUMN project_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS pige_commerciale_saves_user_id_idx ON public.pige_commerciale_saves (user_id);
CREATE INDEX IF NOT EXISTS pige_commerciale_saves_user_updated_idx
  ON public.pige_commerciale_saves (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS pige_commerciale_saves_project_id_idx
  ON public.pige_commerciale_saves (user_id, project_id);

ALTER TABLE public.pige_commerciale_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own pige commerciale saves" ON public.pige_commerciale_saves;
CREATE POLICY "Users select own pige commerciale saves"
  ON public.pige_commerciale_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own pige commerciale saves" ON public.pige_commerciale_saves;
CREATE POLICY "Users insert own pige commerciale saves"
  ON public.pige_commerciale_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own pige commerciale saves" ON public.pige_commerciale_saves;
CREATE POLICY "Users update own pige commerciale saves"
  ON public.pige_commerciale_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own pige commerciale saves" ON public.pige_commerciale_saves;
CREATE POLICY "Users delete own pige commerciale saves"
  ON public.pige_commerciale_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_pige_commerciale_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pige_commerciale_saves_updated_at ON public.pige_commerciale_saves;
CREATE TRIGGER pige_commerciale_saves_updated_at
  BEFORE UPDATE ON public.pige_commerciale_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_pige_commerciale_saves_updated_at();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pige-commerciale-captures',
  'pige-commerciale-captures',
  false,
  20971520,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users upload own pige captures" ON storage.objects;
CREATE POLICY "Users upload own pige captures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pige-commerciale-captures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users read own pige captures" ON storage.objects;
CREATE POLICY "Users read own pige captures"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pige-commerciale-captures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users delete own pige captures" ON storage.objects;
CREATE POLICY "Users delete own pige captures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pige-commerciale-captures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
