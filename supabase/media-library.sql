-- Médiathèque Link Academy
-- À exécuter dans le SQL Editor de votre projet Supabase existant.

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  sectors TEXT[] NOT NULL DEFAULT '{}',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  month SMALLINT CHECK (month IS NULL OR (month >= 1 AND month <= 12)),
  year SMALLINT CHECK (year IS NULL OR (year >= 2000 AND year <= 2100)),
  client_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  report_link TEXT,
  uploaded_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS media_assets_sectors_gin_idx ON public.media_assets USING GIN (sectors);
CREATE INDEX IF NOT EXISTS media_assets_platforms_gin_idx ON public.media_assets USING GIN (platforms);
CREATE INDEX IF NOT EXISTS media_assets_month_year_idx ON public.media_assets (month, year);
CREATE INDEX IF NOT EXISTS media_assets_client_name_idx ON public.media_assets (client_name);
CREATE INDEX IF NOT EXISTS media_assets_campaign_name_idx ON public.media_assets (campaign_name);
CREATE INDEX IF NOT EXISTS media_assets_created_at_idx ON public.media_assets (created_at DESC);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view media" ON public.media_assets;
CREATE POLICY "Authenticated users can view media"
ON public.media_assets FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert own media" ON public.media_assets;
CREATE POLICY "Authenticated users can insert own media"
ON public.media_assets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by_id);

CREATE OR REPLACE FUNCTION public.delete_media_asset(asset_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.media_assets WHERE id = asset_id;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_media_asset(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_media_asset(UUID) TO authenticated;

DROP POLICY IF EXISTS "Admins can delete media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_assets;
CREATE POLICY "Authenticated users can delete media"
ON public.media_assets FOR DELETE
TO authenticated
USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-library',
  'media-library',
  false,
  104857600,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
    'application/zip'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can upload media files" ON storage.objects;
CREATE POLICY "Authenticated users can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-library');

DROP POLICY IF EXISTS "Authenticated users can read media files" ON storage.objects;
CREATE POLICY "Authenticated users can read media files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media-library');

DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media files" ON storage.objects;
CREATE POLICY "Authenticated users can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-library');
