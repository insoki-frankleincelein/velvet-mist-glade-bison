import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { wilayas } from "@/data/wilayas";
import { tx } from "@/lib/copy";
import { usePrefs } from "@/lib/prefs";
import { place } from "@/mizan/engine/place";
import { talk } from "@/mizan/engine/talk";
import { suggest } from "@/mizan/engine/next";
import { examples } from "@/mizan/examples";
import { officialNotes, stillNeeded } from "@/mizan/papers";
import type { SavedPaper } from "@/mizan/papers";
import { activeCase, useGuide } from "@/mizan/store";
import { useReady } from "@/mizan/use-ready";
import type { Cost, L, Step } from "@/mizan/schema";
import catalog from "@/mizan/paths/catalog.json" with { type: "json" };
import { Mic, speak } from "@/components/voice";
import { PaperBox } from "@/components/paper-box";

export const Route = createFileRoute("/case")({ component: CasePage });

function CasePage() {
  const lang = usePrefs((s) => s.lang);
  const wilayaId = usePrefs((s) => s.wilayaId);
  const ready = useReady();
  const file = useGuide((s) => activeCase(s.cases, s.activeId));
  const articles = useGuide((s) => s.articles.length);
  const offices = useGuide((s) => s.offices.length);
  const startCase = useGuide((s) => s.startCase);
  const acceptReview = useGuide((s) => s.acceptReview);
  const rewrite = useGuide((s) => s.rewrite);
  const answer = useGuide((s) => s.answer);
  const backQuestion = useGuide((s) => s.backQuestion);
  const nextMission = useGuide((s) => s.nextMission);
  const prevMission = useGuide((s) => s.prevMission);
  const toggleCheck = useGuide((s) => s.toggleCheck);
  const addPaper = useGuide((s) => s.addPaper);
  const pending = useGuide((s) => s.pendingPapers);
  const [story, setStory] = useState("");
  const [reply, setReply] = useState("");
  const [fresh, setFresh] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);
  const [seedReady, setSeedReady] = useState(false);
  useEffect(() => {
    setSeed(useGuide.getState().seed);
    useGuide.setState({ seed: null });
    setSeedReady(true);
  }, []);

  const wilaya = wilayas.find((w) => w.id === wilayaId);
  const wilayaName = wilaya ? tx(lang, wilaya.name) : lang === "ar" ? "ولايتك" : "votre wilaya";
  const seedTitle = catalog.find((row) => row.id === seed);

  if (!ready || !seedReady) return <p className="text-sm text-muted">…</p>;

  if (fresh || !file) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!story.trim()) return;
          startCase(story, wilayaId, seed);
          setStory("");
          setFresh(false);
        }}
      >
        <p className="text-xs text-seal">{lang === "ar" ? "المهمة ١ · القصة" : "Mission 1 · le récit"}</p>
        <h1 className="mt-1 font-display text-4xl text-green">{lang === "ar" ? "ما الذي وقع؟" : "Que s'est-il passé ?"}</h1>
        {seedTitle && (
          <p className="mt-2 text-sm text-muted">
            {lang === "ar" ? `البطاقة: ${seedTitle.title.ar}. اكتب الواقعة، لا نكتفي بالعنوان.` : `Carte : ${seedTitle.title.fr}. Écrivez les faits, le titre ne suffit pas.`}
          </p>
        )}
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={6}
          className="mt-4 w-full rounded-lg border border-line bg-sheet p-3 text-base leading-relaxed"
          placeholder={lang === "ar" ? "من، ماذا، منذ متى، وأي ورقة عندك" : "Qui, quoi, depuis quand, et quel papier vous avez"}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button key={example.id} type="button" onClick={() => setStory(example.story)} className="rounded-full border border-line px-3 py-2 text-xs">
              {tx(lang, example.title)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{lang === "ar" ? "الأمثلة منطق للتجربة، ليست ملفك." : "Les exemples sont une logique d'essai, pas votre dossier."}</p>
        <div className="mt-3">
          <Mic lang={lang} onText={(text) => setStory((prev) => (prev ? `${prev}\n${text}` : text))} />
        </div>
        <PaperBox
          lang={lang}
          onSave={(paper) => {
            addPaper(paper);
            setStory((prev) => `${prev}\n${paper.title.ar}`.trim());
          }}
        />
        {pending.length > 0 && (
          <p className="mt-2 text-xs text-muted">
            {lang === "ar" ? "في الذاكرة: " : "En mémoire : "}
            {pending.map((paper) => paper.title.ar).join("، ")}
          </p>
        )}
        <button type="submit" disabled={!story.trim()} className="mt-3 h-12 w-full rounded-md bg-green font-medium text-on-green disabled:opacity-40">
          {lang === "ar" ? "افهم القصة" : "Lire le récit"}
        </button>
      </form>
    );
  }

  if (file.phase === "review") {
    return (
      <section>
        <p className="text-xs text-seal">{lang === "ar" ? "المهمة ١ · التأكد" : "Mission 1 · vérification"}</p>
        <h1 className="mt-1 font-display text-4xl text-green">{lang === "ar" ? "هذا ما فُتح" : "Voici ce qui s'ouvre"}</h1>
        <p className="mt-3 text-base leading-relaxed">{tx(lang, file.understood)}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {file.paths.map((id) => {
            const row = catalog.find((c) => c.id === id);
            return (
              <li key={id} className="rounded-full border border-line px-3 py-1 text-sm">
                {row ? (lang === "ar" ? row.title.ar : row.title.fr) : id}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted">{file.story}</p>
        <Memory lang={lang} paths={file.paths} papers={file.papers ?? []} />
        <button type="button" onClick={acceptReview} className="mt-5 h-12 w-full rounded-md bg-green font-medium text-on-green">
          {lang === "ar" ? "صحيح. السؤال التالي" : "C'est juste. Question suivante"}
        </button>
        <button type="button" onClick={() => { rewrite(); setFresh(true); }} className="mt-2 h-12 w-full rounded-md border border-line text-sm">
          {lang === "ar" ? "أعيد الكتابة" : "Réécrire"}
        </button>
      </section>
    );
  }

  if (file.phase === "questions") {
    const q = file.questions[file.qIndex];
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          answer(reply);
          setReply("");
        }}
      >
        <p className="text-xs text-seal">
          {lang === "ar" ? `سؤال ${q.rank} من ${file.questions.length}` : `Question ${q.rank} sur ${file.questions.length}`}
        </p>
        <h1 className="mt-1 font-display text-3xl leading-snug text-green">{tx(lang, q.prompt)}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{tx(lang, q.changes)}</p>
        <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} className="mt-4 w-full rounded-lg border border-line bg-sheet p-3 text-base" />
        <button type="submit" className="mt-3 h-12 w-full rounded-md bg-green font-medium text-on-green">
          {reply.trim() ? (lang === "ar" ? "التالي" : "Suivant") : lang === "ar" ? "لا أعرف، التالي" : "Je ne sais pas, suivant"}
        </button>
        <button type="button" onClick={backQuestion} className="mt-2 h-12 w-full rounded-md border border-line text-sm">
          {lang === "ar" ? "رجوع" : "Retour"}
        </button>
      </form>
    );
  }

  if (file.phase === "missions") {
    const step = file.ladder[file.missionIndex];
    const upcoming = file.ladder[file.missionIndex + 1];
    return (
      <section>
        <StepCard
          step={step}
          index={file.missionIndex}
          total={file.ladder.length}
          lang={lang}
          wilayaName={wilayaName}
          checks={file.checks}
          onToggle={toggleCheck}
        />
        {upcoming && (
          <p className="mt-4 text-sm text-muted">
            {lang === "ar" ? "بعدها: " : "Ensuite : "}
            <span className="text-ink">{lang === "ar" ? upcoming.title.ar : upcoming.title.fr}</span>
          </p>
        )}
        <Ask lang={lang} step={step} />
        <PaperBox lang={lang} onSave={addPaper} />
        <button type="button" onClick={nextMission} className="mt-3 h-12 w-full rounded-md bg-green font-medium text-on-green">
          {file.missionIndex + 1 >= file.ladder.length
            ? lang === "ar"
              ? "أتممتها. إلى القائمة"
              : "C'est fait. Vers la liste"
            : lang === "ar"
              ? "تمت. المهمة التالية"
              : "Faite. Mission suivante"}
        </button>
        <button type="button" onClick={prevMission} className="mt-2 h-12 w-full rounded-md border border-line text-sm">
          {lang === "ar" ? "رجوع" : "Retour"}
        </button>
      </section>
    );
  }

  const later = suggest(file, articles, offices);
  return (
    <section>
      <p className="text-xs text-seal">{lang === "ar" ? "مهام القضية تمت" : "Missions du dossier faites"}</p>
      <h1 className="mt-1 font-display text-4xl text-green">{lang === "ar" ? "قائمتك" : "Votre liste"}</h1>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {file.checklist.map((item) => (
          <li key={item.id}>
            <label className="flex min-h-12 items-center gap-3 py-2 text-base">
              <input type="checkbox" checked={Boolean(file.checks[item.id])} onChange={() => toggleCheck(item.id)} className="h-5 w-5" />
              {tx(lang, item.label)}
            </label>
          </li>
        ))}
      </ul>
      <Link to={later.to} className="mt-5 block rounded-lg border border-green bg-green-soft p-4">
        <span className="text-xs text-green">{tx(lang, later.kicker)}</span>
        <span className="mt-1 block text-lg font-medium">{tx(lang, later.title)}</span>
      </Link>
      <button type="button" onClick={prevMission} className="mt-2 h-12 w-full rounded-md border border-line text-sm">
        {lang === "ar" ? "راجع المهمة الأخيرة" : "Revoir la dernière mission"}
      </button>
    </section>
  );
}

function Memory({ lang, paths, papers }: { lang: "ar" | "fr"; paths: string[]; papers: SavedPaper[] }) {
  const notes = officialNotes.filter((note) => note.paths.some((id) => paths.includes(id)));
  const missing = stillNeeded(paths, papers.map((paper) => paper.paperId));
  return (
    <div className="mt-4">
      {papers.length > 0 && (
        <ul className="space-y-2">
          {papers.map((paper) => (
            <li key={paper.id} className="rounded-md border border-line px-3 py-2 text-sm">
              {lang === "ar" ? paper.title.ar : paper.title.fr}
              {paper.darija ? <span className="text-muted"> · {paper.darija}</span> : null}
              <span className="mt-1 block text-xs text-muted">{lang === "ar" ? "من ملفك. ليس مادة." : "Tiré de votre fichier. Pas un article."}</span>
            </li>
          ))}
        </ul>
      )}
      {missing.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed">
          {lang === "ar" ? "ما زال اسمه غائباً عن الذاكرة: " : "Encore absent de la mémoire : "}
          {missing.map((paper) => (lang === "ar" ? paper.title.ar : paper.title.fr)).join("، ")}
        </p>
      )}
      {notes.map((note) => (
        <p key={note.date + note.paths[0]} className="mt-3 text-sm leading-relaxed text-muted">
          {tx(lang, note.text)}{" "}
          <a href={note.url} className="text-green underline" target="_blank" rel="noreferrer">
            {note.date}
          </a>
        </p>
      ))}
    </div>
  );
}

function Ask({ lang, step }: { lang: "ar" | "fr"; step: Step }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<L | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!q.trim()) return;
        setAnswer(talk(q, step));
      }}
      className="mt-4"
    >
      <label htmlFor="ask" className="text-sm font-medium">
        {lang === "ar" ? "اسأل عن هذه المهمة" : "Demandez sur cette mission"}
      </label>
      <input id="ask" value={q} onChange={(e) => setQ(e.target.value)} className="mt-2 h-12 w-full rounded-md border border-line bg-sheet px-3" />
      <div className="mt-2">
        <Mic
          lang={lang}
          onText={(text) => {
            setQ(text);
            setAnswer(talk(text, step));
          }}
        />
      </div>
      <button type="submit" className="mt-2 h-12 w-full rounded-md border border-line text-sm">
        {lang === "ar" ? "رد من هذه المهمة فقط" : "Réponse limitée à cette mission"}
      </button>
      {answer && (
        <div className="mt-3 rounded-md bg-green-soft p-3 text-sm leading-relaxed">
          <p>{tx(lang, answer)}</p>
          <button type="button" onClick={() => speak(tx(lang, answer), lang)} className="mt-2 text-green">
            {lang === "ar" ? "اقرأ الرد" : "Lire la réponse"}
          </button>
        </div>
      )}
    </form>
  );
}

function StepCard({
  step,
  index,
  total,
  lang,
  wilayaName,
  checks,
  onToggle,
}: {
  step: Step;
  index: number;
  total: number;
  lang: "ar" | "fr";
  wilayaName: string;
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const p = (index + 1) / total;
  const c = 2 * Math.PI * 16;
  return (
    <article className="rounded-lg border border-line bg-sheet p-4">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 40 40" className="h-12 w-12 shrink-0 text-green" aria-hidden>
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${c * p} ${c}`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        </svg>
        <div>
          <p className="text-xs text-muted">
            {index + 1} / {total}
            {step.urgent ? <span className="ms-2 text-seal">{lang === "ar" ? "ابدأ بهذه" : "Commencez par ici"}</span> : null}
          </p>
          <h1 className="font-display text-2xl leading-snug text-green">{lang === "ar" ? step.title.ar : step.title.fr}</h1>
        </div>
      </div>
      {step.title.darija && lang === "ar" && <p className="mt-2 text-sm text-muted">{step.title.darija}</p>}
      <p className="mt-3 inline-block rounded-full bg-seal-soft px-2 py-1 text-xs text-seal">
        {step.articles.some((a) => a.status === "PUBLISHED")
          ? lang === "ar"
            ? "نص منشور"
            : "Texte publié"
          : lang === "ar"
            ? "أكّد عند أمانة الضبط"
            : "À confirmer au greffe"}
      </p>
      <Field k={lang === "ar" ? "أين" : "Où"} v={place(tx(lang, step.where), wilayaName)} />
      <Field k={lang === "ar" ? "ماذا تودع" : "Quoi déposer"} v={place(tx(lang, step.file), wilayaName)} />
      <Field k={lang === "ar" ? "الأجل" : "Délai"} v={step.deadline.text ? tx(lang, step.deadline.text) : lang === "ar" ? "غير مثبت" : "Non établi"} />
      <Field k={lang === "ar" ? "التكلفة" : "Coût"} v={money(step.cost, lang)} />
      <Field k={lang === "ar" ? "المخاطرة" : "Risque"} v={tx(lang, step.risks)} />
      {step.do_not.map((line) => (
        <p key={line.ar} className="mt-3 text-sm font-medium text-seal">
          {tx(lang, line)}
        </p>
      ))}
      {step.tip_darija && lang === "ar" && <p className="mt-2 text-sm text-muted">{step.tip_darija}</p>}
      <ul className="mt-3">
        {step.bring.map((item) => (
          <li key={item.id}>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input type="checkbox" checked={Boolean(checks[`${step.id}:${item.id}`])} onChange={() => onToggle(`${step.id}:${item.id}`)} className="h-5 w-5" />
              {tx(lang, item.label)}
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-base font-medium">{tx(lang, step.next_action)}</p>
    </article>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="mt-3">
      <div className="text-xs text-muted">{k}</div>
      <div className="mt-1 text-base leading-relaxed">{v}</div>
    </div>
  );
}

function money(cost: Cost, lang: "ar" | "fr") {
  if (cost.kind === "ASK_DEVIS" || cost.min_da == null || cost.max_da == null) {
    return lang === "ar" ? "اطلب تسعيرة" : "Demandez un devis";
  }
  return `${cost.min_da}–${cost.max_da} DZD · ${cost.source} · ${cost.last_updated}`;
}
