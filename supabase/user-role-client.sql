-- Profil « Client » — rôle et helpers SQL
-- À exécuter dans Supabase > SQL Editor (après README_SUPABASE_SQL.md §5)

-- 1. Ajouter la valeur client à l'enum user_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role'
      AND e.enumlabel = 'client'
  ) THEN
    ALTER TYPE public.user_role ADD VALUE 'client';
  END IF;
END $$;

-- 2. Vérifier si un utilisateur a le rôle client
CREATE OR REPLACE FUNCTION public.is_client(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role = 'client'::public.user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.is_client(UUID) TO authenticated;

-- 3. Lire le rôle d'un utilisateur (pour policies / RPC)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role AS $$
DECLARE
  result public.user_role;
BEGIN
  SELECT role INTO result
  FROM public.profiles
  WHERE id = user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- 4. Exemple : attribuer le rôle client à un utilisateur
-- UPDATE public.profiles
-- SET role = 'client'::public.user_role
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'client@example.com'
-- );

-- 5. Lister les comptes client
-- SELECT p.id, u.email, p.full_name, p.role
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id
-- WHERE p.role = 'client'::public.user_role;
