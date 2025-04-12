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
    question: "Quelle est la seule plateforme qui permet de cibler des mineurs (sans ciblage avancé) ?",
    options: ["TikTok", "Snapchat", "META (Facebook/Instagram)", "Spotify"],
    correctAnswer: 1,
    explanation:
      "Snapchat est la seule plateforme qui permet de cibler des mineurs sans ciblage avancé. C'est une spécificité importante à connaître pour les campagnes visant un public jeune.",
  },
  {
    id: 2,
    question: "Sur LinkedIn, sur quoi se base la plateforme pour déterminer l'âge des utilisateurs ?",
    options: [
      "L'âge déclaré par l'utilisateur",
      "Le dernier diplôme obtenu",
      "L'expérience professionnelle",
      "La date de création du compte",
    ],
    correctAnswer: 1,
    explanation:
      "LinkedIn se base sur le dernier diplôme obtenu et non sur le déclaratif de l'internaute pour déterminer l'âge. C'est pourquoi le ciblage par âge n'est pas pertinent sur cette plateforme.",
  },
  {
    id: 3,
    question: "Quelle est la particularité du ciblage sur Google Search ?",
    options: [
      "Il n'y a pas de ciblage, on achète des mots clés",
      "On ne peut cibler que par zone géographique",
      "Le ciblage est limité aux centres d'intérêt",
      "On ne peut cibler que les utilisateurs connectés à un compte Google",
    ],
    correctAnswer: 0,
    explanation:
      "Google Search a un fonctionnement particulier : il n'y a pas de ciblage à proprement parler, nous achetons certains mots clés que les utilisateurs recherchent.",
  },
  {
    id: 4,
    question: "Quelles sont les catégories spéciales sur META qui nécessitent une diffusion sans ciblage ?",
    options: [
      "Mode, beauté et alimentation",
      "Sport, musique et cinéma",
      "Crédit, emploi, logement et enjeux sociaux/politiques",
      "Technologie, éducation et voyage",
    ],
    correctAnswer: 2,
    explanation:
      "Sur META, les catégories spéciales comme le crédit, l'emploi, le logement et les enjeux sociaux/politiques nécessitent une diffusion sans ciblage, pour les 18/65+, dans un rayon de 50km minimum.",
  },
  {
    id: 5,
    question: "Quelle action est recommandée avant de lancer une campagne sur Spotify ?",
    options: [
      "Cibler uniquement par communauté de fans",
      "Réaliser une étude de potentiel pour vérifier le nombre de comptes disponibles",
      "Limiter le ciblage aux grandes villes uniquement",
      "Utiliser exclusivement le ciblage par tranche d'âge",
    ],
    correctAnswer: 1,
    explanation:
      "Pour Spotify, il est INCONTOURNABLE de réaliser une étude de potentiel. L'équipe doit vérifier le nombre de comptes disponibles et vous donner le nombre d'impressions maximum que nous pouvons réaliser sur la zone demandée.",
  },
  {
    id: 6,
    question: "Quel est le minimum de dépense quotidienne pour une campagne TikTok ?",
    options: [
      "20 € par jour d'achat d'espace",
      "10 € par jour d'achat d'espace",
      "50 € par jour et par ciblage d'achat d'espace",
      "250 € d'achat d'espace",
    ],
    correctAnswer: 2,
    explanation:
      "TikTok exige un minimum de dépense de 50 € par jour et par ciblage d'achat d'espace, ce qui équivaut à 50 € PDV par jour et par ciblage.",
  },
  {
    id: 7,
    question: "Quelle particularité de ciblage géographique est propre à Spotify ?",
    options: [
      "Le ciblage par rayon n'est pas disponible",
      "On ne peut cibler que les grandes villes",
      "Le ciblage par département n'est pas disponible",
      "On ne peut cibler que par pays",
    ],
    correctAnswer: 0,
    explanation:
      "Sur Spotify, le ciblage par rayon n'est pas disponible. On peut cibler par pays, régions, villes ou par codes postaux, mais pas par rayon autour d'un point précis.",
  },
]

export default function CiblageQuiz() {
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
          href="/formation/ciblage"
          className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au module
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz - Ciblage</h1>
        <p className="text-muted-foreground mb-8">
          Testez vos connaissances sur les options de ciblage des différentes plateformes
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
              <CardDescription>Module: Ciblage</CardDescription>
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
                    Vous maîtrisez bien les différentes options de ciblage disponibles sur les plateformes
                    publicitaires.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-md mt-4">
                  <p className="font-medium">Continuez vos efforts !</p>
                  <p>
                    Nous vous suggérons de revoir le module pour mieux comprendre les spécificités de ciblage de chaque
                    plateforme.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/formation/ciblage">
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

