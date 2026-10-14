import catalog from "../paths/catalog.json" with { type: "json" };
import succession from "../paths/succession.json" with { type: "json" };
import tc01 from "../cases/tc-01-garage.json" with { type: "json" };
import { ASK_DEVIS, CONFIRM_DEADLINE, ensurePaths } from "../schema.ts";
import type { IntakeQuestion, L, PathDef, Step, WorkedCase } from "../schema.ts";

const paths = succession as PathDef;
const garageCase = tc01 as WorkedCase;

const RULES: { id: string; re: RegExp }[] = [
  { id: "succession", re: /تركة|الورثة|وريث|ميراث|hérit|succession|متوفى|inherit|heir/i },
  { id: "divorce", re: /طلاق|خلع|تطليق|\bdivorce\b/i },
  { id: "custody-nafaqa", re: /حضانة|نفقة|pension alimentaire/i },
  { id: "marriage-auth", re: /ترخيص الزواج|autorisation de mariage/i },
  { id: "labour", re: /مفتشية العمل|فصلني|فُصلت|تسريح|licenci|employeur|عقد عمل/i },
  { id: "debt", re: /دين|قرض|لم يدفع|créance/i },
  { id: "eviction", re: /إخلاء|طرد من السكن|تغيير القفل|expulsion/i },
  { id: "criminal-complaint", re: /شكوى|سرقة|نصب|ضربني|\bplainte\b/i },
  { id: "cheque", re: /شيك|ch[eè]que/i },
  { id: "civil-status", re: /حالة مدنية|تصحيح اسم|état civil/i },
  { id: "admin-annul", re: /قرار إداري|إلغاء قرار/i },
  { id: "land-title", re: /دفتر عقاري|المحافظة العقارية|livret foncier/i },
  { id: "traffic-insurance", re: /حادث مرور|accident de la (route|circulation)|تأمين السيارة/i },
  { id: "consumer", re: /ضمان السلعة|استهلاك|produit défect/i },
  { id: "neighbour", re: /الجار|جاري|voisinage|\bvoisin\b/i },
  { id: "commercial-lease", re: /إيجار تجاري|محل تجاري|bail commercial/i },
  { id: "company-partners", re: /شريك في الشركة|associé/i },
  { id: "work-accident", re: /حادث عمل|accident du travail/i },
  { id: "kafala", re: /كفالة|\bkafala\b/i },
  { id: "judgment-enforcement", re: /تنفيذ حكم|صيغة تنفيذ/i },
  { id: "filiation", re: /إثبات نسب|\bfiliation\b/i },
  { id: "coownership", re: /على الشيوع|indivision/i },
  { id: "construction-works", re: /مقاول|ورشة أشغال|chantier/i },
  { id: "tax-dispute", re: /الضرائب|منازعة ضريبية|impôt/i },
  { id: "building-permit", re: /رخصة بناء|permis de construire/i },
];

function titleOf(id: string): L {
  const row = catalog.find((c) => c.id === id);
  return row ? { ar: row.title.ar, fr: row.title.fr } : { ar: id, fr: id };
}

function shell(id: string): Step {
  const name = titleOf(id);
  const eviction = id === "eviction";
  const pressure = id === "criminal-complaint" || id === "cheque";
  const deadlineRisk =
    id === "labour" || id === "admin-annul"
      ? {
          ar: "يُذكر أجل في الشروح. رقمه غير مخزّن هنا. اسأل أمانة الضبط قبل أن تفترض أنه مفتوح.",
          fr: "Les commentaires citent un délai. Son chiffre n'est pas stocké ici. Demandez au greffe avant de le croire ouvert.",
        }
      : {
          ar: "هذه بطاقة عنوان. ليست خطة مكتملة ولا نصاً من الجريدة الرسمية.",
          fr: "Cette carte est un titre. Ni un plan complet, ni un texte du Journal officiel.",
        };
  return {
    id: `mission-${id}`,
    rung: eviction ? "emergency" : pressure ? "pressure" : "main",
    urgent: eviction,
    title:
      id === "open-file"
        ? { ar: "افتح ملفاً واسأل الشباك", fr: "Ouvrez un dossier et demandez le guichet", darija: null }
        : { ar: name.ar, fr: name.fr, darija: null },
    where: {
      ar: "أمانة ضبط محكمة {wilaya}. اسأل أي قسم قبل الصف.",
      fr: "Greffe du tribunal de {wilaya}. Demandez la section avant la file.",
    },
    file: {
      ar: "ورقة بالوقائع والتواريخ والأسماء. ليست عريضة جاهزة.",
      fr: "Une feuille : faits, dates, noms. Pas une requête toute faite.",
    },
    bring: [
      { id: `${id}-id`, label: { ar: "وثيقة الهوية", fr: "Pièce d'identité" } },
      { id: `${id}-papers`, label: { ar: "الورق الذي تملكه عن الواقعة", fr: "Les papiers que vous avez sur les faits" } },
    ],
    deadline: CONFIRM_DEADLINE,
    cost: ASK_DEVIS,
    articles: [],
    risks: deadlineRisk,
    next_action: {
      ar: "اذهب إلى أمانة الضبط واسأل أي قسم يسمع هذا المشكل.",
      fr: "Allez au greffe et demandez quelle section entend ce problème.",
    },
    tip_darija: null,
    do_not: eviction
      ? [{ ar: "لا تغيّر القفل ولا تُخرج الأثاث بنفسك.", fr: "Ne changez pas la serrure et ne sortez pas les meubles vous-même." }]
      : [],
  };
}

function questions(wilayaId: string): IntakeQuestion[] {
  const list: IntakeQuestion[] = [];
  if (!wilayaId) {
    list.push({
      id: "q-wilaya",
      rank: 1,
      prompt: { ar: "في أي ولاية وقع هذا؟", fr: "Dans quelle wilaya cela s'est-il passé ?" },
      changes: { ar: "يغيّر المحكمة التي تقصدها.", fr: "Change le tribunal où vous allez." },
    });
  }
  list.push(
    {
      id: "q-case",
      rank: 1,
      prompt: { ar: "هل هناك قضية مفتوحة؟ اكتب رقمها والمحكمة، أو اكتب: لا.", fr: "Y a-t-il une affaire ouverte ? Numéro et tribunal, ou écrivez : non." },
      changes: { ar: "قضية قائمة تُكملها. بلا رقم تبدأ من الشباك.", fr: "Une affaire ouverte se poursuit. Sans numéro, on commence au guichet." },
    },
    {
      id: "q-papers",
      rank: 2,
      prompt: { ar: "ما الورق الذي في يدك الآن؟", fr: "Quels papiers avez-vous en main maintenant ?" },
      changes: { ar: "يحدد ماذا تحمل غداً وما الذي ما زلت تطلبه.", fr: "Dit ce que vous emportez demain, et ce qu'il faut encore demander." },
    },
    {
      id: "q-urgent",
      rank: 3,
      prompt: { ar: "ما الذي يضيع إن انتظرت أسبوعاً: مال، سقف، أجل، أو لا شيء؟", fr: "Que perdez-vous si vous attendez une semaine : un bien, un toit, un délai, ou rien ?" },
      changes: { ar: "إن كان شيء يضيع، المهمة العاجلة تسبق الدعوى الطويلة.", fr: "Si quelque chose se perd, la mission urgente passe avant le procès long." },
    },
  );
  return list.slice(0, 4).map((q, i) => ({ ...q, rank: i + 1 }));
}

export type Brief = {
  paths: string[];
  questions: IntakeQuestion[];
  ladder: Step[];
  checklist: { id: string; label: L }[];
  understood: L;
  garage: boolean;
};

export function classify(story: string, wilayaId: string, seed?: string | null): Brief {
  const text = story.trim();
  const accident = /حادث|accident/i.test(text);
  const car = /سيار|طوموبيل|\bcar\b|voiture/i.test(text);
  const inGarage = /garage|كراج|قاراج/i.test(text);
  const heir = /inherit|heir|succession|ترك|ورث|أب|père|father/i.test(text);
  const garage = car && inGarage && heir && !accident;

  const found = RULES.filter((rule) => rule.re.test(text)).map((rule) => rule.id);
  if (garage && !found.includes("succession")) found.unshift("succession");
  if (seed && catalog.some((c) => c.id === seed) && !found.includes(seed)) found.unshift(seed);

  const ids = ensurePaths(garage ? ["succession", "criminal-complaint"] : found);
  const ladder: Step[] = [];
  if (garage) ladder.push(...garageCase.ladder);
  else {
    if (ids.includes("succession")) ladder.push(...paths.steps);
    if (ids.includes("eviction")) ladder.push(shell("eviction"));
    for (const id of ids) {
      if (id === "succession" || id === "eviction") continue;
      ladder.push(shell(id));
    }
  }
  if (ladder.length === 0) ladder.push(shell("open-file"));

  const names = ids.map((id) => titleOf(id).ar).join("، ");
  const namesFr = ids.map((id) => titleOf(id).fr).join(", ");
  const qs = garage ? garageCase.questions : questions(wilayaId);
  const checklist = garage
    ? garageCase.checklist
    : ladder.flatMap((step) => step.bring.map((item) => ({ id: `${step.id}:${item.id}`, label: item.label })));

  return {
    paths: ids,
    questions: qs,
    ladder,
    checklist,
    garage,
    understood: garage
      ? {
          ar: "حفظ المال أولاً، ثم قسمة لا تنتظر الإمضاء، ثم الحسابات، ثم التأجيلات. لا تنقل السيارة.",
          fr: "D'abord conserver le bien, puis un partage qui n'attend pas la signature, puis les comptes, puis les renvois. Ne déplacez pas la voiture.",
        }
      : {
          ar: `فُتح: ${names}. هذا فرز لا حكم.`,
          fr: `Ouvert : ${namesFr}. Ceci trie, cela ne juge pas.`,
        },
  };
}
