import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment puis-je accéder à tous les modules de formation ?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Pour accéder à tous les modules de formation, vous devez d'abord créer un compte ou vous connecter.
                    Une fois connecté, vous aurez accès à l'ensemble des modules de formation depuis la page d'accueil.
                    Vous pouvez suivre les modules dans l'ordre de votre choix, mais nous recommandons de commencer par
                    "Méthodologie Link" puis de progresser de manière séquentielle.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Comment fonctionne le système de progression ?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Votre progression est suivie automatiquement lorsque vous complétez les quizz de chaque module. Pour
                    valider un module, vous devez répondre aux questions du quizz correspondant. Votre score est
                    enregistré et contribue à votre progression globale, visible sur la page d'accueil. Si vous
                    n'obtenez pas un bon score à un quizz, vous pouvez le repasser autant de fois que nécessaire.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Quelle est la différence entre les quizz des modules et l'examen final ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Les quizz des modules sont des évaluations courtes (3-5 questions) spécifiques à chaque module,
                    conçues pour tester vos connaissances sur le contenu que vous venez d'étudier. L'examen final, quant
                    à lui, est plus complet et couvre l'ensemble des modules. Il comporte 10 questions variées et vous
                    disposez de 30 minutes pour le compléter. Pour obtenir votre certification, vous devez réussir
                    l'examen final avec un score minimum de 70%.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Puis-je télécharger les contenus de formation pour y accéder hors ligne ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Certains contenus de formation, comme le guide des formats, peuvent être téléchargés via les boutons
                    spécifiques présents dans les modules concernés. Cependant, la majorité du contenu, y compris les
                    quizz interactifs et l'examen final, nécessite une connexion internet pour fonctionner correctement.
                    Si vous avez besoin d'un accès hors ligne à certains contenus spécifiques, veuillez nous contacter
                    via le formulaire de support.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Comment puis-je obtenir de l'aide si j'ai des questions sur un module ?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Si vous avez des questions spécifiques sur le contenu d'un module, vous pouvez utiliser la fonction
                    de recherche dans le glossaire pour trouver des définitions des termes clés. Pour des questions plus
                    détaillées, vous pouvez contacter notre équipe de support via le formulaire disponible dans votre
                    espace personnel. Nous nous efforçons de répondre à toutes les demandes dans un délai de 48 heures
                    ouvrables.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>La formation est-elle régulièrement mise à jour ?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Oui, notre équipe pédagogique met régulièrement à jour le contenu de la formation pour refléter les
                    dernières tendances et évolutions du marketing digital. Chaque module indique sa date de dernière
                    mise à jour. Lorsque des mises à jour significatives sont effectuées, nous en informons les
                    utilisateurs par email et via des notifications sur la plateforme.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Comment obtenir mon certificat après avoir réussi l'examen final ?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Une fois que vous avez réussi l'examen final avec un score d'au moins 70%, votre certificat est
                    automatiquement généré et disponible dans votre espace personnel, dans la section "Mes certificats".
                    Vous pouvez le télécharger au format PDF ou partager directement un lien vers votre certification
                    sur LinkedIn ou d'autres plateformes professionnelles.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

