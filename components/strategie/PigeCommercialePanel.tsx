'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExternalLink, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MON_ESPACE_MES_PROJETS_HREF, MON_ESPACE_PIGE_COMMERCIALE_HREF } from '@/lib/nav-config'
import { formatPigeCommercialeSaveDate } from '@/lib/pige-commerciale-saves'
import {
  createPigeCommercialeSave,
  getPigeCommercialeSaveById,
  getPigeImageSignedUrl,
} from '@/lib/pige-commerciale-saves-storage'

const AD_LIBRARIES = [
  {
    id: 'meta',
    label: 'META',
    href: 'https://www.facebook.com/ads/library/',
  },
  {
    id: 'google',
    label: 'Google',
    href: 'https://adstransparency.google.com/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/ad-library/home',
  },
] as const

export function PigeCommercialePanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const captureId = searchParams.get('capture')

  const [file, setFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [comment, setComment] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const [viewImageUrl, setViewImageUrl] = React.useState<string | null>(null)
  const [viewComment, setViewComment] = React.useState<string | null>(null)
  const [viewName, setViewName] = React.useState<string | null>(null)
  const [viewDate, setViewDate] = React.useState<string | null>(null)
  const [loadingView, setLoadingView] = React.useState(false)

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  React.useEffect(() => {
    if (!captureId) {
      setViewImageUrl(null)
      setViewComment(null)
      setViewName(null)
      setViewDate(null)
      return
    }

    let cancelled = false
    setLoadingView(true)
    void (async () => {
      try {
        const record = await getPigeCommercialeSaveById(captureId)
        if (cancelled) return
        if (!record) {
          setError('Capture introuvable.')
          return
        }
        const url = await getPigeImageSignedUrl(record.image_path)
        if (cancelled) return
        setViewImageUrl(url)
        setViewComment(record.comment)
        setViewName(record.name)
        setViewDate(formatPigeCommercialeSaveDate(record.created_at))
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Impossible de charger la capture.')
        }
      } finally {
        if (!cancelled) setLoadingView(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [captureId])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
    setError(null)
    setSuccess(null)
  }

  const clearFile = () => {
    setFile(null)
    setComment('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      setError('Sélectionnez une image à enregistrer.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await createPigeCommercialeSave({ file, comment })
      setSuccess('Capture enregistrée dans Mon espace → Mes projets → Pige commerciale.')
      clearFile()
      router.push('/mon-espace/mes-projets?section=pige')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Bibliothèques publicitaires</CardTitle>
          <CardDescription>
            Consultez les annonces diffusées sur chaque plateforme, puis enregistrez vos captures
            ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3">
          {AD_LIBRARIES.map((item) => (
            <Button key={item.id} asChild variant="outline" className="flex-1 min-w-[140px]">
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>

      {captureId ? (
        <Card>
          <CardHeader>
            <CardTitle>{viewName ?? 'Capture enregistrée'}</CardTitle>
            {viewDate ? <CardDescription>Enregistrée le {viewDate}</CardDescription> : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingView ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Chargement…
              </div>
            ) : viewImageUrl ? (
              <div className="relative w-full overflow-hidden rounded-lg border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={viewImageUrl} alt={viewName ?? 'Capture'} className="w-full h-auto" />
              </div>
            ) : null}
            {viewComment ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewComment}</p>
            ) : null}
            <Button asChild variant="outline">
              <Link href={MON_ESPACE_PIGE_COMMERCIALE_HREF}>Nouvelle capture</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Enregistrer une capture</CardTitle>
          <CardDescription>
            Importez une image (capture d&apos;écran) avec un commentaire optionnel. Elle sera
            disponible dans{' '}
            <Link href={MON_ESPACE_MES_PROJETS_HREF} className="text-[#E94C16] hover:underline">
              Mon espace → Mes projets
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="pige-image">Image</Label>
              <Input
                id="pige-image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                disabled={submitting}
              />
            </div>

            {previewUrl ? (
              <div className="relative rounded-lg border overflow-hidden bg-muted/20">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-2 z-10 h-8 w-8"
                  onClick={clearFile}
                  aria-label="Retirer l'image"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="relative aspect-video w-full">
                  <Image src={previewUrl} alt="Aperçu" fill className="object-contain" unoptimized />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="pige-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="pige-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contexte, annonceur, plateforme, remarques…"
                rows={4}
                disabled={submitting}
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? <p className="text-sm text-green-700">{success}</p> : null}

            <Button
              type="submit"
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
              disabled={submitting || !file}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enregistrer dans Mon espace
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
