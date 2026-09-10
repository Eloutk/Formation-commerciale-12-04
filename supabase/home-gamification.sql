-- Gamification Home unifiée
-- À exécuter dans Supabase > SQL Editor (après daily-questions.sql + guess-platform.sql)
--
-- Règles :
--   • Question du jour        = 1 pt
--   • Devine la plateforme    = 1 pt
--   • Série jours ouvrés      = +1 pt (si le jour ouvré précédent a aussi été joué)
--   • Week-ends & fériés FR exclus de la série (Devine indisponible ces jours-là)

-- ============================================================
-- Jours fériés français + jours ouvrés
-- ============================================================

CREATE OR REPLACE FUNCTION public.easter_sunday(p_year INTEGER)
RETURNS DATE
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  a INTEGER := p_year % 19;
  b INTEGER := p_year / 100;
  c INTEGER := p_year % 100;
  d INTEGER := b / 4;
  e INTEGER := b % 4;
  f INTEGER := (b + 8) / 25;
  g INTEGER := (b - f + 1) / 3;
  h INTEGER := (19 * a + b - d - g + 15) % 30;
  i INTEGER := c / 4;
  k INTEGER := c % 4;
  l INTEGER := (32 + 2 * e + 2 * i - h - k) % 7;
  m INTEGER := (a + 11 * h + 22 * l) / 451;
  month INTEGER := (h + l - 7 * m + 114) / 31;
  day INTEGER := ((h + l - 7 * m + 114) % 31) + 1;
BEGIN
  RETURN make_date(p_year, month, day);
END;
$$;

CREATE OR REPLACE FUNCTION public.is_french_public_holiday(d DATE)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT
    (EXTRACT(MONTH FROM d)::int, EXTRACT(DAY FROM d)::int) IN (
      (1, 1), (5, 1), (5, 8), (7, 14), (8, 15), (11, 1), (11, 11), (12, 25)
    )
    OR d = public.easter_sunday(EXTRACT(YEAR FROM d)::int) + 1
    OR d = public.easter_sunday(EXTRACT(YEAR FROM d)::int) + 39
    OR d = public.easter_sunday(EXTRACT(YEAR FROM d)::int) + 50;
$$;

CREATE OR REPLACE FUNCTION public.is_business_day(d DATE)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT EXTRACT(ISODOW FROM d)::int BETWEEN 1 AND 5
    AND NOT public.is_french_public_holiday(d);
$$;

-- ============================================================
-- Question du jour : colonne points
-- ============================================================

ALTER TABLE public.daily_question_answers
  ADD COLUMN IF NOT EXISTS points SMALLINT NOT NULL DEFAULT 1;

UPDATE public.daily_question_answers
SET points = 1
WHERE points IS DISTINCT FROM 1;

CREATE OR REPLACE FUNCTION public.submit_daily_answer(
  p_question_id UUID,
  p_selected_index INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  q public.daily_questions%ROWTYPE;
  existing public.daily_question_answers%ROWTYPE;
  is_ok BOOLEAN;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT * INTO q
  FROM public.daily_questions
  WHERE id = p_question_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Question introuvable';
  END IF;

  IF p_selected_index < 0 OR p_selected_index >= cardinality(q.options) THEN
    RAISE EXCEPTION 'Réponse invalide';
  END IF;

  SELECT * INTO existing
  FROM public.daily_question_answers
  WHERE user_id = uid AND question_id = p_question_id;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'already_answered', true,
      'selected_index', existing.selected_index,
      'correct_index', q.correct_index,
      'is_correct', existing.is_correct,
      'explanation', q.explanation,
      'options', to_jsonb(q.options),
      'points', COALESCE(existing.points, 1)
    );
  END IF;

  is_ok := (p_selected_index = q.correct_index);

  INSERT INTO public.daily_question_answers (
    user_id, question_id, cycle_day, selected_index, is_correct, points
  ) VALUES (
    uid, p_question_id, q.cycle_day, p_selected_index, is_ok, 1
  )
  RETURNING * INTO existing;

  RETURN jsonb_build_object(
    'already_answered', false,
    'selected_index', existing.selected_index,
    'correct_index', q.correct_index,
    'is_correct', existing.is_correct,
    'explanation', q.explanation,
    'options', to_jsonb(q.options),
    'points', existing.points
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_daily_answer_review(p_question_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  q public.daily_questions%ROWTYPE;
  existing public.daily_question_answers%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO existing
  FROM public.daily_question_answers
  WHERE user_id = uid AND question_id = p_question_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT * INTO q
  FROM public.daily_questions
  WHERE id = existing.question_id;

  RETURN jsonb_build_object(
    'selected_index', existing.selected_index,
    'correct_index', q.correct_index,
    'is_correct', existing.is_correct,
    'explanation', q.explanation,
    'options', to_jsonb(q.options),
    'points', COALESCE(existing.points, 1)
  );
END;
$$;

-- ============================================================
-- Devine la plateforme : 1 pt jeu + 0/1 pt série
-- ============================================================

CREATE OR REPLACE FUNCTION public.submit_guess_platform_answer(
  p_question_id UUID,
  p_selected_answer TEXT,
  p_hints_used INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  today_paris DATE := public.paris_today();
  q public.guess_platform_questions%ROWTYPE;
  existing public.guess_platform_answers%ROWTYPE;
  clues_count INTEGER;
  hints INTEGER;
  is_ok BOOLEAN;
  puzzle_pts SMALLINT := 1;
  days DATE[];
  days_with_today DATE[];
  streak INTEGER;
  streak_pts SMALLINT;
  total_pts SMALLINT;
  inserted public.guess_platform_answers%ROWTYPE;
  stats JSONB;
  prev_biz DATE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  IF NOT public.is_business_day(today_paris) THEN
    RAISE EXCEPTION 'Le jeu est disponible uniquement les jours ouvrés';
  END IF;

  SELECT * INTO q
  FROM public.guess_platform_questions
  WHERE id = p_question_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Question introuvable';
  END IF;

  clues_count := jsonb_array_length(q.clues);
  hints := LEAST(GREATEST(COALESCE(p_hints_used, 1), 1), clues_count);

  IF NOT (q.answer_options ? p_selected_answer)
     AND NOT EXISTS (
       SELECT 1
       FROM jsonb_array_elements_text(q.answer_options) opt
       WHERE opt = p_selected_answer
     ) THEN
    RAISE EXCEPTION 'Réponse invalide';
  END IF;

  SELECT * INTO existing
  FROM public.guess_platform_answers
  WHERE user_id = uid AND question_id = p_question_id;

  IF FOUND THEN
    RETURN public.get_guess_platform_review(p_question_id);
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.guess_platform_answers
    WHERE user_id = uid AND answered_on = today_paris
  ) THEN
    RAISE EXCEPTION 'Tu as déjà joué aujourd''hui';
  END IF;

  is_ok := (p_selected_answer = q.correct_answer);

  SELECT COALESCE(array_agg(DISTINCT a.answered_on), ARRAY[]::date[])
  INTO days
  FROM public.guess_platform_answers a
  WHERE a.user_id = uid
    AND public.is_business_day(a.answered_on);

  days_with_today := array_append(days, today_paris);
  streak := public.guess_compute_streak_from_days(days_with_today, today_paris);

  prev_biz := public.previous_business_day(today_paris);
  streak_pts := CASE WHEN prev_biz = ANY (days) THEN 1 ELSE 0 END;
  total_pts := puzzle_pts + streak_pts;

  INSERT INTO public.guess_platform_answers (
    user_id, question_id, selected_answer, is_correct,
    hints_used, puzzle_points, streak_bonus, points, answered_on
  ) VALUES (
    uid, p_question_id, p_selected_answer, is_ok,
    hints, puzzle_pts, streak_pts, total_pts, today_paris
  )
  RETURNING * INTO inserted;

  stats := public.get_home_gamification_stats();

  RETURN jsonb_build_object(
    'already_answered', false,
    'selected_answer', inserted.selected_answer,
    'correct_answer', q.correct_answer,
    'is_correct', inserted.is_correct,
    'hints_used', inserted.hints_used,
    'puzzle_points', inserted.puzzle_points,
    'streak_bonus', inserted.streak_bonus,
    'points', inserted.points,
    'explanation', q.explanation,
    'clues', q.clues,
    'answer_options', q.answer_options,
    'stats', stats,
    'next_business_day', public.next_business_day(today_paris),
    'current_streak', streak
  );
END;
$$;

-- IMPORTANT : ne jamais recalculer / écraser les points déjà gagnés.
-- Le total affiché = SUM(historique). Hier 2 + aujourd'hui 1 = 3.

-- ============================================================
-- Stats globales Home (points question + plateforme + séries)
-- Total cumulatif = somme de toutes les réponses, tous les jours.
-- ============================================================

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

  -- Chaque jeu ajoute ses points indépendamment (pas besoin des 3)
  SELECT COALESCE(SUM(COALESCE(a.points, 1)), 0)::int
  INTO daily_pts
  FROM public.daily_question_answers a
  WHERE a.user_id = uid;

  SELECT COALESCE(SUM(a.points), 0)::int
  INTO guess_pts
  FROM public.guess_platform_answers a
  WHERE a.user_id = uid;

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
  ELSIF public.is_business_day(today_paris) THEN
    anchor := public.previous_business_day(today_paris);
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

-- Compat : get_guess_platform_stats délègue aux stats Home
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

CREATE OR REPLACE FUNCTION public.get_guess_platform_review(p_question_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  a public.guess_platform_answers%ROWTYPE;
  q public.guess_platform_questions%ROWTYPE;
  stats JSONB;
BEGIN
  IF uid IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO a
  FROM public.guess_platform_answers
  WHERE user_id = uid AND question_id = p_question_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT * INTO q FROM public.guess_platform_questions WHERE id = a.question_id;
  stats := public.get_home_gamification_stats();

  RETURN jsonb_build_object(
    'already_answered', true,
    'selected_answer', a.selected_answer,
    'correct_answer', q.correct_answer,
    'is_correct', a.is_correct,
    'hints_used', a.hints_used,
    'puzzle_points', a.puzzle_points,
    'streak_bonus', a.streak_bonus,
    'points', a.points,
    'explanation', q.explanation,
    'clues', q.clues,
    'answer_options', q.answer_options,
    'stats', stats,
    'next_business_day', public.next_business_day(a.answered_on),
    'current_streak', (stats ->> 'current_streak')::int
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.easter_sunday(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_french_public_holiday(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_home_gamification_stats() TO authenticated;
