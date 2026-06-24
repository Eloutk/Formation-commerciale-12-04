'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Copy,
  Download,
  ImageIcon,
  Loader2,
  Presentation,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IA_ACTIONS, type IaActionDefinition, type IaActionId } from '@/lib/ia-actions'
import type { IaAnalysisRecord } from '@/lib/ia-analyses'
import { getIaAnalysisById } from '@/lib/ia-analyses-storage'
import { IaPdfUploadField } from '@/components/ia/ia-pdf-upload'
import { IaOutputModeFields } from '@/components/ia/ia-output-mode-fields'
import { type IaPrezOutputMode, isPresentationAnalysisName } from '@/lib/ia-prez'
import { parseContentDispositionFilename } from '@/lib/http-download-headers'
import { MON_ESPACE_HREF } from '@/lib/nav-config'
import { cn } from '@/lib/utils'
import { useIaGeneration } from '@/components/ia/ia-generation-context'

const PRESENTATION_NOTICE_MESSAGES: Record<string, string> = {
  'template-only':
    'Template PowerPoint copié — le remplissage automatique n\'a pas pu être appliqué.',
  'no-slides':
    'Aucune slide détectée dans l\'analyse IA — le template vierge a été téléchargé. Relancez en mode Présentation globale ou vérifiez le format des slides.',
  'fill-failed':
    'Le template a été téléchargé mais le remplissage automatique a échoué. Ouvrez PowerPoint et copiez le contenu slide par slide depuis l\'analyse.',
  'partial-fill':
    'Remplissage partiel : certaines slides n\'ont pas pu être mises à jour automatiquement. Complétez le fichier dans PowerPoint si besoin.',
}

function IaPresentationResult({
  record,
  analysis,
  presentationDownloadUrl,
  subtitle,
}: {
  record?: IaAnalysisRecord | null
  analysis: string
  presentationDownloadUrl: string
  subtitle?: string
}) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showScript, setShowScript] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    setDownloadError(null)
    try {
      const response = await fetch(presentationDownloadUrl)
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Téléchargement PowerPoint impossible.')
      }

      const noticeCode = response.headers.get('X-Presentation-Notice-Code')
      const blob = await response.blob()
      const disposition = response.headers.get('Content-Disposition') ?? ''
      const filename = parseContentDispositionFilename(disposition)

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)

      if (noticeCode) {
        setDownloadError(PRESENTATION_NOTICE_MESSAGES[noticeCode] ?? null)
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Téléchargement PowerPoint impossible.'
      const message =
        raw === 'Failed to fetch'
          ? 'La génération du PowerPoint a échoué côté serveur (connexion interrompue). Réessayez dans quelques secondes.'
          : raw
      setDownloadError(message)
    } finally {
      setDownloading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Presentation className="h-5 w-5 text-[#E94C16]" aria-hidden />
            {record?.name ?? 'Présentation PowerPoint'}
          </CardTitle>
          {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
          {record ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Enregistré dans Mon espace ·{' '}
              <Link href={MON_ESPACE_HREF} className="text-[#E94C16] hover:underline">
                Voir toutes les analyses
              </Link>
            </p>
          ) : null}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
          <Copy className="mr-2 h-4 w-4" aria-hidden />
          {copied ? 'Copié' : 'Copier le script'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-[#E94C16]/25 bg-[#E94C16]/[0.06] p-5">
          <p className="mb-3 text-sm text-foreground">
            Votre présentation est prête. Téléchargez le fichier PowerPoint (.pptx) généré à partir du
            template Link.
          </p>
          <Button
            type="button"
            className="bg-[#E94C16] hover:bg-[#d43f12]"
            disabled={downloading}
            onClick={() => void handleDownload()}
          >
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="mr-2 h-4 w-4" aria-hidden />
            )}
            {downloading ? 'Génération du .pptx…' : 'Télécharger la présentation (.pptx)'}
          </Button>
          {downloadError ? (
            <p
              className={cn(
                'mt-3 text-sm',
                downloadError.includes('Template copié') || downloadError.includes('macOS')
                  ? 'text-amber-700'
                  : 'text-destructive',
              )}
            >
              {downloadError}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          className="text-sm text-[#E94C16] hover:underline"
          onClick={() => setShowScript((value) => !value)}
        >
          {showScript ? 'Masquer le contenu slide par slide' : 'Voir le contenu slide par slide'}
        </button>

        {showScript ? (
          <div className="max-h-[560px] overflow-y-auto rounded-md border bg-muted/20 p-4">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
              {analysis}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function IaAnalysisResult({
  record,
  analysis,
  subtitle,
}: {
  record?: IaAnalysisRecord | null
  analysis: string
  subtitle?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg">{record?.name ?? 'Résultat'}</CardTitle>
          {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
          {record ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Enregistré dans Mon espace ·{' '}
              <Link href={MON_ESPACE_HREF} className="text-[#E94C16] hover:underline">
                Voir toutes les analyses
              </Link>
            </p>
          ) : null}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void handleCopy()}>
          <Copy className="mr-2 h-4 w-4" aria-hidden />
          {copied ? 'Copié' : 'Copier'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="max-h-[560px] overflow-y-auto rounded-md border bg-muted/20 p-4">
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
            {analysis}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionForm({
  action,
  onResult,
}: {
  action: IaActionDefinition
  onResult: (
    analysis: string,
    record: IaAnalysisRecord | null,
    options?: { outputMode?: IaPrezOutputMode; presentationDownloadUrl?: string | null },
  ) => void
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [pdfFiles, setPdfFiles] = useState<File[]>([])
  const [clientImage, setClientImage] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [clientName, setClientName] = useState('')
  const [analysisName, setAnalysisName] = useState('')
  const [outputMode, setOutputMode] = useState<IaPrezOutputMode>('written')
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const { setIsGenerating, registerAbort } = useIaGeneration()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    registerAbort(() => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = null
      setRunning(false)
      setIsGenerating(false)
    })
    return () => registerAbort(null)
  }, [registerAbort, setIsGenerating])

  useEffect(() => {
    setPdfFiles([])
    setClientImage(null)
    setUrl('')
    setAnalysisName('')
    setOutputMode('written')
    setError(null)
  }, [action.id])

  const canRun = useMemo(() => {
    if (running) return false
    if (action.inputKind === 'pdf') return pdfFiles.length > 0
    if (action.inputKind === 'url') return url.trim().length > 0
    if (action.inputKind === 'pdf_and_image') return pdfFiles.length > 0 && !!clientImage
    return false
  }, [action.inputKind, clientImage, pdfFiles.length, running, url])

  const handleRun = async () => {
    setRunning(true)
    setIsGenerating(true)
    setError(null)
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    try {
      const formData = new FormData()
      formData.append('actionId', action.id)
      formData.append('outputMode', outputMode)
      if (clientName.trim()) formData.append('clientName', clientName.trim())
      if (analysisName.trim()) formData.append('name', analysisName.trim())
      for (const file of pdfFiles) formData.append('files', file)
      if (clientImage) formData.append('clientImage', clientImage)
      if (url.trim()) formData.append('url', url.trim())

      const response = await fetch('/api/ia/run', {
        method: 'POST',
        body: formData,
        signal: abortController.signal,
      })
      const payload = (await response.json()) as {
        analysis?: string
        record?: IaAnalysisRecord
        outputMode?: IaPrezOutputMode
        presentationDownloadUrl?: string | null
        error?: string
      }

      if (!response.ok) {
        throw new Error(payload.error || 'Analyse impossible.')
      }

      onResult(payload.analysis ?? '', payload.record ?? null, {
        outputMode: payload.outputMode,
        presentationDownloadUrl: payload.presentationDownloadUrl ?? null,
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Analyse impossible.')
    } finally {
      abortControllerRef.current = null
      setRunning(false)
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-5">
      <IaOutputModeFields outputMode={outputMode} onOutputModeChange={setOutputMode} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`client-${action.id}`}>Nom du client (optionnel)</Label>
          <Input
            id={`client-${action.id}`}
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            placeholder="Ex. Boulangerie Martin"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`name-${action.id}`}>Nom de l&apos;analyse (optionnel)</Label>
          <Input
            id={`name-${action.id}`}
            value={analysisName}
            onChange={(event) => setAnalysisName(event.target.value)}
            placeholder="Titre dans Mon espace"
          />
        </div>
      </div>

      {(action.inputKind === 'pdf' || action.inputKind === 'pdf_and_image') && (
        <IaPdfUploadField
          idPrefix={`pdf-${action.id}`}
          files={pdfFiles}
          onFilesChange={setPdfFiles}
          onError={setError}
        />
      )}

      {action.inputKind === 'pdf_and_image' && (
        <div className="space-y-2">
          <Label>Photo client</Label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setClientImage(event.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            className="justify-start gap-2"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" aria-hidden />
            {clientImage ? 'Changer la photo' : 'Importer une photo'}
          </Button>
          {clientImage ? (
            <p className="truncate text-sm text-muted-foreground">{clientImage.name}</p>
          ) : null}
        </div>
      )}

      {action.inputKind === 'url' && (
        <div className="space-y-2">
          <Label htmlFor={`url-${action.id}`}>URL</Label>
          <Input
            id={`url-${action.id}`}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com ou linkedin.com/company/..."
          />
          <p className="text-xs text-muted-foreground">
            Le contenu public de la page est extrait côté serveur. Certaines pages (réseaux sociaux
            connectés) peuvent être partiellement accessibles.
          </p>
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="button"
        className="bg-[#E94C16] hover:bg-[#d43f12]"
        disabled={!canRun}
        onClick={() => void handleRun()}
      >
        {running ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" aria-hidden />
        )}
        {running ? 'Analyse en cours…' : outputMode === 'written' ? `Lancer : ${action.label}` : 'Générer la présentation'}
      </Button>
    </div>
  )
}

type IaActionsPanelProps = {
  initialAnalysisId?: string | null
  initialActionId?: IaActionId | null
}

export function IaActionsPanel({ initialAnalysisId, initialActionId }: IaActionsPanelProps) {
  const { requestLeave } = useIaGeneration()
  const [selectedId, setSelectedId] = useState<IaActionId | null>(initialActionId ?? null)
  const [result, setResult] = useState<string | null>(null)
  const [resultRecord, setResultRecord] = useState<IaAnalysisRecord | null>(null)
  const [resultOutputMode, setResultOutputMode] = useState<IaPrezOutputMode | null>(null)
  const [presentationDownloadUrl, setPresentationDownloadUrl] = useState<string | null>(null)
  const [loadingSaved, setLoadingSaved] = useState(false)

  const selectedAction = useMemo(
    () => IA_ACTIONS.find((action) => action.id === selectedId) ?? null,
    [selectedId],
  )

  useEffect(() => {
    if (!initialAnalysisId) return
    let cancelled = false
    setLoadingSaved(true)
    void getIaAnalysisById(initialAnalysisId)
      .then((record) => {
        if (cancelled || !record) return
        setSelectedId(record.action_id)
        setResult(record.result)
        setResultRecord(record)
        if (isPresentationAnalysisName(record.name)) {
          setResultOutputMode('presentation')
          setPresentationDownloadUrl(`/api/ia/pptx/${record.id}`)
        } else {
          setResultOutputMode('written')
          setPresentationDownloadUrl(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSaved(false)
      })
    return () => {
      cancelled = true
    }
  }, [initialAnalysisId])

  const handleResult = (
    analysis: string,
    record: IaAnalysisRecord | null,
    options?: { outputMode?: IaPrezOutputMode; presentationDownloadUrl?: string | null },
  ) => {
    setResult(analysis)
    setResultRecord(record)
    setResultOutputMode(options?.outputMode ?? null)
    setPresentationDownloadUrl(options?.presentationDownloadUrl ?? null)
  }

  const handleSelectAction = (id: IaActionId) => {
    if (id === selectedId) return
    requestLeave({
      kind: 'callback',
      run: () => {
        setSelectedId(id)
        setResult(null)
        setResultRecord(null)
        setResultOutputMode(null)
        setPresentationDownloadUrl(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      {loadingSaved ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement de l&apos;analyse…
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {IA_ACTIONS.map((action) => {
          const isSelected = selectedId === action.id
          const isSoon = action.status === 'coming_soon'
          return (
            <button
              key={action.id}
              type="button"
              disabled={isSoon}
              onClick={() => !isSoon && handleSelectAction(action.id)}
              className={cn(
                'rounded-xl border p-4 text-left transition-colors',
                isSoon && 'cursor-not-allowed opacity-70',
                isSelected
                  ? 'border-[#E94C16] bg-[#E94C16]/[0.08] ring-1 ring-[#E94C16]/30'
                  : 'border-border bg-card hover:border-[#E94C16]/40 hover:bg-[#E94C16]/[0.04]',
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="font-semibold text-foreground">{action.label}</span>
                {isSoon ? (
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    À cadrer
                  </Badge>
                ) : (
                  <Badge className="shrink-0 bg-[#E94C16] text-[10px] hover:bg-[#E94C16]">
                    Disponible
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </button>
          )
        })}
      </div>

      {selectedAction ? (
        <Card className="overflow-hidden border-border/80">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.08] to-transparent">
            <CardTitle className="text-xl">{selectedAction.label}</CardTitle>
            <CardDescription>{selectedAction.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ActionForm action={selectedAction} onResult={handleResult} />
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Sélectionnez une action ci-dessus pour lancer une analyse.
        </p>
      )}

      {result ? (
        resultOutputMode === 'presentation' && presentationDownloadUrl ? (
          <IaPresentationResult
            record={resultRecord}
            analysis={result}
            presentationDownloadUrl={presentationDownloadUrl}
            subtitle={resultRecord?.input_label ?? undefined}
          />
        ) : (
          <IaAnalysisResult
            record={resultRecord}
            analysis={result}
            subtitle={resultRecord?.input_label ?? undefined}
          />
        )
      ) : null}
    </div>
  )
}
