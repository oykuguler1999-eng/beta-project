import cron from "node-cron";
import { fetchNews } from "@/lib/fetchers/news";
import { fetchTradeData } from "@/lib/fetchers/tradeData";

declare global {
  var __betaSchedulerStarted: boolean | undefined;
}

async function runAll() {
  await Promise.allSettled([fetchNews(), fetchTradeData()]);
}

export function startScheduler() {
  if (global.__betaSchedulerStarted) return;
  global.__betaSchedulerStarted = true;

  // Sunucu açılır açılmaz bir kere çalıştır (veri hiç çekilmemişse boş kalmasın).
  runAll();

  // Ardından her gün saat 07:00'de tekrar çalıştır.
  // Uygulama sürekli açık kalmıyorsa (bilgisayar kapanıyorsa) bu saatte
  // çalışması için uygulamanın o an açık olması gerekir.
  cron.schedule("0 7 * * *", runAll);
}
