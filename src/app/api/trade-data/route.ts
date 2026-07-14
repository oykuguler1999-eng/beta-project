import { NextResponse } from "next/server";
import { getDb, rowsToObjects, type TradeDataRow } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const rs = await db.execute(
    "SELECT * FROM trade_data ORDER BY period DESC, flow, partner LIMIT 200"
  );
  return NextResponse.json(rowsToObjects<TradeDataRow>(rs));
}
