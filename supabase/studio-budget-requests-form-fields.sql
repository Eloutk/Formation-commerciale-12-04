-- Migration pour stocker tous les champs du popup "Demande d'approche budgétaire"
-- À exécuter si la table public.studio_budget_requests existe déjà.

ALTER TABLE public.studio_budget_requests
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS project_theme TEXT,
  ADD COLUMN IF NOT EXISTS project_date TEXT,
  ADD COLUMN IF NOT EXISTS project_name TEXT;

UPDATE public.studio_budget_requests
SET
  client_name = COALESCE(NULLIF(btrim(client_name), ''), ''),
  project_theme = COALESCE(NULLIF(btrim(project_theme), ''), ''),
  project_date = COALESCE(NULLIF(btrim(project_date), ''), ''),
  project_name = COALESCE(
    NULLIF(btrim(project_name), ''),
    NULLIF(
      btrim(
        CONCAT(
          COALESCE(NULLIF(btrim(project_theme), ''), ''),
          CASE
            WHEN COALESCE(NULLIF(btrim(project_theme), ''), '') <> ''
             AND COALESCE(NULLIF(btrim(project_date), ''), '') <> ''
            THEN ' '
            ELSE ''
          END,
          COALESCE(NULLIF(btrim(project_date), ''), '')
        )
      ),
      ''
    ),
    ''
  );

ALTER TABLE public.studio_budget_requests
  ALTER COLUMN client_name SET DEFAULT '',
  ALTER COLUMN client_name SET NOT NULL,
  ALTER COLUMN project_theme SET DEFAULT '',
  ALTER COLUMN project_theme SET NOT NULL,
  ALTER COLUMN project_date SET DEFAULT '',
  ALTER COLUMN project_date SET NOT NULL,
  ALTER COLUMN project_name SET DEFAULT '',
  ALTER COLUMN project_name SET NOT NULL;
