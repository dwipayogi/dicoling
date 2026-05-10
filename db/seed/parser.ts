/**
 * Parser untuk CSV format kamus Dicoling.
 * Delimiter: semicolon (;)
 * Kolom: No;Istilah;Definisi;Contoh
 */

export interface ParsedEntry {
  seq_no: number;
  term: string;
  term_norm: string;
  definition: string;
  def_citation: string | null;
  ex_source: string | null;
  ex_date: string | null;
  ex_quote: string | null;
  ex_analysis: string | null;
}

// ── 1. Normalisasi string ─────────────────────────────────
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // hapus diakritik: é→e, à→a
    .replace(/['']/g, "'") // normalize apostrophe
    .trim();
}

// ── 2. Extract sitasi dari definisi ──────────────────────
// Input : "...relasi kekuasaan (van Leeuwen, 2008)."
// Output: { def: "...relasi kekuasaan.", citation: "(van Leeuwen, 2008)" }
export function parseDefinition(raw: string) {
  // Pattern: teks diakhiri (Penulis, tahun). atau (P1; P2, tahun).
  const match = raw.trim().match(/^(.*?)\s*(\([^)]+\d{4}[^)]*\))\.?\s*$/s);

  if (!match) {
    return { definition: raw.trim(), def_citation: null };
  }

  return {
    definition: match[1].trim().replace(/\.$/, "").trim() + ".",
    def_citation: match[2].trim(),
  };
}

// ── 3. Parse kolom "Contoh" ───────────────────────────────
//
// Format: "Source, DD/MM/YYYY: "quote" → Analisis: analysis"
// Variasi yang ada di data:
//   a. Dengan tanda petik: Kompas, 13/04/2023: "teks" → Analisis: ...
//   b. Tanpa tanda petik:  Kompas Edu, 27/02/2023: teks → Analisis: ...
//   c. Multi-source:       CNN, 12/01/2024 + Kompas, 13/04/2023: "teks" → ...
//   d. Tanpa analisis:     (jarang, fallback graceful)
// ─────────────────────────────────────────────────────────
export function parseContoh(raw: string) {
  if (!raw?.trim()) {
    return {
      ex_source: null,
      ex_date: null,
      ex_quote: null,
      ex_analysis: null,
    };
  }

  const text = raw.trim();

  // Step 1: Pisahkan bagian "source + date" dari kutipan
  // Pola: teks sebelum titik dua pertama yang diikuti spasi + kutipan/huruf
  const colonIdx = text.indexOf(": ");
  if (colonIdx === -1) {
    return {
      ex_source: null,
      ex_date: null,
      ex_quote: text,
      ex_analysis: null,
    };
  }

  const sourcePart = text.slice(0, colonIdx).trim();
  const rest = text.slice(colonIdx + 2).trim();

  // Step 2: Parse source dan date dari "Kompas, 13/04/2023"
  // Multi-source: "CNN Indonesia, 12/01/2024 + Kompas, 13/04/2023"
  const datePattern = /\d{2}\/\d{2}\/\d{4}/g;
  const dates = [...sourcePart.matchAll(datePattern)].map((m) => m[0]);

  let ex_source: string | null = null;
  let ex_date: string | null = null;

  if (dates.length > 0) {
    ex_date = dates.join(" + ");
    ex_source =
      sourcePart
        .replace(datePattern, "")
        .replace(/[,+\s]+$/, "") // hapus koma/plus trailing
        .replace(/[,+]\s*$/, "")
        .trim() || null;
  } else {
    ex_source = sourcePart || null;
  }

  // Step 3: Pisahkan kutipan dari analisis via " → Analisis:" / " → Analyse :"
  const arrowSplit = rest.split(/\s*→\s*Analisi[s]?:\s*|\s*→\s*Analyse\s*:\s*/);

  let ex_quote: string | null = arrowSplit[0]?.trim() || null;
  const ex_analysis: string | null = arrowSplit[1]?.trim() || null;

  // Step 4: Bersihkan tanda petik pembuka/penutup dari kutipan
  if (ex_quote) {
    ex_quote = ex_quote
      .replace(/^[""\u201C\u201D]+/, "")
      .replace(/[""\u201C\u201D]+$/, "")
      .trim();
  }

  return { ex_source, ex_date, ex_quote, ex_analysis };
}

// ── 4. Parse satu baris CSV ───────────────────────────────
export function parseRow(row: Record<string, string>): ParsedEntry {
  const rawDef = row["Definisi (ID )"] ?? row["Définition (FR)"] ?? "";
  const rawEx = row["Contoh   (ID)"] ?? row["Exemple  (FR)"] ?? "";
  const rawTerm = row["Istilah (ID)"] ?? row["Lexique (FR)"] ?? "";

  const { definition, def_citation } = parseDefinition(rawDef);
  const { ex_source, ex_date, ex_quote, ex_analysis } = parseContoh(rawEx);

  return {
    seq_no: parseInt(row["No"]) || 0,
    term: rawTerm.trim(),
    term_norm: norm(rawTerm),
    definition,
    def_citation,
    ex_source,
    ex_date,
    ex_quote,
    ex_analysis,
  };
}
