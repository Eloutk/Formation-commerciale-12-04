import { toBlob, toJpeg, toPng } from 'html-to-image'

const RENDER_OPTIONS = {
  cacheBust: true,
  pixelRatio: 2,
  backgroundColor: '#ffffff',
} as const

export async function renderMockupPngBlob(element: HTMLElement): Promise<Blob> {
  const blob = await toBlob(element, RENDER_OPTIONS)
  if (!blob) throw new Error('Impossible de générer le PNG du mockup.')
  return blob
}

export async function exportMockupImage(
  element: HTMLElement,
  format: 'png' | 'jpeg',
  filename: string,
): Promise<void> {
  const dataUrl =
    format === 'png'
      ? await toPng(element, RENDER_OPTIONS)
      : await toJpeg(element, { ...RENDER_OPTIONS, quality: 0.92 })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
