import { NextRequest, NextResponse } from "next/server";
import { getDb, rowsToObjects, type Competitor } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const db = await getDb();
  const existingRs = await db.execute({
    sql: "SELECT * FROM competitors WHERE id = ?",
    args: [id],
  });
  const existing = rowsToObjects<Competitor>(existingRs)[0];
  if (!existing) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  await db.execute({
    sql: `
      UPDATE competitors SET
        name = ?,
        is_own_company = ?,
        market_share_percent = ?,
        annual_capacity_mva = ?,
        hq_location = ?,
        strengths = ?,
        weaknesses = ?,
        notable_projects = ?,
        notes = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `,
    args: [
      body.name?.trim() || existing.name,
      body.is_own_company ? 1 : 0,
      Number(body.market_share_percent) || 0,
      body.annual_capacity_mva ? Number(body.annual_capacity_mva) : null,
      body.hq_location ?? null,
      body.strengths ?? null,
      body.weaknesses ?? null,
      body.notable_projects ?? null,
      body.notes ?? null,
      id,
    ],
  });

  const rs = await db.execute({
    sql: "SELECT * FROM competitors WHERE id = ?",
    args: [id],
  });
  return NextResponse.json(rowsToObjects<Competitor>(rs)[0]);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM competitors WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
