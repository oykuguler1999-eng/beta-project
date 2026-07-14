"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Competitor = {
  id: number;
  name: string;
  is_own_company: number;
  market_share_percent: number;
  annual_capacity_mva: number | null;
  hq_location: string | null;
  strengths: string | null;
  weaknesses: string | null;
  notable_projects: string | null;
  notes: string | null;
  updated_at: string;
};

const PALETTE = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399", "#fb7185", "#facc15"];

const EMPTY_FORM = {
  name: "",
  is_own_company: false,
  market_share_percent: "",
  annual_capacity_mva: "",
  hq_location: "",
  strengths: "",
  weaknesses: "",
  notable_projects: "",
  notes: "",
};

type FormState = typeof EMPTY_FORM;

function toFormState(c: Competitor): FormState {
  return {
    name: c.name,
    is_own_company: !!c.is_own_company,
    market_share_percent: String(c.market_share_percent ?? ""),
    annual_capacity_mva: c.annual_capacity_mva != null ? String(c.annual_capacity_mva) : "",
    hq_location: c.hq_location ?? "",
    strengths: c.strengths ?? "",
    weaknesses: c.weaknesses ?? "",
    notable_projects: c.notable_projects ?? "",
    notes: c.notes ?? "",
  };
}

function toPayload(form: FormState) {
  return {
    name: form.name,
    is_own_company: form.is_own_company,
    market_share_percent: form.market_share_percent === "" ? 0 : Number(form.market_share_percent),
    annual_capacity_mva: form.annual_capacity_mva === "" ? null : Number(form.annual_capacity_mva),
    hq_location: form.hq_location || null,
    strengths: form.strengths || null,
    weaknesses: form.weaknesses || null,
    notable_projects: form.notable_projects || null,
    notes: form.notes || null,
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-500";

function CompetitorForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: FormState;
  onSubmit: (form: FormState) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="Firma adı">
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </Field>
      <Field label="Merkez / Bölge">
        <input
          className={inputClass}
          value={form.hq_location}
          onChange={(e) => update("hq_location", e.target.value)}
        />
      </Field>
      <Field label="Pazar payı (%)">
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          className={inputClass}
          value={form.market_share_percent}
          onChange={(e) => update("market_share_percent", e.target.value)}
        />
      </Field>
      <Field label="Yıllık kapasite (MVA)">
        <input
          type="number"
          step="1"
          min="0"
          className={inputClass}
          value={form.annual_capacity_mva}
          onChange={(e) => update("annual_capacity_mva", e.target.value)}
        />
      </Field>
      <Field label="Güçlü yönleri">
        <textarea
          className={inputClass}
          rows={2}
          value={form.strengths}
          onChange={(e) => update("strengths", e.target.value)}
        />
      </Field>
      <Field label="Zayıf yönleri">
        <textarea
          className={inputClass}
          rows={2}
          value={form.weaknesses}
          onChange={(e) => update("weaknesses", e.target.value)}
        />
      </Field>
      <Field label="Öne çıkan projeler / ihaleler">
        <textarea
          className={inputClass}
          rows={2}
          value={form.notable_projects}
          onChange={(e) => update("notable_projects", e.target.value)}
        />
      </Field>
      <Field label="Notlar">
        <textarea
          className={inputClass}
          rows={2}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </Field>

      <div className="flex items-center gap-2 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.is_own_company}
            onChange={(e) => update("is_own_company", e.target.checked)}
          />
          Bu satır Beta Enerji (biz)
        </label>
      </div>

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}

export function CompetitorsBoard() {
  const [competitors, setCompetitors] = useState<Competitor[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function refresh() {
    const res = await fetch("/api/competitors");
    const data = await res.json();
    setCompetitors(data);
  }

  useEffect(() => {
    let ignore = false;
    async function load() {
      const res = await fetch("/api/competitors");
      const data = await res.json();
      if (!ignore) setCompetitors(data);
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const chartData = useMemo(
    () =>
      (competitors ?? []).map((c) => ({
        name: c.name,
        pay: c.market_share_percent,
        kapasite: c.annual_capacity_mva ?? 0,
      })),
    [competitors]
  );

  async function handleCreate(form: FormState) {
    await fetch("/api/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form)),
    });
    setShowAddForm(false);
    await refresh();
  }

  async function handleUpdate(id: number, form: FormState) {
    await fetch(`/api/competitors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form)),
    });
    setEditingId(null);
    await refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu firmayı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/competitors/${id}`, { method: "DELETE" });
    await refresh();
  }

  if (!competitors) {
    return <p className="text-slate-400">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <h3 className="mb-3 text-sm font-medium text-slate-300">
            Pazar Payı Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="pay"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry: { name?: string; pay?: number }) =>
                  `${entry.name}: %${entry.pay}`
                }
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <h3 className="mb-3 text-sm font-medium text-slate-300">
            Yıllık Kapasite Karşılaştırması (MVA)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
              />
              <Legend />
              <Bar dataKey="kapasite" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        {competitors.map((c) =>
          editingId === c.id ? (
            <div
              key={c.id}
              className="rounded-xl border border-amber-500/40 bg-slate-950 p-5"
            >
              <CompetitorForm
                initial={toFormState(c)}
                submitLabel="Güncelle"
                onCancel={() => setEditingId(null)}
                onSubmit={(form) => handleUpdate(c.id, form)}
              />
            </div>
          ) : (
            <div
              key={c.id}
              className={`rounded-xl border p-5 ${
                c.is_own_company
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-slate-800 bg-slate-950"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-100">{c.name}</h3>
                    {!!c.is_own_company && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                        Biz
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {c.hq_location ?? "Bölge belirtilmemiş"} · Son güncelleme:{" "}
                    {c.updated_at}
                  </p>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-slate-500">Pazar payı</p>
                    <p className="text-lg font-semibold text-slate-100">
                      %{c.market_share_percent}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Kapasite</p>
                    <p className="text-lg font-semibold text-slate-100">
                      {c.annual_capacity_mva ?? "—"} MVA
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {c.strengths && (
                  <div>
                    <p className="text-xs font-medium text-emerald-400">Güçlü yönler</p>
                    <p className="text-slate-300">{c.strengths}</p>
                  </div>
                )}
                {c.weaknesses && (
                  <div>
                    <p className="text-xs font-medium text-rose-400">Zayıf yönler</p>
                    <p className="text-slate-300">{c.weaknesses}</p>
                  </div>
                )}
                {c.notable_projects && (
                  <div>
                    <p className="text-xs font-medium text-sky-400">
                      Öne çıkan projeler / ihaleler
                    </p>
                    <p className="text-slate-300">{c.notable_projects}</p>
                  </div>
                )}
                {c.notes && (
                  <div>
                    <p className="text-xs font-medium text-slate-500">Notlar</p>
                    <p className="text-slate-300">{c.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-900"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  Sil
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-700 p-5">
        {showAddForm ? (
          <CompetitorForm
            initial={EMPTY_FORM}
            submitLabel="Firma ekle"
            onCancel={() => setShowAddForm(false)}
            onSubmit={handleCreate}
          />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            + Yeni firma ekle
          </button>
        )}
      </div>
    </div>
  );
}
