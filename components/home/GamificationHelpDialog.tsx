'use client'

import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function GamificationHelpDialog({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={
            triggerClassName ||
            'h-auto gap-1 px-2 py-1 text-[11px] font-medium text-[#E94C16] hover:bg-[#E94C16]/10 hover:text-[#E94C16] sm:text-xs'
          }
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Expliquer le système
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Système de points</DialogTitle>
          <DialogDescription>
            Comment gagner des points sur la Home Link Academy.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <section className="space-y-1.5 rounded-md border border-border/70 bg-[#FAFAFA] p-3">
            <p className="font-semibold text-[#E94C16]">Chaque jour</p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Question du jour</strong> : +1 point en
                répondant
              </li>
              <li>
                <strong className="text-foreground">Devine la plateforme</strong> : +1 point en
                jouant (jours ouvrés)
              </li>
              <li>
                <strong className="text-foreground">Mot du jour</strong> : +1 point en terminant la
                partie (gagnée ou perdue)
              </li>
            </ul>
          </section>

          <section className="space-y-1.5 rounded-md border border-border/70 bg-[#FAFAFA] p-3">
            <p className="font-semibold text-[#E94C16]">Bonus de régularité</p>
            <p className="text-muted-foreground">
              Si tu joues plusieurs <strong className="text-foreground">jours ouvrés d’affilée</strong>{' '}
              sans interruption, tu gagnes <strong className="text-foreground">+1 point</strong> de
              série le jour où tu continues.
            </p>
            <p className="text-muted-foreground">
              Les <strong className="text-foreground">week-ends</strong> et{' '}
              <strong className="text-foreground">jours fériés</strong> français ne cassent pas ta
              série (et Devine la plateforme est en pause ces jours-là).
            </p>
          </section>

          <section className="space-y-1.5 rounded-md border border-[#E94C16]/20 bg-[#E94C16]/[0.04] p-3">
            <p className="font-semibold">Exemple</p>
            <p className="text-muted-foreground">
              Lundi : question + plateforme + mot → <strong className="text-foreground">3 pts</strong>
              <br />
              Mardi : idem + série plateforme →{' '}
              <strong className="text-foreground">4 pts</strong>
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
