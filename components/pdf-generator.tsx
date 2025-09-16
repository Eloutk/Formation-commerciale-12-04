import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
// Redéclare une version minimale du type pour éviter les imports circulaires depuis la page
export interface PlatformCalculation {
  id: string
  platform: string
  calculationType: 'price-for-kpis' | 'kpis-for-budget'
  objective: string
  aePercentage: number
  diffusionDays: number
  price?: number
  calculatedKpis?: number
  budget?: string
  kpis?: string
}
// Fonctions de formatage locales
const normalizeSpaces = (s: string): string => s.replace(/\u00A0/g, ' ')
const formatNumberSpaces = (value: number): string => normalizeSpaces(new Intl.NumberFormat('fr-FR').format(value))

const formatCurrency = (value: number): string => `${formatNumberSpaces(Number(value.toFixed(2)))}€`

const formatKPIs = (value: number): string => {
  return formatNumberSpaces(Math.round(value))
}

// Insights supprimés du PDF

// Couleurs pour les diagrammes (mêmes que sur le site)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B']

// Définir les styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 10,
  },
  tableCellHeader: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    textAlign: 'center',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
  },
  chartSection: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  chartDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 15,
  },
  chartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartColumn: {
    flex: 1,
    marginHorizontal: 10,
  },
  chartBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fafafa',
  },
  chartTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1f2937',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#e5e7eb',
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  pieSegment: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: '#374151',
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressBarText: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  platformBreakdown: {
    marginTop: 15,
  },
  platformItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  platformName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  platformValue: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
})

interface PDFGeneratorProps {
  calculations: PlatformCalculation[]
  totalPDV: number
  totalKPIs?: number
}

export const PDFGenerator = ({ calculations, totalPDV, totalKPIs }: PDFGeneratorProps) => {
  // Déterminer le type de calcul principal
  const hasPriceCalculations = calculations.some(calc => calc.price !== undefined)
  const hasKPICalculations = calculations.some(calc => calc.calculatedKpis !== undefined)
  
  const getPercentageData = () => {
    if (hasPriceCalculations) {
      return calculations.map((calc, index) => ({
        name: calc.platform,
        value: totalPDV > 0 ? ((calc.price || 0) / totalPDV * 100) : 0,
        color: COLORS[index % COLORS.length]
      }))
    } else {
      return calculations.map((calc, index) => ({
        name: calc.platform,
        value: totalKPIs && totalKPIs > 0 ? ((calc.calculatedKpis || 0) / totalKPIs * 100) : 0,
        color: COLORS[index % COLORS.length]
      }))
    }
  }

  const getChartData = () => {
    if (hasPriceCalculations) {
      return calculations.map((calc, index) => ({
        name: calc.platform,
        value: calc.price || 0,
        color: COLORS[index % COLORS.length]
      }))
    } else {
      return calculations.map((calc, index) => ({
        name: calc.platform,
        value: calc.calculatedKpis || 0,
        color: COLORS[index % COLORS.length]
      }))
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {hasPriceCalculations ? 'Récapitulatif Multi-Plateformes - Prix' : 'Récapitulatif Multi-Plateformes - KPIs'}
          </Text>
          <Text style={styles.subtitle}>Calculateur PDV - Link Academy</Text>
        </View>

        {/* Tableau détaillé + Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail par plateforme</Text>
          <View style={styles.table}>
            {/* En-têtes du tableau */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Plateforme</Text>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>KPIs</Text>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Objectif</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>% AE</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Jours</Text>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Type</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Budget (€)</Text>
            </View>

            {/* Données du tableau */}
            {calculations.map((calc, index) => {
              return (
                <View key={calc.id} style={{ marginBottom: 6 }}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{calc.platform}</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {calc.calculationType === 'price-for-kpis'
                        ? `${Number(calc.kpis || '0').toLocaleString('fr-FR')}`
                        : `${Math.ceil(calc.calculatedKpis || 0).toLocaleString('fr-FR')}`}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{calc.objective}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{calc.aePercentage}%</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{calc.diffusionDays}j</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {calc.calculationType === 'price-for-kpis' ? 'Prix pour KPIs' : 'KPIs pour budget'}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}> 
                      {calc.calculationType === 'price-for-kpis'
                        ? `${(Number.isInteger(calc.price || 0) ? (calc.price || 0) : Math.ceil(calc.price || 0)).toLocaleString('fr-FR')}€`
                        : `${Math.ceil(parseFloat(calc.budget || '0')).toLocaleString('fr-FR')}€`}
                    </Text>
                  </View>
                  {/* Insights supprimés */}
                </View>
              )
            })}
          </View>
        </View>

        {/* Diagrammes circulaires */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>
            {hasPriceCalculations ? 'Dashboard - Répartition du budget' : 'Dashboard - Répartition des KPIs'}
          </Text>
          <Text style={styles.chartDescription}>
            {hasPriceCalculations 
              ? 'Visualisation de la répartition de votre budget par plateforme'
              : 'Visualisation de la répartition de vos KPIs par plateforme'
            }
          </Text>
          
          <View style={styles.chartsContainer}>
            {/* Répartition en euros/KPIs */}
            <View style={styles.chartColumn}>
              <View style={styles.chartBox}>
                <Text style={styles.chartTitleSmall}>
                  {hasPriceCalculations ? 'Répartition en euros' : 'Répartition en KPIs'}
                </Text>
                <View style={styles.pieChartContainer}>
                  {/* Cercle avec texte au centre */}
                  <View style={styles.pieChart}>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', marginTop: 50 }}>
                      {hasPriceCalculations 
                        ? `${totalPDV.toFixed(0)}€`
                        : formatKPIs(totalKPIs || 0)
                      }
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 10, color: '#6b7280' }}>
                      Total
                    </Text>
                  </View>
                  
                  {/* Légende */}
                  <View style={styles.legendContainer}>
                    {getChartData().map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                          {item.name}: {hasPriceCalculations 
                            ? `${item.value.toFixed(0)}€`
                            : formatKPIs(item.value)
                          }
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Répartition en pourcentage */}
            <View style={styles.chartColumn}>
              <View style={styles.chartBox}>
                <Text style={styles.chartTitleSmall}>Répartition en pourcentage</Text>
                <View style={styles.pieChartContainer}>
                  {/* Cercle avec texte au centre */}
                  <View style={styles.pieChart}>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', marginTop: 50 }}>
                      100%
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 10, color: '#6b7280' }}>
                      Total
                    </Text>
                  </View>
                  
                  {/* Légende */}
                  <View style={styles.legendContainer}>
                    {getPercentageData().map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                          {item.name}: {item.value.toFixed(1)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Barres de progression pour la répartition */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>
            {hasPriceCalculations ? 'Répartition visuelle du budget' : 'Répartition visuelle des KPIs'}
          </Text>
          <Text style={styles.chartDescription}>
            {hasPriceCalculations 
              ? 'Barres de progression montrant la part de chaque plateforme'
              : 'Barres de progression montrant la répartition des KPIs par plateforme'
            }
          </Text>
          
          <View style={styles.progressBarContainer}>
            {getPercentageData().map((item, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.progressBarText}>
                  {item.name} ({item.value.toFixed(1)}%)
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        backgroundColor: item.color,
                        width: `${item.value}%`
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Répartition détaillée */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>
            {hasPriceCalculations ? 'Répartition du budget par plateforme' : 'Répartition des KPIs par plateforme'}
          </Text>
          <Text style={styles.chartDescription}>
            {hasPriceCalculations 
              ? 'Pourcentage de répartition du budget total par plateforme'
              : 'Pourcentage de répartition des KPIs total par plateforme'
            }
          </Text>
          
          <View style={styles.platformBreakdown}>
            {getPercentageData().map((item, index) => (
              <View key={index} style={styles.platformItem}>
                <Text style={styles.platformName}>{item.name}</Text>
                <Text style={styles.platformValue}>{item.value.toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total PDV ou KPIs */}
        <View style={styles.totalSection}>
          <Text style={styles.totalAmount}>
            {hasPriceCalculations 
              ? formatCurrency(totalPDV)
              : formatKPIs(totalKPIs || 0)
            }
          </Text>
          <Text style={styles.totalLabel}>
            {hasPriceCalculations ? 'Total PDV' : 'Total KPIs'}
          </Text>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Généré le {new Date().toLocaleDateString('fr-FR')} par le Calculateur PDV</Text>
          <Text>Link Academy - Formation Commerciale</Text>
        </View>
      </Page>
    </Document>
  )
} 