-- À exécuter dans Supabase > SQL Editor
-- Objectif: stocker les anniversaires (récurrents chaque année) et les afficher automatiquement sur /home.

CREATE TABLE IF NOT EXISTS public.birthdays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  month SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  day SMALLINT NOT NULL CHECK (day BETWEEN 1 AND 31),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Éviter les doublons "même personne, même date"
CREATE UNIQUE INDEX IF NOT EXISTS birthdays_unique_name_month_day
  ON public.birthdays (name, month, day);

-- Activer RLS
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;

-- Lecture: utilisateurs connectés
CREATE POLICY "Authenticated can read birthdays"
  ON public.birthdays
  FOR SELECT
  TO authenticated
  USING (true);

-- Écriture: admins uniquement (via profiles.role)
CREATE POLICY "Admins can manage birthdays"
  ON public.birthdays
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

-- Exemples d'inserts
-- INSERT INTO public.birthdays (name, month, day) VALUES
-- ('Gautier', 2, 6),
-- ('Morgan', 2, 16),
-- ('François', 2, 20);

