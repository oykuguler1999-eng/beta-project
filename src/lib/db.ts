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
