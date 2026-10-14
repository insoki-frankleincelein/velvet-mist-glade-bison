import type { L } from "../schema";
import type { GuideCase } from "../store";

export type Suggestion = {
  to: "/" | "/case" | "/law" | "/lawyers" | "/me";
  kicker: L;
  title: L;
  detail: L;
};

export function suggest(active: GuideCase | null, articleCount: number, officeCount: number): Suggestion {
  if (!active) {
    return {
      to: "/case",
      kicker: { ar: "المهمة ١ من ٣", fr: "Mission 1 sur 3" },
      title: { ar: "احكِ ما وقع", fr: "Racontez ce qui s'est passé" },
      detail: { ar: "جملة أو فقرة. عربي، دارجة، فرنسية، أو خليط.", fr: "Une phrase ou un paragraphe. Arabe, darja, français, ou mélange." },
    };
  }
  if (active.phase === "review") {
    return {
      to: "/case",
      kicker: { ar: "المهمة ١ من ٣", fr: "Mission 1 sur 3" },
      title: { ar: "راجع ما فُهم", fr: "Relisez ce qui a été compris" },
      detail: active.understood,
    };
  }
  if (active.phase === "questions") {
    const q = active.questions[active.qIndex];
    return {
      to: "/case",
      kicker: {
        ar: `سؤال ${active.qIndex + 1} من ${active.questions.length}`,
        fr: `Question ${active.qIndex + 1} sur ${active.questions.length}`,
      },
      title: q.prompt,
      detail: q.changes,
    };
  }
  if (active.phase === "missions") {
    const step = active.ladder[active.missionIndex];
    return {
      to: "/case",
      kicker: {
        ar: `مهمة ${active.missionIndex + 1} من ${active.ladder.length}`,
        fr: `Mission ${active.missionIndex + 1} sur ${active.ladder.length}`,
      },
      title: { ar: step.title.ar, fr: step.title.fr },
      detail: step.next_action,
    };
  }
  if (articleCount === 0) {
    return {
      to: "/law",
      kicker: { ar: "المهمة ٢ من ٣", fr: "Mission 2 sur 3" },
      title: { ar: "ألصق نصاً من الجريدة الرسمية", fr: "Collez un texte du Journal officiel" },
      detail: { ar: "المكتبة فارغة حتى توفّر النص. لن نملأها من الذاكرة.", fr: "La bibliothèque est vide tant que vous ne fournissez pas le texte." },
    };
  }
  if (officeCount === 0) {
    return {
      to: "/lawyers",
      kicker: { ar: "المهمة ٣ من ٣", fr: "Mission 3 sur 3" },
      title: { ar: "أضف مكتباً تعرفه", fr: "Ajoutez un cabinet que vous connaissez" },
      detail: { ar: "لا دليل محامين هنا. المكتب يبقى على جهازك.", fr: "Pas d'annuaire ici. Le cabinet reste sur votre appareil." },
    };
  }
  return {
    to: "/me",
    kicker: { ar: "اكتملت الثلاث", fr: "Les trois sont faites" },
    title: { ar: "راجع قائمتك", fr: "Relisez votre liste" },
    detail: { ar: "القضية والنص والمكتب على هذا الجهاز فقط.", fr: "L'affaire, le texte et le cabinet sont seulement sur cet appareil." },
  };
}
