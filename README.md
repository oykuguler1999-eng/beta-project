# Beta Enerji — Pazar İstihbaratı Paneli

Beta Enerji iş geliştirme ekibi için trafo sektörüne yönelik rekabet
istihbaratı ve pazar araştırması panosu. Next.js (App Router) + TypeScript +
Tailwind CSS ile geliştirilmiştir. Veriler libSQL (SQLite uyumlu) ile
tutulur: `TURSO_DATABASE_URL` tanımlı değilse yerel bir dosyada
(`data/app.db`), tanımlıysa bulutta ([Turso](https://turso.tech)) saklanır.

## Modüller

- **Rakip Analizi & Pazar Payı**: Rakip firmaların tahmini pazar payı,
  yıllık kapasite, güçlü/zayıf yönleri ve öne çıkan projeleri — ekip
  tarafından düzenlenebilir, grafiklerle görselleştirilir. Bu veriler
  kamuya açık bir API'den otomatik çekilemez; pazar payı gibi bilgiler
  genelde şirketin kendi tahminine dayanır.
- **İhaleler**: EKAP'ın otomatik taranabilecek herkese açık bir API'si
  olmadığı için ekibin ihaleleri elle ekleyip durumunu (açık / kazanıldı /
  kaybedildi) güncellediği bir takip listesi.
- **Trade Data & Comext**: Eurostat Comext'ten AB–Türkiye elektrik
  transformatörü (CN 8504) ithalat/ihracat verilerini otomatik çeker.
  Uygulama açık olduğu sürece her gün 07:00'de otomatik yenilenir, "Şimdi
  yenile" ile de anında tetiklenebilir. Sorgu parametreleri
  `src/lib/sources/tradeData.ts` içinde.
- **Haberler & Teknoloji**: RSS kaynaklarından anahtar kelimeyle
  (trafo, şebeke, dağıtım vb.) eşleşen haberleri otomatik toplar, aynı
  günlük zamanlamayla çalışır. Kaynak listesi `src/lib/sources/news.ts`
  içinde.

Otomatik çekim işleri (`src/lib/scheduler.ts`), uygulama sunucusu ayakta
olduğu sürece Next.js'in `instrumentation.ts` mekanizmasıyla çalışır —
yani `npm run dev` veya `npm run start` açık kaldığı sürece her gün
kendiliğinden tetiklenir. Bilgisayar/uygulama kapalıyken bir şey
çekilmez; bir sonraki açılışta eksik günü de tamamlamak için açılışta bir
kez daha otomatik çalışır.

## Kurulum

```bash
npm install
cp .env.example .env.local   # APP_PASSWORD ve SESSION_SECRET değerlerini ayarlayın
npm run seed                 # örnek rakip verisiyle veritabanını oluşturur
npm run dev
```

`http://localhost:3000` adresinde `.env.local` içindeki `APP_PASSWORD` ile
giriş yapabilirsiniz.

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` / `npm run start` — üretim derlemesi ve çalıştırma
- `npm run lint` — ESLint
- `npm run seed` — örnek rakip verisini veritabanına ekler (tablo boşsa)

## Notlar

- Giriş ekranı, şirket içi kullanım için tek bir paylaşılan şifreye
  dayanan basit bir oturum korumasıdır (`src/lib/auth.ts`,
  `src/proxy.ts`). Kişiye özel hesap/yetkilendirme gerekirse bu katman
  genişletilmelidir.
- Otomatik veri çekme kodu (Comext ve RSS) bu geliştirme ortamının ağ
  politikası dış sitelere erişimi engellediği için canlı test
  edilemedi. Kendi bilgisayarınızda ilk çalıştırmada `/haberler` ve
  `/trade-data` sayfalarındaki durum mesajlarını kontrol edin; hata
  görürseniz ilgili `src/lib/sources/*.ts` dosyasındaki kaynak
  URL'lerini veya sorgu parametrelerini güncelleyin.
- `data/app.db` sürüm kontrolüne dahil değildir; her ortamda `npm run seed`
  ile örnek veya gerçek verilerle yeniden oluşturulmalıdır.
