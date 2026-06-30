'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

export type SimulateurMediaPdfPayload = {
  title: string
  dateLabel: string
  userName?: string
  body: string
  filename: string
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
    lineHeight: 1.45,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  meta: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 16,
  },
  body: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
  },
  line: {
    fontSize: 9.5,
    color: '#1f2937',
    marginBottom: 2,
  },
  heading: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 6,
    marginBottom: 3,
  },
})

function SimulateurMediaPdfDocument({
  title,
  dateLabel,
  userName,
  body,
}: Omit<SimulateurMediaPdfPayload, 'filename'>) {
  const lines = body.split('\n')

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{title}</Text>
        {userName ? <Text style={styles.meta}>Préparé par {userName}</Text> : null}
        <Text style={styles.meta}>Généré le {dateLabel}</Text>
        <View style={styles.body}>
          {lines.map((line, index) => {
            const isHeading =
              line.endsWith('=====') ||
              line.endsWith('-----') ||
              (line.length > 0 &&
                !line.startsWith(' ') &&
                !line.startsWith('•') &&
                lines[index + 1]?.startsWith('  '))
            return (
              <Text key={`${index}-${line}`} style={isHeading ? styles.heading : styles.line}>
                {line || ' '}
              </Text>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}

export async function getSimulateurMediaPdfBlob(
  payload: SimulateurMediaPdfPayload,
): Promise<Blob> {
  const { filename: _filename, ...docProps } = payload
  return pdf(<SimulateurMediaPdfDocument {...docProps} />).toBlob()
}

export async function downloadSimulateurMediaPdf(payload: SimulateurMediaPdfPayload): Promise<void> {
  const blob = await getSimulateurMediaPdfBlob(payload)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename.endsWith('.pdf') ? payload.filename : `${payload.filename}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
