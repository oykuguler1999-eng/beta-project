// Trafo/enerji sektörü haberlerini taramak için RSS kaynakları.
// Buradaki listeyi kendi güvendiğiniz kaynaklarla değiştirebilir/genişletebilirsiniz.
// Bu ortamdan dış siteye erişim engellendiği için bu URL'ler test edilemedi;
// kendi bilgisayarınızda çalıştırınca 404/hatalı feed varsa listeyi güncelleyin.
export const NEWS_FEEDS: { name: string; url: string }[] = [
  { name: "Enerji Günlüğü", url: "https://www.enerjigunlugu.net/rss" },
  { name: "Dünya - Enerji", url: "https://www.dunya.com/rss?sectionId=118" },
  { name: "Enerji Portalı", url: "https://www.enerjiportali.com/feed/" },
];

// Bir haberin listeye alınması için başlık/özetinde geçmesi gereken
// anahtar kelimeler (küçük/büyük harf duyarsız).
export const NEWS_KEYWORDS: string[] = [
  "trafo",
  "transformatör",
  "şebeke",
  "dağıtım",
  "enerji nakil",
  "TEİAŞ",
  "elektrik dağıtım",
];
