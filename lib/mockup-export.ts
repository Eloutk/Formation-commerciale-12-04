import { toJpeg, toPng } from 'html-to-image'

export async function exportMockupImage(
  element: HTMLElement,
  format: 'png' | 'jpeg',
  filename: string,
): Promise<void> {
  const options = {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  }

  const dataUrl =
    format === 'png'
      ? await toPng(element, options)
      : await toJpeg(element, { ...options, quality: 0.92 })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
