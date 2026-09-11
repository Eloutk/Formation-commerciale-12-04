-- Meilleurs joueurs du Mot du jour (moins d'essais, parties résolues).
-- Coller dans Supabase > SQL Editor

CREATE OR REPLACE FUNCTION public.get_motus_best_of_day(p_cycle_day INTEGER DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  n INTEGER;
  pick INTEGER;
  cycle_day INTEGER;
  word_id UUID;
  best_attempts INTEGER;
  winners JSONB := '[]'::jsonb;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  cycle_day := GREATEST(COALESCE(p_cycle_day, 1), 1);

  SELECT COUNT(*)::int INTO n FROM public.motus_words WHERE is_active = true;
  IF n = 0 THEN
    RETURN jsonb_build_object('attempts', NULL, 'winners', '[]'::jsonb);
  END IF;

  pick := ((cycle_day - 1) % n) + 1;

  SELECT w.id INTO word_id
  FROM public.motus_words w
  WHERE w.is_active = true
  ORDER BY w.sort_order
  OFFSET pick - 1
  LIMIT 1;

  IF word_id IS NULL THEN
    RETURN jsonb_build_object('attempts', NULL, 'winners', '[]'::jsonb);
  END IF;

  SELECT MIN(a.attempts)::int
  INTO best_attempts
  FROM public.motus_answers a
  WHERE a.word_id = word_id
    AND a.solved = true
    AND a.attempts > 0;

  IF best_attempts IS NULL THEN
    RETURN jsonb_build_object('attempts', NULL, 'winners', '[]'::jsonb, 'word_id', word_id);
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
    SELECT
      a.user_id,
      COALESCE(
        NULLIF(trim(split_part(COALESCE(p.full_name, ''), ' ', 1)), ''),
        'Quelqu’un'
      ) AS first_name
    FROM public.motus_answers a
    LEFT JOIN public.profiles p ON p.id = a.user_id
    WHERE a.word_id = word_id
      AND a.solved = true
      AND a.attempts = best_attempts
  ) s;

  RETURN jsonb_build_object(
    'attempts', best_attempts,
    'winners', winners,
    'word_id', word_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_motus_best_of_day(INTEGER) TO authenticated;
