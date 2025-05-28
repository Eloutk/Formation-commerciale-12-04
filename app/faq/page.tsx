import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Questions Fréquentes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
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
    </div>
  )
}

