import { NextRequest, NextResponse } from "next/server";
import { getDb, rowsToObjects, type Tender } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const db = await getDb();
  const existingRs = await db.execute({
    sql: "SELECT * FROM tenders WHERE id = ?",
    args: [id],
  });
  const existing = rowsToObjects<Tender>(existingRs)[0];
  if (!existing) {
    return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  }

  await db.execute({
    sql: `
      UPDATE tenders SET
        title = ?,
        institution = ?,
        status = ?,
        amount = ?,
        currency = ?,
        deadline_date = ?,
        notes = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `,
    args: [
      body.title?.trim() || existing.title,
      body.institution ?? null,
      body.status || existing.status,
      body.amount ? Number(body.amount) : null,
      body.currency || "TRY",
      body.deadline_date || null,
      body.notes ?? null,
      id,
    ],
  });

  const rs = await db.execute({
    sql: "SELECT * FROM tenders WHERE id = ?",
    args: [id],
  });
  return NextResponse.json(rowsToObjects<Tender>(rs)[0]);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM tenders WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
