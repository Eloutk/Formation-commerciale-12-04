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
    question: "Quel est le facteur d'optimisation principal pour une campagne de clics ?",
    options: [
      "CPM (Coût pour mille impressions)",
      "CPC (Coût par clic)",
      "CPL (Coût par lead)",
      "CPA (Coût par acquisition)",
    ],
    correctAnswer: 1,
    explanation:
      "Pour une campagne de clics, le CPC (Coût par clic) est le facteur d'optimisation principal, car l'objectif est de faire cliquer au maximum tout en gardant un \u0153il sur le CTR (taux de clics).",
  },
  {
    id: 2,
    question: "Combien de facteurs d'optimisation doit-on prendre en compte pour une campagne de conversion ?",
    options: ["1 facteur", "2 facteurs", "3 facteurs", "4 facteurs"],
    correctAnswer: 2,
    explanation:
      "Une campagne de conversion n\u00e9cessite de prendre en compte 3 facteurs d'optimisation : CPM, CPA et ROAS. Il est particuli\u00e8rement important de surveiller le CPM et le ROAS.",
  },
  {
    id: 3,
    question: "Quel est le principe fondamental de l'optimisation des campagnes publicitaires ?",
    options: [
      "Augmenter syst\u00e9matiquement le budget",
      "Zoomer et chercher de plus en plus dans le d\u00e9tail au fur et \u00e0 mesure",
      "Changer r\u00e9guli\u00e8rement de plateforme publicitaire",
      "Utiliser uniquement des visuels professionnels",
    ],
    correctAnswer: 1,
    explanation:
      "Le principe fondamental est de zoomer et d'aller chercher de plus en plus dans le d\u00e9tail au fur et \u00e0 mesure des optimisations, en analysant les donn\u00e9es de mani\u00e8re de plus en plus pr\u00e9cise.",
  },
  {
    id: 4,
    question: "Quels \u00e9l\u00e9ments peuvent \u00eatre optimis\u00e9s dans une campagne publicitaire digitale ?",
    options: [
      "Uniquement les visuels et les textes",
      "Uniquement le budget et le ciblage",
      "Uniquement les plateformes et les placements",
      "Tout param\u00e9trage peut \u00eatre optimis\u00e9 (visuels, \u00e2ges, zones, audiences, etc.)",
    ],
    correctAnswer: 3,
    explanation:
      "C'est LA grande force du web : tout param\u00e9trage peut \u00eatre optimis\u00e9, y compris les visuels, genres, \u00e2ges, plateformes, placements, zones, audiences, mots cl\u00e9s, sites web, heures de diffusion, etc.",
  },
  {
    id: 5,
    question: "Pour une campagne de leads, quels sont les facteurs d'optimisation \u00e0 surveiller ?",
    options: ["Uniquement le CPM", "CPM et CPL", "CPC et CTR", "CPM, CPA et ROAS"],
    correctAnswer: 1,
    explanation:
      "Pour une campagne de leads, il faut surveiller 2 facteurs d'optimisation : le CPM (co\u00fbt pour mille impressions) et le CPL (co\u00fbt par lead), afin de faire remplir un maximum de formulaires.",
  },
]

export default function OptimisationsQuiz() {
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
          href="/formation/optimisations"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Optimisations</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur les techniques d'optimisation des campagnes publicitaires
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
              <CardDescription>Module: Optimisations</CardDescription>
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
                    Vous maîtrisez bien les concepts d'optimisation des campagnes publicitaires et les différents
                    facteurs à prendre en compte.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les différentes techniques
                    d'optimisation et leur application.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/optimisations">
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

