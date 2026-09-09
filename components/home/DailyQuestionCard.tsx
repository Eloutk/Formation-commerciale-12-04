'use client'

import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { homeCard } from '@/components/home/home-card-styles'
import { cn } from '@/lib/utils'

export type DailyPlayQuestion = {
  id: string
  cycle_day: number
  category: string
  question: string
  options: string[]
}

export type DailyAnswerReview = {
  selected_index: number
  correct_index: number
  is_correct: boolean
  explanation: string
}

type DailyQuestionCardProps = {
  question: DailyPlayQuestion | null
  review: DailyAnswerReview | null
  selectedIndex: number | null
  submitting?: boolean
  loading?: boolean
  error?: string | null
  onSelect: (index: number) => void
  onSubmit: () => void
}

export function DailyQuestionCard({
  question,
  review,
  selectedIndex,
  submitting = false,
  loading = false,
  error = null,
  onSelect,
  onSubmit,
}: DailyQuestionCardProps) {
  const locked = Boolean(review)

  return (
    <Card className={homeCard.root}>
      <CardHeader className={homeCard.header}>
        <div className={homeCard.titleRow}>
          <HelpCircle className={homeCard.titleIcon} />
          <CardTitle className={homeCard.title}>Question du jour</CardTitle>
          {question?.category ? (
            <Badge variant="outline" className={homeCard.badge}>
              {question.category}
            </Badge>
          ) : null}
        </div>
        <p className={homeCard.subtitle}>Pas une évaluation — quiz ludique, sans pression.</p>
      </CardHeader>

      <CardContent className={cn(homeCard.content, 'justify-between')}>
        {loading ? (
          <p className={homeCard.bodyMuted}>Chargement…</p>
        ) : error ? (
          <p className={homeCard.bodyMuted}>{error}</p>
        ) : !question ? (
          <p className={homeCard.bodyMuted}>Question indisponible.</p>
        ) : (
          <>
            <p className={cn(homeCard.body, 'text-sm font-semibold sm:text-[15px]')}>
              {question.question}
            </p>

            <RadioGroup
              value={selectedIndex === null ? undefined : String(selectedIndex)}
              onValueChange={(value) => {
                if (!locked) onSelect(Number.parseInt(value, 10))
              }}
              className="grid min-h-0 flex-1 grid-cols-1 content-stretch gap-2 sm:grid-cols-2"
            >
              {question.options.map((option, index) => {
                const isCorrect = locked && index === review?.correct_index
                const isWrongPick =
                  locked && index === review?.selected_index && index !== review?.correct_index
                return (
                  <div
                    key={option}
                    className={cn(
                      homeCard.option,
                      'h-full min-h-[2.75rem] items-center',
                      isCorrect && 'border-green-500 bg-green-50',
                      isWrongPick && 'border-red-500 bg-red-50'
                    )}
                  >
                    <RadioGroupItem
                      value={String(index)}
                      id={`daily-option-${index}`}
                      disabled={locked}
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    <Label
                      htmlFor={`daily-option-${index}`}
                      className="min-w-0 flex-1 cursor-pointer text-xs font-normal leading-snug sm:text-[13px]"
                    >
                      {option}
                    </Label>
                    {isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" /> : null}
                    {isWrongPick ? <XCircle className="h-4 w-4 shrink-0 text-red-500" /> : null}
                  </div>
                )
              })}
            </RadioGroup>

            {review ? (
              <div className={cn(homeCard.panel, 'border-transparent bg-[#EEEEEE]')}>
                <p className="text-sm font-medium">
                  {review.is_correct ? 'Bonne réponse !' : 'Pas tout à fait.'}
                </p>
                <p className={cn(homeCard.bodyMuted, 'mt-0.5')}>{review.explanation}</p>
              </div>
            ) : (
              <Button
                size="sm"
                className={cn(homeCard.button, 'w-full sm:w-auto')}
                onClick={onSubmit}
                disabled={selectedIndex === null || submitting}
              >
                {submitting ? 'Enregistrement…' : 'Valider'}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
