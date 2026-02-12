"use client"

import * as React from "react"
import NextImage, { type ImageProps } from "next/image"

function unique(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean)))
}

function buildCandidates(src: string) {
  const candidates: string[] = [src]

  // Try URI decoded/encoded variants (spaces, accents, etc.)
  try {
    const decoded = decodeURIComponent(src)
    candidates.push(decoded)
    candidates.push(encodeURI(decoded))
  } catch {
    // ignore
  }

  // Try unicode normalization variants (macOS vs linux filenames can differ: NFC vs NFD)
  for (const s of [...candidates]) {
    try {
      candidates.push(s.normalize("NFC"))
      candidates.push(s.normalize("NFD"))
    } catch {
      // ignore
    }
  }

  // Common space encoding mismatch
  for (const s of [...candidates]) {
    candidates.push(s.replace(/%20/g, " "))
    candidates.push(s.replace(/ /g, "%20"))
  }

  return unique(candidates)
}

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string
  /** Optional extra candidates, tried after auto-generated ones. */
  extraSrcCandidates?: string[]
  /** Fallback shown if everything fails. Defaults to /placeholder.svg */
  fallbackSrc?: string
}

export default function SafeImage({
  src,
  extraSrcCandidates,
  fallbackSrc = "/placeholder.svg",
  alt,
  onError,
  ...rest
}: SafeImageProps) {
  const candidates = React.useMemo(() => {
    return unique([...buildCandidates(src), ...(extraSrcCandidates || [])])
  }, [src, extraSrcCandidates])

  const [idx, setIdx] = React.useState(0)
  const currentSrc = candidates[idx] || fallbackSrc

  return (
    <NextImage
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={(e) => {
        if (idx < candidates.length - 1) {
          setIdx((v) => v + 1)
          return
        }
        onError?.(e)
      }}
    />
  )
}

