-- Mon espace admin — performances (évite les timeouts sur grosses colonnes JSONB)
-- À exécuter dans Supabase > SQL Editor si la vue admin affiche :
--   « canceling statement due to statement timeout »
-- Prérequis : supabase/mon-espace-admin.sql déjà exécuté

-- PostgreSQL n'autorise pas CREATE OR REPLACE si le type de retour change :
-- il faut supprimer les anciennes fonctions (SETOF table complète) avant de les recréer.
DROP FUNCTION IF EXISTS public.admin_list_vente2_strategies();
DROP FUNCTION IF EXISTS public.admin_list_simulateur_media_saves();
DROP FUNCTION IF EXISTS public.admin_list_mockup_saves();
DROP FUNCTION IF EXISTS public.admin_list_sms_devis();
DROP FUNCTION IF EXISTS public.admin_list_profiles_for_mon_espace();

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role IN ('admin', 'super_admin')
  );
$$;

CREATE INDEX IF NOT EXISTS vente2_strategies_updated_at_idx
  ON public.vente2_strategies (updated_at DESC);

CREATE INDEX IF NOT EXISTS simulateur_media_saves_updated_at_idx
  ON public.simulateur_media_saves (updated_at DESC);

CREATE INDEX IF NOT EXISTS mockup_saves_updated_at_idx
  ON public.mockup_saves (updated_at DESC);

CREATE INDEX IF NOT EXISTS sms_devis_updated_at_idx
  ON public.sms_devis (updated_at DESC);

CREATE OR REPLACE FUNCTION public.admin_list_vente2_strategies()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  total_amount NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT vs.id, vs.user_id, vs.name, vs.total_amount, vs.created_at, vs.updated_at
  FROM public.vente2_strategies vs
  ORDER BY vs.updated_at DESC
  LIMIT 1000;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_simulateur_media_saves()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  summary_impressions NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT sms.id, sms.user_id, sms.name, sms.summary_impressions, sms.created_at, sms.updated_at
  FROM public.simulateur_media_saves sms
  ORDER BY sms.updated_at DESC
  LIMIT 1000;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_mockup_saves()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  client_name TEXT,
  platform TEXT,
  visual_format TEXT,
  preview_png_path TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    ms.id,
    ms.user_id,
    ms.name,
    ms.client_name,
    ms.platform,
    COALESCE(ms.content->>'visualFormat', 'single') AS visual_format,
    ms.preview_png_path,
    ms.created_at,
    ms.updated_at
  FROM public.mockup_saves ms
  ORDER BY ms.updated_at DESC
  LIMIT 1000;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_sms_devis()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  sms_type TEXT,
  total_amount NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT sd.id, sd.user_id, sd.name, sd.sms_type, sd.total_amount, sd.created_at, sd.updated_at
  FROM public.sms_devis sd
  ORDER BY sd.updated_at DESC
  LIMIT 1000;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_profiles_for_mon_espace()
RETURNS TABLE (id UUID, full_name TEXT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT p.id, p.full_name
  FROM public.profiles p;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_vente2_strategies() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_simulateur_media_saves() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_mockup_saves() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_sms_devis() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_profiles_for_mon_espace() TO authenticated;
