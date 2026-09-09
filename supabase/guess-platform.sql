-- À exécuter dans Supabase > SQL Editor
-- Mini-jeu « Devine la plateforme » + gamification assiduité (jours ouvrés, Europe/Paris).
-- Ensuite coller supabase/guess-platform-seed.sql

-- ============================================================
-- Helpers dates (Europe/Paris, jours ouvrés)
-- ============================================================

CREATE OR REPLACE FUNCTION public.paris_today()
RETURNS DATE
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT (NOW() AT TIME ZONE 'Europe/Paris')::date;
$$;

CREATE OR REPLACE FUNCTION public.is_business_day(d DATE)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  -- ISODOW : 1 = lundi … 7 = dimanche. Fériés : à brancher plus tard ici.
  SELECT EXTRACT(ISODOW FROM d)::int BETWEEN 1 AND 5;
$$;

CREATE OR REPLACE FUNCTION public.previous_business_day(d DATE)
RETURNS DATE
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  cursor DATE := d - 1;
BEGIN
  WHILE NOT public.is_business_day(cursor) LOOP
    cursor := cursor - 1;
  END LOOP;
  RETURN cursor;
END;
$$;

CREATE OR REPLACE FUNCTION public.next_business_day(d DATE)
RETURNS DATE
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  cursor DATE := d + 1;
BEGIN
  WHILE NOT public.is_business_day(cursor) LOOP
    cursor := cursor + 1;
  END LOOP;
  RETURN cursor;
END;
$$;

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS public.guess_platform_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL DEFAULT 'Devine la plateforme',
  correct_answer TEXT NOT NULL,
  answer_options JSONB NOT NULL,
  clues JSONB NOT NULL,
  explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('facile', 'intermediaire', 'difficile')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guess_platform_options_array_chk CHECK (jsonb_typeof(answer_options) = 'array'),
  CONSTRAINT guess_platform_clues_array_chk CHECK (jsonb_typeof(clues) = 'array'),
  CONSTRAINT guess_platform_options_len_chk CHECK (
    jsonb_array_length(answer_options) BETWEEN 3 AND 4
  ),
  CONSTRAINT guess_platform_clues_len_chk CHECK (
    jsonb_array_length(clues) BETWEEN 3 AND 4
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS guess_platform_questions_sort_order_uidx
  ON public.guess_platform_questions (sort_order);

CREATE INDEX IF NOT EXISTS guess_platform_questions_active_sort_idx
  ON public.guess_platform_questions (is_active, sort_order);

CREATE TABLE IF NOT EXISTS public.guess_platform_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.guess_platform_questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  hints_used SMALLINT NOT NULL CHECK (hints_used BETWEEN 1 AND 4),
  puzzle_points SMALLINT NOT NULL CHECK (puzzle_points BETWEEN 0 AND 3),
  streak_bonus SMALLINT NOT NULL CHECK (streak_bonus >= 0),
  points SMALLINT NOT NULL CHECK (points >= 0),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answered_on DATE NOT NULL,
  CONSTRAINT guess_platform_answers_user_question_uidx UNIQUE (user_id, question_id),
  CONSTRAINT guess_platform_answers_user_day_uidx UNIQUE (user_id, answered_on),
  CONSTRAINT guess_platform_answers_points_sum_chk CHECK (points = puzzle_points + streak_bonus)
);

CREATE INDEX IF NOT EXISTS guess_platform_answers_user_on_idx
  ON public.guess_platform_answers (user_id, answered_on DESC);

ALTER TABLE public.guess_platform_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guess_platform_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read active guess questions" ON public.guess_platform_questions;
CREATE POLICY "Authenticated read active guess questions"
  ON public.guess_platform_questions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage guess questions" ON public.guess_platform_questions;
CREATE POLICY "Admins manage guess questions"
  ON public.guess_platform_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Users select own guess answers" ON public.guess_platform_answers;
CREATE POLICY "Users select own guess answers"
  ON public.guess_platform_answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own guess answers" ON public.guess_platform_answers;
CREATE POLICY "Users insert own guess answers"
  ON public.guess_platform_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Calcul série / record depuis l'historique
-- ============================================================

CREATE OR REPLACE FUNCTION public.guess_streak_ending_on(
  p_user_id UUID,
  p_end DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  days DATE[];
  cursor DATE;
  streak INTEGER := 0;
BEGIN
  IF NOT public.is_business_day(p_end) THEN
    RETURN 0;
  END IF;

  SELECT COALESCE(array_agg(DISTINCT a.answered_on ORDER BY a.answered_on), ARRAY[]::date[])
  INTO days
  FROM public.guess_platform_answers a
  WHERE a.user_id = p_user_id
    AND public.is_business_day(a.answered_on);

  cursor := p_end;
  LOOP
    IF cursor = ANY (days) OR cursor = p_end THEN
      -- p_end est inclus même avant insert (appelant doit l'avoir dans days ou forcer inclusion)
      IF cursor = ANY (days) THEN
        streak := streak + 1;
        cursor := public.previous_business_day(cursor);
      ELSE
        EXIT;
      END IF;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN streak;
END;
$$;

-- Version qui reçoit la liste des jours (incluant éventuellement aujourd'hui)
CREATE OR REPLACE FUNCTION public.guess_compute_streak_from_days(
  p_days DATE[],
  p_end DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  day_set DATE[] := COALESCE(p_days, ARRAY[]::date[]);
  cursor DATE;
  streak INTEGER := 0;
BEGIN
  IF p_end IS NULL OR NOT public.is_business_day(p_end) THEN
    RETURN 0;
  END IF;

  cursor := p_end;
  WHILE cursor = ANY (day_set) LOOP
    streak := streak + 1;
    cursor := public.previous_business_day(cursor);
  END LOOP;

  RETURN streak;
END;
$$;

CREATE OR REPLACE FUNCTION public.guess_compute_record_from_days(p_days DATE[])
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  sorted DATE[];
  i INTEGER;
  run INTEGER := 0;
  best INTEGER := 0;
  prev DATE;
BEGIN
  SELECT COALESCE(array_agg(d ORDER BY d), ARRAY[]::date[])
  INTO sorted
  FROM (
    SELECT DISTINCT unnest(COALESCE(p_days, ARRAY[]::date[])) AS d
  ) s
  WHERE public.is_business_day(d);

  IF array_length(sorted, 1) IS NULL THEN
    RETURN 0;
  END IF;

  FOR i IN 1 .. array_length(sorted, 1) LOOP
    IF i = 1 THEN
      run := 1;
    ELSIF sorted[i] = public.next_business_day(prev) THEN
      run := run + 1;
    ELSE
      run := 1;
    END IF;
    IF run > best THEN
      best := run;
    END IF;
    prev := sorted[i];
  END LOOP;

  RETURN best;
END;
$$;

-- ============================================================
-- RPCs jeu
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_guess_platform_play(p_cycle_day INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today_paris DATE := public.paris_today();
  n INTEGER;
  pick INTEGER;
  q public.guess_platform_questions%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  IF NOT public.is_business_day(today_paris) THEN
    RETURN jsonb_build_object(
      'weekend', true,
      'message', 'Reviens lundi pour continuer ta série',
      'next_business_day', public.next_business_day(today_paris)
    );
  END IF;

  SELECT COUNT(*)::int INTO n
  FROM public.guess_platform_questions
  WHERE is_active = true;

  IF n = 0 THEN
    RETURN jsonb_build_object('weekend', false, 'question', NULL);
  END IF;

  pick := ((GREATEST(COALESCE(p_cycle_day, 1), 1) - 1) % n) + 1;

  SELECT * INTO q
  FROM public.guess_platform_questions
  WHERE is_active = true
  ORDER BY sort_order
  OFFSET pick - 1
  LIMIT 1;

  RETURN jsonb_build_object(
    'weekend', false,
    'question', jsonb_build_object(
      'id', q.id,
      'title', q.title,
      'category', q.category,
      'difficulty', q.difficulty,
      'answer_options', q.answer_options,
      'clues', q.clues,
      'clues_count', jsonb_array_length(q.clues)
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_guess_platform_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  today_paris DATE := public.paris_today();
  days DATE[];
  current_streak INTEGER := 0;
  record_streak INTEGER := 0;
  total_points INTEGER := 0;
  anchor DATE;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT COALESCE(array_agg(DISTINCT a.answered_on ORDER BY a.answered_on), ARRAY[]::date[]),
         COALESCE(SUM(a.points), 0)::int
  INTO days, total_points
  FROM public.guess_platform_answers a
  WHERE a.user_id = uid;

  record_streak := public.guess_compute_record_from_days(days);

  IF public.is_business_day(today_paris) AND today_paris = ANY (days) THEN
    current_streak := public.guess_compute_streak_from_days(days, today_paris);
  ELSIF public.is_business_day(today_paris) THEN
    anchor := public.previous_business_day(today_paris);
    IF anchor = ANY (days) THEN
      current_streak := public.guess_compute_streak_from_days(days, anchor);
    ELSE
      current_streak := 0;
    END IF;
  ELSE
    -- Week-end : série figée sur le dernier jour ouvré joué s'il est contiguous jusqu'au vendredi précédent
    anchor := public.previous_business_day(today_paris);
    IF anchor = ANY (days) THEN
      current_streak := public.guess_compute_streak_from_days(days, anchor);
    ELSE
      current_streak := 0;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'current_streak', current_streak,
    'record_streak', record_streak,
    'total_points', total_points,
    'today', today_paris,
    'is_business_day', public.is_business_day(today_paris),
    'next_business_day', public.next_business_day(today_paris)
  );
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
  q public.guess_platform_questions%ROWTYPE;
  a public.guess_platform_answers%ROWTYPE;
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

  SELECT * INTO q FROM public.guess_platform_questions WHERE id = p_question_id;
  stats := public.get_guess_platform_stats();

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
    'next_business_day', public.next_business_day(a.answered_on)
  );
END;
$$;

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
  puzzle_pts SMALLINT;
  days DATE[];
  days_with_today DATE[];
  streak INTEGER;
  streak_pts SMALLINT;
  total_pts SMALLINT;
  inserted public.guess_platform_answers%ROWTYPE;
  stats JSONB;
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

  IF NOT is_ok THEN
    puzzle_pts := 0;
  ELSIF hints = 1 THEN
    puzzle_pts := 3;
  ELSIF hints = 2 THEN
    puzzle_pts := 2;
  ELSE
    puzzle_pts := 1;
  END IF;

  SELECT COALESCE(array_agg(DISTINCT a.answered_on), ARRAY[]::date[])
  INTO days
  FROM public.guess_platform_answers a
  WHERE a.user_id = uid
    AND public.is_business_day(a.answered_on);

  days_with_today := array_append(days, today_paris);
  streak := public.guess_compute_streak_from_days(days_with_today, today_paris);
  streak_pts := streak;
  total_pts := puzzle_pts + streak_pts;

  INSERT INTO public.guess_platform_answers (
    user_id, question_id, selected_answer, is_correct,
    hints_used, puzzle_points, streak_bonus, points, answered_on
  ) VALUES (
    uid, p_question_id, p_selected_answer, is_ok,
    hints, puzzle_pts, streak_pts, total_pts, today_paris
  )
  RETURNING * INTO inserted;

  stats := public.get_guess_platform_stats();

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

GRANT EXECUTE ON FUNCTION public.paris_today() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_business_day(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.previous_business_day(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.next_business_day(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guess_platform_play(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guess_platform_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guess_platform_review(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_guess_platform_answer(UUID, TEXT, INTEGER) TO authenticated;
