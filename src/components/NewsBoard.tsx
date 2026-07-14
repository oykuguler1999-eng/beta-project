"use client";

import { useEffect, useState } from "react";
import { RefreshStatus } from "@/components/RefreshStatus";

type NewsItem = {
  id: number;
  title: string;
  link: string;
  source: string | null;
  summary: string | null;
  published_at: string | null;
  fetched_at: string;
};

export function NewsBoard() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const res = await fetch("/api/news");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    let ignore = false;
    async function initialLoad() {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!ignore) setItems(data);
    }
    initialLoad();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetch("/api/news/refresh", { method: "POST" });
    await load();
    setRefreshing(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RefreshStatus job="news" label="Haber taraması" />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {refreshing ? "Taranıyor..." : "Şimdi yenile"}
        </button>
      </div>

      {!items ? (
        <p className="text-slate-400">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-sm text-slate-400">
          Henüz haber bulunamadı. &quot;Şimdi yenile&quot; ile ilk taramayı
          başlatabilir veya{" "}
          <code className="text-slate-300">src/lib/sources/news.ts</code>{" "}
          içindeki RSS kaynaklarını kontrol edebilirsiniz.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-amber-500/50"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-slate-100">{item.title}</h3>
                <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {item.source}
                </span>
              </div>
              {item.summary && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {item.summary}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {item.published_at ?? item.fetched_at}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
