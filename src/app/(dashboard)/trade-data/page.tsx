import { ComingSoon } from "@/components/ComingSoon";

export default function TradeDataPage() {
  return (
    <ComingSoon
      title="Trade Data & Comext"
      intro="Trafo ve ilgili ürün gruplarına ait günlük/aylık dış ticaret (ithalat-ihracat) verilerinin izlendiği modül."
      dataSourceNotes={[
        {
          label: "Eurostat Comext",
          detail:
            "Eurostat'ın Comext veritabanı, AB ülkelerinin dış ticaret istatistiklerini ücretsiz bir REST API / bulk indirme servisi olarak sunar. İlgili CN/HS kodları (örn. 8504 — trafolar) belirlenip otomatik çekilebilir. Bu, gerçek ve genel API erişimi olan tek kaynak.",
        },
        {
          label: "TÜİK dış ticaret istatistikleri",
          detail:
            "Türkiye'nin ithalat/ihracat verileri için TÜİK'in yayımladığı istatistikler kullanılabilir; veri güncelleme sıklığı günlük değil aylıktır.",
        },
        {
          label: "Güncellik beklentisi",
          detail:
            "Gümrük/ticaret verileri kurumlar tarafından günlük değil, genelde aylık veya üç aylık yayımlanır; 'her dakika güncel' beklentisi bu veri türü için gerçekçi değildir — panelde en güncel yayımlanan dönem gösterilecektir.",
        },
      ]}
    />
  );
}
