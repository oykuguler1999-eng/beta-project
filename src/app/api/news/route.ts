import { NextResponse } from "next/server";
import { getDb, rowsToObjects, type NewsItem } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const rs = await db.execute(
    "SELECT * FROM news_items ORDER BY COALESCE(published_at, fetched_at) DESC LIMIT 100"
  );
  return NextResponse.json(rowsToObjects<NewsItem>(rs));
}
