import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import codes from "@/mizan/law/codes.json" with { type: "json" };
import { parseImport } from "@/mizan/engine/import-check";
import { textOf } from "@/mizan/engine/read-file";
import { tx } from "@/lib/copy";
import { usePrefs } from "@/lib/prefs";
import { useGuide } from "@/mizan/store";
import { useReady } from "@/mizan/use-ready";
import type { L } from "@/mizan/schema";

export const Route = createFileRoute("/law")({ component: LawPage });

function LawPage() {
  const lang = usePrefs((s) => s.lang);
  const ready = useReady();
  const articles = useGuide((s) => s.articles);
  const readings = useGuide((s) => s.readings);
  const addArticles = useGuide((s) => s.addArticles);
  const addReading = useGuide((s) => s.addReading);
  const offices = useGuide((s) => s.offices.length);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<L | null>(null);
  const [busy, setBusy] = useState(false);

  function run(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseImport(raw);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    addArticles(parsed.articles);
    setRaw("");
  }

  async function onPdf(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const text = (await textOf(file)).trim();
      if (text.length < 40) {
        setError({
          ar: "هذا الملف بلا طبقة حروف. صوّر الورقة من القضية إن كانت شهادتك، أو انسخ النص من الجريدة.",
          fr: "Ce fichier n'a pas de couche de texte. Photographiez votre pièce dans le dossier, ou copiez le Journal.",
        });
        return;
      }
      addReading({ id: crypto.randomUUID(), filename: file.name, excerpt: text.slice(0, 1500), chars: text.length });
    } catch {
      setError({
        ar: "تعذّرت قراءة الملف.",
        fr: "Lecture du fichier impossible.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-xs text-seal">{lang === "ar" ? "المهمة ٢ من ٣" : "Mission 2 sur 3"}</p>
      <h1 className="mt-1 font-display text-4xl text-green">{lang === "ar" ? "ملفان مختلفان" : "Deux fichiers différents"}</h1>
      <div className="mt-4 space-y-3 text-sm leading-relaxed">
        <p className="rounded-lg border border-line bg-sheet p-3">
          <span className="font-medium">{lang === "ar" ? "ورقة قضيتك" : "La pièce de votre affaire"}</span>
          <span className="mt-1 block text-muted">
            {lang === "ar"
              ? "الحكم، الشهادة، الشيك، المحضر. تُقرأ في «قضيتي» وتُحفظ ذاكرة للواقعة. لا تصير مادة قانون."
              : "Jugement, acte, chèque, procès-verbal. Ils se lisent dans « Dossier » et deviennent la mémoire des faits. Pas un article."}
          </span>
          <Link to="/case" className="mt-2 inline-block text-green">
            {lang === "ar" ? "إلى القضية" : "Vers le dossier"}
          </Link>
        </p>
        <p className="rounded-lg border border-line bg-sheet p-3">
          <span className="font-medium">{lang === "ar" ? "PDF القانون" : "Le PDF de la loi"}</span>
          <span className="mt-1 block text-muted">
            {lang === "ar"
              ? "الجريدة الرسمية أو مدونة نسختها. نعرض النص كما خرج من الملف. لا يُوسم «منشوراً» إلا بجدول فيه رابط الجريدة والتاريخ."
              : "Le Journal officiel ou un code que vous avez copié. Le texte s'affiche tel qu'il sort du fichier. Il n'est « publié » qu'avec un tableau, un lien du Journal et une date."}
          </span>
        </p>
      </div>

      <label className="mt-4 flex h-12 items-center justify-center rounded-md bg-green text-sm font-medium text-on-green">
        {busy ? (lang === "ar" ? "يقرأ…" : "Lecture…") : lang === "ar" ? "ارفع PDF القانون" : "Déposer le PDF de la loi"}
        <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => void onPdf(e.target.files?.[0])} />
      </label>
      {error && <p className="mt-2 text-sm text-seal">{tx(lang, error)}</p>}

      <ul className="mt-4 space-y-3">
        {readings.map((reading) => (
          <li key={reading.id} className="rounded-lg border border-line bg-sheet p-3">
            <p className="text-xs text-seal">{lang === "ar" ? "من ملفك · غير مربوط بالجريدة" : "Votre fichier · non relié au Journal"}</p>
            <p className="mt-1 text-sm font-medium">{reading.filename}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{reading.excerpt}</p>
          </li>
        ))}
      </ul>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium">{lang === "ar" ? "جدول JSON للجريدة فقط" : "Tableau JSON, Journal seulement"}</summary>
        <form onSubmit={run} className="mt-3">
          <textarea
            id="inbox"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder={'[{ "code": "", "number": "", "arabic_text": "", "source_url": "https://www.joradp.dz/...", "publication_date": "YYYY-MM-DD" }]'}
            className="w-full rounded-lg border border-line bg-sheet p-3 font-mono text-xs leading-relaxed"
          />
          <button type="submit" disabled={!raw.trim()} className="mt-3 h-12 w-full rounded-md border border-line text-sm disabled:opacity-40">
            {lang === "ar" ? "تحقق واستورد كمنشور" : "Vérifier et importer comme publié"}
          </button>
        </form>
      </details>

      <p className="mt-6 text-sm text-muted">
        {ready ? (lang === "ar" ? `${articles.length} مادة مربوطة بالجريدة` : `${articles.length} article(s) relié(s) au Journal`) : "…"}
      </p>
      <ul className="mt-2 space-y-3">
        {articles.map((a) => (
          <li key={`${a.code}-${a.number}`} className="rounded-lg border border-line bg-sheet p-3">
            <p className="text-xs text-green">
              {a.code} · {a.number} · {a.publication_date}
            </p>
            <p className="mt-2 font-display text-lg leading-relaxed">{a.arabic_text}</p>
            {a.french_working_translation && <p className="mt-2 text-sm text-muted">{a.french_working_translation}</p>}
            {a.source_url && (
              <a href={a.source_url} className="mt-2 block text-sm text-green underline" target="_blank" rel="noreferrer">
                {a.source_url}
              </a>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-sm font-medium">{lang === "ar" ? "القوانين، بلا مواد بعد" : "Codes, encore sans articles"}</h2>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {codes.map((code) => (
          <li key={code.id} className="py-3 text-sm">
            {lang === "ar" ? code.title.ar : code.title.fr}
          </li>
        ))}
      </ul>
      {articles.length > 0 && offices === 0 && (
        <Link to="/lawyers" className="mt-6 block rounded-lg bg-green-soft p-4 text-green">
          {lang === "ar" ? "بعدها: أضف مكتباً" : "Ensuite : ajouter un cabinet"}
        </Link>
      )}
    </div>
  );
}
