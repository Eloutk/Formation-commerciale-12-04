-- Mon espace — accès admin à tous les enregistrements (stratégies + devis SMS/RCS)
-- À exécuter dans Supabase > SQL Editor (après vente2-strategies.sql et sms-devis.sql)

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
