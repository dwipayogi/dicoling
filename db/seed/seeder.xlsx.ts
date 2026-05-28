/**
 * seeder.xlsx.ts
 * Membaca file Excel Dicoling yang berisi ID dan FR dalam satu file.
 *
 * Struktur kolom Excel:
 *   [0] NO  [1] ISTILAH(ID)  [2] DEFINISI(ID)  [3] CONTOH(ID)
 *   [4] NO  [5] LEXIQUE(FR)  [6] DEFINITION(FR) [7] EXEMPLES(FR)
 *
 * Setiap baris NO yang sama = pasangan ID↔FR dari satu entri.
 *
 * Jalankan:
 *   ts-node --project tsconfig.seed.json db/seed/seeder.xlsx.ts
 *
 * Dengan argumen spesifik:
 *   ts-node ... -- --file path/ke/Analisis_Wacana.xlsx
 *   ts-node ... -- --file path/ke/file.xlsx --category "Nama Kategori"
 */

import Database from 'better-sqlite3';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// ── CLI args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] ?? null : null;
};
const targetFile = getArg('--file');
const forceCat   = getArg('--category');
const xlsxDir    = path.join(__dirname, 'xlsx');

// ── Types ──────────────────────────────────────────────────────────────────
interface ParsedEntry {
  lang:         'id' | 'fr';
  category:     string;
  seq_no:       number;
  term:         string;
  term_norm:    string;
  definition:   string;
  def_citation: string | null;
  ex_source:    string | null;
  ex_date:      string | null;
  ex_quote:     string | null;
  ex_analysis:  string | null;
}

// ── String helpers ─────────────────────────────────────────────────────────
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, "'")
    .trim();
}

function clean(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

// ── Parser: definisi + sitasi ──────────────────────────────────────────────
/**
 * Pisahkan teks definisi dari sitasi di akhir string.
 *
 * Input : "...relasi kekuasaan. (van Dijk, 1998; Fairclough, 1995)"
 * Output: { definition: "...relasi kekuasaan.", def_citation: "(van Dijk, 1998; Fairclough, 1995)" }
 */
function parseDefinition(raw: string): { definition: string; def_citation: string | null } {
  const s = raw.trim();
  if (!s) return { definition: '', def_citation: null };

  // Tangkap citation di akhir: (...) atau (...; ...)
  const m = s.match(/\(([^)]*\d{4}[^)]*)\)\s*$/);
  if (m) {
    const citation    = `(${m[1].trim()})`;
    const defRaw      = s.slice(0, m.index!).trim();
    const definition  = defRaw.replace(/\.?\s*$/, '') + '.';
    return { definition, def_citation: citation };
  }
  return { definition: s, def_citation: null };
}

// ── Parser: CONTOH (ID) ────────────────────────────────────────────────────
/**
 * Format: "kutipan berita" (Nama Media, DD Mon YYYY). Analisis: teks analisis
 *
 * Edge case: ada suffix setelah tahun seperti "11 Mei 2026 - Iklan"
 * → regex lenient: ambil hanya sampai \d{4}
 */
function parseContohID(raw: string) {
  const empty = { ex_source: null, ex_date: null, ex_quote: null, ex_analysis: null };
  if (!raw) return empty;

  // Pisahkan di ". Analisis:"
  const splitIdx = raw.search(/\.\s*[Aa]nalisis\s*:/);
  const before   = splitIdx !== -1 ? raw.slice(0, splitIdx).trim() : raw.trim();
  const ex_analysis = splitIdx !== -1
    ? raw.slice(raw.indexOf(':', splitIdx + 1) + 1).trim()
    : null;

  // Ekstrak (Source, DD Mon YYYY[optional suffix])
  const srcMatch = before.match(/\(([^,)]+),\s*(\d+\s+\w+\s+\d{4})[^)]*\)\s*[."]?\s*$/);
  if (srcMatch) {
    return {
      ex_source:   srcMatch[1].trim(),
      ex_date:     srcMatch[2].trim(),
      ex_quote:    before.slice(0, srcMatch.index!).trim().replace(/^[""\u201C\u201D]|[""\u201C\u201D]$/g, '').trim(),
      ex_analysis,
    };
  }
  return {
    ...empty,
    ex_quote:    before.trim().replace(/^[""\u201C\u201D]|[""\u201C\u201D]$/g, '').trim(),
    ex_analysis,
  };
}

// ── Parser: EXEMPLES (FR) ──────────────────────────────────────────────────
/**
 * Format: « kutipan » (Nom Média, DD mois YYYY). Analyse : texte d'analyse
 */
function parseExempleFR(raw: string) {
  const empty = { ex_source: null, ex_date: null, ex_quote: null, ex_analysis: null };
  if (!raw) return empty;

  // Pisahkan di ". Analyse :"
  const splitIdx = raw.search(/\.\s*[Aa]nalyse\s*\s*:/);
  const before   = splitIdx !== -1 ? raw.slice(0, splitIdx).trim() : raw.trim();
  const ex_analysis = splitIdx !== -1
    ? raw.slice(raw.indexOf(':', splitIdx + 1) + 1).trim()
    : null;

  // Ekstrak (Source, DD mois YYYY)
  const srcMatch = before.match(/\(([^,)]+),\s*(\d+\s+\w+\.?\s+\d{4})[^)]*\)\s*[.»]?\s*$/);
  if (srcMatch) {
    return {
      ex_source:   srcMatch[1].trim(),
      ex_date:     srcMatch[2].trim(),
      ex_quote:    before.slice(0, srcMatch.index!).trim().replace(/^[«»\u00AB\u00BB\s]+|[«»\u00AB\u00BB\s]+$/g, '').trim(),
      ex_analysis,
    };
  }
  return {
    ...empty,
    ex_quote:    before.trim().replace(/^[«»\u00AB\u00BB\s]+|[«»\u00AB\u00BB\s]+$/g, '').trim(),
    ex_analysis,
  };
}

// ── Category dari nama file ────────────────────────────────────────────────
/**
 * "Analisis_Wacana.xlsx" → "Analisis Wacana"
 * "Fonologi.xlsx"        → "Fonologi"
 */
function categoryFromFilename(filePath: string): string {
  return path.basename(filePath, path.extname(filePath))
    .replace(/[_-]/g, ' ')
    .trim();
}

// ── Parse satu file Excel ──────────────────────────────────────────────────
function parseXlsx(filePath: string, category: string): ParsedEntry[] {
  const workbook  = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rows      = XLSX.utils.sheet_to_json<any[]>(
    workbook.Sheets[sheetName],
    { header: 1, defval: '' }
  );

  // Cari baris header: baris yang mengandung "ISTILAH" atau "LEXIQUE"
  let dataStart = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const joined = rows[i].map(String).join('|').toUpperCase();
    if (joined.includes('ISTILAH') || joined.includes('LEXIQUE')) {
      dataStart = i + 1;
      break;
    }
  }

  const entries: ParsedEntry[] = [];

  for (let i = dataStart; i < rows.length; i++) {
    const row    = rows[i];
    const seqRaw = clean(row[0]);

    // Skip baris kosong atau bukan nomor
    if (!seqRaw || isNaN(Number(seqRaw))) continue;
    const seq_no = parseInt(seqRaw);

    // ── Entri Bahasa Indonesia ────────────────────────────────
    const idTerm = clean(row[1]);
    if (idTerm) {
      const { definition, def_citation } = parseDefinition(clean(row[2]));
      const { ex_source, ex_date, ex_quote, ex_analysis } = parseContohID(clean(row[3]));
      entries.push({
        lang: 'id', category, seq_no,
        term: idTerm, term_norm: norm(idTerm),
        definition, def_citation,
        ex_source, ex_date, ex_quote, ex_analysis,
      });
    }

    // ── Entri Bahasa Prancis ──────────────────────────────────
    // Kolom: [4]=NO_FR [5]=LEXIQUE [6]=DEFINITION [7]=EXEMPLES
    const frTerm = clean(row[5]);
    if (frTerm) {
      const { definition, def_citation } = parseDefinition(clean(row[6]));
      const { ex_source, ex_date, ex_quote, ex_analysis } = parseExempleFR(clean(row[7]));
      entries.push({
        lang: 'fr', category, seq_no,
        term: frTerm, term_norm: norm(frTerm),
        definition, def_citation,
        ex_source, ex_date, ex_quote, ex_analysis,
      });
    }
  }

  return entries;
}

// ── Database setup ─────────────────────────────────────────────────────────
const dbDir = path.join(__dirname, '../../assets/db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath     = path.join(dbDir, 'kamus.db');
const schemaPath = path.join(__dirname, '../schema.sql');

const db = new Database(dbPath);
db.exec(fs.readFileSync(schemaPath, 'utf-8'));

const stmt = db.prepare(`
  INSERT OR REPLACE INTO entries
    (lang, category, seq_no, term, term_norm,
     definition, def_citation,
     ex_source, ex_date, ex_quote, ex_analysis)
  VALUES
    (@lang, @category, @seq_no, @term, @term_norm,
     @definition, @def_citation,
     @ex_source, @ex_date, @ex_quote, @ex_analysis)
`);

const insertAll = db.transaction((entries: ParsedEntry[]) => {
  let count = 0;
  for (const e of entries) { stmt.run(e); count++; }
  return count;
});

// ── Collect files ──────────────────────────────────────────────────────────
let files: string[] = [];

if (targetFile) {
  // Mode: file tunggal dari argumen --file
  files = [path.resolve(targetFile)];
} else {
  // Mode: scan seluruh folder db/seed/xlsx/
  if (!fs.existsSync(xlsxDir)) fs.mkdirSync(xlsxDir, { recursive: true });
  files = fs.readdirSync(xlsxDir)
    .filter(f => /\.xlsx?$/i.test(f))
    .map(f => path.join(xlsxDir, f));
}

if (files.length === 0) {
  console.error('\n⚠  Tidak ada file xlsx ditemukan.');
  console.error('   Opsi 1 — Taruh file xlsx di folder: db/seed/xlsx/');
  console.error('   Opsi 2 — Jalankan dengan argumen: ts-node ... -- --file path/file.xlsx\n');
  process.exit(1);
}

// ── Run ────────────────────────────────────────────────────────────────────
let grandTotal = 0;

for (const filePath of files) {
  const category = forceCat ?? categoryFromFilename(filePath);
  console.log(`\n📂 ${path.basename(filePath)}`);
  console.log(`   Kategori: "${category}"`);

  const entries = parseXlsx(filePath, category);

  if (entries.length === 0) {
    console.log('   ⚠  Tidak ada data ditemukan, lewati.');
    continue;
  }

  const idCount = entries.filter(e => e.lang === 'id').length;
  const frCount = entries.filter(e => e.lang === 'fr').length;

  // Validasi: peringatkan jika jumlah ID dan FR tidak sama
  if (idCount !== frCount) {
    console.warn(`   ⚠  Jumlah ID (${idCount}) ≠ FR (${frCount}) — ada baris yang tidak lengkap`);
  }

  const count = insertAll(entries);
  grandTotal += count;
  console.log(`   ✓ ${idCount} ID + ${frCount} FR = ${count} entri`);
}

// ── Optimasi FTS5 ──────────────────────────────────────────────────────────
try {
  db.exec("INSERT INTO entries_fts(entries_fts) VALUES('optimize')");
  console.log('\n   ✓ FTS5 index dioptimasi');
} catch {
  // tidak kritis
}
db.exec('VACUUM');

// ── Ringkasan akhir ────────────────────────────────────────────────────────
const summary = db.prepare(`
  SELECT lang, category, COUNT(*) as n
  FROM entries
  GROUP BY lang, category
  ORDER BY category, lang
`).all() as { lang: string; category: string; n: number }[];

console.log('\n📊 Ringkasan database:');
console.log('─'.repeat(52));

let curCat = '';
let total  = 0;
for (const r of summary) {
  if (r.category !== curCat) {
    if (curCat) console.log('');
    console.log(`  📁 ${r.category}`);
    curCat = r.category;
  }
  console.log(`     [${r.lang.toUpperCase()}] ${r.n} entri`);
  total += r.n;
}

console.log('─'.repeat(52));
console.log(`  ✓ Total keseluruhan: ${total} entri`);
console.log(`  ✓ Disimpan di: ${dbPath}\n`);

db.close();