"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export default function ScoreQualite() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Score Qualité</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Qu'est-ce que le score qualité ?</CardTitle>
            <CardDescription>Comprendre l'impact du score qualité sur vos campagnes publicitaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-lg text-primary font-medium mb-4">
                Chaque annonceur est évalué avec un score qualité qui  lui donne une note basée sur la qualité de ses annonces et de ses campagnes. Ce score
                détermine notre rang dans le processus d'enchères publicitaires.
              </p>
              <p className="mb-4">
                Cette notation a été créé par Facebook puis repris par l'ensemble des acteurs du marché.
              </p>
              <Alert className="mt-6 border-primary/50 bg-primary/10">
                <AlertDescription>
                  <p className="font-medium">
                    Ce score qualité est assez méconnu par les autres annonceurs. C'est l'intérêt de passer par les agences.<br />
                    La note évolue en permanence en fonction des diffusions réalisées pour nos différents clients. On va refuser de mettre en avant des visuels de mauvaises qualités, qui ne respectent pas les exigences des plateformes car cela peut faire baisser notre note.
                  </p>
                </AlertDescription>
              </Alert>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Critères d'évaluation</h3>
              <p className="text-lg text-primary font-medium mb-4">
                Le score qualité attribue une note et se base sur plusieurs critères :
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Le respect des formats de diffusion et le cahier des charges</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Le paramétrage de campagne</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>La pertinence du ciblage, la qualité des audiences</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>La gestion des objectifs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>L'optimisation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Etc...</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Impact sur les enchères</h3>
              <p className="mb-6">
                Le score qualité joue un rôle crucial dans le processus d'enchères publicitaires. Voici comment il
                fonctionne :
              </p>
              <AfficherExempleScoreQualite />
            </div>
          </CardContent>
        </Card>

      {/* Quiz button removed */}
      </div>
    </div>
  )
}

function AfficherExempleScoreQualite() {
  const [show, setShow] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const examples = [
    { image: "/images/premiere.png" },
    { image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.35-r8Rp84pWHUQdo77VTeA9Ko2wBRPtRc.png" },
    // Uber Eats en 3e slide
    { image: "/images/ubereats.png" },
    { image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.45-3sK7x1e2ZBdBSDHJmpVg6LrU4ICZaQ.png" },
    { image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.50-kR4F67aOJuuA4d1nVK2tYMvQFN05LA.png" }
  ];

  const goToPrev = () => setCurrentExample((prev) => (prev === 0 ? examples.length - 1 : prev - 1));
  const goToNext = () => setCurrentExample((prev) => (prev === examples.length - 1 ? 0 : prev + 1));

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <button
        className="px-4 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition mb-4"
        onClick={() => setShow((v) => !v)}
      >
        {show ? "Masquer l'exemple" : "Afficher l'exemple"}
      </button>
      {show && (
        <>
          <div className="flex items-center justify-center mb-4 gap-4">
            <button
              onClick={goToPrev}
              aria-label="Exemple précédent"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
            >
              ←
            </button>
            <img
              src={examples[currentExample].image}
              alt={`Exemple ${currentExample + 1}`}
              className="max-w-full md:max-w-2xl rounded shadow-lg"
            />
            <button
              onClick={goToNext}
              aria-label="Exemple suivant"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold"
            >
              →
            </button>
          </div>
          <Alert className="mt-8 border-primary/50 bg-primary/10">
            <AlertDescription>
              <p className="font-medium">
                Comme vous pouvez le voir dans les exemples ci-dessus, un meilleur score qualité peut compenser une enchère plus basse. IKEA, avec une enchère de seulement 0,15€ mais un score qualité de 9, obtient une note finale de 135, supérieure à celle de Nike (120) qui a une enchère plus élevée (0,20€) mais un score qualité inférieur (6).
              </p>
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
}

