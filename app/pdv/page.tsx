'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Target } from "lucide-react"

// Configuration des plateformes et leurs objectifs
const platforms = {
  'META': ['Impressions', 'Clics sur lien', 'Clics', 'Leads'],
  'Insta only': ['Impressions', 'Clics sur lien', 'Clics'],
  'Display': ['Impressions', 'Clics'],
  'Youtube': ['Impressions'],
  'LinkedIn': ['Impressions', 'Clics', 'Leads'],
  'Snapchat': ['Impressions', 'Clics'],
  'Tiktok': ['Impressions', 'Clics'],
  'Spotify': ['Impressions']
}

export default function PDVPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedObjective, setSelectedObjective] = useState('')
  const [aePercentage, setAePercentage] = useState('')
  const [diffusionDays, setDiffusionDays] = useState('')
  const [calculationType, setCalculationType] = useState('')
  const [budget, setBudget] = useState('')
  const [kpis, setKpis] = useState('')

  const handleCalculate = () => {
    // Ici on ajoutera la logique de calcul une fois le fichier Excel disponible
    console.log('Calcul avec:', {
      platform: selectedPlatform,
      objective: selectedObjective,
      aePercentage,
      diffusionDays,
      calculationType,
      budget,
      kpis
    })
  }

  const getAvailableObjectives = () => {
    return selectedPlatform ? platforms[selectedPlatform as keyof typeof platforms] || [] : []
  }

  const resetObjectiveWhenPlatformChanges = (newPlatform: string) => {
    setSelectedPlatform(newPlatform)
    setSelectedObjective('') // Reset l'objectif quand la plateforme change
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Calculateur PDV</h1>
          <p className="text-muted-foreground">
            Calculez vos prix de vente selon la plateforme et vos paramètres
          </p>
        </div>

        <div className="grid gap-6">
          {/* Paramètres de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Paramètres de base
              </CardTitle>
              <CardDescription>
                Configurez les paramètres essentiels pour vos calculs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plateforme</Label>
                  <Select value={selectedPlatform} onValueChange={resetObjectiveWhenPlatformChanges}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(platforms).map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPlatform && (
                  <div className="space-y-2">
                    <Label>Objectif</Label>
                    <Select value={selectedObjective} onValueChange={setSelectedObjective}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un objectif" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableObjectives().map((objective) => (
                          <SelectItem key={objective} value={objective}>
                            {objective}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>% AE</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 15"
                    value={aePercentage}
                    onChange={(e) => setAePercentage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Jours de diffusion</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 30"
                    value={diffusionDays}
                    onChange={(e) => setDiffusionDays(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Type de calcul */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Type de calcul
              </CardTitle>
              <CardDescription>
                Choisissez si vous voulez calculer le prix pour x KPIs ou le nombre de KPIs pour x €
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de calcul</Label>
                  <Select value={calculationType} onValueChange={setCalculationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez le type de calcul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-for-kpis">Prix pour x KPIs</SelectItem>
                      <SelectItem value="kpis-for-budget">Nombre de KPIs pour x €</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {calculationType === 'price-for-kpis' && (
                  <div className="space-y-2">
                    <Label>Nombre de KPIs</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 1000"
                      value={kpis}
                      onChange={(e) => setKpis(e.target.value)}
                    />
                  </div>
                )}

                {calculationType === 'kpis-for-budget' && (
                  <div className="space-y-2">
                    <Label>Budget (€)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 5000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card>
            <CardHeader>
              <CardTitle>Résultats</CardTitle>
              <CardDescription>
                {calculationType === 'price-for-kpis' 
                  ? `Prix pour ${kpis} ${selectedObjective} sur ${selectedPlatform}`
                  : `Nombre de ${selectedObjective} possibles avec ${budget}€ sur ${selectedPlatform}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Les calculs seront disponibles une fois le fichier Excel intégré
                </p>
                <Button 
                  onClick={handleCalculate}
                  className="mt-4"
                  disabled={!selectedPlatform || !selectedObjective || !aePercentage || !diffusionDays || !calculationType}
                >
                  Calculer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 