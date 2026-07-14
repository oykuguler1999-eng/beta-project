import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.TURSO_DATABASE_URL;
let db;

if (url) {
  db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
} else {
  const DATA_DIR = path.join(__dirname, "..", "data");
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  db = createClient({ url: `file:${path.join(DATA_DIR, "app.db")}` });
}

await db.execute(`
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

const countRs = await db.execute("SELECT COUNT(*) as c FROM competitors");
const count = Number(countRs.rows[0][0]);

if (count === 0) {
  const rows = [
    {
      name: "Beta Enerji (biz)",
      is_own_company: 1,
      market_share_percent: 18,
      annual_capacity_mva: 4200,
      hq_location: "Türkiye",
      strengths:
        "Hızlı teslimat süresi, güçlü mühendislik ekibi, yerli üretim avantajı, esnek özel tasarım kapasitesi",
      weaknesses: "Kısıtlı yurt dışı satış ağı, marka bilinirliği rakiplere göre daha düşük",
      notable_projects: "Örnek: 2025 TEİAŞ trafo alım ihalesi (örnek veri - güncellenmeli)",
      notes: "BU SATIR ÖRNEK VERİDİR. Gerçek pazar payı ve kapasite bilgilerini güncelleyin.",
    },
    {
      name: "Rakip A A.Ş. (örnek)",
      is_own_company: 0,
      market_share_percent: 24,
      annual_capacity_mva: 5600,
      hq_location: "Türkiye",
      strengths: "Geniş bayi ağı, düşük maliyetli seri üretim",
      weaknesses: "Özel tasarım projelerinde daha yavaş, uzun teslim süreleri",
      notable_projects: "Örnek: 2024 dağıtım şirketi çerçeve anlaşması (örnek veri)",
      notes: "BU SATIR ÖRNEK VERİDİR. Gerçek verilerle değiştirin.",
    },
    {
      name: "Rakip B GmbH (örnek)",
      is_own_company: 0,
      market_share_percent: 15,
      annual_capacity_mva: 3100,
      hq_location: "Almanya",
      strengths: "Yüksek teknoloji / dijital trafo çözümleri, güçlü Ar-Ge",
      weaknesses: "Yüksek fiyat, yerel pazara uzak lojistik",
      notable_projects: "Örnek: Avrupa yenilenebilir enerji projesi (örnek veri)",
      notes: "BU SATIR ÖRNEK VERİDİR. Gerçek verilerle değiştirin.",
    },
    {
      name: "Rakip C Ltd. (örnek)",
      is_own_company: 0,
      market_share_percent: 11,
      annual_capacity_mva: 2400,
      hq_location: "Çin",
      strengths: "Çok düşük maliyet, yüksek üretim hacmi",
      weaknesses: "Kalite/servis algısı zayıf, uzun sevkiyat süreleri",
      notable_projects: "Örnek: Afrika altyapı ihalesi (örnek veri)",
      notes: "BU SATIR ÖRNEK VERİDİR. Gerçek verilerle değiştirin.",
    },
  ];

  for (const r of rows) {
    await db.execute({
      sql: `
        INSERT INTO competitors
          (name, is_own_company, market_share_percent, annual_capacity_mva, hq_location, strengths, weaknesses, notable_projects, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        r.name,
        r.is_own_company,
        r.market_share_percent,
        r.annual_capacity_mva,
        r.hq_location,
        r.strengths,
        r.weaknesses,
        r.notable_projects,
        r.notes,
      ],
    });
  }

  console.log(`Seeded ${rows.length} example competitor rows.`);
} else {
  console.log("Competitors table already has data, skipping seed.");
}
