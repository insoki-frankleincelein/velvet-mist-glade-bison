export type Lang = "ar" | "fr";

export type L = { ar: string; fr: string };

export type GroupId = "family" | "work" | "civil" | "housing" | "penal" | "papers";

export type Article = {
  id: string;
  codeId: string;
  num: string;
  heading: L;
  text: L;
  source: L;
  /** True only when `text.ar` is the published wording, not a classroom paraphrase. */
  verbatim: boolean;
};

export type CodeMeta = {
  id: string;
  name: L;
  instrument: L;
};

export type CheckItem = { id: string; label: L };

export type Step = {
  id: string;
  title: L;
  where: L;
  actions: L[];
  bring?: CheckItem[];
  articleIds: string[];
  caution?: L;
  delay?: L;
  /** If set, the step appears only for these branch ids. */
  when?: string[];
  skeleton?: boolean;
  grounds?: boolean;
};

export type Choice = { id: string; label: L; detail: L };

export type CaseGuide = {
  id: string;
  group: GroupId;
  title: L;
  lead: L;
  forum: L;
  choice?: { question: L; options: Choice[] };
  steps: Step[];
  articleIds: string[];
};

export type Ground = { id: string; label: L; proof: L };
