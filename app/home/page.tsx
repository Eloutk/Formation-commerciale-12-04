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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#E94C16] to-orange-600 bg-clip-text text-transparent">
          Bienvenue sur Link Agency
        </h1>
        <p className="text-lg text-muted-foreground">
          Votre plateforme complète pour gérer et optimiser vos campagnes digitales
        </p>
      </div>

      {/* Main Sections Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span>Accès rapide</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-[#E94C16]/20">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anniversaires du mois */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Cake className="w-5 h-5 text-pink-500" />
              Anniversaires du mois
            </CardTitle>
            <CardDescription>Février 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {birthdays.map((person, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                    <p className="text-xs text-pink-600 font-medium mt-1">{person.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nouveaux clients */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-green-500" />
              Nouveaux clients
            </CardTitle>
            <CardDescription>Ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newClients.map((client, index) => (
                <div key={index} className="p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{client.name}</p>
                    <Badge variant="outline" className="text-xs bg-white">
                      {client.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{client.date}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full text-sm" size="sm">
                Voir tous les clients
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info digitale du mois */}
        <Card className="border-2 border-[#E94C16]/20 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="w-5 h-5 text-[#E94C16]" />
              Info digitale
            </CardTitle>
            <CardDescription>{monthlyInfo.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="font-semibold text-base leading-tight">
                {monthlyInfo.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {monthlyInfo.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {monthlyInfo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-4 bg-[#E94C16] hover:bg-[#E94C16]/90" size="sm">
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
