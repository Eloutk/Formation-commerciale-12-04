'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { HOME_PAGE_2_SECTIONS } from '@/lib/home-page-2-config'

const LINK_ORANGE = '#E94C16'

function HomePage2CardLink({
  label,
  description,
  href,
  clientVisible,
}: {
  label: string
  description: string
  href: string
  clientVisible: boolean
}) {
  return (
    <Link href={href} className="block h-full">
      <Card
        className={cn(
          'h-full min-h-[130px] border-2 transition-shadow hover:shadow-md',
          clientVisible
            ? 'border-neutral-900 bg-white'
            : 'border-[#E94C16] bg-[#E94C16]/5',
        )}
      >
        <CardHeader className="p-4 pb-2">
          <CardTitle
            className={cn(
              'text-base leading-snug',
              clientVisible ? 'text-neutral-900' : 'text-[#E94C16]',
            )}
          >
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="line-clamp-3 text-xs leading-relaxed">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function HomePage2() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 lg:py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Home page 2</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border-2 border-neutral-900 bg-white" aria-hidden />
            Montrable au client
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm border-2 bg-[#E94C16]/10"
              style={{ borderColor: LINK_ORANGE }}
              aria-hidden
            />
            Usage interne
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {HOME_PAGE_2_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`home-page-2-${section.id}`}>
            <h2
              id={`home-page-2-${section.id}`}
              className="mb-4 text-xl font-semibold text-neutral-900"
            >
              {section.label}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((card) => (
                <HomePage2CardLink
                  key={card.id}
                  label={card.label}
                  description={card.description}
                  href={card.href}
                  clientVisible={card.clientVisible}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
