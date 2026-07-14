import { TendersBoard } from "@/components/TendersBoard";

export default function IhalelerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">İhaleler</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          EKAP&apos;ın (Elektronik Kamu Alımları Platformu) genel ilan
          bülteni otomatik taranabilecek basit bir herkese açık API
          sunmuyor — sağlıklı bir otomatik entegrasyon için EKAP&apos;a
          kurumsal erişiminiz olup olmadığının netleşmesi gerekiyor. O yüzden
          bu modül şimdilik ekibin ihaleleri elle ekleyip durumunu (açık /
          kazanıldı / kaybedildi) güncellediği bir takip listesi olarak
          çalışıyor.
        </p>
      </div>
      <TendersBoard />
    </div>
  );
}
