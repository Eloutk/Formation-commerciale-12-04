-- Correctif recherche collègues — profiles.full_name uniquement (+ email auth)
-- À ré-exécuter dans Supabase > SQL Editor

DROP FUNCTION IF EXISTS public.search_colleagues_for_share(TEXT);

CREATE OR REPLACE FUNCTION public.search_colleagues_for_share(search_query TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  q TEXT := trim(COALESCE(search_query, ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  IF char_length(q) < 2 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    p.full_name,
    u.email::text AS email
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.id <> auth.uid()
    AND (
      COALESCE(p.full_name, '') ILIKE '%' || q || '%'
      OR COALESCE(u.email::text, '') ILIKE '%' || q || '%'
      OR COALESCE(u.raw_user_meta_data->>'full_name', '') ILIKE '%' || q || '%'
    )
  ORDER BY
    COALESCE(
      NULLIF(trim(p.full_name), ''),
      NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''),
      u.email::text
    )
  LIMIT 20;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_colleagues_for_share(TEXT) TO authenticated;

-- Labels de partage : full_name uniquement
CREATE OR REPLACE FUNCTION public.list_accessible_vente2_strategies()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  total_amount NUMERIC,
  content JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_owner BOOLEAN,
  shared_by_user_id UUID,
  shared_by_name TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.user_id,
    s.name,
    s.total_amount,
    s.content,
    s.created_at,
    s.updated_at,
    (s.user_id = uid) AS is_owner,
    CASE WHEN s.user_id = uid THEN NULL ELSE sh.shared_by_user_id END AS shared_by_user_id,
    CASE
      WHEN s.user_id = uid THEN NULL
      ELSE COALESCE(NULLIF(trim(p.full_name), ''), 'Collègue')
    END AS shared_by_name
  FROM public.vente2_strategies s
  LEFT JOIN public.vente2_strategy_shares sh
    ON sh.strategy_id = s.id AND sh.shared_with_user_id = uid
  LEFT JOIN public.profiles p
    ON p.id = sh.shared_by_user_id
  WHERE s.user_id = uid
     OR sh.id IS NOT NULL
  ORDER BY s.updated_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_accessible_vente2_strategies() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_vente2_strategy_shares(p_strategy_id UUID)
RETURNS TABLE (
  id UUID,
  strategy_id UUID,
  shared_with_user_id UUID,
  shared_by_user_id UUID,
  created_at TIMESTAMPTZ,
  shared_with_name TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  IF NOT public.user_owns_vente2_strategy(p_strategy_id) THEN
    RAISE EXCEPTION 'Accès refusé';
  END IF;

  RETURN QUERY
  SELECT
    sh.id,
    sh.strategy_id,
    sh.shared_with_user_id,
    sh.shared_by_user_id,
    sh.created_at,
    COALESCE(NULLIF(trim(p.full_name), ''), 'Utilisateur') AS shared_with_name
  FROM public.vente2_strategy_shares sh
  LEFT JOIN public.profiles p ON p.id = sh.shared_with_user_id
  WHERE sh.strategy_id = p_strategy_id
  ORDER BY sh.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_vente2_strategy_shares(UUID) TO authenticated;
