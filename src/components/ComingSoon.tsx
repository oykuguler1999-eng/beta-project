export function ComingSoon({
  title,
  intro,
  dataSourceNotes,
}: {
  title: string;
  intro: string;
  dataSourceNotes: { label: string; detail: string }[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">{intro}</p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6">
        <p className="text-sm font-medium text-amber-400">
          Bu modül henüz bir veri kaynağına bağlanmadı
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Aşağıda bu modülü gerçek veriyle beslemek için değerlendirdiğimiz
          kaynaklar ve her birinin getirdiği kısıtlar listeleniyor. Hangi
          kaynakla başlamak istediğinize karar verince entegrasyonu birlikte
          kurabiliriz.
        </p>
        <div className="mt-4 space-y-3">
          {dataSourceNotes.map((note) => (
            <div
              key={note.label}
              className="rounded-lg border border-slate-800 bg-slate-900 p-3"
            >
              <p className="text-sm font-medium text-slate-200">{note.label}</p>
              <p className="mt-1 text-sm text-slate-400">{note.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
