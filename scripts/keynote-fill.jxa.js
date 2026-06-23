#!/usr/bin/osascript -l JavaScript
/**
 * Remplit une copie Keynote à partir d'un JSON (chemin passé en argv[0]).
 * Nécessite Keynote installé sur macOS + autorisation Automatisation.
 */
function run(argv) {
  const payloadPath = argv[0]
  if (!payloadPath) {
    throw new Error('Payload path missing')
  }

  const payload = readJsonFile(payloadPath)
  const Keynote = Application('Keynote')
  if (!Keynote.running()) {
    Keynote.launch()
    delay(2)
  }
  Keynote.activate()

  const doc = Keynote.open(Path(payload.templatePath))
  delay(2)

  const slidesData = payload.slides || []
  let slideCount = doc.slides.length
  let filledSlides = 0
  const errors = []

  for (let i = 0; i < slidesData.length; i++) {
    const data = slidesData[i]
    if (i + 1 > slideCount) {
      doc.make({ new: 'slide', at: doc.slides.end })
      slideCount = doc.slides.length
    }

    const slide = doc.slides[i]
    if (!slide) {
      errors.push('Slide index ' + i + ' introuvable')
      continue
    }

    const bodyText = [data.body, data.notes ? 'Notes : ' + data.notes : '']
      .filter(Boolean)
      .join('\n\n')

    const filled = fillSlideText(slide, data.title || '', bodyText)
    if (filled > 0) filledSlides++
    else errors.push('Slide ' + (i + 1) + ' : aucune zone texte remplie')
  }

  doc.save({ in: Path(payload.outputPath), overwrite: true })
  delay(0.5)
  doc.close({ saving: 'no' })

  return JSON.stringify({
    ok: true,
    outputPath: payload.outputPath,
    filledSlides: filledSlides,
    totalSlides: slidesData.length,
    errors: errors.slice(0, 20),
  })
}

function fillSlideText(slide, title, bodyText) {
  let filled = 0

  if (title) {
    if (trySetDefaultItem(slide, 'defaultTitleItem', title)) filled++
    else if (trySetDefaultItem(slide, 'defaultSubtitleItem', title)) filled++
  }

  if (bodyText) {
    if (trySetDefaultItem(slide, 'defaultBodyItem', bodyText)) filled++
    else if (trySetDefaultItem(slide, 'defaultSubtitleItem', bodyText)) filled++
  }

  if (filled === 0) {
    filled += fillViaTextItems(slide, title, bodyText)
  }

  if (filled === 0 && (title || bodyText)) {
    filled += fillViaAllTextBoxes(slide, title, bodyText)
  }

  if (filled === 0 && (title || bodyText)) {
    filled += fillViaContents(slide, title, bodyText)
  }

  return filled
}

function trySetDefaultItem(slide, methodName, text) {
  try {
    const item = slide[methodName]()
    if (!item || !item.exists()) return false
    item.objectText = text
    return true
  } catch (e) {
    return false
  }
}

function fillViaTextItems(slide, title, bodyText) {
  let filled = 0
  try {
    const items = slide.textItems()
    if (!items || items.length === 0) return 0

    if (title && items.length >= 1) {
      items[0].objectText = title
      filled++
    }

    if (bodyText) {
      if (items.length >= 2) {
        items[1].objectText = bodyText
        filled++
      } else if (items.length === 1 && !title) {
        items[0].objectText = bodyText
        filled++
      } else if (items.length === 1 && title) {
        items[0].objectText = title + '\n\n' + bodyText
        filled++
      }
    }
  } catch (e) {
    return 0
  }
  return filled
}

function fillViaAllTextBoxes(slide, title, bodyText) {
  let filled = 0
  try {
    const combined = [title, bodyText].filter(Boolean).join('\n\n')
    const boxes = slide.textItems()
    for (let i = 0; i < boxes.length; i++) {
      try {
        const current = getTextContent(boxes[i]).trim()
        if (current.length === 0 || current.length < 120) {
          boxes[i].objectText = i === 0 ? combined : bodyText || title
          filled++
          if (i === 0 && title && bodyText) break
        }
      } catch (e) {}
    }
  } catch (e) {
    return 0
  }
  return filled
}

function fillViaContents(slide, title, bodyText) {
  let filled = 0
  try {
    const combined = [title, bodyText].filter(Boolean).join('\n\n')
    const all = slide.contents()
    const textItems = []
    for (let i = 0; i < all.length; i++) {
      try {
        if (all[i].class() === 'text item') textItems.push(all[i])
      } catch (e) {}
    }
    if (textItems.length === 0) return 0

    if (title) {
      textItems[0].objectText = title
      filled++
    }
    if (bodyText) {
      if (textItems.length >= 2) textItems[1].objectText = bodyText
      else if (textItems.length === 1) textItems[0].objectText = combined
      filled++
    }
  } catch (e) {
    return 0
  }
  return filled
}

function getTextContent(item) {
  try {
    return String(item.objectText() || '')
  } catch (e) {}
  try {
    return String(item.objectText || '')
  } catch (e2) {}
  return ''
}

function readJsonFile(filePath) {
  ObjC.import('Foundation')
  const str = $.NSString.stringWithContentsOfFileEncodingError($(filePath), $.NSUTF8StringEncoding, null)
  if (!str) {
    throw new Error('Impossible de lire le payload : ' + filePath)
  }
  return JSON.parse(ObjC.unwrap(str))
}
