'use client'

import { ClipboardList } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BirthdaysAdminPanel } from '@/components/mon-espace/BirthdaysAdminPanel'
import { DailyQuestionsAdminPanel } from '@/components/mon-espace/DailyQuestionsAdminPanel'
import { GuessPlatformAdminPanel } from '@/components/mon-espace/GuessPlatformAdminPanel'
import { MotusAdminPanel } from '@/components/mon-espace/MotusAdminPanel'
import { WorldDaysAdminPanel } from '@/components/mon-espace/WorldDaysAdminPanel'

export function AdminQuizPanel() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="mb-2 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <ClipboardList className="h-6 w-6" aria-hidden />
            </span>
            Admin quizz
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Gérez les contenus ludiques de la Home : question du jour, Devine la plateforme, Mot du
            jour, journées mondiales et anniversaires.
          </p>
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-[#EEEEEE] p-1 md:grid-cols-5">
            <TabsTrigger value="daily">Question du jour</TabsTrigger>
            <TabsTrigger value="guess">Devine la plateforme</TabsTrigger>
            <TabsTrigger value="motus">Mot du jour</TabsTrigger>
            <TabsTrigger value="world">Journée mondiale</TabsTrigger>
            <TabsTrigger value="birthdays">Anniversaires</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-0">
            <DailyQuestionsAdminPanel />
          </TabsContent>
          <TabsContent value="guess" className="mt-0">
            <GuessPlatformAdminPanel embedded />
          </TabsContent>
          <TabsContent value="motus" className="mt-0">
            <MotusAdminPanel />
          </TabsContent>
          <TabsContent value="world" className="mt-0">
            <WorldDaysAdminPanel />
          </TabsContent>
          <TabsContent value="birthdays" className="mt-0">
            <BirthdaysAdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
