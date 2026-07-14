import Link from "next/link";
import { getDb, rowsToObjects, type Competitor } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getSummary() {
  const db = await getDb();
  const rs = await db.execute(
    "SELECT * FROM competitors ORDER BY market_share_percent DESC"
  );
  const rows = rowsToObjects<Competitor>(rs);

  const own = rows.find((r) => r.is_own_company);
  const topCompetitor = rows.find((r) => !r.is_own_company);
  const lastUpdated = rows
    .map((r) => r.updated_at)
    .sort()
    .at(-1);

  return { rows, own, topCompetitor, lastUpdated };
}

const MODULES = [
  {
    href: "/rakip-analizi",
    title: "Rakip Analizi & Pazar Payı",
    status: "Aktif",
    description:
      "Rakip firmaların pazar payı, kapasite, güçlü/zayıf yönleri — düzenlenebilir.",
  },
  {
    href: "/ihaleler",
    title: "İhaleler",
    status: "Kurulum bekliyor",
    description: "Güncel ve kazanılan trafo ihaleleri takibi.",
  },
  {
    href: "/trade-data",
    title: "Trade Data & Comext",
    status: "Kurulum bekliyor",
    description: "Günlük dış ticaret verileri, Eurostat Comext entegrasyonu.",
  },
  {
    href: "/haberler",
    title: "Haberler & Teknoloji",
    status: "Kurulum bekliyor",
    description: "Sektör haberleri ve yeni teknoloji gelişmeleri akışı.",
  },
];

export default async function OverviewPage() {
  const { own, topCompetitor, lastUpdated, rows } = await getSummary();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Özet</h1>
        <p className="mt-1 text-sm text-slate-400">
          Beta Enerji iş geliştirme ekibi için pazar istihbaratı paneli.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Bizim Pazar Payımız
          </p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">
            {own ? `%${own.market_share_percent}` : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {own ? own.name : "Rakip Analizi modülünden ekleyin"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            En Büyük Rakip
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">
            {topCompetitor ? `%${topCompetitor.market_share_percent}` : "—"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {topCompetitor ? topCompetitor.name : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Takip Edilen Firma Sayısı
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">
            {rows.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Son güncelleme: {lastUpdated ?? "—"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          Modüller
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-amber-500/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-100">{m.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    m.status === "Aktif"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{m.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
