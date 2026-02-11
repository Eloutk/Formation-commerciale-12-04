'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Calculator, 
  Palette, 
  GraduationCap, 
  Radio, 
  FileText, 
  BookOpen,
  HelpCircle,
  Users,
  Cake,
  Lightbulb,
  ArrowRight,
  ChefHat
} from "lucide-react"

export default function HomePage() {
  // Données mockées pour les anniversaires (à remplacer par des vraies données)
  const birthdays = [
    { name: "Marie Dubois", date: "15 février", role: "Chef de Projet" },
    { name: "Jean Martin", date: "22 février", role: "Consultant Digital" },
    { name: "Sophie Laurent", date: "28 février", role: "Account Manager" },
  ]

  // Données mockées pour les nouveaux clients
  const newClients = [
    { name: "Carrefour Market", date: "5 février 2026", type: "Retail" },
    { name: "Intermarché Express", date: "12 février 2026", type: "Retail" },
    { name: "Super U", date: "18 février 2026", type: "Retail" },
  ]

  // Info digitale du mois
  const monthlyInfo = {
    title: "Les nouveautés META pour 2026",
    description: "Découvrez les dernières mises à jour de l'algorithme META et comment optimiser vos campagnes publicitaires pour maximiser votre ROI.",
    date: "Février 2026",
    tags: ["META", "Algorithme", "Publicité"]
  }

  // Sections principales du site
  const mainSections = [
    {
      title: "PDV",
      description: "Calculateur de budget et KPIs pour vos campagnes social media et SMS",
      icon: Calculator,
      href: "/pdv",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Studio",
      description: "Formats publicitaires et recommandations pour META, Google Display et plus",
      icon: Palette,
      href: "/studio",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Formation",
      description: "Modules de formation complète sur le marketing digital",
      icon: GraduationCap,
      href: "/formation",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Diffusion",
      description: "Gestion et suivi de vos campagnes de diffusion",
      icon: Radio,
      href: "/diffusion",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Chefferie",
      description: "Outils et ressources pour les chefs de projet",
      icon: ChefHat,
      href: "/chefferie",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Documents",
      description: "Bibliothèque de documents et ressources",
      icon: FileText,
      href: "/documents",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Glossaire",
      description: "Tous les termes du marketing digital expliqués",
      icon: BookOpen,
      href: "/glossaire",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      title: "FAQ",
      description: "Questions fréquentes et leurs réponses",
      icon: HelpCircle,
      href: "/faq",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-4 lg:py-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#E94C16] to-orange-600 bg-clip-text text-transparent">
          Bienvenue sur Link Agency
        </h1>
        <p className="text-base text-muted-foreground">
          Votre plateforme complète pour gérer et optimiser vos campagnes digitales
        </p>
      </div>

      {/* Main Sections Grid */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>Accès rapide</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {mainSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-[#E94C16]/20">
                  <CardHeader className="p-3 lg:p-4 pb-2">
                    <div className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center mb-2`}>
                      <Icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <CardTitle className="text-base lg:text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 lg:p-4 pt-0">
                    <CardDescription className="text-xs lg:text-sm leading-relaxed line-clamp-2">
                      {section.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Three Column Section: Birthdays, New Clients, Monthly Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Anniversaires du mois */}
        <Card className="border-2">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cake className="w-4 h-4 text-pink-500" />
              Anniversaires du mois
            </CardTitle>
            <CardDescription className="text-xs">Février 2026</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {birthdays.map((person, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold text-xs">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                    <p className="text-xs text-pink-600 font-medium">{person.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nouveaux clients */}
        <Card className="border-2">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-4 h-4 text-green-500" />
              Nouveaux clients
            </CardTitle>
            <CardDescription className="text-xs">Ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {newClients.map((client, index) => (
                <div key={index} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-xs">{client.name}</p>
                    <Badge variant="outline" className="text-xs bg-white">
                      {client.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{client.date}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs mt-2" size="sm">
                Voir tous les clients
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info digitale du mois */}
        <Card className="border-2 border-[#E94C16]/20 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-4 h-4 text-[#E94C16]" />
              Info digitale
            </CardTitle>
            <CardDescription className="text-xs">{monthlyInfo.date}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm leading-tight">
                {monthlyInfo.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {monthlyInfo.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {monthlyInfo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-2 bg-[#E94C16] hover:bg-[#E94C16]/90" size="sm">
                En savoir plus
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
