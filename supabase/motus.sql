-- Mot du jour (Motus maison) — à exécuter dans Supabase SQL Editor
-- Après daily-questions.sql, guess-platform.sql, home-gamification.sql

CREATE TABLE IF NOT EXISTS public.motus_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  word TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT motus_words_word_chk CHECK (
    char_length(word) BETWEEN 5 AND 8
    AND word = upper(word)
    AND word ~ '^[A-Z]+$'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS motus_words_sort_order_uidx
  ON public.motus_words (sort_order);

CREATE INDEX IF NOT EXISTS motus_words_active_sort_idx
  ON public.motus_words (is_active, sort_order);

CREATE TABLE IF NOT EXISTS public.motus_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES public.motus_words(id) ON DELETE CASCADE,
  guesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  solved BOOLEAN NOT NULL DEFAULT false,
  attempts SMALLINT NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 6),
  points SMALLINT NOT NULL DEFAULT 0 CHECK (points >= 0),
  answered_on DATE NOT NULL DEFAULT (NOW() AT TIME ZONE 'Europe/Paris')::date,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT motus_answers_user_word_uidx UNIQUE (user_id, word_id),
  CONSTRAINT motus_answers_user_day_uidx UNIQUE (user_id, answered_on),
  CONSTRAINT motus_answers_guesses_array_chk CHECK (jsonb_typeof(guesses) = 'array')
);

CREATE INDEX IF NOT EXISTS motus_answers_user_on_idx
  ON public.motus_answers (user_id, answered_on DESC);

ALTER TABLE public.motus_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motus_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage motus words" ON public.motus_words;
CREATE POLICY "Admins manage motus words"
  ON public.motus_words FOR ALL TO authenticated
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

DROP POLICY IF EXISTS "Users select own motus answers" ON public.motus_answers;
CREATE POLICY "Users select own motus answers"
  ON public.motus_answers FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own motus answers" ON public.motus_answers;
CREATE POLICY "Users insert own motus answers"
  ON public.motus_answers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own motus answers" ON public.motus_answers;
CREATE POLICY "Users update own motus answers"
  ON public.motus_answers FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Évaluation type Wordle / Motus
CREATE OR REPLACE FUNCTION public.motus_evaluate_guess(p_solution TEXT, p_guess TEXT)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  sol TEXT := upper(p_solution);
  guess TEXT := upper(p_guess);
  n INTEGER := char_length(sol);
  i INTEGER;
  j INTEGER;
  statuses TEXT[] := ARRAY[]::TEXT[];
  sol_letters TEXT[] := ARRAY[]::TEXT[];
  guess_letters TEXT[] := ARRAY[]::TEXT[];
  used BOOLEAN[] := ARRAY[]::BOOLEAN[];
  tiles JSONB := '[]'::jsonb;
BEGIN
  IF char_length(guess) <> n THEN
    RAISE EXCEPTION 'Longueur invalide';
  END IF;

  FOR i IN 1 .. n LOOP
    sol_letters := array_append(sol_letters, substr(sol, i, 1));
    guess_letters := array_append(guess_letters, substr(guess, i, 1));
    statuses := array_append(statuses, 'absent');
    used := array_append(used, false);
  END LOOP;

  -- Verts
  FOR i IN 1 .. n LOOP
    IF guess_letters[i] = sol_letters[i] THEN
      statuses[i] := 'correct';
      used[i] := true;
    END IF;
  END LOOP;

  -- Jaunes
  FOR i IN 1 .. n LOOP
    IF statuses[i] = 'correct' THEN
      CONTINUE;
    END IF;
    FOR j IN 1 .. n LOOP
      IF NOT used[j] AND guess_letters[i] = sol_letters[j] THEN
        statuses[i] := 'present';
        used[j] := true;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;

  FOR i IN 1 .. n LOOP
    tiles := tiles || jsonb_build_array(
      jsonb_build_object('letter', guess_letters[i], 'status', statuses[i])
    );
  END LOOP;

  RETURN tiles;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_motus_play(p_cycle_day INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  n INTEGER;
  pick INTEGER;
  w public.motus_words%ROWTYPE;
  ans public.motus_answers%ROWTYPE;
  today_paris DATE := (NOW() AT TIME ZONE 'Europe/Paris')::date;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT COUNT(*)::int INTO n FROM public.motus_words WHERE is_active = true;
  IF n = 0 THEN
    RETURN jsonb_build_object('question', NULL);
  END IF;

  pick := ((GREATEST(COALESCE(p_cycle_day, 1), 1) - 1) % n) + 1;

  SELECT * INTO w
  FROM public.motus_words
  WHERE is_active = true
  ORDER BY sort_order
  OFFSET pick - 1
  LIMIT 1;

  SELECT * INTO ans
  FROM public.motus_answers
  WHERE user_id = uid AND word_id = w.id;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'question', jsonb_build_object(
        'id', w.id,
        'length', char_length(w.word),
        'first_letter', substr(w.word, 1, 1),
        'max_attempts', 6
      ),
      'progress', jsonb_build_object(
        'guesses', ans.guesses,
        'solved', ans.solved,
        'attempts', ans.attempts,
        'finished', ans.finished_at IS NOT NULL,
        'points', ans.points,
        'word', CASE WHEN ans.finished_at IS NOT NULL THEN w.word ELSE NULL END
      )
    );
  END IF;

  -- Aussi chercher une partie du jour (autre word_id rare)
  SELECT * INTO ans
  FROM public.motus_answers
  WHERE user_id = uid AND answered_on = today_paris;

  IF FOUND THEN
    SELECT * INTO w FROM public.motus_words WHERE id = ans.word_id;
    RETURN jsonb_build_object(
      'question', jsonb_build_object(
        'id', w.id,
        'length', char_length(w.word),
        'first_letter', substr(w.word, 1, 1),
        'max_attempts', 6
      ),
      'progress', jsonb_build_object(
        'guesses', ans.guesses,
        'solved', ans.solved,
        'attempts', ans.attempts,
        'finished', ans.finished_at IS NOT NULL,
        'points', ans.points,
        'word', CASE WHEN ans.finished_at IS NOT NULL THEN w.word ELSE NULL END
      )
    );
  END IF;

  RETURN jsonb_build_object(
    'question', jsonb_build_object(
      'id', w.id,
      'length', char_length(w.word),
      'first_letter', substr(w.word, 1, 1),
      'max_attempts', 6
    ),
    'progress', NULL
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_motus_guess(
  p_word_id UUID,
  p_guess TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  today_paris DATE := (NOW() AT TIME ZONE 'Europe/Paris')::date;
  w public.motus_words%ROWTYPE;
  ans public.motus_answers%ROWTYPE;
  guess TEXT := upper(trim(p_guess));
  tiles JSONB;
  new_guesses JSONB;
  is_solved BOOLEAN;
  is_finished BOOLEAN;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT * INTO w FROM public.motus_words WHERE id = p_word_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mot introuvable';
  END IF;

  IF guess !~ '^[A-Z]+$' OR char_length(guess) <> char_length(w.word) THEN
    RAISE EXCEPTION 'Proposition invalide';
  END IF;

  IF substr(guess, 1, 1) <> substr(w.word, 1, 1) THEN
    RAISE EXCEPTION 'Le mot doit commencer par %', substr(w.word, 1, 1);
  END IF;

  SELECT * INTO ans
  FROM public.motus_answers
  WHERE user_id = uid AND word_id = w.id;

  IF FOUND AND ans.finished_at IS NOT NULL THEN
    tiles := public.motus_evaluate_guess(w.word, guess);
    RETURN jsonb_build_object(
      'already_finished', true,
      'tiles', tiles,
      'guesses', ans.guesses,
      'solved', ans.solved,
      'attempts', ans.attempts,
      'finished', true,
      'points', ans.points,
      'word', w.word
    );
  END IF;

  IF NOT FOUND THEN
    IF EXISTS (
      SELECT 1 FROM public.motus_answers
      WHERE user_id = uid AND answered_on = today_paris
    ) THEN
      RAISE EXCEPTION 'Tu as déjà joué au Mot du jour aujourd''hui';
    END IF;

    INSERT INTO public.motus_answers (user_id, word_id, guesses, solved, attempts, points, answered_on)
    VALUES (uid, w.id, '[]'::jsonb, false, 0, 0, today_paris)
    RETURNING * INTO ans;
  END IF;

  IF ans.attempts >= 6 THEN
    RAISE EXCEPTION 'Plus de tentatives';
  END IF;

  tiles := public.motus_evaluate_guess(w.word, guess);
  new_guesses := COALESCE(ans.guesses, '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object('guess', guess, 'tiles', tiles)
  );
  is_solved := (guess = w.word);
  is_finished := is_solved OR (ans.attempts + 1 >= 6);

  UPDATE public.motus_answers AS ma
  SET guesses = new_guesses,
      attempts = ans.attempts + 1,
      solved = is_solved,
      points = CASE WHEN is_finished THEN 1 ELSE ma.points END,
      finished_at = CASE WHEN is_finished THEN NOW() ELSE ma.finished_at END
  WHERE ma.id = ans.id
  RETURNING * INTO ans;

  RETURN jsonb_build_object(
    'already_finished', false,
    'tiles', tiles,
    'guesses', ans.guesses,
    'solved', ans.solved,
    'attempts', ans.attempts,
    'finished', is_finished,
    'points', ans.points,
    'word', CASE WHEN is_finished THEN w.word ELSE NULL END
  );
END;
$$;

-- Patch stats globales pour inclure Motus
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

  SELECT COALESCE(SUM(a.points), 0)::int
  INTO daily_pts
  FROM public.daily_question_answers a
  WHERE a.user_id = uid;

  SELECT COALESCE(SUM(a.points), 0)::int
  INTO guess_pts
  FROM public.guess_platform_answers a
  WHERE a.user_id = uid;

  SELECT COALESCE(SUM(a.points), 0)::int
  INTO motus_pts
  FROM public.motus_answers a
  WHERE a.user_id = uid;

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

GRANT EXECUTE ON FUNCTION public.motus_evaluate_guess(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_motus_play(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_motus_guess(UUID, TEXT) TO authenticated;

-- Seed minimal de secours (30 mots).
-- Pour la liste complète 200 mots (1/2 domaine) : exécuter aussi supabase/motus-seed-200.sql
TRUNCATE public.motus_answers, public.motus_words RESTART IDENTITY CASCADE;

INSERT INTO public.motus_words (sort_order, word) VALUES
(1, 'MEDIA'),
(2, 'MAISON'),
(3, 'BUDGET'),
(4, 'SOLEIL'),
(5, 'CIBLAGE'),
(6, 'VOYAGE'),
(7, 'CAMPAGNE'),
(8, 'PLANTE'),
(9, 'ANNONCE'),
(10, 'CAHIER'),
(11, 'AUDIENCE'),
(12, 'ORANGE'),
(13, 'CLIQUE'),
(14, 'FLEURS'),
(15, 'AFFICHE'),
(16, 'CHEMIN'),
(17, 'FORMAT'),
(18, 'NUAGES'),
(19, 'PIXEL'),
(20, 'BUREAU'),
(21, 'COOKIE'),
(22, 'JARDIN'),
(23, 'FACEBOOK'),
(24, 'ETOILE'),
(25, 'GOOGLE'),
(26, 'MARCHE'),
(27, 'YOUTUBE'),
(28, 'LIVRES'),
(29, 'TIKTOK'),
(30, 'PORTES');
