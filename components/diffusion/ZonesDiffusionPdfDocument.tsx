'use client'

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const PT = {
  /** A4 en points (react-pdf) */
  pageW: 595,
  pageH: 842,
  pad: 36,
}

const styles = StyleSheet.create({
  page: {
    padding: PT.pad,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    color: '#E94C16',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  dateLine: {
    fontSize: 9,
    color: '#555',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  recapBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
    padding: 10,
    marginBottom: 16,
  },
  recapItem: {
    marginBottom: 5,
    paddingLeft: 4,
    lineHeight: 1.4,
  },
  pageHint: {
    fontSize: 9,
    color: '#555',
    marginBottom: 10,
  },
  mapPageTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  mapPageSubtitle: {
    fontSize: 9,
    color: '#666',
    marginBottom: 10,
  },
  mapWrap: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  footer: {
    marginTop: 12,
    fontSize: 8,
    color: '#666',
    lineHeight: 1.35,
  },
  footerMapPage: {
    marginTop: 14,
    fontSize: 8,
    color: '#666',
    lineHeight: 1.35,
  },
})

export type ZonesDiffusionPdfPayload = {
  mapImageDataUrl: string
  /** Dimensions réelles du PNG capturé (pour conserver le ratio écran → PDF sans déformer les zones). */
  mapPixelWidth: number
  mapPixelHeight: number
  zoneLabels: string[]
  exportedAtLabel: string
  /** Libellé résumé affiché au-dessus de la carte sur le site (rappel contexte). */
  screenSummaryLine: string
}

/** Taille d’image dans le PDF : même ratio que la capture, sans étirement. */
function mapImageSizeForPdf(mapPixelWidth: number, mapPixelHeight: number) {
  const maxW = PT.pageW - 2 * PT.pad
  const maxH = PT.pageH - 2 * PT.pad - 70
  if (mapPixelWidth <= 0 || mapPixelHeight <= 0) {
    return { width: maxW, height: maxH * 0.5 }
  }
  const ratio = mapPixelHeight / mapPixelWidth
  let width = maxW
  let height = width * ratio
  if (height > maxH) {
    height = maxH
    width = height / ratio
  }
  return { width, height }
}

export function ZonesDiffusionPdfDocument({
  mapImageDataUrl,
  mapPixelWidth,
  mapPixelHeight,
  zoneLabels,
  exportedAtLabel,
  screenSummaryLine,
}: ZonesDiffusionPdfPayload) {
  const { width: mapW, height: mapH } = mapImageSizeForPdf(mapPixelWidth, mapPixelHeight)

  return (
    <Document title="Carte zones — diffusion" creator="Link Academy">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Carte zones de diffusion</Text>
        <Text style={styles.dateLine}>Export du {exportedAtLabel}</Text>

        <Text style={styles.sectionTitle}>Récapitulatif des zones ({zoneLabels.length})</Text>
        <View style={styles.recapBox}>
          {zoneLabels.map((label, i) => (
            <Text key={`z-${i}`} style={styles.recapItem}>
              {`${i + 1}. ${label}`}
            </Text>
          ))}
        </View>

        <Text style={styles.pageHint}>La carte est reproduite page suivante, aux mêmes proportions qu’à l’écran (sans déformation).</Text>

        <Text style={styles.footer}>
          Représentation indicative — vérifier le ciblage réel sur les plateformes. Fond carte © les contributeurs
          OpenStreetMap. Contours départements / régions : données publiques simplifiées (ODbL).
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.mapPageTitle}>Carte</Text>
        {screenSummaryLine ? (
          <Text style={styles.mapPageSubtitle}>{`Affichage écran : ${screenSummaryLine}`}</Text>
        ) : null}
        <View style={styles.mapWrap}>
          <Image
            src={mapImageDataUrl}
            style={{
              width: mapW,
              height: mapH,
            }}
          />
        </View>
        <Text style={styles.footerMapPage}>
          Capture de la zone carte uniquement, même cadrage et même ratio largeur/hauteur que sur le site.
        </Text>
      </Page>
    </Document>
  )
}
