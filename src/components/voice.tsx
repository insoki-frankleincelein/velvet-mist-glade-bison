import { useState } from "react";

type Rec = {
  lang: string;
  onresult: ((ev: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function listen(onText: (text: string) => void, onFail: () => void) {
  const w = window as Window & { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) {
    onFail();
    return;
  }
  const rec = new Ctor();
  rec.lang = "ar-DZ";
  rec.onresult = (ev) => onText(ev.results[0][0].transcript);
  rec.onerror = () => onFail();
  try {
    rec.start();
  } catch {
    onFail();
  }
}

export function speak(text: string, lang: "ar" | "fr") {
  if (!window.speechSynthesis) return false;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "ar" ? "ar" : "fr";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  return true;
}

export function Mic({ lang, onText }: { lang: "ar" | "fr"; onText: (text: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          listen(onText, () =>
            setNote(
              lang === "ar"
                ? "الميكروفون لم يعمل. الصوت يمر عبر الهاتف، والدارجة كثيراً ما تُفهم خطأ. اكتب."
                : "Le micro n'a pas marché. La voix passe par le téléphone, et la darja est souvent mal lue. Écrivez.",
            ),
          )
        }
        className="h-12 w-full rounded-md border border-line bg-sheet text-sm"
      >
        {lang === "ar" ? "تكلّم" : "Parler"}
      </button>
      {note && <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>}
    </div>
  );
}
