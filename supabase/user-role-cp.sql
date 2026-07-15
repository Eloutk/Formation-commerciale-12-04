-- Profil « CP » — rôle et helpers SQL
-- À exécuter dans Supabase > SQL Editor (après README_SUPABASE_SQL.md §5)

-- 1. Ajouter la valeur cp à l'enum user_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role'
      AND e.enumlabel = 'cp'
  ) THEN
    ALTER TYPE public.user_role ADD VALUE 'cp';
  END IF;
END $$;

-- 2. Vérifier si un utilisateur a le rôle cp
CREATE OR REPLACE FUNCTION public.is_cp(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role = 'cp'::public.user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.is_cp(UUID) TO authenticated;

-- 3. Exemple : attribuer le rôle CP à un utilisateur
-- UPDATE public.profiles
-- SET role = 'cp'::public.user_role
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'cp@example.com'
-- );

-- 4. Lister les comptes CP
-- SELECT p.id, u.email, p.full_name, p.role
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id
-- WHERE p.role = 'cp'::public.user_role;
