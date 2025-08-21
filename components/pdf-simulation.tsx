import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

type Row = {
  platform: string
  objective: string
  kpis: number
  ctrPct?: number
  avgClicks?: number
  avgImpressions?: number
  avgClicksLink?: number
  budgetUsed: number
}

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 18, marginBottom: 10 },
  table: { borderWidth: 1, borderColor: '#e5e7eb' },
  row: { flexDirection: 'row' },
  cell: { padding: 6, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 10 },
  header: { fontWeight: 700 },
})

const fmt = (n?: number) => (n === undefined ? '-' : Math.ceil(n).toLocaleString('fr-FR'))
const fmtPct = (n?: number) => (n === undefined ? '-' : `${n.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`)

export function PDFSimulation({ rows }: { rows: Row[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Simulation Budget</Text>
        <View style={styles.table}>
          <View style={[styles.row]}> 
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>Plateforme</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>Objectif</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>KPIs estimés</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>CTR moyen</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>Clics moyens</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>Impressions moyennes</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>Leads moyens</Text>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>Budget utilisé</Text>
          </View>
          {rows.map((r, idx) => (
            <View key={`${r.platform}-${idx}`} style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{r.platform}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{r.objective}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{fmt(r.kpis)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{fmtPct(r.ctrPct)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{fmt(r.avgClicks)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{fmt(r.avgImpressions)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{fmt(r.avgClicksLink)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{`${fmt(r.budgetUsed)}€`}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

