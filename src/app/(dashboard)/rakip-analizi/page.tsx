import { CompetitorsBoard } from "@/components/CompetitorsBoard";

export default function RakipAnaliziPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          Rakip Analizi & Pazar Payı
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Pazar payı ve kapasite verileri kamuya açık bir API üzerinden
          otomatik çekilmez — bu bilgiler genelde şirketlerin kendi tahminine
          dayanır. Bu modül, ekibinizin bildiği güncel bilgiyi kolayca
          girip/güncelleyip görselleştirebileceği bir çalışma alanıdır. İhaleler
          ve dış ticaret verileri modülleri devreye girdikçe buradaki pazar
          payı tahminlerini o verilerle çapraz kontrol edebilirsiniz.
        </p>
      </div>
      <CompetitorsBoard />
    </div>
  );
}
