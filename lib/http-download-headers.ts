/** Valeur d'en-tête HTTP strictement ASCII (ByteString). */
export function toAsciiHeaderValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Content-Disposition compatible navigateurs, avec nom UTF-8. */
export function buildContentDisposition(filename: string): string {
  const asciiFallback = toAsciiHeaderValue(filename).replace(/["\\]/g, '') || 'download.key'
  const encoded = encodeURIComponent(filename)
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`
}

export function parseContentDispositionFilename(disposition: string): string {
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;\s]+)/i)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    } catch {
      // fall through
    }
  }

  const asciiMatch = disposition.match(/filename="([^"]+)"/i)
  if (asciiMatch?.[1]) return asciiMatch[1]

  return 'Presentation.key'
}
