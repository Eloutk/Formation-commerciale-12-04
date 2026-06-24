'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { STUDIO_TARIFS_VALIDATION_NOTE } from '@/lib/studio-tarifs-grid'
import type { StudioTarifsPdfLine, StudioTarifsPdfSection } from '@/lib/studio-tarifs-pdf-lines'

export type { StudioTarifsPdfLine, StudioTarifsPdfSection }

export type StudioTarifsPdfPayload = {
  title: string
  dateLabel: string
  userName?: string
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
  userName: {
    fontSize: 11,
    marginBottom: 4,
    color: '#374151',
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
  lineBlock: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lineTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 1.35,
  },
  lineFieldLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 2,
  },
  lineFieldText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 1,
  },
  amountsTable: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  amountsHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  amountsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  amountsCell: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  amountsCellLast: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  amountsHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  amountsValueText: {
    fontSize: 9,
    color: '#111827',
  },
  amountsTotalText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#E94C16',
  },
  noteText: {
    fontSize: 8,
    color: '#6b7280',
    lineHeight: 1.35,
    marginTop: 2,
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

function PdfMultilineField({ label, text }: { label: string; text: string }) {
  const parts = text.split('\n').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return null
  return (
    <View>
      <Text style={styles.lineFieldLabel}>{label}</Text>
      {parts.map((part, index) => (
        <Text key={`${label}-${index}`} style={styles.lineFieldText}>
          {part}
        </Text>
      ))}
    </View>
  )
}

function StudioTarifsPdfLineBlock({ line }: { line: StudioTarifsPdfLine }) {
  const showAmountsTable =
    line.unitPriceLabel !== undefined ||
    line.quantityLabel !== undefined ||
    line.lineTotalLabel !== undefined

  return (
    <View style={styles.lineBlock} wrap={false}>
      <Text style={styles.lineTitle}>{line.title}</Text>

      {line.explanation ? <PdfMultilineField label="Explication" text={line.explanation} /> : null}
      {line.conditions ? <PdfMultilineField label="Conditions" text={line.conditions} /> : null}

      {showAmountsTable ? (
        <View style={styles.amountsTable}>
          <View style={styles.amountsHeaderRow}>
            <View style={styles.amountsCell}>
              <Text style={styles.amountsHeaderText}>Tarif unitaire (HT)</Text>
            </View>
            <View style={styles.amountsCell}>
              <Text style={styles.amountsHeaderText}>Quantité</Text>
            </View>
            <View style={styles.amountsCellLast}>
              <Text style={styles.amountsHeaderText}>Total ligne (HT)</Text>
            </View>
          </View>
          <View style={styles.amountsRow}>
            <View style={styles.amountsCell}>
              <Text style={styles.amountsValueText}>{line.unitPriceLabel ?? '—'}</Text>
            </View>
            <View style={styles.amountsCell}>
              <Text style={styles.amountsValueText}>
                {line.quantityLabel ? `× ${line.quantityLabel}` : '—'}
              </Text>
            </View>
            <View style={styles.amountsCellLast}>
              <Text style={styles.amountsTotalText}>{line.lineTotalLabel}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {line.notes?.map((note, index) => (
        <Text key={`note-${index}`} style={styles.noteText}>
          {note}
        </Text>
      ))}
    </View>
  )
}

function StudioTarifsPdfDocument({
  title,
  dateLabel,
  userName,
  comment,
  sections,
  totalHtLabel,
  totalTtcLabel,
}: Omit<StudioTarifsPdfPayload, 'filename'>) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{title}</Text>
        {userName ? <Text style={styles.userName}>{userName}</Text> : null}
        <Text style={styles.date}>{dateLabel}</Text>

        {comment ? (
          <View style={styles.commentBox}>
            <Text style={styles.commentTitle}>Commentaire</Text>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        ) : null}

        {sections.map((section) => (
          <View key={section.label} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.label}</Text>
              {section.subtotalLabel ? (
                <Text style={styles.sectionSubtotal}>{section.subtotalLabel}</Text>
              ) : null}
            </View>
            {section.lines.map((line, index) => (
              <StudioTarifsPdfLineBlock key={`${section.label}-${index}`} line={line} />
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
