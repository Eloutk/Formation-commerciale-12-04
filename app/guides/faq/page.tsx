"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import supabase from "@/utils/supabase/client"

export default function FAQPage() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [pseudo, setPseudo] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitOk, setSubmitOk] = useState("")

  // utilise le client unique

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

  const submitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    setSubmitOk("")
    if (!question.trim()) {
      setSubmitError("Veuillez renseigner votre question.")
      return
    }
    setSubmitting(true)
    try {
      const payload: Record<string, any> = { question: question.trim(), pseudo: pseudo || null }
      if (userId) payload.user_id = userId
      const { error } = await supabase.from('faq_suggestions').insert(payload)
      if (error) throw error
      setSubmitOk("Question envoyée. Merci !")
      setQuestion("")
      setTimeout(() => setOpen(false), 800)
    } catch (err: any) {
      setSubmitError(err?.message || "Impossible d'envoyer la question")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Questions Fréquentes</h1>
        <p className="text-xl mb-6 max-w-3xl mx-auto text-muted-foreground">
          Retrouvez ici les réponses aux questions les plus courantes.
        </p>
        <Button onClick={() => setOpen(true)}>Suggérer une question</Button>
      </div>
      
      <section className="py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* items */}
              <AccordionItem value="item-1">
                <AccordionTrigger>Mon annonce Google Search ne remonte pas dans les premiers résultats de recherche, pourquoi ?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Le budget de la campagne est insuffisant pour couvrir l'ensemble des requêtes dans la zone ciblée. Même avec des optimisations, il est normal de ne pas apparaître à chaque recherche pertinente. Un budget plus élevé serait nécessaire pour une couverture totale.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Les stats GA4 ne sont pas les mêmes que les rapports des campagnes ? Pourquoi ?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Les écarts sont normaux :<br /><br />
                    GA4 mesure les visites réelles, dépend des cookies et peut manquer des données (ex. : utilisateurs non connectés sur Google/YouTube).<br /><br />
                    Les plateformes publicitaires (Google Ads, Meta...) mesurent les interactions avec les pubs (clics, vues, conversions) selon leurs propres règles d'attribution.<br /><br />
                    👉 GA4 affiche donc parfois moins de données que les rapports de campagnes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Peut-on avoir la liste exacte des sites sur lesquels une campagne Display sera diffusée ?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Non, car Google utilise des ciblages dynamiques (par mots-clés, intérêts, thèmes, sites affinitaires, etc.).<br /><br />
                    Les emplacements réels dépendent de l'enchère gagnée, du comportement utilisateur et des critères choisis.<br /><br />
                    ➡️ Tous les types de ciblage sont visibles dans le rapport de campagne live.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Pourquoi voit-on autant de clics sur des mots-clés très spécifiques mentionnant le nom de ma marque ?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    C'est une stratégie de branding SEA :<br /><br />
                    - Cela permet de protéger la marque contre les concurrents qui pourraient enchérir dessus.<br /><br />
                    - Cela garantit une visibilité contrôlée sur son propre nom.<br /><br />
                    - Cela dynamise la campagne même si cela peut sembler redondant.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) { setQuestion(""); setSubmitError(""); setSubmitOk(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposer une question</DialogTitle>
            <DialogDescription>
              Nous étudierons votre proposition et pourrons l'ajouter à la FAQ.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSuggestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Votre question</label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ex: Comment est calculé le score de qualité ?" />
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

