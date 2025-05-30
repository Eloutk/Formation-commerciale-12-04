"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function BilansCampagne() {
  const images = [
    {
      src: "/images/Rapports-analyse.png",
      alt: "Rapports analyse 1"
    },
    {
      src: "/images/Rapports-analyse2.png",
      alt: "Rapports analyse 2"
    },
    {
      src: "/images/Rapports-definitions.png",
      alt: "Rapports définitions"
    }
  ];
  const [current, setCurrent] = useState(0);
  const prevImage = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rapports de Campagne</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suivi et analyse des campagnes</CardTitle>
            <CardDescription>Accédez à des bilans interactifs et transparents pour chaque campagne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center my-8">
              <div className="relative w-full max-w-5xl flex items-center justify-center">
                <button
                  onClick={prevImage}
                  className="absolute left-0 z-10"
                  aria-label="Image précédente"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <span style={{ fontSize: 32 }}>&#8592;</span>
                </button>
                <Image
                  src={images[current].src}
                  alt={images[current].alt}
                  width={1100}
                  height={600}
                  className="rounded-lg shadow-sm mx-auto"
                />
                <button
                  onClick={nextImage}
                  className="absolute right-0 z-10"
                  aria-label="Image suivante"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <span style={{ fontSize: 32 }}>&#8594;</span>
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-3 h-3 rounded-full ${idx === current ? 'bg-orange-600' : 'bg-gray-300'}`}
                  />
                ))}
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