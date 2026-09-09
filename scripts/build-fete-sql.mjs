/**
 * Construit supabase/fete.sql à partir de data/prenoms-fete.csv
 * (Super Prénom / data.gouv.fr, Licence Ouverte + CC BY — superprenom.fr)
 * plus un complément Nominis pour les jours sans entrée.
 *
 * Usage : node scripts/build-fete-sql.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = join(root, 'data', 'prenoms-fete.csv')
const outPath = join(root, 'supabase', 'fete.sql')

const MONTHS = {
  janvier: 1,
  février: 2,
  fevrier: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  aout: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
  decembre: 12,
}

const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/** Jours absents du CSV Super Prénom — calendrier français usuel (Nominis / tradition civile). */
const NOMINIS_FALLBACK = {
  '1-1': ['Marie'],
  '1-4': ['Odilon'],
  '1-6': ['Mélaine'],
  '1-11': ['Paulin'],
  '1-12': ['Tatiana'],
  '1-17': ['Roseline'],
  '1-18': ['Prisca'],
  '1-23': ['Barnard'],
  '1-24': ['François de Sales'],
  '1-25': ['Paul'],
  '1-27': ['Angèle'],
  '1-28': ["Thomas d'Aquin"],
  '2-1': ['Ella'],
  '2-2': ['Présentation'],
  '2-3': ['Blaise'],
  '2-7': ['Eugénie'],
  '2-16': ['Julienne'],
  '2-19': ['Gabin'],
  '2-20': ['Aimée'],
  '2-21': ['Pierre-Damien'],
  '2-23': ['Isabelle'],
  '2-24': ['Modeste'],
  '2-25': ['Roméo'],
  '2-26': ['Nestor'],
  '2-27': ['Honorine'],
  '2-29': ['Auguste'],
  '3-2': ['Charles le Bon'],
  '3-4': ['Casimir'],
  '3-7': ['Félicité'],
  '3-8': ['Jean de Dieu'],
  '3-10': ['Vivien'],
  '3-11': ['Rosine'],
  '3-16': ['Bénédicte'],
  '3-24': ['Catherine de Suède'],
  '3-25': ['Annonciation'],
  '3-27': ['Habib'],
  '3-28': ['Gontran'],
  '3-29': ['Gwladys'],
  '3-30': ['Amédée'],
  '4-6': ['Marcellin'],
  '4-7': ['Jean-Baptiste de La Salle'],
  '4-9': ['Gautier'],
  '4-10': ['Fulbert'],
  '4-11': ['Stanislas'],
  '4-13': ['Ida'],
  '4-16': ['Benoît-Joseph'],
  '4-17': ['Anicet'],
  '4-18': ['Parfait'],
  '4-21': ['Anselme'],
  '4-24': ['Fidèle'],
  '4-26': ['Alida'],
  '4-27': ['Zita'],
  '4-29': ['Catherine de Sienne'],
  '5-6': ['Prudence'],
  '5-7': ['Gisèle'],
  '5-8': ['Désiré'],
  '5-9': ['Pacôme'],
  '5-11': ['Estelle'],
  '5-12': ['Achille'],
  '5-14': ['Matthias'],
  '5-16': ['Honoré'],
  '5-20': ['Bernardin'],
  '5-21': ['Constantin'],
  '5-24': ['Donatien'],
  '5-27': ['Augustin'],
  '5-28': ['Germain'],
  '5-29': ['Aymar'],
  '6-2': ['Blandine'],
  '6-4': ['Clotilde'],
  '6-5': ['Igor'],
  '6-6': ['Norbert'],
  '6-7': ['Gilbert'],
  '6-8': ['Médard'],
  '6-10': ['Landry'],
  '6-11': ['Barnabé'],
  '6-14': ['Élisée'],
  '6-16': ['Régis'],
  '6-18': ['Léonce'],
  '6-19': ['Romuald'],
  '6-20': ['Silvère'],
  '6-21': ['Rodolphe'],
  '6-26': ['Anthelme'],
  '6-28': ['Irénée'],
  '6-30': ['Martial'],
  '7-2': ['Martinien'],
  '7-4': ['Florent'],
  '7-8': ['Thibaut'],
  '7-10': ['Ulric'],
  '7-14': ['Camille de Lellis'],
  '7-15': ['Donald'],
  '7-16': ['Carmen'],
  '7-19': ['Arsène'],
  '7-28': ['Samson'],
  '7-31': ['Ignace de Loyola'],
  '8-1': ['Alphonse'],
  '8-3': ['Lydie'],
  '8-4': ['Jean-Marie Vianney'],
  '8-6': ['Transfiguration'],
  '8-7': ['Gaétan'],
  '8-9': ['Amour'],
  '8-12': ['Clarisse'],
  '8-14': ['Évrard'],
  '8-16': ['Armel'],
  '8-17': ['Hyacinthe'],
  '8-22': ['Fabrice'],
  '8-26': ['Natacha'],
  '8-29': ['Sabine'],
  '8-30': ['Fiacre'],
  '8-31': ['Aristide'],
  '9-2': ['Ingrid'],
  '9-5': ['Raïssa'],
  '9-12': ['Apollinaire'],
  '9-13': ['Aimé'],
  '9-14': ['Croix Glorieuse'],
  '9-17': ['Renaud'],
  '9-20': ['Davy'],
  '9-24': ['Thècle'],
  '9-25': ['Hermann'],
  '9-27': ['Vincent de Paul'],
  '9-28': ['Venceslas'],
  '10-2': ['Léger'],
  '10-8': ['Pélagie'],
  '10-10': ['Ghislain'],
  '10-11': ['Firmin'],
  '10-12': ['Wilfried'],
  '10-13': ['Géraud'],
  '10-16': ['Edwige'],
  '10-24': ['Florentin'],
  '10-26': ['Dimitri'],
  '10-27': ['Émeline'],
  '10-29': ['Narcisse'],
  '10-30': ['Bienvenue'],
  '11-1': ['Toussaint'],
  '11-2': ['Défunts'],
  '11-8': ['Geoffroy'],
  '11-9': ['Théodore'],
  '11-14': ['Sidoine'],
  '11-18': ['Aude'],
  '11-21': ['Présentation de Marie'],
  '11-27': ['Séverin'],
  '11-28': ['Jacques de la Marche'],
  '11-29': ['Saturnin'],
  '12-2': ['Vivien'],
  '12-4': ['Barbara'],
  '12-5': ['Gérald'],
  '12-8': ['Immaculée Conception'],
  '12-9': ['Pierre Fourier'],
  '12-10': ['Romaric'],
  '12-18': ['Gatien'],
  '12-19': ['Urbain'],
  '12-20': ['Théophile'],
  '12-21': ['Pierre Canisius'],
  '12-22': ['Françoise-Xavière'],
  '12-27': ['Jean'],
  '12-31': ['Sylvestre'],
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean)
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const cells = []
    let cur = ''
    let inQuotes = false
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if (ch === '"') {
        inQuotes = !inQuotes
        continue
      }
      if (ch === ',' && !inQuotes) {
        cells.push(cur)
        cur = ''
        continue
      }
      cur += ch
    }
    cells.push(cur)
    const prenom = (cells[0] || '').trim()
    const fete = (cells[1] || '').trim()
    if (prenom && fete) rows.push({ prenom, fete })
  }
  return rows
}

function foldKey(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function mergeNames(names) {
  const seen = new Set()
  const out = []
  for (const raw of names) {
    const name = raw.trim()
    if (!name) continue
    const key = foldKey(name)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(name)
  }
  return out
}

function sqlString(value) {
  return `'${value.replace(/'/g, "''")}'`
}

function sqlTextArray(names) {
  return `ARRAY[${names.map(sqlString).join(', ')}]::text[]`
}

const csv = parseCsv(readFileSync(csvPath, 'utf8'))
const byDay = new Map()

for (const row of csv) {
  const parts = row.fete.split(/\s+/)
  const day = Number(parts[0])
  const month = MONTHS[parts.slice(1).join(' ').toLowerCase()]
  if (!day || !month) continue
  const key = `${month}-${day}`
  if (!byDay.has(key)) byDay.set(key, [])
  byDay.get(key).push(row.prenom)
}

const values = []
for (let month = 1; month <= 12; month++) {
  for (let day = 1; day <= DAYS_IN_MONTH[month]; day++) {
    const key = `${month}-${day}`
    const names = mergeNames([...(byDay.get(key) || []), ...(NOMINIS_FALLBACK[key] || [])])
    if (names.length === 0) {
      throw new Error(`Aucun prénom pour ${day}/${month}`)
    }
    values.push(`  (${month}, ${day}, ${sqlTextArray(names)})`)
  }
}

const sql = `-- À exécuter dans Supabase > SQL Editor
-- Table des fêtes / prénoms du calendrier français (un jour = un ou plusieurs prénoms).
-- Source principale : Super Prénom (superprenom.fr) via data.gouv.fr — Licence Ouverte / CC BY.
-- Jours manquants complétés d'après le calendrier français usuel (Nominis / tradition civile).
-- Régénérer : node scripts/build-fete-sql.mjs

CREATE TABLE IF NOT EXISTS public.fete (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  day SMALLINT NOT NULL CHECK (day BETWEEN 1 AND 31),
  names TEXT[] NOT NULL CHECK (cardinality(names) >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS fete_unique_month_day
  ON public.fete (month, day);

CREATE INDEX IF NOT EXISTS fete_month_day_idx
  ON public.fete (month, day);

ALTER TABLE public.fete ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read fete" ON public.fete;
CREATE POLICY "Authenticated can read fete"
  ON public.fete
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage fete" ON public.fete;
CREATE POLICY "Admins can manage fete"
  ON public.fete
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

TRUNCATE public.fete;

INSERT INTO public.fete (month, day, names) VALUES
${values.join(',\n')};
`

writeFileSync(outPath, sql)
console.log(`Wrote ${values.length} days to ${outPath}`)
