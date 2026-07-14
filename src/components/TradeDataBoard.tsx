"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshStatus } from "@/components/RefreshStatus";

type TradeDataRow = {
  id: number;
  period: string;
  reporter: string;
  partner: string;
  flow: string;
  cn_code: string;
  value_eur: number | null;
  fetched_at: string;
};

export function TradeDataBoard() {
  const [rows, setRows] = useState<TradeDataRow[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const res = await fetch("/api/trade-data");
    const data = await res.json();
    setRows(data);
  }

  useEffect(() => {
    let ignore = false;
    async function initialLoad() {
      const res = await fetch("/api/trade-data");
      const data = await res.json();
      if (!ignore) setRows(data);
    }
    initialLoad();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetch("/api/trade-data/refresh", { method: "POST" });
    await load();
    setRefreshing(false);
  }

  const chartData = useMemo(() => {
    if (!rows) return [];
    const byPeriod = new Map<string, { period: string; ithalat: number; ihracat: number }>();
    for (const r of rows) {
      const entry = byPeriod.get(r.period) ?? { period: r.period, ithalat: 0, ihracat: 0 };
      if (r.flow === "ithalat") entry.ithalat += r.value_eur ?? 0;
      if (r.flow === "ihracat") entry.ihracat += r.value_eur ?? 0;
      byPeriod.set(r.period, entry);
    }
    return Array.from(byPeriod.values()).sort((a, b) => a.period.localeCompare(b.period));
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RefreshStatus job="trade-data" label="Comext taraması" />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {refreshing ? "Çekiliyor..." : "Şimdi yenile"}
        </button>
      </div>

      {!rows ? (
        <p className="text-slate-400">Yükleniyor...</p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-sm text-slate-400">
          Henüz veri yok. &quot;Şimdi yenile&quot; ile Eurostat Comext&apos;ten
          ilk çekimi deneyin. Hata alırsanız{" "}
          <code className="text-slate-300">src/lib/sources/tradeData.ts</code>{" "}
          içindeki sorgu parametrelerini (reporter/partner/ürün kodu) kontrol
          edin — bu ortamdan Eurostat&apos;a erişim engellendiği için
          parametreler canlı doğrulanamadı.
        </p>
      ) : (
        <>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="mb-3 text-sm font-medium text-slate-300">
              CN 8504 (Elektrik Transformatörleri) — Dönemsel İthalat/İhracat (EUR)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
                />
                <Legend />
                <Bar dataKey="ithalat" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ihracat" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Dönem</th>
                  <th className="px-4 py-2">Akış</th>
                  <th className="px-4 py-2">Rapor eden</th>
                  <th className="px-4 py-2">Partner</th>
                  <th className="px-4 py-2">CN Kodu</th>
                  <th className="px-4 py-2 text-right">Değer (EUR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 text-slate-200">{r.period}</td>
                    <td className="px-4 py-2 text-slate-300">{r.flow}</td>
                    <td className="px-4 py-2 text-slate-300">{r.reporter}</td>
                    <td className="px-4 py-2 text-slate-300">{r.partner}</td>
                    <td className="px-4 py-2 text-slate-300">{r.cn_code}</td>
                    <td className="px-4 py-2 text-right text-slate-200">
                      {r.value_eur?.toLocaleString("tr-TR") ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
