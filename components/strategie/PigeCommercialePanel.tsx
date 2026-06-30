'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExternalLink, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MON_ESPACE_MES_PROJETS_HREF, MON_ESPACE_PIGE_COMMERCIALE_HREF } from '@/lib/nav-config'
import {
  formatPigeCommercialeSaveDate,
  getDefaultPigeCommercialeProjectName,
} from '@/lib/pige-commerciale-saves'
import {
  createPigeCommercialeSavesBatch,
  getPigeCommercialeProjectById,
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

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp'

type PendingPigeFile = {
  id: string
  file: File
  previewUrl: string
}

function revokePendingPreviews(items: PendingPigeFile[]) {
  for (const item of items) {
    URL.revokeObjectURL(item.previewUrl)
  }
}

type ViewCapture = {
  id: string
  name: string
  filename: string
  imageUrl: string
}

export function PigeCommercialePanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const captureId = searchParams.get('capture')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [pendingFiles, setPendingFiles] = React.useState<PendingPigeFile[]>([])
  const [comment, setComment] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
  const [projectNameInput, setProjectNameInput] = React.useState('')

  const [viewCaptures, setViewCaptures] = React.useState<ViewCapture[]>([])
  const [viewComment, setViewComment] = React.useState<string | null>(null)
  const [viewName, setViewName] = React.useState<string | null>(null)
  const [viewDate, setViewDate] = React.useState<string | null>(null)
  const [loadingView, setLoadingView] = React.useState(false)

  const viewMode = Boolean(projectId || captureId)

  const pendingFilesRef = React.useRef(pendingFiles)
  pendingFilesRef.current = pendingFiles

  React.useEffect(() => {
    return () => {
      revokePendingPreviews(pendingFilesRef.current)
    }
  }, [])

  React.useEffect(() => {
    if (!projectId && !captureId) {
      setViewCaptures([])
      setViewComment(null)
      setViewName(null)
      setViewDate(null)
      return
    }

    let cancelled = false
    setLoadingView(true)
    void (async () => {
      try {
        let resolvedProjectId = projectId
        if (!resolvedProjectId && captureId) {
          const capture = await getPigeCommercialeSaveById(captureId)
          if (cancelled) return
          if (!capture) {
            setError('Projet introuvable.')
            return
          }
          resolvedProjectId = capture.project_id || capture.id
        }

        if (!resolvedProjectId) return

        const project = await getPigeCommercialeProjectById(resolvedProjectId)
        if (cancelled) return
        if (!project) {
          setError('Projet introuvable.')
          return
        }

        const capturesWithUrls = await Promise.all(
          project.captures.map(async (capture) => {
            const imageUrl = (await getPigeImageSignedUrl(capture.image_path)) ?? ''
            return {
              id: capture.id,
              name: capture.name,
              filename: capture.original_filename,
              imageUrl,
            }
          }),
        )

        if (cancelled) return
        setViewCaptures(capturesWithUrls.filter((capture) => capture.imageUrl))
        setViewComment(project.comment)
        setViewName(project.name)
        setViewDate(formatPigeCommercialeSaveDate(project.created_at))
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Impossible de charger le projet.')
        }
      } finally {
        if (!cancelled) setLoadingView(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [projectId, captureId])

  const clearPendingFiles = React.useCallback(() => {
    setPendingFiles((current) => {
      revokePendingPreviews(current)
      return []
    })
    setComment('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    )
    if (selected.length === 0) return

    setPendingFiles((current) => [
      ...current,
      ...selected.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ])
    setError(null)
    setSuccess(null)
    event.target.value = ''
  }

  const removePendingFile = (id: string) => {
    setPendingFiles((current) => {
      const target = current.find((item) => item.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return current.filter((item) => item.id !== id)
    })
  }

  const handleOpenSaveDialog = (event: React.FormEvent) => {
    event.preventDefault()
    if (pendingFiles.length === 0) {
      setError('Sélectionnez au moins une image à enregistrer.')
      return
    }
    setProjectNameInput(getDefaultPigeCommercialeProjectName())
    setSaveDialogOpen(true)
  }

  const handleConfirmSave = async () => {
    if (pendingFiles.length === 0) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const project = await createPigeCommercialeSavesBatch({
        files: pendingFiles.map((item) => item.file),
        projectName: projectNameInput,
        comment,
      })
      setSaveDialogOpen(false)
      setSuccess(
        project.file_count > 1
          ? `Projet « ${project.name} » enregistré avec ${project.file_count} images dans Mon espace → Mes projets → Pige commerciale.`
          : 'Projet enregistré dans Mon espace → Mes projets → Pige commerciale.',
      )
      clearPendingFiles()
      router.push('/mon-espace/mes-projets?section=pige')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
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

      {viewMode ? (
        <Card>
          <CardHeader>
            <CardTitle>{viewName ?? 'Projet enregistré'}</CardTitle>
            {viewDate ? <CardDescription>Enregistré le {viewDate}</CardDescription> : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingView ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Chargement…
              </div>
            ) : viewCaptures.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {viewCaptures.map((capture) => (
                  <div
                    key={capture.id}
                    className="overflow-hidden rounded-lg border bg-muted/30"
                  >
                    <div className="relative w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={capture.imageUrl}
                        alt={capture.filename}
                        className="w-full h-auto"
                      />
                    </div>
                    <p
                      className="truncate px-3 py-2 text-xs text-muted-foreground"
                      title={capture.filename}
                    >
                      {capture.filename}
                    </p>
                  </div>
                ))}
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
          <CardTitle>Enregistrer des captures</CardTitle>
          <CardDescription>
            Importez une ou plusieurs images (captures d&apos;écran) avec un commentaire optionnel
            partagé. Elles seront regroupées sous le nom de projet choisi à l&apos;enregistrement,
            dans{' '}
            <Link href={MON_ESPACE_MES_PROJETS_HREF} className="text-[#E94C16] hover:underline">
              Mon espace → Mes projets
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOpenSaveDialog} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="pige-image">Images</Label>
              <Input
                ref={fileInputRef}
                id="pige-image"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                multiple
                onChange={handleFileChange}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, GIF ou WebP — vous pouvez sélectionner plusieurs fichiers à la fois.
              </p>
            </div>

            {pendingFiles.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {pendingFiles.length} image{pendingFiles.length > 1 ? 's' : ''} sélectionnée
                    {pendingFiles.length > 1 ? 's' : ''}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearPendingFiles}
                    disabled={submitting}
                  >
                    Tout retirer
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingFiles.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-lg border bg-muted/20"
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-2 z-10 h-8 w-8"
                        onClick={() => removePendingFile(item.id)}
                        aria-label={`Retirer ${item.file.name}`}
                        disabled={submitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="relative aspect-video w-full">
                        <Image
                          src={item.previewUrl}
                          alt={item.file.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <p className="truncate px-3 py-2 text-xs text-muted-foreground" title={item.file.name}>
                        {item.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="pige-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="pige-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contexte, annonceur, plateforme, remarques… (commun à toutes les images du projet)"
                rows={4}
                disabled={submitting}
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? <p className="text-sm text-green-700">{success}</p> : null}

            <Button
              type="submit"
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
              disabled={submitting || pendingFiles.length === 0}
            >
              <Upload className="mr-2 h-4 w-4" />
              Enregistrer dans Mon espace
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer le projet</DialogTitle>
            <DialogDescription>
              {pendingFiles.length > 1
                ? `Les ${pendingFiles.length} images seront enregistrées sous ce nom de projet dans Mon espace.`
                : 'Cette image sera enregistrée sous ce nom de projet dans Mon espace.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="pige-project-name">Nom du projet *</Label>
            <Input
              id="pige-project-name"
              placeholder="Ex. Veille concurrent — Meta Q2"
              value={projectNameInput}
              onChange={(e) => setProjectNameInput(e.target.value)}
              disabled={submitting}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
              disabled={submitting || !projectNameInput.trim()}
              onClick={() => void handleConfirmSave()}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement…
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
