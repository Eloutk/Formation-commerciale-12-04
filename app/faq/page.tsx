import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const faqItems = [
  {
    question: "Mon annonce Google Search ne remonte pas dans les premiers résultats de recherche, pourquoi ?",
    answer: "Le budget de la campagne n'est pas suffisant pour couvrir toutes les recherches dans la zone ciblée. Même avec des optimisations, il est impossible d'apparaître à chaque recherche pertinente sans un budget bien plus élevé."
  },
  {
    question: "Les stats GA4 ne sont pas les mêmes que les rapports des campagnes ? Pourquoi ?",
    answer: "Les différences viennent des méthodes de collecte :\n\nGA4 mesure les visites réelles sur le site, mais dépend de l'acceptation des cookies. Il peut donc manquer des données, surtout sur Google/YouTube où de nombreux utilisateurs ne sont pas connectés.\n\nLes plateformes publicitaires (Google Ads, Meta...) mesurent les interactions avec les pubs (clics, vues, conversions) et appliquent leurs propres modèles d'attribution, souvent plus complets mais moins transparents.\n\n👉 Résultat : GA4 peut afficher des stats plus faibles ou différentes, ce qui est normal."
  },
  {
    question: "Est-il possible d'avoir un listing des principaux sites sur lesquels la publicité sera diffusée sur une campagne Display ?",
    answer: "Non, car les campagnes Display utilisent différents types de ciblage automatisé :\n\nAudience mots clés & sites web (ex. : mot clé \"don de sang\", site visité \"20minutes.fr\")\n\nAudience centres d'intérêts (ex. : centre d'intérêt \"bien-être\")\n\nPlacement par thème (ex. : thème \"bénévolat\")\n\nPlacement par mot clé (ex. : mot clé \"voiture haut de gamme\")\n\nPlacement site web (ex. : site spécifique comme \"leboncoin.fr\")\n\nLes publicités apparaissent selon les enchères gagnées, les centres d'intérêts ou les habitudes de navigation de la cible."
  },
  {
    question: "Pourquoi le nom de ma marque génère-t-il autant de clics et non d'autres mots clés ?",
    answer: "C'est une stratégie de SEA orientée branding.\n\nEnchérir sur sa propre marque permet de protéger sa visibilité contre les concurrents.\n\nCela renforce la notoriété et maîtrise le message visible sur son propre nom.\n\nCela peut dynamiser la campagne même si cela semble redondant."
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Foire Aux Questions</h1>
        <p className="text-muted-foreground mb-8">Consultez les réponses aux questions fréquemment posées</p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher une question..." className="pl-10" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
            <CardDescription>Formation Commerciale Interactive</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-left pl-0">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-left pl-0 m-0">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

