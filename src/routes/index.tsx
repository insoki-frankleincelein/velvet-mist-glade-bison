import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import catalog from "@/mizan/paths/catalog.json" with { type: "json" };
import { suggest } from "@/mizan/engine/next";
import { activeCase, useGuide } from "@/mizan/store";
import { tx } from "@/lib/copy";
import { usePrefs } from "@/lib/prefs";
import { useReady } from "@/mizan/use-ready";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const lang = usePrefs((s) => s.lang);
  const wilayaId = usePrefs((s) => s.wilayaId);
  const ready = useReady();
  const active = useGuide((s) => activeCase(s.cases, s.activeId));
  const articles = useGuide((s) => s.articles.length);
  const offices = useGuide((s) => s.offices.length);
  const startCase = useGuide((s) => s.startCase);
  const navigate = useNavigate();
  const [story, setStory] = useState("");
  const [filter, setFilter] = useState("");
  const next = suggest(ready ? active : null, articles, offices);
  const q = filter.trim();
  const tiles = catalog.filter((row) => {
    if (!q) return row.id !== "open-file";
    const blob = `${row.title.ar} ${row.title.fr} ${row.note.ar}`.toLowerCase();
    return blob.includes(q.toLowerCase());
  });

  function begin(e: React.FormEvent) {
    e.preventDefault();
    if (!story.trim()) return;
    startCase(story, wilayaId);
    setStory("");
    void navigate({ to: "/case" });
  }

  return (
    <div>
      <p className="text-xs tracking-wide text-seal">{tx(lang, next.kicker)}</p>
      <Link to={next.to} className="mt-2 block rounded-lg border border-line bg-sheet p-4">
        <span className="block font-display text-3xl leading-tight text-green">{tx(lang, next.title)}</span>
        <span className="mt-2 block text-sm leading-relaxed text-muted">{tx(lang, next.detail)}</span>
        <span className="mt-3 inline-block text-sm font-medium text-green">{lang === "ar" ? "افتح هذه المهمة" : "Ouvrir cette mission"}</span>
      </Link>

      <ol className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Track n="1" on={next.to === "/case"} label={lang === "ar" ? "القضية" : "Dossier"} />
        <Track n="2" on={next.to === "/law"} label={lang === "ar" ? "النص" : "Texte"} />
        <Track n="3" on={next.to === "/lawyers"} label={lang === "ar" ? "المكتب" : "Cabinet"} />
      </ol>

      <form onSubmit={begin} className="mt-6">
        <label htmlFor="story" className="text-sm font-medium">
          {lang === "ar" ? "احكِ ما وقع" : "Racontez ce qui s'est passé"}
        </label>
        <textarea
          id="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          placeholder={lang === "ar" ? "عربي، دارجة، فرنسية، أو خليط" : "Arabe, darja, français, ou mélange"}
          className="mt-2 w-full rounded-lg border border-line bg-sheet p-3 text-base leading-relaxed"
        />
        <button type="submit" disabled={!story.trim()} className="mt-2 h-12 w-full rounded-md bg-green text-base font-medium text-on-green disabled:opacity-40">
          {active
            ? lang === "ar"
              ? "هذه قصة أخرى"
              : "Ceci est un autre récit"
            : lang === "ar"
              ? "ابدأ السؤال الأول"
              : "Commencer par la première question"}
        </button>
      </form>

      <label htmlFor="paths" className="mt-8 block text-sm text-muted">
        {lang === "ar" ? "أو اختر بطاقة. البطاقات عناوين حتى يُستورد النص." : "Ou choisissez une carte. Ce sont des titres tant que le texte n'est pas importé."}
      </label>
      <input
        id="paths"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={lang === "ar" ? "ابحث في البطاقات" : "Filtrer les cartes"}
        className="mt-2 h-11 w-full rounded-md border border-line bg-sheet px-3"
      />
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {tiles.map((row) => (
          <li key={row.id}>
            <Link
              to="/case"
              onClick={() => useGuide.getState().arm(row.id)}
              className="flex min-h-20 flex-col justify-between rounded-lg border border-line bg-sheet p-3"
            >
              <span className="font-medium leading-snug">{lang === "ar" ? row.title.ar : row.title.fr}</span>
              <span className="mt-2 text-xs text-seal">{row.status === "TO_VERIFY" ? (lang === "ar" ? "قيد التحقق" : "À vérifier") : lang === "ar" ? "عنوان فقط" : "Titre seul"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Track({ n, on, label }: { n: string; on: boolean; label: string }) {
  return (
    <li className={`rounded-md border px-2 py-2 ${on ? "border-green bg-green-soft text-green" : "border-line text-muted"}`}>
      <span className="block font-display text-lg leading-none">{n}</span>
      {label}
    </li>
  );
}
