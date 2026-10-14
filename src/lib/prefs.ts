import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Lang } from "@/data/types";

type Prefs = {
  lang: Lang;
  wilayaId: string;
  branch: Record<string, string>;
  ground: Record<string, string>;
  step: Record<string, number>;
  checks: Record<string, boolean>;
  seenNote: boolean;
  setLang: (lang: Lang) => void;
  setWilaya: (id: string) => void;
  setBranch: (caseId: string, option: string) => void;
  setGround: (caseId: string, groundId: string) => void;
  setStep: (caseId: string, n: number) => void;
  toggleCheck: (key: string) => void;
  dismissNote: () => void;
};

export const usePrefs = create<Prefs>()(
  persist(
    (set) => ({
      lang: "ar",
      wilayaId: "",
      branch: {},
      ground: {},
      step: {},
      checks: {},
      seenNote: false,
      setLang: (lang) => set({ lang }),
      setWilaya: (wilayaId) => set({ wilayaId }),
      setBranch: (caseId, option) =>
        set((s) => ({
          branch: { ...s.branch, [caseId]: option },
          step: { ...s.step, [caseId]: 0 },
        })),
      setGround: (caseId, groundId) =>
        set((s) => ({ ground: { ...s.ground, [caseId]: groundId } })),
      setStep: (caseId, n) => set((s) => ({ step: { ...s.step, [caseId]: n } })),
      toggleCheck: (key) => set((s) => ({ checks: { ...s.checks, [key]: !s.checks[key] } })),
      dismissNote: () => set({ seenNote: true }),
    }),
    {
      name: "mizan",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
