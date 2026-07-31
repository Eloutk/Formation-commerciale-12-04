-- Partage des stratégies Social media entre utilisateurs
-- À exécuter dans Supabase > SQL Editor (après vente2-strategies.sql)

CREATE TABLE IF NOT EXISTS public.vente2_strategy_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.vente2_strategies(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT vente2_strategy_shares_unique UNIQUE (strategy_id, shared_with_user_id),
  CONSTRAINT vente2_strategy_shares_not_self CHECK (shared_with_user_id <> shared_by_user_id)
);

CREATE INDEX IF NOT EXISTS vente2_strategy_shares_with_idx
  ON public.vente2_strategy_shares (shared_with_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vente2_strategy_shares_strategy_idx
  ON public.vente2_strategy_shares (strategy_id);

ALTER TABLE public.vente2_strategy_shares ENABLE ROW LEVEL SECURITY;

-- Helpers SECURITY DEFINER pour éviter la récursion RLS entre strategies <-> shares
CREATE OR REPLACE FUNCTION public.user_owns_vente2_strategy(p_strategy_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vente2_strategies s
    WHERE s.id = p_strategy_id AND s.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_has_vente2_strategy_share(p_strategy_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vente2_strategy_shares sh
    WHERE sh.strategy_id = p_strategy_id AND sh.shared_with_user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.user_owns_vente2_strategy(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_vente2_strategy_share(UUID) TO authenticated;

DROP POLICY IF EXISTS "Owners manage strategy shares" ON public.vente2_strategy_shares;
CREATE POLICY "Owners manage strategy shares"
  ON public.vente2_strategy_shares
  FOR ALL
  USING (public.user_owns_vente2_strategy(strategy_id))
  WITH CHECK (
    auth.uid() = shared_by_user_id
    AND public.user_owns_vente2_strategy(strategy_id)
  );

DROP POLICY IF EXISTS "Recipients see and leave strategy shares" ON public.vente2_strategy_shares;
CREATE POLICY "Recipients see strategy shares"
  ON public.vente2_strategy_shares
  FOR SELECT
  USING (shared_with_user_id = auth.uid());

DROP POLICY IF EXISTS "Recipients leave strategy shares" ON public.vente2_strategy_shares;
CREATE POLICY "Recipients leave strategy shares"
  ON public.vente2_strategy_shares
  FOR DELETE
  USING (shared_with_user_id = auth.uid());

-- SELECT : propriétaire ou bénéficiaire du partage
DROP POLICY IF EXISTS "Users select own vente2 strategies" ON public.vente2_strategies;
DROP POLICY IF EXISTS "Users select own or shared vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Users select own or shared vente2 strategies"
  ON public.vente2_strategies
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.user_has_vente2_strategy_share(id)
  );

-- UPDATE : propriétaire ou bénéficiaire (collaboration)
DROP POLICY IF EXISTS "Users update own vente2 strategies" ON public.vente2_strategies;
DROP POLICY IF EXISTS "Users update own or shared vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Users update own or shared vente2 strategies"
  ON public.vente2_strategies
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.user_has_vente2_strategy_share(id)
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.user_has_vente2_strategy_share(id)
  );

-- Recherche de collègues pour le partage (pas soi-même)
-- Cherche dans profiles (nom) + auth.users (email) pour couvrir les comptes sans nom renseigné
-- DROP requis : le type de retour a changé (ajout de email)
DROP FUNCTION IF EXISTS public.search_colleagues_for_share(TEXT);

CREATE OR REPLACE FUNCTION public.search_colleagues_for_share(search_query TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  display_name TEXT,
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
    p.display_name,
    u.email::text AS email
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.id <> auth.uid()
    AND (
      COALESCE(p.full_name, '') ILIKE '%' || q || '%'
      OR COALESCE(p.display_name, '') ILIKE '%' || q || '%'
      OR COALESCE(u.email::text, '') ILIKE '%' || q || '%'
      OR COALESCE(u.raw_user_meta_data->>'full_name', '') ILIKE '%' || q || '%'
    )
  ORDER BY
    COALESCE(
      NULLIF(trim(p.display_name), ''),
      NULLIF(trim(p.full_name), ''),
      NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''),
      u.email::text
    )
  LIMIT 20;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_colleagues_for_share(TEXT) TO authenticated;

-- Liste enrichie : mes stratégies + celles partagées avec moi
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
      ELSE COALESCE(
        NULLIF(trim(p.display_name), ''),
        NULLIF(trim(p.full_name), ''),
        'Collègue'
      )
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

-- Liste des partages d'une stratégie (propriétaire uniquement via ownership check)
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
    COALESCE(
      NULLIF(trim(p.display_name), ''),
      NULLIF(trim(p.full_name), ''),
      'Utilisateur'
    ) AS shared_with_name
  FROM public.vente2_strategy_shares sh
  LEFT JOIN public.profiles p ON p.id = sh.shared_with_user_id
  WHERE sh.strategy_id = p_strategy_id
  ORDER BY sh.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_vente2_strategy_shares(UUID) TO authenticated;
