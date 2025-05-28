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
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-start gap-3 bg-white border border-orange-400 rounded-lg shadow p-4 w-full max-w-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                  <div className="text-orange-900 text-base font-semibold text-justify w-full">
                    <span className="font-bold">À savoir :</span> Les bilans sont réalisés uniquement à la demande et ne sont pas automatiques.<br />Ils ne seront effectués que s'ils apportent une réelle valeur ajoutée pour le client.
                  </div>
                </div>
              </div>
            </div>
            <div className="prose max-w-2xl mx-auto text-justify">
              <p>
                Pour chaque campagne vendue, nous mettons à disposition un <strong>bilan en ligne, interactif et mis à jour en temps réel (max 48h après le début de la campagne)</strong>.<br />
                Ce support permet à nos clients de <strong>suivre en direct et en toute transparence les performances clés</strong> de leur campagne digitale (impressions, clics, audiences touchées, etc.).
              </p>
              <div className="flex justify-center mt-6 gap-4">
                <Link href="https://lookerstudio.google.com/u/0/reporting/99ee72f8-ed6a-4275-bafe-59b5cc74fb3f/page/bRiXB/edit" target="_blank">
                  <Button>
                    Exemple concret de bilan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://vimeo.com/814894245/c4b8212ce8?turnstile=0.qPX-fX3W1QEmGGtOgPKV-b27tAA2nTvKJ2W_HXysjubzk3vOExAvSMH4vK6z0SG9rSHOCb44QzIKcWRJlO71WZP9vCfrAqMZnk7-vmmmTAnKUI_JrlShJONztpcmE34lnffOeBjY-N1qNnxRS5fGXYjs3nTNpGgQsR1dWI2FIec4BNS64PWIRnI1ohHXj8SDKq52Bu5OyC8dfhqctMAv4Wu4JipzS5ZTwr7YAo-ghCy5BjUAF598CAY3iZLN9GjMsVKCeLuKIc67ZYkM2A8cgHXdFixWbgd2-LiZhHOHnRykW24M-IvMBzSEA2OapiAwARsM4t70OIDpx6sPe3W2HS0YbkZQstAT5VU4KQN8KO_avvBBiGNZLT-tyBVt3-GgXGM4N2sGSAUi-BU6KE4C5yPmCrIFOJXKvFMQgwjnqDkOqMvLvQ76p8wt0Q--ZwDDXw5WW-Ush6q_PdE_WC7-1MfIJz_k1TPgxbw5u100yLBId6BoSVDjx9mdy3N4s-OGQ5fpzEvtotyqb448dbbHcXmej0AXlL1WEcK78fNLcpG9uC-s3CchmSfpd6-nA8QOUTC2W4HEr3F5NJug3124wptZlmyWOcxi8RIlNjpW749mQwf3I6PNpgEUCjedpjYXqH66uN1a1Pi3T55n0OGHZQO9PsQdYGeHLkmLjSK2mEbzHMLJTsQ9tpgKu89rtFdZ5rXCPZ_bK6zY23hKZ4DbzQkd5zdHAv5iirvsJHqurAmre5CKKT8FvxBGvSqXaUDRr_vyxRd22umbw-Scc0YCFiycNtELBSQcOjCd1kqbBAYlVneKwK-dJlmTIO3_ALf3hulWm9bc_3TSy_64OlvgWS8jz8TfJEhba5WvZT9FrQaZKUr45QvgN_v5cTVvIRKTCsQLsXEcJ-kk38mkx02sPg.Mn6woBBBPPHiJf-gHUn8TQ.fe1100899a63a783f1cd3d5de1c624e059c250d87b415b801fd2a479f16adb28" target="_blank">
                  <Button variant="secondary">
                    Tutoriel Bilans
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-8 mt-8">
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