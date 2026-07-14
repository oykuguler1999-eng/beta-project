"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Özet", icon: "🏠" },
  { href: "/rakip-analizi", label: "Rakip Analizi & Pazar Payı", icon: "📊" },
  { href: "/ihaleler", label: "İhaleler", icon: "📄" },
  { href: "/trade-data", label: "Trade Data & Comext", icon: "🌍" },
  { href: "/haberler", label: "Haberler & Teknoloji", icon: "📰" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-amber-400">
          BE
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Beta Enerji</p>
          <p className="text-xs text-slate-500">Pazar İstihbaratı</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-amber-500/10 text-amber-400 font-medium"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-slate-200"
        >
          Çıkış yap
        </button>
      </div>
    </aside>
  );
}
