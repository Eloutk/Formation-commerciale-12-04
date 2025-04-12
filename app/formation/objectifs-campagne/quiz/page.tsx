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
    question: "Quel objectif de campagne est généralement utilisé pour faire connaître une marque à un large public ?",
    options: ["Conversion", "Trafic web", "Notoriété", "Génération de leads"],
    correctAnswer: 2,
    explanation:
      "L'objectif de notoriété est spécifiquement conçu pour faire connaître une marque, un produit ou un service auprès d'un public aussi large que possible. Il se situe en début de tunnel de conversion et vise à créer une première impression positive.",
  },
  {
    id: 2,
    question: "Sur TikTok, quel objectif permet de diriger les utilisateurs vers votre site web ?",
    options: ["Video views", "Traffic", "Community interaction", "App promotion"],
    correctAnswer: 1,
    explanation:
      "Sur TikTok, l'objectif 'Traffic' (Trafic) est spécifiquement conçu pour diriger les utilisateurs vers votre site web ou application. Cet objectif est encadré en orange dans l'image, indiquant qu'il fait partie des services proposés.",
  },
  {
    id: 3,
    question: "Quelle plateforme propose l'objectif 'Génération de leads' dans sa catégorie Conversion ?",
    options: ["Spotify", "Snapchat", "TikTok", "LinkedIn"],
    correctAnswer: 3,
    explanation:
      "LinkedIn propose l'objectif 'Génération de leads' dans sa catégorie Conversion. Cet objectif permet de recueillir des informations sur les personnes qui s'intéressent à votre activité professionnelle.",
  },
  {
    id: 4,
    question: "Selon le schéma global des objectifs de campagne, où se situe 'Le trafic web' dans le parcours client ?",
    options: [
      "Avant la notoriété",
      "Entre la notoriété et les leads",
      "Entre les leads et la conversion",
      "Après la conversion",
    ],
    correctAnswer: 1,
    explanation:
      "Dans le schéma global des objectifs de campagne, 'Le trafic web' se situe entre la notoriété et les leads. Il s'agit de la deuxième étape du parcours client, après avoir fait connaître votre marque et avant de collecter des informations de contact.",
  },
  {
    id: 5,
    question:
      "Quel objectif de campagne sur META (Facebook/Instagram) vise à générer des engagements comme des j'aime, des commentaires ou des partages ?",
    options: ["Notoriété", "Trafic", "Interactions", "Prospects"],
    correctAnswer: 2,
    explanation:
      "Sur META (Facebook/Instagram), l'objectif 'Interactions' vise spécifiquement à générer des engagements comme des j'aime, des commentaires ou des partages. Cet objectif est encadré en rouge dans l'image, indiquant qu'il fait partie des services proposés.",
  },
]

export default function ObjectifsCampagneQuiz() {
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
          href="/formation/objectifs-campagne"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Objectifs de Campagne</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur les différents objectifs de campagne par plateforme
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
              <CardDescription>Module: Objectifs de Campagne</CardDescription>
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
                    Vous maîtrisez bien les différents objectifs de campagne et leur utilisation sur chaque plateforme.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les objectifs de campagne spécifiques
                    à chaque plateforme.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/objectifs-campagne">
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

