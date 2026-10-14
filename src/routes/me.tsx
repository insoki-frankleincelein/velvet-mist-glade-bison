import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { glossary } from "@/mizan/glossary";
import { activeCase, useGuide } from "@/mizan/store";
import { usePrefs } from "@/lib/prefs";
import { useReady } from "@/mizan/use-ready";

export const Route = createFileRoute("/me")({ component: MePage });

function MePage() {
  const lang = usePrefs((s) => s.lang);
  const ready = useReady();
  const theme = useGuide((s) => s.theme);
  const setTheme = useGuide((s) => s.setTheme);
  const cases = useGuide((s) => s.cases);
  const activeId = useGuide((s) => s.activeId);
  const openCase = useGuide((s) => s.openCase);
  const articles = useGuide((s) => s.articles.length);
  const offices = useGuide((s) => s.offices.length);
  const wipe = useGuide((s) => s.wipe);
  const navigate = useNavigate();
  const [armed, setArmed] = useState(false);
  const current = activeCase(cases, activeId);
  const unsure = glossary.filter((g) => g.confidence === "unsure");

  return (
    <div>
      <h1 className="font-display text-4xl text-green">{lang === "ar" ? "أنا" : "Moi"}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {lang === "ar" ? "كل شيء على هذا الجهاز. لا حساب." : "Tout est sur cet appareil. Pas de compte."}
      </p>
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mt-5 h-12 w-full rounded-md border border-line bg-sheet"
      >
        {theme === "dark" ? (lang === "ar" ? "الوضع الفاتح" : "Mode clair") : lang === "ar" ? "الوضع الداكن" : "Mode sombre"}
      </button>
      <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
        <Count k={lang === "ar" ? "قضايا" : "Dossiers"} v={ready ? String(cases.length) : "…"} />
        <Count k={lang === "ar" ? "مواد" : "Articles"} v={ready ? String(articles) : "…"} />
        <Count k={lang === "ar" ? "مكاتب" : "Cabinets"} v={ready ? String(offices) : "…"} />
      </dl>
      <h2 className="mt-6 text-sm font-medium">{lang === "ar" ? "قصص محفوظة" : "Récits gardés"}</h2>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {cases.map((file) => (
          <li key={file.id}>
            <button
              type="button"
              onClick={() => {
                openCase(file.id);
                void navigate({ to: "/case" });
              }}
              className="w-full py-3 text-start text-sm"
            >
              <span className="block leading-relaxed">{file.story.slice(0, 80)}</span>
              <span className="text-xs text-muted">{file.id === current?.id ? (lang === "ar" ? "المفتوحة" : "Ouverte") : file.phase}</span>
            </button>
          </li>
        ))}
        {ready && cases.length === 0 && <li className="py-3 text-sm text-muted">{lang === "ar" ? "لا قصة بعد." : "Pas encore de récit."}</li>}
      </ul>
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium">{lang === "ar" ? "دارجة غير مؤكدة" : "Darja non confirmée"}</summary>
        <ul className="mt-2 space-y-2">
          {unsure.map((g) => (
            <li key={g.ar} className="text-sm leading-relaxed">
              <span className="font-medium">{g.ar}</span>
              <span className="text-muted"> · {g.fr}</span>
              {g.note && <span className="block text-xs text-muted">{g.note}</span>}
            </li>
          ))}
        </ul>
      </details>
      {!armed ? (
        <button type="button" onClick={() => setArmed(true)} className="mt-8 h-12 w-full rounded-md border border-line text-sm text-seal">
          {lang === "ar" ? "امسح ما على الجهاز" : "Effacer ce qui est sur l'appareil"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            wipe();
            setArmed(false);
          }}
          className="mt-8 h-12 w-full rounded-md bg-seal text-sm text-sheet"
        >
          {lang === "ar" ? "نعم، امسح القضايا والنصوص والمكاتب" : "Oui, effacer dossiers, textes et cabinets"}
        </button>
      )}
    </div>
  );
}

function Count({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-line bg-sheet px-2 py-3">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="font-display text-2xl text-green">{v}</dd>
    </div>
  );
}
