import { NextResponse } from "next/server";
import { getDb, rowsToObjects, type FetchLogEntry } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const rs = await db.execute(
    "SELECT * FROM fetch_log ORDER BY ran_at DESC LIMIT 20"
  );
  return NextResponse.json(rowsToObjects<FetchLogEntry>(rs));
}
