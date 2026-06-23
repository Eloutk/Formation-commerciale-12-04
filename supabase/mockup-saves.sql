-- Espace personnel — mockups publicitaires (paramètres + PNG exporté)
-- À exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS public.mockup_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL,
  content JSONB NOT NULL,
  preview_png_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration si la table existait déjà sans la colonne PNG
ALTER TABLE public.mockup_saves
  ADD COLUMN IF NOT EXISTS preview_png_path TEXT;

CREATE INDEX IF NOT EXISTS mockup_saves_user_id_idx ON public.mockup_saves (user_id);
CREATE INDEX IF NOT EXISTS mockup_saves_user_updated_idx ON public.mockup_saves (user_id, updated_at DESC);

ALTER TABLE public.mockup_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own mockup saves" ON public.mockup_saves;
CREATE POLICY "Users select own mockup saves"
  ON public.mockup_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own mockup saves" ON public.mockup_saves;
CREATE POLICY "Users insert own mockup saves"
  ON public.mockup_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own mockup saves" ON public.mockup_saves;
CREATE POLICY "Users update own mockup saves"
  ON public.mockup_saves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own mockup saves" ON public.mockup_saves;
CREATE POLICY "Users delete own mockup saves"
  ON public.mockup_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_mockup_saves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mockup_saves_updated_at ON public.mockup_saves;
CREATE TRIGGER mockup_saves_updated_at
  BEFORE UPDATE ON public.mockup_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_mockup_saves_updated_at();

-- Bucket Storage pour les PNG exportés des mockups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mockup-exports',
  'mockup-exports',
  false,
  52428800,
  ARRAY['image/png']::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users upload own mockup png" ON storage.objects;
CREATE POLICY "Users upload own mockup png"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mockup-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users read own mockup png" ON storage.objects;
CREATE POLICY "Users read own mockup png"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'mockup-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users update own mockup png" ON storage.objects;
CREATE POLICY "Users update own mockup png"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'mockup-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'mockup-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users delete own mockup png" ON storage.objects;
CREATE POLICY "Users delete own mockup png"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'mockup-exports'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
