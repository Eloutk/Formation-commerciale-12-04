"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, XCircle, ArrowLeft, Home } from "lucide-react"

// Structure d'une question
interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

// Les questions du quiz
const questions: Question[] = [
  {
    id: 1,
    question: "Quels sont les trois niveaux principaux de l'architecture des campagnes publicitaires ?",
    options: [
      "Budget, Audience, Créatifs",
      "Campagne, Ciblage, Visuels",
      "Objectif, Placement, Conversion",
      "Stratégie, Tactique, Exécution",
    ],
    correctAnswer: 1,
    explanation:
      "L'architecture des campagnes publicitaires suit généralement une structure hiérarchique à trois niveaux : la campagne (niveau supérieur qui définit l'objectif global), le ciblage (niveau intermédiaire qui segmente l'audience) et les visuels (niveau inférieur qui contient les créations publicitaires).",
  },
  {
    id: 2,
    question: "Sur META, quel est un avantage d'utiliser une campagne avec une seule zone géographique ?",
    options: [
      "Possibilité de repiquage local",
      "Répartition équitable du budget entre zones",
      "Être plus puissant sur les enchères (car budget plus élevé)",
      "Paramétrage des campagnes plus rapide",
    ],
    correctAnswer: 2,
    explanation:
      "Un des principaux avantages d'utiliser une campagne avec une seule zone géographique sur META est d'être plus puissant sur les enchères grâce à un budget plus élevé. Le budget se paramètre à l'échelle de la campagne, ce qui permet de concentrer les ressources.",
  },
  {
    id: 3,
    question: "Dans l'architecture de campagne TikTok, où sont définis le budget, la zone et les dates ?",
    options: [
      "Au niveau de la campagne",
      "Au niveau des ensembles de publicités",
      "Au niveau des publicités",
      "Au niveau du compte publicitaire",
    ],
    correctAnswer: 1,
    explanation:
      "Dans l'architecture de campagne TikTok, le budget, la zone géographique et les dates sont définis au niveau des ensembles de publicités (niveau intermédiaire), tandis que les URL de destination sont définies au niveau des publicités.",
  },
  {
    id: 4,
    question: "Quel principe clé est associé à la segmentation du ciblage dans l'architecture des campagnes ?",
    options: [
      "Segmentation du ciblage = Réduction des coûts",
      "Segmentation du ciblage = Simplification de la gestion",
      "Segmentation du ciblage = Optimisations plus poussées",
      "Segmentation du ciblage = Augmentation de la portée",
    ],
    correctAnswer: 2,
    explanation:
      "Le principe clé associé à la segmentation du ciblage est 'Segmentation du ciblage = Optimisations plus poussées'. Plus vous segmentez finement votre ciblage, plus vous pourrez optimiser précisément vos campagnes et adapter vos messages à chaque segment d'audience.",
  },
  {
    id: 5,
    question:
      "Sur META, combien de zones géographiques maximum est-il recommandé de ne pas dépasser dans une campagne avec plusieurs zones ?",
    options: ["3 zones", "5 zones", "10 zones", "15 zones"],
    correctAnswer: 1,
    explanation:
      "Sur META, il est recommandé de ne pas dépasser 5 zones géographiques dans une campagne avec plusieurs zones. Au-delà, l'algorithme se perd et la répartition du budget devient inefficace entre les différentes zones.",
  },
]

export default function ArchitectureCampagnesQuiz() {
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswerSelection = (index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      toast({
        variant: "destructive",
        title: "Sélectionnez une réponse",
        description: "Veuillez sélectionner une réponse avant de continuer.",
      })
      return
    }

    setShowExplanation(true)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1)
    }
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const calculateScore = () => {
    return Math.round((correctAnswers / questions.length) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/formation/architecture-campagnes"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Architecture des Campagnes</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur l'architecture des campagnes publicitaires
        </p>

        {!quizCompleted ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Question {currentQuestionIndex + 1} sur {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100)}% complété
                </span>
              </div>
              <Progress
                value={((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}
                className="h-2"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelection(Number.parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 rounded-md border p-3 ${
                        showExplanation && index === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : showExplanation && index === selectedAnswer
                            ? index !== currentQuestion.correctAnswer
                              ? "border-red-500 bg-red-50"
                              : ""
                            : ""
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showExplanation} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                      {showExplanation && index === currentQuestion.correctAnswer && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {showExplanation && (
                  <div className="mt-6 p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Explication</h4>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!showExplanation ? (
                  <Button onClick={handleCheckAnswer}>Vérifier ma réponse</Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {isLastQuestion ? "Voir les résultats" : "Question suivante"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Résultats du quiz</CardTitle>
              <CardDescription>Module: Architecture des Campagnes</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex items-center justify-center rounded-full p-2 bg-muted mb-4">
                <div className="text-3xl font-bold">{calculateScore()}%</div>
              </div>
              <p className="mb-2">
                Vous avez obtenu <span className="font-bold">{correctAnswers}</span> bonnes réponses sur{" "}
                <span className="font-bold">{questions.length}</span> questions.
              </p>

              {calculateScore() >= 70 ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">Félicitations !</p>
                  <p>
                    Vous maîtrisez bien les concepts d'architecture des campagnes publicitaires sur les différentes
                    plateformes.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les principes d'architecture des
                    campagnes.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/architecture-campagnes">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au module
                </Link>
              </Button>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Accueil
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

