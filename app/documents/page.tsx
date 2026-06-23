'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IA_HREF } from '@/lib/nav-config'
import {
  formatDocumentLabel,
  SITE_DOCUMENT_SECTIONS,
  type SiteDocument,
} from '@/lib/site-documents'
import { cn } from '@/lib/utils'
import { Download, FileText, Presentation, Sparkles } from 'lucide-react'

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

function DocumentCard({ doc }: { doc: SiteDocument }) {
  const isKeynote = doc.format === 'keynote'

  return (
    <Card
      className={cn(
        'overflow-hidden transition-colors',
        doc.featured && 'border-violet-300 bg-gradient-to-br from-violet-50/80 to-transparent',
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isKeynote ? (
              <Presentation className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
            ) : (
              <FileText className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
            )}
            <CardTitle className="text-lg">{doc.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="font-normal">
              {formatDocumentLabel(doc.format)}
            </Badge>
            {doc.badge ? (
              <Badge className="bg-violet-600 hover:bg-violet-600">{doc.badge}</Badge>
            ) : null}
          </div>
        </div>
        <CardDescription>{doc.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          onClick={() => downloadFile(doc.href, doc.downloadFilename)}
          className={cn(doc.featured && 'bg-violet-600 hover:bg-violet-700')}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden />
          Télécharger
        </Button>
        {doc.featured ? (
          <Button asChild variant="outline">
            <Link href={IA_HREF}>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden />
              Générer avec l&apos;IA
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Guides, templates Keynote et fiches plateformes Link Academy. La base de présentation 2026
            sert aussi de template pour les présentations générées depuis l&apos;onglet IA.
          </p>
        </div>

        <div className="space-y-10">
          {SITE_DOCUMENT_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <div className="mb-4">
                <h2 id={`section-${section.id}`} className="text-xl font-semibold">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
              </div>

              {section.id === 'fiches-plateformes' ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((doc) => (
                        <Button
                          key={doc.id}
                          variant="outline"
                          onClick={() => downloadFile(doc.href, doc.downloadFilename)}
                        >
                          <Download className="mr-2 h-4 w-4" aria-hidden />
                          {doc.title}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {section.items.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
