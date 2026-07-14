import { TradeDataBoard } from "@/components/TradeDataBoard";

export default function TradeDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          Trade Data & Comext
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Eurostat Comext üzerinden AB&apos;nin Türkiye ile elektrik
          transformatörü (CN 8504) ithalat/ihracat verileri otomatik çekilir.
          Ticaret verileri kurumlar tarafından günlük değil aylık
          yayımlandığı için &quot;güncel&quot; burada en son yayımlanan dönem
          anlamına gelir. Sorgu parametreleri (rapor eden/partner ülke, ürün
          kodu) <code className="text-slate-300">src/lib/sources/tradeData.ts</code>{" "}
          dosyasında düzenlenebilir.
        </p>
      </div>
      <TradeDataBoard />
    </div>
  );
}
