import { useState } from "react";
import { identify, papers } from "@/mizan/papers";
import type { SavedPaper } from "@/mizan/papers";
import { textOf } from "@/mizan/engine/read-file";

export function PaperBox({ lang, onSave }: { lang: "ar" | "fr"; onSave: (paper: SavedPaper) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{ filename: string; text: string; paperId: string | null } | null>(null);

  async function take(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const text = (await textOf(file)).trim();
      const hit = text ? identify(text) : null;
      setDraft({ filename: file.name || (lang === "ar" ? "صورة" : "photo"), text, paperId: hit?.id ?? null });
      if (!text) {
        setError(lang === "ar" ? "لم يُقرأ حرف. اختر الاسم بنفسك، أو صوّر الورقة أوضح." : "Aucune lettre lue. Choisissez le nom, ou reprenez la photo.");
      }
    } catch {
      setError(
        lang === "ar"
          ? "تعذّرت القراءة. صورة الورقة تحتاج شبكة في أول مرة. ملف القضية ليس قانوناً، وملف القانون ليس قضيتك."
          : "Lecture impossible. La photo a besoin du réseau la première fois.",
      );
    } finally {
      setBusy(false);
    }
  }

  function save(paperId: string | null) {
    if (!draft) return;
    const known = papers.find((paper) => paper.id === paperId);
    onSave({
      id: crypto.randomUUID(),
      paperId,
      title: known?.title ?? { ar: draft.filename, fr: draft.filename },
      darija: known?.darija ?? null,
      excerpt: draft.text.slice(0, 800),
      filename: draft.filename,
    });
    setDraft(null);
  }

  return (
    <div className="mt-4 rounded-lg border border-line bg-sheet p-3">
      <p className="text-sm font-medium">{lang === "ar" ? "ورقة من قضيتك" : "Une pièce de votre dossier"}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {lang === "ar"
          ? "صوّر الشهادة أو الحكم. التطبيق يخمّن الاسم فقط. هذا ليس نص القانون."
          : "Photographiez l'acte ou le jugement. L'app devine seulement le nom. Ce n'est pas le texte de loi."}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="flex h-12 items-center justify-center rounded-md bg-green text-sm text-on-green">
          {lang === "ar" ? "الكاميرا" : "Caméra"}
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => void take(e.target.files?.[0])} />
        </label>
        <label className="flex h-12 items-center justify-center rounded-md border border-line text-sm">
          PDF
          <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => void take(e.target.files?.[0])} />
        </label>
      </div>
      {busy && <p className="mt-2 text-sm text-muted">{lang === "ar" ? "يقرأ…" : "Lecture…"}</p>}
      {error && <p className="mt-2 text-sm text-seal">{error}</p>}
      {draft && (
        <div className="mt-3">
          <p className="text-sm">
            {draft.paperId
              ? lang === "ar"
                ? `يشبه: ${papers.find((p) => p.id === draft.paperId)?.title.ar}`
                : `Ressemble à : ${papers.find((p) => p.id === draft.paperId)?.title.fr}`
              : lang === "ar"
                ? "لم يُعرف الاسم. اختره."
                : "Nom inconnu. Choisissez-le."}
          </p>
          {draft.paperId && papers.find((p) => p.id === draft.paperId)?.darija && (
            <p className="text-xs text-muted">{papers.find((p) => p.id === draft.paperId)?.darija}</p>
          )}
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">{draft.text.slice(0, 220)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {papers.map((paper) => (
              <button key={paper.id} type="button" onClick={() => save(paper.id)} className="rounded-full border border-line px-3 py-2 text-xs">
                {lang === "ar" ? paper.title.ar : paper.title.fr}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => save(draft.paperId)} className="mt-3 h-11 w-full rounded-md bg-green text-sm text-on-green">
            {lang === "ar" ? "احفظها في ذاكرة القضية" : "Garder dans la mémoire du dossier"}
          </button>
        </div>
      )}
    </div>
  );
}
