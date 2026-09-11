-- Meilleurs joueurs du Mot du jour (moins d'essais parmi les parties RÉSOLUES du jour).
-- Rétroactif : lit les lignes déjà présentes dans motus_answers.
-- Coller dans Supabase > SQL Editor

CREATE OR REPLACE FUNCTION public.get_motus_best_of_day(p_cycle_day INTEGER DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  today_paris DATE := (NOW() AT TIME ZONE 'Europe/Paris')::date;
  best_attempts INTEGER;
  winners JSONB := '[]'::jsonb;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  -- Rétroactif : meilleures parties du jour (Paris), mot trouvé
  SELECT MIN(a.attempts)::int
  INTO best_attempts
  FROM public.motus_answers a
  WHERE a.answered_on = today_paris
    AND a.solved = true
    AND COALESCE(a.attempts, 0) > 0;

  IF best_attempts IS NULL THEN
    RETURN jsonb_build_object(
      'attempts', NULL,
      'winners', '[]'::jsonb,
      'today', today_paris
    );
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'user_id', s.user_id,
        'first_name', s.first_name
      )
      ORDER BY s.first_name
    ),
    '[]'::jsonb
  )
  INTO winners
  FROM (
    SELECT DISTINCT ON (a.user_id)
      a.user_id,
      COALESCE(
        NULLIF(trim(split_part(COALESCE(p.full_name, u.raw_user_meta_data->>'full_name', ''), ' ', 1)), ''),
        NULLIF(trim(split_part(COALESCE(u.email, ''), '@', 1)), ''),
        'Quelqu’un'
      ) AS first_name
    FROM public.motus_answers a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    LEFT JOIN auth.users u ON u.id = a.user_id
    WHERE a.answered_on = today_paris
      AND a.solved = true
      AND a.attempts = best_attempts
    ORDER BY a.user_id, a.finished_at ASC NULLS LAST
  ) s;

  RETURN jsonb_build_object(
    'attempts', best_attempts,
    'winners', winners,
    'today', today_paris
  );
END;
$$;

-- Surcharge sans argument (appel RPC plus simple)
CREATE OR REPLACE FUNCTION public.get_motus_best_of_day()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.get_motus_best_of_day(NULL);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_motus_best_of_day(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_motus_best_of_day() TO authenticated;
