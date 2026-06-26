'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { filterSiteSearch, getSiteSearchItems, type SiteSearchItem } from '@/lib/site-search'
import { isExternalNavHref } from '@/lib/nav-config'
import type { UserRole } from '@/lib/roles'
import { cn } from '@/lib/utils'

type HeaderSearchProps = {
  isAdmin: boolean
  role: UserRole | null
  className?: string
  compact?: boolean
}

export function HeaderSearch({ isAdmin, role, className, compact = false }: HeaderSearchProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(!compact)

  const items = useMemo(() => getSiteSearchItems({ isAdmin, role }), [isAdmin, role])
  const results = useMemo(() => filterSiteSearch(query, items), [query, items])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        if (compact) setExpanded(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [compact])

  const handleSelect = (item: SiteSearchItem) => {
    setQuery('')
    setOpen(false)
    if (compact) setExpanded(false)
    if (item.external || isExternalNavHref(item.href)) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
      return
    }
    router.push(item.href)
  }

  const showResults = open && query.trim().length > 0

  if (compact && !expanded) {
    return (
      <div ref={containerRef} className={className}>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Ouvrir la recherche"
          onClick={() => {
            setExpanded(true)
            window.setTimeout(() => inputRef.current?.focus(), 0)
          }}
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Rechercher…"
        value={query}
        className={cn('h-9 bg-background pl-8', compact ? 'w-[11rem]' : 'w-full')}
        onChange={(event) => {
          const value = event.target.value
          setQuery(value)
          setOpen(value.trim().length > 0)
        }}
        onFocus={() => {
          if (query.trim().length > 0) setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            if (compact) {
              setExpanded(false)
              setQuery('')
            }
          }
          if (event.key === 'Enter' && results[0]) {
            event.preventDefault()
            handleSelect(results[0])
          }
        }}
      />

      {showResults ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-md border border-border bg-popover shadow-md">
          {results.length > 0 ? (
            <>
              <p className="border-b px-3 py-1.5 text-[11px] text-muted-foreground">
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </p>
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((item) => (
                  <li key={item.id}>
                    {item.external || isExternalNavHref(item.href) ? (
                      <button
                        type="button"
                        className="block w-full px-3 py-2 text-left hover:bg-accent"
                        onClick={() => handleSelect(item)}
                      >
                        <ResultRow item={item} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 hover:bg-accent"
                        onClick={() => handleSelect(item)}
                      >
                        <ResultRow item={item} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">Aucun résultat</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

function ResultRow({ item }: { item: SiteSearchItem }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{item.title}</span>
        <span className="shrink-0 text-[11px] text-muted-foreground">{item.category}</span>
      </div>
      {item.description ? (
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
      ) : null}
    </>
  )
}
