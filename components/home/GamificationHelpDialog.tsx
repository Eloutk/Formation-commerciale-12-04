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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Système de points</DialogTitle>
          <DialogDescription>Les points s’accumulent, rien n’est remis à zéro.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">+1</strong> par jeu joué (question, plateforme,
            mot)
          </li>
          <li>
            <strong className="text-foreground">+1</strong> bonus si tu enchaînes les jours ouvrés
          </li>
          <li>Week-ends et fériés ne cassent pas la série</li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}
