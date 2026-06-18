-- Migration médiathèque : plateformes multiples (comme les secteurs)
-- À exécuter si la table media_assets existe déjà avec l'ancienne colonne platform.

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS platforms TEXT[] NOT NULL DEFAULT '{}';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'media_assets' AND column_name = 'platform'
  ) THEN
    UPDATE public.media_assets
    SET platforms = ARRAY[platform]
    WHERE (platforms IS NULL OR platforms = '{}') AND platform IS NOT NULL AND platform <> '';

    ALTER TABLE public.media_assets DROP COLUMN platform;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS media_assets_platforms_gin_idx ON public.media_assets USING GIN (platforms);
