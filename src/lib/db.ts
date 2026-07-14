import { createClient, type Client, type ResultSet } from "@libsql/client";
import path from "path";
import fs from "fs";

declare global {
  var __betaDbClient: Client | undefined;
  var __betaDbReady: Promise<void> | undefined;
}

function createConnection(): Client {
  const url = process.env.TURSO_DATABASE_URL;

  if (!url) {
    const DATA_DIR = path.join(process.cwd(), "data");
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return createClient({ url: `file:${path.join(DATA_DIR, "app.db")}` });
  }

  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
}

async function ensureSchema(client: Client) {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS competitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_own_company INTEGER NOT NULL DEFAULT 0,
      market_share_percent REAL NOT NULL DEFAULT 0,
      annual_capacity_mva REAL,
      hq_location TEXT,
      strengths TEXT,
      weaknesses TEXT,
      notable_projects TEXT,
      notes TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS news_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link TEXT NOT NULL UNIQUE,
      source TEXT,
      summary TEXT,
      published_at TEXT,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS trade_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period TEXT NOT NULL,
      reporter TEXT NOT NULL,
      partner TEXT NOT NULL,
      flow TEXT NOT NULL,
      cn_code TEXT NOT NULL,
      value_eur REAL,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(period, reporter, partner, flow, cn_code)
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS fetch_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT,
      ran_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS tenders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      institution TEXT,
      status TEXT NOT NULL DEFAULT 'acik',
      amount REAL,
      currency TEXT DEFAULT 'TRY',
      deadline_date TEXT,
      notes TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export async function logFetch(
  job: string,
  status: "ok" | "error",
  message: string
) {
  const db = await getDb();
  await db.execute({
    sql: "INSERT INTO fetch_log (job, status, message) VALUES (?, ?, ?)",
    args: [job, status, message],
  });
}

export async function getDb(): Promise<Client> {
  if (!global.__betaDbClient) {
    global.__betaDbClient = createConnection();
    global.__betaDbReady = ensureSchema(global.__betaDbClient);
  }
  await global.__betaDbReady;
  return global.__betaDbClient;
}

export function rowsToObjects<T>(rs: ResultSet): T[] {
  return rs.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    rs.columns.forEach((col, i) => {
      obj[col] = (row as unknown as unknown[])[i];
    });
    return obj as T;
  });
}

export type Competitor = {
  id: number;
  name: string;
  is_own_company: number;
  market_share_percent: number;
  annual_capacity_mva: number | null;
  hq_location: string | null;
  strengths: string | null;
  weaknesses: string | null;
  notable_projects: string | null;
  notes: string | null;
  updated_at: string;
};

export type Tender = {
  id: number;
  title: string;
  institution: string | null;
  status: "acik" | "kazanildi" | "kaybedildi";
  amount: number | null;
  currency: string | null;
  deadline_date: string | null;
  notes: string | null;
  updated_at: string;
};

export type NewsItem = {
  id: number;
  title: string;
  link: string;
  source: string | null;
  summary: string | null;
  published_at: string | null;
  fetched_at: string;
};

export type TradeDataRow = {
  id: number;
  period: string;
  reporter: string;
  partner: string;
  flow: string;
  cn_code: string;
  value_eur: number | null;
  fetched_at: string;
};

export type FetchLogEntry = {
  id: number;
  job: string;
  status: "ok" | "error";
  message: string | null;
  ran_at: string;
};
