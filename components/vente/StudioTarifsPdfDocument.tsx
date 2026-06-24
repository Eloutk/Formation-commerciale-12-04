'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { STUDIO_TARIFS_VALIDATION_NOTE } from '@/lib/studio-tarifs-grid'

export type StudioTarifsPdfLine = {
  label: string
  quantityLabel: string | null
  priceLabel: string
}

export type StudioTarifsPdfSection = {
  label: string
  lines: StudioTarifsPdfLine[]
  subtotalLabel: string | null
}

export type StudioTarifsPdfPayload = {
  title: string
  dateLabel: string
  comment?: string
  sections: StudioTarifsPdfSection[]
  totalHtLabel: string
  totalTtcLabel: string
  filename: string
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 20,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 1.35,
  },
  date: {
    fontSize: 11,
    marginBottom: 12,
    color: '#666666',
  },
  commentBox: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  commentTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
  },
  commentText: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.45,
  },
  section: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionSubtotal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lineLabel: {
    flex: 1,
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.4,
  },
  lineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lineQty: {
    fontSize: 10,
    color: '#6b7280',
    minWidth: 28,
    textAlign: 'right',
  },
  linePrice: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E94C16',
    minWidth: 64,
    textAlign: 'right',
  },
  totalsBox: {
    marginTop: 4,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E94C16',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 11,
    color: '#4b5563',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalTtcLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalTtcValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E94C16',
  },
  footerNote: {
    marginTop: 14,
    fontSize: 8,
    color: '#9ca3af',
    lineHeight: 1.4,
    textAlign: 'center',
  },
})

function StudioTarifsPdfDocument({
  title,
  dateLabel,
  comment,
  sections,
  totalHtLabel,
  totalTtcLabel,
}: Omit<StudioTarifsPdfPayload, 'filename'>) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dateLabel}</Text>

        {comment ? (
          <View style={styles.commentBox}>
            <Text style={styles.commentTitle}>Commentaire</Text>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        ) : null}

        {sections.map((section) => (
          <View key={section.label} style={styles.section} wrap={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.label}</Text>
              {section.subtotalLabel ? (
                <Text style={styles.sectionSubtotal}>{section.subtotalLabel}</Text>
              ) : null}
            </View>
            {section.lines.map((line, index) => (
              <View key={`${section.label}-${index}`} style={styles.lineRow}>
                <Text style={styles.lineLabel}>{line.label}</Text>
                <View style={styles.lineMeta}>
                  {line.quantityLabel ? (
                    <Text style={styles.lineQty}>{line.quantityLabel}</Text>
                  ) : null}
                  <Text style={styles.linePrice}>{line.priceLabel}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{totalHtLabel}</Text>
          </View>
          <View style={[styles.totalRow, { marginBottom: 0 }]}>
            <Text style={styles.totalTtcLabel}>Total TTC (20 %)</Text>
            <Text style={styles.totalTtcValue}>{totalTtcLabel}</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>{STUDIO_TARIFS_VALIDATION_NOTE}</Text>
      </Page>
    </Document>
  )
}

export async function getStudioTarifsPdfBlob(payload: StudioTarifsPdfPayload): Promise<Blob> {
  const { filename: _filename, ...docProps } = payload
  return pdf(<StudioTarifsPdfDocument {...docProps} />).toBlob()
}

export async function downloadStudioTarifsPdf(payload: StudioTarifsPdfPayload): Promise<void> {
  const blob = await getStudioTarifsPdfBlob(payload)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename
  link.click()
  URL.revokeObjectURL(url)
}
