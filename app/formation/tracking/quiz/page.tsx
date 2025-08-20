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
    question: "Combien d'actions minimum sont nécessaires sur le pixel/API pour pouvoir partir en conversion ?",
    options: ["10 actions", "25 actions", "50 actions", "100 actions"],
    correctAnswer: 2,
    explanation:
      "Il faut minimum 50 actions sur le pixel/API afin de pouvoir partir en conversion. Le pixel/API collectent les données du site, pas seulement liées à notre campagne, ce qui facilite l'atteinte de ce minimum.",
  },
  {
    id: 2,
    question: "Quel est le délai d'attribution actuel après un clic sur une publicité ?",
    options: ["3 jours après un clic", "7 jours après un clic", "14 jours après un clic", "28 jours après un clic"],
    correctAnswer: 1,
    explanation:
      "Actuellement, le délai d'attribution est de 7 jours après un clic, alors qu'il était de 28 jours auparavant. Cela signifie que si un utilisateur clique sur une publicité et effectue un achat dans les 7 jours, la conversion sera attribuée à la campagne.",
  },
  {
    id: 3,
    question: "Quel est le délai d'attribution actuel après une vue d'une publicité (sans clic) ?",
    options: [
      "Aucun délai (pas d'attribution)",
      "1 jour après une vue",
      "3 jours après une vue",
      "7 jours après une vue",
    ],
    correctAnswer: 0,
    explanation:
      "Actuellement, il n'y a plus d'attribution après une simple vue d'une publicité sans clic. Auparavant, le délai était de 7 jours après une vue.",
  },
  {
    id: 4,
    question:
      "Pourquoi les statistiques de campagne sur les réseaux sociaux (Facebook, Instagram, TikTok) ne sont-elles pas minorées malgré le RGPD ?",
    options: [
      "Parce que ces plateformes sont exemptées du RGPD",
      "Parce que les utilisateurs acceptent les CGU permettant la collecte de données à la création de leur compte",
      "Parce que ces plateformes utilisent uniquement des données anonymisées",
      "Parce que le tracking est désactivé par défaut sur ces plateformes",
    ],
    correctAnswer: 1,
    explanation:
      "À la création de leurs comptes, les utilisateurs des plateformes (Facebook, Instagram, Snapchat, TikTok...) acceptent les CGU. Ce consentement permet aux plateformes de collecter des données, ce qui explique pourquoi les statistiques de campagne ne sont pas minorées malgré le RGPD.",
  },
  {
    id: 5,
    question: "Quelle est la particularité des statistiques sur Google & YouTube par rapport aux autres plateformes ?",
    options: [
      "Elles sont toujours plus précises que les autres plateformes",
      "Elles ne sont pas soumises aux délais d'attribution",
      "Elles comportent souvent une grande part 'd'inconnus' car beaucoup d'utilisateurs ne sont pas connectés",
      "Elles ne collectent pas de données démographiques",
    ],
    correctAnswer: 2,
    explanation:
      "Pour Google & YouTube, c'est plus compliqué car beaucoup d'utilisateurs ne sont pas connectés à leur compte lors de leur utilisation de ces plateformes. C'est pour cela qu'il y a, souvent, une grande part « d'inconnus » sur les rapports.",
  },
  {
    id: 6,
    question:
      "Quelles conditions sont nécessaires pour qu'un pixel puisse tracer le comportement d'un utilisateur sur un site ?",
    options: [
      "Uniquement que l'utilisateur accepte les cookies",
      "Que l'utilisateur accepte les cookies et n'ait pas de bloqueur de pub",
      "Que l'utilisateur accepte les cookies, n'ait pas de bloqueur de pub, ne soit pas en navigation privée et n'ait pas bloqué le tracking via Apple",
      "Aucune condition particulière, le pixel fonctionne dans tous les cas",
    ],
    correctAnswer: 2,
    explanation:
      "Pour tracer un comportement sur un site avec un Pixel, il faut que l'utilisateur accepte tous les cookies, n'ait pas de bloqueur de pub, ne soit pas en navigation privée, et n'ait pas bloqué le tracking directement via Apple.",
  },
  {
    id: 7,
    question:
      "Quelle est la principale différence entre le pixel/API et les balises Google en termes de collecte de données ?",
    options: [
      "Le pixel/API ne collecte que les données liées à la campagne, tandis que les balises Google collectent toutes les données du site",
      "Les balises Google collectent des données uniquement pendant la diffusion de la campagne, tandis que le pixel/API collecte toutes les données du site",
      "Les balises Google ne peuvent pas être utilisées pour le tracking de conversion",
      "Il n'y a aucune différence significative entre les deux méthodes de tracking",
    ],
    correctAnswer: 1,
    explanation:
      "Le gestionnaire de publicités Google collectera des données dès lors que la campagne est en diffusion et pas avant (grande différence avec le pixel/API). Ces balises collecteront les données de la campagne seulement, et non tous les flux du site/LP du client.",
  },
]

export default function TrackingQuiz() {
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
          href="/formation/tracking"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Tracking</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur les mécanismes de tracking publicitaire
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
              <CardDescription>Module: Tracking</CardDescription>
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
                    Vous maîtrisez bien les concepts de tracking publicitaire et les spécificités des différentes
                    méthodes.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les mécanismes de tracking et leur
                    importance dans les campagnes publicitaires.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/tracking">
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

