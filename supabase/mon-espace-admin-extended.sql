-- Mon espace admin — rétroplanning, studio et pige commerciale
-- À exécuter dans Supabase > SQL Editor (après mon-espace-admin.sql)

-- Admins : lire tous les rétroplannings
DROP POLICY IF EXISTS "Admins select all retroplanning saves" ON public.retroplanning_saves;
CREATE POLICY "Admins select all retroplanning saves"
  ON public.retroplanning_saves FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins : lire tous les devis studio
DROP POLICY IF EXISTS "Admins select all studio tarifs saves" ON public.studio_tarifs_saves;
CREATE POLICY "Admins select all studio tarifs saves"
  ON public.studio_tarifs_saves FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins : lire toutes les captures pige commerciale
DROP POLICY IF EXISTS "Admins select all pige commerciale saves" ON public.pige_commerciale_saves;
CREATE POLICY "Admins select all pige commerciale saves"
  ON public.pige_commerciale_saves FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins : lire les images pige commerciale (storage)
DROP POLICY IF EXISTS "Admins read pige captures" ON storage.objects;
CREATE POLICY "Admins read pige captures"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'pige-commerciale-captures'
    AND public.is_admin(auth.uid())
  );

CREATE INDEX IF NOT EXISTS retroplanning_saves_updated_at_idx
  ON public.retroplanning_saves (updated_at DESC);

CREATE INDEX IF NOT EXISTS studio_tarifs_saves_updated_at_idx
  ON public.studio_tarifs_saves (updated_at DESC);

CREATE INDEX IF NOT EXISTS pige_commerciale_saves_updated_at_idx
  ON public.pige_commerciale_saves (updated_at DESC);

DROP FUNCTION IF EXISTS public.admin_list_retroplanning_saves();
DROP FUNCTION IF EXISTS public.admin_list_studio_tarifs_saves();
DROP FUNCTION IF EXISTS public.admin_list_pige_commerciale_projects();

CREATE OR REPLACE FUNCTION public.admin_list_retroplanning_saves()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  operations_count INTEGER,
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
  SELECT rs.id, rs.user_id, rs.name, rs.operations_count, rs.created_at, rs.updated_at
  FROM public.retroplanning_saves rs
  ORDER BY rs.updated_at DESC
  LIMIT 1000;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_studio_tarifs_saves()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  summary_total_ht NUMERIC,
  summary_total_ttc NUMERIC,
  selected_count INTEGER,
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
    sts.id,
    sts.user_id,
    sts.name,
    sts.summary_total_ht,
    sts.summary_total_ttc,
    sts.selected_count,
    sts.created_at,
    sts.updated_at
  FROM public.studio_tarifs_saves sts
  ORDER BY sts.updated_at DESC
  LIMIT 1000;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_pige_commerciale_projects()
RETURNS TABLE (
  project_id UUID,
  user_id UUID,
  name TEXT,
  file_count BIGINT,
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
    pcs.project_id,
    pcs.user_id,
    (ARRAY_AGG(pcs.name ORDER BY pcs.created_at ASC))[1] AS name,
    COUNT(*)::BIGINT AS file_count,
    MIN(pcs.created_at) AS created_at,
    MAX(pcs.updated_at) AS updated_at
  FROM public.pige_commerciale_saves pcs
  GROUP BY pcs.project_id, pcs.user_id
  ORDER BY MAX(pcs.updated_at) DESC
  LIMIT 1000;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_retroplanning_saves() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_studio_tarifs_saves() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_pige_commerciale_projects() TO authenticated;
