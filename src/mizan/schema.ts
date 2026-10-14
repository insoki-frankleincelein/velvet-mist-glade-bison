/** Mizan domain contract. Stack-agnostic: web preview now, Expo later if you approve. */

export const STATUSES = ["PUBLISHED", "GUIDED", "TO_VERIFY"] as const;
export type Status = (typeof STATUSES)[number];

export const RUNGS = ["emergency", "main", "pressure", "unblock"] as const;
export type Rung = (typeof RUNGS)[number];

export type L = { ar: string; fr: string };
export type L3 = L & { darija: string | null };

export type LegalRef = {
  code: string | null;
  number: string | null;
  arabic_text: string;
  french_working_translation: string;
  status: Status;
  source_url: string | null;
  publication_date: string | null;
};

export type Cost = {
  kind: "RANGE" | "ASK_DEVIS";
  min_da: number | null;
  max_da: number | null;
  currency: "DZD";
  last_updated: string | null;
  source: string | null;
};

export type Deadline = {
  status: Status;
  days: number | null;
  text: L | null;
};

export type Step = {
  id: string;
  rung: Rung;
  urgent: boolean;
  title: L3;
  where: L;
  file: L;
  bring: { id: string; label: L }[];
  deadline: Deadline;
  cost: Cost;
  articles: LegalRef[];
  risks: L;
  /** One sentence. */
  next_action: L;
  /** Darija tip. Never a statute. */
  tip_darija: string | null;
  do_not: L[];
};

export type PathDef = {
  id: string;
  status: Status;
  title: L3;
  lead: L;
  steps: Step[];
};

export type CatalogEntry = {
  id: string;
  status: Status;
  title: L3;
  /** Why this card exists. No article numbers. */
  note: L;
};

export type IntakeQuestion = {
  id: string;
  rank: number;
  prompt: L;
  /** What strategy changes if the answer changes. */
  changes: L;
};

export type Extract = {
  parties: L;
  asset: L;
  opponent_did: L;
  duration: L;
  proceedings: L;
  documents_have: L[];
  documents_unknown: L[];
  wilaya: string | null;
  urgency: L;
};

export type WorkedCase = {
  id: string;
  story: string;
  extract: Extract;
  /** Never empty. `open-file` is the floor. */
  paths: string[];
  questions: IntakeQuestion[];
  ladder: Step[];
  checklist: { id: string; label: L }[];
};

export const ASK_DEVIS: Cost = {
  kind: "ASK_DEVIS",
  min_da: null,
  max_da: null,
  currency: "DZD",
  last_updated: null,
  source: null,
};

export const CONFIRM_DEADLINE: Deadline = {
  status: "TO_VERIFY",
  days: null,
  text: {
    ar: "الأجل غير مثبت. أكّده عند أمانة الضبط قبل الإيداع.",
    fr: "Délai non établi. Confirmez-le au greffe avant de déposer.",
  },
};

const ARTICLE_NUM = /المادة\s*\d|art(?:icle)?\.?\s*\d|\bم\s*\d{2,}/i;

export function assertNoInventedCitation(value: unknown, path = "$"): void {
  if (typeof value === "string") {
    if (ARTICLE_NUM.test(value)) {
      throw new Error(`Invented or unsourced article mark at ${path}: ${value.slice(0, 80)}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => assertNoInventedCitation(item, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      assertNoInventedCitation(child, `${path}.${key}`);
    }
  }
}

export function assertLegalRef(ref: LegalRef, path: string): void {
  if (!STATUSES.includes(ref.status)) throw new Error(`${path} bad status`);
  if (ref.status !== "PUBLISHED") {
    if (ref.number) throw new Error(`${path} article number without PUBLISHED source`);
    if (ref.arabic_text.trim()) throw new Error(`${path} statute text without PUBLISHED source`);
    return;
  }
  if (!ref.number || !ref.arabic_text.trim() || !ref.source_url || !ref.publication_date) {
    throw new Error(`${path} PUBLISHED requires number, arabic text, source_url, publication_date`);
  }
}

export function assertCost(cost: Cost, path: string): void {
  if (cost.kind === "ASK_DEVIS") {
    if (cost.min_da != null || cost.max_da != null) throw new Error(`${path} devis must not carry a price`);
    return;
  }
  if (cost.min_da == null || cost.max_da == null || !cost.last_updated || !cost.source) {
    throw new Error(`${path} RANGE needs min, max, last_updated, source`);
  }
}

export function assertStep(step: Step, path: string): void {
  if (!RUNGS.includes(step.rung)) throw new Error(`${path} bad rung`);
  if (!step.next_action.ar || step.next_action.ar.length > 280) {
    throw new Error(`${path} next_action must be one short sentence`);
  }
  assertCost(step.cost, `${path}.cost`);
  if (step.deadline.days != null && step.deadline.status !== "PUBLISHED") {
    throw new Error(`${path} deadline number without PUBLISHED source`);
  }
  step.articles.forEach((a, i) => assertLegalRef(a, `${path}.articles[${i}]`));
  assertNoInventedCitation(
    {
      title: step.title,
      where: step.where,
      file: step.file,
      bring: step.bring,
      risks: step.risks,
      next_action: step.next_action,
      tip_darija: step.tip_darija,
      do_not: step.do_not,
      deadline: step.deadline.text,
    },
    path,
  );
}

/** A query always gets a path. */
export function ensurePaths(ids: string[]): string[] {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return ["open-file"];
  return unique;
}
