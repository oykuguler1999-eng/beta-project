import { getDb, logFetch } from "@/lib/db";
import { decodeJsonStat, type JsonStatDataset } from "@/lib/fetchers/jsonStat";
import {
  COMEXT_DATASET,
  COMEXT_FLOWS,
  COMEXT_PARTNER,
  COMEXT_PRODUCT_CODES,
  COMEXT_REPORTER,
} from "@/lib/sources/tradeData";

function buildUrl(productCode: string, flowCode: string): string {
  const params = new URLSearchParams({
    format: "JSON",
    lang: "EN",
    freq: "M",
    reporter: COMEXT_REPORTER,
    partner: COMEXT_PARTNER,
    product: productCode,
    flow: flowCode,
  });
  return `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${COMEXT_DATASET}?${params.toString()}`;
}

export async function fetchTradeData(): Promise<{ inserted: number; errors: string[] }> {
  const db = await getDb();
  let inserted = 0;
  const errors: string[] = [];

  for (const productCode of COMEXT_PRODUCT_CODES) {
    for (const flow of COMEXT_FLOWS) {
      const url = buildUrl(productCode, flow.code);
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as JsonStatDataset;
        const rows = decodeJsonStat(data);

        for (const row of rows) {
          const period = String(row["time"] ?? row["TIME_PERIOD"] ?? "");
          const value = Number(row["value"]);
          if (!period || Number.isNaN(value)) continue;

          await db.execute({
            sql: `
              INSERT INTO trade_data (period, reporter, partner, flow, cn_code, value_eur)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(period, reporter, partner, flow, cn_code)
              DO UPDATE SET value_eur = excluded.value_eur, fetched_at = datetime('now')
            `,
            args: [period, COMEXT_REPORTER, COMEXT_PARTNER, flow.label, productCode, value],
          });
          inserted += 1;
        }
      } catch (err) {
        errors.push(
          `CN ${productCode} / ${flow.label}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }

  await logFetch(
    "trade-data",
    errors.length === 0 ? "ok" : "error",
    `${inserted} kayıt eklendi/güncellendi. ${errors.length > 0 ? "Hatalar: " + errors.join(" | ") : ""}`
  );

  return { inserted, errors };
}
