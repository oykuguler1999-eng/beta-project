import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM competitors ORDER BY is_own_company DESC, market_share_percent DESC"
    )
    .all();
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || body.name.trim() === "") {
    return NextResponse.json({ error: "İsim zorunludur." }, { status: 400 });
  }

  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO competitors
      (name, is_own_company, market_share_percent, annual_capacity_mva, hq_location, strengths, weaknesses, notable_projects, notes, updated_at)
    VALUES (@name, @is_own_company, @market_share_percent, @annual_capacity_mva, @hq_location, @strengths, @weaknesses, @notable_projects, @notes, datetime('now'))
  `);

  const info = stmt.run({
    name: body.name.trim(),
    is_own_company: body.is_own_company ? 1 : 0,
    market_share_percent: Number(body.market_share_percent) || 0,
    annual_capacity_mva: body.annual_capacity_mva ? Number(body.annual_capacity_mva) : null,
    hq_location: body.hq_location ?? null,
    strengths: body.strengths ?? null,
    weaknesses: body.weaknesses ?? null,
    notable_projects: body.notable_projects ?? null,
    notes: body.notes ?? null,
  });

  const row = db
    .prepare("SELECT * FROM competitors WHERE id = ?")
    .get(info.lastInsertRowid);

  return NextResponse.json(row, { status: 201 });
}
