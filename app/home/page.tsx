import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-6">🎯</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bienvenue sur Link Academy
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Votre formation complète pour maîtriser les campagnes publicitaires digitales. 
            De la stratégie à l'optimisation, devenez expert en publicité en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diffusion">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                Commencer la formation
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Voir les documents
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">📚</div>
              <CardTitle className="text-orange-600">Formation Complète</CardTitle>
              <CardDescription>
                Modules structurés couvrant tous les aspects des campagnes publicitaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Architecture des campagnes</li>
                <li>• Ciblage et segmentation</li>
                <li>• Optimisation des performances</li>
                <li>• Analyse des résultats</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🛠️</div>
              <CardTitle className="text-orange-600">Outils Pratiques</CardTitle>
              <CardDescription>
                Calculatrices et simulateurs pour vos campagnes réelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Calculateur PDV</li>
                <li>• Simulateur de budgets</li>
                <li>• Générateur de rapports</li>
                <li>• Templates prêts à l'emploi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">📊</div>
              <CardTitle className="text-orange-600">Suivi des Progrès</CardTitle>
              <CardDescription>
                Suivez votre avancement et validez vos acquis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Progression en temps réel</li>
                <li>• Quiz d'évaluation</li>
                <li>• Certificats de validation</li>
                <li>• Historique des performances</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Accès Rapide
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/diffusion" className="group">
              <div className="p-6 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-gray-900 mb-2">Diffusion</h3>
                <p className="text-sm text-gray-600">Modules d'apprentissage</p>
              </div>
            </Link>
            
            <Link href="/pdv" className="group">
              <div className="p-6 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-gray-900 mb-2">PDV</h3>
                <p className="text-sm text-gray-600">Calculateur de prix</p>
              </div>
            </Link>
            
            <Link href="/documents" className="group">
              <div className="p-6 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">📄</div>
                <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                <p className="text-sm text-gray-600">Ressources utiles</p>
              </div>
            </Link>
            
            <Link href="/glossaire" className="group">
              <div className="p-6 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all group-hover:scale-105">
                <div className="text-3xl mb-3">📖</div>
                <h3 className="font-semibold text-gray-900 mb-2">Glossaire</h3>
                <p className="text-sm text-gray-600">Définitions et termes</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-lg">
            🚀 Prêt à commencer ?
          </Badge>
          <p className="text-gray-600 mb-6">
            Rejoignez des milliers de professionnels qui ont déjà transformé leurs campagnes
          </p>
          <Link href="/diffusion">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-lg">
              Démarrer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
