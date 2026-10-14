import type { L, Lang } from "@/data/types";

export function tx(lang: Lang, text: L): string {
  return text[lang];
}

export function fill(text: string, wilaya: string, lang: Lang): string {
  const name = wilaya || (lang === "ar" ? "ولايتك" : "votre wilaya");
  return text.replaceAll("{wilaya}", name);
}

export function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ؤئ]/g, "ء");
}

export const ui = {
  ar: {
    mark: "ميزان",
    latin: "MIZAN",
    tag: "المسار، المكان، والنص. لقضيتك في الجزائر.",
    search: "ابحث: طلاق، نفقة، أجر، شكوى، فريضة…",
    wilaya: "الولاية",
    wilayaPick: "اختر الولاية",
    wilayaHint: "عيّن الولاية ليُكتب اسم المحكمة في كل خطوة.",
    ask: "ما الذي وقع؟",
    how: ["اختر الواقعة", "عيّن الولاية", "اتبع المكان ثم الإجراء ثم النص"],
    root: "أصل القانون",
    cases: "القضايا",
    back: "القضايا",
    changePath: "غيّر الصورة",
    next: "الخطوة التالية",
    prev: "السابقة",
    done: "بلغت آخر خطوة",
    stepOf: "الخطوة",
    of: "من",
    where: "أين",
    do: "ماذا تفعل",
    bring: "ماذا تُحضر",
    rule: "النص الذي يُطبَّق",
    delay: "أجل لا يُفوَّت",
    caution: "تنبيه",
    official: "نص منشور",
    guide: "مسار موجَّه، لا اقتباس حرفي",
    frNote: "الترجمة الفرنسية مؤشّرة. النص الرسمي عربي.",
    empty: "لا نتيجة. جرّب كلمة من الواقعة: نفقة، خلع، شيك، إلغاء.",
    articles: "مواد",
    continue: "أكمل من حيث وقفت",
    dismiss: "فهمت، أبدأ",
    noteTitle: "قبل أن تبدأ",
    noteBody:
      "ميزان يرتّب المسار حسب نصوص منشورة: قانون الأسرة بعد أمر 2005، قانون الإجراءات المدنية والإدارية، قانون تسوية نزاعات العمل، وما نشرته وزارة الداخلية ومجالس قضائية عن الحالة المدنية. ليس محامياً ولا يحل محل أمانة الضبط. الاستثناءات كثيرة والنصوص تُعدَّل. إن كان في الملف عنف أو حبس أو قاصر، ابدأ بالنيابة أو بمحامٍ.",
    foot: "دليل إجراءات، ليس استشارة قانونية. أكّد الشباك والأجل في المحكمة.",
    skeletonTitle: "هيكل عريضة للترتيب فقط",
    skeletonHint: "ليست مطبوعة رسمية. طابقها مع المادة 15 ثم وقّعها. النقص الشكلي يعرّضها لعدم القبول.",
    copy: "انسخ الهيكل",
    copied: "نُسخ",
    places: "الأماكن بأسمائها",
    open: "افتح المادة",
    allCodes: "النصوص",
    ground: "سبب التطليق",
    noCase: "هذه الواقعة غير موجودة.",
    deadlinesTitle: "آجال تُسقط الحق",
    lang: "FR",
    seen: "نُظمت",
  },
  fr: {
    mark: "Mizan",
    latin: "ميزان",
    tag: "Le lieu, le geste, le texte. Pour votre affaire en Algérie.",
    search: "Divorce, pension, salaire, plainte, succession…",
    wilaya: "Wilaya",
    wilayaPick: "Choisir la wilaya",
    wilayaHint: "Indiquez la wilaya pour que le nom du tribunal s'écrive dans chaque étape.",
    ask: "Que s'est-il passé ?",
    how: ["Choisissez le fait", "Indiquez la wilaya", "Suivez le lieu, puis le geste, puis le texte"],
    root: "Le socle",
    cases: "Affaires",
    back: "Affaires",
    changePath: "Changer de voie",
    next: "Étape suivante",
    prev: "Précédente",
    done: "Dernière étape atteinte",
    stepOf: "Étape",
    of: "sur",
    where: "Où",
    do: "Quoi faire",
    bring: "Quoi apporter",
    rule: "Le texte qui s'applique",
    delay: "Délai à ne pas manquer",
    caution: "Attention",
    official: "Texte publié",
    guide: "Chemin guidé, pas une citation littérale",
    frNote: "La traduction française est indicative. Le texte officiel est en arabe.",
    empty: "Aucun résultat. Essayez un mot du fait : pension, khul', chèque, annulation.",
    articles: "Articles",
    continue: "Reprendre où vous en étiez",
    dismiss: "Compris, je commence",
    noteTitle: "Avant de commencer",
    noteBody:
      "Mizan range le chemin selon des textes publiés : code de la famille après l'ordonnance de 2005, code de procédure civile et administrative, loi sur les conflits individuels du travail, et ce que le ministère de l'Intérieur et des cours ont publié sur l'état civil. Ce n'est pas un avocat et cela ne remplace pas le greffe. Les exceptions sont nombreuses et les textes changent. S'il y a violence, détention ou un mineur, commencez par le parquet ou un avocat.",
    foot: "Guide de procédure, pas un conseil juridique. Confirmez le guichet et le délai au tribunal.",
    skeletonTitle: "Ossature de requête, pour vous organiser",
    skeletonHint:
      "Ce n'est pas un imprimé officiel. Calez-la sur l'article 15, puis signez. Un vice de forme l'expose à l'irrecevabilité.",
    copy: "Copier l'ossature",
    copied: "Copié",
    places: "Les lieux, par leur nom",
    open: "Ouvrir l'article",
    allCodes: "Textes",
    ground: "Motif du divorce demandé",
    noCase: "Cette affaire n'existe pas.",
    deadlinesTitle: "Délais qui font tomber le droit",
    lang: "ع",
    seen: "vu",
  },
} as const;

export const places: { name: L; body: L }[] = [
  {
    name: { ar: "أمانة الضبط", fr: "Greffe" },
    body: {
      ar: "مكتب داخل المحكمة تُودع فيه العريضة وتُستلم منه النسخ ورقم القضية وتاريخ الجلسة.",
      fr: "Bureau du tribunal où l'on dépose la requête et où l'on retire les copies, le numéro et la date d'audience.",
    },
  },
  {
    name: { ar: "المحضر القضائي", fr: "Huissier de justice" },
    body: {
      ar: "من يبلّغ الخصم رسمياً وينفّذ السندات. ليس عون الشباك في المحكمة.",
      fr: "Il notifie officiellement l'adversaire et exécute les titres. Ce n'est pas l'agent du guichet du tribunal.",
    },
  },
  {
    name: { ar: "وكيل الجمهورية", fr: "Procureur de la République" },
    body: {
      ar: "النيابة في المحكمة. الشكاوى الجزائية وتصحيح الحالة المدنية الجوهرية يمران من هنا.",
      fr: "Le parquet du tribunal. Les plaintes pénales et la rectification substantielle de l'état civil passent par lui.",
    },
  },
  {
    name: { ar: "قسم شؤون الأسرة", fr: "Section familiale" },
    body: {
      ar: "قسم في المحكمة العادية: الطلاق، الحضانة، النفقة، التركة المتنازع عليها، التراخيص الأسرية.",
      fr: "Section du tribunal judiciaire : divorce, garde, entretien, succession litigieuse, autorisations familiales.",
    },
  },
  {
    name: { ar: "القسم الاجتماعي", fr: "Section sociale" },
    body: {
      ar: "قسم منازعات العمل الفردية، بعد محضر عدم الصلح.",
      fr: "Section des conflits individuels du travail, après le procès-verbal de non-conciliation.",
    },
  },
  {
    name: { ar: "المحكمة الإدارية", fr: "Tribunal administratif" },
    body: {
      ar: "تقضي في إلغاء القرارات الإدارية. ليست المحكمة التي تنظر الطلاق أو الدين.",
      fr: "Elle juge l'annulation des décisions administratives. Ce n'est pas le tribunal du divorce ou de la créance.",
    },
  },
  {
    name: { ar: "الموثق", fr: "Notaire" },
    body: {
      ar: "يحرر الفريضة والعقود. لا يحل محل القاضي إذا وُجد نزاع.",
      fr: "Il dresse la dévolution successorale et les actes. Il ne remplace pas le juge s'il y a litige.",
    },
  },
  {
    name: { ar: "مكتب المصالحة", fr: "Bureau de conciliation" },
    body: {
      ar: "أمام مفتشية العمل. محضره، لا رسالة المفتش وحدها، هو الذي يُرفق بدعوى القسم الاجتماعي.",
      fr: "Auprès de l'inspection du travail. C'est son procès-verbal, pas la seule lettre de l'inspecteur, qui se joint à l'action sociale.",
    },
  },
  {
    name: { ar: "ضابط الحالة المدنية", fr: "Officier de l'état civil" },
    body: {
      ar: "في البلدية. يسلّم العقود ويصحح أخطاء الحجز المادية. لا يُطلق ولا يغيّر لقباً.",
      fr: "À la commune. Il délivre les actes et corrige les erreurs matérielles de saisie. Il ne divorce pas et ne change pas un nom.",
    },
  },
  {
    name: { ar: "المحافظة العقارية", fr: "Conservation foncière" },
    body: {
      ar: "فيها يُشهر انتقال العقار بعد القسمة أو البيع. الفريضة وحدها لا تغيّر الدفتر العقاري.",
      fr: "C'est là que se publie le transfert d'un immeuble après partage ou vente. La dévolution seule ne change pas le livret foncier.",
    },
  },
];

export function skeleton(lang: Lang, court: string): string {
  if (lang === "ar") {
    return `إلى السيد رئيس ${court}

عريضة افتتاح دعوى

لفائدة: ............... الساكن بـ ...............

ضد: ............... الساكن بـ ...............

سيدي الرئيس،

الوقائع:
...............

الوسائل:
المواد ...............

الطلبات:
1. ...............

المستندات المرفقة:
1. ...............

حرر بـ ............... في ...............
الإمضاء`;
  }
  return `À Monsieur le président — ${court}

Requête introductive d'instance

Pour : ............... demeurant à ...............

Contre : ............... demeurant à ...............

Monsieur le Président,

Faits :
...............

Moyens :
Articles ...............

Demandes :
1. ...............

Pièces jointes :
1. ...............

Fait à ............... le ...............
Signature`;
}
