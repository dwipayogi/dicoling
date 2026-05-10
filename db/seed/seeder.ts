import Database from "better-sqlite3";
import { parse } from "csv-parse/sync";
import { readFileSync, readdirSync } from "fs";
import { parseRow } from "./parser";

/**
 * Konvensi penamaan file CSV:
 *   {Nama_Kategori}_{LANG}.csv
 *   Analisis_Wacana_ID.csv → category: "Analisis Wacana", lang: "id"
 *   Analisis_Wacana_FR.csv → category: "Analisis Wacana", lang: "fr"
 */
function parseCsvFilename(filename: string) {
  // "Analisis_Wacana_ID.csv" → { category: "Analisis Wacana", lang: "id" }
  const base = filename.replace(/\.csv$/i, "");
  const parts = base.split("_");
  const langRaw = parts.pop()!.toLowerCase();
  const lang = langRaw === "id" ? "id" : "fr";
  const category = parts.join(" "); // "Analisis Wacana"
  return { category, lang };
}

// Buka DB + jalankan schema
const db = new Database("assets/db/kamus.db");
db.exec(readFileSync("db/schema.sql", "utf-8"));

const stmt = db.prepare(`
  INSERT OR IGNORE INTO entries
    (lang, category, seq_no, term, term_norm,
      definition, def_citation,
      ex_source, ex_date, ex_quote, ex_analysis)
  VALUES
    (@lang, @category, @seq_no, @term, @term_norm,
      @definition, @def_citation,
      @ex_source, @ex_date, @ex_quote, @ex_analysis)
`);

const seedAll = db.transaction((files: string[]) => {
  let total = 0;

  for (const filename of files) {
    const { category, lang } = parseCsvFilename(filename);
    const raw = readFileSync(`db/seed/csv/${filename}`, "utf-8");

    const rows = parse(raw, {
      columns: true,
      delimiter: ";", // ← semicolon!
      skip_empty_lines: true,
      trim: true,
      bom: true, // ← file punya BOM (﻿)
      relax_quotes: true,
    });

    for (const row of rows) {
      const parsed = parseRow(row as Record<string, string>);
      stmt.run({ ...parsed, lang, category });
      total++;
    }

    console.log(`  ✓ ${filename} → ${rows.length} entri (${lang}/${category})`);
  }

  return total;
});

// Ambil semua file CSV dari folder seed/csv/
const files = readdirSync("db/seed/csv").filter((f) => f.endsWith(".csv"));

const total = seedAll(files);
console.log(`\n✓ Total: ${total} entri di-seed`);

// Optimasi FTS5 setelah bulk insert
db.exec("INSERT INTO entries_fts(entries_fts) VALUES('optimize')");
db.exec("VACUUM");
db.close();
