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
  // Données complètes des anniversaires Link Agency
  const allBirthdays = {
    1: [ // Janvier
      { name: "Morvan", date: "21 janvier", fullDate: "2026-01-21" },
    ],
    2: [ // Février
      { name: "Gautier", date: "6 février", fullDate: "2026-02-06" },
      { name: "Morgan", date: "16 février", fullDate: "2026-02-16" },
      { name: "François", date: "20 février", fullDate: "2026-02-20" },
    ],
    3: [ // Mars
      { name: "Carole", date: "9 mars", fullDate: "2026-03-09" },
      { name: "Camille", date: "30 mars", fullDate: "2026-03-30" },
    ],
    4: [ // Avril
      { name: "Juliette", date: "11 avril", fullDate: "2026-04-11" },
    ],
    6: [ // Juin
      { name: "Nicolas.M", date: "10 juin", fullDate: "2026-06-10" },
    ],
    7: [ // Juillet
      { name: "Jujule", date: "3 juillet", fullDate: "2026-07-03" },
    ],
    8: [ // Août
      { name: "Victor", date: "6 août", fullDate: "2026-08-06" },
      { name: "Maxime", date: "11 août", fullDate: "2026-08-11" },
      { name: "Gary", date: "25 août", fullDate: "2026-08-25" },
    ],
    9: [ // Septembre
      { name: "Junior", date: "14 septembre", fullDate: "2026-09-14" },
      { name: "Bricky", date: "17 septembre", fullDate: "2026-09-17" },
      { name: "Clément", date: "29 septembre", fullDate: "2026-09-29" },
    ],
    10: [ // Octobre
      { name: "Nicolas.D", date: "3 octobre", fullDate: "2026-10-03" },
      { name: "Enzo", date: "25 octobre", fullDate: "2026-10-25" },
      { name: "Seb", date: "30 octobre", fullDate: "2026-10-30" },
    ],
    11: [ // Novembre
      { name: "Sabine", date: "3 novembre", fullDate: "2026-11-03" },
      { name: "Pauline.B", date: "9 novembre", fullDate: "2026-11-09" },
      { name: "Catheline", date: "21 novembre", fullDate: "2026-11-21" },
    ],
    12: [ // Décembre
      { name: "Diane", date: "2 décembre", fullDate: "2026-12-02" },
      { name: "Emilie", date: "20 décembre", fullDate: "2026-12-20" },
    ],
  }

  // Récupérer le mois actuel et les anniversaires correspondants
  const currentMonth = new Date().getMonth() + 1
  const monthNames = ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  const currentMonthName = monthNames[currentMonth]
  const birthdays = allBirthdays[currentMonth as keyof typeof allBirthdays] || []

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
    <div className="container mx-auto px-4 py-3 lg:py-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-4 lg:mb-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-[#E94C16] to-orange-600 bg-clip-text text-transparent">
          Bienvenue sur Link Agency
        </h1>
        <p className="text-sm text-muted-foreground">
          Votre plateforme complète pour gérer et optimiser vos campagnes digitales
        </p>
      </div>

      {/* Main Sections Grid */}
      <div className="mb-4 lg:mb-5">
        <h2 className="text-lg font-semibold mb-3">
          Accès rapide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {mainSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-[#E94C16]/20">
                  <CardHeader className="p-2 lg:p-3 pb-1">
                    <div className={`w-8 h-8 rounded-lg ${section.bgColor} flex items-center justify-center mb-1`}>
                      <Icon className={`w-4 h-4 ${section.color}`} />
                    </div>
                    <CardTitle className="text-sm lg:text-base">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 lg:p-3 pt-0">
                    <CardDescription className="text-xs leading-tight line-clamp-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Anniversaires du mois */}
        <Card className="border-2">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Cake className="w-4 h-4 text-pink-500" />
              Anniversaires
            </CardTitle>
            <CardDescription className="text-xs">{currentMonthName} 2026</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {birthdays.length > 0 ? (
              <div className="space-y-1.5">
                {birthdays.slice(0, 2).map((person, index) => (
                  <div key={index} className="flex items-center gap-2 p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold text-xs">
                      {person.name.split('.')[0].substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs">{person.name}</p>
                      <p className="text-xs text-pink-600">{person.date}</p>
                    </div>
                    <div className="text-lg">🎂</div>
                  </div>
                ))}
                {birthdays.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{birthdays.length - 2} autre{birthdays.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Aucun anniversaire ce mois-ci
              </p>
            )}
          </CardContent>
        </Card>

        {/* Nouveaux clients */}
        <Card className="border-2">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-green-500" />
              Nouveaux clients
            </CardTitle>
            <CardDescription className="text-xs">Ce mois-ci</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-1.5">
              {newClients.slice(0, 2).map((client, index) => (
                <div key={index} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-medium text-xs">{client.name}</p>
                    <Badge variant="outline" className="text-xs bg-white h-5">
                      {client.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{client.date}</p>
                </div>
              ))}
              {newClients.length > 2 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{newClients.length - 2} autre{newClients.length - 2 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info digitale du mois */}
        <Card className="border-2 border-[#E94C16]/20 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4 text-[#E94C16]" />
              Info digitale
            </CardTitle>
            <CardDescription className="text-xs">{monthlyInfo.date}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-xs leading-tight">
                {monthlyInfo.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                {monthlyInfo.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {monthlyInfo.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs h-5">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-1.5 bg-[#E94C16] hover:bg-[#E94C16]/90 h-7 text-xs">
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
