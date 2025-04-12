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
    question: "Quel format d'image est recommandé pour les posts sponsorisés LinkedIn ?",
    options: [
      "Carré (1:1), 1080 x 1080 pixels",
      "Rectangulaire (1.91:1), 1200 x 627 pixels",
      "Vertical (4:5), 1080 x 1350 pixels",
      "Panoramique (2.4:1), in 1200 x 500 pixels",
    ],
    correctAnswer: 1,
    explanation:
      "LinkedIn recommande un format rectangulaire avec un ratio de 1.91:1 et une taille optimale de 1200 x 627 pixels pour les posts sponsorisés. Ce format s'affiche correctement à la fois sur mobile et desktop.",
  },
  {
    id: 2,
    question: "Quelle est la durée maximale d'une annonce Bumper sur YouTube ?",
    options: ["3 secondes", "6 secondes", "10 secondes", "15 secondes"],
    correctAnswer: 1,
    explanation:
      "Les annonces Bumper sur YouTube sont limitées à 6 secondes maximum. Ce sont des formats courts et non ignorables, idéaux pour transmettre un message concis et mémorable.",
  },
  {
    id: 3,
    question: "Lequel de ces formats n'est PAS un format publicitaire disponible sur TikTok ?",
    options: ["In-Feed Ads", "TopView", "Carousel Ads", "Branded Hashtag Challenge"],
    correctAnswer: 2,
    explanation:
      "Bien que les 'Carousel Ads' (annonces carrousel) soient disponibles sur d'autres plateformes comme Meta, ce format n'est pas standard dans l'offre publicitaire TikTok. TikTok propose principalement des formats vidéo comme In-Feed, TopView, et des formats engageants comme les Branded Hashtag Challenges.",
  },
  {
    id: 4,
    question: "Quel est l'un des principaux avantages du marketing par SMS mentionné dans le cours ?",
    options: [
      "Coût très bas comparé aux autres médias",
      "Possibilité d'envoyer des messages visuels riches",
      "Taux d'ouverture très élevé (environ 98%)",
      "Absence de réglementation stricte",
    ],
    correctAnswer: 2,
    explanation:
      "L'un des principaux avantages du marketing par SMS est son taux d'ouverture exceptionnellement élevé, atteignant environ 98%. La plupart des SMS sont lus dans les 3 minutes suivant leur réception, ce qui en fait un canal très efficace pour les messages urgents ou à impact immédiat.",
  },
]

export default function PlateformesPlacementQuiz() {
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
          href="/formation/plateformes-placement"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Plateformes et Placement</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur les différentes plateformes publicitaires
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
              <CardDescription>Module: Plateformes et Placement</CardDescription>
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
                  <p>Vous maîtrisez bien les spécifications des différentes plateformes publicitaires.</p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les spécificités de chaque plateforme.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/plateformes-placement">
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

