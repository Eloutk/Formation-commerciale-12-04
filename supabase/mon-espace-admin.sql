-- Mon espace — accès admin à tous les enregistrements (stratégies + devis SMS/RCS + simulateur média)
-- À exécuter dans Supabase > SQL Editor (après vente2-strategies.sql, sms-devis.sql et simulateur-media-saves.sql)

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- Admins : lire tous les profils (noms pour le filtre par auteur)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins : lire toutes les stratégies calculateur de vente
DROP POLICY IF EXISTS "Admins select all vente2 strategies" ON public.vente2_strategies;
CREATE POLICY "Admins select all vente2 strategies"
  ON public.vente2_strategies FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins : lire tous les devis SMS / RCS
DROP POLICY IF EXISTS "Admins select all sms devis" ON public.sms_devis;
CREATE POLICY "Admins select all sms devis"
  ON public.sms_devis FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- RPC : contourne RLS si les policies ci-dessus ne sont pas encore actives
CREATE OR REPLACE FUNCTION public.admin_list_vente2_strategies()
RETURNS SETOF public.vente2_strategies
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT vs.*
  FROM public.vente2_strategies vs
  WHERE public.is_admin(auth.uid())
  ORDER BY vs.updated_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_sms_devis()
RETURNS SETOF public.sms_devis
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sd.*
  FROM public.sms_devis sd
  WHERE public.is_admin(auth.uid())
  ORDER BY sd.updated_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_profiles_for_mon_espace()
RETURNS TABLE (id UUID, full_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE public.is_admin(auth.uid());
$$;

-- Admins : lire toutes les simulations Simulateur Média Link
DROP POLICY IF EXISTS "Admins select all simulateur media saves" ON public.simulateur_media_saves;
CREATE POLICY "Admins select all simulateur media saves"
  ON public.simulateur_media_saves FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.admin_list_simulateur_media_saves()
RETURNS SETOF public.simulateur_media_saves
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sms.*
  FROM public.simulateur_media_saves sms
  WHERE public.is_admin(auth.uid())
  ORDER BY sms.updated_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_vente2_strategies() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_sms_devis() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_simulateur_media_saves() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_profiles_for_mon_espace() TO authenticated;

-- Admins : lire tous les mockups publicitaires
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
