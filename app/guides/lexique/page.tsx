"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import supabase from "@/utils/supabase/client"
import { GLOSSARY_TERMS, type GlossaryTerm } from '@/lib/glossary-terms'

export type { GlossaryTerm }

export default function GlossairePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Tous")

  // Etat pour suggestion
  const [open, setOpen] = useState(false)
  const [suggestTerm, setSuggestTerm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [pseudo, setPseudo] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState("")
  const [submitOk, setSubmitOk] = useState("")

  // supabase singleton

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (user) {
          setUserId(user.id)
          const fullName = (user.user_metadata as any)?.full_name as string | undefined
          const fallback = (user.email || "").split("@")[0]
          setPseudo(fullName && fullName.trim() ? fullName.trim() : fallback)
        }
      } catch {}
    }
    load()
  }, [])

  // Filtrer les termes en fonction de la recherche et du filtre actif
  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "Tous") {
      return matchesSearch
    } else {
      return (
        matchesSearch &&
        term.category === activeFilter
      )
    }
  })

  // Obtenir toutes les catégories uniques pour les filtres
  const categories = ["Tous", ...Array.from(new Set(GLOSSARY_TERMS.map((term) => term.category)))]

  const submitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setSubmitOk("")
    if (!suggestTerm.trim()) {
      setSubmitError("Veuillez renseigner un terme.")
      return
    }
    setSubmitting(true)
    try {
      const payload: Record<string, any> = {
        term: suggestTerm.trim(),
        pseudo: pseudo || null,
      }
      if (userId) payload.user_id = userId
      const { error } = await supabase.from("glossary_suggestions").insert(payload)
      if (error) throw error
      setSubmitOk("Suggestion envoyée. Merci !")
      setSuggestTerm("")
      setTimeout(() => setOpen(false), 800)
    } catch (err: any) {
      const message = String(err?.message || "Impossible d'envoyer la suggestion")
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold mb-2">Glossaire</h1>
            <p className="text-muted-foreground">
              Découvrez les définitions des termes clés du marketing digital et de la publicité en ligne.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="shrink-0">Suggérer une définition</Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un terme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Liste des termes */}
        <div className="space-y-4">
          {filteredTerms.map((term) => (
            <Card key={term.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {term.term}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{term.definition}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun terme trouvé pour votre recherche.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) { setSuggestTerm(""); setSubmitError(""); setSubmitOk(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposer une définition</DialogTitle>
            <DialogDescription>
              Nous étudierons votre proposition et ajouterons le mot clé et sa définition.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSuggestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mot à définir</label>
              <Input value={suggestTerm} onChange={(e) => setSuggestTerm(e.target.value)} placeholder="Ex: Titres et descriptions" />
            </div>
            {submitError && <div className="text-sm text-red-600">{submitError}</div>}
            {submitOk && <div className="text-sm text-green-600">{submitOk}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Annuler</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Envoi..." : "Envoyer"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
