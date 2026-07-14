import Parser from "rss-parser";
import { getDb, logFetch } from "@/lib/db";
import { NEWS_FEEDS, NEWS_KEYWORDS } from "@/lib/sources/news";

const parser = new Parser();

function matchesKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return NEWS_KEYWORDS.some((k) => lower.includes(k.toLowerCase()));
}

export async function fetchNews(): Promise<{ inserted: number; errors: string[] }> {
  const db = await getDb();
  let inserted = 0;
  const errors: string[] = [];

  for (const feed of NEWS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const item of result.items ?? []) {
        const title = item.title ?? "";
        const summary = item.contentSnippet ?? item.content ?? "";
        if (!matchesKeywords(`${title} ${summary}`)) continue;
        if (!item.link) continue;

        try {
          await db.execute({
            sql: `
              INSERT INTO news_items (title, link, source, summary, published_at)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(link) DO NOTHING
            `,
            args: [
              title,
              item.link,
              feed.name,
              summary.slice(0, 500),
              item.isoDate ?? item.pubDate ?? null,
            ],
          });
          inserted += 1;
        } catch {
          // duplicate veya tekil satır hatası - atla
        }
      }
    } catch (err) {
      const msg = `${feed.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
    }
  }

  await logFetch(
    "news",
    errors.length === 0 ? "ok" : "error",
    `${inserted} haber eklendi/güncellendi. ${errors.length > 0 ? "Hatalar: " + errors.join(" | ") : ""}`
  );

  return { inserted, errors };
}
