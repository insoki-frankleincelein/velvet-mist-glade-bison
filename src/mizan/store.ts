import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { classify } from "./engine/classify";
import type { Cost, IntakeQuestion, L, LegalRef, Step } from "./schema";
import type { LawReading, SavedPaper } from "./papers";

export type Office = {
  id: string;
  name: string;
  bar: string;
  wilayaId: string;
  specialty: string;
  languages: string;
  phone: string;
  whatsapp: string;
  price: Cost;
};

export type GuideCase = {
  id: string;
  story: string;
  paths: string[];
  questions: IntakeQuestion[];
  ladder: Step[];
  checklist: { id: string; label: L }[];
  understood: L;
  answers: Record<string, string>;
  phase: "review" | "questions" | "missions" | "done";
  qIndex: number;
  missionIndex: number;
  checks: Record<string, boolean>;
  papers: SavedPaper[];
  updatedAt: string;
};

type Guide = {
  theme: "light" | "dark";
  seed: string | null;
  pendingPapers: SavedPaper[];
  readings: LawReading[];
  activeId: string | null;
  cases: GuideCase[];
  articles: LegalRef[];
  offices: Office[];
  setTheme: (theme: "light" | "dark") => void;
  arm: (id: string) => void;
  addPaper: (paper: SavedPaper) => void;
  addReading: (reading: LawReading) => void;
  startCase: (story: string, wilayaId: string, seed?: string | null) => void;
  answer: (text: string) => void;
  backQuestion: () => void;
  acceptReview: () => void;
  rewrite: () => void;
  toggleCheck: (id: string) => void;
  nextMission: () => void;
  prevMission: () => void;
  openCase: (id: string) => void;
  addArticles: (rows: LegalRef[]) => void;
  addOffice: (office: Office) => void;
  removeOffice: (id: string) => void;
  wipe: () => void;
};

export const useGuide = create<Guide>()(
  persist(
    (set, get) => ({
      theme: "light",
      seed: null,
      pendingPapers: [],
      readings: [],
      activeId: null,
      cases: [],
      articles: [],
      offices: [],
      setTheme: (theme) => set({ theme }),
      arm: (id) => set({ seed: id }),
      addPaper: (paper) => {
        const active = get().activeId;
        if (!active) {
          set((s) => ({ pendingPapers: [paper, ...s.pendingPapers].slice(0, 12) }));
          return;
        }
        set((s) => ({
          cases: s.cases.map((c) => (c.id === active ? { ...c, papers: [paper, ...(c.papers ?? []),].slice(0, 12) } : c)),
        }));
      },
      addReading: (reading) => set((s) => ({ readings: [reading, ...s.readings].slice(0, 8) })),
      startCase: (story, wilayaId, seed) => {
        const pending = get().pendingPapers;
        const memory = [story.trim(), ...pending.map((paper) => paper.excerpt)].filter(Boolean).join("\n");
        const brief = classify(memory, wilayaId, seed);
        const file: GuideCase = {
          id: crypto.randomUUID(),
          story: story.trim(),
          paths: brief.paths,
          questions: brief.questions,
          ladder: brief.ladder,
          checklist: brief.checklist,
          understood: brief.understood,
          answers: {},
          phase: "review",
          qIndex: 0,
          missionIndex: 0,
          checks: {},
          papers: pending,
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ activeId: file.id, pendingPapers: [], cases: [file, ...s.cases].slice(0, 12) }));
      },
      acceptReview: () =>
        set((s) => ({
          cases: s.cases.map((c) =>
            c.id === s.activeId ? { ...c, phase: c.questions.length ? "questions" : "missions", updatedAt: new Date().toISOString() } : c,
          ),
        })),
      rewrite: () => set((s) => ({ activeId: null })),
      answer: (text) =>
        set((s) => ({
          cases: s.cases.map((c) => {
            if (c.id !== s.activeId || c.phase !== "questions") return c;
            const q = c.questions[c.qIndex];
            const answers = { ...c.answers, [q.id]: text.trim() || "—" };
            const last = c.qIndex + 1 >= c.questions.length;
            return {
              ...c,
              answers,
              qIndex: last ? c.qIndex : c.qIndex + 1,
              phase: last ? "missions" : "questions",
              updatedAt: new Date().toISOString(),
            };
          }),
        })),
      backQuestion: () =>
        set((s) => ({
          cases: s.cases.map((c) => {
            if (c.id !== s.activeId) return c;
            if (c.phase === "questions" && c.qIndex > 0) return { ...c, qIndex: c.qIndex - 1 };
            if (c.phase === "questions") return { ...c, phase: "review" };
            return c;
          }),
        })),
      toggleCheck: (id) =>
        set((s) => ({
          cases: s.cases.map((c) =>
            c.id === s.activeId ? { ...c, checks: { ...c.checks, [id]: !c.checks[id] } } : c,
          ),
        })),
      nextMission: () =>
        set((s) => ({
          cases: s.cases.map((c) => {
            if (c.id !== s.activeId || c.phase !== "missions") return c;
            const last = c.missionIndex + 1 >= c.ladder.length;
            return {
              ...c,
              missionIndex: last ? c.missionIndex : c.missionIndex + 1,
              phase: last ? "done" : "missions",
              updatedAt: new Date().toISOString(),
            };
          }),
        })),
      prevMission: () =>
        set((s) => ({
          cases: s.cases.map((c) => {
            if (c.id !== s.activeId) return c;
            if (c.phase === "done") return { ...c, phase: "missions" };
            if (c.phase === "missions" && c.missionIndex > 0) return { ...c, missionIndex: c.missionIndex - 1 };
            if (c.phase === "missions") return { ...c, phase: "questions", qIndex: Math.max(0, c.questions.length - 1) };
            return c;
          }),
        })),
      openCase: (id) => set({ activeId: id }),
      addArticles: (rows) => set((s) => ({ articles: rows })),
      addOffice: (office) => set((s) => ({ offices: [office, ...s.offices] })),
      removeOffice: (id) => set((s) => ({ offices: s.offices.filter((o) => o.id !== id) })),
      wipe: () => set({ activeId: null, cases: [], articles: [], offices: [], pendingPapers: [], readings: [] }),
    }),
    {
      name: "mizan-guide",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        theme: s.theme,
        activeId: s.activeId,
        cases: s.cases,
        articles: s.articles,
        offices: s.offices,
        pendingPapers: s.pendingPapers,
        readings: s.readings,
      }),
    },
  ),
);

export function activeCase(cases: GuideCase[], id: string | null) {
  return cases.find((c) => c.id === id) ?? null;
}
