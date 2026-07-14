import { ComingSoon } from "@/components/ComingSoon";

export default function HaberlerPage() {
  return (
    <ComingSoon
      title="Haberler & Teknoloji"
      intro="Trafo sektörü, enerji piyasası ve yeni teknolojilere dair güncel haberlerin toplandığı akış."
      dataSourceNotes={[
        {
          label: "Sektör haber siteleri (RSS)",
          detail:
            "Enerji/elektrik sektörü haber sitelerinin RSS beslemeleri toplanarak anahtar kelime filtresiyle (trafo, şebeke, dijital trafo, IEC/IEEE standartları vb.) tek akışta gösterilebilir.",
        },
        {
          label: "Google News / haber arama",
          detail:
            "Belirli anahtar kelimelerle haber araması yapıp sonuçları periyodik olarak listeye eklemek mümkündür; hangi kaynakların güvenilir/öncelikli sayılacağı ekiple netleştirilmeli.",
        },
        {
          label: "Teknoloji & standart güncellemeleri",
          detail:
            "IEC/IEEE gibi standart kuruluşlarının duyuruları veya büyük trafo üreticilerinin basın bültenleri ayrı bir kaynak olarak eklenebilir.",
        },
      ]}
    />
  );
}
