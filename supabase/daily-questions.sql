-- À exécuter dans Supabase > SQL Editor
-- Ordre : 1) ce fichier  2) supabase/daily-questions-seed.sql  3) supabase/fete.sql (indépendant)
-- Questions techniques du jour + réponses utilisateurs.
-- Le seed TRUNCATE les questions et les réponses : à lancer une fois (ou en connaissance de cause).

CREATE TABLE IF NOT EXISTS public.daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_day SMALLINT NOT NULL CHECK (cycle_day BETWEEN 1 AND 365),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL CHECK (cardinality(options) BETWEEN 3 AND 4),
  correct_index SMALLINT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_questions_correct_index_chk
    CHECK (correct_index >= 0 AND correct_index < cardinality(options))
);

CREATE UNIQUE INDEX IF NOT EXISTS daily_questions_cycle_day_uidx
  ON public.daily_questions (cycle_day);

CREATE INDEX IF NOT EXISTS daily_questions_category_idx
  ON public.daily_questions (category);

CREATE TABLE IF NOT EXISTS public.daily_question_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.daily_questions(id) ON DELETE CASCADE,
  cycle_day SMALLINT NOT NULL CHECK (cycle_day BETWEEN 1 AND 365),
  selected_index SMALLINT NOT NULL CHECK (selected_index >= 0),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT daily_question_answers_user_question_uidx UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS daily_question_answers_user_answered_idx
  ON public.daily_question_answers (user_id, answered_at DESC);

CREATE INDEX IF NOT EXISTS daily_question_answers_user_cycle_idx
  ON public.daily_question_answers (user_id, cycle_day);

ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_question_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage daily_questions" ON public.daily_questions;
CREATE POLICY "Admins can manage daily_questions"
  ON public.daily_questions
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

DROP POLICY IF EXISTS "Users select own daily answers" ON public.daily_question_answers;
CREATE POLICY "Users select own daily answers"
  ON public.daily_question_answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own daily answers" ON public.daily_question_answers;
CREATE POLICY "Users insert own daily answers"
  ON public.daily_question_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Vue de jeu : pas de bonne réponse ni d'explication (lecture authentifiée).
DROP VIEW IF EXISTS public.daily_questions_play;
CREATE VIEW public.daily_questions_play
WITH (security_invoker = false) AS
SELECT id, cycle_day, category, question, options
FROM public.daily_questions;

GRANT SELECT ON public.daily_questions_play TO authenticated;

CREATE OR REPLACE FUNCTION public.get_daily_question_play(p_cycle_day INTEGER)
RETURNS TABLE (
  id UUID,
  cycle_day SMALLINT,
  category TEXT,
  question TEXT,
  options TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT q.id, q.cycle_day, q.category, q.question, q.options
  FROM public.daily_questions q
  WHERE q.cycle_day = p_cycle_day
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_daily_question_play(INTEGER) TO authenticated;

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
      'options', to_jsonb(q.options)
    );
  END IF;

  is_ok := (p_selected_index = q.correct_index);

  INSERT INTO public.daily_question_answers (
    user_id, question_id, cycle_day, selected_index, is_correct
  ) VALUES (
    uid, p_question_id, q.cycle_day, p_selected_index, is_ok
  )
  RETURNING * INTO existing;

  RETURN jsonb_build_object(
    'already_answered', false,
    'selected_index', existing.selected_index,
    'correct_index', q.correct_index,
    'is_correct', existing.is_correct,
    'explanation', q.explanation,
    'options', to_jsonb(q.options)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_daily_answer(UUID, INTEGER) TO authenticated;

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
  WHERE id = p_question_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'already_answered', true,
    'selected_index', existing.selected_index,
    'correct_index', q.correct_index,
    'is_correct', existing.is_correct,
    'explanation', q.explanation,
    'options', to_jsonb(q.options)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_daily_answer_review(UUID) TO authenticated;
