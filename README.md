# Beta Enerji — Pazar İstihbaratı Paneli

Beta Enerji iş geliştirme ekibi için trafo sektörüne yönelik rekabet
istihbaratı ve pazar araştırması panosu. Next.js (App Router) + TypeScript +
Tailwind CSS ile geliştirilmiştir; veriler yerel bir SQLite dosyasında
(`data/app.db`) tutulur.

## Modüller

- **Rakip Analizi & Pazar Payı** (aktif): Rakip firmaların tahmini pazar
  payı, yıllık kapasite, güçlü/zayıf yönleri ve öne çıkan projeleri —
  ekip tarafından düzenlenebilir, grafiklerle görselleştirilir. Bu veriler
  kamuya açık bir API'den otomatik çekilemez; pazar payı gibi bilgiler
  genelde şirketin kendi tahminine dayanır.
- **İhaleler**, **Trade Data & Comext**, **Haberler & Teknoloji**: İskeleti
  hazır, henüz bir veri kaynağına bağlanmadı. Her sayfada o modül için
  değerlendirilen gerçek veri kaynakları ve kısıtları listelenir (EKAP ilan
  bülteni, Eurostat Comext API, sektör RSS beslemeleri gibi).

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
- `data/app.db` sürüm kontrolüne dahil değildir; her ortamda `npm run seed`
  ile örnek veya gerçek verilerle yeniden oluşturulmalıdır.
