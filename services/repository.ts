import * as SQLite from "expo-sqlite";
import type { Language } from "@/contexts/LanguageContext";

/* -------------------------------------------------------------------------- */
/*                              Type definitions                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_SEARCH_LIMIT = 200;

type EntryRow = {
	id: number;
	lang: "id" | "fr";
	category: string;
	seq_no: number | null;
	term: string;
	term_norm: string;
	definition: string;
	def_citation: string | null;
	ex_source: string | null;
	ex_date: string | null;
	ex_quote: string | null;
	ex_analysis: string | null;
};

export type EntryListItem = {
	id: number;
	name: string;
	name_norm: string;
	desc: string;
};

export type EntryDetail = EntryListItem & {
	example: string;
};


const LANGUAGE_MAP: Record<Language, "id" | "fr"> = {
	ID: "id",
	FR: "fr",
};

/* -------------------------------------------------------------------------- */
/*                        Kamus DB (asset, read-only)                         */
/* -------------------------------------------------------------------------- */

/**
 * Get the kamus database instance.
 *
 * Kamus DB is opened from the bundled asset `assets/db/kamus.db` via
 * `SQLiteProvider` in the root layout. This singleton mirrors that same
 * database file so repository helpers can be called from non-component code
 * (e.g. services, utilities) without relying on React context.
 *
 * For component-level access, prefer `useSQLiteContext()`.
 */
let kamusDbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const KAMUS_DB_NAME = "kamus.db";

export async function getKamusDb(): Promise<SQLite.SQLiteDatabase> {
	if (!kamusDbPromise) {
		kamusDbPromise = (async () => {
			const db = await SQLite.openDatabaseAsync(KAMUS_DB_NAME);
			await db.execAsync("PRAGMA journal_mode = WAL;");
			return db;
		})();
	}
	return kamusDbPromise;
}

/**
 * Initialize the kamus database by importing the asset.
 * Called once by SQLiteProvider's onInit callback.
 */
export async function initKamusDb(
	db: SQLite.SQLiteDatabase,
): Promise<void> {
	await db.execAsync("PRAGMA journal_mode = WAL;");

	// Verify asset DB was loaded correctly
	const result = await db.getFirstAsync<{ count: number }>(
		"SELECT COUNT(*) as count FROM entries",
	);
	console.log(`[KamusDB] Loaded with ${result?.count ?? 0} entries`);
}

/* -------------------------------------------------------------------------- */
/*                          App DB (runtime, writable)                        */
/* -------------------------------------------------------------------------- */

const APP_DB_NAME = "app.db";
let appDbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getAppDb(): Promise<SQLite.SQLiteDatabase> {
	if (!appDbPromise) {
		appDbPromise = (async () => {
			const db = await SQLite.openDatabaseAsync(APP_DB_NAME);
			await db.execAsync(`
				PRAGMA journal_mode = WAL;
				PRAGMA foreign_keys = ON;

				CREATE TABLE IF NOT EXISTS users (
					id             INTEGER PRIMARY KEY AUTOINCREMENT,
					name           TEXT    NOT NULL,
					email          TEXT    NOT NULL UNIQUE,
					password       TEXT    NOT NULL,
					created_at     TEXT    DEFAULT (datetime('now')),
					last_active_at TEXT    DEFAULT (datetime('now')),
					synced         INTEGER DEFAULT 0
				);
			`);
			return db;
		})();
	}
	return appDbPromise;
}

/* -------------------------------------------------------------------------- */
/*                              Mapping helpers                               */
/* -------------------------------------------------------------------------- */

function mapLanguage(language: Language) {
	return LANGUAGE_MAP[language];
}

function buildDescription(row: EntryRow) {
	if (!row.def_citation) {
		return row.definition;
	}
	return `${row.definition} - ${row.def_citation}`;
}

function buildExample(row: EntryRow) {
	const sourceParts: string[] = [];

	if (row.ex_source) {
		sourceParts.push(row.ex_source);
	}

	if (row.ex_date) {
		sourceParts.push(row.ex_date);
	}

	const sourceText = sourceParts.join(", ");
	const quoteText = row.ex_quote ? `"${row.ex_quote}"` : "";
	const analysisLabel = row.lang === "fr" ? "Analyse" : "Analisis";
	const analysisText = row.ex_analysis
		? `${analysisLabel}: ${row.ex_analysis}`
		: "";

	if (sourceText && quoteText) {
		return analysisText
			? `${sourceText}: ${quoteText} -> ${analysisText}`
			: `${sourceText}: ${quoteText}`;
	}

	if (quoteText) {
		return analysisText ? `${quoteText} -> ${analysisText}` : quoteText;
	}

	if (sourceText) {
		return analysisText ? `${sourceText} -> ${analysisText}` : sourceText;
	}

	return analysisText;
}

function mapRowToListItem(row: EntryRow): EntryListItem {
	return {
		id: row.id,
		name: row.term,
		name_norm: row.term_norm.toLowerCase(),
		desc: buildDescription(row),
	};
}

function mapRowToDetail(row: EntryRow): EntryDetail {
	return {
		...mapRowToListItem(row),
		example: buildExample(row),
	};
}

function buildFtsQuery(input: string) {
	const tokens = input
		.trim()
		.replace(/["'*:()]/g, " ")
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 6);

	if (tokens.length === 0) {
		return "";
	}

	return tokens.map((token) => `${token}*`).join(" ");
}

/* -------------------------------------------------------------------------- */
/*                          Kamus (entries) queries                           */
/* -------------------------------------------------------------------------- */


export async function getEntriesByCategoryAndLang(
	category: string,
	language: Language,
): Promise<EntryListItem[]> {
	const db = await getKamusDb();
	const lang = mapLanguage(language);
	const rows = await db.getAllAsync<EntryRow>(
		`
			SELECT id, lang, category, seq_no, term, term_norm, definition, def_citation
			FROM entries
			WHERE category = ? AND lang = ?
			ORDER BY seq_no ASC, term_norm ASC
		`,
		[category, lang],
	);

	return rows.map(mapRowToListItem);
}

export async function searchEntriesByCategoryAndLang(params: {
	category: string;
	language: Language;
	query: string;
	limit?: number;
}): Promise<EntryListItem[]> {
	const { category, language, query, limit = DEFAULT_SEARCH_LIMIT } = params;
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) {
		return getEntriesByCategoryAndLang(category, language);
	}

	const db = await getKamusDb();
	const lang = mapLanguage(language);
	const likePattern = `%${normalizedQuery}%`;
	const rows = await db.getAllAsync<EntryRow>(
		`
			SELECT id, lang, category, seq_no, term, term_norm,
						 definition, def_citation
			FROM entries
			WHERE term_norm LIKE ?
				AND category = ?
				AND lang = ?
			ORDER BY seq_no ASC, term_norm ASC
			LIMIT ?
		`,
		[likePattern, category, lang, limit],
	);

	return rows.map(mapRowToListItem);
}

export async function getEntryDetailByTerm(params: {
	category: string;
	language: Language;
	termNorm: string;
}): Promise<EntryDetail | null> {
	const { category, language, termNorm } = params;
	const normalizedTerm = termNorm.trim().toLowerCase();
	if (!normalizedTerm) {
		return null;
	}

	const db = await getKamusDb();
	const lang = mapLanguage(language);
	const row = await db.getFirstAsync<EntryRow>(
		`
			SELECT *
			FROM entries
			WHERE term_norm = ? AND category = ? AND lang = ?
			LIMIT 1
		`,
		[normalizedTerm, category, lang],
	);

	return row ? mapRowToDetail(row) : null;
}

/* -------------------------------------------------------------------------- */
/*                                Auth Queries                                */
/* -------------------------------------------------------------------------- */

export type UserRow = {
	id: number;
	name: string;
	email: string;
	password: string;
	created_at: string;
	last_active_at: string;
	synced: number;
};

/* ------------------------------ getUserByEmail ----------------------------- */
/** Ambil user berdasarkan email (hasil null jika tidak ada). */
export async function getUserByEmail(email: string): Promise<UserRow | null> {
	const db = await getAppDb();
	return db.getFirstAsync<UserRow>("SELECT * FROM users WHERE email = ?", [
		email,
	]);
}

/* ------------------------ getUserByEmailAndPassword ----------------------- */
/** Ambil user berdasarkan email+password (untuk login offline). */
export async function getUserByEmailAndPassword(
	email: string,
	password: string,
): Promise<UserRow | null> {
	const db = await getAppDb();
	return db.getFirstAsync<UserRow>(
		"SELECT * FROM users WHERE email = ? AND password = ?",
		[email, password],
	);
}

/* -------------------------------- insertUser ------------------------------ */
/** Simpan user baru ke lokal (tanpa sync). */
export async function insertUser(params: {
	name: string;
	email: string;
	password: string;
	synced: number;
}): Promise<void> {
	const { name, email, password, synced } = params;
	const db = await getAppDb();
	await db.runAsync(
		"INSERT INTO users (name, email, password, synced) VALUES (?, ?, ?, ?)",
		[name, email, password, synced],
	);
}

/* -------------------------------- upsertUser ------------------------------ */
/** Upsert user lokal (digunakan saat register online). */
export async function upsertUser(params: {
	name: string;
	email: string;
	password: string;
	synced: number;
}): Promise<void> {
	const { name, email, password, synced } = params;
	const db = await getAppDb();
	await db.runAsync(
		"INSERT OR REPLACE INTO users (name, email, password, synced) VALUES (?, ?, ?, ?)",
		[name, email, password, synced],
	);
}

/* ------------------------ updateUserAfterOnlineLogin ----------------------- */
/** Update nama, last_active_at, dan status sync setelah login online. */
export async function updateUserAfterOnlineLogin(params: {
	email: string;
	name: string;
}): Promise<void> {
	const { email, name } = params;
	const db = await getAppDb();
	await db.runAsync(
		"UPDATE users SET name = ?, last_active_at = datetime('now'), synced = 1 WHERE email = ?",
		[name, email],
	);
}

/* -------------------------- updateUserLastActive -------------------------- */
/** Update last_active_at user lokal (login offline). */
export async function updateUserLastActive(id: number): Promise<void> {
	const db = await getAppDb();
	await db.runAsync(
		"UPDATE users SET last_active_at = datetime('now') WHERE id = ?",
		[id],
	);
}

/* --------------------------- getUnsyncedUsers ---------------------------- */
/** Ambil daftar user yang belum disinkronkan ke server. */
export async function getUnsyncedUsers(): Promise<UserRow[]> {
	const db = await getAppDb();
	return db.getAllAsync<UserRow>("SELECT * FROM users WHERE synced = 0");
}

/* ---------------------------- markUserSynced ----------------------------- */
/** Tandai user lokal sebagai sudah tersinkron. */
export async function markUserSynced(id: number): Promise<void> {
	const db = await getAppDb();
	await db.runAsync("UPDATE users SET synced = 1 WHERE id = ?", [id]);
}
