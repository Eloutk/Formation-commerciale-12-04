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
    question: "Quelle est la première étape du tunnel de conversion présentée dans le schéma ?",
    options: ["Convertir", "Attirer", "Mettre en place", "Conclure"],
    correctAnswer: 2,
    explanation:
      "Avant même de commencer à attirer des visiteurs, l'étape 'Mettre en place' est cruciale. Elle comprend l'audit de la concurrence, la définition de la stratégie digitale, la mise en place des outils d'analyse, et l'identification des cibles.",
  },
  {
    id: 2,
    question: "Quel est l'objectif principal de la phase 'Attirer' dans le tunnel de conversion ?",
    options: [
      "Transformer les prospects en clients",
      "Générer de la notoriété et sensibiliser l'audience",
      "Analyser le comportement des utilisateurs",
      "Optimiser le taux de conversion",
    ],
    correctAnswer: 1,
    explanation:
      "La phase 'Attirer' (Étape 1) vise principalement à générer de la notoriété et à sensibiliser votre audience. L'objectif est de transformer des internautes en visiteurs de votre site ou application.",
  },
  {
    id: 3,
    question: "Dans quelle phase du tunnel de conversion les visiteurs deviennent-ils des prospects ?",
    options: [
      "Phase 1 : Sensibilisation/Notoriété",
      "Phase 2 : Considération/Trafic",
      "Phase 3 : Conversions",
      "Phase préliminaire : Mise en place",
    ],
    correctAnswer: 1,
    explanation:
      "C'est dans la Phase 2 : Considération/Trafic (étape 'Convertir') que les visiteurs se transforment en prospects qualifiés. Cette phase se concentre sur l'engagement et l'intérêt actif pour vos produits ou services.",
  },
  {
    id: 4,
    question: "Quel élément n'est PAS inclus dans l'étape 'Mettre en place' du tunnel de conversion ?",
    options: ["Audit concurrence", "Définir Cible(s)", "Conversion des prospects en clients", "Objectifs & KPI"],
    correctAnswer: 2,
    explanation:
      "La 'Conversion des prospects en clients' n'est pas incluse dans l'étape 'Mettre en place'. Cette conversion se produit dans la dernière étape du tunnel (Conclure - Phase 3 : Conversions).",
  },
  {
    id: 5,
    question: "Quelle phase est associée à l'expression '+ de business' dans le schéma du tunnel de conversion ?",
    options: [
      "Phase 1 : Sensibilisation/Notoriété",
      "Phase 2 : Considération/Trafic",
      "Phase 3 : Conversions",
      "Phase préliminaire",
    ],
    correctAnswer: 2,
    explanation:
      "L'expression '+ de business' est associée à la Phase 3 : Conversions (étape 'Conclure'). C'est à cette étape que les prospects deviennent des clients, générant ainsi du chiffre d'affaires pour l'entreprise.",
  },
]

export default function TunnelConversionQuiz() {
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
          href="/formation/tunnel-conversion"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Tunnel de Conversion</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur les différentes étapes du tunnel de conversion
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
              <CardDescription>Module: Tunnel de Conversion</CardDescription>
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
                  <p>Vous maîtrisez bien les concepts du tunnel de conversion et ses différentes étapes.</p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les différentes phases du tunnel de
                    conversion.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/tunnel-conversion">
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

