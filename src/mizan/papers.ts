import type { L } from "./schema";

export type SavedPaper = {
  id: string;
  paperId: string | null;
  title: L;
  darija: string | null;
  excerpt: string;
  filename: string;
};

export type LawReading = {
  id: string;
  filename: string;
  excerpt: string;
  chars: number;
};
export type Paper = {
  id: string;
  title: L;
  darija: string | null;
  keywords: string[];
  paths: string[];
};

export const papers: Paper[] = [
  {
    id: "birth",
    title: { ar: "شهادة الميلاد", fr: "Acte de naissance" },
    darija: null,
    keywords: ["شهادة الميلاد", "عقد الميلاد", "acte de naissance"],
    paths: ["civil-status", "succession", "marriage-auth", "filiation"],
  },
  {
    id: "death",
    title: { ar: "شهادة الوفاة", fr: "Acte de décès" },
    darija: null,
    keywords: ["شهادة الوفاة", "عقد الوفاة", "acte de décès", "acte de deces"],
    paths: ["succession"],
  },
  {
    id: "family-book",
    title: { ar: "الدفتر العائلي", fr: "Livret de famille" },
    darija: null,
    keywords: ["الدفتر العائلي", "livret de famille"],
    paths: ["succession", "marriage-auth", "custody-nafaqa"],
  },
  {
    id: "marriage",
    title: { ar: "عقد الزواج", fr: "Acte de mariage" },
    darija: null,
    keywords: ["عقد الزواج", "شهادة الزواج", "acte de mariage"],
    paths: ["divorce", "marriage-auth", "custody-nafaqa"],
  },
  {
    id: "id-card",
    title: { ar: "بطاقة التعريف الوطنية", fr: "Carte nationale d'identité" },
    darija: null,
    keywords: ["بطاقة التعريف", "البطاقة الوطنية", "carte nationale"],
    paths: [],
  },
  {
    id: "car-card",
    title: { ar: "بطاقة ترقيم السيارة", fr: "Carte grise" },
    darija: null,
    keywords: ["بطاقة الترقيم", "البطاقة الرمادية", "carte grise"],
    paths: ["succession", "traffic-insurance"],
  },
  {
    id: "judgment",
    title: { ar: "حكم أو قرار قضائي", fr: "Jugement ou arrêt" },
    darija: null,
    keywords: ["حكمت المحكمة", "القرار الصادر", "jugement"],
    paths: ["judgment-enforcement"],
  },
  {
    id: "labour-minutes",
    title: { ar: "محضر مصالحة", fr: "Procès-verbal de conciliation" },
    darija: null,
    keywords: ["محضر عدم الصلح", "محضر مصالحة", "مفتشية العمل", "non-conciliation"],
    paths: ["labour"],
  },
  {
    id: "lease",
    title: { ar: "عقد إيجار", fr: "Contrat de bail" },
    darija: null,
    keywords: ["عقد إيجار", "contrat de bail", "contrat de location"],
    paths: ["eviction", "commercial-lease"],
  },
  {
    id: "cheque",
    title: { ar: "شيك", fr: "Chèque" },
    darija: "الشيك",
    keywords: ["شيك", "chèque", "cheque", "بلا رصيد"],
    paths: ["cheque"],
  },
  {
    id: "land-book",
    title: { ar: "دفتر عقاري", fr: "Livret foncier" },
    darija: "الدفتر العقاري",
    keywords: ["دفتر عقاري", "livret foncier", "المحافظة العقارية"],
    paths: ["land-title", "succession"],
  },
];

/** Wording taken from the Interior Ministry civil-status page. Not a statute. */
export const officialNotes: { paths: string[]; url: string; date: string; text: L }[] = [
  {
    paths: ["marriage-auth"],
    url: "http://interieur.gov.dz/2024/02/29/%D8%A7%D9%84%D8%AD%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A%D8%A9/",
    date: "2024-02-29",
    text: {
      ar: "صفحة وزارة الداخلية في هذا التاريخ تذكر لملف الزواج: شهادة ميلاد لأقل من ثلاثة أشهر، شهادة إقامة أحد الزوجين، شهادة طبية للزوجين، وبطاقتا تعريف الشاهدين. أكّد القائمة في البلدية.",
      fr: "La page du ministère de l'Intérieur à cette date cite, pour le mariage : un acte de naissance de moins de trois mois, un certificat de résidence, un certificat médical, et les cartes des témoins. Confirmez à la commune.",
    },
  },
  {
    paths: ["succession"],
    url: "http://interieur.gov.dz/2024/02/29/%D8%A7%D9%84%D8%AD%D8%A7%D9%84%D8%A9-%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A%D8%A9/",
    date: "2024-02-29",
    text: {
      ar: "الصفحة نفسها تقول: التصريح بالوفاة في بلدية مكان الوفاة. يجوز تقديم شهادة طبية للوفاة أو شهادة من ضابط الشرطة، والدفتر العائلي، وعند الاقتضاء مستخرج شهادة ميلاد المتوفى.",
      fr: "La même page dit : la déclaration de décès se fait à la commune du lieu du décès. On peut présenter un certificat médical ou un certificat de police, le livret de famille et, au besoin, un extrait de naissance du défunt.",
    },
  },
];

export function identify(text: string): Paper | null {
  const hay = text.toLowerCase();
  let best: { paper: Paper; score: number } | null = null;
  for (const paper of papers) {
    let score = 0;
    for (const word of paper.keywords) {
      if (hay.includes(word.toLowerCase())) score += word.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { paper, score };
  }
  if (!best || best.score < 6) return null;
  return best.paper;
}

export function stillNeeded(pathIds: string[], have: (string | null)[]): Paper[] {
  const got = new Set(have.filter(Boolean));
  return papers.filter((paper) => paper.paths.some((id) => pathIds.includes(id)) && !got.has(paper.id)).slice(0, 4);
}
