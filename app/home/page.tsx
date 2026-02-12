'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import supabase from '@/utils/supabase/client'
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

interface MonthlyContent {
  actu_flash_title: string
  actu_flash_description: string
  success_items: string[]
  digital_info_title: string
  digital_info_description: string
  digital_info_tags: string[]
  new_clients: Array<{ name: string; date: string; type: string }>
}

interface BirthdayRow {
  id: string
  name: string
  month: number
  day: number
}

export default function HomePage() {
  const [monthlyContent, setMonthlyContent] = useState<MonthlyContent | null>(null)
  const [birthdays, setBirthdays] = useState<BirthdayRow[]>([])

  // Charger le contenu du mois actuel + anniversaires depuis Supabase
  useEffect(() => {
    let cancelled = false

    async function loadHomeData() {
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      try {
        const [monthlyRes, birthdaysRes] = await Promise.all([
          supabase
            .from('monthly_content')
            .select('*')
            .eq('month', currentMonth)
            .eq('year', currentYear)
            .single(),
          supabase
            .from('birthdays')
            .select('id, name, month, day')
            .eq('month', currentMonth)
            .order('day', { ascending: true }),
        ])

        if (!cancelled) {
          if (monthlyRes.data && !monthlyRes.error) {
            setMonthlyContent(monthlyRes.data as any)
          } else {
            setMonthlyContent(null)
          }

          if (birthdaysRes.data && !birthdaysRes.error) {
            setBirthdays(birthdaysRes.data as BirthdayRow[])
          } else {
            setBirthdays([])
          }
        }
      } catch (error) {
        console.error('Error loading home data:', error)
        if (!cancelled) {
          setMonthlyContent(null)
          setBirthdays([])
        }
      }
    }

    loadHomeData()
    return () => {
      cancelled = true
    }
  }, [])

  // Récupérer le mois actuel et les anniversaires correspondants
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const monthNames = ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  const currentMonthName = monthNames[currentMonth]
  const birthdayCards = birthdays.map((b) => ({
    name: b.name,
    date: `${b.day} ${monthNames[b.month]?.toLowerCase?.() || ''}`.trim(),
  }))

  // Données depuis Supabase (ou fallback)
  const newClients = monthlyContent?.new_clients || []
  const monthlyInfo = {
    title: monthlyContent?.digital_info_title || "Aucune info digitale ce mois-ci",
    description: monthlyContent?.digital_info_description || "",
    date: `${currentMonthName} ${currentYear}`,
    tags: monthlyContent?.digital_info_tags || []
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

      {/* Actu Flash & Succès (si admin a rempli) */}
      {monthlyContent && (monthlyContent.actu_flash_title || monthlyContent.success_items.length > 0) && (
        <div className="mb-4 lg:mb-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Actu Flash */}
          {monthlyContent.actu_flash_title && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  📰 L'actu flash
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <h3 className="font-semibold text-sm mb-1">{monthlyContent.actu_flash_title}</h3>
                <p className="text-xs text-muted-foreground">{monthlyContent.actu_flash_description}</p>
              </CardContent>
            </Card>
          )}

          {/* Les succès du mois */}
          {monthlyContent.success_items.length > 0 && (
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  🏆 Les succès du mois
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="space-y-1 text-xs">
                  {monthlyContent.success_items.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span className="flex-1 text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                  {monthlyContent.success_items.length > 3 && (
                    <li className="text-muted-foreground text-center pt-1">
                      +{monthlyContent.success_items.length - 3} autre{monthlyContent.success_items.length - 3 > 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
            {birthdayCards.length > 0 ? (
              <div className="space-y-1.5">
                {birthdayCards.slice(0, 3).map((person, index) => (
                  <div key={index} className="flex items-center gap-2 p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-semibold text-xs">
                      {person.name.split('.')[0].trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs">{person.name}</p>
                      <p className="text-xs text-pink-600">{person.date}</p>
                    </div>
                    <div className="text-lg">🎂</div>
                  </div>
                ))}
                {birthdayCards.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{birthdayCards.length - 3} autre{birthdayCards.length - 3 > 1 ? 's' : ''}
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
            {newClients.length > 0 ? (
              <div className="space-y-1.5">
                {newClients.slice(0, 3).map((client, index) => (
                  <div key={index} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-medium text-xs">{client.name}</p>
                      <Badge variant="outline" className="text-xs bg-white h-5">
                        {client.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(client.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                ))}
                {newClients.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{newClients.length - 3} autre{newClients.length - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Aucun nouveau client ce mois-ci
              </p>
            )}
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
            {monthlyContent?.digital_info_title ? (
              <div className="space-y-1.5">
                <h3 className="font-semibold text-xs leading-tight">
                  {monthlyInfo.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                  {monthlyInfo.description}
                </p>
                {monthlyInfo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {monthlyInfo.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs h-5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button className="w-full mt-1.5 bg-[#E94C16] hover:bg-[#E94C16]/90 h-7 text-xs">
                  En savoir plus
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                Aucune info digitale ce mois-ci
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
