"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Home, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"

interface Question {
  id: number
  question: string
  type: "single" | "multiple"
  options: string[]
  correctAnswers: number[]
}

const examQuestions: Question[] = [
  {
    id: 1,
    question: "Pourquoi l'optimisation des campagnes est-elle essentielle ?",
    type: "single",
    options: ["Garantir un meilleur ROI", "Dépenser rapidement", "Arrêter les campagnes", "Aucune"],
    correctAnswers: [0],
  },
  {
    id: 2,
    question: "Quel outil est utilisé pour préparer les visuels sur Facebook ?",
    type: "single",
    options: ["Photoshop", "Facebook Creative Hub", "Canva", "Google Ads Editor"],
    correctAnswers: [1],
  },
  {
    id: 3,
    question: "Quel est le rôle principal d'un Community Manager ?",
    type: "single",
    options: ["Gérer l'acquisition web", "Optimiser Google Ads", "Animer les réseaux", "Réaliser des rapports"],
    correctAnswers: [2],
  },
  {
    id: 4,
    question: "Le Traffic Manager s'occupe principalement de ?",
    type: "single",
    options: ["Gestion des réseaux", "Leviers payants", "Design des pubs", "Rédaction"],
    correctAnswers: [1],
  },
  {
    id: 5,
    question: "Quels sont les leviers payants gérés par un TM chez Link ?",
    type: "multiple",
    options: ["SEO", "SEA", "Social Ads", "Emailing"],
    correctAnswers: [1, 2],
  },
  {
    id: 6,
    question: "Quel est l'objectif principal d'une campagne sur Snapchat ?",
    type: "multiple",
    options: ["Impressions", "Followers", "Trafic", "Avis clients"],
    correctAnswers: [0, 2],
  },
  {
    id: 7,
    question: "Quelles sont les trois étapes possibles du tunnel de conversion ?",
    type: "multiple",
    options: [
      "Notoriété-interaction-traffic",
      "Notoriété-Clics-Conversion",
      "Impression-Clic-inscription à une newsletter",
    ],
    correctAnswers: [1],
  },
  {
    id: 8,
    question: "Quel est l'inconvénient d'une campagne multi-zones ?",
    type: "multiple",
    options: ["Pas de personnalisation", "Coût plus élevé", "Difficile de suivre", "Budget aléatoire"],
    correctAnswers: [0, 3],
  },
  {
    id: 9,
    question: "Quel est l'objectif principal d'une campagne de notoriété ?",
    type: "single",
    options: ["Augmenter le trafic", "Faire connaître", "Générer des ventes", "Collecter des emails"],
    correctAnswers: [1],
  },
  {
    id: 10,
    question: "Quel KPI est utilisé pour mesurer une conversion ?",
    type: "multiple",
    options: ["CPC", "CPM", "ROAS", "CTR"],
    correctAnswers: [2],
  },
  {
    id: 11,
    question: "Quel type de ciblage utilise des audiences similaires ?",
    type: "multiple",
    options: ["Retargeting", "Lookalike", "Contextuel", "Démographique"],
    correctAnswers: [1],
  },
  {
    id: 12,
    question: "À quoi sert un pixel de tracking ?",
    type: "multiple",
    options: ["Mesurer les impressions", "Suivre les actions sur le site", "Créer des visuels", "Calculer le budget"],
    correctAnswers: [1],
  },
  {
    id: 13,
    question: "Quelle est la principale limite du tracking ?",
    type: "multiple",
    options: ["Manque de données", "RGPD/Cookies", "Coût des outils", "Complexité mise en place"],
    correctAnswers: [1],
  },
  {
    id: 14,
    question: "Quels critères influencent le score qualité ?",
    type: "multiple",
    options: ["Pertinence ciblage", "Budget", "Optimisation enchères", "Qualité annonces"],
    correctAnswers: [0, 2, 3],
  },
  {
    id: 15,
    question: "Un score qualité bas entraîne ?",
    type: "multiple",
    options: ["Meilleure visibilité", "CPC plus élevé", "Meilleure diffusion", "Moins d'impressions"],
    correctAnswers: [1, 3],
  },
  {
    id: 16,
    question: "Pourquoi réaliser des tests A/B ?",
    type: "multiple",
    options: ["Tester audiences", "Comparer campagnes", "Améliorer visuels", "Augmenter budget"],
    correctAnswers: [0, 1, 2],
  },
  {
    id: 17,
    question: "Que signifie CTR ?",
    type: "multiple",
    options: ["Click Through Rate", "Cost Total Rate", "Conversion Traffic Rate", "Client Targeted Reach"],
    correctAnswers: [0],
  },
  {
    id: 18,
    question: "Pourquoi est-il important de bien définir les objectifs d'une campagne ?",
    type: "multiple",
    options: ["Maximiser le budget", "Assurer un bon ciblage", "Augmenter les ventes", "Aucune réponse"],
    correctAnswers: [0, 1, 2],
  },
  {
    id: 19,
    question: "Quelle plateforme publicitaire est la meilleure dans la publicité B2B ?",
    type: "multiple",
    options: ["Facebook Ads", "Google Ads", "LinkedIn Ads", "TikTok Ads"],
    correctAnswers: [2],
  },
  {
    id: 20,
    question: "Qu'est-ce que le ROAS ?",
    type: "multiple",
    options: [
      "Retour sur investissement",
      "Retour sur les dépenses publicitaires",
      "Nombre total d'impressions",
      "Ratio de conversion",
    ],
    correctAnswers: [1],
  },
  {
    id: 21,
    question: "Pourquoi utiliser les audiences lookalike ?",
    type: "multiple",
    options: [
      "Cibler de nouveaux clients similaires",
      "Retargeting",
      "Réduire le budget publicitaire",
      "Aucune réponse",
    ],
    correctAnswers: [0],
  },
  {
    id: 22,
    question: "Quelle est la principale différence entre un placement 'feed' et un placement 'story' ?",
    type: "multiple",
    options: ["Format et durée", "Coût", "Ciblage", "Visibilité"],
    correctAnswers: [0],
  },
  {
    id: 23,
    question: "Pourquoi faut-il éviter un ciblage trop large ?",
    type: "multiple",
    options: [
      "Augmente le coût",
      "Diminue la performance",
      "Diminue le CTR",
      "Peu de pertinence de cibler tout le monde",
    ],
    correctAnswers: [0, 1, 3],
  },
  {
    id: 24,
    question: "Quel est l'avantage principal d'une campagne SEA ?",
    type: "multiple",
    options: ["Augmentation du SEO", "Visibilité immédiate", "Moins chère que le SEO", "Ciblage plus large"],
    correctAnswers: [1],
  },
  {
    id: 25,
    question: "Quel KPI est essentiel pour mesurer une campagne de génération de leads ?",
    type: "multiple",
    options: ["CPC", "CTR", "CPL", "CPM"],
    correctAnswers: [2],
  },
  {
    id: 26,
    question: "Que signifie une impression en publicité digitale ?",
    type: "multiple",
    options: [
      "Une vue complète de la publicité",
      "Un clic sur l'annonce",
      "Une diffusion de l'annonce",
      "Une conversion",
    ],
    correctAnswers: [2],
  },
  {
    id: 27,
    question: "Pourquoi optimiser régulièrement les campagnes publicitaires ?",
    type: "multiple",
    options: ["Améliorer le ROI", "Économiser du budget", "Augmenter le CTR", "Augmenter le quality score"],
    correctAnswers: [0, 1, 2, 3],
  },
  {
    id: 28,
    question: "Quel est le principal atout des campagnes programmatiques ?",
    type: "multiple",
    options: [
      "Automatisation et ciblage précis",
      "Coût réduit",
      "Aucune configuration nécessaire",
      "Visibilité accrue",
    ],
    correctAnswers: [0],
  },
  {
    id: 29,
    question: "Quel est le but du retargeting ?",
    type: "multiple",
    options: [
      "Attirer de nouveaux clients",
      "Réengager les visiteurs",
      "Augmenter la portée",
      "Cibler les professionnels",
    ],
    correctAnswers: [1],
  },
  {
    id: 30,
    question: "Quelle plateforme publicitaire est idéale pour du B2C ?",
    type: "multiple",
    options: ["LinkedIn Ads", "Facebook Ads", "Google Display", "Snapchat Ads"],
    correctAnswers: [1, 3],
  },
  {
    id: 31,
    question: "Quel est l'impact du RGPD sur le tracking publicitaire ?",
    type: "multiple",
    options: [
      "Réduction des cookies",
      "Moins de données collectées",
      "Nécessité du consentement utilisateur",
      "Moins de visibilité sur les actions utilisateurs",
    ],
    correctAnswers: [0, 1, 2, 3],
  },
  {
    id: 32,
    question: "Pourquoi tester plusieurs créas publicitaires dans une campagne ?",
    type: "multiple",
    options: [
      "Éviter l'usure publicitaire",
      "Augmenter la diversité",
      "Mieux comprendre l'audience",
      "Augmenter la répétition",
    ],
    correctAnswers: [0, 2],
  },
  {
    id: 33,
    question: "Quel est le rôle des balises UTM ?",
    type: "multiple",
    options: [
      "Optimiser le SEO",
      "Suivre les performances des campagnes",
      "Améliorer le CTR",
      "Analyser la concurrence",
    ],
    correctAnswers: [1],
  },
  {
    id: 34,
    question: "Que signifie CPM ?",
    type: "multiple",
    options: ["Coût par Mille impressions", "Coût par Mail", "Coût par Mention", "Coût par Message"],
    correctAnswers: [0],
  },
  {
    id: 35,
    question: "Pourquoi utiliser une landing page dédiée pour une campagne ?",
    type: "multiple",
    options: ["Améliorer le taux de conversion", "Baisser le CPC", "Réduire le budget", "Mieux cibler les prospects"],
    correctAnswers: [0],
  },
  {
    id: 36,
    question: "Quel est le principal avantage du retargeting ?",
    type: "multiple",
    options: ["Conversion accrue", "Réduction du budget", "Ciblage large", "Augmentation des impressions"],
    correctAnswers: [0],
  },
  {
    id: 37,
    question: "Pourquoi intégrer du storytelling dans une publicité ?",
    type: "multiple",
    options: [
      "Raconter une histoire marquante",
      "Augmenter le CTR",
      "Engager émotionnellement",
      "Créer une campagne plus rapidement",
    ],
    correctAnswers: [0, 2],
  },
  {
    id: 38,
    question: "Quel est l'intérêt d'une publicité native ?",
    type: "multiple",
    options: ["Mieux intégrée au contenu", "Format unique", "Coût réduit", "Ciblage plus large"],
    correctAnswers: [0],
  },
  {
    id: 39,
    question: "Pourquoi utiliser Google Tag Manager ?",
    type: "multiple",
    options: [
      "Gérer les balises facilement",
      "Suivre le SEO",
      "Améliorer le taux de conversion",
      "Créer des campagnes",
    ],
    correctAnswers: [0],
  },
  {
    id: 40,
    question: "Le Traffic Manager ne travaille que sur les réseaux sociaux.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [1],
  },
  {
    id: 41,
    question: "Le SEO et le SEA sont complémentaires dans une stratégie digitale.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [0],
  },
  {
    id: 42,
    question: "Google Ads permet d'afficher des annonces sur Instagram.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [1],
  },
  {
    id: 43,
    question: "Un CTR élevé signifie que les internautes cliquent souvent sur l'annonce.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [0],
  },
  {
    id: 44,
    question: "Une campagne de notoriété vise principalement la conversion.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [1],
  },
  {
    id: 45,
    question: "Le pixel Facebook est obligatoire pour toutes les campagnes Facebook Ads.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [1],
  },
  {
    id: 46,
    question: "Le retargeting permet de cibler des internautes ayant déjà interagi avec la marque.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [0],
  },
  {
    id: 47,
    question: "Le ROAS mesure le retour sur les dépenses publicitaires.",
    type: "single",
    options: ["Vrai", "Faux"],
    correctAnswers: [0],
  },
  {
    id: 48,
    question: "L'API Conversion est une alternative améliorée au pixel de tracking.",
    type: "multiple",
    options: ["Vrai", "Faux"],
    correctAnswers: [0],
  },
]

export default function ExamenPage() {
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<number[]>>(Array(examQuestions.length).fill([]))
  const [examCompleted, setExamCompleted] = useState(false)

  const currentQuestion = examQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1

  const handleSingleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = [Number.parseInt(value)]
    setAnswers(newAnswers)
  }

  const handleMultipleAnswerChange = (index: number, checked: boolean) => {
    const newAnswers = [...answers]
    const currentAnswers = [...(newAnswers[currentQuestionIndex] || [])]

    if (checked) {
      if (!currentAnswers.includes(index)) {
        currentAnswers.push(index)
      }
    } else {
      const answerIndex = currentAnswers.indexOf(index)
      if (answerIndex !== -1) {
        currentAnswers.splice(answerIndex, 1)
      }
    }

    newAnswers[currentQuestionIndex] = currentAnswers
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setExamCompleted(true)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    examQuestions.forEach((question, index) => {
      const userAnswers = answers[index] || []
      const correctAnswers = question.correctAnswers

      if (userAnswers.length === correctAnswers.length) {
        const isCorrect =
          userAnswers.every((answer) => correctAnswers.includes(answer)) &&
          correctAnswers.every((answer) => userAnswers.includes(answer))
        if (isCorrect) {
          correctCount++
        }
      }
    })

    return {
      score: correctCount,
      percentage: Math.round((correctCount / examQuestions.length) * 100),
    }
  }

  const result = calculateScore()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-2">Examen Final</h1>
        <p className="text-muted-foreground mb-8">Formation Commerciale Interactive</p>

        {!examCompleted ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} sur {examQuestions.length}
                </span>
                <Progress value={((currentQuestionIndex + 1) / examQuestions.length) * 100} className="h-2 mt-1 w-32" />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                <CardDescription>
                  {currentQuestion.type === "single"
                    ? "Sélectionnez une seule réponse"
                    : "Sélectionnez toutes les réponses applicables"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentQuestion.type === "single" ? (
                  <RadioGroup
                    value={answers[currentQuestionIndex]?.[0]?.toString()}
                    onValueChange={handleSingleAnswerChange}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 rounded-md border p-3">
                        <Checkbox
                          id={`option-${index}`}
                          checked={answers[currentQuestionIndex]?.includes(index) || false}
                          onCheckedChange={(checked) => handleMultipleAnswerChange(index, checked as boolean)}
                        />
                        <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Question précédente
                </Button>
                <Button onClick={handleNextQuestion}>
                  {isLastQuestion ? "Terminer l'examen" : "Question suivante"}
                  {!isLastQuestion && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Résultats de l'examen</CardTitle>
              <CardDescription>Formation Commerciale Interactive</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex items-center justify-center rounded-full p-4 bg-muted mb-6">
                <div className="text-4xl font-bold">{result.percentage}%</div>
              </div>

              <p className="mb-4">
                Vous avez obtenu <span className="font-bold">{result.score}</span> bonnes réponses sur{" "}
                <span className="font-bold">{examQuestions.length}</span> questions.
              </p>

              {result.percentage >= 70 ? (
                <div className="p-6 bg-green-50 text-green-700 rounded-md mt-6">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Félicitations !</h3>
                  <p>Vous avez réussi l'examen final avec succès.</p>
                  <p className="mt-2">
                    Votre certificat de réussite est maintenant disponible dans votre espace personnel.
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-amber-50 text-amber-700 rounded-md mt-6">
                  <h3 className="text-xl font-bold mb-2">Vous y êtes presque !</h3>
                  <p>Vous n'avez pas atteint le score minimal requis (70%) pour valider l'examen.</p>
                  <p className="mt-2">
                    Nous vous conseillons de revoir les modules de formation et de réessayer dans quelques jours.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

