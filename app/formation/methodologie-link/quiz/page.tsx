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
    question: "Quelles sont les 4 étapes de la Méthodologie Link ?",
    options: [
      "Analyse, Stratégie, Exécution, Évaluation",
      "Création, Mise en ligne, Optimisation, Reporting",
      "Planification, Production, Publication, Performance",
      "Recherche, Développement, Test, Déploiement",
    ],
    correctAnswer: 1,
    explanation:
      "La Méthodologie Link comprend 4 étapes clés : Création (des visuels et vidéos), Mise en ligne (calibrage des campagnes), Optimisation (ajustements basés sur les résultats) et Reporting (suivi des performances).",
  },
  {
    id: 2,
    question: "Quelle est la principale responsabilité d'un Community Manager ?",
    options: [
      "Gestion des campagnes publicitaires payantes",
      "Optimisation du référencement SEO",
      "Développement et animation des réseaux sociaux",
      "Analyse technique du trafic web",
    ],
    correctAnswer: 2,
    explanation:
      "Le Community Manager (CM) est principalement chargé du développement et de l'animation des réseaux sociaux, incluant la création de contenu, l'interaction avec la communauté et la modération.",
  },
  {
    id: 3,
    question: "Quels sont les principaux domaines d'expertise d'un Traffic Manager ?",
    options: [
      "Création de contenus et modération des commentaires",
      "Leviers payants, SEO, SEA et analyse de performance",
      "Design graphique et production vidéo",
      "Relations publiques et gestion de crise",
    ],
    correctAnswer: 1,
    explanation:
      "Le Traffic Manager (TM) est responsable de la stratégie d'acquisition sur le web, incluant les leviers payants, l'optimisation du référencement (SEO), les campagnes de publicité (SEA) et l'analyse de performance.",
  },
  {
    id: 4,
    question:
      "Pendant quelle phase de la Méthodologie Link les campagnes sont-elles ajustées en fonction des résultats ?",
    options: ["Création", "Mise en ligne", "Optimisation", "Reporting"],
    correctAnswer: 2,
    explanation:
      "L'optimisation est la phase où les campagnes sont ajustées et améliorées en fonction des résultats quotidiens, permettant d'augmenter l'efficacité des actions marketing.",
  },
]

export default function MethodologieLinkQuiz() {
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
        title: "S\u00e9lectionnez une r\u00e9ponse",
        description: "Veuillez s\u00e9lectionner une r\u00e9ponse avant de continuer.",
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
          href="/formation/methodologie-link"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - M\u00e9thodologie Link</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur la M\u00e9thodologie Link et les r\u00f4les CM/TM
        </p>

        {!quizCompleted ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Question {currentQuestionIndex + 1} sur {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100)}%
                  compl\u00e9t\u00e9
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
                  <Button onClick={handleCheckAnswer}>V\u00e9rifier ma r\u00e9ponse</Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {isLastQuestion ? "Voir les r\u00e9sultats" : "Question suivante"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>R\u00e9sultats du quiz</CardTitle>
              <CardDescription>Module: M\u00e9thodologie Link</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex items-center justify-center rounded-full p-2 bg-muted mb-4">
                <div className="text-3xl font-bold">{calculateScore()}%</div>
              </div>
              <p className="mb-2">
                Vous avez obtenu <span className="font-bold">{correctAnswers}</span> bonnes r\u00e9ponses sur{" "}
                <span className="font-bold">{questions.length}</span> questions.
              </p>

              {calculateScore() >= 70 ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-md mt-4">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">F\u00e9licitations !</p>
                  <p>Vous ma\u00eetrisez bien les concepts de la M\u00e9thodologie Link.</p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>Nous vous sugg\u00e9rons de revoir le module pour mieux comprendre les concepts.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/methodologie-link">
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

