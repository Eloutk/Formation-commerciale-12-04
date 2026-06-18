'use client'

import * as React from 'react'
import {
  Download,
  ExternalLink,
  FileText,
  Film,
  Loader2,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatMediaPeriod, type MediaAsset } from '@/lib/media-config'
import { MediaSectorBadges } from '@/components/media/MediaSectorPicker'
import { MediaPlatformBadges } from '@/components/media/MediaPlatformPicker'

function isImageType(mime: string | null, filename: string) {
  return (
    mime?.startsWith('image/') ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
  )
}

function isVideoType(mime: string | null, filename: string) {
  return mime?.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(filename)
}

function isPdfType(mime: string | null, filename: string) {
  return mime === 'application/pdf' || /\.pdf$/i.test(filename)
}

async function fetchMediaUrl(id: string) {
  const res = await fetch(`/api/media/${id}/download`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.url) {
    throw new Error(json.error || 'Impossible de charger le fichier')
  }
  return json.url as string
}

function MediaPreview({
  url,
  item,
  className,
}: {
  url: string
  item: MediaAsset
  className?: string
}) {
  if (isImageType(item.mime_type, item.original_filename)) {
    return (
      <img
        src={url}
        alt={`Aperçu ${item.campaign_name}`}
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  if (isVideoType(item.mime_type, item.original_filename)) {
    return (
      <video
        src={url}
        muted
        playsInline
        preload="metadata"
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  if (isPdfType(item.mime_type, item.original_filename)) {
    return (
      <div className={cn('flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-50 text-slate-500', className)}>
        <FileText className="h-8 w-8" aria-hidden />
        <span className="text-[10px] font-medium uppercase tracking-wide">PDF</span>
      </div>
    )
  }

  return (
    <div className={cn('flex h-full w-full items-center justify-center bg-slate-50 text-slate-400', className)}>
      <Film className="h-8 w-8" aria-hidden />
    </div>
  )
}

function MediaPreviewDialog({
  open,
  onOpenChange,
  url,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  item: MediaAsset
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(96vw,56rem)] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-base">
            {item.client_name} — {item.campaign_name}
          </DialogTitle>
          {formatMediaPeriod(item.month, item.year) ? (
            <p className="text-sm text-muted-foreground font-normal">{formatMediaPeriod(item.month, item.year)}</p>
          ) : null}
          <MediaPlatformBadges platforms={item.platforms} />
          <MediaSectorBadges sectors={item.sectors} />
        </DialogHeader>
        <div className="px-6 pb-6">
          {isImageType(item.mime_type, item.original_filename) ? (
            <img
              src={url}
              alt={item.campaign_name}
              className="max-h-[75vh] w-full rounded-md object-contain bg-slate-50"
            />
          ) : isVideoType(item.mime_type, item.original_filename) ? (
            <video
              src={url}
              controls
              playsInline
              className="max-h-[75vh] w-full rounded-md bg-black"
            />
          ) : isPdfType(item.mime_type, item.original_filename) ? (
            <iframe
              src={url}
              title={item.campaign_name}
              className="h-[75vh] w-full rounded-md border bg-white"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-md border bg-slate-50 py-12 text-muted-foreground">
              <Film className="h-10 w-10" />
              <p className="text-sm">Aperçu non disponible pour ce type de fichier.</p>
              <Button asChild variant="outline" size="sm">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Ouvrir le fichier
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MediaAssetCard({ item }: { item: MediaAsset }) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = React.useState(true)
  const [previewError, setPreviewError] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setLoadingPreview(true)
    setPreviewError(false)

    fetchMediaUrl(item.id)
      .then((url) => {
        if (!cancelled) setPreviewUrl(url)
      })
      .catch(() => {
        if (!cancelled) setPreviewError(true)
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false)
      })

    return () => {
      cancelled = true
    }
  }, [item.id])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const url = previewUrl ?? (await fetchMediaUrl(item.id))
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      alert('Téléchargement impossible')
    } finally {
      setDownloading(false)
    }
  }

  const canPreview = previewUrl && !previewError

  return (
    <>
      <div className="rounded-xl border border-border/80 bg-card p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 shadow-sm">
        <button
          type="button"
          className={cn(
            'group relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-slate-50',
            canPreview && 'cursor-zoom-in hover:ring-2 hover:ring-[#E94C16]/40',
          )}
          onClick={() => canPreview && setPreviewOpen(true)}
          disabled={!canPreview}
          aria-label={canPreview ? 'Agrandir l’aperçu' : 'Aperçu indisponible'}
        >
          {loadingPreview ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : previewError || !previewUrl ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Film className="h-7 w-7" />
            </div>
          ) : (
            <>
              <MediaPreview url={previewUrl} item={item} />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                <Maximize2 className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-medium">{item.client_name} — {item.campaign_name}</p>
          <MediaPlatformBadges platforms={item.platforms} />
          <MediaSectorBadges sectors={item.sectors} />
          {formatMediaPeriod(item.month, item.year) ? (
            <p className="text-xs text-muted-foreground">{formatMediaPeriod(item.month, item.year)}</p>
          ) : null}
          {item.uploaded_by_name ? (
            <p className="text-xs text-muted-foreground">Déposé par {item.uploaded_by_name}</p>
          ) : null}
          <p className="text-xs text-muted-foreground truncate">{item.original_filename}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-start">
          {item.report_link ? (
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <a
                href={item.report_link}
                target="_blank"
                rel="noopener noreferrer"
                title="Ouvrir le rapport"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Télécharger"
            disabled={downloading || loadingPreview}
            onClick={handleDownload}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {previewUrl ? (
        <MediaPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          url={previewUrl}
          item={item}
        />
      ) : null}
    </>
  )
}
