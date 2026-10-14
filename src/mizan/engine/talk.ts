import type { L, Step } from "../schema";

/** Answers only from the open mission. Never adds an article or a price. */
export function talk(said: string, step: Step): L {
  const text = said.toLowerCase();
  if (/أين|وين|فين|where|où|ou\b/.test(text)) return step.where;
  if (/أجل|وقت|délai|delay/.test(text)) {
    return step.deadline.text ?? { ar: "الأجل غير مثبت.", fr: "Le délai n'est pas établi." };
  }
  if (/ثمن|سعر|فلوس|prix|coût|cout/.test(text)) {
    return { ar: "اطلب تسعيرة. لا رقم محفوظ.", fr: "Demandez un devis. Aucun chiffre n'est enregistré." };
  }
  if (/ورق|وثيقة|نجيب|papier|apporter/.test(text)) {
    const ar = step.bring.map((item) => item.label.ar).join("، ");
    const fr = step.bring.map((item) => item.label.fr).join(", ");
    return { ar: ar || "لا قائمة محفوظة.", fr: fr || "Pas de liste enregistrée." };
  }
  if (/ملف|عريضة|نودع|déposer|requête/.test(text)) return step.file;
  if (/خطر|مخاطر|risque/.test(text)) return step.risks;
  const tip = step.tip_darija ? ` ${step.tip_darija}` : "";
  return {
    ar: `نبقى على هذه المهمة. ${step.next_action.ar}${tip}`,
    fr: `On reste sur cette mission. ${step.next_action.fr}`,
  };
}
