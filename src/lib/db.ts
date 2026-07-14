import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "app.db");

declare global {
  var __betaDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
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
    );
  `);

  return db;
}

export function getDb(): Database.Database {
  if (!global.__betaDb) {
    global.__betaDb = createConnection();
  }
  return global.__betaDb;
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
