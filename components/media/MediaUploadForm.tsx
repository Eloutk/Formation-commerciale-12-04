'use client'

import * as React from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MediaSectorPicker } from '@/components/media/MediaSectorPicker'
import { MediaPlatformPicker } from '@/components/media/MediaPlatformPicker'
import { MEDIA_MONTHS, MEDIA_YEARS } from '@/lib/media-config'
import { cn } from '@/lib/utils'

const NONE = '__none__'

type MediaUploadFormProps = {
  configured: boolean
  onSuccess?: () => void
}

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} Mo`
}

export function MediaUploadForm({ configured, onSuccess }: MediaUploadFormProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [sectors, setSectors] = React.useState<string[]>([])
  const [platforms, setPlatforms] = React.useState<string[]>([])
  const [month, setMonth] = React.useState('')
  const [year, setYear] = React.useState('')
  const [clientName, setClientName] = React.useState('')
  const [campaignName, setCampaignName] = React.useState('')
  const [reportLink, setReportLink] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const isValid =
    configured &&
    files.length > 0 &&
    sectors.length > 0 &&
    platforms.length > 0 &&
    !!clientName.trim() &&
    !!campaignName.trim()

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`))
      const next = [...prev]
      Array.from(incoming).forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`
        if (!existing.has(key)) {
          existing.add(key)
          next.push(file)
        }
      })
      return next
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValid || files.length === 0) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    sectors.forEach((sector) => formData.append('sectors', sector))
    platforms.forEach((platform) => formData.append('platforms', platform))
    if (month) formData.append('month', month)
    if (year) formData.append('year', year)
    formData.append('client_name', clientName.trim())
    formData.append('campaign_name', campaignName.trim())
    if (reportLink.trim()) formData.append('report_link', reportLink.trim())

    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData })
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json.error || 'Échec de l’enregistrement')
        return
      }

      let message = json.message || 'Médias enregistrés avec succès.'
      if (json.failed?.length) {
        message += ` ${json.failed.length} fichier(s) en échec : ${json.failed.map((f: { filename: string }) => f.filename).join(', ')}.`
      }

      setSuccess(message)
      setFiles([])
      setSectors([])
      setPlatforms([])
      setMonth('')
      setYear('')
      setClientName('')
      setCampaignName('')
      setReportLink('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      onSuccess?.()
    } catch {
      setError('Erreur réseau lors de l’upload')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-[#E94C16]" aria-hidden />
          Déposer un média
        </CardTitle>
        <CardDescription>
          Ajoutez un ou plusieurs fichiers avec les mêmes informations. Mois et année sont optionnels.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-3">
            <Label htmlFor="media-file">Fichiers *</Label>
            <button
              type="button"
              disabled={!configured || submitting}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors',
                files.length > 0
                  ? 'border-[#E94C16]/40 bg-orange-50/50'
                  : 'border-border hover:border-[#E94C16]/30 hover:bg-muted/30',
              )}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              {files.length > 0 ? (
                <>
                  <span className="font-medium text-sm">
                    {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-muted-foreground">Cliquer pour en ajouter d&apos;autres</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-sm">Cliquez pour choisir des fichiers</span>
                  <span className="text-xs text-muted-foreground">Images, vidéos, PDF ou ZIP — sélection multiple possible</span>
                </>
              )}
            </button>
            <Input
              ref={fileInputRef}
              id="media-file"
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.zip"
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ''
              }}
              disabled={!configured || submitting}
            />

            {files.length > 0 ? (
              <ul className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-600"
                      onClick={() => removeFile(index)}
                      disabled={submitting}
                      aria-label={`Retirer ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className="space-y-3">
            <div>
              <Label>Secteurs d&apos;activité *</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Cochez un ou plusieurs secteurs concernés par ces médias.
              </p>
            </div>
            <MediaSectorPicker
              value={sectors}
              onChange={setSectors}
              disabled={!configured || submitting}
            />
          </section>

          <section className="space-y-3">
            <div>
              <Label>Plateformes *</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Cochez une ou plusieurs plateformes concernées par ces médias.
              </p>
            </div>
            <MediaPlatformPicker
              value={platforms}
              onChange={setPlatforms}
              disabled={!configured || submitting}
            />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="client-name">Nom du client *</Label>
              <Input
                id="client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex : Carrefour"
                disabled={!configured || submitting}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="campaign-name">Nom de la campagne *</Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Ex : Lancement été 2026"
                disabled={!configured || submitting}
              />
            </div>
          </section>

          <section className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Période (optionnel)</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Mois</Label>
                <Select
                  value={month || NONE}
                  onValueChange={(v) => setMonth(v === NONE ? '' : v)}
                  disabled={!configured || submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Non renseigné" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Non renseigné</SelectItem>
                    {MEDIA_MONTHS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Année</Label>
                <Select
                  value={year || NONE}
                  onValueChange={(v) => setYear(v === NONE ? '' : v)}
                  disabled={!configured || submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Non renseignée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Non renseignée</SelectItem>
                    {MEDIA_YEARS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <Label htmlFor="report-link">Lien du rapport (optionnel)</Label>
            <Input
              id="report-link"
              type="url"
              value={reportLink}
              onChange={(e) => setReportLink(e.target.value)}
              placeholder="https://..."
              disabled={!configured || submitting}
            />
          </section>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <Button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full sm:w-auto bg-[#E94C16] hover:bg-[#d43f12] text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement de {files.length} fichier{files.length > 1 ? 's' : ''}…
              </>
            ) : files.length > 1 ? (
              `Enregistrer ${files.length} médias`
            ) : (
              'Enregistrer le média'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
