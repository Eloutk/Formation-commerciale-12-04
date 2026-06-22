'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

function downloadFile(href: string, filename: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.onerror = () => {
    alert('Le document n\'est pas disponible pour le moment. Veuillez réessayer plus tard.')
  }
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const FICHES_PLATEFORMES = [
  'Instagram.pdf',
  'LinkedIn.pdf',
  'Youtube.pdf',
  'Snapchat.pdf',
  'Spotify.pdf',
  'Tiktok.pdf',
  'Search.pdf',
] as const

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-muted-foreground mb-8">Consultez les documents disponibles</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guide des formats</CardTitle>
              <CardDescription>Documentation sur les formats publicitaires et leurs contraintes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => downloadFile(
                  '/Guide des formats visuels et des contraintes.pdf',
                  'Guide des formats visuels et des contraintes.pdf'
                )}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le guide des formats
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guide de la chefferie de projet diffusion et production</CardTitle>
              <CardDescription>Chefferie de projet, Monday, rapports, devis et besoins n'auront plus de secret pour vous</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => downloadFile(
                  '/Guide de la Chefferie de Projet - V1.pdf',
                  'Guide de la chefferie de projet - V1.pdf'
                )}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le guide des chefs de projet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guide Performance Ads</CardTitle>
              <CardDescription>Guide des performances publicitaires — version 1.2</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => downloadFile(
                  '/Guide Performance Ads V1.2.pdf',
                  'Guide Performance Ads V1.2.pdf'
                )}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le guide Performance Ads
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Présentation Link 2026</CardTitle>
              <CardDescription>
                Base de présentation Keynote — mise à jour du 28/04/26
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => downloadFile(
                  '/Link 2026 (maj 280426).key',
                  'Link 2026 (maj 280426).key'
                )}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger la présentation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formation studio janvier 2026</CardTitle>
              <CardDescription>
                Présentation Keynote — version 3.5 LITE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => downloadFile(
                  '/Formation studio janvier 2026 3.5 Version LITE.key',
                  'Formation studio janvier 2026 3.5 Version LITE.key'
                )}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger la formation studio
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fiches plateformes</CardTitle>
              <CardDescription>
                Fiches récapitulatives par plateforme publicitaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {FICHES_PLATEFORMES.map((filename) => {
                  const label = filename.replace('.pdf', '')
                  return (
                    <Button
                      key={filename}
                      onClick={() => downloadFile(`/${filename}`, filename)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
