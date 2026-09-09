-- Fix urgent : ambiguïté "guesses" dans submit_motus_guess
-- Coller dans Supabase > SQL Editor

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
