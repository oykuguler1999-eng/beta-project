import { NextRequest, NextResponse } from "next/server";
import { getDb, rowsToObjects, type Tender } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const rs = await db.execute(
    "SELECT * FROM tenders ORDER BY COALESCE(deadline_date, updated_at) DESC"
  );
  return NextResponse.json(rowsToObjects<Tender>(rs));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || body.title.trim() === "") {
    return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.execute({
    sql: `
      INSERT INTO tenders
        (title, institution, status, amount, currency, deadline_date, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `,
    args: [
      body.title.trim(),
      body.institution ?? null,
      body.status || "acik",
      body.amount ? Number(body.amount) : null,
      body.currency || "TRY",
      body.deadline_date || null,
      body.notes ?? null,
    ],
  });

  const rs = await db.execute({
    sql: "SELECT * FROM tenders WHERE id = ?",
    args: [Number(result.lastInsertRowid)],
  });

  return NextResponse.json(rowsToObjects<Tender>(rs)[0], { status: 201 });
}
