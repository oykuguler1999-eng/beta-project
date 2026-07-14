// Comext / Eurostat üzerinden çekilecek trafo (elektrik transformatörleri)
// dış ticaret verisi için varsayılan filtreler.
//
// ÖNEMLİ: Bu ortamda dış ağ erişimi engellendiği için bu sorgu parametreleri
// canlı test edilemedi. Eurostat'ın "Comext" veri tabanı çok büyük olduğu
// için standart REST uç noktasından her zaman aynı şekilde sorgulanamayabilir.
// Kendi bilgisayarınızda çalıştırıp hata alırsanız doğru sorgu parametrelerini
// Eurostat'ın "Easy Comext" sorgu aracından kontrol edin:
// https://ec.europa.eu/eurostat/comext/newxtweb/
export const COMEXT_DATASET = "DS-045409"; // EU trade since 1988 by CN8
export const COMEXT_REPORTER = "EU27_2020"; // AB27 toplamı
export const COMEXT_PARTNER = "TR"; // Türkiye
export const COMEXT_PRODUCT_CODES = ["8504"]; // Elektrik transformatörleri (CN/HS 8504)
export const COMEXT_FLOWS: { code: string; label: "ithalat" | "ihracat" }[] = [
  { code: "1", label: "ithalat" },
  { code: "2", label: "ihracat" },
];
