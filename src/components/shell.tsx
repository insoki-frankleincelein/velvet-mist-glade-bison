import { Link, useRouterState } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";
import { tx, ui } from "@/lib/copy";
import { wilayas } from "@/data/wilayas";
import { Boot } from "./boot";

const tabs = [
  { to: "/", ar: "البداية", fr: "Accueil" },
  { to: "/case", ar: "قضيتي", fr: "Dossier" },
  { to: "/law", ar: "القانون", fr: "Loi" },
  { to: "/lawyers", ar: "محامٍ", fr: "Avocat" },
  { to: "/me", ar: "أنا", fr: "Moi" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const lang = usePrefs((s) => s.lang);
  const wilayaId = usePrefs((s) => s.wilayaId);
  const setLang = usePrefs((s) => s.setLang);
  const setWilaya = usePrefs((s) => s.setWilaya);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const t = ui[lang];

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <Boot />
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <Link to="/" className="font-display text-3xl leading-none text-green">
            {lang === "ar" ? "ميزان" : "Mizan"}
          </Link>
          <label className="sr-only" htmlFor="wilaya">
            {t.wilaya}
          </label>
          <select
            id="wilaya"
            value={wilayaId}
            onChange={(e) => setWilaya(e.target.value)}
            className="ms-auto h-11 max-w-36 rounded-md border border-line bg-sheet px-2 text-sm"
          >
            <option value="">{t.wilayaPick}</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} · {tx(lang, w.name)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
            className="h-11 rounded-md border border-line bg-sheet px-3 text-sm font-medium text-green"
          >
            {t.lang}
          </button>
        </div>
        <p className="px-4 pb-2 text-center text-xs leading-relaxed text-muted">{t.foot}</p>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 pt-5 pb-28">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-sheet">
        <div className="mx-auto flex max-w-lg">
          {tabs.map((tab) => {
            const on = tab.to === "/" ? path === "/" : path.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex h-16 flex-1 items-center justify-center text-xs font-medium ${on ? "text-green" : "text-muted"}`}
              >
                {lang === "ar" ? tab.ar : tab.fr}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
