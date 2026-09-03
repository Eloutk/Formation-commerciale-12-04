'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'world_day_popup_seen'

export function WorldDayPopup() {
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState<string[]>([])

  useEffect(() => {
    // Ne pas ré-afficher si déjà vu aujourd'hui
    const today = new Date().toISOString().slice(0, 10) // "2026-09-03"
    const seenDate = localStorage.getItem(STORAGE_KEY)
    if (seenDate === today) return

    // Appel à notre route API
    fetch('/api/world-day')
      .then((res) => res.json())
      .then((data) => {
        if (data.show && data.days?.length > 0) {
          setDays(data.days)
          setOpen(true)
        }
      })
      .catch(() => {
        // Silencieux si erreur réseau
      })
  }, [])

  function handleClose() {
    // Marquer comme vu pour aujourd'hui (localStorage)
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem(STORAGE_KEY, today)
    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-3xl mb-2 text-center">🌍</div>
          <DialogTitle className="text-center text-lg font-semibold">
            {days.length > 1
              ? 'Les journées mondiales du jour'
              : 'La journée mondiale du jour'}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-2 space-y-2">
          {days.map((label, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <span className="mt-0.5 text-base">📅</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <Button className="mt-4 w-full" onClick={handleClose}>
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  )
}
