-- Profil « Créa » — rôle et helpers SQL
-- À exécuter dans Supabase > SQL Editor (après README_SUPABASE_SQL.md §5)

-- 1. Ajouter la valeur crea à l'enum user_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role'
      AND e.enumlabel = 'crea'
  ) THEN
    ALTER TYPE public.user_role ADD VALUE 'crea';
  END IF;
END $$;

-- 2. Vérifier si un utilisateur a le rôle crea
CREATE OR REPLACE FUNCTION public.is_crea(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role = 'crea'::public.user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.is_crea(UUID) TO authenticated;

-- 3. Exemple : attribuer le rôle Créa à un utilisateur
-- UPDATE public.profiles
-- SET role = 'crea'::public.user_role
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'crea@example.com'
-- );

-- 4. Lister les comptes Créa
-- SELECT p.id, u.email, p.full_name, p.role
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id
-- WHERE p.role = 'crea'::public.user_role;
