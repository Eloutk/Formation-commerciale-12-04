'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getConfiguredCtaObjectivesForPlatform,
  getConfiguredCtaPlatforms,
  getCtaOptionsForSelection,
  getCtaSelectionNote,
  getDefaultConfiguredCtaObjective,
  isFixedCtaSelection,
} from '@/lib/platform-cta-options'
import { PLATFORM_LOGOS, type SocialMediaPlatform } from '@/lib/social-media-platform-objectives'

function PlatformOptionLabel({ platform }: { platform: SocialMediaPlatform }) {
  const logo = PLATFORM_LOGOS[platform]

  return (
    <span className="flex items-center gap-2">
      {logo ? (
        <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-sm">
          <Image src={logo} alt="" fill className="object-contain" sizes="16px" />
        </span>
      ) : null}
      <span>{platform}</span>
    </span>
  )
}

const INITIAL_PLATFORM = getConfiguredCtaPlatforms()[0]
const INITIAL_OBJECTIVE = getDefaultConfiguredCtaObjective(INITIAL_PLATFORM)

export default function CtaPage() {
  const platforms = useMemo(() => getConfiguredCtaPlatforms(), [])

  const [platform, setPlatform] = useState<SocialMediaPlatform>(INITIAL_PLATFORM)
  const [objective, setObjective] = useState(INITIAL_OBJECTIVE)

  const objectives = useMemo(
    () => getConfiguredCtaObjectivesForPlatform(platform),
    [platform],
  )

  const ctaOptions = useMemo(
    () => getCtaOptionsForSelection(platform, objective),
    [platform, objective],
  )
  const isFixedCta = isFixedCtaSelection(ctaOptions)
  const ctaNote = getCtaSelectionNote(platform, objective)

  const handlePlatformChange = (value: string) => {
    const nextPlatform = value as SocialMediaPlatform
    setPlatform(nextPlatform)
    setObjective(getDefaultConfiguredCtaObjective(nextPlatform))
  }

  const handleObjectiveChange = (value: string) => {
    setObjective(value)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="mb-3 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <MousePointerClick className="h-6 w-6" aria-hidden />
            </span>
            CTA
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Consultez les appels à l&apos;action disponibles par plateforme et par objectif de
            campagne.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plateforme et objectif</CardTitle>
            <CardDescription>
              Sélectionnez une plateforme et un objectif pour afficher la liste des CTA
              correspondants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cta-platform">Plateforme</Label>
                <Select value={platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger id="cta-platform">
                    <SelectValue placeholder="Choisir une plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((item) => (
                      <SelectItem key={item} value={item}>
                        <PlatformOptionLabel platform={item} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-objective">Objectif</Label>
                <Select value={objective} onValueChange={handleObjectiveChange}>
                  <SelectTrigger id="cta-objective">
                    <SelectValue placeholder="Choisir un objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {ctaOptions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>CTA disponibles</CardTitle>
              <CardDescription>
                <PlatformOptionLabel platform={platform} />
                {' — '}
                {objective}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                {ctaOptions.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
              {isFixedCta ? (
                <p className="mt-4 text-xs text-muted-foreground">
                  CTA unique imposé par la plateforme pour cet objectif.
                </p>
              ) : null}
              {ctaNote ? (
                <p className="mt-4 rounded-md border border-[#E94C16]/20 bg-orange-50/40 px-3 py-2 text-xs text-muted-foreground">
                  {ctaNote}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
