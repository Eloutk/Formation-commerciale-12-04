'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Target, Plus, Trash2, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface PlatformCalculation {
  id: string
  platform: string
  objective: string
  aePercentage: string
  diffusionDays: string
  calculationType: 'price-for-kpis' | 'kpis-for-budget'
  budget?: string
  kpis?: string
  price?: number
}

export default function PDVPage() {
  const [isMultiPlatform, setIsMultiPlatform] = useState(false)
  const [calculations, setCalculations] = useState<PlatformCalculation[]>([])
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
    setSelectedObjective('')
  }

  const addPlatform = () => {
    if (!selectedPlatform || !selectedObjective || !aePercentage || !diffusionDays || !calculationType) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const newCalculation: PlatformCalculation = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      objective: selectedObjective,
      aePercentage,
      diffusionDays,
      calculationType: calculationType as 'price-for-kpis' | 'kpis-for-budget',
      budget: calculationType === 'kpis-for-budget' ? budget : undefined,
      kpis: calculationType === 'price-for-kpis' ? kpis : undefined,
      price: Math.random() * 1000 + 500 // Simulation de calcul - à remplacer par la vraie logique Excel
    }

    setCalculations([...calculations, newCalculation])
    
    // Reset form
    setSelectedPlatform('')
    setSelectedObjective('')
    setAePercentage('')
    setDiffusionDays('')
    setCalculationType('')
    setBudget('')
    setKpis('')
  }

  const removePlatform = (id: string) => {
    setCalculations(calculations.filter(calc => calc.id !== id))
  }

  const getTotalPDV = () => {
    return calculations.reduce((total, calc) => total + (calc.price || 0), 0)
  }

  const generateQuotation = () => {
    const total = getTotalPDV()
    const details = calculations.map(calc => 
      `${calc.platform} - ${calc.objective}: ${calc.price?.toFixed(2)}€`
    ).join('\n')
    
    const quotation = `DEVIS MULTI-PLATEFORMES\n\n${details}\n\nTOTAL PDV: ${total.toFixed(2)}€`
    
    // Créer et télécharger le fichier
    const blob = new Blob([quotation], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'devis-multi-plateformes.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Calculateur PDV</h1>
          <p className="text-muted-foreground">
            Calculez vos prix de vente selon la plateforme et vos paramètres
          </p>
        </div>

        {/* Mode de calcul */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mode de calcul</CardTitle>
            <CardDescription>
              Choisissez entre un calcul simple ou multi-plateformes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => setIsMultiPlatform(false)}
                className={!isMultiPlatform ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
              >
                Calcul simple
              </Button>
              <Button
                onClick={() => setIsMultiPlatform(true)}
                className={isMultiPlatform ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
              >
                Calcul multi-plateformes
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isMultiPlatform ? (
          // Mode calcul simple
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
        ) : (
          // Mode calcul multi-plateformes
          <div className="grid gap-6">
            {/* Ajout de plateforme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Ajouter une plateforme
                </CardTitle>
                <CardDescription>
                  Configurez les paramètres pour cette plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="space-y-2">
                    <Label>% AE</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 15"
                      value={aePercentage}
                      onChange={(e) => setAePercentage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Jours de diffusion</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 30"
                      value={diffusionDays}
                      onChange={(e) => setDiffusionDays(e.target.value)}
                    />
                  </div>

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

                <Button 
                  onClick={addPlatform}
                  className="w-full"
                  disabled={!selectedPlatform || !selectedObjective || !aePercentage || !diffusionDays || !calculationType}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter cette plateforme
                </Button>
              </CardContent>
            </Card>

            {/* Récapitulatif multi-plateformes */}
            {calculations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Récapitulatif multi-plateformes
                  </CardTitle>
                  <CardDescription>
                    Détail des calculs par plateforme et total PDV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plateforme</TableHead>
                          <TableHead>Objectif</TableHead>
                          <TableHead>% AE</TableHead>
                          <TableHead>Jours</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Valeur</TableHead>
                          <TableHead>Prix (€)</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculations.map((calc) => (
                          <TableRow key={calc.id}>
                            <TableCell className="font-medium">{calc.platform}</TableCell>
                            <TableCell>{calc.objective}</TableCell>
                            <TableCell>{calc.aePercentage}%</TableCell>
                            <TableCell>{calc.diffusionDays}j</TableCell>
                            <TableCell>
                              {calc.calculationType === 'price-for-kpis' ? 'Prix pour KPIs' : 'KPIs pour budget'}
                            </TableCell>
                            <TableCell>
                              {calc.calculationType === 'price-for-kpis' 
                                ? `${calc.kpis} KPIs` 
                                : `${calc.budget}€`
                              }
                            </TableCell>
                            <TableCell className="font-bold">
                              {calc.price?.toFixed(2)}€
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => removePlatform(calc.id)}
                                className="h-8 px-2 bg-secondary text-secondary-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                                         <div className="flex justify-center items-center pt-4 border-t">
                       <div className="text-lg font-semibold">
                         Total PDV: <span className="text-2xl text-green-600">{getTotalPDV().toFixed(2)}€</span>
                       </div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 