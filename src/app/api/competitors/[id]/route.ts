import { NextRequest, NextResponse } from "next/server";
import { getDb, type Competitor } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM competitors WHERE id = ?")
    .get(id) as Competitor | undefined;
  if (!existing) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  db.prepare(`
    UPDATE competitors SET
      name = @name,
      is_own_company = @is_own_company,
      market_share_percent = @market_share_percent,
      annual_capacity_mva = @annual_capacity_mva,
      hq_location = @hq_location,
      strengths = @strengths,
      weaknesses = @weaknesses,
      notable_projects = @notable_projects,
      notes = @notes,
      updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    name: body.name?.trim() || existing.name,
    is_own_company: body.is_own_company ? 1 : 0,
    market_share_percent: Number(body.market_share_percent) || 0,
    annual_capacity_mva: body.annual_capacity_mva ? Number(body.annual_capacity_mva) : null,
    hq_location: body.hq_location ?? null,
    strengths: body.strengths ?? null,
    weaknesses: body.weaknesses ?? null,
    notable_projects: body.notable_projects ?? null,
    notes: body.notes ?? null,
  });

  const row = db.prepare("SELECT * FROM competitors WHERE id = ?").get(id);
  return NextResponse.json(row);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM competitors WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
