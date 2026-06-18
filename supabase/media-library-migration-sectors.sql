-- Migration médiathèque : secteurs multiples + mois/année optionnels
-- À exécuter si la table media_assets existe déjà avec l'ancien schéma.

ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS sectors TEXT[] NOT NULL DEFAULT '{}';

-- Migrer l'ancienne colonne sector si elle existe encore
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'media_assets' AND column_name = 'sector'
  ) THEN
    UPDATE public.media_assets
    SET sectors = ARRAY[sector]
    WHERE (sectors IS NULL OR sectors = '{}') AND sector IS NOT NULL AND sector <> '';

    ALTER TABLE public.media_assets DROP COLUMN sector;
  END IF;
END $$;

ALTER TABLE public.media_assets
  ALTER COLUMN month DROP NOT NULL,
  ALTER COLUMN year DROP NOT NULL;

ALTER TABLE public.media_assets DROP CONSTRAINT IF EXISTS media_assets_month_check;
ALTER TABLE public.media_assets
  ADD CONSTRAINT media_assets_month_check
  CHECK (month IS NULL OR (month >= 1 AND month <= 12));

ALTER TABLE public.media_assets DROP CONSTRAINT IF EXISTS media_assets_year_check;
ALTER TABLE public.media_assets
  ADD CONSTRAINT media_assets_year_check
  CHECK (year IS NULL OR (year >= 2000 AND year <= 2100));

CREATE INDEX IF NOT EXISTS media_assets_sectors_gin_idx ON public.media_assets USING GIN (sectors);
