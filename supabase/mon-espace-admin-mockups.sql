-- Mon espace admin — accès à tous les mockups (migration si mon-espace-admin.sql déjà exécuté)
-- Prérequis : supabase/mockup-saves.sql et supabase/mon-espace-admin.sql (fonction is_admin)

DROP POLICY IF EXISTS "Admins select all mockup saves" ON public.mockup_saves;
CREATE POLICY "Admins select all mockup saves"
  ON public.mockup_saves FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.admin_list_mockup_saves()
RETURNS SETOF public.mockup_saves
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ms.*
  FROM public.mockup_saves ms
  WHERE public.is_admin(auth.uid())
  ORDER BY ms.updated_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_mockup_saves() TO authenticated;
