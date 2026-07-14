"use client";

import { useEffect, useState } from "react";

type Tender = {
  id: number;
  title: string;
  institution: string | null;
  status: "acik" | "kazanildi" | "kaybedildi";
  amount: number | null;
  currency: string | null;
  deadline_date: string | null;
  notes: string | null;
  updated_at: string;
};

const STATUS_LABELS: Record<Tender["status"], string> = {
  acik: "Açık",
  kazanildi: "Kazanıldı",
  kaybedildi: "Kaybedildi",
};

const STATUS_STYLES: Record<Tender["status"], string> = {
  acik: "bg-sky-500/10 text-sky-400",
  kazanildi: "bg-emerald-500/10 text-emerald-400",
  kaybedildi: "bg-rose-500/10 text-rose-400",
};

const EMPTY_FORM = {
  title: "",
  institution: "",
  status: "acik" as Tender["status"],
  amount: "",
  currency: "TRY",
  deadline_date: "",
  notes: "",
};

type FormState = typeof EMPTY_FORM;

function toFormState(t: Tender): FormState {
  return {
    title: t.title,
    institution: t.institution ?? "",
    status: t.status,
    amount: t.amount != null ? String(t.amount) : "",
    currency: t.currency ?? "TRY",
    deadline_date: t.deadline_date ?? "",
    notes: t.notes ?? "",
  };
}

function toPayload(form: FormState) {
  return {
    title: form.title,
    institution: form.institution || null,
    status: form.status,
    amount: form.amount === "" ? null : Number(form.amount),
    currency: form.currency || "TRY",
    deadline_date: form.deadline_date || null,
    notes: form.notes || null,
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function TenderForm({
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
    if (!form.title.trim()) return;
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="İhale başlığı">
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </Field>
      <Field label="Kurum">
        <input
          className={inputClass}
          value={form.institution}
          onChange={(e) => update("institution", e.target.value)}
        />
      </Field>
      <Field label="Durum">
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => update("status", e.target.value as Tender["status"])}
        >
          <option value="acik">Açık</option>
          <option value="kazanildi">Kazanıldı</option>
          <option value="kaybedildi">Kaybedildi</option>
        </select>
      </Field>
      <Field label="Son teklif / sonuç tarihi">
        <input
          type="date"
          className={inputClass}
          value={form.deadline_date}
          onChange={(e) => update("deadline_date", e.target.value)}
        />
      </Field>
      <Field label="Tutar">
        <input
          type="number"
          step="0.01"
          min="0"
          className={inputClass}
          value={form.amount}
          onChange={(e) => update("amount", e.target.value)}
        />
      </Field>
      <Field label="Para birimi">
        <input
          className={inputClass}
          value={form.currency}
          onChange={(e) => update("currency", e.target.value)}
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

export function TendersBoard() {
  const [tenders, setTenders] = useState<Tender[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  async function refresh() {
    const res = await fetch("/api/tenders");
    const data = await res.json();
    setTenders(data);
  }

  useEffect(() => {
    let ignore = false;
    async function load() {
      const res = await fetch("/api/tenders");
      const data = await res.json();
      if (!ignore) setTenders(data);
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(form: FormState) {
    await fetch("/api/tenders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form)),
    });
    setShowAddForm(false);
    await refresh();
  }

  async function handleUpdate(id: number, form: FormState) {
    await fetch(`/api/tenders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form)),
    });
    setEditingId(null);
    await refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu ihaleyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/tenders/${id}`, { method: "DELETE" });
    await refresh();
  }

  if (!tenders) {
    return <p className="text-slate-400">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-4">
      {tenders.length === 0 && !showAddForm && (
        <p className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-sm text-slate-400">
          Henüz ihale eklenmedi. Aşağıdan ilk ihaleyi ekleyin.
        </p>
      )}

      {tenders.map((t) =>
        editingId === t.id ? (
          <div key={t.id} className="rounded-xl border border-amber-500/40 bg-slate-950 p-5">
            <TenderForm
              initial={toFormState(t)}
              submitLabel="Güncelle"
              onCancel={() => setEditingId(null)}
              onSubmit={(form) => handleUpdate(t.id, form)}
            />
          </div>
        ) : (
          <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-100">{t.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[t.status]}`}>
                    {STATUS_LABELS[t.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t.institution ?? "Kurum belirtilmemiş"}
                  {t.deadline_date ? ` · ${t.deadline_date}` : ""}
                </p>
              </div>
              {t.amount != null && (
                <div className="text-right">
                  <p className="text-xs text-slate-500">Tutar</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {t.amount.toLocaleString("tr-TR")} {t.currency}
                  </p>
                </div>
              )}
            </div>

            {t.notes && <p className="mt-3 text-sm text-slate-300">{t.notes}</p>}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingId(t.id)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-900"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
              >
                Sil
              </button>
            </div>
          </div>
        )
      )}

      <div className="rounded-xl border border-dashed border-slate-700 p-5">
        {showAddForm ? (
          <TenderForm
            initial={EMPTY_FORM}
            submitLabel="İhale ekle"
            onCancel={() => setShowAddForm(false)}
            onSubmit={handleCreate}
          />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm font-medium text-amber-400 hover:text-amber-300"
          >
            + Yeni ihale ekle
          </button>
        )}
      </div>
    </div>
  );
}
