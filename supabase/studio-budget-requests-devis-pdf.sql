-- Migration — stocker le devis studio PDF généré pour Make / Slack
-- À exécuter si public.studio_budget_requests existe déjà.

ALTER TABLE public.studio_budget_requests
  ADD COLUMN IF NOT EXISTS devis_pdf_filename TEXT,
  ADD COLUMN IF NOT EXISTS devis_pdf_path TEXT,
  ADD COLUMN IF NOT EXISTS devis_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS devis_pdf_size_bytes BIGINT;
