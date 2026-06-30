'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatDocumentLabel,
  SITE_DOCUMENT_SECTIONS,
  type SiteDocument,
} from '@/lib/site-documents'
import { Download, FileText, Presentation } from 'lucide-react'

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
  const downloads =
    doc.variants?.length ?
      doc.variants
    : [{ format: doc.format, href: doc.href, downloadFilename: doc.downloadFilename }]
  const isPresentation = downloads.some(
    (item) => item.format === 'powerpoint' || item.format === 'keynote',
  )

  return (
    <Card className="overflow-hidden transition-colors">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isPresentation ? (
              <Presentation className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
            ) : (
              <FileText className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
            )}
            <CardTitle className="text-lg">{doc.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {downloads.map((item) => (
              <Badge key={item.format} variant="outline" className="font-normal">
                {formatDocumentLabel(item.format)}
              </Badge>
            ))}
          </div>
        </div>
        <CardDescription>{doc.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {downloads.map((item) => (
          <Button
            key={item.format}
            variant={downloads.length > 1 ? 'outline' : 'default'}
            onClick={() => downloadFile(item.href, item.downloadFilename)}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden />
            {downloads.length > 1 ?
              `Télécharger ${formatDocumentLabel(item.format)}`
            : 'Télécharger'}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

export default function GuidesDocumentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <FileText className="h-6 w-6" aria-hidden />
            </span>
            Documents
          </h1>
          <p className="text-muted-foreground">
            Guides, templates PowerPoint, Keynote et fiches plateformes Link Academy.
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
