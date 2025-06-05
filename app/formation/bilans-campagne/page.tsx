import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function BilansCampagne() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bilans de Campagne</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suivi et analyse des campagnes</CardTitle>
            <CardDescription>Accédez à des bilans interactifs et transparents pour chaque campagne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="my-8">
              <Image
                src="/images/Exemple-bilanscampagne.png"
                alt="Exemple de bilan de campagne"
                width={800}
                height={400}
                className="rounded-lg border shadow-sm mx-auto"
              />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Exemple de bilan interactif fourni à nos clients
              </p>
            </div>
            <div className="prose max-w-2xl mx-auto text-justify">
              <p>
                Pour chaque campagne vendue, nous mettons à disposition un <strong>bilan en ligne, interactif et mis à jour en temps réel</strong>.<br />
                Ce support permet à nos clients de <strong>suivre facilement les performances clés</strong> de leur campagne digitale (impressions, clics, audiences touchées, etc.), avec un accès permanent et transparent aux données.<br />
                L'objectif : <strong>renforcer la compréhension</strong>, <strong>favoriser l'échange</strong> et <strong>identifier ensemble les axes d'optimisation</strong> pour les actions à venir.
              </p>
              <div className="flex justify-center mt-6">
                <Link href="https://lookerstudio.google.com/u/0/reporting/99ee72f8-ed6a-4275-bafe-59b5cc74fb3f/page/bRiXB/edit" target="_blank">
                  <Button>
                    Exemple concret de bilan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Bilan mi-campagne</h3>
                <p className="text-justify">
                  Le bilan mi-campagne permet de faire un point d'étape sur les performances en cours et de vérifier que les objectifs sont bien engagés.<br />
                  C'est aussi l'occasion d'ajuster certaines actions si nécessaire (messages, ciblages, formats) pour optimiser la suite de la diffusion.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Bilan fin de campagne</h3>
                <p className="text-justify">
                  Le bilan de fin de campagne offre une vue complète des résultats et des indicateurs clés obtenus.<br />
                  Il permet d'évaluer l'efficacité des actions menées, de tirer des enseignements et de construire les prochaines recommandations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 