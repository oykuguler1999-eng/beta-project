import { ComingSoon } from "@/components/ComingSoon";

export default function IhalelerPage() {
  return (
    <ComingSoon
      title="İhaleler"
      intro="Trafo ile ilgili güncel ve sonuçlanmış (kazanılan/kaybedilen) ihalelerin tek yerden takip edildiği modül."
      dataSourceNotes={[
        {
          label: "EKAP (Elektronik Kamu Alımları Platformu) — açık ihale ilanları",
          detail:
            "Kamu İhale Kurumu'nun ilan bülteninde yayımlanan ihaleler herkese açıktır; anahtar kelime ile (trafo, güç trafosu, dağıtım trafosu vb.) günlük taranıp listeye eklenebilir. Detaylı ihale evrakı ve teklif bilgileri için EKAP'a kurumsal giriş gerekir.",
        },
        {
          label: "İhale sonuç ilanları",
          detail:
            "Kazanılan/kaybedilen ihale sonuçları Kamu İhale Bülteni'nde ayrıca yayımlanır; bunlar da halka açık kaynaklardan periyodik olarak çekilip geçmiş performans tablosuna işlenebilir.",
        },
        {
          label: "Özel sektör / yurt dışı ihaleleri",
          detail:
            "TEDAŞ, dağıtım şirketleri veya yurt dışı ihaleleri için tekil kaynaklar farklıdır; hangi kurumların takip edileceği netleşince kaynak listesi genişletilebilir.",
        },
      ]}
    />
  );
}
