"use client";

import { useEffect, useState } from "react";

type FetchLogEntry = {
  id: number;
  job: string;
  status: "ok" | "error";
  message: string | null;
  ran_at: string;
};

export function RefreshStatus({ job, label }: { job: string; label: string }) {
  const [entry, setEntry] = useState<FetchLogEntry | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const res = await fetch("/api/fetch-log");
      const data: FetchLogEntry[] = await res.json();
      const match = data.find((e) => e.job === job) ?? null;
      if (!ignore) setEntry(match);
    }
    load();
    return () => {
      ignore = true;
    };
  }, [job]);

  if (!entry) {
    return (
      <p className="text-xs text-slate-500">{label}: henüz hiç çalışmadı.</p>
    );
  }

  return (
    <p className="text-xs text-slate-500">
      {label}: son çalışma {entry.ran_at} —{" "}
      <span className={entry.status === "ok" ? "text-emerald-400" : "text-rose-400"}>
        {entry.status === "ok" ? "başarılı" : "hata"}
      </span>
      {entry.message ? ` (${entry.message})` : ""}
    </p>
  );
}
