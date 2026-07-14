import { NewsBoard } from "@/components/NewsBoard";

export default function HaberlerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          Haberler & Teknoloji
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Sektör RSS kaynakları her gün otomatik taranır, anahtar kelimeyle
          eşleşen haberler burada listelenir. Uygulama açık kaldığı sürece her
          gün saat 07:00&apos;de otomatik yenilenir; istediğiniz an &quot;Şimdi
          yenile&quot; ile de tarayabilirsiniz. Kaynak listesi ve anahtar
          kelimeler <code className="text-slate-300">src/lib/sources/news.ts</code>{" "}
          dosyasında düzenlenebilir.
        </p>
      </div>
      <NewsBoard />
    </div>
  );
}
