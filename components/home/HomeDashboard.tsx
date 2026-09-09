'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthAccess } from '@/components/auth-context'
import { BirthdaysAndFeteCard } from '@/components/home/BirthdaysAndFeteCard'
import {
  DailyQuestionCard,
  type DailyAnswerReview,
  type DailyPlayQuestion,
} from '@/components/home/DailyQuestionCard'
import { GuessPlatformCard } from '@/components/home/GuessPlatformCard'
import { MotusCard } from '@/components/home/MotusCard'
import { WelcomeBanner } from '@/components/home/WelcomeBanner'
import { getCycleDay } from '@/lib/daily-question-cycle'
import { upcomingBirthdays, type BirthdayRow } from '@/lib/home-events'
import { notifyHomePlayAttentionChanged } from '@/lib/home-play-attention'
import type { GuessPlatformStats } from '@/lib/guess-platform'
import supabase from '@/utils/supabase/client'

const EMPTY_GAME_STATS: GuessPlatformStats = {
  current_streak: 0,
  record_streak: 0,
  total_points: 0,
}

export function HomeDashboard() {
  const { userName, authReady } = useAuthAccess()
  const [eventsLoading, setEventsLoading] = useState(true)
  const [questionLoading, setQuestionLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [upcoming, setUpcoming] = useState<ReturnType<typeof upcomingBirthdays>>([])
  const [feteNames, setFeteNames] = useState<string[]>([])
  const [worldDays, setWorldDays] = useState<string[]>([])
  const [question, setQuestion] = useState<DailyPlayQuestion | null>(null)
  const [review, setReview] = useState<DailyAnswerReview | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [gameStats, setGameStats] = useState<GuessPlatformStats>(EMPTY_GAME_STATS)

  const cycleDay = useMemo(() => getCycleDay(), [])
  const today = useMemo(() => new Date(), [])

  const loadEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const month = today.getMonth() + 1
      const day = today.getDate()
      const [{ data: birthdayRows }, { data: feteRow }, worldDayResult] = await Promise.all([
        supabase.from('birthdays').select('name, month, day'),
        supabase.from('fete').select('names').eq('month', month).eq('day', day).maybeSingle(),
        supabase.rpc('get_todays_world_days'),
      ])
      setUpcoming(upcomingBirthdays((birthdayRows || []) as BirthdayRow[], today, 7))
      setFeteNames(Array.isArray(feteRow?.names) ? (feteRow.names as string[]) : [])

      let labels: string[] = []
      if (!worldDayResult.error && Array.isArray(worldDayResult.data)) {
        labels = worldDayResult.data
          .map((row) =>
            row && typeof row === 'object' && 'label' in row ? String(row.label) : ''
          )
          .filter(Boolean)
      } else {
        const { data: fallback } = await supabase
          .from('world_days')
          .select('label')
          .eq('month', month)
          .eq('day', day)
        labels = (fallback || [])
          .map((row) => (row?.label ? String(row.label) : ''))
          .filter(Boolean)
      }
      setWorldDays(labels)
    } catch {
      setUpcoming([])
      setFeteNames([])
      setWorldDays([])
    } finally {
      setEventsLoading(false)
    }
  }, [today])

  const loadGameStats = useCallback(async () => {
    try {
      // Points = somme des 3 jeux (indépendants). Un seul jeu suffit pour gagner ses pts.
      const [dailyRes, guessRes, motusRes, statsRes] = await Promise.all([
        supabase.from('daily_question_answers').select('points'),
        supabase.from('guess_platform_answers').select('points'),
        supabase.from('motus_answers').select('points'),
        supabase.rpc('get_home_gamification_stats'),
      ])

      const sumPoints = (
        rows: { points?: number | null }[] | null,
        fallbackPerRow: number
      ) =>
        (rows || []).reduce((acc, row) => {
          const value = row.points
          return acc + (typeof value === 'number' ? value : fallbackPerRow)
        }, 0)

      const dailyPts = dailyRes.error
        ? 0
        : sumPoints(dailyRes.data as { points?: number | null }[] | null, 1)
      const guessPts = guessRes.error
        ? 0
        : sumPoints(guessRes.data as { points?: number | null }[] | null, 0)
      const motusPts = motusRes.error
        ? 0
        : sumPoints(motusRes.data as { points?: number | null }[] | null, 0)

      const rpc =
        !statsRes.error && statsRes.data && typeof statsRes.data === 'object'
          ? (statsRes.data as GuessPlatformStats)
          : null

      const tablesReadable =
        !dailyRes.error && !guessRes.error && !motusRes.error
      const totalPoints = tablesReadable
        ? dailyPts + guessPts + motusPts
        : rpc && typeof rpc.total_points === 'number'
          ? Number(rpc.total_points)
          : dailyPts + guessPts + motusPts

      setGameStats({
        total_points: totalPoints,
        daily_points: dailyPts,
        guess_points: guessPts,
        motus_points: motusPts,
        current_streak: Number(rpc?.current_streak || 0),
        record_streak: Number(rpc?.record_streak || 0),
      })
    } catch {
      setGameStats(EMPTY_GAME_STATS)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadQuestion = useCallback(async () => {
    setQuestionLoading(true)
    setQuestionError(null)
    try {
      const { data, error } = await supabase.rpc('get_daily_question_play', {
        p_cycle_day: cycleDay,
      })

      const row = Array.isArray(data) ? data[0] : data
      if (error || !row) {
        setQuestion(null)
        setQuestionError(
          'La question du jour n’est pas encore configurée. Collez le SQL dans Supabase, puis rechargez.'
        )
        return
      }

      const playQuestion = row as DailyPlayQuestion
      setQuestion(playQuestion)

      const { data: reviewData } = await supabase.rpc('get_daily_answer_review', {
        p_question_id: playQuestion.id,
      })
      if (reviewData) {
        const parsed = reviewData as DailyAnswerReview
        setReview(parsed)
        setSelectedIndex(parsed.selected_index)
      }
    } catch {
      setQuestion(null)
      setQuestionError(
        'Impossible de charger la question du jour pour le moment. Réessaie dans un instant.'
      )
    } finally {
      setQuestionLoading(false)
    }
  }, [cycleDay])

  useEffect(() => {
    if (!authReady) return
    void loadEvents()
    void loadQuestion()
    void loadGameStats()
  }, [authReady, loadEvents, loadQuestion, loadGameStats])

  const handleSubmit = async () => {
    if (!question || selectedIndex === null || review) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase.rpc('submit_daily_answer', {
        p_question_id: question.id,
        p_selected_index: selectedIndex,
      })
      if (error || !data) {
        setQuestionError("L'enregistrement de la réponse a échoué. Réessaie.")
        return
      }
      const parsed = data as DailyAnswerReview
      setReview(parsed)
      setSelectedIndex(parsed.selected_index)
      notifyHomePlayAttentionChanged()
      await loadGameStats()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-[calc(100dvh-4rem)] overflow-hidden px-3 py-2 sm:px-4 sm:py-3 md:px-6">
      <div className="mx-auto flex h-full max-w-[1400px] min-h-0 flex-col gap-2">
        <WelcomeBanner
          userName={userName}
          totalPoints={gameStats.total_points}
          currentStreak={gameStats.current_streak}
          statsLoading={statsLoading}
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-rows-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid min-h-0 gap-2 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            <div className="min-h-0">
              <DailyQuestionCard
                question={question}
                review={review}
                selectedIndex={selectedIndex}
                submitting={submitting}
                loading={questionLoading}
                error={questionError}
                onSelect={setSelectedIndex}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="min-h-0">
              <BirthdaysAndFeteCard
                todayNames={feteNames}
                upcoming={upcoming}
                worldDays={worldDays}
                loading={eventsLoading}
              />
            </div>
          </div>

          <div className="grid min-h-0 gap-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
            <div className="min-h-0">
              <GuessPlatformCard onStatsChange={loadGameStats} />
            </div>
            <div className="min-h-0">
              <MotusCard onStatsChange={loadGameStats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
