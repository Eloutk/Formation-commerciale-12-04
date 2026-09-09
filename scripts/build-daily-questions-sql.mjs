/**
 * Génère supabase/daily-questions-seed.sql à partir de DAILY_QUESTIONS.
 *
 * Usage : node scripts/build-daily-questions-sql.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DAILY_QUESTIONS } from './daily-questions-data.mjs'

const EXPECTED_COUNTS = {
  'Ciblage publicitaire': 45,
  'Formats visuels et Studio': 40,
  'Plateformes, placements et formats pub': 32,
  'Architecture de campagnes et zones': 26,
  'Objectifs de campagne et tunnel': 26,
  'Tracking, attribution, UTM, pixel / API': 26,
  'Optimisations et KPI': 22,
  'Google Ads (Search, Display, YouTube, PMax, Demand gen)': 22,
  'META (Facebook / Instagram)': 16,
  'LinkedIn Ads': 12,
  'TikTok, Snapchat, Spotify': 14,
  'Score qualité et enchères': 12,
  'Méthodologie Link et rôles CM / TM': 10,
  'Lexique et définitions KPI': 16,
  'Bilans, rapports et lecture de performance': 10,
  'Outils commerciaux (calculateur, SMS/RCS, tarifs Studio)': 12,
  'FAQ / cas terrain': 8,
  'Veille, mockup, CTA, potentiels': 8,
  'Chefferie de projet et production': 8,
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlArray(options) {
  return `ARRAY[${options.map(sqlString).join(', ')}]`
}

if (!Array.isArray(DAILY_QUESTIONS) || DAILY_QUESTIONS.length !== 365) {
  throw new Error(`DAILY_QUESTIONS doit contenir 365 questions (reçu : ${DAILY_QUESTIONS?.length})`)
}

const counts = {}
DAILY_QUESTIONS.forEach((item, index) => {
  if (!item || typeof item !== 'object') {
    throw new Error(`Question invalide à l'index ${index}`)
  }
  const { category, question, options, correctIndex, explanation } = item
  if (!EXPECTED_COUNTS[category]) {
    throw new Error(`Catégorie inconnue à l'index ${index} : ${category}`)
  }
  if (typeof question !== 'string' || !question.trim()) {
    throw new Error(`Question vide à l'index ${index}`)
  }
  if (!Array.isArray(options) || options.length < 3 || options.length > 4) {
    throw new Error(`options doit avoir 3 ou 4 items (index ${index})`)
  }
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`correctIndex invalide à l'index ${index}`)
  }
  if (typeof explanation !== 'string' || !explanation.trim()) {
    throw new Error(`explanation vide à l'index ${index}`)
  }
  counts[category] = (counts[category] || 0) + 1
})

for (const [category, expected] of Object.entries(EXPECTED_COUNTS)) {
  if (counts[category] !== expected) {
    throw new Error(`${category} : ${counts[category] ?? 0} au lieu de ${expected}`)
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'supabase', 'daily-questions-seed.sql')

const values = DAILY_QUESTIONS.map((item, index) => {
  const cycleDay = index + 1
  return `  (${cycleDay}, ${sqlString(item.category)}, ${sqlString(item.question)}, ${sqlArray(item.options)}, ${item.correctIndex}, ${sqlString(item.explanation)})`
})

const sql = `-- À coller dans Supabase SQL Editor APRÈS daily-questions.sql
TRUNCATE public.daily_question_answers, public.daily_questions RESTART IDENTITY CASCADE;
INSERT INTO public.daily_questions (cycle_day, category, question, options, correct_index, explanation) VALUES
${values.join(',\n')}
;
`

writeFileSync(outPath, sql)
console.log(`Wrote ${values.length} questions to ${outPath}`)
