-- Badge notification Mes projets : partages non vus
-- À exécuter dans Supabase > SQL Editor (après vente2-strategy-shares.sql)

ALTER TABLE public.vente2_strategy_shares
  ADD COLUMN IF NOT EXISTS seen_at TIMESTAMPTZ;

COMMENT ON COLUMN public.vente2_strategy_shares.seen_at IS
  'NULL = non vu par le destinataire ; renseigné quand il ouvre Mes projets';

CREATE OR REPLACE FUNCTION public.count_unseen_vente2_strategy_shares()
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  n INTEGER;
BEGIN
  IF uid IS NULL THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*)::INTEGER INTO n
  FROM public.vente2_strategy_shares sh
  WHERE sh.shared_with_user_id = uid
    AND sh.seen_at IS NULL;

  RETURN COALESCE(n, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.count_unseen_vente2_strategy_shares() TO authenticated;

CREATE OR REPLACE FUNCTION public.mark_vente2_strategy_shares_seen()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  n INTEGER;
BEGIN
  IF uid IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.vente2_strategy_shares
  SET seen_at = NOW()
  WHERE shared_with_user_id = uid
    AND seen_at IS NULL;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_vente2_strategy_shares_seen() TO authenticated;
