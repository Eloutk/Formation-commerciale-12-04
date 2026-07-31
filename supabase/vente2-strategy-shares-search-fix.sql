-- Correctif recherche collègues (partage stratégies Social media)
-- À ré-exécuter dans Supabase > SQL Editor si la recherche ne trouve personne.
-- Cherche désormais par nom, pseudo ET email.

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
