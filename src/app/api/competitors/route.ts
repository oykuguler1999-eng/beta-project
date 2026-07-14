import { NextRequest, NextResponse } from "next/server";
import { getDb, rowsToObjects, type Competitor } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const rs = await db.execute(
    "SELECT * FROM competitors ORDER BY is_own_company DESC, market_share_percent DESC"
  );
  return NextResponse.json(rowsToObjects<Competitor>(rs));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || body.name.trim() === "") {
    return NextResponse.json({ error: "İsim zorunludur." }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.execute({
    sql: `
      INSERT INTO competitors
        (name, is_own_company, market_share_percent, annual_capacity_mva, hq_location, strengths, weaknesses, notable_projects, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `,
    args: [
      body.name.trim(),
      body.is_own_company ? 1 : 0,
      Number(body.market_share_percent) || 0,
      body.annual_capacity_mva ? Number(body.annual_capacity_mva) : null,
      body.hq_location ?? null,
      body.strengths ?? null,
      body.weaknesses ?? null,
      body.notable_projects ?? null,
      body.notes ?? null,
    ],
  });

  const rs = await db.execute({
    sql: "SELECT * FROM competitors WHERE id = ?",
    args: [Number(result.lastInsertRowid)],
  });

  return NextResponse.json(rowsToObjects<Competitor>(rs)[0], { status: 201 });
}
