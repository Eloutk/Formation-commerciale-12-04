'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Target, Plus, Trash2, FileText, PieChart, BarChart3, Download, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFGenerator } from '@/components/pdf-generator'
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  calculatePriceForKPIs,
  calculateKPIsForBudget,
  validateInputs,
  listObjectivesForPlatform,
  type PDVCalculation,
  UNIT_COSTS,
} from '@/lib/pdv-calculations'

// Configuration des plateformes et leurs objectifs (depuis les coûts unitaires)
const platforms = UNIT_COSTS as const

// Couleurs pour les diagrammes
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B']

export interface PlatformCalculation {
  id: string
  platform: string
  objective: string
  aePercentage: string
  diffusionDays: string
  calculationType: 'price-for-kpis' | 'kpis-for-budget'
  budget?: string
  kpis?: string
  price?: number
  calculatedKpis?: number
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
  const [currentResult, setCurrentResult] = useState<PDVCalculation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    setError(null)
    setCurrentResult(null)
    
    try {
      const aePercentageNum = parseFloat(aePercentage)
      const validationError = validateInputs(
        selectedPlatform,
        selectedObjective,
        aePercentageNum,
        calculationType === 'price-for-kpis' ? parseFloat(kpis) : undefined,
        calculationType === 'kpis-for-budget' ? parseFloat(budget) : undefined
      )
      if (validationError) {
        setError(validationError)
        return
      }

      let result: PDVCalculation
      if (calculationType === 'price-for-kpis') {
        result = calculatePriceForKPIs(
          selectedPlatform,
          selectedObjective,
          aePercentageNum,
          parseFloat(kpis)
        )
      } else {
        result = calculateKPIsForBudget(
          selectedPlatform,
          selectedObjective,
          aePercentageNum,
          parseFloat(budget)
        )
      }

      setCurrentResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul')
    }
  }

  const getAvailableObjectives = () => {
    return selectedPlatform ? Object.keys(platforms[selectedPlatform as keyof typeof platforms] || {}) : []
  }

  const resetObjectiveWhenPlatformChanges = (newPlatform: string) => {
    setSelectedPlatform(newPlatform)
    setSelectedObjective('')
  }

  const addPlatform = () => {
    if (!selectedPlatform || !selectedObjective || !aePercentage || !diffusionDays || !calculationType) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      const aePercentageNum = parseFloat(aePercentage)
      let result: PDVCalculation

      if (calculationType === 'price-for-kpis') {
        if (!kpis) {
          setError('Veuillez saisir le nombre de KPIs')
          return
        }
        result = calculatePriceForKPIs(
          selectedPlatform,
          selectedObjective,
          aePercentageNum,
          parseFloat(kpis)
        )
      } else {
        if (!budget) {
          setError('Veuillez saisir le budget')
          return
        }
        result = calculateKPIsForBudget(
          selectedPlatform,
          selectedObjective,
          aePercentageNum,
          parseFloat(budget)
        )
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
        price: result.price,
        calculatedKpis: result.calculatedKpis,
      }

      setCalculations([...calculations, newCalculation])
      setError(null)

      // Reset form
      setSelectedPlatform('')
      setSelectedObjective('')
      setAePercentage('')
      setDiffusionDays('')
      setCalculationType('')
      setBudget('')
      setKpis('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul')
    }
  }

  const removePlatform = (id: string) => {
    setCalculations(calculations.filter(calc => calc.id !== id))
  }

  const getTotalPDV = () => {
    return calculations.reduce((total, calc) => total + (calc.price || 0), 0)
  }

  const getTotalKPIs = () => {
    return calculations.reduce((total, calc) => total + (calc.calculatedKpis || 0), 0)
  }

  // Données pour les diagrammes
  const getChartData = () => {
    return calculations.map((calc, index) => ({
      name: calc.platform,
      value: calc.price || 0,
      color: COLORS[index % COLORS.length]
    }))
  }

  const getPercentageData = () => {
    const total = getTotalPDV()
    return calculations.map((calc, index) => ({
      name: calc.platform,
      value: total > 0 ? ((calc.price || 0) / total * 100) : 0,
      color: COLORS[index % COLORS.length]
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
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
                {error && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {currentResult && (
                  <div className="space-y-4">
                    <div className="text-center p-8 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {calculationType === 'price-for-kpis' 
                          ? `${(currentResult.price || 0).toFixed(2)}€`
                          : `${(currentResult.calculatedKpis || 0).toLocaleString()}`
                        }
                      </div>
                      <div className="text-lg text-muted-foreground">
                        {calculationType === 'price-for-kpis' ? 'Prix FDV' : 'KPIs calculés'}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-center mt-6">
                  <Button 
                    onClick={handleCalculate}
                    className="mt-4"
                    disabled={!selectedPlatform || !selectedObjective || !aePercentage || !diffusionDays || !calculationType || 
                             (calculationType === 'price-for-kpis' && !kpis) ||
                             (calculationType === 'kpis-for-budget' && !budget)}
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
                {error && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
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

            {/* Dashboard avec diagrammes */}
            {calculations.length > 0 && (
              <div className="grid gap-6">
                {/* Récapitulatif avec diagrammes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Dashboard - Répartition du budget
                    </CardTitle>
                    <CardDescription>
                      Visualisez la répartition de votre budget par plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Diagramme circulaire - Répartition en euros */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center">Répartition en euros</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={getChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${(value as number).toFixed(0)}€`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getChartData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}€`} />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Diagramme circulaire - Répartition en pourcentage */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center">Répartition en pourcentage</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={getPercentageData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${(value as number).toFixed(1)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getPercentageData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Total PDV et bouton PDF */}
                    <div className="flex justify-center items-center pt-6 border-t mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {getTotalPDV().toFixed(2)}€
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">Total PDV</div>
                        
                        {/* Bouton de téléchargement PDF */}
                        {calculations.length > 0 && (
                          <PDFDownloadLink
                            document={<PDFGenerator calculations={calculations} totalPDV={getTotalPDV()} totalKPIs={getTotalKPIs()} />}
                            fileName={`recapitulatif-pdv-${new Date().toISOString().split('T')[0]}.pdf`}
                          >
                            {({ blob, url, loading, error }) => (
                              <Button disabled={loading} className="bg-green-600 hover:bg-green-700">
                                <Download className="mr-2 h-4 w-4" />
                                {loading ? 'Génération...' : 'Télécharger PDF'}
                              </Button>
                            )}
                          </PDFDownloadLink>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tableau détaillé */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Détail par plateforme
                    </CardTitle>
                    <CardDescription>
                      Tableau récapitulatif avec tous les paramètres
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plateforme</TableHead>
                          <TableHead>Objectif</TableHead>
                          <TableHead>% AE</TableHead>
                          <TableHead>Jours</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Valeur</TableHead>
                          <TableHead>Résultat</TableHead>
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
                              {calc.calculationType === 'price-for-kpis' 
                                ? `${(calc.price || 0).toFixed(2)}€`
                                : `${(calc.calculatedKpis || 0).toLocaleString()}`
                              }
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
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 