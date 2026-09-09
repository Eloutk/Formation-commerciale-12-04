-- Assure que chaque jeu rapporte ses points indépendamment
-- (question + plateforme + motus), sans attendre les 3.
-- Coller dans Supabase > SQL Editor

CREATE OR REPLACE FUNCTION public.get_home_gamification_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  today_paris DATE := public.paris_today();
  daily_pts INTEGER := 0;
  guess_pts INTEGER := 0;
  motus_pts INTEGER := 0;
  days DATE[];
  current_streak INTEGER := 0;
  record_streak INTEGER := 0;
  anchor DATE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  -- Question du jour : 1 pt / réponse (indépendant)
  SELECT COALESCE(SUM(COALESCE(a.points, 1)), 0)::int
  INTO daily_pts
  FROM public.daily_question_answers a
  WHERE a.user_id = uid;

  -- Devine la plateforme : points du jeu (indépendant)
  SELECT COALESCE(SUM(a.points), 0)::int
  INTO guess_pts
  FROM public.guess_platform_answers a
  WHERE a.user_id = uid;

  -- Mot du jour : points du jeu (indépendant)
  BEGIN
    SELECT COALESCE(SUM(a.points), 0)::int
    INTO motus_pts
    FROM public.motus_answers a
    WHERE a.user_id = uid;
  EXCEPTION WHEN undefined_table THEN
    motus_pts := 0;
  END;

  SELECT COALESCE(array_agg(d ORDER BY d), ARRAY[]::date[])
  INTO days
  FROM (
    SELECT DISTINCT a.answered_on AS d
    FROM public.guess_platform_answers a
    WHERE a.user_id = uid
      AND public.is_business_day(a.answered_on)
  ) s;

  IF public.is_business_day(today_paris) AND today_paris = ANY (days) THEN
    anchor := today_paris;
  ELSE
    anchor := public.previous_business_day(today_paris);
  END IF;

  current_streak := public.guess_compute_streak_from_days(days, anchor);
  record_streak := public.guess_compute_record_from_days(days);

  RETURN jsonb_build_object(
    'total_points', daily_pts + guess_pts + motus_pts,
    'daily_points', daily_pts,
    'guess_points', guess_pts,
    'motus_points', motus_pts,
    'current_streak', current_streak,
    'record_streak', record_streak,
    'today', today_paris,
    'is_business_day', public.is_business_day(today_paris),
    'next_business_day', public.next_business_day(today_paris)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_guess_platform_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.get_home_gamification_stats();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_home_gamification_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guess_platform_stats() TO authenticated;
